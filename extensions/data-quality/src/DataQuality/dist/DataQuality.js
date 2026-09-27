import { jsxs as u, jsx as n, Fragment as ve } from "react/jsx-runtime";
import { useState as E, useEffect as z, useRef as P, useMemo as Qt, useCallback as ir, useLayoutEffect as Ri, useId as Fo } from "react";
import { DetailListToolbar as _r, AUDIO_CRITERIA as Ln, VIDEO_CRITERIA as sn, PERFORMER_CRITERIA as Sn, NarrativeText as xo, AUDIO_SORT_OPTIONS as ki, VIDEO_SORT_OPTIONS as _n, EntityReferenceMultiSelector as Tt, FilterDialog as Ii, DetailListPagination as Oi, AudioPlayer as Lo, VideoPlayer as Mi, useCustomFieldFilterSection as _o, TAG_SORT_OPTIONS as Pi, TAG_CRITERIA as $i, EntityDetailTabs as jo, TagTile as Do, VideoCard as Uo, SortableList as Cn } from "@cove/runtime/components";
import { Save as jn, RotateCcw as Fi, ChevronLeft as xi, Pencil as Li, Settings as Ko, AlertTriangle as En, ChevronRight as _i, Film as Nn, Loader2 as ji, Tags as Bo, Headphones as Go, ExternalLink as Vo, X as Di, Plus as Jo, Upload as Qo, Trash2 as Ui, GripVertical as Dn } from "@cove/runtime/lucide-react";
import { extensionFetch as zo } from "@cove/runtime/api";
const cn = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, ln = Object.keys(
  cn
);
function Er(e) {
  return e === "excludes" || e === "excludesAll";
}
const Wo = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function ce(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function Fr(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function le(e) {
  return Fr(Me(e));
}
function Ki(e) {
  return Me(e) === "video";
}
function Me(e) {
  return e.entityType ?? "video";
}
function or(e, t) {
  return "qwertyuiop"[t] ?? "";
}
function en(e) {
  return ce(e) && !Vi(e.occurrence) ? "Complete the optional occurrence condition before saving." : !Ki(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Me(e) !== "tag" && e.actions.some(
    (t) => Gi(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => gr(t, Me(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const Ho = {
  video: 1e3,
  audio: 250
};
function ze(e, t = "video") {
  const r = (i, o) => Number.isFinite(Number(i)) && Number(i) > 0 ? Math.floor(Number(i)) : o;
  return {
    ...e,
    page: Math.max(1, r(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(Ho[t], r(e.perPage, 40))
    )
  };
}
function ci(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function xt(e) {
  const { page: t, ...r } = e.view.filter, i = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    ce(e) ? [e.entityType, ...i, e.occurrence] : Me(e) === "video" ? i : [Me(e), ...i]
  );
}
function gr(e, t) {
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
    ].includes(i.mode) && i.tagIds.length > 0 && i.tagIds.every((o) => Number.isSafeInteger(o) && o > 0)
  ) && !Gi(e) : !1;
}
function Yo(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function pr(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function Bi(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function zt(e) {
  return "steps" in e ? e.steps.some((t) => pr(t.mode)) : !1;
}
function Gi(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.steps)
    if (pr(r.mode))
      for (const i of r.tagIds) {
        const o = t.get(i);
        if (o && o !== r.mode) return !0;
        t.set(i, r.mode);
      }
  return !1;
}
function Ur(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || Wo.includes(r.entityType)) && (!Yo(r.entityType) || Vi(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && (r.view.reviewMode === void 0 || ["single", "multiple"].includes(r.view.reviewMode)) && (r.view.reviewMode !== "multiple" || (r.entityType ?? "video") === "video") && (r.view.selectAllOnLoad === void 0 || typeof r.view.selectAllOnLoad == "boolean") && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Xo(
      r.presentation,
      (r.entityType ?? "video") !== "video"
    ) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (r.entityType === "tag" ? "effect" in i && !("steps" in i) && gr(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (o) => o && Array.isArray(o.tagIds)
      ) && gr(i, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => en(r)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Xo(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const r = e;
  return (r.cardSize === void 0 || r.cardSize === null || Number.isFinite(r.cardSize) && r.cardSize >= 115 && r.cardSize <= 380) && (!t || r.annotations === void 0 && r.annotationParents === void 0 && r.binParents === void 0) && (r.annotations === void 0 || Array.isArray(r.annotations) && r.annotations.every(
    (i) => ["date", "studio", "performers", "tags"].includes(i)
  )) && [r.annotationParents, r.binParents].every(
    (i) => i === void 0 || Array.isArray(i) && i.every((o) => Number.isSafeInteger(o) && o > 0)
  );
}
function An(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const o of i)
      r.has(o.id) || (r.add(o.id), t.push(o));
  return t;
}
function Vi(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (i) => Array.isArray(i) && i.every((o) => Number.isSafeInteger(o) && o > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && (t.targetMode !== "selected" || t.performerIds.length > 0) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && ln.includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.flagPerformerTagIds === void 0 || r(t.flagPerformerTagIds)) && r(t.tagIds) && typeof t.multiple == "boolean";
}
function li(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function di(e, t, r, i) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!i && t.includes(r)) return r;
  const o = Math.max(0, e.indexOf(r));
  if (i) {
    for (const s of e.slice(o + 1))
      if (t.includes(s)) return s;
    if (t.includes(r)) {
      for (const s of e.slice(0, o).reverse())
        if (t.includes(s)) return s;
      return r;
    }
  }
  return t[Math.min(o, t.length - 1)];
}
function ui(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((o) => r.has(o));
  for (const o of t)
    i ? r.delete(o) : r.add(o);
  return r;
}
function Ji(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function Zo(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-actions, .dq-pagination-row, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function ea(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function ta(e, t) {
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
const Qi = "ext:com.midnightrider.data-quality:configuration", ra = "ext:cove-data-quality:video-reviews", qn = "ext:com.midnightrider.data-quality:progress", Kr = /* @__PURE__ */ new Map(), Hr = /* @__PURE__ */ new Map(), fr = (e, t) => e.includes("*") || e.includes(t), tn = (e) => V(`/api/savedfilters?mode=${encodeURIComponent(e)}`), na = () => ({
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
function Sr(e) {
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
function ia(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const o of t) {
    const s = localStorage.getItem(o);
    if (s !== null) {
      const a = Ur(s);
      r ?? (r = a), a.forEach((p) => i.add(p.id));
    }
    Tn(
      JSON.parse(localStorage.getItem(`${o}:account-imports`) ?? "[]")
    ).forEach((a) => i.add(a));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function zi(e) {
  const t = await V("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Wi(e, t) {
  const r = (Hr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Hr.set(e, r), r.finally(() => {
    Hr.get(e) === r && Hr.delete(e);
  }).catch(() => {
  }), r;
}
let $r = null;
function oa() {
  if ($r) return $r;
  const e = aa();
  return $r = e, e.finally(() => {
    $r === e && ($r = null);
  }).catch(() => {
  }), e;
}
async function aa() {
  var C;
  const e = await V("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = fr(e.permissions, "savedfilters.read"), o = i && fr(e.permissions, "savedfilters.write"), s = i ? (await tn(Qi)).filter((v) => v.name === "Data Quality configuration").sort((v, y) => v.id - y.id) : [];
  if (s.length > 1) {
    const v = (y) => {
      const { revision: O, ...w } = Sr(y.uiOptions);
      return JSON.stringify(w);
    };
    if (s.some((y) => v(y) !== v(s[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (o)
      for (const y of s.slice(1))
        await V(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    s.splice(1);
  }
  let a = s.length ? Sr(s[0].uiOptions) : na();
  const p = localStorage.getItem(`${r}:migrated`) === "true", d = localStorage.getItem(r), f = localStorage.getItem(`${r}:local-only`) === "true";
  !s.length && d && (a = Sr(d));
  let h = !s.length;
  if (s.length && f && d) {
    const v = Sr(d);
    if (v.reviews.some((O) => {
      const w = a.reviews.find((R) => R.id === O.id);
      return w && JSON.stringify(w) !== JSON.stringify(O);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const y = [
      .../* @__PURE__ */ new Set([...a.deletedIds, ...v.deletedIds])
    ];
    a = {
      ...a,
      reviews: An(a.reviews, v.reviews).filter(
        (O) => !y.includes(O.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...a.importedIds, ...v.importedIds])
      ]
    }, h = !0;
  }
  if (!p) {
    const v = JSON.stringify(a), y = ia(t);
    if (s.length && y.reviews.some((F) => {
      const te = a.reviews.find((ae) => ae.id === F.id);
      return te && JSON.stringify(te) !== JSON.stringify(F);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const O = i ? (await tn(ra)).flatMap(
      (F) => Ur(F.uiOptions ?? "[]")
    ) : [], w = y.known.filter(
      (F) => !y.reviews.some((te) => te.id === F)
    ), R = /* @__PURE__ */ new Set([...a.deletedIds, ...w]);
    a = {
      ...a,
      reviews: An(
        y.reviews,
        a.reviews,
        O.filter(
          (F) => !y.known.includes(F.id) && !a.importedIds.includes(F.id)
        )
      ).filter((F) => !R.has(F.id)),
      deletedIds: [...R],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...a.importedIds,
          ...y.known,
          ...O.map((F) => F.id)
        ])
      ]
    }, h || (h = JSON.stringify(a) !== v);
  }
  const S = {
    userId: t,
    recordId: (C = s[0]) == null ? void 0 : C.id,
    config: a,
    readable: i,
    writable: o,
    durable: o
  };
  if (Kr.set(r, S), h && o) {
    const v = a;
    s.length && (S.config = Sr(s[0].uiOptions)), await Hi(r, v), a = S.config;
  } else s.length || (localStorage.setItem(r, JSON.stringify(a)), !i && (!p || f) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (o)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: a.reviews,
    storageKey: r,
    canWrite: fr(e.permissions, "videos.write"),
    canWriteVideos: fr(e.permissions, "videos.write"),
    canWriteAudios: fr(e.permissions, "audios.write"),
    canWriteTags: fr(e.permissions, "tags.write"),
    canReadTagGroups: fr(e.permissions, "taggroups.read"),
    canConfigure: !i || o,
    storageNotice: i ? o ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Hi(e, t) {
  const r = Kr.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await zi(r), r.recordId != null) {
      const s = await V(
        `/api/savedfilters/${r.recordId}`
      );
      if (Sr(s.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const o = await V(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Qi,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(i)
        })
      }
    );
    r.recordId = o.id;
  } else
    localStorage.setItem(e, JSON.stringify(i)), localStorage.setItem(`${e}:local-only`, "true");
  if (r.config = i, r.durable)
    try {
      localStorage.setItem(e, JSON.stringify(i)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function sa(e, t) {
  return Ur(JSON.stringify(t)), Wi(e, async () => {
    const r = Kr.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((o) => !t.some((s) => s.id === o.id)).map((o) => o.id);
    await Hi(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((o) => !t.some((s) => s.id === o))
    });
  });
}
function fi(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([r, i]) => /^[1-9]\d*:[1-9]\d*$/.test(r) && ["reviewed", "cannotDetermine"].includes(String(i)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function ca(e, t) {
  const r = Kr.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), o = i ? fi(i) : null;
  if (!r.readable) return o;
  const s = (await tn(qn)).find(
    (p) => p.name === t
  ), a = s ? fi(s.uiOptions) : null;
  return o && (!a || o.updatedAt > a.updatedAt) ? o : a;
}
function la(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return Wi(i, async () => {
    const o = Kr.get(e);
    if (!(o != null && o.writable)) return;
    await zi(o);
    const s = (await tn(qn)).find(
      (a) => a.name === t
    );
    await V(
      s ? `/api/savedfilters/${s.id}` : "/api/savedfilters",
      {
        method: s ? "PUT" : "POST",
        body: JSON.stringify({
          mode: qn,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
function ar(e) {
  return e === "audio" ? "audios" : "videos";
}
const da = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function yt(e) {
  return da[e];
}
const rn = "confirmed_absent_tags", Un = "Confirmed absent tags", dn = "confirmed_absent_occurrence_tags", Yi = {
  key: rn,
  label: Un,
  type: "tag",
  subject: "tag assessments"
}, Kn = {
  key: dn,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, ua = {
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
function Wt(e) {
  return Array.isArray(e) ? e.map(Wt) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? ua[r] ?? r : t === "key" && typeof r == "string" && [
        rn,
        dn
      ].includes(r.toLowerCase()) ? r.toLowerCase() : Wt(r)
    ])
  ) : e;
}
async function Xi(e, t, r) {
  const i = new Headers(t.headers);
  !(t.body instanceof FormData) && !i.has("Content-Type") && i.set("Content-Type", "application/json");
  const o = await zo(e, { ...t, headers: i });
  if (o.status === 404 && r === "null") return null;
  if (!o.ok) {
    let a = o.statusText || `Request failed (${o.status}).`;
    try {
      const p = await o.json();
      a = p.message || p.detail || p.error || a;
    } catch {
    }
    throw new Error(a);
  }
  if (o.status === 204 || o.status === 205) return;
  const s = await o.text();
  return s ? JSON.parse(s) : void 0;
}
async function V(e, t = {}) {
  return await Xi(e, t, "fail");
}
function fa(e, t = {}) {
  return Xi(e, t, "null");
}
const pa = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let ga = 0;
function Rn(e, t) {
  return V(
    `/api/${ar(e)}/${t}?dqRead=${pa}-${++ga}`,
    { cache: "no-store" }
  );
}
function Zi(e, t) {
  const r = { ...e.view.objectFilter }, i = r._filterExpression;
  if (delete r._filterExpression, delete r.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Wt({
      findFilter: ze(t, le(e)),
      objectFilter: r,
      filterExpression: i
    })
  );
}
async function xr(e, t, r) {
  return V(
    `/api/${ar(le(e))}/find`,
    { method: "POST", signal: r, body: Zi(e, t) }
  );
}
async function ma(e, t, r) {
  return (await V(
    `/api/${ar(le(e))}/aggregate`,
    {
      method: "POST",
      signal: r,
      body: Zi(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function pi(e, t, r) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, V("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Wt({
        findFilter: ze(t),
        objectFilter: i
      })
    )
  });
}
function ha(e) {
  return V("/api/taggroups", { signal: e });
}
function gi(e, t) {
  return `/api/${ar(e)}/${t.id}/image?max=1280&v=${encodeURIComponent(t.updatedAt)}`;
}
function kn(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function mi(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function ba(e) {
  return `/api/stream/video/${e}/preview`;
}
function ya(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function wa(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Bn(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const i of e) {
    await V(`/api/tags/${i}`, { signal: t }), r.add(i);
    for (let o = 1; ; o++) {
      const s = await V("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Wt({
            findFilter: { page: o, perPage: 1e3, sort: "id", direction: "asc" },
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
      for (const a of s.items) r.add(a.id);
      if (o * 1e3 >= s.totalCount) break;
      if (!s.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...r];
}
async function Gn(e, t) {
  const r = Bi(e);
  return (await Promise.all(
    e.steps.map(
      async (o) => o.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await Bn(o.tagIds, t)).filter(
          (s) => !r.has(s)
        )
      } : o
    )
  )).filter((o) => o.tagIds.length > 0);
}
function va(e, t) {
  const r = [];
  return t.type !== e.type && r.push(`type "${e.type}"`), t.isMultiValue || r.push("multiple values enabled"), t.filterable || r.push("filtering enabled"), r.length ? `The ${e.key} custom field is incompatible. It must have ${r.join(", ")}.` : "";
}
async function Vn(e, t) {
  const i = (await V("/api/custom-fields")).find(
    (s) => s.key.toLowerCase() === e.key
  );
  if (!i)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const o = va(e, i);
  return o ? { kind: "incompatible", message: o } : i.entityTypes.includes(t) ? { kind: "ready", definition: i, message: "" } : {
    kind: "missing",
    message: `Add ${yt(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: i
  };
}
async function eo(e, t) {
  const r = await Vn(e, t);
  if (r.kind !== "ready") {
    if (r.kind === "incompatible") throw new Error(r.message);
    if (r.definition) {
      await V(`/api/custom-fields/${r.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...r.definition.entityTypes, t])]
        })
      });
      return;
    }
    await V("/api/custom-fields", {
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
function to(e = "video") {
  return Vn(Yi, e);
}
function Sa(e = "video") {
  return eo(Yi, e);
}
function ro(e = "video") {
  return Vn(Kn, e);
}
function Ca(e = "video") {
  return eo(Kn, e);
}
function nn(e) {
  return [...new Set(e)];
}
function no(e, t) {
  const r = e.customFields ?? {}, i = Object.keys(r).find(
    (s) => s.toLowerCase() === dn
  ), o = i === void 0 ? [] : r[i];
  return nn(
    (Array.isArray(o) ? o : []).filter(
      (s) => typeof s == "string" && /^[1-9]\d*:[1-9]\d*$/.test(s)
    ).map((s) => s.split(":").map(Number)).filter(([s]) => s === t).map(([, s]) => s)
  );
}
async function Ea(e) {
  let t;
  try {
    t = await ro(e);
  } catch (r) {
    throw new Error(
      `Could not verify the ${Kn.label} custom field. ${r instanceof Error ? r.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Na(e, t, r, i, o, s) {
  await V(`/api/${ar(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [r],
      customFields: {
        [e]: nn(o).map((a) => `${i}:${a}`)
      },
      customFieldMode: s
    })
  });
}
function Aa(e, t, r) {
  const i = [...e.tagIds], o = (s) => {
    if (r === null)
      throw new Error(
        `The ${Un} custom field is not available.`
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
      return { ids: t, tagIds: i, tagMode: "ADD", ...o("REMOVE") };
    case "MARK_ABSENT":
      return { ids: t, tagIds: i, tagMode: "REMOVE", ...o("ADD") };
    case "CLEAR_ABSENCE":
      return { ids: t, ...o("REMOVE") };
  }
}
async function io(e, t, r) {
  if (!gr(t) || r.length === 0 || r.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${yt(e).many} and configure a valid action first.`
    );
  let i = null;
  if (zt(t)) {
    let d;
    try {
      d = await to(e);
    } catch (f) {
      throw new Error(
        `Could not verify the ${Un} custom field. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    i = d.definition.key;
  }
  const o = nn(r), s = (await Gn(t)).map((d) => ({
    mode: d.mode,
    tagIds: nn(d.tagIds)
  })), p = [
    ...s.filter((d) => !pr(d.mode)),
    ...s.filter((d) => pr(d.mode))
  ].map(
    (d) => Aa(d, o, i)
  );
  for (let d = 0; d < p.length; d++)
    try {
      await V(`/api/${ar(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(p[d])
      });
    } catch (f) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${yt(e).many} before retrying. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
}
async function qa(e, t) {
  if (!gr(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await V("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
function on(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Jn(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Qn(e) {
  return !!String(e ?? "").trim();
}
function zn(e) {
  return [
    ...new Set(
      on(e.customFieldCriteria).filter(Jn).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Qn(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Wn(e, t) {
  const r = on(e.customFieldCriteria);
  if (!r.length) return e;
  let i = !1;
  const o = r.map((s) => {
    if (!Jn(s)) return s;
    const a = { ...s };
    for (const [p, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(s[p] ?? "")];
      f && !Qn(s[d]) && (a[d] = f, i = !0);
    }
    return a;
  });
  return i ? { ...e, customFieldCriteria: o } : e;
}
function oo(e, t, r) {
  const i = on(e.customFieldCriteria);
  if (!i.length) return e;
  const o = on(r.customFieldCriteria), s = (d, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (h) => (d[h] ?? void 0) === (f[h] ?? void 0)
  );
  let a = !1;
  const p = i.map((d) => {
    if (!Jn(d)) return d;
    const f = o.find((S) => s(S, d));
    if (!f) return d;
    const h = { ...d };
    for (const [S, C] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const v = t[String(d[S] ?? "")];
      v && d[C] === v && !Qn(f[C]) && (delete h[C], a = !0);
    }
    return h;
  });
  return a ? { ...e, customFieldCriteria: p } : e;
}
async function Ta(e, t, r) {
  if (!gr(r))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const i = le(e), o = r.steps.some((p) => pr(p.mode)) ? await Ea(i) : "", s = await Gn(r);
  let a = t.applications;
  for (const p of [
    ...s.filter((d) => !pr(d.mode)),
    ...s.filter((d) => pr(d.mode))
  ]) {
    const d = (f) => Na(
      o,
      i,
      t.media.id,
      t.performer.id,
      p.tagIds,
      f
    );
    (p.mode === "MARK_PRESENT" || p.mode === "CLEAR_ABSENCE") && await d("REMOVE"), p.mode !== "CLEAR_ABSENCE" && (a = await lo(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: p.tagIds,
          multiple: !0
        }
      },
      t,
      ["ADD", "MARK_PRESENT"].includes(p.mode) ? p.tagIds : []
    )), p.mode === "MARK_ABSENT" && await d("ADD");
  }
  return a;
}
async function Hn(e, t) {
  const r = e.occurrence;
  if (r.targetMode === "all" || r.targetMode === "filter" && Object.keys(r.performerFilter).length === 0) return null;
  if (r.targetMode === "selected") return r.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: o, ...s } = r.performerFilter;
  for (let a = 1; ; a++) {
    const p = await V("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Wt({
          findFilter: { page: a, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: s,
          filterExpression: o
        })
      )
    });
    if (p.items.forEach((d) => i.add(d.id)), a * 1e3 >= p.totalCount) return [...i];
    if (!p.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function ao(e) {
  return Er(e.condition) && e.hideConfirmedAbsent !== !1;
}
function Yn(e, t) {
  const { _filterExpression: r, ...i } = e.view.objectFilter, o = e.occurrence, s = {
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
  }, a = ao(o) && (t == null ? void 0 : t.length) === 1 && o.conditionTagIds.length === 1 ? `${t[0]}:${o.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: le(e),
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
            ...a ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: dn,
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
async function Xn(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((r) => [r]) : Promise.all(
    e.conditionTagIds.map((r) => Bn([r], t))
  );
}
function so(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function Ra(e, t, r = e.conditionTagIds.map((i) => [i])) {
  const i = new Set(t), o = (s) => s.some((a) => i.has(a));
  switch (e.condition) {
    case "any":
      return !0;
    case "isNull":
      return i.size === 0;
    case "includes":
      return r.some(o);
    case "includesAll":
      return r.every(o);
    case "excludes":
      return !r.some(o);
    case "excludesAll":
      return !r.every(o);
  }
}
function ka(e, t, r, i, o) {
  if (!ao(e)) return !1;
  const s = no(t, r);
  return e.conditionTagIds.every(
    (a, p) => s.includes(a) || o[p].some((d) => i.includes(d))
  );
}
async function co(e, t, r, i) {
  if ((t == null ? void 0 : t.length) === 0 || so(e.occurrence))
    return { items: [], totalCount: 0 };
  const o = le(e), s = await xr(
    Yn(e, t),
    { ...e.view.filter, page: r },
    i
  ), a = t === null ? null : new Set(t), p = e.occurrence, d = s.items.length ? await Xn(p, i) : [], f = new Array(s.items.length);
  let h = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, s.items.length) }, async () => {
      for (; h < s.items.length; ) {
        const S = h++, C = s.items[S], v = await V(
          `/api/tagapplications?hostType=${o}&hostId=${C.id}&contextType=performer`,
          { signal: i }
        );
        f[S] = C.performers.filter((y) => a === null || a.has(y.id)).flatMap((y) => {
          const O = v.filter(
            (R) => R.hostType === o && R.hostId === C.id && R.contextType === "performer" && R.contextId === y.id
          ), w = O.map((R) => R.tag.id);
          return Ra(e.occurrence, w, d) && !ka(p, C, y.id, w, d) ? [
            {
              key: `${C.id}:${y.id}`,
              media: C,
              performer: y,
              applications: O
            }
          ] : [];
        });
      }
    })
  ), { items: f.flat(), totalCount: s.totalCount };
}
async function lo(e, t, r) {
  const i = new Set(e.occurrence.tagIds);
  if (r.some((f) => !i.has(f)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const o = le(e), s = await Rn(o, t.media.id);
  if (!s.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${o}. Refresh the queue.`
    );
  const a = `/api/tagapplications?hostType=${o}&hostId=${s.id}&contextType=performer&contextId=${t.performer.id}`, p = (await V(a)).filter(
    (f) => f.hostType === o && f.hostId === s.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), d = new Set(r);
  try {
    for (const f of d)
      p.some((h) => h.tag.id === f) || await V("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: o,
          hostId: s.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: f,
          sourceKey: "user"
        })
      });
    for (const f of p)
      i.has(f.tag.id) && !d.has(f.tag.id) && await V(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await V(a);
  } catch (f) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${f instanceof Error ? f.message : "Request failed."}`
    );
  }
}
function Nr(e, t) {
  return {
    added: t.filter((r) => !e.includes(r)),
    removed: e.filter((r) => !t.includes(r))
  };
}
function Ia(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function qt(e, t, r = !0) {
  var p;
  if (t.occurrence) {
    const d = r ? no(
      await Rn(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await V(Ia(e, t))).filter(
      (h) => h.hostType === e && h.hostId === t.media.id && h.contextType === "performer" && h.contextId === t.occurrence.performer.id
    );
    return {
      ids: [...new Set(f.map((h) => h.tag.id))],
      names: [...new Set(f.map((h) => h.tag.name))],
      absent: d,
      applications: f
    };
  }
  const i = await Rn(e, t.media.id), o = (i.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  ), s = Object.keys(i.customFields ?? {}).find(
    (d) => d.toLowerCase() === rn
  ) ?? rn, a = ((p = i.customFields) == null ? void 0 : p[s]) ?? [];
  if (!Array.isArray(a) || a.some((d) => !Number.isSafeInteger(d)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${e} before editing.`
    );
  return { ids: o.map((d) => d.id), names: o.map((d) => d.name), absent: a };
}
async function Zn(e, t, r) {
  if (t.occurrence && ce(e))
    await lo(
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
    for (const [i, o] of [
      ["ADD", r.added],
      ["REMOVE", r.removed]
    ])
      o.length && await V(
        `/api/${ar(le(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: i, tagIds: o })
        }
      );
}
async function Oa(e, t, r) {
  t.occurrence && ce(e) ? await Ta(e, t.occurrence, r) : await io(le(e), r, [t.media.id]);
}
function In(e, t, r, i) {
  const o = (s) => s.filter((a) => i.includes(a));
  return {
    item: e,
    before: t,
    after: r,
    tags: Nr(o(t.ids), o(r.ids)),
    absence: Nr(o(t.absent), o(r.absent))
  };
}
function Ma(e, t) {
  var r;
  for (const [i, o] of [
    [e.tags, t.ids],
    [e.absence, t.absent]
  ])
    if (i.added.some((s) => !o.includes(s)) || i.removed.some((s) => o.includes(s)))
      throw new Error(
        "Undo conflict: affected tags changed since this operation. Inspect the item; no undo changes were made."
      );
  if (t.applications)
    for (const i of e.tags.added) {
      const o = (r = e.after.applications) == null ? void 0 : r.filter((a) => a.tag.id === i).map((a) => a.id).sort(), s = t.applications.filter((a) => a.tag.id === i).map((a) => a.id).sort();
      if (JSON.stringify(o) !== JSON.stringify(s))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
const On = (e) => e instanceof Error ? e.message : "Request failed.", hi = (e) => [...e].sort((t, r) => t - r), jr = (e, t) => JSON.stringify(hi(e)) === JSON.stringify(hi(t)), Mn = (e) => !!(e.tags.added.length || e.tags.removed.length);
function an(e, t, r, i) {
  const o = new Set(e), s = new Set(e);
  for (const h of t.steps)
    for (const S of h.tagIds)
      h.mode === "ADD" ? s.add(S) : s.delete(S);
  const a = e.some((h) => !s.has(h));
  if (a && !i)
    return { desired: [...e], conflict: a, skipped: !0, kept: [], replaced: [] };
  const p = new Set(
    t.steps.filter((h) => h.mode === "ADD").flatMap((h) => h.tagIds)
  ), d = [], f = [];
  for (const h of r) {
    const S = h.filter((v) => s.has(v) && !o.has(v)), C = h.filter(
      (v) => s.has(v) && o.has(v) && !p.has(v)
    );
    !S.length || !C.length || (i ? (C.forEach((v) => s.delete(v)), f.push(...C)) : (S.forEach((v) => s.delete(v)), d.push({ tagIds: S, existing: C })));
  }
  return { desired: [...s], conflict: a, skipped: !1, kept: d, replaced: f };
}
function Pa(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function $a(e, t, r, i) {
  for (const [o, s] of r.entries()) {
    const a = t.filter(
      (f) => f.steps.some(
        (h) => h.mode === "ADD" && h.tagIds.some((S) => s.includes(S))
      )
    );
    if (a.length < 2) continue;
    const p = e.occurrence.conditionTagIds[o];
    let d = `tag ${p}`;
    try {
      d = (await V(`/api/tags/${p}`, { signal: i })).name;
    } catch {
      i.throwIfAborted();
    }
    throw new Error(
      `${a.map((f) => f.label).join(" and ")} answer the same condition tag, ${d}. Choose one of them.`
    );
  }
}
async function Fa(e, t, r, i = () => {
}) {
  if (!t.length || t.some(
    (C) => !gr(C, e.entityType) || !C.steps.length || C.steps.some(
      (v) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(v.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const o = structuredClone(e), s = structuredClone(t), a = Er(o.occurrence.condition) && o.occurrence.includeSubtags !== !1 ? await Xn(o.occurrence, r) : [];
  await $a(o, s, a, r);
  const p = await Promise.all(
    s.map(async (C) => ({
      ...C,
      steps: await Gn(C, r)
    }))
  ), d = structuredClone(Pa(p));
  r.throwIfAborted();
  const f = [
    .../* @__PURE__ */ new Set([
      ...d.steps.flatMap((C) => C.tagIds),
      ...a.flat()
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
  const h = await Hn(o, r), S = /* @__PURE__ */ new Map();
  for (let C = 1; ; C++) {
    r.throwIfAborted();
    const v = await co(o, h, C, r);
    for (const y of v.items) {
      const O = {
        ids: [...new Set(y.applications.map((R) => R.tag.id))],
        names: y.applications.map((R) => R.tag.name),
        absent: [],
        applications: y.applications
      }, w = an(O.ids, d, a, !0);
      S.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: O,
        expected: O,
        conflict: w.conflict,
        status: jr(O.ids, w.desired) ? "unchanged" : "pending"
      });
    }
    if (i(S.size), C * 250 >= v.totalCount) break;
    if (C > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return r.throwIfAborted(), {
    review: o,
    actions: s,
    action: d,
    categories: a,
    touched: f,
    entries: [...S.values()]
  };
}
function xa(e, t, r) {
  const i = (s) => s.ids.filter((a) => r.includes(a));
  if (!jr(i(e), i(t))) return !1;
  const o = (s) => (s.applications ?? []).filter((a) => r.includes(a.tag.id)).map((a) => a.id);
  return jr(o(e), o(t));
}
async function uo(e, t, r, i) {
  let o = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; !t() && o < e.length; ) {
        const s = e[o++];
        await r(s), i();
      }
    })
  );
}
async function La(e, t, r, i, o = !1) {
  const s = e.entries.filter(
    (a) => o ? a.status === "failed" : a.status === "pending"
  );
  await uo(
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
      let p;
      try {
        if (p = await qt(le(e.review), a.item, !1), !xa(a.expected, p, e.touched)) {
          a.status = "skipped", a.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (v) {
        a.status = "failed", a.error = On(v);
        return;
      }
      const d = an(
        a.before.ids,
        e.action,
        e.categories,
        t
      ), f = [
        ...p.ids.filter((v) => !e.touched.includes(v)),
        ...d.desired.filter((v) => e.touched.includes(v))
      ], h = Nr(p.ids, f);
      if (!h.added.length && !h.removed.length) {
        const v = !a.operation && d.kept.length > 0;
        a.status = a.operation ? "changed" : v ? "skipped" : "unchanged", a.error = v ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let S;
      try {
        await Zn(e.review, a.item, h);
      } catch (v) {
        S = v;
      }
      let C = !1;
      try {
        const v = await qt(le(e.review), a.item, !1);
        C = !0, a.expected = v;
        const y = In(
          a.item,
          a.before,
          v,
          e.touched
        );
        if (a.operation = Mn(y) ? y : void 0, S) throw S;
        if (!jr(
          v.ids.filter((O) => e.touched.includes(O)),
          f.filter((O) => e.touched.includes(O))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        a.status = a.operation ? "changed" : "unchanged", a.error = void 0;
      } catch (v) {
        if (a.status = "failed", a.error = On(v), !C)
          try {
            const y = await qt(le(e.review), a.item, !1);
            a.expected = y;
            const O = In(
              a.item,
              a.before,
              y,
              e.touched
            );
            a.operation = Mn(O) ? O : void 0;
          } catch {
            a.unverified = !0;
          }
      }
    },
    i
  );
}
async function _a(e, t, r) {
  await uo(
    e.entries.filter((i) => i.operation),
    t,
    async (i) => {
      const o = i.operation;
      if (i.unverified) {
        i.error = "Undo unavailable: the previous write could not be verified. Inspect this occurrence.";
        return;
      }
      const s = [...o.tags.added, ...o.tags.removed];
      let a = !1;
      try {
        const p = await qt(le(e.review), i.item, !1);
        Ma(o, p), a = !0, await Zn(e.review, i.item, {
          added: o.tags.removed,
          removed: o.tags.added
        });
        const d = await qt(le(e.review), i.item, !1);
        if (!jr(
          d.ids.filter((f) => s.includes(f)),
          i.before.ids.filter((f) => s.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        i.operation = void 0, i.expected = d, i.status = "unchanged", i.error = void 0;
      } catch (p) {
        if (i.error = `Undo stopped: ${On(p)}`, i.status = "failed", a)
          try {
            const d = await qt(le(e.review), i.item, !1), f = In(
              i.item,
              i.before,
              d,
              s
            );
            i.operation = Mn(f) ? f : void 0, i.expected = d;
          } catch {
            i.unverified = !0;
          }
      }
    },
    r
  );
}
async function ja(e, t, r) {
  const i = le(e), o = e.occurrence, [s, a] = await Promise.all([
    V(
      `/api/tagapplications?hostType=${i}&contextType=performer&contextId=${t}`,
      { signal: r }
    ),
    Xn(o, r)
  ]), p = s.filter(
    (y) => y.hostType === i && y.contextType === "performer" && y.contextId === t
  ), d = await Promise.all(
    a.map(async (y, O) => {
      const w = o.conditionTagIds[O];
      return (await V(`/api/tags/${w}`, { signal: r })).name;
    })
  ), f = new Set(a.flat()), h = new Set(
    [
      ...e.actions.flatMap((y) => y.steps).filter((y) => y.mode === "ADD" || y.mode === "MARK_PRESENT").flatMap((y) => y.tagIds),
      ...o.tagIds
    ].filter((y) => !f.has(y))
  ), S = (y) => {
    const O = /* @__PURE__ */ new Map();
    for (const w of p) {
      if (!y.has(w.tag.id)) continue;
      const R = O.get(w.tag.id) ?? {
        name: w.tag.name,
        hosts: /* @__PURE__ */ new Set()
      };
      R.hosts.add(w.hostId), O.set(w.tag.id, R);
    }
    return [...O].map(([w, R]) => ({ id: w, name: R.name, count: R.hosts.size })).sort((w, R) => R.count - w.count || w.name.localeCompare(R.name));
  }, C = a.map((y, O) => ({
    id: o.conditionTagIds[O],
    name: d[O],
    tags: S(new Set(y))
  }));
  h.size && C.push({
    id: null,
    name: a.length ? "Other review tags" : "Review tags",
    tags: S(h)
  });
  const v = /* @__PURE__ */ new Set([...f, ...h]);
  return {
    answered: new Set(
      p.filter((y) => v.has(y.tag.id)).map((y) => y.hostId)
    ).size,
    groups: C
  };
}
function fo({
  review: e,
  performerId: t,
  revision: r = 0
}) {
  const [i, o] = E(null), [s, a] = E(""), p = yt(le(e)), d = e.occurrence, f = JSON.stringify([
    e.entityType,
    t,
    d.condition,
    d.conditionTagIds,
    d.includeSubtags,
    d.tagIds,
    e.actions.map((h) => h.steps)
  ]);
  return z(() => {
    const h = new AbortController();
    return o(null), a(""), ja(e, t, h.signal).then((S) => {
      h.signal.aborted || o(S);
    }).catch((S) => {
      h.signal.aborted || a(S instanceof Error ? S.message : "Request failed.");
    }), () => h.abort();
  }, [f, r]), /* @__PURE__ */ u("section", { className: "dq-performer-answers", "aria-label": "Existing answers", children: [
    /* @__PURE__ */ n("h3", { children: "Existing answers" }),
    s ? /* @__PURE__ */ u("p", { role: "alert", children: [
      "Could not load existing answers. ",
      s
    ] }) : i ? /* @__PURE__ */ u(ve, { children: [
      /* @__PURE__ */ n("p", { children: i.answered ? `Answered on ${i.answered.toLocaleString()} of this performer’s ${p.many}.` : `None of this performer’s ${p.many} is answered yet.` }),
      /* @__PURE__ */ n("ul", { children: i.groups.filter((h) => h.id !== null || h.tags.length).map((h) => /* @__PURE__ */ u("li", { children: [
        h.name,
        ":",
        " ",
        h.tags.length ? h.tags.map((S) => `${S.name} ×${S.count.toLocaleString()}`).join(", ") : "None",
        h.id !== null && h.tags.length > 1 && /* @__PURE__ */ n("strong", { className: "dq-answers-mixed", children: " Mixed answers" })
      ] }, h.id ?? "other")) })
    ] }) : /* @__PURE__ */ n("p", { children: "Loading existing answers…" })
  ] });
}
async function bi(e, t, r) {
  const i = new Array(e.length);
  let o = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; o < e.length; ) {
        r.throwIfAborted();
        const s = o++, a = e[s];
        try {
          i[s] = [
            a,
            (await V(`/api/${t}/${a}`, {
              signal: r
            })).name
          ];
        } catch {
          r.throwIfAborted(), i[s] = [
            a,
            `${t === "tags" ? "Tag" : "Performer"} ${a}`
          ];
        }
      }
    })
  ), i;
}
function Da(e, t) {
  const r = 1100 - (Date.now() - e);
  return r <= 0 ? Promise.resolve() : new Promise((i, o) => {
    const s = window.setTimeout(i, r);
    t.addEventListener(
      "abort",
      () => {
        window.clearTimeout(s), o(t.reason);
      },
      { once: !0 }
    );
  });
}
function Ua({
  review: e,
  disabled: t,
  hidden: r = !1,
  performerFlags: i = [],
  onOpen: o,
  onClose: s,
  onWrite: a
}) {
  const [p, d] = E(!1), [f, h] = E(null), [S, C] = E([]), [v, y] = E(!1), [O, w] = E(!1), [R, F] = E(""), [te, ae] = E(""), [qe, g] = E({}), [x, M] = E(!1), [re, Se] = E(!1), j = x && f ? f.review : e, Z = le(j), L = yt(Z), T = L.queue, ge = Z === "audio" ? "Audio" : "Scene", [W, ue] = E([]), [be, oe] = E(!1), [, ye] = E(0), [_t, st] = E(0), Ht = P(null), Pe = P(null), Be = P(!1), fe = P(null), nt = P(!1), Te = P(0), Re = P(!1), We = P({ onClose: s, onWrite: a });
  We.current = { onClose: s, onWrite: a }, z(() => {
    var N;
    p && ((N = Ht.current) == null || N.showModal());
  }, [p]), z(() => {
    if (!p || j.occurrence.targetMode !== "selected") return;
    const N = new AbortController();
    return ue([]), bi(
      j.occurrence.performerIds,
      "performers",
      N.signal
    ).then((D) => {
      N.signal.aborted || ue(D.map(([, we]) => we));
    }).catch(() => {
    }), () => N.abort();
  }, [
    p,
    j.occurrence.targetMode,
    JSON.stringify(j.occurrence.performerIds)
  ]), z(
    () => () => {
      var N;
      Be.current = !0, (N = fe.current) == null || N.abort();
    },
    []
  ), z(() => {
    if (!O) return;
    const N = (D) => {
      D.preventDefault(), D.returnValue = "";
    };
    return window.addEventListener("beforeunload", N), () => window.removeEventListener("beforeunload", N);
  }, [O]);
  function Rt() {
    h(null), M(!1), Se(!1), y(!1), C([]), ae(""), F(""), oe(!1);
  }
  function X() {
    Re.current || (d(!1), We.current.onClose(nt.current), nt.current = !1, Rt(), requestAnimationFrame(() => {
      var N;
      return (N = Pe.current) == null ? void 0 : N.focus();
    }));
  }
  const Ge = x && f ? f.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((N) => N.steps.length && !zt(N))
  );
  async function Y() {
    const N = Ge.filter((D) => S.includes(D.id));
    if (!(!N.length || Re.current)) {
      Re.current = !0, w(!0), F(""), ae("Loading all matching occurrences…"), h(null), M(!1), Se(!1), oe(!1), fe.current = new AbortController();
      try {
        await Da(Te.current, fe.current.signal);
        const D = await Fa(
          e,
          N,
          fe.current.signal,
          (Ye) => ae(`Loaded ${Ye.toLocaleString()} matching occurrences…`)
        ), we = /* @__PURE__ */ new Map();
        for (const Ye of D.entries)
          for (const ne of Ye.before.applications ?? [])
            we.set(ne.tag.id, ne.tag.name);
        const wt = await bi(
          [
            .../* @__PURE__ */ new Set([
              ...D.actions.flatMap(
                (Ye) => Ye.steps.flatMap((ne) => ne.tagIds)
              ),
              ...D.review.occurrence.conditionTagIds,
              ...zn(D.review.view.objectFilter)
            ])
          ].filter((Ye) => !we.has(Ye)),
          "tags",
          fe.current.signal
        );
        fe.current.signal.throwIfAborted(), g({ ...Object.fromEntries(we), ...Object.fromEntries(wt) }), h(D), ae("Preview ready. No tags have been changed.");
      } catch (D) {
        F(
          fe.current.signal.aborted ? "Preview cancelled. No tags were changed." : String(D instanceof Error ? D.message : D)
        ), ae("");
      } finally {
        Re.current = !1, w(!1), fe.current = null;
      }
    }
  }
  async function q(N) {
    if (!f || Re.current) return;
    Re.current = !0, Be.current = !1, nt.current = !0, We.current.onWrite(), w(!0), M(!0), F(""), N === "undo" && Se(!0), ae(N === "undo" ? "Undoing batch…" : "Applying batch…");
    const D = () => ye((we) => we + 1);
    try {
      N === "undo" ? await _a(f, () => Be.current, D) : await La(
        f,
        v,
        () => Be.current,
        D,
        N === "retry"
      ), ae(
        Be.current ? "Stopped after in-flight operations settled. Completed changes are retained." : N === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (we) {
      F(we instanceof Error ? we.message : String(we));
    } finally {
      Te.current = Date.now(), Re.current = !1, w(!1), st((we) => we + 1), D();
    }
  }
  const U = (f == null ? void 0 : f.entries) ?? [], ke = Qt(
    () => new Map(
      ((f == null ? void 0 : f.entries) ?? []).map((N) => [
        N.item.key,
        an(N.before.ids, f.action, f.categories, v)
      ])
    ),
    [f, v]
  ), it = (N) => ke.get(N.item.key), J = (N) => Nr(N.before.ids, it(N).desired), kt = (N) => {
    const D = J(N);
    return N.status === "pending" && (D.added.length > 0 || D.removed.length > 0);
  }, sr = (N) => {
    const D = it(N), we = D.skipped ? Nr(
      N.before.ids,
      an(N.before.ids, f.action, f.categories, !0).desired
    ) : J(N);
    return [
      D.skipped ? "Skipped unless conflicting answers are replaced. " : "",
      `Add: ${_e(we.added)}; Remove: ${_e(we.removed)}`,
      ...D.kept.map(
        (wt) => `; Keeps ${_e(wt.existing)} instead of ${_e(wt.tagIds)}`
      )
    ].join("");
  }, ct = U.filter((N) => N.conflict), lt = U.filter(
    (N) => it(N).kept.length || it(N).replaced.length
  ), He = (N) => U.filter((D) => D.status === N).length, Ie = U.some((N) => N.operation), _e = (N) => N.map((D) => qe[D] ?? `Tag ${D}`).join(", ") || "None", je = U.filter((N) => N.item.media.date).sort((N, D) => N.item.media.date.localeCompare(D.item.media.date)), It = (N, D) => /* @__PURE__ */ n(
    "a",
    {
      href: `/${Z}/${N.item.media.id}`,
      target: "_blank",
      rel: "noreferrer",
      "aria-label": `${D} ${L.one}, ${N.item.media.date}`,
      title: N.item.media.title || ge,
      children: N.item.media.date
    }
  ), Yt = j.occurrence.targetMode === "selected" && j.occurrence.performerIds.length === 1, cr = Er(j.occurrence.condition) && j.occurrence.includeSubtags !== !1 && j.occurrence.conditionTagIds.length > 0;
  return /* @__PURE__ */ u(ve, { children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-button",
        hidden: r,
        ref: Pe,
        disabled: t || !Ge.length,
        onClick: () => {
          Rt(), o(), d(!0);
        },
        children: "Apply to all matching occurrences"
      }
    ),
    p && /* @__PURE__ */ u(
      "dialog",
      {
        ref: Ht,
        className: "dq-batch-dialog",
        "aria-labelledby": "dq-batch-title",
        "aria-modal": "true",
        onCancel: (N) => {
          N.preventDefault(), X();
        },
        children: [
          /* @__PURE__ */ n("h2", { id: "dq-batch-title", children: "Batch occurrence approval" }),
          /* @__PURE__ */ n("p", { children: "Apply one or more answers across all matching pages. Only targeted performer occurrences change." }),
          /* @__PURE__ */ n("p", { children: "Keep this page open while running. Results and undo last until you close this dialog or start a new batch." }),
          /* @__PURE__ */ u("fieldset", { disabled: O || x, children: [
            /* @__PURE__ */ n("legend", { children: "Batch scope and answers" }),
            /* @__PURE__ */ n("p", { children: "Uses your current filters. To include every existing appearance, remove filters that exclude already answered occurrences." }),
            /* @__PURE__ */ u("p", { children: [
              "Performer scope:",
              " ",
              j.occurrence.targetMode === "all" ? "All performers" : j.occurrence.targetMode === "selected" ? W.join(", ") || `${j.occurrence.performerIds.length} selected performer(s)` : "Matching performer criteria",
              ". Occurrence condition:",
              " ",
              cn[j.occurrence.condition],
              "."
            ] }),
            i.length > 0 && /* @__PURE__ */ u("p", { className: "dq-batch-flag", children: [
              /* @__PURE__ */ u("strong", { children: [
                "Flagged: ",
                i.join(", "),
                "."
              ] }),
              " Check the earliest and latest ",
              L.many,
              " before applying, or narrow the batch with a date filter."
            ] }),
            Er(j.occurrence.condition) && j.occurrence.hideConfirmedAbsent !== !1 && /* @__PURE__ */ n("p", { children: j.occurrence.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged." }),
            j.occurrence.conditionTagIds.length > 0 && f && /* @__PURE__ */ u("p", { children: [
              "Condition tags:",
              " ",
              _e(j.occurrence.conditionTagIds),
              j.occurrence.includeSubtags === !1 ? " (exact tags only)" : " (including subtags)",
              "."
            ] }),
            /* @__PURE__ */ u("p", { children: [
              "Search: ",
              String(j.view.filter.q || "Any"),
              ".",
              " ",
              Object.keys(j.view.objectFilter).length === 0 && `${T[0].toUpperCase()}${T.slice(1)} filters: None.`
            ] }),
            /* @__PURE__ */ n(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": `Batch ${T} filters`,
                children: /* @__PURE__ */ n(
                  _r,
                  {
                    filter: j.view.filter,
                    objectFilter: Wn(
                      j.view.objectFilter,
                      qe
                    ),
                    criteriaDefinitions: Z === "audio" ? Ln : sn,
                    customFieldEntityType: Z,
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
            j.occurrence.targetMode === "filter" && /* @__PURE__ */ n(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": "Batch performer criteria",
                children: /* @__PURE__ */ n(
                  _r,
                  {
                    filter: {},
                    objectFilter: j.occurrence.performerFilter,
                    criteriaDefinitions: Sn,
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
            Yt && /* @__PURE__ */ n(
              fo,
              {
                review: j,
                performerId: j.occurrence.performerIds[0],
                revision: _t
              }
            ),
            !Ge.length && /* @__PURE__ */ n("p", { children: "Configure an occurrence tag action in this review before starting a batch." }),
            /* @__PURE__ */ u("fieldset", { className: "dq-batch-answers", children: [
              /* @__PURE__ */ n("legend", { children: "Answers" }),
              Ge.map((N) => /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
                /* @__PURE__ */ n(
                  "input",
                  {
                    type: "checkbox",
                    checked: x || S.includes(N.id),
                    onChange: (D) => {
                      C(
                        D.target.checked ? [...S, N.id] : S.filter((we) => we !== N.id)
                      ), h(null), ae(""), F("");
                    }
                  }
                ),
                N.label
              ] }, N.id))
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: !S.length,
                onClick: () => void Y(),
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
                  value: v ? "replace" : "skip",
                  onChange: (N) => y(N.target.value === "replace"),
                  children: [
                    /* @__PURE__ */ n("option", { value: "skip", children: "Skip conflicts" }),
                    /* @__PURE__ */ n("option", { value: "replace", children: "Replace conflicting answers" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u("p", { children: [
              "Conflicts are existing tags an answer removes. Configure opposite answers as removals.",
              cr && " Each condition tag with its subtags is a category: an answer is added only where its category is still empty, and a different existing answer is kept unless conflicting answers are replaced."
            ] })
          ] }),
          /* @__PURE__ */ u("div", { "aria-live": "polite", children: [
            te && /* @__PURE__ */ n("p", { role: "status", children: te }),
            R && /* @__PURE__ */ n("p", { role: "alert", children: R }),
            f && /* @__PURE__ */ u(ve, { children: [
              /* @__PURE__ */ n("p", { children: /* @__PURE__ */ u("strong", { children: [
                U.length.toLocaleString(),
                " occurrences in",
                " ",
                new Set(
                  U.map((N) => N.item.media.id)
                ).size.toLocaleString(),
                " ",
                T,
                "s"
              ] }) }),
              x ? /* @__PURE__ */ u("p", { children: [
                He("changed"),
                " changed; ",
                He("unchanged"),
                " unchanged;",
                " ",
                He("skipped"),
                " skipped; ",
                He("failed"),
                " failed;",
                " ",
                He("pending"),
                " remaining."
              ] }) : /* @__PURE__ */ u("p", { children: [
                U.filter(kt).length.toLocaleString(),
                " to change; ",
                He("unchanged").toLocaleString(),
                " already correct; ",
                ct.length.toLocaleString(),
                " conflicts (",
                v ? "will replace" : "will skip",
                ").",
                lt.length > 0 && ` ${lt.length.toLocaleString()} already have a different answer in a category (${v ? "will replace" : "kept"}).`
              ] }),
              U.length > 0 && /* @__PURE__ */ u("p", { children: [
                "Dates:",
                " ",
                je.length ? /* @__PURE__ */ u(ve, { children: [
                  It(je[0], "Earliest"),
                  je.length > 1 && /* @__PURE__ */ u(ve, { children: [
                    " to ",
                    It(je[je.length - 1], "Latest")
                  ] })
                ] }) : "none",
                je.length < U.length && `; ${(U.length - je.length).toLocaleString()} without a date`,
                "."
              ] })
            ] })
          ] }),
          f && /* @__PURE__ */ u(ve, { children: [
            !x && /* @__PURE__ */ u("p", { children: [
              "Planned additions:",
              " ",
              _e([
                ...new Set(U.flatMap((N) => J(N).added))
              ]),
              ". Planned removals:",
              " ",
              _e([
                ...new Set(U.flatMap((N) => J(N).removed))
              ]),
              "."
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => oe(!be),
                children: be ? "Hide occurrence details" : "Inspect occurrences and conflicts"
              }
            ),
            be && /* @__PURE__ */ n("div", { className: "dq-batch-items", children: /* @__PURE__ */ u("table", { children: [
              /* @__PURE__ */ n("thead", { children: /* @__PURE__ */ u("tr", { children: [
                /* @__PURE__ */ n("th", { children: "Occurrence" }),
                /* @__PURE__ */ n("th", { children: "Changes / result" })
              ] }) }),
              /* @__PURE__ */ n("tbody", { children: U.map((N) => {
                var D;
                return /* @__PURE__ */ u("tr", { children: [
                  /* @__PURE__ */ n("td", { children: /* @__PURE__ */ u(
                    "a",
                    {
                      href: `/${Z}/${N.item.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      children: [
                        (D = N.item.occurrence) == null ? void 0 : D.performer.name,
                        " —",
                        " ",
                        N.item.media.title || ge
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ u("td", { children: [
                    N.conflict && /* @__PURE__ */ n("strong", { children: "Conflict. " }),
                    x ? `${N.status}. ${N.error ?? ""}` : sr(N)
                  ] })
                ] }, N.item.key);
              }) })
            ] }) }),
            /* @__PURE__ */ u("div", { className: "dq-row", children: [
              !re && /* @__PURE__ */ u(ve, { children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button primary",
                    disabled: O || !He("pending"),
                    onClick: () => void q("apply"),
                    children: x ? "Continue remaining" : "Apply batch"
                  }
                ),
                x && He("failed") > 0 && /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: O,
                    onClick: () => void q("retry"),
                    children: "Retry failed occurrences"
                  }
                )
              ] }),
              Ie && /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  disabled: O,
                  onClick: () => void q("undo"),
                  children: "Undo batch"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ u("div", { className: "dq-row", children: [
            O && /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => {
                  var N;
                  Be.current = !0, (N = fe.current) == null || N.abort(), ae("Stopping after in-flight operations settle…");
                },
                children: [
                  "Cancel ",
                  fe.current ? "preview" : "run"
                ]
              }
            ),
            x && /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: O,
                onClick: Rt,
                children: "New batch"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: O,
                onClick: X,
                children: "Close"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
const po = "data-quality.description-collapsed.v1";
function Ka() {
  try {
    return localStorage.getItem(po) === "true";
  } catch {
    return !1;
  }
}
function Ba({
  details: e,
  label: t
}) {
  const [r, i] = E(Ka), o = ir(() => {
    i((s) => {
      const a = !s;
      try {
        localStorage.setItem(po, String(a));
      } catch {
      }
      return a;
    });
  }, []);
  return /* @__PURE__ */ u("section", { className: "dq-review-description", "aria-label": `${t} description`, children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-button dq-description-toggle",
        "aria-expanded": !r,
        onClick: o,
        children: "Description"
      }
    ),
    !r && (e != null && e.trim() ? /* @__PURE__ */ n(xo, { className: "dq-description-body", children: e }) : /* @__PURE__ */ n("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
function Xr({
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
function Ga({
  ranking: e,
  busy: t,
  error: r,
  focus: i,
  disabled: o,
  labels: s,
  onFocus: a,
  onMore: p,
  onRefresh: d
}) {
  var S;
  const f = e ? e.ranked.slice(0, e.limit) : [], h = !!e && (e.ranked.length > e.limit || (((S = e.candidates[e.cursor]) == null ? void 0 : S.total) ?? 0) > 0);
  return /* @__PURE__ */ u("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ u("div", { className: "dq-performer-ranking-status", children: [
      r ? /* @__PURE__ */ u("p", { role: "alert", children: [
        "Could not rank performers. ",
        r
      ] }) : t ? /* @__PURE__ */ u("p", { role: "status", children: [
        "Counting matching ",
        s.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ n("p", { children: f.length ? `Most matching ${s.many} first.` : `No performer has matching ${s.many}.` }) : null,
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button",
          disabled: t || o,
          onClick: d,
          children: "Refresh"
        }
      )
    ] }),
    /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: f.map((C) => {
      const v = `${C.count.toLocaleString()} matching ${C.count === 1 ? s.one : s.many}`, y = C.flags.length ? `Flagged: ${C.flags.join(", ")}` : "";
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-button dq-ranked-performer",
          "aria-label": `${C.name}, ${v}${y ? `. ${y}` : ""}`,
          title: y || void 0,
          "aria-pressed": i === C.id,
          disabled: o,
          onClick: () => a(C.id),
          children: [
            /* @__PURE__ */ n(Xr, { performer: C }),
            /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: C.name }),
            y && /* @__PURE__ */ n("span", { className: "dq-performer-flag", "aria-hidden": "true", children: "Flag" }),
            /* @__PURE__ */ n("span", { className: "dq-ranked-count", "aria-hidden": "true", children: C.count.toLocaleString() })
          ]
        },
        C.id
      );
    }) }),
    h && !t && !r && /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-button",
        disabled: o,
        onClick: p,
        children: "Show more performers"
      }
    )
  ] });
}
function Zr(e) {
  const {
    page: t,
    perPage: r,
    sort: i,
    direction: o,
    sorts: s,
    seed: a,
    ...p
  } = e.view.filter;
  return JSON.stringify([
    e.entityType,
    p,
    e.view.objectFilter,
    e.view.searchMode,
    e.occurrence
  ]);
}
function Va(e) {
  const t = e.occurrence;
  return JSON.stringify([
    le(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {},
    t.flagPerformerTagIds ?? []
  ]);
}
async function Ja(e, t) {
  const r = le(e) === "audio", i = new Set(e.occurrence.flagPerformerTagIds ?? []), o = (p) => ({
    id: p.id,
    name: p.name,
    total: (r ? p.audioCount : p.videoCount) ?? 0,
    flags: (p.tags ?? []).filter((d) => i.has(d.id)).map((d) => d.name)
  }), s = e.occurrence, a = [];
  if (s.targetMode === "selected")
    for (const p of s.performerIds) {
      const d = await fa(
        `/api/performers/${p}`,
        { signal: t }
      );
      d && a.push(o(d));
    }
  else {
    const { _filterExpression: p, ...d } = s.targetMode === "filter" ? s.performerFilter : {};
    for (let f = 1; ; f++) {
      const h = await V(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            Wt({
              findFilter: {
                page: f,
                perPage: 1e3,
                sort: r ? "audio_count" : "video_count",
                direction: "desc"
              },
              objectFilter: d,
              filterExpression: p
            })
          )
        }
      );
      if (a.push(...h.items.map(o)), f * 1e3 >= h.totalCount || !h.items.length) break;
    }
  }
  return a.sort((p, d) => d.total - p.total || p.id - d.id);
}
function go(e, t, r) {
  const i = Yn(e, [t]);
  return ma(i, i.view.filter, r);
}
function mo(e, t) {
  const r = e.findIndex(
    (i) => i.count < t.count || i.count === t.count && i.name.localeCompare(t.name) > 0
  );
  e.splice(r < 0 ? e.length : r, 0, t);
}
function Pn(e, t, r, i) {
  if (t >= e.length) return !0;
  const o = e[t].total;
  return o <= 0 ? !0 : r.length >= i && o < r[i - 1].count;
}
async function Qa(e, t, r, i, o = {}) {
  const s = Zr(e), a = Va(e), p = so(e.occurrence), d = (t == null ? void 0 : t.signature) === s && !t.partial ? t : {
    signature: s,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: p ? "" : a,
    candidates: p ? [] : (t == null ? void 0 : t.candidatesKey) === a ? t.candidates : await Ja(e, i),
    cursor: 0,
    ranked: [],
    limit: r,
    complete: !1
  }, { candidates: f } = d, h = [...d.ranked];
  let S = d.cursor, C = !1;
  const v = (y) => ({
    ...d,
    cursor: S,
    ranked: [...h],
    limit: r,
    complete: !y && Pn(f, S, h, r),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: o.concurrency ?? 6 }, async () => {
        var y;
        for (; !C && !Pn(f, S, h, r); ) {
          i.throwIfAborted();
          const O = f[S++], w = await go(e, O.id, i);
          w > 0 && mo(h, { ...O, count: w }), (y = o.onProgress) == null || y.call(o, v(!0));
        }
      })
    );
  } catch (y) {
    throw C = !0, y;
  }
  return i.throwIfAborted(), v(!1);
}
function za(e, t, r) {
  const i = e.candidates.findIndex((s) => s.id === t);
  if (e.partial || i < 0 || i >= e.cursor) return e;
  const o = e.ranked.filter((s) => s.id !== t);
  return r > 0 && mo(o, { ...e.candidates[i], count: r }), {
    ...e,
    ranked: o,
    complete: Pn(e.candidates, e.cursor, o, e.limit)
  };
}
function Dr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((a, p) => Dr(a, t[p]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, o = Object.keys(r).sort(), s = Object.keys(i).sort();
  return o.length === s.length && o.every(
    (a, p) => a === s[p] && Dr(r[a], i[a])
  );
}
const un = [
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
], Wa = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function Cr(e) {
  const t = ce(e) ? e.occurrence : void 0;
  return {
    filter: ze({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, le(e)),
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
function yi(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function $n(e, t) {
  let r;
  if (ce(e) && t.has("performer") && (r = Number(t.get("performer")), !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!un.some((p) => p !== "performer" && t.has(p))) {
    const p = Cr(e);
    return {
      query: r ? { ...p, performerFocus: r } : p,
      startAtEnd: p.startFrom === "end"
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
    const p = t.get("sorts").split(",").map((d) => {
      const f = d.lastIndexOf(":");
      return { key: d.slice(0, f), direction: d.slice(f + 1) };
    });
    if (p.some((d) => !d.key || !["asc", "desc"].includes(d.direction)))
      throw new Error("Invalid review URL sort.");
    o.sorts = p, o.sort = p[0].key, o.direction = p[0].direction;
  }
  let s;
  if (ce(e) && (s = {
    ...Wa,
    ...yi(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(s.targetMode) || !ln.includes(s.condition) || !Array.isArray(s.performerIds) || !Array.isArray(s.conditionTagIds) || typeof s.includeSubtags != "boolean" || typeof s.hideConfirmedAbsent != "boolean" || [...s.performerIds, ...s.conditionTagIds].some(
    (p) => !Number.isSafeInteger(p) || p <= 0
  ) || !s.performerFilter || typeof s.performerFilter != "object" || Array.isArray(s.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const a = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: ze(o, le(e)),
      objectFilter: yi(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: a,
      performerScope: s,
      ...r ? { performerFocus: r } : {}
    },
    startAtEnd: !t.has("page") && a === "end"
  };
}
function Lr(e, t) {
  const r = new URLSearchParams(window.location.search);
  un.forEach((i) => r.delete(i)), r.set("review", e);
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
function Lt(e, t) {
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
function wi(e, t) {
  return !t || !ce(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function bn(e, t) {
  if (!t) return e;
  const r = /* @__PURE__ */ new Map();
  for (const i of e)
    r.set(i.media.id, [...r.get(i.media.id) ?? [], i]);
  return [...r.values()].reverse().flat();
}
const bt = (e) => e instanceof Error ? e.message : "Request failed.", yn = 50;
function Ha({
  actions: e,
  disabled: t,
  canWrite: r,
  canAssess: i = !0,
  onApply: o
}) {
  const [s, a] = E({});
  z(() => {
    let d = !0;
    return Promise.all(
      [
        ...new Set(
          e.flatMap(
            (f) => f.steps.flatMap((h) => h.tagIds)
          )
        )
      ].map(async (f) => {
        try {
          return [
            f,
            (await V(`/api/tags/${f}`)).name
          ];
        } catch {
          return [f, "Unavailable tag"];
        }
      })
    ).then((f) => {
      d && a(Object.fromEntries(f));
    }), () => {
      d = !1;
    };
  }, [e]);
  const p = {
    ADD: "Add",
    REMOVE: "Remove",
    REMOVE_TREE: "Remove tree",
    MARK_PRESENT: "Mark present",
    MARK_ABSENT: "Mark absent",
    CLEAR_ABSENCE: "Clear absence"
  };
  return /* @__PURE__ */ u("div", { className: "dq-review-actions", children: [
    /* @__PURE__ */ n("p", { children: "Actions apply and advance. Shift-click or Shift + shortcut applies and stays." }),
    e.map((d, f) => /* @__PURE__ */ u("div", { className: "dq-action-pair", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: t || !r && d.steps.length > 0 || !i && zt(d),
          onClick: (h) => o(d, h.shiftKey),
          children: /* @__PURE__ */ u("span", { children: [
            or(d, f) && /* @__PURE__ */ n("kbd", { children: or(d, f) }),
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
          disabled: t || !r || !i && zt(d),
          "aria-label": `Apply & stay: ${d.label}`,
          title: `Apply & stay: ${d.label}`,
          onClick: () => o(d, !0),
          children: /* @__PURE__ */ n(jn, { "aria-hidden": "true" })
        }
      ),
      d.steps.length > 0 && /* @__PURE__ */ n("small", { className: "dq-review-action-summary", children: d.steps.map(
        (h) => `${p[h.mode]}: ${h.tagIds.map((S) => s[S] ?? "Loading tag…").join(", ")}`
      ).join("; ") })
    ] }, d.id))
  ] });
}
function Ya({
  review: e,
  canWrite: t,
  canAssess: r = !0,
  onBusy: i,
  onSaveDefaults: o,
  editRequest: s = 0,
  renderRuleEditor: a
}) {
  var Ir;
  const p = le(e), d = yt(p), f = p === "audio" ? "Audio" : "Scene", h = (l) => {
    var m;
    return l.title || ((m = l.files[0]) == null ? void 0 : m.basename) || f;
  }, S = (l) => `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${h(l.media)}`, C = P(null), v = P("");
  if (!C.current)
    try {
      C.current = $n(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (l) {
      v.current = bt(l), C.current = { query: Cr(e), startAtEnd: !1 };
    }
  const [y, O] = E(null), w = P(null), R = P(null), F = P(null), [te, ae] = E(!!v.current), qe = P(0), [g, x] = E(C.current.query), M = P(g);
  M.current = g;
  const [re, Se] = E(0), j = P(C.current.startAtEnd), [Z, L] = E([]), [T, ge] = E(null), W = P(null), [ue, be] = E(null), [oe, ye] = E(0), _t = Qt(() => {
    if (!T) return null;
    const l = Z.findIndex((m) => m.key === T.key);
    return l < 0 ? null : Z.slice(l + 1).find((m) => m.media.id !== T.media.id) ?? null;
  }, [T, Z]), [st, Ht] = E(0), [Pe, Be] = E(!1), [fe, nt] = E(!1), Te = P(!1), Re = P(!0), We = P(null);
  z(() => (Re.current = !0, () => {
    Re.current = !1;
  }), []);
  const [Rt, X] = E(v.current), [Ge, Y] = E(""), [q, U] = E(null), [ke, it] = E(!1), [J, kt] = E([]), sr = P([]), ct = P(null), lt = P(null), He = P(null);
  z(() => {
    var l, m;
    ke && ((m = (l = He.current) == null ? void 0 : l.querySelector("input")) == null || m.focus());
  }, [ke]);
  const [Ie, _e] = E(!1);
  z(() => {
    if (Pe || Ie || !lt.current) return;
    const l = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const m = lt.current;
      m != null && m.isConnected && !m.disabled && m.focus(), lt.current = null;
    });
    return () => cancelAnimationFrame(l);
  }, [Pe, Ie, re]);
  const [je, It] = E([]), [Yt, cr] = E({}), N = P(null), D = P(0), [we, wt] = E({});
  z(() => {
    let l = !0;
    return Promise.all(
      zn(g.objectFilter).map(
        async (m) => [
          String(m),
          (await V(`/api/tags/${m}`)).name
        ]
      )
    ).then((m) => {
      l && wt(Object.fromEntries(m));
    }).catch(() => {
    }), () => {
      l = !1;
    };
  }, [g.objectFilter]);
  const Ye = Qt(
    () => Wn(g.objectFilter, we),
    [we, g.objectFilter]
  ), ne = P(0), Xt = P(e);
  Xt.current = e;
  const Ar = y ?? e, dt = Qt(
    () => Lt(Ar, g),
    [Ar, g]
  ), Ee = Qt(
    () => wi(dt, g.performerFocus),
    [dt, g.performerFocus]
  ), mr = P(Ee);
  mr.current = Ee;
  const ee = P(dt);
  ee.current = dt;
  const [vt, De] = E("items"), [ut, Br] = E(null), jt = P(null), qr = P("");
  function Zt(l) {
    const m = typeof l == "function" ? l(jt.current) : l;
    jt.current = m, Br(m);
  }
  const [Xe, Ze] = E(!1), [Ot, Mt] = E(null), Oe = P(null), pe = ce(dt) ? Zr(dt) : "", [Ve, et] = E(0), [Ue, Dt] = E(null);
  z(() => () => {
    var l;
    return (l = Oe.current) == null ? void 0 : l.controller.abort();
  }, []), z(() => {
    const l = Oe.current;
    !l || l.signature === pe || (l.controller.abort(), Oe.current = null, Ze(!1));
  }, [pe]), z(() => {
    var k;
    const l = jt.current;
    if (vt !== "performers" || !pe || ((k = Oe.current) == null ? void 0 : k.signature) === pe || qr.current === pe || (l == null ? void 0 : l.signature) === pe && l.complete)
      return;
    const m = (l == null ? void 0 : l.signature) === pe ? l : null;
    hr(l, (m == null ? void 0 : m.limit) ?? yn);
  }, [vt, pe, ut, Ot, Xe]);
  const Je = g.performerFocus, Tr = JSON.stringify(
    ce(dt) ? dt.occurrence.flagPerformerTagIds ?? [] : []
  );
  z(() => {
    if (!Je) {
      Dt(null);
      return;
    }
    let l = !0;
    const m = new Set(JSON.parse(Tr));
    return V(
      `/api/performers/${Je}`
    ).then((k) => {
      l && Dt({
        id: Je,
        name: k.name,
        flags: (k.tags ?? []).filter((_) => m.has(_.id)).map((_) => _.name)
      });
    }).catch(() => {
    }), () => {
      l = !1;
    };
  }, [Je, Tr]);
  const Ut = g.startFrom !== (e.view.startFrom ?? "end") || !Dr(
    JSON.parse(xt(Lt(e, g))),
    JSON.parse(xt(Lt(e, Cr(e))))
  ), ft = fe || Pe || ke, Pt = Number(g.filter.page);
  function tt(l, m = !1) {
    Te.current || (v.current = "", j.current = m, M.current = l, x(l), Ht(0), Be(!0), m || Lr(e.id, l), Se((k) => k + 1));
  }
  function pt() {
    if (Te.current = !1, nt(!1), Re.current && We.current) {
      const l = We.current;
      We.current = null, tt(l.query, l.startAtEnd);
    }
  }
  z(() => {
    const l = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const m = $n(
            Xt.current,
            new URLSearchParams(window.location.search)
          );
          Te.current ? We.current = m : tt(m.query, m.startAtEnd);
        } catch (m) {
          X(bt(m));
        }
    };
    return window.addEventListener("popstate", l), () => window.removeEventListener("popstate", l);
  }, [e.id]), z(() => (i(fe || Pe || ke || !!y), () => i(!1)), [fe, Pe, ke, !!y, i]);
  async function lr(l, m, k) {
    if (ce(l)) {
      const K = await co(
        l,
        N.current,
        m,
        k
      );
      return {
        items: K.items.map((G) => ({
          key: G.key,
          media: G.media,
          occurrence: G
        })),
        totalCount: K.totalCount
      };
    }
    const _ = await xr(
      l,
      { ...l.view.filter, page: m },
      k
    );
    return {
      items: _.items.map((K) => ({ key: String(K.id), media: K })),
      totalCount: _.totalCount
    };
  }
  function ie(l, m, k, _ = !1, K = !1) {
    if (!Re.current || We.current) return;
    ae(!0), L(
      K ? l.items : bn(l.items, M.current.startFrom === "end")
    ), Ht(l.totalCount), $t(k, _);
    const G = {
      ...M.current,
      filter: { ...M.current.filter, page: m }
    };
    M.current = G, x(G), Lr(e.id, G);
  }
  function $t(l, m = !1) {
    (l == null ? void 0 : l.key) !== (T == null ? void 0 : T.key) && (W.current = null), (l == null ? void 0 : l.media.id) !== (T == null ? void 0 : T.media.id) && be(m && l ? l.media.id : null), ge(l);
  }
  z(() => {
    if (v.current) return;
    const l = new AbortController();
    F.current = l;
    const m = ++ne.current;
    return Be(!0), X(""), Y(""), W.current = null, be(null), ge(null), L([]), it(!1), (async () => {
      const k = wi(
        Lt(Xt.current, M.current),
        M.current.performerFocus
      );
      N.current = ce(k) ? await Hn(k, l.signal) : null;
      let _ = Number(k.view.filter.page), K = await lr(k, _, l.signal);
      const G = Math.max(
        1,
        Math.ceil(K.totalCount / Number(k.view.filter.perPage))
      );
      (j.current || _ > G) && (_ = G, K = await lr(k, _, l.signal)), j.current = !1;
      const me = k.view.startFrom === "end" ? -1 : 1;
      for (; ce(k) && !K.items.length && _ + me >= 1 && _ + me <= G && !l.signal.aborted; )
        _ += me, K = await lr(k, _, l.signal);
      if (m !== ne.current || l.signal.aborted) return;
      const xe = bn(K.items, k.view.startFrom === "end");
      ie(K, _, xe[0] ?? null);
    })().catch((k) => {
      !l.signal.aborted && m === ne.current && X(bt(k));
    }).finally(() => {
      !l.signal.aborted && m === ne.current && (ae(!0), Be(!1));
    }), () => {
      l.abort(), ne.current++;
    };
  }, [re, e.id]), z(() => {
    if (U(null), !T) return;
    let l = !0;
    return qt(p, T).then((m) => {
      l && (U(m), It(
        ce(e) ? m.ids.filter((k) => e.occurrence.tagIds.includes(k)) : []
      ));
    }).catch((m) => {
      l && X(`Could not load current tags. ${bt(m)}`);
    }), () => {
      l = !1;
    };
  }, [T]), z(() => {
    if (!ce(e) || e.actions.length)
      return;
    let l = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (m) => [
          m,
          (await V(`/api/tags/${m}`)).name
        ]
      )
    ).then((m) => {
      l && cr(Object.fromEntries(m));
    }).catch((m) => {
      l && X(bt(m));
    }), () => {
      l = !1;
    };
  }, [e]);
  async function er(l = !1, m = !1, k = !1) {
    var yr;
    if (!T) return;
    const _ = Z.findIndex((he) => he.key === T.key), K = g.startFrom === "end" ? -1 : 1, G = ((yr = W.current) == null ? void 0 : yr.key) === T.key ? W.current : { key: T.key, page: Pt, before: Z.slice(0, _ + 1).map((he) => he.key), after: Z.slice(_ + 1).map((he) => he.key) }, me = new Set(G.after), xe = new Set(G.before), Gt = Z.find((he) => {
      var ot;
      return me.has(he.key) || (K === 1 || Pt < G.page) && ((ot = W.current) == null ? void 0 : ot.key) === T.key && !xe.has(he.key);
    });
    if (!l && Gt) {
      $t(Gt, k);
      return;
    }
    const $e = l ? xe : new Set(Z.map((he) => he.key)), mt = 1100 - (Date.now() - D.current);
    mt > 0 && await new Promise((he) => window.setTimeout(he, mt));
    let Ke = K === -1 && !l ? Math.max(1, Pt - 1) : Pt;
    for (; Re.current && !We.current; ) {
      let he = await lr(Ee, Ke);
      const ot = Math.max(
        1,
        Math.ceil(he.totalCount / Number(g.filter.perPage))
      );
      Ke > ot && (Ke = ot, he = await lr(Ee, Ke));
      const Ft = bn(he.items, K === -1), de = new Map(Ft.map((rt) => [rt.key, rt])), Jr = l ? G.after.flatMap((rt) => {
        const wr = de.get(rt);
        return wr ? [wr] : [];
      }) : [], Or = new Set(Jr.map((rt) => rt.key)), St = l ? {
        ...he,
        items: [
          ...Jr,
          ...Ft.filter(
            (rt) => rt.key !== T.key && !Or.has(rt.key)
          )
        ]
      } : he;
      if (m) {
        W.current = G, ie(St, Ke, T, !1, l);
        return;
      }
      const Mr = K === -1 && Pt === 1 && !l ? void 0 : St.items.find(
        (rt) => !$e.has(rt.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(l && K === -1 && Ke === G.page) || me.has(rt.key))
      );
      if (Mr || (K === -1 ? Ke <= 1 : Ke >= ot)) {
        ie(
          St,
          Ke,
          Mr ?? null,
          k,
          l
        ), Mr || Y(
          he.totalCount ? `Reached the end in this direction. Matching items remain available from the ${d.queue} pages.` : `No matching ${d.many}.`
        );
        return;
      }
      Ke += K;
    }
  }
  async function Kt(l, m = !1, k = !1, _ = !1) {
    if (y || !T || Te.current || Pe || ke && !k)
      return;
    const K = k || _ || !!(l != null && l.steps.length), G = K && !m;
    if (K && (!t || !q) || l && zt(l) && !r) return;
    Te.current = !0, nt(!0), X(""), Y("");
    const me = Z.findIndex(($e) => $e.key === T.key), xe = K && !m && me >= 0 ? Z[me + 1] ?? null : null;
    xe && (L(
      ($e) => $e.filter((mt) => mt.key !== T.key)
    ), $t(xe, !0));
    let Gt = !1;
    try {
      if (K) {
        const $e = await qt(p, T);
        if (l)
          await Oa(Ee, T, l);
        else {
          const Ke = _ && ce(e) ? e.occurrence.tagIds.filter((ot) => $e.ids.includes(ot)) : sr.current, he = Nr(Ke, _ ? je : J);
          await Zn(Ee, T, he);
        }
        D.current = Date.now();
        const mt = await qt(p, T);
        xe || U(mt), Gt = !0, it(!1), Y("Tags saved."), T.occurrence && (ur(T.occurrence.performer.id), et((Ke) => Ke + 1));
      }
      if (!Re.current || We.current) return;
      K ? await er(!0, m, G) : m || await er(), m && k && requestAnimationFrame(() => {
        var $e;
        return ($e = ct.current) == null ? void 0 : $e.focus();
      });
    } catch ($e) {
      if (X(
        Gt ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${bt($e)}` : K ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${bt($e)}` : `Could not advance. ${bt($e)}`
      ), K && !Gt) {
        xe && (L(Z), be(null), ye((mt) => mt + 1), ge(T)), D.current = Date.now();
        try {
          U(await qt(p, T));
        } catch {
          U(null), X(
            (mt) => `${mt} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      pt();
    }
  }
  z(() => {
    const l = (m) => {
      if (ke || y || fe || Pe || Ie || m.defaultPrevented || m.repeat || m.ctrlKey || m.altKey || m.metaKey || !Ji(m.target) || document.querySelector('[role="dialog"], dialog[open]'))
        return;
      const k = m.key.toLowerCase(), _ = e.actions.find(
        (K, G) => or(K, G) === k
      );
      _ && (m.preventDefault(), m.stopPropagation(), Kt(_, m.shiftKey));
    };
    return document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l);
  });
  function Rr() {
    !o || y || Te.current || ke || (R.current = document.activeElement, w.current = {
      error: Rt,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(M.current),
      items: Z,
      current: T,
      total: st,
      targets: N.current,
      stayedCursor: W.current
    }, O(structuredClone(Lt(e, M.current))), Y(""), X(""));
  }
  z(() => {
    s && s !== qe.current && te && !Pe && (qe.current = s, Rr());
  }, [s, Pe, te]);
  function dr() {
    O(null), requestAnimationFrame(() => {
      var l;
      return (l = R.current) == null ? void 0 : l.focus();
    });
  }
  function Bt() {
    var m;
    const l = w.current;
    !l || fe || ((m = F.current) == null || m.abort(), ne.current++, M.current = l.query, x(l.query), L(l.items), ge(l.current), Ht(l.total), N.current = l.targets, W.current = l.stayedCursor, Be(!1), X(l.error), Y(""), window.history.replaceState(window.history.state, "", l.url), dr());
  }
  async function kr() {
    if (!y || !o || Te.current) return;
    const l = Lt(
      { ...y, name: y.name.trim() },
      M.current
    ), m = en(l);
    if (m) {
      X(m);
      return;
    }
    Te.current = !0, nt(!0), X("");
    try {
      if (await o(l) === !1) throw new Error("Could not save review.");
      dr(), Y("Review saved.");
    } catch (k) {
      X(
        "Could not save review. Your edits are still open. " + bt(k)
      );
    } finally {
      pt();
    }
  }
  async function tr() {
    if (!o || Te.current) return;
    const l = Lt(e, {
      ...M.current,
      filter: { ...M.current.filter, page: 1 }
    });
    Te.current = !0, nt(!0), X("");
    try {
      if (await o(l) === !1) throw new Error("Could not save review.");
      Y("Queue saved to this review.");
    } catch (m) {
      X("Could not save queue. " + bt(m));
    } finally {
      pt();
    }
  }
  const B = g.performerScope, gt = (l) => {
    const { performerFocus: m, ...k } = M.current, _ = m && !("targetMode" in l || "performerIds" in l || "performerFilter" in l);
    tt({
      ...k,
      ..._ ? { performerFocus: m } : {},
      filter: { ...k.filter, page: 1 },
      performerScope: { ...B, ...l }
    });
  };
  async function hr(l, m) {
    var K;
    const k = ee.current;
    if (!ce(k)) return;
    (K = Oe.current) == null || K.controller.abort();
    const _ = {
      signature: Zr(k),
      controller: new AbortController()
    };
    Oe.current = _, qr.current = "", Ze(!0), Mt(null);
    try {
      const G = await Qa(k, l, m, _.controller.signal, {
        onProgress: (me) => {
          Oe.current === _ && Zt(me);
        }
      });
      Oe.current === _ && Zt(G);
    } catch (G) {
      Oe.current === _ && !_.controller.signal.aborted && (qr.current = _.signature, Mt({ signature: _.signature, message: bt(G) }));
    } finally {
      Oe.current === _ && (Oe.current = null, Ze(!1));
    }
  }
  function rr() {
    var l;
    (l = Oe.current) == null || l.controller.abort(), Oe.current = null, Ze(!1), Zt((m) => m && { ...m, partial: !0, complete: !1 });
  }
  async function ur(l) {
    var K;
    const m = ee.current;
    if (!ce(m)) return;
    if (Oe.current) {
      rr();
      return;
    }
    const k = Zr(m);
    if (((K = jt.current) == null ? void 0 : K.signature) !== k || jt.current.partial) return;
    const _ = 1100 - (Date.now() - D.current);
    _ > 0 && await new Promise((G) => window.setTimeout(G, _));
    try {
      const G = await go(m, l);
      if (Oe.current) {
        rr();
        return;
      }
      Zt(
        (me) => (me == null ? void 0 : me.signature) === k ? za(me, l, G) : me
      );
    } catch {
      Zt(
        (G) => (G == null ? void 0 : G.signature) === k ? { ...G, partial: !0, complete: !1 } : G
      );
    }
  }
  const br = g.performerFocus ? ut == null ? void 0 : ut.candidates.find((l) => l.id === g.performerFocus) : void 0, Fe = (Ue == null ? void 0 : Ue.id) === g.performerFocus ? Ue : br ?? null;
  function Gr(l) {
    if (Te.current) return;
    const m = {
      ...M.current,
      performerFocus: l,
      filter: { ...M.current.filter, page: 1 }
    };
    tt(m, m.startFrom === "end"), De("items");
  }
  function Vr() {
    const { performerFocus: l, ...m } = M.current;
    tt(
      { ...m, filter: { ...m.filter, page: 1 } },
      m.startFrom === "end"
    );
  }
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-review-workspace${p === "audio" ? " dq-audio" : ""}`,
      "aria-label": B ? p === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : p === "audio" ? "Audio review" : "Video review",
      children: [
        y && /* @__PURE__ */ u("section", { className: "dq-rule-editor", "aria-label": "Edit review rule", children: [
          /* @__PURE__ */ n("h2", { children: "Edit review" }),
          /* @__PURE__ */ n("p", { children: "Preview matching scenes below. Save review keeps all rule changes; Cancel restores your previous view." }),
          /* @__PURE__ */ u("fieldset", { disabled: fe, children: [
            a == null ? void 0 : a(
              Lt(y, g),
              O,
              fe
            ),
            /* @__PURE__ */ u("label", { children: [
              "Review direction",
              /* @__PURE__ */ u(
                "select",
                {
                  "aria-label": "Review direction",
                  value: g.startFrom,
                  onChange: (l) => tt({
                    ...M.current,
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
                disabled: fe || Pe,
                onClick: () => void kr(),
                children: "Save review"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button",
                type: "button",
                disabled: fe,
                onClick: Bt,
                children: "Cancel"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u(
          "fieldset",
          {
            className: "dq-review-filters",
            disabled: ft,
            onClickCapture: (l) => {
              var _;
              const m = l.target instanceof Element ? l.target.closest("button") : null, k = (m == null ? void 0 : m.getAttribute("aria-label")) ?? ((_ = m == null ? void 0 : m.textContent) == null ? void 0 : _.trim()) ?? "";
              m && !m.closest('[role="dialog"], dialog') && /^(Filters|Edit filter:|Edit performer criteria)/.test(k) && (lt.current = m);
            },
            children: [
              /* @__PURE__ */ n("legend", { children: p === "audio" ? "Audio filters" : "Scene filters" }),
              /* @__PURE__ */ u("div", { className: "dq-queue-toolbar", children: [
                /* @__PURE__ */ n(
                  _r,
                  {
                    filter: g.filter,
                    objectFilter: Ye,
                    criteriaDefinitions: p === "audio" ? Ln : sn,
                    customFieldEntityType: p,
                    totalCount: st,
                    sortOptions: p === "audio" ? ki : _n,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    onFilterChange: (l) => {
                      (l.sort !== M.current.filter.sort || l.direction !== M.current.filter.direction) && (l = { ...l, sorts: void 0 }), tt({
                        ...M.current,
                        filter: ze(l, p)
                      });
                    },
                    onObjectFilterChange: (l) => {
                      tt({
                        ...M.current,
                        objectFilter: oo(
                          l,
                          we,
                          M.current.objectFilter
                        ),
                        filter: { ...M.current.filter, page: 1 }
                      });
                    }
                  }
                ),
                !y && Ut && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      "aria-label": "Save changes to review filters",
                      title: "Save changes to review filters",
                      disabled: !o,
                      onClick: () => void tr(),
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
                        const l = Cr(e);
                        tt(l, l.startFrom === "end");
                      },
                      children: /* @__PURE__ */ n(Fi, { "aria-hidden": "true" })
                    }
                  )
                ] })
              ] }),
              B && /* @__PURE__ */ u("div", { className: "dq-scope-controls", children: [
                /* @__PURE__ */ u("label", { children: [
                  "Performers to review",
                  " ",
                  /* @__PURE__ */ u(
                    "select",
                    {
                      value: B.targetMode,
                      onChange: (l) => gt({
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
                B.targetMode === "selected" && /* @__PURE__ */ n(
                  Tt,
                  {
                    entityType: "performer",
                    values: B.performerIds,
                    onChange: (l) => gt({ performerIds: l }),
                    placeholder: "Select performers to review...",
                    allowCreate: !1
                  }
                ),
                B.targetMode === "filter" && /* @__PURE__ */ u(ve, { children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => _e(!0),
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
                      criteriaDefinitions: Sn,
                      objectFilter: B.performerFilter,
                      onObjectFilterChange: (l) => gt({ performerFilter: l })
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
                        Xr,
                        {
                          performer: {
                            id: g.performerFocus,
                            name: (Fe == null ? void 0 : Fe.name) ?? ""
                          }
                        }
                      ),
                      /* @__PURE__ */ u("span", { children: [
                        "Only ",
                        (Fe == null ? void 0 : Fe.name) ?? `performer ${g.performerFocus}`
                      ] }),
                      Fe != null && Fe.flags.length ? /* @__PURE__ */ u("span", { className: "dq-performer-flag", children: [
                        "Flagged: ",
                        Fe.flags.join(", ")
                      ] }) : null,
                      /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: Vr, children: "Show all performers" })
                    ]
                  }
                ),
                /* @__PURE__ */ u("label", { children: [
                  "Occurrence tags",
                  " ",
                  /* @__PURE__ */ n(
                    "select",
                    {
                      value: B.condition,
                      onChange: (l) => gt({
                        condition: l.target.value
                      }),
                      children: ln.map((l) => /* @__PURE__ */ n("option", { value: l, children: cn[l] }, l))
                    }
                  )
                ] }),
                !["any", "isNull"].includes(B.condition) && /* @__PURE__ */ u(ve, { children: [
                  /* @__PURE__ */ n(
                    Tt,
                    {
                      entityType: "tag",
                      values: B.conditionTagIds,
                      onChange: (l) => gt({ conditionTagIds: l }),
                      placeholder: "Occurrence condition tags...",
                      allowCreate: !1
                    }
                  ),
                  /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "checkbox",
                        checked: B.includeSubtags ?? !0,
                        onChange: (l) => gt({ includeSubtags: l.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  Er(B.condition) && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "checkbox",
                        checked: B.hideConfirmedAbsent ?? !0,
                        onChange: (l) => gt({ hideConfirmedAbsent: l.target.checked })
                      }
                    ),
                    "Hide occurrences confirmed absent"
                  ] })
                ] })
              ] }),
              ce(dt) && g.performerFocus && /* @__PURE__ */ n(
                fo,
                {
                  review: dt,
                  performerId: g.performerFocus,
                  revision: Ve
                }
              )
            ]
          }
        ),
        B && /* @__PURE__ */ n(
          Ii,
          {
            open: Ie,
            onClose: () => _e(!1),
            criteria: Sn,
            activeFilter: B.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (l) => {
              _e(!1), gt({ performerFilter: l });
            }
          }
        ),
        ce(Ee) && t && /* @__PURE__ */ n(
          Ua,
          {
            review: Ee,
            hidden: !!y,
            disabled: ft || !!y,
            performerFlags: g.performerFocus ? Fe == null ? void 0 : Fe.flags : void 0,
            onOpen: () => {
              Te.current = !0, nt(!0);
            },
            onWrite: () => {
              D.current = Date.now();
            },
            onClose: (l) => {
              if (l) {
                D.current = Date.now();
                const m = M.current.performerFocus;
                m ? ur(m) : rr(), et((k) => k + 1), new Promise((k) => window.setTimeout(k, 1100)).then(() => {
                  pt(), Re.current && Se((k) => k + 1);
                });
              } else pt();
            }
          }
        ),
        /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
          Rt && /* @__PURE__ */ u("p", { role: "alert", children: [
            Rt,
            " ",
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: fe,
                onClick: () => {
                  T ? qt(p, T).then(U).catch((l) => X(bt(l))) : tt(M.current);
                },
                children: T ? "Reload tags" : "Retry queue"
              }
            )
          ] }),
          Ge && /* @__PURE__ */ n("p", { role: "status", children: Ge })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-review-layout", children: [
          /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
            B && /* @__PURE__ */ u("div", { className: "dq-queue-view", role: "group", "aria-label": "Queue view", children: [
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  "aria-pressed": vt === "items",
                  onClick: () => De("items"),
                  children: p === "audio" ? "Audios" : "Scenes"
                }
              ),
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  "aria-pressed": vt === "performers",
                  onClick: () => De("performers"),
                  children: "Performers"
                }
              )
            ] }),
            B && vt === "performers" ? /* @__PURE__ */ n(
              Ga,
              {
                ranking: (ut == null ? void 0 : ut.signature) === pe ? ut : null,
                busy: Xe,
                error: (Ot == null ? void 0 : Ot.signature) === pe ? Ot.message : "",
                focus: g.performerFocus,
                disabled: ft,
                labels: d,
                onFocus: Gr,
                onMore: () => {
                  const l = jt.current;
                  l && hr(l, l.limit + yn);
                },
                onRefresh: () => {
                  Zt(null), hr(null, yn);
                }
              }
            ) : /* @__PURE__ */ u(ve, { children: [
              /* @__PURE__ */ n("fieldset", { disabled: ft, children: /* @__PURE__ */ n(
                Oi,
                {
                  filter: g.filter,
                  totalCount: st,
                  onFilterChange: (l) => tt({ ...g, filter: ze(l, p) })
                }
              ) }),
              /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: Z.map((l) => /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  title: S(l),
                  "aria-label": S(l),
                  disabled: ft,
                  "aria-pressed": (T == null ? void 0 : T.key) === l.key,
                  onClick: () => {
                    $t(l), X(""), Y("");
                  },
                  children: [
                    l.occurrence && /* @__PURE__ */ n(Xr, { performer: l.occurrence.performer }),
                    /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: h(l.media) })
                  ]
                },
                l.key
              )) })
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-inspector", children: T ? /* @__PURE__ */ u(ve, { children: [
            /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
              /* @__PURE__ */ n("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ n(
                "a",
                {
                  href: `/${p}/${T.media.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: T.media.title || ((Ir = T.media.files[0]) == null ? void 0 : Ir.basename) || `${p === "audio" ? "Audio" : "Video"} ${T.media.id}`
                }
              ) }),
              [T, _t].filter(Boolean).map((l) => {
                var _, K, G, me, xe;
                const m = l, k = m.key === T.key;
                return /* @__PURE__ */ n(
                  "div",
                  {
                    className: k ? "dq-review-video-current" : "dq-review-video-preload",
                    "aria-hidden": k ? void 0 : !0,
                    inert: k ? void 0 : !0,
                    children: p === "audio" ? /* @__PURE__ */ n(
                      Lo,
                      {
                        streamUrl: kn("audio", m.media.id),
                        format: ((_ = m.media.files[0]) == null ? void 0 : _.format) ?? "",
                        title: h(m.media),
                        coverUrl: k ? gi("audio", m.media) : void 0,
                        duration: ((K = m.media.files[0]) == null ? void 0 : K.duration) ?? 0,
                        autostart: k && ue === m.media.id
                      }
                    ) : /* @__PURE__ */ n(
                      Mi,
                      {
                        videoId: m.media.id,
                        streamUrl: kn("video", m.media.id),
                        posterUrl: k ? gi("video", m.media) : void 0,
                        duration: ((G = m.media.files[0]) == null ? void 0 : G.duration) ?? 0,
                        format: (me = m.media.files[0]) == null ? void 0 : me.format,
                        audioCodec: (xe = m.media.files[0]) == null ? void 0 : xe.audioCodec,
                        extensionSurface: k ? "quick-view" : void 0,
                        autostart: k && ue === m.media.id,
                        keyboardShortcutsEnabled: k,
                        showAbLoop: k,
                        clip: m.media.parentVideoId != null ? {
                          start: m.media.clipStartSec ?? 0,
                          end: m.media.clipEndSec,
                          loop: !1
                        } : void 0
                      }
                    )
                  },
                  `${m.media.id}:${oe}`
                );
              }),
              p === "audio" && /* @__PURE__ */ n(
                Ba,
                {
                  details: T.media.details,
                  label: d.one
                },
                T.media.id
              )
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-panel", children: [
              /* @__PURE__ */ n("h2", { children: T.occurrence ? `Reviewing ${T.occurrence.performer.name}` : `Reviewing this ${d.one}` }),
              /* @__PURE__ */ n("p", { children: B ? `Tags apply only to this performer in this ${d.one}.` : `Tags apply to the ${d.one}.` }),
              B && /* @__PURE__ */ n(
                "div",
                {
                  className: "dq-review-partners",
                  "aria-label": `Matching ${d.queue} partners`,
                  children: Z.filter((l) => l.media.id === T.media.id).map((l) => {
                    var m, k;
                    return /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button dq-partner-button",
                        title: (m = l.occurrence) == null ? void 0 : m.performer.name,
                        "aria-label": (k = l.occurrence) == null ? void 0 : k.performer.name,
                        disabled: ft,
                        "aria-pressed": l.key === T.key,
                        onClick: () => {
                          $t(l), X("");
                        },
                        children: l.occurrence && /* @__PURE__ */ n(
                          Xr,
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
                B ? "occurrence" : d.one,
                " tags:",
                " ",
                q ? q.names.join(", ") || "None" : "Loading…"
              ] }),
              q != null && q.absent.length ? /* @__PURE__ */ u("p", { children: [
                "Confirmed absent tags:",
                " ",
                /* @__PURE__ */ n(
                  Tt,
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
              ke ? /* @__PURE__ */ u(
                "fieldset",
                {
                  ref: He,
                  disabled: fe,
                  className: "dq-tag-editor",
                  children: [
                    /* @__PURE__ */ u("legend", { children: [
                      "Edit ",
                      B ? "occurrence" : d.one,
                      " tags"
                    ] }),
                    /* @__PURE__ */ n(
                      Tt,
                      {
                        entityType: "tag",
                        values: J,
                        onChange: kt,
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
                          onClick: () => void Kt(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !q,
                          onClick: () => void Kt(void 0, !1, !0),
                          children: "Save & next"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => {
                            it(!1), requestAnimationFrame(
                              () => {
                                var l;
                                return (l = ct.current) == null ? void 0 : l.focus();
                              }
                            );
                          },
                          children: "Cancel"
                        }
                      )
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ u(ve, { children: [
                /* @__PURE__ */ n(
                  Ha,
                  {
                    actions: Ar.actions,
                    canWrite: t,
                    canAssess: r,
                    disabled: fe || Pe || !q || !!y,
                    onApply: (l, m) => void Kt(l, m)
                  }
                ),
                ce(e) && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                  "fieldset",
                  {
                    className: "dq-tag-choices",
                    disabled: !t || fe || !q || !!y,
                    children: [
                      /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                      e.occurrence.tagIds.map((l) => /* @__PURE__ */ u("label", { children: [
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: e.occurrence.multiple ? "checkbox" : "radio",
                            name: "legacy-choice",
                            checked: je.includes(l),
                            onChange: (m) => It(
                              e.occurrence.multiple ? m.target.checked ? [...je, l] : je.filter(
                                (k) => k !== l
                              ) : [l]
                            )
                          }
                        ),
                        Yt[l] ?? "Loading tag…"
                      ] }, l)),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          onClick: () => It([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void Kt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Kt(void 0, !1, !1, !0),
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
                    ref: ct,
                    className: "dq-button",
                    disabled: ft || !!y || !t || !q,
                    onClick: () => {
                      sr.current = [...q.ids], kt([...q.ids]), it(!0);
                    },
                    children: "Edit tags"
                  }
                ),
                /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: ft || !!y,
                    onClick: () => void Kt(),
                    children: [
                      "Skip",
                      B ? " performer" : ` ${d.one}`
                    ]
                  }
                )
              ] }),
              !t && /* @__PURE__ */ n("p", { children: "Write permission is required to change tags." })
            ] })
          ] }) : /* @__PURE__ */ n("p", { role: "status", children: Pe ? "Loading review…" : st ? "Reached the end in this direction." : `No matching ${d.many}.` }) })
        ] })
      ]
    }
  );
}
function vi({
  review: e,
  onChange: t,
  choices: r = !1
}) {
  const i = e.occurrence, o = yt(le(e)).queue, s = (a) => t({ ...e, occurrence: { ...i, ...a } });
  return r ? /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ u("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      o,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ n(
      Tt,
      {
        entityType: "tag",
        values: i.tagIds,
        onChange: (a) => s({ tagIds: a }),
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
          onChange: (a) => s({ multiple: a.target.checked })
        }
      ),
      "Allow multiple tags, for example when something changes part-way through the ",
      o
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
          onChange: (a) => s({
            condition: a.target.value
          }),
          children: ln.map((a) => /* @__PURE__ */ n("option", { value: a, children: cn[a] }, a))
        }
      )
    ] }),
    !["any", "isNull"].includes(i.condition) && /* @__PURE__ */ u(ve, { children: [
      /* @__PURE__ */ n(
        Tt,
        {
          entityType: "tag",
          values: i.conditionTagIds,
          onChange: (a) => s({ conditionTagIds: a }),
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
            onChange: (a) => s({ includeSubtags: a.target.checked })
          }
        ),
        "Include subtags"
      ] }),
      Er(i.condition) && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
        /* @__PURE__ */ n(
          "input",
          {
            type: "checkbox",
            checked: i.hideConfirmedAbsent ?? !0,
            onChange: (a) => s({ hideConfirmedAbsent: a.target.checked })
          }
        ),
        "Hide occurrences confirmed absent"
      ] })
    ] }),
    /* @__PURE__ */ u("p", { children: [
      "Conditions check tags on the same performer’s occurrence, independently of ",
      o,
      " tags and the performer’s profile."
    ] })
  ] });
}
function Xa({
  review: e,
  onChange: t
}) {
  const r = yt(le(e)).many;
  return /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Performer flags" }),
    /* @__PURE__ */ u("p", { children: [
      "Flag performers whose profile has any of these tags in the performer list and batches, for example a tag noting that something changed during their career. Check a flagged performer’s earliest and latest ",
      r,
      " ",
      "before applying one batch to all of them."
    ] }),
    /* @__PURE__ */ n(
      Tt,
      {
        entityType: "tag",
        values: e.occurrence.flagPerformerTagIds ?? [],
        onChange: (i) => {
          const { flagPerformerTagIds: o, ...s } = e.occurrence;
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
const Si = 1e3;
async function Za(e, t, r) {
  const i = await V(
    `/api/tags/${t}`,
    { signal: r }
  ), o = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    const f = await V(
      "/api/tags/find",
      {
        method: "POST",
        signal: r,
        body: JSON.stringify(
          Wt({
            findFilter: {
              page: d,
              perPage: Si,
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
    for (const h of f.items) o.set(h.id, h);
    if (d * Si >= f.totalCount) break;
    if (!f.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const s = [...o.values()], a = le(e), p = ce(e) ? await ts(
    a,
    s.map((d) => d.id),
    r
  ) : s.map((d) => (a === "audio" ? d.audioCount : d.videoCount) ?? 0);
  return {
    parent: { id: t, name: i.name },
    children: s.map((d, f) => ({ id: d.id, name: d.name, uses: p[f] })).sort(
      (d, f) => f.uses - d.uses || d.name.localeCompare(f.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function es(e) {
  return JSON.stringify(
    Wt({
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
async function ts(e, t, r) {
  const i = new Array(t.length).fill(0), o = new AbortController(), s = () => o.abort(r == null ? void 0 : r.reason);
  r != null && r.aborted && s(), r == null || r.addEventListener("abort", s, { once: !0 });
  let a = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; a < t.length && !o.signal.aborted; ) {
            const p = a++;
            i[p] = (await V(
              `/api/${ar(e)}/aggregate`,
              {
                method: "POST",
                signal: o.signal,
                body: es(t[p])
              }
            )).count;
          }
        } catch (p) {
          throw o.abort(), p;
        }
      })
    );
  } finally {
    r == null || r.removeEventListener("abort", s);
  }
  return o.signal.throwIfAborted(), i;
}
function rs(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((r) => ({
    ...r,
    children: r.children.filter((i) => t.has(i.id) ? !1 : (t.add(i.id), !0))
  }));
}
function ns(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    for (const i of r.children)
      t.set(i.id, [...t.get(i.id) ?? [], r.parent.id]);
  return t;
}
function is(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    for (const i of Bi(r))
      t.set(i, [...t.get(i) ?? [], r]);
  return t;
}
function os(e, t) {
  return {
    id: crypto.randomUUID(),
    label: e.name,
    steps: [
      { mode: "ADD", tagIds: [e.id] },
      ...t.length ? [{ mode: "REMOVE_TREE", tagIds: t }] : []
    ]
  };
}
const as = (e) => e instanceof Error ? e.message : "Request failed.";
function ss({
  id: e,
  review: t,
  disabled: r,
  onAdd: i,
  onCancel: o
}) {
  const [s, a] = E([]), [p, d] = E({}), [f, h] = E({}), [S, C] = E({}), v = P(/* @__PURE__ */ new Map());
  z(
    () => () => {
      for (const L of v.current.values()) L.abort();
    },
    []
  );
  const y = yt(le(t)), O = ce(t), w = O ? "performer" : y.one;
  function R(L) {
    var ge;
    (ge = v.current.get(L)) == null || ge.abort();
    const T = new AbortController();
    v.current.set(L, T), d((W) => ({ ...W, [L]: { status: "loading" } })), Za(t, L, T.signal).then(
      (W) => {
        T.signal.aborted || d((ue) => ({
          ...ue,
          [L]: { status: "ready", group: W }
        }));
      },
      (W) => {
        T.signal.aborted || d((ue) => ({
          ...ue,
          [L]: { status: "failed", message: as(W) }
        }));
      }
    );
  }
  function F(L) {
    var be;
    const T = s.filter((oe) => !L.includes(oe));
    for (const oe of T)
      (be = v.current.get(oe)) == null || be.abort(), v.current.delete(oe);
    const ge = (oe) => {
      const ye = p[oe];
      return (ye == null ? void 0 : ye.status) === "ready" ? ye.group.children.map((_t) => _t.id) : [];
    }, W = new Set(L.flatMap(ge)), ue = T.flatMap(ge).filter((oe) => !W.has(oe));
    h(
      (oe) => Object.fromEntries(
        Object.entries(oe).filter(([ye]) => !ue.includes(Number(ye)))
      )
    ), C(
      (oe) => Object.fromEntries(
        Object.entries(oe).filter(([ye]) => L.includes(Number(ye)))
      )
    ), d(
      (oe) => Object.fromEntries(
        Object.entries(oe).filter(([ye]) => L.includes(Number(ye)))
      )
    ), a(L);
    for (const oe of L) s.includes(oe) || R(oe);
  }
  const te = s.flatMap((L) => {
    const T = p[L];
    return (T == null ? void 0 : T.status) === "ready" ? [T.group] : [];
  }), ae = te.length === s.length, qe = s.some(
    (L) => {
      var T;
      return (((T = p[L]) == null ? void 0 : T.status) ?? "loading") === "loading";
    }
  ), g = new Map(
    rs(te).map((L) => [L.parent.id, L])
  ), x = ns(te), M = new Map(te.map((L) => [L.parent.id, L.parent.name])), re = is(t.actions), Se = (L) => f[L] ?? !re.has(L), j = ae ? [...g.values()].flatMap(
    (L) => L.children.filter((T) => Se(T.id))
  ) : [], Z = (L, T) => h((ge) => ({
    ...ge,
    ...Object.fromEntries(L.children.map((W) => [W.id, T]))
  }));
  return /* @__PURE__ */ u("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ n("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ u("p", { className: "dq-editor-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      O ? "on performers " : "",
      "first. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ n(
      Tt,
      {
        entityType: "tag",
        values: s,
        onChange: F,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: r
      }
    ),
    s.map((L) => {
      const T = p[L];
      if (!T || T.status === "loading")
        return /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Loading child tags…" }, L);
      if (T.status === "failed")
        return /* @__PURE__ */ u("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ u("span", { children: [
            "Child tags could not be loaded. ",
            T.message
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: r,
              onClick: () => R(L),
              children: "Retry"
            }
          )
        ] }, L);
      const ge = g.get(L);
      if (!ge) return null;
      const W = ge.parent.name;
      return /* @__PURE__ */ u("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ n("legend", { children: W }),
        T.group.children.length === 0 ? /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "This tag has no child tags." }) : /* @__PURE__ */ u(ve, { children: [
          /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: S[L] ?? !1,
                disabled: r,
                onChange: (ue) => C((be) => ({
                  ...be,
                  [L]: ue.target.checked
                }))
              }
            ),
            "Only one per ",
            w,
            ": each action removes every other tag in the ",
            W,
            " tree"
          ] }),
          ge.children.length === 0 ? /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ u(ve, { children: [
            /* @__PURE__ */ u("div", { className: "dq-row", children: [
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  disabled: r,
                  "aria-label": `Select all child tags of ${W}`,
                  onClick: () => Z(ge, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  disabled: r,
                  "aria-label": `Select none of the child tags of ${W}`,
                  onClick: () => Z(ge, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ n("div", { className: "dq-child-tags", children: ge.children.map((ue) => {
              const be = re.get(ue.id) ?? [], oe = (x.get(ue.id) ?? []).filter((ye) => ye !== L).map((ye) => `“${M.get(ye)}”`);
              return /* @__PURE__ */ u("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ n(
                  "input",
                  {
                    type: "checkbox",
                    checked: Se(ue.id),
                    disabled: r,
                    onChange: (ye) => h((_t) => ({
                      ..._t,
                      [ue.id]: ye.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ u("span", { children: [
                  ue.name,
                  " ",
                  /* @__PURE__ */ u("small", { children: [
                    ue.uses.toLocaleString(),
                    " ",
                    ue.uses === 1 ? y.one : y.many
                  ] }),
                  oe.length > 0 && /* @__PURE__ */ u("small", { children: [
                    " · Also under ",
                    oe.join(", ")
                  ] }),
                  be.length > 0 && /* @__PURE__ */ u("small", { children: [
                    " ",
                    "· Already in “",
                    be[0].label || "New action",
                    "”",
                    be.length > 1 ? ` and ${be.length - 1} more` : ""
                  ] })
                ] })
              ] }, ue.id);
            }) })
          ] })
        ] })
      ] }, L);
    }),
    /* @__PURE__ */ u("div", { className: "dq-row", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: r || !j.length,
          onClick: () => i(
            j.map(
              (L) => os(
                L,
                (x.get(L.id) ?? []).filter(
                  (T) => S[T]
                )
              )
            )
          ),
          children: j.length ? `Add ${j.length} action${j.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: o, children: "Cancel" }),
      /* @__PURE__ */ n("span", { role: "status", className: "dq-sr-only", children: qe ? "Loading child tags…" : "" })
    ] })
  ] });
}
function cs(e) {
  var p, d, f;
  const [t, r] = E({}), [i, o] = E(""), s = (((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.annotations) ?? []).includes("tags") ? ((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotationParents) ?? [] : [], a = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...s,
      ...((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.binParents) ?? []
    ])
  ]);
  return z(() => {
    let h = !0;
    return r({}), o(""), Promise.all(
      JSON.parse(a).map(
        async (S) => [S, await Bn([S])]
      )
    ).then((S) => {
      h && r(Object.fromEntries(S));
    }).catch(() => {
      h && o(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      h = !1;
    };
  }, [a]), { ids: t, error: i };
}
function ls(e, t, r) {
  const i = t == null ? void 0 : t.presentation, o = (i == null ? void 0 : i.annotations) ?? [], s = (i == null ? void 0 : i.annotationParents) ?? [];
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
    tags: o.includes("tags") && s.length > 0 ? (e.tags ?? []).filter(
      (a) => s.some(
        (p) => {
          var d;
          return p !== a.id && ((d = r[p]) == null ? void 0 : d.includes(a.id));
        }
      )
    ) : []
  };
}
function ds({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: o
}) {
  var p, d, f;
  const s = new Set(
    (((p = t.presentation) == null ? void 0 : p.binParents) ?? []).flatMap(
      (h) => (r[h] ?? []).filter((S) => S !== h)
    )
  ), a = /* @__PURE__ */ new Map();
  for (const h of e)
    for (const S of h.tags ?? [])
      if (s.has(S.id)) {
        const C = a.get(S.id) ?? { name: S.name, count: 0 };
        C.count++, a.set(S.id, C);
      }
  return (f = (d = t.presentation) == null ? void 0 : d.binParents) != null && f.length ? /* @__PURE__ */ u("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...a].sort((h, S) => h[1].name.localeCompare(S[1].name)).map(([h, S]) => /* @__PURE__ */ u(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => o(h),
        children: [
          S.name,
          " (",
          S.count,
          ")"
        ]
      },
      h
    )),
    !a.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function us(e, t) {
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
function Ci({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [o, s] = E(!1), a = Me(e) === "tag" ? "tag" : le(e), p = a === "tag" ? "tags" : `${a}s`, d = _o(
    a === "tag" ? void 0 : a,
    e.view.objectFilter
  ), f = e.view.filter, h = a === "tag" ? Pi : a === "audio" ? ki : _n, S = a === "tag" ? $i : a === "audio" ? Ln : sn, C = (w) => t({
    ...e,
    view: { ...e.view, filter: { ...f, ...w } }
  }), v = a === "video" ? e.presentation ?? {} : {}, y = a !== "audio", O = (w) => t({ ...e, presentation: { ...v, ...w } });
  return /* @__PURE__ */ u(ve, { children: [
    i && /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ u("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(f.q ?? ""),
            onChange: (w) => C({ q: w.target.value })
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
              value: String(f.sort ?? "date"),
              onChange: (w) => C({ sort: w.target.value, sorts: void 0 }),
              children: [
                !h.some((w) => w.value === f.sort) && f.sort != null && /* @__PURE__ */ n("option", { value: String(f.sort), children: String(f.sort) }),
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
              value: String(f.direction ?? "desc"),
              onChange: (w) => C({ direction: w.target.value }),
              children: [
                /* @__PURE__ */ n("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ n("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ u("label", { children: [
          a === "tag" ? "Tags" : "Videos",
          " per page",
          /* @__PURE__ */ n(
            "input",
            {
              type: "number",
              min: "1",
              max: "1000",
              value: Number(f.perPage) || 40,
              onChange: (w) => C({
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
            a,
            " filters"
          ]
        }
      ),
      /* @__PURE__ */ u("p", { children: [
        Object.keys(e.view.objectFilter).length ? `${a[0].toUpperCase()}${a.slice(1)} filters configured` : `No ${a} filters`,
        ". Choose which ",
        p,
        " enter the queue."
      ] }),
      o && /* @__PURE__ */ n("div", { onKeyDown: (w) => w.stopPropagation(), children: /* @__PURE__ */ n(
        Ii,
        {
          open: !0,
          onClose: () => s(!1),
          criteria: S,
          activeFilter: e.view.objectFilter,
          customSections: d ? [d] : void 0,
          supportsFilterExpressions: a !== "tag",
          subjectLabel: p,
          onApply: (w) => {
            t({ ...e, view: { ...e.view, objectFilter: w } }), s(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ u(ve, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ u("p", { className: "dq-editor-note", children: [
        "Choose how ",
        a === "tag" ? "tags" : `${p} and tags`,
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ u("div", { className: "dq-field-grid", children: [
        Ki(e) && /* @__PURE__ */ u("label", { children: [
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
        !ce(e) && y && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: e.view.selectAllOnLoad ?? !1,
              onChange: (w) => t({ ...e, view: { ...e.view, selectAllOnLoad: w.target.checked ? !0 : void 0 } })
            }
          ),
          "Select all ",
          p,
          " on page load",
          a === "video" && /* @__PURE__ */ n("small", { children: " (multiple-videos layout)" })
        ] }),
        y && /* @__PURE__ */ u("label", { children: [
          "Preferred view",
          /* @__PURE__ */ n(
            "select",
            {
              value: a === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid",
              onChange: (w) => t({
                ...e,
                view: {
                  ...e.view,
                  displayMode: w.target.value
                }
              }),
              children: (a === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((w) => /* @__PURE__ */ n("option", { children: w }, w))
            }
          )
        ] })
      ] }),
      a === "video" && /* @__PURE__ */ u(ve, { children: [
        /* @__PURE__ */ n("h4", { children: "Card annotations" }),
        /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((w) => {
          const R = v.annotations ?? [];
          return /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: R.includes(w),
                onChange: (F) => O({
                  annotations: F.target.checked ? [...R, w] : R.filter((te) => te !== w)
                })
              }
            ),
            w
          ] }, w);
        }) }),
        (v.annotations ?? []).includes("tags") && /* @__PURE__ */ u(ve, { children: [
          /* @__PURE__ */ n("h4", { children: "Card tag bins" }),
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected. This setting is separate from the queue filters." }),
          /* @__PURE__ */ n(
            Tt,
            {
              entityType: "tag",
              values: v.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (w) => O({ annotationParents: w }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ n("h4", { children: "Queue tag bins" }),
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ n(
          Tt,
          {
            entityType: "tag",
            values: v.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (w) => O({ binParents: w }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const wn = 180, fs = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
};
function ho({ entityType: e }) {
  const t = fs[e];
  return e === "tag" ? /* @__PURE__ */ n(Bo, { role: "img", "aria-label": t }) : Fr(e) === "audio" ? /* @__PURE__ */ n(Go, { role: "img", "aria-label": t }) : /* @__PURE__ */ n(Nn, { role: "img", "aria-label": t });
}
function Ei(e) {
  return Me(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Ni(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function vn() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Ai(e) {
  const t = new URLSearchParams(window.location.search);
  un.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function ps(e) {
  return ze({ ...e, page: 1 });
}
function bo(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function At(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const yo = "data-quality.workspace-layout.v1", ei = 240, Fn = 192, xn = 560;
function wo(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(xn, Math.max(Fn, e)) : ei;
}
function gs() {
  try {
    const e = JSON.parse(
      localStorage.getItem(yo) ?? "null"
    );
    return wo(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return ei;
  }
}
function ms(e) {
  try {
    localStorage.setItem(
      yo,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function vo(e) {
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
function So(e, t) {
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
function hs(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : So(e, t);
}
function bs({
  onNavigate: e
}) {
  const [t, r] = E([]), [i] = E(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [o, s] = E(""), [a, p] = E(!0), [d, f] = E(""), [h, S] = E(!1), [C, v] = E(!1), [y, O] = E(!1), [w, R] = E(!1), [F, te] = E([]), [ae, qe] = E(""), [g, x] = E(!0), [M, re] = E(""), [Se, j] = E(""), [Z, L] = E(!1), [T, ge] = E(!1), [W, ue] = E(vn), [be, oe] = E({}), [ye, _t] = E("name"), [st, Ht] = E("asc"), Pe = P(null), Be = P(!1), [fe, nt] = E(0), [Te, Re] = E(!1), [We, Rt] = E(!1), [X, Ge] = E(
    null
  ), Y = t.find((c) => c.id === W) ?? null, q = Qt(
    () => (X == null ? void 0 : X.id) === W && Y ? { ...Y, view: {
      ...Y.view,
      filter: X.view.filter,
      objectFilter: X.view.objectFilter,
      searchMode: X.view.searchMode,
      startFrom: X.view.startFrom
    } } : Y,
    [X, W, Y]
  ), U = q ? Me(q) : "video", ke = Fr(U), it = q ? ce(q) : !1, J = U === "video" ? q : null, kt = it && !!(q != null && q.actions.some(zt)), sr = !!J || U === "audio" || kt, [ct, lt] = E(null), He = (ct == null ? void 0 : ct.id) === (q == null ? void 0 : q.id) ? ct == null ? void 0 : ct.mode : (q == null ? void 0 : q.view.reviewMode) ?? "single", Ie = it || U === "audio" || U === "video" && He === "single", [_e, je] = E(0), It = P(-1), Yt = P(!1);
  z(() => {
    const c = () => {
      if (!Ie && er.current) {
        Yt.current = !0;
        return;
      }
      ue(vn()), Ie || je((b) => b + 1);
    };
    return window.addEventListener("popstate", c), () => window.removeEventListener("popstate", c);
  }, [Ie]);
  const cr = ke === "audio" ? C : h, N = U === "tag" ? "Tag" : ke === "audio" ? "Audio" : "Video", D = U === "tag" ? y : cr, we = Qt(() => {
    const c = st === "asc" ? 1 : -1;
    return [...t].sort((b, A) => {
      if (ye === "count") {
        const I = be[b.id], H = be[A.id], $ = typeof I == "number", Q = typeof H == "number";
        if ($ !== Q) return $ ? -1 : 1;
        if ($ && Q && I !== H)
          return (I - H) * c;
      }
      return b.name.localeCompare(A.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * c;
    });
  }, [st, ye, be, t]), wt = P(
    null
  ), Ye = cs(J), [ne, Xt] = E({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Ar, dt] = E({
    page: 1,
    perPage: 40
  }), [Ee, mr] = E({ items: [], totalCount: 0 }), [ee, vt] = E(!1), [De, ut] = E(""), [Br, jt] = E(!1), [qr, Zt] = E(!1), [Xe, Ze] = E(() => /* @__PURE__ */ new Set()), Ot = P(Xe);
  Ot.current = Xe;
  const Mt = P(/* @__PURE__ */ new Map()), Oe = (q == null ? void 0 : q.view.selectAllOnLoad) === !0, [pe, Ve] = E(null), et = P(pe);
  et.current = pe;
  const [Ue, Dt] = E(!1), Je = P(Ue);
  Je.current = Ue;
  const Tr = P(null), [Ut, ft] = E("grid"), [Pt, tt] = E(wn), [pt, lr] = E(gs), [ie, $t] = E(!1), er = P(!1), [Kt, Rr] = E(""), [dr, Bt] = E(""), [kr, tr] = E(""), [B, gt] = E(null), [hr, rr] = E(""), [ur, br] = E(!1), [Fe, Gr] = E({}), [Vr, Ir] = E({}), l = P(/* @__PURE__ */ new Map()), m = P(null), k = P(null), _ = P(null), K = P(0), G = P(0), me = P(null), xe = P(null), Gt = JSON.stringify([
    ...new Set(
      (J == null ? void 0 : J.actions.flatMap(
        (c) => c.steps.flatMap((b) => b.tagIds)
      )) ?? []
    )
  ]);
  function $e(c) {
    const b = wo(c);
    lr(b), ms(b);
  }
  function mt(c) {
    const b = c.shiftKey ? 40 : 16;
    let A = null;
    c.key === "ArrowLeft" && (A = pt + b), c.key === "ArrowRight" && (A = pt - b), c.key === "Home" && (A = Fn), c.key === "End" && (A = xn), A !== null && (c.preventDefault(), c.stopPropagation(), $e(A));
  }
  z(() => {
    if (!dr) return;
    const c = window.setTimeout(() => Bt(""), 4e3);
    return () => window.clearTimeout(c);
  }, [dr]), z(() => {
    const c = JSON.parse(Gt);
    if (Ir({}), !c.length) return;
    const b = new AbortController();
    let A = !0;
    return Promise.all(
      c.map(async (I) => {
        var H;
        try {
          const $ = await V(`/api/tags/${I}`, {
            signal: b.signal
          });
          return [I, ((H = $.name) == null ? void 0 : H.trim()) || null];
        } catch {
          return [I, null];
        }
      })
    ).then((I) => {
      A && Ir(Object.fromEntries(I));
    }), () => {
      A = !1, b.abort();
    };
  }, [Gt]), z(() => {
    const c = J ? zn(J.view.objectFilter) : [];
    if (Gr({}), !c.length) return;
    const b = new AbortController();
    let A = !0;
    return Promise.all(
      c.map(async (I) => {
        var H;
        try {
          const $ = await V(`/api/tags/${I}`, {
            signal: b.signal
          });
          return (H = $.name) != null && H.trim() ? [String(I), $.name] : null;
        } catch {
          return null;
        }
      })
    ).then((I) => {
      A && Gr(
        Object.fromEntries(I.filter((H) => H !== null))
      );
    }), () => {
      A = !1, b.abort();
    };
  }, [J == null ? void 0 : J.id, J == null ? void 0 : J.view.objectFilter]);
  const Ke = Qt(
    () => J ? Wn(
      J.view.objectFilter,
      Fe
    ) : (q == null ? void 0 : q.view.objectFilter) ?? {},
    [Fe, q, J]
  ), yr = ir(async () => {
    p(!0), f("");
    try {
      const c = await oa();
      r(c.reviews), s(c.storageKey), S(c.canWriteVideos ?? c.canWrite), v(c.canWriteAudios ?? !1), O(c.canWriteTags ?? !1), R(c.canReadTagGroups ?? !1), x(c.canConfigure ?? !0), re(c.storageNotice ?? ""), W && !c.reviews.some((b) => b.id === W) && (ue(""), Ai(""));
    } catch (c) {
      f(
        c instanceof Error ? c.message : "Could not load reviews."
      );
    } finally {
      p(!1);
    }
  }, [W]);
  z(() => {
    if (!w) {
      te([]), qe("");
      return;
    }
    const c = new AbortController();
    return qe(""), ha(c.signal).then(te).catch((b) => {
      c.signal.aborted || qe(
        b instanceof Error ? b.message : "Could not load tag groups."
      );
    }), () => c.abort();
  }, [w]), z(() => {
    yr();
  }, []), z(() => {
    if (W || t.length === 0) return;
    const c = new AbortController();
    oe({});
    for (const b of t)
      (ce(b) ? Hn(b, c.signal).then((I) => (I == null ? void 0 : I.length) === 0 ? { items: [], totalCount: 0 } : xr(Yn(b, I), { ...b.view.filter, page: 1, perPage: 1 }, c.signal)) : Me(b) === "tag" ? pi(
        b,
        ze({ ...b.view.filter, page: 1, perPage: 1 }),
        c.signal
      ) : xr(
        b,
        ze({ ...b.view.filter, page: 1, perPage: 1 }),
        c.signal
      )).then((I) => {
        c.signal.aborted || oe((H) => ({
          ...H,
          [b.id]: I.totalCount
        }));
      }).catch(() => {
        c.signal.aborted || oe((I) => ({ ...I, [b.id]: null }));
      });
    return () => c.abort();
  }, [W, t]), Ri(() => {
    var c;
    W || a || !Be.current || (Be.current = !1, (c = Pe.current) == null || c.focus());
  }, [W, a]);
  const he = P(0), ot = ir(async () => {
    const c = ++he.current;
    gt(null), rr("");
    try {
      const b = await (kt ? ro(ke) : to(ke));
      c === he.current && gt(b);
    } catch (b) {
      if (c !== he.current) return;
      gt(null), rr(
        "Tag assessment setup could not be checked. " + (b instanceof Error ? b.message : "Request failed.")
      );
    }
  }, [kt, ke]);
  z(() => {
    ot();
  }, [ot]);
  const Ft = ir(
    async (c, b, A = !1, I = !1) => {
      var Ne, se;
      const H = ++K.current;
      (Ne = me.current) == null || Ne.abort();
      const $ = new AbortController();
      me.current = $, b = ze(b);
      const Q = Number(b.page);
      A && (b = { ...b, page: 1 }), Xt(b), Zt(A), vt(!0), ut("");
      try {
        const Ae = (Jt) => Me(c) === "tag" ? pi(
          c,
          Jt,
          $.signal
        ) : xr(
          c,
          Jt,
          $.signal
        );
        let Qe = await Ae(b);
        const Ct = Math.max(
          1,
          Math.ceil(Qe.totalCount / Number(b.perPage))
        ), Vt = A ? Ct : Math.min(Q, Ct);
        return Number(b.page) !== Vt && (b = { ...b, page: Vt }, Qe = await Ae(b)), H === K.current && (((se = xe.current) == null ? void 0 : se.page) !== Vt && (xe.current = {
          page: Vt,
          ids: new Set(Qe.items.map((Jt) => Jt.id))
        }), mr(Qe), I && nr(
          () => new Set(Qe.items.map((Jt) => Jt.id))
        ), Xt(b), dt(b)), Qe;
      } catch (Ae) {
        throw H === K.current && ut(
          Ae instanceof Error ? Ae.message : "Could not load the review queue."
        ), Ae;
      } finally {
        H === K.current && vt(!1);
      }
    },
    []
  );
  z(() => {
    var b;
    if (G.current += 1, It.current = -1, K.current += 1, (b = me.current) == null || b.abort(), ge(!1), j(""), L(!1), Ze(/* @__PURE__ */ new Set()), Mt.current.clear(), Ve(null), Dt(!1), $t(!1), er.current = !1, Rr(""), Bt(""), tr(""), mr({ items: [], totalCount: 0 }), xe.current = null, jt(!1), !q || Ie) {
      vt(!1);
      return;
    }
    let c = !0;
    return vt(!0), (async () => {
      let A = Y ?? q;
      Ge(null);
      let I = null;
      const H = new URLSearchParams(window.location.search);
      if (Me(q) === "video" && un.some((se) => H.has(se)))
        try {
          const se = A;
          I = $n(se, H);
          const Ae = Lt(se, I.query);
          (I.query.startFrom !== (se.view.startFrom ?? "end") || !Dr(
            JSON.parse(xt(Ae)),
            JSON.parse(xt(Lt(se, Cr(se))))
          )) && (A = Ae, Ge(A));
        } catch (se) {
          jt(!0), ut(se instanceof Error ? se.message : "Could not read review URL."), vt(!1);
          return;
        }
      let $ = null;
      try {
        $ = await ca(o, q.id);
      } catch (se) {
        c && (L(!0), j(
          se instanceof Error ? se.message : "Could not load progress."
        ));
      }
      if (!c) return;
      const Q = ($ == null ? void 0 : $.signature) === xt(A) ? $ : null, Ne = I ? I.query.filter : Q ? ze(Q.filter) : ps(A.view.filter);
      Xt(Ne), ft(
        Q ? Ni(Q.displayMode, Me(q)) : Ei(q)
      ), tt(
        Q ? Q.cardSize ?? wn : wn
      );
      try {
        const se = await Ft(
          A,
          Ne,
          I ? I.startAtEnd : !Q && A.view.startFrom !== "beginning",
          A.view.selectAllOnLoad === !0
        );
        if (!c) return;
        const Ae = ci(
          se.items.map((Qe) => Qe.id),
          (Q == null ? void 0 : Q.focusedId) ?? null,
          (Q == null ? void 0 : Q.index) ?? 0
        );
        Ve(Ae), Le(Ae);
      } catch {
      }
      c && (It.current = _e, ge(!0));
    })(), () => {
      var A;
      c = !1, G.current++, K.current++, (A = me.current) == null || A.abort();
    };
  }, [q == null ? void 0 : q.id, Ie, _e]), z(() => {
    !J || Ie || !T || ee || De || ie || Yt.current || It.current !== _e || Lr(J.id, {
      filter: ne,
      objectFilter: J.view.objectFilter,
      searchMode: J.view.searchMode,
      startFrom: J.view.startFrom ?? "end"
    });
  }, [J, Ie, T, ee, De, ne, ie, _e]);
  const de = Qt(
    () => Ee.items.map((c) => c.id),
    [Ee.items]
  );
  z(() => {
    if (!T || !q || !o || ee || De || ie || (X == null ? void 0 : X.id) === q.id || Z)
      return;
    const c = {
      version: 1,
      signature: xt(q),
      filter: ne,
      focusedId: pe,
      index: Math.max(0, de.indexOf(pe ?? -1)),
      displayMode: Ut,
      cardSize: Pt,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        o + ":progress:" + q.id,
        JSON.stringify(c)
      );
    } catch {
    }
    if (Se) return;
    let b = !0;
    const A = window.setTimeout(() => {
      la(o, q.id, c).catch((I) => {
        b && j(
          "Progress is kept in this browser, but account sync failed. " + (I instanceof Error ? I.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      b = !1, window.clearTimeout(A);
    };
  }, [
    T,
    o,
    q,
    ee,
    De,
    ie,
    ne,
    pe,
    de,
    Ut,
    Pt,
    X,
    Se,
    Z
  ]);
  const Jr = Ee.items.find((c) => c.id === pe) ?? null, Or = U === "video" ? Jr : null;
  Ue && Or && (Tr.current = Or);
  const St = Or ?? (Ue ? Tr.current : null), Mr = li(Xe, pe), rt = de.length > 0 && de.every((c) => Xe.has(c)), wr = Xe.size > 0 ? `${Xe.size} selected ${U}${Xe.size === 1 ? "" : "s"}` : pe == null ? `no ${U}` : `focused ${U}`, Le = ir((c, b = !0) => {
    c != null && window.requestAnimationFrame(() => {
      const A = l.current.get(c);
      A == null || A.focus({ preventScroll: !0 }), b && (A == null || A.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  z(() => {
    T && !Je.current && Le(et.current);
  }, [T, Le]), z(() => {
    ee || !de.length || (et.current == null || !de.includes(et.current)) && (Ve(de[0]), Je.current || Le(de[0]));
  }, [Le, de, ee]);
  const nr = ir(
    (c) => {
      Ze((b) => {
        const A = c(b);
        for (const I of /* @__PURE__ */ new Set([...b, ...A]))
          b.has(I) !== A.has(I) && Mt.current.set(
            I,
            (Mt.current.get(I) ?? 0) + 1
          );
        return A;
      });
    },
    []
  ), fn = ir(
    (c) => {
      if (!de.length) return;
      const b = Math.max(
        0,
        de.indexOf(et.current ?? de[0])
      ), A = de[Math.max(0, Math.min(de.length - 1, b + c))];
      Ve(A), Je.current || Le(A);
    },
    [Le, de]
  ), pn = ir(
    async (c) => {
      const b = "steps" in c ? c.steps.length > 0 : c.effect.mode !== "SKIP", A = "effect" in c && c.effect.mode === "SET_TAG_GROUP" ? c.effect.tagGroupId : null, I = A != null && (!w || !F.some((Ce) => Ce.id === A)), H = "effect" in c && b && !w, $ = li(
        Ot.current,
        et.current
      );
      if (!q || er.current || ee || De) return;
      const Q = b && !D ? `${N} write permission is required to apply ${c.label}.` : H || I ? `${c.label} needs a tag group that is unavailable.` : zt(c) && (B == null ? void 0 : B.kind) !== "ready" ? `Set up tag assessments before applying ${c.label}.` : $.length ? "" : `Select or focus a ${U} before applying ${c.label}.`;
      if (Q) {
        tr(Q);
        return;
      }
      const Ne = ++G.current, se = q.id, Ae = [...de], Qe = Ee, Ct = et.current, Vt = new Set(Ot.current), Jt = new Map(
        $.map((Ce) => [Ce, Mt.current.get(Ce) ?? 0])
      ), vr = () => Ne === G.current && q.id === se;
      er.current = !0, $t(!0), Rr(
        Ot.current.size ? `${$.length} selected ${U}s` : `the focused ${U}`
      ), Bt(""), tr("");
      const ii = Qe.items.filter(
        (Ce) => !$.includes(Ce.id)
      ), Oo = ii.map((Ce) => Ce.id), oi = di(
        Ae,
        Oo,
        Ct,
        $.includes(Ct ?? -1)
      );
      mr({
        items: ii,
        totalCount: Qe.totalCount
      }), Ze((Ce) => {
        const at = new Set(Ce);
        for (const Et of $) at.delete(Et);
        return at;
      }), Ve(oi), Je.current || Le(oi);
      let mn = !1;
      try {
        if ("effect" in c ? await qa(c, $) : await io(ke, c, $), mn = !0, !vr()) return;
        Ze((Ce) => {
          const at = new Set(Ce);
          for (const Et of $)
            (Mt.current.get(Et) ?? 0) === Jt.get(Et) && at.delete(Et);
          return at;
        }), Bt(
          `${c.label}: ${$.length} ${U}${$.length === 1 ? "" : "s"} ${b ? "updated" : "skipped"}.`
        );
      } catch (Ce) {
        if (!vr()) return;
        mr(Qe), Ze((at) => {
          const Et = new Set(at);
          for (const ht of $)
            Vt.has(ht) && (Mt.current.get(ht) ?? 0) === Jt.get(ht) && Et.add(ht);
          return Et;
        }), Ve(Ct), Je.current || Le(Ct), tr(
          Ce instanceof Error ? Ce.message : "Action failed."
        );
      }
      try {
        if (await wa(c), !vr()) return;
        const Ce = new Set($), at = Oe && Ae.length > 0 && Ae.every((Nt) => Ce.has(Nt)), Et = await Ft(q, ne, !1, at);
        if (!vr()) return;
        let ht = Et.items.map((Nt) => Nt.id);
        const zr = xe.current, Mo = (zr == null ? void 0 : zr.page) === Number(ne.page) && ht.some((Nt) => zr.ids.has(Nt)), Po = (q.view.startFrom ?? "end") !== "beginning";
        if (Et.totalCount > 0 && Number(ne.page) > 1 && (!ht.length || Po && !Mo)) {
          const Nt = Math.max(1, Number(ne.page) - 1), Wr = { ...ne, page: Nt };
          Xt(Wr), ht = (await Ft(
            q,
            Wr,
            !1,
            at
          )).items.map((hn) => hn.id), Ze(
            (hn) => new Set([...hn].filter(($o) => ht.includes($o)))
          );
          const si = ht.at(-1) ?? null;
          Ve(si), Je.current || Le(si);
        } else {
          Ze(
            (Wr) => new Set([...Wr].filter((ai) => ht.includes(ai)))
          );
          const Nt = di(
            Ae,
            ht,
            Ct,
            mn && $.includes(Ct ?? -1)
          );
          Ve(Nt), Je.current && Nt == null && Dt(!1), Je.current || Le(Nt);
        }
      } catch (Ce) {
        vr() && tr(
          (at) => `${at ? `${at} ` : ""}${mn ? "The action completed, but " : ""}the queue could not be refreshed. ${Ce instanceof Error ? Ce.message : "Refresh failed."}`
        );
      } finally {
        vr() && (er.current = !1, $t(!1), Rr(""), Yt.current && (Yt.current = !1, ue(vn()), je((Ce) => Ce + 1)));
      }
    },
    [
      D,
      w,
      F,
      U,
      B,
      Ft,
      ne,
      Le,
      de,
      Ee,
      ee,
      De,
      q
    ]
  );
  function No() {
    var A;
    if (Ut === "list") return 1;
    const c = (A = m.current) == null ? void 0 : A.firstElementChild, b = c ? getComputedStyle(c).gridTemplateColumns : "";
    return Math.max(1, b.split(" ").filter(Boolean).length);
  }
  const ti = P(() => {
  });
  ti.current = (c) => {
    var Q;
    if (Ie || c.defaultPrevented || c.repeat || c.ctrlKey || c.altKey || c.metaKey || Te) return;
    const b = c.target, A = b instanceof Node && ((Q = k.current) == null ? void 0 : Q.contains(b)) === !0, I = b === document.body || b === document.documentElement;
    if (!A && !I) return;
    if (Ue && c.key === "Escape") {
      At(c), Dt(!1), Le(et.current);
      return;
    }
    if (!Zo(b)) return;
    const H = Ji(b);
    if (c.key === "Escape") {
      At(c), nr(() => /* @__PURE__ */ new Set());
      return;
    }
    const $ = (q == null ? void 0 : q.actions.findIndex(
      (Ne, se) => or(Ne, se) === c.key.toLowerCase()
    )) ?? -1;
    if ($ >= 0 && (q != null && q.actions[$])) {
      At(c), !ie && !ee && pn(q.actions[$]);
      return;
    }
    if (!Ue && c.key === " " && H) {
      At(c), pe != null && nr((Ne) => Yr(Ne, pe));
      return;
    }
    if (!Ue && c.key.toLowerCase() === "a") {
      At(c), nr(
        (Ne) => ui(Ne, de)
      );
      return;
    }
    if (!(ie || ee) && !Ue && c.key === "Enter" && pe != null && H) {
      At(c), U === "tag" ? window.open(`/tag/${pe}`, "_blank", "noopener,noreferrer") : Dt(!0);
      return;
    }
  }, z(() => {
    const c = (b) => ti.current(b);
    return document.addEventListener("keydown", c), () => document.removeEventListener("keydown", c);
  }, []);
  const ri = P(
    () => {
    }
  );
  ri.current = (c) => {
    var $;
    if (Ie || Te || Ue || ie || ee || !de.length || c.defaultPrevented || c.repeat || c.ctrlKey || c.altKey || c.metaKey)
      return;
    const b = c.target, A = b instanceof Node && (($ = k.current) == null ? void 0 : $.contains(b)) === !0, I = b === document.body || b === document.documentElement;
    if (!A && !I || !c.key.startsWith("Arrow") || !ea(b)) return;
    const H = ta(c.key, No());
    H && (c.preventDefault(), A ? c.stopImmediatePropagation() : c.stopPropagation(), fn(H));
  }, z(() => {
    const c = (b) => ri.current(b);
    return document.addEventListener("keydown", c), () => document.removeEventListener("keydown", c);
  }, []);
  function Pr(c) {
    lt(null), nt(0), ue(c), Ai(c);
  }
  function Ao() {
    Be.current = !0, oe({}), Pr("");
  }
  async function gn(c) {
    if (!o) return !1;
    const b = c.map(ws);
    try {
      await sa(o, b);
    } catch (I) {
      throw I;
    }
    r(b), W && !b.some((I) => I.id === W) && Pr("");
    const A = b.find((I) => I.id === W);
    return A && lt(null), A && Y && JSON.stringify(A) !== JSON.stringify(Y) && (A.view.displayMode !== Y.view.displayMode && ft(Ei(A)), xt(A) !== xt(Y) && (Ge(null), Me(A) === "video" && Lr(A.id, {
      filter: ze(A.view.filter),
      objectFilter: A.view.objectFilter,
      searchMode: A.view.searchMode,
      startFrom: A.view.startFrom ?? "end"
    }), Ie || Qr(
      A,
      ze({ ...A.view.filter, page: ne.page })
    ))), !0;
  }
  if (a)
    return /* @__PURE__ */ n(qi, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ u(ve, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Rs().catch(
            (c) => f(
              "Could not export browser reviews. " + (c instanceof Error ? c.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        Ti,
        {
          message: d,
          onRetry: () => void yr()
        }
      )
    ] });
  return /* @__PURE__ */ u("div", { ref: k, className: "data-quality-page", children: [
    /* @__PURE__ */ u("header", { className: "data-quality-header", children: [
      q && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: ie,
          onClick: Ao,
          children: /* @__PURE__ */ n(xi, {})
        }
      ),
      /* @__PURE__ */ u("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (q == null ? void 0 : q.name) ?? "Data Quality" }),
        (q == null ? void 0 : q.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: q.description })
      ] }),
      q && Y && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: ie || ee || !g,
          onClick: () => {
            Ie ? nt((c) => c + 1) : (Rt(!0), Re(!0));
          },
          children: /* @__PURE__ */ n(Li, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: ie || ee || !g,
          onClick: () => {
            Rt(!1), Re(!0);
          },
          children: /* @__PURE__ */ n(Ko, {})
        }
      )
    ] }),
    M && /* @__PURE__ */ n("p", { className: "dq-status", children: M }),
    sr && (B == null ? void 0 : B.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      B.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: ur,
          onClick: () => {
            br(!0), rr(""), (kt ? Ca(ke) : Sa(ke)).then(ot).catch(
              (c) => rr(
                `Could not create the ${kt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (c instanceof Error ? c.message : "Request failed.")
              )
            ).finally(() => br(!1));
          },
          children: ur ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    sr && ((B == null ? void 0 : B.kind) === "incompatible" || hr) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(En, {}),
      hr || (B == null ? void 0 : B.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: ur,
          onClick: () => {
            br(!0), ot().finally(
              () => br(!1)
            );
          },
          children: ur ? "Checking…" : "Check again"
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
            ), A = document.createElement("a");
            A.href = b, A.download = "data-quality-unassigned-legacy-reviews.json", A.click(), URL.revokeObjectURL(b);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    Se && /* @__PURE__ */ u("p", { role: "alert", children: [
      Se,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            j(""), L(!1);
          },
          children: Z ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    J && /* @__PURE__ */ u("label", { className: "dq-layout-control", children: [
      "Review layout",
      /* @__PURE__ */ u(
        "select",
        {
          "aria-label": "Review layout",
          value: He,
          disabled: ie || ee || Te,
          onChange: (c) => lt({ id: J.id, mode: c.target.value }),
          children: [
            /* @__PURE__ */ n("option", { value: "single", children: "Single video" }),
            /* @__PURE__ */ n("option", { value: "multiple", children: "Multiple videos" })
          ]
        }
      )
    ] }),
    q && Y && !Ie && /* @__PURE__ */ u("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${ie || ee ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": ie || ee || void 0,
          inert: ie || ee ? !0 : void 0,
          children: /* @__PURE__ */ n(
            _r,
            {
              filter: De ? Ar : ne,
              onFilterChange: qo,
              totalCount: Ee.totalCount,
              sortOptions: U === "tag" ? Pi : _n,
              showSearch: !0,
              showSort: !0,
              displayMode: Ut,
              onDisplayModeChange: (c) => ft(Ni(c, U)),
              availableDisplayModes: U === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (Pt - 225) / 50,
              onZoomChange: (c) => tt(Math.round(225 + c * 50)),
              cardSizeEntityType: U === "tag" ? "tags" : "videos",
              criteriaDefinitions: U === "tag" ? $i : sn,
              customFieldEntityType: U === "video" ? "video" : void 0,
              objectFilter: Ke,
              onObjectFilterChange: (c) => {
                !ie && !ee && (wt.current = U === "video" ? oo(
                  c,
                  Fe,
                  q.view.objectFilter
                ) : c);
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (X == null ? void 0 : X.id) === W && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: ie || ee || !g,
            onClick: Ro,
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
            disabled: ie || ee,
            onClick: To,
            children: /* @__PURE__ */ n(Fi, {})
          }
        )
      ] })
    ] }),
    q ? Ie ? /* @__PURE__ */ n(Ya, { review: q, canWrite: it ? y : cr, canAssess: (B == null ? void 0 : B.kind) === "ready" && cr, onBusy: $t, editRequest: fe, renderRuleEditor: (c, b, A) => /* @__PURE__ */ n(Co, { workspace: !0, draft: c, entityTypeLocked: !0, tagGroups: F, saving: A, setDraft: (I) => b(I), onSave: () => {
    }, onCancel: () => {
    } }), onSaveDefaults: g ? (c) => gn(t.map((b) => b.id === c.id ? c : b)) : void 0 }, q.id) : /* @__PURE__ */ u(ve, { children: [
      J && Ye.error && /* @__PURE__ */ n("p", { role: "alert", children: Ye.error }),
      J && /* @__PURE__ */ n(
        ds,
        {
          videos: Ee.items,
          review: J,
          trees: Ye.ids,
          disabled: ie || ee,
          onChoose: (c) => {
            const b = us(J, c);
            Ge(b), Qr(b, { ...ne, page: 1 });
          }
        }
      ),
      kr && !Ue && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(En, {}),
        kr
      ] }),
      dr && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: dr }),
      ni("top"),
      /* @__PURE__ */ u(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${pt}px`
          },
          children: [
            /* @__PURE__ */ u("main", { children: [
              ee && !Ee.items.length && /* @__PURE__ */ n(qi, { label: "Loading review queue…" }),
              De && !ee && /* @__PURE__ */ n(
                Ti,
                {
                  message: De,
                  retryLabel: Br ? "Reset to review defaults" : "Retry",
                  onRetry: () => {
                    if (Br && Y && Me(Y) === "video") {
                      const c = Cr(Y);
                      Lr(Y.id, { ...c, filter: { ...c.filter, page: void 0 } }), je((b) => b + 1);
                      return;
                    }
                    Ft(
                      q,
                      ne,
                      qr,
                      Oe
                    ).catch(() => {
                    });
                  }
                }
              ),
              !ie && !ee && !De && !Ee.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(Nn, {}),
                /* @__PURE__ */ u("p", { children: [
                  "No ",
                  U,
                  "s match this review."
                ] })
              ] }),
              !!Ee.items.length && /* @__PURE__ */ n("div", { ref: m, children: /* @__PURE__ */ n(
                "div",
                {
                  className: Ut === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${Pt}px`
                  },
                  children: Ee.items.map(Io)
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
                "aria-valuemin": Fn,
                "aria-valuemax": xn,
                "aria-valuenow": pt,
                "aria-valuetext": `${pt} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (c) => {
                  _.current = {
                    pointerId: c.pointerId,
                    startX: c.clientX,
                    startWidth: pt
                  }, c.currentTarget.setPointerCapture(c.pointerId);
                },
                onPointerMove: (c) => {
                  const b = _.current;
                  (b == null ? void 0 : b.pointerId) === c.pointerId && c.currentTarget.hasPointerCapture(c.pointerId) && $e(
                    b.startWidth + b.startX - c.clientX
                  );
                },
                onPointerUp: () => {
                  _.current = null;
                },
                onPointerCancel: () => {
                  _.current = null;
                },
                onKeyDown: mt,
                onDoubleClick: () => $e(ei),
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
                  disabled: !de.length,
                  onClick: () => nr(
                    (c) => ui(c, de)
                  ),
                  children: [
                    rt ? "Clear selection" : "Select all on page",
                    /* @__PURE__ */ n("kbd", { "aria-hidden": "true", children: "A" })
                  ]
                }
              ),
              /* @__PURE__ */ n("strong", { children: Xe.size > 0 ? wr : pe == null ? "Nothing to apply to" : `Applies to the ${wr}` }),
              q.actions.map((c, b) => {
                const A = "steps" in c ? c.steps.length > 0 : c.effect.mode !== "SKIP", I = "effect" in c && c.effect.mode === "SET_TAG_GROUP" ? c.effect.tagGroupId : null, H = I != null ? F.find((Q) => Q.id === I) : void 0, $ = I != null && !H;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    disabled: ie || ee || !!De || A && !D || "effect" in c && A && (!w || $) || zt(c) && (B == null ? void 0 : B.kind) !== "ready" || !Mr.length,
                    onClick: () => void pn(c),
                    children: [
                      /* @__PURE__ */ u("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: c.label }),
                        "effect" in c ? /* @__PURE__ */ n("small", { children: c.effect.mode === "SKIP" ? "Skip" : c.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : H ? `Assign ${H.name}` : "Unavailable tag group" }) : c.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: c.steps.flatMap(
                          (Q, Ne) => Q.tagIds.map((se, Ae) => {
                            const Qe = Vr[se] === void 0 ? "Tag" : Vr[se] ?? "Unavailable tag", Ct = So(Q, Qe), Vt = hs(Q, Qe);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": vo(Q.mode),
                                "aria-label": Vt,
                                title: `Step ${Ne + 1}: ${Vt}`,
                                children: Ct
                              },
                              `${Ne}-${se}-${Ae}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      or(c, b) && /* @__PURE__ */ n("kbd", { children: or(c, b) })
                    ]
                  },
                  c.id
                );
              }),
              !q.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              !D && /* @__PURE__ */ u("p", { children: [
                N,
                " write permission is required to apply actions."
              ] }),
              U === "tag" && ae && /* @__PURE__ */ u("p", { children: [
                "Tag groups are unavailable. ",
                ae
              ] }),
              ie && /* @__PURE__ */ u("p", { role: "status", children: [
                /* @__PURE__ */ n(ji, { className: "dq-spin" }),
                " Applying action to",
                " ",
                Kt,
                "…"
              ] }),
              /* @__PURE__ */ u("p", { className: "dq-shortcuts", children: [
                "←→↑↓ move · space select · enter ",
                U === "tag" ? "open" : "preview",
                " · Q–P apply · A toggle shown · Esc clear"
              ] })
            ] })
          ]
        }
      ),
      ni("bottom")
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
                  ref: Pe,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ n("p", { children: "Choose a review to open its queue." }),
              /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                (c) => be[c.id] !== void 0
              ) ? t.some((c) => be[c.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: ye,
                    onChange: (c) => _t(
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
                  "aria-label": st === "asc" ? "Ascending" : "Descending",
                  title: st === "asc" ? "Ascending" : "Descending",
                  onClick: () => Ht(
                    (c) => c === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    _i,
                    {
                      className: st === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: we.map((c) => {
            const b = be[c.id], A = Me(c), I = A === "tag" ? "tag" : ce(c) ? yt(Fr(A)).queue : yt(Fr(A)).one;
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                disabled: ie,
                onClick: () => Pr(c.id),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ u("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(ho, { entityType: A }),
                      /* @__PURE__ */ n("strong", { children: c.name })
                    ] }),
                    /* @__PURE__ */ n(
                      "span",
                      {
                        className: "dq-review-count",
                        "aria-label": b === void 0 ? `Counting matching ${I}s` : b === null ? `Matching ${I} count unavailable` : `${b.toLocaleString()} matching ${b === 1 ? I : `${I}s`}`,
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
      /* @__PURE__ */ n(Nn, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    Ue && St && J && /* @__PURE__ */ n(
      Es,
      {
        video: St,
        review: J,
        targetLabel: wr,
        pending: ie,
        refreshing: ee || !!De,
        error: kr,
        canWrite: h,
        assessmentReady: (B == null ? void 0 : B.kind) === "ready",
        selected: Xe.has(St.id),
        hasPrevious: de.indexOf(St.id) > 0,
        hasNext: de.indexOf(St.id) >= 0 && de.indexOf(St.id) < de.length - 1,
        onToggleSelected: () => nr((c) => Yr(c, St.id)),
        onPrevious: () => fn(-1),
        onNext: () => fn(1),
        onClose: () => {
          Dt(!1), Le(et.current);
        },
        onAction: pn
      }
    ),
    Te && /* @__PURE__ */ n(
      Ns,
      {
        reviews: t,
        activeReview: Y,
        tagGroups: F,
        initialEdit: We,
        onSave: gn,
        onChoose: Pr,
        onEditWorkspace: (c) => {
          c !== W && Pr(c), lt({ id: c, mode: "single" }), nt((b) => b + 1), Re(!1);
        },
        onClose: () => {
          Re(!1), We && Le(et.current, !1);
        }
      }
    )
  ] });
  async function Qr(c, b, A = !1) {
    const I = et.current, H = Math.max(0, de.indexOf(I ?? -1));
    try {
      const Q = (await Ft(
        c,
        b,
        A,
        c.view.selectAllOnLoad === !0
      )).items.map((se) => se.id);
      Ze(
        (se) => new Set([...se].filter((Ae) => Q.includes(Ae)))
      );
      const Ne = ci(Q, I, H);
      Ve(Ne), Je.current || Le(Ne, !1);
    } catch {
    }
  }
  function qo(c) {
    const b = wt.current;
    if (wt.current = null, ie || ee || !q || !Y) return;
    const A = b ?? q.view.objectFilter, I = Dr(
      A,
      Y.view.objectFilter
    ) ? Y.view.objectFilter : A, H = ze({ ...c, page: 1 }), $ = {
      ...q,
      view: {
        ...q.view,
        filter: H,
        objectFilter: I
      }
    }, Q = xt($) !== xt(Y), Ne = Q ? $ : Y;
    Ge(Q ? $ : null), Bt(Q ? "" : "Review queue defaults restored."), Qr(Ne, H, !0);
  }
  function To() {
    if (ie || ee || !Y) return;
    wt.current = null;
    const c = ze({
      ...Y.view.filter,
      page: 1
    });
    Ge(null), Bt("Review queue defaults restored."), Qr(
      Y,
      c,
      Y.view.startFrom !== "beginning"
    );
  }
  function Ro() {
    ie || ee || !q || !Y || !g || gn(
      t.map(
        (c) => c.id === W ? {
          ...c,
          view: {
            ...q.view,
            filter: { ...ne, page: 1 }
          }
        } : c
      )
    ).then(() => {
      Ge(null), Bt("Queue saved to this review.");
    }).catch(
      (c) => tr(
        c instanceof Error ? c.message : "Could not save queue."
      )
    );
  }
  function ko() {
    Ze(/* @__PURE__ */ new Set()), Mt.current.clear(), Ve(null);
  }
  function ni(c) {
    return q ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: ie || ee,
        "aria-label": `Review queue pagination ${c}`,
        children: /* @__PURE__ */ n(
          Oi,
          {
            filter: {
              ...ne,
              page: Number(ne.page) || 1,
              perPage: Number(ne.perPage) || 40
            },
            totalCount: Ee.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${c}`,
            onFilterChange: (b) => {
              ie || ee || b.page === Number(ne.page) || ys(
                { ...ne, page: b.page },
                q,
                (A, I) => Ft(A, I, !1, Oe),
                ko
              );
            }
          }
        )
      }
    ) : null;
  }
  function Io(c) {
    var A, I, H;
    if (U === "tag") {
      const $ = c;
      return /* @__PURE__ */ n(
        vs,
        {
          tag: $,
          displayMode: Ut === "list" ? "list" : "grid",
          focused: $.id === pe,
          selected: Xe.has($.id),
          setRef: (Q) => {
            Q ? l.current.set($.id, Q) : l.current.delete($.id);
          },
          onFocus: () => Ve($.id),
          onToggle: () => {
            nr((Q) => Yr(Q, $.id)), Le($.id, !1);
          },
          onOpen: () => window.open(`/tag/${$.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        $.id
      );
    }
    const b = c;
    return /* @__PURE__ */ n(
      Ss,
      {
        video: ls(b, J, Ye.ids),
        showTagBins: ((I = (A = J == null ? void 0 : J.presentation) == null ? void 0 : A.annotations) == null ? void 0 : I.includes("tags")) && !!((H = J.presentation.annotationParents) != null && H.length),
        displayMode: Ut,
        focused: b.id === pe,
        selected: Xe.has(b.id),
        setRef: ($) => {
          $ ? l.current.set(b.id, $) : l.current.delete(b.id);
        },
        onFocus: () => Ve(b.id),
        onToggle: () => nr(($) => Yr($, b.id)),
        onPreview: () => {
          Ve(b.id), Dt(!0);
        },
        onNavigate: e
      },
      b.id
    );
  }
}
function ys(e, t, r, i) {
  i(), r(t, e).catch(() => {
  });
}
function Yr(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function ws(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function vs({
  tag: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: o,
  onFocus: s,
  onToggle: a,
  onOpen: p,
  onNavigate: d
}) {
  return /* @__PURE__ */ n(
    "article",
    {
      ref: o,
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${e.name}${i ? ", selected" : ""}`,
      onFocus: s,
      onClick: (f) => {
        s(), f.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        Do,
        {
          tag: e,
          selected: i,
          onSelect: a,
          onClick: p,
          onNavigate: d
        }
      ) : /* @__PURE__ */ u("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "aria-label": i ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": i,
            onClick: (f) => {
              f.stopPropagation(), a();
            },
            children: i ? "✓" : ""
          }
        ),
        /* @__PURE__ */ n("button", { type: "button", className: "dq-tag-list-name", onClick: p, children: e.name }),
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
function Ss({
  video: e,
  showTagBins: t,
  displayMode: r,
  focused: i,
  selected: o,
  setRef: s,
  onFocus: a,
  onToggle: p,
  onPreview: d,
  onNavigate: f
}) {
  var O, w;
  const h = bo(e), S = P(null), C = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, v = !!(C.date || C.studioName), y = !!(C.performers.length || C.tags.length);
  return Ri(() => {
    const R = S.current;
    if (!R) return;
    const F = R.querySelector(
      `a[href="/video/${e.id}"]`
    ), te = R.querySelector(".card-title"), ae = `dq-card-title-${e.id}`;
    te && (te.id = ae), F && (F.target = "_blank", F.rel = "noreferrer", F.removeAttribute("aria-label"), F.setAttribute("aria-labelledby", ae), F.classList.add("dq-card-link"));
    const qe = R.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    qe && qe.setAttribute(
      "aria-label",
      o ? `Deselect ${h}` : `Select ${h}`
    );
    const g = R.querySelector(
      'button[title="Quick View"]'
    );
    g && g.setAttribute("aria-label", `Preview ${h}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (R) => {
        S.current = R, s(R);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${h}${o ? ", selected" : ""}`,
      onFocus: a,
      onClick: (R) => {
        a(), R.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${r} ${v ? "has-card-metadata" : "no-card-metadata"} ${y ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          Uo,
          {
            video: C,
            selected: o,
            onSelect: p,
            onNavigate: f,
            onQuickView: d,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ u("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (O = e.tags) == null ? void 0 : O.map((R) => /* @__PURE__ */ n("span", { children: R.name }, R.id)),
          !((w = e.tags) != null && w.length) && /* @__PURE__ */ n("small", { children: "No matching tags" })
        ] }),
        r === "wall" && /* @__PURE__ */ n(Cs, { video: e })
      ]
    }
  );
}
function Cs({ video: e }) {
  const t = P(null), r = P(null), [i, o] = E(!1), [s, a] = E(!1), [p, d] = E(!1);
  return z(() => {
    const f = t.current;
    if (!f || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), a(!0);
      return;
    }
    const h = new IntersectionObserver(
      ([C]) => o(C.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), S = new IntersectionObserver(
      ([C]) => a(C.isIntersecting && C.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return h.observe(f), S.observe(f), () => {
      h.disconnect(), S.disconnect();
    };
  }, [e.id, e.files.length]), z(() => {
    if (!i) {
      d(!1);
      return;
    }
    const f = new AbortController();
    return V(ya(e.id), {
      signal: f.signal
    }).then((h) => {
      f.signal.aborted || d(h.available === !0);
    }).catch(() => {
      f.signal.aborted || d(!1);
    }), () => f.abort();
  }, [i, e.id]), z(() => {
    const f = r.current;
    f && (s ? Promise.resolve(f.play()).catch(() => {
    }) : f.pause());
  }, [p, s]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: p && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: ba(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Es({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: o,
  error: s,
  canWrite: a,
  assessmentReady: p,
  selected: d,
  hasPrevious: f,
  hasNext: h,
  onToggleSelected: S,
  onPrevious: C,
  onNext: v,
  onClose: y,
  onAction: O
}) {
  const w = P(null), R = P(null), F = e.files[0], te = bo(e);
  z(() => {
    var x;
    const g = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (x = w.current) == null || x.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = g;
    };
  }, []);
  function ae(g) {
    var re, Se, j;
    if (g.key !== "Tab") return;
    const x = [
      ...((re = w.current) == null ? void 0 : re.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((Z) => Z.offsetParent !== null);
    if (!x.length) {
      g.preventDefault(), (Se = w.current) == null || Se.focus();
      return;
    }
    const M = x.indexOf(
      document.activeElement
    );
    g.shiftKey && M <= 0 ? (g.preventDefault(), (j = x.at(-1)) == null || j.focus()) : !g.shiftKey && M === x.length - 1 && (g.preventDefault(), x[0].focus());
  }
  function qe(g) {
    if (g.defaultPrevented || g.ctrlKey || g.metaKey || g.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const x = g.key === "ArrowLeft" || g.key === "ArrowRight";
    if (g.altKey && !x) return;
    const M = R.current, re = g.currentTarget.querySelector("video");
    if (g.key === "Enter" || g.key === "Escape")
      g.repeat || y();
    else if (g.key === " " && M)
      g.repeat || M.toggle();
    else if (x && M)
      M.seekBy(
        (g.key === "ArrowLeft" ? -1 : 1) * (g.shiftKey ? 5 : g.altKey ? 10 : 60)
      );
    else if ((g.key === "," || g.key === ".") && M) {
      const Se = [F == null ? void 0 : F.duration, re == null ? void 0 : re.duration].find(
        (Z) => Z != null && Number.isFinite(Z) && Z > 0
      ) ?? 0, j = e.parentVideoId != null ? (e.clipEndSec ?? Se) - (e.clipStartSec ?? 0) : Se;
      Number.isFinite(j) && j > 0 && M.seekBy((g.key === "," ? -1 : 1) * j * 0.1);
    } else if (g.key.toLowerCase() === "n" || g.key.toLowerCase() === "m")
      !g.repeat && !i && !o && (g.key.toLowerCase() === "n" && f && C(), g.key.toLowerCase() === "m" && h && v());
    else if (g.key === "ArrowUp" && re)
      re.volume = Math.min(1, re.volume + 0.1);
    else if (g.key === "ArrowDown" && re)
      re.volume = Math.max(0, re.volume - 0.1);
    else return;
    At(g);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: w,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${te}`,
      className: "dq-preview",
      onKeyDown: ae,
      onKeyDownCapture: qe,
      onMouseDown: (g) => {
        g.target === g.currentTarget && y();
      },
      children: /* @__PURE__ */ u("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ u("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !f || i || o,
              onClick: C,
              children: /* @__PURE__ */ n(xi, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !h || i || o,
              onClick: v,
              children: /* @__PURE__ */ n(_i, {})
            }
          ),
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: te }),
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
              onClick: S,
              disabled: o,
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
              "aria-label": `Open ${te} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ n(Vo, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: y,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(Di, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: F ? /* @__PURE__ */ n(
          Mi,
          {
            autostart: !0,
            streamUrl: kn("video", e.id),
            posterUrl: mi(e),
            format: F.format,
            audioCodec: F.audioCodec,
            duration: F.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (g) => (R.current = g, () => {
              R.current === g && (R.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: mi(e), alt: "" }) }),
        s && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: s }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((g, x) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: i || o || g.steps.length > 0 && !a || zt(g) && !p,
            onClick: () => void O(g),
            children: [
              or(g, x) && /* @__PURE__ */ n("kbd", { children: or(g, x) }),
              g.label
            ]
          },
          g.id
        )) })
      ] })
    }
  );
}
function Ns({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: i = !1,
  onEditWorkspace: o,
  onSave: s,
  onChoose: a,
  onClose: p
}) {
  const [d, f] = E(
    () => i && t ? structuredClone(t) : null
  ), [h, S] = E(""), [C, v] = E(!1), [y, O] = E(
    i && t != null
  ), w = P(null);
  z(() => {
    var M, re;
    const g = document.activeElement, x = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (re = (M = w.current) == null ? void 0 : M.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || re.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = x, g == null || g.focus({ preventScroll: !0 });
    };
  }, []);
  function R(g) {
    var re, Se, j;
    if (g.defaultPrevented) {
      g.stopPropagation();
      return;
    }
    if (g.key === "Escape") {
      At(g), C || p();
      return;
    }
    if (g.key !== "Tab") {
      g.stopPropagation();
      return;
    }
    const x = [
      ...((re = w.current) == null ? void 0 : re.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((Z) => Z.offsetParent !== null);
    if (!x.length) {
      At(g), (Se = w.current) == null || Se.focus();
      return;
    }
    const M = x.indexOf(
      document.activeElement
    );
    g.shiftKey && M <= 0 ? (At(g), (j = x.at(-1)) == null || j.focus()) : !g.shiftKey && M === x.length - 1 ? (At(g), x[0].focus()) : g.stopPropagation();
  }
  function F(g, x = !!g) {
    O(x), f(
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
    ), S("");
  }
  async function te() {
    if (C) return;
    if (!d || en(d)) {
      S(d ? en(d) : "Choose a review.");
      return;
    }
    const g = { ...d, name: d.name.trim() }, x = e.some((M) => M.id === g.id) ? e.map((M) => M.id === g.id ? g : M) : [...e, g];
    v(!0), S("");
    try {
      if (!await s(x)) throw new Error("Could not save reviews.");
      !e.some((M) => M.id === g.id) && g.entityType !== "tag" ? o(g.id) : (a(g.id), p());
    } catch (M) {
      S(
        "Could not save reviews. Your edits are still open. " + (M instanceof Error ? M.message : "Retry saving.")
      );
    } finally {
      v(!1);
    }
  }
  async function ae(g) {
    if (!C) {
      v(!0), S("");
      try {
        if (!await s(g)) throw new Error("Could not save reviews.");
      } catch (x) {
        S(
          x instanceof Error ? x.message : "Could not save reviews."
        );
      } finally {
        v(!1);
      }
    }
  }
  async function qe(g) {
    var M;
    if (C) return;
    const x = (M = g.target.files) == null ? void 0 : M[0];
    if (g.target.value = "", !!x) {
      if (x.size > 2e6) {
        S("Review files must be smaller than 2 MB.");
        return;
      }
      v(!0), S("");
      try {
        const re = Ur(await x.text());
        if (!await s(An(e, re)))
          throw new Error("Could not save reviews.");
      } catch (re) {
        S(
          re instanceof Error ? re.message : "Could not import reviews."
        );
      } finally {
        v(!1);
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
      onKeyDown: R,
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
              disabled: C,
              onClick: p,
              children: /* @__PURE__ */ n(Di, {})
            }
          )
        ] }),
        h && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: h }),
        /* @__PURE__ */ n("fieldset", { disabled: C, className: "dq-manager-content", children: d ? /* @__PURE__ */ n(
          Co,
          {
            setup: d.entityType !== "tag" && !e.some((g) => g.id === d.id),
            draft: d,
            entityTypeLocked: y,
            tagGroups: r,
            saving: C,
            setDraft: f,
            onSave: () => void te(),
            onCancel: p
          }
        ) : /* @__PURE__ */ u(ve, { children: [
          /* @__PURE__ */ u("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: () => {
              const g = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), x = document.createElement("a");
              x.href = g, x.download = "data-quality-reviews.json", x.click(), URL.revokeObjectURL(g);
            }, children: "Export reviews" }),
            /* @__PURE__ */ u(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => F(),
                children: [
                  /* @__PURE__ */ n(Jo, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ u("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(Qo, {}),
              " Import reviews",
              /* @__PURE__ */ n(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: qe
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((g) => /* @__PURE__ */ u("article", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ u("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(ho, { entityType: Me(g) }),
                /* @__PURE__ */ n("strong", { children: g.name })
              ] }),
              /* @__PURE__ */ n("p", { children: g.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => g.entityType === "tag" || Me(g) === "video" && g.view.reviewMode === "multiple" ? F(g) : o(g.id), children: [
              /* @__PURE__ */ n(Li, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => F({
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
                  window.confirm(`Delete review “${g.name}”?`) && ae(
                    e.filter((x) => x.id !== g.id)
                  );
                },
                children: /* @__PURE__ */ n(Ui, {})
              }
            )
          ] }, g.id)) })
        ] }) })
      ] })
    }
  );
}
function Co({
  workspace: e = !1,
  setup: t = !1,
  draft: r,
  entityTypeLocked: i,
  tagGroups: o,
  saving: s = !1,
  setDraft: a,
  onSave: p,
  onCancel: d
}) {
  const [f, h] = E("Review"), S = Me(r), C = ce(r), v = (w) => {
    if (!(i || w === S)) {
      if (w === "performerOccurrence" || w === "audioPerformerOccurrence") {
        a({
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
  }, y = P(/* @__PURE__ */ new WeakMap()), O = (w) => {
    let R = y.current.get(w);
    return R || (R = crypto.randomUUID(), y.current.set(w, R)), R;
  };
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      jo,
      {
        tabs: (t ? ["Review"] : e ? ["Review", ...S === "video" ? ["Appearance"] : [], "Actions", ...C ? ["Tag choices"] : []] : C ? ["Review", "Queue", "Actions", ...r.occurrence.tagIds.length ? ["Tag choices"] : []] : S === "audio" ? ["Review", "Queue", "Actions"] : ["Review", "Queue", "Appearance", "Actions"]).map((w) => ({
          key: w,
          label: w,
          count: w === "Actions" ? r.actions.length : void 0,
          disabled: s
        })),
        activeTab: f,
        onTabChange: h
      }
    ) }),
    /* @__PURE__ */ u("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ u("section", { hidden: f !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ u("label", { children: [
          "Entity type",
          /* @__PURE__ */ u(
            "select",
            {
              "aria-label": "Entity type",
              value: S,
              disabled: i,
              onChange: (w) => v(w.target.value),
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
              onChange: (w) => a({ ...r, name: w.target.value })
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
              onChange: (w) => a({ ...r, description: w.target.value })
            }
          )
        ] }),
        C && !t && /* @__PURE__ */ n(
          Xa,
          {
            review: r,
            onChange: a
          }
        )
      ] }),
      !e && !t && /* @__PURE__ */ u("section", { hidden: f !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ n(Ci, { draft: r, onChange: a, presentation: !1 }),
        C && /* @__PURE__ */ n(vi, { review: r, onChange: a })
      ] }),
      !t && C && /* @__PURE__ */ n("section", { hidden: f !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n(vi, { review: r, onChange: a, choices: !0 }) }),
      !t && S !== "audio" && !C && (!e || S === "video") && /* @__PURE__ */ n("section", { hidden: f !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(Ci, { draft: r, onChange: a, queue: !1 }) }),
      !t && /* @__PURE__ */ n("section", { hidden: f !== "Actions", className: "dq-editor-section", children: S === "tag" ? /* @__PURE__ */ n(
        qs,
        {
          draft: r,
          saving: s,
          tagGroups: o,
          setDraft: a
        }
      ) : /* @__PURE__ */ n(
        As,
        {
          draft: r,
          saving: s,
          stepKey: O,
          rememberStepKey: (w, R) => y.current.set(w, O(R)),
          setDraft: a
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
            ), R = document.createElement("a");
            R.href = w, R.download = "data-quality-review.json", R.click(), URL.revokeObjectURL(w);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: d, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: p, children: t ? "Create & configure" : "Save review" })
    ] })
  ] });
}
function Eo({
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
function As({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: i,
  setDraft: o
}) {
  const [s, a] = E(!1), [p, d] = E(null), f = P(null), h = Fo(), S = () => {
    a(!1), requestAnimationFrame(() => {
      var v;
      return (v = f.current) == null ? void 0 : v.focus();
    });
  }, C = (v, y) => o({
    ...e,
    actions: e.actions.map(
      (O, w) => w === v ? y : O
    )
  });
  return /* @__PURE__ */ u(ve, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    ce(e) && /* @__PURE__ */ u("p", { children: [
      "Actions apply only to the active performer in this ",
      yt(le(e)).one,
      ". Set performer matching in the review filters below. Save review keeps those criteria with this rule."
    ] }),
    /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails. Removing tags and descendants never removes a tag the same action adds." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      Cn,
      {
        items: e.actions,
        getKey: (v) => v.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (v) => o({ ...e, actions: v }),
        renderItem: (v, { index: y, dragHandleProps: O, isOver: w }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: w ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ u("legend", { children: [
                "Action ",
                y + 1
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...O,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${y + 1}`,
                    children: /* @__PURE__ */ n(Dn, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: v.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => o({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, y + 1),
                        {
                          ...structuredClone(v),
                          id: crypto.randomUUID(),
                          label: v.label + " copy"
                        },
                        ...e.actions.slice(y + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                Eo,
                {
                  action: v,
                  onChange: (R) => C(y, R)
                }
              ),
              /* @__PURE__ */ n(
                Cn,
                {
                  items: v.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (R) => C(y, { ...v, steps: R }),
                  renderItem: (R, F) => /* @__PURE__ */ n(
                    Ts,
                    {
                      dragHandleProps: F.dragHandleProps,
                      saving: t,
                      isOver: F.isOver,
                      step: R,
                      index: F.index,
                      onChange: (te) => {
                        i(te, R), C(y, {
                          ...v,
                          steps: v.steps.map(
                            (ae, qe) => qe === F.index ? te : ae
                          )
                        });
                      },
                      onRemove: () => C(y, {
                        ...v,
                        steps: v.steps.filter(
                          (te, ae) => ae !== F.index
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
                    onClick: () => C(y, {
                      ...v,
                      steps: [...v.steps, { mode: "ADD", tagIds: [] }]
                    }),
                    children: "Add step"
                  }
                ),
                /* @__PURE__ */ n(
                  "button",
                  {
                    className: "dq-button",
                    type: "button",
                    onClick: () => o({
                      ...e,
                      actions: e.actions.filter(
                        (R, F) => F !== y
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
    /* @__PURE__ */ u("div", { className: "dq-row dq-add-actions", children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => o({
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
          ref: f,
          className: "dq-button",
          type: "button",
          "aria-expanded": s,
          "aria-controls": s ? h : void 0,
          disabled: t,
          onClick: () => {
            d(null), a(!s);
          },
          children: "Add actions from parent tags…"
        }
      ),
      /* @__PURE__ */ n("span", { role: "status", className: "dq-editor-note", children: (p == null ? void 0 : p.actions) === e.actions ? `Added ${p.count} action${p.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    s && /* @__PURE__ */ n(
      ss,
      {
        id: h,
        review: e,
        disabled: t,
        onAdd: (v) => {
          const y = [...e.actions, ...v];
          o({ ...e, actions: y }), d({ actions: y, count: v.length }), S();
        },
        onCancel: S
      }
    )
  ] });
}
function qs({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: i
}) {
  const o = (s, a) => i({
    ...e,
    actions: e.actions.map(
      (p, d) => d === s ? a : p
    )
  });
  return /* @__PURE__ */ u(ve, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      Cn,
      {
        items: e.actions,
        getKey: (s) => s.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (s) => i({ ...e, actions: s }),
        renderItem: (s, { index: a, dragHandleProps: p, isOver: d }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: d ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ u("legend", { children: [
                "Action ",
                a + 1
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...p,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${a + 1}`,
                    children: /* @__PURE__ */ n(Dn, {})
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
                Eo,
                {
                  action: s,
                  onChange: (f) => o(a, f)
                }
              ),
              /* @__PURE__ */ u("label", { children: [
                "Action effect",
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: s.effect.mode === "SET_TAG_GROUP" ? `group:${s.effect.tagGroupId}` : s.effect.mode,
                    onChange: (f) => {
                      const h = f.target.value;
                      o(a, {
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
                        (f) => f.id === s.effect.tagGroupId
                      ) && /* @__PURE__ */ n(
                        "option",
                        {
                          value: `group:${s.effect.tagGroupId}`,
                          disabled: !0,
                          children: "Unavailable tag group"
                        }
                      ),
                      r.map((f) => /* @__PURE__ */ n("option", { value: `group:${f.id}`, children: f.name }, f.id))
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
                      (f, h) => h !== a
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
function Ts({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: i,
  isOver: o,
  onChange: s,
  onRemove: a
}) {
  const p = vo(e.mode);
  return /* @__PURE__ */ u(
    "div",
    {
      className: o ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": p,
      children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            ...r,
            disabled: i,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${t + 1}`,
            children: /* @__PURE__ */ n(Dn, {})
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
          Tt,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (d) => s({ ...e, tagIds: d }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: a, children: /* @__PURE__ */ n(Ui, {}) })
      ]
    }
  );
}
async function Rs() {
  const e = await V("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const a = JSON.parse(r);
      Array.isArray(a.reviews) && (i = JSON.stringify(a.reviews, null, 2));
    } catch {
    }
  const o = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), s = document.createElement("a");
  s.href = o, s.download = "data-quality-browser-recovery.json", s.click(), URL.revokeObjectURL(o);
}
function qi({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(ji, { className: "dq-spin" }),
    e
  ] });
}
function Ti({
  message: e,
  onRetry: t,
  retryLabel: r = "Retry"
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(En, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: r })
  ] });
}
const $s = { components: { DataQualityPage: bs } };
export {
  bs as DataQualityPage,
  $s as default,
  Dr as objectFiltersEqual
};
