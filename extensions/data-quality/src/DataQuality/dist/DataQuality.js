import { jsxs as l, Fragment as me, jsx as r } from "react/jsx-runtime";
import { useState as C, useRef as O, useEffect as H, useLayoutEffect as Rt, useMemo as ye, useCallback as Nn, useSyncExternalStore as Fi, useId as ut, createContext as hl, useContext as pl, Fragment as Pi } from "react";
import { useKeySequence as ml, EntityReferenceMultiSelector as Qn, SortableList as fs, TagBadge as gl, EntityReferenceSelector as Co, EntityDetailTabs as bl, DetailListToolbar as ra, PERFORMER_CRITERIA as xi, AUDIO_CRITERIA as hs, VIDEO_CRITERIA as Li, NarrativeText as yl, AUDIO_SORT_OPTIONS as wl, VIDEO_SORT_OPTIONS as ps, AudioPlayer as vl, VideoPlayer as ms, formatDuration as gs, FilterDialog as Nl, getResolutionLabel as ql, ConfirmDialog as Sl, TAG_CRITERIA as El, TAG_SORT_OPTIONS as kl, TagTile as Cl, VideoCard as Al } from "@cove/runtime/components";
import { Search as ca, Flag as $n, Check as Ka, Pencil as Lr, Ban as xa, Pin as Di, Plus as _i, GripVertical as bs, AlertTriangle as In, Copy as ys, Trash2 as ji, ChevronDown as ws, X as la, Mic as Tl, Users as vs, Tag as Ns, Headphones as qs, Film as Ba, ChevronLeft as da, MoreHorizontal as Il, RectangleHorizontal as Rl, LayoutGrid as Ui, ChevronRight as Ss, Save as $l, RotateCcw as Ol, Layers as Ao, Undo2 as Ml, RefreshCw as Fl, ExternalLink as Es, SkipForward as Pl, Upload as xl, Download as ks, ArrowUp as Ll, ArrowDown as Dl, Loader2 as _l, List as jl, Grid3X3 as Ul } from "@cove/runtime/lucide-react";
import { extensionFetch as Gl } from "@cove/runtime/api";
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
function Cs(e) {
  const t = [...e.performerFlags ?? []];
  for (const n of e.flagPerformerTagIds ?? [])
    t.some((a) => a.tagId === n && a.categoryTagId === void 0) || t.push({ tagId: n });
  return t;
}
function Kl(e, t) {
  const { performerFlags: n, flagPerformerTagIds: a, ...i } = e, o = [];
  for (const s of t)
    o.some(
      (c) => c.tagId === s.tagId && c.categoryTagId === s.categoryTagId
    ) || o.push(
      s.categoryTagId === void 0 ? { tagId: s.tagId } : { tagId: s.tagId, categoryTagId: s.categoryTagId }
    );
  return o.length ? { ...i, performerFlags: o } : i;
}
const As = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Re(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function Vi(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function je(e) {
  return Vi(_e(e));
}
function Bl(e) {
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
function hr(e) {
  return typeof e == "string" && Jn.includes(e);
}
function Ji(e) {
  const t = e.shortcut;
  return hr(t) || t === zn ? t : "auto";
}
function Ts(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), i = [];
  e.forEach((s, c) => {
    const u = Ji(s);
    if (u !== zn) {
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
function Vl(e, t, n) {
  const { keys: a, actionOn: i } = Ts(e), o = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (hr(n)) {
    const c = i.get(n), u = a[t];
    c !== void 0 && c !== t && o.set(c, u && e[t].shortcut === u ? u : void 0);
  }
  const s = new Set([...o.values()].filter(hr));
  return e.map((c, u) => {
    const f = o.has(u) ? o.get(u) : hr(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (f === c.shortcut) return c;
    const { shortcut: d, ...m } = c;
    return f === void 0 ? m : { ...m, shortcut: f };
  });
}
function oa(e) {
  return Re(e) && !Is(e.occurrence) ? "Complete the optional occurrence condition before saving." : !Bl(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : _e(e) !== "tag" && e.actions.some(
    (t) => zi(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => On(t, _e(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const Jl = {
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
      Math.min(Jl[t], n(e.perPage, 40))
    )
  };
}
function To(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function Vn(e) {
  const { page: t, ...n } = e.view.filter, a = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Re(e) ? [e.entityType, ...a, e.occurrence] : _e(e) === "video" ? a : [_e(e), ...a]
  );
}
function On(e, t) {
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
function zl(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function Rn(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function wr(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function pi(e) {
  return "steps" in e && e.steps.length > 0;
}
function Wn(e) {
  return "steps" in e ? e.steps.some((t) => Rn(t.mode)) : !1;
}
function zi(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (Rn(n.mode))
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
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || As.includes(n.entityType)) && (!zl(n.entityType) || Is(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && Wl(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (a) => typeof a == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (a) => typeof (a == null ? void 0 : a.id) == "string" && typeof a.label == "string" && (a.shortcut === void 0 || typeof a.shortcut == "string") && (n.entityType === "tag" ? "effect" in a && !("steps" in a) && !("group" in a) && On(a, "tag") : "steps" in a && !("effect" in a) && Array.isArray(a.steps) && a.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && (a.group === void 0 || typeof a.group == "string") && On(a, "video"))
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
function Wl(e, t) {
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
function Ql(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), a = new Set(t.map((c) => n(c.name))), i = e.trim(), o = i.replace(/ copy(?: \d+)?$/i, ""), s = `${o !== i && a.has(n(o)) ? o : i} copy`;
  for (let c = 1; ; c++) {
    const u = c === 1 ? s : `${s} ${c}`;
    if (!a.has(n(u))) return u;
  }
}
function Hl(e, t, n) {
  return { ...structuredClone(e), id: n, name: Ql(e.name, t) };
}
function Is(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (a) => Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(a).size === a.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && Ki.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || Yl(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function Yl(e) {
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
function Io(e, t) {
  return e.size > 0 ? [...e].sort((n, a) => n - a) : t == null ? [] : [t];
}
function Ro(e, t, n, a) {
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
function Xl(e, t) {
  const n = new Set(e), a = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    a ? n.delete(i) : n.add(i);
  return n;
}
function Zl(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function ed(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function td(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function nd(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function rd(e, t) {
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
const Rs = "ext:com.midnightrider.data-quality:configuration", ad = "ext:cove-data-quality:video-reviews", gi = "ext:com.midnightrider.data-quality:progress";
class $s extends Error {
}
const fa = /* @__PURE__ */ new Map(), Ta = /* @__PURE__ */ new Map(), dr = (e, t) => e.includes("*") || e.includes(t), La = (e) => de(`/api/savedfilters?mode=${encodeURIComponent(e)}`), id = () => ({
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
    reviews: ua(JSON.stringify(t.reviews)),
    deletedIds: bi(t.deletedIds),
    importedIds: bi(t.importedIds)
  };
}
function od(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const a = /* @__PURE__ */ new Set();
  for (const i of t) {
    const o = localStorage.getItem(i);
    if (o !== null) {
      const s = ua(o);
      n ?? (n = s), s.forEach((c) => a.add(c.id));
    }
    bi(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((s) => a.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...a],
    present: n !== void 0
  };
}
async function Os(e) {
  const t = await de("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Wi(e, t) {
  const n = (Ta.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Ta.set(e, n), n.finally(() => {
    Ta.get(e) === n && Ta.delete(e);
  }).catch(() => {
  }), n;
}
let Xr = null;
function sd() {
  if (Xr) return Xr;
  const e = cd();
  return Xr = e, e.finally(() => {
    Xr === e && (Xr = null);
  }).catch(() => {
  }), e;
}
async function cd() {
  const e = await de("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return Wi(t, () => ld(e, t));
}
async function ld(e, t) {
  var g;
  const n = String(e.user.id), a = dr(e.permissions, "savedfilters.read"), i = a && dr(e.permissions, "savedfilters.write"), o = a ? (await La(Rs)).filter((v) => v.name === "Data Quality configuration").sort((v, w) => v.id - w.id) : [];
  if (o.length > 1) {
    const v = (w) => {
      const { revision: q, ...S } = Or(w.uiOptions);
      return JSON.stringify(S);
    };
    if (o.some((w) => v(w) !== v(o[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (i)
      for (const w of o.slice(1))
        await de(`/api/savedfilters/${w.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${w.id}` })
        });
    o.splice(1);
  }
  let s = o.length ? Or(o[0].uiOptions) : id();
  const c = localStorage.getItem(`${t}:migrated`) === "true", u = localStorage.getItem(t), f = localStorage.getItem(`${t}:local-only`) === "true";
  !o.length && u && (s = Or(u));
  let d = !o.length;
  if (o.length && f && u) {
    const v = Or(u);
    if (v.reviews.some((q) => {
      const S = s.reviews.find((b) => b.id === q.id);
      return S && JSON.stringify(S) !== JSON.stringify(q);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const w = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...v.deletedIds])
    ];
    s = {
      ...s,
      reviews: mi(s.reviews, v.reviews).filter(
        (q) => !w.includes(q.id)
      ),
      deletedIds: w,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...v.importedIds])
      ]
    }, d = !0;
  }
  if (!c) {
    const v = JSON.stringify(s), w = od(n);
    if (o.length && w.reviews.some((R) => {
      const M = s.reviews.find((j) => j.id === R.id);
      return M && JSON.stringify(M) !== JSON.stringify(R);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const q = a ? (await La(ad)).flatMap(
      (R) => ua(R.uiOptions ?? "[]")
    ) : [], S = w.known.filter(
      (R) => !w.reviews.some((M) => M.id === R)
    ), b = /* @__PURE__ */ new Set([...s.deletedIds, ...S]);
    s = {
      ...s,
      reviews: mi(
        w.reviews,
        s.reviews,
        q.filter(
          (R) => !w.known.includes(R.id) && !s.importedIds.includes(R.id)
        )
      ).filter((R) => !b.has(R.id)),
      deletedIds: [...b],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...w.known,
          ...q.map((R) => R.id)
        ])
      ]
    }, d || (d = JSON.stringify(s) !== v);
  }
  const m = {
    userId: n,
    recordId: (g = o[0]) == null ? void 0 : g.id,
    config: s,
    readable: a,
    writable: i,
    durable: i
  };
  if (fa.set(t, m), d && i) {
    const v = s;
    o.length && (m.config = Or(o[0].uiOptions)), await Ms(t, v), s = m.config;
  } else o.length || (localStorage.setItem(t, JSON.stringify(s)), !a && (!c || f) && localStorage.setItem(`${t}:local-only`, "true"));
  if (!a) localStorage.setItem(`${t}:migrated`, "true");
  else if (i)
    try {
      localStorage.setItem(`${t}:migrated`, "true");
    } catch {
    }
  return {
    reviews: s.reviews,
    storageKey: t,
    canWrite: dr(e.permissions, "videos.write"),
    canWriteVideos: dr(e.permissions, "videos.write"),
    canWriteAudios: dr(e.permissions, "audios.write"),
    canWriteTags: dr(e.permissions, "tags.write"),
    canReadTagGroups: dr(e.permissions, "taggroups.read"),
    canConfigure: !a || i,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: a ? i ? "account" : "readOnly" : "browser",
    storageNotice: a ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Ms(e, t) {
  const n = fa.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const a = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await Os(n), n.recordId != null) {
      const o = await de(
        `/api/savedfilters/${n.recordId}`
      );
      if (Or(o.uiOptions).revision !== n.config.revision)
        throw new $s(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await de(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Rs,
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
function dd(e, t) {
  return Wi(e, async () => {
    const n = fa.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const a = n.config.reviews, i = t(a);
    if (i === a) return a;
    ua(JSON.stringify(i));
    const o = a.filter((s) => !i.some((c) => c.id === s.id)).map((s) => s.id);
    return await Ms(e, {
      ...n.config,
      reviews: i,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...o])
      ].filter((s) => !i.some((c) => c.id === s))
    }), i;
  });
}
function $o(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, a]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(a)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function ud(e, t) {
  const n = fa.get(e);
  if (!n) return null;
  const a = localStorage.getItem(`${e}:progress:${t}`), i = a ? $o(a) : null;
  if (!n.readable) return i;
  const o = (await La(gi)).find(
    (c) => c.name === t
  ), s = o ? $o(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function fd(e, t, n) {
  const a = `${e}:progress:${t}`;
  try {
    localStorage.setItem(a, JSON.stringify(n));
  } catch {
  }
  return Wi(a, async () => {
    const i = fa.get(e);
    if (!(i != null && i.writable)) return;
    await Os(i);
    const o = (await La(gi)).find(
      (s) => s.name === t
    );
    await de(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: gi,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function Hn(e) {
  return e === "audio" ? "audios" : "videos";
}
const hd = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Sn(e) {
  return hd[e];
}
const Da = "confirmed_absent_tags", Qi = "Confirmed absent tags", Va = "confirmed_absent_occurrence_tags", Fs = {
  key: Da,
  label: Qi,
  type: "tag",
  subject: "tag assessments"
}, Hi = {
  key: Va,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, pd = {
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
function Mn(e) {
  return Array.isArray(e) ? e.map(Mn) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? pd[n] ?? n : t === "key" && typeof n == "string" && [
        Da,
        Va
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Mn(n)
    ])
  ) : e;
}
async function Ps(e, t, n) {
  const a = new Headers(t.headers);
  !(t.body instanceof FormData) && !a.has("Content-Type") && a.set("Content-Type", "application/json");
  const i = await Gl(e, { ...t, headers: a });
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
async function de(e, t = {}) {
  return await Ps(e, t, "fail");
}
function md(e, t = {}) {
  return Ps(e, t, "null");
}
const gd = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let bd = 0;
function yi(e, t) {
  return de(
    `/api/${Hn(e)}/${t}?dqRead=${gd}-${++bd}`,
    { cache: "no-store" }
  );
}
function xs(e, t) {
  const n = { ...e.view.objectFilter }, a = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Mn({
      findFilter: Ut(t, je(e)),
      objectFilter: n,
      filterExpression: a
    })
  );
}
async function ta(e, t, n) {
  return de(
    `/api/${Hn(je(e))}/find`,
    { method: "POST", signal: n, body: xs(e, t) }
  );
}
async function yd(e, t, n) {
  return (await de(
    `/api/${Hn(je(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: xs(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function Oo(e, t, n) {
  const a = { ...e.view.objectFilter };
  return delete a._filterExpression, de("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Mn({
        findFilter: Ut(t),
        objectFilter: a
      })
    )
  });
}
function wd(e) {
  return de("/api/taggroups", { signal: e });
}
function wi(e, t, n = 1280) {
  return `/api/${Hn(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function vi(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Mo(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function vd(e) {
  return `/api/stream/video/${e}/preview`;
}
function Nd(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function qd(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Ja(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e) {
    await de(`/api/tags/${a}`, { signal: t }), n.add(a);
    for (let i = 1; ; i++) {
      const o = await de("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Mn({
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
async function Yi(e, t) {
  const n = wr(e);
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
function Sd(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function Xi(e, t) {
  const a = (await de("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!a)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = Sd(e, a);
  return i ? { kind: "incompatible", message: i } : a.entityTypes.includes(t) ? { kind: "ready", definition: a, message: "" } : {
    kind: "missing",
    message: `Add ${Sn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: a
  };
}
async function Ls(e, t) {
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
function Ds(e = "video") {
  return Xi(Fs, e);
}
function Ed(e = "video") {
  return Ls(Fs, e);
}
function _s(e = "video") {
  return Xi(Hi, e);
}
function kd(e = "video") {
  return Ls(Hi, e);
}
function _a(e) {
  return [...new Set(e)];
}
function js(e, t) {
  const n = e.customFields ?? {}, a = Object.keys(n).find(
    (o) => o.toLowerCase() === Va
  ), i = a === void 0 ? [] : n[a];
  return _a(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function Cd(e) {
  let t;
  try {
    t = await _s(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${Hi.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Ad(e, t, n, a, i, o) {
  await de(`/api/${Hn(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: _a(i).map((s) => `${a}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function Td(e, t, n) {
  const a = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${Qi} custom field is not available.`
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
async function Us(e, t, n) {
  if (!On(t) || n.length === 0 || n.some((u) => !Number.isSafeInteger(u) || u <= 0))
    throw new Error(
      `Choose ${Sn(e).many} and configure a valid action first.`
    );
  let a = null;
  if (Wn(t)) {
    let u;
    try {
      u = await Ds(e);
    } catch (f) {
      throw new Error(
        `Could not verify the ${Qi} custom field. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
    if (u.kind !== "ready") throw new Error(u.message);
    a = u.definition.key;
  }
  const i = _a(n), o = (await Yi(t)).map((u) => ({
    mode: u.mode,
    tagIds: _a(u.tagIds)
  })), c = [
    ...o.filter((u) => !Rn(u.mode)),
    ...o.filter((u) => Rn(u.mode))
  ].map(
    (u) => Td(u, i, a)
  );
  for (let u = 0; u < c.length; u++)
    try {
      await de(`/api/${Hn(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(c[u])
      });
    } catch (f) {
      throw new Error(
        `Step ${u + 1} failed; ${u} earlier step(s) completed. Refresh and check the selected ${Sn(e).many} before retrying. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
}
async function Id(e, t) {
  if (!On(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await de("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const Ia = (e) => e >= "0" && e <= "9";
function Fo(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function Po(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, a = 0;
  for (; n < e.length && a < t.length; ) {
    if (Ia(e[n]) && Ia(t[a])) {
      const c = n, u = a;
      for (; n < e.length && Ia(e[n]); ) n++;
      for (; a < t.length && Ia(t[a]); ) a++;
      const f = e.slice(c, n).replace(/^0+/, ""), d = t.slice(u, a).replace(/^0+/, "");
      if (f.length !== d.length) return f.length < d.length ? -1 : 1;
      if (f !== d) return f < d ? -1 : 1;
      continue;
    }
    const o = Fo(e[n]), s = Fo(t[a]);
    if (o !== s) return o < s ? -1 : 1;
    n++, a++;
  }
  const i = e.length - n - (t.length - a);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function Gs(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, a = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(a(e) - a(t)) || Po(e.tagGroupName, t.tagGroupName) || Po(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function pr(e) {
  return [...e].sort(Gs);
}
function Rd(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const a of n.steps)
        a.mode === "REMOVE_TREE" && a.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function Zi(e, t, n) {
  const a = wr(e), i = [], o = [];
  for (const g of e.steps) {
    if (g.mode !== "REMOVE_TREE") {
      o.push(g);
      continue;
    }
    const v = g.tagIds.flatMap((w) => {
      const q = n.get(w);
      return q || i.push(w), q ?? [w];
    });
    o.push({ mode: "REMOVE", tagIds: v.filter((w) => !a.has(w)) });
  }
  const s = [
    ...o.filter((g) => !Rn(g.mode)),
    ...o.filter((g) => Rn(g.mode))
  ], c = new Set(t.ids), u = new Set(t.absent);
  for (const g of s)
    for (const v of g.tagIds)
      switch (g.mode) {
        case "ADD":
          c.add(v);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          c.delete(v);
          break;
        case "MARK_PRESENT":
          c.add(v), u.delete(v);
          break;
        case "MARK_ABSENT":
          c.delete(v), u.add(v);
          break;
        case "CLEAR_ABSENCE":
          u.delete(v);
          break;
      }
  const f = new Set(t.ids), d = new Set(t.absent), m = [...new Set(e.steps.flatMap((g) => g.tagIds))];
  return {
    added: m.filter((g) => c.has(g) && !f.has(g)),
    removed: [...f].filter((g) => !c.has(g)),
    markedAbsent: m.filter((g) => u.has(g) && !d.has(g)),
    absenceCleared: [...d].filter((g) => !u.has(g)),
    unresolvedTrees: [...new Set(i)]
  };
}
function $d(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const a of e.applications)
      n.has(a.tag.id) || n.set(a.tag.id, a.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, a) => ({ id: n, name: e.names[a] ?? "" }));
  return pr(t);
}
function Ks(e) {
  return Bs(Rd(e));
}
function Bs(e) {
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, a] = C(() => /* @__PURE__ */ new Map()), i = O(/* @__PURE__ */ new Set()), o = O(!0);
  return H(() => (o.current = !0, () => {
    o.current = !1;
  }), []), H(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      i.current.has(c) || (i.current.add(c), Ja([c]).then(
        (u) => {
          o.current && a((f) => new Map(f).set(c, u));
        },
        () => {
          i.current.delete(c);
        }
      ));
  }, [t]), n;
}
function gr(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function _r(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, a) => {
    const i = gr(n.group);
    if (!i) return;
    const o = t.get(i);
    o ? o.actions.push(a) : t.set(i, { key: i, name: n.group.trim(), actions: [a] });
  }), [...t.values()];
}
function xo(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => gr(t.group) !== "");
}
function Vs(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function Js(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function zs(e) {
  return wr(e).size > 0 || Js(e).size > 0;
}
function Od(e) {
  return _r(e).filter(
    (t) => !t.actions.some((n) => zs(e[n]))
  );
}
function Ni(e, t) {
  const n = Vs(t), a = new Set(t.absent);
  return _r(e).map((i) => {
    const o = [], s = [];
    for (const c of i.actions) {
      const u = [...wr(e[c])], f = [...Js(e[c])], d = [
        ...u.map((m) => n.has(m)),
        ...f.map((m) => a.has(m))
      ];
      d.some(Boolean) && (s.push(c), d.every(Boolean) && o.push(c));
    }
    return { ...i, answers: o.length ? o : s };
  });
}
function qi(e) {
  return e.filter((t) => t.answers.length === 0);
}
function Md(e, t, n) {
  const a = { ids: [...Vs(t)], absent: t.absent }, i = Zi(e, a, n), o = new Set(i.removed), s = new Set(i.absenceCleared);
  return {
    ids: [...a.ids.filter((c) => !o.has(c)), ...i.added],
    absent: [...a.absent.filter((c) => !s.has(c)), ...i.markedAbsent]
  };
}
const Fr = "review";
function Fd(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function Pd(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function ur(e, t) {
  const n = new Set(Fd(e));
  return t.filter((a) => n.has(a.id));
}
function Lo(e, t, n) {
  const a = /* @__PURE__ */ new Map(), i = (s, c) => {
    const u = a.get(s) ?? c();
    return a.set(s, u), u;
  };
  for (const s of ur(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const u = c.categoryTagId === void 0 ? i(Fr, () => ({
        key: Fr,
        name: "",
        tagIds: null,
        flags: [],
        mixed: []
      })) : i(`tag:${c.categoryTagId}`, () => {
        const { name: f, tagIds: d, resolved: m } = n(c.categoryTagId);
        return {
          key: `tag:${c.categoryTagId}`,
          name: f,
          tagIds: d,
          flags: [],
          mixed: [],
          ...m ? {} : { unresolved: !0 }
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
function Ws(e) {
  return e.filter((t) => t.kind !== "other" && t.tags.length > 1).map((t) => ({
    key: t.key,
    name: t.name,
    tagIds: t.members,
    flags: [],
    mixed: t.tags
  }));
}
function Qs(...e) {
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
function xd(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e.steps)
    if (a.mode !== "CLEAR_ABSENCE")
      for (const i of a.tagIds)
        for (const o of a.mode === "REMOVE_TREE" ? t.get(i) ?? [i] : [i])
          n.add(o);
  return n;
}
function Hs(e, t, n) {
  if (t.tagIds === null) return !0;
  const a = xd(e, n);
  return t.tagIds.some((i) => a.has(i));
}
function Ld(e, t, n) {
  return t.filter(
    (a) => a.tagIds === null || a.unresolved && e.length > 0 || e.some((i) => Hs(i, a, n))
  );
}
function Dd(e, t, n) {
  return t.filter((a) => a.tagIds !== null && Hs(e, a, n));
}
function _d(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function eo(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [_d(e.mixed)] : []
  ];
}
function jd(e) {
  const t = eo(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function Ud(e, t, n) {
  const a = ur(e, t).map((i) => {
    const o = e.filter((c) => c.tagId === i.id);
    if (o.every((c) => c.categoryTagId === void 0)) return i.name;
    const s = o.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${i.name} (affects ${[...new Set(s)].join(", ")})`;
  });
  return a.length ? `Flagged: ${a.join(", ")}` : "";
}
const Si = "-", Do = "Ctrl+a", Gd = "Ctrl/⌘A", Kd = ["f", "g", "k"], ai = "Shift+";
function jr(e) {
  return ye(() => Ts(e), [e]);
}
function to({
  surface: e,
  enabled: t,
  actions: n,
  onAction: a,
  onFind: i,
  onSelectAll: o
}) {
  const s = jr(n), c = O({ keyMap: s, onAction: a, onFind: i, onSelectAll: o });
  Rt(() => {
    c.current = { keyMap: s, onAction: a, onFind: i, onSelectAll: o };
  });
  const u = !!i && n.length > 0, f = e === "local" && !!o, d = Jn.filter(
    (g) => s.actionOn.has(g) || e === "local" && Kd.includes(g)
  ).join(" "), m = ye(() => {
    const g = (q) => {
      var b, R;
      const S = c.current;
      if (q === Do) (b = S.onSelectAll) == null || b.call(S);
      else if (q === Si) (R = S.onFind) == null || R.call(S);
      else {
        const M = q.startsWith(ai), j = S.keyMap.actionOn.get(
          M ? q.slice(ai.length) : q
        );
        j !== void 0 && S.onAction(j, M);
      }
    }, v = (q, S = e) => ({
      keys: q,
      surface: S,
      action: (b) => {
        b != null && b.repeat || g((b == null ? void 0 : b.sequence) ?? q);
      }
    }), w = [];
    f && w.push(v(Do, "local")), u && w.push(v(Si));
    for (const q of d ? d.split(" ") : [])
      w.push(v(q), v(`${ai}${q}`));
    return w;
  }, [e, d, u, f]);
  ml(m, t);
}
const Bd = {
  find: Si,
  selectAll: Gd
};
function no() {
  return Bd;
}
const Vd = 600 * 1e3, ro = /* @__PURE__ */ new Map(), Ys = /* @__PURE__ */ new Map(), Bn = /* @__PURE__ */ new Map();
function Xs(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = Ys.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function Zs(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && Ys.set(e.tagGroupId, e.tagGroupSortOrder), ro.set(e.id, { tag: e, at: Date.now() });
}
function ec(e) {
  const t = ro.get(e);
  if (!(!t || Date.now() - t.at > Vd))
    return Xs(t.tag);
}
function tc(e) {
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
    Number.isSafeInteger(n.id) && a && Zs(tc({ ...n, name: a }));
  }
}
function Jd(e) {
  const t = Bn.get(e);
  if (t) return t;
  const n = new AbortController(), a = {
    controller: n,
    waiters: 0,
    promise: de(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var d, m;
        const o = ((d = i == null ? void 0 : i.name) == null ? void 0 : d.trim()) || null;
        if (Bn.get(e) === a && Bn.delete(e), !o) return null;
        const s = tc({ ...i, id: e, name: o }), c = (m = ro.get(e)) == null ? void 0 : m.tag, u = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (u ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return Zs(f), Xs(f);
      },
      () => (Bn.get(e) === a && Bn.delete(e), null)
    )
  };
  return Bn.set(e, a), a;
}
function _o() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function ii(e) {
  const t = {};
  for (const n of e) {
    const a = ec(n);
    a !== void 0 && (t[n] = a);
  }
  return t;
}
function zd(e, t) {
  if (t != null && t.aborted) return Promise.reject(_o());
  const n = {}, a = [];
  for (const i of new Set(e)) {
    const o = ec(i);
    if (o !== void 0) n[i] = o;
    else {
      const s = Jd(i);
      s.waiters += 1, a.push({ id: i, entry: s });
    }
  }
  return a.length ? new Promise((i, o) => {
    let s = !1;
    const c = () => {
      for (const { id: f, entry: d } of a)
        d.waiters -= 1, d.waiters === 0 && Bn.get(f) === d && (Bn.delete(f), d.controller.abort());
    }, u = () => {
      s || (s = !0, c(), o(_o()));
    };
    t == null || t.addEventListener("abort", u, { once: !0 }), Promise.all(
      a.map(
        ({ id: f, entry: d }) => d.promise.then((m) => [f, m])
      )
    ).then((f) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", u), c();
        for (const [d, m] of f) n[d] = m;
        i(n);
      }
    });
  }) : Promise.resolve(n);
}
function nc(e) {
  const t = {};
  for (const [n, a] of Object.entries(e)) t[Number(n)] = (a == null ? void 0 : a.name) ?? null;
  return t;
}
function ha(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, a] = C(() => ({
    key: t,
    tags: ii(oi(t))
  }));
  return H(() => {
    const i = oi(t), o = ii(i);
    if (a({ key: t, tags: o }), i.every((c) => c in o)) return;
    const s = new AbortController();
    return zd(i, s.signal).then(
      (c) => a({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : ii(oi(t));
}
function Ur(e) {
  const t = ha(e);
  return ye(() => nc(t), [t]);
}
function oi(e) {
  return e ? e.split(",").map(Number) : [];
}
const Wd = "(max-width: 760px)";
function rc(e) {
  const [t] = C(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = Nn(
    (a) => (t == null || t.addEventListener("change", a), () => t == null ? void 0 : t.removeEventListener("change", a)),
    [t]
  );
  return Fi(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function pa() {
  return rc(Wd);
}
function Qd(e, t, n = !1) {
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
  const i = wr(e), o = (s) => i.has(s) || [...i].some((c) => {
    var u;
    return (u = a == null ? void 0 : a.get(s)) == null ? void 0 : u.includes(c);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (c) => Qd(
        s.mode,
        t[c] === void 0 ? "…" : t[c] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && o(c)
      )
    )
  );
}
function za(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function ao({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  canStay: i = !0,
  tapStays: o = !1,
  onApply: s,
  onClose: c
}) {
  const u = pa(), [f, d] = C(""), [m, g] = C(0), v = O(null), w = O(null), q = O(null), S = O(null), b = O(null), R = O(/* @__PURE__ */ new Set()), M = ut(), j = Ur(ye(() => za(e), [e])), G = jr(e), D = ye(() => {
    const _ = f.trim().toLocaleLowerCase(), U = (N) => N ? Jn.indexOf(N) : Jn.length;
    return e.map((N, A) => ({ action: N, index: A, key: G.keys[A] })).sort((N, A) => U(N.key) - U(A.key)).filter((N) => !_ || N.action.label.toLocaleLowerCase().includes(_));
  }, [e, G, f]), Z = D.length ? Math.min(m, D.length - 1) : -1, ne = (_) => `${M}-option-${_}`;
  Rt(() => {
    var _, U, N;
    return S.current = document.activeElement, b.current = ((U = (_ = q.current) == null ? void 0 : _.parentElement) == null ? void 0 : U.closest('[role="dialog"]')) ?? null, (N = v.current) == null || N.focus({ preventScroll: !0 }), () => {
      var V;
      const A = S.current;
      A instanceof HTMLElement && A.isConnected && A.focus({ preventScroll: !0 }), document.activeElement !== A && ((V = b.current) != null && V.isConnected) && b.current.focus({ preventScroll: !0 });
    };
  }, []), H(() => {
    var _, U, N;
    Z < 0 || (N = (U = (_ = w.current) == null ? void 0 : _.querySelector(`[id="${ne(D[Z].index)}"]`)) == null ? void 0 : U.scrollIntoView) == null || N.call(U, { block: "nearest" });
  }, [Z, D]);
  function oe(_, U) {
    !_ || a != null && a(_.action) || s(_.action, i && U);
  }
  function se(_) {
    var N;
    _.stopPropagation();
    const U = _.code || _.key;
    if (_.repeat && !R.current.has(U)) {
      _.preventDefault();
      return;
    }
    if (_.repeat || R.current.add(U), _.key === "Escape")
      _.preventDefault(), c();
    else if (_.key === "Enter")
      _.preventDefault(), _.repeat || oe(D[Z], _.shiftKey);
    else if (_.key === "ArrowDown" || _.key === "ArrowUp") {
      if (_.preventDefault(), !D.length) return;
      const A = _.key === "ArrowDown" ? 1 : -1;
      g((Z + A + D.length) % D.length);
    } else _.key === "Tab" && (_.preventDefault(), (N = v.current) == null || N.focus());
  }
  return /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ r("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: c }),
    /* @__PURE__ */ l(
      "div",
      {
        ref: q,
        role: "dialog",
        "aria-label": "Find an action",
        className: `dq-find-action${u ? " dq-find-mobile" : ""}`,
        onKeyDown: se,
        onMouseDown: (_) => {
          _.target !== v.current && _.preventDefault();
        },
        children: [
          /* @__PURE__ */ l("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ r(ca, { "aria-hidden": "true" }),
            /* @__PURE__ */ r(
              "input",
              {
                ref: v,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${M}-list`,
                "aria-activedescendant": Z >= 0 ? ne(D[Z].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: f,
                onChange: (_) => {
                  d(_.target.value), g(0);
                }
              }
            ),
            !u && /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          D.length ? /* @__PURE__ */ r(
            "ul",
            {
              ref: w,
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
                  onClick: (N) => oe(_, N.shiftKey || o && pi(_.action)),
                  children: [
                    u ? null : _.key ? /* @__PURE__ */ r("kbd", { children: _.key }) : /* @__PURE__ */ r("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ r("span", { className: "dq-find-label", children: _.action.label }),
                    /* @__PURE__ */ r("span", { className: "dq-find-effect", children: vr(_.action, j, t, n).map(
                      (N, A) => /* @__PURE__ */ r("span", { "data-effect-tone": N.tone, children: N.text }, A)
                    ) })
                  ]
                }
              ) }, _.action.id))
            }
          ) : /* @__PURE__ */ l("p", { className: "dq-find-empty", role: "status", children: [
            "No action matches “",
            f.trim(),
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
function ac() {
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
function io(e) {
  return Fi(e.subscribe, e.get, e.get);
}
function ic(e, t) {
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
const Hd = [], jo = ia.map((e, t) => ({
  indent: t,
  keys: e,
  fixed: t === 2 ? ["n", "m", ",", "."] : []
}));
function Yd(e, t) {
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
function Ra(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function sc(e) {
  return ia.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function cc({
  groups: e,
  renderAction: t,
  find: n
}) {
  const a = e.length ? e : [[]];
  return /* @__PURE__ */ r(me, { children: a.map((i, o) => /* @__PURE__ */ l("div", { className: "dq-mobile-group", children: [
    i.map(t),
    o === a.length - 1 && n
  ] }, o)) });
}
function lc({
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
function Xd({
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
        const o = t ? i.answers : null, s = o ? o.length ? "answered" : "open" : "unknown", c = o == null ? void 0 : o.map((d) => n[d].label).join(", "), u = a(i), f = s === "answered" ? `${i.name}: ${c}` : s === "open" ? `${i.name}: not answered yet` : i.name;
        return /* @__PURE__ */ l(
          "li",
          {
            className: "dq-group",
            "data-state": s,
            "data-attention": u ? !0 : void 0,
            title: u ? `${f}. Needs attention: ${u}` : f,
            children: [
              /* @__PURE__ */ r("span", { className: "dq-group-name", children: i.name }),
              u && /* @__PURE__ */ l("span", { className: "dq-group-flag", children: [
                /* @__PURE__ */ r($n, { "aria-hidden": "true" }),
                /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  u
                ] })
              ] }),
              s === "answered" && /* @__PURE__ */ l(me, { children: [
                /* @__PURE__ */ r(Ka, { "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", answered:" }),
                " ",
                /* @__PURE__ */ r("span", { className: "dq-group-answer", children: c })
              ] }),
              s === "open" && /* @__PURE__ */ l(me, { children: [
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
function Zd({ checked: e, onChange: t }) {
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
function eu({
  actions: e,
  mediaKind: t,
  isDisabled: n,
  busy: a,
  tags: i,
  trees: o,
  preview: s,
  onApply: c,
  onFind: u,
  findDisabled: f,
  paused: d = !1,
  waitForGroups: m = !1,
  attention: g = Hd,
  stayOnTap: v = !1,
  onStayOnTapChange: w
}) {
  const q = no(), S = jr(e), b = pa();
  ic(s, b);
  const R = ut(), M = Ur(
    ye(() => e.flatMap((Q) => Q.steps.flatMap((z) => z.tagIds)), [e])
  ), j = jo.filter((Q) => Q.keys.some((z) => S.actionOn.has(z))), G = j.includes(jo[2]), D = e.length - S.actionOn.size, Z = ye(
    () => m && !d ? _r(e) : [],
    [m, d, e]
  ), ne = ye(
    () => Z.length && i ? Ni(e, i) : null,
    [Z, e, i]
  ), oe = new Map(
    qi(ne ?? []).flatMap(
      (Q) => Q.actions.filter((z) => zs(e[z])).map((z) => [z, Q.name])
    )
  ), se = ye(
    () => e.map((Q) => d ? [] : Dd(Q, g, o)),
    [e, g, o, d]
  ), _ = (Q) => Q.map(jd).join("; "), U = se.map(_), N = Z.length > 0 && /* @__PURE__ */ r(
    Xd,
    {
      groups: Z,
      statuses: ne,
      actions: e,
      attentionOf: (Q) => _([
        ...new Map(
          Q.actions.flatMap((z) => se[z]).map((z) => [z.key, z])
        ).values()
      ])
    }
  ), A = (Q) => {
    const z = vr(e[Q], M, [], o).map((fe) => fe.text).join(", "), te = oe.get(Q), P = U[Q];
    return [
      z,
      te === void 0 ? "" : `${te}: not answered yet`,
      P ? `Needs attention: ${P}` : ""
    ].filter(Boolean).join(". ");
  }, V = (Q) => U[Q] ? (
    // The tile's description says it; the mark is for the eye, with the reasons on hover.
    /* @__PURE__ */ r(
      "span",
      {
        className: "dq-pad-flag",
        "aria-hidden": "true",
        title: `Needs attention: ${U[Q]}`,
        children: /* @__PURE__ */ r($n, {})
      }
    )
  ) : null, J = (Q) => ({
    onMouseEnter: () => s.set(Q),
    onMouseLeave: () => s.clear(Q),
    onFocus: () => s.set(Q),
    onBlur: (z) => {
      z.currentTarget.contains(z.relatedTarget) || s.clear(Q);
    }
  }), ue = (Q) => {
    const z = S.actionOn.get(Q), te = z === void 0 ? void 0 : e[z];
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
    const P = n(te), fe = `${R}-effect-${Q}`;
    return /* @__PURE__ */ l("div", { className: "dq-pad-slot", ...d ? {} : J(te), children: [
      /* @__PURE__ */ r("span", { id: fe, className: "dq-sr-only", children: A(z) }),
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: te.label,
          "aria-keyshortcuts": Q,
          "aria-describedby": fe,
          "data-group-open": oe.has(z) || void 0,
          "data-attention": U[z] ? !0 : void 0,
          disabled: P,
          onClick: (Oe) => c(te, Oe.shiftKey),
          children: [
            /* @__PURE__ */ r(ct, { binding: Q }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-pad-label", children: te.label }),
            Ra(te) && " ",
            Ra(te) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
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
          disabled: P,
          onClick: () => c(te, !0),
          children: /* @__PURE__ */ r(Di, { "aria-hidden": "true" })
        }
      )
    ] }, Q);
  }, ce = /* @__PURE__ */ l("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ r(Lr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (b) {
    const Q = sc(S), z = (te) => {
      const P = e[te], fe = S.keys[te];
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: P.label,
          "aria-keyshortcuts": fe,
          "aria-describedby": `${R}-effect-${fe}`,
          "data-group-open": oe.has(te) || void 0,
          "data-attention": U[te] ? !0 : void 0,
          disabled: n(P),
          onClick: (Oe) => {
            s.clear(P), c(P, Oe.shiftKey || v && pi(P));
          },
          ...d ? {} : oc(s, P),
          children: [
            /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: P.label }),
            Ra(P) && " ",
            Ra(P) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
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
        className: `dq-pad dq-pad-mobile${d ? " dq-pad-paused" : ""}`,
        "aria-label": d ? "Actions, paused while editing" : "Actions",
        "aria-busy": a || void 0,
        children: [
          /* @__PURE__ */ l("div", { className: "dq-pad-header", children: [
            d ? ce : /* @__PURE__ */ r(
              Uo,
              {
                actions: e,
                keyMap: S,
                names: M,
                tags: i,
                trees: o,
                preview: s,
                findKey: q.find,
                mobile: !0
              }
            ),
            w && /* @__PURE__ */ r(Zd, { checked: v, onChange: w })
          ] }),
          N,
          /* @__PURE__ */ r("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ r(
            cc,
            {
              groups: Q,
              renderAction: z,
              find: /* @__PURE__ */ r(
                lc,
                {
                  extra: D,
                  findKey: q.find,
                  disabled: f,
                  onFind: u
                }
              )
            }
          ) }),
          /* @__PURE__ */ r("div", { hidden: !0, children: Q.flat().map((te) => /* @__PURE__ */ r("span", { id: `${R}-effect-${S.keys[te]}`, children: A(te) }, te)) })
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
      "aria-keyshortcuts": q.find,
      disabled: f,
      onClick: u,
      children: [
        /* @__PURE__ */ r(ct, { binding: q.find }),
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
        /* @__PURE__ */ l("div", { className: `dq-pad-header${N ? " dq-pad-header-groups" : ""}`, children: [
          d ? ce : /* @__PURE__ */ r(
            Uo,
            {
              actions: e,
              keyMap: S,
              names: M,
              tags: i,
              trees: o,
              preview: s,
              findKey: q.find
            }
          ),
          N ? (
            // The checklist, then the hint and Find action, on the header's second line, under the
            // effect line: the pad keeps its height as answers of any length come in.
            /* @__PURE__ */ l("div", { className: "dq-pad-header-end", children: [
              N,
              B,
              T
            ] })
          ) : /* @__PURE__ */ l(me, { children: [
            !d && B,
            T
          ] })
        ] }),
        j.map((Q) => /* @__PURE__ */ l("div", { className: "dq-pad-row", "data-indent": Q.indent, children: [
          Q.keys.map(ue),
          Q.fixed.map((z) => {
            const te = Yd(z, t);
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
              "aria-keyshortcuts": q.find,
              disabled: f,
              onClick: u,
              children: [
                /* @__PURE__ */ r(ct, { binding: q.find }),
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
function Uo({
  actions: e,
  keyMap: t,
  names: n,
  tags: a,
  trees: i,
  preview: o,
  findKey: s,
  mobile: c = !1
}) {
  const u = io(o), f = u ? e.indexOf(u) : -1;
  if (!u || f < 0) {
    const v = t.actionOn.size;
    return /* @__PURE__ */ l("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && v < e.length && /* @__PURE__ */ l(me, { children: [
        ` · ${v} on keys, ${e.length - v} more under `,
        /* @__PURE__ */ r(ct, { binding: s })
      ] })
    ] });
  }
  const d = t.keys[f], m = a && u.steps.length ? Zi(u, a, i) : null, g = m && !m.unresolvedTrees.length && ![m.added, m.removed, m.markedAbsent, m.absenceCleared].some(
    (v) => v.length
  );
  return /* @__PURE__ */ l("p", { className: "dq-pad-effect", children: [
    d && !c && /* @__PURE__ */ r(ct, { binding: d }),
    /* @__PURE__ */ r("strong", { children: u.label }),
    vr(u, n, [], i).map((v, w) => /* @__PURE__ */ r("span", { "data-effect-tone": v.tone, children: v.text }, w)),
    g && /* @__PURE__ */ r("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function dc({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  busy: i,
  onApply: o,
  onFind: s,
  summary: c,
  hints: u,
  keyHints: f,
  notices: d,
  status: m,
  className: g = "",
  paused: v = !1
}) {
  const w = no(), q = jr(e), S = pa(), b = ut(), R = Ur(ye(() => za(e), [e])), [M] = C(() => ac());
  ic(M, S);
  const j = O(null), G = tu(j, e, !S), D = sc(q);
  !D.length && e.length && D.push([]);
  const Z = D.flat(), ne = e.length - Z.length, oe = (N) => vr(N, R, t, n).map((A) => A.text).join(", "), se = (N) => ({
    onMouseEnter: () => M.set(N),
    onMouseLeave: () => M.clear(N),
    onFocus: () => M.set(N),
    onBlur: (A) => {
      A.currentTarget.contains(A.relatedTarget) || M.clear(N);
    }
  }), _ = u ?? (S ? void 0 : f), U = (N) => {
    const A = e[N];
    return /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-mobile-tile",
        title: A.label,
        "aria-keyshortcuts": q.keys[N] || void 0,
        "aria-describedby": `${b}-effect-${N}`,
        disabled: v || a(A),
        onClick: () => {
          M.clear(A), o(A);
        },
        ...v ? {} : oc(M, A),
        children: /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: A.label })
      },
      A.id
    );
  };
  return /* @__PURE__ */ l(
    "section",
    {
      ref: j,
      className: `dq-action-bar${S ? " dq-bar-mobile" : G ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${v ? " dq-bar-paused" : ""}${g ? ` ${g}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ r("div", { className: "dq-bar-summary", children: c }),
        /* @__PURE__ */ r("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ l(
          "div",
          {
            className: `dq-bar-tiles${S ? " dq-mobile-actions" : ""}`,
            "aria-busy": i || void 0,
            children: [
              S && e.length > 0 && /* @__PURE__ */ r(
                cc,
                {
                  groups: D,
                  renderAction: U,
                  find: /* @__PURE__ */ r(
                    lc,
                    {
                      extra: ne,
                      findKey: w.find,
                      disabled: v,
                      onFind: s
                    }
                  )
                }
              ),
              !S && D.map((N, A) => /* @__PURE__ */ l("div", { className: "dq-bar-line", children: [
                N.map((V) => {
                  const J = e[V], ue = q.keys[V];
                  return /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: J.label,
                      "aria-keyshortcuts": ue || void 0,
                      "aria-describedby": `${b}-effect-${V}`,
                      disabled: v || a(J),
                      onClick: () => o(J),
                      ...v ? {} : se(J),
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
                    "aria-keyshortcuts": w.find,
                    disabled: v,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ r(ct, { binding: w.find, hidden: !0 }),
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
        v ? /* @__PURE__ */ l("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ r(Lr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ r(
          nu,
          {
            actions: e,
            keyMap: q,
            preview: M,
            names: R,
            tagGroups: t,
            trees: n,
            showKey: !S
          }
        ),
        d && /* @__PURE__ */ r("div", { className: "dq-bar-notices", children: d }),
        /* @__PURE__ */ r("div", { hidden: !0, children: Z.map((N) => /* @__PURE__ */ r("span", { id: `${b}-effect-${N}`, children: oe(e[N]) }, e[N].id)) }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: m })
      ]
    }
  );
}
function tu(e, t, n) {
  const [a, i] = C(!1);
  return Rt(() => {
    var d;
    const o = e.current;
    if (!o || !n || typeof ResizeObserver > "u") return;
    const s = o.querySelector(".dq-bar-summary"), c = () => {
      const m = getComputedStyle(o), g = parseFloat(m.columnGap) || 0, v = o.clientWidth - (parseFloat(m.paddingLeft) || 0) - (parseFloat(m.paddingRight) || 0), w = [...o.querySelectorAll(".dq-bar-line")].map(
        (Z) => [...Z.children].map((ne) => ne.offsetWidth)
      ), q = o.querySelector(".dq-bar-line"), S = q && parseFloat(getComputedStyle(q).columnGap) || 0, b = o.querySelector(".dq-bar-hints"), R = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (b ? b.offsetWidth + g : 0) + 1 + // the divider
      2 * g, M = (Z) => w.map((ne) => {
        let oe = 1, se = 0;
        for (const _ of ne)
          se > 0 && se + S + _ > Z ? (oe += 1, se = _) : se += (se > 0 ? S : 0) + _;
        return oe;
      }), j = (Z) => Math.max(1, Z.reduce((ne, oe) => ne + oe, 0)), G = M(v), D = j(M(v - R));
      i(
        1 + j(G) < D || 1 + j(G) === D && G.every((Z) => Z === 1)
      );
    }, u = new ResizeObserver(c);
    u.observe(o);
    for (const m of o.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      u.observe(m);
    c();
    let f = !0;
    return (d = document.fonts) == null || d.ready.then(() => {
      f && c();
    }), () => {
      f = !1, u.disconnect();
    };
  }, [e, t, n]), a;
}
function nu({
  actions: e,
  keyMap: t,
  preview: n,
  names: a,
  tagGroups: i,
  trees: o,
  showKey: s
}) {
  const c = io(n), u = c ? e.indexOf(c) : -1;
  if (!c || u < 0) return null;
  const f = t.keys[u];
  return /* @__PURE__ */ l("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    f && s && /* @__PURE__ */ r(ct, { binding: f }),
    /* @__PURE__ */ r("strong", { children: c.label }),
    vr(c, a, i, o).map((d, m) => /* @__PURE__ */ r("span", { "data-effect-tone": d.tone, children: d.text }, m))
  ] });
}
const Go = 1e3;
async function ru(e, t, n) {
  const a = await de(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
  for (let u = 1; ; u++) {
    const f = await de(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          Mn({
            findFilter: {
              page: u,
              perPage: Go,
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
    for (const d of f.items) i.set(d.id, d);
    if (u * Go >= f.totalCount) break;
    if (!f.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], s = je(e), c = Re(e) ? await iu(
    s,
    o.map((u) => u.id),
    n
  ) : o.map((u) => (s === "audio" ? u.audioCount : u.videoCount) ?? 0);
  return {
    parent: { id: t, name: a.name },
    children: o.map((u, f) => ({ id: u.id, name: u.name, uses: c[f] })).sort(
      (u, f) => f.uses - u.uses || u.name.localeCompare(f.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function au(e) {
  return JSON.stringify(
    Mn({
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
async function iu(e, t, n) {
  const a = new Array(t.length).fill(0), i = new AbortController(), o = () => i.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && o(), n == null || n.addEventListener("abort", o, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !i.signal.aborted; ) {
            const c = s++;
            a[c] = (await de(
              `/api/${Hn(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: au(t[c])
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
function ou(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((a) => t.has(a.id) ? !1 : (t.add(a.id), !0))
  }));
}
function su(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of n.children)
      t.set(a.id, [...t.get(a.id) ?? [], n.parent.id]);
  return t;
}
function cu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of wr(n))
      t.set(a, [...t.get(a) ?? [], n]);
  return t;
}
function lu(e, t, n) {
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
function du(e, t) {
  var a;
  const n = gr(e);
  return ((a = _r(t).find((i) => i.key === n)) == null ? void 0 : a.name) ?? e.trim();
}
const uu = (e) => e instanceof Error ? e.message : "Request failed.";
function fu({
  id: e,
  review: t,
  disabled: n,
  onAdd: a,
  onCancel: i
}) {
  const [o, s] = C([]), [c, u] = C({}), [f, d] = C({}), [m, g] = C({}), v = O(/* @__PURE__ */ new Map());
  H(
    () => () => {
      for (const N of v.current.values()) N.abort();
    },
    []
  );
  const w = Sn(je(t)), q = Re(t), S = q ? "performer" : w.one;
  function b(N) {
    var V;
    (V = v.current.get(N)) == null || V.abort();
    const A = new AbortController();
    v.current.set(N, A), u((J) => ({ ...J, [N]: { status: "loading" } })), ru(t, N, A.signal).then(
      (J) => {
        A.signal.aborted || u((ue) => ({
          ...ue,
          [N]: { status: "ready", group: J }
        }));
      },
      (J) => {
        A.signal.aborted || u((ue) => ({
          ...ue,
          [N]: { status: "failed", message: uu(J) }
        }));
      }
    );
  }
  function R(N) {
    var ce;
    const A = o.filter((B) => !N.includes(B));
    for (const B of A)
      (ce = v.current.get(B)) == null || ce.abort(), v.current.delete(B);
    const V = (B) => {
      const T = c[B];
      return (T == null ? void 0 : T.status) === "ready" ? T.group.children.map((Q) => Q.id) : [];
    }, J = new Set(N.flatMap(V)), ue = A.flatMap(V).filter((B) => !J.has(B));
    d(
      (B) => Object.fromEntries(
        Object.entries(B).filter(([T]) => !ue.includes(Number(T)))
      )
    ), g(
      (B) => Object.fromEntries(
        Object.entries(B).filter(([T]) => N.includes(Number(T)))
      )
    ), u(
      (B) => Object.fromEntries(
        Object.entries(B).filter(([T]) => N.includes(Number(T)))
      )
    ), s(N);
    for (const B of N) o.includes(B) || b(B);
  }
  const M = o.flatMap((N) => {
    const A = c[N];
    return (A == null ? void 0 : A.status) === "ready" ? [A.group] : [];
  }), j = M.length === o.length, G = o.some(
    (N) => {
      var A;
      return (((A = c[N]) == null ? void 0 : A.status) ?? "loading") === "loading";
    }
  ), D = new Map(
    ou(M).map((N) => [N.parent.id, N])
  ), Z = su(M), ne = new Map(M.map((N) => [N.parent.id, N.parent.name])), oe = cu(t.actions), se = (N) => f[N] ?? !oe.has(N), _ = j ? [...D.values()].flatMap((N) => {
    const A = du(N.parent.name, t.actions);
    return N.children.filter((V) => se(V.id)).map((V) => ({ child: V, answerGroup: A }));
  }) : [], U = (N, A) => d((V) => ({
    ...V,
    ...Object.fromEntries(N.children.map((J) => [J.id, A]))
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
    o.map((N) => {
      const A = c[N];
      if (!A || A.status === "loading")
        return /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Loading child tags…" }, N);
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
              onClick: () => b(N),
              children: "Retry"
            }
          )
        ] }, N);
      const V = D.get(N);
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
                checked: m[N] ?? !1,
                disabled: n,
                onChange: (ue) => g((ce) => ({
                  ...ce,
                  [N]: ue.target.checked
                }))
              }
            ),
            "Only one per ",
            S,
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
              const ce = oe.get(ue.id) ?? [], B = (Z.get(ue.id) ?? []).filter((T) => T !== N).map((T) => `“${ne.get(T)}”`);
              return /* @__PURE__ */ l("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: se(ue.id),
                    disabled: n,
                    onChange: (T) => d((Q) => ({
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
                    ue.uses === 1 ? w.one : w.many
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
      ] }, N);
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
              ({ child: N, answerGroup: A }) => lu(
                N,
                (Z.get(N.id) ?? []).filter(
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
const hu = ["n", "m"], Kn = [
  ...ia,
  ["auto", zn]
];
function ja(e) {
  return e.toLocaleUpperCase();
}
function uc(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : Ji(e[n]);
}
function pu({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i
}) {
  const [o, s] = C(!1), c = O(null), u = n.keys[t], f = uc(e, n, t), d = hr(f), m = n.duplicatePins.has(t) ? ` (${ja(e[t].shortcut ?? "")} is pinned twice)` : "", g = u ? `${ja(u)}, ${d ? "pinned" : "Auto"}${m}` : f === zn ? "no key, Find action only" : `no key: Auto found no free key${m}`, v = () => {
    var w;
    s(!1), (w = c.current) == null || w.focus();
  };
  return /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        ref: c,
        type: "button",
        className: "dq-key-button",
        "aria-label": `Key for ${a}: ${g}`,
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        title: "Choose the key",
        onClick: () => s(!o),
        children: [
          u ? /* @__PURE__ */ r(ct, { binding: u }) : /* @__PURE__ */ r("span", { className: "dq-key dq-key-none", children: "·" }),
          d && /* @__PURE__ */ r(Di, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ r(
      mu,
      {
        actions: e,
        index: t,
        keyMap: n,
        name: a,
        onChoose: (w) => {
          i(w), v();
        },
        onClose: v
      }
    )
  ] });
}
function mu({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i,
  onClose: o
}) {
  const s = O(null), c = n.keys[t], u = uc(e, n, t), [f, d] = C(c || "q"), m = (q) => {
    var S;
    return ((S = s.current) == null ? void 0 : S.querySelector(`[data-choice="${q}"]`)) ?? null;
  };
  Rt(() => {
    var q, S, b;
    (q = m(c || u)) == null || q.focus(), (b = (S = s.current) == null ? void 0 : S.scrollIntoView) == null || b.call(S, { block: "nearest" });
  }, []);
  function g(q) {
    var S;
    hr(q) && d(q), (S = m(q)) == null || S.focus();
  }
  function v(q) {
    var D, Z, ne;
    if (q.key === "Escape") {
      q.preventDefault(), q.stopPropagation(), o();
      return;
    }
    if (q.key === "Tab") {
      const oe = [...((D = s.current) == null ? void 0 : D.querySelectorAll("button[tabindex='0']")) ?? []], se = oe.indexOf(document.activeElement);
      q.preventDefault(), (Z = oe[(se + (q.shiftKey ? -1 : 1) + oe.length) % oe.length]) == null || Z.focus();
      return;
    }
    const S = (ne = q.target.dataset) == null ? void 0 : ne.choice, b = S ? Kn.findIndex((oe) => oe.includes(S)) : -1;
    if (!S || b < 0) return;
    const R = Kn[b].indexOf(S), M = (oe) => oe == null ? void 0 : oe[Math.min(R, oe.length - 1)], j = {
      ArrowLeft: Kn[b][R - 1],
      ArrowRight: Kn[b][R + 1],
      ArrowUp: M(Kn[b - 1]),
      ArrowDown: M(Kn[b + 1]),
      Home: Kn[b][0],
      End: Kn[b].at(-1)
    };
    if (!Object.hasOwn(j, q.key)) return;
    q.preventDefault();
    const G = j[q.key];
    G && g(G);
  }
  const w = (q) => {
    const S = hr(q) ? n.actionOn.get(q) : void 0;
    return S === void 0 ? null : {
      own: S === t,
      label: e[S].label.trim() || "New action",
      pinned: Ji(e[S]) === q
    };
  };
  return /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ r(
      "div",
      {
        className: "dq-key-picker-backdrop",
        "aria-hidden": "true",
        onMouseDown: (q) => {
          q.preventDefault(), o();
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
        onKeyDown: v,
        onMouseDown: (q) => q.preventDefault(),
        children: [
          /* @__PURE__ */ l("p", { className: "dq-key-picker-title", children: [
            "Key for ",
            /* @__PURE__ */ r("strong", { children: a })
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: ia.map((q, S) => /* @__PURE__ */ l("div", { className: "dq-key-picker-row", "data-indent": S, children: [
            q.map((b) => {
              const R = w(b), M = R ? `${R.own ? "this action" : R.label}, ${R.pinned ? "pinned" : "Auto"}` : "free";
              return /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  className: `dq-key-choice${R ? "" : " dq-key-choice-free"}${R != null && R.own ? " dq-key-choice-own" : ""}`,
                  "data-choice": b,
                  tabIndex: b === f ? 0 : -1,
                  "aria-label": `${ja(b)}: ${M}`,
                  "aria-pressed": !!(R != null && R.own && R.pinned),
                  title: R ? `${R.label} (${R.pinned ? "pinned" : "Auto"})` : void 0,
                  onFocus: () => d(b),
                  onClick: () => i(b),
                  children: [
                    /* @__PURE__ */ l("span", { className: "dq-key-choice-head", children: [
                      /* @__PURE__ */ r(ct, { binding: b }),
                      (R == null ? void 0 : R.pinned) && /* @__PURE__ */ r(Di, { "aria-hidden": "true" })
                    ] }),
                    R && /* @__PURE__ */ r("span", { className: "dq-key-choice-label", children: R.label })
                  ]
                },
                b
              );
            }),
            S === ia.length - 1 && hu.map((b) => (
              // Unavailable, yet not disabled: a browser gives a disabled button no press for
              // the panel to keep, and moves focus out of the picker. This one chooses nothing
              // and is never focused (the arrow keys and Tab pass it by).
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-key-choice dq-key-choice-free",
                  "aria-label": `${ja(b)}: not available, it steps through the grid preview`,
                  title: "Steps through the grid preview",
                  "aria-disabled": "true",
                  tabIndex: -1,
                  children: /* @__PURE__ */ r("span", { className: "dq-key-choice-head", children: /* @__PURE__ */ r(ct, { binding: b }) })
                },
                b
              )
            ))
          ] }, S)) }),
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
                "data-choice": zn,
                tabIndex: 0,
                "aria-pressed": u === zn,
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
const gu = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function bu(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function yu(e, t) {
  if (On(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (zi(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function fc(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function wu(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function vu({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: a,
  saving: i,
  expandedId: o,
  onExpand: s,
  reveal: c
}) {
  const u = _e(e), f = u !== "tag", d = e.actions, m = jr(d), g = Ur(ye(() => za(d), [d])), v = ye(
    () => f ? _r(d).map((P) => P.name) : [],
    [f, d]
  ), w = f && e.stayUntilGroupsAnswered === !0, q = ye(
    () => new Set(
      w ? Od(d).map((P) => P.key) : []
    ),
    [w, d]
  ), [S, b] = C(""), [R, M] = C(!1), [j, G] = C(
    null
  ), D = ut(), Z = `${D}-from-tags`, ne = O(null), oe = O(null), se = O(null), _ = O(null), U = O(/* @__PURE__ */ new WeakMap()), N = (P) => {
    let fe = U.current.get(P);
    return fe || (fe = crypto.randomUUID(), U.current.set(P, fe)), fe;
  }, A = S.trim().toLocaleLowerCase(), V = A ? d.filter((P) => P.label.toLocaleLowerCase().includes(A)) : d, J = (P) => t({ ...e, actions: P }), ue = (P, fe) => J(d.map((Oe, Ee) => Ee === P ? fe : Oe));
  function ce(P) {
    var fe;
    return [...((fe = se.current) == null ? void 0 : fe.querySelectorAll("[data-action-id]")) ?? []].find(
      (Oe) => Oe.dataset.actionId === P
    );
  }
  function B(P, fe) {
    const Oe = ce(P), Ee = Oe == null ? void 0 : Oe.querySelector(
      fe === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return Ee == null || Ee.focus(), !!Ee;
  }
  Rt(() => {
    var fe;
    const P = _.current;
    P && (_.current = null, (P === "add" || !B(P.id, P.part)) && ((fe = oe.current) == null || fe.focus()));
  }), H(() => {
    !c || !o || (V.some((P) => P.id === o) ? B(o, "label") : (b(""), _.current = { id: o, part: "label" }));
  }, [c]);
  function T() {
    const P = wu(u);
    b(""), J([...d, P]), s(P.id), _.current = { id: P.id, part: "label" };
  }
  function Q(P) {
    const fe = d[P], { shortcut: Oe, ...Ee } = structuredClone(fe), Ye = {
      ...Ee,
      ...Oe === zn ? { shortcut: Oe } : {},
      id: crypto.randomUUID(),
      label: `${fe.label} copy`
    };
    J([...d.slice(0, P + 1), Ye, ...d.slice(P + 1)]), s(Ye.id), _.current = { id: Ye.id, part: "label" };
  }
  function z(P) {
    const fe = d[P], Oe = V.indexOf(fe), Ee = V[Oe + 1] ?? V[Oe - 1];
    J(d.filter((Ye, Ae) => Ae !== P)), o === fe.id && s(null), _.current = Ee ? { id: Ee.id, part: "toggle" } : "add";
  }
  function te() {
    M(!1), requestAnimationFrame(() => {
      var P;
      return (P = ne.current) == null ? void 0 : P.focus();
    });
  }
  return /* @__PURE__ */ l("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ l("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ l("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ l(
          "button",
          {
            ref: oe,
            type: "button",
            className: "dq-header-button",
            onClick: T,
            children: [
              /* @__PURE__ */ r(_i, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        f && /* @__PURE__ */ r(
          "button",
          {
            ref: ne,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": R,
            "aria-controls": R ? Z : void 0,
            onClick: () => {
              G(null), M(!R);
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
              value: S,
              onChange: (P) => b(P.target.value),
              onKeyDown: (P) => {
                P.key === "Escape" && S && (P.preventDefault(), P.stopPropagation(), b(""));
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-actions-hint", children: "Choose a key on its key cap; Auto takes the next free key in this order. Drag a handle, or press Alt + ↑ / ↓, to reorder." }),
      f && /* @__PURE__ */ l("div", { className: "dq-actions-groups", children: [
        /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: w,
              "aria-describedby": `${D}-groups-note`,
              onChange: (P) => t({
                ...e,
                stayUntilGroupsAnswered: P.target.checked ? !0 : void 0
              })
            }
          ),
          "Stay until every group is answered"
        ] }),
        /* @__PURE__ */ r("p", { className: "dq-actions-hint", id: `${D}-groups-note`, children: w && !v.length ? "No action has a group yet: give the actions of each question the same group." : "Single-item view: a plain action moves on once every group has an answer." })
      ] }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-actions-status", children: (j == null ? void 0 : j.actions) === d ? `Added ${j.count} action${j.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    f && R && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here.
    /* @__PURE__ */ r(
      "div",
      {
        onKeyDown: (P) => {
          P.key !== "Escape" || P.defaultPrevented || (P.preventDefault(), P.stopPropagation(), te());
        },
        children: /* @__PURE__ */ r(
          fu,
          {
            id: Z,
            review: e,
            disabled: i,
            onAdd: (P) => {
              const fe = [...d, ...P];
              J(fe), G({ actions: fe, count: P.length }), te();
            },
            onCancel: te
          }
        )
      }
    ),
    /* @__PURE__ */ r("div", { ref: se, children: V.length > 0 && /* @__PURE__ */ r(
      fs,
      {
        items: V,
        getKey: (P) => P.id,
        disabled: i || !!A,
        className: "dq-action-list",
        onReorder: (P) => J(P),
        renderItem: (P, { dragHandleProps: fe, isOver: Oe }) => {
          const Ee = d.indexOf(P), Ye = o === P.id;
          return /* @__PURE__ */ r(
            Nu,
            {
              action: P,
              entityType: u,
              keyButton: /* @__PURE__ */ r(
                pu,
                {
                  actions: d,
                  index: Ee,
                  keyMap: m,
                  name: P.label.trim() || "New action",
                  onChoose: (Ae) => J(Vl(d, Ee, Ae))
                }
              ),
              takenPin: m.duplicatePins.has(Ee) ? P.shortcut : void 0,
              groupUnanswerable: "steps" in P && q.has(gr(P.group)),
              effect: vr(P, g, n, a),
              open: Ye,
              detailId: `${D}-detail-${P.id}`,
              dragHandleProps: fe,
              isOver: Oe,
              reorderDisabled: i || !!A,
              onToggle: () => s(Ye ? null : P.id),
              onDuplicate: () => Q(Ee),
              onDelete: () => z(Ee),
              children: "steps" in P ? /* @__PURE__ */ r(
                Eu,
                {
                  action: P,
                  groupNames: v,
                  saving: i,
                  stepKey: N,
                  rememberStepKey: (Ae, Be) => U.current.set(Ae, N(Be)),
                  onChange: (Ae) => ue(Ee, Ae)
                }
              ) : /* @__PURE__ */ r(
                Cu,
                {
                  action: P,
                  tagGroups: n,
                  onChange: (Ae) => ue(Ee, Ae)
                }
              )
            }
          );
        }
      }
    ) }),
    d.length ? !V.length && /* @__PURE__ */ l("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      S.trim(),
      "”."
    ] }) : /* @__PURE__ */ r("p", { className: "dq-actions-empty", children: f ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function Nu({
  action: e,
  entityType: t,
  keyButton: n,
  takenPin: a,
  groupUnanswerable: i = !1,
  effect: o,
  open: s,
  detailId: c,
  dragHandleProps: u,
  isOver: f,
  reorderDisabled: d,
  onToggle: m,
  onDuplicate: g,
  onDelete: v,
  children: w
}) {
  const q = e.label.trim() || "New action", S = yu(e, t), b = "steps" in e && gr(e.group) ? e.group.trim() : "";
  return /* @__PURE__ */ l(
    "div",
    {
      className: `dq-action-row${s ? " dq-action-row-open" : ""}${f ? " dq-drag-over" : ""}`,
      "data-action-id": e.id,
      children: [
        /* @__PURE__ */ l("div", { className: "dq-action-row-head", children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              ...u,
              style: fc(u.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${q}`,
              title: d ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: d,
              children: /* @__PURE__ */ r(bs, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ l("div", { className: "dq-action-row-summary", onClick: m, children: [
            /* @__PURE__ */ r("span", { className: "dq-action-row-label", title: q, children: q }),
            b && /* @__PURE__ */ l("span", { className: "dq-action-row-group", title: `Group: ${b}`, children: [
              /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Group: " }),
              b
            ] }),
            !s && /* @__PURE__ */ r("span", { className: "dq-action-row-effect", children: o.map((R, M) => /* @__PURE__ */ r("span", { "data-effect-tone": R.tone, children: R.text }, M)) }),
            S && /* @__PURE__ */ l("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ r(In, { "aria-hidden": "true" }),
              S
            ] }),
            a && /* @__PURE__ */ l(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${a.toLocaleUpperCase()} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ r(In, { "aria-hidden": "true" }),
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
                  /* @__PURE__ */ r(In, { "aria-hidden": "true" }),
                  `${b} can't be answered`
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
              onClick: g,
              children: /* @__PURE__ */ r(ys, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Delete ${q}`,
              title: "Delete",
              onClick: v,
              children: /* @__PURE__ */ r(ji, { "aria-hidden": "true" })
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
              onClick: m,
              children: /* @__PURE__ */ r(ws, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ r("div", { id: c, className: "dq-action-detail", children: w })
      ]
    }
  );
}
function hc({
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
function qu(e) {
  const { group: t, ...n } = e;
  return n;
}
function Su({
  action: e,
  groupNames: t,
  onChange: n
}) {
  const a = ut(), i = gr(e.group), o = (s) => n(s ? { ...e, group: s } : qu(e));
  return /* @__PURE__ */ l("label", { className: "dq-action-field", children: [
    /* @__PURE__ */ r("span", { className: "dq-action-field-name", children: "Group" }),
    /* @__PURE__ */ r(
      "input",
      {
        className: "dq-input dq-action-group-input",
        list: a,
        placeholder: "No group",
        autoComplete: "off",
        spellCheck: !1,
        value: e.group ?? "",
        onChange: (s) => o(s.target.value),
        onBlur: (s) => {
          const c = s.target.value.trim();
          c !== s.target.value && o(c);
        }
      }
    ),
    /* @__PURE__ */ r("datalist", { id: a, children: t.filter((s) => gr(s) !== i).map((s) => /* @__PURE__ */ r("option", { value: s }, s)) })
  ] });
}
function Eu({
  action: e,
  groupNames: t,
  saving: n,
  stepKey: a,
  rememberStepKey: i,
  onChange: o
}) {
  const s = ut(), c = O(null), u = O(null);
  Rt(() => {
    var m, g;
    const d = u.current;
    d != null && (u.current = null, (g = (m = c.current) == null ? void 0 : m.querySelector(`[data-step-index="${d}"] input`)) == null || g.focus());
  });
  const f = (d) => o({ ...e, steps: d });
  return /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ r(hc, { action: e, onChange: (d) => o({ ...e, label: d }) }),
    /* @__PURE__ */ r(Su, { action: e, groupNames: t, onChange: o }),
    /* @__PURE__ */ l("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": s, children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", id: s, children: "Steps" }),
      /* @__PURE__ */ l("div", { className: "dq-steps", ref: c, children: [
        e.steps.length > 0 ? /* @__PURE__ */ r(
          fs,
          {
            items: e.steps,
            getKey: a,
            disabled: n,
            className: "dq-step-list",
            onReorder: f,
            renderItem: (d, { index: m, dragHandleProps: g, isOver: v }) => /* @__PURE__ */ r(
              ku,
              {
                step: d,
                index: m,
                dragHandleProps: g,
                isOver: v,
                saving: n,
                onChange: (w) => {
                  i(w, d), f(e.steps.map((q, S) => S === m ? w : q));
                },
                onRemove: () => f(e.steps.filter((w, q) => q !== m))
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
              u.current = e.steps.length, f([...e.steps, { mode: "ADD", tagIds: [] }]);
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
function ku({
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
      "data-step-tone": bu(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            ...n,
            style: fc(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${c}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ r(bs, { "aria-hidden": "true" }),
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
            children: gu.map(({ mode: u, label: f }) => /* @__PURE__ */ r("option", { value: u, children: f }, u))
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
            children: /* @__PURE__ */ r(la, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function Cu({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const a = e.effect, i = a.mode === "SET_TAG_GROUP" ? `group:${a.tagGroupId}` : a.mode, o = a.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === a.tagGroupId);
  return /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ r(hc, { action: e, onChange: (s) => n({ ...e, label: s }) }),
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
const pc = hl(!1);
function Au({ children: e }) {
  return /* @__PURE__ */ r(pc.Provider, { value: !0, children: e });
}
function Gt({ tag: e, name: t }) {
  const n = pl(pc), a = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ r(gl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: a ?? void 0 });
}
function Tu({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, a = Sn(je(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
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
function Iu({
  review: e,
  onChange: t
}) {
  const n = Sn(je(e)).many, a = e.occurrence, i = Cs(a), o = ["any", "isNull"].includes(a.condition) ? [] : a.conditionTagIds, s = ha([
    ...i.flatMap((d) => [d.tagId, ...d.categoryTagId ? [d.categoryTagId] : []]),
    ...o
  ]), c = (d) => {
    var m;
    return ((m = s[d]) == null ? void 0 : m.name) ?? (s[d] === null ? `Unavailable tag ${d}` : `Tag ${d}`);
  }, u = (d) => t({ ...e, occurrence: Kl(a, d) }), f = (d, m) => u(
    i.map(
      (g, v) => v !== d ? g : m === void 0 ? { tagId: g.tagId } : { tagId: g.tagId, categoryTagId: m }
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
    i.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-flag-pairs", "aria-label": "Performer flags", children: i.map((d, m) => {
      const g = c(d.tagId), v = i.filter(
        (S, b) => b !== m && S.tagId === d.tagId
      ), w = (S) => v.some((b) => b.categoryTagId === S), q = `${d.tagId}#${i.slice(0, m).filter((S) => S.tagId === d.tagId).length}`;
      return /* @__PURE__ */ l("li", { className: "dq-flag-pair", children: [
        /* @__PURE__ */ l("span", { className: "dq-flag-pair-tag", children: [
          /* @__PURE__ */ r($n, { "aria-hidden": "true" }),
          /* @__PURE__ */ r(Gt, { tag: s[d.tagId], name: g })
        ] }),
        /* @__PURE__ */ l("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ r("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ r(
            Co,
            {
              entityType: "tag",
              value: d.categoryTagId,
              onChange: (S) => f(m, S),
              placeholder: "Whole review",
              allowCreate: !1,
              selectedDisplay: "input",
              inputClassName: "dq-input",
              inputAriaLabel: `Affects, ${g}`,
              excludeIds: v.flatMap(
                (S) => S.categoryTagId === void 0 ? [] : [S.categoryTagId]
              )
            }
          )
        ] }),
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            className: "dq-icon-button",
            "aria-label": `Remove flag ${g}`,
            title: "Remove flag",
            onClick: () => u(i.filter((S, b) => b !== m)),
            children: /* @__PURE__ */ r(ji, { "aria-hidden": "true" })
          }
        ),
        o.length > 0 && /* @__PURE__ */ l(
          "div",
          {
            className: "dq-flag-suggestions",
            role: "group",
            "aria-label": `Suggested categories for ${g}`,
            children: [
              /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "Condition categories" }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": d.categoryTagId === void 0,
                  disabled: w(void 0),
                  onClick: () => f(m, void 0),
                  children: "Whole review"
                }
              ),
              o.map((S) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": d.categoryTagId === S,
                  disabled: w(S),
                  onClick: () => f(m, S),
                  children: c(S)
                },
                S
              ))
            ]
          }
        )
      ] }, q);
    }) }),
    /* @__PURE__ */ r(
      Co,
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
const mc = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, gc = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, Ru = {
  video: Ba,
  audio: qs,
  tag: Ns,
  performerOccurrence: vs,
  audioPerformerOccurrence: Tl
};
function bc({ entityType: e }) {
  const t = Ru[e];
  return /* @__PURE__ */ r(t, { role: "img", "aria-label": mc[e] });
}
const $u = 2e6;
function yc(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), a = document.createElement("a");
  a.href = n, a.download = t, a.click(), URL.revokeObjectURL(n);
}
function Ou(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function oo(e) {
  yc([e], Ou(e));
}
async function Mu(e) {
  if (e.size > $u) throw new Error("Review files must be smaller than 2 MB.");
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
      Object.keys(i).sort().map((o) => [o, i[o]])
    ) : i
  );
}
function wc({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: a,
  nameRef: i,
  autoFocus: o = !1
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
          onChange: (s) => a == null ? void 0 : a(s.target.value),
          children: As.map((s) => /* @__PURE__ */ r("option", { value: s, children: gc[s] }, s))
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
function Fu(e, t) {
  const n = _e(e), a = ["Review"];
  return (n === "video" || n === "tag") && a.push("Appearance"), a.push("Actions"), t && a.push("Tag choices"), a;
}
function Pu({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = O(null), a = O(null), i = ut(), o = ut();
  return H(() => {
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
function vc({
  draft: e,
  onChange: t,
  direction: n,
  onDirectionChange: a,
  tagGroups: i,
  trees: o,
  saving: s,
  saveDisabled: c = !1,
  error: u,
  dirty: f,
  criteriaChanged: d = !1,
  notices: m,
  onSave: g,
  onCancel: v,
  drawerRef: w
}) {
  const [q, S] = C("Review"), [b] = C(
    () => Re(e) && e.occurrence.tagIds.length > 0
  ), [R, M] = C(""), [j, G] = C(null), [D, Z] = C(0), [ne, oe] = C(!1), se = O(null), _ = O(null), U = O(null), N = Fu(e, b), A = _e(e), V = ye(() => xr(e), [e]);
  H(() => M(""), [V]), H(() => {
    var Q, z;
    if (ne) return;
    const B = se.current;
    if (se.current = null, !B) return;
    (z = B.isConnected && !!((Q = U.current) != null && Q.contains(B)) && !(B instanceof HTMLButtonElement && B.disabled) ? B : U.current) == null || z.focus({ preventScroll: !0 });
  }, [ne]);
  function J() {
    if (!(s || ne)) {
      if (!f) {
        v();
        return;
      }
      se.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, oe(!0);
    }
  }
  function ue() {
    const B = { ...e, name: e.name.trim() }, T = oa(B);
    if (!T) {
      M(""), g();
      return;
    }
    if (M(T), !B.name) {
      S("Review"), requestAnimationFrame(() => {
        var z;
        return (z = _.current) == null ? void 0 : z.focus();
      });
      return;
    }
    const Q = e.actions.find(
      (z) => !On(z, A)
    );
    Q && (S("Actions"), G(Q.id), Z((z) => z + 1));
  }
  const ce = R || u;
  return /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ l(
      "aside",
      {
        ref: (B) => {
          U.current = B, w && (w.current = B);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (B) => {
          B.key !== "Escape" || B.defaultPrevented || s || (B.preventDefault(), B.stopPropagation(), J());
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
                onClick: J,
                children: /* @__PURE__ */ r(la, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ r(
            bl,
            {
              tabs: N.map((B) => ({
                key: B,
                label: B,
                count: B === "Actions" ? e.actions.length : void 0
              })),
              activeTab: q,
              onTabChange: (B) => S(B)
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
                    wc,
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
                  Re(e) && /* @__PURE__ */ r(Iu, { review: e, onChange: t }),
                  /* @__PURE__ */ r("div", { children: /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => oo(e),
                      children: "Export draft"
                    }
                  ) })
                ]
              }
            ),
            N.includes("Appearance") && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: q !== "Appearance",
                "aria-label": "Appearance",
                children: /* @__PURE__ */ r(xu, { review: e, onChange: t })
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
                  vu,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: i,
                    trees: o,
                    saving: s,
                    expandedId: j,
                    onExpand: G,
                    reveal: D
                  }
                )
              }
            ),
            b && Re(e) && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: q !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ r(Tu, { review: e, onChange: t })
              }
            )
          ] }) }),
          (ce || m) && /* @__PURE__ */ l("div", { className: "dq-drawer-notices", children: [
            m,
            ce && /* @__PURE__ */ l("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ r(In, { "aria-hidden": "true" }),
              ce
            ] })
          ] }),
          /* @__PURE__ */ l("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ r("p", { className: "dq-drawer-dirty", children: f ? d ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: s, onClick: J, children: "Cancel" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button primary",
                "aria-busy": s || void 0,
                "aria-disabled": s || void 0,
                disabled: !s && c,
                onClick: () => {
                  s || ue();
                },
                children: "Save review"
              }
            )
          ] })
        ]
      }
    ),
    ne && /* @__PURE__ */ r(
      Pu,
      {
        onKeepEditing: () => oe(!1),
        onDiscard: () => {
          se.current = null, oe(!1), v();
        }
      }
    )
  ] });
}
function xu({
  review: e,
  onChange: t
}) {
  const n = ut(), a = e.view, i = (d) => t({ ...e, view: { ...a, ...d } }), o = /* @__PURE__ */ l("label", { className: "dq-checkbox dq-setting-indent", children: [
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
  if (_e(e) === "tag")
    return /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ r(
        Ko,
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
  const s = e.presentation ?? {}, c = (d) => t({ ...e, presentation: { ...s, ...d } }), u = s.annotations ?? [], f = a.reviewMode ?? "single";
  return /* @__PURE__ */ l(me, { children: [
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ l("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ r(
          Bo,
          {
            name: `${n}-layout-choice`,
            checked: f === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ r(Lu, {}),
            onChoose: () => i({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ r(
          Bo,
          {
            name: `${n}-layout-choice`,
            checked: f === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ r(Du, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ r(
        Ko,
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
        ].map(([d, m]) => /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: u.includes(d),
              onChange: (g) => c({
                annotations: g.target.checked ? [...u, d] : u.filter((v) => v !== d)
              })
            }
          ),
          m
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
function Ko({
  label: e,
  value: t,
  options: n,
  onChange: a
}) {
  const i = ut();
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
function Bo({
  name: e,
  checked: t,
  title: n,
  text: a,
  picture: i,
  onChoose: o
}) {
  const s = ut(), c = ut();
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
function Lu() {
  return /* @__PURE__ */ l("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function Du() {
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
function Nc({
  name: e,
  description: t,
  entityType: n,
  onBack: a,
  backDisabled: i,
  onEdit: o,
  editDisabled: s,
  editing: c = !1,
  toolbar: u,
  trailing: f,
  trailingEnd: d,
  queueChange: m,
  queueDiffers: g,
  chipsStart: v,
  chipsAfter: w,
  chipsEnd: q
}) {
  const S = O(null);
  Ku(S);
  const b = Bu(S), [R, M] = C({ differs: g, text: "" });
  return R.differs !== g && M({
    differs: g,
    text: g ? R.differs === !1 ? ki : R.text : ""
  }), /* @__PURE__ */ l("header", { ref: S, className: "dq-review-header", children: [
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
      /* @__PURE__ */ r("span", { className: "dq-review-type", title: mc[n], children: /* @__PURE__ */ r(bc, { entityType: n }) }),
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
      f,
      m && /* @__PURE__ */ r(_u, { change: m, onPress: b }),
      d
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    v,
    w && /* @__PURE__ */ r("div", { className: "dq-review-chips-after", children: w }),
    q && /* @__PURE__ */ r("div", { className: "dq-review-chips-end", children: q }),
    /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: R.text })
  ] });
}
function _u({
  change: e,
  onPress: t
}) {
  const n = ut(), a = ut(), i = `${ki} Save these filters to the review.`, o = e.onSave ? `${ki} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
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
          var s;
          t(), (s = e.onSave) == null || s.call(e);
        },
        children: [
          /* @__PURE__ */ r($l, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ r(Ol, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-queue-label", children: "Reset" }),
          /* @__PURE__ */ r("span", { id: a, hidden: !0, children: o })
        ]
      }
    )
  ] });
}
const ju = ["queue", "summary", "name", "layout", "range"], Uu = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, Gu = "(min-width: 1400px)";
function Fa(e) {
  const t = e.querySelector(".dq-review-header-lead"), n = e.querySelector(".dq-review-header-trail");
  if (!t || !n) return !0;
  const a = t.getBoundingClientRect();
  return !a.height || n.getBoundingClientRect().top < a.bottom;
}
function Vo(e, t) {
  const n = e.querySelector(".dq-review-header-lead h1"), a = () => {
    e.removeAttribute("data-compact"), n == null || n.style.removeProperty("max-width");
  };
  if (a(), !t) return !0;
  const i = ju.filter(
    (o) => e.querySelector(Uu[o])
  );
  for (let o = 1; o <= i.length && !Fa(e); o++) {
    if (e.dataset.compact = i.slice(0, o).join(" "), i[o - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !Fa(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return Fa(e) ? !0 : (a(), !1);
}
function Ku(e) {
  const t = rc(Gu), [n, a] = C(0), i = O(!1);
  Rt(() => {
    e.current && (i.current = !Vo(e.current, t));
  }, [e, t, n]), Rt(() => {
    const o = e.current;
    o && t && !i.current && !Fa(o) && (i.current = !Vo(o, t));
  }), H(() => {
    const o = e.current;
    if (!o || !t || typeof ResizeObserver > "u") return;
    const s = new ResizeObserver(() => a((c) => c + 1));
    s.observe(o);
    for (const c of o.querySelectorAll(".dq-review-header-lead, .dq-review-header-trail"))
      s.observe(c);
    return () => s.disconnect();
  }, [e, t]);
}
function Bu(e) {
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
    const o = n.querySelector(".dq-queue-button") ?? n.querySelector(".dq-review-header-trail .dq-menu > button");
    !o || o.disabled || (t.current = !1, o.focus());
  }), () => {
    t.current = !0;
  };
}
function qc({
  page: e,
  pages: t,
  onPage: n
}) {
  const [a, i] = C(!1), [o, s] = C(""), c = O(null), u = O(null);
  H(() => {
    var m;
    a && ((m = c.current) == null || m.select());
  }, [a]);
  const f = (m) => {
    i(!1), m && requestAnimationFrame(() => {
      var g;
      return (g = u.current) == null ? void 0 : g.focus();
    });
  }, d = () => {
    const m = Math.round(Number(o));
    f(!0), Number.isFinite(m) && m >= 1 && m !== e && n(Math.min(t, m));
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
        value: o,
        onChange: (m) => s(m.target.value),
        onKeyDown: (m) => {
          m.key === "Enter" ? (m.preventDefault(), d()) : m.key === "Escape" && (m.preventDefault(), m.stopPropagation(), f(!0));
        },
        onBlur: () => f(!1)
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
        children: /* @__PURE__ */ r(Ss, { "aria-hidden": "true" })
      }
    )
  ] });
}
function Sc({
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
          /* @__PURE__ */ r(Rl, { "aria-hidden": "true" }),
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
function Vu({
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
function so({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [a, i] = C(!1), [o, s] = C(!1), c = O(null), u = O(null), f = ut();
  Rt(() => {
    if (!a || !u.current || !c.current) return;
    const g = c.current.getBoundingClientRect(), v = u.current.offsetHeight + 12, w = window.innerHeight - g.bottom;
    s(w < v && g.top > w);
  }, [a]), H(() => {
    var g, v;
    a && ((v = (g = u.current) == null ? void 0 : g.querySelector('[role="menuitem"]:not(:disabled)')) == null || v.focus({ preventScroll: !0 }));
  }, [a]), H(() => {
    t && i(!1);
  }, [t]);
  const d = (g = !0) => {
    var v;
    i(!1), g && ((v = c.current) == null || v.focus());
  };
  return /* @__PURE__ */ l("div", { className: `dq-menu${a ? " dq-menu-open" : ""}`, onKeyDown: (g) => {
    var q, S;
    if (!a) return;
    const v = [
      ...((q = u.current) == null ? void 0 : q.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], w = v.indexOf(document.activeElement);
    if (g.key === "Escape")
      g.preventDefault(), g.stopPropagation(), d();
    else if (g.key === "Tab")
      d(!1);
    else if (g.key === "ArrowDown" || g.key === "ArrowUp") {
      if (g.preventDefault(), !v.length) return;
      const b = g.key === "ArrowDown" ? 1 : -1;
      v[(w + b + v.length) % v.length].focus();
    } else (g.key === "Home" || g.key === "End") && (g.preventDefault(), (S = v.at(g.key === "Home" ? 0 : -1)) == null || S.focus());
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
        "aria-controls": a ? f : void 0,
        disabled: t,
        onClick: () => i((g) => !g),
        children: /* @__PURE__ */ r(Il, { "aria-hidden": "true" })
      }
    ),
    a && /* @__PURE__ */ l(me, { children: [
      /* @__PURE__ */ r("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => d(!1) }),
      /* @__PURE__ */ r(
        "div",
        {
          ref: u,
          id: f,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${o ? " dq-menu-list-up" : ""}`,
          children: e.map((g) => /* @__PURE__ */ l(Pi, { children: [
            g.separated && /* @__PURE__ */ r("div", { role: "separator", className: "dq-menu-separator" }),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: g.danger ? "dq-menu-danger" : void 0,
                disabled: g.disabled,
                onClick: () => {
                  d(), g.onSelect();
                },
                children: [
                  g.icon,
                  g.label
                ]
              }
            )
          ] }, g.label))
        }
      )
    ] })
  ] });
}
function Ua(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function co(e) {
  return String(e.type).toLowerCase() === "tag";
}
function lo(e) {
  return !!String(e ?? "").trim();
}
function uo(e) {
  return [
    ...new Set(
      Ua(e.customFieldCriteria).filter(co).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !lo(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function fo(e, t) {
  const n = Ua(e.customFieldCriteria);
  if (!n.length) return e;
  let a = !1;
  const i = n.map((o) => {
    if (!co(o)) return o;
    const s = { ...o };
    for (const [c, u] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(o[c] ?? "")];
      f && !lo(o[u]) && (s[u] = f, a = !0);
    }
    return s;
  });
  return a ? { ...e, customFieldCriteria: i } : e;
}
function Ec(e, t, n) {
  const a = Ua(e.customFieldCriteria);
  if (!a.length) return e;
  const i = Ua(n.customFieldCriteria), o = (u, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (d) => (u[d] ?? void 0) === (f[d] ?? void 0)
  );
  let s = !1;
  const c = a.map((u) => {
    if (!co(u)) return u;
    const f = i.find((m) => o(m, u));
    if (!f) return u;
    const d = { ...u };
    for (const [m, g] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const v = t[String(u[m] ?? "")];
      v && u[g] === v && !lo(f[g]) && (delete d[g], s = !0);
    }
    return d;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
async function Ju(e, t, n) {
  if (!On(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const a = je(e), i = n.steps.some((c) => Rn(c.mode)) ? await Cd(a) : "", o = await Yi(n);
  let s = t.applications;
  for (const c of [
    ...o.filter((u) => !Rn(u.mode)),
    ...o.filter((u) => Rn(u.mode))
  ]) {
    const u = (f) => Ad(
      i,
      a,
      t.media.id,
      t.performer.id,
      c.tagIds,
      f
    );
    (c.mode === "MARK_PRESENT" || c.mode === "CLEAR_ABSENCE") && await u("REMOVE"), c.mode !== "CLEAR_ABSENCE" && (s = await Tc(
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
async function ho(e, t) {
  const n = e.occurrence;
  if (Bi(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const a = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await de("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Mn({
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
function kc(e) {
  return aa(e.condition) && e.hideConfirmedAbsent !== !1;
}
function po(e, t) {
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
  }, s = kc(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
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
            { filter: { performerFilterCriterion: o } },
            ...s ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: Va,
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
async function mo(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => Ja([n], t))
  );
}
function Cc(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function zu(e, t, n = e.conditionTagIds.map((a) => [a])) {
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
function Wu(e, t, n, a, i) {
  if (!kc(e)) return !1;
  const o = js(t, n);
  return e.conditionTagIds.every(
    (s, c) => o.includes(s) || i[c].some((u) => a.includes(u))
  );
}
async function Ac(e, t, n, a) {
  if ((t == null ? void 0 : t.length) === 0 || Cc(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = je(e), o = await ta(
    po(e, t),
    { ...e.view.filter, page: n },
    a
  ), s = t === null ? null : new Set(t), c = e.occurrence, u = o.items.length ? await mo(c, a) : [], f = new Array(o.items.length);
  let d = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; d < o.items.length; ) {
        const m = d++, g = o.items[m], v = await de(
          `/api/tagapplications?hostType=${i}&hostId=${g.id}&contextType=performer`,
          { signal: a }
        );
        f[m] = g.performers.filter((w) => s === null || s.has(w.id)).flatMap((w) => {
          const q = v.filter(
            (b) => b.hostType === i && b.hostId === g.id && b.contextType === "performer" && b.contextId === w.id
          ), S = q.map((b) => b.tag.id);
          return zu(e.occurrence, S, u) && !Wu(c, g, w.id, S, u) ? [
            {
              key: `${g.id}:${w.id}`,
              media: g,
              performer: w,
              applications: q
            }
          ] : [];
        });
      }
    })
  ), { items: f.flat(), totalCount: o.totalCount };
}
async function Tc(e, t, n) {
  const a = new Set(e.occurrence.tagIds);
  if (n.some((f) => !a.has(f)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = je(e), o = await yi(i, t.media.id);
  if (!o.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, c = (await de(s)).filter(
    (f) => f.hostType === i && f.hostId === o.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), u = new Set(n);
  try {
    for (const f of u)
      c.some((d) => d.tag.id === f) || await de("/api/tagapplications", {
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
      a.has(f.tag.id) && !u.has(f.tag.id) && await de(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await de(s);
  } catch (f) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${f instanceof Error ? f.message : "Request failed."}`
    );
  }
}
function Dr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function Qu(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function un(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const u = n ? js(
      await yi(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await de(Qu(e, t))).filter(
      (d) => d.hostType === e && d.hostId === t.media.id && d.contextType === "performer" && d.contextId === t.occurrence.performer.id
    );
    return Ei(f.map((d) => d.tag)), {
      ids: [...new Set(f.map((d) => d.tag.id))],
      names: [...new Set(f.map((d) => d.tag.name))],
      absent: u,
      applications: f
    };
  }
  const a = await yi(e, t.media.id), i = (a.tags ?? []).filter(
    (u) => u.canRemove !== !1 || u.isDerived !== !0
  );
  Ei(i);
  const o = Object.keys(a.customFields ?? {}).find(
    (u) => u.toLowerCase() === Da
  ) ?? Da, s = ((c = a.customFields) == null ? void 0 : c[o]) ?? [];
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
async function go(e, t, n) {
  if (t.occurrence && Re(e))
    await Tc(
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
        `/api/${Hn(je(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: a, tagIds: i })
        }
      );
}
async function Hu(e, t, n) {
  t.occurrence && Re(e) ? await Ju(e, t.occurrence, n) : await Us(je(e), n, [t.media.id]);
}
function Ci(e, t, n, a) {
  const i = (o) => o.filter((s) => a.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: Dr(i(t.ids), i(n.ids)),
    absence: Dr(i(t.absent), i(n.absent))
  };
}
function Yu(e, t) {
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
class Ic extends Error {
}
const Ai = (e) => e instanceof Error ? e.message : "Request failed.", Jo = (e) => [...e].sort((t, n) => t - n), sa = (e, t) => JSON.stringify(Jo(e)) === JSON.stringify(Jo(t)), Ti = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Ga(e, t, n, a) {
  const i = new Set(e), o = new Set(e);
  for (const d of t.steps)
    for (const m of d.tagIds)
      d.mode === "ADD" ? o.add(m) : o.delete(m);
  const s = e.some((d) => !o.has(d));
  if (s && !a)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const c = new Set(
    t.steps.filter((d) => d.mode === "ADD").flatMap((d) => d.tagIds)
  ), u = [], f = [];
  for (const d of n) {
    const m = d.filter((v) => o.has(v) && !i.has(v)), g = d.filter(
      (v) => o.has(v) && i.has(v) && !c.has(v)
    );
    !m.length || !g.length || (a ? (g.forEach((v) => o.delete(v)), f.push(...g)) : (m.forEach((v) => o.delete(v)), u.push({ tagIds: m, existing: g })));
  }
  return { desired: [...o], conflict: s, skipped: !1, kept: u, replaced: f };
}
function Xu(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Zu(e, t, n, a) {
  for (const [i, o] of n.entries()) {
    const s = t.filter(
      (f) => f.steps.some(
        (d) => d.mode === "ADD" && d.tagIds.some((m) => o.includes(m))
      )
    );
    if (s.length < 2) continue;
    const c = e.occurrence.conditionTagIds[i];
    let u = `tag ${c}`;
    try {
      u = (await de(`/api/tags/${c}`, { signal: a })).name;
    } catch {
      a.throwIfAborted();
    }
    throw new Ic(
      `${s.map((f) => f.label).join(" and ")} answer the same condition tag, ${u}. Choose one of them.`
    );
  }
}
async function ef(e, t, n, a = () => {
}) {
  if (!t.length || t.some(
    (g) => !On(g, e.entityType) || !g.steps.length || g.steps.some(
      (v) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(v.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = aa(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await mo(i.occurrence, n) : [];
  await Zu(i, o, s, n);
  const c = await Promise.all(
    o.map(async (g) => ({
      ...g,
      steps: await Yi(g, n)
    }))
  ), u = structuredClone(Xu(c));
  n.throwIfAborted();
  const f = [
    .../* @__PURE__ */ new Set([
      ...u.steps.flatMap((g) => g.tagIds),
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
  const d = await ho(i, n), m = /* @__PURE__ */ new Map();
  for (let g = 1; ; g++) {
    n.throwIfAborted();
    const v = await Ac(i, d, g, n);
    for (const w of v.items) {
      const q = {
        ids: [...new Set(w.applications.map((b) => b.tag.id))],
        names: w.applications.map((b) => b.tag.name),
        absent: [],
        applications: w.applications
      }, S = Ga(q.ids, u, s, !0);
      m.set(w.key, {
        item: { key: w.key, media: w.media, occurrence: w },
        before: q,
        expected: q,
        conflict: S.conflict,
        status: sa(q.ids, S.desired) ? "unchanged" : "pending"
      });
    }
    if (a(m.size), g * 250 >= v.totalCount) break;
    if (g > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return n.throwIfAborted(), {
    review: i,
    actions: o,
    action: u,
    categories: s,
    touched: f,
    entries: [...m.values()]
  };
}
function tf(e, t, n) {
  const a = (o) => o.ids.filter((s) => n.includes(s));
  if (!sa(a(e), a(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return sa(i(e), i(t));
}
async function Rc(e, t, n, a) {
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
function $c(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function Oc(e) {
  return e.entries.filter((t) => t.operation);
}
async function nf(e, t, n, a, i = !1) {
  await Rc(
    $c(e, i),
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
        if (s = await un(je(e.review), o.item, !1), !tf(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (g) {
        o.status = "failed", o.error = Ai(g);
        return;
      }
      const c = Ga(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), u = [
        ...s.ids.filter((g) => !e.touched.includes(g)),
        ...c.desired.filter((g) => e.touched.includes(g))
      ], f = Dr(s.ids, u);
      if (!f.added.length && !f.removed.length) {
        const g = !o.operation && c.kept.length > 0;
        o.status = o.operation ? "changed" : g ? "skipped" : "unchanged", o.error = g ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let d;
      try {
        await go(e.review, o.item, f);
      } catch (g) {
        d = g;
      }
      let m = !1;
      try {
        const g = await un(je(e.review), o.item, !1);
        m = !0, o.expected = g;
        const v = Ci(
          o.item,
          o.before,
          g,
          e.touched
        );
        if (o.operation = Ti(v) ? v : void 0, d) throw d;
        if (!sa(
          g.ids.filter((w) => e.touched.includes(w)),
          u.filter((w) => e.touched.includes(w))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (g) {
        if (o.status = "failed", o.error = Ai(g), !m)
          try {
            const v = await un(je(e.review), o.item, !1);
            o.expected = v;
            const w = Ci(
              o.item,
              o.before,
              v,
              e.touched
            );
            o.operation = Ti(w) ? w : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    a
  );
}
async function rf(e, t, n) {
  await Rc(
    Oc(e),
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
        const c = await un(je(e.review), a.item, !1);
        Yu(i, c), s = !0, await go(e.review, a.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const u = await un(je(e.review), a.item, !1);
        if (!sa(
          u.ids.filter((f) => o.includes(f)),
          a.before.ids.filter((f) => o.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        a.operation = void 0, a.expected = u, a.status = "unchanged", a.error = void 0;
      } catch (c) {
        if (a.error = `Undo stopped: ${Ai(c)}`, a.status = "failed", s)
          try {
            const u = await un(je(e.review), a.item, !1), f = Ci(
              a.item,
              a.before,
              u,
              o
            );
            a.operation = Ti(f) ? f : void 0, a.expected = u;
          } catch {
            a.unverified = !0;
          }
      }
    },
    n
  );
}
const Mc = (e, t) => t.count - e.count || Gs(e, t);
async function af(e, t, n) {
  const a = je(e), i = e.occurrence, [o, s] = await Promise.all([
    de(
      `/api/tagapplications?hostType=${a}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    mo(i, n)
  ]), c = o.filter(
    (w) => w.hostType === a && w.contextType === "performer" && w.contextId === t
  );
  Ei(c.map((w) => w.tag));
  const u = await Promise.all(
    s.map(async (w, q) => {
      const S = i.conditionTagIds[q];
      return (await de(`/api/tags/${S}`, { signal: n })).name;
    })
  ), f = new Set(s.flat()), d = new Set(
    [
      ...e.actions.flatMap((w) => w.steps).filter((w) => w.mode === "ADD" || w.mode === "MARK_PRESENT").flatMap((w) => w.tagIds),
      ...i.tagIds
    ].filter((w) => !f.has(w))
  ), m = (w) => {
    const q = /* @__PURE__ */ new Map();
    for (const S of c) {
      if (!w.has(S.tag.id)) continue;
      const b = q.get(S.tag.id) ?? {
        tag: S.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      b.hosts.add(S.hostId), q.set(S.tag.id, b);
    }
    return [...q.values()].map((S) => ({ ...S.tag, count: S.hosts.size })).sort(Mc);
  }, g = s.map((w, q) => ({
    id: i.conditionTagIds[q],
    name: u[q],
    members: w,
    tags: m(new Set(w))
  }));
  d.size && g.push({
    id: null,
    name: s.length ? "Other review tags" : "Review tags",
    members: [...d],
    tags: m(d)
  });
  const v = /* @__PURE__ */ new Set([...f, ...d]);
  return {
    answered: new Set(
      c.filter((w) => v.has(w.tag.id)).map((w) => w.hostId)
    ).size,
    groups: g
  };
}
function bo(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const f of e.groups) for (const d of f.tags) n.set(d.id, d);
  const a = (f) => f.members ?? f.tags.map((d) => d.id), i = e.groups.filter((f) => f.id !== null).map((f) => ({
    key: `tag:${f.id}`,
    kind: "condition",
    name: f.name,
    members: a(f),
    tags: f.tags
  })), o = i.map((f) => new Set(f.members)), s = /* @__PURE__ */ new Set();
  for (const f of _r(t)) {
    const d = [
      ...new Set(f.actions.flatMap((m) => [...wr(t[m])]))
    ];
    !d.length || o.some((m) => d.every((g) => m.has(g))) || (d.forEach((m) => s.add(m)), i.push({
      key: `group:${f.key}`,
      kind: "group",
      name: f.name,
      members: d,
      tags: d.flatMap((m) => n.get(m) ?? []).sort(Mc)
    }));
  }
  const c = e.groups.find((f) => f.id === null), u = (c == null ? void 0 : c.tags.filter((f) => !s.has(f.id))) ?? [];
  return c && u.length && i.push({
    key: "other",
    kind: "other",
    name: i.length ? "Other review tags" : "Review tags",
    members: a(c).filter((f) => !s.has(f)),
    tags: u
  }), i;
}
const si = { summary: null, error: "" };
function Fc(e, t, n = 0) {
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
    value: si
  });
  return H(() => {
    if (s((u) => u.key === i ? u : { key: i, value: si }), e === null || t === null) return;
    const c = new AbortController();
    return af(e, t, c.signal).then((u) => {
      c.signal.aborted || s({ key: i, value: { summary: u, error: "" } });
    }).catch((u) => {
      c.signal.aborted || s((f) => ({
        key: i,
        value: {
          summary: f.key === i ? f.value.summary : null,
          error: u instanceof Error ? u.message : "Request failed."
        }
      }));
    }), () => c.abort();
  }, [i, n]), o.key === i ? o.value : si;
}
function Ii({
  summary: e,
  error: t,
  mediaKind: n,
  actions: a = [],
  flags: i = [],
  className: o = ""
}) {
  const s = Sn(n), c = (d) => `${d.toLocaleString()} ${d === 1 ? s.one : s.many}`, u = e ? bo(e, a) : [], f = (d) => [
    ...new Set(
      i.filter((m) => {
        var g;
        return (g = m.tagIds) == null ? void 0 : g.some((v) => d.includes(v));
      }).flatMap((m) => m.flags)
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
          e && /* @__PURE__ */ r("span", { children: e.answered ? `${c(e.answered)} answered` : "none answered yet" })
        ] }),
        t ? /* @__PURE__ */ l("p", { role: "alert", children: [
          "Could not load existing answers. ",
          t
        ] }) : e ? u.map((d) => {
          const m = d.kind === "other" ? [] : f(d.members);
          return /* @__PURE__ */ l("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ l("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ r("span", { children: d.name }),
              d.kind !== "other" && d.tags.length > 1 && /* @__PURE__ */ l(
                "span",
                {
                  className: "dq-badge dq-badge-warning",
                  title: "This performer has different answers in this category.",
                  children: [
                    /* @__PURE__ */ r($n, { "aria-hidden": "true" }),
                    "Mixed"
                  ]
                }
              ),
              m.length > 0 && /* @__PURE__ */ l(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-flag",
                  title: `Flagged: ${m.join(", ")}`,
                  children: [
                    /* @__PURE__ */ r($n, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Flagged: " }),
                      m.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            d.tags.length ? /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": d.name, children: d.tags.map((g) => /* @__PURE__ */ l("li", { className: "dq-tag", children: [
              /* @__PURE__ */ r(Gt, { tag: g }),
              /* @__PURE__ */ r("span", { className: "dq-chip-count", "aria-hidden": "true", children: g.count.toLocaleString() }),
              /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
                ", ",
                c(g.count)
              ] })
            ] }, g.id)) }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" })
          ] }, d.key);
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
const zo = 5, of = /* @__PURE__ */ new Map();
function sf(e, t) {
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
function cf(e, t) {
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
const Wo = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), Ri = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], Qo = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], lf = {
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
function df({ step: e }) {
  const t = Ri.findIndex((n) => n.id === e);
  return /* @__PURE__ */ r("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Ri.map((n, a) => {
    const i = a < t ? "done" : a === t ? "current" : "next";
    return /* @__PURE__ */ l("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ r(Ka, {}) : a + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function Ho({ parts: e, id: t }) {
  return /* @__PURE__ */ r("span", { className: "dq-batch-effect", id: t, children: e.map((n, a) => /* @__PURE__ */ l(Pi, { children: [
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
        n && /* @__PURE__ */ l(me, { children: [
          " ",
          /* @__PURE__ */ r("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function Yo({
  added: e,
  removed: t,
  tag: n,
  label: a
}) {
  return /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": a, children: [
    pr(e.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
      "+ ",
      /* @__PURE__ */ r(Gt, { tag: i })
    ] }) }, `added-${i.id}`)),
    pr(t.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ l("del", { children: [
      "− ",
      /* @__PURE__ */ r(Gt, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function Xo({
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
      /* @__PURE__ */ r("tbody", { children: t.slice(0, ci).map((o) => {
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
function uf(e) {
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
function ff({
  review: e,
  disabled: t,
  performerAttention: n,
  trees: a,
  onOpen: i,
  onClose: o,
  onWrite: s
}) {
  const [c, u] = C(!1), [f, d] = C("answers"), [m, g] = C(null), [v, w] = C({}), [q, S] = C([]), [b, R] = C(!1), [M, j] = C(!1), [G, D] = C(""), [Z, ne] = C(!1), [oe, se] = C(""), [_, U] = C(null), [N, A] = C(null), [V, J] = C([]), [ue, ce] = C(0), B = O(null), T = O(null), Q = O(null), z = O(!1), te = O(!1), P = O(null), fe = O(!1), Oe = O(0), Ee = O(!1), Ye = O({ onClose: o, onWrite: s });
  Ye.current = { onClose: o, onWrite: s };
  const Ae = ut(), Be = f === "run", en = (_ == null ? void 0 : _.kind) === "undo", ke = Be && m ? m.review : e, En = jr(ke.actions), ge = ke.occurrence, Ve = je(ke), qt = Sn(Ve), fn = qt.queue, Me = Be && m ? m.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((k) => k.steps.length && !Wn(k))
  ), rt = Me.filter((k) => q.includes(k.id)), Te = ge.targetMode === "selected" && ge.performerIds.length === 1, Xe = Fc(
    ke,
    c && Te ? ge.performerIds[0] : null,
    ue
  ), Kt = uo(ke.view.objectFilter), $e = ha(
    c ? [...za(Me), ...ge.conditionTagIds, ...Kt] : []
  ), kn = ye(() => nc($e), [$e]), lt = (k) => v[k] ?? $e[k] ?? { id: k, name: `Tag ${k}` }, $t = JSON.stringify(
    Object.fromEntries(
      Kt.flatMap((k) => {
        var W;
        const x = (W = $e[k]) == null ? void 0 : W.name;
        return x ? [[String(k), x]] : [];
      })
    )
  ), ft = ye(
    () => fo(ke.view.objectFilter, JSON.parse($t)),
    [ke.view.objectFilter, $t]
  );
  H(() => {
    var k, x, W;
    c && ((k = B.current) == null || k.showModal(), (W = (x = B.current) == null ? void 0 : x.querySelector(".dq-batch-answer input")) == null || W.focus());
  }, [c]), H(() => {
    if (!c) return;
    const k = requestAnimationFrame(() => {
      var ae;
      const x = B.current, W = document.activeElement;
      if (!x || W && W !== document.body && x.contains(W)) return;
      (ae = (f === "answers" ? x.querySelector(".dq-batch-answer input:checked") ?? x.querySelector(".dq-batch-answer input") : x.querySelector("[data-batch-focus]")) ?? T.current) == null || ae.focus();
    });
    return () => cancelAnimationFrame(k);
  }, [c, f, M, m]), H(() => {
    if (c || t || !z.current) return;
    const k = requestAnimationFrame(() => {
      const x = Q.current;
      if (!z.current || !x || x.disabled) return;
      z.current = !1;
      const W = document.activeElement;
      (!W || W === document.body) && x.focus();
    });
    return () => cancelAnimationFrame(k);
  }, [c, t]), H(() => {
    if (!c || ge.targetMode !== "selected") return;
    const k = new AbortController();
    return J([]), sf(ge.performerIds.slice(0, zo), k.signal).then((x) => {
      k.signal.aborted || J(x);
    }).catch(() => {
    }), () => k.abort();
  }, [c, ge.targetMode, JSON.stringify(ge.performerIds)]), H(
    () => () => {
      var k;
      te.current = !0, (k = P.current) == null || k.abort();
    },
    []
  ), H(() => {
    if (!M) return;
    const k = (x) => {
      x.preventDefault(), x.returnValue = "";
    };
    return window.addEventListener("beforeunload", k), () => window.removeEventListener("beforeunload", k);
  }, [M]);
  function Bt() {
    d("answers"), g(null), w({}), U(null), R(!1), S([]), se(""), D(""), ne(!1), A(null);
  }
  function vt() {
    Ee.current || (u(!1), Ye.current.onClose(fe.current), fe.current = !1, Bt(), z.current = !0);
  }
  function Yn(k, x) {
    S(
      (W) => x ? [...W, k] : W.filter((pe) => pe !== k)
    ), g(null), w({}), se(""), D(""), ne(!1), A(null);
  }
  function kt() {
    d("answers"), A(null), se("");
  }
  function Cn() {
    d("preview"), m || we();
  }
  function Vt() {
    var k;
    te.current = !0, (k = P.current) == null || k.abort(), se("Stopping after in-flight operations settle…");
  }
  function Ot(k) {
    A(
      (x) => (x == null ? void 0 : x.group) === k.group && x.reason === k.reason ? null : k
    );
  }
  const hn = (k, x) => (N == null ? void 0 : N.group) === k && N.reason === x;
  async function we() {
    if (!rt.length || Ee.current) return;
    Ee.current = !0, j(!0), D(""), ne(!1), se("Loading all matching occurrences…"), g(null), w({}), A(null);
    const k = new AbortController();
    P.current = k;
    try {
      await cf(Oe.current, k.signal);
      const x = await ef(
        e,
        rt,
        k.signal,
        (pe) => se(`Loaded ${pe.toLocaleString()} matching occurrences…`)
      );
      k.signal.throwIfAborted();
      const W = {};
      for (const pe of x.entries)
        for (const ae of pe.before.applications ?? [])
          W[ae.tag.id] = ae.tag;
      w(W), g(x), se("Preview ready. No tags have been changed.");
    } catch (x) {
      D(
        k.signal.aborted ? "Preview cancelled. No tags were changed." : x instanceof Error ? x.message : String(x)
      ), ne(!k.signal.aborted && x instanceof Ic), se("");
    } finally {
      Ee.current = !1, j(!1), P.current = null;
    }
  }
  async function St(k) {
    if (!m || Ee.current) return;
    const x = (k === "undo" ? Oc(m) : $c(m, k === "retry")).length;
    Ee.current = !0, te.current = !1, fe.current = !0, Ye.current.onWrite(), j(!0), d("run"), D(""), U({ kind: k, total: x, done: 0, stopped: !1 }), se(
      k === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const W = () => U((ae) => ae && { ...ae, done: ae.done + 1 });
    let pe = !1;
    try {
      k === "undo" ? await rf(m, () => te.current, W) : await nf(m, b, () => te.current, W, k === "retry"), se(
        te.current ? "Stopped after in-flight operations settled. Completed changes are retained." : k === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (ae) {
      pe = !0, se(""), D(ae instanceof Error ? ae.message : String(ae));
    } finally {
      Oe.current = Date.now(), Ee.current = !1;
      const ae = te.current || pe;
      U((Ie) => Ie && { ...Ie, stopped: ae }), j(!1), ce((Ie) => Ie + 1);
    }
  }
  const at = (m == null ? void 0 : m.entries) ?? [], Fn = ye(
    () => new Map(
      ((m == null ? void 0 : m.entries) ?? []).map((k) => [
        k.item.key,
        Ga(k.before.ids, m.action, m.categories, b)
      ])
    ),
    [m, b]
  ), Jt = (k) => Fn.get(k.item.key), Fe = (k) => Dr(k.before.ids, Jt(k).desired), Ct = (k) => {
    const x = Fe(k);
    return k.status === "pending" && (x.added.length > 0 || x.removed.length > 0);
  }, re = (k) => k.conflict || Jt(k).kept.length > 0 || Jt(k).replaced.length > 0, F = ye(() => {
    const k = (m == null ? void 0 : m.entries) ?? [];
    return {
      willChange: k.filter(Ct).length,
      correct: k.filter((x) => x.status === "unchanged").length,
      different: k.filter(re).length,
      hosts: new Set(k.map((x) => x.item.media.id)).size,
      added: [...new Set(k.flatMap((x) => Fe(x).added))],
      removed: [...new Set(k.flatMap((x) => Fe(x).removed))]
    };
  }, [Fn]), Se = ye(
    () => ((m == null ? void 0 : m.entries) ?? []).filter((k) => k.item.media.date).sort((k, x) => k.item.media.date.localeCompare(x.item.media.date)),
    [m]
  ), ht = Be ? uf(at) : null, Pn = (k) => En.keys[ke.actions.findIndex((x) => x.id === k)] ?? "", he = (k) => vr(k, kn, [], a), At = aa(ge.condition) && ge.includeSubtags !== !1 && ge.conditionTagIds.length > 0, et = Se[0], Pe = Se.length > 1 ? Se[Se.length - 1] : void 0, Ze = (k) => `/${Ve}/${k.item.media.id}`, zt = Te ? V[0] : void 0, it = ye(
    () => n ? Qs(
      n,
      Xe.summary ? Ws(bo(Xe.summary, ke.actions)) : []
    ) : [],
    [n, Xe.summary, ke.actions]
  ), pt = Ld(rt, it, a ?? of), Mt = n ?? [], Wt = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: Ct },
    correct: { title: "Occurrences already correct", test: (k) => k.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: re }
  };
  function ot() {
    const k = lf[ge.condition], x = !!k && ge.conditionTagIds.length > 0, W = ge.performerIds.slice(0, zo), pe = String(ke.view.filter.q ?? "").trim(), ae = ge.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ l("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      Bi(ge) ? /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "All performers" }) : ge.targetMode === "selected" ? /* @__PURE__ */ l(me, { children: [
        W.map((Ie, Ce) => /* @__PURE__ */ l("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ r(Pr, { performer: { id: Ie, name: V[Ce] ?? "" } }),
          V[Ce] ?? "…"
        ] }, Ie)),
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
                criteriaDefinitions: xi,
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
        x ? k : Gi[ge.condition],
        x && /* @__PURE__ */ r("span", { className: "dq-batch-chip-tags", children: pr(ge.conditionTagIds.map(lt)).map((Ie) => /* @__PURE__ */ r(Gt, { tag: Ie }, Ie.id)) })
      ] }),
      x && /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: ge.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
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
          "aria-label": `Batch ${fn} filters`,
          children: /* @__PURE__ */ r(
            ra,
            {
              filter: ke.view.filter,
              objectFilter: ft,
              criteriaDefinitions: Ve === "audio" ? hs : Li,
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
  function xn(k, x, W = !0) {
    if (!k.length) return null;
    const pe = /* @__PURE__ */ r("strong", { children: zt || "This performer" }), ae = W ? `Check the earliest and latest ${qt.many} before applying, or narrow the batch with a date filter.` : "", Ie = k.every((Ce) => Ce.tagIds === null && !Ce.mixed.length);
    return /* @__PURE__ */ l("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ r($n, { "aria-hidden": "true" }),
      /* @__PURE__ */ l("div", { children: [
        Ie ? /* @__PURE__ */ l("p", { children: [
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
            eo(Ce).join("; ")
          ] }, Ce.key)) })
        ] }),
        x && et && /* @__PURE__ */ l("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ l("a", { href: Ze(et), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            ea(et, Ve),
            " · ",
            et.item.media.date
          ] }),
          Pe && /* @__PURE__ */ l("a", { href: Ze(Pe), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            ea(Pe, Ve),
            " · ",
            Pe.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function Qt() {
    const k = pt.filter((W) => W.tagIds === null), x = pt.filter((W) => W.tagIds !== null);
    return /* @__PURE__ */ l(me, { children: [
      ot(),
      xn(k, !1),
      /* @__PURE__ */ l("div", { className: `dq-batch-pick${Te ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ l("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ r("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ r("div", { className: "dq-batch-answers", children: Me.map((W, pe) => {
            const ae = Pn(W.id);
            return /* @__PURE__ */ l("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ r(
                "input",
                {
                  type: "checkbox",
                  checked: q.includes(W.id),
                  "aria-labelledby": `${Ae}-answer-${pe}`,
                  "aria-describedby": `${Ae}-effect-${pe}`,
                  onChange: (Ie) => Yn(W.id, Ie.target.checked)
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
                /* @__PURE__ */ r(Ho, { id: `${Ae}-effect-${pe}`, parts: he(W) })
              ] })
            ] }, W.id);
          }) })
        ] }),
        Te && /* @__PURE__ */ l("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ r("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: xn(x, !1, k.length === 0) }),
          /* @__PURE__ */ r(
            Ii,
            {
              ...Xe,
              mediaKind: Ve,
              actions: ke.actions,
              flags: Mt,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function Ln(k) {
    const x = F, W = N && Wo.has(N.group) ? N.group : null, pe = W ? at.filter(Wt[W].test) : [], ae = (Ie) => {
      const Ce = Jt(Ie), Pt = Ce.skipped ? Dr(
        Ie.before.ids,
        Ga(Ie.before.ids, k.action, k.categories, !0).desired
      ) : Fe(Ie), be = !Pt.added.length && !Pt.removed.length;
      return /* @__PURE__ */ l("div", { className: "dq-batch-plan", children: [
        Ce.skipped && /* @__PURE__ */ r("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        be ? !Ce.kept.length && /* @__PURE__ */ r("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ r(Yo, { added: Pt.added, removed: Pt.removed, tag: lt }),
        Ce.kept.map((Ne, ve) => /* @__PURE__ */ l("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          pr(Ne.existing.map(lt)).map((xt) => /* @__PURE__ */ r(Gt, { tag: xt }, xt.id)),
          " ",
          "instead of",
          " ",
          pr(Ne.tagIds.map(lt)).map((xt) => /* @__PURE__ */ r(Gt, { tag: xt }, xt.id))
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
              detail: `in ${x.hosts.toLocaleString()} ${x.hosts === 1 ? fn : `${fn}s`}`,
              pressed: hn("matching"),
              onToggle: () => Ot({ group: "matching" })
            }
          ),
          /* @__PURE__ */ r(
            Zr,
            {
              value: x.willChange,
              label: "will change",
              tone: "add",
              pressed: hn("change"),
              onToggle: () => Ot({ group: "change" })
            }
          ),
          /* @__PURE__ */ r(
            Zr,
            {
              value: x.correct,
              label: "already correct, no write",
              pressed: hn("correct"),
              onToggle: () => Ot({ group: "correct" })
            }
          ),
          /* @__PURE__ */ r(
            Zr,
            {
              value: x.different,
              label: b ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: hn("different"),
              onToggle: () => Ot({ group: "different" })
            }
          )
        ] }),
        pe.length > 0 ? /* @__PURE__ */ r(
          Xo,
          {
            title: Wt[W].title,
            entries: pe,
            mediaKind: Ve,
            resultHeading: "Planned change",
            describe: ae
          }
        ) : at.length > 0 && /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        at.length > 0 && /* @__PURE__ */ l("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ r("span", { children: et ? `Dates ${et.item.media.date}${Pe ? ` to ${Pe.item.media.date}` : ""}` : "No dates" }),
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
          Pe && /* @__PURE__ */ r(
            "a",
            {
              href: Ze(Pe),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${qt.one}, ${Pe.item.media.date}`,
              title: ea(Pe, Ve),
              children: "Open latest"
            }
          ),
          Se.length < at.length && /* @__PURE__ */ l("span", { children: [
            (at.length - Se.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (x.added.length > 0 || x.removed.length > 0) && /* @__PURE__ */ l("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ r("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ r(
            Yo,
            {
              added: x.added,
              removed: x.removed,
              tag: lt,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      x.different > 0 && /* @__PURE__ */ l("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ r("span", { id: `${Ae}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ l(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${Ae}-choice`,
            children: [
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": !b, onClick: () => R(!1), children: "Keep their answer" }),
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": b, onClick: () => R(!0), children: "Replace it" })
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
      ot(),
      xn(pt, !0),
      /* @__PURE__ */ l("div", { className: `dq-batch-cards${Te ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ l("section", { className: "dq-batch-card", "aria-labelledby": `${Ae}-chosen`, children: [
          /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ r("h3", { id: `${Ae}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", disabled: M, onClick: kt, children: "Change" })
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-chosen", children: rt.map((k) => {
            const x = Pn(k.id);
            return /* @__PURE__ */ l("li", { children: [
              /* @__PURE__ */ l("span", { className: "dq-batch-chosen-chip", children: [
                x && /* @__PURE__ */ r(ct, { binding: x, hidden: !0 }),
                k.label
              ] }),
              /* @__PURE__ */ r(Ho, { parts: he(k) })
            ] }, k.id);
          }) })
        ] }),
        Te && /* @__PURE__ */ r(
          Ii,
          {
            ...Xe,
            mediaKind: Ve,
            actions: ke.actions,
            flags: Mt,
            className: "dq-batch-card"
          }
        )
      ] }),
      M ? /* @__PURE__ */ r("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ r("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ r("span", {}) }) }) : m && Ln(m)
    ] });
  }
  function pn(k) {
    const x = _ ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, W = x.kind === "apply" ? at.length - k.counts.pending : x.done, pe = x.kind === "apply" ? at.length : x.total, ae = M ? x.kind === "undo" ? "Undoing batch…" : x.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : x.kind === "undo" ? x.stopped ? "Undo stopped" : "Undo finished" : x.stopped ? "Stopped" : "Finished", Ie = pe ? Math.round(W / pe * 100) : 100, Ce = N && !Wo.has(N.group) ? N.group : null, Pt = (Ne) => Qo.find((ve) => ve.status === Ne).label, be = Ce ? at.filter(
      (Ne) => Ne.status === Ce && (!N.reason || Ne.error === N.reason)
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
            children: /* @__PURE__ */ r("span", { style: { width: `${Ie}%` } })
          }
        ),
        !M && x.kind === "undo" && /* @__PURE__ */ l("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (x.total - k.recorded).toLocaleString(),
          " of",
          " ",
          x.total.toLocaleString(),
          " ",
          x.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ l("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ r("div", { className: "dq-batch-stats", "data-count": "5", children: Qo.map((Ne) => /* @__PURE__ */ r(
          Zr,
          {
            value: k.counts[Ne.status],
            label: Ne.label,
            tone: Ne.tone,
            pressed: hn(Ne.status),
            onToggle: () => Ot({ group: Ne.status })
          },
          Ne.status
        )) }),
        k.reasons.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-batch-reasons", children: k.reasons.map((Ne) => {
          const ve = hn(Ne.status, Ne.error);
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
          Xo,
          {
            title: N.reason ? `${Pt(Ce)}: ${N.reason}` : `${Pt(Ce)} occurrences`,
            entries: be,
            mediaKind: Ve,
            resultHeading: "Result",
            describe: (Ne) => Ne.error ?? Pt(Ne.status)
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
              /* @__PURE__ */ r(Ml, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ l("p", { children: [
          en ? x.stopped || M ? `${k.recorded.toLocaleString()} ${k.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${k.recorded.toLocaleString()} ${k.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${k.recorded === 1 ? "this change" : `these ${k.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function tn() {
    return f === "answers" ? /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !rt.length,
        onClick: Cn,
        children: "Preview all matches"
      },
      "preview"
    ) : f === "preview" ? M ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: Vt, children: "Cancel preview" }, "cancel-preview") : m ? /* @__PURE__ */ l(
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
    ) : M ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: Vt, children: en ? "Cancel undo" : "Cancel run" }, "cancel-run") : en || !ht ? null : /* @__PURE__ */ l(Pi, { children: [
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
  return /* @__PURE__ */ l(Au, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: Q,
        title: "Apply answers to all matching occurrences",
        disabled: t || !Me.length,
        onClick: () => {
          Bt(), i(), u(!0);
        },
        children: [
          /* @__PURE__ */ r(Ao, { "aria-hidden": "true" }),
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
            /* @__PURE__ */ r(Ao, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ r(df, { step: f }),
          /* @__PURE__ */ l(
            "div",
            {
              className: "dq-batch-body",
              ref: T,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": f === "preview" ? "" : void 0,
              "aria-label": `${Ri.find((k) => k.id === f).label} step`,
              children: [
                /* @__PURE__ */ l("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  oe && /* @__PURE__ */ r("p", { role: "status", children: oe }),
                  G && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: G })
                ] }),
                f === "answers" ? Qt() : f === "preview" ? Ft() : pn(ht)
              ]
            }
          ),
          /* @__PURE__ */ l("div", { className: "dq-batch-footer", children: [
            f === "preview" && /* @__PURE__ */ l("button", { type: "button", className: "dq-button", disabled: M, onClick: kt, children: [
              /* @__PURE__ */ r(da, { "aria-hidden": "true" }),
              "Back"
            ] }),
            f === "run" && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: M, onClick: Bt, children: "New batch" }),
            /* @__PURE__ */ r("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: M, onClick: vt, children: "Close" }),
            tn()
          ] })
        ]
      }
    )
  ] });
}
const Pc = "data-quality.description-collapsed.v1";
function hf() {
  try {
    return localStorage.getItem(Pc) === "true";
  } catch {
    return !1;
  }
}
function pf({
  details: e,
  label: t
}) {
  const [n, a] = C(hf), i = Nn(() => {
    a((o) => {
      const s = !o;
      try {
        localStorage.setItem(Pc, String(s));
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ r(yl, { className: "dq-description-body", children: e }) : /* @__PURE__ */ r("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
const mf = (e) => "";
function gf({
  ranking: e,
  busy: t,
  error: n,
  focus: a,
  disabled: i,
  labels: o,
  flagLabel: s = mf,
  onFocus: c,
  onMore: u,
  onRefresh: f
}) {
  var g;
  const d = e ? e.ranked.slice(0, e.limit) : [], m = !!e && (e.ranked.length > e.limit || (((g = e.candidates[e.cursor]) == null ? void 0 : g.total) ?? 0) > 0);
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
          onClick: f,
          children: /* @__PURE__ */ r(Fl, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-queue-list", children: d.map((v) => {
      const w = `${v.count.toLocaleString()} matching ${v.count === 1 ? o.one : o.many}`, q = s(v.tags);
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${v.name}, ${w}${q ? `. ${q}` : ""}`,
          title: q || void 0,
          "aria-current": a === v.id ? "true" : void 0,
          disabled: i,
          onClick: () => c(v.id),
          children: [
            /* @__PURE__ */ r(Pr, { performer: v }),
            /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: v.name }),
            q && /* @__PURE__ */ r($n, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ r("span", { className: "dq-ranked-count", "aria-hidden": "true", children: v.count.toLocaleString() })
          ]
        },
        v.id
      );
    }) }),
    m && !t && !n && /* @__PURE__ */ r(
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
const bf = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], yf = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function wf(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), a = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: a, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function $a(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function vf(e, t) {
  const n = Bi(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", a = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${$a(a, "or")}`,
    includesAll: `has ${$a(a, "and")}`,
    excludes: `has none of ${$a(a, "or")}`,
    excludesAll: `missing ${$a(a, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function Nf({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: a,
  onEditCriteria: i
}) {
  const [o, s] = C(!1), [c, u] = C(null), f = O(null), d = O(null), m = ut(), g = Ur(e.conditionTagIds), v = vf(e, g);
  Rt(() => {
    const b = f.current;
    if (!o || !b) return;
    const R = () => u(wf(b));
    R(), window.addEventListener("resize", R);
    const M = typeof ResizeObserver > "u" ? null : new ResizeObserver(R), j = [b, b.closest(".dq-review-header-trail"), b.closest("header")];
    for (const G of j) G && (M == null || M.observe(G));
    return () => {
      window.removeEventListener("resize", R), M == null || M.disconnect();
    };
  }, [o]), H(() => {
    var R, M;
    if (!o) return;
    const b = (R = d.current) == null ? void 0 : R.querySelector('[aria-pressed="true"]');
    b && !b.disabled ? b.focus() : (M = d.current) == null || M.focus();
  }, [o]);
  const w = () => {
    s(!1), requestAnimationFrame(() => {
      var b;
      return (b = f.current) == null ? void 0 : b.focus();
    });
  }, q = (b) => {
    if (!(b.target instanceof Element && b.target.closest('[role="dialog"]') !== d.current || b.defaultPrevented)) {
      if (b.key === "Escape")
        b.preventDefault(), w();
      else if (b.key === "Tab" && d.current) {
        const M = [...d.current.querySelectorAll(yf)].filter((Z) => Z.closest('[role="dialog"]') === d.current).sort(
          (Z, ne) => Z.compareDocumentPosition(ne) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!M.length) return;
        const j = M[0], G = M[M.length - 1], D = document.activeElement;
        b.shiftKey && (D === j || D === d.current) ? (b.preventDefault(), G.focus()) : !b.shiftKey && D === G && (b.preventDefault(), j.focus());
      }
    }
  }, S = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ l("div", { className: "dq-scope", children: [
    /* @__PURE__ */ l(
      "button",
      {
        ref: f,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        "aria-controls": o ? m : void 0,
        title: v,
        onClick: () => o ? w() : s(!0),
        children: [
          /* @__PURE__ */ r(vs, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-summary", children: v }),
          /* @__PURE__ */ r(ws, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ l(me, { children: [
      /* @__PURE__ */ r("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: w }),
      /* @__PURE__ */ l(
        "div",
        {
          ref: d,
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
          onKeyDown: q,
          children: [
            /* @__PURE__ */ l("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: bf.map(({ mode: b, label: R }) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === b,
                  onClick: () => e.targetMode !== b && a({ targetMode: b }),
                  children: R
                },
                b
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ r(
                Qn,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (b) => a({ performerIds: b }),
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
                    criteriaDefinitions: xi,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (b) => a({ performerFilter: b })
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
                  onChange: (b) => a({ condition: b.target.value }),
                  children: Ki.map((b) => /* @__PURE__ */ r("option", { value: b, children: Gi[b] }, b))
                }
              ),
              S && /* @__PURE__ */ l(me, { children: [
                /* @__PURE__ */ r(
                  Qn,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (b) => a({ conditionTagIds: b }),
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
                        onChange: (b) => a({ includeSubtags: b.target.checked })
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
                        onChange: (b) => a({ hideConfirmedAbsent: b.target.checked })
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
function qf(e) {
  const t = e.occurrence;
  return JSON.stringify([
    je(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function Sf(e, t) {
  const n = je(e) === "audio", a = (s) => ({
    id: s.id,
    name: s.name,
    total: (n ? s.audioCount : s.videoCount) ?? 0,
    tags: (s.tags ?? []).map((c) => ({ id: c.id, name: c.name }))
  }), i = e.occurrence, o = [];
  if (i.targetMode === "selected" && i.performerIds.length > 0)
    for (const s of i.performerIds) {
      const c = await md(
        `/api/performers/${s}`,
        { signal: t }
      );
      c && o.push(a(c));
    }
  else {
    const { _filterExpression: s, ...c } = i.targetMode === "filter" ? i.performerFilter : {};
    for (let u = 1; ; u++) {
      const f = await de(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            Mn({
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
      if (o.push(...f.items.map(a)), u * 1e3 >= f.totalCount || !f.items.length) break;
    }
  }
  return o.sort((s, c) => c.total - s.total || s.id - c.id);
}
function xc(e, t, n) {
  const a = po(e, [t]);
  return yd(a, a.view.filter, n);
}
function Lc(e, t) {
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
async function Ef(e, t, n, a, i = {}) {
  const o = Pa(e), s = qf(e), c = Cc(e.occurrence), u = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await Sf(e, a),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: f } = u, d = [...u.ranked];
  let m = u.cursor, g = !1;
  const v = (w) => ({
    ...u,
    cursor: m,
    ranked: [...d],
    limit: n,
    complete: !w && $i(f, m, d, n),
    ...w ? { partial: w } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var w;
        for (; !g && !$i(f, m, d, n); ) {
          a.throwIfAborted();
          const q = f[m++], S = await xc(e, q.id, a);
          S > 0 && Lc(d, { ...q, count: S }), (w = i.onProgress) == null || w.call(i, v(!0));
        }
      })
    );
  } catch (w) {
    throw g = !0, w;
  }
  return a.throwIfAborted(), v(!1);
}
function kf(e, t, n) {
  const a = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || a < 0 || a >= e.cursor) return e;
  const i = e.ranked.filter((o) => o.id !== t);
  return n > 0 && Lc(i, { ...e.candidates[a], count: n }), {
    ...e,
    ranked: i,
    complete: $i(e.candidates, e.cursor, i, e.limit)
  };
}
const Oi = /* @__PURE__ */ new Map();
function Cf(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function Dc(e, t) {
  const n = Cf(t);
  return Oi.set(e, n), n;
}
function Af(e) {
  const [t, n] = C(null);
  if (H(() => {
    if (e === null || Oi.has(e)) return;
    const a = new AbortController();
    return de(`/api/performers/${e}`, { signal: a.signal }).then(
      (i) => {
        const o = Dc(e, i == null ? void 0 : i.tags);
        a.signal.aborted || n({ id: e, tags: o });
      },
      () => {
      }
    ), () => a.abort();
  }, [e]), e !== null)
    return Oi.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
function br(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => br(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, a = t, i = Object.keys(n).sort(), o = Object.keys(a).sort();
  return i.length === o.length && i.every(
    (s, c) => s === o[c] && br(n[s], a[s])
  );
}
function Tf(e) {
  var c, u, f;
  const [t, n] = C({}), [a, i] = C(""), o = (((c = e == null ? void 0 : e.presentation) == null ? void 0 : c.annotations) ?? []).includes("tags") ? ((u = e == null ? void 0 : e.presentation) == null ? void 0 : u.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...o,
      ...((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.binParents) ?? []
    ])
  ]);
  return H(() => {
    let d = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(s).map(
        async (m) => [m, await Ja([m])]
      )
    ).then((m) => {
      d && n(Object.fromEntries(m));
    }).catch(() => {
      d && i(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      d = !1;
    };
  }, [s]), { ids: t, error: a };
}
function If(e, t, n) {
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
function Rf({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: a,
  disabled: i,
  onToggle: o
}) {
  var w;
  const s = ((w = t.presentation) == null ? void 0 : w.binParents) ?? [], c = new Set(
    s.flatMap((q) => (a[q] ?? []).filter((S) => S !== q))
  ), u = s.every((q) => a[q]), f = ma(t.view.objectFilter, n).bins.filter(
    (q) => !u || c.has(q)
  ), d = /* @__PURE__ */ new Map();
  for (const q of e)
    for (const S of q.tags ?? [])
      if (c.has(S.id)) {
        const b = d.get(S.id) ?? { name: S.name, count: 0 };
        b.count++, d.set(S.id, b);
      }
  const m = f.filter((q) => !d.has(q)), g = Ur(m);
  for (const q of m)
    d.set(q, {
      name: g[q] === void 0 ? "…" : g[q] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const v = [...d].sort((q, S) => q[1].name.localeCompare(S[1].name));
  return /* @__PURE__ */ l("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ r("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    v.map(([q, S]) => {
      const b = f.includes(q);
      return /* @__PURE__ */ l(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": b,
          title: b ? `Show every video again, not only ${S.name}` : `Show only videos tagged ${S.name}`,
          disabled: i,
          onClick: () => o(q),
          children: [
            b && /* @__PURE__ */ r(Ka, { "aria-hidden": "true" }),
            S.name,
            " ",
            /* @__PURE__ */ r("span", { className: "dq-bin-count", children: S.count })
          ]
        },
        q
      );
    }),
    !v.length && /* @__PURE__ */ r("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function fr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function $f(e) {
  if (!fr(e) || Object.keys(e).length !== 1 || !fr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !fr(t.tagsCriterion)) return null;
  const { value: n, modifier: a, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && a === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function ma(e, t) {
  let n = e;
  const a = [];
  for (; ; ) {
    if (t && br(n, t)) {
      n = t;
      break;
    }
    const i = Object.keys(n);
    if (i.length !== 1 || i[0] !== "_filterExpression") break;
    const o = n._filterExpression;
    if (!fr(o) || o.operator !== "AND" || !Array.isArray(o.children))
      break;
    const s = o.children, c = $f(s.at(-1));
    if (c == null || s.length > 3) break;
    let u = {}, f = null, d = !0;
    for (const [m, g] of s.slice(0, -1).entries())
      !fr(g) || Object.keys(g).length !== 1 ? d = !1 : m === 0 && fr(g.filter) && Object.keys(g.filter).length ? u = g.filter : !f && fr(g.group) ? f = g.group : d = !1;
    if (!d) break;
    a.unshift(c), n = f ? { ...u, _filterExpression: f } : u;
  }
  return { base: n, bins: a };
}
function Of(e, t, n) {
  const { base: a, bins: i } = ma(e.view.objectFilter, n);
  return (i.includes(t) ? i.filter((s) => s !== t) : [...i, t]).reduce(Mf, { ...e, view: { ...e.view, objectFilter: a } });
}
function Mf(e, t) {
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
const Wa = [
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
], Ff = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function yr(e) {
  const t = Re(e) ? e.occurrence : void 0;
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
function Zo(e) {
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
  if (Re(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!Wa.some((c) => c !== "performer" && t.has(c))) {
    const c = yr(e);
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
      const f = u.lastIndexOf(":");
      return { key: u.slice(0, f), direction: u.slice(f + 1) };
    });
    if (c.some((u) => !u.key || !["asc", "desc"].includes(u.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = c, i.sort = c[0].key, i.direction = c[0].direction;
  }
  let o;
  if (Re(e) && (o = {
    ...Ff,
    ...Zo(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !Ki.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Ut(i, je(e)),
      objectFilter: Zo(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const es = { dataQualityOpenedFromList: !0 };
function _c() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function jc(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...es }, "", e) : window.history.replaceState(_c() ? { ...es } : null, "", e);
}
function na(e, t) {
  const n = new URLSearchParams(window.location.search);
  Wa.forEach((a) => n.delete(a)), n.set("review", e);
  for (const a of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[a] !== void 0 && n.set(a, String(t.filter[a]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((a) => `${a.key}:${a.direction}`).join(",")
  ), n.set("filters", JSON.stringify(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), jc(`${window.location.pathname}?${n}${window.location.hash}`);
}
function qn(e, t) {
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
function mr(e) {
  const t = e;
  return qn(t, yr(t));
}
function ts(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !br(
    JSON.parse(Vn(qn(e, t))),
    JSON.parse(Vn(qn(e, yr(e))))
  );
}
function Uc(e, t) {
  if (_e(e) !== "video") return e;
  const { base: n, bins: a } = ma(e.view.objectFilter, t.view.objectFilter);
  return a.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function Oa(e, t) {
  if (_e(e) !== "video") return t;
  const { base: n, bins: a } = ma(t.objectFilter, e.view.objectFilter);
  return a.length ? { ...t, objectFilter: n } : t;
}
function ns(e, t) {
  return !t || !Re(e) ? e : {
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
const Zt = (e) => e instanceof Error ? e.message : "Request failed.", di = 50, Pf = [], rs = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function xf(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? ql(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? gs(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Lf({ media: e, kind: t }) {
  const [n, a] = C(!1);
  return /* @__PURE__ */ r("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ r(qs, {}) : /* @__PURE__ */ r(Ba, {}) : /* @__PURE__ */ r(
    "img",
    {
      src: wi(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => a(!0)
    }
  ) });
}
function Df({
  tags: e,
  preview: t,
  showPreview: n,
  trees: a,
  actionTagIds: i,
  label: o
}) {
  const s = io(t), c = n ? s : null, u = e == null ? void 0 : e.absent, f = ha(
    ye(() => [...i, ...u ?? []], [i, u])
  ), d = (G) => f[G] ?? { id: G, name: f[G] === void 0 ? "…" : "Unavailable tag" }, m = (G) => pr(G.map(d)), g = c && e ? Zi(c, e, a) : null, v = e ? $d(e) : [], w = new Set(v.map((G) => G.id)), q = new Set(g == null ? void 0 : g.removed), S = new Set(g == null ? void 0 : g.markedAbsent), b = new Set(g == null ? void 0 : g.absenceCleared), R = /* @__PURE__ */ l("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ r(xa, { "aria-hidden": "true" }),
    "absent"
  ] }), M = m((g == null ? void 0 : g.added) ?? []), j = m(((g == null ? void 0 : g.markedAbsent) ?? []).filter((G) => !w.has(G)));
  return /* @__PURE__ */ l("section", { className: "dq-panel-section", "aria-label": o, children: [
    /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ l(me, { children: [
      v.length || M.length || j.length ? /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        v.map(
          (G) => q.has(G.id) ? /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ l("del", { children: [
              "− ",
              /* @__PURE__ */ r(Gt, { tag: G })
            ] }),
            S.has(G.id) && R
          ] }, G.id) : /* @__PURE__ */ r("li", { className: "dq-tag", children: /* @__PURE__ */ r(Gt, { tag: G }) }, G.id)
        ),
        M.map((G) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
          "+ ",
          /* @__PURE__ */ r(Gt, { tag: G })
        ] }) }, `added-${G.id}`)),
        j.map((G) => /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ r("ins", { children: /* @__PURE__ */ r(Gt, { tag: G }) }),
          R
        ] }, `absent-${G.id}`))
      ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ l(me, { children: [
        /* @__PURE__ */ r("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: m(e.absent).map((G) => /* @__PURE__ */ l(
          "li",
          {
            className: `dq-tag dq-tag-absent${b.has(G.id) ? " dq-tag-removed" : ""}`,
            children: [
              /* @__PURE__ */ r(xa, { "aria-hidden": "true" }),
              b.has(G.id) ? /* @__PURE__ */ l("del", { children: [
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
function _f({ entries: e }) {
  return /* @__PURE__ */ r("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ l("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ r("span", { className: "dq-attention-category", children: t.name }),
    eo(t).map((n) => /* @__PURE__ */ l("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ r($n, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function jf({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: a,
  onSaveDefaults: i,
  editRequest: o = 0,
  onEditRequestHandled: s,
  pageControls: c,
  stayOnTap: u,
  onStayOnTapChange: f
}) {
  var Tr;
  const d = je(e), m = Sn(d), g = d === "audio" ? "Audio" : "Scene", v = (p) => {
    var E;
    return p.title || ((E = p.files[0]) == null ? void 0 : E.basename) || g;
  }, w = (p) => `${p.occurrence ? `${p.occurrence.performer.name} — ` : ""}${v(p.media)}`, q = O(null), S = O("");
  if (!q.current)
    try {
      q.current = Mi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (p) {
      S.current = Zt(p), q.current = { query: yr(e), startAtEnd: !1 };
    }
  const [b, R] = C(null), [M, j] = C(""), G = O(null), D = O(null), Z = O(null), ne = O(null), [oe, se] = C(!!S.current), _ = O(0), [U, N] = C(q.current.query), A = O(U);
  A.current = U;
  const [V, J] = C(0), ue = O(q.current.startAtEnd), [ce, B] = C([]), [T, Q] = C(null), z = O(null), [te, P] = C(null), [fe, Oe] = C(0), Ee = ye(() => {
    if (!T) return null;
    const p = ce.findIndex((E) => E.key === T.key);
    return p < 0 ? null : ce.slice(p + 1).find((E) => E.media.id !== T.media.id) ?? null;
  }, [T, ce]), [Ye, Ae] = C(0), [Be, en] = C(!1), [ke, En] = C(!1), ge = O(!1), Ve = O(!0), qt = O(null);
  H(() => (Ve.current = !0, () => {
    Ve.current = !1;
  }), []);
  const [fn, Me] = C(S.current), [rt, Te] = C(""), [Xe, Kt] = C(null), [$e, kn] = C(!1), [lt, $t] = C([]), ft = O([]), Bt = O(null), vt = O(null), Yn = O(null);
  H(() => {
    var p, E;
    $e && ((E = (p = Yn.current) == null ? void 0 : p.querySelector("input")) == null || E.focus());
  }, [$e]);
  const [kt, Cn] = C(!1), [Vt, Ot] = C(!1), hn = pa(), [we, St] = C(!1), at = u ?? we, Fn = f ?? St;
  H(() => {
    if (Be || kt || !vt.current) return;
    const p = requestAnimationFrame(() => {
      if (document.querySelector(rs)) return;
      const E = vt.current;
      vt.current = null;
      const I = document.activeElement;
      I && I !== document.body || E != null && E.isConnected && !E.disabled && E.focus();
    });
    return () => cancelAnimationFrame(p);
  }, [Be, kt, V]);
  const [Jt, Fe] = C([]), [Ct, re] = C({}), F = O(null), Se = O(0), [ht, Pn] = C({});
  H(() => {
    let p = !0;
    return Promise.all(
      uo(U.objectFilter).map(
        async (E) => [
          String(E),
          (await de(`/api/tags/${E}`)).name
        ]
      )
    ).then((E) => {
      p && Pn(Object.fromEntries(E));
    }).catch(() => {
    }), () => {
      p = !1;
    };
  }, [U.objectFilter]);
  const he = ye(
    () => fo(U.objectFilter, ht),
    [ht, U.objectFilter]
  ), At = O(0), et = O(e);
  et.current = e;
  const Pe = b ?? e, Ze = ye(
    () => qn(Pe, U),
    [Pe, U]
  ), zt = ye(
    () => ns(Ze, U.performerFocus),
    [Ze, U.performerFocus]
  ), it = O(zt);
  it.current = zt;
  const pt = O(Ze);
  pt.current = Ze;
  const [Mt, Wt] = C("items"), [ot, xn] = C(null), Qt = O(null), Ln = O("");
  function Ft(p) {
    const E = typeof p == "function" ? p(Qt.current) : p;
    Qt.current = E, xn(E);
  }
  const [pn, tn] = C(!1), [k, x] = C(null), W = O(null), pe = Re(Ze) ? Pa(Ze) : "", [ae, Ie] = C(0), [Ce, Pt] = C(null);
  H(() => () => {
    var p;
    return (p = W.current) == null ? void 0 : p.controller.abort();
  }, []), H(() => {
    const p = W.current;
    !p || p.signature === pe || (p.controller.abort(), W.current = null, tn(!1));
  }, [pe]), H(() => {
    var I;
    const p = Qt.current;
    if (Mt !== "performers" || !pe || ((I = W.current) == null ? void 0 : I.signature) === pe || Ln.current === pe || (p == null ? void 0 : p.signature) === pe && p.complete)
      return;
    const E = (p == null ? void 0 : p.signature) === pe ? p : null;
    Sr(p, (E == null ? void 0 : E.limit) ?? di);
  }, [Mt, pe, ot, k, pn]);
  const be = U.performerFocus;
  H(() => {
    if (!be) {
      Pt(null);
      return;
    }
    let p = !0;
    return de(`/api/performers/${be}`).then((E) => {
      const I = Dc(be, E.tags);
      p && Pt({ id: be, name: E.name, tags: I });
    }).catch(() => {
    }), () => {
      p = !1;
    };
  }, [be]);
  const Ne = JSON.stringify(
    Re(Ze) ? Cs(Ze.occurrence) : []
  ), ve = ye(() => JSON.parse(Ne), [Ne]), xt = ye(() => Pd(ve), [ve]), An = Bs(xt), Gr = ha(xt), Kr = (p) => {
    var E;
    return ((E = Gr[p]) == null ? void 0 : E.name) ?? (Gr[p] === null ? "Unavailable tag" : "…");
  }, Br = (p) => ({
    name: Kr(p),
    tagIds: An.get(p) ?? [p],
    resolved: An.has(p)
  }), Nt = Fc(
    Re(Ze) ? Ze : null,
    be ?? null,
    ae
  ), Ht = ts(e, U), Xn = ts(e, Oa(e, U)), mt = ke || Be || $e, mn = Number(U.filter.page);
  function Le(p, E = !1) {
    ge.current || (S.current = "", ue.current = E, A.current = p, N(p), Ae(0), en(!0), E || na(e.id, p), J((I) => I + 1));
  }
  function tt() {
    if (ge.current = !1, En(!1), Ve.current && qt.current) {
      const p = qt.current;
      qt.current = null, Le(p.query, p.startAtEnd);
    }
  }
  H(() => {
    const p = () => {
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
    return window.addEventListener("popstate", p), () => window.removeEventListener("popstate", p);
  }, [e.id]), H(() => (a(ke || Be || $e || !!b), () => a(!1)), [ke, Be, $e, !!b, a]);
  async function gt(p, E, I) {
    if (Re(p)) {
      const le = await Ac(
        p,
        F.current,
        E,
        I
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
      p,
      { ...p.view.filter, page: E },
      I
    );
    return {
      items: X.items.map((le) => ({ key: String(le.id), media: le })),
      totalCount: X.totalCount
    };
  }
  function bt(p, E, I, X = !1, le = !1) {
    if (!Ve.current || qt.current) return;
    se(!0), B(
      le ? p.items : li(p.items, A.current.startFrom === "end")
    ), Ae(p.totalCount), Lt(I, X);
    const ie = {
      ...A.current,
      filter: { ...A.current.filter, page: E }
    };
    A.current = ie, N(ie), na(e.id, ie);
  }
  function Lt(p, E = !1) {
    (p == null ? void 0 : p.key) !== (T == null ? void 0 : T.key) && (z.current = null), (p == null ? void 0 : p.media.id) !== (T == null ? void 0 : T.media.id) && P(E && p ? p.media.id : null), Q(p);
  }
  H(() => {
    if (S.current) return;
    const p = new AbortController();
    ne.current = p;
    const E = ++At.current;
    return en(!0), Me(""), Te(""), z.current = null, P(null), Q(null), B([]), kn(!1), (async () => {
      const I = ns(
        qn(et.current, A.current),
        A.current.performerFocus
      );
      F.current = Re(I) ? await ho(I, p.signal) : null;
      let X = Number(I.view.filter.page), le = await gt(I, X, p.signal);
      const ie = Math.max(
        1,
        Math.ceil(le.totalCount / Number(I.view.filter.perPage))
      );
      (ue.current || X > ie) && (X = ie, le = await gt(I, X, p.signal)), ue.current = !1;
      const Qe = I.view.startFrom === "end" ? -1 : 1;
      for (; Re(I) && !le.items.length && X + Qe >= 1 && X + Qe <= ie && !p.signal.aborted; )
        X += Qe, le = await gt(I, X, p.signal);
      if (E !== At.current || p.signal.aborted) return;
      const It = li(le.items, I.view.startFrom === "end");
      bt(le, X, It[0] ?? null);
    })().catch((I) => {
      !p.signal.aborted && E === At.current && Me(Zt(I));
    }).finally(() => {
      !p.signal.aborted && E === At.current && (se(!0), en(!1));
    }), () => {
      p.abort(), At.current++;
    };
  }, [V, e.id]), H(() => {
    if (Kt(null), !T) return;
    let p = !0;
    return un(d, T).then((E) => {
      p && (Kt(E), Fe(
        Re(e) ? E.ids.filter((I) => e.occurrence.tagIds.includes(I)) : []
      ));
    }).catch((E) => {
      p && Me(`Could not load current tags. ${Zt(E)}`);
    }), () => {
      p = !1;
    };
  }, [T]), H(() => {
    if (!Re(e) || e.actions.length)
      return;
    let p = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (E) => [
          E,
          (await de(`/api/tags/${E}`)).name
        ]
      )
    ).then((E) => {
      p && re(Object.fromEntries(E));
    }).catch((E) => {
      p && Me(Zt(E));
    }), () => {
      p = !1;
    };
  }, [e]);
  async function Dt(p = !1, E = !1, I = !1) {
    var vn;
    if (!T) return;
    const X = ce.findIndex((Je) => Je.key === T.key), le = U.startFrom === "end" ? -1 : 1, ie = ((vn = z.current) == null ? void 0 : vn.key) === T.key ? z.current : { key: T.key, page: mn, before: ce.slice(0, X + 1).map((Je) => Je.key), after: ce.slice(X + 1).map((Je) => Je.key) }, Qe = new Set(ie.after), It = new Set(ie.before), Ge = ce.find((Je) => {
      var cn;
      return Qe.has(Je.key) || (le === 1 || mn < ie.page) && ((cn = z.current) == null ? void 0 : cn.key) === T.key && !It.has(Je.key);
    });
    if (!p && Ge) {
      Lt(Ge, I);
      return;
    }
    const yt = p ? It : new Set(ce.map((Je) => Je.key)), st = 1100 - (Date.now() - Se.current);
    st > 0 && await new Promise((Je) => window.setTimeout(Je, st));
    let Ke = le === -1 && !p ? Math.max(1, mn - 1) : mn;
    for (; Ve.current && !qt.current; ) {
      let Je = await gt(zt, Ke);
      const cn = Math.max(
        1,
        Math.ceil(Je.totalCount / Number(U.filter.perPage))
      );
      Ke > cn && (Ke = cn, Je = await gt(zt, Ke));
      const _t = li(Je.items, le === -1), Hr = new Map(_t.map((Et) => [Et.key, Et])), qa = p ? ie.after.flatMap((Et) => {
        const Rr = Hr.get(Et);
        return Rr ? [Rr] : [];
      }) : [], Sa = new Set(qa.map((Et) => Et.key)), lr = p ? {
        ...Je,
        items: [
          ...qa,
          ..._t.filter(
            (Et) => Et.key !== T.key && !Sa.has(Et.key)
          )
        ]
      } : Je;
      if (E) {
        z.current = ie, bt(lr, Ke, T, !1, p);
        return;
      }
      const Ir = le === -1 && mn === 1 && !p ? void 0 : lr.items.find(
        (Et) => !yt.has(Et.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(p && le === -1 && Ke === ie.page) || Qe.has(Et.key))
      );
      if (Ir || (le === -1 ? Ke <= 1 : Ke >= cn)) {
        bt(
          lr,
          Ke,
          Ir ?? null,
          I,
          p
        ), Ir || Te(
          Je.totalCount ? `Reached the end in this direction. Matching items remain available from the ${m.queue} pages.` : `No matching ${m.many}.`
        );
        return;
      }
      Ke += le;
    }
  }
  async function nn(p, E = !1, I = !1, X = !1) {
    if (b || !T || ge.current || Be || $e && !I)
      return;
    const le = I || X || !!(p != null && p.steps.length);
    if (le && (!t || !Xe) || p && Wn(p) && !n) return;
    const ie = !E && !I && !X && le && p !== void 0 && Xe !== null && xo(e) && qi(Ni(e.actions, Md(p, Xe, _n))).length > 0;
    ge.current = !0, En(!0), Me(""), Te("");
    const Qe = ce.findIndex((st) => st.key === T.key), It = le && !E && !ie && Qe >= 0 ? ce[Qe + 1] ?? null : null;
    It && (B(
      (st) => st.filter((Ke) => Ke.key !== T.key)
    ), Lt(It, !0));
    let Ge = !1, yt = [];
    try {
      if (le) {
        const st = await un(d, T);
        if (p)
          await Hu(zt, T, p);
        else {
          const vn = X && Re(e) ? e.occurrence.tagIds.filter((_t) => st.ids.includes(_t)) : ft.current, cn = Dr(vn, X ? Jt : lt);
          await go(zt, T, cn);
        }
        Se.current = Date.now();
        const Ke = await un(d, T);
        It || Kt(Ke), Ge = !0, kn(!1), ie && (yt = qi(Ni(e.actions, Ke))), Te(
          yt.length ? `Tags saved. Staying until answered: ${yt.map((vn) => vn.name).join(", ")}.` : "Tags saved."
        ), T.occurrence && (ba(T.occurrence.performer.id), Ie((vn) => vn + 1));
      }
      if (!Ve.current || qt.current) return;
      le ? yt.length || await Dt(!0, E, !E) : E || await Dt(), E && I && requestAnimationFrame(() => {
        var st;
        return (st = Bt.current) == null ? void 0 : st.focus();
      });
    } catch (st) {
      if (Me(
        Ge ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Zt(st)}` : le ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Zt(st)}` : `Could not advance. ${Zt(st)}`
      ), le && !Ge) {
        It && (B(ce), P(null), Oe((Ke) => Ke + 1), Q(T)), Se.current = Date.now();
        try {
          Kt(await un(d, T));
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
  const Zn = !$e && !b && !kt && !Vt && (T != null || Be || ke);
  to({
    surface: "local",
    enabled: Zn,
    actions: e.actions,
    onAction: (p, E) => {
      const I = e.actions[p];
      I && nn(I, E);
    },
    onFind: () => Ot(!0)
  });
  const rn = (p) => ke || Be || !Xe || !!b || !t && p.steps.length > 0 || !n && Wn(p);
  function Yt() {
    !i || b || ge.current || $e || (Z.current = document.activeElement, D.current = {
      error: fn,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(A.current),
      items: ce,
      current: T,
      total: Ye,
      targets: F.current,
      stayedCursor: z.current
    }, R(structuredClone(e)), j(""), Te(""), Me(""));
  }
  H(() => {
    if (!o) {
      _.current = 0;
      return;
    }
    o !== _.current && oe && !Be && (_.current = o, Yt(), s == null || s());
  }, [o, Be, oe]);
  function Nr() {
    R(null), j(""), requestAnimationFrame(() => {
      const p = Z.current;
      p != null && p.isConnected && p !== document.body && p.focus();
    });
  }
  function qr() {
    var E;
    const p = D.current;
    !p || ke || ((E = ne.current) == null || E.abort(), At.current++, A.current = p.query, N(p.query), B(p.items), Q(p.current), Ae(p.total), F.current = p.targets, z.current = p.stayedCursor, en(!1), Me(p.error), Te(""), window.history.replaceState(window.history.state, "", p.url), Nr());
  }
  async function ga() {
    if (!b || !i || ge.current) return;
    const p = qn(
      { ...b, name: b.name.trim() },
      Oa(et.current, A.current)
    ), E = oa(p);
    if (E) {
      j(E);
      return;
    }
    ge.current = !0, En(!0), j("");
    try {
      if (await i(p) === !1) throw new Error("Could not save review.");
      Nr(), Te("Review saved.");
    } catch (I) {
      j(
        "Could not save review. Your edits are still open. " + Zt(I)
      );
    } finally {
      tt();
    }
  }
  async function xe() {
    if (!i || ge.current) return;
    const p = Oa(et.current, A.current), E = qn(et.current, {
      ...p,
      filter: { ...p.filter, page: 1 }
    });
    ge.current = !0, En(!0), Me("");
    try {
      if (await i(E) === !1) throw new Error("Could not save review.");
      Te("Queue saved to this review.");
    } catch (I) {
      Me("Could not save queue. " + Zt(I));
    } finally {
      tt();
    }
  }
  const dt = U.performerScope, gn = (p) => {
    const { performerFocus: E, ...I } = A.current, X = E && !("targetMode" in p || "performerIds" in p || "performerFilter" in p);
    Le({
      ...I,
      ...X ? { performerFocus: E } : {},
      filter: { ...I.filter, page: 1 },
      performerScope: { ...dt, ...p }
    });
  };
  async function Sr(p, E) {
    var le;
    const I = pt.current;
    if (!Re(I)) return;
    (le = W.current) == null || le.controller.abort();
    const X = {
      signature: Pa(I),
      controller: new AbortController()
    };
    W.current = X, Ln.current = "", tn(!0), x(null);
    try {
      const ie = await Ef(I, p, E, X.controller.signal, {
        onProgress: (Qe) => {
          W.current === X && Ft(Qe);
        }
      });
      W.current === X && Ft(ie);
    } catch (ie) {
      W.current === X && !X.controller.signal.aborted && (Ln.current = X.signature, x({ signature: X.signature, message: Zt(ie) }));
    } finally {
      W.current === X && (W.current = null, tn(!1));
    }
  }
  function bn() {
    var p;
    (p = W.current) == null || p.controller.abort(), W.current = null, tn(!1), Ft((E) => E && { ...E, partial: !0, complete: !1 });
  }
  async function ba(p) {
    var le;
    const E = pt.current;
    if (!Re(E)) return;
    if (W.current) {
      bn();
      return;
    }
    const I = Pa(E);
    if (((le = Qt.current) == null ? void 0 : le.signature) !== I || Qt.current.partial) return;
    const X = 1100 - (Date.now() - Se.current);
    X > 0 && await new Promise((ie) => window.setTimeout(ie, X));
    try {
      const ie = await xc(E, p);
      if (W.current) {
        bn();
        return;
      }
      Ft(
        (Qe) => (Qe == null ? void 0 : Qe.signature) === I ? kf(Qe, p, ie) : Qe
      );
    } catch {
      Ft(
        (ie) => (ie == null ? void 0 : ie.signature) === I ? { ...ie, partial: !0, complete: !1 } : ie
      );
    }
  }
  const er = U.performerFocus ? ot == null ? void 0 : ot.candidates.find((p) => p.id === U.performerFocus) : void 0, nt = Ce && Ce.id === U.performerFocus ? { ...Ce, flags: ur(ve, Ce.tags) } : er ? { ...er, flags: ur(ve, er.tags) } : null, an = (p) => {
    if ((Ce == null ? void 0 : Ce.id) === p)
      return ur(ve, Ce.tags);
    const E = ot == null ? void 0 : ot.candidates.find((I) => I.id === p);
    return E ? ur(ve, E.tags) : void 0;
  }, on = ((Tr = T == null ? void 0 : T.occurrence) == null ? void 0 : Tr.performer.id) ?? null, yn = on === null ? void 0 : an(on), De = Af(
    ve.length > 0 && on !== null && on !== U.performerFocus && yn === void 0 ? on : null
  ), Vr = yn ?? (De ? ur(ve, De) : []), ya = Nt.summary && U.performerFocus ? Ws(bo(Nt.summary, Pe.actions)) : [], tr = Lo(ve, (nt == null ? void 0 : nt.flags) ?? [], Br), nr = Qs(
    Lo(ve, Vr, Br),
    on !== null && on === U.performerFocus ? ya : []
  ), Er = JSON.stringify(nr), rr = ye(() => nr, [Er]), wa = JSON.stringify(tr), Dn = ye(() => tr, [wa]), kr = (p) => Ud(ve, p, Kr);
  function ar(p) {
    if (ge.current) return;
    const E = {
      ...A.current,
      performerFocus: p,
      filter: { ...A.current.filter, page: 1 }
    };
    Le(E, E.startFrom === "end"), Wt("items");
  }
  function ir() {
    const { performerFocus: p, ...E } = A.current;
    Le(
      { ...E, filter: { ...E.filter, page: 1 } },
      E.startFrom === "end"
    );
  }
  const Cr = O(null);
  Cr.current ?? (Cr.current = ac());
  const Jr = Cr.current, _n = Ks(Pe.actions), Qa = ye(
    () => Pe.actions.flatMap((p) => p.steps.flatMap((E) => E.tagIds)),
    [Pe.actions]
  ), va = O(null);
  H(() => {
    const p = va.current, E = p == null ? void 0 : p.querySelector('[aria-current="true"]');
    if (!p || !E) return;
    const I = p.getBoundingClientRect(), X = E.getBoundingClientRect();
    X.top < I.top ? p.scrollTop -= I.top - X.top : X.bottom > I.bottom && (p.scrollTop += X.bottom - I.bottom);
  }, [T == null ? void 0 : T.key, Mt]);
  const Ar = O(null), zr = O(null);
  H(() => {
    var I, X;
    const p = zr.current;
    if (!p) return;
    zr.current = null;
    const E = [...((I = Ar.current) == null ? void 0 : I.querySelectorAll(".dq-partner")) ?? []];
    (X = E.find((le) => le.dataset.partnerKey === p) ?? E[0]) == null || X.focus();
  }, [T == null ? void 0 : T.key]);
  const Tt = ke || Be || $e || !!b, wn = ye(
    () => b ? qn(b, Oa(e, U)) : null,
    [b, e, U]
  ), or = ye(
    () => wn != null && xr(mr(wn)) !== xr(mr(e)),
    [wn, e]
  );
  function jn() {
    T ? un(d, T).then(Kt).catch((p) => Me(Zt(p))) : Le(A.current);
  }
  const Un = fn ? /* @__PURE__ */ l("p", { role: "alert", children: [
    fn,
    " ",
    /* @__PURE__ */ r("button", { type: "button", disabled: ke, onClick: jn, children: T ? "Reload tags" : "Retry queue" })
  ] }) : null, sn = ke || Be || T != null && !Xe, sr = Math.max(1, Number(U.filter.perPage) || 1), cr = O(1);
  Be || (cr.current = Math.max(1, Math.ceil(Ye / sr)));
  const Wr = cr.current, Na = dt && T ? ce.filter(
    (p) => p.media.id === T.media.id && p.key !== T.key
  ) : [], Ha = (p) => {
    var E;
    return p.title || ((E = p.files[0]) == null ? void 0 : E.basename) || `${d === "audio" ? "Audio" : "Video"} ${p.id}`;
  }, Qr = T ? xf(T.media, d) : "";
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-review-workspace${d === "audio" ? " dq-audio" : ""}`,
      "aria-label": dt ? d === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : d === "audio" ? "Audio review" : "Video review",
      onClickCapture: (p) => {
        var X;
        const E = p.target instanceof Element ? p.target.closest("button") : null, I = (E == null ? void 0 : E.getAttribute("aria-label")) ?? ((X = E == null ? void 0 : E.textContent) == null ? void 0 : X.trim()) ?? "";
        E && !E.closest(rs) && /^(Filters|Edit filter:|Edit criteria)/.test(I) && (vt.current = E);
      },
      children: [
        /* @__PURE__ */ r(
          Nc,
          {
            name: e.name,
            description: e.description,
            entityType: _e(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: Tt || !!(c != null && c.busy),
            onEdit: b ? () => {
              var p;
              return (p = G.current) == null ? void 0 : p.focus();
            } : Yt,
            editDisabled: !b && (Tt || !i || !!(c != null && c.busy)),
            editing: !!b,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: ke || $e, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: d === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ r(
                  ra,
                  {
                    filter: U.filter,
                    objectFilter: he,
                    criteriaDefinitions: d === "audio" ? hs : Li,
                    customFieldEntityType: d,
                    totalCount: Ye,
                    sortOptions: d === "audio" ? wl : ps,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(
                      qc,
                      {
                        page: Math.min(Math.max(1, mn || 1), Wr),
                        pages: Wr,
                        onPage: (p) => Le({
                          ...A.current,
                          filter: Ut(
                            { ...A.current.filter, page: p },
                            d
                          )
                        })
                      }
                    ),
                    onFilterChange: (p) => {
                      (p.sort !== A.current.filter.sort || p.direction !== A.current.filter.direction) && (p = { ...p, sorts: void 0 }), Le({
                        ...A.current,
                        filter: Ut(p, d)
                      });
                    },
                    onObjectFilterChange: (p) => {
                      Le({
                        ...A.current,
                        objectFilter: Ec(
                          p,
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
              dt && /* @__PURE__ */ r(
                Nf,
                {
                  scope: dt,
                  disabled: ke || $e,
                  editing: !!b,
                  onChange: gn,
                  onEditCriteria: () => Cn(!0)
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ r(
                Sc,
                {
                  mode: "single",
                  disabled: Tt || !!c.busy,
                  onChange: () => {
                    var p;
                    return (p = c.onGrid) == null ? void 0 : p.call(c);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ l(me, { children: [
              Re(zt) && t && /* @__PURE__ */ r(
                ff,
                {
                  review: zt,
                  disabled: mt || !!b,
                  performerAttention: U.performerFocus ? Dn : void 0,
                  trees: _n,
                  onOpen: () => {
                    ge.current = !0, En(!0);
                  },
                  onWrite: () => {
                    Se.current = Date.now();
                  },
                  onClose: (p) => {
                    if (p) {
                      Se.current = Date.now();
                      const E = A.current.performerFocus;
                      E ? ba(E) : bn(), Ie((I) => I + 1), new Promise((I) => window.setTimeout(I, 1100)).then(() => {
                        tt(), Ve.current && (S.current || en(!0), J((I) => I + 1));
                      });
                    } else tt();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ r(
                so,
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
                Pr,
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
              nt != null && nt.flags.length ? /* @__PURE__ */ l("span", { className: "dq-focus-flag", title: kr(nt.flags), children: [
                /* @__PURE__ */ r($n, { "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-sr-only", children: kr(nt.flags) })
              ] }) : null,
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: mt,
                  onClick: ir,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: Ht,
            queueChange: !b && Ht ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: Xn ? () => void xe() : void 0,
              saveDisabled: mt || !i,
              onReset: () => {
                const p = yr(e);
                Le(p, p.startFrom === "end");
              },
              resetDisabled: mt
            } : void 0,
            chipsEnd: b ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
          b && wn && /* @__PURE__ */ r(
            vc,
            {
              drawerRef: G,
              draft: wn,
              onChange: (p) => R(p),
              direction: U.startFrom,
              onDirectionChange: (p) => Le({ ...A.current, startFrom: p }),
              tagGroups: Pf,
              trees: _n,
              saving: ke,
              saveDisabled: Be,
              error: M,
              dirty: or,
              criteriaChanged: Xn,
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
                      href: `/${d}/${T.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${m.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ r("span", { children: Ha(T.media) }),
                        /* @__PURE__ */ r(Es, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Qr && /* @__PURE__ */ r("span", { className: "dq-stage-meta", children: Qr })
                ] }),
                /* @__PURE__ */ l("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ r("div", { className: "dq-player-frame", children: [T, Ee].filter(Boolean).map((p) => {
                    var X, le, ie, Qe, It;
                    const E = p, I = E.key === T.key;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        className: I ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": I ? void 0 : !0,
                        inert: I ? void 0 : !0,
                        children: d === "audio" ? /* @__PURE__ */ r(
                          vl,
                          {
                            streamUrl: vi("audio", E.media.id),
                            format: ((X = E.media.files[0]) == null ? void 0 : X.format) ?? "",
                            title: v(E.media),
                            coverUrl: I ? wi("audio", E.media) : void 0,
                            duration: ((le = E.media.files[0]) == null ? void 0 : le.duration) ?? 0,
                            autostart: I && te === E.media.id
                          }
                        ) : /* @__PURE__ */ r(
                          ms,
                          {
                            videoId: E.media.id,
                            streamUrl: vi("video", E.media.id),
                            posterUrl: I ? wi("video", E.media) : void 0,
                            duration: ((ie = E.media.files[0]) == null ? void 0 : ie.duration) ?? 0,
                            format: (Qe = E.media.files[0]) == null ? void 0 : Qe.format,
                            audioCodec: (It = E.media.files[0]) == null ? void 0 : It.audioCodec,
                            extensionSurface: I ? "quick-view" : void 0,
                            autostart: I && te === E.media.id,
                            keyboardShortcutsEnabled: I,
                            showAbLoop: I,
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
                  d === "audio" && /* @__PURE__ */ r(
                    pf,
                    {
                      details: T.media.details,
                      label: m.one
                    },
                    T.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ r("p", { role: "status", className: "dq-stage-status", children: Be ? "Loading review…" : Ye ? "Reached the end in this direction." : `No matching ${m.many}.` }),
              Pe.actions.length > 0 ? /* @__PURE__ */ r(
                eu,
                {
                  actions: Pe.actions,
                  mediaKind: d,
                  isDisabled: (p) => $e || rn(p),
                  busy: sn,
                  tags: Xe,
                  trees: _n,
                  preview: Jr,
                  onApply: (p, E) => void nn(p, E),
                  onFind: () => Ot(!0),
                  findDisabled: $e || !!b,
                  paused: !!b,
                  waitForGroups: xo(Pe),
                  attention: rr,
                  stayOnTap: at,
                  onStayOnTapChange: Fn
                }
              ) : Re(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ l(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || ke || $e || !Xe || !!b || !T,
                  children: [
                    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((p) => /* @__PURE__ */ l("label", { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Jt.includes(p),
                          onChange: (E) => Fe(
                            e.occurrence.multiple ? E.target.checked ? [...Jt, p] : Jt.filter((I) => I !== p) : [p]
                          )
                        }
                      ),
                      Ct[p] ?? "Loading tag…"
                    ] }, p)),
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
              /* @__PURE__ */ l("div", { className: "dq-panel-body", ref: Ar, children: [
                T && /* @__PURE__ */ l(me, { children: [
                  /* @__PURE__ */ l("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ l("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: T.occurrence ? T.occurrence.performer.name : `this ${m.one}` })
                    ] }),
                    /* @__PURE__ */ l("div", { className: "dq-reviewing-who", children: [
                      T.occurrence && /* @__PURE__ */ r(Pr, { performer: T.occurrence.performer }),
                      /* @__PURE__ */ l("div", { children: [
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: T.occurrence ? T.occurrence.performer.name : `This ${m.one}` }),
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-note", children: dt ? `Tags apply to this performer in this ${m.queue}` : `Tags apply to the whole ${m.one}` })
                      ] })
                    ] }),
                    rr.length > 0 && /* @__PURE__ */ r(_f, { entries: rr })
                  ] }),
                  Na.length > 0 && /* @__PURE__ */ l(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${m.queue}`,
                      children: [
                        /* @__PURE__ */ l("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          m.queue
                        ] }),
                        /* @__PURE__ */ r("div", { className: "dq-partners", children: Na.map((p) => {
                          var E, I, X;
                          return /* @__PURE__ */ l(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (E = p.occurrence) == null ? void 0 : E.performer.name,
                              "aria-label": (I = p.occurrence) == null ? void 0 : I.performer.name,
                              "data-partner-key": p.key,
                              disabled: mt,
                              onClick: () => {
                                zr.current = T.key, Lt(p), Me("");
                              },
                              children: [
                                p.occurrence && /* @__PURE__ */ r(Pr, { performer: p.occurrence.performer }),
                                /* @__PURE__ */ r("span", { children: (X = p.occurrence) == null ? void 0 : X.performer.name })
                              ]
                            },
                            p.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ r(
                    Df,
                    {
                      tags: Xe,
                      preview: Jr,
                      showPreview: !$e,
                      trees: _n,
                      actionTagIds: Qa,
                      label: `Current ${dt ? "occurrence" : m.one} tags`
                    }
                  ),
                  $e && /* @__PURE__ */ l(
                    "fieldset",
                    {
                      ref: Yn,
                      disabled: ke,
                      className: "dq-panel-section dq-tag-editor",
                      children: [
                        /* @__PURE__ */ l("legend", { className: "dq-eyebrow", children: [
                          "Edit ",
                          dt ? "occurrence" : m.one,
                          " tags"
                        ] }),
                        /* @__PURE__ */ r(
                          Qn,
                          {
                            entityType: "tag",
                            values: lt,
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
                                kn(!1), requestAnimationFrame(() => {
                                  var p;
                                  return (p = Bt.current) == null ? void 0 : p.focus();
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
                Re(Ze) && U.performerFocus && /* @__PURE__ */ r(
                  Ii,
                  {
                    ...Nt,
                    mediaKind: d,
                    actions: Pe.actions,
                    flags: Dn
                  }
                )
              ] }),
              /* @__PURE__ */ l("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ l("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !b && Un,
                  rt && /* @__PURE__ */ r("p", { role: "status", children: rt })
                ] }),
                !t && /* @__PURE__ */ r("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                T && /* @__PURE__ */ l("div", { className: "dq-panel-actions", "aria-busy": sn || void 0, children: [
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      ref: Bt,
                      className: "dq-button",
                      disabled: mt || !!b || !t || !Xe,
                      onClick: () => {
                        ft.current = [...Xe.ids], $t([...Xe.ids]), kn(!0);
                      },
                      children: [
                        /* @__PURE__ */ r(Ns, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: mt || !!b,
                      onClick: () => void nn(),
                      children: [
                        /* @__PURE__ */ r(Pl, { "aria-hidden": "true" }),
                        "Skip",
                        dt ? " performer" : ` ${m.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ l("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              dt && /* @__PURE__ */ l(
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
                        children: d === "audio" ? "Audios" : "Scenes"
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
              dt && Mt === "performers" ? /* @__PURE__ */ r(
                gf,
                {
                  ranking: (ot == null ? void 0 : ot.signature) === pe ? ot : null,
                  busy: pn,
                  error: (k == null ? void 0 : k.signature) === pe ? k.message : "",
                  focus: U.performerFocus,
                  disabled: mt,
                  labels: m,
                  flagLabel: kr,
                  onFocus: ar,
                  onMore: () => {
                    const p = Qt.current;
                    p && Sr(p, p.limit + di);
                  },
                  onRefresh: () => {
                    Ft(null), Sr(null, di);
                  }
                }
              ) : /* @__PURE__ */ r("div", { className: "dq-queue-list", ref: va, children: ce.map((p) => {
                var I;
                const E = (T == null ? void 0 : T.key) === p.key;
                return /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: w(p),
                    "aria-label": w(p),
                    "aria-current": E ? "true" : void 0,
                    disabled: mt,
                    onClick: () => {
                      Lt(p), Me(""), Te("");
                    },
                    children: [
                      /* @__PURE__ */ r(Lf, { media: p.media, kind: d }),
                      /* @__PURE__ */ l("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: v(p.media) }),
                        /* @__PURE__ */ l("span", { className: "dq-queue-row-meta", children: [
                          p.occurrence && /* @__PURE__ */ l(me, { children: [
                            /* @__PURE__ */ r(Pr, { performer: p.occurrence.performer }),
                            /* @__PURE__ */ r("span", { className: "dq-queue-row-performer", children: p.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ r("span", { className: "dq-queue-row-detail", children: [
                            p.media.date,
                            p.occurrence ? "" : (I = p.media.files[0]) != null && I.duration ? gs(p.media.files[0].duration) : ""
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
        dt && /* @__PURE__ */ r(
          Nl,
          {
            open: kt,
            onClose: () => Cn(!1),
            criteria: xi,
            activeFilter: dt.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (p) => {
              Cn(!1), gn({ performerFilter: p });
            }
          }
        ),
        Vt && /* @__PURE__ */ r(
          ao,
          {
            actions: e.actions,
            trees: _n,
            isDisabled: (p) => rn(p),
            tapStays: hn && at,
            onApply: (p, E) => {
              Ot(!1), nn(p, E);
            },
            onClose: () => Ot(!1)
          }
        )
      ]
    }
  );
}
const Gc = "data-quality.reviews-sort.v1", Uf = { sort: "name", direction: "asc" };
function Gf() {
  try {
    const e = JSON.parse(localStorage.getItem(Gc) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return Uf;
}
function Kf(e) {
  try {
    localStorage.setItem(
      Gc,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function Kc(e, t, n, a) {
  const i = a === "asc" ? 1 : -1;
  return [...e].sort((o, s) => {
    if (n === "count") {
      const c = t[o.id], u = t[s.id], f = typeof c == "number", d = typeof u == "number";
      if (f !== d) return f ? -1 : 1;
      if (f && d && c !== u)
        return (c - u) * i;
    }
    return o.name.localeCompare(s.name, void 0, { numeric: !0, sensitivity: "base" }) * i;
  });
}
function ui(e, t) {
  const n = _e(e), a = Sn(Vi(n)), i = n === "tag" ? "tag" : Re(e) ? a.queue : a.one;
  return t === 1 ? i : `${i}s`;
}
function Bf({ review: e, count: t }) {
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
function Vf({
  reviews: e,
  counts: t,
  sort: n,
  direction: a,
  onSortChange: i,
  onDirectionChange: o,
  storage: s,
  canConfigure: c,
  busy: u,
  headingRef: f,
  notices: d,
  onOpen: m,
  onNew: g,
  onImport: v,
  onExportAll: w,
  rowMenuItems: q
}) {
  const S = O(null), b = ye(
    () => Kc(e, t, n, a),
    [e, t, n, a]
  ), R = e.every((j) => t[j.id] !== void 0), M = a === "asc" ? "ascending" : "descending";
  return /* @__PURE__ */ l("div", { className: "dq-reviews-page", children: [
    /* @__PURE__ */ l("header", { className: "dq-reviews-header", children: [
      /* @__PURE__ */ r("h1", { ref: f, tabIndex: -1, children: "Data Quality" }),
      /* @__PURE__ */ l("div", { className: "dq-reviews-header-actions", children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-header-button",
            title: "Add the reviews in a review file",
            disabled: !c || u,
            onClick: () => {
              var j;
              return (j = S.current) == null ? void 0 : j.click();
            },
            children: [
              /* @__PURE__ */ r(xl, { "aria-hidden": "true" }),
              "Import"
            ]
          }
        ),
        /* @__PURE__ */ r(
          "input",
          {
            ref: S,
            type: "file",
            accept: "application/json,.json",
            hidden: !0,
            tabIndex: -1,
            onChange: (j) => {
              var D;
              const G = (D = j.target.files) == null ? void 0 : D[0];
              j.target.value = "", G && v(G);
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
              /* @__PURE__ */ r(ks, { "aria-hidden": "true" }),
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
            onClick: g,
            children: [
              /* @__PURE__ */ r(_i, { "aria-hidden": "true" }),
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
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: R ? e.some((j) => t[j.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
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
              onClick: () => o(a === "asc" ? "desc" : "asc"),
              children: a === "asc" ? /* @__PURE__ */ r(Ll, { "aria-hidden": "true" }) : /* @__PURE__ */ r(Dl, { "aria-hidden": "true" })
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
        /* @__PURE__ */ r("tbody", { children: b.map((j) => {
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
                  /* @__PURE__ */ r("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ r(bc, { entityType: G }) }),
                  /* @__PURE__ */ l("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ r("span", { className: "dq-reviews-name", children: j.name }),
                    j.description && /* @__PURE__ */ r("span", { className: "dq-reviews-description", title: j.description, children: j.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-type", children: gc[G] }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-count", children: /* @__PURE__ */ r(Bf, { review: j, count: t[j.id] }) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ r(so, { label: `Actions for ${j.name}`, items: q(j) }) })
          ] }, j.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ l("div", { className: "dq-empty", children: [
      /* @__PURE__ */ r(Ba, { "aria-hidden": "true" }),
      /* @__PURE__ */ r("p", { children: "No reviews yet." }),
      /* @__PURE__ */ r("p", { children: c ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function Bc(e, { id: t, name: n, description: a }) {
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
function Jf({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: a
}) {
  const { review: i, saving: o, error: s } = e, c = O(null), u = O(null), f = O(o);
  f.current = o;
  const d = O(null), m = ut();
  H(() => {
    var w;
    return d.current ?? (d.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (w = u.current) == null || w.focus(), () => {
      var q;
      (q = d.current) != null && q.isConnected && d.current.focus({ preventScroll: !0 });
    };
  }, []);
  const g = O(o);
  H(() => {
    var S, b;
    const w = document.activeElement, q = !w || w === document.body || !((S = c.current) != null && S.contains(w));
    s && (!i.name.trim() || g.current && !o && q) && ((b = u.current) == null || b.focus()), g.current = o;
  }, [s, o]);
  const v = () => {
    f.current || a();
  };
  return /* @__PURE__ */ r(
    "dialog",
    {
      ref: c,
      className: "dq-form-dialog",
      "aria-labelledby": m,
      "aria-modal": "true",
      onCancel: (w) => {
        w.preventDefault(), v();
      },
      onClose: () => {
        var w;
        f.current ? (w = c.current) == null || w.showModal() : a();
      },
      children: /* @__PURE__ */ l(
        "form",
        {
          onSubmit: (w) => {
            w.preventDefault(), f.current || n();
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
                  disabled: o,
                  onClick: v,
                  children: /* @__PURE__ */ r(la, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ l("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ r("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ l("fieldset", { className: "dq-form-dialog-fields", disabled: o, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ r(
                  wc,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (w) => {
                      w !== _e(i) && t(Bc(w, i));
                    },
                    nameRef: u
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ l("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ r("button", { type: "button", className: "dq-text-button", onClick: () => oo(i), children: "Export draft" }),
              /* @__PURE__ */ r("span", { className: "dq-form-dialog-space" }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: o, onClick: v, children: "Cancel" }),
              /* @__PURE__ */ r("button", { type: "submit", className: "dq-button primary", "aria-disabled": o || void 0, children: o ? "Creating…" : "Create & configure" })
            ] })
          ]
        }
      )
    }
  );
}
const zf = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function Wf(e, t, n, a) {
  return Uc(
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
function as(e, t) {
  return _e(t) === "video" && ma(t.view.objectFilter, e.view.objectFilter).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function is(e, t) {
  return br(
    JSON.parse(Vn(mr(e))),
    JSON.parse(Vn(mr(t)))
  );
}
const fi = 180;
function os(e) {
  return _e(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function ss(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function cs() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function hi(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  Wa.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const a = n.toString();
  jc(`${window.location.pathname}${a ? `?${a}` : ""}`, { openingFromList: t });
}
function Qf(e) {
  return Ut({ ...e, page: 1 });
}
function Vc(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Mr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Hf = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Ui, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ r(Ul, { "aria-hidden": "true" }) }
], Yf = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Ui, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ r(jl, { "aria-hidden": "true" }) }
], ls = [], Jc = "(min-width: 900px)";
function Xf(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(Jc);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function Zf() {
  return typeof window.matchMedia == "function" && window.matchMedia(Jc).matches;
}
function eh({
  onNavigate: e
}) {
  const [t, n] = C([]), [a] = C(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = C(""), [s, c] = C(!0), [u, f] = C(""), [d, m] = C(!1), [g, v] = C(!1), [w, q] = C(!1), [S, b] = C(!1), [R, M] = C([]), [j, G] = C(""), [D, Z] = C(!0), [ne, oe] = C("account"), [se, _] = C(""), [U, N] = C(""), [A, V] = C(!1), [J, ue] = C(!1), [ce, B] = C(""), [T, Q] = C(cs), z = O(T);
  z.current = T;
  const [te, P] = C({}), fe = O(te);
  fe.current = te;
  const Oe = O(t);
  Oe.current = t;
  const Ee = O(s);
  Ee.current = s;
  const Ye = O(!1), Ae = O(!0);
  H(() => (Ae.current = !0, () => {
    Ae.current = !1;
  }), []);
  const [Be, en] = C(!T);
  Be !== !T && (en(!T), T || P({}));
  const [ke, En] = C(Gf), { sort: ge, direction: Ve } = ke, qt = (h) => {
    const y = { ...ke, ...h };
    En(y), Kf(y);
  }, fn = O(null), Me = O(null), [rt, Te] = C(null), [Xe, Kt] = C(!1), [$e, kn] = C(!1), [lt, $t] = C(null), [ft, Bt] = C(null), vt = !!lt || !!ft, Yn = O(vt);
  Yn.current = vt;
  const kt = Xe || !!ft || $e, [Cn, Vt] = C(0), [Ot, hn] = C(!1), [we, St] = C(null), at = O(null), Fn = O(null), Jt = O(null), [Fe, Ct] = C(
    null
  ), re = t.find((h) => h.id === T) ?? null, F = ye(
    () => (Fe == null ? void 0 : Fe.id) === T && re ? { ...re, view: {
      ...re.view,
      filter: Fe.view.filter,
      objectFilter: Fe.view.objectFilter,
      searchMode: Fe.view.searchMode,
      startFrom: Fe.view.startFrom
    } } : re,
    [Fe, T, re]
  ), Se = F ? _e(F) : "video", ht = Vi(Se), Pn = F ? Re(F) : !1, he = Se === "video" ? F : null, At = Pn && !!(F != null && F.actions.some(Wn)), et = !!he || Se === "audio" || At, [Pe, Ze] = C(null), zt = (Pe == null ? void 0 : Pe.id) === (F == null ? void 0 : F.id) ? Pe == null ? void 0 : Pe.mode : (F == null ? void 0 : F.view.reviewMode) ?? "single", it = Pn || Se === "audio" || Se === "video" && zt === "single", [pt, Mt] = C(0), Wt = O(-1), ot = O(!1), xn = O(it);
  xn.current = it, H(() => {
    const h = () => {
      const y = xn.current;
      if (!y && bn.current) {
        ot.current = !0;
        return;
      }
      Wt.current = -1, Et(), y || Mt(($) => $ + 1);
    };
    return window.addEventListener("popstate", h), () => window.removeEventListener("popstate", h);
  }, []);
  const Qt = ht === "audio" ? g : d, Ln = Se === "tag" ? "Tag" : ht === "audio" ? "Audio" : "Video", Ft = Se === "tag" ? w : Qt, pn = O(
    null
  ), tn = Tf(he), [k, x] = C({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [W, pe] = C({
    page: 1,
    perPage: 40
  }), [ae, Ie] = C({ items: [], totalCount: 0 }), [Ce, Pt] = C(T);
  Ce !== T && (Pt(T), Ie({ items: [], totalCount: 0 }), ue(!1));
  const [be, Ne] = C(!1), [ve, xt] = C(""), [An, Gr] = C(!1), [Kr, Br] = C(!1), [Nt, Ht] = C(() => /* @__PURE__ */ new Set()), Xn = O(Nt);
  Xn.current = Nt;
  const mt = O(/* @__PURE__ */ new Map()), mn = (F == null ? void 0 : F.view.selectAllOnLoad) === !0, [Le, tt] = C(null), gt = O(Le);
  gt.current = Le;
  const [bt, Lt] = C(!1), Dt = O(bt);
  Dt.current = bt;
  const nn = O(null), [Zn, rn] = C(!1), [Yt, Nr] = C("grid"), [qr, ga] = C(fi), [xe, dt] = C(!1), [gn, Sr] = C(!1), bn = O(!1), [ba, er] = C(""), [nt, an] = C(""), [on, yn] = C(""), [De, Vr] = C(null), [ya, tr] = C(""), [nr, Er] = C(!1), [rr, wa] = C({}), Dn = O(/* @__PURE__ */ new Map()), kr = O(null), ar = O(null), ir = !!F, Cr = Fi(Xf, Zf, () => !1) && ir, [Jr, _n] = C({ top: 0, bottom: 0 });
  Rt(() => {
    if (!ir) return;
    const h = () => {
      const $ = ar.current;
      if (!$) return;
      const L = Math.round($.getBoundingClientRect().top + window.scrollY), Y = $.closest("main"), K = Y ? Math.round(parseFloat(getComputedStyle(Y).paddingBottom) || 0) : 0;
      _n(
        (ee) => ee.top === L && ee.bottom === K ? ee : { top: L, bottom: K }
      );
    };
    h();
    const y = typeof ResizeObserver > "u" ? null : new ResizeObserver(h);
    return y == null || y.observe(document.body), window.addEventListener("resize", h), () => {
      y == null || y.disconnect(), window.removeEventListener("resize", h);
    };
  }, [ir]);
  const [Qa, va] = C(0), Ar = O(null), zr = Nn((h) => {
    var $;
    if (($ = Ar.current) == null || $.disconnect(), Ar.current = null, !h || typeof ResizeObserver > "u") return;
    const y = new ResizeObserver(
      () => va(Math.round(h.getBoundingClientRect().height))
    );
    y.observe(h), Ar.current = y;
  }, []), Tt = O(0), wn = O(0), or = O(null), jn = O(null), Un = Ks(
    F && !it ? we ? [...F.actions, ...we.draft.actions] : F.actions : ls
  ), sn = ye(
    () => we && F && re ? Wf(we.draft, F, k, re) : null,
    [we, F, k, re]
  ), sr = ye(
    () => F && re ? Uc(
      { ...re, view: { ...F.view, filter: { ...k, page: 1 } } },
      re
    ) : null,
    [F, re, k]
  ), cr = ye(
    () => re ? xr(mr(re)) : "",
    [re]
  ), Wr = ye(
    () => sr != null && xr(mr(sr)) !== cr,
    [sr, cr]
  ), Na = ye(
    () => sn != null && xr(mr(sn)) !== cr,
    [sn, cr]
  );
  H(() => {
    if (!nt) return;
    const h = window.setTimeout(() => an(""), 4e3);
    return () => window.clearTimeout(h);
  }, [nt]), H(() => {
    if (!rt || rt.alert) return;
    const h = window.setTimeout(() => Te(null), 6e3);
    return () => window.clearTimeout(h);
  }, [rt]), H(() => {
    const h = he ? uo(he.view.objectFilter) : [];
    if (wa({}), !h.length) return;
    const y = new AbortController();
    let $ = !0;
    return Promise.all(
      h.map(async (L) => {
        var Y;
        try {
          const K = await de(`/api/tags/${L}`, {
            signal: y.signal
          });
          return (Y = K.name) != null && Y.trim() ? [String(L), K.name] : null;
        } catch {
          return null;
        }
      })
    ).then((L) => {
      $ && wa(
        Object.fromEntries(L.filter((Y) => Y !== null))
      );
    }), () => {
      $ = !1, y.abort();
    };
  }, [he == null ? void 0 : he.id, he == null ? void 0 : he.view.objectFilter]);
  const Ha = ye(
    () => he ? fo(
      he.view.objectFilter,
      rr
    ) : (F == null ? void 0 : F.view.objectFilter) ?? {},
    [rr, F, he]
  ), Qr = Nn(async () => {
    c(!0), f("");
    try {
      const h = await sd();
      n(h.reviews), o(h.storageKey), m(h.canWriteVideos ?? h.canWrite), v(h.canWriteAudios ?? !1), q(h.canWriteTags ?? !1), b(h.canReadTagGroups ?? !1), Z(h.canConfigure ?? !0), oe(h.storage ?? "account"), _(h.storageNotice ?? ""), T && !h.reviews.some((y) => y.id === T) && (Q(""), hi(""));
    } catch (h) {
      f(
        h instanceof Error ? h.message : "Could not load reviews."
      );
    } finally {
      c(!1);
    }
  }, [T]);
  H(() => {
    if (!S) {
      M([]), G("");
      return;
    }
    const h = new AbortController();
    return G(""), wd(h.signal).then(M).catch((y) => {
      h.signal.aborted || G(
        y instanceof Error ? y.message : "Could not load tag groups."
      );
    }), () => h.abort();
  }, [S]), H(() => {
    Qr();
  }, []), H(() => {
    if (T || t.length === 0) return;
    const h = new AbortController();
    for (const y of t) {
      if (typeof fe.current[y.id] == "number") continue;
      (Re(y) ? ho(y, h.signal).then((L) => (L == null ? void 0 : L.length) === 0 ? { items: [], totalCount: 0 } : ta(po(y, L), { ...y.view.filter, page: 1, perPage: 1 }, h.signal)) : _e(y) === "tag" ? Oo(
        y,
        Ut({ ...y.view.filter, page: 1, perPage: 1 }),
        h.signal
      ) : ta(
        y,
        Ut({ ...y.view.filter, page: 1, perPage: 1 }),
        h.signal
      )).then((L) => {
        h.signal.aborted || P((Y) => ({
          ...Y,
          [y.id]: L.totalCount
        }));
      }).catch(() => {
        h.signal.aborted || P((L) => ({ ...L, [y.id]: null }));
      });
    }
    return () => h.abort();
  }, [T, t]), Rt(() => {
    var $, L;
    const h = Me.current;
    if (T || s || !h) return;
    Me.current = null, (L = (h === "heading" ? null : [...(($ = ar.current) == null ? void 0 : $.querySelectorAll("[data-review-id]")) ?? []].find(
      (Y) => Y.dataset.reviewId === h.reviewId
    )) ?? fn.current) == null || L.focus();
  }, [T, s, ft, t]);
  const Tr = O(0), p = Nn(async () => {
    const h = ++Tr.current;
    Vr(null), tr("");
    try {
      const y = await (At ? _s(ht) : Ds(ht));
      h === Tr.current && Vr(y);
    } catch (y) {
      if (h !== Tr.current) return;
      Vr(null), tr(
        "Tag assessment setup could not be checked. " + (y instanceof Error ? y.message : "Request failed.")
      );
    }
  }, [At, ht]);
  H(() => {
    p();
  }, [p]);
  const E = Nn(
    async (h, y, $ = !1, L = !1) => {
      var wt, Ue;
      const Y = ++Tt.current;
      (wt = or.current) == null || wt.abort();
      const K = new AbortController();
      or.current = K, y = Ut(y);
      const ee = Number(y.page);
      $ && (y = { ...y, page: 1 }), x(y), Br($), Ne(!0), xt("");
      try {
        const ze = (Tn) => _e(h) === "tag" ? Oo(
          h,
          Tn,
          K.signal
        ) : ta(
          h,
          Tn,
          K.signal
        );
        let qe = await ze(y);
        const We = Math.max(
          1,
          Math.ceil(qe.totalCount / Number(y.perPage))
        ), Gn = $ ? We : Math.min(ee, We);
        return Number(y.page) !== Gn && (y = { ...y, page: Gn }, qe = await ze(y)), Y === Tt.current && (((Ue = jn.current) == null ? void 0 : Ue.page) !== Gn && (jn.current = {
          page: Gn,
          ids: new Set(qe.items.map((Tn) => Tn.id))
        }), Ie(qe), L && yt(
          () => new Set(qe.items.map((Tn) => Tn.id))
        ), x(y), pe(y)), qe;
      } catch (ze) {
        throw Y === Tt.current && xt(
          ze instanceof Error ? ze.message : "Could not load the review queue."
        ), ze;
      } finally {
        Y === Tt.current && Ne(!1);
      }
    },
    []
  );
  H(() => {
    var y;
    if (wn.current += 1, Wt.current = -1, Tt.current += 1, (y = or.current) == null || y.abort(), St(null), at.current = null, ue(!1), B(""), N(""), V(!1), Ht(/* @__PURE__ */ new Set()), mt.current.clear(), tt(null), Lt(!1), dt(!1), bn.current = !1, er(""), an(""), yn(""), Ie({ items: [], totalCount: 0 }), jn.current = null, Gr(!1), !F || it) {
      Ne(!1), Ct(null);
      return;
    }
    let h = !0;
    return Ne(!0), (async () => {
      let $ = re ?? F;
      Ct(null);
      let L = null;
      const Y = new URLSearchParams(window.location.search);
      if (_e(F) === "video" && Wa.some((Ue) => Y.has(Ue)))
        try {
          const Ue = $;
          L = Mi(Ue, Y);
          const ze = qn(Ue, L.query);
          (L.query.startFrom !== (Ue.view.startFrom ?? "end") || !br(
            JSON.parse(Vn(ze)),
            JSON.parse(Vn(qn(Ue, yr(Ue))))
          )) && ($ = ze, Ct($));
        } catch (Ue) {
          Gr(!0), xt(Ue instanceof Error ? Ue.message : "Could not read review URL."), Ne(!1);
          return;
        }
      let K = null;
      try {
        K = await ud(i, F.id);
      } catch (Ue) {
        h && (V(!0), N(
          Ue instanceof Error ? Ue.message : "Could not load progress."
        ));
      }
      if (!h) return;
      const ee = (K == null ? void 0 : K.signature) === Vn($) ? K : null, wt = L ? L.query.filter : ee ? Ut(ee.filter) : Qf($.view.filter);
      x(wt), Nr(
        ee ? ss(ee.displayMode, _e(F)) : os(F)
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
        if (!h) return;
        const ze = To(
          Ue.items.map((qe) => qe.id),
          (ee == null ? void 0 : ee.focusedId) ?? null,
          (ee == null ? void 0 : ee.index) ?? 0
        );
        tt(ze), Ge(ze);
      } catch {
      }
      h && (Wt.current = pt, ue(!0), B(`${F.id}:${pt}`));
    })(), () => {
      var $;
      h = !1, wn.current++, Tt.current++, ($ = or.current) == null || $.abort();
    };
  }, [F == null ? void 0 : F.id, it, pt]), H(() => {
    if (!(!Cn || it || !F)) {
      if (An) {
        Vt(0);
        return;
      }
      xe || we || gn || ce !== `${F.id}:${pt}` || (Vt(0), ti());
    }
  }, [
    Cn,
    it,
    F == null ? void 0 : F.id,
    ce,
    xe,
    gn,
    pt,
    An
  ]), H(() => {
    !he || it || !J || be || ve || xe || ot.current || Wt.current !== pt || na(he.id, {
      filter: k,
      objectFilter: he.view.objectFilter,
      searchMode: he.view.searchMode,
      startFrom: he.view.startFrom ?? "end"
    });
  }, [he, it, J, be, ve, k, xe, pt]);
  const I = ye(
    () => ae.items.map((h) => h.id),
    [ae.items]
  );
  H(() => {
    if (!J || !F || !i || be || ve || xe || (Fe == null ? void 0 : Fe.id) === F.id || A || Wt.current !== pt)
      return;
    const h = {
      version: 1,
      signature: Vn(F),
      filter: k,
      focusedId: Le,
      index: Math.max(0, I.indexOf(Le ?? -1)),
      displayMode: Yt,
      cardSize: qr,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + F.id,
        JSON.stringify(h)
      );
    } catch {
    }
    if (U) return;
    let y = !0;
    const $ = window.setTimeout(() => {
      fd(i, F.id, h).catch((L) => {
        y && N(
          "Progress is kept in this browser, but account sync failed. " + (L instanceof Error ? L.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      y = !1, window.clearTimeout($);
    };
  }, [
    J,
    i,
    F,
    be,
    ve,
    xe,
    k,
    Le,
    I,
    Yt,
    qr,
    Fe,
    U,
    A,
    pt
  ]);
  const X = ae.items.find((h) => h.id === Le) ?? null, le = Se === "video" ? X : null;
  bt && le && (nn.current = le);
  const ie = le ?? (bt ? nn.current : null), Qe = Io(Nt, Le), It = I.length > 0 && I.every((h) => Nt.has(h)), Ge = Nn((h, y = !0) => {
    h != null && window.requestAnimationFrame(() => {
      var L;
      if (Yn.current || td(document.activeElement) || (L = document.activeElement) != null && L.closest(".dq-drawer"))
        return;
      const $ = Dn.current.get(h);
      $ == null || $.focus({ preventScroll: !0 }), y && ($ == null || $.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  H(() => {
    J && !Dt.current && Ge(gt.current);
  }, [J, Ge]), H(() => {
    be || !I.length || (gt.current == null || !I.includes(gt.current)) && (tt(I[0]), Dt.current || Ge(I[0]));
  }, [Ge, I, be]);
  const yt = Nn(
    (h) => {
      Ht((y) => {
        const $ = h(y);
        for (const L of /* @__PURE__ */ new Set([...y, ...$]))
          y.has(L) !== $.has(L) && mt.current.set(
            L,
            (mt.current.get(L) ?? 0) + 1
          );
        return $;
      });
    },
    []
  ), st = Nn(
    (h) => {
      if (!I.length) return;
      const y = Math.max(
        0,
        I.indexOf(gt.current ?? I[0])
      ), $ = I[Math.max(0, Math.min(I.length - 1, y + h))];
      tt($), Dt.current || Ge($);
    },
    [Ge, I]
  ), Ke = Nn(
    async (h) => {
      const y = "steps" in h ? h.steps.length > 0 : h.effect.mode !== "SKIP", $ = "effect" in h && h.effect.mode === "SET_TAG_GROUP" ? h.effect.tagGroupId : null, L = $ != null && (!S || !R.some((He) => He.id === $)), Y = "effect" in h && y && !S, K = Io(
        Xn.current,
        gt.current
      );
      if (!F || bn.current || be || ve) return;
      const ee = y && !Ft ? `${Ln} write permission is required to apply ${h.label}.` : Y || L ? `${h.label} needs a tag group that is unavailable.` : Wn(h) && (De == null ? void 0 : De.kind) !== "ready" ? `Set up tag assessments before applying ${h.label}.` : K.length ? "" : `Select or focus a ${Se} before applying ${h.label}.`;
      if (ee) {
        yn(ee);
        return;
      }
      const wt = ++wn.current, Ue = F.id, ze = [...I], qe = ae, We = gt.current, Gn = new Set(Xn.current), Tn = new Map(
        K.map((He) => [He, mt.current.get(He) ?? 0])
      ), $r = () => wt === wn.current && F.id === Ue;
      bn.current = !0, dt(!0), er(
        Xn.current.size ? `${K.length} selected ${Se}s` : `the focused ${Se}`
      ), an(""), yn("");
      const qo = qe.items.filter(
        (He) => !K.includes(He.id)
      ), ll = qo.map((He) => He.id), So = Ro(
        ze,
        ll,
        We,
        K.includes(We ?? -1)
      );
      Ie({
        items: qo,
        totalCount: qe.totalCount
      }), Ht((He) => {
        const jt = new Set(He);
        for (const ln of K) jt.delete(ln);
        return jt;
      }), tt(So), Dt.current || Ge(So);
      let ni = !1;
      try {
        if ("effect" in h ? await Id(h, K) : await Us(ht, h, K), ni = !0, !$r()) return;
        Ht((He) => {
          const jt = new Set(He);
          for (const ln of K)
            (mt.current.get(ln) ?? 0) === Tn.get(ln) && jt.delete(ln);
          return jt;
        }), an(
          `${h.label}: ${K.length} ${Se}${K.length === 1 ? "" : "s"} ${y ? "updated" : "skipped"}.`
        );
      } catch (He) {
        if (!$r()) return;
        Ie(qe), Ht((jt) => {
          const ln = new Set(jt);
          for (const Xt of K)
            Gn.has(Xt) && (mt.current.get(Xt) ?? 0) === Tn.get(Xt) && ln.add(Xt);
          return ln;
        }), tt(We), Dt.current || Ge(We), yn(
          He instanceof Error ? He.message : "Action failed."
        );
      }
      try {
        if (await qd(h), !$r()) return;
        const He = new Set(K), jt = mn && ze.length > 0 && ze.every((dn) => He.has(dn)), ln = await E(F, k, !1, jt);
        if (!$r()) return;
        let Xt = ln.items.map((dn) => dn.id);
        const Ca = jn.current, dl = (Ca == null ? void 0 : Ca.page) === Number(k.page) && Xt.some((dn) => Ca.ids.has(dn)), ul = (F.view.startFrom ?? "end") !== "beginning";
        if (ln.totalCount > 0 && Number(k.page) > 1 && (!Xt.length || ul && !dl)) {
          const dn = Math.max(1, Number(k.page) - 1), Aa = { ...k, page: dn };
          x(Aa), Xt = (await E(
            F,
            Aa,
            !1,
            jt
          )).items.map((ri) => ri.id), Ht(
            (ri) => new Set([...ri].filter((fl) => Xt.includes(fl)))
          );
          const ko = Xt.at(-1) ?? null;
          tt(ko), Dt.current || Ge(ko);
        } else {
          Ht(
            (Aa) => new Set([...Aa].filter((Eo) => Xt.includes(Eo)))
          );
          const dn = Ro(
            ze,
            Xt,
            We,
            ni && K.includes(We ?? -1)
          );
          tt(dn), Dt.current && dn == null && Lt(!1), Dt.current || Ge(dn);
        }
      } catch (He) {
        $r() && yn(
          (jt) => `${jt ? `${jt} ` : ""}${ni ? "The action completed, but " : ""}the queue could not be refreshed. ${He instanceof Error ? He.message : "Refresh failed."}`
        );
      } finally {
        $r() && (bn.current = !1, dt(!1), er(""), ot.current && (ot.current = !1, Et(), Mt((He) => He + 1)));
      }
    },
    [
      Ft,
      S,
      R,
      Se,
      De,
      E,
      k,
      Ge,
      I,
      ae,
      be,
      ve,
      F
    ]
  );
  function vn() {
    var $;
    if (Yt === "list") return 1;
    const h = ($ = kr.current) == null ? void 0 : $.firstElementChild, y = h ? getComputedStyle(h).gridTemplateColumns : "";
    return Math.max(1, y.split(" ").filter(Boolean).length);
  }
  const Je = O(() => {
  });
  Je.current = (h) => {
    var K;
    if (it || h.defaultPrevented || h.repeat || h.ctrlKey || h.altKey || h.metaKey || vt) return;
    const y = h.target, $ = y instanceof Node && ((K = ar.current) == null ? void 0 : K.contains(y)) === !0, L = y === document.body || y === document.documentElement;
    if (!$ && !L) return;
    if (Zn) {
      h.key === "Escape" && (Mr(h), rn(!1));
      return;
    }
    if (bt && h.key === "Escape") {
      Mr(h), Lt(!1), Ge(gt.current);
      return;
    }
    if (!ed(y)) return;
    const Y = Zl(y);
    if (h.key === "Escape") {
      Mr(h), yt(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!bt && h.key === " " && Y) {
      Mr(h), Le != null && yt((ee) => Ma(ee, Le));
      return;
    }
    if (!(xe || be) && !bt && h.key === "Enter" && Le != null && Y) {
      if (Se !== "tag" && we) return;
      Mr(h), Se === "tag" ? window.open(`/tag/${Le}`, "_blank", "noopener,noreferrer") : Lt(!0);
      return;
    }
  }, H(() => {
    const h = (y) => Je.current(y);
    return document.addEventListener("keydown", h), () => document.removeEventListener("keydown", h);
  }, []);
  const cn = O(
    () => {
    }
  );
  cn.current = (h) => {
    var K;
    if (it || vt || bt || Zn || xe || be || !I.length || h.defaultPrevented || h.repeat || h.ctrlKey || h.altKey || h.metaKey)
      return;
    const y = h.target, $ = y instanceof Node && ((K = ar.current) == null ? void 0 : K.contains(y)) === !0, L = y === document.body || y === document.documentElement;
    if (!$ && !L || !h.key.startsWith("Arrow") || !nd(y)) return;
    const Y = rd(h.key, vn());
    Y && (h.preventDefault(), $ ? h.stopImmediatePropagation() : h.stopPropagation(), st(Y));
  }, H(() => {
    const h = (y) => cn.current(y);
    return document.addEventListener("keydown", h), () => document.removeEventListener("keydown", h);
  }, []);
  const _t = (we == null ? void 0 : we.saving) === !0 || gn, Hr = xe || be && !J || _t, qa = no();
  to({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!F && !it && !vt && !we && !bt && !Zn && !ve && (ae.items.length > 0 || be || xe),
    actions: (F == null ? void 0 : F.actions) ?? ls,
    onAction: (h) => {
      const y = F == null ? void 0 : F.actions[h];
      y && Ke(y);
    },
    onFind: () => rn(!0),
    onSelectAll: () => yt((h) => Xl(h, I))
  }), H(() => rn(!1), [it, bt, F == null ? void 0 : F.id]);
  function Sa(h) {
    const y = "steps" in h ? h.steps.length > 0 : h.effect.mode !== "SKIP", $ = "effect" in h && h.effect.mode === "SET_TAG_GROUP" ? h.effect.tagGroupId : null, L = $ != null && !R.some((Y) => Y.id === $);
    return xe || be || !!ve || y && !Ft || "effect" in h && y && (!S || L) || Wn(h) && (De == null ? void 0 : De.kind) !== "ready" || !Qe.length;
  }
  function lr(h) {
    Ze(null), Vt(0), Te(null), Q(h), hi(h, !!h && !F);
  }
  function Ir() {
    Ye.current || (_c() ? (Ye.current = !0, window.history.back()) : lr(""));
  }
  function Et() {
    const h = Ye.current;
    Ye.current = !1;
    let y = cs();
    y && !Ee.current && !Oe.current.some((L) => L.id === y) && (y = "", hi(""));
    const $ = z.current;
    y !== $ && (Vt(0), h || Te(null), !y && $ && (Me.current ?? (Me.current = { reviewId: $ }))), Q(y);
  }
  function Rr() {
    Me.current = "heading", Te(null), Ir();
  }
  function Ya(h) {
    h !== T && lr(h), Vt((y) => y + 1);
  }
  function zc() {
    Te(null), $t({
      review: Bc("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function Wc(h) {
    if (kt || !D) return;
    Te(null);
    const y = crypto.randomUUID();
    let $;
    const L = T;
    kn(!0);
    try {
      if (!await Yr((K) => ($ = Hl(
        K.find((ee) => ee.id === h.id) ?? h,
        K,
        y
      ), [...K, $]))) throw new Error("Could not save reviews.");
      if (!Ae.current) return;
      z.current !== L ? Te({ text: `Saved the copy “${$.name}”.`, alert: !1 }) : Ya($.id);
    } catch (Y) {
      Te({
        text: `“${h.name}” was not duplicated. ${Ea(Y)}`,
        alert: !0
      });
    } finally {
      kn(!1);
    }
  }
  async function Qc() {
    if (!lt || lt.saving) return;
    const h = { ...lt.review, name: lt.review.name.trim() }, y = oa(h);
    if (y) {
      $t({ ...lt, error: y });
      return;
    }
    $t({ ...lt, saving: !0, error: "" });
    try {
      if (!await Yr(($) => [...$, h]))
        throw new Error("Could not save reviews.");
      if (!Ae.current) return;
      $t(null), Ya(h.id);
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
  async function Hc() {
    if (!ft || ft.pending) return;
    const h = ft.review, y = Kc(t, te, ge, Ve).map((Y) => Y.id), $ = y.filter((Y) => Y !== h.id), L = $[Math.min(y.indexOf(h.id), $.length - 1)];
    Bt({ review: h, pending: !0 });
    try {
      if (!await Yr((Y) => Y.filter((K) => K.id !== h.id)))
        throw new Error("Could not save reviews.");
      Me.current = h.id !== T && L ? { reviewId: L } : "heading", Te({ text: `Deleted “${h.name}”.`, alert: !1 });
    } catch (Y) {
      Te({ text: `“${h.name}” was not deleted. ${Ea(Y)}`, alert: !0 });
    } finally {
      Bt(null);
    }
  }
  async function Yc(h) {
    if (!(kt || !D)) {
      Te(null), Kt(!0);
      try {
        const y = await Mu(h);
        let $ = 0;
        if (y.length && !await Yr((Y) => {
          const K = mi(Y, y);
          return $ = K.length - Y.length, $ ? K : Y;
        }))
          throw new Error("Could not save reviews.");
        const L = y.length - $;
        Te({
          alert: !1,
          text: y.length ? $ ? `Imported ${$ === 1 ? "1 review" : `${$} reviews`}.` + (L === 1 ? " 1 review already in the list stays as it is." : L ? ` ${L} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (y) {
        Te({ alert: !0, text: `Could not import “${h.name}”. ${Ea(y)}` });
      } finally {
        Kt(!1);
      }
    }
  }
  function Ea(h) {
    return h instanceof $s ? "Reviews changed in another browser. Reload the page to get them, then try again." : h instanceof Error ? h.message : "Try again.";
  }
  function yo(h) {
    const y = !D || kt;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ r(ys, { "aria-hidden": "true" }),
        disabled: y,
        onSelect: () => void Wc(h)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ r(ks, { "aria-hidden": "true" }),
        onSelect: () => oo(h)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ r(ji, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: y,
        onSelect: () => {
          Te(null), Bt({ review: h, pending: !1 });
        }
      }
    ];
  }
  function wo(h, y) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ r(Lr, { "aria-hidden": "true" }),
        ...y,
        disabled: y.disabled || $e
      },
      ...yo(h),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ r(da, { "aria-hidden": "true" }),
        separated: !0,
        disabled: $e,
        onSelect: Rr
      }
    ];
  }
  async function Yr(h) {
    if (!i) return !1;
    let y = [];
    const $ = await dd(i, (ee) => {
      y = ee;
      const wt = h(ee);
      return wt === ee ? ee : wt.map(rh);
    });
    if (n($), !Ae.current) return !0;
    const L = z.current;
    L && !$.some((ee) => ee.id === L) && Ir();
    const Y = y.find((ee) => ee.id === L), K = $.find((ee) => ee.id === L);
    return K && Y && ((K.view.reviewMode ?? "single") !== (Y.view.reviewMode ?? "single") && Ze(null), K.view.displayMode !== Y.view.displayMode && Nr(os(K))), !0;
  }
  function Xa(h) {
    return Yr((y) => nh(y, h));
  }
  function Xc(h) {
    return Xa(h).catch((y) => {
      throw z.current !== h.id && Za(h, y), y;
    });
  }
  function Za(h, y) {
    var L;
    if (!Ae.current) return;
    const $ = ((L = Oe.current.find((Y) => Y.id === h.id)) == null ? void 0 : L.name) ?? h.name;
    Te({ text: `“${$}” was not saved. ${Ea(y)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ r(ds, { label: "Loading reviews…" });
  if (u)
    return /* @__PURE__ */ l(me, { children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          onClick: () => void ch().catch(
            (h) => f(
              "Could not export browser reviews. " + (h instanceof Error ? h.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ r(
        us,
        {
          message: u,
          onRetry: () => void Qr()
        }
      )
    ] });
  const ei = /* @__PURE__ */ l(me, { children: [
    se && /* @__PURE__ */ r("p", { className: "dq-status", children: se }),
    et && (De == null ? void 0 : De.kind) === "missing" && /* @__PURE__ */ l("div", { role: "status", className: "dq-status", children: [
      De.message,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: nr,
          onClick: () => {
            Er(!0), tr(""), (At ? kd(ht) : Ed(ht)).then(p).catch(
              (h) => tr(
                `Could not create the ${At ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (h instanceof Error ? h.message : "Request failed.")
              )
            ).finally(() => Er(!1));
          },
          children: nr ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    et && ((De == null ? void 0 : De.kind) === "incompatible" || ya) && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(In, {}),
      ya || (De == null ? void 0 : De.message),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: nr,
          onClick: () => {
            Er(!0), p().finally(
              () => Er(!1)
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
            const h = localStorage.getItem("page-videos") ?? "[]", y = URL.createObjectURL(
              new Blob([h], { type: "application/json" })
            ), $ = document.createElement("a");
            $.href = y, $.download = "data-quality-unassigned-legacy-reviews.json", $.click(), URL.revokeObjectURL(y);
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
            N(""), V(!1);
          },
          children: A ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    rt && (rt.alert ? /* @__PURE__ */ l("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(In, { "aria-hidden": "true" }),
      rt.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ r("p", { className: "dq-status", "aria-hidden": "true", children: rt.text })
    ))
  ] });
  return /* @__PURE__ */ l(
    "div",
    {
      ref: ar,
      className: `data-quality-page${ir ? " dq-page-fit" : ""}`,
      style: ir ? {
        "--dq-fit-top": `${Jr.top}px`,
        "--dq-fit-bottom": `${Jr.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: rt && !rt.alert ? rt.text : "" }),
        F && it ? /* @__PURE__ */ r(
          jf,
          {
            review: re ?? F,
            canWrite: Pn ? w : Qt,
            canAssess: (De == null ? void 0 : De.kind) === "ready" && Qt,
            onBusy: dt,
            editRequest: Cn,
            onEditRequestHandled: () => Vt(0),
            onSaveDefaults: D ? Xc : void 0,
            pageControls: {
              onBack: Rr,
              moreItems: (h) => wo(re ?? F, h),
              onGrid: he ? () => Ze({ id: he.id, mode: "multiple" }) : void 0,
              notices: ei,
              busy: $e
            },
            stayOnTap: Ot,
            onStayOnTapChange: hn
          },
          F.id
        ) : F ? sl(F) : /* @__PURE__ */ r(
          Vf,
          {
            reviews: t,
            counts: te,
            sort: ge,
            direction: Ve,
            onSortChange: (h) => qt({ sort: h }),
            onDirectionChange: (h) => qt({ direction: h }),
            storage: zf[ne],
            canConfigure: D,
            busy: kt,
            headingRef: fn,
            notices: ei,
            onOpen: lr,
            onNew: () => zc(),
            onImport: (h) => void Yc(h),
            onExportAll: () => yc(t, "data-quality-reviews.json"),
            rowMenuItems: (h) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ r(Lr, { "aria-hidden": "true" }),
                disabled: !D || kt,
                onSelect: () => Ya(h.id)
              },
              ...yo(h)
            ]
          }
        ),
        bt && ie && he && /* @__PURE__ */ r(
          sh,
          {
            video: ie,
            review: he,
            selectedCount: Nt.size,
            pending: xe,
            refreshing: be || !!ve,
            error: on,
            canWrite: d,
            assessmentReady: (De == null ? void 0 : De.kind) === "ready",
            trees: Un,
            selected: Nt.has(ie.id),
            hasPrevious: I.indexOf(ie.id) > 0,
            hasNext: I.indexOf(ie.id) >= 0 && I.indexOf(ie.id) < I.length - 1,
            onToggleSelected: () => yt((h) => Ma(h, ie.id)),
            onPrevious: () => st(-1),
            onNext: () => st(1),
            onClose: () => {
              Lt(!1), Ge(gt.current);
            },
            onAction: Ke,
            findOpen: Zn,
            onFindOpenChange: rn
          }
        ),
        Zn && F && !it && !bt && /* @__PURE__ */ r(
          ao,
          {
            actions: F.actions,
            tagGroups: R,
            trees: Un,
            isDisabled: Sa,
            canStay: !1,
            onApply: (h) => {
              rn(!1), Ke(h);
            },
            onClose: () => rn(!1)
          }
        ),
        lt && /* @__PURE__ */ r(
          Jf,
          {
            draft: lt,
            onChange: (h) => $t((y) => y && { ...y, review: h, error: "" }),
            onCreate: () => void Qc(),
            onCancel: () => $t(null)
          }
        ),
        /* @__PURE__ */ r(
          Sl,
          {
            open: !!ft,
            title: "Delete review?",
            message: ft ? `“${ft.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (ft == null ? void 0 : ft.pending) ?? !1,
            onConfirm: () => void Hc(),
            onCancel: () => Bt((h) => h != null && h.pending ? h : null)
          }
        )
      ]
    }
  );
  async function ka(h, y, $ = !1, L = !0) {
    const Y = gt.current, K = Math.max(0, I.indexOf(Y ?? -1));
    try {
      const ee = E(
        h,
        y,
        $,
        h.view.selectAllOnLoad === !0
      ), wt = Tt.current, Ue = await ee;
      if (wt !== Tt.current) return;
      const ze = Ue.items.map((We) => We.id);
      Ht(
        (We) => new Set([...We].filter((Gn) => ze.includes(Gn)))
      );
      const qe = To(ze, Y, K);
      tt(qe), L && !Dt.current && Ge(qe, !1);
    } catch {
    }
  }
  function Zc(h) {
    const y = pn.current;
    if (pn.current = null, Hr || !F || !re) return;
    const $ = y ?? F.view.objectFilter, L = br(
      $,
      re.view.objectFilter
    ) ? re.view.objectFilter : $, Y = Ut({ ...h, page: 1 }), K = {
      ...F,
      view: {
        ...F.view,
        filter: Y,
        objectFilter: L
      }
    }, ee = !is(K, re), wt = ee ? K : re;
    Ct(ee ? K : null), an(ee ? "" : "Review queue defaults restored."), ka(wt, Y, !0);
  }
  function el() {
    if (xe || be || _t || !re) return;
    pn.current = null;
    const h = Ut({
      ...re.view.filter,
      page: 1
    });
    Ct(null), an("Review queue defaults restored."), ka(
      re,
      h,
      re.view.startFrom !== "beginning",
      !1
    );
  }
  function tl() {
    if (xe || be || ve || _t || !F || !sr || !D)
      return;
    const h = F, y = sr;
    Sr(!0), Xa(y).then(($) => {
      !$ || z.current !== y.id || (Ct(as(y, h)), an("Queue saved to this review."));
    }).catch(($) => {
      z.current !== y.id ? Za(y, $) : yn($ instanceof Error ? $.message : "Could not save queue.");
    }).finally(() => Sr(!1));
  }
  function ti() {
    if (!F || !re || bn.current || we || gn) return;
    Fn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, at.current = {
      temporaryReview: Fe,
      filter: k,
      loadedFilter: W,
      queue: ae,
      queueError: ve,
      retryFromEnd: Kr,
      selectedIds: new Set(Nt),
      focusedId: Le,
      pageCursor: jn.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const h = structuredClone({
      ...re,
      view: { ...re.view, startFrom: F.view.startFrom ?? "end" }
    });
    rn(!1), Lt(!1), an(""), yn(""), St({ draft: h, saving: !1, error: "" });
  }
  function vo() {
    St(null), at.current = null;
    const h = Fn.current;
    Fn.current = null, requestAnimationFrame(() => {
      (h == null ? void 0 : h.isConnected) && h !== document.body && !(h instanceof HTMLButtonElement && h.disabled) ? h.focus({ preventScroll: !0 }) : Ge(gt.current, !1);
    });
  }
  function nl() {
    var y;
    if (!we || we.saving) return;
    const h = at.current;
    h && (Tt.current += 1, (y = or.current) == null || y.abort(), pn.current = null, Ne(!1), Ct(h.temporaryReview), x(h.filter), pe(h.loadedFilter), Ie(h.queue), xt(h.queueError), Br(h.retryFromEnd), yt(() => h.selectedIds), tt(h.focusedId), jn.current = h.pageCursor, window.history.replaceState(window.history.state, "", h.url)), vo();
  }
  async function rl() {
    if (!we || we.saving || !sn || !F) return;
    const h = F, y = { ...sn, name: sn.name.trim() }, $ = oa(y);
    if ($) {
      St((L) => L && { ...L, error: $ });
      return;
    }
    St((L) => L && { ...L, saving: !0, error: "" });
    try {
      if (!await Xa(y)) throw new Error("Could not save reviews.");
      if (!Ae.current || z.current !== y.id) return;
      Ct(as(y, h)), _e(y) === "video" && na(y.id, {
        filter: k,
        objectFilter: h.view.objectFilter,
        searchMode: y.view.searchMode,
        startFrom: y.view.startFrom ?? "end"
      }), an("Review saved."), vo();
    } catch (L) {
      if (z.current !== y.id) {
        Za(y, L);
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
  function No() {
    F && E(F, k, Kr, mn).catch(() => {
    });
  }
  function al() {
    Ht(/* @__PURE__ */ new Set()), mt.current.clear(), tt(null);
  }
  function il(h) {
    !F || xe || _t || h === Number(k.page) || th(
      { ...k, page: h },
      F,
      (y, $) => E(y, $, !1, mn),
      al
    );
  }
  function ol(h) {
    if (!he || !re || xe || be || _t) return;
    const y = Of(he, h, re.view.objectFilter), $ = !is(y, re);
    Ct($ ? y : null), $ ? ka(y, { ...k, page: 1 }) : ka(
      re,
      { ...k, page: 1 },
      re.view.startFrom !== "beginning"
    );
  }
  function sl(h) {
    var Ue, ze;
    const y = Se === "tag", $ = y ? "tag" : "video", L = Math.max(1, Number(k.perPage) || 40), Y = Math.max(1, Math.ceil(ae.totalCount / L)), K = Math.min(Math.max(1, Number(k.page) || 1), Y), ee = [
      Ft ? "" : `${Ln} write permission is required to apply actions.`,
      y && j ? `Tag groups are unavailable. ${j}` : ""
    ].filter(Boolean), wt = !!on && !bt;
    return /* @__PURE__ */ l(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": y ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ r(
            Nc,
            {
              name: h.name,
              description: h.description,
              entityType: Se,
              onBack: Rr,
              backDisabled: xe || !!we || $e,
              onEdit: we ? () => {
                var qe;
                return (qe = Jt.current) == null ? void 0 : qe.focus();
              } : ti,
              editDisabled: !we && (xe || be || An || gn || $e || !D),
              editing: !!we,
              toolbar: /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: Hr, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: y ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ r(
                  ra,
                  {
                    filter: ve ? W : k,
                    onFilterChange: Zc,
                    totalCount: ae.totalCount,
                    sortOptions: y ? kl : ps,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Yt,
                    zoomLevel: (qr - 225) / 50,
                    onZoomChange: (qe) => ga(Math.round(225 + qe * 50)),
                    cardSizeEntityType: y ? "tags" : "videos",
                    criteriaDefinitions: y ? El : Li,
                    customFieldEntityType: Se === "video" ? "video" : void 0,
                    objectFilter: Ha,
                    onObjectFilterChange: (qe) => {
                      Hr || (pn.current = Se === "video" ? Ec(
                        qe,
                        rr,
                        h.view.objectFilter
                      ) : qe);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(qc, { page: K, pages: Y, onPage: il })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ l(me, { children: [
                he && /* @__PURE__ */ r(
                  Sc,
                  {
                    mode: "multiple",
                    disabled: xe || be || vt || !!we || gn || $e,
                    onChange: () => Ze({ id: he.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ r(
                  Vu,
                  {
                    options: y ? Yf : Hf,
                    value: Yt,
                    onChange: (qe) => Nr(ss(qe, Se))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ r(
                so,
                {
                  disabled: xe || !!we,
                  items: wo(re ?? h, {
                    onSelect: ti,
                    disabled: be || An || gn || !D
                  })
                }
              ),
              queueDiffers: J ? (Fe == null ? void 0 : Fe.id) === T : void 0,
              queueChange: !we && (Fe == null ? void 0 : Fe.id) === T ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: Wr ? tl : void 0,
                saveDisabled: xe || be || !!ve || _t || !D,
                onReset: el,
                resetDisabled: xe || be || _t
              } : void 0,
              chipsAfter: (ze = (Ue = he == null ? void 0 : he.presentation) == null ? void 0 : Ue.binParents) != null && ze.length ? /* @__PURE__ */ r(
                Rf,
                {
                  videos: ae.items,
                  review: he,
                  savedObjectFilter: (re ?? he).view.objectFilter,
                  trees: tn.ids,
                  disabled: xe || be || _t,
                  onToggle: ol
                }
              ) : void 0,
              chipsEnd: we ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          ei,
          he && tn.error && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: tn.error }),
          /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
            we && sn && /* @__PURE__ */ r(
              vc,
              {
                drawerRef: Jt,
                draft: sn,
                onChange: (qe) => St((We) => We && { ...We, draft: qe }),
                direction: we.draft.view.startFrom ?? "end",
                onDirectionChange: (qe) => St(
                  (We) => We && {
                    ...We,
                    draft: { ...We.draft, view: { ...We.draft.view, startFrom: qe } }
                  }
                ),
                tagGroups: R,
                trees: Un,
                saving: we.saving,
                saveDisabled: be || !!ve,
                error: we.error,
                dirty: Na,
                criteriaChanged: Wr,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  ve && !be ? /* @__PURE__ */ l("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ r(In, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { children: [
                      "The queue could not load: ",
                      ve,
                      " ",
                      /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", onClick: No, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void rl(),
                onCancel: nl
              }
            ),
            /* @__PURE__ */ l(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${Qa}px` },
                children: [
                  /* @__PURE__ */ l("div", { className: "dq-grid-content", children: [
                    be && !ae.items.length && /* @__PURE__ */ r(ds, { label: "Loading review queue…" }),
                    ve && !be && /* @__PURE__ */ r(
                      us,
                      {
                        message: ve,
                        retryLabel: An ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (An && re && _e(re) === "video") {
                            const qe = yr(re);
                            na(re.id, { ...qe, filter: { ...qe.filter, page: void 0 } }), Mt((We) => We + 1);
                            return;
                          }
                          No();
                        }
                      }
                    ),
                    !xe && !be && !ve && !ae.items.length && /* @__PURE__ */ l("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ r(Ba, {}),
                      /* @__PURE__ */ l("p", { children: [
                        "No ",
                        $,
                        "s match this review."
                      ] })
                    ] }),
                    !!ae.items.length && /* @__PURE__ */ r("div", { ref: kr, children: /* @__PURE__ */ r(
                      "div",
                      {
                        className: Yt === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${qr}px` },
                        children: ae.items.map(cl)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ r("div", { className: "dq-bar-dock", ref: zr, children: /* @__PURE__ */ r(
                    dc,
                    {
                      actions: we ? we.draft.actions : h.actions,
                      tagGroups: R,
                      trees: Un,
                      isDisabled: Sa,
                      paused: !!we,
                      busy: xe || be,
                      onApply: (qe) => void Ke(qe),
                      onFind: () => rn(!0),
                      status: xe ? `Applying action to ${ba}…` : "",
                      summary: /* @__PURE__ */ l(me, { children: [
                        /* @__PURE__ */ r("p", { className: "dq-bar-target", children: Nt.size ? `${Nt.size} selected` : Le == null ? "Nothing to apply to" : `Applies to the focused ${$}` }),
                        /* @__PURE__ */ l(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !I.length || It,
                            onClick: () => yt((qe) => /* @__PURE__ */ new Set([...qe, ...I])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ r(ct, { binding: qa.selectAll, hidden: !0 })
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
                      keyHints: y ? "Arrows move · Space selects · Enter opens" : we ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews",
                      notices: wt || nt ? /* @__PURE__ */ l(me, { children: [
                        wt && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ r(In, { "aria-hidden": "true" }),
                          on
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
  function cl(h) {
    var $, L, Y;
    if (Se === "tag") {
      const K = h;
      return /* @__PURE__ */ r(
        ah,
        {
          tag: K,
          displayMode: Yt === "list" ? "list" : "grid",
          focused: K.id === Le,
          selected: Nt.has(K.id),
          setRef: (ee) => {
            ee ? Dn.current.set(K.id, ee) : Dn.current.delete(K.id);
          },
          onFocus: () => tt(K.id),
          onToggle: () => {
            yt((ee) => Ma(ee, K.id)), Ge(K.id, !1);
          },
          onOpen: () => window.open(`/tag/${K.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        K.id
      );
    }
    const y = h;
    return /* @__PURE__ */ r(
      ih,
      {
        video: If(y, he, tn.ids),
        showTagBins: ((L = ($ = he == null ? void 0 : he.presentation) == null ? void 0 : $.annotations) == null ? void 0 : L.includes("tags")) && !!((Y = he.presentation.annotationParents) != null && Y.length),
        displayMode: Yt,
        cardsScroll: Cr,
        focused: y.id === Le,
        selected: Nt.has(y.id),
        setRef: (K) => {
          K ? Dn.current.set(y.id, K) : Dn.current.delete(y.id);
        },
        onFocus: () => tt(y.id),
        onToggle: () => yt((K) => Ma(K, y.id)),
        onPreview: () => {
          we || (tt(y.id), Lt(!0));
        },
        onNavigate: e
      },
      y.id
    );
  }
}
function th(e, t, n, a) {
  a(), n(t, e).catch(() => {
  });
}
function Ma(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function nh(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function rh(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function ah({
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
      onClick: (f) => {
        o(), f.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${n ? "focused" : ""} ${a ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ r(
        Cl,
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
            onClick: (f) => {
              f.stopPropagation(), s();
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
function ih({
  video: e,
  showTagBins: t,
  displayMode: n,
  cardsScroll: a,
  focused: i,
  selected: o,
  setRef: s,
  onFocus: c,
  onToggle: u,
  onPreview: f,
  onNavigate: d
}) {
  var S, b;
  const m = Vc(e), g = O(null), v = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, w = !!(v.date || v.studioName), q = !!(v.performers.length || v.tags.length);
  return Rt(() => {
    const R = g.current;
    if (!R) return;
    const M = R.querySelector(
      `a[href="/video/${e.id}"]`
    ), j = R.querySelector(".card-title"), G = `dq-card-title-${e.id}`;
    j && (j.id = G), M && (M.target = "_blank", M.rel = "noreferrer", M.removeAttribute("aria-label"), M.setAttribute("aria-labelledby", G), M.classList.add("dq-card-link"));
    const D = R.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    D && D.setAttribute(
      "aria-label",
      o ? `Deselect ${m}` : `Select ${m}`
    );
    const Z = R.querySelector(
      'button[title="Quick View"]'
    );
    Z && Z.setAttribute("aria-label", `Preview ${m}`);
  }), /* @__PURE__ */ l(
    "article",
    {
      ref: (R) => {
        g.current = R, s(R);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${m}${o ? ", selected" : ""}`,
      onFocus: c,
      onClick: (R) => {
        c(), R.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${w ? "has-card-metadata" : "no-card-metadata"} ${q ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ r(
          Al,
          {
            video: v,
            selected: o,
            onSelect: u,
            onNavigate: d,
            onQuickView: f,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ l("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (S = e.tags) == null ? void 0 : S.map((R) => /* @__PURE__ */ r("span", { children: R.name }, R.id)),
          !((b = e.tags) != null && b.length) && /* @__PURE__ */ r("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ r(oh, { video: e, cardsScroll: a })
      ]
    }
  );
}
function oh({ video: e, cardsScroll: t }) {
  const n = O(null), a = O(null), [i, o] = C(!1), [s, c] = C(!1), [u, f] = C(!1);
  return H(() => {
    const d = n.current;
    if (!d || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), c(!0);
      return;
    }
    const m = t ? d.closest(".dq-grid-stage") : null, g = new IntersectionObserver(
      ([w]) => o(w.isIntersecting),
      { root: m, rootMargin: "320px 0px", threshold: 0 }
    ), v = new IntersectionObserver(
      ([w]) => c(w.isIntersecting && w.intersectionRatio >= 0.6),
      { root: m, threshold: [0, 0.6, 1] }
    );
    return g.observe(d), v.observe(d), () => {
      g.disconnect(), v.disconnect();
    };
  }, [e.id, e.files.length, t]), H(() => {
    if (!i) {
      f(!1);
      return;
    }
    const d = new AbortController();
    return de(Nd(e.id), {
      signal: d.signal
    }).then((m) => {
      d.signal.aborted || f(m.available === !0);
    }).catch(() => {
      d.signal.aborted || f(!1);
    }), () => d.abort();
  }, [i, e.id]), H(() => {
    const d = a.current;
    d && (s ? Promise.resolve(d.play()).catch(() => {
    }) : d.pause());
  }, [u, s]), /* @__PURE__ */ r("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: u && /* @__PURE__ */ r(
    "video",
    {
      ref: a,
      src: vd(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function sh({
  video: e,
  review: t,
  selectedCount: n,
  pending: a,
  refreshing: i,
  error: o,
  canWrite: s,
  assessmentReady: c,
  trees: u,
  selected: f,
  hasPrevious: d,
  hasNext: m,
  onToggleSelected: g,
  onPrevious: v,
  onNext: w,
  onClose: q,
  onAction: S,
  findOpen: b,
  onFindOpenChange: R
}) {
  const M = O(null), j = pa(), G = O(null), D = e.files[0], Z = Vc(e), ne = (N) => a || i || "steps" in N && N.steps.length > 0 && !s || Wn(N) && !c;
  to({
    surface: "overlay",
    enabled: !b,
    actions: t.actions,
    onAction: (N) => {
      const A = t.actions[N];
      A && S(A);
    },
    onFind: () => R(!0)
  }), H(() => {
    var A;
    const N = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (A = M.current) == null || A.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = N;
    };
  }, []);
  function oe(N) {
    var J, ue, ce;
    if (N.key !== "Tab") return;
    const A = [
      ...((J = M.current) == null ? void 0 : J.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((B) => B.offsetParent !== null);
    if (!A.length) {
      N.preventDefault(), (ue = M.current) == null || ue.focus();
      return;
    }
    const V = A.indexOf(
      document.activeElement
    );
    N.shiftKey && V <= 0 ? (N.preventDefault(), (ce = A.at(-1)) == null || ce.focus()) : !N.shiftKey && V === A.length - 1 && (N.preventDefault(), A[0].focus());
  }
  function se(N) {
    if (b || N.defaultPrevented || N.ctrlKey || N.metaKey || N.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const A = N.key === "ArrowLeft" || N.key === "ArrowRight";
    if (N.altKey && !A) return;
    const V = G.current, J = N.currentTarget.querySelector("video");
    if (N.key === "Enter" || N.key === "Escape")
      N.repeat || q();
    else if (N.key === " " && V)
      N.repeat || V.toggle();
    else if (A && V)
      V.seekBy(
        (N.key === "ArrowLeft" ? -1 : 1) * (N.shiftKey ? 5 : N.altKey ? 10 : 60)
      );
    else if ((N.key === "," || N.key === ".") && V) {
      const ue = [D == null ? void 0 : D.duration, J == null ? void 0 : J.duration].find(
        (B) => B != null && Number.isFinite(B) && B > 0
      ) ?? 0, ce = e.parentVideoId != null ? (e.clipEndSec ?? ue) - (e.clipStartSec ?? 0) : ue;
      Number.isFinite(ce) && ce > 0 && V.seekBy((N.key === "," ? -1 : 1) * ce * 0.1);
    } else if (N.key.toLowerCase() === "n" || N.key.toLowerCase() === "m")
      !N.repeat && !a && !i && (N.key.toLowerCase() === "n" && d && v(), N.key.toLowerCase() === "m" && m && w());
    else if (N.key === "ArrowUp" && J)
      J.volume = Math.min(1, J.volume + 0.1);
    else if (N.key === "ArrowDown" && J)
      J.volume = Math.max(0, J.volume - 0.1);
    else return;
    Mr(N);
  }
  function _(N) {
    const A = M.current, V = N.target instanceof Element ? N.target.closest("button, a[href]") : null;
    !A || !V || !A.contains(V) || V.closest(".dq-player, .dq-find-action") || N.detail === 0 || A.focus({ preventScroll: !0 });
  }
  H(() => {
    if (b) return;
    let N = 0;
    const A = requestAnimationFrame(() => {
      N = requestAnimationFrame(() => {
        var J;
        const V = document.activeElement;
        (J = M.current) != null && J.isConnected && (!V || V === document.body || V === document.documentElement) && M.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(A), cancelAnimationFrame(N);
    };
  }, [b, a, i, m, d, e.id, j]);
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
      onKeyDown: oe,
      onKeyDownCapture: se,
      onMouseDown: (N) => {
        N.target === N.currentTarget && q();
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
                disabled: !d || a || i,
                onClick: v,
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
                onClick: w,
                children: [
                  !j && /* @__PURE__ */ r(ct, { binding: "m", hidden: !0 }),
                  /* @__PURE__ */ r(Ss, { "aria-hidden": "true" })
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
                "aria-pressed": f,
                disabled: i,
                onClick: g,
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-preview-check", "aria-hidden": "true", children: f && /* @__PURE__ */ r(Ka, {}) }),
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
                children: /* @__PURE__ */ r(Es, { "aria-hidden": "true" })
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
                children: /* @__PURE__ */ r(la, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ r("div", { className: "dq-preview-video", children: D ? /* @__PURE__ */ r(
            ms,
            {
              autostart: !0,
              streamUrl: vi("video", e.id),
              posterUrl: Mo(e),
              format: D.format,
              audioCodec: D.audioCodec,
              duration: D.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onPlaybackControlRegister: (N) => (G.current = N, () => {
                G.current === N && (G.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ r("img", { src: Mo(e), alt: "" }) }) }),
          o && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert dq-preview-alert", children: o }),
          !j && /* @__PURE__ */ l("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ r("span", { children: "Space play / pause" }),
            /* @__PURE__ */ r("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ r("span", { children: ", . ±10 %" }),
            /* @__PURE__ */ r("span", { children: "↑ ↓ volume" }),
            /* @__PURE__ */ r("span", { children: "N M previous / next" }),
            /* @__PURE__ */ r("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ r(
            dc,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: u,
              isDisabled: ne,
              busy: a || i,
              onApply: (N) => void S(N),
              onFind: () => R(!0),
              status: a ? `Applying action to ${U}…` : "",
              summary: /* @__PURE__ */ r("p", { className: "dq-bar-target", children: n ? `${n} selected` : "This video" })
            }
          )
        ] }),
        b && /* @__PURE__ */ r(
          ao,
          {
            actions: t.actions,
            trees: u,
            isDisabled: ne,
            canStay: !1,
            onApply: (N) => {
              R(!1), S(N);
            },
            onClose: () => R(!1)
          }
        )
      ]
    }
  );
}
async function ch() {
  const e = await de("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
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
function ds({ label: e }) {
  return /* @__PURE__ */ l("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ r(_l, { className: "dq-spin" }),
    e
  ] });
}
function us({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ l("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ r(In, {}),
    /* @__PURE__ */ r("p", { children: e }),
    /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const ph = { components: { DataQualityPage: eh } };
export {
  eh as DataQualityPage,
  ph as default,
  br as objectFiltersEqual
};
