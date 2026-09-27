import { jsxs as d, jsx as n, Fragment as we } from "react/jsx-runtime";
import { useState as C, useRef as L, useEffect as J, useMemo as at, useId as Ko, useLayoutEffect as Bn, useCallback as ar } from "react";
import { EntityReferenceMultiSelector as Rt, useExtensionKeyboardBindings as ra, useRegisterExtensionKeyboardActions as na, DetailListToolbar as jr, AUDIO_CRITERIA as Gn, VIDEO_CRITERIA as dn, PERFORMER_CRITERIA as kn, NarrativeText as oa, AUDIO_SORT_OPTIONS as Bo, VIDEO_SORT_OPTIONS as Vn, FilterDialog as Go, DetailListPagination as Vo, AudioPlayer as ia, VideoPlayer as Jo, useCustomFieldFilterSection as aa, TAG_SORT_OPTIONS as Qo, TAG_CRITERIA as zo, EntityDetailTabs as sa, TagTile as ca, VideoCard as la, SortableList as qn } from "@cove/runtime/components";
import { Search as Wo, Save as Jn, RotateCcw as Ho, ChevronLeft as Yo, Pencil as Xo, Settings as da, AlertTriangle as Tn, ChevronRight as Zo, Film as Rn, Loader2 as ei, Tags as ua, Headphones as fa, ExternalLink as pa, X as ti, Plus as ga, Upload as ha, Trash2 as ri, GripVertical as Qn } from "@cove/runtime/lucide-react";
import { extensionFetch as ma } from "@cove/runtime/api";
const un = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, fn = Object.keys(
  un
);
function qr(e) {
  return e === "excludes" || e === "excludesAll";
}
function ni(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
const ba = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function ce(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function Lr(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function de(e) {
  return Lr(Fe(e));
}
function oi(e) {
  return Fe(e) === "video";
}
function Fe(e) {
  return e.entityType ?? "video";
}
const en = [
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
function nn(e) {
  return ce(e) && !si(e.occurrence) ? "Complete the optional occurrence condition before saving." : !oi(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Fe(e) !== "tag" && e.actions.some(
    (t) => ai(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => br(t, Fe(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const ya = {
  video: 1e3,
  audio: 250
};
function Ze(e, t = "video") {
  const r = (o, i) => Number.isFinite(Number(o)) && Number(o) > 0 ? Math.floor(Number(o)) : i;
  return {
    ...e,
    page: Math.max(1, r(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(ya[t], r(e.perPage, 40))
    )
  };
}
function So(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function _t(e) {
  const { page: t, ...r } = e.view.filter, o = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    ce(e) ? [e.entityType, ...o, e.occurrence] : Fe(e) === "video" ? o : [Fe(e), ...o]
  );
}
function br(e, t) {
  const r = t ?? ("effect" in e ? "tag" : "video");
  return e.label.trim() ? r === "tag" ? !("effect" in e) || "steps" in e || !e.effect || typeof e.effect != "object" ? !1 : ["SET_TAG_GROUP", "CLEAR_TAG_GROUP", "SKIP"].includes(
    e.effect.mode
  ) && (e.effect.mode !== "SET_TAG_GROUP" || Number.isSafeInteger(e.effect.tagGroupId) && e.effect.tagGroupId > 0) : !("steps" in e) || "effect" in e ? !1 : e.steps.every(
    (o) => [
      "ADD",
      "REMOVE",
      "REMOVE_TREE",
      "MARK_PRESENT",
      "MARK_ABSENT",
      "CLEAR_ABSENCE"
    ].includes(o.mode) && o.tagIds.length > 0 && o.tagIds.every((i) => Number.isSafeInteger(i) && i > 0)
  ) && !ai(e) : !1;
}
function wa(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function mr(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function ii(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Ut(e) {
  return "steps" in e ? e.steps.some((t) => mr(t.mode)) : !1;
}
function ai(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.steps)
    if (mr(r.mode))
      for (const o of r.tagIds) {
        const i = t.get(o);
        if (i && i !== r.mode) return !0;
        t.set(o, r.mode);
      }
  return !1;
}
function Br(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || ba.includes(r.entityType)) && (!wa(r.entityType) || si(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && (r.view.reviewMode === void 0 || ["single", "multiple"].includes(r.view.reviewMode)) && (r.view.reviewMode !== "multiple" || (r.entityType ?? "video") === "video") && (r.view.selectAllOnLoad === void 0 || typeof r.view.selectAllOnLoad == "boolean") && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && va(
      r.presentation,
      (r.entityType ?? "video") !== "video"
    ) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (o) => typeof o == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (o) => typeof (o == null ? void 0 : o.id) == "string" && typeof o.label == "string" && (o.shortcut === void 0 || typeof o.shortcut == "string") && (r.entityType === "tag" ? "effect" in o && !("steps" in o) && br(o, "tag") : "steps" in o && !("effect" in o) && Array.isArray(o.steps) && o.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && br(o, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => nn(r)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function va(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const r = e;
  return (r.cardSize === void 0 || r.cardSize === null || Number.isFinite(r.cardSize) && r.cardSize >= 115 && r.cardSize <= 380) && (!t || r.annotations === void 0 && r.annotationParents === void 0 && r.binParents === void 0) && (r.annotations === void 0 || Array.isArray(r.annotations) && r.annotations.every(
    (o) => ["date", "studio", "performers", "tags"].includes(o)
  )) && [r.annotationParents, r.binParents].every(
    (o) => o === void 0 || Array.isArray(o) && o.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function In(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const o of e)
    for (const i of o)
      r.has(i.id) || (r.add(i.id), t.push(i));
  return t;
}
function si(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (o) => Array.isArray(o) && o.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(o).size === o.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && fn.includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.flagPerformerTagIds === void 0 || r(t.flagPerformerTagIds)) && r(t.tagIds) && typeof t.multiple == "boolean";
}
function Co(e, t) {
  return e.size > 0 ? [...e].sort((r, o) => r - o) : t == null ? [] : [t];
}
function Eo(e, t, r, o) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!o && t.includes(r)) return r;
  const i = Math.max(0, e.indexOf(r));
  if (o) {
    for (const s of e.slice(i + 1))
      if (t.includes(s)) return s;
    if (t.includes(r)) {
      for (const s of e.slice(0, i).reverse())
        if (t.includes(s)) return s;
      return r;
    }
  }
  return t[Math.min(i, t.length - 1)];
}
function No(e, t) {
  const r = new Set(e), o = t.length > 0 && t.every((i) => r.has(i));
  for (const i of t)
    o ? r.delete(i) : r.add(i);
  return r;
}
function Sa(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function Ca(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-actions, .dq-pagination-row, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Ea(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Na(e, t) {
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
const ci = "ext:com.midnightrider.data-quality:configuration", Aa = "ext:cove-data-quality:video-reviews", On = "ext:com.midnightrider.data-quality:progress", Gr = /* @__PURE__ */ new Map(), Xr = /* @__PURE__ */ new Map(), hr = (e, t) => e.includes("*") || e.includes(t), on = (e) => Q(`/api/savedfilters?mode=${encodeURIComponent(e)}`), ka = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Mn(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Ar(e) {
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
    deletedIds: Mn(t.deletedIds),
    importedIds: Mn(t.importedIds)
  };
}
function qa(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const o = /* @__PURE__ */ new Set();
  for (const i of t) {
    const s = localStorage.getItem(i);
    if (s !== null) {
      const a = Br(s);
      r ?? (r = a), a.forEach((f) => o.add(f.id));
    }
    Mn(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((a) => o.add(a));
  }
  return {
    reviews: r ?? [],
    known: [...o],
    present: r !== void 0
  };
}
async function li(e) {
  const t = await Q("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function di(e, t) {
  const r = (Xr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Xr.set(e, r), r.finally(() => {
    Xr.get(e) === r && Xr.delete(e);
  }).catch(() => {
  }), r;
}
let xr = null;
function Ta() {
  if (xr) return xr;
  const e = Ra();
  return xr = e, e.finally(() => {
    xr === e && (xr = null);
  }).catch(() => {
  }), e;
}
async function Ra() {
  var S;
  const e = await Q("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, o = hr(e.permissions, "savedfilters.read"), i = o && hr(e.permissions, "savedfilters.write"), s = o ? (await on(ci)).filter((w) => w.name === "Data Quality configuration").sort((w, b) => w.id - b.id) : [];
  if (s.length > 1) {
    const w = (b) => {
      const { revision: M, ...y } = Ar(b.uiOptions);
      return JSON.stringify(y);
    };
    if (s.some((b) => w(b) !== w(s[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (i)
      for (const b of s.slice(1))
        await Q(`/api/savedfilters/${b.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${b.id}` })
        });
    s.splice(1);
  }
  let a = s.length ? Ar(s[0].uiOptions) : ka();
  const f = localStorage.getItem(`${r}:migrated`) === "true", u = localStorage.getItem(r), p = localStorage.getItem(`${r}:local-only`) === "true";
  !s.length && u && (a = Ar(u));
  let g = !s.length;
  if (s.length && p && u) {
    const w = Ar(u);
    if (w.reviews.some((M) => {
      const y = a.reviews.find((R) => R.id === M.id);
      return y && JSON.stringify(y) !== JSON.stringify(M);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const b = [
      .../* @__PURE__ */ new Set([...a.deletedIds, ...w.deletedIds])
    ];
    a = {
      ...a,
      reviews: In(a.reviews, w.reviews).filter(
        (M) => !b.includes(M.id)
      ),
      deletedIds: b,
      importedIds: [
        .../* @__PURE__ */ new Set([...a.importedIds, ...w.importedIds])
      ]
    }, g = !0;
  }
  if (!f) {
    const w = JSON.stringify(a), b = qa(t);
    if (s.length && b.reviews.some((F) => {
      const V = a.reviews.find((Y) => Y.id === F.id);
      return V && JSON.stringify(V) !== JSON.stringify(F);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const M = o ? (await on(Aa)).flatMap(
      (F) => Br(F.uiOptions ?? "[]")
    ) : [], y = b.known.filter(
      (F) => !b.reviews.some((V) => V.id === F)
    ), R = /* @__PURE__ */ new Set([...a.deletedIds, ...y]);
    a = {
      ...a,
      reviews: In(
        b.reviews,
        a.reviews,
        M.filter(
          (F) => !b.known.includes(F.id) && !a.importedIds.includes(F.id)
        )
      ).filter((F) => !R.has(F.id)),
      deletedIds: [...R],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...a.importedIds,
          ...b.known,
          ...M.map((F) => F.id)
        ])
      ]
    }, g || (g = JSON.stringify(a) !== w);
  }
  const v = {
    userId: t,
    recordId: (S = s[0]) == null ? void 0 : S.id,
    config: a,
    readable: o,
    writable: i,
    durable: i
  };
  if (Gr.set(r, v), g && i) {
    const w = a;
    s.length && (v.config = Ar(s[0].uiOptions)), await ui(r, w), a = v.config;
  } else s.length || (localStorage.setItem(r, JSON.stringify(a)), !o && (!f || p) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!o) localStorage.setItem(`${r}:migrated`, "true");
  else if (i)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: a.reviews,
    storageKey: r,
    canWrite: hr(e.permissions, "videos.write"),
    canWriteVideos: hr(e.permissions, "videos.write"),
    canWriteAudios: hr(e.permissions, "audios.write"),
    canWriteTags: hr(e.permissions, "tags.write"),
    canReadTagGroups: hr(e.permissions, "taggroups.read"),
    canConfigure: !o || i,
    storageNotice: o ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function ui(e, t) {
  const r = Gr.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const o = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await li(r), r.recordId != null) {
      const s = await Q(
        `/api/savedfilters/${r.recordId}`
      );
      if (Ar(s.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await Q(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: ci,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(o)
        })
      }
    );
    r.recordId = i.id;
  } else
    localStorage.setItem(e, JSON.stringify(o)), localStorage.setItem(`${e}:local-only`, "true");
  if (r.config = o, r.durable)
    try {
      localStorage.setItem(e, JSON.stringify(o)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function Ia(e, t) {
  return Br(JSON.stringify(t)), di(e, async () => {
    const r = Gr.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const o = r.config.reviews.filter((i) => !t.some((s) => s.id === i.id)).map((i) => i.id);
    await ui(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...o])
      ].filter((i) => !t.some((s) => s.id === i))
    });
  });
}
function Ao(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([r, o]) => /^[1-9]\d*:[1-9]\d*$/.test(r) && ["reviewed", "cannotDetermine"].includes(String(o)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Oa(e, t) {
  const r = Gr.get(e);
  if (!r) return null;
  const o = localStorage.getItem(`${e}:progress:${t}`), i = o ? Ao(o) : null;
  if (!r.readable) return i;
  const s = (await on(On)).find(
    (f) => f.name === t
  ), a = s ? Ao(s.uiOptions) : null;
  return i && (!a || i.updatedAt > a.updatedAt) ? i : a;
}
function Ma(e, t, r) {
  const o = `${e}:progress:${t}`;
  try {
    localStorage.setItem(o, JSON.stringify(r));
  } catch {
  }
  return di(o, async () => {
    const i = Gr.get(e);
    if (!(i != null && i.writable)) return;
    await li(i);
    const s = (await on(On)).find(
      (a) => a.name === t
    );
    await Q(
      s ? `/api/savedfilters/${s.id}` : "/api/savedfilters",
      {
        method: s ? "PUT" : "POST",
        body: JSON.stringify({
          mode: On,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
function cr(e) {
  return e === "audio" ? "audios" : "videos";
}
const $a = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function St(e) {
  return $a[e];
}
const an = "confirmed_absent_tags", zn = "Confirmed absent tags", pn = "confirmed_absent_occurrence_tags", fi = {
  key: an,
  label: zn,
  type: "tag",
  subject: "tag assessments"
}, Wn = {
  key: pn,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, Pa = {
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
function Xt(e) {
  return Array.isArray(e) ? e.map(Xt) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? Pa[r] ?? r : t === "key" && typeof r == "string" && [
        an,
        pn
      ].includes(r.toLowerCase()) ? r.toLowerCase() : Xt(r)
    ])
  ) : e;
}
async function pi(e, t, r) {
  const o = new Headers(t.headers);
  !(t.body instanceof FormData) && !o.has("Content-Type") && o.set("Content-Type", "application/json");
  const i = await ma(e, { ...t, headers: o });
  if (i.status === 404 && r === "null") return null;
  if (!i.ok) {
    let a = i.statusText || `Request failed (${i.status}).`;
    try {
      const f = await i.json();
      a = f.message || f.detail || f.error || a;
    } catch {
    }
    throw new Error(a);
  }
  if (i.status === 204 || i.status === 205) return;
  const s = await i.text();
  return s ? JSON.parse(s) : void 0;
}
async function Q(e, t = {}) {
  return await pi(e, t, "fail");
}
function Fa(e, t = {}) {
  return pi(e, t, "null");
}
const xa = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let La = 0;
function $n(e, t) {
  return Q(
    `/api/${cr(e)}/${t}?dqRead=${xa}-${++La}`,
    { cache: "no-store" }
  );
}
function gi(e, t) {
  const r = { ...e.view.objectFilter }, o = r._filterExpression;
  if (delete r._filterExpression, delete r.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Xt({
      findFilter: Ze(t, de(e)),
      objectFilter: r,
      filterExpression: o
    })
  );
}
async function _r(e, t, r) {
  return Q(
    `/api/${cr(de(e))}/find`,
    { method: "POST", signal: r, body: gi(e, t) }
  );
}
async function _a(e, t, r) {
  return (await Q(
    `/api/${cr(de(e))}/aggregate`,
    {
      method: "POST",
      signal: r,
      body: gi(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function ko(e, t, r) {
  const o = { ...e.view.objectFilter };
  return delete o._filterExpression, Q("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Xt({
        findFilter: Ze(t),
        objectFilter: o
      })
    )
  });
}
function Da(e) {
  return Q("/api/taggroups", { signal: e });
}
function qo(e, t) {
  return `/api/${cr(e)}/${t.id}/image?max=1280&v=${encodeURIComponent(t.updatedAt)}`;
}
function Pn(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function To(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function ja(e) {
  return `/api/stream/video/${e}/preview`;
}
function Ua(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Ka(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Hn(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const o of e) {
    await Q(`/api/tags/${o}`, { signal: t }), r.add(o);
    for (let i = 1; ; i++) {
      const s = await Q("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Xt({
            findFilter: { page: i, perPage: 1e3, sort: "id", direction: "asc" },
            objectFilter: {
              parentsCriterion: {
                value: [o],
                modifier: "INCLUDES",
                depth: -1
              }
            }
          })
        )
      });
      for (const a of s.items) r.add(a.id);
      if (i * 1e3 >= s.totalCount) break;
      if (!s.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...r];
}
async function Yn(e, t) {
  const r = ii(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await Hn(i.tagIds, t)).filter(
          (s) => !r.has(s)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function Ba(e, t) {
  const r = [];
  return t.type !== e.type && r.push(`type "${e.type}"`), t.isMultiValue || r.push("multiple values enabled"), t.filterable || r.push("filtering enabled"), r.length ? `The ${e.key} custom field is incompatible. It must have ${r.join(", ")}.` : "";
}
async function Xn(e, t) {
  const o = (await Q("/api/custom-fields")).find(
    (s) => s.key.toLowerCase() === e.key
  );
  if (!o)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = Ba(e, o);
  return i ? { kind: "incompatible", message: i } : o.entityTypes.includes(t) ? { kind: "ready", definition: o, message: "" } : {
    kind: "missing",
    message: `Add ${St(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: o
  };
}
async function hi(e, t) {
  const r = await Xn(e, t);
  if (r.kind !== "ready") {
    if (r.kind === "incompatible") throw new Error(r.message);
    if (r.definition) {
      await Q(`/api/custom-fields/${r.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...r.definition.entityTypes, t])]
        })
      });
      return;
    }
    await Q("/api/custom-fields", {
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
function mi(e = "video") {
  return Xn(fi, e);
}
function Ga(e = "video") {
  return hi(fi, e);
}
function bi(e = "video") {
  return Xn(Wn, e);
}
function Va(e = "video") {
  return hi(Wn, e);
}
function sn(e) {
  return [...new Set(e)];
}
function yi(e, t) {
  const r = e.customFields ?? {}, o = Object.keys(r).find(
    (s) => s.toLowerCase() === pn
  ), i = o === void 0 ? [] : r[o];
  return sn(
    (Array.isArray(i) ? i : []).filter(
      (s) => typeof s == "string" && /^[1-9]\d*:[1-9]\d*$/.test(s)
    ).map((s) => s.split(":").map(Number)).filter(([s]) => s === t).map(([, s]) => s)
  );
}
async function Ja(e) {
  let t;
  try {
    t = await bi(e);
  } catch (r) {
    throw new Error(
      `Could not verify the ${Wn.label} custom field. ${r instanceof Error ? r.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Qa(e, t, r, o, i, s) {
  await Q(`/api/${cr(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [r],
      customFields: {
        [e]: sn(i).map((a) => `${o}:${a}`)
      },
      customFieldMode: s
    })
  });
}
function za(e, t, r) {
  const o = [...e.tagIds], i = (s) => {
    if (r === null)
      throw new Error(
        `The ${zn} custom field is not available.`
      );
    return { customFields: { [r]: o }, customFieldMode: s };
  };
  switch (e.mode) {
    case "ADD":
      return { ids: t, tagIds: o, tagMode: "ADD" };
    case "REMOVE":
    case "REMOVE_TREE":
      return { ids: t, tagIds: o, tagMode: "REMOVE" };
    case "MARK_PRESENT":
      return { ids: t, tagIds: o, tagMode: "ADD", ...i("REMOVE") };
    case "MARK_ABSENT":
      return { ids: t, tagIds: o, tagMode: "REMOVE", ...i("ADD") };
    case "CLEAR_ABSENCE":
      return { ids: t, ...i("REMOVE") };
  }
}
async function wi(e, t, r) {
  if (!br(t) || r.length === 0 || r.some((u) => !Number.isSafeInteger(u) || u <= 0))
    throw new Error(
      `Choose ${St(e).many} and configure a valid action first.`
    );
  let o = null;
  if (Ut(t)) {
    let u;
    try {
      u = await mi(e);
    } catch (p) {
      throw new Error(
        `Could not verify the ${zn} custom field. ${p instanceof Error ? p.message : "Request failed."}`
      );
    }
    if (u.kind !== "ready") throw new Error(u.message);
    o = u.definition.key;
  }
  const i = sn(r), s = (await Yn(t)).map((u) => ({
    mode: u.mode,
    tagIds: sn(u.tagIds)
  })), f = [
    ...s.filter((u) => !mr(u.mode)),
    ...s.filter((u) => mr(u.mode))
  ].map(
    (u) => za(u, i, o)
  );
  for (let u = 0; u < f.length; u++)
    try {
      await Q(`/api/${cr(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(f[u])
      });
    } catch (p) {
      throw new Error(
        `Step ${u + 1} failed; ${u} earlier step(s) completed. Refresh and check the selected ${St(e).many} before retrying. ${p instanceof Error ? p.message : "Request failed."}`
      );
    }
}
async function Wa(e, t) {
  if (!br(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await Q("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
function Ro({
  review: e,
  onChange: t,
  choices: r = !1
}) {
  const o = e.occurrence, i = St(de(e)).queue, s = (a) => t({ ...e, occurrence: { ...o, ...a } });
  return r ? /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ d("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      i,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ n(
      Rt,
      {
        entityType: "tag",
        values: o.tagIds,
        onChange: (a) => s({ tagIds: a }),
        placeholder: "Search review tag choices...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
      /* @__PURE__ */ n(
        "input",
        {
          type: "checkbox",
          checked: o.multiple,
          onChange: (a) => s({ multiple: a.target.checked })
        }
      ),
      "Allow multiple tags, for example when something changes part-way through the ",
      i
    ] }),
    /* @__PURE__ */ n("p", { children: "Save & next performer applies the selected tags and advances. Save choices stays on the performer. Skip only moves the cursor; eligibility comes from the filters." })
  ] }) : /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Occurrence condition (optional)" }),
    /* @__PURE__ */ n("p", { children: "Leave this unrestricted to review any appearance. Set performer matching in the review workspace and save it with the rule." }),
    /* @__PURE__ */ d("label", { children: [
      "Occurrence condition",
      /* @__PURE__ */ n(
        "select",
        {
          "aria-label": "Occurrence condition",
          value: o.condition,
          onChange: (a) => s({
            condition: a.target.value
          }),
          children: fn.map((a) => /* @__PURE__ */ n("option", { value: a, children: un[a] }, a))
        }
      )
    ] }),
    !["any", "isNull"].includes(o.condition) && /* @__PURE__ */ d(we, { children: [
      /* @__PURE__ */ n(
        Rt,
        {
          entityType: "tag",
          values: o.conditionTagIds,
          onChange: (a) => s({ conditionTagIds: a }),
          placeholder: "Search occurrence condition tags...",
          allowCreate: !1
        }
      ),
      /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
        /* @__PURE__ */ n(
          "input",
          {
            type: "checkbox",
            checked: o.includeSubtags ?? !0,
            onChange: (a) => s({ includeSubtags: a.target.checked })
          }
        ),
        "Include subtags"
      ] }),
      qr(o.condition) && /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
        /* @__PURE__ */ n(
          "input",
          {
            type: "checkbox",
            checked: o.hideConfirmedAbsent ?? !0,
            onChange: (a) => s({ hideConfirmedAbsent: a.target.checked })
          }
        ),
        "Hide occurrences confirmed absent"
      ] })
    ] }),
    /* @__PURE__ */ d("p", { children: [
      "Conditions check tags on the same performer’s occurrence, independently of ",
      i,
      " tags and the performer’s profile."
    ] })
  ] });
}
function Ha({
  review: e,
  onChange: t
}) {
  const r = St(de(e)).many;
  return /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Performer flags" }),
    /* @__PURE__ */ d("p", { children: [
      "Flag performers whose profile has any of these tags in the performer list and batches, for example a tag noting that something changed during their career. Check a flagged performer’s earliest and latest ",
      r,
      " ",
      "before applying one batch to all of them."
    ] }),
    /* @__PURE__ */ n(
      Rt,
      {
        entityType: "tag",
        values: e.occurrence.flagPerformerTagIds ?? [],
        onChange: (o) => {
          const { flagPerformerTagIds: i, ...s } = e.occurrence;
          t({
            ...e,
            occurrence: o.length ? { ...s, flagPerformerTagIds: o } : s
          });
        },
        placeholder: "Search performer flag tags...",
        allowCreate: !1
      }
    )
  ] });
}
const Io = 1e3;
async function Ya(e, t, r) {
  const o = await Q(
    `/api/tags/${t}`,
    { signal: r }
  ), i = /* @__PURE__ */ new Map();
  for (let u = 1; ; u++) {
    const p = await Q(
      "/api/tags/find",
      {
        method: "POST",
        signal: r,
        body: JSON.stringify(
          Xt({
            findFilter: {
              page: u,
              perPage: Io,
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
    for (const g of p.items) i.set(g.id, g);
    if (u * Io >= p.totalCount) break;
    if (!p.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const s = [...i.values()], a = de(e), f = ce(e) ? await Za(
    a,
    s.map((u) => u.id),
    r
  ) : s.map((u) => (a === "audio" ? u.audioCount : u.videoCount) ?? 0);
  return {
    parent: { id: t, name: o.name },
    children: s.map((u, p) => ({ id: u.id, name: u.name, uses: f[p] })).sort(
      (u, p) => p.uses - u.uses || u.name.localeCompare(p.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function Xa(e) {
  return JSON.stringify(
    Xt({
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
async function Za(e, t, r) {
  const o = new Array(t.length).fill(0), i = new AbortController(), s = () => i.abort(r == null ? void 0 : r.reason);
  r != null && r.aborted && s(), r == null || r.addEventListener("abort", s, { once: !0 });
  let a = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; a < t.length && !i.signal.aborted; ) {
            const f = a++;
            o[f] = (await Q(
              `/api/${cr(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: Xa(t[f])
              }
            )).count;
          }
        } catch (f) {
          throw i.abort(), f;
        }
      })
    );
  } finally {
    r == null || r.removeEventListener("abort", s);
  }
  return i.signal.throwIfAborted(), o;
}
function es(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((r) => ({
    ...r,
    children: r.children.filter((o) => t.has(o.id) ? !1 : (t.add(o.id), !0))
  }));
}
function ts(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    for (const o of r.children)
      t.set(o.id, [...t.get(o.id) ?? [], r.parent.id]);
  return t;
}
function rs(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    for (const o of ii(r))
      t.set(o, [...t.get(o) ?? [], r]);
  return t;
}
function ns(e, t) {
  return {
    id: crypto.randomUUID(),
    label: e.name,
    steps: [
      { mode: "ADD", tagIds: [e.id] },
      ...t.length ? [{ mode: "REMOVE_TREE", tagIds: t }] : []
    ]
  };
}
const os = (e) => e instanceof Error ? e.message : "Request failed.";
function is({
  id: e,
  review: t,
  disabled: r,
  onAdd: o,
  onCancel: i
}) {
  const [s, a] = C([]), [f, u] = C({}), [p, g] = C({}), [v, S] = C({}), w = L(/* @__PURE__ */ new Map());
  J(
    () => () => {
      for (const P of w.current.values()) P.abort();
    },
    []
  );
  const b = St(de(t)), M = ce(t), y = M ? "performer" : b.one;
  function R(P) {
    var oe;
    (oe = w.current.get(P)) == null || oe.abort();
    const A = new AbortController();
    w.current.set(P, A), u((K) => ({ ...K, [P]: { status: "loading" } })), Ya(t, P, A.signal).then(
      (K) => {
        A.signal.aborted || u((ue) => ({
          ...ue,
          [P]: { status: "ready", group: K }
        }));
      },
      (K) => {
        A.signal.aborted || u((ue) => ({
          ...ue,
          [P]: { status: "failed", message: os(K) }
        }));
      }
    );
  }
  function F(P) {
    var ve;
    const A = s.filter((ae) => !P.includes(ae));
    for (const ae of A)
      (ve = w.current.get(ae)) == null || ve.abort(), w.current.delete(ae);
    const oe = (ae) => {
      const Se = f[ae];
      return (Se == null ? void 0 : Se.status) === "ready" ? Se.group.children.map((Kt) => Kt.id) : [];
    }, K = new Set(P.flatMap(oe)), ue = A.flatMap(oe).filter((ae) => !K.has(ae));
    g(
      (ae) => Object.fromEntries(
        Object.entries(ae).filter(([Se]) => !ue.includes(Number(Se)))
      )
    ), S(
      (ae) => Object.fromEntries(
        Object.entries(ae).filter(([Se]) => P.includes(Number(Se)))
      )
    ), u(
      (ae) => Object.fromEntries(
        Object.entries(ae).filter(([Se]) => P.includes(Number(Se)))
      )
    ), a(P);
    for (const ae of P) s.includes(ae) || R(ae);
  }
  const V = s.flatMap((P) => {
    const A = f[P];
    return (A == null ? void 0 : A.status) === "ready" ? [A.group] : [];
  }), Y = V.length === s.length, me = s.some(
    (P) => {
      var A;
      return (((A = f[P]) == null ? void 0 : A.status) ?? "loading") === "loading";
    }
  ), E = new Map(
    es(V).map((P) => [P.parent.id, P])
  ), T = ts(V), $ = new Map(V.map((P) => [P.parent.id, P.parent.name])), re = rs(t.actions), I = (P) => p[P] ?? !re.has(P), _ = Y ? [...E.values()].flatMap(
    (P) => P.children.filter((A) => I(A.id))
  ) : [], X = (P, A) => g((oe) => ({
    ...oe,
    ...Object.fromEntries(P.children.map((K) => [K.id, A]))
  }));
  return /* @__PURE__ */ d("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ n("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ d("p", { className: "dq-editor-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      M ? "on performers " : "",
      "first. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ n(
      Rt,
      {
        entityType: "tag",
        values: s,
        onChange: F,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: r
      }
    ),
    s.map((P) => {
      const A = f[P];
      if (!A || A.status === "loading")
        return /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Loading child tags…" }, P);
      if (A.status === "failed")
        return /* @__PURE__ */ d("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ d("span", { children: [
            "Child tags could not be loaded. ",
            A.message
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: r,
              onClick: () => R(P),
              children: "Retry"
            }
          )
        ] }, P);
      const oe = E.get(P);
      if (!oe) return null;
      const K = oe.parent.name;
      return /* @__PURE__ */ d("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ n("legend", { children: K }),
        A.group.children.length === 0 ? /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "This tag has no child tags." }) : /* @__PURE__ */ d(we, { children: [
          /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: v[P] ?? !1,
                disabled: r,
                onChange: (ue) => S((ve) => ({
                  ...ve,
                  [P]: ue.target.checked
                }))
              }
            ),
            "Only one per ",
            y,
            ": each action removes every other tag in the ",
            K,
            " tree"
          ] }),
          oe.children.length === 0 ? /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ d(we, { children: [
            /* @__PURE__ */ d("div", { className: "dq-row", children: [
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  disabled: r,
                  "aria-label": `Select all child tags of ${K}`,
                  onClick: () => X(oe, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  disabled: r,
                  "aria-label": `Select none of the child tags of ${K}`,
                  onClick: () => X(oe, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ n("div", { className: "dq-child-tags", children: oe.children.map((ue) => {
              const ve = re.get(ue.id) ?? [], ae = (T.get(ue.id) ?? []).filter((Se) => Se !== P).map((Se) => `“${$.get(Se)}”`);
              return /* @__PURE__ */ d("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ n(
                  "input",
                  {
                    type: "checkbox",
                    checked: I(ue.id),
                    disabled: r,
                    onChange: (Se) => g((Kt) => ({
                      ...Kt,
                      [ue.id]: Se.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ d("span", { children: [
                  ue.name,
                  " ",
                  /* @__PURE__ */ d("small", { children: [
                    ue.uses.toLocaleString(),
                    " ",
                    ue.uses === 1 ? b.one : b.many
                  ] }),
                  ae.length > 0 && /* @__PURE__ */ d("small", { children: [
                    " · Also under ",
                    ae.join(", ")
                  ] }),
                  ve.length > 0 && /* @__PURE__ */ d("small", { children: [
                    " ",
                    "· Already in “",
                    ve[0].label || "New action",
                    "”",
                    ve.length > 1 ? ` and ${ve.length - 1} more` : ""
                  ] })
                ] })
              ] }, ue.id);
            }) })
          ] })
        ] })
      ] }, P);
    }),
    /* @__PURE__ */ d("div", { className: "dq-row", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: r || !_.length,
          onClick: () => o(
            _.map(
              (P) => ns(
                P,
                (T.get(P.id) ?? []).filter(
                  (A) => v[A]
                )
              )
            )
          ),
          children: _.length ? `Add ${_.length} action${_.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ n("span", { role: "status", className: "dq-sr-only", children: me ? "Loading child tags…" : "" })
    ] })
  ] });
}
const vi = "com.midnightrider.data-quality", Si = "find-action", Ci = "select-all";
function Ei(e) {
  return `action-${String(e + 1).padStart(2, "0")}`;
}
function Ni(e) {
  return (e.split(" ").at(-1) ?? "").split("+").includes("Shift");
}
function as(e) {
  return Ni(e.sequence);
}
function Zn({
  surface: e,
  enabled: t,
  actionCount: r,
  onAction: o,
  onFind: i,
  onSelectAll: s
}) {
  const a = !!i, f = e === "local" && !!s, u = en.map(
    (p, g) => ({
      id: Ei(g),
      surface: e,
      enabled: t && g < r,
      action: (v) => o(g, as(v))
    })
  );
  u.push({
    id: Si,
    surface: e,
    enabled: t && a && r > 0,
    action: () => i == null ? void 0 : i()
  }), f && u.push({
    id: Ci,
    surface: "local",
    enabled: t,
    action: () => s == null ? void 0 : s()
  }), na(vi, u);
}
const Ai = "Ctrl/⌘A";
function Vr() {
  const e = ra(vi);
  return at(() => {
    const t = (i, s) => {
      const a = e[i];
      return a ? a.find((f) => !Ni(f)) ?? a[0] ?? "" : s;
    }, r = (i) => i < en.length ? t(Ei(i), en[i]) : "", o = t(Ci, "Ctrl+a");
    return {
      action: r,
      find: t(Si, "-"),
      selectAll: o === "Ctrl+a" ? Ai : o,
      allUnbound: (i) => {
        const s = Math.min(i, en.length);
        return s > 0 && Array.from({ length: s }, (a, f) => r(f)).every((a) => !a);
      }
    };
  }, [e]);
}
const ss = 600 * 1e3, Fn = /* @__PURE__ */ new Map(), sr = /* @__PURE__ */ new Map();
function ki(e) {
  const t = Fn.get(e);
  if (t) {
    if (Date.now() - t.at > ss) {
      Fn.delete(e);
      return;
    }
    return t.name;
  }
}
function cs(e) {
  const t = sr.get(e);
  if (t) return t;
  const r = new AbortController(), o = {
    controller: r,
    waiters: 0,
    promise: Q(`/api/tags/${e}`, {
      signal: r.signal
    }).then(
      (i) => {
        var a;
        const s = ((a = i == null ? void 0 : i.name) == null ? void 0 : a.trim()) || null;
        return sr.get(e) === o && sr.delete(e), s && Fn.set(e, { name: s, at: Date.now() }), s;
      },
      () => (sr.get(e) === o && sr.delete(e), null)
    )
  };
  return sr.set(e, o), o;
}
function Oo() {
  return new DOMException("The tag name request was aborted.", "AbortError");
}
function vn(e) {
  const t = {};
  for (const r of e) {
    const o = ki(r);
    o !== void 0 && (t[r] = o);
  }
  return t;
}
function ls(e, t) {
  if (t != null && t.aborted) return Promise.reject(Oo());
  const r = {}, o = [];
  for (const i of new Set(e)) {
    const s = ki(i);
    if (s !== void 0) r[i] = s;
    else {
      const a = cs(i);
      a.waiters += 1, o.push({ id: i, entry: a });
    }
  }
  return o.length ? new Promise((i, s) => {
    let a = !1;
    const f = () => {
      for (const { id: p, entry: g } of o)
        g.waiters -= 1, g.waiters === 0 && sr.get(p) === g && (sr.delete(p), g.controller.abort());
    }, u = () => {
      a || (a = !0, f(), s(Oo()));
    };
    t == null || t.addEventListener("abort", u, { once: !0 }), Promise.all(
      o.map(
        ({ id: p, entry: g }) => g.promise.then((v) => [p, v])
      )
    ).then((p) => {
      if (!a) {
        a = !0, t == null || t.removeEventListener("abort", u), f();
        for (const [g, v] of p) r[g] = v;
        i(r);
      }
    });
  }) : Promise.resolve(r);
}
function eo(e) {
  const t = [...new Set(e)].sort((i, s) => i - s).join(","), [r, o] = C(() => ({
    key: t,
    names: vn(Sn(t))
  }));
  return J(() => {
    const i = Sn(t), s = vn(i);
    if (o({ key: t, names: s }), i.every((f) => f in s)) return;
    const a = new AbortController();
    return ls(i, a.signal).then(
      (f) => o({ key: t, names: f }),
      () => {
      }
    ), () => a.abort();
  }, [t]), r.key === t ? r.names : vn(Sn(t));
}
function Sn(e) {
  return e ? e.split(",").map(Number) : [];
}
function ds(e, t) {
  switch (e) {
    case "ADD":
      return { text: `+ ${t}`, tone: "add" };
    case "REMOVE":
      return { text: `− ${t}`, tone: "remove" };
    case "REMOVE_TREE":
      return { text: `− ${t} tree`, tone: "remove" };
    case "MARK_PRESENT":
      return { text: `Mark ${t} present`, tone: "assess" };
    case "MARK_ABSENT":
      return { text: `Mark ${t} absent`, tone: "assess" };
    case "CLEAR_ABSENCE":
      return { text: `Clear ${t} absence`, tone: "neutral" };
  }
}
function us(e, t, r = []) {
  if ("effect" in e) {
    const o = e.effect;
    if (o.mode === "SKIP") return [{ text: "Skip", tone: "neutral" }];
    if (o.mode === "CLEAR_TAG_GROUP")
      return [{ text: "Set Ungrouped", tone: "neutral" }];
    const i = r.find((s) => s.id === o.tagGroupId);
    return [
      {
        text: i ? `Assign ${i.name}` : "Unavailable tag group",
        tone: "neutral"
      }
    ];
  }
  return e.steps.length ? e.steps.flatMap(
    (o) => o.tagIds.map(
      (i) => ds(
        o.mode,
        t[i] === void 0 ? "…" : t[i] ?? "Unavailable tag"
      )
    )
  ) : [{ text: "Skip", tone: "neutral" }];
}
function fs(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((r) => r.tagIds) : []
  );
}
function to({
  actions: e,
  tagGroups: t,
  isDisabled: r,
  canStay: o = !0,
  onApply: i,
  onClose: s
}) {
  const [a, f] = C(""), [u, p] = C(0), g = L(null), v = L(null), S = L(null), w = L(null), b = L(null), M = Ko(), y = eo(at(() => fs(e), [e])), R = Vr(), F = at(() => {
    const T = a.trim().toLocaleLowerCase();
    return e.map(($, re) => ({ action: $, index: re, key: R.action(re) })).filter(($) => !T || $.action.label.toLocaleLowerCase().includes(T));
  }, [e, R, a]), V = F.length ? Math.min(u, F.length - 1) : -1, Y = (T) => `${M}-option-${T}`;
  Bn(() => {
    var T, $, re;
    return w.current = document.activeElement, b.current = (($ = (T = S.current) == null ? void 0 : T.parentElement) == null ? void 0 : $.closest('[role="dialog"]')) ?? null, (re = g.current) == null || re.focus({ preventScroll: !0 }), () => {
      var _;
      const I = w.current;
      I instanceof HTMLElement && I.isConnected && I.focus({ preventScroll: !0 }), document.activeElement !== I && ((_ = b.current) != null && _.isConnected) && b.current.focus({ preventScroll: !0 });
    };
  }, []), J(() => {
    var T, $, re;
    V < 0 || (re = ($ = (T = v.current) == null ? void 0 : T.querySelector(`[id="${Y(F[V].index)}"]`)) == null ? void 0 : $.scrollIntoView) == null || re.call($, { block: "nearest" });
  }, [V, F]);
  function me(T, $) {
    !T || r != null && r(T.action) || i(T.action, o && $);
  }
  function E(T) {
    var $;
    if (T.stopPropagation(), T.key === "Escape")
      T.preventDefault(), s();
    else if (T.key === "Enter")
      T.preventDefault(), T.repeat || me(F[V], T.shiftKey);
    else if (T.key === "ArrowDown" || T.key === "ArrowUp") {
      if (T.preventDefault(), !F.length) return;
      const re = T.key === "ArrowDown" ? 1 : -1;
      p((V + re + F.length) % F.length);
    } else T.key === "Tab" && (T.preventDefault(), ($ = g.current) == null || $.focus());
  }
  return /* @__PURE__ */ d(we, { children: [
    /* @__PURE__ */ n("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: s }),
    /* @__PURE__ */ d(
      "div",
      {
        ref: S,
        role: "dialog",
        "aria-label": "Find an action",
        className: "dq-find-action",
        onKeyDown: E,
        onMouseDown: (T) => {
          T.target !== g.current && T.preventDefault();
        },
        children: [
          /* @__PURE__ */ d("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ n(Wo, { "aria-hidden": "true" }),
            /* @__PURE__ */ n(
              "input",
              {
                ref: g,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${M}-list`,
                "aria-activedescendant": V >= 0 ? Y(F[V].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: a,
                onChange: (T) => {
                  f(T.target.value), p(0);
                }
              }
            ),
            /* @__PURE__ */ n("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          F.length ? /* @__PURE__ */ n(
            "ul",
            {
              ref: v,
              id: `${M}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: F.map((T, $) => /* @__PURE__ */ n("li", { role: "none", children: /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: Y(T.index),
                  tabIndex: -1,
                  "aria-selected": $ === V,
                  disabled: (r == null ? void 0 : r(T.action)) ?? !1,
                  onClick: (re) => me(T, re.shiftKey),
                  children: [
                    T.key ? /* @__PURE__ */ n("kbd", { children: T.key }) : /* @__PURE__ */ n("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ n("span", { className: "dq-find-label", children: T.action.label }),
                    /* @__PURE__ */ n("span", { className: "dq-find-effect", children: us(T.action, y, t).map(
                      (re, I) => /* @__PURE__ */ n("span", { "data-effect-tone": re.tone, children: re.text }, I)
                    ) })
                  ]
                }
              ) }, T.action.id))
            }
          ) : /* @__PURE__ */ d("p", { className: "dq-find-empty", role: "status", children: [
            "No action matches “",
            a.trim(),
            "”."
          ] }),
          /* @__PURE__ */ d("p", { className: "dq-find-hints", "aria-hidden": "true", children: [
            /* @__PURE__ */ d("span", { children: [
              /* @__PURE__ */ n("kbd", { children: "Enter" }),
              " applies"
            ] }),
            o && /* @__PURE__ */ d("span", { children: [
              /* @__PURE__ */ n("kbd", { children: "Shift" }),
              /* @__PURE__ */ n("kbd", { children: "Enter" }),
              " applies and stays"
            ] }),
            /* @__PURE__ */ d("span", { children: [
              /* @__PURE__ */ n("kbd", { children: "↑" }),
              /* @__PURE__ */ n("kbd", { children: "↓" }),
              " choose"
            ] })
          ] })
        ]
      }
    )
  ] });
}
function ro({
  onClick: e,
  disabled: t,
  className: r = "dq-button"
}) {
  const o = Vr().find;
  return /* @__PURE__ */ d(
    "button",
    {
      type: "button",
      className: `${r} dq-find-button`,
      "aria-keyshortcuts": o || void 0,
      disabled: t,
      onClick: e,
      children: [
        /* @__PURE__ */ n(Wo, { "aria-hidden": "true" }),
        "Find action",
        o && /* @__PURE__ */ n("kbd", { "aria-hidden": "true", children: o })
      ]
    }
  );
}
function cn(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function no(e) {
  return String(e.type).toLowerCase() === "tag";
}
function oo(e) {
  return !!String(e ?? "").trim();
}
function io(e) {
  return [
    ...new Set(
      cn(e.customFieldCriteria).filter(no).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !oo(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function ao(e, t) {
  const r = cn(e.customFieldCriteria);
  if (!r.length) return e;
  let o = !1;
  const i = r.map((s) => {
    if (!no(s)) return s;
    const a = { ...s };
    for (const [f, u] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const p = t[String(s[f] ?? "")];
      p && !oo(s[u]) && (a[u] = p, o = !0);
    }
    return a;
  });
  return o ? { ...e, customFieldCriteria: i } : e;
}
function qi(e, t, r) {
  const o = cn(e.customFieldCriteria);
  if (!o.length) return e;
  const i = cn(r.customFieldCriteria), s = (u, p) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (g) => (u[g] ?? void 0) === (p[g] ?? void 0)
  );
  let a = !1;
  const f = o.map((u) => {
    if (!no(u)) return u;
    const p = i.find((v) => s(v, u));
    if (!p) return u;
    const g = { ...u };
    for (const [v, S] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const w = t[String(u[v] ?? "")];
      w && u[S] === w && !oo(p[S]) && (delete g[S], a = !0);
    }
    return g;
  });
  return a ? { ...e, customFieldCriteria: f } : e;
}
async function ps(e, t, r) {
  if (!br(r))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const o = de(e), i = r.steps.some((f) => mr(f.mode)) ? await Ja(o) : "", s = await Yn(r);
  let a = t.applications;
  for (const f of [
    ...s.filter((u) => !mr(u.mode)),
    ...s.filter((u) => mr(u.mode))
  ]) {
    const u = (p) => Qa(
      i,
      o,
      t.media.id,
      t.performer.id,
      f.tagIds,
      p
    );
    (f.mode === "MARK_PRESENT" || f.mode === "CLEAR_ABSENCE") && await u("REMOVE"), f.mode !== "CLEAR_ABSENCE" && (a = await Oi(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: f.tagIds,
          multiple: !0
        }
      },
      t,
      ["ADD", "MARK_PRESENT"].includes(f.mode) ? f.tagIds : []
    )), f.mode === "MARK_ABSENT" && await u("ADD");
  }
  return a;
}
async function so(e, t) {
  const r = e.occurrence;
  if (ni(r)) return null;
  if (r.targetMode === "selected") return r.performerIds;
  const o = /* @__PURE__ */ new Set(), { _filterExpression: i, ...s } = r.performerFilter;
  for (let a = 1; ; a++) {
    const f = await Q("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Xt({
          findFilter: { page: a, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: s,
          filterExpression: i
        })
      )
    });
    if (f.items.forEach((u) => o.add(u.id)), a * 1e3 >= f.totalCount) return [...o];
    if (!f.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Ti(e) {
  return qr(e.condition) && e.hideConfirmedAbsent !== !1;
}
function co(e, t) {
  const { _filterExpression: r, ...o } = e.view.objectFilter, i = e.occurrence, s = {
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
  }, a = Ti(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: de(e),
    actions: [],
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...r ? [{ group: r }] : [],
            { filter: o },
            { filter: { performerFilterCriterion: s } },
            ...a ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: pn,
                      type: "text",
                      modifier: "notEquals",
                      value: a
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
async function lo(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((r) => [r]) : Promise.all(
    e.conditionTagIds.map((r) => Hn([r], t))
  );
}
function Ri(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function gs(e, t, r = e.conditionTagIds.map((o) => [o])) {
  const o = new Set(t), i = (s) => s.some((a) => o.has(a));
  switch (e.condition) {
    case "any":
      return !0;
    case "isNull":
      return o.size === 0;
    case "includes":
      return r.some(i);
    case "includesAll":
      return r.every(i);
    case "excludes":
      return !r.some(i);
    case "excludesAll":
      return !r.every(i);
  }
}
function hs(e, t, r, o, i) {
  if (!Ti(e)) return !1;
  const s = yi(t, r);
  return e.conditionTagIds.every(
    (a, f) => s.includes(a) || i[f].some((u) => o.includes(u))
  );
}
async function Ii(e, t, r, o) {
  if ((t == null ? void 0 : t.length) === 0 || Ri(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = de(e), s = await _r(
    co(e, t),
    { ...e.view.filter, page: r },
    o
  ), a = t === null ? null : new Set(t), f = e.occurrence, u = s.items.length ? await lo(f, o) : [], p = new Array(s.items.length);
  let g = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, s.items.length) }, async () => {
      for (; g < s.items.length; ) {
        const v = g++, S = s.items[v], w = await Q(
          `/api/tagapplications?hostType=${i}&hostId=${S.id}&contextType=performer`,
          { signal: o }
        );
        p[v] = S.performers.filter((b) => a === null || a.has(b.id)).flatMap((b) => {
          const M = w.filter(
            (R) => R.hostType === i && R.hostId === S.id && R.contextType === "performer" && R.contextId === b.id
          ), y = M.map((R) => R.tag.id);
          return gs(e.occurrence, y, u) && !hs(f, S, b.id, y, u) ? [
            {
              key: `${S.id}:${b.id}`,
              media: S,
              performer: b,
              applications: M
            }
          ] : [];
        });
      }
    })
  ), { items: p.flat(), totalCount: s.totalCount };
}
async function Oi(e, t, r) {
  const o = new Set(e.occurrence.tagIds);
  if (r.some((p) => !o.has(p)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = de(e), s = await $n(i, t.media.id);
  if (!s.performers.some(
    (p) => p.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const a = `/api/tagapplications?hostType=${i}&hostId=${s.id}&contextType=performer&contextId=${t.performer.id}`, f = (await Q(a)).filter(
    (p) => p.hostType === i && p.hostId === s.id && p.contextType === "performer" && p.contextId === t.performer.id
  ), u = new Set(r);
  try {
    for (const p of u)
      f.some((g) => g.tag.id === p) || await Q("/api/tagapplications", {
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
    for (const p of f)
      o.has(p.tag.id) && !u.has(p.tag.id) && await Q(`/api/tagapplications/${p.id}`, {
        method: "DELETE"
      });
    return await Q(a);
  } catch (p) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${p instanceof Error ? p.message : "Request failed."}`
    );
  }
}
function Tr(e, t) {
  return {
    added: t.filter((r) => !e.includes(r)),
    removed: e.filter((r) => !t.includes(r))
  };
}
function ms(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function Tt(e, t, r = !0) {
  var f;
  if (t.occurrence) {
    const u = r ? yi(
      await $n(e, t.media.id),
      t.occurrence.performer.id
    ) : [], p = (await Q(ms(e, t))).filter(
      (g) => g.hostType === e && g.hostId === t.media.id && g.contextType === "performer" && g.contextId === t.occurrence.performer.id
    );
    return {
      ids: [...new Set(p.map((g) => g.tag.id))],
      names: [...new Set(p.map((g) => g.tag.name))],
      absent: u,
      applications: p
    };
  }
  const o = await $n(e, t.media.id), i = (o.tags ?? []).filter(
    (u) => u.canRemove !== !1 || u.isDerived !== !0
  ), s = Object.keys(o.customFields ?? {}).find(
    (u) => u.toLowerCase() === an
  ) ?? an, a = ((f = o.customFields) == null ? void 0 : f[s]) ?? [];
  if (!Array.isArray(a) || a.some((u) => !Number.isSafeInteger(u)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${e} before editing.`
    );
  return { ids: i.map((u) => u.id), names: i.map((u) => u.name), absent: a };
}
async function uo(e, t, r) {
  if (t.occurrence && ce(e))
    await Oi(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: [...r.added, ...r.removed],
          multiple: !0
        }
      },
      t.occurrence,
      r.added
    );
  else
    for (const [o, i] of [
      ["ADD", r.added],
      ["REMOVE", r.removed]
    ])
      i.length && await Q(
        `/api/${cr(de(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: o, tagIds: i })
        }
      );
}
async function bs(e, t, r) {
  t.occurrence && ce(e) ? await ps(e, t.occurrence, r) : await wi(de(e), r, [t.media.id]);
}
function xn(e, t, r, o) {
  const i = (s) => s.filter((a) => o.includes(a));
  return {
    item: e,
    before: t,
    after: r,
    tags: Tr(i(t.ids), i(r.ids)),
    absence: Tr(i(t.absent), i(r.absent))
  };
}
function ys(e, t) {
  var r;
  for (const [o, i] of [
    [e.tags, t.ids],
    [e.absence, t.absent]
  ])
    if (o.added.some((s) => !i.includes(s)) || o.removed.some((s) => i.includes(s)))
      throw new Error(
        "Undo conflict: affected tags changed since this operation. Inspect the item; no undo changes were made."
      );
  if (t.applications)
    for (const o of e.tags.added) {
      const i = (r = e.after.applications) == null ? void 0 : r.filter((a) => a.tag.id === o).map((a) => a.id).sort(), s = t.applications.filter((a) => a.tag.id === o).map((a) => a.id).sort();
      if (JSON.stringify(i) !== JSON.stringify(s))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
const Ln = (e) => e instanceof Error ? e.message : "Request failed.", Mo = (e) => [...e].sort((t, r) => t - r), Ur = (e, t) => JSON.stringify(Mo(e)) === JSON.stringify(Mo(t)), _n = (e) => !!(e.tags.added.length || e.tags.removed.length);
function ln(e, t, r, o) {
  const i = new Set(e), s = new Set(e);
  for (const g of t.steps)
    for (const v of g.tagIds)
      g.mode === "ADD" ? s.add(v) : s.delete(v);
  const a = e.some((g) => !s.has(g));
  if (a && !o)
    return { desired: [...e], conflict: a, skipped: !0, kept: [], replaced: [] };
  const f = new Set(
    t.steps.filter((g) => g.mode === "ADD").flatMap((g) => g.tagIds)
  ), u = [], p = [];
  for (const g of r) {
    const v = g.filter((w) => s.has(w) && !i.has(w)), S = g.filter(
      (w) => s.has(w) && i.has(w) && !f.has(w)
    );
    !v.length || !S.length || (o ? (S.forEach((w) => s.delete(w)), p.push(...S)) : (v.forEach((w) => s.delete(w)), u.push({ tagIds: v, existing: S })));
  }
  return { desired: [...s], conflict: a, skipped: !1, kept: u, replaced: p };
}
function ws(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function vs(e, t, r, o) {
  for (const [i, s] of r.entries()) {
    const a = t.filter(
      (p) => p.steps.some(
        (g) => g.mode === "ADD" && g.tagIds.some((v) => s.includes(v))
      )
    );
    if (a.length < 2) continue;
    const f = e.occurrence.conditionTagIds[i];
    let u = `tag ${f}`;
    try {
      u = (await Q(`/api/tags/${f}`, { signal: o })).name;
    } catch {
      o.throwIfAborted();
    }
    throw new Error(
      `${a.map((p) => p.label).join(" and ")} answer the same condition tag, ${u}. Choose one of them.`
    );
  }
}
async function Ss(e, t, r, o = () => {
}) {
  if (!t.length || t.some(
    (S) => !br(S, e.entityType) || !S.steps.length || S.steps.some(
      (w) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(w.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), s = structuredClone(t), a = qr(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await lo(i.occurrence, r) : [];
  await vs(i, s, a, r);
  const f = await Promise.all(
    s.map(async (S) => ({
      ...S,
      steps: await Yn(S, r)
    }))
  ), u = structuredClone(ws(f));
  r.throwIfAborted();
  const p = [
    .../* @__PURE__ */ new Set([
      ...u.steps.flatMap((S) => S.tagIds),
      ...a.flat()
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
  const g = await so(i, r), v = /* @__PURE__ */ new Map();
  for (let S = 1; ; S++) {
    r.throwIfAborted();
    const w = await Ii(i, g, S, r);
    for (const b of w.items) {
      const M = {
        ids: [...new Set(b.applications.map((R) => R.tag.id))],
        names: b.applications.map((R) => R.tag.name),
        absent: [],
        applications: b.applications
      }, y = ln(M.ids, u, a, !0);
      v.set(b.key, {
        item: { key: b.key, media: b.media, occurrence: b },
        before: M,
        expected: M,
        conflict: y.conflict,
        status: Ur(M.ids, y.desired) ? "unchanged" : "pending"
      });
    }
    if (o(v.size), S * 250 >= w.totalCount) break;
    if (S > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return r.throwIfAborted(), {
    review: i,
    actions: s,
    action: u,
    categories: a,
    touched: p,
    entries: [...v.values()]
  };
}
function Cs(e, t, r) {
  const o = (s) => s.ids.filter((a) => r.includes(a));
  if (!Ur(o(e), o(t))) return !1;
  const i = (s) => (s.applications ?? []).filter((a) => r.includes(a.tag.id)).map((a) => a.id);
  return Ur(i(e), i(t));
}
async function Mi(e, t, r, o) {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; !t() && i < e.length; ) {
        const s = e[i++];
        await r(s), o();
      }
    })
  );
}
async function Es(e, t, r, o, i = !1) {
  const s = e.entries.filter(
    (a) => i ? a.status === "failed" : a.status === "pending"
  );
  await Mi(
    s,
    r,
    async (a) => {
      if (a.conflict && !t) {
        a.status = "skipped", a.error = "Conflicting answer skipped.";
        return;
      }
      if (a.unverified) {
        a.error = "The previous write could not be verified. Inspect this occurrence and create a fresh preview before further changes.";
        return;
      }
      let f;
      try {
        if (f = await Tt(de(e.review), a.item, !1), !Cs(a.expected, f, e.touched)) {
          a.status = "skipped", a.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (w) {
        a.status = "failed", a.error = Ln(w);
        return;
      }
      const u = ln(
        a.before.ids,
        e.action,
        e.categories,
        t
      ), p = [
        ...f.ids.filter((w) => !e.touched.includes(w)),
        ...u.desired.filter((w) => e.touched.includes(w))
      ], g = Tr(f.ids, p);
      if (!g.added.length && !g.removed.length) {
        const w = !a.operation && u.kept.length > 0;
        a.status = a.operation ? "changed" : w ? "skipped" : "unchanged", a.error = w ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let v;
      try {
        await uo(e.review, a.item, g);
      } catch (w) {
        v = w;
      }
      let S = !1;
      try {
        const w = await Tt(de(e.review), a.item, !1);
        S = !0, a.expected = w;
        const b = xn(
          a.item,
          a.before,
          w,
          e.touched
        );
        if (a.operation = _n(b) ? b : void 0, v) throw v;
        if (!Ur(
          w.ids.filter((M) => e.touched.includes(M)),
          p.filter((M) => e.touched.includes(M))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        a.status = a.operation ? "changed" : "unchanged", a.error = void 0;
      } catch (w) {
        if (a.status = "failed", a.error = Ln(w), !S)
          try {
            const b = await Tt(de(e.review), a.item, !1);
            a.expected = b;
            const M = xn(
              a.item,
              a.before,
              b,
              e.touched
            );
            a.operation = _n(M) ? M : void 0;
          } catch {
            a.unverified = !0;
          }
      }
    },
    o
  );
}
async function Ns(e, t, r) {
  await Mi(
    e.entries.filter((o) => o.operation),
    t,
    async (o) => {
      const i = o.operation;
      if (o.unverified) {
        o.error = "Undo unavailable: the previous write could not be verified. Inspect this occurrence.";
        return;
      }
      const s = [...i.tags.added, ...i.tags.removed];
      let a = !1;
      try {
        const f = await Tt(de(e.review), o.item, !1);
        ys(i, f), a = !0, await uo(e.review, o.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const u = await Tt(de(e.review), o.item, !1);
        if (!Ur(
          u.ids.filter((p) => s.includes(p)),
          o.before.ids.filter((p) => s.includes(p))
        ))
          throw new Error("Undo did not restore all affected tags.");
        o.operation = void 0, o.expected = u, o.status = "unchanged", o.error = void 0;
      } catch (f) {
        if (o.error = `Undo stopped: ${Ln(f)}`, o.status = "failed", a)
          try {
            const u = await Tt(de(e.review), o.item, !1), p = xn(
              o.item,
              o.before,
              u,
              s
            );
            o.operation = _n(p) ? p : void 0, o.expected = u;
          } catch {
            o.unverified = !0;
          }
      }
    },
    r
  );
}
async function As(e, t, r) {
  const o = de(e), i = e.occurrence, [s, a] = await Promise.all([
    Q(
      `/api/tagapplications?hostType=${o}&contextType=performer&contextId=${t}`,
      { signal: r }
    ),
    lo(i, r)
  ]), f = s.filter(
    (b) => b.hostType === o && b.contextType === "performer" && b.contextId === t
  ), u = await Promise.all(
    a.map(async (b, M) => {
      const y = i.conditionTagIds[M];
      return (await Q(`/api/tags/${y}`, { signal: r })).name;
    })
  ), p = new Set(a.flat()), g = new Set(
    [
      ...e.actions.flatMap((b) => b.steps).filter((b) => b.mode === "ADD" || b.mode === "MARK_PRESENT").flatMap((b) => b.tagIds),
      ...i.tagIds
    ].filter((b) => !p.has(b))
  ), v = (b) => {
    const M = /* @__PURE__ */ new Map();
    for (const y of f) {
      if (!b.has(y.tag.id)) continue;
      const R = M.get(y.tag.id) ?? {
        name: y.tag.name,
        hosts: /* @__PURE__ */ new Set()
      };
      R.hosts.add(y.hostId), M.set(y.tag.id, R);
    }
    return [...M].map(([y, R]) => ({ id: y, name: R.name, count: R.hosts.size })).sort((y, R) => R.count - y.count || y.name.localeCompare(R.name));
  }, S = a.map((b, M) => ({
    id: i.conditionTagIds[M],
    name: u[M],
    tags: v(new Set(b))
  }));
  g.size && S.push({
    id: null,
    name: a.length ? "Other review tags" : "Review tags",
    tags: v(g)
  });
  const w = /* @__PURE__ */ new Set([...p, ...g]);
  return {
    answered: new Set(
      f.filter((b) => w.has(b.tag.id)).map((b) => b.hostId)
    ).size,
    groups: S
  };
}
function $i({
  review: e,
  performerId: t,
  revision: r = 0
}) {
  const [o, i] = C(null), [s, a] = C(""), f = St(de(e)), u = e.occurrence, p = JSON.stringify([
    e.entityType,
    t,
    u.condition,
    u.conditionTagIds,
    u.includeSubtags,
    u.tagIds,
    e.actions.map((g) => g.steps)
  ]);
  return J(() => {
    const g = new AbortController();
    return i(null), a(""), As(e, t, g.signal).then((v) => {
      g.signal.aborted || i(v);
    }).catch((v) => {
      g.signal.aborted || a(v instanceof Error ? v.message : "Request failed.");
    }), () => g.abort();
  }, [p, r]), /* @__PURE__ */ d("section", { className: "dq-performer-answers", "aria-label": "Existing answers", children: [
    /* @__PURE__ */ n("h3", { children: "Existing answers" }),
    s ? /* @__PURE__ */ d("p", { role: "alert", children: [
      "Could not load existing answers. ",
      s
    ] }) : o ? /* @__PURE__ */ d(we, { children: [
      /* @__PURE__ */ n("p", { children: o.answered ? `Answered on ${o.answered.toLocaleString()} of this performer’s ${f.many}.` : `None of this performer’s ${f.many} is answered yet.` }),
      /* @__PURE__ */ n("ul", { children: o.groups.filter((g) => g.id !== null || g.tags.length).map((g) => /* @__PURE__ */ d("li", { children: [
        g.name,
        ":",
        " ",
        g.tags.length ? g.tags.map((v) => `${v.name} ×${v.count.toLocaleString()}`).join(", ") : "None",
        g.id !== null && g.tags.length > 1 && /* @__PURE__ */ n("strong", { className: "dq-answers-mixed", children: " Mixed answers" })
      ] }, g.id ?? "other")) })
    ] }) : /* @__PURE__ */ n("p", { children: "Loading existing answers…" })
  ] });
}
async function $o(e, t, r) {
  const o = new Array(e.length);
  let i = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; i < e.length; ) {
        r.throwIfAborted();
        const s = i++, a = e[s];
        try {
          o[s] = [
            a,
            (await Q(`/api/${t}/${a}`, {
              signal: r
            })).name
          ];
        } catch {
          r.throwIfAborted(), o[s] = [
            a,
            `${t === "tags" ? "Tag" : "Performer"} ${a}`
          ];
        }
      }
    })
  ), o;
}
function ks(e, t) {
  const r = 1100 - (Date.now() - e);
  return r <= 0 ? Promise.resolve() : new Promise((o, i) => {
    const s = window.setTimeout(o, r);
    t.addEventListener(
      "abort",
      () => {
        window.clearTimeout(s), i(t.reason);
      },
      { once: !0 }
    );
  });
}
function qs({
  review: e,
  disabled: t,
  hidden: r = !1,
  performerFlags: o = [],
  onOpen: i,
  onClose: s,
  onWrite: a
}) {
  const [f, u] = C(!1), [p, g] = C(null), [v, S] = C([]), [w, b] = C(!1), [M, y] = C(!1), [R, F] = C(""), [V, Y] = C(""), [me, E] = C({}), [T, $] = C(!1), [re, I] = C(!1), _ = T && p ? p.review : e, X = de(_), P = St(X), A = P.queue, oe = X === "audio" ? "Audio" : "Scene", [K, ue] = C([]), [ve, ae] = C(!1), [, Se] = C(0), [Kt, ut] = C(0), Zt = L(null), $e = L(null), Ve = L(!1), fe = L(null), st = L(!1), Te = L(0), Oe = L(!1), et = L({ onClose: s, onWrite: a });
  et.current = { onClose: s, onWrite: a }, J(() => {
    var q;
    f && ((q = Zt.current) == null || q.showModal());
  }, [f]), J(() => {
    if (!f || _.occurrence.targetMode !== "selected") return;
    const q = new AbortController();
    return ue([]), $o(
      _.occurrence.performerIds,
      "performers",
      q.signal
    ).then((B) => {
      q.signal.aborted || ue(B.map(([, be]) => be));
    }).catch(() => {
    }), () => q.abort();
  }, [
    f,
    _.occurrence.targetMode,
    JSON.stringify(_.occurrence.performerIds)
  ]), J(
    () => () => {
      var q;
      Ve.current = !0, (q = fe.current) == null || q.abort();
    },
    []
  ), J(() => {
    if (!M) return;
    const q = (B) => {
      B.preventDefault(), B.returnValue = "";
    };
    return window.addEventListener("beforeunload", q), () => window.removeEventListener("beforeunload", q);
  }, [M]);
  function It() {
    g(null), $(!1), I(!1), b(!1), S([]), Y(""), F(""), ae(!1);
  }
  function ne() {
    Oe.current || (u(!1), et.current.onClose(st.current), st.current = !1, It(), requestAnimationFrame(() => {
      var q;
      return (q = $e.current) == null ? void 0 : q.focus();
    }));
  }
  const Je = T && p ? p.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((q) => q.steps.length && !Ut(q))
  );
  async function ee() {
    const q = Je.filter((B) => v.includes(B.id));
    if (!(!q.length || Oe.current)) {
      Oe.current = !0, y(!0), F(""), Y("Loading all matching occurrences…"), g(null), $(!1), I(!1), ae(!1), fe.current = new AbortController();
      try {
        await ks(Te.current, fe.current.signal);
        const B = await Ss(
          e,
          q,
          fe.current.signal,
          (Ke) => Y(`Loaded ${Ke.toLocaleString()} matching occurrences…`)
        ), be = /* @__PURE__ */ new Map();
        for (const Ke of B.entries)
          for (const pe of Ke.before.applications ?? [])
            be.set(pe.tag.id, pe.tag.name);
        const Ue = await $o(
          [
            .../* @__PURE__ */ new Set([
              ...B.actions.flatMap(
                (Ke) => Ke.steps.flatMap((pe) => pe.tagIds)
              ),
              ...B.review.occurrence.conditionTagIds,
              ...io(B.review.view.objectFilter)
            ])
          ].filter((Ke) => !be.has(Ke)),
          "tags",
          fe.current.signal
        );
        fe.current.signal.throwIfAborted(), E({ ...Object.fromEntries(be), ...Object.fromEntries(Ue) }), g(B), Y("Preview ready. No tags have been changed.");
      } catch (B) {
        F(
          fe.current.signal.aborted ? "Preview cancelled. No tags were changed." : String(B instanceof Error ? B.message : B)
        ), Y("");
      } finally {
        Oe.current = !1, y(!1), fe.current = null;
      }
    }
  }
  async function N(q) {
    if (!p || Oe.current) return;
    Oe.current = !0, Ve.current = !1, st.current = !0, et.current.onWrite(), y(!0), $(!0), F(""), q === "undo" && I(!0), Y(q === "undo" ? "Undoing batch…" : "Applying batch…");
    const B = () => Se((be) => be + 1);
    try {
      q === "undo" ? await Ns(p, () => Ve.current, B) : await Es(
        p,
        w,
        () => Ve.current,
        B,
        q === "retry"
      ), Y(
        Ve.current ? "Stopped after in-flight operations settled. Completed changes are retained." : q === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (be) {
      F(be instanceof Error ? be.message : String(be));
    } finally {
      Te.current = Date.now(), Oe.current = !1, y(!1), ut((be) => be + 1), B();
    }
  }
  const U = (p == null ? void 0 : p.entries) ?? [], Me = at(
    () => new Map(
      ((p == null ? void 0 : p.entries) ?? []).map((q) => [
        q.item.key,
        ln(q.before.ids, p.action, p.categories, w)
      ])
    ),
    [p, w]
  ), ct = (q) => Me.get(q.item.key), G = (q) => Tr(q.before.ids, ct(q).desired), Ot = (q) => {
    const B = G(q);
    return q.status === "pending" && (B.added.length > 0 || B.removed.length > 0);
  }, lr = (q) => {
    const B = ct(q), be = B.skipped ? Tr(
      q.before.ids,
      ln(q.before.ids, p.action, p.categories, !0).desired
    ) : G(q);
    return [
      B.skipped ? "Skipped unless conflicting answers are replaced. " : "",
      `Add: ${je(be.added)}; Remove: ${je(be.removed)}`,
      ...B.kept.map(
        (Ue) => `; Keeps ${je(Ue.existing)} instead of ${je(Ue.tagIds)}`
      )
    ].join("");
  }, ft = U.filter((q) => q.conflict), pt = U.filter(
    (q) => ct(q).kept.length || ct(q).replaced.length
  ), tt = (q) => U.filter((B) => B.status === q).length, Ce = U.some((q) => q.operation), je = (q) => q.map((B) => me[B] ?? `Tag ${B}`).join(", ") || "None", rt = U.filter((q) => q.item.media.date).sort((q, B) => q.item.media.date.localeCompare(B.item.media.date)), Ct = (q, B) => /* @__PURE__ */ n(
    "a",
    {
      href: `/${X}/${q.item.media.id}`,
      target: "_blank",
      rel: "noreferrer",
      "aria-label": `${B} ${P.one}, ${q.item.media.date}`,
      title: q.item.media.title || oe,
      children: q.item.media.date
    }
  ), Et = _.occurrence.targetMode === "selected" && _.occurrence.performerIds.length === 1, Bt = qr(_.occurrence.condition) && _.occurrence.includeSubtags !== !1 && _.occurrence.conditionTagIds.length > 0;
  return /* @__PURE__ */ d(we, { children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-button",
        hidden: r,
        ref: $e,
        disabled: t || !Je.length,
        onClick: () => {
          It(), i(), u(!0);
        },
        children: "Apply to all matching occurrences"
      }
    ),
    f && /* @__PURE__ */ d(
      "dialog",
      {
        ref: Zt,
        className: "dq-batch-dialog",
        "aria-labelledby": "dq-batch-title",
        "aria-modal": "true",
        onCancel: (q) => {
          q.preventDefault(), ne();
        },
        children: [
          /* @__PURE__ */ n("h2", { id: "dq-batch-title", children: "Batch occurrence approval" }),
          /* @__PURE__ */ n("p", { children: "Apply one or more answers across all matching pages. Only targeted performer occurrences change." }),
          /* @__PURE__ */ n("p", { children: "Keep this page open while running. Results and undo last until you close this dialog or start a new batch." }),
          /* @__PURE__ */ d("fieldset", { disabled: M || T, children: [
            /* @__PURE__ */ n("legend", { children: "Batch scope and answers" }),
            /* @__PURE__ */ n("p", { children: "Uses your current filters. To include every existing appearance, remove filters that exclude already answered occurrences." }),
            /* @__PURE__ */ d("p", { children: [
              "Performer scope:",
              " ",
              ni(_.occurrence) ? "All performers" : _.occurrence.targetMode === "selected" ? K.join(", ") || `${_.occurrence.performerIds.length} selected performer(s)` : "Matching performer criteria",
              ". Occurrence condition:",
              " ",
              un[_.occurrence.condition],
              "."
            ] }),
            o.length > 0 && /* @__PURE__ */ d("p", { className: "dq-batch-flag", children: [
              /* @__PURE__ */ d("strong", { children: [
                "Flagged: ",
                o.join(", "),
                "."
              ] }),
              " Check the earliest and latest ",
              P.many,
              " before applying, or narrow the batch with a date filter."
            ] }),
            qr(_.occurrence.condition) && _.occurrence.hideConfirmedAbsent !== !1 && /* @__PURE__ */ n("p", { children: _.occurrence.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged." }),
            _.occurrence.conditionTagIds.length > 0 && p && /* @__PURE__ */ d("p", { children: [
              "Condition tags:",
              " ",
              je(_.occurrence.conditionTagIds),
              _.occurrence.includeSubtags === !1 ? " (exact tags only)" : " (including subtags)",
              "."
            ] }),
            /* @__PURE__ */ d("p", { children: [
              "Search: ",
              String(_.view.filter.q || "Any"),
              ".",
              " ",
              Object.keys(_.view.objectFilter).length === 0 && `${A[0].toUpperCase()}${A.slice(1)} filters: None.`
            ] }),
            /* @__PURE__ */ n(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": `Batch ${A} filters`,
                children: /* @__PURE__ */ n(
                  jr,
                  {
                    filter: _.view.filter,
                    objectFilter: ao(
                      _.view.objectFilter,
                      me
                    ),
                    criteriaDefinitions: X === "audio" ? Gn : dn,
                    customFieldEntityType: X,
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !0,
                    showSort: !1,
                    showPagingControls: !1,
                    onFilterChange: () => {
                    },
                    onObjectFilterChange: () => {
                    }
                  }
                )
              }
            ),
            _.occurrence.targetMode === "filter" && /* @__PURE__ */ n(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": "Batch performer criteria",
                children: /* @__PURE__ */ n(
                  jr,
                  {
                    filter: {},
                    objectFilter: _.occurrence.performerFilter,
                    criteriaDefinitions: kn,
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
            ),
            Et && /* @__PURE__ */ n(
              $i,
              {
                review: _,
                performerId: _.occurrence.performerIds[0],
                revision: Kt
              }
            ),
            !Je.length && /* @__PURE__ */ n("p", { children: "Configure an occurrence tag action in this review before starting a batch." }),
            /* @__PURE__ */ d("fieldset", { className: "dq-batch-answers", children: [
              /* @__PURE__ */ n("legend", { children: "Answers" }),
              Je.map((q) => /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
                /* @__PURE__ */ n(
                  "input",
                  {
                    type: "checkbox",
                    checked: T || v.includes(q.id),
                    onChange: (B) => {
                      S(
                        B.target.checked ? [...v, q.id] : v.filter((be) => be !== q.id)
                      ), g(null), Y(""), F("");
                    }
                  }
                ),
                q.label
              ] }, q.id))
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: !v.length,
                onClick: () => void ee(),
                children: "Preview all matches"
              }
            ),
            /* @__PURE__ */ d("label", { children: [
              "Conflicting answers",
              " ",
              /* @__PURE__ */ d(
                "select",
                {
                  "aria-label": "Conflicting answers",
                  value: w ? "replace" : "skip",
                  onChange: (q) => b(q.target.value === "replace"),
                  children: [
                    /* @__PURE__ */ n("option", { value: "skip", children: "Skip conflicts" }),
                    /* @__PURE__ */ n("option", { value: "replace", children: "Replace conflicting answers" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ d("p", { children: [
              "Conflicts are existing tags an answer removes. Configure opposite answers as removals.",
              Bt && " Each condition tag with its subtags is a category: an answer is added only where its category is still empty, and a different existing answer is kept unless conflicting answers are replaced."
            ] })
          ] }),
          /* @__PURE__ */ d("div", { "aria-live": "polite", children: [
            V && /* @__PURE__ */ n("p", { role: "status", children: V }),
            R && /* @__PURE__ */ n("p", { role: "alert", children: R }),
            p && /* @__PURE__ */ d(we, { children: [
              /* @__PURE__ */ n("p", { children: /* @__PURE__ */ d("strong", { children: [
                U.length.toLocaleString(),
                " occurrences in",
                " ",
                new Set(
                  U.map((q) => q.item.media.id)
                ).size.toLocaleString(),
                " ",
                A,
                "s"
              ] }) }),
              T ? /* @__PURE__ */ d("p", { children: [
                tt("changed"),
                " changed; ",
                tt("unchanged"),
                " unchanged;",
                " ",
                tt("skipped"),
                " skipped; ",
                tt("failed"),
                " failed;",
                " ",
                tt("pending"),
                " remaining."
              ] }) : /* @__PURE__ */ d("p", { children: [
                U.filter(Ot).length.toLocaleString(),
                " to change; ",
                tt("unchanged").toLocaleString(),
                " already correct; ",
                ft.length.toLocaleString(),
                " conflicts (",
                w ? "will replace" : "will skip",
                ").",
                pt.length > 0 && ` ${pt.length.toLocaleString()} already have a different answer in a category (${w ? "will replace" : "kept"}).`
              ] }),
              U.length > 0 && /* @__PURE__ */ d("p", { children: [
                "Dates:",
                " ",
                rt.length ? /* @__PURE__ */ d(we, { children: [
                  Ct(rt[0], "Earliest"),
                  rt.length > 1 && /* @__PURE__ */ d(we, { children: [
                    " to ",
                    Ct(rt[rt.length - 1], "Latest")
                  ] })
                ] }) : "none",
                rt.length < U.length && `; ${(U.length - rt.length).toLocaleString()} without a date`,
                "."
              ] })
            ] })
          ] }),
          p && /* @__PURE__ */ d(we, { children: [
            !T && /* @__PURE__ */ d("p", { children: [
              "Planned additions:",
              " ",
              je([
                ...new Set(U.flatMap((q) => G(q).added))
              ]),
              ". Planned removals:",
              " ",
              je([
                ...new Set(U.flatMap((q) => G(q).removed))
              ]),
              "."
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => ae(!ve),
                children: ve ? "Hide occurrence details" : "Inspect occurrences and conflicts"
              }
            ),
            ve && /* @__PURE__ */ n("div", { className: "dq-batch-items", children: /* @__PURE__ */ d("table", { children: [
              /* @__PURE__ */ n("thead", { children: /* @__PURE__ */ d("tr", { children: [
                /* @__PURE__ */ n("th", { children: "Occurrence" }),
                /* @__PURE__ */ n("th", { children: "Changes / result" })
              ] }) }),
              /* @__PURE__ */ n("tbody", { children: U.map((q) => {
                var B;
                return /* @__PURE__ */ d("tr", { children: [
                  /* @__PURE__ */ n("td", { children: /* @__PURE__ */ d(
                    "a",
                    {
                      href: `/${X}/${q.item.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      children: [
                        (B = q.item.occurrence) == null ? void 0 : B.performer.name,
                        " —",
                        " ",
                        q.item.media.title || oe
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ d("td", { children: [
                    q.conflict && /* @__PURE__ */ n("strong", { children: "Conflict. " }),
                    T ? `${q.status}. ${q.error ?? ""}` : lr(q)
                  ] })
                ] }, q.item.key);
              }) })
            ] }) }),
            /* @__PURE__ */ d("div", { className: "dq-row", children: [
              !re && /* @__PURE__ */ d(we, { children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button primary",
                    disabled: M || !tt("pending"),
                    onClick: () => void N("apply"),
                    children: T ? "Continue remaining" : "Apply batch"
                  }
                ),
                T && tt("failed") > 0 && /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: M,
                    onClick: () => void N("retry"),
                    children: "Retry failed occurrences"
                  }
                )
              ] }),
              Ce && /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  disabled: M,
                  onClick: () => void N("undo"),
                  children: "Undo batch"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ d("div", { className: "dq-row", children: [
            M && /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => {
                  var q;
                  Ve.current = !0, (q = fe.current) == null || q.abort(), Y("Stopping after in-flight operations settle…");
                },
                children: [
                  "Cancel ",
                  fe.current ? "preview" : "run"
                ]
              }
            ),
            T && /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: M,
                onClick: It,
                children: "New batch"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: M,
                onClick: ne,
                children: "Close"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
const Pi = "data-quality.description-collapsed.v1";
function Ts() {
  try {
    return localStorage.getItem(Pi) === "true";
  } catch {
    return !1;
  }
}
function Rs({
  details: e,
  label: t
}) {
  const [r, o] = C(Ts), i = ar(() => {
    o((s) => {
      const a = !s;
      try {
        localStorage.setItem(Pi, String(a));
      } catch {
      }
      return a;
    });
  }, []);
  return /* @__PURE__ */ d("section", { className: "dq-media-description", "aria-label": `${t} description`, children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-button dq-description-toggle",
        "aria-expanded": !r,
        onClick: i,
        children: "Description"
      }
    ),
    !r && (e != null && e.trim() ? /* @__PURE__ */ n(oa, { className: "dq-description-body", children: e }) : /* @__PURE__ */ n("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
function tn({
  performer: e
}) {
  return /* @__PURE__ */ d("span", { className: "dq-performer-avatar", "aria-hidden": "true", children: [
    /* @__PURE__ */ n("span", { children: e.name.trim().split(/\s+/).slice(0, 2).map((t) => t[0]).join("").toUpperCase() || "?" }),
    /* @__PURE__ */ n(
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
function Is({
  ranking: e,
  busy: t,
  error: r,
  focus: o,
  disabled: i,
  labels: s,
  onFocus: a,
  onMore: f,
  onRefresh: u
}) {
  var v;
  const p = e ? e.ranked.slice(0, e.limit) : [], g = !!e && (e.ranked.length > e.limit || (((v = e.candidates[e.cursor]) == null ? void 0 : v.total) ?? 0) > 0);
  return /* @__PURE__ */ d("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ d("div", { className: "dq-performer-ranking-status", children: [
      r ? /* @__PURE__ */ d("p", { role: "alert", children: [
        "Could not rank performers. ",
        r
      ] }) : t ? /* @__PURE__ */ d("p", { role: "status", children: [
        "Counting matching ",
        s.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ n("p", { children: p.length ? `Most matching ${s.many} first.` : `No performer has matching ${s.many}.` }) : null,
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button",
          disabled: t || i,
          onClick: u,
          children: "Refresh"
        }
      )
    ] }),
    /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: p.map((S) => {
      const w = `${S.count.toLocaleString()} matching ${S.count === 1 ? s.one : s.many}`, b = S.flags.length ? `Flagged: ${S.flags.join(", ")}` : "";
      return /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          className: "dq-button dq-ranked-performer",
          "aria-label": `${S.name}, ${w}${b ? `. ${b}` : ""}`,
          title: b || void 0,
          "aria-pressed": o === S.id,
          disabled: i,
          onClick: () => a(S.id),
          children: [
            /* @__PURE__ */ n(tn, { performer: S }),
            /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: S.name }),
            b && /* @__PURE__ */ n("span", { className: "dq-performer-flag", "aria-hidden": "true", children: "Flag" }),
            /* @__PURE__ */ n("span", { className: "dq-ranked-count", "aria-hidden": "true", children: S.count.toLocaleString() })
          ]
        },
        S.id
      );
    }) }),
    g && !t && !r && /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-button",
        disabled: i,
        onClick: f,
        children: "Show more performers"
      }
    )
  ] });
}
function rn(e) {
  const {
    page: t,
    perPage: r,
    sort: o,
    direction: i,
    sorts: s,
    seed: a,
    ...f
  } = e.view.filter;
  return JSON.stringify([
    e.entityType,
    f,
    e.view.objectFilter,
    e.view.searchMode,
    e.occurrence
  ]);
}
function Os(e) {
  const t = e.occurrence;
  return JSON.stringify([
    de(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {},
    t.flagPerformerTagIds ?? []
  ]);
}
async function Ms(e, t) {
  const r = de(e) === "audio", o = new Set(e.occurrence.flagPerformerTagIds ?? []), i = (f) => ({
    id: f.id,
    name: f.name,
    total: (r ? f.audioCount : f.videoCount) ?? 0,
    flags: (f.tags ?? []).filter((u) => o.has(u.id)).map((u) => u.name)
  }), s = e.occurrence, a = [];
  if (s.targetMode === "selected" && s.performerIds.length > 0)
    for (const f of s.performerIds) {
      const u = await Fa(
        `/api/performers/${f}`,
        { signal: t }
      );
      u && a.push(i(u));
    }
  else {
    const { _filterExpression: f, ...u } = s.targetMode === "filter" ? s.performerFilter : {};
    for (let p = 1; ; p++) {
      const g = await Q(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            Xt({
              findFilter: {
                page: p,
                perPage: 1e3,
                sort: r ? "audio_count" : "video_count",
                direction: "desc"
              },
              objectFilter: u,
              filterExpression: f
            })
          )
        }
      );
      if (a.push(...g.items.map(i)), p * 1e3 >= g.totalCount || !g.items.length) break;
    }
  }
  return a.sort((f, u) => u.total - f.total || f.id - u.id);
}
function Fi(e, t, r) {
  const o = co(e, [t]);
  return _a(o, o.view.filter, r);
}
function xi(e, t) {
  const r = e.findIndex(
    (o) => o.count < t.count || o.count === t.count && o.name.localeCompare(t.name) > 0
  );
  e.splice(r < 0 ? e.length : r, 0, t);
}
function Dn(e, t, r, o) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : r.length >= o && i < r[o - 1].count;
}
async function $s(e, t, r, o, i = {}) {
  const s = rn(e), a = Os(e), f = Ri(e.occurrence), u = (t == null ? void 0 : t.signature) === s && !t.partial ? t : {
    signature: s,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: f ? "" : a,
    candidates: f ? [] : (t == null ? void 0 : t.candidatesKey) === a ? t.candidates : await Ms(e, o),
    cursor: 0,
    ranked: [],
    limit: r,
    complete: !1
  }, { candidates: p } = u, g = [...u.ranked];
  let v = u.cursor, S = !1;
  const w = (b) => ({
    ...u,
    cursor: v,
    ranked: [...g],
    limit: r,
    complete: !b && Dn(p, v, g, r),
    ...b ? { partial: b } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var b;
        for (; !S && !Dn(p, v, g, r); ) {
          o.throwIfAborted();
          const M = p[v++], y = await Fi(e, M.id, o);
          y > 0 && xi(g, { ...M, count: y }), (b = i.onProgress) == null || b.call(i, w(!0));
        }
      })
    );
  } catch (b) {
    throw S = !0, b;
  }
  return o.throwIfAborted(), w(!1);
}
function Ps(e, t, r) {
  const o = e.candidates.findIndex((s) => s.id === t);
  if (e.partial || o < 0 || o >= e.cursor) return e;
  const i = e.ranked.filter((s) => s.id !== t);
  return r > 0 && xi(i, { ...e.candidates[o], count: r }), {
    ...e,
    ranked: i,
    complete: Dn(e.candidates, e.cursor, i, e.limit)
  };
}
function Kr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((a, f) => Kr(a, t[f]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, o = t, i = Object.keys(r).sort(), s = Object.keys(o).sort();
  return i.length === s.length && i.every(
    (a, f) => a === s[f] && Kr(r[a], o[a])
  );
}
const gn = [
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
], Fs = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function kr(e) {
  const t = ce(e) ? e.occurrence : void 0;
  return {
    filter: Ze({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, de(e)),
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
function Po(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function jn(e, t) {
  let r;
  if (ce(e) && t.has("performer") && (r = Number(t.get("performer")), !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!gn.some((f) => f !== "performer" && t.has(f))) {
    const f = kr(e);
    return {
      query: r ? { ...f, performerFocus: r } : f,
      startAtEnd: f.startFrom === "end"
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
    const f = t.get("sorts").split(",").map((u) => {
      const p = u.lastIndexOf(":");
      return { key: u.slice(0, p), direction: u.slice(p + 1) };
    });
    if (f.some((u) => !u.key || !["asc", "desc"].includes(u.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = f, i.sort = f[0].key, i.direction = f[0].direction;
  }
  let s;
  if (ce(e) && (s = {
    ...Fs,
    ...Po(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(s.targetMode) || !fn.includes(s.condition) || !Array.isArray(s.performerIds) || !Array.isArray(s.conditionTagIds) || typeof s.includeSubtags != "boolean" || typeof s.hideConfirmedAbsent != "boolean" || [...s.performerIds, ...s.conditionTagIds].some(
    (f) => !Number.isSafeInteger(f) || f <= 0
  ) || !s.performerFilter || typeof s.performerFilter != "object" || Array.isArray(s.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const a = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Ze(i, de(e)),
      objectFilter: Po(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: a,
      performerScope: s,
      ...r ? { performerFocus: r } : {}
    },
    startAtEnd: !t.has("page") && a === "end"
  };
}
function Dr(e, t) {
  const r = new URLSearchParams(window.location.search);
  gn.forEach((o) => r.delete(o)), r.set("review", e);
  for (const o of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[o] !== void 0 && r.set(o, String(t.filter[o]));
  Array.isArray(t.filter.sorts) && r.set(
    "sorts",
    t.filter.sorts.map((o) => `${o.key}:${o.direction}`).join(",")
  ), r.set("filters", JSON.stringify(t.objectFilter)), r.set("searchMode", t.searchMode), r.set("startFrom", t.startFrom), t.performerScope && r.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && r.set("performer", String(t.performerFocus)), window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${r}${window.location.hash}`
  );
}
function Dt(e, t) {
  const r = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return ce(e) ? {
    ...e,
    view: r,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: r };
}
function Fo(e, t) {
  return !t || !ce(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function Cn(e, t) {
  if (!t) return e;
  const r = /* @__PURE__ */ new Map();
  for (const o of e)
    r.set(o.media.id, [...r.get(o.media.id) ?? [], o]);
  return [...r.values()].reverse().flat();
}
const vt = (e) => e instanceof Error ? e.message : "Request failed.", En = 50;
function xs({
  actions: e,
  disabled: t,
  canWrite: r,
  canAssess: o = !0,
  onApply: i,
  onFind: s
}) {
  const a = eo(
    at(
      () => e.flatMap((g) => g.steps.flatMap((v) => v.tagIds)),
      [e]
    )
  ), f = (g) => a[g] === void 0 ? "Loading tag…" : a[g] ?? "Unavailable tag", u = Vr(), p = {
    ADD: "Add",
    REMOVE: "Remove",
    REMOVE_TREE: "Remove tree",
    MARK_PRESENT: "Mark present",
    MARK_ABSENT: "Mark absent",
    CLEAR_ABSENCE: "Clear absence"
  };
  return /* @__PURE__ */ d("div", { className: "dq-review-actions", children: [
    /* @__PURE__ */ n("p", { children: "Actions apply and advance. Shift-click or Shift + key applies and stays." }),
    s && /* @__PURE__ */ n(ro, { disabled: !e.length, onClick: s }),
    e.map((g, v) => /* @__PURE__ */ d("div", { className: "dq-action-pair", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: t || !r && g.steps.length > 0 || !o && Ut(g),
          onClick: (S) => i(g, S.shiftKey),
          children: /* @__PURE__ */ d("span", { children: [
            u.action(v) && /* @__PURE__ */ n("kbd", { children: u.action(v) }),
            " ",
            g.label
          ] })
        }
      ),
      g.steps.length > 0 && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button dq-apply-stay-button",
          disabled: t || !r || !o && Ut(g),
          "aria-label": `Apply & stay: ${g.label}`,
          title: `Apply & stay: ${g.label}`,
          onClick: () => i(g, !0),
          children: /* @__PURE__ */ n(Jn, { "aria-hidden": "true" })
        }
      ),
      g.steps.length > 0 && /* @__PURE__ */ n("small", { className: "dq-review-action-summary", children: g.steps.map(
        (S) => `${p[S.mode]}: ${S.tagIds.map(f).join(", ")}`
      ).join("; ") })
    ] }, g.id))
  ] });
}
function Ls({
  review: e,
  canWrite: t,
  canAssess: r = !0,
  onBusy: o,
  onSaveDefaults: i,
  editRequest: s = 0,
  renderRuleEditor: a
}) {
  var pr;
  const f = de(e), u = St(f), p = f === "audio" ? "Audio" : "Scene", g = (l) => {
    var m;
    return l.title || ((m = l.files[0]) == null ? void 0 : m.basename) || p;
  }, v = (l) => `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${g(l.media)}`, S = L(null), w = L("");
  if (!S.current)
    try {
      S.current = jn(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (l) {
      w.current = vt(l), S.current = { query: kr(e), startAtEnd: !1 };
    }
  const [b, M] = C(null), y = L(null), R = L(null), F = L(null), [V, Y] = C(!!w.current), me = L(0), [E, T] = C(S.current.query), $ = L(E);
  $.current = E;
  const [re, I] = C(0), _ = L(S.current.startAtEnd), [X, P] = C([]), [A, oe] = C(null), K = L(null), [ue, ve] = C(null), [ae, Se] = C(0), Kt = at(() => {
    if (!A) return null;
    const l = X.findIndex((m) => m.key === A.key);
    return l < 0 ? null : X.slice(l + 1).find((m) => m.media.id !== A.media.id) ?? null;
  }, [A, X]), [ut, Zt] = C(0), [$e, Ve] = C(!1), [fe, st] = C(!1), Te = L(!1), Oe = L(!0), et = L(null);
  J(() => (Oe.current = !0, () => {
    Oe.current = !1;
  }), []);
  const [It, ne] = C(w.current), [Je, ee] = C(""), [N, U] = C(null), [Me, ct] = C(!1), [G, Ot] = C([]), lr = L([]), ft = L(null), pt = L(null), tt = L(null);
  J(() => {
    var l, m;
    Me && ((m = (l = tt.current) == null ? void 0 : l.querySelector("input")) == null || m.focus());
  }, [Me]);
  const [Ce, je] = C(!1), [rt, Ct] = C(!1);
  J(() => {
    if ($e || Ce || !pt.current) return;
    const l = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const m = pt.current;
      m != null && m.isConnected && !m.disabled && m.focus(), pt.current = null;
    });
    return () => cancelAnimationFrame(l);
  }, [$e, Ce, re]);
  const [Et, Bt] = C([]), [q, B] = C({}), be = L(null), Ue = L(0), [Ke, pe] = C({});
  J(() => {
    let l = !0;
    return Promise.all(
      io(E.objectFilter).map(
        async (m) => [
          String(m),
          (await Q(`/api/tags/${m}`)).name
        ]
      )
    ).then((m) => {
      l && pe(Object.fromEntries(m));
    }).catch(() => {
    }), () => {
      l = !1;
    };
  }, [E.objectFilter]);
  const yr = at(
    () => ao(E.objectFilter, Ke),
    [Ke, E.objectFilter]
  ), er = L(0), Rr = L(e);
  Rr.current = e;
  const _e = b ?? e, Qe = at(
    () => Dt(_e, E),
    [_e, E]
  ), Z = at(
    () => Fo(Qe, E.performerFocus),
    [Qe, E.performerFocus]
  ), dr = L(Z);
  dr.current = Z;
  const De = L(Qe);
  De.current = Qe;
  const [Gt, wr] = C("items"), [Nt, hn] = C(null), tr = L(null), ze = L("");
  function Be(l) {
    const m = typeof l == "function" ? l(tr.current) : l;
    tr.current = m, hn(m);
  }
  const [ur, gt] = C(!1), [Vt, xe] = C(null), le = L(null), Ne = ce(Qe) ? rn(Qe) : "", [We, Jt] = C(0), [He, Ir] = C(null);
  J(() => () => {
    var l;
    return (l = le.current) == null ? void 0 : l.controller.abort();
  }, []), J(() => {
    const l = le.current;
    !l || l.signature === Ne || (l.controller.abort(), le.current = null, gt(!1));
  }, [Ne]), J(() => {
    var O;
    const l = tr.current;
    if (Gt !== "performers" || !Ne || ((O = le.current) == null ? void 0 : O.signature) === Ne || ze.current === Ne || (l == null ? void 0 : l.signature) === Ne && l.complete)
      return;
    const m = (l == null ? void 0 : l.signature) === Ne ? l : null;
    or(l, (m == null ? void 0 : m.limit) ?? En);
  }, [Gt, Ne, Nt, Vt, ur]);
  const Mt = E.performerFocus, $t = JSON.stringify(
    ce(Qe) ? Qe.occurrence.flagPerformerTagIds ?? [] : []
  );
  J(() => {
    if (!Mt) {
      Ir(null);
      return;
    }
    let l = !0;
    const m = new Set(JSON.parse($t));
    return Q(
      `/api/performers/${Mt}`
    ).then((O) => {
      l && Ir({
        id: Mt,
        name: O.name,
        flags: (O.tags ?? []).filter((j) => m.has(j.id)).map((j) => j.name)
      });
    }).catch(() => {
    }), () => {
      l = !1;
    };
  }, [Mt, $t]);
  const Qt = E.startFrom !== (e.view.startFrom ?? "end") || !Kr(
    JSON.parse(_t(Dt(e, E))),
    JSON.parse(_t(Dt(e, kr(e))))
  ), ht = fe || $e || Me, Pt = Number(E.filter.page);
  function nt(l, m = !1) {
    Te.current || (w.current = "", _.current = m, $.current = l, T(l), Zt(0), Ve(!0), m || Dr(e.id, l), I((O) => O + 1));
  }
  function mt() {
    if (Te.current = !1, st(!1), Oe.current && et.current) {
      const l = et.current;
      et.current = null, nt(l.query, l.startAtEnd);
    }
  }
  J(() => {
    const l = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const m = jn(
            Rr.current,
            new URLSearchParams(window.location.search)
          );
          Te.current ? et.current = m : nt(m.query, m.startAtEnd);
        } catch (m) {
          ne(vt(m));
        }
    };
    return window.addEventListener("popstate", l), () => window.removeEventListener("popstate", l);
  }, [e.id]), J(() => (o(fe || $e || Me || !!b), () => o(!1)), [fe, $e, Me, !!b, o]);
  async function fr(l, m, O) {
    if (ce(l)) {
      const z = await Ii(
        l,
        be.current,
        m,
        O
      );
      return {
        items: z.items.map((H) => ({
          key: H.key,
          media: H.media,
          occurrence: H
        })),
        totalCount: z.totalCount
      };
    }
    const j = await _r(
      l,
      { ...l.view.filter, page: m },
      O
    );
    return {
      items: j.items.map((z) => ({ key: String(z.id), media: z })),
      totalCount: j.totalCount
    };
  }
  function ie(l, m, O, j = !1, z = !1) {
    if (!Oe.current || et.current) return;
    Y(!0), P(
      z ? l.items : Cn(l.items, $.current.startFrom === "end")
    ), Zt(l.totalCount), Ft(O, j);
    const H = {
      ...$.current,
      filter: { ...$.current.filter, page: m }
    };
    $.current = H, T(H), Dr(e.id, H);
  }
  function Ft(l, m = !1) {
    (l == null ? void 0 : l.key) !== (A == null ? void 0 : A.key) && (K.current = null), (l == null ? void 0 : l.media.id) !== (A == null ? void 0 : A.media.id) && ve(m && l ? l.media.id : null), oe(l);
  }
  J(() => {
    if (w.current) return;
    const l = new AbortController();
    F.current = l;
    const m = ++er.current;
    return Ve(!0), ne(""), ee(""), K.current = null, ve(null), oe(null), P([]), ct(!1), (async () => {
      const O = Fo(
        Dt(Rr.current, $.current),
        $.current.performerFocus
      );
      be.current = ce(O) ? await so(O, l.signal) : null;
      let j = Number(O.view.filter.page), z = await fr(O, j, l.signal);
      const H = Math.max(
        1,
        Math.ceil(z.totalCount / Number(O.view.filter.perPage))
      );
      (_.current || j > H) && (j = H, z = await fr(O, j, l.signal)), _.current = !1;
      const Ae = O.view.startFrom === "end" ? -1 : 1;
      for (; ce(O) && !z.items.length && j + Ae >= 1 && j + Ae <= H && !l.signal.aborted; )
        j += Ae, z = await fr(O, j, l.signal);
      if (m !== er.current || l.signal.aborted) return;
      const ot = Cn(z.items, O.view.startFrom === "end");
      ie(z, j, ot[0] ?? null);
    })().catch((O) => {
      !l.signal.aborted && m === er.current && ne(vt(O));
    }).finally(() => {
      !l.signal.aborted && m === er.current && (Y(!0), Ve(!1));
    }), () => {
      l.abort(), er.current++;
    };
  }, [re, e.id]), J(() => {
    if (U(null), !A) return;
    let l = !0;
    return Tt(f, A).then((m) => {
      l && (U(m), Bt(
        ce(e) ? m.ids.filter((O) => e.occurrence.tagIds.includes(O)) : []
      ));
    }).catch((m) => {
      l && ne(`Could not load current tags. ${vt(m)}`);
    }), () => {
      l = !1;
    };
  }, [A]), J(() => {
    if (!ce(e) || e.actions.length)
      return;
    let l = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (m) => [
          m,
          (await Q(`/api/tags/${m}`)).name
        ]
      )
    ).then((m) => {
      l && B(Object.fromEntries(m));
    }).catch((m) => {
      l && ne(vt(m));
    }), () => {
      l = !1;
    };
  }, [e]);
  async function rr(l = !1, m = !1, O = !1) {
    var se;
    if (!A) return;
    const j = X.findIndex((Ee) => Ee.key === A.key), z = E.startFrom === "end" ? -1 : 1, H = ((se = K.current) == null ? void 0 : se.key) === A.key ? K.current : { key: A.key, page: Pt, before: X.slice(0, j + 1).map((Ee) => Ee.key), after: X.slice(j + 1).map((Ee) => Ee.key) }, Ae = new Set(H.after), ot = new Set(H.before), Wt = X.find((Ee) => {
      var bt;
      return Ae.has(Ee.key) || (z === 1 || Pt < H.page) && ((bt = K.current) == null ? void 0 : bt.key) === A.key && !ot.has(Ee.key);
    });
    if (!l && Wt) {
      Ft(Wt, O);
      return;
    }
    const Le = l ? ot : new Set(X.map((Ee) => Ee.key)), Ye = 1100 - (Date.now() - Ue.current);
    Ye > 0 && await new Promise((Ee) => window.setTimeout(Ee, Ye));
    let ke = z === -1 && !l ? Math.max(1, Pt - 1) : Pt;
    for (; Oe.current && !et.current; ) {
      let Ee = await fr(Z, ke);
      const bt = Math.max(
        1,
        Math.ceil(Ee.totalCount / Number(E.filter.perPage))
      );
      ke > bt && (ke = bt, Ee = await fr(Z, ke));
      const Lt = Cn(Ee.items, z === -1), mn = new Map(Lt.map((Ge) => [Ge.key, Ge])), zr = l ? H.after.flatMap((Ge) => {
        const gr = mn.get(Ge);
        return gr ? [gr] : [];
      }) : [], Pr = new Set(zr.map((Ge) => Ge.key)), Re = l ? {
        ...Ee,
        items: [
          ...zr,
          ...Lt.filter(
            (Ge) => Ge.key !== A.key && !Pr.has(Ge.key)
          )
        ]
      } : Ee;
      if (m) {
        K.current = H, ie(Re, ke, A, !1, l);
        return;
      }
      const yt = z === -1 && Pt === 1 && !l ? void 0 : Re.items.find(
        (Ge) => !Le.has(Ge.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(l && z === -1 && ke === H.page) || Ae.has(Ge.key))
      );
      if (yt || (z === -1 ? ke <= 1 : ke >= bt)) {
        ie(
          Re,
          ke,
          yt ?? null,
          O,
          l
        ), yt || ee(
          Ee.totalCount ? `Reached the end in this direction. Matching items remain available from the ${u.queue} pages.` : `No matching ${u.many}.`
        );
        return;
      }
      ke += z;
    }
  }
  async function xt(l, m = !1, O = !1, j = !1) {
    if (b || !A || Te.current || $e || Me && !O)
      return;
    const z = O || j || !!(l != null && l.steps.length), H = z && !m;
    if (z && (!t || !N) || l && Ut(l) && !r) return;
    Te.current = !0, st(!0), ne(""), ee("");
    const Ae = X.findIndex((Le) => Le.key === A.key), ot = z && !m && Ae >= 0 ? X[Ae + 1] ?? null : null;
    ot && (P(
      (Le) => Le.filter((Ye) => Ye.key !== A.key)
    ), Ft(ot, !0));
    let Wt = !1;
    try {
      if (z) {
        const Le = await Tt(f, A);
        if (l)
          await bs(Z, A, l);
        else {
          const ke = j && ce(e) ? e.occurrence.tagIds.filter((bt) => Le.ids.includes(bt)) : lr.current, Ee = Tr(ke, j ? Et : G);
          await uo(Z, A, Ee);
        }
        Ue.current = Date.now();
        const Ye = await Tt(f, A);
        ot || U(Ye), Wt = !0, ct(!1), ee("Tags saved."), A.occurrence && (Cr(A.occurrence.performer.id), Jt((ke) => ke + 1));
      }
      if (!Oe.current || et.current) return;
      z ? await rr(!0, m, H) : m || await rr(), m && O && requestAnimationFrame(() => {
        var Le;
        return (Le = ft.current) == null ? void 0 : Le.focus();
      });
    } catch (Le) {
      if (ne(
        Wt ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${vt(Le)}` : z ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${vt(Le)}` : `Could not advance. ${vt(Le)}`
      ), z && !Wt) {
        ot && (P(X), ve(null), Se((Ye) => Ye + 1), oe(A)), Ue.current = Date.now();
        try {
          U(await Tt(f, A));
        } catch {
          U(null), ne(
            (Ye) => `${Ye} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      mt();
    }
  }
  const Or = !Me && !b && !Ce && !rt && (A != null || $e || fe);
  Zn({
    surface: "local",
    enabled: Or,
    actionCount: e.actions.length,
    onAction: (l, m) => {
      const O = e.actions[l];
      O && xt(O, m);
    },
    onFind: () => Ct(!0)
  });
  const vr = (l) => fe || $e || !N || !!b || !t && l.steps.length > 0 || !r && Ut(l);
  function zt() {
    !i || b || Te.current || Me || (R.current = document.activeElement, y.current = {
      error: It,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone($.current),
      items: X,
      current: A,
      total: ut,
      targets: be.current,
      stayedCursor: K.current
    }, M(structuredClone(Dt(e, $.current))), ee(""), ne(""));
  }
  J(() => {
    s && s !== me.current && V && !$e && (me.current = s, zt());
  }, [s, $e, V]);
  function Sr() {
    M(null), requestAnimationFrame(() => {
      var l;
      return (l = R.current) == null ? void 0 : l.focus();
    });
  }
  function nr() {
    var m;
    const l = y.current;
    !l || fe || ((m = F.current) == null || m.abort(), er.current++, $.current = l.query, T(l.query), P(l.items), oe(l.current), Zt(l.total), be.current = l.targets, K.current = l.stayedCursor, Ve(!1), ne(l.error), ee(""), window.history.replaceState(window.history.state, "", l.url), Sr());
  }
  async function ye() {
    if (!b || !i || Te.current) return;
    const l = Dt(
      { ...b, name: b.name.trim() },
      $.current
    ), m = nn(l);
    if (m) {
      ne(m);
      return;
    }
    Te.current = !0, st(!0), ne("");
    try {
      if (await i(l) === !1) throw new Error("Could not save review.");
      Sr(), ee("Review saved.");
    } catch (O) {
      ne(
        "Could not save review. Your edits are still open. " + vt(O)
      );
    } finally {
      mt();
    }
  }
  async function Mr() {
    if (!i || Te.current) return;
    const l = Dt(e, {
      ...$.current,
      filter: { ...$.current.filter, page: 1 }
    });
    Te.current = !0, st(!0), ne("");
    try {
      if (await i(l) === !1) throw new Error("Could not save review.");
      ee("Queue saved to this review.");
    } catch (m) {
      ne("Could not save queue. " + vt(m));
    } finally {
      mt();
    }
  }
  const he = E.performerScope, lt = (l) => {
    const { performerFocus: m, ...O } = $.current, j = m && !("targetMode" in l || "performerIds" in l || "performerFilter" in l);
    nt({
      ...O,
      ...j ? { performerFocus: m } : {},
      filter: { ...O.filter, page: 1 },
      performerScope: { ...he, ...l }
    });
  };
  async function or(l, m) {
    var z;
    const O = De.current;
    if (!ce(O)) return;
    (z = le.current) == null || z.controller.abort();
    const j = {
      signature: rn(O),
      controller: new AbortController()
    };
    le.current = j, ze.current = "", gt(!0), xe(null);
    try {
      const H = await $s(O, l, m, j.controller.signal, {
        onProgress: (Ae) => {
          le.current === j && Be(Ae);
        }
      });
      le.current === j && Be(H);
    } catch (H) {
      le.current === j && !j.controller.signal.aborted && (ze.current = j.signature, xe({ signature: j.signature, message: vt(H) }));
    } finally {
      le.current === j && (le.current = null, gt(!1));
    }
  }
  function ir() {
    var l;
    (l = le.current) == null || l.controller.abort(), le.current = null, gt(!1), Be((m) => m && { ...m, partial: !0, complete: !1 });
  }
  async function Cr(l) {
    var z;
    const m = De.current;
    if (!ce(m)) return;
    if (le.current) {
      ir();
      return;
    }
    const O = rn(m);
    if (((z = tr.current) == null ? void 0 : z.signature) !== O || tr.current.partial) return;
    const j = 1100 - (Date.now() - Ue.current);
    j > 0 && await new Promise((H) => window.setTimeout(H, j));
    try {
      const H = await Fi(m, l);
      if (le.current) {
        ir();
        return;
      }
      Be(
        (Ae) => (Ae == null ? void 0 : Ae.signature) === O ? Ps(Ae, l, H) : Ae
      );
    } catch {
      Be(
        (H) => (H == null ? void 0 : H.signature) === O ? { ...H, partial: !0, complete: !1 } : H
      );
    }
  }
  const Jr = E.performerFocus ? Nt == null ? void 0 : Nt.candidates.find((l) => l.id === E.performerFocus) : void 0, Pe = (He == null ? void 0 : He.id) === E.performerFocus ? He : Jr ?? null;
  function Qr(l) {
    if (Te.current) return;
    const m = {
      ...$.current,
      performerFocus: l,
      filter: { ...$.current.filter, page: 1 }
    };
    nt(m, m.startFrom === "end"), wr("items");
  }
  function $r() {
    const { performerFocus: l, ...m } = $.current;
    nt(
      { ...m, filter: { ...m.filter, page: 1 } },
      m.startFrom === "end"
    );
  }
  return /* @__PURE__ */ d(
    "section",
    {
      className: `dq-review-workspace${f === "audio" ? " dq-audio" : ""}`,
      "aria-label": he ? f === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : f === "audio" ? "Audio review" : "Video review",
      children: [
        b && /* @__PURE__ */ d("section", { className: "dq-rule-editor", "aria-label": "Edit review rule", children: [
          /* @__PURE__ */ n("h2", { children: "Edit review" }),
          /* @__PURE__ */ n("p", { children: "Preview matching scenes below. Save review keeps all rule changes; Cancel restores your previous view." }),
          /* @__PURE__ */ d("fieldset", { disabled: fe, children: [
            a == null ? void 0 : a(
              Dt(b, E),
              M,
              fe
            ),
            /* @__PURE__ */ d("label", { children: [
              "Review direction",
              /* @__PURE__ */ d(
                "select",
                {
                  "aria-label": "Review direction",
                  value: E.startFrom,
                  onChange: (l) => nt({
                    ...$.current,
                    startFrom: l.target.value
                  }),
                  children: [
                    /* @__PURE__ */ n("option", { value: "end", children: "Start from the end" }),
                    /* @__PURE__ */ n("option", { value: "beginning", children: "Start from the beginning" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ d("div", { className: "dq-row", children: [
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button primary",
                type: "button",
                disabled: fe || $e,
                onClick: () => void ye(),
                children: "Save review"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button",
                type: "button",
                disabled: fe,
                onClick: nr,
                children: "Cancel"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ d(
          "fieldset",
          {
            className: "dq-review-filters",
            disabled: ht,
            onClickCapture: (l) => {
              var j;
              const m = l.target instanceof Element ? l.target.closest("button") : null, O = (m == null ? void 0 : m.getAttribute("aria-label")) ?? ((j = m == null ? void 0 : m.textContent) == null ? void 0 : j.trim()) ?? "";
              m && !m.closest('[role="dialog"], dialog') && /^(Filters|Edit filter:|Edit performer criteria)/.test(O) && (pt.current = m);
            },
            children: [
              /* @__PURE__ */ n("legend", { children: f === "audio" ? "Audio filters" : "Scene filters" }),
              /* @__PURE__ */ d("div", { className: "dq-queue-toolbar", children: [
                /* @__PURE__ */ n(
                  jr,
                  {
                    filter: E.filter,
                    objectFilter: yr,
                    criteriaDefinitions: f === "audio" ? Gn : dn,
                    customFieldEntityType: f,
                    totalCount: ut,
                    sortOptions: f === "audio" ? Bo : Vn,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    onFilterChange: (l) => {
                      (l.sort !== $.current.filter.sort || l.direction !== $.current.filter.direction) && (l = { ...l, sorts: void 0 }), nt({
                        ...$.current,
                        filter: Ze(l, f)
                      });
                    },
                    onObjectFilterChange: (l) => {
                      nt({
                        ...$.current,
                        objectFilter: qi(
                          l,
                          Ke,
                          $.current.objectFilter
                        ),
                        filter: { ...$.current.filter, page: 1 }
                      });
                    }
                  }
                ),
                !b && Qt && /* @__PURE__ */ d("div", { className: "dq-review-defaults", children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      "aria-label": "Save changes to review filters",
                      title: "Save changes to review filters",
                      disabled: !i,
                      onClick: () => void Mr(),
                      children: /* @__PURE__ */ n(Jn, { "aria-hidden": "true" })
                    }
                  ),
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      "aria-label": "Reset to default review filters",
                      title: "Reset to default review filters",
                      onClick: () => {
                        const l = kr(e);
                        nt(l, l.startFrom === "end");
                      },
                      children: /* @__PURE__ */ n(Ho, { "aria-hidden": "true" })
                    }
                  )
                ] })
              ] }),
              he && /* @__PURE__ */ d("div", { className: "dq-scope-controls", children: [
                /* @__PURE__ */ d("label", { children: [
                  "Performers to review",
                  " ",
                  /* @__PURE__ */ d(
                    "select",
                    {
                      value: he.targetMode,
                      onChange: (l) => lt({
                        targetMode: l.target.value
                      }),
                      children: [
                        /* @__PURE__ */ n("option", { value: "all", children: "All performers" }),
                        /* @__PURE__ */ n("option", { value: "selected", children: "Specific performers" }),
                        /* @__PURE__ */ n("option", { value: "filter", children: "Matching performer criteria" })
                      ]
                    }
                  )
                ] }),
                he.targetMode === "selected" && /* @__PURE__ */ n(
                  Rt,
                  {
                    entityType: "performer",
                    values: he.performerIds,
                    onChange: (l) => lt({ performerIds: l }),
                    placeholder: "All performers...",
                    allowCreate: !1
                  }
                ),
                he.targetMode === "filter" && /* @__PURE__ */ d(we, { children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => je(!0),
                      children: "Edit performer criteria"
                    }
                  ),
                  /* @__PURE__ */ n("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ n(
                    jr,
                    {
                      filter: {},
                      onFilterChange: () => {
                      },
                      totalCount: 0,
                      sortOptions: [],
                      showSearch: !1,
                      showSort: !1,
                      showPagingControls: !1,
                      criteriaDefinitions: kn,
                      objectFilter: he.performerFilter,
                      onObjectFilterChange: (l) => lt({ performerFilter: l })
                    }
                  ) })
                ] }),
                E.performerFocus && /* @__PURE__ */ d(
                  "div",
                  {
                    className: "dq-performer-focus",
                    role: "group",
                    "aria-label": "Performer focus",
                    children: [
                      /* @__PURE__ */ n(
                        tn,
                        {
                          performer: {
                            id: E.performerFocus,
                            name: (Pe == null ? void 0 : Pe.name) ?? ""
                          }
                        }
                      ),
                      /* @__PURE__ */ d("span", { children: [
                        "Only ",
                        (Pe == null ? void 0 : Pe.name) ?? `performer ${E.performerFocus}`
                      ] }),
                      Pe != null && Pe.flags.length ? /* @__PURE__ */ d("span", { className: "dq-performer-flag", children: [
                        "Flagged: ",
                        Pe.flags.join(", ")
                      ] }) : null,
                      /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: $r, children: "Show all performers" })
                    ]
                  }
                ),
                /* @__PURE__ */ d("label", { children: [
                  "Occurrence tags",
                  " ",
                  /* @__PURE__ */ n(
                    "select",
                    {
                      value: he.condition,
                      onChange: (l) => lt({
                        condition: l.target.value
                      }),
                      children: fn.map((l) => /* @__PURE__ */ n("option", { value: l, children: un[l] }, l))
                    }
                  )
                ] }),
                !["any", "isNull"].includes(he.condition) && /* @__PURE__ */ d(we, { children: [
                  /* @__PURE__ */ n(
                    Rt,
                    {
                      entityType: "tag",
                      values: he.conditionTagIds,
                      onChange: (l) => lt({ conditionTagIds: l }),
                      placeholder: "Occurrence condition tags...",
                      allowCreate: !1
                    }
                  ),
                  /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "checkbox",
                        checked: he.includeSubtags ?? !0,
                        onChange: (l) => lt({ includeSubtags: l.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  qr(he.condition) && /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "checkbox",
                        checked: he.hideConfirmedAbsent ?? !0,
                        onChange: (l) => lt({ hideConfirmedAbsent: l.target.checked })
                      }
                    ),
                    "Hide occurrences confirmed absent"
                  ] })
                ] })
              ] }),
              ce(Qe) && E.performerFocus && /* @__PURE__ */ n(
                $i,
                {
                  review: Qe,
                  performerId: E.performerFocus,
                  revision: We
                }
              )
            ]
          }
        ),
        he && /* @__PURE__ */ n(
          Go,
          {
            open: Ce,
            onClose: () => je(!1),
            criteria: kn,
            activeFilter: he.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (l) => {
              je(!1), lt({ performerFilter: l });
            }
          }
        ),
        ce(Z) && t && /* @__PURE__ */ n(
          qs,
          {
            review: Z,
            hidden: !!b,
            disabled: ht || !!b,
            performerFlags: E.performerFocus ? Pe == null ? void 0 : Pe.flags : void 0,
            onOpen: () => {
              Te.current = !0, st(!0);
            },
            onWrite: () => {
              Ue.current = Date.now();
            },
            onClose: (l) => {
              if (l) {
                Ue.current = Date.now();
                const m = $.current.performerFocus;
                m ? Cr(m) : ir(), Jt((O) => O + 1), new Promise((O) => window.setTimeout(O, 1100)).then(() => {
                  mt(), Oe.current && I((O) => O + 1);
                });
              } else mt();
            }
          }
        ),
        /* @__PURE__ */ d("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
          It && /* @__PURE__ */ d("p", { role: "alert", children: [
            It,
            " ",
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: fe,
                onClick: () => {
                  A ? Tt(f, A).then(U).catch((l) => ne(vt(l))) : nt($.current);
                },
                children: A ? "Reload tags" : "Retry queue"
              }
            )
          ] }),
          Je && /* @__PURE__ */ n("p", { role: "status", children: Je })
        ] }),
        /* @__PURE__ */ d("div", { className: "dq-review-layout", children: [
          /* @__PURE__ */ d("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
            he && /* @__PURE__ */ d("div", { className: "dq-queue-view", role: "group", "aria-label": "Queue view", children: [
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  "aria-pressed": Gt === "items",
                  onClick: () => wr("items"),
                  children: f === "audio" ? "Audios" : "Scenes"
                }
              ),
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  "aria-pressed": Gt === "performers",
                  onClick: () => wr("performers"),
                  children: "Performers"
                }
              )
            ] }),
            he && Gt === "performers" ? /* @__PURE__ */ n(
              Is,
              {
                ranking: (Nt == null ? void 0 : Nt.signature) === Ne ? Nt : null,
                busy: ur,
                error: (Vt == null ? void 0 : Vt.signature) === Ne ? Vt.message : "",
                focus: E.performerFocus,
                disabled: ht,
                labels: u,
                onFocus: Qr,
                onMore: () => {
                  const l = tr.current;
                  l && or(l, l.limit + En);
                },
                onRefresh: () => {
                  Be(null), or(null, En);
                }
              }
            ) : /* @__PURE__ */ d(we, { children: [
              /* @__PURE__ */ n("fieldset", { disabled: ht, children: /* @__PURE__ */ n(
                Vo,
                {
                  filter: E.filter,
                  totalCount: ut,
                  onFilterChange: (l) => nt({ ...E, filter: Ze(l, f) })
                }
              ) }),
              /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: X.map((l) => /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  title: v(l),
                  "aria-label": v(l),
                  disabled: ht,
                  "aria-pressed": (A == null ? void 0 : A.key) === l.key,
                  onClick: () => {
                    Ft(l), ne(""), ee("");
                  },
                  children: [
                    l.occurrence && /* @__PURE__ */ n(tn, { performer: l.occurrence.performer }),
                    /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: g(l.media) })
                  ]
                },
                l.key
              )) })
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-inspector", children: A ? /* @__PURE__ */ d(we, { children: [
            /* @__PURE__ */ d("div", { className: "dq-review-media", children: [
              /* @__PURE__ */ n("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ n(
                "a",
                {
                  href: `/${f}/${A.media.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: A.media.title || ((pr = A.media.files[0]) == null ? void 0 : pr.basename) || `${f === "audio" ? "Audio" : "Video"} ${A.media.id}`
                }
              ) }),
              [A, Kt].filter(Boolean).map((l) => {
                var j, z, H, Ae, ot;
                const m = l, O = m.key === A.key;
                return /* @__PURE__ */ n(
                  "div",
                  {
                    className: O ? "dq-review-video-current" : "dq-review-video-preload",
                    "aria-hidden": O ? void 0 : !0,
                    inert: O ? void 0 : !0,
                    children: f === "audio" ? /* @__PURE__ */ n(
                      ia,
                      {
                        streamUrl: Pn("audio", m.media.id),
                        format: ((j = m.media.files[0]) == null ? void 0 : j.format) ?? "",
                        title: g(m.media),
                        coverUrl: O ? qo("audio", m.media) : void 0,
                        duration: ((z = m.media.files[0]) == null ? void 0 : z.duration) ?? 0,
                        autostart: O && ue === m.media.id
                      }
                    ) : /* @__PURE__ */ n(
                      Jo,
                      {
                        videoId: m.media.id,
                        streamUrl: Pn("video", m.media.id),
                        posterUrl: O ? qo("video", m.media) : void 0,
                        duration: ((H = m.media.files[0]) == null ? void 0 : H.duration) ?? 0,
                        format: (Ae = m.media.files[0]) == null ? void 0 : Ae.format,
                        audioCodec: (ot = m.media.files[0]) == null ? void 0 : ot.audioCodec,
                        extensionSurface: O ? "quick-view" : void 0,
                        autostart: O && ue === m.media.id,
                        keyboardShortcutsEnabled: O,
                        showAbLoop: O,
                        clip: m.media.parentVideoId != null ? {
                          start: m.media.clipStartSec ?? 0,
                          end: m.media.clipEndSec,
                          loop: !1
                        } : void 0
                      }
                    )
                  },
                  `${m.media.id}:${ae}`
                );
              }),
              f === "audio" && /* @__PURE__ */ n(
                Rs,
                {
                  details: A.media.details,
                  label: u.one
                },
                A.media.id
              )
            ] }),
            /* @__PURE__ */ d("div", { className: "dq-review-panel", children: [
              /* @__PURE__ */ n("h2", { children: A.occurrence ? `Reviewing ${A.occurrence.performer.name}` : `Reviewing this ${u.one}` }),
              /* @__PURE__ */ n("p", { children: he ? `Tags apply only to this performer in this ${u.one}.` : `Tags apply to the ${u.one}.` }),
              he && /* @__PURE__ */ n(
                "div",
                {
                  className: "dq-review-partners",
                  "aria-label": `Matching ${u.queue} partners`,
                  children: X.filter((l) => l.media.id === A.media.id).map((l) => {
                    var m, O;
                    return /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button dq-partner-button",
                        title: (m = l.occurrence) == null ? void 0 : m.performer.name,
                        "aria-label": (O = l.occurrence) == null ? void 0 : O.performer.name,
                        disabled: ht,
                        "aria-pressed": l.key === A.key,
                        onClick: () => {
                          Ft(l), ne("");
                        },
                        children: l.occurrence && /* @__PURE__ */ n(
                          tn,
                          {
                            performer: l.occurrence.performer
                          }
                        )
                      },
                      l.key
                    );
                  })
                }
              ),
              /* @__PURE__ */ d("p", { children: [
                "Current ",
                he ? "occurrence" : u.one,
                " tags:",
                " ",
                N ? N.names.join(", ") || "None" : "Loading…"
              ] }),
              N != null && N.absent.length ? /* @__PURE__ */ d("p", { children: [
                "Confirmed absent tags:",
                " ",
                /* @__PURE__ */ n(
                  Rt,
                  {
                    entityType: "tag",
                    values: N.absent,
                    onChange: () => {
                    },
                    disabled: !0,
                    allowCreate: !1
                  }
                )
              ] }) : null,
              Me ? /* @__PURE__ */ d(
                "fieldset",
                {
                  ref: tt,
                  disabled: fe,
                  className: "dq-tag-editor",
                  children: [
                    /* @__PURE__ */ d("legend", { children: [
                      "Edit ",
                      he ? "occurrence" : u.one,
                      " tags"
                    ] }),
                    /* @__PURE__ */ n(
                      Rt,
                      {
                        entityType: "tag",
                        values: G,
                        onChange: Ot,
                        placeholder: "Choose tags for this item...",
                        allowCreate: !1
                      }
                    ),
                    /* @__PURE__ */ d("div", { className: "dq-row", children: [
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          disabled: !N,
                          onClick: () => void xt(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !N,
                          onClick: () => void xt(void 0, !1, !0),
                          children: "Save & next"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => {
                            ct(!1), requestAnimationFrame(
                              () => {
                                var l;
                                return (l = ft.current) == null ? void 0 : l.focus();
                              }
                            );
                          },
                          children: "Cancel"
                        }
                      )
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ d(we, { children: [
                /* @__PURE__ */ n(
                  xs,
                  {
                    actions: _e.actions,
                    canWrite: t,
                    canAssess: r,
                    disabled: fe || $e || !N || !!b,
                    onApply: (l, m) => void xt(l, m),
                    onFind: b ? void 0 : () => Ct(!0)
                  }
                ),
                ce(e) && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ d(
                  "fieldset",
                  {
                    className: "dq-tag-choices",
                    disabled: !t || fe || !N || !!b,
                    children: [
                      /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                      e.occurrence.tagIds.map((l) => /* @__PURE__ */ d("label", { children: [
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: e.occurrence.multiple ? "checkbox" : "radio",
                            name: "legacy-choice",
                            checked: Et.includes(l),
                            onChange: (m) => Bt(
                              e.occurrence.multiple ? m.target.checked ? [...Et, l] : Et.filter(
                                (O) => O !== l
                              ) : [l]
                            )
                          }
                        ),
                        q[l] ?? "Loading tag…"
                      ] }, l)),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          onClick: () => Bt([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void xt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void xt(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ d("div", { className: "dq-row", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ref: ft,
                    className: "dq-button",
                    disabled: ht || !!b || !t || !N,
                    onClick: () => {
                      lr.current = [...N.ids], Ot([...N.ids]), ct(!0);
                    },
                    children: "Edit tags"
                  }
                ),
                /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: ht || !!b,
                    onClick: () => void xt(),
                    children: [
                      "Skip",
                      he ? " performer" : ` ${u.one}`
                    ]
                  }
                )
              ] }),
              !t && /* @__PURE__ */ n("p", { children: "Write permission is required to change tags." })
            ] })
          ] }) : /* @__PURE__ */ n("p", { role: "status", children: $e ? "Loading review…" : ut ? "Reached the end in this direction." : `No matching ${u.many}.` }) })
        ] }),
        rt && /* @__PURE__ */ n(
          to,
          {
            actions: e.actions,
            isDisabled: (l) => vr(l),
            onApply: (l, m) => {
              Ct(!1), xt(l, m);
            },
            onClose: () => Ct(!1)
          }
        )
      ]
    }
  );
}
function _s(e) {
  var f, u, p;
  const [t, r] = C({}), [o, i] = C(""), s = (((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.annotations) ?? []).includes("tags") ? ((u = e == null ? void 0 : e.presentation) == null ? void 0 : u.annotationParents) ?? [] : [], a = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...s,
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return J(() => {
    let g = !0;
    return r({}), i(""), Promise.all(
      JSON.parse(a).map(
        async (v) => [v, await Hn([v])]
      )
    ).then((v) => {
      g && r(Object.fromEntries(v));
    }).catch(() => {
      g && i(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      g = !1;
    };
  }, [a]), { ids: t, error: o };
}
function Ds(e, t, r) {
  const o = t == null ? void 0 : t.presentation, i = (o == null ? void 0 : o.annotations) ?? [], s = (o == null ? void 0 : o.annotationParents) ?? [];
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
      (a) => s.some(
        (f) => {
          var u;
          return f !== a.id && ((u = r[f]) == null ? void 0 : u.includes(a.id));
        }
      )
    ) : []
  };
}
function js({
  videos: e,
  review: t,
  trees: r,
  disabled: o,
  onChoose: i
}) {
  var f, u, p;
  const s = new Set(
    (((f = t.presentation) == null ? void 0 : f.binParents) ?? []).flatMap(
      (g) => (r[g] ?? []).filter((v) => v !== g)
    )
  ), a = /* @__PURE__ */ new Map();
  for (const g of e)
    for (const v of g.tags ?? [])
      if (s.has(v.id)) {
        const S = a.get(v.id) ?? { name: v.name, count: 0 };
        S.count++, a.set(v.id, S);
      }
  return (p = (u = t.presentation) == null ? void 0 : u.binParents) != null && p.length ? /* @__PURE__ */ d("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...a].sort((g, v) => g[1].name.localeCompare(v[1].name)).map(([g, v]) => /* @__PURE__ */ d(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: o,
        onClick: () => i(g),
        children: [
          v.name,
          " (",
          v.count,
          ")"
        ]
      },
      g
    )),
    !a.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function Us(e, t) {
  const { _filterExpression: r, ...o } = e.view.objectFilter;
  return {
    ...e,
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...Object.keys(o).length ? [{ filter: o }] : [],
            ...r ? [{ group: r }] : [],
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
function xo({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: o = !0
}) {
  const [i, s] = C(!1), a = Fe(e) === "tag" ? "tag" : de(e), f = a === "tag" ? "tags" : `${a}s`, u = aa(
    a === "tag" ? void 0 : a,
    e.view.objectFilter
  ), p = e.view.filter, g = a === "tag" ? Qo : a === "audio" ? Bo : Vn, v = a === "tag" ? zo : a === "audio" ? Gn : dn, S = (y) => t({
    ...e,
    view: { ...e.view, filter: { ...p, ...y } }
  }), w = a === "video" ? e.presentation ?? {} : {}, b = a !== "audio", M = (y) => t({ ...e, presentation: { ...w, ...y } });
  return /* @__PURE__ */ d(we, { children: [
    o && /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ d("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(p.q ?? ""),
            onChange: (y) => S({ q: y.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ d("div", { className: "dq-field-grid", children: [
        /* @__PURE__ */ d("label", { children: [
          "Sort",
          /* @__PURE__ */ d(
            "select",
            {
              "aria-label": "Sort",
              value: String(p.sort ?? "date"),
              onChange: (y) => S({ sort: y.target.value, sorts: void 0 }),
              children: [
                !g.some((y) => y.value === p.sort) && p.sort != null && /* @__PURE__ */ n("option", { value: String(p.sort), children: String(p.sort) }),
                g.map((y) => /* @__PURE__ */ n("option", { value: y.value, children: y.label }, y.value))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          "Direction",
          /* @__PURE__ */ d(
            "select",
            {
              "aria-label": "Direction",
              value: String(p.direction ?? "desc"),
              onChange: (y) => S({ direction: y.target.value }),
              children: [
                /* @__PURE__ */ n("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ n("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          a === "tag" ? "Tags" : "Videos",
          " per page",
          /* @__PURE__ */ n(
            "input",
            {
              type: "number",
              min: "1",
              max: "1000",
              value: Number(p.perPage) || 40,
              onChange: (y) => S({
                perPage: Math.max(
                  1,
                  Math.min(1e3, Number(y.target.value) || 40)
                )
              })
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          "Start from",
          /* @__PURE__ */ d(
            "select",
            {
              "aria-label": "Start from",
              value: e.view.startFrom ?? "end",
              onChange: (y) => t({
                ...e,
                view: {
                  ...e.view,
                  startFrom: y.target.value
                }
              }),
              children: [
                /* @__PURE__ */ n("option", { value: "end", children: "The end" }),
                /* @__PURE__ */ n("option", { value: "beginning", children: "The beginning" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          className: "dq-button",
          onClick: () => s(!0),
          children: [
            "Edit ",
            a,
            " filters"
          ]
        }
      ),
      /* @__PURE__ */ d("p", { children: [
        Object.keys(e.view.objectFilter).length ? `${a[0].toUpperCase()}${a.slice(1)} filters configured` : `No ${a} filters`,
        ". Choose which ",
        f,
        " enter the queue."
      ] }),
      i && /* @__PURE__ */ n("div", { onKeyDown: (y) => y.stopPropagation(), children: /* @__PURE__ */ n(
        Go,
        {
          open: !0,
          onClose: () => s(!1),
          criteria: v,
          activeFilter: e.view.objectFilter,
          customSections: u ? [u] : void 0,
          supportsFilterExpressions: a !== "tag",
          subjectLabel: f,
          onApply: (y) => {
            t({ ...e, view: { ...e.view, objectFilter: y } }), s(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ d(we, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ d("p", { className: "dq-editor-note", children: [
        "Choose how ",
        a === "tag" ? "tags" : `${f} and tags`,
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ d("div", { className: "dq-field-grid", children: [
        oi(e) && /* @__PURE__ */ d("label", { children: [
          "Preferred review layout",
          /* @__PURE__ */ d(
            "select",
            {
              value: e.view.reviewMode ?? "single",
              onChange: (y) => t({ ...e, view: { ...e.view, reviewMode: y.target.value } }),
              children: [
                /* @__PURE__ */ n("option", { value: "single", children: "Single video" }),
                /* @__PURE__ */ n("option", { value: "multiple", children: "Multiple videos" })
              ]
            }
          )
        ] }),
        !ce(e) && b && /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: e.view.selectAllOnLoad ?? !1,
              onChange: (y) => t({ ...e, view: { ...e.view, selectAllOnLoad: y.target.checked ? !0 : void 0 } })
            }
          ),
          "Select all ",
          f,
          " on page load",
          a === "video" && /* @__PURE__ */ n("small", { children: " (multiple-videos layout)" })
        ] }),
        b && /* @__PURE__ */ d("label", { children: [
          "Preferred view",
          /* @__PURE__ */ n(
            "select",
            {
              value: a === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid",
              onChange: (y) => t({
                ...e,
                view: {
                  ...e.view,
                  displayMode: y.target.value
                }
              }),
              children: (a === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((y) => /* @__PURE__ */ n("option", { children: y }, y))
            }
          )
        ] })
      ] }),
      a === "video" && /* @__PURE__ */ d(we, { children: [
        /* @__PURE__ */ n("h4", { children: "Card annotations" }),
        /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((y) => {
          const R = w.annotations ?? [];
          return /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: R.includes(y),
                onChange: (F) => M({
                  annotations: F.target.checked ? [...R, y] : R.filter((V) => V !== y)
                })
              }
            ),
            y
          ] }, y);
        }) }),
        (w.annotations ?? []).includes("tags") && /* @__PURE__ */ d(we, { children: [
          /* @__PURE__ */ n("h4", { children: "Card tag bins" }),
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected. This setting is separate from the queue filters." }),
          /* @__PURE__ */ n(
            Rt,
            {
              entityType: "tag",
              values: w.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (y) => M({ annotationParents: y }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ n("h4", { children: "Queue tag bins" }),
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ n(
          Rt,
          {
            entityType: "tag",
            values: w.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (y) => M({ binParents: y }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const Nn = 180, Ks = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
};
function Li({ entityType: e }) {
  const t = Ks[e];
  return e === "tag" ? /* @__PURE__ */ n(ua, { role: "img", "aria-label": t }) : Lr(e) === "audio" ? /* @__PURE__ */ n(fa, { role: "img", "aria-label": t }) : /* @__PURE__ */ n(Rn, { role: "img", "aria-label": t });
}
function Lo(e) {
  return Fe(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function _o(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function An() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Do(e) {
  const t = new URLSearchParams(window.location.search);
  gn.forEach((o) => t.delete(o)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function Bs(e) {
  return Ze({ ...e, page: 1 });
}
function _i(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function jt(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Di = "data-quality.workspace-layout.v1", fo = 240, Un = 192, Kn = 560;
function ji(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(Kn, Math.max(Un, e)) : fo;
}
function Gs() {
  try {
    const e = JSON.parse(
      localStorage.getItem(Di) ?? "null"
    );
    return ji(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return fo;
  }
}
function Vs(e) {
  try {
    localStorage.setItem(
      Di,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function Ui(e) {
  switch (e) {
    case "ADD":
      return "positive";
    case "REMOVE":
    case "REMOVE_TREE":
      return "negative";
    case "MARK_PRESENT":
      return "present";
    case "MARK_ABSENT":
      return "absent";
    case "CLEAR_ABSENCE":
      return "neutral";
  }
}
function Ki(e, t) {
  switch (e.mode) {
    case "ADD":
      return `Add ${t}`;
    case "REMOVE":
      return t;
    case "REMOVE_TREE":
      return `${t} tree`;
    case "MARK_PRESENT":
      return `Mark ${t} present`;
    case "MARK_ABSENT":
      return `Mark ${t} absent`;
    case "CLEAR_ABSENCE":
      return `Clear ${t} absence`;
  }
}
function Js(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : Ki(e, t);
}
function Qs({
  onNavigate: e
}) {
  const [t, r] = C([]), [o] = C(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, s] = C(""), [a, f] = C(!0), [u, p] = C(""), [g, v] = C(!1), [S, w] = C(!1), [b, M] = C(!1), [y, R] = C(!1), [F, V] = C([]), [Y, me] = C(""), [E, T] = C(!0), [$, re] = C(""), [I, _] = C(""), [X, P] = C(!1), [A, oe] = C(!1), [K, ue] = C(An), [ve, ae] = C({}), [Se, Kt] = C("name"), [ut, Zt] = C("asc"), $e = L(null), Ve = L(!1), [fe, st] = C(0), [Te, Oe] = C(!1), [et, It] = C(!1), [ne, Je] = C(
    null
  ), ee = t.find((c) => c.id === K) ?? null, N = at(
    () => (ne == null ? void 0 : ne.id) === K && ee ? { ...ee, view: {
      ...ee.view,
      filter: ne.view.filter,
      objectFilter: ne.view.objectFilter,
      searchMode: ne.view.searchMode,
      startFrom: ne.view.startFrom
    } } : ee,
    [ne, K, ee]
  ), U = N ? Fe(N) : "video", Me = Lr(U), ct = N ? ce(N) : !1, G = U === "video" ? N : null, Ot = ct && !!(N != null && N.actions.some(Ut)), lr = !!G || U === "audio" || Ot, [ft, pt] = C(null), tt = (ft == null ? void 0 : ft.id) === (N == null ? void 0 : N.id) ? ft == null ? void 0 : ft.mode : (N == null ? void 0 : N.view.reviewMode) ?? "single", Ce = ct || U === "audio" || U === "video" && tt === "single", [je, rt] = C(0), Ct = L(-1), Et = L(!1);
  J(() => {
    const c = () => {
      if (!Ce && rr.current) {
        Et.current = !0;
        return;
      }
      ue(An()), Ce || rt((h) => h + 1);
    };
    return window.addEventListener("popstate", c), () => window.removeEventListener("popstate", c);
  }, [Ce]);
  const Bt = Me === "audio" ? S : g, q = U === "tag" ? "Tag" : Me === "audio" ? "Audio" : "Video", B = U === "tag" ? b : Bt, be = at(() => {
    const c = ut === "asc" ? 1 : -1;
    return [...t].sort((h, k) => {
      if (Se === "count") {
        const x = ve[h.id], W = ve[k.id], D = typeof x == "number", te = typeof W == "number";
        if (D !== te) return D ? -1 : 1;
        if (D && te && x !== W)
          return (x - W) * c;
      }
      return h.name.localeCompare(k.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * c;
    });
  }, [ut, Se, ve, t]), Ue = L(
    null
  ), Ke = _s(G), [pe, yr] = C({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [er, Rr] = C({
    page: 1,
    perPage: 40
  }), [_e, Qe] = C({ items: [], totalCount: 0 }), [Z, dr] = C(!1), [De, Gt] = C(""), [wr, Nt] = C(!1), [hn, tr] = C(!1), [ze, Be] = C(() => /* @__PURE__ */ new Set()), ur = L(ze);
  ur.current = ze;
  const gt = L(/* @__PURE__ */ new Map()), Vt = (N == null ? void 0 : N.view.selectAllOnLoad) === !0, [xe, le] = C(null), Ne = L(xe);
  Ne.current = xe;
  const [We, Jt] = C(!1), He = L(We);
  He.current = We;
  const Ir = L(null), [Mt, $t] = C(!1), [Qt, ht] = C("grid"), [Pt, nt] = C(Nn), [mt, fr] = C(Gs), [ie, Ft] = C(!1), rr = L(!1), [xt, Or] = C(""), [vr, zt] = C(""), [Sr, nr] = C(""), [ye, Mr] = C(null), [he, lt] = C(""), [or, ir] = C(!1), [Cr, Jr] = C({}), Pe = L(/* @__PURE__ */ new Map()), Qr = L(null), $r = L(null), pr = L(null), l = L(0), m = L(0), O = L(null), j = L(null), z = eo(
    at(
      () => (G == null ? void 0 : G.actions.flatMap(
        (c) => c.steps.flatMap((h) => h.tagIds)
      )) ?? [],
      [G == null ? void 0 : G.actions]
    )
  );
  function H(c) {
    const h = ji(c);
    fr(h), Vs(h);
  }
  function Ae(c) {
    const h = c.shiftKey ? 40 : 16;
    let k = null;
    c.key === "ArrowLeft" && (k = mt + h), c.key === "ArrowRight" && (k = mt - h), c.key === "Home" && (k = Un), c.key === "End" && (k = Kn), k !== null && (c.preventDefault(), c.stopPropagation(), H(k));
  }
  J(() => {
    if (!vr) return;
    const c = window.setTimeout(() => zt(""), 4e3);
    return () => window.clearTimeout(c);
  }, [vr]), J(() => {
    const c = G ? io(G.view.objectFilter) : [];
    if (Jr({}), !c.length) return;
    const h = new AbortController();
    let k = !0;
    return Promise.all(
      c.map(async (x) => {
        var W;
        try {
          const D = await Q(`/api/tags/${x}`, {
            signal: h.signal
          });
          return (W = D.name) != null && W.trim() ? [String(x), D.name] : null;
        } catch {
          return null;
        }
      })
    ).then((x) => {
      k && Jr(
        Object.fromEntries(x.filter((W) => W !== null))
      );
    }), () => {
      k = !1, h.abort();
    };
  }, [G == null ? void 0 : G.id, G == null ? void 0 : G.view.objectFilter]);
  const ot = at(
    () => G ? ao(
      G.view.objectFilter,
      Cr
    ) : (N == null ? void 0 : N.view.objectFilter) ?? {},
    [Cr, N, G]
  ), Wt = ar(async () => {
    f(!0), p("");
    try {
      const c = await Ta();
      r(c.reviews), s(c.storageKey), v(c.canWriteVideos ?? c.canWrite), w(c.canWriteAudios ?? !1), M(c.canWriteTags ?? !1), R(c.canReadTagGroups ?? !1), T(c.canConfigure ?? !0), re(c.storageNotice ?? ""), K && !c.reviews.some((h) => h.id === K) && (ue(""), Do(""));
    } catch (c) {
      p(
        c instanceof Error ? c.message : "Could not load reviews."
      );
    } finally {
      f(!1);
    }
  }, [K]);
  J(() => {
    if (!y) {
      V([]), me("");
      return;
    }
    const c = new AbortController();
    return me(""), Da(c.signal).then(V).catch((h) => {
      c.signal.aborted || me(
        h instanceof Error ? h.message : "Could not load tag groups."
      );
    }), () => c.abort();
  }, [y]), J(() => {
    Wt();
  }, []), J(() => {
    if (K || t.length === 0) return;
    const c = new AbortController();
    ae({});
    for (const h of t)
      (ce(h) ? so(h, c.signal).then((x) => (x == null ? void 0 : x.length) === 0 ? { items: [], totalCount: 0 } : _r(co(h, x), { ...h.view.filter, page: 1, perPage: 1 }, c.signal)) : Fe(h) === "tag" ? ko(
        h,
        Ze({ ...h.view.filter, page: 1, perPage: 1 }),
        c.signal
      ) : _r(
        h,
        Ze({ ...h.view.filter, page: 1, perPage: 1 }),
        c.signal
      )).then((x) => {
        c.signal.aborted || ae((W) => ({
          ...W,
          [h.id]: x.totalCount
        }));
      }).catch(() => {
        c.signal.aborted || ae((x) => ({ ...x, [h.id]: null }));
      });
    return () => c.abort();
  }, [K, t]), Bn(() => {
    var c;
    K || a || !Ve.current || (Ve.current = !1, (c = $e.current) == null || c.focus());
  }, [K, a]);
  const Le = L(0), Ye = ar(async () => {
    const c = ++Le.current;
    Mr(null), lt("");
    try {
      const h = await (Ot ? bi(Me) : mi(Me));
      c === Le.current && Mr(h);
    } catch (h) {
      if (c !== Le.current) return;
      Mr(null), lt(
        "Tag assessment setup could not be checked. " + (h instanceof Error ? h.message : "Request failed.")
      );
    }
  }, [Ot, Me]);
  J(() => {
    Ye();
  }, [Ye]);
  const ke = ar(
    async (c, h, k = !1, x = !1) => {
      var it, ge;
      const W = ++l.current;
      (it = O.current) == null || it.abort();
      const D = new AbortController();
      O.current = D, h = Ze(h);
      const te = Number(h.page);
      k && (h = { ...h, page: 1 }), yr(h), tr(k), dr(!0), Gt("");
      try {
        const Ie = (Yt) => Fe(c) === "tag" ? ko(
          c,
          Yt,
          D.signal
        ) : _r(
          c,
          Yt,
          D.signal
        );
        let Xe = await Ie(h);
        const Ht = Math.max(
          1,
          Math.ceil(Xe.totalCount / Number(h.perPage))
        ), Er = k ? Ht : Math.min(te, Ht);
        return Number(h.page) !== Er && (h = { ...h, page: Er }, Xe = await Ie(h)), W === l.current && (((ge = j.current) == null ? void 0 : ge.page) !== Er && (j.current = {
          page: Er,
          ids: new Set(Xe.items.map((Yt) => Yt.id))
        }), Qe(Xe), x && yt(
          () => new Set(Xe.items.map((Yt) => Yt.id))
        ), yr(h), Rr(h)), Xe;
      } catch (Ie) {
        throw W === l.current && Gt(
          Ie instanceof Error ? Ie.message : "Could not load the review queue."
        ), Ie;
      } finally {
        W === l.current && dr(!1);
      }
    },
    []
  );
  J(() => {
    var h;
    if (m.current += 1, Ct.current = -1, l.current += 1, (h = O.current) == null || h.abort(), oe(!1), _(""), P(!1), Be(/* @__PURE__ */ new Set()), gt.current.clear(), le(null), Jt(!1), Ft(!1), rr.current = !1, Or(""), zt(""), nr(""), Qe({ items: [], totalCount: 0 }), j.current = null, Nt(!1), !N || Ce) {
      dr(!1);
      return;
    }
    let c = !0;
    return dr(!0), (async () => {
      let k = ee ?? N;
      Je(null);
      let x = null;
      const W = new URLSearchParams(window.location.search);
      if (Fe(N) === "video" && gn.some((ge) => W.has(ge)))
        try {
          const ge = k;
          x = jn(ge, W);
          const Ie = Dt(ge, x.query);
          (x.query.startFrom !== (ge.view.startFrom ?? "end") || !Kr(
            JSON.parse(_t(Ie)),
            JSON.parse(_t(Dt(ge, kr(ge))))
          )) && (k = Ie, Je(k));
        } catch (ge) {
          Nt(!0), Gt(ge instanceof Error ? ge.message : "Could not read review URL."), dr(!1);
          return;
        }
      let D = null;
      try {
        D = await Oa(i, N.id);
      } catch (ge) {
        c && (P(!0), _(
          ge instanceof Error ? ge.message : "Could not load progress."
        ));
      }
      if (!c) return;
      const te = (D == null ? void 0 : D.signature) === _t(k) ? D : null, it = x ? x.query.filter : te ? Ze(te.filter) : Bs(k.view.filter);
      yr(it), ht(
        te ? _o(te.displayMode, Fe(N)) : Lo(N)
      ), nt(
        te ? te.cardSize ?? Nn : Nn
      );
      try {
        const ge = await ke(
          k,
          it,
          x ? x.startAtEnd : !te && k.view.startFrom !== "beginning",
          k.view.selectAllOnLoad === !0
        );
        if (!c) return;
        const Ie = So(
          ge.items.map((Xe) => Xe.id),
          (te == null ? void 0 : te.focusedId) ?? null,
          (te == null ? void 0 : te.index) ?? 0
        );
        le(Ie), Re(Ie);
      } catch {
      }
      c && (Ct.current = je, oe(!0));
    })(), () => {
      var k;
      c = !1, m.current++, l.current++, (k = O.current) == null || k.abort();
    };
  }, [N == null ? void 0 : N.id, Ce, je]), J(() => {
    !G || Ce || !A || Z || De || ie || Et.current || Ct.current !== je || Dr(G.id, {
      filter: pe,
      objectFilter: G.view.objectFilter,
      searchMode: G.view.searchMode,
      startFrom: G.view.startFrom ?? "end"
    });
  }, [G, Ce, A, Z, De, pe, ie, je]);
  const se = at(
    () => _e.items.map((c) => c.id),
    [_e.items]
  );
  J(() => {
    if (!A || !N || !i || Z || De || ie || (ne == null ? void 0 : ne.id) === N.id || X)
      return;
    const c = {
      version: 1,
      signature: _t(N),
      filter: pe,
      focusedId: xe,
      index: Math.max(0, se.indexOf(xe ?? -1)),
      displayMode: Qt,
      cardSize: Pt,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + N.id,
        JSON.stringify(c)
      );
    } catch {
    }
    if (I) return;
    let h = !0;
    const k = window.setTimeout(() => {
      Ma(i, N.id, c).catch((x) => {
        h && _(
          "Progress is kept in this browser, but account sync failed. " + (x instanceof Error ? x.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      h = !1, window.clearTimeout(k);
    };
  }, [
    A,
    i,
    N,
    Z,
    De,
    ie,
    pe,
    xe,
    se,
    Qt,
    Pt,
    ne,
    I,
    X
  ]);
  const Ee = _e.items.find((c) => c.id === xe) ?? null, bt = U === "video" ? Ee : null;
  We && bt && (Ir.current = bt);
  const Lt = bt ?? (We ? Ir.current : null), mn = Co(ze, xe), zr = se.length > 0 && se.every((c) => ze.has(c)), Pr = ze.size > 0 ? `${ze.size} selected ${U}${ze.size === 1 ? "" : "s"}` : xe == null ? `no ${U}` : `focused ${U}`, Re = ar((c, h = !0) => {
    c != null && window.requestAnimationFrame(() => {
      const k = Pe.current.get(c);
      k == null || k.focus({ preventScroll: !0 }), h && (k == null || k.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  J(() => {
    A && !He.current && Re(Ne.current);
  }, [A, Re]), J(() => {
    Z || !se.length || (Ne.current == null || !se.includes(Ne.current)) && (le(se[0]), He.current || Re(se[0]));
  }, [Re, se, Z]);
  const yt = ar(
    (c) => {
      Be((h) => {
        const k = c(h);
        for (const x of /* @__PURE__ */ new Set([...h, ...k]))
          h.has(x) !== k.has(x) && gt.current.set(
            x,
            (gt.current.get(x) ?? 0) + 1
          );
        return k;
      });
    },
    []
  ), Ge = ar(
    (c) => {
      if (!se.length) return;
      const h = Math.max(
        0,
        se.indexOf(Ne.current ?? se[0])
      ), k = se[Math.max(0, Math.min(se.length - 1, h + c))];
      le(k), He.current || Re(k);
    },
    [Re, se]
  ), gr = ar(
    async (c) => {
      const h = "steps" in c ? c.steps.length > 0 : c.effect.mode !== "SKIP", k = "effect" in c && c.effect.mode === "SET_TAG_GROUP" ? c.effect.tagGroupId : null, x = k != null && (!y || !F.some((qe) => qe.id === k)), W = "effect" in c && h && !y, D = Co(
        ur.current,
        Ne.current
      );
      if (!N || rr.current || Z || De) return;
      const te = h && !B ? `${q} write permission is required to apply ${c.label}.` : W || x ? `${c.label} needs a tag group that is unavailable.` : Ut(c) && (ye == null ? void 0 : ye.kind) !== "ready" ? `Set up tag assessments before applying ${c.label}.` : D.length ? "" : `Select or focus a ${U} before applying ${c.label}.`;
      if (te) {
        nr(te);
        return;
      }
      const it = ++m.current, ge = N.id, Ie = [...se], Xe = _e, Ht = Ne.current, Er = new Set(ur.current), Yt = new Map(
        D.map((qe) => [qe, gt.current.get(qe) ?? 0])
      ), Nr = () => it === m.current && N.id === ge;
      rr.current = !0, Ft(!0), Or(
        ur.current.size ? `${D.length} selected ${U}s` : `the focused ${U}`
      ), zt(""), nr("");
      const bo = Xe.items.filter(
        (qe) => !D.includes(qe.id)
      ), Xi = bo.map((qe) => qe.id), yo = Eo(
        Ie,
        Xi,
        Ht,
        D.includes(Ht ?? -1)
      );
      Qe({
        items: bo,
        totalCount: Xe.totalCount
      }), Be((qe) => {
        const dt = new Set(qe);
        for (const kt of D) dt.delete(kt);
        return dt;
      }), le(yo), He.current || Re(yo);
      let yn = !1;
      try {
        if ("effect" in c ? await Wa(c, D) : await wi(Me, c, D), yn = !0, !Nr()) return;
        Be((qe) => {
          const dt = new Set(qe);
          for (const kt of D)
            (gt.current.get(kt) ?? 0) === Yt.get(kt) && dt.delete(kt);
          return dt;
        }), zt(
          `${c.label}: ${D.length} ${U}${D.length === 1 ? "" : "s"} ${h ? "updated" : "skipped"}.`
        );
      } catch (qe) {
        if (!Nr()) return;
        Qe(Xe), Be((dt) => {
          const kt = new Set(dt);
          for (const wt of D)
            Er.has(wt) && (gt.current.get(wt) ?? 0) === Yt.get(wt) && kt.add(wt);
          return kt;
        }), le(Ht), He.current || Re(Ht), nr(
          qe instanceof Error ? qe.message : "Action failed."
        );
      }
      try {
        if (await Ka(c), !Nr()) return;
        const qe = new Set(D), dt = Vt && Ie.length > 0 && Ie.every((qt) => qe.has(qt)), kt = await ke(N, pe, !1, dt);
        if (!Nr()) return;
        let wt = kt.items.map((qt) => qt.id);
        const Hr = j.current, Zi = (Hr == null ? void 0 : Hr.page) === Number(pe.page) && wt.some((qt) => Hr.ids.has(qt)), ea = (N.view.startFrom ?? "end") !== "beginning";
        if (kt.totalCount > 0 && Number(pe.page) > 1 && (!wt.length || ea && !Zi)) {
          const qt = Math.max(1, Number(pe.page) - 1), Yr = { ...pe, page: qt };
          yr(Yr), wt = (await ke(
            N,
            Yr,
            !1,
            dt
          )).items.map((wn) => wn.id), Be(
            (wn) => new Set([...wn].filter((ta) => wt.includes(ta)))
          );
          const vo = wt.at(-1) ?? null;
          le(vo), He.current || Re(vo);
        } else {
          Be(
            (Yr) => new Set([...Yr].filter((wo) => wt.includes(wo)))
          );
          const qt = Eo(
            Ie,
            wt,
            Ht,
            yn && D.includes(Ht ?? -1)
          );
          le(qt), He.current && qt == null && Jt(!1), He.current || Re(qt);
        }
      } catch (qe) {
        Nr() && nr(
          (dt) => `${dt ? `${dt} ` : ""}${yn ? "The action completed, but " : ""}the queue could not be refreshed. ${qe instanceof Error ? qe.message : "Refresh failed."}`
        );
      } finally {
        Nr() && (rr.current = !1, Ft(!1), Or(""), Et.current && (Et.current = !1, ue(An()), rt((qe) => qe + 1)));
      }
    },
    [
      B,
      y,
      F,
      U,
      ye,
      ke,
      pe,
      Re,
      se,
      _e,
      Z,
      De,
      N
    ]
  );
  function Vi() {
    var k;
    if (Qt === "list") return 1;
    const c = (k = Qr.current) == null ? void 0 : k.firstElementChild, h = c ? getComputedStyle(c).gridTemplateColumns : "";
    return Math.max(1, h.split(" ").filter(Boolean).length);
  }
  const po = L(() => {
  });
  po.current = (c) => {
    var D;
    if (Ce || c.defaultPrevented || c.repeat || c.ctrlKey || c.altKey || c.metaKey || Te) return;
    const h = c.target, k = h instanceof Node && ((D = $r.current) == null ? void 0 : D.contains(h)) === !0, x = h === document.body || h === document.documentElement;
    if (!k && !x) return;
    if (Mt) {
      c.key === "Escape" && (jt(c), $t(!1));
      return;
    }
    if (We && c.key === "Escape") {
      jt(c), Jt(!1), Re(Ne.current);
      return;
    }
    if (!Ca(h)) return;
    const W = Sa(h);
    if (c.key === "Escape") {
      jt(c), yt(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!We && c.key === " " && W) {
      jt(c), xe != null && yt((te) => Zr(te, xe));
      return;
    }
    if (!(ie || Z) && !We && c.key === "Enter" && xe != null && W) {
      jt(c), U === "tag" ? window.open(`/tag/${xe}`, "_blank", "noopener,noreferrer") : Jt(!0);
      return;
    }
  }, J(() => {
    const c = (h) => po.current(h);
    return document.addEventListener("keydown", c), () => document.removeEventListener("keydown", c);
  }, []);
  const go = L(
    () => {
    }
  );
  go.current = (c) => {
    var D;
    if (Ce || Te || We || Mt || ie || Z || !se.length || c.defaultPrevented || c.repeat || c.ctrlKey || c.altKey || c.metaKey)
      return;
    const h = c.target, k = h instanceof Node && ((D = $r.current) == null ? void 0 : D.contains(h)) === !0, x = h === document.body || h === document.documentElement;
    if (!k && !x || !c.key.startsWith("Arrow") || !Ea(h)) return;
    const W = Na(c.key, Vi());
    W && (c.preventDefault(), k ? c.stopImmediatePropagation() : c.stopPropagation(), Ge(W));
  }, J(() => {
    const c = (h) => go.current(h);
    return document.addEventListener("keydown", c), () => document.removeEventListener("keydown", c);
  }, []);
  const At = Vr();
  Zn({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!N && !Ce && !Te && !We && !Mt && !De && (_e.items.length > 0 || Z || ie),
    actionCount: (N == null ? void 0 : N.actions.length) ?? 0,
    onAction: (c) => {
      const h = N == null ? void 0 : N.actions[c];
      h && gr(h);
    },
    onFind: () => $t(!0),
    onSelectAll: () => yt((c) => No(c, se))
  }), J(() => $t(!1), [Ce, We, N == null ? void 0 : N.id]);
  function ho(c) {
    const h = "steps" in c ? c.steps.length > 0 : c.effect.mode !== "SKIP", k = "effect" in c && c.effect.mode === "SET_TAG_GROUP" ? c.effect.tagGroupId : null, x = k != null && !F.some((W) => W.id === k);
    return ie || Z || !!De || h && !B || "effect" in c && h && (!y || x) || Ut(c) && (ye == null ? void 0 : ye.kind) !== "ready" || !mn.length;
  }
  function Fr(c) {
    pt(null), st(0), ue(c), Do(c);
  }
  function Ji() {
    Ve.current = !0, ae({}), Fr("");
  }
  async function bn(c) {
    if (!i) return !1;
    const h = c.map(Ws);
    try {
      await Ia(i, h);
    } catch (x) {
      throw x;
    }
    r(h), K && !h.some((x) => x.id === K) && Fr("");
    const k = h.find((x) => x.id === K);
    return k && pt(null), k && ee && JSON.stringify(k) !== JSON.stringify(ee) && (k.view.displayMode !== ee.view.displayMode && ht(Lo(k)), _t(k) !== _t(ee) && (Je(null), Fe(k) === "video" && Dr(k.id, {
      filter: Ze(k.view.filter),
      objectFilter: k.view.objectFilter,
      searchMode: k.view.searchMode,
      startFrom: k.view.startFrom ?? "end"
    }), Ce || Wr(
      k,
      Ze({ ...k.view.filter, page: pe.page })
    ))), !0;
  }
  if (a)
    return /* @__PURE__ */ n(jo, { label: "Loading reviews…" });
  if (u)
    return /* @__PURE__ */ d(we, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void oc().catch(
            (c) => p(
              "Could not export browser reviews. " + (c instanceof Error ? c.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        Uo,
        {
          message: u,
          onRetry: () => void Wt()
        }
      )
    ] });
  return /* @__PURE__ */ d("div", { ref: $r, className: "data-quality-page", children: [
    /* @__PURE__ */ d("header", { className: "data-quality-header", children: [
      N && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: ie,
          onClick: Ji,
          children: /* @__PURE__ */ n(Yo, {})
        }
      ),
      /* @__PURE__ */ d("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (N == null ? void 0 : N.name) ?? "Data Quality" }),
        (N == null ? void 0 : N.description) && /* @__PURE__ */ n("p", { className: "dq-header-description", children: N.description })
      ] }),
      N && ee && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: ie || Z || !E,
          onClick: () => {
            Ce ? st((c) => c + 1) : (It(!0), Oe(!0));
          },
          children: /* @__PURE__ */ n(Xo, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: ie || Z || !E,
          onClick: () => {
            It(!1), Oe(!0);
          },
          children: /* @__PURE__ */ n(da, {})
        }
      )
    ] }),
    $ && /* @__PURE__ */ n("p", { className: "dq-status", children: $ }),
    lr && (ye == null ? void 0 : ye.kind) === "missing" && /* @__PURE__ */ d("div", { role: "status", className: "dq-status", children: [
      ye.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: or,
          onClick: () => {
            ir(!0), lt(""), (Ot ? Va(Me) : Ga(Me)).then(Ye).catch(
              (c) => lt(
                `Could not create the ${Ot ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (c instanceof Error ? c.message : "Request failed.")
              )
            ).finally(() => ir(!1));
          },
          children: or ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    lr && ((ye == null ? void 0 : ye.kind) === "incompatible" || he) && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(Tn, {}),
      he || (ye == null ? void 0 : ye.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: or,
          onClick: () => {
            ir(!0), Ye().finally(
              () => ir(!1)
            );
          },
          children: or ? "Checking…" : "Check again"
        }
      )
    ] }),
    N && At.allUnbound(N.actions.length) && /* @__PURE__ */ n("p", { role: "status", className: "dq-status", children: "Your keyboard preset has no keys for Data Quality actions, so pressing a letter does nothing. Assign them under Settings → Keyboard shortcuts → Data Quality, or switch to the Cove Native preset." }),
    o && /* @__PURE__ */ d("details", { children: [
      /* @__PURE__ */ n("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ n("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const c = localStorage.getItem("page-videos") ?? "[]", h = URL.createObjectURL(
              new Blob([c], { type: "application/json" })
            ), k = document.createElement("a");
            k.href = h, k.download = "data-quality-unassigned-legacy-reviews.json", k.click(), URL.revokeObjectURL(h);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    I && /* @__PURE__ */ d("p", { role: "alert", children: [
      I,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            _(""), P(!1);
          },
          children: X ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    G && /* @__PURE__ */ d("label", { className: "dq-layout-control", children: [
      "Review layout",
      /* @__PURE__ */ d(
        "select",
        {
          "aria-label": "Review layout",
          value: tt,
          disabled: ie || Z || Te,
          onChange: (c) => pt({ id: G.id, mode: c.target.value }),
          children: [
            /* @__PURE__ */ n("option", { value: "single", children: "Single video" }),
            /* @__PURE__ */ n("option", { value: "multiple", children: "Multiple videos" })
          ]
        }
      )
    ] }),
    N && ee && !Ce && /* @__PURE__ */ d("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${ie || Z ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": ie || Z || void 0,
          inert: ie || Z ? !0 : void 0,
          children: /* @__PURE__ */ n(
            jr,
            {
              filter: De ? er : pe,
              onFilterChange: Qi,
              totalCount: _e.totalCount,
              sortOptions: U === "tag" ? Qo : Vn,
              showSearch: !0,
              showSort: !0,
              displayMode: Qt,
              onDisplayModeChange: (c) => ht(_o(c, U)),
              availableDisplayModes: U === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (Pt - 225) / 50,
              onZoomChange: (c) => nt(Math.round(225 + c * 50)),
              cardSizeEntityType: U === "tag" ? "tags" : "videos",
              criteriaDefinitions: U === "tag" ? zo : dn,
              customFieldEntityType: U === "video" ? "video" : void 0,
              objectFilter: ot,
              onObjectFilterChange: (c) => {
                !ie && !Z && (Ue.current = U === "video" ? qi(
                  c,
                  Cr,
                  N.view.objectFilter
                ) : c);
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (ne == null ? void 0 : ne.id) === K && /* @__PURE__ */ d("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: ie || Z || !E,
            onClick: Wi,
            children: /* @__PURE__ */ n(Jn, {})
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Reset to default review filters",
            title: "Reset to default review filters",
            disabled: ie || Z,
            onClick: zi,
            children: /* @__PURE__ */ n(Ho, {})
          }
        )
      ] })
    ] }),
    N ? Ce ? /* @__PURE__ */ n(Ls, { review: N, canWrite: ct ? b : Bt, canAssess: (ye == null ? void 0 : ye.kind) === "ready" && Bt, onBusy: Ft, editRequest: fe, renderRuleEditor: (c, h, k) => /* @__PURE__ */ n(Bi, { workspace: !0, draft: c, entityTypeLocked: !0, tagGroups: F, saving: k, setDraft: (x) => h(x), onSave: () => {
    }, onCancel: () => {
    } }), onSaveDefaults: E ? (c) => bn(t.map((h) => h.id === c.id ? c : h)) : void 0 }, N.id) : /* @__PURE__ */ d(we, { children: [
      G && Ke.error && /* @__PURE__ */ n("p", { role: "alert", children: Ke.error }),
      G && /* @__PURE__ */ n(
        js,
        {
          videos: _e.items,
          review: G,
          trees: Ke.ids,
          disabled: ie || Z,
          onChoose: (c) => {
            const h = Us(G, c);
            Je(h), Wr(h, { ...pe, page: 1 });
          }
        }
      ),
      Sr && !We && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(Tn, {}),
        Sr
      ] }),
      vr && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: vr }),
      mo("top"),
      /* @__PURE__ */ d(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${mt}px`
          },
          children: [
            /* @__PURE__ */ d("main", { children: [
              Z && !_e.items.length && /* @__PURE__ */ n(jo, { label: "Loading review queue…" }),
              De && !Z && /* @__PURE__ */ n(
                Uo,
                {
                  message: De,
                  retryLabel: wr ? "Reset to review defaults" : "Retry",
                  onRetry: () => {
                    if (wr && ee && Fe(ee) === "video") {
                      const c = kr(ee);
                      Dr(ee.id, { ...c, filter: { ...c.filter, page: void 0 } }), rt((h) => h + 1);
                      return;
                    }
                    ke(
                      N,
                      pe,
                      hn,
                      Vt
                    ).catch(() => {
                    });
                  }
                }
              ),
              !ie && !Z && !De && !_e.items.length && /* @__PURE__ */ d("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(Rn, {}),
                /* @__PURE__ */ d("p", { children: [
                  "No ",
                  U,
                  "s match this review."
                ] })
              ] }),
              !!_e.items.length && /* @__PURE__ */ n("div", { ref: Qr, children: /* @__PURE__ */ n(
                "div",
                {
                  className: Qt === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${Pt}px`
                  },
                  children: _e.items.map(Yi)
                }
              ) })
            ] }),
            /* @__PURE__ */ n(
              "div",
              {
                className: "dq-workspace-separator",
                role: "separator",
                tabIndex: 0,
                "aria-label": "Resize review sidebar",
                "aria-orientation": "vertical",
                "aria-valuemin": Un,
                "aria-valuemax": Kn,
                "aria-valuenow": mt,
                "aria-valuetext": `${mt} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (c) => {
                  pr.current = {
                    pointerId: c.pointerId,
                    startX: c.clientX,
                    startWidth: mt
                  }, c.currentTarget.setPointerCapture(c.pointerId);
                },
                onPointerMove: (c) => {
                  const h = pr.current;
                  (h == null ? void 0 : h.pointerId) === c.pointerId && c.currentTarget.hasPointerCapture(c.pointerId) && H(
                    h.startWidth + h.startX - c.clientX
                  );
                },
                onPointerUp: () => {
                  pr.current = null;
                },
                onPointerCancel: () => {
                  pr.current = null;
                },
                onKeyDown: Ae,
                onDoubleClick: () => H(fo),
                children: /* @__PURE__ */ n("span", {})
              }
            ),
            /* @__PURE__ */ d("aside", { className: "dq-actions", children: [
              /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  className: "dq-selection-toggle",
                  "aria-keyshortcuts": At.selectAll === Ai ? "Control+A Meta+A" : At.selectAll || void 0,
                  disabled: !se.length,
                  onClick: () => yt(
                    (c) => No(c, se)
                  ),
                  children: [
                    zr ? "Clear selection" : "Select all on page",
                    At.selectAll && /* @__PURE__ */ n("kbd", { "aria-hidden": "true", children: At.selectAll })
                  ]
                }
              ),
              /* @__PURE__ */ n("strong", { children: ze.size > 0 ? Pr : xe == null ? "Nothing to apply to" : `Applies to the ${Pr}` }),
              N.actions.map((c, h) => {
                const k = "effect" in c && c.effect.mode === "SET_TAG_GROUP" ? c.effect.tagGroupId : null, x = k != null ? F.find((W) => W.id === k) : void 0;
                return /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    disabled: ho(c),
                    onClick: () => void gr(c),
                    children: [
                      /* @__PURE__ */ d("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: c.label }),
                        "effect" in c ? /* @__PURE__ */ n("small", { children: c.effect.mode === "SKIP" ? "Skip" : c.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : x ? `Assign ${x.name}` : "Unavailable tag group" }) : c.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: c.steps.flatMap(
                          (W, D) => W.tagIds.map((te, it) => {
                            const ge = z[te] === void 0 ? "Tag" : z[te] ?? "Unavailable tag", Ie = Ki(W, ge), Xe = Js(W, ge);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": Ui(W.mode),
                                "aria-label": Xe,
                                title: `Step ${D + 1}: ${Xe}`,
                                children: Ie
                              },
                              `${D}-${te}-${it}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      At.action(h) && /* @__PURE__ */ n("kbd", { children: At.action(h) })
                    ]
                  },
                  c.id
                );
              }),
              !N.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              N.actions.length > 0 && /* @__PURE__ */ n(ro, { onClick: () => $t(!0) }),
              !B && /* @__PURE__ */ d("p", { children: [
                q,
                " write permission is required to apply actions."
              ] }),
              U === "tag" && Y && /* @__PURE__ */ d("p", { children: [
                "Tag groups are unavailable. ",
                Y
              ] }),
              ie && /* @__PURE__ */ d("p", { role: "status", children: [
                /* @__PURE__ */ n(ei, { className: "dq-spin" }),
                " Applying action to",
                " ",
                xt,
                "…"
              ] }),
              /* @__PURE__ */ n("p", { className: "dq-shortcuts", children: [
                "←→↑↓ move",
                "space select",
                `enter ${U === "tag" ? "open" : "preview"}`,
                "action keys apply",
                At.find && `${At.find} find action`,
                At.selectAll && `${At.selectAll} toggle shown`,
                "Esc clear"
              ].filter(Boolean).join(" · ") })
            ] })
          ]
        }
      ),
      mo("bottom")
    ] }) : t.length ? /* @__PURE__ */ d(
      "section",
      {
        className: "dq-review-browser",
        "aria-labelledby": "dq-reviews-title",
        children: [
          /* @__PURE__ */ d("div", { className: "dq-review-browser-heading", children: [
            /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ n(
                "h2",
                {
                  id: "dq-reviews-title",
                  ref: $e,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ n("p", { children: "Choose a review to open its queue." }),
              /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                (c) => ve[c.id] !== void 0
              ) ? t.some((c) => ve[c.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ d("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ d("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ d(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: Se,
                    onChange: (c) => Kt(
                      c.target.value
                    ),
                    children: [
                      /* @__PURE__ */ n("option", { value: "name", children: "Name" }),
                      /* @__PURE__ */ n("option", { value: "count", children: "Item count" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  "aria-label": ut === "asc" ? "Ascending" : "Descending",
                  title: ut === "asc" ? "Ascending" : "Descending",
                  onClick: () => Zt(
                    (c) => c === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    Zo,
                    {
                      className: ut === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: be.map((c) => {
            const h = ve[c.id], k = Fe(c), x = k === "tag" ? "tag" : ce(c) ? St(Lr(k)).queue : St(Lr(k)).one;
            return /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                disabled: ie,
                onClick: () => Fr(c.id),
                children: [
                  /* @__PURE__ */ d("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ d("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(Li, { entityType: k }),
                      /* @__PURE__ */ n("strong", { children: c.name })
                    ] }),
                    /* @__PURE__ */ n(
                      "span",
                      {
                        className: "dq-review-count",
                        "aria-label": h === void 0 ? `Counting matching ${x}s` : h === null ? `Matching ${x} count unavailable` : `${h.toLocaleString()} matching ${h === 1 ? x : `${x}s`}`,
                        children: h === void 0 ? "…" : h === null ? "—" : h.toLocaleString()
                      }
                    )
                  ] }),
                  c.description && /* @__PURE__ */ n("span", { className: "dq-review-rule-name", children: c.description })
                ]
              },
              c.id
            );
          }) })
        ]
      }
    ) : /* @__PURE__ */ d("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(Rn, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    We && Lt && G && /* @__PURE__ */ n(
      Zs,
      {
        video: Lt,
        review: G,
        targetLabel: Pr,
        pending: ie,
        refreshing: Z || !!De,
        error: Sr,
        canWrite: g,
        assessmentReady: (ye == null ? void 0 : ye.kind) === "ready",
        selected: ze.has(Lt.id),
        hasPrevious: se.indexOf(Lt.id) > 0,
        hasNext: se.indexOf(Lt.id) >= 0 && se.indexOf(Lt.id) < se.length - 1,
        onToggleSelected: () => yt((c) => Zr(c, Lt.id)),
        onPrevious: () => Ge(-1),
        onNext: () => Ge(1),
        onClose: () => {
          Jt(!1), Re(Ne.current);
        },
        onAction: gr,
        findOpen: Mt,
        onFindOpenChange: $t
      }
    ),
    Mt && N && !Ce && !We && /* @__PURE__ */ n(
      to,
      {
        actions: N.actions,
        tagGroups: F,
        isDisabled: ho,
        canStay: !1,
        onApply: (c) => {
          $t(!1), gr(c);
        },
        onClose: () => $t(!1)
      }
    ),
    Te && /* @__PURE__ */ n(
      ec,
      {
        reviews: t,
        activeReview: ee,
        tagGroups: F,
        initialEdit: et,
        onSave: bn,
        onChoose: Fr,
        onEditWorkspace: (c) => {
          c !== K && Fr(c), pt({ id: c, mode: "single" }), st((h) => h + 1), Oe(!1);
        },
        onClose: () => {
          Oe(!1), et && Re(Ne.current, !1);
        }
      }
    )
  ] });
  async function Wr(c, h, k = !1) {
    const x = Ne.current, W = Math.max(0, se.indexOf(x ?? -1));
    try {
      const te = (await ke(
        c,
        h,
        k,
        c.view.selectAllOnLoad === !0
      )).items.map((ge) => ge.id);
      Be(
        (ge) => new Set([...ge].filter((Ie) => te.includes(Ie)))
      );
      const it = So(te, x, W);
      le(it), He.current || Re(it, !1);
    } catch {
    }
  }
  function Qi(c) {
    const h = Ue.current;
    if (Ue.current = null, ie || Z || !N || !ee) return;
    const k = h ?? N.view.objectFilter, x = Kr(
      k,
      ee.view.objectFilter
    ) ? ee.view.objectFilter : k, W = Ze({ ...c, page: 1 }), D = {
      ...N,
      view: {
        ...N.view,
        filter: W,
        objectFilter: x
      }
    }, te = _t(D) !== _t(ee), it = te ? D : ee;
    Je(te ? D : null), zt(te ? "" : "Review queue defaults restored."), Wr(it, W, !0);
  }
  function zi() {
    if (ie || Z || !ee) return;
    Ue.current = null;
    const c = Ze({
      ...ee.view.filter,
      page: 1
    });
    Je(null), zt("Review queue defaults restored."), Wr(
      ee,
      c,
      ee.view.startFrom !== "beginning"
    );
  }
  function Wi() {
    ie || Z || !N || !ee || !E || bn(
      t.map(
        (c) => c.id === K ? {
          ...c,
          view: {
            ...N.view,
            filter: { ...pe, page: 1 }
          }
        } : c
      )
    ).then(() => {
      Je(null), zt("Queue saved to this review.");
    }).catch(
      (c) => nr(
        c instanceof Error ? c.message : "Could not save queue."
      )
    );
  }
  function Hi() {
    Be(/* @__PURE__ */ new Set()), gt.current.clear(), le(null);
  }
  function mo(c) {
    return N ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: ie || Z,
        "aria-label": `Review queue pagination ${c}`,
        children: /* @__PURE__ */ n(
          Vo,
          {
            filter: {
              ...pe,
              page: Number(pe.page) || 1,
              perPage: Number(pe.perPage) || 40
            },
            totalCount: _e.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${c}`,
            onFilterChange: (h) => {
              ie || Z || h.page === Number(pe.page) || zs(
                { ...pe, page: h.page },
                N,
                (k, x) => ke(k, x, !1, Vt),
                Hi
              );
            }
          }
        )
      }
    ) : null;
  }
  function Yi(c) {
    var k, x, W;
    if (U === "tag") {
      const D = c;
      return /* @__PURE__ */ n(
        Hs,
        {
          tag: D,
          displayMode: Qt === "list" ? "list" : "grid",
          focused: D.id === xe,
          selected: ze.has(D.id),
          setRef: (te) => {
            te ? Pe.current.set(D.id, te) : Pe.current.delete(D.id);
          },
          onFocus: () => le(D.id),
          onToggle: () => {
            yt((te) => Zr(te, D.id)), Re(D.id, !1);
          },
          onOpen: () => window.open(`/tag/${D.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        D.id
      );
    }
    const h = c;
    return /* @__PURE__ */ n(
      Ys,
      {
        video: Ds(h, G, Ke.ids),
        showTagBins: ((x = (k = G == null ? void 0 : G.presentation) == null ? void 0 : k.annotations) == null ? void 0 : x.includes("tags")) && !!((W = G.presentation.annotationParents) != null && W.length),
        displayMode: Qt,
        focused: h.id === xe,
        selected: ze.has(h.id),
        setRef: (D) => {
          D ? Pe.current.set(h.id, D) : Pe.current.delete(h.id);
        },
        onFocus: () => le(h.id),
        onToggle: () => yt((D) => Zr(D, h.id)),
        onPreview: () => {
          le(h.id), Jt(!0);
        },
        onNavigate: e
      },
      h.id
    );
  }
}
function zs(e, t, r, o) {
  o(), r(t, e).catch(() => {
  });
}
function Zr(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Ws(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Hs({
  tag: e,
  displayMode: t,
  focused: r,
  selected: o,
  setRef: i,
  onFocus: s,
  onToggle: a,
  onOpen: f,
  onNavigate: u
}) {
  return /* @__PURE__ */ n(
    "article",
    {
      ref: i,
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${e.name}${o ? ", selected" : ""}`,
      onFocus: s,
      onClick: (p) => {
        s(), p.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${o ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        ca,
        {
          tag: e,
          selected: o,
          onSelect: a,
          onClick: f,
          onNavigate: u
        }
      ) : /* @__PURE__ */ d("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "aria-label": o ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": o,
            onClick: (p) => {
              p.stopPropagation(), a();
            },
            children: o ? "✓" : ""
          }
        ),
        /* @__PURE__ */ n("button", { type: "button", className: "dq-tag-list-name", onClick: f, children: e.name }),
        /* @__PURE__ */ n("span", { children: e.tagGroupName || "Ungrouped" }),
        /* @__PURE__ */ n("span", { children: e.description || "" }),
        /* @__PURE__ */ d("span", { children: [
          e.videoCount ?? 0,
          " videos"
        ] })
      ] })
    }
  );
}
function Ys({
  video: e,
  showTagBins: t,
  displayMode: r,
  focused: o,
  selected: i,
  setRef: s,
  onFocus: a,
  onToggle: f,
  onPreview: u,
  onNavigate: p
}) {
  var M, y;
  const g = _i(e), v = L(null), S = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, w = !!(S.date || S.studioName), b = !!(S.performers.length || S.tags.length);
  return Bn(() => {
    const R = v.current;
    if (!R) return;
    const F = R.querySelector(
      `a[href="/video/${e.id}"]`
    ), V = R.querySelector(".card-title"), Y = `dq-card-title-${e.id}`;
    V && (V.id = Y), F && (F.target = "_blank", F.rel = "noreferrer", F.removeAttribute("aria-label"), F.setAttribute("aria-labelledby", Y), F.classList.add("dq-card-link"));
    const me = R.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    me && me.setAttribute(
      "aria-label",
      i ? `Deselect ${g}` : `Select ${g}`
    );
    const E = R.querySelector(
      'button[title="Quick View"]'
    );
    E && E.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ d(
    "article",
    {
      ref: (R) => {
        v.current = R, s(R);
      },
      tabIndex: 0,
      "aria-current": o ? "true" : void 0,
      "aria-label": `${g}${i ? ", selected" : ""}`,
      onFocus: a,
      onClick: (R) => {
        a(), R.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${r} ${w ? "has-card-metadata" : "no-card-metadata"} ${b ? "has-card-footer" : "no-card-footer"} ${o ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          la,
          {
            video: S,
            selected: i,
            onSelect: f,
            onNavigate: p,
            onQuickView: u,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ d("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (M = e.tags) == null ? void 0 : M.map((R) => /* @__PURE__ */ n("span", { children: R.name }, R.id)),
          !((y = e.tags) != null && y.length) && /* @__PURE__ */ n("small", { children: "No matching tags" })
        ] }),
        r === "wall" && /* @__PURE__ */ n(Xs, { video: e })
      ]
    }
  );
}
function Xs({ video: e }) {
  const t = L(null), r = L(null), [o, i] = C(!1), [s, a] = C(!1), [f, u] = C(!1);
  return J(() => {
    const p = t.current;
    if (!p || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      i(!0), a(!0);
      return;
    }
    const g = new IntersectionObserver(
      ([S]) => i(S.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), v = new IntersectionObserver(
      ([S]) => a(S.isIntersecting && S.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return g.observe(p), v.observe(p), () => {
      g.disconnect(), v.disconnect();
    };
  }, [e.id, e.files.length]), J(() => {
    if (!o) {
      u(!1);
      return;
    }
    const p = new AbortController();
    return Q(Ua(e.id), {
      signal: p.signal
    }).then((g) => {
      p.signal.aborted || u(g.available === !0);
    }).catch(() => {
      p.signal.aborted || u(!1);
    }), () => p.abort();
  }, [o, e.id]), J(() => {
    const p = r.current;
    p && (s ? Promise.resolve(p.play()).catch(() => {
    }) : p.pause());
  }, [f, s]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: f && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: ja(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Zs({
  video: e,
  review: t,
  targetLabel: r,
  pending: o,
  refreshing: i,
  error: s,
  canWrite: a,
  assessmentReady: f,
  selected: u,
  hasPrevious: p,
  hasNext: g,
  onToggleSelected: v,
  onPrevious: S,
  onNext: w,
  onClose: b,
  onAction: M,
  findOpen: y,
  onFindOpenChange: R
}) {
  const F = L(null), V = L(null), Y = e.files[0], me = _i(e), E = Vr(), T = (I) => o || i || "steps" in I && I.steps.length > 0 && !a || Ut(I) && !f;
  Zn({
    surface: "overlay",
    enabled: !y,
    actionCount: t.actions.length,
    onAction: (I) => {
      const _ = t.actions[I];
      _ && M(_);
    },
    onFind: () => R(!0)
  }), J(() => {
    var _;
    const I = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (_ = F.current) == null || _.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = I;
    };
  }, []);
  function $(I) {
    var P, A, oe;
    if (I.key !== "Tab") return;
    const _ = [
      ...((P = F.current) == null ? void 0 : P.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((K) => K.offsetParent !== null);
    if (!_.length) {
      I.preventDefault(), (A = F.current) == null || A.focus();
      return;
    }
    const X = _.indexOf(
      document.activeElement
    );
    I.shiftKey && X <= 0 ? (I.preventDefault(), (oe = _.at(-1)) == null || oe.focus()) : !I.shiftKey && X === _.length - 1 && (I.preventDefault(), _[0].focus());
  }
  function re(I) {
    if (y || I.defaultPrevented || I.ctrlKey || I.metaKey || I.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const _ = I.key === "ArrowLeft" || I.key === "ArrowRight";
    if (I.altKey && !_) return;
    const X = V.current, P = I.currentTarget.querySelector("video");
    if (I.key === "Enter" || I.key === "Escape")
      I.repeat || b();
    else if (I.key === " " && X)
      I.repeat || X.toggle();
    else if (_ && X)
      X.seekBy(
        (I.key === "ArrowLeft" ? -1 : 1) * (I.shiftKey ? 5 : I.altKey ? 10 : 60)
      );
    else if ((I.key === "," || I.key === ".") && X) {
      const A = [Y == null ? void 0 : Y.duration, P == null ? void 0 : P.duration].find(
        (K) => K != null && Number.isFinite(K) && K > 0
      ) ?? 0, oe = e.parentVideoId != null ? (e.clipEndSec ?? A) - (e.clipStartSec ?? 0) : A;
      Number.isFinite(oe) && oe > 0 && X.seekBy((I.key === "," ? -1 : 1) * oe * 0.1);
    } else if (I.key.toLowerCase() === "n" || I.key.toLowerCase() === "m")
      !I.repeat && !o && !i && (I.key.toLowerCase() === "n" && p && S(), I.key.toLowerCase() === "m" && g && w());
    else if (I.key === "ArrowUp" && P)
      P.volume = Math.min(1, P.volume + 0.1);
    else if (I.key === "ArrowDown" && P)
      P.volume = Math.max(0, P.volume - 0.1);
    else return;
    jt(I);
  }
  return /* @__PURE__ */ d(
    "div",
    {
      ref: F,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${me}`,
      className: "dq-preview",
      onKeyDown: $,
      onKeyDownCapture: re,
      onMouseDown: (I) => {
        I.target === I.currentTarget && b();
      },
      children: [
        /* @__PURE__ */ d("div", { className: "dq-preview-shell", children: [
          /* @__PURE__ */ d("header", { "data-review-player-controls": !0, children: [
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": "Previous review video",
                disabled: !p || o || i,
                onClick: S,
                children: /* @__PURE__ */ n(Yo, {})
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": "Next review video",
                disabled: !g || o || i,
                onClick: w,
                children: /* @__PURE__ */ n(Zo, {})
              }
            ),
            /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ n("h2", { children: me }),
              /* @__PURE__ */ d("p", { children: [
                "Actions target ",
                r,
                "."
              ] })
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: v,
                disabled: i,
                children: u ? "Selected" : "Select"
              }
            ),
            /* @__PURE__ */ n(
              "a",
              {
                href: `/video/${e.id}`,
                target: "_blank",
                rel: "noreferrer",
                className: "dq-details-link",
                "aria-label": `Open ${me} details in new tab`,
                title: "Open video details in new tab",
                children: /* @__PURE__ */ n(pa, {})
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: b,
                "aria-label": "Close review preview",
                children: /* @__PURE__ */ n(ti, {})
              }
            )
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: Y ? /* @__PURE__ */ n(
            Jo,
            {
              autostart: !0,
              streamUrl: Pn("video", e.id),
              posterUrl: To(e),
              format: Y.format,
              audioCodec: Y.audioCodec,
              duration: Y.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onPlaybackControlRegister: (I) => (V.current = I, () => {
                V.current === I && (V.current = null);
              }),
              videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ n("img", { src: To(e), alt: "" }) }),
          s && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: s }),
          /* @__PURE__ */ d("p", { className: "dq-editor-note", children: [
            "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · action keys apply",
            E.find ? ` · ${E.find} find action` : "",
            " · Enter/Esc close"
          ] }),
          /* @__PURE__ */ d("footer", { "data-review-player-controls": !0, children: [
            t.actions.length > 0 && /* @__PURE__ */ n(ro, { onClick: () => R(!0) }),
            t.actions.map((I, _) => /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                disabled: T(I),
                onClick: () => void M(I),
                children: [
                  E.action(_) && /* @__PURE__ */ n("kbd", { children: E.action(_) }),
                  I.label
                ]
              },
              I.id
            ))
          ] })
        ] }),
        y && /* @__PURE__ */ n(
          to,
          {
            actions: t.actions,
            isDisabled: T,
            canStay: !1,
            onApply: (I) => {
              R(!1), M(I);
            },
            onClose: () => R(!1)
          }
        )
      ]
    }
  );
}
function ec({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: o = !1,
  onEditWorkspace: i,
  onSave: s,
  onChoose: a,
  onClose: f
}) {
  const [u, p] = C(
    () => o && t ? structuredClone(t) : null
  ), [g, v] = C(""), [S, w] = C(!1), [b, M] = C(
    o && t != null
  ), y = L(null);
  J(() => {
    var $, re;
    const E = document.activeElement, T = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (re = ($ = y.current) == null ? void 0 : $.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || re.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = T, E == null || E.focus({ preventScroll: !0 });
    };
  }, []);
  function R(E) {
    var re, I, _;
    if (E.defaultPrevented) {
      E.stopPropagation();
      return;
    }
    if (E.key === "Escape") {
      jt(E), S || f();
      return;
    }
    if (E.key !== "Tab") {
      E.stopPropagation();
      return;
    }
    const T = [
      ...((re = y.current) == null ? void 0 : re.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((X) => X.offsetParent !== null);
    if (!T.length) {
      jt(E), (I = y.current) == null || I.focus();
      return;
    }
    const $ = T.indexOf(
      document.activeElement
    );
    E.shiftKey && $ <= 0 ? (jt(E), (_ = T.at(-1)) == null || _.focus()) : !E.shiftKey && $ === T.length - 1 ? (jt(E), T[0].focus()) : E.stopPropagation();
  }
  function F(E, T = !!E) {
    M(T), p(
      E ? structuredClone(E) : {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        entityType: "video",
        view: {
          filter: {
            page: 1,
            perPage: 40,
            sort: "date",
            direction: "desc"
          },
          objectFilter: {},
          displayMode: "grid",
          searchMode: "text",
          startFrom: "end"
        },
        actions: []
      }
    ), v("");
  }
  async function V() {
    if (S) return;
    if (!u || nn(u)) {
      v(u ? nn(u) : "Choose a review.");
      return;
    }
    const E = { ...u, name: u.name.trim() }, T = e.some(($) => $.id === E.id) ? e.map(($) => $.id === E.id ? E : $) : [...e, E];
    w(!0), v("");
    try {
      if (!await s(T)) throw new Error("Could not save reviews.");
      !e.some(($) => $.id === E.id) && E.entityType !== "tag" ? i(E.id) : (a(E.id), f());
    } catch ($) {
      v(
        "Could not save reviews. Your edits are still open. " + ($ instanceof Error ? $.message : "Retry saving.")
      );
    } finally {
      w(!1);
    }
  }
  async function Y(E) {
    if (!S) {
      w(!0), v("");
      try {
        if (!await s(E)) throw new Error("Could not save reviews.");
      } catch (T) {
        v(
          T instanceof Error ? T.message : "Could not save reviews."
        );
      } finally {
        w(!1);
      }
    }
  }
  async function me(E) {
    var $;
    if (S) return;
    const T = ($ = E.target.files) == null ? void 0 : $[0];
    if (E.target.value = "", !!T) {
      if (T.size > 2e6) {
        v("Review files must be smaller than 2 MB.");
        return;
      }
      w(!0), v("");
      try {
        const re = Br(await T.text());
        if (!await s(In(e, re)))
          throw new Error("Could not save reviews.");
      } catch (re) {
        v(
          re instanceof Error ? re.message : "Could not import reviews."
        );
      } finally {
        w(!1);
      }
    }
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: y,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: R,
      children: /* @__PURE__ */ d("div", { className: "dq-manager", children: [
        /* @__PURE__ */ d("header", { children: [
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ n("h2", { children: u ? e.some((E) => E.id === u.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: S,
              onClick: f,
              children: /* @__PURE__ */ n(ti, {})
            }
          )
        ] }),
        g && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: g }),
        /* @__PURE__ */ n("fieldset", { disabled: S, className: "dq-manager-content", children: u ? /* @__PURE__ */ n(
          Bi,
          {
            setup: u.entityType !== "tag" && !e.some((E) => E.id === u.id),
            draft: u,
            entityTypeLocked: b,
            tagGroups: r,
            saving: S,
            setDraft: p,
            onSave: () => void V(),
            onCancel: f
          }
        ) : /* @__PURE__ */ d(we, { children: [
          /* @__PURE__ */ d("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: () => {
              const E = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), T = document.createElement("a");
              T.href = E, T.download = "data-quality-reviews.json", T.click(), URL.revokeObjectURL(E);
            }, children: "Export reviews" }),
            /* @__PURE__ */ d(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => F(),
                children: [
                  /* @__PURE__ */ n(ga, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ d("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(ha, {}),
              " Import reviews",
              /* @__PURE__ */ n(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: me
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((E) => /* @__PURE__ */ d("article", { children: [
            /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ d("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(Li, { entityType: Fe(E) }),
                /* @__PURE__ */ n("strong", { children: E.name })
              ] }),
              /* @__PURE__ */ n("p", { children: E.description || "No description" })
            ] }),
            /* @__PURE__ */ d("button", { type: "button", onClick: () => E.entityType === "tag" || Fe(E) === "video" && E.view.reviewMode === "multiple" ? F(E) : i(E.id), children: [
              /* @__PURE__ */ n(Xo, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => F({
                  ...structuredClone(E),
                  id: crypto.randomUUID(),
                  name: `${E.name} copy`
                }, !0),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${E.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${E.name}”?`) && Y(
                    e.filter((T) => T.id !== E.id)
                  );
                },
                children: /* @__PURE__ */ n(ri, {})
              }
            )
          ] }, E.id)) })
        ] }) })
      ] })
    }
  );
}
function Bi({
  workspace: e = !1,
  setup: t = !1,
  draft: r,
  entityTypeLocked: o,
  tagGroups: i,
  saving: s = !1,
  setDraft: a,
  onSave: f,
  onCancel: u
}) {
  const [p, g] = C("Review"), v = Fe(r), S = ce(r), w = (y) => {
    if (!(o || y === v)) {
      if (y === "performerOccurrence" || y === "audioPerformerOccurrence") {
        a({
          id: r.id,
          entityType: y,
          name: r.name,
          description: r.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end" },
          actions: [],
          occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: !0 }
        });
        return;
      }
      if (y === "audio") {
        a({
          id: r.id,
          entityType: "audio",
          name: r.name,
          description: r.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end", reviewMode: "single" },
          actions: []
        });
        return;
      }
      a(
        y === "tag" ? {
          id: r.id,
          entityType: "tag",
          name: r.name,
          description: r.description,
          view: {
            filter: {
              page: 1,
              perPage: 40,
              sort: "name",
              direction: "asc"
            },
            objectFilter: {
              tagGroupsCriterion: { value: [], modifier: "IS_NULL" }
            },
            displayMode: "grid",
            searchMode: "text",
            startFrom: "beginning"
          },
          actions: []
        } : {
          id: r.id,
          entityType: "video",
          name: r.name,
          description: r.description,
          view: {
            filter: {
              page: 1,
              perPage: 40,
              sort: "date",
              direction: "desc"
            },
            objectFilter: {},
            displayMode: "grid",
            searchMode: "text",
            startFrom: "end"
          },
          actions: []
        }
      );
    }
  }, b = L(/* @__PURE__ */ new WeakMap()), M = (y) => {
    let R = b.current.get(y);
    return R || (R = crypto.randomUUID(), b.current.set(y, R)), R;
  };
  return /* @__PURE__ */ d("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      sa,
      {
        tabs: (t ? ["Review"] : e ? ["Review", ...v === "video" ? ["Appearance"] : [], "Actions", ...S ? ["Tag choices"] : []] : S ? ["Review", "Queue", "Actions", ...r.occurrence.tagIds.length ? ["Tag choices"] : []] : v === "audio" ? ["Review", "Queue", "Actions"] : ["Review", "Queue", "Appearance", "Actions"]).map((y) => ({
          key: y,
          label: y,
          count: y === "Actions" ? r.actions.length : void 0,
          disabled: s
        })),
        activeTab: p,
        onTabChange: g
      }
    ) }),
    /* @__PURE__ */ d("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ d("section", { hidden: p !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ d("label", { children: [
          "Entity type",
          /* @__PURE__ */ d(
            "select",
            {
              "aria-label": "Entity type",
              value: v,
              disabled: o,
              onChange: (y) => w(y.target.value),
              children: [
                /* @__PURE__ */ n("option", { value: "video", children: "Videos" }),
                /* @__PURE__ */ n("option", { value: "audio", children: "Audios" }),
                /* @__PURE__ */ n("option", { value: "tag", children: "Tags" }),
                /* @__PURE__ */ n("option", { value: "performerOccurrence", children: "Performer occurrence tags" }),
                /* @__PURE__ */ n("option", { value: "audioPerformerOccurrence", children: "Audio performer occurrence tags" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          "Review name",
          /* @__PURE__ */ n(
            "input",
            {
              autoFocus: !0,
              "aria-label": "Review name",
              value: r.name,
              onChange: (y) => a({ ...r, name: y.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          "Description",
          /* @__PURE__ */ n(
            "textarea",
            {
              "aria-label": "Description",
              value: r.description,
              onChange: (y) => a({ ...r, description: y.target.value })
            }
          )
        ] }),
        S && !t && /* @__PURE__ */ n(
          Ha,
          {
            review: r,
            onChange: a
          }
        )
      ] }),
      !e && !t && /* @__PURE__ */ d("section", { hidden: p !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ n(xo, { draft: r, onChange: a, presentation: !1 }),
        S && /* @__PURE__ */ n(Ro, { review: r, onChange: a })
      ] }),
      !t && S && /* @__PURE__ */ n("section", { hidden: p !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n(Ro, { review: r, onChange: a, choices: !0 }) }),
      !t && v !== "audio" && !S && (!e || v === "video") && /* @__PURE__ */ n("section", { hidden: p !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(xo, { draft: r, onChange: a, queue: !1 }) }),
      !t && /* @__PURE__ */ n("section", { hidden: p !== "Actions", className: "dq-editor-section", children: v === "tag" ? /* @__PURE__ */ n(
        rc,
        {
          draft: r,
          saving: s,
          tagGroups: i,
          setDraft: a
        }
      ) : /* @__PURE__ */ n(
        tc,
        {
          draft: r,
          saving: s,
          stepKey: M,
          rememberStepKey: (y, R) => b.current.set(y, M(R)),
          setDraft: a
        }
      ) })
    ] }),
    !e && /* @__PURE__ */ d("div", { className: "dq-editor-footer", children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const y = URL.createObjectURL(
              new Blob([JSON.stringify([r], null, 2)], {
                type: "application/json"
              })
            ), R = document.createElement("a");
            R.href = y, R.download = "data-quality-review.json", R.click(), URL.revokeObjectURL(y);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: u, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: f, children: t ? "Create & configure" : "Save review" })
    ] })
  ] });
}
function Gi({
  action: e,
  onChange: t
}) {
  return /* @__PURE__ */ n("div", { className: "dq-field-grid", children: /* @__PURE__ */ d("label", { children: [
    "Button label",
    /* @__PURE__ */ n(
      "input",
      {
        value: e.label,
        onChange: (r) => t({ ...e, label: r.target.value })
      }
    )
  ] }) });
}
function tc({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: o,
  setDraft: i
}) {
  const [s, a] = C(!1), [f, u] = C(null), p = L(null), g = Ko(), v = () => {
    a(!1), requestAnimationFrame(() => {
      var w;
      return (w = p.current) == null ? void 0 : w.focus();
    });
  }, S = (w, b) => i({
    ...e,
    actions: e.actions.map(
      (M, y) => y === w ? b : M
    )
  });
  return /* @__PURE__ */ d(we, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    ce(e) && /* @__PURE__ */ d("p", { children: [
      "Actions apply only to the active performer in this ",
      St(de(e)).one,
      ". Set performer matching in the review filters below. Save review keeps those criteria with this rule."
    ] }),
    /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails. Removing tags and descendants never removes a tag the same action adds." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      qn,
      {
        items: e.actions,
        getKey: (w) => w.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (w) => i({ ...e, actions: w }),
        renderItem: (w, { index: b, dragHandleProps: M, isOver: y }) => /* @__PURE__ */ d(
          "fieldset",
          {
            className: y ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ d("legend", { children: [
                "Action ",
                b + 1
              ] }),
              /* @__PURE__ */ d("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...M,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${b + 1}`,
                    children: /* @__PURE__ */ n(Qn, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: w.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => i({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, b + 1),
                        {
                          ...structuredClone(w),
                          id: crypto.randomUUID(),
                          label: w.label + " copy"
                        },
                        ...e.actions.slice(b + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                Gi,
                {
                  action: w,
                  onChange: (R) => S(b, R)
                }
              ),
              /* @__PURE__ */ n(
                qn,
                {
                  items: w.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (R) => S(b, { ...w, steps: R }),
                  renderItem: (R, F) => /* @__PURE__ */ n(
                    nc,
                    {
                      dragHandleProps: F.dragHandleProps,
                      saving: t,
                      isOver: F.isOver,
                      step: R,
                      index: F.index,
                      onChange: (V) => {
                        o(V, R), S(b, {
                          ...w,
                          steps: w.steps.map(
                            (Y, me) => me === F.index ? V : Y
                          )
                        });
                      },
                      onRemove: () => S(b, {
                        ...w,
                        steps: w.steps.filter(
                          (V, Y) => Y !== F.index
                        )
                      })
                    }
                  )
                }
              ),
              /* @__PURE__ */ d("div", { className: "dq-row", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    className: "dq-button",
                    type: "button",
                    onClick: () => S(b, {
                      ...w,
                      steps: [...w.steps, { mode: "ADD", tagIds: [] }]
                    }),
                    children: "Add step"
                  }
                ),
                /* @__PURE__ */ n(
                  "button",
                  {
                    className: "dq-button",
                    type: "button",
                    onClick: () => i({
                      ...e,
                      actions: e.actions.filter(
                        (R, F) => F !== b
                      )
                    }),
                    children: "Remove action"
                  }
                )
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ d("div", { className: "dq-row dq-add-actions", children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => i({
            ...e,
            actions: [
              ...e.actions,
              { id: crypto.randomUUID(), label: "", steps: [] }
            ]
          }),
          children: "Add action"
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          ref: p,
          className: "dq-button",
          type: "button",
          "aria-expanded": s,
          "aria-controls": s ? g : void 0,
          disabled: t,
          onClick: () => {
            u(null), a(!s);
          },
          children: "Add actions from parent tags…"
        }
      ),
      /* @__PURE__ */ n("span", { role: "status", className: "dq-editor-note", children: (f == null ? void 0 : f.actions) === e.actions ? `Added ${f.count} action${f.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    s && /* @__PURE__ */ n(
      is,
      {
        id: g,
        review: e,
        disabled: t,
        onAdd: (w) => {
          const b = [...e.actions, ...w];
          i({ ...e, actions: b }), u({ actions: b, count: w.length }), v();
        },
        onCancel: v
      }
    )
  ] });
}
function rc({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: o
}) {
  const i = (s, a) => o({
    ...e,
    actions: e.actions.map(
      (f, u) => u === s ? a : f
    )
  });
  return /* @__PURE__ */ d(we, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      qn,
      {
        items: e.actions,
        getKey: (s) => s.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (s) => o({ ...e, actions: s }),
        renderItem: (s, { index: a, dragHandleProps: f, isOver: u }) => /* @__PURE__ */ d(
          "fieldset",
          {
            className: u ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ d("legend", { children: [
                "Action ",
                a + 1
              ] }),
              /* @__PURE__ */ d("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...f,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${a + 1}`,
                    children: /* @__PURE__ */ n(Qn, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: s.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => o({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, a + 1),
                        {
                          ...structuredClone(s),
                          id: crypto.randomUUID(),
                          label: s.label + " copy"
                        },
                        ...e.actions.slice(a + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                Gi,
                {
                  action: s,
                  onChange: (p) => i(a, p)
                }
              ),
              /* @__PURE__ */ d("label", { children: [
                "Action effect",
                /* @__PURE__ */ d(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: s.effect.mode === "SET_TAG_GROUP" ? `group:${s.effect.tagGroupId}` : s.effect.mode,
                    onChange: (p) => {
                      const g = p.target.value;
                      i(a, {
                        ...s,
                        effect: g === "SKIP" ? { mode: "SKIP" } : g === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : {
                          mode: "SET_TAG_GROUP",
                          tagGroupId: Number(g.slice(6))
                        }
                      });
                    },
                    children: [
                      /* @__PURE__ */ n("option", { value: "SKIP", children: "Skip" }),
                      /* @__PURE__ */ n("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
                      s.effect.mode === "SET_TAG_GROUP" && !r.some(
                        (p) => p.id === s.effect.tagGroupId
                      ) && /* @__PURE__ */ n(
                        "option",
                        {
                          value: `group:${s.effect.tagGroupId}`,
                          disabled: !0,
                          children: "Unavailable tag group"
                        }
                      ),
                      r.map((p) => /* @__PURE__ */ n("option", { value: `group:${p.id}`, children: p.name }, p.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                "button",
                {
                  className: "dq-button",
                  type: "button",
                  onClick: () => o({
                    ...e,
                    actions: e.actions.filter(
                      (p, g) => g !== a
                    )
                  }),
                  children: "Remove action"
                }
              )
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ n(
      "button",
      {
        className: "dq-button",
        type: "button",
        onClick: () => o({
          ...e,
          actions: [
            ...e.actions,
            {
              id: crypto.randomUUID(),
              label: "",
              effect: { mode: "SKIP" }
            }
          ]
        }),
        children: "Add action"
      }
    )
  ] });
}
function nc({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: o,
  isOver: i,
  onChange: s,
  onRemove: a
}) {
  const f = Ui(e.mode);
  return /* @__PURE__ */ d(
    "div",
    {
      className: i ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": f,
      children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            ...r,
            disabled: o,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${t + 1}`,
            children: /* @__PURE__ */ n(Qn, {})
          }
        ),
        /* @__PURE__ */ d("span", { children: [
          "Step ",
          t + 1
        ] }),
        /* @__PURE__ */ d(
          "select",
          {
            "aria-label": "Tag operation",
            value: e.mode,
            onChange: (u) => s({ ...e, mode: u.target.value }),
            children: [
              /* @__PURE__ */ n("option", { value: "ADD", children: "Add tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE", children: "Remove tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE_TREE", children: "Remove tags and descendants" }),
              /* @__PURE__ */ n("option", { value: "MARK_PRESENT", children: "Mark present" }),
              /* @__PURE__ */ n("option", { value: "MARK_ABSENT", children: "Mark absent" }),
              /* @__PURE__ */ n("option", { value: "CLEAR_ABSENCE", children: "Clear absence" })
            ]
          }
        ),
        /* @__PURE__ */ n("div", { className: "dq-step-tags", children: /* @__PURE__ */ n(
          Rt,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (u) => s({ ...e, tagIds: u }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: a, children: /* @__PURE__ */ n(ri, {}) })
      ]
    }
  );
}
async function oc() {
  const e = await Q("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let o = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const a = JSON.parse(r);
      Array.isArray(a.reviews) && (o = JSON.stringify(a.reviews, null, 2));
    } catch {
    }
  const i = URL.createObjectURL(
    new Blob([o], { type: "application/json" })
  ), s = document.createElement("a");
  s.href = i, s.download = "data-quality-browser-recovery.json", s.click(), URL.revokeObjectURL(i);
}
function jo({ label: e }) {
  return /* @__PURE__ */ d("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(ei, { className: "dq-spin" }),
    e
  ] });
}
function Uo({
  message: e,
  onRetry: t,
  retryLabel: r = "Retry"
}) {
  return /* @__PURE__ */ d("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(Tn, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: r })
  ] });
}
const dc = { components: { DataQualityPage: Qs } };
export {
  Qs as DataQualityPage,
  dc as default,
  Kr as objectFiltersEqual
};
