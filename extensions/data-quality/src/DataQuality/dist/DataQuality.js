import { jsxs as l, Fragment as ye, jsx as r } from "react/jsx-runtime";
import { useState as A, useRef as R, useEffect as H, useLayoutEffect as kt, useMemo as me, useCallback as Sn, useSyncExternalStore as Di, useId as at, createContext as yl, useContext as wl, Fragment as _i } from "react";
import { useKeySequence as vl, EntityReferenceMultiSelector as Yn, SortableList as bs, TagBadge as Nl, EntityReferenceSelector as Ro, EntityDetailTabs as ql, DetailListToolbar as aa, PERFORMER_CRITERIA as ji, AUDIO_CRITERIA as ys, VIDEO_CRITERIA as Ui, NarrativeText as Sl, AUDIO_SORT_OPTIONS as kl, VIDEO_SORT_OPTIONS as ws, AudioPlayer as El, VideoPlayer as vs, formatDuration as Ns, FilterDialog as Cl, getResolutionLabel as Al, ConfirmDialog as Tl, TAG_CRITERIA as Il, TAG_SORT_OPTIONS as Rl, TagTile as $l, VideoCard as Ol } from "@cove/runtime/components";
import { Search as la, Flag as Fn, Check as da, Pencil as Dr, Ban as Da, ChevronDown as Gi, Plus as Va, Pin as qs, GripVertical as Ss, AlertTriangle as On, Copy as ks, Trash2 as Ki, X as ua, Mic as Ml, Users as Es, Tag as Cs, Headphones as As, Film as za, ChevronLeft as fa, MoreHorizontal as Fl, RectangleHorizontal as xl, LayoutGrid as Bi, ChevronRight as Ts, Save as Pl, RotateCcw as Ll, Layers as $o, Undo2 as Dl, RefreshCw as _l, ExternalLink as Is, SkipForward as jl, Upload as Ul, Download as Rs, ArrowUp as Gl, ArrowDown as Kl, Loader2 as Bl, List as Vl, Grid3X3 as zl } from "@cove/runtime/lucide-react";
import { extensionFetch as Jl } from "@cove/runtime/api";
import { createPortal as Wl } from "react-dom";
const Vi = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, zi = Object.keys(
  Vi
);
function ia(e) {
  return e === "excludes" || e === "excludesAll";
}
function Ji(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
function $s(e) {
  const t = [...e.performerFlags ?? []];
  for (const n of e.flagPerformerTagIds ?? [])
    t.some((a) => a.tagId === n && a.categoryTagId === void 0) || t.push({ tagId: n });
  return t;
}
function Hl(e, t) {
  const { performerFlags: n, flagPerformerTagIds: a, ...i } = e, o = [];
  for (const s of t)
    o.some(
      (c) => c.tagId === s.tagId && c.categoryTagId === s.categoryTagId
    ) || o.push(
      s.categoryTagId === void 0 ? { tagId: s.tagId } : { tagId: s.tagId, categoryTagId: s.categoryTagId }
    );
  return o.length ? { ...i, performerFlags: o } : i;
}
const Os = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Ie(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function Wi(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function Ue(e) {
  return Wi(je(e));
}
function Ql(e) {
  return je(e) === "video";
}
function je(e) {
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
], oa = [
  Wn.slice(0, 11),
  Wn.slice(11, 22),
  Wn.slice(22)
], Hn = "none";
function gr(e) {
  return typeof e == "string" && Wn.includes(e);
}
function Hi(e) {
  const t = e.shortcut;
  return gr(t) || t === Hn ? t : "auto";
}
function Ms(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), i = [];
  e.forEach((s, c) => {
    const u = Hi(s);
    if (u !== Hn) {
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
  const o = Wn.filter((s) => !n.has(s));
  return i.forEach((s, c) => {
    const u = o[c];
    u !== void 0 && (t[s] = u, n.set(u, s));
  }), { keys: t, actionOn: n, duplicatePins: a };
}
function Yl(e, t, n) {
  const { keys: a, actionOn: i } = Ms(e), o = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (gr(n)) {
    const c = i.get(n), u = a[t];
    c !== void 0 && c !== t && o.set(c, u && e[t].shortcut === u ? u : void 0);
  }
  const s = new Set([...o.values()].filter(gr));
  return e.map((c, u) => {
    const p = o.has(u) ? o.get(u) : gr(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (p === c.shortcut) return c;
    const { shortcut: d, ...g } = c;
    return p === void 0 ? g : { ...g, shortcut: p };
  });
}
function sa(e) {
  return Ie(e) && !xs(e.occurrence) ? "Complete the optional occurrence condition before saving." : !Ql(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : je(e) !== "tag" && e.actions.some(
    (t) => Qi(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => xn(t, je(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const Xl = {
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
      Math.min(Xl[t], n(e.perPage, 40))
    )
  };
}
function Oo(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function Jn(e) {
  const { page: t, ...n } = e.view.filter, a = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Ie(e) ? [e.entityType, ...a, e.occurrence] : je(e) === "video" ? a : [je(e), ...a]
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
  ) && !Qi(e) : !1;
}
function Zl(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function Mn(e) {
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
  return "steps" in e ? e.steps.some((t) => Mn(t.mode)) : !1;
}
function Qi(e) {
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
      (a) => typeof (a == null ? void 0 : a.id) == "string" && typeof a.label == "string" && (a.shortcut === void 0 || typeof a.shortcut == "string") && (n.entityType === "tag" ? "effect" in a && !("steps" in a) && !("group" in a) && xn(a, "tag") : "steps" in a && !("effect" in a) && Array.isArray(a.steps) && a.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && (a.group === void 0 || typeof a.group == "string") && xn(a, "video"))
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
    (a) => a === void 0 || Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function bi(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const a of e)
    for (const i of a)
      n.has(i.id) || (n.add(i.id), t.push(i));
  return t;
}
function td(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), a = new Set(t.map((c) => n(c.name))), i = e.trim(), o = i.replace(/ copy(?: \d+)?$/i, ""), s = `${o !== i && a.has(n(o)) ? o : i} copy`;
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
  const t = e, n = (a) => Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(a).size === a.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && zi.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || rd(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function rd(e) {
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
function Mo(e, t) {
  return e.size > 0 ? [...e].sort((n, a) => n - a) : t == null ? [] : [t];
}
function Fo(e, t, n, a) {
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
function ad(e, t) {
  const n = new Set(e), a = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    a ? n.delete(i) : n.add(i);
  return n;
}
function id(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function Pn(e) {
  const t = "nativeEvent" in e ? e.nativeEvent : e;
  return t.isComposing || t.keyCode === 229;
}
function od(e) {
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
const Ps = "ext:com.midnightrider.data-quality:configuration", dd = "ext:cove-data-quality:video-reviews", yi = "ext:com.midnightrider.data-quality:progress";
class Ls extends Error {
}
const pa = /* @__PURE__ */ new Map(), Ia = /* @__PURE__ */ new Map(), hr = (e, t) => e.includes("*") || e.includes(t), _a = (e) => he(`/api/savedfilters?mode=${encodeURIComponent(e)}`), ud = () => ({
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
    deletedIds: wi(t.deletedIds),
    importedIds: wi(t.importedIds)
  };
}
function fd(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const a = /* @__PURE__ */ new Set();
  for (const i of t) {
    const o = localStorage.getItem(i);
    if (o !== null) {
      const s = ha(o);
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
async function Ds(e) {
  const t = await he("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Yi(e, t) {
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
  const e = await he("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return Yi(t, () => md(e, t));
}
async function md(e, t) {
  var m;
  const n = String(e.user.id), a = hr(e.permissions, "savedfilters.read"), i = a && hr(e.permissions, "savedfilters.write"), o = a ? (await _a(Ps)).filter((b) => b.name === "Data Quality configuration").sort((b, w) => b.id - w.id) : [];
  if (o.length > 1) {
    const b = (w) => {
      const { revision: S, ...N } = Mr(w.uiOptions);
      return JSON.stringify(N);
    };
    if (o.some((w) => b(w) !== b(o[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (i)
      for (const w of o.slice(1))
        await he(`/api/savedfilters/${w.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${w.id}` })
        });
    o.splice(1);
  }
  let s = o.length ? Mr(o[0].uiOptions) : ud();
  const c = localStorage.getItem(`${t}:migrated`) === "true", u = localStorage.getItem(t), p = localStorage.getItem(`${t}:local-only`) === "true";
  !o.length && u && (s = Mr(u));
  let d = !o.length;
  if (o.length && p && u) {
    const b = Mr(u);
    if (b.reviews.some((S) => {
      const N = s.reviews.find((v) => v.id === S.id);
      return N && JSON.stringify(N) !== JSON.stringify(S);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const w = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...b.deletedIds])
    ];
    s = {
      ...s,
      reviews: bi(s.reviews, b.reviews).filter(
        (S) => !w.includes(S.id)
      ),
      deletedIds: w,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...b.importedIds])
      ]
    }, d = !0;
  }
  if (!c) {
    const b = JSON.stringify(s), w = fd(n);
    if (o.length && w.reviews.some((T) => {
      const M = s.reviews.find((j) => j.id === T.id);
      return M && JSON.stringify(M) !== JSON.stringify(T);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const S = a ? (await _a(dd)).flatMap(
      (T) => ha(T.uiOptions ?? "[]")
    ) : [], N = w.known.filter(
      (T) => !w.reviews.some((M) => M.id === T)
    ), v = /* @__PURE__ */ new Set([...s.deletedIds, ...N]);
    s = {
      ...s,
      reviews: bi(
        w.reviews,
        s.reviews,
        S.filter(
          (T) => !w.known.includes(T.id) && !s.importedIds.includes(T.id)
        )
      ).filter((T) => !v.has(T.id)),
      deletedIds: [...v],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...w.known,
          ...S.map((T) => T.id)
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
  if (pa.set(t, g), d && i) {
    const b = s;
    o.length && (g.config = Mr(o[0].uiOptions)), await _s(t, b), s = g.config;
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
    canWrite: hr(e.permissions, "videos.write"),
    canWriteVideos: hr(e.permissions, "videos.write"),
    canWriteAudios: hr(e.permissions, "audios.write"),
    canWriteTags: hr(e.permissions, "tags.write"),
    canReadTagGroups: hr(e.permissions, "taggroups.read"),
    canConfigure: !a || i,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: a ? i ? "account" : "readOnly" : "browser",
    storageNotice: a ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
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
      const o = await he(
        `/api/savedfilters/${n.recordId}`
      );
      if (Mr(o.uiOptions).revision !== n.config.revision)
        throw new Ls(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await he(
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
    n.recordId = i.id;
  } else
    localStorage.setItem(e, JSON.stringify(a)), localStorage.setItem(`${e}:local-only`, "true");
  if (n.config = a, n.durable)
    try {
      localStorage.setItem(e, JSON.stringify(a)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function gd(e, t) {
  return Yi(e, async () => {
    const n = pa.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const a = n.config.reviews, i = t(a);
    if (i === a) return a;
    ha(JSON.stringify(i));
    const o = a.filter((s) => !i.some((c) => c.id === s.id)).map((s) => s.id);
    return await _s(e, {
      ...n.config,
      reviews: i,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...o])
      ].filter((s) => !i.some((c) => c.id === s))
    }), i;
  });
}
function xo(e) {
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
  const a = localStorage.getItem(`${e}:progress:${t}`), i = a ? xo(a) : null;
  if (!n.readable) return i;
  const o = (await _a(yi)).find(
    (c) => c.name === t
  ), s = o ? xo(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function yd(e, t, n) {
  const a = `${e}:progress:${t}`;
  try {
    localStorage.setItem(a, JSON.stringify(n));
  } catch {
  }
  return Yi(a, async () => {
    const i = pa.get(e);
    if (!(i != null && i.writable)) return;
    await Ds(i);
    const o = (await _a(yi)).find(
      (s) => s.name === t
    );
    await he(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: yi,
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
function En(e) {
  return wd[e];
}
const ja = "confirmed_absent_tags", Xi = "Confirmed absent tags", Ja = "confirmed_absent_occurrence_tags", js = {
  key: ja,
  label: Xi,
  type: "tag",
  subject: "tag assessments"
}, Zi = {
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
  const i = await Jl(e, { ...t, headers: a });
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
async function he(e, t = {}) {
  return await Us(e, t, "fail");
}
function Nd(e, t = {}) {
  return Us(e, t, "null");
}
const qd = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Sd = 0;
function vi(e, t) {
  return he(
    `/api/${Zn(e)}/${t}?dqRead=${qd}-${++Sd}`,
    { cache: "no-store" }
  );
}
function Gs(e, t) {
  const n = { ...e.view.objectFilter }, a = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Ln({
      findFilter: Kt(t, Ue(e)),
      objectFilter: n,
      filterExpression: a
    })
  );
}
async function na(e, t, n) {
  return he(
    `/api/${Zn(Ue(e))}/find`,
    { method: "POST", signal: n, body: Gs(e, t) }
  );
}
async function kd(e, t, n) {
  return (await he(
    `/api/${Zn(Ue(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Gs(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function Po(e, t, n) {
  const a = { ...e.view.objectFilter };
  return delete a._filterExpression, he("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Ln({
        findFilter: Kt(t),
        objectFilter: a
      })
    )
  });
}
function Ed(e) {
  return he("/api/taggroups", { signal: e });
}
function Ni(e, t, n = 1280) {
  return `/api/${Zn(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function qi(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Lo(e) {
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
    await he(`/api/tags/${a}`, { signal: t }), n.add(a);
    for (let i = 1; ; i++) {
      const o = await he("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Ln({
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
async function eo(e, t) {
  const n = Xn(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await Wa(i.tagIds, t)).filter(
          (o) => !n.has(o)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function Id(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function to(e, t) {
  const a = (await he("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!a)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = Id(e, a);
  return i ? { kind: "incompatible", message: i } : a.entityTypes.includes(t) ? { kind: "ready", definition: a, message: "" } : {
    kind: "missing",
    message: `Add ${En(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: a
  };
}
async function Ks(e, t) {
  const n = await to(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await he(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await he("/api/custom-fields", {
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
  return to(js, e);
}
function Rd(e = "video") {
  return Ks(js, e);
}
function Vs(e = "video") {
  return to(Zi, e);
}
function $d(e = "video") {
  return Ks(Zi, e);
}
function Ua(e) {
  return [...new Set(e)];
}
function zs(e, t) {
  const n = e.customFields ?? {}, a = Object.keys(n).find(
    (o) => o.toLowerCase() === Ja
  ), i = a === void 0 ? [] : n[a];
  return Ua(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function Od(e) {
  let t;
  try {
    t = await Vs(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${Zi.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Md(e, t, n, a, i, o) {
  await he(`/api/${Zn(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: Ua(i).map((s) => `${a}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function Fd(e, t, n) {
  const a = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${Xi} custom field is not available.`
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
async function Js(e, t, n) {
  if (!xn(t) || n.length === 0 || n.some((u) => !Number.isSafeInteger(u) || u <= 0))
    throw new Error(
      `Choose ${En(e).many} and configure a valid action first.`
    );
  let a = null;
  if (Qn(t)) {
    let u;
    try {
      u = await Bs(e);
    } catch (p) {
      throw new Error(
        `Could not verify the ${Xi} custom field. ${p instanceof Error ? p.message : "Request failed."}`
      );
    }
    if (u.kind !== "ready") throw new Error(u.message);
    a = u.definition.key;
  }
  const i = Ua(n), o = (await eo(t)).map((u) => ({
    mode: u.mode,
    tagIds: Ua(u.tagIds)
  })), c = [
    ...o.filter((u) => !Mn(u.mode)),
    ...o.filter((u) => Mn(u.mode))
  ].map(
    (u) => Fd(u, i, a)
  );
  for (let u = 0; u < c.length; u++)
    try {
      await he(`/api/${Zn(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(c[u])
      });
    } catch (p) {
      throw new Error(
        `Step ${u + 1} failed; ${u} earlier step(s) completed. Refresh and check the selected ${En(e).many} before retrying. ${p instanceof Error ? p.message : "Request failed."}`
      );
    }
}
async function xd(e, t) {
  if (!xn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await he("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const Ra = (e) => e >= "0" && e <= "9";
function Do(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function _o(e, t) {
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
    const o = Do(e[n]), s = Do(t[a]);
    if (o !== s) return o < s ? -1 : 1;
    n++, a++;
  }
  const i = e.length - n - (t.length - a);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function Ws(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, a = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(a(e) - a(t)) || _o(e.tagGroupName, t.tagGroupName) || _o(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function br(e) {
  return [...e].sort(Ws);
}
const Si = /* @__PURE__ */ new Map();
function Pd(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const a of n.steps)
        a.mode === "REMOVE_TREE" && a.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function no(e, t, n) {
  const a = Xn(e), i = [], o = [];
  for (const m of e.steps) {
    if (m.mode !== "REMOVE_TREE") {
      o.push(m);
      continue;
    }
    const b = m.tagIds.flatMap((w) => {
      const S = n.get(w);
      return S || i.push(w), S ?? [w];
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
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, a] = A(() => /* @__PURE__ */ new Map()), i = R(/* @__PURE__ */ new Set()), o = R(!0);
  return H(() => (o.current = !0, () => {
    o.current = !1;
  }), []), H(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      i.current.has(c) || (i.current.add(c), Wa([c]).then(
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
function jo(e) {
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
function ki(e, t) {
  const n = Ys(t), a = new Set(t.absent);
  return wr(e).map((i) => {
    const o = [], s = [];
    for (const c of i.actions) {
      const u = [...Xn(e[c])], p = [...Xs(e[c])], d = [
        ...u.map((g) => n.has(g)),
        ...p.map((g) => a.has(g))
      ];
      d.some(Boolean) && (s.push(c), d.every(Boolean) && o.push(c));
    }
    return { ...i, answers: o.length ? o : s };
  });
}
function Ei(e) {
  return e.filter((t) => t.answers.length === 0);
}
function _d(e, t, n) {
  const a = { ids: [...Ys(t)], absent: t.absent }, i = no(e, a, n), o = new Set(i.removed), s = new Set(i.absenceCleared);
  return {
    ids: [...a.ids.filter((c) => !o.has(c)), ...i.added],
    absent: [...a.absent.filter((c) => !s.has(c)), ...i.markedAbsent]
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
function Uo(e, t, n) {
  const a = /* @__PURE__ */ new Map(), i = (s, c) => {
    const u = a.get(s) ?? c();
    return a.set(s, u), u;
  };
  for (const s of pr(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const u = c.categoryTagId === void 0 ? i(xr, () => ({
        key: xr,
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
    ...o.filter((s) => s.key === xr),
    ...o.filter((s) => s.key !== xr)
  ];
}
function Ci(e, t, n) {
  return e !== n.key && e.startsWith("tag:") && n.members.every((a) => t.includes(a));
}
function ro(e) {
  const t = e.flatMap((i) => i.mixed), n = (i, o) => t.some(
    (s, c) => Ci(s.key, s.members, i) && !(c > o && Ci(i.key, i.members, s))
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
function Gd(e, t) {
  return t.filter(
    (n) => n.key === e.key || Ci(n.key, n.tagIds ?? [], e)
  );
}
function ec(...e) {
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
    ...n.filter((a) => a.key === xr),
    ...n.filter((a) => a.key !== xr)
  ];
}
function Kd(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e.steps)
    if (a.mode !== "CLEAR_ABSENCE")
      for (const i of a.tagIds)
        for (const o of a.mode === "REMOVE_TREE" ? t.get(i) ?? [i] : [i])
          n.add(o);
  return n;
}
function tc(e, t, n) {
  if (t.tagIds === null) return !0;
  const a = Kd(e, n);
  return t.tagIds.some((i) => a.has(i));
}
function Bd(e, t, n) {
  return t.filter(
    (a) => a.tagIds === null || a.unresolved && e.length > 0 || e.some((i) => tc(i, a, n))
  );
}
function Vd(e, t, n) {
  return t.filter((a) => a.tagIds !== null && tc(e, a, n));
}
function zd(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function ao(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [zd(e.mixed)] : []
  ];
}
function Jd(e) {
  const t = ao(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function Wd(e, t, n) {
  const a = pr(e, t).map((i) => {
    const o = e.filter((c) => c.tagId === i.id);
    if (o.every((c) => c.categoryTagId === void 0)) return i.name;
    const s = o.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${i.name} (affects ${[...new Set(s)].join(", ")})`;
  });
  return a.length ? `Flagged: ${a.join(", ")}` : "";
}
const Ai = "-", Go = "Ctrl+a", Hd = "Ctrl/⌘A", Qd = ["f", "g", "k"], si = "Shift+";
function jr(e) {
  return me(() => Ms(e), [e]);
}
function io({
  surface: e,
  enabled: t,
  actions: n,
  onAction: a,
  onFind: i,
  onSelectAll: o
}) {
  const s = jr(n), c = R({ keyMap: s, onAction: a, onFind: i, onSelectAll: o });
  kt(() => {
    c.current = { keyMap: s, onAction: a, onFind: i, onSelectAll: o };
  });
  const u = !!i && n.length > 0, p = e === "local" && !!o, d = Wn.filter(
    (m) => s.actionOn.has(m) || e === "local" && Qd.includes(m)
  ).join(" "), g = me(() => {
    const m = (S) => {
      var v, T;
      const N = c.current;
      if (S === Go) (v = N.onSelectAll) == null || v.call(N);
      else if (S === Ai) (T = N.onFind) == null || T.call(N);
      else {
        const M = S.startsWith(si), j = N.keyMap.actionOn.get(
          M ? S.slice(si.length) : S
        );
        j !== void 0 && N.onAction(j, M);
      }
    }, b = (S, N = e) => ({
      keys: S,
      surface: N,
      action: (v) => {
        v != null && v.repeat || m((v == null ? void 0 : v.sequence) ?? S);
      }
    }), w = [];
    p && w.push(b(Go, "local")), u && w.push(b(Ai));
    for (const S of d ? d.split(" ") : [])
      w.push(b(S), b(`${si}${S}`));
    return w;
  }, [e, d, u, p]);
  vl(g, t);
}
const Yd = {
  find: Ai,
  selectAll: Hd
};
function oo() {
  return Yd;
}
const Xd = 600 * 1e3, so = /* @__PURE__ */ new Map(), nc = /* @__PURE__ */ new Map(), zn = /* @__PURE__ */ new Map();
function rc(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = nc.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function ac(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && nc.set(e.tagGroupId, e.tagGroupSortOrder), so.set(e.id, { tag: e, at: Date.now() });
}
function ic(e) {
  const t = so.get(e);
  if (!(!t || Date.now() - t.at > Xd))
    return rc(t.tag);
}
function oc(e) {
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
function Ti(e) {
  var t;
  for (const n of e) {
    const a = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && a && ac(oc({ ...n, name: a }));
  }
}
function Zd(e) {
  const t = zn.get(e);
  if (t) return t;
  const n = new AbortController(), a = {
    controller: n,
    waiters: 0,
    promise: he(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var d, g;
        const o = ((d = i == null ? void 0 : i.name) == null ? void 0 : d.trim()) || null;
        if (zn.get(e) === a && zn.delete(e), !o) return null;
        const s = oc({ ...i, id: e, name: o }), c = (g = so.get(e)) == null ? void 0 : g.tag, u = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, p = {
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
function Ko() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function ci(e) {
  const t = {};
  for (const n of e) {
    const a = ic(n);
    a !== void 0 && (t[n] = a);
  }
  return t;
}
function eu(e, t) {
  if (t != null && t.aborted) return Promise.reject(Ko());
  const n = {}, a = [];
  for (const i of new Set(e)) {
    const o = ic(i);
    if (o !== void 0) n[i] = o;
    else {
      const s = Zd(i);
      s.waiters += 1, a.push({ id: i, entry: s });
    }
  }
  return a.length ? new Promise((i, o) => {
    let s = !1;
    const c = () => {
      for (const { id: p, entry: d } of a)
        d.waiters -= 1, d.waiters === 0 && zn.get(p) === d && (zn.delete(p), d.controller.abort());
    }, u = () => {
      s || (s = !0, c(), o(Ko()));
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
function sc(e) {
  const t = {};
  for (const [n, a] of Object.entries(e)) t[Number(n)] = (a == null ? void 0 : a.name) ?? null;
  return t;
}
function ma(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, a] = A(() => ({
    key: t,
    tags: ci(li(t))
  }));
  return H(() => {
    const i = li(t), o = ci(i);
    if (a({ key: t, tags: o }), i.every((c) => c in o)) return;
    const s = new AbortController();
    return eu(i, s.signal).then(
      (c) => a({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : ci(li(t));
}
function Ur(e) {
  const t = ma(e);
  return me(() => sc(t), [t]);
}
function li(e) {
  return e ? e.split(",").map(Number) : [];
}
const tu = "(max-width: 760px)";
function cc(e) {
  const [t] = A(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = Sn(
    (a) => (t == null || t.addEventListener("change", a), () => t == null ? void 0 : t.removeEventListener("change", a)),
    [t]
  );
  return Di(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
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
  const i = Xn(e), o = (s) => i.has(s) || [...i].some((c) => {
    var u;
    return (u = a == null ? void 0 : a.get(s)) == null ? void 0 : u.includes(c);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (c) => nu(
        s.mode,
        t[c] === void 0 ? "…" : t[c] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && o(c)
      )
    )
  );
}
function Ha(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function co({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  canStay: i = !0,
  tapStays: o = !1,
  onApply: s,
  onClose: c
}) {
  const u = ga(), [p, d] = A(""), [g, m] = A(0), b = R(null), w = R(null), S = R(null), N = R(null), v = R(null), T = R(/* @__PURE__ */ new Set()), M = at(), j = Ur(me(() => Ha(e), [e])), K = jr(e), L = me(() => {
    const U = p.trim().toLocaleLowerCase(), B = (k) => k ? Wn.indexOf(k) : Wn.length;
    return e.map((k, I) => ({ action: k, index: I, key: K.keys[I] })).sort((k, I) => B(k.key) - B(I.key)).filter((k) => !U || k.action.label.toLocaleLowerCase().includes(U));
  }, [e, K, p]), ee = L.length ? Math.min(g, L.length - 1) : -1, te = (U) => `${M}-option-${U}`;
  kt(() => {
    var U, B, k;
    return N.current = document.activeElement, v.current = ((B = (U = S.current) == null ? void 0 : U.parentElement) == null ? void 0 : B.closest('[role="dialog"]')) ?? null, (k = b.current) == null || k.focus({ preventScroll: !0 }), () => {
      var z;
      const I = N.current;
      I instanceof HTMLElement && I.isConnected && I.focus({ preventScroll: !0 }), document.activeElement !== I && ((z = v.current) != null && z.isConnected) && v.current.focus({ preventScroll: !0 });
    };
  }, []), H(() => {
    var U, B, k;
    ee < 0 || (k = (B = (U = w.current) == null ? void 0 : U.querySelector(`[id="${te(L[ee].index)}"]`)) == null ? void 0 : B.scrollIntoView) == null || k.call(B, { block: "nearest" });
  }, [ee, L]);
  function Z(U, B) {
    !U || a != null && a(U.action) || s(U.action, i && B);
  }
  function oe(U) {
    var k;
    if (U.stopPropagation(), Pn(U)) return;
    const B = U.code || U.key;
    if (U.repeat && !T.current.has(B)) {
      U.preventDefault();
      return;
    }
    if (U.repeat || T.current.add(B), U.key === "Escape")
      U.preventDefault(), c();
    else if (U.key === "Enter")
      U.preventDefault(), U.repeat || Z(L[ee], U.shiftKey);
    else if (U.key === "ArrowDown" || U.key === "ArrowUp") {
      if (U.preventDefault(), !L.length) return;
      const I = U.key === "ArrowDown" ? 1 : -1;
      m((ee + I + L.length) % L.length);
    } else U.key === "Tab" && (U.preventDefault(), (k = b.current) == null || k.focus());
  }
  return /* @__PURE__ */ l(ye, { children: [
    /* @__PURE__ */ r("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: c }),
    /* @__PURE__ */ l(
      "div",
      {
        ref: S,
        role: "dialog",
        "aria-label": "Find an action",
        className: `dq-find-action${u ? " dq-find-mobile" : ""}`,
        onKeyDown: oe,
        onMouseDown: (U) => {
          U.target !== b.current && U.preventDefault();
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
                "aria-controls": `${M}-list`,
                "aria-activedescendant": ee >= 0 ? te(L[ee].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: p,
                onChange: (U) => {
                  d(U.target.value), m(0);
                }
              }
            ),
            !u && /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          L.length ? /* @__PURE__ */ r(
            "ul",
            {
              ref: w,
              id: `${M}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: L.map((U, B) => /* @__PURE__ */ r("li", { role: "none", children: /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: te(U.index),
                  tabIndex: -1,
                  "aria-selected": B === ee,
                  disabled: (a == null ? void 0 : a(U.action)) ?? !1,
                  onClick: (k) => Z(U, k.shiftKey || o && Fs(U.action)),
                  children: [
                    u ? null : U.key ? /* @__PURE__ */ r("kbd", { children: U.key }) : /* @__PURE__ */ r("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ r("span", { className: "dq-find-label", children: U.action.label }),
                    /* @__PURE__ */ r("span", { className: "dq-find-effect", children: qr(U.action, j, t, n).map(
                      (k, I) => /* @__PURE__ */ r("span", { "data-effect-tone": k.tone, children: k.text }, I)
                    ) })
                  ]
                }
              ) }, U.action.id))
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
function lc() {
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
function lo(e) {
  return Di(e.subscribe, e.get, e.get);
}
function dc(e, t) {
  const n = R(t);
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
const ru = [], Bo = oa.map((e, t) => ({
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
  return oa.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function hc({
  groups: e,
  renderAction: t,
  find: n
}) {
  const a = e.length ? e : [[]];
  return /* @__PURE__ */ r(ye, { children: a.map((i, o) => /* @__PURE__ */ l("div", { className: "dq-mobile-group", children: [
    i.map(t),
    o === a.length - 1 && n
  ] }, o)) });
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
function iu({
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
              s === "answered" && /* @__PURE__ */ l(ye, { children: [
                /* @__PURE__ */ r(da, { "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", answered:" }),
                " ",
                /* @__PURE__ */ r("span", { className: "dq-group-answer", children: c })
              ] }),
              s === "open" && /* @__PURE__ */ l(ye, { children: [
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
function ou({ checked: e, onChange: t }) {
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
  tags: i,
  trees: o,
  preview: s,
  onApply: c,
  onFind: u,
  findDisabled: p,
  paused: d = !1,
  waitForGroups: g = !1,
  attention: m = ru,
  stayOnTap: b = !1,
  onStayOnTapChange: w
}) {
  const S = oo(), N = jr(e), v = ga();
  dc(s, v);
  const T = at(), M = Ur(
    me(() => e.flatMap((F) => F.steps.flatMap((G) => G.tagIds)), [e])
  ), j = Bo.filter((F) => F.keys.some((G) => N.actionOn.has(G))), K = j.includes(Bo[2]), L = e.length - N.actionOn.size, ee = me(
    () => g && !d ? wr(e) : [],
    [g, d, e]
  ), te = me(
    () => ee.length && i ? ki(e, i) : null,
    [ee, e, i]
  ), Z = new Map(
    Ei(te ?? []).flatMap(
      (F) => F.actions.filter((G) => Zs(e[G])).map((G) => [G, F.name])
    )
  ), oe = me(
    () => e.map((F) => d ? [] : Vd(F, m, o)),
    [e, m, o, d]
  ), U = (F) => F.map(Jd).join("; "), B = oe.map(U), k = ee.length > 0 && /* @__PURE__ */ r(
    iu,
    {
      groups: ee,
      statuses: te,
      actions: e,
      attentionOf: (F) => U([
        ...new Map(
          F.actions.flatMap((G) => oe[G]).map((G) => [G.key, G])
        ).values()
      ])
    }
  ), I = (F) => {
    const G = qr(e[F], M, [], o).map((He) => He.text).join(", "), W = Z.get(F), ge = B[F];
    return [
      G,
      W === void 0 ? "" : `${W}: not answered yet`,
      ge ? `Needs attention: ${ge}` : ""
    ].filter(Boolean).join(". ");
  }, z = (F) => B[F] ? (
    // The tile's description says it; the mark is for the eye, with the reasons on hover.
    /* @__PURE__ */ r(
      "span",
      {
        className: "dq-pad-flag",
        "aria-hidden": "true",
        title: `Needs attention: ${B[F]}`,
        children: /* @__PURE__ */ r(Fn, {})
      }
    )
  ) : null, Q = (F) => ({
    onMouseEnter: () => s.set(F),
    onMouseLeave: () => s.clear(F),
    onFocus: () => s.set(F),
    onBlur: () => s.clear(F)
  }), ae = (F) => {
    const G = N.actionOn.get(F), W = G === void 0 ? void 0 : e[G];
    if (!W)
      return /* @__PURE__ */ r(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ r(dt, { binding: F })
        },
        F
      );
    const ge = n(W), He = `${T}-effect-${F}`;
    return /* @__PURE__ */ l("div", { className: "dq-pad-slot", ...d ? {} : Q(W), children: [
      /* @__PURE__ */ r("span", { id: He, className: "dq-sr-only", children: I(G) }),
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: W.label,
          "aria-keyshortcuts": F,
          "aria-describedby": He,
          "data-group-open": Z.has(G) || void 0,
          "data-attention": B[G] ? !0 : void 0,
          disabled: ge,
          onClick: (D) => c(W, D.shiftKey),
          children: [
            /* @__PURE__ */ r(dt, { binding: F }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-pad-label", children: W.label }),
            $a(W) && " ",
            $a(W) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(Da, { "aria-hidden": "true" }),
              "absent"
            ] }),
            z(G)
          ]
        }
      )
    ] }, F);
  }, re = /* @__PURE__ */ l("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ r(Dr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (v) {
    const F = fc(N), G = (W) => {
      const ge = e[W], He = N.keys[W];
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: ge.label,
          "aria-keyshortcuts": He,
          "aria-describedby": `${T}-effect-${He}`,
          "data-group-open": Z.has(W) || void 0,
          "data-attention": B[W] ? !0 : void 0,
          disabled: n(ge),
          onClick: (D) => {
            s.clear(ge), c(ge, D.shiftKey || b && Fs(ge));
          },
          ...d ? {} : uc(s, ge),
          children: [
            /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: ge.label }),
            $a(ge) && " ",
            $a(ge) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(Da, { "aria-hidden": "true" }),
              "absent"
            ] }),
            z(W)
          ]
        },
        He
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
            d ? re : /* @__PURE__ */ r(
              Vo,
              {
                actions: e,
                keyMap: N,
                names: M,
                tags: i,
                trees: o,
                preview: s,
                findKey: S.find,
                mobile: !0
              }
            ),
            w && /* @__PURE__ */ r(ou, { checked: b, onChange: w })
          ] }),
          k,
          /* @__PURE__ */ r("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ r(
            hc,
            {
              groups: F,
              renderAction: G,
              find: /* @__PURE__ */ r(
                pc,
                {
                  extra: L,
                  findKey: S.find,
                  disabled: p,
                  onFind: u
                }
              )
            }
          ) }),
          /* @__PURE__ */ r("div", { hidden: !0, children: F.flat().map((W) => /* @__PURE__ */ r("span", { id: `${T}-effect-${N.keys[W]}`, children: I(W) }, W)) })
        ]
      }
    );
  }
  const V = /* @__PURE__ */ l("span", { className: "dq-pad-hint", children: [
    /* @__PURE__ */ r("kbd", { className: "dq-key", children: "Shift" }),
    /* @__PURE__ */ r("span", { children: "+ key or Shift-click applies and stays" })
  ] }), y = !K && /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: "dq-pad-find-button",
      "aria-label": L ? `Find action, ${L} more` : "Find action",
      "aria-keyshortcuts": S.find,
      disabled: p,
      onClick: u,
      children: [
        /* @__PURE__ */ r(dt, { binding: S.find }),
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
        /* @__PURE__ */ l("div", { className: `dq-pad-header${k ? " dq-pad-header-groups" : ""}`, children: [
          d ? re : /* @__PURE__ */ r(
            Vo,
            {
              actions: e,
              keyMap: N,
              names: M,
              tags: i,
              trees: o,
              preview: s,
              findKey: S.find
            }
          ),
          k ? (
            // The checklist, then the hint and Find action, on the header's second line, under the
            // effect line: the pad keeps its height as answers of any length come in.
            /* @__PURE__ */ l("div", { className: "dq-pad-header-end", children: [
              k,
              V,
              y
            ] })
          ) : /* @__PURE__ */ l(ye, { children: [
            !d && V,
            y
          ] })
        ] }),
        j.map((F) => /* @__PURE__ */ l("div", { className: "dq-pad-row", "data-indent": F.indent, children: [
          F.keys.map(ae),
          F.fixed.map((G) => {
            const W = au(G, t);
            return /* @__PURE__ */ l(
              "div",
              {
                className: `dq-pad-slot dq-pad-free dq-pad-fixed${W ? " dq-pad-reserved" : ""}`,
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ r(dt, { binding: G }),
                  W && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: W })
                ]
              },
              G
            );
          }),
          F.fixed.length > 0 && /* @__PURE__ */ r("div", { className: "dq-pad-slot", children: /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": L ? `Find action, ${L} more` : "Find action",
              "aria-keyshortcuts": S.find,
              disabled: p,
              onClick: u,
              children: [
                /* @__PURE__ */ r(dt, { binding: S.find }),
                /* @__PURE__ */ l("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ r(la, { "aria-hidden": "true" }),
                  L ? `${L} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, F.indent))
      ]
    }
  );
}
function Vo({
  actions: e,
  keyMap: t,
  names: n,
  tags: a,
  trees: i,
  preview: o,
  findKey: s,
  mobile: c = !1
}) {
  const u = lo(o), p = u ? e.indexOf(u) : -1;
  if (!u || p < 0) {
    const b = t.actionOn.size;
    return /* @__PURE__ */ l("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && b < e.length && /* @__PURE__ */ l(ye, { children: [
        ` · ${b} on keys, ${e.length - b} more under `,
        /* @__PURE__ */ r(dt, { binding: s })
      ] })
    ] });
  }
  const d = t.keys[p], g = a && u.steps.length ? no(u, a, i) : null, m = g && !g.unresolvedTrees.length && ![g.added, g.removed, g.markedAbsent, g.absenceCleared].some(
    (b) => b.length
  );
  return /* @__PURE__ */ l("p", { className: "dq-pad-effect", children: [
    d && !c && /* @__PURE__ */ r(dt, { binding: d }),
    /* @__PURE__ */ r("strong", { children: u.label }),
    qr(u, n, [], i).map((b, w) => /* @__PURE__ */ r("span", { "data-effect-tone": b.tone, children: b.text }, w)),
    m && /* @__PURE__ */ r("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function mc({
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
  const w = oo(), S = jr(e), N = ga(), v = at(), T = Ur(me(() => Ha(e), [e])), [M] = A(() => lc());
  dc(M, N);
  const j = R(null), K = cu(j, e, !N), L = fc(S);
  !L.length && e.length && L.push([]);
  const ee = L.flat(), te = e.length - ee.length, Z = (k) => qr(k, T, t, n).map((I) => I.text).join(", "), oe = (k) => ({
    onMouseEnter: () => M.set(k),
    onMouseLeave: () => M.clear(k),
    onFocus: () => M.set(k),
    onBlur: (I) => {
      I.currentTarget.contains(I.relatedTarget) || M.clear(k);
    }
  }), U = u ?? (N ? void 0 : p), B = (k) => {
    const I = e[k];
    return /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-mobile-tile",
        title: I.label,
        "aria-keyshortcuts": S.keys[k] || void 0,
        "aria-describedby": `${v}-effect-${k}`,
        disabled: b || a(I),
        onClick: () => {
          M.clear(I), o(I);
        },
        ...b ? {} : uc(M, I),
        children: /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: I.label })
      },
      I.id
    );
  };
  return /* @__PURE__ */ l(
    "section",
    {
      ref: j,
      className: `dq-action-bar${N ? " dq-bar-mobile" : K ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${b ? " dq-bar-paused" : ""}${m ? ` ${m}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ r("div", { className: "dq-bar-summary", children: c }),
        /* @__PURE__ */ r("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ l(
          "div",
          {
            className: `dq-bar-tiles${N ? " dq-mobile-actions" : ""}`,
            "aria-busy": i || void 0,
            children: [
              N && e.length > 0 && /* @__PURE__ */ r(
                hc,
                {
                  groups: L,
                  renderAction: B,
                  find: /* @__PURE__ */ r(
                    pc,
                    {
                      extra: te,
                      findKey: w.find,
                      disabled: b,
                      onFind: s
                    }
                  )
                }
              ),
              !N && L.map((k, I) => /* @__PURE__ */ l("div", { className: "dq-bar-line", children: [
                k.map((z) => {
                  const Q = e[z], ae = S.keys[z];
                  return /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: Q.label,
                      "aria-keyshortcuts": ae || void 0,
                      "aria-describedby": `${v}-effect-${z}`,
                      disabled: b || a(Q),
                      onClick: () => o(Q),
                      ...b ? {} : oe(Q),
                      children: [
                        ae && /* @__PURE__ */ r(dt, { binding: ae }),
                        " ",
                        /* @__PURE__ */ r("span", { className: "dq-bar-label", children: Q.label })
                      ]
                    },
                    Q.id
                  );
                }),
                I === L.length - 1 && /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-bar-tile dq-bar-find",
                    "aria-label": te > 0 ? `Find action, ${te} more` : "Find action",
                    "aria-keyshortcuts": w.find,
                    disabled: b,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ r(dt, { binding: w.find, hidden: !0 }),
                      /* @__PURE__ */ r(la, { "aria-hidden": "true" }),
                      /* @__PURE__ */ r("span", { className: "dq-bar-label", children: te > 0 ? `${te} more` : "Find action" })
                    ]
                  }
                )
              ] }, I)),
              !e.length && /* @__PURE__ */ r("p", { className: "dq-bar-empty", children: "This review has no actions." })
            ]
          }
        ),
        U && /* @__PURE__ */ r("p", { className: "dq-bar-hints", children: U }),
        b ? /* @__PURE__ */ l("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ r(Dr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ r(
          lu,
          {
            actions: e,
            keyMap: S,
            preview: M,
            names: T,
            tagGroups: t,
            trees: n,
            showKey: !N
          }
        ),
        d && /* @__PURE__ */ r("div", { className: "dq-bar-notices", children: d }),
        /* @__PURE__ */ r("div", { hidden: !0, children: ee.map((k) => /* @__PURE__ */ r("span", { id: `${v}-effect-${k}`, children: Z(e[k]) }, e[k].id)) }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: g })
      ]
    }
  );
}
function cu(e, t, n) {
  const [a, i] = A(!1);
  return kt(() => {
    var d;
    const o = e.current;
    if (!o || !n || typeof ResizeObserver > "u") return;
    const s = o.querySelector(".dq-bar-summary"), c = () => {
      const g = getComputedStyle(o), m = parseFloat(g.columnGap) || 0, b = o.clientWidth - (parseFloat(g.paddingLeft) || 0) - (parseFloat(g.paddingRight) || 0), w = [...o.querySelectorAll(".dq-bar-line")].map(
        (ee) => [...ee.children].map((te) => te.offsetWidth)
      ), S = o.querySelector(".dq-bar-line"), N = S && parseFloat(getComputedStyle(S).columnGap) || 0, v = o.querySelector(".dq-bar-hints"), T = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (v ? v.offsetWidth + m : 0) + 1 + // the divider
      2 * m, M = (ee) => w.map((te) => {
        let Z = 1, oe = 0;
        for (const U of te)
          oe > 0 && oe + N + U > ee ? (Z += 1, oe = U) : oe += (oe > 0 ? N : 0) + U;
        return Z;
      }), j = (ee) => Math.max(1, ee.reduce((te, Z) => te + Z, 0)), K = M(b), L = j(M(b - T));
      i(
        1 + j(K) < L || 1 + j(K) === L && K.every((ee) => ee === 1)
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
function lu({
  actions: e,
  keyMap: t,
  preview: n,
  names: a,
  tagGroups: i,
  trees: o,
  showKey: s
}) {
  const c = lo(n), u = c ? e.indexOf(c) : -1;
  if (!c || u < 0) return null;
  const p = t.keys[u];
  return /* @__PURE__ */ l("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    p && s && /* @__PURE__ */ r(dt, { binding: p }),
    /* @__PURE__ */ r("strong", { children: c.label }),
    qr(c, a, i, o).map((d, g) => /* @__PURE__ */ r("span", { "data-effect-tone": d.tone, children: d.text }, g))
  ] });
}
const zo = 1e3;
async function du(e, t, n) {
  const a = await he(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
  for (let u = 1; ; u++) {
    const p = await he(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          Ln({
            findFilter: {
              page: u,
              perPage: zo,
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
    if (u * zo >= p.totalCount) break;
    if (!p.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], s = Ue(e), c = Ie(e) ? await fu(
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
  const a = new Array(t.length).fill(0), i = new AbortController(), o = () => i.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && o(), n == null || n.addEventListener("abort", o, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !i.signal.aborted; ) {
            const c = s++;
            a[c] = (await he(
              `/api/${Zn(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: uu(t[c])
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
  return ((a = wr(t).find((i) => i.key === n)) == null ? void 0 : a.name) ?? e.trim();
}
const yu = (e) => e instanceof Error ? e.message : "Request failed.";
function wu({
  id: e,
  review: t,
  disabled: n,
  onAdd: a,
  onCancel: i
}) {
  const [o, s] = A([]), [c, u] = A({}), [p, d] = A({}), [g, m] = A({}), b = R(/* @__PURE__ */ new Map());
  H(
    () => () => {
      for (const k of b.current.values()) k.abort();
    },
    []
  );
  const w = En(Ue(t)), S = Ie(t), N = S ? "performer" : w.one;
  function v(k) {
    var z;
    (z = b.current.get(k)) == null || z.abort();
    const I = new AbortController();
    b.current.set(k, I), u((Q) => ({ ...Q, [k]: { status: "loading" } })), du(t, k, I.signal).then(
      (Q) => {
        I.signal.aborted || u((ae) => ({
          ...ae,
          [k]: { status: "ready", group: Q }
        }));
      },
      (Q) => {
        I.signal.aborted || u((ae) => ({
          ...ae,
          [k]: { status: "failed", message: yu(Q) }
        }));
      }
    );
  }
  function T(k) {
    var re;
    const I = o.filter((V) => !k.includes(V));
    for (const V of I)
      (re = b.current.get(V)) == null || re.abort(), b.current.delete(V);
    const z = (V) => {
      const y = c[V];
      return (y == null ? void 0 : y.status) === "ready" ? y.group.children.map((F) => F.id) : [];
    }, Q = new Set(k.flatMap(z)), ae = I.flatMap(z).filter((V) => !Q.has(V));
    d(
      (V) => Object.fromEntries(
        Object.entries(V).filter(([y]) => !ae.includes(Number(y)))
      )
    ), m(
      (V) => Object.fromEntries(
        Object.entries(V).filter(([y]) => k.includes(Number(y)))
      )
    ), u(
      (V) => Object.fromEntries(
        Object.entries(V).filter(([y]) => k.includes(Number(y)))
      )
    ), s(k);
    for (const V of k) o.includes(V) || v(V);
  }
  const M = o.flatMap((k) => {
    const I = c[k];
    return (I == null ? void 0 : I.status) === "ready" ? [I.group] : [];
  }), j = M.length === o.length, K = o.some(
    (k) => {
      var I;
      return (((I = c[k]) == null ? void 0 : I.status) ?? "loading") === "loading";
    }
  ), L = new Map(
    hu(M).map((k) => [k.parent.id, k])
  ), ee = pu(M), te = new Map(M.map((k) => [k.parent.id, k.parent.name])), Z = mu(t.actions), oe = (k) => p[k] ?? !Z.has(k), U = j ? [...L.values()].flatMap((k) => {
    const I = bu(k.parent.name, t.actions);
    return k.children.filter((z) => oe(z.id)).map((z) => ({ child: z, answerGroup: I }));
  }) : [], B = (k, I) => d((z) => ({
    ...z,
    ...Object.fromEntries(k.children.map((Q) => [Q.id, I]))
  }));
  return /* @__PURE__ */ l("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ r("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ l("p", { className: "dq-drawer-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      S ? "on performers " : "",
      "first, in a group named after its parent. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ r(
      Yn,
      {
        entityType: "tag",
        values: o,
        onChange: T,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    o.map((k) => {
      const I = c[k];
      if (!I || I.status === "loading")
        return /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Loading child tags…" }, k);
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
              onClick: () => v(k),
              children: "Retry"
            }
          )
        ] }, k);
      const z = L.get(k);
      if (!z) return null;
      const Q = z.parent.name;
      return /* @__PURE__ */ l("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ r("legend", { children: Q }),
        I.group.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ l(ye, { children: [
          /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: g[k] ?? !1,
                disabled: n,
                onChange: (ae) => m((re) => ({
                  ...re,
                  [k]: ae.target.checked
                }))
              }
            ),
            "Only one per ",
            N,
            ": each action removes every other tag in the ",
            Q,
            " tree"
          ] }),
          z.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ l(ye, { children: [
            /* @__PURE__ */ l("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${Q}`,
                  onClick: () => B(z, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${Q}`,
                  onClick: () => B(z, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "dq-child-tags", children: z.children.map((ae) => {
              const re = Z.get(ae.id) ?? [], V = (ee.get(ae.id) ?? []).filter((y) => y !== k).map((y) => `“${te.get(y)}”`);
              return /* @__PURE__ */ l("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: oe(ae.id),
                    disabled: n,
                    onChange: (y) => d((F) => ({
                      ...F,
                      [ae.id]: y.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ l("span", { children: [
                  ae.name,
                  " ",
                  /* @__PURE__ */ l("small", { children: [
                    ae.uses.toLocaleString(),
                    " ",
                    ae.uses === 1 ? w.one : w.many
                  ] }),
                  V.length > 0 && /* @__PURE__ */ l("small", { children: [
                    " · Also under ",
                    V.join(", ")
                  ] }),
                  re.length > 0 && /* @__PURE__ */ l("small", { children: [
                    " ",
                    "· Already in “",
                    re[0].label || "New action",
                    "”",
                    re.length > 1 ? ` and ${re.length - 1} more` : ""
                  ] })
                ] })
              ] }, ae.id);
            }) })
          ] })
        ] })
      ] }, k);
    }),
    /* @__PURE__ */ l("div", { className: "dq-row", children: [
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: n || !U.length,
          onClick: () => a(
            U.map(
              ({ child: k, answerGroup: I }) => gu(
                k,
                (ee.get(k.id) ?? []).filter(
                  (z) => g[z]
                ),
                I
              )
            )
          ),
          children: U.length ? `Add ${U.length} action${U.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-sr-only", children: K ? "Loading child tags…" : "" })
    ] })
  ] });
}
function vu(e, t, n, a) {
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
function Nu(e) {
  return e.kind === "group" ? `group:${Nt(e.name)}` : e.kind;
}
function qu(e) {
  const { group: t, ...n } = e;
  return n;
}
const Oa = 4, Jo = 240;
function Su(e) {
  const t = [];
  for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
    const a = getComputedStyle(n);
    (a.overflowX !== "visible" || a.overflowY !== "visible") && t.push(n);
  }
  return t;
}
function ku(e, t, n, a) {
  for (const o of a) {
    const s = o.getBoundingClientRect();
    if (n.bottom < s.top || n.top > s.bottom || n.right < s.left || n.left > s.right)
      return !1;
  }
  if (typeof document.elementFromPoint != "function") return !0;
  const i = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
  return !i || e.contains(i) || t.contains(i);
}
function Eu({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: a,
  onChange: i
}) {
  const o = at(), s = at(), c = at(), u = R(null), p = R(null), d = R(null), g = R(null), m = R(null), b = R([]), w = R(!1), S = R(!1), [N, v] = A(!1), [T, M] = A(null), [j, K] = A(null), L = e.group ?? "", ee = me(
    () => vu(t, n, L, T),
    [t, n, L, T]
  ), te = ee.map(Nu), Z = j === null ? -1 : te.indexOf(j), oe = (y) => `${s}-option-${y}`, U = (y) => i(y ? { ...e, group: y } : qu(e)), B = () => {
    var F;
    const y = ((F = d.current) == null ? void 0 : F.value) ?? L;
    y.trim() !== y && U(y.trim());
  };
  function k(y) {
    M(null), K(y), v(!0);
  }
  const I = (y) => {
    var F, G;
    return y instanceof Node && (((F = u.current) == null ? void 0 : F.contains(y)) || ((G = g.current) == null ? void 0 : G.contains(y))) === !0;
  };
  function z() {
    var y, F;
    (y = g.current) != null && y.contains(document.activeElement) && ((F = m.current) == null || F.focus({ preventScroll: !0 })), v(!1), M(null), K(null);
  }
  function Q(y) {
    y.kind === "group" && y.selected && T === null || U(y.kind === "none" ? "" : y.name), z();
  }
  function ae() {
    const y = p.current, F = g.current;
    if (!y || !F) return;
    const G = y.getBoundingClientRect(), W = window.visualViewport, ge = (W == null ? void 0 : W.offsetTop) ?? 0, D = (W ? W.offsetTop + W.height : window.innerHeight) - G.bottom - Oa, fe = G.top - ge - Oa, Re = Math.min(F.scrollHeight, Jo), se = D < Re && fe > D;
    F.style.left = `${G.left}px`, F.style.width = `${G.width}px`, F.style.top = `${se ? G.top - Oa : G.bottom + Oa}px`, F.style.transform = se ? "translateY(-100%)" : "", F.style.maxHeight = `${Math.max(0, Math.min(Jo, se ? fe : D))}px`, ku(y, F, G, b.current) || z();
  }
  kt(() => {
    var y;
    N && (p.current && (b.current = Su(p.current)), S.current && ((y = g.current) == null || y.focus({ preventScroll: !0 })), S.current = !1);
  }, [N]), kt(() => {
    N && ae();
  }), H(() => {
    if (!N) return;
    const y = () => ae(), F = (ge) => {
      I(ge.target) || z();
    }, G = [...b.current, window], W = window.visualViewport;
    for (const ge of G) ge.addEventListener("scroll", y);
    return window.addEventListener("resize", y), W == null || W.addEventListener("resize", y), W == null || W.addEventListener("scroll", y), document.addEventListener("pointerdown", F), () => {
      for (const ge of G) ge.removeEventListener("scroll", y);
      window.removeEventListener("resize", y), W == null || W.removeEventListener("resize", y), W == null || W.removeEventListener("scroll", y), document.removeEventListener("pointerdown", F);
    };
  }, [N]), H(() => {
    var y, F, G;
    Z >= 0 && ((G = (F = (y = g.current) == null ? void 0 : y.children[Z]) == null ? void 0 : F.scrollIntoView) == null || G.call(F, { block: "nearest" }));
  }, [Z]);
  function re(y) {
    if (Pn(y)) return;
    const F = y.key === "ArrowDown" || y.key === "ArrowUp";
    if (F && !N) {
      if (y.altKey && y.key === "ArrowUp") return;
      y.preventDefault(), k(y.altKey ? null : Nt(L) ? `group:${Nt(L)}` : "none");
      return;
    }
    if (N)
      if (F) {
        if (y.preventDefault(), y.altKey) {
          y.key === "ArrowUp" && z();
          return;
        }
        const G = y.key === "ArrowDown" ? 1 : -1, W = T !== null && Nt(T) && te.length > 1 ? 1 : 0, ge = Z < 0 ? G > 0 ? W : te.length - 1 : (Z + G + te.length) % te.length;
        K(te[ge]);
      } else y.key === "Enter" && (y.preventDefault(), Z >= 0 ? Q(ee[Z]) : (B(), z()));
  }
  function V(y) {
    var W, ge;
    if (y.key === "Tab") {
      z(), y.shiftKey && ((W = d.current) == null || W.focus());
      return;
    }
    const F = y.getModifierState("AltGraph");
    if (y.key === "Dead" || y.key.length === 1 && !y.metaKey && (F || !y.ctrlKey && !y.altKey)) {
      (ge = d.current) == null || ge.focus();
      return;
    }
    re(y);
  }
  return /* @__PURE__ */ l(
    "div",
    {
      onKeyDown: (y) => {
        !N || y.key !== "Escape" || Pn(y) || (y.preventDefault(), y.stopPropagation(), z());
      },
      children: [
        /* @__PURE__ */ l("div", { ref: u, className: "dq-action-field", children: [
          /* @__PURE__ */ r(
            "label",
            {
              className: "dq-action-field-name",
              htmlFor: o,
              onMouseDown: (y) => {
                N && y.preventDefault();
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
                "aria-expanded": N,
                "aria-controls": N ? s : void 0,
                "aria-autocomplete": "list",
                "aria-activedescendant": N && Z >= 0 ? oe(Z) : void 0,
                "aria-describedby": c,
                placeholder: "No group",
                autoComplete: "off",
                spellCheck: !1,
                value: L,
                onChange: (y) => {
                  U(y.target.value), M(y.target.value), K(null), v(!0);
                },
                onClick: () => {
                  N || k(null);
                },
                onKeyDown: re,
                onBlur: () => {
                  z(), B();
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
                "aria-expanded": N,
                "aria-controls": N ? s : void 0,
                onPointerDown: (y) => {
                  w.current = y.pointerType === "touch";
                },
                onMouseDown: (y) => y.preventDefault(),
                onClick: () => {
                  var G;
                  const y = w.current;
                  w.current = !1;
                  const F = document.activeElement === d.current;
                  N ? z() : (S.current = y && !F, k(null)), (!y || F) && ((G = d.current) == null || G.focus());
                },
                children: /* @__PURE__ */ r(Gi, { "aria-hidden": "true" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ r("p", { className: "dq-actions-hint dq-action-field-help", id: c, children: a ? "A group is one question with one answer per item; when a chosen performer's items hold two different answers of a group, Existing answers marks it Mixed." : "A group is one question with one answer per item." }),
        N && Wl(
          /* @__PURE__ */ r(
            "ul",
            {
              ref: g,
              id: s,
              role: "listbox",
              "aria-label": "Groups",
              className: "dq-combobox-list",
              tabIndex: -1,
              "aria-activedescendant": Z >= 0 ? oe(Z) : void 0,
              onMouseDown: (y) => y.preventDefault(),
              onKeyDown: V,
              onBlur: (y) => {
                I(y.relatedTarget) || z();
              },
              children: ee.map((y, F) => /* @__PURE__ */ l(
                "li",
                {
                  id: oe(F),
                  role: "option",
                  "aria-selected": y.selected,
                  className: "dq-combobox-option",
                  "data-kind": y.kind,
                  "data-active": F === Z || void 0,
                  onMouseMove: () => {
                    F !== Z && K(te[F]);
                  },
                  onClick: () => Q(y),
                  children: [
                    y.kind === "new" && /* @__PURE__ */ r(Va, { "aria-hidden": "true" }),
                    /* @__PURE__ */ r("span", { className: "dq-combobox-option-name", children: y.kind === "none" ? "No group" : y.kind === "new" ? `New group “${y.name}”` : y.name }),
                    y.selected && /* @__PURE__ */ r(da, { className: "dq-combobox-check", "aria-hidden": "true" })
                  ]
                },
                te[F]
              ))
            }
          ),
          document.body
        )
      ]
    }
  );
}
const Cu = ["n", "m"], Vn = [
  ...oa,
  ["auto", Hn]
];
function Ga(e) {
  return e.toLocaleUpperCase();
}
function gc(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : Hi(e[n]);
}
function Au({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i
}) {
  const [o, s] = A(!1), c = R(null), u = n.keys[t], p = gc(e, n, t), d = gr(p), g = n.duplicatePins.has(t) ? ` (${Ga(e[t].shortcut ?? "")} is pinned twice)` : "", m = u ? `${Ga(u)}, ${d ? "pinned" : "Auto"}${g}` : p === Hn ? "no key, Find action only" : `no key: Auto found no free key${g}`, b = () => {
    var w;
    s(!1), (w = c.current) == null || w.focus();
  };
  return /* @__PURE__ */ l(ye, { children: [
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
          d && /* @__PURE__ */ r(qs, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ r(
      Tu,
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
function Tu({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: i,
  onClose: o
}) {
  const s = R(null), c = n.keys[t], u = gc(e, n, t), [p, d] = A(c || "q"), g = (S) => {
    var N;
    return ((N = s.current) == null ? void 0 : N.querySelector(`[data-choice="${S}"]`)) ?? null;
  };
  kt(() => {
    var S, N, v;
    (S = g(c || u)) == null || S.focus(), (v = (N = s.current) == null ? void 0 : N.scrollIntoView) == null || v.call(N, { block: "nearest" });
  }, []);
  function m(S) {
    var N;
    gr(S) && d(S), (N = g(S)) == null || N.focus();
  }
  function b(S) {
    var L, ee, te;
    if (S.key === "Escape") {
      S.preventDefault(), S.stopPropagation(), o();
      return;
    }
    if (S.key === "Tab") {
      const Z = [...((L = s.current) == null ? void 0 : L.querySelectorAll("button[tabindex='0']")) ?? []], oe = Z.indexOf(document.activeElement);
      S.preventDefault(), (ee = Z[(oe + (S.shiftKey ? -1 : 1) + Z.length) % Z.length]) == null || ee.focus();
      return;
    }
    const N = (te = S.target.dataset) == null ? void 0 : te.choice, v = N ? Vn.findIndex((Z) => Z.includes(N)) : -1;
    if (!N || v < 0) return;
    const T = Vn[v].indexOf(N), M = (Z) => Z == null ? void 0 : Z[Math.min(T, Z.length - 1)], j = {
      ArrowLeft: Vn[v][T - 1],
      ArrowRight: Vn[v][T + 1],
      ArrowUp: M(Vn[v - 1]),
      ArrowDown: M(Vn[v + 1]),
      Home: Vn[v][0],
      End: Vn[v].at(-1)
    };
    if (!Object.hasOwn(j, S.key)) return;
    S.preventDefault();
    const K = j[S.key];
    K && m(K);
  }
  const w = (S) => {
    const N = gr(S) ? n.actionOn.get(S) : void 0;
    return N === void 0 ? null : {
      own: N === t,
      label: e[N].label.trim() || "New action",
      pinned: Hi(e[N]) === S
    };
  };
  return /* @__PURE__ */ l(ye, { children: [
    /* @__PURE__ */ r(
      "div",
      {
        className: "dq-key-picker-backdrop",
        "aria-hidden": "true",
        onMouseDown: (S) => {
          S.preventDefault(), o();
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
        onMouseDown: (S) => S.preventDefault(),
        children: [
          /* @__PURE__ */ l("p", { className: "dq-key-picker-title", children: [
            "Key for ",
            /* @__PURE__ */ r("strong", { children: a })
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: oa.map((S, N) => /* @__PURE__ */ l("div", { className: "dq-key-picker-row", "data-indent": N, children: [
            S.map((v) => {
              const T = w(v), M = T ? `${T.own ? "this action" : T.label}, ${T.pinned ? "pinned" : "Auto"}` : "free";
              return /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  className: `dq-key-choice${T ? "" : " dq-key-choice-free"}${T != null && T.own ? " dq-key-choice-own" : ""}`,
                  "data-choice": v,
                  tabIndex: v === p ? 0 : -1,
                  "aria-label": `${Ga(v)}: ${M}`,
                  "aria-pressed": !!(T != null && T.own && T.pinned),
                  title: T ? `${T.label} (${T.pinned ? "pinned" : "Auto"})` : void 0,
                  onFocus: () => d(v),
                  onClick: () => i(v),
                  children: [
                    /* @__PURE__ */ l("span", { className: "dq-key-choice-head", children: [
                      /* @__PURE__ */ r(dt, { binding: v }),
                      (T == null ? void 0 : T.pinned) && /* @__PURE__ */ r(qs, { "aria-hidden": "true" })
                    ] }),
                    T && /* @__PURE__ */ r("span", { className: "dq-key-choice-label", children: T.label })
                  ]
                },
                v
              );
            }),
            N === oa.length - 1 && Cu.map((v) => (
              // Unavailable, yet not disabled: a browser gives a disabled button no press for
              // the panel to keep, and moves focus out of the picker. This one chooses nothing
              // and is never focused (the arrow keys and Tab pass it by).
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-key-choice dq-key-choice-free",
                  "aria-label": `${Ga(v)}: not available, it steps through the grid preview`,
                  title: "Steps through the grid preview",
                  "aria-disabled": "true",
                  tabIndex: -1,
                  children: /* @__PURE__ */ r("span", { className: "dq-key-choice-head", children: /* @__PURE__ */ r(dt, { binding: v }) })
                },
                v
              )
            ))
          ] }, N)) }),
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
                "data-choice": Hn,
                tabIndex: 0,
                "aria-pressed": u === Hn,
                onClick: () => i(Hn),
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
const Iu = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Ru(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function $u(e, t) {
  if (xn(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (Qi(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function bc(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function Ou(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function Mu({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: a,
  saving: i,
  expandedId: o,
  onExpand: s,
  reveal: c
}) {
  const u = je(e), p = u !== "tag", d = e.actions, g = jr(d), m = Ur(me(() => Ha(d), [d])), b = me(
    () => p ? wr(d).map((D) => D.name) : [],
    [p, d]
  ), w = d.findIndex((D) => D.id === o), S = me(
    () => p && w >= 0 ? wr(
      d.filter((D, fe) => fe !== w)
    ).map((D) => D.name) : [],
    [p, d, w]
  ), N = p && e.stayUntilGroupsAnswered === !0, v = me(
    () => new Set(
      N ? Dd(d).map((D) => D.key) : []
    ),
    [N, d]
  ), [T, M] = A(""), [j, K] = A(!1), [L, ee] = A(
    null
  ), te = at(), Z = `${te}-from-tags`, oe = R(null), U = R(null), B = R(null), k = R(null), I = R(/* @__PURE__ */ new WeakMap()), z = (D) => {
    let fe = I.current.get(D);
    return fe || (fe = crypto.randomUUID(), I.current.set(D, fe)), fe;
  }, Q = T.trim().toLocaleLowerCase(), ae = Q ? d.filter((D) => D.label.toLocaleLowerCase().includes(Q)) : d, re = (D) => t({ ...e, actions: D }), V = (D, fe) => re(d.map((Re, se) => se === D ? fe : Re));
  function y(D) {
    var fe;
    return [...((fe = B.current) == null ? void 0 : fe.querySelectorAll("[data-action-id]")) ?? []].find(
      (Re) => Re.dataset.actionId === D
    );
  }
  function F(D, fe) {
    const Re = y(D), se = Re == null ? void 0 : Re.querySelector(
      fe === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return se == null || se.focus(), !!se;
  }
  kt(() => {
    var fe;
    const D = k.current;
    D && (k.current = null, (D === "add" || !F(D.id, D.part)) && ((fe = U.current) == null || fe.focus()));
  }), H(() => {
    !c || !o || (ae.some((D) => D.id === o) ? F(o, "label") : (M(""), k.current = { id: o, part: "label" }));
  }, [c]);
  function G() {
    const D = Ou(u);
    M(""), re([...d, D]), s(D.id), k.current = { id: D.id, part: "label" };
  }
  function W(D) {
    const fe = d[D], { shortcut: Re, ...se } = structuredClone(fe), Oe = {
      ...se,
      ...Re === Hn ? { shortcut: Re } : {},
      id: crypto.randomUUID(),
      label: `${fe.label} copy`
    };
    re([...d.slice(0, D + 1), Oe, ...d.slice(D + 1)]), s(Oe.id), k.current = { id: Oe.id, part: "label" };
  }
  function ge(D) {
    const fe = d[D], Re = ae.indexOf(fe), se = ae[Re + 1] ?? ae[Re - 1];
    re(d.filter((Oe, Xe) => Xe !== D)), o === fe.id && s(null), k.current = se ? { id: se.id, part: "toggle" } : "add";
  }
  function He() {
    K(!1), requestAnimationFrame(() => {
      var D;
      return (D = oe.current) == null ? void 0 : D.focus();
    });
  }
  return /* @__PURE__ */ l("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ l("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ l("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ l(
          "button",
          {
            ref: U,
            type: "button",
            className: "dq-header-button",
            onClick: G,
            children: [
              /* @__PURE__ */ r(Va, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        p && /* @__PURE__ */ r(
          "button",
          {
            ref: oe,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": j,
            "aria-controls": j ? Z : void 0,
            onClick: () => {
              ee(null), K(!j);
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
              onChange: (D) => M(D.target.value),
              onKeyDown: (D) => {
                D.key === "Escape" && T && !Pn(D) && (D.preventDefault(), D.stopPropagation(), M(""));
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
              checked: N,
              "aria-describedby": `${te}-groups-note`,
              onChange: (D) => t({
                ...e,
                stayUntilGroupsAnswered: D.target.checked ? !0 : void 0
              })
            }
          ),
          "Stay until every group is answered"
        ] }),
        /* @__PURE__ */ r("p", { className: "dq-actions-hint", id: `${te}-groups-note`, children: N && !b.length ? "No action has a group yet: give the actions of each question the same group." : "Single-item view: a plain action moves on once every group has an answer." })
      ] }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-actions-status", children: (L == null ? void 0 : L.actions) === d ? `Added ${L.count} action${L.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    p && j && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here. An Esc that cancels a composition belongs to the input method.
    /* @__PURE__ */ r(
      "div",
      {
        onKeyDown: (D) => {
          D.key !== "Escape" || D.defaultPrevented || Pn(D) || (D.preventDefault(), D.stopPropagation(), He());
        },
        children: /* @__PURE__ */ r(
          wu,
          {
            id: Z,
            review: e,
            disabled: i,
            onAdd: (D) => {
              const fe = [...d, ...D];
              re(fe), ee({ actions: fe, count: D.length }), He();
            },
            onCancel: He
          }
        )
      }
    ),
    /* @__PURE__ */ r("div", { ref: B, children: ae.length > 0 && /* @__PURE__ */ r(
      bs,
      {
        items: ae,
        getKey: (D) => D.id,
        disabled: i || !!Q,
        className: "dq-action-list",
        onReorder: (D) => re(D),
        renderItem: (D, { dragHandleProps: fe, isOver: Re }) => {
          const se = d.indexOf(D), Oe = o === D.id;
          return /* @__PURE__ */ r(
            Fu,
            {
              action: D,
              entityType: u,
              keyButton: /* @__PURE__ */ r(
                Au,
                {
                  actions: d,
                  index: se,
                  keyMap: g,
                  name: D.label.trim() || "New action",
                  onChoose: (Xe) => re(Yl(d, se, Xe))
                }
              ),
              takenPin: g.duplicatePins.has(se) ? D.shortcut : void 0,
              groupUnanswerable: "steps" in D && v.has(Nt(D.group)),
              effect: qr(D, m, n, a),
              open: Oe,
              detailId: `${te}-detail-${D.id}`,
              dragHandleProps: fe,
              isOver: Re,
              reorderDisabled: i || !!Q,
              onToggle: () => s(Oe ? null : D.id),
              onDuplicate: () => W(se),
              onDelete: () => ge(se),
              children: "steps" in D ? /* @__PURE__ */ r(
                xu,
                {
                  action: D,
                  groupNames: b,
                  otherGroupNames: S,
                  occurrence: Ie(e),
                  saving: i,
                  stepKey: z,
                  rememberStepKey: (Xe, Ee) => I.current.set(Xe, z(Ee)),
                  onChange: (Xe) => V(se, Xe)
                }
              ) : /* @__PURE__ */ r(
                Lu,
                {
                  action: D,
                  tagGroups: n,
                  onChange: (Xe) => V(se, Xe)
                }
              )
            }
          );
        }
      }
    ) }),
    d.length ? !ae.length && /* @__PURE__ */ l("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      T.trim(),
      "”."
    ] }) : /* @__PURE__ */ r("p", { className: "dq-actions-empty", children: p ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function Fu({
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
  const S = e.label.trim() || "New action", N = $u(e, t), v = "steps" in e && Nt(e.group) ? e.group.trim() : "";
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
              "aria-label": `Reorder ${S}`,
              title: d ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: d,
              children: /* @__PURE__ */ r(Ss, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ l("div", { className: "dq-action-row-summary", onClick: g, children: [
            /* @__PURE__ */ r("span", { className: "dq-action-row-label", title: S, children: S }),
            v && /* @__PURE__ */ l("span", { className: "dq-action-row-group", title: `Group: ${v}`, children: [
              /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Group: " }),
              v
            ] }),
            !s && /* @__PURE__ */ r("span", { className: "dq-action-row-effect", children: o.map((T, M) => /* @__PURE__ */ r("span", { "data-effect-tone": T.tone, children: T.text }, M)) }),
            N && /* @__PURE__ */ l("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ r(On, { "aria-hidden": "true" }),
              N
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
                  `${v} can't be answered`
                ]
              }
            )
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Duplicate ${S}`,
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
              "aria-label": `Delete ${S}`,
              title: "Delete",
              onClick: b,
              children: /* @__PURE__ */ r(Ki, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small dq-action-toggle",
              "aria-label": `${s ? "Collapse" : "Expand"} ${S}`,
              "aria-expanded": s,
              "aria-controls": s ? c : void 0,
              onClick: g,
              children: /* @__PURE__ */ r(Gi, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ r("div", { id: c, className: "dq-action-detail", children: w })
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
function xu({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: a,
  saving: i,
  stepKey: o,
  rememberStepKey: s,
  onChange: c
}) {
  const u = at(), p = R(null), d = R(null);
  kt(() => {
    var b, w;
    const m = d.current;
    m != null && (d.current = null, (w = (b = p.current) == null ? void 0 : b.querySelector(`[data-step-index="${m}"] input`)) == null || w.focus());
  });
  const g = (m) => c({ ...e, steps: m });
  return /* @__PURE__ */ l(ye, { children: [
    /* @__PURE__ */ r(yc, { action: e, onChange: (m) => c({ ...e, label: m }) }),
    /* @__PURE__ */ r(
      Eu,
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
            getKey: o,
            disabled: i,
            className: "dq-step-list",
            onReorder: g,
            renderItem: (m, { index: b, dragHandleProps: w, isOver: S }) => /* @__PURE__ */ r(
              Pu,
              {
                step: m,
                index: b,
                dragHandleProps: w,
                isOver: S,
                saving: i,
                onChange: (N) => {
                  s(N, m), g(e.steps.map((v, T) => T === b ? N : v));
                },
                onRemove: () => g(e.steps.filter((N, v) => v !== b))
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
function Pu({
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
      "data-step-tone": Ru(e.mode),
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
            disabled: i,
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
            onChange: (u) => o({ ...e, mode: u.target.value }),
            children: Iu.map(({ mode: u, label: p }) => /* @__PURE__ */ r("option", { value: u, children: p }, u))
          }
        ),
        /* @__PURE__ */ r(
          Yn,
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
            children: /* @__PURE__ */ r(ua, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function Lu({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const a = e.effect, i = a.mode === "SET_TAG_GROUP" ? `group:${a.tagGroupId}` : a.mode, o = a.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === a.tagGroupId);
  return /* @__PURE__ */ l(ye, { children: [
    /* @__PURE__ */ r(yc, { action: e, onChange: (s) => n({ ...e, label: s }) }),
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
const wc = yl(!1);
function Du({ children: e }) {
  return /* @__PURE__ */ r(wc.Provider, { value: !0, children: e });
}
function Bt({ tag: e, name: t }) {
  const n = wl(wc), a = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ r(Nl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: a ?? void 0 });
}
function _u({
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
      Yn,
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
function ju({
  review: e,
  onChange: t
}) {
  const n = En(Ue(e)).many, a = e.occurrence, i = $s(a), o = ["any", "isNull"].includes(a.condition) ? [] : a.conditionTagIds, s = ma([
    ...i.flatMap((d) => [d.tagId, ...d.categoryTagId ? [d.categoryTagId] : []]),
    ...o
  ]), c = (d) => {
    var g;
    return ((g = s[d]) == null ? void 0 : g.name) ?? (s[d] === null ? `Unavailable tag ${d}` : `Tag ${d}`);
  }, u = (d) => t({ ...e, occurrence: Hl(a, d) }), p = (d, g) => u(
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
        (N, v) => v !== g && N.tagId === d.tagId
      ), w = (N) => b.some((v) => v.categoryTagId === N), S = `${d.tagId}#${i.slice(0, g).filter((N) => N.tagId === d.tagId).length}`;
      return /* @__PURE__ */ l("li", { className: "dq-flag-pair", children: [
        /* @__PURE__ */ l("span", { className: "dq-flag-pair-tag", children: [
          /* @__PURE__ */ r(Fn, { "aria-hidden": "true" }),
          /* @__PURE__ */ r(Bt, { tag: s[d.tagId], name: m })
        ] }),
        /* @__PURE__ */ l("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ r("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ r(
            Ro,
            {
              entityType: "tag",
              value: d.categoryTagId,
              onChange: (N) => p(g, N),
              placeholder: "Whole review",
              allowCreate: !1,
              selectedDisplay: "input",
              inputClassName: "dq-input",
              inputAriaLabel: `Affects, ${m}`,
              excludeIds: b.flatMap(
                (N) => N.categoryTagId === void 0 ? [] : [N.categoryTagId]
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
            onClick: () => u(i.filter((N, v) => v !== g)),
            children: /* @__PURE__ */ r(Ki, { "aria-hidden": "true" })
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
              o.map((N) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": d.categoryTagId === N,
                  disabled: w(N),
                  onClick: () => p(g, N),
                  children: c(N)
                },
                N
              ))
            ]
          }
        )
      ] }, S);
    }) }),
    /* @__PURE__ */ r(
      Ro,
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
}, Uu = {
  video: za,
  audio: As,
  tag: Cs,
  performerOccurrence: Es,
  audioPerformerOccurrence: Ml
};
function qc({ entityType: e }) {
  const t = Uu[e];
  return /* @__PURE__ */ r(t, { role: "img", "aria-label": vc[e] });
}
const Gu = 2e6;
function Sc(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), a = document.createElement("a");
  a.href = n, a.download = t, a.click(), URL.revokeObjectURL(n);
}
function Ku(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function uo(e) {
  Sc([e], Ku(e));
}
async function Bu(e) {
  if (e.size > Gu) throw new Error("Review files must be smaller than 2 MB.");
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
    (a, i) => i && typeof i == "object" && !Array.isArray(i) ? Object.fromEntries(
      Object.keys(i).sort().map((o) => [o, i[o]])
    ) : i
  );
}
function kc({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: a,
  nameRef: i,
  autoFocus: o = !1
}) {
  return /* @__PURE__ */ l(ye, { children: [
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
          children: Os.map((s) => /* @__PURE__ */ r("option", { value: s, children: Nc[s] }, s))
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
function Vu(e, t) {
  const n = je(e), a = ["Review"];
  return (n === "video" || n === "tag") && a.push("Appearance"), a.push("Actions"), t && a.push("Tag choices"), a;
}
function zu({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = R(null), a = R(null), i = at(), o = at();
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
function Ec({
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
  const [S, N] = A("Review"), [v] = A(
    () => Ie(e) && e.occurrence.tagIds.length > 0
  ), [T, M] = A(""), [j, K] = A(null), [L, ee] = A(0), [te, Z] = A(!1), oe = R(null), U = R(null), B = R(null), k = Vu(e, v), I = je(e), z = me(() => Lr(e), [e]);
  H(() => M(""), [z]), H(() => {
    var F, G;
    if (te) return;
    const V = oe.current;
    if (oe.current = null, !V) return;
    (G = V.isConnected && !!((F = B.current) != null && F.contains(V)) && !(V instanceof HTMLButtonElement && V.disabled) ? V : B.current) == null || G.focus({ preventScroll: !0 });
  }, [te]);
  function Q() {
    if (!(s || te)) {
      if (!p) {
        b();
        return;
      }
      oe.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, Z(!0);
    }
  }
  function ae() {
    const V = { ...e, name: e.name.trim() }, y = sa(V);
    if (!y) {
      M(""), m();
      return;
    }
    if (M(y), !V.name) {
      N("Review"), requestAnimationFrame(() => {
        var G;
        return (G = U.current) == null ? void 0 : G.focus();
      });
      return;
    }
    const F = e.actions.find(
      (G) => !xn(G, I)
    );
    F && (N("Actions"), K(F.id), ee((G) => G + 1));
  }
  const re = T || u;
  return /* @__PURE__ */ l(ye, { children: [
    /* @__PURE__ */ l(
      "aside",
      {
        ref: (V) => {
          B.current = V, w && (w.current = V);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (V) => {
          V.key !== "Escape" || V.defaultPrevented || s || Pn(V) || (V.preventDefault(), V.stopPropagation(), Q());
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
              tabs: k.map((V) => ({
                key: V,
                label: V,
                count: V === "Actions" ? e.actions.length : void 0
              })),
              activeTab: S,
              onTabChange: (V) => N(V)
            }
          ) }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-body", children: /* @__PURE__ */ l("fieldset", { className: "dq-drawer-fields", disabled: s, children: [
            /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review settings" }),
            /* @__PURE__ */ l(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: S !== "Review",
                "aria-label": "Review",
                children: [
                  /* @__PURE__ */ r(
                    kc,
                    {
                      review: e,
                      onChange: t,
                      entityTypeLocked: !0,
                      nameRef: U,
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
                  Ie(e) && /* @__PURE__ */ r(ju, { review: e, onChange: t }),
                  /* @__PURE__ */ r("div", { children: /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => uo(e),
                      children: "Export draft"
                    }
                  ) })
                ]
              }
            ),
            k.includes("Appearance") && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: S !== "Appearance",
                "aria-label": "Appearance",
                children: /* @__PURE__ */ r(Ju, { review: e, onChange: t })
              }
            ),
            /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel dq-actions-panel",
                role: "tabpanel",
                hidden: S !== "Actions",
                "aria-label": "Actions",
                children: /* @__PURE__ */ r(
                  Mu,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: i,
                    trees: o,
                    saving: s,
                    expandedId: j,
                    onExpand: K,
                    reveal: L
                  }
                )
              }
            ),
            v && Ie(e) && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: S !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ r(_u, { review: e, onChange: t })
              }
            )
          ] }) }),
          (re || g) && /* @__PURE__ */ l("div", { className: "dq-drawer-notices", children: [
            g,
            re && /* @__PURE__ */ l("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ r(On, { "aria-hidden": "true" }),
              re
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
                  s || ae();
                },
                children: "Save review"
              }
            )
          ] })
        ]
      }
    ),
    te && /* @__PURE__ */ r(
      zu,
      {
        onKeepEditing: () => Z(!1),
        onDiscard: () => {
          oe.current = null, Z(!1), b();
        }
      }
    )
  ] });
}
function Ju({
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
        Wo,
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
  return /* @__PURE__ */ l(ye, { children: [
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ l("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ r(
          Ho,
          {
            name: `${n}-layout-choice`,
            checked: p === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ r(Wu, {}),
            onChoose: () => i({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ r(
          Ho,
          {
            name: `${n}-layout-choice`,
            checked: p === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ r(Hu, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ r(
        Wo,
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
function Wo({
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
function Ho({
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
function Wu() {
  return /* @__PURE__ */ l("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function Hu() {
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
const Ii = "The queue differs from the saved review.";
function Cc({
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
  chipsEnd: S
}) {
  const N = R(null);
  ef(N);
  const v = tf(N), [T, M] = A({ differs: m, text: "" });
  return T.differs !== m && M({
    differs: m,
    text: m ? T.differs === !1 ? Ii : T.text : ""
  }), /* @__PURE__ */ l("header", { ref: N, className: "dq-review-header", children: [
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
          children: /* @__PURE__ */ r(fa, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-type", title: vc[n], children: /* @__PURE__ */ r(qc, { entityType: n }) }),
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
          children: /* @__PURE__ */ r(Dr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    u,
    /* @__PURE__ */ l("div", { className: "dq-review-header-trail", children: [
      p,
      g && /* @__PURE__ */ r(Qu, { change: g, onPress: v }),
      d
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    b,
    w && /* @__PURE__ */ r("div", { className: "dq-review-chips-after", children: w }),
    S && /* @__PURE__ */ r("div", { className: "dq-review-chips-end", children: S }),
    /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: T.text })
  ] });
}
function Qu({
  change: e,
  onPress: t
}) {
  const n = at(), a = at(), i = `${Ii} Save these filters to the review.`, o = e.onSave ? `${Ii} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  return /* @__PURE__ */ l(ye, { children: [
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
          /* @__PURE__ */ r(Pl, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ r(Ll, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-queue-label", children: "Reset" }),
          /* @__PURE__ */ r("span", { id: a, hidden: !0, children: o })
        ]
      }
    )
  ] });
}
const Yu = ["queue", "summary", "name", "layout", "range"], Xu = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, Zu = "(min-width: 1400px)";
function Pa(e) {
  const t = e.querySelector(".dq-review-header-lead"), n = e.querySelector(".dq-review-header-trail");
  if (!t || !n) return !0;
  const a = t.getBoundingClientRect();
  return !a.height || n.getBoundingClientRect().top < a.bottom;
}
function Qo(e, t) {
  const n = e.querySelector(".dq-review-header-lead h1"), a = () => {
    e.removeAttribute("data-compact"), n == null || n.style.removeProperty("max-width");
  };
  if (a(), !t) return !0;
  const i = Yu.filter(
    (o) => e.querySelector(Xu[o])
  );
  for (let o = 1; o <= i.length && !Pa(e); o++) {
    if (e.dataset.compact = i.slice(0, o).join(" "), i[o - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !Pa(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return Pa(e) ? !0 : (a(), !1);
}
function ef(e) {
  const t = cc(Zu), [n, a] = A(0), i = R(!1);
  kt(() => {
    e.current && (i.current = !Qo(e.current, t));
  }, [e, t, n]), kt(() => {
    const o = e.current;
    o && t && !i.current && !Pa(o) && (i.current = !Qo(o, t));
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
function tf(e) {
  const t = R(!1);
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
function Ac({
  page: e,
  pages: t,
  onPage: n
}) {
  const [a, i] = A(!1), [o, s] = A(""), c = R(null), u = R(null);
  H(() => {
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
        value: o,
        onChange: (g) => s(g.target.value),
        onKeyDown: (g) => {
          Pn(g) || (g.key === "Enter" ? (g.preventDefault(), d()) : g.key === "Escape" && (g.preventDefault(), g.stopPropagation(), p(!0)));
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
          /* @__PURE__ */ r(Bi, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-layout-label", children: "Grid" })
        ]
      }
    )
  ] });
}
function nf({
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
function fo({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [a, i] = A(!1), [o, s] = A(!1), c = R(null), u = R(null), p = at();
  kt(() => {
    if (!a || !u.current || !c.current) return;
    const m = c.current.getBoundingClientRect(), b = u.current.offsetHeight + 12, w = window.innerHeight - m.bottom;
    s(w < b && m.top > w);
  }, [a]), H(() => {
    var m, b;
    a && ((b = (m = u.current) == null ? void 0 : m.querySelector('[role="menuitem"]:not(:disabled)')) == null || b.focus({ preventScroll: !0 }));
  }, [a]), H(() => {
    t && i(!1);
  }, [t]);
  const d = (m = !0) => {
    var b;
    i(!1), m && ((b = c.current) == null || b.focus());
  };
  return /* @__PURE__ */ l("div", { className: `dq-menu${a ? " dq-menu-open" : ""}`, onKeyDown: (m) => {
    var S, N;
    if (!a) return;
    const b = [
      ...((S = u.current) == null ? void 0 : S.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], w = b.indexOf(document.activeElement);
    if (m.key === "Escape")
      m.preventDefault(), m.stopPropagation(), d();
    else if (m.key === "Tab")
      d(!1);
    else if (m.key === "ArrowDown" || m.key === "ArrowUp") {
      if (m.preventDefault(), !b.length) return;
      const v = m.key === "ArrowDown" ? 1 : -1;
      b[(w + v + b.length) % b.length].focus();
    } else (m.key === "Home" || m.key === "End") && (m.preventDefault(), (N = b.at(m.key === "Home" ? 0 : -1)) == null || N.focus());
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
        children: /* @__PURE__ */ r(Fl, { "aria-hidden": "true" })
      }
    ),
    a && /* @__PURE__ */ l(ye, { children: [
      /* @__PURE__ */ r("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => d(!1) }),
      /* @__PURE__ */ r(
        "div",
        {
          ref: u,
          id: p,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${o ? " dq-menu-list-up" : ""}`,
          children: e.map((m) => /* @__PURE__ */ l(_i, { children: [
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
function Ka(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function ho(e) {
  return String(e.type).toLowerCase() === "tag";
}
function po(e) {
  return !!String(e ?? "").trim();
}
function mo(e) {
  return [
    ...new Set(
      Ka(e.customFieldCriteria).filter(ho).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !po(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function go(e, t) {
  const n = Ka(e.customFieldCriteria);
  if (!n.length) return e;
  let a = !1;
  const i = n.map((o) => {
    if (!ho(o)) return o;
    const s = { ...o };
    for (const [c, u] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const p = t[String(o[c] ?? "")];
      p && !po(o[u]) && (s[u] = p, a = !0);
    }
    return s;
  });
  return a ? { ...e, customFieldCriteria: i } : e;
}
function Ic(e, t, n) {
  const a = Ka(e.customFieldCriteria);
  if (!a.length) return e;
  const i = Ka(n.customFieldCriteria), o = (u, p) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (d) => (u[d] ?? void 0) === (p[d] ?? void 0)
  );
  let s = !1;
  const c = a.map((u) => {
    if (!ho(u)) return u;
    const p = i.find((g) => o(g, u));
    if (!p) return u;
    const d = { ...u };
    for (const [g, m] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const b = t[String(u[g] ?? "")];
      b && u[m] === b && !po(p[m]) && (delete d[m], s = !0);
    }
    return d;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
async function rf(e, t, n) {
  if (!xn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const a = Ue(e), i = n.steps.some((c) => Mn(c.mode)) ? await Od(a) : "", o = await eo(n);
  let s = t.applications;
  for (const c of [
    ...o.filter((u) => !Mn(u.mode)),
    ...o.filter((u) => Mn(u.mode))
  ]) {
    const u = (p) => Md(
      i,
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
async function bo(e, t) {
  const n = e.occurrence;
  if (Ji(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const a = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await he("/api/performers/find", {
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
    if (c.items.forEach((u) => a.add(u.id)), s * 1e3 >= c.totalCount) return [...a];
    if (!c.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Rc(e) {
  return ia(e.condition) && e.hideConfirmedAbsent !== !1;
}
function yo(e, t) {
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
  }, s = Rc(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
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
async function wo(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => Wa([n], t))
  );
}
function $c(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function af(e, t, n = e.conditionTagIds.map((a) => [a])) {
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
function of(e, t, n, a, i) {
  if (!Rc(e)) return !1;
  const o = zs(t, n);
  return e.conditionTagIds.every(
    (s, c) => o.includes(s) || i[c].some((u) => a.includes(u))
  );
}
async function Oc(e, t, n, a) {
  if ((t == null ? void 0 : t.length) === 0 || $c(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = Ue(e), o = await na(
    yo(e, t),
    { ...e.view.filter, page: n },
    a
  ), s = t === null ? null : new Set(t), c = e.occurrence, u = o.items.length ? await wo(c, a) : [], p = new Array(o.items.length);
  let d = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; d < o.items.length; ) {
        const g = d++, m = o.items[g], b = await he(
          `/api/tagapplications?hostType=${i}&hostId=${m.id}&contextType=performer`,
          { signal: a }
        );
        p[g] = m.performers.filter((w) => s === null || s.has(w.id)).flatMap((w) => {
          const S = b.filter(
            (v) => v.hostType === i && v.hostId === m.id && v.contextType === "performer" && v.contextId === w.id
          ), N = S.map((v) => v.tag.id);
          return af(e.occurrence, N, u) && !of(c, m, w.id, N, u) ? [
            {
              key: `${m.id}:${w.id}`,
              media: m,
              performer: w,
              applications: S
            }
          ] : [];
        });
      }
    })
  ), { items: p.flat(), totalCount: o.totalCount };
}
async function Mc(e, t, n) {
  const a = new Set(e.occurrence.tagIds);
  if (n.some((p) => !a.has(p)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = Ue(e), o = await vi(i, t.media.id);
  if (!o.performers.some(
    (p) => p.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, c = (await he(s)).filter(
    (p) => p.hostType === i && p.hostId === o.id && p.contextType === "performer" && p.contextId === t.performer.id
  ), u = new Set(n);
  try {
    for (const p of u)
      c.some((d) => d.tag.id === p) || await he("/api/tagapplications", {
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
      a.has(p.tag.id) && !u.has(p.tag.id) && await he(`/api/tagapplications/${p.id}`, {
        method: "DELETE"
      });
    return await he(s);
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
function sf(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function hn(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const u = n ? zs(
      await vi(e, t.media.id),
      t.occurrence.performer.id
    ) : [], p = (await he(sf(e, t))).filter(
      (d) => d.hostType === e && d.hostId === t.media.id && d.contextType === "performer" && d.contextId === t.occurrence.performer.id
    );
    return Ti(p.map((d) => d.tag)), {
      ids: [...new Set(p.map((d) => d.tag.id))],
      names: [...new Set(p.map((d) => d.tag.name))],
      absent: u,
      applications: p
    };
  }
  const a = await vi(e, t.media.id), i = (a.tags ?? []).filter(
    (u) => u.canRemove !== !1 || u.isDerived !== !0
  );
  Ti(i);
  const o = Object.keys(a.customFields ?? {}).find(
    (u) => u.toLowerCase() === ja
  ) ?? ja, s = ((c = a.customFields) == null ? void 0 : c[o]) ?? [];
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
async function vo(e, t, n) {
  if (t.occurrence && Ie(e))
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
    for (const [a, i] of [
      ["ADD", n.added],
      ["REMOVE", n.removed]
    ])
      i.length && await he(
        `/api/${Zn(Ue(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: a, tagIds: i })
        }
      );
}
async function cf(e, t, n) {
  t.occurrence && Ie(e) ? await rf(e, t.occurrence, n) : await Js(Ue(e), n, [t.media.id]);
}
function Ri(e, t, n, a) {
  const i = (o) => o.filter((s) => a.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: _r(i(t.ids), i(n.ids)),
    absence: _r(i(t.absent), i(n.absent))
  };
}
function lf(e, t) {
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
class Fc extends Error {
}
const $i = (e) => e instanceof Error ? e.message : "Request failed.", Yo = (e) => [...e].sort((t, n) => t - n), ca = (e, t) => JSON.stringify(Yo(e)) === JSON.stringify(Yo(t)), Oi = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Ba(e, t, n, a) {
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
function df(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function uf(e, t, n, a) {
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
      u = (await he(`/api/tags/${c}`, { signal: a })).name;
    } catch {
      a.throwIfAborted();
    }
    throw new Fc(
      `${s.map((p) => p.label).join(" and ")} answer the same condition tag, ${u}. Choose one of them.`
    );
  }
}
async function ff(e, t, n, a = () => {
}) {
  if (!t.length || t.some(
    (m) => !xn(m, e.entityType) || !m.steps.length || m.steps.some(
      (b) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(b.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = ia(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await wo(i.occurrence, n) : [];
  await uf(i, o, s, n);
  const c = await Promise.all(
    o.map(async (m) => ({
      ...m,
      steps: await eo(m, n)
    }))
  ), u = structuredClone(df(c));
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
  const d = await bo(i, n), g = /* @__PURE__ */ new Map();
  for (let m = 1; ; m++) {
    n.throwIfAborted();
    const b = await Oc(i, d, m, n);
    for (const w of b.items) {
      const S = {
        ids: [...new Set(w.applications.map((v) => v.tag.id))],
        names: w.applications.map((v) => v.tag.name),
        absent: [],
        applications: w.applications
      }, N = Ba(S.ids, u, s, !0);
      g.set(w.key, {
        item: { key: w.key, media: w.media, occurrence: w },
        before: S,
        expected: S,
        conflict: N.conflict,
        status: ca(S.ids, N.desired) ? "unchanged" : "pending"
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
function hf(e, t, n) {
  const a = (o) => o.ids.filter((s) => n.includes(s));
  if (!ca(a(e), a(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return ca(i(e), i(t));
}
async function xc(e, t, n, a) {
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
function Pc(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function Lc(e) {
  return e.entries.filter((t) => t.operation);
}
async function pf(e, t, n, a, i = !1) {
  await xc(
    Pc(e, i),
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
        if (s = await hn(Ue(e.review), o.item, !1), !hf(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (m) {
        o.status = "failed", o.error = $i(m);
        return;
      }
      const c = Ba(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), u = [
        ...s.ids.filter((m) => !e.touched.includes(m)),
        ...c.desired.filter((m) => e.touched.includes(m))
      ], p = _r(s.ids, u);
      if (!p.added.length && !p.removed.length) {
        const m = !o.operation && c.kept.length > 0;
        o.status = o.operation ? "changed" : m ? "skipped" : "unchanged", o.error = m ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let d;
      try {
        await vo(e.review, o.item, p);
      } catch (m) {
        d = m;
      }
      let g = !1;
      try {
        const m = await hn(Ue(e.review), o.item, !1);
        g = !0, o.expected = m;
        const b = Ri(
          o.item,
          o.before,
          m,
          e.touched
        );
        if (o.operation = Oi(b) ? b : void 0, d) throw d;
        if (!ca(
          m.ids.filter((w) => e.touched.includes(w)),
          u.filter((w) => e.touched.includes(w))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (m) {
        if (o.status = "failed", o.error = $i(m), !g)
          try {
            const b = await hn(Ue(e.review), o.item, !1);
            o.expected = b;
            const w = Ri(
              o.item,
              o.before,
              b,
              e.touched
            );
            o.operation = Oi(w) ? w : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    a
  );
}
async function mf(e, t, n) {
  await xc(
    Lc(e),
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
        lf(i, c), s = !0, await vo(e.review, a.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const u = await hn(Ue(e.review), a.item, !1);
        if (!ca(
          u.ids.filter((p) => o.includes(p)),
          a.before.ids.filter((p) => o.includes(p))
        ))
          throw new Error("Undo did not restore all affected tags.");
        a.operation = void 0, a.expected = u, a.status = "unchanged", a.error = void 0;
      } catch (c) {
        if (a.error = `Undo stopped: ${$i(c)}`, a.status = "failed", s)
          try {
            const u = await hn(Ue(e.review), a.item, !1), p = Ri(
              a.item,
              a.before,
              u,
              o
            );
            a.operation = Oi(p) ? p : void 0, a.expected = u;
          } catch {
            a.unverified = !0;
          }
      }
    },
    n
  );
}
const Dc = (e, t) => t.count - e.count || Ws(e, t);
async function gf(e, t, n) {
  const a = Ue(e), i = e.occurrence, [o, s] = await Promise.all([
    he(
      `/api/tagapplications?hostType=${a}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    wo(i, n)
  ]), c = o.filter(
    (w) => w.hostType === a && w.contextType === "performer" && w.contextId === t
  );
  Ti(c.map((w) => w.tag));
  const u = await Promise.all(
    s.map(async (w, S) => {
      const N = i.conditionTagIds[S];
      return (await he(`/api/tags/${N}`, { signal: n })).name;
    })
  ), p = new Set(s.flat()), d = new Set(
    [
      ...e.actions.flatMap((w) => w.steps).filter((w) => w.mode === "ADD" || w.mode === "MARK_PRESENT").flatMap((w) => w.tagIds),
      ...i.tagIds
    ].filter((w) => !p.has(w))
  ), g = (w) => {
    const S = /* @__PURE__ */ new Map();
    for (const N of c) {
      if (!w.has(N.tag.id)) continue;
      const v = S.get(N.tag.id) ?? {
        tag: N.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      v.hosts.add(N.hostId), S.set(N.tag.id, v);
    }
    return [...S.values()].map((N) => ({ ...N.tag, count: N.hosts.size })).sort(Dc);
  }, m = s.map((w, S) => ({
    id: i.conditionTagIds[S],
    name: u[S],
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
function bf(e, t, n, a) {
  const i = /* @__PURE__ */ new Set([e, ...t]), o = (s) => {
    if (s === e) return !0;
    const c = a.get(s);
    if (!c) return !1;
    const u = new Set(c);
    return [...i].every((p) => u.has(p));
  };
  return n.some(
    (s) => [...Xn(s)].some((c) => i.has(c)) && s.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(o)
    )
  );
}
function No(e, t, n) {
  const a = /* @__PURE__ */ new Map();
  for (const b of e.groups) for (const w of b.tags) a.set(w.id, w);
  const i = (b) => b.flatMap((w) => a.get(w) ?? []).sort(Dc), o = (b) => b.members ?? b.tags.map((w) => w.id), s = wr(t).flatMap((b) => {
    const w = [
      ...new Set(b.actions.flatMap((S) => [...Xn(t[S])]))
    ];
    return w.length ? [{ ...b, answers: w, tags: i(w) }] : [];
  }), c = (b) => b.tags.length > 1 ? [b] : [], u = e.groups.filter((b) => b.id !== null).map((b) => {
    const w = `tag:${b.id}`, S = o(b), N = new Set(S);
    return {
      key: w,
      kind: "condition",
      name: b.name,
      members: S,
      tags: b.tags,
      mixed: bf(b.id, S, t, n) ? c({ key: w, name: b.name, members: S, tags: b.tags }) : (
        // A category that holds several answers is mixed where a group inside it is.
        s.filter((v) => v.answers.every((T) => N.has(T))).flatMap(
          (v) => c({
            key: `group:${v.key}`,
            name: v.name,
            members: v.answers,
            tags: v.tags
          })
        )
      )
    };
  }), p = u.map((b) => new Set(b.members)), d = /* @__PURE__ */ new Set();
  for (const b of s) {
    if (p.some((S) => b.answers.every((N) => S.has(N)))) continue;
    b.answers.forEach((S) => d.add(S));
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
const di = { summary: null, error: "" };
function _c(e, t, n = 0) {
  const a = e == null ? void 0 : e.occurrence, i = JSON.stringify([
    e == null ? void 0 : e.entityType,
    t,
    a == null ? void 0 : a.condition,
    a == null ? void 0 : a.conditionTagIds,
    a == null ? void 0 : a.includeSubtags,
    a == null ? void 0 : a.tagIds,
    e == null ? void 0 : e.actions.map((c) => c.steps)
  ]), [o, s] = A({
    key: i,
    value: di
  });
  return H(() => {
    if (s((u) => u.key === i ? u : { key: i, value: di }), e === null || t === null) return;
    const c = new AbortController();
    return gf(e, t, c.signal).then((u) => {
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
  }, [i, n]), o.key === i ? o.value : di;
}
function yf(e, t) {
  const n = (p) => {
    var d;
    return ((d = p.tagIds) == null ? void 0 : d.every((g) => e.members.includes(g))) ?? !1;
  }, a = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  for (const p of e.mixed) {
    const d = Gd(p, t).filter((m) => m.key !== e.key), g = p.key === e.key ? [] : d.filter(n);
    g.length ? g.forEach((m) => a.add(m.name)) : d.forEach((m) => i.add(m.name));
  }
  const o = Nt(e.name), s = [...a].filter((p) => Nt(p) !== o), c = s.length < a.size, u = i.size ? ` (${c ? "partly " : ""}listed under ${[...i].join(", ")})` : "";
  return { names: s, here: c || i.size > 0, note: u };
}
function wf(e, { names: t, here: n, note: a }) {
  const i = `this ${e.kind === "group" ? "group" : "category"}${a}`;
  return `This performer has different answers in ${t.length ? n ? `${i} and in ${t.join(", ")}` : t.join(", ") : i}.`;
}
function Mi({
  summary: e,
  error: t,
  mediaKind: n,
  actions: a = [],
  trees: i = Si,
  flags: o = [],
  className: s = ""
}) {
  const c = En(n), u = (m) => `${m.toLocaleString()} ${m === 1 ? c.one : c.many}`, p = e ? No(e, a, i) : [], d = ro(p), g = (m) => [
    ...new Set(
      o.filter((b) => {
        var w;
        return (w = b.tagIds) == null ? void 0 : w.some((S) => m.includes(S));
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
          const b = m.kind === "other" ? [] : g(m.members), w = yf(m, d), S = w.note ? /* @__PURE__ */ r("span", { className: "dq-sr-only", children: w.note }) : null;
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
                      S,
                      ` ${w.here ? "and in" : "in"} ${w.names.join(", ")}`
                    ] }) : S
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
            m.tags.length ? /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": m.name, children: m.tags.map((N) => /* @__PURE__ */ l("li", { className: "dq-tag", children: [
              /* @__PURE__ */ r(Bt, { tag: N }),
              /* @__PURE__ */ r("span", { className: "dq-chip-count", "aria-hidden": "true", children: N.count.toLocaleString() }),
              /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
                ", ",
                u(N.count)
              ] })
            ] }, N.id)) }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" })
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
const Xo = 5;
function vf(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await he(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
function Nf(e, t) {
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
const Zo = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), Fi = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], es = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], qf = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, ui = 250;
function ta(e, t) {
  var a, i;
  const n = e.item.media;
  return n.title || ((i = (a = n.files) == null ? void 0 : a[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Sf({ step: e }) {
  const t = Fi.findIndex((n) => n.id === e);
  return /* @__PURE__ */ r("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Fi.map((n, a) => {
    const i = a < t ? "done" : a === t ? "current" : "next";
    return /* @__PURE__ */ l("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ r(da, {}) : a + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function ts({ parts: e, id: t }) {
  return /* @__PURE__ */ r("span", { className: "dq-batch-effect", id: t, children: e.map((n, a) => /* @__PURE__ */ l(_i, { children: [
    a > 0 && " ",
    /* @__PURE__ */ r("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, a)) });
}
function ea({
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
        n && /* @__PURE__ */ l(ye, { children: [
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
    br(e.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
      "+ ",
      /* @__PURE__ */ r(Bt, { tag: i })
    ] }) }, `added-${i.id}`)),
    br(t.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ l("del", { children: [
      "− ",
      /* @__PURE__ */ r(Bt, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function rs({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: a,
  describe: i
}) {
  return /* @__PURE__ */ l("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: e }),
      t.length > ui && /* @__PURE__ */ l("span", { children: [
        "First ",
        ui.toLocaleString(),
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
      /* @__PURE__ */ r("tbody", { children: t.slice(0, ui).map((o) => {
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
                ta(o, n)
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
function kf(e) {
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
function Ef({
  review: e,
  disabled: t,
  performerAttention: n,
  trees: a,
  onOpen: i,
  onClose: o,
  onWrite: s
}) {
  const [c, u] = A(!1), [p, d] = A("answers"), [g, m] = A(null), [b, w] = A({}), [S, N] = A([]), [v, T] = A(!1), [M, j] = A(!1), [K, L] = A(""), [ee, te] = A(!1), [Z, oe] = A(""), [U, B] = A(null), [k, I] = A(null), [z, Q] = A([]), [ae, re] = A(0), V = R(null), y = R(null), F = R(null), G = R(!1), W = R(!1), ge = R(null), He = R(!1), D = R(0), fe = R(!1), Re = R({ onClose: o, onWrite: s });
  Re.current = { onClose: o, onWrite: s };
  const se = at(), Oe = p === "run", Xe = (U == null ? void 0 : U.kind) === "undo", Ee = Oe && g ? g.review : e, Cn = jr(Ee.actions), we = Ee.occurrence, Ve = Ue(Ee), Et = En(Ve), pn = Et.queue, Fe = Oe && g ? g.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((C) => C.steps.length && !Qn(C))
  ), it = Fe.filter((C) => S.includes(C.id)), Te = we.targetMode === "selected" && we.performerIds.length === 1, Ze = _c(
    Ee,
    c && Te ? we.performerIds[0] : null,
    ae
  ), Vt = mo(Ee.view.objectFilter), Me = ma(
    c ? [...Ha(Fe), ...we.conditionTagIds, ...Vt] : []
  ), An = me(() => sc(Me), [Me]), ut = (C) => b[C] ?? Me[C] ?? { id: C, name: `Tag ${C}` }, Mt = JSON.stringify(
    Object.fromEntries(
      Vt.flatMap((C) => {
        var Y;
        const P = (Y = Me[C]) == null ? void 0 : Y.name;
        return P ? [[String(C), P]] : [];
      })
    )
  ), ht = me(
    () => go(Ee.view.objectFilter, JSON.parse(Mt)),
    [Ee.view.objectFilter, Mt]
  );
  H(() => {
    var C, P, Y;
    c && ((C = V.current) == null || C.showModal(), (Y = (P = V.current) == null ? void 0 : P.querySelector(".dq-batch-answer input")) == null || Y.focus());
  }, [c]), H(() => {
    if (!c) return;
    const C = requestAnimationFrame(() => {
      var le;
      const P = V.current, Y = document.activeElement;
      if (!P || Y && Y !== document.body && P.contains(Y)) return;
      (le = (p === "answers" ? P.querySelector(".dq-batch-answer input:checked") ?? P.querySelector(".dq-batch-answer input") : P.querySelector("[data-batch-focus]")) ?? y.current) == null || le.focus();
    });
    return () => cancelAnimationFrame(C);
  }, [c, p, M, g]), H(() => {
    if (c || t || !G.current) return;
    const C = requestAnimationFrame(() => {
      const P = F.current;
      if (!G.current || !P || P.disabled) return;
      G.current = !1;
      const Y = document.activeElement;
      (!Y || Y === document.body) && P.focus();
    });
    return () => cancelAnimationFrame(C);
  }, [c, t]), H(() => {
    if (!c || we.targetMode !== "selected") return;
    const C = new AbortController();
    return Q([]), vf(we.performerIds.slice(0, Xo), C.signal).then((P) => {
      C.signal.aborted || Q(P);
    }).catch(() => {
    }), () => C.abort();
  }, [c, we.targetMode, JSON.stringify(we.performerIds)]), H(
    () => () => {
      var C;
      W.current = !0, (C = ge.current) == null || C.abort();
    },
    []
  ), H(() => {
    if (!M) return;
    const C = (P) => {
      P.preventDefault(), P.returnValue = "";
    };
    return window.addEventListener("beforeunload", C), () => window.removeEventListener("beforeunload", C);
  }, [M]);
  function zt() {
    d("answers"), m(null), w({}), B(null), T(!1), N([]), oe(""), L(""), te(!1), I(null);
  }
  function qt() {
    fe.current || (u(!1), Re.current.onClose(He.current), He.current = !1, zt(), G.current = !0);
  }
  function er(C, P) {
    N(
      (Y) => P ? [...Y, C] : Y.filter((be) => be !== C)
    ), m(null), w({}), oe(""), L(""), te(!1), I(null);
  }
  function Tt() {
    d("answers"), I(null), oe("");
  }
  function Tn() {
    d("preview"), g || Ne();
  }
  function Jt() {
    var C;
    W.current = !0, (C = ge.current) == null || C.abort(), oe("Stopping after in-flight operations settle…");
  }
  function Ft(C) {
    I(
      (P) => (P == null ? void 0 : P.group) === C.group && P.reason === C.reason ? null : C
    );
  }
  const mn = (C, P) => (k == null ? void 0 : k.group) === C && k.reason === P;
  async function Ne() {
    if (!it.length || fe.current) return;
    fe.current = !0, j(!0), L(""), te(!1), oe("Loading all matching occurrences…"), m(null), w({}), I(null);
    const C = new AbortController();
    ge.current = C;
    try {
      await Nf(D.current, C.signal);
      const P = await ff(
        e,
        it,
        C.signal,
        (be) => oe(`Loaded ${be.toLocaleString()} matching occurrences…`)
      );
      C.signal.throwIfAborted();
      const Y = {};
      for (const be of P.entries)
        for (const le of be.before.applications ?? [])
          Y[le.tag.id] = le.tag;
      w(Y), m(P), oe("Preview ready. No tags have been changed.");
    } catch (P) {
      L(
        C.signal.aborted ? "Preview cancelled. No tags were changed." : P instanceof Error ? P.message : String(P)
      ), te(!C.signal.aborted && P instanceof Fc), oe("");
    } finally {
      fe.current = !1, j(!1), ge.current = null;
    }
  }
  async function Ct(C) {
    if (!g || fe.current) return;
    const P = (C === "undo" ? Lc(g) : Pc(g, C === "retry")).length;
    fe.current = !0, W.current = !1, He.current = !0, Re.current.onWrite(), j(!0), d("run"), L(""), B({ kind: C, total: P, done: 0, stopped: !1 }), oe(
      C === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const Y = () => B((le) => le && { ...le, done: le.done + 1 });
    let be = !1;
    try {
      C === "undo" ? await mf(g, () => W.current, Y) : await pf(g, v, () => W.current, Y, C === "retry"), oe(
        W.current ? "Stopped after in-flight operations settled. Completed changes are retained." : C === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (le) {
      be = !0, oe(""), L(le instanceof Error ? le.message : String(le));
    } finally {
      D.current = Date.now(), fe.current = !1;
      const le = W.current || be;
      B(($e) => $e && { ...$e, stopped: le }), j(!1), re(($e) => $e + 1);
    }
  }
  const ot = (g == null ? void 0 : g.entries) ?? [], Dn = me(
    () => new Map(
      ((g == null ? void 0 : g.entries) ?? []).map((C) => [
        C.item.key,
        Ba(C.before.ids, g.action, g.categories, v)
      ])
    ),
    [g, v]
  ), Wt = (C) => Dn.get(C.item.key), xe = (C) => _r(C.before.ids, Wt(C).desired), It = (C) => {
    const P = xe(C);
    return C.status === "pending" && (P.added.length > 0 || P.removed.length > 0);
  }, ce = (C) => C.conflict || Wt(C).kept.length > 0 || Wt(C).replaced.length > 0, x = me(() => {
    const C = (g == null ? void 0 : g.entries) ?? [];
    return {
      willChange: C.filter(It).length,
      correct: C.filter((P) => P.status === "unchanged").length,
      different: C.filter(ce).length,
      hosts: new Set(C.map((P) => P.item.media.id)).size,
      added: [...new Set(C.flatMap((P) => xe(P).added))],
      removed: [...new Set(C.flatMap((P) => xe(P).removed))]
    };
  }, [Dn]), Ce = me(
    () => ((g == null ? void 0 : g.entries) ?? []).filter((C) => C.item.media.date).sort((C, P) => C.item.media.date.localeCompare(P.item.media.date)),
    [g]
  ), pt = Oe ? kf(ot) : null, _n = (C) => Cn.keys[Ee.actions.findIndex((P) => P.id === C)] ?? "", pe = (C) => qr(C, An, [], a), Rt = ia(we.condition) && we.includeSubtags !== !1 && we.conditionTagIds.length > 0, tt = Ce[0], Pe = Ce.length > 1 ? Ce[Ce.length - 1] : void 0, et = (C) => `/${Ve}/${C.item.media.id}`, Ht = Te ? z[0] : void 0, st = me(
    () => n ? ec(
      n,
      Ze.summary ? ro(
        No(Ze.summary, Ee.actions, a ?? Si)
      ) : []
    ) : [],
    [n, Ze.summary, Ee.actions, a]
  ), mt = Bd(it, st, a ?? Si), xt = n ?? [], Qt = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: It },
    correct: { title: "Occurrences already correct", test: (C) => C.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: ce }
  };
  function ct() {
    const C = qf[we.condition], P = !!C && we.conditionTagIds.length > 0, Y = we.performerIds.slice(0, Xo), be = String(Ee.view.filter.q ?? "").trim(), le = we.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ l("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      Ji(we) ? /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "All performers" }) : we.targetMode === "selected" ? /* @__PURE__ */ l(ye, { children: [
        Y.map(($e, Ae) => /* @__PURE__ */ l("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ r(Pr, { performer: { id: $e, name: z[Ae] ?? "" } }),
          z[Ae] ?? "…"
        ] }, $e)),
        we.performerIds.length > Y.length && /* @__PURE__ */ l("span", { className: "dq-batch-chip", children: [
          (we.performerIds.length - Y.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ l(ye, { children: [
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
                objectFilter: we.performerFilter,
                criteriaDefinitions: ji,
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
        P ? C : Vi[we.condition],
        P && /* @__PURE__ */ r("span", { className: "dq-batch-chip-tags", children: br(we.conditionTagIds.map(ut)).map(($e) => /* @__PURE__ */ r(Bt, { tag: $e }, $e.id)) })
      ] }),
      P && /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: we.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      ia(we.condition) && we.hideConfirmedAbsent !== !1 && /* @__PURE__ */ l("span", { className: "dq-batch-chip", title: le, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
          ": ",
          le
        ] })
      ] }),
      be && /* @__PURE__ */ l("span", { className: "dq-batch-chip", children: [
        "Search “",
        be,
        "”"
      ] }),
      Object.keys(Ee.view.objectFilter).length > 0 && /* @__PURE__ */ r(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${pn} filters`,
          children: /* @__PURE__ */ r(
            aa,
            {
              filter: Ee.view.filter,
              objectFilter: ht,
              criteriaDefinitions: Ve === "audio" ? ys : Ui,
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
  function jn(C, P, Y = !0) {
    if (!C.length) return null;
    const be = /* @__PURE__ */ r("strong", { children: Ht || "This performer" }), le = Y ? `Check the earliest and latest ${Et.many} before applying, or narrow the batch with a date filter.` : "", $e = C.every((Ae) => Ae.tagIds === null && !Ae.mixed.length);
    return /* @__PURE__ */ l("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ r(Fn, { "aria-hidden": "true" }),
      /* @__PURE__ */ l("div", { children: [
        $e ? /* @__PURE__ */ l("p", { children: [
          be,
          " is flagged: ",
          /* @__PURE__ */ r("strong", { children: C.flatMap((Ae) => Ae.flags).join(", ") }),
          ".",
          " ",
          le
        ] }) : /* @__PURE__ */ l(ye, { children: [
          /* @__PURE__ */ l("p", { children: [
            be,
            " needs attention where the chosen answers apply.",
            le && ` ${le}`
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: C.map((Ae) => /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ r("strong", { children: Ae.tagIds === null ? "Whole review" : Ae.name }),
            ":",
            " ",
            ao(Ae).join("; ")
          ] }, Ae.key)) })
        ] }),
        P && tt && /* @__PURE__ */ l("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ l("a", { href: et(tt), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            ta(tt, Ve),
            " · ",
            tt.item.media.date
          ] }),
          Pe && /* @__PURE__ */ l("a", { href: et(Pe), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            ta(Pe, Ve),
            " · ",
            Pe.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function Yt() {
    const C = mt.filter((Y) => Y.tagIds === null), P = mt.filter((Y) => Y.tagIds !== null);
    return /* @__PURE__ */ l(ye, { children: [
      ct(),
      jn(C, !1),
      /* @__PURE__ */ l("div", { className: `dq-batch-pick${Te ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ l("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ r("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ r("div", { className: "dq-batch-answers", children: Fe.map((Y, be) => {
            const le = _n(Y.id);
            return /* @__PURE__ */ l("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ r(
                "input",
                {
                  type: "checkbox",
                  checked: S.includes(Y.id),
                  "aria-labelledby": `${se}-answer-${be}`,
                  "aria-describedby": `${se}-effect-${be}`,
                  onChange: ($e) => er(Y.id, $e.target.checked)
                }
              ),
              /* @__PURE__ */ r("span", { className: "dq-batch-answer-key", children: le && /* @__PURE__ */ r(dt, { binding: le, hidden: !0 }) }),
              /* @__PURE__ */ l("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ r(
                  "span",
                  {
                    id: `${se}-answer-${be}`,
                    className: "dq-batch-answer-label",
                    title: Y.label,
                    children: Y.label
                  }
                ),
                /* @__PURE__ */ r(ts, { id: `${se}-effect-${be}`, parts: pe(Y) })
              ] })
            ] }, Y.id);
          }) })
        ] }),
        Te && /* @__PURE__ */ l("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ r("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: jn(P, !1, C.length === 0) }),
          /* @__PURE__ */ r(
            Mi,
            {
              ...Ze,
              mediaKind: Ve,
              actions: Ee.actions,
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
    const P = x, Y = k && Zo.has(k.group) ? k.group : null, be = Y ? ot.filter(Qt[Y].test) : [], le = ($e) => {
      const Ae = Wt($e), Lt = Ae.skipped ? _r(
        $e.before.ids,
        Ba($e.before.ids, C.action, C.categories, !0).desired
      ) : xe($e), ve = !Lt.added.length && !Lt.removed.length;
      return /* @__PURE__ */ l("div", { className: "dq-batch-plan", children: [
        Ae.skipped && /* @__PURE__ */ r("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        ve ? !Ae.kept.length && /* @__PURE__ */ r("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ r(ns, { added: Lt.added, removed: Lt.removed, tag: ut }),
        Ae.kept.map((Se, qe) => /* @__PURE__ */ l("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          br(Se.existing.map(ut)).map((Dt) => /* @__PURE__ */ r(Bt, { tag: Dt }, Dt.id)),
          " ",
          "instead of",
          " ",
          br(Se.tagIds.map(ut)).map((Dt) => /* @__PURE__ */ r(Bt, { tag: Dt }, Dt.id))
        ] }, qe))
      ] });
    };
    return /* @__PURE__ */ l(ye, { children: [
      /* @__PURE__ */ l("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ l("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ r(
            ea,
            {
              value: ot.length,
              label: ot.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${P.hosts.toLocaleString()} ${P.hosts === 1 ? pn : `${pn}s`}`,
              pressed: mn("matching"),
              onToggle: () => Ft({ group: "matching" })
            }
          ),
          /* @__PURE__ */ r(
            ea,
            {
              value: P.willChange,
              label: "will change",
              tone: "add",
              pressed: mn("change"),
              onToggle: () => Ft({ group: "change" })
            }
          ),
          /* @__PURE__ */ r(
            ea,
            {
              value: P.correct,
              label: "already correct, no write",
              pressed: mn("correct"),
              onToggle: () => Ft({ group: "correct" })
            }
          ),
          /* @__PURE__ */ r(
            ea,
            {
              value: P.different,
              label: v ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: mn("different"),
              onToggle: () => Ft({ group: "different" })
            }
          )
        ] }),
        be.length > 0 ? /* @__PURE__ */ r(
          rs,
          {
            title: Qt[Y].title,
            entries: be,
            mediaKind: Ve,
            resultHeading: "Planned change",
            describe: le
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
              title: ta(tt, Ve),
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
              title: ta(Pe, Ve),
              children: "Open latest"
            }
          ),
          Ce.length < ot.length && /* @__PURE__ */ l("span", { children: [
            (ot.length - Ce.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (P.added.length > 0 || P.removed.length > 0) && /* @__PURE__ */ l("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ r("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ r(
            ns,
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
        /* @__PURE__ */ r("span", { id: `${se}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ l(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${se}-choice`,
            children: [
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": !v, onClick: () => T(!1), children: "Keep their answer" }),
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": v, onClick: () => T(!0), children: "Replace it" })
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
    return /* @__PURE__ */ l(ye, { children: [
      ct(),
      jn(mt, !0),
      /* @__PURE__ */ l("div", { className: `dq-batch-cards${Te ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ l("section", { className: "dq-batch-card", "aria-labelledby": `${se}-chosen`, children: [
          /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ r("h3", { id: `${se}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", disabled: M, onClick: Tt, children: "Change" })
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-chosen", children: it.map((C) => {
            const P = _n(C.id);
            return /* @__PURE__ */ l("li", { children: [
              /* @__PURE__ */ l("span", { className: "dq-batch-chosen-chip", children: [
                P && /* @__PURE__ */ r(dt, { binding: P, hidden: !0 }),
                C.label
              ] }),
              /* @__PURE__ */ r(ts, { parts: pe(C) })
            ] }, C.id);
          }) })
        ] }),
        Te && /* @__PURE__ */ r(
          Mi,
          {
            ...Ze,
            mediaKind: Ve,
            actions: Ee.actions,
            trees: a,
            flags: xt,
            className: "dq-batch-card"
          }
        )
      ] }),
      M ? /* @__PURE__ */ r("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ r("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ r("span", {}) }) }) : g && Un(g)
    ] });
  }
  function gn(C) {
    const P = U ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, Y = P.kind === "apply" ? ot.length - C.counts.pending : P.done, be = P.kind === "apply" ? ot.length : P.total, le = M ? P.kind === "undo" ? "Undoing batch…" : P.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : P.kind === "undo" ? P.stopped ? "Undo stopped" : "Undo finished" : P.stopped ? "Stopped" : "Finished", $e = be ? Math.round(Y / be * 100) : 100, Ae = k && !Zo.has(k.group) ? k.group : null, Lt = (Se) => es.find((qe) => qe.status === Se).label, ve = Ae ? ot.filter(
      (Se) => Se.status === Ae && (!k.reason || Se.error === k.reason)
    ) : [];
    return /* @__PURE__ */ l(ye, { children: [
      /* @__PURE__ */ l("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ r("h3", { tabIndex: -1, "data-batch-focus": "", children: le }),
          /* @__PURE__ */ l("span", { children: [
            Y.toLocaleString(),
            " of ",
            be.toLocaleString(),
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
            "aria-valuemax": be,
            "aria-valuenow": Y,
            children: /* @__PURE__ */ r("span", { style: { width: `${$e}%` } })
          }
        ),
        !M && P.kind === "undo" && /* @__PURE__ */ l("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (P.total - C.recorded).toLocaleString(),
          " of",
          " ",
          P.total.toLocaleString(),
          " ",
          P.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ l("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ r("div", { className: "dq-batch-stats", "data-count": "5", children: es.map((Se) => /* @__PURE__ */ r(
          ea,
          {
            value: C.counts[Se.status],
            label: Se.label,
            tone: Se.tone,
            pressed: mn(Se.status),
            onToggle: () => Ft({ group: Se.status })
          },
          Se.status
        )) }),
        C.reasons.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-batch-reasons", children: C.reasons.map((Se) => {
          const qe = mn(Se.status, Se.error);
          return /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ l("span", { children: [
              Se.count.toLocaleString(),
              " ",
              Se.status,
              ": ",
              Se.error
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": qe,
                onClick: () => Ft({ group: Se.status, reason: Se.error }),
                children: qe ? "Hide them" : "Show them"
              }
            )
          ] }, `${Se.status}-${Se.error}`);
        }) }),
        ve.length > 0 ? /* @__PURE__ */ r(
          rs,
          {
            title: k.reason ? `${Lt(Ae)}: ${k.reason}` : `${Lt(Ae)} occurrences`,
            entries: ve,
            mediaKind: Ve,
            resultHeading: "Result",
            describe: (Se) => Se.error ?? Lt(Se.status)
          }
        ) : /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      C.recorded > 0 && /* @__PURE__ */ l("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: M,
            onClick: () => void Ct("undo"),
            children: [
              /* @__PURE__ */ r(Dl, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ l("p", { children: [
          Xe ? P.stopped || M ? `${C.recorded.toLocaleString()} ${C.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${C.recorded.toLocaleString()} ${C.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${C.recorded === 1 ? "this change" : `these ${C.recorded.toLocaleString()} changes`} and keeps later edits.`,
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
    ) : p === "preview" ? M ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: Jt, children: "Cancel preview" }, "cancel-preview") : g ? /* @__PURE__ */ l(
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
        onClick: () => void Ne(),
        children: "Preview again"
      },
      "again"
    ) : M ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: Jt, children: Xe ? "Cancel undo" : "Cancel run" }, "cancel-run") : Xe || !pt ? null : /* @__PURE__ */ l(_i, { children: [
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
  return /* @__PURE__ */ l(Du, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: F,
        title: "Apply answers to all matching occurrences",
        disabled: t || !Fe.length,
        onClick: () => {
          zt(), i(), u(!0);
        },
        children: [
          /* @__PURE__ */ r($o, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    c && /* @__PURE__ */ l(
      "dialog",
      {
        ref: V,
        className: "dq-batch-dialog",
        "aria-labelledby": `${se}-title`,
        "aria-modal": "true",
        onCancel: (C) => {
          C.preventDefault(), qt();
        },
        onClose: () => {
          var C;
          fe.current ? (C = V.current) == null || C.showModal() : qt();
        },
        children: [
          /* @__PURE__ */ l("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ r($o, { "aria-hidden": "true" }),
            /* @__PURE__ */ r("h2", { id: `${se}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: M,
                onClick: qt,
                children: /* @__PURE__ */ r(ua, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r(Sf, { step: p }),
          /* @__PURE__ */ l(
            "div",
            {
              className: "dq-batch-body",
              ref: y,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": p === "preview" ? "" : void 0,
              "aria-label": `${Fi.find((C) => C.id === p).label} step`,
              children: [
                /* @__PURE__ */ l("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  Z && /* @__PURE__ */ r("p", { role: "status", children: Z }),
                  K && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: K })
                ] }),
                p === "answers" ? Yt() : p === "preview" ? Pt() : gn(pt)
              ]
            }
          ),
          /* @__PURE__ */ l("div", { className: "dq-batch-footer", children: [
            p === "preview" && /* @__PURE__ */ l("button", { type: "button", className: "dq-button", disabled: M, onClick: Tt, children: [
              /* @__PURE__ */ r(fa, { "aria-hidden": "true" }),
              "Back"
            ] }),
            p === "run" && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: M, onClick: zt, children: "New batch" }),
            /* @__PURE__ */ r("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: M, onClick: qt, children: "Close" }),
            nn()
          ] })
        ]
      }
    )
  ] });
}
const jc = "data-quality.description-collapsed.v1";
function Cf() {
  try {
    return localStorage.getItem(jc) === "true";
  } catch {
    return !1;
  }
}
function Af({
  details: e,
  label: t
}) {
  const [n, a] = A(Cf), i = Sn(() => {
    a((o) => {
      const s = !o;
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
        onClick: i,
        children: "Description"
      }
    ),
    !n && (e != null && e.trim() ? /* @__PURE__ */ r(Sl, { className: "dq-description-body", children: e }) : /* @__PURE__ */ r("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
const Tf = (e) => "";
function If({
  ranking: e,
  busy: t,
  error: n,
  focus: a,
  disabled: i,
  labels: o,
  flagLabel: s = Tf,
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
          children: /* @__PURE__ */ r(_l, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-queue-list", children: d.map((b) => {
      const w = `${b.count.toLocaleString()} matching ${b.count === 1 ? o.one : o.many}`, S = s(b.tags);
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${b.name}, ${w}${S ? `. ${S}` : ""}`,
          title: S || void 0,
          "aria-current": a === b.id ? "true" : void 0,
          disabled: i,
          onClick: () => c(b.id),
          children: [
            /* @__PURE__ */ r(Pr, { performer: b }),
            /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: b.name }),
            S && /* @__PURE__ */ r(Fn, { className: "dq-flag-icon", "aria-hidden": "true" }),
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
const Rf = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], $f = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function Of(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), a = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: a, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function Ma(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Mf(e, t) {
  const n = Ji(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", a = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Ma(a, "or")}`,
    includesAll: `has ${Ma(a, "and")}`,
    excludes: `has none of ${Ma(a, "or")}`,
    excludesAll: `missing ${Ma(a, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function Ff({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: a,
  onEditCriteria: i
}) {
  const [o, s] = A(!1), [c, u] = A(null), p = R(null), d = R(null), g = at(), m = Ur(e.conditionTagIds), b = Mf(e, m);
  kt(() => {
    const v = p.current;
    if (!o || !v) return;
    const T = () => u(Of(v));
    T(), window.addEventListener("resize", T);
    const M = typeof ResizeObserver > "u" ? null : new ResizeObserver(T), j = [v, v.closest(".dq-review-header-trail"), v.closest("header")];
    for (const K of j) K && (M == null || M.observe(K));
    return () => {
      window.removeEventListener("resize", T), M == null || M.disconnect();
    };
  }, [o]), H(() => {
    var T, M;
    if (!o) return;
    const v = (T = d.current) == null ? void 0 : T.querySelector('[aria-pressed="true"]');
    v && !v.disabled ? v.focus() : (M = d.current) == null || M.focus();
  }, [o]);
  const w = () => {
    s(!1), requestAnimationFrame(() => {
      var v;
      return (v = p.current) == null ? void 0 : v.focus();
    });
  }, S = (v) => {
    if (!(v.target instanceof Element && v.target.closest('[role="dialog"]') !== d.current || v.defaultPrevented || Pn(v))) {
      if (v.key === "Escape")
        v.preventDefault(), w();
      else if (v.key === "Tab" && d.current) {
        const M = [...d.current.querySelectorAll($f)].filter((ee) => ee.closest('[role="dialog"]') === d.current).sort(
          (ee, te) => ee.compareDocumentPosition(te) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!M.length) return;
        const j = M[0], K = M[M.length - 1], L = document.activeElement;
        v.shiftKey && (L === j || L === d.current) ? (v.preventDefault(), K.focus()) : !v.shiftKey && L === K && (v.preventDefault(), j.focus());
      }
    }
  }, N = !["any", "isNull"].includes(e.condition);
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
          /* @__PURE__ */ r(Es, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-summary", children: b }),
          /* @__PURE__ */ r(Gi, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ l(ye, { children: [
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
          onKeyDown: S,
          children: [
            /* @__PURE__ */ l("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: Rf.map(({ mode: v, label: T }) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === v,
                  onClick: () => e.targetMode !== v && a({ targetMode: v }),
                  children: T
                },
                v
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ r(
                Yn,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (v) => a({ performerIds: v }),
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
                    criteriaDefinitions: ji,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (v) => a({ performerFilter: v })
                  }
                ) }),
                /* @__PURE__ */ l("button", { type: "button", className: "dq-button", onClick: i, children: [
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
                  onChange: (v) => a({ condition: v.target.value }),
                  children: zi.map((v) => /* @__PURE__ */ r("option", { value: v, children: Vi[v] }, v))
                }
              ),
              N && /* @__PURE__ */ l(ye, { children: [
                /* @__PURE__ */ r(
                  Yn,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (v) => a({ conditionTagIds: v }),
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
                        onChange: (v) => a({ includeSubtags: v.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  ia(e.condition) && /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.hideConfirmedAbsent ?? !0,
                        onChange: (v) => a({ hideConfirmedAbsent: v.target.checked })
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
function La(e) {
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
function xf(e) {
  const t = e.occurrence;
  return JSON.stringify([
    Ue(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function Pf(e, t) {
  const n = Ue(e) === "audio", a = (s) => ({
    id: s.id,
    name: s.name,
    total: (n ? s.audioCount : s.videoCount) ?? 0,
    tags: (s.tags ?? []).map((c) => ({ id: c.id, name: c.name }))
  }), i = e.occurrence, o = [];
  if (i.targetMode === "selected" && i.performerIds.length > 0)
    for (const s of i.performerIds) {
      const c = await Nd(
        `/api/performers/${s}`,
        { signal: t }
      );
      c && o.push(a(c));
    }
  else {
    const { _filterExpression: s, ...c } = i.targetMode === "filter" ? i.performerFilter : {};
    for (let u = 1; ; u++) {
      const p = await he(
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
      if (o.push(...p.items.map(a)), u * 1e3 >= p.totalCount || !p.items.length) break;
    }
  }
  return o.sort((s, c) => c.total - s.total || s.id - c.id);
}
function Uc(e, t, n) {
  const a = yo(e, [t]);
  return kd(a, a.view.filter, n);
}
function Gc(e, t) {
  const n = e.findIndex(
    (a) => a.count < t.count || a.count === t.count && a.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function xi(e, t, n, a) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= a && i < n[a - 1].count;
}
async function Lf(e, t, n, a, i = {}) {
  const o = La(e), s = xf(e), c = $c(e.occurrence), u = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await Pf(e, a),
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
    complete: !w && xi(p, g, d, n),
    ...w ? { partial: w } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var w;
        for (; !m && !xi(p, g, d, n); ) {
          a.throwIfAborted();
          const S = p[g++], N = await Uc(e, S.id, a);
          N > 0 && Gc(d, { ...S, count: N }), (w = i.onProgress) == null || w.call(i, b(!0));
        }
      })
    );
  } catch (w) {
    throw m = !0, w;
  }
  return a.throwIfAborted(), b(!1);
}
function Df(e, t, n) {
  const a = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || a < 0 || a >= e.cursor) return e;
  const i = e.ranked.filter((o) => o.id !== t);
  return n > 0 && Gc(i, { ...e.candidates[a], count: n }), {
    ...e,
    ranked: i,
    complete: xi(e.candidates, e.cursor, i, e.limit)
  };
}
const Pi = /* @__PURE__ */ new Map();
function _f(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function Kc(e, t) {
  const n = _f(t);
  return Pi.set(e, n), n;
}
function jf(e) {
  const [t, n] = A(null);
  if (H(() => {
    if (e === null || Pi.has(e)) return;
    const a = new AbortController();
    return he(`/api/performers/${e}`, { signal: a.signal }).then(
      (i) => {
        const o = Kc(e, i == null ? void 0 : i.tags);
        a.signal.aborted || n({ id: e, tags: o });
      },
      () => {
      }
    ), () => a.abort();
  }, [e]), e !== null)
    return Pi.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
function vr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => vr(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, a = t, i = Object.keys(n).sort(), o = Object.keys(a).sort();
  return i.length === o.length && i.every(
    (s, c) => s === o[c] && vr(n[s], a[s])
  );
}
function Uf(e) {
  var c, u, p;
  const [t, n] = A({}), [a, i] = A(""), o = (((c = e == null ? void 0 : e.presentation) == null ? void 0 : c.annotations) ?? []).includes("tags") ? ((u = e == null ? void 0 : e.presentation) == null ? void 0 : u.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...o,
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return H(() => {
    let d = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(s).map(
        async (g) => [g, await Wa([g])]
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
function Gf(e, t, n) {
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
function Kf({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: a,
  disabled: i,
  onToggle: o
}) {
  var w;
  const s = ((w = t.presentation) == null ? void 0 : w.binParents) ?? [], c = new Set(
    s.flatMap((S) => (a[S] ?? []).filter((N) => N !== S))
  ), u = s.every((S) => a[S]), p = ba(t.view.objectFilter, n).bins.filter(
    (S) => !u || c.has(S)
  ), d = /* @__PURE__ */ new Map();
  for (const S of e)
    for (const N of S.tags ?? [])
      if (c.has(N.id)) {
        const v = d.get(N.id) ?? { name: N.name, count: 0 };
        v.count++, d.set(N.id, v);
      }
  const g = p.filter((S) => !d.has(S)), m = Ur(g);
  for (const S of g)
    d.set(S, {
      name: m[S] === void 0 ? "…" : m[S] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const b = [...d].sort((S, N) => S[1].name.localeCompare(N[1].name));
  return /* @__PURE__ */ l("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ r("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    b.map(([S, N]) => {
      const v = p.includes(S);
      return /* @__PURE__ */ l(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": v,
          title: v ? `Show every video again, not only ${N.name}` : `Show only videos tagged ${N.name}`,
          disabled: i,
          onClick: () => o(S),
          children: [
            v && /* @__PURE__ */ r(da, { "aria-hidden": "true" }),
            N.name,
            " ",
            /* @__PURE__ */ r("span", { className: "dq-bin-count", children: N.count })
          ]
        },
        S
      );
    }),
    !b.length && /* @__PURE__ */ r("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function mr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Bf(e) {
  if (!mr(e) || Object.keys(e).length !== 1 || !mr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !mr(t.tagsCriterion)) return null;
  const { value: n, modifier: a, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && a === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function ba(e, t) {
  let n = e;
  const a = [];
  for (; ; ) {
    if (t && vr(n, t)) {
      n = t;
      break;
    }
    const i = Object.keys(n);
    if (i.length !== 1 || i[0] !== "_filterExpression") break;
    const o = n._filterExpression;
    if (!mr(o) || o.operator !== "AND" || !Array.isArray(o.children))
      break;
    const s = o.children, c = Bf(s.at(-1));
    if (c == null || s.length > 3) break;
    let u = {}, p = null, d = !0;
    for (const [g, m] of s.slice(0, -1).entries())
      !mr(m) || Object.keys(m).length !== 1 ? d = !1 : g === 0 && mr(m.filter) && Object.keys(m.filter).length ? u = m.filter : !p && mr(m.group) ? p = m.group : d = !1;
    if (!d) break;
    a.unshift(c), n = p ? { ...u, _filterExpression: p } : u;
  }
  return { base: n, bins: a };
}
function Vf(e, t, n) {
  const { base: a, bins: i } = ba(e.view.objectFilter, n);
  return (i.includes(t) ? i.filter((s) => s !== t) : [...i, t]).reduce(zf, { ...e, view: { ...e.view, objectFilter: a } });
}
function zf(e, t) {
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
], Jf = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function Nr(e) {
  const t = Ie(e) ? e.occurrence : void 0;
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
function as(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function Li(e, t) {
  let n;
  if (Ie(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!Qa.some((c) => c !== "performer" && t.has(c))) {
    const c = Nr(e);
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
  if (Ie(e) && (o = {
    ...Jf,
    ...as(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !zi.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Kt(i, Ue(e)),
      objectFilter: as(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const is = { dataQualityOpenedFromList: !0 };
function Bc() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function Vc(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...is }, "", e) : window.history.replaceState(Bc() ? { ...is } : null, "", e);
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
function kn(e, t) {
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
function yr(e) {
  const t = e;
  return kn(t, Nr(t));
}
function os(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !vr(
    JSON.parse(Jn(kn(e, t))),
    JSON.parse(Jn(kn(e, Nr(e))))
  );
}
function zc(e, t) {
  if (je(e) !== "video") return e;
  const { base: n, bins: a } = ba(e.view.objectFilter, t.view.objectFilter);
  return a.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function Fa(e, t) {
  if (je(e) !== "video") return t;
  const { base: n, bins: a } = ba(t.objectFilter, e.view.objectFilter);
  return a.length ? { ...t, objectFilter: n } : t;
}
function ss(e, t) {
  return !t || !Ie(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function fi(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const a of e)
    n.set(a.media.id, [...n.get(a.media.id) ?? [], a]);
  return [...n.values()].reverse().flat();
}
const tn = (e) => e instanceof Error ? e.message : "Request failed.", hi = 50, Wf = [], cs = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function Hf(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Al(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? Ns(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Qf({ media: e, kind: t }) {
  const [n, a] = A(!1);
  return /* @__PURE__ */ r("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ r(As, {}) : /* @__PURE__ */ r(za, {}) : /* @__PURE__ */ r(
    "img",
    {
      src: Ni(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => a(!0)
    }
  ) });
}
function Yf({
  tags: e,
  preview: t,
  showPreview: n,
  trees: a,
  actionTagIds: i,
  label: o
}) {
  const s = lo(t), c = n ? s : null, u = e == null ? void 0 : e.absent, p = ma(
    me(() => [...i, ...u ?? []], [i, u])
  ), d = (K) => p[K] ?? { id: K, name: p[K] === void 0 ? "…" : "Unavailable tag" }, g = (K) => br(K.map(d)), m = c && e ? no(c, e, a) : null, b = e ? Ld(e) : [], w = new Set(b.map((K) => K.id)), S = new Set(m == null ? void 0 : m.removed), N = new Set(m == null ? void 0 : m.markedAbsent), v = new Set(m == null ? void 0 : m.absenceCleared), T = /* @__PURE__ */ l("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ r(Da, { "aria-hidden": "true" }),
    "absent"
  ] }), M = g((m == null ? void 0 : m.added) ?? []), j = g(((m == null ? void 0 : m.markedAbsent) ?? []).filter((K) => !w.has(K)));
  return /* @__PURE__ */ l("section", { className: "dq-panel-section", "aria-label": o, children: [
    /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ l(ye, { children: [
      b.length || M.length || j.length ? /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        b.map(
          (K) => S.has(K.id) ? /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ l("del", { children: [
              "− ",
              /* @__PURE__ */ r(Bt, { tag: K })
            ] }),
            N.has(K.id) && T
          ] }, K.id) : /* @__PURE__ */ r("li", { className: "dq-tag", children: /* @__PURE__ */ r(Bt, { tag: K }) }, K.id)
        ),
        M.map((K) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
          "+ ",
          /* @__PURE__ */ r(Bt, { tag: K })
        ] }) }, `added-${K.id}`)),
        j.map((K) => /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ r("ins", { children: /* @__PURE__ */ r(Bt, { tag: K }) }),
          T
        ] }, `absent-${K.id}`))
      ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ l(ye, { children: [
        /* @__PURE__ */ r("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((K) => /* @__PURE__ */ l(
          "li",
          {
            className: `dq-tag dq-tag-absent${v.has(K.id) ? " dq-tag-removed" : ""}`,
            children: [
              /* @__PURE__ */ r(Da, { "aria-hidden": "true" }),
              v.has(K.id) ? /* @__PURE__ */ l("del", { children: [
                "− ",
                /* @__PURE__ */ r(Bt, { tag: K })
              ] }) : /* @__PURE__ */ r(Bt, { tag: K })
            ]
          },
          K.id
        )) })
      ] })
    ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading…" })
  ] });
}
function Xf({ entries: e }) {
  return /* @__PURE__ */ r("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ l("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ r("span", { className: "dq-attention-category", children: t.name }),
    ao(t).map((n) => /* @__PURE__ */ l("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ r(Fn, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function Zf({
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
  var Ir;
  const d = Ue(e), g = En(d), m = d === "audio" ? "Audio" : "Scene", b = (h) => {
    var E;
    return h.title || ((E = h.files[0]) == null ? void 0 : E.basename) || m;
  }, w = (h) => `${h.occurrence ? `${h.occurrence.performer.name} — ` : ""}${b(h.media)}`, S = R(null), N = R("");
  if (!S.current)
    try {
      S.current = Li(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (h) {
      N.current = tn(h), S.current = { query: Nr(e), startAtEnd: !1 };
    }
  const [v, T] = A(null), [M, j] = A(""), K = R(null), L = R(null), ee = R(null), te = R(null), [Z, oe] = A(!!N.current), U = R(0), [B, k] = A(S.current.query), I = R(B);
  I.current = B;
  const [z, Q] = A(0), ae = R(S.current.startAtEnd), [re, V] = A([]), [y, F] = A(null), G = R(null), [W, ge] = A(null), [He, D] = A(0), fe = me(() => {
    if (!y) return null;
    const h = re.findIndex((E) => E.key === y.key);
    return h < 0 ? null : re.slice(h + 1).find((E) => E.media.id !== y.media.id) ?? null;
  }, [y, re]), [Re, se] = A(0), [Oe, Xe] = A(!1), [Ee, Cn] = A(!1), we = R(!1), Ve = R(!0), Et = R(null);
  H(() => (Ve.current = !0, () => {
    Ve.current = !1;
  }), []);
  const [pn, Fe] = A(N.current), [it, Te] = A(""), [Ze, Vt] = A(null), [Me, An] = A(!1), [ut, Mt] = A([]), ht = R([]), zt = R(null), qt = R(null), er = R(null);
  H(() => {
    var h, E;
    Me && ((E = (h = er.current) == null ? void 0 : h.querySelector("input")) == null || E.focus());
  }, [Me]);
  const [Tt, Tn] = A(!1), [Jt, Ft] = A(!1), mn = ga(), [Ne, Ct] = A(!1), ot = u ?? Ne, Dn = p ?? Ct;
  H(() => {
    if (Oe || Tt || !qt.current) return;
    const h = requestAnimationFrame(() => {
      if (document.querySelector(cs)) return;
      const E = qt.current;
      qt.current = null;
      const $ = document.activeElement;
      $ && $ !== document.body || E != null && E.isConnected && !E.disabled && E.focus();
    });
    return () => cancelAnimationFrame(h);
  }, [Oe, Tt, z]);
  const [Wt, xe] = A([]), [It, ce] = A({}), x = R(null), Ce = R(0), [pt, _n] = A({});
  H(() => {
    let h = !0;
    return Promise.all(
      mo(B.objectFilter).map(
        async (E) => [
          String(E),
          (await he(`/api/tags/${E}`)).name
        ]
      )
    ).then((E) => {
      h && _n(Object.fromEntries(E));
    }).catch(() => {
    }), () => {
      h = !1;
    };
  }, [B.objectFilter]);
  const pe = me(
    () => go(B.objectFilter, pt),
    [pt, B.objectFilter]
  ), Rt = R(0), tt = R(e);
  tt.current = e;
  const Pe = v ?? e, et = me(
    () => kn(Pe, B),
    [Pe, B]
  ), Ht = me(
    () => ss(et, B.performerFocus),
    [et, B.performerFocus]
  ), st = R(Ht);
  st.current = Ht;
  const mt = R(et);
  mt.current = et;
  const [xt, Qt] = A("items"), [ct, jn] = A(null), Yt = R(null), Un = R("");
  function Pt(h) {
    const E = typeof h == "function" ? h(Yt.current) : h;
    Yt.current = E, jn(E);
  }
  const [gn, nn] = A(!1), [C, P] = A(null), Y = R(null), be = Ie(et) ? La(et) : "", [le, $e] = A(0), [Ae, Lt] = A(null);
  H(() => () => {
    var h;
    return (h = Y.current) == null ? void 0 : h.controller.abort();
  }, []), H(() => {
    const h = Y.current;
    !h || h.signature === be || (h.controller.abort(), Y.current = null, nn(!1));
  }, [be]), H(() => {
    var $;
    const h = Yt.current;
    if (xt !== "performers" || !be || (($ = Y.current) == null ? void 0 : $.signature) === be || Un.current === be || (h == null ? void 0 : h.signature) === be && h.complete)
      return;
    const E = (h == null ? void 0 : h.signature) === be ? h : null;
    Er(h, (E == null ? void 0 : E.limit) ?? hi);
  }, [xt, be, ct, C, gn]);
  const ve = B.performerFocus;
  H(() => {
    if (!ve) {
      Lt(null);
      return;
    }
    let h = !0;
    return he(`/api/performers/${ve}`).then((E) => {
      const $ = Kc(ve, E.tags);
      h && Lt({ id: ve, name: E.name, tags: $ });
    }).catch(() => {
    }), () => {
      h = !1;
    };
  }, [ve]);
  const Se = JSON.stringify(
    Ie(et) ? $s(et.occurrence) : []
  ), qe = me(() => JSON.parse(Se), [Se]), Dt = me(() => Ud(qe), [qe]), In = Qs(Dt), Gr = ma(Dt), Kr = (h) => {
    var E;
    return ((E = Gr[h]) == null ? void 0 : E.name) ?? (Gr[h] === null ? "Unavailable tag" : "…");
  }, Br = (h) => ({
    name: Kr(h),
    tagIds: In.get(h) ?? [h],
    resolved: In.has(h)
  }), St = _c(
    Ie(et) ? et : null,
    ve ?? null,
    le
  ), Xt = os(e, B), tr = os(e, Fa(e, B)), gt = Ee || Oe || Me, bn = Number(B.filter.page);
  function De(h, E = !1) {
    we.current || (N.current = "", ae.current = E, I.current = h, k(h), se(0), Xe(!0), E || ra(e.id, h), Q(($) => $ + 1));
  }
  function nt() {
    if (we.current = !1, Cn(!1), Ve.current && Et.current) {
      const h = Et.current;
      Et.current = null, De(h.query, h.startAtEnd);
    }
  }
  H(() => {
    const h = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const E = Li(
            tt.current,
            new URLSearchParams(window.location.search)
          );
          we.current ? Et.current = E : De(E.query, E.startAtEnd);
        } catch (E) {
          Fe(tn(E));
        }
    };
    return window.addEventListener("popstate", h), () => window.removeEventListener("popstate", h);
  }, [e.id]), H(() => (a(Ee || Oe || Me || !!v), () => a(!1)), [Ee, Oe, Me, !!v, a]);
  async function bt(h, E, $) {
    if (Ie(h)) {
      const ue = await Oc(
        h,
        x.current,
        E,
        $
      );
      return {
        items: ue.items.map((de) => ({
          key: de.key,
          media: de.media,
          occurrence: de
        })),
        totalCount: ue.totalCount
      };
    }
    const ne = await na(
      h,
      { ...h.view.filter, page: E },
      $
    );
    return {
      items: ne.items.map((ue) => ({ key: String(ue.id), media: ue })),
      totalCount: ne.totalCount
    };
  }
  function yt(h, E, $, ne = !1, ue = !1) {
    if (!Ve.current || Et.current) return;
    oe(!0), V(
      ue ? h.items : fi(h.items, I.current.startFrom === "end")
    ), se(h.totalCount), _t($, ne);
    const de = {
      ...I.current,
      filter: { ...I.current.filter, page: E }
    };
    I.current = de, k(de), ra(e.id, de);
  }
  function _t(h, E = !1) {
    (h == null ? void 0 : h.key) !== (y == null ? void 0 : y.key) && (G.current = null), (h == null ? void 0 : h.media.id) !== (y == null ? void 0 : y.media.id) && ge(E && h ? h.media.id : null), F(h);
  }
  H(() => {
    if (N.current) return;
    const h = new AbortController();
    te.current = h;
    const E = ++Rt.current;
    return Xe(!0), Fe(""), Te(""), G.current = null, ge(null), F(null), V([]), An(!1), (async () => {
      const $ = ss(
        kn(tt.current, I.current),
        I.current.performerFocus
      );
      x.current = Ie($) ? await bo($, h.signal) : null;
      let ne = Number($.view.filter.page), ue = await bt($, ne, h.signal);
      const de = Math.max(
        1,
        Math.ceil(ue.totalCount / Number($.view.filter.perPage))
      );
      (ae.current || ne > de) && (ne = de, ue = await bt($, ne, h.signal)), ae.current = !1;
      const Qe = $.view.startFrom === "end" ? -1 : 1;
      for (; Ie($) && !ue.items.length && ne + Qe >= 1 && ne + Qe <= de && !h.signal.aborted; )
        ne += Qe, ue = await bt($, ne, h.signal);
      if (E !== Rt.current || h.signal.aborted) return;
      const Ot = fi(ue.items, $.view.startFrom === "end");
      yt(ue, ne, Ot[0] ?? null);
    })().catch(($) => {
      !h.signal.aborted && E === Rt.current && Fe(tn($));
    }).finally(() => {
      !h.signal.aborted && E === Rt.current && (oe(!0), Xe(!1));
    }), () => {
      h.abort(), Rt.current++;
    };
  }, [z, e.id]), H(() => {
    if (Vt(null), !y) return;
    let h = !0;
    return hn(d, y).then((E) => {
      h && (Vt(E), xe(
        Ie(e) ? E.ids.filter(($) => e.occurrence.tagIds.includes($)) : []
      ));
    }).catch((E) => {
      h && Fe(`Could not load current tags. ${tn(E)}`);
    }), () => {
      h = !1;
    };
  }, [y]), H(() => {
    if (!Ie(e) || e.actions.length)
      return;
    let h = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (E) => [
          E,
          (await he(`/api/tags/${E}`)).name
        ]
      )
    ).then((E) => {
      h && ce(Object.fromEntries(E));
    }).catch((E) => {
      h && Fe(tn(E));
    }), () => {
      h = !1;
    };
  }, [e]);
  async function jt(h = !1, E = !1, $ = !1) {
    var qn;
    if (!y) return;
    const ne = re.findIndex((ze) => ze.key === y.key), ue = B.startFrom === "end" ? -1 : 1, de = ((qn = G.current) == null ? void 0 : qn.key) === y.key ? G.current : { key: y.key, page: bn, before: re.slice(0, ne + 1).map((ze) => ze.key), after: re.slice(ne + 1).map((ze) => ze.key) }, Qe = new Set(de.after), Ot = new Set(de.before), Ke = re.find((ze) => {
      var dn;
      return Qe.has(ze.key) || (ue === 1 || bn < de.page) && ((dn = G.current) == null ? void 0 : dn.key) === y.key && !Ot.has(ze.key);
    });
    if (!h && Ke) {
      _t(Ke, $);
      return;
    }
    const wt = h ? Ot : new Set(re.map((ze) => ze.key)), lt = 1100 - (Date.now() - Ce.current);
    lt > 0 && await new Promise((ze) => window.setTimeout(ze, lt));
    let Be = ue === -1 && !h ? Math.max(1, bn - 1) : bn;
    for (; Ve.current && !Et.current; ) {
      let ze = await bt(Ht, Be);
      const dn = Math.max(
        1,
        Math.ceil(ze.totalCount / Number(B.filter.perPage))
      );
      Be > dn && (Be = dn, ze = await bt(Ht, Be));
      const Ut = fi(ze.items, ue === -1), Yr = new Map(Ut.map((At) => [At.key, At])), Sa = h ? de.after.flatMap((At) => {
        const $r = Yr.get(At);
        return $r ? [$r] : [];
      }) : [], ka = new Set(Sa.map((At) => At.key)), fr = h ? {
        ...ze,
        items: [
          ...Sa,
          ...Ut.filter(
            (At) => At.key !== y.key && !ka.has(At.key)
          )
        ]
      } : ze;
      if (E) {
        G.current = de, yt(fr, Be, y, !1, h);
        return;
      }
      const Rr = ue === -1 && bn === 1 && !h ? void 0 : fr.items.find(
        (At) => !wt.has(At.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(h && ue === -1 && Be === de.page) || Qe.has(At.key))
      );
      if (Rr || (ue === -1 ? Be <= 1 : Be >= dn)) {
        yt(
          fr,
          Be,
          Rr ?? null,
          $,
          h
        ), Rr || Te(
          ze.totalCount ? `Reached the end in this direction. Matching items remain available from the ${g.queue} pages.` : `No matching ${g.many}.`
        );
        return;
      }
      Be += ue;
    }
  }
  async function rn(h, E = !1, $ = !1, ne = !1) {
    if (v || !y || we.current || Oe || Me && !$)
      return;
    const ue = $ || ne || !!(h != null && h.steps.length);
    if (ue && (!t || !Ze) || h && Qn(h) && !n) return;
    const de = !E && !$ && !ne && ue && h !== void 0 && Ze !== null && jo(e) && Ei(ki(e.actions, _d(h, Ze, cn))).length > 0;
    we.current = !0, Cn(!0), Fe(""), Te("");
    const Qe = re.findIndex((lt) => lt.key === y.key), Ot = ue && !E && !de && Qe >= 0 ? re[Qe + 1] ?? null : null;
    Ot && (V(
      (lt) => lt.filter((Be) => Be.key !== y.key)
    ), _t(Ot, !0));
    let Ke = !1, wt = [];
    try {
      if (ue) {
        const lt = await hn(d, y);
        if (h)
          await cf(Ht, y, h);
        else {
          const qn = ne && Ie(e) ? e.occurrence.tagIds.filter((Ut) => lt.ids.includes(Ut)) : ht.current, dn = _r(qn, ne ? Wt : ut);
          await vo(Ht, y, dn);
        }
        Ce.current = Date.now();
        const Be = await hn(d, y);
        Ot || Vt(Be), Ke = !0, An(!1), de && (wt = Ei(ki(e.actions, Be))), Te(
          wt.length ? `Tags saved. Staying until answered: ${wt.map((qn) => qn.name).join(", ")}.` : "Tags saved."
        ), y.occurrence && (wa(y.occurrence.performer.id), $e((qn) => qn + 1));
      }
      if (!Ve.current || Et.current) return;
      ue ? wt.length || await jt(!0, E, !E) : E || await jt(), E && $ && requestAnimationFrame(() => {
        var lt;
        return (lt = zt.current) == null ? void 0 : lt.focus();
      });
    } catch (lt) {
      if (Fe(
        Ke ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${tn(lt)}` : ue ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${tn(lt)}` : `Could not advance. ${tn(lt)}`
      ), ue && !Ke) {
        Ot && (V(re), ge(null), D((Be) => Be + 1), F(y)), Ce.current = Date.now();
        try {
          Vt(await hn(d, y));
        } catch {
          Vt(null), Fe(
            (Be) => `${Be} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      nt();
    }
  }
  const nr = !Me && !v && !Tt && !Jt && (y != null || Oe || Ee);
  io({
    surface: "local",
    enabled: nr,
    actions: e.actions,
    onAction: (h, E) => {
      const $ = e.actions[h];
      $ && rn($, E);
    },
    onFind: () => Ft(!0)
  });
  const an = (h) => Ee || Oe || !Ze || !!v || !t && h.steps.length > 0 || !n && Qn(h);
  function Zt() {
    !i || v || we.current || Me || (ee.current = document.activeElement, L.current = {
      error: pn,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(I.current),
      items: re,
      current: y,
      total: Re,
      targets: x.current,
      stayedCursor: G.current
    }, T(structuredClone(e)), j(""), Te(""), Fe(""));
  }
  H(() => {
    if (!o) {
      U.current = 0;
      return;
    }
    o !== U.current && Z && !Oe && (U.current = o, Zt(), s == null || s());
  }, [o, Oe, Z]);
  function Sr() {
    T(null), j(""), requestAnimationFrame(() => {
      const h = ee.current;
      h != null && h.isConnected && h !== document.body && h.focus();
    });
  }
  function kr() {
    var E;
    const h = L.current;
    !h || Ee || ((E = te.current) == null || E.abort(), Rt.current++, I.current = h.query, k(h.query), V(h.items), F(h.current), se(h.total), x.current = h.targets, G.current = h.stayedCursor, Xe(!1), Fe(h.error), Te(""), window.history.replaceState(window.history.state, "", h.url), Sr());
  }
  async function ya() {
    if (!v || !i || we.current) return;
    const h = kn(
      { ...v, name: v.name.trim() },
      Fa(tt.current, I.current)
    ), E = sa(h);
    if (E) {
      j(E);
      return;
    }
    we.current = !0, Cn(!0), j("");
    try {
      if (await i(h) === !1) throw new Error("Could not save review.");
      Sr(), Te("Review saved.");
    } catch ($) {
      j(
        "Could not save review. Your edits are still open. " + tn($)
      );
    } finally {
      nt();
    }
  }
  async function Le() {
    if (!i || we.current) return;
    const h = Fa(tt.current, I.current), E = kn(tt.current, {
      ...h,
      filter: { ...h.filter, page: 1 }
    });
    we.current = !0, Cn(!0), Fe("");
    try {
      if (await i(E) === !1) throw new Error("Could not save review.");
      Te("Queue saved to this review.");
    } catch ($) {
      Fe("Could not save queue. " + tn($));
    } finally {
      nt();
    }
  }
  const ft = B.performerScope, yn = (h) => {
    const { performerFocus: E, ...$ } = I.current, ne = E && !("targetMode" in h || "performerIds" in h || "performerFilter" in h);
    De({
      ...$,
      ...ne ? { performerFocus: E } : {},
      filter: { ...$.filter, page: 1 },
      performerScope: { ...ft, ...h }
    });
  };
  async function Er(h, E) {
    var ue;
    const $ = mt.current;
    if (!Ie($)) return;
    (ue = Y.current) == null || ue.controller.abort();
    const ne = {
      signature: La($),
      controller: new AbortController()
    };
    Y.current = ne, Un.current = "", nn(!0), P(null);
    try {
      const de = await Lf($, h, E, ne.controller.signal, {
        onProgress: (Qe) => {
          Y.current === ne && Pt(Qe);
        }
      });
      Y.current === ne && Pt(de);
    } catch (de) {
      Y.current === ne && !ne.controller.signal.aborted && (Un.current = ne.signature, P({ signature: ne.signature, message: tn(de) }));
    } finally {
      Y.current === ne && (Y.current = null, nn(!1));
    }
  }
  function wn() {
    var h;
    (h = Y.current) == null || h.controller.abort(), Y.current = null, nn(!1), Pt((E) => E && { ...E, partial: !0, complete: !1 });
  }
  async function wa(h) {
    var ue;
    const E = mt.current;
    if (!Ie(E)) return;
    if (Y.current) {
      wn();
      return;
    }
    const $ = La(E);
    if (((ue = Yt.current) == null ? void 0 : ue.signature) !== $ || Yt.current.partial) return;
    const ne = 1100 - (Date.now() - Ce.current);
    ne > 0 && await new Promise((de) => window.setTimeout(de, ne));
    try {
      const de = await Uc(E, h);
      if (Y.current) {
        wn();
        return;
      }
      Pt(
        (Qe) => (Qe == null ? void 0 : Qe.signature) === $ ? Df(Qe, h, de) : Qe
      );
    } catch {
      Pt(
        (de) => (de == null ? void 0 : de.signature) === $ ? { ...de, partial: !0, complete: !1 } : de
      );
    }
  }
  const rr = B.performerFocus ? ct == null ? void 0 : ct.candidates.find((h) => h.id === B.performerFocus) : void 0, rt = Ae && Ae.id === B.performerFocus ? { ...Ae, flags: pr(qe, Ae.tags) } : rr ? { ...rr, flags: pr(qe, rr.tags) } : null, on = (h) => {
    if ((Ae == null ? void 0 : Ae.id) === h)
      return pr(qe, Ae.tags);
    const E = ct == null ? void 0 : ct.candidates.find(($) => $.id === h);
    return E ? pr(qe, E.tags) : void 0;
  }, sn = ((Ir = y == null ? void 0 : y.occurrence) == null ? void 0 : Ir.performer.id) ?? null, vn = sn === null ? void 0 : on(sn), _e = jf(
    qe.length > 0 && sn !== null && sn !== B.performerFocus && vn === void 0 ? sn : null
  ), Vr = vn ?? (_e ? pr(qe, _e) : []), cn = Hs(Pe.actions), Cr = St.summary && B.performerFocus ? ro(No(St.summary, Pe.actions, cn)) : [], ar = Uo(qe, (rt == null ? void 0 : rt.flags) ?? [], Br), ir = ec(
    Uo(qe, Vr, Br),
    sn !== null && sn === B.performerFocus ? Cr : []
  ), zr = JSON.stringify(ir), Ar = me(() => ir, [zr]), or = JSON.stringify(ar), Jr = me(() => ar, [or]), Rn = (h) => Wd(qe, h, Kr);
  function sr(h) {
    if (we.current) return;
    const E = {
      ...I.current,
      performerFocus: h,
      filter: { ...I.current.filter, page: 1 }
    };
    De(E, E.startFrom === "end"), Qt("items");
  }
  function Ya() {
    const { performerFocus: h, ...E } = I.current;
    De(
      { ...E, filter: { ...E.filter, page: 1 } },
      E.startFrom === "end"
    );
  }
  const cr = R(null);
  cr.current ?? (cr.current = lc());
  const va = cr.current, Xa = me(
    () => Pe.actions.flatMap((h) => h.steps.flatMap((E) => E.tagIds)),
    [Pe.actions]
  ), Na = R(null);
  H(() => {
    const h = Na.current, E = h == null ? void 0 : h.querySelector('[aria-current="true"]');
    if (!h || !E) return;
    const $ = h.getBoundingClientRect(), ne = E.getBoundingClientRect();
    ne.top < $.top ? h.scrollTop -= $.top - ne.top : ne.bottom > $.bottom && (h.scrollTop += ne.bottom - $.bottom);
  }, [y == null ? void 0 : y.key, xt]);
  const Tr = R(null), Wr = R(null);
  H(() => {
    var $, ne;
    const h = Wr.current;
    if (!h) return;
    Wr.current = null;
    const E = [...(($ = Tr.current) == null ? void 0 : $.querySelectorAll(".dq-partner")) ?? []];
    (ne = E.find((ue) => ue.dataset.partnerKey === h) ?? E[0]) == null || ne.focus();
  }, [y == null ? void 0 : y.key]);
  const $t = Ee || Oe || Me || !!v, Nn = me(
    () => v ? kn(v, Fa(e, B)) : null,
    [v, e, B]
  ), lr = me(
    () => Nn != null && Lr(yr(Nn)) !== Lr(yr(e)),
    [Nn, e]
  );
  function Gn() {
    y ? hn(d, y).then(Vt).catch((h) => Fe(tn(h))) : De(I.current);
  }
  const Kn = pn ? /* @__PURE__ */ l("p", { role: "alert", children: [
    pn,
    " ",
    /* @__PURE__ */ r("button", { type: "button", disabled: Ee, onClick: Gn, children: y ? "Reload tags" : "Retry queue" })
  ] }) : null, ln = Ee || Oe || y != null && !Ze, dr = Math.max(1, Number(B.filter.perPage) || 1), ur = R(1);
  Oe || (ur.current = Math.max(1, Math.ceil(Re / dr)));
  const Hr = ur.current, qa = ft && y ? re.filter(
    (h) => h.media.id === y.media.id && h.key !== y.key
  ) : [], Za = (h) => {
    var E;
    return h.title || ((E = h.files[0]) == null ? void 0 : E.basename) || `${d === "audio" ? "Audio" : "Video"} ${h.id}`;
  }, Qr = y ? Hf(y.media, d) : "";
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-review-workspace${d === "audio" ? " dq-audio" : ""}`,
      "aria-label": ft ? d === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : d === "audio" ? "Audio review" : "Video review",
      onClickCapture: (h) => {
        var ne;
        const E = h.target instanceof Element ? h.target.closest("button") : null, $ = (E == null ? void 0 : E.getAttribute("aria-label")) ?? ((ne = E == null ? void 0 : E.textContent) == null ? void 0 : ne.trim()) ?? "";
        E && !E.closest(cs) && /^(Filters|Edit filter:|Edit criteria)/.test($) && (qt.current = E);
      },
      children: [
        /* @__PURE__ */ r(
          Cc,
          {
            name: e.name,
            description: e.description,
            entityType: je(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: $t || !!(c != null && c.busy),
            onEdit: v ? () => {
              var h;
              return (h = K.current) == null ? void 0 : h.focus();
            } : Zt,
            editDisabled: !v && ($t || !i || !!(c != null && c.busy)),
            editing: !!v,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: Ee || Me, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: d === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ r(
                  aa,
                  {
                    filter: B.filter,
                    objectFilter: pe,
                    criteriaDefinitions: d === "audio" ? ys : Ui,
                    customFieldEntityType: d,
                    totalCount: Re,
                    sortOptions: d === "audio" ? kl : ws,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(
                      Ac,
                      {
                        page: Math.min(Math.max(1, bn || 1), Hr),
                        pages: Hr,
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
            trailing: /* @__PURE__ */ l(ye, { children: [
              ft && /* @__PURE__ */ r(
                Ff,
                {
                  scope: ft,
                  disabled: Ee || Me,
                  editing: !!v,
                  onChange: yn,
                  onEditCriteria: () => Tn(!0)
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
            trailingEnd: /* @__PURE__ */ l(ye, { children: [
              Ie(Ht) && t && /* @__PURE__ */ r(
                Ef,
                {
                  review: Ht,
                  disabled: gt || !!v,
                  performerAttention: B.performerFocus ? Jr : void 0,
                  trees: cn,
                  onOpen: () => {
                    we.current = !0, Cn(!0);
                  },
                  onWrite: () => {
                    Ce.current = Date.now();
                  },
                  onClose: (h) => {
                    if (h) {
                      Ce.current = Date.now();
                      const E = I.current.performerFocus;
                      E ? wa(E) : wn(), $e(($) => $ + 1), new Promise(($) => window.setTimeout($, 1100)).then(() => {
                        nt(), Ve.current && (N.current || Xe(!0), Q(($) => $ + 1));
                      });
                    } else nt();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ r(
                fo,
                {
                  disabled: $t,
                  items: c.moreItems({
                    onSelect: Zt,
                    disabled: !i
                  })
                }
              )
            ] }),
            chipsStart: B.performerFocus ? /* @__PURE__ */ l("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ r(
                Pr,
                {
                  performer: {
                    id: B.performerFocus,
                    name: (rt == null ? void 0 : rt.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ l("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ r("strong", { children: (rt == null ? void 0 : rt.name) ?? `performer ${B.performerFocus}` })
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
                  onClick: Ya,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: Xt,
            queueChange: !v && Xt ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: tr ? () => void Le() : void 0,
              saveDisabled: gt || !i,
              onReset: () => {
                const h = Nr(e);
                De(h, h.startFrom === "end");
              },
              resetDisabled: gt
            } : void 0,
            chipsEnd: v ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
          v && Nn && /* @__PURE__ */ r(
            Ec,
            {
              drawerRef: K,
              draft: Nn,
              onChange: (h) => T(h),
              direction: B.startFrom,
              onDirectionChange: (h) => De({ ...I.current, startFrom: h }),
              tagGroups: Wf,
              trees: cn,
              saving: Ee,
              saveDisabled: Oe,
              error: M,
              dirty: lr,
              criteriaChanged: tr,
              notices: Kn && /* @__PURE__ */ r("div", { className: "dq-review-feedback", children: Kn }),
              onSave: () => void ya(),
              onCancel: kr
            }
          ),
          /* @__PURE__ */ r("div", { className: "dq-review-main", children: /* @__PURE__ */ l("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ l("div", { className: "dq-review-stage", children: [
              y ? /* @__PURE__ */ l(ye, { children: [
                /* @__PURE__ */ l("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ r("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ l(
                    "a",
                    {
                      href: `/${d}/${y.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${g.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ r("span", { children: Za(y.media) }),
                        /* @__PURE__ */ r(Is, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Qr && /* @__PURE__ */ r("span", { className: "dq-stage-meta", children: Qr })
                ] }),
                /* @__PURE__ */ l("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ r("div", { className: "dq-player-frame", children: [y, fe].filter(Boolean).map((h) => {
                    var ne, ue, de, Qe, Ot;
                    const E = h, $ = E.key === y.key;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        className: $ ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": $ ? void 0 : !0,
                        inert: $ ? void 0 : !0,
                        children: d === "audio" ? /* @__PURE__ */ r(
                          El,
                          {
                            streamUrl: qi("audio", E.media.id),
                            format: ((ne = E.media.files[0]) == null ? void 0 : ne.format) ?? "",
                            title: b(E.media),
                            coverUrl: $ ? Ni("audio", E.media) : void 0,
                            duration: ((ue = E.media.files[0]) == null ? void 0 : ue.duration) ?? 0,
                            autostart: $ && W === E.media.id
                          }
                        ) : /* @__PURE__ */ r(
                          vs,
                          {
                            videoId: E.media.id,
                            streamUrl: qi("video", E.media.id),
                            posterUrl: $ ? Ni("video", E.media) : void 0,
                            duration: ((de = E.media.files[0]) == null ? void 0 : de.duration) ?? 0,
                            format: (Qe = E.media.files[0]) == null ? void 0 : Qe.format,
                            audioCodec: (Ot = E.media.files[0]) == null ? void 0 : Ot.audioCodec,
                            extensionSurface: $ ? "quick-view" : void 0,
                            autostart: $ && W === E.media.id,
                            keyboardShortcutsEnabled: $,
                            showAbLoop: $,
                            clip: E.media.parentVideoId != null ? {
                              start: E.media.clipStartSec ?? 0,
                              end: E.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${E.media.id}:${He}`
                    );
                  }) }),
                  d === "audio" && /* @__PURE__ */ r(
                    Af,
                    {
                      details: y.media.details,
                      label: g.one
                    },
                    y.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ r("p", { role: "status", className: "dq-stage-status", children: Oe ? "Loading review…" : Re ? "Reached the end in this direction." : `No matching ${g.many}.` }),
              Pe.actions.length > 0 ? /* @__PURE__ */ r(
                su,
                {
                  actions: Pe.actions,
                  mediaKind: d,
                  isDisabled: (h) => Me || an(h),
                  busy: ln,
                  tags: Ze,
                  trees: cn,
                  preview: va,
                  onApply: (h, E) => void rn(h, E),
                  onFind: () => Ft(!0),
                  findDisabled: Me || !!v,
                  paused: !!v,
                  waitForGroups: jo(Pe),
                  attention: Ar,
                  stayOnTap: ot,
                  onStayOnTapChange: Dn
                }
              ) : Ie(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ l(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || Ee || Me || !Ze || !!v || !y,
                  children: [
                    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((h) => /* @__PURE__ */ l("label", { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Wt.includes(h),
                          onChange: (E) => xe(
                            e.occurrence.multiple ? E.target.checked ? [...Wt, h] : Wt.filter(($) => $ !== h) : [h]
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
              /* @__PURE__ */ l("div", { className: "dq-panel-body", ref: Tr, children: [
                y && /* @__PURE__ */ l(ye, { children: [
                  /* @__PURE__ */ l("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ l("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: y.occurrence ? y.occurrence.performer.name : `this ${g.one}` })
                    ] }),
                    /* @__PURE__ */ l("div", { className: "dq-reviewing-who", children: [
                      y.occurrence && /* @__PURE__ */ r(Pr, { performer: y.occurrence.performer }),
                      /* @__PURE__ */ l("div", { children: [
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: y.occurrence ? y.occurrence.performer.name : `This ${g.one}` }),
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-note", children: ft ? `Tags apply to this performer in this ${g.queue}` : `Tags apply to the whole ${g.one}` })
                      ] })
                    ] }),
                    Ar.length > 0 && /* @__PURE__ */ r(Xf, { entries: Ar })
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
                          var E, $, ne;
                          return /* @__PURE__ */ l(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (E = h.occurrence) == null ? void 0 : E.performer.name,
                              "aria-label": ($ = h.occurrence) == null ? void 0 : $.performer.name,
                              "data-partner-key": h.key,
                              disabled: gt,
                              onClick: () => {
                                Wr.current = y.key, _t(h), Fe("");
                              },
                              children: [
                                h.occurrence && /* @__PURE__ */ r(Pr, { performer: h.occurrence.performer }),
                                /* @__PURE__ */ r("span", { children: (ne = h.occurrence) == null ? void 0 : ne.performer.name })
                              ]
                            },
                            h.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ r(
                    Yf,
                    {
                      tags: Ze,
                      preview: va,
                      showPreview: !Me,
                      trees: cn,
                      actionTagIds: Xa,
                      label: `Current ${ft ? "occurrence" : g.one} tags`
                    }
                  ),
                  Me && /* @__PURE__ */ l(
                    "fieldset",
                    {
                      ref: er,
                      disabled: Ee,
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
                Ie(et) && B.performerFocus && /* @__PURE__ */ r(
                  Mi,
                  {
                    ...St,
                    mediaKind: d,
                    actions: Pe.actions,
                    trees: cn,
                    flags: Jr
                  }
                )
              ] }),
              /* @__PURE__ */ l("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ l("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !v && Kn,
                  it && /* @__PURE__ */ r("p", { role: "status", children: it })
                ] }),
                !t && /* @__PURE__ */ r("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                y && /* @__PURE__ */ l("div", { className: "dq-panel-actions", "aria-busy": ln || void 0, children: [
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      ref: zt,
                      className: "dq-button",
                      disabled: gt || !!v || !t || !Ze,
                      onClick: () => {
                        ht.current = [...Ze.ids], Mt([...Ze.ids]), An(!0);
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
                      disabled: gt || !!v,
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
                If,
                {
                  ranking: (ct == null ? void 0 : ct.signature) === be ? ct : null,
                  busy: gn,
                  error: (C == null ? void 0 : C.signature) === be ? C.message : "",
                  focus: B.performerFocus,
                  disabled: gt,
                  labels: g,
                  flagLabel: Rn,
                  onFocus: sr,
                  onMore: () => {
                    const h = Yt.current;
                    h && Er(h, h.limit + hi);
                  },
                  onRefresh: () => {
                    Pt(null), Er(null, hi);
                  }
                }
              ) : /* @__PURE__ */ r("div", { className: "dq-queue-list", ref: Na, children: re.map((h) => {
                var $;
                const E = (y == null ? void 0 : y.key) === h.key;
                return /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: w(h),
                    "aria-label": w(h),
                    "aria-current": E ? "true" : void 0,
                    disabled: gt,
                    onClick: () => {
                      _t(h), Fe(""), Te("");
                    },
                    children: [
                      /* @__PURE__ */ r(Qf, { media: h.media, kind: d }),
                      /* @__PURE__ */ l("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: b(h.media) }),
                        /* @__PURE__ */ l("span", { className: "dq-queue-row-meta", children: [
                          h.occurrence && /* @__PURE__ */ l(ye, { children: [
                            /* @__PURE__ */ r(Pr, { performer: h.occurrence.performer }),
                            /* @__PURE__ */ r("span", { className: "dq-queue-row-performer", children: h.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ r("span", { className: "dq-queue-row-detail", children: [
                            h.media.date,
                            h.occurrence ? "" : ($ = h.media.files[0]) != null && $.duration ? Ns(h.media.files[0].duration) : ""
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
            onClose: () => Tn(!1),
            criteria: ji,
            activeFilter: ft.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (h) => {
              Tn(!1), yn({ performerFilter: h });
            }
          }
        ),
        Jt && /* @__PURE__ */ r(
          co,
          {
            actions: e.actions,
            trees: cn,
            isDisabled: (h) => an(h),
            tapStays: mn && ot,
            onApply: (h, E) => {
              Ft(!1), rn(h, E);
            },
            onClose: () => Ft(!1)
          }
        )
      ]
    }
  );
}
const Jc = "data-quality.reviews-sort.v1", eh = { sort: "name", direction: "asc" };
function th() {
  try {
    const e = JSON.parse(localStorage.getItem(Jc) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return eh;
}
function nh(e) {
  try {
    localStorage.setItem(
      Jc,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function Wc(e, t, n, a) {
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
function pi(e, t) {
  const n = je(e), a = En(Wi(n)), i = n === "tag" ? "tag" : Ie(e) ? a.queue : a.one;
  return t === 1 ? i : `${i}s`;
}
function rh({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ l(ye, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      pi(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ l(ye, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      "Matching ",
      pi(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ l(ye, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      pi(e, t)
    ] })
  ] });
}
function ah({
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
  rowMenuItems: S
}) {
  const N = R(null), v = me(
    () => Wc(e, t, n, a),
    [e, t, n, a]
  ), T = e.every((j) => t[j.id] !== void 0), M = a === "asc" ? "ascending" : "descending";
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
              var j;
              return (j = N.current) == null ? void 0 : j.click();
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
            ref: N,
            type: "file",
            accept: "application/json,.json",
            hidden: !0,
            tabIndex: -1,
            onChange: (j) => {
              var L;
              const K = (L = j.target.files) == null ? void 0 : L[0];
              j.target.value = "", K && b(K);
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
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: T ? e.some((j) => t[j.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
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
              children: a === "asc" ? /* @__PURE__ */ r(Gl, { "aria-hidden": "true" }) : /* @__PURE__ */ r(Kl, { "aria-hidden": "true" })
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
        /* @__PURE__ */ r("tbody", { children: v.map((j) => {
          const K = je(j);
          return /* @__PURE__ */ l("tr", { children: [
            /* @__PURE__ */ r("td", { children: /* @__PURE__ */ l(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(j.id)}`,
                "data-review-id": j.id,
                onClick: (L) => {
                  L.button !== 0 || L.metaKey || L.ctrlKey || L.shiftKey || L.altKey || (L.preventDefault(), g(j.id));
                },
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ r(qc, { entityType: K }) }),
                  /* @__PURE__ */ l("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ r("span", { className: "dq-reviews-name", children: j.name }),
                    j.description && /* @__PURE__ */ r("span", { className: "dq-reviews-description", title: j.description, children: j.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-type", children: Nc[K] }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-count", children: /* @__PURE__ */ r(rh, { review: j, count: t[j.id] }) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ r(fo, { label: `Actions for ${j.name}`, items: S(j) }) })
          ] }, j.id);
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
function ih({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: a
}) {
  const { review: i, saving: o, error: s } = e, c = R(null), u = R(null), p = R(o);
  p.current = o;
  const d = R(null), g = at();
  H(() => {
    var w;
    return d.current ?? (d.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (w = u.current) == null || w.focus(), () => {
      var S;
      (S = d.current) != null && S.isConnected && d.current.focus({ preventScroll: !0 });
    };
  }, []);
  const m = R(o);
  H(() => {
    var N, v;
    const w = document.activeElement, S = !w || w === document.body || !((N = c.current) != null && N.contains(w));
    s && (!i.name.trim() || m.current && !o && S) && ((v = u.current) == null || v.focus()), m.current = o;
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
                  children: /* @__PURE__ */ r(ua, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ l("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ r("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ l("fieldset", { className: "dq-form-dialog-fields", disabled: o, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ r(
                  kc,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (w) => {
                      w !== je(i) && t(Hc(w, i));
                    },
                    nameRef: u
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ l("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ r("button", { type: "button", className: "dq-text-button", onClick: () => uo(i), children: "Export draft" }),
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
const oh = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function sh(e, t, n, a) {
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
  return je(t) === "video" && ba(t.view.objectFilter, e.view.objectFilter).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function ds(e, t) {
  return vr(
    JSON.parse(Jn(yr(e))),
    JSON.parse(Jn(yr(t)))
  );
}
const mi = 180;
function us(e) {
  return je(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function fs(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function hs() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function gi(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  Qa.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const a = n.toString();
  Vc(`${window.location.pathname}${a ? `?${a}` : ""}`, { openingFromList: t });
}
function ch(e) {
  return Kt({ ...e, page: 1 });
}
function Qc(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Fr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const lh = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Bi, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ r(zl, { "aria-hidden": "true" }) }
], dh = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Bi, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ r(Vl, { "aria-hidden": "true" }) }
], ps = [], Yc = "(min-width: 900px)";
function uh(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(Yc);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function fh() {
  return typeof window.matchMedia == "function" && window.matchMedia(Yc).matches;
}
function hh({
  onNavigate: e
}) {
  const [t, n] = A([]), [a] = A(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = A(""), [s, c] = A(!0), [u, p] = A(""), [d, g] = A(!1), [m, b] = A(!1), [w, S] = A(!1), [N, v] = A(!1), [T, M] = A([]), [j, K] = A(""), [L, ee] = A(!0), [te, Z] = A("account"), [oe, U] = A(""), [B, k] = A(""), [I, z] = A(!1), [Q, ae] = A(!1), [re, V] = A(""), [y, F] = A(hs), G = R(y);
  G.current = y;
  const [W, ge] = A({}), He = R(W);
  He.current = W;
  const D = R(t);
  D.current = t;
  const fe = R(s);
  fe.current = s;
  const Re = R(!1), se = R(!0);
  H(() => (se.current = !0, () => {
    se.current = !1;
  }), []);
  const [Oe, Xe] = A(!y);
  Oe !== !y && (Xe(!y), y || ge({}));
  const [Ee, Cn] = A(th), { sort: we, direction: Ve } = Ee, Et = (f) => {
    const q = { ...Ee, ...f };
    Cn(q), nh(q);
  }, pn = R(null), Fe = R(null), [it, Te] = A(null), [Ze, Vt] = A(!1), [Me, An] = A(!1), [ut, Mt] = A(null), [ht, zt] = A(null), qt = !!ut || !!ht, er = R(qt);
  er.current = qt;
  const Tt = Ze || !!ht || Me, [Tn, Jt] = A(0), [Ft, mn] = A(!1), [Ne, Ct] = A(null), ot = R(null), Dn = R(null), Wt = R(null), [xe, It] = A(
    null
  ), ce = t.find((f) => f.id === y) ?? null, x = me(
    () => (xe == null ? void 0 : xe.id) === y && ce ? { ...ce, view: {
      ...ce.view,
      filter: xe.view.filter,
      objectFilter: xe.view.objectFilter,
      searchMode: xe.view.searchMode,
      startFrom: xe.view.startFrom
    } } : ce,
    [xe, y, ce]
  ), Ce = x ? je(x) : "video", pt = Wi(Ce), _n = x ? Ie(x) : !1, pe = Ce === "video" ? x : null, Rt = _n && !!(x != null && x.actions.some(Qn)), tt = !!pe || Ce === "audio" || Rt, [Pe, et] = A(null), Ht = (Pe == null ? void 0 : Pe.id) === (x == null ? void 0 : x.id) ? Pe == null ? void 0 : Pe.mode : (x == null ? void 0 : x.view.reviewMode) ?? "single", st = _n || Ce === "audio" || Ce === "video" && Ht === "single", [mt, xt] = A(0), Qt = R(-1), ct = R(!1), jn = R(st);
  jn.current = st, H(() => {
    const f = () => {
      const q = jn.current;
      if (!q && wn.current) {
        ct.current = !0;
        return;
      }
      Qt.current = -1, At(), q || xt((O) => O + 1);
    };
    return window.addEventListener("popstate", f), () => window.removeEventListener("popstate", f);
  }, []);
  const Yt = pt === "audio" ? m : d, Un = Ce === "tag" ? "Tag" : pt === "audio" ? "Audio" : "Video", Pt = Ce === "tag" ? w : Yt, gn = R(
    null
  ), nn = Uf(pe), [C, P] = A({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Y, be] = A({
    page: 1,
    perPage: 40
  }), [le, $e] = A({ items: [], totalCount: 0 }), [Ae, Lt] = A(y);
  Ae !== y && (Lt(y), $e({ items: [], totalCount: 0 }), ae(!1));
  const [ve, Se] = A(!1), [qe, Dt] = A(""), [In, Gr] = A(!1), [Kr, Br] = A(!1), [St, Xt] = A(() => /* @__PURE__ */ new Set()), tr = R(St);
  tr.current = St;
  const gt = R(/* @__PURE__ */ new Map()), bn = (x == null ? void 0 : x.view.selectAllOnLoad) === !0, [De, nt] = A(null), bt = R(De);
  bt.current = De;
  const [yt, _t] = A(!1), jt = R(yt);
  jt.current = yt;
  const rn = R(null), [nr, an] = A(!1), [Zt, Sr] = A("grid"), [kr, ya] = A(mi), [Le, ft] = A(!1), [yn, Er] = A(!1), wn = R(!1), [wa, rr] = A(""), [rt, on] = A(""), [sn, vn] = A(""), [_e, Vr] = A(null), [cn, Cr] = A(""), [ar, ir] = A(!1), [zr, Ar] = A({}), or = R(/* @__PURE__ */ new Map()), Jr = R(null), Rn = R(null), sr = !!x, Ya = Di(uh, fh, () => !1) && sr, [cr, va] = A({ top: 0, bottom: 0 });
  kt(() => {
    if (!sr) return;
    const f = () => {
      const O = Rn.current;
      if (!O) return;
      const _ = Math.round(O.getBoundingClientRect().top + window.scrollY), X = O.closest("main"), J = X ? Math.round(parseFloat(getComputedStyle(X).paddingBottom) || 0) : 0;
      va(
        (ie) => ie.top === _ && ie.bottom === J ? ie : { top: _, bottom: J }
      );
    };
    f();
    const q = typeof ResizeObserver > "u" ? null : new ResizeObserver(f);
    return q == null || q.observe(document.body), window.addEventListener("resize", f), () => {
      q == null || q.disconnect(), window.removeEventListener("resize", f);
    };
  }, [sr]);
  const [Xa, Na] = A(0), Tr = R(null), Wr = Sn((f) => {
    var O;
    if ((O = Tr.current) == null || O.disconnect(), Tr.current = null, !f || typeof ResizeObserver > "u") return;
    const q = new ResizeObserver(
      () => Na(Math.round(f.getBoundingClientRect().height))
    );
    q.observe(f), Tr.current = q;
  }, []), $t = R(0), Nn = R(0), lr = R(null), Gn = R(null), Kn = Hs(
    x && !st ? Ne ? [...x.actions, ...Ne.draft.actions] : x.actions : ps
  ), ln = me(
    () => Ne && x && ce ? sh(Ne.draft, x, C, ce) : null,
    [Ne, x, C, ce]
  ), dr = me(
    () => x && ce ? zc(
      { ...ce, view: { ...x.view, filter: { ...C, page: 1 } } },
      ce
    ) : null,
    [x, ce, C]
  ), ur = me(
    () => ce ? Lr(yr(ce)) : "",
    [ce]
  ), Hr = me(
    () => dr != null && Lr(yr(dr)) !== ur,
    [dr, ur]
  ), qa = me(
    () => ln != null && Lr(yr(ln)) !== ur,
    [ln, ur]
  );
  H(() => {
    if (!rt) return;
    const f = window.setTimeout(() => on(""), 4e3);
    return () => window.clearTimeout(f);
  }, [rt]), H(() => {
    if (!it || it.alert) return;
    const f = window.setTimeout(() => Te(null), 6e3);
    return () => window.clearTimeout(f);
  }, [it]), H(() => {
    const f = pe ? mo(pe.view.objectFilter) : [];
    if (Ar({}), !f.length) return;
    const q = new AbortController();
    let O = !0;
    return Promise.all(
      f.map(async (_) => {
        var X;
        try {
          const J = await he(`/api/tags/${_}`, {
            signal: q.signal
          });
          return (X = J.name) != null && X.trim() ? [String(_), J.name] : null;
        } catch {
          return null;
        }
      })
    ).then((_) => {
      O && Ar(
        Object.fromEntries(_.filter((X) => X !== null))
      );
    }), () => {
      O = !1, q.abort();
    };
  }, [pe == null ? void 0 : pe.id, pe == null ? void 0 : pe.view.objectFilter]);
  const Za = me(
    () => pe ? go(
      pe.view.objectFilter,
      zr
    ) : (x == null ? void 0 : x.view.objectFilter) ?? {},
    [zr, x, pe]
  ), Qr = Sn(async () => {
    c(!0), p("");
    try {
      const f = await hd();
      n(f.reviews), o(f.storageKey), g(f.canWriteVideos ?? f.canWrite), b(f.canWriteAudios ?? !1), S(f.canWriteTags ?? !1), v(f.canReadTagGroups ?? !1), ee(f.canConfigure ?? !0), Z(f.storage ?? "account"), U(f.storageNotice ?? ""), y && !f.reviews.some((q) => q.id === y) && (F(""), gi(""));
    } catch (f) {
      p(
        f instanceof Error ? f.message : "Could not load reviews."
      );
    } finally {
      c(!1);
    }
  }, [y]);
  H(() => {
    if (!N) {
      M([]), K("");
      return;
    }
    const f = new AbortController();
    return K(""), Ed(f.signal).then(M).catch((q) => {
      f.signal.aborted || K(
        q instanceof Error ? q.message : "Could not load tag groups."
      );
    }), () => f.abort();
  }, [N]), H(() => {
    Qr();
  }, []), H(() => {
    if (y || t.length === 0) return;
    const f = new AbortController();
    for (const q of t) {
      if (typeof He.current[q.id] == "number") continue;
      (Ie(q) ? bo(q, f.signal).then((_) => (_ == null ? void 0 : _.length) === 0 ? { items: [], totalCount: 0 } : na(yo(q, _), { ...q.view.filter, page: 1, perPage: 1 }, f.signal)) : je(q) === "tag" ? Po(
        q,
        Kt({ ...q.view.filter, page: 1, perPage: 1 }),
        f.signal
      ) : na(
        q,
        Kt({ ...q.view.filter, page: 1, perPage: 1 }),
        f.signal
      )).then((_) => {
        f.signal.aborted || ge((X) => ({
          ...X,
          [q.id]: _.totalCount
        }));
      }).catch(() => {
        f.signal.aborted || ge((_) => ({ ..._, [q.id]: null }));
      });
    }
    return () => f.abort();
  }, [y, t]), kt(() => {
    var O, _;
    const f = Fe.current;
    if (y || s || !f) return;
    Fe.current = null, (_ = (f === "heading" ? null : [...((O = Rn.current) == null ? void 0 : O.querySelectorAll("[data-review-id]")) ?? []].find(
      (X) => X.dataset.reviewId === f.reviewId
    )) ?? pn.current) == null || _.focus();
  }, [y, s, ht, t]);
  const Ir = R(0), h = Sn(async () => {
    const f = ++Ir.current;
    Vr(null), Cr("");
    try {
      const q = await (Rt ? Vs(pt) : Bs(pt));
      f === Ir.current && Vr(q);
    } catch (q) {
      if (f !== Ir.current) return;
      Vr(null), Cr(
        "Tag assessment setup could not be checked. " + (q instanceof Error ? q.message : "Request failed.")
      );
    }
  }, [Rt, pt]);
  H(() => {
    h();
  }, [h]);
  const E = Sn(
    async (f, q, O = !1, _ = !1) => {
      var vt, Ge;
      const X = ++$t.current;
      (vt = lr.current) == null || vt.abort();
      const J = new AbortController();
      lr.current = J, q = Kt(q);
      const ie = Number(q.page);
      O && (q = { ...q, page: 1 }), P(q), Br(O), Se(!0), Dt("");
      try {
        const Je = ($n) => je(f) === "tag" ? Po(
          f,
          $n,
          J.signal
        ) : na(
          f,
          $n,
          J.signal
        );
        let ke = await Je(q);
        const We = Math.max(
          1,
          Math.ceil(ke.totalCount / Number(q.perPage))
        ), Bn = O ? We : Math.min(ie, We);
        return Number(q.page) !== Bn && (q = { ...q, page: Bn }, ke = await Je(q)), X === $t.current && (((Ge = Gn.current) == null ? void 0 : Ge.page) !== Bn && (Gn.current = {
          page: Bn,
          ids: new Set(ke.items.map(($n) => $n.id))
        }), $e(ke), _ && wt(
          () => new Set(ke.items.map(($n) => $n.id))
        ), P(q), be(q)), ke;
      } catch (Je) {
        throw X === $t.current && Dt(
          Je instanceof Error ? Je.message : "Could not load the review queue."
        ), Je;
      } finally {
        X === $t.current && Se(!1);
      }
    },
    []
  );
  H(() => {
    var q;
    if (Nn.current += 1, Qt.current = -1, $t.current += 1, (q = lr.current) == null || q.abort(), Ct(null), ot.current = null, ae(!1), V(""), k(""), z(!1), Xt(/* @__PURE__ */ new Set()), gt.current.clear(), nt(null), _t(!1), ft(!1), wn.current = !1, rr(""), on(""), vn(""), $e({ items: [], totalCount: 0 }), Gn.current = null, Gr(!1), !x || st) {
      Se(!1), It(null);
      return;
    }
    let f = !0;
    return Se(!0), (async () => {
      let O = ce ?? x;
      It(null);
      let _ = null;
      const X = new URLSearchParams(window.location.search);
      if (je(x) === "video" && Qa.some((Ge) => X.has(Ge)))
        try {
          const Ge = O;
          _ = Li(Ge, X);
          const Je = kn(Ge, _.query);
          (_.query.startFrom !== (Ge.view.startFrom ?? "end") || !vr(
            JSON.parse(Jn(Je)),
            JSON.parse(Jn(kn(Ge, Nr(Ge))))
          )) && (O = Je, It(O));
        } catch (Ge) {
          Gr(!0), Dt(Ge instanceof Error ? Ge.message : "Could not read review URL."), Se(!1);
          return;
        }
      let J = null;
      try {
        J = await bd(i, x.id);
      } catch (Ge) {
        f && (z(!0), k(
          Ge instanceof Error ? Ge.message : "Could not load progress."
        ));
      }
      if (!f) return;
      const ie = (J == null ? void 0 : J.signature) === Jn(O) ? J : null, vt = _ ? _.query.filter : ie ? Kt(ie.filter) : ch(O.view.filter);
      P(vt), Sr(
        ie ? fs(ie.displayMode, je(x)) : us(x)
      ), ya(
        ie ? ie.cardSize ?? mi : mi
      );
      try {
        const Ge = await E(
          O,
          vt,
          _ ? _.startAtEnd : !ie && O.view.startFrom !== "beginning",
          O.view.selectAllOnLoad === !0
        );
        if (!f) return;
        const Je = Oo(
          Ge.items.map((ke) => ke.id),
          (ie == null ? void 0 : ie.focusedId) ?? null,
          (ie == null ? void 0 : ie.index) ?? 0
        );
        nt(Je), Ke(Je);
      } catch {
      }
      f && (Qt.current = mt, ae(!0), V(`${x.id}:${mt}`));
    })(), () => {
      var O;
      f = !1, Nn.current++, $t.current++, (O = lr.current) == null || O.abort();
    };
  }, [x == null ? void 0 : x.id, st, mt]), H(() => {
    if (!(!Tn || st || !x)) {
      if (In) {
        Jt(0);
        return;
      }
      Le || Ne || yn || re !== `${x.id}:${mt}` || (Jt(0), ai());
    }
  }, [
    Tn,
    st,
    x == null ? void 0 : x.id,
    re,
    Le,
    yn,
    mt,
    In
  ]), H(() => {
    !pe || st || !Q || ve || qe || Le || ct.current || Qt.current !== mt || ra(pe.id, {
      filter: C,
      objectFilter: pe.view.objectFilter,
      searchMode: pe.view.searchMode,
      startFrom: pe.view.startFrom ?? "end"
    });
  }, [pe, st, Q, ve, qe, C, Le, mt]);
  const $ = me(
    () => le.items.map((f) => f.id),
    [le.items]
  );
  H(() => {
    if (!Q || !x || !i || ve || qe || Le || (xe == null ? void 0 : xe.id) === x.id || I || Qt.current !== mt)
      return;
    const f = {
      version: 1,
      signature: Jn(x),
      filter: C,
      focusedId: De,
      index: Math.max(0, $.indexOf(De ?? -1)),
      displayMode: Zt,
      cardSize: kr,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + x.id,
        JSON.stringify(f)
      );
    } catch {
    }
    if (B) return;
    let q = !0;
    const O = window.setTimeout(() => {
      yd(i, x.id, f).catch((_) => {
        q && k(
          "Progress is kept in this browser, but account sync failed. " + (_ instanceof Error ? _.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      q = !1, window.clearTimeout(O);
    };
  }, [
    Q,
    i,
    x,
    ve,
    qe,
    Le,
    C,
    De,
    $,
    Zt,
    kr,
    xe,
    B,
    I,
    mt
  ]);
  const ne = le.items.find((f) => f.id === De) ?? null, ue = Ce === "video" ? ne : null;
  yt && ue && (rn.current = ue);
  const de = ue ?? (yt ? rn.current : null), Qe = Mo(St, De), Ot = $.length > 0 && $.every((f) => St.has(f)), Ke = Sn((f, q = !0) => {
    f != null && window.requestAnimationFrame(() => {
      var _;
      if (er.current || sd(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (_ = document.activeElement) != null && _.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const O = or.current.get(f);
      O == null || O.focus({ preventScroll: !0 }), q && (O == null || O.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  H(() => {
    Q && !jt.current && Ke(bt.current);
  }, [Q, Ke]), H(() => {
    ve || !$.length || (bt.current == null || !$.includes(bt.current)) && (nt($[0]), jt.current || Ke($[0]));
  }, [Ke, $, ve]);
  const wt = Sn(
    (f) => {
      Xt((q) => {
        const O = f(q);
        for (const _ of /* @__PURE__ */ new Set([...q, ...O]))
          q.has(_) !== O.has(_) && gt.current.set(
            _,
            (gt.current.get(_) ?? 0) + 1
          );
        return O;
      });
    },
    []
  ), lt = Sn(
    (f) => {
      if (!$.length) return;
      const q = Math.max(
        0,
        $.indexOf(bt.current ?? $[0])
      ), O = $[Math.max(0, Math.min($.length - 1, q + f))];
      nt(O), jt.current || Ke(O);
    },
    [Ke, $]
  ), Be = Sn(
    async (f) => {
      const q = "steps" in f ? f.steps.length > 0 : f.effect.mode !== "SKIP", O = "effect" in f && f.effect.mode === "SET_TAG_GROUP" ? f.effect.tagGroupId : null, _ = O != null && (!N || !T.some((Ye) => Ye.id === O)), X = "effect" in f && q && !N, J = Mo(
        tr.current,
        bt.current
      );
      if (!x || wn.current || ve || qe) return;
      const ie = q && !Pt ? `${Un} write permission is required to apply ${f.label}.` : X || _ ? `${f.label} needs a tag group that is unavailable.` : Qn(f) && (_e == null ? void 0 : _e.kind) !== "ready" ? `Set up tag assessments before applying ${f.label}.` : J.length ? "" : `Select or focus a ${Ce} before applying ${f.label}.`;
      if (ie) {
        vn(ie);
        return;
      }
      const vt = ++Nn.current, Ge = x.id, Je = [...$], ke = le, We = bt.current, Bn = new Set(tr.current), $n = new Map(
        J.map((Ye) => [Ye, gt.current.get(Ye) ?? 0])
      ), Or = () => vt === Nn.current && x.id === Ge;
      wn.current = !0, ft(!0), rr(
        tr.current.size ? `${J.length} selected ${Ce}s` : `the focused ${Ce}`
      ), on(""), vn("");
      const Co = ke.items.filter(
        (Ye) => !J.includes(Ye.id)
      ), pl = Co.map((Ye) => Ye.id), Ao = Fo(
        Je,
        pl,
        We,
        J.includes(We ?? -1)
      );
      $e({
        items: Co,
        totalCount: ke.totalCount
      }), Xt((Ye) => {
        const Gt = new Set(Ye);
        for (const un of J) Gt.delete(un);
        return Gt;
      }), nt(Ao), jt.current || Ke(Ao);
      let ii = !1;
      try {
        if ("effect" in f ? await xd(f, J) : await Js(pt, f, J), ii = !0, !Or()) return;
        Xt((Ye) => {
          const Gt = new Set(Ye);
          for (const un of J)
            (gt.current.get(un) ?? 0) === $n.get(un) && Gt.delete(un);
          return Gt;
        }), on(
          `${f.label}: ${J.length} ${Ce}${J.length === 1 ? "" : "s"} ${q ? "updated" : "skipped"}.`
        );
      } catch (Ye) {
        if (!Or()) return;
        $e(ke), Xt((Gt) => {
          const un = new Set(Gt);
          for (const en of J)
            Bn.has(en) && (gt.current.get(en) ?? 0) === $n.get(en) && un.add(en);
          return un;
        }), nt(We), jt.current || Ke(We), vn(
          Ye instanceof Error ? Ye.message : "Action failed."
        );
      }
      try {
        if (await Td(f), !Or()) return;
        const Ye = new Set(J), Gt = bn && Je.length > 0 && Je.every((fn) => Ye.has(fn)), un = await E(x, C, !1, Gt);
        if (!Or()) return;
        let en = un.items.map((fn) => fn.id);
        const Aa = Gn.current, ml = (Aa == null ? void 0 : Aa.page) === Number(C.page) && en.some((fn) => Aa.ids.has(fn)), gl = (x.view.startFrom ?? "end") !== "beginning";
        if (un.totalCount > 0 && Number(C.page) > 1 && (!en.length || gl && !ml)) {
          const fn = Math.max(1, Number(C.page) - 1), Ta = { ...C, page: fn };
          P(Ta), en = (await E(
            x,
            Ta,
            !1,
            Gt
          )).items.map((oi) => oi.id), Xt(
            (oi) => new Set([...oi].filter((bl) => en.includes(bl)))
          );
          const Io = en.at(-1) ?? null;
          nt(Io), jt.current || Ke(Io);
        } else {
          Xt(
            (Ta) => new Set([...Ta].filter((To) => en.includes(To)))
          );
          const fn = Fo(
            Je,
            en,
            We,
            ii && J.includes(We ?? -1)
          );
          nt(fn), jt.current && fn == null && _t(!1), jt.current || Ke(fn);
        }
      } catch (Ye) {
        Or() && vn(
          (Gt) => `${Gt ? `${Gt} ` : ""}${ii ? "The action completed, but " : ""}the queue could not be refreshed. ${Ye instanceof Error ? Ye.message : "Refresh failed."}`
        );
      } finally {
        Or() && (wn.current = !1, ft(!1), rr(""), ct.current && (ct.current = !1, At(), xt((Ye) => Ye + 1)));
      }
    },
    [
      Pt,
      N,
      T,
      Ce,
      _e,
      E,
      C,
      Ke,
      $,
      le,
      ve,
      qe,
      x
    ]
  );
  function qn() {
    var O;
    if (Zt === "list") return 1;
    const f = (O = Jr.current) == null ? void 0 : O.firstElementChild, q = f ? getComputedStyle(f).gridTemplateColumns : "";
    return Math.max(1, q.split(" ").filter(Boolean).length);
  }
  const ze = R(() => {
  });
  ze.current = (f) => {
    var J;
    if (st || f.defaultPrevented || f.repeat || Pn(f) || f.ctrlKey || f.altKey || f.metaKey || qt) return;
    const q = f.target, O = q instanceof Node && ((J = Rn.current) == null ? void 0 : J.contains(q)) === !0, _ = q === document.body || q === document.documentElement;
    if (!O && !_) return;
    if (nr) {
      f.key === "Escape" && (Fr(f), an(!1));
      return;
    }
    if (yt && f.key === "Escape") {
      Fr(f), _t(!1), Ke(bt.current);
      return;
    }
    if (!od(q)) return;
    const X = id(q);
    if (f.key === "Escape") {
      Fr(f), wt(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!yt && f.key === " " && X) {
      Fr(f), De != null && wt((ie) => xa(ie, De));
      return;
    }
    if (!(Le || ve) && !yt && f.key === "Enter" && De != null && X) {
      if (Ce !== "tag" && Ne) return;
      Fr(f), Ce === "tag" ? window.open(`/tag/${De}`, "_blank", "noopener,noreferrer") : _t(!0);
      return;
    }
  }, H(() => {
    const f = (q) => ze.current(q);
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, []);
  const dn = R(
    () => {
    }
  );
  dn.current = (f) => {
    var J;
    if (st || qt || yt || nr || Le || ve || !$.length || f.defaultPrevented || f.repeat || f.ctrlKey || f.altKey || f.metaKey)
      return;
    const q = f.target, O = q instanceof Node && ((J = Rn.current) == null ? void 0 : J.contains(q)) === !0, _ = q === document.body || q === document.documentElement;
    if (!O && !_ || !f.key.startsWith("Arrow") || !cd(q)) return;
    const X = ld(f.key, qn());
    X && (f.preventDefault(), O ? f.stopImmediatePropagation() : f.stopPropagation(), lt(X));
  }, H(() => {
    const f = (q) => dn.current(q);
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, []);
  const Ut = (Ne == null ? void 0 : Ne.saving) === !0 || yn, Yr = Le || ve && !Q || Ut, Sa = oo();
  io({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!x && !st && !qt && !Ne && !yt && !nr && !qe && (le.items.length > 0 || ve || Le),
    actions: (x == null ? void 0 : x.actions) ?? ps,
    onAction: (f) => {
      const q = x == null ? void 0 : x.actions[f];
      q && Be(q);
    },
    onFind: () => an(!0),
    onSelectAll: () => wt((f) => ad(f, $))
  }), H(() => an(!1), [st, yt, x == null ? void 0 : x.id]);
  function ka(f) {
    const q = "steps" in f ? f.steps.length > 0 : f.effect.mode !== "SKIP", O = "effect" in f && f.effect.mode === "SET_TAG_GROUP" ? f.effect.tagGroupId : null, _ = O != null && !T.some((X) => X.id === O);
    return Le || ve || !!qe || q && !Pt || "effect" in f && q && (!N || _) || Qn(f) && (_e == null ? void 0 : _e.kind) !== "ready" || !Qe.length;
  }
  function fr(f) {
    et(null), Jt(0), Te(null), F(f), gi(f, !!f && !x);
  }
  function Rr() {
    Re.current || (Bc() ? (Re.current = !0, window.history.back()) : fr(""));
  }
  function At() {
    const f = Re.current;
    Re.current = !1;
    let q = hs();
    q && !fe.current && !D.current.some((_) => _.id === q) && (q = "", gi(""));
    const O = G.current;
    q !== O && (Jt(0), f || Te(null), !q && O && (Fe.current ?? (Fe.current = { reviewId: O }))), F(q);
  }
  function $r() {
    Fe.current = "heading", Te(null), Rr();
  }
  function ei(f) {
    f !== y && fr(f), Jt((q) => q + 1);
  }
  function Xc() {
    Te(null), Mt({
      review: Hc("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function Zc(f) {
    if (Tt || !L) return;
    Te(null);
    const q = crypto.randomUUID();
    let O;
    const _ = y;
    An(!0);
    try {
      if (!await Xr((J) => (O = nd(
        J.find((ie) => ie.id === f.id) ?? f,
        J,
        q
      ), [...J, O]))) throw new Error("Could not save reviews.");
      if (!se.current) return;
      G.current !== _ ? Te({ text: `Saved the copy “${O.name}”.`, alert: !1 }) : ei(O.id);
    } catch (X) {
      Te({
        text: `“${f.name}” was not duplicated. ${Ea(X)}`,
        alert: !0
      });
    } finally {
      An(!1);
    }
  }
  async function el() {
    if (!ut || ut.saving) return;
    const f = { ...ut.review, name: ut.review.name.trim() }, q = sa(f);
    if (q) {
      Mt({ ...ut, error: q });
      return;
    }
    Mt({ ...ut, saving: !0, error: "" });
    try {
      if (!await Xr((O) => [...O, f]))
        throw new Error("Could not save reviews.");
      if (!se.current) return;
      Mt(null), ei(f.id);
    } catch (O) {
      Mt(
        (_) => _ && {
          ..._,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (O instanceof Error ? O.message : "Retry saving.")
        }
      );
    }
  }
  async function tl() {
    if (!ht || ht.pending) return;
    const f = ht.review, q = Wc(t, W, we, Ve).map((X) => X.id), O = q.filter((X) => X !== f.id), _ = O[Math.min(q.indexOf(f.id), O.length - 1)];
    zt({ review: f, pending: !0 });
    try {
      if (!await Xr((X) => X.filter((J) => J.id !== f.id)))
        throw new Error("Could not save reviews.");
      Fe.current = f.id !== y && _ ? { reviewId: _ } : "heading", Te({ text: `Deleted “${f.name}”.`, alert: !1 });
    } catch (X) {
      Te({ text: `“${f.name}” was not deleted. ${Ea(X)}`, alert: !0 });
    } finally {
      zt(null);
    }
  }
  async function nl(f) {
    if (!(Tt || !L)) {
      Te(null), Vt(!0);
      try {
        const q = await Bu(f);
        let O = 0;
        if (q.length && !await Xr((X) => {
          const J = bi(X, q);
          return O = J.length - X.length, O ? J : X;
        }))
          throw new Error("Could not save reviews.");
        const _ = q.length - O;
        Te({
          alert: !1,
          text: q.length ? O ? `Imported ${O === 1 ? "1 review" : `${O} reviews`}.` + (_ === 1 ? " 1 review already in the list stays as it is." : _ ? ` ${_} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (q) {
        Te({ alert: !0, text: `Could not import “${f.name}”. ${Ea(q)}` });
      } finally {
        Vt(!1);
      }
    }
  }
  function Ea(f) {
    return f instanceof Ls ? "Reviews changed in another browser. Reload the page to get them, then try again." : f instanceof Error ? f.message : "Try again.";
  }
  function qo(f) {
    const q = !L || Tt;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ r(ks, { "aria-hidden": "true" }),
        disabled: q,
        onSelect: () => void Zc(f)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ r(Rs, { "aria-hidden": "true" }),
        onSelect: () => uo(f)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ r(Ki, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: q,
        onSelect: () => {
          Te(null), zt({ review: f, pending: !1 });
        }
      }
    ];
  }
  function So(f, q) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ r(Dr, { "aria-hidden": "true" }),
        ...q,
        disabled: q.disabled || Me
      },
      ...qo(f),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ r(fa, { "aria-hidden": "true" }),
        separated: !0,
        disabled: Me,
        onSelect: $r
      }
    ];
  }
  async function Xr(f) {
    if (!i) return !1;
    let q = [];
    const O = await gd(i, (ie) => {
      q = ie;
      const vt = f(ie);
      return vt === ie ? ie : vt.map(gh);
    });
    if (n(O), !se.current) return !0;
    const _ = G.current;
    _ && !O.some((ie) => ie.id === _) && Rr();
    const X = q.find((ie) => ie.id === _), J = O.find((ie) => ie.id === _);
    return J && X && ((J.view.reviewMode ?? "single") !== (X.view.reviewMode ?? "single") && et(null), J.view.displayMode !== X.view.displayMode && Sr(us(J))), !0;
  }
  function ti(f) {
    return Xr((q) => mh(q, f));
  }
  function rl(f) {
    return ti(f).catch((q) => {
      throw G.current !== f.id && ni(f, q), q;
    });
  }
  function ni(f, q) {
    var _;
    if (!se.current) return;
    const O = ((_ = D.current.find((X) => X.id === f.id)) == null ? void 0 : _.name) ?? f.name;
    Te({ text: `“${O}” was not saved. ${Ea(q)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ r(ms, { label: "Loading reviews…" });
  if (u)
    return /* @__PURE__ */ l(ye, { children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          onClick: () => void Nh().catch(
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
  const ri = /* @__PURE__ */ l(ye, { children: [
    oe && /* @__PURE__ */ r("p", { className: "dq-status", children: oe }),
    tt && (_e == null ? void 0 : _e.kind) === "missing" && /* @__PURE__ */ l("div", { role: "status", className: "dq-status", children: [
      _e.message,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: ar,
          onClick: () => {
            ir(!0), Cr(""), (Rt ? $d(pt) : Rd(pt)).then(h).catch(
              (f) => Cr(
                `Could not create the ${Rt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (f instanceof Error ? f.message : "Request failed.")
              )
            ).finally(() => ir(!1));
          },
          children: ar ? "Setting up…" : "Set up tag assessments"
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
          disabled: ar,
          onClick: () => {
            ir(!0), h().finally(
              () => ir(!1)
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
            const f = localStorage.getItem("page-videos") ?? "[]", q = URL.createObjectURL(
              new Blob([f], { type: "application/json" })
            ), O = document.createElement("a");
            O.href = q, O.download = "data-quality-unassigned-legacy-reviews.json", O.click(), URL.revokeObjectURL(q);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    B && /* @__PURE__ */ l("p", { role: "alert", children: [
      B,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => {
            k(""), z(!1);
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
      className: `data-quality-page${sr ? " dq-page-fit" : ""}`,
      style: sr ? {
        "--dq-fit-top": `${cr.top}px`,
        "--dq-fit-bottom": `${cr.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: it && !it.alert ? it.text : "" }),
        x && st ? /* @__PURE__ */ r(
          Zf,
          {
            review: ce ?? x,
            canWrite: _n ? w : Yt,
            canAssess: (_e == null ? void 0 : _e.kind) === "ready" && Yt,
            onBusy: ft,
            editRequest: Tn,
            onEditRequestHandled: () => Jt(0),
            onSaveDefaults: L ? rl : void 0,
            pageControls: {
              onBack: $r,
              moreItems: (f) => So(ce ?? x, f),
              onGrid: pe ? () => et({ id: pe.id, mode: "multiple" }) : void 0,
              notices: ri,
              busy: Me
            },
            stayOnTap: Ft,
            onStayOnTapChange: mn
          },
          x.id
        ) : x ? fl(x) : /* @__PURE__ */ r(
          ah,
          {
            reviews: t,
            counts: W,
            sort: we,
            direction: Ve,
            onSortChange: (f) => Et({ sort: f }),
            onDirectionChange: (f) => Et({ direction: f }),
            storage: oh[te],
            canConfigure: L,
            busy: Tt,
            headingRef: pn,
            notices: ri,
            onOpen: fr,
            onNew: () => Xc(),
            onImport: (f) => void nl(f),
            onExportAll: () => Sc(t, "data-quality-reviews.json"),
            rowMenuItems: (f) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ r(Dr, { "aria-hidden": "true" }),
                disabled: !L || Tt,
                onSelect: () => ei(f.id)
              },
              ...qo(f)
            ]
          }
        ),
        yt && de && pe && /* @__PURE__ */ r(
          vh,
          {
            video: de,
            review: pe,
            selectedCount: St.size,
            pending: Le,
            refreshing: ve || !!qe,
            error: sn,
            canWrite: d,
            assessmentReady: (_e == null ? void 0 : _e.kind) === "ready",
            trees: Kn,
            selected: St.has(de.id),
            hasPrevious: $.indexOf(de.id) > 0,
            hasNext: $.indexOf(de.id) >= 0 && $.indexOf(de.id) < $.length - 1,
            onToggleSelected: () => wt((f) => xa(f, de.id)),
            onPrevious: () => lt(-1),
            onNext: () => lt(1),
            onClose: () => {
              _t(!1), Ke(bt.current);
            },
            onAction: Be,
            findOpen: nr,
            onFindOpenChange: an
          }
        ),
        nr && x && !st && !yt && /* @__PURE__ */ r(
          co,
          {
            actions: x.actions,
            tagGroups: T,
            trees: Kn,
            isDisabled: ka,
            canStay: !1,
            onApply: (f) => {
              an(!1), Be(f);
            },
            onClose: () => an(!1)
          }
        ),
        ut && /* @__PURE__ */ r(
          ih,
          {
            draft: ut,
            onChange: (f) => Mt((q) => q && { ...q, review: f, error: "" }),
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
  async function Ca(f, q, O = !1, _ = !0) {
    const X = bt.current, J = Math.max(0, $.indexOf(X ?? -1));
    try {
      const ie = E(
        f,
        q,
        O,
        f.view.selectAllOnLoad === !0
      ), vt = $t.current, Ge = await ie;
      if (vt !== $t.current) return;
      const Je = Ge.items.map((We) => We.id);
      Xt(
        (We) => new Set([...We].filter((Bn) => Je.includes(Bn)))
      );
      const ke = Oo(Je, X, J);
      nt(ke), _ && !jt.current && Ke(ke, !1);
    } catch {
    }
  }
  function al(f) {
    const q = gn.current;
    if (gn.current = null, Yr || !x || !ce) return;
    const O = q ?? x.view.objectFilter, _ = vr(
      O,
      ce.view.objectFilter
    ) ? ce.view.objectFilter : O, X = Kt({ ...f, page: 1 }), J = {
      ...x,
      view: {
        ...x.view,
        filter: X,
        objectFilter: _
      }
    }, ie = !ds(J, ce), vt = ie ? J : ce;
    It(ie ? J : null), on(ie ? "" : "Review queue defaults restored."), Ca(vt, X, !0);
  }
  function il() {
    if (Le || ve || Ut || !ce) return;
    gn.current = null;
    const f = Kt({
      ...ce.view.filter,
      page: 1
    });
    It(null), on("Review queue defaults restored."), Ca(
      ce,
      f,
      ce.view.startFrom !== "beginning",
      !1
    );
  }
  function ol() {
    if (Le || ve || qe || Ut || !x || !dr || !L)
      return;
    const f = x, q = dr;
    Er(!0), ti(q).then((O) => {
      !O || G.current !== q.id || (It(ls(q, f)), on("Queue saved to this review."));
    }).catch((O) => {
      G.current !== q.id ? ni(q, O) : vn(O instanceof Error ? O.message : "Could not save queue.");
    }).finally(() => Er(!1));
  }
  function ai() {
    if (!x || !ce || wn.current || Ne || yn) return;
    Dn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, ot.current = {
      temporaryReview: xe,
      filter: C,
      loadedFilter: Y,
      queue: le,
      queueError: qe,
      retryFromEnd: Kr,
      selectedIds: new Set(St),
      focusedId: De,
      pageCursor: Gn.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const f = structuredClone({
      ...ce,
      view: { ...ce.view, startFrom: x.view.startFrom ?? "end" }
    });
    an(!1), _t(!1), on(""), vn(""), Ct({ draft: f, saving: !1, error: "" });
  }
  function ko() {
    Ct(null), ot.current = null;
    const f = Dn.current;
    Dn.current = null, requestAnimationFrame(() => {
      (f == null ? void 0 : f.isConnected) && f !== document.body && !(f instanceof HTMLButtonElement && f.disabled) ? f.focus({ preventScroll: !0 }) : Ke(bt.current, !1);
    });
  }
  function sl() {
    var q;
    if (!Ne || Ne.saving) return;
    const f = ot.current;
    f && ($t.current += 1, (q = lr.current) == null || q.abort(), gn.current = null, Se(!1), It(f.temporaryReview), P(f.filter), be(f.loadedFilter), $e(f.queue), Dt(f.queueError), Br(f.retryFromEnd), wt(() => f.selectedIds), nt(f.focusedId), Gn.current = f.pageCursor, window.history.replaceState(window.history.state, "", f.url)), ko();
  }
  async function cl() {
    if (!Ne || Ne.saving || !ln || !x) return;
    const f = x, q = { ...ln, name: ln.name.trim() }, O = sa(q);
    if (O) {
      Ct((_) => _ && { ..._, error: O });
      return;
    }
    Ct((_) => _ && { ..._, saving: !0, error: "" });
    try {
      if (!await ti(q)) throw new Error("Could not save reviews.");
      if (!se.current || G.current !== q.id) return;
      It(ls(q, f)), je(q) === "video" && ra(q.id, {
        filter: C,
        objectFilter: f.view.objectFilter,
        searchMode: q.view.searchMode,
        startFrom: q.view.startFrom ?? "end"
      }), on("Review saved."), ko();
    } catch (_) {
      if (G.current !== q.id) {
        ni(q, _);
        return;
      }
      Ct(
        (X) => X && {
          ...X,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (_ instanceof Error ? _.message : "Retry saving.")
        }
      );
    }
  }
  function Eo() {
    x && E(x, C, Kr, bn).catch(() => {
    });
  }
  function ll() {
    Xt(/* @__PURE__ */ new Set()), gt.current.clear(), nt(null);
  }
  function dl(f) {
    !x || Le || Ut || f === Number(C.page) || ph(
      { ...C, page: f },
      x,
      (q, O) => E(q, O, !1, bn),
      ll
    );
  }
  function ul(f) {
    if (!pe || !ce || Le || ve || Ut) return;
    const q = Vf(pe, f, ce.view.objectFilter), O = !ds(q, ce);
    It(O ? q : null), O ? Ca(q, { ...C, page: 1 }) : Ca(
      ce,
      { ...C, page: 1 },
      ce.view.startFrom !== "beginning"
    );
  }
  function fl(f) {
    var Ge, Je;
    const q = Ce === "tag", O = q ? "tag" : "video", _ = Math.max(1, Number(C.perPage) || 40), X = Math.max(1, Math.ceil(le.totalCount / _)), J = Math.min(Math.max(1, Number(C.page) || 1), X), ie = [
      Pt ? "" : `${Un} write permission is required to apply actions.`,
      q && j ? `Tag groups are unavailable. ${j}` : ""
    ].filter(Boolean), vt = !!sn && !yt;
    return /* @__PURE__ */ l(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": q ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ r(
            Cc,
            {
              name: f.name,
              description: f.description,
              entityType: Ce,
              onBack: $r,
              backDisabled: Le || !!Ne || Me,
              onEdit: Ne ? () => {
                var ke;
                return (ke = Wt.current) == null ? void 0 : ke.focus();
              } : ai,
              editDisabled: !Ne && (Le || ve || In || yn || Me || !L),
              editing: !!Ne,
              toolbar: /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: Yr, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: q ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ r(
                  aa,
                  {
                    filter: qe ? Y : C,
                    onFilterChange: al,
                    totalCount: le.totalCount,
                    sortOptions: q ? Rl : ws,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Zt,
                    zoomLevel: (kr - 225) / 50,
                    onZoomChange: (ke) => ya(Math.round(225 + ke * 50)),
                    cardSizeEntityType: q ? "tags" : "videos",
                    criteriaDefinitions: q ? Il : Ui,
                    customFieldEntityType: Ce === "video" ? "video" : void 0,
                    objectFilter: Za,
                    onObjectFilterChange: (ke) => {
                      Yr || (gn.current = Ce === "video" ? Ic(
                        ke,
                        zr,
                        f.view.objectFilter
                      ) : ke);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(Ac, { page: J, pages: X, onPage: dl })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ l(ye, { children: [
                pe && /* @__PURE__ */ r(
                  Tc,
                  {
                    mode: "multiple",
                    disabled: Le || ve || qt || !!Ne || yn || Me,
                    onChange: () => et({ id: pe.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ r(
                  nf,
                  {
                    options: q ? dh : lh,
                    value: Zt,
                    onChange: (ke) => Sr(fs(ke, Ce))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ r(
                fo,
                {
                  disabled: Le || !!Ne,
                  items: So(ce ?? f, {
                    onSelect: ai,
                    disabled: ve || In || yn || !L
                  })
                }
              ),
              queueDiffers: Q ? (xe == null ? void 0 : xe.id) === y : void 0,
              queueChange: !Ne && (xe == null ? void 0 : xe.id) === y ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: Hr ? ol : void 0,
                saveDisabled: Le || ve || !!qe || Ut || !L,
                onReset: il,
                resetDisabled: Le || ve || Ut
              } : void 0,
              chipsAfter: (Je = (Ge = pe == null ? void 0 : pe.presentation) == null ? void 0 : Ge.binParents) != null && Je.length ? /* @__PURE__ */ r(
                Kf,
                {
                  videos: le.items,
                  review: pe,
                  savedObjectFilter: (ce ?? pe).view.objectFilter,
                  trees: nn.ids,
                  disabled: Le || ve || Ut,
                  onToggle: ul
                }
              ) : void 0,
              chipsEnd: Ne ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          ri,
          pe && nn.error && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: nn.error }),
          /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
            Ne && ln && /* @__PURE__ */ r(
              Ec,
              {
                drawerRef: Wt,
                draft: ln,
                onChange: (ke) => Ct((We) => We && { ...We, draft: ke }),
                direction: Ne.draft.view.startFrom ?? "end",
                onDirectionChange: (ke) => Ct(
                  (We) => We && {
                    ...We,
                    draft: { ...We.draft, view: { ...We.draft.view, startFrom: ke } }
                  }
                ),
                tagGroups: T,
                trees: Kn,
                saving: Ne.saving,
                saveDisabled: ve || !!qe,
                error: Ne.error,
                dirty: qa,
                criteriaChanged: Hr,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  qe && !ve ? /* @__PURE__ */ l("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ r(On, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { children: [
                      "The queue could not load: ",
                      qe,
                      " ",
                      /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", onClick: Eo, children: "Retry" })
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
                    ve && !le.items.length && /* @__PURE__ */ r(ms, { label: "Loading review queue…" }),
                    qe && !ve && /* @__PURE__ */ r(
                      gs,
                      {
                        message: qe,
                        retryLabel: In ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (In && ce && je(ce) === "video") {
                            const ke = Nr(ce);
                            ra(ce.id, { ...ke, filter: { ...ke.filter, page: void 0 } }), xt((We) => We + 1);
                            return;
                          }
                          Eo();
                        }
                      }
                    ),
                    !Le && !ve && !qe && !le.items.length && /* @__PURE__ */ l("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ r(za, {}),
                      /* @__PURE__ */ l("p", { children: [
                        "No ",
                        O,
                        "s match this review."
                      ] })
                    ] }),
                    !!le.items.length && /* @__PURE__ */ r("div", { ref: Jr, children: /* @__PURE__ */ r(
                      "div",
                      {
                        className: Zt === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${kr}px` },
                        children: le.items.map(hl)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ r("div", { className: "dq-bar-dock", ref: Wr, children: /* @__PURE__ */ r(
                    mc,
                    {
                      actions: Ne ? Ne.draft.actions : f.actions,
                      tagGroups: T,
                      trees: Kn,
                      isDisabled: ka,
                      paused: !!Ne,
                      busy: Le || ve,
                      onApply: (ke) => void Be(ke),
                      onFind: () => an(!0),
                      status: Le ? `Applying action to ${wa}…` : "",
                      summary: /* @__PURE__ */ l(ye, { children: [
                        /* @__PURE__ */ r("p", { className: "dq-bar-target", children: St.size ? `${St.size} selected` : De == null ? "Nothing to apply to" : `Applies to the focused ${O}` }),
                        /* @__PURE__ */ l(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !$.length || Ot,
                            onClick: () => wt((ke) => /* @__PURE__ */ new Set([...ke, ...$])),
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
                      keyHints: q ? "Arrows move · Space selects · Enter opens" : Ne ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews",
                      notices: vt || rt ? /* @__PURE__ */ l(ye, { children: [
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
  function hl(f) {
    var O, _, X;
    if (Ce === "tag") {
      const J = f;
      return /* @__PURE__ */ r(
        bh,
        {
          tag: J,
          displayMode: Zt === "list" ? "list" : "grid",
          focused: J.id === De,
          selected: St.has(J.id),
          setRef: (ie) => {
            ie ? or.current.set(J.id, ie) : or.current.delete(J.id);
          },
          onFocus: () => nt(J.id),
          onToggle: () => {
            wt((ie) => xa(ie, J.id)), Ke(J.id, !1);
          },
          onOpen: () => window.open(`/tag/${J.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        J.id
      );
    }
    const q = f;
    return /* @__PURE__ */ r(
      yh,
      {
        video: Gf(q, pe, nn.ids),
        showTagBins: ((_ = (O = pe == null ? void 0 : pe.presentation) == null ? void 0 : O.annotations) == null ? void 0 : _.includes("tags")) && !!((X = pe.presentation.annotationParents) != null && X.length),
        displayMode: Zt,
        cardsScroll: Ya,
        focused: q.id === De,
        selected: St.has(q.id),
        setRef: (J) => {
          J ? or.current.set(q.id, J) : or.current.delete(q.id);
        },
        onFocus: () => nt(q.id),
        onToggle: () => wt((J) => xa(J, q.id)),
        onPreview: () => {
          Ne || (nt(q.id), _t(!0));
        },
        onNavigate: e
      },
      q.id
    );
  }
}
function ph(e, t, n, a) {
  a(), n(t, e).catch(() => {
  });
}
function xa(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function mh(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function gh(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function bh({
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
function yh({
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
  var N, v;
  const g = Qc(e), m = R(null), b = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, w = !!(b.date || b.studioName), S = !!(b.performers.length || b.tags.length);
  return kt(() => {
    const T = m.current;
    if (!T) return;
    const M = T.querySelector(
      `a[href="/video/${e.id}"]`
    ), j = T.querySelector(".card-title"), K = `dq-card-title-${e.id}`;
    j && (j.id = K), M && (M.target = "_blank", M.rel = "noreferrer", M.removeAttribute("aria-label"), M.setAttribute("aria-labelledby", K), M.classList.add("dq-card-link"));
    const L = T.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    L && L.setAttribute(
      "aria-label",
      o ? `Deselect ${g}` : `Select ${g}`
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
      "aria-current": i ? "true" : void 0,
      "aria-label": `${g}${o ? ", selected" : ""}`,
      onFocus: c,
      onClick: (T) => {
        c(), T.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${w ? "has-card-metadata" : "no-card-metadata"} ${S ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ r(
          Ol,
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
          (N = e.tags) == null ? void 0 : N.map((T) => /* @__PURE__ */ r("span", { children: T.name }, T.id)),
          !((v = e.tags) != null && v.length) && /* @__PURE__ */ r("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ r(wh, { video: e, cardsScroll: a })
      ]
    }
  );
}
function wh({ video: e, cardsScroll: t }) {
  const n = R(null), a = R(null), [i, o] = A(!1), [s, c] = A(!1), [u, p] = A(!1);
  return H(() => {
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
  }, [e.id, e.files.length, t]), H(() => {
    if (!i) {
      p(!1);
      return;
    }
    const d = new AbortController();
    return he(Ad(e.id), {
      signal: d.signal
    }).then((g) => {
      d.signal.aborted || p(g.available === !0);
    }).catch(() => {
      d.signal.aborted || p(!1);
    }), () => d.abort();
  }, [i, e.id]), H(() => {
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
function vh({
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
  onClose: S,
  onAction: N,
  findOpen: v,
  onFindOpenChange: T
}) {
  const M = R(null), j = ga(), K = R(null), L = e.files[0], ee = Qc(e), te = (k) => a || i || "steps" in k && k.steps.length > 0 && !s || Qn(k) && !c;
  io({
    surface: "overlay",
    enabled: !v,
    actions: t.actions,
    onAction: (k) => {
      const I = t.actions[k];
      I && N(I);
    },
    onFind: () => T(!0)
  }), H(() => {
    var I;
    const k = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (I = M.current) == null || I.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = k;
    };
  }, []);
  function Z(k) {
    var Q, ae, re;
    if (k.key !== "Tab") return;
    const I = [
      ...((Q = M.current) == null ? void 0 : Q.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((V) => V.offsetParent !== null);
    if (!I.length) {
      k.preventDefault(), (ae = M.current) == null || ae.focus();
      return;
    }
    const z = I.indexOf(
      document.activeElement
    );
    k.shiftKey && z <= 0 ? (k.preventDefault(), (re = I.at(-1)) == null || re.focus()) : !k.shiftKey && z === I.length - 1 && (k.preventDefault(), I[0].focus());
  }
  function oe(k) {
    if (v || k.defaultPrevented || k.ctrlKey || k.metaKey || k.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const I = k.key === "ArrowLeft" || k.key === "ArrowRight";
    if (k.altKey && !I) return;
    const z = K.current, Q = k.currentTarget.querySelector("video");
    if (k.key === "Enter" || k.key === "Escape")
      k.repeat || S();
    else if (k.key === " " && z)
      k.repeat || z.toggle();
    else if (I && z)
      z.seekBy(
        (k.key === "ArrowLeft" ? -1 : 1) * (k.shiftKey ? 5 : k.altKey ? 10 : 60)
      );
    else if ((k.key === "," || k.key === ".") && z) {
      const ae = [L == null ? void 0 : L.duration, Q == null ? void 0 : Q.duration].find(
        (V) => V != null && Number.isFinite(V) && V > 0
      ) ?? 0, re = e.parentVideoId != null ? (e.clipEndSec ?? ae) - (e.clipStartSec ?? 0) : ae;
      Number.isFinite(re) && re > 0 && z.seekBy((k.key === "," ? -1 : 1) * re * 0.1);
    } else if (k.key.toLowerCase() === "n" || k.key.toLowerCase() === "m")
      !k.repeat && !a && !i && (k.key.toLowerCase() === "n" && d && b(), k.key.toLowerCase() === "m" && g && w());
    else if (k.key === "ArrowUp" && Q)
      Q.volume = Math.min(1, Q.volume + 0.1);
    else if (k.key === "ArrowDown" && Q)
      Q.volume = Math.max(0, Q.volume - 0.1);
    else return;
    Fr(k);
  }
  function U(k) {
    const I = M.current, z = k.target instanceof Element ? k.target.closest("button, a[href]") : null;
    !I || !z || !I.contains(z) || z.closest(".dq-player, .dq-find-action") || k.detail === 0 || I.focus({ preventScroll: !0 });
  }
  H(() => {
    if (v) return;
    let k = 0;
    const I = requestAnimationFrame(() => {
      k = requestAnimationFrame(() => {
        var Q;
        const z = document.activeElement;
        (Q = M.current) != null && Q.isConnected && (!z || z === document.body || z === document.documentElement) && M.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(I), cancelAnimationFrame(k);
    };
  }, [v, a, i, g, d, e.id, j]);
  const B = n ? `the ${n} selected video${n === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ l(
    "div",
    {
      ref: M,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${ee}`,
      className: `dq-preview${j ? " dq-preview-mobile" : ""}`,
      onKeyDown: Z,
      onKeyDownCapture: oe,
      onMouseDown: (k) => {
        k.target === k.currentTarget && S();
      },
      onClick: U,
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
                  /* @__PURE__ */ r(fa, { "aria-hidden": "true" }),
                  !j && /* @__PURE__ */ r(dt, { binding: "n", hidden: !0 })
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
                  !j && /* @__PURE__ */ r(dt, { binding: "m", hidden: !0 }),
                  /* @__PURE__ */ r(Ts, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ l("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ r("h2", { children: ee }),
              /* @__PURE__ */ l("p", { children: [
                "Actions apply to ",
                B
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
                onClick: S,
                children: /* @__PURE__ */ r(ua, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ r("div", { className: "dq-preview-video", children: L ? /* @__PURE__ */ r(
            vs,
            {
              autostart: !0,
              streamUrl: qi("video", e.id),
              posterUrl: Lo(e),
              format: L.format,
              audioCodec: L.audioCodec,
              duration: L.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onPlaybackControlRegister: (k) => (K.current = k, () => {
                K.current === k && (K.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ r("img", { src: Lo(e), alt: "" }) }) }),
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
            mc,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: u,
              isDisabled: te,
              busy: a || i,
              onApply: (k) => void N(k),
              onFind: () => T(!0),
              status: a ? `Applying action to ${B}…` : "",
              summary: /* @__PURE__ */ r("p", { className: "dq-bar-target", children: n ? `${n} selected` : "This video" })
            }
          )
        ] }),
        v && /* @__PURE__ */ r(
          co,
          {
            actions: t.actions,
            trees: u,
            isDisabled: te,
            canStay: !1,
            onApply: (k) => {
              T(!1), N(k);
            },
            onClose: () => T(!1)
          }
        )
      ]
    }
  );
}
async function Nh() {
  const e = await he("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
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
    /* @__PURE__ */ r(On, {}),
    /* @__PURE__ */ r("p", { children: e }),
    /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const Th = { components: { DataQualityPage: hh } };
export {
  hh as DataQualityPage,
  Th as default,
  vr as objectFiltersEqual
};
