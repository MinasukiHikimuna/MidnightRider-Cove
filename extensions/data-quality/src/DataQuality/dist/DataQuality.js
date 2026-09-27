import { jsxs as u, jsx as n, Fragment as me } from "react/jsx-runtime";
import { useState as S, useEffect as J, useRef as $, useMemo as Gt, useCallback as tr, useLayoutEffect as qi } from "react";
import { DetailListToolbar as _r, AUDIO_CRITERIA as _n, VIDEO_CRITERIA as cn, PERFORMER_CRITERIA as Cn, NarrativeText as Po, AUDIO_SORT_OPTIONS as Ri, VIDEO_SORT_OPTIONS as Dn, EntityReferenceMultiSelector as xt, FilterDialog as Ti, DetailListPagination as ki, AudioPlayer as Mo, VideoPlayer as Ii, useCustomFieldFilterSection as $o, TAG_SORT_OPTIONS as Oi, TAG_CRITERIA as Pi, EntityDetailTabs as Fo, TagTile as xo, VideoCard as Lo, SortableList as En } from "@cove/runtime/components";
import { Save as jn, RotateCcw as Mi, ChevronLeft as $i, Pencil as Fi, Settings as _o, AlertTriangle as Nn, ChevronRight as xi, Film as An, Loader2 as Li, Tags as Do, Headphones as jo, ExternalLink as Uo, X as _i, Plus as Ko, Upload as Bo, Trash2 as Di, GripVertical as Un } from "@cove/runtime/lucide-react";
import { extensionFetch as Vo } from "@cove/runtime/api";
const ln = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, dn = Object.keys(
  ln
);
function Cr(e) {
  return e === "excludes" || e === "excludesAll";
}
const Go = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function ie(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function Fr(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function ae(e) {
  return Fr(Ae(e));
}
function ji(e) {
  return Ae(e) === "video";
}
function Ae(e) {
  return e.entityType ?? "video";
}
function rr(e, t) {
  return "qwertyuiop"[t] ?? "";
}
function tn(e) {
  return ie(e) && !Ki(e.occurrence) ? "Complete the optional occurrence condition before saving." : !ji(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Ae(e) !== "tag" && e.actions.some(
    (t) => Ui(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => ur(t, Ae(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const Jo = {
  video: 1e3,
  audio: 250
};
function Ke(e, t = "video") {
  const r = (i, a) => Number.isFinite(Number(i)) && Number(i) > 0 ? Math.floor(Number(i)) : a;
  return {
    ...e,
    page: Math.max(1, r(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(Jo[t], r(e.perPage, 40))
    )
  };
}
function si(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function $t(e) {
  const { page: t, ...r } = e.view.filter, i = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    ie(e) ? [e.entityType, ...i, e.occurrence] : Ae(e) === "video" ? i : [Ae(e), ...i]
  );
}
function ur(e, t) {
  const r = t ?? ("effect" in e ? "tag" : "video");
  return e.label.trim() ? r === "tag" ? !("effect" in e) || "steps" in e || !e.effect || typeof e.effect != "object" ? !1 : ["SET_TAG_GROUP", "CLEAR_TAG_GROUP", "SKIP"].includes(
    e.effect.mode
  ) && (e.effect.mode !== "SET_TAG_GROUP" || Number.isSafeInteger(e.effect.tagGroupId) && e.effect.tagGroupId > 0) : !("steps" in e) || "effect" in e ? !1 : e.steps.every(
    (i) => [
      "ADD",
      "REMOVE",
      "REMOVE_TREE",
      "MARK_PRESENT",
      "MARK_ABSENT",
      "CLEAR_ABSENCE"
    ].includes(i.mode) && i.tagIds.length > 0 && i.tagIds.every((a) => Number.isSafeInteger(a) && a > 0)
  ) && !Ui(e) : !1;
}
function Qo(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function dr(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function Jt(e) {
  return "steps" in e ? e.steps.some((t) => dr(t.mode)) : !1;
}
function Ui(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.steps)
    if (dr(r.mode))
      for (const i of r.tagIds) {
        const a = t.get(i);
        if (a && a !== r.mode) return !0;
        t.set(i, r.mode);
      }
  return !1;
}
function Ur(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || Go.includes(r.entityType)) && (!Qo(r.entityType) || Ki(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && (r.view.reviewMode === void 0 || ["single", "multiple"].includes(r.view.reviewMode)) && (r.view.reviewMode !== "multiple" || (r.entityType ?? "video") === "video") && (r.view.selectAllOnLoad === void 0 || typeof r.view.selectAllOnLoad == "boolean") && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && zo(
      r.presentation,
      (r.entityType ?? "video") !== "video"
    ) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (r.entityType === "tag" ? "effect" in i && !("steps" in i) && ur(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (a) => a && Array.isArray(a.tagIds)
      ) && ur(i, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => tn(r)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function zo(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const r = e;
  return (r.cardSize === void 0 || r.cardSize === null || Number.isFinite(r.cardSize) && r.cardSize >= 115 && r.cardSize <= 380) && (!t || r.annotations === void 0 && r.annotationParents === void 0 && r.binParents === void 0) && (r.annotations === void 0 || Array.isArray(r.annotations) && r.annotations.every(
    (i) => ["date", "studio", "performers", "tags"].includes(i)
  )) && [r.annotationParents, r.binParents].every(
    (i) => i === void 0 || Array.isArray(i) && i.every((a) => Number.isSafeInteger(a) && a > 0)
  );
}
function qn(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const a of i)
      r.has(a.id) || (r.add(a.id), t.push(a));
  return t;
}
function Ki(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (i) => Array.isArray(i) && i.every((a) => Number.isSafeInteger(a) && a > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && (t.targetMode !== "selected" || t.performerIds.length > 0) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && dn.includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.flagPerformerTagIds === void 0 || r(t.flagPerformerTagIds)) && r(t.tagIds) && typeof t.multiple == "boolean";
}
function ci(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function li(e, t, r, i) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!i && t.includes(r)) return r;
  const a = Math.max(0, e.indexOf(r));
  if (i) {
    for (const s of e.slice(a + 1))
      if (t.includes(s)) return s;
    if (t.includes(r)) {
      for (const s of e.slice(0, a).reverse())
        if (t.includes(s)) return s;
      return r;
    }
  }
  return t[Math.min(a, t.length - 1)];
}
function di(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((a) => r.has(a));
  for (const a of t)
    i ? r.delete(a) : r.add(a);
  return r;
}
function Bi(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function Wo(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-actions, .dq-pagination-row, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Ho(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Yo(e, t) {
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
const Vi = "ext:com.midnightrider.data-quality:configuration", Xo = "ext:cove-data-quality:video-reviews", Rn = "ext:com.midnightrider.data-quality:progress", Kr = /* @__PURE__ */ new Map(), Yr = /* @__PURE__ */ new Map(), lr = (e, t) => e.includes("*") || e.includes(t), rn = (e) => Q(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Zo = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Tn(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function vr(e) {
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
    reviews: Ur(JSON.stringify(t.reviews)),
    deletedIds: Tn(t.deletedIds),
    importedIds: Tn(t.importedIds)
  };
}
function ea(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const a of t) {
    const s = localStorage.getItem(a);
    if (s !== null) {
      const o = Ur(s);
      r ?? (r = o), o.forEach((f) => i.add(f.id));
    }
    Tn(
      JSON.parse(localStorage.getItem(`${a}:account-imports`) ?? "[]")
    ).forEach((o) => i.add(o));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function Gi(e) {
  const t = await Q("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Ji(e, t) {
  const r = (Yr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Yr.set(e, r), r.finally(() => {
    Yr.get(e) === r && Yr.delete(e);
  }).catch(() => {
  }), r;
}
let $r = null;
function ta() {
  if ($r) return $r;
  const e = ra();
  return $r = e, e.finally(() => {
    $r === e && ($r = null);
  }).catch(() => {
  }), e;
}
async function ra() {
  var A;
  const e = await Q("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = lr(e.permissions, "savedfilters.read"), a = i && lr(e.permissions, "savedfilters.write"), s = i ? (await rn(Vi)).filter((C) => C.name === "Data Quality configuration").sort((C, v) => C.id - v.id) : [];
  if (s.length > 1) {
    const C = (v) => {
      const { revision: I, ...w } = vr(v.uiOptions);
      return JSON.stringify(w);
    };
    if (s.some((v) => C(v) !== C(s[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (a)
      for (const v of s.slice(1))
        await Q(`/api/savedfilters/${v.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${v.id}` })
        });
    s.splice(1);
  }
  let o = s.length ? vr(s[0].uiOptions) : Zo();
  const f = localStorage.getItem(`${r}:migrated`) === "true", d = localStorage.getItem(r), p = localStorage.getItem(`${r}:local-only`) === "true";
  !s.length && d && (o = vr(d));
  let h = !s.length;
  if (s.length && p && d) {
    const C = vr(d);
    if (C.reviews.some((I) => {
      const w = o.reviews.find((k) => k.id === I.id);
      return w && JSON.stringify(w) !== JSON.stringify(I);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const v = [
      .../* @__PURE__ */ new Set([...o.deletedIds, ...C.deletedIds])
    ];
    o = {
      ...o,
      reviews: qn(o.reviews, C.reviews).filter(
        (I) => !v.includes(I.id)
      ),
      deletedIds: v,
      importedIds: [
        .../* @__PURE__ */ new Set([...o.importedIds, ...C.importedIds])
      ]
    }, h = !0;
  }
  if (!f) {
    const C = JSON.stringify(o), v = ea(t);
    if (s.length && v.reviews.some((_) => {
      const ue = o.reviews.find((fe) => fe.id === _.id);
      return ue && JSON.stringify(ue) !== JSON.stringify(_);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const I = i ? (await rn(Xo)).flatMap(
      (_) => Ur(_.uiOptions ?? "[]")
    ) : [], w = v.known.filter(
      (_) => !v.reviews.some((ue) => ue.id === _)
    ), k = /* @__PURE__ */ new Set([...o.deletedIds, ...w]);
    o = {
      ...o,
      reviews: qn(
        v.reviews,
        o.reviews,
        I.filter(
          (_) => !v.known.includes(_.id) && !o.importedIds.includes(_.id)
        )
      ).filter((_) => !k.has(_.id)),
      deletedIds: [...k],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...o.importedIds,
          ...v.known,
          ...I.map((_) => _.id)
        ])
      ]
    }, h || (h = JSON.stringify(o) !== C);
  }
  const y = {
    userId: t,
    recordId: (A = s[0]) == null ? void 0 : A.id,
    config: o,
    readable: i,
    writable: a,
    durable: a
  };
  if (Kr.set(r, y), h && a) {
    const C = o;
    s.length && (y.config = vr(s[0].uiOptions)), await Qi(r, C), o = y.config;
  } else s.length || (localStorage.setItem(r, JSON.stringify(o)), !i && (!f || p) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (a)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: o.reviews,
    storageKey: r,
    canWrite: lr(e.permissions, "videos.write"),
    canWriteVideos: lr(e.permissions, "videos.write"),
    canWriteAudios: lr(e.permissions, "audios.write"),
    canWriteTags: lr(e.permissions, "tags.write"),
    canReadTagGroups: lr(e.permissions, "taggroups.read"),
    canConfigure: !i || a,
    storageNotice: i ? a ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Qi(e, t) {
  const r = Kr.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await Gi(r), r.recordId != null) {
      const s = await Q(
        `/api/savedfilters/${r.recordId}`
      );
      if (vr(s.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const a = await Q(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Vi,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(i)
        })
      }
    );
    r.recordId = a.id;
  } else
    localStorage.setItem(e, JSON.stringify(i)), localStorage.setItem(`${e}:local-only`, "true");
  if (r.config = i, r.durable)
    try {
      localStorage.setItem(e, JSON.stringify(i)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function na(e, t) {
  return Ur(JSON.stringify(t)), Ji(e, async () => {
    const r = Kr.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((a) => !t.some((s) => s.id === a.id)).map((a) => a.id);
    await Qi(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((a) => !t.some((s) => s.id === a))
    });
  });
}
function ui(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([r, i]) => /^[1-9]\d*:[1-9]\d*$/.test(r) && ["reviewed", "cannotDetermine"].includes(String(i)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function ia(e, t) {
  const r = Kr.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), a = i ? ui(i) : null;
  if (!r.readable) return a;
  const s = (await rn(Rn)).find(
    (f) => f.name === t
  ), o = s ? ui(s.uiOptions) : null;
  return a && (!o || a.updatedAt > o.updatedAt) ? a : o;
}
function oa(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return Ji(i, async () => {
    const a = Kr.get(e);
    if (!(a != null && a.writable)) return;
    await Gi(a);
    const s = (await rn(Rn)).find(
      (o) => o.name === t
    );
    await Q(
      s ? `/api/savedfilters/${s.id}` : "/api/savedfilters",
      {
        method: s ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Rn,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
function pr(e) {
  return e === "audio" ? "audios" : "videos";
}
const aa = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Ct(e) {
  return aa[e];
}
const nn = "confirmed_absent_tags", Kn = "Confirmed absent tags", un = "confirmed_absent_occurrence_tags", zi = {
  key: nn,
  label: Kn,
  type: "tag",
  subject: "tag assessments"
}, Bn = {
  key: un,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, sa = {
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
function fr(e) {
  return Array.isArray(e) ? e.map(fr) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? sa[r] ?? r : t === "key" && typeof r == "string" && [
        nn,
        un
      ].includes(r.toLowerCase()) ? r.toLowerCase() : fr(r)
    ])
  ) : e;
}
async function Wi(e, t, r) {
  const i = new Headers(t.headers);
  !(t.body instanceof FormData) && !i.has("Content-Type") && i.set("Content-Type", "application/json");
  const a = await Vo(e, { ...t, headers: i });
  if (a.status === 404 && r === "null") return null;
  if (!a.ok) {
    let o = a.statusText || `Request failed (${a.status}).`;
    try {
      const f = await a.json();
      o = f.message || f.detail || f.error || o;
    } catch {
    }
    throw new Error(o);
  }
  if (a.status === 204 || a.status === 205) return;
  const s = await a.text();
  return s ? JSON.parse(s) : void 0;
}
async function Q(e, t = {}) {
  return await Wi(e, t, "fail");
}
function ca(e, t = {}) {
  return Wi(e, t, "null");
}
const la = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let da = 0;
function kn(e, t) {
  return Q(
    `/api/${pr(e)}/${t}?dqRead=${la}-${++da}`,
    { cache: "no-store" }
  );
}
function Hi(e, t) {
  const r = { ...e.view.objectFilter }, i = r._filterExpression;
  if (delete r._filterExpression, delete r.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    fr({
      findFilter: Ke(t, ae(e)),
      objectFilter: r,
      filterExpression: i
    })
  );
}
async function xr(e, t, r) {
  return Q(
    `/api/${pr(ae(e))}/find`,
    { method: "POST", signal: r, body: Hi(e, t) }
  );
}
async function ua(e, t, r) {
  return (await Q(
    `/api/${pr(ae(e))}/aggregate`,
    {
      method: "POST",
      signal: r,
      body: Hi(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function fi(e, t, r) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, Q("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      fr({
        findFilter: Ke(t),
        objectFilter: i
      })
    )
  });
}
function fa(e) {
  return Q("/api/taggroups", { signal: e });
}
function pi(e, t) {
  return `/api/${pr(e)}/${t.id}/image?max=1280&v=${encodeURIComponent(t.updatedAt)}`;
}
function In(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function gi(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function pa(e) {
  return `/api/stream/video/${e}/preview`;
}
function ga(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function ma(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Br(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const i of e) {
    await Q(`/api/tags/${i}`, { signal: t }), r.add(i);
    for (let a = 1; ; a++) {
      const s = await Q("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          fr({
            findFilter: { page: a, perPage: 1e3, sort: "id", direction: "asc" },
            objectFilter: {
              parentsCriterion: {
                value: [i],
                modifier: "INCLUDES",
                depth: -1
              }
            }
          })
        )
      });
      for (const o of s.items) r.add(o.id);
      if (a * 1e3 >= s.totalCount) break;
      if (!s.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...r];
}
function ha(e, t) {
  const r = [];
  return t.type !== e.type && r.push(`type "${e.type}"`), t.isMultiValue || r.push("multiple values enabled"), t.filterable || r.push("filtering enabled"), r.length ? `The ${e.key} custom field is incompatible. It must have ${r.join(", ")}.` : "";
}
async function Vn(e, t) {
  const i = (await Q("/api/custom-fields")).find(
    (s) => s.key.toLowerCase() === e.key
  );
  if (!i)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const a = ha(e, i);
  return a ? { kind: "incompatible", message: a } : i.entityTypes.includes(t) ? { kind: "ready", definition: i, message: "" } : {
    kind: "missing",
    message: `Add ${Ct(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: i
  };
}
async function Yi(e, t) {
  const r = await Vn(e, t);
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
function Xi(e = "video") {
  return Vn(zi, e);
}
function ba(e = "video") {
  return Yi(zi, e);
}
function Zi(e = "video") {
  return Vn(Bn, e);
}
function wa(e = "video") {
  return Yi(Bn, e);
}
function on(e) {
  return [...new Set(e)];
}
function eo(e, t) {
  const r = e.customFields ?? {}, i = Object.keys(r).find(
    (s) => s.toLowerCase() === un
  ), a = i === void 0 ? [] : r[i];
  return on(
    (Array.isArray(a) ? a : []).filter(
      (s) => typeof s == "string" && /^[1-9]\d*:[1-9]\d*$/.test(s)
    ).map((s) => s.split(":").map(Number)).filter(([s]) => s === t).map(([, s]) => s)
  );
}
async function ya(e) {
  let t;
  try {
    t = await Zi(e);
  } catch (r) {
    throw new Error(
      `Could not verify the ${Bn.label} custom field. ${r instanceof Error ? r.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function va(e, t, r, i, a, s) {
  await Q(`/api/${pr(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [r],
      customFields: {
        [e]: on(a).map((o) => `${i}:${o}`)
      },
      customFieldMode: s
    })
  });
}
function Sa(e, t, r) {
  const i = [...e.tagIds], a = (s) => {
    if (r === null)
      throw new Error(
        `The ${Kn} custom field is not available.`
      );
    return { customFields: { [r]: i }, customFieldMode: s };
  };
  switch (e.mode) {
    case "ADD":
      return { ids: t, tagIds: i, tagMode: "ADD" };
    case "REMOVE":
    case "REMOVE_TREE":
      return { ids: t, tagIds: i, tagMode: "REMOVE" };
    case "MARK_PRESENT":
      return { ids: t, tagIds: i, tagMode: "ADD", ...a("REMOVE") };
    case "MARK_ABSENT":
      return { ids: t, tagIds: i, tagMode: "REMOVE", ...a("ADD") };
    case "CLEAR_ABSENCE":
      return { ids: t, ...a("REMOVE") };
  }
}
async function to(e, t, r) {
  if (!ur(t) || r.length === 0 || r.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${Ct(e).many} and configure a valid action first.`
    );
  let i = null;
  if (Jt(t)) {
    let d;
    try {
      d = await Xi(e);
    } catch (p) {
      throw new Error(
        `Could not verify the ${Kn} custom field. ${p instanceof Error ? p.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    i = d.definition.key;
  }
  const a = on(r), s = await Promise.all(
    t.steps.map(async (d) => ({
      mode: d.mode,
      tagIds: d.mode === "REMOVE_TREE" ? await Br(d.tagIds) : on(d.tagIds)
    }))
  ), f = [
    ...s.filter((d) => !dr(d.mode)),
    ...s.filter((d) => dr(d.mode))
  ].map(
    (d) => Sa(d, a, i)
  );
  for (let d = 0; d < f.length; d++)
    try {
      await Q(`/api/${pr(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(f[d])
      });
    } catch (p) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${Ct(e).many} before retrying. ${p instanceof Error ? p.message : "Request failed."}`
      );
    }
}
async function Ca(e, t) {
  if (!ur(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await Q("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
function an(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Gn(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Jn(e) {
  return !!String(e ?? "").trim();
}
function Qn(e) {
  return [
    ...new Set(
      an(e.customFieldCriteria).filter(Gn).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Jn(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function zn(e, t) {
  const r = an(e.customFieldCriteria);
  if (!r.length) return e;
  let i = !1;
  const a = r.map((s) => {
    if (!Gn(s)) return s;
    const o = { ...s };
    for (const [f, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const p = t[String(s[f] ?? "")];
      p && !Jn(s[d]) && (o[d] = p, i = !0);
    }
    return o;
  });
  return i ? { ...e, customFieldCriteria: a } : e;
}
function ro(e, t, r) {
  const i = an(e.customFieldCriteria);
  if (!i.length) return e;
  const a = an(r.customFieldCriteria), s = (d, p) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (h) => (d[h] ?? void 0) === (p[h] ?? void 0)
  );
  let o = !1;
  const f = i.map((d) => {
    if (!Gn(d)) return d;
    const p = a.find((y) => s(y, d));
    if (!p) return d;
    const h = { ...d };
    for (const [y, A] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const C = t[String(d[y] ?? "")];
      C && d[A] === C && !Jn(p[A]) && (delete h[A], o = !0);
    }
    return h;
  });
  return o ? { ...e, customFieldCriteria: f } : e;
}
async function Ea(e, t, r) {
  if (!ur(r))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const i = ae(e), a = r.steps.some((f) => dr(f.mode)) ? await ya(i) : "", s = await Promise.all(
    r.steps.map(async (f) => ({
      ...f,
      tagIds: f.mode === "REMOVE_TREE" ? await Br(f.tagIds) : f.tagIds
    }))
  );
  let o = t.applications;
  for (const f of [
    ...s.filter((d) => !dr(d.mode)),
    ...s.filter((d) => dr(d.mode))
  ]) {
    const d = (p) => va(
      a,
      i,
      t.media.id,
      t.performer.id,
      f.tagIds,
      p
    );
    (f.mode === "MARK_PRESENT" || f.mode === "CLEAR_ABSENCE") && await d("REMOVE"), f.mode !== "CLEAR_ABSENCE" && (o = await ao(
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
    )), f.mode === "MARK_ABSENT" && await d("ADD");
  }
  return o;
}
async function Wn(e, t) {
  const r = e.occurrence;
  if (r.targetMode === "all" || r.targetMode === "filter" && Object.keys(r.performerFilter).length === 0) return null;
  if (r.targetMode === "selected") return r.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: a, ...s } = r.performerFilter;
  for (let o = 1; ; o++) {
    const f = await Q("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        fr({
          findFilter: { page: o, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: s,
          filterExpression: a
        })
      )
    });
    if (f.items.forEach((d) => i.add(d.id)), o * 1e3 >= f.totalCount) return [...i];
    if (!f.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function no(e) {
  return Cr(e.condition) && e.hideConfirmedAbsent !== !1;
}
function Hn(e, t) {
  const { _filterExpression: r, ...i } = e.view.objectFilter, a = e.occurrence, s = {
    mode: "atLeastOne",
    conditionOperator: "and",
    ...t === null ? {} : {
      performerIdsCriterion: { modifier: "includes", value: t }
    },
    ...a.condition === "any" ? {} : {
      performerOccurrenceTagsCriterion: {
        modifier: a.condition,
        value: a.conditionTagIds,
        depth: a.includeSubtags === !1 ? 0 : -1
      }
    }
  }, o = no(a) && (t == null ? void 0 : t.length) === 1 && a.conditionTagIds.length === 1 ? `${t[0]}:${a.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: ae(e),
    actions: [],
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...r ? [{ group: r }] : [],
            { filter: i },
            { filter: { performerFilterCriterion: s } },
            ...o ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: un,
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
async function Yn(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((r) => [r]) : Promise.all(
    e.conditionTagIds.map((r) => Br([r], t))
  );
}
function io(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function Na(e, t, r = e.conditionTagIds.map((i) => [i])) {
  const i = new Set(t), a = (s) => s.some((o) => i.has(o));
  switch (e.condition) {
    case "any":
      return !0;
    case "isNull":
      return i.size === 0;
    case "includes":
      return r.some(a);
    case "includesAll":
      return r.every(a);
    case "excludes":
      return !r.some(a);
    case "excludesAll":
      return !r.every(a);
  }
}
function Aa(e, t, r, i, a) {
  if (!no(e)) return !1;
  const s = eo(t, r);
  return e.conditionTagIds.every(
    (o, f) => s.includes(o) || a[f].some((d) => i.includes(d))
  );
}
async function oo(e, t, r, i) {
  if ((t == null ? void 0 : t.length) === 0 || io(e.occurrence))
    return { items: [], totalCount: 0 };
  const a = ae(e), s = await xr(
    Hn(e, t),
    { ...e.view.filter, page: r },
    i
  ), o = t === null ? null : new Set(t), f = e.occurrence, d = s.items.length ? await Yn(f, i) : [], p = new Array(s.items.length);
  let h = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, s.items.length) }, async () => {
      for (; h < s.items.length; ) {
        const y = h++, A = s.items[y], C = await Q(
          `/api/tagapplications?hostType=${a}&hostId=${A.id}&contextType=performer`,
          { signal: i }
        );
        p[y] = A.performers.filter((v) => o === null || o.has(v.id)).flatMap((v) => {
          const I = C.filter(
            (k) => k.hostType === a && k.hostId === A.id && k.contextType === "performer" && k.contextId === v.id
          ), w = I.map((k) => k.tag.id);
          return Na(e.occurrence, w, d) && !Aa(f, A, v.id, w, d) ? [
            {
              key: `${A.id}:${v.id}`,
              media: A,
              performer: v,
              applications: I
            }
          ] : [];
        });
      }
    })
  ), { items: p.flat(), totalCount: s.totalCount };
}
async function ao(e, t, r) {
  const i = new Set(e.occurrence.tagIds);
  if (r.some((p) => !i.has(p)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const a = ae(e), s = await kn(a, t.media.id);
  if (!s.performers.some(
    (p) => p.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${a}. Refresh the queue.`
    );
  const o = `/api/tagapplications?hostType=${a}&hostId=${s.id}&contextType=performer&contextId=${t.performer.id}`, f = (await Q(o)).filter(
    (p) => p.hostType === a && p.hostId === s.id && p.contextType === "performer" && p.contextId === t.performer.id
  ), d = new Set(r);
  try {
    for (const p of d)
      f.some((h) => h.tag.id === p) || await Q("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: a,
          hostId: s.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: p,
          sourceKey: "user"
        })
      });
    for (const p of f)
      i.has(p.tag.id) && !d.has(p.tag.id) && await Q(`/api/tagapplications/${p.id}`, {
        method: "DELETE"
      });
    return await Q(o);
  } catch (p) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${p instanceof Error ? p.message : "Request failed."}`
    );
  }
}
function Er(e, t) {
  return {
    added: t.filter((r) => !e.includes(r)),
    removed: e.filter((r) => !t.includes(r))
  };
}
function qa(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function St(e, t, r = !0) {
  var f;
  if (t.occurrence) {
    const d = r ? eo(
      await kn(e, t.media.id),
      t.occurrence.performer.id
    ) : [], p = (await Q(qa(e, t))).filter(
      (h) => h.hostType === e && h.hostId === t.media.id && h.contextType === "performer" && h.contextId === t.occurrence.performer.id
    );
    return {
      ids: [...new Set(p.map((h) => h.tag.id))],
      names: [...new Set(p.map((h) => h.tag.name))],
      absent: d,
      applications: p
    };
  }
  const i = await kn(e, t.media.id), a = (i.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  ), s = Object.keys(i.customFields ?? {}).find(
    (d) => d.toLowerCase() === nn
  ) ?? nn, o = ((f = i.customFields) == null ? void 0 : f[s]) ?? [];
  if (!Array.isArray(o) || o.some((d) => !Number.isSafeInteger(d)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${e} before editing.`
    );
  return { ids: a.map((d) => d.id), names: a.map((d) => d.name), absent: o };
}
async function Xn(e, t, r) {
  if (t.occurrence && ie(e))
    await ao(
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
    for (const [i, a] of [
      ["ADD", r.added],
      ["REMOVE", r.removed]
    ])
      a.length && await Q(
        `/api/${pr(ae(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: i, tagIds: a })
        }
      );
}
async function Ra(e, t, r) {
  t.occurrence && ie(e) ? await Ea(e, t.occurrence, r) : await to(ae(e), r, [t.media.id]);
}
function On(e, t, r, i) {
  const a = (s) => s.filter((o) => i.includes(o));
  return {
    item: e,
    before: t,
    after: r,
    tags: Er(a(t.ids), a(r.ids)),
    absence: Er(a(t.absent), a(r.absent))
  };
}
function Ta(e, t) {
  var r;
  for (const [i, a] of [
    [e.tags, t.ids],
    [e.absence, t.absent]
  ])
    if (i.added.some((s) => !a.includes(s)) || i.removed.some((s) => a.includes(s)))
      throw new Error(
        "Undo conflict: affected tags changed since this operation. Inspect the item; no undo changes were made."
      );
  if (t.applications)
    for (const i of e.tags.added) {
      const a = (r = e.after.applications) == null ? void 0 : r.filter((o) => o.tag.id === i).map((o) => o.id).sort(), s = t.applications.filter((o) => o.tag.id === i).map((o) => o.id).sort();
      if (JSON.stringify(a) !== JSON.stringify(s))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
const Pn = (e) => e instanceof Error ? e.message : "Request failed.", mi = (e) => [...e].sort((t, r) => t - r), Dr = (e, t) => JSON.stringify(mi(e)) === JSON.stringify(mi(t)), Mn = (e) => !!(e.tags.added.length || e.tags.removed.length);
function sn(e, t, r, i) {
  const a = new Set(e), s = new Set(e);
  for (const h of t.steps)
    for (const y of h.tagIds)
      h.mode === "ADD" ? s.add(y) : s.delete(y);
  const o = e.some((h) => !s.has(h));
  if (o && !i)
    return { desired: [...e], conflict: o, skipped: !0, kept: [], replaced: [] };
  const f = new Set(
    t.steps.filter((h) => h.mode === "ADD").flatMap((h) => h.tagIds)
  ), d = [], p = [];
  for (const h of r) {
    const y = h.filter((C) => s.has(C) && !a.has(C)), A = h.filter(
      (C) => s.has(C) && a.has(C) && !f.has(C)
    );
    !y.length || !A.length || (i ? (A.forEach((C) => s.delete(C)), p.push(...A)) : (y.forEach((C) => s.delete(C)), d.push({ tagIds: y, existing: A })));
  }
  return { desired: [...s], conflict: o, skipped: !1, kept: d, replaced: p };
}
function ka(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Ia(e, t, r, i) {
  for (const [a, s] of r.entries()) {
    const o = t.filter(
      (p) => p.steps.some(
        (h) => h.mode === "ADD" && h.tagIds.some((y) => s.includes(y))
      )
    );
    if (o.length < 2) continue;
    const f = e.occurrence.conditionTagIds[a];
    let d = `tag ${f}`;
    try {
      d = (await Q(`/api/tags/${f}`, { signal: i })).name;
    } catch {
      i.throwIfAborted();
    }
    throw new Error(
      `${o.map((p) => p.label).join(" and ")} answer the same condition tag, ${d}. Choose one of them.`
    );
  }
}
async function Oa(e, t, r, i = () => {
}) {
  if (!t.length || t.some(
    (y) => !ur(y, e.entityType) || !y.steps.length || y.steps.some(
      (A) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(A.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const a = structuredClone(e), s = structuredClone(t), o = Cr(a.occurrence.condition) && a.occurrence.includeSubtags !== !1 ? await Yn(a.occurrence, r) : [];
  await Ia(a, s, o, r);
  const f = structuredClone(ka(s));
  for (const y of f.steps)
    y.mode === "REMOVE_TREE" && (y.tagIds = await Br(y.tagIds, r), y.mode = "REMOVE");
  r.throwIfAborted();
  const d = [
    .../* @__PURE__ */ new Set([
      ...f.steps.flatMap((y) => y.tagIds),
      ...o.flat()
    ])
  ];
  a.view.filter = {
    ...a.view.filter,
    page: 1,
    perPage: 250,
    sort: "id",
    direction: "asc",
    sorts: void 0
  };
  const p = await Wn(a, r), h = /* @__PURE__ */ new Map();
  for (let y = 1; ; y++) {
    r.throwIfAborted();
    const A = await oo(a, p, y, r);
    for (const C of A.items) {
      const v = {
        ids: [...new Set(C.applications.map((w) => w.tag.id))],
        names: C.applications.map((w) => w.tag.name),
        absent: [],
        applications: C.applications
      }, I = sn(v.ids, f, o, !0);
      h.set(C.key, {
        item: { key: C.key, media: C.media, occurrence: C },
        before: v,
        expected: v,
        conflict: I.conflict,
        status: Dr(v.ids, I.desired) ? "unchanged" : "pending"
      });
    }
    if (i(h.size), y * 250 >= A.totalCount) break;
    if (y > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return r.throwIfAborted(), {
    review: a,
    actions: s,
    action: f,
    categories: o,
    touched: d,
    entries: [...h.values()]
  };
}
function Pa(e, t, r) {
  const i = (s) => s.ids.filter((o) => r.includes(o));
  if (!Dr(i(e), i(t))) return !1;
  const a = (s) => (s.applications ?? []).filter((o) => r.includes(o.tag.id)).map((o) => o.id);
  return Dr(a(e), a(t));
}
async function so(e, t, r, i) {
  let a = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; !t() && a < e.length; ) {
        const s = e[a++];
        await r(s), i();
      }
    })
  );
}
async function Ma(e, t, r, i, a = !1) {
  const s = e.entries.filter(
    (o) => a ? o.status === "failed" : o.status === "pending"
  );
  await so(
    s,
    r,
    async (o) => {
      if (o.conflict && !t) {
        o.status = "skipped", o.error = "Conflicting answer skipped.";
        return;
      }
      if (o.unverified) {
        o.error = "The previous write could not be verified. Inspect this occurrence and create a fresh preview before further changes.";
        return;
      }
      let f;
      try {
        if (f = await St(ae(e.review), o.item, !1), !Pa(o.expected, f, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (C) {
        o.status = "failed", o.error = Pn(C);
        return;
      }
      const d = sn(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), p = [
        ...f.ids.filter((C) => !e.touched.includes(C)),
        ...d.desired.filter((C) => e.touched.includes(C))
      ], h = Er(f.ids, p);
      if (!h.added.length && !h.removed.length) {
        const C = !o.operation && d.kept.length > 0;
        o.status = o.operation ? "changed" : C ? "skipped" : "unchanged", o.error = C ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let y;
      try {
        await Xn(e.review, o.item, h);
      } catch (C) {
        y = C;
      }
      let A = !1;
      try {
        const C = await St(ae(e.review), o.item, !1);
        A = !0, o.expected = C;
        const v = On(
          o.item,
          o.before,
          C,
          e.touched
        );
        if (o.operation = Mn(v) ? v : void 0, y) throw y;
        if (!Dr(
          C.ids.filter((I) => e.touched.includes(I)),
          p.filter((I) => e.touched.includes(I))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (C) {
        if (o.status = "failed", o.error = Pn(C), !A)
          try {
            const v = await St(ae(e.review), o.item, !1);
            o.expected = v;
            const I = On(
              o.item,
              o.before,
              v,
              e.touched
            );
            o.operation = Mn(I) ? I : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    i
  );
}
async function $a(e, t, r) {
  await so(
    e.entries.filter((i) => i.operation),
    t,
    async (i) => {
      const a = i.operation;
      if (i.unverified) {
        i.error = "Undo unavailable: the previous write could not be verified. Inspect this occurrence.";
        return;
      }
      const s = [...a.tags.added, ...a.tags.removed];
      let o = !1;
      try {
        const f = await St(ae(e.review), i.item, !1);
        Ta(a, f), o = !0, await Xn(e.review, i.item, {
          added: a.tags.removed,
          removed: a.tags.added
        });
        const d = await St(ae(e.review), i.item, !1);
        if (!Dr(
          d.ids.filter((p) => s.includes(p)),
          i.before.ids.filter((p) => s.includes(p))
        ))
          throw new Error("Undo did not restore all affected tags.");
        i.operation = void 0, i.expected = d, i.status = "unchanged", i.error = void 0;
      } catch (f) {
        if (i.error = `Undo stopped: ${Pn(f)}`, i.status = "failed", o)
          try {
            const d = await St(ae(e.review), i.item, !1), p = On(
              i.item,
              i.before,
              d,
              s
            );
            i.operation = Mn(p) ? p : void 0, i.expected = d;
          } catch {
            i.unverified = !0;
          }
      }
    },
    r
  );
}
async function Fa(e, t, r) {
  const i = ae(e), a = e.occurrence, [s, o] = await Promise.all([
    Q(
      `/api/tagapplications?hostType=${i}&contextType=performer&contextId=${t}`,
      { signal: r }
    ),
    Yn(a, r)
  ]), f = s.filter(
    (v) => v.hostType === i && v.contextType === "performer" && v.contextId === t
  ), d = await Promise.all(
    o.map(async (v, I) => {
      const w = a.conditionTagIds[I];
      return (await Q(`/api/tags/${w}`, { signal: r })).name;
    })
  ), p = new Set(o.flat()), h = new Set(
    [
      ...e.actions.flatMap((v) => v.steps).filter((v) => v.mode === "ADD" || v.mode === "MARK_PRESENT").flatMap((v) => v.tagIds),
      ...a.tagIds
    ].filter((v) => !p.has(v))
  ), y = (v) => {
    const I = /* @__PURE__ */ new Map();
    for (const w of f) {
      if (!v.has(w.tag.id)) continue;
      const k = I.get(w.tag.id) ?? {
        name: w.tag.name,
        hosts: /* @__PURE__ */ new Set()
      };
      k.hosts.add(w.hostId), I.set(w.tag.id, k);
    }
    return [...I].map(([w, k]) => ({ id: w, name: k.name, count: k.hosts.size })).sort((w, k) => k.count - w.count || w.name.localeCompare(k.name));
  }, A = o.map((v, I) => ({
    id: a.conditionTagIds[I],
    name: d[I],
    tags: y(new Set(v))
  }));
  h.size && A.push({
    id: null,
    name: o.length ? "Other review tags" : "Review tags",
    tags: y(h)
  });
  const C = /* @__PURE__ */ new Set([...p, ...h]);
  return {
    answered: new Set(
      f.filter((v) => C.has(v.tag.id)).map((v) => v.hostId)
    ).size,
    groups: A
  };
}
function co({
  review: e,
  performerId: t,
  revision: r = 0
}) {
  const [i, a] = S(null), [s, o] = S(""), f = Ct(ae(e)), d = e.occurrence, p = JSON.stringify([
    e.entityType,
    t,
    d.condition,
    d.conditionTagIds,
    d.includeSubtags,
    d.tagIds,
    e.actions.map((h) => h.steps)
  ]);
  return J(() => {
    const h = new AbortController();
    return a(null), o(""), Fa(e, t, h.signal).then((y) => {
      h.signal.aborted || a(y);
    }).catch((y) => {
      h.signal.aborted || o(y instanceof Error ? y.message : "Request failed.");
    }), () => h.abort();
  }, [p, r]), /* @__PURE__ */ u("section", { className: "dq-performer-answers", "aria-label": "Existing answers", children: [
    /* @__PURE__ */ n("h3", { children: "Existing answers" }),
    s ? /* @__PURE__ */ u("p", { role: "alert", children: [
      "Could not load existing answers. ",
      s
    ] }) : i ? /* @__PURE__ */ u(me, { children: [
      /* @__PURE__ */ n("p", { children: i.answered ? `Answered on ${i.answered.toLocaleString()} of this performer’s ${f.many}.` : `None of this performer’s ${f.many} is answered yet.` }),
      /* @__PURE__ */ n("ul", { children: i.groups.filter((h) => h.id !== null || h.tags.length).map((h) => /* @__PURE__ */ u("li", { children: [
        h.name,
        ":",
        " ",
        h.tags.length ? h.tags.map((y) => `${y.name} ×${y.count.toLocaleString()}`).join(", ") : "None",
        h.id !== null && h.tags.length > 1 && /* @__PURE__ */ n("strong", { className: "dq-answers-mixed", children: " Mixed answers" })
      ] }, h.id ?? "other")) })
    ] }) : /* @__PURE__ */ n("p", { children: "Loading existing answers…" })
  ] });
}
async function hi(e, t, r) {
  const i = new Array(e.length);
  let a = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; a < e.length; ) {
        r.throwIfAborted();
        const s = a++, o = e[s];
        try {
          i[s] = [
            o,
            (await Q(`/api/${t}/${o}`, {
              signal: r
            })).name
          ];
        } catch {
          r.throwIfAborted(), i[s] = [
            o,
            `${t === "tags" ? "Tag" : "Performer"} ${o}`
          ];
        }
      }
    })
  ), i;
}
function xa(e, t) {
  const r = 1100 - (Date.now() - e);
  return r <= 0 ? Promise.resolve() : new Promise((i, a) => {
    const s = window.setTimeout(i, r);
    t.addEventListener(
      "abort",
      () => {
        window.clearTimeout(s), a(t.reason);
      },
      { once: !0 }
    );
  });
}
function La({
  review: e,
  disabled: t,
  hidden: r = !1,
  performerFlags: i = [],
  onOpen: a,
  onClose: s,
  onWrite: o
}) {
  const [f, d] = S(!1), [p, h] = S(null), [y, A] = S([]), [C, v] = S(!1), [I, w] = S(!1), [k, _] = S(""), [ue, fe] = S(""), [Oe, g] = S({}), [F, O] = S(!1), [te, ye] = S(!1), U = F && p ? p.review : e, X = ae(U), Xe = Ct(X), P = Xe.queue, Et = X === "audio" ? "Audio" : "Scene", [oe, Nt] = S([]), [Be, At] = S(!1), [, nr] = S(0), [Nr, nt] = S(0), Qt = $(null), qe = $(null), Le = $(!1), se = $(null), Ze = $(!1), ve = $(0), Se = $(!1), Ve = $({ onClose: s, onWrite: o });
  Ve.current = { onClose: s, onWrite: o }, J(() => {
    var E;
    f && ((E = Qt.current) == null || E.showModal());
  }, [f]), J(() => {
    if (!f || U.occurrence.targetMode !== "selected") return;
    const E = new AbortController();
    return Nt([]), hi(
      U.occurrence.performerIds,
      "performers",
      E.signal
    ).then((L) => {
      E.signal.aborted || Nt(L.map(([, pe]) => pe));
    }).catch(() => {
    }), () => E.abort();
  }, [
    f,
    U.occurrence.targetMode,
    JSON.stringify(U.occurrence.performerIds)
  ]), J(
    () => () => {
      var E;
      Le.current = !0, (E = se.current) == null || E.abort();
    },
    []
  ), J(() => {
    if (!I) return;
    const E = (L) => {
      L.preventDefault(), L.returnValue = "";
    };
    return window.addEventListener("beforeunload", E), () => window.removeEventListener("beforeunload", E);
  }, [I]);
  function qt() {
    h(null), O(!1), ye(!1), v(!1), A([]), fe(""), _(""), At(!1);
  }
  function H() {
    Se.current || (d(!1), Ve.current.onClose(Ze.current), Ze.current = !1, qt(), requestAnimationFrame(() => {
      var E;
      return (E = qe.current) == null ? void 0 : E.focus();
    }));
  }
  const _e = F && p ? p.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((E) => E.steps.length && !Jt(E))
  );
  async function W() {
    const E = _e.filter((L) => y.includes(L.id));
    if (!(!E.length || Se.current)) {
      Se.current = !0, w(!0), _(""), fe("Loading all matching occurrences…"), h(null), O(!1), ye(!1), At(!1), se.current = new AbortController();
      try {
        await xa(ve.current, se.current.signal);
        const L = await Oa(
          e,
          E,
          se.current.signal,
          (Je) => fe(`Loaded ${Je.toLocaleString()} matching occurrences…`)
        ), pe = /* @__PURE__ */ new Map();
        for (const Je of L.entries)
          for (const Z of Je.before.applications ?? [])
            pe.set(Z.tag.id, Z.tag.name);
        const gt = await hi(
          [
            .../* @__PURE__ */ new Set([
              ...L.actions.flatMap(
                (Je) => Je.steps.flatMap((Z) => Z.tagIds)
              ),
              ...L.review.occurrence.conditionTagIds,
              ...Qn(L.review.view.objectFilter)
            ])
          ].filter((Je) => !pe.has(Je)),
          "tags",
          se.current.signal
        );
        se.current.signal.throwIfAborted(), g({ ...Object.fromEntries(pe), ...Object.fromEntries(gt) }), h(L), fe("Preview ready. No tags have been changed.");
      } catch (L) {
        _(
          se.current.signal.aborted ? "Preview cancelled. No tags were changed." : String(L instanceof Error ? L.message : L)
        ), fe("");
      } finally {
        Se.current = !1, w(!1), se.current = null;
      }
    }
  }
  async function q(E) {
    if (!p || Se.current) return;
    Se.current = !0, Le.current = !1, Ze.current = !0, Ve.current.onWrite(), w(!0), O(!0), _(""), E === "undo" && ye(!0), fe(E === "undo" ? "Undoing batch…" : "Applying batch…");
    const L = () => nr((pe) => pe + 1);
    try {
      E === "undo" ? await $a(p, () => Le.current, L) : await Ma(
        p,
        C,
        () => Le.current,
        L,
        E === "retry"
      ), fe(
        Le.current ? "Stopped after in-flight operations settled. Completed changes are retained." : E === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (pe) {
      _(pe instanceof Error ? pe.message : String(pe));
    } finally {
      ve.current = Date.now(), Se.current = !1, w(!1), nt((pe) => pe + 1), L();
    }
  }
  const D = (p == null ? void 0 : p.entries) ?? [], Ce = Gt(
    () => new Map(
      ((p == null ? void 0 : p.entries) ?? []).map((E) => [
        E.item.key,
        sn(E.before.ids, p.action, p.categories, C)
      ])
    ),
    [p, C]
  ), et = (E) => Ce.get(E.item.key), V = (E) => Er(E.before.ids, et(E).desired), Rt = (E) => {
    const L = V(E);
    return E.status === "pending" && (L.added.length > 0 || L.removed.length > 0);
  }, ir = (E) => {
    const L = et(E), pe = L.skipped ? Er(
      E.before.ids,
      sn(E.before.ids, p.action, p.categories, !0).desired
    ) : V(E);
    return [
      L.skipped ? "Skipped unless conflicting answers are replaced. " : "",
      `Add: ${Pe(pe.added)}; Remove: ${Pe(pe.removed)}`,
      ...L.kept.map(
        (gt) => `; Keeps ${Pe(gt.existing)} instead of ${Pe(gt.tagIds)}`
      )
    ].join("");
  }, it = D.filter((E) => E.conflict), ot = D.filter(
    (E) => et(E).kept.length || et(E).replaced.length
  ), Ge = (E) => D.filter((L) => L.status === E).length, Ee = D.some((E) => E.operation), Pe = (E) => E.map((L) => Oe[L] ?? `Tag ${L}`).join(", ") || "None", Me = D.filter((E) => E.item.media.date).sort((E, L) => E.item.media.date.localeCompare(L.item.media.date)), Tt = (E, L) => /* @__PURE__ */ n(
    "a",
    {
      href: `/${X}/${E.item.media.id}`,
      target: "_blank",
      rel: "noreferrer",
      "aria-label": `${L} ${Xe.one}, ${E.item.media.date}`,
      title: E.item.media.title || Et,
      children: E.item.media.date
    }
  ), zt = U.occurrence.targetMode === "selected" && U.occurrence.performerIds.length === 1, or = Cr(U.occurrence.condition) && U.occurrence.includeSubtags !== !1 && U.occurrence.conditionTagIds.length > 0;
  return /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-button",
        hidden: r,
        ref: qe,
        disabled: t || !_e.length,
        onClick: () => {
          qt(), a(), d(!0);
        },
        children: "Apply to all matching occurrences"
      }
    ),
    f && /* @__PURE__ */ u(
      "dialog",
      {
        ref: Qt,
        className: "dq-batch-dialog",
        "aria-labelledby": "dq-batch-title",
        "aria-modal": "true",
        onCancel: (E) => {
          E.preventDefault(), H();
        },
        children: [
          /* @__PURE__ */ n("h2", { id: "dq-batch-title", children: "Batch occurrence approval" }),
          /* @__PURE__ */ n("p", { children: "Apply one or more answers across all matching pages. Only targeted performer occurrences change." }),
          /* @__PURE__ */ n("p", { children: "Keep this page open while running. Results and undo last until you close this dialog or start a new batch." }),
          /* @__PURE__ */ u("fieldset", { disabled: I || F, children: [
            /* @__PURE__ */ n("legend", { children: "Batch scope and answers" }),
            /* @__PURE__ */ n("p", { children: "Uses your current filters. To include every existing appearance, remove filters that exclude already answered occurrences." }),
            /* @__PURE__ */ u("p", { children: [
              "Performer scope:",
              " ",
              U.occurrence.targetMode === "all" ? "All performers" : U.occurrence.targetMode === "selected" ? oe.join(", ") || `${U.occurrence.performerIds.length} selected performer(s)` : "Matching performer criteria",
              ". Occurrence condition:",
              " ",
              ln[U.occurrence.condition],
              "."
            ] }),
            i.length > 0 && /* @__PURE__ */ u("p", { className: "dq-batch-flag", children: [
              /* @__PURE__ */ u("strong", { children: [
                "Flagged: ",
                i.join(", "),
                "."
              ] }),
              " Check the earliest and latest ",
              Xe.many,
              " before applying, or narrow the batch with a date filter."
            ] }),
            Cr(U.occurrence.condition) && U.occurrence.hideConfirmedAbsent !== !1 && /* @__PURE__ */ n("p", { children: U.occurrence.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged." }),
            U.occurrence.conditionTagIds.length > 0 && p && /* @__PURE__ */ u("p", { children: [
              "Condition tags:",
              " ",
              Pe(U.occurrence.conditionTagIds),
              U.occurrence.includeSubtags === !1 ? " (exact tags only)" : " (including subtags)",
              "."
            ] }),
            /* @__PURE__ */ u("p", { children: [
              "Search: ",
              String(U.view.filter.q || "Any"),
              ".",
              " ",
              Object.keys(U.view.objectFilter).length === 0 && `${P[0].toUpperCase()}${P.slice(1)} filters: None.`
            ] }),
            /* @__PURE__ */ n(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": `Batch ${P} filters`,
                children: /* @__PURE__ */ n(
                  _r,
                  {
                    filter: U.view.filter,
                    objectFilter: zn(
                      U.view.objectFilter,
                      Oe
                    ),
                    criteriaDefinitions: X === "audio" ? _n : cn,
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
            U.occurrence.targetMode === "filter" && /* @__PURE__ */ n(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": "Batch performer criteria",
                children: /* @__PURE__ */ n(
                  _r,
                  {
                    filter: {},
                    objectFilter: U.occurrence.performerFilter,
                    criteriaDefinitions: Cn,
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
            zt && /* @__PURE__ */ n(
              co,
              {
                review: U,
                performerId: U.occurrence.performerIds[0],
                revision: Nr
              }
            ),
            !_e.length && /* @__PURE__ */ n("p", { children: "Configure an occurrence tag action in this review before starting a batch." }),
            /* @__PURE__ */ u("fieldset", { className: "dq-batch-answers", children: [
              /* @__PURE__ */ n("legend", { children: "Answers" }),
              _e.map((E) => /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
                /* @__PURE__ */ n(
                  "input",
                  {
                    type: "checkbox",
                    checked: F || y.includes(E.id),
                    onChange: (L) => {
                      A(
                        L.target.checked ? [...y, E.id] : y.filter((pe) => pe !== E.id)
                      ), h(null), fe(""), _("");
                    }
                  }
                ),
                E.label
              ] }, E.id))
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: !y.length,
                onClick: () => void W(),
                children: "Preview all matches"
              }
            ),
            /* @__PURE__ */ u("label", { children: [
              "Conflicting answers",
              " ",
              /* @__PURE__ */ u(
                "select",
                {
                  "aria-label": "Conflicting answers",
                  value: C ? "replace" : "skip",
                  onChange: (E) => v(E.target.value === "replace"),
                  children: [
                    /* @__PURE__ */ n("option", { value: "skip", children: "Skip conflicts" }),
                    /* @__PURE__ */ n("option", { value: "replace", children: "Replace conflicting answers" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u("p", { children: [
              "Conflicts are existing tags an answer removes. Configure opposite answers as removals.",
              or && " Each condition tag with its subtags is a category: an answer is added only where its category is still empty, and a different existing answer is kept unless conflicting answers are replaced."
            ] })
          ] }),
          /* @__PURE__ */ u("div", { "aria-live": "polite", children: [
            ue && /* @__PURE__ */ n("p", { role: "status", children: ue }),
            k && /* @__PURE__ */ n("p", { role: "alert", children: k }),
            p && /* @__PURE__ */ u(me, { children: [
              /* @__PURE__ */ n("p", { children: /* @__PURE__ */ u("strong", { children: [
                D.length.toLocaleString(),
                " occurrences in",
                " ",
                new Set(
                  D.map((E) => E.item.media.id)
                ).size.toLocaleString(),
                " ",
                P,
                "s"
              ] }) }),
              F ? /* @__PURE__ */ u("p", { children: [
                Ge("changed"),
                " changed; ",
                Ge("unchanged"),
                " unchanged;",
                " ",
                Ge("skipped"),
                " skipped; ",
                Ge("failed"),
                " failed;",
                " ",
                Ge("pending"),
                " remaining."
              ] }) : /* @__PURE__ */ u("p", { children: [
                D.filter(Rt).length.toLocaleString(),
                " to change; ",
                Ge("unchanged").toLocaleString(),
                " already correct; ",
                it.length.toLocaleString(),
                " conflicts (",
                C ? "will replace" : "will skip",
                ").",
                ot.length > 0 && ` ${ot.length.toLocaleString()} already have a different answer in a category (${C ? "will replace" : "kept"}).`
              ] }),
              D.length > 0 && /* @__PURE__ */ u("p", { children: [
                "Dates:",
                " ",
                Me.length ? /* @__PURE__ */ u(me, { children: [
                  Tt(Me[0], "Earliest"),
                  Me.length > 1 && /* @__PURE__ */ u(me, { children: [
                    " to ",
                    Tt(Me[Me.length - 1], "Latest")
                  ] })
                ] }) : "none",
                Me.length < D.length && `; ${(D.length - Me.length).toLocaleString()} without a date`,
                "."
              ] })
            ] })
          ] }),
          p && /* @__PURE__ */ u(me, { children: [
            !F && /* @__PURE__ */ u("p", { children: [
              "Planned additions:",
              " ",
              Pe([
                ...new Set(D.flatMap((E) => V(E).added))
              ]),
              ". Planned removals:",
              " ",
              Pe([
                ...new Set(D.flatMap((E) => V(E).removed))
              ]),
              "."
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => At(!Be),
                children: Be ? "Hide occurrence details" : "Inspect occurrences and conflicts"
              }
            ),
            Be && /* @__PURE__ */ n("div", { className: "dq-batch-items", children: /* @__PURE__ */ u("table", { children: [
              /* @__PURE__ */ n("thead", { children: /* @__PURE__ */ u("tr", { children: [
                /* @__PURE__ */ n("th", { children: "Occurrence" }),
                /* @__PURE__ */ n("th", { children: "Changes / result" })
              ] }) }),
              /* @__PURE__ */ n("tbody", { children: D.map((E) => {
                var L;
                return /* @__PURE__ */ u("tr", { children: [
                  /* @__PURE__ */ n("td", { children: /* @__PURE__ */ u(
                    "a",
                    {
                      href: `/${X}/${E.item.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      children: [
                        (L = E.item.occurrence) == null ? void 0 : L.performer.name,
                        " —",
                        " ",
                        E.item.media.title || Et
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ u("td", { children: [
                    E.conflict && /* @__PURE__ */ n("strong", { children: "Conflict. " }),
                    F ? `${E.status}. ${E.error ?? ""}` : ir(E)
                  ] })
                ] }, E.item.key);
              }) })
            ] }) }),
            /* @__PURE__ */ u("div", { className: "dq-row", children: [
              !te && /* @__PURE__ */ u(me, { children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button primary",
                    disabled: I || !Ge("pending"),
                    onClick: () => void q("apply"),
                    children: F ? "Continue remaining" : "Apply batch"
                  }
                ),
                F && Ge("failed") > 0 && /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: I,
                    onClick: () => void q("retry"),
                    children: "Retry failed occurrences"
                  }
                )
              ] }),
              Ee && /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  disabled: I,
                  onClick: () => void q("undo"),
                  children: "Undo batch"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ u("div", { className: "dq-row", children: [
            I && /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => {
                  var E;
                  Le.current = !0, (E = se.current) == null || E.abort(), fe("Stopping after in-flight operations settle…");
                },
                children: [
                  "Cancel ",
                  se.current ? "preview" : "run"
                ]
              }
            ),
            F && /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: I,
                onClick: qt,
                children: "New batch"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: I,
                onClick: H,
                children: "Close"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
const lo = "data-quality.description-collapsed.v1";
function _a() {
  try {
    return localStorage.getItem(lo) === "true";
  } catch {
    return !1;
  }
}
function Da({
  details: e,
  label: t
}) {
  const [r, i] = S(_a), a = tr(() => {
    i((s) => {
      const o = !s;
      try {
        localStorage.setItem(lo, String(o));
      } catch {
      }
      return o;
    });
  }, []);
  return /* @__PURE__ */ u("section", { className: "dq-review-description", "aria-label": `${t} description`, children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-button dq-description-toggle",
        "aria-expanded": !r,
        onClick: a,
        children: "Description"
      }
    ),
    !r && (e != null && e.trim() ? /* @__PURE__ */ n(Po, { className: "dq-description-body", children: e }) : /* @__PURE__ */ n("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
function Zr({
  performer: e
}) {
  return /* @__PURE__ */ u("span", { className: "dq-performer-avatar", "aria-hidden": "true", children: [
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
function ja({
  ranking: e,
  busy: t,
  error: r,
  focus: i,
  disabled: a,
  labels: s,
  onFocus: o,
  onMore: f,
  onRefresh: d
}) {
  var y;
  const p = e ? e.ranked.slice(0, e.limit) : [], h = !!e && (e.ranked.length > e.limit || (((y = e.candidates[e.cursor]) == null ? void 0 : y.total) ?? 0) > 0);
  return /* @__PURE__ */ u("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ u("div", { className: "dq-performer-ranking-status", children: [
      r ? /* @__PURE__ */ u("p", { role: "alert", children: [
        "Could not rank performers. ",
        r
      ] }) : t ? /* @__PURE__ */ u("p", { role: "status", children: [
        "Counting matching ",
        s.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ n("p", { children: p.length ? `Most matching ${s.many} first.` : `No performer has matching ${s.many}.` }) : null,
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button",
          disabled: t || a,
          onClick: d,
          children: "Refresh"
        }
      )
    ] }),
    /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: p.map((A) => {
      const C = `${A.count.toLocaleString()} matching ${A.count === 1 ? s.one : s.many}`, v = A.flags.length ? `Flagged: ${A.flags.join(", ")}` : "";
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-button dq-ranked-performer",
          "aria-label": `${A.name}, ${C}${v ? `. ${v}` : ""}`,
          title: v || void 0,
          "aria-pressed": i === A.id,
          disabled: a,
          onClick: () => o(A.id),
          children: [
            /* @__PURE__ */ n(Zr, { performer: A }),
            /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: A.name }),
            v && /* @__PURE__ */ n("span", { className: "dq-performer-flag", "aria-hidden": "true", children: "Flag" }),
            /* @__PURE__ */ n("span", { className: "dq-ranked-count", "aria-hidden": "true", children: A.count.toLocaleString() })
          ]
        },
        A.id
      );
    }) }),
    h && !t && !r && /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-button",
        disabled: a,
        onClick: f,
        children: "Show more performers"
      }
    )
  ] });
}
function en(e) {
  const {
    page: t,
    perPage: r,
    sort: i,
    direction: a,
    sorts: s,
    seed: o,
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
function Ua(e) {
  const t = e.occurrence;
  return JSON.stringify([
    ae(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {},
    t.flagPerformerTagIds ?? []
  ]);
}
async function Ka(e, t) {
  const r = ae(e) === "audio", i = new Set(e.occurrence.flagPerformerTagIds ?? []), a = (f) => ({
    id: f.id,
    name: f.name,
    total: (r ? f.audioCount : f.videoCount) ?? 0,
    flags: (f.tags ?? []).filter((d) => i.has(d.id)).map((d) => d.name)
  }), s = e.occurrence, o = [];
  if (s.targetMode === "selected")
    for (const f of s.performerIds) {
      const d = await ca(
        `/api/performers/${f}`,
        { signal: t }
      );
      d && o.push(a(d));
    }
  else {
    const { _filterExpression: f, ...d } = s.targetMode === "filter" ? s.performerFilter : {};
    for (let p = 1; ; p++) {
      const h = await Q(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            fr({
              findFilter: {
                page: p,
                perPage: 1e3,
                sort: r ? "audio_count" : "video_count",
                direction: "desc"
              },
              objectFilter: d,
              filterExpression: f
            })
          )
        }
      );
      if (o.push(...h.items.map(a)), p * 1e3 >= h.totalCount || !h.items.length) break;
    }
  }
  return o.sort((f, d) => d.total - f.total || f.id - d.id);
}
function uo(e, t, r) {
  const i = Hn(e, [t]);
  return ua(i, i.view.filter, r);
}
function fo(e, t) {
  const r = e.findIndex(
    (i) => i.count < t.count || i.count === t.count && i.name.localeCompare(t.name) > 0
  );
  e.splice(r < 0 ? e.length : r, 0, t);
}
function $n(e, t, r, i) {
  if (t >= e.length) return !0;
  const a = e[t].total;
  return a <= 0 ? !0 : r.length >= i && a < r[i - 1].count;
}
async function Ba(e, t, r, i, a = {}) {
  const s = en(e), o = Ua(e), f = io(e.occurrence), d = (t == null ? void 0 : t.signature) === s && !t.partial ? t : {
    signature: s,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: f ? "" : o,
    candidates: f ? [] : (t == null ? void 0 : t.candidatesKey) === o ? t.candidates : await Ka(e, i),
    cursor: 0,
    ranked: [],
    limit: r,
    complete: !1
  }, { candidates: p } = d, h = [...d.ranked];
  let y = d.cursor, A = !1;
  const C = (v) => ({
    ...d,
    cursor: y,
    ranked: [...h],
    limit: r,
    complete: !v && $n(p, y, h, r),
    ...v ? { partial: v } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: a.concurrency ?? 6 }, async () => {
        var v;
        for (; !A && !$n(p, y, h, r); ) {
          i.throwIfAborted();
          const I = p[y++], w = await uo(e, I.id, i);
          w > 0 && fo(h, { ...I, count: w }), (v = a.onProgress) == null || v.call(a, C(!0));
        }
      })
    );
  } catch (v) {
    throw A = !0, v;
  }
  return i.throwIfAborted(), C(!1);
}
function Va(e, t, r) {
  const i = e.candidates.findIndex((s) => s.id === t);
  if (e.partial || i < 0 || i >= e.cursor) return e;
  const a = e.ranked.filter((s) => s.id !== t);
  return r > 0 && fo(a, { ...e.candidates[i], count: r }), {
    ...e,
    ranked: a,
    complete: $n(e.candidates, e.cursor, a, e.limit)
  };
}
function jr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((o, f) => jr(o, t[f]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, a = Object.keys(r).sort(), s = Object.keys(i).sort();
  return a.length === s.length && a.every(
    (o, f) => o === s[f] && jr(r[o], i[o])
  );
}
const fn = [
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
], Ga = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function Sr(e) {
  const t = ie(e) ? e.occurrence : void 0;
  return {
    filter: Ke({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, ae(e)),
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
function bi(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function Fn(e, t) {
  let r;
  if (ie(e) && t.has("performer") && (r = Number(t.get("performer")), !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!fn.some((f) => f !== "performer" && t.has(f))) {
    const f = Sr(e);
    return {
      query: r ? { ...f, performerFocus: r } : f,
      startAtEnd: f.startFrom === "end"
    };
  }
  const a = {
    q: t.get("q") ?? "",
    page: Number(t.get("page") ?? 1),
    perPage: Number(t.get("perPage") ?? 40),
    sort: t.get("sort") ?? "date",
    direction: t.get("direction") === "asc" ? "asc" : "desc"
  };
  if (t.has("seed") && (a.seed = Number(t.get("seed"))), t.get("sorts")) {
    const f = t.get("sorts").split(",").map((d) => {
      const p = d.lastIndexOf(":");
      return { key: d.slice(0, p), direction: d.slice(p + 1) };
    });
    if (f.some((d) => !d.key || !["asc", "desc"].includes(d.direction)))
      throw new Error("Invalid review URL sort.");
    a.sorts = f, a.sort = f[0].key, a.direction = f[0].direction;
  }
  let s;
  if (ie(e) && (s = {
    ...Ga,
    ...bi(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(s.targetMode) || !dn.includes(s.condition) || !Array.isArray(s.performerIds) || !Array.isArray(s.conditionTagIds) || typeof s.includeSubtags != "boolean" || typeof s.hideConfirmedAbsent != "boolean" || [...s.performerIds, ...s.conditionTagIds].some(
    (f) => !Number.isSafeInteger(f) || f <= 0
  ) || !s.performerFilter || typeof s.performerFilter != "object" || Array.isArray(s.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const o = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Ke(a, ae(e)),
      objectFilter: bi(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: o,
      performerScope: s,
      ...r ? { performerFocus: r } : {}
    },
    startAtEnd: !t.has("page") && o === "end"
  };
}
function Lr(e, t) {
  const r = new URLSearchParams(window.location.search);
  fn.forEach((i) => r.delete(i)), r.set("review", e);
  for (const i of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[i] !== void 0 && r.set(i, String(t.filter[i]));
  Array.isArray(t.filter.sorts) && r.set(
    "sorts",
    t.filter.sorts.map((i) => `${i.key}:${i.direction}`).join(",")
  ), r.set("filters", JSON.stringify(t.objectFilter)), r.set("searchMode", t.searchMode), r.set("startFrom", t.startFrom), t.performerScope && r.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && r.set("performer", String(t.performerFocus)), window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${r}${window.location.hash}`
  );
}
function Ft(e, t) {
  const r = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return ie(e) ? {
    ...e,
    view: r,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: r };
}
function wi(e, t) {
  return !t || !ie(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function wn(e, t) {
  if (!t) return e;
  const r = /* @__PURE__ */ new Map();
  for (const i of e)
    r.set(i.media.id, [...r.get(i.media.id) ?? [], i]);
  return [...r.values()].reverse().flat();
}
const pt = (e) => e instanceof Error ? e.message : "Request failed.", yn = 50;
function Ja({
  actions: e,
  disabled: t,
  canWrite: r,
  canAssess: i = !0,
  onApply: a
}) {
  const [s, o] = S({});
  J(() => {
    let d = !0;
    return Promise.all(
      [
        ...new Set(
          e.flatMap(
            (p) => p.steps.flatMap((h) => h.tagIds)
          )
        )
      ].map(async (p) => {
        try {
          return [
            p,
            (await Q(`/api/tags/${p}`)).name
          ];
        } catch {
          return [p, "Unavailable tag"];
        }
      })
    ).then((p) => {
      d && o(Object.fromEntries(p));
    }), () => {
      d = !1;
    };
  }, [e]);
  const f = {
    ADD: "Add",
    REMOVE: "Remove",
    REMOVE_TREE: "Remove tree",
    MARK_PRESENT: "Mark present",
    MARK_ABSENT: "Mark absent",
    CLEAR_ABSENCE: "Clear absence"
  };
  return /* @__PURE__ */ u("div", { className: "dq-review-actions", children: [
    /* @__PURE__ */ n("p", { children: "Actions apply and advance. Shift-click or Shift + shortcut applies and stays." }),
    e.map((d, p) => /* @__PURE__ */ u("div", { className: "dq-action-pair", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: t || !r && d.steps.length > 0 || !i && Jt(d),
          onClick: (h) => a(d, h.shiftKey),
          children: /* @__PURE__ */ u("span", { children: [
            rr(d, p) && /* @__PURE__ */ n("kbd", { children: rr(d, p) }),
            " ",
            d.label
          ] })
        }
      ),
      d.steps.length > 0 && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button dq-apply-stay-button",
          disabled: t || !r || !i && Jt(d),
          "aria-label": `Apply & stay: ${d.label}`,
          title: `Apply & stay: ${d.label}`,
          onClick: () => a(d, !0),
          children: /* @__PURE__ */ n(jn, { "aria-hidden": "true" })
        }
      ),
      d.steps.length > 0 && /* @__PURE__ */ n("small", { className: "dq-review-action-summary", children: d.steps.map(
        (h) => `${f[h.mode]}: ${h.tagIds.map((y) => s[y] ?? "Loading tag…").join(", ")}`
      ).join("; ") })
    ] }, d.id))
  ] });
}
function Qa({
  review: e,
  canWrite: t,
  canAssess: r = !0,
  onBusy: i,
  onSaveDefaults: a,
  editRequest: s = 0,
  renderRuleEditor: o
}) {
  var Ir;
  const f = ae(e), d = Ct(f), p = f === "audio" ? "Audio" : "Scene", h = (l) => {
    var m;
    return l.title || ((m = l.files[0]) == null ? void 0 : m.basename) || p;
  }, y = (l) => `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${h(l.media)}`, A = $(null), C = $("");
  if (!A.current)
    try {
      A.current = Fn(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (l) {
      C.current = pt(l), A.current = { query: Sr(e), startAtEnd: !1 };
    }
  const [v, I] = S(null), w = $(null), k = $(null), _ = $(null), [ue, fe] = S(!!C.current), Oe = $(0), [g, F] = S(A.current.query), O = $(g);
  O.current = g;
  const [te, ye] = S(0), U = $(A.current.startAtEnd), [X, Xe] = S([]), [P, Et] = S(null), oe = $(null), [Nt, Be] = S(null), [At, nr] = S(0), Nr = Gt(() => {
    if (!P) return null;
    const l = X.findIndex((m) => m.key === P.key);
    return l < 0 ? null : X.slice(l + 1).find((m) => m.media.id !== P.media.id) ?? null;
  }, [P, X]), [nt, Qt] = S(0), [qe, Le] = S(!1), [se, Ze] = S(!1), ve = $(!1), Se = $(!0), Ve = $(null);
  J(() => (Se.current = !0, () => {
    Se.current = !1;
  }), []);
  const [qt, H] = S(C.current), [_e, W] = S(""), [q, D] = S(null), [Ce, et] = S(!1), [V, Rt] = S([]), ir = $([]), it = $(null), ot = $(null), Ge = $(null);
  J(() => {
    var l, m;
    Ce && ((m = (l = Ge.current) == null ? void 0 : l.querySelector("input")) == null || m.focus());
  }, [Ce]);
  const [Ee, Pe] = S(!1);
  J(() => {
    if (qe || Ee || !ot.current) return;
    const l = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const m = ot.current;
      m != null && m.isConnected && !m.disabled && m.focus(), ot.current = null;
    });
    return () => cancelAnimationFrame(l);
  }, [qe, Ee, te]);
  const [Me, Tt] = S([]), [zt, or] = S({}), E = $(null), L = $(0), [pe, gt] = S({});
  J(() => {
    let l = !0;
    return Promise.all(
      Qn(g.objectFilter).map(
        async (m) => [
          String(m),
          (await Q(`/api/tags/${m}`)).name
        ]
      )
    ).then((m) => {
      l && gt(Object.fromEntries(m));
    }).catch(() => {
    }), () => {
      l = !1;
    };
  }, [g.objectFilter]);
  const Je = Gt(
    () => zn(g.objectFilter, pe),
    [pe, g.objectFilter]
  ), Z = $(0), Wt = $(e);
  Wt.current = e;
  const Ar = v ?? e, at = Gt(
    () => Ft(Ar, g),
    [Ar, g]
  ), he = Gt(
    () => wi(at, g.performerFocus),
    [at, g.performerFocus]
  ), gr = $(he);
  gr.current = he;
  const Y = $(at);
  Y.current = at;
  const [mt, $e] = S("items"), [st, Vr] = S(null), Lt = $(null), qr = $("");
  function Ht(l) {
    const m = typeof l == "function" ? l(Lt.current) : l;
    Lt.current = m, Vr(m);
  }
  const [Qe, ze] = S(!1), [kt, It] = S(null), Ne = $(null), ce = ie(at) ? en(at) : "", [De, We] = S(0), [Fe, _t] = S(null);
  J(() => () => {
    var l;
    return (l = Ne.current) == null ? void 0 : l.controller.abort();
  }, []), J(() => {
    const l = Ne.current;
    !l || l.signature === ce || (l.controller.abort(), Ne.current = null, ze(!1));
  }, [ce]), J(() => {
    var R;
    const l = Lt.current;
    if (mt !== "performers" || !ce || ((R = Ne.current) == null ? void 0 : R.signature) === ce || qr.current === ce || (l == null ? void 0 : l.signature) === ce && l.complete)
      return;
    const m = (l == null ? void 0 : l.signature) === ce ? l : null;
    mr(l, (m == null ? void 0 : m.limit) ?? yn);
  }, [mt, ce, st, kt, Qe]);
  const je = g.performerFocus, Rr = JSON.stringify(
    ie(at) ? at.occurrence.flagPerformerTagIds ?? [] : []
  );
  J(() => {
    if (!je) {
      _t(null);
      return;
    }
    let l = !0;
    const m = new Set(JSON.parse(Rr));
    return Q(
      `/api/performers/${je}`
    ).then((R) => {
      l && _t({
        id: je,
        name: R.name,
        flags: (R.tags ?? []).filter((x) => m.has(x.id)).map((x) => x.name)
      });
    }).catch(() => {
    }), () => {
      l = !1;
    };
  }, [je, Rr]);
  const Dt = g.startFrom !== (e.view.startFrom ?? "end") || !jr(
    JSON.parse($t(Ft(e, g))),
    JSON.parse($t(Ft(e, Sr(e))))
  ), ct = se || qe || Ce, Ot = Number(g.filter.page);
  function He(l, m = !1) {
    ve.current || (C.current = "", U.current = m, O.current = l, F(l), Qt(0), Le(!0), m || Lr(e.id, l), ye((R) => R + 1));
  }
  function lt() {
    if (ve.current = !1, Ze(!1), Se.current && Ve.current) {
      const l = Ve.current;
      Ve.current = null, He(l.query, l.startAtEnd);
    }
  }
  J(() => {
    const l = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const m = Fn(
            Wt.current,
            new URLSearchParams(window.location.search)
          );
          ve.current ? Ve.current = m : He(m.query, m.startAtEnd);
        } catch (m) {
          H(pt(m));
        }
    };
    return window.addEventListener("popstate", l), () => window.removeEventListener("popstate", l);
  }, [e.id]), J(() => (i(se || qe || Ce || !!v), () => i(!1)), [se, qe, Ce, !!v, i]);
  async function ar(l, m, R) {
    if (ie(l)) {
      const j = await oo(
        l,
        E.current,
        m,
        R
      );
      return {
        items: j.items.map((B) => ({
          key: B.key,
          media: B.media,
          occurrence: B
        })),
        totalCount: j.totalCount
      };
    }
    const x = await xr(
      l,
      { ...l.view.filter, page: m },
      R
    );
    return {
      items: x.items.map((j) => ({ key: String(j.id), media: j })),
      totalCount: x.totalCount
    };
  }
  function ee(l, m, R, x = !1, j = !1) {
    if (!Se.current || Ve.current) return;
    fe(!0), Xe(
      j ? l.items : wn(l.items, O.current.startFrom === "end")
    ), Qt(l.totalCount), Pt(R, x);
    const B = {
      ...O.current,
      filter: { ...O.current.filter, page: m }
    };
    O.current = B, F(B), Lr(e.id, B);
  }
  function Pt(l, m = !1) {
    (l == null ? void 0 : l.key) !== (P == null ? void 0 : P.key) && (oe.current = null), (l == null ? void 0 : l.media.id) !== (P == null ? void 0 : P.media.id) && Be(m && l ? l.media.id : null), Et(l);
  }
  J(() => {
    if (C.current) return;
    const l = new AbortController();
    _.current = l;
    const m = ++Z.current;
    return Le(!0), H(""), W(""), oe.current = null, Be(null), Et(null), Xe([]), et(!1), (async () => {
      const R = wi(
        Ft(Wt.current, O.current),
        O.current.performerFocus
      );
      E.current = ie(R) ? await Wn(R, l.signal) : null;
      let x = Number(R.view.filter.page), j = await ar(R, x, l.signal);
      const B = Math.max(
        1,
        Math.ceil(j.totalCount / Number(R.view.filter.perPage))
      );
      (U.current || x > B) && (x = B, j = await ar(R, x, l.signal)), U.current = !1;
      const le = R.view.startFrom === "end" ? -1 : 1;
      for (; ie(R) && !j.items.length && x + le >= 1 && x + le <= B && !l.signal.aborted; )
        x += le, j = await ar(R, x, l.signal);
      if (m !== Z.current || l.signal.aborted) return;
      const ke = wn(j.items, R.view.startFrom === "end");
      ee(j, x, ke[0] ?? null);
    })().catch((R) => {
      !l.signal.aborted && m === Z.current && H(pt(R));
    }).finally(() => {
      !l.signal.aborted && m === Z.current && (fe(!0), Le(!1));
    }), () => {
      l.abort(), Z.current++;
    };
  }, [te, e.id]), J(() => {
    if (D(null), !P) return;
    let l = !0;
    return St(f, P).then((m) => {
      l && (D(m), Tt(
        ie(e) ? m.ids.filter((R) => e.occurrence.tagIds.includes(R)) : []
      ));
    }).catch((m) => {
      l && H(`Could not load current tags. ${pt(m)}`);
    }), () => {
      l = !1;
    };
  }, [P]), J(() => {
    if (!ie(e) || e.actions.length)
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
      l && or(Object.fromEntries(m));
    }).catch((m) => {
      l && H(pt(m));
    }), () => {
      l = !1;
    };
  }, [e]);
  async function Yt(l = !1, m = !1, R = !1) {
    var br;
    if (!P) return;
    const x = X.findIndex((de) => de.key === P.key), j = g.startFrom === "end" ? -1 : 1, B = ((br = oe.current) == null ? void 0 : br.key) === P.key ? oe.current : { key: P.key, page: Ot, before: X.slice(0, x + 1).map((de) => de.key), after: X.slice(x + 1).map((de) => de.key) }, le = new Set(B.after), ke = new Set(B.before), Kt = X.find((de) => {
      var tt;
      return le.has(de.key) || (j === 1 || Ot < B.page) && ((tt = oe.current) == null ? void 0 : tt.key) === P.key && !ke.has(de.key);
    });
    if (!l && Kt) {
      Pt(Kt, R);
      return;
    }
    const Re = l ? ke : new Set(X.map((de) => de.key)), ut = 1100 - (Date.now() - L.current);
    ut > 0 && await new Promise((de) => window.setTimeout(de, ut));
    let xe = j === -1 && !l ? Math.max(1, Ot - 1) : Ot;
    for (; Se.current && !Ve.current; ) {
      let de = await ar(he, xe);
      const tt = Math.max(
        1,
        Math.ceil(de.totalCount / Number(g.filter.perPage))
      );
      xe > tt && (xe = tt, de = await ar(he, xe));
      const Mt = wn(de.items, j === -1), ne = new Map(Mt.map((Ye) => [Ye.key, Ye])), Qr = l ? B.after.flatMap((Ye) => {
        const wr = ne.get(Ye);
        return wr ? [wr] : [];
      }) : [], Or = new Set(Qr.map((Ye) => Ye.key)), ht = l ? {
        ...de,
        items: [
          ...Qr,
          ...Mt.filter(
            (Ye) => Ye.key !== P.key && !Or.has(Ye.key)
          )
        ]
      } : de;
      if (m) {
        oe.current = B, ee(ht, xe, P, !1, l);
        return;
      }
      const Pr = j === -1 && Ot === 1 && !l ? void 0 : ht.items.find(
        (Ye) => !Re.has(Ye.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(l && j === -1 && xe === B.page) || le.has(Ye.key))
      );
      if (Pr || (j === -1 ? xe <= 1 : xe >= tt)) {
        ee(
          ht,
          xe,
          Pr ?? null,
          R,
          l
        ), Pr || W(
          de.totalCount ? `Reached the end in this direction. Matching items remain available from the ${d.queue} pages.` : `No matching ${d.many}.`
        );
        return;
      }
      xe += j;
    }
  }
  async function jt(l, m = !1, R = !1, x = !1) {
    if (v || !P || ve.current || qe || Ce && !R)
      return;
    const j = R || x || !!(l != null && l.steps.length), B = j && !m;
    if (j && (!t || !q) || l && Jt(l) && !r) return;
    ve.current = !0, Ze(!0), H(""), W("");
    const le = X.findIndex((Re) => Re.key === P.key), ke = j && !m && le >= 0 ? X[le + 1] ?? null : null;
    ke && (Xe(
      (Re) => Re.filter((ut) => ut.key !== P.key)
    ), Pt(ke, !0));
    let Kt = !1;
    try {
      if (j) {
        const Re = await St(f, P);
        if (l)
          await Ra(he, P, l);
        else {
          const xe = x && ie(e) ? e.occurrence.tagIds.filter((tt) => Re.ids.includes(tt)) : ir.current, de = Er(xe, x ? Me : V);
          await Xn(he, P, de);
        }
        L.current = Date.now();
        const ut = await St(f, P);
        ke || D(ut), Kt = !0, et(!1), W("Tags saved."), P.occurrence && (cr(P.occurrence.performer.id), We((xe) => xe + 1));
      }
      if (!Se.current || Ve.current) return;
      j ? await Yt(!0, m, B) : m || await Yt(), m && R && requestAnimationFrame(() => {
        var Re;
        return (Re = it.current) == null ? void 0 : Re.focus();
      });
    } catch (Re) {
      if (H(
        Kt ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${pt(Re)}` : j ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${pt(Re)}` : `Could not advance. ${pt(Re)}`
      ), j && !Kt) {
        ke && (Xe(X), Be(null), nr((ut) => ut + 1), Et(P)), L.current = Date.now();
        try {
          D(await St(f, P));
        } catch {
          D(null), H(
            (ut) => `${ut} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      lt();
    }
  }
  J(() => {
    const l = (m) => {
      if (Ce || v || se || qe || Ee || m.defaultPrevented || m.repeat || m.ctrlKey || m.altKey || m.metaKey || !Bi(m.target) || document.querySelector('[role="dialog"], dialog[open]'))
        return;
      const R = m.key.toLowerCase(), x = e.actions.find(
        (j, B) => rr(j, B) === R
      );
      x && (m.preventDefault(), m.stopPropagation(), jt(x, m.shiftKey));
    };
    return document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l);
  });
  function Tr() {
    !a || v || ve.current || Ce || (k.current = document.activeElement, w.current = {
      error: qt,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(O.current),
      items: X,
      current: P,
      total: nt,
      targets: E.current,
      stayedCursor: oe.current
    }, I(structuredClone(Ft(e, O.current))), W(""), H(""));
  }
  J(() => {
    s && s !== Oe.current && ue && !qe && (Oe.current = s, Tr());
  }, [s, qe, ue]);
  function sr() {
    I(null), requestAnimationFrame(() => {
      var l;
      return (l = k.current) == null ? void 0 : l.focus();
    });
  }
  function Ut() {
    var m;
    const l = w.current;
    !l || se || ((m = _.current) == null || m.abort(), Z.current++, O.current = l.query, F(l.query), Xe(l.items), Et(l.current), Qt(l.total), E.current = l.targets, oe.current = l.stayedCursor, Le(!1), H(l.error), W(""), window.history.replaceState(window.history.state, "", l.url), sr());
  }
  async function kr() {
    if (!v || !a || ve.current) return;
    const l = Ft(
      { ...v, name: v.name.trim() },
      O.current
    ), m = tn(l);
    if (m) {
      H(m);
      return;
    }
    ve.current = !0, Ze(!0), H("");
    try {
      if (await a(l) === !1) throw new Error("Could not save review.");
      sr(), W("Review saved.");
    } catch (R) {
      H(
        "Could not save review. Your edits are still open. " + pt(R)
      );
    } finally {
      lt();
    }
  }
  async function Xt() {
    if (!a || ve.current) return;
    const l = Ft(e, {
      ...O.current,
      filter: { ...O.current.filter, page: 1 }
    });
    ve.current = !0, Ze(!0), H("");
    try {
      if (await a(l) === !1) throw new Error("Could not save review.");
      W("Queue saved to this review.");
    } catch (m) {
      H("Could not save queue. " + pt(m));
    } finally {
      lt();
    }
  }
  const K = g.performerScope, dt = (l) => {
    const { performerFocus: m, ...R } = O.current, x = m && !("targetMode" in l || "performerIds" in l || "performerFilter" in l);
    He({
      ...R,
      ...x ? { performerFocus: m } : {},
      filter: { ...R.filter, page: 1 },
      performerScope: { ...K, ...l }
    });
  };
  async function mr(l, m) {
    var j;
    const R = Y.current;
    if (!ie(R)) return;
    (j = Ne.current) == null || j.controller.abort();
    const x = {
      signature: en(R),
      controller: new AbortController()
    };
    Ne.current = x, qr.current = "", ze(!0), It(null);
    try {
      const B = await Ba(R, l, m, x.controller.signal, {
        onProgress: (le) => {
          Ne.current === x && Ht(le);
        }
      });
      Ne.current === x && Ht(B);
    } catch (B) {
      Ne.current === x && !x.controller.signal.aborted && (qr.current = x.signature, It({ signature: x.signature, message: pt(B) }));
    } finally {
      Ne.current === x && (Ne.current = null, ze(!1));
    }
  }
  function Zt() {
    var l;
    (l = Ne.current) == null || l.controller.abort(), Ne.current = null, ze(!1), Ht((m) => m && { ...m, partial: !0, complete: !1 });
  }
  async function cr(l) {
    var j;
    const m = Y.current;
    if (!ie(m)) return;
    if (Ne.current) {
      Zt();
      return;
    }
    const R = en(m);
    if (((j = Lt.current) == null ? void 0 : j.signature) !== R || Lt.current.partial) return;
    const x = 1100 - (Date.now() - L.current);
    x > 0 && await new Promise((B) => window.setTimeout(B, x));
    try {
      const B = await uo(m, l);
      if (Ne.current) {
        Zt();
        return;
      }
      Ht(
        (le) => (le == null ? void 0 : le.signature) === R ? Va(le, l, B) : le
      );
    } catch {
      Ht(
        (B) => (B == null ? void 0 : B.signature) === R ? { ...B, partial: !0, complete: !1 } : B
      );
    }
  }
  const hr = g.performerFocus ? st == null ? void 0 : st.candidates.find((l) => l.id === g.performerFocus) : void 0, Te = (Fe == null ? void 0 : Fe.id) === g.performerFocus ? Fe : hr ?? null;
  function Gr(l) {
    if (ve.current) return;
    const m = {
      ...O.current,
      performerFocus: l,
      filter: { ...O.current.filter, page: 1 }
    };
    He(m, m.startFrom === "end"), $e("items");
  }
  function Jr() {
    const { performerFocus: l, ...m } = O.current;
    He(
      { ...m, filter: { ...m.filter, page: 1 } },
      m.startFrom === "end"
    );
  }
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-review-workspace${f === "audio" ? " dq-audio" : ""}`,
      "aria-label": K ? f === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : f === "audio" ? "Audio review" : "Video review",
      children: [
        v && /* @__PURE__ */ u("section", { className: "dq-rule-editor", "aria-label": "Edit review rule", children: [
          /* @__PURE__ */ n("h2", { children: "Edit review" }),
          /* @__PURE__ */ n("p", { children: "Preview matching scenes below. Save review keeps all rule changes; Cancel restores your previous view." }),
          /* @__PURE__ */ u("fieldset", { disabled: se, children: [
            o == null ? void 0 : o(
              Ft(v, g),
              I,
              se
            ),
            /* @__PURE__ */ u("label", { children: [
              "Review direction",
              /* @__PURE__ */ u(
                "select",
                {
                  "aria-label": "Review direction",
                  value: g.startFrom,
                  onChange: (l) => He({
                    ...O.current,
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
          /* @__PURE__ */ u("div", { className: "dq-row", children: [
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button primary",
                type: "button",
                disabled: se || qe,
                onClick: () => void kr(),
                children: "Save review"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button",
                type: "button",
                disabled: se,
                onClick: Ut,
                children: "Cancel"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u(
          "fieldset",
          {
            className: "dq-review-filters",
            disabled: ct,
            onClickCapture: (l) => {
              var x;
              const m = l.target instanceof Element ? l.target.closest("button") : null, R = (m == null ? void 0 : m.getAttribute("aria-label")) ?? ((x = m == null ? void 0 : m.textContent) == null ? void 0 : x.trim()) ?? "";
              m && !m.closest('[role="dialog"], dialog') && /^(Filters|Edit filter:|Edit performer criteria)/.test(R) && (ot.current = m);
            },
            children: [
              /* @__PURE__ */ n("legend", { children: f === "audio" ? "Audio filters" : "Scene filters" }),
              /* @__PURE__ */ u("div", { className: "dq-queue-toolbar", children: [
                /* @__PURE__ */ n(
                  _r,
                  {
                    filter: g.filter,
                    objectFilter: Je,
                    criteriaDefinitions: f === "audio" ? _n : cn,
                    customFieldEntityType: f,
                    totalCount: nt,
                    sortOptions: f === "audio" ? Ri : Dn,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    onFilterChange: (l) => {
                      (l.sort !== O.current.filter.sort || l.direction !== O.current.filter.direction) && (l = { ...l, sorts: void 0 }), He({
                        ...O.current,
                        filter: Ke(l, f)
                      });
                    },
                    onObjectFilterChange: (l) => {
                      He({
                        ...O.current,
                        objectFilter: ro(
                          l,
                          pe,
                          O.current.objectFilter
                        ),
                        filter: { ...O.current.filter, page: 1 }
                      });
                    }
                  }
                ),
                !v && Dt && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      "aria-label": "Save changes to review filters",
                      title: "Save changes to review filters",
                      disabled: !a,
                      onClick: () => void Xt(),
                      children: /* @__PURE__ */ n(jn, { "aria-hidden": "true" })
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
                        const l = Sr(e);
                        He(l, l.startFrom === "end");
                      },
                      children: /* @__PURE__ */ n(Mi, { "aria-hidden": "true" })
                    }
                  )
                ] })
              ] }),
              K && /* @__PURE__ */ u("div", { className: "dq-scope-controls", children: [
                /* @__PURE__ */ u("label", { children: [
                  "Performers to review",
                  " ",
                  /* @__PURE__ */ u(
                    "select",
                    {
                      value: K.targetMode,
                      onChange: (l) => dt({
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
                K.targetMode === "selected" && /* @__PURE__ */ n(
                  xt,
                  {
                    entityType: "performer",
                    values: K.performerIds,
                    onChange: (l) => dt({ performerIds: l }),
                    placeholder: "Select performers to review...",
                    allowCreate: !1
                  }
                ),
                K.targetMode === "filter" && /* @__PURE__ */ u(me, { children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => Pe(!0),
                      children: "Edit performer criteria"
                    }
                  ),
                  /* @__PURE__ */ n("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ n(
                    _r,
                    {
                      filter: {},
                      onFilterChange: () => {
                      },
                      totalCount: 0,
                      sortOptions: [],
                      showSearch: !1,
                      showSort: !1,
                      showPagingControls: !1,
                      criteriaDefinitions: Cn,
                      objectFilter: K.performerFilter,
                      onObjectFilterChange: (l) => dt({ performerFilter: l })
                    }
                  ) })
                ] }),
                g.performerFocus && /* @__PURE__ */ u(
                  "div",
                  {
                    className: "dq-performer-focus",
                    role: "group",
                    "aria-label": "Performer focus",
                    children: [
                      /* @__PURE__ */ n(
                        Zr,
                        {
                          performer: {
                            id: g.performerFocus,
                            name: (Te == null ? void 0 : Te.name) ?? ""
                          }
                        }
                      ),
                      /* @__PURE__ */ u("span", { children: [
                        "Only ",
                        (Te == null ? void 0 : Te.name) ?? `performer ${g.performerFocus}`
                      ] }),
                      Te != null && Te.flags.length ? /* @__PURE__ */ u("span", { className: "dq-performer-flag", children: [
                        "Flagged: ",
                        Te.flags.join(", ")
                      ] }) : null,
                      /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: Jr, children: "Show all performers" })
                    ]
                  }
                ),
                /* @__PURE__ */ u("label", { children: [
                  "Occurrence tags",
                  " ",
                  /* @__PURE__ */ n(
                    "select",
                    {
                      value: K.condition,
                      onChange: (l) => dt({
                        condition: l.target.value
                      }),
                      children: dn.map((l) => /* @__PURE__ */ n("option", { value: l, children: ln[l] }, l))
                    }
                  )
                ] }),
                !["any", "isNull"].includes(K.condition) && /* @__PURE__ */ u(me, { children: [
                  /* @__PURE__ */ n(
                    xt,
                    {
                      entityType: "tag",
                      values: K.conditionTagIds,
                      onChange: (l) => dt({ conditionTagIds: l }),
                      placeholder: "Occurrence condition tags...",
                      allowCreate: !1
                    }
                  ),
                  /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "checkbox",
                        checked: K.includeSubtags ?? !0,
                        onChange: (l) => dt({ includeSubtags: l.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  Cr(K.condition) && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "checkbox",
                        checked: K.hideConfirmedAbsent ?? !0,
                        onChange: (l) => dt({ hideConfirmedAbsent: l.target.checked })
                      }
                    ),
                    "Hide occurrences confirmed absent"
                  ] })
                ] })
              ] }),
              ie(at) && g.performerFocus && /* @__PURE__ */ n(
                co,
                {
                  review: at,
                  performerId: g.performerFocus,
                  revision: De
                }
              )
            ]
          }
        ),
        K && /* @__PURE__ */ n(
          Ti,
          {
            open: Ee,
            onClose: () => Pe(!1),
            criteria: Cn,
            activeFilter: K.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (l) => {
              Pe(!1), dt({ performerFilter: l });
            }
          }
        ),
        ie(he) && t && /* @__PURE__ */ n(
          La,
          {
            review: he,
            hidden: !!v,
            disabled: ct || !!v,
            performerFlags: g.performerFocus ? Te == null ? void 0 : Te.flags : void 0,
            onOpen: () => {
              ve.current = !0, Ze(!0);
            },
            onWrite: () => {
              L.current = Date.now();
            },
            onClose: (l) => {
              if (l) {
                L.current = Date.now();
                const m = O.current.performerFocus;
                m ? cr(m) : Zt(), We((R) => R + 1), new Promise((R) => window.setTimeout(R, 1100)).then(() => {
                  lt(), Se.current && ye((R) => R + 1);
                });
              } else lt();
            }
          }
        ),
        /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
          qt && /* @__PURE__ */ u("p", { role: "alert", children: [
            qt,
            " ",
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: se,
                onClick: () => {
                  P ? St(f, P).then(D).catch((l) => H(pt(l))) : He(O.current);
                },
                children: P ? "Reload tags" : "Retry queue"
              }
            )
          ] }),
          _e && /* @__PURE__ */ n("p", { role: "status", children: _e })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-review-layout", children: [
          /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
            K && /* @__PURE__ */ u("div", { className: "dq-queue-view", role: "group", "aria-label": "Queue view", children: [
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  "aria-pressed": mt === "items",
                  onClick: () => $e("items"),
                  children: f === "audio" ? "Audios" : "Scenes"
                }
              ),
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  "aria-pressed": mt === "performers",
                  onClick: () => $e("performers"),
                  children: "Performers"
                }
              )
            ] }),
            K && mt === "performers" ? /* @__PURE__ */ n(
              ja,
              {
                ranking: (st == null ? void 0 : st.signature) === ce ? st : null,
                busy: Qe,
                error: (kt == null ? void 0 : kt.signature) === ce ? kt.message : "",
                focus: g.performerFocus,
                disabled: ct,
                labels: d,
                onFocus: Gr,
                onMore: () => {
                  const l = Lt.current;
                  l && mr(l, l.limit + yn);
                },
                onRefresh: () => {
                  Ht(null), mr(null, yn);
                }
              }
            ) : /* @__PURE__ */ u(me, { children: [
              /* @__PURE__ */ n("fieldset", { disabled: ct, children: /* @__PURE__ */ n(
                ki,
                {
                  filter: g.filter,
                  totalCount: nt,
                  onFilterChange: (l) => He({ ...g, filter: Ke(l, f) })
                }
              ) }),
              /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: X.map((l) => /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  title: y(l),
                  "aria-label": y(l),
                  disabled: ct,
                  "aria-pressed": (P == null ? void 0 : P.key) === l.key,
                  onClick: () => {
                    Pt(l), H(""), W("");
                  },
                  children: [
                    l.occurrence && /* @__PURE__ */ n(Zr, { performer: l.occurrence.performer }),
                    /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: h(l.media) })
                  ]
                },
                l.key
              )) })
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-inspector", children: P ? /* @__PURE__ */ u(me, { children: [
            /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
              /* @__PURE__ */ n("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ n(
                "a",
                {
                  href: `/${f}/${P.media.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: P.media.title || ((Ir = P.media.files[0]) == null ? void 0 : Ir.basename) || `${f === "audio" ? "Audio" : "Video"} ${P.media.id}`
                }
              ) }),
              [P, Nr].filter(Boolean).map((l) => {
                var x, j, B, le, ke;
                const m = l, R = m.key === P.key;
                return /* @__PURE__ */ n(
                  "div",
                  {
                    className: R ? "dq-review-video-current" : "dq-review-video-preload",
                    "aria-hidden": R ? void 0 : !0,
                    inert: R ? void 0 : !0,
                    children: f === "audio" ? /* @__PURE__ */ n(
                      Mo,
                      {
                        streamUrl: In("audio", m.media.id),
                        format: ((x = m.media.files[0]) == null ? void 0 : x.format) ?? "",
                        title: h(m.media),
                        coverUrl: R ? pi("audio", m.media) : void 0,
                        duration: ((j = m.media.files[0]) == null ? void 0 : j.duration) ?? 0,
                        autostart: R && Nt === m.media.id
                      }
                    ) : /* @__PURE__ */ n(
                      Ii,
                      {
                        videoId: m.media.id,
                        streamUrl: In("video", m.media.id),
                        posterUrl: R ? pi("video", m.media) : void 0,
                        duration: ((B = m.media.files[0]) == null ? void 0 : B.duration) ?? 0,
                        format: (le = m.media.files[0]) == null ? void 0 : le.format,
                        audioCodec: (ke = m.media.files[0]) == null ? void 0 : ke.audioCodec,
                        extensionSurface: R ? "quick-view" : void 0,
                        autostart: R && Nt === m.media.id,
                        keyboardShortcutsEnabled: R,
                        showAbLoop: R,
                        clip: m.media.parentVideoId != null ? {
                          start: m.media.clipStartSec ?? 0,
                          end: m.media.clipEndSec,
                          loop: !1
                        } : void 0
                      }
                    )
                  },
                  `${m.media.id}:${At}`
                );
              }),
              f === "audio" && /* @__PURE__ */ n(
                Da,
                {
                  details: P.media.details,
                  label: d.one
                },
                P.media.id
              )
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-panel", children: [
              /* @__PURE__ */ n("h2", { children: P.occurrence ? `Reviewing ${P.occurrence.performer.name}` : `Reviewing this ${d.one}` }),
              /* @__PURE__ */ n("p", { children: K ? `Tags apply only to this performer in this ${d.one}.` : `Tags apply to the ${d.one}.` }),
              K && /* @__PURE__ */ n(
                "div",
                {
                  className: "dq-review-partners",
                  "aria-label": `Matching ${d.queue} partners`,
                  children: X.filter((l) => l.media.id === P.media.id).map((l) => {
                    var m, R;
                    return /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button dq-partner-button",
                        title: (m = l.occurrence) == null ? void 0 : m.performer.name,
                        "aria-label": (R = l.occurrence) == null ? void 0 : R.performer.name,
                        disabled: ct,
                        "aria-pressed": l.key === P.key,
                        onClick: () => {
                          Pt(l), H("");
                        },
                        children: l.occurrence && /* @__PURE__ */ n(
                          Zr,
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
              /* @__PURE__ */ u("p", { children: [
                "Current ",
                K ? "occurrence" : d.one,
                " tags:",
                " ",
                q ? q.names.join(", ") || "None" : "Loading…"
              ] }),
              q != null && q.absent.length ? /* @__PURE__ */ u("p", { children: [
                "Confirmed absent tags:",
                " ",
                /* @__PURE__ */ n(
                  xt,
                  {
                    entityType: "tag",
                    values: q.absent,
                    onChange: () => {
                    },
                    disabled: !0,
                    allowCreate: !1
                  }
                )
              ] }) : null,
              Ce ? /* @__PURE__ */ u(
                "fieldset",
                {
                  ref: Ge,
                  disabled: se,
                  className: "dq-tag-editor",
                  children: [
                    /* @__PURE__ */ u("legend", { children: [
                      "Edit ",
                      K ? "occurrence" : d.one,
                      " tags"
                    ] }),
                    /* @__PURE__ */ n(
                      xt,
                      {
                        entityType: "tag",
                        values: V,
                        onChange: Rt,
                        placeholder: "Choose tags for this item...",
                        allowCreate: !1
                      }
                    ),
                    /* @__PURE__ */ u("div", { className: "dq-row", children: [
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          disabled: !q,
                          onClick: () => void jt(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !q,
                          onClick: () => void jt(void 0, !1, !0),
                          children: "Save & next"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => {
                            et(!1), requestAnimationFrame(
                              () => {
                                var l;
                                return (l = it.current) == null ? void 0 : l.focus();
                              }
                            );
                          },
                          children: "Cancel"
                        }
                      )
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ u(me, { children: [
                /* @__PURE__ */ n(
                  Ja,
                  {
                    actions: Ar.actions,
                    canWrite: t,
                    canAssess: r,
                    disabled: se || qe || !q || !!v,
                    onApply: (l, m) => void jt(l, m)
                  }
                ),
                ie(e) && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                  "fieldset",
                  {
                    className: "dq-tag-choices",
                    disabled: !t || se || !q || !!v,
                    children: [
                      /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                      e.occurrence.tagIds.map((l) => /* @__PURE__ */ u("label", { children: [
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: e.occurrence.multiple ? "checkbox" : "radio",
                            name: "legacy-choice",
                            checked: Me.includes(l),
                            onChange: (m) => Tt(
                              e.occurrence.multiple ? m.target.checked ? [...Me, l] : Me.filter(
                                (R) => R !== l
                              ) : [l]
                            )
                          }
                        ),
                        zt[l] ?? "Loading tag…"
                      ] }, l)),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          onClick: () => Tt([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void jt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void jt(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-row", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ref: it,
                    className: "dq-button",
                    disabled: ct || !!v || !t || !q,
                    onClick: () => {
                      ir.current = [...q.ids], Rt([...q.ids]), et(!0);
                    },
                    children: "Edit tags"
                  }
                ),
                /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: ct || !!v,
                    onClick: () => void jt(),
                    children: [
                      "Skip",
                      K ? " performer" : ` ${d.one}`
                    ]
                  }
                )
              ] }),
              !t && /* @__PURE__ */ n("p", { children: "Write permission is required to change tags." })
            ] })
          ] }) : /* @__PURE__ */ n("p", { role: "status", children: qe ? "Loading review…" : nt ? "Reached the end in this direction." : `No matching ${d.many}.` }) })
        ] })
      ]
    }
  );
}
function yi({
  review: e,
  onChange: t,
  choices: r = !1
}) {
  const i = e.occurrence, a = Ct(ae(e)).queue, s = (o) => t({ ...e, occurrence: { ...i, ...o } });
  return r ? /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ u("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      a,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ n(
      xt,
      {
        entityType: "tag",
        values: i.tagIds,
        onChange: (o) => s({ tagIds: o }),
        placeholder: "Search review tag choices...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
      /* @__PURE__ */ n(
        "input",
        {
          type: "checkbox",
          checked: i.multiple,
          onChange: (o) => s({ multiple: o.target.checked })
        }
      ),
      "Allow multiple tags, for example when something changes part-way through the ",
      a
    ] }),
    /* @__PURE__ */ n("p", { children: "Save & next performer applies the selected tags and advances. Save choices stays on the performer. Skip only moves the cursor; eligibility comes from the filters." })
  ] }) : /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Occurrence condition (optional)" }),
    /* @__PURE__ */ n("p", { children: "Leave this unrestricted to review any appearance. Set performer matching in the review workspace and save it with the rule." }),
    /* @__PURE__ */ u("label", { children: [
      "Occurrence condition",
      /* @__PURE__ */ n(
        "select",
        {
          "aria-label": "Occurrence condition",
          value: i.condition,
          onChange: (o) => s({
            condition: o.target.value
          }),
          children: dn.map((o) => /* @__PURE__ */ n("option", { value: o, children: ln[o] }, o))
        }
      )
    ] }),
    !["any", "isNull"].includes(i.condition) && /* @__PURE__ */ u(me, { children: [
      /* @__PURE__ */ n(
        xt,
        {
          entityType: "tag",
          values: i.conditionTagIds,
          onChange: (o) => s({ conditionTagIds: o }),
          placeholder: "Search occurrence condition tags...",
          allowCreate: !1
        }
      ),
      /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
        /* @__PURE__ */ n(
          "input",
          {
            type: "checkbox",
            checked: i.includeSubtags ?? !0,
            onChange: (o) => s({ includeSubtags: o.target.checked })
          }
        ),
        "Include subtags"
      ] }),
      Cr(i.condition) && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
        /* @__PURE__ */ n(
          "input",
          {
            type: "checkbox",
            checked: i.hideConfirmedAbsent ?? !0,
            onChange: (o) => s({ hideConfirmedAbsent: o.target.checked })
          }
        ),
        "Hide occurrences confirmed absent"
      ] })
    ] }),
    /* @__PURE__ */ u("p", { children: [
      "Conditions check tags on the same performer’s occurrence, independently of ",
      a,
      " tags and the performer’s profile."
    ] })
  ] });
}
function za({
  review: e,
  onChange: t
}) {
  const r = Ct(ae(e)).many;
  return /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Performer flags" }),
    /* @__PURE__ */ u("p", { children: [
      "Flag performers whose profile has any of these tags in the performer list and batches, for example a tag noting that something changed during their career. Check a flagged performer’s earliest and latest ",
      r,
      " ",
      "before applying one batch to all of them."
    ] }),
    /* @__PURE__ */ n(
      xt,
      {
        entityType: "tag",
        values: e.occurrence.flagPerformerTagIds ?? [],
        onChange: (i) => {
          const { flagPerformerTagIds: a, ...s } = e.occurrence;
          t({
            ...e,
            occurrence: i.length ? { ...s, flagPerformerTagIds: i } : s
          });
        },
        placeholder: "Search performer flag tags...",
        allowCreate: !1
      }
    )
  ] });
}
function Wa(e) {
  var f, d, p;
  const [t, r] = S({}), [i, a] = S(""), s = (((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.annotations) ?? []).includes("tags") ? ((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotationParents) ?? [] : [], o = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...s,
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return J(() => {
    let h = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(o).map(
        async (y) => [y, await Br([y])]
      )
    ).then((y) => {
      h && r(Object.fromEntries(y));
    }).catch(() => {
      h && a(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      h = !1;
    };
  }, [o]), { ids: t, error: i };
}
function Ha(e, t, r) {
  const i = t == null ? void 0 : t.presentation, a = (i == null ? void 0 : i.annotations) ?? [], s = (i == null ? void 0 : i.annotationParents) ?? [];
  return {
    ...e,
    details: void 0,
    organized: !1,
    groups: [],
    galleries: [],
    date: a.includes("date") ? e.date : void 0,
    studioId: a.includes("studio") ? e.studioId : void 0,
    studioName: a.includes("studio") ? e.studioName : void 0,
    performers: a.includes("performers") ? e.performers : [],
    tags: a.includes("tags") && s.length > 0 ? (e.tags ?? []).filter(
      (o) => s.some(
        (f) => {
          var d;
          return f !== o.id && ((d = r[f]) == null ? void 0 : d.includes(o.id));
        }
      )
    ) : []
  };
}
function Ya({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: a
}) {
  var f, d, p;
  const s = new Set(
    (((f = t.presentation) == null ? void 0 : f.binParents) ?? []).flatMap(
      (h) => (r[h] ?? []).filter((y) => y !== h)
    )
  ), o = /* @__PURE__ */ new Map();
  for (const h of e)
    for (const y of h.tags ?? [])
      if (s.has(y.id)) {
        const A = o.get(y.id) ?? { name: y.name, count: 0 };
        A.count++, o.set(y.id, A);
      }
  return (p = (d = t.presentation) == null ? void 0 : d.binParents) != null && p.length ? /* @__PURE__ */ u("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...o].sort((h, y) => h[1].name.localeCompare(y[1].name)).map(([h, y]) => /* @__PURE__ */ u(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => a(h),
        children: [
          y.name,
          " (",
          y.count,
          ")"
        ]
      },
      h
    )),
    !o.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function Xa(e, t) {
  const { _filterExpression: r, ...i } = e.view.objectFilter;
  return {
    ...e,
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...Object.keys(i).length ? [{ filter: i }] : [],
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
function vi({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [a, s] = S(!1), o = Ae(e) === "tag" ? "tag" : ae(e), f = o === "tag" ? "tags" : `${o}s`, d = $o(
    o === "tag" ? void 0 : o,
    e.view.objectFilter
  ), p = e.view.filter, h = o === "tag" ? Oi : o === "audio" ? Ri : Dn, y = o === "tag" ? Pi : o === "audio" ? _n : cn, A = (w) => t({
    ...e,
    view: { ...e.view, filter: { ...p, ...w } }
  }), C = o === "video" ? e.presentation ?? {} : {}, v = o !== "audio", I = (w) => t({ ...e, presentation: { ...C, ...w } });
  return /* @__PURE__ */ u(me, { children: [
    i && /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ u("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(p.q ?? ""),
            onChange: (w) => A({ q: w.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ u("div", { className: "dq-field-grid", children: [
        /* @__PURE__ */ u("label", { children: [
          "Sort",
          /* @__PURE__ */ u(
            "select",
            {
              "aria-label": "Sort",
              value: String(p.sort ?? "date"),
              onChange: (w) => A({ sort: w.target.value, sorts: void 0 }),
              children: [
                !h.some((w) => w.value === p.sort) && p.sort != null && /* @__PURE__ */ n("option", { value: String(p.sort), children: String(p.sort) }),
                h.map((w) => /* @__PURE__ */ n("option", { value: w.value, children: w.label }, w.value))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ u("label", { children: [
          "Direction",
          /* @__PURE__ */ u(
            "select",
            {
              "aria-label": "Direction",
              value: String(p.direction ?? "desc"),
              onChange: (w) => A({ direction: w.target.value }),
              children: [
                /* @__PURE__ */ n("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ n("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ u("label", { children: [
          o === "tag" ? "Tags" : "Videos",
          " per page",
          /* @__PURE__ */ n(
            "input",
            {
              type: "number",
              min: "1",
              max: "1000",
              value: Number(p.perPage) || 40,
              onChange: (w) => A({
                perPage: Math.max(
                  1,
                  Math.min(1e3, Number(w.target.value) || 40)
                )
              })
            }
          )
        ] }),
        /* @__PURE__ */ u("label", { children: [
          "Start from",
          /* @__PURE__ */ u(
            "select",
            {
              "aria-label": "Start from",
              value: e.view.startFrom ?? "end",
              onChange: (w) => t({
                ...e,
                view: {
                  ...e.view,
                  startFrom: w.target.value
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
      /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-button",
          onClick: () => s(!0),
          children: [
            "Edit ",
            o,
            " filters"
          ]
        }
      ),
      /* @__PURE__ */ u("p", { children: [
        Object.keys(e.view.objectFilter).length ? `${o[0].toUpperCase()}${o.slice(1)} filters configured` : `No ${o} filters`,
        ". Choose which ",
        f,
        " enter the queue."
      ] }),
      a && /* @__PURE__ */ n("div", { onKeyDown: (w) => w.stopPropagation(), children: /* @__PURE__ */ n(
        Ti,
        {
          open: !0,
          onClose: () => s(!1),
          criteria: y,
          activeFilter: e.view.objectFilter,
          customSections: d ? [d] : void 0,
          supportsFilterExpressions: o !== "tag",
          subjectLabel: f,
          onApply: (w) => {
            t({ ...e, view: { ...e.view, objectFilter: w } }), s(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ u(me, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ u("p", { className: "dq-editor-note", children: [
        "Choose how ",
        o === "tag" ? "tags" : `${f} and tags`,
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ u("div", { className: "dq-field-grid", children: [
        ji(e) && /* @__PURE__ */ u("label", { children: [
          "Preferred review layout",
          /* @__PURE__ */ u(
            "select",
            {
              value: e.view.reviewMode ?? "single",
              onChange: (w) => t({ ...e, view: { ...e.view, reviewMode: w.target.value } }),
              children: [
                /* @__PURE__ */ n("option", { value: "single", children: "Single video" }),
                /* @__PURE__ */ n("option", { value: "multiple", children: "Multiple videos" })
              ]
            }
          )
        ] }),
        !ie(e) && v && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: e.view.selectAllOnLoad ?? !1,
              onChange: (w) => t({ ...e, view: { ...e.view, selectAllOnLoad: w.target.checked ? !0 : void 0 } })
            }
          ),
          "Select all ",
          f,
          " on page load",
          o === "video" && /* @__PURE__ */ n("small", { children: " (multiple-videos layout)" })
        ] }),
        v && /* @__PURE__ */ u("label", { children: [
          "Preferred view",
          /* @__PURE__ */ n(
            "select",
            {
              value: o === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid",
              onChange: (w) => t({
                ...e,
                view: {
                  ...e.view,
                  displayMode: w.target.value
                }
              }),
              children: (o === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((w) => /* @__PURE__ */ n("option", { children: w }, w))
            }
          )
        ] })
      ] }),
      o === "video" && /* @__PURE__ */ u(me, { children: [
        /* @__PURE__ */ n("h4", { children: "Card annotations" }),
        /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((w) => {
          const k = C.annotations ?? [];
          return /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: k.includes(w),
                onChange: (_) => I({
                  annotations: _.target.checked ? [...k, w] : k.filter((ue) => ue !== w)
                })
              }
            ),
            w
          ] }, w);
        }) }),
        (C.annotations ?? []).includes("tags") && /* @__PURE__ */ u(me, { children: [
          /* @__PURE__ */ n("h4", { children: "Card tag bins" }),
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected. This setting is separate from the queue filters." }),
          /* @__PURE__ */ n(
            xt,
            {
              entityType: "tag",
              values: C.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (w) => I({ annotationParents: w }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ n("h4", { children: "Queue tag bins" }),
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ n(
          xt,
          {
            entityType: "tag",
            values: C.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (w) => I({ binParents: w }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const vn = 180, Za = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
};
function po({ entityType: e }) {
  const t = Za[e];
  return e === "tag" ? /* @__PURE__ */ n(Do, { role: "img", "aria-label": t }) : Fr(e) === "audio" ? /* @__PURE__ */ n(jo, { role: "img", "aria-label": t }) : /* @__PURE__ */ n(An, { role: "img", "aria-label": t });
}
function Si(e) {
  return Ae(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Ci(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Sn() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Ei(e) {
  const t = new URLSearchParams(window.location.search);
  fn.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function es(e) {
  return Ke({ ...e, page: 1 });
}
function go(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function vt(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const mo = "data-quality.workspace-layout.v1", Zn = 240, xn = 192, Ln = 560;
function ho(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(Ln, Math.max(xn, e)) : Zn;
}
function ts() {
  try {
    const e = JSON.parse(
      localStorage.getItem(mo) ?? "null"
    );
    return ho(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return Zn;
  }
}
function rs(e) {
  try {
    localStorage.setItem(
      mo,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function bo(e) {
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
function wo(e, t) {
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
function ns(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : wo(e, t);
}
function is({
  onNavigate: e
}) {
  const [t, r] = S([]), [i] = S(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [a, s] = S(""), [o, f] = S(!0), [d, p] = S(""), [h, y] = S(!1), [A, C] = S(!1), [v, I] = S(!1), [w, k] = S(!1), [_, ue] = S([]), [fe, Oe] = S(""), [g, F] = S(!0), [O, te] = S(""), [ye, U] = S(""), [X, Xe] = S(!1), [P, Et] = S(!1), [oe, Nt] = S(Sn), [Be, At] = S({}), [nr, Nr] = S("name"), [nt, Qt] = S("asc"), qe = $(null), Le = $(!1), [se, Ze] = S(0), [ve, Se] = S(!1), [Ve, qt] = S(!1), [H, _e] = S(
    null
  ), W = t.find((c) => c.id === oe) ?? null, q = Gt(
    () => (H == null ? void 0 : H.id) === oe && W ? { ...W, view: {
      ...W.view,
      filter: H.view.filter,
      objectFilter: H.view.objectFilter,
      searchMode: H.view.searchMode,
      startFrom: H.view.startFrom
    } } : W,
    [H, oe, W]
  ), D = q ? Ae(q) : "video", Ce = Fr(D), et = q ? ie(q) : !1, V = D === "video" ? q : null, Rt = et && !!(q != null && q.actions.some(Jt)), ir = !!V || D === "audio" || Rt, [it, ot] = S(null), Ge = (it == null ? void 0 : it.id) === (q == null ? void 0 : q.id) ? it == null ? void 0 : it.mode : (q == null ? void 0 : q.view.reviewMode) ?? "single", Ee = et || D === "audio" || D === "video" && Ge === "single", [Pe, Me] = S(0), Tt = $(-1), zt = $(!1);
  J(() => {
    const c = () => {
      if (!Ee && Yt.current) {
        zt.current = !0;
        return;
      }
      Nt(Sn()), Ee || Me((b) => b + 1);
    };
    return window.addEventListener("popstate", c), () => window.removeEventListener("popstate", c);
  }, [Ee]);
  const or = Ce === "audio" ? A : h, E = D === "tag" ? "Tag" : Ce === "audio" ? "Audio" : "Video", L = D === "tag" ? v : or, pe = Gt(() => {
    const c = nt === "asc" ? 1 : -1;
    return [...t].sort((b, N) => {
      if (nr === "count") {
        const T = Be[b.id], z = Be[N.id], M = typeof T == "number", G = typeof z == "number";
        if (M !== G) return M ? -1 : 1;
        if (M && G && T !== z)
          return (T - z) * c;
      }
      return b.name.localeCompare(N.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * c;
    });
  }, [nt, nr, Be, t]), gt = $(
    null
  ), Je = Wa(V), [Z, Wt] = S({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Ar, at] = S({
    page: 1,
    perPage: 40
  }), [he, gr] = S({ items: [], totalCount: 0 }), [Y, mt] = S(!1), [$e, st] = S(""), [Vr, Lt] = S(!1), [qr, Ht] = S(!1), [Qe, ze] = S(() => /* @__PURE__ */ new Set()), kt = $(Qe);
  kt.current = Qe;
  const It = $(/* @__PURE__ */ new Map()), Ne = (q == null ? void 0 : q.view.selectAllOnLoad) === !0, [ce, De] = S(null), We = $(ce);
  We.current = ce;
  const [Fe, _t] = S(!1), je = $(Fe);
  je.current = Fe;
  const Rr = $(null), [Dt, ct] = S("grid"), [Ot, He] = S(vn), [lt, ar] = S(ts), [ee, Pt] = S(!1), Yt = $(!1), [jt, Tr] = S(""), [sr, Ut] = S(""), [kr, Xt] = S(""), [K, dt] = S(null), [mr, Zt] = S(""), [cr, hr] = S(!1), [Te, Gr] = S({}), [Jr, Ir] = S({}), l = $(/* @__PURE__ */ new Map()), m = $(null), R = $(null), x = $(null), j = $(0), B = $(0), le = $(null), ke = $(null), Kt = JSON.stringify([
    ...new Set(
      (V == null ? void 0 : V.actions.flatMap(
        (c) => c.steps.flatMap((b) => b.tagIds)
      )) ?? []
    )
  ]);
  function Re(c) {
    const b = ho(c);
    ar(b), rs(b);
  }
  function ut(c) {
    const b = c.shiftKey ? 40 : 16;
    let N = null;
    c.key === "ArrowLeft" && (N = lt + b), c.key === "ArrowRight" && (N = lt - b), c.key === "Home" && (N = xn), c.key === "End" && (N = Ln), N !== null && (c.preventDefault(), c.stopPropagation(), Re(N));
  }
  J(() => {
    if (!sr) return;
    const c = window.setTimeout(() => Ut(""), 4e3);
    return () => window.clearTimeout(c);
  }, [sr]), J(() => {
    const c = JSON.parse(Kt);
    if (Ir({}), !c.length) return;
    const b = new AbortController();
    let N = !0;
    return Promise.all(
      c.map(async (T) => {
        var z;
        try {
          const M = await Q(`/api/tags/${T}`, {
            signal: b.signal
          });
          return [T, ((z = M.name) == null ? void 0 : z.trim()) || null];
        } catch {
          return [T, null];
        }
      })
    ).then((T) => {
      N && Ir(Object.fromEntries(T));
    }), () => {
      N = !1, b.abort();
    };
  }, [Kt]), J(() => {
    const c = V ? Qn(V.view.objectFilter) : [];
    if (Gr({}), !c.length) return;
    const b = new AbortController();
    let N = !0;
    return Promise.all(
      c.map(async (T) => {
        var z;
        try {
          const M = await Q(`/api/tags/${T}`, {
            signal: b.signal
          });
          return (z = M.name) != null && z.trim() ? [String(T), M.name] : null;
        } catch {
          return null;
        }
      })
    ).then((T) => {
      N && Gr(
        Object.fromEntries(T.filter((z) => z !== null))
      );
    }), () => {
      N = !1, b.abort();
    };
  }, [V == null ? void 0 : V.id, V == null ? void 0 : V.view.objectFilter]);
  const xe = Gt(
    () => V ? zn(
      V.view.objectFilter,
      Te
    ) : (q == null ? void 0 : q.view.objectFilter) ?? {},
    [Te, q, V]
  ), br = tr(async () => {
    f(!0), p("");
    try {
      const c = await ta();
      r(c.reviews), s(c.storageKey), y(c.canWriteVideos ?? c.canWrite), C(c.canWriteAudios ?? !1), I(c.canWriteTags ?? !1), k(c.canReadTagGroups ?? !1), F(c.canConfigure ?? !0), te(c.storageNotice ?? ""), oe && !c.reviews.some((b) => b.id === oe) && (Nt(""), Ei(""));
    } catch (c) {
      p(
        c instanceof Error ? c.message : "Could not load reviews."
      );
    } finally {
      f(!1);
    }
  }, [oe]);
  J(() => {
    if (!w) {
      ue([]), Oe("");
      return;
    }
    const c = new AbortController();
    return Oe(""), fa(c.signal).then(ue).catch((b) => {
      c.signal.aborted || Oe(
        b instanceof Error ? b.message : "Could not load tag groups."
      );
    }), () => c.abort();
  }, [w]), J(() => {
    br();
  }, []), J(() => {
    if (oe || t.length === 0) return;
    const c = new AbortController();
    At({});
    for (const b of t)
      (ie(b) ? Wn(b, c.signal).then((T) => (T == null ? void 0 : T.length) === 0 ? { items: [], totalCount: 0 } : xr(Hn(b, T), { ...b.view.filter, page: 1, perPage: 1 }, c.signal)) : Ae(b) === "tag" ? fi(
        b,
        Ke({ ...b.view.filter, page: 1, perPage: 1 }),
        c.signal
      ) : xr(
        b,
        Ke({ ...b.view.filter, page: 1, perPage: 1 }),
        c.signal
      )).then((T) => {
        c.signal.aborted || At((z) => ({
          ...z,
          [b.id]: T.totalCount
        }));
      }).catch(() => {
        c.signal.aborted || At((T) => ({ ...T, [b.id]: null }));
      });
    return () => c.abort();
  }, [oe, t]), qi(() => {
    var c;
    oe || o || !Le.current || (Le.current = !1, (c = qe.current) == null || c.focus());
  }, [oe, o]);
  const de = $(0), tt = tr(async () => {
    const c = ++de.current;
    dt(null), Zt("");
    try {
      const b = await (Rt ? Zi(Ce) : Xi(Ce));
      c === de.current && dt(b);
    } catch (b) {
      if (c !== de.current) return;
      dt(null), Zt(
        "Tag assessment setup could not be checked. " + (b instanceof Error ? b.message : "Request failed.")
      );
    }
  }, [Rt, Ce]);
  J(() => {
    tt();
  }, [tt]);
  const Mt = tr(
    async (c, b, N = !1, T = !1) => {
      var be, re;
      const z = ++j.current;
      (be = le.current) == null || be.abort();
      const M = new AbortController();
      le.current = M, b = Ke(b);
      const G = Number(b.page);
      N && (b = { ...b, page: 1 }), Wt(b), Ht(N), mt(!0), st("");
      try {
        const we = (Vt) => Ae(c) === "tag" ? fi(
          c,
          Vt,
          M.signal
        ) : xr(
          c,
          Vt,
          M.signal
        );
        let Ue = await we(b);
        const bt = Math.max(
          1,
          Math.ceil(Ue.totalCount / Number(b.perPage))
        ), Bt = N ? bt : Math.min(G, bt);
        return Number(b.page) !== Bt && (b = { ...b, page: Bt }, Ue = await we(b)), z === j.current && (((re = ke.current) == null ? void 0 : re.page) !== Bt && (ke.current = {
          page: Bt,
          ids: new Set(Ue.items.map((Vt) => Vt.id))
        }), gr(Ue), T && er(
          () => new Set(Ue.items.map((Vt) => Vt.id))
        ), Wt(b), at(b)), Ue;
      } catch (we) {
        throw z === j.current && st(
          we instanceof Error ? we.message : "Could not load the review queue."
        ), we;
      } finally {
        z === j.current && mt(!1);
      }
    },
    []
  );
  J(() => {
    var b;
    if (B.current += 1, Tt.current = -1, j.current += 1, (b = le.current) == null || b.abort(), Et(!1), U(""), Xe(!1), ze(/* @__PURE__ */ new Set()), It.current.clear(), De(null), _t(!1), Pt(!1), Yt.current = !1, Tr(""), Ut(""), Xt(""), gr({ items: [], totalCount: 0 }), ke.current = null, Lt(!1), !q || Ee) {
      mt(!1);
      return;
    }
    let c = !0;
    return mt(!0), (async () => {
      let N = W ?? q;
      _e(null);
      let T = null;
      const z = new URLSearchParams(window.location.search);
      if (Ae(q) === "video" && fn.some((re) => z.has(re)))
        try {
          const re = N;
          T = Fn(re, z);
          const we = Ft(re, T.query);
          (T.query.startFrom !== (re.view.startFrom ?? "end") || !jr(
            JSON.parse($t(we)),
            JSON.parse($t(Ft(re, Sr(re))))
          )) && (N = we, _e(N));
        } catch (re) {
          Lt(!0), st(re instanceof Error ? re.message : "Could not read review URL."), mt(!1);
          return;
        }
      let M = null;
      try {
        M = await ia(a, q.id);
      } catch (re) {
        c && (Xe(!0), U(
          re instanceof Error ? re.message : "Could not load progress."
        ));
      }
      if (!c) return;
      const G = (M == null ? void 0 : M.signature) === $t(N) ? M : null, be = T ? T.query.filter : G ? Ke(G.filter) : es(N.view.filter);
      Wt(be), ct(
        G ? Ci(G.displayMode, Ae(q)) : Si(q)
      ), He(
        G ? G.cardSize ?? vn : vn
      );
      try {
        const re = await Mt(
          N,
          be,
          T ? T.startAtEnd : !G && N.view.startFrom !== "beginning",
          N.view.selectAllOnLoad === !0
        );
        if (!c) return;
        const we = si(
          re.items.map((Ue) => Ue.id),
          (G == null ? void 0 : G.focusedId) ?? null,
          (G == null ? void 0 : G.index) ?? 0
        );
        De(we), Ie(we);
      } catch {
      }
      c && (Tt.current = Pe, Et(!0));
    })(), () => {
      var N;
      c = !1, B.current++, j.current++, (N = le.current) == null || N.abort();
    };
  }, [q == null ? void 0 : q.id, Ee, Pe]), J(() => {
    !V || Ee || !P || Y || $e || ee || zt.current || Tt.current !== Pe || Lr(V.id, {
      filter: Z,
      objectFilter: V.view.objectFilter,
      searchMode: V.view.searchMode,
      startFrom: V.view.startFrom ?? "end"
    });
  }, [V, Ee, P, Y, $e, Z, ee, Pe]);
  const ne = Gt(
    () => he.items.map((c) => c.id),
    [he.items]
  );
  J(() => {
    if (!P || !q || !a || Y || $e || ee || (H == null ? void 0 : H.id) === q.id || X)
      return;
    const c = {
      version: 1,
      signature: $t(q),
      filter: Z,
      focusedId: ce,
      index: Math.max(0, ne.indexOf(ce ?? -1)),
      displayMode: Dt,
      cardSize: Ot,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        a + ":progress:" + q.id,
        JSON.stringify(c)
      );
    } catch {
    }
    if (ye) return;
    let b = !0;
    const N = window.setTimeout(() => {
      oa(a, q.id, c).catch((T) => {
        b && U(
          "Progress is kept in this browser, but account sync failed. " + (T instanceof Error ? T.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      b = !1, window.clearTimeout(N);
    };
  }, [
    P,
    a,
    q,
    Y,
    $e,
    ee,
    Z,
    ce,
    ne,
    Dt,
    Ot,
    H,
    ye,
    X
  ]);
  const Qr = he.items.find((c) => c.id === ce) ?? null, Or = D === "video" ? Qr : null;
  Fe && Or && (Rr.current = Or);
  const ht = Or ?? (Fe ? Rr.current : null), Pr = ci(Qe, ce), Ye = ne.length > 0 && ne.every((c) => Qe.has(c)), wr = Qe.size > 0 ? `${Qe.size} selected ${D}${Qe.size === 1 ? "" : "s"}` : ce == null ? `no ${D}` : `focused ${D}`, Ie = tr((c, b = !0) => {
    c != null && window.requestAnimationFrame(() => {
      const N = l.current.get(c);
      N == null || N.focus({ preventScroll: !0 }), b && (N == null || N.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  J(() => {
    P && !je.current && Ie(We.current);
  }, [P, Ie]), J(() => {
    Y || !ne.length || (We.current == null || !ne.includes(We.current)) && (De(ne[0]), je.current || Ie(ne[0]));
  }, [Ie, ne, Y]);
  const er = tr(
    (c) => {
      ze((b) => {
        const N = c(b);
        for (const T of /* @__PURE__ */ new Set([...b, ...N]))
          b.has(T) !== N.has(T) && It.current.set(
            T,
            (It.current.get(T) ?? 0) + 1
          );
        return N;
      });
    },
    []
  ), pn = tr(
    (c) => {
      if (!ne.length) return;
      const b = Math.max(
        0,
        ne.indexOf(We.current ?? ne[0])
      ), N = ne[Math.max(0, Math.min(ne.length - 1, b + c))];
      De(N), je.current || Ie(N);
    },
    [Ie, ne]
  ), gn = tr(
    async (c) => {
      const b = "steps" in c ? c.steps.length > 0 : c.effect.mode !== "SKIP", N = "effect" in c && c.effect.mode === "SET_TAG_GROUP" ? c.effect.tagGroupId : null, T = N != null && (!w || !_.some((ge) => ge.id === N)), z = "effect" in c && b && !w, M = ci(
        kt.current,
        We.current
      );
      if (!q || Yt.current || Y || $e) return;
      const G = b && !L ? `${E} write permission is required to apply ${c.label}.` : z || T ? `${c.label} needs a tag group that is unavailable.` : Jt(c) && (K == null ? void 0 : K.kind) !== "ready" ? `Set up tag assessments before applying ${c.label}.` : M.length ? "" : `Select or focus a ${D} before applying ${c.label}.`;
      if (G) {
        Xt(G);
        return;
      }
      const be = ++B.current, re = q.id, we = [...ne], Ue = he, bt = We.current, Bt = new Set(kt.current), Vt = new Map(
        M.map((ge) => [ge, It.current.get(ge) ?? 0])
      ), yr = () => be === B.current && q.id === re;
      Yt.current = !0, Pt(!0), Tr(
        kt.current.size ? `${M.length} selected ${D}s` : `the focused ${D}`
      ), Ut(""), Xt("");
      const ni = Ue.items.filter(
        (ge) => !M.includes(ge.id)
      ), To = ni.map((ge) => ge.id), ii = li(
        we,
        To,
        bt,
        M.includes(bt ?? -1)
      );
      gr({
        items: ni,
        totalCount: Ue.totalCount
      }), ze((ge) => {
        const rt = new Set(ge);
        for (const wt of M) rt.delete(wt);
        return rt;
      }), De(ii), je.current || Ie(ii);
      let hn = !1;
      try {
        if ("effect" in c ? await Ca(c, M) : await to(Ce, c, M), hn = !0, !yr()) return;
        ze((ge) => {
          const rt = new Set(ge);
          for (const wt of M)
            (It.current.get(wt) ?? 0) === Vt.get(wt) && rt.delete(wt);
          return rt;
        }), Ut(
          `${c.label}: ${M.length} ${D}${M.length === 1 ? "" : "s"} ${b ? "updated" : "skipped"}.`
        );
      } catch (ge) {
        if (!yr()) return;
        gr(Ue), ze((rt) => {
          const wt = new Set(rt);
          for (const ft of M)
            Bt.has(ft) && (It.current.get(ft) ?? 0) === Vt.get(ft) && wt.add(ft);
          return wt;
        }), De(bt), je.current || Ie(bt), Xt(
          ge instanceof Error ? ge.message : "Action failed."
        );
      }
      try {
        if (await ma(c), !yr()) return;
        const ge = new Set(M), rt = Ne && we.length > 0 && we.every((yt) => ge.has(yt)), wt = await Mt(q, Z, !1, rt);
        if (!yr()) return;
        let ft = wt.items.map((yt) => yt.id);
        const Wr = ke.current, ko = (Wr == null ? void 0 : Wr.page) === Number(Z.page) && ft.some((yt) => Wr.ids.has(yt)), Io = (q.view.startFrom ?? "end") !== "beginning";
        if (wt.totalCount > 0 && Number(Z.page) > 1 && (!ft.length || Io && !ko)) {
          const yt = Math.max(1, Number(Z.page) - 1), Hr = { ...Z, page: yt };
          Wt(Hr), ft = (await Mt(
            q,
            Hr,
            !1,
            rt
          )).items.map((bn) => bn.id), ze(
            (bn) => new Set([...bn].filter((Oo) => ft.includes(Oo)))
          );
          const ai = ft.at(-1) ?? null;
          De(ai), je.current || Ie(ai);
        } else {
          ze(
            (Hr) => new Set([...Hr].filter((oi) => ft.includes(oi)))
          );
          const yt = li(
            we,
            ft,
            bt,
            hn && M.includes(bt ?? -1)
          );
          De(yt), je.current && yt == null && _t(!1), je.current || Ie(yt);
        }
      } catch (ge) {
        yr() && Xt(
          (rt) => `${rt ? `${rt} ` : ""}${hn ? "The action completed, but " : ""}the queue could not be refreshed. ${ge instanceof Error ? ge.message : "Refresh failed."}`
        );
      } finally {
        yr() && (Yt.current = !1, Pt(!1), Tr(""), zt.current && (zt.current = !1, Nt(Sn()), Me((ge) => ge + 1)));
      }
    },
    [
      L,
      w,
      _,
      D,
      K,
      Mt,
      Z,
      Ie,
      ne,
      he,
      Y,
      $e,
      q
    ]
  );
  function So() {
    var N;
    if (Dt === "list") return 1;
    const c = (N = m.current) == null ? void 0 : N.firstElementChild, b = c ? getComputedStyle(c).gridTemplateColumns : "";
    return Math.max(1, b.split(" ").filter(Boolean).length);
  }
  const ei = $(() => {
  });
  ei.current = (c) => {
    var G;
    if (Ee || c.defaultPrevented || c.repeat || c.ctrlKey || c.altKey || c.metaKey || ve) return;
    const b = c.target, N = b instanceof Node && ((G = R.current) == null ? void 0 : G.contains(b)) === !0, T = b === document.body || b === document.documentElement;
    if (!N && !T) return;
    if (Fe && c.key === "Escape") {
      vt(c), _t(!1), Ie(We.current);
      return;
    }
    if (!Wo(b)) return;
    const z = Bi(b);
    if (c.key === "Escape") {
      vt(c), er(() => /* @__PURE__ */ new Set());
      return;
    }
    const M = (q == null ? void 0 : q.actions.findIndex(
      (be, re) => rr(be, re) === c.key.toLowerCase()
    )) ?? -1;
    if (M >= 0 && (q != null && q.actions[M])) {
      vt(c), !ee && !Y && gn(q.actions[M]);
      return;
    }
    if (!Fe && c.key === " " && z) {
      vt(c), ce != null && er((be) => Xr(be, ce));
      return;
    }
    if (!Fe && c.key.toLowerCase() === "a") {
      vt(c), er(
        (be) => di(be, ne)
      );
      return;
    }
    if (!(ee || Y) && !Fe && c.key === "Enter" && ce != null && z) {
      vt(c), D === "tag" ? window.open(`/tag/${ce}`, "_blank", "noopener,noreferrer") : _t(!0);
      return;
    }
  }, J(() => {
    const c = (b) => ei.current(b);
    return document.addEventListener("keydown", c), () => document.removeEventListener("keydown", c);
  }, []);
  const ti = $(
    () => {
    }
  );
  ti.current = (c) => {
    var M;
    if (Ee || ve || Fe || ee || Y || !ne.length || c.defaultPrevented || c.repeat || c.ctrlKey || c.altKey || c.metaKey)
      return;
    const b = c.target, N = b instanceof Node && ((M = R.current) == null ? void 0 : M.contains(b)) === !0, T = b === document.body || b === document.documentElement;
    if (!N && !T || !c.key.startsWith("Arrow") || !Ho(b)) return;
    const z = Yo(c.key, So());
    z && (c.preventDefault(), N ? c.stopImmediatePropagation() : c.stopPropagation(), pn(z));
  }, J(() => {
    const c = (b) => ti.current(b);
    return document.addEventListener("keydown", c), () => document.removeEventListener("keydown", c);
  }, []);
  function Mr(c) {
    ot(null), Ze(0), Nt(c), Ei(c);
  }
  function Co() {
    Le.current = !0, At({}), Mr("");
  }
  async function mn(c) {
    if (!a) return !1;
    const b = c.map(as);
    try {
      await na(a, b);
    } catch (T) {
      throw T;
    }
    r(b), oe && !b.some((T) => T.id === oe) && Mr("");
    const N = b.find((T) => T.id === oe);
    return N && ot(null), N && W && JSON.stringify(N) !== JSON.stringify(W) && (N.view.displayMode !== W.view.displayMode && ct(Si(N)), $t(N) !== $t(W) && (_e(null), Ae(N) === "video" && Lr(N.id, {
      filter: Ke(N.view.filter),
      objectFilter: N.view.objectFilter,
      searchMode: N.view.searchMode,
      startFrom: N.view.startFrom ?? "end"
    }), Ee || zr(
      N,
      Ke({ ...N.view.filter, page: Z.page })
    ))), !0;
  }
  if (o)
    return /* @__PURE__ */ n(Ni, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ u(me, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void ms().catch(
            (c) => p(
              "Could not export browser reviews. " + (c instanceof Error ? c.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        Ai,
        {
          message: d,
          onRetry: () => void br()
        }
      )
    ] });
  return /* @__PURE__ */ u("div", { ref: R, className: "data-quality-page", children: [
    /* @__PURE__ */ u("header", { className: "data-quality-header", children: [
      q && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: ee,
          onClick: Co,
          children: /* @__PURE__ */ n($i, {})
        }
      ),
      /* @__PURE__ */ u("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (q == null ? void 0 : q.name) ?? "Data Quality" }),
        (q == null ? void 0 : q.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: q.description })
      ] }),
      q && W && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: ee || Y || !g,
          onClick: () => {
            Ee ? Ze((c) => c + 1) : (qt(!0), Se(!0));
          },
          children: /* @__PURE__ */ n(Fi, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: ee || Y || !g,
          onClick: () => {
            qt(!1), Se(!0);
          },
          children: /* @__PURE__ */ n(_o, {})
        }
      )
    ] }),
    O && /* @__PURE__ */ n("p", { className: "dq-status", children: O }),
    ir && (K == null ? void 0 : K.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      K.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: cr,
          onClick: () => {
            hr(!0), Zt(""), (Rt ? wa(Ce) : ba(Ce)).then(tt).catch(
              (c) => Zt(
                `Could not create the ${Rt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (c instanceof Error ? c.message : "Request failed.")
              )
            ).finally(() => hr(!1));
          },
          children: cr ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    ir && ((K == null ? void 0 : K.kind) === "incompatible" || mr) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(Nn, {}),
      mr || (K == null ? void 0 : K.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: cr,
          onClick: () => {
            hr(!0), tt().finally(
              () => hr(!1)
            );
          },
          children: cr ? "Checking…" : "Check again"
        }
      )
    ] }),
    i && /* @__PURE__ */ u("details", { children: [
      /* @__PURE__ */ n("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ n("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const c = localStorage.getItem("page-videos") ?? "[]", b = URL.createObjectURL(
              new Blob([c], { type: "application/json" })
            ), N = document.createElement("a");
            N.href = b, N.download = "data-quality-unassigned-legacy-reviews.json", N.click(), URL.revokeObjectURL(b);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    ye && /* @__PURE__ */ u("p", { role: "alert", children: [
      ye,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            U(""), Xe(!1);
          },
          children: X ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    V && /* @__PURE__ */ u("label", { className: "dq-layout-control", children: [
      "Review layout",
      /* @__PURE__ */ u(
        "select",
        {
          "aria-label": "Review layout",
          value: Ge,
          disabled: ee || Y || ve,
          onChange: (c) => ot({ id: V.id, mode: c.target.value }),
          children: [
            /* @__PURE__ */ n("option", { value: "single", children: "Single video" }),
            /* @__PURE__ */ n("option", { value: "multiple", children: "Multiple videos" })
          ]
        }
      )
    ] }),
    q && W && !Ee && /* @__PURE__ */ u("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${ee || Y ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": ee || Y || void 0,
          inert: ee || Y ? !0 : void 0,
          children: /* @__PURE__ */ n(
            _r,
            {
              filter: $e ? Ar : Z,
              onFilterChange: Eo,
              totalCount: he.totalCount,
              sortOptions: D === "tag" ? Oi : Dn,
              showSearch: !0,
              showSort: !0,
              displayMode: Dt,
              onDisplayModeChange: (c) => ct(Ci(c, D)),
              availableDisplayModes: D === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (Ot - 225) / 50,
              onZoomChange: (c) => He(Math.round(225 + c * 50)),
              cardSizeEntityType: D === "tag" ? "tags" : "videos",
              criteriaDefinitions: D === "tag" ? Pi : cn,
              customFieldEntityType: D === "video" ? "video" : void 0,
              objectFilter: xe,
              onObjectFilterChange: (c) => {
                !ee && !Y && (gt.current = D === "video" ? ro(
                  c,
                  Te,
                  q.view.objectFilter
                ) : c);
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (H == null ? void 0 : H.id) === oe && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: ee || Y || !g,
            onClick: Ao,
            children: /* @__PURE__ */ n(jn, {})
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Reset to default review filters",
            title: "Reset to default review filters",
            disabled: ee || Y,
            onClick: No,
            children: /* @__PURE__ */ n(Mi, {})
          }
        )
      ] })
    ] }),
    q ? Ee ? /* @__PURE__ */ n(Qa, { review: q, canWrite: et ? v : or, canAssess: (K == null ? void 0 : K.kind) === "ready" && or, onBusy: Pt, editRequest: se, renderRuleEditor: (c, b, N) => /* @__PURE__ */ n(yo, { workspace: !0, draft: c, entityTypeLocked: !0, tagGroups: _, saving: N, setDraft: (T) => b(T), onSave: () => {
    }, onCancel: () => {
    } }), onSaveDefaults: g ? (c) => mn(t.map((b) => b.id === c.id ? c : b)) : void 0 }, q.id) : /* @__PURE__ */ u(me, { children: [
      V && Je.error && /* @__PURE__ */ n("p", { role: "alert", children: Je.error }),
      V && /* @__PURE__ */ n(
        Ya,
        {
          videos: he.items,
          review: V,
          trees: Je.ids,
          disabled: ee || Y,
          onChoose: (c) => {
            const b = Xa(V, c);
            _e(b), zr(b, { ...Z, page: 1 });
          }
        }
      ),
      kr && !Fe && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(Nn, {}),
        kr
      ] }),
      sr && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: sr }),
      ri("top"),
      /* @__PURE__ */ u(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${lt}px`
          },
          children: [
            /* @__PURE__ */ u("main", { children: [
              Y && !he.items.length && /* @__PURE__ */ n(Ni, { label: "Loading review queue…" }),
              $e && !Y && /* @__PURE__ */ n(
                Ai,
                {
                  message: $e,
                  retryLabel: Vr ? "Reset to review defaults" : "Retry",
                  onRetry: () => {
                    if (Vr && W && Ae(W) === "video") {
                      const c = Sr(W);
                      Lr(W.id, { ...c, filter: { ...c.filter, page: void 0 } }), Me((b) => b + 1);
                      return;
                    }
                    Mt(
                      q,
                      Z,
                      qr,
                      Ne
                    ).catch(() => {
                    });
                  }
                }
              ),
              !ee && !Y && !$e && !he.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(An, {}),
                /* @__PURE__ */ u("p", { children: [
                  "No ",
                  D,
                  "s match this review."
                ] })
              ] }),
              !!he.items.length && /* @__PURE__ */ n("div", { ref: m, children: /* @__PURE__ */ n(
                "div",
                {
                  className: Dt === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${Ot}px`
                  },
                  children: he.items.map(Ro)
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
                "aria-valuemin": xn,
                "aria-valuemax": Ln,
                "aria-valuenow": lt,
                "aria-valuetext": `${lt} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (c) => {
                  x.current = {
                    pointerId: c.pointerId,
                    startX: c.clientX,
                    startWidth: lt
                  }, c.currentTarget.setPointerCapture(c.pointerId);
                },
                onPointerMove: (c) => {
                  const b = x.current;
                  (b == null ? void 0 : b.pointerId) === c.pointerId && c.currentTarget.hasPointerCapture(c.pointerId) && Re(
                    b.startWidth + b.startX - c.clientX
                  );
                },
                onPointerUp: () => {
                  x.current = null;
                },
                onPointerCancel: () => {
                  x.current = null;
                },
                onKeyDown: ut,
                onDoubleClick: () => Re(Zn),
                children: /* @__PURE__ */ n("span", {})
              }
            ),
            /* @__PURE__ */ u("aside", { className: "dq-actions", children: [
              /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  className: "dq-selection-toggle",
                  "aria-keyshortcuts": "a",
                  disabled: !ne.length,
                  onClick: () => er(
                    (c) => di(c, ne)
                  ),
                  children: [
                    Ye ? "Clear selection" : "Select all on page",
                    /* @__PURE__ */ n("kbd", { "aria-hidden": "true", children: "A" })
                  ]
                }
              ),
              /* @__PURE__ */ n("strong", { children: Qe.size > 0 ? wr : ce == null ? "Nothing to apply to" : `Applies to the ${wr}` }),
              q.actions.map((c, b) => {
                const N = "steps" in c ? c.steps.length > 0 : c.effect.mode !== "SKIP", T = "effect" in c && c.effect.mode === "SET_TAG_GROUP" ? c.effect.tagGroupId : null, z = T != null ? _.find((G) => G.id === T) : void 0, M = T != null && !z;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    disabled: ee || Y || !!$e || N && !L || "effect" in c && N && (!w || M) || Jt(c) && (K == null ? void 0 : K.kind) !== "ready" || !Pr.length,
                    onClick: () => void gn(c),
                    children: [
                      /* @__PURE__ */ u("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: c.label }),
                        "effect" in c ? /* @__PURE__ */ n("small", { children: c.effect.mode === "SKIP" ? "Skip" : c.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : z ? `Assign ${z.name}` : "Unavailable tag group" }) : c.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: c.steps.flatMap(
                          (G, be) => G.tagIds.map((re, we) => {
                            const Ue = Jr[re] === void 0 ? "Tag" : Jr[re] ?? "Unavailable tag", bt = wo(G, Ue), Bt = ns(G, Ue);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": bo(G.mode),
                                "aria-label": Bt,
                                title: `Step ${be + 1}: ${Bt}`,
                                children: bt
                              },
                              `${be}-${re}-${we}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      rr(c, b) && /* @__PURE__ */ n("kbd", { children: rr(c, b) })
                    ]
                  },
                  c.id
                );
              }),
              !q.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              !L && /* @__PURE__ */ u("p", { children: [
                E,
                " write permission is required to apply actions."
              ] }),
              D === "tag" && fe && /* @__PURE__ */ u("p", { children: [
                "Tag groups are unavailable. ",
                fe
              ] }),
              ee && /* @__PURE__ */ u("p", { role: "status", children: [
                /* @__PURE__ */ n(Li, { className: "dq-spin" }),
                " Applying action to",
                " ",
                jt,
                "…"
              ] }),
              /* @__PURE__ */ u("p", { className: "dq-shortcuts", children: [
                "←→↑↓ move · space select · enter ",
                D === "tag" ? "open" : "preview",
                " · Q–P apply · A toggle shown · Esc clear"
              ] })
            ] })
          ]
        }
      ),
      ri("bottom")
    ] }) : t.length ? /* @__PURE__ */ u(
      "section",
      {
        className: "dq-review-browser",
        "aria-labelledby": "dq-reviews-title",
        children: [
          /* @__PURE__ */ u("div", { className: "dq-review-browser-heading", children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ n(
                "h2",
                {
                  id: "dq-reviews-title",
                  ref: qe,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ n("p", { children: "Choose a review to open its queue." }),
              /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                (c) => Be[c.id] !== void 0
              ) ? t.some((c) => Be[c.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: nr,
                    onChange: (c) => Nr(
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
                  "aria-label": nt === "asc" ? "Ascending" : "Descending",
                  title: nt === "asc" ? "Ascending" : "Descending",
                  onClick: () => Qt(
                    (c) => c === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    xi,
                    {
                      className: nt === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: pe.map((c) => {
            const b = Be[c.id], N = Ae(c), T = N === "tag" ? "tag" : ie(c) ? Ct(Fr(N)).queue : Ct(Fr(N)).one;
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                disabled: ee,
                onClick: () => Mr(c.id),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ u("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(po, { entityType: N }),
                      /* @__PURE__ */ n("strong", { children: c.name })
                    ] }),
                    /* @__PURE__ */ n(
                      "span",
                      {
                        className: "dq-review-count",
                        "aria-label": b === void 0 ? `Counting matching ${T}s` : b === null ? `Matching ${T} count unavailable` : `${b.toLocaleString()} matching ${b === 1 ? T : `${T}s`}`,
                        children: b === void 0 ? "…" : b === null ? "—" : b.toLocaleString()
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
    ) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(An, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    Fe && ht && V && /* @__PURE__ */ n(
      ds,
      {
        video: ht,
        review: V,
        targetLabel: wr,
        pending: ee,
        refreshing: Y || !!$e,
        error: kr,
        canWrite: h,
        assessmentReady: (K == null ? void 0 : K.kind) === "ready",
        selected: Qe.has(ht.id),
        hasPrevious: ne.indexOf(ht.id) > 0,
        hasNext: ne.indexOf(ht.id) >= 0 && ne.indexOf(ht.id) < ne.length - 1,
        onToggleSelected: () => er((c) => Xr(c, ht.id)),
        onPrevious: () => pn(-1),
        onNext: () => pn(1),
        onClose: () => {
          _t(!1), Ie(We.current);
        },
        onAction: gn
      }
    ),
    ve && /* @__PURE__ */ n(
      us,
      {
        reviews: t,
        activeReview: W,
        tagGroups: _,
        initialEdit: Ve,
        onSave: mn,
        onChoose: Mr,
        onEditWorkspace: (c) => {
          c !== oe && Mr(c), ot({ id: c, mode: "single" }), Ze((b) => b + 1), Se(!1);
        },
        onClose: () => {
          Se(!1), Ve && Ie(We.current, !1);
        }
      }
    )
  ] });
  async function zr(c, b, N = !1) {
    const T = We.current, z = Math.max(0, ne.indexOf(T ?? -1));
    try {
      const G = (await Mt(
        c,
        b,
        N,
        c.view.selectAllOnLoad === !0
      )).items.map((re) => re.id);
      ze(
        (re) => new Set([...re].filter((we) => G.includes(we)))
      );
      const be = si(G, T, z);
      De(be), je.current || Ie(be, !1);
    } catch {
    }
  }
  function Eo(c) {
    const b = gt.current;
    if (gt.current = null, ee || Y || !q || !W) return;
    const N = b ?? q.view.objectFilter, T = jr(
      N,
      W.view.objectFilter
    ) ? W.view.objectFilter : N, z = Ke({ ...c, page: 1 }), M = {
      ...q,
      view: {
        ...q.view,
        filter: z,
        objectFilter: T
      }
    }, G = $t(M) !== $t(W), be = G ? M : W;
    _e(G ? M : null), Ut(G ? "" : "Review queue defaults restored."), zr(be, z, !0);
  }
  function No() {
    if (ee || Y || !W) return;
    gt.current = null;
    const c = Ke({
      ...W.view.filter,
      page: 1
    });
    _e(null), Ut("Review queue defaults restored."), zr(
      W,
      c,
      W.view.startFrom !== "beginning"
    );
  }
  function Ao() {
    ee || Y || !q || !W || !g || mn(
      t.map(
        (c) => c.id === oe ? {
          ...c,
          view: {
            ...q.view,
            filter: { ...Z, page: 1 }
          }
        } : c
      )
    ).then(() => {
      _e(null), Ut("Queue saved to this review.");
    }).catch(
      (c) => Xt(
        c instanceof Error ? c.message : "Could not save queue."
      )
    );
  }
  function qo() {
    ze(/* @__PURE__ */ new Set()), It.current.clear(), De(null);
  }
  function ri(c) {
    return q ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: ee || Y,
        "aria-label": `Review queue pagination ${c}`,
        children: /* @__PURE__ */ n(
          ki,
          {
            filter: {
              ...Z,
              page: Number(Z.page) || 1,
              perPage: Number(Z.perPage) || 40
            },
            totalCount: he.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${c}`,
            onFilterChange: (b) => {
              ee || Y || b.page === Number(Z.page) || os(
                { ...Z, page: b.page },
                q,
                (N, T) => Mt(N, T, !1, Ne),
                qo
              );
            }
          }
        )
      }
    ) : null;
  }
  function Ro(c) {
    var N, T, z;
    if (D === "tag") {
      const M = c;
      return /* @__PURE__ */ n(
        ss,
        {
          tag: M,
          displayMode: Dt === "list" ? "list" : "grid",
          focused: M.id === ce,
          selected: Qe.has(M.id),
          setRef: (G) => {
            G ? l.current.set(M.id, G) : l.current.delete(M.id);
          },
          onFocus: () => De(M.id),
          onToggle: () => {
            er((G) => Xr(G, M.id)), Ie(M.id, !1);
          },
          onOpen: () => window.open(`/tag/${M.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        M.id
      );
    }
    const b = c;
    return /* @__PURE__ */ n(
      cs,
      {
        video: Ha(b, V, Je.ids),
        showTagBins: ((T = (N = V == null ? void 0 : V.presentation) == null ? void 0 : N.annotations) == null ? void 0 : T.includes("tags")) && !!((z = V.presentation.annotationParents) != null && z.length),
        displayMode: Dt,
        focused: b.id === ce,
        selected: Qe.has(b.id),
        setRef: (M) => {
          M ? l.current.set(b.id, M) : l.current.delete(b.id);
        },
        onFocus: () => De(b.id),
        onToggle: () => er((M) => Xr(M, b.id)),
        onPreview: () => {
          De(b.id), _t(!0);
        },
        onNavigate: e
      },
      b.id
    );
  }
}
function os(e, t, r, i) {
  i(), r(t, e).catch(() => {
  });
}
function Xr(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function as(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function ss({
  tag: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: a,
  onFocus: s,
  onToggle: o,
  onOpen: f,
  onNavigate: d
}) {
  return /* @__PURE__ */ n(
    "article",
    {
      ref: a,
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${e.name}${i ? ", selected" : ""}`,
      onFocus: s,
      onClick: (p) => {
        s(), p.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        xo,
        {
          tag: e,
          selected: i,
          onSelect: o,
          onClick: f,
          onNavigate: d
        }
      ) : /* @__PURE__ */ u("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "aria-label": i ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": i,
            onClick: (p) => {
              p.stopPropagation(), o();
            },
            children: i ? "✓" : ""
          }
        ),
        /* @__PURE__ */ n("button", { type: "button", className: "dq-tag-list-name", onClick: f, children: e.name }),
        /* @__PURE__ */ n("span", { children: e.tagGroupName || "Ungrouped" }),
        /* @__PURE__ */ n("span", { children: e.description || "" }),
        /* @__PURE__ */ u("span", { children: [
          e.videoCount ?? 0,
          " videos"
        ] })
      ] })
    }
  );
}
function cs({
  video: e,
  showTagBins: t,
  displayMode: r,
  focused: i,
  selected: a,
  setRef: s,
  onFocus: o,
  onToggle: f,
  onPreview: d,
  onNavigate: p
}) {
  var I, w;
  const h = go(e), y = $(null), A = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, C = !!(A.date || A.studioName), v = !!(A.performers.length || A.tags.length);
  return qi(() => {
    const k = y.current;
    if (!k) return;
    const _ = k.querySelector(
      `a[href="/video/${e.id}"]`
    ), ue = k.querySelector(".card-title"), fe = `dq-card-title-${e.id}`;
    ue && (ue.id = fe), _ && (_.target = "_blank", _.rel = "noreferrer", _.removeAttribute("aria-label"), _.setAttribute("aria-labelledby", fe), _.classList.add("dq-card-link"));
    const Oe = k.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    Oe && Oe.setAttribute(
      "aria-label",
      a ? `Deselect ${h}` : `Select ${h}`
    );
    const g = k.querySelector(
      'button[title="Quick View"]'
    );
    g && g.setAttribute("aria-label", `Preview ${h}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (k) => {
        y.current = k, s(k);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${h}${a ? ", selected" : ""}`,
      onFocus: o,
      onClick: (k) => {
        o(), k.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${r} ${C ? "has-card-metadata" : "no-card-metadata"} ${v ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${a ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          Lo,
          {
            video: A,
            selected: a,
            onSelect: f,
            onNavigate: p,
            onQuickView: d,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ u("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (I = e.tags) == null ? void 0 : I.map((k) => /* @__PURE__ */ n("span", { children: k.name }, k.id)),
          !((w = e.tags) != null && w.length) && /* @__PURE__ */ n("small", { children: "No matching tags" })
        ] }),
        r === "wall" && /* @__PURE__ */ n(ls, { video: e })
      ]
    }
  );
}
function ls({ video: e }) {
  const t = $(null), r = $(null), [i, a] = S(!1), [s, o] = S(!1), [f, d] = S(!1);
  return J(() => {
    const p = t.current;
    if (!p || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      a(!0), o(!0);
      return;
    }
    const h = new IntersectionObserver(
      ([A]) => a(A.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), y = new IntersectionObserver(
      ([A]) => o(A.isIntersecting && A.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return h.observe(p), y.observe(p), () => {
      h.disconnect(), y.disconnect();
    };
  }, [e.id, e.files.length]), J(() => {
    if (!i) {
      d(!1);
      return;
    }
    const p = new AbortController();
    return Q(ga(e.id), {
      signal: p.signal
    }).then((h) => {
      p.signal.aborted || d(h.available === !0);
    }).catch(() => {
      p.signal.aborted || d(!1);
    }), () => p.abort();
  }, [i, e.id]), J(() => {
    const p = r.current;
    p && (s ? Promise.resolve(p.play()).catch(() => {
    }) : p.pause());
  }, [f, s]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: f && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: pa(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function ds({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: a,
  error: s,
  canWrite: o,
  assessmentReady: f,
  selected: d,
  hasPrevious: p,
  hasNext: h,
  onToggleSelected: y,
  onPrevious: A,
  onNext: C,
  onClose: v,
  onAction: I
}) {
  const w = $(null), k = $(null), _ = e.files[0], ue = go(e);
  J(() => {
    var F;
    const g = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (F = w.current) == null || F.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = g;
    };
  }, []);
  function fe(g) {
    var te, ye, U;
    if (g.key !== "Tab") return;
    const F = [
      ...((te = w.current) == null ? void 0 : te.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((X) => X.offsetParent !== null);
    if (!F.length) {
      g.preventDefault(), (ye = w.current) == null || ye.focus();
      return;
    }
    const O = F.indexOf(
      document.activeElement
    );
    g.shiftKey && O <= 0 ? (g.preventDefault(), (U = F.at(-1)) == null || U.focus()) : !g.shiftKey && O === F.length - 1 && (g.preventDefault(), F[0].focus());
  }
  function Oe(g) {
    if (g.defaultPrevented || g.ctrlKey || g.metaKey || g.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const F = g.key === "ArrowLeft" || g.key === "ArrowRight";
    if (g.altKey && !F) return;
    const O = k.current, te = g.currentTarget.querySelector("video");
    if (g.key === "Enter" || g.key === "Escape")
      g.repeat || v();
    else if (g.key === " " && O)
      g.repeat || O.toggle();
    else if (F && O)
      O.seekBy(
        (g.key === "ArrowLeft" ? -1 : 1) * (g.shiftKey ? 5 : g.altKey ? 10 : 60)
      );
    else if ((g.key === "," || g.key === ".") && O) {
      const ye = [_ == null ? void 0 : _.duration, te == null ? void 0 : te.duration].find(
        (X) => X != null && Number.isFinite(X) && X > 0
      ) ?? 0, U = e.parentVideoId != null ? (e.clipEndSec ?? ye) - (e.clipStartSec ?? 0) : ye;
      Number.isFinite(U) && U > 0 && O.seekBy((g.key === "," ? -1 : 1) * U * 0.1);
    } else if (g.key.toLowerCase() === "n" || g.key.toLowerCase() === "m")
      !g.repeat && !i && !a && (g.key.toLowerCase() === "n" && p && A(), g.key.toLowerCase() === "m" && h && C());
    else if (g.key === "ArrowUp" && te)
      te.volume = Math.min(1, te.volume + 0.1);
    else if (g.key === "ArrowDown" && te)
      te.volume = Math.max(0, te.volume - 0.1);
    else return;
    vt(g);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: w,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${ue}`,
      className: "dq-preview",
      onKeyDown: fe,
      onKeyDownCapture: Oe,
      onMouseDown: (g) => {
        g.target === g.currentTarget && v();
      },
      children: /* @__PURE__ */ u("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ u("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !p || i || a,
              onClick: A,
              children: /* @__PURE__ */ n($i, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !h || i || a,
              onClick: C,
              children: /* @__PURE__ */ n(xi, {})
            }
          ),
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: ue }),
            /* @__PURE__ */ u("p", { children: [
              "Actions target ",
              r,
              "."
            ] })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: y,
              disabled: a,
              children: d ? "Selected" : "Select"
            }
          ),
          /* @__PURE__ */ n(
            "a",
            {
              href: `/video/${e.id}`,
              target: "_blank",
              rel: "noreferrer",
              className: "dq-details-link",
              "aria-label": `Open ${ue} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ n(Uo, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: v,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(_i, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: _ ? /* @__PURE__ */ n(
          Ii,
          {
            autostart: !0,
            streamUrl: In("video", e.id),
            posterUrl: gi(e),
            format: _.format,
            audioCodec: _.audioCodec,
            duration: _.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (g) => (k.current = g, () => {
              k.current === g && (k.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: gi(e), alt: "" }) }),
        s && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: s }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((g, F) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: i || a || g.steps.length > 0 && !o || Jt(g) && !f,
            onClick: () => void I(g),
            children: [
              rr(g, F) && /* @__PURE__ */ n("kbd", { children: rr(g, F) }),
              g.label
            ]
          },
          g.id
        )) })
      ] })
    }
  );
}
function us({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: i = !1,
  onEditWorkspace: a,
  onSave: s,
  onChoose: o,
  onClose: f
}) {
  const [d, p] = S(
    () => i && t ? structuredClone(t) : null
  ), [h, y] = S(""), [A, C] = S(!1), [v, I] = S(
    i && t != null
  ), w = $(null);
  J(() => {
    var O, te;
    const g = document.activeElement, F = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (te = (O = w.current) == null ? void 0 : O.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || te.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = F, g == null || g.focus({ preventScroll: !0 });
    };
  }, []);
  function k(g) {
    var te, ye, U;
    if (g.defaultPrevented) {
      g.stopPropagation();
      return;
    }
    if (g.key === "Escape") {
      vt(g), A || f();
      return;
    }
    if (g.key !== "Tab") {
      g.stopPropagation();
      return;
    }
    const F = [
      ...((te = w.current) == null ? void 0 : te.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((X) => X.offsetParent !== null);
    if (!F.length) {
      vt(g), (ye = w.current) == null || ye.focus();
      return;
    }
    const O = F.indexOf(
      document.activeElement
    );
    g.shiftKey && O <= 0 ? (vt(g), (U = F.at(-1)) == null || U.focus()) : !g.shiftKey && O === F.length - 1 ? (vt(g), F[0].focus()) : g.stopPropagation();
  }
  function _(g, F = !!g) {
    I(F), p(
      g ? structuredClone(g) : {
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
    ), y("");
  }
  async function ue() {
    if (A) return;
    if (!d || tn(d)) {
      y(d ? tn(d) : "Choose a review.");
      return;
    }
    const g = { ...d, name: d.name.trim() }, F = e.some((O) => O.id === g.id) ? e.map((O) => O.id === g.id ? g : O) : [...e, g];
    C(!0), y("");
    try {
      if (!await s(F)) throw new Error("Could not save reviews.");
      !e.some((O) => O.id === g.id) && g.entityType !== "tag" ? a(g.id) : (o(g.id), f());
    } catch (O) {
      y(
        "Could not save reviews. Your edits are still open. " + (O instanceof Error ? O.message : "Retry saving.")
      );
    } finally {
      C(!1);
    }
  }
  async function fe(g) {
    if (!A) {
      C(!0), y("");
      try {
        if (!await s(g)) throw new Error("Could not save reviews.");
      } catch (F) {
        y(
          F instanceof Error ? F.message : "Could not save reviews."
        );
      } finally {
        C(!1);
      }
    }
  }
  async function Oe(g) {
    var O;
    if (A) return;
    const F = (O = g.target.files) == null ? void 0 : O[0];
    if (g.target.value = "", !!F) {
      if (F.size > 2e6) {
        y("Review files must be smaller than 2 MB.");
        return;
      }
      C(!0), y("");
      try {
        const te = Ur(await F.text());
        if (!await s(qn(e, te)))
          throw new Error("Could not save reviews.");
      } catch (te) {
        y(
          te instanceof Error ? te.message : "Could not import reviews."
        );
      } finally {
        C(!1);
      }
    }
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: w,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: k,
      children: /* @__PURE__ */ u("div", { className: "dq-manager", children: [
        /* @__PURE__ */ u("header", { children: [
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: d ? e.some((g) => g.id === d.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: A,
              onClick: f,
              children: /* @__PURE__ */ n(_i, {})
            }
          )
        ] }),
        h && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: h }),
        /* @__PURE__ */ n("fieldset", { disabled: A, className: "dq-manager-content", children: d ? /* @__PURE__ */ n(
          yo,
          {
            setup: d.entityType !== "tag" && !e.some((g) => g.id === d.id),
            draft: d,
            entityTypeLocked: v,
            tagGroups: r,
            saving: A,
            setDraft: p,
            onSave: () => void ue(),
            onCancel: f
          }
        ) : /* @__PURE__ */ u(me, { children: [
          /* @__PURE__ */ u("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: () => {
              const g = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), F = document.createElement("a");
              F.href = g, F.download = "data-quality-reviews.json", F.click(), URL.revokeObjectURL(g);
            }, children: "Export reviews" }),
            /* @__PURE__ */ u(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => _(),
                children: [
                  /* @__PURE__ */ n(Ko, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ u("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(Bo, {}),
              " Import reviews",
              /* @__PURE__ */ n(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: Oe
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((g) => /* @__PURE__ */ u("article", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ u("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(po, { entityType: Ae(g) }),
                /* @__PURE__ */ n("strong", { children: g.name })
              ] }),
              /* @__PURE__ */ n("p", { children: g.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => g.entityType === "tag" || Ae(g) === "video" && g.view.reviewMode === "multiple" ? _(g) : a(g.id), children: [
              /* @__PURE__ */ n(Fi, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => _({
                  ...structuredClone(g),
                  id: crypto.randomUUID(),
                  name: `${g.name} copy`
                }, !0),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${g.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${g.name}”?`) && fe(
                    e.filter((F) => F.id !== g.id)
                  );
                },
                children: /* @__PURE__ */ n(Di, {})
              }
            )
          ] }, g.id)) })
        ] }) })
      ] })
    }
  );
}
function yo({
  workspace: e = !1,
  setup: t = !1,
  draft: r,
  entityTypeLocked: i,
  tagGroups: a,
  saving: s = !1,
  setDraft: o,
  onSave: f,
  onCancel: d
}) {
  const [p, h] = S("Review"), y = Ae(r), A = ie(r), C = (w) => {
    if (!(i || w === y)) {
      if (w === "performerOccurrence" || w === "audioPerformerOccurrence") {
        o({
          id: r.id,
          entityType: w,
          name: r.name,
          description: r.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end" },
          actions: [],
          occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: !0 }
        });
        return;
      }
      if (w === "audio") {
        o({
          id: r.id,
          entityType: "audio",
          name: r.name,
          description: r.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end", reviewMode: "single" },
          actions: []
        });
        return;
      }
      o(
        w === "tag" ? {
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
  }, v = $(/* @__PURE__ */ new WeakMap()), I = (w) => {
    let k = v.current.get(w);
    return k || (k = crypto.randomUUID(), v.current.set(w, k)), k;
  };
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      Fo,
      {
        tabs: (t ? ["Review"] : e ? ["Review", ...y === "video" ? ["Appearance"] : [], "Actions", ...A ? ["Tag choices"] : []] : A ? ["Review", "Queue", "Actions", ...r.occurrence.tagIds.length ? ["Tag choices"] : []] : y === "audio" ? ["Review", "Queue", "Actions"] : ["Review", "Queue", "Appearance", "Actions"]).map((w) => ({
          key: w,
          label: w,
          count: w === "Actions" ? r.actions.length : void 0,
          disabled: s
        })),
        activeTab: p,
        onTabChange: h
      }
    ) }),
    /* @__PURE__ */ u("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ u("section", { hidden: p !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ u("label", { children: [
          "Entity type",
          /* @__PURE__ */ u(
            "select",
            {
              "aria-label": "Entity type",
              value: y,
              disabled: i,
              onChange: (w) => C(w.target.value),
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
        /* @__PURE__ */ u("label", { children: [
          "Review name",
          /* @__PURE__ */ n(
            "input",
            {
              autoFocus: !0,
              "aria-label": "Review name",
              value: r.name,
              onChange: (w) => o({ ...r, name: w.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ u("label", { children: [
          "Description",
          /* @__PURE__ */ n(
            "textarea",
            {
              "aria-label": "Description",
              value: r.description,
              onChange: (w) => o({ ...r, description: w.target.value })
            }
          )
        ] }),
        A && !t && /* @__PURE__ */ n(
          za,
          {
            review: r,
            onChange: o
          }
        )
      ] }),
      !e && !t && /* @__PURE__ */ u("section", { hidden: p !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ n(vi, { draft: r, onChange: o, presentation: !1 }),
        A && /* @__PURE__ */ n(yi, { review: r, onChange: o })
      ] }),
      !t && A && /* @__PURE__ */ n("section", { hidden: p !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n(yi, { review: r, onChange: o, choices: !0 }) }),
      !t && y !== "audio" && !A && (!e || y === "video") && /* @__PURE__ */ n("section", { hidden: p !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(vi, { draft: r, onChange: o, queue: !1 }) }),
      !t && /* @__PURE__ */ n("section", { hidden: p !== "Actions", className: "dq-editor-section", children: y === "tag" ? /* @__PURE__ */ n(
        ps,
        {
          draft: r,
          saving: s,
          tagGroups: a,
          setDraft: o
        }
      ) : /* @__PURE__ */ n(
        fs,
        {
          draft: r,
          saving: s,
          stepKey: I,
          rememberStepKey: (w, k) => v.current.set(w, I(k)),
          setDraft: o
        }
      ) })
    ] }),
    !e && /* @__PURE__ */ u("div", { className: "dq-editor-footer", children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const w = URL.createObjectURL(
              new Blob([JSON.stringify([r], null, 2)], {
                type: "application/json"
              })
            ), k = document.createElement("a");
            k.href = w, k.download = "data-quality-review.json", k.click(), URL.revokeObjectURL(w);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: d, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: f, children: t ? "Create & configure" : "Save review" })
    ] })
  ] });
}
function vo({
  action: e,
  onChange: t
}) {
  return /* @__PURE__ */ n("div", { className: "dq-field-grid", children: /* @__PURE__ */ u("label", { children: [
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
function fs({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: i,
  setDraft: a
}) {
  const s = (o, f) => a({
    ...e,
    actions: e.actions.map(
      (d, p) => p === o ? f : d
    )
  });
  return /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    ie(e) && /* @__PURE__ */ u("p", { children: [
      "Actions apply only to the active performer in this ",
      Ct(ae(e)).one,
      ". Set performer matching in the review filters below. Save review keeps those criteria with this rule."
    ] }),
    /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      En,
      {
        items: e.actions,
        getKey: (o) => o.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (o) => a({ ...e, actions: o }),
        renderItem: (o, { index: f, dragHandleProps: d, isOver: p }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: p ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ u("legend", { children: [
                "Action ",
                f + 1
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...d,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${f + 1}`,
                    children: /* @__PURE__ */ n(Un, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: o.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => a({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, f + 1),
                        {
                          ...structuredClone(o),
                          id: crypto.randomUUID(),
                          label: o.label + " copy"
                        },
                        ...e.actions.slice(f + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                vo,
                {
                  action: o,
                  onChange: (h) => s(f, h)
                }
              ),
              /* @__PURE__ */ n(
                En,
                {
                  items: o.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (h) => s(f, { ...o, steps: h }),
                  renderItem: (h, y) => /* @__PURE__ */ n(
                    gs,
                    {
                      dragHandleProps: y.dragHandleProps,
                      saving: t,
                      isOver: y.isOver,
                      step: h,
                      index: y.index,
                      onChange: (A) => {
                        i(A, h), s(f, {
                          ...o,
                          steps: o.steps.map(
                            (C, v) => v === y.index ? A : C
                          )
                        });
                      },
                      onRemove: () => s(f, {
                        ...o,
                        steps: o.steps.filter(
                          (A, C) => C !== y.index
                        )
                      })
                    }
                  )
                }
              ),
              /* @__PURE__ */ u("div", { className: "dq-row", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    className: "dq-button",
                    type: "button",
                    onClick: () => s(f, {
                      ...o,
                      steps: [...o.steps, { mode: "ADD", tagIds: [] }]
                    }),
                    children: "Add step"
                  }
                ),
                /* @__PURE__ */ n(
                  "button",
                  {
                    className: "dq-button",
                    type: "button",
                    onClick: () => a({
                      ...e,
                      actions: e.actions.filter(
                        (h, y) => y !== f
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
    /* @__PURE__ */ n(
      "button",
      {
        className: "dq-button",
        type: "button",
        onClick: () => a({
          ...e,
          actions: [
            ...e.actions,
            { id: crypto.randomUUID(), label: "", steps: [] }
          ]
        }),
        children: "Add action"
      }
    )
  ] });
}
function ps({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: i
}) {
  const a = (s, o) => i({
    ...e,
    actions: e.actions.map(
      (f, d) => d === s ? o : f
    )
  });
  return /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      En,
      {
        items: e.actions,
        getKey: (s) => s.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (s) => i({ ...e, actions: s }),
        renderItem: (s, { index: o, dragHandleProps: f, isOver: d }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: d ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ u("legend", { children: [
                "Action ",
                o + 1
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...f,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${o + 1}`,
                    children: /* @__PURE__ */ n(Un, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: s.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => i({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, o + 1),
                        {
                          ...structuredClone(s),
                          id: crypto.randomUUID(),
                          label: s.label + " copy"
                        },
                        ...e.actions.slice(o + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                vo,
                {
                  action: s,
                  onChange: (p) => a(o, p)
                }
              ),
              /* @__PURE__ */ u("label", { children: [
                "Action effect",
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: s.effect.mode === "SET_TAG_GROUP" ? `group:${s.effect.tagGroupId}` : s.effect.mode,
                    onChange: (p) => {
                      const h = p.target.value;
                      a(o, {
                        ...s,
                        effect: h === "SKIP" ? { mode: "SKIP" } : h === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : {
                          mode: "SET_TAG_GROUP",
                          tagGroupId: Number(h.slice(6))
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
                  onClick: () => i({
                    ...e,
                    actions: e.actions.filter(
                      (p, h) => h !== o
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
        onClick: () => i({
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
function gs({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: i,
  isOver: a,
  onChange: s,
  onRemove: o
}) {
  const f = bo(e.mode);
  return /* @__PURE__ */ u(
    "div",
    {
      className: a ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": f,
      children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            ...r,
            disabled: i,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${t + 1}`,
            children: /* @__PURE__ */ n(Un, {})
          }
        ),
        /* @__PURE__ */ u("span", { children: [
          "Step ",
          t + 1
        ] }),
        /* @__PURE__ */ u(
          "select",
          {
            "aria-label": "Tag operation",
            value: e.mode,
            onChange: (d) => s({ ...e, mode: d.target.value }),
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
          xt,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (d) => s({ ...e, tagIds: d }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: o, children: /* @__PURE__ */ n(Di, {}) })
      ]
    }
  );
}
async function ms() {
  const e = await Q("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const o = JSON.parse(r);
      Array.isArray(o.reviews) && (i = JSON.stringify(o.reviews, null, 2));
    } catch {
    }
  const a = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), s = document.createElement("a");
  s.href = a, s.download = "data-quality-browser-recovery.json", s.click(), URL.revokeObjectURL(a);
}
function Ni({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(Li, { className: "dq-spin" }),
    e
  ] });
}
function Ai({
  message: e,
  onRetry: t,
  retryLabel: r = "Retry"
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(Nn, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: r })
  ] });
}
const Ss = { components: { DataQualityPage: is } };
export {
  is as DataQualityPage,
  Ss as default,
  jr as objectFiltersEqual
};
