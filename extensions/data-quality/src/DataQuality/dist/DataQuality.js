import { jsxs as l, Fragment as me, jsx as r } from "react/jsx-runtime";
import { useState as C, useRef as O, useEffect as H, useLayoutEffect as Rt, useMemo as ye, useCallback as qn, useSyncExternalStore as Fi, useId as lt, createContext as ml, useContext as gl, Fragment as xi } from "react";
import { useKeySequence as bl, EntityReferenceMultiSelector as Qn, SortableList as ho, TagBadge as yl, EntityReferenceSelector as ks, EntityDetailTabs as wl, DetailListToolbar as ra, PERFORMER_CRITERIA as Pi, AUDIO_CRITERIA as po, VIDEO_CRITERIA as Li, NarrativeText as vl, AUDIO_SORT_OPTIONS as Nl, VIDEO_SORT_OPTIONS as mo, AudioPlayer as ql, VideoPlayer as go, formatDuration as bo, FilterDialog as Sl, getResolutionLabel as El, ConfirmDialog as kl, TAG_CRITERIA as Cl, TAG_SORT_OPTIONS as Al, TagTile as Tl, VideoCard as Il } from "@cove/runtime/components";
import { Search as ca, Flag as Mn, Check as Ga, Pencil as Pr, Ban as xa, Pin as Di, Plus as _i, GripVertical as yo, AlertTriangle as $n, Copy as wo, Trash2 as ji, ChevronDown as vo, X as la, Mic as Rl, Users as No, Tag as qo, Headphones as So, Film as Ka, ChevronLeft as da, MoreHorizontal as $l, RectangleHorizontal as Ol, LayoutGrid as Ui, ChevronRight as Eo, Save as Ml, RotateCcw as Fl, Layers as Cs, Undo2 as xl, RefreshCw as Pl, ExternalLink as ko, SkipForward as Ll, Upload as Dl, Download as Co, ArrowUp as _l, ArrowDown as jl, Loader2 as Ul, List as Gl, Grid3X3 as Kl } from "@cove/runtime/lucide-react";
import { extensionFetch as Bl } from "@cove/runtime/api";
const Gi = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, Ki = Object.keys(
  Gi
);
function aa(e) {
  return e === "excludes" || e === "excludesAll";
}
function Bi(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
function Ao(e) {
  const t = [...e.performerFlags ?? []];
  for (const n of e.flagPerformerTagIds ?? [])
    t.some((a) => a.tagId === n && a.categoryTagId === void 0) || t.push({ tagId: n });
  return t;
}
function Vl(e, t) {
  const { performerFlags: n, flagPerformerTagIds: a, ...i } = e, s = [];
  for (const o of t)
    s.some(
      (c) => c.tagId === o.tagId && c.categoryTagId === o.categoryTagId
    ) || s.push(
      o.categoryTagId === void 0 ? { tagId: o.tagId } : { tagId: o.tagId, categoryTagId: o.categoryTagId }
    );
  return s.length ? { ...i, performerFlags: s } : i;
}
const To = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Ie(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function Vi(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function je(e) {
  return Vi(_e(e));
}
function Jl(e) {
  return _e(e) === "video";
}
function _e(e) {
  return e.entityType ?? "video";
}
const Jn = [
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
  Jn.slice(0, 11),
  Jn.slice(11, 22),
  Jn.slice(22)
], zn = "none";
function pr(e) {
  return typeof e == "string" && Jn.includes(e);
}
function Ji(e) {
  const t = e.shortcut;
  return pr(t) || t === zn ? t : "auto";
}
function Io(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), i = [];
  e.forEach((o, c) => {
    const d = Ji(o);
    if (d !== zn) {
      if (d !== "auto") {
        if (!n.has(d)) {
          n.set(d, c), t[c] = d;
          return;
        }
        a.add(c);
      }
      i.push(c);
    }
  });
  const s = Jn.filter((o) => !n.has(o));
  return i.forEach((o, c) => {
    const d = s[c];
    d !== void 0 && (t[o] = d, n.set(d, o));
  }), { keys: t, actionOn: n, duplicatePins: a };
}
function zl(e, t, n) {
  const { keys: a, actionOn: i } = Io(e), s = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (pr(n)) {
    const c = i.get(n), d = a[t];
    c !== void 0 && c !== t && s.set(c, d && e[t].shortcut === d ? d : void 0);
  }
  const o = new Set([...s.values()].filter(pr));
  return e.map((c, d) => {
    const p = s.has(d) ? s.get(d) : pr(c.shortcut) && o.has(c.shortcut) ? void 0 : c.shortcut;
    if (p === c.shortcut) return c;
    const { shortcut: u, ...m } = c;
    return p === void 0 ? m : { ...m, shortcut: p };
  });
}
function sa(e) {
  return Ie(e) && !Ro(e.occurrence) ? "Complete the optional occurrence condition before saving." : !Jl(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : _e(e) !== "tag" && e.actions.some(
    (t) => zi(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => Fn(t, _e(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const Wl = {
  video: 1e3,
  audio: 250
};
function Ut(e, t = "video") {
  const n = (a, i) => Number.isFinite(Number(a)) && Number(a) > 0 ? Math.floor(Number(a)) : i;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(Wl[t], n(e.perPage, 40))
    )
  };
}
function As(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function Vn(e) {
  const { page: t, ...n } = e.view.filter, a = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Ie(e) ? [e.entityType, ...a, e.occurrence] : _e(e) === "video" ? a : [_e(e), ...a]
  );
}
function Fn(e, t) {
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
    ].includes(a.mode) && a.tagIds.length > 0 && a.tagIds.every((i) => Number.isSafeInteger(i) && i > 0)
  ) && !zi(e) : !1;
}
function Ql(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function On(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function Hn(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function pi(e) {
  return "steps" in e && e.steps.length > 0;
}
function Wn(e) {
  return "steps" in e ? e.steps.some((t) => On(t.mode)) : !1;
}
function zi(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (On(n.mode))
      for (const a of n.tagIds) {
        const i = t.get(a);
        if (i && i !== n.mode) return !0;
        t.set(a, n.mode);
      }
  return !1;
}
function ua(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || To.includes(n.entityType)) && (!Ql(n.entityType) || Ro(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && Hl(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (a) => typeof a == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (a) => typeof (a == null ? void 0 : a.id) == "string" && typeof a.label == "string" && (a.shortcut === void 0 || typeof a.shortcut == "string") && (n.entityType === "tag" ? "effect" in a && !("steps" in a) && !("group" in a) && Fn(a, "tag") : "steps" in a && !("effect" in a) && Array.isArray(a.steps) && a.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && (a.group === void 0 || typeof a.group == "string") && Fn(a, "video"))
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
function Hl(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (a) => ["date", "studio", "performers", "tags"].includes(a)
  )) && [n.annotationParents, n.binParents].every(
    (a) => a === void 0 || Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function mi(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const a of e)
    for (const i of a)
      n.has(i.id) || (n.add(i.id), t.push(i));
  return t;
}
function Yl(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), a = new Set(t.map((c) => n(c.name))), i = e.trim(), s = i.replace(/ copy(?: \d+)?$/i, ""), o = `${s !== i && a.has(n(s)) ? s : i} copy`;
  for (let c = 1; ; c++) {
    const d = c === 1 ? o : `${o} ${c}`;
    if (!a.has(n(d))) return d;
  }
}
function Xl(e, t, n) {
  return { ...structuredClone(e), id: n, name: Yl(e.name, t) };
}
function Ro(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (a) => Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(a).size === a.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && Ki.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || Zl(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function Zl(e) {
  if (!Array.isArray(e)) return !1;
  const t = (a) => Number.isSafeInteger(a) && a > 0, n = /* @__PURE__ */ new Set();
  return e.every((a) => {
    if (!a || typeof a != "object" || Array.isArray(a)) return !1;
    const { tagId: i, categoryTagId: s } = a;
    if (!t(i) || s !== void 0 && !t(s))
      return !1;
    const o = `${i}:${s ?? ""}`;
    return n.has(o) ? !1 : (n.add(o), !0);
  });
}
function Ts(e, t) {
  return e.size > 0 ? [...e].sort((n, a) => n - a) : t == null ? [] : [t];
}
function Is(e, t, n, a) {
  if (t.length === 0) return null;
  if (n == null) return t[0];
  if (!a && t.includes(n)) return n;
  const i = Math.max(0, e.indexOf(n));
  if (a) {
    for (const s of e.slice(i + 1))
      if (t.includes(s)) return s;
    if (t.includes(n)) {
      for (const s of e.slice(0, i).reverse())
        if (t.includes(s)) return s;
      return n;
    }
  }
  return t[Math.min(i, t.length - 1)];
}
function ed(e, t) {
  const n = new Set(e), a = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    a ? n.delete(i) : n.add(i);
  return n;
}
function td(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function nd(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function rd(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function ad(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function id(e, t) {
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
const $o = "ext:com.midnightrider.data-quality:configuration", sd = "ext:cove-data-quality:video-reviews", gi = "ext:com.midnightrider.data-quality:progress";
class Oo extends Error {
}
const fa = /* @__PURE__ */ new Map(), Aa = /* @__PURE__ */ new Map(), ur = (e, t) => e.includes("*") || e.includes(t), Pa = (e) => de(`/api/savedfilters?mode=${encodeURIComponent(e)}`), od = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function bi(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function $r(e) {
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
    reviews: ua(JSON.stringify(t.reviews)),
    deletedIds: bi(t.deletedIds),
    importedIds: bi(t.importedIds)
  };
}
function cd(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const a = /* @__PURE__ */ new Set();
  for (const i of t) {
    const s = localStorage.getItem(i);
    if (s !== null) {
      const o = ua(s);
      n ?? (n = o), o.forEach((c) => a.add(c.id));
    }
    bi(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((o) => a.add(o));
  }
  return {
    reviews: n ?? [],
    known: [...a],
    present: n !== void 0
  };
}
async function Mo(e) {
  const t = await de("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Wi(e, t) {
  const n = (Aa.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Aa.set(e, n), n.finally(() => {
    Aa.get(e) === n && Aa.delete(e);
  }).catch(() => {
  }), n;
}
let Xr = null;
function ld() {
  if (Xr) return Xr;
  const e = dd();
  return Xr = e, e.finally(() => {
    Xr === e && (Xr = null);
  }).catch(() => {
  }), e;
}
async function dd() {
  const e = await de("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return Wi(t, () => ud(e, t));
}
async function ud(e, t) {
  var b;
  const n = String(e.user.id), a = ur(e.permissions, "savedfilters.read"), i = a && ur(e.permissions, "savedfilters.write"), s = a ? (await Pa($o)).filter((g) => g.name === "Data Quality configuration").sort((g, y) => g.id - y.id) : [];
  if (s.length > 1) {
    const g = (y) => {
      const { revision: N, ...q } = $r(y.uiOptions);
      return JSON.stringify(q);
    };
    if (s.some((y) => g(y) !== g(s[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (i)
      for (const y of s.slice(1))
        await de(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    s.splice(1);
  }
  let o = s.length ? $r(s[0].uiOptions) : od();
  const c = localStorage.getItem(`${t}:migrated`) === "true", d = localStorage.getItem(t), p = localStorage.getItem(`${t}:local-only`) === "true";
  !s.length && d && (o = $r(d));
  let u = !s.length;
  if (s.length && p && d) {
    const g = $r(d);
    if (g.reviews.some((N) => {
      const q = o.reviews.find((w) => w.id === N.id);
      return q && JSON.stringify(q) !== JSON.stringify(N);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const y = [
      .../* @__PURE__ */ new Set([...o.deletedIds, ...g.deletedIds])
    ];
    o = {
      ...o,
      reviews: mi(o.reviews, g.reviews).filter(
        (N) => !y.includes(N.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...o.importedIds, ...g.importedIds])
      ]
    }, u = !0;
  }
  if (!c) {
    const g = JSON.stringify(o), y = cd(n);
    if (s.length && y.reviews.some((I) => {
      const M = o.reviews.find((j) => j.id === I.id);
      return M && JSON.stringify(M) !== JSON.stringify(I);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = a ? (await Pa(sd)).flatMap(
      (I) => ua(I.uiOptions ?? "[]")
    ) : [], q = y.known.filter(
      (I) => !y.reviews.some((M) => M.id === I)
    ), w = /* @__PURE__ */ new Set([...o.deletedIds, ...q]);
    o = {
      ...o,
      reviews: mi(
        y.reviews,
        o.reviews,
        N.filter(
          (I) => !y.known.includes(I.id) && !o.importedIds.includes(I.id)
        )
      ).filter((I) => !w.has(I.id)),
      deletedIds: [...w],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...o.importedIds,
          ...y.known,
          ...N.map((I) => I.id)
        ])
      ]
    }, u || (u = JSON.stringify(o) !== g);
  }
  const m = {
    userId: n,
    recordId: (b = s[0]) == null ? void 0 : b.id,
    config: o,
    readable: a,
    writable: i,
    durable: i
  };
  if (fa.set(t, m), u && i) {
    const g = o;
    s.length && (m.config = $r(s[0].uiOptions)), await Fo(t, g), o = m.config;
  } else s.length || (localStorage.setItem(t, JSON.stringify(o)), !a && (!c || p) && localStorage.setItem(`${t}:local-only`, "true"));
  if (!a) localStorage.setItem(`${t}:migrated`, "true");
  else if (i)
    try {
      localStorage.setItem(`${t}:migrated`, "true");
    } catch {
    }
  return {
    reviews: o.reviews,
    storageKey: t,
    canWrite: ur(e.permissions, "videos.write"),
    canWriteVideos: ur(e.permissions, "videos.write"),
    canWriteAudios: ur(e.permissions, "audios.write"),
    canWriteTags: ur(e.permissions, "tags.write"),
    canReadTagGroups: ur(e.permissions, "taggroups.read"),
    canConfigure: !a || i,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: a ? i ? "account" : "readOnly" : "browser",
    storageNotice: a ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Fo(e, t) {
  const n = fa.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const a = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await Mo(n), n.recordId != null) {
      const s = await de(
        `/api/savedfilters/${n.recordId}`
      );
      if ($r(s.uiOptions).revision !== n.config.revision)
        throw new Oo(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await de(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: $o,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(a)
        })
      }
    );
    n.recordId = i.id;
  } else
    localStorage.setItem(e, JSON.stringify(a)), localStorage.setItem(`${e}:local-only`, "true");
  if (n.config = a, n.durable)
    try {
      localStorage.setItem(e, JSON.stringify(a)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function fd(e, t) {
  return Wi(e, async () => {
    const n = fa.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const a = n.config.reviews, i = t(a);
    if (i === a) return a;
    ua(JSON.stringify(i));
    const s = a.filter((o) => !i.some((c) => c.id === o.id)).map((o) => o.id);
    return await Fo(e, {
      ...n.config,
      reviews: i,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...s])
      ].filter((o) => !i.some((c) => c.id === o))
    }), i;
  });
}
function Rs(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, a]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(a)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function hd(e, t) {
  const n = fa.get(e);
  if (!n) return null;
  const a = localStorage.getItem(`${e}:progress:${t}`), i = a ? Rs(a) : null;
  if (!n.readable) return i;
  const s = (await Pa(gi)).find(
    (c) => c.name === t
  ), o = s ? Rs(s.uiOptions) : null;
  return i && (!o || i.updatedAt > o.updatedAt) ? i : o;
}
function pd(e, t, n) {
  const a = `${e}:progress:${t}`;
  try {
    localStorage.setItem(a, JSON.stringify(n));
  } catch {
  }
  return Wi(a, async () => {
    const i = fa.get(e);
    if (!(i != null && i.writable)) return;
    await Mo(i);
    const s = (await Pa(gi)).find(
      (o) => o.name === t
    );
    await de(
      s ? `/api/savedfilters/${s.id}` : "/api/savedfilters",
      {
        method: s ? "PUT" : "POST",
        body: JSON.stringify({
          mode: gi,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function Yn(e) {
  return e === "audio" ? "audios" : "videos";
}
const md = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function En(e) {
  return md[e];
}
const La = "confirmed_absent_tags", Qi = "Confirmed absent tags", Ba = "confirmed_absent_occurrence_tags", xo = {
  key: La,
  label: Qi,
  type: "tag",
  subject: "tag assessments"
}, Hi = {
  key: Ba,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, gd = {
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
function xn(e) {
  return Array.isArray(e) ? e.map(xn) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? gd[n] ?? n : t === "key" && typeof n == "string" && [
        La,
        Ba
      ].includes(n.toLowerCase()) ? n.toLowerCase() : xn(n)
    ])
  ) : e;
}
async function Po(e, t, n) {
  const a = new Headers(t.headers);
  !(t.body instanceof FormData) && !a.has("Content-Type") && a.set("Content-Type", "application/json");
  const i = await Bl(e, { ...t, headers: a });
  if (i.status === 404 && n === "null") return null;
  if (!i.ok) {
    let o = i.statusText || `Request failed (${i.status}).`;
    try {
      const c = await i.json();
      o = c.message || c.detail || c.error || o;
    } catch {
    }
    throw new Error(o);
  }
  if (i.status === 204 || i.status === 205) return;
  const s = await i.text();
  return s ? JSON.parse(s) : void 0;
}
async function de(e, t = {}) {
  return await Po(e, t, "fail");
}
function bd(e, t = {}) {
  return Po(e, t, "null");
}
const yd = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let wd = 0;
function yi(e, t) {
  return de(
    `/api/${Yn(e)}/${t}?dqRead=${yd}-${++wd}`,
    { cache: "no-store" }
  );
}
function Lo(e, t) {
  const n = { ...e.view.objectFilter }, a = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    xn({
      findFilter: Ut(t, je(e)),
      objectFilter: n,
      filterExpression: a
    })
  );
}
async function ta(e, t, n) {
  return de(
    `/api/${Yn(je(e))}/find`,
    { method: "POST", signal: n, body: Lo(e, t) }
  );
}
async function vd(e, t, n) {
  return (await de(
    `/api/${Yn(je(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Lo(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function $s(e, t, n) {
  const a = { ...e.view.objectFilter };
  return delete a._filterExpression, de("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      xn({
        findFilter: Ut(t),
        objectFilter: a
      })
    )
  });
}
function Nd(e) {
  return de("/api/taggroups", { signal: e });
}
function wi(e, t, n = 1280) {
  return `/api/${Yn(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function vi(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Os(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function qd(e) {
  return `/api/stream/video/${e}/preview`;
}
function Sd(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Ed(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Va(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e) {
    await de(`/api/tags/${a}`, { signal: t }), n.add(a);
    for (let i = 1; ; i++) {
      const s = await de("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          xn({
            findFilter: { page: i, perPage: 1e3, sort: "id", direction: "asc" },
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
      for (const o of s.items) n.add(o.id);
      if (i * 1e3 >= s.totalCount) break;
      if (!s.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...n];
}
async function Yi(e, t) {
  const n = Hn(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await Va(i.tagIds, t)).filter(
          (s) => !n.has(s)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function kd(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function Xi(e, t) {
  const a = (await de("/api/custom-fields")).find(
    (s) => s.key.toLowerCase() === e.key
  );
  if (!a)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = kd(e, a);
  return i ? { kind: "incompatible", message: i } : a.entityTypes.includes(t) ? { kind: "ready", definition: a, message: "" } : {
    kind: "missing",
    message: `Add ${En(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: a
  };
}
async function Do(e, t) {
  const n = await Xi(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await de(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await de("/api/custom-fields", {
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
function _o(e = "video") {
  return Xi(xo, e);
}
function Cd(e = "video") {
  return Do(xo, e);
}
function jo(e = "video") {
  return Xi(Hi, e);
}
function Ad(e = "video") {
  return Do(Hi, e);
}
function Da(e) {
  return [...new Set(e)];
}
function Uo(e, t) {
  const n = e.customFields ?? {}, a = Object.keys(n).find(
    (s) => s.toLowerCase() === Ba
  ), i = a === void 0 ? [] : n[a];
  return Da(
    (Array.isArray(i) ? i : []).filter(
      (s) => typeof s == "string" && /^[1-9]\d*:[1-9]\d*$/.test(s)
    ).map((s) => s.split(":").map(Number)).filter(([s]) => s === t).map(([, s]) => s)
  );
}
async function Td(e) {
  let t;
  try {
    t = await jo(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${Hi.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Id(e, t, n, a, i, s) {
  await de(`/api/${Yn(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: Da(i).map((o) => `${a}:${o}`)
      },
      customFieldMode: s
    })
  });
}
function Rd(e, t, n) {
  const a = [...e.tagIds], i = (s) => {
    if (n === null)
      throw new Error(
        `The ${Qi} custom field is not available.`
      );
    return { customFields: { [n]: a }, customFieldMode: s };
  };
  switch (e.mode) {
    case "ADD":
      return { ids: t, tagIds: a, tagMode: "ADD" };
    case "REMOVE":
    case "REMOVE_TREE":
      return { ids: t, tagIds: a, tagMode: "REMOVE" };
    case "MARK_PRESENT":
      return { ids: t, tagIds: a, tagMode: "ADD", ...i("REMOVE") };
    case "MARK_ABSENT":
      return { ids: t, tagIds: a, tagMode: "REMOVE", ...i("ADD") };
    case "CLEAR_ABSENCE":
      return { ids: t, ...i("REMOVE") };
  }
}
async function Go(e, t, n) {
  if (!Fn(t) || n.length === 0 || n.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${En(e).many} and configure a valid action first.`
    );
  let a = null;
  if (Wn(t)) {
    let d;
    try {
      d = await _o(e);
    } catch (p) {
      throw new Error(
        `Could not verify the ${Qi} custom field. ${p instanceof Error ? p.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    a = d.definition.key;
  }
  const i = Da(n), s = (await Yi(t)).map((d) => ({
    mode: d.mode,
    tagIds: Da(d.tagIds)
  })), c = [
    ...s.filter((d) => !On(d.mode)),
    ...s.filter((d) => On(d.mode))
  ].map(
    (d) => Rd(d, i, a)
  );
  for (let d = 0; d < c.length; d++)
    try {
      await de(`/api/${Yn(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(c[d])
      });
    } catch (p) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${En(e).many} before retrying. ${p instanceof Error ? p.message : "Request failed."}`
      );
    }
}
async function $d(e, t) {
  if (!Fn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await de("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const Ta = (e) => e >= "0" && e <= "9";
function Ms(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function Fs(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, a = 0;
  for (; n < e.length && a < t.length; ) {
    if (Ta(e[n]) && Ta(t[a])) {
      const c = n, d = a;
      for (; n < e.length && Ta(e[n]); ) n++;
      for (; a < t.length && Ta(t[a]); ) a++;
      const p = e.slice(c, n).replace(/^0+/, ""), u = t.slice(d, a).replace(/^0+/, "");
      if (p.length !== u.length) return p.length < u.length ? -1 : 1;
      if (p !== u) return p < u ? -1 : 1;
      continue;
    }
    const s = Ms(e[n]), o = Ms(t[a]);
    if (s !== o) return s < o ? -1 : 1;
    n++, a++;
  }
  const i = e.length - n - (t.length - a);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function Ko(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, a = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(a(e) - a(t)) || Fs(e.tagGroupName, t.tagGroupName) || Fs(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function mr(e) {
  return [...e].sort(Ko);
}
function Od(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const a of n.steps)
        a.mode === "REMOVE_TREE" && a.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function Zi(e, t, n) {
  const a = Hn(e), i = [], s = [];
  for (const b of e.steps) {
    if (b.mode !== "REMOVE_TREE") {
      s.push(b);
      continue;
    }
    const g = b.tagIds.flatMap((y) => {
      const N = n.get(y);
      return N || i.push(y), N ?? [y];
    });
    s.push({ mode: "REMOVE", tagIds: g.filter((y) => !a.has(y)) });
  }
  const o = [
    ...s.filter((b) => !On(b.mode)),
    ...s.filter((b) => On(b.mode))
  ], c = new Set(t.ids), d = new Set(t.absent);
  for (const b of o)
    for (const g of b.tagIds)
      switch (b.mode) {
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
  const p = new Set(t.ids), u = new Set(t.absent), m = [...new Set(e.steps.flatMap((b) => b.tagIds))];
  return {
    added: m.filter((b) => c.has(b) && !p.has(b)),
    removed: [...p].filter((b) => !c.has(b)),
    markedAbsent: m.filter((b) => d.has(b) && !u.has(b)),
    absenceCleared: [...u].filter((b) => !d.has(b)),
    unresolvedTrees: [...new Set(i)]
  };
}
function Md(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const a of e.applications)
      n.has(a.tag.id) || n.set(a.tag.id, a.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, a) => ({ id: n, name: e.names[a] ?? "" }));
  return mr(t);
}
function Bo(e) {
  return Vo(Od(e));
}
function Vo(e) {
  const t = [...new Set(e)].sort((o, c) => o - c).join(","), [n, a] = C(() => /* @__PURE__ */ new Map()), i = O(/* @__PURE__ */ new Set()), s = O(!0);
  return H(() => (s.current = !0, () => {
    s.current = !1;
  }), []), H(() => {
    const o = t ? t.split(",").map(Number) : [];
    for (const c of o)
      i.current.has(c) || (i.current.add(c), Va([c]).then(
        (d) => {
          s.current && a((p) => new Map(p).set(c, d));
        },
        () => {
          i.current.delete(c);
        }
      ));
  }, [t]), n;
}
function br(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function Dr(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, a) => {
    const i = br(n.group);
    if (!i) return;
    const s = t.get(i);
    s ? s.actions.push(a) : t.set(i, { key: i, name: n.group.trim(), actions: [a] });
  }), [...t.values()];
}
function xs(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => br(t.group) !== "");
}
function Jo(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function zo(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function Wo(e) {
  return Hn(e).size > 0 || zo(e).size > 0;
}
function Fd(e) {
  return Dr(e).filter(
    (t) => !t.actions.some((n) => Wo(e[n]))
  );
}
function Ni(e, t) {
  const n = Jo(t), a = new Set(t.absent);
  return Dr(e).map((i) => {
    const s = [], o = [];
    for (const c of i.actions) {
      const d = [...Hn(e[c])], p = [...zo(e[c])], u = [
        ...d.map((m) => n.has(m)),
        ...p.map((m) => a.has(m))
      ];
      u.some(Boolean) && (o.push(c), u.every(Boolean) && s.push(c));
    }
    return { ...i, answers: s.length ? s : o };
  });
}
function qi(e) {
  return e.filter((t) => t.answers.length === 0);
}
function xd(e, t, n) {
  const a = { ids: [...Jo(t)], absent: t.absent }, i = Zi(e, a, n), s = new Set(i.removed), o = new Set(i.absenceCleared);
  return {
    ids: [...a.ids.filter((c) => !s.has(c)), ...i.added],
    absent: [...a.absent.filter((c) => !o.has(c)), ...i.markedAbsent]
  };
}
const Mr = "review";
function Pd(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function Ld(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function fr(e, t) {
  const n = new Set(Pd(e));
  return t.filter((a) => n.has(a.id));
}
function Ps(e, t, n) {
  const a = /* @__PURE__ */ new Map(), i = (o, c) => {
    const d = a.get(o) ?? c();
    return a.set(o, d), d;
  };
  for (const o of fr(e, t))
    for (const c of e) {
      if (c.tagId !== o.id) continue;
      const d = c.categoryTagId === void 0 ? i(Mr, () => ({
        key: Mr,
        name: "",
        tagIds: null,
        flags: [],
        mixed: []
      })) : i(`tag:${c.categoryTagId}`, () => {
        const { name: p, tagIds: u, resolved: m } = n(c.categoryTagId);
        return {
          key: `tag:${c.categoryTagId}`,
          name: p,
          tagIds: u,
          flags: [],
          mixed: [],
          ...m ? {} : { unresolved: !0 }
        };
      });
      d.flags.includes(o.name) || d.flags.push(o.name);
    }
  const s = [...a.values()];
  return [
    ...s.filter((o) => o.key === Mr),
    ...s.filter((o) => o.key !== Mr)
  ];
}
function Qo(e) {
  const t = e.flatMap((i) => i.mixed), n = (i) => i.key.startsWith("group:") && t.some(
    (s) => s.key.startsWith("tag:") && i.members.every((o) => s.members.includes(o))
  ), a = /* @__PURE__ */ new Map();
  for (const i of t)
    !a.has(i.key) && !n(i) && a.set(i.key, {
      key: i.key,
      name: i.name,
      tagIds: i.members,
      flags: [],
      mixed: i.tags
    });
  return [...a.values()];
}
function Ho(...e) {
  const t = /* @__PURE__ */ new Map();
  for (const a of e.flat()) {
    const i = t.get(a.key);
    if (!i) {
      t.set(a.key, { ...a, flags: [...a.flags] });
      continue;
    }
    for (const s of a.flags) i.flags.includes(s) || i.flags.push(s);
    i.mixed.length || (i.mixed = a.mixed), i.unresolved && !a.unresolved && delete i.unresolved, i.tagIds !== null && a.tagIds !== null && (i.tagIds = [.../* @__PURE__ */ new Set([...i.tagIds, ...a.tagIds])]);
  }
  const n = [...t.values()];
  return [
    ...n.filter((a) => a.key === Mr),
    ...n.filter((a) => a.key !== Mr)
  ];
}
function Dd(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e.steps)
    if (a.mode !== "CLEAR_ABSENCE")
      for (const i of a.tagIds)
        for (const s of a.mode === "REMOVE_TREE" ? t.get(i) ?? [i] : [i])
          n.add(s);
  return n;
}
function Yo(e, t, n) {
  if (t.tagIds === null) return !0;
  const a = Dd(e, n);
  return t.tagIds.some((i) => a.has(i));
}
function _d(e, t, n) {
  return t.filter(
    (a) => a.tagIds === null || a.unresolved && e.length > 0 || e.some((i) => Yo(i, a, n))
  );
}
function jd(e, t, n) {
  return t.filter((a) => a.tagIds !== null && Yo(e, a, n));
}
function Ud(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function es(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [Ud(e.mixed)] : []
  ];
}
function Gd(e) {
  const t = es(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function Kd(e, t, n) {
  const a = fr(e, t).map((i) => {
    const s = e.filter((c) => c.tagId === i.id);
    if (s.every((c) => c.categoryTagId === void 0)) return i.name;
    const o = s.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${i.name} (affects ${[...new Set(o)].join(", ")})`;
  });
  return a.length ? `Flagged: ${a.join(", ")}` : "";
}
const Si = "-", Ls = "Ctrl+a", Bd = "Ctrl/⌘A", Vd = ["f", "g", "k"], ai = "Shift+";
function _r(e) {
  return ye(() => Io(e), [e]);
}
function ts({
  surface: e,
  enabled: t,
  actions: n,
  onAction: a,
  onFind: i,
  onSelectAll: s
}) {
  const o = _r(n), c = O({ keyMap: o, onAction: a, onFind: i, onSelectAll: s });
  Rt(() => {
    c.current = { keyMap: o, onAction: a, onFind: i, onSelectAll: s };
  });
  const d = !!i && n.length > 0, p = e === "local" && !!s, u = Jn.filter(
    (b) => o.actionOn.has(b) || e === "local" && Vd.includes(b)
  ).join(" "), m = ye(() => {
    const b = (N) => {
      var w, I;
      const q = c.current;
      if (N === Ls) (w = q.onSelectAll) == null || w.call(q);
      else if (N === Si) (I = q.onFind) == null || I.call(q);
      else {
        const M = N.startsWith(ai), j = q.keyMap.actionOn.get(
          M ? N.slice(ai.length) : N
        );
        j !== void 0 && q.onAction(j, M);
      }
    }, g = (N, q = e) => ({
      keys: N,
      surface: q,
      action: (w) => {
        w != null && w.repeat || b((w == null ? void 0 : w.sequence) ?? N);
      }
    }), y = [];
    p && y.push(g(Ls, "local")), d && y.push(g(Si));
    for (const N of u ? u.split(" ") : [])
      y.push(g(N), g(`${ai}${N}`));
    return y;
  }, [e, u, d, p]);
  bl(m, t);
}
const Jd = {
  find: Si,
  selectAll: Bd
};
function ns() {
  return Jd;
}
const zd = 600 * 1e3, rs = /* @__PURE__ */ new Map(), Xo = /* @__PURE__ */ new Map(), Bn = /* @__PURE__ */ new Map();
function Zo(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = Xo.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function ec(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && Xo.set(e.tagGroupId, e.tagGroupSortOrder), rs.set(e.id, { tag: e, at: Date.now() });
}
function tc(e) {
  const t = rs.get(e);
  if (!(!t || Date.now() - t.at > zd))
    return Zo(t.tag);
}
function nc(e) {
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
function Ei(e) {
  var t;
  for (const n of e) {
    const a = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && a && ec(nc({ ...n, name: a }));
  }
}
function Wd(e) {
  const t = Bn.get(e);
  if (t) return t;
  const n = new AbortController(), a = {
    controller: n,
    waiters: 0,
    promise: de(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var u, m;
        const s = ((u = i == null ? void 0 : i.name) == null ? void 0 : u.trim()) || null;
        if (Bn.get(e) === a && Bn.delete(e), !s) return null;
        const o = nc({ ...i, id: e, name: s }), c = (m = rs.get(e)) == null ? void 0 : m.tag, d = (c == null ? void 0 : c.tagGroupId) === o.tagGroupId, p = {
          ...o,
          tagGroupSortOrder: o.tagGroupSortOrder ?? (d ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: o.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: o.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return ec(p), Zo(p);
      },
      () => (Bn.get(e) === a && Bn.delete(e), null)
    )
  };
  return Bn.set(e, a), a;
}
function Ds() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function ii(e) {
  const t = {};
  for (const n of e) {
    const a = tc(n);
    a !== void 0 && (t[n] = a);
  }
  return t;
}
function Qd(e, t) {
  if (t != null && t.aborted) return Promise.reject(Ds());
  const n = {}, a = [];
  for (const i of new Set(e)) {
    const s = tc(i);
    if (s !== void 0) n[i] = s;
    else {
      const o = Wd(i);
      o.waiters += 1, a.push({ id: i, entry: o });
    }
  }
  return a.length ? new Promise((i, s) => {
    let o = !1;
    const c = () => {
      for (const { id: p, entry: u } of a)
        u.waiters -= 1, u.waiters === 0 && Bn.get(p) === u && (Bn.delete(p), u.controller.abort());
    }, d = () => {
      o || (o = !0, c(), s(Ds()));
    };
    t == null || t.addEventListener("abort", d, { once: !0 }), Promise.all(
      a.map(
        ({ id: p, entry: u }) => u.promise.then((m) => [p, m])
      )
    ).then((p) => {
      if (!o) {
        o = !0, t == null || t.removeEventListener("abort", d), c();
        for (const [u, m] of p) n[u] = m;
        i(n);
      }
    });
  }) : Promise.resolve(n);
}
function rc(e) {
  const t = {};
  for (const [n, a] of Object.entries(e)) t[Number(n)] = (a == null ? void 0 : a.name) ?? null;
  return t;
}
function ha(e) {
  const t = [...new Set(e)].sort((i, s) => i - s).join(","), [n, a] = C(() => ({
    key: t,
    tags: ii(si(t))
  }));
  return H(() => {
    const i = si(t), s = ii(i);
    if (a({ key: t, tags: s }), i.every((c) => c in s)) return;
    const o = new AbortController();
    return Qd(i, o.signal).then(
      (c) => a({ key: t, tags: c }),
      () => {
      }
    ), () => o.abort();
  }, [t]), n.key === t ? n.tags : ii(si(t));
}
function jr(e) {
  const t = ha(e);
  return ye(() => rc(t), [t]);
}
function si(e) {
  return e ? e.split(",").map(Number) : [];
}
const Hd = "(max-width: 760px)";
function ac(e) {
  const [t] = C(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = qn(
    (a) => (t == null || t.addEventListener("change", a), () => t == null ? void 0 : t.removeEventListener("change", a)),
    [t]
  );
  return Fi(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function pa() {
  return ac(Hd);
}
function Yd(e, t, n = !1) {
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
function vr(e, t, n = [], a) {
  if ("effect" in e) {
    const o = e.effect;
    if (o.mode === "SKIP") return [{ text: "Skip", tone: "neutral" }];
    if (o.mode === "CLEAR_TAG_GROUP")
      return [{ text: "Set Ungrouped", tone: "neutral" }];
    const c = n.find((d) => d.id === o.tagGroupId);
    return [
      {
        text: c ? `Assign ${c.name}` : "Unavailable tag group",
        tone: "neutral"
      }
    ];
  }
  if (!e.steps.length) return [{ text: "Skip", tone: "neutral" }];
  const i = Hn(e), s = (o) => i.has(o) || [...i].some((c) => {
    var d;
    return (d = a == null ? void 0 : a.get(o)) == null ? void 0 : d.includes(c);
  });
  return e.steps.flatMap(
    (o) => o.tagIds.map(
      (c) => Yd(
        o.mode,
        t[c] === void 0 ? "…" : t[c] ?? "Unavailable tag",
        o.mode === "REMOVE_TREE" && s(c)
      )
    )
  );
}
function Ja(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function as({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  canStay: i = !0,
  tapStays: s = !1,
  onApply: o,
  onClose: c
}) {
  const d = pa(), [p, u] = C(""), [m, b] = C(0), g = O(null), y = O(null), N = O(null), q = O(null), w = O(null), I = O(/* @__PURE__ */ new Set()), M = lt(), j = jr(ye(() => Ja(e), [e])), G = _r(e), D = ye(() => {
    const _ = p.trim().toLocaleLowerCase(), U = (S) => S ? Jn.indexOf(S) : Jn.length;
    return e.map((S, A) => ({ action: S, index: A, key: G.keys[A] })).sort((S, A) => U(S.key) - U(A.key)).filter((S) => !_ || S.action.label.toLocaleLowerCase().includes(_));
  }, [e, G, p]), Z = D.length ? Math.min(m, D.length - 1) : -1, ne = (_) => `${M}-option-${_}`;
  Rt(() => {
    var _, U, S;
    return q.current = document.activeElement, w.current = ((U = (_ = N.current) == null ? void 0 : _.parentElement) == null ? void 0 : U.closest('[role="dialog"]')) ?? null, (S = g.current) == null || S.focus({ preventScroll: !0 }), () => {
      var V;
      const A = q.current;
      A instanceof HTMLElement && A.isConnected && A.focus({ preventScroll: !0 }), document.activeElement !== A && ((V = w.current) != null && V.isConnected) && w.current.focus({ preventScroll: !0 });
    };
  }, []), H(() => {
    var _, U, S;
    Z < 0 || (S = (U = (_ = y.current) == null ? void 0 : _.querySelector(`[id="${ne(D[Z].index)}"]`)) == null ? void 0 : U.scrollIntoView) == null || S.call(U, { block: "nearest" });
  }, [Z, D]);
  function se(_, U) {
    !_ || a != null && a(_.action) || o(_.action, i && U);
  }
  function oe(_) {
    var S;
    _.stopPropagation();
    const U = _.code || _.key;
    if (_.repeat && !I.current.has(U)) {
      _.preventDefault();
      return;
    }
    if (_.repeat || I.current.add(U), _.key === "Escape")
      _.preventDefault(), c();
    else if (_.key === "Enter")
      _.preventDefault(), _.repeat || se(D[Z], _.shiftKey);
    else if (_.key === "ArrowDown" || _.key === "ArrowUp") {
      if (_.preventDefault(), !D.length) return;
      const A = _.key === "ArrowDown" ? 1 : -1;
      b((Z + A + D.length) % D.length);
    } else _.key === "Tab" && (_.preventDefault(), (S = g.current) == null || S.focus());
  }
  return /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ r("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: c }),
    /* @__PURE__ */ l(
      "div",
      {
        ref: N,
        role: "dialog",
        "aria-label": "Find an action",
        className: `dq-find-action${d ? " dq-find-mobile" : ""}`,
        onKeyDown: oe,
        onMouseDown: (_) => {
          _.target !== g.current && _.preventDefault();
        },
        children: [
          /* @__PURE__ */ l("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ r(ca, { "aria-hidden": "true" }),
            /* @__PURE__ */ r(
              "input",
              {
                ref: g,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${M}-list`,
                "aria-activedescendant": Z >= 0 ? ne(D[Z].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: p,
                onChange: (_) => {
                  u(_.target.value), b(0);
                }
              }
            ),
            !d && /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          D.length ? /* @__PURE__ */ r(
            "ul",
            {
              ref: y,
              id: `${M}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: D.map((_, U) => /* @__PURE__ */ r("li", { role: "none", children: /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: ne(_.index),
                  tabIndex: -1,
                  "aria-selected": U === Z,
                  disabled: (a == null ? void 0 : a(_.action)) ?? !1,
                  onClick: (S) => se(_, S.shiftKey || s && pi(_.action)),
                  children: [
                    d ? null : _.key ? /* @__PURE__ */ r("kbd", { children: _.key }) : /* @__PURE__ */ r("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ r("span", { className: "dq-find-label", children: _.action.label }),
                    /* @__PURE__ */ r("span", { className: "dq-find-effect", children: vr(_.action, j, t, n).map(
                      (S, A) => /* @__PURE__ */ r("span", { "data-effect-tone": S.tone, children: S.text }, A)
                    ) })
                  ]
                }
              ) }, _.action.id))
            }
          ) : /* @__PURE__ */ l("p", { className: "dq-find-empty", role: "status", children: [
            "No action matches “",
            p.trim(),
            "”."
          ] }),
          !d && /* @__PURE__ */ l("p", { className: "dq-find-hints", "aria-hidden": "true", children: [
            /* @__PURE__ */ l("span", { children: [
              /* @__PURE__ */ r("kbd", { children: "Enter" }),
              " applies"
            ] }),
            i && /* @__PURE__ */ l("span", { children: [
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
function ic() {
  let e = null;
  const t = /* @__PURE__ */ new Set(), n = (a) => {
    a !== e && (e = a, t.forEach((i) => i()));
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
function is(e) {
  return Fi(e.subscribe, e.get, e.get);
}
function sc(e, t) {
  const n = O(t);
  Rt(() => {
    n.current !== t && (n.current = t, e.set(null));
  }, [e, t]);
}
function oc(e, t) {
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
const Xd = [], _s = ia.map((e, t) => ({
  indent: t,
  keys: e,
  fixed: t === 2 ? ["n", "m", ",", "."] : []
}));
function Zd(e, t) {
  return t === "video" && e === "m" ? "Mute" : "";
}
function ct({ binding: e, hidden: t }) {
  return /* @__PURE__ */ r(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || void 0,
      children: e
    }
  );
}
function Ia(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function cc(e) {
  return ia.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function lc({
  groups: e,
  renderAction: t,
  find: n
}) {
  const a = e.length ? e : [[]];
  return /* @__PURE__ */ r(me, { children: a.map((i, s) => /* @__PURE__ */ l("div", { className: "dq-mobile-group", children: [
    i.map(t),
    s === a.length - 1 && n
  ] }, s)) });
}
function dc({
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
          /* @__PURE__ */ r(ca, { "aria-hidden": "true" }),
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
function eu({
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
      children: (t ?? e).map((i) => {
        const s = t ? i.answers : null, o = s ? s.length ? "answered" : "open" : "unknown", c = s == null ? void 0 : s.map((u) => n[u].label).join(", "), d = a(i), p = o === "answered" ? `${i.name}: ${c}` : o === "open" ? `${i.name}: not answered yet` : i.name;
        return /* @__PURE__ */ l(
          "li",
          {
            className: "dq-group",
            "data-state": o,
            "data-attention": d ? !0 : void 0,
            title: d ? `${p}. Needs attention: ${d}` : p,
            children: [
              /* @__PURE__ */ r("span", { className: "dq-group-name", children: i.name }),
              d && /* @__PURE__ */ l("span", { className: "dq-group-flag", children: [
                /* @__PURE__ */ r(Mn, { "aria-hidden": "true" }),
                /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  d
                ] })
              ] }),
              o === "answered" && /* @__PURE__ */ l(me, { children: [
                /* @__PURE__ */ r(Ga, { "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", answered:" }),
                " ",
                /* @__PURE__ */ r("span", { className: "dq-group-answer", children: c })
              ] }),
              o === "open" && /* @__PURE__ */ l(me, { children: [
                /* @__PURE__ */ r("span", { className: "dq-group-ring", "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", not answered yet" })
              ] })
            ]
          },
          i.key
        );
      })
    }
  );
}
function tu({ checked: e, onChange: t }) {
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
function nu({
  actions: e,
  mediaKind: t,
  isDisabled: n,
  busy: a,
  tags: i,
  trees: s,
  preview: o,
  onApply: c,
  onFind: d,
  findDisabled: p,
  paused: u = !1,
  waitForGroups: m = !1,
  attention: b = Xd,
  stayOnTap: g = !1,
  onStayOnTapChange: y
}) {
  const N = ns(), q = _r(e), w = pa();
  sc(o, w);
  const I = lt(), M = jr(
    ye(() => e.flatMap((Q) => Q.steps.flatMap((z) => z.tagIds)), [e])
  ), j = _s.filter((Q) => Q.keys.some((z) => q.actionOn.has(z))), G = j.includes(_s[2]), D = e.length - q.actionOn.size, Z = ye(
    () => m && !u ? Dr(e) : [],
    [m, u, e]
  ), ne = ye(
    () => Z.length && i ? Ni(e, i) : null,
    [Z, e, i]
  ), se = new Map(
    qi(ne ?? []).flatMap(
      (Q) => Q.actions.filter((z) => Wo(e[z])).map((z) => [z, Q.name])
    )
  ), oe = ye(
    () => e.map((Q) => u ? [] : jd(Q, b, s)),
    [e, b, s, u]
  ), _ = (Q) => Q.map(Gd).join("; "), U = oe.map(_), S = Z.length > 0 && /* @__PURE__ */ r(
    eu,
    {
      groups: Z,
      statuses: ne,
      actions: e,
      attentionOf: (Q) => _([
        ...new Map(
          Q.actions.flatMap((z) => oe[z]).map((z) => [z.key, z])
        ).values()
      ])
    }
  ), A = (Q) => {
    const z = vr(e[Q], M, [], s).map((fe) => fe.text).join(", "), te = se.get(Q), x = U[Q];
    return [
      z,
      te === void 0 ? "" : `${te}: not answered yet`,
      x ? `Needs attention: ${x}` : ""
    ].filter(Boolean).join(". ");
  }, V = (Q) => U[Q] ? (
    // The tile's description says it; the mark is for the eye, with the reasons on hover.
    /* @__PURE__ */ r(
      "span",
      {
        className: "dq-pad-flag",
        "aria-hidden": "true",
        title: `Needs attention: ${U[Q]}`,
        children: /* @__PURE__ */ r(Mn, {})
      }
    )
  ) : null, J = (Q) => ({
    onMouseEnter: () => o.set(Q),
    onMouseLeave: () => o.clear(Q),
    onFocus: () => o.set(Q),
    onBlur: (z) => {
      z.currentTarget.contains(z.relatedTarget) || o.clear(Q);
    }
  }), ue = (Q) => {
    const z = q.actionOn.get(Q), te = z === void 0 ? void 0 : e[z];
    if (!te)
      return /* @__PURE__ */ r(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ r(ct, { binding: Q })
        },
        Q
      );
    const x = n(te), fe = `${I}-effect-${Q}`;
    return /* @__PURE__ */ l("div", { className: "dq-pad-slot", ...u ? {} : J(te), children: [
      /* @__PURE__ */ r("span", { id: fe, className: "dq-sr-only", children: A(z) }),
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: te.label,
          "aria-keyshortcuts": Q,
          "aria-describedby": fe,
          "data-group-open": se.has(z) || void 0,
          "data-attention": U[z] ? !0 : void 0,
          disabled: x,
          onClick: (Oe) => c(te, Oe.shiftKey),
          children: [
            /* @__PURE__ */ r(ct, { binding: Q }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-pad-label", children: te.label }),
            Ia(te) && " ",
            Ia(te) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(xa, { "aria-hidden": "true" }),
              "absent"
            ] }),
            V(z)
          ]
        }
      ),
      pi(te) && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-pad-pin",
          "aria-label": `Apply and stay: ${te.label}`,
          title: "Apply and stay (Shift)",
          disabled: x,
          onClick: () => c(te, !0),
          children: /* @__PURE__ */ r(Di, { "aria-hidden": "true" })
        }
      )
    ] }, Q);
  }, ce = /* @__PURE__ */ l("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ r(Pr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (w) {
    const Q = cc(q), z = (te) => {
      const x = e[te], fe = q.keys[te];
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: x.label,
          "aria-keyshortcuts": fe,
          "aria-describedby": `${I}-effect-${fe}`,
          "data-group-open": se.has(te) || void 0,
          "data-attention": U[te] ? !0 : void 0,
          disabled: n(x),
          onClick: (Oe) => {
            o.clear(x), c(x, Oe.shiftKey || g && pi(x));
          },
          ...u ? {} : oc(o, x),
          children: [
            /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: x.label }),
            Ia(x) && " ",
            Ia(x) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(xa, { "aria-hidden": "true" }),
              "absent"
            ] }),
            V(te)
          ]
        },
        fe
      );
    };
    return /* @__PURE__ */ l(
      "section",
      {
        className: `dq-pad dq-pad-mobile${u ? " dq-pad-paused" : ""}`,
        "aria-label": u ? "Actions, paused while editing" : "Actions",
        "aria-busy": a || void 0,
        children: [
          /* @__PURE__ */ l("div", { className: "dq-pad-header", children: [
            u ? ce : /* @__PURE__ */ r(
              js,
              {
                actions: e,
                keyMap: q,
                names: M,
                tags: i,
                trees: s,
                preview: o,
                findKey: N.find,
                mobile: !0
              }
            ),
            y && /* @__PURE__ */ r(tu, { checked: g, onChange: y })
          ] }),
          S,
          /* @__PURE__ */ r("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ r(
            lc,
            {
              groups: Q,
              renderAction: z,
              find: /* @__PURE__ */ r(
                dc,
                {
                  extra: D,
                  findKey: N.find,
                  disabled: p,
                  onFind: d
                }
              )
            }
          ) }),
          /* @__PURE__ */ r("div", { hidden: !0, children: Q.flat().map((te) => /* @__PURE__ */ r("span", { id: `${I}-effect-${q.keys[te]}`, children: A(te) }, te)) })
        ]
      }
    );
  }
  const B = /* @__PURE__ */ l("span", { className: "dq-pad-hint", children: [
    /* @__PURE__ */ r("kbd", { className: "dq-key", children: "Shift" }),
    /* @__PURE__ */ r("span", { children: "+ key applies and stays" })
  ] }), T = !G && /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: "dq-pad-find-button",
      "aria-label": D ? `Find action, ${D} more` : "Find action",
      "aria-keyshortcuts": N.find,
      disabled: p,
      onClick: d,
      children: [
        /* @__PURE__ */ r(ct, { binding: N.find }),
        /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "Find action" })
      ]
    }
  );
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-pad${u ? " dq-pad-paused" : ""}`,
      "aria-label": u ? "Actions, paused while editing" : "Actions",
      "aria-busy": a || void 0,
      children: [
        /* @__PURE__ */ l("div", { className: `dq-pad-header${S ? " dq-pad-header-groups" : ""}`, children: [
          u ? ce : /* @__PURE__ */ r(
            js,
            {
              actions: e,
              keyMap: q,
              names: M,
              tags: i,
              trees: s,
              preview: o,
              findKey: N.find
            }
          ),
          S ? (
            // The checklist, then the hint and Find action, on the header's second line, under the
            // effect line: the pad keeps its height as answers of any length come in.
            /* @__PURE__ */ l("div", { className: "dq-pad-header-end", children: [
              S,
              B,
              T
            ] })
          ) : /* @__PURE__ */ l(me, { children: [
            !u && B,
            T
          ] })
        ] }),
        j.map((Q) => /* @__PURE__ */ l("div", { className: "dq-pad-row", "data-indent": Q.indent, children: [
          Q.keys.map(ue),
          Q.fixed.map((z) => {
            const te = Zd(z, t);
            return /* @__PURE__ */ l(
              "div",
              {
                className: `dq-pad-slot dq-pad-free dq-pad-fixed${te ? " dq-pad-reserved" : ""}`,
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ r(ct, { binding: z }),
                  te && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: te })
                ]
              },
              z
            );
          }),
          Q.fixed.length > 0 && /* @__PURE__ */ r("div", { className: "dq-pad-slot", children: /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": D ? `Find action, ${D} more` : "Find action",
              "aria-keyshortcuts": N.find,
              disabled: p,
              onClick: d,
              children: [
                /* @__PURE__ */ r(ct, { binding: N.find }),
                /* @__PURE__ */ l("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ r(ca, { "aria-hidden": "true" }),
                  D ? `${D} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, Q.indent))
      ]
    }
  );
}
function js({
  actions: e,
  keyMap: t,
  names: n,
  tags: a,
  trees: i,
  preview: s,
  findKey: o,
  mobile: c = !1
}) {
  const d = is(s), p = d ? e.indexOf(d) : -1;
  if (!d || p < 0) {
    const g = t.actionOn.size;
    return /* @__PURE__ */ l("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && g < e.length && /* @__PURE__ */ l(me, { children: [
        ` · ${g} on keys, ${e.length - g} more under `,
        /* @__PURE__ */ r(ct, { binding: o })
      ] })
    ] });
  }
  const u = t.keys[p], m = a && d.steps.length ? Zi(d, a, i) : null, b = m && !m.unresolvedTrees.length && ![m.added, m.removed, m.markedAbsent, m.absenceCleared].some(
    (g) => g.length
  );
  return /* @__PURE__ */ l("p", { className: "dq-pad-effect", children: [
    u && !c && /* @__PURE__ */ r(ct, { binding: u }),
    /* @__PURE__ */ r("strong", { children: d.label }),
    vr(d, n, [], i).map((g, y) => /* @__PURE__ */ r("span", { "data-effect-tone": g.tone, children: g.text }, y)),
    b && /* @__PURE__ */ r("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function uc({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  busy: i,
  onApply: s,
  onFind: o,
  summary: c,
  hints: d,
  keyHints: p,
  notices: u,
  status: m,
  className: b = "",
  paused: g = !1
}) {
  const y = ns(), N = _r(e), q = pa(), w = lt(), I = jr(ye(() => Ja(e), [e])), [M] = C(() => ic());
  sc(M, q);
  const j = O(null), G = ru(j, e, !q), D = cc(N);
  !D.length && e.length && D.push([]);
  const Z = D.flat(), ne = e.length - Z.length, se = (S) => vr(S, I, t, n).map((A) => A.text).join(", "), oe = (S) => ({
    onMouseEnter: () => M.set(S),
    onMouseLeave: () => M.clear(S),
    onFocus: () => M.set(S),
    onBlur: (A) => {
      A.currentTarget.contains(A.relatedTarget) || M.clear(S);
    }
  }), _ = d ?? (q ? void 0 : p), U = (S) => {
    const A = e[S];
    return /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-mobile-tile",
        title: A.label,
        "aria-keyshortcuts": N.keys[S] || void 0,
        "aria-describedby": `${w}-effect-${S}`,
        disabled: g || a(A),
        onClick: () => {
          M.clear(A), s(A);
        },
        ...g ? {} : oc(M, A),
        children: /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: A.label })
      },
      A.id
    );
  };
  return /* @__PURE__ */ l(
    "section",
    {
      ref: j,
      className: `dq-action-bar${q ? " dq-bar-mobile" : G ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${g ? " dq-bar-paused" : ""}${b ? ` ${b}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ r("div", { className: "dq-bar-summary", children: c }),
        /* @__PURE__ */ r("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ l(
          "div",
          {
            className: `dq-bar-tiles${q ? " dq-mobile-actions" : ""}`,
            "aria-busy": i || void 0,
            children: [
              q && e.length > 0 && /* @__PURE__ */ r(
                lc,
                {
                  groups: D,
                  renderAction: U,
                  find: /* @__PURE__ */ r(
                    dc,
                    {
                      extra: ne,
                      findKey: y.find,
                      disabled: g,
                      onFind: o
                    }
                  )
                }
              ),
              !q && D.map((S, A) => /* @__PURE__ */ l("div", { className: "dq-bar-line", children: [
                S.map((V) => {
                  const J = e[V], ue = N.keys[V];
                  return /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: J.label,
                      "aria-keyshortcuts": ue || void 0,
                      "aria-describedby": `${w}-effect-${V}`,
                      disabled: g || a(J),
                      onClick: () => s(J),
                      ...g ? {} : oe(J),
                      children: [
                        ue && /* @__PURE__ */ r(ct, { binding: ue }),
                        " ",
                        /* @__PURE__ */ r("span", { className: "dq-bar-label", children: J.label })
                      ]
                    },
                    J.id
                  );
                }),
                A === D.length - 1 && /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-bar-tile dq-bar-find",
                    "aria-label": ne > 0 ? `Find action, ${ne} more` : "Find action",
                    "aria-keyshortcuts": y.find,
                    disabled: g,
                    onClick: o,
                    children: [
                      /* @__PURE__ */ r(ct, { binding: y.find, hidden: !0 }),
                      /* @__PURE__ */ r(ca, { "aria-hidden": "true" }),
                      /* @__PURE__ */ r("span", { className: "dq-bar-label", children: ne > 0 ? `${ne} more` : "Find action" })
                    ]
                  }
                )
              ] }, A)),
              !e.length && /* @__PURE__ */ r("p", { className: "dq-bar-empty", children: "This review has no actions." })
            ]
          }
        ),
        _ && /* @__PURE__ */ r("p", { className: "dq-bar-hints", children: _ }),
        g ? /* @__PURE__ */ l("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ r(Pr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ r(
          au,
          {
            actions: e,
            keyMap: N,
            preview: M,
            names: I,
            tagGroups: t,
            trees: n,
            showKey: !q
          }
        ),
        u && /* @__PURE__ */ r("div", { className: "dq-bar-notices", children: u }),
        /* @__PURE__ */ r("div", { hidden: !0, children: Z.map((S) => /* @__PURE__ */ r("span", { id: `${w}-effect-${S}`, children: se(e[S]) }, e[S].id)) }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: m })
      ]
    }
  );
}
function ru(e, t, n) {
  const [a, i] = C(!1);
  return Rt(() => {
    var u;
    const s = e.current;
    if (!s || !n || typeof ResizeObserver > "u") return;
    const o = s.querySelector(".dq-bar-summary"), c = () => {
      const m = getComputedStyle(s), b = parseFloat(m.columnGap) || 0, g = s.clientWidth - (parseFloat(m.paddingLeft) || 0) - (parseFloat(m.paddingRight) || 0), y = [...s.querySelectorAll(".dq-bar-line")].map(
        (Z) => [...Z.children].map((ne) => ne.offsetWidth)
      ), N = s.querySelector(".dq-bar-line"), q = N && parseFloat(getComputedStyle(N).columnGap) || 0, w = s.querySelector(".dq-bar-hints"), I = ((o == null ? void 0 : o.offsetWidth) ?? 0) + (w ? w.offsetWidth + b : 0) + 1 + // the divider
      2 * b, M = (Z) => y.map((ne) => {
        let se = 1, oe = 0;
        for (const _ of ne)
          oe > 0 && oe + q + _ > Z ? (se += 1, oe = _) : oe += (oe > 0 ? q : 0) + _;
        return se;
      }), j = (Z) => Math.max(1, Z.reduce((ne, se) => ne + se, 0)), G = M(g), D = j(M(g - I));
      i(
        1 + j(G) < D || 1 + j(G) === D && G.every((Z) => Z === 1)
      );
    }, d = new ResizeObserver(c);
    d.observe(s);
    for (const m of s.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      d.observe(m);
    c();
    let p = !0;
    return (u = document.fonts) == null || u.ready.then(() => {
      p && c();
    }), () => {
      p = !1, d.disconnect();
    };
  }, [e, t, n]), a;
}
function au({
  actions: e,
  keyMap: t,
  preview: n,
  names: a,
  tagGroups: i,
  trees: s,
  showKey: o
}) {
  const c = is(n), d = c ? e.indexOf(c) : -1;
  if (!c || d < 0) return null;
  const p = t.keys[d];
  return /* @__PURE__ */ l("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    p && o && /* @__PURE__ */ r(ct, { binding: p }),
    /* @__PURE__ */ r("strong", { children: c.label }),
    vr(c, a, i, s).map((u, m) => /* @__PURE__ */ r("span", { "data-effect-tone": u.tone, children: u.text }, m))
  ] });
}
const Us = 1e3;
async function iu(e, t, n) {
  const a = await de(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    const p = await de(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          xn({
            findFilter: {
              page: d,
              perPage: Us,
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
    for (const u of p.items) i.set(u.id, u);
    if (d * Us >= p.totalCount) break;
    if (!p.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const s = [...i.values()], o = je(e), c = Ie(e) ? await ou(
    o,
    s.map((d) => d.id),
    n
  ) : s.map((d) => (o === "audio" ? d.audioCount : d.videoCount) ?? 0);
  return {
    parent: { id: t, name: a.name },
    children: s.map((d, p) => ({ id: d.id, name: d.name, uses: c[p] })).sort(
      (d, p) => p.uses - d.uses || d.name.localeCompare(p.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function su(e) {
  return JSON.stringify(
    xn({
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
async function ou(e, t, n) {
  const a = new Array(t.length).fill(0), i = new AbortController(), s = () => i.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && s(), n == null || n.addEventListener("abort", s, { once: !0 });
  let o = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; o < t.length && !i.signal.aborted; ) {
            const c = o++;
            a[c] = (await de(
              `/api/${Yn(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: su(t[c])
              }
            )).count;
          }
        } catch (c) {
          throw i.abort(), c;
        }
      })
    );
  } finally {
    n == null || n.removeEventListener("abort", s);
  }
  return i.signal.throwIfAborted(), a;
}
function cu(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((a) => t.has(a.id) ? !1 : (t.add(a.id), !0))
  }));
}
function lu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of n.children)
      t.set(a.id, [...t.get(a.id) ?? [], n.parent.id]);
  return t;
}
function du(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of Hn(n))
      t.set(a, [...t.get(a) ?? [], n]);
  return t;
}
function uu(e, t, n) {
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
function fu(e, t) {
  var a;
  const n = br(e);
  return ((a = Dr(t).find((i) => i.key === n)) == null ? void 0 : a.name) ?? e.trim();
}
const hu = (e) => e instanceof Error ? e.message : "Request failed.";
function pu({
  id: e,
  review: t,
  disabled: n,
  onAdd: a,
  onCancel: i
}) {
  const [s, o] = C([]), [c, d] = C({}), [p, u] = C({}), [m, b] = C({}), g = O(/* @__PURE__ */ new Map());
  H(
    () => () => {
      for (const S of g.current.values()) S.abort();
    },
    []
  );
  const y = En(je(t)), N = Ie(t), q = N ? "performer" : y.one;
  function w(S) {
    var V;
    (V = g.current.get(S)) == null || V.abort();
    const A = new AbortController();
    g.current.set(S, A), d((J) => ({ ...J, [S]: { status: "loading" } })), iu(t, S, A.signal).then(
      (J) => {
        A.signal.aborted || d((ue) => ({
          ...ue,
          [S]: { status: "ready", group: J }
        }));
      },
      (J) => {
        A.signal.aborted || d((ue) => ({
          ...ue,
          [S]: { status: "failed", message: hu(J) }
        }));
      }
    );
  }
  function I(S) {
    var ce;
    const A = s.filter((B) => !S.includes(B));
    for (const B of A)
      (ce = g.current.get(B)) == null || ce.abort(), g.current.delete(B);
    const V = (B) => {
      const T = c[B];
      return (T == null ? void 0 : T.status) === "ready" ? T.group.children.map((Q) => Q.id) : [];
    }, J = new Set(S.flatMap(V)), ue = A.flatMap(V).filter((B) => !J.has(B));
    u(
      (B) => Object.fromEntries(
        Object.entries(B).filter(([T]) => !ue.includes(Number(T)))
      )
    ), b(
      (B) => Object.fromEntries(
        Object.entries(B).filter(([T]) => S.includes(Number(T)))
      )
    ), d(
      (B) => Object.fromEntries(
        Object.entries(B).filter(([T]) => S.includes(Number(T)))
      )
    ), o(S);
    for (const B of S) s.includes(B) || w(B);
  }
  const M = s.flatMap((S) => {
    const A = c[S];
    return (A == null ? void 0 : A.status) === "ready" ? [A.group] : [];
  }), j = M.length === s.length, G = s.some(
    (S) => {
      var A;
      return (((A = c[S]) == null ? void 0 : A.status) ?? "loading") === "loading";
    }
  ), D = new Map(
    cu(M).map((S) => [S.parent.id, S])
  ), Z = lu(M), ne = new Map(M.map((S) => [S.parent.id, S.parent.name])), se = du(t.actions), oe = (S) => p[S] ?? !se.has(S), _ = j ? [...D.values()].flatMap((S) => {
    const A = fu(S.parent.name, t.actions);
    return S.children.filter((V) => oe(V.id)).map((V) => ({ child: V, answerGroup: A }));
  }) : [], U = (S, A) => u((V) => ({
    ...V,
    ...Object.fromEntries(S.children.map((J) => [J.id, A]))
  }));
  return /* @__PURE__ */ l("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ r("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ l("p", { className: "dq-drawer-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      N ? "on performers " : "",
      "first, in a group named after its parent. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ r(
      Qn,
      {
        entityType: "tag",
        values: s,
        onChange: I,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    s.map((S) => {
      const A = c[S];
      if (!A || A.status === "loading")
        return /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Loading child tags…" }, S);
      if (A.status === "failed")
        return /* @__PURE__ */ l("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ l("span", { children: [
            "Child tags could not be loaded. ",
            A.message
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
      const V = D.get(S);
      if (!V) return null;
      const J = V.parent.name;
      return /* @__PURE__ */ l("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ r("legend", { children: J }),
        A.group.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ l(me, { children: [
          /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: m[S] ?? !1,
                disabled: n,
                onChange: (ue) => b((ce) => ({
                  ...ce,
                  [S]: ue.target.checked
                }))
              }
            ),
            "Only one per ",
            q,
            ": each action removes every other tag in the ",
            J,
            " tree"
          ] }),
          V.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ l(me, { children: [
            /* @__PURE__ */ l("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${J}`,
                  onClick: () => U(V, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${J}`,
                  onClick: () => U(V, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "dq-child-tags", children: V.children.map((ue) => {
              const ce = se.get(ue.id) ?? [], B = (Z.get(ue.id) ?? []).filter((T) => T !== S).map((T) => `“${ne.get(T)}”`);
              return /* @__PURE__ */ l("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: oe(ue.id),
                    disabled: n,
                    onChange: (T) => u((Q) => ({
                      ...Q,
                      [ue.id]: T.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ l("span", { children: [
                  ue.name,
                  " ",
                  /* @__PURE__ */ l("small", { children: [
                    ue.uses.toLocaleString(),
                    " ",
                    ue.uses === 1 ? y.one : y.many
                  ] }),
                  B.length > 0 && /* @__PURE__ */ l("small", { children: [
                    " · Also under ",
                    B.join(", ")
                  ] }),
                  ce.length > 0 && /* @__PURE__ */ l("small", { children: [
                    " ",
                    "· Already in “",
                    ce[0].label || "New action",
                    "”",
                    ce.length > 1 ? ` and ${ce.length - 1} more` : ""
                  ] })
                ] })
              ] }, ue.id);
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
          disabled: n || !_.length,
          onClick: () => a(
            _.map(
              ({ child: S, answerGroup: A }) => uu(
                S,
                (Z.get(S.id) ?? []).filter(
                  (V) => m[V]
                ),
                A
              )
            )
          ),
          children: _.length ? `Add ${_.length} action${_.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-sr-only", children: G ? "Loading child tags…" : "" })
    ] })
  ] });
}
const mu = ["n", "m"], Kn = [
  ...ia,
  ["auto", zn]
];
function _a(e) {
  return e.toLocaleUpperCase();
}
function fc(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : Ji(e[n]);
}
function gu({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i
}) {
  const [s, o] = C(!1), c = O(null), d = n.keys[t], p = fc(e, n, t), u = pr(p), m = n.duplicatePins.has(t) ? ` (${_a(e[t].shortcut ?? "")} is pinned twice)` : "", b = d ? `${_a(d)}, ${u ? "pinned" : "Auto"}${m}` : p === zn ? "no key, Find action only" : `no key: Auto found no free key${m}`, g = () => {
    var y;
    o(!1), (y = c.current) == null || y.focus();
  };
  return /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        ref: c,
        type: "button",
        className: "dq-key-button",
        "aria-label": `Key for ${a}: ${b}`,
        "aria-haspopup": "dialog",
        "aria-expanded": s,
        title: "Choose the key",
        onClick: () => o(!s),
        children: [
          d ? /* @__PURE__ */ r(ct, { binding: d }) : /* @__PURE__ */ r("span", { className: "dq-key dq-key-none", children: "·" }),
          u && /* @__PURE__ */ r(Di, { "aria-hidden": "true" })
        ]
      }
    ),
    s && /* @__PURE__ */ r(
      bu,
      {
        actions: e,
        index: t,
        keyMap: n,
        name: a,
        onChoose: (y) => {
          i(y), g();
        },
        onClose: g
      }
    )
  ] });
}
function bu({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i,
  onClose: s
}) {
  const o = O(null), c = n.keys[t], d = fc(e, n, t), [p, u] = C(c || "q"), m = (N) => {
    var q;
    return ((q = o.current) == null ? void 0 : q.querySelector(`[data-choice="${N}"]`)) ?? null;
  };
  Rt(() => {
    var N, q, w;
    (N = m(c || d)) == null || N.focus(), (w = (q = o.current) == null ? void 0 : q.scrollIntoView) == null || w.call(q, { block: "nearest" });
  }, []);
  function b(N) {
    var q;
    pr(N) && u(N), (q = m(N)) == null || q.focus();
  }
  function g(N) {
    var D, Z, ne;
    if (N.key === "Escape") {
      N.preventDefault(), N.stopPropagation(), s();
      return;
    }
    if (N.key === "Tab") {
      const se = [...((D = o.current) == null ? void 0 : D.querySelectorAll("button[tabindex='0']")) ?? []], oe = se.indexOf(document.activeElement);
      N.preventDefault(), (Z = se[(oe + (N.shiftKey ? -1 : 1) + se.length) % se.length]) == null || Z.focus();
      return;
    }
    const q = (ne = N.target.dataset) == null ? void 0 : ne.choice, w = q ? Kn.findIndex((se) => se.includes(q)) : -1;
    if (!q || w < 0) return;
    const I = Kn[w].indexOf(q), M = (se) => se == null ? void 0 : se[Math.min(I, se.length - 1)], j = {
      ArrowLeft: Kn[w][I - 1],
      ArrowRight: Kn[w][I + 1],
      ArrowUp: M(Kn[w - 1]),
      ArrowDown: M(Kn[w + 1]),
      Home: Kn[w][0],
      End: Kn[w].at(-1)
    };
    if (!Object.hasOwn(j, N.key)) return;
    N.preventDefault();
    const G = j[N.key];
    G && b(G);
  }
  const y = (N) => {
    const q = pr(N) ? n.actionOn.get(N) : void 0;
    return q === void 0 ? null : {
      own: q === t,
      label: e[q].label.trim() || "New action",
      pinned: Ji(e[q]) === N
    };
  };
  return /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ r(
      "div",
      {
        className: "dq-key-picker-backdrop",
        "aria-hidden": "true",
        onMouseDown: (N) => {
          N.preventDefault(), s();
        }
      }
    ),
    /* @__PURE__ */ l(
      "div",
      {
        ref: o,
        role: "dialog",
        "aria-label": `Key for ${a}`,
        className: "dq-key-picker",
        onKeyDown: g,
        onMouseDown: (N) => N.preventDefault(),
        children: [
          /* @__PURE__ */ l("p", { className: "dq-key-picker-title", children: [
            "Key for ",
            /* @__PURE__ */ r("strong", { children: a })
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: ia.map((N, q) => /* @__PURE__ */ l("div", { className: "dq-key-picker-row", "data-indent": q, children: [
            N.map((w) => {
              const I = y(w), M = I ? `${I.own ? "this action" : I.label}, ${I.pinned ? "pinned" : "Auto"}` : "free";
              return /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  className: `dq-key-choice${I ? "" : " dq-key-choice-free"}${I != null && I.own ? " dq-key-choice-own" : ""}`,
                  "data-choice": w,
                  tabIndex: w === p ? 0 : -1,
                  "aria-label": `${_a(w)}: ${M}`,
                  "aria-pressed": !!(I != null && I.own && I.pinned),
                  title: I ? `${I.label} (${I.pinned ? "pinned" : "Auto"})` : void 0,
                  onFocus: () => u(w),
                  onClick: () => i(w),
                  children: [
                    /* @__PURE__ */ l("span", { className: "dq-key-choice-head", children: [
                      /* @__PURE__ */ r(ct, { binding: w }),
                      (I == null ? void 0 : I.pinned) && /* @__PURE__ */ r(Di, { "aria-hidden": "true" })
                    ] }),
                    I && /* @__PURE__ */ r("span", { className: "dq-key-choice-label", children: I.label })
                  ]
                },
                w
              );
            }),
            q === ia.length - 1 && mu.map((w) => (
              // Unavailable, yet not disabled: a browser gives a disabled button no press for
              // the panel to keep, and moves focus out of the picker. This one chooses nothing
              // and is never focused (the arrow keys and Tab pass it by).
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-key-choice dq-key-choice-free",
                  "aria-label": `${_a(w)}: not available, it steps through the grid preview`,
                  title: "Steps through the grid preview",
                  "aria-disabled": "true",
                  tabIndex: -1,
                  children: /* @__PURE__ */ r("span", { className: "dq-key-choice-head", children: /* @__PURE__ */ r(ct, { binding: w }) })
                },
                w
              )
            ))
          ] }, q)) }),
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
                "data-choice": zn,
                tabIndex: 0,
                "aria-pressed": d === zn,
                onClick: () => i(zn),
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
const yu = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function wu(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function vu(e, t) {
  if (Fn(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (zi(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function hc(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function Nu(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function qu({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: a,
  saving: i,
  expandedId: s,
  onExpand: o,
  reveal: c
}) {
  const d = _e(e), p = d !== "tag", u = e.actions, m = _r(u), b = jr(ye(() => Ja(u), [u])), g = ye(
    () => p ? Dr(u).map((x) => x.name) : [],
    [p, u]
  ), y = p && e.stayUntilGroupsAnswered === !0, N = ye(
    () => new Set(
      y ? Fd(u).map((x) => x.key) : []
    ),
    [y, u]
  ), [q, w] = C(""), [I, M] = C(!1), [j, G] = C(
    null
  ), D = lt(), Z = `${D}-from-tags`, ne = O(null), se = O(null), oe = O(null), _ = O(null), U = O(/* @__PURE__ */ new WeakMap()), S = (x) => {
    let fe = U.current.get(x);
    return fe || (fe = crypto.randomUUID(), U.current.set(x, fe)), fe;
  }, A = q.trim().toLocaleLowerCase(), V = A ? u.filter((x) => x.label.toLocaleLowerCase().includes(A)) : u, J = (x) => t({ ...e, actions: x }), ue = (x, fe) => J(u.map((Oe, Ee) => Ee === x ? fe : Oe));
  function ce(x) {
    var fe;
    return [...((fe = oe.current) == null ? void 0 : fe.querySelectorAll("[data-action-id]")) ?? []].find(
      (Oe) => Oe.dataset.actionId === x
    );
  }
  function B(x, fe) {
    const Oe = ce(x), Ee = Oe == null ? void 0 : Oe.querySelector(
      fe === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return Ee == null || Ee.focus(), !!Ee;
  }
  Rt(() => {
    var fe;
    const x = _.current;
    x && (_.current = null, (x === "add" || !B(x.id, x.part)) && ((fe = se.current) == null || fe.focus()));
  }), H(() => {
    !c || !s || (V.some((x) => x.id === s) ? B(s, "label") : (w(""), _.current = { id: s, part: "label" }));
  }, [c]);
  function T() {
    const x = Nu(d);
    w(""), J([...u, x]), o(x.id), _.current = { id: x.id, part: "label" };
  }
  function Q(x) {
    const fe = u[x], { shortcut: Oe, ...Ee } = structuredClone(fe), Ye = {
      ...Ee,
      ...Oe === zn ? { shortcut: Oe } : {},
      id: crypto.randomUUID(),
      label: `${fe.label} copy`
    };
    J([...u.slice(0, x + 1), Ye, ...u.slice(x + 1)]), o(Ye.id), _.current = { id: Ye.id, part: "label" };
  }
  function z(x) {
    const fe = u[x], Oe = V.indexOf(fe), Ee = V[Oe + 1] ?? V[Oe - 1];
    J(u.filter((Ye, Ae) => Ae !== x)), s === fe.id && o(null), _.current = Ee ? { id: Ee.id, part: "toggle" } : "add";
  }
  function te() {
    M(!1), requestAnimationFrame(() => {
      var x;
      return (x = ne.current) == null ? void 0 : x.focus();
    });
  }
  return /* @__PURE__ */ l("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ l("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ l("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ l(
          "button",
          {
            ref: se,
            type: "button",
            className: "dq-header-button",
            onClick: T,
            children: [
              /* @__PURE__ */ r(_i, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        p && /* @__PURE__ */ r(
          "button",
          {
            ref: ne,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": I,
            "aria-controls": I ? Z : void 0,
            onClick: () => {
              G(null), M(!I);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ l("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ r(ca, { "aria-hidden": "true" }),
          /* @__PURE__ */ r(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: q,
              onChange: (x) => w(x.target.value),
              onKeyDown: (x) => {
                x.key === "Escape" && q && (x.preventDefault(), x.stopPropagation(), w(""));
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
              checked: y,
              "aria-describedby": `${D}-groups-note`,
              onChange: (x) => t({
                ...e,
                stayUntilGroupsAnswered: x.target.checked ? !0 : void 0
              })
            }
          ),
          "Stay until every group is answered"
        ] }),
        /* @__PURE__ */ r("p", { className: "dq-actions-hint", id: `${D}-groups-note`, children: y && !g.length ? "No action has a group yet: give the actions of each question the same group." : "Single-item view: a plain action moves on once every group has an answer." })
      ] }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-actions-status", children: (j == null ? void 0 : j.actions) === u ? `Added ${j.count} action${j.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    p && I && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here.
    /* @__PURE__ */ r(
      "div",
      {
        onKeyDown: (x) => {
          x.key !== "Escape" || x.defaultPrevented || (x.preventDefault(), x.stopPropagation(), te());
        },
        children: /* @__PURE__ */ r(
          pu,
          {
            id: Z,
            review: e,
            disabled: i,
            onAdd: (x) => {
              const fe = [...u, ...x];
              J(fe), G({ actions: fe, count: x.length }), te();
            },
            onCancel: te
          }
        )
      }
    ),
    /* @__PURE__ */ r("div", { ref: oe, children: V.length > 0 && /* @__PURE__ */ r(
      ho,
      {
        items: V,
        getKey: (x) => x.id,
        disabled: i || !!A,
        className: "dq-action-list",
        onReorder: (x) => J(x),
        renderItem: (x, { dragHandleProps: fe, isOver: Oe }) => {
          const Ee = u.indexOf(x), Ye = s === x.id;
          return /* @__PURE__ */ r(
            Su,
            {
              action: x,
              entityType: d,
              keyButton: /* @__PURE__ */ r(
                gu,
                {
                  actions: u,
                  index: Ee,
                  keyMap: m,
                  name: x.label.trim() || "New action",
                  onChoose: (Ae) => J(zl(u, Ee, Ae))
                }
              ),
              takenPin: m.duplicatePins.has(Ee) ? x.shortcut : void 0,
              groupUnanswerable: "steps" in x && N.has(br(x.group)),
              effect: vr(x, b, n, a),
              open: Ye,
              detailId: `${D}-detail-${x.id}`,
              dragHandleProps: fe,
              isOver: Oe,
              reorderDisabled: i || !!A,
              onToggle: () => o(Ye ? null : x.id),
              onDuplicate: () => Q(Ee),
              onDelete: () => z(Ee),
              children: "steps" in x ? /* @__PURE__ */ r(
                Cu,
                {
                  action: x,
                  groupNames: g,
                  occurrence: Ie(e),
                  saving: i,
                  stepKey: S,
                  rememberStepKey: (Ae, Be) => U.current.set(Ae, S(Be)),
                  onChange: (Ae) => ue(Ee, Ae)
                }
              ) : /* @__PURE__ */ r(
                Tu,
                {
                  action: x,
                  tagGroups: n,
                  onChange: (Ae) => ue(Ee, Ae)
                }
              )
            }
          );
        }
      }
    ) }),
    u.length ? !V.length && /* @__PURE__ */ l("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      q.trim(),
      "”."
    ] }) : /* @__PURE__ */ r("p", { className: "dq-actions-empty", children: p ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function Su({
  action: e,
  entityType: t,
  keyButton: n,
  takenPin: a,
  groupUnanswerable: i = !1,
  effect: s,
  open: o,
  detailId: c,
  dragHandleProps: d,
  isOver: p,
  reorderDisabled: u,
  onToggle: m,
  onDuplicate: b,
  onDelete: g,
  children: y
}) {
  const N = e.label.trim() || "New action", q = vu(e, t), w = "steps" in e && br(e.group) ? e.group.trim() : "";
  return /* @__PURE__ */ l(
    "div",
    {
      className: `dq-action-row${o ? " dq-action-row-open" : ""}${p ? " dq-drag-over" : ""}`,
      "data-action-id": e.id,
      children: [
        /* @__PURE__ */ l("div", { className: "dq-action-row-head", children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              ...d,
              style: hc(d.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${N}`,
              title: u ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: u,
              children: /* @__PURE__ */ r(yo, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ l("div", { className: "dq-action-row-summary", onClick: m, children: [
            /* @__PURE__ */ r("span", { className: "dq-action-row-label", title: N, children: N }),
            w && /* @__PURE__ */ l("span", { className: "dq-action-row-group", title: `Group: ${w}`, children: [
              /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Group: " }),
              w
            ] }),
            !o && /* @__PURE__ */ r("span", { className: "dq-action-row-effect", children: s.map((I, M) => /* @__PURE__ */ r("span", { "data-effect-tone": I.tone, children: I.text }, M)) }),
            q && /* @__PURE__ */ l("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ r($n, { "aria-hidden": "true" }),
              q
            ] }),
            a && /* @__PURE__ */ l(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${a.toLocaleUpperCase()} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ r($n, { "aria-hidden": "true" }),
                  `${a.toLocaleUpperCase()} is pinned twice`
                ]
              }
            ),
            i && /* @__PURE__ */ l(
              "span",
              {
                className: "dq-action-problem",
                title: "No action in this group adds a tag or marks one absent, so the group is never answered and items wait there until skipped.",
                children: [
                  /* @__PURE__ */ r($n, { "aria-hidden": "true" }),
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
              "aria-label": `Duplicate ${N}`,
              title: "Duplicate",
              onClick: b,
              children: /* @__PURE__ */ r(wo, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Delete ${N}`,
              title: "Delete",
              onClick: g,
              children: /* @__PURE__ */ r(ji, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small dq-action-toggle",
              "aria-label": `${o ? "Collapse" : "Expand"} ${N}`,
              "aria-expanded": o,
              "aria-controls": o ? c : void 0,
              onClick: m,
              children: /* @__PURE__ */ r(vo, { "aria-hidden": "true" })
            }
          )
        ] }),
        o && /* @__PURE__ */ r("div", { id: c, className: "dq-action-detail", children: y })
      ]
    }
  );
}
function pc({
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
function Eu(e) {
  const { group: t, ...n } = e;
  return n;
}
function ku({
  action: e,
  groupNames: t,
  occurrence: n,
  onChange: a
}) {
  const i = lt(), s = lt(), o = br(e.group), c = (d) => a(d ? { ...e, group: d } : Eu(e));
  return /* @__PURE__ */ l("div", { className: "dq-action-group-field", children: [
    /* @__PURE__ */ l("label", { className: "dq-action-field", children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", children: "Group" }),
      /* @__PURE__ */ r(
        "input",
        {
          className: "dq-input dq-action-group-input",
          list: i,
          placeholder: "No group",
          autoComplete: "off",
          spellCheck: !1,
          "aria-describedby": s,
          value: e.group ?? "",
          onChange: (d) => c(d.target.value),
          onBlur: (d) => {
            const p = d.target.value.trim();
            p !== d.target.value && c(p);
          }
        }
      ),
      /* @__PURE__ */ r("datalist", { id: i, children: t.filter((d) => br(d) !== o).map((d) => /* @__PURE__ */ r("option", { value: d }, d)) })
    ] }),
    /* @__PURE__ */ r("p", { className: "dq-actions-hint dq-action-field-help", id: s, children: n ? "A group is one question with one answer per item; a chosen performer holding two different answers is marked Mixed." : "A group is one question with one answer per item." })
  ] });
}
function Cu({
  action: e,
  groupNames: t,
  occurrence: n,
  saving: a,
  stepKey: i,
  rememberStepKey: s,
  onChange: o
}) {
  const c = lt(), d = O(null), p = O(null);
  Rt(() => {
    var b, g;
    const m = p.current;
    m != null && (p.current = null, (g = (b = d.current) == null ? void 0 : b.querySelector(`[data-step-index="${m}"] input`)) == null || g.focus());
  });
  const u = (m) => o({ ...e, steps: m });
  return /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ r(pc, { action: e, onChange: (m) => o({ ...e, label: m }) }),
    /* @__PURE__ */ r(
      ku,
      {
        action: e,
        groupNames: t,
        occurrence: n,
        onChange: o
      }
    ),
    /* @__PURE__ */ l("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": c, children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", id: c, children: "Steps" }),
      /* @__PURE__ */ l("div", { className: "dq-steps", ref: d, children: [
        e.steps.length > 0 ? /* @__PURE__ */ r(
          ho,
          {
            items: e.steps,
            getKey: i,
            disabled: a,
            className: "dq-step-list",
            onReorder: u,
            renderItem: (m, { index: b, dragHandleProps: g, isOver: y }) => /* @__PURE__ */ r(
              Au,
              {
                step: m,
                index: b,
                dragHandleProps: g,
                isOver: y,
                saving: a,
                onChange: (N) => {
                  s(N, m), u(e.steps.map((q, w) => w === b ? N : q));
                },
                onRemove: () => u(e.steps.filter((N, q) => q !== b))
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
              p.current = e.steps.length, u([...e.steps, { mode: "ADD", tagIds: [] }]);
            },
            children: [
              /* @__PURE__ */ r(_i, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function Au({
  step: e,
  index: t,
  dragHandleProps: n,
  isOver: a,
  saving: i,
  onChange: s,
  onRemove: o
}) {
  const c = t + 1;
  return /* @__PURE__ */ l(
    "div",
    {
      className: `dq-step${a ? " dq-drag-over" : ""}`,
      "data-step-tone": wu(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            ...n,
            style: hc(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${c}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ r(yo, { "aria-hidden": "true" }),
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
            onChange: (d) => s({ ...e, mode: d.target.value }),
            children: yu.map(({ mode: d, label: p }) => /* @__PURE__ */ r("option", { value: d, children: p }, d))
          }
        ),
        /* @__PURE__ */ r(
          Qn,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (d) => s({ ...e, tagIds: d }),
            placeholder: "Add tag…",
            inputAriaLabel: `Add a tag to step ${c}`,
            containerClassName: "dq-chip-input dq-step-tags",
            inputClassName: "dq-chip-input-field",
            allowCreate: !1,
            disabled: i
          }
        ),
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            className: "dq-icon-button dq-icon-button-small",
            "aria-label": `Remove step ${c}`,
            title: "Remove step",
            onClick: o,
            children: /* @__PURE__ */ r(la, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function Tu({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const a = e.effect, i = a.mode === "SET_TAG_GROUP" ? `group:${a.tagGroupId}` : a.mode, s = a.mode === "SET_TAG_GROUP" && !t.some((o) => o.id === a.tagGroupId);
  return /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ r(pc, { action: e, onChange: (o) => n({ ...e, label: o }) }),
    /* @__PURE__ */ l("label", { className: "dq-action-field", children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", children: "Effect" }),
      /* @__PURE__ */ l(
        "select",
        {
          className: "dq-select",
          "aria-label": "Tag group action",
          value: i,
          onChange: (o) => {
            const c = o.target.value;
            n({
              ...e,
              effect: c === "SKIP" ? { mode: "SKIP" } : c === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : { mode: "SET_TAG_GROUP", tagGroupId: Number(c.slice(6)) }
            });
          },
          children: [
            /* @__PURE__ */ r("option", { value: "SKIP", children: "Skip" }),
            /* @__PURE__ */ r("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
            s && /* @__PURE__ */ r("option", { value: i, disabled: !0, children: "Unavailable tag group" }),
            t.map((o) => /* @__PURE__ */ r("option", { value: `group:${o.id}`, children: o.name }, o.id))
          ]
        }
      )
    ] })
  ] });
}
const mc = ml(!1);
function Iu({ children: e }) {
  return /* @__PURE__ */ r(mc.Provider, { value: !0, children: e });
}
function Gt({ tag: e, name: t }) {
  const n = gl(mc), a = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ r(yl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: a ?? void 0 });
}
function Ru({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, a = En(je(e)).queue, i = (s) => t({ ...e, occurrence: { ...n, ...s } });
  return /* @__PURE__ */ l("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
    /* @__PURE__ */ l("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      a,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ r(
      Qn,
      {
        entityType: "tag",
        values: n.tagIds,
        onChange: (s) => i({ tagIds: s }),
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
          onChange: (s) => i({ multiple: s.target.checked })
        }
      ),
      "Allow multiple tags, for example when something changes part-way through the ",
      a
    ] }),
    /* @__PURE__ */ r("p", { children: "Save & next performer applies the selected tags and advances. Save choices stays on the performer. Skip only moves the cursor; eligibility comes from the filters." })
  ] });
}
function $u({
  review: e,
  onChange: t
}) {
  const n = En(je(e)).many, a = e.occurrence, i = Ao(a), s = ["any", "isNull"].includes(a.condition) ? [] : a.conditionTagIds, o = ha([
    ...i.flatMap((u) => [u.tagId, ...u.categoryTagId ? [u.categoryTagId] : []]),
    ...s
  ]), c = (u) => {
    var m;
    return ((m = o[u]) == null ? void 0 : m.name) ?? (o[u] === null ? `Unavailable tag ${u}` : `Tag ${u}`);
  }, d = (u) => t({ ...e, occurrence: Vl(a, u) }), p = (u, m) => d(
    i.map(
      (b, g) => g !== u ? b : m === void 0 ? { tagId: b.tagId } : { tagId: b.tagId, categoryTagId: m }
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
    i.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-flag-pairs", "aria-label": "Performer flags", children: i.map((u, m) => {
      const b = c(u.tagId), g = i.filter(
        (q, w) => w !== m && q.tagId === u.tagId
      ), y = (q) => g.some((w) => w.categoryTagId === q), N = `${u.tagId}#${i.slice(0, m).filter((q) => q.tagId === u.tagId).length}`;
      return /* @__PURE__ */ l("li", { className: "dq-flag-pair", children: [
        /* @__PURE__ */ l("span", { className: "dq-flag-pair-tag", children: [
          /* @__PURE__ */ r(Mn, { "aria-hidden": "true" }),
          /* @__PURE__ */ r(Gt, { tag: o[u.tagId], name: b })
        ] }),
        /* @__PURE__ */ l("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ r("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ r(
            ks,
            {
              entityType: "tag",
              value: u.categoryTagId,
              onChange: (q) => p(m, q),
              placeholder: "Whole review",
              allowCreate: !1,
              selectedDisplay: "input",
              inputClassName: "dq-input",
              inputAriaLabel: `Affects, ${b}`,
              excludeIds: g.flatMap(
                (q) => q.categoryTagId === void 0 ? [] : [q.categoryTagId]
              )
            }
          )
        ] }),
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            className: "dq-icon-button",
            "aria-label": `Remove flag ${b}`,
            title: "Remove flag",
            onClick: () => d(i.filter((q, w) => w !== m)),
            children: /* @__PURE__ */ r(ji, { "aria-hidden": "true" })
          }
        ),
        s.length > 0 && /* @__PURE__ */ l(
          "div",
          {
            className: "dq-flag-suggestions",
            role: "group",
            "aria-label": `Suggested categories for ${b}`,
            children: [
              /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "Condition categories" }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": u.categoryTagId === void 0,
                  disabled: y(void 0),
                  onClick: () => p(m, void 0),
                  children: "Whole review"
                }
              ),
              s.map((q) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": u.categoryTagId === q,
                  disabled: y(q),
                  onClick: () => p(m, q),
                  children: c(q)
                },
                q
              ))
            ]
          }
        )
      ] }, N);
    }) }),
    /* @__PURE__ */ r(
      ks,
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
const gc = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, bc = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, Ou = {
  video: Ka,
  audio: So,
  tag: qo,
  performerOccurrence: No,
  audioPerformerOccurrence: Rl
};
function yc({ entityType: e }) {
  const t = Ou[e];
  return /* @__PURE__ */ r(t, { role: "img", "aria-label": gc[e] });
}
const Mu = 2e6;
function wc(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), a = document.createElement("a");
  a.href = n, a.download = t, a.click(), URL.revokeObjectURL(n);
}
function Fu(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function ss(e) {
  wc([e], Fu(e));
}
async function xu(e) {
  if (e.size > Mu) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return ua(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function xr(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (a, i) => i && typeof i == "object" && !Array.isArray(i) ? Object.fromEntries(
      Object.keys(i).sort().map((s) => [s, i[s]])
    ) : i
  );
}
function vc({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: a,
  nameRef: i,
  autoFocus: s = !1
}) {
  return /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ r("span", { children: "Entity type" }),
      /* @__PURE__ */ r(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: _e(e),
          disabled: n,
          onChange: (o) => a == null ? void 0 : a(o.target.value),
          children: To.map((o) => /* @__PURE__ */ r("option", { value: o, children: bc[o] }, o))
        }
      )
    ] }),
    /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ r("span", { children: "Review name" }),
      /* @__PURE__ */ r(
        "input",
        {
          ref: i,
          className: "dq-input",
          "aria-label": "Review name",
          autoFocus: s,
          value: e.name,
          onChange: (o) => t({ ...e, name: o.target.value })
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
          onChange: (o) => t({ ...e, description: o.target.value })
        }
      )
    ] })
  ] });
}
function Pu(e, t) {
  const n = _e(e), a = ["Review"];
  return (n === "video" || n === "tag") && a.push("Appearance"), a.push("Actions"), t && a.push("Tag choices"), a;
}
function Lu({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = O(null), a = O(null), i = lt(), s = lt();
  return H(() => {
    var o;
    n.current && !n.current.open && n.current.showModal(), (o = a.current) == null || o.focus();
  }, []), /* @__PURE__ */ l(
    "dialog",
    {
      ref: n,
      className: "dq-confirm-dialog",
      "aria-labelledby": i,
      "aria-describedby": s,
      "aria-modal": "true",
      onCancel: (o) => {
        o.preventDefault(), e();
      },
      onClose: e,
      children: [
        /* @__PURE__ */ r("h2", { id: i, children: "Discard unsaved changes?" }),
        /* @__PURE__ */ r("p", { id: s, children: "Closing the editor leaves the review as it was last saved." }),
        /* @__PURE__ */ l("div", { className: "dq-confirm-dialog-actions", children: [
          /* @__PURE__ */ r("button", { ref: a, type: "button", className: "dq-button", onClick: e, children: "Keep editing" }),
          /* @__PURE__ */ r("button", { type: "button", className: "dq-button dq-button-danger", onClick: t, children: "Discard" })
        ] })
      ]
    }
  );
}
function Nc({
  draft: e,
  onChange: t,
  direction: n,
  onDirectionChange: a,
  tagGroups: i,
  trees: s,
  saving: o,
  saveDisabled: c = !1,
  error: d,
  dirty: p,
  criteriaChanged: u = !1,
  notices: m,
  onSave: b,
  onCancel: g,
  drawerRef: y
}) {
  const [N, q] = C("Review"), [w] = C(
    () => Ie(e) && e.occurrence.tagIds.length > 0
  ), [I, M] = C(""), [j, G] = C(null), [D, Z] = C(0), [ne, se] = C(!1), oe = O(null), _ = O(null), U = O(null), S = Pu(e, w), A = _e(e), V = ye(() => xr(e), [e]);
  H(() => M(""), [V]), H(() => {
    var Q, z;
    if (ne) return;
    const B = oe.current;
    if (oe.current = null, !B) return;
    (z = B.isConnected && !!((Q = U.current) != null && Q.contains(B)) && !(B instanceof HTMLButtonElement && B.disabled) ? B : U.current) == null || z.focus({ preventScroll: !0 });
  }, [ne]);
  function J() {
    if (!(o || ne)) {
      if (!p) {
        g();
        return;
      }
      oe.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, se(!0);
    }
  }
  function ue() {
    const B = { ...e, name: e.name.trim() }, T = sa(B);
    if (!T) {
      M(""), b();
      return;
    }
    if (M(T), !B.name) {
      q("Review"), requestAnimationFrame(() => {
        var z;
        return (z = _.current) == null ? void 0 : z.focus();
      });
      return;
    }
    const Q = e.actions.find(
      (z) => !Fn(z, A)
    );
    Q && (q("Actions"), G(Q.id), Z((z) => z + 1));
  }
  const ce = I || d;
  return /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ l(
      "aside",
      {
        ref: (B) => {
          U.current = B, y && (y.current = B);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (B) => {
          B.key !== "Escape" || B.defaultPrevented || o || (B.preventDefault(), B.stopPropagation(), J());
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
                disabled: o,
                onClick: J,
                children: /* @__PURE__ */ r(la, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ r(
            wl,
            {
              tabs: S.map((B) => ({
                key: B,
                label: B,
                count: B === "Actions" ? e.actions.length : void 0
              })),
              activeTab: N,
              onTabChange: (B) => q(B)
            }
          ) }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-body", children: /* @__PURE__ */ l("fieldset", { className: "dq-drawer-fields", disabled: o, children: [
            /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review settings" }),
            /* @__PURE__ */ l(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Review",
                "aria-label": "Review",
                children: [
                  /* @__PURE__ */ r(
                    vc,
                    {
                      review: e,
                      onChange: t,
                      entityTypeLocked: !0,
                      nameRef: _,
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
                        onChange: (B) => a(B.target.value),
                        children: [
                          /* @__PURE__ */ r("option", { value: "end", children: "Start from the end" }),
                          /* @__PURE__ */ r("option", { value: "beginning", children: "Start from the beginning" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ r("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
                  ] }),
                  Ie(e) && /* @__PURE__ */ r($u, { review: e, onChange: t }),
                  /* @__PURE__ */ r("div", { children: /* @__PURE__ */ r(
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
            S.includes("Appearance") && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Appearance",
                "aria-label": "Appearance",
                children: /* @__PURE__ */ r(Du, { review: e, onChange: t })
              }
            ),
            /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel dq-actions-panel",
                role: "tabpanel",
                hidden: N !== "Actions",
                "aria-label": "Actions",
                children: /* @__PURE__ */ r(
                  qu,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: i,
                    trees: s,
                    saving: o,
                    expandedId: j,
                    onExpand: G,
                    reveal: D
                  }
                )
              }
            ),
            w && Ie(e) && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ r(Ru, { review: e, onChange: t })
              }
            )
          ] }) }),
          (ce || m) && /* @__PURE__ */ l("div", { className: "dq-drawer-notices", children: [
            m,
            ce && /* @__PURE__ */ l("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ r($n, { "aria-hidden": "true" }),
              ce
            ] })
          ] }),
          /* @__PURE__ */ l("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ r("p", { className: "dq-drawer-dirty", children: p ? u ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: o, onClick: J, children: "Cancel" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button primary",
                "aria-busy": o || void 0,
                "aria-disabled": o || void 0,
                disabled: !o && c,
                onClick: () => {
                  o || ue();
                },
                children: "Save review"
              }
            )
          ] })
        ]
      }
    ),
    ne && /* @__PURE__ */ r(
      Lu,
      {
        onKeepEditing: () => se(!1),
        onDiscard: () => {
          oe.current = null, se(!1), g();
        }
      }
    )
  ] });
}
function Du({
  review: e,
  onChange: t
}) {
  const n = lt(), a = e.view, i = (u) => t({ ...e, view: { ...a, ...u } }), s = /* @__PURE__ */ l("label", { className: "dq-checkbox dq-setting-indent", children: [
    /* @__PURE__ */ r(
      "input",
      {
        type: "checkbox",
        checked: a.selectAllOnLoad ?? !1,
        onChange: (u) => i({ selectAllOnLoad: u.target.checked ? !0 : void 0 })
      }
    ),
    "Select every card when a page opens"
  ] });
  if (_e(e) === "tag")
    return /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ r(
        Gs,
        {
          label: "View",
          value: a.displayMode === "list" ? "list" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "list", label: "List" }
          ],
          onChange: (u) => i({ displayMode: u })
        }
      ),
      s,
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review opens with these. The Cards / List switch in the header changes only the current visit." })
    ] });
  const o = e.presentation ?? {}, c = (u) => t({ ...e, presentation: { ...o, ...u } }), d = o.annotations ?? [], p = a.reviewMode ?? "single";
  return /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ l("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ r(
          Ks,
          {
            name: `${n}-layout-choice`,
            checked: p === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ r(_u, {}),
            onChoose: () => i({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ r(
          Ks,
          {
            name: `${n}-layout-choice`,
            checked: p === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ r(ju, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ r(
        Gs,
        {
          label: "Cards",
          value: a.displayMode === "wall" ? "wall" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "wall", label: "Wall" }
          ],
          onChange: (u) => i({ displayMode: u })
        }
      ),
      s,
      /* @__PURE__ */ l("div", { className: "dq-setting-row", role: "group", "aria-labelledby": `${n}-details`, children: [
        /* @__PURE__ */ r("span", { className: "dq-setting-name", id: `${n}-details`, children: "Card details" }),
        /* @__PURE__ */ r("div", { className: "dq-setting-options", children: [
          ["date", "Date"],
          ["studio", "Studio"],
          ["performers", "Performers"],
          ["tags", "Tags"]
        ].map(([u, m]) => /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: d.includes(u),
              onChange: (b) => c({
                annotations: b.target.checked ? [...d, u] : d.filter((g) => g !== u)
              })
            }
          ),
          m
        ] }, u)) })
      ] }),
      d.includes("tags") && /* @__PURE__ */ l("div", { className: "dq-setting-row dq-setting-row-top", children: [
        /* @__PURE__ */ r("span", { className: "dq-setting-name", children: "Tags on cards" }),
        /* @__PURE__ */ l("div", { className: "dq-setting-value", children: [
          /* @__PURE__ */ r(
            Qn,
            {
              entityType: "tag",
              values: o.annotationParents ?? [],
              onChange: (u) => c({ annotationParents: u }),
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
        Qn,
        {
          entityType: "tag",
          values: o.binParents ?? [],
          onChange: (u) => c({ binParents: u }),
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
function Gs({
  label: e,
  value: t,
  options: n,
  onChange: a
}) {
  const i = lt();
  return /* @__PURE__ */ l("div", { className: "dq-setting-row", children: [
    /* @__PURE__ */ r("span", { className: "dq-setting-name", id: i, children: e }),
    /* @__PURE__ */ r("div", { className: "dq-segmented", role: "group", "aria-labelledby": i, children: n.map((s) => /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        "aria-pressed": t === s.value,
        onClick: () => t !== s.value && a(s.value),
        children: s.label
      },
      s.value
    )) })
  ] });
}
function Ks({
  name: e,
  checked: t,
  title: n,
  text: a,
  picture: i,
  onChoose: s
}) {
  const o = lt(), c = lt();
  return /* @__PURE__ */ l("label", { className: "dq-layout-card", children: [
    i,
    /* @__PURE__ */ l("span", { className: "dq-layout-card-name", children: [
      /* @__PURE__ */ r(
        "input",
        {
          type: "radio",
          name: e,
          checked: t,
          "aria-labelledby": o,
          "aria-describedby": c,
          onChange: s
        }
      ),
      /* @__PURE__ */ r("span", { id: o, children: n })
    ] }),
    /* @__PURE__ */ r("span", { className: "dq-layout-card-text", id: c, children: a })
  ] });
}
function _u() {
  return /* @__PURE__ */ l("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function ju() {
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
const ki = "The queue differs from the saved review.";
function qc({
  name: e,
  description: t,
  entityType: n,
  onBack: a,
  backDisabled: i,
  onEdit: s,
  editDisabled: o,
  editing: c = !1,
  toolbar: d,
  trailing: p,
  trailingEnd: u,
  queueChange: m,
  queueDiffers: b,
  chipsStart: g,
  chipsAfter: y,
  chipsEnd: N
}) {
  const q = O(null);
  Vu(q);
  const w = Ju(q), [I, M] = C({ differs: b, text: "" });
  return I.differs !== b && M({
    differs: b,
    text: b ? I.differs === !1 ? ki : I.text : ""
  }), /* @__PURE__ */ l("header", { ref: q, className: "dq-review-header", children: [
    /* @__PURE__ */ l("div", { className: "dq-review-header-lead", children: [
      a && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: i,
          onClick: a,
          children: /* @__PURE__ */ r(da, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-type", title: gc[n], children: /* @__PURE__ */ r(yc, { entityType: n }) }),
      /* @__PURE__ */ r("h1", { title: t || e, children: e }),
      t && /* @__PURE__ */ r("p", { className: "dq-sr-only", children: t }),
      s && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button dq-icon-button-small",
          "aria-label": "Edit review",
          title: "Edit review",
          "aria-haspopup": "dialog",
          "aria-expanded": c,
          disabled: o,
          onClick: s,
          children: /* @__PURE__ */ r(Pr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    d,
    /* @__PURE__ */ l("div", { className: "dq-review-header-trail", children: [
      p,
      m && /* @__PURE__ */ r(Uu, { change: m, onPress: w }),
      u
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    g,
    y && /* @__PURE__ */ r("div", { className: "dq-review-chips-after", children: y }),
    N && /* @__PURE__ */ r("div", { className: "dq-review-chips-end", children: N }),
    /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: I.text })
  ] });
}
function Uu({
  change: e,
  onPress: t
}) {
  const n = lt(), a = lt(), i = `${ki} Save these filters to the review.`, s = e.onSave ? `${ki} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  return /* @__PURE__ */ l(me, { children: [
    e.onSave && /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-header-button dq-queue-button",
        title: i,
        "aria-describedby": n,
        disabled: e.saveDisabled,
        onClick: () => {
          var o;
          t(), (o = e.onSave) == null || o.call(e);
        },
        children: [
          /* @__PURE__ */ r(Ml, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-queue-label", children: "Save to review" }),
          /* @__PURE__ */ r("span", { id: n, hidden: !0, children: i })
        ]
      }
    ),
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-header-button dq-queue-button",
        title: s,
        "aria-describedby": a,
        disabled: e.resetDisabled,
        onClick: () => {
          t(), e.onReset();
        },
        children: [
          /* @__PURE__ */ r(Fl, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-queue-label", children: "Reset" }),
          /* @__PURE__ */ r("span", { id: a, hidden: !0, children: s })
        ]
      }
    )
  ] });
}
const Gu = ["queue", "summary", "name", "layout", "range"], Ku = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, Bu = "(min-width: 1400px)";
function Ma(e) {
  const t = e.querySelector(".dq-review-header-lead"), n = e.querySelector(".dq-review-header-trail");
  if (!t || !n) return !0;
  const a = t.getBoundingClientRect();
  return !a.height || n.getBoundingClientRect().top < a.bottom;
}
function Bs(e, t) {
  const n = e.querySelector(".dq-review-header-lead h1"), a = () => {
    e.removeAttribute("data-compact"), n == null || n.style.removeProperty("max-width");
  };
  if (a(), !t) return !0;
  const i = Gu.filter(
    (s) => e.querySelector(Ku[s])
  );
  for (let s = 1; s <= i.length && !Ma(e); s++) {
    if (e.dataset.compact = i.slice(0, s).join(" "), i[s - 1] !== "name" || !n) continue;
    const o = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !Ma(e) && c > 6 * o; )
      c = Math.max(6 * o, c - o), n.style.maxWidth = `${c}px`;
  }
  return Ma(e) ? !0 : (a(), !1);
}
function Vu(e) {
  const t = ac(Bu), [n, a] = C(0), i = O(!1);
  Rt(() => {
    e.current && (i.current = !Bs(e.current, t));
  }, [e, t, n]), Rt(() => {
    const s = e.current;
    s && t && !i.current && !Ma(s) && (i.current = !Bs(s, t));
  }), H(() => {
    const s = e.current;
    if (!s || !t || typeof ResizeObserver > "u") return;
    const o = new ResizeObserver(() => a((c) => c + 1));
    o.observe(s);
    for (const c of s.querySelectorAll(".dq-review-header-lead, .dq-review-header-trail"))
      o.observe(c);
    return () => o.disconnect();
  }, [e, t]);
}
function Ju(e) {
  const t = O(!1);
  return H(() => {
    const n = e.current;
    if (!t.current || !n) return;
    const a = document.activeElement, i = (a == null ? void 0 : a.closest(".dq-queue-button")) ?? null;
    if (a && a !== document.body && !i) {
      t.current = !1;
      return;
    }
    if (i && !i.disabled) return;
    const s = n.querySelector(".dq-queue-button") ?? n.querySelector(".dq-review-header-trail .dq-menu > button");
    !s || s.disabled || (t.current = !1, s.focus());
  }), () => {
    t.current = !0;
  };
}
function Sc({
  page: e,
  pages: t,
  onPage: n
}) {
  const [a, i] = C(!1), [s, o] = C(""), c = O(null), d = O(null);
  H(() => {
    var m;
    a && ((m = c.current) == null || m.select());
  }, [a]);
  const p = (m) => {
    i(!1), m && requestAnimationFrame(() => {
      var b;
      return (b = d.current) == null ? void 0 : b.focus();
    });
  }, u = () => {
    const m = Math.round(Number(s));
    p(!0), Number.isFinite(m) && m >= 1 && m !== e && n(Math.min(t, m));
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
        children: /* @__PURE__ */ r(da, { "aria-hidden": "true" })
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
        value: s,
        onChange: (m) => o(m.target.value),
        onKeyDown: (m) => {
          m.key === "Enter" ? (m.preventDefault(), u()) : m.key === "Escape" && (m.preventDefault(), m.stopPropagation(), p(!0));
        },
        onBlur: () => p(!1)
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
          o(String(e)), i(!0);
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
        children: /* @__PURE__ */ r(Eo, { "aria-hidden": "true" })
      }
    )
  ] });
}
function Ec({
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
          /* @__PURE__ */ r(Ol, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ r(Ui, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-layout-label", children: "Grid" })
        ]
      }
    )
  ] });
}
function zu({
  options: e,
  value: t,
  disabled: n,
  onChange: a
}) {
  return /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-icons", role: "group", "aria-label": "Card view", children: e.map((i) => /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      "aria-label": i.label,
      title: i.label,
      "aria-pressed": t === i.value,
      disabled: n,
      onClick: () => t !== i.value && a(i.value),
      children: i.icon
    },
    i.value
  )) });
}
function os({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [a, i] = C(!1), [s, o] = C(!1), c = O(null), d = O(null), p = lt();
  Rt(() => {
    if (!a || !d.current || !c.current) return;
    const b = c.current.getBoundingClientRect(), g = d.current.offsetHeight + 12, y = window.innerHeight - b.bottom;
    o(y < g && b.top > y);
  }, [a]), H(() => {
    var b, g;
    a && ((g = (b = d.current) == null ? void 0 : b.querySelector('[role="menuitem"]:not(:disabled)')) == null || g.focus({ preventScroll: !0 }));
  }, [a]), H(() => {
    t && i(!1);
  }, [t]);
  const u = (b = !0) => {
    var g;
    i(!1), b && ((g = c.current) == null || g.focus());
  };
  return /* @__PURE__ */ l("div", { className: `dq-menu${a ? " dq-menu-open" : ""}`, onKeyDown: (b) => {
    var N, q;
    if (!a) return;
    const g = [
      ...((N = d.current) == null ? void 0 : N.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], y = g.indexOf(document.activeElement);
    if (b.key === "Escape")
      b.preventDefault(), b.stopPropagation(), u();
    else if (b.key === "Tab")
      u(!1);
    else if (b.key === "ArrowDown" || b.key === "ArrowUp") {
      if (b.preventDefault(), !g.length) return;
      const w = b.key === "ArrowDown" ? 1 : -1;
      g[(y + w + g.length) % g.length].focus();
    } else (b.key === "Home" || b.key === "End") && (b.preventDefault(), (q = g.at(b.key === "Home" ? 0 : -1)) == null || q.focus());
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
        onClick: () => i((b) => !b),
        children: /* @__PURE__ */ r($l, { "aria-hidden": "true" })
      }
    ),
    a && /* @__PURE__ */ l(me, { children: [
      /* @__PURE__ */ r("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => u(!1) }),
      /* @__PURE__ */ r(
        "div",
        {
          ref: d,
          id: p,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${s ? " dq-menu-list-up" : ""}`,
          children: e.map((b) => /* @__PURE__ */ l(xi, { children: [
            b.separated && /* @__PURE__ */ r("div", { role: "separator", className: "dq-menu-separator" }),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: b.danger ? "dq-menu-danger" : void 0,
                disabled: b.disabled,
                onClick: () => {
                  u(), b.onSelect();
                },
                children: [
                  b.icon,
                  b.label
                ]
              }
            )
          ] }, b.label))
        }
      )
    ] })
  ] });
}
function ja(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function cs(e) {
  return String(e.type).toLowerCase() === "tag";
}
function ls(e) {
  return !!String(e ?? "").trim();
}
function ds(e) {
  return [
    ...new Set(
      ja(e.customFieldCriteria).filter(cs).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !ls(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function us(e, t) {
  const n = ja(e.customFieldCriteria);
  if (!n.length) return e;
  let a = !1;
  const i = n.map((s) => {
    if (!cs(s)) return s;
    const o = { ...s };
    for (const [c, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const p = t[String(s[c] ?? "")];
      p && !ls(s[d]) && (o[d] = p, a = !0);
    }
    return o;
  });
  return a ? { ...e, customFieldCriteria: i } : e;
}
function kc(e, t, n) {
  const a = ja(e.customFieldCriteria);
  if (!a.length) return e;
  const i = ja(n.customFieldCriteria), s = (d, p) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (u) => (d[u] ?? void 0) === (p[u] ?? void 0)
  );
  let o = !1;
  const c = a.map((d) => {
    if (!cs(d)) return d;
    const p = i.find((m) => s(m, d));
    if (!p) return d;
    const u = { ...d };
    for (const [m, b] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const g = t[String(d[m] ?? "")];
      g && d[b] === g && !ls(p[b]) && (delete u[b], o = !0);
    }
    return u;
  });
  return o ? { ...e, customFieldCriteria: c } : e;
}
async function Wu(e, t, n) {
  if (!Fn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const a = je(e), i = n.steps.some((c) => On(c.mode)) ? await Td(a) : "", s = await Yi(n);
  let o = t.applications;
  for (const c of [
    ...s.filter((d) => !On(d.mode)),
    ...s.filter((d) => On(d.mode))
  ]) {
    const d = (p) => Id(
      i,
      a,
      t.media.id,
      t.performer.id,
      c.tagIds,
      p
    );
    (c.mode === "MARK_PRESENT" || c.mode === "CLEAR_ABSENCE") && await d("REMOVE"), c.mode !== "CLEAR_ABSENCE" && (o = await Ic(
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
  return o;
}
async function fs(e, t) {
  const n = e.occurrence;
  if (Bi(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const a = /* @__PURE__ */ new Set(), { _filterExpression: i, ...s } = n.performerFilter;
  for (let o = 1; ; o++) {
    const c = await de("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        xn({
          findFilter: { page: o, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: s,
          filterExpression: i
        })
      )
    });
    if (c.items.forEach((d) => a.add(d.id)), o * 1e3 >= c.totalCount) return [...a];
    if (!c.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Cc(e) {
  return aa(e.condition) && e.hideConfirmedAbsent !== !1;
}
function hs(e, t) {
  const { _filterExpression: n, ...a } = e.view.objectFilter, i = e.occurrence, s = {
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
  }, o = Cc(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
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
            { filter: a },
            { filter: { performerFilterCriterion: s } },
            ...o ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: Ba,
                      type: "text",
                      modifier: "notEquals",
                      value: o
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
async function ps(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => Va([n], t))
  );
}
function Ac(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function Qu(e, t, n = e.conditionTagIds.map((a) => [a])) {
  const a = new Set(t), i = (s) => s.some((o) => a.has(o));
  switch (e.condition) {
    case "any":
      return !0;
    case "isNull":
      return a.size === 0;
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
function Hu(e, t, n, a, i) {
  if (!Cc(e)) return !1;
  const s = Uo(t, n);
  return e.conditionTagIds.every(
    (o, c) => s.includes(o) || i[c].some((d) => a.includes(d))
  );
}
async function Tc(e, t, n, a) {
  if ((t == null ? void 0 : t.length) === 0 || Ac(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = je(e), s = await ta(
    hs(e, t),
    { ...e.view.filter, page: n },
    a
  ), o = t === null ? null : new Set(t), c = e.occurrence, d = s.items.length ? await ps(c, a) : [], p = new Array(s.items.length);
  let u = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, s.items.length) }, async () => {
      for (; u < s.items.length; ) {
        const m = u++, b = s.items[m], g = await de(
          `/api/tagapplications?hostType=${i}&hostId=${b.id}&contextType=performer`,
          { signal: a }
        );
        p[m] = b.performers.filter((y) => o === null || o.has(y.id)).flatMap((y) => {
          const N = g.filter(
            (w) => w.hostType === i && w.hostId === b.id && w.contextType === "performer" && w.contextId === y.id
          ), q = N.map((w) => w.tag.id);
          return Qu(e.occurrence, q, d) && !Hu(c, b, y.id, q, d) ? [
            {
              key: `${b.id}:${y.id}`,
              media: b,
              performer: y,
              applications: N
            }
          ] : [];
        });
      }
    })
  ), { items: p.flat(), totalCount: s.totalCount };
}
async function Ic(e, t, n) {
  const a = new Set(e.occurrence.tagIds);
  if (n.some((p) => !a.has(p)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = je(e), s = await yi(i, t.media.id);
  if (!s.performers.some(
    (p) => p.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const o = `/api/tagapplications?hostType=${i}&hostId=${s.id}&contextType=performer&contextId=${t.performer.id}`, c = (await de(o)).filter(
    (p) => p.hostType === i && p.hostId === s.id && p.contextType === "performer" && p.contextId === t.performer.id
  ), d = new Set(n);
  try {
    for (const p of d)
      c.some((u) => u.tag.id === p) || await de("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: i,
          hostId: s.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: p,
          sourceKey: "user"
        })
      });
    for (const p of c)
      a.has(p.tag.id) && !d.has(p.tag.id) && await de(`/api/tagapplications/${p.id}`, {
        method: "DELETE"
      });
    return await de(o);
  } catch (p) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${p instanceof Error ? p.message : "Request failed."}`
    );
  }
}
function Lr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function Yu(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function fn(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const d = n ? Uo(
      await yi(e, t.media.id),
      t.occurrence.performer.id
    ) : [], p = (await de(Yu(e, t))).filter(
      (u) => u.hostType === e && u.hostId === t.media.id && u.contextType === "performer" && u.contextId === t.occurrence.performer.id
    );
    return Ei(p.map((u) => u.tag)), {
      ids: [...new Set(p.map((u) => u.tag.id))],
      names: [...new Set(p.map((u) => u.tag.name))],
      absent: d,
      applications: p
    };
  }
  const a = await yi(e, t.media.id), i = (a.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  );
  Ei(i);
  const s = Object.keys(a.customFields ?? {}).find(
    (d) => d.toLowerCase() === La
  ) ?? La, o = ((c = a.customFields) == null ? void 0 : c[s]) ?? [];
  if (!Array.isArray(o) || o.some((d) => !Number.isSafeInteger(d)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${e} before editing.`
    );
  return {
    ids: i.map((d) => d.id),
    names: i.map((d) => d.name),
    absent: o,
    tags: i
  };
}
async function ms(e, t, n) {
  if (t.occurrence && Ie(e))
    await Ic(
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
    for (const [a, i] of [
      ["ADD", n.added],
      ["REMOVE", n.removed]
    ])
      i.length && await de(
        `/api/${Yn(je(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: a, tagIds: i })
        }
      );
}
async function Xu(e, t, n) {
  t.occurrence && Ie(e) ? await Wu(e, t.occurrence, n) : await Go(je(e), n, [t.media.id]);
}
function Ci(e, t, n, a) {
  const i = (s) => s.filter((o) => a.includes(o));
  return {
    item: e,
    before: t,
    after: n,
    tags: Lr(i(t.ids), i(n.ids)),
    absence: Lr(i(t.absent), i(n.absent))
  };
}
function Zu(e, t) {
  var n;
  for (const [a, i] of [
    [e.tags, t.ids],
    [e.absence, t.absent]
  ])
    if (a.added.some((s) => !i.includes(s)) || a.removed.some((s) => i.includes(s)))
      throw new Error(
        "Undo conflict: affected tags changed since this operation. Inspect the item; no undo changes were made."
      );
  if (t.applications)
    for (const a of e.tags.added) {
      const i = (n = e.after.applications) == null ? void 0 : n.filter((o) => o.tag.id === a).map((o) => o.id).sort(), s = t.applications.filter((o) => o.tag.id === a).map((o) => o.id).sort();
      if (JSON.stringify(i) !== JSON.stringify(s))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
class Rc extends Error {
}
const Ai = (e) => e instanceof Error ? e.message : "Request failed.", Vs = (e) => [...e].sort((t, n) => t - n), oa = (e, t) => JSON.stringify(Vs(e)) === JSON.stringify(Vs(t)), Ti = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Ua(e, t, n, a) {
  const i = new Set(e), s = new Set(e);
  for (const u of t.steps)
    for (const m of u.tagIds)
      u.mode === "ADD" ? s.add(m) : s.delete(m);
  const o = e.some((u) => !s.has(u));
  if (o && !a)
    return { desired: [...e], conflict: o, skipped: !0, kept: [], replaced: [] };
  const c = new Set(
    t.steps.filter((u) => u.mode === "ADD").flatMap((u) => u.tagIds)
  ), d = [], p = [];
  for (const u of n) {
    const m = u.filter((g) => s.has(g) && !i.has(g)), b = u.filter(
      (g) => s.has(g) && i.has(g) && !c.has(g)
    );
    !m.length || !b.length || (a ? (b.forEach((g) => s.delete(g)), p.push(...b)) : (m.forEach((g) => s.delete(g)), d.push({ tagIds: m, existing: b })));
  }
  return { desired: [...s], conflict: o, skipped: !1, kept: d, replaced: p };
}
function ef(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function tf(e, t, n, a) {
  for (const [i, s] of n.entries()) {
    const o = t.filter(
      (p) => p.steps.some(
        (u) => u.mode === "ADD" && u.tagIds.some((m) => s.includes(m))
      )
    );
    if (o.length < 2) continue;
    const c = e.occurrence.conditionTagIds[i];
    let d = `tag ${c}`;
    try {
      d = (await de(`/api/tags/${c}`, { signal: a })).name;
    } catch {
      a.throwIfAborted();
    }
    throw new Rc(
      `${o.map((p) => p.label).join(" and ")} answer the same condition tag, ${d}. Choose one of them.`
    );
  }
}
async function nf(e, t, n, a = () => {
}) {
  if (!t.length || t.some(
    (b) => !Fn(b, e.entityType) || !b.steps.length || b.steps.some(
      (g) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(g.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), s = structuredClone(t), o = aa(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await ps(i.occurrence, n) : [];
  await tf(i, s, o, n);
  const c = await Promise.all(
    s.map(async (b) => ({
      ...b,
      steps: await Yi(b, n)
    }))
  ), d = structuredClone(ef(c));
  n.throwIfAborted();
  const p = [
    .../* @__PURE__ */ new Set([
      ...d.steps.flatMap((b) => b.tagIds),
      ...o.flat()
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
  const u = await fs(i, n), m = /* @__PURE__ */ new Map();
  for (let b = 1; ; b++) {
    n.throwIfAborted();
    const g = await Tc(i, u, b, n);
    for (const y of g.items) {
      const N = {
        ids: [...new Set(y.applications.map((w) => w.tag.id))],
        names: y.applications.map((w) => w.tag.name),
        absent: [],
        applications: y.applications
      }, q = Ua(N.ids, d, o, !0);
      m.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: N,
        expected: N,
        conflict: q.conflict,
        status: oa(N.ids, q.desired) ? "unchanged" : "pending"
      });
    }
    if (a(m.size), b * 250 >= g.totalCount) break;
    if (b > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return n.throwIfAborted(), {
    review: i,
    actions: s,
    action: d,
    categories: o,
    touched: p,
    entries: [...m.values()]
  };
}
function rf(e, t, n) {
  const a = (s) => s.ids.filter((o) => n.includes(o));
  if (!oa(a(e), a(t))) return !1;
  const i = (s) => (s.applications ?? []).filter((o) => n.includes(o.tag.id)).map((o) => o.id);
  return oa(i(e), i(t));
}
async function $c(e, t, n, a) {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; !t() && i < e.length; ) {
        const s = e[i++];
        await n(s), a();
      }
    })
  );
}
function Oc(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function Mc(e) {
  return e.entries.filter((t) => t.operation);
}
async function af(e, t, n, a, i = !1) {
  await $c(
    Oc(e, i),
    n,
    async (s) => {
      if (s.conflict && !t) {
        s.status = "skipped", s.error = "Conflicting answer skipped.";
        return;
      }
      if (s.unverified) {
        s.error = "The previous write could not be verified. Inspect this occurrence and create a fresh preview before further changes.";
        return;
      }
      let o;
      try {
        if (o = await fn(je(e.review), s.item, !1), !rf(s.expected, o, e.touched)) {
          s.status = "skipped", s.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (b) {
        s.status = "failed", s.error = Ai(b);
        return;
      }
      const c = Ua(
        s.before.ids,
        e.action,
        e.categories,
        t
      ), d = [
        ...o.ids.filter((b) => !e.touched.includes(b)),
        ...c.desired.filter((b) => e.touched.includes(b))
      ], p = Lr(o.ids, d);
      if (!p.added.length && !p.removed.length) {
        const b = !s.operation && c.kept.length > 0;
        s.status = s.operation ? "changed" : b ? "skipped" : "unchanged", s.error = b ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let u;
      try {
        await ms(e.review, s.item, p);
      } catch (b) {
        u = b;
      }
      let m = !1;
      try {
        const b = await fn(je(e.review), s.item, !1);
        m = !0, s.expected = b;
        const g = Ci(
          s.item,
          s.before,
          b,
          e.touched
        );
        if (s.operation = Ti(g) ? g : void 0, u) throw u;
        if (!oa(
          b.ids.filter((y) => e.touched.includes(y)),
          d.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        s.status = s.operation ? "changed" : "unchanged", s.error = void 0;
      } catch (b) {
        if (s.status = "failed", s.error = Ai(b), !m)
          try {
            const g = await fn(je(e.review), s.item, !1);
            s.expected = g;
            const y = Ci(
              s.item,
              s.before,
              g,
              e.touched
            );
            s.operation = Ti(y) ? y : void 0;
          } catch {
            s.unverified = !0;
          }
      }
    },
    a
  );
}
async function sf(e, t, n) {
  await $c(
    Mc(e),
    t,
    async (a) => {
      const i = a.operation;
      if (a.unverified) {
        a.error = "Undo unavailable: the previous write could not be verified. Inspect this occurrence.";
        return;
      }
      const s = [...i.tags.added, ...i.tags.removed];
      let o = !1;
      try {
        const c = await fn(je(e.review), a.item, !1);
        Zu(i, c), o = !0, await ms(e.review, a.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const d = await fn(je(e.review), a.item, !1);
        if (!oa(
          d.ids.filter((p) => s.includes(p)),
          a.before.ids.filter((p) => s.includes(p))
        ))
          throw new Error("Undo did not restore all affected tags.");
        a.operation = void 0, a.expected = d, a.status = "unchanged", a.error = void 0;
      } catch (c) {
        if (a.error = `Undo stopped: ${Ai(c)}`, a.status = "failed", o)
          try {
            const d = await fn(je(e.review), a.item, !1), p = Ci(
              a.item,
              a.before,
              d,
              s
            );
            a.operation = Ti(p) ? p : void 0, a.expected = d;
          } catch {
            a.unverified = !0;
          }
      }
    },
    n
  );
}
const Fc = (e, t) => t.count - e.count || Ko(e, t);
async function of(e, t, n) {
  const a = je(e), i = e.occurrence, [s, o] = await Promise.all([
    de(
      `/api/tagapplications?hostType=${a}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    ps(i, n)
  ]), c = s.filter(
    (y) => y.hostType === a && y.contextType === "performer" && y.contextId === t
  );
  Ei(c.map((y) => y.tag));
  const d = await Promise.all(
    o.map(async (y, N) => {
      const q = i.conditionTagIds[N];
      return (await de(`/api/tags/${q}`, { signal: n })).name;
    })
  ), p = new Set(o.flat()), u = new Set(
    [
      ...e.actions.flatMap((y) => y.steps).filter((y) => y.mode === "ADD" || y.mode === "MARK_PRESENT").flatMap((y) => y.tagIds),
      ...i.tagIds
    ].filter((y) => !p.has(y))
  ), m = (y) => {
    const N = /* @__PURE__ */ new Map();
    for (const q of c) {
      if (!y.has(q.tag.id)) continue;
      const w = N.get(q.tag.id) ?? {
        tag: q.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      w.hosts.add(q.hostId), N.set(q.tag.id, w);
    }
    return [...N.values()].map((q) => ({ ...q.tag, count: q.hosts.size })).sort(Fc);
  }, b = o.map((y, N) => ({
    id: i.conditionTagIds[N],
    name: d[N],
    members: y,
    tags: m(new Set(y))
  }));
  u.size && b.push({
    id: null,
    name: o.length ? "Other review tags" : "Review tags",
    members: [...u],
    tags: m(u)
  });
  const g = /* @__PURE__ */ new Set([...p, ...u]);
  return {
    answered: new Set(
      c.filter((y) => g.has(y.tag.id)).map((y) => y.hostId)
    ).size,
    groups: b
  };
}
function cf(e, t, n, a) {
  const i = /* @__PURE__ */ new Set([e, ...t]), s = (o) => {
    if (o === e) return !0;
    const c = a.get(o);
    if (!c) return !1;
    const d = new Set(c);
    return [...i].every((p) => d.has(p));
  };
  return n.some(
    (o) => [...Hn(o)].some((c) => i.has(c)) && o.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(s)
    )
  );
}
function gs(e, t, n) {
  const a = /* @__PURE__ */ new Map();
  for (const g of e.groups) for (const y of g.tags) a.set(y.id, y);
  const i = (g) => g.flatMap((y) => a.get(y) ?? []).sort(Fc), s = (g) => g.members ?? g.tags.map((y) => y.id), o = Dr(t).flatMap((g) => {
    const y = [
      ...new Set(g.actions.flatMap((N) => [...Hn(t[N])]))
    ];
    return y.length ? [{ ...g, answers: y, tags: i(y) }] : [];
  }), c = (g) => g.tags.length > 1 ? [g] : [], d = e.groups.filter((g) => g.id !== null).map((g) => {
    const y = `tag:${g.id}`, N = s(g), q = new Set(N);
    return {
      key: y,
      kind: "condition",
      name: g.name,
      members: N,
      tags: g.tags,
      mixed: cf(g.id, N, t, n) ? c({ key: y, name: g.name, members: N, tags: g.tags }) : (
        // A category that holds several answers is mixed where a group inside it is.
        o.filter((w) => w.answers.every((I) => q.has(I))).flatMap(
          (w) => c({
            key: `group:${w.key}`,
            name: w.name,
            members: w.answers,
            tags: w.tags
          })
        )
      )
    };
  }), p = d.map((g) => new Set(g.members)), u = /* @__PURE__ */ new Set();
  for (const g of o) {
    if (p.some((N) => g.answers.every((q) => N.has(q)))) continue;
    g.answers.forEach((N) => u.add(N));
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
  const m = e.groups.find((g) => g.id === null), b = (m == null ? void 0 : m.tags.filter((g) => !u.has(g.id))) ?? [];
  return m && b.length && d.push({
    key: "other",
    kind: "other",
    name: d.length ? "Other review tags" : "Review tags",
    members: s(m).filter((g) => !u.has(g)),
    tags: b,
    mixed: []
  }), d;
}
const oi = { summary: null, error: "" };
function xc(e, t, n = 0) {
  const a = e == null ? void 0 : e.occurrence, i = JSON.stringify([
    e == null ? void 0 : e.entityType,
    t,
    a == null ? void 0 : a.condition,
    a == null ? void 0 : a.conditionTagIds,
    a == null ? void 0 : a.includeSubtags,
    a == null ? void 0 : a.tagIds,
    e == null ? void 0 : e.actions.map((c) => c.steps)
  ]), [s, o] = C({
    key: i,
    value: oi
  });
  return H(() => {
    if (o((d) => d.key === i ? d : { key: i, value: oi }), e === null || t === null) return;
    const c = new AbortController();
    return of(e, t, c.signal).then((d) => {
      c.signal.aborted || o({ key: i, value: { summary: d, error: "" } });
    }).catch((d) => {
      c.signal.aborted || o((p) => ({
        key: i,
        value: {
          summary: p.key === i ? p.value.summary : null,
          error: d instanceof Error ? d.message : "Request failed."
        }
      }));
    }), () => c.abort();
  }, [i, n]), s.key === i ? s.value : oi;
}
const lf = /* @__PURE__ */ new Map();
function Pc(e) {
  return e.mixed.filter((t) => t.key !== e.key).map((t) => t.name);
}
function df(e) {
  const t = Pc(e);
  return t.length ? `This performer has different answers in ${t.join(", ")}.` : `This performer has different answers in this ${e.kind === "group" ? "group" : "category"}.`;
}
function Ii({
  summary: e,
  error: t,
  mediaKind: n,
  actions: a = [],
  trees: i = lf,
  flags: s = [],
  className: o = ""
}) {
  const c = En(n), d = (m) => `${m.toLocaleString()} ${m === 1 ? c.one : c.many}`, p = e ? gs(e, a, i) : [], u = (m) => [
    ...new Set(
      s.filter((b) => {
        var g;
        return (g = b.tagIds) == null ? void 0 : g.some((y) => m.includes(y));
      }).flatMap((b) => b.flags)
    )
  ];
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-panel-section dq-performer-answers ${o}`.trim(),
      "aria-label": "Existing answers",
      children: [
        /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Existing answers" }),
          e && /* @__PURE__ */ r("span", { children: e.answered ? `${d(e.answered)} answered` : "none answered yet" })
        ] }),
        t ? /* @__PURE__ */ l("p", { role: "alert", children: [
          "Could not load existing answers. ",
          t
        ] }) : e ? p.map((m) => {
          const b = m.kind === "other" ? [] : u(m.members), g = Pc(m);
          return /* @__PURE__ */ l("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ l("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ r("span", { children: m.name }),
              m.mixed.length > 0 && /* @__PURE__ */ l(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-mixed",
                  title: df(m),
                  children: [
                    /* @__PURE__ */ r(Mn, { "aria-hidden": "true" }),
                    "Mixed",
                    g.length > 0 && /* @__PURE__ */ l("span", { className: "dq-answer-mixed-names", children: [
                      " in ",
                      g.join(", ")
                    ] })
                  ]
                }
              ),
              b.length > 0 && /* @__PURE__ */ l(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-flag",
                  title: `Flagged: ${b.join(", ")}`,
                  children: [
                    /* @__PURE__ */ r(Mn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Flagged: " }),
                      b.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            m.tags.length ? /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": m.name, children: m.tags.map((y) => /* @__PURE__ */ l("li", { className: "dq-tag", children: [
              /* @__PURE__ */ r(Gt, { tag: y }),
              /* @__PURE__ */ r("span", { className: "dq-chip-count", "aria-hidden": "true", children: y.count.toLocaleString() }),
              /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
                ", ",
                d(y.count)
              ] })
            ] }, y.id)) }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" })
          ] }, m.key);
        }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading existing answers…" })
      ]
    }
  );
}
function Fr({
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
const Js = 5, zs = /* @__PURE__ */ new Map();
function uf(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await de(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
function ff(e, t) {
  const n = 1100 - (Date.now() - e);
  return n <= 0 ? Promise.resolve() : new Promise((a, i) => {
    const s = window.setTimeout(a, n);
    t.addEventListener(
      "abort",
      () => {
        window.clearTimeout(s), i(t.reason);
      },
      { once: !0 }
    );
  });
}
const Ws = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), Ri = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], Qs = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], hf = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, ci = 250;
function ea(e, t) {
  var a, i;
  const n = e.item.media;
  return n.title || ((i = (a = n.files) == null ? void 0 : a[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function pf({ step: e }) {
  const t = Ri.findIndex((n) => n.id === e);
  return /* @__PURE__ */ r("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Ri.map((n, a) => {
    const i = a < t ? "done" : a === t ? "current" : "next";
    return /* @__PURE__ */ l("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ r(Ga, {}) : a + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function Hs({ parts: e, id: t }) {
  return /* @__PURE__ */ r("span", { className: "dq-batch-effect", id: t, children: e.map((n, a) => /* @__PURE__ */ l(xi, { children: [
    a > 0 && " ",
    /* @__PURE__ */ r("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, a)) });
}
function Zr({
  value: e,
  label: t,
  detail: n,
  tone: a,
  pressed: i,
  onToggle: s
}) {
  return /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: "dq-batch-stat",
      "data-tone": e ? a : void 0,
      "aria-pressed": i && e > 0,
      disabled: !e,
      onClick: s,
      children: [
        /* @__PURE__ */ r("span", { className: "dq-batch-stat-value", children: e.toLocaleString() }),
        " ",
        /* @__PURE__ */ r("span", { className: "dq-batch-stat-label", children: t }),
        n && /* @__PURE__ */ l(me, { children: [
          " ",
          /* @__PURE__ */ r("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function Ys({
  added: e,
  removed: t,
  tag: n,
  label: a
}) {
  return /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": a, children: [
    mr(e.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
      "+ ",
      /* @__PURE__ */ r(Gt, { tag: i })
    ] }) }, `added-${i.id}`)),
    mr(t.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ l("del", { children: [
      "− ",
      /* @__PURE__ */ r(Gt, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function Xs({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: a,
  describe: i
}) {
  return /* @__PURE__ */ l("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: e }),
      t.length > ci && /* @__PURE__ */ l("span", { children: [
        "First ",
        ci.toLocaleString(),
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
      /* @__PURE__ */ r("tbody", { children: t.slice(0, ci).map((s) => {
        var o;
        return /* @__PURE__ */ l("tr", { children: [
          /* @__PURE__ */ r("td", { children: /* @__PURE__ */ l(
            "a",
            {
              href: `/${n}/${s.item.media.id}`,
              target: "_blank",
              rel: "noreferrer",
              children: [
                (o = s.item.occurrence) == null ? void 0 : o.performer.name,
                " — ",
                ea(s, n)
              ]
            }
          ) }),
          /* @__PURE__ */ r("td", { className: "dq-batch-list-date", children: s.item.media.date ?? "" }),
          /* @__PURE__ */ r("td", { children: i(s) })
        ] }, s.item.key);
      }) })
    ] }) })
  ] });
}
function mf(e) {
  const t = {
    pending: 0,
    changed: 0,
    unchanged: 0,
    skipped: 0,
    failed: 0
  }, n = /* @__PURE__ */ new Map();
  let a = 0, i = !1;
  for (const s of e)
    if (t[s.status] += 1, s.operation && (a += 1), s.status === "failed" && !s.unverified && (i = !0), (s.status === "skipped" || s.status === "failed") && s.error) {
      const o = `${s.status}\0${s.error}`, c = n.get(o) ?? { status: s.status, error: s.error, count: 0 };
      c.count += 1, n.set(o, c);
    }
  return { counts: t, reasons: [...n.values()], recorded: a, retryable: i };
}
function gf({
  review: e,
  disabled: t,
  performerAttention: n,
  trees: a,
  onOpen: i,
  onClose: s,
  onWrite: o
}) {
  const [c, d] = C(!1), [p, u] = C("answers"), [m, b] = C(null), [g, y] = C({}), [N, q] = C([]), [w, I] = C(!1), [M, j] = C(!1), [G, D] = C(""), [Z, ne] = C(!1), [se, oe] = C(""), [_, U] = C(null), [S, A] = C(null), [V, J] = C([]), [ue, ce] = C(0), B = O(null), T = O(null), Q = O(null), z = O(!1), te = O(!1), x = O(null), fe = O(!1), Oe = O(0), Ee = O(!1), Ye = O({ onClose: s, onWrite: o });
  Ye.current = { onClose: s, onWrite: o };
  const Ae = lt(), Be = p === "run", en = (_ == null ? void 0 : _.kind) === "undo", ke = Be && m ? m.review : e, kn = _r(ke.actions), ge = ke.occurrence, Ve = je(ke), qt = En(Ve), hn = qt.queue, Me = Be && m ? m.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((k) => k.steps.length && !Wn(k))
  ), rt = Me.filter((k) => N.includes(k.id)), Te = ge.targetMode === "selected" && ge.performerIds.length === 1, Xe = xc(
    ke,
    c && Te ? ge.performerIds[0] : null,
    ue
  ), Kt = ds(ke.view.objectFilter), $e = ha(
    c ? [...Ja(Me), ...ge.conditionTagIds, ...Kt] : []
  ), Cn = ye(() => rc($e), [$e]), dt = (k) => g[k] ?? $e[k] ?? { id: k, name: `Tag ${k}` }, $t = JSON.stringify(
    Object.fromEntries(
      Kt.flatMap((k) => {
        var W;
        const P = (W = $e[k]) == null ? void 0 : W.name;
        return P ? [[String(k), P]] : [];
      })
    )
  ), ft = ye(
    () => us(ke.view.objectFilter, JSON.parse($t)),
    [ke.view.objectFilter, $t]
  );
  H(() => {
    var k, P, W;
    c && ((k = B.current) == null || k.showModal(), (W = (P = B.current) == null ? void 0 : P.querySelector(".dq-batch-answer input")) == null || W.focus());
  }, [c]), H(() => {
    if (!c) return;
    const k = requestAnimationFrame(() => {
      var ae;
      const P = B.current, W = document.activeElement;
      if (!P || W && W !== document.body && P.contains(W)) return;
      (ae = (p === "answers" ? P.querySelector(".dq-batch-answer input:checked") ?? P.querySelector(".dq-batch-answer input") : P.querySelector("[data-batch-focus]")) ?? T.current) == null || ae.focus();
    });
    return () => cancelAnimationFrame(k);
  }, [c, p, M, m]), H(() => {
    if (c || t || !z.current) return;
    const k = requestAnimationFrame(() => {
      const P = Q.current;
      if (!z.current || !P || P.disabled) return;
      z.current = !1;
      const W = document.activeElement;
      (!W || W === document.body) && P.focus();
    });
    return () => cancelAnimationFrame(k);
  }, [c, t]), H(() => {
    if (!c || ge.targetMode !== "selected") return;
    const k = new AbortController();
    return J([]), uf(ge.performerIds.slice(0, Js), k.signal).then((P) => {
      k.signal.aborted || J(P);
    }).catch(() => {
    }), () => k.abort();
  }, [c, ge.targetMode, JSON.stringify(ge.performerIds)]), H(
    () => () => {
      var k;
      te.current = !0, (k = x.current) == null || k.abort();
    },
    []
  ), H(() => {
    if (!M) return;
    const k = (P) => {
      P.preventDefault(), P.returnValue = "";
    };
    return window.addEventListener("beforeunload", k), () => window.removeEventListener("beforeunload", k);
  }, [M]);
  function Bt() {
    u("answers"), b(null), y({}), U(null), I(!1), q([]), oe(""), D(""), ne(!1), A(null);
  }
  function vt() {
    Ee.current || (d(!1), Ye.current.onClose(fe.current), fe.current = !1, Bt(), z.current = !0);
  }
  function Xn(k, P) {
    q(
      (W) => P ? [...W, k] : W.filter((pe) => pe !== k)
    ), b(null), y({}), oe(""), D(""), ne(!1), A(null);
  }
  function kt() {
    u("answers"), A(null), oe("");
  }
  function An() {
    u("preview"), m || we();
  }
  function Vt() {
    var k;
    te.current = !0, (k = x.current) == null || k.abort(), oe("Stopping after in-flight operations settle…");
  }
  function Ot(k) {
    A(
      (P) => (P == null ? void 0 : P.group) === k.group && P.reason === k.reason ? null : k
    );
  }
  const pn = (k, P) => (S == null ? void 0 : S.group) === k && S.reason === P;
  async function we() {
    if (!rt.length || Ee.current) return;
    Ee.current = !0, j(!0), D(""), ne(!1), oe("Loading all matching occurrences…"), b(null), y({}), A(null);
    const k = new AbortController();
    x.current = k;
    try {
      await ff(Oe.current, k.signal);
      const P = await nf(
        e,
        rt,
        k.signal,
        (pe) => oe(`Loaded ${pe.toLocaleString()} matching occurrences…`)
      );
      k.signal.throwIfAborted();
      const W = {};
      for (const pe of P.entries)
        for (const ae of pe.before.applications ?? [])
          W[ae.tag.id] = ae.tag;
      y(W), b(P), oe("Preview ready. No tags have been changed.");
    } catch (P) {
      D(
        k.signal.aborted ? "Preview cancelled. No tags were changed." : P instanceof Error ? P.message : String(P)
      ), ne(!k.signal.aborted && P instanceof Rc), oe("");
    } finally {
      Ee.current = !1, j(!1), x.current = null;
    }
  }
  async function St(k) {
    if (!m || Ee.current) return;
    const P = (k === "undo" ? Mc(m) : Oc(m, k === "retry")).length;
    Ee.current = !0, te.current = !1, fe.current = !0, Ye.current.onWrite(), j(!0), u("run"), D(""), U({ kind: k, total: P, done: 0, stopped: !1 }), oe(
      k === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const W = () => U((ae) => ae && { ...ae, done: ae.done + 1 });
    let pe = !1;
    try {
      k === "undo" ? await sf(m, () => te.current, W) : await af(m, w, () => te.current, W, k === "retry"), oe(
        te.current ? "Stopped after in-flight operations settled. Completed changes are retained." : k === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (ae) {
      pe = !0, oe(""), D(ae instanceof Error ? ae.message : String(ae));
    } finally {
      Oe.current = Date.now(), Ee.current = !1;
      const ae = te.current || pe;
      U((Re) => Re && { ...Re, stopped: ae }), j(!1), ce((Re) => Re + 1);
    }
  }
  const at = (m == null ? void 0 : m.entries) ?? [], Pn = ye(
    () => new Map(
      ((m == null ? void 0 : m.entries) ?? []).map((k) => [
        k.item.key,
        Ua(k.before.ids, m.action, m.categories, w)
      ])
    ),
    [m, w]
  ), Jt = (k) => Pn.get(k.item.key), Fe = (k) => Lr(k.before.ids, Jt(k).desired), Ct = (k) => {
    const P = Fe(k);
    return k.status === "pending" && (P.added.length > 0 || P.removed.length > 0);
  }, re = (k) => k.conflict || Jt(k).kept.length > 0 || Jt(k).replaced.length > 0, F = ye(() => {
    const k = (m == null ? void 0 : m.entries) ?? [];
    return {
      willChange: k.filter(Ct).length,
      correct: k.filter((P) => P.status === "unchanged").length,
      different: k.filter(re).length,
      hosts: new Set(k.map((P) => P.item.media.id)).size,
      added: [...new Set(k.flatMap((P) => Fe(P).added))],
      removed: [...new Set(k.flatMap((P) => Fe(P).removed))]
    };
  }, [Pn]), Se = ye(
    () => ((m == null ? void 0 : m.entries) ?? []).filter((k) => k.item.media.date).sort((k, P) => k.item.media.date.localeCompare(P.item.media.date)),
    [m]
  ), ht = Be ? mf(at) : null, Ln = (k) => kn.keys[ke.actions.findIndex((P) => P.id === k)] ?? "", he = (k) => vr(k, Cn, [], a), At = aa(ge.condition) && ge.includeSubtags !== !1 && ge.conditionTagIds.length > 0, et = Se[0], xe = Se.length > 1 ? Se[Se.length - 1] : void 0, Ze = (k) => `/${Ve}/${k.item.media.id}`, zt = Te ? V[0] : void 0, it = ye(
    () => n ? Ho(
      n,
      Xe.summary ? Qo(
        gs(Xe.summary, ke.actions, a ?? zs)
      ) : []
    ) : [],
    [n, Xe.summary, ke.actions, a]
  ), pt = _d(rt, it, a ?? zs), Mt = n ?? [], Wt = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: Ct },
    correct: { title: "Occurrences already correct", test: (k) => k.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: re }
  };
  function st() {
    const k = hf[ge.condition], P = !!k && ge.conditionTagIds.length > 0, W = ge.performerIds.slice(0, Js), pe = String(ke.view.filter.q ?? "").trim(), ae = ge.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ l("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      Bi(ge) ? /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "All performers" }) : ge.targetMode === "selected" ? /* @__PURE__ */ l(me, { children: [
        W.map((Re, Ce) => /* @__PURE__ */ l("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ r(Fr, { performer: { id: Re, name: V[Ce] ?? "" } }),
          V[Ce] ?? "…"
        ] }, Re)),
        ge.performerIds.length > W.length && /* @__PURE__ */ l("span", { className: "dq-batch-chip", children: [
          (ge.performerIds.length - W.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ l(me, { children: [
        /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ r(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ r(
              ra,
              {
                filter: {},
                objectFilter: ge.performerFilter,
                criteriaDefinitions: Pi,
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
        P ? k : Gi[ge.condition],
        P && /* @__PURE__ */ r("span", { className: "dq-batch-chip-tags", children: mr(ge.conditionTagIds.map(dt)).map((Re) => /* @__PURE__ */ r(Gt, { tag: Re }, Re.id)) })
      ] }),
      P && /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: ge.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      aa(ge.condition) && ge.hideConfirmedAbsent !== !1 && /* @__PURE__ */ l("span", { className: "dq-batch-chip", title: ae, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
          ": ",
          ae
        ] })
      ] }),
      pe && /* @__PURE__ */ l("span", { className: "dq-batch-chip", children: [
        "Search “",
        pe,
        "”"
      ] }),
      Object.keys(ke.view.objectFilter).length > 0 && /* @__PURE__ */ r(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${hn} filters`,
          children: /* @__PURE__ */ r(
            ra,
            {
              filter: ke.view.filter,
              objectFilter: ft,
              criteriaDefinitions: Ve === "audio" ? po : Li,
              customFieldEntityType: Ve,
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
  function Dn(k, P, W = !0) {
    if (!k.length) return null;
    const pe = /* @__PURE__ */ r("strong", { children: zt || "This performer" }), ae = W ? `Check the earliest and latest ${qt.many} before applying, or narrow the batch with a date filter.` : "", Re = k.every((Ce) => Ce.tagIds === null && !Ce.mixed.length);
    return /* @__PURE__ */ l("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ r(Mn, { "aria-hidden": "true" }),
      /* @__PURE__ */ l("div", { children: [
        Re ? /* @__PURE__ */ l("p", { children: [
          pe,
          " is flagged: ",
          /* @__PURE__ */ r("strong", { children: k.flatMap((Ce) => Ce.flags).join(", ") }),
          ".",
          " ",
          ae
        ] }) : /* @__PURE__ */ l(me, { children: [
          /* @__PURE__ */ l("p", { children: [
            pe,
            " needs attention where the chosen answers apply.",
            ae && ` ${ae}`
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: k.map((Ce) => /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ r("strong", { children: Ce.tagIds === null ? "Whole review" : Ce.name }),
            ":",
            " ",
            es(Ce).join("; ")
          ] }, Ce.key)) })
        ] }),
        P && et && /* @__PURE__ */ l("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ l("a", { href: Ze(et), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            ea(et, Ve),
            " · ",
            et.item.media.date
          ] }),
          xe && /* @__PURE__ */ l("a", { href: Ze(xe), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            ea(xe, Ve),
            " · ",
            xe.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function Qt() {
    const k = pt.filter((W) => W.tagIds === null), P = pt.filter((W) => W.tagIds !== null);
    return /* @__PURE__ */ l(me, { children: [
      st(),
      Dn(k, !1),
      /* @__PURE__ */ l("div", { className: `dq-batch-pick${Te ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ l("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ r("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ r("div", { className: "dq-batch-answers", children: Me.map((W, pe) => {
            const ae = Ln(W.id);
            return /* @__PURE__ */ l("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ r(
                "input",
                {
                  type: "checkbox",
                  checked: N.includes(W.id),
                  "aria-labelledby": `${Ae}-answer-${pe}`,
                  "aria-describedby": `${Ae}-effect-${pe}`,
                  onChange: (Re) => Xn(W.id, Re.target.checked)
                }
              ),
              /* @__PURE__ */ r("span", { className: "dq-batch-answer-key", children: ae && /* @__PURE__ */ r(ct, { binding: ae, hidden: !0 }) }),
              /* @__PURE__ */ l("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ r(
                  "span",
                  {
                    id: `${Ae}-answer-${pe}`,
                    className: "dq-batch-answer-label",
                    title: W.label,
                    children: W.label
                  }
                ),
                /* @__PURE__ */ r(Hs, { id: `${Ae}-effect-${pe}`, parts: he(W) })
              ] })
            ] }, W.id);
          }) })
        ] }),
        Te && /* @__PURE__ */ l("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ r("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: Dn(P, !1, k.length === 0) }),
          /* @__PURE__ */ r(
            Ii,
            {
              ...Xe,
              mediaKind: Ve,
              actions: ke.actions,
              trees: a,
              flags: Mt,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function _n(k) {
    const P = F, W = S && Ws.has(S.group) ? S.group : null, pe = W ? at.filter(Wt[W].test) : [], ae = (Re) => {
      const Ce = Jt(Re), xt = Ce.skipped ? Lr(
        Re.before.ids,
        Ua(Re.before.ids, k.action, k.categories, !0).desired
      ) : Fe(Re), be = !xt.added.length && !xt.removed.length;
      return /* @__PURE__ */ l("div", { className: "dq-batch-plan", children: [
        Ce.skipped && /* @__PURE__ */ r("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        be ? !Ce.kept.length && /* @__PURE__ */ r("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ r(Ys, { added: xt.added, removed: xt.removed, tag: dt }),
        Ce.kept.map((Ne, ve) => /* @__PURE__ */ l("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          mr(Ne.existing.map(dt)).map((Pt) => /* @__PURE__ */ r(Gt, { tag: Pt }, Pt.id)),
          " ",
          "instead of",
          " ",
          mr(Ne.tagIds.map(dt)).map((Pt) => /* @__PURE__ */ r(Gt, { tag: Pt }, Pt.id))
        ] }, ve))
      ] });
    };
    return /* @__PURE__ */ l(me, { children: [
      /* @__PURE__ */ l("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ l("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ r(
            Zr,
            {
              value: at.length,
              label: at.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${P.hosts.toLocaleString()} ${P.hosts === 1 ? hn : `${hn}s`}`,
              pressed: pn("matching"),
              onToggle: () => Ot({ group: "matching" })
            }
          ),
          /* @__PURE__ */ r(
            Zr,
            {
              value: P.willChange,
              label: "will change",
              tone: "add",
              pressed: pn("change"),
              onToggle: () => Ot({ group: "change" })
            }
          ),
          /* @__PURE__ */ r(
            Zr,
            {
              value: P.correct,
              label: "already correct, no write",
              pressed: pn("correct"),
              onToggle: () => Ot({ group: "correct" })
            }
          ),
          /* @__PURE__ */ r(
            Zr,
            {
              value: P.different,
              label: w ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: pn("different"),
              onToggle: () => Ot({ group: "different" })
            }
          )
        ] }),
        pe.length > 0 ? /* @__PURE__ */ r(
          Xs,
          {
            title: Wt[W].title,
            entries: pe,
            mediaKind: Ve,
            resultHeading: "Planned change",
            describe: ae
          }
        ) : at.length > 0 && /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        at.length > 0 && /* @__PURE__ */ l("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ r("span", { children: et ? `Dates ${et.item.media.date}${xe ? ` to ${xe.item.media.date}` : ""}` : "No dates" }),
          et && /* @__PURE__ */ r(
            "a",
            {
              href: Ze(et),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${qt.one}, ${et.item.media.date}`,
              title: ea(et, Ve),
              children: "Open earliest"
            }
          ),
          xe && /* @__PURE__ */ r(
            "a",
            {
              href: Ze(xe),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${qt.one}, ${xe.item.media.date}`,
              title: ea(xe, Ve),
              children: "Open latest"
            }
          ),
          Se.length < at.length && /* @__PURE__ */ l("span", { children: [
            (at.length - Se.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (P.added.length > 0 || P.removed.length > 0) && /* @__PURE__ */ l("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ r("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ r(
            Ys,
            {
              added: P.added,
              removed: P.removed,
              tag: dt,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      P.different > 0 && /* @__PURE__ */ l("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ r("span", { id: `${Ae}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ l(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${Ae}-choice`,
            children: [
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": !w, onClick: () => I(!1), children: "Keep their answer" }),
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": w, onClick: () => I(!0), children: "Replace it" })
            ]
          }
        ),
        /* @__PURE__ */ l("p", { className: "dq-muted", children: [
          "A different answer is a tag the chosen answers would remove",
          At ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function Ft() {
    return /* @__PURE__ */ l(me, { children: [
      st(),
      Dn(pt, !0),
      /* @__PURE__ */ l("div", { className: `dq-batch-cards${Te ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ l("section", { className: "dq-batch-card", "aria-labelledby": `${Ae}-chosen`, children: [
          /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ r("h3", { id: `${Ae}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", disabled: M, onClick: kt, children: "Change" })
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-chosen", children: rt.map((k) => {
            const P = Ln(k.id);
            return /* @__PURE__ */ l("li", { children: [
              /* @__PURE__ */ l("span", { className: "dq-batch-chosen-chip", children: [
                P && /* @__PURE__ */ r(ct, { binding: P, hidden: !0 }),
                k.label
              ] }),
              /* @__PURE__ */ r(Hs, { parts: he(k) })
            ] }, k.id);
          }) })
        ] }),
        Te && /* @__PURE__ */ r(
          Ii,
          {
            ...Xe,
            mediaKind: Ve,
            actions: ke.actions,
            trees: a,
            flags: Mt,
            className: "dq-batch-card"
          }
        )
      ] }),
      M ? /* @__PURE__ */ r("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ r("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ r("span", {}) }) }) : m && _n(m)
    ] });
  }
  function mn(k) {
    const P = _ ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, W = P.kind === "apply" ? at.length - k.counts.pending : P.done, pe = P.kind === "apply" ? at.length : P.total, ae = M ? P.kind === "undo" ? "Undoing batch…" : P.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : P.kind === "undo" ? P.stopped ? "Undo stopped" : "Undo finished" : P.stopped ? "Stopped" : "Finished", Re = pe ? Math.round(W / pe * 100) : 100, Ce = S && !Ws.has(S.group) ? S.group : null, xt = (Ne) => Qs.find((ve) => ve.status === Ne).label, be = Ce ? at.filter(
      (Ne) => Ne.status === Ce && (!S.reason || Ne.error === S.reason)
    ) : [];
    return /* @__PURE__ */ l(me, { children: [
      /* @__PURE__ */ l("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ r("h3", { tabIndex: -1, "data-batch-focus": "", children: ae }),
          /* @__PURE__ */ l("span", { children: [
            W.toLocaleString(),
            " of ",
            pe.toLocaleString(),
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
            "aria-valuemax": pe,
            "aria-valuenow": W,
            children: /* @__PURE__ */ r("span", { style: { width: `${Re}%` } })
          }
        ),
        !M && P.kind === "undo" && /* @__PURE__ */ l("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (P.total - k.recorded).toLocaleString(),
          " of",
          " ",
          P.total.toLocaleString(),
          " ",
          P.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ l("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ r("div", { className: "dq-batch-stats", "data-count": "5", children: Qs.map((Ne) => /* @__PURE__ */ r(
          Zr,
          {
            value: k.counts[Ne.status],
            label: Ne.label,
            tone: Ne.tone,
            pressed: pn(Ne.status),
            onToggle: () => Ot({ group: Ne.status })
          },
          Ne.status
        )) }),
        k.reasons.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-batch-reasons", children: k.reasons.map((Ne) => {
          const ve = pn(Ne.status, Ne.error);
          return /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ l("span", { children: [
              Ne.count.toLocaleString(),
              " ",
              Ne.status,
              ": ",
              Ne.error
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": ve,
                onClick: () => Ot({ group: Ne.status, reason: Ne.error }),
                children: ve ? "Hide them" : "Show them"
              }
            )
          ] }, `${Ne.status}-${Ne.error}`);
        }) }),
        be.length > 0 ? /* @__PURE__ */ r(
          Xs,
          {
            title: S.reason ? `${xt(Ce)}: ${S.reason}` : `${xt(Ce)} occurrences`,
            entries: be,
            mediaKind: Ve,
            resultHeading: "Result",
            describe: (Ne) => Ne.error ?? xt(Ne.status)
          }
        ) : /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      k.recorded > 0 && /* @__PURE__ */ l("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: M,
            onClick: () => void St("undo"),
            children: [
              /* @__PURE__ */ r(xl, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ l("p", { children: [
          en ? P.stopped || M ? `${k.recorded.toLocaleString()} ${k.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${k.recorded.toLocaleString()} ${k.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${k.recorded === 1 ? "this change" : `these ${k.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function tn() {
    return p === "answers" ? /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !rt.length,
        onClick: An,
        children: "Preview all matches"
      },
      "preview"
    ) : p === "preview" ? M ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: Vt, children: "Cancel preview" }, "cancel-preview") : m ? /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !F.willChange,
        onClick: () => void St("apply"),
        children: [
          "Apply to ",
          F.willChange.toLocaleString(),
          " ",
          F.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : Z ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button primary", onClick: kt, children: "Change answers" }, "change-answers") : /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void we(),
        children: "Preview again"
      },
      "again"
    ) : M ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: Vt, children: en ? "Cancel undo" : "Cancel run" }, "cancel-run") : en || !ht ? null : /* @__PURE__ */ l(xi, { children: [
      ht.retryable && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: () => void St("retry"), children: "Retry failed" }),
      ht.counts.pending > 0 && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void St("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ l(Iu, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: Q,
        title: "Apply answers to all matching occurrences",
        disabled: t || !Me.length,
        onClick: () => {
          Bt(), i(), d(!0);
        },
        children: [
          /* @__PURE__ */ r(Cs, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    c && /* @__PURE__ */ l(
      "dialog",
      {
        ref: B,
        className: "dq-batch-dialog",
        "aria-labelledby": `${Ae}-title`,
        "aria-modal": "true",
        onCancel: (k) => {
          k.preventDefault(), vt();
        },
        onClose: () => {
          var k;
          Ee.current ? (k = B.current) == null || k.showModal() : vt();
        },
        children: [
          /* @__PURE__ */ l("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ r(Cs, { "aria-hidden": "true" }),
            /* @__PURE__ */ r("h2", { id: `${Ae}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: M,
                onClick: vt,
                children: /* @__PURE__ */ r(la, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r(pf, { step: p }),
          /* @__PURE__ */ l(
            "div",
            {
              className: "dq-batch-body",
              ref: T,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": p === "preview" ? "" : void 0,
              "aria-label": `${Ri.find((k) => k.id === p).label} step`,
              children: [
                /* @__PURE__ */ l("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  se && /* @__PURE__ */ r("p", { role: "status", children: se }),
                  G && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: G })
                ] }),
                p === "answers" ? Qt() : p === "preview" ? Ft() : mn(ht)
              ]
            }
          ),
          /* @__PURE__ */ l("div", { className: "dq-batch-footer", children: [
            p === "preview" && /* @__PURE__ */ l("button", { type: "button", className: "dq-button", disabled: M, onClick: kt, children: [
              /* @__PURE__ */ r(da, { "aria-hidden": "true" }),
              "Back"
            ] }),
            p === "run" && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: M, onClick: Bt, children: "New batch" }),
            /* @__PURE__ */ r("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: M, onClick: vt, children: "Close" }),
            tn()
          ] })
        ]
      }
    )
  ] });
}
const Lc = "data-quality.description-collapsed.v1";
function bf() {
  try {
    return localStorage.getItem(Lc) === "true";
  } catch {
    return !1;
  }
}
function yf({
  details: e,
  label: t
}) {
  const [n, a] = C(bf), i = qn(() => {
    a((s) => {
      const o = !s;
      try {
        localStorage.setItem(Lc, String(o));
      } catch {
      }
      return o;
    });
  }, []);
  return /* @__PURE__ */ l("section", { className: "dq-media-description", "aria-label": `${t} description`, children: [
    /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button dq-description-toggle",
        "aria-expanded": !n,
        onClick: i,
        children: "Description"
      }
    ),
    !n && (e != null && e.trim() ? /* @__PURE__ */ r(vl, { className: "dq-description-body", children: e }) : /* @__PURE__ */ r("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
const wf = (e) => "";
function vf({
  ranking: e,
  busy: t,
  error: n,
  focus: a,
  disabled: i,
  labels: s,
  flagLabel: o = wf,
  onFocus: c,
  onMore: d,
  onRefresh: p
}) {
  var b;
  const u = e ? e.ranked.slice(0, e.limit) : [], m = !!e && (e.ranked.length > e.limit || (((b = e.candidates[e.cursor]) == null ? void 0 : b.total) ?? 0) > 0);
  return /* @__PURE__ */ l("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ l("div", { className: "dq-performer-ranking-status", children: [
      n ? /* @__PURE__ */ l("p", { role: "alert", children: [
        "Could not rank performers. ",
        n
      ] }) : t ? /* @__PURE__ */ l("p", { role: "status", children: [
        "Counting matching ",
        s.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ r("p", { children: u.length ? `Most matching ${s.queue}s first` : `No performer has matching ${s.many}.` }) : null,
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "Refresh counts",
          title: "Refresh counts",
          disabled: t || i,
          onClick: p,
          children: /* @__PURE__ */ r(Pl, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-queue-list", children: u.map((g) => {
      const y = `${g.count.toLocaleString()} matching ${g.count === 1 ? s.one : s.many}`, N = o(g.tags);
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${g.name}, ${y}${N ? `. ${N}` : ""}`,
          title: N || void 0,
          "aria-current": a === g.id ? "true" : void 0,
          disabled: i,
          onClick: () => c(g.id),
          children: [
            /* @__PURE__ */ r(Fr, { performer: g }),
            /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: g.name }),
            N && /* @__PURE__ */ r(Mn, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ r("span", { className: "dq-ranked-count", "aria-hidden": "true", children: g.count.toLocaleString() })
          ]
        },
        g.id
      );
    }) }),
    m && !t && !n && /* @__PURE__ */ r(
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
const Nf = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], qf = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function Sf(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), a = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: a, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function Ra(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Ef(e, t) {
  const n = Bi(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", a = e.conditionTagIds.map(
    (s) => t[s] === void 0 ? "…" : t[s] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Ra(a, "or")}`,
    includesAll: `has ${Ra(a, "and")}`,
    excludes: `has none of ${Ra(a, "or")}`,
    excludesAll: `missing ${Ra(a, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function kf({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: a,
  onEditCriteria: i
}) {
  const [s, o] = C(!1), [c, d] = C(null), p = O(null), u = O(null), m = lt(), b = jr(e.conditionTagIds), g = Ef(e, b);
  Rt(() => {
    const w = p.current;
    if (!s || !w) return;
    const I = () => d(Sf(w));
    I(), window.addEventListener("resize", I);
    const M = typeof ResizeObserver > "u" ? null : new ResizeObserver(I), j = [w, w.closest(".dq-review-header-trail"), w.closest("header")];
    for (const G of j) G && (M == null || M.observe(G));
    return () => {
      window.removeEventListener("resize", I), M == null || M.disconnect();
    };
  }, [s]), H(() => {
    var I, M;
    if (!s) return;
    const w = (I = u.current) == null ? void 0 : I.querySelector('[aria-pressed="true"]');
    w && !w.disabled ? w.focus() : (M = u.current) == null || M.focus();
  }, [s]);
  const y = () => {
    o(!1), requestAnimationFrame(() => {
      var w;
      return (w = p.current) == null ? void 0 : w.focus();
    });
  }, N = (w) => {
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== u.current || w.defaultPrevented)) {
      if (w.key === "Escape")
        w.preventDefault(), y();
      else if (w.key === "Tab" && u.current) {
        const M = [...u.current.querySelectorAll(qf)].filter((Z) => Z.closest('[role="dialog"]') === u.current).sort(
          (Z, ne) => Z.compareDocumentPosition(ne) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!M.length) return;
        const j = M[0], G = M[M.length - 1], D = document.activeElement;
        w.shiftKey && (D === j || D === u.current) ? (w.preventDefault(), G.focus()) : !w.shiftKey && D === G && (w.preventDefault(), j.focus());
      }
    }
  }, q = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ l("div", { className: "dq-scope", children: [
    /* @__PURE__ */ l(
      "button",
      {
        ref: p,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": s,
        "aria-controls": s ? m : void 0,
        title: g,
        onClick: () => s ? y() : o(!0),
        children: [
          /* @__PURE__ */ r(No, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-summary", children: g }),
          /* @__PURE__ */ r(vo, { "aria-hidden": "true" })
        ]
      }
    ),
    s && /* @__PURE__ */ l(me, { children: [
      /* @__PURE__ */ r("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: y }),
      /* @__PURE__ */ l(
        "div",
        {
          ref: u,
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
            /* @__PURE__ */ l("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: Nf.map(({ mode: w, label: I }) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === w,
                  onClick: () => e.targetMode !== w && a({ targetMode: w }),
                  children: I
                },
                w
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ r(
                Qn,
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
                  ra,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: Pi,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (w) => a({ performerFilter: w })
                  }
                ) }),
                /* @__PURE__ */ l("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ r(Pr, { "aria-hidden": "true" }),
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
                  children: Ki.map((w) => /* @__PURE__ */ r("option", { value: w, children: Gi[w] }, w))
                }
              ),
              q && /* @__PURE__ */ l(me, { children: [
                /* @__PURE__ */ r(
                  Qn,
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
                  aa(e.condition) && /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
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
function Fa(e) {
  const {
    page: t,
    perPage: n,
    sort: a,
    direction: i,
    sorts: s,
    seed: o,
    ...c
  } = e.view.filter, {
    performerFlags: d,
    flagPerformerTagIds: p,
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
function Cf(e) {
  const t = e.occurrence;
  return JSON.stringify([
    je(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function Af(e, t) {
  const n = je(e) === "audio", a = (o) => ({
    id: o.id,
    name: o.name,
    total: (n ? o.audioCount : o.videoCount) ?? 0,
    tags: (o.tags ?? []).map((c) => ({ id: c.id, name: c.name }))
  }), i = e.occurrence, s = [];
  if (i.targetMode === "selected" && i.performerIds.length > 0)
    for (const o of i.performerIds) {
      const c = await bd(
        `/api/performers/${o}`,
        { signal: t }
      );
      c && s.push(a(c));
    }
  else {
    const { _filterExpression: o, ...c } = i.targetMode === "filter" ? i.performerFilter : {};
    for (let d = 1; ; d++) {
      const p = await de(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            xn({
              findFilter: {
                page: d,
                perPage: 1e3,
                sort: n ? "audio_count" : "video_count",
                direction: "desc"
              },
              objectFilter: c,
              filterExpression: o
            })
          )
        }
      );
      if (s.push(...p.items.map(a)), d * 1e3 >= p.totalCount || !p.items.length) break;
    }
  }
  return s.sort((o, c) => c.total - o.total || o.id - c.id);
}
function Dc(e, t, n) {
  const a = hs(e, [t]);
  return vd(a, a.view.filter, n);
}
function _c(e, t) {
  const n = e.findIndex(
    (a) => a.count < t.count || a.count === t.count && a.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function $i(e, t, n, a) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= a && i < n[a - 1].count;
}
async function Tf(e, t, n, a, i = {}) {
  const s = Fa(e), o = Cf(e), c = Ac(e.occurrence), d = (t == null ? void 0 : t.signature) === s && !t.partial ? t : {
    signature: s,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : o,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === o ? t.candidates : await Af(e, a),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: p } = d, u = [...d.ranked];
  let m = d.cursor, b = !1;
  const g = (y) => ({
    ...d,
    cursor: m,
    ranked: [...u],
    limit: n,
    complete: !y && $i(p, m, u, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var y;
        for (; !b && !$i(p, m, u, n); ) {
          a.throwIfAborted();
          const N = p[m++], q = await Dc(e, N.id, a);
          q > 0 && _c(u, { ...N, count: q }), (y = i.onProgress) == null || y.call(i, g(!0));
        }
      })
    );
  } catch (y) {
    throw b = !0, y;
  }
  return a.throwIfAborted(), g(!1);
}
function If(e, t, n) {
  const a = e.candidates.findIndex((s) => s.id === t);
  if (e.partial || a < 0 || a >= e.cursor) return e;
  const i = e.ranked.filter((s) => s.id !== t);
  return n > 0 && _c(i, { ...e.candidates[a], count: n }), {
    ...e,
    ranked: i,
    complete: $i(e.candidates, e.cursor, i, e.limit)
  };
}
const Oi = /* @__PURE__ */ new Map();
function Rf(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function jc(e, t) {
  const n = Rf(t);
  return Oi.set(e, n), n;
}
function $f(e) {
  const [t, n] = C(null);
  if (H(() => {
    if (e === null || Oi.has(e)) return;
    const a = new AbortController();
    return de(`/api/performers/${e}`, { signal: a.signal }).then(
      (i) => {
        const s = jc(e, i == null ? void 0 : i.tags);
        a.signal.aborted || n({ id: e, tags: s });
      },
      () => {
      }
    ), () => a.abort();
  }, [e]), e !== null)
    return Oi.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
function yr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((o, c) => yr(o, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, a = t, i = Object.keys(n).sort(), s = Object.keys(a).sort();
  return i.length === s.length && i.every(
    (o, c) => o === s[c] && yr(n[o], a[o])
  );
}
function Of(e) {
  var c, d, p;
  const [t, n] = C({}), [a, i] = C(""), s = (((c = e == null ? void 0 : e.presentation) == null ? void 0 : c.annotations) ?? []).includes("tags") ? ((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotationParents) ?? [] : [], o = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...s,
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return H(() => {
    let u = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(o).map(
        async (m) => [m, await Va([m])]
      )
    ).then((m) => {
      u && n(Object.fromEntries(m));
    }).catch(() => {
      u && i(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      u = !1;
    };
  }, [o]), { ids: t, error: a };
}
function Mf(e, t, n) {
  const a = t == null ? void 0 : t.presentation, i = (a == null ? void 0 : a.annotations) ?? [], s = (a == null ? void 0 : a.annotationParents) ?? [];
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
    tags: i.includes("tags") && s.length > 0 ? (e.tags ?? []).filter(
      (o) => s.some(
        (c) => {
          var d;
          return c !== o.id && ((d = n[c]) == null ? void 0 : d.includes(o.id));
        }
      )
    ) : []
  };
}
function Ff({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: a,
  disabled: i,
  onToggle: s
}) {
  var y;
  const o = ((y = t.presentation) == null ? void 0 : y.binParents) ?? [], c = new Set(
    o.flatMap((N) => (a[N] ?? []).filter((q) => q !== N))
  ), d = o.every((N) => a[N]), p = ma(t.view.objectFilter, n).bins.filter(
    (N) => !d || c.has(N)
  ), u = /* @__PURE__ */ new Map();
  for (const N of e)
    for (const q of N.tags ?? [])
      if (c.has(q.id)) {
        const w = u.get(q.id) ?? { name: q.name, count: 0 };
        w.count++, u.set(q.id, w);
      }
  const m = p.filter((N) => !u.has(N)), b = jr(m);
  for (const N of m)
    u.set(N, {
      name: b[N] === void 0 ? "…" : b[N] ?? "Unavailable tag",
      count: 0
    });
  if (!o.length) return null;
  const g = [...u].sort((N, q) => N[1].name.localeCompare(q[1].name));
  return /* @__PURE__ */ l("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ r("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    g.map(([N, q]) => {
      const w = p.includes(N);
      return /* @__PURE__ */ l(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": w,
          title: w ? `Show every video again, not only ${q.name}` : `Show only videos tagged ${q.name}`,
          disabled: i,
          onClick: () => s(N),
          children: [
            w && /* @__PURE__ */ r(Ga, { "aria-hidden": "true" }),
            q.name,
            " ",
            /* @__PURE__ */ r("span", { className: "dq-bin-count", children: q.count })
          ]
        },
        N
      );
    }),
    !g.length && /* @__PURE__ */ r("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function hr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function xf(e) {
  if (!hr(e) || Object.keys(e).length !== 1 || !hr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !hr(t.tagsCriterion)) return null;
  const { value: n, modifier: a, depth: i, ...s } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && a === "INCLUDES" && i === 0 && !Object.keys(s).length ? n[0] : null;
}
function ma(e, t) {
  let n = e;
  const a = [];
  for (; ; ) {
    if (t && yr(n, t)) {
      n = t;
      break;
    }
    const i = Object.keys(n);
    if (i.length !== 1 || i[0] !== "_filterExpression") break;
    const s = n._filterExpression;
    if (!hr(s) || s.operator !== "AND" || !Array.isArray(s.children))
      break;
    const o = s.children, c = xf(o.at(-1));
    if (c == null || o.length > 3) break;
    let d = {}, p = null, u = !0;
    for (const [m, b] of o.slice(0, -1).entries())
      !hr(b) || Object.keys(b).length !== 1 ? u = !1 : m === 0 && hr(b.filter) && Object.keys(b.filter).length ? d = b.filter : !p && hr(b.group) ? p = b.group : u = !1;
    if (!u) break;
    a.unshift(c), n = p ? { ...d, _filterExpression: p } : d;
  }
  return { base: n, bins: a };
}
function Pf(e, t, n) {
  const { base: a, bins: i } = ma(e.view.objectFilter, n);
  return (i.includes(t) ? i.filter((o) => o !== t) : [...i, t]).reduce(Lf, { ...e, view: { ...e.view, objectFilter: a } });
}
function Lf(e, t) {
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
const za = [
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
], Df = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function wr(e) {
  const t = Ie(e) ? e.occurrence : void 0;
  return {
    filter: Ut({
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
function Zs(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function Mi(e, t) {
  let n;
  if (Ie(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!za.some((c) => c !== "performer" && t.has(c))) {
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
      const p = d.lastIndexOf(":");
      return { key: d.slice(0, p), direction: d.slice(p + 1) };
    });
    if (c.some((d) => !d.key || !["asc", "desc"].includes(d.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = c, i.sort = c[0].key, i.direction = c[0].direction;
  }
  let s;
  if (Ie(e) && (s = {
    ...Df,
    ...Zs(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(s.targetMode) || !Ki.includes(s.condition) || !Array.isArray(s.performerIds) || !Array.isArray(s.conditionTagIds) || typeof s.includeSubtags != "boolean" || typeof s.hideConfirmedAbsent != "boolean" || [...s.performerIds, ...s.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !s.performerFilter || typeof s.performerFilter != "object" || Array.isArray(s.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const o = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Ut(i, je(e)),
      objectFilter: Zs(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: o,
      performerScope: s,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && o === "end"
  };
}
const eo = { dataQualityOpenedFromList: !0 };
function Uc() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function Gc(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...eo }, "", e) : window.history.replaceState(Uc() ? { ...eo } : null, "", e);
}
function na(e, t) {
  const n = new URLSearchParams(window.location.search);
  za.forEach((a) => n.delete(a)), n.set("review", e);
  for (const a of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[a] !== void 0 && n.set(a, String(t.filter[a]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((a) => `${a.key}:${a.direction}`).join(",")
  ), n.set("filters", JSON.stringify(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), Gc(`${window.location.pathname}?${n}${window.location.hash}`);
}
function Sn(e, t) {
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
function gr(e) {
  const t = e;
  return Sn(t, wr(t));
}
function to(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !yr(
    JSON.parse(Vn(Sn(e, t))),
    JSON.parse(Vn(Sn(e, wr(e))))
  );
}
function Kc(e, t) {
  if (_e(e) !== "video") return e;
  const { base: n, bins: a } = ma(e.view.objectFilter, t.view.objectFilter);
  return a.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function $a(e, t) {
  if (_e(e) !== "video") return t;
  const { base: n, bins: a } = ma(t.objectFilter, e.view.objectFilter);
  return a.length ? { ...t, objectFilter: n } : t;
}
function no(e, t) {
  return !t || !Ie(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function li(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const a of e)
    n.set(a.media.id, [...n.get(a.media.id) ?? [], a]);
  return [...n.values()].reverse().flat();
}
const Zt = (e) => e instanceof Error ? e.message : "Request failed.", di = 50, _f = [], ro = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function jf(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? El(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? bo(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Uf({ media: e, kind: t }) {
  const [n, a] = C(!1);
  return /* @__PURE__ */ r("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ r(So, {}) : /* @__PURE__ */ r(Ka, {}) : /* @__PURE__ */ r(
    "img",
    {
      src: wi(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => a(!0)
    }
  ) });
}
function Gf({
  tags: e,
  preview: t,
  showPreview: n,
  trees: a,
  actionTagIds: i,
  label: s
}) {
  const o = is(t), c = n ? o : null, d = e == null ? void 0 : e.absent, p = ha(
    ye(() => [...i, ...d ?? []], [i, d])
  ), u = (G) => p[G] ?? { id: G, name: p[G] === void 0 ? "…" : "Unavailable tag" }, m = (G) => mr(G.map(u)), b = c && e ? Zi(c, e, a) : null, g = e ? Md(e) : [], y = new Set(g.map((G) => G.id)), N = new Set(b == null ? void 0 : b.removed), q = new Set(b == null ? void 0 : b.markedAbsent), w = new Set(b == null ? void 0 : b.absenceCleared), I = /* @__PURE__ */ l("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ r(xa, { "aria-hidden": "true" }),
    "absent"
  ] }), M = m((b == null ? void 0 : b.added) ?? []), j = m(((b == null ? void 0 : b.markedAbsent) ?? []).filter((G) => !y.has(G)));
  return /* @__PURE__ */ l("section", { className: "dq-panel-section", "aria-label": s, children: [
    /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ l(me, { children: [
      g.length || M.length || j.length ? /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        g.map(
          (G) => N.has(G.id) ? /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ l("del", { children: [
              "− ",
              /* @__PURE__ */ r(Gt, { tag: G })
            ] }),
            q.has(G.id) && I
          ] }, G.id) : /* @__PURE__ */ r("li", { className: "dq-tag", children: /* @__PURE__ */ r(Gt, { tag: G }) }, G.id)
        ),
        M.map((G) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
          "+ ",
          /* @__PURE__ */ r(Gt, { tag: G })
        ] }) }, `added-${G.id}`)),
        j.map((G) => /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ r("ins", { children: /* @__PURE__ */ r(Gt, { tag: G }) }),
          I
        ] }, `absent-${G.id}`))
      ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ l(me, { children: [
        /* @__PURE__ */ r("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: m(e.absent).map((G) => /* @__PURE__ */ l(
          "li",
          {
            className: `dq-tag dq-tag-absent${w.has(G.id) ? " dq-tag-removed" : ""}`,
            children: [
              /* @__PURE__ */ r(xa, { "aria-hidden": "true" }),
              w.has(G.id) ? /* @__PURE__ */ l("del", { children: [
                "− ",
                /* @__PURE__ */ r(Gt, { tag: G })
              ] }) : /* @__PURE__ */ r(Gt, { tag: G })
            ]
          },
          G.id
        )) })
      ] })
    ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading…" })
  ] });
}
function Kf({ entries: e }) {
  return /* @__PURE__ */ r("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ l("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ r("span", { className: "dq-attention-category", children: t.name }),
    es(t).map((n) => /* @__PURE__ */ l("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ r(Mn, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function Bf({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: a,
  onSaveDefaults: i,
  editRequest: s = 0,
  onEditRequestHandled: o,
  pageControls: c,
  stayOnTap: d,
  onStayOnTapChange: p
}) {
  var Ar;
  const u = je(e), m = En(u), b = u === "audio" ? "Audio" : "Scene", g = (h) => {
    var E;
    return h.title || ((E = h.files[0]) == null ? void 0 : E.basename) || b;
  }, y = (h) => `${h.occurrence ? `${h.occurrence.performer.name} — ` : ""}${g(h.media)}`, N = O(null), q = O("");
  if (!N.current)
    try {
      N.current = Mi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (h) {
      q.current = Zt(h), N.current = { query: wr(e), startAtEnd: !1 };
    }
  const [w, I] = C(null), [M, j] = C(""), G = O(null), D = O(null), Z = O(null), ne = O(null), [se, oe] = C(!!q.current), _ = O(0), [U, S] = C(N.current.query), A = O(U);
  A.current = U;
  const [V, J] = C(0), ue = O(N.current.startAtEnd), [ce, B] = C([]), [T, Q] = C(null), z = O(null), [te, x] = C(null), [fe, Oe] = C(0), Ee = ye(() => {
    if (!T) return null;
    const h = ce.findIndex((E) => E.key === T.key);
    return h < 0 ? null : ce.slice(h + 1).find((E) => E.media.id !== T.media.id) ?? null;
  }, [T, ce]), [Ye, Ae] = C(0), [Be, en] = C(!1), [ke, kn] = C(!1), ge = O(!1), Ve = O(!0), qt = O(null);
  H(() => (Ve.current = !0, () => {
    Ve.current = !1;
  }), []);
  const [hn, Me] = C(q.current), [rt, Te] = C(""), [Xe, Kt] = C(null), [$e, Cn] = C(!1), [dt, $t] = C([]), ft = O([]), Bt = O(null), vt = O(null), Xn = O(null);
  H(() => {
    var h, E;
    $e && ((E = (h = Xn.current) == null ? void 0 : h.querySelector("input")) == null || E.focus());
  }, [$e]);
  const [kt, An] = C(!1), [Vt, Ot] = C(!1), pn = pa(), [we, St] = C(!1), at = d ?? we, Pn = p ?? St;
  H(() => {
    if (Be || kt || !vt.current) return;
    const h = requestAnimationFrame(() => {
      if (document.querySelector(ro)) return;
      const E = vt.current;
      vt.current = null;
      const R = document.activeElement;
      R && R !== document.body || E != null && E.isConnected && !E.disabled && E.focus();
    });
    return () => cancelAnimationFrame(h);
  }, [Be, kt, V]);
  const [Jt, Fe] = C([]), [Ct, re] = C({}), F = O(null), Se = O(0), [ht, Ln] = C({});
  H(() => {
    let h = !0;
    return Promise.all(
      ds(U.objectFilter).map(
        async (E) => [
          String(E),
          (await de(`/api/tags/${E}`)).name
        ]
      )
    ).then((E) => {
      h && Ln(Object.fromEntries(E));
    }).catch(() => {
    }), () => {
      h = !1;
    };
  }, [U.objectFilter]);
  const he = ye(
    () => us(U.objectFilter, ht),
    [ht, U.objectFilter]
  ), At = O(0), et = O(e);
  et.current = e;
  const xe = w ?? e, Ze = ye(
    () => Sn(xe, U),
    [xe, U]
  ), zt = ye(
    () => no(Ze, U.performerFocus),
    [Ze, U.performerFocus]
  ), it = O(zt);
  it.current = zt;
  const pt = O(Ze);
  pt.current = Ze;
  const [Mt, Wt] = C("items"), [st, Dn] = C(null), Qt = O(null), _n = O("");
  function Ft(h) {
    const E = typeof h == "function" ? h(Qt.current) : h;
    Qt.current = E, Dn(E);
  }
  const [mn, tn] = C(!1), [k, P] = C(null), W = O(null), pe = Ie(Ze) ? Fa(Ze) : "", [ae, Re] = C(0), [Ce, xt] = C(null);
  H(() => () => {
    var h;
    return (h = W.current) == null ? void 0 : h.controller.abort();
  }, []), H(() => {
    const h = W.current;
    !h || h.signature === pe || (h.controller.abort(), W.current = null, tn(!1));
  }, [pe]), H(() => {
    var R;
    const h = Qt.current;
    if (Mt !== "performers" || !pe || ((R = W.current) == null ? void 0 : R.signature) === pe || _n.current === pe || (h == null ? void 0 : h.signature) === pe && h.complete)
      return;
    const E = (h == null ? void 0 : h.signature) === pe ? h : null;
    Sr(h, (E == null ? void 0 : E.limit) ?? di);
  }, [Mt, pe, st, k, mn]);
  const be = U.performerFocus;
  H(() => {
    if (!be) {
      xt(null);
      return;
    }
    let h = !0;
    return de(`/api/performers/${be}`).then((E) => {
      const R = jc(be, E.tags);
      h && xt({ id: be, name: E.name, tags: R });
    }).catch(() => {
    }), () => {
      h = !1;
    };
  }, [be]);
  const Ne = JSON.stringify(
    Ie(Ze) ? Ao(Ze.occurrence) : []
  ), ve = ye(() => JSON.parse(Ne), [Ne]), Pt = ye(() => Ld(ve), [ve]), Tn = Vo(Pt), Ur = ha(Pt), Gr = (h) => {
    var E;
    return ((E = Ur[h]) == null ? void 0 : E.name) ?? (Ur[h] === null ? "Unavailable tag" : "…");
  }, Kr = (h) => ({
    name: Gr(h),
    tagIds: Tn.get(h) ?? [h],
    resolved: Tn.has(h)
  }), Nt = xc(
    Ie(Ze) ? Ze : null,
    be ?? null,
    ae
  ), Ht = to(e, U), Zn = to(e, $a(e, U)), mt = ke || Be || $e, gn = Number(U.filter.page);
  function Le(h, E = !1) {
    ge.current || (q.current = "", ue.current = E, A.current = h, S(h), Ae(0), en(!0), E || na(e.id, h), J((R) => R + 1));
  }
  function tt() {
    if (ge.current = !1, kn(!1), Ve.current && qt.current) {
      const h = qt.current;
      qt.current = null, Le(h.query, h.startAtEnd);
    }
  }
  H(() => {
    const h = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const E = Mi(
            et.current,
            new URLSearchParams(window.location.search)
          );
          ge.current ? qt.current = E : Le(E.query, E.startAtEnd);
        } catch (E) {
          Me(Zt(E));
        }
    };
    return window.addEventListener("popstate", h), () => window.removeEventListener("popstate", h);
  }, [e.id]), H(() => (a(ke || Be || $e || !!w), () => a(!1)), [ke, Be, $e, !!w, a]);
  async function gt(h, E, R) {
    if (Ie(h)) {
      const le = await Tc(
        h,
        F.current,
        E,
        R
      );
      return {
        items: le.items.map((ie) => ({
          key: ie.key,
          media: ie.media,
          occurrence: ie
        })),
        totalCount: le.totalCount
      };
    }
    const X = await ta(
      h,
      { ...h.view.filter, page: E },
      R
    );
    return {
      items: X.items.map((le) => ({ key: String(le.id), media: le })),
      totalCount: X.totalCount
    };
  }
  function bt(h, E, R, X = !1, le = !1) {
    if (!Ve.current || qt.current) return;
    oe(!0), B(
      le ? h.items : li(h.items, A.current.startFrom === "end")
    ), Ae(h.totalCount), Lt(R, X);
    const ie = {
      ...A.current,
      filter: { ...A.current.filter, page: E }
    };
    A.current = ie, S(ie), na(e.id, ie);
  }
  function Lt(h, E = !1) {
    (h == null ? void 0 : h.key) !== (T == null ? void 0 : T.key) && (z.current = null), (h == null ? void 0 : h.media.id) !== (T == null ? void 0 : T.media.id) && x(E && h ? h.media.id : null), Q(h);
  }
  H(() => {
    if (q.current) return;
    const h = new AbortController();
    ne.current = h;
    const E = ++At.current;
    return en(!0), Me(""), Te(""), z.current = null, x(null), Q(null), B([]), Cn(!1), (async () => {
      const R = no(
        Sn(et.current, A.current),
        A.current.performerFocus
      );
      F.current = Ie(R) ? await fs(R, h.signal) : null;
      let X = Number(R.view.filter.page), le = await gt(R, X, h.signal);
      const ie = Math.max(
        1,
        Math.ceil(le.totalCount / Number(R.view.filter.perPage))
      );
      (ue.current || X > ie) && (X = ie, le = await gt(R, X, h.signal)), ue.current = !1;
      const Qe = R.view.startFrom === "end" ? -1 : 1;
      for (; Ie(R) && !le.items.length && X + Qe >= 1 && X + Qe <= ie && !h.signal.aborted; )
        X += Qe, le = await gt(R, X, h.signal);
      if (E !== At.current || h.signal.aborted) return;
      const It = li(le.items, R.view.startFrom === "end");
      bt(le, X, It[0] ?? null);
    })().catch((R) => {
      !h.signal.aborted && E === At.current && Me(Zt(R));
    }).finally(() => {
      !h.signal.aborted && E === At.current && (oe(!0), en(!1));
    }), () => {
      h.abort(), At.current++;
    };
  }, [V, e.id]), H(() => {
    if (Kt(null), !T) return;
    let h = !0;
    return fn(u, T).then((E) => {
      h && (Kt(E), Fe(
        Ie(e) ? E.ids.filter((R) => e.occurrence.tagIds.includes(R)) : []
      ));
    }).catch((E) => {
      h && Me(`Could not load current tags. ${Zt(E)}`);
    }), () => {
      h = !1;
    };
  }, [T]), H(() => {
    if (!Ie(e) || e.actions.length)
      return;
    let h = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (E) => [
          E,
          (await de(`/api/tags/${E}`)).name
        ]
      )
    ).then((E) => {
      h && re(Object.fromEntries(E));
    }).catch((E) => {
      h && Me(Zt(E));
    }), () => {
      h = !1;
    };
  }, [e]);
  async function Dt(h = !1, E = !1, R = !1) {
    var Nn;
    if (!T) return;
    const X = ce.findIndex((Je) => Je.key === T.key), le = U.startFrom === "end" ? -1 : 1, ie = ((Nn = z.current) == null ? void 0 : Nn.key) === T.key ? z.current : { key: T.key, page: gn, before: ce.slice(0, X + 1).map((Je) => Je.key), after: ce.slice(X + 1).map((Je) => Je.key) }, Qe = new Set(ie.after), It = new Set(ie.before), Ge = ce.find((Je) => {
      var ln;
      return Qe.has(Je.key) || (le === 1 || gn < ie.page) && ((ln = z.current) == null ? void 0 : ln.key) === T.key && !It.has(Je.key);
    });
    if (!h && Ge) {
      Lt(Ge, R);
      return;
    }
    const yt = h ? It : new Set(ce.map((Je) => Je.key)), ot = 1100 - (Date.now() - Se.current);
    ot > 0 && await new Promise((Je) => window.setTimeout(Je, ot));
    let Ke = le === -1 && !h ? Math.max(1, gn - 1) : gn;
    for (; Ve.current && !qt.current; ) {
      let Je = await gt(zt, Ke);
      const ln = Math.max(
        1,
        Math.ceil(Je.totalCount / Number(U.filter.perPage))
      );
      Ke > ln && (Ke = ln, Je = await gt(zt, Ke));
      const _t = li(Je.items, le === -1), Hr = new Map(_t.map((Et) => [Et.key, Et])), Na = h ? ie.after.flatMap((Et) => {
        const Ir = Hr.get(Et);
        return Ir ? [Ir] : [];
      }) : [], qa = new Set(Na.map((Et) => Et.key)), dr = h ? {
        ...Je,
        items: [
          ...Na,
          ..._t.filter(
            (Et) => Et.key !== T.key && !qa.has(Et.key)
          )
        ]
      } : Je;
      if (E) {
        z.current = ie, bt(dr, Ke, T, !1, h);
        return;
      }
      const Tr = le === -1 && gn === 1 && !h ? void 0 : dr.items.find(
        (Et) => !yt.has(Et.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(h && le === -1 && Ke === ie.page) || Qe.has(Et.key))
      );
      if (Tr || (le === -1 ? Ke <= 1 : Ke >= ln)) {
        bt(
          dr,
          Ke,
          Tr ?? null,
          R,
          h
        ), Tr || Te(
          Je.totalCount ? `Reached the end in this direction. Matching items remain available from the ${m.queue} pages.` : `No matching ${m.many}.`
        );
        return;
      }
      Ke += le;
    }
  }
  async function nn(h, E = !1, R = !1, X = !1) {
    if (w || !T || ge.current || Be || $e && !R)
      return;
    const le = R || X || !!(h != null && h.steps.length);
    if (le && (!t || !Xe) || h && Wn(h) && !n) return;
    const ie = !E && !R && !X && le && h !== void 0 && Xe !== null && xs(e) && qi(Ni(e.actions, xd(h, Xe, on))).length > 0;
    ge.current = !0, kn(!0), Me(""), Te("");
    const Qe = ce.findIndex((ot) => ot.key === T.key), It = le && !E && !ie && Qe >= 0 ? ce[Qe + 1] ?? null : null;
    It && (B(
      (ot) => ot.filter((Ke) => Ke.key !== T.key)
    ), Lt(It, !0));
    let Ge = !1, yt = [];
    try {
      if (le) {
        const ot = await fn(u, T);
        if (h)
          await Xu(zt, T, h);
        else {
          const Nn = X && Ie(e) ? e.occurrence.tagIds.filter((_t) => ot.ids.includes(_t)) : ft.current, ln = Lr(Nn, X ? Jt : dt);
          await ms(zt, T, ln);
        }
        Se.current = Date.now();
        const Ke = await fn(u, T);
        It || Kt(Ke), Ge = !0, Cn(!1), ie && (yt = qi(Ni(e.actions, Ke))), Te(
          yt.length ? `Tags saved. Staying until answered: ${yt.map((Nn) => Nn.name).join(", ")}.` : "Tags saved."
        ), T.occurrence && (ba(T.occurrence.performer.id), Re((Nn) => Nn + 1));
      }
      if (!Ve.current || qt.current) return;
      le ? yt.length || await Dt(!0, E, !E) : E || await Dt(), E && R && requestAnimationFrame(() => {
        var ot;
        return (ot = Bt.current) == null ? void 0 : ot.focus();
      });
    } catch (ot) {
      if (Me(
        Ge ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Zt(ot)}` : le ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Zt(ot)}` : `Could not advance. ${Zt(ot)}`
      ), le && !Ge) {
        It && (B(ce), x(null), Oe((Ke) => Ke + 1), Q(T)), Se.current = Date.now();
        try {
          Kt(await fn(u, T));
        } catch {
          Kt(null), Me(
            (Ke) => `${Ke} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      tt();
    }
  }
  const er = !$e && !w && !kt && !Vt && (T != null || Be || ke);
  ts({
    surface: "local",
    enabled: er,
    actions: e.actions,
    onAction: (h, E) => {
      const R = e.actions[h];
      R && nn(R, E);
    },
    onFind: () => Ot(!0)
  });
  const rn = (h) => ke || Be || !Xe || !!w || !t && h.steps.length > 0 || !n && Wn(h);
  function Yt() {
    !i || w || ge.current || $e || (Z.current = document.activeElement, D.current = {
      error: hn,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(A.current),
      items: ce,
      current: T,
      total: Ye,
      targets: F.current,
      stayedCursor: z.current
    }, I(structuredClone(e)), j(""), Te(""), Me(""));
  }
  H(() => {
    if (!s) {
      _.current = 0;
      return;
    }
    s !== _.current && se && !Be && (_.current = s, Yt(), o == null || o());
  }, [s, Be, se]);
  function Nr() {
    I(null), j(""), requestAnimationFrame(() => {
      const h = Z.current;
      h != null && h.isConnected && h !== document.body && h.focus();
    });
  }
  function qr() {
    var E;
    const h = D.current;
    !h || ke || ((E = ne.current) == null || E.abort(), At.current++, A.current = h.query, S(h.query), B(h.items), Q(h.current), Ae(h.total), F.current = h.targets, z.current = h.stayedCursor, en(!1), Me(h.error), Te(""), window.history.replaceState(window.history.state, "", h.url), Nr());
  }
  async function ga() {
    if (!w || !i || ge.current) return;
    const h = Sn(
      { ...w, name: w.name.trim() },
      $a(et.current, A.current)
    ), E = sa(h);
    if (E) {
      j(E);
      return;
    }
    ge.current = !0, kn(!0), j("");
    try {
      if (await i(h) === !1) throw new Error("Could not save review.");
      Nr(), Te("Review saved.");
    } catch (R) {
      j(
        "Could not save review. Your edits are still open. " + Zt(R)
      );
    } finally {
      tt();
    }
  }
  async function Pe() {
    if (!i || ge.current) return;
    const h = $a(et.current, A.current), E = Sn(et.current, {
      ...h,
      filter: { ...h.filter, page: 1 }
    });
    ge.current = !0, kn(!0), Me("");
    try {
      if (await i(E) === !1) throw new Error("Could not save review.");
      Te("Queue saved to this review.");
    } catch (R) {
      Me("Could not save queue. " + Zt(R));
    } finally {
      tt();
    }
  }
  const ut = U.performerScope, bn = (h) => {
    const { performerFocus: E, ...R } = A.current, X = E && !("targetMode" in h || "performerIds" in h || "performerFilter" in h);
    Le({
      ...R,
      ...X ? { performerFocus: E } : {},
      filter: { ...R.filter, page: 1 },
      performerScope: { ...ut, ...h }
    });
  };
  async function Sr(h, E) {
    var le;
    const R = pt.current;
    if (!Ie(R)) return;
    (le = W.current) == null || le.controller.abort();
    const X = {
      signature: Fa(R),
      controller: new AbortController()
    };
    W.current = X, _n.current = "", tn(!0), P(null);
    try {
      const ie = await Tf(R, h, E, X.controller.signal, {
        onProgress: (Qe) => {
          W.current === X && Ft(Qe);
        }
      });
      W.current === X && Ft(ie);
    } catch (ie) {
      W.current === X && !X.controller.signal.aborted && (_n.current = X.signature, P({ signature: X.signature, message: Zt(ie) }));
    } finally {
      W.current === X && (W.current = null, tn(!1));
    }
  }
  function yn() {
    var h;
    (h = W.current) == null || h.controller.abort(), W.current = null, tn(!1), Ft((E) => E && { ...E, partial: !0, complete: !1 });
  }
  async function ba(h) {
    var le;
    const E = pt.current;
    if (!Ie(E)) return;
    if (W.current) {
      yn();
      return;
    }
    const R = Fa(E);
    if (((le = Qt.current) == null ? void 0 : le.signature) !== R || Qt.current.partial) return;
    const X = 1100 - (Date.now() - Se.current);
    X > 0 && await new Promise((ie) => window.setTimeout(ie, X));
    try {
      const ie = await Dc(E, h);
      if (W.current) {
        yn();
        return;
      }
      Ft(
        (Qe) => (Qe == null ? void 0 : Qe.signature) === R ? If(Qe, h, ie) : Qe
      );
    } catch {
      Ft(
        (ie) => (ie == null ? void 0 : ie.signature) === R ? { ...ie, partial: !0, complete: !1 } : ie
      );
    }
  }
  const tr = U.performerFocus ? st == null ? void 0 : st.candidates.find((h) => h.id === U.performerFocus) : void 0, nt = Ce && Ce.id === U.performerFocus ? { ...Ce, flags: fr(ve, Ce.tags) } : tr ? { ...tr, flags: fr(ve, tr.tags) } : null, an = (h) => {
    if ((Ce == null ? void 0 : Ce.id) === h)
      return fr(ve, Ce.tags);
    const E = st == null ? void 0 : st.candidates.find((R) => R.id === h);
    return E ? fr(ve, E.tags) : void 0;
  }, sn = ((Ar = T == null ? void 0 : T.occurrence) == null ? void 0 : Ar.performer.id) ?? null, wn = sn === null ? void 0 : an(sn), De = $f(
    ve.length > 0 && sn !== null && sn !== U.performerFocus && wn === void 0 ? sn : null
  ), Br = wn ?? (De ? fr(ve, De) : []), on = Bo(xe.actions), Er = Nt.summary && U.performerFocus ? Qo(gs(Nt.summary, xe.actions, on)) : [], nr = Ps(ve, (nt == null ? void 0 : nt.flags) ?? [], Kr), rr = Ho(
    Ps(ve, Br, Kr),
    sn !== null && sn === U.performerFocus ? Er : []
  ), Vr = JSON.stringify(rr), kr = ye(() => rr, [Vr]), ar = JSON.stringify(nr), Jr = ye(() => nr, [ar]), In = (h) => Kd(ve, h, Gr);
  function ir(h) {
    if (ge.current) return;
    const E = {
      ...A.current,
      performerFocus: h,
      filter: { ...A.current.filter, page: 1 }
    };
    Le(E, E.startFrom === "end"), Wt("items");
  }
  function Wa() {
    const { performerFocus: h, ...E } = A.current;
    Le(
      { ...E, filter: { ...E.filter, page: 1 } },
      E.startFrom === "end"
    );
  }
  const sr = O(null);
  sr.current ?? (sr.current = ic());
  const ya = sr.current, Qa = ye(
    () => xe.actions.flatMap((h) => h.steps.flatMap((E) => E.tagIds)),
    [xe.actions]
  ), wa = O(null);
  H(() => {
    const h = wa.current, E = h == null ? void 0 : h.querySelector('[aria-current="true"]');
    if (!h || !E) return;
    const R = h.getBoundingClientRect(), X = E.getBoundingClientRect();
    X.top < R.top ? h.scrollTop -= R.top - X.top : X.bottom > R.bottom && (h.scrollTop += X.bottom - R.bottom);
  }, [T == null ? void 0 : T.key, Mt]);
  const Cr = O(null), zr = O(null);
  H(() => {
    var R, X;
    const h = zr.current;
    if (!h) return;
    zr.current = null;
    const E = [...((R = Cr.current) == null ? void 0 : R.querySelectorAll(".dq-partner")) ?? []];
    (X = E.find((le) => le.dataset.partnerKey === h) ?? E[0]) == null || X.focus();
  }, [T == null ? void 0 : T.key]);
  const Tt = ke || Be || $e || !!w, vn = ye(
    () => w ? Sn(w, $a(e, U)) : null,
    [w, e, U]
  ), or = ye(
    () => vn != null && xr(gr(vn)) !== xr(gr(e)),
    [vn, e]
  );
  function jn() {
    T ? fn(u, T).then(Kt).catch((h) => Me(Zt(h))) : Le(A.current);
  }
  const Un = hn ? /* @__PURE__ */ l("p", { role: "alert", children: [
    hn,
    " ",
    /* @__PURE__ */ r("button", { type: "button", disabled: ke, onClick: jn, children: T ? "Reload tags" : "Retry queue" })
  ] }) : null, cn = ke || Be || T != null && !Xe, cr = Math.max(1, Number(U.filter.perPage) || 1), lr = O(1);
  Be || (lr.current = Math.max(1, Math.ceil(Ye / cr)));
  const Wr = lr.current, va = ut && T ? ce.filter(
    (h) => h.media.id === T.media.id && h.key !== T.key
  ) : [], Ha = (h) => {
    var E;
    return h.title || ((E = h.files[0]) == null ? void 0 : E.basename) || `${u === "audio" ? "Audio" : "Video"} ${h.id}`;
  }, Qr = T ? jf(T.media, u) : "";
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-review-workspace${u === "audio" ? " dq-audio" : ""}`,
      "aria-label": ut ? u === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : u === "audio" ? "Audio review" : "Video review",
      onClickCapture: (h) => {
        var X;
        const E = h.target instanceof Element ? h.target.closest("button") : null, R = (E == null ? void 0 : E.getAttribute("aria-label")) ?? ((X = E == null ? void 0 : E.textContent) == null ? void 0 : X.trim()) ?? "";
        E && !E.closest(ro) && /^(Filters|Edit filter:|Edit criteria)/.test(R) && (vt.current = E);
      },
      children: [
        /* @__PURE__ */ r(
          qc,
          {
            name: e.name,
            description: e.description,
            entityType: _e(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: Tt || !!(c != null && c.busy),
            onEdit: w ? () => {
              var h;
              return (h = G.current) == null ? void 0 : h.focus();
            } : Yt,
            editDisabled: !w && (Tt || !i || !!(c != null && c.busy)),
            editing: !!w,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: ke || $e, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: u === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ r(
                  ra,
                  {
                    filter: U.filter,
                    objectFilter: he,
                    criteriaDefinitions: u === "audio" ? po : Li,
                    customFieldEntityType: u,
                    totalCount: Ye,
                    sortOptions: u === "audio" ? Nl : mo,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(
                      Sc,
                      {
                        page: Math.min(Math.max(1, gn || 1), Wr),
                        pages: Wr,
                        onPage: (h) => Le({
                          ...A.current,
                          filter: Ut(
                            { ...A.current.filter, page: h },
                            u
                          )
                        })
                      }
                    ),
                    onFilterChange: (h) => {
                      (h.sort !== A.current.filter.sort || h.direction !== A.current.filter.direction) && (h = { ...h, sorts: void 0 }), Le({
                        ...A.current,
                        filter: Ut(h, u)
                      });
                    },
                    onObjectFilterChange: (h) => {
                      Le({
                        ...A.current,
                        objectFilter: kc(
                          h,
                          ht,
                          A.current.objectFilter
                        ),
                        filter: { ...A.current.filter, page: 1 }
                      });
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ l(me, { children: [
              ut && /* @__PURE__ */ r(
                kf,
                {
                  scope: ut,
                  disabled: ke || $e,
                  editing: !!w,
                  onChange: bn,
                  onEditCriteria: () => An(!0)
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ r(
                Ec,
                {
                  mode: "single",
                  disabled: Tt || !!c.busy,
                  onChange: () => {
                    var h;
                    return (h = c.onGrid) == null ? void 0 : h.call(c);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ l(me, { children: [
              Ie(zt) && t && /* @__PURE__ */ r(
                gf,
                {
                  review: zt,
                  disabled: mt || !!w,
                  performerAttention: U.performerFocus ? Jr : void 0,
                  trees: on,
                  onOpen: () => {
                    ge.current = !0, kn(!0);
                  },
                  onWrite: () => {
                    Se.current = Date.now();
                  },
                  onClose: (h) => {
                    if (h) {
                      Se.current = Date.now();
                      const E = A.current.performerFocus;
                      E ? ba(E) : yn(), Re((R) => R + 1), new Promise((R) => window.setTimeout(R, 1100)).then(() => {
                        tt(), Ve.current && (q.current || en(!0), J((R) => R + 1));
                      });
                    } else tt();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ r(
                os,
                {
                  disabled: Tt,
                  items: c.moreItems({
                    onSelect: Yt,
                    disabled: !i
                  })
                }
              )
            ] }),
            chipsStart: U.performerFocus ? /* @__PURE__ */ l("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ r(
                Fr,
                {
                  performer: {
                    id: U.performerFocus,
                    name: (nt == null ? void 0 : nt.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ l("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ r("strong", { children: (nt == null ? void 0 : nt.name) ?? `performer ${U.performerFocus}` })
              ] }),
              nt != null && nt.flags.length ? /* @__PURE__ */ l("span", { className: "dq-focus-flag", title: In(nt.flags), children: [
                /* @__PURE__ */ r(Mn, { "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-sr-only", children: In(nt.flags) })
              ] }) : null,
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: mt,
                  onClick: Wa,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: Ht,
            queueChange: !w && Ht ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: Zn ? () => void Pe() : void 0,
              saveDisabled: mt || !i,
              onReset: () => {
                const h = wr(e);
                Le(h, h.startFrom === "end");
              },
              resetDisabled: mt
            } : void 0,
            chipsEnd: w ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
          w && vn && /* @__PURE__ */ r(
            Nc,
            {
              drawerRef: G,
              draft: vn,
              onChange: (h) => I(h),
              direction: U.startFrom,
              onDirectionChange: (h) => Le({ ...A.current, startFrom: h }),
              tagGroups: _f,
              trees: on,
              saving: ke,
              saveDisabled: Be,
              error: M,
              dirty: or,
              criteriaChanged: Zn,
              notices: Un && /* @__PURE__ */ r("div", { className: "dq-review-feedback", children: Un }),
              onSave: () => void ga(),
              onCancel: qr
            }
          ),
          /* @__PURE__ */ r("div", { className: "dq-review-main", children: /* @__PURE__ */ l("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ l("div", { className: "dq-review-stage", children: [
              T ? /* @__PURE__ */ l(me, { children: [
                /* @__PURE__ */ l("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ r("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ l(
                    "a",
                    {
                      href: `/${u}/${T.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${m.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ r("span", { children: Ha(T.media) }),
                        /* @__PURE__ */ r(ko, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Qr && /* @__PURE__ */ r("span", { className: "dq-stage-meta", children: Qr })
                ] }),
                /* @__PURE__ */ l("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ r("div", { className: "dq-player-frame", children: [T, Ee].filter(Boolean).map((h) => {
                    var X, le, ie, Qe, It;
                    const E = h, R = E.key === T.key;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        className: R ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": R ? void 0 : !0,
                        inert: R ? void 0 : !0,
                        children: u === "audio" ? /* @__PURE__ */ r(
                          ql,
                          {
                            streamUrl: vi("audio", E.media.id),
                            format: ((X = E.media.files[0]) == null ? void 0 : X.format) ?? "",
                            title: g(E.media),
                            coverUrl: R ? wi("audio", E.media) : void 0,
                            duration: ((le = E.media.files[0]) == null ? void 0 : le.duration) ?? 0,
                            autostart: R && te === E.media.id
                          }
                        ) : /* @__PURE__ */ r(
                          go,
                          {
                            videoId: E.media.id,
                            streamUrl: vi("video", E.media.id),
                            posterUrl: R ? wi("video", E.media) : void 0,
                            duration: ((ie = E.media.files[0]) == null ? void 0 : ie.duration) ?? 0,
                            format: (Qe = E.media.files[0]) == null ? void 0 : Qe.format,
                            audioCodec: (It = E.media.files[0]) == null ? void 0 : It.audioCodec,
                            extensionSurface: R ? "quick-view" : void 0,
                            autostart: R && te === E.media.id,
                            keyboardShortcutsEnabled: R,
                            showAbLoop: R,
                            clip: E.media.parentVideoId != null ? {
                              start: E.media.clipStartSec ?? 0,
                              end: E.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${E.media.id}:${fe}`
                    );
                  }) }),
                  u === "audio" && /* @__PURE__ */ r(
                    yf,
                    {
                      details: T.media.details,
                      label: m.one
                    },
                    T.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ r("p", { role: "status", className: "dq-stage-status", children: Be ? "Loading review…" : Ye ? "Reached the end in this direction." : `No matching ${m.many}.` }),
              xe.actions.length > 0 ? /* @__PURE__ */ r(
                nu,
                {
                  actions: xe.actions,
                  mediaKind: u,
                  isDisabled: (h) => $e || rn(h),
                  busy: cn,
                  tags: Xe,
                  trees: on,
                  preview: ya,
                  onApply: (h, E) => void nn(h, E),
                  onFind: () => Ot(!0),
                  findDisabled: $e || !!w,
                  paused: !!w,
                  waitForGroups: xs(xe),
                  attention: kr,
                  stayOnTap: at,
                  onStayOnTapChange: Pn
                }
              ) : Ie(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ l(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || ke || $e || !Xe || !!w || !T,
                  children: [
                    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((h) => /* @__PURE__ */ l("label", { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Jt.includes(h),
                          onChange: (E) => Fe(
                            e.occurrence.multiple ? E.target.checked ? [...Jt, h] : Jt.filter((R) => R !== h) : [h]
                          )
                        }
                      ),
                      Ct[h] ?? "Loading tag…"
                    ] }, h)),
                    /* @__PURE__ */ l("div", { className: "dq-row", children: [
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => Fe([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void nn(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void nn(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ l("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ l("div", { className: "dq-panel-body", ref: Cr, children: [
                T && /* @__PURE__ */ l(me, { children: [
                  /* @__PURE__ */ l("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ l("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: T.occurrence ? T.occurrence.performer.name : `this ${m.one}` })
                    ] }),
                    /* @__PURE__ */ l("div", { className: "dq-reviewing-who", children: [
                      T.occurrence && /* @__PURE__ */ r(Fr, { performer: T.occurrence.performer }),
                      /* @__PURE__ */ l("div", { children: [
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: T.occurrence ? T.occurrence.performer.name : `This ${m.one}` }),
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-note", children: ut ? `Tags apply to this performer in this ${m.queue}` : `Tags apply to the whole ${m.one}` })
                      ] })
                    ] }),
                    kr.length > 0 && /* @__PURE__ */ r(Kf, { entries: kr })
                  ] }),
                  va.length > 0 && /* @__PURE__ */ l(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${m.queue}`,
                      children: [
                        /* @__PURE__ */ l("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          m.queue
                        ] }),
                        /* @__PURE__ */ r("div", { className: "dq-partners", children: va.map((h) => {
                          var E, R, X;
                          return /* @__PURE__ */ l(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (E = h.occurrence) == null ? void 0 : E.performer.name,
                              "aria-label": (R = h.occurrence) == null ? void 0 : R.performer.name,
                              "data-partner-key": h.key,
                              disabled: mt,
                              onClick: () => {
                                zr.current = T.key, Lt(h), Me("");
                              },
                              children: [
                                h.occurrence && /* @__PURE__ */ r(Fr, { performer: h.occurrence.performer }),
                                /* @__PURE__ */ r("span", { children: (X = h.occurrence) == null ? void 0 : X.performer.name })
                              ]
                            },
                            h.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ r(
                    Gf,
                    {
                      tags: Xe,
                      preview: ya,
                      showPreview: !$e,
                      trees: on,
                      actionTagIds: Qa,
                      label: `Current ${ut ? "occurrence" : m.one} tags`
                    }
                  ),
                  $e && /* @__PURE__ */ l(
                    "fieldset",
                    {
                      ref: Xn,
                      disabled: ke,
                      className: "dq-panel-section dq-tag-editor",
                      children: [
                        /* @__PURE__ */ l("legend", { className: "dq-eyebrow", children: [
                          "Edit ",
                          ut ? "occurrence" : m.one,
                          " tags"
                        ] }),
                        /* @__PURE__ */ r(
                          Qn,
                          {
                            entityType: "tag",
                            values: dt,
                            onChange: $t,
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
                              disabled: !Xe,
                              onClick: () => void nn(void 0, !0, !0),
                              children: "Save"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              disabled: !Xe,
                              onClick: () => void nn(void 0, !1, !0),
                              children: "Save & next"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              onClick: () => {
                                Cn(!1), requestAnimationFrame(() => {
                                  var h;
                                  return (h = Bt.current) == null ? void 0 : h.focus();
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
                Ie(Ze) && U.performerFocus && /* @__PURE__ */ r(
                  Ii,
                  {
                    ...Nt,
                    mediaKind: u,
                    actions: xe.actions,
                    trees: on,
                    flags: Jr
                  }
                )
              ] }),
              /* @__PURE__ */ l("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ l("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !w && Un,
                  rt && /* @__PURE__ */ r("p", { role: "status", children: rt })
                ] }),
                !t && /* @__PURE__ */ r("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                T && /* @__PURE__ */ l("div", { className: "dq-panel-actions", "aria-busy": cn || void 0, children: [
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      ref: Bt,
                      className: "dq-button",
                      disabled: mt || !!w || !t || !Xe,
                      onClick: () => {
                        ft.current = [...Xe.ids], $t([...Xe.ids]), Cn(!0);
                      },
                      children: [
                        /* @__PURE__ */ r(qo, { "aria-hidden": "true" }),
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
                      onClick: () => void nn(),
                      children: [
                        /* @__PURE__ */ r(Ll, { "aria-hidden": "true" }),
                        "Skip",
                        ut ? " performer" : ` ${m.one}`
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
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Mt === "items",
                        onClick: () => Wt("items"),
                        children: u === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Mt === "performers",
                        onClick: () => Wt("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              ut && Mt === "performers" ? /* @__PURE__ */ r(
                vf,
                {
                  ranking: (st == null ? void 0 : st.signature) === pe ? st : null,
                  busy: mn,
                  error: (k == null ? void 0 : k.signature) === pe ? k.message : "",
                  focus: U.performerFocus,
                  disabled: mt,
                  labels: m,
                  flagLabel: In,
                  onFocus: ir,
                  onMore: () => {
                    const h = Qt.current;
                    h && Sr(h, h.limit + di);
                  },
                  onRefresh: () => {
                    Ft(null), Sr(null, di);
                  }
                }
              ) : /* @__PURE__ */ r("div", { className: "dq-queue-list", ref: wa, children: ce.map((h) => {
                var R;
                const E = (T == null ? void 0 : T.key) === h.key;
                return /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: y(h),
                    "aria-label": y(h),
                    "aria-current": E ? "true" : void 0,
                    disabled: mt,
                    onClick: () => {
                      Lt(h), Me(""), Te("");
                    },
                    children: [
                      /* @__PURE__ */ r(Uf, { media: h.media, kind: u }),
                      /* @__PURE__ */ l("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: g(h.media) }),
                        /* @__PURE__ */ l("span", { className: "dq-queue-row-meta", children: [
                          h.occurrence && /* @__PURE__ */ l(me, { children: [
                            /* @__PURE__ */ r(Fr, { performer: h.occurrence.performer }),
                            /* @__PURE__ */ r("span", { className: "dq-queue-row-performer", children: h.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ r("span", { className: "dq-queue-row-detail", children: [
                            h.media.date,
                            h.occurrence ? "" : (R = h.media.files[0]) != null && R.duration ? bo(h.media.files[0].duration) : ""
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
        ut && /* @__PURE__ */ r(
          Sl,
          {
            open: kt,
            onClose: () => An(!1),
            criteria: Pi,
            activeFilter: ut.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (h) => {
              An(!1), bn({ performerFilter: h });
            }
          }
        ),
        Vt && /* @__PURE__ */ r(
          as,
          {
            actions: e.actions,
            trees: on,
            isDisabled: (h) => rn(h),
            tapStays: pn && at,
            onApply: (h, E) => {
              Ot(!1), nn(h, E);
            },
            onClose: () => Ot(!1)
          }
        )
      ]
    }
  );
}
const Bc = "data-quality.reviews-sort.v1", Vf = { sort: "name", direction: "asc" };
function Jf() {
  try {
    const e = JSON.parse(localStorage.getItem(Bc) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return Vf;
}
function zf(e) {
  try {
    localStorage.setItem(
      Bc,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function Vc(e, t, n, a) {
  const i = a === "asc" ? 1 : -1;
  return [...e].sort((s, o) => {
    if (n === "count") {
      const c = t[s.id], d = t[o.id], p = typeof c == "number", u = typeof d == "number";
      if (p !== u) return p ? -1 : 1;
      if (p && u && c !== d)
        return (c - d) * i;
    }
    return s.name.localeCompare(o.name, void 0, { numeric: !0, sensitivity: "base" }) * i;
  });
}
function ui(e, t) {
  const n = _e(e), a = En(Vi(n)), i = n === "tag" ? "tag" : Ie(e) ? a.queue : a.one;
  return t === 1 ? i : `${i}s`;
}
function Wf({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      ui(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      "Matching ",
      ui(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      ui(e, t)
    ] })
  ] });
}
function Qf({
  reviews: e,
  counts: t,
  sort: n,
  direction: a,
  onSortChange: i,
  onDirectionChange: s,
  storage: o,
  canConfigure: c,
  busy: d,
  headingRef: p,
  notices: u,
  onOpen: m,
  onNew: b,
  onImport: g,
  onExportAll: y,
  rowMenuItems: N
}) {
  const q = O(null), w = ye(
    () => Vc(e, t, n, a),
    [e, t, n, a]
  ), I = e.every((j) => t[j.id] !== void 0), M = a === "asc" ? "ascending" : "descending";
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
            disabled: !c || d,
            onClick: () => {
              var j;
              return (j = q.current) == null ? void 0 : j.click();
            },
            children: [
              /* @__PURE__ */ r(Dl, { "aria-hidden": "true" }),
              "Import"
            ]
          }
        ),
        /* @__PURE__ */ r(
          "input",
          {
            ref: q,
            type: "file",
            accept: "application/json,.json",
            hidden: !0,
            tabIndex: -1,
            onChange: (j) => {
              var D;
              const G = (D = j.target.files) == null ? void 0 : D[0];
              j.target.value = "", G && g(G);
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
              /* @__PURE__ */ r(Co, { "aria-hidden": "true" }),
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
            onClick: b,
            children: [
              /* @__PURE__ */ r(_i, { "aria-hidden": "true" }),
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
          o
        ] }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: I ? e.some((j) => t[j.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ l("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ l("label", { children: [
            /* @__PURE__ */ r("span", { children: "Sort by" }),
            /* @__PURE__ */ l(
              "select",
              {
                className: "dq-select",
                value: n,
                onChange: (j) => i(j.target.value),
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
              "aria-label": `Sort direction: ${M}`,
              title: `Sort direction: ${M}`,
              onClick: () => s(a === "asc" ? "desc" : "asc"),
              children: a === "asc" ? /* @__PURE__ */ r(_l, { "aria-hidden": "true" }) : /* @__PURE__ */ r(jl, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ l("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ l("tr", { children: [
          /* @__PURE__ */ r("th", { scope: "col", "aria-sort": n === "name" ? M : void 0, children: "Review" }),
          /* @__PURE__ */ r("th", { scope: "col", className: "dq-reviews-type", children: "Type" }),
          /* @__PURE__ */ r(
            "th",
            {
              scope: "col",
              className: "dq-reviews-count",
              "aria-sort": n === "count" ? M : void 0,
              children: "Matching"
            }
          ),
          /* @__PURE__ */ r("th", { scope: "col", className: "dq-reviews-actions", children: /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Actions" }) })
        ] }) }),
        /* @__PURE__ */ r("tbody", { children: w.map((j) => {
          const G = _e(j);
          return /* @__PURE__ */ l("tr", { children: [
            /* @__PURE__ */ r("td", { children: /* @__PURE__ */ l(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(j.id)}`,
                "data-review-id": j.id,
                onClick: (D) => {
                  D.button !== 0 || D.metaKey || D.ctrlKey || D.shiftKey || D.altKey || (D.preventDefault(), m(j.id));
                },
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ r(yc, { entityType: G }) }),
                  /* @__PURE__ */ l("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ r("span", { className: "dq-reviews-name", children: j.name }),
                    j.description && /* @__PURE__ */ r("span", { className: "dq-reviews-description", title: j.description, children: j.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-type", children: bc[G] }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-count", children: /* @__PURE__ */ r(Wf, { review: j, count: t[j.id] }) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ r(os, { label: `Actions for ${j.name}`, items: N(j) }) })
          ] }, j.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ l("div", { className: "dq-empty", children: [
      /* @__PURE__ */ r(Ka, { "aria-hidden": "true" }),
      /* @__PURE__ */ r("p", { children: "No reviews yet." }),
      /* @__PURE__ */ r("p", { children: c ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function Jc(e, { id: t, name: n, description: a }) {
  const i = { id: t, name: n, description: a }, s = (o, c = {}) => ({
    filter: { page: 1, perPage: 40, ...o },
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
          ...s({ sort: "name", direction: "asc" }, { startFrom: "beginning" }),
          objectFilter: { tagGroupsCriterion: { value: [], modifier: "IS_NULL" } }
        },
        actions: []
      };
    case "audio":
      return {
        ...i,
        entityType: "audio",
        view: s({ sort: "date", direction: "desc" }, { startFrom: "end", reviewMode: "single" }),
        actions: []
      };
    case "performerOccurrence":
    case "audioPerformerOccurrence":
      return {
        ...i,
        entityType: e,
        view: s({ sort: "date", direction: "desc" }, { startFrom: "end" }),
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
        view: s({ sort: "date", direction: "desc" }, { startFrom: "end" }),
        actions: []
      };
  }
}
function Hf({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: a
}) {
  const { review: i, saving: s, error: o } = e, c = O(null), d = O(null), p = O(s);
  p.current = s;
  const u = O(null), m = lt();
  H(() => {
    var y;
    return u.current ?? (u.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (y = d.current) == null || y.focus(), () => {
      var N;
      (N = u.current) != null && N.isConnected && u.current.focus({ preventScroll: !0 });
    };
  }, []);
  const b = O(s);
  H(() => {
    var q, w;
    const y = document.activeElement, N = !y || y === document.body || !((q = c.current) != null && q.contains(y));
    o && (!i.name.trim() || b.current && !s && N) && ((w = d.current) == null || w.focus()), b.current = s;
  }, [o, s]);
  const g = () => {
    p.current || a();
  };
  return /* @__PURE__ */ r(
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
              /* @__PURE__ */ r("h2", { id: m, children: "New review" }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-icon-button",
                  "aria-label": "Close dialog",
                  title: "Close",
                  disabled: s,
                  onClick: g,
                  children: /* @__PURE__ */ r(la, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ l("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ r("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              o && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: o }),
              /* @__PURE__ */ l("fieldset", { className: "dq-form-dialog-fields", disabled: s, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ r(
                  vc,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (y) => {
                      y !== _e(i) && t(Jc(y, i));
                    },
                    nameRef: d
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ l("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ r("button", { type: "button", className: "dq-text-button", onClick: () => ss(i), children: "Export draft" }),
              /* @__PURE__ */ r("span", { className: "dq-form-dialog-space" }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: s, onClick: g, children: "Cancel" }),
              /* @__PURE__ */ r("button", { type: "submit", className: "dq-button primary", "aria-disabled": s || void 0, children: s ? "Creating…" : "Create & configure" })
            ] })
          ]
        }
      )
    }
  );
}
const Yf = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function Xf(e, t, n, a) {
  return Kc(
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
function ao(e, t) {
  return _e(t) === "video" && ma(t.view.objectFilter, e.view.objectFilter).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function io(e, t) {
  return yr(
    JSON.parse(Vn(gr(e))),
    JSON.parse(Vn(gr(t)))
  );
}
const fi = 180;
function so(e) {
  return _e(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function oo(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function co() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function hi(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  za.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const a = n.toString();
  Gc(`${window.location.pathname}${a ? `?${a}` : ""}`, { openingFromList: t });
}
function Zf(e) {
  return Ut({ ...e, page: 1 });
}
function zc(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Or(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const eh = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Ui, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ r(Kl, { "aria-hidden": "true" }) }
], th = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Ui, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ r(Gl, { "aria-hidden": "true" }) }
], lo = [], Wc = "(min-width: 900px)";
function nh(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(Wc);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function rh() {
  return typeof window.matchMedia == "function" && window.matchMedia(Wc).matches;
}
function ah({
  onNavigate: e
}) {
  const [t, n] = C([]), [a] = C(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, s] = C(""), [o, c] = C(!0), [d, p] = C(""), [u, m] = C(!1), [b, g] = C(!1), [y, N] = C(!1), [q, w] = C(!1), [I, M] = C([]), [j, G] = C(""), [D, Z] = C(!0), [ne, se] = C("account"), [oe, _] = C(""), [U, S] = C(""), [A, V] = C(!1), [J, ue] = C(!1), [ce, B] = C(""), [T, Q] = C(co), z = O(T);
  z.current = T;
  const [te, x] = C({}), fe = O(te);
  fe.current = te;
  const Oe = O(t);
  Oe.current = t;
  const Ee = O(o);
  Ee.current = o;
  const Ye = O(!1), Ae = O(!0);
  H(() => (Ae.current = !0, () => {
    Ae.current = !1;
  }), []);
  const [Be, en] = C(!T);
  Be !== !T && (en(!T), T || x({}));
  const [ke, kn] = C(Jf), { sort: ge, direction: Ve } = ke, qt = (f) => {
    const v = { ...ke, ...f };
    kn(v), zf(v);
  }, hn = O(null), Me = O(null), [rt, Te] = C(null), [Xe, Kt] = C(!1), [$e, Cn] = C(!1), [dt, $t] = C(null), [ft, Bt] = C(null), vt = !!dt || !!ft, Xn = O(vt);
  Xn.current = vt;
  const kt = Xe || !!ft || $e, [An, Vt] = C(0), [Ot, pn] = C(!1), [we, St] = C(null), at = O(null), Pn = O(null), Jt = O(null), [Fe, Ct] = C(
    null
  ), re = t.find((f) => f.id === T) ?? null, F = ye(
    () => (Fe == null ? void 0 : Fe.id) === T && re ? { ...re, view: {
      ...re.view,
      filter: Fe.view.filter,
      objectFilter: Fe.view.objectFilter,
      searchMode: Fe.view.searchMode,
      startFrom: Fe.view.startFrom
    } } : re,
    [Fe, T, re]
  ), Se = F ? _e(F) : "video", ht = Vi(Se), Ln = F ? Ie(F) : !1, he = Se === "video" ? F : null, At = Ln && !!(F != null && F.actions.some(Wn)), et = !!he || Se === "audio" || At, [xe, Ze] = C(null), zt = (xe == null ? void 0 : xe.id) === (F == null ? void 0 : F.id) ? xe == null ? void 0 : xe.mode : (F == null ? void 0 : F.view.reviewMode) ?? "single", it = Ln || Se === "audio" || Se === "video" && zt === "single", [pt, Mt] = C(0), Wt = O(-1), st = O(!1), Dn = O(it);
  Dn.current = it, H(() => {
    const f = () => {
      const v = Dn.current;
      if (!v && yn.current) {
        st.current = !0;
        return;
      }
      Wt.current = -1, Et(), v || Mt(($) => $ + 1);
    };
    return window.addEventListener("popstate", f), () => window.removeEventListener("popstate", f);
  }, []);
  const Qt = ht === "audio" ? b : u, _n = Se === "tag" ? "Tag" : ht === "audio" ? "Audio" : "Video", Ft = Se === "tag" ? y : Qt, mn = O(
    null
  ), tn = Of(he), [k, P] = C({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [W, pe] = C({
    page: 1,
    perPage: 40
  }), [ae, Re] = C({ items: [], totalCount: 0 }), [Ce, xt] = C(T);
  Ce !== T && (xt(T), Re({ items: [], totalCount: 0 }), ue(!1));
  const [be, Ne] = C(!1), [ve, Pt] = C(""), [Tn, Ur] = C(!1), [Gr, Kr] = C(!1), [Nt, Ht] = C(() => /* @__PURE__ */ new Set()), Zn = O(Nt);
  Zn.current = Nt;
  const mt = O(/* @__PURE__ */ new Map()), gn = (F == null ? void 0 : F.view.selectAllOnLoad) === !0, [Le, tt] = C(null), gt = O(Le);
  gt.current = Le;
  const [bt, Lt] = C(!1), Dt = O(bt);
  Dt.current = bt;
  const nn = O(null), [er, rn] = C(!1), [Yt, Nr] = C("grid"), [qr, ga] = C(fi), [Pe, ut] = C(!1), [bn, Sr] = C(!1), yn = O(!1), [ba, tr] = C(""), [nt, an] = C(""), [sn, wn] = C(""), [De, Br] = C(null), [on, Er] = C(""), [nr, rr] = C(!1), [Vr, kr] = C({}), ar = O(/* @__PURE__ */ new Map()), Jr = O(null), In = O(null), ir = !!F, Wa = Fi(nh, rh, () => !1) && ir, [sr, ya] = C({ top: 0, bottom: 0 });
  Rt(() => {
    if (!ir) return;
    const f = () => {
      const $ = In.current;
      if (!$) return;
      const L = Math.round($.getBoundingClientRect().top + window.scrollY), Y = $.closest("main"), K = Y ? Math.round(parseFloat(getComputedStyle(Y).paddingBottom) || 0) : 0;
      ya(
        (ee) => ee.top === L && ee.bottom === K ? ee : { top: L, bottom: K }
      );
    };
    f();
    const v = typeof ResizeObserver > "u" ? null : new ResizeObserver(f);
    return v == null || v.observe(document.body), window.addEventListener("resize", f), () => {
      v == null || v.disconnect(), window.removeEventListener("resize", f);
    };
  }, [ir]);
  const [Qa, wa] = C(0), Cr = O(null), zr = qn((f) => {
    var $;
    if (($ = Cr.current) == null || $.disconnect(), Cr.current = null, !f || typeof ResizeObserver > "u") return;
    const v = new ResizeObserver(
      () => wa(Math.round(f.getBoundingClientRect().height))
    );
    v.observe(f), Cr.current = v;
  }, []), Tt = O(0), vn = O(0), or = O(null), jn = O(null), Un = Bo(
    F && !it ? we ? [...F.actions, ...we.draft.actions] : F.actions : lo
  ), cn = ye(
    () => we && F && re ? Xf(we.draft, F, k, re) : null,
    [we, F, k, re]
  ), cr = ye(
    () => F && re ? Kc(
      { ...re, view: { ...F.view, filter: { ...k, page: 1 } } },
      re
    ) : null,
    [F, re, k]
  ), lr = ye(
    () => re ? xr(gr(re)) : "",
    [re]
  ), Wr = ye(
    () => cr != null && xr(gr(cr)) !== lr,
    [cr, lr]
  ), va = ye(
    () => cn != null && xr(gr(cn)) !== lr,
    [cn, lr]
  );
  H(() => {
    if (!nt) return;
    const f = window.setTimeout(() => an(""), 4e3);
    return () => window.clearTimeout(f);
  }, [nt]), H(() => {
    if (!rt || rt.alert) return;
    const f = window.setTimeout(() => Te(null), 6e3);
    return () => window.clearTimeout(f);
  }, [rt]), H(() => {
    const f = he ? ds(he.view.objectFilter) : [];
    if (kr({}), !f.length) return;
    const v = new AbortController();
    let $ = !0;
    return Promise.all(
      f.map(async (L) => {
        var Y;
        try {
          const K = await de(`/api/tags/${L}`, {
            signal: v.signal
          });
          return (Y = K.name) != null && Y.trim() ? [String(L), K.name] : null;
        } catch {
          return null;
        }
      })
    ).then((L) => {
      $ && kr(
        Object.fromEntries(L.filter((Y) => Y !== null))
      );
    }), () => {
      $ = !1, v.abort();
    };
  }, [he == null ? void 0 : he.id, he == null ? void 0 : he.view.objectFilter]);
  const Ha = ye(
    () => he ? us(
      he.view.objectFilter,
      Vr
    ) : (F == null ? void 0 : F.view.objectFilter) ?? {},
    [Vr, F, he]
  ), Qr = qn(async () => {
    c(!0), p("");
    try {
      const f = await ld();
      n(f.reviews), s(f.storageKey), m(f.canWriteVideos ?? f.canWrite), g(f.canWriteAudios ?? !1), N(f.canWriteTags ?? !1), w(f.canReadTagGroups ?? !1), Z(f.canConfigure ?? !0), se(f.storage ?? "account"), _(f.storageNotice ?? ""), T && !f.reviews.some((v) => v.id === T) && (Q(""), hi(""));
    } catch (f) {
      p(
        f instanceof Error ? f.message : "Could not load reviews."
      );
    } finally {
      c(!1);
    }
  }, [T]);
  H(() => {
    if (!q) {
      M([]), G("");
      return;
    }
    const f = new AbortController();
    return G(""), Nd(f.signal).then(M).catch((v) => {
      f.signal.aborted || G(
        v instanceof Error ? v.message : "Could not load tag groups."
      );
    }), () => f.abort();
  }, [q]), H(() => {
    Qr();
  }, []), H(() => {
    if (T || t.length === 0) return;
    const f = new AbortController();
    for (const v of t) {
      if (typeof fe.current[v.id] == "number") continue;
      (Ie(v) ? fs(v, f.signal).then((L) => (L == null ? void 0 : L.length) === 0 ? { items: [], totalCount: 0 } : ta(hs(v, L), { ...v.view.filter, page: 1, perPage: 1 }, f.signal)) : _e(v) === "tag" ? $s(
        v,
        Ut({ ...v.view.filter, page: 1, perPage: 1 }),
        f.signal
      ) : ta(
        v,
        Ut({ ...v.view.filter, page: 1, perPage: 1 }),
        f.signal
      )).then((L) => {
        f.signal.aborted || x((Y) => ({
          ...Y,
          [v.id]: L.totalCount
        }));
      }).catch(() => {
        f.signal.aborted || x((L) => ({ ...L, [v.id]: null }));
      });
    }
    return () => f.abort();
  }, [T, t]), Rt(() => {
    var $, L;
    const f = Me.current;
    if (T || o || !f) return;
    Me.current = null, (L = (f === "heading" ? null : [...(($ = In.current) == null ? void 0 : $.querySelectorAll("[data-review-id]")) ?? []].find(
      (Y) => Y.dataset.reviewId === f.reviewId
    )) ?? hn.current) == null || L.focus();
  }, [T, o, ft, t]);
  const Ar = O(0), h = qn(async () => {
    const f = ++Ar.current;
    Br(null), Er("");
    try {
      const v = await (At ? jo(ht) : _o(ht));
      f === Ar.current && Br(v);
    } catch (v) {
      if (f !== Ar.current) return;
      Br(null), Er(
        "Tag assessment setup could not be checked. " + (v instanceof Error ? v.message : "Request failed.")
      );
    }
  }, [At, ht]);
  H(() => {
    h();
  }, [h]);
  const E = qn(
    async (f, v, $ = !1, L = !1) => {
      var wt, Ue;
      const Y = ++Tt.current;
      (wt = or.current) == null || wt.abort();
      const K = new AbortController();
      or.current = K, v = Ut(v);
      const ee = Number(v.page);
      $ && (v = { ...v, page: 1 }), P(v), Kr($), Ne(!0), Pt("");
      try {
        const ze = (Rn) => _e(f) === "tag" ? $s(
          f,
          Rn,
          K.signal
        ) : ta(
          f,
          Rn,
          K.signal
        );
        let qe = await ze(v);
        const We = Math.max(
          1,
          Math.ceil(qe.totalCount / Number(v.perPage))
        ), Gn = $ ? We : Math.min(ee, We);
        return Number(v.page) !== Gn && (v = { ...v, page: Gn }, qe = await ze(v)), Y === Tt.current && (((Ue = jn.current) == null ? void 0 : Ue.page) !== Gn && (jn.current = {
          page: Gn,
          ids: new Set(qe.items.map((Rn) => Rn.id))
        }), Re(qe), L && yt(
          () => new Set(qe.items.map((Rn) => Rn.id))
        ), P(v), pe(v)), qe;
      } catch (ze) {
        throw Y === Tt.current && Pt(
          ze instanceof Error ? ze.message : "Could not load the review queue."
        ), ze;
      } finally {
        Y === Tt.current && Ne(!1);
      }
    },
    []
  );
  H(() => {
    var v;
    if (vn.current += 1, Wt.current = -1, Tt.current += 1, (v = or.current) == null || v.abort(), St(null), at.current = null, ue(!1), B(""), S(""), V(!1), Ht(/* @__PURE__ */ new Set()), mt.current.clear(), tt(null), Lt(!1), ut(!1), yn.current = !1, tr(""), an(""), wn(""), Re({ items: [], totalCount: 0 }), jn.current = null, Ur(!1), !F || it) {
      Ne(!1), Ct(null);
      return;
    }
    let f = !0;
    return Ne(!0), (async () => {
      let $ = re ?? F;
      Ct(null);
      let L = null;
      const Y = new URLSearchParams(window.location.search);
      if (_e(F) === "video" && za.some((Ue) => Y.has(Ue)))
        try {
          const Ue = $;
          L = Mi(Ue, Y);
          const ze = Sn(Ue, L.query);
          (L.query.startFrom !== (Ue.view.startFrom ?? "end") || !yr(
            JSON.parse(Vn(ze)),
            JSON.parse(Vn(Sn(Ue, wr(Ue))))
          )) && ($ = ze, Ct($));
        } catch (Ue) {
          Ur(!0), Pt(Ue instanceof Error ? Ue.message : "Could not read review URL."), Ne(!1);
          return;
        }
      let K = null;
      try {
        K = await hd(i, F.id);
      } catch (Ue) {
        f && (V(!0), S(
          Ue instanceof Error ? Ue.message : "Could not load progress."
        ));
      }
      if (!f) return;
      const ee = (K == null ? void 0 : K.signature) === Vn($) ? K : null, wt = L ? L.query.filter : ee ? Ut(ee.filter) : Zf($.view.filter);
      P(wt), Nr(
        ee ? oo(ee.displayMode, _e(F)) : so(F)
      ), ga(
        ee ? ee.cardSize ?? fi : fi
      );
      try {
        const Ue = await E(
          $,
          wt,
          L ? L.startAtEnd : !ee && $.view.startFrom !== "beginning",
          $.view.selectAllOnLoad === !0
        );
        if (!f) return;
        const ze = As(
          Ue.items.map((qe) => qe.id),
          (ee == null ? void 0 : ee.focusedId) ?? null,
          (ee == null ? void 0 : ee.index) ?? 0
        );
        tt(ze), Ge(ze);
      } catch {
      }
      f && (Wt.current = pt, ue(!0), B(`${F.id}:${pt}`));
    })(), () => {
      var $;
      f = !1, vn.current++, Tt.current++, ($ = or.current) == null || $.abort();
    };
  }, [F == null ? void 0 : F.id, it, pt]), H(() => {
    if (!(!An || it || !F)) {
      if (Tn) {
        Vt(0);
        return;
      }
      Pe || we || bn || ce !== `${F.id}:${pt}` || (Vt(0), ti());
    }
  }, [
    An,
    it,
    F == null ? void 0 : F.id,
    ce,
    Pe,
    bn,
    pt,
    Tn
  ]), H(() => {
    !he || it || !J || be || ve || Pe || st.current || Wt.current !== pt || na(he.id, {
      filter: k,
      objectFilter: he.view.objectFilter,
      searchMode: he.view.searchMode,
      startFrom: he.view.startFrom ?? "end"
    });
  }, [he, it, J, be, ve, k, Pe, pt]);
  const R = ye(
    () => ae.items.map((f) => f.id),
    [ae.items]
  );
  H(() => {
    if (!J || !F || !i || be || ve || Pe || (Fe == null ? void 0 : Fe.id) === F.id || A || Wt.current !== pt)
      return;
    const f = {
      version: 1,
      signature: Vn(F),
      filter: k,
      focusedId: Le,
      index: Math.max(0, R.indexOf(Le ?? -1)),
      displayMode: Yt,
      cardSize: qr,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + F.id,
        JSON.stringify(f)
      );
    } catch {
    }
    if (U) return;
    let v = !0;
    const $ = window.setTimeout(() => {
      pd(i, F.id, f).catch((L) => {
        v && S(
          "Progress is kept in this browser, but account sync failed. " + (L instanceof Error ? L.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      v = !1, window.clearTimeout($);
    };
  }, [
    J,
    i,
    F,
    be,
    ve,
    Pe,
    k,
    Le,
    R,
    Yt,
    qr,
    Fe,
    U,
    A,
    pt
  ]);
  const X = ae.items.find((f) => f.id === Le) ?? null, le = Se === "video" ? X : null;
  bt && le && (nn.current = le);
  const ie = le ?? (bt ? nn.current : null), Qe = Ts(Nt, Le), It = R.length > 0 && R.every((f) => Nt.has(f)), Ge = qn((f, v = !0) => {
    f != null && window.requestAnimationFrame(() => {
      var L;
      if (Xn.current || rd(document.activeElement) || (L = document.activeElement) != null && L.closest(".dq-drawer"))
        return;
      const $ = ar.current.get(f);
      $ == null || $.focus({ preventScroll: !0 }), v && ($ == null || $.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  H(() => {
    J && !Dt.current && Ge(gt.current);
  }, [J, Ge]), H(() => {
    be || !R.length || (gt.current == null || !R.includes(gt.current)) && (tt(R[0]), Dt.current || Ge(R[0]));
  }, [Ge, R, be]);
  const yt = qn(
    (f) => {
      Ht((v) => {
        const $ = f(v);
        for (const L of /* @__PURE__ */ new Set([...v, ...$]))
          v.has(L) !== $.has(L) && mt.current.set(
            L,
            (mt.current.get(L) ?? 0) + 1
          );
        return $;
      });
    },
    []
  ), ot = qn(
    (f) => {
      if (!R.length) return;
      const v = Math.max(
        0,
        R.indexOf(gt.current ?? R[0])
      ), $ = R[Math.max(0, Math.min(R.length - 1, v + f))];
      tt($), Dt.current || Ge($);
    },
    [Ge, R]
  ), Ke = qn(
    async (f) => {
      const v = "steps" in f ? f.steps.length > 0 : f.effect.mode !== "SKIP", $ = "effect" in f && f.effect.mode === "SET_TAG_GROUP" ? f.effect.tagGroupId : null, L = $ != null && (!q || !I.some((He) => He.id === $)), Y = "effect" in f && v && !q, K = Ts(
        Zn.current,
        gt.current
      );
      if (!F || yn.current || be || ve) return;
      const ee = v && !Ft ? `${_n} write permission is required to apply ${f.label}.` : Y || L ? `${f.label} needs a tag group that is unavailable.` : Wn(f) && (De == null ? void 0 : De.kind) !== "ready" ? `Set up tag assessments before applying ${f.label}.` : K.length ? "" : `Select or focus a ${Se} before applying ${f.label}.`;
      if (ee) {
        wn(ee);
        return;
      }
      const wt = ++vn.current, Ue = F.id, ze = [...R], qe = ae, We = gt.current, Gn = new Set(Zn.current), Rn = new Map(
        K.map((He) => [He, mt.current.get(He) ?? 0])
      ), Rr = () => wt === vn.current && F.id === Ue;
      yn.current = !0, ut(!0), tr(
        Zn.current.size ? `${K.length} selected ${Se}s` : `the focused ${Se}`
      ), an(""), wn("");
      const Ns = qe.items.filter(
        (He) => !K.includes(He.id)
      ), ul = Ns.map((He) => He.id), qs = Is(
        ze,
        ul,
        We,
        K.includes(We ?? -1)
      );
      Re({
        items: Ns,
        totalCount: qe.totalCount
      }), Ht((He) => {
        const jt = new Set(He);
        for (const dn of K) jt.delete(dn);
        return jt;
      }), tt(qs), Dt.current || Ge(qs);
      let ni = !1;
      try {
        if ("effect" in f ? await $d(f, K) : await Go(ht, f, K), ni = !0, !Rr()) return;
        Ht((He) => {
          const jt = new Set(He);
          for (const dn of K)
            (mt.current.get(dn) ?? 0) === Rn.get(dn) && jt.delete(dn);
          return jt;
        }), an(
          `${f.label}: ${K.length} ${Se}${K.length === 1 ? "" : "s"} ${v ? "updated" : "skipped"}.`
        );
      } catch (He) {
        if (!Rr()) return;
        Re(qe), Ht((jt) => {
          const dn = new Set(jt);
          for (const Xt of K)
            Gn.has(Xt) && (mt.current.get(Xt) ?? 0) === Rn.get(Xt) && dn.add(Xt);
          return dn;
        }), tt(We), Dt.current || Ge(We), wn(
          He instanceof Error ? He.message : "Action failed."
        );
      }
      try {
        if (await Ed(f), !Rr()) return;
        const He = new Set(K), jt = gn && ze.length > 0 && ze.every((un) => He.has(un)), dn = await E(F, k, !1, jt);
        if (!Rr()) return;
        let Xt = dn.items.map((un) => un.id);
        const ka = jn.current, fl = (ka == null ? void 0 : ka.page) === Number(k.page) && Xt.some((un) => ka.ids.has(un)), hl = (F.view.startFrom ?? "end") !== "beginning";
        if (dn.totalCount > 0 && Number(k.page) > 1 && (!Xt.length || hl && !fl)) {
          const un = Math.max(1, Number(k.page) - 1), Ca = { ...k, page: un };
          P(Ca), Xt = (await E(
            F,
            Ca,
            !1,
            jt
          )).items.map((ri) => ri.id), Ht(
            (ri) => new Set([...ri].filter((pl) => Xt.includes(pl)))
          );
          const Es = Xt.at(-1) ?? null;
          tt(Es), Dt.current || Ge(Es);
        } else {
          Ht(
            (Ca) => new Set([...Ca].filter((Ss) => Xt.includes(Ss)))
          );
          const un = Is(
            ze,
            Xt,
            We,
            ni && K.includes(We ?? -1)
          );
          tt(un), Dt.current && un == null && Lt(!1), Dt.current || Ge(un);
        }
      } catch (He) {
        Rr() && wn(
          (jt) => `${jt ? `${jt} ` : ""}${ni ? "The action completed, but " : ""}the queue could not be refreshed. ${He instanceof Error ? He.message : "Refresh failed."}`
        );
      } finally {
        Rr() && (yn.current = !1, ut(!1), tr(""), st.current && (st.current = !1, Et(), Mt((He) => He + 1)));
      }
    },
    [
      Ft,
      q,
      I,
      Se,
      De,
      E,
      k,
      Ge,
      R,
      ae,
      be,
      ve,
      F
    ]
  );
  function Nn() {
    var $;
    if (Yt === "list") return 1;
    const f = ($ = Jr.current) == null ? void 0 : $.firstElementChild, v = f ? getComputedStyle(f).gridTemplateColumns : "";
    return Math.max(1, v.split(" ").filter(Boolean).length);
  }
  const Je = O(() => {
  });
  Je.current = (f) => {
    var K;
    if (it || f.defaultPrevented || f.repeat || f.ctrlKey || f.altKey || f.metaKey || vt) return;
    const v = f.target, $ = v instanceof Node && ((K = In.current) == null ? void 0 : K.contains(v)) === !0, L = v === document.body || v === document.documentElement;
    if (!$ && !L) return;
    if (er) {
      f.key === "Escape" && (Or(f), rn(!1));
      return;
    }
    if (bt && f.key === "Escape") {
      Or(f), Lt(!1), Ge(gt.current);
      return;
    }
    if (!nd(v)) return;
    const Y = td(v);
    if (f.key === "Escape") {
      Or(f), yt(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!bt && f.key === " " && Y) {
      Or(f), Le != null && yt((ee) => Oa(ee, Le));
      return;
    }
    if (!(Pe || be) && !bt && f.key === "Enter" && Le != null && Y) {
      if (Se !== "tag" && we) return;
      Or(f), Se === "tag" ? window.open(`/tag/${Le}`, "_blank", "noopener,noreferrer") : Lt(!0);
      return;
    }
  }, H(() => {
    const f = (v) => Je.current(v);
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, []);
  const ln = O(
    () => {
    }
  );
  ln.current = (f) => {
    var K;
    if (it || vt || bt || er || Pe || be || !R.length || f.defaultPrevented || f.repeat || f.ctrlKey || f.altKey || f.metaKey)
      return;
    const v = f.target, $ = v instanceof Node && ((K = In.current) == null ? void 0 : K.contains(v)) === !0, L = v === document.body || v === document.documentElement;
    if (!$ && !L || !f.key.startsWith("Arrow") || !ad(v)) return;
    const Y = id(f.key, Nn());
    Y && (f.preventDefault(), $ ? f.stopImmediatePropagation() : f.stopPropagation(), ot(Y));
  }, H(() => {
    const f = (v) => ln.current(v);
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, []);
  const _t = (we == null ? void 0 : we.saving) === !0 || bn, Hr = Pe || be && !J || _t, Na = ns();
  ts({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!F && !it && !vt && !we && !bt && !er && !ve && (ae.items.length > 0 || be || Pe),
    actions: (F == null ? void 0 : F.actions) ?? lo,
    onAction: (f) => {
      const v = F == null ? void 0 : F.actions[f];
      v && Ke(v);
    },
    onFind: () => rn(!0),
    onSelectAll: () => yt((f) => ed(f, R))
  }), H(() => rn(!1), [it, bt, F == null ? void 0 : F.id]);
  function qa(f) {
    const v = "steps" in f ? f.steps.length > 0 : f.effect.mode !== "SKIP", $ = "effect" in f && f.effect.mode === "SET_TAG_GROUP" ? f.effect.tagGroupId : null, L = $ != null && !I.some((Y) => Y.id === $);
    return Pe || be || !!ve || v && !Ft || "effect" in f && v && (!q || L) || Wn(f) && (De == null ? void 0 : De.kind) !== "ready" || !Qe.length;
  }
  function dr(f) {
    Ze(null), Vt(0), Te(null), Q(f), hi(f, !!f && !F);
  }
  function Tr() {
    Ye.current || (Uc() ? (Ye.current = !0, window.history.back()) : dr(""));
  }
  function Et() {
    const f = Ye.current;
    Ye.current = !1;
    let v = co();
    v && !Ee.current && !Oe.current.some((L) => L.id === v) && (v = "", hi(""));
    const $ = z.current;
    v !== $ && (Vt(0), f || Te(null), !v && $ && (Me.current ?? (Me.current = { reviewId: $ }))), Q(v);
  }
  function Ir() {
    Me.current = "heading", Te(null), Tr();
  }
  function Ya(f) {
    f !== T && dr(f), Vt((v) => v + 1);
  }
  function Qc() {
    Te(null), $t({
      review: Jc("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function Hc(f) {
    if (kt || !D) return;
    Te(null);
    const v = crypto.randomUUID();
    let $;
    const L = T;
    Cn(!0);
    try {
      if (!await Yr((K) => ($ = Xl(
        K.find((ee) => ee.id === f.id) ?? f,
        K,
        v
      ), [...K, $]))) throw new Error("Could not save reviews.");
      if (!Ae.current) return;
      z.current !== L ? Te({ text: `Saved the copy “${$.name}”.`, alert: !1 }) : Ya($.id);
    } catch (Y) {
      Te({
        text: `“${f.name}” was not duplicated. ${Sa(Y)}`,
        alert: !0
      });
    } finally {
      Cn(!1);
    }
  }
  async function Yc() {
    if (!dt || dt.saving) return;
    const f = { ...dt.review, name: dt.review.name.trim() }, v = sa(f);
    if (v) {
      $t({ ...dt, error: v });
      return;
    }
    $t({ ...dt, saving: !0, error: "" });
    try {
      if (!await Yr(($) => [...$, f]))
        throw new Error("Could not save reviews.");
      if (!Ae.current) return;
      $t(null), Ya(f.id);
    } catch ($) {
      $t(
        (L) => L && {
          ...L,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + ($ instanceof Error ? $.message : "Retry saving.")
        }
      );
    }
  }
  async function Xc() {
    if (!ft || ft.pending) return;
    const f = ft.review, v = Vc(t, te, ge, Ve).map((Y) => Y.id), $ = v.filter((Y) => Y !== f.id), L = $[Math.min(v.indexOf(f.id), $.length - 1)];
    Bt({ review: f, pending: !0 });
    try {
      if (!await Yr((Y) => Y.filter((K) => K.id !== f.id)))
        throw new Error("Could not save reviews.");
      Me.current = f.id !== T && L ? { reviewId: L } : "heading", Te({ text: `Deleted “${f.name}”.`, alert: !1 });
    } catch (Y) {
      Te({ text: `“${f.name}” was not deleted. ${Sa(Y)}`, alert: !0 });
    } finally {
      Bt(null);
    }
  }
  async function Zc(f) {
    if (!(kt || !D)) {
      Te(null), Kt(!0);
      try {
        const v = await xu(f);
        let $ = 0;
        if (v.length && !await Yr((Y) => {
          const K = mi(Y, v);
          return $ = K.length - Y.length, $ ? K : Y;
        }))
          throw new Error("Could not save reviews.");
        const L = v.length - $;
        Te({
          alert: !1,
          text: v.length ? $ ? `Imported ${$ === 1 ? "1 review" : `${$} reviews`}.` + (L === 1 ? " 1 review already in the list stays as it is." : L ? ` ${L} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (v) {
        Te({ alert: !0, text: `Could not import “${f.name}”. ${Sa(v)}` });
      } finally {
        Kt(!1);
      }
    }
  }
  function Sa(f) {
    return f instanceof Oo ? "Reviews changed in another browser. Reload the page to get them, then try again." : f instanceof Error ? f.message : "Try again.";
  }
  function bs(f) {
    const v = !D || kt;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ r(wo, { "aria-hidden": "true" }),
        disabled: v,
        onSelect: () => void Hc(f)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ r(Co, { "aria-hidden": "true" }),
        onSelect: () => ss(f)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ r(ji, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: v,
        onSelect: () => {
          Te(null), Bt({ review: f, pending: !1 });
        }
      }
    ];
  }
  function ys(f, v) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ r(Pr, { "aria-hidden": "true" }),
        ...v,
        disabled: v.disabled || $e
      },
      ...bs(f),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ r(da, { "aria-hidden": "true" }),
        separated: !0,
        disabled: $e,
        onSelect: Ir
      }
    ];
  }
  async function Yr(f) {
    if (!i) return !1;
    let v = [];
    const $ = await fd(i, (ee) => {
      v = ee;
      const wt = f(ee);
      return wt === ee ? ee : wt.map(oh);
    });
    if (n($), !Ae.current) return !0;
    const L = z.current;
    L && !$.some((ee) => ee.id === L) && Tr();
    const Y = v.find((ee) => ee.id === L), K = $.find((ee) => ee.id === L);
    return K && Y && ((K.view.reviewMode ?? "single") !== (Y.view.reviewMode ?? "single") && Ze(null), K.view.displayMode !== Y.view.displayMode && Nr(so(K))), !0;
  }
  function Xa(f) {
    return Yr((v) => sh(v, f));
  }
  function el(f) {
    return Xa(f).catch((v) => {
      throw z.current !== f.id && Za(f, v), v;
    });
  }
  function Za(f, v) {
    var L;
    if (!Ae.current) return;
    const $ = ((L = Oe.current.find((Y) => Y.id === f.id)) == null ? void 0 : L.name) ?? f.name;
    Te({ text: `“${$}” was not saved. ${Sa(v)}`, alert: !0 });
  }
  if (o)
    return /* @__PURE__ */ r(uo, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ l(me, { children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          onClick: () => void fh().catch(
            (f) => p(
              "Could not export browser reviews. " + (f instanceof Error ? f.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ r(
        fo,
        {
          message: d,
          onRetry: () => void Qr()
        }
      )
    ] });
  const ei = /* @__PURE__ */ l(me, { children: [
    oe && /* @__PURE__ */ r("p", { className: "dq-status", children: oe }),
    et && (De == null ? void 0 : De.kind) === "missing" && /* @__PURE__ */ l("div", { role: "status", className: "dq-status", children: [
      De.message,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: nr,
          onClick: () => {
            rr(!0), Er(""), (At ? Ad(ht) : Cd(ht)).then(h).catch(
              (f) => Er(
                `Could not create the ${At ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (f instanceof Error ? f.message : "Request failed.")
              )
            ).finally(() => rr(!1));
          },
          children: nr ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    et && ((De == null ? void 0 : De.kind) === "incompatible" || on) && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r($n, {}),
      on || (De == null ? void 0 : De.message),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: nr,
          onClick: () => {
            rr(!0), h().finally(
              () => rr(!1)
            );
          },
          children: nr ? "Checking…" : "Check again"
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
            const f = localStorage.getItem("page-videos") ?? "[]", v = URL.createObjectURL(
              new Blob([f], { type: "application/json" })
            ), $ = document.createElement("a");
            $.href = v, $.download = "data-quality-unassigned-legacy-reviews.json", $.click(), URL.revokeObjectURL(v);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    U && /* @__PURE__ */ l("p", { role: "alert", children: [
      U,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => {
            S(""), V(!1);
          },
          children: A ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    rt && (rt.alert ? /* @__PURE__ */ l("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r($n, { "aria-hidden": "true" }),
      rt.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ r("p", { className: "dq-status", "aria-hidden": "true", children: rt.text })
    ))
  ] });
  return /* @__PURE__ */ l(
    "div",
    {
      ref: In,
      className: `data-quality-page${ir ? " dq-page-fit" : ""}`,
      style: ir ? {
        "--dq-fit-top": `${sr.top}px`,
        "--dq-fit-bottom": `${sr.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: rt && !rt.alert ? rt.text : "" }),
        F && it ? /* @__PURE__ */ r(
          Bf,
          {
            review: re ?? F,
            canWrite: Ln ? y : Qt,
            canAssess: (De == null ? void 0 : De.kind) === "ready" && Qt,
            onBusy: ut,
            editRequest: An,
            onEditRequestHandled: () => Vt(0),
            onSaveDefaults: D ? el : void 0,
            pageControls: {
              onBack: Ir,
              moreItems: (f) => ys(re ?? F, f),
              onGrid: he ? () => Ze({ id: he.id, mode: "multiple" }) : void 0,
              notices: ei,
              busy: $e
            },
            stayOnTap: Ot,
            onStayOnTapChange: pn
          },
          F.id
        ) : F ? ll(F) : /* @__PURE__ */ r(
          Qf,
          {
            reviews: t,
            counts: te,
            sort: ge,
            direction: Ve,
            onSortChange: (f) => qt({ sort: f }),
            onDirectionChange: (f) => qt({ direction: f }),
            storage: Yf[ne],
            canConfigure: D,
            busy: kt,
            headingRef: hn,
            notices: ei,
            onOpen: dr,
            onNew: () => Qc(),
            onImport: (f) => void Zc(f),
            onExportAll: () => wc(t, "data-quality-reviews.json"),
            rowMenuItems: (f) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ r(Pr, { "aria-hidden": "true" }),
                disabled: !D || kt,
                onSelect: () => Ya(f.id)
              },
              ...bs(f)
            ]
          }
        ),
        bt && ie && he && /* @__PURE__ */ r(
          uh,
          {
            video: ie,
            review: he,
            selectedCount: Nt.size,
            pending: Pe,
            refreshing: be || !!ve,
            error: sn,
            canWrite: u,
            assessmentReady: (De == null ? void 0 : De.kind) === "ready",
            trees: Un,
            selected: Nt.has(ie.id),
            hasPrevious: R.indexOf(ie.id) > 0,
            hasNext: R.indexOf(ie.id) >= 0 && R.indexOf(ie.id) < R.length - 1,
            onToggleSelected: () => yt((f) => Oa(f, ie.id)),
            onPrevious: () => ot(-1),
            onNext: () => ot(1),
            onClose: () => {
              Lt(!1), Ge(gt.current);
            },
            onAction: Ke,
            findOpen: er,
            onFindOpenChange: rn
          }
        ),
        er && F && !it && !bt && /* @__PURE__ */ r(
          as,
          {
            actions: F.actions,
            tagGroups: I,
            trees: Un,
            isDisabled: qa,
            canStay: !1,
            onApply: (f) => {
              rn(!1), Ke(f);
            },
            onClose: () => rn(!1)
          }
        ),
        dt && /* @__PURE__ */ r(
          Hf,
          {
            draft: dt,
            onChange: (f) => $t((v) => v && { ...v, review: f, error: "" }),
            onCreate: () => void Yc(),
            onCancel: () => $t(null)
          }
        ),
        /* @__PURE__ */ r(
          kl,
          {
            open: !!ft,
            title: "Delete review?",
            message: ft ? `“${ft.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (ft == null ? void 0 : ft.pending) ?? !1,
            onConfirm: () => void Xc(),
            onCancel: () => Bt((f) => f != null && f.pending ? f : null)
          }
        )
      ]
    }
  );
  async function Ea(f, v, $ = !1, L = !0) {
    const Y = gt.current, K = Math.max(0, R.indexOf(Y ?? -1));
    try {
      const ee = E(
        f,
        v,
        $,
        f.view.selectAllOnLoad === !0
      ), wt = Tt.current, Ue = await ee;
      if (wt !== Tt.current) return;
      const ze = Ue.items.map((We) => We.id);
      Ht(
        (We) => new Set([...We].filter((Gn) => ze.includes(Gn)))
      );
      const qe = As(ze, Y, K);
      tt(qe), L && !Dt.current && Ge(qe, !1);
    } catch {
    }
  }
  function tl(f) {
    const v = mn.current;
    if (mn.current = null, Hr || !F || !re) return;
    const $ = v ?? F.view.objectFilter, L = yr(
      $,
      re.view.objectFilter
    ) ? re.view.objectFilter : $, Y = Ut({ ...f, page: 1 }), K = {
      ...F,
      view: {
        ...F.view,
        filter: Y,
        objectFilter: L
      }
    }, ee = !io(K, re), wt = ee ? K : re;
    Ct(ee ? K : null), an(ee ? "" : "Review queue defaults restored."), Ea(wt, Y, !0);
  }
  function nl() {
    if (Pe || be || _t || !re) return;
    mn.current = null;
    const f = Ut({
      ...re.view.filter,
      page: 1
    });
    Ct(null), an("Review queue defaults restored."), Ea(
      re,
      f,
      re.view.startFrom !== "beginning",
      !1
    );
  }
  function rl() {
    if (Pe || be || ve || _t || !F || !cr || !D)
      return;
    const f = F, v = cr;
    Sr(!0), Xa(v).then(($) => {
      !$ || z.current !== v.id || (Ct(ao(v, f)), an("Queue saved to this review."));
    }).catch(($) => {
      z.current !== v.id ? Za(v, $) : wn($ instanceof Error ? $.message : "Could not save queue.");
    }).finally(() => Sr(!1));
  }
  function ti() {
    if (!F || !re || yn.current || we || bn) return;
    Pn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, at.current = {
      temporaryReview: Fe,
      filter: k,
      loadedFilter: W,
      queue: ae,
      queueError: ve,
      retryFromEnd: Gr,
      selectedIds: new Set(Nt),
      focusedId: Le,
      pageCursor: jn.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const f = structuredClone({
      ...re,
      view: { ...re.view, startFrom: F.view.startFrom ?? "end" }
    });
    rn(!1), Lt(!1), an(""), wn(""), St({ draft: f, saving: !1, error: "" });
  }
  function ws() {
    St(null), at.current = null;
    const f = Pn.current;
    Pn.current = null, requestAnimationFrame(() => {
      (f == null ? void 0 : f.isConnected) && f !== document.body && !(f instanceof HTMLButtonElement && f.disabled) ? f.focus({ preventScroll: !0 }) : Ge(gt.current, !1);
    });
  }
  function al() {
    var v;
    if (!we || we.saving) return;
    const f = at.current;
    f && (Tt.current += 1, (v = or.current) == null || v.abort(), mn.current = null, Ne(!1), Ct(f.temporaryReview), P(f.filter), pe(f.loadedFilter), Re(f.queue), Pt(f.queueError), Kr(f.retryFromEnd), yt(() => f.selectedIds), tt(f.focusedId), jn.current = f.pageCursor, window.history.replaceState(window.history.state, "", f.url)), ws();
  }
  async function il() {
    if (!we || we.saving || !cn || !F) return;
    const f = F, v = { ...cn, name: cn.name.trim() }, $ = sa(v);
    if ($) {
      St((L) => L && { ...L, error: $ });
      return;
    }
    St((L) => L && { ...L, saving: !0, error: "" });
    try {
      if (!await Xa(v)) throw new Error("Could not save reviews.");
      if (!Ae.current || z.current !== v.id) return;
      Ct(ao(v, f)), _e(v) === "video" && na(v.id, {
        filter: k,
        objectFilter: f.view.objectFilter,
        searchMode: v.view.searchMode,
        startFrom: v.view.startFrom ?? "end"
      }), an("Review saved."), ws();
    } catch (L) {
      if (z.current !== v.id) {
        Za(v, L);
        return;
      }
      St(
        (Y) => Y && {
          ...Y,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (L instanceof Error ? L.message : "Retry saving.")
        }
      );
    }
  }
  function vs() {
    F && E(F, k, Gr, gn).catch(() => {
    });
  }
  function sl() {
    Ht(/* @__PURE__ */ new Set()), mt.current.clear(), tt(null);
  }
  function ol(f) {
    !F || Pe || _t || f === Number(k.page) || ih(
      { ...k, page: f },
      F,
      (v, $) => E(v, $, !1, gn),
      sl
    );
  }
  function cl(f) {
    if (!he || !re || Pe || be || _t) return;
    const v = Pf(he, f, re.view.objectFilter), $ = !io(v, re);
    Ct($ ? v : null), $ ? Ea(v, { ...k, page: 1 }) : Ea(
      re,
      { ...k, page: 1 },
      re.view.startFrom !== "beginning"
    );
  }
  function ll(f) {
    var Ue, ze;
    const v = Se === "tag", $ = v ? "tag" : "video", L = Math.max(1, Number(k.perPage) || 40), Y = Math.max(1, Math.ceil(ae.totalCount / L)), K = Math.min(Math.max(1, Number(k.page) || 1), Y), ee = [
      Ft ? "" : `${_n} write permission is required to apply actions.`,
      v && j ? `Tag groups are unavailable. ${j}` : ""
    ].filter(Boolean), wt = !!sn && !bt;
    return /* @__PURE__ */ l(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": v ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ r(
            qc,
            {
              name: f.name,
              description: f.description,
              entityType: Se,
              onBack: Ir,
              backDisabled: Pe || !!we || $e,
              onEdit: we ? () => {
                var qe;
                return (qe = Jt.current) == null ? void 0 : qe.focus();
              } : ti,
              editDisabled: !we && (Pe || be || Tn || bn || $e || !D),
              editing: !!we,
              toolbar: /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: Hr, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: v ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ r(
                  ra,
                  {
                    filter: ve ? W : k,
                    onFilterChange: tl,
                    totalCount: ae.totalCount,
                    sortOptions: v ? Al : mo,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Yt,
                    zoomLevel: (qr - 225) / 50,
                    onZoomChange: (qe) => ga(Math.round(225 + qe * 50)),
                    cardSizeEntityType: v ? "tags" : "videos",
                    criteriaDefinitions: v ? Cl : Li,
                    customFieldEntityType: Se === "video" ? "video" : void 0,
                    objectFilter: Ha,
                    onObjectFilterChange: (qe) => {
                      Hr || (mn.current = Se === "video" ? kc(
                        qe,
                        Vr,
                        f.view.objectFilter
                      ) : qe);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(Sc, { page: K, pages: Y, onPage: ol })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ l(me, { children: [
                he && /* @__PURE__ */ r(
                  Ec,
                  {
                    mode: "multiple",
                    disabled: Pe || be || vt || !!we || bn || $e,
                    onChange: () => Ze({ id: he.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ r(
                  zu,
                  {
                    options: v ? th : eh,
                    value: Yt,
                    onChange: (qe) => Nr(oo(qe, Se))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ r(
                os,
                {
                  disabled: Pe || !!we,
                  items: ys(re ?? f, {
                    onSelect: ti,
                    disabled: be || Tn || bn || !D
                  })
                }
              ),
              queueDiffers: J ? (Fe == null ? void 0 : Fe.id) === T : void 0,
              queueChange: !we && (Fe == null ? void 0 : Fe.id) === T ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: Wr ? rl : void 0,
                saveDisabled: Pe || be || !!ve || _t || !D,
                onReset: nl,
                resetDisabled: Pe || be || _t
              } : void 0,
              chipsAfter: (ze = (Ue = he == null ? void 0 : he.presentation) == null ? void 0 : Ue.binParents) != null && ze.length ? /* @__PURE__ */ r(
                Ff,
                {
                  videos: ae.items,
                  review: he,
                  savedObjectFilter: (re ?? he).view.objectFilter,
                  trees: tn.ids,
                  disabled: Pe || be || _t,
                  onToggle: cl
                }
              ) : void 0,
              chipsEnd: we ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          ei,
          he && tn.error && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: tn.error }),
          /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
            we && cn && /* @__PURE__ */ r(
              Nc,
              {
                drawerRef: Jt,
                draft: cn,
                onChange: (qe) => St((We) => We && { ...We, draft: qe }),
                direction: we.draft.view.startFrom ?? "end",
                onDirectionChange: (qe) => St(
                  (We) => We && {
                    ...We,
                    draft: { ...We.draft, view: { ...We.draft.view, startFrom: qe } }
                  }
                ),
                tagGroups: I,
                trees: Un,
                saving: we.saving,
                saveDisabled: be || !!ve,
                error: we.error,
                dirty: va,
                criteriaChanged: Wr,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  ve && !be ? /* @__PURE__ */ l("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ r($n, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { children: [
                      "The queue could not load: ",
                      ve,
                      " ",
                      /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", onClick: vs, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void il(),
                onCancel: al
              }
            ),
            /* @__PURE__ */ l(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${Qa}px` },
                children: [
                  /* @__PURE__ */ l("div", { className: "dq-grid-content", children: [
                    be && !ae.items.length && /* @__PURE__ */ r(uo, { label: "Loading review queue…" }),
                    ve && !be && /* @__PURE__ */ r(
                      fo,
                      {
                        message: ve,
                        retryLabel: Tn ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (Tn && re && _e(re) === "video") {
                            const qe = wr(re);
                            na(re.id, { ...qe, filter: { ...qe.filter, page: void 0 } }), Mt((We) => We + 1);
                            return;
                          }
                          vs();
                        }
                      }
                    ),
                    !Pe && !be && !ve && !ae.items.length && /* @__PURE__ */ l("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ r(Ka, {}),
                      /* @__PURE__ */ l("p", { children: [
                        "No ",
                        $,
                        "s match this review."
                      ] })
                    ] }),
                    !!ae.items.length && /* @__PURE__ */ r("div", { ref: Jr, children: /* @__PURE__ */ r(
                      "div",
                      {
                        className: Yt === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${qr}px` },
                        children: ae.items.map(dl)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ r("div", { className: "dq-bar-dock", ref: zr, children: /* @__PURE__ */ r(
                    uc,
                    {
                      actions: we ? we.draft.actions : f.actions,
                      tagGroups: I,
                      trees: Un,
                      isDisabled: qa,
                      paused: !!we,
                      busy: Pe || be,
                      onApply: (qe) => void Ke(qe),
                      onFind: () => rn(!0),
                      status: Pe ? `Applying action to ${ba}…` : "",
                      summary: /* @__PURE__ */ l(me, { children: [
                        /* @__PURE__ */ r("p", { className: "dq-bar-target", children: Nt.size ? `${Nt.size} selected` : Le == null ? "Nothing to apply to" : `Applies to the focused ${$}` }),
                        /* @__PURE__ */ l(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !R.length || It,
                            onClick: () => yt((qe) => /* @__PURE__ */ new Set([...qe, ...R])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ r(ct, { binding: Na.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ l(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !Nt.size,
                            onClick: () => yt(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ r(ct, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: ee.length ? ee.join(" ") : void 0,
                      keyHints: v ? "Arrows move · Space selects · Enter opens" : we ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews",
                      notices: wt || nt ? /* @__PURE__ */ l(me, { children: [
                        wt && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ r($n, { "aria-hidden": "true" }),
                          sn
                        ] }),
                        nt && /* @__PURE__ */ r("p", { role: "status", className: "dq-status", children: nt })
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
  function dl(f) {
    var $, L, Y;
    if (Se === "tag") {
      const K = f;
      return /* @__PURE__ */ r(
        ch,
        {
          tag: K,
          displayMode: Yt === "list" ? "list" : "grid",
          focused: K.id === Le,
          selected: Nt.has(K.id),
          setRef: (ee) => {
            ee ? ar.current.set(K.id, ee) : ar.current.delete(K.id);
          },
          onFocus: () => tt(K.id),
          onToggle: () => {
            yt((ee) => Oa(ee, K.id)), Ge(K.id, !1);
          },
          onOpen: () => window.open(`/tag/${K.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        K.id
      );
    }
    const v = f;
    return /* @__PURE__ */ r(
      lh,
      {
        video: Mf(v, he, tn.ids),
        showTagBins: ((L = ($ = he == null ? void 0 : he.presentation) == null ? void 0 : $.annotations) == null ? void 0 : L.includes("tags")) && !!((Y = he.presentation.annotationParents) != null && Y.length),
        displayMode: Yt,
        cardsScroll: Wa,
        focused: v.id === Le,
        selected: Nt.has(v.id),
        setRef: (K) => {
          K ? ar.current.set(v.id, K) : ar.current.delete(v.id);
        },
        onFocus: () => tt(v.id),
        onToggle: () => yt((K) => Oa(K, v.id)),
        onPreview: () => {
          we || (tt(v.id), Lt(!0));
        },
        onNavigate: e
      },
      v.id
    );
  }
}
function ih(e, t, n, a) {
  a(), n(t, e).catch(() => {
  });
}
function Oa(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function sh(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function oh(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function ch({
  tag: e,
  displayMode: t,
  focused: n,
  selected: a,
  setRef: i,
  onFocus: s,
  onToggle: o,
  onOpen: c,
  onNavigate: d
}) {
  return /* @__PURE__ */ r(
    "article",
    {
      ref: i,
      tabIndex: 0,
      "aria-current": n ? "true" : void 0,
      "aria-label": `${e.name}${a ? ", selected" : ""}`,
      onFocus: s,
      onClick: (p) => {
        s(), p.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${n ? "focused" : ""} ${a ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ r(
        Tl,
        {
          tag: e,
          selected: a,
          onSelect: o,
          onClick: c,
          onNavigate: d
        }
      ) : /* @__PURE__ */ l("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            "aria-label": a ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": a,
            onClick: (p) => {
              p.stopPropagation(), o();
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
function lh({
  video: e,
  showTagBins: t,
  displayMode: n,
  cardsScroll: a,
  focused: i,
  selected: s,
  setRef: o,
  onFocus: c,
  onToggle: d,
  onPreview: p,
  onNavigate: u
}) {
  var q, w;
  const m = zc(e), b = O(null), g = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(g.date || g.studioName), N = !!(g.performers.length || g.tags.length);
  return Rt(() => {
    const I = b.current;
    if (!I) return;
    const M = I.querySelector(
      `a[href="/video/${e.id}"]`
    ), j = I.querySelector(".card-title"), G = `dq-card-title-${e.id}`;
    j && (j.id = G), M && (M.target = "_blank", M.rel = "noreferrer", M.removeAttribute("aria-label"), M.setAttribute("aria-labelledby", G), M.classList.add("dq-card-link"));
    const D = I.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    D && D.setAttribute(
      "aria-label",
      s ? `Deselect ${m}` : `Select ${m}`
    );
    const Z = I.querySelector(
      'button[title="Quick View"]'
    );
    Z && Z.setAttribute("aria-label", `Preview ${m}`);
  }), /* @__PURE__ */ l(
    "article",
    {
      ref: (I) => {
        b.current = I, o(I);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${m}${s ? ", selected" : ""}`,
      onFocus: c,
      onClick: (I) => {
        c(), I.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${y ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${s ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ r(
          Il,
          {
            video: g,
            selected: s,
            onSelect: d,
            onNavigate: u,
            onQuickView: p,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ l("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (q = e.tags) == null ? void 0 : q.map((I) => /* @__PURE__ */ r("span", { children: I.name }, I.id)),
          !((w = e.tags) != null && w.length) && /* @__PURE__ */ r("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ r(dh, { video: e, cardsScroll: a })
      ]
    }
  );
}
function dh({ video: e, cardsScroll: t }) {
  const n = O(null), a = O(null), [i, s] = C(!1), [o, c] = C(!1), [d, p] = C(!1);
  return H(() => {
    const u = n.current;
    if (!u || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      s(!0), c(!0);
      return;
    }
    const m = t ? u.closest(".dq-grid-stage") : null, b = new IntersectionObserver(
      ([y]) => s(y.isIntersecting),
      { root: m, rootMargin: "320px 0px", threshold: 0 }
    ), g = new IntersectionObserver(
      ([y]) => c(y.isIntersecting && y.intersectionRatio >= 0.6),
      { root: m, threshold: [0, 0.6, 1] }
    );
    return b.observe(u), g.observe(u), () => {
      b.disconnect(), g.disconnect();
    };
  }, [e.id, e.files.length, t]), H(() => {
    if (!i) {
      p(!1);
      return;
    }
    const u = new AbortController();
    return de(Sd(e.id), {
      signal: u.signal
    }).then((m) => {
      u.signal.aborted || p(m.available === !0);
    }).catch(() => {
      u.signal.aborted || p(!1);
    }), () => u.abort();
  }, [i, e.id]), H(() => {
    const u = a.current;
    u && (o ? Promise.resolve(u.play()).catch(() => {
    }) : u.pause());
  }, [d, o]), /* @__PURE__ */ r("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: d && /* @__PURE__ */ r(
    "video",
    {
      ref: a,
      src: qd(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function uh({
  video: e,
  review: t,
  selectedCount: n,
  pending: a,
  refreshing: i,
  error: s,
  canWrite: o,
  assessmentReady: c,
  trees: d,
  selected: p,
  hasPrevious: u,
  hasNext: m,
  onToggleSelected: b,
  onPrevious: g,
  onNext: y,
  onClose: N,
  onAction: q,
  findOpen: w,
  onFindOpenChange: I
}) {
  const M = O(null), j = pa(), G = O(null), D = e.files[0], Z = zc(e), ne = (S) => a || i || "steps" in S && S.steps.length > 0 && !o || Wn(S) && !c;
  ts({
    surface: "overlay",
    enabled: !w,
    actions: t.actions,
    onAction: (S) => {
      const A = t.actions[S];
      A && q(A);
    },
    onFind: () => I(!0)
  }), H(() => {
    var A;
    const S = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (A = M.current) == null || A.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = S;
    };
  }, []);
  function se(S) {
    var J, ue, ce;
    if (S.key !== "Tab") return;
    const A = [
      ...((J = M.current) == null ? void 0 : J.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((B) => B.offsetParent !== null);
    if (!A.length) {
      S.preventDefault(), (ue = M.current) == null || ue.focus();
      return;
    }
    const V = A.indexOf(
      document.activeElement
    );
    S.shiftKey && V <= 0 ? (S.preventDefault(), (ce = A.at(-1)) == null || ce.focus()) : !S.shiftKey && V === A.length - 1 && (S.preventDefault(), A[0].focus());
  }
  function oe(S) {
    if (w || S.defaultPrevented || S.ctrlKey || S.metaKey || S.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const A = S.key === "ArrowLeft" || S.key === "ArrowRight";
    if (S.altKey && !A) return;
    const V = G.current, J = S.currentTarget.querySelector("video");
    if (S.key === "Enter" || S.key === "Escape")
      S.repeat || N();
    else if (S.key === " " && V)
      S.repeat || V.toggle();
    else if (A && V)
      V.seekBy(
        (S.key === "ArrowLeft" ? -1 : 1) * (S.shiftKey ? 5 : S.altKey ? 10 : 60)
      );
    else if ((S.key === "," || S.key === ".") && V) {
      const ue = [D == null ? void 0 : D.duration, J == null ? void 0 : J.duration].find(
        (B) => B != null && Number.isFinite(B) && B > 0
      ) ?? 0, ce = e.parentVideoId != null ? (e.clipEndSec ?? ue) - (e.clipStartSec ?? 0) : ue;
      Number.isFinite(ce) && ce > 0 && V.seekBy((S.key === "," ? -1 : 1) * ce * 0.1);
    } else if (S.key.toLowerCase() === "n" || S.key.toLowerCase() === "m")
      !S.repeat && !a && !i && (S.key.toLowerCase() === "n" && u && g(), S.key.toLowerCase() === "m" && m && y());
    else if (S.key === "ArrowUp" && J)
      J.volume = Math.min(1, J.volume + 0.1);
    else if (S.key === "ArrowDown" && J)
      J.volume = Math.max(0, J.volume - 0.1);
    else return;
    Or(S);
  }
  function _(S) {
    const A = M.current, V = S.target instanceof Element ? S.target.closest("button, a[href]") : null;
    !A || !V || !A.contains(V) || V.closest(".dq-player, .dq-find-action") || S.detail === 0 || A.focus({ preventScroll: !0 });
  }
  H(() => {
    if (w) return;
    let S = 0;
    const A = requestAnimationFrame(() => {
      S = requestAnimationFrame(() => {
        var J;
        const V = document.activeElement;
        (J = M.current) != null && J.isConnected && (!V || V === document.body || V === document.documentElement) && M.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(A), cancelAnimationFrame(S);
    };
  }, [w, a, i, m, u, e.id, j]);
  const U = n ? `the ${n} selected video${n === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ l(
    "div",
    {
      ref: M,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${Z}`,
      className: `dq-preview${j ? " dq-preview-mobile" : ""}`,
      onKeyDown: se,
      onKeyDownCapture: oe,
      onMouseDown: (S) => {
        S.target === S.currentTarget && N();
      },
      onClick: _,
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
                disabled: !u || a || i,
                onClick: g,
                children: [
                  /* @__PURE__ */ r(da, { "aria-hidden": "true" }),
                  !j && /* @__PURE__ */ r(ct, { binding: "n", hidden: !0 })
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
                disabled: !m || a || i,
                onClick: y,
                children: [
                  !j && /* @__PURE__ */ r(ct, { binding: "m", hidden: !0 }),
                  /* @__PURE__ */ r(Eo, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ l("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ r("h2", { children: Z }),
              /* @__PURE__ */ l("p", { children: [
                "Actions apply to ",
                U
              ] })
            ] }),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-select",
                "aria-pressed": p,
                disabled: i,
                onClick: b,
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-preview-check", "aria-hidden": "true", children: p && /* @__PURE__ */ r(Ga, {}) }),
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
                "aria-label": `Open ${Z} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ r(ko, { "aria-hidden": "true" })
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
                onClick: N,
                children: /* @__PURE__ */ r(la, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ r("div", { className: "dq-preview-video", children: D ? /* @__PURE__ */ r(
            go,
            {
              autostart: !0,
              streamUrl: vi("video", e.id),
              posterUrl: Os(e),
              format: D.format,
              audioCodec: D.audioCodec,
              duration: D.duration ?? 0,
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
          ) : /* @__PURE__ */ r("img", { src: Os(e), alt: "" }) }) }),
          s && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert dq-preview-alert", children: s }),
          !j && /* @__PURE__ */ l("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ r("span", { children: "Space play / pause" }),
            /* @__PURE__ */ r("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ r("span", { children: ", . ±10 %" }),
            /* @__PURE__ */ r("span", { children: "↑ ↓ volume" }),
            /* @__PURE__ */ r("span", { children: "N M previous / next" }),
            /* @__PURE__ */ r("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ r(
            uc,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: d,
              isDisabled: ne,
              busy: a || i,
              onApply: (S) => void q(S),
              onFind: () => I(!0),
              status: a ? `Applying action to ${U}…` : "",
              summary: /* @__PURE__ */ r("p", { className: "dq-bar-target", children: n ? `${n} selected` : "This video" })
            }
          )
        ] }),
        w && /* @__PURE__ */ r(
          as,
          {
            actions: t.actions,
            trees: d,
            isDisabled: ne,
            canStay: !1,
            onApply: (S) => {
              I(!1), q(S);
            },
            onClose: () => I(!1)
          }
        )
      ]
    }
  );
}
async function fh() {
  const e = await de("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
  let a = n ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (n)
    try {
      const o = JSON.parse(n);
      Array.isArray(o.reviews) && (a = JSON.stringify(o.reviews, null, 2));
    } catch {
    }
  const i = URL.createObjectURL(
    new Blob([a], { type: "application/json" })
  ), s = document.createElement("a");
  s.href = i, s.download = "data-quality-browser-recovery.json", s.click(), URL.revokeObjectURL(i);
}
function uo({ label: e }) {
  return /* @__PURE__ */ l("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ r(Ul, { className: "dq-spin" }),
    e
  ] });
}
function fo({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ l("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ r($n, {}),
    /* @__PURE__ */ r("p", { children: e }),
    /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const yh = { components: { DataQualityPage: ah } };
export {
  ah as DataQualityPage,
  yh as default,
  yr as objectFiltersEqual
};
