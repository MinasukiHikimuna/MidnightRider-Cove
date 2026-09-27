import { jsxs as c, Fragment as be, jsx as r } from "react/jsx-runtime";
import { useRef as x, useLayoutEffect as mn, useMemo as Ae, useState as q, useEffect as z, useId as Ut, useSyncExternalStore as zi, Fragment as Wi, useCallback as pn } from "react";
import { useKeySequence as ms, EntityReferenceMultiSelector as gn, SortableList as Qi, EntityDetailTabs as gs, TagBadge as bs, DetailListToolbar as Nr, PERFORMER_CRITERIA as $a, AUDIO_CRITERIA as Hi, VIDEO_CRITERIA as Ma, NarrativeText as ws, AUDIO_SORT_OPTIONS as ys, VIDEO_SORT_OPTIONS as Yi, AudioPlayer as vs, VideoPlayer as Xi, formatDuration as Zi, FilterDialog as Ns, getResolutionLabel as qs, TAG_CRITERIA as Ss, TAG_SORT_OPTIONS as Es, TagTile as Cs, VideoCard as As } from "@cove/runtime/components";
import { Search as Xr, Pencil as Cr, Ban as ba, Pin as ks, Plus as Fa, GripVertical as eo, AlertTriangle as nr, Copy as Ts, Trash2 as to, ChevronDown as no, X as Ar, Tags as Rs, Headphones as ro, Film as Vr, ChevronLeft as Zr, RectangleHorizontal as Is, LayoutGrid as xa, MoreHorizontal as Os, ChevronRight as Pa, Layers as pi, Check as La, Undo2 as $s, Flag as Jr, RefreshCw as Ms, Users as Fs, Save as ao, RotateCcw as io, ExternalLink as oo, Tag as xs, SkipForward as Ps, Settings as Ls, Loader2 as Ds, Upload as _s, List as js, Grid3X3 as Us } from "@cove/runtime/lucide-react";
import { extensionFetch as Gs } from "@cove/runtime/api";
const Da = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, _a = Object.keys(
  Da
);
function qr(e) {
  return e === "excludes" || e === "excludesAll";
}
function ja(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
const Bs = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function qe(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function wr(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function ke(e) {
  return wr(je(e));
}
function Ks(e) {
  return je(e) === "video";
}
function je(e) {
  return e.entityType ?? "video";
}
const ar = [
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
function kr(e) {
  return qe(e) && !so(e.occurrence) ? "Complete the optional occurrence condition before saving." : !Ks(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : je(e) !== "tag" && e.actions.some(
    (t) => Ua(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => bn(t, je(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const Vs = {
  video: 1e3,
  audio: 250
};
function bt(e, t = "video") {
  const n = (a, i) => Number.isFinite(Number(a)) && Number(a) > 0 ? Math.floor(Number(a)) : i;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(Vs[t], n(e.perPage, 40))
    )
  };
}
function hi(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function _t(e) {
  const { page: t, ...n } = e.view.filter, a = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    qe(e) ? [e.entityType, ...a, e.occurrence] : je(e) === "video" ? a : [je(e), ...a]
  );
}
function bn(e, t) {
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
  ) && !Ua(e) : !1;
}
function Js(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function hn(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function ea(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Tn(e) {
  return "steps" in e ? e.steps.some((t) => hn(t.mode)) : !1;
}
function Ua(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (hn(n.mode))
      for (const a of n.tagIds) {
        const i = t.get(a);
        if (i && i !== n.mode) return !0;
        t.set(a, n.mode);
      }
  return !1;
}
function Tr(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || Bs.includes(n.entityType)) && (!Js(n.entityType) || so(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && zs(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (a) => typeof a == "string"
    )) && Array.isArray(n.actions) && n.actions.every(
      (a) => typeof (a == null ? void 0 : a.id) == "string" && typeof a.label == "string" && (a.shortcut === void 0 || typeof a.shortcut == "string") && (n.entityType === "tag" ? "effect" in a && !("steps" in a) && bn(a, "tag") : "steps" in a && !("effect" in a) && Array.isArray(a.steps) && a.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && bn(a, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => kr(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function zs(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (a) => ["date", "studio", "performers", "tags"].includes(a)
  )) && [n.annotationParents, n.binParents].every(
    (a) => a === void 0 || Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function wa(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const a of e)
    for (const i of a)
      n.has(i.id) || (n.add(i.id), t.push(i));
  return t;
}
function so(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (a) => Array.isArray(a) && a.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(a).size === a.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && _a.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function mi(e, t) {
  return e.size > 0 ? [...e].sort((n, a) => n - a) : t == null ? [] : [t];
}
function gi(e, t, n, a) {
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
function Ws(e, t) {
  const n = new Set(e), a = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    a ? n.delete(i) : n.add(i);
  return n;
}
function Qs(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function Hs(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Ys(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function Xs(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Zs(e, t) {
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
const co = "ext:com.midnightrider.data-quality:configuration", ec = "ext:cove-data-quality:video-reviews", ya = "ext:com.midnightrider.data-quality:progress", Rr = /* @__PURE__ */ new Map(), _r = /* @__PURE__ */ new Map(), Bn = (e, t) => e.includes("*") || e.includes(t), zr = (e) => ae(`/api/savedfilters?mode=${encodeURIComponent(e)}`), tc = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function va(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function er(e) {
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
    reviews: Tr(JSON.stringify(t.reviews)),
    deletedIds: va(t.deletedIds),
    importedIds: va(t.importedIds)
  };
}
function nc(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const a = /* @__PURE__ */ new Set();
  for (const i of t) {
    const o = localStorage.getItem(i);
    if (o !== null) {
      const s = Tr(o);
      n ?? (n = s), s.forEach((l) => a.add(l.id));
    }
    va(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((s) => a.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...a],
    present: n !== void 0
  };
}
async function lo(e) {
  const t = await ae("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function uo(e, t) {
  const n = (_r.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return _r.set(e, n), n.finally(() => {
    _r.get(e) === n && _r.delete(e);
  }).catch(() => {
  }), n;
}
let mr = null;
function rc() {
  if (mr) return mr;
  const e = ac();
  return mr = e, e.finally(() => {
    mr === e && (mr = null);
  }).catch(() => {
  }), e;
}
async function ac() {
  var m;
  const e = await ae("/api/auth/me"), t = String(e.user.id), n = `cove-data-quality-v2:${t}`, a = Bn(e.permissions, "savedfilters.read"), i = a && Bn(e.permissions, "savedfilters.write"), o = a ? (await zr(co)).filter((v) => v.name === "Data Quality configuration").sort((v, w) => v.id - w.id) : [];
  if (o.length > 1) {
    const v = (w) => {
      const { revision: E, ...$ } = er(w.uiOptions);
      return JSON.stringify($);
    };
    if (o.some((w) => v(w) !== v(o[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (i)
      for (const w of o.slice(1))
        await ae(`/api/savedfilters/${w.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${w.id}` })
        });
    o.splice(1);
  }
  let s = o.length ? er(o[0].uiOptions) : tc();
  const l = localStorage.getItem(`${n}:migrated`) === "true", d = localStorage.getItem(n), f = localStorage.getItem(`${n}:local-only`) === "true";
  !o.length && d && (s = er(d));
  let h = !o.length;
  if (o.length && f && d) {
    const v = er(d);
    if (v.reviews.some((E) => {
      const $ = s.reviews.find((k) => k.id === E.id);
      return $ && JSON.stringify($) !== JSON.stringify(E);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const w = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...v.deletedIds])
    ];
    s = {
      ...s,
      reviews: wa(s.reviews, v.reviews).filter(
        (E) => !w.includes(E.id)
      ),
      deletedIds: w,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...v.importedIds])
      ]
    }, h = !0;
  }
  if (!l) {
    const v = JSON.stringify(s), w = nc(t);
    if (o.length && w.reviews.some((C) => {
      const S = s.reviews.find((D) => D.id === C.id);
      return S && JSON.stringify(S) !== JSON.stringify(C);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const E = a ? (await zr(ec)).flatMap(
      (C) => Tr(C.uiOptions ?? "[]")
    ) : [], $ = w.known.filter(
      (C) => !w.reviews.some((S) => S.id === C)
    ), k = /* @__PURE__ */ new Set([...s.deletedIds, ...$]);
    s = {
      ...s,
      reviews: wa(
        w.reviews,
        s.reviews,
        E.filter(
          (C) => !w.known.includes(C.id) && !s.importedIds.includes(C.id)
        )
      ).filter((C) => !k.has(C.id)),
      deletedIds: [...k],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...w.known,
          ...E.map((C) => C.id)
        ])
      ]
    }, h || (h = JSON.stringify(s) !== v);
  }
  const g = {
    userId: t,
    recordId: (m = o[0]) == null ? void 0 : m.id,
    config: s,
    readable: a,
    writable: i,
    durable: i
  };
  if (Rr.set(n, g), h && i) {
    const v = s;
    o.length && (g.config = er(o[0].uiOptions)), await fo(n, v), s = g.config;
  } else o.length || (localStorage.setItem(n, JSON.stringify(s)), !a && (!l || f) && localStorage.setItem(`${n}:local-only`, "true"));
  if (!a) localStorage.setItem(`${n}:migrated`, "true");
  else if (i)
    try {
      localStorage.setItem(`${n}:migrated`, "true");
    } catch {
    }
  return {
    reviews: s.reviews,
    storageKey: n,
    canWrite: Bn(e.permissions, "videos.write"),
    canWriteVideos: Bn(e.permissions, "videos.write"),
    canWriteAudios: Bn(e.permissions, "audios.write"),
    canWriteTags: Bn(e.permissions, "tags.write"),
    canReadTagGroups: Bn(e.permissions, "taggroups.read"),
    canConfigure: !a || i,
    storageNotice: a ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function fo(e, t) {
  const n = Rr.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const a = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await lo(n), n.recordId != null) {
      const o = await ae(
        `/api/savedfilters/${n.recordId}`
      );
      if (er(o.uiOptions).revision !== n.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await ae(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: co,
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
function ic(e, t) {
  return Tr(JSON.stringify(t)), uo(e, async () => {
    const n = Rr.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const a = n.config.reviews.filter((i) => !t.some((o) => o.id === i.id)).map((i) => i.id);
    await fo(e, {
      ...n.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...a])
      ].filter((i) => !t.some((o) => o.id === i))
    });
  });
}
function bi(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, a]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(a)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function oc(e, t) {
  const n = Rr.get(e);
  if (!n) return null;
  const a = localStorage.getItem(`${e}:progress:${t}`), i = a ? bi(a) : null;
  if (!n.readable) return i;
  const o = (await zr(ya)).find(
    (l) => l.name === t
  ), s = o ? bi(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function sc(e, t, n) {
  const a = `${e}:progress:${t}`;
  try {
    localStorage.setItem(a, JSON.stringify(n));
  } catch {
  }
  return uo(a, async () => {
    const i = Rr.get(e);
    if (!(i != null && i.writable)) return;
    await lo(i);
    const o = (await zr(ya)).find(
      (s) => s.name === t
    );
    await ae(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: ya,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function Rn(e) {
  return e === "audio" ? "audios" : "videos";
}
const cc = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Yt(e) {
  return cc[e];
}
const Wr = "confirmed_absent_tags", Ga = "Confirmed absent tags", ta = "confirmed_absent_occurrence_tags", po = {
  key: Wr,
  label: Ga,
  type: "tag",
  subject: "tag assessments"
}, Ba = {
  key: ta,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, lc = {
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
function wn(e) {
  return Array.isArray(e) ? e.map(wn) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? lc[n] ?? n : t === "key" && typeof n == "string" && [
        Wr,
        ta
      ].includes(n.toLowerCase()) ? n.toLowerCase() : wn(n)
    ])
  ) : e;
}
async function ho(e, t, n) {
  const a = new Headers(t.headers);
  !(t.body instanceof FormData) && !a.has("Content-Type") && a.set("Content-Type", "application/json");
  const i = await Gs(e, { ...t, headers: a });
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
async function ae(e, t = {}) {
  return await ho(e, t, "fail");
}
function dc(e, t = {}) {
  return ho(e, t, "null");
}
const uc = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let fc = 0;
function Na(e, t) {
  return ae(
    `/api/${Rn(e)}/${t}?dqRead=${uc}-${++fc}`,
    { cache: "no-store" }
  );
}
function mo(e, t) {
  const n = { ...e.view.objectFilter }, a = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    wn({
      findFilter: bt(t, ke(e)),
      objectFilter: n,
      filterExpression: a
    })
  );
}
async function yr(e, t, n) {
  return ae(
    `/api/${Rn(ke(e))}/find`,
    { method: "POST", signal: n, body: mo(e, t) }
  );
}
async function pc(e, t, n) {
  return (await ae(
    `/api/${Rn(ke(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: mo(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function wi(e, t, n) {
  const a = { ...e.view.objectFilter };
  return delete a._filterExpression, ae("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      wn({
        findFilter: bt(t),
        objectFilter: a
      })
    )
  });
}
function hc(e) {
  return ae("/api/taggroups", { signal: e });
}
function qa(e, t, n = 1280) {
  return `/api/${Rn(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function Sa(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function yi(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function mc(e) {
  return `/api/stream/video/${e}/preview`;
}
function gc(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function bc(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function na(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e) {
    await ae(`/api/tags/${a}`, { signal: t }), n.add(a);
    for (let i = 1; ; i++) {
      const o = await ae("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          wn({
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
async function Ka(e, t) {
  const n = ea(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await na(i.tagIds, t)).filter(
          (o) => !n.has(o)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function wc(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function Va(e, t) {
  const a = (await ae("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!a)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = wc(e, a);
  return i ? { kind: "incompatible", message: i } : a.entityTypes.includes(t) ? { kind: "ready", definition: a, message: "" } : {
    kind: "missing",
    message: `Add ${Yt(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: a
  };
}
async function go(e, t) {
  const n = await Va(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await ae(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await ae("/api/custom-fields", {
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
function bo(e = "video") {
  return Va(po, e);
}
function yc(e = "video") {
  return go(po, e);
}
function wo(e = "video") {
  return Va(Ba, e);
}
function vc(e = "video") {
  return go(Ba, e);
}
function Qr(e) {
  return [...new Set(e)];
}
function yo(e, t) {
  const n = e.customFields ?? {}, a = Object.keys(n).find(
    (o) => o.toLowerCase() === ta
  ), i = a === void 0 ? [] : n[a];
  return Qr(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function Nc(e) {
  let t;
  try {
    t = await wo(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${Ba.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function qc(e, t, n, a, i, o) {
  await ae(`/api/${Rn(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: Qr(i).map((s) => `${a}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function Sc(e, t, n) {
  const a = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${Ga} custom field is not available.`
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
async function vo(e, t, n) {
  if (!bn(t) || n.length === 0 || n.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${Yt(e).many} and configure a valid action first.`
    );
  let a = null;
  if (Tn(t)) {
    let d;
    try {
      d = await bo(e);
    } catch (f) {
      throw new Error(
        `Could not verify the ${Ga} custom field. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    a = d.definition.key;
  }
  const i = Qr(n), o = (await Ka(t)).map((d) => ({
    mode: d.mode,
    tagIds: Qr(d.tagIds)
  })), l = [
    ...o.filter((d) => !hn(d.mode)),
    ...o.filter((d) => hn(d.mode))
  ].map(
    (d) => Sc(d, i, a)
  );
  for (let d = 0; d < l.length; d++)
    try {
      await ae(`/api/${Rn(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(l[d])
      });
    } catch (f) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${Yt(e).many} before retrying. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
}
async function Ec(e, t) {
  if (!bn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await ae("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const No = "-", Cc = "Ctrl+a", Ac = "Ctrl/⌘A";
function jr(e) {
  return (t) => {
    t != null && t.repeat || e();
  };
}
function Ja({
  surface: e,
  enabled: t,
  actionCount: n,
  onAction: a,
  onFind: i,
  onSelectAll: o
}) {
  const s = x({ onAction: a, onFind: i, onSelectAll: o });
  mn(() => {
    s.current = { onAction: a, onFind: i, onSelectAll: o };
  });
  const l = Math.max(0, Math.min(n, ar.length)), d = !!i && n > 0, f = e === "local" && !!o, h = Ae(() => {
    const g = [];
    return f && g.push({
      keys: Cc,
      surface: "local",
      action: jr(() => {
        var m, v;
        return (v = (m = s.current).onSelectAll) == null ? void 0 : v.call(m);
      })
    }), d && g.push({
      keys: No,
      surface: e,
      action: jr(() => {
        var m, v;
        return (v = (m = s.current).onFind) == null ? void 0 : v.call(m);
      })
    }), ar.slice(0, l).forEach(
      (m, v) => g.push(
        {
          keys: m,
          surface: e,
          action: jr(() => s.current.onAction(v, !1))
        },
        {
          keys: `Shift+${m}`,
          surface: e,
          action: jr(() => s.current.onAction(v, !0))
        }
      )
    ), g;
  }, [e, l, d, f]);
  ms(h, t);
}
const kc = {
  action: (e) => ar[e] ?? "",
  find: No,
  selectAll: Ac
};
function In() {
  return kc;
}
const Tc = 600 * 1e3, za = /* @__PURE__ */ new Map(), qo = /* @__PURE__ */ new Map(), kn = /* @__PURE__ */ new Map();
function So(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = qo.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function Eo(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && qo.set(e.tagGroupId, e.tagGroupSortOrder), za.set(e.id, { tag: e, at: Date.now() });
}
function Co(e) {
  const t = za.get(e);
  if (!(!t || Date.now() - t.at > Tc))
    return So(t.tag);
}
function Ao(e) {
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
function Ea(e) {
  var t;
  for (const n of e) {
    const a = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && a && Eo(Ao({ ...n, name: a }));
  }
}
function Rc(e) {
  const t = kn.get(e);
  if (t) return t;
  const n = new AbortController(), a = {
    controller: n,
    waiters: 0,
    promise: ae(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var h, g;
        const o = ((h = i == null ? void 0 : i.name) == null ? void 0 : h.trim()) || null;
        if (kn.get(e) === a && kn.delete(e), !o) return null;
        const s = Ao({ ...i, id: e, name: o }), l = (g = za.get(e)) == null ? void 0 : g.tag, d = (l == null ? void 0 : l.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (d ? l == null ? void 0 : l.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (l == null ? void 0 : l.hasImage),
          imagePath: s.imagePath ?? (l == null ? void 0 : l.imagePath)
        };
        return Eo(f), So(f);
      },
      () => (kn.get(e) === a && kn.delete(e), null)
    )
  };
  return kn.set(e, a), a;
}
function vi() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function la(e) {
  const t = {};
  for (const n of e) {
    const a = Co(n);
    a !== void 0 && (t[n] = a);
  }
  return t;
}
function Ic(e, t) {
  if (t != null && t.aborted) return Promise.reject(vi());
  const n = {}, a = [];
  for (const i of new Set(e)) {
    const o = Co(i);
    if (o !== void 0) n[i] = o;
    else {
      const s = Rc(i);
      s.waiters += 1, a.push({ id: i, entry: s });
    }
  }
  return a.length ? new Promise((i, o) => {
    let s = !1;
    const l = () => {
      for (const { id: f, entry: h } of a)
        h.waiters -= 1, h.waiters === 0 && kn.get(f) === h && (kn.delete(f), h.controller.abort());
    }, d = () => {
      s || (s = !0, l(), o(vi()));
    };
    t == null || t.addEventListener("abort", d, { once: !0 }), Promise.all(
      a.map(
        ({ id: f, entry: h }) => h.promise.then((g) => [f, g])
      )
    ).then((f) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", d), l();
        for (const [h, g] of f) n[h] = g;
        i(n);
      }
    });
  }) : Promise.resolve(n);
}
function ko(e) {
  const t = {};
  for (const [n, a] of Object.entries(e)) t[Number(n)] = (a == null ? void 0 : a.name) ?? null;
  return t;
}
function Wa(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, a] = q(() => ({
    key: t,
    tags: la(da(t))
  }));
  return z(() => {
    const i = da(t), o = la(i);
    if (a({ key: t, tags: o }), i.every((l) => l in o)) return;
    const s = new AbortController();
    return Ic(i, s.signal).then(
      (l) => a({ key: t, tags: l }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : la(da(t));
}
function sr(e) {
  const t = Wa(e);
  return Ae(() => ko(t), [t]);
}
function da(e) {
  return e ? e.split(",").map(Number) : [];
}
function Oc(e, t, n = !1) {
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
function Jn(e, t, n = [], a) {
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
  const i = ea(e), o = (s) => i.has(s) || [...i].some((l) => {
    var d;
    return (d = a == null ? void 0 : a.get(s)) == null ? void 0 : d.includes(l);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (l) => Oc(
        s.mode,
        t[l] === void 0 ? "…" : t[l] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && o(l)
      )
    )
  );
}
function ra(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function Qa({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  canStay: i = !0,
  onApply: o,
  onClose: s
}) {
  const [l, d] = q(""), [f, h] = q(0), g = x(null), m = x(null), v = x(null), w = x(null), E = x(null), $ = Ut(), k = sr(Ae(() => ra(e), [e])), C = In(), S = Ae(() => {
    const F = l.trim().toLocaleLowerCase();
    return e.map((ne, le) => ({ action: ne, index: le, key: C.action(le) })).filter((ne) => !F || ne.action.label.toLocaleLowerCase().includes(F));
  }, [e, C, l]), D = S.length ? Math.min(f, S.length - 1) : -1, _ = (F) => `${$}-option-${F}`;
  mn(() => {
    var F, ne, le;
    return w.current = document.activeElement, E.current = ((ne = (F = v.current) == null ? void 0 : F.parentElement) == null ? void 0 : ne.closest('[role="dialog"]')) ?? null, (le = g.current) == null || le.focus({ preventScroll: !0 }), () => {
      var A;
      const Z = w.current;
      Z instanceof HTMLElement && Z.isConnected && Z.focus({ preventScroll: !0 }), document.activeElement !== Z && ((A = E.current) != null && A.isConnected) && E.current.focus({ preventScroll: !0 });
    };
  }, []), z(() => {
    var F, ne, le;
    D < 0 || (le = (ne = (F = m.current) == null ? void 0 : F.querySelector(`[id="${_(S[D].index)}"]`)) == null ? void 0 : ne.scrollIntoView) == null || le.call(ne, { block: "nearest" });
  }, [D, S]);
  function X(F, ne) {
    !F || a != null && a(F.action) || o(F.action, i && ne);
  }
  function Q(F) {
    var ne;
    if (F.stopPropagation(), F.key === "Escape")
      F.preventDefault(), s();
    else if (F.key === "Enter")
      F.preventDefault(), F.repeat || X(S[D], F.shiftKey);
    else if (F.key === "ArrowDown" || F.key === "ArrowUp") {
      if (F.preventDefault(), !S.length) return;
      const le = F.key === "ArrowDown" ? 1 : -1;
      h((D + le + S.length) % S.length);
    } else F.key === "Tab" && (F.preventDefault(), (ne = g.current) == null || ne.focus());
  }
  return /* @__PURE__ */ c(be, { children: [
    /* @__PURE__ */ r("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: s }),
    /* @__PURE__ */ c(
      "div",
      {
        ref: v,
        role: "dialog",
        "aria-label": "Find an action",
        className: "dq-find-action",
        onKeyDown: Q,
        onMouseDown: (F) => {
          F.target !== g.current && F.preventDefault();
        },
        children: [
          /* @__PURE__ */ c("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ r(Xr, { "aria-hidden": "true" }),
            /* @__PURE__ */ r(
              "input",
              {
                ref: g,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${$}-list`,
                "aria-activedescendant": D >= 0 ? _(S[D].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: l,
                onChange: (F) => {
                  d(F.target.value), h(0);
                }
              }
            ),
            /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          S.length ? /* @__PURE__ */ r(
            "ul",
            {
              ref: m,
              id: `${$}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: S.map((F, ne) => /* @__PURE__ */ r("li", { role: "none", children: /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: _(F.index),
                  tabIndex: -1,
                  "aria-selected": ne === D,
                  disabled: (a == null ? void 0 : a(F.action)) ?? !1,
                  onClick: (le) => X(F, le.shiftKey),
                  children: [
                    F.key ? /* @__PURE__ */ r("kbd", { children: F.key }) : /* @__PURE__ */ r("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ r("span", { className: "dq-find-label", children: F.action.label }),
                    /* @__PURE__ */ r("span", { className: "dq-find-effect", children: Jn(F.action, k, t, n).map(
                      (le, Z) => /* @__PURE__ */ r("span", { "data-effect-tone": le.tone, children: le.text }, Z)
                    ) })
                  ]
                }
              ) }, F.action.id))
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
const Ur = (e) => e >= "0" && e <= "9";
function Ni(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function qi(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, a = 0;
  for (; n < e.length && a < t.length; ) {
    if (Ur(e[n]) && Ur(t[a])) {
      const l = n, d = a;
      for (; n < e.length && Ur(e[n]); ) n++;
      for (; a < t.length && Ur(t[a]); ) a++;
      const f = e.slice(l, n).replace(/^0+/, ""), h = t.slice(d, a).replace(/^0+/, "");
      if (f.length !== h.length) return f.length < h.length ? -1 : 1;
      if (f !== h) return f < h ? -1 : 1;
      continue;
    }
    const o = Ni(e[n]), s = Ni(t[a]);
    if (o !== s) return o < s ? -1 : 1;
    n++, a++;
  }
  const i = e.length - n - (t.length - a);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function To(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, a = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(a(e) - a(t)) || qi(e.tagGroupName, t.tagGroupName) || qi(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function Vn(e) {
  return [...e].sort(To);
}
function $c(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const a of n.steps)
        a.mode === "REMOVE_TREE" && a.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function Ro(e, t, n) {
  const a = ea(e), i = [], o = [];
  for (const m of e.steps) {
    if (m.mode !== "REMOVE_TREE") {
      o.push(m);
      continue;
    }
    const v = m.tagIds.flatMap((w) => {
      const E = n.get(w);
      return E || i.push(w), E ?? [w];
    });
    o.push({ mode: "REMOVE", tagIds: v.filter((w) => !a.has(w)) });
  }
  const s = [
    ...o.filter((m) => !hn(m.mode)),
    ...o.filter((m) => hn(m.mode))
  ], l = new Set(t.ids), d = new Set(t.absent);
  for (const m of s)
    for (const v of m.tagIds)
      switch (m.mode) {
        case "ADD":
          l.add(v);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          l.delete(v);
          break;
        case "MARK_PRESENT":
          l.add(v), d.delete(v);
          break;
        case "MARK_ABSENT":
          l.delete(v), d.add(v);
          break;
        case "CLEAR_ABSENCE":
          d.delete(v);
          break;
      }
  const f = new Set(t.ids), h = new Set(t.absent), g = [...new Set(e.steps.flatMap((m) => m.tagIds))];
  return {
    added: g.filter((m) => l.has(m) && !f.has(m)),
    removed: [...f].filter((m) => !l.has(m)),
    markedAbsent: g.filter((m) => d.has(m) && !h.has(m)),
    absenceCleared: [...h].filter((m) => !d.has(m)),
    unresolvedTrees: [...new Set(i)]
  };
}
function Mc(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const a of e.applications)
      n.has(a.tag.id) || n.set(a.tag.id, a.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, a) => ({ id: n, name: e.names[a] ?? "" }));
  return Vn(t);
}
function Io(e) {
  const t = $c(e).sort((s, l) => s - l).join(","), [n, a] = q(() => /* @__PURE__ */ new Map()), i = x(/* @__PURE__ */ new Set()), o = x(!0);
  return z(() => (o.current = !0, () => {
    o.current = !1;
  }), []), z(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const l of s)
      i.current.has(l) || (i.current.add(l), na([l]).then(
        (d) => {
          o.current && a((f) => new Map(f).set(l, d));
        },
        () => {
          i.current.delete(l);
        }
      ));
  }, [t]), n;
}
function Oo() {
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
function Ha(e) {
  return zi(e.subscribe, e.get, e.get);
}
const Si = [
  { indent: 0, slots: ua(0, 11), fixed: [] },
  { indent: 1, slots: ua(11, 22), fixed: [] },
  { indent: 2, slots: ua(22, 27), fixed: ["n", "m", ",", "."] }
];
function ua(e, t) {
  return Array.from({ length: t - e }, (n, a) => e + a);
}
function Ei(e, t) {
  return e === "g" ? "Go to…" : e === "f" ? t === "video" ? "Fullscreen · filters" : "Filters" : t === "video" && e === "k" ? "Play / pause" : t === "video" && e === "m" ? "Mute" : "";
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
function Ci(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function Fc({
  actions: e,
  mediaKind: t,
  isDisabled: n,
  busy: a,
  tags: i,
  trees: o,
  preview: s,
  onApply: l,
  onFind: d,
  findDisabled: f,
  paused: h = !1
}) {
  const g = In(), m = Ut(), v = sr(
    Ae(() => e.flatMap((S) => S.steps.flatMap((D) => D.tagIds)), [e])
  ), w = Si.filter((S) => S.slots.some((D) => D < e.length)), E = w.length === Si.length, $ = Math.max(0, e.length - ar.length), k = (S) => ({
    onMouseEnter: () => s.set(S),
    onMouseLeave: () => s.clear(S),
    onFocus: () => s.set(S),
    onBlur: (D) => {
      D.currentTarget.contains(D.relatedTarget) || s.clear(S);
    }
  }), C = (S) => {
    const D = e[S], _ = g.action(S);
    if (!D) {
      const F = Ei(_, t);
      return /* @__PURE__ */ c(
        "div",
        {
          className: `dq-pad-slot dq-pad-free${F ? " dq-pad-reserved" : ""}`,
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ r(ct, { binding: _ }),
            F && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: F })
          ]
        },
        S
      );
    }
    const X = n(D), Q = `${m}-effect-${S}`;
    return /* @__PURE__ */ c("div", { className: "dq-pad-slot", ...h ? {} : k(D), children: [
      /* @__PURE__ */ r("span", { id: Q, className: "dq-sr-only", children: Jn(D, v, [], o).map((F) => F.text).join(", ") }),
      /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: D.label,
          "aria-keyshortcuts": _,
          "aria-describedby": Q,
          disabled: X,
          onClick: (F) => l(D, F.shiftKey),
          children: [
            /* @__PURE__ */ r(ct, { binding: _ }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-pad-label", children: D.label }),
            Ci(D) && " ",
            Ci(D) && /* @__PURE__ */ c("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(ba, { "aria-hidden": "true" }),
              "absent"
            ] })
          ]
        }
      ),
      D.steps.length > 0 && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-pad-pin",
          "aria-label": `Apply and stay: ${D.label}`,
          title: "Apply and stay (Shift)",
          disabled: X,
          onClick: () => l(D, !0),
          children: /* @__PURE__ */ r(ks, { "aria-hidden": "true" })
        }
      )
    ] }, S);
  };
  return /* @__PURE__ */ c(
    "section",
    {
      className: `dq-pad${h ? " dq-pad-paused" : ""}`,
      "aria-label": h ? "Actions, paused while editing" : "Actions",
      "aria-busy": a || void 0,
      children: [
        /* @__PURE__ */ c("div", { className: "dq-pad-header", children: [
          h ? /* @__PURE__ */ c("p", { className: "dq-pad-paused-note", children: [
            /* @__PURE__ */ r(Cr, { "aria-hidden": "true" }),
            "Actions are paused while you edit the review"
          ] }) : /* @__PURE__ */ c(be, { children: [
            /* @__PURE__ */ r(
              xc,
              {
                actions: e,
                names: v,
                tags: i,
                trees: o,
                preview: s,
                extra: $,
                findKey: g.find
              }
            ),
            /* @__PURE__ */ c("span", { className: "dq-pad-hint", children: [
              /* @__PURE__ */ r("kbd", { className: "dq-key", children: "Shift" }),
              /* @__PURE__ */ r("span", { children: "+ key applies and stays" })
            ] })
          ] }),
          !E && /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "dq-pad-find-button",
              "aria-label": "Find action",
              "aria-keyshortcuts": g.find,
              disabled: f,
              onClick: d,
              children: [
                /* @__PURE__ */ r(ct, { binding: g.find }),
                /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "Find action" })
              ]
            }
          )
        ] }),
        w.map((S) => /* @__PURE__ */ c("div", { className: "dq-pad-row", "data-indent": S.indent, children: [
          S.slots.map(C),
          S.fixed.map((D) => {
            const _ = Ei(D, t);
            return /* @__PURE__ */ c(
              "div",
              {
                className: `dq-pad-slot dq-pad-free dq-pad-fixed${_ ? " dq-pad-reserved" : ""}`,
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ r(ct, { binding: D }),
                  _ && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: _ })
                ]
              },
              D
            );
          }),
          S.fixed.length > 0 && /* @__PURE__ */ r("div", { className: "dq-pad-slot", children: /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": $ ? `Find action, ${$} more` : "Find action",
              "aria-keyshortcuts": g.find,
              disabled: f,
              onClick: d,
              children: [
                /* @__PURE__ */ r(ct, { binding: g.find }),
                /* @__PURE__ */ c("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ r(Xr, { "aria-hidden": "true" }),
                  $ ? `${$} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, S.indent))
      ]
    }
  );
}
function xc({
  actions: e,
  names: t,
  tags: n,
  trees: a,
  preview: i,
  extra: o,
  findKey: s
}) {
  const l = In(), d = Ha(i), f = d ? e.indexOf(d) : -1;
  if (!d || f < 0)
    return /* @__PURE__ */ c("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      o > 0 && /* @__PURE__ */ c(be, { children: [
        ` · ${ar.length} on keys, ${o} more under `,
        /* @__PURE__ */ r(ct, { binding: s })
      ] })
    ] });
  const h = l.action(f), g = n && d.steps.length ? Ro(d, n, a) : null, m = g && !g.unresolvedTrees.length && ![g.added, g.removed, g.markedAbsent, g.absenceCleared].some(
    (v) => v.length
  );
  return /* @__PURE__ */ c("p", { className: "dq-pad-effect", children: [
    h && /* @__PURE__ */ r(ct, { binding: h }),
    /* @__PURE__ */ r("strong", { children: d.label }),
    Jn(d, t, [], a).map((v, w) => /* @__PURE__ */ r("span", { "data-effect-tone": v.tone, children: v.text }, w)),
    m && /* @__PURE__ */ r("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function $o({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  busy: i,
  onApply: o,
  onFind: s,
  summary: l,
  hints: d,
  notices: f,
  status: h,
  className: g = "",
  paused: m = !1
}) {
  const v = In(), w = Ut(), E = sr(Ae(() => ra(e), [e])), [$] = q(() => Oo()), k = x(null), C = Pc(k, e), S = e.slice(0, ar.length), D = e.length - S.length, _ = (Q) => Jn(Q, E, t, n).map((F) => F.text).join(", "), X = (Q) => ({
    onMouseEnter: () => $.set(Q),
    onMouseLeave: () => $.clear(Q),
    onFocus: () => $.set(Q),
    onBlur: (F) => {
      F.currentTarget.contains(F.relatedTarget) || $.clear(Q);
    }
  });
  return /* @__PURE__ */ c(
    "section",
    {
      ref: k,
      className: `dq-action-bar${C ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${m ? " dq-bar-paused" : ""}${g ? ` ${g}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ r("div", { className: "dq-bar-summary", children: l }),
        /* @__PURE__ */ r("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ c("div", { className: "dq-bar-tiles", "aria-busy": i || void 0, children: [
          S.map((Q, F) => {
            const ne = v.action(F);
            return /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-bar-tile",
                title: Q.label,
                "aria-keyshortcuts": ne || void 0,
                "aria-describedby": `${w}-effect-${F}`,
                disabled: m || a(Q),
                onClick: () => o(Q),
                ...m ? {} : X(Q),
                children: [
                  ne && /* @__PURE__ */ r(ct, { binding: ne }),
                  " ",
                  /* @__PURE__ */ r("span", { className: "dq-bar-label", children: Q.label })
                ]
              },
              Q.id
            );
          }),
          e.length > 0 ? /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              className: "dq-bar-tile dq-bar-find",
              "aria-label": D > 0 ? `Find action, ${D} more` : "Find action",
              "aria-keyshortcuts": v.find,
              disabled: m,
              onClick: s,
              children: [
                /* @__PURE__ */ r(ct, { binding: v.find, hidden: !0 }),
                /* @__PURE__ */ r(Xr, { "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-bar-label", children: D > 0 ? `${D} more` : "Find action" })
              ]
            }
          ) : /* @__PURE__ */ r("p", { className: "dq-bar-empty", children: "This review has no actions." })
        ] }),
        d && /* @__PURE__ */ r("p", { className: "dq-bar-hints", children: d }),
        m ? /* @__PURE__ */ c("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ r(Cr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ r(Lc, { actions: S, preview: $, names: E, tagGroups: t, trees: n }),
        f && /* @__PURE__ */ r("div", { className: "dq-bar-notices", children: f }),
        /* @__PURE__ */ r("div", { hidden: !0, children: S.map((Q, F) => /* @__PURE__ */ r("span", { id: `${w}-effect-${F}`, children: _(Q) }, Q.id)) }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: h })
      ]
    }
  );
}
function Pc(e, t) {
  const [n, a] = q(!1);
  return mn(() => {
    var f;
    const i = e.current;
    if (!i || typeof ResizeObserver > "u") return;
    const o = i.querySelector(".dq-bar-summary"), s = () => {
      const h = getComputedStyle(i), g = parseFloat(h.columnGap) || 0, m = i.clientWidth - (parseFloat(h.paddingLeft) || 0) - (parseFloat(h.paddingRight) || 0), v = [...i.querySelectorAll(".dq-bar-tiles > *")].map(
        (C) => C.offsetWidth
      ), w = parseFloat(getComputedStyle(i.querySelector(".dq-bar-tiles")).columnGap) || 0, E = i.querySelector(".dq-bar-hints"), $ = ((o == null ? void 0 : o.offsetWidth) ?? 0) + (E ? E.offsetWidth + g : 0) + 1 + // the divider
      2 * g, k = (C) => {
        let S = 1, D = 0;
        for (const _ of v)
          D > 0 && D + w + _ > C ? (S += 1, D = _) : D += (D > 0 ? w : 0) + _;
        return S;
      };
      a(1 + k(m) < k(m - $));
    }, l = new ResizeObserver(s);
    l.observe(i);
    for (const h of i.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      l.observe(h);
    s();
    let d = !0;
    return (f = document.fonts) == null || f.ready.then(() => {
      d && s();
    }), () => {
      d = !1, l.disconnect();
    };
  }, [e, t]), n;
}
function Lc({
  actions: e,
  preview: t,
  names: n,
  tagGroups: a,
  trees: i
}) {
  const o = In(), s = Ha(t), l = s ? e.indexOf(s) : -1;
  if (!s || l < 0) return null;
  const d = o.action(l);
  return /* @__PURE__ */ c("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    d && /* @__PURE__ */ r(ct, { binding: d }),
    /* @__PURE__ */ r("strong", { children: s.label }),
    Jn(s, n, a, i).map((f, h) => /* @__PURE__ */ r("span", { "data-effect-tone": f.tone, children: f.text }, h))
  ] });
}
const Ai = 1e3;
async function Dc(e, t, n) {
  const a = await ae(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    const f = await ae(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          wn({
            findFilter: {
              page: d,
              perPage: Ai,
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
    for (const h of f.items) i.set(h.id, h);
    if (d * Ai >= f.totalCount) break;
    if (!f.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], s = ke(e), l = qe(e) ? await jc(
    s,
    o.map((d) => d.id),
    n
  ) : o.map((d) => (s === "audio" ? d.audioCount : d.videoCount) ?? 0);
  return {
    parent: { id: t, name: a.name },
    children: o.map((d, f) => ({ id: d.id, name: d.name, uses: l[f] })).sort(
      (d, f) => f.uses - d.uses || d.name.localeCompare(f.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function _c(e) {
  return JSON.stringify(
    wn({
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
async function jc(e, t, n) {
  const a = new Array(t.length).fill(0), i = new AbortController(), o = () => i.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && o(), n == null || n.addEventListener("abort", o, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !i.signal.aborted; ) {
            const l = s++;
            a[l] = (await ae(
              `/api/${Rn(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: _c(t[l])
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
function Uc(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((a) => t.has(a.id) ? !1 : (t.add(a.id), !0))
  }));
}
function Gc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of n.children)
      t.set(a.id, [...t.get(a.id) ?? [], n.parent.id]);
  return t;
}
function Bc(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of ea(n))
      t.set(a, [...t.get(a) ?? [], n]);
  return t;
}
function Kc(e, t) {
  return {
    id: crypto.randomUUID(),
    label: e.name,
    steps: [
      { mode: "ADD", tagIds: [e.id] },
      ...t.length ? [{ mode: "REMOVE_TREE", tagIds: t }] : []
    ]
  };
}
const Vc = (e) => e instanceof Error ? e.message : "Request failed.";
function Jc({
  id: e,
  review: t,
  disabled: n,
  onAdd: a,
  onCancel: i
}) {
  const [o, s] = q([]), [l, d] = q({}), [f, h] = q({}), [g, m] = q({}), v = x(/* @__PURE__ */ new Map());
  z(
    () => () => {
      for (const I of v.current.values()) I.abort();
    },
    []
  );
  const w = Yt(ke(t)), E = qe(t), $ = E ? "performer" : w.one;
  function k(I) {
    var te;
    (te = v.current.get(I)) == null || te.abort();
    const P = new AbortController();
    v.current.set(I, P), d((de) => ({ ...de, [I]: { status: "loading" } })), Dc(t, I, P.signal).then(
      (de) => {
        P.signal.aborted || d((ue) => ({
          ...ue,
          [I]: { status: "ready", group: de }
        }));
      },
      (de) => {
        P.signal.aborted || d((ue) => ({
          ...ue,
          [I]: { status: "failed", message: Vc(de) }
        }));
      }
    );
  }
  function C(I) {
    var W;
    const P = o.filter((he) => !I.includes(he));
    for (const he of P)
      (W = v.current.get(he)) == null || W.abort(), v.current.delete(he);
    const te = (he) => {
      const R = l[he];
      return (R == null ? void 0 : R.status) === "ready" ? R.group.children.map((j) => j.id) : [];
    }, de = new Set(I.flatMap(te)), ue = P.flatMap(te).filter((he) => !de.has(he));
    h(
      (he) => Object.fromEntries(
        Object.entries(he).filter(([R]) => !ue.includes(Number(R)))
      )
    ), m(
      (he) => Object.fromEntries(
        Object.entries(he).filter(([R]) => I.includes(Number(R)))
      )
    ), d(
      (he) => Object.fromEntries(
        Object.entries(he).filter(([R]) => I.includes(Number(R)))
      )
    ), s(I);
    for (const he of I) o.includes(he) || k(he);
  }
  const S = o.flatMap((I) => {
    const P = l[I];
    return (P == null ? void 0 : P.status) === "ready" ? [P.group] : [];
  }), D = S.length === o.length, _ = o.some(
    (I) => {
      var P;
      return (((P = l[I]) == null ? void 0 : P.status) ?? "loading") === "loading";
    }
  ), X = new Map(
    Uc(S).map((I) => [I.parent.id, I])
  ), Q = Gc(S), F = new Map(S.map((I) => [I.parent.id, I.parent.name])), ne = Bc(t.actions), le = (I) => f[I] ?? !ne.has(I), Z = D ? [...X.values()].flatMap(
    (I) => I.children.filter((P) => le(P.id))
  ) : [], A = (I, P) => h((te) => ({
    ...te,
    ...Object.fromEntries(I.children.map((de) => [de.id, P]))
  }));
  return /* @__PURE__ */ c("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ r("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ c("p", { className: "dq-drawer-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      E ? "on performers " : "",
      "first. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ r(
      gn,
      {
        entityType: "tag",
        values: o,
        onChange: C,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    o.map((I) => {
      const P = l[I];
      if (!P || P.status === "loading")
        return /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Loading child tags…" }, I);
      if (P.status === "failed")
        return /* @__PURE__ */ c("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ c("span", { children: [
            "Child tags could not be loaded. ",
            P.message
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: n,
              onClick: () => k(I),
              children: "Retry"
            }
          )
        ] }, I);
      const te = X.get(I);
      if (!te) return null;
      const de = te.parent.name;
      return /* @__PURE__ */ c("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ r("legend", { children: de }),
        P.group.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ c(be, { children: [
          /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: g[I] ?? !1,
                disabled: n,
                onChange: (ue) => m((W) => ({
                  ...W,
                  [I]: ue.target.checked
                }))
              }
            ),
            "Only one per ",
            $,
            ": each action removes every other tag in the ",
            de,
            " tree"
          ] }),
          te.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ c(be, { children: [
            /* @__PURE__ */ c("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${de}`,
                  onClick: () => A(te, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${de}`,
                  onClick: () => A(te, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "dq-child-tags", children: te.children.map((ue) => {
              const W = ne.get(ue.id) ?? [], he = (Q.get(ue.id) ?? []).filter((R) => R !== I).map((R) => `“${F.get(R)}”`);
              return /* @__PURE__ */ c("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: le(ue.id),
                    disabled: n,
                    onChange: (R) => h((j) => ({
                      ...j,
                      [ue.id]: R.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ c("span", { children: [
                  ue.name,
                  " ",
                  /* @__PURE__ */ c("small", { children: [
                    ue.uses.toLocaleString(),
                    " ",
                    ue.uses === 1 ? w.one : w.many
                  ] }),
                  he.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " · Also under ",
                    he.join(", ")
                  ] }),
                  W.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " ",
                    "· Already in “",
                    W[0].label || "New action",
                    "”",
                    W.length > 1 ? ` and ${W.length - 1} more` : ""
                  ] })
                ] })
              ] }, ue.id);
            }) })
          ] })
        ] })
      ] }, I);
    }),
    /* @__PURE__ */ c("div", { className: "dq-row", children: [
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: n || !Z.length,
          onClick: () => a(
            Z.map(
              (I) => Kc(
                I,
                (Q.get(I.id) ?? []).filter(
                  (P) => g[P]
                )
              )
            )
          ),
          children: Z.length ? `Add ${Z.length} action${Z.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-sr-only", children: _ ? "Loading child tags…" : "" })
    ] })
  ] });
}
const zc = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Wc(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function Qc(e, t) {
  if (bn(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (Ua(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function Mo(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function Hc(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function Yc({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: a,
  saving: i,
  expandedId: o,
  onExpand: s,
  reveal: l
}) {
  const d = je(e), f = d !== "tag", h = e.actions, g = In(), m = sr(Ae(() => ra(h), [h])), [v, w] = q(""), [E, $] = q(!1), [k, C] = q(
    null
  ), S = Ut(), D = `${S}-from-tags`, _ = x(null), X = x(null), Q = x(null), F = x(null), ne = x(/* @__PURE__ */ new WeakMap()), le = (j) => {
    let re = ne.current.get(j);
    return re || (re = crypto.randomUUID(), ne.current.set(j, re)), re;
  }, Z = v.trim().toLocaleLowerCase(), A = Z ? h.filter((j) => j.label.toLocaleLowerCase().includes(Z)) : h, I = (j) => t({ ...e, actions: j }), P = (j, re) => I(h.map((Oe, Ee) => Ee === j ? re : Oe));
  function te(j) {
    var re;
    return [...((re = Q.current) == null ? void 0 : re.querySelectorAll("[data-action-id]")) ?? []].find(
      (Oe) => Oe.dataset.actionId === j
    );
  }
  function de(j, re) {
    const Oe = te(j), Ee = Oe == null ? void 0 : Oe.querySelector(
      re === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return Ee == null || Ee.focus(), !!Ee;
  }
  mn(() => {
    var re;
    const j = F.current;
    j && (F.current = null, (j === "add" || !de(j.id, j.part)) && ((re = X.current) == null || re.focus()));
  }), z(() => {
    !l || !o || (A.some((j) => j.id === o) ? de(o, "label") : (w(""), F.current = { id: o, part: "label" }));
  }, [l]);
  function ue() {
    const j = Hc(d);
    w(""), I([...h, j]), s(j.id), F.current = { id: j.id, part: "label" };
  }
  function W(j) {
    const re = h[j], Oe = {
      ...structuredClone(re),
      id: crypto.randomUUID(),
      label: `${re.label} copy`
    };
    I([...h.slice(0, j + 1), Oe, ...h.slice(j + 1)]), s(Oe.id), F.current = { id: Oe.id, part: "label" };
  }
  function he(j) {
    const re = h[j], Oe = A.indexOf(re), Ee = A[Oe + 1] ?? A[Oe - 1];
    I(h.filter((lt, dt) => dt !== j)), o === re.id && s(null), F.current = Ee ? { id: Ee.id, part: "toggle" } : "add";
  }
  function R() {
    $(!1), requestAnimationFrame(() => {
      var j;
      return (j = _.current) == null ? void 0 : j.focus();
    });
  }
  return /* @__PURE__ */ c("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ c("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ c("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ c(
          "button",
          {
            ref: X,
            type: "button",
            className: "dq-header-button",
            onClick: ue,
            children: [
              /* @__PURE__ */ r(Fa, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        f && /* @__PURE__ */ r(
          "button",
          {
            ref: _,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": E,
            "aria-controls": E ? D : void 0,
            onClick: () => {
              C(null), $(!E);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ c("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ r(Xr, { "aria-hidden": "true" }),
          /* @__PURE__ */ r(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: v,
              onChange: (j) => w(j.target.value),
              onKeyDown: (j) => {
                j.key === "Escape" && v && (j.preventDefault(), j.stopPropagation(), w(""));
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-actions-hint", children: "Letters follow this order. Drag a handle, or press Alt + ↑ / ↓, to reorder." }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-actions-status", children: (k == null ? void 0 : k.actions) === h ? `Added ${k.count} action${k.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    f && E && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here.
    /* @__PURE__ */ r(
      "div",
      {
        onKeyDown: (j) => {
          j.key !== "Escape" || j.defaultPrevented || (j.preventDefault(), j.stopPropagation(), R());
        },
        children: /* @__PURE__ */ r(
          Jc,
          {
            id: D,
            review: e,
            disabled: i,
            onAdd: (j) => {
              const re = [...h, ...j];
              I(re), C({ actions: re, count: j.length }), R();
            },
            onCancel: R
          }
        )
      }
    ),
    /* @__PURE__ */ r("div", { ref: Q, children: A.length > 0 && /* @__PURE__ */ r(
      Qi,
      {
        items: A,
        getKey: (j) => j.id,
        disabled: i || !!Z,
        className: "dq-action-list",
        onReorder: (j) => I(j),
        renderItem: (j, { dragHandleProps: re, isOver: Oe }) => {
          const Ee = h.indexOf(j), lt = o === j.id;
          return /* @__PURE__ */ r(
            Xc,
            {
              action: j,
              entityType: d,
              binding: g.action(Ee),
              effect: Jn(j, m, n, a),
              open: lt,
              detailId: `${S}-detail-${j.id}`,
              dragHandleProps: re,
              isOver: Oe,
              reorderDisabled: i || !!Z,
              onToggle: () => s(lt ? null : j.id),
              onDuplicate: () => W(Ee),
              onDelete: () => he(Ee),
              children: "steps" in j ? /* @__PURE__ */ r(
                Zc,
                {
                  action: j,
                  saving: i,
                  stepKey: le,
                  rememberStepKey: (dt, Ze) => ne.current.set(dt, le(Ze)),
                  onChange: (dt) => P(Ee, dt)
                }
              ) : /* @__PURE__ */ r(
                tl,
                {
                  action: j,
                  tagGroups: n,
                  onChange: (dt) => P(Ee, dt)
                }
              )
            }
          );
        }
      }
    ) }),
    h.length ? !A.length && /* @__PURE__ */ c("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      v.trim(),
      "”."
    ] }) : /* @__PURE__ */ r("p", { className: "dq-actions-empty", children: f ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function Xc({
  action: e,
  entityType: t,
  binding: n,
  effect: a,
  open: i,
  detailId: o,
  dragHandleProps: s,
  isOver: l,
  reorderDisabled: d,
  onToggle: f,
  onDuplicate: h,
  onDelete: g,
  children: m
}) {
  const v = e.label.trim() || "New action", w = Qc(e, t);
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
              style: Mo(s.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${v}`,
              title: d ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: d,
              children: /* @__PURE__ */ r(eo, { "aria-hidden": "true" })
            }
          ),
          n ? /* @__PURE__ */ r(ct, { binding: n }) : /* @__PURE__ */ r("span", { className: "dq-key dq-key-none", title: "Reached with Find action", children: "·" }),
          /* @__PURE__ */ c("div", { className: "dq-action-row-summary", onClick: f, children: [
            /* @__PURE__ */ r("span", { className: "dq-action-row-label", title: v, children: v }),
            !i && /* @__PURE__ */ r("span", { className: "dq-action-row-effect", children: a.map((E, $) => /* @__PURE__ */ r("span", { "data-effect-tone": E.tone, children: E.text }, $)) }),
            w && /* @__PURE__ */ c("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ r(nr, { "aria-hidden": "true" }),
              w
            ] })
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Duplicate ${v}`,
              title: "Duplicate",
              onClick: h,
              children: /* @__PURE__ */ r(Ts, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Delete ${v}`,
              title: "Delete",
              onClick: g,
              children: /* @__PURE__ */ r(to, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small dq-action-toggle",
              "aria-label": `${i ? "Collapse" : "Expand"} ${v}`,
              "aria-expanded": i,
              "aria-controls": i ? o : void 0,
              onClick: f,
              children: /* @__PURE__ */ r(no, { "aria-hidden": "true" })
            }
          )
        ] }),
        i && /* @__PURE__ */ r("div", { id: o, className: "dq-action-detail", children: m })
      ]
    }
  );
}
function Fo({
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
function Zc({
  action: e,
  saving: t,
  stepKey: n,
  rememberStepKey: a,
  onChange: i
}) {
  const o = Ut(), s = x(null), l = x(null);
  mn(() => {
    var h, g;
    const f = l.current;
    f != null && (l.current = null, (g = (h = s.current) == null ? void 0 : h.querySelector(`[data-step-index="${f}"] input`)) == null || g.focus());
  });
  const d = (f) => i({ ...e, steps: f });
  return /* @__PURE__ */ c(be, { children: [
    /* @__PURE__ */ r(Fo, { action: e, onChange: (f) => i({ ...e, label: f }) }),
    /* @__PURE__ */ c("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": o, children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", id: o, children: "Steps" }),
      /* @__PURE__ */ c("div", { className: "dq-steps", ref: s, children: [
        e.steps.length > 0 ? /* @__PURE__ */ r(
          Qi,
          {
            items: e.steps,
            getKey: n,
            disabled: t,
            className: "dq-step-list",
            onReorder: d,
            renderItem: (f, { index: h, dragHandleProps: g, isOver: m }) => /* @__PURE__ */ r(
              el,
              {
                step: f,
                index: h,
                dragHandleProps: g,
                isOver: m,
                saving: t,
                onChange: (v) => {
                  a(v, f), d(e.steps.map((w, E) => E === h ? v : w));
                },
                onRemove: () => d(e.steps.filter((v, w) => w !== h))
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
              /* @__PURE__ */ r(Fa, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function el({
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
      "data-step-tone": Wc(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            ...n,
            style: Mo(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${l}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ r(eo, { "aria-hidden": "true" }),
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
            children: zc.map(({ mode: d, label: f }) => /* @__PURE__ */ r("option", { value: d, children: f }, d))
          }
        ),
        /* @__PURE__ */ r(
          gn,
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
            children: /* @__PURE__ */ r(Ar, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function tl({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const a = e.effect, i = a.mode === "SET_TAG_GROUP" ? `group:${a.tagGroupId}` : a.mode, o = a.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === a.tagGroupId);
  return /* @__PURE__ */ c(be, { children: [
    /* @__PURE__ */ r(Fo, { action: e, onChange: (s) => n({ ...e, label: s }) }),
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
function nl({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, a = Yt(ke(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
  return /* @__PURE__ */ c("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
    /* @__PURE__ */ c("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      a,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ r(
      gn,
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
function rl({
  review: e,
  onChange: t
}) {
  const n = Yt(ke(e)).many;
  return /* @__PURE__ */ c("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ r("legend", { children: "Performer flags" }),
    /* @__PURE__ */ c("p", { children: [
      "Flag performers whose profile has any of these tags in the performer list and batches, for example a tag noting that something changed during their career. Check a flagged performer’s earliest and latest ",
      n,
      " ",
      "before applying one batch to all of them."
    ] }),
    /* @__PURE__ */ r(
      gn,
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
function Sr(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (a, i) => i && typeof i == "object" && !Array.isArray(i) ? Object.fromEntries(
      Object.keys(i).sort().map((o) => [o, i[o]])
    ) : i
  );
}
function xo(e) {
  const t = URL.createObjectURL(
    new Blob([JSON.stringify([e], null, 2)], { type: "application/json" })
  ), n = document.createElement("a");
  n.href = t, n.download = "data-quality-review.json", n.click(), URL.revokeObjectURL(t);
}
function Po({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: a,
  nameRef: i,
  autoFocus: o = !1
}) {
  return /* @__PURE__ */ c(be, { children: [
    /* @__PURE__ */ c("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ r("span", { children: "Entity type" }),
      /* @__PURE__ */ c(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: je(e),
          disabled: n,
          onChange: (s) => a == null ? void 0 : a(s.target.value),
          children: [
            /* @__PURE__ */ r("option", { value: "video", children: "Videos" }),
            /* @__PURE__ */ r("option", { value: "audio", children: "Audios" }),
            /* @__PURE__ */ r("option", { value: "tag", children: "Tags" }),
            /* @__PURE__ */ r("option", { value: "performerOccurrence", children: "Performer occurrence tags" }),
            /* @__PURE__ */ r("option", { value: "audioPerformerOccurrence", children: "Audio performer occurrence tags" })
          ]
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
function al(e, t) {
  const n = je(e), a = ["Review"];
  return (n === "video" || n === "tag") && a.push("Appearance"), a.push("Actions"), t && a.push("Tag choices"), a;
}
function Lo({
  draft: e,
  onChange: t,
  direction: n,
  onDirectionChange: a,
  tagGroups: i,
  trees: o,
  saving: s,
  saveDisabled: l = !1,
  error: d,
  dirty: f,
  notices: h,
  onSave: g,
  onCancel: m,
  drawerRef: v
}) {
  const [w, E] = q("Review"), [$] = q(
    () => qe(e) && e.occurrence.tagIds.length > 0
  ), [k, C] = q(""), [S, D] = q(null), [_, X] = q(0), Q = x(null), F = al(e, $), ne = je(e), le = Ae(() => Sr(e), [e]);
  z(() => C(""), [le]);
  function Z() {
    const I = { ...e, name: e.name.trim() }, P = kr(I);
    if (!P) {
      C(""), g();
      return;
    }
    if (C(P), !I.name) {
      E("Review"), requestAnimationFrame(() => {
        var de;
        return (de = Q.current) == null ? void 0 : de.focus();
      });
      return;
    }
    const te = e.actions.find(
      (de) => !bn(de, ne)
    );
    te && (E("Actions"), D(te.id), X((de) => de + 1));
  }
  const A = k || d;
  return /* @__PURE__ */ c(
    "aside",
    {
      ref: v,
      className: "dq-drawer",
      role: "dialog",
      "aria-label": "Edit review",
      tabIndex: -1,
      onKeyDown: (I) => {
        I.key !== "Escape" || I.defaultPrevented || f || s || (I.preventDefault(), I.stopPropagation(), m());
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
              onClick: m,
              children: /* @__PURE__ */ r(Ar, { "aria-hidden": "true" })
            }
          )
        ] }),
        /* @__PURE__ */ r("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ r(
          gs,
          {
            tabs: F.map((I) => ({
              key: I,
              label: I,
              count: I === "Actions" ? e.actions.length : void 0
            })),
            activeTab: w,
            onTabChange: (I) => E(I)
          }
        ) }),
        /* @__PURE__ */ r("div", { className: "dq-drawer-body", children: /* @__PURE__ */ c("fieldset", { className: "dq-drawer-fields", disabled: s, children: [
          /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review settings" }),
          /* @__PURE__ */ c("div", { className: "dq-drawer-panel", role: "tabpanel", hidden: w !== "Review", "aria-label": "Review", children: [
            /* @__PURE__ */ r(
              Po,
              {
                review: e,
                onChange: t,
                entityTypeLocked: !0,
                nameRef: Q,
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
                  onChange: (I) => a(I.target.value),
                  children: [
                    /* @__PURE__ */ r("option", { value: "end", children: "Start from the end" }),
                    /* @__PURE__ */ r("option", { value: "beginning", children: "Start from the beginning" })
                  ]
                }
              ),
              /* @__PURE__ */ r("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
            ] }),
            qe(e) && /* @__PURE__ */ r(rl, { review: e, onChange: t }),
            /* @__PURE__ */ r("div", { children: /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-text-button",
                onClick: () => xo(e),
                children: "Export draft"
              }
            ) })
          ] }),
          F.includes("Appearance") && /* @__PURE__ */ r(
            "div",
            {
              className: "dq-drawer-panel",
              role: "tabpanel",
              hidden: w !== "Appearance",
              "aria-label": "Appearance",
              children: /* @__PURE__ */ r(il, { review: e, onChange: t })
            }
          ),
          /* @__PURE__ */ r(
            "div",
            {
              className: "dq-drawer-panel dq-actions-panel",
              role: "tabpanel",
              hidden: w !== "Actions",
              "aria-label": "Actions",
              children: /* @__PURE__ */ r(
                Yc,
                {
                  review: e,
                  onChange: t,
                  tagGroups: i,
                  trees: o,
                  saving: s,
                  expandedId: S,
                  onExpand: D,
                  reveal: _
                }
              )
            }
          ),
          $ && qe(e) && /* @__PURE__ */ r(
            "div",
            {
              className: "dq-drawer-panel",
              role: "tabpanel",
              hidden: w !== "Tag choices",
              "aria-label": "Tag choices",
              children: /* @__PURE__ */ r(nl, { review: e, onChange: t })
            }
          )
        ] }) }),
        (A || h) && /* @__PURE__ */ c("div", { className: "dq-drawer-notices", children: [
          h,
          A && /* @__PURE__ */ c("p", { role: "alert", className: "dq-alert", children: [
            /* @__PURE__ */ r(nr, { "aria-hidden": "true" }),
            A
          ] })
        ] }),
        /* @__PURE__ */ c("footer", { className: "dq-drawer-footer", children: [
          /* @__PURE__ */ r("p", { className: "dq-drawer-dirty", children: f ? "Unsaved changes" : "" }),
          /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: s, onClick: m, children: "Cancel" }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-button primary",
              "aria-busy": s || void 0,
              "aria-disabled": s || void 0,
              disabled: !s && l,
              onClick: () => {
                s || Z();
              },
              children: "Save review"
            }
          )
        ] })
      ]
    }
  );
}
function il({
  review: e,
  onChange: t
}) {
  const n = Ut(), a = e.view, i = (h) => t({ ...e, view: { ...a, ...h } }), o = /* @__PURE__ */ c("label", { className: "dq-checkbox dq-setting-indent", children: [
    /* @__PURE__ */ r(
      "input",
      {
        type: "checkbox",
        checked: a.selectAllOnLoad ?? !1,
        onChange: (h) => i({ selectAllOnLoad: h.target.checked ? !0 : void 0 })
      }
    ),
    "Select every card when a page opens"
  ] });
  if (je(e) === "tag")
    return /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ r(
        ki,
        {
          label: "View",
          value: a.displayMode === "list" ? "list" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "list", label: "List" }
          ],
          onChange: (h) => i({ displayMode: h })
        }
      ),
      o,
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review opens with these. The Cards / List switch in the header changes only the current visit." })
    ] });
  const s = e.presentation ?? {}, l = (h) => t({ ...e, presentation: { ...s, ...h } }), d = s.annotations ?? [], f = a.reviewMode ?? "single";
  return /* @__PURE__ */ c(be, { children: [
    /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ c("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ r(
          Ti,
          {
            name: `${n}-layout-choice`,
            checked: f === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ r(ol, {}),
            onChoose: () => i({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ r(
          Ti,
          {
            name: `${n}-layout-choice`,
            checked: f === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ r(sl, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ c("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ r(
        ki,
        {
          label: "Cards",
          value: a.displayMode === "wall" ? "wall" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "wall", label: "Wall" }
          ],
          onChange: (h) => i({ displayMode: h })
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
        ].map(([h, g]) => /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: d.includes(h),
              onChange: (m) => l({
                annotations: m.target.checked ? [...d, h] : d.filter((v) => v !== h)
              })
            }
          ),
          g
        ] }, h)) })
      ] }),
      d.includes("tags") && /* @__PURE__ */ c("div", { className: "dq-setting-row dq-setting-row-top", children: [
        /* @__PURE__ */ r("span", { className: "dq-setting-name", children: "Tags on cards" }),
        /* @__PURE__ */ c("div", { className: "dq-setting-value", children: [
          /* @__PURE__ */ r(
            gn,
            {
              entityType: "tag",
              values: s.annotationParents ?? [],
              onChange: (h) => l({ annotationParents: h }),
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
        gn,
        {
          entityType: "tag",
          values: s.binParents ?? [],
          onChange: (h) => l({ binParents: h }),
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
function ki({
  label: e,
  value: t,
  options: n,
  onChange: a
}) {
  const i = Ut();
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
function Ti({
  name: e,
  checked: t,
  title: n,
  text: a,
  picture: i,
  onChoose: o
}) {
  const s = Ut(), l = Ut();
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
function ol() {
  return /* @__PURE__ */ c("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function sl() {
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
const Do = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
};
function Ya({ entityType: e }) {
  const t = Do[e];
  return e === "tag" ? /* @__PURE__ */ r(Rs, { role: "img", "aria-label": t }) : wr(e) === "audio" ? /* @__PURE__ */ r(ro, { role: "img", "aria-label": t }) : /* @__PURE__ */ r(Vr, { role: "img", "aria-label": t });
}
function _o({
  name: e,
  description: t,
  entityType: n,
  onBack: a,
  backDisabled: i,
  onEdit: o,
  editDisabled: s,
  editing: l = !1,
  toolbar: d,
  trailing: f,
  chipsStart: h,
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
          children: /* @__PURE__ */ r(Zr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-type", title: Do[n], children: /* @__PURE__ */ r(Ya, { entityType: n }) }),
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
          children: /* @__PURE__ */ r(Cr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    d,
    /* @__PURE__ */ r("div", { className: "dq-review-header-trail", children: f }),
    /* @__PURE__ */ r("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    h,
    g && /* @__PURE__ */ r("div", { className: "dq-review-chips-after", children: g }),
    m && /* @__PURE__ */ r("div", { className: "dq-review-chips-end", children: m })
  ] });
}
function jo({
  page: e,
  pages: t,
  onPage: n
}) {
  const [a, i] = q(!1), [o, s] = q(""), l = x(null), d = x(null);
  z(() => {
    var g;
    a && ((g = l.current) == null || g.select());
  }, [a]);
  const f = (g) => {
    i(!1), g && requestAnimationFrame(() => {
      var m;
      return (m = d.current) == null ? void 0 : m.focus();
    });
  }, h = () => {
    const g = Math.round(Number(o));
    f(!0), Number.isFinite(g) && g >= 1 && g !== e && n(Math.min(t, g));
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
        children: /* @__PURE__ */ r(Zr, { "aria-hidden": "true" })
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
          g.key === "Enter" ? (g.preventDefault(), h()) : g.key === "Escape" && (g.preventDefault(), g.stopPropagation(), f(!0));
        },
        onBlur: () => f(!1)
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
        children: /* @__PURE__ */ r(Pa, { "aria-hidden": "true" })
      }
    )
  ] });
}
function Uo({
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
          /* @__PURE__ */ r(Is, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ r(xa, { "aria-hidden": "true" }),
          "Grid"
        ]
      }
    )
  ] });
}
function cl({
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
function Go({
  items: e,
  disabled: t
}) {
  const [n, a] = q(!1), i = x(null), o = x(null), s = Ut();
  z(() => {
    var f, h;
    n && ((h = (f = o.current) == null ? void 0 : f.querySelector('[role="menuitem"]:not(:disabled)')) == null || h.focus());
  }, [n]), z(() => {
    t && a(!1);
  }, [t]);
  const l = (f = !0) => {
    var h;
    a(!1), f && ((h = i.current) == null || h.focus());
  };
  return /* @__PURE__ */ c("div", { className: "dq-menu", onKeyDown: (f) => {
    var m, v;
    if (!n) return;
    const h = [
      ...((m = o.current) == null ? void 0 : m.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], g = h.indexOf(document.activeElement);
    if (f.key === "Escape")
      f.preventDefault(), f.stopPropagation(), l();
    else if (f.key === "Tab")
      l(!1);
    else if (f.key === "ArrowDown" || f.key === "ArrowUp") {
      if (f.preventDefault(), !h.length) return;
      const w = f.key === "ArrowDown" ? 1 : -1;
      h[(g + w + h.length) % h.length].focus();
    } else (f.key === "Home" || f.key === "End") && (f.preventDefault(), (v = h.at(f.key === "Home" ? 0 : -1)) == null || v.focus());
  }, children: [
    /* @__PURE__ */ r(
      "button",
      {
        ref: i,
        type: "button",
        className: "dq-icon-button",
        "aria-label": "More review options",
        title: "More review options",
        "aria-haspopup": "menu",
        "aria-expanded": n,
        "aria-controls": n ? s : void 0,
        disabled: t,
        onClick: () => a((f) => !f),
        children: /* @__PURE__ */ r(Os, { "aria-hidden": "true" })
      }
    ),
    n && /* @__PURE__ */ c(be, { children: [
      /* @__PURE__ */ r("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => l(!1) }),
      /* @__PURE__ */ r(
        "div",
        {
          ref: o,
          id: s,
          role: "menu",
          "aria-label": "More review options",
          className: "dq-menu-list",
          children: e.map((f) => /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              role: "menuitem",
              disabled: f.disabled,
              onClick: () => {
                l(), f.onSelect();
              },
              children: f.label
            },
            f.label
          ))
        }
      )
    ] })
  ] });
}
function Hr(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Xa(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Za(e) {
  return !!String(e ?? "").trim();
}
function ei(e) {
  return [
    ...new Set(
      Hr(e.customFieldCriteria).filter(Xa).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Za(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function ti(e, t) {
  const n = Hr(e.customFieldCriteria);
  if (!n.length) return e;
  let a = !1;
  const i = n.map((o) => {
    if (!Xa(o)) return o;
    const s = { ...o };
    for (const [l, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(o[l] ?? "")];
      f && !Za(o[d]) && (s[d] = f, a = !0);
    }
    return s;
  });
  return a ? { ...e, customFieldCriteria: i } : e;
}
function Bo(e, t, n) {
  const a = Hr(e.customFieldCriteria);
  if (!a.length) return e;
  const i = Hr(n.customFieldCriteria), o = (d, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (h) => (d[h] ?? void 0) === (f[h] ?? void 0)
  );
  let s = !1;
  const l = a.map((d) => {
    if (!Xa(d)) return d;
    const f = i.find((g) => o(g, d));
    if (!f) return d;
    const h = { ...d };
    for (const [g, m] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const v = t[String(d[g] ?? "")];
      v && d[m] === v && !Za(f[m]) && (delete h[m], s = !0);
    }
    return h;
  });
  return s ? { ...e, customFieldCriteria: l } : e;
}
async function ll(e, t, n) {
  if (!bn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const a = ke(e), i = n.steps.some((l) => hn(l.mode)) ? await Nc(a) : "", o = await Ka(n);
  let s = t.applications;
  for (const l of [
    ...o.filter((d) => !hn(d.mode)),
    ...o.filter((d) => hn(d.mode))
  ]) {
    const d = (f) => qc(
      i,
      a,
      t.media.id,
      t.performer.id,
      l.tagIds,
      f
    );
    (l.mode === "MARK_PRESENT" || l.mode === "CLEAR_ABSENCE") && await d("REMOVE"), l.mode !== "CLEAR_ABSENCE" && (s = await zo(
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
async function ni(e, t) {
  const n = e.occurrence;
  if (ja(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const a = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let s = 1; ; s++) {
    const l = await ae("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        wn({
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
function Ko(e) {
  return qr(e.condition) && e.hideConfirmedAbsent !== !1;
}
function ri(e, t) {
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
  }, s = Ko(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
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
                      key: ta,
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
async function ai(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => na([n], t))
  );
}
function Vo(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function dl(e, t, n = e.conditionTagIds.map((a) => [a])) {
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
function ul(e, t, n, a, i) {
  if (!Ko(e)) return !1;
  const o = yo(t, n);
  return e.conditionTagIds.every(
    (s, l) => o.includes(s) || i[l].some((d) => a.includes(d))
  );
}
async function Jo(e, t, n, a) {
  if ((t == null ? void 0 : t.length) === 0 || Vo(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = ke(e), o = await yr(
    ri(e, t),
    { ...e.view.filter, page: n },
    a
  ), s = t === null ? null : new Set(t), l = e.occurrence, d = o.items.length ? await ai(l, a) : [], f = new Array(o.items.length);
  let h = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; h < o.items.length; ) {
        const g = h++, m = o.items[g], v = await ae(
          `/api/tagapplications?hostType=${i}&hostId=${m.id}&contextType=performer`,
          { signal: a }
        );
        f[g] = m.performers.filter((w) => s === null || s.has(w.id)).flatMap((w) => {
          const E = v.filter(
            (k) => k.hostType === i && k.hostId === m.id && k.contextType === "performer" && k.contextId === w.id
          ), $ = E.map((k) => k.tag.id);
          return dl(e.occurrence, $, d) && !ul(l, m, w.id, $, d) ? [
            {
              key: `${m.id}:${w.id}`,
              media: m,
              performer: w,
              applications: E
            }
          ] : [];
        });
      }
    })
  ), { items: f.flat(), totalCount: o.totalCount };
}
async function zo(e, t, n) {
  const a = new Set(e.occurrence.tagIds);
  if (n.some((f) => !a.has(f)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = ke(e), o = await Na(i, t.media.id);
  if (!o.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, l = (await ae(s)).filter(
    (f) => f.hostType === i && f.hostId === o.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), d = new Set(n);
  try {
    for (const f of d)
      l.some((h) => h.tag.id === f) || await ae("/api/tagapplications", {
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
    for (const f of l)
      a.has(f.tag.id) && !d.has(f.tag.id) && await ae(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await ae(s);
  } catch (f) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${f instanceof Error ? f.message : "Request failed."}`
    );
  }
}
function ir(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function fl(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function Ht(e, t, n = !0) {
  var l;
  if (t.occurrence) {
    const d = n ? yo(
      await Na(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await ae(fl(e, t))).filter(
      (h) => h.hostType === e && h.hostId === t.media.id && h.contextType === "performer" && h.contextId === t.occurrence.performer.id
    );
    return Ea(f.map((h) => h.tag)), {
      ids: [...new Set(f.map((h) => h.tag.id))],
      names: [...new Set(f.map((h) => h.tag.name))],
      absent: d,
      applications: f
    };
  }
  const a = await Na(e, t.media.id), i = (a.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  );
  Ea(i);
  const o = Object.keys(a.customFields ?? {}).find(
    (d) => d.toLowerCase() === Wr
  ) ?? Wr, s = ((l = a.customFields) == null ? void 0 : l[o]) ?? [];
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
async function ii(e, t, n) {
  if (t.occurrence && qe(e))
    await zo(
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
      i.length && await ae(
        `/api/${Rn(ke(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: a, tagIds: i })
        }
      );
}
async function pl(e, t, n) {
  t.occurrence && qe(e) ? await ll(e, t.occurrence, n) : await vo(ke(e), n, [t.media.id]);
}
function Ca(e, t, n, a) {
  const i = (o) => o.filter((s) => a.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: ir(i(t.ids), i(n.ids)),
    absence: ir(i(t.absent), i(n.absent))
  };
}
function hl(e, t) {
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
const Aa = (e) => e instanceof Error ? e.message : "Request failed.", Ri = (e) => [...e].sort((t, n) => t - n), Er = (e, t) => JSON.stringify(Ri(e)) === JSON.stringify(Ri(t)), ka = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Yr(e, t, n, a) {
  const i = new Set(e), o = new Set(e);
  for (const h of t.steps)
    for (const g of h.tagIds)
      h.mode === "ADD" ? o.add(g) : o.delete(g);
  const s = e.some((h) => !o.has(h));
  if (s && !a)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const l = new Set(
    t.steps.filter((h) => h.mode === "ADD").flatMap((h) => h.tagIds)
  ), d = [], f = [];
  for (const h of n) {
    const g = h.filter((v) => o.has(v) && !i.has(v)), m = h.filter(
      (v) => o.has(v) && i.has(v) && !l.has(v)
    );
    !g.length || !m.length || (a ? (m.forEach((v) => o.delete(v)), f.push(...m)) : (g.forEach((v) => o.delete(v)), d.push({ tagIds: g, existing: m })));
  }
  return { desired: [...o], conflict: s, skipped: !1, kept: d, replaced: f };
}
function ml(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function gl(e, t, n, a) {
  for (const [i, o] of n.entries()) {
    const s = t.filter(
      (f) => f.steps.some(
        (h) => h.mode === "ADD" && h.tagIds.some((g) => o.includes(g))
      )
    );
    if (s.length < 2) continue;
    const l = e.occurrence.conditionTagIds[i];
    let d = `tag ${l}`;
    try {
      d = (await ae(`/api/tags/${l}`, { signal: a })).name;
    } catch {
      a.throwIfAborted();
    }
    throw new Error(
      `${s.map((f) => f.label).join(" and ")} answer the same condition tag, ${d}. Choose one of them.`
    );
  }
}
async function bl(e, t, n, a = () => {
}) {
  if (!t.length || t.some(
    (m) => !bn(m, e.entityType) || !m.steps.length || m.steps.some(
      (v) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(v.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = qr(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await ai(i.occurrence, n) : [];
  await gl(i, o, s, n);
  const l = await Promise.all(
    o.map(async (m) => ({
      ...m,
      steps: await Ka(m, n)
    }))
  ), d = structuredClone(ml(l));
  n.throwIfAborted();
  const f = [
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
  const h = await ni(i, n), g = /* @__PURE__ */ new Map();
  for (let m = 1; ; m++) {
    n.throwIfAborted();
    const v = await Jo(i, h, m, n);
    for (const w of v.items) {
      const E = {
        ids: [...new Set(w.applications.map((k) => k.tag.id))],
        names: w.applications.map((k) => k.tag.name),
        absent: [],
        applications: w.applications
      }, $ = Yr(E.ids, d, s, !0);
      g.set(w.key, {
        item: { key: w.key, media: w.media, occurrence: w },
        before: E,
        expected: E,
        conflict: $.conflict,
        status: Er(E.ids, $.desired) ? "unchanged" : "pending"
      });
    }
    if (a(g.size), m * 250 >= v.totalCount) break;
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
    touched: f,
    entries: [...g.values()]
  };
}
function wl(e, t, n) {
  const a = (o) => o.ids.filter((s) => n.includes(s));
  if (!Er(a(e), a(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return Er(i(e), i(t));
}
async function Wo(e, t, n, a) {
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
function Qo(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function Ho(e) {
  return e.entries.filter((t) => t.operation);
}
async function yl(e, t, n, a, i = !1) {
  await Wo(
    Qo(e, i),
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
        if (s = await Ht(ke(e.review), o.item, !1), !wl(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (m) {
        o.status = "failed", o.error = Aa(m);
        return;
      }
      const l = Yr(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), d = [
        ...s.ids.filter((m) => !e.touched.includes(m)),
        ...l.desired.filter((m) => e.touched.includes(m))
      ], f = ir(s.ids, d);
      if (!f.added.length && !f.removed.length) {
        const m = !o.operation && l.kept.length > 0;
        o.status = o.operation ? "changed" : m ? "skipped" : "unchanged", o.error = m ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let h;
      try {
        await ii(e.review, o.item, f);
      } catch (m) {
        h = m;
      }
      let g = !1;
      try {
        const m = await Ht(ke(e.review), o.item, !1);
        g = !0, o.expected = m;
        const v = Ca(
          o.item,
          o.before,
          m,
          e.touched
        );
        if (o.operation = ka(v) ? v : void 0, h) throw h;
        if (!Er(
          m.ids.filter((w) => e.touched.includes(w)),
          d.filter((w) => e.touched.includes(w))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (m) {
        if (o.status = "failed", o.error = Aa(m), !g)
          try {
            const v = await Ht(ke(e.review), o.item, !1);
            o.expected = v;
            const w = Ca(
              o.item,
              o.before,
              v,
              e.touched
            );
            o.operation = ka(w) ? w : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    a
  );
}
async function vl(e, t, n) {
  await Wo(
    Ho(e),
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
        const l = await Ht(ke(e.review), a.item, !1);
        hl(i, l), s = !0, await ii(e.review, a.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const d = await Ht(ke(e.review), a.item, !1);
        if (!Er(
          d.ids.filter((f) => o.includes(f)),
          a.before.ids.filter((f) => o.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        a.operation = void 0, a.expected = d, a.status = "unchanged", a.error = void 0;
      } catch (l) {
        if (a.error = `Undo stopped: ${Aa(l)}`, a.status = "failed", s)
          try {
            const d = await Ht(ke(e.review), a.item, !1), f = Ca(
              a.item,
              a.before,
              d,
              o
            );
            a.operation = ka(f) ? f : void 0, a.expected = d;
          } catch {
            a.unverified = !0;
          }
      }
    },
    n
  );
}
async function Nl(e, t, n) {
  const a = ke(e), i = e.occurrence, [o, s] = await Promise.all([
    ae(
      `/api/tagapplications?hostType=${a}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    ai(i, n)
  ]), l = o.filter(
    (w) => w.hostType === a && w.contextType === "performer" && w.contextId === t
  );
  Ea(l.map((w) => w.tag));
  const d = await Promise.all(
    s.map(async (w, E) => {
      const $ = i.conditionTagIds[E];
      return (await ae(`/api/tags/${$}`, { signal: n })).name;
    })
  ), f = new Set(s.flat()), h = new Set(
    [
      ...e.actions.flatMap((w) => w.steps).filter((w) => w.mode === "ADD" || w.mode === "MARK_PRESENT").flatMap((w) => w.tagIds),
      ...i.tagIds
    ].filter((w) => !f.has(w))
  ), g = (w) => {
    const E = /* @__PURE__ */ new Map();
    for (const $ of l) {
      if (!w.has($.tag.id)) continue;
      const k = E.get($.tag.id) ?? {
        tag: $.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      k.hosts.add($.hostId), E.set($.tag.id, k);
    }
    return [...E.values()].map(($) => ({ ...$.tag, count: $.hosts.size })).sort(($, k) => k.count - $.count || To($, k));
  }, m = s.map((w, E) => ({
    id: i.conditionTagIds[E],
    name: d[E],
    tags: g(new Set(w))
  }));
  h.size && m.push({
    id: null,
    name: s.length ? "Other review tags" : "Review tags",
    tags: g(h)
  });
  const v = /* @__PURE__ */ new Set([...f, ...h]);
  return {
    answered: new Set(
      l.filter((w) => v.has(w.tag.id)).map((w) => w.hostId)
    ).size,
    groups: m
  };
}
function jt({ tag: e, name: t }) {
  return /* @__PURE__ */ r(bs, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: e ?? void 0 });
}
const Ii = { summary: null, error: "" };
function Yo(e, t, n = 0) {
  const [a, i] = q(Ii), o = e.occurrence, s = JSON.stringify([
    e.entityType,
    t,
    o.condition,
    o.conditionTagIds,
    o.includeSubtags,
    o.tagIds,
    e.actions.map((l) => l.steps)
  ]);
  return z(() => {
    if (i(Ii), t === null) return;
    const l = new AbortController();
    return Nl(e, t, l.signal).then((d) => {
      l.signal.aborted || i({ summary: d, error: "" });
    }).catch((d) => {
      l.signal.aborted || i({
        summary: null,
        error: d instanceof Error ? d.message : "Request failed."
      });
    }), () => l.abort();
  }, [s, n]), a;
}
function ql({
  review: e,
  performerId: t,
  revision: n = 0
}) {
  const a = Yo(e, t, n);
  return /* @__PURE__ */ r(Ta, { ...a, mediaKind: ke(e) });
}
function Ta({
  summary: e,
  error: t,
  mediaKind: n,
  className: a = ""
}) {
  const i = Yt(n), o = (s) => `${s.toLocaleString()} ${s === 1 ? i.one : i.many}`;
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
            /* @__PURE__ */ r(jt, { tag: l }),
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
function tr({
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
const Oi = 5;
function Sl(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await ae(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
function El(e, t) {
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
const $i = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), Ra = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], Mi = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], Cl = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, fa = 250;
function br(e, t) {
  var a, i;
  const n = e.item.media;
  return n.title || ((i = (a = n.files) == null ? void 0 : a[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Al({ step: e }) {
  const t = Ra.findIndex((n) => n.id === e);
  return /* @__PURE__ */ r("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Ra.map((n, a) => {
    const i = a < t ? "done" : a === t ? "current" : "next";
    return /* @__PURE__ */ c("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ r(La, {}) : a + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function Fi({ parts: e, id: t }) {
  return /* @__PURE__ */ r("span", { className: "dq-batch-effect", id: t, children: e.map((n, a) => /* @__PURE__ */ c(Wi, { children: [
    a > 0 && " ",
    /* @__PURE__ */ r("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, a)) });
}
function gr({
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
        n && /* @__PURE__ */ c(be, { children: [
          " ",
          /* @__PURE__ */ r("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function xi({
  added: e,
  removed: t,
  tag: n,
  label: a
}) {
  return /* @__PURE__ */ c("ul", { className: "dq-tags", "aria-label": a, children: [
    Vn(e.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ c("ins", { children: [
      "+ ",
      /* @__PURE__ */ r(jt, { tag: i })
    ] }) }, `added-${i.id}`)),
    Vn(t.map(n)).map((i) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ c("del", { children: [
      "− ",
      /* @__PURE__ */ r(jt, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function Pi({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: a,
  describe: i
}) {
  return /* @__PURE__ */ c("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: e }),
      t.length > fa && /* @__PURE__ */ c("span", { children: [
        "First ",
        fa.toLocaleString(),
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
      /* @__PURE__ */ r("tbody", { children: t.slice(0, fa).map((o) => {
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
                br(o, n)
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
function kl(e) {
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
function Tl({
  review: e,
  disabled: t,
  performerFlags: n = [],
  trees: a,
  onOpen: i,
  onClose: o,
  onWrite: s
}) {
  const [l, d] = q(!1), [f, h] = q("answers"), [g, m] = q(null), [v, w] = q({}), [E, $] = q([]), [k, C] = q(!1), [S, D] = q(!1), [_, X] = q(""), [Q, F] = q(""), [ne, le] = q(null), [Z, A] = q(null), [I, P] = q([]), [te, de] = q(0), ue = x(null), W = x(null), he = x(null), R = x(!1), j = x(!1), re = x(null), Oe = x(!1), Ee = x(0), lt = x(!1), dt = x({ onClose: o, onWrite: s });
  dt.current = { onClose: o, onWrite: s };
  const Ze = Ut(), Xt = In(), kt = f === "run", $e = (ne == null ? void 0 : ne.kind) === "undo", Ue = kt && g ? g.review : e, U = Ue.occurrence, Ce = ke(Ue), Ge = Yt(Ce), ft = Ge.queue, pt = kt && g ? g.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((N) => N.steps.length && !Tn(N))
  ), Me = pt.filter((N) => E.includes(N.id)), ve = U.targetMode === "selected" && U.performerIds.length === 1, ce = Yo(
    Ue,
    l && ve ? U.performerIds[0] : null,
    te
  ), O = ei(Ue.view.objectFilter), fe = Wa(
    l ? [...ra(pt), ...U.conditionTagIds, ...O] : []
  ), nt = Ae(() => ko(fe), [fe]), Te = (N) => v[N] ?? fe[N] ?? { id: N, name: `Tag ${N}` }, ee = JSON.stringify(
    Object.fromEntries(
      O.flatMap((N) => {
        var B;
        const M = (B = fe[N]) == null ? void 0 : B.name;
        return M ? [[String(N), M]] : [];
      })
    )
  ), Zt = Ae(
    () => ti(Ue.view.objectFilter, JSON.parse(ee)),
    [Ue.view.objectFilter, ee]
  );
  z(() => {
    var N, M, B;
    l && ((N = ue.current) == null || N.showModal(), (B = (M = ue.current) == null ? void 0 : M.querySelector(".dq-batch-answer input")) == null || B.focus());
  }, [l]), z(() => {
    if (!l) return;
    const N = requestAnimationFrame(() => {
      var me;
      const M = ue.current, B = document.activeElement;
      if (!M || B && B !== document.body && M.contains(B)) return;
      (me = (f === "answers" ? M.querySelector(".dq-batch-answer input:checked") ?? M.querySelector(".dq-batch-answer input") : M.querySelector("[data-batch-focus]")) ?? W.current) == null || me.focus();
    });
    return () => cancelAnimationFrame(N);
  }, [l, f, S, g]), z(() => {
    if (l || t || !R.current) return;
    const N = requestAnimationFrame(() => {
      const M = he.current;
      if (!R.current || !M || M.disabled) return;
      R.current = !1;
      const B = document.activeElement;
      (!B || B === document.body) && M.focus();
    });
    return () => cancelAnimationFrame(N);
  }, [l, t]), z(() => {
    if (!l || U.targetMode !== "selected") return;
    const N = new AbortController();
    return P([]), Sl(U.performerIds.slice(0, Oi), N.signal).then((M) => {
      N.signal.aborted || P(M);
    }).catch(() => {
    }), () => N.abort();
  }, [l, U.targetMode, JSON.stringify(U.performerIds)]), z(
    () => () => {
      var N;
      j.current = !0, (N = re.current) == null || N.abort();
    },
    []
  ), z(() => {
    if (!S) return;
    const N = (M) => {
      M.preventDefault(), M.returnValue = "";
    };
    return window.addEventListener("beforeunload", N), () => window.removeEventListener("beforeunload", N);
  }, [S]);
  function sn() {
    h("answers"), m(null), w({}), le(null), C(!1), $([]), F(""), X(""), A(null);
  }
  function wt() {
    lt.current || (d(!1), dt.current.onClose(Oe.current), Oe.current = !1, sn(), R.current = !0);
  }
  function en(N, M) {
    $(
      (B) => M ? [...B, N] : B.filter((H) => H !== N)
    ), m(null), w({}), F(""), X(""), A(null);
  }
  function cn() {
    h("answers"), A(null), F("");
  }
  function Be() {
    h("preview"), g || Ot();
  }
  function rt() {
    var N;
    j.current = !0, (N = re.current) == null || N.abort(), F("Stopping after in-flight operations settle…");
  }
  function yt(N) {
    A(
      (M) => (M == null ? void 0 : M.group) === N.group && M.reason === N.reason ? null : N
    );
  }
  const ht = (N, M) => (Z == null ? void 0 : Z.group) === N && Z.reason === M;
  async function Ot() {
    if (!Me.length || lt.current) return;
    lt.current = !0, D(!0), X(""), F("Loading all matching occurrences…"), m(null), w({}), A(null);
    const N = new AbortController();
    re.current = N;
    try {
      await El(Ee.current, N.signal);
      const M = await bl(
        e,
        Me,
        N.signal,
        (H) => F(`Loaded ${H.toLocaleString()} matching occurrences…`)
      );
      N.signal.throwIfAborted();
      const B = {};
      for (const H of M.entries)
        for (const me of H.before.applications ?? [])
          B[me.tag.id] = me.tag;
      w(B), m(M), F("Preview ready. No tags have been changed.");
    } catch (M) {
      X(
        N.signal.aborted ? "Preview cancelled. No tags were changed." : M instanceof Error ? M.message : String(M)
      ), F("");
    } finally {
      lt.current = !1, D(!1), re.current = null;
    }
  }
  async function Tt(N) {
    if (!g || lt.current) return;
    const M = (N === "undo" ? Ho(g) : Qo(g, N === "retry")).length;
    lt.current = !0, j.current = !1, Oe.current = !0, dt.current.onWrite(), D(!0), h("run"), X(""), le({ kind: N, total: M, done: 0, stopped: !1 }), F(
      N === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const B = () => le((me) => me && { ...me, done: me.done + 1 });
    let H = !1;
    try {
      N === "undo" ? await vl(g, () => j.current, B) : await yl(g, k, () => j.current, B, N === "retry"), F(
        j.current ? "Stopped after in-flight operations settled. Completed changes are retained." : N === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (me) {
      H = !0, F(""), X(me instanceof Error ? me.message : String(me));
    } finally {
      Ee.current = Date.now(), lt.current = !1;
      const me = j.current || H;
      le((we) => we && { ...we, stopped: me }), D(!1), de((we) => we + 1);
    }
  }
  const et = (g == null ? void 0 : g.entries) ?? [], ln = Ae(
    () => new Map(
      ((g == null ? void 0 : g.entries) ?? []).map((N) => [
        N.item.key,
        Yr(N.before.ids, g.action, g.categories, k)
      ])
    ),
    [g, k]
  ), yn = (N) => ln.get(N.item.key), mt = (N) => ir(N.before.ids, yn(N).desired), vt = (N) => {
    const M = mt(N);
    return N.status === "pending" && (M.added.length > 0 || M.removed.length > 0);
  }, Ne = (N) => N.conflict || yn(N).kept.length > 0 || yn(N).replaced.length > 0, $t = Ae(() => {
    const N = (g == null ? void 0 : g.entries) ?? [];
    return {
      willChange: N.filter(vt).length,
      correct: N.filter((M) => M.status === "unchanged").length,
      different: N.filter(Ne).length,
      hosts: new Set(N.map((M) => M.item.media.id)).size,
      added: [...new Set(N.flatMap((M) => mt(M).added))],
      removed: [...new Set(N.flatMap((M) => mt(M).removed))]
    };
  }, [ln]), Gt = Ae(
    () => ((g == null ? void 0 : g.entries) ?? []).filter((N) => N.item.media.date).sort((N, M) => N.item.media.date.localeCompare(M.item.media.date)),
    [g]
  ), Nt = kt ? kl(et) : null, Je = (N) => Xt.action(Ue.actions.findIndex((M) => M.id === N)), at = (N) => Jn(N, nt, [], a), qt = qr(U.condition) && U.includeSubtags !== !1 && U.conditionTagIds.length > 0, ze = Gt[0], ie = Gt.length > 1 ? Gt[Gt.length - 1] : void 0, gt = (N) => `/${Ce}/${N.item.media.id}`, Re = ve ? I[0] : void 0, Bt = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: vt },
    correct: { title: "Occurrences already correct", test: (N) => N.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: Ne }
  };
  function He() {
    const N = Cl[U.condition], M = !!N && U.conditionTagIds.length > 0, B = U.performerIds.slice(0, Oi), H = String(Ue.view.filter.q ?? "").trim(), me = U.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ c("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      ja(U) ? /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "All performers" }) : U.targetMode === "selected" ? /* @__PURE__ */ c(be, { children: [
        B.map((we, Fe) => /* @__PURE__ */ c("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ r(tr, { performer: { id: we, name: I[Fe] ?? "" } }),
          I[Fe] ?? "…"
        ] }, we)),
        U.performerIds.length > B.length && /* @__PURE__ */ c("span", { className: "dq-batch-chip", children: [
          (U.performerIds.length - B.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ c(be, { children: [
        /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ r(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ r(
              Nr,
              {
                filter: {},
                objectFilter: U.performerFilter,
                criteriaDefinitions: $a,
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
        M ? N : Da[U.condition],
        M && /* @__PURE__ */ r("span", { className: "dq-batch-chip-tags", children: Vn(U.conditionTagIds.map(Te)).map((we) => /* @__PURE__ */ r(jt, { tag: we }, we.id)) })
      ] }),
      M && /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: U.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      qr(U.condition) && U.hideConfirmedAbsent !== !1 && /* @__PURE__ */ c("span", { className: "dq-batch-chip", title: me, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
          ": ",
          me
        ] })
      ] }),
      H && /* @__PURE__ */ c("span", { className: "dq-batch-chip", children: [
        "Search “",
        H,
        "”"
      ] }),
      Object.keys(Ue.view.objectFilter).length > 0 && /* @__PURE__ */ r(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${ft} filters`,
          children: /* @__PURE__ */ r(
            Nr,
            {
              filter: Ue.view.filter,
              objectFilter: Zt,
              criteriaDefinitions: Ce === "audio" ? Hi : Ma,
              customFieldEntityType: Ce,
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
  function On(N) {
    return n.length ? /* @__PURE__ */ c("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ r(Jr, { "aria-hidden": "true" }),
      /* @__PURE__ */ c("div", { children: [
        /* @__PURE__ */ c("p", { children: [
          /* @__PURE__ */ r("strong", { children: Re || "This performer" }),
          " is flagged:",
          " ",
          /* @__PURE__ */ r("strong", { children: n.join(", ") }),
          ". Check the earliest and latest",
          " ",
          Ge.many,
          " before applying, or narrow the batch with a date filter."
        ] }),
        N && ze && /* @__PURE__ */ c("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ c("a", { href: gt(ze), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            br(ze, Ce),
            " · ",
            ze.item.media.date
          ] }),
          ie && /* @__PURE__ */ c("a", { href: gt(ie), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            br(ie, Ce),
            " · ",
            ie.item.media.date
          ] })
        ] })
      ] })
    ] }) : null;
  }
  function Kt() {
    return /* @__PURE__ */ c(be, { children: [
      He(),
      On(!1),
      /* @__PURE__ */ c("div", { className: `dq-batch-pick${ve ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ c("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ r("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ r("div", { className: "dq-batch-answers", children: pt.map((N, M) => {
            const B = Je(N.id);
            return /* @__PURE__ */ c("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ r(
                "input",
                {
                  type: "checkbox",
                  checked: E.includes(N.id),
                  "aria-labelledby": `${Ze}-answer-${M}`,
                  "aria-describedby": `${Ze}-effect-${M}`,
                  onChange: (H) => en(N.id, H.target.checked)
                }
              ),
              /* @__PURE__ */ r("span", { className: "dq-batch-answer-key", children: B && /* @__PURE__ */ r(ct, { binding: B, hidden: !0 }) }),
              /* @__PURE__ */ c("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ r(
                  "span",
                  {
                    id: `${Ze}-answer-${M}`,
                    className: "dq-batch-answer-label",
                    title: N.label,
                    children: N.label
                  }
                ),
                /* @__PURE__ */ r(Fi, { id: `${Ze}-effect-${M}`, parts: at(N) })
              ] })
            ] }, N.id);
          }) })
        ] }),
        ve && /* @__PURE__ */ r(Ta, { ...ce, mediaKind: Ce, className: "dq-batch-card" })
      ] })
    ] });
  }
  function vn(N) {
    const M = $t, B = Z && $i.has(Z.group) ? Z.group : null, H = B ? et.filter(Bt[B].test) : [], me = (we) => {
      const Fe = yn(we), Ke = Fe.skipped ? ir(
        we.before.ids,
        Yr(we.before.ids, N.action, N.categories, !0).desired
      ) : mt(we), Mt = !Ke.added.length && !Ke.removed.length;
      return /* @__PURE__ */ c("div", { className: "dq-batch-plan", children: [
        Fe.skipped && /* @__PURE__ */ r("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        Mt ? !Fe.kept.length && /* @__PURE__ */ r("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ r(xi, { added: Ke.added, removed: Ke.removed, tag: Te }),
        Fe.kept.map((ge, it) => /* @__PURE__ */ c("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          Vn(ge.existing.map(Te)).map((Pe) => /* @__PURE__ */ r(jt, { tag: Pe }, Pe.id)),
          " ",
          "instead of",
          " ",
          Vn(ge.tagIds.map(Te)).map((Pe) => /* @__PURE__ */ r(jt, { tag: Pe }, Pe.id))
        ] }, it))
      ] });
    };
    return /* @__PURE__ */ c(be, { children: [
      /* @__PURE__ */ c("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ c("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ r(
            gr,
            {
              value: et.length,
              label: et.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${M.hosts.toLocaleString()} ${M.hosts === 1 ? ft : `${ft}s`}`,
              pressed: ht("matching"),
              onToggle: () => yt({ group: "matching" })
            }
          ),
          /* @__PURE__ */ r(
            gr,
            {
              value: M.willChange,
              label: "will change",
              tone: "add",
              pressed: ht("change"),
              onToggle: () => yt({ group: "change" })
            }
          ),
          /* @__PURE__ */ r(
            gr,
            {
              value: M.correct,
              label: "already correct, no write",
              pressed: ht("correct"),
              onToggle: () => yt({ group: "correct" })
            }
          ),
          /* @__PURE__ */ r(
            gr,
            {
              value: M.different,
              label: k ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: ht("different"),
              onToggle: () => yt({ group: "different" })
            }
          )
        ] }),
        H.length > 0 ? /* @__PURE__ */ r(
          Pi,
          {
            title: Bt[B].title,
            entries: H,
            mediaKind: Ce,
            resultHeading: "Planned change",
            describe: me
          }
        ) : et.length > 0 && /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        et.length > 0 && /* @__PURE__ */ c("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ r("span", { children: ze ? `Dates ${ze.item.media.date}${ie ? ` to ${ie.item.media.date}` : ""}` : "No dates" }),
          ze && /* @__PURE__ */ r(
            "a",
            {
              href: gt(ze),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${Ge.one}, ${ze.item.media.date}`,
              title: br(ze, Ce),
              children: "Open earliest"
            }
          ),
          ie && /* @__PURE__ */ r(
            "a",
            {
              href: gt(ie),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${Ge.one}, ${ie.item.media.date}`,
              title: br(ie, Ce),
              children: "Open latest"
            }
          ),
          Gt.length < et.length && /* @__PURE__ */ c("span", { children: [
            (et.length - Gt.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (M.added.length > 0 || M.removed.length > 0) && /* @__PURE__ */ c("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ r("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ r(
            xi,
            {
              added: M.added,
              removed: M.removed,
              tag: Te,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      M.different > 0 && /* @__PURE__ */ c("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ r("span", { id: `${Ze}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ c(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${Ze}-choice`,
            children: [
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": !k, onClick: () => C(!1), children: "Keep their answer" }),
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": k, onClick: () => C(!0), children: "Replace it" })
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
  function We() {
    return /* @__PURE__ */ c(be, { children: [
      He(),
      On(!0),
      /* @__PURE__ */ c("div", { className: `dq-batch-cards${ve ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ c("section", { className: "dq-batch-card", "aria-labelledby": `${Ze}-chosen`, children: [
          /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ r("h3", { id: `${Ze}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", disabled: S, onClick: cn, children: "Change" })
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-chosen", children: Me.map((N) => {
            const M = Je(N.id);
            return /* @__PURE__ */ c("li", { children: [
              /* @__PURE__ */ c("span", { className: "dq-batch-chosen-chip", children: [
                M && /* @__PURE__ */ r(ct, { binding: M, hidden: !0 }),
                N.label
              ] }),
              /* @__PURE__ */ r(Fi, { parts: at(N) })
            ] }, N.id);
          }) })
        ] }),
        ve && /* @__PURE__ */ r(Ta, { ...ce, mediaKind: Ce, className: "dq-batch-card" })
      ] }),
      S ? /* @__PURE__ */ r("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ r("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ r("span", {}) }) }) : g && vn(g)
    ] });
  }
  function St(N) {
    const M = ne ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, B = M.kind === "apply" ? et.length - N.counts.pending : M.done, H = M.kind === "apply" ? et.length : M.total, me = S ? M.kind === "undo" ? "Undoing batch…" : M.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : M.kind === "undo" ? M.stopped ? "Undo stopped" : "Undo finished" : M.stopped ? "Stopped" : "Finished", we = H ? Math.round(B / H * 100) : 100, Fe = Z && !$i.has(Z.group) ? Z.group : null, Ke = (ge) => Mi.find((it) => it.status === ge).label, Mt = Fe ? et.filter(
      (ge) => ge.status === Fe && (!Z.reason || ge.error === Z.reason)
    ) : [];
    return /* @__PURE__ */ c(be, { children: [
      /* @__PURE__ */ c("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ r("h3", { tabIndex: -1, "data-batch-focus": "", children: me }),
          /* @__PURE__ */ c("span", { children: [
            B.toLocaleString(),
            " of ",
            H.toLocaleString(),
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
            "aria-valuemax": H,
            "aria-valuenow": B,
            children: /* @__PURE__ */ r("span", { style: { width: `${we}%` } })
          }
        ),
        !S && M.kind === "undo" && /* @__PURE__ */ c("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (M.total - N.recorded).toLocaleString(),
          " of",
          " ",
          M.total.toLocaleString(),
          " ",
          M.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ c("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ r("div", { className: "dq-batch-stats", "data-count": "5", children: Mi.map((ge) => /* @__PURE__ */ r(
          gr,
          {
            value: N.counts[ge.status],
            label: ge.label,
            tone: ge.tone,
            pressed: ht(ge.status),
            onToggle: () => yt({ group: ge.status })
          },
          ge.status
        )) }),
        N.reasons.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-batch-reasons", children: N.reasons.map((ge) => {
          const it = ht(ge.status, ge.error);
          return /* @__PURE__ */ c("li", { children: [
            /* @__PURE__ */ c("span", { children: [
              ge.count.toLocaleString(),
              " ",
              ge.status,
              ": ",
              ge.error
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": it,
                onClick: () => yt({ group: ge.status, reason: ge.error }),
                children: it ? "Hide them" : "Show them"
              }
            )
          ] }, `${ge.status}-${ge.error}`);
        }) }),
        Mt.length > 0 ? /* @__PURE__ */ r(
          Pi,
          {
            title: Z.reason ? `${Ke(Fe)}: ${Z.reason}` : `${Ke(Fe)} occurrences`,
            entries: Mt,
            mediaKind: Ce,
            resultHeading: "Result",
            describe: (ge) => ge.error ?? Ke(ge.status)
          }
        ) : /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      N.recorded > 0 && /* @__PURE__ */ c("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: S,
            onClick: () => void Tt("undo"),
            children: [
              /* @__PURE__ */ r($s, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ c("p", { children: [
          $e ? M.stopped || S ? `${N.recorded.toLocaleString()} ${N.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${N.recorded.toLocaleString()} ${N.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${N.recorded === 1 ? "this change" : `these ${N.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function Vt() {
    return f === "answers" ? /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Me.length,
        onClick: Be,
        children: "Preview all matches"
      },
      "preview"
    ) : f === "preview" ? S ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: rt, children: "Cancel preview" }, "cancel-preview") : g ? /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !$t.willChange,
        onClick: () => void Tt("apply"),
        children: [
          "Apply to ",
          $t.willChange.toLocaleString(),
          " ",
          $t.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void Ot(),
        children: "Preview again"
      },
      "again"
    ) : S ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: rt, children: $e ? "Cancel undo" : "Cancel run" }, "cancel-run") : $e || !Nt ? null : /* @__PURE__ */ c(Wi, { children: [
      Nt.retryable && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: () => void Tt("retry"), children: "Retry failed" }),
      Nt.counts.pending > 0 && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void Tt("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ c(be, { children: [
    /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: he,
        title: "Apply answers to all matching occurrences",
        disabled: t || !pt.length,
        onClick: () => {
          sn(), i(), d(!0);
        },
        children: [
          /* @__PURE__ */ r(pi, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    l && /* @__PURE__ */ c(
      "dialog",
      {
        ref: ue,
        className: "dq-batch-dialog",
        "aria-labelledby": `${Ze}-title`,
        "aria-modal": "true",
        onCancel: (N) => {
          N.preventDefault(), wt();
        },
        onClose: () => {
          var N;
          lt.current ? (N = ue.current) == null || N.showModal() : wt();
        },
        children: [
          /* @__PURE__ */ c("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ r(pi, { "aria-hidden": "true" }),
            /* @__PURE__ */ r("h2", { id: `${Ze}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: S,
                onClick: wt,
                children: /* @__PURE__ */ r(Ar, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r(Al, { step: f }),
          /* @__PURE__ */ c(
            "div",
            {
              className: "dq-batch-body",
              ref: W,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": f === "preview" ? "" : void 0,
              "aria-label": `${Ra.find((N) => N.id === f).label} step`,
              children: [
                /* @__PURE__ */ c("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  Q && /* @__PURE__ */ r("p", { role: "status", children: Q }),
                  _ && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: _ })
                ] }),
                f === "answers" ? Kt() : f === "preview" ? We() : St(Nt)
              ]
            }
          ),
          /* @__PURE__ */ c("div", { className: "dq-batch-footer", children: [
            f === "preview" && /* @__PURE__ */ c("button", { type: "button", className: "dq-button", disabled: S, onClick: cn, children: [
              /* @__PURE__ */ r(Zr, { "aria-hidden": "true" }),
              "Back"
            ] }),
            f === "run" && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: S, onClick: sn, children: "New batch" }),
            /* @__PURE__ */ r("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: S, onClick: wt, children: "Close" }),
            Vt()
          ] })
        ]
      }
    )
  ] });
}
const Xo = "data-quality.description-collapsed.v1";
function Rl() {
  try {
    return localStorage.getItem(Xo) === "true";
  } catch {
    return !1;
  }
}
function Il({
  details: e,
  label: t
}) {
  const [n, a] = q(Rl), i = pn(() => {
    a((o) => {
      const s = !o;
      try {
        localStorage.setItem(Xo, String(s));
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ r(ws, { className: "dq-description-body", children: e }) : /* @__PURE__ */ r("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
function Ol({
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
  const f = e ? e.ranked.slice(0, e.limit) : [], h = !!e && (e.ranked.length > e.limit || (((g = e.candidates[e.cursor]) == null ? void 0 : g.total) ?? 0) > 0);
  return /* @__PURE__ */ c("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ c("div", { className: "dq-performer-ranking-status", children: [
      n ? /* @__PURE__ */ c("p", { role: "alert", children: [
        "Could not rank performers. ",
        n
      ] }) : t ? /* @__PURE__ */ c("p", { role: "status", children: [
        "Counting matching ",
        o.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ r("p", { children: f.length ? `Most matching ${o.queue}s first` : `No performer has matching ${o.many}.` }) : null,
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "Refresh counts",
          title: "Refresh counts",
          disabled: t || i,
          onClick: d,
          children: /* @__PURE__ */ r(Ms, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-queue-list", children: f.map((m) => {
      const v = `${m.count.toLocaleString()} matching ${m.count === 1 ? o.one : o.many}`, w = m.flags.length ? `Flagged: ${m.flags.join(", ")}` : "";
      return /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${m.name}, ${v}${w ? `. ${w}` : ""}`,
          title: w || void 0,
          "aria-current": a === m.id ? "true" : void 0,
          disabled: i,
          onClick: () => s(m.id),
          children: [
            /* @__PURE__ */ r(tr, { performer: m }),
            /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: m.name }),
            w && /* @__PURE__ */ r(Jr, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ r("span", { className: "dq-ranked-count", "aria-hidden": "true", children: m.count.toLocaleString() })
          ]
        },
        m.id
      );
    }) }),
    h && !t && !n && /* @__PURE__ */ r(
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
const $l = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], Ml = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function Fl(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), a = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: a, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function Gr(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function xl(e, t) {
  const n = ja(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", a = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Gr(a, "or")}`,
    includesAll: `has ${Gr(a, "and")}`,
    excludes: `has none of ${Gr(a, "or")}`,
    excludesAll: `missing ${Gr(a, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function Pl({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: a,
  onEditCriteria: i
}) {
  const [o, s] = q(!1), [l, d] = q(null), f = x(null), h = x(null), g = Ut(), m = sr(e.conditionTagIds), v = xl(e, m);
  mn(() => {
    if (!o || !f.current) return;
    const k = () => f.current && d(Fl(f.current));
    return k(), window.addEventListener("resize", k), () => window.removeEventListener("resize", k);
  }, [o]), z(() => {
    var C, S;
    if (!o) return;
    const k = (C = h.current) == null ? void 0 : C.querySelector('[aria-pressed="true"]');
    k && !k.disabled ? k.focus() : (S = h.current) == null || S.focus();
  }, [o]);
  const w = () => {
    s(!1), requestAnimationFrame(() => {
      var k;
      return (k = f.current) == null ? void 0 : k.focus();
    });
  }, E = (k) => {
    if (!(k.target instanceof Element && k.target.closest('[role="dialog"]') !== h.current || k.defaultPrevented)) {
      if (k.key === "Escape")
        k.preventDefault(), w();
      else if (k.key === "Tab" && h.current) {
        const S = [...h.current.querySelectorAll(Ml)].filter((Q) => Q.closest('[role="dialog"]') === h.current).sort(
          (Q, F) => Q.compareDocumentPosition(F) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!S.length) return;
        const D = S[0], _ = S[S.length - 1], X = document.activeElement;
        k.shiftKey && (X === D || X === h.current) ? (k.preventDefault(), _.focus()) : !k.shiftKey && X === _ && (k.preventDefault(), D.focus());
      }
    }
  }, $ = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ c("div", { className: "dq-scope", children: [
    /* @__PURE__ */ c(
      "button",
      {
        ref: f,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        "aria-controls": o ? g : void 0,
        title: v,
        onClick: () => o ? w() : s(!0),
        children: [
          /* @__PURE__ */ r(Fs, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-summary", children: v }),
          /* @__PURE__ */ r(no, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ c(be, { children: [
      /* @__PURE__ */ r("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: w }),
      /* @__PURE__ */ c(
        "div",
        {
          ref: h,
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
          onKeyDown: E,
          children: [
            /* @__PURE__ */ c("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: $l.map(({ mode: k, label: C }) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === k,
                  onClick: () => e.targetMode !== k && a({ targetMode: k }),
                  children: C
                },
                k
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ r(
                gn,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (k) => a({ performerIds: k }),
                  placeholder: "All performers...",
                  allowCreate: !1
                }
              ),
              e.targetMode === "filter" && /* @__PURE__ */ c("div", { className: "dq-scope-criteria", children: [
                /* @__PURE__ */ r("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ r(
                  Nr,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: $a,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (k) => a({ performerFilter: k })
                  }
                ) }),
                /* @__PURE__ */ c("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ r(Cr, { "aria-hidden": "true" }),
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
                  onChange: (k) => a({ condition: k.target.value }),
                  children: _a.map((k) => /* @__PURE__ */ r("option", { value: k, children: Da[k] }, k))
                }
              ),
              $ && /* @__PURE__ */ c(be, { children: [
                /* @__PURE__ */ r(
                  gn,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (k) => a({ conditionTagIds: k }),
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
                        onChange: (k) => a({ includeSubtags: k.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  qr(e.condition) && /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.hideConfirmedAbsent ?? !0,
                        onChange: (k) => a({ hideConfirmedAbsent: k.target.checked })
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
function Kr(e) {
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
function Ll(e) {
  const t = e.occurrence;
  return JSON.stringify([
    ke(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {},
    t.flagPerformerTagIds ?? []
  ]);
}
async function Dl(e, t) {
  const n = ke(e) === "audio", a = new Set(e.occurrence.flagPerformerTagIds ?? []), i = (l) => ({
    id: l.id,
    name: l.name,
    total: (n ? l.audioCount : l.videoCount) ?? 0,
    flags: (l.tags ?? []).filter((d) => a.has(d.id)).map((d) => d.name)
  }), o = e.occurrence, s = [];
  if (o.targetMode === "selected" && o.performerIds.length > 0)
    for (const l of o.performerIds) {
      const d = await dc(
        `/api/performers/${l}`,
        { signal: t }
      );
      d && s.push(i(d));
    }
  else {
    const { _filterExpression: l, ...d } = o.targetMode === "filter" ? o.performerFilter : {};
    for (let f = 1; ; f++) {
      const h = await ae(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            wn({
              findFilter: {
                page: f,
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
      if (s.push(...h.items.map(i)), f * 1e3 >= h.totalCount || !h.items.length) break;
    }
  }
  return s.sort((l, d) => d.total - l.total || l.id - d.id);
}
function Zo(e, t, n) {
  const a = ri(e, [t]);
  return pc(a, a.view.filter, n);
}
function es(e, t) {
  const n = e.findIndex(
    (a) => a.count < t.count || a.count === t.count && a.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function Ia(e, t, n, a) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= a && i < n[a - 1].count;
}
async function _l(e, t, n, a, i = {}) {
  const o = Kr(e), s = Ll(e), l = Vo(e.occurrence), d = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: l ? "" : s,
    candidates: l ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await Dl(e, a),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: f } = d, h = [...d.ranked];
  let g = d.cursor, m = !1;
  const v = (w) => ({
    ...d,
    cursor: g,
    ranked: [...h],
    limit: n,
    complete: !w && Ia(f, g, h, n),
    ...w ? { partial: w } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var w;
        for (; !m && !Ia(f, g, h, n); ) {
          a.throwIfAborted();
          const E = f[g++], $ = await Zo(e, E.id, a);
          $ > 0 && es(h, { ...E, count: $ }), (w = i.onProgress) == null || w.call(i, v(!0));
        }
      })
    );
  } catch (w) {
    throw m = !0, w;
  }
  return a.throwIfAborted(), v(!1);
}
function jl(e, t, n) {
  const a = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || a < 0 || a >= e.cursor) return e;
  const i = e.ranked.filter((o) => o.id !== t);
  return n > 0 && es(i, { ...e.candidates[a], count: n }), {
    ...e,
    ranked: i,
    complete: Ia(e.candidates, e.cursor, i, e.limit)
  };
}
function or(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, l) => or(s, t[l]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, a = t, i = Object.keys(n).sort(), o = Object.keys(a).sort();
  return i.length === o.length && i.every(
    (s, l) => s === o[l] && or(n[s], a[s])
  );
}
const aa = [
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
], Ul = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function rr(e) {
  const t = qe(e) ? e.occurrence : void 0;
  return {
    filter: bt({
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
function Li(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function Oa(e, t) {
  let n;
  if (qe(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!aa.some((l) => l !== "performer" && t.has(l))) {
    const l = rr(e);
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
      const f = d.lastIndexOf(":");
      return { key: d.slice(0, f), direction: d.slice(f + 1) };
    });
    if (l.some((d) => !d.key || !["asc", "desc"].includes(d.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = l, i.sort = l[0].key, i.direction = l[0].direction;
  }
  let o;
  if (qe(e) && (o = {
    ...Ul,
    ...Li(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !_a.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (l) => !Number.isSafeInteger(l) || l <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: bt(i, ke(e)),
      objectFilter: Li(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
function vr(e, t) {
  const n = new URLSearchParams(window.location.search);
  aa.forEach((a) => n.delete(a)), n.set("review", e);
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
function an(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return qe(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function Di(e, t) {
  return !t || !qe(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function pa(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const a of e)
    n.set(a.media.id, [...n.get(a.media.id) ?? [], a]);
  return [...n.values()].reverse().flat();
}
const Dt = (e) => e instanceof Error ? e.message : "Request failed.", ha = 50, Gl = [], _i = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function Bl(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? qs(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? Zi(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Kl({ media: e, kind: t }) {
  const [n, a] = q(!1);
  return /* @__PURE__ */ r("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ r(ro, {}) : /* @__PURE__ */ r(Vr, {}) : /* @__PURE__ */ r(
    "img",
    {
      src: qa(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => a(!0)
    }
  ) });
}
function Vl({
  tags: e,
  preview: t,
  showPreview: n,
  trees: a,
  actionTagIds: i,
  label: o
}) {
  const s = Ha(t), l = n ? s : null, d = e == null ? void 0 : e.absent, f = Wa(
    Ae(() => [...i, ...d ?? []], [i, d])
  ), h = (_) => f[_] ?? { id: _, name: f[_] === void 0 ? "…" : "Unavailable tag" }, g = (_) => Vn(_.map(h)), m = l && e ? Ro(l, e, a) : null, v = e ? Mc(e) : [], w = new Set(v.map((_) => _.id)), E = new Set(m == null ? void 0 : m.removed), $ = new Set(m == null ? void 0 : m.markedAbsent), k = new Set(m == null ? void 0 : m.absenceCleared), C = /* @__PURE__ */ c("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ r(ba, { "aria-hidden": "true" }),
    "absent"
  ] }), S = g((m == null ? void 0 : m.added) ?? []), D = g(((m == null ? void 0 : m.markedAbsent) ?? []).filter((_) => !w.has(_)));
  return /* @__PURE__ */ c("section", { className: "dq-panel-section", "aria-label": o, children: [
    /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ c(be, { children: [
      v.length || S.length || D.length ? /* @__PURE__ */ c("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        v.map(
          (_) => E.has(_.id) ? /* @__PURE__ */ c("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ c("del", { children: [
              "− ",
              /* @__PURE__ */ r(jt, { tag: _ })
            ] }),
            $.has(_.id) && C
          ] }, _.id) : /* @__PURE__ */ r("li", { className: "dq-tag", children: /* @__PURE__ */ r(jt, { tag: _ }) }, _.id)
        ),
        S.map((_) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ c("ins", { children: [
          "+ ",
          /* @__PURE__ */ r(jt, { tag: _ })
        ] }) }, `added-${_.id}`)),
        D.map((_) => /* @__PURE__ */ c("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ r("ins", { children: /* @__PURE__ */ r(jt, { tag: _ }) }),
          C
        ] }, `absent-${_.id}`))
      ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ c(be, { children: [
        /* @__PURE__ */ r("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((_) => /* @__PURE__ */ c(
          "li",
          {
            className: `dq-tag dq-tag-absent${k.has(_.id) ? " dq-tag-removed" : ""}`,
            children: [
              /* @__PURE__ */ r(ba, { "aria-hidden": "true" }),
              k.has(_.id) ? /* @__PURE__ */ c("del", { children: [
                "− ",
                /* @__PURE__ */ r(jt, { tag: _ })
              ] }) : /* @__PURE__ */ r(jt, { tag: _ })
            ]
          },
          _.id
        )) })
      ] })
    ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading…" })
  ] });
}
function Jl({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: a,
  onSaveDefaults: i,
  editRequest: o = 0,
  onEditRequestHandled: s,
  pageControls: l
}) {
  var Fr;
  const d = ke(e), f = Yt(d), h = d === "audio" ? "Audio" : "Scene", g = (u) => {
    var b;
    return u.title || ((b = u.files[0]) == null ? void 0 : b.basename) || h;
  }, m = (u) => `${u.occurrence ? `${u.occurrence.performer.name} — ` : ""}${g(u.media)}`, v = x(null), w = x("");
  if (!v.current)
    try {
      v.current = Oa(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (u) {
      w.current = Dt(u), v.current = { query: rr(e), startAtEnd: !1 };
    }
  const [E, $] = q(null), [k, C] = q(""), [S, D] = q(""), _ = x(null), X = x(null), Q = x(null), F = x(null), [ne, le] = q(!!w.current), Z = x(0), [A, I] = q(v.current.query), P = x(A);
  P.current = A;
  const [te, de] = q(0), ue = x(v.current.startAtEnd), [W, he] = q([]), [R, j] = q(null), re = x(null), [Oe, Ee] = q(null), [lt, dt] = q(0), Ze = Ae(() => {
    if (!R) return null;
    const u = W.findIndex((b) => b.key === R.key);
    return u < 0 ? null : W.slice(u + 1).find((b) => b.media.id !== R.media.id) ?? null;
  }, [R, W]), [Xt, kt] = q(0), [$e, Ue] = q(!1), [U, Ce] = q(!1), Ge = x(!1), ft = x(!0), pt = x(null);
  z(() => (ft.current = !0, () => {
    ft.current = !1;
  }), []);
  const [Me, ve] = q(w.current), [ce, O] = q(""), [fe, nt] = q(null), [Te, ee] = q(!1), [Zt, sn] = q([]), wt = x([]), en = x(null), cn = x(null), Be = x(null);
  z(() => {
    var u, b;
    Te && ((b = (u = Be.current) == null ? void 0 : u.querySelector("input")) == null || b.focus());
  }, [Te]);
  const [rt, yt] = q(!1), [ht, Ot] = q(!1);
  z(() => {
    if ($e || rt || !cn.current) return;
    const u = requestAnimationFrame(() => {
      if (document.querySelector(_i)) return;
      const b = cn.current;
      cn.current = null;
      const L = document.activeElement;
      L && L !== document.body || b != null && b.isConnected && !b.disabled && b.focus();
    });
    return () => cancelAnimationFrame(u);
  }, [$e, rt, te]);
  const [Tt, et] = q([]), [ln, yn] = q({}), mt = x(null), vt = x(0), [Ne, $t] = q({});
  z(() => {
    let u = !0;
    return Promise.all(
      ei(A.objectFilter).map(
        async (b) => [
          String(b),
          (await ae(`/api/tags/${b}`)).name
        ]
      )
    ).then((b) => {
      u && $t(Object.fromEntries(b));
    }).catch(() => {
    }), () => {
      u = !1;
    };
  }, [A.objectFilter]);
  const Gt = Ae(
    () => ti(A.objectFilter, Ne),
    [Ne, A.objectFilter]
  ), Nt = x(0), Je = x(e);
  Je.current = e;
  const at = E ?? e, qt = Ae(
    () => an(at, A),
    [at, A]
  ), ze = Ae(
    () => Di(qt, A.performerFocus),
    [qt, A.performerFocus]
  ), ie = x(ze);
  ie.current = ze;
  const gt = x(qt);
  gt.current = qt;
  const [Re, Bt] = q("items"), [He, On] = q(null), Kt = x(null), vn = x("");
  function We(u) {
    const b = typeof u == "function" ? u(Kt.current) : u;
    Kt.current = b, On(b);
  }
  const [St, Vt] = q(!1), [N, M] = q(null), B = x(null), H = qe(qt) ? Kr(qt) : "", [me, we] = q(0), [Fe, Ke] = q(null);
  z(() => () => {
    var u;
    return (u = B.current) == null ? void 0 : u.controller.abort();
  }, []), z(() => {
    const u = B.current;
    !u || u.signature === H || (u.controller.abort(), B.current = null, Vt(!1));
  }, [H]), z(() => {
    var L;
    const u = Kt.current;
    if (Re !== "performers" || !H || ((L = B.current) == null ? void 0 : L.signature) === H || vn.current === H || (u == null ? void 0 : u.signature) === H && u.complete)
      return;
    const b = (u == null ? void 0 : u.signature) === H ? u : null;
    Sn(u, (b == null ? void 0 : b.limit) ?? ha);
  }, [Re, H, He, N, St]);
  const Mt = A.performerFocus, ge = JSON.stringify(
    qe(qt) ? qt.occurrence.flagPerformerTagIds ?? [] : []
  );
  z(() => {
    if (!Mt) {
      Ke(null);
      return;
    }
    let u = !0;
    const b = new Set(JSON.parse(ge));
    return ae(
      `/api/performers/${Mt}`
    ).then((L) => {
      u && Ke({
        id: Mt,
        name: L.name,
        flags: (L.tags ?? []).filter((V) => b.has(V.id)).map((V) => V.name)
      });
    }).catch(() => {
    }), () => {
      u = !1;
    };
  }, [Mt, ge]);
  const it = A.startFrom !== (e.view.startFrom ?? "end") || !or(
    JSON.parse(_t(an(e, A))),
    JSON.parse(_t(an(e, rr(e))))
  ), Pe = U || $e || Te, tn = Number(A.filter.page);
  function ut(u, b = !1) {
    Ge.current || (w.current = "", ue.current = b, P.current = u, I(u), kt(0), Ue(!0), b || vr(e.id, u), de((L) => L + 1));
  }
  function Nn() {
    if (Ge.current = !1, Ce(!1), ft.current && pt.current) {
      const u = pt.current;
      pt.current = null, ut(u.query, u.startAtEnd);
    }
  }
  z(() => {
    const u = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const b = Oa(
            Je.current,
            new URLSearchParams(window.location.search)
          );
          Ge.current ? pt.current = b : ut(b.query, b.startAtEnd);
        } catch (b) {
          ve(Dt(b));
        }
    };
    return window.addEventListener("popstate", u), () => window.removeEventListener("popstate", u);
  }, [e.id]), z(() => (a(U || $e || Te || !!E), () => a(!1)), [U, $e, Te, !!E, a]);
  async function ye(u, b, L) {
    if (qe(u)) {
      const J = await Jo(
        u,
        mt.current,
        b,
        L
      );
      return {
        items: J.items.map((Y) => ({
          key: Y.key,
          media: Y.media,
          occurrence: Y
        })),
        totalCount: J.totalCount
      };
    }
    const V = await yr(
      u,
      { ...u.view.filter, page: b },
      L
    );
    return {
      items: V.items.map((J) => ({ key: String(J.id), media: J })),
      totalCount: V.totalCount
    };
  }
  function qn(u, b, L, V = !1, J = !1) {
    if (!ft.current || pt.current) return;
    le(!0), he(
      J ? u.items : pa(u.items, P.current.startFrom === "end")
    ), kt(u.totalCount), Ft(L, V);
    const Y = {
      ...P.current,
      filter: { ...P.current.filter, page: b }
    };
    P.current = Y, I(Y), vr(e.id, Y);
  }
  function Ft(u, b = !1) {
    (u == null ? void 0 : u.key) !== (R == null ? void 0 : R.key) && (re.current = null), (u == null ? void 0 : u.media.id) !== (R == null ? void 0 : R.media.id) && Ee(b && u ? u.media.id : null), j(u);
  }
  z(() => {
    if (w.current) return;
    const u = new AbortController();
    F.current = u;
    const b = ++Nt.current;
    return Ue(!0), ve(""), O(""), re.current = null, Ee(null), j(null), he([]), ee(!1), (async () => {
      const L = Di(
        an(Je.current, P.current),
        P.current.performerFocus
      );
      mt.current = qe(L) ? await ni(L, u.signal) : null;
      let V = Number(L.view.filter.page), J = await ye(L, V, u.signal);
      const Y = Math.max(
        1,
        Math.ceil(J.totalCount / Number(L.view.filter.perPage))
      );
      (ue.current || V > Y) && (V = Y, J = await ye(L, V, u.signal)), ue.current = !1;
      const Le = L.view.startFrom === "end" ? -1 : 1;
      for (; qe(L) && !J.items.length && V + Le >= 1 && V + Le <= Y && !u.signal.aborted; )
        V += Le, J = await ye(L, V, u.signal);
      if (b !== Nt.current || u.signal.aborted) return;
      const ot = pa(J.items, L.view.startFrom === "end");
      qn(J, V, ot[0] ?? null);
    })().catch((L) => {
      !u.signal.aborted && b === Nt.current && ve(Dt(L));
    }).finally(() => {
      !u.signal.aborted && b === Nt.current && (le(!0), Ue(!1));
    }), () => {
      u.abort(), Nt.current++;
    };
  }, [te, e.id]), z(() => {
    if (nt(null), !R) return;
    let u = !0;
    return Ht(d, R).then((b) => {
      u && (nt(b), et(
        qe(e) ? b.ids.filter((L) => e.occurrence.tagIds.includes(L)) : []
      ));
    }).catch((b) => {
      u && ve(`Could not load current tags. ${Dt(b)}`);
    }), () => {
      u = !1;
    };
  }, [R]), z(() => {
    if (!qe(e) || e.actions.length)
      return;
    let u = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (b) => [
          b,
          (await ae(`/api/tags/${b}`)).name
        ]
      )
    ).then((b) => {
      u && yn(Object.fromEntries(b));
    }).catch((b) => {
      u && ve(Dt(b));
    }), () => {
      u = !1;
    };
  }, [e]);
  async function Ir(u = !1, b = !1, L = !1) {
    var jn;
    if (!R) return;
    const V = W.findIndex((De) => De.key === R.key), J = A.startFrom === "end" ? -1 : 1, Y = ((jn = re.current) == null ? void 0 : jn.key) === R.key ? re.current : { key: R.key, page: tn, before: W.slice(0, V + 1).map((De) => De.key), after: W.slice(V + 1).map((De) => De.key) }, Le = new Set(Y.after), ot = new Set(Y.before), An = W.find((De) => {
      var zt;
      return Le.has(De.key) || (J === 1 || tn < Y.page) && ((zt = re.current) == null ? void 0 : zt.key) === R.key && !ot.has(De.key);
    });
    if (!u && An) {
      Ft(An, L);
      return;
    }
    const st = u ? ot : new Set(W.map((De) => De.key)), Rt = 1100 - (Date.now() - vt.current);
    Rt > 0 && await new Promise((De) => window.setTimeout(De, Rt));
    let Xe = J === -1 && !u ? Math.max(1, tn - 1) : tn;
    for (; ft.current && !pt.current; ) {
      let De = await ye(ze, Xe);
      const zt = Math.max(
        1,
        Math.ceil(De.totalCount / Number(A.filter.perPage))
      );
      Xe > zt && (Xe = zt, De = await ye(ze, Xe));
      const Un = pa(De.items, J === -1), xr = new Map(Un.map((Ct) => [Ct.key, Ct])), Gn = u ? Y.after.flatMap((Ct) => {
        const Pr = xr.get(Ct);
        return Pr ? [Pr] : [];
      }) : [], pr = new Set(Gn.map((Ct) => Ct.key)), un = u ? {
        ...De,
        items: [
          ...Gn,
          ...Un.filter(
            (Ct) => Ct.key !== R.key && !pr.has(Ct.key)
          )
        ]
      } : De;
      if (b) {
        re.current = Y, qn(un, Xe, R, !1, u);
        return;
      }
      const hr = J === -1 && tn === 1 && !u ? void 0 : un.items.find(
        (Ct) => !st.has(Ct.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(u && J === -1 && Xe === Y.page) || Le.has(Ct.key))
      );
      if (hr || (J === -1 ? Xe <= 1 : Xe >= zt)) {
        qn(
          un,
          Xe,
          hr ?? null,
          L,
          u
        ), hr || O(
          De.totalCount ? `Reached the end in this direction. Matching items remain available from the ${f.queue} pages.` : `No matching ${f.many}.`
        );
        return;
      }
      Xe += J;
    }
  }
  async function xt(u, b = !1, L = !1, V = !1) {
    if (E || !R || Ge.current || $e || Te && !L)
      return;
    const J = L || V || !!(u != null && u.steps.length), Y = J && !b;
    if (J && (!t || !fe) || u && Tn(u) && !n) return;
    Ge.current = !0, Ce(!0), ve(""), O("");
    const Le = W.findIndex((st) => st.key === R.key), ot = J && !b && Le >= 0 ? W[Le + 1] ?? null : null;
    ot && (he(
      (st) => st.filter((Rt) => Rt.key !== R.key)
    ), Ft(ot, !0));
    let An = !1;
    try {
      if (J) {
        const st = await Ht(d, R);
        if (u)
          await pl(ze, R, u);
        else {
          const Xe = V && qe(e) ? e.occurrence.tagIds.filter((zt) => st.ids.includes(zt)) : wt.current, De = ir(Xe, V ? Tt : Zt);
          await ii(ze, R, De);
        }
        vt.current = Date.now();
        const Rt = await Ht(d, R);
        ot || nt(Rt), An = !0, ee(!1), O("Tags saved."), R.occurrence && (lr(R.occurrence.performer.id), we((Xe) => Xe + 1));
      }
      if (!ft.current || pt.current) return;
      J ? await Ir(!0, b, Y) : b || await Ir(), b && L && requestAnimationFrame(() => {
        var st;
        return (st = en.current) == null ? void 0 : st.focus();
      });
    } catch (st) {
      if (ve(
        An ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Dt(st)}` : J ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Dt(st)}` : `Could not advance. ${Dt(st)}`
      ), J && !An) {
        ot && (he(W), Ee(null), dt((Rt) => Rt + 1), j(R)), vt.current = Date.now();
        try {
          nt(await Ht(d, R));
        } catch {
          nt(null), ve(
            (Rt) => `${Rt} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Nn();
    }
  }
  const $n = !Te && !E && !rt && !ht && (R != null || $e || U);
  Ja({
    surface: "local",
    enabled: $n,
    actionCount: e.actions.length,
    onAction: (u, b) => {
      const L = e.actions[u];
      L && xt(L, b);
    },
    onFind: () => Ot(!0)
  });
  const Pt = (u) => U || $e || !fe || !!E || !t && u.steps.length > 0 || !n && Tn(u);
  function zn() {
    if (!i || E || Ge.current || Te) return;
    Q.current = document.activeElement, X.current = {
      error: Me,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(P.current),
      items: W,
      current: R,
      total: Xt,
      targets: mt.current,
      stayedCursor: re.current
    };
    const u = structuredClone(an(e, P.current));
    $(u), D(Sr(u)), C(""), O(""), ve("");
  }
  z(() => {
    if (!o) {
      Z.current = 0;
      return;
    }
    o !== Z.current && ne && !$e && (Z.current = o, zn(), s == null || s());
  }, [o, $e, ne]);
  function nn() {
    $(null), C(""), requestAnimationFrame(() => {
      const u = Q.current;
      u != null && u.isConnected && u !== document.body && u.focus();
    });
  }
  function xe() {
    var b;
    const u = X.current;
    !u || U || ((b = F.current) == null || b.abort(), Nt.current++, P.current = u.query, I(u.query), he(u.items), j(u.current), kt(u.total), mt.current = u.targets, re.current = u.stayedCursor, Ue(!1), ve(u.error), O(""), window.history.replaceState(window.history.state, "", u.url), nn());
  }
  async function cr() {
    if (!E || !i || Ge.current) return;
    const u = an(
      { ...E, name: E.name.trim() },
      P.current
    ), b = kr(u);
    if (b) {
      C(b);
      return;
    }
    Ge.current = !0, Ce(!0), C("");
    try {
      if (await i(u) === !1) throw new Error("Could not save review.");
      nn(), O("Review saved.");
    } catch (L) {
      C(
        "Could not save review. Your edits are still open. " + Dt(L)
      );
    } finally {
      Nn();
    }
  }
  async function Or() {
    if (!i || Ge.current) return;
    const u = an(e, {
      ...P.current,
      filter: { ...P.current.filter, page: 1 }
    });
    Ge.current = !0, Ce(!0), ve("");
    try {
      if (await i(u) === !1) throw new Error("Could not save review.");
      O("Queue saved to this review.");
    } catch (b) {
      ve("Could not save queue. " + Dt(b));
    } finally {
      Nn();
    }
  }
  const tt = A.performerScope, Mn = (u) => {
    const { performerFocus: b, ...L } = P.current, V = b && !("targetMode" in u || "performerIds" in u || "performerFilter" in u);
    ut({
      ...L,
      ...V ? { performerFocus: b } : {},
      filter: { ...L.filter, page: 1 },
      performerScope: { ...tt, ...u }
    });
  };
  async function Sn(u, b) {
    var J;
    const L = gt.current;
    if (!qe(L)) return;
    (J = B.current) == null || J.controller.abort();
    const V = {
      signature: Kr(L),
      controller: new AbortController()
    };
    B.current = V, vn.current = "", Vt(!0), M(null);
    try {
      const Y = await _l(L, u, b, V.controller.signal, {
        onProgress: (Le) => {
          B.current === V && We(Le);
        }
      });
      B.current === V && We(Y);
    } catch (Y) {
      B.current === V && !V.controller.signal.aborted && (vn.current = V.signature, M({ signature: V.signature, message: Dt(Y) }));
    } finally {
      B.current === V && (B.current = null, Vt(!1));
    }
  }
  function Fn() {
    var u;
    (u = B.current) == null || u.controller.abort(), B.current = null, Vt(!1), We((b) => b && { ...b, partial: !0, complete: !1 });
  }
  async function lr(u) {
    var J;
    const b = gt.current;
    if (!qe(b)) return;
    if (B.current) {
      Fn();
      return;
    }
    const L = Kr(b);
    if (((J = Kt.current) == null ? void 0 : J.signature) !== L || Kt.current.partial) return;
    const V = 1100 - (Date.now() - vt.current);
    V > 0 && await new Promise((Y) => window.setTimeout(Y, V));
    try {
      const Y = await Zo(b, u);
      if (B.current) {
        Fn();
        return;
      }
      We(
        (Le) => (Le == null ? void 0 : Le.signature) === L ? jl(Le, u, Y) : Le
      );
    } catch {
      We(
        (Y) => (Y == null ? void 0 : Y.signature) === L ? { ...Y, partial: !0, complete: !1 } : Y
      );
    }
  }
  const xn = A.performerFocus ? He == null ? void 0 : He.candidates.find((u) => u.id === A.performerFocus) : void 0, Ye = (Fe == null ? void 0 : Fe.id) === A.performerFocus ? Fe : xn ?? null;
  function Wn(u) {
    if (Ge.current) return;
    const b = {
      ...P.current,
      performerFocus: u,
      filter: { ...P.current.filter, page: 1 }
    };
    ut(b, b.startFrom === "end"), Bt("items");
  }
  function Pn() {
    const { performerFocus: u, ...b } = P.current;
    ut(
      { ...b, filter: { ...b.filter, page: 1 } },
      b.startFrom === "end"
    );
  }
  const Qn = x(null);
  Qn.current ?? (Qn.current = Oo());
  const dr = Qn.current, Ln = Io(at.actions), ia = Ae(
    () => at.actions.flatMap((u) => u.steps.flatMap((b) => b.tagIds)),
    [at.actions]
  ), $r = x(null);
  z(() => {
    const u = $r.current, b = u == null ? void 0 : u.querySelector('[aria-current="true"]');
    if (!u || !b) return;
    const L = u.getBoundingClientRect(), V = b.getBoundingClientRect();
    V.top < L.top ? u.scrollTop -= L.top - V.top : V.bottom > L.bottom && (u.scrollTop += V.bottom - L.bottom);
  }, [R == null ? void 0 : R.key, Re]);
  const Hn = x(null), ur = x(null);
  z(() => {
    var L, V;
    const u = ur.current;
    if (!u) return;
    ur.current = null;
    const b = [...((L = Hn.current) == null ? void 0 : L.querySelectorAll(".dq-partner")) ?? []];
    (V = b.find((J) => J.dataset.partnerKey === u) ?? b[0]) == null || V.focus();
  }, [R == null ? void 0 : R.key]);
  const Et = U || $e || Te || !!E, rn = Ae(
    () => E ? an(E, A) : null,
    [E, A]
  ), Dn = Ae(
    () => rn != null && Sr(rn) !== S,
    [rn, S]
  );
  function En() {
    R ? Ht(d, R).then(nt).catch((u) => ve(Dt(u))) : ut(P.current);
  }
  const Cn = Me ? /* @__PURE__ */ c("p", { role: "alert", children: [
    Me,
    " ",
    /* @__PURE__ */ r("button", { type: "button", disabled: U, onClick: En, children: R ? "Reload tags" : "Retry queue" })
  ] }) : null, Jt = U || $e || R != null && !fe, oa = Math.max(1, Number(A.filter.perPage) || 1), Mr = x(1);
  $e || (Mr.current = Math.max(1, Math.ceil(Xt / oa)));
  const fr = Mr.current, Yn = tt && R ? W.filter(
    (u) => u.media.id === R.media.id && u.key !== R.key
  ) : [], _n = R != null && R.occurrence && R.occurrence.performer.id === A.performerFocus ? (Ye == null ? void 0 : Ye.flags) ?? [] : R != null && R.occurrence ? ((Fr = He == null ? void 0 : He.candidates.find((u) => u.id === R.occurrence.performer.id)) == null ? void 0 : Fr.flags) ?? [] : [], dn = (u) => {
    var b;
    return u.title || ((b = u.files[0]) == null ? void 0 : b.basename) || `${d === "audio" ? "Audio" : "Video"} ${u.id}`;
  }, Se = R ? Bl(R.media, d) : "";
  return /* @__PURE__ */ c(
    "section",
    {
      className: `dq-review-workspace${d === "audio" ? " dq-audio" : ""}`,
      "aria-label": tt ? d === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : d === "audio" ? "Audio review" : "Video review",
      onClickCapture: (u) => {
        var V;
        const b = u.target instanceof Element ? u.target.closest("button") : null, L = (b == null ? void 0 : b.getAttribute("aria-label")) ?? ((V = b == null ? void 0 : b.textContent) == null ? void 0 : V.trim()) ?? "";
        b && !b.closest(_i) && /^(Filters|Edit filter:|Edit criteria)/.test(L) && (cn.current = b);
      },
      children: [
        /* @__PURE__ */ r(
          _o,
          {
            name: e.name,
            description: e.description,
            entityType: je(e),
            onBack: l == null ? void 0 : l.onBack,
            backDisabled: Et,
            onEdit: E ? () => {
              var u;
              return (u = _.current) == null ? void 0 : u.focus();
            } : zn,
            editDisabled: !E && (Et || !i),
            editing: !!E,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: U || Te, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: d === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ r(
                  Nr,
                  {
                    filter: A.filter,
                    objectFilter: Gt,
                    criteriaDefinitions: d === "audio" ? Hi : Ma,
                    customFieldEntityType: d,
                    totalCount: Xt,
                    sortOptions: d === "audio" ? ys : Yi,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(
                      jo,
                      {
                        page: Math.min(Math.max(1, tn || 1), fr),
                        pages: fr,
                        onPage: (u) => ut({
                          ...P.current,
                          filter: bt(
                            { ...P.current.filter, page: u },
                            d
                          )
                        })
                      }
                    ),
                    onFilterChange: (u) => {
                      (u.sort !== P.current.filter.sort || u.direction !== P.current.filter.direction) && (u = { ...u, sorts: void 0 }), ut({
                        ...P.current,
                        filter: bt(u, d)
                      });
                    },
                    onObjectFilterChange: (u) => {
                      ut({
                        ...P.current,
                        objectFilter: Bo(
                          u,
                          Ne,
                          P.current.objectFilter
                        ),
                        filter: { ...P.current.filter, page: 1 }
                      });
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ c(be, { children: [
              tt && /* @__PURE__ */ r(
                Pl,
                {
                  scope: tt,
                  disabled: U || Te,
                  editing: !!E,
                  onChange: Mn,
                  onEditCriteria: () => yt(!0)
                }
              ),
              qe(ze) && t && /* @__PURE__ */ r(
                Tl,
                {
                  review: ze,
                  disabled: Pe || !!E,
                  performerFlags: A.performerFocus ? Ye == null ? void 0 : Ye.flags : void 0,
                  trees: Ln,
                  onOpen: () => {
                    Ge.current = !0, Ce(!0);
                  },
                  onWrite: () => {
                    vt.current = Date.now();
                  },
                  onClose: (u) => {
                    if (u) {
                      vt.current = Date.now();
                      const b = P.current.performerFocus;
                      b ? lr(b) : Fn(), we((L) => L + 1), new Promise((L) => window.setTimeout(L, 1100)).then(() => {
                        Nn(), ft.current && (w.current || Ue(!0), de((L) => L + 1));
                      });
                    } else Nn();
                  }
                }
              ),
              (l == null ? void 0 : l.onGrid) && /* @__PURE__ */ r(
                Uo,
                {
                  mode: "single",
                  disabled: Et,
                  onChange: () => {
                    var u;
                    return (u = l.onGrid) == null ? void 0 : u.call(l);
                  }
                }
              ),
              (l == null ? void 0 : l.onManage) && /* @__PURE__ */ r(
                Go,
                {
                  disabled: Et,
                  items: [
                    {
                      label: "Manage reviews",
                      disabled: l.manageDisabled,
                      onSelect: () => {
                        var u;
                        return (u = l.onManage) == null ? void 0 : u.call(l);
                      }
                    }
                  ]
                }
              )
            ] }),
            chipsStart: A.performerFocus ? /* @__PURE__ */ c("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ r(
                tr,
                {
                  performer: {
                    id: A.performerFocus,
                    name: (Ye == null ? void 0 : Ye.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ c("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ r("strong", { children: (Ye == null ? void 0 : Ye.name) ?? `performer ${A.performerFocus}` })
              ] }),
              Ye != null && Ye.flags.length ? /* @__PURE__ */ c(
                "span",
                {
                  className: "dq-focus-flag",
                  title: `Flagged: ${Ye.flags.join(", ")}`,
                  children: [
                    /* @__PURE__ */ r(Jr, { "aria-hidden": "true" }),
                    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
                      "Flagged: ",
                      Ye.flags.join(", ")
                    ] })
                  ]
                }
              ) : null,
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: Pe,
                  onClick: Pn,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            chipsEnd: E ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : it ? /* @__PURE__ */ c(be, { children: [
              /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
              /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: "dq-text-button",
                  title: "Save the current queue criteria to this review",
                  disabled: Pe || !i,
                  onClick: () => void Or(),
                  children: [
                    /* @__PURE__ */ r(ao, { "aria-hidden": "true" }),
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
                  disabled: Pe,
                  onClick: () => {
                    const u = rr(e);
                    ut(u, u.startFrom === "end");
                  },
                  children: [
                    /* @__PURE__ */ r(io, { "aria-hidden": "true" }),
                    "Reset"
                  ]
                }
              )
            ] }) : void 0
          }
        ),
        l == null ? void 0 : l.notices,
        /* @__PURE__ */ c("div", { className: "dq-review-area", children: [
          E && rn && /* @__PURE__ */ r(
            Lo,
            {
              drawerRef: _,
              draft: rn,
              onChange: (u) => $(u),
              direction: A.startFrom,
              onDirectionChange: (u) => ut({ ...P.current, startFrom: u }),
              tagGroups: Gl,
              trees: Ln,
              saving: U,
              saveDisabled: $e,
              error: k,
              dirty: Dn,
              notices: Cn && /* @__PURE__ */ r("div", { className: "dq-review-feedback", children: Cn }),
              onSave: () => void cr(),
              onCancel: xe
            }
          ),
          /* @__PURE__ */ r("div", { className: "dq-review-main", children: /* @__PURE__ */ c("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ c("div", { className: "dq-review-stage", children: [
              R ? /* @__PURE__ */ c(be, { children: [
                /* @__PURE__ */ c("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ r("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ c(
                    "a",
                    {
                      href: `/${d}/${R.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${f.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ r("span", { children: dn(R.media) }),
                        /* @__PURE__ */ r(oo, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Se && /* @__PURE__ */ r("span", { className: "dq-stage-meta", children: Se })
                ] }),
                /* @__PURE__ */ c("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ r("div", { className: "dq-player-frame", children: [R, Ze].filter(Boolean).map((u) => {
                    var V, J, Y, Le, ot;
                    const b = u, L = b.key === R.key;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        className: L ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": L ? void 0 : !0,
                        inert: L ? void 0 : !0,
                        children: d === "audio" ? /* @__PURE__ */ r(
                          vs,
                          {
                            streamUrl: Sa("audio", b.media.id),
                            format: ((V = b.media.files[0]) == null ? void 0 : V.format) ?? "",
                            title: g(b.media),
                            coverUrl: L ? qa("audio", b.media) : void 0,
                            duration: ((J = b.media.files[0]) == null ? void 0 : J.duration) ?? 0,
                            autostart: L && Oe === b.media.id
                          }
                        ) : /* @__PURE__ */ r(
                          Xi,
                          {
                            videoId: b.media.id,
                            streamUrl: Sa("video", b.media.id),
                            posterUrl: L ? qa("video", b.media) : void 0,
                            duration: ((Y = b.media.files[0]) == null ? void 0 : Y.duration) ?? 0,
                            format: (Le = b.media.files[0]) == null ? void 0 : Le.format,
                            audioCodec: (ot = b.media.files[0]) == null ? void 0 : ot.audioCodec,
                            extensionSurface: L ? "quick-view" : void 0,
                            autostart: L && Oe === b.media.id,
                            keyboardShortcutsEnabled: L,
                            showAbLoop: L,
                            clip: b.media.parentVideoId != null ? {
                              start: b.media.clipStartSec ?? 0,
                              end: b.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${b.media.id}:${lt}`
                    );
                  }) }),
                  d === "audio" && /* @__PURE__ */ r(
                    Il,
                    {
                      details: R.media.details,
                      label: f.one
                    },
                    R.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ r("p", { role: "status", className: "dq-stage-status", children: $e ? "Loading review…" : Xt ? "Reached the end in this direction." : `No matching ${f.many}.` }),
              at.actions.length > 0 ? /* @__PURE__ */ r(
                Fc,
                {
                  actions: at.actions,
                  mediaKind: d,
                  isDisabled: (u) => Te || Pt(u),
                  busy: Jt,
                  tags: fe,
                  trees: Ln,
                  preview: dr,
                  onApply: (u, b) => void xt(u, b),
                  onFind: () => Ot(!0),
                  findDisabled: Te || !!E,
                  paused: !!E
                }
              ) : qe(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ c(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || U || Te || !fe || !!E || !R,
                  children: [
                    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((u) => /* @__PURE__ */ c("label", { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Tt.includes(u),
                          onChange: (b) => et(
                            e.occurrence.multiple ? b.target.checked ? [...Tt, u] : Tt.filter((L) => L !== u) : [u]
                          )
                        }
                      ),
                      ln[u] ?? "Loading tag…"
                    ] }, u)),
                    /* @__PURE__ */ c("div", { className: "dq-row", children: [
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => et([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void xt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void xt(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ c("div", { className: "dq-panel-body", ref: Hn, children: [
                R && /* @__PURE__ */ c(be, { children: [
                  /* @__PURE__ */ c("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ c("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: R.occurrence ? R.occurrence.performer.name : `this ${f.one}` })
                    ] }),
                    /* @__PURE__ */ c("div", { className: "dq-reviewing-who", children: [
                      R.occurrence && /* @__PURE__ */ r(tr, { performer: R.occurrence.performer }),
                      /* @__PURE__ */ c("div", { children: [
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: R.occurrence ? R.occurrence.performer.name : `This ${f.one}` }),
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-note", children: tt ? `Tags apply to this performer in this ${f.queue}` : `Tags apply to the whole ${f.one}` })
                      ] })
                    ] }),
                    _n.length > 0 && /* @__PURE__ */ c("p", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
                      /* @__PURE__ */ r(Jr, { "aria-hidden": "true" }),
                      "Flagged: ",
                      _n.join(", ")
                    ] })
                  ] }),
                  Yn.length > 0 && /* @__PURE__ */ c(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${f.queue}`,
                      children: [
                        /* @__PURE__ */ c("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          f.queue
                        ] }),
                        /* @__PURE__ */ r("div", { className: "dq-partners", children: Yn.map((u) => {
                          var b, L, V;
                          return /* @__PURE__ */ c(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (b = u.occurrence) == null ? void 0 : b.performer.name,
                              "aria-label": (L = u.occurrence) == null ? void 0 : L.performer.name,
                              "data-partner-key": u.key,
                              disabled: Pe,
                              onClick: () => {
                                ur.current = R.key, Ft(u), ve("");
                              },
                              children: [
                                u.occurrence && /* @__PURE__ */ r(tr, { performer: u.occurrence.performer }),
                                /* @__PURE__ */ r("span", { children: (V = u.occurrence) == null ? void 0 : V.performer.name })
                              ]
                            },
                            u.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ r(
                    Vl,
                    {
                      tags: fe,
                      preview: dr,
                      showPreview: !Te,
                      trees: Ln,
                      actionTagIds: ia,
                      label: `Current ${tt ? "occurrence" : f.one} tags`
                    }
                  ),
                  Te && /* @__PURE__ */ c(
                    "fieldset",
                    {
                      ref: Be,
                      disabled: U,
                      className: "dq-panel-section dq-tag-editor",
                      children: [
                        /* @__PURE__ */ c("legend", { className: "dq-eyebrow", children: [
                          "Edit ",
                          tt ? "occurrence" : f.one,
                          " tags"
                        ] }),
                        /* @__PURE__ */ r(
                          gn,
                          {
                            entityType: "tag",
                            values: Zt,
                            onChange: sn,
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
                              disabled: !fe,
                              onClick: () => void xt(void 0, !0, !0),
                              children: "Save"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              disabled: !fe,
                              onClick: () => void xt(void 0, !1, !0),
                              children: "Save & next"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              onClick: () => {
                                ee(!1), requestAnimationFrame(() => {
                                  var u;
                                  return (u = en.current) == null ? void 0 : u.focus();
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
                qe(qt) && A.performerFocus && /* @__PURE__ */ r(
                  ql,
                  {
                    review: qt,
                    performerId: A.performerFocus,
                    revision: me
                  }
                )
              ] }),
              /* @__PURE__ */ c("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ c("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !E && Cn,
                  ce && /* @__PURE__ */ r("p", { role: "status", children: ce })
                ] }),
                !t && /* @__PURE__ */ r("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                R && /* @__PURE__ */ c("div", { className: "dq-panel-actions", "aria-busy": Jt || void 0, children: [
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      ref: en,
                      className: "dq-button",
                      disabled: Pe || !!E || !t || !fe,
                      onClick: () => {
                        wt.current = [...fe.ids], sn([...fe.ids]), ee(!0);
                      },
                      children: [
                        /* @__PURE__ */ r(xs, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: Pe || !!E,
                      onClick: () => void xt(),
                      children: [
                        /* @__PURE__ */ r(Ps, { "aria-hidden": "true" }),
                        "Skip",
                        tt ? " performer" : ` ${f.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              tt && /* @__PURE__ */ c(
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
                        "aria-pressed": Re === "items",
                        onClick: () => Bt("items"),
                        children: d === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Re === "performers",
                        onClick: () => Bt("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              tt && Re === "performers" ? /* @__PURE__ */ r(
                Ol,
                {
                  ranking: (He == null ? void 0 : He.signature) === H ? He : null,
                  busy: St,
                  error: (N == null ? void 0 : N.signature) === H ? N.message : "",
                  focus: A.performerFocus,
                  disabled: Pe,
                  labels: f,
                  onFocus: Wn,
                  onMore: () => {
                    const u = Kt.current;
                    u && Sn(u, u.limit + ha);
                  },
                  onRefresh: () => {
                    We(null), Sn(null, ha);
                  }
                }
              ) : /* @__PURE__ */ r("div", { className: "dq-queue-list", ref: $r, children: W.map((u) => {
                var L;
                const b = (R == null ? void 0 : R.key) === u.key;
                return /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: m(u),
                    "aria-label": m(u),
                    "aria-current": b ? "true" : void 0,
                    disabled: Pe,
                    onClick: () => {
                      Ft(u), ve(""), O("");
                    },
                    children: [
                      /* @__PURE__ */ r(Kl, { media: u.media, kind: d }),
                      /* @__PURE__ */ c("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: g(u.media) }),
                        /* @__PURE__ */ c("span", { className: "dq-queue-row-meta", children: [
                          u.occurrence && /* @__PURE__ */ c(be, { children: [
                            /* @__PURE__ */ r(tr, { performer: u.occurrence.performer }),
                            /* @__PURE__ */ r("span", { className: "dq-queue-row-performer", children: u.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ r("span", { className: "dq-queue-row-detail", children: [
                            u.media.date,
                            u.occurrence ? "" : (L = u.media.files[0]) != null && L.duration ? Zi(u.media.files[0].duration) : ""
                          ].filter(Boolean).join(" · ") })
                        ] })
                      ] })
                    ]
                  },
                  u.key
                );
              }) })
            ] })
          ] }) })
        ] }),
        tt && /* @__PURE__ */ r(
          Ns,
          {
            open: rt,
            onClose: () => yt(!1),
            criteria: $a,
            activeFilter: tt.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (u) => {
              yt(!1), Mn({ performerFilter: u });
            }
          }
        ),
        ht && /* @__PURE__ */ r(
          Qa,
          {
            actions: e.actions,
            trees: Ln,
            isDisabled: (u) => Pt(u),
            onApply: (u, b) => {
              Ot(!1), xt(u, b);
            },
            onClose: () => Ot(!1)
          }
        )
      ]
    }
  );
}
function zl(e) {
  var l, d, f;
  const [t, n] = q({}), [a, i] = q(""), o = (((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotations) ?? []).includes("tags") ? ((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...o,
      ...((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.binParents) ?? []
    ])
  ]);
  return z(() => {
    let h = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(s).map(
        async (g) => [g, await na([g])]
      )
    ).then((g) => {
      h && n(Object.fromEntries(g));
    }).catch(() => {
      h && i(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      h = !1;
    };
  }, [s]), { ids: t, error: a };
}
function Wl(e, t, n) {
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
function Ql({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: a,
  disabled: i,
  onToggle: o
}) {
  var w;
  const s = ((w = t.presentation) == null ? void 0 : w.binParents) ?? [], l = new Set(
    s.flatMap((E) => (a[E] ?? []).filter(($) => $ !== E))
  ), d = s.every((E) => a[E]), f = ts(t.view.objectFilter, n).bins.filter(
    (E) => !d || l.has(E)
  ), h = /* @__PURE__ */ new Map();
  for (const E of e)
    for (const $ of E.tags ?? [])
      if (l.has($.id)) {
        const k = h.get($.id) ?? { name: $.name, count: 0 };
        k.count++, h.set($.id, k);
      }
  const g = f.filter((E) => !h.has(E)), m = sr(g);
  for (const E of g)
    h.set(E, {
      name: m[E] === void 0 ? "…" : m[E] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const v = [...h].sort((E, $) => E[1].name.localeCompare($[1].name));
  return /* @__PURE__ */ c("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ r("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    v.map(([E, $]) => {
      const k = f.includes(E);
      return /* @__PURE__ */ c(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": k,
          title: k ? `Show every video again, not only ${$.name}` : `Show only videos tagged ${$.name}`,
          disabled: i,
          onClick: () => o(E),
          children: [
            k && /* @__PURE__ */ r(La, { "aria-hidden": "true" }),
            $.name,
            " ",
            /* @__PURE__ */ r("span", { className: "dq-bin-count", children: $.count })
          ]
        },
        E
      );
    }),
    !v.length && /* @__PURE__ */ r("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function Kn(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Hl(e) {
  if (!Kn(e) || Object.keys(e).length !== 1 || !Kn(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !Kn(t.tagsCriterion)) return null;
  const { value: n, modifier: a, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && a === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function ts(e, t) {
  let n = e;
  const a = [];
  for (; ; ) {
    if (t && or(n, t)) {
      n = t;
      break;
    }
    const i = Object.keys(n);
    if (i.length !== 1 || i[0] !== "_filterExpression") break;
    const o = n._filterExpression;
    if (!Kn(o) || o.operator !== "AND" || !Array.isArray(o.children))
      break;
    const s = o.children, l = Hl(s.at(-1));
    if (l == null || s.length > 3) break;
    let d = {}, f = null, h = !0;
    for (const [g, m] of s.slice(0, -1).entries())
      !Kn(m) || Object.keys(m).length !== 1 ? h = !1 : g === 0 && Kn(m.filter) && Object.keys(m.filter).length ? d = m.filter : !f && Kn(m.group) ? f = m.group : h = !1;
    if (!h) break;
    a.unshift(l), n = f ? { ...d, _filterExpression: f } : d;
  }
  return { base: n, bins: a };
}
function Yl(e, t, n) {
  const { base: a, bins: i } = ts(e.view.objectFilter, n);
  return (i.includes(t) ? i.filter((s) => s !== t) : [...i, t]).reduce(Xl, { ...e, view: { ...e.view, objectFilter: a } });
}
function Xl(e, t) {
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
function ji(e, t, n) {
  return {
    ...e,
    view: {
      ...e.view,
      filter: { ...n, page: 1 },
      objectFilter: t.view.objectFilter,
      searchMode: t.view.searchMode
    }
  };
}
const ma = 180;
function Ui(e) {
  return je(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Gi(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function ga() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Bi(e) {
  const t = new URLSearchParams(window.location.search);
  aa.forEach((a) => t.delete(a)), e ? t.set("review", e) : t.delete("review");
  const n = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${n ? `?${n}` : ""}`
  );
}
function Zl(e) {
  return bt({ ...e, page: 1 });
}
function ns(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function on(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const ed = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(xa, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ r(Us, { "aria-hidden": "true" }) }
], td = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(xa, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ r(js, { "aria-hidden": "true" }) }
], nd = [], rs = "(min-width: 900px)";
function rd(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(rs);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function ad() {
  return typeof window.matchMedia == "function" && window.matchMedia(rs).matches;
}
function id({
  onNavigate: e
}) {
  const [t, n] = q([]), [a] = q(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = q(""), [s, l] = q(!0), [d, f] = q(""), [h, g] = q(!1), [m, v] = q(!1), [w, E] = q(!1), [$, k] = q(!1), [C, S] = q([]), [D, _] = q(""), [X, Q] = q(!0), [F, ne] = q(""), [le, Z] = q(""), [A, I] = q(!1), [P, te] = q(!1), [de, ue] = q(""), [W, he] = q(ga), [R, j] = q({}), [re, Oe] = q("name"), [Ee, lt] = q("asc"), dt = x(null), Ze = x(!1), [Xt, kt] = q(0), [$e, Ue] = q(!1), [U, Ce] = q(null), Ge = x(null), ft = x(null), pt = x(null), [Me, ve] = q(
    null
  ), ce = t.find((p) => p.id === W) ?? null, O = Ae(
    () => (Me == null ? void 0 : Me.id) === W && ce ? { ...ce, view: {
      ...ce.view,
      filter: Me.view.filter,
      objectFilter: Me.view.objectFilter,
      searchMode: Me.view.searchMode,
      startFrom: Me.view.startFrom
    } } : ce,
    [Me, W, ce]
  ), fe = O ? je(O) : "video", nt = wr(fe), Te = O ? qe(O) : !1, ee = fe === "video" ? O : null, Zt = Te && !!(O != null && O.actions.some(Tn)), sn = !!ee || fe === "audio" || Zt, [wt, en] = q(null), cn = (wt == null ? void 0 : wt.id) === (O == null ? void 0 : O.id) ? wt == null ? void 0 : wt.mode : (O == null ? void 0 : O.view.reviewMode) ?? "single", Be = Te || fe === "audio" || fe === "video" && cn === "single", [rt, yt] = q(0), ht = x(-1), Ot = x(!1);
  z(() => {
    const p = () => {
      if (!Be && Ft.current) {
        Ot.current = !0;
        return;
      }
      ht.current = -1, he(ga()), Be || yt((y) => y + 1);
    };
    return window.addEventListener("popstate", p), () => window.removeEventListener("popstate", p);
  }, [Be]);
  const Tt = nt === "audio" ? m : h, et = fe === "tag" ? "Tag" : nt === "audio" ? "Audio" : "Video", ln = fe === "tag" ? w : Tt, yn = Ae(() => {
    const p = Ee === "asc" ? 1 : -1;
    return [...t].sort((y, T) => {
      if (re === "count") {
        const G = R[y.id], oe = R[T.id], K = typeof G == "number", se = typeof oe == "number";
        if (K !== se) return K ? -1 : 1;
        if (K && se && G !== oe)
          return (G - oe) * p;
      }
      return y.name.localeCompare(T.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * p;
    });
  }, [Ee, re, R, t]), mt = x(
    null
  ), vt = zl(ee), [Ne, $t] = q({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Gt, Nt] = q({
    page: 1,
    perPage: 40
  }), [Je, at] = q({ items: [], totalCount: 0 }), [qt, ze] = q(W);
  qt !== W && (ze(W), at({ items: [], totalCount: 0 }), te(!1));
  const [ie, gt] = q(!1), [Re, Bt] = q(""), [He, On] = q(!1), [Kt, vn] = q(!1), [We, St] = q(() => /* @__PURE__ */ new Set()), Vt = x(We);
  Vt.current = We;
  const N = x(/* @__PURE__ */ new Map()), M = (O == null ? void 0 : O.view.selectAllOnLoad) === !0, [B, H] = q(null), me = x(B);
  me.current = B;
  const [we, Fe] = q(!1), Ke = x(we);
  Ke.current = we;
  const Mt = x(null), [ge, it] = q(!1), [Pe, tn] = q("grid"), [ut, Nn] = q(ma), [ye, qn] = q(!1), Ft = x(!1), [Ir, xt] = q(""), [$n, Pt] = q(""), [zn, nn] = q(""), [xe, cr] = q(null), [Or, tt] = q(""), [Mn, Sn] = q(!1), [Fn, lr] = q({}), xn = x(/* @__PURE__ */ new Map()), Ye = x(null), Wn = x(null), Pn = !!O, Qn = zi(rd, ad, () => !1) && Pn, [dr, Ln] = q({ top: 0, bottom: 0 });
  mn(() => {
    if (!Pn) return;
    const p = () => {
      const T = Wn.current;
      if (!T) return;
      const G = Math.round(T.getBoundingClientRect().top + window.scrollY), oe = T.closest("main"), K = oe ? Math.round(parseFloat(getComputedStyle(oe).paddingBottom) || 0) : 0;
      Ln(
        (se) => se.top === G && se.bottom === K ? se : { top: G, bottom: K }
      );
    };
    p();
    const y = typeof ResizeObserver > "u" ? null : new ResizeObserver(p);
    return y == null || y.observe(document.body), window.addEventListener("resize", p), () => {
      y == null || y.disconnect(), window.removeEventListener("resize", p);
    };
  }, [Pn]);
  const [ia, $r] = q(0), Hn = x(null), ur = pn((p) => {
    var T;
    if ((T = Hn.current) == null || T.disconnect(), Hn.current = null, !p || typeof ResizeObserver > "u") return;
    const y = new ResizeObserver(
      () => $r(Math.round(p.getBoundingClientRect().height))
    );
    y.observe(p), Hn.current = y;
  }, []), Et = x(0), rn = x(0), Dn = x(null), En = x(null), Cn = Io(
    O && !Be ? U ? [...O.actions, ...U.draft.actions] : O.actions : nd
  ), Jt = Ae(
    () => U && O ? ji(U.draft, O, Ne) : null,
    [U, O, Ne]
  ), oa = Ae(
    () => Jt != null && Sr(Jt) !== (U == null ? void 0 : U.baseline),
    [Jt, U == null ? void 0 : U.baseline]
  );
  z(() => {
    if (!$n) return;
    const p = window.setTimeout(() => Pt(""), 4e3);
    return () => window.clearTimeout(p);
  }, [$n]), z(() => {
    const p = ee ? ei(ee.view.objectFilter) : [];
    if (lr({}), !p.length) return;
    const y = new AbortController();
    let T = !0;
    return Promise.all(
      p.map(async (G) => {
        var oe;
        try {
          const K = await ae(`/api/tags/${G}`, {
            signal: y.signal
          });
          return (oe = K.name) != null && oe.trim() ? [String(G), K.name] : null;
        } catch {
          return null;
        }
      })
    ).then((G) => {
      T && lr(
        Object.fromEntries(G.filter((oe) => oe !== null))
      );
    }), () => {
      T = !1, y.abort();
    };
  }, [ee == null ? void 0 : ee.id, ee == null ? void 0 : ee.view.objectFilter]);
  const Mr = Ae(
    () => ee ? ti(
      ee.view.objectFilter,
      Fn
    ) : (O == null ? void 0 : O.view.objectFilter) ?? {},
    [Fn, O, ee]
  ), fr = pn(async () => {
    l(!0), f("");
    try {
      const p = await rc();
      n(p.reviews), o(p.storageKey), g(p.canWriteVideos ?? p.canWrite), v(p.canWriteAudios ?? !1), E(p.canWriteTags ?? !1), k(p.canReadTagGroups ?? !1), Q(p.canConfigure ?? !0), ne(p.storageNotice ?? ""), W && !p.reviews.some((y) => y.id === W) && (he(""), Bi(""));
    } catch (p) {
      f(
        p instanceof Error ? p.message : "Could not load reviews."
      );
    } finally {
      l(!1);
    }
  }, [W]);
  z(() => {
    if (!$) {
      S([]), _("");
      return;
    }
    const p = new AbortController();
    return _(""), hc(p.signal).then(S).catch((y) => {
      p.signal.aborted || _(
        y instanceof Error ? y.message : "Could not load tag groups."
      );
    }), () => p.abort();
  }, [$]), z(() => {
    fr();
  }, []), z(() => {
    if (W || t.length === 0) return;
    const p = new AbortController();
    j({});
    for (const y of t)
      (qe(y) ? ni(y, p.signal).then((G) => (G == null ? void 0 : G.length) === 0 ? { items: [], totalCount: 0 } : yr(ri(y, G), { ...y.view.filter, page: 1, perPage: 1 }, p.signal)) : je(y) === "tag" ? wi(
        y,
        bt({ ...y.view.filter, page: 1, perPage: 1 }),
        p.signal
      ) : yr(
        y,
        bt({ ...y.view.filter, page: 1, perPage: 1 }),
        p.signal
      )).then((G) => {
        p.signal.aborted || j((oe) => ({
          ...oe,
          [y.id]: G.totalCount
        }));
      }).catch(() => {
        p.signal.aborted || j((G) => ({ ...G, [y.id]: null }));
      });
    return () => p.abort();
  }, [W, t]), mn(() => {
    var p;
    W || s || !Ze.current || (Ze.current = !1, (p = dt.current) == null || p.focus());
  }, [W, s]);
  const Yn = x(0), _n = pn(async () => {
    const p = ++Yn.current;
    cr(null), tt("");
    try {
      const y = await (Zt ? wo(nt) : bo(nt));
      p === Yn.current && cr(y);
    } catch (y) {
      if (p !== Yn.current) return;
      cr(null), tt(
        "Tag assessment setup could not be checked. " + (y instanceof Error ? y.message : "Request failed.")
      );
    }
  }, [Zt, nt]);
  z(() => {
    _n();
  }, [_n]);
  const dn = pn(
    async (p, y, T = !1, G = !1) => {
      var At, Ie;
      const oe = ++Et.current;
      (At = Dn.current) == null || At.abort();
      const K = new AbortController();
      Dn.current = K, y = bt(y);
      const se = Number(y.page);
      T && (y = { ...y, page: 1 }), $t(y), vn(T), gt(!0), Bt("");
      try {
        const _e = (fn) => je(p) === "tag" ? wi(
          p,
          fn,
          K.signal
        ) : yr(
          p,
          fn,
          K.signal
        );
        let pe = await _e(y);
        const Qe = Math.max(
          1,
          Math.ceil(pe.totalCount / Number(y.perPage))
        ), Xn = T ? Qe : Math.min(se, Qe);
        return Number(y.page) !== Xn && (y = { ...y, page: Xn }, pe = await _e(y)), oe === Et.current && (((Ie = En.current) == null ? void 0 : Ie.page) !== Xn && (En.current = {
          page: Xn,
          ids: new Set(pe.items.map((fn) => fn.id))
        }), at(pe), G && Y(
          () => new Set(pe.items.map((fn) => fn.id))
        ), $t(y), Nt(y)), pe;
      } catch (_e) {
        throw oe === Et.current && Bt(
          _e instanceof Error ? _e.message : "Could not load the review queue."
        ), _e;
      } finally {
        oe === Et.current && gt(!1);
      }
    },
    []
  );
  z(() => {
    var y;
    if (rn.current += 1, ht.current = -1, Et.current += 1, (y = Dn.current) == null || y.abort(), Ce(null), Ge.current = null, te(!1), ue(""), Z(""), I(!1), St(/* @__PURE__ */ new Set()), N.current.clear(), H(null), Fe(!1), qn(!1), Ft.current = !1, xt(""), Pt(""), nn(""), at({ items: [], totalCount: 0 }), En.current = null, On(!1), !O || Be) {
      gt(!1);
      return;
    }
    let p = !0;
    return gt(!0), (async () => {
      let T = ce ?? O;
      ve(null);
      let G = null;
      const oe = new URLSearchParams(window.location.search);
      if (je(O) === "video" && aa.some((Ie) => oe.has(Ie)))
        try {
          const Ie = T;
          G = Oa(Ie, oe);
          const _e = an(Ie, G.query);
          (G.query.startFrom !== (Ie.view.startFrom ?? "end") || !or(
            JSON.parse(_t(_e)),
            JSON.parse(_t(an(Ie, rr(Ie))))
          )) && (T = _e, ve(T));
        } catch (Ie) {
          On(!0), Bt(Ie instanceof Error ? Ie.message : "Could not read review URL."), gt(!1);
          return;
        }
      let K = null;
      try {
        K = await oc(i, O.id);
      } catch (Ie) {
        p && (I(!0), Z(
          Ie instanceof Error ? Ie.message : "Could not load progress."
        ));
      }
      if (!p) return;
      const se = (K == null ? void 0 : K.signature) === _t(T) ? K : null, At = G ? G.query.filter : se ? bt(se.filter) : Zl(T.view.filter);
      $t(At), tn(
        se ? Gi(se.displayMode, je(O)) : Ui(O)
      ), Nn(
        se ? se.cardSize ?? ma : ma
      );
      try {
        const Ie = await dn(
          T,
          At,
          G ? G.startAtEnd : !se && T.view.startFrom !== "beginning",
          T.view.selectAllOnLoad === !0
        );
        if (!p) return;
        const _e = hi(
          Ie.items.map((pe) => pe.id),
          (se == null ? void 0 : se.focusedId) ?? null,
          (se == null ? void 0 : se.index) ?? 0
        );
        H(_e), J(_e);
      } catch {
      }
      p && (ht.current = rt, te(!0), ue(`${O.id}:${rt}`));
    })(), () => {
      var T;
      p = !1, rn.current++, Et.current++, (T = Dn.current) == null || T.abort();
    };
  }, [O == null ? void 0 : O.id, Be, rt]), z(() => {
    if (!(!Xt || Be || !O)) {
      if (He) {
        kt(0);
        return;
      }
      ye || U || de !== `${O.id}:${rt}` || (kt(0), oi());
    }
  }, [Xt, Be, O == null ? void 0 : O.id, de, ye, rt, He]), z(() => {
    !ee || Be || !P || ie || Re || ye || Ot.current || ht.current !== rt || vr(ee.id, {
      filter: Ne,
      objectFilter: ee.view.objectFilter,
      searchMode: ee.view.searchMode,
      startFrom: ee.view.startFrom ?? "end"
    });
  }, [ee, Be, P, ie, Re, Ne, ye, rt]);
  const Se = Ae(
    () => Je.items.map((p) => p.id),
    [Je.items]
  );
  z(() => {
    if (!P || !O || !i || ie || Re || ye || (Me == null ? void 0 : Me.id) === O.id || A || ht.current !== rt)
      return;
    const p = {
      version: 1,
      signature: _t(O),
      filter: Ne,
      focusedId: B,
      index: Math.max(0, Se.indexOf(B ?? -1)),
      displayMode: Pe,
      cardSize: ut,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + O.id,
        JSON.stringify(p)
      );
    } catch {
    }
    if (le) return;
    let y = !0;
    const T = window.setTimeout(() => {
      sc(i, O.id, p).catch((G) => {
        y && Z(
          "Progress is kept in this browser, but account sync failed. " + (G instanceof Error ? G.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      y = !1, window.clearTimeout(T);
    };
  }, [
    P,
    i,
    O,
    ie,
    Re,
    ye,
    Ne,
    B,
    Se,
    Pe,
    ut,
    Me,
    le,
    A,
    rt
  ]);
  const Fr = Je.items.find((p) => p.id === B) ?? null, u = fe === "video" ? Fr : null;
  we && u && (Mt.current = u);
  const b = u ?? (we ? Mt.current : null), L = mi(We, B), V = Se.length > 0 && Se.every((p) => We.has(p)), J = pn((p, y = !0) => {
    p != null && window.requestAnimationFrame(() => {
      var G;
      if (Ys(document.activeElement) || (G = document.activeElement) != null && G.closest(".dq-drawer"))
        return;
      const T = xn.current.get(p);
      T == null || T.focus({ preventScroll: !0 }), y && (T == null || T.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  z(() => {
    P && !Ke.current && J(me.current);
  }, [P, J]), z(() => {
    ie || !Se.length || (me.current == null || !Se.includes(me.current)) && (H(Se[0]), Ke.current || J(Se[0]));
  }, [J, Se, ie]);
  const Y = pn(
    (p) => {
      St((y) => {
        const T = p(y);
        for (const G of /* @__PURE__ */ new Set([...y, ...T]))
          y.has(G) !== T.has(G) && N.current.set(
            G,
            (N.current.get(G) ?? 0) + 1
          );
        return T;
      });
    },
    []
  ), Le = pn(
    (p) => {
      if (!Se.length) return;
      const y = Math.max(
        0,
        Se.indexOf(me.current ?? Se[0])
      ), T = Se[Math.max(0, Math.min(Se.length - 1, y + p))];
      H(T), Ke.current || J(T);
    },
    [J, Se]
  ), ot = pn(
    async (p) => {
      const y = "steps" in p ? p.steps.length > 0 : p.effect.mode !== "SKIP", T = "effect" in p && p.effect.mode === "SET_TAG_GROUP" ? p.effect.tagGroupId : null, G = T != null && (!$ || !C.some((Ve) => Ve.id === T)), oe = "effect" in p && y && !$, K = mi(
        Vt.current,
        me.current
      );
      if (!O || Ft.current || ie || Re) return;
      const se = y && !ln ? `${et} write permission is required to apply ${p.label}.` : oe || G ? `${p.label} needs a tag group that is unavailable.` : Tn(p) && (xe == null ? void 0 : xe.kind) !== "ready" ? `Set up tag assessments before applying ${p.label}.` : K.length ? "" : `Select or focus a ${fe} before applying ${p.label}.`;
      if (se) {
        nn(se);
        return;
      }
      const At = ++rn.current, Ie = O.id, _e = [...Se], pe = Je, Qe = me.current, Xn = new Set(Vt.current), fn = new Map(
        K.map((Ve) => [Ve, N.current.get(Ve) ?? 0])
      ), Zn = () => At === rn.current && O.id === Ie;
      Ft.current = !0, qn(!0), xt(
        Vt.current.size ? `${K.length} selected ${fe}s` : `the focused ${fe}`
      ), Pt(""), nn("");
      const li = pe.items.filter(
        (Ve) => !K.includes(Ve.id)
      ), us = li.map((Ve) => Ve.id), di = gi(
        _e,
        us,
        Qe,
        K.includes(Qe ?? -1)
      );
      at({
        items: li,
        totalCount: pe.totalCount
      }), St((Ve) => {
        const It = new Set(Ve);
        for (const Wt of K) It.delete(Wt);
        return It;
      }), H(di), Ke.current || J(di);
      let sa = !1;
      try {
        if ("effect" in p ? await Ec(p, K) : await vo(nt, p, K), sa = !0, !Zn()) return;
        St((Ve) => {
          const It = new Set(Ve);
          for (const Wt of K)
            (N.current.get(Wt) ?? 0) === fn.get(Wt) && It.delete(Wt);
          return It;
        }), Pt(
          `${p.label}: ${K.length} ${fe}${K.length === 1 ? "" : "s"} ${y ? "updated" : "skipped"}.`
        );
      } catch (Ve) {
        if (!Zn()) return;
        at(pe), St((It) => {
          const Wt = new Set(It);
          for (const Lt of K)
            Xn.has(Lt) && (N.current.get(Lt) ?? 0) === fn.get(Lt) && Wt.add(Lt);
          return Wt;
        }), H(Qe), Ke.current || J(Qe), nn(
          Ve instanceof Error ? Ve.message : "Action failed."
        );
      }
      try {
        if (await bc(p), !Zn()) return;
        const Ve = new Set(K), It = M && _e.length > 0 && _e.every((Qt) => Ve.has(Qt)), Wt = await dn(O, Ne, !1, It);
        if (!Zn()) return;
        let Lt = Wt.items.map((Qt) => Qt.id);
        const Lr = En.current, fs = (Lr == null ? void 0 : Lr.page) === Number(Ne.page) && Lt.some((Qt) => Lr.ids.has(Qt)), ps = (O.view.startFrom ?? "end") !== "beginning";
        if (Wt.totalCount > 0 && Number(Ne.page) > 1 && (!Lt.length || ps && !fs)) {
          const Qt = Math.max(1, Number(Ne.page) - 1), Dr = { ...Ne, page: Qt };
          $t(Dr), Lt = (await dn(
            O,
            Dr,
            !1,
            It
          )).items.map((ca) => ca.id), St(
            (ca) => new Set([...ca].filter((hs) => Lt.includes(hs)))
          );
          const fi = Lt.at(-1) ?? null;
          H(fi), Ke.current || J(fi);
        } else {
          St(
            (Dr) => new Set([...Dr].filter((ui) => Lt.includes(ui)))
          );
          const Qt = gi(
            _e,
            Lt,
            Qe,
            sa && K.includes(Qe ?? -1)
          );
          H(Qt), Ke.current && Qt == null && Fe(!1), Ke.current || J(Qt);
        }
      } catch (Ve) {
        Zn() && nn(
          (It) => `${It ? `${It} ` : ""}${sa ? "The action completed, but " : ""}the queue could not be refreshed. ${Ve instanceof Error ? Ve.message : "Refresh failed."}`
        );
      } finally {
        Zn() && (Ft.current = !1, qn(!1), xt(""), Ot.current && (Ot.current = !1, he(ga()), yt((Ve) => Ve + 1)));
      }
    },
    [
      ln,
      $,
      C,
      fe,
      xe,
      dn,
      Ne,
      J,
      Se,
      Je,
      ie,
      Re,
      O
    ]
  );
  function An() {
    var T;
    if (Pe === "list") return 1;
    const p = (T = Ye.current) == null ? void 0 : T.firstElementChild, y = p ? getComputedStyle(p).gridTemplateColumns : "";
    return Math.max(1, y.split(" ").filter(Boolean).length);
  }
  const st = x(() => {
  });
  st.current = (p) => {
    var K;
    if (Be || p.defaultPrevented || p.repeat || p.ctrlKey || p.altKey || p.metaKey || $e) return;
    const y = p.target, T = y instanceof Node && ((K = Wn.current) == null ? void 0 : K.contains(y)) === !0, G = y === document.body || y === document.documentElement;
    if (!T && !G) return;
    if (ge) {
      p.key === "Escape" && (on(p), it(!1));
      return;
    }
    if (we && p.key === "Escape") {
      on(p), Fe(!1), J(me.current);
      return;
    }
    if (!Hs(y)) return;
    const oe = Qs(y);
    if (p.key === "Escape") {
      on(p), Y(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!we && p.key === " " && oe) {
      on(p), B != null && Y((se) => Br(se, B));
      return;
    }
    if (!(ye || ie) && !we && p.key === "Enter" && B != null && oe) {
      if (fe !== "tag" && U) return;
      on(p), fe === "tag" ? window.open(`/tag/${B}`, "_blank", "noopener,noreferrer") : Fe(!0);
      return;
    }
  }, z(() => {
    const p = (y) => st.current(y);
    return document.addEventListener("keydown", p), () => document.removeEventListener("keydown", p);
  }, []);
  const Rt = x(
    () => {
    }
  );
  Rt.current = (p) => {
    var K;
    if (Be || $e || we || ge || ye || ie || !Se.length || p.defaultPrevented || p.repeat || p.ctrlKey || p.altKey || p.metaKey)
      return;
    const y = p.target, T = y instanceof Node && ((K = Wn.current) == null ? void 0 : K.contains(y)) === !0, G = y === document.body || y === document.documentElement;
    if (!T && !G || !p.key.startsWith("Arrow") || !Xs(y)) return;
    const oe = Zs(p.key, An());
    oe && (p.preventDefault(), T ? p.stopImmediatePropagation() : p.stopPropagation(), Le(oe));
  }, z(() => {
    const p = (y) => Rt.current(y);
    return document.addEventListener("keydown", p), () => document.removeEventListener("keydown", p);
  }, []);
  const Xe = (U == null ? void 0 : U.saving) === !0, jn = ye || ie && !P || Xe, De = In();
  Ja({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!O && !Be && !$e && !U && !we && !ge && !Re && (Je.items.length > 0 || ie || ye),
    actionCount: (O == null ? void 0 : O.actions.length) ?? 0,
    onAction: (p) => {
      const y = O == null ? void 0 : O.actions[p];
      y && ot(y);
    },
    onFind: () => it(!0),
    onSelectAll: () => Y((p) => Ws(p, Se))
  }), z(() => it(!1), [Be, we, O == null ? void 0 : O.id]);
  function zt(p) {
    const y = "steps" in p ? p.steps.length > 0 : p.effect.mode !== "SKIP", T = "effect" in p && p.effect.mode === "SET_TAG_GROUP" ? p.effect.tagGroupId : null, G = T != null && !C.some((oe) => oe.id === T);
    return ye || ie || !!Re || y && !ln || "effect" in p && y && (!$ || G) || Tn(p) && (xe == null ? void 0 : xe.kind) !== "ready" || !L.length;
  }
  function Un(p) {
    en(null), kt(0), he(p), Bi(p);
  }
  function xr() {
    Ze.current = !0, j({}), Un("");
  }
  async function Gn(p) {
    if (!i) return !1;
    const y = p.map(sd);
    try {
      await ic(i, y);
    } catch (G) {
      throw G;
    }
    n(y), W && !y.some((G) => G.id === W) && Un("");
    const T = y.find((G) => G.id === W);
    return T && en(null), T && ce && JSON.stringify(T) !== JSON.stringify(ce) && (T.view.displayMode !== ce.view.displayMode && tn(Ui(T)), _t(T) !== _t(ce) && (ve(null), je(T) === "video" && vr(T.id, {
      filter: bt(T.view.filter),
      objectFilter: T.view.objectFilter,
      searchMode: T.view.searchMode,
      startFrom: T.view.startFrom ?? "end"
    }), Be || un(
      T,
      bt({ ...T.view.filter, page: Ne.page })
    ))), !0;
  }
  if (s)
    return /* @__PURE__ */ r(Vi, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ c(be, { children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          onClick: () => void pd().catch(
            (p) => f(
              "Could not export browser reviews. " + (p instanceof Error ? p.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ r(
        Ji,
        {
          message: d,
          onRetry: () => void fr()
        }
      )
    ] });
  const pr = /* @__PURE__ */ c(be, { children: [
    F && /* @__PURE__ */ r("p", { className: "dq-status", children: F }),
    sn && (xe == null ? void 0 : xe.kind) === "missing" && /* @__PURE__ */ c("div", { role: "status", className: "dq-status", children: [
      xe.message,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: Mn,
          onClick: () => {
            Sn(!0), tt(""), (Zt ? vc(nt) : yc(nt)).then(_n).catch(
              (p) => tt(
                `Could not create the ${Zt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (p instanceof Error ? p.message : "Request failed.")
              )
            ).finally(() => Sn(!1));
          },
          children: Mn ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    sn && ((xe == null ? void 0 : xe.kind) === "incompatible" || Or) && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(nr, {}),
      Or || (xe == null ? void 0 : xe.message),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: Mn,
          onClick: () => {
            Sn(!0), _n().finally(
              () => Sn(!1)
            );
          },
          children: Mn ? "Checking…" : "Check again"
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
            const p = localStorage.getItem("page-videos") ?? "[]", y = URL.createObjectURL(
              new Blob([p], { type: "application/json" })
            ), T = document.createElement("a");
            T.href = y, T.download = "data-quality-unassigned-legacy-reviews.json", T.click(), URL.revokeObjectURL(y);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    le && /* @__PURE__ */ c("p", { role: "alert", children: [
      le,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => {
            Z(""), I(!1);
          },
          children: A ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ c(
    "div",
    {
      ref: Wn,
      className: `data-quality-page${Pn ? " dq-page-fit" : ""}`,
      style: Pn ? {
        "--dq-fit-top": `${dr.top}px`,
        "--dq-fit-bottom": `${dr.bottom}px`
      } : void 0,
      children: [
        O && Be ? /* @__PURE__ */ r(
          Jl,
          {
            review: O,
            canWrite: Te ? w : Tt,
            canAssess: (xe == null ? void 0 : xe.kind) === "ready" && Tt,
            onBusy: qn,
            editRequest: Xt,
            onEditRequestHandled: () => kt(0),
            onSaveDefaults: X ? (p) => Gn(t.map((y) => y.id === p.id ? p : y)) : void 0,
            pageControls: {
              onBack: xr,
              onManage: () => Ue(!0),
              manageDisabled: !X,
              onGrid: ee ? () => en({ id: ee.id, mode: "multiple" }) : void 0,
              notices: pr
            }
          },
          O.id
        ) : O ? ls(O) : /* @__PURE__ */ c(be, { children: [
          /* @__PURE__ */ c("header", { className: "data-quality-header", children: [
            /* @__PURE__ */ r("div", { className: "dq-header-copy", children: /* @__PURE__ */ r("h1", { children: "Data Quality" }) }),
            /* @__PURE__ */ r(
              "button",
              {
                className: "dq-header-action",
                type: "button",
                "aria-label": "Manage reviews",
                title: "Manage reviews",
                disabled: !X,
                onClick: () => Ue(!0),
                children: /* @__PURE__ */ r(Ls, {})
              }
            )
          ] }),
          pr,
          t.length ? /* @__PURE__ */ c(
            "section",
            {
              className: "dq-review-browser",
              "aria-labelledby": "dq-reviews-title",
              children: [
                /* @__PURE__ */ c("div", { className: "dq-review-browser-heading", children: [
                  /* @__PURE__ */ c("div", { children: [
                    /* @__PURE__ */ r(
                      "h2",
                      {
                        id: "dq-reviews-title",
                        ref: dt,
                        tabIndex: -1,
                        children: "Reviews"
                      }
                    ),
                    /* @__PURE__ */ r("p", { children: "Choose a review to open its queue." }),
                    /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: t.every(
                      (p) => R[p.id] !== void 0
                    ) ? t.some((p) => R[p.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
                  ] }),
                  /* @__PURE__ */ c("div", { className: "dq-review-browser-sort", children: [
                    /* @__PURE__ */ c("label", { children: [
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                      /* @__PURE__ */ c(
                        "select",
                        {
                          "aria-label": "Sort reviews by",
                          value: re,
                          onChange: (p) => Oe(
                            p.target.value
                          ),
                          children: [
                            /* @__PURE__ */ r("option", { value: "name", children: "Name" }),
                            /* @__PURE__ */ r("option", { value: "count", children: "Item count" })
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-label": Ee === "asc" ? "Ascending" : "Descending",
                        title: Ee === "asc" ? "Ascending" : "Descending",
                        onClick: () => lt(
                          (p) => p === "asc" ? "desc" : "asc"
                        ),
                        children: /* @__PURE__ */ r(
                          Pa,
                          {
                            className: Ee === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                          }
                        )
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ r("div", { className: "dq-review-browser-list", children: yn.map((p) => {
                  const y = R[p.id], T = je(p), G = T === "tag" ? "tag" : qe(p) ? Yt(wr(T)).queue : Yt(wr(T)).one;
                  return /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      disabled: ye,
                      onClick: () => Un(p.id),
                      children: [
                        /* @__PURE__ */ c("span", { className: "dq-review-browser-summary", children: [
                          /* @__PURE__ */ c("span", { className: "dq-review-title", children: [
                            /* @__PURE__ */ r(Ya, { entityType: T }),
                            /* @__PURE__ */ r("strong", { children: p.name })
                          ] }),
                          /* @__PURE__ */ r(
                            "span",
                            {
                              className: "dq-review-count",
                              "aria-label": y === void 0 ? `Counting matching ${G}s` : y === null ? `Matching ${G} count unavailable` : `${y.toLocaleString()} matching ${y === 1 ? G : `${G}s`}`,
                              children: y === void 0 ? "…" : y === null ? "—" : y.toLocaleString()
                            }
                          )
                        ] }),
                        p.description && /* @__PURE__ */ r("span", { className: "dq-review-rule-name", children: p.description })
                      ]
                    },
                    p.id
                  );
                }) })
              ]
            }
          ) : /* @__PURE__ */ c("div", { className: "dq-empty", children: [
            /* @__PURE__ */ r(Vr, {}),
            /* @__PURE__ */ r("p", { children: "No saved reviews are available in this browser." })
          ] })
        ] }),
        we && b && ee && /* @__PURE__ */ r(
          ud,
          {
            video: b,
            review: ee,
            selectedCount: We.size,
            pending: ye,
            refreshing: ie || !!Re,
            error: zn,
            canWrite: h,
            assessmentReady: (xe == null ? void 0 : xe.kind) === "ready",
            trees: Cn,
            selected: We.has(b.id),
            hasPrevious: Se.indexOf(b.id) > 0,
            hasNext: Se.indexOf(b.id) >= 0 && Se.indexOf(b.id) < Se.length - 1,
            onToggleSelected: () => Y((p) => Br(p, b.id)),
            onPrevious: () => Le(-1),
            onNext: () => Le(1),
            onClose: () => {
              Fe(!1), J(me.current);
            },
            onAction: ot,
            findOpen: ge,
            onFindOpenChange: it
          }
        ),
        ge && O && !Be && !we && /* @__PURE__ */ r(
          Qa,
          {
            actions: O.actions,
            tagGroups: C,
            trees: Cn,
            isDisabled: zt,
            canStay: !1,
            onApply: (p) => {
              it(!1), ot(p);
            },
            onClose: () => it(!1)
          }
        ),
        $e && /* @__PURE__ */ r(
          fd,
          {
            reviews: t,
            onSave: Gn,
            onEdit: (p) => {
              p !== W && Un(p), kt((y) => y + 1), Ue(!1);
            },
            onClose: () => Ue(!1)
          }
        )
      ]
    }
  );
  async function un(p, y, T = !1) {
    const G = me.current, oe = Math.max(0, Se.indexOf(G ?? -1));
    try {
      const K = dn(
        p,
        y,
        T,
        p.view.selectAllOnLoad === !0
      ), se = Et.current, At = await K;
      if (se !== Et.current) return;
      const Ie = At.items.map((pe) => pe.id);
      St(
        (pe) => new Set([...pe].filter((Qe) => Ie.includes(Qe)))
      );
      const _e = hi(Ie, G, oe);
      H(_e), Ke.current || J(_e, !1);
    } catch {
    }
  }
  function hr(p) {
    const y = mt.current;
    if (mt.current = null, jn || !O || !ce) return;
    const T = y ?? O.view.objectFilter, G = or(
      T,
      ce.view.objectFilter
    ) ? ce.view.objectFilter : T, oe = bt({ ...p, page: 1 }), K = {
      ...O,
      view: {
        ...O.view,
        filter: oe,
        objectFilter: G
      }
    }, se = _t(K) !== _t(ce), At = se ? K : ce;
    ve(se ? K : null), Pt(se ? "" : "Review queue defaults restored."), un(At, oe, !0);
  }
  function Ct() {
    if (ye || ie || !ce) return;
    mt.current = null;
    const p = bt({
      ...ce.view.filter,
      page: 1
    });
    ve(null), Pt("Review queue defaults restored."), un(
      ce,
      p,
      ce.view.startFrom !== "beginning"
    );
  }
  function Pr() {
    ye || ie || !O || !ce || !X || Gn(
      t.map(
        (p) => p.id === W ? {
          ...p,
          view: {
            ...O.view,
            filter: { ...Ne, page: 1 }
          }
        } : p
      )
    ).then(() => {
      ve(null), Pt("Queue saved to this review.");
    }).catch(
      (p) => nn(
        p instanceof Error ? p.message : "Could not save queue."
      )
    );
  }
  function oi() {
    if (!O || !ce || Ft.current || U) return;
    ft.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, Ge.current = {
      temporaryReview: Me,
      filter: Ne,
      loadedFilter: Gt,
      queue: Je,
      queueError: Re,
      retryFromEnd: Kt,
      selectedIds: new Set(We),
      focusedId: B,
      pageCursor: En.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const p = structuredClone({
      ...ce,
      view: { ...ce.view, startFrom: O.view.startFrom ?? "end" }
    });
    it(!1), Fe(!1), Pt(""), nn(""), Ce({
      draft: p,
      baseline: Sr(ji(p, O, Ne)),
      saving: !1,
      error: ""
    });
  }
  function si() {
    Ce(null), Ge.current = null;
    const p = ft.current;
    ft.current = null, requestAnimationFrame(() => {
      (p == null ? void 0 : p.isConnected) && p !== document.body && !(p instanceof HTMLButtonElement && p.disabled) ? p.focus({ preventScroll: !0 }) : J(me.current, !1);
    });
  }
  function as() {
    var y;
    if (!U || U.saving) return;
    const p = Ge.current;
    p && (Et.current += 1, (y = Dn.current) == null || y.abort(), mt.current = null, gt(!1), ve(p.temporaryReview), $t(p.filter), Nt(p.loadedFilter), at(p.queue), Bt(p.queueError), vn(p.retryFromEnd), Y(() => p.selectedIds), H(p.focusedId), En.current = p.pageCursor, window.history.replaceState(window.history.state, "", p.url)), si();
  }
  async function is() {
    if (!U || U.saving || !Jt) return;
    const p = { ...Jt, name: Jt.name.trim() }, y = kr(p);
    if (y) {
      Ce((T) => T && { ...T, error: y });
      return;
    }
    Ce((T) => T && { ...T, saving: !0, error: "" });
    try {
      if (!await Gn(t.map((T) => T.id === p.id ? p : T)))
        throw new Error("Could not save reviews.");
      ve(null), Pt("Review saved."), si();
    } catch (T) {
      Ce(
        (G) => G && {
          ...G,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (T instanceof Error ? T.message : "Retry saving.")
        }
      );
    }
  }
  function ci() {
    O && dn(O, Ne, Kt, M).catch(() => {
    });
  }
  function os() {
    St(/* @__PURE__ */ new Set()), N.current.clear(), H(null);
  }
  function ss(p) {
    !O || ye || Xe || p === Number(Ne.page) || od(
      { ...Ne, page: p },
      O,
      (y, T) => dn(y, T, !1, M),
      os
    );
  }
  function cs(p) {
    if (!ee || !ce || ye || ie || Xe) return;
    const y = Yl(ee, p, ce.view.objectFilter), T = _t(y) !== _t(ce);
    ve(T ? y : null), T ? un(y, { ...Ne, page: 1 }) : un(
      ce,
      { ...Ne, page: 1 },
      ce.view.startFrom !== "beginning"
    );
  }
  function ls(p) {
    var Ie, _e;
    const y = fe === "tag", T = y ? "tag" : "video", G = Math.max(1, Number(Ne.perPage) || 40), oe = Math.max(1, Math.ceil(Je.totalCount / G)), K = Math.min(Math.max(1, Number(Ne.page) || 1), oe), se = [
      ln ? "" : `${et} write permission is required to apply actions.`,
      y && D ? `Tag groups are unavailable. ${D}` : ""
    ].filter(Boolean), At = !!zn && !we;
    return /* @__PURE__ */ c(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": y ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ r(
            _o,
            {
              name: p.name,
              description: p.description,
              entityType: fe,
              onBack: xr,
              backDisabled: ye || !!U,
              onEdit: U ? () => {
                var pe;
                return (pe = pt.current) == null ? void 0 : pe.focus();
              } : oi,
              editDisabled: !U && (ye || ie || He || !X),
              editing: !!U,
              toolbar: /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: jn, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: y ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ r(
                  Nr,
                  {
                    filter: Re ? Gt : Ne,
                    onFilterChange: hr,
                    totalCount: Je.totalCount,
                    sortOptions: y ? Es : Yi,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Pe,
                    zoomLevel: (ut - 225) / 50,
                    onZoomChange: (pe) => Nn(Math.round(225 + pe * 50)),
                    cardSizeEntityType: y ? "tags" : "videos",
                    criteriaDefinitions: y ? Ss : Ma,
                    customFieldEntityType: fe === "video" ? "video" : void 0,
                    objectFilter: Mr,
                    onObjectFilterChange: (pe) => {
                      jn || (mt.current = fe === "video" ? Bo(
                        pe,
                        Fn,
                        p.view.objectFilter
                      ) : pe);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(jo, { page: K, pages: oe, onPage: ss })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ c(be, { children: [
                ee && /* @__PURE__ */ r(
                  Uo,
                  {
                    mode: "multiple",
                    disabled: ye || ie || $e || !!U,
                    onChange: () => en({ id: ee.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ r(
                  cl,
                  {
                    options: y ? td : ed,
                    value: Pe,
                    onChange: (pe) => tn(Gi(pe, fe))
                  }
                ),
                /* @__PURE__ */ r(
                  Go,
                  {
                    disabled: ye || !!U,
                    items: [
                      {
                        label: "Manage reviews",
                        disabled: ie || !X,
                        onSelect: () => Ue(!0)
                      }
                    ]
                  }
                )
              ] }),
              chipsAfter: (_e = (Ie = ee == null ? void 0 : ee.presentation) == null ? void 0 : Ie.binParents) != null && _e.length ? /* @__PURE__ */ r(
                Ql,
                {
                  videos: Je.items,
                  review: ee,
                  savedObjectFilter: (ce ?? ee).view.objectFilter,
                  trees: vt.ids,
                  disabled: ye || ie || Xe,
                  onToggle: cs
                }
              ) : void 0,
              chipsEnd: U ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : (Me == null ? void 0 : Me.id) === W ? /* @__PURE__ */ c(be, { children: [
                /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
                /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-text-button",
                    title: "Save the current queue criteria to this review",
                    disabled: ye || ie || !X,
                    onClick: Pr,
                    children: [
                      /* @__PURE__ */ r(ao, { "aria-hidden": "true" }),
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
                    disabled: ye || ie,
                    onClick: Ct,
                    children: [
                      /* @__PURE__ */ r(io, { "aria-hidden": "true" }),
                      "Reset"
                    ]
                  }
                )
              ] }) : void 0
            }
          ),
          pr,
          ee && vt.error && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: vt.error }),
          /* @__PURE__ */ c("div", { className: "dq-review-area", children: [
            U && Jt && /* @__PURE__ */ r(
              Lo,
              {
                drawerRef: pt,
                draft: Jt,
                onChange: (pe) => Ce((Qe) => Qe && { ...Qe, draft: pe }),
                direction: U.draft.view.startFrom ?? "end",
                onDirectionChange: (pe) => Ce(
                  (Qe) => Qe && {
                    ...Qe,
                    draft: { ...Qe.draft, view: { ...Qe.draft.view, startFrom: pe } }
                  }
                ),
                tagGroups: C,
                trees: Cn,
                saving: U.saving,
                saveDisabled: ie || !!Re,
                error: U.error,
                dirty: oa,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  Re && !ie ? /* @__PURE__ */ c("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ r(nr, { "aria-hidden": "true" }),
                    /* @__PURE__ */ c("span", { children: [
                      "The queue could not load: ",
                      Re,
                      " ",
                      /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", onClick: ci, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void is(),
                onCancel: as
              }
            ),
            /* @__PURE__ */ c(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${ia}px` },
                children: [
                  /* @__PURE__ */ c("div", { className: "dq-grid-content", children: [
                    ie && !Je.items.length && /* @__PURE__ */ r(Vi, { label: "Loading review queue…" }),
                    Re && !ie && /* @__PURE__ */ r(
                      Ji,
                      {
                        message: Re,
                        retryLabel: He ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (He && ce && je(ce) === "video") {
                            const pe = rr(ce);
                            vr(ce.id, { ...pe, filter: { ...pe.filter, page: void 0 } }), yt((Qe) => Qe + 1);
                            return;
                          }
                          ci();
                        }
                      }
                    ),
                    !ye && !ie && !Re && !Je.items.length && /* @__PURE__ */ c("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ r(Vr, {}),
                      /* @__PURE__ */ c("p", { children: [
                        "No ",
                        T,
                        "s match this review."
                      ] })
                    ] }),
                    !!Je.items.length && /* @__PURE__ */ r("div", { ref: Ye, children: /* @__PURE__ */ r(
                      "div",
                      {
                        className: Pe === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${ut}px` },
                        children: Je.items.map(ds)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ r("div", { className: "dq-bar-dock", ref: ur, children: /* @__PURE__ */ r(
                    $o,
                    {
                      actions: U ? U.draft.actions : p.actions,
                      tagGroups: C,
                      trees: Cn,
                      isDisabled: zt,
                      paused: !!U,
                      busy: ye || ie,
                      onApply: (pe) => void ot(pe),
                      onFind: () => it(!0),
                      status: ye ? `Applying action to ${Ir}…` : "",
                      summary: /* @__PURE__ */ c(be, { children: [
                        /* @__PURE__ */ r("p", { className: "dq-bar-target", children: We.size ? `${We.size} selected` : B == null ? "Nothing to apply to" : `Applies to the focused ${T}` }),
                        /* @__PURE__ */ c(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !Se.length || V,
                            onClick: () => Y((pe) => /* @__PURE__ */ new Set([...pe, ...Se])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ r(ct, { binding: De.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ c(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !We.size,
                            onClick: () => Y(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ r(ct, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: se.length ? se.join(" ") : y ? "Arrows move · Space selects · Enter opens" : U ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews",
                      notices: At || $n ? /* @__PURE__ */ c(be, { children: [
                        At && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ r(nr, { "aria-hidden": "true" }),
                          zn
                        ] }),
                        $n && /* @__PURE__ */ r("p", { role: "status", className: "dq-status", children: $n })
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
  function ds(p) {
    var T, G, oe;
    if (fe === "tag") {
      const K = p;
      return /* @__PURE__ */ r(
        cd,
        {
          tag: K,
          displayMode: Pe === "list" ? "list" : "grid",
          focused: K.id === B,
          selected: We.has(K.id),
          setRef: (se) => {
            se ? xn.current.set(K.id, se) : xn.current.delete(K.id);
          },
          onFocus: () => H(K.id),
          onToggle: () => {
            Y((se) => Br(se, K.id)), J(K.id, !1);
          },
          onOpen: () => window.open(`/tag/${K.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        K.id
      );
    }
    const y = p;
    return /* @__PURE__ */ r(
      ld,
      {
        video: Wl(y, ee, vt.ids),
        showTagBins: ((G = (T = ee == null ? void 0 : ee.presentation) == null ? void 0 : T.annotations) == null ? void 0 : G.includes("tags")) && !!((oe = ee.presentation.annotationParents) != null && oe.length),
        displayMode: Pe,
        cardsScroll: Qn,
        focused: y.id === B,
        selected: We.has(y.id),
        setRef: (K) => {
          K ? xn.current.set(y.id, K) : xn.current.delete(y.id);
        },
        onFocus: () => H(y.id),
        onToggle: () => Y((K) => Br(K, y.id)),
        onPreview: () => {
          U || (H(y.id), Fe(!0));
        },
        onNavigate: e
      },
      y.id
    );
  }
}
function od(e, t, n, a) {
  a(), n(t, e).catch(() => {
  });
}
function Br(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function sd(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function cd({
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
      onClick: (f) => {
        o(), f.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${n ? "focused" : ""} ${a ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ r(
        Cs,
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
            onClick: (f) => {
              f.stopPropagation(), s();
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
function ld({
  video: e,
  showTagBins: t,
  displayMode: n,
  cardsScroll: a,
  focused: i,
  selected: o,
  setRef: s,
  onFocus: l,
  onToggle: d,
  onPreview: f,
  onNavigate: h
}) {
  var $, k;
  const g = ns(e), m = x(null), v = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, w = !!(v.date || v.studioName), E = !!(v.performers.length || v.tags.length);
  return mn(() => {
    const C = m.current;
    if (!C) return;
    const S = C.querySelector(
      `a[href="/video/${e.id}"]`
    ), D = C.querySelector(".card-title"), _ = `dq-card-title-${e.id}`;
    D && (D.id = _), S && (S.target = "_blank", S.rel = "noreferrer", S.removeAttribute("aria-label"), S.setAttribute("aria-labelledby", _), S.classList.add("dq-card-link"));
    const X = C.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    X && X.setAttribute(
      "aria-label",
      o ? `Deselect ${g}` : `Select ${g}`
    );
    const Q = C.querySelector(
      'button[title="Quick View"]'
    );
    Q && Q.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ c(
    "article",
    {
      ref: (C) => {
        m.current = C, s(C);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${g}${o ? ", selected" : ""}`,
      onFocus: l,
      onClick: (C) => {
        l(), C.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${w ? "has-card-metadata" : "no-card-metadata"} ${E ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ r(
          As,
          {
            video: v,
            selected: o,
            onSelect: d,
            onNavigate: h,
            onQuickView: f,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ c("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          ($ = e.tags) == null ? void 0 : $.map((C) => /* @__PURE__ */ r("span", { children: C.name }, C.id)),
          !((k = e.tags) != null && k.length) && /* @__PURE__ */ r("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ r(dd, { video: e, cardsScroll: a })
      ]
    }
  );
}
function dd({ video: e, cardsScroll: t }) {
  const n = x(null), a = x(null), [i, o] = q(!1), [s, l] = q(!1), [d, f] = q(!1);
  return z(() => {
    const h = n.current;
    if (!h || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), l(!0);
      return;
    }
    const g = t ? h.closest(".dq-grid-stage") : null, m = new IntersectionObserver(
      ([w]) => o(w.isIntersecting),
      { root: g, rootMargin: "320px 0px", threshold: 0 }
    ), v = new IntersectionObserver(
      ([w]) => l(w.isIntersecting && w.intersectionRatio >= 0.6),
      { root: g, threshold: [0, 0.6, 1] }
    );
    return m.observe(h), v.observe(h), () => {
      m.disconnect(), v.disconnect();
    };
  }, [e.id, e.files.length, t]), z(() => {
    if (!i) {
      f(!1);
      return;
    }
    const h = new AbortController();
    return ae(gc(e.id), {
      signal: h.signal
    }).then((g) => {
      h.signal.aborted || f(g.available === !0);
    }).catch(() => {
      h.signal.aborted || f(!1);
    }), () => h.abort();
  }, [i, e.id]), z(() => {
    const h = a.current;
    h && (s ? Promise.resolve(h.play()).catch(() => {
    }) : h.pause());
  }, [d, s]), /* @__PURE__ */ r("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: d && /* @__PURE__ */ r(
    "video",
    {
      ref: a,
      src: mc(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function ud({
  video: e,
  review: t,
  selectedCount: n,
  pending: a,
  refreshing: i,
  error: o,
  canWrite: s,
  assessmentReady: l,
  trees: d,
  selected: f,
  hasPrevious: h,
  hasNext: g,
  onToggleSelected: m,
  onPrevious: v,
  onNext: w,
  onClose: E,
  onAction: $,
  findOpen: k,
  onFindOpenChange: C
}) {
  const S = x(null), D = x(null), _ = e.files[0], X = ns(e), Q = (A) => a || i || "steps" in A && A.steps.length > 0 && !s || Tn(A) && !l;
  Ja({
    surface: "overlay",
    enabled: !k,
    actionCount: t.actions.length,
    onAction: (A) => {
      const I = t.actions[A];
      I && $(I);
    },
    onFind: () => C(!0)
  }), z(() => {
    var I;
    const A = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (I = S.current) == null || I.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = A;
    };
  }, []);
  function F(A) {
    var te, de, ue;
    if (A.key !== "Tab") return;
    const I = [
      ...((te = S.current) == null ? void 0 : te.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((W) => W.offsetParent !== null);
    if (!I.length) {
      A.preventDefault(), (de = S.current) == null || de.focus();
      return;
    }
    const P = I.indexOf(
      document.activeElement
    );
    A.shiftKey && P <= 0 ? (A.preventDefault(), (ue = I.at(-1)) == null || ue.focus()) : !A.shiftKey && P === I.length - 1 && (A.preventDefault(), I[0].focus());
  }
  function ne(A) {
    if (k || A.defaultPrevented || A.ctrlKey || A.metaKey || A.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const I = A.key === "ArrowLeft" || A.key === "ArrowRight";
    if (A.altKey && !I) return;
    const P = D.current, te = A.currentTarget.querySelector("video");
    if (A.key === "Enter" || A.key === "Escape")
      A.repeat || E();
    else if (A.key === " " && P)
      A.repeat || P.toggle();
    else if (I && P)
      P.seekBy(
        (A.key === "ArrowLeft" ? -1 : 1) * (A.shiftKey ? 5 : A.altKey ? 10 : 60)
      );
    else if ((A.key === "," || A.key === ".") && P) {
      const de = [_ == null ? void 0 : _.duration, te == null ? void 0 : te.duration].find(
        (W) => W != null && Number.isFinite(W) && W > 0
      ) ?? 0, ue = e.parentVideoId != null ? (e.clipEndSec ?? de) - (e.clipStartSec ?? 0) : de;
      Number.isFinite(ue) && ue > 0 && P.seekBy((A.key === "," ? -1 : 1) * ue * 0.1);
    } else if (A.key.toLowerCase() === "n" || A.key.toLowerCase() === "m")
      !A.repeat && !a && !i && (A.key.toLowerCase() === "n" && h && v(), A.key.toLowerCase() === "m" && g && w());
    else if (A.key === "ArrowUp" && te)
      te.volume = Math.min(1, te.volume + 0.1);
    else if (A.key === "ArrowDown" && te)
      te.volume = Math.max(0, te.volume - 0.1);
    else return;
    on(A);
  }
  function le(A) {
    const I = S.current, P = A.target instanceof Element ? A.target.closest("button, a[href]") : null;
    !I || !P || !I.contains(P) || P.closest(".dq-player, .dq-find-action") || A.detail === 0 || I.focus({ preventScroll: !0 });
  }
  z(() => {
    if (k) return;
    let A = 0;
    const I = requestAnimationFrame(() => {
      A = requestAnimationFrame(() => {
        var te;
        const P = document.activeElement;
        (te = S.current) != null && te.isConnected && (!P || P === document.body || P === document.documentElement) && S.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(I), cancelAnimationFrame(A);
    };
  }, [k, a, i, g, h, e.id]);
  const Z = n ? `the ${n} selected video${n === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ c(
    "div",
    {
      ref: S,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${X}`,
      className: "dq-preview",
      onKeyDown: F,
      onKeyDownCapture: ne,
      onMouseDown: (A) => {
        A.target === A.currentTarget && E();
      },
      onClick: le,
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
                disabled: !h || a || i,
                onClick: v,
                children: [
                  /* @__PURE__ */ r(Zr, { "aria-hidden": "true" }),
                  /* @__PURE__ */ r(ct, { binding: "n", hidden: !0 })
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
                onClick: w,
                children: [
                  /* @__PURE__ */ r(ct, { binding: "m", hidden: !0 }),
                  /* @__PURE__ */ r(Pa, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ c("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ r("h2", { children: X }),
              /* @__PURE__ */ c("p", { children: [
                "Actions apply to ",
                Z
              ] })
            ] }),
            /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-select",
                "aria-pressed": f,
                disabled: i,
                onClick: m,
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-preview-check", "aria-hidden": "true", children: f && /* @__PURE__ */ r(La, {}) }),
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
                "aria-label": `Open ${X} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ r(oo, { "aria-hidden": "true" })
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
                onClick: E,
                children: /* @__PURE__ */ r(Ar, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ r("div", { className: "dq-preview-video", children: _ ? /* @__PURE__ */ r(
            Xi,
            {
              autostart: !0,
              streamUrl: Sa("video", e.id),
              posterUrl: yi(e),
              format: _.format,
              audioCodec: _.audioCodec,
              duration: _.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onPlaybackControlRegister: (A) => (D.current = A, () => {
                D.current === A && (D.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ r("img", { src: yi(e), alt: "" }) }) }),
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
            $o,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: d,
              isDisabled: Q,
              busy: a || i,
              onApply: (A) => void $(A),
              onFind: () => C(!0),
              status: a ? `Applying action to ${Z}…` : "",
              summary: /* @__PURE__ */ r("p", { className: "dq-bar-target", children: n ? `${n} selected` : "This video" })
            }
          )
        ] }),
        k && /* @__PURE__ */ r(
          Qa,
          {
            actions: t.actions,
            trees: d,
            isDisabled: Q,
            canStay: !1,
            onApply: (A) => {
              C(!1), $(A);
            },
            onClose: () => C(!1)
          }
        )
      ]
    }
  );
}
function Ki(e, { id: t, name: n, description: a }) {
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
function fd({
  reviews: e,
  onEdit: t,
  onSave: n,
  onClose: a
}) {
  const [i, o] = q(null), [s, l] = q(""), [d, f] = q(!1), [h, g] = q(!1), m = x(null);
  z(() => {
    var D, _;
    const C = document.activeElement, S = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (_ = (D = m.current) == null ? void 0 : D.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || _.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = S, C == null || C.focus({ preventScroll: !0 });
    };
  }, []);
  function v(C) {
    var _, X, Q;
    if (C.defaultPrevented) {
      C.stopPropagation();
      return;
    }
    if (C.key === "Escape") {
      on(C), d || a();
      return;
    }
    if (C.key !== "Tab") {
      C.stopPropagation();
      return;
    }
    const S = [
      ...((_ = m.current) == null ? void 0 : _.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((F) => F.offsetParent !== null);
    if (!S.length) {
      on(C), (X = m.current) == null || X.focus();
      return;
    }
    const D = S.indexOf(
      document.activeElement
    );
    C.shiftKey && D <= 0 ? (on(C), (Q = S.at(-1)) == null || Q.focus()) : !C.shiftKey && D === S.length - 1 ? (on(C), S[0].focus()) : C.stopPropagation();
  }
  function w(C) {
    g(!!C), o(
      C ? structuredClone(C) : Ki("video", { id: crypto.randomUUID(), name: "", description: "" })
    ), l("");
  }
  async function E() {
    if (d || !i) return;
    const C = kr(i);
    if (C) {
      l(C);
      return;
    }
    const S = { ...i, name: i.name.trim() };
    f(!0), l("");
    try {
      if (!await n([...e, S])) throw new Error("Could not save reviews.");
      t(S.id);
    } catch (D) {
      l(
        "Could not save reviews. Your edits are still open. " + (D instanceof Error ? D.message : "Retry saving.")
      );
    } finally {
      f(!1);
    }
  }
  async function $(C) {
    if (!d) {
      f(!0), l("");
      try {
        if (!await n(C)) throw new Error("Could not save reviews.");
      } catch (S) {
        l(
          S instanceof Error ? S.message : "Could not save reviews."
        );
      } finally {
        f(!1);
      }
    }
  }
  async function k(C) {
    var D;
    if (d) return;
    const S = (D = C.target.files) == null ? void 0 : D[0];
    if (C.target.value = "", !!S) {
      if (S.size > 2e6) {
        l("Review files must be smaller than 2 MB.");
        return;
      }
      f(!0), l("");
      try {
        const _ = Tr(await S.text());
        if (!await n(wa(e, _)))
          throw new Error("Could not save reviews.");
      } catch (_) {
        l(
          _ instanceof Error ? _.message : "Could not import reviews."
        );
      } finally {
        f(!1);
      }
    }
  }
  return /* @__PURE__ */ r(
    "div",
    {
      ref: m,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: v,
      children: /* @__PURE__ */ c("div", { className: "dq-manager", children: [
        /* @__PURE__ */ c("header", { children: [
          /* @__PURE__ */ c("div", { children: [
            /* @__PURE__ */ r("h2", { children: i ? "New review" : "Manage reviews" }),
            /* @__PURE__ */ r("p", { children: i ? "Name the review, then configure its queue and actions." : "Edit opens a review with its editor beside the queue." })
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: d,
              onClick: a,
              children: /* @__PURE__ */ r(Ar, {})
            }
          )
        ] }),
        s && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: s }),
        /* @__PURE__ */ r("fieldset", { disabled: d, className: "dq-manager-content", children: i ? /* @__PURE__ */ c("div", { className: "dq-new-review", children: [
          /* @__PURE__ */ r("div", { className: "dq-new-review-fields", children: /* @__PURE__ */ r(
            Po,
            {
              review: i,
              onChange: o,
              entityTypeLocked: h,
              onEntityTypeChange: (C) => {
                !h && C !== je(i) && o(Ki(C, i));
              },
              autoFocus: !0
            }
          ) }),
          /* @__PURE__ */ c("div", { className: "dq-new-review-footer", children: [
            /* @__PURE__ */ r(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => xo(i),
                children: "Export draft"
              }
            ),
            /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: a, children: "Cancel" }),
            /* @__PURE__ */ r(
              "button",
              {
                className: "dq-button primary",
                type: "button",
                onClick: () => void E(),
                children: "Create & configure"
              }
            )
          ] })
        ] }) : /* @__PURE__ */ c(be, { children: [
          /* @__PURE__ */ c("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: () => {
              const C = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), S = document.createElement("a");
              S.href = C, S.download = "data-quality-reviews.json", S.click(), URL.revokeObjectURL(C);
            }, children: "Export reviews" }),
            /* @__PURE__ */ c(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => w(),
                children: [
                  /* @__PURE__ */ r(Fa, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ c("label", { className: "dq-button", children: [
              /* @__PURE__ */ r(_s, {}),
              " Import reviews",
              /* @__PURE__ */ r(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: k
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-review-list", children: e.map((C) => /* @__PURE__ */ c("article", { children: [
            /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ c("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ r(Ya, { entityType: je(C) }),
                /* @__PURE__ */ r("strong", { children: C.name })
              ] }),
              /* @__PURE__ */ r("p", { children: C.description || "No description" })
            ] }),
            /* @__PURE__ */ c("button", { type: "button", onClick: () => t(C.id), children: [
              /* @__PURE__ */ r(Cr, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: () => w({
                  ...structuredClone(C),
                  id: crypto.randomUUID(),
                  name: `${C.name} copy`
                }),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${C.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${C.name}”?`) && $(
                    e.filter((S) => S.id !== C.id)
                  );
                },
                children: /* @__PURE__ */ r(to, {})
              }
            )
          ] }, C.id)) })
        ] }) })
      ] })
    }
  );
}
async function pd() {
  const e = await ae("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
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
function Vi({ label: e }) {
  return /* @__PURE__ */ c("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ r(Ds, { className: "dq-spin" }),
    e
  ] });
}
function Ji({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ c("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ r(nr, {}),
    /* @__PURE__ */ r("p", { children: e }),
    /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const yd = { components: { DataQualityPage: id } };
export {
  id as DataQualityPage,
  yd as default,
  or as objectFiltersEqual
};
