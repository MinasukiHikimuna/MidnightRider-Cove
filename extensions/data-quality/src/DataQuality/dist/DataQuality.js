import { jsxs as c, Fragment as he, jsx as r } from "react/jsx-runtime";
import { useRef as I, useLayoutEffect as sn, useMemo as Ne, useState as S, useEffect as J, useId as xt, useSyncExternalStore as wo, Fragment as Ja, createContext as rc, useContext as ac, useCallback as Sn } from "react";
import { useKeySequence as ic, EntityReferenceMultiSelector as Cn, SortableList as yo, EntityDetailTabs as oc, TagBadge as sc, DetailListToolbar as Ar, PERFORMER_CRITERIA as za, AUDIO_CRITERIA as vo, VIDEO_CRITERIA as Qa, NarrativeText as cc, AUDIO_SORT_OPTIONS as lc, VIDEO_SORT_OPTIONS as No, AudioPlayer as dc, VideoPlayer as qo, formatDuration as So, FilterDialog as uc, getResolutionLabel as fc, ConfirmDialog as hc, TAG_CRITERIA as pc, TAG_SORT_OPTIONS as mc, TagTile as gc, VideoCard as bc } from "@cove/runtime/components";
import { Search as ia, Pencil as ur, Ban as $a, Pin as wc, Plus as Wa, GripVertical as Eo, AlertTriangle as Jn, Copy as Co, Trash2 as Ao, ChevronDown as ko, X as Ir, Mic as yc, Users as To, Tag as Ro, Headphones as Io, Film as oa, ChevronLeft as $r, RectangleHorizontal as vc, LayoutGrid as Ha, MoreHorizontal as Nc, ChevronRight as $o, Layers as Pi, Check as Ya, Undo2 as qc, Flag as Zr, RefreshCw as Sc, Save as Oo, RotateCcw as Fo, ExternalLink as Mo, SkipForward as Ec, Upload as Cc, Download as xo, ArrowUp as Ac, ArrowDown as kc, Loader2 as Tc, List as Rc, Grid3X3 as Ic } from "@cove/runtime/lucide-react";
import { extensionFetch as $c } from "@cove/runtime/api";
const Xa = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, Za = Object.keys(
  Xa
);
function kr(e) {
  return e === "excludes" || e === "excludesAll";
}
function ei(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
const Po = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function ve(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function ti(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function Te(e) {
  return ti(Oe(e));
}
function Oc(e) {
  return Oe(e) === "video";
}
function Oe(e) {
  return e.entityType ?? "video";
}
const fr = [
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
];
function Tr(e) {
  return ve(e) && !Lo(e.occurrence) ? "Complete the optional occurrence condition before saving." : !Oc(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Oe(e) !== "tag" && e.actions.some(
    (t) => ni(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => An(t, Oe(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const Fc = {
  video: 1e3,
  audio: 250
};
function Mt(e, t = "video") {
  const n = (a, i) => Number.isFinite(Number(a)) && Number(a) > 0 ? Math.floor(Number(a)) : i;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(Fc[t], n(e.perPage, 40))
    )
  };
}
function Li(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function Ln(e) {
  const { page: t, ...n } = e.view.filter, a = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    ve(e) ? [e.entityType, ...a, e.occurrence] : Oe(e) === "video" ? a : [Oe(e), ...a]
  );
}
function An(e, t) {
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
  ) && !ni(e) : !1;
}
function Mc(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function En(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function sa(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Dn(e) {
  return "steps" in e ? e.steps.some((t) => En(t.mode)) : !1;
}
function ni(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (En(n.mode))
      for (const a of n.tagIds) {
        const i = t.get(a);
        if (i && i !== n.mode) return !0;
        t.set(a, n.mode);
      }
  return !1;
}
function Or(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || Po.includes(n.entityType)) && (!Mc(n.entityType) || Lo(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && xc(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (a) => typeof a == "string"
    )) && Array.isArray(n.actions) && n.actions.every(
      (a) => typeof (a == null ? void 0 : a.id) == "string" && typeof a.label == "string" && (a.shortcut === void 0 || typeof a.shortcut == "string") && (n.entityType === "tag" ? "effect" in a && !("steps" in a) && An(a, "tag") : "steps" in a && !("effect" in a) && Array.isArray(a.steps) && a.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && An(a, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => Tr(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function xc(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (a) => ["date", "studio", "performers", "tags"].includes(a)
  )) && [n.annotationParents, n.binParents].every(
    (a) => a === void 0 || Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function Oa(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const a of e)
    for (const i of a)
      n.has(i.id) || (n.add(i.id), t.push(i));
  return t;
}
function Lo(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (a) => Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(a).size === a.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && Za.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function Di(e, t) {
  return e.size > 0 ? [...e].sort((n, a) => n - a) : t == null ? [] : [t];
}
function _i(e, t, n, a) {
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
function Pc(e, t) {
  const n = new Set(e), a = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    a ? n.delete(i) : n.add(i);
  return n;
}
function Lc(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function Dc(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function _c(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function jc(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Uc(e, t) {
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
const Do = "ext:com.midnightrider.data-quality:configuration", Gc = "ext:cove-data-quality:video-reviews", Fa = "ext:com.midnightrider.data-quality:progress";
class _o extends Error {
}
const Fr = /* @__PURE__ */ new Map(), Jr = /* @__PURE__ */ new Map(), Vn = (e, t) => e.includes("*") || e.includes(t), ea = (e) => ce(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Kc = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Ma(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function sr(e) {
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
    reviews: Or(JSON.stringify(t.reviews)),
    deletedIds: Ma(t.deletedIds),
    importedIds: Ma(t.importedIds)
  };
}
function Bc(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const a = /* @__PURE__ */ new Set();
  for (const i of t) {
    const o = localStorage.getItem(i);
    if (o !== null) {
      const s = Or(o);
      n ?? (n = s), s.forEach((l) => a.add(l.id));
    }
    Ma(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((s) => a.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...a],
    present: n !== void 0
  };
}
async function jo(e) {
  const t = await ce("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Uo(e, t) {
  const n = (Jr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Jr.set(e, n), n.finally(() => {
    Jr.get(e) === n && Jr.delete(e);
  }).catch(() => {
  }), n;
}
let Nr = null;
function Vc() {
  if (Nr) return Nr;
  const e = Jc();
  return Nr = e, e.finally(() => {
    Nr === e && (Nr = null);
  }).catch(() => {
  }), e;
}
async function Jc() {
  var m;
  const e = await ce("/api/auth/me"), t = String(e.user.id), n = `cove-data-quality-v2:${t}`, a = Vn(e.permissions, "savedfilters.read"), i = a && Vn(e.permissions, "savedfilters.write"), o = a ? (await ea(Do)).filter((w) => w.name === "Data Quality configuration").sort((w, y) => w.id - y.id) : [];
  if (o.length > 1) {
    const w = (y) => {
      const { revision: N, ...A } = sr(y.uiOptions);
      return JSON.stringify(A);
    };
    if (o.some((y) => w(y) !== w(o[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (i)
      for (const y of o.slice(1))
        await ce(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    o.splice(1);
  }
  let s = o.length ? sr(o[0].uiOptions) : Kc();
  const l = localStorage.getItem(`${n}:migrated`) === "true", d = localStorage.getItem(n), h = localStorage.getItem(`${n}:local-only`) === "true";
  !o.length && d && (s = sr(d));
  let p = !o.length;
  if (o.length && h && d) {
    const w = sr(d);
    if (w.reviews.some((N) => {
      const A = s.reviews.find((E) => E.id === N.id);
      return A && JSON.stringify(A) !== JSON.stringify(N);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const y = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...w.deletedIds])
    ];
    s = {
      ...s,
      reviews: Oa(s.reviews, w.reviews).filter(
        (N) => !y.includes(N.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...w.importedIds])
      ]
    }, p = !0;
  }
  if (!l) {
    const w = JSON.stringify(s), y = Bc(t);
    if (o.length && y.reviews.some((_) => {
      const O = s.reviews.find((k) => k.id === _.id);
      return O && JSON.stringify(O) !== JSON.stringify(_);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = a ? (await ea(Gc)).flatMap(
      (_) => Or(_.uiOptions ?? "[]")
    ) : [], A = y.known.filter(
      (_) => !y.reviews.some((O) => O.id === _)
    ), E = /* @__PURE__ */ new Set([...s.deletedIds, ...A]);
    s = {
      ...s,
      reviews: Oa(
        y.reviews,
        s.reviews,
        N.filter(
          (_) => !y.known.includes(_.id) && !s.importedIds.includes(_.id)
        )
      ).filter((_) => !E.has(_.id)),
      deletedIds: [...E],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...y.known,
          ...N.map((_) => _.id)
        ])
      ]
    }, p || (p = JSON.stringify(s) !== w);
  }
  const g = {
    userId: t,
    recordId: (m = o[0]) == null ? void 0 : m.id,
    config: s,
    readable: a,
    writable: i,
    durable: i
  };
  if (Fr.set(n, g), p && i) {
    const w = s;
    o.length && (g.config = sr(o[0].uiOptions)), await Go(n, w), s = g.config;
  } else o.length || (localStorage.setItem(n, JSON.stringify(s)), !a && (!l || h) && localStorage.setItem(`${n}:local-only`, "true"));
  if (!a) localStorage.setItem(`${n}:migrated`, "true");
  else if (i)
    try {
      localStorage.setItem(`${n}:migrated`, "true");
    } catch {
    }
  return {
    reviews: s.reviews,
    storageKey: n,
    canWrite: Vn(e.permissions, "videos.write"),
    canWriteVideos: Vn(e.permissions, "videos.write"),
    canWriteAudios: Vn(e.permissions, "audios.write"),
    canWriteTags: Vn(e.permissions, "tags.write"),
    canReadTagGroups: Vn(e.permissions, "taggroups.read"),
    canConfigure: !a || i,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: a ? i ? "account" : "readOnly" : "browser",
    storageNotice: a ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Go(e, t) {
  const n = Fr.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const a = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await jo(n), n.recordId != null) {
      const o = await ce(
        `/api/savedfilters/${n.recordId}`
      );
      if (sr(o.uiOptions).revision !== n.config.revision)
        throw new _o(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await ce(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Do,
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
function zc(e, t) {
  return Or(JSON.stringify(t)), Uo(e, async () => {
    const n = Fr.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const a = n.config.reviews.filter((i) => !t.some((o) => o.id === i.id)).map((i) => i.id);
    await Go(e, {
      ...n.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...a])
      ].filter((i) => !t.some((o) => o.id === i))
    });
  });
}
function ji(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, a]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(a)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Qc(e, t) {
  const n = Fr.get(e);
  if (!n) return null;
  const a = localStorage.getItem(`${e}:progress:${t}`), i = a ? ji(a) : null;
  if (!n.readable) return i;
  const o = (await ea(Fa)).find(
    (l) => l.name === t
  ), s = o ? ji(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function Wc(e, t, n) {
  const a = `${e}:progress:${t}`;
  try {
    localStorage.setItem(a, JSON.stringify(n));
  } catch {
  }
  return Uo(a, async () => {
    const i = Fr.get(e);
    if (!(i != null && i.writable)) return;
    await jo(i);
    const o = (await ea(Fa)).find(
      (s) => s.name === t
    );
    await ce(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Fa,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function _n(e) {
  return e === "audio" ? "audios" : "videos";
}
const Hc = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function cn(e) {
  return Hc[e];
}
const ta = "confirmed_absent_tags", ri = "Confirmed absent tags", ca = "confirmed_absent_occurrence_tags", Ko = {
  key: ta,
  label: ri,
  type: "tag",
  subject: "tag assessments"
}, ai = {
  key: ca,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, Yc = {
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
function kn(e) {
  return Array.isArray(e) ? e.map(kn) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Yc[n] ?? n : t === "key" && typeof n == "string" && [
        ta,
        ca
      ].includes(n.toLowerCase()) ? n.toLowerCase() : kn(n)
    ])
  ) : e;
}
async function Bo(e, t, n) {
  const a = new Headers(t.headers);
  !(t.body instanceof FormData) && !a.has("Content-Type") && a.set("Content-Type", "application/json");
  const i = await $c(e, { ...t, headers: a });
  if (i.status === 404 && n === "null") return null;
  if (!i.ok) {
    let s = i.statusText || `Request failed (${i.status}).`;
    try {
      const l = await i.json();
      s = l.message || l.detail || l.error || s;
    } catch {
    }
    throw new Error(s);
  }
  if (i.status === 204 || i.status === 205) return;
  const o = await i.text();
  return o ? JSON.parse(o) : void 0;
}
async function ce(e, t = {}) {
  return await Bo(e, t, "fail");
}
function Xc(e, t = {}) {
  return Bo(e, t, "null");
}
const Zc = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let el = 0;
function xa(e, t) {
  return ce(
    `/api/${_n(e)}/${t}?dqRead=${Zc}-${++el}`,
    { cache: "no-store" }
  );
}
function Vo(e, t) {
  const n = { ...e.view.objectFilter }, a = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    kn({
      findFilter: Mt(t, Te(e)),
      objectFilter: n,
      filterExpression: a
    })
  );
}
async function Er(e, t, n) {
  return ce(
    `/api/${_n(Te(e))}/find`,
    { method: "POST", signal: n, body: Vo(e, t) }
  );
}
async function tl(e, t, n) {
  return (await ce(
    `/api/${_n(Te(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Vo(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function Ui(e, t, n) {
  const a = { ...e.view.objectFilter };
  return delete a._filterExpression, ce("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      kn({
        findFilter: Mt(t),
        objectFilter: a
      })
    )
  });
}
function nl(e) {
  return ce("/api/taggroups", { signal: e });
}
function Pa(e, t, n = 1280) {
  return `/api/${_n(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function La(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Gi(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function rl(e) {
  return `/api/stream/video/${e}/preview`;
}
function al(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function il(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function la(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e) {
    await ce(`/api/tags/${a}`, { signal: t }), n.add(a);
    for (let i = 1; ; i++) {
      const o = await ce("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          kn({
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
async function ii(e, t) {
  const n = sa(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await la(i.tagIds, t)).filter(
          (o) => !n.has(o)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function ol(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function oi(e, t) {
  const a = (await ce("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!a)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = ol(e, a);
  return i ? { kind: "incompatible", message: i } : a.entityTypes.includes(t) ? { kind: "ready", definition: a, message: "" } : {
    kind: "missing",
    message: `Add ${cn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: a
  };
}
async function Jo(e, t) {
  const n = await oi(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await ce(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await ce("/api/custom-fields", {
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
function zo(e = "video") {
  return oi(Ko, e);
}
function sl(e = "video") {
  return Jo(Ko, e);
}
function Qo(e = "video") {
  return oi(ai, e);
}
function cl(e = "video") {
  return Jo(ai, e);
}
function na(e) {
  return [...new Set(e)];
}
function Wo(e, t) {
  const n = e.customFields ?? {}, a = Object.keys(n).find(
    (o) => o.toLowerCase() === ca
  ), i = a === void 0 ? [] : n[a];
  return na(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function ll(e) {
  let t;
  try {
    t = await Qo(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${ai.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function dl(e, t, n, a, i, o) {
  await ce(`/api/${_n(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: na(i).map((s) => `${a}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function ul(e, t, n) {
  const a = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${ri} custom field is not available.`
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
async function Ho(e, t, n) {
  if (!An(t) || n.length === 0 || n.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${cn(e).many} and configure a valid action first.`
    );
  let a = null;
  if (Dn(t)) {
    let d;
    try {
      d = await zo(e);
    } catch (h) {
      throw new Error(
        `Could not verify the ${ri} custom field. ${h instanceof Error ? h.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    a = d.definition.key;
  }
  const i = na(n), o = (await ii(t)).map((d) => ({
    mode: d.mode,
    tagIds: na(d.tagIds)
  })), l = [
    ...o.filter((d) => !En(d.mode)),
    ...o.filter((d) => En(d.mode))
  ].map(
    (d) => ul(d, i, a)
  );
  for (let d = 0; d < l.length; d++)
    try {
      await ce(`/api/${_n(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(l[d])
      });
    } catch (h) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${cn(e).many} before retrying. ${h instanceof Error ? h.message : "Request failed."}`
      );
    }
}
async function fl(e, t) {
  if (!An(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await ce("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const Yo = "-", hl = "Ctrl+a", pl = "Ctrl/⌘A";
function zr(e) {
  return (t) => {
    t != null && t.repeat || e();
  };
}
function si({
  surface: e,
  enabled: t,
  actionCount: n,
  onAction: a,
  onFind: i,
  onSelectAll: o
}) {
  const s = I({ onAction: a, onFind: i, onSelectAll: o });
  sn(() => {
    s.current = { onAction: a, onFind: i, onSelectAll: o };
  });
  const l = Math.max(0, Math.min(n, fr.length)), d = !!i && n > 0, h = e === "local" && !!o, p = Ne(() => {
    const g = [];
    return h && g.push({
      keys: hl,
      surface: "local",
      action: zr(() => {
        var m, w;
        return (w = (m = s.current).onSelectAll) == null ? void 0 : w.call(m);
      })
    }), d && g.push({
      keys: Yo,
      surface: e,
      action: zr(() => {
        var m, w;
        return (w = (m = s.current).onFind) == null ? void 0 : w.call(m);
      })
    }), fr.slice(0, l).forEach(
      (m, w) => g.push(
        {
          keys: m,
          surface: e,
          action: zr(() => s.current.onAction(w, !1))
        },
        {
          keys: `Shift+${m}`,
          surface: e,
          action: zr(() => s.current.onAction(w, !0))
        }
      )
    ), g;
  }, [e, l, d, h]);
  ic(p, t);
}
const ml = {
  action: (e) => fr[e] ?? "",
  find: Yo,
  selectAll: pl
};
function jn() {
  return ml;
}
const gl = 600 * 1e3, ci = /* @__PURE__ */ new Map(), Xo = /* @__PURE__ */ new Map(), Pn = /* @__PURE__ */ new Map();
function Zo(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = Xo.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function es(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && Xo.set(e.tagGroupId, e.tagGroupSortOrder), ci.set(e.id, { tag: e, at: Date.now() });
}
function ts(e) {
  const t = ci.get(e);
  if (!(!t || Date.now() - t.at > gl))
    return Zo(t.tag);
}
function ns(e) {
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
function Da(e) {
  var t;
  for (const n of e) {
    const a = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && a && es(ns({ ...n, name: a }));
  }
}
function bl(e) {
  const t = Pn.get(e);
  if (t) return t;
  const n = new AbortController(), a = {
    controller: n,
    waiters: 0,
    promise: ce(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var p, g;
        const o = ((p = i == null ? void 0 : i.name) == null ? void 0 : p.trim()) || null;
        if (Pn.get(e) === a && Pn.delete(e), !o) return null;
        const s = ns({ ...i, id: e, name: o }), l = (g = ci.get(e)) == null ? void 0 : g.tag, d = (l == null ? void 0 : l.tagGroupId) === s.tagGroupId, h = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (d ? l == null ? void 0 : l.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (l == null ? void 0 : l.hasImage),
          imagePath: s.imagePath ?? (l == null ? void 0 : l.imagePath)
        };
        return es(h), Zo(h);
      },
      () => (Pn.get(e) === a && Pn.delete(e), null)
    )
  };
  return Pn.set(e, a), a;
}
function Ki() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function qa(e) {
  const t = {};
  for (const n of e) {
    const a = ts(n);
    a !== void 0 && (t[n] = a);
  }
  return t;
}
function wl(e, t) {
  if (t != null && t.aborted) return Promise.reject(Ki());
  const n = {}, a = [];
  for (const i of new Set(e)) {
    const o = ts(i);
    if (o !== void 0) n[i] = o;
    else {
      const s = bl(i);
      s.waiters += 1, a.push({ id: i, entry: s });
    }
  }
  return a.length ? new Promise((i, o) => {
    let s = !1;
    const l = () => {
      for (const { id: h, entry: p } of a)
        p.waiters -= 1, p.waiters === 0 && Pn.get(h) === p && (Pn.delete(h), p.controller.abort());
    }, d = () => {
      s || (s = !0, l(), o(Ki()));
    };
    t == null || t.addEventListener("abort", d, { once: !0 }), Promise.all(
      a.map(
        ({ id: h, entry: p }) => p.promise.then((g) => [h, g])
      )
    ).then((h) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", d), l();
        for (const [p, g] of h) n[p] = g;
        i(n);
      }
    });
  }) : Promise.resolve(n);
}
function rs(e) {
  const t = {};
  for (const [n, a] of Object.entries(e)) t[Number(n)] = (a == null ? void 0 : a.name) ?? null;
  return t;
}
function li(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, a] = S(() => ({
    key: t,
    tags: qa(Sa(t))
  }));
  return J(() => {
    const i = Sa(t), o = qa(i);
    if (a({ key: t, tags: o }), i.every((l) => l in o)) return;
    const s = new AbortController();
    return wl(i, s.signal).then(
      (l) => a({ key: t, tags: l }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : qa(Sa(t));
}
function pr(e) {
  const t = li(e);
  return Ne(() => rs(t), [t]);
}
function Sa(e) {
  return e ? e.split(",").map(Number) : [];
}
function yl(e, t, n = !1) {
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
function Xn(e, t, n = [], a) {
  if ("effect" in e) {
    const s = e.effect;
    if (s.mode === "SKIP") return [{ text: "Skip", tone: "neutral" }];
    if (s.mode === "CLEAR_TAG_GROUP")
      return [{ text: "Set Ungrouped", tone: "neutral" }];
    const l = n.find((d) => d.id === s.tagGroupId);
    return [
      {
        text: l ? `Assign ${l.name}` : "Unavailable tag group",
        tone: "neutral"
      }
    ];
  }
  if (!e.steps.length) return [{ text: "Skip", tone: "neutral" }];
  const i = sa(e), o = (s) => i.has(s) || [...i].some((l) => {
    var d;
    return (d = a == null ? void 0 : a.get(s)) == null ? void 0 : d.includes(l);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (l) => yl(
        s.mode,
        t[l] === void 0 ? "…" : t[l] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && o(l)
      )
    )
  );
}
function da(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function di({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  canStay: i = !0,
  onApply: o,
  onClose: s
}) {
  const [l, d] = S(""), [h, p] = S(0), g = I(null), m = I(null), w = I(null), y = I(null), N = I(null), A = I(/* @__PURE__ */ new Set()), E = xt(), _ = pr(Ne(() => da(e), [e])), O = jn(), k = Ne(() => {
    const j = l.trim().toLocaleLowerCase();
    return e.map((G, Y) => ({ action: G, index: Y, key: O.action(Y) })).filter((G) => !j || G.action.label.toLocaleLowerCase().includes(j));
  }, [e, O, l]), P = k.length ? Math.min(h, k.length - 1) : -1, Q = (j) => `${E}-option-${j}`;
  sn(() => {
    var j, G, Y;
    return y.current = document.activeElement, N.current = ((G = (j = w.current) == null ? void 0 : j.parentElement) == null ? void 0 : G.closest('[role="dialog"]')) ?? null, (Y = g.current) == null || Y.focus({ preventScroll: !0 }), () => {
      var x;
      const C = y.current;
      C instanceof HTMLElement && C.isConnected && C.focus({ preventScroll: !0 }), document.activeElement !== C && ((x = N.current) != null && x.isConnected) && N.current.focus({ preventScroll: !0 });
    };
  }, []), J(() => {
    var j, G, Y;
    P < 0 || (Y = (G = (j = m.current) == null ? void 0 : j.querySelector(`[id="${Q(k[P].index)}"]`)) == null ? void 0 : G.scrollIntoView) == null || Y.call(G, { block: "nearest" });
  }, [P, k]);
  function te(j, G) {
    !j || a != null && a(j.action) || o(j.action, i && G);
  }
  function X(j) {
    var Y;
    j.stopPropagation();
    const G = j.code || j.key;
    if (j.repeat && !A.current.has(G)) {
      j.preventDefault();
      return;
    }
    if (j.repeat || A.current.add(G), j.key === "Escape")
      j.preventDefault(), s();
    else if (j.key === "Enter")
      j.preventDefault(), j.repeat || te(k[P], j.shiftKey);
    else if (j.key === "ArrowDown" || j.key === "ArrowUp") {
      if (j.preventDefault(), !k.length) return;
      const C = j.key === "ArrowDown" ? 1 : -1;
      p((P + C + k.length) % k.length);
    } else j.key === "Tab" && (j.preventDefault(), (Y = g.current) == null || Y.focus());
  }
  return /* @__PURE__ */ c(he, { children: [
    /* @__PURE__ */ r("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: s }),
    /* @__PURE__ */ c(
      "div",
      {
        ref: w,
        role: "dialog",
        "aria-label": "Find an action",
        className: "dq-find-action",
        onKeyDown: X,
        onMouseDown: (j) => {
          j.target !== g.current && j.preventDefault();
        },
        children: [
          /* @__PURE__ */ c("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ r(ia, { "aria-hidden": "true" }),
            /* @__PURE__ */ r(
              "input",
              {
                ref: g,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${E}-list`,
                "aria-activedescendant": P >= 0 ? Q(k[P].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: l,
                onChange: (j) => {
                  d(j.target.value), p(0);
                }
              }
            ),
            /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          k.length ? /* @__PURE__ */ r(
            "ul",
            {
              ref: m,
              id: `${E}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: k.map((j, G) => /* @__PURE__ */ r("li", { role: "none", children: /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: Q(j.index),
                  tabIndex: -1,
                  "aria-selected": G === P,
                  disabled: (a == null ? void 0 : a(j.action)) ?? !1,
                  onClick: (Y) => te(j, Y.shiftKey),
                  children: [
                    j.key ? /* @__PURE__ */ r("kbd", { children: j.key }) : /* @__PURE__ */ r("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ r("span", { className: "dq-find-label", children: j.action.label }),
                    /* @__PURE__ */ r("span", { className: "dq-find-effect", children: Xn(j.action, _, t, n).map(
                      (Y, C) => /* @__PURE__ */ r("span", { "data-effect-tone": Y.tone, children: Y.text }, C)
                    ) })
                  ]
                }
              ) }, j.action.id))
            }
          ) : /* @__PURE__ */ c("p", { className: "dq-find-empty", role: "status", children: [
            "No action matches “",
            l.trim(),
            "”."
          ] }),
          /* @__PURE__ */ c("p", { className: "dq-find-hints", "aria-hidden": "true", children: [
            /* @__PURE__ */ c("span", { children: [
              /* @__PURE__ */ r("kbd", { children: "Enter" }),
              " applies"
            ] }),
            i && /* @__PURE__ */ c("span", { children: [
              /* @__PURE__ */ r("kbd", { children: "Shift" }),
              /* @__PURE__ */ r("kbd", { children: "Enter" }),
              " applies and stays"
            ] }),
            /* @__PURE__ */ c("span", { children: [
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
const Qr = (e) => e >= "0" && e <= "9";
function Bi(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function Vi(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, a = 0;
  for (; n < e.length && a < t.length; ) {
    if (Qr(e[n]) && Qr(t[a])) {
      const l = n, d = a;
      for (; n < e.length && Qr(e[n]); ) n++;
      for (; a < t.length && Qr(t[a]); ) a++;
      const h = e.slice(l, n).replace(/^0+/, ""), p = t.slice(d, a).replace(/^0+/, "");
      if (h.length !== p.length) return h.length < p.length ? -1 : 1;
      if (h !== p) return h < p ? -1 : 1;
      continue;
    }
    const o = Bi(e[n]), s = Bi(t[a]);
    if (o !== s) return o < s ? -1 : 1;
    n++, a++;
  }
  const i = e.length - n - (t.length - a);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function as(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, a = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(a(e) - a(t)) || Vi(e.tagGroupName, t.tagGroupName) || Vi(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function Qn(e) {
  return [...e].sort(as);
}
function vl(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const a of n.steps)
        a.mode === "REMOVE_TREE" && a.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function is(e, t, n) {
  const a = sa(e), i = [], o = [];
  for (const m of e.steps) {
    if (m.mode !== "REMOVE_TREE") {
      o.push(m);
      continue;
    }
    const w = m.tagIds.flatMap((y) => {
      const N = n.get(y);
      return N || i.push(y), N ?? [y];
    });
    o.push({ mode: "REMOVE", tagIds: w.filter((y) => !a.has(y)) });
  }
  const s = [
    ...o.filter((m) => !En(m.mode)),
    ...o.filter((m) => En(m.mode))
  ], l = new Set(t.ids), d = new Set(t.absent);
  for (const m of s)
    for (const w of m.tagIds)
      switch (m.mode) {
        case "ADD":
          l.add(w);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          l.delete(w);
          break;
        case "MARK_PRESENT":
          l.add(w), d.delete(w);
          break;
        case "MARK_ABSENT":
          l.delete(w), d.add(w);
          break;
        case "CLEAR_ABSENCE":
          d.delete(w);
          break;
      }
  const h = new Set(t.ids), p = new Set(t.absent), g = [...new Set(e.steps.flatMap((m) => m.tagIds))];
  return {
    added: g.filter((m) => l.has(m) && !h.has(m)),
    removed: [...h].filter((m) => !l.has(m)),
    markedAbsent: g.filter((m) => d.has(m) && !p.has(m)),
    absenceCleared: [...p].filter((m) => !d.has(m)),
    unresolvedTrees: [...new Set(i)]
  };
}
function Nl(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const a of e.applications)
      n.has(a.tag.id) || n.set(a.tag.id, a.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, a) => ({ id: n, name: e.names[a] ?? "" }));
  return Qn(t);
}
function os(e) {
  const t = vl(e).sort((s, l) => s - l).join(","), [n, a] = S(() => /* @__PURE__ */ new Map()), i = I(/* @__PURE__ */ new Set()), o = I(!0);
  return J(() => (o.current = !0, () => {
    o.current = !1;
  }), []), J(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const l of s)
      i.current.has(l) || (i.current.add(l), la([l]).then(
        (d) => {
          o.current && a((h) => new Map(h).set(l, d));
        },
        () => {
          i.current.delete(l);
        }
      ));
  }, [t]), n;
}
function ss() {
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
function ui(e) {
  return wo(e.subscribe, e.get, e.get);
}
const Ji = [
  { indent: 0, slots: Ea(0, 11), fixed: [] },
  { indent: 1, slots: Ea(11, 22), fixed: [] },
  { indent: 2, slots: Ea(22, 27), fixed: ["n", "m", ",", "."] }
];
function Ea(e, t) {
  return Array.from({ length: t - e }, (n, a) => e + a);
}
function zi(e, t) {
  return e === "g" ? "Go to…" : e === "f" ? t === "video" ? "Fullscreen · filters" : "Filters" : t === "video" && e === "k" ? "Play / pause" : t === "video" && e === "m" ? "Mute" : "";
}
function pt({ binding: e, hidden: t }) {
  return /* @__PURE__ */ r(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || void 0,
      children: e
    }
  );
}
function Qi(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function ql({
  actions: e,
  mediaKind: t,
  isDisabled: n,
  busy: a,
  tags: i,
  trees: o,
  preview: s,
  onApply: l,
  onFind: d,
  findDisabled: h,
  paused: p = !1
}) {
  const g = jn(), m = xt(), w = pr(
    Ne(() => e.flatMap((O) => O.steps.flatMap((k) => k.tagIds)), [e])
  ), y = Ji.filter((O) => O.slots.some((k) => k < e.length)), N = y.length === Ji.length, A = Math.max(0, e.length - fr.length), E = (O) => ({
    onMouseEnter: () => s.set(O),
    onMouseLeave: () => s.clear(O),
    onFocus: () => s.set(O),
    onBlur: (k) => {
      k.currentTarget.contains(k.relatedTarget) || s.clear(O);
    }
  }), _ = (O) => {
    const k = e[O], P = g.action(O);
    if (!k) {
      const X = zi(P, t);
      return /* @__PURE__ */ c(
        "div",
        {
          className: `dq-pad-slot dq-pad-free${X ? " dq-pad-reserved" : ""}`,
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ r(pt, { binding: P }),
            X && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: X })
          ]
        },
        O
      );
    }
    const Q = n(k), te = `${m}-effect-${O}`;
    return /* @__PURE__ */ c("div", { className: "dq-pad-slot", ...p ? {} : E(k), children: [
      /* @__PURE__ */ r("span", { id: te, className: "dq-sr-only", children: Xn(k, w, [], o).map((X) => X.text).join(", ") }),
      /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: k.label,
          "aria-keyshortcuts": P,
          "aria-describedby": te,
          disabled: Q,
          onClick: (X) => l(k, X.shiftKey),
          children: [
            /* @__PURE__ */ r(pt, { binding: P }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-pad-label", children: k.label }),
            Qi(k) && " ",
            Qi(k) && /* @__PURE__ */ c("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r($a, { "aria-hidden": "true" }),
              "absent"
            ] })
          ]
        }
      ),
      k.steps.length > 0 && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-pad-pin",
          "aria-label": `Apply and stay: ${k.label}`,
          title: "Apply and stay (Shift)",
          disabled: Q,
          onClick: () => l(k, !0),
          children: /* @__PURE__ */ r(wc, { "aria-hidden": "true" })
        }
      )
    ] }, O);
  };
  return /* @__PURE__ */ c(
    "section",
    {
      className: `dq-pad${p ? " dq-pad-paused" : ""}`,
      "aria-label": p ? "Actions, paused while editing" : "Actions",
      "aria-busy": a || void 0,
      children: [
        /* @__PURE__ */ c("div", { className: "dq-pad-header", children: [
          p ? /* @__PURE__ */ c("p", { className: "dq-pad-paused-note", children: [
            /* @__PURE__ */ r(ur, { "aria-hidden": "true" }),
            "Actions are paused while you edit the review"
          ] }) : /* @__PURE__ */ c(he, { children: [
            /* @__PURE__ */ r(
              Sl,
              {
                actions: e,
                names: w,
                tags: i,
                trees: o,
                preview: s,
                extra: A,
                findKey: g.find
              }
            ),
            /* @__PURE__ */ c("span", { className: "dq-pad-hint", children: [
              /* @__PURE__ */ r("kbd", { className: "dq-key", children: "Shift" }),
              /* @__PURE__ */ r("span", { children: "+ key applies and stays" })
            ] })
          ] }),
          !N && /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "dq-pad-find-button",
              "aria-label": "Find action",
              "aria-keyshortcuts": g.find,
              disabled: h,
              onClick: d,
              children: [
                /* @__PURE__ */ r(pt, { binding: g.find }),
                /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "Find action" })
              ]
            }
          )
        ] }),
        y.map((O) => /* @__PURE__ */ c("div", { className: "dq-pad-row", "data-indent": O.indent, children: [
          O.slots.map(_),
          O.fixed.map((k) => {
            const P = zi(k, t);
            return /* @__PURE__ */ c(
              "div",
              {
                className: `dq-pad-slot dq-pad-free dq-pad-fixed${P ? " dq-pad-reserved" : ""}`,
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ r(pt, { binding: k }),
                  P && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: P })
                ]
              },
              k
            );
          }),
          O.fixed.length > 0 && /* @__PURE__ */ r("div", { className: "dq-pad-slot", children: /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": A ? `Find action, ${A} more` : "Find action",
              "aria-keyshortcuts": g.find,
              disabled: h,
              onClick: d,
              children: [
                /* @__PURE__ */ r(pt, { binding: g.find }),
                /* @__PURE__ */ c("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ r(ia, { "aria-hidden": "true" }),
                  A ? `${A} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, O.indent))
      ]
    }
  );
}
function Sl({
  actions: e,
  names: t,
  tags: n,
  trees: a,
  preview: i,
  extra: o,
  findKey: s
}) {
  const l = jn(), d = ui(i), h = d ? e.indexOf(d) : -1;
  if (!d || h < 0)
    return /* @__PURE__ */ c("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      o > 0 && /* @__PURE__ */ c(he, { children: [
        ` · ${fr.length} on keys, ${o} more under `,
        /* @__PURE__ */ r(pt, { binding: s })
      ] })
    ] });
  const p = l.action(h), g = n && d.steps.length ? is(d, n, a) : null, m = g && !g.unresolvedTrees.length && ![g.added, g.removed, g.markedAbsent, g.absenceCleared].some(
    (w) => w.length
  );
  return /* @__PURE__ */ c("p", { className: "dq-pad-effect", children: [
    p && /* @__PURE__ */ r(pt, { binding: p }),
    /* @__PURE__ */ r("strong", { children: d.label }),
    Xn(d, t, [], a).map((w, y) => /* @__PURE__ */ r("span", { "data-effect-tone": w.tone, children: w.text }, y)),
    m && /* @__PURE__ */ r("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function cs({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  busy: i,
  onApply: o,
  onFind: s,
  summary: l,
  hints: d,
  notices: h,
  status: p,
  className: g = "",
  paused: m = !1
}) {
  const w = jn(), y = xt(), N = pr(Ne(() => da(e), [e])), [A] = S(() => ss()), E = I(null), _ = El(E, e), O = e.slice(0, fr.length), k = e.length - O.length, P = (te) => Xn(te, N, t, n).map((X) => X.text).join(", "), Q = (te) => ({
    onMouseEnter: () => A.set(te),
    onMouseLeave: () => A.clear(te),
    onFocus: () => A.set(te),
    onBlur: (X) => {
      X.currentTarget.contains(X.relatedTarget) || A.clear(te);
    }
  });
  return /* @__PURE__ */ c(
    "section",
    {
      ref: E,
      className: `dq-action-bar${_ ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${m ? " dq-bar-paused" : ""}${g ? ` ${g}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ r("div", { className: "dq-bar-summary", children: l }),
        /* @__PURE__ */ r("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ c("div", { className: "dq-bar-tiles", "aria-busy": i || void 0, children: [
          O.map((te, X) => {
            const j = w.action(X);
            return /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-bar-tile",
                title: te.label,
                "aria-keyshortcuts": j || void 0,
                "aria-describedby": `${y}-effect-${X}`,
                disabled: m || a(te),
                onClick: () => o(te),
                ...m ? {} : Q(te),
                children: [
                  j && /* @__PURE__ */ r(pt, { binding: j }),
                  " ",
                  /* @__PURE__ */ r("span", { className: "dq-bar-label", children: te.label })
                ]
              },
              te.id
            );
          }),
          e.length > 0 ? /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "dq-bar-tile dq-bar-find",
              "aria-label": k > 0 ? `Find action, ${k} more` : "Find action",
              "aria-keyshortcuts": w.find,
              disabled: m,
              onClick: s,
              children: [
                /* @__PURE__ */ r(pt, { binding: w.find, hidden: !0 }),
                /* @__PURE__ */ r(ia, { "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-bar-label", children: k > 0 ? `${k} more` : "Find action" })
              ]
            }
          ) : /* @__PURE__ */ r("p", { className: "dq-bar-empty", children: "This review has no actions." })
        ] }),
        d && /* @__PURE__ */ r("p", { className: "dq-bar-hints", children: d }),
        m ? /* @__PURE__ */ c("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ r(ur, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ r(Cl, { actions: O, preview: A, names: N, tagGroups: t, trees: n }),
        h && /* @__PURE__ */ r("div", { className: "dq-bar-notices", children: h }),
        /* @__PURE__ */ r("div", { hidden: !0, children: O.map((te, X) => /* @__PURE__ */ r("span", { id: `${y}-effect-${X}`, children: P(te) }, te.id)) }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: p })
      ]
    }
  );
}
function El(e, t) {
  const [n, a] = S(!1);
  return sn(() => {
    var h;
    const i = e.current;
    if (!i || typeof ResizeObserver > "u") return;
    const o = i.querySelector(".dq-bar-summary"), s = () => {
      const p = getComputedStyle(i), g = parseFloat(p.columnGap) || 0, m = i.clientWidth - (parseFloat(p.paddingLeft) || 0) - (parseFloat(p.paddingRight) || 0), w = [...i.querySelectorAll(".dq-bar-tiles > *")].map(
        (_) => _.offsetWidth
      ), y = parseFloat(getComputedStyle(i.querySelector(".dq-bar-tiles")).columnGap) || 0, N = i.querySelector(".dq-bar-hints"), A = ((o == null ? void 0 : o.offsetWidth) ?? 0) + (N ? N.offsetWidth + g : 0) + 1 + // the divider
      2 * g, E = (_) => {
        let O = 1, k = 0;
        for (const P of w)
          k > 0 && k + y + P > _ ? (O += 1, k = P) : k += (k > 0 ? y : 0) + P;
        return O;
      };
      a(1 + E(m) < E(m - A));
    }, l = new ResizeObserver(s);
    l.observe(i);
    for (const p of i.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      l.observe(p);
    s();
    let d = !0;
    return (h = document.fonts) == null || h.ready.then(() => {
      d && s();
    }), () => {
      d = !1, l.disconnect();
    };
  }, [e, t]), n;
}
function Cl({
  actions: e,
  preview: t,
  names: n,
  tagGroups: a,
  trees: i
}) {
  const o = jn(), s = ui(t), l = s ? e.indexOf(s) : -1;
  if (!s || l < 0) return null;
  const d = o.action(l);
  return /* @__PURE__ */ c("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    d && /* @__PURE__ */ r(pt, { binding: d }),
    /* @__PURE__ */ r("strong", { children: s.label }),
    Xn(s, n, a, i).map((h, p) => /* @__PURE__ */ r("span", { "data-effect-tone": h.tone, children: h.text }, p))
  ] });
}
const Wi = 1e3;
async function Al(e, t, n) {
  const a = await ce(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    const h = await ce(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          kn({
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
    for (const p of h.items) i.set(p.id, p);
    if (d * Wi >= h.totalCount) break;
    if (!h.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], s = Te(e), l = ve(e) ? await Tl(
    s,
    o.map((d) => d.id),
    n
  ) : o.map((d) => (s === "audio" ? d.audioCount : d.videoCount) ?? 0);
  return {
    parent: { id: t, name: a.name },
    children: o.map((d, h) => ({ id: d.id, name: d.name, uses: l[h] })).sort(
      (d, h) => h.uses - d.uses || d.name.localeCompare(h.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function kl(e) {
  return JSON.stringify(
    kn({
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
async function Tl(e, t, n) {
  const a = new Array(t.length).fill(0), i = new AbortController(), o = () => i.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && o(), n == null || n.addEventListener("abort", o, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !i.signal.aborted; ) {
            const l = s++;
            a[l] = (await ce(
              `/api/${_n(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: kl(t[l])
              }
            )).count;
          }
        } catch (l) {
          throw i.abort(), l;
        }
      })
    );
  } finally {
    n == null || n.removeEventListener("abort", o);
  }
  return i.signal.throwIfAborted(), a;
}
function Rl(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((a) => t.has(a.id) ? !1 : (t.add(a.id), !0))
  }));
}
function Il(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of n.children)
      t.set(a.id, [...t.get(a.id) ?? [], n.parent.id]);
  return t;
}
function $l(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of sa(n))
      t.set(a, [...t.get(a) ?? [], n]);
  return t;
}
function Ol(e, t) {
  return {
    id: crypto.randomUUID(),
    label: e.name,
    steps: [
      { mode: "ADD", tagIds: [e.id] },
      ...t.length ? [{ mode: "REMOVE_TREE", tagIds: t }] : []
    ]
  };
}
const Fl = (e) => e instanceof Error ? e.message : "Request failed.";
function Ml({
  id: e,
  review: t,
  disabled: n,
  onAdd: a,
  onCancel: i
}) {
  const [o, s] = S([]), [l, d] = S({}), [h, p] = S({}), [g, m] = S({}), w = I(/* @__PURE__ */ new Map());
  J(
    () => () => {
      for (const x of w.current.values()) x.abort();
    },
    []
  );
  const y = cn(Te(t)), N = ve(t), A = N ? "performer" : y.one;
  function E(x) {
    var ie;
    (ie = w.current.get(x)) == null || ie.abort();
    const U = new AbortController();
    w.current.set(x, U), d((Z) => ({ ...Z, [x]: { status: "loading" } })), Al(t, x, U.signal).then(
      (Z) => {
        U.signal.aborted || d((ne) => ({
          ...ne,
          [x]: { status: "ready", group: Z }
        }));
      },
      (Z) => {
        U.signal.aborted || d((ne) => ({
          ...ne,
          [x]: { status: "failed", message: Fl(Z) }
        }));
      }
    );
  }
  function _(x) {
    var F;
    const U = o.filter((pe) => !x.includes(pe));
    for (const pe of U)
      (F = w.current.get(pe)) == null || F.abort(), w.current.delete(pe);
    const ie = (pe) => {
      const z = l[pe];
      return (z == null ? void 0 : z.status) === "ready" ? z.group.children.map((D) => D.id) : [];
    }, Z = new Set(x.flatMap(ie)), ne = U.flatMap(ie).filter((pe) => !Z.has(pe));
    p(
      (pe) => Object.fromEntries(
        Object.entries(pe).filter(([z]) => !ne.includes(Number(z)))
      )
    ), m(
      (pe) => Object.fromEntries(
        Object.entries(pe).filter(([z]) => x.includes(Number(z)))
      )
    ), d(
      (pe) => Object.fromEntries(
        Object.entries(pe).filter(([z]) => x.includes(Number(z)))
      )
    ), s(x);
    for (const pe of x) o.includes(pe) || E(pe);
  }
  const O = o.flatMap((x) => {
    const U = l[x];
    return (U == null ? void 0 : U.status) === "ready" ? [U.group] : [];
  }), k = O.length === o.length, P = o.some(
    (x) => {
      var U;
      return (((U = l[x]) == null ? void 0 : U.status) ?? "loading") === "loading";
    }
  ), Q = new Map(
    Rl(O).map((x) => [x.parent.id, x])
  ), te = Il(O), X = new Map(O.map((x) => [x.parent.id, x.parent.name])), j = $l(t.actions), G = (x) => h[x] ?? !j.has(x), Y = k ? [...Q.values()].flatMap(
    (x) => x.children.filter((U) => G(U.id))
  ) : [], C = (x, U) => p((ie) => ({
    ...ie,
    ...Object.fromEntries(x.children.map((Z) => [Z.id, U]))
  }));
  return /* @__PURE__ */ c("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ r("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ c("p", { className: "dq-drawer-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      N ? "on performers " : "",
      "first. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ r(
      Cn,
      {
        entityType: "tag",
        values: o,
        onChange: _,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    o.map((x) => {
      const U = l[x];
      if (!U || U.status === "loading")
        return /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Loading child tags…" }, x);
      if (U.status === "failed")
        return /* @__PURE__ */ c("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ c("span", { children: [
            "Child tags could not be loaded. ",
            U.message
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: n,
              onClick: () => E(x),
              children: "Retry"
            }
          )
        ] }, x);
      const ie = Q.get(x);
      if (!ie) return null;
      const Z = ie.parent.name;
      return /* @__PURE__ */ c("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ r("legend", { children: Z }),
        U.group.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ c(he, { children: [
          /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: g[x] ?? !1,
                disabled: n,
                onChange: (ne) => m((F) => ({
                  ...F,
                  [x]: ne.target.checked
                }))
              }
            ),
            "Only one per ",
            A,
            ": each action removes every other tag in the ",
            Z,
            " tree"
          ] }),
          ie.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ c(he, { children: [
            /* @__PURE__ */ c("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${Z}`,
                  onClick: () => C(ie, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${Z}`,
                  onClick: () => C(ie, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "dq-child-tags", children: ie.children.map((ne) => {
              const F = j.get(ne.id) ?? [], pe = (te.get(ne.id) ?? []).filter((z) => z !== x).map((z) => `“${X.get(z)}”`);
              return /* @__PURE__ */ c("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: G(ne.id),
                    disabled: n,
                    onChange: (z) => p((D) => ({
                      ...D,
                      [ne.id]: z.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ c("span", { children: [
                  ne.name,
                  " ",
                  /* @__PURE__ */ c("small", { children: [
                    ne.uses.toLocaleString(),
                    " ",
                    ne.uses === 1 ? y.one : y.many
                  ] }),
                  pe.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " · Also under ",
                    pe.join(", ")
                  ] }),
                  F.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " ",
                    "· Already in “",
                    F[0].label || "New action",
                    "”",
                    F.length > 1 ? ` and ${F.length - 1} more` : ""
                  ] })
                ] })
              ] }, ne.id);
            }) })
          ] })
        ] })
      ] }, x);
    }),
    /* @__PURE__ */ c("div", { className: "dq-row", children: [
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: n || !Y.length,
          onClick: () => a(
            Y.map(
              (x) => Ol(
                x,
                (te.get(x.id) ?? []).filter(
                  (U) => g[U]
                )
              )
            )
          ),
          children: Y.length ? `Add ${Y.length} action${Y.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-sr-only", children: P ? "Loading child tags…" : "" })
    ] })
  ] });
}
const xl = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Pl(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function Ll(e, t) {
  if (An(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (ni(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function ls(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function Dl(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function _l({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: a,
  saving: i,
  expandedId: o,
  onExpand: s,
  reveal: l
}) {
  const d = Oe(e), h = d !== "tag", p = e.actions, g = jn(), m = pr(Ne(() => da(p), [p])), [w, y] = S(""), [N, A] = S(!1), [E, _] = S(
    null
  ), O = xt(), k = `${O}-from-tags`, P = I(null), Q = I(null), te = I(null), X = I(null), j = I(/* @__PURE__ */ new WeakMap()), G = (D) => {
    let de = j.current.get(D);
    return de || (de = crypto.randomUUID(), j.current.set(D, de)), de;
  }, Y = w.trim().toLocaleLowerCase(), C = Y ? p.filter((D) => D.label.toLocaleLowerCase().includes(Y)) : p, x = (D) => t({ ...e, actions: D }), U = (D, de) => x(p.map((Re, _e) => _e === D ? de : Re));
  function ie(D) {
    var de;
    return [...((de = te.current) == null ? void 0 : de.querySelectorAll("[data-action-id]")) ?? []].find(
      (Re) => Re.dataset.actionId === D
    );
  }
  function Z(D, de) {
    const Re = ie(D), _e = Re == null ? void 0 : Re.querySelector(
      de === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return _e == null || _e.focus(), !!_e;
  }
  sn(() => {
    var de;
    const D = X.current;
    D && (X.current = null, (D === "add" || !Z(D.id, D.part)) && ((de = Q.current) == null || de.focus()));
  }), J(() => {
    !l || !o || (C.some((D) => D.id === o) ? Z(o, "label") : (y(""), X.current = { id: o, part: "label" }));
  }, [l]);
  function ne() {
    const D = Dl(d);
    y(""), x([...p, D]), s(D.id), X.current = { id: D.id, part: "label" };
  }
  function F(D) {
    const de = p[D], Re = {
      ...structuredClone(de),
      id: crypto.randomUUID(),
      label: `${de.label} copy`
    };
    x([...p.slice(0, D + 1), Re, ...p.slice(D + 1)]), s(Re.id), X.current = { id: Re.id, part: "label" };
  }
  function pe(D) {
    const de = p[D], Re = C.indexOf(de), _e = C[Re + 1] ?? C[Re - 1];
    x(p.filter((mt, ct) => ct !== D)), o === de.id && s(null), X.current = _e ? { id: _e.id, part: "toggle" } : "add";
  }
  function z() {
    A(!1), requestAnimationFrame(() => {
      var D;
      return (D = P.current) == null ? void 0 : D.focus();
    });
  }
  return /* @__PURE__ */ c("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ c("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ c("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ c(
          "button",
          {
            ref: Q,
            type: "button",
            className: "dq-header-button",
            onClick: ne,
            children: [
              /* @__PURE__ */ r(Wa, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        h && /* @__PURE__ */ r(
          "button",
          {
            ref: P,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": N,
            "aria-controls": N ? k : void 0,
            onClick: () => {
              _(null), A(!N);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ c("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ r(ia, { "aria-hidden": "true" }),
          /* @__PURE__ */ r(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: w,
              onChange: (D) => y(D.target.value),
              onKeyDown: (D) => {
                D.key === "Escape" && w && (D.preventDefault(), D.stopPropagation(), y(""));
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-actions-hint", children: "Letters follow this order. Drag a handle, or press Alt + ↑ / ↓, to reorder." }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-actions-status", children: (E == null ? void 0 : E.actions) === p ? `Added ${E.count} action${E.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    h && N && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here.
    /* @__PURE__ */ r(
      "div",
      {
        onKeyDown: (D) => {
          D.key !== "Escape" || D.defaultPrevented || (D.preventDefault(), D.stopPropagation(), z());
        },
        children: /* @__PURE__ */ r(
          Ml,
          {
            id: k,
            review: e,
            disabled: i,
            onAdd: (D) => {
              const de = [...p, ...D];
              x(de), _({ actions: de, count: D.length }), z();
            },
            onCancel: z
          }
        )
      }
    ),
    /* @__PURE__ */ r("div", { ref: te, children: C.length > 0 && /* @__PURE__ */ r(
      yo,
      {
        items: C,
        getKey: (D) => D.id,
        disabled: i || !!Y,
        className: "dq-action-list",
        onReorder: (D) => x(D),
        renderItem: (D, { dragHandleProps: de, isOver: Re }) => {
          const _e = p.indexOf(D), mt = o === D.id;
          return /* @__PURE__ */ r(
            jl,
            {
              action: D,
              entityType: d,
              binding: g.action(_e),
              effect: Xn(D, m, n, a),
              open: mt,
              detailId: `${O}-detail-${D.id}`,
              dragHandleProps: de,
              isOver: Re,
              reorderDisabled: i || !!Y,
              onToggle: () => s(mt ? null : D.id),
              onDuplicate: () => F(_e),
              onDelete: () => pe(_e),
              children: "steps" in D ? /* @__PURE__ */ r(
                Ul,
                {
                  action: D,
                  saving: i,
                  stepKey: G,
                  rememberStepKey: (ct, nt) => j.current.set(ct, G(nt)),
                  onChange: (ct) => U(_e, ct)
                }
              ) : /* @__PURE__ */ r(
                Kl,
                {
                  action: D,
                  tagGroups: n,
                  onChange: (ct) => U(_e, ct)
                }
              )
            }
          );
        }
      }
    ) }),
    p.length ? !C.length && /* @__PURE__ */ c("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      w.trim(),
      "”."
    ] }) : /* @__PURE__ */ r("p", { className: "dq-actions-empty", children: h ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function jl({
  action: e,
  entityType: t,
  binding: n,
  effect: a,
  open: i,
  detailId: o,
  dragHandleProps: s,
  isOver: l,
  reorderDisabled: d,
  onToggle: h,
  onDuplicate: p,
  onDelete: g,
  children: m
}) {
  const w = e.label.trim() || "New action", y = Ll(e, t);
  return /* @__PURE__ */ c(
    "div",
    {
      className: `dq-action-row${i ? " dq-action-row-open" : ""}${l ? " dq-drag-over" : ""}`,
      "data-action-id": e.id,
      children: [
        /* @__PURE__ */ c("div", { className: "dq-action-row-head", children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              ...s,
              style: ls(s.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${w}`,
              title: d ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: d,
              children: /* @__PURE__ */ r(Eo, { "aria-hidden": "true" })
            }
          ),
          n ? /* @__PURE__ */ r(pt, { binding: n }) : /* @__PURE__ */ r("span", { className: "dq-key dq-key-none", title: "Reached with Find action", children: "·" }),
          /* @__PURE__ */ c("div", { className: "dq-action-row-summary", onClick: h, children: [
            /* @__PURE__ */ r("span", { className: "dq-action-row-label", title: w, children: w }),
            !i && /* @__PURE__ */ r("span", { className: "dq-action-row-effect", children: a.map((N, A) => /* @__PURE__ */ r("span", { "data-effect-tone": N.tone, children: N.text }, A)) }),
            y && /* @__PURE__ */ c("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ r(Jn, { "aria-hidden": "true" }),
              y
            ] })
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Duplicate ${w}`,
              title: "Duplicate",
              onClick: p,
              children: /* @__PURE__ */ r(Co, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Delete ${w}`,
              title: "Delete",
              onClick: g,
              children: /* @__PURE__ */ r(Ao, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small dq-action-toggle",
              "aria-label": `${i ? "Collapse" : "Expand"} ${w}`,
              "aria-expanded": i,
              "aria-controls": i ? o : void 0,
              onClick: h,
              children: /* @__PURE__ */ r(ko, { "aria-hidden": "true" })
            }
          )
        ] }),
        i && /* @__PURE__ */ r("div", { id: o, className: "dq-action-detail", children: m })
      ]
    }
  );
}
function ds({
  action: e,
  onChange: t
}) {
  return /* @__PURE__ */ c("label", { className: "dq-action-field", children: [
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
function Ul({
  action: e,
  saving: t,
  stepKey: n,
  rememberStepKey: a,
  onChange: i
}) {
  const o = xt(), s = I(null), l = I(null);
  sn(() => {
    var p, g;
    const h = l.current;
    h != null && (l.current = null, (g = (p = s.current) == null ? void 0 : p.querySelector(`[data-step-index="${h}"] input`)) == null || g.focus());
  });
  const d = (h) => i({ ...e, steps: h });
  return /* @__PURE__ */ c(he, { children: [
    /* @__PURE__ */ r(ds, { action: e, onChange: (h) => i({ ...e, label: h }) }),
    /* @__PURE__ */ c("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": o, children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", id: o, children: "Steps" }),
      /* @__PURE__ */ c("div", { className: "dq-steps", ref: s, children: [
        e.steps.length > 0 ? /* @__PURE__ */ r(
          yo,
          {
            items: e.steps,
            getKey: n,
            disabled: t,
            className: "dq-step-list",
            onReorder: d,
            renderItem: (h, { index: p, dragHandleProps: g, isOver: m }) => /* @__PURE__ */ r(
              Gl,
              {
                step: h,
                index: p,
                dragHandleProps: g,
                isOver: m,
                saving: t,
                onChange: (w) => {
                  a(w, h), d(e.steps.map((y, N) => N === p ? w : y));
                },
                onRemove: () => d(e.steps.filter((w, y) => y !== p))
              }
            )
          }
        ) : /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "No steps: the action skips the item." }),
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "dq-add-step",
            onClick: () => {
              l.current = e.steps.length, d([...e.steps, { mode: "ADD", tagIds: [] }]);
            },
            children: [
              /* @__PURE__ */ r(Wa, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function Gl({
  step: e,
  index: t,
  dragHandleProps: n,
  isOver: a,
  saving: i,
  onChange: o,
  onRemove: s
}) {
  const l = t + 1;
  return /* @__PURE__ */ c(
    "div",
    {
      className: `dq-step${a ? " dq-drag-over" : ""}`,
      "data-step-tone": Pl(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            ...n,
            style: ls(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${l}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ r(Eo, { "aria-hidden": "true" }),
              /* @__PURE__ */ r("span", { "aria-hidden": "true", children: l })
            ]
          }
        ),
        /* @__PURE__ */ r(
          "select",
          {
            className: "dq-select dq-step-mode",
            "aria-label": `Step ${l} operation`,
            value: e.mode,
            onChange: (d) => o({ ...e, mode: d.target.value }),
            children: xl.map(({ mode: d, label: h }) => /* @__PURE__ */ r("option", { value: d, children: h }, d))
          }
        ),
        /* @__PURE__ */ r(
          Cn,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (d) => o({ ...e, tagIds: d }),
            placeholder: "Add tag…",
            inputAriaLabel: `Add a tag to step ${l}`,
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
            "aria-label": `Remove step ${l}`,
            title: "Remove step",
            onClick: s,
            children: /* @__PURE__ */ r(Ir, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function Kl({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const a = e.effect, i = a.mode === "SET_TAG_GROUP" ? `group:${a.tagGroupId}` : a.mode, o = a.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === a.tagGroupId);
  return /* @__PURE__ */ c(he, { children: [
    /* @__PURE__ */ r(ds, { action: e, onChange: (s) => n({ ...e, label: s }) }),
    /* @__PURE__ */ c("label", { className: "dq-action-field", children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", children: "Effect" }),
      /* @__PURE__ */ c(
        "select",
        {
          className: "dq-select",
          "aria-label": "Tag group action",
          value: i,
          onChange: (s) => {
            const l = s.target.value;
            n({
              ...e,
              effect: l === "SKIP" ? { mode: "SKIP" } : l === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : { mode: "SET_TAG_GROUP", tagGroupId: Number(l.slice(6)) }
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
function Bl({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, a = cn(Te(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
  return /* @__PURE__ */ c("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
    /* @__PURE__ */ c("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      a,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ r(
      Cn,
      {
        entityType: "tag",
        values: n.tagIds,
        onChange: (o) => i({ tagIds: o }),
        placeholder: "Search review tag choices...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
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
function Vl({
  review: e,
  onChange: t
}) {
  const n = cn(Te(e)).many;
  return /* @__PURE__ */ c("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ r("legend", { children: "Performer flags" }),
    /* @__PURE__ */ c("p", { children: [
      "Flag performers whose profile has any of these tags in the performer list and batches, for example a tag noting that something changed during their career. Check a flagged performer’s earliest and latest ",
      n,
      " ",
      "before applying one batch to all of them."
    ] }),
    /* @__PURE__ */ r(
      Cn,
      {
        entityType: "tag",
        values: e.occurrence.flagPerformerTagIds ?? [],
        onChange: (a) => {
          const { flagPerformerTagIds: i, ...o } = e.occurrence;
          t({
            ...e,
            occurrence: a.length ? { ...o, flagPerformerTagIds: a } : o
          });
        },
        placeholder: "Search performer flag tags...",
        allowCreate: !1
      }
    )
  ] });
}
const us = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, fs = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, Jl = {
  video: oa,
  audio: Io,
  tag: Ro,
  performerOccurrence: To,
  audioPerformerOccurrence: yc
};
function hs({ entityType: e }) {
  const t = Jl[e];
  return /* @__PURE__ */ r(t, { role: "img", "aria-label": us[e] });
}
const zl = 2e6;
function ps(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), a = document.createElement("a");
  a.href = n, a.download = t, a.click(), URL.revokeObjectURL(n);
}
function Ql(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function fi(e) {
  ps([e], Ql(e));
}
async function Wl(e) {
  if (e.size > zl) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return Or(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function dr(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (a, i) => i && typeof i == "object" && !Array.isArray(i) ? Object.fromEntries(
      Object.keys(i).sort().map((o) => [o, i[o]])
    ) : i
  );
}
function ms({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: a,
  nameRef: i,
  autoFocus: o = !1
}) {
  return /* @__PURE__ */ c(he, { children: [
    /* @__PURE__ */ c("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ r("span", { children: "Entity type" }),
      /* @__PURE__ */ r(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: Oe(e),
          disabled: n,
          onChange: (s) => a == null ? void 0 : a(s.target.value),
          children: Po.map((s) => /* @__PURE__ */ r("option", { value: s, children: fs[s] }, s))
        }
      )
    ] }),
    /* @__PURE__ */ c("label", { className: "dq-drawer-field", children: [
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
    /* @__PURE__ */ c("label", { className: "dq-drawer-field", children: [
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
function Hl(e, t) {
  const n = Oe(e), a = ["Review"];
  return (n === "video" || n === "tag") && a.push("Appearance"), a.push("Actions"), t && a.push("Tag choices"), a;
}
function gs({
  draft: e,
  onChange: t,
  direction: n,
  onDirectionChange: a,
  tagGroups: i,
  trees: o,
  saving: s,
  saveDisabled: l = !1,
  error: d,
  dirty: h,
  criteriaChanged: p = !1,
  notices: g,
  onSave: m,
  onCancel: w,
  drawerRef: y
}) {
  const [N, A] = S("Review"), [E] = S(
    () => ve(e) && e.occurrence.tagIds.length > 0
  ), [_, O] = S(""), [k, P] = S(null), [Q, te] = S(0), X = I(null), j = Hl(e, E), G = Oe(e), Y = Ne(() => dr(e), [e]);
  J(() => O(""), [Y]);
  function C() {
    const U = { ...e, name: e.name.trim() }, ie = Tr(U);
    if (!ie) {
      O(""), m();
      return;
    }
    if (O(ie), !U.name) {
      A("Review"), requestAnimationFrame(() => {
        var ne;
        return (ne = X.current) == null ? void 0 : ne.focus();
      });
      return;
    }
    const Z = e.actions.find(
      (ne) => !An(ne, G)
    );
    Z && (A("Actions"), P(Z.id), te((ne) => ne + 1));
  }
  const x = _ || d;
  return /* @__PURE__ */ c(
    "aside",
    {
      ref: y,
      className: "dq-drawer",
      role: "dialog",
      "aria-label": "Edit review",
      tabIndex: -1,
      onKeyDown: (U) => {
        U.key !== "Escape" || U.defaultPrevented || h || s || (U.preventDefault(), U.stopPropagation(), w());
      },
      children: [
        /* @__PURE__ */ c("header", { className: "dq-drawer-header", children: [
          /* @__PURE__ */ c("div", { className: "dq-drawer-title", children: [
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
              onClick: w,
              children: /* @__PURE__ */ r(Ir, { "aria-hidden": "true" })
            }
          )
        ] }),
        /* @__PURE__ */ r("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ r(
          oc,
          {
            tabs: j.map((U) => ({
              key: U,
              label: U,
              count: U === "Actions" ? e.actions.length : void 0
            })),
            activeTab: N,
            onTabChange: (U) => A(U)
          }
        ) }),
        /* @__PURE__ */ r("div", { className: "dq-drawer-body", children: /* @__PURE__ */ c("fieldset", { className: "dq-drawer-fields", disabled: s, children: [
          /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review settings" }),
          /* @__PURE__ */ c("div", { className: "dq-drawer-panel", role: "tabpanel", hidden: N !== "Review", "aria-label": "Review", children: [
            /* @__PURE__ */ r(
              ms,
              {
                review: e,
                onChange: t,
                entityTypeLocked: !0,
                nameRef: X,
                autoFocus: !0
              }
            ),
            /* @__PURE__ */ c("label", { className: "dq-drawer-field", children: [
              /* @__PURE__ */ r("span", { children: "Review direction" }),
              /* @__PURE__ */ c(
                "select",
                {
                  className: "dq-select",
                  "aria-label": "Review direction",
                  value: n,
                  onChange: (U) => a(U.target.value),
                  children: [
                    /* @__PURE__ */ r("option", { value: "end", children: "Start from the end" }),
                    /* @__PURE__ */ r("option", { value: "beginning", children: "Start from the beginning" })
                  ]
                }
              ),
              /* @__PURE__ */ r("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
            ] }),
            ve(e) && /* @__PURE__ */ r(Vl, { review: e, onChange: t }),
            /* @__PURE__ */ r("div", { children: /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-text-button",
                onClick: () => fi(e),
                children: "Export draft"
              }
            ) })
          ] }),
          j.includes("Appearance") && /* @__PURE__ */ r(
            "div",
            {
              className: "dq-drawer-panel",
              role: "tabpanel",
              hidden: N !== "Appearance",
              "aria-label": "Appearance",
              children: /* @__PURE__ */ r(Yl, { review: e, onChange: t })
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
                _l,
                {
                  review: e,
                  onChange: t,
                  tagGroups: i,
                  trees: o,
                  saving: s,
                  expandedId: k,
                  onExpand: P,
                  reveal: Q
                }
              )
            }
          ),
          E && ve(e) && /* @__PURE__ */ r(
            "div",
            {
              className: "dq-drawer-panel",
              role: "tabpanel",
              hidden: N !== "Tag choices",
              "aria-label": "Tag choices",
              children: /* @__PURE__ */ r(Bl, { review: e, onChange: t })
            }
          )
        ] }) }),
        (x || g) && /* @__PURE__ */ c("div", { className: "dq-drawer-notices", children: [
          g,
          x && /* @__PURE__ */ c("p", { role: "alert", className: "dq-alert", children: [
            /* @__PURE__ */ r(Jn, { "aria-hidden": "true" }),
            x
          ] })
        ] }),
        /* @__PURE__ */ c("footer", { className: "dq-drawer-footer", children: [
          /* @__PURE__ */ r("p", { className: "dq-drawer-dirty", children: h ? p ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
          /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: s, onClick: w, children: "Cancel" }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-button primary",
              "aria-busy": s || void 0,
              "aria-disabled": s || void 0,
              disabled: !s && l,
              onClick: () => {
                s || C();
              },
              children: "Save review"
            }
          )
        ] })
      ]
    }
  );
}
function Yl({
  review: e,
  onChange: t
}) {
  const n = xt(), a = e.view, i = (p) => t({ ...e, view: { ...a, ...p } }), o = /* @__PURE__ */ c("label", { className: "dq-checkbox dq-setting-indent", children: [
    /* @__PURE__ */ r(
      "input",
      {
        type: "checkbox",
        checked: a.selectAllOnLoad ?? !1,
        onChange: (p) => i({ selectAllOnLoad: p.target.checked ? !0 : void 0 })
      }
    ),
    "Select every card when a page opens"
  ] });
  if (Oe(e) === "tag")
    return /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ r(
        Hi,
        {
          label: "View",
          value: a.displayMode === "list" ? "list" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "list", label: "List" }
          ],
          onChange: (p) => i({ displayMode: p })
        }
      ),
      o,
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review opens with these. The Cards / List switch in the header changes only the current visit." })
    ] });
  const s = e.presentation ?? {}, l = (p) => t({ ...e, presentation: { ...s, ...p } }), d = s.annotations ?? [], h = a.reviewMode ?? "single";
  return /* @__PURE__ */ c(he, { children: [
    /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ c("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ r(
          Yi,
          {
            name: `${n}-layout-choice`,
            checked: h === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ r(Xl, {}),
            onChoose: () => i({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ r(
          Yi,
          {
            name: `${n}-layout-choice`,
            checked: h === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ r(Zl, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ r(
        Hi,
        {
          label: "Cards",
          value: a.displayMode === "wall" ? "wall" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "wall", label: "Wall" }
          ],
          onChange: (p) => i({ displayMode: p })
        }
      ),
      o,
      /* @__PURE__ */ c("div", { className: "dq-setting-row", role: "group", "aria-labelledby": `${n}-details`, children: [
        /* @__PURE__ */ r("span", { className: "dq-setting-name", id: `${n}-details`, children: "Card details" }),
        /* @__PURE__ */ r("div", { className: "dq-setting-options", children: [
          ["date", "Date"],
          ["studio", "Studio"],
          ["performers", "Performers"],
          ["tags", "Tags"]
        ].map(([p, g]) => /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: d.includes(p),
              onChange: (m) => l({
                annotations: m.target.checked ? [...d, p] : d.filter((w) => w !== p)
              })
            }
          ),
          g
        ] }, p)) })
      ] }),
      d.includes("tags") && /* @__PURE__ */ c("div", { className: "dq-setting-row dq-setting-row-top", children: [
        /* @__PURE__ */ r("span", { className: "dq-setting-name", children: "Tags on cards" }),
        /* @__PURE__ */ c("div", { className: "dq-setting-value", children: [
          /* @__PURE__ */ r(
            Cn,
            {
              entityType: "tag",
              values: s.annotationParents ?? [],
              onChange: (p) => l({ annotationParents: p }),
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
    /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-bins`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-bins`, children: "Queue tag bins" }),
      /* @__PURE__ */ r(
        Cn,
        {
          entityType: "tag",
          values: s.binParents ?? [],
          onChange: (p) => l({ binParents: p }),
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
function Hi({
  label: e,
  value: t,
  options: n,
  onChange: a
}) {
  const i = xt();
  return /* @__PURE__ */ c("div", { className: "dq-setting-row", children: [
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
function Yi({
  name: e,
  checked: t,
  title: n,
  text: a,
  picture: i,
  onChoose: o
}) {
  const s = xt(), l = xt();
  return /* @__PURE__ */ c("label", { className: "dq-layout-card", children: [
    i,
    /* @__PURE__ */ c("span", { className: "dq-layout-card-name", children: [
      /* @__PURE__ */ r(
        "input",
        {
          type: "radio",
          name: e,
          checked: t,
          "aria-labelledby": s,
          "aria-describedby": l,
          onChange: o
        }
      ),
      /* @__PURE__ */ r("span", { id: s, children: n })
    ] }),
    /* @__PURE__ */ r("span", { className: "dq-layout-card-text", id: l, children: a })
  ] });
}
function Xl() {
  return /* @__PURE__ */ c("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function Zl() {
  const e = /* @__PURE__ */ new Set(["80,8", "152,8", "8,44", "224,44"]);
  return /* @__PURE__ */ c("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
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
function bs({
  name: e,
  description: t,
  entityType: n,
  onBack: a,
  backDisabled: i,
  onEdit: o,
  editDisabled: s,
  editing: l = !1,
  toolbar: d,
  trailing: h,
  chipsStart: p,
  chipsAfter: g,
  chipsEnd: m
}) {
  return /* @__PURE__ */ c("header", { className: "dq-review-header", children: [
    /* @__PURE__ */ c("div", { className: "dq-review-header-lead", children: [
      a && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: i,
          onClick: a,
          children: /* @__PURE__ */ r($r, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-type", title: us[n], children: /* @__PURE__ */ r(hs, { entityType: n }) }),
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
          "aria-expanded": l,
          disabled: s,
          onClick: o,
          children: /* @__PURE__ */ r(ur, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    d,
    /* @__PURE__ */ r("div", { className: "dq-review-header-trail", children: h }),
    /* @__PURE__ */ r("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    p,
    g && /* @__PURE__ */ r("div", { className: "dq-review-chips-after", children: g }),
    m && /* @__PURE__ */ r("div", { className: "dq-review-chips-end", children: m })
  ] });
}
function ws({
  page: e,
  pages: t,
  onPage: n
}) {
  const [a, i] = S(!1), [o, s] = S(""), l = I(null), d = I(null);
  J(() => {
    var g;
    a && ((g = l.current) == null || g.select());
  }, [a]);
  const h = (g) => {
    i(!1), g && requestAnimationFrame(() => {
      var m;
      return (m = d.current) == null ? void 0 : m.focus();
    });
  }, p = () => {
    const g = Math.round(Number(o));
    h(!0), Number.isFinite(g) && g >= 1 && g !== e && n(Math.min(t, g));
  };
  return /* @__PURE__ */ c("span", { className: "dq-pager", children: [
    /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-icon-button",
        "aria-label": "Previous page",
        title: "Previous page",
        disabled: e <= 1,
        onClick: () => n(e - 1),
        children: /* @__PURE__ */ r($r, { "aria-hidden": "true" })
      }
    ),
    a ? /* @__PURE__ */ r(
      "input",
      {
        ref: l,
        type: "number",
        className: "dq-pager-input",
        "aria-label": `Go to page, 1 to ${t}`,
        min: 1,
        max: t,
        value: o,
        onChange: (g) => s(g.target.value),
        onKeyDown: (g) => {
          g.key === "Enter" ? (g.preventDefault(), p()) : g.key === "Escape" && (g.preventDefault(), g.stopPropagation(), h(!0));
        },
        onBlur: () => h(!1)
      }
    ) : /* @__PURE__ */ c(
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
    /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-icon-button",
        "aria-label": "Next page",
        title: "Next page",
        disabled: e >= t,
        onClick: () => n(e + 1),
        children: /* @__PURE__ */ r($o, { "aria-hidden": "true" })
      }
    )
  ] });
}
function ys({
  mode: e,
  disabled: t,
  onChange: n
}) {
  return /* @__PURE__ */ c("div", { className: "dq-segmented", role: "group", "aria-label": "Review layout", children: [
    /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        "aria-pressed": e === "single",
        disabled: t,
        onClick: () => e !== "single" && n("single"),
        children: [
          /* @__PURE__ */ r(vc, { "aria-hidden": "true" }),
          "Single"
        ]
      }
    ),
    /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        "aria-pressed": e === "multiple",
        disabled: t,
        onClick: () => e !== "multiple" && n("multiple"),
        children: [
          /* @__PURE__ */ r(Ha, { "aria-hidden": "true" }),
          "Grid"
        ]
      }
    )
  ] });
}
function ed({
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
function hi({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [a, i] = S(!1), [o, s] = S(!1), l = I(null), d = I(null), h = xt();
  sn(() => {
    if (!a || !d.current || !l.current) return;
    const m = l.current.getBoundingClientRect(), w = d.current.offsetHeight + 12, y = window.innerHeight - m.bottom;
    s(y < w && m.top > y);
  }, [a]), J(() => {
    var m, w;
    a && ((w = (m = d.current) == null ? void 0 : m.querySelector('[role="menuitem"]:not(:disabled)')) == null || w.focus({ preventScroll: !0 }));
  }, [a]), J(() => {
    t && i(!1);
  }, [t]);
  const p = (m = !0) => {
    var w;
    i(!1), m && ((w = l.current) == null || w.focus());
  };
  return /* @__PURE__ */ c("div", { className: `dq-menu${a ? " dq-menu-open" : ""}`, onKeyDown: (m) => {
    var N, A;
    if (!a) return;
    const w = [
      ...((N = d.current) == null ? void 0 : N.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], y = w.indexOf(document.activeElement);
    if (m.key === "Escape")
      m.preventDefault(), m.stopPropagation(), p();
    else if (m.key === "Tab")
      p(!1);
    else if (m.key === "ArrowDown" || m.key === "ArrowUp") {
      if (m.preventDefault(), !w.length) return;
      const E = m.key === "ArrowDown" ? 1 : -1;
      w[(y + E + w.length) % w.length].focus();
    } else (m.key === "Home" || m.key === "End") && (m.preventDefault(), (A = w.at(m.key === "Home" ? 0 : -1)) == null || A.focus());
  }, children: [
    /* @__PURE__ */ r(
      "button",
      {
        ref: l,
        type: "button",
        className: "dq-icon-button",
        "aria-label": n,
        title: n,
        "aria-haspopup": "menu",
        "aria-expanded": a,
        "aria-controls": a ? h : void 0,
        disabled: t,
        onClick: () => i((m) => !m),
        children: /* @__PURE__ */ r(Nc, { "aria-hidden": "true" })
      }
    ),
    a && /* @__PURE__ */ c(he, { children: [
      /* @__PURE__ */ r("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => p(!1) }),
      /* @__PURE__ */ r(
        "div",
        {
          ref: d,
          id: h,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${o ? " dq-menu-list-up" : ""}`,
          children: e.map((m) => /* @__PURE__ */ c(Ja, { children: [
            m.separated && /* @__PURE__ */ r("div", { role: "separator", className: "dq-menu-separator" }),
            /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: m.danger ? "dq-menu-danger" : void 0,
                disabled: m.disabled,
                onClick: () => {
                  p(), m.onSelect();
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
function ra(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function pi(e) {
  return String(e.type).toLowerCase() === "tag";
}
function mi(e) {
  return !!String(e ?? "").trim();
}
function gi(e) {
  return [
    ...new Set(
      ra(e.customFieldCriteria).filter(pi).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !mi(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function bi(e, t) {
  const n = ra(e.customFieldCriteria);
  if (!n.length) return e;
  let a = !1;
  const i = n.map((o) => {
    if (!pi(o)) return o;
    const s = { ...o };
    for (const [l, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const h = t[String(o[l] ?? "")];
      h && !mi(o[d]) && (s[d] = h, a = !0);
    }
    return s;
  });
  return a ? { ...e, customFieldCriteria: i } : e;
}
function vs(e, t, n) {
  const a = ra(e.customFieldCriteria);
  if (!a.length) return e;
  const i = ra(n.customFieldCriteria), o = (d, h) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (p) => (d[p] ?? void 0) === (h[p] ?? void 0)
  );
  let s = !1;
  const l = a.map((d) => {
    if (!pi(d)) return d;
    const h = i.find((g) => o(g, d));
    if (!h) return d;
    const p = { ...d };
    for (const [g, m] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const w = t[String(d[g] ?? "")];
      w && d[m] === w && !mi(h[m]) && (delete p[m], s = !0);
    }
    return p;
  });
  return s ? { ...e, customFieldCriteria: l } : e;
}
async function td(e, t, n) {
  if (!An(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const a = Te(e), i = n.steps.some((l) => En(l.mode)) ? await ll(a) : "", o = await ii(n);
  let s = t.applications;
  for (const l of [
    ...o.filter((d) => !En(d.mode)),
    ...o.filter((d) => En(d.mode))
  ]) {
    const d = (h) => dl(
      i,
      a,
      t.media.id,
      t.performer.id,
      l.tagIds,
      h
    );
    (l.mode === "MARK_PRESENT" || l.mode === "CLEAR_ABSENCE") && await d("REMOVE"), l.mode !== "CLEAR_ABSENCE" && (s = await Es(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: l.tagIds,
          multiple: !0
        }
      },
      t,
      ["ADD", "MARK_PRESENT"].includes(l.mode) ? l.tagIds : []
    )), l.mode === "MARK_ABSENT" && await d("ADD");
  }
  return s;
}
async function wi(e, t) {
  const n = e.occurrence;
  if (ei(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const a = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let s = 1; ; s++) {
    const l = await ce("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        kn({
          findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: o,
          filterExpression: i
        })
      )
    });
    if (l.items.forEach((d) => a.add(d.id)), s * 1e3 >= l.totalCount) return [...a];
    if (!l.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Ns(e) {
  return kr(e.condition) && e.hideConfirmedAbsent !== !1;
}
function yi(e, t) {
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
  }, s = Ns(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: Te(e),
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
                      key: ca,
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
async function vi(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => la([n], t))
  );
}
function qs(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function nd(e, t, n = e.conditionTagIds.map((a) => [a])) {
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
function rd(e, t, n, a, i) {
  if (!Ns(e)) return !1;
  const o = Wo(t, n);
  return e.conditionTagIds.every(
    (s, l) => o.includes(s) || i[l].some((d) => a.includes(d))
  );
}
async function Ss(e, t, n, a) {
  if ((t == null ? void 0 : t.length) === 0 || qs(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = Te(e), o = await Er(
    yi(e, t),
    { ...e.view.filter, page: n },
    a
  ), s = t === null ? null : new Set(t), l = e.occurrence, d = o.items.length ? await vi(l, a) : [], h = new Array(o.items.length);
  let p = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; p < o.items.length; ) {
        const g = p++, m = o.items[g], w = await ce(
          `/api/tagapplications?hostType=${i}&hostId=${m.id}&contextType=performer`,
          { signal: a }
        );
        h[g] = m.performers.filter((y) => s === null || s.has(y.id)).flatMap((y) => {
          const N = w.filter(
            (E) => E.hostType === i && E.hostId === m.id && E.contextType === "performer" && E.contextId === y.id
          ), A = N.map((E) => E.tag.id);
          return nd(e.occurrence, A, d) && !rd(l, m, y.id, A, d) ? [
            {
              key: `${m.id}:${y.id}`,
              media: m,
              performer: y,
              applications: N
            }
          ] : [];
        });
      }
    })
  ), { items: h.flat(), totalCount: o.totalCount };
}
async function Es(e, t, n) {
  const a = new Set(e.occurrence.tagIds);
  if (n.some((h) => !a.has(h)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = Te(e), o = await xa(i, t.media.id);
  if (!o.performers.some(
    (h) => h.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, l = (await ce(s)).filter(
    (h) => h.hostType === i && h.hostId === o.id && h.contextType === "performer" && h.contextId === t.performer.id
  ), d = new Set(n);
  try {
    for (const h of d)
      l.some((p) => p.tag.id === h) || await ce("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: i,
          hostId: o.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: h,
          sourceKey: "user"
        })
      });
    for (const h of l)
      a.has(h.tag.id) && !d.has(h.tag.id) && await ce(`/api/tagapplications/${h.id}`, {
        method: "DELETE"
      });
    return await ce(s);
  } catch (h) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${h instanceof Error ? h.message : "Request failed."}`
    );
  }
}
function hr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function ad(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function Yt(e, t, n = !0) {
  var l;
  if (t.occurrence) {
    const d = n ? Wo(
      await xa(e, t.media.id),
      t.occurrence.performer.id
    ) : [], h = (await ce(ad(e, t))).filter(
      (p) => p.hostType === e && p.hostId === t.media.id && p.contextType === "performer" && p.contextId === t.occurrence.performer.id
    );
    return Da(h.map((p) => p.tag)), {
      ids: [...new Set(h.map((p) => p.tag.id))],
      names: [...new Set(h.map((p) => p.tag.name))],
      absent: d,
      applications: h
    };
  }
  const a = await xa(e, t.media.id), i = (a.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  );
  Da(i);
  const o = Object.keys(a.customFields ?? {}).find(
    (d) => d.toLowerCase() === ta
  ) ?? ta, s = ((l = a.customFields) == null ? void 0 : l[o]) ?? [];
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
async function Ni(e, t, n) {
  if (t.occurrence && ve(e))
    await Es(
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
      i.length && await ce(
        `/api/${_n(Te(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: a, tagIds: i })
        }
      );
}
async function id(e, t, n) {
  t.occurrence && ve(e) ? await td(e, t.occurrence, n) : await Ho(Te(e), n, [t.media.id]);
}
function _a(e, t, n, a) {
  const i = (o) => o.filter((s) => a.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: hr(i(t.ids), i(n.ids)),
    absence: hr(i(t.absent), i(n.absent))
  };
}
function od(e, t) {
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
const ja = (e) => e instanceof Error ? e.message : "Request failed.", Xi = (e) => [...e].sort((t, n) => t - n), Rr = (e, t) => JSON.stringify(Xi(e)) === JSON.stringify(Xi(t)), Ua = (e) => !!(e.tags.added.length || e.tags.removed.length);
function aa(e, t, n, a) {
  const i = new Set(e), o = new Set(e);
  for (const p of t.steps)
    for (const g of p.tagIds)
      p.mode === "ADD" ? o.add(g) : o.delete(g);
  const s = e.some((p) => !o.has(p));
  if (s && !a)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const l = new Set(
    t.steps.filter((p) => p.mode === "ADD").flatMap((p) => p.tagIds)
  ), d = [], h = [];
  for (const p of n) {
    const g = p.filter((w) => o.has(w) && !i.has(w)), m = p.filter(
      (w) => o.has(w) && i.has(w) && !l.has(w)
    );
    !g.length || !m.length || (a ? (m.forEach((w) => o.delete(w)), h.push(...m)) : (g.forEach((w) => o.delete(w)), d.push({ tagIds: g, existing: m })));
  }
  return { desired: [...o], conflict: s, skipped: !1, kept: d, replaced: h };
}
function sd(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function cd(e, t, n, a) {
  for (const [i, o] of n.entries()) {
    const s = t.filter(
      (h) => h.steps.some(
        (p) => p.mode === "ADD" && p.tagIds.some((g) => o.includes(g))
      )
    );
    if (s.length < 2) continue;
    const l = e.occurrence.conditionTagIds[i];
    let d = `tag ${l}`;
    try {
      d = (await ce(`/api/tags/${l}`, { signal: a })).name;
    } catch {
      a.throwIfAborted();
    }
    throw new Error(
      `${s.map((h) => h.label).join(" and ")} answer the same condition tag, ${d}. Choose one of them.`
    );
  }
}
async function ld(e, t, n, a = () => {
}) {
  if (!t.length || t.some(
    (m) => !An(m, e.entityType) || !m.steps.length || m.steps.some(
      (w) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(w.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = kr(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await vi(i.occurrence, n) : [];
  await cd(i, o, s, n);
  const l = await Promise.all(
    o.map(async (m) => ({
      ...m,
      steps: await ii(m, n)
    }))
  ), d = structuredClone(sd(l));
  n.throwIfAborted();
  const h = [
    .../* @__PURE__ */ new Set([
      ...d.steps.flatMap((m) => m.tagIds),
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
  const p = await wi(i, n), g = /* @__PURE__ */ new Map();
  for (let m = 1; ; m++) {
    n.throwIfAborted();
    const w = await Ss(i, p, m, n);
    for (const y of w.items) {
      const N = {
        ids: [...new Set(y.applications.map((E) => E.tag.id))],
        names: y.applications.map((E) => E.tag.name),
        absent: [],
        applications: y.applications
      }, A = aa(N.ids, d, s, !0);
      g.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: N,
        expected: N,
        conflict: A.conflict,
        status: Rr(N.ids, A.desired) ? "unchanged" : "pending"
      });
    }
    if (a(g.size), m * 250 >= w.totalCount) break;
    if (m > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return n.throwIfAborted(), {
    review: i,
    actions: o,
    action: d,
    categories: s,
    touched: h,
    entries: [...g.values()]
  };
}
function dd(e, t, n) {
  const a = (o) => o.ids.filter((s) => n.includes(s));
  if (!Rr(a(e), a(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return Rr(i(e), i(t));
}
async function Cs(e, t, n, a) {
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
function As(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function ks(e) {
  return e.entries.filter((t) => t.operation);
}
async function ud(e, t, n, a, i = !1) {
  await Cs(
    As(e, i),
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
        if (s = await Yt(Te(e.review), o.item, !1), !dd(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (m) {
        o.status = "failed", o.error = ja(m);
        return;
      }
      const l = aa(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), d = [
        ...s.ids.filter((m) => !e.touched.includes(m)),
        ...l.desired.filter((m) => e.touched.includes(m))
      ], h = hr(s.ids, d);
      if (!h.added.length && !h.removed.length) {
        const m = !o.operation && l.kept.length > 0;
        o.status = o.operation ? "changed" : m ? "skipped" : "unchanged", o.error = m ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let p;
      try {
        await Ni(e.review, o.item, h);
      } catch (m) {
        p = m;
      }
      let g = !1;
      try {
        const m = await Yt(Te(e.review), o.item, !1);
        g = !0, o.expected = m;
        const w = _a(
          o.item,
          o.before,
          m,
          e.touched
        );
        if (o.operation = Ua(w) ? w : void 0, p) throw p;
        if (!Rr(
          m.ids.filter((y) => e.touched.includes(y)),
          d.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (m) {
        if (o.status = "failed", o.error = ja(m), !g)
          try {
            const w = await Yt(Te(e.review), o.item, !1);
            o.expected = w;
            const y = _a(
              o.item,
              o.before,
              w,
              e.touched
            );
            o.operation = Ua(y) ? y : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    a
  );
}
async function fd(e, t, n) {
  await Cs(
    ks(e),
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
        const l = await Yt(Te(e.review), a.item, !1);
        od(i, l), s = !0, await Ni(e.review, a.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const d = await Yt(Te(e.review), a.item, !1);
        if (!Rr(
          d.ids.filter((h) => o.includes(h)),
          a.before.ids.filter((h) => o.includes(h))
        ))
          throw new Error("Undo did not restore all affected tags.");
        a.operation = void 0, a.expected = d, a.status = "unchanged", a.error = void 0;
      } catch (l) {
        if (a.error = `Undo stopped: ${ja(l)}`, a.status = "failed", s)
          try {
            const d = await Yt(Te(e.review), a.item, !1), h = _a(
              a.item,
              a.before,
              d,
              o
            );
            a.operation = Ua(h) ? h : void 0, a.expected = d;
          } catch {
            a.unverified = !0;
          }
      }
    },
    n
  );
}
async function hd(e, t, n) {
  const a = Te(e), i = e.occurrence, [o, s] = await Promise.all([
    ce(
      `/api/tagapplications?hostType=${a}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    vi(i, n)
  ]), l = o.filter(
    (y) => y.hostType === a && y.contextType === "performer" && y.contextId === t
  );
  Da(l.map((y) => y.tag));
  const d = await Promise.all(
    s.map(async (y, N) => {
      const A = i.conditionTagIds[N];
      return (await ce(`/api/tags/${A}`, { signal: n })).name;
    })
  ), h = new Set(s.flat()), p = new Set(
    [
      ...e.actions.flatMap((y) => y.steps).filter((y) => y.mode === "ADD" || y.mode === "MARK_PRESENT").flatMap((y) => y.tagIds),
      ...i.tagIds
    ].filter((y) => !h.has(y))
  ), g = (y) => {
    const N = /* @__PURE__ */ new Map();
    for (const A of l) {
      if (!y.has(A.tag.id)) continue;
      const E = N.get(A.tag.id) ?? {
        tag: A.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      E.hosts.add(A.hostId), N.set(A.tag.id, E);
    }
    return [...N.values()].map((A) => ({ ...A.tag, count: A.hosts.size })).sort((A, E) => E.count - A.count || as(A, E));
  }, m = s.map((y, N) => ({
    id: i.conditionTagIds[N],
    name: d[N],
    tags: g(new Set(y))
  }));
  p.size && m.push({
    id: null,
    name: s.length ? "Other review tags" : "Review tags",
    tags: g(p)
  });
  const w = /* @__PURE__ */ new Set([...h, ...p]);
  return {
    answered: new Set(
      l.filter((y) => w.has(y.tag.id)).map((y) => y.hostId)
    ).size,
    groups: m
  };
}
const Ts = rc(!1);
function pd({ children: e }) {
  return /* @__PURE__ */ r(Ts.Provider, { value: !0, children: e });
}
function Gt({ tag: e, name: t }) {
  const n = ac(Ts), a = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ r(sc, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: a ?? void 0 });
}
const Zi = { summary: null, error: "" };
function Rs(e, t, n = 0) {
  const [a, i] = S(Zi), o = e.occurrence, s = JSON.stringify([
    e.entityType,
    t,
    o.condition,
    o.conditionTagIds,
    o.includeSubtags,
    o.tagIds,
    e.actions.map((l) => l.steps)
  ]);
  return J(() => {
    if (i(Zi), t === null) return;
    const l = new AbortController();
    return hd(e, t, l.signal).then((d) => {
      l.signal.aborted || i({ summary: d, error: "" });
    }).catch((d) => {
      l.signal.aborted || i({
        summary: null,
        error: d instanceof Error ? d.message : "Request failed."
      });
    }), () => l.abort();
  }, [s, n]), a;
}
function md({
  review: e,
  performerId: t,
  revision: n = 0
}) {
  const a = Rs(e, t, n);
  return /* @__PURE__ */ r(Ga, { ...a, mediaKind: Te(e) });
}
function Ga({
  summary: e,
  error: t,
  mediaKind: n,
  className: a = ""
}) {
  const i = cn(n), o = (s) => `${s.toLocaleString()} ${s === 1 ? i.one : i.many}`;
  return /* @__PURE__ */ c(
    "section",
    {
      className: `dq-panel-section dq-performer-answers ${a}`.trim(),
      "aria-label": "Existing answers",
      children: [
        /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Existing answers" }),
          e && /* @__PURE__ */ r("span", { children: e.answered ? `${o(e.answered)} answered` : "none answered yet" })
        ] }),
        t ? /* @__PURE__ */ c("p", { role: "alert", children: [
          "Could not load existing answers. ",
          t
        ] }) : e ? e.groups.filter((s) => s.id !== null || s.tags.length).map((s) => /* @__PURE__ */ c("div", { className: "dq-answer-group", children: [
          /* @__PURE__ */ c("div", { className: "dq-answer-category", children: [
            /* @__PURE__ */ r("span", { children: s.name }),
            s.id !== null && s.tags.length > 1 && /* @__PURE__ */ r(
              "span",
              {
                className: "dq-badge dq-badge-warning",
                title: "This performer has different answers in this category.",
                children: "Mixed"
              }
            )
          ] }),
          s.tags.length ? /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": s.name, children: s.tags.map((l) => /* @__PURE__ */ c("li", { className: "dq-tag", children: [
            /* @__PURE__ */ r(Gt, { tag: l }),
            /* @__PURE__ */ r("span", { className: "dq-chip-count", "aria-hidden": "true", children: l.count.toLocaleString() }),
            /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
              ", ",
              o(l.count)
            ] })
          ] }, l.id)) }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" })
        ] }, s.id ?? "other")) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading existing answers…" })
      ]
    }
  );
}
function lr({
  performer: e
}) {
  return /* @__PURE__ */ c("span", { className: "dq-performer-avatar", "aria-hidden": "true", children: [
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
const eo = 5;
function gd(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await ce(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
function bd(e, t) {
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
const to = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), Ka = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], no = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], wd = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, Ca = 250;
function Sr(e, t) {
  var a, i;
  const n = e.item.media;
  return n.title || ((i = (a = n.files) == null ? void 0 : a[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function yd({ step: e }) {
  const t = Ka.findIndex((n) => n.id === e);
  return /* @__PURE__ */ r("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Ka.map((n, a) => {
    const i = a < t ? "done" : a === t ? "current" : "next";
    return /* @__PURE__ */ c("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ r(Ya, {}) : a + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function ro({ parts: e, id: t }) {
  return /* @__PURE__ */ r("span", { className: "dq-batch-effect", id: t, children: e.map((n, a) => /* @__PURE__ */ c(Ja, { children: [
    a > 0 && " ",
    /* @__PURE__ */ r("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, a)) });
}
function qr({
  value: e,
  label: t,
  detail: n,
  tone: a,
  pressed: i,
  onToggle: o
}) {
  return /* @__PURE__ */ c(
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
        n && /* @__PURE__ */ c(he, { children: [
          " ",
          /* @__PURE__ */ r("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function ao({
  added: e,
  removed: t,
  tag: n,
  label: a
}) {
  return /* @__PURE__ */ c("ul", { className: "dq-tags", "aria-label": a, children: [
    Qn(e.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ c("ins", { children: [
      "+ ",
      /* @__PURE__ */ r(Gt, { tag: i })
    ] }) }, `added-${i.id}`)),
    Qn(t.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ c("del", { children: [
      "− ",
      /* @__PURE__ */ r(Gt, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function io({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: a,
  describe: i
}) {
  return /* @__PURE__ */ c("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: e }),
      t.length > Ca && /* @__PURE__ */ c("span", { children: [
        "First ",
        Ca.toLocaleString(),
        " of ",
        t.length.toLocaleString()
      ] })
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-batch-list-scroll", children: /* @__PURE__ */ c("table", { children: [
      /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ c("tr", { children: [
        /* @__PURE__ */ r("th", { scope: "col", children: "Occurrence" }),
        /* @__PURE__ */ r("th", { scope: "col", children: "Date" }),
        /* @__PURE__ */ r("th", { scope: "col", children: a })
      ] }) }),
      /* @__PURE__ */ r("tbody", { children: t.slice(0, Ca).map((o) => {
        var s;
        return /* @__PURE__ */ c("tr", { children: [
          /* @__PURE__ */ r("td", { children: /* @__PURE__ */ c(
            "a",
            {
              href: `/${n}/${o.item.media.id}`,
              target: "_blank",
              rel: "noreferrer",
              children: [
                (s = o.item.occurrence) == null ? void 0 : s.performer.name,
                " — ",
                Sr(o, n)
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
function vd(e) {
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
      const s = `${o.status}\0${o.error}`, l = n.get(s) ?? { status: o.status, error: o.error, count: 0 };
      l.count += 1, n.set(s, l);
    }
  return { counts: t, reasons: [...n.values()], recorded: a, retryable: i };
}
function Nd({
  review: e,
  disabled: t,
  performerFlags: n = [],
  trees: a,
  onOpen: i,
  onClose: o,
  onWrite: s
}) {
  const [l, d] = S(!1), [h, p] = S("answers"), [g, m] = S(null), [w, y] = S({}), [N, A] = S([]), [E, _] = S(!1), [O, k] = S(!1), [P, Q] = S(""), [te, X] = S(""), [j, G] = S(null), [Y, C] = S(null), [x, U] = S([]), [ie, Z] = S(0), ne = I(null), F = I(null), pe = I(null), z = I(!1), D = I(!1), de = I(null), Re = I(!1), _e = I(0), mt = I(!1), ct = I({ onClose: o, onWrite: s });
  ct.current = { onClose: o, onWrite: s };
  const nt = xt(), rt = jn(), Pt = h === "run", et = (j == null ? void 0 : j.kind) === "undo", at = Pt && g ? g.review : e, se = at.occurrence, be = Te(at), Ke = cn(be), ln = Ke.queue, je = Pt && g ? g.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((q) => q.steps.length && !Dn(q))
  ), ft = je.filter((q) => N.includes(q.id)), xe = se.targetMode === "selected" && se.performerIds.length === 1, ke = Rs(
    at,
    l && xe ? se.performerIds[0] : null,
    ie
  ), Nt = gi(at.view.objectFilter), Ce = li(
    l ? [...da(je), ...se.conditionTagIds, ...Nt] : []
  ), dn = Ne(() => rs(Ce), [Ce]), Rt = (q) => w[q] ?? Ce[q] ?? { id: q, name: `Tag ${q}` }, un = JSON.stringify(
    Object.fromEntries(
      Nt.flatMap((q) => {
        var K;
        const T = (K = Ce[q]) == null ? void 0 : K.name;
        return T ? [[String(q), T]] : [];
      })
    )
  ), Xt = Ne(
    () => bi(at.view.objectFilter, JSON.parse(un)),
    [at.view.objectFilter, un]
  );
  J(() => {
    var q, T, K;
    l && ((q = ne.current) == null || q.showModal(), (K = (T = ne.current) == null ? void 0 : T.querySelector(".dq-batch-answer input")) == null || K.focus());
  }, [l]), J(() => {
    if (!l) return;
    const q = requestAnimationFrame(() => {
      var re;
      const T = ne.current, K = document.activeElement;
      if (!T || K && K !== document.body && T.contains(K)) return;
      (re = (h === "answers" ? T.querySelector(".dq-batch-answer input:checked") ?? T.querySelector(".dq-batch-answer input") : T.querySelector("[data-batch-focus]")) ?? F.current) == null || re.focus();
    });
    return () => cancelAnimationFrame(q);
  }, [l, h, O, g]), J(() => {
    if (l || t || !z.current) return;
    const q = requestAnimationFrame(() => {
      const T = pe.current;
      if (!z.current || !T || T.disabled) return;
      z.current = !1;
      const K = document.activeElement;
      (!K || K === document.body) && T.focus();
    });
    return () => cancelAnimationFrame(q);
  }, [l, t]), J(() => {
    if (!l || se.targetMode !== "selected") return;
    const q = new AbortController();
    return U([]), gd(se.performerIds.slice(0, eo), q.signal).then((T) => {
      q.signal.aborted || U(T);
    }).catch(() => {
    }), () => q.abort();
  }, [l, se.targetMode, JSON.stringify(se.performerIds)]), J(
    () => () => {
      var q;
      D.current = !0, (q = de.current) == null || q.abort();
    },
    []
  ), J(() => {
    if (!O) return;
    const q = (T) => {
      T.preventDefault(), T.returnValue = "";
    };
    return window.addEventListener("beforeunload", q), () => window.removeEventListener("beforeunload", q);
  }, [O]);
  function le() {
    p("answers"), m(null), y({}), G(null), _(!1), A([]), X(""), Q(""), C(null);
  }
  function lt() {
    mt.current || (d(!1), ct.current.onClose(Re.current), Re.current = !1, le(), z.current = !0);
  }
  function fn(q, T) {
    A(
      (K) => T ? [...K, q] : K.filter((ge) => ge !== q)
    ), m(null), y({}), X(""), Q(""), C(null);
  }
  function Kt() {
    p("answers"), C(null), X("");
  }
  function Tn() {
    p("preview"), g || M();
  }
  function Be() {
    var q;
    D.current = !0, (q = de.current) == null || q.abort(), X("Stopping after in-flight operations settle…");
  }
  function He(q) {
    C(
      (T) => (T == null ? void 0 : T.group) === q.group && T.reason === q.reason ? null : q
    );
  }
  const W = (q, T) => (Y == null ? void 0 : Y.group) === q && Y.reason === T;
  async function M() {
    if (!ft.length || mt.current) return;
    mt.current = !0, k(!0), Q(""), X("Loading all matching occurrences…"), m(null), y({}), C(null);
    const q = new AbortController();
    de.current = q;
    try {
      await bd(_e.current, q.signal);
      const T = await ld(
        e,
        ft,
        q.signal,
        (ge) => X(`Loaded ${ge.toLocaleString()} matching occurrences…`)
      );
      q.signal.throwIfAborted();
      const K = {};
      for (const ge of T.entries)
        for (const re of ge.before.applications ?? [])
          K[re.tag.id] = re.tag;
      y(K), m(T), X("Preview ready. No tags have been changed.");
    } catch (T) {
      Q(
        q.signal.aborted ? "Preview cancelled. No tags were changed." : T instanceof Error ? T.message : String(T)
      ), X("");
    } finally {
      mt.current = !1, k(!1), de.current = null;
    }
  }
  async function Ae(q) {
    if (!g || mt.current) return;
    const T = (q === "undo" ? ks(g) : As(g, q === "retry")).length;
    mt.current = !0, D.current = !1, Re.current = !0, ct.current.onWrite(), k(!0), p("run"), Q(""), G({ kind: q, total: T, done: 0, stopped: !1 }), X(
      q === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const K = () => G((re) => re && { ...re, done: re.done + 1 });
    let ge = !1;
    try {
      q === "undo" ? await fd(g, () => D.current, K) : await ud(g, E, () => D.current, K, q === "retry"), X(
        D.current ? "Stopped after in-flight operations settled. Completed changes are retained." : q === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (re) {
      ge = !0, X(""), Q(re instanceof Error ? re.message : String(re));
    } finally {
      _e.current = Date.now(), mt.current = !1;
      const re = D.current || ge;
      G((Fe) => Fe && { ...Fe, stopped: re }), k(!1), Z((Fe) => Fe + 1);
    }
  }
  const Ve = (g == null ? void 0 : g.entries) ?? [], Bt = Ne(
    () => new Map(
      ((g == null ? void 0 : g.entries) ?? []).map((q) => [
        q.item.key,
        aa(q.before.ids, g.action, g.categories, E)
      ])
    ),
    [g, E]
  ), ee = (q) => Bt.get(q.item.key), qt = (q) => hr(q.before.ids, ee(q).desired), Un = (q) => {
    const T = qt(q);
    return q.status === "pending" && (T.added.length > 0 || T.removed.length > 0);
  }, Vt = (q) => q.conflict || ee(q).kept.length > 0 || ee(q).replaced.length > 0, gt = Ne(() => {
    const q = (g == null ? void 0 : g.entries) ?? [];
    return {
      willChange: q.filter(Un).length,
      correct: q.filter((T) => T.status === "unchanged").length,
      different: q.filter(Vt).length,
      hosts: new Set(q.map((T) => T.item.media.id)).size,
      added: [...new Set(q.flatMap((T) => qt(T).added))],
      removed: [...new Set(q.flatMap((T) => qt(T).removed))]
    };
  }, [Bt]), yt = Ne(
    () => ((g == null ? void 0 : g.entries) ?? []).filter((q) => q.item.media.date).sort((q, T) => q.item.media.date.localeCompare(T.item.media.date)),
    [g]
  ), qe = Pt ? vd(Ve) : null, Ue = (q) => rt.action(at.actions.findIndex((T) => T.id === q)), vt = (q) => Xn(q, dn, [], a), hn = kr(se.condition) && se.includeSubtags !== !1 && se.conditionTagIds.length > 0, it = yt[0], Ye = yt.length > 1 ? yt[yt.length - 1] : void 0, Jt = (q) => `/${be}/${q.item.media.id}`, dt = xe ? x[0] : void 0, Zt = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: Un },
    correct: { title: "Occurrences already correct", test: (q) => q.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: Vt }
  };
  function St() {
    const q = wd[se.condition], T = !!q && se.conditionTagIds.length > 0, K = se.performerIds.slice(0, eo), ge = String(at.view.filter.q ?? "").trim(), re = se.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ c("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      ei(se) ? /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "All performers" }) : se.targetMode === "selected" ? /* @__PURE__ */ c(he, { children: [
        K.map((Fe, Pe) => /* @__PURE__ */ c("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ r(lr, { performer: { id: Fe, name: x[Pe] ?? "" } }),
          x[Pe] ?? "…"
        ] }, Fe)),
        se.performerIds.length > K.length && /* @__PURE__ */ c("span", { className: "dq-batch-chip", children: [
          (se.performerIds.length - K.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ c(he, { children: [
        /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ r(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ r(
              Ar,
              {
                filter: {},
                objectFilter: se.performerFilter,
                criteriaDefinitions: za,
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
      /* @__PURE__ */ c("span", { className: "dq-batch-chip", children: [
        T ? q : Xa[se.condition],
        T && /* @__PURE__ */ r("span", { className: "dq-batch-chip-tags", children: Qn(se.conditionTagIds.map(Rt)).map((Fe) => /* @__PURE__ */ r(Gt, { tag: Fe }, Fe.id)) })
      ] }),
      T && /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: se.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      kr(se.condition) && se.hideConfirmedAbsent !== !1 && /* @__PURE__ */ c("span", { className: "dq-batch-chip", title: re, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
          ": ",
          re
        ] })
      ] }),
      ge && /* @__PURE__ */ c("span", { className: "dq-batch-chip", children: [
        "Search “",
        ge,
        "”"
      ] }),
      Object.keys(at.view.objectFilter).length > 0 && /* @__PURE__ */ r(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${ln} filters`,
          children: /* @__PURE__ */ r(
            Ar,
            {
              filter: at.view.filter,
              objectFilter: Xt,
              criteriaDefinitions: be === "audio" ? vo : Qa,
              customFieldEntityType: be,
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
  function we(q) {
    return n.length ? /* @__PURE__ */ c("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ r(Zr, { "aria-hidden": "true" }),
      /* @__PURE__ */ c("div", { children: [
        /* @__PURE__ */ c("p", { children: [
          /* @__PURE__ */ r("strong", { children: dt || "This performer" }),
          " is flagged:",
          " ",
          /* @__PURE__ */ r("strong", { children: n.join(", ") }),
          ". Check the earliest and latest",
          " ",
          Ke.many,
          " before applying, or narrow the batch with a date filter."
        ] }),
        q && it && /* @__PURE__ */ c("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ c("a", { href: Jt(it), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            Sr(it, be),
            " · ",
            it.item.media.date
          ] }),
          Ye && /* @__PURE__ */ c("a", { href: Jt(Ye), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            Sr(Ye, be),
            " · ",
            Ye.item.media.date
          ] })
        ] })
      ] })
    ] }) : null;
  }
  function Et() {
    return /* @__PURE__ */ c(he, { children: [
      St(),
      we(!1),
      /* @__PURE__ */ c("div", { className: `dq-batch-pick${xe ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ c("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ r("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ r("div", { className: "dq-batch-answers", children: je.map((q, T) => {
            const K = Ue(q.id);
            return /* @__PURE__ */ c("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ r(
                "input",
                {
                  type: "checkbox",
                  checked: N.includes(q.id),
                  "aria-labelledby": `${nt}-answer-${T}`,
                  "aria-describedby": `${nt}-effect-${T}`,
                  onChange: (ge) => fn(q.id, ge.target.checked)
                }
              ),
              /* @__PURE__ */ r("span", { className: "dq-batch-answer-key", children: K && /* @__PURE__ */ r(pt, { binding: K, hidden: !0 }) }),
              /* @__PURE__ */ c("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ r(
                  "span",
                  {
                    id: `${nt}-answer-${T}`,
                    className: "dq-batch-answer-label",
                    title: q.label,
                    children: q.label
                  }
                ),
                /* @__PURE__ */ r(ro, { id: `${nt}-effect-${T}`, parts: vt(q) })
              ] })
            ] }, q.id);
          }) })
        ] }),
        xe && /* @__PURE__ */ r(Ga, { ...ke, mediaKind: be, className: "dq-batch-card" })
      ] })
    ] });
  }
  function Gn(q) {
    const T = gt, K = Y && to.has(Y.group) ? Y.group : null, ge = K ? Ve.filter(Zt[K].test) : [], re = (Fe) => {
      const Pe = ee(Fe), Ct = Pe.skipped ? hr(
        Fe.before.ids,
        aa(Fe.before.ids, q.action, q.categories, !0).desired
      ) : qt(Fe), mn = !Ct.added.length && !Ct.removed.length;
      return /* @__PURE__ */ c("div", { className: "dq-batch-plan", children: [
        Pe.skipped && /* @__PURE__ */ r("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        mn ? !Pe.kept.length && /* @__PURE__ */ r("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ r(ao, { added: Ct.added, removed: Ct.removed, tag: Rt }),
        Pe.kept.map((me, Se) => /* @__PURE__ */ c("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          Qn(me.existing.map(Rt)).map((ze) => /* @__PURE__ */ r(Gt, { tag: ze }, ze.id)),
          " ",
          "instead of",
          " ",
          Qn(me.tagIds.map(Rt)).map((ze) => /* @__PURE__ */ r(Gt, { tag: ze }, ze.id))
        ] }, Se))
      ] });
    };
    return /* @__PURE__ */ c(he, { children: [
      /* @__PURE__ */ c("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ c("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ r(
            qr,
            {
              value: Ve.length,
              label: Ve.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${T.hosts.toLocaleString()} ${T.hosts === 1 ? ln : `${ln}s`}`,
              pressed: W("matching"),
              onToggle: () => He({ group: "matching" })
            }
          ),
          /* @__PURE__ */ r(
            qr,
            {
              value: T.willChange,
              label: "will change",
              tone: "add",
              pressed: W("change"),
              onToggle: () => He({ group: "change" })
            }
          ),
          /* @__PURE__ */ r(
            qr,
            {
              value: T.correct,
              label: "already correct, no write",
              pressed: W("correct"),
              onToggle: () => He({ group: "correct" })
            }
          ),
          /* @__PURE__ */ r(
            qr,
            {
              value: T.different,
              label: E ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: W("different"),
              onToggle: () => He({ group: "different" })
            }
          )
        ] }),
        ge.length > 0 ? /* @__PURE__ */ r(
          io,
          {
            title: Zt[K].title,
            entries: ge,
            mediaKind: be,
            resultHeading: "Planned change",
            describe: re
          }
        ) : Ve.length > 0 && /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        Ve.length > 0 && /* @__PURE__ */ c("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ r("span", { children: it ? `Dates ${it.item.media.date}${Ye ? ` to ${Ye.item.media.date}` : ""}` : "No dates" }),
          it && /* @__PURE__ */ r(
            "a",
            {
              href: Jt(it),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${Ke.one}, ${it.item.media.date}`,
              title: Sr(it, be),
              children: "Open earliest"
            }
          ),
          Ye && /* @__PURE__ */ r(
            "a",
            {
              href: Jt(Ye),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${Ke.one}, ${Ye.item.media.date}`,
              title: Sr(Ye, be),
              children: "Open latest"
            }
          ),
          yt.length < Ve.length && /* @__PURE__ */ c("span", { children: [
            (Ve.length - yt.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (T.added.length > 0 || T.removed.length > 0) && /* @__PURE__ */ c("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ r("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ r(
            ao,
            {
              added: T.added,
              removed: T.removed,
              tag: Rt,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      T.different > 0 && /* @__PURE__ */ c("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ r("span", { id: `${nt}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ c(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${nt}-choice`,
            children: [
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": !E, onClick: () => _(!1), children: "Keep their answer" }),
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": E, onClick: () => _(!0), children: "Replace it" })
            ]
          }
        ),
        /* @__PURE__ */ c("p", { className: "dq-muted", children: [
          "A different answer is a tag the chosen answers would remove",
          hn ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function pn() {
    return /* @__PURE__ */ c(he, { children: [
      St(),
      we(!0),
      /* @__PURE__ */ c("div", { className: `dq-batch-cards${xe ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ c("section", { className: "dq-batch-card", "aria-labelledby": `${nt}-chosen`, children: [
          /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ r("h3", { id: `${nt}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", disabled: O, onClick: Kt, children: "Change" })
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-chosen", children: ft.map((q) => {
            const T = Ue(q.id);
            return /* @__PURE__ */ c("li", { children: [
              /* @__PURE__ */ c("span", { className: "dq-batch-chosen-chip", children: [
                T && /* @__PURE__ */ r(pt, { binding: T, hidden: !0 }),
                q.label
              ] }),
              /* @__PURE__ */ r(ro, { parts: vt(q) })
            ] }, q.id);
          }) })
        ] }),
        xe && /* @__PURE__ */ r(Ga, { ...ke, mediaKind: be, className: "dq-batch-card" })
      ] }),
      O ? /* @__PURE__ */ r("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ r("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ r("span", {}) }) }) : g && Gn(g)
    ] });
  }
  function Je(q) {
    const T = j ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, K = T.kind === "apply" ? Ve.length - q.counts.pending : T.done, ge = T.kind === "apply" ? Ve.length : T.total, re = O ? T.kind === "undo" ? "Undoing batch…" : T.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : T.kind === "undo" ? T.stopped ? "Undo stopped" : "Undo finished" : T.stopped ? "Stopped" : "Finished", Fe = ge ? Math.round(K / ge * 100) : 100, Pe = Y && !to.has(Y.group) ? Y.group : null, Ct = (me) => no.find((Se) => Se.status === me).label, mn = Pe ? Ve.filter(
      (me) => me.status === Pe && (!Y.reason || me.error === Y.reason)
    ) : [];
    return /* @__PURE__ */ c(he, { children: [
      /* @__PURE__ */ c("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ r("h3", { tabIndex: -1, "data-batch-focus": "", children: re }),
          /* @__PURE__ */ c("span", { children: [
            K.toLocaleString(),
            " of ",
            ge.toLocaleString(),
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
            "aria-valuemax": ge,
            "aria-valuenow": K,
            children: /* @__PURE__ */ r("span", { style: { width: `${Fe}%` } })
          }
        ),
        !O && T.kind === "undo" && /* @__PURE__ */ c("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (T.total - q.recorded).toLocaleString(),
          " of",
          " ",
          T.total.toLocaleString(),
          " ",
          T.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ c("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ r("div", { className: "dq-batch-stats", "data-count": "5", children: no.map((me) => /* @__PURE__ */ r(
          qr,
          {
            value: q.counts[me.status],
            label: me.label,
            tone: me.tone,
            pressed: W(me.status),
            onToggle: () => He({ group: me.status })
          },
          me.status
        )) }),
        q.reasons.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-batch-reasons", children: q.reasons.map((me) => {
          const Se = W(me.status, me.error);
          return /* @__PURE__ */ c("li", { children: [
            /* @__PURE__ */ c("span", { children: [
              me.count.toLocaleString(),
              " ",
              me.status,
              ": ",
              me.error
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": Se,
                onClick: () => He({ group: me.status, reason: me.error }),
                children: Se ? "Hide them" : "Show them"
              }
            )
          ] }, `${me.status}-${me.error}`);
        }) }),
        mn.length > 0 ? /* @__PURE__ */ r(
          io,
          {
            title: Y.reason ? `${Ct(Pe)}: ${Y.reason}` : `${Ct(Pe)} occurrences`,
            entries: mn,
            mediaKind: be,
            resultHeading: "Result",
            describe: (me) => me.error ?? Ct(me.status)
          }
        ) : /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      q.recorded > 0 && /* @__PURE__ */ c("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: O,
            onClick: () => void Ae("undo"),
            children: [
              /* @__PURE__ */ r(qc, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ c("p", { children: [
          et ? T.stopped || O ? `${q.recorded.toLocaleString()} ${q.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${q.recorded.toLocaleString()} ${q.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${q.recorded === 1 ? "this change" : `these ${q.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function zt() {
    return h === "answers" ? /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !ft.length,
        onClick: Tn,
        children: "Preview all matches"
      },
      "preview"
    ) : h === "preview" ? O ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: Be, children: "Cancel preview" }, "cancel-preview") : g ? /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !gt.willChange,
        onClick: () => void Ae("apply"),
        children: [
          "Apply to ",
          gt.willChange.toLocaleString(),
          " ",
          gt.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void M(),
        children: "Preview again"
      },
      "again"
    ) : O ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: Be, children: et ? "Cancel undo" : "Cancel run" }, "cancel-run") : et || !qe ? null : /* @__PURE__ */ c(Ja, { children: [
      qe.retryable && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: () => void Ae("retry"), children: "Retry failed" }),
      qe.counts.pending > 0 && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void Ae("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ c(pd, { children: [
    /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: pe,
        title: "Apply answers to all matching occurrences",
        disabled: t || !je.length,
        onClick: () => {
          le(), i(), d(!0);
        },
        children: [
          /* @__PURE__ */ r(Pi, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    l && /* @__PURE__ */ c(
      "dialog",
      {
        ref: ne,
        className: "dq-batch-dialog",
        "aria-labelledby": `${nt}-title`,
        "aria-modal": "true",
        onCancel: (q) => {
          q.preventDefault(), lt();
        },
        onClose: () => {
          var q;
          mt.current ? (q = ne.current) == null || q.showModal() : lt();
        },
        children: [
          /* @__PURE__ */ c("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ r(Pi, { "aria-hidden": "true" }),
            /* @__PURE__ */ r("h2", { id: `${nt}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: O,
                onClick: lt,
                children: /* @__PURE__ */ r(Ir, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r(yd, { step: h }),
          /* @__PURE__ */ c(
            "div",
            {
              className: "dq-batch-body",
              ref: F,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": h === "preview" ? "" : void 0,
              "aria-label": `${Ka.find((q) => q.id === h).label} step`,
              children: [
                /* @__PURE__ */ c("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  te && /* @__PURE__ */ r("p", { role: "status", children: te }),
                  P && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: P })
                ] }),
                h === "answers" ? Et() : h === "preview" ? pn() : Je(qe)
              ]
            }
          ),
          /* @__PURE__ */ c("div", { className: "dq-batch-footer", children: [
            h === "preview" && /* @__PURE__ */ c("button", { type: "button", className: "dq-button", disabled: O, onClick: Kt, children: [
              /* @__PURE__ */ r($r, { "aria-hidden": "true" }),
              "Back"
            ] }),
            h === "run" && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: O, onClick: le, children: "New batch" }),
            /* @__PURE__ */ r("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: O, onClick: lt, children: "Close" }),
            zt()
          ] })
        ]
      }
    )
  ] });
}
const Is = "data-quality.description-collapsed.v1";
function qd() {
  try {
    return localStorage.getItem(Is) === "true";
  } catch {
    return !1;
  }
}
function Sd({
  details: e,
  label: t
}) {
  const [n, a] = S(qd), i = Sn(() => {
    a((o) => {
      const s = !o;
      try {
        localStorage.setItem(Is, String(s));
      } catch {
      }
      return s;
    });
  }, []);
  return /* @__PURE__ */ c("section", { className: "dq-media-description", "aria-label": `${t} description`, children: [
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ r(cc, { className: "dq-description-body", children: e }) : /* @__PURE__ */ r("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
function Ed({
  ranking: e,
  busy: t,
  error: n,
  focus: a,
  disabled: i,
  labels: o,
  onFocus: s,
  onMore: l,
  onRefresh: d
}) {
  var g;
  const h = e ? e.ranked.slice(0, e.limit) : [], p = !!e && (e.ranked.length > e.limit || (((g = e.candidates[e.cursor]) == null ? void 0 : g.total) ?? 0) > 0);
  return /* @__PURE__ */ c("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ c("div", { className: "dq-performer-ranking-status", children: [
      n ? /* @__PURE__ */ c("p", { role: "alert", children: [
        "Could not rank performers. ",
        n
      ] }) : t ? /* @__PURE__ */ c("p", { role: "status", children: [
        "Counting matching ",
        o.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ r("p", { children: h.length ? `Most matching ${o.queue}s first` : `No performer has matching ${o.many}.` }) : null,
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "Refresh counts",
          title: "Refresh counts",
          disabled: t || i,
          onClick: d,
          children: /* @__PURE__ */ r(Sc, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-queue-list", children: h.map((m) => {
      const w = `${m.count.toLocaleString()} matching ${m.count === 1 ? o.one : o.many}`, y = m.flags.length ? `Flagged: ${m.flags.join(", ")}` : "";
      return /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${m.name}, ${w}${y ? `. ${y}` : ""}`,
          title: y || void 0,
          "aria-current": a === m.id ? "true" : void 0,
          disabled: i,
          onClick: () => s(m.id),
          children: [
            /* @__PURE__ */ r(lr, { performer: m }),
            /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: m.name }),
            y && /* @__PURE__ */ r(Zr, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ r("span", { className: "dq-ranked-count", "aria-hidden": "true", children: m.count.toLocaleString() })
          ]
        },
        m.id
      );
    }) }),
    p && !t && !n && /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button dq-ranking-more",
        disabled: i,
        onClick: l,
        children: "Show more performers"
      }
    )
  ] });
}
const Cd = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], Ad = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function kd(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), a = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: a, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function Wr(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Td(e, t) {
  const n = ei(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", a = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Wr(a, "or")}`,
    includesAll: `has ${Wr(a, "and")}`,
    excludes: `has none of ${Wr(a, "or")}`,
    excludesAll: `missing ${Wr(a, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function Rd({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: a,
  onEditCriteria: i
}) {
  const [o, s] = S(!1), [l, d] = S(null), h = I(null), p = I(null), g = xt(), m = pr(e.conditionTagIds), w = Td(e, m);
  sn(() => {
    if (!o || !h.current) return;
    const E = () => h.current && d(kd(h.current));
    return E(), window.addEventListener("resize", E), () => window.removeEventListener("resize", E);
  }, [o]), J(() => {
    var _, O;
    if (!o) return;
    const E = (_ = p.current) == null ? void 0 : _.querySelector('[aria-pressed="true"]');
    E && !E.disabled ? E.focus() : (O = p.current) == null || O.focus();
  }, [o]);
  const y = () => {
    s(!1), requestAnimationFrame(() => {
      var E;
      return (E = h.current) == null ? void 0 : E.focus();
    });
  }, N = (E) => {
    if (!(E.target instanceof Element && E.target.closest('[role="dialog"]') !== p.current || E.defaultPrevented)) {
      if (E.key === "Escape")
        E.preventDefault(), y();
      else if (E.key === "Tab" && p.current) {
        const O = [...p.current.querySelectorAll(Ad)].filter((te) => te.closest('[role="dialog"]') === p.current).sort(
          (te, X) => te.compareDocumentPosition(X) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!O.length) return;
        const k = O[0], P = O[O.length - 1], Q = document.activeElement;
        E.shiftKey && (Q === k || Q === p.current) ? (E.preventDefault(), P.focus()) : !E.shiftKey && Q === P && (E.preventDefault(), k.focus());
      }
    }
  }, A = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ c("div", { className: "dq-scope", children: [
    /* @__PURE__ */ c(
      "button",
      {
        ref: h,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        "aria-controls": o ? g : void 0,
        title: w,
        onClick: () => o ? y() : s(!0),
        children: [
          /* @__PURE__ */ r(To, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-summary", children: w }),
          /* @__PURE__ */ r(ko, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ c(he, { children: [
      /* @__PURE__ */ r("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: y }),
      /* @__PURE__ */ c(
        "div",
        {
          ref: p,
          id: g,
          role: "dialog",
          "aria-label": "Queue scope",
          className: "dq-scope-popover",
          tabIndex: -1,
          style: l ? {
            top: l.top,
            left: l.left,
            width: l.width,
            maxHeight: l.maxHeight
          } : void 0,
          onKeyDown: N,
          children: [
            /* @__PURE__ */ c("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: Cd.map(({ mode: E, label: _ }) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === E,
                  onClick: () => e.targetMode !== E && a({ targetMode: E }),
                  children: _
                },
                E
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ r(
                Cn,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (E) => a({ performerIds: E }),
                  placeholder: "All performers...",
                  allowCreate: !1
                }
              ),
              e.targetMode === "filter" && /* @__PURE__ */ c("div", { className: "dq-scope-criteria", children: [
                /* @__PURE__ */ r("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ r(
                  Ar,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: za,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (E) => a({ performerFilter: E })
                  }
                ) }),
                /* @__PURE__ */ c("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ r(ur, { "aria-hidden": "true" }),
                  "Edit criteria"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Occurrence tags" }),
              /* @__PURE__ */ r(
                "select",
                {
                  className: "dq-select",
                  "aria-label": "Occurrence condition",
                  value: e.condition,
                  onChange: (E) => a({ condition: E.target.value }),
                  children: Za.map((E) => /* @__PURE__ */ r("option", { value: E, children: Xa[E] }, E))
                }
              ),
              A && /* @__PURE__ */ c(he, { children: [
                /* @__PURE__ */ r(
                  Cn,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (E) => a({ conditionTagIds: E }),
                    placeholder: "Add a condition tag…",
                    allowCreate: !1
                  }
                ),
                /* @__PURE__ */ c("div", { className: "dq-scope-options", children: [
                  /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.includeSubtags ?? !0,
                        onChange: (E) => a({ includeSubtags: E.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  kr(e.condition) && /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.hideConfirmedAbsent ?? !0,
                        onChange: (E) => a({ hideConfirmedAbsent: E.target.checked })
                      }
                    ),
                    "Hide occurrences confirmed absent"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("div", { className: "dq-scope-footer", children: [
              /* @__PURE__ */ r("p", { children: n ? "Applies to this queue at once, and Save review keeps it." : "Applies to this queue at once. Save it to the review from the filter row." }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: y, children: "Done" })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function Xr(e) {
  const {
    page: t,
    perPage: n,
    sort: a,
    direction: i,
    sorts: o,
    seed: s,
    ...l
  } = e.view.filter;
  return JSON.stringify([
    e.entityType,
    l,
    e.view.objectFilter,
    e.view.searchMode,
    e.occurrence
  ]);
}
function Id(e) {
  const t = e.occurrence;
  return JSON.stringify([
    Te(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {},
    t.flagPerformerTagIds ?? []
  ]);
}
async function $d(e, t) {
  const n = Te(e) === "audio", a = new Set(e.occurrence.flagPerformerTagIds ?? []), i = (l) => ({
    id: l.id,
    name: l.name,
    total: (n ? l.audioCount : l.videoCount) ?? 0,
    flags: (l.tags ?? []).filter((d) => a.has(d.id)).map((d) => d.name)
  }), o = e.occurrence, s = [];
  if (o.targetMode === "selected" && o.performerIds.length > 0)
    for (const l of o.performerIds) {
      const d = await Xc(
        `/api/performers/${l}`,
        { signal: t }
      );
      d && s.push(i(d));
    }
  else {
    const { _filterExpression: l, ...d } = o.targetMode === "filter" ? o.performerFilter : {};
    for (let h = 1; ; h++) {
      const p = await ce(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            kn({
              findFilter: {
                page: h,
                perPage: 1e3,
                sort: n ? "audio_count" : "video_count",
                direction: "desc"
              },
              objectFilter: d,
              filterExpression: l
            })
          )
        }
      );
      if (s.push(...p.items.map(i)), h * 1e3 >= p.totalCount || !p.items.length) break;
    }
  }
  return s.sort((l, d) => d.total - l.total || l.id - d.id);
}
function $s(e, t, n) {
  const a = yi(e, [t]);
  return tl(a, a.view.filter, n);
}
function Os(e, t) {
  const n = e.findIndex(
    (a) => a.count < t.count || a.count === t.count && a.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function Ba(e, t, n, a) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= a && i < n[a - 1].count;
}
async function Od(e, t, n, a, i = {}) {
  const o = Xr(e), s = Id(e), l = qs(e.occurrence), d = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: l ? "" : s,
    candidates: l ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await $d(e, a),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: h } = d, p = [...d.ranked];
  let g = d.cursor, m = !1;
  const w = (y) => ({
    ...d,
    cursor: g,
    ranked: [...p],
    limit: n,
    complete: !y && Ba(h, g, p, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var y;
        for (; !m && !Ba(h, g, p, n); ) {
          a.throwIfAborted();
          const N = h[g++], A = await $s(e, N.id, a);
          A > 0 && Os(p, { ...N, count: A }), (y = i.onProgress) == null || y.call(i, w(!0));
        }
      })
    );
  } catch (y) {
    throw m = !0, y;
  }
  return a.throwIfAborted(), w(!1);
}
function Fd(e, t, n) {
  const a = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || a < 0 || a >= e.cursor) return e;
  const i = e.ranked.filter((o) => o.id !== t);
  return n > 0 && Os(i, { ...e.candidates[a], count: n }), {
    ...e,
    ranked: i,
    complete: Ba(e.candidates, e.cursor, i, e.limit)
  };
}
function Hn(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, l) => Hn(s, t[l]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, a = t, i = Object.keys(n).sort(), o = Object.keys(a).sort();
  return i.length === o.length && i.every(
    (s, l) => s === o[l] && Hn(n[s], a[s])
  );
}
function Md(e) {
  var l, d, h;
  const [t, n] = S({}), [a, i] = S(""), o = (((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotations) ?? []).includes("tags") ? ((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...o,
      ...((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.binParents) ?? []
    ])
  ]);
  return J(() => {
    let p = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(s).map(
        async (g) => [g, await la([g])]
      )
    ).then((g) => {
      p && n(Object.fromEntries(g));
    }).catch(() => {
      p && i(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      p = !1;
    };
  }, [s]), { ids: t, error: a };
}
function xd(e, t, n) {
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
        (l) => {
          var d;
          return l !== s.id && ((d = n[l]) == null ? void 0 : d.includes(s.id));
        }
      )
    ) : []
  };
}
function Pd({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: a,
  disabled: i,
  onToggle: o
}) {
  var y;
  const s = ((y = t.presentation) == null ? void 0 : y.binParents) ?? [], l = new Set(
    s.flatMap((N) => (a[N] ?? []).filter((A) => A !== N))
  ), d = s.every((N) => a[N]), h = Mr(t.view.objectFilter, n).bins.filter(
    (N) => !d || l.has(N)
  ), p = /* @__PURE__ */ new Map();
  for (const N of e)
    for (const A of N.tags ?? [])
      if (l.has(A.id)) {
        const E = p.get(A.id) ?? { name: A.name, count: 0 };
        E.count++, p.set(A.id, E);
      }
  const g = h.filter((N) => !p.has(N)), m = pr(g);
  for (const N of g)
    p.set(N, {
      name: m[N] === void 0 ? "…" : m[N] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const w = [...p].sort((N, A) => N[1].name.localeCompare(A[1].name));
  return /* @__PURE__ */ c("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ r("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    w.map(([N, A]) => {
      const E = h.includes(N);
      return /* @__PURE__ */ c(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": E,
          title: E ? `Show every video again, not only ${A.name}` : `Show only videos tagged ${A.name}`,
          disabled: i,
          onClick: () => o(N),
          children: [
            E && /* @__PURE__ */ r(Ya, { "aria-hidden": "true" }),
            A.name,
            " ",
            /* @__PURE__ */ r("span", { className: "dq-bin-count", children: A.count })
          ]
        },
        N
      );
    }),
    !w.length && /* @__PURE__ */ r("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function zn(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Ld(e) {
  if (!zn(e) || Object.keys(e).length !== 1 || !zn(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !zn(t.tagsCriterion)) return null;
  const { value: n, modifier: a, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && a === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function Mr(e, t) {
  let n = e;
  const a = [];
  for (; ; ) {
    if (t && Hn(n, t)) {
      n = t;
      break;
    }
    const i = Object.keys(n);
    if (i.length !== 1 || i[0] !== "_filterExpression") break;
    const o = n._filterExpression;
    if (!zn(o) || o.operator !== "AND" || !Array.isArray(o.children))
      break;
    const s = o.children, l = Ld(s.at(-1));
    if (l == null || s.length > 3) break;
    let d = {}, h = null, p = !0;
    for (const [g, m] of s.slice(0, -1).entries())
      !zn(m) || Object.keys(m).length !== 1 ? p = !1 : g === 0 && zn(m.filter) && Object.keys(m.filter).length ? d = m.filter : !h && zn(m.group) ? h = m.group : p = !1;
    if (!p) break;
    a.unshift(l), n = h ? { ...d, _filterExpression: h } : d;
  }
  return { base: n, bins: a };
}
function Dd(e, t, n) {
  const { base: a, bins: i } = Mr(e.view.objectFilter, n);
  return (i.includes(t) ? i.filter((s) => s !== t) : [...i, t]).reduce(_d, { ...e, view: { ...e.view, objectFilter: a } });
}
function _d(e, t) {
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
const ua = [
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
], jd = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function Yn(e) {
  const t = ve(e) ? e.occurrence : void 0;
  return {
    filter: Mt({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, Te(e)),
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
function oo(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function Va(e, t) {
  let n;
  if (ve(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!ua.some((l) => l !== "performer" && t.has(l))) {
    const l = Yn(e);
    return {
      query: n ? { ...l, performerFocus: n } : l,
      startAtEnd: l.startFrom === "end"
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
    const l = t.get("sorts").split(",").map((d) => {
      const h = d.lastIndexOf(":");
      return { key: d.slice(0, h), direction: d.slice(h + 1) };
    });
    if (l.some((d) => !d.key || !["asc", "desc"].includes(d.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = l, i.sort = l[0].key, i.direction = l[0].direction;
  }
  let o;
  if (ve(e) && (o = {
    ...jd,
    ...oo(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !Za.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (l) => !Number.isSafeInteger(l) || l <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Mt(i, Te(e)),
      objectFilter: oo(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
function Cr(e, t) {
  const n = new URLSearchParams(window.location.search);
  ua.forEach((a) => n.delete(a)), n.set("review", e);
  for (const a of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[a] !== void 0 && n.set(a, String(t.filter[a]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((a) => `${a.key}:${a.direction}`).join(",")
  ), n.set("filters", JSON.stringify(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${n}${window.location.hash}`
  );
}
function on(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return ve(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function Wn(e) {
  const t = e;
  return on(t, Yn(t));
}
function so(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !Hn(
    JSON.parse(Ln(on(e, t))),
    JSON.parse(Ln(on(e, Yn(e))))
  );
}
function Fs(e, t) {
  if (Oe(e) !== "video") return e;
  const { base: n, bins: a } = Mr(e.view.objectFilter, t.view.objectFilter);
  return a.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function Hr(e, t) {
  if (Oe(e) !== "video") return t;
  const { base: n, bins: a } = Mr(t.objectFilter, e.view.objectFilter);
  return a.length ? { ...t, objectFilter: n } : t;
}
function co(e, t) {
  return !t || !ve(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function Aa(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const a of e)
    n.set(a.media.id, [...n.get(a.media.id) ?? [], a]);
  return [...n.values()].reverse().flat();
}
const Ut = (e) => e instanceof Error ? e.message : "Request failed.", ka = 50, Ud = [], lo = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function Gd(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? fc(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? So(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Kd({ media: e, kind: t }) {
  const [n, a] = S(!1);
  return /* @__PURE__ */ r("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ r(Io, {}) : /* @__PURE__ */ r(oa, {}) : /* @__PURE__ */ r(
    "img",
    {
      src: Pa(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => a(!0)
    }
  ) });
}
function Bd({
  tags: e,
  preview: t,
  showPreview: n,
  trees: a,
  actionTagIds: i,
  label: o
}) {
  const s = ui(t), l = n ? s : null, d = e == null ? void 0 : e.absent, h = li(
    Ne(() => [...i, ...d ?? []], [i, d])
  ), p = (P) => h[P] ?? { id: P, name: h[P] === void 0 ? "…" : "Unavailable tag" }, g = (P) => Qn(P.map(p)), m = l && e ? is(l, e, a) : null, w = e ? Nl(e) : [], y = new Set(w.map((P) => P.id)), N = new Set(m == null ? void 0 : m.removed), A = new Set(m == null ? void 0 : m.markedAbsent), E = new Set(m == null ? void 0 : m.absenceCleared), _ = /* @__PURE__ */ c("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ r($a, { "aria-hidden": "true" }),
    "absent"
  ] }), O = g((m == null ? void 0 : m.added) ?? []), k = g(((m == null ? void 0 : m.markedAbsent) ?? []).filter((P) => !y.has(P)));
  return /* @__PURE__ */ c("section", { className: "dq-panel-section", "aria-label": o, children: [
    /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ c(he, { children: [
      w.length || O.length || k.length ? /* @__PURE__ */ c("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        w.map(
          (P) => N.has(P.id) ? /* @__PURE__ */ c("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ c("del", { children: [
              "− ",
              /* @__PURE__ */ r(Gt, { tag: P })
            ] }),
            A.has(P.id) && _
          ] }, P.id) : /* @__PURE__ */ r("li", { className: "dq-tag", children: /* @__PURE__ */ r(Gt, { tag: P }) }, P.id)
        ),
        O.map((P) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ c("ins", { children: [
          "+ ",
          /* @__PURE__ */ r(Gt, { tag: P })
        ] }) }, `added-${P.id}`)),
        k.map((P) => /* @__PURE__ */ c("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ r("ins", { children: /* @__PURE__ */ r(Gt, { tag: P }) }),
          _
        ] }, `absent-${P.id}`))
      ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ c(he, { children: [
        /* @__PURE__ */ r("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((P) => /* @__PURE__ */ c(
          "li",
          {
            className: `dq-tag dq-tag-absent${E.has(P.id) ? " dq-tag-removed" : ""}`,
            children: [
              /* @__PURE__ */ r($a, { "aria-hidden": "true" }),
              E.has(P.id) ? /* @__PURE__ */ c("del", { children: [
                "− ",
                /* @__PURE__ */ r(Gt, { tag: P })
              ] }) : /* @__PURE__ */ r(Gt, { tag: P })
            ]
          },
          P.id
        )) })
      ] })
    ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading…" })
  ] });
}
function Vd({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: a,
  onSaveDefaults: i,
  editRequest: o = 0,
  onEditRequestHandled: s,
  pageControls: l
}) {
  var _r;
  const d = Te(e), h = cn(d), p = d === "audio" ? "Audio" : "Scene", g = (f) => {
    var v;
    return f.title || ((v = f.files[0]) == null ? void 0 : v.basename) || p;
  }, m = (f) => `${f.occurrence ? `${f.occurrence.performer.name} — ` : ""}${g(f.media)}`, w = I(null), y = I("");
  if (!w.current)
    try {
      w.current = Va(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (f) {
      y.current = Ut(f), w.current = { query: Yn(e), startAtEnd: !1 };
    }
  const [N, A] = S(null), [E, _] = S(""), O = I(null), k = I(null), P = I(null), Q = I(null), [te, X] = S(!!y.current), j = I(0), [G, Y] = S(w.current.query), C = I(G);
  C.current = G;
  const [x, U] = S(0), ie = I(w.current.startAtEnd), [Z, ne] = S([]), [F, pe] = S(null), z = I(null), [D, de] = S(null), [Re, _e] = S(0), mt = Ne(() => {
    if (!F) return null;
    const f = Z.findIndex((v) => v.key === F.key);
    return f < 0 ? null : Z.slice(f + 1).find((v) => v.media.id !== F.media.id) ?? null;
  }, [F, Z]), [ct, nt] = S(0), [rt, Pt] = S(!1), [et, at] = S(!1), se = I(!1), be = I(!0), Ke = I(null);
  J(() => (be.current = !0, () => {
    be.current = !1;
  }), []);
  const [ln, je] = S(y.current), [ft, xe] = S(""), [ke, Nt] = S(null), [Ce, dn] = S(!1), [Rt, un] = S([]), Xt = I([]), le = I(null), lt = I(null), fn = I(null);
  J(() => {
    var f, v;
    Ce && ((v = (f = fn.current) == null ? void 0 : f.querySelector("input")) == null || v.focus());
  }, [Ce]);
  const [Kt, Tn] = S(!1), [Be, He] = S(!1);
  J(() => {
    if (rt || Kt || !lt.current) return;
    const f = requestAnimationFrame(() => {
      if (document.querySelector(lo)) return;
      const v = lt.current;
      lt.current = null;
      const $ = document.activeElement;
      $ && $ !== document.body || v != null && v.isConnected && !v.disabled && v.focus();
    });
    return () => cancelAnimationFrame(f);
  }, [rt, Kt, x]);
  const [W, M] = S([]), [Ae, Ve] = S({}), Bt = I(null), ee = I(0), [qt, Un] = S({});
  J(() => {
    let f = !0;
    return Promise.all(
      gi(G.objectFilter).map(
        async (v) => [
          String(v),
          (await ce(`/api/tags/${v}`)).name
        ]
      )
    ).then((v) => {
      f && Un(Object.fromEntries(v));
    }).catch(() => {
    }), () => {
      f = !1;
    };
  }, [G.objectFilter]);
  const Vt = Ne(
    () => bi(G.objectFilter, qt),
    [qt, G.objectFilter]
  ), gt = I(0), yt = I(e);
  yt.current = e;
  const qe = N ?? e, Ue = Ne(
    () => on(qe, G),
    [qe, G]
  ), vt = Ne(
    () => co(Ue, G.performerFocus),
    [Ue, G.performerFocus]
  ), hn = I(vt);
  hn.current = vt;
  const it = I(Ue);
  it.current = Ue;
  const [Ye, Jt] = S("items"), [dt, Zt] = S(null), St = I(null), we = I("");
  function Et(f) {
    const v = typeof f == "function" ? f(St.current) : f;
    St.current = v, Zt(v);
  }
  const [Gn, pn] = S(!1), [Je, zt] = S(null), q = I(null), T = ve(Ue) ? Xr(Ue) : "", [K, ge] = S(0), [re, Fe] = S(null);
  J(() => () => {
    var f;
    return (f = q.current) == null ? void 0 : f.controller.abort();
  }, []), J(() => {
    const f = q.current;
    !f || f.signature === T || (f.controller.abort(), q.current = null, pn(!1));
  }, [T]), J(() => {
    var $;
    const f = St.current;
    if (Ye !== "performers" || !T || (($ = q.current) == null ? void 0 : $.signature) === T || we.current === T || (f == null ? void 0 : f.signature) === T && f.complete)
      return;
    const v = (f == null ? void 0 : f.signature) === T ? f : null;
    ye(f, (v == null ? void 0 : v.limit) ?? ka);
  }, [Ye, T, dt, Je, Gn]);
  const Pe = G.performerFocus, Ct = JSON.stringify(
    ve(Ue) ? Ue.occurrence.flagPerformerTagIds ?? [] : []
  );
  J(() => {
    if (!Pe) {
      Fe(null);
      return;
    }
    let f = !0;
    const v = new Set(JSON.parse(Ct));
    return ce(
      `/api/performers/${Pe}`
    ).then(($) => {
      f && Fe({
        id: Pe,
        name: $.name,
        flags: ($.tags ?? []).filter((B) => v.has(B.id)).map((B) => B.name)
      });
    }).catch(() => {
    }), () => {
      f = !1;
    };
  }, [Pe, Ct]);
  const mn = so(e, G), me = so(e, Hr(e, G)), Se = et || rt || Ce, ze = Number(G.filter.page);
  function bt(f, v = !1) {
    se.current || (y.current = "", ie.current = v, C.current = f, Y(f), nt(0), Pt(!0), v || Cr(e.id, f), U(($) => $ + 1));
  }
  function It() {
    if (se.current = !1, at(!1), be.current && Ke.current) {
      const f = Ke.current;
      Ke.current = null, bt(f.query, f.startAtEnd);
    }
  }
  J(() => {
    const f = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const v = Va(
            yt.current,
            new URLSearchParams(window.location.search)
          );
          se.current ? Ke.current = v : bt(v.query, v.startAtEnd);
        } catch (v) {
          je(Ut(v));
        }
    };
    return window.addEventListener("popstate", f), () => window.removeEventListener("popstate", f);
  }, [e.id]), J(() => (a(et || rt || Ce || !!N), () => a(!1)), [et, rt, Ce, !!N, a]);
  async function gn(f, v, $) {
    if (ve(f)) {
      const ae = await Ss(
        f,
        Bt.current,
        v,
        $
      );
      return {
        items: ae.items.map((oe) => ({
          key: oe.key,
          media: oe.media,
          occurrence: oe
        })),
        totalCount: ae.totalCount
      };
    }
    const B = await Er(
      f,
      { ...f.view.filter, page: v },
      $
    );
    return {
      items: B.items.map((ae) => ({ key: String(ae.id), media: ae })),
      totalCount: B.totalCount
    };
  }
  function ot(f, v, $, B = !1, ae = !1) {
    if (!be.current || Ke.current) return;
    X(!0), ne(
      ae ? f.items : Aa(f.items, C.current.startFrom === "end")
    ), nt(f.totalCount), tt($, B);
    const oe = {
      ...C.current,
      filter: { ...C.current.filter, page: v }
    };
    C.current = oe, Y(oe), Cr(e.id, oe);
  }
  function tt(f, v = !1) {
    (f == null ? void 0 : f.key) !== (F == null ? void 0 : F.key) && (z.current = null), (f == null ? void 0 : f.media.id) !== (F == null ? void 0 : F.media.id) && de(v && f ? f.media.id : null), pe(f);
  }
  J(() => {
    if (y.current) return;
    const f = new AbortController();
    Q.current = f;
    const v = ++gt.current;
    return Pt(!0), je(""), xe(""), z.current = null, de(null), pe(null), ne([]), dn(!1), (async () => {
      const $ = co(
        on(yt.current, C.current),
        C.current.performerFocus
      );
      Bt.current = ve($) ? await wi($, f.signal) : null;
      let B = Number($.view.filter.page), ae = await gn($, B, f.signal);
      const oe = Math.max(
        1,
        Math.ceil(ae.totalCount / Number($.view.filter.perPage))
      );
      (ie.current || B > oe) && (B = oe, ae = await gn($, B, f.signal)), ie.current = !1;
      const Me = $.view.startFrom === "end" ? -1 : 1;
      for (; ve($) && !ae.items.length && B + Me >= 1 && B + Me <= oe && !f.signal.aborted; )
        B += Me, ae = await gn($, B, f.signal);
      if (v !== gt.current || f.signal.aborted) return;
      const Xe = Aa(ae.items, $.view.startFrom === "end");
      ot(ae, B, Xe[0] ?? null);
    })().catch(($) => {
      !f.signal.aborted && v === gt.current && je(Ut($));
    }).finally(() => {
      !f.signal.aborted && v === gt.current && (X(!0), Pt(!1));
    }), () => {
      f.abort(), gt.current++;
    };
  }, [x, e.id]), J(() => {
    if (Nt(null), !F) return;
    let f = !0;
    return Yt(d, F).then((v) => {
      f && (Nt(v), M(
        ve(e) ? v.ids.filter(($) => e.occurrence.tagIds.includes($)) : []
      ));
    }).catch((v) => {
      f && je(`Could not load current tags. ${Ut(v)}`);
    }), () => {
      f = !1;
    };
  }, [F]), J(() => {
    if (!ve(e) || e.actions.length)
      return;
    let f = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (v) => [
          v,
          (await ce(`/api/tags/${v}`)).name
        ]
      )
    ).then((v) => {
      f && Ve(Object.fromEntries(v));
    }).catch((v) => {
      f && je(Ut(v));
    }), () => {
      f = !1;
    };
  }, [e]);
  async function At(f = !1, v = !1, $ = !1) {
    var vr;
    if (!F) return;
    const B = Z.findIndex((De) => De.key === F.key), ae = G.startFrom === "end" ? -1 : 1, oe = ((vr = z.current) == null ? void 0 : vr.key) === F.key ? z.current : { key: F.key, page: ze, before: Z.slice(0, B + 1).map((De) => De.key), after: Z.slice(B + 1).map((De) => De.key) }, Me = new Set(oe.after), Xe = new Set(oe.before), Dt = Z.find((De) => {
      var _t;
      return Me.has(De.key) || (ae === 1 || ze < oe.page) && ((_t = z.current) == null ? void 0 : _t.key) === F.key && !Xe.has(De.key);
    });
    if (!f && Dt) {
      tt(Dt, $);
      return;
    }
    const st = f ? Xe : new Set(Z.map((De) => De.key)), Ot = 1100 - (Date.now() - ee.current);
    Ot > 0 && await new Promise((De) => window.setTimeout(De, Ot));
    let wt = ae === -1 && !f ? Math.max(1, ze - 1) : ze;
    for (; be.current && !Ke.current; ) {
      let De = await gn(vt, wt);
      const _t = Math.max(
        1,
        Math.ceil(De.totalCount / Number(G.filter.perPage))
      );
      wt > _t && (wt = _t, De = await gn(vt, wt));
      const Kn = Aa(De.items, ae === -1), Nn = new Map(Kn.map((kt) => [kt.key, kt])), Ee = f ? oe.after.flatMap((kt) => {
        const jr = Nn.get(kt);
        return jr ? [jr] : [];
      }) : [], pa = new Set(Ee.map((kt) => kt.key)), Bn = f ? {
        ...De,
        items: [
          ...Ee,
          ...Kn.filter(
            (kt) => kt.key !== F.key && !pa.has(kt.key)
          )
        ]
      } : De;
      if (v) {
        z.current = oe, ot(Bn, wt, F, !1, f);
        return;
      }
      const Qt = ae === -1 && ze === 1 && !f ? void 0 : Bn.items.find(
        (kt) => !st.has(kt.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(f && ae === -1 && wt === oe.page) || Me.has(kt.key))
      );
      if (Qt || (ae === -1 ? wt <= 1 : wt >= _t)) {
        ot(
          Bn,
          wt,
          Qt ?? null,
          $,
          f
        ), Qt || xe(
          De.totalCount ? `Reached the end in this direction. Matching items remain available from the ${h.queue} pages.` : `No matching ${h.many}.`
        );
        return;
      }
      wt += ae;
    }
  }
  async function Qe(f, v = !1, $ = !1, B = !1) {
    if (N || !F || se.current || rt || Ce && !$)
      return;
    const ae = $ || B || !!(f != null && f.steps.length), oe = ae && !v;
    if (ae && (!t || !ke) || f && Dn(f) && !n) return;
    se.current = !0, at(!0), je(""), xe("");
    const Me = Z.findIndex((st) => st.key === F.key), Xe = ae && !v && Me >= 0 ? Z[Me + 1] ?? null : null;
    Xe && (ne(
      (st) => st.filter((Ot) => Ot.key !== F.key)
    ), tt(Xe, !0));
    let Dt = !1;
    try {
      if (ae) {
        const st = await Yt(d, F);
        if (f)
          await id(vt, F, f);
        else {
          const wt = B && ve(e) ? e.occurrence.tagIds.filter((_t) => st.ids.includes(_t)) : Xt.current, De = hr(wt, B ? W : Rt);
          await Ni(vt, F, De);
        }
        ee.current = Date.now();
        const Ot = await Yt(d, F);
        Xe || Nt(Ot), Dt = !0, dn(!1), xe("Tags saved."), F.occurrence && ($n(F.occurrence.performer.id), ge((wt) => wt + 1));
      }
      if (!be.current || Ke.current) return;
      ae ? await At(!0, v, oe) : v || await At(), v && $ && requestAnimationFrame(() => {
        var st;
        return (st = le.current) == null ? void 0 : st.focus();
      });
    } catch (st) {
      if (je(
        Dt ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Ut(st)}` : ae ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Ut(st)}` : `Could not advance. ${Ut(st)}`
      ), ae && !Dt) {
        Xe && (ne(Z), de(null), _e((Ot) => Ot + 1), pe(F)), ee.current = Date.now();
        try {
          Nt(await Yt(d, F));
        } catch {
          Nt(null), je(
            (Ot) => `${Ot} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      It();
    }
  }
  const bn = !Ce && !N && !Kt && !Be && (F != null || rt || et);
  si({
    surface: "local",
    enabled: bn,
    actionCount: e.actions.length,
    onAction: (f, v) => {
      const $ = e.actions[f];
      $ && Qe($, v);
    },
    onFind: () => He(!0)
  });
  const $t = (f) => et || rt || !ke || !!N || !t && f.steps.length > 0 || !n && Dn(f);
  function Zn() {
    !i || N || se.current || Ce || (P.current = document.activeElement, k.current = {
      error: ln,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(C.current),
      items: Z,
      current: F,
      total: ct,
      targets: Bt.current,
      stayedCursor: z.current
    }, A(structuredClone(e)), _(""), xe(""), je(""));
  }
  J(() => {
    if (!o) {
      j.current = 0;
      return;
    }
    o !== j.current && te && !rt && (j.current = o, Zn(), s == null || s());
  }, [o, rt, te]);
  function Rn() {
    A(null), _(""), requestAnimationFrame(() => {
      const f = P.current;
      f != null && f.isConnected && f !== document.body && f.focus();
    });
  }
  function en() {
    var v;
    const f = k.current;
    !f || et || ((v = Q.current) == null || v.abort(), gt.current++, C.current = f.query, Y(f.query), ne(f.items), pe(f.current), nt(f.total), Bt.current = f.targets, z.current = f.stayedCursor, Pt(!1), je(f.error), xe(""), window.history.replaceState(window.history.state, "", f.url), Rn());
  }
  async function tn() {
    if (!N || !i || se.current) return;
    const f = on(
      { ...N, name: N.name.trim() },
      Hr(yt.current, C.current)
    ), v = Tr(f);
    if (v) {
      _(v);
      return;
    }
    se.current = !0, at(!0), _("");
    try {
      if (await i(f) === !1) throw new Error("Could not save review.");
      Rn(), xe("Review saved.");
    } catch ($) {
      _(
        "Could not save review. Your edits are still open. " + Ut($)
      );
    } finally {
      It();
    }
  }
  async function mr() {
    if (!i || se.current) return;
    const f = Hr(yt.current, C.current), v = on(yt.current, {
      ...f,
      filter: { ...f.filter, page: 1 }
    });
    se.current = !0, at(!0), je("");
    try {
      if (await i(v) === !1) throw new Error("Could not save review.");
      xe("Queue saved to this review.");
    } catch ($) {
      je("Could not save queue. " + Ut($));
    } finally {
      It();
    }
  }
  const ut = G.performerScope, gr = (f) => {
    const { performerFocus: v, ...$ } = C.current, B = v && !("targetMode" in f || "performerIds" in f || "performerFilter" in f);
    bt({
      ...$,
      ...B ? { performerFocus: v } : {},
      filter: { ...$.filter, page: 1 },
      performerScope: { ...ut, ...f }
    });
  };
  async function ye(f, v) {
    var ae;
    const $ = it.current;
    if (!ve($)) return;
    (ae = q.current) == null || ae.controller.abort();
    const B = {
      signature: Xr($),
      controller: new AbortController()
    };
    q.current = B, we.current = "", pn(!0), zt(null);
    try {
      const oe = await Od($, f, v, B.controller.signal, {
        onProgress: (Me) => {
          q.current === B && Et(Me);
        }
      });
      q.current === B && Et(oe);
    } catch (oe) {
      q.current === B && !B.controller.signal.aborted && (we.current = B.signature, zt({ signature: B.signature, message: Ut(oe) }));
    } finally {
      q.current === B && (q.current = null, pn(!1));
    }
  }
  function In() {
    var f;
    (f = q.current) == null || f.controller.abort(), q.current = null, pn(!1), Et((v) => v && { ...v, partial: !0, complete: !1 });
  }
  async function $n(f) {
    var ae;
    const v = it.current;
    if (!ve(v)) return;
    if (q.current) {
      In();
      return;
    }
    const $ = Xr(v);
    if (((ae = St.current) == null ? void 0 : ae.signature) !== $ || St.current.partial) return;
    const B = 1100 - (Date.now() - ee.current);
    B > 0 && await new Promise((oe) => window.setTimeout(oe, B));
    try {
      const oe = await $s(v, f);
      if (q.current) {
        In();
        return;
      }
      Et(
        (Me) => (Me == null ? void 0 : Me.signature) === $ ? Fd(Me, f, oe) : Me
      );
    } catch {
      Et(
        (oe) => (oe == null ? void 0 : oe.signature) === $ ? { ...oe, partial: !0, complete: !1 } : oe
      );
    }
  }
  const xr = G.performerFocus ? dt == null ? void 0 : dt.candidates.find((f) => f.id === G.performerFocus) : void 0, Le = (re == null ? void 0 : re.id) === G.performerFocus ? re : xr ?? null;
  function fa(f) {
    if (se.current) return;
    const v = {
      ...C.current,
      performerFocus: f,
      filter: { ...C.current.filter, page: 1 }
    };
    bt(v, v.startFrom === "end"), Jt("items");
  }
  function br() {
    const { performerFocus: f, ...v } = C.current;
    bt(
      { ...v, filter: { ...v.filter, page: 1 } },
      v.startFrom === "end"
    );
  }
  const nn = I(null);
  nn.current ?? (nn.current = ss());
  const Lt = nn.current, wn = os(qe.actions), yn = Ne(
    () => qe.actions.flatMap((f) => f.steps.flatMap((v) => v.tagIds)),
    [qe.actions]
  ), Ie = I(null);
  J(() => {
    const f = Ie.current, v = f == null ? void 0 : f.querySelector('[aria-current="true"]');
    if (!f || !v) return;
    const $ = f.getBoundingClientRect(), B = v.getBoundingClientRect();
    B.top < $.top ? f.scrollTop -= $.top - B.top : B.bottom > $.bottom && (f.scrollTop += B.bottom - $.bottom);
  }, [F == null ? void 0 : F.key, Ye]);
  const er = I(null), tr = I(null);
  J(() => {
    var $, B;
    const f = tr.current;
    if (!f) return;
    tr.current = null;
    const v = [...(($ = er.current) == null ? void 0 : $.querySelectorAll(".dq-partner")) ?? []];
    (B = v.find((ae) => ae.dataset.partnerKey === f) ?? v[0]) == null || B.focus();
  }, [F == null ? void 0 : F.key]);
  const vn = et || rt || Ce || !!N, rn = Ne(
    () => N ? on(N, Hr(e, G)) : null,
    [N, e, G]
  ), nr = Ne(
    () => rn != null && dr(Wn(rn)) !== dr(Wn(e)),
    [rn, e]
  );
  function wr() {
    F ? Yt(d, F).then(Nt).catch((f) => je(Ut(f))) : bt(C.current);
  }
  const rr = ln ? /* @__PURE__ */ c("p", { role: "alert", children: [
    ln,
    " ",
    /* @__PURE__ */ r("button", { type: "button", disabled: et, onClick: wr, children: F ? "Reload tags" : "Retry queue" })
  ] }) : null, On = et || rt || F != null && !ke, Pr = Math.max(1, Number(G.filter.perPage) || 1), Fn = I(1);
  rt || (Fn.current = Math.max(1, Math.ceil(ct / Pr)));
  const Mn = Fn.current, Lr = ut && F ? Z.filter(
    (f) => f.media.id === F.media.id && f.key !== F.key
  ) : [], yr = F != null && F.occurrence && F.occurrence.performer.id === G.performerFocus ? (Le == null ? void 0 : Le.flags) ?? [] : F != null && F.occurrence ? ((_r = dt == null ? void 0 : dt.candidates.find((f) => f.id === F.occurrence.performer.id)) == null ? void 0 : _r.flags) ?? [] : [], ha = (f) => {
    var v;
    return f.title || ((v = f.files[0]) == null ? void 0 : v.basename) || `${d === "audio" ? "Audio" : "Video"} ${f.id}`;
  }, Dr = F ? Gd(F.media, d) : "";
  return /* @__PURE__ */ c(
    "section",
    {
      className: `dq-review-workspace${d === "audio" ? " dq-audio" : ""}`,
      "aria-label": ut ? d === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : d === "audio" ? "Audio review" : "Video review",
      onClickCapture: (f) => {
        var B;
        const v = f.target instanceof Element ? f.target.closest("button") : null, $ = (v == null ? void 0 : v.getAttribute("aria-label")) ?? ((B = v == null ? void 0 : v.textContent) == null ? void 0 : B.trim()) ?? "";
        v && !v.closest(lo) && /^(Filters|Edit filter:|Edit criteria)/.test($) && (lt.current = v);
      },
      children: [
        /* @__PURE__ */ r(
          bs,
          {
            name: e.name,
            description: e.description,
            entityType: Oe(e),
            onBack: l == null ? void 0 : l.onBack,
            backDisabled: vn,
            onEdit: N ? () => {
              var f;
              return (f = O.current) == null ? void 0 : f.focus();
            } : Zn,
            editDisabled: !N && (vn || !i),
            editing: !!N,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: et || Ce, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: d === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ r(
                  Ar,
                  {
                    filter: G.filter,
                    objectFilter: Vt,
                    criteriaDefinitions: d === "audio" ? vo : Qa,
                    customFieldEntityType: d,
                    totalCount: ct,
                    sortOptions: d === "audio" ? lc : No,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(
                      ws,
                      {
                        page: Math.min(Math.max(1, ze || 1), Mn),
                        pages: Mn,
                        onPage: (f) => bt({
                          ...C.current,
                          filter: Mt(
                            { ...C.current.filter, page: f },
                            d
                          )
                        })
                      }
                    ),
                    onFilterChange: (f) => {
                      (f.sort !== C.current.filter.sort || f.direction !== C.current.filter.direction) && (f = { ...f, sorts: void 0 }), bt({
                        ...C.current,
                        filter: Mt(f, d)
                      });
                    },
                    onObjectFilterChange: (f) => {
                      bt({
                        ...C.current,
                        objectFilter: vs(
                          f,
                          qt,
                          C.current.objectFilter
                        ),
                        filter: { ...C.current.filter, page: 1 }
                      });
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ c(he, { children: [
              ut && /* @__PURE__ */ r(
                Rd,
                {
                  scope: ut,
                  disabled: et || Ce,
                  editing: !!N,
                  onChange: gr,
                  onEditCriteria: () => Tn(!0)
                }
              ),
              ve(vt) && t && /* @__PURE__ */ r(
                Nd,
                {
                  review: vt,
                  disabled: Se || !!N,
                  performerFlags: G.performerFocus ? Le == null ? void 0 : Le.flags : void 0,
                  trees: wn,
                  onOpen: () => {
                    se.current = !0, at(!0);
                  },
                  onWrite: () => {
                    ee.current = Date.now();
                  },
                  onClose: (f) => {
                    if (f) {
                      ee.current = Date.now();
                      const v = C.current.performerFocus;
                      v ? $n(v) : In(), ge(($) => $ + 1), new Promise(($) => window.setTimeout($, 1100)).then(() => {
                        It(), be.current && (y.current || Pt(!0), U(($) => $ + 1));
                      });
                    } else It();
                  }
                }
              ),
              (l == null ? void 0 : l.onGrid) && /* @__PURE__ */ r(
                ys,
                {
                  mode: "single",
                  disabled: vn,
                  onChange: () => {
                    var f;
                    return (f = l.onGrid) == null ? void 0 : f.call(l);
                  }
                }
              ),
              (l == null ? void 0 : l.moreItems) && /* @__PURE__ */ r(
                hi,
                {
                  disabled: vn,
                  items: l.moreItems({
                    onSelect: Zn,
                    disabled: !i
                  })
                }
              )
            ] }),
            chipsStart: G.performerFocus ? /* @__PURE__ */ c("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ r(
                lr,
                {
                  performer: {
                    id: G.performerFocus,
                    name: (Le == null ? void 0 : Le.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ c("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ r("strong", { children: (Le == null ? void 0 : Le.name) ?? `performer ${G.performerFocus}` })
              ] }),
              Le != null && Le.flags.length ? /* @__PURE__ */ c(
                "span",
                {
                  className: "dq-focus-flag",
                  title: `Flagged: ${Le.flags.join(", ")}`,
                  children: [
                    /* @__PURE__ */ r(Zr, { "aria-hidden": "true" }),
                    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
                      "Flagged: ",
                      Le.flags.join(", ")
                    ] })
                  ]
                }
              ) : null,
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: Se,
                  onClick: br,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            chipsEnd: N ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : mn ? /* @__PURE__ */ c(he, { children: [
              /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
              me && /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: "dq-text-button",
                  title: "Save the current queue criteria to this review",
                  disabled: Se || !i,
                  onClick: () => void mr(),
                  children: [
                    /* @__PURE__ */ r(Oo, { "aria-hidden": "true" }),
                    "Save to review"
                  ]
                }
              ),
              /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: "dq-text-button",
                  title: "Reset the queue to the review's saved criteria",
                  disabled: Se,
                  onClick: () => {
                    const f = Yn(e);
                    bt(f, f.startFrom === "end");
                  },
                  children: [
                    /* @__PURE__ */ r(Fo, { "aria-hidden": "true" }),
                    "Reset"
                  ]
                }
              )
            ] }) : void 0
          }
        ),
        l == null ? void 0 : l.notices,
        /* @__PURE__ */ c("div", { className: "dq-review-area", children: [
          N && rn && /* @__PURE__ */ r(
            gs,
            {
              drawerRef: O,
              draft: rn,
              onChange: (f) => A(f),
              direction: G.startFrom,
              onDirectionChange: (f) => bt({ ...C.current, startFrom: f }),
              tagGroups: Ud,
              trees: wn,
              saving: et,
              saveDisabled: rt,
              error: E,
              dirty: nr,
              criteriaChanged: me,
              notices: rr && /* @__PURE__ */ r("div", { className: "dq-review-feedback", children: rr }),
              onSave: () => void tn(),
              onCancel: en
            }
          ),
          /* @__PURE__ */ r("div", { className: "dq-review-main", children: /* @__PURE__ */ c("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ c("div", { className: "dq-review-stage", children: [
              F ? /* @__PURE__ */ c(he, { children: [
                /* @__PURE__ */ c("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ r("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ c(
                    "a",
                    {
                      href: `/${d}/${F.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${h.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ r("span", { children: ha(F.media) }),
                        /* @__PURE__ */ r(Mo, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Dr && /* @__PURE__ */ r("span", { className: "dq-stage-meta", children: Dr })
                ] }),
                /* @__PURE__ */ c("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ r("div", { className: "dq-player-frame", children: [F, mt].filter(Boolean).map((f) => {
                    var B, ae, oe, Me, Xe;
                    const v = f, $ = v.key === F.key;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        className: $ ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": $ ? void 0 : !0,
                        inert: $ ? void 0 : !0,
                        children: d === "audio" ? /* @__PURE__ */ r(
                          dc,
                          {
                            streamUrl: La("audio", v.media.id),
                            format: ((B = v.media.files[0]) == null ? void 0 : B.format) ?? "",
                            title: g(v.media),
                            coverUrl: $ ? Pa("audio", v.media) : void 0,
                            duration: ((ae = v.media.files[0]) == null ? void 0 : ae.duration) ?? 0,
                            autostart: $ && D === v.media.id
                          }
                        ) : /* @__PURE__ */ r(
                          qo,
                          {
                            videoId: v.media.id,
                            streamUrl: La("video", v.media.id),
                            posterUrl: $ ? Pa("video", v.media) : void 0,
                            duration: ((oe = v.media.files[0]) == null ? void 0 : oe.duration) ?? 0,
                            format: (Me = v.media.files[0]) == null ? void 0 : Me.format,
                            audioCodec: (Xe = v.media.files[0]) == null ? void 0 : Xe.audioCodec,
                            extensionSurface: $ ? "quick-view" : void 0,
                            autostart: $ && D === v.media.id,
                            keyboardShortcutsEnabled: $,
                            showAbLoop: $,
                            clip: v.media.parentVideoId != null ? {
                              start: v.media.clipStartSec ?? 0,
                              end: v.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${v.media.id}:${Re}`
                    );
                  }) }),
                  d === "audio" && /* @__PURE__ */ r(
                    Sd,
                    {
                      details: F.media.details,
                      label: h.one
                    },
                    F.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ r("p", { role: "status", className: "dq-stage-status", children: rt ? "Loading review…" : ct ? "Reached the end in this direction." : `No matching ${h.many}.` }),
              qe.actions.length > 0 ? /* @__PURE__ */ r(
                ql,
                {
                  actions: qe.actions,
                  mediaKind: d,
                  isDisabled: (f) => Ce || $t(f),
                  busy: On,
                  tags: ke,
                  trees: wn,
                  preview: Lt,
                  onApply: (f, v) => void Qe(f, v),
                  onFind: () => He(!0),
                  findDisabled: Ce || !!N,
                  paused: !!N
                }
              ) : ve(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ c(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || et || Ce || !ke || !!N || !F,
                  children: [
                    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((f) => /* @__PURE__ */ c("label", { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: W.includes(f),
                          onChange: (v) => M(
                            e.occurrence.multiple ? v.target.checked ? [...W, f] : W.filter(($) => $ !== f) : [f]
                          )
                        }
                      ),
                      Ae[f] ?? "Loading tag…"
                    ] }, f)),
                    /* @__PURE__ */ c("div", { className: "dq-row", children: [
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => M([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void Qe(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Qe(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ c("div", { className: "dq-panel-body", ref: er, children: [
                F && /* @__PURE__ */ c(he, { children: [
                  /* @__PURE__ */ c("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ c("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: F.occurrence ? F.occurrence.performer.name : `this ${h.one}` })
                    ] }),
                    /* @__PURE__ */ c("div", { className: "dq-reviewing-who", children: [
                      F.occurrence && /* @__PURE__ */ r(lr, { performer: F.occurrence.performer }),
                      /* @__PURE__ */ c("div", { children: [
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: F.occurrence ? F.occurrence.performer.name : `This ${h.one}` }),
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-note", children: ut ? `Tags apply to this performer in this ${h.queue}` : `Tags apply to the whole ${h.one}` })
                      ] })
                    ] }),
                    yr.length > 0 && /* @__PURE__ */ c("p", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
                      /* @__PURE__ */ r(Zr, { "aria-hidden": "true" }),
                      "Flagged: ",
                      yr.join(", ")
                    ] })
                  ] }),
                  Lr.length > 0 && /* @__PURE__ */ c(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${h.queue}`,
                      children: [
                        /* @__PURE__ */ c("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          h.queue
                        ] }),
                        /* @__PURE__ */ r("div", { className: "dq-partners", children: Lr.map((f) => {
                          var v, $, B;
                          return /* @__PURE__ */ c(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (v = f.occurrence) == null ? void 0 : v.performer.name,
                              "aria-label": ($ = f.occurrence) == null ? void 0 : $.performer.name,
                              "data-partner-key": f.key,
                              disabled: Se,
                              onClick: () => {
                                tr.current = F.key, tt(f), je("");
                              },
                              children: [
                                f.occurrence && /* @__PURE__ */ r(lr, { performer: f.occurrence.performer }),
                                /* @__PURE__ */ r("span", { children: (B = f.occurrence) == null ? void 0 : B.performer.name })
                              ]
                            },
                            f.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ r(
                    Bd,
                    {
                      tags: ke,
                      preview: Lt,
                      showPreview: !Ce,
                      trees: wn,
                      actionTagIds: yn,
                      label: `Current ${ut ? "occurrence" : h.one} tags`
                    }
                  ),
                  Ce && /* @__PURE__ */ c(
                    "fieldset",
                    {
                      ref: fn,
                      disabled: et,
                      className: "dq-panel-section dq-tag-editor",
                      children: [
                        /* @__PURE__ */ c("legend", { className: "dq-eyebrow", children: [
                          "Edit ",
                          ut ? "occurrence" : h.one,
                          " tags"
                        ] }),
                        /* @__PURE__ */ r(
                          Cn,
                          {
                            entityType: "tag",
                            values: Rt,
                            onChange: un,
                            placeholder: "Choose tags for this item...",
                            allowCreate: !1
                          }
                        ),
                        /* @__PURE__ */ c("div", { className: "dq-row", children: [
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button primary",
                              disabled: !ke,
                              onClick: () => void Qe(void 0, !0, !0),
                              children: "Save"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              disabled: !ke,
                              onClick: () => void Qe(void 0, !1, !0),
                              children: "Save & next"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              onClick: () => {
                                dn(!1), requestAnimationFrame(() => {
                                  var f;
                                  return (f = le.current) == null ? void 0 : f.focus();
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
                ve(Ue) && G.performerFocus && /* @__PURE__ */ r(
                  md,
                  {
                    review: Ue,
                    performerId: G.performerFocus,
                    revision: K
                  }
                )
              ] }),
              /* @__PURE__ */ c("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ c("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !N && rr,
                  ft && /* @__PURE__ */ r("p", { role: "status", children: ft })
                ] }),
                !t && /* @__PURE__ */ r("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                F && /* @__PURE__ */ c("div", { className: "dq-panel-actions", "aria-busy": On || void 0, children: [
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      ref: le,
                      className: "dq-button",
                      disabled: Se || !!N || !t || !ke,
                      onClick: () => {
                        Xt.current = [...ke.ids], un([...ke.ids]), dn(!0);
                      },
                      children: [
                        /* @__PURE__ */ r(Ro, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: Se || !!N,
                      onClick: () => void Qe(),
                      children: [
                        /* @__PURE__ */ r(Ec, { "aria-hidden": "true" }),
                        "Skip",
                        ut ? " performer" : ` ${h.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              ut && /* @__PURE__ */ c(
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
                        "aria-pressed": Ye === "items",
                        onClick: () => Jt("items"),
                        children: d === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Ye === "performers",
                        onClick: () => Jt("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              ut && Ye === "performers" ? /* @__PURE__ */ r(
                Ed,
                {
                  ranking: (dt == null ? void 0 : dt.signature) === T ? dt : null,
                  busy: Gn,
                  error: (Je == null ? void 0 : Je.signature) === T ? Je.message : "",
                  focus: G.performerFocus,
                  disabled: Se,
                  labels: h,
                  onFocus: fa,
                  onMore: () => {
                    const f = St.current;
                    f && ye(f, f.limit + ka);
                  },
                  onRefresh: () => {
                    Et(null), ye(null, ka);
                  }
                }
              ) : /* @__PURE__ */ r("div", { className: "dq-queue-list", ref: Ie, children: Z.map((f) => {
                var $;
                const v = (F == null ? void 0 : F.key) === f.key;
                return /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: m(f),
                    "aria-label": m(f),
                    "aria-current": v ? "true" : void 0,
                    disabled: Se,
                    onClick: () => {
                      tt(f), je(""), xe("");
                    },
                    children: [
                      /* @__PURE__ */ r(Kd, { media: f.media, kind: d }),
                      /* @__PURE__ */ c("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: g(f.media) }),
                        /* @__PURE__ */ c("span", { className: "dq-queue-row-meta", children: [
                          f.occurrence && /* @__PURE__ */ c(he, { children: [
                            /* @__PURE__ */ r(lr, { performer: f.occurrence.performer }),
                            /* @__PURE__ */ r("span", { className: "dq-queue-row-performer", children: f.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ r("span", { className: "dq-queue-row-detail", children: [
                            f.media.date,
                            f.occurrence ? "" : ($ = f.media.files[0]) != null && $.duration ? So(f.media.files[0].duration) : ""
                          ].filter(Boolean).join(" · ") })
                        ] })
                      ] })
                    ]
                  },
                  f.key
                );
              }) })
            ] })
          ] }) })
        ] }),
        ut && /* @__PURE__ */ r(
          uc,
          {
            open: Kt,
            onClose: () => Tn(!1),
            criteria: za,
            activeFilter: ut.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (f) => {
              Tn(!1), gr({ performerFilter: f });
            }
          }
        ),
        Be && /* @__PURE__ */ r(
          di,
          {
            actions: e.actions,
            trees: wn,
            isDisabled: (f) => $t(f),
            onApply: (f, v) => {
              He(!1), Qe(f, v);
            },
            onClose: () => He(!1)
          }
        )
      ]
    }
  );
}
function Ms(e, t, n, a) {
  const i = a === "asc" ? 1 : -1;
  return [...e].sort((o, s) => {
    if (n === "count") {
      const l = t[o.id], d = t[s.id], h = typeof l == "number", p = typeof d == "number";
      if (h !== p) return h ? -1 : 1;
      if (h && p && l !== d)
        return (l - d) * i;
    }
    return o.name.localeCompare(s.name, void 0, { numeric: !0, sensitivity: "base" }) * i;
  });
}
function Ta(e, t) {
  const n = Oe(e), a = cn(ti(n)), i = n === "tag" ? "tag" : ve(e) ? a.queue : a.one;
  return t === 1 ? i : `${i}s`;
}
function Jd({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ c(he, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      Ta(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ c(he, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      "Matching ",
      Ta(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ c(he, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      Ta(e, t)
    ] })
  ] });
}
function zd({
  reviews: e,
  counts: t,
  sort: n,
  direction: a,
  onSortChange: i,
  onDirectionChange: o,
  storage: s,
  canConfigure: l,
  busy: d,
  headingRef: h,
  notices: p,
  onOpen: g,
  onNew: m,
  onImport: w,
  onExportAll: y,
  rowMenuItems: N
}) {
  const A = I(null), E = Ne(
    () => Ms(e, t, n, a),
    [e, t, n, a]
  ), _ = e.every((k) => t[k.id] !== void 0), O = a === "asc" ? "ascending" : "descending";
  return /* @__PURE__ */ c("div", { className: "dq-reviews-page", children: [
    /* @__PURE__ */ c("header", { className: "dq-reviews-header", children: [
      /* @__PURE__ */ r("h1", { ref: h, tabIndex: -1, children: "Data Quality" }),
      /* @__PURE__ */ c("div", { className: "dq-reviews-header-actions", children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "dq-header-button",
            title: "Add the reviews in a review file",
            disabled: !l || d,
            onClick: () => {
              var k;
              return (k = A.current) == null ? void 0 : k.click();
            },
            children: [
              /* @__PURE__ */ r(Cc, { "aria-hidden": "true" }),
              "Import"
            ]
          }
        ),
        /* @__PURE__ */ r(
          "input",
          {
            ref: A,
            type: "file",
            accept: "application/json,.json",
            hidden: !0,
            tabIndex: -1,
            onChange: (k) => {
              var Q;
              const P = (Q = k.target.files) == null ? void 0 : Q[0];
              k.target.value = "", P && w(P);
            }
          }
        ),
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "dq-header-button",
            title: "Download every review as one review file",
            disabled: !e.length,
            onClick: y,
            children: [
              /* @__PURE__ */ r(xo, { "aria-hidden": "true" }),
              "Export all"
            ]
          }
        ),
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "dq-header-button dq-header-button-primary",
            disabled: !l || d,
            onClick: m,
            children: [
              /* @__PURE__ */ r(Wa, { "aria-hidden": "true" }),
              "New review"
            ]
          }
        )
      ] })
    ] }),
    p,
    e.length ? /* @__PURE__ */ c("section", { className: "dq-reviews", "aria-label": "Reviews", children: [
      /* @__PURE__ */ c("div", { className: "dq-reviews-bar", children: [
        /* @__PURE__ */ c("p", { className: "dq-reviews-summary", children: [
          e.length === 1 ? "1 review" : `${e.length.toLocaleString()} reviews`,
          " ·",
          " ",
          s
        ] }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: _ ? e.some((k) => t[k.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ c("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ c("label", { children: [
            /* @__PURE__ */ r("span", { children: "Sort by" }),
            /* @__PURE__ */ c(
              "select",
              {
                className: "dq-select",
                value: n,
                onChange: (k) => i(k.target.value),
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
              "aria-label": `Sort direction: ${O}`,
              title: `Sort direction: ${O}`,
              onClick: () => o(a === "asc" ? "desc" : "asc"),
              children: a === "asc" ? /* @__PURE__ */ r(Ac, { "aria-hidden": "true" }) : /* @__PURE__ */ r(kc, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ c("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ c("tr", { children: [
          /* @__PURE__ */ r("th", { scope: "col", "aria-sort": n === "name" ? O : void 0, children: "Review" }),
          /* @__PURE__ */ r("th", { scope: "col", className: "dq-reviews-type", children: "Type" }),
          /* @__PURE__ */ r(
            "th",
            {
              scope: "col",
              className: "dq-reviews-count",
              "aria-sort": n === "count" ? O : void 0,
              children: "Matching"
            }
          ),
          /* @__PURE__ */ r("th", { scope: "col", className: "dq-reviews-actions", children: /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Actions" }) })
        ] }) }),
        /* @__PURE__ */ r("tbody", { children: E.map((k) => {
          const P = Oe(k);
          return /* @__PURE__ */ c("tr", { children: [
            /* @__PURE__ */ r("td", { children: /* @__PURE__ */ c(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(k.id)}`,
                "data-review-id": k.id,
                onClick: (Q) => {
                  Q.button !== 0 || Q.metaKey || Q.ctrlKey || Q.shiftKey || Q.altKey || (Q.preventDefault(), g(k.id));
                },
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ r(hs, { entityType: P }) }),
                  /* @__PURE__ */ c("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ r("span", { className: "dq-reviews-name", children: k.name }),
                    k.description && /* @__PURE__ */ r("span", { className: "dq-reviews-description", title: k.description, children: k.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-type", children: fs[P] }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-count", children: /* @__PURE__ */ r(Jd, { review: k, count: t[k.id] }) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ r(hi, { label: `Actions for ${k.name}`, items: N(k) }) })
          ] }, k.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ c("div", { className: "dq-empty", children: [
      /* @__PURE__ */ r(oa, { "aria-hidden": "true" }),
      /* @__PURE__ */ r("p", { children: "No reviews yet." }),
      /* @__PURE__ */ r("p", { children: l ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function xs(e, { id: t, name: n, description: a }) {
  const i = { id: t, name: n, description: a }, o = (s, l = {}) => ({
    filter: { page: 1, perPage: 40, ...s },
    objectFilter: {},
    displayMode: "grid",
    searchMode: "text",
    ...l
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
function Qd({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: a
}) {
  const { review: i, duplicate: o, saving: s, error: l } = e, d = I(null), h = I(null), p = I(s);
  p.current = s;
  const g = I(null), m = xt();
  J(() => {
    var N;
    return g.current ?? (g.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), d.current && !d.current.open && d.current.showModal(), (N = h.current) == null || N.focus(), () => {
      var A;
      (A = g.current) != null && A.isConnected && g.current.focus({ preventScroll: !0 });
    };
  }, []);
  const w = I(s);
  J(() => {
    var E, _;
    const N = document.activeElement, A = !N || N === document.body || !((E = d.current) != null && E.contains(N));
    l && (!i.name.trim() || w.current && !s && A) && ((_ = h.current) == null || _.focus()), w.current = s;
  }, [l, s]);
  const y = () => {
    p.current || a();
  };
  return /* @__PURE__ */ r(
    "dialog",
    {
      ref: d,
      className: "dq-form-dialog",
      "aria-labelledby": m,
      "aria-modal": "true",
      onCancel: (N) => {
        N.preventDefault(), y();
      },
      onClose: () => {
        var N;
        p.current ? (N = d.current) == null || N.showModal() : a();
      },
      children: /* @__PURE__ */ c(
        "form",
        {
          onSubmit: (N) => {
            N.preventDefault(), p.current || n();
          },
          children: [
            /* @__PURE__ */ c("header", { className: "dq-form-dialog-header", children: [
              /* @__PURE__ */ r("h2", { id: m, children: o ? "Duplicate review" : "New review" }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-icon-button",
                  "aria-label": "Close dialog",
                  title: "Close",
                  disabled: s,
                  onClick: y,
                  children: /* @__PURE__ */ r(Ir, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ c("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ r("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              l && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: l }),
              /* @__PURE__ */ c("fieldset", { className: "dq-form-dialog-fields", disabled: s, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ r(
                  ms,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: o,
                    onEntityTypeChange: (N) => {
                      !o && N !== Oe(i) && t(xs(N, i));
                    },
                    nameRef: h
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ c("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ r("button", { type: "button", className: "dq-text-button", onClick: () => fi(i), children: "Export draft" }),
              /* @__PURE__ */ r("span", { className: "dq-form-dialog-space" }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: s, onClick: y, children: "Cancel" }),
              /* @__PURE__ */ r("button", { type: "submit", className: "dq-button primary", "aria-disabled": s || void 0, children: s ? "Creating…" : "Create & configure" })
            ] })
          ]
        }
      )
    }
  );
}
const Wd = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function Hd(e, t, n, a) {
  return Fs(
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
function uo(e, t) {
  return Oe(t) === "video" && Mr(t.view.objectFilter, e.view.objectFilter).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function fo(e, t) {
  return Hn(
    JSON.parse(Ln(Wn(e))),
    JSON.parse(Ln(Wn(t)))
  );
}
const Ra = 180;
function ho(e) {
  return Oe(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function po(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Ia() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function mo(e) {
  const t = new URLSearchParams(window.location.search);
  ua.forEach((a) => t.delete(a)), e ? t.set("review", e) : t.delete("review");
  const n = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${n ? `?${n}` : ""}`
  );
}
function Yd(e) {
  return Mt({ ...e, page: 1 });
}
function Ps(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function cr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Xd = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Ha, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ r(Ic, { "aria-hidden": "true" }) }
], Zd = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Ha, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ r(Rc, { "aria-hidden": "true" }) }
], eu = [], Ls = "(min-width: 900px)";
function tu(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(Ls);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function nu() {
  return typeof window.matchMedia == "function" && window.matchMedia(Ls).matches;
}
function ru({
  onNavigate: e
}) {
  const [t, n] = S([]), [a] = S(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = S(""), [s, l] = S(!0), [d, h] = S(""), [p, g] = S(!1), [m, w] = S(!1), [y, N] = S(!1), [A, E] = S(!1), [_, O] = S([]), [k, P] = S(""), [Q, te] = S(!0), [X, j] = S("account"), [G, Y] = S(""), [C, x] = S(""), [U, ie] = S(!1), [Z, ne] = S(!1), [F, pe] = S(""), [z, D] = S(Ia), [de, Re] = S({}), _e = I(de);
  _e.current = de;
  const [mt, ct] = S(!z);
  mt !== !z && (ct(!z), z || Re({}));
  const [nt, rt] = S("name"), [Pt, et] = S("asc"), at = I(null), se = I(null), [be, Ke] = S(null), [ln, je] = S(!1), [ft, xe] = S(null), [ke, Nt] = S(null), Ce = !!ft || !!ke, dn = I(Ce);
  dn.current = Ce;
  const Rt = ln || !!ke, [un, Xt] = S(0), [le, lt] = S(null), fn = I(null), Kt = I(null), Tn = I(null), [Be, He] = S(
    null
  ), W = t.find((u) => u.id === z) ?? null, M = Ne(
    () => (Be == null ? void 0 : Be.id) === z && W ? { ...W, view: {
      ...W.view,
      filter: Be.view.filter,
      objectFilter: Be.view.objectFilter,
      searchMode: Be.view.searchMode,
      startFrom: Be.view.startFrom
    } } : W,
    [Be, z, W]
  ), Ae = M ? Oe(M) : "video", Ve = ti(Ae), Bt = M ? ve(M) : !1, ee = Ae === "video" ? M : null, qt = Bt && !!(M != null && M.actions.some(Dn)), Un = !!ee || Ae === "audio" || qt, [Vt, gt] = S(null), yt = (Vt == null ? void 0 : Vt.id) === (M == null ? void 0 : M.id) ? Vt == null ? void 0 : Vt.mode : (M == null ? void 0 : M.view.reviewMode) ?? "single", qe = Bt || Ae === "audio" || Ae === "video" && yt === "single", [Ue, vt] = S(0), hn = I(-1), it = I(!1);
  J(() => {
    const u = () => {
      if (!qe && Le.current) {
        it.current = !0;
        return;
      }
      hn.current = -1, D(Ia()), qe || vt((b) => b + 1);
    };
    return window.addEventListener("popstate", u), () => window.removeEventListener("popstate", u);
  }, [qe]);
  const Ye = Ve === "audio" ? m : p, Jt = Ae === "tag" ? "Tag" : Ve === "audio" ? "Audio" : "Video", dt = Ae === "tag" ? y : Ye, Zt = I(
    null
  ), St = Md(ee), [we, Et] = S({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Gn, pn] = S({
    page: 1,
    perPage: 40
  }), [Je, zt] = S({ items: [], totalCount: 0 }), [q, T] = S(z);
  q !== z && (T(z), zt({ items: [], totalCount: 0 }), ne(!1));
  const [K, ge] = S(!1), [re, Fe] = S(""), [Pe, Ct] = S(!1), [mn, me] = S(!1), [Se, ze] = S(() => /* @__PURE__ */ new Set()), bt = I(Se);
  bt.current = Se;
  const It = I(/* @__PURE__ */ new Map()), gn = (M == null ? void 0 : M.view.selectAllOnLoad) === !0, [ot, tt] = S(null), At = I(ot);
  At.current = ot;
  const [Qe, bn] = S(!1), $t = I(Qe);
  $t.current = Qe;
  const Zn = I(null), [Rn, en] = S(!1), [tn, mr] = S("grid"), [ut, gr] = S(Ra), [ye, In] = S(!1), [$n, xr] = S(!1), Le = I(!1), [fa, br] = S(""), [nn, Lt] = S(""), [wn, yn] = S(""), [Ie, er] = S(null), [tr, vn] = S(""), [rn, nr] = S(!1), [wr, rr] = S({}), On = I(/* @__PURE__ */ new Map()), Pr = I(null), Fn = I(null), Mn = !!M, Lr = wo(tu, nu, () => !1) && Mn, [yr, ha] = S({ top: 0, bottom: 0 });
  sn(() => {
    if (!Mn) return;
    const u = () => {
      const R = Fn.current;
      if (!R) return;
      const L = Math.round(R.getBoundingClientRect().top + window.scrollY), H = R.closest("main"), V = H ? Math.round(parseFloat(getComputedStyle(H).paddingBottom) || 0) : 0;
      ha(
        (ue) => ue.top === L && ue.bottom === V ? ue : { top: L, bottom: V }
      );
    };
    u();
    const b = typeof ResizeObserver > "u" ? null : new ResizeObserver(u);
    return b == null || b.observe(document.body), window.addEventListener("resize", u), () => {
      b == null || b.disconnect(), window.removeEventListener("resize", u);
    };
  }, [Mn]);
  const [Dr, _r] = S(0), f = I(null), v = Sn((u) => {
    var R;
    if ((R = f.current) == null || R.disconnect(), f.current = null, !u || typeof ResizeObserver > "u") return;
    const b = new ResizeObserver(
      () => _r(Math.round(u.getBoundingClientRect().height))
    );
    b.observe(u), f.current = b;
  }, []), $ = I(0), B = I(0), ae = I(null), oe = I(null), Me = os(
    M && !qe ? le ? [...M.actions, ...le.draft.actions] : M.actions : eu
  ), Xe = Ne(
    () => le && M && W ? Hd(le.draft, M, we, W) : null,
    [le, M, we, W]
  ), Dt = Ne(
    () => M && W ? Fs(
      { ...W, view: { ...M.view, filter: { ...we, page: 1 } } },
      W
    ) : null,
    [M, W, we]
  ), st = Ne(
    () => W ? dr(Wn(W)) : "",
    [W]
  ), Ot = Ne(
    () => Dt != null && dr(Wn(Dt)) !== st,
    [Dt, st]
  ), wt = Ne(
    () => Xe != null && dr(Wn(Xe)) !== st,
    [Xe, st]
  );
  J(() => {
    if (!nn) return;
    const u = window.setTimeout(() => Lt(""), 4e3);
    return () => window.clearTimeout(u);
  }, [nn]), J(() => {
    if (!be || be.alert) return;
    const u = window.setTimeout(() => Ke(null), 6e3);
    return () => window.clearTimeout(u);
  }, [be]), J(() => {
    const u = ee ? gi(ee.view.objectFilter) : [];
    if (rr({}), !u.length) return;
    const b = new AbortController();
    let R = !0;
    return Promise.all(
      u.map(async (L) => {
        var H;
        try {
          const V = await ce(`/api/tags/${L}`, {
            signal: b.signal
          });
          return (H = V.name) != null && H.trim() ? [String(L), V.name] : null;
        } catch {
          return null;
        }
      })
    ).then((L) => {
      R && rr(
        Object.fromEntries(L.filter((H) => H !== null))
      );
    }), () => {
      R = !1, b.abort();
    };
  }, [ee == null ? void 0 : ee.id, ee == null ? void 0 : ee.view.objectFilter]);
  const vr = Ne(
    () => ee ? bi(
      ee.view.objectFilter,
      wr
    ) : (M == null ? void 0 : M.view.objectFilter) ?? {},
    [wr, M, ee]
  ), De = Sn(async () => {
    l(!0), h("");
    try {
      const u = await Vc();
      n(u.reviews), o(u.storageKey), g(u.canWriteVideos ?? u.canWrite), w(u.canWriteAudios ?? !1), N(u.canWriteTags ?? !1), E(u.canReadTagGroups ?? !1), te(u.canConfigure ?? !0), j(u.storage ?? "account"), Y(u.storageNotice ?? ""), z && !u.reviews.some((b) => b.id === z) && (D(""), mo(""));
    } catch (u) {
      h(
        u instanceof Error ? u.message : "Could not load reviews."
      );
    } finally {
      l(!1);
    }
  }, [z]);
  J(() => {
    if (!A) {
      O([]), P("");
      return;
    }
    const u = new AbortController();
    return P(""), nl(u.signal).then(O).catch((b) => {
      u.signal.aborted || P(
        b instanceof Error ? b.message : "Could not load tag groups."
      );
    }), () => u.abort();
  }, [A]), J(() => {
    De();
  }, []), J(() => {
    if (z || t.length === 0) return;
    const u = new AbortController();
    for (const b of t) {
      if (typeof _e.current[b.id] == "number") continue;
      (ve(b) ? wi(b, u.signal).then((L) => (L == null ? void 0 : L.length) === 0 ? { items: [], totalCount: 0 } : Er(yi(b, L), { ...b.view.filter, page: 1, perPage: 1 }, u.signal)) : Oe(b) === "tag" ? Ui(
        b,
        Mt({ ...b.view.filter, page: 1, perPage: 1 }),
        u.signal
      ) : Er(
        b,
        Mt({ ...b.view.filter, page: 1, perPage: 1 }),
        u.signal
      )).then((L) => {
        u.signal.aborted || Re((H) => ({
          ...H,
          [b.id]: L.totalCount
        }));
      }).catch(() => {
        u.signal.aborted || Re((L) => ({ ...L, [b.id]: null }));
      });
    }
    return () => u.abort();
  }, [z, t]), sn(() => {
    var R, L;
    const u = se.current;
    if (z || s || !u) return;
    se.current = null, (L = (u === "heading" ? null : [...((R = Fn.current) == null ? void 0 : R.querySelectorAll("[data-review-id]")) ?? []].find(
      (H) => H.dataset.reviewId === u.reviewId
    )) ?? at.current) == null || L.focus();
  }, [z, s, ke, t]);
  const _t = I(0), Kn = Sn(async () => {
    const u = ++_t.current;
    er(null), vn("");
    try {
      const b = await (qt ? Qo(Ve) : zo(Ve));
      u === _t.current && er(b);
    } catch (b) {
      if (u !== _t.current) return;
      er(null), vn(
        "Tag assessment setup could not be checked. " + (b instanceof Error ? b.message : "Request failed.")
      );
    }
  }, [qt, Ve]);
  J(() => {
    Kn();
  }, [Kn]);
  const Nn = Sn(
    async (u, b, R = !1, L = !1) => {
      var Tt, $e;
      const H = ++$.current;
      (Tt = ae.current) == null || Tt.abort();
      const V = new AbortController();
      ae.current = V, b = Mt(b);
      const ue = Number(b.page);
      R && (b = { ...b, page: 1 }), Et(b), me(R), ge(!0), Fe("");
      try {
        const Ge = (qn) => Oe(u) === "tag" ? Ui(
          u,
          qn,
          V.signal
        ) : Er(
          u,
          qn,
          V.signal
        );
        let fe = await Ge(b);
        const Ze = Math.max(
          1,
          Math.ceil(fe.totalCount / Number(b.perPage))
        ), ir = R ? Ze : Math.min(ue, Ze);
        return Number(b.page) !== ir && (b = { ...b, page: ir }, fe = await Ge(b)), H === $.current && ((($e = oe.current) == null ? void 0 : $e.page) !== ir && (oe.current = {
          page: ir,
          ids: new Set(fe.items.map((qn) => qn.id))
        }), zt(fe), L && an(
          () => new Set(fe.items.map((qn) => qn.id))
        ), Et(b), pn(b)), fe;
      } catch (Ge) {
        throw H === $.current && Fe(
          Ge instanceof Error ? Ge.message : "Could not load the review queue."
        ), Ge;
      } finally {
        H === $.current && ge(!1);
      }
    },
    []
  );
  J(() => {
    var b;
    if (B.current += 1, hn.current = -1, $.current += 1, (b = ae.current) == null || b.abort(), lt(null), fn.current = null, ne(!1), pe(""), x(""), ie(!1), ze(/* @__PURE__ */ new Set()), It.current.clear(), tt(null), bn(!1), In(!1), Le.current = !1, br(""), Lt(""), yn(""), zt({ items: [], totalCount: 0 }), oe.current = null, Ct(!1), !M || qe) {
      ge(!1), He(null);
      return;
    }
    let u = !0;
    return ge(!0), (async () => {
      let R = W ?? M;
      He(null);
      let L = null;
      const H = new URLSearchParams(window.location.search);
      if (Oe(M) === "video" && ua.some(($e) => H.has($e)))
        try {
          const $e = R;
          L = Va($e, H);
          const Ge = on($e, L.query);
          (L.query.startFrom !== ($e.view.startFrom ?? "end") || !Hn(
            JSON.parse(Ln(Ge)),
            JSON.parse(Ln(on($e, Yn($e))))
          )) && (R = Ge, He(R));
        } catch ($e) {
          Ct(!0), Fe($e instanceof Error ? $e.message : "Could not read review URL."), ge(!1);
          return;
        }
      let V = null;
      try {
        V = await Qc(i, M.id);
      } catch ($e) {
        u && (ie(!0), x(
          $e instanceof Error ? $e.message : "Could not load progress."
        ));
      }
      if (!u) return;
      const ue = (V == null ? void 0 : V.signature) === Ln(R) ? V : null, Tt = L ? L.query.filter : ue ? Mt(ue.filter) : Yd(R.view.filter);
      Et(Tt), mr(
        ue ? po(ue.displayMode, Oe(M)) : ho(M)
      ), gr(
        ue ? ue.cardSize ?? Ra : Ra
      );
      try {
        const $e = await Nn(
          R,
          Tt,
          L ? L.startAtEnd : !ue && R.view.startFrom !== "beginning",
          R.view.selectAllOnLoad === !0
        );
        if (!u) return;
        const Ge = Li(
          $e.items.map((fe) => fe.id),
          (ue == null ? void 0 : ue.focusedId) ?? null,
          (ue == null ? void 0 : ue.index) ?? 0
        );
        tt(Ge), ht(Ge);
      } catch {
      }
      u && (hn.current = Ue, ne(!0), pe(`${M.id}:${Ue}`));
    })(), () => {
      var R;
      u = !1, B.current++, $.current++, (R = ae.current) == null || R.abort();
    };
  }, [M == null ? void 0 : M.id, qe, Ue]), J(() => {
    if (!(!un || qe || !M)) {
      if (Pe) {
        Xt(0);
        return;
      }
      ye || le || F !== `${M.id}:${Ue}` || (Xt(0), ya());
    }
  }, [un, qe, M == null ? void 0 : M.id, F, ye, Ue, Pe]), J(() => {
    !ee || qe || !Z || K || re || ye || it.current || hn.current !== Ue || Cr(ee.id, {
      filter: we,
      objectFilter: ee.view.objectFilter,
      searchMode: ee.view.searchMode,
      startFrom: ee.view.startFrom ?? "end"
    });
  }, [ee, qe, Z, K, re, we, ye, Ue]);
  const Ee = Ne(
    () => Je.items.map((u) => u.id),
    [Je.items]
  );
  J(() => {
    if (!Z || !M || !i || K || re || ye || (Be == null ? void 0 : Be.id) === M.id || U || hn.current !== Ue)
      return;
    const u = {
      version: 1,
      signature: Ln(M),
      filter: we,
      focusedId: ot,
      index: Math.max(0, Ee.indexOf(ot ?? -1)),
      displayMode: tn,
      cardSize: ut,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + M.id,
        JSON.stringify(u)
      );
    } catch {
    }
    if (C) return;
    let b = !0;
    const R = window.setTimeout(() => {
      Wc(i, M.id, u).catch((L) => {
        b && x(
          "Progress is kept in this browser, but account sync failed. " + (L instanceof Error ? L.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      b = !1, window.clearTimeout(R);
    };
  }, [
    Z,
    i,
    M,
    K,
    re,
    ye,
    we,
    ot,
    Ee,
    tn,
    ut,
    Be,
    C,
    U,
    Ue
  ]);
  const pa = Je.items.find((u) => u.id === ot) ?? null, Bn = Ae === "video" ? pa : null;
  Qe && Bn && (Zn.current = Bn);
  const Qt = Bn ?? (Qe ? Zn.current : null), kt = Di(Se, ot), jr = Ee.length > 0 && Ee.every((u) => Se.has(u)), ht = Sn((u, b = !0) => {
    u != null && window.requestAnimationFrame(() => {
      var L;
      if (dn.current || _c(document.activeElement) || (L = document.activeElement) != null && L.closest(".dq-drawer"))
        return;
      const R = On.current.get(u);
      R == null || R.focus({ preventScroll: !0 }), b && (R == null || R.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  J(() => {
    Z && !$t.current && ht(At.current);
  }, [Z, ht]), J(() => {
    K || !Ee.length || (At.current == null || !Ee.includes(At.current)) && (tt(Ee[0]), $t.current || ht(Ee[0]));
  }, [ht, Ee, K]);
  const an = Sn(
    (u) => {
      ze((b) => {
        const R = u(b);
        for (const L of /* @__PURE__ */ new Set([...b, ...R]))
          b.has(L) !== R.has(L) && It.current.set(
            L,
            (It.current.get(L) ?? 0) + 1
          );
        return R;
      });
    },
    []
  ), ma = Sn(
    (u) => {
      if (!Ee.length) return;
      const b = Math.max(
        0,
        Ee.indexOf(At.current ?? Ee[0])
      ), R = Ee[Math.max(0, Math.min(Ee.length - 1, b + u))];
      tt(R), $t.current || ht(R);
    },
    [ht, Ee]
  ), Ur = Sn(
    async (u) => {
      const b = "steps" in u ? u.steps.length > 0 : u.effect.mode !== "SKIP", R = "effect" in u && u.effect.mode === "SET_TAG_GROUP" ? u.effect.tagGroupId : null, L = R != null && (!A || !_.some((We) => We.id === R)), H = "effect" in u && b && !A, V = Di(
        bt.current,
        At.current
      );
      if (!M || Le.current || K || re) return;
      const ue = b && !dt ? `${Jt} write permission is required to apply ${u.label}.` : H || L ? `${u.label} needs a tag group that is unavailable.` : Dn(u) && (Ie == null ? void 0 : Ie.kind) !== "ready" ? `Set up tag assessments before applying ${u.label}.` : V.length ? "" : `Select or focus a ${Ae} before applying ${u.label}.`;
      if (ue) {
        yn(ue);
        return;
      }
      const Tt = ++B.current, $e = M.id, Ge = [...Ee], fe = Je, Ze = At.current, ir = new Set(bt.current), qn = new Map(
        V.map((We) => [We, It.current.get(We) ?? 0])
      ), or = () => Tt === B.current && M.id === $e;
      Le.current = !0, In(!0), br(
        bt.current.size ? `${V.length} selected ${Ae}s` : `the focused ${Ae}`
      ), Lt(""), yn("");
      const Oi = fe.items.filter(
        (We) => !V.includes(We.id)
      ), Zs = Oi.map((We) => We.id), Fi = _i(
        Ge,
        Zs,
        Ze,
        V.includes(Ze ?? -1)
      );
      zt({
        items: Oi,
        totalCount: fe.totalCount
      }), ze((We) => {
        const Ft = new Set(We);
        for (const Wt of V) Ft.delete(Wt);
        return Ft;
      }), tt(Fi), $t.current || ht(Fi);
      let va = !1;
      try {
        if ("effect" in u ? await fl(u, V) : await Ho(Ve, u, V), va = !0, !or()) return;
        ze((We) => {
          const Ft = new Set(We);
          for (const Wt of V)
            (It.current.get(Wt) ?? 0) === qn.get(Wt) && Ft.delete(Wt);
          return Ft;
        }), Lt(
          `${u.label}: ${V.length} ${Ae}${V.length === 1 ? "" : "s"} ${b ? "updated" : "skipped"}.`
        );
      } catch (We) {
        if (!or()) return;
        zt(fe), ze((Ft) => {
          const Wt = new Set(Ft);
          for (const jt of V)
            ir.has(jt) && (It.current.get(jt) ?? 0) === qn.get(jt) && Wt.add(jt);
          return Wt;
        }), tt(Ze), $t.current || ht(Ze), yn(
          We instanceof Error ? We.message : "Action failed."
        );
      }
      try {
        if (await il(u), !or()) return;
        const We = new Set(V), Ft = gn && Ge.length > 0 && Ge.every((Ht) => We.has(Ht)), Wt = await Nn(M, we, !1, Ft);
        if (!or()) return;
        let jt = Wt.items.map((Ht) => Ht.id);
        const Br = oe.current, ec = (Br == null ? void 0 : Br.page) === Number(we.page) && jt.some((Ht) => Br.ids.has(Ht)), tc = (M.view.startFrom ?? "end") !== "beginning";
        if (Wt.totalCount > 0 && Number(we.page) > 1 && (!jt.length || tc && !ec)) {
          const Ht = Math.max(1, Number(we.page) - 1), Vr = { ...we, page: Ht };
          Et(Vr), jt = (await Nn(
            M,
            Vr,
            !1,
            Ft
          )).items.map((Na) => Na.id), ze(
            (Na) => new Set([...Na].filter((nc) => jt.includes(nc)))
          );
          const xi = jt.at(-1) ?? null;
          tt(xi), $t.current || ht(xi);
        } else {
          ze(
            (Vr) => new Set([...Vr].filter((Mi) => jt.includes(Mi)))
          );
          const Ht = _i(
            Ge,
            jt,
            Ze,
            va && V.includes(Ze ?? -1)
          );
          tt(Ht), $t.current && Ht == null && bn(!1), $t.current || ht(Ht);
        }
      } catch (We) {
        or() && yn(
          (Ft) => `${Ft ? `${Ft} ` : ""}${va ? "The action completed, but " : ""}the queue could not be refreshed. ${We instanceof Error ? We.message : "Refresh failed."}`
        );
      } finally {
        or() && (Le.current = !1, In(!1), br(""), it.current && (it.current = !1, D(Ia()), vt((We) => We + 1)));
      }
    },
    [
      dt,
      A,
      _,
      Ae,
      Ie,
      Nn,
      we,
      ht,
      Ee,
      Je,
      K,
      re,
      M
    ]
  );
  function Ds() {
    var R;
    if (tn === "list") return 1;
    const u = (R = Pr.current) == null ? void 0 : R.firstElementChild, b = u ? getComputedStyle(u).gridTemplateColumns : "";
    return Math.max(1, b.split(" ").filter(Boolean).length);
  }
  const qi = I(() => {
  });
  qi.current = (u) => {
    var V;
    if (qe || u.defaultPrevented || u.repeat || u.ctrlKey || u.altKey || u.metaKey || Ce) return;
    const b = u.target, R = b instanceof Node && ((V = Fn.current) == null ? void 0 : V.contains(b)) === !0, L = b === document.body || b === document.documentElement;
    if (!R && !L) return;
    if (Rn) {
      u.key === "Escape" && (cr(u), en(!1));
      return;
    }
    if (Qe && u.key === "Escape") {
      cr(u), bn(!1), ht(At.current);
      return;
    }
    if (!Dc(b)) return;
    const H = Lc(b);
    if (u.key === "Escape") {
      cr(u), an(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!Qe && u.key === " " && H) {
      cr(u), ot != null && an((ue) => Yr(ue, ot));
      return;
    }
    if (!(ye || K) && !Qe && u.key === "Enter" && ot != null && H) {
      if (Ae !== "tag" && le) return;
      cr(u), Ae === "tag" ? window.open(`/tag/${ot}`, "_blank", "noopener,noreferrer") : bn(!0);
      return;
    }
  }, J(() => {
    const u = (b) => qi.current(b);
    return document.addEventListener("keydown", u), () => document.removeEventListener("keydown", u);
  }, []);
  const Si = I(
    () => {
    }
  );
  Si.current = (u) => {
    var V;
    if (qe || Ce || Qe || Rn || ye || K || !Ee.length || u.defaultPrevented || u.repeat || u.ctrlKey || u.altKey || u.metaKey)
      return;
    const b = u.target, R = b instanceof Node && ((V = Fn.current) == null ? void 0 : V.contains(b)) === !0, L = b === document.body || b === document.documentElement;
    if (!R && !L || !u.key.startsWith("Arrow") || !jc(b)) return;
    const H = Uc(u.key, Ds());
    H && (u.preventDefault(), R ? u.stopImmediatePropagation() : u.stopPropagation(), ma(H));
  }, J(() => {
    const u = (b) => Si.current(b);
    return document.addEventListener("keydown", u), () => document.removeEventListener("keydown", u);
  }, []);
  const xn = (le == null ? void 0 : le.saving) === !0 || $n, ga = ye || K && !Z || xn, _s = jn();
  si({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!M && !qe && !Ce && !le && !Qe && !Rn && !re && (Je.items.length > 0 || K || ye),
    actionCount: (M == null ? void 0 : M.actions.length) ?? 0,
    onAction: (u) => {
      const b = M == null ? void 0 : M.actions[u];
      b && Ur(b);
    },
    onFind: () => en(!0),
    onSelectAll: () => an((u) => Pc(u, Ee))
  }), J(() => en(!1), [qe, Qe, M == null ? void 0 : M.id]);
  function Ei(u) {
    const b = "steps" in u ? u.steps.length > 0 : u.effect.mode !== "SKIP", R = "effect" in u && u.effect.mode === "SET_TAG_GROUP" ? u.effect.tagGroupId : null, L = R != null && !_.some((H) => H.id === R);
    return ye || K || !!re || b && !dt || "effect" in u && b && (!A || L) || Dn(u) && (Ie == null ? void 0 : Ie.kind) !== "ready" || !kt.length;
  }
  function Gr(u) {
    gt(null), Xt(0), Ke(null), D(u), mo(u);
  }
  function ba() {
    se.current = "heading", Gr("");
  }
  function Ci(u) {
    u !== z && Gr(u), Xt((b) => b + 1);
  }
  function Ai(u) {
    Ke(null), xe({
      review: u ? { ...structuredClone(u), id: crypto.randomUUID(), name: `${u.name} copy` } : xs("video", { id: crypto.randomUUID(), name: "", description: "" }),
      duplicate: !!u,
      saving: !1,
      error: ""
    });
  }
  async function js() {
    if (!ft || ft.saving) return;
    const u = { ...ft.review, name: ft.review.name.trim() }, b = Tr(u);
    if (b) {
      xe({ ...ft, error: b });
      return;
    }
    xe({ ...ft, saving: !0, error: "" });
    try {
      if (!await ar([...t, u])) throw new Error("Could not save reviews.");
      xe(null), Ci(u.id);
    } catch (R) {
      xe(
        (L) => L && {
          ...L,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (R instanceof Error ? R.message : "Retry saving.")
        }
      );
    }
  }
  async function Us() {
    if (!ke || ke.pending) return;
    const u = ke.review, b = Ms(t, de, nt, Pt).map((H) => H.id), R = b.filter((H) => H !== u.id), L = R[Math.min(b.indexOf(u.id), R.length - 1)];
    Nt({ review: u, pending: !0 });
    try {
      if (!await ar(t.filter((H) => H.id !== u.id)))
        throw new Error("Could not save reviews.");
      se.current = u.id !== z && L ? { reviewId: L } : "heading", Ke({ text: `Deleted “${u.name}”.`, alert: !1 });
    } catch (H) {
      Ke({ text: `“${u.name}” was not deleted. ${ki(H)}`, alert: !0 });
    } finally {
      Nt(null);
    }
  }
  async function Gs(u) {
    if (!(Rt || !Q)) {
      Ke(null), je(!0);
      try {
        const b = await Wl(u), R = Oa(t, b), L = R.length - t.length, H = b.length - L;
        if (L && !await ar(R)) throw new Error("Could not save reviews.");
        Ke({
          alert: !1,
          text: b.length ? L ? `Imported ${L === 1 ? "1 review" : `${L} reviews`}.` + (H === 1 ? " 1 review already in the list stays as it is." : H ? ` ${H} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (b) {
        Ke({ alert: !0, text: `Could not import “${u.name}”. ${ki(b)}` });
      } finally {
        je(!1);
      }
    }
  }
  function ki(u) {
    return u instanceof _o ? "Reviews changed in another browser. Reload the page to get them, then try again." : u instanceof Error ? u.message : "Try again.";
  }
  function Ti(u) {
    const b = !Q || Rt;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ r(Co, { "aria-hidden": "true" }),
        disabled: b,
        onSelect: () => Ai(u)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ r(xo, { "aria-hidden": "true" }),
        onSelect: () => fi(u)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ r(Ao, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: b,
        onSelect: () => {
          Ke(null), Nt({ review: u, pending: !1 });
        }
      }
    ];
  }
  function Ri(u, b) {
    return [
      { label: "Edit review", icon: /* @__PURE__ */ r(ur, { "aria-hidden": "true" }), ...b },
      ...Ti(u),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ r($r, { "aria-hidden": "true" }),
        separated: !0,
        onSelect: ba
      }
    ];
  }
  async function ar(u) {
    if (!i) return !1;
    const b = u.map(iu);
    try {
      await zc(i, b);
    } catch (L) {
      throw L;
    }
    n(b), z && !b.some((L) => L.id === z) && Gr("");
    const R = b.find((L) => L.id === z);
    return R && W && ((R.view.reviewMode ?? "single") !== (W.view.reviewMode ?? "single") && gt(null), R.view.displayMode !== W.view.displayMode && mr(ho(R))), !0;
  }
  if (s)
    return /* @__PURE__ */ r(go, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ c(he, { children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          onClick: () => void du().catch(
            (u) => h(
              "Could not export browser reviews. " + (u instanceof Error ? u.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ r(
        bo,
        {
          message: d,
          onRetry: () => void De()
        }
      )
    ] });
  const wa = /* @__PURE__ */ c(he, { children: [
    G && /* @__PURE__ */ r("p", { className: "dq-status", children: G }),
    Un && (Ie == null ? void 0 : Ie.kind) === "missing" && /* @__PURE__ */ c("div", { role: "status", className: "dq-status", children: [
      Ie.message,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: rn,
          onClick: () => {
            nr(!0), vn(""), (qt ? cl(Ve) : sl(Ve)).then(Kn).catch(
              (u) => vn(
                `Could not create the ${qt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (u instanceof Error ? u.message : "Request failed.")
              )
            ).finally(() => nr(!1));
          },
          children: rn ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    Un && ((Ie == null ? void 0 : Ie.kind) === "incompatible" || tr) && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(Jn, {}),
      tr || (Ie == null ? void 0 : Ie.message),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: rn,
          onClick: () => {
            nr(!0), Kn().finally(
              () => nr(!1)
            );
          },
          children: rn ? "Checking…" : "Check again"
        }
      )
    ] }),
    a && /* @__PURE__ */ c("details", { children: [
      /* @__PURE__ */ r("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ r("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const u = localStorage.getItem("page-videos") ?? "[]", b = URL.createObjectURL(
              new Blob([u], { type: "application/json" })
            ), R = document.createElement("a");
            R.href = b, R.download = "data-quality-unassigned-legacy-reviews.json", R.click(), URL.revokeObjectURL(b);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    C && /* @__PURE__ */ c("p", { role: "alert", children: [
      C,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => {
            x(""), ie(!1);
          },
          children: U ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    be && (be.alert ? /* @__PURE__ */ c("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(Jn, { "aria-hidden": "true" }),
      be.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ r("p", { className: "dq-status", "aria-hidden": "true", children: be.text })
    ))
  ] });
  return /* @__PURE__ */ c(
    "div",
    {
      ref: Fn,
      className: `data-quality-page${Mn ? " dq-page-fit" : ""}`,
      style: Mn ? {
        "--dq-fit-top": `${yr.top}px`,
        "--dq-fit-bottom": `${yr.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: be && !be.alert ? be.text : "" }),
        M && qe ? /* @__PURE__ */ r(
          Vd,
          {
            review: W ?? M,
            canWrite: Bt ? y : Ye,
            canAssess: (Ie == null ? void 0 : Ie.kind) === "ready" && Ye,
            onBusy: In,
            editRequest: un,
            onEditRequestHandled: () => Xt(0),
            onSaveDefaults: Q ? (u) => ar(t.map((b) => b.id === u.id ? u : b)) : void 0,
            pageControls: {
              onBack: ba,
              moreItems: (u) => Ri(W ?? M, u),
              onGrid: ee ? () => gt({ id: ee.id, mode: "multiple" }) : void 0,
              notices: wa
            }
          },
          M.id
        ) : M ? Ys(M) : /* @__PURE__ */ r(
          zd,
          {
            reviews: t,
            counts: de,
            sort: nt,
            direction: Pt,
            onSortChange: rt,
            onDirectionChange: et,
            storage: Wd[X],
            canConfigure: Q,
            busy: Rt,
            headingRef: at,
            notices: wa,
            onOpen: Gr,
            onNew: () => Ai(),
            onImport: (u) => void Gs(u),
            onExportAll: () => ps(t, "data-quality-reviews.json"),
            rowMenuItems: (u) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ r(ur, { "aria-hidden": "true" }),
                disabled: !Q || Rt,
                onSelect: () => Ci(u.id)
              },
              ...Ti(u)
            ]
          }
        ),
        Qe && Qt && ee && /* @__PURE__ */ r(
          lu,
          {
            video: Qt,
            review: ee,
            selectedCount: Se.size,
            pending: ye,
            refreshing: K || !!re,
            error: wn,
            canWrite: p,
            assessmentReady: (Ie == null ? void 0 : Ie.kind) === "ready",
            trees: Me,
            selected: Se.has(Qt.id),
            hasPrevious: Ee.indexOf(Qt.id) > 0,
            hasNext: Ee.indexOf(Qt.id) >= 0 && Ee.indexOf(Qt.id) < Ee.length - 1,
            onToggleSelected: () => an((u) => Yr(u, Qt.id)),
            onPrevious: () => ma(-1),
            onNext: () => ma(1),
            onClose: () => {
              bn(!1), ht(At.current);
            },
            onAction: Ur,
            findOpen: Rn,
            onFindOpenChange: en
          }
        ),
        Rn && M && !qe && !Qe && /* @__PURE__ */ r(
          di,
          {
            actions: M.actions,
            tagGroups: _,
            trees: Me,
            isDisabled: Ei,
            canStay: !1,
            onApply: (u) => {
              en(!1), Ur(u);
            },
            onClose: () => en(!1)
          }
        ),
        ft && /* @__PURE__ */ r(
          Qd,
          {
            draft: ft,
            onChange: (u) => xe((b) => b && { ...b, review: u, error: "" }),
            onCreate: () => void js(),
            onCancel: () => xe(null)
          }
        ),
        /* @__PURE__ */ r(
          hc,
          {
            open: !!ke,
            title: "Delete review?",
            message: ke ? `“${ke.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (ke == null ? void 0 : ke.pending) ?? !1,
            onConfirm: () => void Us(),
            onCancel: () => Nt((u) => u != null && u.pending ? u : null)
          }
        )
      ]
    }
  );
  async function Kr(u, b, R = !1) {
    const L = At.current, H = Math.max(0, Ee.indexOf(L ?? -1));
    try {
      const V = Nn(
        u,
        b,
        R,
        u.view.selectAllOnLoad === !0
      ), ue = $.current, Tt = await V;
      if (ue !== $.current) return;
      const $e = Tt.items.map((fe) => fe.id);
      ze(
        (fe) => new Set([...fe].filter((Ze) => $e.includes(Ze)))
      );
      const Ge = Li($e, L, H);
      tt(Ge), $t.current || ht(Ge, !1);
    } catch {
    }
  }
  function Ks(u) {
    const b = Zt.current;
    if (Zt.current = null, ga || !M || !W) return;
    const R = b ?? M.view.objectFilter, L = Hn(
      R,
      W.view.objectFilter
    ) ? W.view.objectFilter : R, H = Mt({ ...u, page: 1 }), V = {
      ...M,
      view: {
        ...M.view,
        filter: H,
        objectFilter: L
      }
    }, ue = !fo(V, W), Tt = ue ? V : W;
    He(ue ? V : null), Lt(ue ? "" : "Review queue defaults restored."), Kr(Tt, H, !0);
  }
  function Bs() {
    if (ye || K || xn || !W) return;
    Zt.current = null;
    const u = Mt({
      ...W.view.filter,
      page: 1
    });
    He(null), Lt("Review queue defaults restored."), Kr(
      W,
      u,
      W.view.startFrom !== "beginning"
    );
  }
  function Vs() {
    if (ye || K || re || xn || !M || !Dt || !Q)
      return;
    const u = M, b = Dt;
    xr(!0), ar(
      t.map((R) => R.id === b.id ? b : R)
    ).then((R) => {
      R && (He(uo(b, u)), Lt("Queue saved to this review."));
    }).catch(
      (R) => yn(
        R instanceof Error ? R.message : "Could not save queue."
      )
    ).finally(() => xr(!1));
  }
  function ya() {
    if (!M || !W || Le.current || le || $n) return;
    Kt.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, fn.current = {
      temporaryReview: Be,
      filter: we,
      loadedFilter: Gn,
      queue: Je,
      queueError: re,
      retryFromEnd: mn,
      selectedIds: new Set(Se),
      focusedId: ot,
      pageCursor: oe.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const u = structuredClone({
      ...W,
      view: { ...W.view, startFrom: M.view.startFrom ?? "end" }
    });
    en(!1), bn(!1), Lt(""), yn(""), lt({ draft: u, saving: !1, error: "" });
  }
  function Ii() {
    lt(null), fn.current = null;
    const u = Kt.current;
    Kt.current = null, requestAnimationFrame(() => {
      (u == null ? void 0 : u.isConnected) && u !== document.body && !(u instanceof HTMLButtonElement && u.disabled) ? u.focus({ preventScroll: !0 }) : ht(At.current, !1);
    });
  }
  function Js() {
    var b;
    if (!le || le.saving) return;
    const u = fn.current;
    u && ($.current += 1, (b = ae.current) == null || b.abort(), Zt.current = null, ge(!1), He(u.temporaryReview), Et(u.filter), pn(u.loadedFilter), zt(u.queue), Fe(u.queueError), me(u.retryFromEnd), an(() => u.selectedIds), tt(u.focusedId), oe.current = u.pageCursor, window.history.replaceState(window.history.state, "", u.url)), Ii();
  }
  async function zs() {
    if (!le || le.saving || !Xe || !M) return;
    const u = M, b = { ...Xe, name: Xe.name.trim() }, R = Tr(b);
    if (R) {
      lt((L) => L && { ...L, error: R });
      return;
    }
    lt((L) => L && { ...L, saving: !0, error: "" });
    try {
      if (!await ar(t.map((L) => L.id === b.id ? b : L)))
        throw new Error("Could not save reviews.");
      He(uo(b, u)), Oe(b) === "video" && Cr(b.id, {
        filter: we,
        objectFilter: u.view.objectFilter,
        searchMode: b.view.searchMode,
        startFrom: b.view.startFrom ?? "end"
      }), Lt("Review saved."), Ii();
    } catch (L) {
      lt(
        (H) => H && {
          ...H,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (L instanceof Error ? L.message : "Retry saving.")
        }
      );
    }
  }
  function $i() {
    M && Nn(M, we, mn, gn).catch(() => {
    });
  }
  function Qs() {
    ze(/* @__PURE__ */ new Set()), It.current.clear(), tt(null);
  }
  function Ws(u) {
    !M || ye || xn || u === Number(we.page) || au(
      { ...we, page: u },
      M,
      (b, R) => Nn(b, R, !1, gn),
      Qs
    );
  }
  function Hs(u) {
    if (!ee || !W || ye || K || xn) return;
    const b = Dd(ee, u, W.view.objectFilter), R = !fo(b, W);
    He(R ? b : null), R ? Kr(b, { ...we, page: 1 }) : Kr(
      W,
      { ...we, page: 1 },
      W.view.startFrom !== "beginning"
    );
  }
  function Ys(u) {
    var $e, Ge;
    const b = Ae === "tag", R = b ? "tag" : "video", L = Math.max(1, Number(we.perPage) || 40), H = Math.max(1, Math.ceil(Je.totalCount / L)), V = Math.min(Math.max(1, Number(we.page) || 1), H), ue = [
      dt ? "" : `${Jt} write permission is required to apply actions.`,
      b && k ? `Tag groups are unavailable. ${k}` : ""
    ].filter(Boolean), Tt = !!wn && !Qe;
    return /* @__PURE__ */ c(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": b ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ r(
            bs,
            {
              name: u.name,
              description: u.description,
              entityType: Ae,
              onBack: ba,
              backDisabled: ye || !!le,
              onEdit: le ? () => {
                var fe;
                return (fe = Tn.current) == null ? void 0 : fe.focus();
              } : ya,
              editDisabled: !le && (ye || K || Pe || $n || !Q),
              editing: !!le,
              toolbar: /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: ga, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: b ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ r(
                  Ar,
                  {
                    filter: re ? Gn : we,
                    onFilterChange: Ks,
                    totalCount: Je.totalCount,
                    sortOptions: b ? mc : No,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: tn,
                    zoomLevel: (ut - 225) / 50,
                    onZoomChange: (fe) => gr(Math.round(225 + fe * 50)),
                    cardSizeEntityType: b ? "tags" : "videos",
                    criteriaDefinitions: b ? pc : Qa,
                    customFieldEntityType: Ae === "video" ? "video" : void 0,
                    objectFilter: vr,
                    onObjectFilterChange: (fe) => {
                      ga || (Zt.current = Ae === "video" ? vs(
                        fe,
                        wr,
                        u.view.objectFilter
                      ) : fe);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(ws, { page: V, pages: H, onPage: Ws })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ c(he, { children: [
                ee && /* @__PURE__ */ r(
                  ys,
                  {
                    mode: "multiple",
                    disabled: ye || K || Ce || !!le || $n,
                    onChange: () => gt({ id: ee.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ r(
                  ed,
                  {
                    options: b ? Zd : Xd,
                    value: tn,
                    onChange: (fe) => mr(po(fe, Ae))
                  }
                ),
                /* @__PURE__ */ r(
                  hi,
                  {
                    disabled: ye || !!le,
                    items: Ri(W ?? u, {
                      onSelect: ya,
                      disabled: K || Pe || $n || !Q
                    })
                  }
                )
              ] }),
              chipsAfter: (Ge = ($e = ee == null ? void 0 : ee.presentation) == null ? void 0 : $e.binParents) != null && Ge.length ? /* @__PURE__ */ r(
                Pd,
                {
                  videos: Je.items,
                  review: ee,
                  savedObjectFilter: (W ?? ee).view.objectFilter,
                  trees: St.ids,
                  disabled: ye || K || xn,
                  onToggle: Hs
                }
              ) : void 0,
              chipsEnd: le ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : (Be == null ? void 0 : Be.id) === z ? /* @__PURE__ */ c(he, { children: [
                /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
                Ot && /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-text-button",
                    title: "Save the current queue criteria to this review",
                    disabled: ye || K || !!re || xn || !Q,
                    onClick: Vs,
                    children: [
                      /* @__PURE__ */ r(Oo, { "aria-hidden": "true" }),
                      "Save to review"
                    ]
                  }
                ),
                /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-text-button",
                    title: "Reset the queue to the review's saved criteria",
                    disabled: ye || K || xn,
                    onClick: Bs,
                    children: [
                      /* @__PURE__ */ r(Fo, { "aria-hidden": "true" }),
                      "Reset"
                    ]
                  }
                )
              ] }) : void 0
            }
          ),
          wa,
          ee && St.error && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: St.error }),
          /* @__PURE__ */ c("div", { className: "dq-review-area", children: [
            le && Xe && /* @__PURE__ */ r(
              gs,
              {
                drawerRef: Tn,
                draft: Xe,
                onChange: (fe) => lt((Ze) => Ze && { ...Ze, draft: fe }),
                direction: le.draft.view.startFrom ?? "end",
                onDirectionChange: (fe) => lt(
                  (Ze) => Ze && {
                    ...Ze,
                    draft: { ...Ze.draft, view: { ...Ze.draft.view, startFrom: fe } }
                  }
                ),
                tagGroups: _,
                trees: Me,
                saving: le.saving,
                saveDisabled: K || !!re,
                error: le.error,
                dirty: wt,
                criteriaChanged: Ot,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  re && !K ? /* @__PURE__ */ c("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ r(Jn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ c("span", { children: [
                      "The queue could not load: ",
                      re,
                      " ",
                      /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", onClick: $i, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void zs(),
                onCancel: Js
              }
            ),
            /* @__PURE__ */ c(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${Dr}px` },
                children: [
                  /* @__PURE__ */ c("div", { className: "dq-grid-content", children: [
                    K && !Je.items.length && /* @__PURE__ */ r(go, { label: "Loading review queue…" }),
                    re && !K && /* @__PURE__ */ r(
                      bo,
                      {
                        message: re,
                        retryLabel: Pe ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (Pe && W && Oe(W) === "video") {
                            const fe = Yn(W);
                            Cr(W.id, { ...fe, filter: { ...fe.filter, page: void 0 } }), vt((Ze) => Ze + 1);
                            return;
                          }
                          $i();
                        }
                      }
                    ),
                    !ye && !K && !re && !Je.items.length && /* @__PURE__ */ c("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ r(oa, {}),
                      /* @__PURE__ */ c("p", { children: [
                        "No ",
                        R,
                        "s match this review."
                      ] })
                    ] }),
                    !!Je.items.length && /* @__PURE__ */ r("div", { ref: Pr, children: /* @__PURE__ */ r(
                      "div",
                      {
                        className: tn === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${ut}px` },
                        children: Je.items.map(Xs)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ r("div", { className: "dq-bar-dock", ref: v, children: /* @__PURE__ */ r(
                    cs,
                    {
                      actions: le ? le.draft.actions : u.actions,
                      tagGroups: _,
                      trees: Me,
                      isDisabled: Ei,
                      paused: !!le,
                      busy: ye || K,
                      onApply: (fe) => void Ur(fe),
                      onFind: () => en(!0),
                      status: ye ? `Applying action to ${fa}…` : "",
                      summary: /* @__PURE__ */ c(he, { children: [
                        /* @__PURE__ */ r("p", { className: "dq-bar-target", children: Se.size ? `${Se.size} selected` : ot == null ? "Nothing to apply to" : `Applies to the focused ${R}` }),
                        /* @__PURE__ */ c(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !Ee.length || jr,
                            onClick: () => an((fe) => /* @__PURE__ */ new Set([...fe, ...Ee])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ r(pt, { binding: _s.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ c(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !Se.size,
                            onClick: () => an(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ r(pt, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: ue.length ? ue.join(" ") : b ? "Arrows move · Space selects · Enter opens" : le ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews",
                      notices: Tt || nn ? /* @__PURE__ */ c(he, { children: [
                        Tt && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ r(Jn, { "aria-hidden": "true" }),
                          wn
                        ] }),
                        nn && /* @__PURE__ */ r("p", { role: "status", className: "dq-status", children: nn })
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
  function Xs(u) {
    var R, L, H;
    if (Ae === "tag") {
      const V = u;
      return /* @__PURE__ */ r(
        ou,
        {
          tag: V,
          displayMode: tn === "list" ? "list" : "grid",
          focused: V.id === ot,
          selected: Se.has(V.id),
          setRef: (ue) => {
            ue ? On.current.set(V.id, ue) : On.current.delete(V.id);
          },
          onFocus: () => tt(V.id),
          onToggle: () => {
            an((ue) => Yr(ue, V.id)), ht(V.id, !1);
          },
          onOpen: () => window.open(`/tag/${V.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        V.id
      );
    }
    const b = u;
    return /* @__PURE__ */ r(
      su,
      {
        video: xd(b, ee, St.ids),
        showTagBins: ((L = (R = ee == null ? void 0 : ee.presentation) == null ? void 0 : R.annotations) == null ? void 0 : L.includes("tags")) && !!((H = ee.presentation.annotationParents) != null && H.length),
        displayMode: tn,
        cardsScroll: Lr,
        focused: b.id === ot,
        selected: Se.has(b.id),
        setRef: (V) => {
          V ? On.current.set(b.id, V) : On.current.delete(b.id);
        },
        onFocus: () => tt(b.id),
        onToggle: () => an((V) => Yr(V, b.id)),
        onPreview: () => {
          le || (tt(b.id), bn(!0));
        },
        onNavigate: e
      },
      b.id
    );
  }
}
function au(e, t, n, a) {
  a(), n(t, e).catch(() => {
  });
}
function Yr(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function iu(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function ou({
  tag: e,
  displayMode: t,
  focused: n,
  selected: a,
  setRef: i,
  onFocus: o,
  onToggle: s,
  onOpen: l,
  onNavigate: d
}) {
  return /* @__PURE__ */ r(
    "article",
    {
      ref: i,
      tabIndex: 0,
      "aria-current": n ? "true" : void 0,
      "aria-label": `${e.name}${a ? ", selected" : ""}`,
      onFocus: o,
      onClick: (h) => {
        o(), h.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${n ? "focused" : ""} ${a ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ r(
        gc,
        {
          tag: e,
          selected: a,
          onSelect: s,
          onClick: l,
          onNavigate: d
        }
      ) : /* @__PURE__ */ c("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            "aria-label": a ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": a,
            onClick: (h) => {
              h.stopPropagation(), s();
            },
            children: a ? "✓" : ""
          }
        ),
        /* @__PURE__ */ r("button", { type: "button", className: "dq-tag-list-name", onClick: l, children: e.name }),
        /* @__PURE__ */ r("span", { children: e.tagGroupName || "Ungrouped" }),
        /* @__PURE__ */ r("span", { children: e.description || "" }),
        /* @__PURE__ */ c("span", { children: [
          e.videoCount ?? 0,
          " videos"
        ] })
      ] })
    }
  );
}
function su({
  video: e,
  showTagBins: t,
  displayMode: n,
  cardsScroll: a,
  focused: i,
  selected: o,
  setRef: s,
  onFocus: l,
  onToggle: d,
  onPreview: h,
  onNavigate: p
}) {
  var A, E;
  const g = Ps(e), m = I(null), w = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(w.date || w.studioName), N = !!(w.performers.length || w.tags.length);
  return sn(() => {
    const _ = m.current;
    if (!_) return;
    const O = _.querySelector(
      `a[href="/video/${e.id}"]`
    ), k = _.querySelector(".card-title"), P = `dq-card-title-${e.id}`;
    k && (k.id = P), O && (O.target = "_blank", O.rel = "noreferrer", O.removeAttribute("aria-label"), O.setAttribute("aria-labelledby", P), O.classList.add("dq-card-link"));
    const Q = _.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    Q && Q.setAttribute(
      "aria-label",
      o ? `Deselect ${g}` : `Select ${g}`
    );
    const te = _.querySelector(
      'button[title="Quick View"]'
    );
    te && te.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ c(
    "article",
    {
      ref: (_) => {
        m.current = _, s(_);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${g}${o ? ", selected" : ""}`,
      onFocus: l,
      onClick: (_) => {
        l(), _.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${y ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ r(
          bc,
          {
            video: w,
            selected: o,
            onSelect: d,
            onNavigate: p,
            onQuickView: h,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ c("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (A = e.tags) == null ? void 0 : A.map((_) => /* @__PURE__ */ r("span", { children: _.name }, _.id)),
          !((E = e.tags) != null && E.length) && /* @__PURE__ */ r("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ r(cu, { video: e, cardsScroll: a })
      ]
    }
  );
}
function cu({ video: e, cardsScroll: t }) {
  const n = I(null), a = I(null), [i, o] = S(!1), [s, l] = S(!1), [d, h] = S(!1);
  return J(() => {
    const p = n.current;
    if (!p || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), l(!0);
      return;
    }
    const g = t ? p.closest(".dq-grid-stage") : null, m = new IntersectionObserver(
      ([y]) => o(y.isIntersecting),
      { root: g, rootMargin: "320px 0px", threshold: 0 }
    ), w = new IntersectionObserver(
      ([y]) => l(y.isIntersecting && y.intersectionRatio >= 0.6),
      { root: g, threshold: [0, 0.6, 1] }
    );
    return m.observe(p), w.observe(p), () => {
      m.disconnect(), w.disconnect();
    };
  }, [e.id, e.files.length, t]), J(() => {
    if (!i) {
      h(!1);
      return;
    }
    const p = new AbortController();
    return ce(al(e.id), {
      signal: p.signal
    }).then((g) => {
      p.signal.aborted || h(g.available === !0);
    }).catch(() => {
      p.signal.aborted || h(!1);
    }), () => p.abort();
  }, [i, e.id]), J(() => {
    const p = a.current;
    p && (s ? Promise.resolve(p.play()).catch(() => {
    }) : p.pause());
  }, [d, s]), /* @__PURE__ */ r("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: d && /* @__PURE__ */ r(
    "video",
    {
      ref: a,
      src: rl(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function lu({
  video: e,
  review: t,
  selectedCount: n,
  pending: a,
  refreshing: i,
  error: o,
  canWrite: s,
  assessmentReady: l,
  trees: d,
  selected: h,
  hasPrevious: p,
  hasNext: g,
  onToggleSelected: m,
  onPrevious: w,
  onNext: y,
  onClose: N,
  onAction: A,
  findOpen: E,
  onFindOpenChange: _
}) {
  const O = I(null), k = I(null), P = e.files[0], Q = Ps(e), te = (C) => a || i || "steps" in C && C.steps.length > 0 && !s || Dn(C) && !l;
  si({
    surface: "overlay",
    enabled: !E,
    actionCount: t.actions.length,
    onAction: (C) => {
      const x = t.actions[C];
      x && A(x);
    },
    onFind: () => _(!0)
  }), J(() => {
    var x;
    const C = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (x = O.current) == null || x.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = C;
    };
  }, []);
  function X(C) {
    var ie, Z, ne;
    if (C.key !== "Tab") return;
    const x = [
      ...((ie = O.current) == null ? void 0 : ie.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((F) => F.offsetParent !== null);
    if (!x.length) {
      C.preventDefault(), (Z = O.current) == null || Z.focus();
      return;
    }
    const U = x.indexOf(
      document.activeElement
    );
    C.shiftKey && U <= 0 ? (C.preventDefault(), (ne = x.at(-1)) == null || ne.focus()) : !C.shiftKey && U === x.length - 1 && (C.preventDefault(), x[0].focus());
  }
  function j(C) {
    if (E || C.defaultPrevented || C.ctrlKey || C.metaKey || C.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const x = C.key === "ArrowLeft" || C.key === "ArrowRight";
    if (C.altKey && !x) return;
    const U = k.current, ie = C.currentTarget.querySelector("video");
    if (C.key === "Enter" || C.key === "Escape")
      C.repeat || N();
    else if (C.key === " " && U)
      C.repeat || U.toggle();
    else if (x && U)
      U.seekBy(
        (C.key === "ArrowLeft" ? -1 : 1) * (C.shiftKey ? 5 : C.altKey ? 10 : 60)
      );
    else if ((C.key === "," || C.key === ".") && U) {
      const Z = [P == null ? void 0 : P.duration, ie == null ? void 0 : ie.duration].find(
        (F) => F != null && Number.isFinite(F) && F > 0
      ) ?? 0, ne = e.parentVideoId != null ? (e.clipEndSec ?? Z) - (e.clipStartSec ?? 0) : Z;
      Number.isFinite(ne) && ne > 0 && U.seekBy((C.key === "," ? -1 : 1) * ne * 0.1);
    } else if (C.key.toLowerCase() === "n" || C.key.toLowerCase() === "m")
      !C.repeat && !a && !i && (C.key.toLowerCase() === "n" && p && w(), C.key.toLowerCase() === "m" && g && y());
    else if (C.key === "ArrowUp" && ie)
      ie.volume = Math.min(1, ie.volume + 0.1);
    else if (C.key === "ArrowDown" && ie)
      ie.volume = Math.max(0, ie.volume - 0.1);
    else return;
    cr(C);
  }
  function G(C) {
    const x = O.current, U = C.target instanceof Element ? C.target.closest("button, a[href]") : null;
    !x || !U || !x.contains(U) || U.closest(".dq-player, .dq-find-action") || C.detail === 0 || x.focus({ preventScroll: !0 });
  }
  J(() => {
    if (E) return;
    let C = 0;
    const x = requestAnimationFrame(() => {
      C = requestAnimationFrame(() => {
        var ie;
        const U = document.activeElement;
        (ie = O.current) != null && ie.isConnected && (!U || U === document.body || U === document.documentElement) && O.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(x), cancelAnimationFrame(C);
    };
  }, [E, a, i, g, p, e.id]);
  const Y = n ? `the ${n} selected video${n === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ c(
    "div",
    {
      ref: O,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${Q}`,
      className: "dq-preview",
      onKeyDown: X,
      onKeyDownCapture: j,
      onMouseDown: (C) => {
        C.target === C.currentTarget && N();
      },
      onClick: G,
      children: [
        /* @__PURE__ */ c("div", { className: "dq-preview-shell", children: [
          /* @__PURE__ */ c("header", { className: "dq-preview-header", children: [
            /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-preview-button",
                "aria-label": "Previous video",
                "aria-keyshortcuts": "n",
                title: "Previous video",
                disabled: !p || a || i,
                onClick: w,
                children: [
                  /* @__PURE__ */ r($r, { "aria-hidden": "true" }),
                  /* @__PURE__ */ r(pt, { binding: "n", hidden: !0 })
                ]
              }
            ),
            /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-preview-button",
                "aria-label": "Next video",
                "aria-keyshortcuts": "m",
                title: "Next video",
                disabled: !g || a || i,
                onClick: y,
                children: [
                  /* @__PURE__ */ r(pt, { binding: "m", hidden: !0 }),
                  /* @__PURE__ */ r($o, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ c("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ r("h2", { children: Q }),
              /* @__PURE__ */ c("p", { children: [
                "Actions apply to ",
                Y
              ] })
            ] }),
            /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-select",
                "aria-pressed": h,
                disabled: i,
                onClick: m,
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-preview-check", "aria-hidden": "true", children: h && /* @__PURE__ */ r(Ya, {}) }),
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
                "aria-label": `Open ${Q} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ r(Mo, { "aria-hidden": "true" })
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
                children: /* @__PURE__ */ r(Ir, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ r("div", { className: "dq-preview-video", children: P ? /* @__PURE__ */ r(
            qo,
            {
              autostart: !0,
              streamUrl: La("video", e.id),
              posterUrl: Gi(e),
              format: P.format,
              audioCodec: P.audioCodec,
              duration: P.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onPlaybackControlRegister: (C) => (k.current = C, () => {
                k.current === C && (k.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ r("img", { src: Gi(e), alt: "" }) }) }),
          o && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert dq-preview-alert", children: o }),
          /* @__PURE__ */ c("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ r("span", { children: "Space play / pause" }),
            /* @__PURE__ */ r("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ r("span", { children: ", . ±10 %" }),
            /* @__PURE__ */ r("span", { children: "↑ ↓ volume" }),
            /* @__PURE__ */ r("span", { children: "N M previous / next" }),
            /* @__PURE__ */ r("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ r(
            cs,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: d,
              isDisabled: te,
              busy: a || i,
              onApply: (C) => void A(C),
              onFind: () => _(!0),
              status: a ? `Applying action to ${Y}…` : "",
              summary: /* @__PURE__ */ r("p", { className: "dq-bar-target", children: n ? `${n} selected` : "This video" })
            }
          )
        ] }),
        E && /* @__PURE__ */ r(
          di,
          {
            actions: t.actions,
            trees: d,
            isDisabled: te,
            canStay: !1,
            onApply: (C) => {
              _(!1), A(C);
            },
            onClose: () => _(!1)
          }
        )
      ]
    }
  );
}
async function du() {
  const e = await ce("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
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
function go({ label: e }) {
  return /* @__PURE__ */ c("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ r(Tc, { className: "dq-spin" }),
    e
  ] });
}
function bo({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ c("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ r(Jn, {}),
    /* @__PURE__ */ r("p", { children: e }),
    /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const gu = { components: { DataQualityPage: ru } };
export {
  ru as DataQualityPage,
  gu as default,
  Hn as objectFiltersEqual
};
