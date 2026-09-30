import { jsxs as l, Fragment as ge, jsx as r } from "react/jsx-runtime";
import { useState as C, useRef as $, useEffect as Q, useLayoutEffect as kt, useMemo as he, useCallback as Sn, useSyncExternalStore as Li, useId as at, createContext as bl, useContext as wl, Fragment as Di } from "react";
import { useKeySequence as yl, EntityReferenceMultiSelector as Qn, SortableList as gs, TagBadge as vl, EntityReferenceSelector as Io, EntityDetailTabs as Nl, DetailListToolbar as ra, PERFORMER_CRITERIA as _i, AUDIO_CRITERIA as bs, VIDEO_CRITERIA as ji, NarrativeText as ql, AUDIO_SORT_OPTIONS as Sl, VIDEO_SORT_OPTIONS as ws, AudioPlayer as kl, VideoPlayer as ys, formatDuration as vs, FilterDialog as El, getResolutionLabel as Cl, ConfirmDialog as Al, TAG_CRITERIA as Tl, TAG_SORT_OPTIONS as Il, TagTile as Rl, VideoCard as $l } from "@cove/runtime/components";
import { Search as ca, Flag as Fn, Check as la, Pencil as Lr, Ban as La, ChevronDown as Ui, Plus as Ba, Pin as Ns, GripVertical as qs, AlertTriangle as On, Copy as Ss, Trash2 as Gi, X as da, Mic as Ol, Users as ks, Tag as Es, Headphones as Cs, Film as Va, ChevronLeft as ua, MoreHorizontal as Ml, RectangleHorizontal as Fl, LayoutGrid as Ki, ChevronRight as As, Save as xl, RotateCcw as Pl, Layers as Ro, Undo2 as Ll, RefreshCw as Dl, ExternalLink as Ts, SkipForward as _l, Upload as jl, Download as Is, ArrowUp as Ul, ArrowDown as Gl, Loader2 as Kl, List as Bl, Grid3X3 as Vl } from "@cove/runtime/lucide-react";
import { extensionFetch as zl } from "@cove/runtime/api";
import { createPortal as Jl } from "react-dom";
const Bi = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, Vi = Object.keys(
  Bi
);
function aa(e) {
  return e === "excludes" || e === "excludesAll";
}
function zi(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
function Rs(e) {
  const t = [...e.performerFlags ?? []];
  for (const n of e.flagPerformerTagIds ?? [])
    t.some((a) => a.tagId === n && a.categoryTagId === void 0) || t.push({ tagId: n });
  return t;
}
function Wl(e, t) {
  const { performerFlags: n, flagPerformerTagIds: a, ...i } = e, o = [];
  for (const s of t)
    o.some(
      (c) => c.tagId === s.tagId && c.categoryTagId === s.categoryTagId
    ) || o.push(
      s.categoryTagId === void 0 ? { tagId: s.tagId } : { tagId: s.tagId, categoryTagId: s.categoryTagId }
    );
  return o.length ? { ...i, performerFlags: o } : i;
}
const $s = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Te(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function Ji(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function Ue(e) {
  return Ji(je(e));
}
function Hl(e) {
  return je(e) === "video";
}
function je(e) {
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
], Wn = "none";
function mr(e) {
  return typeof e == "string" && Jn.includes(e);
}
function Wi(e) {
  const t = e.shortcut;
  return mr(t) || t === Wn ? t : "auto";
}
function Os(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), i = [];
  e.forEach((s, c) => {
    const u = Wi(s);
    if (u !== Wn) {
      if (u !== "auto") {
        if (!n.has(u)) {
          n.set(u, c), t[c] = u;
          return;
        }
        a.add(c);
      }
      i.push(c);
    }
  });
  const o = Jn.filter((s) => !n.has(s));
  return i.forEach((s, c) => {
    const u = o[c];
    u !== void 0 && (t[s] = u, n.set(u, s));
  }), { keys: t, actionOn: n, duplicatePins: a };
}
function Ql(e, t, n) {
  const { keys: a, actionOn: i } = Os(e), o = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (mr(n)) {
    const c = i.get(n), u = a[t];
    c !== void 0 && c !== t && o.set(c, u && e[t].shortcut === u ? u : void 0);
  }
  const s = new Set([...o.values()].filter(mr));
  return e.map((c, u) => {
    const p = o.has(u) ? o.get(u) : mr(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (p === c.shortcut) return c;
    const { shortcut: d, ...g } = c;
    return p === void 0 ? g : { ...g, shortcut: p };
  });
}
function oa(e) {
  return Te(e) && !Fs(e.occurrence) ? "Complete the optional occurrence condition before saving." : !Hl(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : je(e) !== "tag" && e.actions.some(
    (t) => Hi(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => xn(t, je(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const Yl = {
  video: 1e3,
  audio: 250
};
function Kt(e, t = "video") {
  const n = (a, i) => Number.isFinite(Number(a)) && Number(a) > 0 ? Math.floor(Number(a)) : i;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(Yl[t], n(e.perPage, 40))
    )
  };
}
function $o(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function zn(e) {
  const { page: t, ...n } = e.view.filter, a = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Te(e) ? [e.entityType, ...a, e.occurrence] : je(e) === "video" ? a : [je(e), ...a]
  );
}
function xn(e, t) {
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
  ) && !Hi(e) : !1;
}
function Xl(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function Mn(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function Yn(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Ms(e) {
  return "steps" in e && e.steps.length > 0;
}
function Hn(e) {
  return "steps" in e ? e.steps.some((t) => Mn(t.mode)) : !1;
}
function Hi(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (Mn(n.mode))
      for (const a of n.tagIds) {
        const i = t.get(a);
        if (i && i !== n.mode) return !0;
        t.set(a, n.mode);
      }
  return !1;
}
function fa(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || $s.includes(n.entityType)) && (!Xl(n.entityType) || Fs(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && Zl(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (a) => typeof a == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (a) => typeof (a == null ? void 0 : a.id) == "string" && typeof a.label == "string" && (a.shortcut === void 0 || typeof a.shortcut == "string") && (n.entityType === "tag" ? "effect" in a && !("steps" in a) && !("group" in a) && xn(a, "tag") : "steps" in a && !("effect" in a) && Array.isArray(a.steps) && a.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && (a.group === void 0 || typeof a.group == "string") && xn(a, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => oa(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Zl(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (a) => ["date", "studio", "performers", "tags"].includes(a)
  )) && [n.annotationParents, n.binParents].every(
    (a) => a === void 0 || Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function gi(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const a of e)
    for (const i of a)
      n.has(i.id) || (n.add(i.id), t.push(i));
  return t;
}
function ed(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), a = new Set(t.map((c) => n(c.name))), i = e.trim(), o = i.replace(/ copy(?: \d+)?$/i, ""), s = `${o !== i && a.has(n(o)) ? o : i} copy`;
  for (let c = 1; ; c++) {
    const u = c === 1 ? s : `${s} ${c}`;
    if (!a.has(n(u))) return u;
  }
}
function td(e, t, n) {
  return { ...structuredClone(e), id: n, name: ed(e.name, t) };
}
function Fs(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (a) => Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(a).size === a.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && Vi.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || nd(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function nd(e) {
  if (!Array.isArray(e)) return !1;
  const t = (a) => Number.isSafeInteger(a) && a > 0, n = /* @__PURE__ */ new Set();
  return e.every((a) => {
    if (!a || typeof a != "object" || Array.isArray(a)) return !1;
    const { tagId: i, categoryTagId: o } = a;
    if (!t(i) || o !== void 0 && !t(o))
      return !1;
    const s = `${i}:${o ?? ""}`;
    return n.has(s) ? !1 : (n.add(s), !0);
  });
}
function Oo(e, t) {
  return e.size > 0 ? [...e].sort((n, a) => n - a) : t == null ? [] : [t];
}
function Mo(e, t, n, a) {
  if (t.length === 0) return null;
  if (n == null) return t[0];
  if (!a && t.includes(n)) return n;
  const i = Math.max(0, e.indexOf(n));
  if (a) {
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
function rd(e, t) {
  const n = new Set(e), a = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    a ? n.delete(i) : n.add(i);
  return n;
}
function ad(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function id(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function od(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function sd(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function cd(e, t) {
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
const xs = "ext:com.midnightrider.data-quality:configuration", ld = "ext:cove-data-quality:video-reviews", bi = "ext:com.midnightrider.data-quality:progress";
class Ps extends Error {
}
const ha = /* @__PURE__ */ new Map(), Ta = /* @__PURE__ */ new Map(), fr = (e, t) => e.includes("*") || e.includes(t), Da = (e) => ue(`/api/savedfilters?mode=${encodeURIComponent(e)}`), dd = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function wi(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Or(e) {
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
    reviews: fa(JSON.stringify(t.reviews)),
    deletedIds: wi(t.deletedIds),
    importedIds: wi(t.importedIds)
  };
}
function ud(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const a = /* @__PURE__ */ new Set();
  for (const i of t) {
    const o = localStorage.getItem(i);
    if (o !== null) {
      const s = fa(o);
      n ?? (n = s), s.forEach((c) => a.add(c.id));
    }
    wi(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((s) => a.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...a],
    present: n !== void 0
  };
}
async function Ls(e) {
  const t = await ue("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Qi(e, t) {
  const n = (Ta.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Ta.set(e, n), n.finally(() => {
    Ta.get(e) === n && Ta.delete(e);
  }).catch(() => {
  }), n;
}
let Xr = null;
function fd() {
  if (Xr) return Xr;
  const e = hd();
  return Xr = e, e.finally(() => {
    Xr === e && (Xr = null);
  }).catch(() => {
  }), e;
}
async function hd() {
  const e = await ue("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return Qi(t, () => pd(e, t));
}
async function pd(e, t) {
  var m;
  const n = String(e.user.id), a = fr(e.permissions, "savedfilters.read"), i = a && fr(e.permissions, "savedfilters.write"), o = a ? (await Da(xs)).filter((b) => b.name === "Data Quality configuration").sort((b, w) => b.id - w.id) : [];
  if (o.length > 1) {
    const b = (w) => {
      const { revision: N, ...q } = Or(w.uiOptions);
      return JSON.stringify(q);
    };
    if (o.some((w) => b(w) !== b(o[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (i)
      for (const w of o.slice(1))
        await ue(`/api/savedfilters/${w.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${w.id}` })
        });
    o.splice(1);
  }
  let s = o.length ? Or(o[0].uiOptions) : dd();
  const c = localStorage.getItem(`${t}:migrated`) === "true", u = localStorage.getItem(t), p = localStorage.getItem(`${t}:local-only`) === "true";
  !o.length && u && (s = Or(u));
  let d = !o.length;
  if (o.length && p && u) {
    const b = Or(u);
    if (b.reviews.some((N) => {
      const q = s.reviews.find((y) => y.id === N.id);
      return q && JSON.stringify(q) !== JSON.stringify(N);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const w = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...b.deletedIds])
    ];
    s = {
      ...s,
      reviews: gi(s.reviews, b.reviews).filter(
        (N) => !w.includes(N.id)
      ),
      deletedIds: w,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...b.importedIds])
      ]
    }, d = !0;
  }
  if (!c) {
    const b = JSON.stringify(s), w = ud(n);
    if (o.length && w.reviews.some((R) => {
      const F = s.reviews.find((_) => _.id === R.id);
      return F && JSON.stringify(F) !== JSON.stringify(R);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = a ? (await Da(ld)).flatMap(
      (R) => fa(R.uiOptions ?? "[]")
    ) : [], q = w.known.filter(
      (R) => !w.reviews.some((F) => F.id === R)
    ), y = /* @__PURE__ */ new Set([...s.deletedIds, ...q]);
    s = {
      ...s,
      reviews: gi(
        w.reviews,
        s.reviews,
        N.filter(
          (R) => !w.known.includes(R.id) && !s.importedIds.includes(R.id)
        )
      ).filter((R) => !y.has(R.id)),
      deletedIds: [...y],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...w.known,
          ...N.map((R) => R.id)
        ])
      ]
    }, d || (d = JSON.stringify(s) !== b);
  }
  const g = {
    userId: n,
    recordId: (m = o[0]) == null ? void 0 : m.id,
    config: s,
    readable: a,
    writable: i,
    durable: i
  };
  if (ha.set(t, g), d && i) {
    const b = s;
    o.length && (g.config = Or(o[0].uiOptions)), await Ds(t, b), s = g.config;
  } else o.length || (localStorage.setItem(t, JSON.stringify(s)), !a && (!c || p) && localStorage.setItem(`${t}:local-only`, "true"));
  if (!a) localStorage.setItem(`${t}:migrated`, "true");
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
    canConfigure: !a || i,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: a ? i ? "account" : "readOnly" : "browser",
    storageNotice: a ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Ds(e, t) {
  const n = ha.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const a = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await Ls(n), n.recordId != null) {
      const o = await ue(
        `/api/savedfilters/${n.recordId}`
      );
      if (Or(o.uiOptions).revision !== n.config.revision)
        throw new Ps(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await ue(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: xs,
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
function md(e, t) {
  return Qi(e, async () => {
    const n = ha.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const a = n.config.reviews, i = t(a);
    if (i === a) return a;
    fa(JSON.stringify(i));
    const o = a.filter((s) => !i.some((c) => c.id === s.id)).map((s) => s.id);
    return await Ds(e, {
      ...n.config,
      reviews: i,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...o])
      ].filter((s) => !i.some((c) => c.id === s))
    }), i;
  });
}
function Fo(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, a]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(a)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function gd(e, t) {
  const n = ha.get(e);
  if (!n) return null;
  const a = localStorage.getItem(`${e}:progress:${t}`), i = a ? Fo(a) : null;
  if (!n.readable) return i;
  const o = (await Da(bi)).find(
    (c) => c.name === t
  ), s = o ? Fo(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function bd(e, t, n) {
  const a = `${e}:progress:${t}`;
  try {
    localStorage.setItem(a, JSON.stringify(n));
  } catch {
  }
  return Qi(a, async () => {
    const i = ha.get(e);
    if (!(i != null && i.writable)) return;
    await Ls(i);
    const o = (await Da(bi)).find(
      (s) => s.name === t
    );
    await ue(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: bi,
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
const wd = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function En(e) {
  return wd[e];
}
const _a = "confirmed_absent_tags", Yi = "Confirmed absent tags", za = "confirmed_absent_occurrence_tags", _s = {
  key: _a,
  label: Yi,
  type: "tag",
  subject: "tag assessments"
}, Xi = {
  key: za,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, yd = {
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
function Pn(e) {
  return Array.isArray(e) ? e.map(Pn) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? yd[n] ?? n : t === "key" && typeof n == "string" && [
        _a,
        za
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Pn(n)
    ])
  ) : e;
}
async function js(e, t, n) {
  const a = new Headers(t.headers);
  !(t.body instanceof FormData) && !a.has("Content-Type") && a.set("Content-Type", "application/json");
  const i = await zl(e, { ...t, headers: a });
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
async function ue(e, t = {}) {
  return await js(e, t, "fail");
}
function vd(e, t = {}) {
  return js(e, t, "null");
}
const Nd = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let qd = 0;
function yi(e, t) {
  return ue(
    `/api/${Xn(e)}/${t}?dqRead=${Nd}-${++qd}`,
    { cache: "no-store" }
  );
}
function Us(e, t) {
  const n = { ...e.view.objectFilter }, a = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Pn({
      findFilter: Kt(t, Ue(e)),
      objectFilter: n,
      filterExpression: a
    })
  );
}
async function ta(e, t, n) {
  return ue(
    `/api/${Xn(Ue(e))}/find`,
    { method: "POST", signal: n, body: Us(e, t) }
  );
}
async function Sd(e, t, n) {
  return (await ue(
    `/api/${Xn(Ue(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Us(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function xo(e, t, n) {
  const a = { ...e.view.objectFilter };
  return delete a._filterExpression, ue("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Pn({
        findFilter: Kt(t),
        objectFilter: a
      })
    )
  });
}
function kd(e) {
  return ue("/api/taggroups", { signal: e });
}
function vi(e, t, n = 1280) {
  return `/api/${Xn(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function Ni(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Po(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Ed(e) {
  return `/api/stream/video/${e}/preview`;
}
function Cd(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Ad(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Ja(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e) {
    await ue(`/api/tags/${a}`, { signal: t }), n.add(a);
    for (let i = 1; ; i++) {
      const o = await ue("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Pn({
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
async function Zi(e, t) {
  const n = Yn(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await Ja(i.tagIds, t)).filter(
          (o) => !n.has(o)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function Td(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function eo(e, t) {
  const a = (await ue("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!a)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = Td(e, a);
  return i ? { kind: "incompatible", message: i } : a.entityTypes.includes(t) ? { kind: "ready", definition: a, message: "" } : {
    kind: "missing",
    message: `Add ${En(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: a
  };
}
async function Gs(e, t) {
  const n = await eo(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await ue(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await ue("/api/custom-fields", {
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
function Ks(e = "video") {
  return eo(_s, e);
}
function Id(e = "video") {
  return Gs(_s, e);
}
function Bs(e = "video") {
  return eo(Xi, e);
}
function Rd(e = "video") {
  return Gs(Xi, e);
}
function ja(e) {
  return [...new Set(e)];
}
function Vs(e, t) {
  const n = e.customFields ?? {}, a = Object.keys(n).find(
    (o) => o.toLowerCase() === za
  ), i = a === void 0 ? [] : n[a];
  return ja(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function $d(e) {
  let t;
  try {
    t = await Bs(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${Xi.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Od(e, t, n, a, i, o) {
  await ue(`/api/${Xn(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: ja(i).map((s) => `${a}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function Md(e, t, n) {
  const a = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${Yi} custom field is not available.`
      );
    return { customFields: { [n]: a }, customFieldMode: o };
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
async function zs(e, t, n) {
  if (!xn(t) || n.length === 0 || n.some((u) => !Number.isSafeInteger(u) || u <= 0))
    throw new Error(
      `Choose ${En(e).many} and configure a valid action first.`
    );
  let a = null;
  if (Hn(t)) {
    let u;
    try {
      u = await Ks(e);
    } catch (p) {
      throw new Error(
        `Could not verify the ${Yi} custom field. ${p instanceof Error ? p.message : "Request failed."}`
      );
    }
    if (u.kind !== "ready") throw new Error(u.message);
    a = u.definition.key;
  }
  const i = ja(n), o = (await Zi(t)).map((u) => ({
    mode: u.mode,
    tagIds: ja(u.tagIds)
  })), c = [
    ...o.filter((u) => !Mn(u.mode)),
    ...o.filter((u) => Mn(u.mode))
  ].map(
    (u) => Md(u, i, a)
  );
  for (let u = 0; u < c.length; u++)
    try {
      await ue(`/api/${Xn(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(c[u])
      });
    } catch (p) {
      throw new Error(
        `Step ${u + 1} failed; ${u} earlier step(s) completed. Refresh and check the selected ${En(e).many} before retrying. ${p instanceof Error ? p.message : "Request failed."}`
      );
    }
}
async function Fd(e, t) {
  if (!xn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await ue("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const Ia = (e) => e >= "0" && e <= "9";
function Lo(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function Do(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, a = 0;
  for (; n < e.length && a < t.length; ) {
    if (Ia(e[n]) && Ia(t[a])) {
      const c = n, u = a;
      for (; n < e.length && Ia(e[n]); ) n++;
      for (; a < t.length && Ia(t[a]); ) a++;
      const p = e.slice(c, n).replace(/^0+/, ""), d = t.slice(u, a).replace(/^0+/, "");
      if (p.length !== d.length) return p.length < d.length ? -1 : 1;
      if (p !== d) return p < d ? -1 : 1;
      continue;
    }
    const o = Lo(e[n]), s = Lo(t[a]);
    if (o !== s) return o < s ? -1 : 1;
    n++, a++;
  }
  const i = e.length - n - (t.length - a);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function Js(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, a = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(a(e) - a(t)) || Do(e.tagGroupName, t.tagGroupName) || Do(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function gr(e) {
  return [...e].sort(Js);
}
const qi = /* @__PURE__ */ new Map();
function xd(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const a of n.steps)
        a.mode === "REMOVE_TREE" && a.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function to(e, t, n) {
  const a = Yn(e), i = [], o = [];
  for (const m of e.steps) {
    if (m.mode !== "REMOVE_TREE") {
      o.push(m);
      continue;
    }
    const b = m.tagIds.flatMap((w) => {
      const N = n.get(w);
      return N || i.push(w), N ?? [w];
    });
    o.push({ mode: "REMOVE", tagIds: b.filter((w) => !a.has(w)) });
  }
  const s = [
    ...o.filter((m) => !Mn(m.mode)),
    ...o.filter((m) => Mn(m.mode))
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
    unresolvedTrees: [...new Set(i)]
  };
}
function Pd(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const a of e.applications)
      n.has(a.tag.id) || n.set(a.tag.id, a.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, a) => ({ id: n, name: e.names[a] ?? "" }));
  return gr(t);
}
function Ws(e) {
  return Hs(xd(e));
}
function Hs(e) {
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, a] = C(() => /* @__PURE__ */ new Map()), i = $(/* @__PURE__ */ new Set()), o = $(!0);
  return Q(() => (o.current = !0, () => {
    o.current = !1;
  }), []), Q(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      i.current.has(c) || (i.current.add(c), Ja([c]).then(
        (u) => {
          o.current && a((p) => new Map(p).set(c, u));
        },
        () => {
          i.current.delete(c);
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
    const i = Nt(n.group);
    if (!i) return;
    const o = t.get(i);
    o ? o.actions.push(a) : t.set(i, { key: i, name: n.group.trim(), actions: [a] });
  }), [...t.values()];
}
function _o(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => Nt(t.group) !== "");
}
function Qs(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function Ys(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function Xs(e) {
  return Yn(e).size > 0 || Ys(e).size > 0;
}
function Ld(e) {
  return wr(e).filter(
    (t) => !t.actions.some((n) => Xs(e[n]))
  );
}
function Si(e, t) {
  const n = Qs(t), a = new Set(t.absent);
  return wr(e).map((i) => {
    const o = [], s = [];
    for (const c of i.actions) {
      const u = [...Yn(e[c])], p = [...Ys(e[c])], d = [
        ...u.map((g) => n.has(g)),
        ...p.map((g) => a.has(g))
      ];
      d.some(Boolean) && (s.push(c), d.every(Boolean) && o.push(c));
    }
    return { ...i, answers: o.length ? o : s };
  });
}
function ki(e) {
  return e.filter((t) => t.answers.length === 0);
}
function Dd(e, t, n) {
  const a = { ids: [...Qs(t)], absent: t.absent }, i = to(e, a, n), o = new Set(i.removed), s = new Set(i.absenceCleared);
  return {
    ids: [...a.ids.filter((c) => !o.has(c)), ...i.added],
    absent: [...a.absent.filter((c) => !s.has(c)), ...i.markedAbsent]
  };
}
const Fr = "review";
function _d(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function jd(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function hr(e, t) {
  const n = new Set(_d(e));
  return t.filter((a) => n.has(a.id));
}
function jo(e, t, n) {
  const a = /* @__PURE__ */ new Map(), i = (s, c) => {
    const u = a.get(s) ?? c();
    return a.set(s, u), u;
  };
  for (const s of hr(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const u = c.categoryTagId === void 0 ? i(Fr, () => ({
        key: Fr,
        name: "",
        tagIds: null,
        flags: [],
        mixed: []
      })) : i(`tag:${c.categoryTagId}`, () => {
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
  const o = [...a.values()];
  return [
    ...o.filter((s) => s.key === Fr),
    ...o.filter((s) => s.key !== Fr)
  ];
}
function Ei(e, t, n) {
  return e !== n.key && e.startsWith("tag:") && n.members.every((a) => t.includes(a));
}
function no(e) {
  const t = e.flatMap((i) => i.mixed), n = (i, o) => t.some(
    (s, c) => Ei(s.key, s.members, i) && !(c > o && Ei(i.key, i.members, s))
  ), a = /* @__PURE__ */ new Map();
  return t.forEach((i, o) => {
    !a.has(i.key) && !n(i, o) && a.set(i.key, {
      key: i.key,
      name: i.name,
      tagIds: i.members,
      flags: [],
      mixed: i.tags
    });
  }), [...a.values()];
}
function Ud(e, t) {
  return t.filter(
    (n) => n.key === e.key || Ei(n.key, n.tagIds ?? [], e)
  );
}
function Zs(...e) {
  const t = /* @__PURE__ */ new Map();
  for (const a of e.flat()) {
    const i = t.get(a.key);
    if (!i) {
      t.set(a.key, { ...a, flags: [...a.flags] });
      continue;
    }
    for (const o of a.flags) i.flags.includes(o) || i.flags.push(o);
    i.mixed.length || (i.mixed = a.mixed), i.unresolved && !a.unresolved && delete i.unresolved, i.tagIds !== null && a.tagIds !== null && (i.tagIds = [.../* @__PURE__ */ new Set([...i.tagIds, ...a.tagIds])]);
  }
  const n = [...t.values()];
  return [
    ...n.filter((a) => a.key === Fr),
    ...n.filter((a) => a.key !== Fr)
  ];
}
function Gd(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e.steps)
    if (a.mode !== "CLEAR_ABSENCE")
      for (const i of a.tagIds)
        for (const o of a.mode === "REMOVE_TREE" ? t.get(i) ?? [i] : [i])
          n.add(o);
  return n;
}
function ec(e, t, n) {
  if (t.tagIds === null) return !0;
  const a = Gd(e, n);
  return t.tagIds.some((i) => a.has(i));
}
function Kd(e, t, n) {
  return t.filter(
    (a) => a.tagIds === null || a.unresolved && e.length > 0 || e.some((i) => ec(i, a, n))
  );
}
function Bd(e, t, n) {
  return t.filter((a) => a.tagIds !== null && ec(e, a, n));
}
function Vd(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function ro(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [Vd(e.mixed)] : []
  ];
}
function zd(e) {
  const t = ro(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function Jd(e, t, n) {
  const a = hr(e, t).map((i) => {
    const o = e.filter((c) => c.tagId === i.id);
    if (o.every((c) => c.categoryTagId === void 0)) return i.name;
    const s = o.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${i.name} (affects ${[...new Set(s)].join(", ")})`;
  });
  return a.length ? `Flagged: ${a.join(", ")}` : "";
}
const Ci = "-", Uo = "Ctrl+a", Wd = "Ctrl/⌘A", Hd = ["f", "g", "k"], oi = "Shift+";
function _r(e) {
  return he(() => Os(e), [e]);
}
function ao({
  surface: e,
  enabled: t,
  actions: n,
  onAction: a,
  onFind: i,
  onSelectAll: o
}) {
  const s = _r(n), c = $({ keyMap: s, onAction: a, onFind: i, onSelectAll: o });
  kt(() => {
    c.current = { keyMap: s, onAction: a, onFind: i, onSelectAll: o };
  });
  const u = !!i && n.length > 0, p = e === "local" && !!o, d = Jn.filter(
    (m) => s.actionOn.has(m) || e === "local" && Hd.includes(m)
  ).join(" "), g = he(() => {
    const m = (N) => {
      var y, R;
      const q = c.current;
      if (N === Uo) (y = q.onSelectAll) == null || y.call(q);
      else if (N === Ci) (R = q.onFind) == null || R.call(q);
      else {
        const F = N.startsWith(oi), _ = q.keyMap.actionOn.get(
          F ? N.slice(oi.length) : N
        );
        _ !== void 0 && q.onAction(_, F);
      }
    }, b = (N, q = e) => ({
      keys: N,
      surface: q,
      action: (y) => {
        y != null && y.repeat || m((y == null ? void 0 : y.sequence) ?? N);
      }
    }), w = [];
    p && w.push(b(Uo, "local")), u && w.push(b(Ci));
    for (const N of d ? d.split(" ") : [])
      w.push(b(N), b(`${oi}${N}`));
    return w;
  }, [e, d, u, p]);
  yl(g, t);
}
const Qd = {
  find: Ci,
  selectAll: Wd
};
function io() {
  return Qd;
}
const Yd = 600 * 1e3, oo = /* @__PURE__ */ new Map(), tc = /* @__PURE__ */ new Map(), Vn = /* @__PURE__ */ new Map();
function nc(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = tc.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function rc(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && tc.set(e.tagGroupId, e.tagGroupSortOrder), oo.set(e.id, { tag: e, at: Date.now() });
}
function ac(e) {
  const t = oo.get(e);
  if (!(!t || Date.now() - t.at > Yd))
    return nc(t.tag);
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
function Ai(e) {
  var t;
  for (const n of e) {
    const a = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && a && rc(ic({ ...n, name: a }));
  }
}
function Xd(e) {
  const t = Vn.get(e);
  if (t) return t;
  const n = new AbortController(), a = {
    controller: n,
    waiters: 0,
    promise: ue(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var d, g;
        const o = ((d = i == null ? void 0 : i.name) == null ? void 0 : d.trim()) || null;
        if (Vn.get(e) === a && Vn.delete(e), !o) return null;
        const s = ic({ ...i, id: e, name: o }), c = (g = oo.get(e)) == null ? void 0 : g.tag, u = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, p = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (u ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return rc(p), nc(p);
      },
      () => (Vn.get(e) === a && Vn.delete(e), null)
    )
  };
  return Vn.set(e, a), a;
}
function Go() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function si(e) {
  const t = {};
  for (const n of e) {
    const a = ac(n);
    a !== void 0 && (t[n] = a);
  }
  return t;
}
function Zd(e, t) {
  if (t != null && t.aborted) return Promise.reject(Go());
  const n = {}, a = [];
  for (const i of new Set(e)) {
    const o = ac(i);
    if (o !== void 0) n[i] = o;
    else {
      const s = Xd(i);
      s.waiters += 1, a.push({ id: i, entry: s });
    }
  }
  return a.length ? new Promise((i, o) => {
    let s = !1;
    const c = () => {
      for (const { id: p, entry: d } of a)
        d.waiters -= 1, d.waiters === 0 && Vn.get(p) === d && (Vn.delete(p), d.controller.abort());
    }, u = () => {
      s || (s = !0, c(), o(Go()));
    };
    t == null || t.addEventListener("abort", u, { once: !0 }), Promise.all(
      a.map(
        ({ id: p, entry: d }) => d.promise.then((g) => [p, g])
      )
    ).then((p) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", u), c();
        for (const [d, g] of p) n[d] = g;
        i(n);
      }
    });
  }) : Promise.resolve(n);
}
function oc(e) {
  const t = {};
  for (const [n, a] of Object.entries(e)) t[Number(n)] = (a == null ? void 0 : a.name) ?? null;
  return t;
}
function pa(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, a] = C(() => ({
    key: t,
    tags: si(ci(t))
  }));
  return Q(() => {
    const i = ci(t), o = si(i);
    if (a({ key: t, tags: o }), i.every((c) => c in o)) return;
    const s = new AbortController();
    return Zd(i, s.signal).then(
      (c) => a({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : si(ci(t));
}
function jr(e) {
  const t = pa(e);
  return he(() => oc(t), [t]);
}
function ci(e) {
  return e ? e.split(",").map(Number) : [];
}
const eu = "(max-width: 760px)";
function sc(e) {
  const [t] = C(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = Sn(
    (a) => (t == null || t.addEventListener("change", a), () => t == null ? void 0 : t.removeEventListener("change", a)),
    [t]
  );
  return Li(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function ma() {
  return sc(eu);
}
function tu(e, t, n = !1) {
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
function Nr(e, t, n = [], a) {
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
  const i = Yn(e), o = (s) => i.has(s) || [...i].some((c) => {
    var u;
    return (u = a == null ? void 0 : a.get(s)) == null ? void 0 : u.includes(c);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (c) => tu(
        s.mode,
        t[c] === void 0 ? "…" : t[c] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && o(c)
      )
    )
  );
}
function Wa(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function so({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  canStay: i = !0,
  tapStays: o = !1,
  onApply: s,
  onClose: c
}) {
  const u = ma(), [p, d] = C(""), [g, m] = C(0), b = $(null), w = $(null), N = $(null), q = $(null), y = $(null), R = $(/* @__PURE__ */ new Set()), F = at(), _ = jr(he(() => Wa(e), [e])), B = _r(e), L = he(() => {
    const G = p.trim().toLocaleLowerCase(), D = (S) => S ? Jn.indexOf(S) : Jn.length;
    return e.map((S, I) => ({ action: S, index: I, key: B.keys[I] })).sort((S, I) => D(S.key) - D(I.key)).filter((S) => !G || S.action.label.toLocaleLowerCase().includes(G));
  }, [e, B, p]), Z = L.length ? Math.min(g, L.length - 1) : -1, ne = (G) => `${F}-option-${G}`;
  kt(() => {
    var G, D, S;
    return q.current = document.activeElement, y.current = ((D = (G = N.current) == null ? void 0 : G.parentElement) == null ? void 0 : D.closest('[role="dialog"]')) ?? null, (S = b.current) == null || S.focus({ preventScroll: !0 }), () => {
      var Y;
      const I = q.current;
      I instanceof HTMLElement && I.isConnected && I.focus({ preventScroll: !0 }), document.activeElement !== I && ((Y = y.current) != null && Y.isConnected) && y.current.focus({ preventScroll: !0 });
    };
  }, []), Q(() => {
    var G, D, S;
    Z < 0 || (S = (D = (G = w.current) == null ? void 0 : G.querySelector(`[id="${ne(L[Z].index)}"]`)) == null ? void 0 : D.scrollIntoView) == null || S.call(D, { block: "nearest" });
  }, [Z, L]);
  function ae(G, D) {
    !G || a != null && a(G.action) || s(G.action, i && D);
  }
  function ie(G) {
    var S;
    G.stopPropagation();
    const D = G.code || G.key;
    if (G.repeat && !R.current.has(D)) {
      G.preventDefault();
      return;
    }
    if (G.repeat || R.current.add(D), G.key === "Escape")
      G.preventDefault(), c();
    else if (G.key === "Enter")
      G.preventDefault(), G.repeat || ae(L[Z], G.shiftKey);
    else if (G.key === "ArrowDown" || G.key === "ArrowUp") {
      if (G.preventDefault(), !L.length) return;
      const I = G.key === "ArrowDown" ? 1 : -1;
      m((Z + I + L.length) % L.length);
    } else G.key === "Tab" && (G.preventDefault(), (S = b.current) == null || S.focus());
  }
  return /* @__PURE__ */ l(ge, { children: [
    /* @__PURE__ */ r("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: c }),
    /* @__PURE__ */ l(
      "div",
      {
        ref: N,
        role: "dialog",
        "aria-label": "Find an action",
        className: `dq-find-action${u ? " dq-find-mobile" : ""}`,
        onKeyDown: ie,
        onMouseDown: (G) => {
          G.target !== b.current && G.preventDefault();
        },
        children: [
          /* @__PURE__ */ l("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ r(ca, { "aria-hidden": "true" }),
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
                "aria-activedescendant": Z >= 0 ? ne(L[Z].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: p,
                onChange: (G) => {
                  d(G.target.value), m(0);
                }
              }
            ),
            !u && /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          L.length ? /* @__PURE__ */ r(
            "ul",
            {
              ref: w,
              id: `${F}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: L.map((G, D) => /* @__PURE__ */ r("li", { role: "none", children: /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: ne(G.index),
                  tabIndex: -1,
                  "aria-selected": D === Z,
                  disabled: (a == null ? void 0 : a(G.action)) ?? !1,
                  onClick: (S) => ae(G, S.shiftKey || o && Ms(G.action)),
                  children: [
                    u ? null : G.key ? /* @__PURE__ */ r("kbd", { children: G.key }) : /* @__PURE__ */ r("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ r("span", { className: "dq-find-label", children: G.action.label }),
                    /* @__PURE__ */ r("span", { className: "dq-find-effect", children: Nr(G.action, _, t, n).map(
                      (S, I) => /* @__PURE__ */ r("span", { "data-effect-tone": S.tone, children: S.text }, I)
                    ) })
                  ]
                }
              ) }, G.action.id))
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
function cc() {
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
function co(e) {
  return Li(e.subscribe, e.get, e.get);
}
function lc(e, t) {
  const n = $(t);
  kt(() => {
    n.current !== t && (n.current = t, e.set(null));
  }, [e, t]);
}
function dc(e, t) {
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
const nu = [], Ko = ia.map((e, t) => ({
  indent: t,
  keys: e,
  fixed: t === 2 ? ["n", "m", ",", "."] : []
}));
function ru(e, t) {
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
function Ra(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function uc(e) {
  return ia.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function fc({
  groups: e,
  renderAction: t,
  find: n
}) {
  const a = e.length ? e : [[]];
  return /* @__PURE__ */ r(ge, { children: a.map((i, o) => /* @__PURE__ */ l("div", { className: "dq-mobile-group", children: [
    i.map(t),
    o === a.length - 1 && n
  ] }, o)) });
}
function hc({
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
function au({
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
        const o = t ? i.answers : null, s = o ? o.length ? "answered" : "open" : "unknown", c = o == null ? void 0 : o.map((d) => n[d].label).join(", "), u = a(i), p = s === "answered" ? `${i.name}: ${c}` : s === "open" ? `${i.name}: not answered yet` : i.name;
        return /* @__PURE__ */ l(
          "li",
          {
            className: "dq-group",
            "data-state": s,
            "data-attention": u ? !0 : void 0,
            title: u ? `${p}. Needs attention: ${u}` : p,
            children: [
              /* @__PURE__ */ r("span", { className: "dq-group-name", children: i.name }),
              u && /* @__PURE__ */ l("span", { className: "dq-group-flag", children: [
                /* @__PURE__ */ r(Fn, { "aria-hidden": "true" }),
                /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  u
                ] })
              ] }),
              s === "answered" && /* @__PURE__ */ l(ge, { children: [
                /* @__PURE__ */ r(la, { "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", answered:" }),
                " ",
                /* @__PURE__ */ r("span", { className: "dq-group-answer", children: c })
              ] }),
              s === "open" && /* @__PURE__ */ l(ge, { children: [
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
function ou({
  actions: e,
  mediaKind: t,
  isDisabled: n,
  busy: a,
  tags: i,
  trees: o,
  preview: s,
  onApply: c,
  onFind: u,
  findDisabled: p,
  paused: d = !1,
  waitForGroups: g = !1,
  attention: m = nu,
  stayOnTap: b = !1,
  onStayOnTapChange: w
}) {
  const N = io(), q = _r(e), y = ma();
  lc(s, y);
  const R = at(), F = jr(
    he(() => e.flatMap((W) => W.steps.flatMap((H) => H.tagIds)), [e])
  ), _ = Ko.filter((W) => W.keys.some((H) => q.actionOn.has(H))), B = _.includes(Ko[2]), L = e.length - q.actionOn.size, Z = he(
    () => g && !d ? wr(e) : [],
    [g, d, e]
  ), ne = he(
    () => Z.length && i ? Si(e, i) : null,
    [Z, e, i]
  ), ae = new Map(
    ki(ne ?? []).flatMap(
      (W) => W.actions.filter((H) => Xs(e[H])).map((H) => [H, W.name])
    )
  ), ie = he(
    () => e.map((W) => d ? [] : Bd(W, m, o)),
    [e, m, o, d]
  ), G = (W) => W.map(zd).join("; "), D = ie.map(G), S = Z.length > 0 && /* @__PURE__ */ r(
    au,
    {
      groups: Z,
      statuses: ne,
      actions: e,
      attentionOf: (W) => G([
        ...new Map(
          W.actions.flatMap((H) => ie[H]).map((H) => [H.key, H])
        ).values()
      ])
    }
  ), I = (W) => {
    const H = Nr(e[W], F, [], o).map((Ge) => Ge.text).join(", "), oe = ae.get(W), Ie = D[W];
    return [
      H,
      oe === void 0 ? "" : `${oe}: not answered yet`,
      Ie ? `Needs attention: ${Ie}` : ""
    ].filter(Boolean).join(". ");
  }, Y = (W) => D[W] ? (
    // The tile's description says it; the mark is for the eye, with the reasons on hover.
    /* @__PURE__ */ r(
      "span",
      {
        className: "dq-pad-flag",
        "aria-hidden": "true",
        title: `Needs attention: ${D[W]}`,
        children: /* @__PURE__ */ r(Fn, {})
      }
    )
  ) : null, A = (W) => ({
    onMouseEnter: () => s.set(W),
    onMouseLeave: () => s.clear(W),
    onFocus: () => s.set(W),
    onBlur: () => s.clear(W)
  }), V = (W) => {
    const H = q.actionOn.get(W), oe = H === void 0 ? void 0 : e[H];
    if (!oe)
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
    const Ie = n(oe), Ge = `${R}-effect-${W}`;
    return /* @__PURE__ */ l("div", { className: "dq-pad-slot", ...d ? {} : A(oe), children: [
      /* @__PURE__ */ r("span", { id: Ge, className: "dq-sr-only", children: I(H) }),
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: oe.label,
          "aria-keyshortcuts": W,
          "aria-describedby": Ge,
          "data-group-open": ae.has(H) || void 0,
          "data-attention": D[H] ? !0 : void 0,
          disabled: Ie,
          onClick: (j) => c(oe, j.shiftKey),
          children: [
            /* @__PURE__ */ r(dt, { binding: W }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-pad-label", children: oe.label }),
            Ra(oe) && " ",
            Ra(oe) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(La, { "aria-hidden": "true" }),
              "absent"
            ] }),
            Y(H)
          ]
        }
      )
    ] }, W);
  }, z = /* @__PURE__ */ l("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ r(Lr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (y) {
    const W = uc(q), H = (oe) => {
      const Ie = e[oe], Ge = q.keys[oe];
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: Ie.label,
          "aria-keyshortcuts": Ge,
          "aria-describedby": `${R}-effect-${Ge}`,
          "data-group-open": ae.has(oe) || void 0,
          "data-attention": D[oe] ? !0 : void 0,
          disabled: n(Ie),
          onClick: (j) => {
            s.clear(Ie), c(Ie, j.shiftKey || b && Ms(Ie));
          },
          ...d ? {} : dc(s, Ie),
          children: [
            /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: Ie.label }),
            Ra(Ie) && " ",
            Ra(Ie) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(La, { "aria-hidden": "true" }),
              "absent"
            ] }),
            Y(oe)
          ]
        },
        Ge
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
            d ? z : /* @__PURE__ */ r(
              Bo,
              {
                actions: e,
                keyMap: q,
                names: F,
                tags: i,
                trees: o,
                preview: s,
                findKey: N.find,
                mobile: !0
              }
            ),
            w && /* @__PURE__ */ r(iu, { checked: b, onChange: w })
          ] }),
          S,
          /* @__PURE__ */ r("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ r(
            fc,
            {
              groups: W,
              renderAction: H,
              find: /* @__PURE__ */ r(
                hc,
                {
                  extra: L,
                  findKey: N.find,
                  disabled: p,
                  onFind: u
                }
              )
            }
          ) }),
          /* @__PURE__ */ r("div", { hidden: !0, children: W.flat().map((oe) => /* @__PURE__ */ r("span", { id: `${R}-effect-${q.keys[oe]}`, children: I(oe) }, oe)) })
        ]
      }
    );
  }
  const K = /* @__PURE__ */ l("span", { className: "dq-pad-hint", children: [
    /* @__PURE__ */ r("kbd", { className: "dq-key", children: "Shift" }),
    /* @__PURE__ */ r("span", { children: "+ key or Shift-click applies and stays" })
  ] }), T = !B && /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: "dq-pad-find-button",
      "aria-label": L ? `Find action, ${L} more` : "Find action",
      "aria-keyshortcuts": N.find,
      disabled: p,
      onClick: u,
      children: [
        /* @__PURE__ */ r(dt, { binding: N.find }),
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
          d ? z : /* @__PURE__ */ r(
            Bo,
            {
              actions: e,
              keyMap: q,
              names: F,
              tags: i,
              trees: o,
              preview: s,
              findKey: N.find
            }
          ),
          S ? (
            // The checklist, then the hint and Find action, on the header's second line, under the
            // effect line: the pad keeps its height as answers of any length come in.
            /* @__PURE__ */ l("div", { className: "dq-pad-header-end", children: [
              S,
              K,
              T
            ] })
          ) : /* @__PURE__ */ l(ge, { children: [
            !d && K,
            T
          ] })
        ] }),
        _.map((W) => /* @__PURE__ */ l("div", { className: "dq-pad-row", "data-indent": W.indent, children: [
          W.keys.map(V),
          W.fixed.map((H) => {
            const oe = ru(H, t);
            return /* @__PURE__ */ l(
              "div",
              {
                className: `dq-pad-slot dq-pad-free dq-pad-fixed${oe ? " dq-pad-reserved" : ""}`,
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ r(dt, { binding: H }),
                  oe && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: oe })
                ]
              },
              H
            );
          }),
          W.fixed.length > 0 && /* @__PURE__ */ r("div", { className: "dq-pad-slot", children: /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": L ? `Find action, ${L} more` : "Find action",
              "aria-keyshortcuts": N.find,
              disabled: p,
              onClick: u,
              children: [
                /* @__PURE__ */ r(dt, { binding: N.find }),
                /* @__PURE__ */ l("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ r(ca, { "aria-hidden": "true" }),
                  L ? `${L} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, W.indent))
      ]
    }
  );
}
function Bo({
  actions: e,
  keyMap: t,
  names: n,
  tags: a,
  trees: i,
  preview: o,
  findKey: s,
  mobile: c = !1
}) {
  const u = co(o), p = u ? e.indexOf(u) : -1;
  if (!u || p < 0) {
    const b = t.actionOn.size;
    return /* @__PURE__ */ l("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && b < e.length && /* @__PURE__ */ l(ge, { children: [
        ` · ${b} on keys, ${e.length - b} more under `,
        /* @__PURE__ */ r(dt, { binding: s })
      ] })
    ] });
  }
  const d = t.keys[p], g = a && u.steps.length ? to(u, a, i) : null, m = g && !g.unresolvedTrees.length && ![g.added, g.removed, g.markedAbsent, g.absenceCleared].some(
    (b) => b.length
  );
  return /* @__PURE__ */ l("p", { className: "dq-pad-effect", children: [
    d && !c && /* @__PURE__ */ r(dt, { binding: d }),
    /* @__PURE__ */ r("strong", { children: u.label }),
    Nr(u, n, [], i).map((b, w) => /* @__PURE__ */ r("span", { "data-effect-tone": b.tone, children: b.text }, w)),
    m && /* @__PURE__ */ r("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function pc({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  busy: i,
  onApply: o,
  onFind: s,
  summary: c,
  hints: u,
  keyHints: p,
  notices: d,
  status: g,
  className: m = "",
  paused: b = !1
}) {
  const w = io(), N = _r(e), q = ma(), y = at(), R = jr(he(() => Wa(e), [e])), [F] = C(() => cc());
  lc(F, q);
  const _ = $(null), B = su(_, e, !q), L = uc(N);
  !L.length && e.length && L.push([]);
  const Z = L.flat(), ne = e.length - Z.length, ae = (S) => Nr(S, R, t, n).map((I) => I.text).join(", "), ie = (S) => ({
    onMouseEnter: () => F.set(S),
    onMouseLeave: () => F.clear(S),
    onFocus: () => F.set(S),
    onBlur: (I) => {
      I.currentTarget.contains(I.relatedTarget) || F.clear(S);
    }
  }), G = u ?? (q ? void 0 : p), D = (S) => {
    const I = e[S];
    return /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-mobile-tile",
        title: I.label,
        "aria-keyshortcuts": N.keys[S] || void 0,
        "aria-describedby": `${y}-effect-${S}`,
        disabled: b || a(I),
        onClick: () => {
          F.clear(I), o(I);
        },
        ...b ? {} : dc(F, I),
        children: /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: I.label })
      },
      I.id
    );
  };
  return /* @__PURE__ */ l(
    "section",
    {
      ref: _,
      className: `dq-action-bar${q ? " dq-bar-mobile" : B ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${b ? " dq-bar-paused" : ""}${m ? ` ${m}` : ""}`,
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
                fc,
                {
                  groups: L,
                  renderAction: D,
                  find: /* @__PURE__ */ r(
                    hc,
                    {
                      extra: ne,
                      findKey: w.find,
                      disabled: b,
                      onFind: s
                    }
                  )
                }
              ),
              !q && L.map((S, I) => /* @__PURE__ */ l("div", { className: "dq-bar-line", children: [
                S.map((Y) => {
                  const A = e[Y], V = N.keys[Y];
                  return /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: A.label,
                      "aria-keyshortcuts": V || void 0,
                      "aria-describedby": `${y}-effect-${Y}`,
                      disabled: b || a(A),
                      onClick: () => o(A),
                      ...b ? {} : ie(A),
                      children: [
                        V && /* @__PURE__ */ r(dt, { binding: V }),
                        " ",
                        /* @__PURE__ */ r("span", { className: "dq-bar-label", children: A.label })
                      ]
                    },
                    A.id
                  );
                }),
                I === L.length - 1 && /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-bar-tile dq-bar-find",
                    "aria-label": ne > 0 ? `Find action, ${ne} more` : "Find action",
                    "aria-keyshortcuts": w.find,
                    disabled: b,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ r(dt, { binding: w.find, hidden: !0 }),
                      /* @__PURE__ */ r(ca, { "aria-hidden": "true" }),
                      /* @__PURE__ */ r("span", { className: "dq-bar-label", children: ne > 0 ? `${ne} more` : "Find action" })
                    ]
                  }
                )
              ] }, I)),
              !e.length && /* @__PURE__ */ r("p", { className: "dq-bar-empty", children: "This review has no actions." })
            ]
          }
        ),
        G && /* @__PURE__ */ r("p", { className: "dq-bar-hints", children: G }),
        b ? /* @__PURE__ */ l("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ r(Lr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ r(
          cu,
          {
            actions: e,
            keyMap: N,
            preview: F,
            names: R,
            tagGroups: t,
            trees: n,
            showKey: !q
          }
        ),
        d && /* @__PURE__ */ r("div", { className: "dq-bar-notices", children: d }),
        /* @__PURE__ */ r("div", { hidden: !0, children: Z.map((S) => /* @__PURE__ */ r("span", { id: `${y}-effect-${S}`, children: ae(e[S]) }, e[S].id)) }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: g })
      ]
    }
  );
}
function su(e, t, n) {
  const [a, i] = C(!1);
  return kt(() => {
    var d;
    const o = e.current;
    if (!o || !n || typeof ResizeObserver > "u") return;
    const s = o.querySelector(".dq-bar-summary"), c = () => {
      const g = getComputedStyle(o), m = parseFloat(g.columnGap) || 0, b = o.clientWidth - (parseFloat(g.paddingLeft) || 0) - (parseFloat(g.paddingRight) || 0), w = [...o.querySelectorAll(".dq-bar-line")].map(
        (Z) => [...Z.children].map((ne) => ne.offsetWidth)
      ), N = o.querySelector(".dq-bar-line"), q = N && parseFloat(getComputedStyle(N).columnGap) || 0, y = o.querySelector(".dq-bar-hints"), R = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (y ? y.offsetWidth + m : 0) + 1 + // the divider
      2 * m, F = (Z) => w.map((ne) => {
        let ae = 1, ie = 0;
        for (const G of ne)
          ie > 0 && ie + q + G > Z ? (ae += 1, ie = G) : ie += (ie > 0 ? q : 0) + G;
        return ae;
      }), _ = (Z) => Math.max(1, Z.reduce((ne, ae) => ne + ae, 0)), B = F(b), L = _(F(b - R));
      i(
        1 + _(B) < L || 1 + _(B) === L && B.every((Z) => Z === 1)
      );
    }, u = new ResizeObserver(c);
    u.observe(o);
    for (const g of o.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
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
function cu({
  actions: e,
  keyMap: t,
  preview: n,
  names: a,
  tagGroups: i,
  trees: o,
  showKey: s
}) {
  const c = co(n), u = c ? e.indexOf(c) : -1;
  if (!c || u < 0) return null;
  const p = t.keys[u];
  return /* @__PURE__ */ l("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    p && s && /* @__PURE__ */ r(dt, { binding: p }),
    /* @__PURE__ */ r("strong", { children: c.label }),
    Nr(c, a, i, o).map((d, g) => /* @__PURE__ */ r("span", { "data-effect-tone": d.tone, children: d.text }, g))
  ] });
}
const Vo = 1e3;
async function lu(e, t, n) {
  const a = await ue(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
  for (let u = 1; ; u++) {
    const p = await ue(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          Pn({
            findFilter: {
              page: u,
              perPage: Vo,
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
    for (const d of p.items) i.set(d.id, d);
    if (u * Vo >= p.totalCount) break;
    if (!p.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], s = Ue(e), c = Te(e) ? await uu(
    s,
    o.map((u) => u.id),
    n
  ) : o.map((u) => (s === "audio" ? u.audioCount : u.videoCount) ?? 0);
  return {
    parent: { id: t, name: a.name },
    children: o.map((u, p) => ({ id: u.id, name: u.name, uses: c[p] })).sort(
      (u, p) => p.uses - u.uses || u.name.localeCompare(p.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function du(e) {
  return JSON.stringify(
    Pn({
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
async function uu(e, t, n) {
  const a = new Array(t.length).fill(0), i = new AbortController(), o = () => i.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && o(), n == null || n.addEventListener("abort", o, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !i.signal.aborted; ) {
            const c = s++;
            a[c] = (await ue(
              `/api/${Xn(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: du(t[c])
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
  return i.signal.throwIfAborted(), a;
}
function fu(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((a) => t.has(a.id) ? !1 : (t.add(a.id), !0))
  }));
}
function hu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of n.children)
      t.set(a.id, [...t.get(a.id) ?? [], n.parent.id]);
  return t;
}
function pu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of Yn(n))
      t.set(a, [...t.get(a) ?? [], n]);
  return t;
}
function mu(e, t, n) {
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
function gu(e, t) {
  var a;
  const n = Nt(e);
  return ((a = wr(t).find((i) => i.key === n)) == null ? void 0 : a.name) ?? e.trim();
}
const bu = (e) => e instanceof Error ? e.message : "Request failed.";
function wu({
  id: e,
  review: t,
  disabled: n,
  onAdd: a,
  onCancel: i
}) {
  const [o, s] = C([]), [c, u] = C({}), [p, d] = C({}), [g, m] = C({}), b = $(/* @__PURE__ */ new Map());
  Q(
    () => () => {
      for (const S of b.current.values()) S.abort();
    },
    []
  );
  const w = En(Ue(t)), N = Te(t), q = N ? "performer" : w.one;
  function y(S) {
    var Y;
    (Y = b.current.get(S)) == null || Y.abort();
    const I = new AbortController();
    b.current.set(S, I), u((A) => ({ ...A, [S]: { status: "loading" } })), lu(t, S, I.signal).then(
      (A) => {
        I.signal.aborted || u((V) => ({
          ...V,
          [S]: { status: "ready", group: A }
        }));
      },
      (A) => {
        I.signal.aborted || u((V) => ({
          ...V,
          [S]: { status: "failed", message: bu(A) }
        }));
      }
    );
  }
  function R(S) {
    var z;
    const I = o.filter((K) => !S.includes(K));
    for (const K of I)
      (z = b.current.get(K)) == null || z.abort(), b.current.delete(K);
    const Y = (K) => {
      const T = c[K];
      return (T == null ? void 0 : T.status) === "ready" ? T.group.children.map((W) => W.id) : [];
    }, A = new Set(S.flatMap(Y)), V = I.flatMap(Y).filter((K) => !A.has(K));
    d(
      (K) => Object.fromEntries(
        Object.entries(K).filter(([T]) => !V.includes(Number(T)))
      )
    ), m(
      (K) => Object.fromEntries(
        Object.entries(K).filter(([T]) => S.includes(Number(T)))
      )
    ), u(
      (K) => Object.fromEntries(
        Object.entries(K).filter(([T]) => S.includes(Number(T)))
      )
    ), s(S);
    for (const K of S) o.includes(K) || y(K);
  }
  const F = o.flatMap((S) => {
    const I = c[S];
    return (I == null ? void 0 : I.status) === "ready" ? [I.group] : [];
  }), _ = F.length === o.length, B = o.some(
    (S) => {
      var I;
      return (((I = c[S]) == null ? void 0 : I.status) ?? "loading") === "loading";
    }
  ), L = new Map(
    fu(F).map((S) => [S.parent.id, S])
  ), Z = hu(F), ne = new Map(F.map((S) => [S.parent.id, S.parent.name])), ae = pu(t.actions), ie = (S) => p[S] ?? !ae.has(S), G = _ ? [...L.values()].flatMap((S) => {
    const I = gu(S.parent.name, t.actions);
    return S.children.filter((Y) => ie(Y.id)).map((Y) => ({ child: Y, answerGroup: I }));
  }) : [], D = (S, I) => d((Y) => ({
    ...Y,
    ...Object.fromEntries(S.children.map((A) => [A.id, I]))
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
        values: o,
        onChange: R,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    o.map((S) => {
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
              onClick: () => y(S),
              children: "Retry"
            }
          )
        ] }, S);
      const Y = L.get(S);
      if (!Y) return null;
      const A = Y.parent.name;
      return /* @__PURE__ */ l("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ r("legend", { children: A }),
        I.group.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ l(ge, { children: [
          /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: g[S] ?? !1,
                disabled: n,
                onChange: (V) => m((z) => ({
                  ...z,
                  [S]: V.target.checked
                }))
              }
            ),
            "Only one per ",
            q,
            ": each action removes every other tag in the ",
            A,
            " tree"
          ] }),
          Y.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ l(ge, { children: [
            /* @__PURE__ */ l("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${A}`,
                  onClick: () => D(Y, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${A}`,
                  onClick: () => D(Y, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "dq-child-tags", children: Y.children.map((V) => {
              const z = ae.get(V.id) ?? [], K = (Z.get(V.id) ?? []).filter((T) => T !== S).map((T) => `“${ne.get(T)}”`);
              return /* @__PURE__ */ l("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: ie(V.id),
                    disabled: n,
                    onChange: (T) => d((W) => ({
                      ...W,
                      [V.id]: T.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ l("span", { children: [
                  V.name,
                  " ",
                  /* @__PURE__ */ l("small", { children: [
                    V.uses.toLocaleString(),
                    " ",
                    V.uses === 1 ? w.one : w.many
                  ] }),
                  K.length > 0 && /* @__PURE__ */ l("small", { children: [
                    " · Also under ",
                    K.join(", ")
                  ] }),
                  z.length > 0 && /* @__PURE__ */ l("small", { children: [
                    " ",
                    "· Already in “",
                    z[0].label || "New action",
                    "”",
                    z.length > 1 ? ` and ${z.length - 1} more` : ""
                  ] })
                ] })
              ] }, V.id);
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
          disabled: n || !G.length,
          onClick: () => a(
            G.map(
              ({ child: S, answerGroup: I }) => mu(
                S,
                (Z.get(S.id) ?? []).filter(
                  (Y) => g[Y]
                ),
                I
              )
            )
          ),
          children: G.length ? `Add ${G.length} action${G.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-sr-only", children: B ? "Loading child tags…" : "" })
    ] })
  ] });
}
function yu(e, t, n, a) {
  const i = Nt(n), o = [{ kind: "none", name: "", selected: !i }];
  if (a === null) {
    for (const c of e)
      o.push({ kind: "group", name: c, selected: Nt(c) === i });
    return o;
  }
  const s = Nt(a);
  for (const c of t)
    Nt(c).includes(s) && o.push({ kind: "group", name: c, selected: Nt(c) === i });
  return s && !t.some((c) => Nt(c) === s) && o.push({ kind: "new", name: a.trim(), selected: s === i }), o;
}
function vu(e) {
  return e.kind === "group" ? `group:${Nt(e.name)}` : e.kind;
}
function Nu(e) {
  const { group: t, ...n } = e;
  return n;
}
const $a = 4, zo = 240;
function qu(e) {
  const t = [];
  for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
    const a = getComputedStyle(n);
    (a.overflowX !== "visible" || a.overflowY !== "visible") && t.push(n);
  }
  return t;
}
function Su(e, t, n, a) {
  for (const o of a) {
    const s = o.getBoundingClientRect();
    if (n.bottom < s.top || n.top > s.bottom || n.right < s.left || n.left > s.right)
      return !1;
  }
  if (typeof document.elementFromPoint != "function") return !0;
  const i = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
  return !i || e.contains(i) || t.contains(i);
}
function ku({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: a,
  onChange: i
}) {
  const o = at(), s = at(), c = at(), u = $(null), p = $(null), d = $(null), g = $(null), m = $([]), b = $(!1), [w, N] = C(!1), [q, y] = C(null), [R, F] = C(null), _ = e.group ?? "", B = he(
    () => yu(t, n, _, q),
    [t, n, _, q]
  ), L = B.map(vu), Z = R === null ? -1 : L.indexOf(R), ne = (A) => `${s}-option-${A}`, ae = (A) => i(A ? { ...e, group: A } : Nu(e)), ie = () => {
    var V;
    const A = ((V = d.current) == null ? void 0 : V.value) ?? _;
    A.trim() !== A && ae(A.trim());
  };
  function G(A) {
    y(null), F(A), N(!0);
  }
  function D() {
    N(!1), y(null), F(null);
  }
  function S(A) {
    A.kind === "group" && A.selected && q === null || ae(A.kind === "none" ? "" : A.name), D();
  }
  function I() {
    const A = p.current, V = g.current;
    if (!A || !V) return;
    const z = A.getBoundingClientRect(), K = window.visualViewport, T = (K == null ? void 0 : K.offsetTop) ?? 0, H = (K ? K.offsetTop + K.height : window.innerHeight) - z.bottom - $a, oe = z.top - T - $a, Ie = Math.min(V.scrollHeight, zo), Ge = H < Ie && oe > H;
    V.style.left = `${z.left}px`, V.style.width = `${z.width}px`, V.style.top = `${Ge ? z.top - $a : z.bottom + $a}px`, V.style.transform = Ge ? "translateY(-100%)" : "", V.style.maxHeight = `${Math.max(0, Math.min(zo, Ge ? oe : H))}px`, Su(A, V, z, m.current) || D();
  }
  kt(() => {
    w && p.current && (m.current = qu(p.current));
  }, [w]), kt(() => {
    w && I();
  }), Q(() => {
    if (!w) return;
    const A = () => I(), V = (K) => {
      var W, H;
      const T = K.target;
      T && ((W = u.current) != null && W.contains(T) || (H = g.current) != null && H.contains(T)) || D();
    }, z = window.visualViewport;
    return window.addEventListener("scroll", A, !0), window.addEventListener("resize", A), z == null || z.addEventListener("resize", A), z == null || z.addEventListener("scroll", A), document.addEventListener("pointerdown", V, !0), () => {
      window.removeEventListener("scroll", A, !0), window.removeEventListener("resize", A), z == null || z.removeEventListener("resize", A), z == null || z.removeEventListener("scroll", A), document.removeEventListener("pointerdown", V, !0);
    };
  }, [w]), Q(() => {
    var A, V, z;
    Z >= 0 && ((z = (V = (A = g.current) == null ? void 0 : A.children[Z]) == null ? void 0 : V.scrollIntoView) == null || z.call(V, { block: "nearest" }));
  }, [Z]);
  function Y(A) {
    if (A.nativeEvent.isComposing || A.keyCode === 229) return;
    const V = A.key === "ArrowDown" || A.key === "ArrowUp";
    if (V && !w) {
      if (A.altKey && A.key === "ArrowUp") return;
      A.preventDefault(), G(A.altKey ? null : Nt(_) ? `group:${Nt(_)}` : "none");
      return;
    }
    if (w)
      if (V) {
        if (A.preventDefault(), A.altKey) {
          A.key === "ArrowUp" && D();
          return;
        }
        const z = A.key === "ArrowDown" ? 1 : -1, K = q !== null && Nt(q) && L.length > 1 ? 1 : 0, T = Z < 0 ? z > 0 ? K : L.length - 1 : (Z + z + L.length) % L.length;
        F(L[T]);
      } else A.key === "Enter" ? (A.preventDefault(), Z >= 0 ? S(B[Z]) : (ie(), D())) : A.key === "Escape" ? (A.preventDefault(), A.stopPropagation(), D()) : A.key === "Tab" && D();
  }
  return /* @__PURE__ */ l("div", { children: [
    /* @__PURE__ */ l("div", { ref: u, className: "dq-action-field", children: [
      /* @__PURE__ */ r(
        "label",
        {
          className: "dq-action-field-name",
          htmlFor: o,
          onMouseDown: (A) => {
            w && A.preventDefault();
          },
          children: "Group"
        }
      ),
      /* @__PURE__ */ l("div", { ref: p, className: "dq-combobox", children: [
        /* @__PURE__ */ r(
          "input",
          {
            ref: d,
            id: o,
            className: "dq-input dq-action-group-input",
            role: "combobox",
            "aria-expanded": w,
            "aria-controls": w ? s : void 0,
            "aria-autocomplete": "list",
            "aria-activedescendant": w && Z >= 0 ? ne(Z) : void 0,
            "aria-describedby": c,
            placeholder: "No group",
            autoComplete: "off",
            spellCheck: !1,
            value: _,
            onChange: (A) => {
              ae(A.target.value), y(A.target.value), F(null), N(!0);
            },
            onClick: () => {
              w || G(null);
            },
            onKeyDown: Y,
            onBlur: () => {
              D(), ie();
            }
          }
        ),
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            className: "dq-combobox-toggle",
            tabIndex: -1,
            "aria-label": "Show groups",
            "aria-expanded": w,
            "aria-controls": w ? s : void 0,
            onPointerDown: (A) => {
              b.current = A.pointerType === "touch";
            },
            onMouseDown: (A) => A.preventDefault(),
            onClick: () => {
              var V;
              const A = b.current;
              b.current = !1, w ? D() : G(null), (!A || document.activeElement === d.current) && ((V = d.current) == null || V.focus());
            },
            children: /* @__PURE__ */ r(Ui, { "aria-hidden": "true" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ r("p", { className: "dq-actions-hint dq-action-field-help", id: c, children: a ? "A group is one question with one answer per item; when a chosen performer's items hold two different answers of a group, Existing answers marks it Mixed." : "A group is one question with one answer per item." }),
    w && Jl(
      /* @__PURE__ */ r(
        "ul",
        {
          ref: g,
          id: s,
          role: "listbox",
          "aria-label": "Groups",
          className: "dq-combobox-list",
          onMouseDown: (A) => A.preventDefault(),
          children: B.map((A, V) => /* @__PURE__ */ l(
            "li",
            {
              id: ne(V),
              role: "option",
              "aria-selected": A.selected,
              className: "dq-combobox-option",
              "data-kind": A.kind,
              "data-active": V === Z || void 0,
              onMouseMove: () => {
                V !== Z && F(L[V]);
              },
              onClick: () => S(A),
              children: [
                A.kind === "new" && /* @__PURE__ */ r(Ba, { "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-combobox-option-name", children: A.kind === "none" ? "No group" : A.kind === "new" ? `New group “${A.name}”` : A.name }),
                A.selected && /* @__PURE__ */ r(la, { className: "dq-combobox-check", "aria-hidden": "true" })
              ]
            },
            L[V]
          ))
        }
      ),
      document.body
    )
  ] });
}
const Eu = ["n", "m"], Bn = [
  ...ia,
  ["auto", Wn]
];
function Ua(e) {
  return e.toLocaleUpperCase();
}
function mc(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : Wi(e[n]);
}
function Cu({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i
}) {
  const [o, s] = C(!1), c = $(null), u = n.keys[t], p = mc(e, n, t), d = mr(p), g = n.duplicatePins.has(t) ? ` (${Ua(e[t].shortcut ?? "")} is pinned twice)` : "", m = u ? `${Ua(u)}, ${d ? "pinned" : "Auto"}${g}` : p === Wn ? "no key, Find action only" : `no key: Auto found no free key${g}`, b = () => {
    var w;
    s(!1), (w = c.current) == null || w.focus();
  };
  return /* @__PURE__ */ l(ge, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        ref: c,
        type: "button",
        className: "dq-key-button",
        "aria-label": `Key for ${a}: ${m}`,
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        title: "Choose the key",
        onClick: () => s(!o),
        children: [
          u ? /* @__PURE__ */ r(dt, { binding: u }) : /* @__PURE__ */ r("span", { className: "dq-key dq-key-none", children: "·" }),
          d && /* @__PURE__ */ r(Ns, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ r(
      Au,
      {
        actions: e,
        index: t,
        keyMap: n,
        name: a,
        onChoose: (w) => {
          i(w), b();
        },
        onClose: b
      }
    )
  ] });
}
function Au({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i,
  onClose: o
}) {
  const s = $(null), c = n.keys[t], u = mc(e, n, t), [p, d] = C(c || "q"), g = (N) => {
    var q;
    return ((q = s.current) == null ? void 0 : q.querySelector(`[data-choice="${N}"]`)) ?? null;
  };
  kt(() => {
    var N, q, y;
    (N = g(c || u)) == null || N.focus(), (y = (q = s.current) == null ? void 0 : q.scrollIntoView) == null || y.call(q, { block: "nearest" });
  }, []);
  function m(N) {
    var q;
    mr(N) && d(N), (q = g(N)) == null || q.focus();
  }
  function b(N) {
    var L, Z, ne;
    if (N.key === "Escape") {
      N.preventDefault(), N.stopPropagation(), o();
      return;
    }
    if (N.key === "Tab") {
      const ae = [...((L = s.current) == null ? void 0 : L.querySelectorAll("button[tabindex='0']")) ?? []], ie = ae.indexOf(document.activeElement);
      N.preventDefault(), (Z = ae[(ie + (N.shiftKey ? -1 : 1) + ae.length) % ae.length]) == null || Z.focus();
      return;
    }
    const q = (ne = N.target.dataset) == null ? void 0 : ne.choice, y = q ? Bn.findIndex((ae) => ae.includes(q)) : -1;
    if (!q || y < 0) return;
    const R = Bn[y].indexOf(q), F = (ae) => ae == null ? void 0 : ae[Math.min(R, ae.length - 1)], _ = {
      ArrowLeft: Bn[y][R - 1],
      ArrowRight: Bn[y][R + 1],
      ArrowUp: F(Bn[y - 1]),
      ArrowDown: F(Bn[y + 1]),
      Home: Bn[y][0],
      End: Bn[y].at(-1)
    };
    if (!Object.hasOwn(_, N.key)) return;
    N.preventDefault();
    const B = _[N.key];
    B && m(B);
  }
  const w = (N) => {
    const q = mr(N) ? n.actionOn.get(N) : void 0;
    return q === void 0 ? null : {
      own: q === t,
      label: e[q].label.trim() || "New action",
      pinned: Wi(e[q]) === N
    };
  };
  return /* @__PURE__ */ l(ge, { children: [
    /* @__PURE__ */ r(
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
        ref: s,
        role: "dialog",
        "aria-label": `Key for ${a}`,
        className: "dq-key-picker",
        onKeyDown: b,
        onMouseDown: (N) => N.preventDefault(),
        children: [
          /* @__PURE__ */ l("p", { className: "dq-key-picker-title", children: [
            "Key for ",
            /* @__PURE__ */ r("strong", { children: a })
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: ia.map((N, q) => /* @__PURE__ */ l("div", { className: "dq-key-picker-row", "data-indent": q, children: [
            N.map((y) => {
              const R = w(y), F = R ? `${R.own ? "this action" : R.label}, ${R.pinned ? "pinned" : "Auto"}` : "free";
              return /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  className: `dq-key-choice${R ? "" : " dq-key-choice-free"}${R != null && R.own ? " dq-key-choice-own" : ""}`,
                  "data-choice": y,
                  tabIndex: y === p ? 0 : -1,
                  "aria-label": `${Ua(y)}: ${F}`,
                  "aria-pressed": !!(R != null && R.own && R.pinned),
                  title: R ? `${R.label} (${R.pinned ? "pinned" : "Auto"})` : void 0,
                  onFocus: () => d(y),
                  onClick: () => i(y),
                  children: [
                    /* @__PURE__ */ l("span", { className: "dq-key-choice-head", children: [
                      /* @__PURE__ */ r(dt, { binding: y }),
                      (R == null ? void 0 : R.pinned) && /* @__PURE__ */ r(Ns, { "aria-hidden": "true" })
                    ] }),
                    R && /* @__PURE__ */ r("span", { className: "dq-key-choice-label", children: R.label })
                  ]
                },
                y
              );
            }),
            q === ia.length - 1 && Eu.map((y) => (
              // Unavailable, yet not disabled: a browser gives a disabled button no press for
              // the panel to keep, and moves focus out of the picker. This one chooses nothing
              // and is never focused (the arrow keys and Tab pass it by).
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-key-choice dq-key-choice-free",
                  "aria-label": `${Ua(y)}: not available, it steps through the grid preview`,
                  title: "Steps through the grid preview",
                  "aria-disabled": "true",
                  tabIndex: -1,
                  children: /* @__PURE__ */ r("span", { className: "dq-key-choice-head", children: /* @__PURE__ */ r(dt, { binding: y }) })
                },
                y
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
                "aria-pressed": u === "auto",
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
                "data-choice": Wn,
                tabIndex: 0,
                "aria-pressed": u === Wn,
                onClick: () => i(Wn),
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
const Tu = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Iu(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function Ru(e, t) {
  if (xn(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (Hi(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function gc(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function $u(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function Ou({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: a,
  saving: i,
  expandedId: o,
  onExpand: s,
  reveal: c
}) {
  const u = je(e), p = u !== "tag", d = e.actions, g = _r(d), m = jr(he(() => Wa(d), [d])), b = he(
    () => p ? wr(d).map((j) => j.name) : [],
    [p, d]
  ), w = d.findIndex((j) => j.id === o), N = he(
    () => p && w >= 0 ? wr(
      d.filter((j, be) => be !== w)
    ).map((j) => j.name) : [],
    [p, d, w]
  ), q = p && e.stayUntilGroupsAnswered === !0, y = he(
    () => new Set(
      q ? Ld(d).map((j) => j.key) : []
    ),
    [q, d]
  ), [R, F] = C(""), [_, B] = C(!1), [L, Z] = C(
    null
  ), ne = at(), ae = `${ne}-from-tags`, ie = $(null), G = $(null), D = $(null), S = $(null), I = $(/* @__PURE__ */ new WeakMap()), Y = (j) => {
    let be = I.current.get(j);
    return be || (be = crypto.randomUUID(), I.current.set(j, be)), be;
  }, A = R.trim().toLocaleLowerCase(), V = A ? d.filter((j) => j.label.toLocaleLowerCase().includes(A)) : d, z = (j) => t({ ...e, actions: j }), K = (j, be) => z(d.map(($e, pe) => pe === j ? be : $e));
  function T(j) {
    var be;
    return [...((be = D.current) == null ? void 0 : be.querySelectorAll("[data-action-id]")) ?? []].find(
      ($e) => $e.dataset.actionId === j
    );
  }
  function W(j, be) {
    const $e = T(j), pe = $e == null ? void 0 : $e.querySelector(
      be === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return pe == null || pe.focus(), !!pe;
  }
  kt(() => {
    var be;
    const j = S.current;
    j && (S.current = null, (j === "add" || !W(j.id, j.part)) && ((be = G.current) == null || be.focus()));
  }), Q(() => {
    !c || !o || (V.some((j) => j.id === o) ? W(o, "label") : (F(""), S.current = { id: o, part: "label" }));
  }, [c]);
  function H() {
    const j = $u(u);
    F(""), z([...d, j]), s(j.id), S.current = { id: j.id, part: "label" };
  }
  function oe(j) {
    const be = d[j], { shortcut: $e, ...pe } = structuredClone(be), Oe = {
      ...pe,
      ...$e === Wn ? { shortcut: $e } : {},
      id: crypto.randomUUID(),
      label: `${be.label} copy`
    };
    z([...d.slice(0, j + 1), Oe, ...d.slice(j + 1)]), s(Oe.id), S.current = { id: Oe.id, part: "label" };
  }
  function Ie(j) {
    const be = d[j], $e = V.indexOf(be), pe = V[$e + 1] ?? V[$e - 1];
    z(d.filter((Oe, Xe) => Xe !== j)), o === be.id && s(null), S.current = pe ? { id: pe.id, part: "toggle" } : "add";
  }
  function Ge() {
    B(!1), requestAnimationFrame(() => {
      var j;
      return (j = ie.current) == null ? void 0 : j.focus();
    });
  }
  return /* @__PURE__ */ l("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ l("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ l("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ l(
          "button",
          {
            ref: G,
            type: "button",
            className: "dq-header-button",
            onClick: H,
            children: [
              /* @__PURE__ */ r(Ba, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        p && /* @__PURE__ */ r(
          "button",
          {
            ref: ie,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": _,
            "aria-controls": _ ? ae : void 0,
            onClick: () => {
              Z(null), B(!_);
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
              value: R,
              onChange: (j) => F(j.target.value),
              onKeyDown: (j) => {
                j.key === "Escape" && R && (j.preventDefault(), j.stopPropagation(), F(""));
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
              checked: q,
              "aria-describedby": `${ne}-groups-note`,
              onChange: (j) => t({
                ...e,
                stayUntilGroupsAnswered: j.target.checked ? !0 : void 0
              })
            }
          ),
          "Stay until every group is answered"
        ] }),
        /* @__PURE__ */ r("p", { className: "dq-actions-hint", id: `${ne}-groups-note`, children: q && !b.length ? "No action has a group yet: give the actions of each question the same group." : "Single-item view: a plain action moves on once every group has an answer." })
      ] }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-actions-status", children: (L == null ? void 0 : L.actions) === d ? `Added ${L.count} action${L.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    p && _ && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here.
    /* @__PURE__ */ r(
      "div",
      {
        onKeyDown: (j) => {
          j.key !== "Escape" || j.defaultPrevented || (j.preventDefault(), j.stopPropagation(), Ge());
        },
        children: /* @__PURE__ */ r(
          wu,
          {
            id: ae,
            review: e,
            disabled: i,
            onAdd: (j) => {
              const be = [...d, ...j];
              z(be), Z({ actions: be, count: j.length }), Ge();
            },
            onCancel: Ge
          }
        )
      }
    ),
    /* @__PURE__ */ r("div", { ref: D, children: V.length > 0 && /* @__PURE__ */ r(
      gs,
      {
        items: V,
        getKey: (j) => j.id,
        disabled: i || !!A,
        className: "dq-action-list",
        onReorder: (j) => z(j),
        renderItem: (j, { dragHandleProps: be, isOver: $e }) => {
          const pe = d.indexOf(j), Oe = o === j.id;
          return /* @__PURE__ */ r(
            Mu,
            {
              action: j,
              entityType: u,
              keyButton: /* @__PURE__ */ r(
                Cu,
                {
                  actions: d,
                  index: pe,
                  keyMap: g,
                  name: j.label.trim() || "New action",
                  onChoose: (Xe) => z(Ql(d, pe, Xe))
                }
              ),
              takenPin: g.duplicatePins.has(pe) ? j.shortcut : void 0,
              groupUnanswerable: "steps" in j && y.has(Nt(j.group)),
              effect: Nr(j, m, n, a),
              open: Oe,
              detailId: `${ne}-detail-${j.id}`,
              dragHandleProps: be,
              isOver: $e,
              reorderDisabled: i || !!A,
              onToggle: () => s(Oe ? null : j.id),
              onDuplicate: () => oe(pe),
              onDelete: () => Ie(pe),
              children: "steps" in j ? /* @__PURE__ */ r(
                Fu,
                {
                  action: j,
                  groupNames: b,
                  otherGroupNames: N,
                  occurrence: Te(e),
                  saving: i,
                  stepKey: Y,
                  rememberStepKey: (Xe, ke) => I.current.set(Xe, Y(ke)),
                  onChange: (Xe) => K(pe, Xe)
                }
              ) : /* @__PURE__ */ r(
                Pu,
                {
                  action: j,
                  tagGroups: n,
                  onChange: (Xe) => K(pe, Xe)
                }
              )
            }
          );
        }
      }
    ) }),
    d.length ? !V.length && /* @__PURE__ */ l("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      R.trim(),
      "”."
    ] }) : /* @__PURE__ */ r("p", { className: "dq-actions-empty", children: p ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function Mu({
  action: e,
  entityType: t,
  keyButton: n,
  takenPin: a,
  groupUnanswerable: i = !1,
  effect: o,
  open: s,
  detailId: c,
  dragHandleProps: u,
  isOver: p,
  reorderDisabled: d,
  onToggle: g,
  onDuplicate: m,
  onDelete: b,
  children: w
}) {
  const N = e.label.trim() || "New action", q = Ru(e, t), y = "steps" in e && Nt(e.group) ? e.group.trim() : "";
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
              style: gc(u.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${N}`,
              title: d ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: d,
              children: /* @__PURE__ */ r(qs, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ l("div", { className: "dq-action-row-summary", onClick: g, children: [
            /* @__PURE__ */ r("span", { className: "dq-action-row-label", title: N, children: N }),
            y && /* @__PURE__ */ l("span", { className: "dq-action-row-group", title: `Group: ${y}`, children: [
              /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Group: " }),
              y
            ] }),
            !s && /* @__PURE__ */ r("span", { className: "dq-action-row-effect", children: o.map((R, F) => /* @__PURE__ */ r("span", { "data-effect-tone": R.tone, children: R.text }, F)) }),
            q && /* @__PURE__ */ l("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ r(On, { "aria-hidden": "true" }),
              q
            ] }),
            a && /* @__PURE__ */ l(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${a.toLocaleUpperCase()} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ r(On, { "aria-hidden": "true" }),
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
                  /* @__PURE__ */ r(On, { "aria-hidden": "true" }),
                  `${y} can't be answered`
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
              onClick: m,
              children: /* @__PURE__ */ r(Ss, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Delete ${N}`,
              title: "Delete",
              onClick: b,
              children: /* @__PURE__ */ r(Gi, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small dq-action-toggle",
              "aria-label": `${s ? "Collapse" : "Expand"} ${N}`,
              "aria-expanded": s,
              "aria-controls": s ? c : void 0,
              onClick: g,
              children: /* @__PURE__ */ r(Ui, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ r("div", { id: c, className: "dq-action-detail", children: w })
      ]
    }
  );
}
function bc({
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
function Fu({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: a,
  saving: i,
  stepKey: o,
  rememberStepKey: s,
  onChange: c
}) {
  const u = at(), p = $(null), d = $(null);
  kt(() => {
    var b, w;
    const m = d.current;
    m != null && (d.current = null, (w = (b = p.current) == null ? void 0 : b.querySelector(`[data-step-index="${m}"] input`)) == null || w.focus());
  });
  const g = (m) => c({ ...e, steps: m });
  return /* @__PURE__ */ l(ge, { children: [
    /* @__PURE__ */ r(bc, { action: e, onChange: (m) => c({ ...e, label: m }) }),
    /* @__PURE__ */ r(
      ku,
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
          gs,
          {
            items: e.steps,
            getKey: o,
            disabled: i,
            className: "dq-step-list",
            onReorder: g,
            renderItem: (m, { index: b, dragHandleProps: w, isOver: N }) => /* @__PURE__ */ r(
              xu,
              {
                step: m,
                index: b,
                dragHandleProps: w,
                isOver: N,
                saving: i,
                onChange: (q) => {
                  s(q, m), g(e.steps.map((y, R) => R === b ? q : y));
                },
                onRemove: () => g(e.steps.filter((q, y) => y !== b))
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
              /* @__PURE__ */ r(Ba, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function xu({
  step: e,
  index: t,
  dragHandleProps: n,
  isOver: a,
  saving: i,
  onChange: o,
  onRemove: s
}) {
  const c = t + 1;
  return /* @__PURE__ */ l(
    "div",
    {
      className: `dq-step${a ? " dq-drag-over" : ""}`,
      "data-step-tone": Iu(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            ...n,
            style: gc(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${c}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ r(qs, { "aria-hidden": "true" }),
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
            onChange: (u) => o({ ...e, mode: u.target.value }),
            children: Tu.map(({ mode: u, label: p }) => /* @__PURE__ */ r("option", { value: u, children: p }, u))
          }
        ),
        /* @__PURE__ */ r(
          Qn,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (u) => o({ ...e, tagIds: u }),
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
            onClick: s,
            children: /* @__PURE__ */ r(da, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function Pu({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const a = e.effect, i = a.mode === "SET_TAG_GROUP" ? `group:${a.tagGroupId}` : a.mode, o = a.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === a.tagGroupId);
  return /* @__PURE__ */ l(ge, { children: [
    /* @__PURE__ */ r(bc, { action: e, onChange: (s) => n({ ...e, label: s }) }),
    /* @__PURE__ */ l("label", { className: "dq-action-field", children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", children: "Effect" }),
      /* @__PURE__ */ l(
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
            /* @__PURE__ */ r("option", { value: "SKIP", children: "Skip" }),
            /* @__PURE__ */ r("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
            o && /* @__PURE__ */ r("option", { value: i, disabled: !0, children: "Unavailable tag group" }),
            t.map((s) => /* @__PURE__ */ r("option", { value: `group:${s.id}`, children: s.name }, s.id))
          ]
        }
      )
    ] })
  ] });
}
const wc = bl(!1);
function Lu({ children: e }) {
  return /* @__PURE__ */ r(wc.Provider, { value: !0, children: e });
}
function Bt({ tag: e, name: t }) {
  const n = wl(wc), a = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ r(vl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: a ?? void 0 });
}
function Du({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, a = En(Ue(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
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
        onChange: (o) => i({ tagIds: o }),
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
          onChange: (o) => i({ multiple: o.target.checked })
        }
      ),
      "Allow multiple tags, for example when something changes part-way through the ",
      a
    ] }),
    /* @__PURE__ */ r("p", { children: "Save & next performer applies the selected tags and advances. Save choices stays on the performer. Skip only moves the cursor; eligibility comes from the filters." })
  ] });
}
function _u({
  review: e,
  onChange: t
}) {
  const n = En(Ue(e)).many, a = e.occurrence, i = Rs(a), o = ["any", "isNull"].includes(a.condition) ? [] : a.conditionTagIds, s = pa([
    ...i.flatMap((d) => [d.tagId, ...d.categoryTagId ? [d.categoryTagId] : []]),
    ...o
  ]), c = (d) => {
    var g;
    return ((g = s[d]) == null ? void 0 : g.name) ?? (s[d] === null ? `Unavailable tag ${d}` : `Tag ${d}`);
  }, u = (d) => t({ ...e, occurrence: Wl(a, d) }), p = (d, g) => u(
    i.map(
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
    i.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-flag-pairs", "aria-label": "Performer flags", children: i.map((d, g) => {
      const m = c(d.tagId), b = i.filter(
        (q, y) => y !== g && q.tagId === d.tagId
      ), w = (q) => b.some((y) => y.categoryTagId === q), N = `${d.tagId}#${i.slice(0, g).filter((q) => q.tagId === d.tagId).length}`;
      return /* @__PURE__ */ l("li", { className: "dq-flag-pair", children: [
        /* @__PURE__ */ l("span", { className: "dq-flag-pair-tag", children: [
          /* @__PURE__ */ r(Fn, { "aria-hidden": "true" }),
          /* @__PURE__ */ r(Bt, { tag: s[d.tagId], name: m })
        ] }),
        /* @__PURE__ */ l("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ r("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ r(
            Io,
            {
              entityType: "tag",
              value: d.categoryTagId,
              onChange: (q) => p(g, q),
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
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            className: "dq-icon-button",
            "aria-label": `Remove flag ${m}`,
            title: "Remove flag",
            onClick: () => u(i.filter((q, y) => y !== g)),
            children: /* @__PURE__ */ r(Gi, { "aria-hidden": "true" })
          }
        ),
        o.length > 0 && /* @__PURE__ */ l(
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
                  disabled: w(void 0),
                  onClick: () => p(g, void 0),
                  children: "Whole review"
                }
              ),
              o.map((q) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": d.categoryTagId === q,
                  disabled: w(q),
                  onClick: () => p(g, q),
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
      Io,
      {
        entityType: "tag",
        value: void 0,
        onChange: (d) => {
          d !== void 0 && u([...i, { tagId: d }]);
        },
        placeholder: "Search performer flag tags...",
        allowCreate: !1,
        inputClassName: "dq-input",
        inputAriaLabel: "Add a performer flag",
        excludeIds: i.flatMap((d) => d.categoryTagId === void 0 ? [d.tagId] : [])
      }
    )
  ] });
}
const yc = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, vc = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, ju = {
  video: Va,
  audio: Cs,
  tag: Es,
  performerOccurrence: ks,
  audioPerformerOccurrence: Ol
};
function Nc({ entityType: e }) {
  const t = ju[e];
  return /* @__PURE__ */ r(t, { role: "img", "aria-label": yc[e] });
}
const Uu = 2e6;
function qc(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), a = document.createElement("a");
  a.href = n, a.download = t, a.click(), URL.revokeObjectURL(n);
}
function Gu(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function lo(e) {
  qc([e], Gu(e));
}
async function Ku(e) {
  if (e.size > Uu) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return fa(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function Pr(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (a, i) => i && typeof i == "object" && !Array.isArray(i) ? Object.fromEntries(
      Object.keys(i).sort().map((o) => [o, i[o]])
    ) : i
  );
}
function Sc({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: a,
  nameRef: i,
  autoFocus: o = !1
}) {
  return /* @__PURE__ */ l(ge, { children: [
    /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ r("span", { children: "Entity type" }),
      /* @__PURE__ */ r(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: je(e),
          disabled: n,
          onChange: (s) => a == null ? void 0 : a(s.target.value),
          children: $s.map((s) => /* @__PURE__ */ r("option", { value: s, children: vc[s] }, s))
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
          autoFocus: o,
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
function Bu(e, t) {
  const n = je(e), a = ["Review"];
  return (n === "video" || n === "tag") && a.push("Appearance"), a.push("Actions"), t && a.push("Tag choices"), a;
}
function Vu({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = $(null), a = $(null), i = at(), o = at();
  return Q(() => {
    var s;
    n.current && !n.current.open && n.current.showModal(), (s = a.current) == null || s.focus();
  }, []), /* @__PURE__ */ l(
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
        /* @__PURE__ */ r("h2", { id: i, children: "Discard unsaved changes?" }),
        /* @__PURE__ */ r("p", { id: o, children: "Closing the editor leaves the review as it was last saved." }),
        /* @__PURE__ */ l("div", { className: "dq-confirm-dialog-actions", children: [
          /* @__PURE__ */ r("button", { ref: a, type: "button", className: "dq-button", onClick: e, children: "Keep editing" }),
          /* @__PURE__ */ r("button", { type: "button", className: "dq-button dq-button-danger", onClick: t, children: "Discard" })
        ] })
      ]
    }
  );
}
function kc({
  draft: e,
  onChange: t,
  direction: n,
  onDirectionChange: a,
  tagGroups: i,
  trees: o,
  saving: s,
  saveDisabled: c = !1,
  error: u,
  dirty: p,
  criteriaChanged: d = !1,
  notices: g,
  onSave: m,
  onCancel: b,
  drawerRef: w
}) {
  const [N, q] = C("Review"), [y] = C(
    () => Te(e) && e.occurrence.tagIds.length > 0
  ), [R, F] = C(""), [_, B] = C(null), [L, Z] = C(0), [ne, ae] = C(!1), ie = $(null), G = $(null), D = $(null), S = Bu(e, y), I = je(e), Y = he(() => Pr(e), [e]);
  Q(() => F(""), [Y]), Q(() => {
    var W, H;
    if (ne) return;
    const K = ie.current;
    if (ie.current = null, !K) return;
    (H = K.isConnected && !!((W = D.current) != null && W.contains(K)) && !(K instanceof HTMLButtonElement && K.disabled) ? K : D.current) == null || H.focus({ preventScroll: !0 });
  }, [ne]);
  function A() {
    if (!(s || ne)) {
      if (!p) {
        b();
        return;
      }
      ie.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, ae(!0);
    }
  }
  function V() {
    const K = { ...e, name: e.name.trim() }, T = oa(K);
    if (!T) {
      F(""), m();
      return;
    }
    if (F(T), !K.name) {
      q("Review"), requestAnimationFrame(() => {
        var H;
        return (H = G.current) == null ? void 0 : H.focus();
      });
      return;
    }
    const W = e.actions.find(
      (H) => !xn(H, I)
    );
    W && (q("Actions"), B(W.id), Z((H) => H + 1));
  }
  const z = R || u;
  return /* @__PURE__ */ l(ge, { children: [
    /* @__PURE__ */ l(
      "aside",
      {
        ref: (K) => {
          D.current = K, w && (w.current = K);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (K) => {
          K.key !== "Escape" || K.defaultPrevented || s || K.nativeEvent.isComposing || K.keyCode === 229 || (K.preventDefault(), K.stopPropagation(), A());
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
                onClick: A,
                children: /* @__PURE__ */ r(da, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ r(
            Nl,
            {
              tabs: S.map((K) => ({
                key: K,
                label: K,
                count: K === "Actions" ? e.actions.length : void 0
              })),
              activeTab: N,
              onTabChange: (K) => q(K)
            }
          ) }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-body", children: /* @__PURE__ */ l("fieldset", { className: "dq-drawer-fields", disabled: s, children: [
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
                    Sc,
                    {
                      review: e,
                      onChange: t,
                      entityTypeLocked: !0,
                      nameRef: G,
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
                        onChange: (K) => a(K.target.value),
                        children: [
                          /* @__PURE__ */ r("option", { value: "end", children: "Start from the end" }),
                          /* @__PURE__ */ r("option", { value: "beginning", children: "Start from the beginning" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ r("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
                  ] }),
                  Te(e) && /* @__PURE__ */ r(_u, { review: e, onChange: t }),
                  /* @__PURE__ */ r("div", { children: /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => lo(e),
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
                children: /* @__PURE__ */ r(zu, { review: e, onChange: t })
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
                  Ou,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: i,
                    trees: o,
                    saving: s,
                    expandedId: _,
                    onExpand: B,
                    reveal: L
                  }
                )
              }
            ),
            y && Te(e) && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ r(Du, { review: e, onChange: t })
              }
            )
          ] }) }),
          (z || g) && /* @__PURE__ */ l("div", { className: "dq-drawer-notices", children: [
            g,
            z && /* @__PURE__ */ l("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ r(On, { "aria-hidden": "true" }),
              z
            ] })
          ] }),
          /* @__PURE__ */ l("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ r("p", { className: "dq-drawer-dirty", children: p ? d ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: s, onClick: A, children: "Cancel" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button primary",
                "aria-busy": s || void 0,
                "aria-disabled": s || void 0,
                disabled: !s && c,
                onClick: () => {
                  s || V();
                },
                children: "Save review"
              }
            )
          ] })
        ]
      }
    ),
    ne && /* @__PURE__ */ r(
      Vu,
      {
        onKeepEditing: () => ae(!1),
        onDiscard: () => {
          ie.current = null, ae(!1), b();
        }
      }
    )
  ] });
}
function zu({
  review: e,
  onChange: t
}) {
  const n = at(), a = e.view, i = (d) => t({ ...e, view: { ...a, ...d } }), o = /* @__PURE__ */ l("label", { className: "dq-checkbox dq-setting-indent", children: [
    /* @__PURE__ */ r(
      "input",
      {
        type: "checkbox",
        checked: a.selectAllOnLoad ?? !1,
        onChange: (d) => i({ selectAllOnLoad: d.target.checked ? !0 : void 0 })
      }
    ),
    "Select every card when a page opens"
  ] });
  if (je(e) === "tag")
    return /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ r(
        Jo,
        {
          label: "View",
          value: a.displayMode === "list" ? "list" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "list", label: "List" }
          ],
          onChange: (d) => i({ displayMode: d })
        }
      ),
      o,
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review opens with these. The Cards / List switch in the header changes only the current visit." })
    ] });
  const s = e.presentation ?? {}, c = (d) => t({ ...e, presentation: { ...s, ...d } }), u = s.annotations ?? [], p = a.reviewMode ?? "single";
  return /* @__PURE__ */ l(ge, { children: [
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ l("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ r(
          Wo,
          {
            name: `${n}-layout-choice`,
            checked: p === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ r(Ju, {}),
            onChoose: () => i({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ r(
          Wo,
          {
            name: `${n}-layout-choice`,
            checked: p === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ r(Wu, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ r(
        Jo,
        {
          label: "Cards",
          value: a.displayMode === "wall" ? "wall" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "wall", label: "Wall" }
          ],
          onChange: (d) => i({ displayMode: d })
        }
      ),
      o,
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
            Qn,
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
        Qn,
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
function Jo({
  label: e,
  value: t,
  options: n,
  onChange: a
}) {
  const i = at();
  return /* @__PURE__ */ l("div", { className: "dq-setting-row", children: [
    /* @__PURE__ */ r("span", { className: "dq-setting-name", id: i, children: e }),
    /* @__PURE__ */ r("div", { className: "dq-segmented", role: "group", "aria-labelledby": i, children: n.map((o) => /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        "aria-pressed": t === o.value,
        onClick: () => t !== o.value && a(o.value),
        children: o.label
      },
      o.value
    )) })
  ] });
}
function Wo({
  name: e,
  checked: t,
  title: n,
  text: a,
  picture: i,
  onChoose: o
}) {
  const s = at(), c = at();
  return /* @__PURE__ */ l("label", { className: "dq-layout-card", children: [
    i,
    /* @__PURE__ */ l("span", { className: "dq-layout-card-name", children: [
      /* @__PURE__ */ r(
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
      /* @__PURE__ */ r("span", { id: s, children: n })
    ] }),
    /* @__PURE__ */ r("span", { className: "dq-layout-card-text", id: c, children: a })
  ] });
}
function Ju() {
  return /* @__PURE__ */ l("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function Wu() {
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
const Ti = "The queue differs from the saved review.";
function Ec({
  name: e,
  description: t,
  entityType: n,
  onBack: a,
  backDisabled: i,
  onEdit: o,
  editDisabled: s,
  editing: c = !1,
  toolbar: u,
  trailing: p,
  trailingEnd: d,
  queueChange: g,
  queueDiffers: m,
  chipsStart: b,
  chipsAfter: w,
  chipsEnd: N
}) {
  const q = $(null);
  Zu(q);
  const y = ef(q), [R, F] = C({ differs: m, text: "" });
  return R.differs !== m && F({
    differs: m,
    text: m ? R.differs === !1 ? Ti : R.text : ""
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
          children: /* @__PURE__ */ r(ua, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-type", title: yc[n], children: /* @__PURE__ */ r(Nc, { entityType: n }) }),
      /* @__PURE__ */ r("h1", { title: t || e, children: e }),
      t && /* @__PURE__ */ r("p", { className: "dq-sr-only", children: t }),
      o && /* @__PURE__ */ r(
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
          children: /* @__PURE__ */ r(Lr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    u,
    /* @__PURE__ */ l("div", { className: "dq-review-header-trail", children: [
      p,
      g && /* @__PURE__ */ r(Hu, { change: g, onPress: y }),
      d
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    b,
    w && /* @__PURE__ */ r("div", { className: "dq-review-chips-after", children: w }),
    N && /* @__PURE__ */ r("div", { className: "dq-review-chips-end", children: N }),
    /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: R.text })
  ] });
}
function Hu({
  change: e,
  onPress: t
}) {
  const n = at(), a = at(), i = `${Ti} Save these filters to the review.`, o = e.onSave ? `${Ti} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  return /* @__PURE__ */ l(ge, { children: [
    e.onSave && /* @__PURE__ */ l(
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
          /* @__PURE__ */ r(xl, { "aria-hidden": "true" }),
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
        title: o,
        "aria-describedby": a,
        disabled: e.resetDisabled,
        onClick: () => {
          t(), e.onReset();
        },
        children: [
          /* @__PURE__ */ r(Pl, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-queue-label", children: "Reset" }),
          /* @__PURE__ */ r("span", { id: a, hidden: !0, children: o })
        ]
      }
    )
  ] });
}
const Qu = ["queue", "summary", "name", "layout", "range"], Yu = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, Xu = "(min-width: 1400px)";
function xa(e) {
  const t = e.querySelector(".dq-review-header-lead"), n = e.querySelector(".dq-review-header-trail");
  if (!t || !n) return !0;
  const a = t.getBoundingClientRect();
  return !a.height || n.getBoundingClientRect().top < a.bottom;
}
function Ho(e, t) {
  const n = e.querySelector(".dq-review-header-lead h1"), a = () => {
    e.removeAttribute("data-compact"), n == null || n.style.removeProperty("max-width");
  };
  if (a(), !t) return !0;
  const i = Qu.filter(
    (o) => e.querySelector(Yu[o])
  );
  for (let o = 1; o <= i.length && !xa(e); o++) {
    if (e.dataset.compact = i.slice(0, o).join(" "), i[o - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !xa(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return xa(e) ? !0 : (a(), !1);
}
function Zu(e) {
  const t = sc(Xu), [n, a] = C(0), i = $(!1);
  kt(() => {
    e.current && (i.current = !Ho(e.current, t));
  }, [e, t, n]), kt(() => {
    const o = e.current;
    o && t && !i.current && !xa(o) && (i.current = !Ho(o, t));
  }), Q(() => {
    const o = e.current;
    if (!o || !t || typeof ResizeObserver > "u") return;
    const s = new ResizeObserver(() => a((c) => c + 1));
    s.observe(o);
    for (const c of o.querySelectorAll(".dq-review-header-lead, .dq-review-header-trail"))
      s.observe(c);
    return () => s.disconnect();
  }, [e, t]);
}
function ef(e) {
  const t = $(!1);
  return Q(() => {
    const n = e.current;
    if (!t.current || !n) return;
    const a = document.activeElement, i = (a == null ? void 0 : a.closest(".dq-queue-button")) ?? null;
    if (a && a !== document.body && !i) {
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
function Cc({
  page: e,
  pages: t,
  onPage: n
}) {
  const [a, i] = C(!1), [o, s] = C(""), c = $(null), u = $(null);
  Q(() => {
    var g;
    a && ((g = c.current) == null || g.select());
  }, [a]);
  const p = (g) => {
    i(!1), g && requestAnimationFrame(() => {
      var m;
      return (m = u.current) == null ? void 0 : m.focus();
    });
  }, d = () => {
    const g = Math.round(Number(o));
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
        children: /* @__PURE__ */ r(ua, { "aria-hidden": "true" })
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
        value: o,
        onChange: (g) => s(g.target.value),
        onKeyDown: (g) => {
          g.key === "Enter" ? (g.preventDefault(), d()) : g.key === "Escape" && (g.preventDefault(), g.stopPropagation(), p(!0));
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
          s(String(e)), i(!0);
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
        children: /* @__PURE__ */ r(As, { "aria-hidden": "true" })
      }
    )
  ] });
}
function Ac({
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
          /* @__PURE__ */ r(Fl, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ r(Ki, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-layout-label", children: "Grid" })
        ]
      }
    )
  ] });
}
function tf({
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
function uo({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [a, i] = C(!1), [o, s] = C(!1), c = $(null), u = $(null), p = at();
  kt(() => {
    if (!a || !u.current || !c.current) return;
    const m = c.current.getBoundingClientRect(), b = u.current.offsetHeight + 12, w = window.innerHeight - m.bottom;
    s(w < b && m.top > w);
  }, [a]), Q(() => {
    var m, b;
    a && ((b = (m = u.current) == null ? void 0 : m.querySelector('[role="menuitem"]:not(:disabled)')) == null || b.focus({ preventScroll: !0 }));
  }, [a]), Q(() => {
    t && i(!1);
  }, [t]);
  const d = (m = !0) => {
    var b;
    i(!1), m && ((b = c.current) == null || b.focus());
  };
  return /* @__PURE__ */ l("div", { className: `dq-menu${a ? " dq-menu-open" : ""}`, onKeyDown: (m) => {
    var N, q;
    if (!a) return;
    const b = [
      ...((N = u.current) == null ? void 0 : N.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], w = b.indexOf(document.activeElement);
    if (m.key === "Escape")
      m.preventDefault(), m.stopPropagation(), d();
    else if (m.key === "Tab")
      d(!1);
    else if (m.key === "ArrowDown" || m.key === "ArrowUp") {
      if (m.preventDefault(), !b.length) return;
      const y = m.key === "ArrowDown" ? 1 : -1;
      b[(w + y + b.length) % b.length].focus();
    } else (m.key === "Home" || m.key === "End") && (m.preventDefault(), (q = b.at(m.key === "Home" ? 0 : -1)) == null || q.focus());
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
        onClick: () => i((m) => !m),
        children: /* @__PURE__ */ r(Ml, { "aria-hidden": "true" })
      }
    ),
    a && /* @__PURE__ */ l(ge, { children: [
      /* @__PURE__ */ r("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => d(!1) }),
      /* @__PURE__ */ r(
        "div",
        {
          ref: u,
          id: p,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${o ? " dq-menu-list-up" : ""}`,
          children: e.map((m) => /* @__PURE__ */ l(Di, { children: [
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
function fo(e) {
  return String(e.type).toLowerCase() === "tag";
}
function ho(e) {
  return !!String(e ?? "").trim();
}
function po(e) {
  return [
    ...new Set(
      Ga(e.customFieldCriteria).filter(fo).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !ho(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function mo(e, t) {
  const n = Ga(e.customFieldCriteria);
  if (!n.length) return e;
  let a = !1;
  const i = n.map((o) => {
    if (!fo(o)) return o;
    const s = { ...o };
    for (const [c, u] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const p = t[String(o[c] ?? "")];
      p && !ho(o[u]) && (s[u] = p, a = !0);
    }
    return s;
  });
  return a ? { ...e, customFieldCriteria: i } : e;
}
function Tc(e, t, n) {
  const a = Ga(e.customFieldCriteria);
  if (!a.length) return e;
  const i = Ga(n.customFieldCriteria), o = (u, p) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (d) => (u[d] ?? void 0) === (p[d] ?? void 0)
  );
  let s = !1;
  const c = a.map((u) => {
    if (!fo(u)) return u;
    const p = i.find((g) => o(g, u));
    if (!p) return u;
    const d = { ...u };
    for (const [g, m] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const b = t[String(u[g] ?? "")];
      b && u[m] === b && !ho(p[m]) && (delete d[m], s = !0);
    }
    return d;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
async function nf(e, t, n) {
  if (!xn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const a = Ue(e), i = n.steps.some((c) => Mn(c.mode)) ? await $d(a) : "", o = await Zi(n);
  let s = t.applications;
  for (const c of [
    ...o.filter((u) => !Mn(u.mode)),
    ...o.filter((u) => Mn(u.mode))
  ]) {
    const u = (p) => Od(
      i,
      a,
      t.media.id,
      t.performer.id,
      c.tagIds,
      p
    );
    (c.mode === "MARK_PRESENT" || c.mode === "CLEAR_ABSENCE") && await u("REMOVE"), c.mode !== "CLEAR_ABSENCE" && (s = await Oc(
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
async function go(e, t) {
  const n = e.occurrence;
  if (zi(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const a = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await ue("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Pn({
          findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: o,
          filterExpression: i
        })
      )
    });
    if (c.items.forEach((u) => a.add(u.id)), s * 1e3 >= c.totalCount) return [...a];
    if (!c.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Ic(e) {
  return aa(e.condition) && e.hideConfirmedAbsent !== !1;
}
function bo(e, t) {
  const { _filterExpression: n, ...a } = e.view.objectFilter, i = e.occurrence, o = {
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
  }, s = Ic(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
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
            { filter: a },
            { filter: { performerFilterCriterion: o } },
            ...s ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: za,
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
async function wo(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => Ja([n], t))
  );
}
function Rc(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function rf(e, t, n = e.conditionTagIds.map((a) => [a])) {
  const a = new Set(t), i = (o) => o.some((s) => a.has(s));
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
function af(e, t, n, a, i) {
  if (!Ic(e)) return !1;
  const o = Vs(t, n);
  return e.conditionTagIds.every(
    (s, c) => o.includes(s) || i[c].some((u) => a.includes(u))
  );
}
async function $c(e, t, n, a) {
  if ((t == null ? void 0 : t.length) === 0 || Rc(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = Ue(e), o = await ta(
    bo(e, t),
    { ...e.view.filter, page: n },
    a
  ), s = t === null ? null : new Set(t), c = e.occurrence, u = o.items.length ? await wo(c, a) : [], p = new Array(o.items.length);
  let d = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; d < o.items.length; ) {
        const g = d++, m = o.items[g], b = await ue(
          `/api/tagapplications?hostType=${i}&hostId=${m.id}&contextType=performer`,
          { signal: a }
        );
        p[g] = m.performers.filter((w) => s === null || s.has(w.id)).flatMap((w) => {
          const N = b.filter(
            (y) => y.hostType === i && y.hostId === m.id && y.contextType === "performer" && y.contextId === w.id
          ), q = N.map((y) => y.tag.id);
          return rf(e.occurrence, q, u) && !af(c, m, w.id, q, u) ? [
            {
              key: `${m.id}:${w.id}`,
              media: m,
              performer: w,
              applications: N
            }
          ] : [];
        });
      }
    })
  ), { items: p.flat(), totalCount: o.totalCount };
}
async function Oc(e, t, n) {
  const a = new Set(e.occurrence.tagIds);
  if (n.some((p) => !a.has(p)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = Ue(e), o = await yi(i, t.media.id);
  if (!o.performers.some(
    (p) => p.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, c = (await ue(s)).filter(
    (p) => p.hostType === i && p.hostId === o.id && p.contextType === "performer" && p.contextId === t.performer.id
  ), u = new Set(n);
  try {
    for (const p of u)
      c.some((d) => d.tag.id === p) || await ue("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: i,
          hostId: o.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: p,
          sourceKey: "user"
        })
      });
    for (const p of c)
      a.has(p.tag.id) && !u.has(p.tag.id) && await ue(`/api/tagapplications/${p.id}`, {
        method: "DELETE"
      });
    return await ue(s);
  } catch (p) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${p instanceof Error ? p.message : "Request failed."}`
    );
  }
}
function Dr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function of(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function hn(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const u = n ? Vs(
      await yi(e, t.media.id),
      t.occurrence.performer.id
    ) : [], p = (await ue(of(e, t))).filter(
      (d) => d.hostType === e && d.hostId === t.media.id && d.contextType === "performer" && d.contextId === t.occurrence.performer.id
    );
    return Ai(p.map((d) => d.tag)), {
      ids: [...new Set(p.map((d) => d.tag.id))],
      names: [...new Set(p.map((d) => d.tag.name))],
      absent: u,
      applications: p
    };
  }
  const a = await yi(e, t.media.id), i = (a.tags ?? []).filter(
    (u) => u.canRemove !== !1 || u.isDerived !== !0
  );
  Ai(i);
  const o = Object.keys(a.customFields ?? {}).find(
    (u) => u.toLowerCase() === _a
  ) ?? _a, s = ((c = a.customFields) == null ? void 0 : c[o]) ?? [];
  if (!Array.isArray(s) || s.some((u) => !Number.isSafeInteger(u)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${e} before editing.`
    );
  return {
    ids: i.map((u) => u.id),
    names: i.map((u) => u.name),
    absent: s,
    tags: i
  };
}
async function yo(e, t, n) {
  if (t.occurrence && Te(e))
    await Oc(
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
      i.length && await ue(
        `/api/${Xn(Ue(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: a, tagIds: i })
        }
      );
}
async function sf(e, t, n) {
  t.occurrence && Te(e) ? await nf(e, t.occurrence, n) : await zs(Ue(e), n, [t.media.id]);
}
function Ii(e, t, n, a) {
  const i = (o) => o.filter((s) => a.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: Dr(i(t.ids), i(n.ids)),
    absence: Dr(i(t.absent), i(n.absent))
  };
}
function cf(e, t) {
  var n;
  for (const [a, i] of [
    [e.tags, t.ids],
    [e.absence, t.absent]
  ])
    if (a.added.some((o) => !i.includes(o)) || a.removed.some((o) => i.includes(o)))
      throw new Error(
        "Undo conflict: affected tags changed since this operation. Inspect the item; no undo changes were made."
      );
  if (t.applications)
    for (const a of e.tags.added) {
      const i = (n = e.after.applications) == null ? void 0 : n.filter((s) => s.tag.id === a).map((s) => s.id).sort(), o = t.applications.filter((s) => s.tag.id === a).map((s) => s.id).sort();
      if (JSON.stringify(i) !== JSON.stringify(o))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
class Mc extends Error {
}
const Ri = (e) => e instanceof Error ? e.message : "Request failed.", Qo = (e) => [...e].sort((t, n) => t - n), sa = (e, t) => JSON.stringify(Qo(e)) === JSON.stringify(Qo(t)), $i = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Ka(e, t, n, a) {
  const i = new Set(e), o = new Set(e);
  for (const d of t.steps)
    for (const g of d.tagIds)
      d.mode === "ADD" ? o.add(g) : o.delete(g);
  const s = e.some((d) => !o.has(d));
  if (s && !a)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const c = new Set(
    t.steps.filter((d) => d.mode === "ADD").flatMap((d) => d.tagIds)
  ), u = [], p = [];
  for (const d of n) {
    const g = d.filter((b) => o.has(b) && !i.has(b)), m = d.filter(
      (b) => o.has(b) && i.has(b) && !c.has(b)
    );
    !g.length || !m.length || (a ? (m.forEach((b) => o.delete(b)), p.push(...m)) : (g.forEach((b) => o.delete(b)), u.push({ tagIds: g, existing: m })));
  }
  return { desired: [...o], conflict: s, skipped: !1, kept: u, replaced: p };
}
function lf(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function df(e, t, n, a) {
  for (const [i, o] of n.entries()) {
    const s = t.filter(
      (p) => p.steps.some(
        (d) => d.mode === "ADD" && d.tagIds.some((g) => o.includes(g))
      )
    );
    if (s.length < 2) continue;
    const c = e.occurrence.conditionTagIds[i];
    let u = `tag ${c}`;
    try {
      u = (await ue(`/api/tags/${c}`, { signal: a })).name;
    } catch {
      a.throwIfAborted();
    }
    throw new Mc(
      `${s.map((p) => p.label).join(" and ")} answer the same condition tag, ${u}. Choose one of them.`
    );
  }
}
async function uf(e, t, n, a = () => {
}) {
  if (!t.length || t.some(
    (m) => !xn(m, e.entityType) || !m.steps.length || m.steps.some(
      (b) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(b.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = aa(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await wo(i.occurrence, n) : [];
  await df(i, o, s, n);
  const c = await Promise.all(
    o.map(async (m) => ({
      ...m,
      steps: await Zi(m, n)
    }))
  ), u = structuredClone(lf(c));
  n.throwIfAborted();
  const p = [
    .../* @__PURE__ */ new Set([
      ...u.steps.flatMap((m) => m.tagIds),
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
  const d = await go(i, n), g = /* @__PURE__ */ new Map();
  for (let m = 1; ; m++) {
    n.throwIfAborted();
    const b = await $c(i, d, m, n);
    for (const w of b.items) {
      const N = {
        ids: [...new Set(w.applications.map((y) => y.tag.id))],
        names: w.applications.map((y) => y.tag.name),
        absent: [],
        applications: w.applications
      }, q = Ka(N.ids, u, s, !0);
      g.set(w.key, {
        item: { key: w.key, media: w.media, occurrence: w },
        before: N,
        expected: N,
        conflict: q.conflict,
        status: sa(N.ids, q.desired) ? "unchanged" : "pending"
      });
    }
    if (a(g.size), m * 250 >= b.totalCount) break;
    if (m > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return n.throwIfAborted(), {
    review: i,
    actions: o,
    action: u,
    categories: s,
    touched: p,
    entries: [...g.values()]
  };
}
function ff(e, t, n) {
  const a = (o) => o.ids.filter((s) => n.includes(s));
  if (!sa(a(e), a(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return sa(i(e), i(t));
}
async function Fc(e, t, n, a) {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; !t() && i < e.length; ) {
        const o = e[i++];
        await n(o), a();
      }
    })
  );
}
function xc(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function Pc(e) {
  return e.entries.filter((t) => t.operation);
}
async function hf(e, t, n, a, i = !1) {
  await Fc(
    xc(e, i),
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
        if (s = await hn(Ue(e.review), o.item, !1), !ff(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (m) {
        o.status = "failed", o.error = Ri(m);
        return;
      }
      const c = Ka(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), u = [
        ...s.ids.filter((m) => !e.touched.includes(m)),
        ...c.desired.filter((m) => e.touched.includes(m))
      ], p = Dr(s.ids, u);
      if (!p.added.length && !p.removed.length) {
        const m = !o.operation && c.kept.length > 0;
        o.status = o.operation ? "changed" : m ? "skipped" : "unchanged", o.error = m ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let d;
      try {
        await yo(e.review, o.item, p);
      } catch (m) {
        d = m;
      }
      let g = !1;
      try {
        const m = await hn(Ue(e.review), o.item, !1);
        g = !0, o.expected = m;
        const b = Ii(
          o.item,
          o.before,
          m,
          e.touched
        );
        if (o.operation = $i(b) ? b : void 0, d) throw d;
        if (!sa(
          m.ids.filter((w) => e.touched.includes(w)),
          u.filter((w) => e.touched.includes(w))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (m) {
        if (o.status = "failed", o.error = Ri(m), !g)
          try {
            const b = await hn(Ue(e.review), o.item, !1);
            o.expected = b;
            const w = Ii(
              o.item,
              o.before,
              b,
              e.touched
            );
            o.operation = $i(w) ? w : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    a
  );
}
async function pf(e, t, n) {
  await Fc(
    Pc(e),
    t,
    async (a) => {
      const i = a.operation;
      if (a.unverified) {
        a.error = "Undo unavailable: the previous write could not be verified. Inspect this occurrence.";
        return;
      }
      const o = [...i.tags.added, ...i.tags.removed];
      let s = !1;
      try {
        const c = await hn(Ue(e.review), a.item, !1);
        cf(i, c), s = !0, await yo(e.review, a.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const u = await hn(Ue(e.review), a.item, !1);
        if (!sa(
          u.ids.filter((p) => o.includes(p)),
          a.before.ids.filter((p) => o.includes(p))
        ))
          throw new Error("Undo did not restore all affected tags.");
        a.operation = void 0, a.expected = u, a.status = "unchanged", a.error = void 0;
      } catch (c) {
        if (a.error = `Undo stopped: ${Ri(c)}`, a.status = "failed", s)
          try {
            const u = await hn(Ue(e.review), a.item, !1), p = Ii(
              a.item,
              a.before,
              u,
              o
            );
            a.operation = $i(p) ? p : void 0, a.expected = u;
          } catch {
            a.unverified = !0;
          }
      }
    },
    n
  );
}
const Lc = (e, t) => t.count - e.count || Js(e, t);
async function mf(e, t, n) {
  const a = Ue(e), i = e.occurrence, [o, s] = await Promise.all([
    ue(
      `/api/tagapplications?hostType=${a}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    wo(i, n)
  ]), c = o.filter(
    (w) => w.hostType === a && w.contextType === "performer" && w.contextId === t
  );
  Ai(c.map((w) => w.tag));
  const u = await Promise.all(
    s.map(async (w, N) => {
      const q = i.conditionTagIds[N];
      return (await ue(`/api/tags/${q}`, { signal: n })).name;
    })
  ), p = new Set(s.flat()), d = new Set(
    [
      ...e.actions.flatMap((w) => w.steps).filter((w) => w.mode === "ADD" || w.mode === "MARK_PRESENT").flatMap((w) => w.tagIds),
      ...i.tagIds
    ].filter((w) => !p.has(w))
  ), g = (w) => {
    const N = /* @__PURE__ */ new Map();
    for (const q of c) {
      if (!w.has(q.tag.id)) continue;
      const y = N.get(q.tag.id) ?? {
        tag: q.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      y.hosts.add(q.hostId), N.set(q.tag.id, y);
    }
    return [...N.values()].map((q) => ({ ...q.tag, count: q.hosts.size })).sort(Lc);
  }, m = s.map((w, N) => ({
    id: i.conditionTagIds[N],
    name: u[N],
    members: w,
    tags: g(new Set(w))
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
      c.filter((w) => b.has(w.tag.id)).map((w) => w.hostId)
    ).size,
    groups: m
  };
}
function gf(e, t, n, a) {
  const i = /* @__PURE__ */ new Set([e, ...t]), o = (s) => {
    if (s === e) return !0;
    const c = a.get(s);
    if (!c) return !1;
    const u = new Set(c);
    return [...i].every((p) => u.has(p));
  };
  return n.some(
    (s) => [...Yn(s)].some((c) => i.has(c)) && s.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(o)
    )
  );
}
function vo(e, t, n) {
  const a = /* @__PURE__ */ new Map();
  for (const b of e.groups) for (const w of b.tags) a.set(w.id, w);
  const i = (b) => b.flatMap((w) => a.get(w) ?? []).sort(Lc), o = (b) => b.members ?? b.tags.map((w) => w.id), s = wr(t).flatMap((b) => {
    const w = [
      ...new Set(b.actions.flatMap((N) => [...Yn(t[N])]))
    ];
    return w.length ? [{ ...b, answers: w, tags: i(w) }] : [];
  }), c = (b) => b.tags.length > 1 ? [b] : [], u = e.groups.filter((b) => b.id !== null).map((b) => {
    const w = `tag:${b.id}`, N = o(b), q = new Set(N);
    return {
      key: w,
      kind: "condition",
      name: b.name,
      members: N,
      tags: b.tags,
      mixed: gf(b.id, N, t, n) ? c({ key: w, name: b.name, members: N, tags: b.tags }) : (
        // A category that holds several answers is mixed where a group inside it is.
        s.filter((y) => y.answers.every((R) => q.has(R))).flatMap(
          (y) => c({
            key: `group:${y.key}`,
            name: y.name,
            members: y.answers,
            tags: y.tags
          })
        )
      )
    };
  }), p = u.map((b) => new Set(b.members)), d = /* @__PURE__ */ new Set();
  for (const b of s) {
    if (p.some((N) => b.answers.every((q) => N.has(q)))) continue;
    b.answers.forEach((N) => d.add(N));
    const w = `group:${b.key}`;
    u.push({
      key: w,
      kind: "group",
      name: b.name,
      members: b.answers,
      tags: b.tags,
      // An answer group is one question: it takes one answer.
      mixed: c({ key: w, name: b.name, members: b.answers, tags: b.tags })
    });
  }
  const g = e.groups.find((b) => b.id === null), m = (g == null ? void 0 : g.tags.filter((b) => !d.has(b.id))) ?? [];
  return g && m.length && u.push({
    key: "other",
    kind: "other",
    name: u.length ? "Other review tags" : "Review tags",
    members: o(g).filter((b) => !d.has(b)),
    tags: m,
    mixed: []
  }), u;
}
const li = { summary: null, error: "" };
function Dc(e, t, n = 0) {
  const a = e == null ? void 0 : e.occurrence, i = JSON.stringify([
    e == null ? void 0 : e.entityType,
    t,
    a == null ? void 0 : a.condition,
    a == null ? void 0 : a.conditionTagIds,
    a == null ? void 0 : a.includeSubtags,
    a == null ? void 0 : a.tagIds,
    e == null ? void 0 : e.actions.map((c) => c.steps)
  ]), [o, s] = C({
    key: i,
    value: li
  });
  return Q(() => {
    if (s((u) => u.key === i ? u : { key: i, value: li }), e === null || t === null) return;
    const c = new AbortController();
    return mf(e, t, c.signal).then((u) => {
      c.signal.aborted || s({ key: i, value: { summary: u, error: "" } });
    }).catch((u) => {
      c.signal.aborted || s((p) => ({
        key: i,
        value: {
          summary: p.key === i ? p.value.summary : null,
          error: u instanceof Error ? u.message : "Request failed."
        }
      }));
    }), () => c.abort();
  }, [i, n]), o.key === i ? o.value : li;
}
function bf(e, t) {
  const n = (p) => {
    var d;
    return ((d = p.tagIds) == null ? void 0 : d.every((g) => e.members.includes(g))) ?? !1;
  }, a = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  for (const p of e.mixed) {
    const d = Ud(p, t).filter((m) => m.key !== e.key), g = p.key === e.key ? [] : d.filter(n);
    g.length ? g.forEach((m) => a.add(m.name)) : d.forEach((m) => i.add(m.name));
  }
  const o = Nt(e.name), s = [...a].filter((p) => Nt(p) !== o), c = s.length < a.size, u = i.size ? ` (${c ? "partly " : ""}listed under ${[...i].join(", ")})` : "";
  return { names: s, here: c || i.size > 0, note: u };
}
function wf(e, { names: t, here: n, note: a }) {
  const i = `this ${e.kind === "group" ? "group" : "category"}${a}`;
  return `This performer has different answers in ${t.length ? n ? `${i} and in ${t.join(", ")}` : t.join(", ") : i}.`;
}
function Oi({
  summary: e,
  error: t,
  mediaKind: n,
  actions: a = [],
  trees: i = qi,
  flags: o = [],
  className: s = ""
}) {
  const c = En(n), u = (m) => `${m.toLocaleString()} ${m === 1 ? c.one : c.many}`, p = e ? vo(e, a, i) : [], d = no(p), g = (m) => [
    ...new Set(
      o.filter((b) => {
        var w;
        return (w = b.tagIds) == null ? void 0 : w.some((N) => m.includes(N));
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
          const b = m.kind === "other" ? [] : g(m.members), w = bf(m, d), N = w.note ? /* @__PURE__ */ r("span", { className: "dq-sr-only", children: w.note }) : null;
          return /* @__PURE__ */ l("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ l("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ r("span", { children: m.name }),
              m.mixed.length > 0 && /* @__PURE__ */ l(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-mixed",
                  title: wf(m, w),
                  children: [
                    /* @__PURE__ */ r(Fn, { "aria-hidden": "true" }),
                    "Mixed",
                    w.names.length > 0 ? /* @__PURE__ */ l("span", { className: "dq-answer-mixed-names", children: [
                      w.here && " here",
                      N,
                      ` ${w.here ? "and in" : "in"} ${w.names.join(", ")}`
                    ] }) : N
                  ]
                }
              ),
              b.length > 0 && /* @__PURE__ */ l(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-flag",
                  title: `Flagged: ${b.join(", ")}`,
                  children: [
                    /* @__PURE__ */ r(Fn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Flagged: " }),
                      b.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            m.tags.length ? /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": m.name, children: m.tags.map((q) => /* @__PURE__ */ l("li", { className: "dq-tag", children: [
              /* @__PURE__ */ r(Bt, { tag: q }),
              /* @__PURE__ */ r("span", { className: "dq-chip-count", "aria-hidden": "true", children: q.count.toLocaleString() }),
              /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
                ", ",
                u(q.count)
              ] })
            ] }, q.id)) }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" })
          ] }, m.key);
        }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading existing answers…" })
      ]
    }
  );
}
function xr({
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
const Yo = 5;
function yf(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await ue(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
function vf(e, t) {
  const n = 1100 - (Date.now() - e);
  return n <= 0 ? Promise.resolve() : new Promise((a, i) => {
    const o = window.setTimeout(a, n);
    t.addEventListener(
      "abort",
      () => {
        window.clearTimeout(o), i(t.reason);
      },
      { once: !0 }
    );
  });
}
const Xo = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), Mi = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], Zo = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], Nf = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, di = 250;
function ea(e, t) {
  var a, i;
  const n = e.item.media;
  return n.title || ((i = (a = n.files) == null ? void 0 : a[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function qf({ step: e }) {
  const t = Mi.findIndex((n) => n.id === e);
  return /* @__PURE__ */ r("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Mi.map((n, a) => {
    const i = a < t ? "done" : a === t ? "current" : "next";
    return /* @__PURE__ */ l("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ r(la, {}) : a + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function es({ parts: e, id: t }) {
  return /* @__PURE__ */ r("span", { className: "dq-batch-effect", id: t, children: e.map((n, a) => /* @__PURE__ */ l(Di, { children: [
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
  onToggle: o
}) {
  return /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: "dq-batch-stat",
      "data-tone": e ? a : void 0,
      "aria-pressed": i && e > 0,
      disabled: !e,
      onClick: o,
      children: [
        /* @__PURE__ */ r("span", { className: "dq-batch-stat-value", children: e.toLocaleString() }),
        " ",
        /* @__PURE__ */ r("span", { className: "dq-batch-stat-label", children: t }),
        n && /* @__PURE__ */ l(ge, { children: [
          " ",
          /* @__PURE__ */ r("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function ts({
  added: e,
  removed: t,
  tag: n,
  label: a
}) {
  return /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": a, children: [
    gr(e.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
      "+ ",
      /* @__PURE__ */ r(Bt, { tag: i })
    ] }) }, `added-${i.id}`)),
    gr(t.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ l("del", { children: [
      "− ",
      /* @__PURE__ */ r(Bt, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function ns({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: a,
  describe: i
}) {
  return /* @__PURE__ */ l("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: e }),
      t.length > di && /* @__PURE__ */ l("span", { children: [
        "First ",
        di.toLocaleString(),
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
      /* @__PURE__ */ r("tbody", { children: t.slice(0, di).map((o) => {
        var s;
        return /* @__PURE__ */ l("tr", { children: [
          /* @__PURE__ */ r("td", { children: /* @__PURE__ */ l(
            "a",
            {
              href: `/${n}/${o.item.media.id}`,
              target: "_blank",
              rel: "noreferrer",
              children: [
                (s = o.item.occurrence) == null ? void 0 : s.performer.name,
                " — ",
                ea(o, n)
              ]
            }
          ) }),
          /* @__PURE__ */ r("td", { className: "dq-batch-list-date", children: o.item.media.date ?? "" }),
          /* @__PURE__ */ r("td", { children: i(o) })
        ] }, o.item.key);
      }) })
    ] }) })
  ] });
}
function Sf(e) {
  const t = {
    pending: 0,
    changed: 0,
    unchanged: 0,
    skipped: 0,
    failed: 0
  }, n = /* @__PURE__ */ new Map();
  let a = 0, i = !1;
  for (const o of e)
    if (t[o.status] += 1, o.operation && (a += 1), o.status === "failed" && !o.unverified && (i = !0), (o.status === "skipped" || o.status === "failed") && o.error) {
      const s = `${o.status}\0${o.error}`, c = n.get(s) ?? { status: o.status, error: o.error, count: 0 };
      c.count += 1, n.set(s, c);
    }
  return { counts: t, reasons: [...n.values()], recorded: a, retryable: i };
}
function kf({
  review: e,
  disabled: t,
  performerAttention: n,
  trees: a,
  onOpen: i,
  onClose: o,
  onWrite: s
}) {
  const [c, u] = C(!1), [p, d] = C("answers"), [g, m] = C(null), [b, w] = C({}), [N, q] = C([]), [y, R] = C(!1), [F, _] = C(!1), [B, L] = C(""), [Z, ne] = C(!1), [ae, ie] = C(""), [G, D] = C(null), [S, I] = C(null), [Y, A] = C([]), [V, z] = C(0), K = $(null), T = $(null), W = $(null), H = $(!1), oe = $(!1), Ie = $(null), Ge = $(!1), j = $(0), be = $(!1), $e = $({ onClose: o, onWrite: s });
  $e.current = { onClose: o, onWrite: s };
  const pe = at(), Oe = p === "run", Xe = (G == null ? void 0 : G.kind) === "undo", ke = Oe && g ? g.review : e, Cn = _r(ke.actions), we = ke.occurrence, ze = Ue(ke), Et = En(ze), pn = Et.queue, Fe = Oe && g ? g.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((E) => E.steps.length && !Hn(E))
  ), it = Fe.filter((E) => N.includes(E.id)), Ae = we.targetMode === "selected" && we.performerIds.length === 1, Ze = Dc(
    ke,
    c && Ae ? we.performerIds[0] : null,
    V
  ), Vt = po(ke.view.objectFilter), Me = pa(
    c ? [...Wa(Fe), ...we.conditionTagIds, ...Vt] : []
  ), An = he(() => oc(Me), [Me]), ut = (E) => b[E] ?? Me[E] ?? { id: E, name: `Tag ${E}` }, Mt = JSON.stringify(
    Object.fromEntries(
      Vt.flatMap((E) => {
        var X;
        const P = (X = Me[E]) == null ? void 0 : X.name;
        return P ? [[String(E), P]] : [];
      })
    )
  ), ht = he(
    () => mo(ke.view.objectFilter, JSON.parse(Mt)),
    [ke.view.objectFilter, Mt]
  );
  Q(() => {
    var E, P, X;
    c && ((E = K.current) == null || E.showModal(), (X = (P = K.current) == null ? void 0 : P.querySelector(".dq-batch-answer input")) == null || X.focus());
  }, [c]), Q(() => {
    if (!c) return;
    const E = requestAnimationFrame(() => {
      var ce;
      const P = K.current, X = document.activeElement;
      if (!P || X && X !== document.body && P.contains(X)) return;
      (ce = (p === "answers" ? P.querySelector(".dq-batch-answer input:checked") ?? P.querySelector(".dq-batch-answer input") : P.querySelector("[data-batch-focus]")) ?? T.current) == null || ce.focus();
    });
    return () => cancelAnimationFrame(E);
  }, [c, p, F, g]), Q(() => {
    if (c || t || !H.current) return;
    const E = requestAnimationFrame(() => {
      const P = W.current;
      if (!H.current || !P || P.disabled) return;
      H.current = !1;
      const X = document.activeElement;
      (!X || X === document.body) && P.focus();
    });
    return () => cancelAnimationFrame(E);
  }, [c, t]), Q(() => {
    if (!c || we.targetMode !== "selected") return;
    const E = new AbortController();
    return A([]), yf(we.performerIds.slice(0, Yo), E.signal).then((P) => {
      E.signal.aborted || A(P);
    }).catch(() => {
    }), () => E.abort();
  }, [c, we.targetMode, JSON.stringify(we.performerIds)]), Q(
    () => () => {
      var E;
      oe.current = !0, (E = Ie.current) == null || E.abort();
    },
    []
  ), Q(() => {
    if (!F) return;
    const E = (P) => {
      P.preventDefault(), P.returnValue = "";
    };
    return window.addEventListener("beforeunload", E), () => window.removeEventListener("beforeunload", E);
  }, [F]);
  function zt() {
    d("answers"), m(null), w({}), D(null), R(!1), q([]), ie(""), L(""), ne(!1), I(null);
  }
  function qt() {
    be.current || (u(!1), $e.current.onClose(Ge.current), Ge.current = !1, zt(), H.current = !0);
  }
  function Zn(E, P) {
    q(
      (X) => P ? [...X, E] : X.filter((me) => me !== E)
    ), m(null), w({}), ie(""), L(""), ne(!1), I(null);
  }
  function Tt() {
    d("answers"), I(null), ie("");
  }
  function Tn() {
    d("preview"), g || ve();
  }
  function Jt() {
    var E;
    oe.current = !0, (E = Ie.current) == null || E.abort(), ie("Stopping after in-flight operations settle…");
  }
  function Ft(E) {
    I(
      (P) => (P == null ? void 0 : P.group) === E.group && P.reason === E.reason ? null : E
    );
  }
  const mn = (E, P) => (S == null ? void 0 : S.group) === E && S.reason === P;
  async function ve() {
    if (!it.length || be.current) return;
    be.current = !0, _(!0), L(""), ne(!1), ie("Loading all matching occurrences…"), m(null), w({}), I(null);
    const E = new AbortController();
    Ie.current = E;
    try {
      await vf(j.current, E.signal);
      const P = await uf(
        e,
        it,
        E.signal,
        (me) => ie(`Loaded ${me.toLocaleString()} matching occurrences…`)
      );
      E.signal.throwIfAborted();
      const X = {};
      for (const me of P.entries)
        for (const ce of me.before.applications ?? [])
          X[ce.tag.id] = ce.tag;
      w(X), m(P), ie("Preview ready. No tags have been changed.");
    } catch (P) {
      L(
        E.signal.aborted ? "Preview cancelled. No tags were changed." : P instanceof Error ? P.message : String(P)
      ), ne(!E.signal.aborted && P instanceof Mc), ie("");
    } finally {
      be.current = !1, _(!1), Ie.current = null;
    }
  }
  async function Ct(E) {
    if (!g || be.current) return;
    const P = (E === "undo" ? Pc(g) : xc(g, E === "retry")).length;
    be.current = !0, oe.current = !1, Ge.current = !0, $e.current.onWrite(), _(!0), d("run"), L(""), D({ kind: E, total: P, done: 0, stopped: !1 }), ie(
      E === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const X = () => D((ce) => ce && { ...ce, done: ce.done + 1 });
    let me = !1;
    try {
      E === "undo" ? await pf(g, () => oe.current, X) : await hf(g, y, () => oe.current, X, E === "retry"), ie(
        oe.current ? "Stopped after in-flight operations settled. Completed changes are retained." : E === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (ce) {
      me = !0, ie(""), L(ce instanceof Error ? ce.message : String(ce));
    } finally {
      j.current = Date.now(), be.current = !1;
      const ce = oe.current || me;
      D((Re) => Re && { ...Re, stopped: ce }), _(!1), z((Re) => Re + 1);
    }
  }
  const ot = (g == null ? void 0 : g.entries) ?? [], Ln = he(
    () => new Map(
      ((g == null ? void 0 : g.entries) ?? []).map((E) => [
        E.item.key,
        Ka(E.before.ids, g.action, g.categories, y)
      ])
    ),
    [g, y]
  ), Wt = (E) => Ln.get(E.item.key), xe = (E) => Dr(E.before.ids, Wt(E).desired), It = (E) => {
    const P = xe(E);
    return E.status === "pending" && (P.added.length > 0 || P.removed.length > 0);
  }, se = (E) => E.conflict || Wt(E).kept.length > 0 || Wt(E).replaced.length > 0, x = he(() => {
    const E = (g == null ? void 0 : g.entries) ?? [];
    return {
      willChange: E.filter(It).length,
      correct: E.filter((P) => P.status === "unchanged").length,
      different: E.filter(se).length,
      hosts: new Set(E.map((P) => P.item.media.id)).size,
      added: [...new Set(E.flatMap((P) => xe(P).added))],
      removed: [...new Set(E.flatMap((P) => xe(P).removed))]
    };
  }, [Ln]), Ee = he(
    () => ((g == null ? void 0 : g.entries) ?? []).filter((E) => E.item.media.date).sort((E, P) => E.item.media.date.localeCompare(P.item.media.date)),
    [g]
  ), pt = Oe ? Sf(ot) : null, Dn = (E) => Cn.keys[ke.actions.findIndex((P) => P.id === E)] ?? "", fe = (E) => Nr(E, An, [], a), Rt = aa(we.condition) && we.includeSubtags !== !1 && we.conditionTagIds.length > 0, tt = Ee[0], Pe = Ee.length > 1 ? Ee[Ee.length - 1] : void 0, et = (E) => `/${ze}/${E.item.media.id}`, Ht = Ae ? Y[0] : void 0, st = he(
    () => n ? Zs(
      n,
      Ze.summary ? no(
        vo(Ze.summary, ke.actions, a ?? qi)
      ) : []
    ) : [],
    [n, Ze.summary, ke.actions, a]
  ), mt = Kd(it, st, a ?? qi), xt = n ?? [], Qt = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: It },
    correct: { title: "Occurrences already correct", test: (E) => E.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: se }
  };
  function ct() {
    const E = Nf[we.condition], P = !!E && we.conditionTagIds.length > 0, X = we.performerIds.slice(0, Yo), me = String(ke.view.filter.q ?? "").trim(), ce = we.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ l("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      zi(we) ? /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "All performers" }) : we.targetMode === "selected" ? /* @__PURE__ */ l(ge, { children: [
        X.map((Re, Ce) => /* @__PURE__ */ l("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ r(xr, { performer: { id: Re, name: Y[Ce] ?? "" } }),
          Y[Ce] ?? "…"
        ] }, Re)),
        we.performerIds.length > X.length && /* @__PURE__ */ l("span", { className: "dq-batch-chip", children: [
          (we.performerIds.length - X.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ l(ge, { children: [
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
                objectFilter: we.performerFilter,
                criteriaDefinitions: _i,
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
        P ? E : Bi[we.condition],
        P && /* @__PURE__ */ r("span", { className: "dq-batch-chip-tags", children: gr(we.conditionTagIds.map(ut)).map((Re) => /* @__PURE__ */ r(Bt, { tag: Re }, Re.id)) })
      ] }),
      P && /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: we.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      aa(we.condition) && we.hideConfirmedAbsent !== !1 && /* @__PURE__ */ l("span", { className: "dq-batch-chip", title: ce, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
          ": ",
          ce
        ] })
      ] }),
      me && /* @__PURE__ */ l("span", { className: "dq-batch-chip", children: [
        "Search “",
        me,
        "”"
      ] }),
      Object.keys(ke.view.objectFilter).length > 0 && /* @__PURE__ */ r(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${pn} filters`,
          children: /* @__PURE__ */ r(
            ra,
            {
              filter: ke.view.filter,
              objectFilter: ht,
              criteriaDefinitions: ze === "audio" ? bs : ji,
              customFieldEntityType: ze,
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
  function _n(E, P, X = !0) {
    if (!E.length) return null;
    const me = /* @__PURE__ */ r("strong", { children: Ht || "This performer" }), ce = X ? `Check the earliest and latest ${Et.many} before applying, or narrow the batch with a date filter.` : "", Re = E.every((Ce) => Ce.tagIds === null && !Ce.mixed.length);
    return /* @__PURE__ */ l("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ r(Fn, { "aria-hidden": "true" }),
      /* @__PURE__ */ l("div", { children: [
        Re ? /* @__PURE__ */ l("p", { children: [
          me,
          " is flagged: ",
          /* @__PURE__ */ r("strong", { children: E.flatMap((Ce) => Ce.flags).join(", ") }),
          ".",
          " ",
          ce
        ] }) : /* @__PURE__ */ l(ge, { children: [
          /* @__PURE__ */ l("p", { children: [
            me,
            " needs attention where the chosen answers apply.",
            ce && ` ${ce}`
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: E.map((Ce) => /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ r("strong", { children: Ce.tagIds === null ? "Whole review" : Ce.name }),
            ":",
            " ",
            ro(Ce).join("; ")
          ] }, Ce.key)) })
        ] }),
        P && tt && /* @__PURE__ */ l("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ l("a", { href: et(tt), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            ea(tt, ze),
            " · ",
            tt.item.media.date
          ] }),
          Pe && /* @__PURE__ */ l("a", { href: et(Pe), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            ea(Pe, ze),
            " · ",
            Pe.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function Yt() {
    const E = mt.filter((X) => X.tagIds === null), P = mt.filter((X) => X.tagIds !== null);
    return /* @__PURE__ */ l(ge, { children: [
      ct(),
      _n(E, !1),
      /* @__PURE__ */ l("div", { className: `dq-batch-pick${Ae ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ l("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ r("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ r("div", { className: "dq-batch-answers", children: Fe.map((X, me) => {
            const ce = Dn(X.id);
            return /* @__PURE__ */ l("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ r(
                "input",
                {
                  type: "checkbox",
                  checked: N.includes(X.id),
                  "aria-labelledby": `${pe}-answer-${me}`,
                  "aria-describedby": `${pe}-effect-${me}`,
                  onChange: (Re) => Zn(X.id, Re.target.checked)
                }
              ),
              /* @__PURE__ */ r("span", { className: "dq-batch-answer-key", children: ce && /* @__PURE__ */ r(dt, { binding: ce, hidden: !0 }) }),
              /* @__PURE__ */ l("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ r(
                  "span",
                  {
                    id: `${pe}-answer-${me}`,
                    className: "dq-batch-answer-label",
                    title: X.label,
                    children: X.label
                  }
                ),
                /* @__PURE__ */ r(es, { id: `${pe}-effect-${me}`, parts: fe(X) })
              ] })
            ] }, X.id);
          }) })
        ] }),
        Ae && /* @__PURE__ */ l("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ r("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: _n(P, !1, E.length === 0) }),
          /* @__PURE__ */ r(
            Oi,
            {
              ...Ze,
              mediaKind: ze,
              actions: ke.actions,
              trees: a,
              flags: xt,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function jn(E) {
    const P = x, X = S && Xo.has(S.group) ? S.group : null, me = X ? ot.filter(Qt[X].test) : [], ce = (Re) => {
      const Ce = Wt(Re), Lt = Ce.skipped ? Dr(
        Re.before.ids,
        Ka(Re.before.ids, E.action, E.categories, !0).desired
      ) : xe(Re), ye = !Lt.added.length && !Lt.removed.length;
      return /* @__PURE__ */ l("div", { className: "dq-batch-plan", children: [
        Ce.skipped && /* @__PURE__ */ r("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        ye ? !Ce.kept.length && /* @__PURE__ */ r("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ r(ts, { added: Lt.added, removed: Lt.removed, tag: ut }),
        Ce.kept.map((qe, Ne) => /* @__PURE__ */ l("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          gr(qe.existing.map(ut)).map((Dt) => /* @__PURE__ */ r(Bt, { tag: Dt }, Dt.id)),
          " ",
          "instead of",
          " ",
          gr(qe.tagIds.map(ut)).map((Dt) => /* @__PURE__ */ r(Bt, { tag: Dt }, Dt.id))
        ] }, Ne))
      ] });
    };
    return /* @__PURE__ */ l(ge, { children: [
      /* @__PURE__ */ l("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ l("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ r(
            Zr,
            {
              value: ot.length,
              label: ot.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${P.hosts.toLocaleString()} ${P.hosts === 1 ? pn : `${pn}s`}`,
              pressed: mn("matching"),
              onToggle: () => Ft({ group: "matching" })
            }
          ),
          /* @__PURE__ */ r(
            Zr,
            {
              value: P.willChange,
              label: "will change",
              tone: "add",
              pressed: mn("change"),
              onToggle: () => Ft({ group: "change" })
            }
          ),
          /* @__PURE__ */ r(
            Zr,
            {
              value: P.correct,
              label: "already correct, no write",
              pressed: mn("correct"),
              onToggle: () => Ft({ group: "correct" })
            }
          ),
          /* @__PURE__ */ r(
            Zr,
            {
              value: P.different,
              label: y ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: mn("different"),
              onToggle: () => Ft({ group: "different" })
            }
          )
        ] }),
        me.length > 0 ? /* @__PURE__ */ r(
          ns,
          {
            title: Qt[X].title,
            entries: me,
            mediaKind: ze,
            resultHeading: "Planned change",
            describe: ce
          }
        ) : ot.length > 0 && /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        ot.length > 0 && /* @__PURE__ */ l("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ r("span", { children: tt ? `Dates ${tt.item.media.date}${Pe ? ` to ${Pe.item.media.date}` : ""}` : "No dates" }),
          tt && /* @__PURE__ */ r(
            "a",
            {
              href: et(tt),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${Et.one}, ${tt.item.media.date}`,
              title: ea(tt, ze),
              children: "Open earliest"
            }
          ),
          Pe && /* @__PURE__ */ r(
            "a",
            {
              href: et(Pe),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${Et.one}, ${Pe.item.media.date}`,
              title: ea(Pe, ze),
              children: "Open latest"
            }
          ),
          Ee.length < ot.length && /* @__PURE__ */ l("span", { children: [
            (ot.length - Ee.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (P.added.length > 0 || P.removed.length > 0) && /* @__PURE__ */ l("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ r("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ r(
            ts,
            {
              added: P.added,
              removed: P.removed,
              tag: ut,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      P.different > 0 && /* @__PURE__ */ l("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ r("span", { id: `${pe}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ l(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${pe}-choice`,
            children: [
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": !y, onClick: () => R(!1), children: "Keep their answer" }),
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": y, onClick: () => R(!0), children: "Replace it" })
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
    return /* @__PURE__ */ l(ge, { children: [
      ct(),
      _n(mt, !0),
      /* @__PURE__ */ l("div", { className: `dq-batch-cards${Ae ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ l("section", { className: "dq-batch-card", "aria-labelledby": `${pe}-chosen`, children: [
          /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ r("h3", { id: `${pe}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", disabled: F, onClick: Tt, children: "Change" })
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-chosen", children: it.map((E) => {
            const P = Dn(E.id);
            return /* @__PURE__ */ l("li", { children: [
              /* @__PURE__ */ l("span", { className: "dq-batch-chosen-chip", children: [
                P && /* @__PURE__ */ r(dt, { binding: P, hidden: !0 }),
                E.label
              ] }),
              /* @__PURE__ */ r(es, { parts: fe(E) })
            ] }, E.id);
          }) })
        ] }),
        Ae && /* @__PURE__ */ r(
          Oi,
          {
            ...Ze,
            mediaKind: ze,
            actions: ke.actions,
            trees: a,
            flags: xt,
            className: "dq-batch-card"
          }
        )
      ] }),
      F ? /* @__PURE__ */ r("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ r("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ r("span", {}) }) }) : g && jn(g)
    ] });
  }
  function gn(E) {
    const P = G ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, X = P.kind === "apply" ? ot.length - E.counts.pending : P.done, me = P.kind === "apply" ? ot.length : P.total, ce = F ? P.kind === "undo" ? "Undoing batch…" : P.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : P.kind === "undo" ? P.stopped ? "Undo stopped" : "Undo finished" : P.stopped ? "Stopped" : "Finished", Re = me ? Math.round(X / me * 100) : 100, Ce = S && !Xo.has(S.group) ? S.group : null, Lt = (qe) => Zo.find((Ne) => Ne.status === qe).label, ye = Ce ? ot.filter(
      (qe) => qe.status === Ce && (!S.reason || qe.error === S.reason)
    ) : [];
    return /* @__PURE__ */ l(ge, { children: [
      /* @__PURE__ */ l("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ r("h3", { tabIndex: -1, "data-batch-focus": "", children: ce }),
          /* @__PURE__ */ l("span", { children: [
            X.toLocaleString(),
            " of ",
            me.toLocaleString(),
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
            "aria-valuemax": me,
            "aria-valuenow": X,
            children: /* @__PURE__ */ r("span", { style: { width: `${Re}%` } })
          }
        ),
        !F && P.kind === "undo" && /* @__PURE__ */ l("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (P.total - E.recorded).toLocaleString(),
          " of",
          " ",
          P.total.toLocaleString(),
          " ",
          P.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ l("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ r("div", { className: "dq-batch-stats", "data-count": "5", children: Zo.map((qe) => /* @__PURE__ */ r(
          Zr,
          {
            value: E.counts[qe.status],
            label: qe.label,
            tone: qe.tone,
            pressed: mn(qe.status),
            onToggle: () => Ft({ group: qe.status })
          },
          qe.status
        )) }),
        E.reasons.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-batch-reasons", children: E.reasons.map((qe) => {
          const Ne = mn(qe.status, qe.error);
          return /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ l("span", { children: [
              qe.count.toLocaleString(),
              " ",
              qe.status,
              ": ",
              qe.error
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": Ne,
                onClick: () => Ft({ group: qe.status, reason: qe.error }),
                children: Ne ? "Hide them" : "Show them"
              }
            )
          ] }, `${qe.status}-${qe.error}`);
        }) }),
        ye.length > 0 ? /* @__PURE__ */ r(
          ns,
          {
            title: S.reason ? `${Lt(Ce)}: ${S.reason}` : `${Lt(Ce)} occurrences`,
            entries: ye,
            mediaKind: ze,
            resultHeading: "Result",
            describe: (qe) => qe.error ?? Lt(qe.status)
          }
        ) : /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      E.recorded > 0 && /* @__PURE__ */ l("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: F,
            onClick: () => void Ct("undo"),
            children: [
              /* @__PURE__ */ r(Ll, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ l("p", { children: [
          Xe ? P.stopped || F ? `${E.recorded.toLocaleString()} ${E.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${E.recorded.toLocaleString()} ${E.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${E.recorded === 1 ? "this change" : `these ${E.recorded.toLocaleString()} changes`} and keeps later edits.`,
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
        disabled: !it.length,
        onClick: Tn,
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
    ) : Z ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button primary", onClick: Tt, children: "Change answers" }, "change-answers") : /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void ve(),
        children: "Preview again"
      },
      "again"
    ) : F ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: Jt, children: Xe ? "Cancel undo" : "Cancel run" }, "cancel-run") : Xe || !pt ? null : /* @__PURE__ */ l(Di, { children: [
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
  return /* @__PURE__ */ l(Lu, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: W,
        title: "Apply answers to all matching occurrences",
        disabled: t || !Fe.length,
        onClick: () => {
          zt(), i(), u(!0);
        },
        children: [
          /* @__PURE__ */ r(Ro, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    c && /* @__PURE__ */ l(
      "dialog",
      {
        ref: K,
        className: "dq-batch-dialog",
        "aria-labelledby": `${pe}-title`,
        "aria-modal": "true",
        onCancel: (E) => {
          E.preventDefault(), qt();
        },
        onClose: () => {
          var E;
          be.current ? (E = K.current) == null || E.showModal() : qt();
        },
        children: [
          /* @__PURE__ */ l("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ r(Ro, { "aria-hidden": "true" }),
            /* @__PURE__ */ r("h2", { id: `${pe}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: F,
                onClick: qt,
                children: /* @__PURE__ */ r(da, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r(qf, { step: p }),
          /* @__PURE__ */ l(
            "div",
            {
              className: "dq-batch-body",
              ref: T,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": p === "preview" ? "" : void 0,
              "aria-label": `${Mi.find((E) => E.id === p).label} step`,
              children: [
                /* @__PURE__ */ l("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  ae && /* @__PURE__ */ r("p", { role: "status", children: ae }),
                  B && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: B })
                ] }),
                p === "answers" ? Yt() : p === "preview" ? Pt() : gn(pt)
              ]
            }
          ),
          /* @__PURE__ */ l("div", { className: "dq-batch-footer", children: [
            p === "preview" && /* @__PURE__ */ l("button", { type: "button", className: "dq-button", disabled: F, onClick: Tt, children: [
              /* @__PURE__ */ r(ua, { "aria-hidden": "true" }),
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
const _c = "data-quality.description-collapsed.v1";
function Ef() {
  try {
    return localStorage.getItem(_c) === "true";
  } catch {
    return !1;
  }
}
function Cf({
  details: e,
  label: t
}) {
  const [n, a] = C(Ef), i = Sn(() => {
    a((o) => {
      const s = !o;
      try {
        localStorage.setItem(_c, String(s));
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
        onClick: i,
        children: "Description"
      }
    ),
    !n && (e != null && e.trim() ? /* @__PURE__ */ r(ql, { className: "dq-description-body", children: e }) : /* @__PURE__ */ r("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
const Af = (e) => "";
function Tf({
  ranking: e,
  busy: t,
  error: n,
  focus: a,
  disabled: i,
  labels: o,
  flagLabel: s = Af,
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
        o.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ r("p", { children: d.length ? `Most matching ${o.queue}s first` : `No performer has matching ${o.many}.` }) : null,
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "Refresh counts",
          title: "Refresh counts",
          disabled: t || i,
          onClick: p,
          children: /* @__PURE__ */ r(Dl, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-queue-list", children: d.map((b) => {
      const w = `${b.count.toLocaleString()} matching ${b.count === 1 ? o.one : o.many}`, N = s(b.tags);
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${b.name}, ${w}${N ? `. ${N}` : ""}`,
          title: N || void 0,
          "aria-current": a === b.id ? "true" : void 0,
          disabled: i,
          onClick: () => c(b.id),
          children: [
            /* @__PURE__ */ r(xr, { performer: b }),
            /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: b.name }),
            N && /* @__PURE__ */ r(Fn, { className: "dq-flag-icon", "aria-hidden": "true" }),
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
        disabled: i,
        onClick: u,
        children: "Show more performers"
      }
    )
  ] });
}
const If = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], Rf = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function $f(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), a = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: a, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function Oa(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Of(e, t) {
  const n = zi(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", a = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Oa(a, "or")}`,
    includesAll: `has ${Oa(a, "and")}`,
    excludes: `has none of ${Oa(a, "or")}`,
    excludesAll: `missing ${Oa(a, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function Mf({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: a,
  onEditCriteria: i
}) {
  const [o, s] = C(!1), [c, u] = C(null), p = $(null), d = $(null), g = at(), m = jr(e.conditionTagIds), b = Of(e, m);
  kt(() => {
    const y = p.current;
    if (!o || !y) return;
    const R = () => u($f(y));
    R(), window.addEventListener("resize", R);
    const F = typeof ResizeObserver > "u" ? null : new ResizeObserver(R), _ = [y, y.closest(".dq-review-header-trail"), y.closest("header")];
    for (const B of _) B && (F == null || F.observe(B));
    return () => {
      window.removeEventListener("resize", R), F == null || F.disconnect();
    };
  }, [o]), Q(() => {
    var R, F;
    if (!o) return;
    const y = (R = d.current) == null ? void 0 : R.querySelector('[aria-pressed="true"]');
    y && !y.disabled ? y.focus() : (F = d.current) == null || F.focus();
  }, [o]);
  const w = () => {
    s(!1), requestAnimationFrame(() => {
      var y;
      return (y = p.current) == null ? void 0 : y.focus();
    });
  }, N = (y) => {
    if (!(y.target instanceof Element && y.target.closest('[role="dialog"]') !== d.current || y.defaultPrevented)) {
      if (y.key === "Escape")
        y.preventDefault(), w();
      else if (y.key === "Tab" && d.current) {
        const F = [...d.current.querySelectorAll(Rf)].filter((Z) => Z.closest('[role="dialog"]') === d.current).sort(
          (Z, ne) => Z.compareDocumentPosition(ne) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!F.length) return;
        const _ = F[0], B = F[F.length - 1], L = document.activeElement;
        y.shiftKey && (L === _ || L === d.current) ? (y.preventDefault(), B.focus()) : !y.shiftKey && L === B && (y.preventDefault(), _.focus());
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
        "aria-expanded": o,
        "aria-controls": o ? g : void 0,
        title: b,
        onClick: () => o ? w() : s(!0),
        children: [
          /* @__PURE__ */ r(ks, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-summary", children: b }),
          /* @__PURE__ */ r(Ui, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ l(ge, { children: [
      /* @__PURE__ */ r("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: w }),
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
          onKeyDown: N,
          children: [
            /* @__PURE__ */ l("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: If.map(({ mode: y, label: R }) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === y,
                  onClick: () => e.targetMode !== y && a({ targetMode: y }),
                  children: R
                },
                y
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ r(
                Qn,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (y) => a({ performerIds: y }),
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
                    criteriaDefinitions: _i,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (y) => a({ performerFilter: y })
                  }
                ) }),
                /* @__PURE__ */ l("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ r(Lr, { "aria-hidden": "true" }),
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
                  onChange: (y) => a({ condition: y.target.value }),
                  children: Vi.map((y) => /* @__PURE__ */ r("option", { value: y, children: Bi[y] }, y))
                }
              ),
              q && /* @__PURE__ */ l(ge, { children: [
                /* @__PURE__ */ r(
                  Qn,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (y) => a({ conditionTagIds: y }),
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
                        onChange: (y) => a({ includeSubtags: y.target.checked })
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
                        onChange: (y) => a({ hideConfirmedAbsent: y.target.checked })
                      }
                    ),
                    "Hide occurrences confirmed absent"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ l("div", { className: "dq-scope-footer", children: [
              /* @__PURE__ */ r("p", { children: n ? "Applies to this queue at once, and Save review keeps it." : "Applies to this queue at once; Save to review in the header keeps it." }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: w, children: "Done" })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function Pa(e) {
  const {
    page: t,
    perPage: n,
    sort: a,
    direction: i,
    sorts: o,
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
function Ff(e) {
  const t = e.occurrence;
  return JSON.stringify([
    Ue(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function xf(e, t) {
  const n = Ue(e) === "audio", a = (s) => ({
    id: s.id,
    name: s.name,
    total: (n ? s.audioCount : s.videoCount) ?? 0,
    tags: (s.tags ?? []).map((c) => ({ id: c.id, name: c.name }))
  }), i = e.occurrence, o = [];
  if (i.targetMode === "selected" && i.performerIds.length > 0)
    for (const s of i.performerIds) {
      const c = await vd(
        `/api/performers/${s}`,
        { signal: t }
      );
      c && o.push(a(c));
    }
  else {
    const { _filterExpression: s, ...c } = i.targetMode === "filter" ? i.performerFilter : {};
    for (let u = 1; ; u++) {
      const p = await ue(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            Pn({
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
      if (o.push(...p.items.map(a)), u * 1e3 >= p.totalCount || !p.items.length) break;
    }
  }
  return o.sort((s, c) => c.total - s.total || s.id - c.id);
}
function jc(e, t, n) {
  const a = bo(e, [t]);
  return Sd(a, a.view.filter, n);
}
function Uc(e, t) {
  const n = e.findIndex(
    (a) => a.count < t.count || a.count === t.count && a.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function Fi(e, t, n, a) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= a && i < n[a - 1].count;
}
async function Pf(e, t, n, a, i = {}) {
  const o = Pa(e), s = Ff(e), c = Rc(e.occurrence), u = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await xf(e, a),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: p } = u, d = [...u.ranked];
  let g = u.cursor, m = !1;
  const b = (w) => ({
    ...u,
    cursor: g,
    ranked: [...d],
    limit: n,
    complete: !w && Fi(p, g, d, n),
    ...w ? { partial: w } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var w;
        for (; !m && !Fi(p, g, d, n); ) {
          a.throwIfAborted();
          const N = p[g++], q = await jc(e, N.id, a);
          q > 0 && Uc(d, { ...N, count: q }), (w = i.onProgress) == null || w.call(i, b(!0));
        }
      })
    );
  } catch (w) {
    throw m = !0, w;
  }
  return a.throwIfAborted(), b(!1);
}
function Lf(e, t, n) {
  const a = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || a < 0 || a >= e.cursor) return e;
  const i = e.ranked.filter((o) => o.id !== t);
  return n > 0 && Uc(i, { ...e.candidates[a], count: n }), {
    ...e,
    ranked: i,
    complete: Fi(e.candidates, e.cursor, i, e.limit)
  };
}
const xi = /* @__PURE__ */ new Map();
function Df(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function Gc(e, t) {
  const n = Df(t);
  return xi.set(e, n), n;
}
function _f(e) {
  const [t, n] = C(null);
  if (Q(() => {
    if (e === null || xi.has(e)) return;
    const a = new AbortController();
    return ue(`/api/performers/${e}`, { signal: a.signal }).then(
      (i) => {
        const o = Gc(e, i == null ? void 0 : i.tags);
        a.signal.aborted || n({ id: e, tags: o });
      },
      () => {
      }
    ), () => a.abort();
  }, [e]), e !== null)
    return xi.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
function yr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => yr(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, a = t, i = Object.keys(n).sort(), o = Object.keys(a).sort();
  return i.length === o.length && i.every(
    (s, c) => s === o[c] && yr(n[s], a[s])
  );
}
function jf(e) {
  var c, u, p;
  const [t, n] = C({}), [a, i] = C(""), o = (((c = e == null ? void 0 : e.presentation) == null ? void 0 : c.annotations) ?? []).includes("tags") ? ((u = e == null ? void 0 : e.presentation) == null ? void 0 : u.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...o,
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return Q(() => {
    let d = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(s).map(
        async (g) => [g, await Ja([g])]
      )
    ).then((g) => {
      d && n(Object.fromEntries(g));
    }).catch(() => {
      d && i(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      d = !1;
    };
  }, [s]), { ids: t, error: a };
}
function Uf(e, t, n) {
  const a = t == null ? void 0 : t.presentation, i = (a == null ? void 0 : a.annotations) ?? [], o = (a == null ? void 0 : a.annotationParents) ?? [];
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
          var u;
          return c !== s.id && ((u = n[c]) == null ? void 0 : u.includes(s.id));
        }
      )
    ) : []
  };
}
function Gf({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: a,
  disabled: i,
  onToggle: o
}) {
  var w;
  const s = ((w = t.presentation) == null ? void 0 : w.binParents) ?? [], c = new Set(
    s.flatMap((N) => (a[N] ?? []).filter((q) => q !== N))
  ), u = s.every((N) => a[N]), p = ga(t.view.objectFilter, n).bins.filter(
    (N) => !u || c.has(N)
  ), d = /* @__PURE__ */ new Map();
  for (const N of e)
    for (const q of N.tags ?? [])
      if (c.has(q.id)) {
        const y = d.get(q.id) ?? { name: q.name, count: 0 };
        y.count++, d.set(q.id, y);
      }
  const g = p.filter((N) => !d.has(N)), m = jr(g);
  for (const N of g)
    d.set(N, {
      name: m[N] === void 0 ? "…" : m[N] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const b = [...d].sort((N, q) => N[1].name.localeCompare(q[1].name));
  return /* @__PURE__ */ l("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ r("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    b.map(([N, q]) => {
      const y = p.includes(N);
      return /* @__PURE__ */ l(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": y,
          title: y ? `Show every video again, not only ${q.name}` : `Show only videos tagged ${q.name}`,
          disabled: i,
          onClick: () => o(N),
          children: [
            y && /* @__PURE__ */ r(la, { "aria-hidden": "true" }),
            q.name,
            " ",
            /* @__PURE__ */ r("span", { className: "dq-bin-count", children: q.count })
          ]
        },
        N
      );
    }),
    !b.length && /* @__PURE__ */ r("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function pr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Kf(e) {
  if (!pr(e) || Object.keys(e).length !== 1 || !pr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !pr(t.tagsCriterion)) return null;
  const { value: n, modifier: a, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && a === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function ga(e, t) {
  let n = e;
  const a = [];
  for (; ; ) {
    if (t && yr(n, t)) {
      n = t;
      break;
    }
    const i = Object.keys(n);
    if (i.length !== 1 || i[0] !== "_filterExpression") break;
    const o = n._filterExpression;
    if (!pr(o) || o.operator !== "AND" || !Array.isArray(o.children))
      break;
    const s = o.children, c = Kf(s.at(-1));
    if (c == null || s.length > 3) break;
    let u = {}, p = null, d = !0;
    for (const [g, m] of s.slice(0, -1).entries())
      !pr(m) || Object.keys(m).length !== 1 ? d = !1 : g === 0 && pr(m.filter) && Object.keys(m.filter).length ? u = m.filter : !p && pr(m.group) ? p = m.group : d = !1;
    if (!d) break;
    a.unshift(c), n = p ? { ...u, _filterExpression: p } : u;
  }
  return { base: n, bins: a };
}
function Bf(e, t, n) {
  const { base: a, bins: i } = ga(e.view.objectFilter, n);
  return (i.includes(t) ? i.filter((s) => s !== t) : [...i, t]).reduce(Vf, { ...e, view: { ...e.view, objectFilter: a } });
}
function Vf(e, t) {
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
const Ha = [
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
], zf = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function vr(e) {
  const t = Te(e) ? e.occurrence : void 0;
  return {
    filter: Kt({
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
function rs(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function Pi(e, t) {
  let n;
  if (Te(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!Ha.some((c) => c !== "performer" && t.has(c))) {
    const c = vr(e);
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
    const c = t.get("sorts").split(",").map((u) => {
      const p = u.lastIndexOf(":");
      return { key: u.slice(0, p), direction: u.slice(p + 1) };
    });
    if (c.some((u) => !u.key || !["asc", "desc"].includes(u.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = c, i.sort = c[0].key, i.direction = c[0].direction;
  }
  let o;
  if (Te(e) && (o = {
    ...zf,
    ...rs(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !Vi.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Kt(i, Ue(e)),
      objectFilter: rs(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const as = { dataQualityOpenedFromList: !0 };
function Kc() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function Bc(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...as }, "", e) : window.history.replaceState(Kc() ? { ...as } : null, "", e);
}
function na(e, t) {
  const n = new URLSearchParams(window.location.search);
  Ha.forEach((a) => n.delete(a)), n.set("review", e);
  for (const a of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[a] !== void 0 && n.set(a, String(t.filter[a]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((a) => `${a.key}:${a.direction}`).join(",")
  ), n.set("filters", JSON.stringify(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), Bc(`${window.location.pathname}?${n}${window.location.hash}`);
}
function kn(e, t) {
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
function br(e) {
  const t = e;
  return kn(t, vr(t));
}
function is(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !yr(
    JSON.parse(zn(kn(e, t))),
    JSON.parse(zn(kn(e, vr(e))))
  );
}
function Vc(e, t) {
  if (je(e) !== "video") return e;
  const { base: n, bins: a } = ga(e.view.objectFilter, t.view.objectFilter);
  return a.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function Ma(e, t) {
  if (je(e) !== "video") return t;
  const { base: n, bins: a } = ga(t.objectFilter, e.view.objectFilter);
  return a.length ? { ...t, objectFilter: n } : t;
}
function os(e, t) {
  return !t || !Te(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function ui(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const a of e)
    n.set(a.media.id, [...n.get(a.media.id) ?? [], a]);
  return [...n.values()].reverse().flat();
}
const tn = (e) => e instanceof Error ? e.message : "Request failed.", fi = 50, Jf = [], ss = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function Wf(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Cl(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? vs(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Hf({ media: e, kind: t }) {
  const [n, a] = C(!1);
  return /* @__PURE__ */ r("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ r(Cs, {}) : /* @__PURE__ */ r(Va, {}) : /* @__PURE__ */ r(
    "img",
    {
      src: vi(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => a(!0)
    }
  ) });
}
function Qf({
  tags: e,
  preview: t,
  showPreview: n,
  trees: a,
  actionTagIds: i,
  label: o
}) {
  const s = co(t), c = n ? s : null, u = e == null ? void 0 : e.absent, p = pa(
    he(() => [...i, ...u ?? []], [i, u])
  ), d = (B) => p[B] ?? { id: B, name: p[B] === void 0 ? "…" : "Unavailable tag" }, g = (B) => gr(B.map(d)), m = c && e ? to(c, e, a) : null, b = e ? Pd(e) : [], w = new Set(b.map((B) => B.id)), N = new Set(m == null ? void 0 : m.removed), q = new Set(m == null ? void 0 : m.markedAbsent), y = new Set(m == null ? void 0 : m.absenceCleared), R = /* @__PURE__ */ l("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ r(La, { "aria-hidden": "true" }),
    "absent"
  ] }), F = g((m == null ? void 0 : m.added) ?? []), _ = g(((m == null ? void 0 : m.markedAbsent) ?? []).filter((B) => !w.has(B)));
  return /* @__PURE__ */ l("section", { className: "dq-panel-section", "aria-label": o, children: [
    /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ l(ge, { children: [
      b.length || F.length || _.length ? /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        b.map(
          (B) => N.has(B.id) ? /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ l("del", { children: [
              "− ",
              /* @__PURE__ */ r(Bt, { tag: B })
            ] }),
            q.has(B.id) && R
          ] }, B.id) : /* @__PURE__ */ r("li", { className: "dq-tag", children: /* @__PURE__ */ r(Bt, { tag: B }) }, B.id)
        ),
        F.map((B) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
          "+ ",
          /* @__PURE__ */ r(Bt, { tag: B })
        ] }) }, `added-${B.id}`)),
        _.map((B) => /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ r("ins", { children: /* @__PURE__ */ r(Bt, { tag: B }) }),
          R
        ] }, `absent-${B.id}`))
      ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ l(ge, { children: [
        /* @__PURE__ */ r("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((B) => /* @__PURE__ */ l(
          "li",
          {
            className: `dq-tag dq-tag-absent${y.has(B.id) ? " dq-tag-removed" : ""}`,
            children: [
              /* @__PURE__ */ r(La, { "aria-hidden": "true" }),
              y.has(B.id) ? /* @__PURE__ */ l("del", { children: [
                "− ",
                /* @__PURE__ */ r(Bt, { tag: B })
              ] }) : /* @__PURE__ */ r(Bt, { tag: B })
            ]
          },
          B.id
        )) })
      ] })
    ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading…" })
  ] });
}
function Yf({ entries: e }) {
  return /* @__PURE__ */ r("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ l("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ r("span", { className: "dq-attention-category", children: t.name }),
    ro(t).map((n) => /* @__PURE__ */ l("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ r(Fn, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function Xf({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: a,
  onSaveDefaults: i,
  editRequest: o = 0,
  onEditRequestHandled: s,
  pageControls: c,
  stayOnTap: u,
  onStayOnTapChange: p
}) {
  var Tr;
  const d = Ue(e), g = En(d), m = d === "audio" ? "Audio" : "Scene", b = (h) => {
    var k;
    return h.title || ((k = h.files[0]) == null ? void 0 : k.basename) || m;
  }, w = (h) => `${h.occurrence ? `${h.occurrence.performer.name} — ` : ""}${b(h.media)}`, N = $(null), q = $("");
  if (!N.current)
    try {
      N.current = Pi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (h) {
      q.current = tn(h), N.current = { query: vr(e), startAtEnd: !1 };
    }
  const [y, R] = C(null), [F, _] = C(""), B = $(null), L = $(null), Z = $(null), ne = $(null), [ae, ie] = C(!!q.current), G = $(0), [D, S] = C(N.current.query), I = $(D);
  I.current = D;
  const [Y, A] = C(0), V = $(N.current.startAtEnd), [z, K] = C([]), [T, W] = C(null), H = $(null), [oe, Ie] = C(null), [Ge, j] = C(0), be = he(() => {
    if (!T) return null;
    const h = z.findIndex((k) => k.key === T.key);
    return h < 0 ? null : z.slice(h + 1).find((k) => k.media.id !== T.media.id) ?? null;
  }, [T, z]), [$e, pe] = C(0), [Oe, Xe] = C(!1), [ke, Cn] = C(!1), we = $(!1), ze = $(!0), Et = $(null);
  Q(() => (ze.current = !0, () => {
    ze.current = !1;
  }), []);
  const [pn, Fe] = C(q.current), [it, Ae] = C(""), [Ze, Vt] = C(null), [Me, An] = C(!1), [ut, Mt] = C([]), ht = $([]), zt = $(null), qt = $(null), Zn = $(null);
  Q(() => {
    var h, k;
    Me && ((k = (h = Zn.current) == null ? void 0 : h.querySelector("input")) == null || k.focus());
  }, [Me]);
  const [Tt, Tn] = C(!1), [Jt, Ft] = C(!1), mn = ma(), [ve, Ct] = C(!1), ot = u ?? ve, Ln = p ?? Ct;
  Q(() => {
    if (Oe || Tt || !qt.current) return;
    const h = requestAnimationFrame(() => {
      if (document.querySelector(ss)) return;
      const k = qt.current;
      qt.current = null;
      const O = document.activeElement;
      O && O !== document.body || k != null && k.isConnected && !k.disabled && k.focus();
    });
    return () => cancelAnimationFrame(h);
  }, [Oe, Tt, Y]);
  const [Wt, xe] = C([]), [It, se] = C({}), x = $(null), Ee = $(0), [pt, Dn] = C({});
  Q(() => {
    let h = !0;
    return Promise.all(
      po(D.objectFilter).map(
        async (k) => [
          String(k),
          (await ue(`/api/tags/${k}`)).name
        ]
      )
    ).then((k) => {
      h && Dn(Object.fromEntries(k));
    }).catch(() => {
    }), () => {
      h = !1;
    };
  }, [D.objectFilter]);
  const fe = he(
    () => mo(D.objectFilter, pt),
    [pt, D.objectFilter]
  ), Rt = $(0), tt = $(e);
  tt.current = e;
  const Pe = y ?? e, et = he(
    () => kn(Pe, D),
    [Pe, D]
  ), Ht = he(
    () => os(et, D.performerFocus),
    [et, D.performerFocus]
  ), st = $(Ht);
  st.current = Ht;
  const mt = $(et);
  mt.current = et;
  const [xt, Qt] = C("items"), [ct, _n] = C(null), Yt = $(null), jn = $("");
  function Pt(h) {
    const k = typeof h == "function" ? h(Yt.current) : h;
    Yt.current = k, _n(k);
  }
  const [gn, nn] = C(!1), [E, P] = C(null), X = $(null), me = Te(et) ? Pa(et) : "", [ce, Re] = C(0), [Ce, Lt] = C(null);
  Q(() => () => {
    var h;
    return (h = X.current) == null ? void 0 : h.controller.abort();
  }, []), Q(() => {
    const h = X.current;
    !h || h.signature === me || (h.controller.abort(), X.current = null, nn(!1));
  }, [me]), Q(() => {
    var O;
    const h = Yt.current;
    if (xt !== "performers" || !me || ((O = X.current) == null ? void 0 : O.signature) === me || jn.current === me || (h == null ? void 0 : h.signature) === me && h.complete)
      return;
    const k = (h == null ? void 0 : h.signature) === me ? h : null;
    kr(h, (k == null ? void 0 : k.limit) ?? fi);
  }, [xt, me, ct, E, gn]);
  const ye = D.performerFocus;
  Q(() => {
    if (!ye) {
      Lt(null);
      return;
    }
    let h = !0;
    return ue(`/api/performers/${ye}`).then((k) => {
      const O = Gc(ye, k.tags);
      h && Lt({ id: ye, name: k.name, tags: O });
    }).catch(() => {
    }), () => {
      h = !1;
    };
  }, [ye]);
  const qe = JSON.stringify(
    Te(et) ? Rs(et.occurrence) : []
  ), Ne = he(() => JSON.parse(qe), [qe]), Dt = he(() => jd(Ne), [Ne]), In = Hs(Dt), Ur = pa(Dt), Gr = (h) => {
    var k;
    return ((k = Ur[h]) == null ? void 0 : k.name) ?? (Ur[h] === null ? "Unavailable tag" : "…");
  }, Kr = (h) => ({
    name: Gr(h),
    tagIds: In.get(h) ?? [h],
    resolved: In.has(h)
  }), St = Dc(
    Te(et) ? et : null,
    ye ?? null,
    ce
  ), Xt = is(e, D), er = is(e, Ma(e, D)), gt = ke || Oe || Me, bn = Number(D.filter.page);
  function De(h, k = !1) {
    we.current || (q.current = "", V.current = k, I.current = h, S(h), pe(0), Xe(!0), k || na(e.id, h), A((O) => O + 1));
  }
  function nt() {
    if (we.current = !1, Cn(!1), ze.current && Et.current) {
      const h = Et.current;
      Et.current = null, De(h.query, h.startAtEnd);
    }
  }
  Q(() => {
    const h = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const k = Pi(
            tt.current,
            new URLSearchParams(window.location.search)
          );
          we.current ? Et.current = k : De(k.query, k.startAtEnd);
        } catch (k) {
          Fe(tn(k));
        }
    };
    return window.addEventListener("popstate", h), () => window.removeEventListener("popstate", h);
  }, [e.id]), Q(() => (a(ke || Oe || Me || !!y), () => a(!1)), [ke, Oe, Me, !!y, a]);
  async function bt(h, k, O) {
    if (Te(h)) {
      const de = await $c(
        h,
        x.current,
        k,
        O
      );
      return {
        items: de.items.map((le) => ({
          key: le.key,
          media: le.media,
          occurrence: le
        })),
        totalCount: de.totalCount
      };
    }
    const te = await ta(
      h,
      { ...h.view.filter, page: k },
      O
    );
    return {
      items: te.items.map((de) => ({ key: String(de.id), media: de })),
      totalCount: te.totalCount
    };
  }
  function wt(h, k, O, te = !1, de = !1) {
    if (!ze.current || Et.current) return;
    ie(!0), K(
      de ? h.items : ui(h.items, I.current.startFrom === "end")
    ), pe(h.totalCount), _t(O, te);
    const le = {
      ...I.current,
      filter: { ...I.current.filter, page: k }
    };
    I.current = le, S(le), na(e.id, le);
  }
  function _t(h, k = !1) {
    (h == null ? void 0 : h.key) !== (T == null ? void 0 : T.key) && (H.current = null), (h == null ? void 0 : h.media.id) !== (T == null ? void 0 : T.media.id) && Ie(k && h ? h.media.id : null), W(h);
  }
  Q(() => {
    if (q.current) return;
    const h = new AbortController();
    ne.current = h;
    const k = ++Rt.current;
    return Xe(!0), Fe(""), Ae(""), H.current = null, Ie(null), W(null), K([]), An(!1), (async () => {
      const O = os(
        kn(tt.current, I.current),
        I.current.performerFocus
      );
      x.current = Te(O) ? await go(O, h.signal) : null;
      let te = Number(O.view.filter.page), de = await bt(O, te, h.signal);
      const le = Math.max(
        1,
        Math.ceil(de.totalCount / Number(O.view.filter.perPage))
      );
      (V.current || te > le) && (te = le, de = await bt(O, te, h.signal)), V.current = !1;
      const Qe = O.view.startFrom === "end" ? -1 : 1;
      for (; Te(O) && !de.items.length && te + Qe >= 1 && te + Qe <= le && !h.signal.aborted; )
        te += Qe, de = await bt(O, te, h.signal);
      if (k !== Rt.current || h.signal.aborted) return;
      const Ot = ui(de.items, O.view.startFrom === "end");
      wt(de, te, Ot[0] ?? null);
    })().catch((O) => {
      !h.signal.aborted && k === Rt.current && Fe(tn(O));
    }).finally(() => {
      !h.signal.aborted && k === Rt.current && (ie(!0), Xe(!1));
    }), () => {
      h.abort(), Rt.current++;
    };
  }, [Y, e.id]), Q(() => {
    if (Vt(null), !T) return;
    let h = !0;
    return hn(d, T).then((k) => {
      h && (Vt(k), xe(
        Te(e) ? k.ids.filter((O) => e.occurrence.tagIds.includes(O)) : []
      ));
    }).catch((k) => {
      h && Fe(`Could not load current tags. ${tn(k)}`);
    }), () => {
      h = !1;
    };
  }, [T]), Q(() => {
    if (!Te(e) || e.actions.length)
      return;
    let h = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (k) => [
          k,
          (await ue(`/api/tags/${k}`)).name
        ]
      )
    ).then((k) => {
      h && se(Object.fromEntries(k));
    }).catch((k) => {
      h && Fe(tn(k));
    }), () => {
      h = !1;
    };
  }, [e]);
  async function jt(h = !1, k = !1, O = !1) {
    var qn;
    if (!T) return;
    const te = z.findIndex((Je) => Je.key === T.key), de = D.startFrom === "end" ? -1 : 1, le = ((qn = H.current) == null ? void 0 : qn.key) === T.key ? H.current : { key: T.key, page: bn, before: z.slice(0, te + 1).map((Je) => Je.key), after: z.slice(te + 1).map((Je) => Je.key) }, Qe = new Set(le.after), Ot = new Set(le.before), Be = z.find((Je) => {
      var dn;
      return Qe.has(Je.key) || (de === 1 || bn < le.page) && ((dn = H.current) == null ? void 0 : dn.key) === T.key && !Ot.has(Je.key);
    });
    if (!h && Be) {
      _t(Be, O);
      return;
    }
    const yt = h ? Ot : new Set(z.map((Je) => Je.key)), lt = 1100 - (Date.now() - Ee.current);
    lt > 0 && await new Promise((Je) => window.setTimeout(Je, lt));
    let Ve = de === -1 && !h ? Math.max(1, bn - 1) : bn;
    for (; ze.current && !Et.current; ) {
      let Je = await bt(Ht, Ve);
      const dn = Math.max(
        1,
        Math.ceil(Je.totalCount / Number(D.filter.perPage))
      );
      Ve > dn && (Ve = dn, Je = await bt(Ht, Ve));
      const Ut = ui(Je.items, de === -1), Qr = new Map(Ut.map((At) => [At.key, At])), qa = h ? le.after.flatMap((At) => {
        const Rr = Qr.get(At);
        return Rr ? [Rr] : [];
      }) : [], Sa = new Set(qa.map((At) => At.key)), ur = h ? {
        ...Je,
        items: [
          ...qa,
          ...Ut.filter(
            (At) => At.key !== T.key && !Sa.has(At.key)
          )
        ]
      } : Je;
      if (k) {
        H.current = le, wt(ur, Ve, T, !1, h);
        return;
      }
      const Ir = de === -1 && bn === 1 && !h ? void 0 : ur.items.find(
        (At) => !yt.has(At.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(h && de === -1 && Ve === le.page) || Qe.has(At.key))
      );
      if (Ir || (de === -1 ? Ve <= 1 : Ve >= dn)) {
        wt(
          ur,
          Ve,
          Ir ?? null,
          O,
          h
        ), Ir || Ae(
          Je.totalCount ? `Reached the end in this direction. Matching items remain available from the ${g.queue} pages.` : `No matching ${g.many}.`
        );
        return;
      }
      Ve += de;
    }
  }
  async function rn(h, k = !1, O = !1, te = !1) {
    if (y || !T || we.current || Oe || Me && !O)
      return;
    const de = O || te || !!(h != null && h.steps.length);
    if (de && (!t || !Ze) || h && Hn(h) && !n) return;
    const le = !k && !O && !te && de && h !== void 0 && Ze !== null && _o(e) && ki(Si(e.actions, Dd(h, Ze, cn))).length > 0;
    we.current = !0, Cn(!0), Fe(""), Ae("");
    const Qe = z.findIndex((lt) => lt.key === T.key), Ot = de && !k && !le && Qe >= 0 ? z[Qe + 1] ?? null : null;
    Ot && (K(
      (lt) => lt.filter((Ve) => Ve.key !== T.key)
    ), _t(Ot, !0));
    let Be = !1, yt = [];
    try {
      if (de) {
        const lt = await hn(d, T);
        if (h)
          await sf(Ht, T, h);
        else {
          const qn = te && Te(e) ? e.occurrence.tagIds.filter((Ut) => lt.ids.includes(Ut)) : ht.current, dn = Dr(qn, te ? Wt : ut);
          await yo(Ht, T, dn);
        }
        Ee.current = Date.now();
        const Ve = await hn(d, T);
        Ot || Vt(Ve), Be = !0, An(!1), le && (yt = ki(Si(e.actions, Ve))), Ae(
          yt.length ? `Tags saved. Staying until answered: ${yt.map((qn) => qn.name).join(", ")}.` : "Tags saved."
        ), T.occurrence && (wa(T.occurrence.performer.id), Re((qn) => qn + 1));
      }
      if (!ze.current || Et.current) return;
      de ? yt.length || await jt(!0, k, !k) : k || await jt(), k && O && requestAnimationFrame(() => {
        var lt;
        return (lt = zt.current) == null ? void 0 : lt.focus();
      });
    } catch (lt) {
      if (Fe(
        Be ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${tn(lt)}` : de ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${tn(lt)}` : `Could not advance. ${tn(lt)}`
      ), de && !Be) {
        Ot && (K(z), Ie(null), j((Ve) => Ve + 1), W(T)), Ee.current = Date.now();
        try {
          Vt(await hn(d, T));
        } catch {
          Vt(null), Fe(
            (Ve) => `${Ve} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      nt();
    }
  }
  const tr = !Me && !y && !Tt && !Jt && (T != null || Oe || ke);
  ao({
    surface: "local",
    enabled: tr,
    actions: e.actions,
    onAction: (h, k) => {
      const O = e.actions[h];
      O && rn(O, k);
    },
    onFind: () => Ft(!0)
  });
  const an = (h) => ke || Oe || !Ze || !!y || !t && h.steps.length > 0 || !n && Hn(h);
  function Zt() {
    !i || y || we.current || Me || (Z.current = document.activeElement, L.current = {
      error: pn,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(I.current),
      items: z,
      current: T,
      total: $e,
      targets: x.current,
      stayedCursor: H.current
    }, R(structuredClone(e)), _(""), Ae(""), Fe(""));
  }
  Q(() => {
    if (!o) {
      G.current = 0;
      return;
    }
    o !== G.current && ae && !Oe && (G.current = o, Zt(), s == null || s());
  }, [o, Oe, ae]);
  function qr() {
    R(null), _(""), requestAnimationFrame(() => {
      const h = Z.current;
      h != null && h.isConnected && h !== document.body && h.focus();
    });
  }
  function Sr() {
    var k;
    const h = L.current;
    !h || ke || ((k = ne.current) == null || k.abort(), Rt.current++, I.current = h.query, S(h.query), K(h.items), W(h.current), pe(h.total), x.current = h.targets, H.current = h.stayedCursor, Xe(!1), Fe(h.error), Ae(""), window.history.replaceState(window.history.state, "", h.url), qr());
  }
  async function ba() {
    if (!y || !i || we.current) return;
    const h = kn(
      { ...y, name: y.name.trim() },
      Ma(tt.current, I.current)
    ), k = oa(h);
    if (k) {
      _(k);
      return;
    }
    we.current = !0, Cn(!0), _("");
    try {
      if (await i(h) === !1) throw new Error("Could not save review.");
      qr(), Ae("Review saved.");
    } catch (O) {
      _(
        "Could not save review. Your edits are still open. " + tn(O)
      );
    } finally {
      nt();
    }
  }
  async function Le() {
    if (!i || we.current) return;
    const h = Ma(tt.current, I.current), k = kn(tt.current, {
      ...h,
      filter: { ...h.filter, page: 1 }
    });
    we.current = !0, Cn(!0), Fe("");
    try {
      if (await i(k) === !1) throw new Error("Could not save review.");
      Ae("Queue saved to this review.");
    } catch (O) {
      Fe("Could not save queue. " + tn(O));
    } finally {
      nt();
    }
  }
  const ft = D.performerScope, wn = (h) => {
    const { performerFocus: k, ...O } = I.current, te = k && !("targetMode" in h || "performerIds" in h || "performerFilter" in h);
    De({
      ...O,
      ...te ? { performerFocus: k } : {},
      filter: { ...O.filter, page: 1 },
      performerScope: { ...ft, ...h }
    });
  };
  async function kr(h, k) {
    var de;
    const O = mt.current;
    if (!Te(O)) return;
    (de = X.current) == null || de.controller.abort();
    const te = {
      signature: Pa(O),
      controller: new AbortController()
    };
    X.current = te, jn.current = "", nn(!0), P(null);
    try {
      const le = await Pf(O, h, k, te.controller.signal, {
        onProgress: (Qe) => {
          X.current === te && Pt(Qe);
        }
      });
      X.current === te && Pt(le);
    } catch (le) {
      X.current === te && !te.controller.signal.aborted && (jn.current = te.signature, P({ signature: te.signature, message: tn(le) }));
    } finally {
      X.current === te && (X.current = null, nn(!1));
    }
  }
  function yn() {
    var h;
    (h = X.current) == null || h.controller.abort(), X.current = null, nn(!1), Pt((k) => k && { ...k, partial: !0, complete: !1 });
  }
  async function wa(h) {
    var de;
    const k = mt.current;
    if (!Te(k)) return;
    if (X.current) {
      yn();
      return;
    }
    const O = Pa(k);
    if (((de = Yt.current) == null ? void 0 : de.signature) !== O || Yt.current.partial) return;
    const te = 1100 - (Date.now() - Ee.current);
    te > 0 && await new Promise((le) => window.setTimeout(le, te));
    try {
      const le = await jc(k, h);
      if (X.current) {
        yn();
        return;
      }
      Pt(
        (Qe) => (Qe == null ? void 0 : Qe.signature) === O ? Lf(Qe, h, le) : Qe
      );
    } catch {
      Pt(
        (le) => (le == null ? void 0 : le.signature) === O ? { ...le, partial: !0, complete: !1 } : le
      );
    }
  }
  const nr = D.performerFocus ? ct == null ? void 0 : ct.candidates.find((h) => h.id === D.performerFocus) : void 0, rt = Ce && Ce.id === D.performerFocus ? { ...Ce, flags: hr(Ne, Ce.tags) } : nr ? { ...nr, flags: hr(Ne, nr.tags) } : null, on = (h) => {
    if ((Ce == null ? void 0 : Ce.id) === h)
      return hr(Ne, Ce.tags);
    const k = ct == null ? void 0 : ct.candidates.find((O) => O.id === h);
    return k ? hr(Ne, k.tags) : void 0;
  }, sn = ((Tr = T == null ? void 0 : T.occurrence) == null ? void 0 : Tr.performer.id) ?? null, vn = sn === null ? void 0 : on(sn), _e = _f(
    Ne.length > 0 && sn !== null && sn !== D.performerFocus && vn === void 0 ? sn : null
  ), Br = vn ?? (_e ? hr(Ne, _e) : []), cn = Ws(Pe.actions), Er = St.summary && D.performerFocus ? no(vo(St.summary, Pe.actions, cn)) : [], rr = jo(Ne, (rt == null ? void 0 : rt.flags) ?? [], Kr), ar = Zs(
    jo(Ne, Br, Kr),
    sn !== null && sn === D.performerFocus ? Er : []
  ), Vr = JSON.stringify(ar), Cr = he(() => ar, [Vr]), ir = JSON.stringify(rr), zr = he(() => rr, [ir]), Rn = (h) => Jd(Ne, h, Gr);
  function or(h) {
    if (we.current) return;
    const k = {
      ...I.current,
      performerFocus: h,
      filter: { ...I.current.filter, page: 1 }
    };
    De(k, k.startFrom === "end"), Qt("items");
  }
  function Qa() {
    const { performerFocus: h, ...k } = I.current;
    De(
      { ...k, filter: { ...k.filter, page: 1 } },
      k.startFrom === "end"
    );
  }
  const sr = $(null);
  sr.current ?? (sr.current = cc());
  const ya = sr.current, Ya = he(
    () => Pe.actions.flatMap((h) => h.steps.flatMap((k) => k.tagIds)),
    [Pe.actions]
  ), va = $(null);
  Q(() => {
    const h = va.current, k = h == null ? void 0 : h.querySelector('[aria-current="true"]');
    if (!h || !k) return;
    const O = h.getBoundingClientRect(), te = k.getBoundingClientRect();
    te.top < O.top ? h.scrollTop -= O.top - te.top : te.bottom > O.bottom && (h.scrollTop += te.bottom - O.bottom);
  }, [T == null ? void 0 : T.key, xt]);
  const Ar = $(null), Jr = $(null);
  Q(() => {
    var O, te;
    const h = Jr.current;
    if (!h) return;
    Jr.current = null;
    const k = [...((O = Ar.current) == null ? void 0 : O.querySelectorAll(".dq-partner")) ?? []];
    (te = k.find((de) => de.dataset.partnerKey === h) ?? k[0]) == null || te.focus();
  }, [T == null ? void 0 : T.key]);
  const $t = ke || Oe || Me || !!y, Nn = he(
    () => y ? kn(y, Ma(e, D)) : null,
    [y, e, D]
  ), cr = he(
    () => Nn != null && Pr(br(Nn)) !== Pr(br(e)),
    [Nn, e]
  );
  function Un() {
    T ? hn(d, T).then(Vt).catch((h) => Fe(tn(h))) : De(I.current);
  }
  const Gn = pn ? /* @__PURE__ */ l("p", { role: "alert", children: [
    pn,
    " ",
    /* @__PURE__ */ r("button", { type: "button", disabled: ke, onClick: Un, children: T ? "Reload tags" : "Retry queue" })
  ] }) : null, ln = ke || Oe || T != null && !Ze, lr = Math.max(1, Number(D.filter.perPage) || 1), dr = $(1);
  Oe || (dr.current = Math.max(1, Math.ceil($e / lr)));
  const Wr = dr.current, Na = ft && T ? z.filter(
    (h) => h.media.id === T.media.id && h.key !== T.key
  ) : [], Xa = (h) => {
    var k;
    return h.title || ((k = h.files[0]) == null ? void 0 : k.basename) || `${d === "audio" ? "Audio" : "Video"} ${h.id}`;
  }, Hr = T ? Wf(T.media, d) : "";
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-review-workspace${d === "audio" ? " dq-audio" : ""}`,
      "aria-label": ft ? d === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : d === "audio" ? "Audio review" : "Video review",
      onClickCapture: (h) => {
        var te;
        const k = h.target instanceof Element ? h.target.closest("button") : null, O = (k == null ? void 0 : k.getAttribute("aria-label")) ?? ((te = k == null ? void 0 : k.textContent) == null ? void 0 : te.trim()) ?? "";
        k && !k.closest(ss) && /^(Filters|Edit filter:|Edit criteria)/.test(O) && (qt.current = k);
      },
      children: [
        /* @__PURE__ */ r(
          Ec,
          {
            name: e.name,
            description: e.description,
            entityType: je(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: $t || !!(c != null && c.busy),
            onEdit: y ? () => {
              var h;
              return (h = B.current) == null ? void 0 : h.focus();
            } : Zt,
            editDisabled: !y && ($t || !i || !!(c != null && c.busy)),
            editing: !!y,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: ke || Me, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: d === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ r(
                  ra,
                  {
                    filter: D.filter,
                    objectFilter: fe,
                    criteriaDefinitions: d === "audio" ? bs : ji,
                    customFieldEntityType: d,
                    totalCount: $e,
                    sortOptions: d === "audio" ? Sl : ws,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(
                      Cc,
                      {
                        page: Math.min(Math.max(1, bn || 1), Wr),
                        pages: Wr,
                        onPage: (h) => De({
                          ...I.current,
                          filter: Kt(
                            { ...I.current.filter, page: h },
                            d
                          )
                        })
                      }
                    ),
                    onFilterChange: (h) => {
                      (h.sort !== I.current.filter.sort || h.direction !== I.current.filter.direction) && (h = { ...h, sorts: void 0 }), De({
                        ...I.current,
                        filter: Kt(h, d)
                      });
                    },
                    onObjectFilterChange: (h) => {
                      De({
                        ...I.current,
                        objectFilter: Tc(
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
            trailing: /* @__PURE__ */ l(ge, { children: [
              ft && /* @__PURE__ */ r(
                Mf,
                {
                  scope: ft,
                  disabled: ke || Me,
                  editing: !!y,
                  onChange: wn,
                  onEditCriteria: () => Tn(!0)
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ r(
                Ac,
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
            trailingEnd: /* @__PURE__ */ l(ge, { children: [
              Te(Ht) && t && /* @__PURE__ */ r(
                kf,
                {
                  review: Ht,
                  disabled: gt || !!y,
                  performerAttention: D.performerFocus ? zr : void 0,
                  trees: cn,
                  onOpen: () => {
                    we.current = !0, Cn(!0);
                  },
                  onWrite: () => {
                    Ee.current = Date.now();
                  },
                  onClose: (h) => {
                    if (h) {
                      Ee.current = Date.now();
                      const k = I.current.performerFocus;
                      k ? wa(k) : yn(), Re((O) => O + 1), new Promise((O) => window.setTimeout(O, 1100)).then(() => {
                        nt(), ze.current && (q.current || Xe(!0), A((O) => O + 1));
                      });
                    } else nt();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ r(
                uo,
                {
                  disabled: $t,
                  items: c.moreItems({
                    onSelect: Zt,
                    disabled: !i
                  })
                }
              )
            ] }),
            chipsStart: D.performerFocus ? /* @__PURE__ */ l("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ r(
                xr,
                {
                  performer: {
                    id: D.performerFocus,
                    name: (rt == null ? void 0 : rt.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ l("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ r("strong", { children: (rt == null ? void 0 : rt.name) ?? `performer ${D.performerFocus}` })
              ] }),
              rt != null && rt.flags.length ? /* @__PURE__ */ l("span", { className: "dq-focus-flag", title: Rn(rt.flags), children: [
                /* @__PURE__ */ r(Fn, { "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-sr-only", children: Rn(rt.flags) })
              ] }) : null,
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: gt,
                  onClick: Qa,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: Xt,
            queueChange: !y && Xt ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: er ? () => void Le() : void 0,
              saveDisabled: gt || !i,
              onReset: () => {
                const h = vr(e);
                De(h, h.startFrom === "end");
              },
              resetDisabled: gt
            } : void 0,
            chipsEnd: y ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
          y && Nn && /* @__PURE__ */ r(
            kc,
            {
              drawerRef: B,
              draft: Nn,
              onChange: (h) => R(h),
              direction: D.startFrom,
              onDirectionChange: (h) => De({ ...I.current, startFrom: h }),
              tagGroups: Jf,
              trees: cn,
              saving: ke,
              saveDisabled: Oe,
              error: F,
              dirty: cr,
              criteriaChanged: er,
              notices: Gn && /* @__PURE__ */ r("div", { className: "dq-review-feedback", children: Gn }),
              onSave: () => void ba(),
              onCancel: Sr
            }
          ),
          /* @__PURE__ */ r("div", { className: "dq-review-main", children: /* @__PURE__ */ l("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ l("div", { className: "dq-review-stage", children: [
              T ? /* @__PURE__ */ l(ge, { children: [
                /* @__PURE__ */ l("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ r("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ l(
                    "a",
                    {
                      href: `/${d}/${T.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${g.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ r("span", { children: Xa(T.media) }),
                        /* @__PURE__ */ r(Ts, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Hr && /* @__PURE__ */ r("span", { className: "dq-stage-meta", children: Hr })
                ] }),
                /* @__PURE__ */ l("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ r("div", { className: "dq-player-frame", children: [T, be].filter(Boolean).map((h) => {
                    var te, de, le, Qe, Ot;
                    const k = h, O = k.key === T.key;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        className: O ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": O ? void 0 : !0,
                        inert: O ? void 0 : !0,
                        children: d === "audio" ? /* @__PURE__ */ r(
                          kl,
                          {
                            streamUrl: Ni("audio", k.media.id),
                            format: ((te = k.media.files[0]) == null ? void 0 : te.format) ?? "",
                            title: b(k.media),
                            coverUrl: O ? vi("audio", k.media) : void 0,
                            duration: ((de = k.media.files[0]) == null ? void 0 : de.duration) ?? 0,
                            autostart: O && oe === k.media.id
                          }
                        ) : /* @__PURE__ */ r(
                          ys,
                          {
                            videoId: k.media.id,
                            streamUrl: Ni("video", k.media.id),
                            posterUrl: O ? vi("video", k.media) : void 0,
                            duration: ((le = k.media.files[0]) == null ? void 0 : le.duration) ?? 0,
                            format: (Qe = k.media.files[0]) == null ? void 0 : Qe.format,
                            audioCodec: (Ot = k.media.files[0]) == null ? void 0 : Ot.audioCodec,
                            extensionSurface: O ? "quick-view" : void 0,
                            autostart: O && oe === k.media.id,
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
                      `${k.media.id}:${Ge}`
                    );
                  }) }),
                  d === "audio" && /* @__PURE__ */ r(
                    Cf,
                    {
                      details: T.media.details,
                      label: g.one
                    },
                    T.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ r("p", { role: "status", className: "dq-stage-status", children: Oe ? "Loading review…" : $e ? "Reached the end in this direction." : `No matching ${g.many}.` }),
              Pe.actions.length > 0 ? /* @__PURE__ */ r(
                ou,
                {
                  actions: Pe.actions,
                  mediaKind: d,
                  isDisabled: (h) => Me || an(h),
                  busy: ln,
                  tags: Ze,
                  trees: cn,
                  preview: ya,
                  onApply: (h, k) => void rn(h, k),
                  onFind: () => Ft(!0),
                  findDisabled: Me || !!y,
                  paused: !!y,
                  waitForGroups: _o(Pe),
                  attention: Cr,
                  stayOnTap: ot,
                  onStayOnTapChange: Ln
                }
              ) : Te(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ l(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || ke || Me || !Ze || !!y || !T,
                  children: [
                    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((h) => /* @__PURE__ */ l("label", { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Wt.includes(h),
                          onChange: (k) => xe(
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
                          onClick: () => xe([]),
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
              /* @__PURE__ */ l("div", { className: "dq-panel-body", ref: Ar, children: [
                T && /* @__PURE__ */ l(ge, { children: [
                  /* @__PURE__ */ l("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ l("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: T.occurrence ? T.occurrence.performer.name : `this ${g.one}` })
                    ] }),
                    /* @__PURE__ */ l("div", { className: "dq-reviewing-who", children: [
                      T.occurrence && /* @__PURE__ */ r(xr, { performer: T.occurrence.performer }),
                      /* @__PURE__ */ l("div", { children: [
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: T.occurrence ? T.occurrence.performer.name : `This ${g.one}` }),
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-note", children: ft ? `Tags apply to this performer in this ${g.queue}` : `Tags apply to the whole ${g.one}` })
                      ] })
                    ] }),
                    Cr.length > 0 && /* @__PURE__ */ r(Yf, { entries: Cr })
                  ] }),
                  Na.length > 0 && /* @__PURE__ */ l(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${g.queue}`,
                      children: [
                        /* @__PURE__ */ l("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          g.queue
                        ] }),
                        /* @__PURE__ */ r("div", { className: "dq-partners", children: Na.map((h) => {
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
                                Jr.current = T.key, _t(h), Fe("");
                              },
                              children: [
                                h.occurrence && /* @__PURE__ */ r(xr, { performer: h.occurrence.performer }),
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
                    Qf,
                    {
                      tags: Ze,
                      preview: ya,
                      showPreview: !Me,
                      trees: cn,
                      actionTagIds: Ya,
                      label: `Current ${ft ? "occurrence" : g.one} tags`
                    }
                  ),
                  Me && /* @__PURE__ */ l(
                    "fieldset",
                    {
                      ref: Zn,
                      disabled: ke,
                      className: "dq-panel-section dq-tag-editor",
                      children: [
                        /* @__PURE__ */ l("legend", { className: "dq-eyebrow", children: [
                          "Edit ",
                          ft ? "occurrence" : g.one,
                          " tags"
                        ] }),
                        /* @__PURE__ */ r(
                          Qn,
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
                                An(!1), requestAnimationFrame(() => {
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
                Te(et) && D.performerFocus && /* @__PURE__ */ r(
                  Oi,
                  {
                    ...St,
                    mediaKind: d,
                    actions: Pe.actions,
                    trees: cn,
                    flags: zr
                  }
                )
              ] }),
              /* @__PURE__ */ l("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ l("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !y && Gn,
                  it && /* @__PURE__ */ r("p", { role: "status", children: it })
                ] }),
                !t && /* @__PURE__ */ r("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                T && /* @__PURE__ */ l("div", { className: "dq-panel-actions", "aria-busy": ln || void 0, children: [
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      ref: zt,
                      className: "dq-button",
                      disabled: gt || !!y || !t || !Ze,
                      onClick: () => {
                        ht.current = [...Ze.ids], Mt([...Ze.ids]), An(!0);
                      },
                      children: [
                        /* @__PURE__ */ r(Es, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: gt || !!y,
                      onClick: () => void rn(),
                      children: [
                        /* @__PURE__ */ r(_l, { "aria-hidden": "true" }),
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
                Tf,
                {
                  ranking: (ct == null ? void 0 : ct.signature) === me ? ct : null,
                  busy: gn,
                  error: (E == null ? void 0 : E.signature) === me ? E.message : "",
                  focus: D.performerFocus,
                  disabled: gt,
                  labels: g,
                  flagLabel: Rn,
                  onFocus: or,
                  onMore: () => {
                    const h = Yt.current;
                    h && kr(h, h.limit + fi);
                  },
                  onRefresh: () => {
                    Pt(null), kr(null, fi);
                  }
                }
              ) : /* @__PURE__ */ r("div", { className: "dq-queue-list", ref: va, children: z.map((h) => {
                var O;
                const k = (T == null ? void 0 : T.key) === h.key;
                return /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: w(h),
                    "aria-label": w(h),
                    "aria-current": k ? "true" : void 0,
                    disabled: gt,
                    onClick: () => {
                      _t(h), Fe(""), Ae("");
                    },
                    children: [
                      /* @__PURE__ */ r(Hf, { media: h.media, kind: d }),
                      /* @__PURE__ */ l("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: b(h.media) }),
                        /* @__PURE__ */ l("span", { className: "dq-queue-row-meta", children: [
                          h.occurrence && /* @__PURE__ */ l(ge, { children: [
                            /* @__PURE__ */ r(xr, { performer: h.occurrence.performer }),
                            /* @__PURE__ */ r("span", { className: "dq-queue-row-performer", children: h.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ r("span", { className: "dq-queue-row-detail", children: [
                            h.media.date,
                            h.occurrence ? "" : (O = h.media.files[0]) != null && O.duration ? vs(h.media.files[0].duration) : ""
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
          El,
          {
            open: Tt,
            onClose: () => Tn(!1),
            criteria: _i,
            activeFilter: ft.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (h) => {
              Tn(!1), wn({ performerFilter: h });
            }
          }
        ),
        Jt && /* @__PURE__ */ r(
          so,
          {
            actions: e.actions,
            trees: cn,
            isDisabled: (h) => an(h),
            tapStays: mn && ot,
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
const zc = "data-quality.reviews-sort.v1", Zf = { sort: "name", direction: "asc" };
function eh() {
  try {
    const e = JSON.parse(localStorage.getItem(zc) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return Zf;
}
function th(e) {
  try {
    localStorage.setItem(
      zc,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function Jc(e, t, n, a) {
  const i = a === "asc" ? 1 : -1;
  return [...e].sort((o, s) => {
    if (n === "count") {
      const c = t[o.id], u = t[s.id], p = typeof c == "number", d = typeof u == "number";
      if (p !== d) return p ? -1 : 1;
      if (p && d && c !== u)
        return (c - u) * i;
    }
    return o.name.localeCompare(s.name, void 0, { numeric: !0, sensitivity: "base" }) * i;
  });
}
function hi(e, t) {
  const n = je(e), a = En(Ji(n)), i = n === "tag" ? "tag" : Te(e) ? a.queue : a.one;
  return t === 1 ? i : `${i}s`;
}
function nh({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ l(ge, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      hi(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ l(ge, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      "Matching ",
      hi(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ l(ge, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      hi(e, t)
    ] })
  ] });
}
function rh({
  reviews: e,
  counts: t,
  sort: n,
  direction: a,
  onSortChange: i,
  onDirectionChange: o,
  storage: s,
  canConfigure: c,
  busy: u,
  headingRef: p,
  notices: d,
  onOpen: g,
  onNew: m,
  onImport: b,
  onExportAll: w,
  rowMenuItems: N
}) {
  const q = $(null), y = he(
    () => Jc(e, t, n, a),
    [e, t, n, a]
  ), R = e.every((_) => t[_.id] !== void 0), F = a === "asc" ? "ascending" : "descending";
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
              var _;
              return (_ = q.current) == null ? void 0 : _.click();
            },
            children: [
              /* @__PURE__ */ r(jl, { "aria-hidden": "true" }),
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
            onChange: (_) => {
              var L;
              const B = (L = _.target.files) == null ? void 0 : L[0];
              _.target.value = "", B && b(B);
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
            onClick: w,
            children: [
              /* @__PURE__ */ r(Is, { "aria-hidden": "true" }),
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
              /* @__PURE__ */ r(Ba, { "aria-hidden": "true" }),
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
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: R ? e.some((_) => t[_.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ l("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ l("label", { children: [
            /* @__PURE__ */ r("span", { children: "Sort by" }),
            /* @__PURE__ */ l(
              "select",
              {
                className: "dq-select",
                value: n,
                onChange: (_) => i(_.target.value),
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
              onClick: () => o(a === "asc" ? "desc" : "asc"),
              children: a === "asc" ? /* @__PURE__ */ r(Ul, { "aria-hidden": "true" }) : /* @__PURE__ */ r(Gl, { "aria-hidden": "true" })
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
        /* @__PURE__ */ r("tbody", { children: y.map((_) => {
          const B = je(_);
          return /* @__PURE__ */ l("tr", { children: [
            /* @__PURE__ */ r("td", { children: /* @__PURE__ */ l(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(_.id)}`,
                "data-review-id": _.id,
                onClick: (L) => {
                  L.button !== 0 || L.metaKey || L.ctrlKey || L.shiftKey || L.altKey || (L.preventDefault(), g(_.id));
                },
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ r(Nc, { entityType: B }) }),
                  /* @__PURE__ */ l("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ r("span", { className: "dq-reviews-name", children: _.name }),
                    _.description && /* @__PURE__ */ r("span", { className: "dq-reviews-description", title: _.description, children: _.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-type", children: vc[B] }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-count", children: /* @__PURE__ */ r(nh, { review: _, count: t[_.id] }) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ r(uo, { label: `Actions for ${_.name}`, items: N(_) }) })
          ] }, _.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ l("div", { className: "dq-empty", children: [
      /* @__PURE__ */ r(Va, { "aria-hidden": "true" }),
      /* @__PURE__ */ r("p", { children: "No reviews yet." }),
      /* @__PURE__ */ r("p", { children: c ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function Wc(e, { id: t, name: n, description: a }) {
  const i = { id: t, name: n, description: a }, o = (s, c = {}) => ({
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
function ah({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: a
}) {
  const { review: i, saving: o, error: s } = e, c = $(null), u = $(null), p = $(o);
  p.current = o;
  const d = $(null), g = at();
  Q(() => {
    var w;
    return d.current ?? (d.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (w = u.current) == null || w.focus(), () => {
      var N;
      (N = d.current) != null && N.isConnected && d.current.focus({ preventScroll: !0 });
    };
  }, []);
  const m = $(o);
  Q(() => {
    var q, y;
    const w = document.activeElement, N = !w || w === document.body || !((q = c.current) != null && q.contains(w));
    s && (!i.name.trim() || m.current && !o && N) && ((y = u.current) == null || y.focus()), m.current = o;
  }, [s, o]);
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
      onCancel: (w) => {
        w.preventDefault(), b();
      },
      onClose: () => {
        var w;
        p.current ? (w = c.current) == null || w.showModal() : a();
      },
      children: /* @__PURE__ */ l(
        "form",
        {
          onSubmit: (w) => {
            w.preventDefault(), p.current || n();
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
                  disabled: o,
                  onClick: b,
                  children: /* @__PURE__ */ r(da, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ l("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ r("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ l("fieldset", { className: "dq-form-dialog-fields", disabled: o, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ r(
                  Sc,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (w) => {
                      w !== je(i) && t(Wc(w, i));
                    },
                    nameRef: u
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ l("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ r("button", { type: "button", className: "dq-text-button", onClick: () => lo(i), children: "Export draft" }),
              /* @__PURE__ */ r("span", { className: "dq-form-dialog-space" }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: o, onClick: b, children: "Cancel" }),
              /* @__PURE__ */ r("button", { type: "submit", className: "dq-button primary", "aria-disabled": o || void 0, children: o ? "Creating…" : "Create & configure" })
            ] })
          ]
        }
      )
    }
  );
}
const ih = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function oh(e, t, n, a) {
  return Vc(
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
function cs(e, t) {
  return je(t) === "video" && ga(t.view.objectFilter, e.view.objectFilter).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function ls(e, t) {
  return yr(
    JSON.parse(zn(br(e))),
    JSON.parse(zn(br(t)))
  );
}
const pi = 180;
function ds(e) {
  return je(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function us(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function fs() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function mi(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  Ha.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const a = n.toString();
  Bc(`${window.location.pathname}${a ? `?${a}` : ""}`, { openingFromList: t });
}
function sh(e) {
  return Kt({ ...e, page: 1 });
}
function Hc(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Mr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const ch = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Ki, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ r(Vl, { "aria-hidden": "true" }) }
], lh = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Ki, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ r(Bl, { "aria-hidden": "true" }) }
], hs = [], Qc = "(min-width: 900px)";
function dh(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(Qc);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function uh() {
  return typeof window.matchMedia == "function" && window.matchMedia(Qc).matches;
}
function fh({
  onNavigate: e
}) {
  const [t, n] = C([]), [a] = C(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = C(""), [s, c] = C(!0), [u, p] = C(""), [d, g] = C(!1), [m, b] = C(!1), [w, N] = C(!1), [q, y] = C(!1), [R, F] = C([]), [_, B] = C(""), [L, Z] = C(!0), [ne, ae] = C("account"), [ie, G] = C(""), [D, S] = C(""), [I, Y] = C(!1), [A, V] = C(!1), [z, K] = C(""), [T, W] = C(fs), H = $(T);
  H.current = T;
  const [oe, Ie] = C({}), Ge = $(oe);
  Ge.current = oe;
  const j = $(t);
  j.current = t;
  const be = $(s);
  be.current = s;
  const $e = $(!1), pe = $(!0);
  Q(() => (pe.current = !0, () => {
    pe.current = !1;
  }), []);
  const [Oe, Xe] = C(!T);
  Oe !== !T && (Xe(!T), T || Ie({}));
  const [ke, Cn] = C(eh), { sort: we, direction: ze } = ke, Et = (f) => {
    const v = { ...ke, ...f };
    Cn(v), th(v);
  }, pn = $(null), Fe = $(null), [it, Ae] = C(null), [Ze, Vt] = C(!1), [Me, An] = C(!1), [ut, Mt] = C(null), [ht, zt] = C(null), qt = !!ut || !!ht, Zn = $(qt);
  Zn.current = qt;
  const Tt = Ze || !!ht || Me, [Tn, Jt] = C(0), [Ft, mn] = C(!1), [ve, Ct] = C(null), ot = $(null), Ln = $(null), Wt = $(null), [xe, It] = C(
    null
  ), se = t.find((f) => f.id === T) ?? null, x = he(
    () => (xe == null ? void 0 : xe.id) === T && se ? { ...se, view: {
      ...se.view,
      filter: xe.view.filter,
      objectFilter: xe.view.objectFilter,
      searchMode: xe.view.searchMode,
      startFrom: xe.view.startFrom
    } } : se,
    [xe, T, se]
  ), Ee = x ? je(x) : "video", pt = Ji(Ee), Dn = x ? Te(x) : !1, fe = Ee === "video" ? x : null, Rt = Dn && !!(x != null && x.actions.some(Hn)), tt = !!fe || Ee === "audio" || Rt, [Pe, et] = C(null), Ht = (Pe == null ? void 0 : Pe.id) === (x == null ? void 0 : x.id) ? Pe == null ? void 0 : Pe.mode : (x == null ? void 0 : x.view.reviewMode) ?? "single", st = Dn || Ee === "audio" || Ee === "video" && Ht === "single", [mt, xt] = C(0), Qt = $(-1), ct = $(!1), _n = $(st);
  _n.current = st, Q(() => {
    const f = () => {
      const v = _n.current;
      if (!v && yn.current) {
        ct.current = !0;
        return;
      }
      Qt.current = -1, At(), v || xt((M) => M + 1);
    };
    return window.addEventListener("popstate", f), () => window.removeEventListener("popstate", f);
  }, []);
  const Yt = pt === "audio" ? m : d, jn = Ee === "tag" ? "Tag" : pt === "audio" ? "Audio" : "Video", Pt = Ee === "tag" ? w : Yt, gn = $(
    null
  ), nn = jf(fe), [E, P] = C({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [X, me] = C({
    page: 1,
    perPage: 40
  }), [ce, Re] = C({ items: [], totalCount: 0 }), [Ce, Lt] = C(T);
  Ce !== T && (Lt(T), Re({ items: [], totalCount: 0 }), V(!1));
  const [ye, qe] = C(!1), [Ne, Dt] = C(""), [In, Ur] = C(!1), [Gr, Kr] = C(!1), [St, Xt] = C(() => /* @__PURE__ */ new Set()), er = $(St);
  er.current = St;
  const gt = $(/* @__PURE__ */ new Map()), bn = (x == null ? void 0 : x.view.selectAllOnLoad) === !0, [De, nt] = C(null), bt = $(De);
  bt.current = De;
  const [wt, _t] = C(!1), jt = $(wt);
  jt.current = wt;
  const rn = $(null), [tr, an] = C(!1), [Zt, qr] = C("grid"), [Sr, ba] = C(pi), [Le, ft] = C(!1), [wn, kr] = C(!1), yn = $(!1), [wa, nr] = C(""), [rt, on] = C(""), [sn, vn] = C(""), [_e, Br] = C(null), [cn, Er] = C(""), [rr, ar] = C(!1), [Vr, Cr] = C({}), ir = $(/* @__PURE__ */ new Map()), zr = $(null), Rn = $(null), or = !!x, Qa = Li(dh, uh, () => !1) && or, [sr, ya] = C({ top: 0, bottom: 0 });
  kt(() => {
    if (!or) return;
    const f = () => {
      const M = Rn.current;
      if (!M) return;
      const U = Math.round(M.getBoundingClientRect().top + window.scrollY), ee = M.closest("main"), J = ee ? Math.round(parseFloat(getComputedStyle(ee).paddingBottom) || 0) : 0;
      ya(
        (re) => re.top === U && re.bottom === J ? re : { top: U, bottom: J }
      );
    };
    f();
    const v = typeof ResizeObserver > "u" ? null : new ResizeObserver(f);
    return v == null || v.observe(document.body), window.addEventListener("resize", f), () => {
      v == null || v.disconnect(), window.removeEventListener("resize", f);
    };
  }, [or]);
  const [Ya, va] = C(0), Ar = $(null), Jr = Sn((f) => {
    var M;
    if ((M = Ar.current) == null || M.disconnect(), Ar.current = null, !f || typeof ResizeObserver > "u") return;
    const v = new ResizeObserver(
      () => va(Math.round(f.getBoundingClientRect().height))
    );
    v.observe(f), Ar.current = v;
  }, []), $t = $(0), Nn = $(0), cr = $(null), Un = $(null), Gn = Ws(
    x && !st ? ve ? [...x.actions, ...ve.draft.actions] : x.actions : hs
  ), ln = he(
    () => ve && x && se ? oh(ve.draft, x, E, se) : null,
    [ve, x, E, se]
  ), lr = he(
    () => x && se ? Vc(
      { ...se, view: { ...x.view, filter: { ...E, page: 1 } } },
      se
    ) : null,
    [x, se, E]
  ), dr = he(
    () => se ? Pr(br(se)) : "",
    [se]
  ), Wr = he(
    () => lr != null && Pr(br(lr)) !== dr,
    [lr, dr]
  ), Na = he(
    () => ln != null && Pr(br(ln)) !== dr,
    [ln, dr]
  );
  Q(() => {
    if (!rt) return;
    const f = window.setTimeout(() => on(""), 4e3);
    return () => window.clearTimeout(f);
  }, [rt]), Q(() => {
    if (!it || it.alert) return;
    const f = window.setTimeout(() => Ae(null), 6e3);
    return () => window.clearTimeout(f);
  }, [it]), Q(() => {
    const f = fe ? po(fe.view.objectFilter) : [];
    if (Cr({}), !f.length) return;
    const v = new AbortController();
    let M = !0;
    return Promise.all(
      f.map(async (U) => {
        var ee;
        try {
          const J = await ue(`/api/tags/${U}`, {
            signal: v.signal
          });
          return (ee = J.name) != null && ee.trim() ? [String(U), J.name] : null;
        } catch {
          return null;
        }
      })
    ).then((U) => {
      M && Cr(
        Object.fromEntries(U.filter((ee) => ee !== null))
      );
    }), () => {
      M = !1, v.abort();
    };
  }, [fe == null ? void 0 : fe.id, fe == null ? void 0 : fe.view.objectFilter]);
  const Xa = he(
    () => fe ? mo(
      fe.view.objectFilter,
      Vr
    ) : (x == null ? void 0 : x.view.objectFilter) ?? {},
    [Vr, x, fe]
  ), Hr = Sn(async () => {
    c(!0), p("");
    try {
      const f = await fd();
      n(f.reviews), o(f.storageKey), g(f.canWriteVideos ?? f.canWrite), b(f.canWriteAudios ?? !1), N(f.canWriteTags ?? !1), y(f.canReadTagGroups ?? !1), Z(f.canConfigure ?? !0), ae(f.storage ?? "account"), G(f.storageNotice ?? ""), T && !f.reviews.some((v) => v.id === T) && (W(""), mi(""));
    } catch (f) {
      p(
        f instanceof Error ? f.message : "Could not load reviews."
      );
    } finally {
      c(!1);
    }
  }, [T]);
  Q(() => {
    if (!q) {
      F([]), B("");
      return;
    }
    const f = new AbortController();
    return B(""), kd(f.signal).then(F).catch((v) => {
      f.signal.aborted || B(
        v instanceof Error ? v.message : "Could not load tag groups."
      );
    }), () => f.abort();
  }, [q]), Q(() => {
    Hr();
  }, []), Q(() => {
    if (T || t.length === 0) return;
    const f = new AbortController();
    for (const v of t) {
      if (typeof Ge.current[v.id] == "number") continue;
      (Te(v) ? go(v, f.signal).then((U) => (U == null ? void 0 : U.length) === 0 ? { items: [], totalCount: 0 } : ta(bo(v, U), { ...v.view.filter, page: 1, perPage: 1 }, f.signal)) : je(v) === "tag" ? xo(
        v,
        Kt({ ...v.view.filter, page: 1, perPage: 1 }),
        f.signal
      ) : ta(
        v,
        Kt({ ...v.view.filter, page: 1, perPage: 1 }),
        f.signal
      )).then((U) => {
        f.signal.aborted || Ie((ee) => ({
          ...ee,
          [v.id]: U.totalCount
        }));
      }).catch(() => {
        f.signal.aborted || Ie((U) => ({ ...U, [v.id]: null }));
      });
    }
    return () => f.abort();
  }, [T, t]), kt(() => {
    var M, U;
    const f = Fe.current;
    if (T || s || !f) return;
    Fe.current = null, (U = (f === "heading" ? null : [...((M = Rn.current) == null ? void 0 : M.querySelectorAll("[data-review-id]")) ?? []].find(
      (ee) => ee.dataset.reviewId === f.reviewId
    )) ?? pn.current) == null || U.focus();
  }, [T, s, ht, t]);
  const Tr = $(0), h = Sn(async () => {
    const f = ++Tr.current;
    Br(null), Er("");
    try {
      const v = await (Rt ? Bs(pt) : Ks(pt));
      f === Tr.current && Br(v);
    } catch (v) {
      if (f !== Tr.current) return;
      Br(null), Er(
        "Tag assessment setup could not be checked. " + (v instanceof Error ? v.message : "Request failed.")
      );
    }
  }, [Rt, pt]);
  Q(() => {
    h();
  }, [h]);
  const k = Sn(
    async (f, v, M = !1, U = !1) => {
      var vt, Ke;
      const ee = ++$t.current;
      (vt = cr.current) == null || vt.abort();
      const J = new AbortController();
      cr.current = J, v = Kt(v);
      const re = Number(v.page);
      M && (v = { ...v, page: 1 }), P(v), Kr(M), qe(!0), Dt("");
      try {
        const We = ($n) => je(f) === "tag" ? xo(
          f,
          $n,
          J.signal
        ) : ta(
          f,
          $n,
          J.signal
        );
        let Se = await We(v);
        const He = Math.max(
          1,
          Math.ceil(Se.totalCount / Number(v.perPage))
        ), Kn = M ? He : Math.min(re, He);
        return Number(v.page) !== Kn && (v = { ...v, page: Kn }, Se = await We(v)), ee === $t.current && (((Ke = Un.current) == null ? void 0 : Ke.page) !== Kn && (Un.current = {
          page: Kn,
          ids: new Set(Se.items.map(($n) => $n.id))
        }), Re(Se), U && yt(
          () => new Set(Se.items.map(($n) => $n.id))
        ), P(v), me(v)), Se;
      } catch (We) {
        throw ee === $t.current && Dt(
          We instanceof Error ? We.message : "Could not load the review queue."
        ), We;
      } finally {
        ee === $t.current && qe(!1);
      }
    },
    []
  );
  Q(() => {
    var v;
    if (Nn.current += 1, Qt.current = -1, $t.current += 1, (v = cr.current) == null || v.abort(), Ct(null), ot.current = null, V(!1), K(""), S(""), Y(!1), Xt(/* @__PURE__ */ new Set()), gt.current.clear(), nt(null), _t(!1), ft(!1), yn.current = !1, nr(""), on(""), vn(""), Re({ items: [], totalCount: 0 }), Un.current = null, Ur(!1), !x || st) {
      qe(!1), It(null);
      return;
    }
    let f = !0;
    return qe(!0), (async () => {
      let M = se ?? x;
      It(null);
      let U = null;
      const ee = new URLSearchParams(window.location.search);
      if (je(x) === "video" && Ha.some((Ke) => ee.has(Ke)))
        try {
          const Ke = M;
          U = Pi(Ke, ee);
          const We = kn(Ke, U.query);
          (U.query.startFrom !== (Ke.view.startFrom ?? "end") || !yr(
            JSON.parse(zn(We)),
            JSON.parse(zn(kn(Ke, vr(Ke))))
          )) && (M = We, It(M));
        } catch (Ke) {
          Ur(!0), Dt(Ke instanceof Error ? Ke.message : "Could not read review URL."), qe(!1);
          return;
        }
      let J = null;
      try {
        J = await gd(i, x.id);
      } catch (Ke) {
        f && (Y(!0), S(
          Ke instanceof Error ? Ke.message : "Could not load progress."
        ));
      }
      if (!f) return;
      const re = (J == null ? void 0 : J.signature) === zn(M) ? J : null, vt = U ? U.query.filter : re ? Kt(re.filter) : sh(M.view.filter);
      P(vt), qr(
        re ? us(re.displayMode, je(x)) : ds(x)
      ), ba(
        re ? re.cardSize ?? pi : pi
      );
      try {
        const Ke = await k(
          M,
          vt,
          U ? U.startAtEnd : !re && M.view.startFrom !== "beginning",
          M.view.selectAllOnLoad === !0
        );
        if (!f) return;
        const We = $o(
          Ke.items.map((Se) => Se.id),
          (re == null ? void 0 : re.focusedId) ?? null,
          (re == null ? void 0 : re.index) ?? 0
        );
        nt(We), Be(We);
      } catch {
      }
      f && (Qt.current = mt, V(!0), K(`${x.id}:${mt}`));
    })(), () => {
      var M;
      f = !1, Nn.current++, $t.current++, (M = cr.current) == null || M.abort();
    };
  }, [x == null ? void 0 : x.id, st, mt]), Q(() => {
    if (!(!Tn || st || !x)) {
      if (In) {
        Jt(0);
        return;
      }
      Le || ve || wn || z !== `${x.id}:${mt}` || (Jt(0), ri());
    }
  }, [
    Tn,
    st,
    x == null ? void 0 : x.id,
    z,
    Le,
    wn,
    mt,
    In
  ]), Q(() => {
    !fe || st || !A || ye || Ne || Le || ct.current || Qt.current !== mt || na(fe.id, {
      filter: E,
      objectFilter: fe.view.objectFilter,
      searchMode: fe.view.searchMode,
      startFrom: fe.view.startFrom ?? "end"
    });
  }, [fe, st, A, ye, Ne, E, Le, mt]);
  const O = he(
    () => ce.items.map((f) => f.id),
    [ce.items]
  );
  Q(() => {
    if (!A || !x || !i || ye || Ne || Le || (xe == null ? void 0 : xe.id) === x.id || I || Qt.current !== mt)
      return;
    const f = {
      version: 1,
      signature: zn(x),
      filter: E,
      focusedId: De,
      index: Math.max(0, O.indexOf(De ?? -1)),
      displayMode: Zt,
      cardSize: Sr,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + x.id,
        JSON.stringify(f)
      );
    } catch {
    }
    if (D) return;
    let v = !0;
    const M = window.setTimeout(() => {
      bd(i, x.id, f).catch((U) => {
        v && S(
          "Progress is kept in this browser, but account sync failed. " + (U instanceof Error ? U.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      v = !1, window.clearTimeout(M);
    };
  }, [
    A,
    i,
    x,
    ye,
    Ne,
    Le,
    E,
    De,
    O,
    Zt,
    Sr,
    xe,
    D,
    I,
    mt
  ]);
  const te = ce.items.find((f) => f.id === De) ?? null, de = Ee === "video" ? te : null;
  wt && de && (rn.current = de);
  const le = de ?? (wt ? rn.current : null), Qe = Oo(St, De), Ot = O.length > 0 && O.every((f) => St.has(f)), Be = Sn((f, v = !0) => {
    f != null && window.requestAnimationFrame(() => {
      var U;
      if (Zn.current || od(document.activeElement) || (U = document.activeElement) != null && U.closest(".dq-drawer"))
        return;
      const M = ir.current.get(f);
      M == null || M.focus({ preventScroll: !0 }), v && (M == null || M.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  Q(() => {
    A && !jt.current && Be(bt.current);
  }, [A, Be]), Q(() => {
    ye || !O.length || (bt.current == null || !O.includes(bt.current)) && (nt(O[0]), jt.current || Be(O[0]));
  }, [Be, O, ye]);
  const yt = Sn(
    (f) => {
      Xt((v) => {
        const M = f(v);
        for (const U of /* @__PURE__ */ new Set([...v, ...M]))
          v.has(U) !== M.has(U) && gt.current.set(
            U,
            (gt.current.get(U) ?? 0) + 1
          );
        return M;
      });
    },
    []
  ), lt = Sn(
    (f) => {
      if (!O.length) return;
      const v = Math.max(
        0,
        O.indexOf(bt.current ?? O[0])
      ), M = O[Math.max(0, Math.min(O.length - 1, v + f))];
      nt(M), jt.current || Be(M);
    },
    [Be, O]
  ), Ve = Sn(
    async (f) => {
      const v = "steps" in f ? f.steps.length > 0 : f.effect.mode !== "SKIP", M = "effect" in f && f.effect.mode === "SET_TAG_GROUP" ? f.effect.tagGroupId : null, U = M != null && (!q || !R.some((Ye) => Ye.id === M)), ee = "effect" in f && v && !q, J = Oo(
        er.current,
        bt.current
      );
      if (!x || yn.current || ye || Ne) return;
      const re = v && !Pt ? `${jn} write permission is required to apply ${f.label}.` : ee || U ? `${f.label} needs a tag group that is unavailable.` : Hn(f) && (_e == null ? void 0 : _e.kind) !== "ready" ? `Set up tag assessments before applying ${f.label}.` : J.length ? "" : `Select or focus a ${Ee} before applying ${f.label}.`;
      if (re) {
        vn(re);
        return;
      }
      const vt = ++Nn.current, Ke = x.id, We = [...O], Se = ce, He = bt.current, Kn = new Set(er.current), $n = new Map(
        J.map((Ye) => [Ye, gt.current.get(Ye) ?? 0])
      ), $r = () => vt === Nn.current && x.id === Ke;
      yn.current = !0, ft(!0), nr(
        er.current.size ? `${J.length} selected ${Ee}s` : `the focused ${Ee}`
      ), on(""), vn("");
      const Eo = Se.items.filter(
        (Ye) => !J.includes(Ye.id)
      ), hl = Eo.map((Ye) => Ye.id), Co = Mo(
        We,
        hl,
        He,
        J.includes(He ?? -1)
      );
      Re({
        items: Eo,
        totalCount: Se.totalCount
      }), Xt((Ye) => {
        const Gt = new Set(Ye);
        for (const un of J) Gt.delete(un);
        return Gt;
      }), nt(Co), jt.current || Be(Co);
      let ai = !1;
      try {
        if ("effect" in f ? await Fd(f, J) : await zs(pt, f, J), ai = !0, !$r()) return;
        Xt((Ye) => {
          const Gt = new Set(Ye);
          for (const un of J)
            (gt.current.get(un) ?? 0) === $n.get(un) && Gt.delete(un);
          return Gt;
        }), on(
          `${f.label}: ${J.length} ${Ee}${J.length === 1 ? "" : "s"} ${v ? "updated" : "skipped"}.`
        );
      } catch (Ye) {
        if (!$r()) return;
        Re(Se), Xt((Gt) => {
          const un = new Set(Gt);
          for (const en of J)
            Kn.has(en) && (gt.current.get(en) ?? 0) === $n.get(en) && un.add(en);
          return un;
        }), nt(He), jt.current || Be(He), vn(
          Ye instanceof Error ? Ye.message : "Action failed."
        );
      }
      try {
        if (await Ad(f), !$r()) return;
        const Ye = new Set(J), Gt = bn && We.length > 0 && We.every((fn) => Ye.has(fn)), un = await k(x, E, !1, Gt);
        if (!$r()) return;
        let en = un.items.map((fn) => fn.id);
        const Ca = Un.current, pl = (Ca == null ? void 0 : Ca.page) === Number(E.page) && en.some((fn) => Ca.ids.has(fn)), ml = (x.view.startFrom ?? "end") !== "beginning";
        if (un.totalCount > 0 && Number(E.page) > 1 && (!en.length || ml && !pl)) {
          const fn = Math.max(1, Number(E.page) - 1), Aa = { ...E, page: fn };
          P(Aa), en = (await k(
            x,
            Aa,
            !1,
            Gt
          )).items.map((ii) => ii.id), Xt(
            (ii) => new Set([...ii].filter((gl) => en.includes(gl)))
          );
          const To = en.at(-1) ?? null;
          nt(To), jt.current || Be(To);
        } else {
          Xt(
            (Aa) => new Set([...Aa].filter((Ao) => en.includes(Ao)))
          );
          const fn = Mo(
            We,
            en,
            He,
            ai && J.includes(He ?? -1)
          );
          nt(fn), jt.current && fn == null && _t(!1), jt.current || Be(fn);
        }
      } catch (Ye) {
        $r() && vn(
          (Gt) => `${Gt ? `${Gt} ` : ""}${ai ? "The action completed, but " : ""}the queue could not be refreshed. ${Ye instanceof Error ? Ye.message : "Refresh failed."}`
        );
      } finally {
        $r() && (yn.current = !1, ft(!1), nr(""), ct.current && (ct.current = !1, At(), xt((Ye) => Ye + 1)));
      }
    },
    [
      Pt,
      q,
      R,
      Ee,
      _e,
      k,
      E,
      Be,
      O,
      ce,
      ye,
      Ne,
      x
    ]
  );
  function qn() {
    var M;
    if (Zt === "list") return 1;
    const f = (M = zr.current) == null ? void 0 : M.firstElementChild, v = f ? getComputedStyle(f).gridTemplateColumns : "";
    return Math.max(1, v.split(" ").filter(Boolean).length);
  }
  const Je = $(() => {
  });
  Je.current = (f) => {
    var J;
    if (st || f.defaultPrevented || f.repeat || f.ctrlKey || f.altKey || f.metaKey || qt) return;
    const v = f.target, M = v instanceof Node && ((J = Rn.current) == null ? void 0 : J.contains(v)) === !0, U = v === document.body || v === document.documentElement;
    if (!M && !U) return;
    if (tr) {
      f.key === "Escape" && (Mr(f), an(!1));
      return;
    }
    if (wt && f.key === "Escape") {
      Mr(f), _t(!1), Be(bt.current);
      return;
    }
    if (!id(v)) return;
    const ee = ad(v);
    if (f.key === "Escape") {
      Mr(f), yt(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!wt && f.key === " " && ee) {
      Mr(f), De != null && yt((re) => Fa(re, De));
      return;
    }
    if (!(Le || ye) && !wt && f.key === "Enter" && De != null && ee) {
      if (Ee !== "tag" && ve) return;
      Mr(f), Ee === "tag" ? window.open(`/tag/${De}`, "_blank", "noopener,noreferrer") : _t(!0);
      return;
    }
  }, Q(() => {
    const f = (v) => Je.current(v);
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, []);
  const dn = $(
    () => {
    }
  );
  dn.current = (f) => {
    var J;
    if (st || qt || wt || tr || Le || ye || !O.length || f.defaultPrevented || f.repeat || f.ctrlKey || f.altKey || f.metaKey)
      return;
    const v = f.target, M = v instanceof Node && ((J = Rn.current) == null ? void 0 : J.contains(v)) === !0, U = v === document.body || v === document.documentElement;
    if (!M && !U || !f.key.startsWith("Arrow") || !sd(v)) return;
    const ee = cd(f.key, qn());
    ee && (f.preventDefault(), M ? f.stopImmediatePropagation() : f.stopPropagation(), lt(ee));
  }, Q(() => {
    const f = (v) => dn.current(v);
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, []);
  const Ut = (ve == null ? void 0 : ve.saving) === !0 || wn, Qr = Le || ye && !A || Ut, qa = io();
  ao({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!x && !st && !qt && !ve && !wt && !tr && !Ne && (ce.items.length > 0 || ye || Le),
    actions: (x == null ? void 0 : x.actions) ?? hs,
    onAction: (f) => {
      const v = x == null ? void 0 : x.actions[f];
      v && Ve(v);
    },
    onFind: () => an(!0),
    onSelectAll: () => yt((f) => rd(f, O))
  }), Q(() => an(!1), [st, wt, x == null ? void 0 : x.id]);
  function Sa(f) {
    const v = "steps" in f ? f.steps.length > 0 : f.effect.mode !== "SKIP", M = "effect" in f && f.effect.mode === "SET_TAG_GROUP" ? f.effect.tagGroupId : null, U = M != null && !R.some((ee) => ee.id === M);
    return Le || ye || !!Ne || v && !Pt || "effect" in f && v && (!q || U) || Hn(f) && (_e == null ? void 0 : _e.kind) !== "ready" || !Qe.length;
  }
  function ur(f) {
    et(null), Jt(0), Ae(null), W(f), mi(f, !!f && !x);
  }
  function Ir() {
    $e.current || (Kc() ? ($e.current = !0, window.history.back()) : ur(""));
  }
  function At() {
    const f = $e.current;
    $e.current = !1;
    let v = fs();
    v && !be.current && !j.current.some((U) => U.id === v) && (v = "", mi(""));
    const M = H.current;
    v !== M && (Jt(0), f || Ae(null), !v && M && (Fe.current ?? (Fe.current = { reviewId: M }))), W(v);
  }
  function Rr() {
    Fe.current = "heading", Ae(null), Ir();
  }
  function Za(f) {
    f !== T && ur(f), Jt((v) => v + 1);
  }
  function Yc() {
    Ae(null), Mt({
      review: Wc("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function Xc(f) {
    if (Tt || !L) return;
    Ae(null);
    const v = crypto.randomUUID();
    let M;
    const U = T;
    An(!0);
    try {
      if (!await Yr((J) => (M = td(
        J.find((re) => re.id === f.id) ?? f,
        J,
        v
      ), [...J, M]))) throw new Error("Could not save reviews.");
      if (!pe.current) return;
      H.current !== U ? Ae({ text: `Saved the copy “${M.name}”.`, alert: !1 }) : Za(M.id);
    } catch (ee) {
      Ae({
        text: `“${f.name}” was not duplicated. ${ka(ee)}`,
        alert: !0
      });
    } finally {
      An(!1);
    }
  }
  async function Zc() {
    if (!ut || ut.saving) return;
    const f = { ...ut.review, name: ut.review.name.trim() }, v = oa(f);
    if (v) {
      Mt({ ...ut, error: v });
      return;
    }
    Mt({ ...ut, saving: !0, error: "" });
    try {
      if (!await Yr((M) => [...M, f]))
        throw new Error("Could not save reviews.");
      if (!pe.current) return;
      Mt(null), Za(f.id);
    } catch (M) {
      Mt(
        (U) => U && {
          ...U,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (M instanceof Error ? M.message : "Retry saving.")
        }
      );
    }
  }
  async function el() {
    if (!ht || ht.pending) return;
    const f = ht.review, v = Jc(t, oe, we, ze).map((ee) => ee.id), M = v.filter((ee) => ee !== f.id), U = M[Math.min(v.indexOf(f.id), M.length - 1)];
    zt({ review: f, pending: !0 });
    try {
      if (!await Yr((ee) => ee.filter((J) => J.id !== f.id)))
        throw new Error("Could not save reviews.");
      Fe.current = f.id !== T && U ? { reviewId: U } : "heading", Ae({ text: `Deleted “${f.name}”.`, alert: !1 });
    } catch (ee) {
      Ae({ text: `“${f.name}” was not deleted. ${ka(ee)}`, alert: !0 });
    } finally {
      zt(null);
    }
  }
  async function tl(f) {
    if (!(Tt || !L)) {
      Ae(null), Vt(!0);
      try {
        const v = await Ku(f);
        let M = 0;
        if (v.length && !await Yr((ee) => {
          const J = gi(ee, v);
          return M = J.length - ee.length, M ? J : ee;
        }))
          throw new Error("Could not save reviews.");
        const U = v.length - M;
        Ae({
          alert: !1,
          text: v.length ? M ? `Imported ${M === 1 ? "1 review" : `${M} reviews`}.` + (U === 1 ? " 1 review already in the list stays as it is." : U ? ` ${U} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (v) {
        Ae({ alert: !0, text: `Could not import “${f.name}”. ${ka(v)}` });
      } finally {
        Vt(!1);
      }
    }
  }
  function ka(f) {
    return f instanceof Ps ? "Reviews changed in another browser. Reload the page to get them, then try again." : f instanceof Error ? f.message : "Try again.";
  }
  function No(f) {
    const v = !L || Tt;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ r(Ss, { "aria-hidden": "true" }),
        disabled: v,
        onSelect: () => void Xc(f)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ r(Is, { "aria-hidden": "true" }),
        onSelect: () => lo(f)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ r(Gi, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: v,
        onSelect: () => {
          Ae(null), zt({ review: f, pending: !1 });
        }
      }
    ];
  }
  function qo(f, v) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ r(Lr, { "aria-hidden": "true" }),
        ...v,
        disabled: v.disabled || Me
      },
      ...No(f),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ r(ua, { "aria-hidden": "true" }),
        separated: !0,
        disabled: Me,
        onSelect: Rr
      }
    ];
  }
  async function Yr(f) {
    if (!i) return !1;
    let v = [];
    const M = await md(i, (re) => {
      v = re;
      const vt = f(re);
      return vt === re ? re : vt.map(mh);
    });
    if (n(M), !pe.current) return !0;
    const U = H.current;
    U && !M.some((re) => re.id === U) && Ir();
    const ee = v.find((re) => re.id === U), J = M.find((re) => re.id === U);
    return J && ee && ((J.view.reviewMode ?? "single") !== (ee.view.reviewMode ?? "single") && et(null), J.view.displayMode !== ee.view.displayMode && qr(ds(J))), !0;
  }
  function ei(f) {
    return Yr((v) => ph(v, f));
  }
  function nl(f) {
    return ei(f).catch((v) => {
      throw H.current !== f.id && ti(f, v), v;
    });
  }
  function ti(f, v) {
    var U;
    if (!pe.current) return;
    const M = ((U = j.current.find((ee) => ee.id === f.id)) == null ? void 0 : U.name) ?? f.name;
    Ae({ text: `“${M}” was not saved. ${ka(v)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ r(ps, { label: "Loading reviews…" });
  if (u)
    return /* @__PURE__ */ l(ge, { children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          onClick: () => void vh().catch(
            (f) => p(
              "Could not export browser reviews. " + (f instanceof Error ? f.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ r(
        ms,
        {
          message: u,
          onRetry: () => void Hr()
        }
      )
    ] });
  const ni = /* @__PURE__ */ l(ge, { children: [
    ie && /* @__PURE__ */ r("p", { className: "dq-status", children: ie }),
    tt && (_e == null ? void 0 : _e.kind) === "missing" && /* @__PURE__ */ l("div", { role: "status", className: "dq-status", children: [
      _e.message,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: rr,
          onClick: () => {
            ar(!0), Er(""), (Rt ? Rd(pt) : Id(pt)).then(h).catch(
              (f) => Er(
                `Could not create the ${Rt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (f instanceof Error ? f.message : "Request failed.")
              )
            ).finally(() => ar(!1));
          },
          children: rr ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    tt && ((_e == null ? void 0 : _e.kind) === "incompatible" || cn) && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(On, {}),
      cn || (_e == null ? void 0 : _e.message),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: rr,
          onClick: () => {
            ar(!0), h().finally(
              () => ar(!1)
            );
          },
          children: rr ? "Checking…" : "Check again"
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
            ), M = document.createElement("a");
            M.href = v, M.download = "data-quality-unassigned-legacy-reviews.json", M.click(), URL.revokeObjectURL(v);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    D && /* @__PURE__ */ l("p", { role: "alert", children: [
      D,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => {
            S(""), Y(!1);
          },
          children: I ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    it && (it.alert ? /* @__PURE__ */ l("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(On, { "aria-hidden": "true" }),
      it.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ r("p", { className: "dq-status", "aria-hidden": "true", children: it.text })
    ))
  ] });
  return /* @__PURE__ */ l(
    "div",
    {
      ref: Rn,
      className: `data-quality-page${or ? " dq-page-fit" : ""}`,
      style: or ? {
        "--dq-fit-top": `${sr.top}px`,
        "--dq-fit-bottom": `${sr.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: it && !it.alert ? it.text : "" }),
        x && st ? /* @__PURE__ */ r(
          Xf,
          {
            review: se ?? x,
            canWrite: Dn ? w : Yt,
            canAssess: (_e == null ? void 0 : _e.kind) === "ready" && Yt,
            onBusy: ft,
            editRequest: Tn,
            onEditRequestHandled: () => Jt(0),
            onSaveDefaults: L ? nl : void 0,
            pageControls: {
              onBack: Rr,
              moreItems: (f) => qo(se ?? x, f),
              onGrid: fe ? () => et({ id: fe.id, mode: "multiple" }) : void 0,
              notices: ni,
              busy: Me
            },
            stayOnTap: Ft,
            onStayOnTapChange: mn
          },
          x.id
        ) : x ? ul(x) : /* @__PURE__ */ r(
          rh,
          {
            reviews: t,
            counts: oe,
            sort: we,
            direction: ze,
            onSortChange: (f) => Et({ sort: f }),
            onDirectionChange: (f) => Et({ direction: f }),
            storage: ih[ne],
            canConfigure: L,
            busy: Tt,
            headingRef: pn,
            notices: ni,
            onOpen: ur,
            onNew: () => Yc(),
            onImport: (f) => void tl(f),
            onExportAll: () => qc(t, "data-quality-reviews.json"),
            rowMenuItems: (f) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ r(Lr, { "aria-hidden": "true" }),
                disabled: !L || Tt,
                onSelect: () => Za(f.id)
              },
              ...No(f)
            ]
          }
        ),
        wt && le && fe && /* @__PURE__ */ r(
          yh,
          {
            video: le,
            review: fe,
            selectedCount: St.size,
            pending: Le,
            refreshing: ye || !!Ne,
            error: sn,
            canWrite: d,
            assessmentReady: (_e == null ? void 0 : _e.kind) === "ready",
            trees: Gn,
            selected: St.has(le.id),
            hasPrevious: O.indexOf(le.id) > 0,
            hasNext: O.indexOf(le.id) >= 0 && O.indexOf(le.id) < O.length - 1,
            onToggleSelected: () => yt((f) => Fa(f, le.id)),
            onPrevious: () => lt(-1),
            onNext: () => lt(1),
            onClose: () => {
              _t(!1), Be(bt.current);
            },
            onAction: Ve,
            findOpen: tr,
            onFindOpenChange: an
          }
        ),
        tr && x && !st && !wt && /* @__PURE__ */ r(
          so,
          {
            actions: x.actions,
            tagGroups: R,
            trees: Gn,
            isDisabled: Sa,
            canStay: !1,
            onApply: (f) => {
              an(!1), Ve(f);
            },
            onClose: () => an(!1)
          }
        ),
        ut && /* @__PURE__ */ r(
          ah,
          {
            draft: ut,
            onChange: (f) => Mt((v) => v && { ...v, review: f, error: "" }),
            onCreate: () => void Zc(),
            onCancel: () => Mt(null)
          }
        ),
        /* @__PURE__ */ r(
          Al,
          {
            open: !!ht,
            title: "Delete review?",
            message: ht ? `“${ht.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (ht == null ? void 0 : ht.pending) ?? !1,
            onConfirm: () => void el(),
            onCancel: () => zt((f) => f != null && f.pending ? f : null)
          }
        )
      ]
    }
  );
  async function Ea(f, v, M = !1, U = !0) {
    const ee = bt.current, J = Math.max(0, O.indexOf(ee ?? -1));
    try {
      const re = k(
        f,
        v,
        M,
        f.view.selectAllOnLoad === !0
      ), vt = $t.current, Ke = await re;
      if (vt !== $t.current) return;
      const We = Ke.items.map((He) => He.id);
      Xt(
        (He) => new Set([...He].filter((Kn) => We.includes(Kn)))
      );
      const Se = $o(We, ee, J);
      nt(Se), U && !jt.current && Be(Se, !1);
    } catch {
    }
  }
  function rl(f) {
    const v = gn.current;
    if (gn.current = null, Qr || !x || !se) return;
    const M = v ?? x.view.objectFilter, U = yr(
      M,
      se.view.objectFilter
    ) ? se.view.objectFilter : M, ee = Kt({ ...f, page: 1 }), J = {
      ...x,
      view: {
        ...x.view,
        filter: ee,
        objectFilter: U
      }
    }, re = !ls(J, se), vt = re ? J : se;
    It(re ? J : null), on(re ? "" : "Review queue defaults restored."), Ea(vt, ee, !0);
  }
  function al() {
    if (Le || ye || Ut || !se) return;
    gn.current = null;
    const f = Kt({
      ...se.view.filter,
      page: 1
    });
    It(null), on("Review queue defaults restored."), Ea(
      se,
      f,
      se.view.startFrom !== "beginning",
      !1
    );
  }
  function il() {
    if (Le || ye || Ne || Ut || !x || !lr || !L)
      return;
    const f = x, v = lr;
    kr(!0), ei(v).then((M) => {
      !M || H.current !== v.id || (It(cs(v, f)), on("Queue saved to this review."));
    }).catch((M) => {
      H.current !== v.id ? ti(v, M) : vn(M instanceof Error ? M.message : "Could not save queue.");
    }).finally(() => kr(!1));
  }
  function ri() {
    if (!x || !se || yn.current || ve || wn) return;
    Ln.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, ot.current = {
      temporaryReview: xe,
      filter: E,
      loadedFilter: X,
      queue: ce,
      queueError: Ne,
      retryFromEnd: Gr,
      selectedIds: new Set(St),
      focusedId: De,
      pageCursor: Un.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const f = structuredClone({
      ...se,
      view: { ...se.view, startFrom: x.view.startFrom ?? "end" }
    });
    an(!1), _t(!1), on(""), vn(""), Ct({ draft: f, saving: !1, error: "" });
  }
  function So() {
    Ct(null), ot.current = null;
    const f = Ln.current;
    Ln.current = null, requestAnimationFrame(() => {
      (f == null ? void 0 : f.isConnected) && f !== document.body && !(f instanceof HTMLButtonElement && f.disabled) ? f.focus({ preventScroll: !0 }) : Be(bt.current, !1);
    });
  }
  function ol() {
    var v;
    if (!ve || ve.saving) return;
    const f = ot.current;
    f && ($t.current += 1, (v = cr.current) == null || v.abort(), gn.current = null, qe(!1), It(f.temporaryReview), P(f.filter), me(f.loadedFilter), Re(f.queue), Dt(f.queueError), Kr(f.retryFromEnd), yt(() => f.selectedIds), nt(f.focusedId), Un.current = f.pageCursor, window.history.replaceState(window.history.state, "", f.url)), So();
  }
  async function sl() {
    if (!ve || ve.saving || !ln || !x) return;
    const f = x, v = { ...ln, name: ln.name.trim() }, M = oa(v);
    if (M) {
      Ct((U) => U && { ...U, error: M });
      return;
    }
    Ct((U) => U && { ...U, saving: !0, error: "" });
    try {
      if (!await ei(v)) throw new Error("Could not save reviews.");
      if (!pe.current || H.current !== v.id) return;
      It(cs(v, f)), je(v) === "video" && na(v.id, {
        filter: E,
        objectFilter: f.view.objectFilter,
        searchMode: v.view.searchMode,
        startFrom: v.view.startFrom ?? "end"
      }), on("Review saved."), So();
    } catch (U) {
      if (H.current !== v.id) {
        ti(v, U);
        return;
      }
      Ct(
        (ee) => ee && {
          ...ee,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (U instanceof Error ? U.message : "Retry saving.")
        }
      );
    }
  }
  function ko() {
    x && k(x, E, Gr, bn).catch(() => {
    });
  }
  function cl() {
    Xt(/* @__PURE__ */ new Set()), gt.current.clear(), nt(null);
  }
  function ll(f) {
    !x || Le || Ut || f === Number(E.page) || hh(
      { ...E, page: f },
      x,
      (v, M) => k(v, M, !1, bn),
      cl
    );
  }
  function dl(f) {
    if (!fe || !se || Le || ye || Ut) return;
    const v = Bf(fe, f, se.view.objectFilter), M = !ls(v, se);
    It(M ? v : null), M ? Ea(v, { ...E, page: 1 }) : Ea(
      se,
      { ...E, page: 1 },
      se.view.startFrom !== "beginning"
    );
  }
  function ul(f) {
    var Ke, We;
    const v = Ee === "tag", M = v ? "tag" : "video", U = Math.max(1, Number(E.perPage) || 40), ee = Math.max(1, Math.ceil(ce.totalCount / U)), J = Math.min(Math.max(1, Number(E.page) || 1), ee), re = [
      Pt ? "" : `${jn} write permission is required to apply actions.`,
      v && _ ? `Tag groups are unavailable. ${_}` : ""
    ].filter(Boolean), vt = !!sn && !wt;
    return /* @__PURE__ */ l(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": v ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ r(
            Ec,
            {
              name: f.name,
              description: f.description,
              entityType: Ee,
              onBack: Rr,
              backDisabled: Le || !!ve || Me,
              onEdit: ve ? () => {
                var Se;
                return (Se = Wt.current) == null ? void 0 : Se.focus();
              } : ri,
              editDisabled: !ve && (Le || ye || In || wn || Me || !L),
              editing: !!ve,
              toolbar: /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: Qr, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: v ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ r(
                  ra,
                  {
                    filter: Ne ? X : E,
                    onFilterChange: rl,
                    totalCount: ce.totalCount,
                    sortOptions: v ? Il : ws,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Zt,
                    zoomLevel: (Sr - 225) / 50,
                    onZoomChange: (Se) => ba(Math.round(225 + Se * 50)),
                    cardSizeEntityType: v ? "tags" : "videos",
                    criteriaDefinitions: v ? Tl : ji,
                    customFieldEntityType: Ee === "video" ? "video" : void 0,
                    objectFilter: Xa,
                    onObjectFilterChange: (Se) => {
                      Qr || (gn.current = Ee === "video" ? Tc(
                        Se,
                        Vr,
                        f.view.objectFilter
                      ) : Se);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(Cc, { page: J, pages: ee, onPage: ll })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ l(ge, { children: [
                fe && /* @__PURE__ */ r(
                  Ac,
                  {
                    mode: "multiple",
                    disabled: Le || ye || qt || !!ve || wn || Me,
                    onChange: () => et({ id: fe.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ r(
                  tf,
                  {
                    options: v ? lh : ch,
                    value: Zt,
                    onChange: (Se) => qr(us(Se, Ee))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ r(
                uo,
                {
                  disabled: Le || !!ve,
                  items: qo(se ?? f, {
                    onSelect: ri,
                    disabled: ye || In || wn || !L
                  })
                }
              ),
              queueDiffers: A ? (xe == null ? void 0 : xe.id) === T : void 0,
              queueChange: !ve && (xe == null ? void 0 : xe.id) === T ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: Wr ? il : void 0,
                saveDisabled: Le || ye || !!Ne || Ut || !L,
                onReset: al,
                resetDisabled: Le || ye || Ut
              } : void 0,
              chipsAfter: (We = (Ke = fe == null ? void 0 : fe.presentation) == null ? void 0 : Ke.binParents) != null && We.length ? /* @__PURE__ */ r(
                Gf,
                {
                  videos: ce.items,
                  review: fe,
                  savedObjectFilter: (se ?? fe).view.objectFilter,
                  trees: nn.ids,
                  disabled: Le || ye || Ut,
                  onToggle: dl
                }
              ) : void 0,
              chipsEnd: ve ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          ni,
          fe && nn.error && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: nn.error }),
          /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
            ve && ln && /* @__PURE__ */ r(
              kc,
              {
                drawerRef: Wt,
                draft: ln,
                onChange: (Se) => Ct((He) => He && { ...He, draft: Se }),
                direction: ve.draft.view.startFrom ?? "end",
                onDirectionChange: (Se) => Ct(
                  (He) => He && {
                    ...He,
                    draft: { ...He.draft, view: { ...He.draft.view, startFrom: Se } }
                  }
                ),
                tagGroups: R,
                trees: Gn,
                saving: ve.saving,
                saveDisabled: ye || !!Ne,
                error: ve.error,
                dirty: Na,
                criteriaChanged: Wr,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  Ne && !ye ? /* @__PURE__ */ l("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ r(On, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { children: [
                      "The queue could not load: ",
                      Ne,
                      " ",
                      /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", onClick: ko, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void sl(),
                onCancel: ol
              }
            ),
            /* @__PURE__ */ l(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${Ya}px` },
                children: [
                  /* @__PURE__ */ l("div", { className: "dq-grid-content", children: [
                    ye && !ce.items.length && /* @__PURE__ */ r(ps, { label: "Loading review queue…" }),
                    Ne && !ye && /* @__PURE__ */ r(
                      ms,
                      {
                        message: Ne,
                        retryLabel: In ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (In && se && je(se) === "video") {
                            const Se = vr(se);
                            na(se.id, { ...Se, filter: { ...Se.filter, page: void 0 } }), xt((He) => He + 1);
                            return;
                          }
                          ko();
                        }
                      }
                    ),
                    !Le && !ye && !Ne && !ce.items.length && /* @__PURE__ */ l("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ r(Va, {}),
                      /* @__PURE__ */ l("p", { children: [
                        "No ",
                        M,
                        "s match this review."
                      ] })
                    ] }),
                    !!ce.items.length && /* @__PURE__ */ r("div", { ref: zr, children: /* @__PURE__ */ r(
                      "div",
                      {
                        className: Zt === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${Sr}px` },
                        children: ce.items.map(fl)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ r("div", { className: "dq-bar-dock", ref: Jr, children: /* @__PURE__ */ r(
                    pc,
                    {
                      actions: ve ? ve.draft.actions : f.actions,
                      tagGroups: R,
                      trees: Gn,
                      isDisabled: Sa,
                      paused: !!ve,
                      busy: Le || ye,
                      onApply: (Se) => void Ve(Se),
                      onFind: () => an(!0),
                      status: Le ? `Applying action to ${wa}…` : "",
                      summary: /* @__PURE__ */ l(ge, { children: [
                        /* @__PURE__ */ r("p", { className: "dq-bar-target", children: St.size ? `${St.size} selected` : De == null ? "Nothing to apply to" : `Applies to the focused ${M}` }),
                        /* @__PURE__ */ l(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !O.length || Ot,
                            onClick: () => yt((Se) => /* @__PURE__ */ new Set([...Se, ...O])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ r(dt, { binding: qa.selectAll, hidden: !0 })
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
                              /* @__PURE__ */ r(dt, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: re.length ? re.join(" ") : void 0,
                      keyHints: v ? "Arrows move · Space selects · Enter opens" : ve ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews",
                      notices: vt || rt ? /* @__PURE__ */ l(ge, { children: [
                        vt && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ r(On, { "aria-hidden": "true" }),
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
  function fl(f) {
    var M, U, ee;
    if (Ee === "tag") {
      const J = f;
      return /* @__PURE__ */ r(
        gh,
        {
          tag: J,
          displayMode: Zt === "list" ? "list" : "grid",
          focused: J.id === De,
          selected: St.has(J.id),
          setRef: (re) => {
            re ? ir.current.set(J.id, re) : ir.current.delete(J.id);
          },
          onFocus: () => nt(J.id),
          onToggle: () => {
            yt((re) => Fa(re, J.id)), Be(J.id, !1);
          },
          onOpen: () => window.open(`/tag/${J.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        J.id
      );
    }
    const v = f;
    return /* @__PURE__ */ r(
      bh,
      {
        video: Uf(v, fe, nn.ids),
        showTagBins: ((U = (M = fe == null ? void 0 : fe.presentation) == null ? void 0 : M.annotations) == null ? void 0 : U.includes("tags")) && !!((ee = fe.presentation.annotationParents) != null && ee.length),
        displayMode: Zt,
        cardsScroll: Qa,
        focused: v.id === De,
        selected: St.has(v.id),
        setRef: (J) => {
          J ? ir.current.set(v.id, J) : ir.current.delete(v.id);
        },
        onFocus: () => nt(v.id),
        onToggle: () => yt((J) => Fa(J, v.id)),
        onPreview: () => {
          ve || (nt(v.id), _t(!0));
        },
        onNavigate: e
      },
      v.id
    );
  }
}
function hh(e, t, n, a) {
  a(), n(t, e).catch(() => {
  });
}
function Fa(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function ph(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function mh(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function gh({
  tag: e,
  displayMode: t,
  focused: n,
  selected: a,
  setRef: i,
  onFocus: o,
  onToggle: s,
  onOpen: c,
  onNavigate: u
}) {
  return /* @__PURE__ */ r(
    "article",
    {
      ref: i,
      tabIndex: 0,
      "aria-current": n ? "true" : void 0,
      "aria-label": `${e.name}${a ? ", selected" : ""}`,
      onFocus: o,
      onClick: (p) => {
        o(), p.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${n ? "focused" : ""} ${a ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ r(
        Rl,
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
function bh({
  video: e,
  showTagBins: t,
  displayMode: n,
  cardsScroll: a,
  focused: i,
  selected: o,
  setRef: s,
  onFocus: c,
  onToggle: u,
  onPreview: p,
  onNavigate: d
}) {
  var q, y;
  const g = Hc(e), m = $(null), b = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, w = !!(b.date || b.studioName), N = !!(b.performers.length || b.tags.length);
  return kt(() => {
    const R = m.current;
    if (!R) return;
    const F = R.querySelector(
      `a[href="/video/${e.id}"]`
    ), _ = R.querySelector(".card-title"), B = `dq-card-title-${e.id}`;
    _ && (_.id = B), F && (F.target = "_blank", F.rel = "noreferrer", F.removeAttribute("aria-label"), F.setAttribute("aria-labelledby", B), F.classList.add("dq-card-link"));
    const L = R.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    L && L.setAttribute(
      "aria-label",
      o ? `Deselect ${g}` : `Select ${g}`
    );
    const Z = R.querySelector(
      'button[title="Quick View"]'
    );
    Z && Z.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ l(
    "article",
    {
      ref: (R) => {
        m.current = R, s(R);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${g}${o ? ", selected" : ""}`,
      onFocus: c,
      onClick: (R) => {
        c(), R.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${w ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ r(
          $l,
          {
            video: b,
            selected: o,
            onSelect: u,
            onNavigate: d,
            onQuickView: p,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ l("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (q = e.tags) == null ? void 0 : q.map((R) => /* @__PURE__ */ r("span", { children: R.name }, R.id)),
          !((y = e.tags) != null && y.length) && /* @__PURE__ */ r("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ r(wh, { video: e, cardsScroll: a })
      ]
    }
  );
}
function wh({ video: e, cardsScroll: t }) {
  const n = $(null), a = $(null), [i, o] = C(!1), [s, c] = C(!1), [u, p] = C(!1);
  return Q(() => {
    const d = n.current;
    if (!d || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), c(!0);
      return;
    }
    const g = t ? d.closest(".dq-grid-stage") : null, m = new IntersectionObserver(
      ([w]) => o(w.isIntersecting),
      { root: g, rootMargin: "320px 0px", threshold: 0 }
    ), b = new IntersectionObserver(
      ([w]) => c(w.isIntersecting && w.intersectionRatio >= 0.6),
      { root: g, threshold: [0, 0.6, 1] }
    );
    return m.observe(d), b.observe(d), () => {
      m.disconnect(), b.disconnect();
    };
  }, [e.id, e.files.length, t]), Q(() => {
    if (!i) {
      p(!1);
      return;
    }
    const d = new AbortController();
    return ue(Cd(e.id), {
      signal: d.signal
    }).then((g) => {
      d.signal.aborted || p(g.available === !0);
    }).catch(() => {
      d.signal.aborted || p(!1);
    }), () => d.abort();
  }, [i, e.id]), Q(() => {
    const d = a.current;
    d && (s ? Promise.resolve(d.play()).catch(() => {
    }) : d.pause());
  }, [u, s]), /* @__PURE__ */ r("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: u && /* @__PURE__ */ r(
    "video",
    {
      ref: a,
      src: Ed(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function yh({
  video: e,
  review: t,
  selectedCount: n,
  pending: a,
  refreshing: i,
  error: o,
  canWrite: s,
  assessmentReady: c,
  trees: u,
  selected: p,
  hasPrevious: d,
  hasNext: g,
  onToggleSelected: m,
  onPrevious: b,
  onNext: w,
  onClose: N,
  onAction: q,
  findOpen: y,
  onFindOpenChange: R
}) {
  const F = $(null), _ = ma(), B = $(null), L = e.files[0], Z = Hc(e), ne = (S) => a || i || "steps" in S && S.steps.length > 0 && !s || Hn(S) && !c;
  ao({
    surface: "overlay",
    enabled: !y,
    actions: t.actions,
    onAction: (S) => {
      const I = t.actions[S];
      I && q(I);
    },
    onFind: () => R(!0)
  }), Q(() => {
    var I;
    const S = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (I = F.current) == null || I.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = S;
    };
  }, []);
  function ae(S) {
    var A, V, z;
    if (S.key !== "Tab") return;
    const I = [
      ...((A = F.current) == null ? void 0 : A.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((K) => K.offsetParent !== null);
    if (!I.length) {
      S.preventDefault(), (V = F.current) == null || V.focus();
      return;
    }
    const Y = I.indexOf(
      document.activeElement
    );
    S.shiftKey && Y <= 0 ? (S.preventDefault(), (z = I.at(-1)) == null || z.focus()) : !S.shiftKey && Y === I.length - 1 && (S.preventDefault(), I[0].focus());
  }
  function ie(S) {
    if (y || S.defaultPrevented || S.ctrlKey || S.metaKey || S.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const I = S.key === "ArrowLeft" || S.key === "ArrowRight";
    if (S.altKey && !I) return;
    const Y = B.current, A = S.currentTarget.querySelector("video");
    if (S.key === "Enter" || S.key === "Escape")
      S.repeat || N();
    else if (S.key === " " && Y)
      S.repeat || Y.toggle();
    else if (I && Y)
      Y.seekBy(
        (S.key === "ArrowLeft" ? -1 : 1) * (S.shiftKey ? 5 : S.altKey ? 10 : 60)
      );
    else if ((S.key === "," || S.key === ".") && Y) {
      const V = [L == null ? void 0 : L.duration, A == null ? void 0 : A.duration].find(
        (K) => K != null && Number.isFinite(K) && K > 0
      ) ?? 0, z = e.parentVideoId != null ? (e.clipEndSec ?? V) - (e.clipStartSec ?? 0) : V;
      Number.isFinite(z) && z > 0 && Y.seekBy((S.key === "," ? -1 : 1) * z * 0.1);
    } else if (S.key.toLowerCase() === "n" || S.key.toLowerCase() === "m")
      !S.repeat && !a && !i && (S.key.toLowerCase() === "n" && d && b(), S.key.toLowerCase() === "m" && g && w());
    else if (S.key === "ArrowUp" && A)
      A.volume = Math.min(1, A.volume + 0.1);
    else if (S.key === "ArrowDown" && A)
      A.volume = Math.max(0, A.volume - 0.1);
    else return;
    Mr(S);
  }
  function G(S) {
    const I = F.current, Y = S.target instanceof Element ? S.target.closest("button, a[href]") : null;
    !I || !Y || !I.contains(Y) || Y.closest(".dq-player, .dq-find-action") || S.detail === 0 || I.focus({ preventScroll: !0 });
  }
  Q(() => {
    if (y) return;
    let S = 0;
    const I = requestAnimationFrame(() => {
      S = requestAnimationFrame(() => {
        var A;
        const Y = document.activeElement;
        (A = F.current) != null && A.isConnected && (!Y || Y === document.body || Y === document.documentElement) && F.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(I), cancelAnimationFrame(S);
    };
  }, [y, a, i, g, d, e.id, _]);
  const D = n ? `the ${n} selected video${n === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ l(
    "div",
    {
      ref: F,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${Z}`,
      className: `dq-preview${_ ? " dq-preview-mobile" : ""}`,
      onKeyDown: ae,
      onKeyDownCapture: ie,
      onMouseDown: (S) => {
        S.target === S.currentTarget && N();
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
                "aria-keyshortcuts": "n",
                title: "Previous video",
                disabled: !d || a || i,
                onClick: b,
                children: [
                  /* @__PURE__ */ r(ua, { "aria-hidden": "true" }),
                  !_ && /* @__PURE__ */ r(dt, { binding: "n", hidden: !0 })
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
                disabled: !g || a || i,
                onClick: w,
                children: [
                  !_ && /* @__PURE__ */ r(dt, { binding: "m", hidden: !0 }),
                  /* @__PURE__ */ r(As, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ l("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ r("h2", { children: Z }),
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
                "aria-pressed": p,
                disabled: i,
                onClick: m,
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-preview-check", "aria-hidden": "true", children: p && /* @__PURE__ */ r(la, {}) }),
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
                children: /* @__PURE__ */ r(Ts, { "aria-hidden": "true" })
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
                children: /* @__PURE__ */ r(da, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ r("div", { className: "dq-preview-video", children: L ? /* @__PURE__ */ r(
            ys,
            {
              autostart: !0,
              streamUrl: Ni("video", e.id),
              posterUrl: Po(e),
              format: L.format,
              audioCodec: L.audioCodec,
              duration: L.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onPlaybackControlRegister: (S) => (B.current = S, () => {
                B.current === S && (B.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ r("img", { src: Po(e), alt: "" }) }) }),
          o && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert dq-preview-alert", children: o }),
          !_ && /* @__PURE__ */ l("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ r("span", { children: "Space play / pause" }),
            /* @__PURE__ */ r("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ r("span", { children: ", . ±10 %" }),
            /* @__PURE__ */ r("span", { children: "↑ ↓ volume" }),
            /* @__PURE__ */ r("span", { children: "N M previous / next" }),
            /* @__PURE__ */ r("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ r(
            pc,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: u,
              isDisabled: ne,
              busy: a || i,
              onApply: (S) => void q(S),
              onFind: () => R(!0),
              status: a ? `Applying action to ${D}…` : "",
              summary: /* @__PURE__ */ r("p", { className: "dq-bar-target", children: n ? `${n} selected` : "This video" })
            }
          )
        ] }),
        y && /* @__PURE__ */ r(
          so,
          {
            actions: t.actions,
            trees: u,
            isDisabled: ne,
            canStay: !1,
            onApply: (S) => {
              R(!1), q(S);
            },
            onClose: () => R(!1)
          }
        )
      ]
    }
  );
}
async function vh() {
  const e = await ue("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
  let a = n ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (n)
    try {
      const s = JSON.parse(n);
      Array.isArray(s.reviews) && (a = JSON.stringify(s.reviews, null, 2));
    } catch {
    }
  const i = URL.createObjectURL(
    new Blob([a], { type: "application/json" })
  ), o = document.createElement("a");
  o.href = i, o.download = "data-quality-browser-recovery.json", o.click(), URL.revokeObjectURL(i);
}
function ps({ label: e }) {
  return /* @__PURE__ */ l("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ r(Kl, { className: "dq-spin" }),
    e
  ] });
}
function ms({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ l("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ r(On, {}),
    /* @__PURE__ */ r("p", { children: e }),
    /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const Ah = { components: { DataQualityPage: fh } };
export {
  fh as DataQualityPage,
  Ah as default,
  yr as objectFiltersEqual
};
