import { jsxs as c, jsx as r, Fragment as ce } from "react/jsx-runtime";
import { useState as N, useRef as P, useEffect as z, useMemo as ze, useId as ar, useLayoutEffect as nr, useSyncExternalStore as Sa, useCallback as an } from "react";
import { EntityReferenceMultiSelector as xt, useExtensionKeyboardBindings as Na, useRegisterExtensionKeyboardActions as Ea, DetailListToolbar as rr, AUDIO_CRITERIA as hi, VIDEO_CRITERIA as Rr, PERFORMER_CRITERIA as mi, NarrativeText as qa, AUDIO_SORT_OPTIONS as ho, VIDEO_SORT_OPTIONS as gi, AudioPlayer as Ca, VideoPlayer as mo, formatDuration as go, FilterDialog as bo, getResolutionLabel as Aa, useCustomFieldFilterSection as ka, TAG_SORT_OPTIONS as yo, TAG_CRITERIA as wo, DetailListPagination as Ta, EntityDetailTabs as Ra, TagTile as Ia, VideoCard as Oa, SortableList as Hr } from "@cove/runtime/components";
import { Search as bi, Layers as Ma, Ban as Yr, Pin as $a, RefreshCw as Pa, Flag as Xr, Tags as Fa, Headphones as vo, Film as Nr, ChevronLeft as Ir, Pencil as Or, RectangleHorizontal as xa, LayoutGrid as La, MoreHorizontal as Da, ChevronRight as yi, Users as _a, ChevronDown as ja, Save as So, RotateCcw as No, ExternalLink as Eo, Tag as Ua, SkipForward as Ka, AlertTriangle as Zr, Settings as Ba, Loader2 as qo, X as Co, Plus as Ga, Upload as Va, Trash2 as Ao, GripVertical as wi } from "@cove/runtime/lucide-react";
import { extensionFetch as Ja } from "@cove/runtime/api";
const Mr = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, $r = Object.keys(
  Mr
);
function _n(e) {
  return e === "excludes" || e === "excludesAll";
}
function vi(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
const za = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function de(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function Zn(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function he(e) {
  return Zn(Me(e));
}
function ko(e) {
  return Me(e) === "video";
}
function Me(e) {
  return e.entityType ?? "video";
}
const Cn = [
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
function Er(e) {
  return de(e) && !Ro(e.occurrence) ? "Complete the optional occurrence condition before saving." : !ko(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Me(e) !== "tag" && e.actions.some(
    (t) => To(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => An(t, Me(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const Qa = {
  video: 1e3,
  audio: 250
};
function et(e, t = "video") {
  const n = (i, o) => Number.isFinite(Number(i)) && Number(i) > 0 ? Math.floor(Number(i)) : o;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(Qa[t], n(e.perPage, 40))
    )
  };
}
function Bi(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function $t(e) {
  const { page: t, ...n } = e.view.filter, i = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    de(e) ? [e.entityType, ...i, e.occurrence] : Me(e) === "video" ? i : [Me(e), ...i]
  );
}
function An(e, t) {
  const n = t ?? ("effect" in e ? "tag" : "video");
  return e.label.trim() ? n === "tag" ? !("effect" in e) || "steps" in e || !e.effect || typeof e.effect != "object" ? !1 : ["SET_TAG_GROUP", "CLEAR_TAG_GROUP", "SKIP"].includes(
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
  ) && !To(e) : !1;
}
function Wa(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function Qt(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function Pr(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function cn(e) {
  return "steps" in e ? e.steps.some((t) => Qt(t.mode)) : !1;
}
function To(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (Qt(n.mode))
      for (const i of n.tagIds) {
        const o = t.get(i);
        if (o && o !== n.mode) return !0;
        t.set(i, n.mode);
      }
  return !1;
}
function sr(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || za.includes(n.entityType)) && (!Wa(n.entityType) || Ro(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && Ha(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(n.actions) && n.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (n.entityType === "tag" ? "effect" in i && !("steps" in i) && An(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (o) => o && Array.isArray(o.tagIds)
      ) && An(i, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => Er(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Ha(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (i) => ["date", "studio", "performers", "tags"].includes(i)
  )) && [n.annotationParents, n.binParents].every(
    (i) => i === void 0 || Array.isArray(i) && i.every((o) => Number.isSafeInteger(o) && o > 0)
  );
}
function ei(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const o of i)
      n.has(o.id) || (n.add(o.id), t.push(o));
  return t;
}
function Ro(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (i) => Array.isArray(i) && i.every((o) => Number.isSafeInteger(o) && o > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && $r.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function Gi(e, t) {
  return e.size > 0 ? [...e].sort((n, i) => n - i) : t == null ? [] : [t];
}
function Vi(e, t, n, i) {
  if (t.length === 0) return null;
  if (n == null) return t[0];
  if (!i && t.includes(n)) return n;
  const o = Math.max(0, e.indexOf(n));
  if (i) {
    for (const s of e.slice(o + 1))
      if (t.includes(s)) return s;
    if (t.includes(n)) {
      for (const s of e.slice(0, o).reverse())
        if (t.includes(s)) return s;
      return n;
    }
  }
  return t[Math.min(o, t.length - 1)];
}
function Ji(e, t) {
  const n = new Set(e), i = t.length > 0 && t.every((o) => n.has(o));
  for (const o of t)
    i ? n.delete(o) : n.add(o);
  return n;
}
function Ya(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function Xa(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-actions, .dq-pagination-row, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Za(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function es(e, t) {
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
const Io = "ext:com.midnightrider.data-quality:configuration", ts = "ext:cove-data-quality:video-reviews", ti = "ext:com.midnightrider.data-quality:progress", cr = /* @__PURE__ */ new Map(), yr = /* @__PURE__ */ new Map(), En = (e, t) => e.includes("*") || e.includes(t), qr = (e) => ee(`/api/savedfilters?mode=${encodeURIComponent(e)}`), ns = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function ni(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Ln(e) {
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
    reviews: sr(JSON.stringify(t.reviews)),
    deletedIds: ni(t.deletedIds),
    importedIds: ni(t.importedIds)
  };
}
function rs(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const i = /* @__PURE__ */ new Set();
  for (const o of t) {
    const s = localStorage.getItem(o);
    if (s !== null) {
      const a = sr(s);
      n ?? (n = a), a.forEach((p) => i.add(p.id));
    }
    ni(
      JSON.parse(localStorage.getItem(`${o}:account-imports`) ?? "[]")
    ).forEach((a) => i.add(a));
  }
  return {
    reviews: n ?? [],
    known: [...i],
    present: n !== void 0
  };
}
async function Oo(e) {
  const t = await ee("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Mo(e, t) {
  const n = (yr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return yr.set(e, n), n.finally(() => {
    yr.get(e) === n && yr.delete(e);
  }).catch(() => {
  }), n;
}
let Yn = null;
function is() {
  if (Yn) return Yn;
  const e = os();
  return Yn = e, e.finally(() => {
    Yn === e && (Yn = null);
  }).catch(() => {
  }), e;
}
async function os() {
  var y;
  const e = await ee("/api/auth/me"), t = String(e.user.id), n = `cove-data-quality-v2:${t}`, i = En(e.permissions, "savedfilters.read"), o = i && En(e.permissions, "savedfilters.write"), s = i ? (await qr(Io)).filter((w) => w.name === "Data Quality configuration").sort((w, S) => w.id - S.id) : [];
  if (s.length > 1) {
    const w = (S) => {
      const { revision: q, ...m } = Ln(S.uiOptions);
      return JSON.stringify(m);
    };
    if (s.some((S) => w(S) !== w(s[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (o)
      for (const S of s.slice(1))
        await ee(`/api/savedfilters/${S.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${S.id}` })
        });
    s.splice(1);
  }
  let a = s.length ? Ln(s[0].uiOptions) : ns();
  const p = localStorage.getItem(`${n}:migrated`) === "true", l = localStorage.getItem(n), d = localStorage.getItem(`${n}:local-only`) === "true";
  !s.length && l && (a = Ln(l));
  let g = !s.length;
  if (s.length && d && l) {
    const w = Ln(l);
    if (w.reviews.some((q) => {
      const m = a.reviews.find((R) => R.id === q.id);
      return m && JSON.stringify(m) !== JSON.stringify(q);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const S = [
      .../* @__PURE__ */ new Set([...a.deletedIds, ...w.deletedIds])
    ];
    a = {
      ...a,
      reviews: ei(a.reviews, w.reviews).filter(
        (q) => !S.includes(q.id)
      ),
      deletedIds: S,
      importedIds: [
        .../* @__PURE__ */ new Set([...a.importedIds, ...w.importedIds])
      ]
    }, g = !0;
  }
  if (!p) {
    const w = JSON.stringify(a), S = rs(t);
    if (s.length && S.reviews.some((E) => {
      const L = a.reviews.find((K) => K.id === E.id);
      return L && JSON.stringify(L) !== JSON.stringify(E);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const q = i ? (await qr(ts)).flatMap(
      (E) => sr(E.uiOptions ?? "[]")
    ) : [], m = S.known.filter(
      (E) => !S.reviews.some((L) => L.id === E)
    ), R = /* @__PURE__ */ new Set([...a.deletedIds, ...m]);
    a = {
      ...a,
      reviews: ei(
        S.reviews,
        a.reviews,
        q.filter(
          (E) => !S.known.includes(E.id) && !a.importedIds.includes(E.id)
        )
      ).filter((E) => !R.has(E.id)),
      deletedIds: [...R],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...a.importedIds,
          ...S.known,
          ...q.map((E) => E.id)
        ])
      ]
    }, g || (g = JSON.stringify(a) !== w);
  }
  const h = {
    userId: t,
    recordId: (y = s[0]) == null ? void 0 : y.id,
    config: a,
    readable: i,
    writable: o,
    durable: o
  };
  if (cr.set(n, h), g && o) {
    const w = a;
    s.length && (h.config = Ln(s[0].uiOptions)), await $o(n, w), a = h.config;
  } else s.length || (localStorage.setItem(n, JSON.stringify(a)), !i && (!p || d) && localStorage.setItem(`${n}:local-only`, "true"));
  if (!i) localStorage.setItem(`${n}:migrated`, "true");
  else if (o)
    try {
      localStorage.setItem(`${n}:migrated`, "true");
    } catch {
    }
  return {
    reviews: a.reviews,
    storageKey: n,
    canWrite: En(e.permissions, "videos.write"),
    canWriteVideos: En(e.permissions, "videos.write"),
    canWriteAudios: En(e.permissions, "audios.write"),
    canWriteTags: En(e.permissions, "tags.write"),
    canReadTagGroups: En(e.permissions, "taggroups.read"),
    canConfigure: !i || o,
    storageNotice: i ? o ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function $o(e, t) {
  const n = cr.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await Oo(n), n.recordId != null) {
      const s = await ee(
        `/api/savedfilters/${n.recordId}`
      );
      if (Ln(s.uiOptions).revision !== n.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const o = await ee(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Io,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(i)
        })
      }
    );
    n.recordId = o.id;
  } else
    localStorage.setItem(e, JSON.stringify(i)), localStorage.setItem(`${e}:local-only`, "true");
  if (n.config = i, n.durable)
    try {
      localStorage.setItem(e, JSON.stringify(i)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function as(e, t) {
  return sr(JSON.stringify(t)), Mo(e, async () => {
    const n = cr.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const i = n.config.reviews.filter((o) => !t.some((s) => s.id === o.id)).map((o) => o.id);
    await $o(e, {
      ...n.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...i])
      ].filter((o) => !t.some((s) => s.id === o))
    });
  });
}
function zi(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, i]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(i)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function ss(e, t) {
  const n = cr.get(e);
  if (!n) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), o = i ? zi(i) : null;
  if (!n.readable) return o;
  const s = (await qr(ti)).find(
    (p) => p.name === t
  ), a = s ? zi(s.uiOptions) : null;
  return o && (!a || o.updatedAt > a.updatedAt) ? o : a;
}
function cs(e, t, n) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(n));
  } catch {
  }
  return Mo(i, async () => {
    const o = cr.get(e);
    if (!(o != null && o.writable)) return;
    await Oo(o);
    const s = (await qr(ti)).find(
      (a) => a.name === t
    );
    await ee(
      s ? `/api/savedfilters/${s.id}` : "/api/savedfilters",
      {
        method: s ? "PUT" : "POST",
        body: JSON.stringify({
          mode: ti,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function ln(e) {
  return e === "audio" ? "audios" : "videos";
}
const ls = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function wt(e) {
  return ls[e];
}
const Cr = "confirmed_absent_tags", Si = "Confirmed absent tags", Fr = "confirmed_absent_occurrence_tags", Po = {
  key: Cr,
  label: Si,
  type: "tag",
  subject: "tag assessments"
}, Ni = {
  key: Fr,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, ds = {
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
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? ds[n] ?? n : t === "key" && typeof n == "string" && [
        Cr,
        Fr
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Wt(n)
    ])
  ) : e;
}
async function Fo(e, t, n) {
  const i = new Headers(t.headers);
  !(t.body instanceof FormData) && !i.has("Content-Type") && i.set("Content-Type", "application/json");
  const o = await Ja(e, { ...t, headers: i });
  if (o.status === 404 && n === "null") return null;
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
async function ee(e, t = {}) {
  return await Fo(e, t, "fail");
}
function us(e, t = {}) {
  return Fo(e, t, "null");
}
const fs = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let ps = 0;
function ri(e, t) {
  return ee(
    `/api/${ln(e)}/${t}?dqRead=${fs}-${++ps}`,
    { cache: "no-store" }
  );
}
function xo(e, t) {
  const n = { ...e.view.objectFilter }, i = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Wt({
      findFilter: et(t, he(e)),
      objectFilter: n,
      filterExpression: i
    })
  );
}
async function er(e, t, n) {
  return ee(
    `/api/${ln(he(e))}/find`,
    { method: "POST", signal: n, body: xo(e, t) }
  );
}
async function hs(e, t, n) {
  return (await ee(
    `/api/${ln(he(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: xo(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function Qi(e, t, n) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, ee("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Wt({
        findFilter: et(t),
        objectFilter: i
      })
    )
  });
}
function ms(e) {
  return ee("/api/taggroups", { signal: e });
}
function ii(e, t, n = 1280) {
  return `/api/${ln(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function oi(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Wi(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function gs(e) {
  return `/api/stream/video/${e}/preview`;
}
function bs(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function ys(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function xr(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const i of e) {
    await ee(`/api/tags/${i}`, { signal: t }), n.add(i);
    for (let o = 1; ; o++) {
      const s = await ee("/api/tags/find", {
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
      for (const a of s.items) n.add(a.id);
      if (o * 1e3 >= s.totalCount) break;
      if (!s.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...n];
}
async function Ei(e, t) {
  const n = Pr(e);
  return (await Promise.all(
    e.steps.map(
      async (o) => o.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await xr(o.tagIds, t)).filter(
          (s) => !n.has(s)
        )
      } : o
    )
  )).filter((o) => o.tagIds.length > 0);
}
function ws(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function qi(e, t) {
  const i = (await ee("/api/custom-fields")).find(
    (s) => s.key.toLowerCase() === e.key
  );
  if (!i)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const o = ws(e, i);
  return o ? { kind: "incompatible", message: o } : i.entityTypes.includes(t) ? { kind: "ready", definition: i, message: "" } : {
    kind: "missing",
    message: `Add ${wt(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: i
  };
}
async function Lo(e, t) {
  const n = await qi(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await ee(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await ee("/api/custom-fields", {
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
function Do(e = "video") {
  return qi(Po, e);
}
function vs(e = "video") {
  return Lo(Po, e);
}
function _o(e = "video") {
  return qi(Ni, e);
}
function Ss(e = "video") {
  return Lo(Ni, e);
}
function Ar(e) {
  return [...new Set(e)];
}
function jo(e, t) {
  const n = e.customFields ?? {}, i = Object.keys(n).find(
    (s) => s.toLowerCase() === Fr
  ), o = i === void 0 ? [] : n[i];
  return Ar(
    (Array.isArray(o) ? o : []).filter(
      (s) => typeof s == "string" && /^[1-9]\d*:[1-9]\d*$/.test(s)
    ).map((s) => s.split(":").map(Number)).filter(([s]) => s === t).map(([, s]) => s)
  );
}
async function Ns(e) {
  let t;
  try {
    t = await _o(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${Ni.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Es(e, t, n, i, o, s) {
  await ee(`/api/${ln(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: Ar(o).map((a) => `${i}:${a}`)
      },
      customFieldMode: s
    })
  });
}
function qs(e, t, n) {
  const i = [...e.tagIds], o = (s) => {
    if (n === null)
      throw new Error(
        `The ${Si} custom field is not available.`
      );
    return { customFields: { [n]: i }, customFieldMode: s };
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
async function Uo(e, t, n) {
  if (!An(t) || n.length === 0 || n.some((l) => !Number.isSafeInteger(l) || l <= 0))
    throw new Error(
      `Choose ${wt(e).many} and configure a valid action first.`
    );
  let i = null;
  if (cn(t)) {
    let l;
    try {
      l = await Do(e);
    } catch (d) {
      throw new Error(
        `Could not verify the ${Si} custom field. ${d instanceof Error ? d.message : "Request failed."}`
      );
    }
    if (l.kind !== "ready") throw new Error(l.message);
    i = l.definition.key;
  }
  const o = Ar(n), s = (await Ei(t)).map((l) => ({
    mode: l.mode,
    tagIds: Ar(l.tagIds)
  })), p = [
    ...s.filter((l) => !Qt(l.mode)),
    ...s.filter((l) => Qt(l.mode))
  ].map(
    (l) => qs(l, o, i)
  );
  for (let l = 0; l < p.length; l++)
    try {
      await ee(`/api/${ln(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(p[l])
      });
    } catch (d) {
      throw new Error(
        `Step ${l + 1} failed; ${l} earlier step(s) completed. Refresh and check the selected ${wt(e).many} before retrying. ${d instanceof Error ? d.message : "Request failed."}`
      );
    }
}
async function Cs(e, t) {
  if (!An(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await ee("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
function Hi({
  review: e,
  onChange: t,
  choices: n = !1
}) {
  const i = e.occurrence, o = wt(he(e)).queue, s = (a) => t({ ...e, occurrence: { ...i, ...a } });
  return n ? /* @__PURE__ */ c("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
    /* @__PURE__ */ c("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      o,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ r(
      xt,
      {
        entityType: "tag",
        values: i.tagIds,
        onChange: (a) => s({ tagIds: a }),
        placeholder: "Search review tag choices...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
      /* @__PURE__ */ r(
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
    /* @__PURE__ */ r("p", { children: "Save & next performer applies the selected tags and advances. Save choices stays on the performer. Skip only moves the cursor; eligibility comes from the filters." })
  ] }) : /* @__PURE__ */ c("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ r("legend", { children: "Occurrence condition (optional)" }),
    /* @__PURE__ */ r("p", { children: "Leave this unrestricted to review any appearance. Set performer matching in the review workspace and save it with the rule." }),
    /* @__PURE__ */ c("label", { children: [
      "Occurrence condition",
      /* @__PURE__ */ r(
        "select",
        {
          "aria-label": "Occurrence condition",
          value: i.condition,
          onChange: (a) => s({
            condition: a.target.value
          }),
          children: $r.map((a) => /* @__PURE__ */ r("option", { value: a, children: Mr[a] }, a))
        }
      )
    ] }),
    !["any", "isNull"].includes(i.condition) && /* @__PURE__ */ c(ce, { children: [
      /* @__PURE__ */ r(
        xt,
        {
          entityType: "tag",
          values: i.conditionTagIds,
          onChange: (a) => s({ conditionTagIds: a }),
          placeholder: "Search occurrence condition tags...",
          allowCreate: !1
        }
      ),
      /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
        /* @__PURE__ */ r(
          "input",
          {
            type: "checkbox",
            checked: i.includeSubtags ?? !0,
            onChange: (a) => s({ includeSubtags: a.target.checked })
          }
        ),
        "Include subtags"
      ] }),
      _n(i.condition) && /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
        /* @__PURE__ */ r(
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
    /* @__PURE__ */ c("p", { children: [
      "Conditions check tags on the same performer’s occurrence, independently of ",
      o,
      " tags and the performer’s profile."
    ] })
  ] });
}
function As({
  review: e,
  onChange: t
}) {
  const n = wt(he(e)).many;
  return /* @__PURE__ */ c("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ r("legend", { children: "Performer flags" }),
    /* @__PURE__ */ c("p", { children: [
      "Flag performers whose profile has any of these tags in the performer list and batches, for example a tag noting that something changed during their career. Check a flagged performer’s earliest and latest ",
      n,
      " ",
      "before applying one batch to all of them."
    ] }),
    /* @__PURE__ */ r(
      xt,
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
const Yi = 1e3;
async function ks(e, t, n) {
  const i = await ee(
    `/api/tags/${t}`,
    { signal: n }
  ), o = /* @__PURE__ */ new Map();
  for (let l = 1; ; l++) {
    const d = await ee(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          Wt({
            findFilter: {
              page: l,
              perPage: Yi,
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
    for (const g of d.items) o.set(g.id, g);
    if (l * Yi >= d.totalCount) break;
    if (!d.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const s = [...o.values()], a = he(e), p = de(e) ? await Rs(
    a,
    s.map((l) => l.id),
    n
  ) : s.map((l) => (a === "audio" ? l.audioCount : l.videoCount) ?? 0);
  return {
    parent: { id: t, name: i.name },
    children: s.map((l, d) => ({ id: l.id, name: l.name, uses: p[d] })).sort(
      (l, d) => d.uses - l.uses || l.name.localeCompare(d.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function Ts(e) {
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
async function Rs(e, t, n) {
  const i = new Array(t.length).fill(0), o = new AbortController(), s = () => o.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && s(), n == null || n.addEventListener("abort", s, { once: !0 });
  let a = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; a < t.length && !o.signal.aborted; ) {
            const p = a++;
            i[p] = (await ee(
              `/api/${ln(e)}/aggregate`,
              {
                method: "POST",
                signal: o.signal,
                body: Ts(t[p])
              }
            )).count;
          }
        } catch (p) {
          throw o.abort(), p;
        }
      })
    );
  } finally {
    n == null || n.removeEventListener("abort", s);
  }
  return o.signal.throwIfAborted(), i;
}
function Is(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((i) => t.has(i.id) ? !1 : (t.add(i.id), !0))
  }));
}
function Os(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const i of n.children)
      t.set(i.id, [...t.get(i.id) ?? [], n.parent.id]);
  return t;
}
function Ms(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const i of Pr(n))
      t.set(i, [...t.get(i) ?? [], n]);
  return t;
}
function $s(e, t) {
  return {
    id: crypto.randomUUID(),
    label: e.name,
    steps: [
      { mode: "ADD", tagIds: [e.id] },
      ...t.length ? [{ mode: "REMOVE_TREE", tagIds: t }] : []
    ]
  };
}
const Ps = (e) => e instanceof Error ? e.message : "Request failed.";
function Fs({
  id: e,
  review: t,
  disabled: n,
  onAdd: i,
  onCancel: o
}) {
  const [s, a] = N([]), [p, l] = N({}), [d, g] = N({}), [h, y] = N({}), w = P(/* @__PURE__ */ new Map());
  z(
    () => () => {
      for (const F of w.current.values()) F.abort();
    },
    []
  );
  const S = wt(he(t)), q = de(t), m = q ? "performer" : S.one;
  function R(F) {
    var C;
    (C = w.current.get(F)) == null || C.abort();
    const J = new AbortController();
    w.current.set(F, J), l((X) => ({ ...X, [F]: { status: "loading" } })), ks(t, F, J.signal).then(
      (X) => {
        J.signal.aborted || l((ie) => ({
          ...ie,
          [F]: { status: "ready", group: X }
        }));
      },
      (X) => {
        J.signal.aborted || l((ie) => ({
          ...ie,
          [F]: { status: "failed", message: Ps(X) }
        }));
      }
    );
  }
  function E(F) {
    var qe;
    const J = s.filter((oe) => !F.includes(oe));
    for (const oe of J)
      (qe = w.current.get(oe)) == null || qe.abort(), w.current.delete(oe);
    const C = (oe) => {
      const ve = p[oe];
      return (ve == null ? void 0 : ve.status) === "ready" ? ve.group.children.map((Lt) => Lt.id) : [];
    }, X = new Set(F.flatMap(C)), ie = J.flatMap(C).filter((oe) => !X.has(oe));
    g(
      (oe) => Object.fromEntries(
        Object.entries(oe).filter(([ve]) => !ie.includes(Number(ve)))
      )
    ), y(
      (oe) => Object.fromEntries(
        Object.entries(oe).filter(([ve]) => F.includes(Number(ve)))
      )
    ), l(
      (oe) => Object.fromEntries(
        Object.entries(oe).filter(([ve]) => F.includes(Number(ve)))
      )
    ), a(F);
    for (const oe of F) s.includes(oe) || R(oe);
  }
  const L = s.flatMap((F) => {
    const J = p[F];
    return (J == null ? void 0 : J.status) === "ready" ? [J.group] : [];
  }), K = L.length === s.length, re = s.some(
    (F) => {
      var J;
      return (((J = p[F]) == null ? void 0 : J.status) ?? "loading") === "loading";
    }
  ), I = new Map(
    Is(L).map((F) => [F.parent.id, F])
  ), M = Os(L), x = new Map(L.map((F) => [F.parent.id, F.parent.name])), j = Ms(t.actions), O = (F) => d[F] ?? !j.has(F), _ = K ? [...I.values()].flatMap(
    (F) => F.children.filter((J) => O(J.id))
  ) : [], ae = (F, J) => g((C) => ({
    ...C,
    ...Object.fromEntries(F.children.map((X) => [X.id, J]))
  }));
  return /* @__PURE__ */ c("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ r("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ c("p", { className: "dq-editor-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      q ? "on performers " : "",
      "first. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ r(
      xt,
      {
        entityType: "tag",
        values: s,
        onChange: E,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    s.map((F) => {
      const J = p[F];
      if (!J || J.status === "loading")
        return /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "Loading child tags…" }, F);
      if (J.status === "failed")
        return /* @__PURE__ */ c("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ c("span", { children: [
            "Child tags could not be loaded. ",
            J.message
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: n,
              onClick: () => R(F),
              children: "Retry"
            }
          )
        ] }, F);
      const C = I.get(F);
      if (!C) return null;
      const X = C.parent.name;
      return /* @__PURE__ */ c("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ r("legend", { children: X }),
        J.group.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "This tag has no child tags." }) : /* @__PURE__ */ c(ce, { children: [
          /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: h[F] ?? !1,
                disabled: n,
                onChange: (ie) => y((qe) => ({
                  ...qe,
                  [F]: ie.target.checked
                }))
              }
            ),
            "Only one per ",
            m,
            ": each action removes every other tag in the ",
            X,
            " tree"
          ] }),
          C.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ c(ce, { children: [
            /* @__PURE__ */ c("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${X}`,
                  onClick: () => ae(C, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${X}`,
                  onClick: () => ae(C, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "dq-child-tags", children: C.children.map((ie) => {
              const qe = j.get(ie.id) ?? [], oe = (M.get(ie.id) ?? []).filter((ve) => ve !== F).map((ve) => `“${x.get(ve)}”`);
              return /* @__PURE__ */ c("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: O(ie.id),
                    disabled: n,
                    onChange: (ve) => g((Lt) => ({
                      ...Lt,
                      [ie.id]: ve.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ c("span", { children: [
                  ie.name,
                  " ",
                  /* @__PURE__ */ c("small", { children: [
                    ie.uses.toLocaleString(),
                    " ",
                    ie.uses === 1 ? S.one : S.many
                  ] }),
                  oe.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " · Also under ",
                    oe.join(", ")
                  ] }),
                  qe.length > 0 && /* @__PURE__ */ c("small", { children: [
                    " ",
                    "· Already in “",
                    qe[0].label || "New action",
                    "”",
                    qe.length > 1 ? ` and ${qe.length - 1} more` : ""
                  ] })
                ] })
              ] }, ie.id);
            }) })
          ] })
        ] })
      ] }, F);
    }),
    /* @__PURE__ */ c("div", { className: "dq-row", children: [
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: n || !_.length,
          onClick: () => i(
            _.map(
              (F) => $s(
                F,
                (M.get(F.id) ?? []).filter(
                  (J) => h[J]
                )
              )
            )
          ),
          children: _.length ? `Add ${_.length} action${_.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: o, children: "Cancel" }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-sr-only", children: re ? "Loading child tags…" : "" })
    ] })
  ] });
}
const Ko = "com.midnightrider.data-quality", Bo = "find-action", Go = "select-all";
function Vo(e) {
  return `action-${String(e + 1).padStart(2, "0")}`;
}
function Jo(e) {
  return (e.split(" ").at(-1) ?? "").split("+").includes("Shift");
}
function xs(e) {
  return Jo(e.sequence);
}
function Ci({
  surface: e,
  enabled: t,
  actionCount: n,
  onAction: i,
  onFind: o,
  onSelectAll: s
}) {
  const a = !!o, p = e === "local" && !!s, l = Cn.map(
    (d, g) => ({
      id: Vo(g),
      surface: e,
      enabled: t && g < n,
      action: (h) => i(g, xs(h))
    })
  );
  l.push({
    id: Bo,
    surface: e,
    enabled: t && a && n > 0,
    action: () => o == null ? void 0 : o()
  }), p && l.push({
    id: Go,
    surface: "local",
    enabled: t,
    action: () => s == null ? void 0 : s()
  }), Ea(Ko, l);
}
const zo = "Ctrl/⌘A";
function Un() {
  const e = Na(Ko);
  return ze(() => {
    const t = (o, s) => {
      const a = e[o];
      return a ? a.find((p) => !Jo(p)) ?? a[0] ?? "" : s;
    }, n = (o) => o < Cn.length ? t(Vo(o), Cn[o]) : "", i = t(Go, "Ctrl+a");
    return {
      action: n,
      find: t(Bo, "-"),
      selectAll: i === "Ctrl+a" ? zo : i,
      allUnbound: (o) => {
        const s = Math.min(o, Cn.length);
        return s > 0 && Array.from({ length: s }, (a, p) => n(p)).every((a) => !a);
      }
    };
  }, [e]);
}
const Ls = 600 * 1e3, ai = /* @__PURE__ */ new Map(), sn = /* @__PURE__ */ new Map();
function Qo(e) {
  const t = ai.get(e);
  if (t) {
    if (Date.now() - t.at > Ls) {
      ai.delete(e);
      return;
    }
    return t.name;
  }
}
function Ds(e) {
  const t = sn.get(e);
  if (t) return t;
  const n = new AbortController(), i = {
    controller: n,
    waiters: 0,
    promise: ee(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (o) => {
        var a;
        const s = ((a = o == null ? void 0 : o.name) == null ? void 0 : a.trim()) || null;
        return sn.get(e) === i && sn.delete(e), s && ai.set(e, { name: s, at: Date.now() }), s;
      },
      () => (sn.get(e) === i && sn.delete(e), null)
    )
  };
  return sn.set(e, i), i;
}
function Xi() {
  return new DOMException("The tag name request was aborted.", "AbortError");
}
function Br(e) {
  const t = {};
  for (const n of e) {
    const i = Qo(n);
    i !== void 0 && (t[n] = i);
  }
  return t;
}
function _s(e, t) {
  if (t != null && t.aborted) return Promise.reject(Xi());
  const n = {}, i = [];
  for (const o of new Set(e)) {
    const s = Qo(o);
    if (s !== void 0) n[o] = s;
    else {
      const a = Ds(o);
      a.waiters += 1, i.push({ id: o, entry: a });
    }
  }
  return i.length ? new Promise((o, s) => {
    let a = !1;
    const p = () => {
      for (const { id: d, entry: g } of i)
        g.waiters -= 1, g.waiters === 0 && sn.get(d) === g && (sn.delete(d), g.controller.abort());
    }, l = () => {
      a || (a = !0, p(), s(Xi()));
    };
    t == null || t.addEventListener("abort", l, { once: !0 }), Promise.all(
      i.map(
        ({ id: d, entry: g }) => g.promise.then((h) => [d, h])
      )
    ).then((d) => {
      if (!a) {
        a = !0, t == null || t.removeEventListener("abort", l), p();
        for (const [g, h] of d) n[g] = h;
        o(n);
      }
    });
  }) : Promise.resolve(n);
}
function lr(e) {
  const t = [...new Set(e)].sort((o, s) => o - s).join(","), [n, i] = N(() => ({
    key: t,
    names: Br(Gr(t))
  }));
  return z(() => {
    const o = Gr(t), s = Br(o);
    if (i({ key: t, names: s }), o.every((p) => p in s)) return;
    const a = new AbortController();
    return _s(o, a.signal).then(
      (p) => i({ key: t, names: p }),
      () => {
      }
    ), () => a.abort();
  }, [t]), n.key === t ? n.names : Br(Gr(t));
}
function Gr(e) {
  return e ? e.split(",").map(Number) : [];
}
function js(e, t, n = !1) {
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
function Ai(e, t, n = [], i) {
  if ("effect" in e) {
    const a = e.effect;
    if (a.mode === "SKIP") return [{ text: "Skip", tone: "neutral" }];
    if (a.mode === "CLEAR_TAG_GROUP")
      return [{ text: "Set Ungrouped", tone: "neutral" }];
    const p = n.find((l) => l.id === a.tagGroupId);
    return [
      {
        text: p ? `Assign ${p.name}` : "Unavailable tag group",
        tone: "neutral"
      }
    ];
  }
  if (!e.steps.length) return [{ text: "Skip", tone: "neutral" }];
  const o = Pr(e), s = (a) => o.has(a) || [...o].some((p) => {
    var l;
    return (l = i == null ? void 0 : i.get(a)) == null ? void 0 : l.includes(p);
  });
  return e.steps.flatMap(
    (a) => a.tagIds.map(
      (p) => js(
        a.mode,
        t[p] === void 0 ? "…" : t[p] ?? "Unavailable tag",
        a.mode === "REMOVE_TREE" && s(p)
      )
    )
  );
}
function Us(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function ki({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: i,
  canStay: o = !0,
  onApply: s,
  onClose: a
}) {
  const [p, l] = N(""), [d, g] = N(0), h = P(null), y = P(null), w = P(null), S = P(null), q = P(null), m = ar(), R = lr(ze(() => Us(e), [e])), E = Un(), L = ze(() => {
    const x = p.trim().toLocaleLowerCase();
    return e.map((j, O) => ({ action: j, index: O, key: E.action(O) })).filter((j) => !x || j.action.label.toLocaleLowerCase().includes(x));
  }, [e, E, p]), K = L.length ? Math.min(d, L.length - 1) : -1, re = (x) => `${m}-option-${x}`;
  nr(() => {
    var x, j, O;
    return S.current = document.activeElement, q.current = ((j = (x = w.current) == null ? void 0 : x.parentElement) == null ? void 0 : j.closest('[role="dialog"]')) ?? null, (O = h.current) == null || O.focus({ preventScroll: !0 }), () => {
      var ae;
      const _ = S.current;
      _ instanceof HTMLElement && _.isConnected && _.focus({ preventScroll: !0 }), document.activeElement !== _ && ((ae = q.current) != null && ae.isConnected) && q.current.focus({ preventScroll: !0 });
    };
  }, []), z(() => {
    var x, j, O;
    K < 0 || (O = (j = (x = y.current) == null ? void 0 : x.querySelector(`[id="${re(L[K].index)}"]`)) == null ? void 0 : j.scrollIntoView) == null || O.call(j, { block: "nearest" });
  }, [K, L]);
  function I(x, j) {
    !x || i != null && i(x.action) || s(x.action, o && j);
  }
  function M(x) {
    var j;
    if (x.stopPropagation(), x.key === "Escape")
      x.preventDefault(), a();
    else if (x.key === "Enter")
      x.preventDefault(), x.repeat || I(L[K], x.shiftKey);
    else if (x.key === "ArrowDown" || x.key === "ArrowUp") {
      if (x.preventDefault(), !L.length) return;
      const O = x.key === "ArrowDown" ? 1 : -1;
      g((K + O + L.length) % L.length);
    } else x.key === "Tab" && (x.preventDefault(), (j = h.current) == null || j.focus());
  }
  return /* @__PURE__ */ c(ce, { children: [
    /* @__PURE__ */ r("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: a }),
    /* @__PURE__ */ c(
      "div",
      {
        ref: w,
        role: "dialog",
        "aria-label": "Find an action",
        className: "dq-find-action",
        onKeyDown: M,
        onMouseDown: (x) => {
          x.target !== h.current && x.preventDefault();
        },
        children: [
          /* @__PURE__ */ c("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ r(bi, { "aria-hidden": "true" }),
            /* @__PURE__ */ r(
              "input",
              {
                ref: h,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${m}-list`,
                "aria-activedescendant": K >= 0 ? re(L[K].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: p,
                onChange: (x) => {
                  l(x.target.value), g(0);
                }
              }
            ),
            /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          L.length ? /* @__PURE__ */ r(
            "ul",
            {
              ref: y,
              id: `${m}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: L.map((x, j) => /* @__PURE__ */ r("li", { role: "none", children: /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: re(x.index),
                  tabIndex: -1,
                  "aria-selected": j === K,
                  disabled: (i == null ? void 0 : i(x.action)) ?? !1,
                  onClick: (O) => I(x, O.shiftKey),
                  children: [
                    x.key ? /* @__PURE__ */ r("kbd", { children: x.key }) : /* @__PURE__ */ r("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ r("span", { className: "dq-find-label", children: x.action.label }),
                    /* @__PURE__ */ r("span", { className: "dq-find-effect", children: Ai(x.action, R, t, n).map(
                      (O, _) => /* @__PURE__ */ r("span", { "data-effect-tone": O.tone, children: O.text }, _)
                    ) })
                  ]
                }
              ) }, x.action.id))
            }
          ) : /* @__PURE__ */ c("p", { className: "dq-find-empty", role: "status", children: [
            "No action matches “",
            p.trim(),
            "”."
          ] }),
          /* @__PURE__ */ c("p", { className: "dq-find-hints", "aria-hidden": "true", children: [
            /* @__PURE__ */ c("span", { children: [
              /* @__PURE__ */ r("kbd", { children: "Enter" }),
              " applies"
            ] }),
            o && /* @__PURE__ */ c("span", { children: [
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
function Wo({
  onClick: e,
  disabled: t,
  className: n = "dq-button"
}) {
  const i = Un().find;
  return /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      className: `${n} dq-find-button`,
      "aria-keyshortcuts": i || void 0,
      disabled: t,
      onClick: e,
      children: [
        /* @__PURE__ */ r(bi, { "aria-hidden": "true" }),
        "Find action",
        i && /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: i })
      ]
    }
  );
}
function kr(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Ti(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Ri(e) {
  return !!String(e ?? "").trim();
}
function Ii(e) {
  return [
    ...new Set(
      kr(e.customFieldCriteria).filter(Ti).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Ri(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Oi(e, t) {
  const n = kr(e.customFieldCriteria);
  if (!n.length) return e;
  let i = !1;
  const o = n.map((s) => {
    if (!Ti(s)) return s;
    const a = { ...s };
    for (const [p, l] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const d = t[String(s[p] ?? "")];
      d && !Ri(s[l]) && (a[l] = d, i = !0);
    }
    return a;
  });
  return i ? { ...e, customFieldCriteria: o } : e;
}
function Ho(e, t, n) {
  const i = kr(e.customFieldCriteria);
  if (!i.length) return e;
  const o = kr(n.customFieldCriteria), s = (l, d) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (g) => (l[g] ?? void 0) === (d[g] ?? void 0)
  );
  let a = !1;
  const p = i.map((l) => {
    if (!Ti(l)) return l;
    const d = o.find((h) => s(h, l));
    if (!d) return l;
    const g = { ...l };
    for (const [h, y] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const w = t[String(l[h] ?? "")];
      w && l[y] === w && !Ri(d[y]) && (delete g[y], a = !0);
    }
    return g;
  });
  return a ? { ...e, customFieldCriteria: p } : e;
}
async function Ks(e, t, n) {
  if (!An(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const i = he(e), o = n.steps.some((p) => Qt(p.mode)) ? await Ns(i) : "", s = await Ei(n);
  let a = t.applications;
  for (const p of [
    ...s.filter((l) => !Qt(l.mode)),
    ...s.filter((l) => Qt(l.mode))
  ]) {
    const l = (d) => Es(
      o,
      i,
      t.media.id,
      t.performer.id,
      p.tagIds,
      d
    );
    (p.mode === "MARK_PRESENT" || p.mode === "CLEAR_ABSENCE") && await l("REMOVE"), p.mode !== "CLEAR_ABSENCE" && (a = await ea(
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
    )), p.mode === "MARK_ABSENT" && await l("ADD");
  }
  return a;
}
async function Mi(e, t) {
  const n = e.occurrence;
  if (vi(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: o, ...s } = n.performerFilter;
  for (let a = 1; ; a++) {
    const p = await ee("/api/performers/find", {
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
    if (p.items.forEach((l) => i.add(l.id)), a * 1e3 >= p.totalCount) return [...i];
    if (!p.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Yo(e) {
  return _n(e.condition) && e.hideConfirmedAbsent !== !1;
}
function $i(e, t) {
  const { _filterExpression: n, ...i } = e.view.objectFilter, o = e.occurrence, s = {
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
  }, a = Yo(o) && (t == null ? void 0 : t.length) === 1 && o.conditionTagIds.length === 1 ? `${t[0]}:${o.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: he(e),
    actions: [],
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...n ? [{ group: n }] : [],
            { filter: i },
            { filter: { performerFilterCriterion: s } },
            ...a ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: Fr,
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
async function Pi(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => xr([n], t))
  );
}
function Xo(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function Bs(e, t, n = e.conditionTagIds.map((i) => [i])) {
  const i = new Set(t), o = (s) => s.some((a) => i.has(a));
  switch (e.condition) {
    case "any":
      return !0;
    case "isNull":
      return i.size === 0;
    case "includes":
      return n.some(o);
    case "includesAll":
      return n.every(o);
    case "excludes":
      return !n.some(o);
    case "excludesAll":
      return !n.every(o);
  }
}
function Gs(e, t, n, i, o) {
  if (!Yo(e)) return !1;
  const s = jo(t, n);
  return e.conditionTagIds.every(
    (a, p) => s.includes(a) || o[p].some((l) => i.includes(l))
  );
}
async function Zo(e, t, n, i) {
  if ((t == null ? void 0 : t.length) === 0 || Xo(e.occurrence))
    return { items: [], totalCount: 0 };
  const o = he(e), s = await er(
    $i(e, t),
    { ...e.view.filter, page: n },
    i
  ), a = t === null ? null : new Set(t), p = e.occurrence, l = s.items.length ? await Pi(p, i) : [], d = new Array(s.items.length);
  let g = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, s.items.length) }, async () => {
      for (; g < s.items.length; ) {
        const h = g++, y = s.items[h], w = await ee(
          `/api/tagapplications?hostType=${o}&hostId=${y.id}&contextType=performer`,
          { signal: i }
        );
        d[h] = y.performers.filter((S) => a === null || a.has(S.id)).flatMap((S) => {
          const q = w.filter(
            (R) => R.hostType === o && R.hostId === y.id && R.contextType === "performer" && R.contextId === S.id
          ), m = q.map((R) => R.tag.id);
          return Bs(e.occurrence, m, l) && !Gs(p, y, S.id, m, l) ? [
            {
              key: `${y.id}:${S.id}`,
              media: y,
              performer: S,
              applications: q
            }
          ] : [];
        });
      }
    })
  ), { items: d.flat(), totalCount: s.totalCount };
}
async function ea(e, t, n) {
  const i = new Set(e.occurrence.tagIds);
  if (n.some((d) => !i.has(d)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const o = he(e), s = await ri(o, t.media.id);
  if (!s.performers.some(
    (d) => d.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${o}. Refresh the queue.`
    );
  const a = `/api/tagapplications?hostType=${o}&hostId=${s.id}&contextType=performer&contextId=${t.performer.id}`, p = (await ee(a)).filter(
    (d) => d.hostType === o && d.hostId === s.id && d.contextType === "performer" && d.contextId === t.performer.id
  ), l = new Set(n);
  try {
    for (const d of l)
      p.some((g) => g.tag.id === d) || await ee("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: o,
          hostId: s.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: d,
          sourceKey: "user"
        })
      });
    for (const d of p)
      i.has(d.tag.id) && !l.has(d.tag.id) && await ee(`/api/tagapplications/${d.id}`, {
        method: "DELETE"
      });
    return await ee(a);
  } catch (d) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${d instanceof Error ? d.message : "Request failed."}`
    );
  }
}
function jn(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function Vs(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function kt(e, t, n = !0) {
  var p;
  if (t.occurrence) {
    const l = n ? jo(
      await ri(e, t.media.id),
      t.occurrence.performer.id
    ) : [], d = (await ee(Vs(e, t))).filter(
      (g) => g.hostType === e && g.hostId === t.media.id && g.contextType === "performer" && g.contextId === t.occurrence.performer.id
    );
    return {
      ids: [...new Set(d.map((g) => g.tag.id))],
      names: [...new Set(d.map((g) => g.tag.name))],
      absent: l,
      applications: d
    };
  }
  const i = await ri(e, t.media.id), o = (i.tags ?? []).filter(
    (l) => l.canRemove !== !1 || l.isDerived !== !0
  ), s = Object.keys(i.customFields ?? {}).find(
    (l) => l.toLowerCase() === Cr
  ) ?? Cr, a = ((p = i.customFields) == null ? void 0 : p[s]) ?? [];
  if (!Array.isArray(a) || a.some((l) => !Number.isSafeInteger(l)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${e} before editing.`
    );
  return { ids: o.map((l) => l.id), names: o.map((l) => l.name), absent: a };
}
async function Fi(e, t, n) {
  if (t.occurrence && de(e))
    await ea(
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
    for (const [i, o] of [
      ["ADD", n.added],
      ["REMOVE", n.removed]
    ])
      o.length && await ee(
        `/api/${ln(he(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: i, tagIds: o })
        }
      );
}
async function Js(e, t, n) {
  t.occurrence && de(e) ? await Ks(e, t.occurrence, n) : await Uo(he(e), n, [t.media.id]);
}
function si(e, t, n, i) {
  const o = (s) => s.filter((a) => i.includes(a));
  return {
    item: e,
    before: t,
    after: n,
    tags: jn(o(t.ids), o(n.ids)),
    absence: jn(o(t.absent), o(n.absent))
  };
}
function zs(e, t) {
  var n;
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
      const o = (n = e.after.applications) == null ? void 0 : n.filter((a) => a.tag.id === i).map((a) => a.id).sort(), s = t.applications.filter((a) => a.tag.id === i).map((a) => a.id).sort();
      if (JSON.stringify(o) !== JSON.stringify(s))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
const ci = (e) => e instanceof Error ? e.message : "Request failed.", Zi = (e) => [...e].sort((t, n) => t - n), ir = (e, t) => JSON.stringify(Zi(e)) === JSON.stringify(Zi(t)), li = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Tr(e, t, n, i) {
  const o = new Set(e), s = new Set(e);
  for (const g of t.steps)
    for (const h of g.tagIds)
      g.mode === "ADD" ? s.add(h) : s.delete(h);
  const a = e.some((g) => !s.has(g));
  if (a && !i)
    return { desired: [...e], conflict: a, skipped: !0, kept: [], replaced: [] };
  const p = new Set(
    t.steps.filter((g) => g.mode === "ADD").flatMap((g) => g.tagIds)
  ), l = [], d = [];
  for (const g of n) {
    const h = g.filter((w) => s.has(w) && !o.has(w)), y = g.filter(
      (w) => s.has(w) && o.has(w) && !p.has(w)
    );
    !h.length || !y.length || (i ? (y.forEach((w) => s.delete(w)), d.push(...y)) : (h.forEach((w) => s.delete(w)), l.push({ tagIds: h, existing: y })));
  }
  return { desired: [...s], conflict: a, skipped: !1, kept: l, replaced: d };
}
function Qs(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Ws(e, t, n, i) {
  for (const [o, s] of n.entries()) {
    const a = t.filter(
      (d) => d.steps.some(
        (g) => g.mode === "ADD" && g.tagIds.some((h) => s.includes(h))
      )
    );
    if (a.length < 2) continue;
    const p = e.occurrence.conditionTagIds[o];
    let l = `tag ${p}`;
    try {
      l = (await ee(`/api/tags/${p}`, { signal: i })).name;
    } catch {
      i.throwIfAborted();
    }
    throw new Error(
      `${a.map((d) => d.label).join(" and ")} answer the same condition tag, ${l}. Choose one of them.`
    );
  }
}
async function Hs(e, t, n, i = () => {
}) {
  if (!t.length || t.some(
    (y) => !An(y, e.entityType) || !y.steps.length || y.steps.some(
      (w) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(w.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const o = structuredClone(e), s = structuredClone(t), a = _n(o.occurrence.condition) && o.occurrence.includeSubtags !== !1 ? await Pi(o.occurrence, n) : [];
  await Ws(o, s, a, n);
  const p = await Promise.all(
    s.map(async (y) => ({
      ...y,
      steps: await Ei(y, n)
    }))
  ), l = structuredClone(Qs(p));
  n.throwIfAborted();
  const d = [
    .../* @__PURE__ */ new Set([
      ...l.steps.flatMap((y) => y.tagIds),
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
  const g = await Mi(o, n), h = /* @__PURE__ */ new Map();
  for (let y = 1; ; y++) {
    n.throwIfAborted();
    const w = await Zo(o, g, y, n);
    for (const S of w.items) {
      const q = {
        ids: [...new Set(S.applications.map((R) => R.tag.id))],
        names: S.applications.map((R) => R.tag.name),
        absent: [],
        applications: S.applications
      }, m = Tr(q.ids, l, a, !0);
      h.set(S.key, {
        item: { key: S.key, media: S.media, occurrence: S },
        before: q,
        expected: q,
        conflict: m.conflict,
        status: ir(q.ids, m.desired) ? "unchanged" : "pending"
      });
    }
    if (i(h.size), y * 250 >= w.totalCount) break;
    if (y > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return n.throwIfAborted(), {
    review: o,
    actions: s,
    action: l,
    categories: a,
    touched: d,
    entries: [...h.values()]
  };
}
function Ys(e, t, n) {
  const i = (s) => s.ids.filter((a) => n.includes(a));
  if (!ir(i(e), i(t))) return !1;
  const o = (s) => (s.applications ?? []).filter((a) => n.includes(a.tag.id)).map((a) => a.id);
  return ir(o(e), o(t));
}
async function ta(e, t, n, i) {
  let o = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; !t() && o < e.length; ) {
        const s = e[o++];
        await n(s), i();
      }
    })
  );
}
async function Xs(e, t, n, i, o = !1) {
  const s = e.entries.filter(
    (a) => o ? a.status === "failed" : a.status === "pending"
  );
  await ta(
    s,
    n,
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
        if (p = await kt(he(e.review), a.item, !1), !Ys(a.expected, p, e.touched)) {
          a.status = "skipped", a.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (w) {
        a.status = "failed", a.error = ci(w);
        return;
      }
      const l = Tr(
        a.before.ids,
        e.action,
        e.categories,
        t
      ), d = [
        ...p.ids.filter((w) => !e.touched.includes(w)),
        ...l.desired.filter((w) => e.touched.includes(w))
      ], g = jn(p.ids, d);
      if (!g.added.length && !g.removed.length) {
        const w = !a.operation && l.kept.length > 0;
        a.status = a.operation ? "changed" : w ? "skipped" : "unchanged", a.error = w ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let h;
      try {
        await Fi(e.review, a.item, g);
      } catch (w) {
        h = w;
      }
      let y = !1;
      try {
        const w = await kt(he(e.review), a.item, !1);
        y = !0, a.expected = w;
        const S = si(
          a.item,
          a.before,
          w,
          e.touched
        );
        if (a.operation = li(S) ? S : void 0, h) throw h;
        if (!ir(
          w.ids.filter((q) => e.touched.includes(q)),
          d.filter((q) => e.touched.includes(q))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        a.status = a.operation ? "changed" : "unchanged", a.error = void 0;
      } catch (w) {
        if (a.status = "failed", a.error = ci(w), !y)
          try {
            const S = await kt(he(e.review), a.item, !1);
            a.expected = S;
            const q = si(
              a.item,
              a.before,
              S,
              e.touched
            );
            a.operation = li(q) ? q : void 0;
          } catch {
            a.unverified = !0;
          }
      }
    },
    i
  );
}
async function Zs(e, t, n) {
  await ta(
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
        const p = await kt(he(e.review), i.item, !1);
        zs(o, p), a = !0, await Fi(e.review, i.item, {
          added: o.tags.removed,
          removed: o.tags.added
        });
        const l = await kt(he(e.review), i.item, !1);
        if (!ir(
          l.ids.filter((d) => s.includes(d)),
          i.before.ids.filter((d) => s.includes(d))
        ))
          throw new Error("Undo did not restore all affected tags.");
        i.operation = void 0, i.expected = l, i.status = "unchanged", i.error = void 0;
      } catch (p) {
        if (i.error = `Undo stopped: ${ci(p)}`, i.status = "failed", a)
          try {
            const l = await kt(he(e.review), i.item, !1), d = si(
              i.item,
              i.before,
              l,
              s
            );
            i.operation = li(d) ? d : void 0, i.expected = l;
          } catch {
            i.unverified = !0;
          }
      }
    },
    n
  );
}
async function ec(e, t, n) {
  const i = he(e), o = e.occurrence, [s, a] = await Promise.all([
    ee(
      `/api/tagapplications?hostType=${i}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Pi(o, n)
  ]), p = s.filter(
    (S) => S.hostType === i && S.contextType === "performer" && S.contextId === t
  ), l = await Promise.all(
    a.map(async (S, q) => {
      const m = o.conditionTagIds[q];
      return (await ee(`/api/tags/${m}`, { signal: n })).name;
    })
  ), d = new Set(a.flat()), g = new Set(
    [
      ...e.actions.flatMap((S) => S.steps).filter((S) => S.mode === "ADD" || S.mode === "MARK_PRESENT").flatMap((S) => S.tagIds),
      ...o.tagIds
    ].filter((S) => !d.has(S))
  ), h = (S) => {
    const q = /* @__PURE__ */ new Map();
    for (const m of p) {
      if (!S.has(m.tag.id)) continue;
      const R = q.get(m.tag.id) ?? {
        name: m.tag.name,
        hosts: /* @__PURE__ */ new Set()
      };
      R.hosts.add(m.hostId), q.set(m.tag.id, R);
    }
    return [...q].map(([m, R]) => ({ id: m, name: R.name, count: R.hosts.size })).sort((m, R) => R.count - m.count || m.name.localeCompare(R.name));
  }, y = a.map((S, q) => ({
    id: o.conditionTagIds[q],
    name: l[q],
    tags: h(new Set(S))
  }));
  g.size && y.push({
    id: null,
    name: a.length ? "Other review tags" : "Review tags",
    tags: h(g)
  });
  const w = /* @__PURE__ */ new Set([...d, ...g]);
  return {
    answered: new Set(
      p.filter((S) => w.has(S.tag.id)).map((S) => S.hostId)
    ).size,
    groups: y
  };
}
function na({
  review: e,
  performerId: t,
  revision: n = 0
}) {
  const [i, o] = N(null), [s, a] = N(""), p = wt(he(e)), l = e.occurrence, d = JSON.stringify([
    e.entityType,
    t,
    l.condition,
    l.conditionTagIds,
    l.includeSubtags,
    l.tagIds,
    e.actions.map((h) => h.steps)
  ]);
  z(() => {
    const h = new AbortController();
    return o(null), a(""), ec(e, t, h.signal).then((y) => {
      h.signal.aborted || o(y);
    }).catch((y) => {
      h.signal.aborted || a(y instanceof Error ? y.message : "Request failed.");
    }), () => h.abort();
  }, [d, n]);
  const g = (h) => `${h.toLocaleString()} ${h === 1 ? p.one : p.many}`;
  return /* @__PURE__ */ c("section", { className: "dq-panel-section dq-performer-answers", "aria-label": "Existing answers", children: [
    /* @__PURE__ */ c("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Existing answers" }),
      i && /* @__PURE__ */ r("span", { children: i.answered ? `${g(i.answered)} answered` : "none answered yet" })
    ] }),
    s ? /* @__PURE__ */ c("p", { role: "alert", children: [
      "Could not load existing answers. ",
      s
    ] }) : i ? i.groups.filter((h) => h.id !== null || h.tags.length).map((h) => /* @__PURE__ */ c("div", { className: "dq-answer-group", children: [
      /* @__PURE__ */ c("div", { className: "dq-answer-category", children: [
        /* @__PURE__ */ r("span", { children: h.name }),
        h.id !== null && h.tags.length > 1 && /* @__PURE__ */ r(
          "span",
          {
            className: "dq-badge dq-badge-warning",
            title: "This performer has different answers in this category.",
            children: "Mixed"
          }
        )
      ] }),
      h.tags.length ? /* @__PURE__ */ r("ul", { className: "dq-chips", "aria-label": h.name, children: h.tags.map((y) => /* @__PURE__ */ c("li", { className: "dq-chip", children: [
        y.name,
        /* @__PURE__ */ r("span", { className: "dq-chip-count", "aria-hidden": "true", children: y.count.toLocaleString() }),
        /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
          ", ",
          g(y.count)
        ] })
      ] }, y.id)) }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" })
    ] }, h.id ?? "other")) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading existing answers…" })
  ] });
}
async function eo(e, t, n) {
  const i = new Array(e.length);
  let o = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; o < e.length; ) {
        n.throwIfAborted();
        const s = o++, a = e[s];
        try {
          i[s] = [
            a,
            (await ee(`/api/${t}/${a}`, {
              signal: n
            })).name
          ];
        } catch {
          n.throwIfAborted(), i[s] = [
            a,
            `${t === "tags" ? "Tag" : "Performer"} ${a}`
          ];
        }
      }
    })
  ), i;
}
function tc(e, t) {
  const n = 1100 - (Date.now() - e);
  return n <= 0 ? Promise.resolve() : new Promise((i, o) => {
    const s = window.setTimeout(i, n);
    t.addEventListener(
      "abort",
      () => {
        window.clearTimeout(s), o(t.reason);
      },
      { once: !0 }
    );
  });
}
function nc({
  review: e,
  disabled: t,
  hidden: n = !1,
  performerFlags: i = [],
  onOpen: o,
  onClose: s,
  onWrite: a
}) {
  const [p, l] = N(!1), [d, g] = N(null), [h, y] = N([]), [w, S] = N(!1), [q, m] = N(!1), [R, E] = N(""), [L, K] = N(""), [re, I] = N({}), [M, x] = N(!1), [j, O] = N(!1), _ = M && d ? d.review : e, ae = he(_), F = wt(ae), J = F.queue, C = ae === "audio" ? "Audio" : "Scene", [X, ie] = N([]), [qe, oe] = N(!1), [, ve] = N(0), [Lt, Dt] = N(0), _t = P(null), jt = P(null), be = P(!1), De = P(null), Ce = P(!1), tt = P(0), ye = P(!1), nt = P({ onClose: s, onWrite: a });
  nt.current = { onClose: s, onWrite: a }, z(() => {
    var T;
    p && ((T = _t.current) == null || T.showModal());
  }, [p]), z(() => {
    if (!p || _.occurrence.targetMode !== "selected") return;
    const T = new AbortController();
    return ie([]), eo(
      _.occurrence.performerIds,
      "performers",
      T.signal
    ).then((W) => {
      T.signal.aborted || ie(W.map(([, ke]) => ke));
    }).catch(() => {
    }), () => T.abort();
  }, [
    p,
    _.occurrence.targetMode,
    JSON.stringify(_.occurrence.performerIds)
  ]), z(
    () => () => {
      var T;
      be.current = !0, (T = De.current) == null || T.abort();
    },
    []
  ), z(() => {
    if (!q) return;
    const T = (W) => {
      W.preventDefault(), W.returnValue = "";
    };
    return window.addEventListener("beforeunload", T), () => window.removeEventListener("beforeunload", T);
  }, [q]);
  function Qe() {
    g(null), x(!1), O(!1), S(!1), y([]), K(""), E(""), oe(!1);
  }
  function Ae() {
    ye.current || (l(!1), nt.current.onClose(Ce.current), Ce.current = !1, Qe(), requestAnimationFrame(() => {
      var T;
      return (T = jt.current) == null ? void 0 : T.focus();
    }));
  }
  const le = M && d ? d.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((T) => T.steps.length && !cn(T))
  );
  async function se() {
    const T = le.filter((W) => h.includes(W.id));
    if (!(!T.length || ye.current)) {
      ye.current = !0, m(!0), E(""), K("Loading all matching occurrences…"), g(null), x(!1), O(!1), oe(!1), De.current = new AbortController();
      try {
        await tc(tt.current, De.current.signal);
        const W = await Hs(
          e,
          T,
          De.current.signal,
          (Pe) => K(`Loaded ${Pe.toLocaleString()} matching occurrences…`)
        ), ke = /* @__PURE__ */ new Map();
        for (const Pe of W.entries)
          for (const ue of Pe.before.applications ?? [])
            ke.set(ue.tag.id, ue.tag.name);
        const rt = await eo(
          [
            .../* @__PURE__ */ new Set([
              ...W.actions.flatMap(
                (Pe) => Pe.steps.flatMap((ue) => ue.tagIds)
              ),
              ...W.review.occurrence.conditionTagIds,
              ...Ii(W.review.view.objectFilter)
            ])
          ].filter((Pe) => !ke.has(Pe)),
          "tags",
          De.current.signal
        );
        De.current.signal.throwIfAborted(), I({ ...Object.fromEntries(ke), ...Object.fromEntries(rt) }), g(W), K("Preview ready. No tags have been changed.");
      } catch (W) {
        E(
          De.current.signal.aborted ? "Preview cancelled. No tags were changed." : String(W instanceof Error ? W.message : W)
        ), K("");
      } finally {
        ye.current = !1, m(!1), De.current = null;
      }
    }
  }
  async function k(T) {
    if (!d || ye.current) return;
    ye.current = !0, be.current = !1, Ce.current = !0, nt.current.onWrite(), m(!0), x(!0), E(""), T === "undo" && O(!0), K(T === "undo" ? "Undoing batch…" : "Applying batch…");
    const W = () => ve((ke) => ke + 1);
    try {
      T === "undo" ? await Zs(d, () => be.current, W) : await Xs(
        d,
        w,
        () => be.current,
        W,
        T === "retry"
      ), K(
        be.current ? "Stopped after in-flight operations settled. Completed changes are retained." : T === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (ke) {
      E(ke instanceof Error ? ke.message : String(ke));
    } finally {
      tt.current = Date.now(), ye.current = !1, m(!1), Dt((ke) => ke + 1), W();
    }
  }
  const G = (d == null ? void 0 : d.entries) ?? [], _e = ze(
    () => new Map(
      ((d == null ? void 0 : d.entries) ?? []).map((T) => [
        T.item.key,
        Tr(T.before.ids, d.action, d.categories, w)
      ])
    ),
    [d, w]
  ), Se = (T) => _e.get(T.item.key), Q = (T) => jn(T.before.ids, Se(T).desired), Tt = (T) => {
    const W = Q(T);
    return T.status === "pending" && (W.added.length > 0 || W.removed.length > 0);
  }, dn = (T) => {
    const W = Se(T), ke = W.skipped ? jn(
      T.before.ids,
      Tr(T.before.ids, d.action, d.categories, !0).desired
    ) : Q(T);
    return [
      W.skipped ? "Skipped unless conflicting answers are replaced. " : "",
      `Add: ${je(ke.added)}; Remove: ${je(ke.removed)}`,
      ...W.kept.map(
        (rt) => `; Keeps ${je(rt.existing)} instead of ${je(rt.tagIds)}`
      )
    ].join("");
  }, vt = G.filter((T) => T.conflict), pt = G.filter(
    (T) => Se(T).kept.length || Se(T).replaced.length
  ), Be = (T) => G.filter((W) => W.status === T).length, $e = G.some((T) => T.operation), je = (T) => T.map((W) => re[W] ?? `Tag ${W}`).join(", ") || "None", We = G.filter((T) => T.item.media.date).sort((T, W) => T.item.media.date.localeCompare(W.item.media.date)), Ut = (T, W) => /* @__PURE__ */ r(
    "a",
    {
      href: `/${ae}/${T.item.media.id}`,
      target: "_blank",
      rel: "noreferrer",
      "aria-label": `${W} ${F.one}, ${T.item.media.date}`,
      title: T.item.media.title || C,
      children: T.item.media.date
    }
  ), St = _.occurrence.targetMode === "selected" && _.occurrence.performerIds.length === 1, Rt = _n(_.occurrence.condition) && _.occurrence.includeSubtags !== !1 && _.occurrence.conditionTagIds.length > 0;
  return /* @__PURE__ */ c(ce, { children: [
    /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        hidden: n,
        ref: jt,
        title: "Apply answers to all matching occurrences",
        disabled: t || !le.length,
        onClick: () => {
          Qe(), o(), l(!0);
        },
        children: [
          /* @__PURE__ */ r(Ma, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    p && /* @__PURE__ */ c(
      "dialog",
      {
        ref: _t,
        className: "dq-batch-dialog",
        "aria-labelledby": "dq-batch-title",
        "aria-modal": "true",
        onCancel: (T) => {
          T.preventDefault(), Ae();
        },
        children: [
          /* @__PURE__ */ r("h2", { id: "dq-batch-title", children: "Batch occurrence approval" }),
          /* @__PURE__ */ r("p", { children: "Apply one or more answers across all matching pages. Only targeted performer occurrences change." }),
          /* @__PURE__ */ r("p", { children: "Keep this page open while running. Results and undo last until you close this dialog or start a new batch." }),
          /* @__PURE__ */ c("fieldset", { disabled: q || M, children: [
            /* @__PURE__ */ r("legend", { children: "Batch scope and answers" }),
            /* @__PURE__ */ r("p", { children: "Uses your current filters. To include every existing appearance, remove filters that exclude already answered occurrences." }),
            /* @__PURE__ */ c("p", { children: [
              "Performer scope:",
              " ",
              vi(_.occurrence) ? "All performers" : _.occurrence.targetMode === "selected" ? X.join(", ") || `${_.occurrence.performerIds.length} selected performer(s)` : "Matching performer criteria",
              ". Occurrence condition:",
              " ",
              Mr[_.occurrence.condition],
              "."
            ] }),
            i.length > 0 && /* @__PURE__ */ c("p", { className: "dq-batch-flag", children: [
              /* @__PURE__ */ c("strong", { children: [
                "Flagged: ",
                i.join(", "),
                "."
              ] }),
              " Check the earliest and latest ",
              F.many,
              " before applying, or narrow the batch with a date filter."
            ] }),
            _n(_.occurrence.condition) && _.occurrence.hideConfirmedAbsent !== !1 && /* @__PURE__ */ r("p", { children: _.occurrence.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged." }),
            _.occurrence.conditionTagIds.length > 0 && d && /* @__PURE__ */ c("p", { children: [
              "Condition tags:",
              " ",
              je(_.occurrence.conditionTagIds),
              _.occurrence.includeSubtags === !1 ? " (exact tags only)" : " (including subtags)",
              "."
            ] }),
            /* @__PURE__ */ c("p", { children: [
              "Search: ",
              String(_.view.filter.q || "Any"),
              ".",
              " ",
              Object.keys(_.view.objectFilter).length === 0 && `${J[0].toUpperCase()}${J.slice(1)} filters: None.`
            ] }),
            /* @__PURE__ */ r(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": `Batch ${J} filters`,
                children: /* @__PURE__ */ r(
                  rr,
                  {
                    filter: _.view.filter,
                    objectFilter: Oi(
                      _.view.objectFilter,
                      re
                    ),
                    criteriaDefinitions: ae === "audio" ? hi : Rr,
                    customFieldEntityType: ae,
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
            _.occurrence.targetMode === "filter" && /* @__PURE__ */ r(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": "Batch performer criteria",
                children: /* @__PURE__ */ r(
                  rr,
                  {
                    filter: {},
                    objectFilter: _.occurrence.performerFilter,
                    criteriaDefinitions: mi,
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
            St && /* @__PURE__ */ r(
              na,
              {
                review: _,
                performerId: _.occurrence.performerIds[0],
                revision: Lt
              }
            ),
            !le.length && /* @__PURE__ */ r("p", { children: "Configure an occurrence tag action in this review before starting a batch." }),
            /* @__PURE__ */ c("fieldset", { className: "dq-batch-answers", children: [
              /* @__PURE__ */ r("legend", { children: "Answers" }),
              le.map((T) => /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: M || h.includes(T.id),
                    onChange: (W) => {
                      y(
                        W.target.checked ? [...h, T.id] : h.filter((ke) => ke !== T.id)
                      ), g(null), K(""), E("");
                    }
                  }
                ),
                T.label
              ] }, T.id))
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: !h.length,
                onClick: () => void se(),
                children: "Preview all matches"
              }
            ),
            /* @__PURE__ */ c("label", { children: [
              "Conflicting answers",
              " ",
              /* @__PURE__ */ c(
                "select",
                {
                  "aria-label": "Conflicting answers",
                  value: w ? "replace" : "skip",
                  onChange: (T) => S(T.target.value === "replace"),
                  children: [
                    /* @__PURE__ */ r("option", { value: "skip", children: "Skip conflicts" }),
                    /* @__PURE__ */ r("option", { value: "replace", children: "Replace conflicting answers" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ c("p", { children: [
              "Conflicts are existing tags an answer removes. Configure opposite answers as removals.",
              Rt && " Each condition tag with its subtags is a category: an answer is added only where its category is still empty, and a different existing answer is kept unless conflicting answers are replaced."
            ] })
          ] }),
          /* @__PURE__ */ c("div", { "aria-live": "polite", children: [
            L && /* @__PURE__ */ r("p", { role: "status", children: L }),
            R && /* @__PURE__ */ r("p", { role: "alert", children: R }),
            d && /* @__PURE__ */ c(ce, { children: [
              /* @__PURE__ */ r("p", { children: /* @__PURE__ */ c("strong", { children: [
                G.length.toLocaleString(),
                " occurrences in",
                " ",
                new Set(
                  G.map((T) => T.item.media.id)
                ).size.toLocaleString(),
                " ",
                J,
                "s"
              ] }) }),
              M ? /* @__PURE__ */ c("p", { children: [
                Be("changed"),
                " changed; ",
                Be("unchanged"),
                " unchanged;",
                " ",
                Be("skipped"),
                " skipped; ",
                Be("failed"),
                " failed;",
                " ",
                Be("pending"),
                " remaining."
              ] }) : /* @__PURE__ */ c("p", { children: [
                G.filter(Tt).length.toLocaleString(),
                " to change; ",
                Be("unchanged").toLocaleString(),
                " already correct; ",
                vt.length.toLocaleString(),
                " conflicts (",
                w ? "will replace" : "will skip",
                ").",
                pt.length > 0 && ` ${pt.length.toLocaleString()} already have a different answer in a category (${w ? "will replace" : "kept"}).`
              ] }),
              G.length > 0 && /* @__PURE__ */ c("p", { children: [
                "Dates:",
                " ",
                We.length ? /* @__PURE__ */ c(ce, { children: [
                  Ut(We[0], "Earliest"),
                  We.length > 1 && /* @__PURE__ */ c(ce, { children: [
                    " to ",
                    Ut(We[We.length - 1], "Latest")
                  ] })
                ] }) : "none",
                We.length < G.length && `; ${(G.length - We.length).toLocaleString()} without a date`,
                "."
              ] })
            ] })
          ] }),
          d && /* @__PURE__ */ c(ce, { children: [
            !M && /* @__PURE__ */ c("p", { children: [
              "Planned additions:",
              " ",
              je([
                ...new Set(G.flatMap((T) => Q(T).added))
              ]),
              ". Planned removals:",
              " ",
              je([
                ...new Set(G.flatMap((T) => Q(T).removed))
              ]),
              "."
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => oe(!qe),
                children: qe ? "Hide occurrence details" : "Inspect occurrences and conflicts"
              }
            ),
            qe && /* @__PURE__ */ r("div", { className: "dq-batch-items", children: /* @__PURE__ */ c("table", { children: [
              /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ c("tr", { children: [
                /* @__PURE__ */ r("th", { children: "Occurrence" }),
                /* @__PURE__ */ r("th", { children: "Changes / result" })
              ] }) }),
              /* @__PURE__ */ r("tbody", { children: G.map((T) => {
                var W;
                return /* @__PURE__ */ c("tr", { children: [
                  /* @__PURE__ */ r("td", { children: /* @__PURE__ */ c(
                    "a",
                    {
                      href: `/${ae}/${T.item.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      children: [
                        (W = T.item.occurrence) == null ? void 0 : W.performer.name,
                        " —",
                        " ",
                        T.item.media.title || C
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ c("td", { children: [
                    T.conflict && /* @__PURE__ */ r("strong", { children: "Conflict. " }),
                    M ? `${T.status}. ${T.error ?? ""}` : dn(T)
                  ] })
                ] }, T.item.key);
              }) })
            ] }) }),
            /* @__PURE__ */ c("div", { className: "dq-row", children: [
              !j && /* @__PURE__ */ c(ce, { children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "dq-button primary",
                    disabled: q || !Be("pending"),
                    onClick: () => void k("apply"),
                    children: M ? "Continue remaining" : "Apply batch"
                  }
                ),
                M && Be("failed") > 0 && /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: q,
                    onClick: () => void k("retry"),
                    children: "Retry failed occurrences"
                  }
                )
              ] }),
              $e && /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  disabled: q,
                  onClick: () => void k("undo"),
                  children: "Undo batch"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ c("div", { className: "dq-row", children: [
            q && /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => {
                  var T;
                  be.current = !0, (T = De.current) == null || T.abort(), K("Stopping after in-flight operations settle…");
                },
                children: [
                  "Cancel ",
                  De.current ? "preview" : "run"
                ]
              }
            ),
            M && /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: q,
                onClick: Qe,
                children: "New batch"
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: q,
                onClick: Ae,
                children: "Close"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
function rc(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const i of n.steps)
        i.mode === "REMOVE_TREE" && i.tagIds.forEach((o) => t.add(o));
  return [...t];
}
function ra(e, t, n) {
  const i = Pr(e), o = [], s = [];
  for (const y of e.steps) {
    if (y.mode !== "REMOVE_TREE") {
      s.push(y);
      continue;
    }
    const w = y.tagIds.flatMap((S) => {
      const q = n.get(S);
      return q || o.push(S), q ?? [S];
    });
    s.push({ mode: "REMOVE", tagIds: w.filter((S) => !i.has(S)) });
  }
  const a = [
    ...s.filter((y) => !Qt(y.mode)),
    ...s.filter((y) => Qt(y.mode))
  ], p = new Set(t.ids), l = new Set(t.absent);
  for (const y of a)
    for (const w of y.tagIds)
      switch (y.mode) {
        case "ADD":
          p.add(w);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          p.delete(w);
          break;
        case "MARK_PRESENT":
          p.add(w), l.delete(w);
          break;
        case "MARK_ABSENT":
          p.delete(w), l.add(w);
          break;
        case "CLEAR_ABSENCE":
          l.delete(w);
          break;
      }
  const d = new Set(t.ids), g = new Set(t.absent), h = [...new Set(e.steps.flatMap((y) => y.tagIds))];
  return {
    added: h.filter((y) => p.has(y) && !d.has(y)),
    removed: [...d].filter((y) => !p.has(y)),
    markedAbsent: h.filter((y) => l.has(y) && !g.has(y)),
    absenceCleared: [...g].filter((y) => !l.has(y)),
    unresolvedTrees: [...new Set(o)]
  };
}
function ic(e) {
  if (e.applications) {
    const t = /* @__PURE__ */ new Map();
    for (const n of e.applications)
      t.has(n.tag.id) || t.set(n.tag.id, n.tag.name);
    return [...t].map(([n, i]) => ({ id: n, name: i }));
  }
  return e.ids.map((t, n) => ({ id: t, name: e.names[n] ?? "" }));
}
function oc(e) {
  const t = rc(e).sort((a, p) => a - p).join(","), [n, i] = N(() => /* @__PURE__ */ new Map()), o = P(/* @__PURE__ */ new Set()), s = P(!0);
  return z(() => (s.current = !0, () => {
    s.current = !1;
  }), []), z(() => {
    const a = t ? t.split(",").map(Number) : [];
    for (const p of a)
      o.current.has(p) || (o.current.add(p), xr([p]).then(
        (l) => {
          s.current && i((d) => new Map(d).set(p, l));
        },
        () => {
          o.current.delete(p);
        }
      ));
  }, [t]), n;
}
function ac() {
  let e = null;
  const t = /* @__PURE__ */ new Set(), n = (i) => {
    i !== e && (e = i, t.forEach((o) => o()));
  };
  return {
    get: () => e,
    set: n,
    clear: (i) => {
      e === i && n(null);
    },
    subscribe: (i) => (t.add(i), () => t.delete(i))
  };
}
function ia(e) {
  return Sa(e.subscribe, e.get, e.get);
}
const to = [
  { indent: 0, slots: Vr(0, 11), fixed: [] },
  { indent: 1, slots: Vr(11, 22), fixed: [] },
  { indent: 2, slots: Vr(22, 27), fixed: ["n", "m", ",", "."] }
];
function Vr(e, t) {
  return Array.from({ length: t - e }, (n, i) => e + i);
}
function no(e, t) {
  return e === "g" ? "Go to…" : e === "f" ? t === "video" ? "Fullscreen · filters" : "Filters" : t === "video" && e === "k" ? "Play / pause" : t === "video" && e === "m" ? "Mute" : "";
}
function qn({ binding: e }) {
  return /* @__PURE__ */ r("kbd", { className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key", children: e });
}
function ro(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function sc({
  actions: e,
  mediaKind: t,
  isDisabled: n,
  busy: i,
  tags: o,
  trees: s,
  preview: a,
  onApply: p,
  onFind: l,
  findDisabled: d
}) {
  const g = Un(), h = ar(), y = lr(
    ze(() => e.flatMap((E) => E.steps.flatMap((L) => L.tagIds)), [e])
  ), w = to.filter((E) => E.slots.some((L) => L < e.length)), S = w.length === to.length, q = Math.max(0, e.length - Cn.length), m = (E) => ({
    onMouseEnter: () => a.set(E),
    onMouseLeave: () => a.clear(E),
    onFocus: () => a.set(E),
    onBlur: (L) => {
      L.currentTarget.contains(L.relatedTarget) || a.clear(E);
    }
  }), R = (E) => {
    const L = e[E], K = g.action(E);
    if (!L) {
      const M = K === Cn[E] ? no(K, t) : "";
      return /* @__PURE__ */ c(
        "div",
        {
          className: `dq-pad-slot dq-pad-free${M ? " dq-pad-reserved" : ""}`,
          "aria-hidden": "true",
          children: [
            K && /* @__PURE__ */ r(qn, { binding: K }),
            M && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: M })
          ]
        },
        E
      );
    }
    const re = n(L), I = `${h}-effect-${E}`;
    return /* @__PURE__ */ c("div", { className: "dq-pad-slot", ...m(L), children: [
      /* @__PURE__ */ r("span", { id: I, className: "dq-sr-only", children: Ai(L, y, [], s).map((M) => M.text).join(", ") }),
      /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: L.label,
          "aria-keyshortcuts": K || void 0,
          "aria-describedby": I,
          disabled: re,
          onClick: (M) => p(L, M.shiftKey),
          children: [
            K && /* @__PURE__ */ r(qn, { binding: K }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-pad-label", children: L.label }),
            ro(L) && " ",
            ro(L) && /* @__PURE__ */ c("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(Yr, { "aria-hidden": "true" }),
              "absent"
            ] })
          ]
        }
      ),
      L.steps.length > 0 && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-pad-pin",
          "aria-label": `Apply and stay: ${L.label}`,
          title: "Apply and stay (Shift)",
          disabled: re,
          onClick: () => p(L, !0),
          children: /* @__PURE__ */ r($a, { "aria-hidden": "true" })
        }
      )
    ] }, E);
  };
  return /* @__PURE__ */ c("section", { className: "dq-pad", "aria-label": "Actions", "aria-busy": i || void 0, children: [
    /* @__PURE__ */ c("div", { className: "dq-pad-header", children: [
      /* @__PURE__ */ r(
        cc,
        {
          actions: e,
          names: y,
          tags: o,
          trees: s,
          preview: a,
          extra: q,
          findKey: g.find
        }
      ),
      /* @__PURE__ */ c("span", { className: "dq-pad-hint", children: [
        /* @__PURE__ */ r("kbd", { className: "dq-key", children: "Shift" }),
        /* @__PURE__ */ r("span", { children: "+ key applies and stays" })
      ] }),
      !S && /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-pad-find-button",
          "aria-label": "Find action",
          "aria-keyshortcuts": g.find || void 0,
          disabled: d,
          onClick: l,
          children: [
            g.find && /* @__PURE__ */ r(qn, { binding: g.find }),
            /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "Find action" })
          ]
        }
      )
    ] }),
    w.map((E) => /* @__PURE__ */ c("div", { className: "dq-pad-row", "data-indent": E.indent, children: [
      E.slots.map(R),
      E.fixed.map((L) => {
        const K = no(L, t);
        return /* @__PURE__ */ c(
          "div",
          {
            className: `dq-pad-slot dq-pad-free dq-pad-fixed${K ? " dq-pad-reserved" : ""}`,
            "aria-hidden": "true",
            children: [
              /* @__PURE__ */ r(qn, { binding: L }),
              K && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: K })
            ]
          },
          L
        );
      }),
      E.fixed.length > 0 && /* @__PURE__ */ r("div", { className: "dq-pad-slot", children: /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-pad-tile dq-pad-find",
          "aria-label": q ? `Find action, ${q} more` : "Find action",
          "aria-keyshortcuts": g.find || void 0,
          disabled: d,
          onClick: l,
          children: [
            g.find && /* @__PURE__ */ r(qn, { binding: g.find }),
            /* @__PURE__ */ c("span", { className: "dq-pad-label", children: [
              /* @__PURE__ */ r(bi, { "aria-hidden": "true" }),
              q ? `${q} more` : "Find action"
            ] })
          ]
        }
      ) })
    ] }, E.indent))
  ] });
}
function cc({
  actions: e,
  names: t,
  tags: n,
  trees: i,
  preview: o,
  extra: s,
  findKey: a
}) {
  const p = Un(), l = ia(o), d = l ? e.indexOf(l) : -1;
  if (!l || d < 0)
    return /* @__PURE__ */ c("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      s > 0 && /* @__PURE__ */ c(ce, { children: [
        ` · ${Cn.length} on keys, ${s} more under `,
        a ? /* @__PURE__ */ r(qn, { binding: a }) : "Find action"
      ] })
    ] });
  const g = p.action(d), h = n && l.steps.length ? ra(l, n, i) : null, y = h && !h.unresolvedTrees.length && ![h.added, h.removed, h.markedAbsent, h.absenceCleared].some(
    (w) => w.length
  );
  return /* @__PURE__ */ c("p", { className: "dq-pad-effect", children: [
    g && /* @__PURE__ */ r(qn, { binding: g }),
    /* @__PURE__ */ r("strong", { children: l.label }),
    Ai(l, t, [], i).map((w, S) => /* @__PURE__ */ r("span", { "data-effect-tone": w.tone, children: w.text }, S)),
    y && /* @__PURE__ */ r("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
const oa = "data-quality.description-collapsed.v1";
function lc() {
  try {
    return localStorage.getItem(oa) === "true";
  } catch {
    return !1;
  }
}
function dc({
  details: e,
  label: t
}) {
  const [n, i] = N(lc), o = an(() => {
    i((s) => {
      const a = !s;
      try {
        localStorage.setItem(oa, String(a));
      } catch {
      }
      return a;
    });
  }, []);
  return /* @__PURE__ */ c("section", { className: "dq-media-description", "aria-label": `${t} description`, children: [
    /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button dq-description-toggle",
        "aria-expanded": !n,
        onClick: o,
        children: "Description"
      }
    ),
    !n && (e != null && e.trim() ? /* @__PURE__ */ r(qa, { className: "dq-description-body", children: e }) : /* @__PURE__ */ r("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
function Xn({
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
function uc({
  ranking: e,
  busy: t,
  error: n,
  focus: i,
  disabled: o,
  labels: s,
  onFocus: a,
  onMore: p,
  onRefresh: l
}) {
  var h;
  const d = e ? e.ranked.slice(0, e.limit) : [], g = !!e && (e.ranked.length > e.limit || (((h = e.candidates[e.cursor]) == null ? void 0 : h.total) ?? 0) > 0);
  return /* @__PURE__ */ c("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ c("div", { className: "dq-performer-ranking-status", children: [
      n ? /* @__PURE__ */ c("p", { role: "alert", children: [
        "Could not rank performers. ",
        n
      ] }) : t ? /* @__PURE__ */ c("p", { role: "status", children: [
        "Counting matching ",
        s.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ r("p", { children: d.length ? `Most matching ${s.queue}s first` : `No performer has matching ${s.many}.` }) : null,
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "Refresh counts",
          title: "Refresh counts",
          disabled: t || o,
          onClick: l,
          children: /* @__PURE__ */ r(Pa, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-queue-list", children: d.map((y) => {
      const w = `${y.count.toLocaleString()} matching ${y.count === 1 ? s.one : s.many}`, S = y.flags.length ? `Flagged: ${y.flags.join(", ")}` : "";
      return /* @__PURE__ */ c(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${y.name}, ${w}${S ? `. ${S}` : ""}`,
          title: S || void 0,
          "aria-current": i === y.id ? "true" : void 0,
          disabled: o,
          onClick: () => a(y.id),
          children: [
            /* @__PURE__ */ r(Xn, { performer: y }),
            /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: y.name }),
            S && /* @__PURE__ */ r(Xr, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ r("span", { className: "dq-ranked-count", "aria-hidden": "true", children: y.count.toLocaleString() })
          ]
        },
        y.id
      );
    }) }),
    g && !t && !n && /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button dq-ranking-more",
        disabled: o,
        onClick: p,
        children: "Show more performers"
      }
    )
  ] });
}
const aa = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
};
function xi({ entityType: e }) {
  const t = aa[e];
  return e === "tag" ? /* @__PURE__ */ r(Fa, { role: "img", "aria-label": t }) : Zn(e) === "audio" ? /* @__PURE__ */ r(vo, { role: "img", "aria-label": t }) : /* @__PURE__ */ r(Nr, { role: "img", "aria-label": t });
}
function fc({
  name: e,
  description: t,
  entityType: n,
  onBack: i,
  backDisabled: o,
  onEdit: s,
  editDisabled: a,
  toolbar: p,
  trailing: l,
  chipsStart: d,
  chipsEnd: g
}) {
  return /* @__PURE__ */ c("header", { className: "dq-review-header", children: [
    /* @__PURE__ */ c("div", { className: "dq-review-header-lead", children: [
      i && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: o,
          onClick: i,
          children: /* @__PURE__ */ r(Ir, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-type", title: aa[n], children: /* @__PURE__ */ r(xi, { entityType: n }) }),
      /* @__PURE__ */ r("h1", { title: t || e, children: e }),
      t && /* @__PURE__ */ r("p", { className: "dq-sr-only", children: t }),
      s && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button dq-icon-button-small",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: a,
          onClick: s,
          children: /* @__PURE__ */ r(Or, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    p,
    /* @__PURE__ */ r("div", { className: "dq-review-header-trail", children: l }),
    /* @__PURE__ */ r("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    d,
    g && /* @__PURE__ */ r("div", { className: "dq-review-chips-end", children: g })
  ] });
}
function pc({
  page: e,
  pages: t,
  onPage: n
}) {
  const [i, o] = N(!1), [s, a] = N(""), p = P(null), l = P(null);
  z(() => {
    var h;
    i && ((h = p.current) == null || h.select());
  }, [i]);
  const d = (h) => {
    o(!1), h && requestAnimationFrame(() => {
      var y;
      return (y = l.current) == null ? void 0 : y.focus();
    });
  }, g = () => {
    const h = Math.round(Number(s));
    d(!0), Number.isFinite(h) && h >= 1 && h !== e && n(Math.min(t, h));
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
        children: /* @__PURE__ */ r(Ir, { "aria-hidden": "true" })
      }
    ),
    i ? /* @__PURE__ */ r(
      "input",
      {
        ref: p,
        type: "number",
        className: "dq-pager-input",
        "aria-label": `Go to page, 1 to ${t}`,
        min: 1,
        max: t,
        value: s,
        onChange: (h) => a(h.target.value),
        onKeyDown: (h) => {
          h.key === "Enter" ? (h.preventDefault(), g()) : h.key === "Escape" && (h.preventDefault(), h.stopPropagation(), d(!0));
        },
        onBlur: () => d(!1)
      }
    ) : /* @__PURE__ */ c(
      "button",
      {
        ref: l,
        type: "button",
        className: "dq-pager-page",
        "aria-label": `Page ${e} of ${t}. Go to page`,
        title: "Go to page",
        disabled: t <= 1,
        onClick: () => {
          a(String(e)), o(!0);
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
        children: /* @__PURE__ */ r(yi, { "aria-hidden": "true" })
      }
    )
  ] });
}
function hc({
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
          /* @__PURE__ */ r(xa, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ r(La, { "aria-hidden": "true" }),
          "Grid"
        ]
      }
    )
  ] });
}
function mc({
  items: e,
  disabled: t
}) {
  const [n, i] = N(!1), o = P(null), s = P(null), a = ar();
  z(() => {
    var d, g;
    n && ((g = (d = s.current) == null ? void 0 : d.querySelector('[role="menuitem"]:not(:disabled)')) == null || g.focus());
  }, [n]), z(() => {
    t && i(!1);
  }, [t]);
  const p = (d = !0) => {
    var g;
    i(!1), d && ((g = o.current) == null || g.focus());
  };
  return /* @__PURE__ */ c("div", { className: "dq-menu", onKeyDown: (d) => {
    var y, w;
    if (!n) return;
    const g = [
      ...((y = s.current) == null ? void 0 : y.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], h = g.indexOf(document.activeElement);
    if (d.key === "Escape")
      d.preventDefault(), d.stopPropagation(), p();
    else if (d.key === "Tab")
      p(!1);
    else if (d.key === "ArrowDown" || d.key === "ArrowUp") {
      if (d.preventDefault(), !g.length) return;
      const S = d.key === "ArrowDown" ? 1 : -1;
      g[(h + S + g.length) % g.length].focus();
    } else (d.key === "Home" || d.key === "End") && (d.preventDefault(), (w = g.at(d.key === "Home" ? 0 : -1)) == null || w.focus());
  }, children: [
    /* @__PURE__ */ r(
      "button",
      {
        ref: o,
        type: "button",
        className: "dq-icon-button",
        "aria-label": "More review options",
        title: "More review options",
        "aria-haspopup": "menu",
        "aria-expanded": n,
        "aria-controls": n ? a : void 0,
        disabled: t,
        onClick: () => i((d) => !d),
        children: /* @__PURE__ */ r(Da, { "aria-hidden": "true" })
      }
    ),
    n && /* @__PURE__ */ c(ce, { children: [
      /* @__PURE__ */ r("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => p(!1) }),
      /* @__PURE__ */ r(
        "div",
        {
          ref: s,
          id: a,
          role: "menu",
          "aria-label": "More review options",
          className: "dq-menu-list",
          children: e.map((d) => /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              role: "menuitem",
              disabled: d.disabled,
              onClick: () => {
                p(), d.onSelect();
              },
              children: d.label
            },
            d.label
          ))
        }
      )
    ] })
  ] });
}
const gc = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], bc = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function yc(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), i = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), o = t.bottom + 8;
  return { top: o, left: i, width: n, maxHeight: Math.max(160, window.innerHeight - o - 16) };
}
function wr(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function wc(e, t) {
  const n = vi(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", i = e.conditionTagIds.map(
    (s) => t[s] === void 0 ? "…" : t[s] ?? "Unavailable tag"
  ), o = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${wr(i, "or")}`,
    includesAll: `has ${wr(i, "and")}`,
    excludes: `has none of ${wr(i, "or")}`,
    excludesAll: `missing ${wr(i, "or")}`
  };
  return `${n} · ${o[e.condition]}`;
}
function vc({
  scope: e,
  disabled: t,
  onChange: n,
  onEditCriteria: i
}) {
  const [o, s] = N(!1), [a, p] = N(null), l = P(null), d = P(null), g = ar(), h = lr(e.conditionTagIds), y = wc(e, h);
  nr(() => {
    if (!o || !l.current) return;
    const m = () => l.current && p(yc(l.current));
    return m(), window.addEventListener("resize", m), () => window.removeEventListener("resize", m);
  }, [o]), z(() => {
    var R, E;
    if (!o) return;
    const m = (R = d.current) == null ? void 0 : R.querySelector('[aria-pressed="true"]');
    m && !m.disabled ? m.focus() : (E = d.current) == null || E.focus();
  }, [o]);
  const w = () => {
    s(!1), requestAnimationFrame(() => {
      var m;
      return (m = l.current) == null ? void 0 : m.focus();
    });
  }, S = (m) => {
    if (!(m.target instanceof Element && m.target.closest('[role="dialog"]') !== d.current || m.defaultPrevented)) {
      if (m.key === "Escape")
        m.preventDefault(), w();
      else if (m.key === "Tab" && d.current) {
        const E = [...d.current.querySelectorAll(bc)].filter((I) => I.closest('[role="dialog"]') === d.current).sort(
          (I, M) => I.compareDocumentPosition(M) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!E.length) return;
        const L = E[0], K = E[E.length - 1], re = document.activeElement;
        m.shiftKey && (re === L || re === d.current) ? (m.preventDefault(), K.focus()) : !m.shiftKey && re === K && (m.preventDefault(), L.focus());
      }
    }
  }, q = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ c("div", { className: "dq-scope", children: [
    /* @__PURE__ */ c(
      "button",
      {
        ref: l,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        "aria-controls": o ? g : void 0,
        title: y,
        onClick: () => o ? w() : s(!0),
        children: [
          /* @__PURE__ */ r(_a, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-summary", children: y }),
          /* @__PURE__ */ r(ja, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ c(ce, { children: [
      /* @__PURE__ */ r("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: w }),
      /* @__PURE__ */ c(
        "div",
        {
          ref: d,
          id: g,
          role: "dialog",
          "aria-label": "Queue scope",
          className: "dq-scope-popover",
          tabIndex: -1,
          style: a ? {
            top: a.top,
            left: a.left,
            width: a.width,
            maxHeight: a.maxHeight
          } : void 0,
          onKeyDown: S,
          children: [
            /* @__PURE__ */ c("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: gc.map(({ mode: m, label: R }) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === m,
                  onClick: () => e.targetMode !== m && n({ targetMode: m }),
                  children: R
                },
                m
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ r(
                xt,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (m) => n({ performerIds: m }),
                  placeholder: "All performers...",
                  allowCreate: !1
                }
              ),
              e.targetMode === "filter" && /* @__PURE__ */ c("div", { className: "dq-scope-criteria", children: [
                /* @__PURE__ */ r("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ r(
                  rr,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: mi,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (m) => n({ performerFilter: m })
                  }
                ) }),
                /* @__PURE__ */ c("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ r(Or, { "aria-hidden": "true" }),
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
                  onChange: (m) => n({ condition: m.target.value }),
                  children: $r.map((m) => /* @__PURE__ */ r("option", { value: m, children: Mr[m] }, m))
                }
              ),
              q && /* @__PURE__ */ c(ce, { children: [
                /* @__PURE__ */ r(
                  xt,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (m) => n({ conditionTagIds: m }),
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
                        onChange: (m) => n({ includeSubtags: m.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  _n(e.condition) && /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.hideConfirmedAbsent ?? !0,
                        onChange: (m) => n({ hideConfirmedAbsent: m.target.checked })
                      }
                    ),
                    "Hide occurrences confirmed absent"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("div", { className: "dq-scope-footer", children: [
              /* @__PURE__ */ r("p", { children: "Applies to this queue at once. Save it to the review from the filter row." }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: w, children: "Done" })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function Sr(e) {
  const {
    page: t,
    perPage: n,
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
function Sc(e) {
  const t = e.occurrence;
  return JSON.stringify([
    he(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {},
    t.flagPerformerTagIds ?? []
  ]);
}
async function Nc(e, t) {
  const n = he(e) === "audio", i = new Set(e.occurrence.flagPerformerTagIds ?? []), o = (p) => ({
    id: p.id,
    name: p.name,
    total: (n ? p.audioCount : p.videoCount) ?? 0,
    flags: (p.tags ?? []).filter((l) => i.has(l.id)).map((l) => l.name)
  }), s = e.occurrence, a = [];
  if (s.targetMode === "selected" && s.performerIds.length > 0)
    for (const p of s.performerIds) {
      const l = await us(
        `/api/performers/${p}`,
        { signal: t }
      );
      l && a.push(o(l));
    }
  else {
    const { _filterExpression: p, ...l } = s.targetMode === "filter" ? s.performerFilter : {};
    for (let d = 1; ; d++) {
      const g = await ee(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            Wt({
              findFilter: {
                page: d,
                perPage: 1e3,
                sort: n ? "audio_count" : "video_count",
                direction: "desc"
              },
              objectFilter: l,
              filterExpression: p
            })
          )
        }
      );
      if (a.push(...g.items.map(o)), d * 1e3 >= g.totalCount || !g.items.length) break;
    }
  }
  return a.sort((p, l) => l.total - p.total || p.id - l.id);
}
function sa(e, t, n) {
  const i = $i(e, [t]);
  return hs(i, i.view.filter, n);
}
function ca(e, t) {
  const n = e.findIndex(
    (i) => i.count < t.count || i.count === t.count && i.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function di(e, t, n, i) {
  if (t >= e.length) return !0;
  const o = e[t].total;
  return o <= 0 ? !0 : n.length >= i && o < n[i - 1].count;
}
async function Ec(e, t, n, i, o = {}) {
  const s = Sr(e), a = Sc(e), p = Xo(e.occurrence), l = (t == null ? void 0 : t.signature) === s && !t.partial ? t : {
    signature: s,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: p ? "" : a,
    candidates: p ? [] : (t == null ? void 0 : t.candidatesKey) === a ? t.candidates : await Nc(e, i),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: d } = l, g = [...l.ranked];
  let h = l.cursor, y = !1;
  const w = (S) => ({
    ...l,
    cursor: h,
    ranked: [...g],
    limit: n,
    complete: !S && di(d, h, g, n),
    ...S ? { partial: S } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: o.concurrency ?? 6 }, async () => {
        var S;
        for (; !y && !di(d, h, g, n); ) {
          i.throwIfAborted();
          const q = d[h++], m = await sa(e, q.id, i);
          m > 0 && ca(g, { ...q, count: m }), (S = o.onProgress) == null || S.call(o, w(!0));
        }
      })
    );
  } catch (S) {
    throw y = !0, S;
  }
  return i.throwIfAborted(), w(!1);
}
function qc(e, t, n) {
  const i = e.candidates.findIndex((s) => s.id === t);
  if (e.partial || i < 0 || i >= e.cursor) return e;
  const o = e.ranked.filter((s) => s.id !== t);
  return n > 0 && ca(o, { ...e.candidates[i], count: n }), {
    ...e,
    ranked: o,
    complete: di(e.candidates, e.cursor, o, e.limit)
  };
}
function or(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((a, p) => or(a, t[p]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, i = t, o = Object.keys(n).sort(), s = Object.keys(i).sort();
  return o.length === s.length && o.every(
    (a, p) => a === s[p] && or(n[a], i[a])
  );
}
const Lr = [
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
], Cc = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function Dn(e) {
  const t = de(e) ? e.occurrence : void 0;
  return {
    filter: et({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, he(e)),
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
function io(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function ui(e, t) {
  let n;
  if (de(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!Lr.some((p) => p !== "performer" && t.has(p))) {
    const p = Dn(e);
    return {
      query: n ? { ...p, performerFocus: n } : p,
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
    const p = t.get("sorts").split(",").map((l) => {
      const d = l.lastIndexOf(":");
      return { key: l.slice(0, d), direction: l.slice(d + 1) };
    });
    if (p.some((l) => !l.key || !["asc", "desc"].includes(l.direction)))
      throw new Error("Invalid review URL sort.");
    o.sorts = p, o.sort = p[0].key, o.direction = p[0].direction;
  }
  let s;
  if (de(e) && (s = {
    ...Cc,
    ...io(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(s.targetMode) || !$r.includes(s.condition) || !Array.isArray(s.performerIds) || !Array.isArray(s.conditionTagIds) || typeof s.includeSubtags != "boolean" || typeof s.hideConfirmedAbsent != "boolean" || [...s.performerIds, ...s.conditionTagIds].some(
    (p) => !Number.isSafeInteger(p) || p <= 0
  ) || !s.performerFilter || typeof s.performerFilter != "object" || Array.isArray(s.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const a = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: et(o, he(e)),
      objectFilter: io(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: a,
      performerScope: s,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && a === "end"
  };
}
function tr(e, t) {
  const n = new URLSearchParams(window.location.search);
  Lr.forEach((i) => n.delete(i)), n.set("review", e);
  for (const i of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[i] !== void 0 && n.set(i, String(t.filter[i]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((i) => `${i.key}:${i.direction}`).join(",")
  ), n.set("filters", JSON.stringify(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${n}${window.location.hash}`
  );
}
function Pt(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return de(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function oo(e, t) {
  return !t || !de(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function Jr(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const i of e)
    n.set(i.media.id, [...n.get(i.media.id) ?? [], i]);
  return [...n.values()].reverse().flat();
}
const yt = (e) => e instanceof Error ? e.message : "Request failed.", zr = 50, ao = '[role="dialog"]:not(.dq-scope-popover), dialog[open]';
function Ac(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Aa(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? go(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function kc({ media: e, kind: t }) {
  const [n, i] = N(!1);
  return /* @__PURE__ */ r("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ r(vo, {}) : /* @__PURE__ */ r(Nr, {}) : /* @__PURE__ */ r(
    "img",
    {
      src: ii(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => i(!0)
    }
  ) });
}
function Tc({
  tags: e,
  preview: t,
  showPreview: n,
  trees: i,
  actionTagIds: o,
  label: s
}) {
  const a = ia(t), p = n ? a : null, l = e == null ? void 0 : e.absent, d = lr(
    ze(() => [...o, ...l ?? []], [o, l])
  ), g = (E) => d[E] === void 0 ? "…" : d[E] ?? "Unavailable tag", h = p && e ? ra(p, e, i) : null, y = e ? ic(e) : [], w = new Set(y.map((E) => E.id)), S = new Set(h == null ? void 0 : h.removed), q = new Set(h == null ? void 0 : h.markedAbsent), m = new Set(h == null ? void 0 : h.absenceCleared), R = /* @__PURE__ */ c("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ r(Yr, { "aria-hidden": "true" }),
    "absent"
  ] });
  return /* @__PURE__ */ c("section", { className: "dq-panel-section", "aria-label": s, children: [
    /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ c(ce, { children: [
      y.length || h != null && h.added.length || h != null && h.markedAbsent.length ? /* @__PURE__ */ c("ul", { className: "dq-chips", "aria-label": "Current tags", children: [
        y.map(
          (E) => S.has(E.id) ? /* @__PURE__ */ c("li", { className: "dq-chip dq-chip-removed", children: [
            /* @__PURE__ */ r("del", { children: E.name }),
            q.has(E.id) && R
          ] }, E.id) : /* @__PURE__ */ r("li", { className: "dq-chip", children: E.name }, E.id)
        ),
        h == null ? void 0 : h.added.map((E) => /* @__PURE__ */ r("li", { className: "dq-chip dq-chip-added", children: /* @__PURE__ */ c("ins", { children: [
          "+ ",
          g(E)
        ] }) }, `added-${E}`)),
        h == null ? void 0 : h.markedAbsent.filter((E) => !w.has(E)).map((E) => /* @__PURE__ */ c("li", { className: "dq-chip dq-chip-absent-new", children: [
          /* @__PURE__ */ r("ins", { children: g(E) }),
          R
        ] }, `absent-${E}`))
      ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ c(ce, { children: [
        /* @__PURE__ */ r("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ r("ul", { className: "dq-chips", "aria-label": "Confirmed absent tags", children: e.absent.map((E) => /* @__PURE__ */ c(
          "li",
          {
            className: `dq-chip dq-chip-absent${m.has(E) ? " dq-chip-removed" : ""}`,
            children: [
              /* @__PURE__ */ r(Yr, { "aria-hidden": "true" }),
              m.has(E) ? /* @__PURE__ */ r("del", { children: g(E) }) : g(E)
            ]
          },
          E
        )) })
      ] })
    ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading…" })
  ] });
}
function Rc({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: i,
  onSaveDefaults: o,
  editRequest: s = 0,
  renderRuleEditor: a,
  pageControls: p
}) {
  var hr;
  const l = he(e), d = wt(l), g = l === "audio" ? "Audio" : "Scene", h = (f) => {
    var b;
    return f.title || ((b = f.files[0]) == null ? void 0 : b.basename) || g;
  }, y = (f) => `${f.occurrence ? `${f.occurrence.performer.name} — ` : ""}${h(f.media)}`, w = P(null), S = P("");
  if (!w.current)
    try {
      w.current = ui(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (f) {
      S.current = yt(f), w.current = { query: Dn(e), startAtEnd: !1 };
    }
  const [q, m] = N(null), R = P(null), E = P(null), L = P(null), [K, re] = N(!!S.current), I = P(0), [M, x] = N(w.current.query), j = P(M);
  j.current = M;
  const [O, _] = N(0), ae = P(w.current.startAtEnd), [F, J] = N([]), [C, X] = N(null), ie = P(null), [qe, oe] = N(null), [ve, Lt] = N(0), Dt = ze(() => {
    if (!C) return null;
    const f = F.findIndex((b) => b.key === C.key);
    return f < 0 ? null : F.slice(f + 1).find((b) => b.media.id !== C.media.id) ?? null;
  }, [C, F]), [_t, jt] = N(0), [be, De] = N(!1), [Ce, tt] = N(!1), ye = P(!1), nt = P(!0), Qe = P(null);
  z(() => (nt.current = !0, () => {
    nt.current = !1;
  }), []);
  const [Ae, le] = N(S.current), [se, k] = N(""), [G, _e] = N(null), [Se, Q] = N(!1), [Tt, dn] = N([]), vt = P([]), pt = P(null), Be = P(null), $e = P(null);
  z(() => {
    var f, b;
    Se && ((b = (f = $e.current) == null ? void 0 : f.querySelector("input")) == null || b.focus());
  }, [Se]);
  const [je, We] = N(!1), [Ut, St] = N(!1);
  z(() => {
    if (be || je || !Be.current) return;
    const f = requestAnimationFrame(() => {
      if (document.querySelector(ao)) return;
      const b = Be.current;
      b != null && b.isConnected && !b.disabled && b.focus(), Be.current = null;
    });
    return () => cancelAnimationFrame(f);
  }, [be, je, O]);
  const [Rt, T] = N([]), [W, ke] = N({}), rt = P(null), Pe = P(0), [ue, kn] = N({});
  z(() => {
    let f = !0;
    return Promise.all(
      Ii(M.objectFilter).map(
        async (b) => [
          String(b),
          (await ee(`/api/tags/${b}`)).name
        ]
      )
    ).then((b) => {
      f && kn(Object.fromEntries(b));
    }).catch(() => {
    }), () => {
      f = !1;
    };
  }, [M.objectFilter]);
  const Dr = ze(
    () => Oi(M.objectFilter, ue),
    [ue, M.objectFilter]
  ), Ht = P(0), Ue = P(e);
  Ue.current = e;
  const ht = q ?? e, te = ze(
    () => Pt(ht, M),
    [ht, M]
  ), it = ze(
    () => oo(te, M.performerFocus),
    [te, M.performerFocus]
  ), He = P(it);
  He.current = it;
  const un = P(te);
  un.current = te;
  const [Kt, Tn] = N("items"), [ct, _r] = N(null), Fe = P(null), lt = P("");
  function Nt(f) {
    const b = typeof f == "function" ? f(Fe.current) : f;
    Fe.current = b, _r(b);
  }
  const [It, Yt] = N(!1), [Re, Ge] = N(null), me = P(null), Ne = de(te) ? Sr(te) : "", [Xt, dt] = N(0), [fn, Zt] = N(null);
  z(() => () => {
    var f;
    return (f = me.current) == null ? void 0 : f.controller.abort();
  }, []), z(() => {
    const f = me.current;
    !f || f.signature === Ne || (f.controller.abort(), me.current = null, Yt(!1));
  }, [Ne]), z(() => {
    var $;
    const f = Fe.current;
    if (Kt !== "performers" || !Ne || (($ = me.current) == null ? void 0 : $.signature) === Ne || lt.current === Ne || (f == null ? void 0 : f.signature) === Ne && f.complete)
      return;
    const b = (f == null ? void 0 : f.signature) === Ne ? f : null;
    tn(f, (b == null ? void 0 : b.limit) ?? zr);
  }, [Kt, Ne, ct, Re, It]);
  const mt = M.performerFocus, Ot = JSON.stringify(
    de(te) ? te.occurrence.flagPerformerTagIds ?? [] : []
  );
  z(() => {
    if (!mt) {
      Zt(null);
      return;
    }
    let f = !0;
    const b = new Set(JSON.parse(Ot));
    return ee(
      `/api/performers/${mt}`
    ).then(($) => {
      f && Zt({
        id: mt,
        name: $.name,
        flags: ($.tags ?? []).filter((B) => b.has(B.id)).map((B) => B.name)
      });
    }).catch(() => {
    }), () => {
      f = !1;
    };
  }, [mt, Ot]);
  const Kn = M.startFrom !== (e.view.startFrom ?? "end") || !or(
    JSON.parse($t(Pt(e, M))),
    JSON.parse($t(Pt(e, Dn(e))))
  ), Ye = Ce || be || Se, Bt = Number(M.filter.page);
  function xe(f, b = !1) {
    ye.current || (S.current = "", ae.current = b, j.current = f, x(f), jt(0), De(!0), b || tr(e.id, f), _(($) => $ + 1));
  }
  function pn() {
    if (ye.current = !1, tt(!1), nt.current && Qe.current) {
      const f = Qe.current;
      Qe.current = null, xe(f.query, f.startAtEnd);
    }
  }
  z(() => {
    const f = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const b = ui(
            Ue.current,
            new URLSearchParams(window.location.search)
          );
          ye.current ? Qe.current = b : xe(b.query, b.startAtEnd);
        } catch (b) {
          le(yt(b));
        }
    };
    return window.addEventListener("popstate", f), () => window.removeEventListener("popstate", f);
  }, [e.id]), z(() => (i(Ce || be || Se || !!q), () => i(!1)), [Ce, be, Se, !!q, i]);
  async function ne(f, b, $) {
    if (de(f)) {
      const H = await Zo(
        f,
        rt.current,
        b,
        $
      );
      return {
        items: H.items.map((V) => ({
          key: V.key,
          media: V.media,
          occurrence: V
        })),
        totalCount: H.totalCount
      };
    }
    const B = await er(
      f,
      { ...f.view.filter, page: b },
      $
    );
    return {
      items: B.items.map((H) => ({ key: String(H.id), media: H })),
      totalCount: B.totalCount
    };
  }
  function en(f, b, $, B = !1, H = !1) {
    if (!nt.current || Qe.current) return;
    re(!0), J(
      H ? f.items : Jr(f.items, j.current.startFrom === "end")
    ), jt(f.totalCount), Et($, B);
    const V = {
      ...j.current,
      filter: { ...j.current.filter, page: b }
    };
    j.current = V, x(V), tr(e.id, V);
  }
  function Et(f, b = !1) {
    (f == null ? void 0 : f.key) !== (C == null ? void 0 : C.key) && (ie.current = null), (f == null ? void 0 : f.media.id) !== (C == null ? void 0 : C.media.id) && oe(b && f ? f.media.id : null), X(f);
  }
  z(() => {
    if (S.current) return;
    const f = new AbortController();
    L.current = f;
    const b = ++Ht.current;
    return De(!0), le(""), k(""), ie.current = null, oe(null), X(null), J([]), Q(!1), (async () => {
      const $ = oo(
        Pt(Ue.current, j.current),
        j.current.performerFocus
      );
      rt.current = de($) ? await Mi($, f.signal) : null;
      let B = Number($.view.filter.page), H = await ne($, B, f.signal);
      const V = Math.max(
        1,
        Math.ceil(H.totalCount / Number($.view.filter.perPage))
      );
      (ae.current || B > V) && (B = V, H = await ne($, B, f.signal)), ae.current = !1;
      const pe = $.view.startFrom === "end" ? -1 : 1;
      for (; de($) && !H.items.length && B + pe >= 1 && B + pe <= V && !f.signal.aborted; )
        B += pe, H = await ne($, B, f.signal);
      if (b !== Ht.current || f.signal.aborted) return;
      const Ve = Jr(H.items, $.view.startFrom === "end");
      en(H, B, Ve[0] ?? null);
    })().catch(($) => {
      !f.signal.aborted && b === Ht.current && le(yt($));
    }).finally(() => {
      !f.signal.aborted && b === Ht.current && (re(!0), De(!1));
    }), () => {
      f.abort(), Ht.current++;
    };
  }, [O, e.id]), z(() => {
    if (_e(null), !C) return;
    let f = !0;
    return kt(l, C).then((b) => {
      f && (_e(b), T(
        de(e) ? b.ids.filter(($) => e.occurrence.tagIds.includes($)) : []
      ));
    }).catch((b) => {
      f && le(`Could not load current tags. ${yt(b)}`);
    }), () => {
      f = !1;
    };
  }, [C]), z(() => {
    if (!de(e) || e.actions.length)
      return;
    let f = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (b) => [
          b,
          (await ee(`/api/tags/${b}`)).name
        ]
      )
    ).then((b) => {
      f && ke(Object.fromEntries(b));
    }).catch((b) => {
      f && le(yt(b));
    }), () => {
      f = !1;
    };
  }, [e]);
  async function dr(f = !1, b = !1, $ = !1) {
    var Xe;
    if (!C) return;
    const B = F.findIndex((Ee) => Ee.key === C.key), H = M.startFrom === "end" ? -1 : 1, V = ((Xe = ie.current) == null ? void 0 : Xe.key) === C.key ? ie.current : { key: C.key, page: Bt, before: F.slice(0, B + 1).map((Ee) => Ee.key), after: F.slice(B + 1).map((Ee) => Ee.key) }, pe = new Set(V.after), Ve = new Set(V.before), qt = F.find((Ee) => {
      var ot;
      return pe.has(Ee.key) || (H === 1 || Bt < V.page) && ((ot = ie.current) == null ? void 0 : ot.key) === C.key && !Ve.has(Ee.key);
    });
    if (!f && qt) {
      Et(qt, $);
      return;
    }
    const Je = f ? Ve : new Set(F.map((Ee) => Ee.key)), ut = 1100 - (Date.now() - Pe.current);
    ut > 0 && await new Promise((Ee) => window.setTimeout(Ee, ut));
    let Ke = H === -1 && !f ? Math.max(1, Bt - 1) : Bt;
    for (; nt.current && !Qe.current; ) {
      let Ee = await ne(it, Ke);
      const ot = Math.max(
        1,
        Math.ceil(Ee.totalCount / Number(M.filter.perPage))
      );
      Ke > ot && (Ke = ot, Ee = await ne(it, Ke));
      const Jn = Jr(Ee.items, H === -1), zn = new Map(Jn.map((at) => [at.key, at])), Qn = f ? V.after.flatMap((at) => {
        const mr = zn.get(at);
        return mr ? [mr] : [];
      }) : [], Pn = new Set(Qn.map((at) => at.key)), Wn = f ? {
        ...Ee,
        items: [
          ...Qn,
          ...Jn.filter(
            (at) => at.key !== C.key && !Pn.has(at.key)
          )
        ]
      } : Ee;
      if (b) {
        ie.current = V, en(Wn, Ke, C, !1, f);
        return;
      }
      const Hn = H === -1 && Bt === 1 && !f ? void 0 : Wn.items.find(
        (at) => !Je.has(at.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(f && H === -1 && Ke === V.page) || pe.has(at.key))
      );
      if (Hn || (H === -1 ? Ke <= 1 : Ke >= ot)) {
        en(
          Wn,
          Ke,
          Hn ?? null,
          $,
          f
        ), Hn || k(
          Ee.totalCount ? `Reached the end in this direction. Matching items remain available from the ${d.queue} pages.` : `No matching ${d.many}.`
        );
        return;
      }
      Ke += H;
    }
  }
  async function gt(f, b = !1, $ = !1, B = !1) {
    if (q || !C || ye.current || be || Se && !$)
      return;
    const H = $ || B || !!(f != null && f.steps.length), V = H && !b;
    if (H && (!t || !G) || f && cn(f) && !n) return;
    ye.current = !0, tt(!0), le(""), k("");
    const pe = F.findIndex((Je) => Je.key === C.key), Ve = H && !b && pe >= 0 ? F[pe + 1] ?? null : null;
    Ve && (J(
      (Je) => Je.filter((ut) => ut.key !== C.key)
    ), Et(Ve, !0));
    let qt = !1;
    try {
      if (H) {
        const Je = await kt(l, C);
        if (f)
          await Js(it, C, f);
        else {
          const Ke = B && de(e) ? e.occurrence.tagIds.filter((ot) => Je.ids.includes(ot)) : vt.current, Ee = jn(Ke, B ? Rt : Tt);
          await Fi(it, C, Ee);
        }
        Pe.current = Date.now();
        const ut = await kt(l, C);
        Ve || _e(ut), qt = !0, Q(!1), k("Tags saved."), C.occurrence && (Gn(C.occurrence.performer.id), dt((Ke) => Ke + 1));
      }
      if (!nt.current || Qe.current) return;
      H ? await dr(!0, b, V) : b || await dr(), b && $ && requestAnimationFrame(() => {
        var Je;
        return (Je = pt.current) == null ? void 0 : Je.focus();
      });
    } catch (Je) {
      if (le(
        qt ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${yt(Je)}` : H ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${yt(Je)}` : `Could not advance. ${yt(Je)}`
      ), H && !qt) {
        Ve && (J(F), oe(null), Lt((ut) => ut + 1), X(C)), Pe.current = Date.now();
        try {
          _e(await kt(l, C));
        } catch {
          _e(null), le(
            (ut) => `${ut} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      pn();
    }
  }
  const Rn = !Se && !q && !je && !Ut && (C != null || be || Ce);
  Ci({
    surface: "local",
    enabled: Rn,
    actionCount: e.actions.length,
    onAction: (f, b) => {
      const $ = e.actions[f];
      $ && gt($, b);
    },
    onFind: () => St(!0)
  });
  const Mt = (f) => Ce || be || !G || !!q || !t && f.steps.length > 0 || !n && cn(f);
  function In() {
    !o || q || ye.current || Se || (E.current = document.activeElement, R.current = {
      error: Ae,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(j.current),
      items: F,
      current: C,
      total: _t,
      targets: rt.current,
      stayedCursor: ie.current
    }, m(structuredClone(Pt(e, j.current))), k(""), le(""));
  }
  z(() => {
    s && s !== I.current && K && !be && (I.current = s, In());
  }, [s, be, K]);
  function Gt() {
    m(null), requestAnimationFrame(() => {
      var f;
      return (f = E.current) == null ? void 0 : f.focus();
    });
  }
  function we() {
    var b;
    const f = R.current;
    !f || Ce || ((b = L.current) == null || b.abort(), Ht.current++, j.current = f.query, x(f.query), J(f.items), X(f.current), jt(f.total), rt.current = f.targets, ie.current = f.stayedCursor, De(!1), le(f.error), k(""), window.history.replaceState(window.history.state, "", f.url), Gt());
  }
  async function Bn() {
    if (!q || !o || ye.current) return;
    const f = Pt(
      { ...q, name: q.name.trim() },
      j.current
    ), b = Er(f);
    if (b) {
      le(b);
      return;
    }
    ye.current = !0, tt(!0), le("");
    try {
      if (await o(f) === !1) throw new Error("Could not save review.");
      Gt(), k("Review saved.");
    } catch ($) {
      le(
        "Could not save review. Your edits are still open. " + yt($)
      );
    } finally {
      pn();
    }
  }
  async function ur() {
    if (!o || ye.current) return;
    const f = Pt(e, {
      ...j.current,
      filter: { ...j.current.filter, page: 1 }
    });
    ye.current = !0, tt(!0), le("");
    try {
      if (await o(f) === !1) throw new Error("Could not save review.");
      k("Queue saved to this review.");
    } catch (b) {
      le("Could not save queue. " + yt(b));
    } finally {
      pn();
    }
  }
  const Le = M.performerScope, hn = (f) => {
    const { performerFocus: b, ...$ } = j.current, B = b && !("targetMode" in f || "performerIds" in f || "performerFilter" in f);
    xe({
      ...$,
      ...B ? { performerFocus: b } : {},
      filter: { ...$.filter, page: 1 },
      performerScope: { ...Le, ...f }
    });
  };
  async function tn(f, b) {
    var H;
    const $ = un.current;
    if (!de($)) return;
    (H = me.current) == null || H.controller.abort();
    const B = {
      signature: Sr($),
      controller: new AbortController()
    };
    me.current = B, lt.current = "", Yt(!0), Ge(null);
    try {
      const V = await Ec($, f, b, B.controller.signal, {
        onProgress: (pe) => {
          me.current === B && Nt(pe);
        }
      });
      me.current === B && Nt(V);
    } catch (V) {
      me.current === B && !B.controller.signal.aborted && (lt.current = B.signature, Ge({ signature: B.signature, message: yt(V) }));
    } finally {
      me.current === B && (me.current = null, Yt(!1));
    }
  }
  function mn() {
    var f;
    (f = me.current) == null || f.controller.abort(), me.current = null, Yt(!1), Nt((b) => b && { ...b, partial: !0, complete: !1 });
  }
  async function Gn(f) {
    var H;
    const b = un.current;
    if (!de(b)) return;
    if (me.current) {
      mn();
      return;
    }
    const $ = Sr(b);
    if (((H = Fe.current) == null ? void 0 : H.signature) !== $ || Fe.current.partial) return;
    const B = 1100 - (Date.now() - Pe.current);
    B > 0 && await new Promise((V) => window.setTimeout(V, B));
    try {
      const V = await sa(b, f);
      if (me.current) {
        mn();
        return;
      }
      Nt(
        (pe) => (pe == null ? void 0 : pe.signature) === $ ? qc(pe, f, V) : pe
      );
    } catch {
      Nt(
        (V) => (V == null ? void 0 : V.signature) === $ ? { ...V, partial: !0, complete: !1 } : V
      );
    }
  }
  const gn = M.performerFocus ? ct == null ? void 0 : ct.candidates.find((f) => f.id === M.performerFocus) : void 0, Oe = (fn == null ? void 0 : fn.id) === M.performerFocus ? fn : gn ?? null;
  function On(f) {
    if (ye.current) return;
    const b = {
      ...j.current,
      performerFocus: f,
      filter: { ...j.current.filter, page: 1 }
    };
    xe(b, b.startFrom === "end"), Tn("items");
  }
  function bn() {
    const { performerFocus: f, ...b } = j.current;
    xe(
      { ...b, filter: { ...b.filter, page: 1 } },
      b.startFrom === "end"
    );
  }
  const yn = P(null);
  yn.current ?? (yn.current = ac());
  const fr = yn.current, nn = oc(ht.actions), rn = ze(
    () => ht.actions.flatMap((f) => f.steps.flatMap((b) => b.tagIds)),
    [ht.actions]
  ), wn = P(null);
  z(() => {
    const f = wn.current, b = f == null ? void 0 : f.querySelector('[aria-current="true"]');
    if (!f || !b) return;
    const $ = f.getBoundingClientRect(), B = b.getBoundingClientRect();
    B.top < $.top ? f.scrollTop -= $.top - B.top : B.bottom > $.bottom && (f.scrollTop += B.bottom - $.bottom);
  }, [C == null ? void 0 : C.key, Kt]);
  const vn = P(null), on = P(null);
  z(() => {
    var $, B;
    const f = on.current;
    if (!f) return;
    on.current = null;
    const b = [...(($ = vn.current) == null ? void 0 : $.querySelectorAll(".dq-partner")) ?? []];
    (B = b.find((H) => H.dataset.partnerKey === f) ?? b[0]) == null || B.focus();
  }, [C == null ? void 0 : C.key]);
  const Sn = Ce || be || Se || !!q, Mn = Ce || be || C != null && !G, jr = Math.max(1, Number(M.filter.perPage) || 1), pr = P(1);
  be || (pr.current = Math.max(1, Math.ceil(_t / jr)));
  const Vn = pr.current, $n = Le && C ? F.filter(
    (f) => f.media.id === C.media.id && f.key !== C.key
  ) : [], Nn = C != null && C.occurrence && C.occurrence.performer.id === M.performerFocus ? (Oe == null ? void 0 : Oe.flags) ?? [] : C != null && C.occurrence ? ((hr = ct == null ? void 0 : ct.candidates.find((f) => f.id === C.occurrence.performer.id)) == null ? void 0 : hr.flags) ?? [] : [], Vt = (f) => {
    var b;
    return f.title || ((b = f.files[0]) == null ? void 0 : b.basename) || `${l === "audio" ? "Audio" : "Video"} ${f.id}`;
  }, fe = C ? Ac(C.media, l) : "";
  return /* @__PURE__ */ c(
    "section",
    {
      className: `dq-review-workspace${l === "audio" ? " dq-audio" : ""}${q ? " dq-editing-rule" : ""}`,
      "aria-label": Le ? l === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : l === "audio" ? "Audio review" : "Video review",
      onClickCapture: (f) => {
        var B;
        const b = f.target instanceof Element ? f.target.closest("button") : null, $ = (b == null ? void 0 : b.getAttribute("aria-label")) ?? ((B = b == null ? void 0 : b.textContent) == null ? void 0 : B.trim()) ?? "";
        b && !b.closest(ao) && /^(Filters|Edit filter:|Edit criteria)/.test($) && (Be.current = b);
      },
      children: [
        /* @__PURE__ */ r(
          fc,
          {
            name: e.name,
            description: e.description,
            entityType: Me(e),
            onBack: p == null ? void 0 : p.onBack,
            backDisabled: Sn,
            onEdit: In,
            editDisabled: Sn || !o,
            toolbar: /* @__PURE__ */ c("fieldset", { className: "dq-review-toolbar", disabled: Ye, children: [
              /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: l === "audio" ? "Audio filters" : "Scene filters" }),
              /* @__PURE__ */ r(
                rr,
                {
                  filter: M.filter,
                  objectFilter: Dr,
                  criteriaDefinitions: l === "audio" ? hi : Rr,
                  customFieldEntityType: l,
                  totalCount: _t,
                  sortOptions: l === "audio" ? ho : gi,
                  showSearch: !0,
                  showSort: !0,
                  showPagingControls: !1,
                  metadataByline: /* @__PURE__ */ r(
                    pc,
                    {
                      page: Math.min(Math.max(1, Bt || 1), Vn),
                      pages: Vn,
                      onPage: (f) => xe({
                        ...j.current,
                        filter: et(
                          { ...j.current.filter, page: f },
                          l
                        )
                      })
                    }
                  ),
                  onFilterChange: (f) => {
                    (f.sort !== j.current.filter.sort || f.direction !== j.current.filter.direction) && (f = { ...f, sorts: void 0 }), xe({
                      ...j.current,
                      filter: et(f, l)
                    });
                  },
                  onObjectFilterChange: (f) => {
                    xe({
                      ...j.current,
                      objectFilter: Ho(
                        f,
                        ue,
                        j.current.objectFilter
                      ),
                      filter: { ...j.current.filter, page: 1 }
                    });
                  }
                }
              )
            ] }),
            trailing: /* @__PURE__ */ c(ce, { children: [
              Le && /* @__PURE__ */ r(
                vc,
                {
                  scope: Le,
                  disabled: Ce || Se,
                  onChange: hn,
                  onEditCriteria: () => We(!0)
                }
              ),
              de(it) && t && /* @__PURE__ */ r(
                nc,
                {
                  review: it,
                  hidden: !!q,
                  disabled: Ye || !!q,
                  performerFlags: M.performerFocus ? Oe == null ? void 0 : Oe.flags : void 0,
                  onOpen: () => {
                    ye.current = !0, tt(!0);
                  },
                  onWrite: () => {
                    Pe.current = Date.now();
                  },
                  onClose: (f) => {
                    if (f) {
                      Pe.current = Date.now();
                      const b = j.current.performerFocus;
                      b ? Gn(b) : mn(), dt(($) => $ + 1), new Promise(($) => window.setTimeout($, 1100)).then(() => {
                        pn(), nt.current && _(($) => $ + 1);
                      });
                    } else pn();
                  }
                }
              ),
              (p == null ? void 0 : p.onGrid) && /* @__PURE__ */ r(
                hc,
                {
                  mode: "single",
                  disabled: Sn,
                  onChange: () => {
                    var f;
                    return (f = p.onGrid) == null ? void 0 : f.call(p);
                  }
                }
              ),
              (p == null ? void 0 : p.onManage) && /* @__PURE__ */ r(
                mc,
                {
                  disabled: Sn,
                  items: [
                    {
                      label: "Manage reviews",
                      disabled: p.manageDisabled,
                      onSelect: () => {
                        var f;
                        return (f = p.onManage) == null ? void 0 : f.call(p);
                      }
                    }
                  ]
                }
              )
            ] }),
            chipsStart: M.performerFocus ? /* @__PURE__ */ c("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ r(
                Xn,
                {
                  performer: {
                    id: M.performerFocus,
                    name: (Oe == null ? void 0 : Oe.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ c("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ r("strong", { children: (Oe == null ? void 0 : Oe.name) ?? `performer ${M.performerFocus}` })
              ] }),
              Oe != null && Oe.flags.length ? /* @__PURE__ */ c(
                "span",
                {
                  className: "dq-focus-flag",
                  title: `Flagged: ${Oe.flags.join(", ")}`,
                  children: [
                    /* @__PURE__ */ r(Xr, { "aria-hidden": "true" }),
                    /* @__PURE__ */ c("span", { className: "dq-sr-only", children: [
                      "Flagged: ",
                      Oe.flags.join(", ")
                    ] })
                  ]
                }
              ) : null,
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: Ye,
                  onClick: bn,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            chipsEnd: !q && Kn ? /* @__PURE__ */ c(ce, { children: [
              /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Queue differs from the saved review" }),
              /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: "dq-text-button",
                  title: "Save the current queue criteria to this review",
                  disabled: Ye || !o,
                  onClick: () => void ur(),
                  children: [
                    /* @__PURE__ */ r(So, { "aria-hidden": "true" }),
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
                  disabled: Ye,
                  onClick: () => {
                    const f = Dn(e);
                    xe(f, f.startFrom === "end");
                  },
                  children: [
                    /* @__PURE__ */ r(No, { "aria-hidden": "true" }),
                    "Reset"
                  ]
                }
              )
            ] }) : void 0
          }
        ),
        p == null ? void 0 : p.notices,
        /* @__PURE__ */ c("div", { className: "dq-review-main", children: [
          q && /* @__PURE__ */ c("section", { className: "dq-rule-editor", "aria-label": "Edit review rule", children: [
            /* @__PURE__ */ r("h2", { children: "Edit review" }),
            /* @__PURE__ */ r("p", { children: "Preview matching scenes below. Save review keeps all rule changes; Cancel restores your previous view." }),
            /* @__PURE__ */ c("fieldset", { disabled: Ce, children: [
              a == null ? void 0 : a(
                Pt(q, M),
                m,
                Ce
              ),
              /* @__PURE__ */ c("label", { children: [
                "Review direction",
                /* @__PURE__ */ c(
                  "select",
                  {
                    "aria-label": "Review direction",
                    value: M.startFrom,
                    onChange: (f) => xe({
                      ...j.current,
                      startFrom: f.target.value
                    }),
                    children: [
                      /* @__PURE__ */ r("option", { value: "end", children: "Start from the end" }),
                      /* @__PURE__ */ r("option", { value: "beginning", children: "Start from the beginning" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ c("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  className: "dq-button primary",
                  type: "button",
                  disabled: Ce || be,
                  onClick: () => void Bn(),
                  children: "Save review"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  className: "dq-button",
                  type: "button",
                  disabled: Ce,
                  onClick: we,
                  children: "Cancel"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ c("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ c("div", { className: "dq-review-stage", children: [
              C ? /* @__PURE__ */ c(ce, { children: [
                /* @__PURE__ */ c("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ r("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ c(
                    "a",
                    {
                      href: `/${l}/${C.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${d.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ r("span", { children: Vt(C.media) }),
                        /* @__PURE__ */ r(Eo, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  fe && /* @__PURE__ */ r("span", { className: "dq-stage-meta", children: fe })
                ] }),
                /* @__PURE__ */ c("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ r("div", { className: "dq-player-frame", children: [C, Dt].filter(Boolean).map((f) => {
                    var B, H, V, pe, Ve;
                    const b = f, $ = b.key === C.key;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        className: $ ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": $ ? void 0 : !0,
                        inert: $ ? void 0 : !0,
                        children: l === "audio" ? /* @__PURE__ */ r(
                          Ca,
                          {
                            streamUrl: oi("audio", b.media.id),
                            format: ((B = b.media.files[0]) == null ? void 0 : B.format) ?? "",
                            title: h(b.media),
                            coverUrl: $ ? ii("audio", b.media) : void 0,
                            duration: ((H = b.media.files[0]) == null ? void 0 : H.duration) ?? 0,
                            autostart: $ && qe === b.media.id
                          }
                        ) : /* @__PURE__ */ r(
                          mo,
                          {
                            videoId: b.media.id,
                            streamUrl: oi("video", b.media.id),
                            posterUrl: $ ? ii("video", b.media) : void 0,
                            duration: ((V = b.media.files[0]) == null ? void 0 : V.duration) ?? 0,
                            format: (pe = b.media.files[0]) == null ? void 0 : pe.format,
                            audioCodec: (Ve = b.media.files[0]) == null ? void 0 : Ve.audioCodec,
                            extensionSurface: $ ? "quick-view" : void 0,
                            autostart: $ && qe === b.media.id,
                            keyboardShortcutsEnabled: $,
                            showAbLoop: $,
                            clip: b.media.parentVideoId != null ? {
                              start: b.media.clipStartSec ?? 0,
                              end: b.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${b.media.id}:${ve}`
                    );
                  }) }),
                  l === "audio" && /* @__PURE__ */ r(
                    dc,
                    {
                      details: C.media.details,
                      label: d.one
                    },
                    C.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ r("p", { role: "status", className: "dq-stage-status", children: be ? "Loading review…" : _t ? "Reached the end in this direction." : `No matching ${d.many}.` }),
              ht.actions.length > 0 ? /* @__PURE__ */ r(
                sc,
                {
                  actions: ht.actions,
                  mediaKind: l,
                  isDisabled: (f) => Se || Mt(f),
                  busy: Mn,
                  tags: G,
                  trees: nn,
                  preview: fr,
                  onApply: (f, b) => void gt(f, b),
                  onFind: () => St(!0),
                  findDisabled: Se || !!q
                }
              ) : de(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ c(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || Ce || Se || !G || !!q || !C,
                  children: [
                    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((f) => /* @__PURE__ */ c("label", { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Rt.includes(f),
                          onChange: (b) => T(
                            e.occurrence.multiple ? b.target.checked ? [...Rt, f] : Rt.filter(($) => $ !== f) : [f]
                          )
                        }
                      ),
                      W[f] ?? "Loading tag…"
                    ] }, f)),
                    /* @__PURE__ */ c("div", { className: "dq-row", children: [
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => T([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void gt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void gt(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ c("div", { className: "dq-panel-body", ref: vn, children: [
                C && /* @__PURE__ */ c(ce, { children: [
                  /* @__PURE__ */ c("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ c("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: C.occurrence ? C.occurrence.performer.name : `this ${d.one}` })
                    ] }),
                    /* @__PURE__ */ c("div", { className: "dq-reviewing-who", children: [
                      C.occurrence && /* @__PURE__ */ r(Xn, { performer: C.occurrence.performer }),
                      /* @__PURE__ */ c("div", { children: [
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: C.occurrence ? C.occurrence.performer.name : `This ${d.one}` }),
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-note", children: Le ? `Tags apply to this performer in this ${d.queue}` : `Tags apply to the whole ${d.one}` })
                      ] })
                    ] }),
                    Nn.length > 0 && /* @__PURE__ */ c("p", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
                      /* @__PURE__ */ r(Xr, { "aria-hidden": "true" }),
                      "Flagged: ",
                      Nn.join(", ")
                    ] })
                  ] }),
                  $n.length > 0 && /* @__PURE__ */ c(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${d.queue}`,
                      children: [
                        /* @__PURE__ */ c("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          d.queue
                        ] }),
                        /* @__PURE__ */ r("div", { className: "dq-partners", children: $n.map((f) => {
                          var b, $, B;
                          return /* @__PURE__ */ c(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (b = f.occurrence) == null ? void 0 : b.performer.name,
                              "aria-label": ($ = f.occurrence) == null ? void 0 : $.performer.name,
                              "data-partner-key": f.key,
                              disabled: Ye,
                              onClick: () => {
                                on.current = C.key, Et(f), le("");
                              },
                              children: [
                                f.occurrence && /* @__PURE__ */ r(Xn, { performer: f.occurrence.performer }),
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
                    Tc,
                    {
                      tags: G,
                      preview: fr,
                      showPreview: !Se,
                      trees: nn,
                      actionTagIds: rn,
                      label: `Current ${Le ? "occurrence" : d.one} tags`
                    }
                  ),
                  Se && /* @__PURE__ */ c(
                    "fieldset",
                    {
                      ref: $e,
                      disabled: Ce,
                      className: "dq-panel-section dq-tag-editor",
                      children: [
                        /* @__PURE__ */ c("legend", { className: "dq-eyebrow", children: [
                          "Edit ",
                          Le ? "occurrence" : d.one,
                          " tags"
                        ] }),
                        /* @__PURE__ */ r(
                          xt,
                          {
                            entityType: "tag",
                            values: Tt,
                            onChange: dn,
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
                              disabled: !G,
                              onClick: () => void gt(void 0, !0, !0),
                              children: "Save"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              disabled: !G,
                              onClick: () => void gt(void 0, !1, !0),
                              children: "Save & next"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              onClick: () => {
                                Q(!1), requestAnimationFrame(() => {
                                  var f;
                                  return (f = pt.current) == null ? void 0 : f.focus();
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
                de(te) && M.performerFocus && /* @__PURE__ */ r(
                  na,
                  {
                    review: te,
                    performerId: M.performerFocus,
                    revision: Xt
                  }
                )
              ] }),
              /* @__PURE__ */ c("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ c("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  Ae && /* @__PURE__ */ c("p", { role: "alert", children: [
                    Ae,
                    " ",
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        disabled: Ce,
                        onClick: () => {
                          C ? kt(l, C).then(_e).catch((f) => le(yt(f))) : xe(j.current);
                        },
                        children: C ? "Reload tags" : "Retry queue"
                      }
                    )
                  ] }),
                  se && /* @__PURE__ */ r("p", { role: "status", children: se })
                ] }),
                !t && /* @__PURE__ */ r("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                C && /* @__PURE__ */ c("div", { className: "dq-panel-actions", "aria-busy": Mn || void 0, children: [
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      ref: pt,
                      className: "dq-button",
                      disabled: Ye || !!q || !t || !G,
                      onClick: () => {
                        vt.current = [...G.ids], dn([...G.ids]), Q(!0);
                      },
                      children: [
                        /* @__PURE__ */ r(Ua, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: Ye || !!q,
                      onClick: () => void gt(),
                      children: [
                        /* @__PURE__ */ r(Ka, { "aria-hidden": "true" }),
                        "Skip",
                        Le ? " performer" : ` ${d.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ c("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              Le && /* @__PURE__ */ c(
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
                        "aria-pressed": Kt === "items",
                        onClick: () => Tn("items"),
                        children: l === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Kt === "performers",
                        onClick: () => Tn("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              Le && Kt === "performers" ? /* @__PURE__ */ r(
                uc,
                {
                  ranking: (ct == null ? void 0 : ct.signature) === Ne ? ct : null,
                  busy: It,
                  error: (Re == null ? void 0 : Re.signature) === Ne ? Re.message : "",
                  focus: M.performerFocus,
                  disabled: Ye,
                  labels: d,
                  onFocus: On,
                  onMore: () => {
                    const f = Fe.current;
                    f && tn(f, f.limit + zr);
                  },
                  onRefresh: () => {
                    Nt(null), tn(null, zr);
                  }
                }
              ) : /* @__PURE__ */ r("div", { className: "dq-queue-list", ref: wn, children: F.map((f) => {
                var $;
                const b = (C == null ? void 0 : C.key) === f.key;
                return /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: y(f),
                    "aria-label": y(f),
                    "aria-current": b ? "true" : void 0,
                    disabled: Ye,
                    onClick: () => {
                      Et(f), le(""), k("");
                    },
                    children: [
                      /* @__PURE__ */ r(kc, { media: f.media, kind: l }),
                      /* @__PURE__ */ c("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: h(f.media) }),
                        /* @__PURE__ */ c("span", { className: "dq-queue-row-meta", children: [
                          f.occurrence && /* @__PURE__ */ c(ce, { children: [
                            /* @__PURE__ */ r(Xn, { performer: f.occurrence.performer }),
                            /* @__PURE__ */ r("span", { className: "dq-queue-row-performer", children: f.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ r("span", { className: "dq-queue-row-detail", children: [
                            f.media.date,
                            f.occurrence ? "" : ($ = f.media.files[0]) != null && $.duration ? go(f.media.files[0].duration) : ""
                          ].filter(Boolean).join(" · ") })
                        ] })
                      ] })
                    ]
                  },
                  f.key
                );
              }) })
            ] })
          ] })
        ] }),
        Le && /* @__PURE__ */ r(
          bo,
          {
            open: je,
            onClose: () => We(!1),
            criteria: mi,
            activeFilter: Le.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (f) => {
              We(!1), hn({ performerFilter: f });
            }
          }
        ),
        Ut && /* @__PURE__ */ r(
          ki,
          {
            actions: e.actions,
            trees: nn,
            isDisabled: (f) => Mt(f),
            onApply: (f, b) => {
              St(!1), gt(f, b);
            },
            onClose: () => St(!1)
          }
        )
      ]
    }
  );
}
function Ic(e) {
  var p, l, d;
  const [t, n] = N({}), [i, o] = N(""), s = (((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.annotations) ?? []).includes("tags") ? ((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotationParents) ?? [] : [], a = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...s,
      ...((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.binParents) ?? []
    ])
  ]);
  return z(() => {
    let g = !0;
    return n({}), o(""), Promise.all(
      JSON.parse(a).map(
        async (h) => [h, await xr([h])]
      )
    ).then((h) => {
      g && n(Object.fromEntries(h));
    }).catch(() => {
      g && o(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      g = !1;
    };
  }, [a]), { ids: t, error: i };
}
function Oc(e, t, n) {
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
          var l;
          return p !== a.id && ((l = n[p]) == null ? void 0 : l.includes(a.id));
        }
      )
    ) : []
  };
}
function Mc({
  videos: e,
  review: t,
  trees: n,
  disabled: i,
  onChoose: o
}) {
  var p, l, d;
  const s = new Set(
    (((p = t.presentation) == null ? void 0 : p.binParents) ?? []).flatMap(
      (g) => (n[g] ?? []).filter((h) => h !== g)
    )
  ), a = /* @__PURE__ */ new Map();
  for (const g of e)
    for (const h of g.tags ?? [])
      if (s.has(h.id)) {
        const y = a.get(h.id) ?? { name: h.name, count: 0 };
        y.count++, a.set(h.id, y);
      }
  return (d = (l = t.presentation) == null ? void 0 : l.binParents) != null && d.length ? /* @__PURE__ */ c("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ r("span", { children: "Tags on this page:" }),
    [...a].sort((g, h) => g[1].name.localeCompare(h[1].name)).map(([g, h]) => /* @__PURE__ */ c(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => o(g),
        children: [
          h.name,
          " (",
          h.count,
          ")"
        ]
      },
      g
    )),
    !a.size && /* @__PURE__ */ r("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function $c(e, t) {
  const { _filterExpression: n, ...i } = e.view.objectFilter;
  return {
    ...e,
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...Object.keys(i).length ? [{ filter: i }] : [],
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
function so({
  draft: e,
  onChange: t,
  presentation: n = !0,
  queue: i = !0
}) {
  const [o, s] = N(!1), a = Me(e) === "tag" ? "tag" : he(e), p = a === "tag" ? "tags" : `${a}s`, l = ka(
    a === "tag" ? void 0 : a,
    e.view.objectFilter
  ), d = e.view.filter, g = a === "tag" ? yo : a === "audio" ? ho : gi, h = a === "tag" ? wo : a === "audio" ? hi : Rr, y = (m) => t({
    ...e,
    view: { ...e.view, filter: { ...d, ...m } }
  }), w = a === "video" ? e.presentation ?? {} : {}, S = a !== "audio", q = (m) => t({ ...e, presentation: { ...w, ...m } });
  return /* @__PURE__ */ c(ce, { children: [
    i && /* @__PURE__ */ c("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ r("legend", { children: "Queue" }),
      /* @__PURE__ */ c("label", { children: [
        "Search",
        /* @__PURE__ */ r(
          "input",
          {
            value: String(d.q ?? ""),
            onChange: (m) => y({ q: m.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ c("div", { className: "dq-field-grid", children: [
        /* @__PURE__ */ c("label", { children: [
          "Sort",
          /* @__PURE__ */ c(
            "select",
            {
              "aria-label": "Sort",
              value: String(d.sort ?? "date"),
              onChange: (m) => y({ sort: m.target.value, sorts: void 0 }),
              children: [
                !g.some((m) => m.value === d.sort) && d.sort != null && /* @__PURE__ */ r("option", { value: String(d.sort), children: String(d.sort) }),
                g.map((m) => /* @__PURE__ */ r("option", { value: m.value, children: m.label }, m.value))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ c("label", { children: [
          "Direction",
          /* @__PURE__ */ c(
            "select",
            {
              "aria-label": "Direction",
              value: String(d.direction ?? "desc"),
              onChange: (m) => y({ direction: m.target.value }),
              children: [
                /* @__PURE__ */ r("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ r("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ c("label", { children: [
          a === "tag" ? "Tags" : "Videos",
          " per page",
          /* @__PURE__ */ r(
            "input",
            {
              type: "number",
              min: "1",
              max: "1000",
              value: Number(d.perPage) || 40,
              onChange: (m) => y({
                perPage: Math.max(
                  1,
                  Math.min(1e3, Number(m.target.value) || 40)
                )
              })
            }
          )
        ] }),
        /* @__PURE__ */ c("label", { children: [
          "Start from",
          /* @__PURE__ */ c(
            "select",
            {
              "aria-label": "Start from",
              value: e.view.startFrom ?? "end",
              onChange: (m) => t({
                ...e,
                view: {
                  ...e.view,
                  startFrom: m.target.value
                }
              }),
              children: [
                /* @__PURE__ */ r("option", { value: "end", children: "The end" }),
                /* @__PURE__ */ r("option", { value: "beginning", children: "The beginning" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ c(
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
      /* @__PURE__ */ c("p", { children: [
        Object.keys(e.view.objectFilter).length ? `${a[0].toUpperCase()}${a.slice(1)} filters configured` : `No ${a} filters`,
        ". Choose which ",
        p,
        " enter the queue."
      ] }),
      o && /* @__PURE__ */ r("div", { onKeyDown: (m) => m.stopPropagation(), children: /* @__PURE__ */ r(
        bo,
        {
          open: !0,
          onClose: () => s(!1),
          criteria: h,
          activeFilter: e.view.objectFilter,
          customSections: l ? [l] : void 0,
          supportsFilterExpressions: a !== "tag",
          subjectLabel: p,
          onApply: (m) => {
            t({ ...e, view: { ...e.view, objectFilter: m } }), s(!1);
          }
        }
      ) })
    ] }),
    n && /* @__PURE__ */ c(ce, { children: [
      /* @__PURE__ */ r("h3", { children: "Appearance" }),
      /* @__PURE__ */ c("p", { className: "dq-editor-note", children: [
        "Choose how ",
        a === "tag" ? "tags" : `${p} and tags`,
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ c("div", { className: "dq-field-grid", children: [
        ko(e) && /* @__PURE__ */ c("label", { children: [
          "Preferred review layout",
          /* @__PURE__ */ c(
            "select",
            {
              value: e.view.reviewMode ?? "single",
              onChange: (m) => t({ ...e, view: { ...e.view, reviewMode: m.target.value } }),
              children: [
                /* @__PURE__ */ r("option", { value: "single", children: "Single video" }),
                /* @__PURE__ */ r("option", { value: "multiple", children: "Multiple videos" })
              ]
            }
          )
        ] }),
        !de(e) && S && /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: e.view.selectAllOnLoad ?? !1,
              onChange: (m) => t({ ...e, view: { ...e.view, selectAllOnLoad: m.target.checked ? !0 : void 0 } })
            }
          ),
          "Select all ",
          p,
          " on page load",
          a === "video" && /* @__PURE__ */ r("small", { children: " (multiple-videos layout)" })
        ] }),
        S && /* @__PURE__ */ c("label", { children: [
          "Preferred view",
          /* @__PURE__ */ r(
            "select",
            {
              value: a === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid",
              onChange: (m) => t({
                ...e,
                view: {
                  ...e.view,
                  displayMode: m.target.value
                }
              }),
              children: (a === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((m) => /* @__PURE__ */ r("option", { children: m }, m))
            }
          )
        ] })
      ] }),
      a === "video" && /* @__PURE__ */ c(ce, { children: [
        /* @__PURE__ */ r("h4", { children: "Card annotations" }),
        /* @__PURE__ */ r("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((m) => {
          const R = w.annotations ?? [];
          return /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: R.includes(m),
                onChange: (E) => q({
                  annotations: E.target.checked ? [...R, m] : R.filter((L) => L !== m)
                })
              }
            ),
            m
          ] }, m);
        }) }),
        (w.annotations ?? []).includes("tags") && /* @__PURE__ */ c(ce, { children: [
          /* @__PURE__ */ r("h4", { children: "Card tag bins" }),
          /* @__PURE__ */ r("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected. This setting is separate from the queue filters." }),
          /* @__PURE__ */ r(
            xt,
            {
              entityType: "tag",
              values: w.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (m) => q({ annotationParents: m }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ r("h4", { children: "Queue tag bins" }),
        /* @__PURE__ */ r("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ r(
          xt,
          {
            entityType: "tag",
            values: w.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (m) => q({ binParents: m }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const Qr = 180;
function co(e) {
  return Me(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function lo(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Wr() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function uo(e) {
  const t = new URLSearchParams(window.location.search);
  Lr.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const n = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${n ? `?${n}` : ""}`
  );
}
function Pc(e) {
  return et({ ...e, page: 1 });
}
function la(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Ft(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const da = "data-quality.workspace-layout.v1", Li = 240, fi = 192, pi = 560;
function ua(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(pi, Math.max(fi, e)) : Li;
}
function Fc() {
  try {
    const e = JSON.parse(
      localStorage.getItem(da) ?? "null"
    );
    return ua(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return Li;
  }
}
function xc(e) {
  try {
    localStorage.setItem(
      da,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function fa(e) {
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
function pa(e, t) {
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
function Lc(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : pa(e, t);
}
function Dc({
  onNavigate: e
}) {
  const [t, n] = N([]), [i] = N(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [o, s] = N(""), [a, p] = N(!0), [l, d] = N(""), [g, h] = N(!1), [y, w] = N(!1), [S, q] = N(!1), [m, R] = N(!1), [E, L] = N([]), [K, re] = N(""), [I, M] = N(!0), [x, j] = N(""), [O, _] = N(""), [ae, F] = N(!1), [J, C] = N(!1), [X, ie] = N(Wr), [qe, oe] = N({}), [ve, Lt] = N("name"), [Dt, _t] = N("asc"), jt = P(null), be = P(!1), [De, Ce] = N(0), [tt, ye] = N(!1), [nt, Qe] = N(!1), [Ae, le] = N(
    null
  ), se = t.find((u) => u.id === X) ?? null, k = ze(
    () => (Ae == null ? void 0 : Ae.id) === X && se ? { ...se, view: {
      ...se.view,
      filter: Ae.view.filter,
      objectFilter: Ae.view.objectFilter,
      searchMode: Ae.view.searchMode,
      startFrom: Ae.view.startFrom
    } } : se,
    [Ae, X, se]
  ), G = k ? Me(k) : "video", _e = Zn(G), Se = k ? de(k) : !1, Q = G === "video" ? k : null, Tt = Se && !!(k != null && k.actions.some(cn)), dn = !!Q || G === "audio" || Tt, [vt, pt] = N(null), Be = (vt == null ? void 0 : vt.id) === (k == null ? void 0 : k.id) ? vt == null ? void 0 : vt.mode : (k == null ? void 0 : k.view.reviewMode) ?? "single", $e = Se || G === "audio" || G === "video" && Be === "single", [je, We] = N(0), Ut = P(-1), St = P(!1);
  z(() => {
    const u = () => {
      if (!$e && Et.current) {
        St.current = !0;
        return;
      }
      ie(Wr()), $e || We((v) => v + 1);
    };
    return window.addEventListener("popstate", u), () => window.removeEventListener("popstate", u);
  }, [$e]);
  const Rt = _e === "audio" ? y : g, T = G === "tag" ? "Tag" : _e === "audio" ? "Audio" : "Video", W = G === "tag" ? S : Rt, ke = ze(() => {
    const u = Dt === "asc" ? 1 : -1;
    return [...t].sort((v, A) => {
      if (ve === "count") {
        const D = qe[v.id], Y = qe[A.id], U = typeof D == "number", Z = typeof Y == "number";
        if (U !== Z) return U ? -1 : 1;
        if (U && Z && D !== Y)
          return (D - Y) * u;
      }
      return v.name.localeCompare(A.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * u;
    });
  }, [Dt, ve, qe, t]), rt = P(
    null
  ), Pe = Ic(Q), [ue, kn] = N({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Dr, Ht] = N({
    page: 1,
    perPage: 40
  }), [Ue, ht] = N({ items: [], totalCount: 0 }), [te, it] = N(!1), [He, un] = N(""), [Kt, Tn] = N(!1), [ct, _r] = N(!1), [Fe, lt] = N(() => /* @__PURE__ */ new Set()), Nt = P(Fe);
  Nt.current = Fe;
  const It = P(/* @__PURE__ */ new Map()), Yt = (k == null ? void 0 : k.view.selectAllOnLoad) === !0, [Re, Ge] = N(null), me = P(Re);
  me.current = Re;
  const [Ne, Xt] = N(!1), dt = P(Ne);
  dt.current = Ne;
  const fn = P(null), [Zt, mt] = N(!1), [Ot, Kn] = N("grid"), [Ye, Bt] = N(Qr), [xe, pn] = N(Fc), [ne, en] = N(!1), Et = P(!1), [dr, gt] = N(""), [Rn, Mt] = N(""), [In, Gt] = N(""), [we, Bn] = N(null), [ur, Le] = N(""), [hn, tn] = N(!1), [mn, Gn] = N({}), gn = P(/* @__PURE__ */ new Map()), Oe = P(null), On = P(null), bn = !!k && $e, [yn, fr] = N({ top: 0, bottom: 0 });
  nr(() => {
    if (!bn) return;
    const u = () => {
      const A = On.current;
      if (!A) return;
      const D = Math.round(A.getBoundingClientRect().top + window.scrollY), Y = A.closest("main"), U = Y ? Math.round(parseFloat(getComputedStyle(Y).paddingBottom) || 0) : 0;
      fr(
        (Z) => Z.top === D && Z.bottom === U ? Z : { top: D, bottom: U }
      );
    };
    u();
    const v = typeof ResizeObserver > "u" ? null : new ResizeObserver(u);
    return v == null || v.observe(document.body), window.addEventListener("resize", u), () => {
      v == null || v.disconnect(), window.removeEventListener("resize", u);
    };
  }, [bn]);
  const nn = P(null), rn = P(0), wn = P(0), vn = P(null), on = P(null), Sn = lr(
    ze(
      () => (Q == null ? void 0 : Q.actions.flatMap(
        (u) => u.steps.flatMap((v) => v.tagIds)
      )) ?? [],
      [Q == null ? void 0 : Q.actions]
    )
  );
  function Mn(u) {
    const v = ua(u);
    pn(v), xc(v);
  }
  function jr(u) {
    const v = u.shiftKey ? 40 : 16;
    let A = null;
    u.key === "ArrowLeft" && (A = xe + v), u.key === "ArrowRight" && (A = xe - v), u.key === "Home" && (A = fi), u.key === "End" && (A = pi), A !== null && (u.preventDefault(), u.stopPropagation(), Mn(A));
  }
  z(() => {
    if (!Rn) return;
    const u = window.setTimeout(() => Mt(""), 4e3);
    return () => window.clearTimeout(u);
  }, [Rn]), z(() => {
    const u = Q ? Ii(Q.view.objectFilter) : [];
    if (Gn({}), !u.length) return;
    const v = new AbortController();
    let A = !0;
    return Promise.all(
      u.map(async (D) => {
        var Y;
        try {
          const U = await ee(`/api/tags/${D}`, {
            signal: v.signal
          });
          return (Y = U.name) != null && Y.trim() ? [String(D), U.name] : null;
        } catch {
          return null;
        }
      })
    ).then((D) => {
      A && Gn(
        Object.fromEntries(D.filter((Y) => Y !== null))
      );
    }), () => {
      A = !1, v.abort();
    };
  }, [Q == null ? void 0 : Q.id, Q == null ? void 0 : Q.view.objectFilter]);
  const pr = ze(
    () => Q ? Oi(
      Q.view.objectFilter,
      mn
    ) : (k == null ? void 0 : k.view.objectFilter) ?? {},
    [mn, k, Q]
  ), Vn = an(async () => {
    p(!0), d("");
    try {
      const u = await is();
      n(u.reviews), s(u.storageKey), h(u.canWriteVideos ?? u.canWrite), w(u.canWriteAudios ?? !1), q(u.canWriteTags ?? !1), R(u.canReadTagGroups ?? !1), M(u.canConfigure ?? !0), j(u.storageNotice ?? ""), X && !u.reviews.some((v) => v.id === X) && (ie(""), uo(""));
    } catch (u) {
      d(
        u instanceof Error ? u.message : "Could not load reviews."
      );
    } finally {
      p(!1);
    }
  }, [X]);
  z(() => {
    if (!m) {
      L([]), re("");
      return;
    }
    const u = new AbortController();
    return re(""), ms(u.signal).then(L).catch((v) => {
      u.signal.aborted || re(
        v instanceof Error ? v.message : "Could not load tag groups."
      );
    }), () => u.abort();
  }, [m]), z(() => {
    Vn();
  }, []), z(() => {
    if (X || t.length === 0) return;
    const u = new AbortController();
    oe({});
    for (const v of t)
      (de(v) ? Mi(v, u.signal).then((D) => (D == null ? void 0 : D.length) === 0 ? { items: [], totalCount: 0 } : er($i(v, D), { ...v.view.filter, page: 1, perPage: 1 }, u.signal)) : Me(v) === "tag" ? Qi(
        v,
        et({ ...v.view.filter, page: 1, perPage: 1 }),
        u.signal
      ) : er(
        v,
        et({ ...v.view.filter, page: 1, perPage: 1 }),
        u.signal
      )).then((D) => {
        u.signal.aborted || oe((Y) => ({
          ...Y,
          [v.id]: D.totalCount
        }));
      }).catch(() => {
        u.signal.aborted || oe((D) => ({ ...D, [v.id]: null }));
      });
    return () => u.abort();
  }, [X, t]), nr(() => {
    var u;
    X || a || !be.current || (be.current = !1, (u = jt.current) == null || u.focus());
  }, [X, a]);
  const $n = P(0), Nn = an(async () => {
    const u = ++$n.current;
    Bn(null), Le("");
    try {
      const v = await (Tt ? _o(_e) : Do(_e));
      u === $n.current && Bn(v);
    } catch (v) {
      if (u !== $n.current) return;
      Bn(null), Le(
        "Tag assessment setup could not be checked. " + (v instanceof Error ? v.message : "Request failed.")
      );
    }
  }, [Tt, _e]);
  z(() => {
    Nn();
  }, [Nn]);
  const Vt = an(
    async (u, v, A = !1, D = !1) => {
      var st, ge;
      const Y = ++rn.current;
      (st = vn.current) == null || st.abort();
      const U = new AbortController();
      vn.current = U, v = et(v);
      const Z = Number(v.page);
      A && (v = { ...v, page: 1 }), kn(v), _r(A), it(!0), un("");
      try {
        const Ie = (zt) => Me(u) === "tag" ? Qi(
          u,
          zt,
          U.signal
        ) : er(
          u,
          zt,
          U.signal
        );
        let Ze = await Ie(v);
        const Jt = Math.max(
          1,
          Math.ceil(Ze.totalCount / Number(v.perPage))
        ), Fn = A ? Jt : Math.min(Z, Jt);
        return Number(v.page) !== Fn && (v = { ...v, page: Fn }, Ze = await Ie(v)), Y === rn.current && (((ge = on.current) == null ? void 0 : ge.page) !== Fn && (on.current = {
          page: Fn,
          ids: new Set(Ze.items.map((zt) => zt.id))
        }), ht(Ze), D && pe(
          () => new Set(Ze.items.map((zt) => zt.id))
        ), kn(v), Ht(v)), Ze;
      } catch (Ie) {
        throw Y === rn.current && un(
          Ie instanceof Error ? Ie.message : "Could not load the review queue."
        ), Ie;
      } finally {
        Y === rn.current && it(!1);
      }
    },
    []
  );
  z(() => {
    var v;
    if (wn.current += 1, Ut.current = -1, rn.current += 1, (v = vn.current) == null || v.abort(), C(!1), _(""), F(!1), lt(/* @__PURE__ */ new Set()), It.current.clear(), Ge(null), Xt(!1), en(!1), Et.current = !1, gt(""), Mt(""), Gt(""), ht({ items: [], totalCount: 0 }), on.current = null, Tn(!1), !k || $e) {
      it(!1);
      return;
    }
    let u = !0;
    return it(!0), (async () => {
      let A = se ?? k;
      le(null);
      let D = null;
      const Y = new URLSearchParams(window.location.search);
      if (Me(k) === "video" && Lr.some((ge) => Y.has(ge)))
        try {
          const ge = A;
          D = ui(ge, Y);
          const Ie = Pt(ge, D.query);
          (D.query.startFrom !== (ge.view.startFrom ?? "end") || !or(
            JSON.parse($t(Ie)),
            JSON.parse($t(Pt(ge, Dn(ge))))
          )) && (A = Ie, le(A));
        } catch (ge) {
          Tn(!0), un(ge instanceof Error ? ge.message : "Could not read review URL."), it(!1);
          return;
        }
      let U = null;
      try {
        U = await ss(o, k.id);
      } catch (ge) {
        u && (F(!0), _(
          ge instanceof Error ? ge.message : "Could not load progress."
        ));
      }
      if (!u) return;
      const Z = (U == null ? void 0 : U.signature) === $t(A) ? U : null, st = D ? D.query.filter : Z ? et(Z.filter) : Pc(A.view.filter);
      kn(st), Kn(
        Z ? lo(Z.displayMode, Me(k)) : co(k)
      ), Bt(
        Z ? Z.cardSize ?? Qr : Qr
      );
      try {
        const ge = await Vt(
          A,
          st,
          D ? D.startAtEnd : !Z && A.view.startFrom !== "beginning",
          A.view.selectAllOnLoad === !0
        );
        if (!u) return;
        const Ie = Bi(
          ge.items.map((Ze) => Ze.id),
          (Z == null ? void 0 : Z.focusedId) ?? null,
          (Z == null ? void 0 : Z.index) ?? 0
        );
        Ge(Ie), V(Ie);
      } catch {
      }
      u && (Ut.current = je, C(!0));
    })(), () => {
      var A;
      u = !1, wn.current++, rn.current++, (A = vn.current) == null || A.abort();
    };
  }, [k == null ? void 0 : k.id, $e, je]), z(() => {
    !Q || $e || !J || te || He || ne || St.current || Ut.current !== je || tr(Q.id, {
      filter: ue,
      objectFilter: Q.view.objectFilter,
      searchMode: Q.view.searchMode,
      startFrom: Q.view.startFrom ?? "end"
    });
  }, [Q, $e, J, te, He, ue, ne, je]);
  const fe = ze(
    () => Ue.items.map((u) => u.id),
    [Ue.items]
  );
  z(() => {
    if (!J || !k || !o || te || He || ne || (Ae == null ? void 0 : Ae.id) === k.id || ae)
      return;
    const u = {
      version: 1,
      signature: $t(k),
      filter: ue,
      focusedId: Re,
      index: Math.max(0, fe.indexOf(Re ?? -1)),
      displayMode: Ot,
      cardSize: Ye,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        o + ":progress:" + k.id,
        JSON.stringify(u)
      );
    } catch {
    }
    if (O) return;
    let v = !0;
    const A = window.setTimeout(() => {
      cs(o, k.id, u).catch((D) => {
        v && _(
          "Progress is kept in this browser, but account sync failed. " + (D instanceof Error ? D.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      v = !1, window.clearTimeout(A);
    };
  }, [
    J,
    o,
    k,
    te,
    He,
    ne,
    ue,
    Re,
    fe,
    Ot,
    Ye,
    Ae,
    O,
    ae
  ]);
  const hr = Ue.items.find((u) => u.id === Re) ?? null, f = G === "video" ? hr : null;
  Ne && f && (fn.current = f);
  const b = f ?? (Ne ? fn.current : null), $ = Gi(Fe, Re), B = fe.length > 0 && fe.every((u) => Fe.has(u)), H = Fe.size > 0 ? `${Fe.size} selected ${G}${Fe.size === 1 ? "" : "s"}` : Re == null ? `no ${G}` : `focused ${G}`, V = an((u, v = !0) => {
    u != null && window.requestAnimationFrame(() => {
      const A = gn.current.get(u);
      A == null || A.focus({ preventScroll: !0 }), v && (A == null || A.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  z(() => {
    J && !dt.current && V(me.current);
  }, [J, V]), z(() => {
    te || !fe.length || (me.current == null || !fe.includes(me.current)) && (Ge(fe[0]), dt.current || V(fe[0]));
  }, [V, fe, te]);
  const pe = an(
    (u) => {
      lt((v) => {
        const A = u(v);
        for (const D of /* @__PURE__ */ new Set([...v, ...A]))
          v.has(D) !== A.has(D) && It.current.set(
            D,
            (It.current.get(D) ?? 0) + 1
          );
        return A;
      });
    },
    []
  ), Ve = an(
    (u) => {
      if (!fe.length) return;
      const v = Math.max(
        0,
        fe.indexOf(me.current ?? fe[0])
      ), A = fe[Math.max(0, Math.min(fe.length - 1, v + u))];
      Ge(A), dt.current || V(A);
    },
    [V, fe]
  ), qt = an(
    async (u) => {
      const v = "steps" in u ? u.steps.length > 0 : u.effect.mode !== "SKIP", A = "effect" in u && u.effect.mode === "SET_TAG_GROUP" ? u.effect.tagGroupId : null, D = A != null && (!m || !E.some((Te) => Te.id === A)), Y = "effect" in u && v && !m, U = Gi(
        Nt.current,
        me.current
      );
      if (!k || Et.current || te || He) return;
      const Z = v && !W ? `${T} write permission is required to apply ${u.label}.` : Y || D ? `${u.label} needs a tag group that is unavailable.` : cn(u) && (we == null ? void 0 : we.kind) !== "ready" ? `Set up tag assessments before applying ${u.label}.` : U.length ? "" : `Select or focus a ${G} before applying ${u.label}.`;
      if (Z) {
        Gt(Z);
        return;
      }
      const st = ++wn.current, ge = k.id, Ie = [...fe], Ze = Ue, Jt = me.current, Fn = new Set(Nt.current), zt = new Map(
        U.map((Te) => [Te, It.current.get(Te) ?? 0])
      ), xn = () => st === wn.current && k.id === ge;
      Et.current = !0, en(!0), gt(
        Nt.current.size ? `${U.length} selected ${G}s` : `the focused ${G}`
      ), Mt(""), Gt("");
      const _i = Ze.items.filter(
        (Te) => !U.includes(Te.id)
      ), ba = _i.map((Te) => Te.id), ji = Vi(
        Ie,
        ba,
        Jt,
        U.includes(Jt ?? -1)
      );
      ht({
        items: _i,
        totalCount: Ze.totalCount
      }), lt((Te) => {
        const ft = new Set(Te);
        for (const Ct of U) ft.delete(Ct);
        return ft;
      }), Ge(ji), dt.current || V(ji);
      let Ur = !1;
      try {
        if ("effect" in u ? await Cs(u, U) : await Uo(_e, u, U), Ur = !0, !xn()) return;
        lt((Te) => {
          const ft = new Set(Te);
          for (const Ct of U)
            (It.current.get(Ct) ?? 0) === zt.get(Ct) && ft.delete(Ct);
          return ft;
        }), Mt(
          `${u.label}: ${U.length} ${G}${U.length === 1 ? "" : "s"} ${v ? "updated" : "skipped"}.`
        );
      } catch (Te) {
        if (!xn()) return;
        ht(Ze), lt((ft) => {
          const Ct = new Set(ft);
          for (const bt of U)
            Fn.has(bt) && (It.current.get(bt) ?? 0) === zt.get(bt) && Ct.add(bt);
          return Ct;
        }), Ge(Jt), dt.current || V(Jt), Gt(
          Te instanceof Error ? Te.message : "Action failed."
        );
      }
      try {
        if (await ys(u), !xn()) return;
        const Te = new Set(U), ft = Yt && Ie.length > 0 && Ie.every((At) => Te.has(At)), Ct = await Vt(k, ue, !1, ft);
        if (!xn()) return;
        let bt = Ct.items.map((At) => At.id);
        const gr = on.current, ya = (gr == null ? void 0 : gr.page) === Number(ue.page) && bt.some((At) => gr.ids.has(At)), wa = (k.view.startFrom ?? "end") !== "beginning";
        if (Ct.totalCount > 0 && Number(ue.page) > 1 && (!bt.length || wa && !ya)) {
          const At = Math.max(1, Number(ue.page) - 1), br = { ...ue, page: At };
          kn(br), bt = (await Vt(
            k,
            br,
            !1,
            ft
          )).items.map((Kr) => Kr.id), lt(
            (Kr) => new Set([...Kr].filter((va) => bt.includes(va)))
          );
          const Ki = bt.at(-1) ?? null;
          Ge(Ki), dt.current || V(Ki);
        } else {
          lt(
            (br) => new Set([...br].filter((Ui) => bt.includes(Ui)))
          );
          const At = Vi(
            Ie,
            bt,
            Jt,
            Ur && U.includes(Jt ?? -1)
          );
          Ge(At), dt.current && At == null && Xt(!1), dt.current || V(At);
        }
      } catch (Te) {
        xn() && Gt(
          (ft) => `${ft ? `${ft} ` : ""}${Ur ? "The action completed, but " : ""}the queue could not be refreshed. ${Te instanceof Error ? Te.message : "Refresh failed."}`
        );
      } finally {
        xn() && (Et.current = !1, en(!1), gt(""), St.current && (St.current = !1, ie(Wr()), We((Te) => Te + 1)));
      }
    },
    [
      W,
      m,
      E,
      G,
      we,
      Vt,
      ue,
      V,
      fe,
      Ue,
      te,
      He,
      k
    ]
  );
  function Je() {
    var A;
    if (Ot === "list") return 1;
    const u = (A = Oe.current) == null ? void 0 : A.firstElementChild, v = u ? getComputedStyle(u).gridTemplateColumns : "";
    return Math.max(1, v.split(" ").filter(Boolean).length);
  }
  const ut = P(() => {
  });
  ut.current = (u) => {
    var U;
    if ($e || u.defaultPrevented || u.repeat || u.ctrlKey || u.altKey || u.metaKey || tt) return;
    const v = u.target, A = v instanceof Node && ((U = On.current) == null ? void 0 : U.contains(v)) === !0, D = v === document.body || v === document.documentElement;
    if (!A && !D) return;
    if (Zt) {
      u.key === "Escape" && (Ft(u), mt(!1));
      return;
    }
    if (Ne && u.key === "Escape") {
      Ft(u), Xt(!1), V(me.current);
      return;
    }
    if (!Xa(v)) return;
    const Y = Ya(v);
    if (u.key === "Escape") {
      Ft(u), pe(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!Ne && u.key === " " && Y) {
      Ft(u), Re != null && pe((Z) => vr(Z, Re));
      return;
    }
    if (!(ne || te) && !Ne && u.key === "Enter" && Re != null && Y) {
      Ft(u), G === "tag" ? window.open(`/tag/${Re}`, "_blank", "noopener,noreferrer") : Xt(!0);
      return;
    }
  }, z(() => {
    const u = (v) => ut.current(v);
    return document.addEventListener("keydown", u), () => document.removeEventListener("keydown", u);
  }, []);
  const Ke = P(
    () => {
    }
  );
  Ke.current = (u) => {
    var U;
    if ($e || tt || Ne || Zt || ne || te || !fe.length || u.defaultPrevented || u.repeat || u.ctrlKey || u.altKey || u.metaKey)
      return;
    const v = u.target, A = v instanceof Node && ((U = On.current) == null ? void 0 : U.contains(v)) === !0, D = v === document.body || v === document.documentElement;
    if (!A && !D || !u.key.startsWith("Arrow") || !Za(v)) return;
    const Y = es(u.key, Je());
    Y && (u.preventDefault(), A ? u.stopImmediatePropagation() : u.stopPropagation(), Ve(Y));
  }, z(() => {
    const u = (v) => Ke.current(v);
    return document.addEventListener("keydown", u), () => document.removeEventListener("keydown", u);
  }, []);
  const Xe = Un();
  Ci({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!k && !$e && !tt && !Ne && !Zt && !He && (Ue.items.length > 0 || te || ne),
    actionCount: (k == null ? void 0 : k.actions.length) ?? 0,
    onAction: (u) => {
      const v = k == null ? void 0 : k.actions[u];
      v && qt(v);
    },
    onFind: () => mt(!0),
    onSelectAll: () => pe((u) => Ji(u, fe))
  }), z(() => mt(!1), [$e, Ne, k == null ? void 0 : k.id]);
  function Ee(u) {
    const v = "steps" in u ? u.steps.length > 0 : u.effect.mode !== "SKIP", A = "effect" in u && u.effect.mode === "SET_TAG_GROUP" ? u.effect.tagGroupId : null, D = A != null && !E.some((Y) => Y.id === A);
    return ne || te || !!He || v && !W || "effect" in u && v && (!m || D) || cn(u) && (we == null ? void 0 : we.kind) !== "ready" || !$.length;
  }
  function ot(u) {
    pt(null), Ce(0), ie(u), uo(u);
  }
  function Jn() {
    be.current = !0, oe({}), ot("");
  }
  async function zn(u) {
    if (!o) return !1;
    const v = u.map(jc);
    try {
      await as(o, v);
    } catch (D) {
      throw D;
    }
    n(v), X && !v.some((D) => D.id === X) && ot("");
    const A = v.find((D) => D.id === X);
    return A && pt(null), A && se && JSON.stringify(A) !== JSON.stringify(se) && (A.view.displayMode !== se.view.displayMode && Kn(co(A)), $t(A) !== $t(se) && (le(null), Me(A) === "video" && tr(A.id, {
      filter: et(A.view.filter),
      objectFilter: A.view.objectFilter,
      searchMode: A.view.searchMode,
      startFrom: A.view.startFrom ?? "end"
    }), $e || Pn(
      A,
      et({ ...A.view.filter, page: ue.page })
    ))), !0;
  }
  if (a)
    return /* @__PURE__ */ r(fo, { label: "Loading reviews…" });
  if (l)
    return /* @__PURE__ */ c(ce, { children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          onClick: () => void Wc().catch(
            (u) => d(
              "Could not export browser reviews. " + (u instanceof Error ? u.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ r(
        po,
        {
          message: l,
          onRetry: () => void Vn()
        }
      )
    ] });
  const Qn = /* @__PURE__ */ c(ce, { children: [
    x && /* @__PURE__ */ r("p", { className: "dq-status", children: x }),
    dn && (we == null ? void 0 : we.kind) === "missing" && /* @__PURE__ */ c("div", { role: "status", className: "dq-status", children: [
      we.message,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: hn,
          onClick: () => {
            tn(!0), Le(""), (Tt ? Ss(_e) : vs(_e)).then(Nn).catch(
              (u) => Le(
                `Could not create the ${Tt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (u instanceof Error ? u.message : "Request failed.")
              )
            ).finally(() => tn(!1));
          },
          children: hn ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    dn && ((we == null ? void 0 : we.kind) === "incompatible" || ur) && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(Zr, {}),
      ur || (we == null ? void 0 : we.message),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: hn,
          onClick: () => {
            tn(!0), Nn().finally(
              () => tn(!1)
            );
          },
          children: hn ? "Checking…" : "Check again"
        }
      )
    ] }),
    k && Xe.allUnbound(k.actions.length) && /* @__PURE__ */ r("p", { role: "status", className: "dq-status", children: "Your keyboard preset has no keys for Data Quality actions, so pressing a letter does nothing. Assign them under Settings → Keyboard shortcuts → Data Quality, or switch to the Cove Native preset." }),
    i && /* @__PURE__ */ c("details", { children: [
      /* @__PURE__ */ r("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ r("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const u = localStorage.getItem("page-videos") ?? "[]", v = URL.createObjectURL(
              new Blob([u], { type: "application/json" })
            ), A = document.createElement("a");
            A.href = v, A.download = "data-quality-unassigned-legacy-reviews.json", A.click(), URL.revokeObjectURL(v);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    O && /* @__PURE__ */ c("p", { role: "alert", children: [
      O,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => {
            _(""), F(!1);
          },
          children: ae ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ c(
    "div",
    {
      ref: On,
      className: `data-quality-page${bn ? " dq-page-fit" : ""}`,
      style: bn ? {
        "--dq-fit-top": `${yn.top}px`,
        "--dq-fit-bottom": `${yn.bottom}px`
      } : void 0,
      children: [
        bn && k ? /* @__PURE__ */ r(
          Rc,
          {
            review: k,
            canWrite: Se ? S : Rt,
            canAssess: (we == null ? void 0 : we.kind) === "ready" && Rt,
            onBusy: en,
            editRequest: De,
            renderRuleEditor: (u, v, A) => /* @__PURE__ */ r(ha, { workspace: !0, draft: u, entityTypeLocked: !0, tagGroups: E, saving: A, setDraft: (D) => v(D), onSave: () => {
            }, onCancel: () => {
            } }),
            onSaveDefaults: I ? (u) => zn(t.map((v) => v.id === u.id ? u : v)) : void 0,
            pageControls: {
              onBack: Jn,
              onManage: () => {
                Qe(!1), ye(!0);
              },
              manageDisabled: !I,
              onGrid: Q ? () => pt({ id: Q.id, mode: "multiple" }) : void 0,
              notices: Qn
            }
          },
          k.id
        ) : /* @__PURE__ */ c(ce, { children: [
          /* @__PURE__ */ c("header", { className: "data-quality-header", children: [
            k && /* @__PURE__ */ r(
              "button",
              {
                className: "dq-header-action",
                type: "button",
                "aria-label": "All reviews",
                title: "All reviews",
                disabled: ne,
                onClick: Jn,
                children: /* @__PURE__ */ r(Ir, {})
              }
            ),
            /* @__PURE__ */ c("div", { className: "dq-header-copy", children: [
              /* @__PURE__ */ r("h1", { children: (k == null ? void 0 : k.name) ?? "Data Quality" }),
              (k == null ? void 0 : k.description) && /* @__PURE__ */ r("p", { className: "dq-header-description", children: k.description })
            ] }),
            k && se && /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-header-action",
                "aria-label": "Edit review",
                title: "Edit review",
                disabled: ne || te || !I,
                onClick: () => {
                  Qe(!0), ye(!0);
                },
                children: /* @__PURE__ */ r(Or, {})
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                className: "dq-header-action",
                type: "button",
                "aria-label": "Manage reviews",
                title: "Manage reviews",
                disabled: ne || te || !I,
                onClick: () => {
                  Qe(!1), ye(!0);
                },
                children: /* @__PURE__ */ r(Ba, {})
              }
            )
          ] }),
          Qn,
          Q && /* @__PURE__ */ c("label", { className: "dq-layout-control", children: [
            "Review layout",
            /* @__PURE__ */ c(
              "select",
              {
                "aria-label": "Review layout",
                value: Be,
                disabled: ne || te || tt,
                onChange: (u) => pt({ id: Q.id, mode: u.target.value }),
                children: [
                  /* @__PURE__ */ r("option", { value: "single", children: "Single video" }),
                  /* @__PURE__ */ r("option", { value: "multiple", children: "Multiple videos" })
                ]
              }
            )
          ] }),
          k && se && /* @__PURE__ */ c("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
            /* @__PURE__ */ r(
              "div",
              {
                className: `dq-native-toolbar-host${ne || te ? " dq-native-toolbar-disabled" : ""}`,
                "aria-disabled": ne || te || void 0,
                inert: ne || te ? !0 : void 0,
                children: /* @__PURE__ */ r(
                  rr,
                  {
                    filter: He ? Dr : ue,
                    onFilterChange: Wn,
                    totalCount: Ue.totalCount,
                    sortOptions: G === "tag" ? yo : gi,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Ot,
                    onDisplayModeChange: (u) => Kn(lo(u, G)),
                    availableDisplayModes: G === "tag" ? ["grid", "list"] : ["grid", "wall"],
                    zoomLevel: (Ye - 225) / 50,
                    onZoomChange: (u) => Bt(Math.round(225 + u * 50)),
                    cardSizeEntityType: G === "tag" ? "tags" : "videos",
                    criteriaDefinitions: G === "tag" ? wo : Rr,
                    customFieldEntityType: G === "video" ? "video" : void 0,
                    objectFilter: pr,
                    onObjectFilterChange: (u) => {
                      !ne && !te && (rt.current = G === "video" ? Ho(
                        u,
                        mn,
                        k.view.objectFilter
                      ) : u);
                    },
                    showPagingControls: !1
                  }
                )
              }
            ),
            (Ae == null ? void 0 : Ae.id) === X && /* @__PURE__ */ c("div", { className: "dq-review-defaults", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  "aria-label": "Save changes to review filters",
                  title: "Save changes to review filters",
                  disabled: ne || te || !I,
                  onClick: at,
                  children: /* @__PURE__ */ r(So, {})
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  "aria-label": "Reset to default review filters",
                  title: "Reset to default review filters",
                  disabled: ne || te,
                  onClick: Hn,
                  children: /* @__PURE__ */ r(No, {})
                }
              )
            ] })
          ] }),
          k ? /* @__PURE__ */ c(ce, { children: [
            Q && Pe.error && /* @__PURE__ */ r("p", { role: "alert", children: Pe.error }),
            Q && /* @__PURE__ */ r(
              Mc,
              {
                videos: Ue.items,
                review: Q,
                trees: Pe.ids,
                disabled: ne || te,
                onChoose: (u) => {
                  const v = $c(Q, u);
                  le(v), Pn(v, { ...ue, page: 1 });
                }
              }
            ),
            In && !Ne && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ r(Zr, {}),
              In
            ] }),
            Rn && /* @__PURE__ */ r("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: Rn }),
            Di("top"),
            /* @__PURE__ */ c(
              "div",
              {
                className: "dq-workspace",
                style: {
                  "--dq-sidebar-width": `${xe}px`
                },
                children: [
                  /* @__PURE__ */ c("main", { children: [
                    te && !Ue.items.length && /* @__PURE__ */ r(fo, { label: "Loading review queue…" }),
                    He && !te && /* @__PURE__ */ r(
                      po,
                      {
                        message: He,
                        retryLabel: Kt ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (Kt && se && Me(se) === "video") {
                            const u = Dn(se);
                            tr(se.id, { ...u, filter: { ...u.filter, page: void 0 } }), We((v) => v + 1);
                            return;
                          }
                          Vt(
                            k,
                            ue,
                            ct,
                            Yt
                          ).catch(() => {
                          });
                        }
                      }
                    ),
                    !ne && !te && !He && !Ue.items.length && /* @__PURE__ */ c("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ r(Nr, {}),
                      /* @__PURE__ */ c("p", { children: [
                        "No ",
                        G,
                        "s match this review."
                      ] })
                    ] }),
                    !!Ue.items.length && /* @__PURE__ */ r("div", { ref: Oe, children: /* @__PURE__ */ r(
                      "div",
                      {
                        className: Ot === "list" ? "dq-tag-list" : "dq-grid",
                        style: {
                          "--dq-card-width": `${Ye}px`
                        },
                        children: Ue.items.map(ga)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ r(
                    "div",
                    {
                      className: "dq-workspace-separator",
                      role: "separator",
                      tabIndex: 0,
                      "aria-label": "Resize review sidebar",
                      "aria-orientation": "vertical",
                      "aria-valuemin": fi,
                      "aria-valuemax": pi,
                      "aria-valuenow": xe,
                      "aria-valuetext": `${xe} pixels wide`,
                      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                      onPointerDown: (u) => {
                        nn.current = {
                          pointerId: u.pointerId,
                          startX: u.clientX,
                          startWidth: xe
                        }, u.currentTarget.setPointerCapture(u.pointerId);
                      },
                      onPointerMove: (u) => {
                        const v = nn.current;
                        (v == null ? void 0 : v.pointerId) === u.pointerId && u.currentTarget.hasPointerCapture(u.pointerId) && Mn(
                          v.startWidth + v.startX - u.clientX
                        );
                      },
                      onPointerUp: () => {
                        nn.current = null;
                      },
                      onPointerCancel: () => {
                        nn.current = null;
                      },
                      onKeyDown: jr,
                      onDoubleClick: () => Mn(Li),
                      children: /* @__PURE__ */ r("span", {})
                    }
                  ),
                  /* @__PURE__ */ c("aside", { className: "dq-actions", children: [
                    /* @__PURE__ */ c(
                      "button",
                      {
                        type: "button",
                        className: "dq-selection-toggle",
                        "aria-keyshortcuts": Xe.selectAll === zo ? "Control+A Meta+A" : Xe.selectAll || void 0,
                        disabled: !fe.length,
                        onClick: () => pe(
                          (u) => Ji(u, fe)
                        ),
                        children: [
                          B ? "Clear selection" : "Select all on page",
                          Xe.selectAll && /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: Xe.selectAll })
                        ]
                      }
                    ),
                    /* @__PURE__ */ r("strong", { children: Fe.size > 0 ? H : Re == null ? "Nothing to apply to" : `Applies to the ${H}` }),
                    k.actions.map((u, v) => {
                      const A = "effect" in u && u.effect.mode === "SET_TAG_GROUP" ? u.effect.tagGroupId : null, D = A != null ? E.find((Y) => Y.id === A) : void 0;
                      return /* @__PURE__ */ c(
                        "button",
                        {
                          type: "button",
                          disabled: Ee(u),
                          onClick: () => void qt(u),
                          children: [
                            /* @__PURE__ */ c("span", { className: "dq-action-copy", children: [
                              /* @__PURE__ */ r("span", { className: "dq-action-label", children: u.label }),
                              "effect" in u ? /* @__PURE__ */ r("small", { children: u.effect.mode === "SKIP" ? "Skip" : u.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : D ? `Assign ${D.name}` : "Unavailable tag group" }) : u.steps.length ? /* @__PURE__ */ r("span", { className: "dq-action-steps", children: u.steps.flatMap(
                                (Y, U) => Y.tagIds.map((Z, st) => {
                                  const ge = Sn[Z] === void 0 ? "Tag" : Sn[Z] ?? "Unavailable tag", Ie = pa(Y, ge), Ze = Lc(Y, ge);
                                  return /* @__PURE__ */ r(
                                    "span",
                                    {
                                      className: "dq-step-summary",
                                      "data-step-tone": fa(Y.mode),
                                      "aria-label": Ze,
                                      title: `Step ${U + 1}: ${Ze}`,
                                      children: Ie
                                    },
                                    `${U}-${Z}-${st}`
                                  );
                                })
                              ) }) : /* @__PURE__ */ r("small", { children: "Skip" })
                            ] }),
                            Xe.action(v) && /* @__PURE__ */ r("kbd", { children: Xe.action(v) })
                          ]
                        },
                        u.id
                      );
                    }),
                    !k.actions.length && /* @__PURE__ */ r("p", { children: "This review has no actions." }),
                    k.actions.length > 0 && /* @__PURE__ */ r(Wo, { onClick: () => mt(!0) }),
                    !W && /* @__PURE__ */ c("p", { children: [
                      T,
                      " write permission is required to apply actions."
                    ] }),
                    G === "tag" && K && /* @__PURE__ */ c("p", { children: [
                      "Tag groups are unavailable. ",
                      K
                    ] }),
                    ne && /* @__PURE__ */ c("p", { role: "status", children: [
                      /* @__PURE__ */ r(qo, { className: "dq-spin" }),
                      " Applying action to",
                      " ",
                      dr,
                      "…"
                    ] }),
                    /* @__PURE__ */ r("p", { className: "dq-shortcuts", children: [
                      "←→↑↓ move",
                      "space select",
                      `enter ${G === "tag" ? "open" : "preview"}`,
                      "action keys apply",
                      Xe.find && `${Xe.find} find action`,
                      Xe.selectAll && `${Xe.selectAll} toggle shown`,
                      "Esc clear"
                    ].filter(Boolean).join(" · ") })
                  ] })
                ]
              }
            ),
            Di("bottom")
          ] }) : t.length ? /* @__PURE__ */ c(
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
                        ref: jt,
                        tabIndex: -1,
                        children: "Reviews"
                      }
                    ),
                    /* @__PURE__ */ r("p", { children: "Choose a review to open its queue." }),
                    /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: t.every(
                      (u) => qe[u.id] !== void 0
                    ) ? t.some((u) => qe[u.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
                  ] }),
                  /* @__PURE__ */ c("div", { className: "dq-review-browser-sort", children: [
                    /* @__PURE__ */ c("label", { children: [
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                      /* @__PURE__ */ c(
                        "select",
                        {
                          "aria-label": "Sort reviews by",
                          value: ve,
                          onChange: (u) => Lt(
                            u.target.value
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
                        "aria-label": Dt === "asc" ? "Ascending" : "Descending",
                        title: Dt === "asc" ? "Ascending" : "Descending",
                        onClick: () => _t(
                          (u) => u === "asc" ? "desc" : "asc"
                        ),
                        children: /* @__PURE__ */ r(
                          yi,
                          {
                            className: Dt === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                          }
                        )
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ r("div", { className: "dq-review-browser-list", children: ke.map((u) => {
                  const v = qe[u.id], A = Me(u), D = A === "tag" ? "tag" : de(u) ? wt(Zn(A)).queue : wt(Zn(A)).one;
                  return /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      disabled: ne,
                      onClick: () => ot(u.id),
                      children: [
                        /* @__PURE__ */ c("span", { className: "dq-review-browser-summary", children: [
                          /* @__PURE__ */ c("span", { className: "dq-review-title", children: [
                            /* @__PURE__ */ r(xi, { entityType: A }),
                            /* @__PURE__ */ r("strong", { children: u.name })
                          ] }),
                          /* @__PURE__ */ r(
                            "span",
                            {
                              className: "dq-review-count",
                              "aria-label": v === void 0 ? `Counting matching ${D}s` : v === null ? `Matching ${D} count unavailable` : `${v.toLocaleString()} matching ${v === 1 ? D : `${D}s`}`,
                              children: v === void 0 ? "…" : v === null ? "—" : v.toLocaleString()
                            }
                          )
                        ] }),
                        u.description && /* @__PURE__ */ r("span", { className: "dq-review-rule-name", children: u.description })
                      ]
                    },
                    u.id
                  );
                }) })
              ]
            }
          ) : /* @__PURE__ */ c("div", { className: "dq-empty", children: [
            /* @__PURE__ */ r(Nr, {}),
            /* @__PURE__ */ r("p", { children: "No saved reviews are available in this browser." })
          ] })
        ] }),
        Ne && b && Q && /* @__PURE__ */ r(
          Gc,
          {
            video: b,
            review: Q,
            targetLabel: H,
            pending: ne,
            refreshing: te || !!He,
            error: In,
            canWrite: g,
            assessmentReady: (we == null ? void 0 : we.kind) === "ready",
            selected: Fe.has(b.id),
            hasPrevious: fe.indexOf(b.id) > 0,
            hasNext: fe.indexOf(b.id) >= 0 && fe.indexOf(b.id) < fe.length - 1,
            onToggleSelected: () => pe((u) => vr(u, b.id)),
            onPrevious: () => Ve(-1),
            onNext: () => Ve(1),
            onClose: () => {
              Xt(!1), V(me.current);
            },
            onAction: qt,
            findOpen: Zt,
            onFindOpenChange: mt
          }
        ),
        Zt && k && !$e && !Ne && /* @__PURE__ */ r(
          ki,
          {
            actions: k.actions,
            tagGroups: E,
            isDisabled: Ee,
            canStay: !1,
            onApply: (u) => {
              mt(!1), qt(u);
            },
            onClose: () => mt(!1)
          }
        ),
        tt && /* @__PURE__ */ r(
          Vc,
          {
            reviews: t,
            activeReview: se,
            tagGroups: E,
            initialEdit: nt,
            onSave: zn,
            onChoose: ot,
            onEditWorkspace: (u) => {
              u !== X && ot(u), pt({ id: u, mode: "single" }), Ce((v) => v + 1), ye(!1);
            },
            onClose: () => {
              ye(!1), nt && V(me.current, !1);
            }
          }
        )
      ]
    }
  );
  async function Pn(u, v, A = !1) {
    const D = me.current, Y = Math.max(0, fe.indexOf(D ?? -1));
    try {
      const Z = (await Vt(
        u,
        v,
        A,
        u.view.selectAllOnLoad === !0
      )).items.map((ge) => ge.id);
      lt(
        (ge) => new Set([...ge].filter((Ie) => Z.includes(Ie)))
      );
      const st = Bi(Z, D, Y);
      Ge(st), dt.current || V(st, !1);
    } catch {
    }
  }
  function Wn(u) {
    const v = rt.current;
    if (rt.current = null, ne || te || !k || !se) return;
    const A = v ?? k.view.objectFilter, D = or(
      A,
      se.view.objectFilter
    ) ? se.view.objectFilter : A, Y = et({ ...u, page: 1 }), U = {
      ...k,
      view: {
        ...k.view,
        filter: Y,
        objectFilter: D
      }
    }, Z = $t(U) !== $t(se), st = Z ? U : se;
    le(Z ? U : null), Mt(Z ? "" : "Review queue defaults restored."), Pn(st, Y, !0);
  }
  function Hn() {
    if (ne || te || !se) return;
    rt.current = null;
    const u = et({
      ...se.view.filter,
      page: 1
    });
    le(null), Mt("Review queue defaults restored."), Pn(
      se,
      u,
      se.view.startFrom !== "beginning"
    );
  }
  function at() {
    ne || te || !k || !se || !I || zn(
      t.map(
        (u) => u.id === X ? {
          ...u,
          view: {
            ...k.view,
            filter: { ...ue, page: 1 }
          }
        } : u
      )
    ).then(() => {
      le(null), Mt("Queue saved to this review.");
    }).catch(
      (u) => Gt(
        u instanceof Error ? u.message : "Could not save queue."
      )
    );
  }
  function mr() {
    lt(/* @__PURE__ */ new Set()), It.current.clear(), Ge(null);
  }
  function Di(u) {
    return k ? /* @__PURE__ */ r(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: ne || te,
        "aria-label": `Review queue pagination ${u}`,
        children: /* @__PURE__ */ r(
          Ta,
          {
            filter: {
              ...ue,
              page: Number(ue.page) || 1,
              perPage: Number(ue.perPage) || 40
            },
            totalCount: Ue.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${u}`,
            onFilterChange: (v) => {
              ne || te || v.page === Number(ue.page) || _c(
                { ...ue, page: v.page },
                k,
                (A, D) => Vt(A, D, !1, Yt),
                mr
              );
            }
          }
        )
      }
    ) : null;
  }
  function ga(u) {
    var A, D, Y;
    if (G === "tag") {
      const U = u;
      return /* @__PURE__ */ r(
        Uc,
        {
          tag: U,
          displayMode: Ot === "list" ? "list" : "grid",
          focused: U.id === Re,
          selected: Fe.has(U.id),
          setRef: (Z) => {
            Z ? gn.current.set(U.id, Z) : gn.current.delete(U.id);
          },
          onFocus: () => Ge(U.id),
          onToggle: () => {
            pe((Z) => vr(Z, U.id)), V(U.id, !1);
          },
          onOpen: () => window.open(`/tag/${U.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        U.id
      );
    }
    const v = u;
    return /* @__PURE__ */ r(
      Kc,
      {
        video: Oc(v, Q, Pe.ids),
        showTagBins: ((D = (A = Q == null ? void 0 : Q.presentation) == null ? void 0 : A.annotations) == null ? void 0 : D.includes("tags")) && !!((Y = Q.presentation.annotationParents) != null && Y.length),
        displayMode: Ot,
        focused: v.id === Re,
        selected: Fe.has(v.id),
        setRef: (U) => {
          U ? gn.current.set(v.id, U) : gn.current.delete(v.id);
        },
        onFocus: () => Ge(v.id),
        onToggle: () => pe((U) => vr(U, v.id)),
        onPreview: () => {
          Ge(v.id), Xt(!0);
        },
        onNavigate: e
      },
      v.id
    );
  }
}
function _c(e, t, n, i) {
  i(), n(t, e).catch(() => {
  });
}
function vr(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function jc(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Uc({
  tag: e,
  displayMode: t,
  focused: n,
  selected: i,
  setRef: o,
  onFocus: s,
  onToggle: a,
  onOpen: p,
  onNavigate: l
}) {
  return /* @__PURE__ */ r(
    "article",
    {
      ref: o,
      tabIndex: 0,
      "aria-current": n ? "true" : void 0,
      "aria-label": `${e.name}${i ? ", selected" : ""}`,
      onFocus: s,
      onClick: (d) => {
        s(), d.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${n ? "focused" : ""} ${i ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ r(
        Ia,
        {
          tag: e,
          selected: i,
          onSelect: a,
          onClick: p,
          onNavigate: l
        }
      ) : /* @__PURE__ */ c("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            "aria-label": i ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": i,
            onClick: (d) => {
              d.stopPropagation(), a();
            },
            children: i ? "✓" : ""
          }
        ),
        /* @__PURE__ */ r("button", { type: "button", className: "dq-tag-list-name", onClick: p, children: e.name }),
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
function Kc({
  video: e,
  showTagBins: t,
  displayMode: n,
  focused: i,
  selected: o,
  setRef: s,
  onFocus: a,
  onToggle: p,
  onPreview: l,
  onNavigate: d
}) {
  var q, m;
  const g = la(e), h = P(null), y = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, w = !!(y.date || y.studioName), S = !!(y.performers.length || y.tags.length);
  return nr(() => {
    const R = h.current;
    if (!R) return;
    const E = R.querySelector(
      `a[href="/video/${e.id}"]`
    ), L = R.querySelector(".card-title"), K = `dq-card-title-${e.id}`;
    L && (L.id = K), E && (E.target = "_blank", E.rel = "noreferrer", E.removeAttribute("aria-label"), E.setAttribute("aria-labelledby", K), E.classList.add("dq-card-link"));
    const re = R.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    re && re.setAttribute(
      "aria-label",
      o ? `Deselect ${g}` : `Select ${g}`
    );
    const I = R.querySelector(
      'button[title="Quick View"]'
    );
    I && I.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ c(
    "article",
    {
      ref: (R) => {
        h.current = R, s(R);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${g}${o ? ", selected" : ""}`,
      onFocus: a,
      onClick: (R) => {
        a(), R.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${w ? "has-card-metadata" : "no-card-metadata"} ${S ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ r(
          Oa,
          {
            video: y,
            selected: o,
            onSelect: p,
            onNavigate: d,
            onQuickView: l,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ c("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (q = e.tags) == null ? void 0 : q.map((R) => /* @__PURE__ */ r("span", { children: R.name }, R.id)),
          !((m = e.tags) != null && m.length) && /* @__PURE__ */ r("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ r(Bc, { video: e })
      ]
    }
  );
}
function Bc({ video: e }) {
  const t = P(null), n = P(null), [i, o] = N(!1), [s, a] = N(!1), [p, l] = N(!1);
  return z(() => {
    const d = t.current;
    if (!d || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), a(!0);
      return;
    }
    const g = new IntersectionObserver(
      ([y]) => o(y.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), h = new IntersectionObserver(
      ([y]) => a(y.isIntersecting && y.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return g.observe(d), h.observe(d), () => {
      g.disconnect(), h.disconnect();
    };
  }, [e.id, e.files.length]), z(() => {
    if (!i) {
      l(!1);
      return;
    }
    const d = new AbortController();
    return ee(bs(e.id), {
      signal: d.signal
    }).then((g) => {
      d.signal.aborted || l(g.available === !0);
    }).catch(() => {
      d.signal.aborted || l(!1);
    }), () => d.abort();
  }, [i, e.id]), z(() => {
    const d = n.current;
    d && (s ? Promise.resolve(d.play()).catch(() => {
    }) : d.pause());
  }, [p, s]), /* @__PURE__ */ r("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: p && /* @__PURE__ */ r(
    "video",
    {
      ref: n,
      src: gs(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Gc({
  video: e,
  review: t,
  targetLabel: n,
  pending: i,
  refreshing: o,
  error: s,
  canWrite: a,
  assessmentReady: p,
  selected: l,
  hasPrevious: d,
  hasNext: g,
  onToggleSelected: h,
  onPrevious: y,
  onNext: w,
  onClose: S,
  onAction: q,
  findOpen: m,
  onFindOpenChange: R
}) {
  const E = P(null), L = P(null), K = e.files[0], re = la(e), I = Un(), M = (O) => i || o || "steps" in O && O.steps.length > 0 && !a || cn(O) && !p;
  Ci({
    surface: "overlay",
    enabled: !m,
    actionCount: t.actions.length,
    onAction: (O) => {
      const _ = t.actions[O];
      _ && q(_);
    },
    onFind: () => R(!0)
  }), z(() => {
    var _;
    const O = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (_ = E.current) == null || _.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = O;
    };
  }, []);
  function x(O) {
    var F, J, C;
    if (O.key !== "Tab") return;
    const _ = [
      ...((F = E.current) == null ? void 0 : F.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((X) => X.offsetParent !== null);
    if (!_.length) {
      O.preventDefault(), (J = E.current) == null || J.focus();
      return;
    }
    const ae = _.indexOf(
      document.activeElement
    );
    O.shiftKey && ae <= 0 ? (O.preventDefault(), (C = _.at(-1)) == null || C.focus()) : !O.shiftKey && ae === _.length - 1 && (O.preventDefault(), _[0].focus());
  }
  function j(O) {
    if (m || O.defaultPrevented || O.ctrlKey || O.metaKey || O.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const _ = O.key === "ArrowLeft" || O.key === "ArrowRight";
    if (O.altKey && !_) return;
    const ae = L.current, F = O.currentTarget.querySelector("video");
    if (O.key === "Enter" || O.key === "Escape")
      O.repeat || S();
    else if (O.key === " " && ae)
      O.repeat || ae.toggle();
    else if (_ && ae)
      ae.seekBy(
        (O.key === "ArrowLeft" ? -1 : 1) * (O.shiftKey ? 5 : O.altKey ? 10 : 60)
      );
    else if ((O.key === "," || O.key === ".") && ae) {
      const J = [K == null ? void 0 : K.duration, F == null ? void 0 : F.duration].find(
        (X) => X != null && Number.isFinite(X) && X > 0
      ) ?? 0, C = e.parentVideoId != null ? (e.clipEndSec ?? J) - (e.clipStartSec ?? 0) : J;
      Number.isFinite(C) && C > 0 && ae.seekBy((O.key === "," ? -1 : 1) * C * 0.1);
    } else if (O.key.toLowerCase() === "n" || O.key.toLowerCase() === "m")
      !O.repeat && !i && !o && (O.key.toLowerCase() === "n" && d && y(), O.key.toLowerCase() === "m" && g && w());
    else if (O.key === "ArrowUp" && F)
      F.volume = Math.min(1, F.volume + 0.1);
    else if (O.key === "ArrowDown" && F)
      F.volume = Math.max(0, F.volume - 0.1);
    else return;
    Ft(O);
  }
  return /* @__PURE__ */ c(
    "div",
    {
      ref: E,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${re}`,
      className: "dq-preview",
      onKeyDown: x,
      onKeyDownCapture: j,
      onMouseDown: (O) => {
        O.target === O.currentTarget && S();
      },
      children: [
        /* @__PURE__ */ c("div", { className: "dq-preview-shell", children: [
          /* @__PURE__ */ c("header", { "data-review-player-controls": !0, children: [
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                "aria-label": "Previous review video",
                disabled: !d || i || o,
                onClick: y,
                children: /* @__PURE__ */ r(Ir, {})
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                "aria-label": "Next review video",
                disabled: !g || i || o,
                onClick: w,
                children: /* @__PURE__ */ r(yi, {})
              }
            ),
            /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ r("h2", { children: re }),
              /* @__PURE__ */ c("p", { children: [
                "Actions target ",
                n,
                "."
              ] })
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: h,
                disabled: o,
                children: l ? "Selected" : "Select"
              }
            ),
            /* @__PURE__ */ r(
              "a",
              {
                href: `/video/${e.id}`,
                target: "_blank",
                rel: "noreferrer",
                className: "dq-details-link",
                "aria-label": `Open ${re} details in new tab`,
                title: "Open video details in new tab",
                children: /* @__PURE__ */ r(Eo, {})
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: S,
                "aria-label": "Close review preview",
                children: /* @__PURE__ */ r(Co, {})
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: K ? /* @__PURE__ */ r(
            mo,
            {
              autostart: !0,
              streamUrl: oi("video", e.id),
              posterUrl: Wi(e),
              format: K.format,
              audioCodec: K.audioCodec,
              duration: K.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onPlaybackControlRegister: (O) => (L.current = O, () => {
                L.current === O && (L.current = null);
              }),
              videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ r("img", { src: Wi(e), alt: "" }) }),
          s && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: s }),
          /* @__PURE__ */ c("p", { className: "dq-editor-note", children: [
            "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · action keys apply",
            I.find ? ` · ${I.find} find action` : "",
            " · Enter/Esc close"
          ] }),
          /* @__PURE__ */ c("footer", { "data-review-player-controls": !0, children: [
            t.actions.length > 0 && /* @__PURE__ */ r(Wo, { onClick: () => R(!0) }),
            t.actions.map((O, _) => /* @__PURE__ */ c(
              "button",
              {
                type: "button",
                disabled: M(O),
                onClick: () => void q(O),
                children: [
                  I.action(_) && /* @__PURE__ */ r("kbd", { children: I.action(_) }),
                  O.label
                ]
              },
              O.id
            ))
          ] })
        ] }),
        m && /* @__PURE__ */ r(
          ki,
          {
            actions: t.actions,
            isDisabled: M,
            canStay: !1,
            onApply: (O) => {
              R(!1), q(O);
            },
            onClose: () => R(!1)
          }
        )
      ]
    }
  );
}
function Vc({
  reviews: e,
  activeReview: t,
  tagGroups: n,
  initialEdit: i = !1,
  onEditWorkspace: o,
  onSave: s,
  onChoose: a,
  onClose: p
}) {
  const [l, d] = N(
    () => i && t ? structuredClone(t) : null
  ), [g, h] = N(""), [y, w] = N(!1), [S, q] = N(
    i && t != null
  ), m = P(null);
  z(() => {
    var x, j;
    const I = document.activeElement, M = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (j = (x = m.current) == null ? void 0 : x.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || j.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = M, I == null || I.focus({ preventScroll: !0 });
    };
  }, []);
  function R(I) {
    var j, O, _;
    if (I.defaultPrevented) {
      I.stopPropagation();
      return;
    }
    if (I.key === "Escape") {
      Ft(I), y || p();
      return;
    }
    if (I.key !== "Tab") {
      I.stopPropagation();
      return;
    }
    const M = [
      ...((j = m.current) == null ? void 0 : j.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ae) => ae.offsetParent !== null);
    if (!M.length) {
      Ft(I), (O = m.current) == null || O.focus();
      return;
    }
    const x = M.indexOf(
      document.activeElement
    );
    I.shiftKey && x <= 0 ? (Ft(I), (_ = M.at(-1)) == null || _.focus()) : !I.shiftKey && x === M.length - 1 ? (Ft(I), M[0].focus()) : I.stopPropagation();
  }
  function E(I, M = !!I) {
    q(M), d(
      I ? structuredClone(I) : {
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
    ), h("");
  }
  async function L() {
    if (y) return;
    if (!l || Er(l)) {
      h(l ? Er(l) : "Choose a review.");
      return;
    }
    const I = { ...l, name: l.name.trim() }, M = e.some((x) => x.id === I.id) ? e.map((x) => x.id === I.id ? I : x) : [...e, I];
    w(!0), h("");
    try {
      if (!await s(M)) throw new Error("Could not save reviews.");
      !e.some((x) => x.id === I.id) && I.entityType !== "tag" ? o(I.id) : (a(I.id), p());
    } catch (x) {
      h(
        "Could not save reviews. Your edits are still open. " + (x instanceof Error ? x.message : "Retry saving.")
      );
    } finally {
      w(!1);
    }
  }
  async function K(I) {
    if (!y) {
      w(!0), h("");
      try {
        if (!await s(I)) throw new Error("Could not save reviews.");
      } catch (M) {
        h(
          M instanceof Error ? M.message : "Could not save reviews."
        );
      } finally {
        w(!1);
      }
    }
  }
  async function re(I) {
    var x;
    if (y) return;
    const M = (x = I.target.files) == null ? void 0 : x[0];
    if (I.target.value = "", !!M) {
      if (M.size > 2e6) {
        h("Review files must be smaller than 2 MB.");
        return;
      }
      w(!0), h("");
      try {
        const j = sr(await M.text());
        if (!await s(ei(e, j)))
          throw new Error("Could not save reviews.");
      } catch (j) {
        h(
          j instanceof Error ? j.message : "Could not import reviews."
        );
      } finally {
        w(!1);
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
      onKeyDown: R,
      children: /* @__PURE__ */ c("div", { className: "dq-manager", children: [
        /* @__PURE__ */ c("header", { children: [
          /* @__PURE__ */ c("div", { children: [
            /* @__PURE__ */ r("h2", { children: l ? e.some((I) => I.id === l.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ r("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: y,
              onClick: p,
              children: /* @__PURE__ */ r(Co, {})
            }
          )
        ] }),
        g && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: g }),
        /* @__PURE__ */ r("fieldset", { disabled: y, className: "dq-manager-content", children: l ? /* @__PURE__ */ r(
          ha,
          {
            setup: l.entityType !== "tag" && !e.some((I) => I.id === l.id),
            draft: l,
            entityTypeLocked: S,
            tagGroups: n,
            saving: y,
            setDraft: d,
            onSave: () => void L(),
            onCancel: p
          }
        ) : /* @__PURE__ */ c(ce, { children: [
          /* @__PURE__ */ c("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: () => {
              const I = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), M = document.createElement("a");
              M.href = I, M.download = "data-quality-reviews.json", M.click(), URL.revokeObjectURL(I);
            }, children: "Export reviews" }),
            /* @__PURE__ */ c(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => E(),
                children: [
                  /* @__PURE__ */ r(Ga, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ c("label", { className: "dq-button", children: [
              /* @__PURE__ */ r(Va, {}),
              " Import reviews",
              /* @__PURE__ */ r(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: re
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-review-list", children: e.map((I) => /* @__PURE__ */ c("article", { children: [
            /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ c("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ r(xi, { entityType: Me(I) }),
                /* @__PURE__ */ r("strong", { children: I.name })
              ] }),
              /* @__PURE__ */ r("p", { children: I.description || "No description" })
            ] }),
            /* @__PURE__ */ c("button", { type: "button", onClick: () => I.entityType === "tag" || Me(I) === "video" && I.view.reviewMode === "multiple" ? E(I) : o(I.id), children: [
              /* @__PURE__ */ r(Or, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: () => E({
                  ...structuredClone(I),
                  id: crypto.randomUUID(),
                  name: `${I.name} copy`
                }, !0),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${I.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${I.name}”?`) && K(
                    e.filter((M) => M.id !== I.id)
                  );
                },
                children: /* @__PURE__ */ r(Ao, {})
              }
            )
          ] }, I.id)) })
        ] }) })
      ] })
    }
  );
}
function ha({
  workspace: e = !1,
  setup: t = !1,
  draft: n,
  entityTypeLocked: i,
  tagGroups: o,
  saving: s = !1,
  setDraft: a,
  onSave: p,
  onCancel: l
}) {
  const [d, g] = N("Review"), h = Me(n), y = de(n), w = (m) => {
    if (!(i || m === h)) {
      if (m === "performerOccurrence" || m === "audioPerformerOccurrence") {
        a({
          id: n.id,
          entityType: m,
          name: n.name,
          description: n.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end" },
          actions: [],
          occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: !0 }
        });
        return;
      }
      if (m === "audio") {
        a({
          id: n.id,
          entityType: "audio",
          name: n.name,
          description: n.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end", reviewMode: "single" },
          actions: []
        });
        return;
      }
      a(
        m === "tag" ? {
          id: n.id,
          entityType: "tag",
          name: n.name,
          description: n.description,
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
          id: n.id,
          entityType: "video",
          name: n.name,
          description: n.description,
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
  }, S = P(/* @__PURE__ */ new WeakMap()), q = (m) => {
    let R = S.current.get(m);
    return R || (R = crypto.randomUUID(), S.current.set(m, R)), R;
  };
  return /* @__PURE__ */ c("div", { className: "dq-editor", children: [
    /* @__PURE__ */ r("div", { className: "dq-editor-nav", children: /* @__PURE__ */ r(
      Ra,
      {
        tabs: (t ? ["Review"] : e ? ["Review", ...h === "video" ? ["Appearance"] : [], "Actions", ...y ? ["Tag choices"] : []] : y ? ["Review", "Queue", "Actions", ...n.occurrence.tagIds.length ? ["Tag choices"] : []] : h === "audio" ? ["Review", "Queue", "Actions"] : ["Review", "Queue", "Appearance", "Actions"]).map((m) => ({
          key: m,
          label: m,
          count: m === "Actions" ? n.actions.length : void 0,
          disabled: s
        })),
        activeTab: d,
        onTabChange: g
      }
    ) }),
    /* @__PURE__ */ c("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ c("section", { hidden: d !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ r("h3", { children: "Review details" }),
        /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ c("label", { children: [
          "Entity type",
          /* @__PURE__ */ c(
            "select",
            {
              "aria-label": "Entity type",
              value: h,
              disabled: i,
              onChange: (m) => w(m.target.value),
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
        /* @__PURE__ */ c("label", { children: [
          "Review name",
          /* @__PURE__ */ r(
            "input",
            {
              autoFocus: !0,
              "aria-label": "Review name",
              value: n.name,
              onChange: (m) => a({ ...n, name: m.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ c("label", { children: [
          "Description",
          /* @__PURE__ */ r(
            "textarea",
            {
              "aria-label": "Description",
              value: n.description,
              onChange: (m) => a({ ...n, description: m.target.value })
            }
          )
        ] }),
        y && !t && /* @__PURE__ */ r(
          As,
          {
            review: n,
            onChange: a
          }
        )
      ] }),
      !e && !t && /* @__PURE__ */ c("section", { hidden: d !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ r(so, { draft: n, onChange: a, presentation: !1 }),
        y && /* @__PURE__ */ r(Hi, { review: n, onChange: a })
      ] }),
      !t && y && /* @__PURE__ */ r("section", { hidden: d !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ r(Hi, { review: n, onChange: a, choices: !0 }) }),
      !t && h !== "audio" && !y && (!e || h === "video") && /* @__PURE__ */ r("section", { hidden: d !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ r(so, { draft: n, onChange: a, queue: !1 }) }),
      !t && /* @__PURE__ */ r("section", { hidden: d !== "Actions", className: "dq-editor-section", children: h === "tag" ? /* @__PURE__ */ r(
        zc,
        {
          draft: n,
          saving: s,
          tagGroups: o,
          setDraft: a
        }
      ) : /* @__PURE__ */ r(
        Jc,
        {
          draft: n,
          saving: s,
          stepKey: q,
          rememberStepKey: (m, R) => S.current.set(m, q(R)),
          setDraft: a
        }
      ) })
    ] }),
    !e && /* @__PURE__ */ c("div", { className: "dq-editor-footer", children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const m = URL.createObjectURL(
              new Blob([JSON.stringify([n], null, 2)], {
                type: "application/json"
              })
            ), R = document.createElement("a");
            R.href = m, R.download = "data-quality-review.json", R.click(), URL.revokeObjectURL(m);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: l, children: "Cancel" }),
      /* @__PURE__ */ r("button", { className: "dq-button primary", type: "button", onClick: p, children: t ? "Create & configure" : "Save review" })
    ] })
  ] });
}
function ma({
  action: e,
  onChange: t
}) {
  return /* @__PURE__ */ r("div", { className: "dq-field-grid", children: /* @__PURE__ */ c("label", { children: [
    "Button label",
    /* @__PURE__ */ r(
      "input",
      {
        value: e.label,
        onChange: (n) => t({ ...e, label: n.target.value })
      }
    )
  ] }) });
}
function Jc({
  draft: e,
  saving: t,
  stepKey: n,
  rememberStepKey: i,
  setDraft: o
}) {
  const [s, a] = N(!1), [p, l] = N(null), d = P(null), g = ar(), h = () => {
    a(!1), requestAnimationFrame(() => {
      var w;
      return (w = d.current) == null ? void 0 : w.focus();
    });
  }, y = (w, S) => o({
    ...e,
    actions: e.actions.map(
      (q, m) => m === w ? S : q
    )
  });
  return /* @__PURE__ */ c(ce, { children: [
    /* @__PURE__ */ r("h3", { children: "Actions" }),
    de(e) && /* @__PURE__ */ c("p", { children: [
      "Actions apply only to the active performer in this ",
      wt(he(e)).one,
      ". Set performer matching in the review filters below. Save review keeps those criteria with this rule."
    ] }),
    /* @__PURE__ */ r("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails. Removing tags and descendants never removes a tag the same action adds." }),
    /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ r(
      Hr,
      {
        items: e.actions,
        getKey: (w) => w.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (w) => o({ ...e, actions: w }),
        renderItem: (w, { index: S, dragHandleProps: q, isOver: m }) => /* @__PURE__ */ c(
          "fieldset",
          {
            className: m ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ c("legend", { children: [
                "Action ",
                S + 1
              ] }),
              /* @__PURE__ */ c("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    ...q,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${S + 1}`,
                    children: /* @__PURE__ */ r(wi, {})
                  }
                ),
                /* @__PURE__ */ r("strong", { children: w.label || "New action" }),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: () => o({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, S + 1),
                        {
                          ...structuredClone(w),
                          id: crypto.randomUUID(),
                          label: w.label + " copy"
                        },
                        ...e.actions.slice(S + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ r(
                ma,
                {
                  action: w,
                  onChange: (R) => y(S, R)
                }
              ),
              /* @__PURE__ */ r(
                Hr,
                {
                  items: w.steps,
                  getKey: n,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (R) => y(S, { ...w, steps: R }),
                  renderItem: (R, E) => /* @__PURE__ */ r(
                    Qc,
                    {
                      dragHandleProps: E.dragHandleProps,
                      saving: t,
                      isOver: E.isOver,
                      step: R,
                      index: E.index,
                      onChange: (L) => {
                        i(L, R), y(S, {
                          ...w,
                          steps: w.steps.map(
                            (K, re) => re === E.index ? L : K
                          )
                        });
                      },
                      onRemove: () => y(S, {
                        ...w,
                        steps: w.steps.filter(
                          (L, K) => K !== E.index
                        )
                      })
                    }
                  )
                }
              ),
              /* @__PURE__ */ c("div", { className: "dq-row", children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    className: "dq-button",
                    type: "button",
                    onClick: () => y(S, {
                      ...w,
                      steps: [...w.steps, { mode: "ADD", tagIds: [] }]
                    }),
                    children: "Add step"
                  }
                ),
                /* @__PURE__ */ r(
                  "button",
                  {
                    className: "dq-button",
                    type: "button",
                    onClick: () => o({
                      ...e,
                      actions: e.actions.filter(
                        (R, E) => E !== S
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
    /* @__PURE__ */ c("div", { className: "dq-row dq-add-actions", children: [
      /* @__PURE__ */ r(
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
      /* @__PURE__ */ r(
        "button",
        {
          ref: d,
          className: "dq-button",
          type: "button",
          "aria-expanded": s,
          "aria-controls": s ? g : void 0,
          disabled: t,
          onClick: () => {
            l(null), a(!s);
          },
          children: "Add actions from parent tags…"
        }
      ),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-editor-note", children: (p == null ? void 0 : p.actions) === e.actions ? `Added ${p.count} action${p.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    s && /* @__PURE__ */ r(
      Fs,
      {
        id: g,
        review: e,
        disabled: t,
        onAdd: (w) => {
          const S = [...e.actions, ...w];
          o({ ...e, actions: S }), l({ actions: S, count: w.length }), h();
        },
        onCancel: h
      }
    )
  ] });
}
function zc({
  draft: e,
  saving: t,
  tagGroups: n,
  setDraft: i
}) {
  const o = (s, a) => i({
    ...e,
    actions: e.actions.map(
      (p, l) => l === s ? a : p
    )
  });
  return /* @__PURE__ */ c(ce, { children: [
    /* @__PURE__ */ r("h3", { children: "Actions" }),
    /* @__PURE__ */ r("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ r("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ r(
      Hr,
      {
        items: e.actions,
        getKey: (s) => s.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (s) => i({ ...e, actions: s }),
        renderItem: (s, { index: a, dragHandleProps: p, isOver: l }) => /* @__PURE__ */ c(
          "fieldset",
          {
            className: l ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ c("legend", { children: [
                "Action ",
                a + 1
              ] }),
              /* @__PURE__ */ c("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    ...p,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${a + 1}`,
                    children: /* @__PURE__ */ r(wi, {})
                  }
                ),
                /* @__PURE__ */ r("strong", { children: s.label || "New action" }),
                /* @__PURE__ */ r(
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
              /* @__PURE__ */ r(
                ma,
                {
                  action: s,
                  onChange: (d) => o(a, d)
                }
              ),
              /* @__PURE__ */ c("label", { children: [
                "Action effect",
                /* @__PURE__ */ c(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: s.effect.mode === "SET_TAG_GROUP" ? `group:${s.effect.tagGroupId}` : s.effect.mode,
                    onChange: (d) => {
                      const g = d.target.value;
                      o(a, {
                        ...s,
                        effect: g === "SKIP" ? { mode: "SKIP" } : g === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : {
                          mode: "SET_TAG_GROUP",
                          tagGroupId: Number(g.slice(6))
                        }
                      });
                    },
                    children: [
                      /* @__PURE__ */ r("option", { value: "SKIP", children: "Skip" }),
                      /* @__PURE__ */ r("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
                      s.effect.mode === "SET_TAG_GROUP" && !n.some(
                        (d) => d.id === s.effect.tagGroupId
                      ) && /* @__PURE__ */ r(
                        "option",
                        {
                          value: `group:${s.effect.tagGroupId}`,
                          disabled: !0,
                          children: "Unavailable tag group"
                        }
                      ),
                      n.map((d) => /* @__PURE__ */ r("option", { value: `group:${d.id}`, children: d.name }, d.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ r(
                "button",
                {
                  className: "dq-button",
                  type: "button",
                  onClick: () => i({
                    ...e,
                    actions: e.actions.filter(
                      (d, g) => g !== a
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
    /* @__PURE__ */ r(
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
function Qc({
  step: e,
  index: t,
  dragHandleProps: n,
  saving: i,
  isOver: o,
  onChange: s,
  onRemove: a
}) {
  const p = fa(e.mode);
  return /* @__PURE__ */ c(
    "div",
    {
      className: o ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": p,
      children: [
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            ...n,
            disabled: i,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${t + 1}`,
            children: /* @__PURE__ */ r(wi, {})
          }
        ),
        /* @__PURE__ */ c("span", { children: [
          "Step ",
          t + 1
        ] }),
        /* @__PURE__ */ c(
          "select",
          {
            "aria-label": "Tag operation",
            value: e.mode,
            onChange: (l) => s({ ...e, mode: l.target.value }),
            children: [
              /* @__PURE__ */ r("option", { value: "ADD", children: "Add tags" }),
              /* @__PURE__ */ r("option", { value: "REMOVE", children: "Remove tags" }),
              /* @__PURE__ */ r("option", { value: "REMOVE_TREE", children: "Remove tags and descendants" }),
              /* @__PURE__ */ r("option", { value: "MARK_PRESENT", children: "Mark present" }),
              /* @__PURE__ */ r("option", { value: "MARK_ABSENT", children: "Mark absent" }),
              /* @__PURE__ */ r("option", { value: "CLEAR_ABSENCE", children: "Clear absence" })
            ]
          }
        ),
        /* @__PURE__ */ r("div", { className: "dq-step-tags", children: /* @__PURE__ */ r(
          xt,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (l) => s({ ...e, tagIds: l }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ r("button", { type: "button", "aria-label": "Remove step", onClick: a, children: /* @__PURE__ */ r(Ao, {}) })
      ]
    }
  );
}
async function Wc() {
  const e = await ee("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = n ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (n)
    try {
      const a = JSON.parse(n);
      Array.isArray(a.reviews) && (i = JSON.stringify(a.reviews, null, 2));
    } catch {
    }
  const o = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), s = document.createElement("a");
  s.href = o, s.download = "data-quality-browser-recovery.json", s.click(), URL.revokeObjectURL(o);
}
function fo({ label: e }) {
  return /* @__PURE__ */ c("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ r(qo, { className: "dq-spin" }),
    e
  ] });
}
function po({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ c("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ r(Zr, {}),
    /* @__PURE__ */ r("p", { children: e }),
    /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const tl = { components: { DataQualityPage: Dc } };
export {
  Dc as DataQualityPage,
  tl as default,
  or as objectFiltersEqual
};
