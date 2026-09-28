import { jsxs as c, Fragment as pe, jsx as r } from "react/jsx-runtime";
import { useRef as k, useLayoutEffect as pn, useMemo as qe, useState as S, useEffect as z, useId as Ct, useSyncExternalStore as Ao, Fragment as ei, createContext as vc, useContext as Nc, useCallback as Sn } from "react";
import { useKeySequence as qc, EntityReferenceMultiSelector as Cn, SortableList as ko, EntityDetailTabs as Sc, TagBadge as Ec, DetailListToolbar as Dr, PERFORMER_CRITERIA as ti, AUDIO_CRITERIA as To, VIDEO_CRITERIA as ni, NarrativeText as Cc, AUDIO_SORT_OPTIONS as Ac, VIDEO_SORT_OPTIONS as Ro, AudioPlayer as kc, VideoPlayer as Io, formatDuration as Oo, FilterDialog as Tc, getResolutionLabel as Rc, ConfirmDialog as Ic, TAG_CRITERIA as Oc, TAG_SORT_OPTIONS as $c, TagTile as Fc, VideoCard as Mc } from "@cove/runtime/components";
import { Search as ua, Pencil as yr, Ban as _a, Pin as xc, Plus as ri, GripVertical as $o, AlertTriangle as Zn, Copy as Fo, Trash2 as Mo, ChevronDown as xo, X as Gr, Mic as Pc, Users as Po, Tag as Lo, Headphones as Do, Film as fa, ChevronLeft as Kr, RectangleHorizontal as Lc, LayoutGrid as ai, MoreHorizontal as Dc, ChevronRight as _o, Layers as Ki, Check as ii, Undo2 as _c, Flag as ia, RefreshCw as jc, Save as jo, RotateCcw as Uo, ExternalLink as Go, SkipForward as Uc, Upload as Gc, Download as Ko, ArrowUp as Kc, ArrowDown as Bc, Loader2 as Vc, List as Jc, Grid3X3 as zc } from "@cove/runtime/lucide-react";
import { extensionFetch as Qc } from "@cove/runtime/api";
const oi = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, si = Object.keys(
  oi
);
function _r(e) {
  return e === "excludes" || e === "excludesAll";
}
function ci(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
const Bo = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Ne(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function li(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function ke(e) {
  return li($e(e));
}
function Wc(e) {
  return $e(e) === "video";
}
function $e(e) {
  return e.entityType ?? "video";
}
const vr = [
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
function jr(e) {
  return Ne(e) && !Vo(e.occurrence) ? "Complete the optional occurrence condition before saving." : !Wc(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : $e(e) !== "tag" && e.actions.some(
    (t) => di(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => An(t, $e(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const Hc = {
  video: 1e3,
  audio: 250
};
function Pt(e, t = "video") {
  const n = (a, i) => Number.isFinite(Number(a)) && Number(a) > 0 ? Math.floor(Number(a)) : i;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(Hc[t], n(e.perPage, 40))
    )
  };
}
function Bi(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function Ln(e) {
  const { page: t, ...n } = e.view.filter, a = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Ne(e) ? [e.entityType, ...a, e.occurrence] : $e(e) === "video" ? a : [$e(e), ...a]
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
  ) && !di(e) : !1;
}
function Yc(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function En(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function ha(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Dn(e) {
  return "steps" in e ? e.steps.some((t) => En(t.mode)) : !1;
}
function di(e) {
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
function Br(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || Bo.includes(n.entityType)) && (!Yc(n.entityType) || Vo(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && Xc(
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
  if (t.some((n) => jr(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Xc(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (a) => ["date", "studio", "performers", "tags"].includes(a)
  )) && [n.annotationParents, n.binParents].every(
    (a) => a === void 0 || Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function ja(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const a of e)
    for (const i of a)
      n.has(i.id) || (n.add(i.id), t.push(i));
  return t;
}
function Zc(e, t) {
  const n = new Set(t.map((i) => i.name.trim().toLocaleLowerCase())), a = `${e.trim()} copy`;
  for (let i = 1; ; i++) {
    const o = i === 1 ? a : `${a} ${i}`;
    if (!n.has(o.toLocaleLowerCase())) return o;
  }
}
function el(e, t, n) {
  return { ...structuredClone(e), id: n, name: Zc(e.name, t) };
}
function Vo(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (a) => Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(a).size === a.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && si.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function Vi(e, t) {
  return e.size > 0 ? [...e].sort((n, a) => n - a) : t == null ? [] : [t];
}
function Ji(e, t, n, a) {
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
function tl(e, t) {
  const n = new Set(e), a = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    a ? n.delete(i) : n.add(i);
  return n;
}
function nl(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function rl(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function al(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function il(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function ol(e, t) {
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
const Jo = "ext:com.midnightrider.data-quality:configuration", sl = "ext:cove-data-quality:video-reviews", Ua = "ext:com.midnightrider.data-quality:progress";
class zo extends Error {
}
const Vr = /* @__PURE__ */ new Map(), Xr = /* @__PURE__ */ new Map(), Xn = (e, t) => e.includes("*") || e.includes(t), oa = (e) => ce(`/api/savedfilters?mode=${encodeURIComponent(e)}`), cl = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Ga(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function mr(e) {
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
    reviews: Br(JSON.stringify(t.reviews)),
    deletedIds: Ga(t.deletedIds),
    importedIds: Ga(t.importedIds)
  };
}
function ll(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const a = /* @__PURE__ */ new Set();
  for (const i of t) {
    const o = localStorage.getItem(i);
    if (o !== null) {
      const s = Br(o);
      n ?? (n = s), s.forEach((l) => a.add(l.id));
    }
    Ga(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((s) => a.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...a],
    present: n !== void 0
  };
}
async function Qo(e) {
  const t = await ce("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Wo(e, t) {
  const n = (Xr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Xr.set(e, n), n.finally(() => {
    Xr.get(e) === n && Xr.delete(e);
  }).catch(() => {
  }), n;
}
let Fr = null;
function dl() {
  if (Fr) return Fr;
  const e = ul();
  return Fr = e, e.finally(() => {
    Fr === e && (Fr = null);
  }).catch(() => {
  }), e;
}
async function ul() {
  var m;
  const e = await ce("/api/auth/me"), t = String(e.user.id), n = `cove-data-quality-v2:${t}`, a = Xn(e.permissions, "savedfilters.read"), i = a && Xn(e.permissions, "savedfilters.write"), o = a ? (await oa(Jo)).filter((y) => y.name === "Data Quality configuration").sort((y, w) => y.id - w.id) : [];
  if (o.length > 1) {
    const y = (w) => {
      const { revision: q, ...I } = mr(w.uiOptions);
      return JSON.stringify(I);
    };
    if (o.some((w) => y(w) !== y(o[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (i)
      for (const w of o.slice(1))
        await ce(`/api/savedfilters/${w.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${w.id}` })
        });
    o.splice(1);
  }
  let s = o.length ? mr(o[0].uiOptions) : cl();
  const l = localStorage.getItem(`${n}:migrated`) === "true", d = localStorage.getItem(n), h = localStorage.getItem(`${n}:local-only`) === "true";
  !o.length && d && (s = mr(d));
  let p = !o.length;
  if (o.length && h && d) {
    const y = mr(d);
    if (y.reviews.some((q) => {
      const I = s.reviews.find((E) => E.id === q.id);
      return I && JSON.stringify(I) !== JSON.stringify(q);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const w = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...y.deletedIds])
    ];
    s = {
      ...s,
      reviews: ja(s.reviews, y.reviews).filter(
        (q) => !w.includes(q.id)
      ),
      deletedIds: w,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...y.importedIds])
      ]
    }, p = !0;
  }
  if (!l) {
    const y = JSON.stringify(s), w = ll(t);
    if (o.length && w.reviews.some((j) => {
      const M = s.reviews.find((R) => R.id === j.id);
      return M && JSON.stringify(M) !== JSON.stringify(j);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const q = a ? (await oa(sl)).flatMap(
      (j) => Br(j.uiOptions ?? "[]")
    ) : [], I = w.known.filter(
      (j) => !w.reviews.some((M) => M.id === j)
    ), E = /* @__PURE__ */ new Set([...s.deletedIds, ...I]);
    s = {
      ...s,
      reviews: ja(
        w.reviews,
        s.reviews,
        q.filter(
          (j) => !w.known.includes(j.id) && !s.importedIds.includes(j.id)
        )
      ).filter((j) => !E.has(j.id)),
      deletedIds: [...E],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...w.known,
          ...q.map((j) => j.id)
        ])
      ]
    }, p || (p = JSON.stringify(s) !== y);
  }
  const b = {
    userId: t,
    recordId: (m = o[0]) == null ? void 0 : m.id,
    config: s,
    readable: a,
    writable: i,
    durable: i
  };
  if (Vr.set(n, b), p && i) {
    const y = s;
    o.length && (b.config = mr(o[0].uiOptions)), await Ho(n, y), s = b.config;
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
    canWrite: Xn(e.permissions, "videos.write"),
    canWriteVideos: Xn(e.permissions, "videos.write"),
    canWriteAudios: Xn(e.permissions, "audios.write"),
    canWriteTags: Xn(e.permissions, "tags.write"),
    canReadTagGroups: Xn(e.permissions, "taggroups.read"),
    canConfigure: !a || i,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: a ? i ? "account" : "readOnly" : "browser",
    storageNotice: a ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Ho(e, t) {
  const n = Vr.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const a = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await Qo(n), n.recordId != null) {
      const o = await ce(
        `/api/savedfilters/${n.recordId}`
      );
      if (mr(o.uiOptions).revision !== n.config.revision)
        throw new zo(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await ce(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Jo,
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
function fl(e, t) {
  return Br(JSON.stringify(t)), Wo(e, async () => {
    const n = Vr.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const a = n.config.reviews.filter((i) => !t.some((o) => o.id === i.id)).map((i) => i.id);
    await Ho(e, {
      ...n.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...a])
      ].filter((i) => !t.some((o) => o.id === i))
    });
  });
}
function zi(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, a]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(a)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function hl(e, t) {
  const n = Vr.get(e);
  if (!n) return null;
  const a = localStorage.getItem(`${e}:progress:${t}`), i = a ? zi(a) : null;
  if (!n.readable) return i;
  const o = (await oa(Ua)).find(
    (l) => l.name === t
  ), s = o ? zi(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function pl(e, t, n) {
  const a = `${e}:progress:${t}`;
  try {
    localStorage.setItem(a, JSON.stringify(n));
  } catch {
  }
  return Wo(a, async () => {
    const i = Vr.get(e);
    if (!(i != null && i.writable)) return;
    await Qo(i);
    const o = (await oa(Ua)).find(
      (s) => s.name === t
    );
    await ce(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Ua,
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
const ml = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function mn(e) {
  return ml[e];
}
const sa = "confirmed_absent_tags", ui = "Confirmed absent tags", pa = "confirmed_absent_occurrence_tags", Yo = {
  key: sa,
  label: ui,
  type: "tag",
  subject: "tag assessments"
}, fi = {
  key: pa,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, gl = {
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
      t === "modifier" && typeof n == "string" ? gl[n] ?? n : t === "key" && typeof n == "string" && [
        sa,
        pa
      ].includes(n.toLowerCase()) ? n.toLowerCase() : kn(n)
    ])
  ) : e;
}
async function Xo(e, t, n) {
  const a = new Headers(t.headers);
  !(t.body instanceof FormData) && !a.has("Content-Type") && a.set("Content-Type", "application/json");
  const i = await Qc(e, { ...t, headers: a });
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
  return await Xo(e, t, "fail");
}
function bl(e, t = {}) {
  return Xo(e, t, "null");
}
const wl = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let yl = 0;
function Ka(e, t) {
  return ce(
    `/api/${_n(e)}/${t}?dqRead=${wl}-${++yl}`,
    { cache: "no-store" }
  );
}
function Zo(e, t) {
  const n = { ...e.view.objectFilter }, a = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    kn({
      findFilter: Pt(t, ke(e)),
      objectFilter: n,
      filterExpression: a
    })
  );
}
async function Pr(e, t, n) {
  return ce(
    `/api/${_n(ke(e))}/find`,
    { method: "POST", signal: n, body: Zo(e, t) }
  );
}
async function vl(e, t, n) {
  return (await ce(
    `/api/${_n(ke(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Zo(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function Qi(e, t, n) {
  const a = { ...e.view.objectFilter };
  return delete a._filterExpression, ce("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      kn({
        findFilter: Pt(t),
        objectFilter: a
      })
    )
  });
}
function Nl(e) {
  return ce("/api/taggroups", { signal: e });
}
function Ba(e, t, n = 1280) {
  return `/api/${_n(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function Va(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Wi(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function ql(e) {
  return `/api/stream/video/${e}/preview`;
}
function Sl(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function El(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function ma(e, t) {
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
async function hi(e, t) {
  const n = ha(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await ma(i.tagIds, t)).filter(
          (o) => !n.has(o)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function Cl(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function pi(e, t) {
  const a = (await ce("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!a)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = Cl(e, a);
  return i ? { kind: "incompatible", message: i } : a.entityTypes.includes(t) ? { kind: "ready", definition: a, message: "" } : {
    kind: "missing",
    message: `Add ${mn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: a
  };
}
async function es(e, t) {
  const n = await pi(e, t);
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
function ts(e = "video") {
  return pi(Yo, e);
}
function Al(e = "video") {
  return es(Yo, e);
}
function ns(e = "video") {
  return pi(fi, e);
}
function kl(e = "video") {
  return es(fi, e);
}
function ca(e) {
  return [...new Set(e)];
}
function rs(e, t) {
  const n = e.customFields ?? {}, a = Object.keys(n).find(
    (o) => o.toLowerCase() === pa
  ), i = a === void 0 ? [] : n[a];
  return ca(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function Tl(e) {
  let t;
  try {
    t = await ns(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${fi.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Rl(e, t, n, a, i, o) {
  await ce(`/api/${_n(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: ca(i).map((s) => `${a}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function Il(e, t, n) {
  const a = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${ui} custom field is not available.`
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
async function as(e, t, n) {
  if (!An(t) || n.length === 0 || n.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${mn(e).many} and configure a valid action first.`
    );
  let a = null;
  if (Dn(t)) {
    let d;
    try {
      d = await ts(e);
    } catch (h) {
      throw new Error(
        `Could not verify the ${ui} custom field. ${h instanceof Error ? h.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    a = d.definition.key;
  }
  const i = ca(n), o = (await hi(t)).map((d) => ({
    mode: d.mode,
    tagIds: ca(d.tagIds)
  })), l = [
    ...o.filter((d) => !En(d.mode)),
    ...o.filter((d) => En(d.mode))
  ].map(
    (d) => Il(d, i, a)
  );
  for (let d = 0; d < l.length; d++)
    try {
      await ce(`/api/${_n(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(l[d])
      });
    } catch (h) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${mn(e).many} before retrying. ${h instanceof Error ? h.message : "Request failed."}`
      );
    }
}
async function Ol(e, t) {
  if (!An(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await ce("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const is = "-", $l = "Ctrl+a", Fl = "Ctrl/⌘A";
function Zr(e) {
  return (t) => {
    t != null && t.repeat || e();
  };
}
function mi({
  surface: e,
  enabled: t,
  actionCount: n,
  onAction: a,
  onFind: i,
  onSelectAll: o
}) {
  const s = k({ onAction: a, onFind: i, onSelectAll: o });
  pn(() => {
    s.current = { onAction: a, onFind: i, onSelectAll: o };
  });
  const l = Math.max(0, Math.min(n, vr.length)), d = !!i && n > 0, h = e === "local" && !!o, p = qe(() => {
    const b = [];
    return h && b.push({
      keys: $l,
      surface: "local",
      action: Zr(() => {
        var m, y;
        return (y = (m = s.current).onSelectAll) == null ? void 0 : y.call(m);
      })
    }), d && b.push({
      keys: is,
      surface: e,
      action: Zr(() => {
        var m, y;
        return (y = (m = s.current).onFind) == null ? void 0 : y.call(m);
      })
    }), vr.slice(0, l).forEach(
      (m, y) => b.push(
        {
          keys: m,
          surface: e,
          action: Zr(() => s.current.onAction(y, !1))
        },
        {
          keys: `Shift+${m}`,
          surface: e,
          action: Zr(() => s.current.onAction(y, !0))
        }
      )
    ), b;
  }, [e, l, d, h]);
  qc(p, t);
}
const Ml = {
  action: (e) => vr[e] ?? "",
  find: is,
  selectAll: Fl
};
function jn() {
  return Ml;
}
const xl = 600 * 1e3, gi = /* @__PURE__ */ new Map(), os = /* @__PURE__ */ new Map(), Pn = /* @__PURE__ */ new Map();
function ss(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = os.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function cs(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && os.set(e.tagGroupId, e.tagGroupSortOrder), gi.set(e.id, { tag: e, at: Date.now() });
}
function ls(e) {
  const t = gi.get(e);
  if (!(!t || Date.now() - t.at > xl))
    return ss(t.tag);
}
function ds(e) {
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
function Ja(e) {
  var t;
  for (const n of e) {
    const a = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && a && cs(ds({ ...n, name: a }));
  }
}
function Pl(e) {
  const t = Pn.get(e);
  if (t) return t;
  const n = new AbortController(), a = {
    controller: n,
    waiters: 0,
    promise: ce(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var p, b;
        const o = ((p = i == null ? void 0 : i.name) == null ? void 0 : p.trim()) || null;
        if (Pn.get(e) === a && Pn.delete(e), !o) return null;
        const s = ds({ ...i, id: e, name: o }), l = (b = gi.get(e)) == null ? void 0 : b.tag, d = (l == null ? void 0 : l.tagGroupId) === s.tagGroupId, h = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (d ? l == null ? void 0 : l.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (l == null ? void 0 : l.hasImage),
          imagePath: s.imagePath ?? (l == null ? void 0 : l.imagePath)
        };
        return cs(h), ss(h);
      },
      () => (Pn.get(e) === a && Pn.delete(e), null)
    )
  };
  return Pn.set(e, a), a;
}
function Hi() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function Ia(e) {
  const t = {};
  for (const n of e) {
    const a = ls(n);
    a !== void 0 && (t[n] = a);
  }
  return t;
}
function Ll(e, t) {
  if (t != null && t.aborted) return Promise.reject(Hi());
  const n = {}, a = [];
  for (const i of new Set(e)) {
    const o = ls(i);
    if (o !== void 0) n[i] = o;
    else {
      const s = Pl(i);
      s.waiters += 1, a.push({ id: i, entry: s });
    }
  }
  return a.length ? new Promise((i, o) => {
    let s = !1;
    const l = () => {
      for (const { id: h, entry: p } of a)
        p.waiters -= 1, p.waiters === 0 && Pn.get(h) === p && (Pn.delete(h), p.controller.abort());
    }, d = () => {
      s || (s = !0, l(), o(Hi()));
    };
    t == null || t.addEventListener("abort", d, { once: !0 }), Promise.all(
      a.map(
        ({ id: h, entry: p }) => p.promise.then((b) => [h, b])
      )
    ).then((h) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", d), l();
        for (const [p, b] of h) n[p] = b;
        i(n);
      }
    });
  }) : Promise.resolve(n);
}
function us(e) {
  const t = {};
  for (const [n, a] of Object.entries(e)) t[Number(n)] = (a == null ? void 0 : a.name) ?? null;
  return t;
}
function bi(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, a] = S(() => ({
    key: t,
    tags: Ia(Oa(t))
  }));
  return z(() => {
    const i = Oa(t), o = Ia(i);
    if (a({ key: t, tags: o }), i.every((l) => l in o)) return;
    const s = new AbortController();
    return Ll(i, s.signal).then(
      (l) => a({ key: t, tags: l }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : Ia(Oa(t));
}
function qr(e) {
  const t = bi(e);
  return qe(() => us(t), [t]);
}
function Oa(e) {
  return e ? e.split(",").map(Number) : [];
}
function Dl(e, t, n = !1) {
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
function ir(e, t, n = [], a) {
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
  const i = ha(e), o = (s) => i.has(s) || [...i].some((l) => {
    var d;
    return (d = a == null ? void 0 : a.get(s)) == null ? void 0 : d.includes(l);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (l) => Dl(
        s.mode,
        t[l] === void 0 ? "…" : t[l] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && o(l)
      )
    )
  );
}
function ga(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function wi({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  canStay: i = !0,
  onApply: o,
  onClose: s
}) {
  const [l, d] = S(""), [h, p] = S(0), b = k(null), m = k(null), y = k(null), w = k(null), q = k(null), I = k(/* @__PURE__ */ new Set()), E = Ct(), j = qr(qe(() => ga(e), [e])), M = jn(), R = qe(() => {
    const U = l.trim().toLocaleLowerCase();
    return e.map((_, ie) => ({ action: _, index: ie, key: M.action(ie) })).filter((_) => !U || _.action.label.toLocaleLowerCase().includes(U));
  }, [e, M, l]), L = R.length ? Math.min(h, R.length - 1) : -1, W = (U) => `${E}-option-${U}`;
  pn(() => {
    var U, _, ie;
    return w.current = document.activeElement, q.current = ((_ = (U = y.current) == null ? void 0 : U.parentElement) == null ? void 0 : _.closest('[role="dialog"]')) ?? null, (ie = b.current) == null || ie.focus({ preventScroll: !0 }), () => {
      var $;
      const C = w.current;
      C instanceof HTMLElement && C.isConnected && C.focus({ preventScroll: !0 }), document.activeElement !== C && (($ = q.current) != null && $.isConnected) && q.current.focus({ preventScroll: !0 });
    };
  }, []), z(() => {
    var U, _, ie;
    L < 0 || (ie = (_ = (U = m.current) == null ? void 0 : U.querySelector(`[id="${W(R[L].index)}"]`)) == null ? void 0 : _.scrollIntoView) == null || ie.call(_, { block: "nearest" });
  }, [L, R]);
  function te(U, _) {
    !U || a != null && a(U.action) || o(U.action, i && _);
  }
  function ne(U) {
    var ie;
    U.stopPropagation();
    const _ = U.code || U.key;
    if (U.repeat && !I.current.has(_)) {
      U.preventDefault();
      return;
    }
    if (U.repeat || I.current.add(_), U.key === "Escape")
      U.preventDefault(), s();
    else if (U.key === "Enter")
      U.preventDefault(), U.repeat || te(R[L], U.shiftKey);
    else if (U.key === "ArrowDown" || U.key === "ArrowUp") {
      if (U.preventDefault(), !R.length) return;
      const C = U.key === "ArrowDown" ? 1 : -1;
      p((L + C + R.length) % R.length);
    } else U.key === "Tab" && (U.preventDefault(), (ie = b.current) == null || ie.focus());
  }
  return /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ r("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: s }),
    /* @__PURE__ */ c(
      "div",
      {
        ref: y,
        role: "dialog",
        "aria-label": "Find an action",
        className: "dq-find-action",
        onKeyDown: ne,
        onMouseDown: (U) => {
          U.target !== b.current && U.preventDefault();
        },
        children: [
          /* @__PURE__ */ c("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ r(ua, { "aria-hidden": "true" }),
            /* @__PURE__ */ r(
              "input",
              {
                ref: b,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${E}-list`,
                "aria-activedescendant": L >= 0 ? W(R[L].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: l,
                onChange: (U) => {
                  d(U.target.value), p(0);
                }
              }
            ),
            /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          R.length ? /* @__PURE__ */ r(
            "ul",
            {
              ref: m,
              id: `${E}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: R.map((U, _) => /* @__PURE__ */ r("li", { role: "none", children: /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: W(U.index),
                  tabIndex: -1,
                  "aria-selected": _ === L,
                  disabled: (a == null ? void 0 : a(U.action)) ?? !1,
                  onClick: (ie) => te(U, ie.shiftKey),
                  children: [
                    U.key ? /* @__PURE__ */ r("kbd", { children: U.key }) : /* @__PURE__ */ r("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ r("span", { className: "dq-find-label", children: U.action.label }),
                    /* @__PURE__ */ r("span", { className: "dq-find-effect", children: ir(U.action, j, t, n).map(
                      (ie, C) => /* @__PURE__ */ r("span", { "data-effect-tone": ie.tone, children: ie.text }, C)
                    ) })
                  ]
                }
              ) }, U.action.id))
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
const ea = (e) => e >= "0" && e <= "9";
function Yi(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function Xi(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, a = 0;
  for (; n < e.length && a < t.length; ) {
    if (ea(e[n]) && ea(t[a])) {
      const l = n, d = a;
      for (; n < e.length && ea(e[n]); ) n++;
      for (; a < t.length && ea(t[a]); ) a++;
      const h = e.slice(l, n).replace(/^0+/, ""), p = t.slice(d, a).replace(/^0+/, "");
      if (h.length !== p.length) return h.length < p.length ? -1 : 1;
      if (h !== p) return h < p ? -1 : 1;
      continue;
    }
    const o = Yi(e[n]), s = Yi(t[a]);
    if (o !== s) return o < s ? -1 : 1;
    n++, a++;
  }
  const i = e.length - n - (t.length - a);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function fs(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, a = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(a(e) - a(t)) || Xi(e.tagGroupName, t.tagGroupName) || Xi(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function tr(e) {
  return [...e].sort(fs);
}
function _l(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const a of n.steps)
        a.mode === "REMOVE_TREE" && a.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function hs(e, t, n) {
  const a = ha(e), i = [], o = [];
  for (const m of e.steps) {
    if (m.mode !== "REMOVE_TREE") {
      o.push(m);
      continue;
    }
    const y = m.tagIds.flatMap((w) => {
      const q = n.get(w);
      return q || i.push(w), q ?? [w];
    });
    o.push({ mode: "REMOVE", tagIds: y.filter((w) => !a.has(w)) });
  }
  const s = [
    ...o.filter((m) => !En(m.mode)),
    ...o.filter((m) => En(m.mode))
  ], l = new Set(t.ids), d = new Set(t.absent);
  for (const m of s)
    for (const y of m.tagIds)
      switch (m.mode) {
        case "ADD":
          l.add(y);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          l.delete(y);
          break;
        case "MARK_PRESENT":
          l.add(y), d.delete(y);
          break;
        case "MARK_ABSENT":
          l.delete(y), d.add(y);
          break;
        case "CLEAR_ABSENCE":
          d.delete(y);
          break;
      }
  const h = new Set(t.ids), p = new Set(t.absent), b = [...new Set(e.steps.flatMap((m) => m.tagIds))];
  return {
    added: b.filter((m) => l.has(m) && !h.has(m)),
    removed: [...h].filter((m) => !l.has(m)),
    markedAbsent: b.filter((m) => d.has(m) && !p.has(m)),
    absenceCleared: [...p].filter((m) => !d.has(m)),
    unresolvedTrees: [...new Set(i)]
  };
}
function jl(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const a of e.applications)
      n.has(a.tag.id) || n.set(a.tag.id, a.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, a) => ({ id: n, name: e.names[a] ?? "" }));
  return tr(t);
}
function ps(e) {
  const t = _l(e).sort((s, l) => s - l).join(","), [n, a] = S(() => /* @__PURE__ */ new Map()), i = k(/* @__PURE__ */ new Set()), o = k(!0);
  return z(() => (o.current = !0, () => {
    o.current = !1;
  }), []), z(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const l of s)
      i.current.has(l) || (i.current.add(l), ma([l]).then(
        (d) => {
          o.current && a((h) => new Map(h).set(l, d));
        },
        () => {
          i.current.delete(l);
        }
      ));
  }, [t]), n;
}
function ms() {
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
function yi(e) {
  return Ao(e.subscribe, e.get, e.get);
}
const Zi = [
  { indent: 0, slots: $a(0, 11), fixed: [] },
  { indent: 1, slots: $a(11, 22), fixed: [] },
  { indent: 2, slots: $a(22, 27), fixed: ["n", "m", ",", "."] }
];
function $a(e, t) {
  return Array.from({ length: t - e }, (n, a) => e + a);
}
function eo(e, t) {
  return e === "g" ? "Go to…" : e === "f" ? t === "video" ? "Fullscreen · filters" : "Filters" : t === "video" && e === "k" ? "Play / pause" : t === "video" && e === "m" ? "Mute" : "";
}
function mt({ binding: e, hidden: t }) {
  return /* @__PURE__ */ r(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || void 0,
      children: e
    }
  );
}
function to(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function Ul({
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
  const b = jn(), m = Ct(), y = qr(
    qe(() => e.flatMap((M) => M.steps.flatMap((R) => R.tagIds)), [e])
  ), w = Zi.filter((M) => M.slots.some((R) => R < e.length)), q = w.length === Zi.length, I = Math.max(0, e.length - vr.length), E = (M) => ({
    onMouseEnter: () => s.set(M),
    onMouseLeave: () => s.clear(M),
    onFocus: () => s.set(M),
    onBlur: (R) => {
      R.currentTarget.contains(R.relatedTarget) || s.clear(M);
    }
  }), j = (M) => {
    const R = e[M], L = b.action(M);
    if (!R) {
      const ne = eo(L, t);
      return /* @__PURE__ */ c(
        "div",
        {
          className: `dq-pad-slot dq-pad-free${ne ? " dq-pad-reserved" : ""}`,
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ r(mt, { binding: L }),
            ne && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: ne })
          ]
        },
        M
      );
    }
    const W = n(R), te = `${m}-effect-${M}`;
    return /* @__PURE__ */ c("div", { className: "dq-pad-slot", ...p ? {} : E(R), children: [
      /* @__PURE__ */ r("span", { id: te, className: "dq-sr-only", children: ir(R, y, [], o).map((ne) => ne.text).join(", ") }),
      /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: R.label,
          "aria-keyshortcuts": L,
          "aria-describedby": te,
          disabled: W,
          onClick: (ne) => l(R, ne.shiftKey),
          children: [
            /* @__PURE__ */ r(mt, { binding: L }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-pad-label", children: R.label }),
            to(R) && " ",
            to(R) && /* @__PURE__ */ c("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(_a, { "aria-hidden": "true" }),
              "absent"
            ] })
          ]
        }
      ),
      R.steps.length > 0 && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-pad-pin",
          "aria-label": `Apply and stay: ${R.label}`,
          title: "Apply and stay (Shift)",
          disabled: W,
          onClick: () => l(R, !0),
          children: /* @__PURE__ */ r(xc, { "aria-hidden": "true" })
        }
      )
    ] }, M);
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
            /* @__PURE__ */ r(yr, { "aria-hidden": "true" }),
            "Actions are paused while you edit the review"
          ] }) : /* @__PURE__ */ c(pe, { children: [
            /* @__PURE__ */ r(
              Gl,
              {
                actions: e,
                names: y,
                tags: i,
                trees: o,
                preview: s,
                extra: I,
                findKey: b.find
              }
            ),
            /* @__PURE__ */ c("span", { className: "dq-pad-hint", children: [
              /* @__PURE__ */ r("kbd", { className: "dq-key", children: "Shift" }),
              /* @__PURE__ */ r("span", { children: "+ key applies and stays" })
            ] })
          ] }),
          !q && /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "dq-pad-find-button",
              "aria-label": "Find action",
              "aria-keyshortcuts": b.find,
              disabled: h,
              onClick: d,
              children: [
                /* @__PURE__ */ r(mt, { binding: b.find }),
                /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "Find action" })
              ]
            }
          )
        ] }),
        w.map((M) => /* @__PURE__ */ c("div", { className: "dq-pad-row", "data-indent": M.indent, children: [
          M.slots.map(j),
          M.fixed.map((R) => {
            const L = eo(R, t);
            return /* @__PURE__ */ c(
              "div",
              {
                className: `dq-pad-slot dq-pad-free dq-pad-fixed${L ? " dq-pad-reserved" : ""}`,
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ r(mt, { binding: R }),
                  L && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: L })
                ]
              },
              R
            );
          }),
          M.fixed.length > 0 && /* @__PURE__ */ r("div", { className: "dq-pad-slot", children: /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": I ? `Find action, ${I} more` : "Find action",
              "aria-keyshortcuts": b.find,
              disabled: h,
              onClick: d,
              children: [
                /* @__PURE__ */ r(mt, { binding: b.find }),
                /* @__PURE__ */ c("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ r(ua, { "aria-hidden": "true" }),
                  I ? `${I} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, M.indent))
      ]
    }
  );
}
function Gl({
  actions: e,
  names: t,
  tags: n,
  trees: a,
  preview: i,
  extra: o,
  findKey: s
}) {
  const l = jn(), d = yi(i), h = d ? e.indexOf(d) : -1;
  if (!d || h < 0)
    return /* @__PURE__ */ c("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      o > 0 && /* @__PURE__ */ c(pe, { children: [
        ` · ${vr.length} on keys, ${o} more under `,
        /* @__PURE__ */ r(mt, { binding: s })
      ] })
    ] });
  const p = l.action(h), b = n && d.steps.length ? hs(d, n, a) : null, m = b && !b.unresolvedTrees.length && ![b.added, b.removed, b.markedAbsent, b.absenceCleared].some(
    (y) => y.length
  );
  return /* @__PURE__ */ c("p", { className: "dq-pad-effect", children: [
    p && /* @__PURE__ */ r(mt, { binding: p }),
    /* @__PURE__ */ r("strong", { children: d.label }),
    ir(d, t, [], a).map((y, w) => /* @__PURE__ */ r("span", { "data-effect-tone": y.tone, children: y.text }, w)),
    m && /* @__PURE__ */ r("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function gs({
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
  className: b = "",
  paused: m = !1
}) {
  const y = jn(), w = Ct(), q = qr(qe(() => ga(e), [e])), [I] = S(() => ms()), E = k(null), j = Kl(E, e), M = e.slice(0, vr.length), R = e.length - M.length, L = (te) => ir(te, q, t, n).map((ne) => ne.text).join(", "), W = (te) => ({
    onMouseEnter: () => I.set(te),
    onMouseLeave: () => I.clear(te),
    onFocus: () => I.set(te),
    onBlur: (ne) => {
      ne.currentTarget.contains(ne.relatedTarget) || I.clear(te);
    }
  });
  return /* @__PURE__ */ c(
    "section",
    {
      ref: E,
      className: `dq-action-bar${j ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${m ? " dq-bar-paused" : ""}${b ? ` ${b}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ r("div", { className: "dq-bar-summary", children: l }),
        /* @__PURE__ */ r("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ c("div", { className: "dq-bar-tiles", "aria-busy": i || void 0, children: [
          M.map((te, ne) => {
            const U = y.action(ne);
            return /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-bar-tile",
                title: te.label,
                "aria-keyshortcuts": U || void 0,
                "aria-describedby": `${w}-effect-${ne}`,
                disabled: m || a(te),
                onClick: () => o(te),
                ...m ? {} : W(te),
                children: [
                  U && /* @__PURE__ */ r(mt, { binding: U }),
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
              "aria-label": R > 0 ? `Find action, ${R} more` : "Find action",
              "aria-keyshortcuts": y.find,
              disabled: m,
              onClick: s,
              children: [
                /* @__PURE__ */ r(mt, { binding: y.find, hidden: !0 }),
                /* @__PURE__ */ r(ua, { "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-bar-label", children: R > 0 ? `${R} more` : "Find action" })
              ]
            }
          ) : /* @__PURE__ */ r("p", { className: "dq-bar-empty", children: "This review has no actions." })
        ] }),
        d && /* @__PURE__ */ r("p", { className: "dq-bar-hints", children: d }),
        m ? /* @__PURE__ */ c("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ r(yr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ r(Bl, { actions: M, preview: I, names: q, tagGroups: t, trees: n }),
        h && /* @__PURE__ */ r("div", { className: "dq-bar-notices", children: h }),
        /* @__PURE__ */ r("div", { hidden: !0, children: M.map((te, ne) => /* @__PURE__ */ r("span", { id: `${w}-effect-${ne}`, children: L(te) }, te.id)) }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: p })
      ]
    }
  );
}
function Kl(e, t) {
  const [n, a] = S(!1);
  return pn(() => {
    var h;
    const i = e.current;
    if (!i || typeof ResizeObserver > "u") return;
    const o = i.querySelector(".dq-bar-summary"), s = () => {
      const p = getComputedStyle(i), b = parseFloat(p.columnGap) || 0, m = i.clientWidth - (parseFloat(p.paddingLeft) || 0) - (parseFloat(p.paddingRight) || 0), y = [...i.querySelectorAll(".dq-bar-tiles > *")].map(
        (j) => j.offsetWidth
      ), w = parseFloat(getComputedStyle(i.querySelector(".dq-bar-tiles")).columnGap) || 0, q = i.querySelector(".dq-bar-hints"), I = ((o == null ? void 0 : o.offsetWidth) ?? 0) + (q ? q.offsetWidth + b : 0) + 1 + // the divider
      2 * b, E = (j) => {
        let M = 1, R = 0;
        for (const L of y)
          R > 0 && R + w + L > j ? (M += 1, R = L) : R += (R > 0 ? w : 0) + L;
        return M;
      };
      a(1 + E(m) < E(m - I));
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
function Bl({
  actions: e,
  preview: t,
  names: n,
  tagGroups: a,
  trees: i
}) {
  const o = jn(), s = yi(t), l = s ? e.indexOf(s) : -1;
  if (!s || l < 0) return null;
  const d = o.action(l);
  return /* @__PURE__ */ c("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    d && /* @__PURE__ */ r(mt, { binding: d }),
    /* @__PURE__ */ r("strong", { children: s.label }),
    ir(s, n, a, i).map((h, p) => /* @__PURE__ */ r("span", { "data-effect-tone": h.tone, children: h.text }, p))
  ] });
}
const no = 1e3;
async function Vl(e, t, n) {
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
              perPage: no,
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
    if (d * no >= h.totalCount) break;
    if (!h.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], s = ke(e), l = Ne(e) ? await zl(
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
function Jl(e) {
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
async function zl(e, t, n) {
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
                body: Jl(t[l])
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
function Ql(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((a) => t.has(a.id) ? !1 : (t.add(a.id), !0))
  }));
}
function Wl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of n.children)
      t.set(a.id, [...t.get(a.id) ?? [], n.parent.id]);
  return t;
}
function Hl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of ha(n))
      t.set(a, [...t.get(a) ?? [], n]);
  return t;
}
function Yl(e, t) {
  return {
    id: crypto.randomUUID(),
    label: e.name,
    steps: [
      { mode: "ADD", tagIds: [e.id] },
      ...t.length ? [{ mode: "REMOVE_TREE", tagIds: t }] : []
    ]
  };
}
const Xl = (e) => e instanceof Error ? e.message : "Request failed.";
function Zl({
  id: e,
  review: t,
  disabled: n,
  onAdd: a,
  onCancel: i
}) {
  const [o, s] = S([]), [l, d] = S({}), [h, p] = S({}), [b, m] = S({}), y = k(/* @__PURE__ */ new Map());
  z(
    () => () => {
      for (const $ of y.current.values()) $.abort();
    },
    []
  );
  const w = mn(ke(t)), q = Ne(t), I = q ? "performer" : w.one;
  function E($) {
    var ae;
    (ae = y.current.get($)) == null || ae.abort();
    const K = new AbortController();
    y.current.set($, K), d((Y) => ({ ...Y, [$]: { status: "loading" } })), Vl(t, $, K.signal).then(
      (Y) => {
        K.signal.aborted || d((de) => ({
          ...de,
          [$]: { status: "ready", group: Y }
        }));
      },
      (Y) => {
        K.signal.aborted || d((de) => ({
          ...de,
          [$]: { status: "failed", message: Xl(Y) }
        }));
      }
    );
  }
  function j($) {
    var O;
    const K = o.filter((J) => !$.includes(J));
    for (const J of K)
      (O = y.current.get(J)) == null || O.abort(), y.current.delete(J);
    const ae = (J) => {
      const B = l[J];
      return (B == null ? void 0 : B.status) === "ready" ? B.group.children.map((D) => D.id) : [];
    }, Y = new Set($.flatMap(ae)), de = K.flatMap(ae).filter((J) => !Y.has(J));
    p(
      (J) => Object.fromEntries(
        Object.entries(J).filter(([B]) => !de.includes(Number(B)))
      )
    ), m(
      (J) => Object.fromEntries(
        Object.entries(J).filter(([B]) => $.includes(Number(B)))
      )
    ), d(
      (J) => Object.fromEntries(
        Object.entries(J).filter(([B]) => $.includes(Number(B)))
      )
    ), s($);
    for (const J of $) o.includes(J) || E(J);
  }
  const M = o.flatMap(($) => {
    const K = l[$];
    return (K == null ? void 0 : K.status) === "ready" ? [K.group] : [];
  }), R = M.length === o.length, L = o.some(
    ($) => {
      var K;
      return (((K = l[$]) == null ? void 0 : K.status) ?? "loading") === "loading";
    }
  ), W = new Map(
    Ql(M).map(($) => [$.parent.id, $])
  ), te = Wl(M), ne = new Map(M.map(($) => [$.parent.id, $.parent.name])), U = Hl(t.actions), _ = ($) => h[$] ?? !U.has($), ie = R ? [...W.values()].flatMap(
    ($) => $.children.filter((K) => _(K.id))
  ) : [], C = ($, K) => p((ae) => ({
    ...ae,
    ...Object.fromEntries($.children.map((Y) => [Y.id, K]))
  }));
  return /* @__PURE__ */ c("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ r("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ c("p", { className: "dq-drawer-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      q ? "on performers " : "",
      "first. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ r(
      Cn,
      {
        entityType: "tag",
        values: o,
        onChange: j,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    o.map(($) => {
      const K = l[$];
      if (!K || K.status === "loading")
        return /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Loading child tags…" }, $);
      if (K.status === "failed")
        return /* @__PURE__ */ c("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ c("span", { children: [
            "Child tags could not be loaded. ",
            K.message
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: n,
              onClick: () => E($),
              children: "Retry"
            }
          )
        ] }, $);
      const ae = W.get($);
      if (!ae) return null;
      const Y = ae.parent.name;
      return /* @__PURE__ */ c("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ r("legend", { children: Y }),
        K.group.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ c(pe, { children: [
          /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: b[$] ?? !1,
                disabled: n,
                onChange: (de) => m((O) => ({
                  ...O,
                  [$]: de.target.checked
                }))
              }
            ),
            "Only one per ",
            I,
            ": each action removes every other tag in the ",
            Y,
            " tree"
          ] }),
          ae.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ c(pe, { children: [
            /* @__PURE__ */ c("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${Y}`,
                  onClick: () => C(ae, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${Y}`,
                  onClick: () => C(ae, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "dq-child-tags", children: ae.children.map((de) => {
              const O = U.get(de.id) ?? [], J = (te.get(de.id) ?? []).filter((B) => B !== $).map((B) => `“${ne.get(B)}”`);
              return /* @__PURE__ */ c("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: _(de.id),
                    disabled: n,
                    onChange: (B) => p((D) => ({
                      ...D,
                      [de.id]: B.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ c("span", { children: [
                  de.name,
                  " ",
                  /* @__PURE__ */ c("small", { children: [
                    de.uses.toLocaleString(),
                    " ",
                    de.uses === 1 ? w.one : w.many
                  ] }),
                  J.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " · Also under ",
                    J.join(", ")
                  ] }),
                  O.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " ",
                    "· Already in “",
                    O[0].label || "New action",
                    "”",
                    O.length > 1 ? ` and ${O.length - 1} more` : ""
                  ] })
                ] })
              ] }, de.id);
            }) })
          ] })
        ] })
      ] }, $);
    }),
    /* @__PURE__ */ c("div", { className: "dq-row", children: [
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: n || !ie.length,
          onClick: () => a(
            ie.map(
              ($) => Yl(
                $,
                (te.get($.id) ?? []).filter(
                  (K) => b[K]
                )
              )
            )
          ),
          children: ie.length ? `Add ${ie.length} action${ie.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-sr-only", children: L ? "Loading child tags…" : "" })
    ] })
  ] });
}
const ed = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function td(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function nd(e, t) {
  if (An(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (di(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function bs(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function rd(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function ad({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: a,
  saving: i,
  expandedId: o,
  onExpand: s,
  reveal: l
}) {
  const d = $e(e), h = d !== "tag", p = e.actions, b = jn(), m = qr(qe(() => ga(p), [p])), [y, w] = S(""), [q, I] = S(!1), [E, j] = S(
    null
  ), M = Ct(), R = `${M}-from-tags`, L = k(null), W = k(null), te = k(null), ne = k(null), U = k(/* @__PURE__ */ new WeakMap()), _ = (D) => {
    let ee = U.current.get(D);
    return ee || (ee = crypto.randomUUID(), U.current.set(D, ee)), ee;
  }, ie = y.trim().toLocaleLowerCase(), C = ie ? p.filter((D) => D.label.toLocaleLowerCase().includes(ie)) : p, $ = (D) => t({ ...e, actions: D }), K = (D, ee) => $(p.map((be, Te) => Te === D ? ee : be));
  function ae(D) {
    var ee;
    return [...((ee = te.current) == null ? void 0 : ee.querySelectorAll("[data-action-id]")) ?? []].find(
      (be) => be.dataset.actionId === D
    );
  }
  function Y(D, ee) {
    const be = ae(D), Te = be == null ? void 0 : be.querySelector(
      ee === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return Te == null || Te.focus(), !!Te;
  }
  pn(() => {
    var ee;
    const D = ne.current;
    D && (ne.current = null, (D === "add" || !Y(D.id, D.part)) && ((ee = W.current) == null || ee.focus()));
  }), z(() => {
    !l || !o || (C.some((D) => D.id === o) ? Y(o, "label") : (w(""), ne.current = { id: o, part: "label" }));
  }, [l]);
  function de() {
    const D = rd(d);
    w(""), $([...p, D]), s(D.id), ne.current = { id: D.id, part: "label" };
  }
  function O(D) {
    const ee = p[D], be = {
      ...structuredClone(ee),
      id: crypto.randomUUID(),
      label: `${ee.label} copy`
    };
    $([...p.slice(0, D + 1), be, ...p.slice(D + 1)]), s(be.id), ne.current = { id: be.id, part: "label" };
  }
  function J(D) {
    const ee = p[D], be = C.indexOf(ee), Te = C[be + 1] ?? C[be - 1];
    $(p.filter((Lt, it) => it !== D)), o === ee.id && s(null), ne.current = Te ? { id: Te.id, part: "toggle" } : "add";
  }
  function B() {
    I(!1), requestAnimationFrame(() => {
      var D;
      return (D = L.current) == null ? void 0 : D.focus();
    });
  }
  return /* @__PURE__ */ c("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ c("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ c("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ c(
          "button",
          {
            ref: W,
            type: "button",
            className: "dq-header-button",
            onClick: de,
            children: [
              /* @__PURE__ */ r(ri, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        h && /* @__PURE__ */ r(
          "button",
          {
            ref: L,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": q,
            "aria-controls": q ? R : void 0,
            onClick: () => {
              j(null), I(!q);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ c("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ r(ua, { "aria-hidden": "true" }),
          /* @__PURE__ */ r(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: y,
              onChange: (D) => w(D.target.value),
              onKeyDown: (D) => {
                D.key === "Escape" && y && (D.preventDefault(), D.stopPropagation(), w(""));
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-actions-hint", children: "Letters follow this order. Drag a handle, or press Alt + ↑ / ↓, to reorder." }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-actions-status", children: (E == null ? void 0 : E.actions) === p ? `Added ${E.count} action${E.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    h && q && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here.
    /* @__PURE__ */ r(
      "div",
      {
        onKeyDown: (D) => {
          D.key !== "Escape" || D.defaultPrevented || (D.preventDefault(), D.stopPropagation(), B());
        },
        children: /* @__PURE__ */ r(
          Zl,
          {
            id: R,
            review: e,
            disabled: i,
            onAdd: (D) => {
              const ee = [...p, ...D];
              $(ee), j({ actions: ee, count: D.length }), B();
            },
            onCancel: B
          }
        )
      }
    ),
    /* @__PURE__ */ r("div", { ref: te, children: C.length > 0 && /* @__PURE__ */ r(
      ko,
      {
        items: C,
        getKey: (D) => D.id,
        disabled: i || !!ie,
        className: "dq-action-list",
        onReorder: (D) => $(D),
        renderItem: (D, { dragHandleProps: ee, isOver: be }) => {
          const Te = p.indexOf(D), Lt = o === D.id;
          return /* @__PURE__ */ r(
            id,
            {
              action: D,
              entityType: d,
              binding: b.action(Te),
              effect: ir(D, m, n, a),
              open: Lt,
              detailId: `${M}-detail-${D.id}`,
              dragHandleProps: ee,
              isOver: be,
              reorderDisabled: i || !!ie,
              onToggle: () => s(Lt ? null : D.id),
              onDuplicate: () => O(Te),
              onDelete: () => J(Te),
              children: "steps" in D ? /* @__PURE__ */ r(
                od,
                {
                  action: D,
                  saving: i,
                  stepKey: _,
                  rememberStepKey: (it, ut) => U.current.set(it, _(ut)),
                  onChange: (it) => K(Te, it)
                }
              ) : /* @__PURE__ */ r(
                cd,
                {
                  action: D,
                  tagGroups: n,
                  onChange: (it) => K(Te, it)
                }
              )
            }
          );
        }
      }
    ) }),
    p.length ? !C.length && /* @__PURE__ */ c("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      y.trim(),
      "”."
    ] }) : /* @__PURE__ */ r("p", { className: "dq-actions-empty", children: h ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function id({
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
  onDelete: b,
  children: m
}) {
  const y = e.label.trim() || "New action", w = nd(e, t);
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
              style: bs(s.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${y}`,
              title: d ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: d,
              children: /* @__PURE__ */ r($o, { "aria-hidden": "true" })
            }
          ),
          n ? /* @__PURE__ */ r(mt, { binding: n }) : /* @__PURE__ */ r("span", { className: "dq-key dq-key-none", title: "Reached with Find action", children: "·" }),
          /* @__PURE__ */ c("div", { className: "dq-action-row-summary", onClick: h, children: [
            /* @__PURE__ */ r("span", { className: "dq-action-row-label", title: y, children: y }),
            !i && /* @__PURE__ */ r("span", { className: "dq-action-row-effect", children: a.map((q, I) => /* @__PURE__ */ r("span", { "data-effect-tone": q.tone, children: q.text }, I)) }),
            w && /* @__PURE__ */ c("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ r(Zn, { "aria-hidden": "true" }),
              w
            ] })
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Duplicate ${y}`,
              title: "Duplicate",
              onClick: p,
              children: /* @__PURE__ */ r(Fo, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Delete ${y}`,
              title: "Delete",
              onClick: b,
              children: /* @__PURE__ */ r(Mo, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small dq-action-toggle",
              "aria-label": `${i ? "Collapse" : "Expand"} ${y}`,
              "aria-expanded": i,
              "aria-controls": i ? o : void 0,
              onClick: h,
              children: /* @__PURE__ */ r(xo, { "aria-hidden": "true" })
            }
          )
        ] }),
        i && /* @__PURE__ */ r("div", { id: o, className: "dq-action-detail", children: m })
      ]
    }
  );
}
function ws({
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
function od({
  action: e,
  saving: t,
  stepKey: n,
  rememberStepKey: a,
  onChange: i
}) {
  const o = Ct(), s = k(null), l = k(null);
  pn(() => {
    var p, b;
    const h = l.current;
    h != null && (l.current = null, (b = (p = s.current) == null ? void 0 : p.querySelector(`[data-step-index="${h}"] input`)) == null || b.focus());
  });
  const d = (h) => i({ ...e, steps: h });
  return /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ r(ws, { action: e, onChange: (h) => i({ ...e, label: h }) }),
    /* @__PURE__ */ c("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": o, children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", id: o, children: "Steps" }),
      /* @__PURE__ */ c("div", { className: "dq-steps", ref: s, children: [
        e.steps.length > 0 ? /* @__PURE__ */ r(
          ko,
          {
            items: e.steps,
            getKey: n,
            disabled: t,
            className: "dq-step-list",
            onReorder: d,
            renderItem: (h, { index: p, dragHandleProps: b, isOver: m }) => /* @__PURE__ */ r(
              sd,
              {
                step: h,
                index: p,
                dragHandleProps: b,
                isOver: m,
                saving: t,
                onChange: (y) => {
                  a(y, h), d(e.steps.map((w, q) => q === p ? y : w));
                },
                onRemove: () => d(e.steps.filter((y, w) => w !== p))
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
              /* @__PURE__ */ r(ri, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function sd({
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
      "data-step-tone": td(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            ...n,
            style: bs(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${l}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ r($o, { "aria-hidden": "true" }),
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
            children: ed.map(({ mode: d, label: h }) => /* @__PURE__ */ r("option", { value: d, children: h }, d))
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
            children: /* @__PURE__ */ r(Gr, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function cd({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const a = e.effect, i = a.mode === "SET_TAG_GROUP" ? `group:${a.tagGroupId}` : a.mode, o = a.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === a.tagGroupId);
  return /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ r(ws, { action: e, onChange: (s) => n({ ...e, label: s }) }),
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
function ld({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, a = mn(ke(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
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
function dd({
  review: e,
  onChange: t
}) {
  const n = mn(ke(e)).many;
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
const ys = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, vs = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, ud = {
  video: fa,
  audio: Do,
  tag: Lo,
  performerOccurrence: Po,
  audioPerformerOccurrence: Pc
};
function Ns({ entityType: e }) {
  const t = ud[e];
  return /* @__PURE__ */ r(t, { role: "img", "aria-label": ys[e] });
}
const fd = 2e6;
function qs(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), a = document.createElement("a");
  a.href = n, a.download = t, a.click(), URL.revokeObjectURL(n);
}
function hd(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function vi(e) {
  qs([e], hd(e));
}
async function pd(e) {
  if (e.size > fd) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return Br(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function wr(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (a, i) => i && typeof i == "object" && !Array.isArray(i) ? Object.fromEntries(
      Object.keys(i).sort().map((o) => [o, i[o]])
    ) : i
  );
}
function Ss({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: a,
  nameRef: i,
  autoFocus: o = !1
}) {
  return /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ c("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ r("span", { children: "Entity type" }),
      /* @__PURE__ */ r(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: $e(e),
          disabled: n,
          onChange: (s) => a == null ? void 0 : a(s.target.value),
          children: Bo.map((s) => /* @__PURE__ */ r("option", { value: s, children: vs[s] }, s))
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
function md(e, t) {
  const n = $e(e), a = ["Review"];
  return (n === "video" || n === "tag") && a.push("Appearance"), a.push("Actions"), t && a.push("Tag choices"), a;
}
function gd({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = k(null), a = k(null), i = Ct(), o = Ct();
  return z(() => {
    var s;
    n.current && !n.current.open && n.current.showModal(), (s = a.current) == null || s.focus();
  }, []), /* @__PURE__ */ c(
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
        /* @__PURE__ */ c("div", { className: "dq-confirm-dialog-actions", children: [
          /* @__PURE__ */ r("button", { ref: a, type: "button", className: "dq-button", onClick: e, children: "Keep editing" }),
          /* @__PURE__ */ r("button", { type: "button", className: "dq-button dq-button-danger", onClick: t, children: "Discard" })
        ] })
      ]
    }
  );
}
function Es({
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
  notices: b,
  onSave: m,
  onCancel: y,
  drawerRef: w
}) {
  const [q, I] = S("Review"), [E] = S(
    () => Ne(e) && e.occurrence.tagIds.length > 0
  ), [j, M] = S(""), [R, L] = S(null), [W, te] = S(0), [ne, U] = S(!1), _ = k(null), ie = k(null), C = k(null), $ = md(e, E), K = $e(e), ae = qe(() => wr(e), [e]);
  z(() => M(""), [ae]), z(() => {
    var D, ee;
    if (ne) return;
    const J = _.current;
    if (_.current = null, !J) return;
    (ee = J.isConnected && !!((D = C.current) != null && D.contains(J)) && !(J instanceof HTMLButtonElement && J.disabled) ? J : C.current) == null || ee.focus({ preventScroll: !0 });
  }, [ne]);
  function Y() {
    if (!(s || ne)) {
      if (!h) {
        y();
        return;
      }
      _.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, U(!0);
    }
  }
  function de() {
    const J = { ...e, name: e.name.trim() }, B = jr(J);
    if (!B) {
      M(""), m();
      return;
    }
    if (M(B), !J.name) {
      I("Review"), requestAnimationFrame(() => {
        var ee;
        return (ee = ie.current) == null ? void 0 : ee.focus();
      });
      return;
    }
    const D = e.actions.find(
      (ee) => !An(ee, K)
    );
    D && (I("Actions"), L(D.id), te((ee) => ee + 1));
  }
  const O = j || d;
  return /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ c(
      "aside",
      {
        ref: (J) => {
          C.current = J, w && (w.current = J);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (J) => {
          J.key !== "Escape" || J.defaultPrevented || s || (J.preventDefault(), J.stopPropagation(), Y());
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
                onClick: Y,
                children: /* @__PURE__ */ r(Gr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ r(
            Sc,
            {
              tabs: $.map((J) => ({
                key: J,
                label: J,
                count: J === "Actions" ? e.actions.length : void 0
              })),
              activeTab: q,
              onTabChange: (J) => I(J)
            }
          ) }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-body", children: /* @__PURE__ */ c("fieldset", { className: "dq-drawer-fields", disabled: s, children: [
            /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review settings" }),
            /* @__PURE__ */ c(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: q !== "Review",
                "aria-label": "Review",
                children: [
                  /* @__PURE__ */ r(
                    Ss,
                    {
                      review: e,
                      onChange: t,
                      entityTypeLocked: !0,
                      nameRef: ie,
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
                        onChange: (J) => a(J.target.value),
                        children: [
                          /* @__PURE__ */ r("option", { value: "end", children: "Start from the end" }),
                          /* @__PURE__ */ r("option", { value: "beginning", children: "Start from the beginning" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ r("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
                  ] }),
                  Ne(e) && /* @__PURE__ */ r(dd, { review: e, onChange: t }),
                  /* @__PURE__ */ r("div", { children: /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => vi(e),
                      children: "Export draft"
                    }
                  ) })
                ]
              }
            ),
            $.includes("Appearance") && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: q !== "Appearance",
                "aria-label": "Appearance",
                children: /* @__PURE__ */ r(bd, { review: e, onChange: t })
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
                  ad,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: i,
                    trees: o,
                    saving: s,
                    expandedId: R,
                    onExpand: L,
                    reveal: W
                  }
                )
              }
            ),
            E && Ne(e) && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: q !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ r(ld, { review: e, onChange: t })
              }
            )
          ] }) }),
          (O || b) && /* @__PURE__ */ c("div", { className: "dq-drawer-notices", children: [
            b,
            O && /* @__PURE__ */ c("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ r(Zn, { "aria-hidden": "true" }),
              O
            ] })
          ] }),
          /* @__PURE__ */ c("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ r("p", { className: "dq-drawer-dirty", children: h ? p ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: s, onClick: y, children: "Cancel" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button primary",
                "aria-busy": s || void 0,
                "aria-disabled": s || void 0,
                disabled: !s && l,
                onClick: () => {
                  s || de();
                },
                children: "Save review"
              }
            )
          ] })
        ]
      }
    ),
    ne && /* @__PURE__ */ r(
      gd,
      {
        onKeepEditing: () => U(!1),
        onDiscard: () => {
          _.current = null, U(!1), y();
        }
      }
    )
  ] });
}
function bd({
  review: e,
  onChange: t
}) {
  const n = Ct(), a = e.view, i = (p) => t({ ...e, view: { ...a, ...p } }), o = /* @__PURE__ */ c("label", { className: "dq-checkbox dq-setting-indent", children: [
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
  if ($e(e) === "tag")
    return /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ r(
        ro,
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
  return /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ c("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ r(
          ao,
          {
            name: `${n}-layout-choice`,
            checked: h === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ r(wd, {}),
            onChoose: () => i({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ r(
          ao,
          {
            name: `${n}-layout-choice`,
            checked: h === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ r(yd, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ r(
        ro,
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
        ].map(([p, b]) => /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: d.includes(p),
              onChange: (m) => l({
                annotations: m.target.checked ? [...d, p] : d.filter((y) => y !== p)
              })
            }
          ),
          b
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
function ro({
  label: e,
  value: t,
  options: n,
  onChange: a
}) {
  const i = Ct();
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
function ao({
  name: e,
  checked: t,
  title: n,
  text: a,
  picture: i,
  onChoose: o
}) {
  const s = Ct(), l = Ct();
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
function wd() {
  return /* @__PURE__ */ c("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function yd() {
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
function Cs({
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
  chipsAfter: b,
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
          children: /* @__PURE__ */ r(Kr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-type", title: ys[n], children: /* @__PURE__ */ r(Ns, { entityType: n }) }),
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
          children: /* @__PURE__ */ r(yr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    d,
    /* @__PURE__ */ r("div", { className: "dq-review-header-trail", children: h }),
    /* @__PURE__ */ r("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    p,
    b && /* @__PURE__ */ r("div", { className: "dq-review-chips-after", children: b }),
    m && /* @__PURE__ */ r("div", { className: "dq-review-chips-end", children: m })
  ] });
}
function As({
  page: e,
  pages: t,
  onPage: n
}) {
  const [a, i] = S(!1), [o, s] = S(""), l = k(null), d = k(null);
  z(() => {
    var b;
    a && ((b = l.current) == null || b.select());
  }, [a]);
  const h = (b) => {
    i(!1), b && requestAnimationFrame(() => {
      var m;
      return (m = d.current) == null ? void 0 : m.focus();
    });
  }, p = () => {
    const b = Math.round(Number(o));
    h(!0), Number.isFinite(b) && b >= 1 && b !== e && n(Math.min(t, b));
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
        children: /* @__PURE__ */ r(Kr, { "aria-hidden": "true" })
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
        onChange: (b) => s(b.target.value),
        onKeyDown: (b) => {
          b.key === "Enter" ? (b.preventDefault(), p()) : b.key === "Escape" && (b.preventDefault(), b.stopPropagation(), h(!0));
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
        children: /* @__PURE__ */ r(_o, { "aria-hidden": "true" })
      }
    )
  ] });
}
function ks({
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
          /* @__PURE__ */ r(Lc, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ r(ai, { "aria-hidden": "true" }),
          "Grid"
        ]
      }
    )
  ] });
}
function vd({
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
function Ni({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [a, i] = S(!1), [o, s] = S(!1), l = k(null), d = k(null), h = Ct();
  pn(() => {
    if (!a || !d.current || !l.current) return;
    const m = l.current.getBoundingClientRect(), y = d.current.offsetHeight + 12, w = window.innerHeight - m.bottom;
    s(w < y && m.top > w);
  }, [a]), z(() => {
    var m, y;
    a && ((y = (m = d.current) == null ? void 0 : m.querySelector('[role="menuitem"]:not(:disabled)')) == null || y.focus({ preventScroll: !0 }));
  }, [a]), z(() => {
    t && i(!1);
  }, [t]);
  const p = (m = !0) => {
    var y;
    i(!1), m && ((y = l.current) == null || y.focus());
  };
  return /* @__PURE__ */ c("div", { className: `dq-menu${a ? " dq-menu-open" : ""}`, onKeyDown: (m) => {
    var q, I;
    if (!a) return;
    const y = [
      ...((q = d.current) == null ? void 0 : q.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], w = y.indexOf(document.activeElement);
    if (m.key === "Escape")
      m.preventDefault(), m.stopPropagation(), p();
    else if (m.key === "Tab")
      p(!1);
    else if (m.key === "ArrowDown" || m.key === "ArrowUp") {
      if (m.preventDefault(), !y.length) return;
      const E = m.key === "ArrowDown" ? 1 : -1;
      y[(w + E + y.length) % y.length].focus();
    } else (m.key === "Home" || m.key === "End") && (m.preventDefault(), (I = y.at(m.key === "Home" ? 0 : -1)) == null || I.focus());
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
        children: /* @__PURE__ */ r(Dc, { "aria-hidden": "true" })
      }
    ),
    a && /* @__PURE__ */ c(pe, { children: [
      /* @__PURE__ */ r("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => p(!1) }),
      /* @__PURE__ */ r(
        "div",
        {
          ref: d,
          id: h,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${o ? " dq-menu-list-up" : ""}`,
          children: e.map((m) => /* @__PURE__ */ c(ei, { children: [
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
function la(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function qi(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Si(e) {
  return !!String(e ?? "").trim();
}
function Ei(e) {
  return [
    ...new Set(
      la(e.customFieldCriteria).filter(qi).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Si(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Ci(e, t) {
  const n = la(e.customFieldCriteria);
  if (!n.length) return e;
  let a = !1;
  const i = n.map((o) => {
    if (!qi(o)) return o;
    const s = { ...o };
    for (const [l, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const h = t[String(o[l] ?? "")];
      h && !Si(o[d]) && (s[d] = h, a = !0);
    }
    return s;
  });
  return a ? { ...e, customFieldCriteria: i } : e;
}
function Ts(e, t, n) {
  const a = la(e.customFieldCriteria);
  if (!a.length) return e;
  const i = la(n.customFieldCriteria), o = (d, h) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (p) => (d[p] ?? void 0) === (h[p] ?? void 0)
  );
  let s = !1;
  const l = a.map((d) => {
    if (!qi(d)) return d;
    const h = i.find((b) => o(b, d));
    if (!h) return d;
    const p = { ...d };
    for (const [b, m] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const y = t[String(d[b] ?? "")];
      y && d[m] === y && !Si(h[m]) && (delete p[m], s = !0);
    }
    return p;
  });
  return s ? { ...e, customFieldCriteria: l } : e;
}
async function Nd(e, t, n) {
  if (!An(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const a = ke(e), i = n.steps.some((l) => En(l.mode)) ? await Tl(a) : "", o = await hi(n);
  let s = t.applications;
  for (const l of [
    ...o.filter((d) => !En(d.mode)),
    ...o.filter((d) => En(d.mode))
  ]) {
    const d = (h) => Rl(
      i,
      a,
      t.media.id,
      t.performer.id,
      l.tagIds,
      h
    );
    (l.mode === "MARK_PRESENT" || l.mode === "CLEAR_ABSENCE") && await d("REMOVE"), l.mode !== "CLEAR_ABSENCE" && (s = await $s(
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
async function Ai(e, t) {
  const n = e.occurrence;
  if (ci(n)) return null;
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
function Rs(e) {
  return _r(e.condition) && e.hideConfirmedAbsent !== !1;
}
function ki(e, t) {
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
  }, s = Rs(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: ke(e),
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
                      key: pa,
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
async function Ti(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => ma([n], t))
  );
}
function Is(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function qd(e, t, n = e.conditionTagIds.map((a) => [a])) {
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
function Sd(e, t, n, a, i) {
  if (!Rs(e)) return !1;
  const o = rs(t, n);
  return e.conditionTagIds.every(
    (s, l) => o.includes(s) || i[l].some((d) => a.includes(d))
  );
}
async function Os(e, t, n, a) {
  if ((t == null ? void 0 : t.length) === 0 || Is(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = ke(e), o = await Pr(
    ki(e, t),
    { ...e.view.filter, page: n },
    a
  ), s = t === null ? null : new Set(t), l = e.occurrence, d = o.items.length ? await Ti(l, a) : [], h = new Array(o.items.length);
  let p = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; p < o.items.length; ) {
        const b = p++, m = o.items[b], y = await ce(
          `/api/tagapplications?hostType=${i}&hostId=${m.id}&contextType=performer`,
          { signal: a }
        );
        h[b] = m.performers.filter((w) => s === null || s.has(w.id)).flatMap((w) => {
          const q = y.filter(
            (E) => E.hostType === i && E.hostId === m.id && E.contextType === "performer" && E.contextId === w.id
          ), I = q.map((E) => E.tag.id);
          return qd(e.occurrence, I, d) && !Sd(l, m, w.id, I, d) ? [
            {
              key: `${m.id}:${w.id}`,
              media: m,
              performer: w,
              applications: q
            }
          ] : [];
        });
      }
    })
  ), { items: h.flat(), totalCount: o.totalCount };
}
async function $s(e, t, n) {
  const a = new Set(e.occurrence.tagIds);
  if (n.some((h) => !a.has(h)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = ke(e), o = await Ka(i, t.media.id);
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
function Nr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function Ed(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function Xt(e, t, n = !0) {
  var l;
  if (t.occurrence) {
    const d = n ? rs(
      await Ka(e, t.media.id),
      t.occurrence.performer.id
    ) : [], h = (await ce(Ed(e, t))).filter(
      (p) => p.hostType === e && p.hostId === t.media.id && p.contextType === "performer" && p.contextId === t.occurrence.performer.id
    );
    return Ja(h.map((p) => p.tag)), {
      ids: [...new Set(h.map((p) => p.tag.id))],
      names: [...new Set(h.map((p) => p.tag.name))],
      absent: d,
      applications: h
    };
  }
  const a = await Ka(e, t.media.id), i = (a.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  );
  Ja(i);
  const o = Object.keys(a.customFields ?? {}).find(
    (d) => d.toLowerCase() === sa
  ) ?? sa, s = ((l = a.customFields) == null ? void 0 : l[o]) ?? [];
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
async function Ri(e, t, n) {
  if (t.occurrence && Ne(e))
    await $s(
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
        `/api/${_n(ke(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: a, tagIds: i })
        }
      );
}
async function Cd(e, t, n) {
  t.occurrence && Ne(e) ? await Nd(e, t.occurrence, n) : await as(ke(e), n, [t.media.id]);
}
function za(e, t, n, a) {
  const i = (o) => o.filter((s) => a.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: Nr(i(t.ids), i(n.ids)),
    absence: Nr(i(t.absent), i(n.absent))
  };
}
function Ad(e, t) {
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
class Fs extends Error {
}
const Qa = (e) => e instanceof Error ? e.message : "Request failed.", io = (e) => [...e].sort((t, n) => t - n), Ur = (e, t) => JSON.stringify(io(e)) === JSON.stringify(io(t)), Wa = (e) => !!(e.tags.added.length || e.tags.removed.length);
function da(e, t, n, a) {
  const i = new Set(e), o = new Set(e);
  for (const p of t.steps)
    for (const b of p.tagIds)
      p.mode === "ADD" ? o.add(b) : o.delete(b);
  const s = e.some((p) => !o.has(p));
  if (s && !a)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const l = new Set(
    t.steps.filter((p) => p.mode === "ADD").flatMap((p) => p.tagIds)
  ), d = [], h = [];
  for (const p of n) {
    const b = p.filter((y) => o.has(y) && !i.has(y)), m = p.filter(
      (y) => o.has(y) && i.has(y) && !l.has(y)
    );
    !b.length || !m.length || (a ? (m.forEach((y) => o.delete(y)), h.push(...m)) : (b.forEach((y) => o.delete(y)), d.push({ tagIds: b, existing: m })));
  }
  return { desired: [...o], conflict: s, skipped: !1, kept: d, replaced: h };
}
function kd(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Td(e, t, n, a) {
  for (const [i, o] of n.entries()) {
    const s = t.filter(
      (h) => h.steps.some(
        (p) => p.mode === "ADD" && p.tagIds.some((b) => o.includes(b))
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
    throw new Fs(
      `${s.map((h) => h.label).join(" and ")} answer the same condition tag, ${d}. Choose one of them.`
    );
  }
}
async function Rd(e, t, n, a = () => {
}) {
  if (!t.length || t.some(
    (m) => !An(m, e.entityType) || !m.steps.length || m.steps.some(
      (y) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(y.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = _r(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await Ti(i.occurrence, n) : [];
  await Td(i, o, s, n);
  const l = await Promise.all(
    o.map(async (m) => ({
      ...m,
      steps: await hi(m, n)
    }))
  ), d = structuredClone(kd(l));
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
  const p = await Ai(i, n), b = /* @__PURE__ */ new Map();
  for (let m = 1; ; m++) {
    n.throwIfAborted();
    const y = await Os(i, p, m, n);
    for (const w of y.items) {
      const q = {
        ids: [...new Set(w.applications.map((E) => E.tag.id))],
        names: w.applications.map((E) => E.tag.name),
        absent: [],
        applications: w.applications
      }, I = da(q.ids, d, s, !0);
      b.set(w.key, {
        item: { key: w.key, media: w.media, occurrence: w },
        before: q,
        expected: q,
        conflict: I.conflict,
        status: Ur(q.ids, I.desired) ? "unchanged" : "pending"
      });
    }
    if (a(b.size), m * 250 >= y.totalCount) break;
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
    entries: [...b.values()]
  };
}
function Id(e, t, n) {
  const a = (o) => o.ids.filter((s) => n.includes(s));
  if (!Ur(a(e), a(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return Ur(i(e), i(t));
}
async function Ms(e, t, n, a) {
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
function xs(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function Ps(e) {
  return e.entries.filter((t) => t.operation);
}
async function Od(e, t, n, a, i = !1) {
  await Ms(
    xs(e, i),
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
        if (s = await Xt(ke(e.review), o.item, !1), !Id(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (m) {
        o.status = "failed", o.error = Qa(m);
        return;
      }
      const l = da(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), d = [
        ...s.ids.filter((m) => !e.touched.includes(m)),
        ...l.desired.filter((m) => e.touched.includes(m))
      ], h = Nr(s.ids, d);
      if (!h.added.length && !h.removed.length) {
        const m = !o.operation && l.kept.length > 0;
        o.status = o.operation ? "changed" : m ? "skipped" : "unchanged", o.error = m ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let p;
      try {
        await Ri(e.review, o.item, h);
      } catch (m) {
        p = m;
      }
      let b = !1;
      try {
        const m = await Xt(ke(e.review), o.item, !1);
        b = !0, o.expected = m;
        const y = za(
          o.item,
          o.before,
          m,
          e.touched
        );
        if (o.operation = Wa(y) ? y : void 0, p) throw p;
        if (!Ur(
          m.ids.filter((w) => e.touched.includes(w)),
          d.filter((w) => e.touched.includes(w))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (m) {
        if (o.status = "failed", o.error = Qa(m), !b)
          try {
            const y = await Xt(ke(e.review), o.item, !1);
            o.expected = y;
            const w = za(
              o.item,
              o.before,
              y,
              e.touched
            );
            o.operation = Wa(w) ? w : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    a
  );
}
async function $d(e, t, n) {
  await Ms(
    Ps(e),
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
        const l = await Xt(ke(e.review), a.item, !1);
        Ad(i, l), s = !0, await Ri(e.review, a.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const d = await Xt(ke(e.review), a.item, !1);
        if (!Ur(
          d.ids.filter((h) => o.includes(h)),
          a.before.ids.filter((h) => o.includes(h))
        ))
          throw new Error("Undo did not restore all affected tags.");
        a.operation = void 0, a.expected = d, a.status = "unchanged", a.error = void 0;
      } catch (l) {
        if (a.error = `Undo stopped: ${Qa(l)}`, a.status = "failed", s)
          try {
            const d = await Xt(ke(e.review), a.item, !1), h = za(
              a.item,
              a.before,
              d,
              o
            );
            a.operation = Wa(h) ? h : void 0, a.expected = d;
          } catch {
            a.unverified = !0;
          }
      }
    },
    n
  );
}
async function Fd(e, t, n) {
  const a = ke(e), i = e.occurrence, [o, s] = await Promise.all([
    ce(
      `/api/tagapplications?hostType=${a}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Ti(i, n)
  ]), l = o.filter(
    (w) => w.hostType === a && w.contextType === "performer" && w.contextId === t
  );
  Ja(l.map((w) => w.tag));
  const d = await Promise.all(
    s.map(async (w, q) => {
      const I = i.conditionTagIds[q];
      return (await ce(`/api/tags/${I}`, { signal: n })).name;
    })
  ), h = new Set(s.flat()), p = new Set(
    [
      ...e.actions.flatMap((w) => w.steps).filter((w) => w.mode === "ADD" || w.mode === "MARK_PRESENT").flatMap((w) => w.tagIds),
      ...i.tagIds
    ].filter((w) => !h.has(w))
  ), b = (w) => {
    const q = /* @__PURE__ */ new Map();
    for (const I of l) {
      if (!w.has(I.tag.id)) continue;
      const E = q.get(I.tag.id) ?? {
        tag: I.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      E.hosts.add(I.hostId), q.set(I.tag.id, E);
    }
    return [...q.values()].map((I) => ({ ...I.tag, count: I.hosts.size })).sort((I, E) => E.count - I.count || fs(I, E));
  }, m = s.map((w, q) => ({
    id: i.conditionTagIds[q],
    name: d[q],
    tags: b(new Set(w))
  }));
  p.size && m.push({
    id: null,
    name: s.length ? "Other review tags" : "Review tags",
    tags: b(p)
  });
  const y = /* @__PURE__ */ new Set([...h, ...p]);
  return {
    answered: new Set(
      l.filter((w) => y.has(w.tag.id)).map((w) => w.hostId)
    ).size,
    groups: m
  };
}
const Ls = vc(!1);
function Md({ children: e }) {
  return /* @__PURE__ */ r(Ls.Provider, { value: !0, children: e });
}
function Kt({ tag: e, name: t }) {
  const n = Nc(Ls), a = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ r(Ec, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: a ?? void 0 });
}
const oo = { summary: null, error: "" };
function Ds(e, t, n = 0) {
  const [a, i] = S(oo), o = e.occurrence, s = JSON.stringify([
    e.entityType,
    t,
    o.condition,
    o.conditionTagIds,
    o.includeSubtags,
    o.tagIds,
    e.actions.map((l) => l.steps)
  ]);
  return z(() => {
    if (i(oo), t === null) return;
    const l = new AbortController();
    return Fd(e, t, l.signal).then((d) => {
      l.signal.aborted || i({ summary: d, error: "" });
    }).catch((d) => {
      l.signal.aborted || i({
        summary: null,
        error: d instanceof Error ? d.message : "Request failed."
      });
    }), () => l.abort();
  }, [s, n]), a;
}
function xd({
  review: e,
  performerId: t,
  revision: n = 0
}) {
  const a = Ds(e, t, n);
  return /* @__PURE__ */ r(Ha, { ...a, mediaKind: ke(e) });
}
function Ha({
  summary: e,
  error: t,
  mediaKind: n,
  className: a = ""
}) {
  const i = mn(n), o = (s) => `${s.toLocaleString()} ${s === 1 ? i.one : i.many}`;
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
            /* @__PURE__ */ r(Kt, { tag: l }),
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
function br({
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
const so = 5;
function Pd(e, t) {
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
function Ld(e, t) {
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
const co = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), Ya = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], lo = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], Dd = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, Fa = 250;
function xr(e, t) {
  var a, i;
  const n = e.item.media;
  return n.title || ((i = (a = n.files) == null ? void 0 : a[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function _d({ step: e }) {
  const t = Ya.findIndex((n) => n.id === e);
  return /* @__PURE__ */ r("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Ya.map((n, a) => {
    const i = a < t ? "done" : a === t ? "current" : "next";
    return /* @__PURE__ */ c("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ r(ii, {}) : a + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function uo({ parts: e, id: t }) {
  return /* @__PURE__ */ r("span", { className: "dq-batch-effect", id: t, children: e.map((n, a) => /* @__PURE__ */ c(ei, { children: [
    a > 0 && " ",
    /* @__PURE__ */ r("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, a)) });
}
function Mr({
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
        n && /* @__PURE__ */ c(pe, { children: [
          " ",
          /* @__PURE__ */ r("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function fo({
  added: e,
  removed: t,
  tag: n,
  label: a
}) {
  return /* @__PURE__ */ c("ul", { className: "dq-tags", "aria-label": a, children: [
    tr(e.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ c("ins", { children: [
      "+ ",
      /* @__PURE__ */ r(Kt, { tag: i })
    ] }) }, `added-${i.id}`)),
    tr(t.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ c("del", { children: [
      "− ",
      /* @__PURE__ */ r(Kt, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function ho({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: a,
  describe: i
}) {
  return /* @__PURE__ */ c("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: e }),
      t.length > Fa && /* @__PURE__ */ c("span", { children: [
        "First ",
        Fa.toLocaleString(),
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
      /* @__PURE__ */ r("tbody", { children: t.slice(0, Fa).map((o) => {
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
                xr(o, n)
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
function jd(e) {
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
function Ud({
  review: e,
  disabled: t,
  performerFlags: n = [],
  trees: a,
  onOpen: i,
  onClose: o,
  onWrite: s
}) {
  const [l, d] = S(!1), [h, p] = S("answers"), [b, m] = S(null), [y, w] = S({}), [q, I] = S([]), [E, j] = S(!1), [M, R] = S(!1), [L, W] = S(""), [te, ne] = S(!1), [U, _] = S(""), [ie, C] = S(null), [$, K] = S(null), [ae, Y] = S([]), [de, O] = S(0), J = k(null), B = k(null), D = k(null), ee = k(!1), be = k(!1), Te = k(null), Lt = k(!1), it = k(0), ut = k(!1), Pe = k({ onClose: o, onWrite: s });
  Pe.current = { onClose: o, onWrite: s };
  const ze = Ct(), ot = jn(), Bt = h === "run", tt = (ie == null ? void 0 : ie.kind) === "undo", et = Bt && b ? b.review : e, he = et.occurrence, nt = ke(et), _e = mn(nt), gn = _e.queue, Ge = Bt && b ? b.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((N) => N.steps.length && !Dn(N))
  ), Ce = Ge.filter((N) => q.includes(N.id)), Se = he.targetMode === "selected" && he.performerIds.length === 1, Qe = Ds(
    et,
    l && Se ? he.performerIds[0] : null,
    de
  ), Zt = Ei(et.view.objectFilter), Nt = bi(
    l ? [...ga(Ge), ...he.conditionTagIds, ...Zt] : []
  ), Un = qe(() => us(Nt), [Nt]), st = (N) => y[N] ?? Nt[N] ?? { id: N, name: `Tag ${N}` }, At = JSON.stringify(
    Object.fromEntries(
      Zt.flatMap((N) => {
        var re;
        const A = (re = Nt[N]) == null ? void 0 : re.name;
        return A ? [[String(N), A]] : [];
      })
    )
  ), rt = qe(
    () => Ci(et.view.objectFilter, JSON.parse(At)),
    [et.view.objectFilter, At]
  );
  z(() => {
    var N, A, re;
    l && ((N = J.current) == null || N.showModal(), (re = (A = J.current) == null ? void 0 : A.querySelector(".dq-batch-answer input")) == null || re.focus());
  }, [l]), z(() => {
    if (!l) return;
    const N = requestAnimationFrame(() => {
      var ve;
      const A = J.current, re = document.activeElement;
      if (!A || re && re !== document.body && A.contains(re)) return;
      (ve = (h === "answers" ? A.querySelector(".dq-batch-answer input:checked") ?? A.querySelector(".dq-batch-answer input") : A.querySelector("[data-batch-focus]")) ?? B.current) == null || ve.focus();
    });
    return () => cancelAnimationFrame(N);
  }, [l, h, M, b]), z(() => {
    if (l || t || !ee.current) return;
    const N = requestAnimationFrame(() => {
      const A = D.current;
      if (!ee.current || !A || A.disabled) return;
      ee.current = !1;
      const re = document.activeElement;
      (!re || re === document.body) && A.focus();
    });
    return () => cancelAnimationFrame(N);
  }, [l, t]), z(() => {
    if (!l || he.targetMode !== "selected") return;
    const N = new AbortController();
    return Y([]), Pd(he.performerIds.slice(0, so), N.signal).then((A) => {
      N.signal.aborted || Y(A);
    }).catch(() => {
    }), () => N.abort();
  }, [l, he.targetMode, JSON.stringify(he.performerIds)]), z(
    () => () => {
      var N;
      be.current = !0, (N = Te.current) == null || N.abort();
    },
    []
  ), z(() => {
    if (!M) return;
    const N = (A) => {
      A.preventDefault(), A.returnValue = "";
    };
    return window.addEventListener("beforeunload", N), () => window.removeEventListener("beforeunload", N);
  }, [M]);
  function Vt() {
    p("answers"), m(null), w({}), C(null), j(!1), I([]), _(""), W(""), ne(!1), K(null);
  }
  function gt() {
    ut.current || (d(!1), Pe.current.onClose(Lt.current), Lt.current = !1, Vt(), ee.current = !0);
  }
  function Tn(N, A) {
    I(
      (re) => A ? [...re, N] : re.filter((Ee) => Ee !== N)
    ), m(null), w({}), _(""), W(""), ne(!1), K(null);
  }
  function Dt() {
    p("answers"), K(null), _("");
  }
  function en() {
    p("preview"), b || bn();
  }
  function kt() {
    var N;
    be.current = !0, (N = Te.current) == null || N.abort(), _("Stopping after in-flight operations settle…");
  }
  function oe(N) {
    K(
      (A) => (A == null ? void 0 : A.group) === N.group && A.reason === N.reason ? null : N
    );
  }
  const ft = (N, A) => ($ == null ? void 0 : $.group) === N && $.reason === A;
  async function bn() {
    if (!Ce.length || ut.current) return;
    ut.current = !0, R(!0), W(""), ne(!1), _("Loading all matching occurrences…"), m(null), w({}), K(null);
    const N = new AbortController();
    Te.current = N;
    try {
      await Ld(it.current, N.signal);
      const A = await Rd(
        e,
        Ce,
        N.signal,
        (Ee) => _(`Loaded ${Ee.toLocaleString()} matching occurrences…`)
      );
      N.signal.throwIfAborted();
      const re = {};
      for (const Ee of A.entries)
        for (const ve of Ee.before.applications ?? [])
          re[ve.tag.id] = ve.tag;
      w(re), m(A), _("Preview ready. No tags have been changed.");
    } catch (A) {
      W(
        N.signal.aborted ? "Preview cancelled. No tags were changed." : A instanceof Error ? A.message : String(A)
      ), ne(!N.signal.aborted && A instanceof Fs), _("");
    } finally {
      ut.current = !1, R(!1), Te.current = null;
    }
  }
  async function Ft(N) {
    if (!b || ut.current) return;
    const A = (N === "undo" ? Ps(b) : xs(b, N === "retry")).length;
    ut.current = !0, be.current = !1, Lt.current = !0, Pe.current.onWrite(), R(!0), p("run"), W(""), C({ kind: N, total: A, done: 0, stopped: !1 }), _(
      N === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const re = () => C((ve) => ve && { ...ve, done: ve.done + 1 });
    let Ee = !1;
    try {
      N === "undo" ? await $d(b, () => be.current, re) : await Od(b, E, () => be.current, re, N === "retry"), _(
        be.current ? "Stopped after in-flight operations settled. Completed changes are retained." : N === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (ve) {
      Ee = !0, _(""), W(ve instanceof Error ? ve.message : String(ve));
    } finally {
      it.current = Date.now(), ut.current = !1;
      const ve = be.current || Ee;
      C((me) => me && { ...me, stopped: ve }), R(!1), O((me) => me + 1);
    }
  }
  const We = (b == null ? void 0 : b.entries) ?? [], je = qe(
    () => new Map(
      ((b == null ? void 0 : b.entries) ?? []).map((N) => [
        N.item.key,
        da(N.before.ids, b.action, b.categories, E)
      ])
    ),
    [b, E]
  ), bt = (N) => je.get(N.item.key), Z = (N) => Nr(N.before.ids, bt(N).desired), F = (N) => {
    const A = Z(N);
    return N.status === "pending" && (A.added.length > 0 || A.removed.length > 0);
  }, we = (N) => N.conflict || bt(N).kept.length > 0 || bt(N).replaced.length > 0, He = qe(() => {
    const N = (b == null ? void 0 : b.entries) ?? [];
    return {
      willChange: N.filter(F).length,
      correct: N.filter((A) => A.status === "unchanged").length,
      different: N.filter(we).length,
      hosts: new Set(N.map((A) => A.item.media.id)).size,
      added: [...new Set(N.flatMap((A) => Z(A).added))],
      removed: [...new Set(N.flatMap((A) => Z(A).removed))]
    };
  }, [je]), Ye = qe(
    () => ((b == null ? void 0 : b.entries) ?? []).filter((N) => N.item.media.date).sort((N, A) => N.item.media.date.localeCompare(A.item.media.date)),
    [b]
  ), X = Bt ? jd(We) : null, tn = (N) => ot.action(et.actions.findIndex((A) => A.id === N)), wn = (N) => ir(N, Un, [], a), qt = _r(he.condition) && he.includeSubtags !== !1 && he.conditionTagIds.length > 0, at = Ye[0], Le = Ye.length > 1 ? Ye[Ye.length - 1] : void 0, Ke = (N) => `/${nt}/${N.item.media.id}`, ct = Se ? ae[0] : void 0, nn = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: F },
    correct: { title: "Occurrences already correct", test: (N) => N.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: we }
  };
  function St() {
    const N = Dd[he.condition], A = !!N && he.conditionTagIds.length > 0, re = he.performerIds.slice(0, so), Ee = String(et.view.filter.q ?? "").trim(), ve = he.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ c("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      ci(he) ? /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "All performers" }) : he.targetMode === "selected" ? /* @__PURE__ */ c(pe, { children: [
        re.map((me, Xe) => /* @__PURE__ */ c("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ r(br, { performer: { id: me, name: ae[Xe] ?? "" } }),
          ae[Xe] ?? "…"
        ] }, me)),
        he.performerIds.length > re.length && /* @__PURE__ */ c("span", { className: "dq-batch-chip", children: [
          (he.performerIds.length - re.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ c(pe, { children: [
        /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ r(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ r(
              Dr,
              {
                filter: {},
                objectFilter: he.performerFilter,
                criteriaDefinitions: ti,
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
        A ? N : oi[he.condition],
        A && /* @__PURE__ */ r("span", { className: "dq-batch-chip-tags", children: tr(he.conditionTagIds.map(st)).map((me) => /* @__PURE__ */ r(Kt, { tag: me }, me.id)) })
      ] }),
      A && /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: he.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      _r(he.condition) && he.hideConfirmedAbsent !== !1 && /* @__PURE__ */ c("span", { className: "dq-batch-chip", title: ve, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
          ": ",
          ve
        ] })
      ] }),
      Ee && /* @__PURE__ */ c("span", { className: "dq-batch-chip", children: [
        "Search “",
        Ee,
        "”"
      ] }),
      Object.keys(et.view.objectFilter).length > 0 && /* @__PURE__ */ r(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${gn} filters`,
          children: /* @__PURE__ */ r(
            Dr,
            {
              filter: et.view.filter,
              objectFilter: rt,
              criteriaDefinitions: nt === "audio" ? To : ni,
              customFieldEntityType: nt,
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
  function rn(N) {
    return n.length ? /* @__PURE__ */ c("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ r(ia, { "aria-hidden": "true" }),
      /* @__PURE__ */ c("div", { children: [
        /* @__PURE__ */ c("p", { children: [
          /* @__PURE__ */ r("strong", { children: ct || "This performer" }),
          " is flagged:",
          " ",
          /* @__PURE__ */ r("strong", { children: n.join(", ") }),
          ". Check the earliest and latest",
          " ",
          _e.many,
          " before applying, or narrow the batch with a date filter."
        ] }),
        N && at && /* @__PURE__ */ c("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ c("a", { href: Ke(at), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            xr(at, nt),
            " · ",
            at.item.media.date
          ] }),
          Le && /* @__PURE__ */ c("a", { href: Ke(Le), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            xr(Le, nt),
            " · ",
            Le.item.media.date
          ] })
        ] })
      ] })
    ] }) : null;
  }
  function yn() {
    return /* @__PURE__ */ c(pe, { children: [
      St(),
      rn(!1),
      /* @__PURE__ */ c("div", { className: `dq-batch-pick${Se ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ c("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ r("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ r("div", { className: "dq-batch-answers", children: Ge.map((N, A) => {
            const re = tn(N.id);
            return /* @__PURE__ */ c("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ r(
                "input",
                {
                  type: "checkbox",
                  checked: q.includes(N.id),
                  "aria-labelledby": `${ze}-answer-${A}`,
                  "aria-describedby": `${ze}-effect-${A}`,
                  onChange: (Ee) => Tn(N.id, Ee.target.checked)
                }
              ),
              /* @__PURE__ */ r("span", { className: "dq-batch-answer-key", children: re && /* @__PURE__ */ r(mt, { binding: re, hidden: !0 }) }),
              /* @__PURE__ */ c("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ r(
                  "span",
                  {
                    id: `${ze}-answer-${A}`,
                    className: "dq-batch-answer-label",
                    title: N.label,
                    children: N.label
                  }
                ),
                /* @__PURE__ */ r(uo, { id: `${ze}-effect-${A}`, parts: wn(N) })
              ] })
            ] }, N.id);
          }) })
        ] }),
        Se && /* @__PURE__ */ r(Ha, { ...Qe, mediaKind: nt, className: "dq-batch-card" })
      ] })
    ] });
  }
  function Jt(N) {
    const A = He, re = $ && co.has($.group) ? $.group : null, Ee = re ? We.filter(nn[re].test) : [], ve = (me) => {
      const Xe = bt(me), Mt = Xe.skipped ? Nr(
        me.before.ids,
        da(me.before.ids, N.action, N.categories, !0).desired
      ) : Z(me), wt = !Mt.added.length && !Mt.removed.length;
      return /* @__PURE__ */ c("div", { className: "dq-batch-plan", children: [
        Xe.skipped && /* @__PURE__ */ r("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        wt ? !Xe.kept.length && /* @__PURE__ */ r("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ r(fo, { added: Mt.added, removed: Mt.removed, tag: st }),
        Xe.kept.map((G, Fe) => /* @__PURE__ */ c("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          tr(G.existing.map(st)).map((ye) => /* @__PURE__ */ r(Kt, { tag: ye }, ye.id)),
          " ",
          "instead of",
          " ",
          tr(G.tagIds.map(st)).map((ye) => /* @__PURE__ */ r(Kt, { tag: ye }, ye.id))
        ] }, Fe))
      ] });
    };
    return /* @__PURE__ */ c(pe, { children: [
      /* @__PURE__ */ c("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ c("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ r(
            Mr,
            {
              value: We.length,
              label: We.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${A.hosts.toLocaleString()} ${A.hosts === 1 ? gn : `${gn}s`}`,
              pressed: ft("matching"),
              onToggle: () => oe({ group: "matching" })
            }
          ),
          /* @__PURE__ */ r(
            Mr,
            {
              value: A.willChange,
              label: "will change",
              tone: "add",
              pressed: ft("change"),
              onToggle: () => oe({ group: "change" })
            }
          ),
          /* @__PURE__ */ r(
            Mr,
            {
              value: A.correct,
              label: "already correct, no write",
              pressed: ft("correct"),
              onToggle: () => oe({ group: "correct" })
            }
          ),
          /* @__PURE__ */ r(
            Mr,
            {
              value: A.different,
              label: E ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: ft("different"),
              onToggle: () => oe({ group: "different" })
            }
          )
        ] }),
        Ee.length > 0 ? /* @__PURE__ */ r(
          ho,
          {
            title: nn[re].title,
            entries: Ee,
            mediaKind: nt,
            resultHeading: "Planned change",
            describe: ve
          }
        ) : We.length > 0 && /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        We.length > 0 && /* @__PURE__ */ c("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ r("span", { children: at ? `Dates ${at.item.media.date}${Le ? ` to ${Le.item.media.date}` : ""}` : "No dates" }),
          at && /* @__PURE__ */ r(
            "a",
            {
              href: Ke(at),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${_e.one}, ${at.item.media.date}`,
              title: xr(at, nt),
              children: "Open earliest"
            }
          ),
          Le && /* @__PURE__ */ r(
            "a",
            {
              href: Ke(Le),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${_e.one}, ${Le.item.media.date}`,
              title: xr(Le, nt),
              children: "Open latest"
            }
          ),
          Ye.length < We.length && /* @__PURE__ */ c("span", { children: [
            (We.length - Ye.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (A.added.length > 0 || A.removed.length > 0) && /* @__PURE__ */ c("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ r("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ r(
            fo,
            {
              added: A.added,
              removed: A.removed,
              tag: st,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      A.different > 0 && /* @__PURE__ */ c("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ r("span", { id: `${ze}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ c(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${ze}-choice`,
            children: [
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": !E, onClick: () => j(!1), children: "Keep their answer" }),
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": E, onClick: () => j(!0), children: "Replace it" })
            ]
          }
        ),
        /* @__PURE__ */ c("p", { className: "dq-muted", children: [
          "A different answer is a tag the chosen answers would remove",
          qt ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function Gn() {
    return /* @__PURE__ */ c(pe, { children: [
      St(),
      rn(!0),
      /* @__PURE__ */ c("div", { className: `dq-batch-cards${Se ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ c("section", { className: "dq-batch-card", "aria-labelledby": `${ze}-chosen`, children: [
          /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ r("h3", { id: `${ze}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", disabled: M, onClick: Dt, children: "Change" })
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-chosen", children: Ce.map((N) => {
            const A = tn(N.id);
            return /* @__PURE__ */ c("li", { children: [
              /* @__PURE__ */ c("span", { className: "dq-batch-chosen-chip", children: [
                A && /* @__PURE__ */ r(mt, { binding: A, hidden: !0 }),
                N.label
              ] }),
              /* @__PURE__ */ r(uo, { parts: wn(N) })
            ] }, N.id);
          }) })
        ] }),
        Se && /* @__PURE__ */ r(Ha, { ...Qe, mediaKind: nt, className: "dq-batch-card" })
      ] }),
      M ? /* @__PURE__ */ r("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ r("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ r("span", {}) }) }) : b && Jt(b)
    ] });
  }
  function Be(N) {
    const A = ie ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, re = A.kind === "apply" ? We.length - N.counts.pending : A.done, Ee = A.kind === "apply" ? We.length : A.total, ve = M ? A.kind === "undo" ? "Undoing batch…" : A.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : A.kind === "undo" ? A.stopped ? "Undo stopped" : "Undo finished" : A.stopped ? "Stopped" : "Finished", me = Ee ? Math.round(re / Ee * 100) : 100, Xe = $ && !co.has($.group) ? $.group : null, Mt = (G) => lo.find((Fe) => Fe.status === G).label, wt = Xe ? We.filter(
      (G) => G.status === Xe && (!$.reason || G.error === $.reason)
    ) : [];
    return /* @__PURE__ */ c(pe, { children: [
      /* @__PURE__ */ c("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ r("h3", { tabIndex: -1, "data-batch-focus": "", children: ve }),
          /* @__PURE__ */ c("span", { children: [
            re.toLocaleString(),
            " of ",
            Ee.toLocaleString(),
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
            "aria-valuemax": Ee,
            "aria-valuenow": re,
            children: /* @__PURE__ */ r("span", { style: { width: `${me}%` } })
          }
        ),
        !M && A.kind === "undo" && /* @__PURE__ */ c("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (A.total - N.recorded).toLocaleString(),
          " of",
          " ",
          A.total.toLocaleString(),
          " ",
          A.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ c("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ r("div", { className: "dq-batch-stats", "data-count": "5", children: lo.map((G) => /* @__PURE__ */ r(
          Mr,
          {
            value: N.counts[G.status],
            label: G.label,
            tone: G.tone,
            pressed: ft(G.status),
            onToggle: () => oe({ group: G.status })
          },
          G.status
        )) }),
        N.reasons.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-batch-reasons", children: N.reasons.map((G) => {
          const Fe = ft(G.status, G.error);
          return /* @__PURE__ */ c("li", { children: [
            /* @__PURE__ */ c("span", { children: [
              G.count.toLocaleString(),
              " ",
              G.status,
              ": ",
              G.error
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": Fe,
                onClick: () => oe({ group: G.status, reason: G.error }),
                children: Fe ? "Hide them" : "Show them"
              }
            )
          ] }, `${G.status}-${G.error}`);
        }) }),
        wt.length > 0 ? /* @__PURE__ */ r(
          ho,
          {
            title: $.reason ? `${Mt(Xe)}: ${$.reason}` : `${Mt(Xe)} occurrences`,
            entries: wt,
            mediaKind: nt,
            resultHeading: "Result",
            describe: (G) => G.error ?? Mt(G.status)
          }
        ) : /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      N.recorded > 0 && /* @__PURE__ */ c("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: M,
            onClick: () => void Ft("undo"),
            children: [
              /* @__PURE__ */ r(_c, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ c("p", { children: [
          tt ? A.stopped || M ? `${N.recorded.toLocaleString()} ${N.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${N.recorded.toLocaleString()} ${N.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${N.recorded === 1 ? "this change" : `these ${N.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function lt() {
    return h === "answers" ? /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Ce.length,
        onClick: en,
        children: "Preview all matches"
      },
      "preview"
    ) : h === "preview" ? M ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: kt, children: "Cancel preview" }, "cancel-preview") : b ? /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !He.willChange,
        onClick: () => void Ft("apply"),
        children: [
          "Apply to ",
          He.willChange.toLocaleString(),
          " ",
          He.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : te ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button primary", onClick: Dt, children: "Change answers" }, "change-answers") : /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void bn(),
        children: "Preview again"
      },
      "again"
    ) : M ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: kt, children: tt ? "Cancel undo" : "Cancel run" }, "cancel-run") : tt || !X ? null : /* @__PURE__ */ c(ei, { children: [
      X.retryable && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: () => void Ft("retry"), children: "Retry failed" }),
      X.counts.pending > 0 && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void Ft("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ c(Md, { children: [
    /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: D,
        title: "Apply answers to all matching occurrences",
        disabled: t || !Ge.length,
        onClick: () => {
          Vt(), i(), d(!0);
        },
        children: [
          /* @__PURE__ */ r(Ki, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    l && /* @__PURE__ */ c(
      "dialog",
      {
        ref: J,
        className: "dq-batch-dialog",
        "aria-labelledby": `${ze}-title`,
        "aria-modal": "true",
        onCancel: (N) => {
          N.preventDefault(), gt();
        },
        onClose: () => {
          var N;
          ut.current ? (N = J.current) == null || N.showModal() : gt();
        },
        children: [
          /* @__PURE__ */ c("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ r(Ki, { "aria-hidden": "true" }),
            /* @__PURE__ */ r("h2", { id: `${ze}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: M,
                onClick: gt,
                children: /* @__PURE__ */ r(Gr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r(_d, { step: h }),
          /* @__PURE__ */ c(
            "div",
            {
              className: "dq-batch-body",
              ref: B,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": h === "preview" ? "" : void 0,
              "aria-label": `${Ya.find((N) => N.id === h).label} step`,
              children: [
                /* @__PURE__ */ c("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  U && /* @__PURE__ */ r("p", { role: "status", children: U }),
                  L && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: L })
                ] }),
                h === "answers" ? yn() : h === "preview" ? Gn() : Be(X)
              ]
            }
          ),
          /* @__PURE__ */ c("div", { className: "dq-batch-footer", children: [
            h === "preview" && /* @__PURE__ */ c("button", { type: "button", className: "dq-button", disabled: M, onClick: Dt, children: [
              /* @__PURE__ */ r(Kr, { "aria-hidden": "true" }),
              "Back"
            ] }),
            h === "run" && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: M, onClick: Vt, children: "New batch" }),
            /* @__PURE__ */ r("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: M, onClick: gt, children: "Close" }),
            lt()
          ] })
        ]
      }
    )
  ] });
}
const _s = "data-quality.description-collapsed.v1";
function Gd() {
  try {
    return localStorage.getItem(_s) === "true";
  } catch {
    return !1;
  }
}
function Kd({
  details: e,
  label: t
}) {
  const [n, a] = S(Gd), i = Sn(() => {
    a((o) => {
      const s = !o;
      try {
        localStorage.setItem(_s, String(s));
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ r(Cc, { className: "dq-description-body", children: e }) : /* @__PURE__ */ r("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
function Bd({
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
  var b;
  const h = e ? e.ranked.slice(0, e.limit) : [], p = !!e && (e.ranked.length > e.limit || (((b = e.candidates[e.cursor]) == null ? void 0 : b.total) ?? 0) > 0);
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
          children: /* @__PURE__ */ r(jc, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-queue-list", children: h.map((m) => {
      const y = `${m.count.toLocaleString()} matching ${m.count === 1 ? o.one : o.many}`, w = m.flags.length ? `Flagged: ${m.flags.join(", ")}` : "";
      return /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${m.name}, ${y}${w ? `. ${w}` : ""}`,
          title: w || void 0,
          "aria-current": a === m.id ? "true" : void 0,
          disabled: i,
          onClick: () => s(m.id),
          children: [
            /* @__PURE__ */ r(br, { performer: m }),
            /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: m.name }),
            w && /* @__PURE__ */ r(ia, { className: "dq-flag-icon", "aria-hidden": "true" }),
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
const Vd = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], Jd = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function zd(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), a = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: a, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function ta(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Qd(e, t) {
  const n = ci(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", a = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${ta(a, "or")}`,
    includesAll: `has ${ta(a, "and")}`,
    excludes: `has none of ${ta(a, "or")}`,
    excludesAll: `missing ${ta(a, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function Wd({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: a,
  onEditCriteria: i
}) {
  const [o, s] = S(!1), [l, d] = S(null), h = k(null), p = k(null), b = Ct(), m = qr(e.conditionTagIds), y = Qd(e, m);
  pn(() => {
    if (!o || !h.current) return;
    const E = () => h.current && d(zd(h.current));
    return E(), window.addEventListener("resize", E), () => window.removeEventListener("resize", E);
  }, [o]), z(() => {
    var j, M;
    if (!o) return;
    const E = (j = p.current) == null ? void 0 : j.querySelector('[aria-pressed="true"]');
    E && !E.disabled ? E.focus() : (M = p.current) == null || M.focus();
  }, [o]);
  const w = () => {
    s(!1), requestAnimationFrame(() => {
      var E;
      return (E = h.current) == null ? void 0 : E.focus();
    });
  }, q = (E) => {
    if (!(E.target instanceof Element && E.target.closest('[role="dialog"]') !== p.current || E.defaultPrevented)) {
      if (E.key === "Escape")
        E.preventDefault(), w();
      else if (E.key === "Tab" && p.current) {
        const M = [...p.current.querySelectorAll(Jd)].filter((te) => te.closest('[role="dialog"]') === p.current).sort(
          (te, ne) => te.compareDocumentPosition(ne) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!M.length) return;
        const R = M[0], L = M[M.length - 1], W = document.activeElement;
        E.shiftKey && (W === R || W === p.current) ? (E.preventDefault(), L.focus()) : !E.shiftKey && W === L && (E.preventDefault(), R.focus());
      }
    }
  }, I = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ c("div", { className: "dq-scope", children: [
    /* @__PURE__ */ c(
      "button",
      {
        ref: h,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        "aria-controls": o ? b : void 0,
        title: y,
        onClick: () => o ? w() : s(!0),
        children: [
          /* @__PURE__ */ r(Po, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-summary", children: y }),
          /* @__PURE__ */ r(xo, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ c(pe, { children: [
      /* @__PURE__ */ r("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: w }),
      /* @__PURE__ */ c(
        "div",
        {
          ref: p,
          id: b,
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
          onKeyDown: q,
          children: [
            /* @__PURE__ */ c("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: Vd.map(({ mode: E, label: j }) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === E,
                  onClick: () => e.targetMode !== E && a({ targetMode: E }),
                  children: j
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
                  Dr,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: ti,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (E) => a({ performerFilter: E })
                  }
                ) }),
                /* @__PURE__ */ c("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ r(yr, { "aria-hidden": "true" }),
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
                  children: si.map((E) => /* @__PURE__ */ r("option", { value: E, children: oi[E] }, E))
                }
              ),
              I && /* @__PURE__ */ c(pe, { children: [
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
                  _r(e.condition) && /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
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
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: w, children: "Done" })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function aa(e) {
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
function Hd(e) {
  const t = e.occurrence;
  return JSON.stringify([
    ke(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {},
    t.flagPerformerTagIds ?? []
  ]);
}
async function Yd(e, t) {
  const n = ke(e) === "audio", a = new Set(e.occurrence.flagPerformerTagIds ?? []), i = (l) => ({
    id: l.id,
    name: l.name,
    total: (n ? l.audioCount : l.videoCount) ?? 0,
    flags: (l.tags ?? []).filter((d) => a.has(d.id)).map((d) => d.name)
  }), o = e.occurrence, s = [];
  if (o.targetMode === "selected" && o.performerIds.length > 0)
    for (const l of o.performerIds) {
      const d = await bl(
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
function js(e, t, n) {
  const a = ki(e, [t]);
  return vl(a, a.view.filter, n);
}
function Us(e, t) {
  const n = e.findIndex(
    (a) => a.count < t.count || a.count === t.count && a.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function Xa(e, t, n, a) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= a && i < n[a - 1].count;
}
async function Xd(e, t, n, a, i = {}) {
  const o = aa(e), s = Hd(e), l = Is(e.occurrence), d = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: l ? "" : s,
    candidates: l ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await Yd(e, a),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: h } = d, p = [...d.ranked];
  let b = d.cursor, m = !1;
  const y = (w) => ({
    ...d,
    cursor: b,
    ranked: [...p],
    limit: n,
    complete: !w && Xa(h, b, p, n),
    ...w ? { partial: w } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var w;
        for (; !m && !Xa(h, b, p, n); ) {
          a.throwIfAborted();
          const q = h[b++], I = await js(e, q.id, a);
          I > 0 && Us(p, { ...q, count: I }), (w = i.onProgress) == null || w.call(i, y(!0));
        }
      })
    );
  } catch (w) {
    throw m = !0, w;
  }
  return a.throwIfAborted(), y(!1);
}
function Zd(e, t, n) {
  const a = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || a < 0 || a >= e.cursor) return e;
  const i = e.ranked.filter((o) => o.id !== t);
  return n > 0 && Us(i, { ...e.candidates[a], count: n }), {
    ...e,
    ranked: i,
    complete: Xa(e.candidates, e.cursor, i, e.limit)
  };
}
function rr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, l) => rr(s, t[l]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, a = t, i = Object.keys(n).sort(), o = Object.keys(a).sort();
  return i.length === o.length && i.every(
    (s, l) => s === o[l] && rr(n[s], a[s])
  );
}
function eu(e) {
  var l, d, h;
  const [t, n] = S({}), [a, i] = S(""), o = (((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotations) ?? []).includes("tags") ? ((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...o,
      ...((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.binParents) ?? []
    ])
  ]);
  return z(() => {
    let p = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(s).map(
        async (b) => [b, await ma([b])]
      )
    ).then((b) => {
      p && n(Object.fromEntries(b));
    }).catch(() => {
      p && i(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      p = !1;
    };
  }, [s]), { ids: t, error: a };
}
function tu(e, t, n) {
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
function nu({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: a,
  disabled: i,
  onToggle: o
}) {
  var w;
  const s = ((w = t.presentation) == null ? void 0 : w.binParents) ?? [], l = new Set(
    s.flatMap((q) => (a[q] ?? []).filter((I) => I !== q))
  ), d = s.every((q) => a[q]), h = Jr(t.view.objectFilter, n).bins.filter(
    (q) => !d || l.has(q)
  ), p = /* @__PURE__ */ new Map();
  for (const q of e)
    for (const I of q.tags ?? [])
      if (l.has(I.id)) {
        const E = p.get(I.id) ?? { name: I.name, count: 0 };
        E.count++, p.set(I.id, E);
      }
  const b = h.filter((q) => !p.has(q)), m = qr(b);
  for (const q of b)
    p.set(q, {
      name: m[q] === void 0 ? "…" : m[q] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const y = [...p].sort((q, I) => q[1].name.localeCompare(I[1].name));
  return /* @__PURE__ */ c("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ r("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    y.map(([q, I]) => {
      const E = h.includes(q);
      return /* @__PURE__ */ c(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": E,
          title: E ? `Show every video again, not only ${I.name}` : `Show only videos tagged ${I.name}`,
          disabled: i,
          onClick: () => o(q),
          children: [
            E && /* @__PURE__ */ r(ii, { "aria-hidden": "true" }),
            I.name,
            " ",
            /* @__PURE__ */ r("span", { className: "dq-bin-count", children: I.count })
          ]
        },
        q
      );
    }),
    !y.length && /* @__PURE__ */ r("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function er(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function ru(e) {
  if (!er(e) || Object.keys(e).length !== 1 || !er(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !er(t.tagsCriterion)) return null;
  const { value: n, modifier: a, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && a === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function Jr(e, t) {
  let n = e;
  const a = [];
  for (; ; ) {
    if (t && rr(n, t)) {
      n = t;
      break;
    }
    const i = Object.keys(n);
    if (i.length !== 1 || i[0] !== "_filterExpression") break;
    const o = n._filterExpression;
    if (!er(o) || o.operator !== "AND" || !Array.isArray(o.children))
      break;
    const s = o.children, l = ru(s.at(-1));
    if (l == null || s.length > 3) break;
    let d = {}, h = null, p = !0;
    for (const [b, m] of s.slice(0, -1).entries())
      !er(m) || Object.keys(m).length !== 1 ? p = !1 : b === 0 && er(m.filter) && Object.keys(m.filter).length ? d = m.filter : !h && er(m.group) ? h = m.group : p = !1;
    if (!p) break;
    a.unshift(l), n = h ? { ...d, _filterExpression: h } : d;
  }
  return { base: n, bins: a };
}
function au(e, t, n) {
  const { base: a, bins: i } = Jr(e.view.objectFilter, n);
  return (i.includes(t) ? i.filter((s) => s !== t) : [...i, t]).reduce(iu, { ...e, view: { ...e.view, objectFilter: a } });
}
function iu(e, t) {
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
const ba = [
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
], ou = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function ar(e) {
  const t = Ne(e) ? e.occurrence : void 0;
  return {
    filter: Pt({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, ke(e)),
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
function po(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function Za(e, t) {
  let n;
  if (Ne(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!ba.some((l) => l !== "performer" && t.has(l))) {
    const l = ar(e);
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
  if (Ne(e) && (o = {
    ...ou,
    ...po(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !si.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (l) => !Number.isSafeInteger(l) || l <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Pt(i, ke(e)),
      objectFilter: po(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const mo = { dataQualityOpenedFromList: !0 };
function Gs() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function Ks(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...mo }, "", e) : window.history.replaceState(Gs() ? { ...mo } : null, "", e);
}
function Lr(e, t) {
  const n = new URLSearchParams(window.location.search);
  ba.forEach((a) => n.delete(a)), n.set("review", e);
  for (const a of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[a] !== void 0 && n.set(a, String(t.filter[a]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((a) => `${a.key}:${a.direction}`).join(",")
  ), n.set("filters", JSON.stringify(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), Ks(`${window.location.pathname}?${n}${window.location.hash}`);
}
function hn(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return Ne(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function nr(e) {
  const t = e;
  return hn(t, ar(t));
}
function go(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !rr(
    JSON.parse(Ln(hn(e, t))),
    JSON.parse(Ln(hn(e, ar(e))))
  );
}
function Bs(e, t) {
  if ($e(e) !== "video") return e;
  const { base: n, bins: a } = Jr(e.view.objectFilter, t.view.objectFilter);
  return a.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function na(e, t) {
  if ($e(e) !== "video") return t;
  const { base: n, bins: a } = Jr(t.objectFilter, e.view.objectFilter);
  return a.length ? { ...t, objectFilter: n } : t;
}
function bo(e, t) {
  return !t || !Ne(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function Ma(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const a of e)
    n.set(a.media.id, [...n.get(a.media.id) ?? [], a]);
  return [...n.values()].reverse().flat();
}
const Gt = (e) => e instanceof Error ? e.message : "Request failed.", xa = 50, su = [], wo = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function cu(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Rc(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? Oo(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function lu({ media: e, kind: t }) {
  const [n, a] = S(!1);
  return /* @__PURE__ */ r("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ r(Do, {}) : /* @__PURE__ */ r(fa, {}) : /* @__PURE__ */ r(
    "img",
    {
      src: Ba(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => a(!0)
    }
  ) });
}
function du({
  tags: e,
  preview: t,
  showPreview: n,
  trees: a,
  actionTagIds: i,
  label: o
}) {
  const s = yi(t), l = n ? s : null, d = e == null ? void 0 : e.absent, h = bi(
    qe(() => [...i, ...d ?? []], [i, d])
  ), p = (L) => h[L] ?? { id: L, name: h[L] === void 0 ? "…" : "Unavailable tag" }, b = (L) => tr(L.map(p)), m = l && e ? hs(l, e, a) : null, y = e ? jl(e) : [], w = new Set(y.map((L) => L.id)), q = new Set(m == null ? void 0 : m.removed), I = new Set(m == null ? void 0 : m.markedAbsent), E = new Set(m == null ? void 0 : m.absenceCleared), j = /* @__PURE__ */ c("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ r(_a, { "aria-hidden": "true" }),
    "absent"
  ] }), M = b((m == null ? void 0 : m.added) ?? []), R = b(((m == null ? void 0 : m.markedAbsent) ?? []).filter((L) => !w.has(L)));
  return /* @__PURE__ */ c("section", { className: "dq-panel-section", "aria-label": o, children: [
    /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ c(pe, { children: [
      y.length || M.length || R.length ? /* @__PURE__ */ c("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        y.map(
          (L) => q.has(L.id) ? /* @__PURE__ */ c("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ c("del", { children: [
              "− ",
              /* @__PURE__ */ r(Kt, { tag: L })
            ] }),
            I.has(L.id) && j
          ] }, L.id) : /* @__PURE__ */ r("li", { className: "dq-tag", children: /* @__PURE__ */ r(Kt, { tag: L }) }, L.id)
        ),
        M.map((L) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ c("ins", { children: [
          "+ ",
          /* @__PURE__ */ r(Kt, { tag: L })
        ] }) }, `added-${L.id}`)),
        R.map((L) => /* @__PURE__ */ c("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ r("ins", { children: /* @__PURE__ */ r(Kt, { tag: L }) }),
          j
        ] }, `absent-${L.id}`))
      ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ c(pe, { children: [
        /* @__PURE__ */ r("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: b(e.absent).map((L) => /* @__PURE__ */ c(
          "li",
          {
            className: `dq-tag dq-tag-absent${E.has(L.id) ? " dq-tag-removed" : ""}`,
            children: [
              /* @__PURE__ */ r(_a, { "aria-hidden": "true" }),
              E.has(L.id) ? /* @__PURE__ */ c("del", { children: [
                "− ",
                /* @__PURE__ */ r(Kt, { tag: L })
              ] }) : /* @__PURE__ */ r(Kt, { tag: L })
            ]
          },
          L.id
        )) })
      ] })
    ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading…" })
  ] });
}
function uu({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: a,
  onSaveDefaults: i,
  editRequest: o = 0,
  onEditRequestHandled: s,
  pageControls: l
}) {
  var Ir;
  const d = ke(e), h = mn(d), p = d === "audio" ? "Audio" : "Scene", b = (f) => {
    var v;
    return f.title || ((v = f.files[0]) == null ? void 0 : v.basename) || p;
  }, m = (f) => `${f.occurrence ? `${f.occurrence.performer.name} — ` : ""}${b(f.media)}`, y = k(null), w = k("");
  if (!y.current)
    try {
      y.current = Za(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (f) {
      w.current = Gt(f), y.current = { query: ar(e), startAtEnd: !1 };
    }
  const [q, I] = S(null), [E, j] = S(""), M = k(null), R = k(null), L = k(null), W = k(null), [te, ne] = S(!!w.current), U = k(0), [_, ie] = S(y.current.query), C = k(_);
  C.current = _;
  const [$, K] = S(0), ae = k(y.current.startAtEnd), [Y, de] = S([]), [O, J] = S(null), B = k(null), [D, ee] = S(null), [be, Te] = S(0), Lt = qe(() => {
    if (!O) return null;
    const f = Y.findIndex((v) => v.key === O.key);
    return f < 0 ? null : Y.slice(f + 1).find((v) => v.media.id !== O.media.id) ?? null;
  }, [O, Y]), [it, ut] = S(0), [Pe, ze] = S(!1), [ot, Bt] = S(!1), tt = k(!1), et = k(!0), he = k(null);
  z(() => (et.current = !0, () => {
    et.current = !1;
  }), []);
  const [nt, _e] = S(w.current), [gn, Ge] = S(""), [Ce, Se] = S(null), [Qe, Zt] = S(!1), [Nt, Un] = S([]), st = k([]), At = k(null), rt = k(null), Vt = k(null);
  z(() => {
    var f, v;
    Qe && ((v = (f = Vt.current) == null ? void 0 : f.querySelector("input")) == null || v.focus());
  }, [Qe]);
  const [gt, Tn] = S(!1), [Dt, en] = S(!1);
  z(() => {
    if (Pe || gt || !rt.current) return;
    const f = requestAnimationFrame(() => {
      if (document.querySelector(wo)) return;
      const v = rt.current;
      rt.current = null;
      const x = document.activeElement;
      x && x !== document.body || v != null && v.isConnected && !v.disabled && v.focus();
    });
    return () => cancelAnimationFrame(f);
  }, [Pe, gt, $]);
  const [kt, oe] = S([]), [ft, bn] = S({}), Ft = k(null), We = k(0), [je, bt] = S({});
  z(() => {
    let f = !0;
    return Promise.all(
      Ei(_.objectFilter).map(
        async (v) => [
          String(v),
          (await ce(`/api/tags/${v}`)).name
        ]
      )
    ).then((v) => {
      f && bt(Object.fromEntries(v));
    }).catch(() => {
    }), () => {
      f = !1;
    };
  }, [_.objectFilter]);
  const Z = qe(
    () => Ci(_.objectFilter, je),
    [je, _.objectFilter]
  ), F = k(0), we = k(e);
  we.current = e;
  const He = q ?? e, Ye = qe(
    () => hn(He, _),
    [He, _]
  ), X = qe(
    () => bo(Ye, _.performerFocus),
    [Ye, _.performerFocus]
  ), tn = k(X);
  tn.current = X;
  const wn = k(Ye);
  wn.current = Ye;
  const [qt, at] = S("items"), [Le, Ke] = S(null), ct = k(null), nn = k("");
  function St(f) {
    const v = typeof f == "function" ? f(ct.current) : f;
    ct.current = v, Ke(v);
  }
  const [rn, yn] = S(!1), [Jt, Gn] = S(null), Be = k(null), lt = Ne(Ye) ? aa(Ye) : "", [N, A] = S(0), [re, Ee] = S(null);
  z(() => () => {
    var f;
    return (f = Be.current) == null ? void 0 : f.controller.abort();
  }, []), z(() => {
    const f = Be.current;
    !f || f.signature === lt || (f.controller.abort(), Be.current = null, yn(!1));
  }, [lt]), z(() => {
    var x;
    const f = ct.current;
    if (qt !== "performers" || !lt || ((x = Be.current) == null ? void 0 : x.signature) === lt || nn.current === lt || (f == null ? void 0 : f.signature) === lt && f.complete)
      return;
    const v = (f == null ? void 0 : f.signature) === lt ? f : null;
    Qt(f, (v == null ? void 0 : v.limit) ?? xa);
  }, [qt, lt, Le, Jt, rn]);
  const ve = _.performerFocus, me = JSON.stringify(
    Ne(Ye) ? Ye.occurrence.flagPerformerTagIds ?? [] : []
  );
  z(() => {
    if (!ve) {
      Ee(null);
      return;
    }
    let f = !0;
    const v = new Set(JSON.parse(me));
    return ce(
      `/api/performers/${ve}`
    ).then((x) => {
      f && Ee({
        id: ve,
        name: x.name,
        flags: (x.tags ?? []).filter((V) => v.has(V.id)).map((V) => V.name)
      });
    }).catch(() => {
    }), () => {
      f = !1;
    };
  }, [ve, me]);
  const Xe = go(e, _), Mt = go(e, na(e, _)), wt = ot || Pe || Qe, G = Number(_.filter.page);
  function Fe(f, v = !1) {
    tt.current || (w.current = "", ae.current = v, C.current = f, ie(f), ut(0), ze(!0), v || Lr(e.id, f), K((x) => x + 1));
  }
  function ye() {
    if (tt.current = !1, Bt(!1), et.current && he.current) {
      const f = he.current;
      he.current = null, Fe(f.query, f.startAtEnd);
    }
  }
  z(() => {
    const f = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const v = Za(
            we.current,
            new URLSearchParams(window.location.search)
          );
          tt.current ? he.current = v : Fe(v.query, v.startAtEnd);
        } catch (v) {
          _e(Gt(v));
        }
    };
    return window.addEventListener("popstate", f), () => window.removeEventListener("popstate", f);
  }, [e.id]), z(() => (a(ot || Pe || Qe || !!q), () => a(!1)), [ot, Pe, Qe, !!q, a]);
  async function an(f, v, x) {
    if (Ne(f)) {
      const se = await Os(
        f,
        Ft.current,
        v,
        x
      );
      return {
        items: se.items.map((le) => ({
          key: le.key,
          media: le.media,
          occurrence: le
        })),
        totalCount: se.totalCount
      };
    }
    const V = await Pr(
      f,
      { ...f.view.filter, page: v },
      x
    );
    return {
      items: V.items.map((se) => ({ key: String(se.id), media: se })),
      totalCount: V.totalCount
    };
  }
  function on(f, v, x, V = !1, se = !1) {
    if (!et.current || he.current) return;
    ne(!0), de(
      se ? f.items : Ma(f.items, C.current.startFrom === "end")
    ), ut(f.totalCount), Rn(x, V);
    const le = {
      ...C.current,
      filter: { ...C.current.filter, page: v }
    };
    C.current = le, ie(le), Lr(e.id, le);
  }
  function Rn(f, v = !1) {
    (f == null ? void 0 : f.key) !== (O == null ? void 0 : O.key) && (B.current = null), (f == null ? void 0 : f.media.id) !== (O == null ? void 0 : O.media.id) && ee(v && f ? f.media.id : null), J(f);
  }
  z(() => {
    if (w.current) return;
    const f = new AbortController();
    W.current = f;
    const v = ++F.current;
    return ze(!0), _e(""), Ge(""), B.current = null, ee(null), J(null), de([]), Zt(!1), (async () => {
      const x = bo(
        hn(we.current, C.current),
        C.current.performerFocus
      );
      Ft.current = Ne(x) ? await Ai(x, f.signal) : null;
      let V = Number(x.view.filter.page), se = await an(x, V, f.signal);
      const le = Math.max(
        1,
        Math.ceil(se.totalCount / Number(x.view.filter.perPage))
      );
      (ae.current || V > le) && (V = le, se = await an(x, V, f.signal)), ae.current = !1;
      const Ve = x.view.startFrom === "end" ? -1 : 1;
      for (; Ne(x) && !se.items.length && V + Ve >= 1 && V + Ve <= le && !f.signal.aborted; )
        V += Ve, se = await an(x, V, f.signal);
      if (v !== F.current || f.signal.aborted) return;
      const It = Ma(se.items, x.view.startFrom === "end");
      on(se, V, It[0] ?? null);
    })().catch((x) => {
      !f.signal.aborted && v === F.current && _e(Gt(x));
    }).finally(() => {
      !f.signal.aborted && v === F.current && (ne(!0), ze(!1));
    }), () => {
      f.abort(), F.current++;
    };
  }, [$, e.id]), z(() => {
    if (Se(null), !O) return;
    let f = !0;
    return Xt(d, O).then((v) => {
      f && (Se(v), oe(
        Ne(e) ? v.ids.filter((x) => e.occurrence.tagIds.includes(x)) : []
      ));
    }).catch((v) => {
      f && _e(`Could not load current tags. ${Gt(v)}`);
    }), () => {
      f = !1;
    };
  }, [O]), z(() => {
    if (!Ne(e) || e.actions.length)
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
      f && bn(Object.fromEntries(v));
    }).catch((v) => {
      f && _e(Gt(v));
    }), () => {
      f = !1;
    };
  }, [e]);
  async function Sr(f = !1, v = !1, x = !1) {
    var Fn;
    if (!O) return;
    const V = Y.findIndex((Ae) => Ae.key === O.key), se = _.startFrom === "end" ? -1 : 1, le = ((Fn = B.current) == null ? void 0 : Fn.key) === O.key ? B.current : { key: O.key, page: G, before: Y.slice(0, V + 1).map((Ae) => Ae.key), after: Y.slice(V + 1).map((Ae) => Ae.key) }, Ve = new Set(le.after), It = new Set(le.before), $n = Y.find((Ae) => {
      var Et;
      return Ve.has(Ae.key) || (se === 1 || G < le.page) && ((Et = B.current) == null ? void 0 : Et.key) === O.key && !It.has(Ae.key);
    });
    if (!f && $n) {
      Rn($n, x);
      return;
    }
    const dt = f ? It : new Set(Y.map((Ae) => Ae.key)), jt = 1100 - (Date.now() - We.current);
    jt > 0 && await new Promise((Ae) => window.setTimeout(Ae, jt));
    let De = se === -1 && !f ? Math.max(1, G - 1) : G;
    for (; et.current && !he.current; ) {
      let Ae = await an(X, De);
      const Et = Math.max(
        1,
        Math.ceil(Ae.totalCount / Number(_.filter.perPage))
      );
      De > Et && (De = Et, Ae = await an(X, De));
      const Qn = Ma(Ae.items, se === -1), un = new Map(Qn.map((Ot) => [Ot.key, Ot])), Mn = f ? le.after.flatMap((Ot) => {
        const $r = un.get(Ot);
        return $r ? [$r] : [];
      }) : [], ur = new Set(Mn.map((Ot) => Ot.key)), fr = f ? {
        ...Ae,
        items: [
          ...Mn,
          ...Qn.filter(
            (Ot) => Ot.key !== O.key && !ur.has(Ot.key)
          )
        ]
      } : Ae;
      if (v) {
        B.current = le, on(fr, De, O, !1, f);
        return;
      }
      const Or = se === -1 && G === 1 && !f ? void 0 : fr.items.find(
        (Ot) => !dt.has(Ot.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(f && se === -1 && De === le.page) || Ve.has(Ot.key))
      );
      if (Or || (se === -1 ? De <= 1 : De >= Et)) {
        on(
          fr,
          De,
          Or ?? null,
          x,
          f
        ), Or || Ge(
          Ae.totalCount ? `Reached the end in this direction. Matching items remain available from the ${h.queue} pages.` : `No matching ${h.many}.`
        );
        return;
      }
      De += se;
    }
  }
  async function zt(f, v = !1, x = !1, V = !1) {
    if (q || !O || tt.current || Pe || Qe && !x)
      return;
    const se = x || V || !!(f != null && f.steps.length), le = se && !v;
    if (se && (!t || !Ce) || f && Dn(f) && !n) return;
    tt.current = !0, Bt(!0), _e(""), Ge("");
    const Ve = Y.findIndex((dt) => dt.key === O.key), It = se && !v && Ve >= 0 ? Y[Ve + 1] ?? null : null;
    It && (de(
      (dt) => dt.filter((jt) => jt.key !== O.key)
    ), Rn(It, !0));
    let $n = !1;
    try {
      if (se) {
        const dt = await Xt(d, O);
        if (f)
          await Cd(X, O, f);
        else {
          const De = V && Ne(e) ? e.occurrence.tagIds.filter((Et) => dt.ids.includes(Et)) : st.current, Ae = Nr(De, V ? kt : Nt);
          await Ri(X, O, Ae);
        }
        We.current = Date.now();
        const jt = await Xt(d, O);
        It || Se(jt), $n = !0, Zt(!1), Ge("Tags saved."), O.occurrence && (Cr(O.occurrence.performer.id), A((De) => De + 1));
      }
      if (!et.current || he.current) return;
      se ? await Sr(!0, v, le) : v || await Sr(), v && x && requestAnimationFrame(() => {
        var dt;
        return (dt = At.current) == null ? void 0 : dt.focus();
      });
    } catch (dt) {
      if (_e(
        $n ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Gt(dt)}` : se ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Gt(dt)}` : `Could not advance. ${Gt(dt)}`
      ), se && !$n) {
        It && (de(Y), ee(null), Te((jt) => jt + 1), J(O)), We.current = Date.now();
        try {
          Se(await Xt(d, O));
        } catch {
          Se(null), _e(
            (jt) => `${jt} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      ye();
    }
  }
  const Tt = !Qe && !q && !gt && !Dt && (O != null || Pe || ot);
  mi({
    surface: "local",
    enabled: Tt,
    actionCount: e.actions.length,
    onAction: (f, v) => {
      const x = e.actions[f];
      x && zt(x, v);
    },
    onFind: () => en(!0)
  });
  const _t = (f) => ot || Pe || !Ce || !!q || !t && f.steps.length > 0 || !n && Dn(f);
  function In() {
    !i || q || tt.current || Qe || (L.current = document.activeElement, R.current = {
      error: nt,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(C.current),
      items: Y,
      current: O,
      total: it,
      targets: Ft.current,
      stayedCursor: B.current
    }, I(structuredClone(e)), j(""), Ge(""), _e(""));
  }
  z(() => {
    if (!o) {
      U.current = 0;
      return;
    }
    o !== U.current && te && !Pe && (U.current = o, In(), s == null || s());
  }, [o, Pe, te]);
  function sn() {
    I(null), j(""), requestAnimationFrame(() => {
      const f = L.current;
      f != null && f.isConnected && f !== document.body && f.focus();
    });
  }
  function Er() {
    var v;
    const f = R.current;
    !f || ot || ((v = W.current) == null || v.abort(), F.current++, C.current = f.query, ie(f.query), de(f.items), J(f.current), ut(f.total), Ft.current = f.targets, B.current = f.stayedCursor, ze(!1), _e(f.error), Ge(""), window.history.replaceState(window.history.state, "", f.url), sn());
  }
  async function ht() {
    if (!q || !i || tt.current) return;
    const f = hn(
      { ...q, name: q.name.trim() },
      na(we.current, C.current)
    ), v = jr(f);
    if (v) {
      j(v);
      return;
    }
    tt.current = !0, Bt(!0), j("");
    try {
      if (await i(f) === !1) throw new Error("Could not save review.");
      sn(), Ge("Review saved.");
    } catch (x) {
      j(
        "Could not save review. Your edits are still open. " + Gt(x)
      );
    } finally {
      ye();
    }
  }
  async function yt() {
    if (!i || tt.current) return;
    const f = na(we.current, C.current), v = hn(we.current, {
      ...f,
      filter: { ...f.filter, page: 1 }
    });
    tt.current = !0, Bt(!0), _e("");
    try {
      if (await i(v) === !1) throw new Error("Could not save review.");
      Ge("Queue saved to this review.");
    } catch (x) {
      _e("Could not save queue. " + Gt(x));
    } finally {
      ye();
    }
  }
  const Me = _.performerScope, vt = (f) => {
    const { performerFocus: v, ...x } = C.current, V = v && !("targetMode" in f || "performerIds" in f || "performerFilter" in f);
    Fe({
      ...x,
      ...V ? { performerFocus: v } : {},
      filter: { ...x.filter, page: 1 },
      performerScope: { ...Me, ...f }
    });
  };
  async function Qt(f, v) {
    var se;
    const x = wn.current;
    if (!Ne(x)) return;
    (se = Be.current) == null || se.controller.abort();
    const V = {
      signature: aa(x),
      controller: new AbortController()
    };
    Be.current = V, nn.current = "", yn(!0), Gn(null);
    try {
      const le = await Xd(x, f, v, V.controller.signal, {
        onProgress: (Ve) => {
          Be.current === V && St(Ve);
        }
      });
      Be.current === V && St(le);
    } catch (le) {
      Be.current === V && !V.controller.signal.aborted && (nn.current = V.signature, Gn({ signature: V.signature, message: Gt(le) }));
    } finally {
      Be.current === V && (Be.current = null, yn(!1));
    }
  }
  function Rt() {
    var f;
    (f = Be.current) == null || f.controller.abort(), Be.current = null, yn(!1), St((v) => v && { ...v, partial: !0, complete: !1 });
  }
  async function Cr(f) {
    var se;
    const v = wn.current;
    if (!Ne(v)) return;
    if (Be.current) {
      Rt();
      return;
    }
    const x = aa(v);
    if (((se = ct.current) == null ? void 0 : se.signature) !== x || ct.current.partial) return;
    const V = 1100 - (Date.now() - We.current);
    V > 0 && await new Promise((le) => window.setTimeout(le, V));
    try {
      const le = await js(v, f);
      if (Be.current) {
        Rt();
        return;
      }
      St(
        (Ve) => (Ve == null ? void 0 : Ve.signature) === x ? Zd(Ve, f, le) : Ve
      );
    } catch {
      St(
        (le) => (le == null ? void 0 : le.signature) === x ? { ...le, partial: !0, complete: !1 } : le
      );
    }
  }
  const Kn = _.performerFocus ? Le == null ? void 0 : Le.candidates.find((f) => f.id === _.performerFocus) : void 0, Re = (re == null ? void 0 : re.id) === _.performerFocus ? re : Kn ?? null;
  function cn(f) {
    if (tt.current) return;
    const v = {
      ...C.current,
      performerFocus: f,
      filter: { ...C.current.filter, page: 1 }
    };
    Fe(v, v.startFrom === "end"), at("items");
  }
  function Ar() {
    const { performerFocus: f, ...v } = C.current;
    Fe(
      { ...v, filter: { ...v.filter, page: 1 } },
      v.startFrom === "end"
    );
  }
  const vn = k(null);
  vn.current ?? (vn.current = ms());
  const kr = vn.current, ge = ps(He.actions), or = qe(
    () => He.actions.flatMap((f) => f.steps.flatMap((v) => v.tagIds)),
    [He.actions]
  ), On = k(null);
  z(() => {
    const f = On.current, v = f == null ? void 0 : f.querySelector('[aria-current="true"]');
    if (!f || !v) return;
    const x = f.getBoundingClientRect(), V = v.getBoundingClientRect();
    V.top < x.top ? f.scrollTop -= x.top - V.top : V.bottom > x.bottom && (f.scrollTop += V.bottom - x.bottom);
  }, [O == null ? void 0 : O.key, qt]);
  const Tr = k(null), ln = k(null);
  z(() => {
    var x, V;
    const f = ln.current;
    if (!f) return;
    ln.current = null;
    const v = [...((x = Tr.current) == null ? void 0 : x.querySelectorAll(".dq-partner")) ?? []];
    (V = v.find((se) => se.dataset.partnerKey === f) ?? v[0]) == null || V.focus();
  }, [O == null ? void 0 : O.key]);
  const sr = ot || Pe || Qe || !!q, Nn = qe(
    () => q ? hn(q, na(e, _)) : null,
    [q, e, _]
  ), Bn = qe(
    () => Nn != null && wr(nr(Nn)) !== wr(nr(e)),
    [Nn, e]
  );
  function Wt() {
    O ? Xt(d, O).then(Se).catch((f) => _e(Gt(f))) : Fe(C.current);
  }
  const Vn = nt ? /* @__PURE__ */ c("p", { role: "alert", children: [
    nt,
    " ",
    /* @__PURE__ */ r("button", { type: "button", disabled: ot, onClick: Wt, children: O ? "Reload tags" : "Retry queue" })
  ] }) : null, dn = ot || Pe || O != null && !Ce, xe = Math.max(1, Number(_.filter.perPage) || 1), cr = k(1);
  Pe || (cr.current = Math.max(1, Math.ceil(it / xe)));
  const Rr = cr.current, Jn = Me && O ? Y.filter(
    (f) => f.media.id === O.media.id && f.key !== O.key
  ) : [], zn = O != null && O.occurrence && O.occurrence.performer.id === _.performerFocus ? (Re == null ? void 0 : Re.flags) ?? [] : O != null && O.occurrence ? ((Ir = Le == null ? void 0 : Le.candidates.find((f) => f.id === O.occurrence.performer.id)) == null ? void 0 : Ir.flags) ?? [] : [], lr = (f) => {
    var v;
    return f.title || ((v = f.files[0]) == null ? void 0 : v.basename) || `${d === "audio" ? "Audio" : "Video"} ${f.id}`;
  }, dr = O ? cu(O.media, d) : "";
  return /* @__PURE__ */ c(
    "section",
    {
      className: `dq-review-workspace${d === "audio" ? " dq-audio" : ""}`,
      "aria-label": Me ? d === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : d === "audio" ? "Audio review" : "Video review",
      onClickCapture: (f) => {
        var V;
        const v = f.target instanceof Element ? f.target.closest("button") : null, x = (v == null ? void 0 : v.getAttribute("aria-label")) ?? ((V = v == null ? void 0 : v.textContent) == null ? void 0 : V.trim()) ?? "";
        v && !v.closest(wo) && /^(Filters|Edit filter:|Edit criteria)/.test(x) && (rt.current = v);
      },
      children: [
        /* @__PURE__ */ r(
          Cs,
          {
            name: e.name,
            description: e.description,
            entityType: $e(e),
            onBack: l == null ? void 0 : l.onBack,
            backDisabled: sr || !!(l != null && l.busy),
            onEdit: q ? () => {
              var f;
              return (f = M.current) == null ? void 0 : f.focus();
            } : In,
            editDisabled: !q && (sr || !i || !!(l != null && l.busy)),
            editing: !!q,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: ot || Qe, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: d === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ r(
                  Dr,
                  {
                    filter: _.filter,
                    objectFilter: Z,
                    criteriaDefinitions: d === "audio" ? To : ni,
                    customFieldEntityType: d,
                    totalCount: it,
                    sortOptions: d === "audio" ? Ac : Ro,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(
                      As,
                      {
                        page: Math.min(Math.max(1, G || 1), Rr),
                        pages: Rr,
                        onPage: (f) => Fe({
                          ...C.current,
                          filter: Pt(
                            { ...C.current.filter, page: f },
                            d
                          )
                        })
                      }
                    ),
                    onFilterChange: (f) => {
                      (f.sort !== C.current.filter.sort || f.direction !== C.current.filter.direction) && (f = { ...f, sorts: void 0 }), Fe({
                        ...C.current,
                        filter: Pt(f, d)
                      });
                    },
                    onObjectFilterChange: (f) => {
                      Fe({
                        ...C.current,
                        objectFilter: Ts(
                          f,
                          je,
                          C.current.objectFilter
                        ),
                        filter: { ...C.current.filter, page: 1 }
                      });
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ c(pe, { children: [
              Me && /* @__PURE__ */ r(
                Wd,
                {
                  scope: Me,
                  disabled: ot || Qe,
                  editing: !!q,
                  onChange: vt,
                  onEditCriteria: () => Tn(!0)
                }
              ),
              Ne(X) && t && /* @__PURE__ */ r(
                Ud,
                {
                  review: X,
                  disabled: wt || !!q,
                  performerFlags: _.performerFocus ? Re == null ? void 0 : Re.flags : void 0,
                  trees: ge,
                  onOpen: () => {
                    tt.current = !0, Bt(!0);
                  },
                  onWrite: () => {
                    We.current = Date.now();
                  },
                  onClose: (f) => {
                    if (f) {
                      We.current = Date.now();
                      const v = C.current.performerFocus;
                      v ? Cr(v) : Rt(), A((x) => x + 1), new Promise((x) => window.setTimeout(x, 1100)).then(() => {
                        ye(), et.current && (w.current || ze(!0), K((x) => x + 1));
                      });
                    } else ye();
                  }
                }
              ),
              (l == null ? void 0 : l.onGrid) && /* @__PURE__ */ r(
                ks,
                {
                  mode: "single",
                  disabled: sr || !!l.busy,
                  onChange: () => {
                    var f;
                    return (f = l.onGrid) == null ? void 0 : f.call(l);
                  }
                }
              ),
              (l == null ? void 0 : l.moreItems) && /* @__PURE__ */ r(
                Ni,
                {
                  disabled: sr,
                  items: l.moreItems({
                    onSelect: In,
                    disabled: !i
                  })
                }
              )
            ] }),
            chipsStart: _.performerFocus ? /* @__PURE__ */ c("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ r(
                br,
                {
                  performer: {
                    id: _.performerFocus,
                    name: (Re == null ? void 0 : Re.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ c("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ r("strong", { children: (Re == null ? void 0 : Re.name) ?? `performer ${_.performerFocus}` })
              ] }),
              Re != null && Re.flags.length ? /* @__PURE__ */ c(
                "span",
                {
                  className: "dq-focus-flag",
                  title: `Flagged: ${Re.flags.join(", ")}`,
                  children: [
                    /* @__PURE__ */ r(ia, { "aria-hidden": "true" }),
                    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
                      "Flagged: ",
                      Re.flags.join(", ")
                    ] })
                  ]
                }
              ) : null,
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: wt,
                  onClick: Ar,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            chipsEnd: q ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : Xe ? /* @__PURE__ */ c(pe, { children: [
              /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
              Mt && /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: "dq-text-button",
                  title: "Save the current queue criteria to this review",
                  disabled: wt || !i,
                  onClick: () => void yt(),
                  children: [
                    /* @__PURE__ */ r(jo, { "aria-hidden": "true" }),
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
                  disabled: wt,
                  onClick: () => {
                    const f = ar(e);
                    Fe(f, f.startFrom === "end");
                  },
                  children: [
                    /* @__PURE__ */ r(Uo, { "aria-hidden": "true" }),
                    "Reset"
                  ]
                }
              )
            ] }) : void 0
          }
        ),
        l == null ? void 0 : l.notices,
        /* @__PURE__ */ c("div", { className: "dq-review-area", children: [
          q && Nn && /* @__PURE__ */ r(
            Es,
            {
              drawerRef: M,
              draft: Nn,
              onChange: (f) => I(f),
              direction: _.startFrom,
              onDirectionChange: (f) => Fe({ ...C.current, startFrom: f }),
              tagGroups: su,
              trees: ge,
              saving: ot,
              saveDisabled: Pe,
              error: E,
              dirty: Bn,
              criteriaChanged: Mt,
              notices: Vn && /* @__PURE__ */ r("div", { className: "dq-review-feedback", children: Vn }),
              onSave: () => void ht(),
              onCancel: Er
            }
          ),
          /* @__PURE__ */ r("div", { className: "dq-review-main", children: /* @__PURE__ */ c("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ c("div", { className: "dq-review-stage", children: [
              O ? /* @__PURE__ */ c(pe, { children: [
                /* @__PURE__ */ c("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ r("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ c(
                    "a",
                    {
                      href: `/${d}/${O.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${h.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ r("span", { children: lr(O.media) }),
                        /* @__PURE__ */ r(Go, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  dr && /* @__PURE__ */ r("span", { className: "dq-stage-meta", children: dr })
                ] }),
                /* @__PURE__ */ c("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ r("div", { className: "dq-player-frame", children: [O, Lt].filter(Boolean).map((f) => {
                    var V, se, le, Ve, It;
                    const v = f, x = v.key === O.key;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        className: x ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": x ? void 0 : !0,
                        inert: x ? void 0 : !0,
                        children: d === "audio" ? /* @__PURE__ */ r(
                          kc,
                          {
                            streamUrl: Va("audio", v.media.id),
                            format: ((V = v.media.files[0]) == null ? void 0 : V.format) ?? "",
                            title: b(v.media),
                            coverUrl: x ? Ba("audio", v.media) : void 0,
                            duration: ((se = v.media.files[0]) == null ? void 0 : se.duration) ?? 0,
                            autostart: x && D === v.media.id
                          }
                        ) : /* @__PURE__ */ r(
                          Io,
                          {
                            videoId: v.media.id,
                            streamUrl: Va("video", v.media.id),
                            posterUrl: x ? Ba("video", v.media) : void 0,
                            duration: ((le = v.media.files[0]) == null ? void 0 : le.duration) ?? 0,
                            format: (Ve = v.media.files[0]) == null ? void 0 : Ve.format,
                            audioCodec: (It = v.media.files[0]) == null ? void 0 : It.audioCodec,
                            extensionSurface: x ? "quick-view" : void 0,
                            autostart: x && D === v.media.id,
                            keyboardShortcutsEnabled: x,
                            showAbLoop: x,
                            clip: v.media.parentVideoId != null ? {
                              start: v.media.clipStartSec ?? 0,
                              end: v.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${v.media.id}:${be}`
                    );
                  }) }),
                  d === "audio" && /* @__PURE__ */ r(
                    Kd,
                    {
                      details: O.media.details,
                      label: h.one
                    },
                    O.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ r("p", { role: "status", className: "dq-stage-status", children: Pe ? "Loading review…" : it ? "Reached the end in this direction." : `No matching ${h.many}.` }),
              He.actions.length > 0 ? /* @__PURE__ */ r(
                Ul,
                {
                  actions: He.actions,
                  mediaKind: d,
                  isDisabled: (f) => Qe || _t(f),
                  busy: dn,
                  tags: Ce,
                  trees: ge,
                  preview: kr,
                  onApply: (f, v) => void zt(f, v),
                  onFind: () => en(!0),
                  findDisabled: Qe || !!q,
                  paused: !!q
                }
              ) : Ne(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ c(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || ot || Qe || !Ce || !!q || !O,
                  children: [
                    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((f) => /* @__PURE__ */ c("label", { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: kt.includes(f),
                          onChange: (v) => oe(
                            e.occurrence.multiple ? v.target.checked ? [...kt, f] : kt.filter((x) => x !== f) : [f]
                          )
                        }
                      ),
                      ft[f] ?? "Loading tag…"
                    ] }, f)),
                    /* @__PURE__ */ c("div", { className: "dq-row", children: [
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => oe([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void zt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void zt(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ c("div", { className: "dq-panel-body", ref: Tr, children: [
                O && /* @__PURE__ */ c(pe, { children: [
                  /* @__PURE__ */ c("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ c("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: O.occurrence ? O.occurrence.performer.name : `this ${h.one}` })
                    ] }),
                    /* @__PURE__ */ c("div", { className: "dq-reviewing-who", children: [
                      O.occurrence && /* @__PURE__ */ r(br, { performer: O.occurrence.performer }),
                      /* @__PURE__ */ c("div", { children: [
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: O.occurrence ? O.occurrence.performer.name : `This ${h.one}` }),
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-note", children: Me ? `Tags apply to this performer in this ${h.queue}` : `Tags apply to the whole ${h.one}` })
                      ] })
                    ] }),
                    zn.length > 0 && /* @__PURE__ */ c("p", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
                      /* @__PURE__ */ r(ia, { "aria-hidden": "true" }),
                      "Flagged: ",
                      zn.join(", ")
                    ] })
                  ] }),
                  Jn.length > 0 && /* @__PURE__ */ c(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${h.queue}`,
                      children: [
                        /* @__PURE__ */ c("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          h.queue
                        ] }),
                        /* @__PURE__ */ r("div", { className: "dq-partners", children: Jn.map((f) => {
                          var v, x, V;
                          return /* @__PURE__ */ c(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (v = f.occurrence) == null ? void 0 : v.performer.name,
                              "aria-label": (x = f.occurrence) == null ? void 0 : x.performer.name,
                              "data-partner-key": f.key,
                              disabled: wt,
                              onClick: () => {
                                ln.current = O.key, Rn(f), _e("");
                              },
                              children: [
                                f.occurrence && /* @__PURE__ */ r(br, { performer: f.occurrence.performer }),
                                /* @__PURE__ */ r("span", { children: (V = f.occurrence) == null ? void 0 : V.performer.name })
                              ]
                            },
                            f.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ r(
                    du,
                    {
                      tags: Ce,
                      preview: kr,
                      showPreview: !Qe,
                      trees: ge,
                      actionTagIds: or,
                      label: `Current ${Me ? "occurrence" : h.one} tags`
                    }
                  ),
                  Qe && /* @__PURE__ */ c(
                    "fieldset",
                    {
                      ref: Vt,
                      disabled: ot,
                      className: "dq-panel-section dq-tag-editor",
                      children: [
                        /* @__PURE__ */ c("legend", { className: "dq-eyebrow", children: [
                          "Edit ",
                          Me ? "occurrence" : h.one,
                          " tags"
                        ] }),
                        /* @__PURE__ */ r(
                          Cn,
                          {
                            entityType: "tag",
                            values: Nt,
                            onChange: Un,
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
                              disabled: !Ce,
                              onClick: () => void zt(void 0, !0, !0),
                              children: "Save"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              disabled: !Ce,
                              onClick: () => void zt(void 0, !1, !0),
                              children: "Save & next"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              onClick: () => {
                                Zt(!1), requestAnimationFrame(() => {
                                  var f;
                                  return (f = At.current) == null ? void 0 : f.focus();
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
                Ne(Ye) && _.performerFocus && /* @__PURE__ */ r(
                  xd,
                  {
                    review: Ye,
                    performerId: _.performerFocus,
                    revision: N
                  }
                )
              ] }),
              /* @__PURE__ */ c("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ c("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !q && Vn,
                  gn && /* @__PURE__ */ r("p", { role: "status", children: gn })
                ] }),
                !t && /* @__PURE__ */ r("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                O && /* @__PURE__ */ c("div", { className: "dq-panel-actions", "aria-busy": dn || void 0, children: [
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      ref: At,
                      className: "dq-button",
                      disabled: wt || !!q || !t || !Ce,
                      onClick: () => {
                        st.current = [...Ce.ids], Un([...Ce.ids]), Zt(!0);
                      },
                      children: [
                        /* @__PURE__ */ r(Lo, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: wt || !!q,
                      onClick: () => void zt(),
                      children: [
                        /* @__PURE__ */ r(Uc, { "aria-hidden": "true" }),
                        "Skip",
                        Me ? " performer" : ` ${h.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              Me && /* @__PURE__ */ c(
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
                        "aria-pressed": qt === "items",
                        onClick: () => at("items"),
                        children: d === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": qt === "performers",
                        onClick: () => at("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              Me && qt === "performers" ? /* @__PURE__ */ r(
                Bd,
                {
                  ranking: (Le == null ? void 0 : Le.signature) === lt ? Le : null,
                  busy: rn,
                  error: (Jt == null ? void 0 : Jt.signature) === lt ? Jt.message : "",
                  focus: _.performerFocus,
                  disabled: wt,
                  labels: h,
                  onFocus: cn,
                  onMore: () => {
                    const f = ct.current;
                    f && Qt(f, f.limit + xa);
                  },
                  onRefresh: () => {
                    St(null), Qt(null, xa);
                  }
                }
              ) : /* @__PURE__ */ r("div", { className: "dq-queue-list", ref: On, children: Y.map((f) => {
                var x;
                const v = (O == null ? void 0 : O.key) === f.key;
                return /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: m(f),
                    "aria-label": m(f),
                    "aria-current": v ? "true" : void 0,
                    disabled: wt,
                    onClick: () => {
                      Rn(f), _e(""), Ge("");
                    },
                    children: [
                      /* @__PURE__ */ r(lu, { media: f.media, kind: d }),
                      /* @__PURE__ */ c("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: b(f.media) }),
                        /* @__PURE__ */ c("span", { className: "dq-queue-row-meta", children: [
                          f.occurrence && /* @__PURE__ */ c(pe, { children: [
                            /* @__PURE__ */ r(br, { performer: f.occurrence.performer }),
                            /* @__PURE__ */ r("span", { className: "dq-queue-row-performer", children: f.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ r("span", { className: "dq-queue-row-detail", children: [
                            f.media.date,
                            f.occurrence ? "" : (x = f.media.files[0]) != null && x.duration ? Oo(f.media.files[0].duration) : ""
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
        Me && /* @__PURE__ */ r(
          Tc,
          {
            open: gt,
            onClose: () => Tn(!1),
            criteria: ti,
            activeFilter: Me.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (f) => {
              Tn(!1), vt({ performerFilter: f });
            }
          }
        ),
        Dt && /* @__PURE__ */ r(
          wi,
          {
            actions: e.actions,
            trees: ge,
            isDisabled: (f) => _t(f),
            onApply: (f, v) => {
              en(!1), zt(f, v);
            },
            onClose: () => en(!1)
          }
        )
      ]
    }
  );
}
const Vs = "data-quality.reviews-sort.v1", fu = { sort: "name", direction: "asc" };
function hu() {
  try {
    const e = JSON.parse(localStorage.getItem(Vs) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return fu;
}
function pu(e) {
  try {
    localStorage.setItem(
      Vs,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function Js(e, t, n, a) {
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
function Pa(e, t) {
  const n = $e(e), a = mn(li(n)), i = n === "tag" ? "tag" : Ne(e) ? a.queue : a.one;
  return t === 1 ? i : `${i}s`;
}
function mu({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      Pa(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      "Matching ",
      Pa(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ c(pe, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      Pa(e, t)
    ] })
  ] });
}
function gu({
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
  onOpen: b,
  onNew: m,
  onImport: y,
  onExportAll: w,
  rowMenuItems: q
}) {
  const I = k(null), E = qe(
    () => Js(e, t, n, a),
    [e, t, n, a]
  ), j = e.every((R) => t[R.id] !== void 0), M = a === "asc" ? "ascending" : "descending";
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
              var R;
              return (R = I.current) == null ? void 0 : R.click();
            },
            children: [
              /* @__PURE__ */ r(Gc, { "aria-hidden": "true" }),
              "Import"
            ]
          }
        ),
        /* @__PURE__ */ r(
          "input",
          {
            ref: I,
            type: "file",
            accept: "application/json,.json",
            hidden: !0,
            tabIndex: -1,
            onChange: (R) => {
              var W;
              const L = (W = R.target.files) == null ? void 0 : W[0];
              R.target.value = "", L && y(L);
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
            onClick: w,
            children: [
              /* @__PURE__ */ r(Ko, { "aria-hidden": "true" }),
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
              /* @__PURE__ */ r(ri, { "aria-hidden": "true" }),
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
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: j ? e.some((R) => t[R.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ c("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ c("label", { children: [
            /* @__PURE__ */ r("span", { children: "Sort by" }),
            /* @__PURE__ */ c(
              "select",
              {
                className: "dq-select",
                value: n,
                onChange: (R) => i(R.target.value),
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
              children: a === "asc" ? /* @__PURE__ */ r(Kc, { "aria-hidden": "true" }) : /* @__PURE__ */ r(Bc, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ c("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ c("tr", { children: [
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
        /* @__PURE__ */ r("tbody", { children: E.map((R) => {
          const L = $e(R);
          return /* @__PURE__ */ c("tr", { children: [
            /* @__PURE__ */ r("td", { children: /* @__PURE__ */ c(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(R.id)}`,
                "data-review-id": R.id,
                onClick: (W) => {
                  W.button !== 0 || W.metaKey || W.ctrlKey || W.shiftKey || W.altKey || (W.preventDefault(), b(R.id));
                },
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ r(Ns, { entityType: L }) }),
                  /* @__PURE__ */ c("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ r("span", { className: "dq-reviews-name", children: R.name }),
                    R.description && /* @__PURE__ */ r("span", { className: "dq-reviews-description", title: R.description, children: R.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-type", children: vs[L] }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-count", children: /* @__PURE__ */ r(mu, { review: R, count: t[R.id] }) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ r(Ni, { label: `Actions for ${R.name}`, items: q(R) }) })
          ] }, R.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ c("div", { className: "dq-empty", children: [
      /* @__PURE__ */ r(fa, { "aria-hidden": "true" }),
      /* @__PURE__ */ r("p", { children: "No reviews yet." }),
      /* @__PURE__ */ r("p", { children: l ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function zs(e, { id: t, name: n, description: a }) {
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
function bu({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: a
}) {
  const { review: i, saving: o, error: s } = e, l = k(null), d = k(null), h = k(o);
  h.current = o;
  const p = k(null), b = Ct();
  z(() => {
    var w;
    return p.current ?? (p.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), l.current && !l.current.open && l.current.showModal(), (w = d.current) == null || w.focus(), () => {
      var q;
      (q = p.current) != null && q.isConnected && p.current.focus({ preventScroll: !0 });
    };
  }, []);
  const m = k(o);
  z(() => {
    var I, E;
    const w = document.activeElement, q = !w || w === document.body || !((I = l.current) != null && I.contains(w));
    s && (!i.name.trim() || m.current && !o && q) && ((E = d.current) == null || E.focus()), m.current = o;
  }, [s, o]);
  const y = () => {
    h.current || a();
  };
  return /* @__PURE__ */ r(
    "dialog",
    {
      ref: l,
      className: "dq-form-dialog",
      "aria-labelledby": b,
      "aria-modal": "true",
      onCancel: (w) => {
        w.preventDefault(), y();
      },
      onClose: () => {
        var w;
        h.current ? (w = l.current) == null || w.showModal() : a();
      },
      children: /* @__PURE__ */ c(
        "form",
        {
          onSubmit: (w) => {
            w.preventDefault(), h.current || n();
          },
          children: [
            /* @__PURE__ */ c("header", { className: "dq-form-dialog-header", children: [
              /* @__PURE__ */ r("h2", { id: b, children: "New review" }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-icon-button",
                  "aria-label": "Close dialog",
                  title: "Close",
                  disabled: o,
                  onClick: y,
                  children: /* @__PURE__ */ r(Gr, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ c("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ r("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ c("fieldset", { className: "dq-form-dialog-fields", disabled: o, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ r(
                  Ss,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (w) => {
                      w !== $e(i) && t(zs(w, i));
                    },
                    nameRef: d
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ c("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ r("button", { type: "button", className: "dq-text-button", onClick: () => vi(i), children: "Export draft" }),
              /* @__PURE__ */ r("span", { className: "dq-form-dialog-space" }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: o, onClick: y, children: "Cancel" }),
              /* @__PURE__ */ r("button", { type: "submit", className: "dq-button primary", "aria-disabled": o || void 0, children: o ? "Creating…" : "Create & configure" })
            ] })
          ]
        }
      )
    }
  );
}
const wu = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function yu(e, t, n, a) {
  return Bs(
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
function yo(e, t) {
  return $e(t) === "video" && Jr(t.view.objectFilter, e.view.objectFilter).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function vo(e, t) {
  return rr(
    JSON.parse(Ln(nr(e))),
    JSON.parse(Ln(nr(t)))
  );
}
const La = 180;
function No(e) {
  return $e(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function qo(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function So() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Da(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  ba.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const a = n.toString();
  Ks(`${window.location.pathname}${a ? `?${a}` : ""}`, { openingFromList: t });
}
function vu(e) {
  return Pt({ ...e, page: 1 });
}
function Qs(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function gr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Nu = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(ai, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ r(zc, { "aria-hidden": "true" }) }
], qu = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(ai, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ r(Jc, { "aria-hidden": "true" }) }
], Su = [], Ws = "(min-width: 900px)";
function Eu(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(Ws);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function Cu() {
  return typeof window.matchMedia == "function" && window.matchMedia(Ws).matches;
}
function Au({
  onNavigate: e
}) {
  const [t, n] = S([]), [a] = S(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = S(""), [s, l] = S(!0), [d, h] = S(""), [p, b] = S(!1), [m, y] = S(!1), [w, q] = S(!1), [I, E] = S(!1), [j, M] = S([]), [R, L] = S(""), [W, te] = S(!0), [ne, U] = S("account"), [_, ie] = S(""), [C, $] = S(""), [K, ae] = S(!1), [Y, de] = S(!1), [O, J] = S(""), [B, D] = S(So), ee = k(B);
  ee.current = B;
  const [be, Te] = S({}), Lt = k(be);
  Lt.current = be;
  const it = k(t);
  it.current = t;
  const ut = k(s);
  ut.current = s;
  const Pe = k(!1), ze = k(!0);
  z(() => (ze.current = !0, () => {
    ze.current = !1;
  }), []);
  const [ot, Bt] = S(!B);
  ot !== !B && (Bt(!B), B || Te({}));
  const [tt, et] = S(hu), { sort: he, direction: nt } = tt, _e = (u) => {
    const g = { ...tt, ...u };
    et(g), pu(g);
  }, gn = k(null), Ge = k(null), [Ce, Se] = S(null), [Qe, Zt] = S(!1), [Nt, Un] = S(!1), [st, At] = S(null), [rt, Vt] = S(null), gt = !!st || !!rt, Tn = k(gt);
  Tn.current = gt;
  const Dt = Qe || !!rt || Nt, [en, kt] = S(0), [oe, ft] = S(null), bn = k(null), Ft = k(null), We = k(null), [je, bt] = S(
    null
  ), Z = t.find((u) => u.id === B) ?? null, F = qe(
    () => (je == null ? void 0 : je.id) === B && Z ? { ...Z, view: {
      ...Z.view,
      filter: je.view.filter,
      objectFilter: je.view.objectFilter,
      searchMode: je.view.searchMode,
      startFrom: je.view.startFrom
    } } : Z,
    [je, B, Z]
  ), we = F ? $e(F) : "video", He = li(we), Ye = F ? Ne(F) : !1, X = we === "video" ? F : null, tn = Ye && !!(F != null && F.actions.some(Dn)), wn = !!X || we === "audio" || tn, [qt, at] = S(null), Le = (qt == null ? void 0 : qt.id) === (F == null ? void 0 : F.id) ? qt == null ? void 0 : qt.mode : (F == null ? void 0 : F.view.reviewMode) ?? "single", Ke = Ye || we === "audio" || we === "video" && Le === "single", [ct, nn] = S(0), St = k(-1), rn = k(!1), yn = k(Ke);
  yn.current = Ke, z(() => {
    const u = () => {
      const g = yn.current;
      if (!g && ln.current) {
        rn.current = !0;
        return;
      }
      St.current = -1, Mi(), g || nn((T) => T + 1);
    };
    return window.addEventListener("popstate", u), () => window.removeEventListener("popstate", u);
  }, []);
  const Jt = He === "audio" ? m : p, Gn = we === "tag" ? "Tag" : He === "audio" ? "Audio" : "Video", Be = we === "tag" ? w : Jt, lt = k(
    null
  ), N = eu(X), [A, re] = S({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Ee, ve] = S({
    page: 1,
    perPage: 40
  }), [me, Xe] = S({ items: [], totalCount: 0 }), [Mt, wt] = S(B);
  Mt !== B && (wt(B), Xe({ items: [], totalCount: 0 }), de(!1));
  const [G, Fe] = S(!1), [ye, an] = S(""), [on, Rn] = S(!1), [Sr, zt] = S(!1), [Tt, _t] = S(() => /* @__PURE__ */ new Set()), In = k(Tt);
  In.current = Tt;
  const sn = k(/* @__PURE__ */ new Map()), Er = (F == null ? void 0 : F.view.selectAllOnLoad) === !0, [ht, yt] = S(null), Me = k(ht);
  Me.current = ht;
  const [vt, Qt] = S(!1), Rt = k(vt);
  Rt.current = vt;
  const Cr = k(null), [Kn, Re] = S(!1), [cn, Ar] = S("grid"), [vn, kr] = S(La), [ge, or] = S(!1), [On, Tr] = S(!1), ln = k(!1), [sr, Nn] = S(""), [Bn, Wt] = S(""), [Vn, dn] = S(""), [xe, cr] = S(null), [Rr, Jn] = S(""), [zn, lr] = S(!1), [dr, Ir] = S({}), f = k(/* @__PURE__ */ new Map()), v = k(null), x = k(null), V = !!F, se = Ao(Eu, Cu, () => !1) && V, [le, Ve] = S({ top: 0, bottom: 0 });
  pn(() => {
    if (!V) return;
    const u = () => {
      const T = x.current;
      if (!T) return;
      const P = Math.round(T.getBoundingClientRect().top + window.scrollY), H = T.closest("main"), Q = H ? Math.round(parseFloat(getComputedStyle(H).paddingBottom) || 0) : 0;
      Ve(
        (ue) => ue.top === P && ue.bottom === Q ? ue : { top: P, bottom: Q }
      );
    };
    u();
    const g = typeof ResizeObserver > "u" ? null : new ResizeObserver(u);
    return g == null || g.observe(document.body), window.addEventListener("resize", u), () => {
      g == null || g.disconnect(), window.removeEventListener("resize", u);
    };
  }, [V]);
  const [It, $n] = S(0), dt = k(null), jt = Sn((u) => {
    var T;
    if ((T = dt.current) == null || T.disconnect(), dt.current = null, !u || typeof ResizeObserver > "u") return;
    const g = new ResizeObserver(
      () => $n(Math.round(u.getBoundingClientRect().height))
    );
    g.observe(u), dt.current = g;
  }, []), De = k(0), Fn = k(0), Ae = k(null), Et = k(null), Qn = ps(
    F && !Ke ? oe ? [...F.actions, ...oe.draft.actions] : F.actions : Su
  ), un = qe(
    () => oe && F && Z ? yu(oe.draft, F, A, Z) : null,
    [oe, F, A, Z]
  ), Mn = qe(
    () => F && Z ? Bs(
      { ...Z, view: { ...F.view, filter: { ...A, page: 1 } } },
      Z
    ) : null,
    [F, Z, A]
  ), ur = qe(
    () => Z ? wr(nr(Z)) : "",
    [Z]
  ), fr = qe(
    () => Mn != null && wr(nr(Mn)) !== ur,
    [Mn, ur]
  ), Or = qe(
    () => un != null && wr(nr(un)) !== ur,
    [un, ur]
  );
  z(() => {
    if (!Bn) return;
    const u = window.setTimeout(() => Wt(""), 4e3);
    return () => window.clearTimeout(u);
  }, [Bn]), z(() => {
    if (!Ce || Ce.alert) return;
    const u = window.setTimeout(() => Se(null), 6e3);
    return () => window.clearTimeout(u);
  }, [Ce]), z(() => {
    const u = X ? Ei(X.view.objectFilter) : [];
    if (Ir({}), !u.length) return;
    const g = new AbortController();
    let T = !0;
    return Promise.all(
      u.map(async (P) => {
        var H;
        try {
          const Q = await ce(`/api/tags/${P}`, {
            signal: g.signal
          });
          return (H = Q.name) != null && H.trim() ? [String(P), Q.name] : null;
        } catch {
          return null;
        }
      })
    ).then((P) => {
      T && Ir(
        Object.fromEntries(P.filter((H) => H !== null))
      );
    }), () => {
      T = !1, g.abort();
    };
  }, [X == null ? void 0 : X.id, X == null ? void 0 : X.view.objectFilter]);
  const Ot = qe(
    () => X ? Ci(
      X.view.objectFilter,
      dr
    ) : (F == null ? void 0 : F.view.objectFilter) ?? {},
    [dr, F, X]
  ), $r = Sn(async () => {
    l(!0), h("");
    try {
      const u = await dl();
      n(u.reviews), o(u.storageKey), b(u.canWriteVideos ?? u.canWrite), y(u.canWriteAudios ?? !1), q(u.canWriteTags ?? !1), E(u.canReadTagGroups ?? !1), te(u.canConfigure ?? !0), U(u.storage ?? "account"), ie(u.storageNotice ?? ""), B && !u.reviews.some((g) => g.id === B) && (D(""), Da(""));
    } catch (u) {
      h(
        u instanceof Error ? u.message : "Could not load reviews."
      );
    } finally {
      l(!1);
    }
  }, [B]);
  z(() => {
    if (!I) {
      M([]), L("");
      return;
    }
    const u = new AbortController();
    return L(""), Nl(u.signal).then(M).catch((g) => {
      u.signal.aborted || L(
        g instanceof Error ? g.message : "Could not load tag groups."
      );
    }), () => u.abort();
  }, [I]), z(() => {
    $r();
  }, []), z(() => {
    if (B || t.length === 0) return;
    const u = new AbortController();
    for (const g of t) {
      if (typeof Lt.current[g.id] == "number") continue;
      (Ne(g) ? Ai(g, u.signal).then((P) => (P == null ? void 0 : P.length) === 0 ? { items: [], totalCount: 0 } : Pr(ki(g, P), { ...g.view.filter, page: 1, perPage: 1 }, u.signal)) : $e(g) === "tag" ? Qi(
        g,
        Pt({ ...g.view.filter, page: 1, perPage: 1 }),
        u.signal
      ) : Pr(
        g,
        Pt({ ...g.view.filter, page: 1, perPage: 1 }),
        u.signal
      )).then((P) => {
        u.signal.aborted || Te((H) => ({
          ...H,
          [g.id]: P.totalCount
        }));
      }).catch(() => {
        u.signal.aborted || Te((P) => ({ ...P, [g.id]: null }));
      });
    }
    return () => u.abort();
  }, [B, t]), pn(() => {
    var T, P;
    const u = Ge.current;
    if (B || s || !u) return;
    Ge.current = null, (P = (u === "heading" ? null : [...((T = x.current) == null ? void 0 : T.querySelectorAll("[data-review-id]")) ?? []].find(
      (H) => H.dataset.reviewId === u.reviewId
    )) ?? gn.current) == null || P.focus();
  }, [B, s, rt, t]);
  const wa = k(0), zr = Sn(async () => {
    const u = ++wa.current;
    cr(null), Jn("");
    try {
      const g = await (tn ? ns(He) : ts(He));
      u === wa.current && cr(g);
    } catch (g) {
      if (u !== wa.current) return;
      cr(null), Jn(
        "Tag assessment setup could not be checked. " + (g instanceof Error ? g.message : "Request failed.")
      );
    }
  }, [tn, He]);
  z(() => {
    zr();
  }, [zr]);
  const Wn = Sn(
    async (u, g, T = !1, P = !1) => {
      var $t, Oe;
      const H = ++De.current;
      ($t = Ae.current) == null || $t.abort();
      const Q = new AbortController();
      Ae.current = Q, g = Pt(g);
      const ue = Number(g.page);
      T && (g = { ...g, page: 1 }), re(g), zt(T), Fe(!0), an("");
      try {
        const Ue = (qn) => $e(u) === "tag" ? Qi(
          u,
          qn,
          Q.signal
        ) : Pr(
          u,
          qn,
          Q.signal
        );
        let fe = await Ue(g);
        const Ze = Math.max(
          1,
          Math.ceil(fe.totalCount / Number(g.perPage))
        ), hr = T ? Ze : Math.min(ue, Ze);
        return Number(g.page) !== hr && (g = { ...g, page: hr }, fe = await Ue(g)), H === De.current && (((Oe = Et.current) == null ? void 0 : Oe.page) !== hr && (Et.current = {
          page: hr,
          ids: new Set(fe.items.map((qn) => qn.id))
        }), Xe(fe), P && fn(
          () => new Set(fe.items.map((qn) => qn.id))
        ), re(g), ve(g)), fe;
      } catch (Ue) {
        throw H === De.current && an(
          Ue instanceof Error ? Ue.message : "Could not load the review queue."
        ), Ue;
      } finally {
        H === De.current && Fe(!1);
      }
    },
    []
  );
  z(() => {
    var g;
    if (Fn.current += 1, St.current = -1, De.current += 1, (g = Ae.current) == null || g.abort(), ft(null), bn.current = null, de(!1), J(""), $(""), ae(!1), _t(/* @__PURE__ */ new Set()), sn.current.clear(), yt(null), Qt(!1), or(!1), ln.current = !1, Nn(""), Wt(""), dn(""), Xe({ items: [], totalCount: 0 }), Et.current = null, Rn(!1), !F || Ke) {
      Fe(!1), bt(null);
      return;
    }
    let u = !0;
    return Fe(!0), (async () => {
      let T = Z ?? F;
      bt(null);
      let P = null;
      const H = new URLSearchParams(window.location.search);
      if ($e(F) === "video" && ba.some((Oe) => H.has(Oe)))
        try {
          const Oe = T;
          P = Za(Oe, H);
          const Ue = hn(Oe, P.query);
          (P.query.startFrom !== (Oe.view.startFrom ?? "end") || !rr(
            JSON.parse(Ln(Ue)),
            JSON.parse(Ln(hn(Oe, ar(Oe))))
          )) && (T = Ue, bt(T));
        } catch (Oe) {
          Rn(!0), an(Oe instanceof Error ? Oe.message : "Could not read review URL."), Fe(!1);
          return;
        }
      let Q = null;
      try {
        Q = await hl(i, F.id);
      } catch (Oe) {
        u && (ae(!0), $(
          Oe instanceof Error ? Oe.message : "Could not load progress."
        ));
      }
      if (!u) return;
      const ue = (Q == null ? void 0 : Q.signature) === Ln(T) ? Q : null, $t = P ? P.query.filter : ue ? Pt(ue.filter) : vu(T.view.filter);
      re($t), Ar(
        ue ? qo(ue.displayMode, $e(F)) : No(F)
      ), kr(
        ue ? ue.cardSize ?? La : La
      );
      try {
        const Oe = await Wn(
          T,
          $t,
          P ? P.startAtEnd : !ue && T.view.startFrom !== "beginning",
          T.view.selectAllOnLoad === !0
        );
        if (!u) return;
        const Ue = Bi(
          Oe.items.map((fe) => fe.id),
          (ue == null ? void 0 : ue.focusedId) ?? null,
          (ue == null ? void 0 : ue.index) ?? 0
        );
        yt(Ue), pt(Ue);
      } catch {
      }
      u && (St.current = ct, de(!0), J(`${F.id}:${ct}`));
    })(), () => {
      var T;
      u = !1, Fn.current++, De.current++, (T = Ae.current) == null || T.abort();
    };
  }, [F == null ? void 0 : F.id, Ke, ct]), z(() => {
    if (!(!en || Ke || !F)) {
      if (on) {
        kt(0);
        return;
      }
      ge || oe || O !== `${F.id}:${ct}` || (kt(0), ka());
    }
  }, [en, Ke, F == null ? void 0 : F.id, O, ge, ct, on]), z(() => {
    !X || Ke || !Y || G || ye || ge || rn.current || St.current !== ct || Lr(X.id, {
      filter: A,
      objectFilter: X.view.objectFilter,
      searchMode: X.view.searchMode,
      startFrom: X.view.startFrom ?? "end"
    });
  }, [X, Ke, Y, G, ye, A, ge, ct]);
  const Ie = qe(
    () => me.items.map((u) => u.id),
    [me.items]
  );
  z(() => {
    if (!Y || !F || !i || G || ye || ge || (je == null ? void 0 : je.id) === F.id || K || St.current !== ct)
      return;
    const u = {
      version: 1,
      signature: Ln(F),
      filter: A,
      focusedId: ht,
      index: Math.max(0, Ie.indexOf(ht ?? -1)),
      displayMode: cn,
      cardSize: vn,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + F.id,
        JSON.stringify(u)
      );
    } catch {
    }
    if (C) return;
    let g = !0;
    const T = window.setTimeout(() => {
      pl(i, F.id, u).catch((P) => {
        g && $(
          "Progress is kept in this browser, but account sync failed. " + (P instanceof Error ? P.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      g = !1, window.clearTimeout(T);
    };
  }, [
    Y,
    i,
    F,
    G,
    ye,
    ge,
    A,
    ht,
    Ie,
    cn,
    vn,
    je,
    C,
    K,
    ct
  ]);
  const Hs = me.items.find((u) => u.id === ht) ?? null, ya = we === "video" ? Hs : null;
  vt && ya && (Cr.current = ya);
  const Hn = ya ?? (vt ? Cr.current : null), Ys = Vi(Tt, ht), Xs = Ie.length > 0 && Ie.every((u) => Tt.has(u)), pt = Sn((u, g = !0) => {
    u != null && window.requestAnimationFrame(() => {
      var P;
      if (Tn.current || al(document.activeElement) || (P = document.activeElement) != null && P.closest(".dq-drawer"))
        return;
      const T = f.current.get(u);
      T == null || T.focus({ preventScroll: !0 }), g && (T == null || T.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  z(() => {
    Y && !Rt.current && pt(Me.current);
  }, [Y, pt]), z(() => {
    G || !Ie.length || (Me.current == null || !Ie.includes(Me.current)) && (yt(Ie[0]), Rt.current || pt(Ie[0]));
  }, [pt, Ie, G]);
  const fn = Sn(
    (u) => {
      _t((g) => {
        const T = u(g);
        for (const P of /* @__PURE__ */ new Set([...g, ...T]))
          g.has(P) !== T.has(P) && sn.current.set(
            P,
            (sn.current.get(P) ?? 0) + 1
          );
        return T;
      });
    },
    []
  ), va = Sn(
    (u) => {
      if (!Ie.length) return;
      const g = Math.max(
        0,
        Ie.indexOf(Me.current ?? Ie[0])
      ), T = Ie[Math.max(0, Math.min(Ie.length - 1, g + u))];
      yt(T), Rt.current || pt(T);
    },
    [pt, Ie]
  ), Qr = Sn(
    async (u) => {
      const g = "steps" in u ? u.steps.length > 0 : u.effect.mode !== "SKIP", T = "effect" in u && u.effect.mode === "SET_TAG_GROUP" ? u.effect.tagGroupId : null, P = T != null && (!I || !j.some((Je) => Je.id === T)), H = "effect" in u && g && !I, Q = Vi(
        In.current,
        Me.current
      );
      if (!F || ln.current || G || ye) return;
      const ue = g && !Be ? `${Gn} write permission is required to apply ${u.label}.` : H || P ? `${u.label} needs a tag group that is unavailable.` : Dn(u) && (xe == null ? void 0 : xe.kind) !== "ready" ? `Set up tag assessments before applying ${u.label}.` : Q.length ? "" : `Select or focus a ${we} before applying ${u.label}.`;
      if (ue) {
        dn(ue);
        return;
      }
      const $t = ++Fn.current, Oe = F.id, Ue = [...Ie], fe = me, Ze = Me.current, hr = new Set(In.current), qn = new Map(
        Q.map((Je) => [Je, sn.current.get(Je) ?? 0])
      ), pr = () => $t === Fn.current && F.id === Oe;
      ln.current = !0, or(!0), Nn(
        In.current.size ? `${Q.length} selected ${we}s` : `the focused ${we}`
      ), Wt(""), dn("");
      const _i = fe.items.filter(
        (Je) => !Q.includes(Je.id)
      ), gc = _i.map((Je) => Je.id), ji = Ji(
        Ue,
        gc,
        Ze,
        Q.includes(Ze ?? -1)
      );
      Xe({
        items: _i,
        totalCount: fe.totalCount
      }), _t((Je) => {
        const xt = new Set(Je);
        for (const Ht of Q) xt.delete(Ht);
        return xt;
      }), yt(ji), Rt.current || pt(ji);
      let Ta = !1;
      try {
        if ("effect" in u ? await Ol(u, Q) : await as(He, u, Q), Ta = !0, !pr()) return;
        _t((Je) => {
          const xt = new Set(Je);
          for (const Ht of Q)
            (sn.current.get(Ht) ?? 0) === qn.get(Ht) && xt.delete(Ht);
          return xt;
        }), Wt(
          `${u.label}: ${Q.length} ${we}${Q.length === 1 ? "" : "s"} ${g ? "updated" : "skipped"}.`
        );
      } catch (Je) {
        if (!pr()) return;
        Xe(fe), _t((xt) => {
          const Ht = new Set(xt);
          for (const Ut of Q)
            hr.has(Ut) && (sn.current.get(Ut) ?? 0) === qn.get(Ut) && Ht.add(Ut);
          return Ht;
        }), yt(Ze), Rt.current || pt(Ze), dn(
          Je instanceof Error ? Je.message : "Action failed."
        );
      }
      try {
        if (await El(u), !pr()) return;
        const Je = new Set(Q), xt = Er && Ue.length > 0 && Ue.every((Yt) => Je.has(Yt)), Ht = await Wn(F, A, !1, xt);
        if (!pr()) return;
        let Ut = Ht.items.map((Yt) => Yt.id);
        const Hr = Et.current, bc = (Hr == null ? void 0 : Hr.page) === Number(A.page) && Ut.some((Yt) => Hr.ids.has(Yt)), wc = (F.view.startFrom ?? "end") !== "beginning";
        if (Ht.totalCount > 0 && Number(A.page) > 1 && (!Ut.length || wc && !bc)) {
          const Yt = Math.max(1, Number(A.page) - 1), Yr = { ...A, page: Yt };
          re(Yr), Ut = (await Wn(
            F,
            Yr,
            !1,
            xt
          )).items.map((Ra) => Ra.id), _t(
            (Ra) => new Set([...Ra].filter((yc) => Ut.includes(yc)))
          );
          const Gi = Ut.at(-1) ?? null;
          yt(Gi), Rt.current || pt(Gi);
        } else {
          _t(
            (Yr) => new Set([...Yr].filter((Ui) => Ut.includes(Ui)))
          );
          const Yt = Ji(
            Ue,
            Ut,
            Ze,
            Ta && Q.includes(Ze ?? -1)
          );
          yt(Yt), Rt.current && Yt == null && Qt(!1), Rt.current || pt(Yt);
        }
      } catch (Je) {
        pr() && dn(
          (xt) => `${xt ? `${xt} ` : ""}${Ta ? "The action completed, but " : ""}the queue could not be refreshed. ${Je instanceof Error ? Je.message : "Refresh failed."}`
        );
      } finally {
        pr() && (ln.current = !1, or(!1), Nn(""), rn.current && (rn.current = !1, Mi(), nn((Je) => Je + 1)));
      }
    },
    [
      Be,
      I,
      j,
      we,
      xe,
      Wn,
      A,
      pt,
      Ie,
      me,
      G,
      ye,
      F
    ]
  );
  function Zs() {
    var T;
    if (cn === "list") return 1;
    const u = (T = v.current) == null ? void 0 : T.firstElementChild, g = u ? getComputedStyle(u).gridTemplateColumns : "";
    return Math.max(1, g.split(" ").filter(Boolean).length);
  }
  const Ii = k(() => {
  });
  Ii.current = (u) => {
    var Q;
    if (Ke || u.defaultPrevented || u.repeat || u.ctrlKey || u.altKey || u.metaKey || gt) return;
    const g = u.target, T = g instanceof Node && ((Q = x.current) == null ? void 0 : Q.contains(g)) === !0, P = g === document.body || g === document.documentElement;
    if (!T && !P) return;
    if (Kn) {
      u.key === "Escape" && (gr(u), Re(!1));
      return;
    }
    if (vt && u.key === "Escape") {
      gr(u), Qt(!1), pt(Me.current);
      return;
    }
    if (!rl(g)) return;
    const H = nl(g);
    if (u.key === "Escape") {
      gr(u), fn(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!vt && u.key === " " && H) {
      gr(u), ht != null && fn((ue) => ra(ue, ht));
      return;
    }
    if (!(ge || G) && !vt && u.key === "Enter" && ht != null && H) {
      if (we !== "tag" && oe) return;
      gr(u), we === "tag" ? window.open(`/tag/${ht}`, "_blank", "noopener,noreferrer") : Qt(!0);
      return;
    }
  }, z(() => {
    const u = (g) => Ii.current(g);
    return document.addEventListener("keydown", u), () => document.removeEventListener("keydown", u);
  }, []);
  const Oi = k(
    () => {
    }
  );
  Oi.current = (u) => {
    var Q;
    if (Ke || gt || vt || Kn || ge || G || !Ie.length || u.defaultPrevented || u.repeat || u.ctrlKey || u.altKey || u.metaKey)
      return;
    const g = u.target, T = g instanceof Node && ((Q = x.current) == null ? void 0 : Q.contains(g)) === !0, P = g === document.body || g === document.documentElement;
    if (!T && !P || !u.key.startsWith("Arrow") || !il(g)) return;
    const H = ol(u.key, Zs());
    H && (u.preventDefault(), T ? u.stopImmediatePropagation() : u.stopPropagation(), va(H));
  }, z(() => {
    const u = (g) => Oi.current(g);
    return document.addEventListener("keydown", u), () => document.removeEventListener("keydown", u);
  }, []);
  const xn = (oe == null ? void 0 : oe.saving) === !0 || On, Na = ge || G && !Y || xn, ec = jn();
  mi({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!F && !Ke && !gt && !oe && !vt && !Kn && !ye && (me.items.length > 0 || G || ge),
    actionCount: (F == null ? void 0 : F.actions.length) ?? 0,
    onAction: (u) => {
      const g = F == null ? void 0 : F.actions[u];
      g && Qr(g);
    },
    onFind: () => Re(!0),
    onSelectAll: () => fn((u) => tl(u, Ie))
  }), z(() => Re(!1), [Ke, vt, F == null ? void 0 : F.id]);
  function $i(u) {
    const g = "steps" in u ? u.steps.length > 0 : u.effect.mode !== "SKIP", T = "effect" in u && u.effect.mode === "SET_TAG_GROUP" ? u.effect.tagGroupId : null, P = T != null && !j.some((H) => H.id === T);
    return ge || G || !!ye || g && !Be || "effect" in u && g && (!I || P) || Dn(u) && (xe == null ? void 0 : xe.kind) !== "ready" || !Ys.length;
  }
  function qa(u) {
    at(null), kt(0), Se(null), D(u), Da(u, !!u && !F);
  }
  function Fi() {
    Pe.current || (Gs() ? (Pe.current = !0, window.history.back()) : qa(""));
  }
  function Mi() {
    const u = Pe.current;
    Pe.current = !1;
    let g = So();
    g && !ut.current && !it.current.some((P) => P.id === g) && (g = "", Da(""));
    const T = ee.current;
    g !== T && (kt(0), u || Se(null), !g && T && (Ge.current ?? (Ge.current = { reviewId: T }))), D(g);
  }
  function Sa() {
    Ge.current = "heading", Se(null), Fi();
  }
  function Ea(u) {
    u !== B && qa(u), kt((g) => g + 1);
  }
  function tc() {
    Se(null), At({
      review: zs("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function nc(u) {
    if (Dt || !W) return;
    Se(null);
    const g = el(u, t, crypto.randomUUID()), T = B;
    Un(!0);
    try {
      if (!await Yn([...t, g])) throw new Error("Could not save reviews.");
      if (!ze.current) return;
      ee.current !== T ? Se({ text: `Saved the copy “${g.name}”.`, alert: !1 }) : Ea(g.id);
    } catch (P) {
      Se({
        text: `“${u.name}” was not duplicated. ${Ca(P)}`,
        alert: !0
      });
    } finally {
      Un(!1);
    }
  }
  async function rc() {
    if (!st || st.saving) return;
    const u = { ...st.review, name: st.review.name.trim() }, g = jr(u);
    if (g) {
      At({ ...st, error: g });
      return;
    }
    At({ ...st, saving: !0, error: "" });
    try {
      if (!await Yn([...t, u])) throw new Error("Could not save reviews.");
      if (!ze.current) return;
      At(null), Ea(u.id);
    } catch (T) {
      At(
        (P) => P && {
          ...P,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (T instanceof Error ? T.message : "Retry saving.")
        }
      );
    }
  }
  async function ac() {
    if (!rt || rt.pending) return;
    const u = rt.review, g = Js(t, be, he, nt).map((H) => H.id), T = g.filter((H) => H !== u.id), P = T[Math.min(g.indexOf(u.id), T.length - 1)];
    Vt({ review: u, pending: !0 });
    try {
      if (!await Yn(t.filter((H) => H.id !== u.id)))
        throw new Error("Could not save reviews.");
      Ge.current = u.id !== B && P ? { reviewId: P } : "heading", Se({ text: `Deleted “${u.name}”.`, alert: !1 });
    } catch (H) {
      Se({ text: `“${u.name}” was not deleted. ${Ca(H)}`, alert: !0 });
    } finally {
      Vt(null);
    }
  }
  async function ic(u) {
    if (!(Dt || !W)) {
      Se(null), Zt(!0);
      try {
        const g = await pd(u), T = ja(t, g), P = T.length - t.length, H = g.length - P;
        if (P && !await Yn(T)) throw new Error("Could not save reviews.");
        Se({
          alert: !1,
          text: g.length ? P ? `Imported ${P === 1 ? "1 review" : `${P} reviews`}.` + (H === 1 ? " 1 review already in the list stays as it is." : H ? ` ${H} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (g) {
        Se({ alert: !0, text: `Could not import “${u.name}”. ${Ca(g)}` });
      } finally {
        Zt(!1);
      }
    }
  }
  function Ca(u) {
    return u instanceof zo ? "Reviews changed in another browser. Reload the page to get them, then try again." : u instanceof Error ? u.message : "Try again.";
  }
  function xi(u) {
    const g = !W || Dt;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ r(Fo, { "aria-hidden": "true" }),
        disabled: g,
        onSelect: () => void nc(u)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ r(Ko, { "aria-hidden": "true" }),
        onSelect: () => vi(u)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ r(Mo, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: g,
        onSelect: () => {
          Se(null), Vt({ review: u, pending: !1 });
        }
      }
    ];
  }
  function Pi(u, g) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ r(yr, { "aria-hidden": "true" }),
        ...g,
        disabled: g.disabled || Nt
      },
      ...xi(u),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ r(Kr, { "aria-hidden": "true" }),
        separated: !0,
        disabled: Nt,
        onSelect: Sa
      }
    ];
  }
  async function Yn(u) {
    if (!i) return !1;
    const g = u.map(Tu);
    try {
      await fl(i, g);
    } catch (P) {
      throw P;
    }
    n(g), B && !g.some((P) => P.id === B) && Fi();
    const T = g.find((P) => P.id === B);
    return T && Z && ((T.view.reviewMode ?? "single") !== (Z.view.reviewMode ?? "single") && at(null), T.view.displayMode !== Z.view.displayMode && Ar(No(T))), !0;
  }
  if (s)
    return /* @__PURE__ */ r(Eo, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ c(pe, { children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          onClick: () => void Fu().catch(
            (u) => h(
              "Could not export browser reviews. " + (u instanceof Error ? u.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ r(
        Co,
        {
          message: d,
          onRetry: () => void $r()
        }
      )
    ] });
  const Aa = /* @__PURE__ */ c(pe, { children: [
    _ && /* @__PURE__ */ r("p", { className: "dq-status", children: _ }),
    wn && (xe == null ? void 0 : xe.kind) === "missing" && /* @__PURE__ */ c("div", { role: "status", className: "dq-status", children: [
      xe.message,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: zn,
          onClick: () => {
            lr(!0), Jn(""), (tn ? kl(He) : Al(He)).then(zr).catch(
              (u) => Jn(
                `Could not create the ${tn ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (u instanceof Error ? u.message : "Request failed.")
              )
            ).finally(() => lr(!1));
          },
          children: zn ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    wn && ((xe == null ? void 0 : xe.kind) === "incompatible" || Rr) && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(Zn, {}),
      Rr || (xe == null ? void 0 : xe.message),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: zn,
          onClick: () => {
            lr(!0), zr().finally(
              () => lr(!1)
            );
          },
          children: zn ? "Checking…" : "Check again"
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
            const u = localStorage.getItem("page-videos") ?? "[]", g = URL.createObjectURL(
              new Blob([u], { type: "application/json" })
            ), T = document.createElement("a");
            T.href = g, T.download = "data-quality-unassigned-legacy-reviews.json", T.click(), URL.revokeObjectURL(g);
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
            $(""), ae(!1);
          },
          children: K ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    Ce && (Ce.alert ? /* @__PURE__ */ c("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(Zn, { "aria-hidden": "true" }),
      Ce.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ r("p", { className: "dq-status", "aria-hidden": "true", children: Ce.text })
    ))
  ] });
  return /* @__PURE__ */ c(
    "div",
    {
      ref: x,
      className: `data-quality-page${V ? " dq-page-fit" : ""}`,
      style: V ? {
        "--dq-fit-top": `${le.top}px`,
        "--dq-fit-bottom": `${le.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: Ce && !Ce.alert ? Ce.text : "" }),
        F && Ke ? /* @__PURE__ */ r(
          uu,
          {
            review: Z ?? F,
            canWrite: Ye ? w : Jt,
            canAssess: (xe == null ? void 0 : xe.kind) === "ready" && Jt,
            onBusy: or,
            editRequest: en,
            onEditRequestHandled: () => kt(0),
            onSaveDefaults: W ? (u) => Yn(t.map((g) => g.id === u.id ? u : g)) : void 0,
            pageControls: {
              onBack: Sa,
              moreItems: (u) => Pi(Z ?? F, u),
              onGrid: X ? () => at({ id: X.id, mode: "multiple" }) : void 0,
              notices: Aa,
              busy: Nt
            }
          },
          F.id
        ) : F ? pc(F) : /* @__PURE__ */ r(
          gu,
          {
            reviews: t,
            counts: be,
            sort: he,
            direction: nt,
            onSortChange: (u) => _e({ sort: u }),
            onDirectionChange: (u) => _e({ direction: u }),
            storage: wu[ne],
            canConfigure: W,
            busy: Dt,
            headingRef: gn,
            notices: Aa,
            onOpen: qa,
            onNew: () => tc(),
            onImport: (u) => void ic(u),
            onExportAll: () => qs(t, "data-quality-reviews.json"),
            rowMenuItems: (u) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ r(yr, { "aria-hidden": "true" }),
                disabled: !W || Dt,
                onSelect: () => Ea(u.id)
              },
              ...xi(u)
            ]
          }
        ),
        vt && Hn && X && /* @__PURE__ */ r(
          $u,
          {
            video: Hn,
            review: X,
            selectedCount: Tt.size,
            pending: ge,
            refreshing: G || !!ye,
            error: Vn,
            canWrite: p,
            assessmentReady: (xe == null ? void 0 : xe.kind) === "ready",
            trees: Qn,
            selected: Tt.has(Hn.id),
            hasPrevious: Ie.indexOf(Hn.id) > 0,
            hasNext: Ie.indexOf(Hn.id) >= 0 && Ie.indexOf(Hn.id) < Ie.length - 1,
            onToggleSelected: () => fn((u) => ra(u, Hn.id)),
            onPrevious: () => va(-1),
            onNext: () => va(1),
            onClose: () => {
              Qt(!1), pt(Me.current);
            },
            onAction: Qr,
            findOpen: Kn,
            onFindOpenChange: Re
          }
        ),
        Kn && F && !Ke && !vt && /* @__PURE__ */ r(
          wi,
          {
            actions: F.actions,
            tagGroups: j,
            trees: Qn,
            isDisabled: $i,
            canStay: !1,
            onApply: (u) => {
              Re(!1), Qr(u);
            },
            onClose: () => Re(!1)
          }
        ),
        st && /* @__PURE__ */ r(
          bu,
          {
            draft: st,
            onChange: (u) => At((g) => g && { ...g, review: u, error: "" }),
            onCreate: () => void rc(),
            onCancel: () => At(null)
          }
        ),
        /* @__PURE__ */ r(
          Ic,
          {
            open: !!rt,
            title: "Delete review?",
            message: rt ? `“${rt.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (rt == null ? void 0 : rt.pending) ?? !1,
            onConfirm: () => void ac(),
            onCancel: () => Vt((u) => u != null && u.pending ? u : null)
          }
        )
      ]
    }
  );
  async function Wr(u, g, T = !1) {
    const P = Me.current, H = Math.max(0, Ie.indexOf(P ?? -1));
    try {
      const Q = Wn(
        u,
        g,
        T,
        u.view.selectAllOnLoad === !0
      ), ue = De.current, $t = await Q;
      if (ue !== De.current) return;
      const Oe = $t.items.map((fe) => fe.id);
      _t(
        (fe) => new Set([...fe].filter((Ze) => Oe.includes(Ze)))
      );
      const Ue = Bi(Oe, P, H);
      yt(Ue), Rt.current || pt(Ue, !1);
    } catch {
    }
  }
  function oc(u) {
    const g = lt.current;
    if (lt.current = null, Na || !F || !Z) return;
    const T = g ?? F.view.objectFilter, P = rr(
      T,
      Z.view.objectFilter
    ) ? Z.view.objectFilter : T, H = Pt({ ...u, page: 1 }), Q = {
      ...F,
      view: {
        ...F.view,
        filter: H,
        objectFilter: P
      }
    }, ue = !vo(Q, Z), $t = ue ? Q : Z;
    bt(ue ? Q : null), Wt(ue ? "" : "Review queue defaults restored."), Wr($t, H, !0);
  }
  function sc() {
    if (ge || G || xn || !Z) return;
    lt.current = null;
    const u = Pt({
      ...Z.view.filter,
      page: 1
    });
    bt(null), Wt("Review queue defaults restored."), Wr(
      Z,
      u,
      Z.view.startFrom !== "beginning"
    );
  }
  function cc() {
    if (ge || G || ye || xn || !F || !Mn || !W)
      return;
    const u = F, g = Mn;
    Tr(!0), Yn(
      t.map((T) => T.id === g.id ? g : T)
    ).then((T) => {
      T && (bt(yo(g, u)), Wt("Queue saved to this review."));
    }).catch(
      (T) => dn(
        T instanceof Error ? T.message : "Could not save queue."
      )
    ).finally(() => Tr(!1));
  }
  function ka() {
    if (!F || !Z || ln.current || oe || On) return;
    Ft.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, bn.current = {
      temporaryReview: je,
      filter: A,
      loadedFilter: Ee,
      queue: me,
      queueError: ye,
      retryFromEnd: Sr,
      selectedIds: new Set(Tt),
      focusedId: ht,
      pageCursor: Et.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const u = structuredClone({
      ...Z,
      view: { ...Z.view, startFrom: F.view.startFrom ?? "end" }
    });
    Re(!1), Qt(!1), Wt(""), dn(""), ft({ draft: u, saving: !1, error: "" });
  }
  function Li() {
    ft(null), bn.current = null;
    const u = Ft.current;
    Ft.current = null, requestAnimationFrame(() => {
      (u == null ? void 0 : u.isConnected) && u !== document.body && !(u instanceof HTMLButtonElement && u.disabled) ? u.focus({ preventScroll: !0 }) : pt(Me.current, !1);
    });
  }
  function lc() {
    var g;
    if (!oe || oe.saving) return;
    const u = bn.current;
    u && (De.current += 1, (g = Ae.current) == null || g.abort(), lt.current = null, Fe(!1), bt(u.temporaryReview), re(u.filter), ve(u.loadedFilter), Xe(u.queue), an(u.queueError), zt(u.retryFromEnd), fn(() => u.selectedIds), yt(u.focusedId), Et.current = u.pageCursor, window.history.replaceState(window.history.state, "", u.url)), Li();
  }
  async function dc() {
    if (!oe || oe.saving || !un || !F) return;
    const u = F, g = { ...un, name: un.name.trim() }, T = jr(g);
    if (T) {
      ft((P) => P && { ...P, error: T });
      return;
    }
    ft((P) => P && { ...P, saving: !0, error: "" });
    try {
      if (!await Yn(t.map((P) => P.id === g.id ? g : P)))
        throw new Error("Could not save reviews.");
      bt(yo(g, u)), $e(g) === "video" && Lr(g.id, {
        filter: A,
        objectFilter: u.view.objectFilter,
        searchMode: g.view.searchMode,
        startFrom: g.view.startFrom ?? "end"
      }), Wt("Review saved."), Li();
    } catch (P) {
      ft(
        (H) => H && {
          ...H,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (P instanceof Error ? P.message : "Retry saving.")
        }
      );
    }
  }
  function Di() {
    F && Wn(F, A, Sr, Er).catch(() => {
    });
  }
  function uc() {
    _t(/* @__PURE__ */ new Set()), sn.current.clear(), yt(null);
  }
  function fc(u) {
    !F || ge || xn || u === Number(A.page) || ku(
      { ...A, page: u },
      F,
      (g, T) => Wn(g, T, !1, Er),
      uc
    );
  }
  function hc(u) {
    if (!X || !Z || ge || G || xn) return;
    const g = au(X, u, Z.view.objectFilter), T = !vo(g, Z);
    bt(T ? g : null), T ? Wr(g, { ...A, page: 1 }) : Wr(
      Z,
      { ...A, page: 1 },
      Z.view.startFrom !== "beginning"
    );
  }
  function pc(u) {
    var Oe, Ue;
    const g = we === "tag", T = g ? "tag" : "video", P = Math.max(1, Number(A.perPage) || 40), H = Math.max(1, Math.ceil(me.totalCount / P)), Q = Math.min(Math.max(1, Number(A.page) || 1), H), ue = [
      Be ? "" : `${Gn} write permission is required to apply actions.`,
      g && R ? `Tag groups are unavailable. ${R}` : ""
    ].filter(Boolean), $t = !!Vn && !vt;
    return /* @__PURE__ */ c(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": g ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ r(
            Cs,
            {
              name: u.name,
              description: u.description,
              entityType: we,
              onBack: Sa,
              backDisabled: ge || !!oe || Nt,
              onEdit: oe ? () => {
                var fe;
                return (fe = We.current) == null ? void 0 : fe.focus();
              } : ka,
              editDisabled: !oe && (ge || G || on || On || Nt || !W),
              editing: !!oe,
              toolbar: /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: Na, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: g ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ r(
                  Dr,
                  {
                    filter: ye ? Ee : A,
                    onFilterChange: oc,
                    totalCount: me.totalCount,
                    sortOptions: g ? $c : Ro,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: cn,
                    zoomLevel: (vn - 225) / 50,
                    onZoomChange: (fe) => kr(Math.round(225 + fe * 50)),
                    cardSizeEntityType: g ? "tags" : "videos",
                    criteriaDefinitions: g ? Oc : ni,
                    customFieldEntityType: we === "video" ? "video" : void 0,
                    objectFilter: Ot,
                    onObjectFilterChange: (fe) => {
                      Na || (lt.current = we === "video" ? Ts(
                        fe,
                        dr,
                        u.view.objectFilter
                      ) : fe);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(As, { page: Q, pages: H, onPage: fc })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ c(pe, { children: [
                X && /* @__PURE__ */ r(
                  ks,
                  {
                    mode: "multiple",
                    disabled: ge || G || gt || !!oe || On || Nt,
                    onChange: () => at({ id: X.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ r(
                  vd,
                  {
                    options: g ? qu : Nu,
                    value: cn,
                    onChange: (fe) => Ar(qo(fe, we))
                  }
                ),
                /* @__PURE__ */ r(
                  Ni,
                  {
                    disabled: ge || !!oe,
                    items: Pi(Z ?? u, {
                      onSelect: ka,
                      disabled: G || on || On || !W
                    })
                  }
                )
              ] }),
              chipsAfter: (Ue = (Oe = X == null ? void 0 : X.presentation) == null ? void 0 : Oe.binParents) != null && Ue.length ? /* @__PURE__ */ r(
                nu,
                {
                  videos: me.items,
                  review: X,
                  savedObjectFilter: (Z ?? X).view.objectFilter,
                  trees: N.ids,
                  disabled: ge || G || xn,
                  onToggle: hc
                }
              ) : void 0,
              chipsEnd: oe ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : (je == null ? void 0 : je.id) === B ? /* @__PURE__ */ c(pe, { children: [
                /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
                fr && /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-text-button",
                    title: "Save the current queue criteria to this review",
                    disabled: ge || G || !!ye || xn || !W,
                    onClick: cc,
                    children: [
                      /* @__PURE__ */ r(jo, { "aria-hidden": "true" }),
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
                    disabled: ge || G || xn,
                    onClick: sc,
                    children: [
                      /* @__PURE__ */ r(Uo, { "aria-hidden": "true" }),
                      "Reset"
                    ]
                  }
                )
              ] }) : void 0
            }
          ),
          Aa,
          X && N.error && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: N.error }),
          /* @__PURE__ */ c("div", { className: "dq-review-area", children: [
            oe && un && /* @__PURE__ */ r(
              Es,
              {
                drawerRef: We,
                draft: un,
                onChange: (fe) => ft((Ze) => Ze && { ...Ze, draft: fe }),
                direction: oe.draft.view.startFrom ?? "end",
                onDirectionChange: (fe) => ft(
                  (Ze) => Ze && {
                    ...Ze,
                    draft: { ...Ze.draft, view: { ...Ze.draft.view, startFrom: fe } }
                  }
                ),
                tagGroups: j,
                trees: Qn,
                saving: oe.saving,
                saveDisabled: G || !!ye,
                error: oe.error,
                dirty: Or,
                criteriaChanged: fr,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  ye && !G ? /* @__PURE__ */ c("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ r(Zn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ c("span", { children: [
                      "The queue could not load: ",
                      ye,
                      " ",
                      /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", onClick: Di, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void dc(),
                onCancel: lc
              }
            ),
            /* @__PURE__ */ c(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${It}px` },
                children: [
                  /* @__PURE__ */ c("div", { className: "dq-grid-content", children: [
                    G && !me.items.length && /* @__PURE__ */ r(Eo, { label: "Loading review queue…" }),
                    ye && !G && /* @__PURE__ */ r(
                      Co,
                      {
                        message: ye,
                        retryLabel: on ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (on && Z && $e(Z) === "video") {
                            const fe = ar(Z);
                            Lr(Z.id, { ...fe, filter: { ...fe.filter, page: void 0 } }), nn((Ze) => Ze + 1);
                            return;
                          }
                          Di();
                        }
                      }
                    ),
                    !ge && !G && !ye && !me.items.length && /* @__PURE__ */ c("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ r(fa, {}),
                      /* @__PURE__ */ c("p", { children: [
                        "No ",
                        T,
                        "s match this review."
                      ] })
                    ] }),
                    !!me.items.length && /* @__PURE__ */ r("div", { ref: v, children: /* @__PURE__ */ r(
                      "div",
                      {
                        className: cn === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${vn}px` },
                        children: me.items.map(mc)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ r("div", { className: "dq-bar-dock", ref: jt, children: /* @__PURE__ */ r(
                    gs,
                    {
                      actions: oe ? oe.draft.actions : u.actions,
                      tagGroups: j,
                      trees: Qn,
                      isDisabled: $i,
                      paused: !!oe,
                      busy: ge || G,
                      onApply: (fe) => void Qr(fe),
                      onFind: () => Re(!0),
                      status: ge ? `Applying action to ${sr}…` : "",
                      summary: /* @__PURE__ */ c(pe, { children: [
                        /* @__PURE__ */ r("p", { className: "dq-bar-target", children: Tt.size ? `${Tt.size} selected` : ht == null ? "Nothing to apply to" : `Applies to the focused ${T}` }),
                        /* @__PURE__ */ c(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !Ie.length || Xs,
                            onClick: () => fn((fe) => /* @__PURE__ */ new Set([...fe, ...Ie])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ r(mt, { binding: ec.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ c(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !Tt.size,
                            onClick: () => fn(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ r(mt, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: ue.length ? ue.join(" ") : g ? "Arrows move · Space selects · Enter opens" : oe ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews",
                      notices: $t || Bn ? /* @__PURE__ */ c(pe, { children: [
                        $t && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ r(Zn, { "aria-hidden": "true" }),
                          Vn
                        ] }),
                        Bn && /* @__PURE__ */ r("p", { role: "status", className: "dq-status", children: Bn })
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
  function mc(u) {
    var T, P, H;
    if (we === "tag") {
      const Q = u;
      return /* @__PURE__ */ r(
        Ru,
        {
          tag: Q,
          displayMode: cn === "list" ? "list" : "grid",
          focused: Q.id === ht,
          selected: Tt.has(Q.id),
          setRef: (ue) => {
            ue ? f.current.set(Q.id, ue) : f.current.delete(Q.id);
          },
          onFocus: () => yt(Q.id),
          onToggle: () => {
            fn((ue) => ra(ue, Q.id)), pt(Q.id, !1);
          },
          onOpen: () => window.open(`/tag/${Q.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        Q.id
      );
    }
    const g = u;
    return /* @__PURE__ */ r(
      Iu,
      {
        video: tu(g, X, N.ids),
        showTagBins: ((P = (T = X == null ? void 0 : X.presentation) == null ? void 0 : T.annotations) == null ? void 0 : P.includes("tags")) && !!((H = X.presentation.annotationParents) != null && H.length),
        displayMode: cn,
        cardsScroll: se,
        focused: g.id === ht,
        selected: Tt.has(g.id),
        setRef: (Q) => {
          Q ? f.current.set(g.id, Q) : f.current.delete(g.id);
        },
        onFocus: () => yt(g.id),
        onToggle: () => fn((Q) => ra(Q, g.id)),
        onPreview: () => {
          oe || (yt(g.id), Qt(!0));
        },
        onNavigate: e
      },
      g.id
    );
  }
}
function ku(e, t, n, a) {
  a(), n(t, e).catch(() => {
  });
}
function ra(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function Tu(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Ru({
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
        Fc,
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
function Iu({
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
  var I, E;
  const b = Qs(e), m = k(null), y = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, w = !!(y.date || y.studioName), q = !!(y.performers.length || y.tags.length);
  return pn(() => {
    const j = m.current;
    if (!j) return;
    const M = j.querySelector(
      `a[href="/video/${e.id}"]`
    ), R = j.querySelector(".card-title"), L = `dq-card-title-${e.id}`;
    R && (R.id = L), M && (M.target = "_blank", M.rel = "noreferrer", M.removeAttribute("aria-label"), M.setAttribute("aria-labelledby", L), M.classList.add("dq-card-link"));
    const W = j.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    W && W.setAttribute(
      "aria-label",
      o ? `Deselect ${b}` : `Select ${b}`
    );
    const te = j.querySelector(
      'button[title="Quick View"]'
    );
    te && te.setAttribute("aria-label", `Preview ${b}`);
  }), /* @__PURE__ */ c(
    "article",
    {
      ref: (j) => {
        m.current = j, s(j);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${b}${o ? ", selected" : ""}`,
      onFocus: l,
      onClick: (j) => {
        l(), j.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${w ? "has-card-metadata" : "no-card-metadata"} ${q ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ r(
          Mc,
          {
            video: y,
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
          (I = e.tags) == null ? void 0 : I.map((j) => /* @__PURE__ */ r("span", { children: j.name }, j.id)),
          !((E = e.tags) != null && E.length) && /* @__PURE__ */ r("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ r(Ou, { video: e, cardsScroll: a })
      ]
    }
  );
}
function Ou({ video: e, cardsScroll: t }) {
  const n = k(null), a = k(null), [i, o] = S(!1), [s, l] = S(!1), [d, h] = S(!1);
  return z(() => {
    const p = n.current;
    if (!p || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), l(!0);
      return;
    }
    const b = t ? p.closest(".dq-grid-stage") : null, m = new IntersectionObserver(
      ([w]) => o(w.isIntersecting),
      { root: b, rootMargin: "320px 0px", threshold: 0 }
    ), y = new IntersectionObserver(
      ([w]) => l(w.isIntersecting && w.intersectionRatio >= 0.6),
      { root: b, threshold: [0, 0.6, 1] }
    );
    return m.observe(p), y.observe(p), () => {
      m.disconnect(), y.disconnect();
    };
  }, [e.id, e.files.length, t]), z(() => {
    if (!i) {
      h(!1);
      return;
    }
    const p = new AbortController();
    return ce(Sl(e.id), {
      signal: p.signal
    }).then((b) => {
      p.signal.aborted || h(b.available === !0);
    }).catch(() => {
      p.signal.aborted || h(!1);
    }), () => p.abort();
  }, [i, e.id]), z(() => {
    const p = a.current;
    p && (s ? Promise.resolve(p.play()).catch(() => {
    }) : p.pause());
  }, [d, s]), /* @__PURE__ */ r("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: d && /* @__PURE__ */ r(
    "video",
    {
      ref: a,
      src: ql(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function $u({
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
  hasNext: b,
  onToggleSelected: m,
  onPrevious: y,
  onNext: w,
  onClose: q,
  onAction: I,
  findOpen: E,
  onFindOpenChange: j
}) {
  const M = k(null), R = k(null), L = e.files[0], W = Qs(e), te = (C) => a || i || "steps" in C && C.steps.length > 0 && !s || Dn(C) && !l;
  mi({
    surface: "overlay",
    enabled: !E,
    actionCount: t.actions.length,
    onAction: (C) => {
      const $ = t.actions[C];
      $ && I($);
    },
    onFind: () => j(!0)
  }), z(() => {
    var $;
    const C = document.body.style.overflow;
    return document.body.style.overflow = "hidden", ($ = M.current) == null || $.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = C;
    };
  }, []);
  function ne(C) {
    var ae, Y, de;
    if (C.key !== "Tab") return;
    const $ = [
      ...((ae = M.current) == null ? void 0 : ae.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((O) => O.offsetParent !== null);
    if (!$.length) {
      C.preventDefault(), (Y = M.current) == null || Y.focus();
      return;
    }
    const K = $.indexOf(
      document.activeElement
    );
    C.shiftKey && K <= 0 ? (C.preventDefault(), (de = $.at(-1)) == null || de.focus()) : !C.shiftKey && K === $.length - 1 && (C.preventDefault(), $[0].focus());
  }
  function U(C) {
    if (E || C.defaultPrevented || C.ctrlKey || C.metaKey || C.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const $ = C.key === "ArrowLeft" || C.key === "ArrowRight";
    if (C.altKey && !$) return;
    const K = R.current, ae = C.currentTarget.querySelector("video");
    if (C.key === "Enter" || C.key === "Escape")
      C.repeat || q();
    else if (C.key === " " && K)
      C.repeat || K.toggle();
    else if ($ && K)
      K.seekBy(
        (C.key === "ArrowLeft" ? -1 : 1) * (C.shiftKey ? 5 : C.altKey ? 10 : 60)
      );
    else if ((C.key === "," || C.key === ".") && K) {
      const Y = [L == null ? void 0 : L.duration, ae == null ? void 0 : ae.duration].find(
        (O) => O != null && Number.isFinite(O) && O > 0
      ) ?? 0, de = e.parentVideoId != null ? (e.clipEndSec ?? Y) - (e.clipStartSec ?? 0) : Y;
      Number.isFinite(de) && de > 0 && K.seekBy((C.key === "," ? -1 : 1) * de * 0.1);
    } else if (C.key.toLowerCase() === "n" || C.key.toLowerCase() === "m")
      !C.repeat && !a && !i && (C.key.toLowerCase() === "n" && p && y(), C.key.toLowerCase() === "m" && b && w());
    else if (C.key === "ArrowUp" && ae)
      ae.volume = Math.min(1, ae.volume + 0.1);
    else if (C.key === "ArrowDown" && ae)
      ae.volume = Math.max(0, ae.volume - 0.1);
    else return;
    gr(C);
  }
  function _(C) {
    const $ = M.current, K = C.target instanceof Element ? C.target.closest("button, a[href]") : null;
    !$ || !K || !$.contains(K) || K.closest(".dq-player, .dq-find-action") || C.detail === 0 || $.focus({ preventScroll: !0 });
  }
  z(() => {
    if (E) return;
    let C = 0;
    const $ = requestAnimationFrame(() => {
      C = requestAnimationFrame(() => {
        var ae;
        const K = document.activeElement;
        (ae = M.current) != null && ae.isConnected && (!K || K === document.body || K === document.documentElement) && M.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame($), cancelAnimationFrame(C);
    };
  }, [E, a, i, b, p, e.id]);
  const ie = n ? `the ${n} selected video${n === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ c(
    "div",
    {
      ref: M,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${W}`,
      className: "dq-preview",
      onKeyDown: ne,
      onKeyDownCapture: U,
      onMouseDown: (C) => {
        C.target === C.currentTarget && q();
      },
      onClick: _,
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
                onClick: y,
                children: [
                  /* @__PURE__ */ r(Kr, { "aria-hidden": "true" }),
                  /* @__PURE__ */ r(mt, { binding: "n", hidden: !0 })
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
                disabled: !b || a || i,
                onClick: w,
                children: [
                  /* @__PURE__ */ r(mt, { binding: "m", hidden: !0 }),
                  /* @__PURE__ */ r(_o, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ c("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ r("h2", { children: W }),
              /* @__PURE__ */ c("p", { children: [
                "Actions apply to ",
                ie
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
                  /* @__PURE__ */ r("span", { className: "dq-preview-check", "aria-hidden": "true", children: h && /* @__PURE__ */ r(ii, {}) }),
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
                "aria-label": `Open ${W} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ r(Go, { "aria-hidden": "true" })
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
                children: /* @__PURE__ */ r(Gr, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ r("div", { className: "dq-preview-video", children: L ? /* @__PURE__ */ r(
            Io,
            {
              autostart: !0,
              streamUrl: Va("video", e.id),
              posterUrl: Wi(e),
              format: L.format,
              audioCodec: L.audioCodec,
              duration: L.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onPlaybackControlRegister: (C) => (R.current = C, () => {
                R.current === C && (R.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ r("img", { src: Wi(e), alt: "" }) }) }),
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
            gs,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: d,
              isDisabled: te,
              busy: a || i,
              onApply: (C) => void I(C),
              onFind: () => j(!0),
              status: a ? `Applying action to ${ie}…` : "",
              summary: /* @__PURE__ */ r("p", { className: "dq-bar-target", children: n ? `${n} selected` : "This video" })
            }
          )
        ] }),
        E && /* @__PURE__ */ r(
          wi,
          {
            actions: t.actions,
            trees: d,
            isDisabled: te,
            canStay: !1,
            onApply: (C) => {
              j(!1), I(C);
            },
            onClose: () => j(!1)
          }
        )
      ]
    }
  );
}
async function Fu() {
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
function Eo({ label: e }) {
  return /* @__PURE__ */ c("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ r(Vc, { className: "dq-spin" }),
    e
  ] });
}
function Co({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ c("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ r(Zn, {}),
    /* @__PURE__ */ r("p", { children: e }),
    /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const _u = { components: { DataQualityPage: Au } };
export {
  Au as DataQualityPage,
  _u as default,
  rr as objectFiltersEqual
};
