import { jsxs as u, jsx as n, Fragment as qe } from "react/jsx-runtime";
import { useRef as P, useState as E, useMemo as Rt, useEffect as G, useCallback as Tt, useLayoutEffect as Pn } from "react";
import { DetailListToolbar as $r, VIDEO_SORT_OPTIONS as Jr, VIDEO_CRITERIA as yr, EntityReferenceMultiSelector as lt, PERFORMER_CRITERIA as mn, FilterDialog as Mn, DetailListPagination as Fn, VideoPlayer as Ln, TAG_SORT_OPTIONS as $n, TAG_CRITERIA as xn, EntityDetailTabs as ki, TagTile as Ii, VideoCard as Oi, SortableList as xr } from "@cove/runtime/components";
import { Save as Qr, RotateCcw as _n, ChevronLeft as Dn, Pencil as Un, Settings as Pi, AlertTriangle as _r, ChevronRight as jn, Film as Dr, Loader2 as Kn, Tags as Mi, ExternalLink as Fi, X as Vn, Plus as Li, Upload as $i, Trash2 as Gn, GripVertical as Wr } from "@cove/runtime/lucide-react";
import { extensionFetch as xi } from "@cove/runtime/api";
function me(e) {
  return e.entityType ?? "video";
}
function bt(e, t) {
  return "qwertyuiop"[t] ?? "";
}
function br(e) {
  if (e.entityType === "performerOccurrence") {
    if (!Jn(e.occurrence))
      return "Complete the optional occurrence condition before saving.";
    if (e.actions.some((t) => t.steps.some((r) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(r.mode))))
      return "Occurrence actions support adding and removing tags on the active performer. Video tag assessments are not supported here.";
  }
  return me(e) === "video" && e.actions.some(
    (t) => Bn(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => Gt(t, me(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
function Re(e) {
  const t = (r, o) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : o;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(1e3, t(e.perPage, 40)))
  };
}
function hn(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function Ye(e) {
  const { page: t, ...r } = e.view.filter, o = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    e.entityType === "performerOccurrence" ? ["performerOccurrence", ...o, e.occurrence] : me(e) === "tag" ? ["tag", ...o] : o
  );
}
function Gt(e, t) {
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
    ].includes(o.mode) && o.tagIds.length > 0 && o.tagIds.every((a) => Number.isSafeInteger(a) && a > 0)
  ) && !Bn(e) : !1;
}
function wr(e) {
  return "steps" in e ? e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  ) : !1;
}
function Bn(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.steps)
    if (["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(r.mode))
      for (const o of r.tagIds) {
        const a = t.get(o);
        if (a && a !== r.mode) return !0;
        t.set(o, r.mode);
      }
  return !1;
}
function ir(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || r.entityType === "video" || r.entityType === "tag" || r.entityType === "performerOccurrence") && (r.entityType !== "performerOccurrence" || Jn(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && (r.view.reviewMode === void 0 || ["single", "multiple"].includes(r.view.reviewMode)) && (r.view.selectAllOnLoad === void 0 || typeof r.view.selectAllOnLoad == "boolean") && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && _i(r.presentation, r.entityType === "tag") && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (o) => typeof o == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (o) => typeof (o == null ? void 0 : o.id) == "string" && typeof o.label == "string" && (o.shortcut === void 0 || typeof o.shortcut == "string") && (r.entityType === "tag" ? "effect" in o && !("steps" in o) && Gt(o, "tag") : "steps" in o && !("effect" in o) && Array.isArray(o.steps) && o.steps.every(
        (a) => a && Array.isArray(a.tagIds)
      ) && Gt(o, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => br(r)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function _i(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const r = e;
  return (r.cardSize === void 0 || r.cardSize === null || Number.isFinite(r.cardSize) && r.cardSize >= 115 && r.cardSize <= 380) && (!t || r.annotations === void 0 && r.annotationParents === void 0 && r.binParents === void 0) && (r.annotations === void 0 || Array.isArray(r.annotations) && r.annotations.every(
    (o) => ["date", "studio", "performers", "tags"].includes(o)
  )) && [r.annotationParents, r.binParents].every(
    (o) => o === void 0 || Array.isArray(o) && o.every((a) => Number.isSafeInteger(a) && a > 0)
  );
}
function Ur(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const o of e)
    for (const a of o)
      r.has(a.id) || (r.add(a.id), t.push(a));
  return t;
}
function Jn(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (o) => Array.isArray(o) && o.every((a) => Number.isSafeInteger(a) && a > 0) && new Set(o).size === o.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && (t.targetMode !== "selected" || t.performerIds.length > 0) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && ["any", "includes", "includesAll", "excludes", "isNull"].includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && r(t.tagIds) && typeof t.multiple == "boolean";
}
function yn(e, t) {
  return e.size > 0 ? [...e].sort((r, o) => r - o) : t == null ? [] : [t];
}
function bn(e, t, r, o) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!o && t.includes(r)) return r;
  const a = Math.max(0, e.indexOf(r));
  if (o) {
    for (const d of e.slice(a + 1))
      if (t.includes(d)) return d;
    if (t.includes(r)) {
      for (const d of e.slice(0, a).reverse())
        if (t.includes(d)) return d;
      return r;
    }
  }
  return t[Math.min(a, t.length - 1)];
}
function wn(e, t) {
  const r = new Set(e), o = t.length > 0 && t.every((a) => r.has(a));
  for (const a of t)
    o ? r.delete(a) : r.add(a);
  return r;
}
function Qn(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function Di(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-actions, .dq-pagination-row, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Ui(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function ji(e, t) {
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
const Wn = "ext:com.midnightrider.data-quality:configuration", Ki = "ext:cove-data-quality:video-reviews", jr = "ext:com.midnightrider.data-quality:progress", or = /* @__PURE__ */ new Map(), mr = /* @__PURE__ */ new Map(), jt = (e, t) => e.includes("*") || e.includes(t), vr = (e) => B(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Vi = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Kr(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Kt(e) {
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
    reviews: ir(JSON.stringify(t.reviews)),
    deletedIds: Kr(t.deletedIds),
    importedIds: Kr(t.importedIds)
  };
}
function Gi(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const o = /* @__PURE__ */ new Set();
  for (const a of t) {
    const d = localStorage.getItem(a);
    if (d !== null) {
      const s = ir(d);
      r ?? (r = s), s.forEach((g) => o.add(g.id));
    }
    Kr(
      JSON.parse(localStorage.getItem(`${a}:account-imports`) ?? "[]")
    ).forEach((s) => o.add(s));
  }
  return {
    reviews: r ?? [],
    known: [...o],
    present: r !== void 0
  };
}
async function zn(e) {
  const t = await B("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Hn(e, t) {
  const r = (mr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return mr.set(e, r), r.finally(() => {
    mr.get(e) === r && mr.delete(e);
  }).catch(() => {
  }), r;
}
let Zt = null;
function Bi() {
  if (Zt) return Zt;
  const e = Ji();
  return Zt = e, e.finally(() => {
    Zt === e && (Zt = null);
  }).catch(() => {
  }), e;
}
async function Ji() {
  var b;
  const e = await B("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, o = jt(e.permissions, "savedfilters.read"), a = o && jt(e.permissions, "savedfilters.write"), d = o ? (await vr(Wn)).filter((I) => I.name === "Data Quality configuration").sort((I, O) => I.id - O.id) : [];
  if (d.length > 1) {
    const I = (O) => {
      const { revision: q, ...R } = Kt(O.uiOptions);
      return JSON.stringify(R);
    };
    if (d.some((O) => I(O) !== I(d[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (a)
      for (const O of d.slice(1))
        await B(`/api/savedfilters/${O.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${O.id}` })
        });
    d.splice(1);
  }
  let s = d.length ? Kt(d[0].uiOptions) : Vi();
  const g = localStorage.getItem(`${r}:migrated`) === "true", m = localStorage.getItem(r), h = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && m && (s = Kt(m));
  let S = !d.length;
  if (d.length && h && m) {
    const I = Kt(m);
    if (I.reviews.some((q) => {
      const R = s.reviews.find((U) => U.id === q.id);
      return R && JSON.stringify(R) !== JSON.stringify(q);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const O = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...I.deletedIds])
    ];
    s = {
      ...s,
      reviews: Ur(s.reviews, I.reviews).filter(
        (q) => !O.includes(q.id)
      ),
      deletedIds: O,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...I.importedIds])
      ]
    }, S = !0;
  }
  if (!g) {
    const I = JSON.stringify(s), O = Gi(t);
    if (d.length && O.reviews.some((T) => {
      const ne = s.reviews.find((Y) => Y.id === T.id);
      return ne && JSON.stringify(ne) !== JSON.stringify(T);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const q = o ? (await vr(Ki)).flatMap(
      (T) => ir(T.uiOptions ?? "[]")
    ) : [], R = O.known.filter(
      (T) => !O.reviews.some((ne) => ne.id === T)
    ), U = /* @__PURE__ */ new Set([...s.deletedIds, ...R]);
    s = {
      ...s,
      reviews: Ur(
        O.reviews,
        s.reviews,
        q.filter(
          (T) => !O.known.includes(T.id) && !s.importedIds.includes(T.id)
        )
      ).filter((T) => !U.has(T.id)),
      deletedIds: [...U],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...O.known,
          ...q.map((T) => T.id)
        ])
      ]
    }, S || (S = JSON.stringify(s) !== I);
  }
  const C = {
    userId: t,
    recordId: (b = d[0]) == null ? void 0 : b.id,
    config: s,
    readable: o,
    writable: a,
    durable: a
  };
  if (or.set(r, C), S && a) {
    const I = s;
    d.length && (C.config = Kt(d[0].uiOptions)), await Xn(r, I), s = C.config;
  } else d.length || (localStorage.setItem(r, JSON.stringify(s)), !o && (!g || h) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!o) localStorage.setItem(`${r}:migrated`, "true");
  else if (a)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: s.reviews,
    storageKey: r,
    canWrite: jt(e.permissions, "videos.write"),
    canWriteVideos: jt(e.permissions, "videos.write"),
    canWriteTags: jt(e.permissions, "tags.write"),
    canReadTagGroups: jt(e.permissions, "taggroups.read"),
    canConfigure: !o || a,
    storageNotice: o ? a ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Xn(e, t) {
  const r = or.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const o = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await zn(r), r.recordId != null) {
      const d = await B(
        `/api/savedfilters/${r.recordId}`
      );
      if (Kt(d.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const a = await B(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Wn,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(o)
        })
      }
    );
    r.recordId = a.id;
  } else
    localStorage.setItem(e, JSON.stringify(o)), localStorage.setItem(`${e}:local-only`, "true");
  if (r.config = o, r.durable)
    try {
      localStorage.setItem(e, JSON.stringify(o)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function Qi(e, t) {
  return ir(JSON.stringify(t)), Hn(e, async () => {
    const r = or.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const o = r.config.reviews.filter((a) => !t.some((d) => d.id === a.id)).map((a) => a.id);
    await Xn(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...o])
      ].filter((a) => !t.some((d) => d.id === a))
    });
  });
}
function vn(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([r, o]) => /^[1-9]\d*:[1-9]\d*$/.test(r) && ["reviewed", "cannotDetermine"].includes(String(o)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Wi(e, t) {
  const r = or.get(e);
  if (!r) return null;
  const o = localStorage.getItem(`${e}:progress:${t}`), a = o ? vn(o) : null;
  if (!r.readable) return a;
  const d = (await vr(jr)).find(
    (g) => g.name === t
  ), s = d ? vn(d.uiOptions) : null;
  return a && (!s || a.updatedAt > s.updatedAt) ? a : s;
}
function zi(e, t, r) {
  const o = `${e}:progress:${t}`;
  try {
    localStorage.setItem(o, JSON.stringify(r));
  } catch {
  }
  return Hn(o, async () => {
    const a = or.get(e);
    if (!(a != null && a.writable)) return;
    await zn(a);
    const d = (await vr(jr)).find(
      (s) => s.name === t
    );
    await B(
      d ? `/api/savedfilters/${d.id}` : "/api/savedfilters",
      {
        method: d ? "PUT" : "POST",
        body: JSON.stringify({
          mode: jr,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const qt = "confirmed_absent_tags", zr = "Confirmed absent tags", Hi = {
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
function Bt(e) {
  return Array.isArray(e) ? e.map(Bt) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? Hi[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === qt.toLowerCase() ? r.toLowerCase() : Bt(r)
    ])
  ) : e;
}
async function B(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const o = await xi(e, { ...t, headers: r });
  if (!o.ok) {
    let d = o.statusText || `Request failed (${o.status}).`;
    try {
      const s = await o.json();
      d = s.message || s.detail || s.error || d;
    } catch {
    }
    throw new Error(d);
  }
  if (o.status === 204 || o.status === 205) return;
  const a = await o.text();
  return a ? JSON.parse(a) : void 0;
}
const Xi = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Yi = 0;
function Hr(e) {
  return B(`/api/videos/${e}?dqRead=${Xi}-${++Yi}`, { cache: "no-store" });
}
async function tr(e, t, r) {
  const o = { ...e.view.objectFilter }, a = o._filterExpression;
  if (delete o._filterExpression, delete o.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return B("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Bt({
        findFilter: Re(t),
        objectFilter: o,
        filterExpression: a
      })
    )
  });
}
async function Sn(e, t, r) {
  const o = { ...e.view.objectFilter };
  return delete o._filterExpression, B("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Bt({
        findFilter: Re(t),
        objectFilter: o
      })
    )
  });
}
function Zi(e) {
  return B("/api/taggroups", { signal: e });
}
function eo(e) {
  return `/api/videos/${e.id}/image?max=1280&v=${encodeURIComponent(e.updatedAt)}`;
}
function Yn(e) {
  return `/api/stream/video/${e}`;
}
function En(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function to(e) {
  return `/api/stream/video/${e}/preview`;
}
function ro(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function no(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function ar(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const o of e) {
    await B(`/api/tags/${o}`, { signal: t }), r.add(o);
    for (let a = 1; ; a++) {
      const d = await B("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Bt({
            findFilter: { page: a, perPage: 1e3, sort: "id", direction: "asc" },
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
      for (const s of d.items) r.add(s.id);
      if (a * 1e3 >= d.totalCount) break;
      if (!d.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...r];
}
function io(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${qt} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function Xr() {
  const t = (await B("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === qt.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${zr} custom field before applying tag assessments.`
    };
  const r = io(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function oo() {
  const e = await Xr();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await B("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: qt,
        label: zr,
        type: "tag",
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function Sr(e) {
  return [...new Set(e)];
}
function ao(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${qt} value is not a valid tag list.`
    );
  return Sr(e);
}
function so(e) {
  return Sr(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function lo(e, t) {
  let r;
  try {
    r = await Xr();
  } catch (h) {
    throw new Error(
      `Could not verify the ${zr} custom field. ${h instanceof Error ? h.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const o = await Promise.all(
    e.steps.map(async (h) => ({
      ...h,
      tagIds: h.mode === "REMOVE_TREE" ? await ar(h.tagIds) : Sr(h.tagIds)
    }))
  ), a = o.filter(
    (h) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(h.mode)
  ), d = o.filter(
    (h) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(h.mode)
  ), s = Sr(t), g = r.definition.key;
  let m = 0;
  for (const h of s)
    try {
      const S = await Hr(h), C = so(S), b = { ...S.customFields ?? {} }, I = b[g], O = ao(I), q = new Set(C), R = new Set(O);
      for (const Y of a)
        for (const ie of Y.tagIds)
          Y.mode === "ADD" ? q.add(ie) : q.delete(ie);
      for (const Y of d)
        for (const ie of Y.tagIds)
          Y.mode === "MARK_PRESENT" ? (q.add(ie), R.delete(ie)) : Y.mode === "MARK_ABSENT" ? (q.delete(ie), R.add(ie)) : R.delete(ie);
      const U = [...q], T = [...R];
      JSON.stringify(C) === JSON.stringify(U) && JSON.stringify(O) === JSON.stringify(T) && (I === void 0 ? T.length === 0 : JSON.stringify(I) === JSON.stringify(O)) || await B(`/api/videos/${h}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: U,
          customFields: {
            ...b,
            [g]: T
          }
        })
      }), m++;
    } catch (S) {
      throw new Error(
        `Assessment stopped after ${m} video${m === 1 ? "" : "s"} completed; video ${h} was affected. Refresh and inspect it before retrying. ${S instanceof Error ? S.message : "Request failed."}`
      );
    }
}
async function Zn(e, t) {
  if (!Gt(e) || t.length === 0 || t.some((o) => !Number.isSafeInteger(o) || o <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (wr(e)) {
    await lo(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (o) => ({
      mode: o.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: o.mode === "REMOVE_TREE" ? await ar(o.tagIds) : o.tagIds
    }))
  );
  for (let o = 0; o < r.length; o++)
    try {
      await B("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({
          ids: [...t],
          tagIds: [...r[o].tagIds],
          tagMode: r[o].mode
        })
      });
    } catch (a) {
      throw new Error(
        `Step ${o + 1} failed; ${o} earlier step(s) completed. Refresh and check the selected videos before retrying. ${a instanceof Error ? a.message : "Request failed."}`
      );
    }
}
async function co(e, t) {
  if (!Gt(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await B("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
async function uo(e, t, r) {
  if (!Gt(r) || r.steps.some(
    (d) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(d.mode)
  ))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const o = await Promise.all(
    r.steps.map(async (d) => ({
      ...d,
      tagIds: d.mode === "REMOVE_TREE" ? await ar(d.tagIds) : d.tagIds
    }))
  );
  let a = t.applications;
  for (const d of o)
    a = await ri(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: d.tagIds,
          multiple: !0
        }
      },
      t,
      d.mode === "ADD" ? d.tagIds : []
    );
  return a;
}
async function ei(e, t) {
  const r = e.occurrence;
  if (r.targetMode === "all" || r.targetMode === "filter" && Object.keys(r.performerFilter).length === 0) return null;
  if (r.targetMode === "selected") return r.performerIds;
  const o = /* @__PURE__ */ new Set(), { _filterExpression: a, ...d } = r.performerFilter;
  for (let s = 1; ; s++) {
    const g = await B("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Bt({
          findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: d,
          filterExpression: a
        })
      )
    });
    if (g.items.forEach((m) => o.add(m.id)), s * 1e3 >= g.totalCount) return [...o];
    if (!g.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function ti(e, t) {
  const { _filterExpression: r, ...o } = e.view.objectFilter, a = e.occurrence, d = {
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
  };
  return {
    ...e,
    entityType: "video",
    actions: [],
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...r ? [{ group: r }] : [],
            { filter: o },
            { filter: { performerFilterCriterion: d } }
          ]
        }
      }
    }
  };
}
function fo(e, t, r = e.conditionTagIds.map((o) => [o])) {
  const o = new Set(t), a = (d) => d.some((s) => o.has(s));
  switch (e.condition) {
    case "any":
      return !0;
    case "isNull":
      return o.size === 0;
    case "includes":
      return r.some(a);
    case "includesAll":
      return r.every(a);
    case "excludes":
      return !r.some(a);
  }
}
async function po(e, t, r, o) {
  if ((t == null ? void 0 : t.length) === 0)
    return { items: [], totalCount: 0 };
  const a = await tr(
    ti(e, t),
    { ...e.view.filter, page: r },
    o
  ), d = t === null ? null : new Set(t), s = e.occurrence, g = a.items.length && s.includeSubtags !== !1 && !["any", "isNull"].includes(s.condition) ? await Promise.all(s.conditionTagIds.map((S) => ar([S], o))) : s.conditionTagIds.map((S) => [S]), m = new Array(a.items.length);
  let h = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, a.items.length) }, async () => {
      for (; h < a.items.length; ) {
        const S = h++, C = a.items[S], b = await B(
          `/api/tagapplications?hostType=video&hostId=${C.id}&contextType=performer`,
          { signal: o }
        );
        m[S] = C.performers.filter((I) => d === null || d.has(I.id)).flatMap((I) => {
          const O = b.filter(
            (q) => q.hostType === "video" && q.hostId === C.id && q.contextType === "performer" && q.contextId === I.id
          );
          return fo(
            e.occurrence,
            O.map((q) => q.tag.id),
            g
          ) ? [
            {
              key: `${C.id}:${I.id}`,
              video: C,
              performer: I,
              applications: O
            }
          ] : [];
        });
      }
    })
  ), { items: m.flat(), totalCount: a.totalCount };
}
async function ri(e, t, r) {
  const o = new Set(e.occurrence.tagIds);
  if (r.some((m) => !o.has(m)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const a = await Hr(t.video.id);
  if (!a.performers.some(
    (m) => m.id === t.performer.id
  ))
    throw new Error(
      "This performer is no longer linked to the scene. Refresh the queue."
    );
  const d = `/api/tagapplications?hostType=video&hostId=${a.id}&contextType=performer&contextId=${t.performer.id}`, s = (await B(d)).filter(
    (m) => m.hostType === "video" && m.hostId === a.id && m.contextType === "performer" && m.contextId === t.performer.id
  ), g = new Set(r);
  try {
    for (const m of g)
      s.some((h) => h.tag.id === m) || await B("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: "video",
          hostId: a.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: m,
          sourceKey: "user"
        })
      });
    for (const m of s)
      o.has(m.tag.id) && !g.has(m.tag.id) && await B(`/api/tagapplications/${m.id}`, {
        method: "DELETE"
      });
    return await B(d);
  } catch (m) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${m instanceof Error ? m.message : "Request failed."}`
    );
  }
}
function nr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, g) => nr(s, t[g]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, o = t, a = Object.keys(r).sort(), d = Object.keys(o).sort();
  return a.length === d.length && a.every(
    (s, g) => s === d[g] && nr(r[s], o[s])
  );
}
const Er = [
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
  "startFrom"
], go = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0
};
function Vt(e) {
  const t = e.entityType === "performerOccurrence" ? e.occurrence : void 0;
  return {
    filter: Re({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }),
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
        includeSubtags: t.includeSubtags ?? !0
      }
    } : {}
  };
}
function Cn(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function Vr(e, t) {
  if (!Er.some((s) => t.has(s))) {
    const s = Vt(e);
    return { query: s, startAtEnd: s.startFrom === "end" };
  }
  const o = {
    q: t.get("q") ?? "",
    page: Number(t.get("page") ?? 1),
    perPage: Number(t.get("perPage") ?? 40),
    sort: t.get("sort") ?? "date",
    direction: t.get("direction") === "asc" ? "asc" : "desc"
  };
  if (t.has("seed") && (o.seed = Number(t.get("seed"))), t.get("sorts")) {
    const s = t.get("sorts").split(",").map((g) => {
      const m = g.lastIndexOf(":");
      return { key: g.slice(0, m), direction: g.slice(m + 1) };
    });
    if (s.some((g) => !g.key || !["asc", "desc"].includes(g.direction)))
      throw new Error("Invalid review URL sort.");
    o.sorts = s, o.sort = s[0].key, o.direction = s[0].direction;
  }
  let a;
  if (e.entityType === "performerOccurrence" && (a = {
    ...go,
    ...Cn(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(a.targetMode) || !["any", "includes", "includesAll", "excludes", "isNull"].includes(
    a.condition
  ) || !Array.isArray(a.performerIds) || !Array.isArray(a.conditionTagIds) || typeof a.includeSubtags != "boolean" || [...a.performerIds, ...a.conditionTagIds].some(
    (s) => !Number.isSafeInteger(s) || s <= 0
  ) || !a.performerFilter || typeof a.performerFilter != "object" || Array.isArray(a.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const d = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Re(o),
      objectFilter: Cn(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: d,
      performerScope: a
    },
    startAtEnd: !t.has("page") && d === "end"
  };
}
function rr(e, t) {
  const r = new URLSearchParams(window.location.search);
  Er.forEach((o) => r.delete(o)), r.set("review", e);
  for (const o of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[o] !== void 0 && r.set(o, String(t.filter[o]));
  Array.isArray(t.filter.sorts) && r.set(
    "sorts",
    t.filter.sorts.map((o) => `${o.key}:${o.direction}`).join(",")
  ), r.set("filters", JSON.stringify(t.objectFilter)), r.set("searchMode", t.searchMode), r.set("startFrom", t.startFrom), t.performerScope && r.set("performerScope", JSON.stringify(t.performerScope)), window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${r}${window.location.hash}`
  );
}
function Ze(e, t) {
  const r = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return e.entityType === "performerOccurrence" ? {
    ...e,
    view: r,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: r };
}
function mo(e, t) {
  return {
    added: t.filter((r) => !e.includes(r)),
    removed: e.filter((r) => !t.includes(r))
  };
}
function ho(e) {
  return `/api/tagapplications?hostType=video&hostId=${e.video.id}&contextType=performer&contextId=${e.occurrence.performer.id}`;
}
async function er(e) {
  var d;
  if (e.occurrence) {
    const s = (await B(ho(e))).filter(
      (g) => g.hostType === "video" && g.hostId === e.video.id && g.contextType === "performer" && g.contextId === e.occurrence.performer.id
    );
    return {
      ids: [...new Set(s.map((g) => g.tag.id))],
      names: [...new Set(s.map((g) => g.tag.name))],
      absent: [],
      applications: s
    };
  }
  const t = await Hr(e.video.id), r = (t.tags ?? []).filter(
    (s) => s.canRemove !== !1 || s.isDerived !== !0
  ), o = Object.keys(t.customFields ?? {}).find(
    (s) => s.toLowerCase() === qt
  ) ?? qt, a = ((d = t.customFields) == null ? void 0 : d[o]) ?? [];
  if (!Array.isArray(a) || a.some((s) => !Number.isSafeInteger(s)))
    throw new Error(
      "Confirmed absent tags are invalid. Inspect the video before editing."
    );
  return { ids: r.map((s) => s.id), names: r.map((s) => s.name), absent: a };
}
async function yo(e, t, r) {
  if (t.occurrence && e.entityType === "performerOccurrence")
    await ri(
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
    for (const [o, a] of [
      ["ADD", r.added],
      ["REMOVE", r.removed]
    ])
      a.length && await B("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({ ids: [t.video.id], tagMode: o, tagIds: a })
      });
}
async function bo(e, t, r) {
  t.occurrence && e.entityType === "performerOccurrence" ? await uo(e, t.occurrence, r) : await Zn(r, [t.video.id]);
}
const wo = {
  EQUALS: "Equals",
  NOT_EQUALS: "Does Not Equal",
  GREATER_THAN: ">",
  LESS_THAN: "<",
  INCLUDES: "Includes",
  EXCLUDES: "Excludes",
  INCLUDES_ALL: "Includes All",
  EXCLUDES_ALL: "Excludes All",
  IS_NULL: "Is Null",
  NOT_NULL: "Not Null",
  BETWEEN: "Between",
  NOT_BETWEEN: "Not Between",
  MATCHES_REGEX: "Regex",
  NOT_MATCHES_REGEX: "Not Regex",
  UNDER_PATH: "Under",
  NOT_UNDER_PATH: "Not Under"
};
function Yr(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function vo(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function ni(e) {
  return [
    ...new Set(
      Yr(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function ii(e, t) {
  const r = Yr(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((o) => {
      const a = String(o.key ?? ""), d = wo[String(o.modifier ?? "EQUALS")], s = (C, b) => String(b ?? "").trim() || t[String(C)] || String(C ?? ""), g = s(
        o.value,
        o.displayValue
      ), m = s(
        o.value2,
        o.displayValue2
      ), h = String(o.modifier ?? "EQUALS"), S = h === "IS_NULL" || h === "NOT_NULL" ? [] : h === "BETWEEN" || h === "NOT_BETWEEN" ? [g, "and", m] : [g];
      return {
        ...o,
        label: [vo(a), d, ...S].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function oi(e) {
  const t = Yr(e.customFieldCriteria);
  return t.length ? {
    ...e,
    customFieldCriteria: t.map(
      ({ label: r, ...o }) => o
    )
  } : e;
}
function ai(e, t, r) {
  return r || "customFieldCriteria" in t || !Array.isArray(e.customFieldCriteria) ? t : { ...t, customFieldCriteria: e.customFieldCriteria };
}
function Nn({
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
function Mr(e, t) {
  if (!t) return e;
  const r = /* @__PURE__ */ new Map();
  for (const o of e)
    r.set(o.video.id, [...r.get(o.video.id) ?? [], o]);
  return [...r.values()].reverse().flat();
}
const We = (e) => e instanceof Error ? e.message : "Request failed.";
function So({
  actions: e,
  disabled: t,
  canWrite: r,
  onApply: o
}) {
  const [a, d] = E({});
  G(() => {
    let g = !0;
    return Promise.all(
      [
        ...new Set(
          e.flatMap(
            (m) => m.steps.flatMap((h) => h.tagIds)
          )
        )
      ].map(async (m) => {
        try {
          return [
            m,
            (await B(`/api/tags/${m}`)).name
          ];
        } catch {
          return [m, "Unavailable tag"];
        }
      })
    ).then((m) => {
      g && d(Object.fromEntries(m));
    }), () => {
      g = !1;
    };
  }, [e]);
  const s = {
    ADD: "Add",
    REMOVE: "Remove",
    REMOVE_TREE: "Remove tree",
    MARK_PRESENT: "Mark present",
    MARK_ABSENT: "Mark absent",
    CLEAR_ABSENCE: "Clear absence"
  };
  return /* @__PURE__ */ u("div", { className: "dq-review-actions", children: [
    /* @__PURE__ */ n("p", { children: "Actions apply and advance. Shift-click or Shift + shortcut applies and stays." }),
    e.map((g, m) => /* @__PURE__ */ u("div", { className: "dq-action-pair", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: t || !r && g.steps.length > 0,
          onClick: (h) => o(g, h.shiftKey),
          children: /* @__PURE__ */ u("span", { children: [
            bt(g, m) && /* @__PURE__ */ n("kbd", { children: bt(g, m) }),
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
          disabled: t || !r,
          "aria-label": `Apply & stay: ${g.label}`,
          title: `Apply & stay: ${g.label}`,
          onClick: () => o(g, !0),
          children: /* @__PURE__ */ n(Qr, { "aria-hidden": "true" })
        }
      ),
      g.steps.length > 0 && /* @__PURE__ */ n("small", { className: "dq-review-action-summary", children: g.steps.map(
        (h) => `${s[h.mode]}: ${h.tagIds.map((S) => a[S] ?? "Loading tag…").join(", ")}`
      ).join("; ") })
    ] }, g.id))
  ] });
}
function Eo({
  review: e,
  canWrite: t,
  onBusy: r,
  onSaveDefaults: o,
  editRequest: a = 0,
  renderRuleEditor: d
}) {
  var Pe;
  const s = P(null), g = P("");
  if (!s.current)
    try {
      s.current = Vr(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (l) {
      g.current = We(l), s.current = { query: Vt(e), startAtEnd: !1 };
    }
  const [m, h] = E(null), S = P(null), C = P(null), b = P(null), [I, O] = E(!!g.current), q = P(0), [R, U] = E(s.current.query), T = P(R);
  T.current = R;
  const [ne, Y] = E(0), ie = P(s.current.startAtEnd), [p, M] = E([]), [w, K] = E(null), oe = P(null), [Ae, fe] = E(null), [sr, pe] = E(0), kt = Rt(() => {
    if (!w) return null;
    const l = p.findIndex((f) => f.key === w.key);
    return l < 0 ? null : p.slice(l + 1).find((f) => f.video.id !== w.video.id) ?? null;
  }, [w, p]), [Ue, ct] = E(0), [Ee, It] = E(!1), [de, Ot] = E(!1), Ie = P(!1), He = P(!0), et = P(null);
  G(() => (He.current = !0, () => {
    He.current = !1;
  }), []);
  const [wt, Z] = E(g.current), [vt, Fe] = E(""), [he, ee] = E(null), [ye, J] = E(!1), [N, Q] = E([]), $ = P([]), Xe = P(null), tt = P(null), Jt = P(null);
  G(() => {
    var l, f;
    ye && ((f = (l = Jt.current) == null ? void 0 : l.querySelector("input")) == null || f.focus());
  }, [ye]);
  const [ge, dt] = E(!1);
  G(() => {
    if (Ee || ge || !tt.current) return;
    const l = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const f = tt.current;
      f != null && f.isConnected && !f.disabled && f.focus(), tt.current = null;
    });
    return () => cancelAnimationFrame(l);
  }, [Ee, ge, ne]);
  const [ut, St] = E([]), [Pt, Mt] = E({}), Ft = P(null), ft = P(0), je = P(!1), [ae, Lt] = E({});
  G(() => {
    let l = !0;
    return Promise.all(
      ni(R.objectFilter).map(
        async (f) => [
          String(f),
          (await B(`/api/tags/${f}`)).name
        ]
      )
    ).then((f) => {
      l && Lt(Object.fromEntries(f));
    }).catch(() => {
    }), () => {
      l = !1;
    };
  }, [R.objectFilter]);
  const pt = P(0), Qt = P(e);
  Qt.current = e;
  const Ce = m ?? e, Ke = Rt(
    () => Ze(Ce, R),
    [Ce, R]
  ), V = P(Ke);
  V.current = Ke;
  const Et = R.startFrom !== (e.view.startFrom ?? "end") || !nr(
    JSON.parse(Ye(Ze(e, R))),
    JSON.parse(Ye(Ze(e, Vt(e))))
  ), ue = de || Ee || ye, rt = Number(R.filter.page);
  function Le(l, f = !1) {
    Ie.current || (g.current = "", ie.current = f, T.current = l, U(l), ct(0), It(!0), f || rr(e.id, l), Y((k) => k + 1));
  }
  function $t() {
    if (Ie.current = !1, Ot(!1), He.current && et.current) {
      const l = et.current;
      et.current = null, Le(l.query, l.startAtEnd);
    }
  }
  G(() => {
    const l = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const f = Vr(
            Qt.current,
            new URLSearchParams(window.location.search)
          );
          Ie.current ? et.current = f : Le(f.query, f.startAtEnd);
        } catch (f) {
          Z(We(f));
        }
    };
    return window.addEventListener("popstate", l), () => window.removeEventListener("popstate", l);
  }, [e.id]), G(() => (r(de || Ee || ye || !!m), () => r(!1)), [de, Ee, ye, !!m, r]);
  async function xt(l, f, k) {
    if (l.entityType === "performerOccurrence") {
      const _ = await po(
        l,
        Ft.current,
        f,
        k
      );
      return {
        items: _.items.map((z) => ({
          key: z.key,
          video: z.video,
          occurrence: z
        })),
        totalCount: _.totalCount
      };
    }
    const x = await tr(
      l,
      { ...l.view.filter, page: f },
      k
    );
    return {
      items: x.items.map((_) => ({ key: String(_.id), video: _ })),
      totalCount: x.totalCount
    };
  }
  function Wt(l, f, k, x = !1, _ = !1) {
    if (!He.current || et.current) return;
    O(!0), M(
      _ ? l.items : Mr(l.items, T.current.startFrom === "end")
    ), ct(l.totalCount), be(k, x);
    const z = {
      ...T.current,
      filter: { ...T.current.filter, page: f }
    };
    T.current = z, U(z), rr(e.id, z);
  }
  function be(l, f = !1) {
    (l == null ? void 0 : l.key) !== (w == null ? void 0 : w.key) && (oe.current = null), (l == null ? void 0 : l.video.id) !== (w == null ? void 0 : w.video.id) && fe(f && l ? l.video.id : null), K(l);
  }
  G(() => {
    if (g.current) return;
    const l = new AbortController();
    b.current = l;
    const f = ++pt.current;
    return It(!0), Z(""), Fe(""), oe.current = null, fe(null), K(null), M([]), J(!1), (async () => {
      const k = Ze(Qt.current, T.current);
      Ft.current = k.entityType === "performerOccurrence" ? await ei(k, l.signal) : null;
      let x = Number(k.view.filter.page), _ = await xt(k, x, l.signal);
      const z = Math.max(
        1,
        Math.ceil(_.totalCount / Number(k.view.filter.perPage))
      );
      if ((ie.current || x > z) && (x = z, _ = await xt(k, x, l.signal)), ie.current = !1, f !== pt.current || l.signal.aborted) return;
      const it = Mr(_.items, k.view.startFrom === "end");
      Wt(_, x, it[0] ?? null);
    })().catch((k) => {
      !l.signal.aborted && f === pt.current && Z(We(k));
    }).finally(() => {
      !l.signal.aborted && f === pt.current && (O(!0), It(!1));
    }), () => {
      l.abort(), pt.current++;
    };
  }, [ne, e.id]), G(() => {
    if (ee(null), !w) return;
    let l = !0;
    return er(w).then((f) => {
      l && (ee(f), St(
        e.entityType === "performerOccurrence" ? f.ids.filter((k) => e.occurrence.tagIds.includes(k)) : []
      ));
    }).catch((f) => {
      l && Z(`Could not load current tags. ${We(f)}`);
    }), () => {
      l = !1;
    };
  }, [w]), G(() => {
    if (e.entityType !== "performerOccurrence" || e.actions.length)
      return;
    let l = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (f) => [
          f,
          (await B(`/api/tags/${f}`)).name
        ]
      )
    ).then((f) => {
      l && Mt(Object.fromEntries(f));
    }).catch((f) => {
      l && Z(We(f));
    }), () => {
      l = !1;
    };
  }, [e]);
  async function $e(l = !1, f = !1, k = !1) {
    var gt;
    if (!w) return;
    const x = p.findIndex((H) => H.key === w.key), _ = R.startFrom === "end" ? -1 : 1, z = ((gt = oe.current) == null ? void 0 : gt.key) === w.key ? oe.current : { key: w.key, page: rt, before: p.slice(0, x + 1).map((H) => H.key), after: p.slice(x + 1).map((H) => H.key) }, it = new Set(z.after), D = new Set(z.before), Ve = p.find((H) => {
      var De;
      return it.has(H.key) || (_ === 1 || rt < z.page) && ((De = oe.current) == null ? void 0 : De.key) === w.key && !D.has(H.key);
    });
    if (!l && Ve) {
      be(Ve, k);
      return;
    }
    const le = l ? D : new Set(p.map((H) => H.key)), _e = 1100 - (Date.now() - ft.current);
    _e > 0 && await new Promise((H) => window.setTimeout(H, _e));
    let Ne = _ === -1 && !l ? Math.max(1, rt - 1) : rt;
    for (; He.current && !et.current; ) {
      let H = await xt(Ke, Ne);
      const De = Math.max(
        1,
        Math.ceil(H.totalCount / Number(R.filter.perPage))
      );
      Ne > De && (Ne = De, H = await xt(Ke, Ne));
      const ot = Mr(H.items, _ === -1), te = new Map(ot.map((ve) => [ve.key, ve])), zt = l ? z.after.flatMap((ve) => {
        const Ht = te.get(ve);
        return Ht ? [Ht] : [];
      }) : [], lr = new Set(zt.map((ve) => ve.key)), mt = l ? {
        ...H,
        items: [
          ...zt,
          ...ot.filter(
            (ve) => ve.key !== w.key && !lr.has(ve.key)
          )
        ]
      } : H;
      if (f) {
        oe.current = z, Wt(mt, Ne, w, !1, l);
        return;
      }
      const ht = _ === -1 && rt === 1 && !l ? void 0 : mt.items.find(
        (ve) => !le.has(ve.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(l && _ === -1 && Ne === z.page) || it.has(ve.key))
      );
      if (ht || (_ === -1 ? Ne <= 1 : Ne >= De)) {
        Wt(
          mt,
          Ne,
          ht ?? null,
          k,
          l
        ), ht || Fe(
          H.totalCount ? "Reached the end in this direction. Matching items remain available from the scene pages." : "No matching scenes."
        );
        return;
      }
      Ne += _;
    }
  }
  async function xe(l, f = !1, k = !1, x = !1) {
    if (m || !w || Ie.current || Ee || ye && !k)
      return;
    const _ = k || x || !!(l != null && l.steps.length), z = _ && !f;
    if (_ && (!t || !he)) return;
    Ie.current = !0, Ot(!0), Z(""), Fe("");
    const it = p.findIndex((le) => le.key === w.key), D = _ && !f && it >= 0 ? p[it + 1] ?? null : null;
    D && (M(
      (le) => le.filter((_e) => _e.key !== w.key)
    ), be(D, !0));
    let Ve = !1;
    try {
      if (_) {
        const le = await er(w);
        if (l)
          await bo(Ke, w, l);
        else {
          const Ne = x && e.entityType === "performerOccurrence" ? e.occurrence.tagIds.filter((De) => le.ids.includes(De)) : $.current, H = mo(Ne, x ? ut : N);
          await yo(Ke, w, H);
        }
        ft.current = Date.now();
        const _e = await er(w);
        D || ee(_e), Ve = !0, J(!1), Fe("Tags saved.");
      }
      if (!He.current || et.current) return;
      _ ? await $e(!0, f, z) : f || await $e(), f && k && requestAnimationFrame(() => {
        var le;
        return (le = Xe.current) == null ? void 0 : le.focus();
      });
    } catch (le) {
      if (Z(
        Ve ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${We(le)}` : _ ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${We(le)}` : `Could not advance. ${We(le)}`
      ), _ && !Ve) {
        D && (M(p), fe(null), pe((_e) => _e + 1), K(w)), ft.current = Date.now();
        try {
          ee(await er(w));
        } catch {
          ee(null), Z(
            (_e) => `${_e} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      $t();
    }
  }
  G(() => {
    const l = (f) => {
      if (ye || m || de || Ee || ge || f.defaultPrevented || f.repeat || f.ctrlKey || f.altKey || f.metaKey || !Qn(f.target) || document.querySelector('[role="dialog"], dialog[open]'))
        return;
      const k = f.key.toLowerCase(), x = e.actions.find(
        (_, z) => bt(_, z) === k
      );
      x && (f.preventDefault(), f.stopPropagation(), xe(x, f.shiftKey));
    };
    return document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l);
  });
  function nt() {
    !o || m || Ie.current || ye || (C.current = document.activeElement, S.current = {
      error: wt,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(T.current),
      items: p,
      current: w,
      total: Ue,
      targets: Ft.current,
      stayedCursor: oe.current
    }, h(structuredClone(Ze(e, T.current))), Fe(""), Z(""));
  }
  G(() => {
    a && a !== q.current && I && !Ee && (q.current = a, nt());
  }, [a, Ee, I]);
  function _t() {
    h(null), requestAnimationFrame(() => {
      var l;
      return (l = C.current) == null ? void 0 : l.focus();
    });
  }
  function we() {
    var f;
    const l = S.current;
    !l || de || ((f = b.current) == null || f.abort(), pt.current++, T.current = l.query, U(l.query), M(l.items), K(l.current), ct(l.total), Ft.current = l.targets, oe.current = l.stayedCursor, It(!1), Z(l.error), Fe(""), window.history.replaceState(window.history.state, "", l.url), _t());
  }
  async function Te() {
    if (!m || !o || Ie.current) return;
    const l = Ze(
      { ...m, name: m.name.trim() },
      T.current
    ), f = br(l);
    if (f) {
      Z(f);
      return;
    }
    Ie.current = !0, Ot(!0), Z("");
    try {
      if (await o(l) === !1) throw new Error("Could not save review.");
      _t(), Fe("Review saved.");
    } catch (k) {
      Z(
        "Could not save review. Your edits are still open. " + We(k)
      );
    } finally {
      $t();
    }
  }
  async function Oe() {
    if (!o || Ie.current) return;
    const l = Ze(e, {
      ...T.current,
      filter: { ...T.current.filter, page: 1 }
    });
    Ie.current = !0, Ot(!0), Z("");
    try {
      if (await o(l) === !1) throw new Error("Could not save review.");
      Fe("Queue saved to this review.");
    } catch (f) {
      Z("Could not save queue. " + We(f));
    } finally {
      $t();
    }
  }
  const W = R.performerScope, ke = (l) => Le({
    ...T.current,
    filter: { ...T.current.filter, page: 1 },
    performerScope: { ...W, ...l }
  });
  return /* @__PURE__ */ u(
    "section",
    {
      className: "dq-review-workspace",
      "aria-label": W ? "Performer occurrence review" : "Video review",
      children: [
        m && /* @__PURE__ */ u("section", { className: "dq-rule-editor", "aria-label": "Edit review rule", children: [
          /* @__PURE__ */ n("h2", { children: "Edit review" }),
          /* @__PURE__ */ n("p", { children: "Preview matching scenes below. Save review keeps all rule changes; Cancel restores your previous view." }),
          /* @__PURE__ */ u("fieldset", { disabled: de, children: [
            d == null ? void 0 : d(
              Ze(m, R),
              h,
              de
            ),
            /* @__PURE__ */ u("label", { children: [
              "Review direction",
              /* @__PURE__ */ u(
                "select",
                {
                  "aria-label": "Review direction",
                  value: R.startFrom,
                  onChange: (l) => Le({
                    ...T.current,
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
                disabled: de || Ee,
                onClick: () => void Te(),
                children: "Save review"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button",
                type: "button",
                disabled: de,
                onClick: we,
                children: "Cancel"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u(
          "fieldset",
          {
            className: "dq-review-filters",
            disabled: ue,
            onClickCapture: (l) => {
              var x;
              const f = l.target instanceof Element ? l.target.closest("button") : null, k = (f == null ? void 0 : f.getAttribute("aria-label")) ?? ((x = f == null ? void 0 : f.textContent) == null ? void 0 : x.trim()) ?? "";
              f && !f.closest('[role="dialog"], dialog') && /^(Filters|Edit filter:|Edit performer criteria)/.test(k) && (tt.current = f);
            },
            children: [
              /* @__PURE__ */ n("legend", { children: "Scene filters" }),
              /* @__PURE__ */ u(
                "div",
                {
                  className: "dq-queue-toolbar",
                  onKeyDownCapture: (l) => {
                    var f;
                    l.key === "Escape" && (je.current = !1), ["Delete", "Backspace"].includes(l.key) && l.target instanceof Element && ((f = l.target.closest("button")) == null ? void 0 : f.getAttribute("aria-label")) === "Edit filter: Custom Fields" && (je.current = !0);
                  },
                  onClickCapture: (l) => {
                    var k, x;
                    const f = l.target instanceof Element ? l.target.closest("button") : null;
                    (f == null ? void 0 : f.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((k = f == null ? void 0 : f.textContent) == null ? void 0 : k.trim()) === "Clear all" ? je.current = !0 : (/^(Cancel|Filters)/.test(((x = f == null ? void 0 : f.textContent) == null ? void 0 : x.trim()) ?? "") || /^(Close|Dismiss)/.test((f == null ? void 0 : f.getAttribute("aria-label")) ?? "")) && (je.current = !1);
                  },
                  children: [
                    /* @__PURE__ */ n(
                      $r,
                      {
                        filter: R.filter,
                        objectFilter: ii(
                          R.objectFilter,
                          ae
                        ),
                        criteriaDefinitions: [
                          ...yr,
                          {
                            id: "custom-fields",
                            label: "Custom Fields",
                            filterKey: "customFieldCriteria"
                          }
                        ],
                        totalCount: Ue,
                        sortOptions: Jr,
                        showSearch: !0,
                        showSort: !0,
                        showPagingControls: !1,
                        onFilterChange: (l) => {
                          (l.sort !== T.current.filter.sort || l.direction !== T.current.filter.direction) && (l = { ...l, sorts: void 0 }), Le({
                            ...T.current,
                            filter: Re(l)
                          });
                        },
                        onObjectFilterChange: (l) => {
                          const f = ai(
                            T.current.objectFilter,
                            oi(l),
                            je.current
                          );
                          je.current = !1, Le({
                            ...T.current,
                            objectFilter: f,
                            filter: { ...T.current.filter, page: 1 }
                          });
                        }
                      }
                    ),
                    !m && Et && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          "aria-label": "Save changes to review filters",
                          title: "Save changes to review filters",
                          disabled: !o,
                          onClick: () => void Oe(),
                          children: /* @__PURE__ */ n(Qr, { "aria-hidden": "true" })
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
                            const l = Vt(e);
                            Le(l, l.startFrom === "end");
                          },
                          children: /* @__PURE__ */ n(_n, { "aria-hidden": "true" })
                        }
                      )
                    ] })
                  ]
                }
              ),
              W && /* @__PURE__ */ u("div", { className: "dq-scope-controls", children: [
                /* @__PURE__ */ u("label", { children: [
                  "Performers to review",
                  " ",
                  /* @__PURE__ */ u(
                    "select",
                    {
                      value: W.targetMode,
                      onChange: (l) => ke({
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
                W.targetMode === "selected" && /* @__PURE__ */ n(
                  lt,
                  {
                    entityType: "performer",
                    values: W.performerIds,
                    onChange: (l) => ke({ performerIds: l }),
                    placeholder: "Select performers to review...",
                    allowCreate: !1
                  }
                ),
                W.targetMode === "filter" && /* @__PURE__ */ u(qe, { children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => dt(!0),
                      children: "Edit performer criteria"
                    }
                  ),
                  /* @__PURE__ */ n("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ n(
                    $r,
                    {
                      filter: {},
                      onFilterChange: () => {
                      },
                      totalCount: 0,
                      sortOptions: [],
                      showSearch: !1,
                      showSort: !1,
                      showPagingControls: !1,
                      criteriaDefinitions: mn,
                      objectFilter: W.performerFilter,
                      onObjectFilterChange: (l) => ke({ performerFilter: l })
                    }
                  ) })
                ] }),
                /* @__PURE__ */ u("label", { children: [
                  "Occurrence tags",
                  " ",
                  /* @__PURE__ */ u(
                    "select",
                    {
                      value: W.condition,
                      onChange: (l) => ke({
                        condition: l.target.value
                      }),
                      children: [
                        /* @__PURE__ */ n("option", { value: "any", children: "Any occurrence tags" }),
                        /* @__PURE__ */ n("option", { value: "includes", children: "Has any selected tag" }),
                        /* @__PURE__ */ n("option", { value: "includesAll", children: "Has all selected tags" }),
                        /* @__PURE__ */ n("option", { value: "excludes", children: "Has none of the selected tags" }),
                        /* @__PURE__ */ n("option", { value: "isNull", children: "Has no occurrence tags" })
                      ]
                    }
                  )
                ] }),
                !["any", "isNull"].includes(W.condition) && /* @__PURE__ */ u(qe, { children: [
                  /* @__PURE__ */ n(
                    lt,
                    {
                      entityType: "tag",
                      values: W.conditionTagIds,
                      onChange: (l) => ke({ conditionTagIds: l }),
                      placeholder: "Occurrence condition tags...",
                      allowCreate: !1
                    }
                  ),
                  /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "checkbox",
                        checked: W.includeSubtags ?? !0,
                        onChange: (l) => ke({ includeSubtags: l.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] })
                ] })
              ] })
            ]
          }
        ),
        W && /* @__PURE__ */ n(
          Mn,
          {
            open: ge,
            onClose: () => dt(!1),
            criteria: mn,
            activeFilter: W.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (l) => {
              dt(!1), ke({ performerFilter: l });
            }
          }
        ),
        /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
          wt && /* @__PURE__ */ u("p", { role: "alert", children: [
            wt,
            " ",
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: de,
                onClick: () => {
                  w ? er(w).then(ee).catch((l) => Z(We(l))) : Le(T.current);
                },
                children: w ? "Reload tags" : "Retry queue"
              }
            )
          ] }),
          vt && /* @__PURE__ */ n("p", { role: "status", children: vt })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-review-layout", children: [
          /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
            /* @__PURE__ */ n("fieldset", { disabled: ue, children: /* @__PURE__ */ n(
              Fn,
              {
                filter: R.filter,
                totalCount: Ue,
                onFilterChange: (l) => Le({ ...R, filter: Re(l) })
              }
            ) }),
            /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: p.map((l) => {
              var f, k, x;
              return /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  title: `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${l.video.title || ((f = l.video.files[0]) == null ? void 0 : f.basename) || "Scene"}`,
                  "aria-label": `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${l.video.title || ((k = l.video.files[0]) == null ? void 0 : k.basename) || "Scene"}`,
                  disabled: ue,
                  "aria-pressed": (w == null ? void 0 : w.key) === l.key,
                  onClick: () => {
                    be(l), Z(""), Fe("");
                  },
                  children: [
                    l.occurrence && /* @__PURE__ */ n(Nn, { performer: l.occurrence.performer }),
                    /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: l.video.title || ((x = l.video.files[0]) == null ? void 0 : x.basename) || "Scene" })
                  ]
                },
                l.key
              );
            }) })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-inspector", children: w ? /* @__PURE__ */ u(qe, { children: [
            /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
              /* @__PURE__ */ n("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ n(
                "a",
                {
                  href: `/video/${w.video.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: w.video.title || ((Pe = w.video.files[0]) == null ? void 0 : Pe.basename) || `Video ${w.video.id}`
                }
              ) }),
              [w, kt].filter(Boolean).map((l) => {
                var x, _, z;
                const f = l, k = f.key === w.key;
                return /* @__PURE__ */ n(
                  "div",
                  {
                    className: k ? "dq-review-video-current" : "dq-review-video-preload",
                    "aria-hidden": k ? void 0 : !0,
                    inert: k ? void 0 : !0,
                    children: /* @__PURE__ */ n(
                      Ln,
                      {
                        videoId: f.video.id,
                        streamUrl: Yn(f.video.id),
                        posterUrl: k ? eo(f.video) : void 0,
                        duration: ((x = f.video.files[0]) == null ? void 0 : x.duration) ?? 0,
                        format: (_ = f.video.files[0]) == null ? void 0 : _.format,
                        audioCodec: (z = f.video.files[0]) == null ? void 0 : z.audioCodec,
                        extensionSurface: k ? "quick-view" : void 0,
                        autostart: k && Ae === f.video.id,
                        keyboardShortcutsEnabled: k,
                        showAbLoop: k,
                        clip: f.video.parentVideoId != null ? {
                          start: f.video.clipStartSec ?? 0,
                          end: f.video.clipEndSec,
                          loop: !1
                        } : void 0
                      }
                    )
                  },
                  `${f.video.id}:${sr}`
                );
              })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-panel", children: [
              /* @__PURE__ */ n("h2", { children: w.occurrence ? `Reviewing ${w.occurrence.performer.name}` : "Reviewing this video" }),
              /* @__PURE__ */ n("p", { children: W ? "Tags apply only to this performer in this video." : "Tags apply to the video." }),
              W && /* @__PURE__ */ n(
                "div",
                {
                  className: "dq-review-partners",
                  "aria-label": "Matching scene partners",
                  children: p.filter((l) => l.video.id === w.video.id).map((l) => {
                    var f, k;
                    return /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button dq-partner-button",
                        title: (f = l.occurrence) == null ? void 0 : f.performer.name,
                        "aria-label": (k = l.occurrence) == null ? void 0 : k.performer.name,
                        disabled: ue,
                        "aria-pressed": l.key === w.key,
                        onClick: () => {
                          be(l), Z("");
                        },
                        children: l.occurrence && /* @__PURE__ */ n(
                          Nn,
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
                W ? "occurrence" : "video",
                " tags:",
                " ",
                he ? he.names.join(", ") || "None" : "Loading…"
              ] }),
              he != null && he.absent.length ? /* @__PURE__ */ u("p", { children: [
                "Confirmed absent tags:",
                " ",
                /* @__PURE__ */ n(
                  lt,
                  {
                    entityType: "tag",
                    values: he.absent,
                    onChange: () => {
                    },
                    disabled: !0,
                    allowCreate: !1
                  }
                )
              ] }) : null,
              ye ? /* @__PURE__ */ u(
                "fieldset",
                {
                  ref: Jt,
                  disabled: de,
                  className: "dq-tag-editor",
                  children: [
                    /* @__PURE__ */ u("legend", { children: [
                      "Edit ",
                      W ? "occurrence" : "video",
                      " tags"
                    ] }),
                    /* @__PURE__ */ n(
                      lt,
                      {
                        entityType: "tag",
                        values: N,
                        onChange: Q,
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
                          disabled: !he,
                          onClick: () => void xe(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !he,
                          onClick: () => void xe(void 0, !1, !0),
                          children: "Save & next"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => {
                            J(!1), requestAnimationFrame(
                              () => {
                                var l;
                                return (l = Xe.current) == null ? void 0 : l.focus();
                              }
                            );
                          },
                          children: "Cancel"
                        }
                      )
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ u(qe, { children: [
                /* @__PURE__ */ n(
                  So,
                  {
                    actions: Ce.actions,
                    canWrite: t,
                    disabled: de || Ee || !he || !!m,
                    onApply: (l, f) => void xe(l, f)
                  }
                ),
                e.entityType === "performerOccurrence" && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                  "fieldset",
                  {
                    className: "dq-tag-choices",
                    disabled: !t || de || !he || !!m,
                    children: [
                      /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                      e.occurrence.tagIds.map((l) => /* @__PURE__ */ u("label", { children: [
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: e.occurrence.multiple ? "checkbox" : "radio",
                            name: "legacy-choice",
                            checked: ut.includes(l),
                            onChange: (f) => St(
                              e.occurrence.multiple ? f.target.checked ? [...ut, l] : ut.filter(
                                (k) => k !== l
                              ) : [l]
                            )
                          }
                        ),
                        Pt[l] ?? "Loading tag…"
                      ] }, l)),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          onClick: () => St([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void xe(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void xe(void 0, !1, !1, !0),
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
                    ref: Xe,
                    className: "dq-button",
                    disabled: ue || !!m || !t || !he,
                    onClick: () => {
                      $.current = [...he.ids], Q([...he.ids]), J(!0);
                    },
                    children: "Edit tags"
                  }
                ),
                /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: ue || !!m,
                    onClick: () => void xe(),
                    children: [
                      "Skip",
                      W ? " performer" : " video"
                    ]
                  }
                )
              ] }),
              !t && /* @__PURE__ */ n("p", { children: "Write permission is required to change tags." })
            ] })
          ] }) : /* @__PURE__ */ n("p", { role: "status", children: Ee ? "Loading review…" : Ue ? "Reached the end in this direction." : "No matching scenes." }) })
        ] })
      ]
    }
  );
}
function An({
  review: e,
  onChange: t,
  choices: r = !1
}) {
  const o = e.occurrence, a = (d) => t({ ...e, occurrence: { ...o, ...d } });
  return r ? /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ n("p", { children: "Choose the tags this review can change on the active performer’s appearance in a scene. Other tags are preserved." }),
    /* @__PURE__ */ n(
      lt,
      {
        entityType: "tag",
        values: o.tagIds,
        onChange: (d) => a({ tagIds: d }),
        placeholder: "Search review tag choices...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
      /* @__PURE__ */ n(
        "input",
        {
          type: "checkbox",
          checked: o.multiple,
          onChange: (d) => a({ multiple: d.target.checked })
        }
      ),
      "Allow multiple tags, for example when a hairstyle changes during the scene"
    ] }),
    /* @__PURE__ */ n("p", { children: "Save & next performer applies the selected tags and advances. Save choices stays on the performer. Skip only moves the cursor; eligibility comes from the filters." })
  ] }) : /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Occurrence condition (optional)" }),
    /* @__PURE__ */ n("p", { children: "Leave this unrestricted to review any appearance. Set performer matching in the review workspace and save it with the rule." }),
    /* @__PURE__ */ u("label", { children: [
      "Occurrence condition",
      /* @__PURE__ */ u(
        "select",
        {
          "aria-label": "Occurrence condition",
          value: o.condition,
          onChange: (d) => a({
            condition: d.target.value
          }),
          children: [
            /* @__PURE__ */ n("option", { value: "any", children: "Any occurrence tags" }),
            /* @__PURE__ */ n("option", { value: "includes", children: "Has any selected tag" }),
            /* @__PURE__ */ n("option", { value: "includesAll", children: "Has all selected tags" }),
            /* @__PURE__ */ n("option", { value: "excludes", children: "Has none of the selected tags" }),
            /* @__PURE__ */ n("option", { value: "isNull", children: "Has no occurrence tags" })
          ]
        }
      )
    ] }),
    !["any", "isNull"].includes(o.condition) && /* @__PURE__ */ u(qe, { children: [
      /* @__PURE__ */ n(
        lt,
        {
          entityType: "tag",
          values: o.conditionTagIds,
          onChange: (d) => a({ conditionTagIds: d }),
          placeholder: "Search occurrence condition tags...",
          allowCreate: !1
        }
      ),
      /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
        /* @__PURE__ */ n(
          "input",
          {
            type: "checkbox",
            checked: o.includeSubtags ?? !0,
            onChange: (d) => a({ includeSubtags: d.target.checked })
          }
        ),
        "Include subtags"
      ] })
    ] }),
    /* @__PURE__ */ n("p", { children: "Conditions check tags on the same performer’s occurrence, independently of scene tags and the performer’s profile." })
  ] });
}
function Co(e) {
  var g, m, h;
  const [t, r] = E({}), [o, a] = E(""), d = (((g = e == null ? void 0 : e.presentation) == null ? void 0 : g.annotations) ?? []).includes("tags") ? ((m = e == null ? void 0 : e.presentation) == null ? void 0 : m.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...d,
      ...((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.binParents) ?? []
    ])
  ]);
  return G(() => {
    let S = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(s).map(
        async (C) => [C, await ar([C])]
      )
    ).then((C) => {
      S && r(Object.fromEntries(C));
    }).catch(() => {
      S && a(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      S = !1;
    };
  }, [s]), { ids: t, error: o };
}
function No(e, t, r) {
  const o = t == null ? void 0 : t.presentation, a = (o == null ? void 0 : o.annotations) ?? [], d = (o == null ? void 0 : o.annotationParents) ?? [];
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
    tags: a.includes("tags") && d.length > 0 ? (e.tags ?? []).filter(
      (s) => d.some(
        (g) => {
          var m;
          return g !== s.id && ((m = r[g]) == null ? void 0 : m.includes(s.id));
        }
      )
    ) : []
  };
}
function Ao({
  videos: e,
  review: t,
  trees: r,
  disabled: o,
  onChoose: a
}) {
  var g, m, h;
  const d = new Set(
    (((g = t.presentation) == null ? void 0 : g.binParents) ?? []).flatMap(
      (S) => (r[S] ?? []).filter((C) => C !== S)
    )
  ), s = /* @__PURE__ */ new Map();
  for (const S of e)
    for (const C of S.tags ?? [])
      if (d.has(C.id)) {
        const b = s.get(C.id) ?? { name: C.name, count: 0 };
        b.count++, s.set(C.id, b);
      }
  return (h = (m = t.presentation) == null ? void 0 : m.binParents) != null && h.length ? /* @__PURE__ */ u("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...s].sort((S, C) => S[1].name.localeCompare(C[1].name)).map(([S, C]) => /* @__PURE__ */ u(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: o,
        onClick: () => a(S),
        children: [
          C.name,
          " (",
          C.count,
          ")"
        ]
      },
      S
    )),
    !s.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function To(e, t) {
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
function Tn({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: o = !0
}) {
  const [a, d] = E(!1), s = me(e) === "tag" ? "tag" : "video", g = e.view.filter, m = s === "tag" ? $n : Jr, h = (b) => t({
    ...e,
    view: { ...e.view, filter: { ...g, ...b } }
  }), S = s === "video" ? e.presentation ?? {} : {}, C = (b) => t({ ...e, presentation: { ...S, ...b } });
  return /* @__PURE__ */ u(qe, { children: [
    o && /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ u("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(g.q ?? ""),
            onChange: (b) => h({ q: b.target.value })
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
              value: String(g.sort ?? "date"),
              onChange: (b) => h({ sort: b.target.value, sorts: void 0 }),
              children: [
                !m.some((b) => b.value === g.sort) && g.sort != null && /* @__PURE__ */ n("option", { value: String(g.sort), children: String(g.sort) }),
                m.map((b) => /* @__PURE__ */ n("option", { value: b.value, children: b.label }, b.value))
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
              value: String(g.direction ?? "desc"),
              onChange: (b) => h({ direction: b.target.value }),
              children: [
                /* @__PURE__ */ n("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ n("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ u("label", { children: [
          s === "tag" ? "Tags" : "Videos",
          " per page",
          /* @__PURE__ */ n(
            "input",
            {
              type: "number",
              min: "1",
              max: "1000",
              value: Number(g.perPage) || 40,
              onChange: (b) => h({
                perPage: Math.max(
                  1,
                  Math.min(1e3, Number(b.target.value) || 40)
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
              onChange: (b) => t({
                ...e,
                view: {
                  ...e.view,
                  startFrom: b.target.value
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
          onClick: () => d(!0),
          children: [
            "Edit ",
            s,
            " filters"
          ]
        }
      ),
      /* @__PURE__ */ u("p", { children: [
        Object.keys(e.view.objectFilter).length ? `${s === "tag" ? "Tag" : "Video"} filters configured` : `No ${s} filters`,
        ". Choose which ",
        s === "tag" ? "tags" : "videos",
        " enter the queue."
      ] }),
      a && /* @__PURE__ */ n("div", { onKeyDown: (b) => b.stopPropagation(), children: /* @__PURE__ */ n(
        Mn,
        {
          open: !0,
          onClose: () => d(!1),
          criteria: s === "tag" ? xn : yr,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: s === "video",
          subjectLabel: s === "tag" ? "tags" : "videos",
          onApply: (b) => {
            t({ ...e, view: { ...e.view, objectFilter: b } }), d(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ u(qe, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ u("p", { className: "dq-editor-note", children: [
        "Choose how ",
        s === "tag" ? "tags" : "videos and tags",
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ u("div", { className: "dq-field-grid", children: [
        me(e) === "video" && /* @__PURE__ */ u("label", { children: [
          "Preferred review layout",
          /* @__PURE__ */ u(
            "select",
            {
              value: e.view.reviewMode ?? "single",
              onChange: (b) => t({ ...e, view: { ...e.view, reviewMode: b.target.value } }),
              children: [
                /* @__PURE__ */ n("option", { value: "single", children: "Single video" }),
                /* @__PURE__ */ n("option", { value: "multiple", children: "Multiple videos" })
              ]
            }
          )
        ] }),
        me(e) !== "performerOccurrence" && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: e.view.selectAllOnLoad ?? !1,
              onChange: (b) => t({ ...e, view: { ...e.view, selectAllOnLoad: b.target.checked ? !0 : void 0 } })
            }
          ),
          "Select all ",
          s === "tag" ? "tags" : "videos",
          " on page load",
          s === "video" && /* @__PURE__ */ n("small", { children: " (multiple-videos layout)" })
        ] }),
        /* @__PURE__ */ u("label", { children: [
          "Preferred view",
          /* @__PURE__ */ n(
            "select",
            {
              value: s === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid",
              onChange: (b) => t({
                ...e,
                view: {
                  ...e.view,
                  displayMode: b.target.value
                }
              }),
              children: (s === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((b) => /* @__PURE__ */ n("option", { children: b }, b))
            }
          )
        ] })
      ] }),
      s === "video" && /* @__PURE__ */ u(qe, { children: [
        /* @__PURE__ */ n("h4", { children: "Card annotations" }),
        /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((b) => {
          const I = S.annotations ?? [];
          return /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: I.includes(b),
                onChange: (O) => C({
                  annotations: O.target.checked ? [...I, b] : I.filter((q) => q !== b)
                })
              }
            ),
            b
          ] }, b);
        }) }),
        (S.annotations ?? []).includes("tags") && /* @__PURE__ */ u(qe, { children: [
          /* @__PURE__ */ n("h4", { children: "Card tag bins" }),
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected. This setting is separate from the queue filters." }),
          /* @__PURE__ */ n(
            lt,
            {
              entityType: "tag",
              values: S.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (b) => C({ annotationParents: b }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ n("h4", { children: "Queue tag bins" }),
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ n(
          lt,
          {
            entityType: "tag",
            values: S.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (b) => C({ binParents: b }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const Fr = 180, Ro = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function si({ entityType: e }) {
  return e === "tag" ? /* @__PURE__ */ n(Mi, { role: "img", "aria-label": "Tag review" }) : /* @__PURE__ */ n(Dr, { role: "img", "aria-label": e === "performerOccurrence" ? "Performer occurrence review" : "Video review" });
}
function Rn(e) {
  return me(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function qn(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Lr() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function kn(e) {
  const t = new URLSearchParams(window.location.search);
  Er.forEach((o) => t.delete(o)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function qo(e) {
  return Re({ ...e, page: 1 });
}
function li(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function ze(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const ci = "data-quality.workspace-layout.v1", Zr = 240, Gr = 192, Br = 560;
function di(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(Br, Math.max(Gr, e)) : Zr;
}
function ko() {
  try {
    const e = JSON.parse(
      localStorage.getItem(ci) ?? "null"
    );
    return di(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return Zr;
  }
}
function Io(e) {
  try {
    localStorage.setItem(
      ci,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function ui(e) {
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
function fi(e, t) {
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
function Oo(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : fi(e, t);
}
function Po({
  onNavigate: e
}) {
  const [t, r] = E([]), [o] = E(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [a, d] = E(""), [s, g] = E(!0), [m, h] = E(""), [S, C] = E(!1), [b, I] = E(!1), [O, q] = E(!1), [R, U] = E([]), [T, ne] = E(""), [Y, ie] = E(!0), [p, M] = E(""), [w, K] = E(""), [oe, Ae] = E(!1), [fe, sr] = E(!1), [pe, kt] = E(Lr), [Ue, ct] = E({}), [Ee, It] = E("name"), [de, Ot] = E("asc"), Ie = P(null), He = P(!1), [et, wt] = E(0), [Z, vt] = E(!1), [Fe, he] = E(!1), [ee, ye] = E(
    null
  ), J = t.find((i) => i.id === pe) ?? null, N = Rt(
    () => (ee == null ? void 0 : ee.id) === pe && J ? { ...J, view: {
      ...J.view,
      filter: ee.view.filter,
      objectFilter: ee.view.objectFilter,
      searchMode: ee.view.searchMode,
      startFrom: ee.view.startFrom
    } } : J,
    [ee, pe, J]
  ), Q = N ? me(N) : "video", $ = Q === "video" ? N : null, [Xe, tt] = E(null), Jt = (Xe == null ? void 0 : Xe.id) === (N == null ? void 0 : N.id) ? Xe == null ? void 0 : Xe.mode : (N == null ? void 0 : N.view.reviewMode) ?? "single", ge = Q === "performerOccurrence" || Q === "video" && Jt === "single", [dt, ut] = E(0), St = P(-1), Pt = P(!1);
  G(() => {
    const i = () => {
      if (!ge && le.current) {
        Pt.current = !0;
        return;
      }
      kt(Lr()), ge || ut((c) => c + 1);
    };
    return window.addEventListener("popstate", i), () => window.removeEventListener("popstate", i);
  }, [ge]);
  const Mt = Q === "tag" ? b : S, Ft = Rt(() => {
    const i = de === "asc" ? 1 : -1;
    return [...t].sort((c, y) => {
      if (Ee === "count") {
        const v = Ue[c.id], L = Ue[y.id], A = typeof v == "number", F = typeof L == "number";
        if (A !== F) return A ? -1 : 1;
        if (A && F && v !== L)
          return (v - L) * i;
      }
      return c.name.localeCompare(y.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * i;
    });
  }, [de, Ee, Ue, t]), ft = P(
    null
  ), je = Co($), [ae, Lt] = E({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [pt, Qt] = E({
    page: 1,
    perPage: 40
  }), [Ce, Ke] = E({ items: [], totalCount: 0 }), [V, Et] = E(!1), [ue, rt] = E(""), [Le, $t] = E(!1), [xt, Wt] = E(!1), [be, $e] = E(() => /* @__PURE__ */ new Set()), xe = P(be);
  xe.current = be;
  const nt = P(/* @__PURE__ */ new Map()), _t = (N == null ? void 0 : N.view.selectAllOnLoad) === !0, [we, Te] = E(null), Oe = P(we);
  Oe.current = we;
  const [W, ke] = E(!1), Pe = P(W);
  Pe.current = W;
  const l = P(null), [f, k] = E("grid"), [x, _] = E(Fr), [z, it] = E(ko), [D, Ve] = E(!1), le = P(!1), [_e, Ne] = E(""), [gt, H] = E(""), [De, ot] = E(""), [te, zt] = E(null), [lr, mt] = E(""), [ht, ve] = E(!1), [Ht, en] = E({}), [tn, rn] = E({}), Xt = P(/* @__PURE__ */ new Map()), nn = P(null), Cr = P(null), cr = P(null), Dt = P(0), dr = P(0), ur = P(null), Ct = P(!1), on = JSON.stringify([
    ...new Set(
      ($ == null ? void 0 : $.actions.flatMap(
        (i) => i.steps.flatMap((c) => c.tagIds)
      )) ?? []
    )
  ]);
  function Nr(i) {
    const c = di(i);
    it(c), Io(c);
  }
  function mi(i) {
    const c = i.shiftKey ? 40 : 16;
    let y = null;
    i.key === "ArrowLeft" && (y = z + c), i.key === "ArrowRight" && (y = z - c), i.key === "Home" && (y = Gr), i.key === "End" && (y = Br), y !== null && (i.preventDefault(), i.stopPropagation(), Nr(y));
  }
  G(() => {
    if (!gt) return;
    const i = window.setTimeout(() => H(""), 4e3);
    return () => window.clearTimeout(i);
  }, [gt]), G(() => {
    const i = JSON.parse(on);
    if (rn({}), !i.length) return;
    const c = new AbortController();
    let y = !0;
    return Promise.all(
      i.map(async (v) => {
        var L;
        try {
          const A = await B(`/api/tags/${v}`, {
            signal: c.signal
          });
          return [v, ((L = A.name) == null ? void 0 : L.trim()) || null];
        } catch {
          return [v, null];
        }
      })
    ).then((v) => {
      y && rn(Object.fromEntries(v));
    }), () => {
      y = !1, c.abort();
    };
  }, [on]), G(() => {
    const i = $ ? ni($.view.objectFilter) : [];
    if (en({}), !i.length) return;
    const c = new AbortController();
    let y = !0;
    return Promise.all(
      i.map(async (v) => {
        var L;
        try {
          const A = await B(`/api/tags/${v}`, {
            signal: c.signal
          });
          return (L = A.name) != null && L.trim() ? [String(v), A.name] : null;
        } catch {
          return null;
        }
      })
    ).then((v) => {
      y && en(
        Object.fromEntries(v.filter((L) => L !== null))
      );
    }), () => {
      y = !1, c.abort();
    };
  }, [$ == null ? void 0 : $.id, $ == null ? void 0 : $.view.objectFilter]);
  const Ar = Rt(
    () => $ ? ii(
      $.view.objectFilter,
      Ht
    ) : (N == null ? void 0 : N.view.objectFilter) ?? {},
    [Ht, N, $]
  ), hi = Rt(
    () => Q === "video" && Array.isArray(Ar.customFieldCriteria) ? [...yr, Ro] : Q === "tag" ? xn : yr,
    [Q, Ar.customFieldCriteria]
  ), an = Tt(async () => {
    g(!0), h("");
    try {
      const i = await Bi();
      r(i.reviews), d(i.storageKey), C(i.canWriteVideos ?? i.canWrite), I(i.canWriteTags ?? !1), q(i.canReadTagGroups ?? !1), ie(i.canConfigure ?? !0), M(i.storageNotice ?? ""), pe && !i.reviews.some((c) => c.id === pe) && (kt(""), kn(""));
    } catch (i) {
      h(
        i instanceof Error ? i.message : "Could not load reviews."
      );
    } finally {
      g(!1);
    }
  }, [pe]);
  G(() => {
    if (!O) {
      U([]), ne("");
      return;
    }
    const i = new AbortController();
    return ne(""), Zi(i.signal).then(U).catch((c) => {
      i.signal.aborted || ne(
        c instanceof Error ? c.message : "Could not load tag groups."
      );
    }), () => i.abort();
  }, [O]), G(() => {
    an();
  }, []), G(() => {
    if (pe || t.length === 0) return;
    const i = new AbortController();
    ct({});
    for (const c of t)
      (c.entityType === "performerOccurrence" ? ei(c, i.signal).then((v) => (v == null ? void 0 : v.length) === 0 ? { items: [], totalCount: 0 } : tr(ti(c, v), { ...c.view.filter, page: 1, perPage: 1 }, i.signal)) : me(c) === "tag" ? Sn(
        c,
        Re({ ...c.view.filter, page: 1, perPage: 1 }),
        i.signal
      ) : tr(
        c,
        Re({ ...c.view.filter, page: 1, perPage: 1 }),
        i.signal
      )).then((v) => {
        i.signal.aborted || ct((L) => ({
          ...L,
          [c.id]: v.totalCount
        }));
      }).catch(() => {
        i.signal.aborted || ct((v) => ({ ...v, [c.id]: null }));
      });
    return () => i.abort();
  }, [pe, t]), Pn(() => {
    var i;
    pe || s || !He.current || (He.current = !1, (i = Ie.current) == null || i.focus());
  }, [pe, s]);
  const fr = Tt(async () => {
    mt("");
    try {
      zt(await Xr());
    } catch (i) {
      zt(null), mt(
        "Tag assessment setup could not be checked. " + (i instanceof Error ? i.message : "Request failed.")
      );
    }
  }, []);
  G(() => {
    fr();
  }, [fr]);
  const Nt = Tt(
    async (i, c, y = !1, v = !1) => {
      var se;
      const L = ++Dt.current;
      (se = ur.current) == null || se.abort();
      const A = new AbortController();
      ur.current = A, c = Re(c);
      const F = Number(c.page);
      y && (c = { ...c, page: 1 }), Lt(c), Wt(y), Et(!0), rt("");
      try {
        const j = (at) => me(i) === "tag" ? Sn(
          i,
          at,
          A.signal
        ) : tr(
          i,
          at,
          A.signal
        );
        let ce = await j(c);
        const Ge = Math.max(
          1,
          Math.ceil(ce.totalCount / Number(c.perPage))
        ), Be = y ? Ge : Math.min(F, Ge);
        return Number(c.page) !== Be && (c = { ...c, page: Be }, ce = await j(c)), L === Dt.current && (Ke(ce), v && yt(
          () => new Set(ce.items.map((at) => at.id))
        ), Lt(c), Qt(c)), ce;
      } catch (j) {
        throw L === Dt.current && rt(
          j instanceof Error ? j.message : "Could not load the review queue."
        ), j;
      } finally {
        L === Dt.current && Et(!1);
      }
    },
    []
  );
  G(() => {
    var c;
    if (dr.current += 1, St.current = -1, Dt.current += 1, (c = ur.current) == null || c.abort(), sr(!1), K(""), Ae(!1), $e(/* @__PURE__ */ new Set()), nt.current.clear(), Te(null), ke(!1), Ve(!1), le.current = !1, Ne(""), H(""), ot(""), Ke({ items: [], totalCount: 0 }), $t(!1), !N || ge) {
      Et(!1);
      return;
    }
    let i = !0;
    return Et(!0), (async () => {
      let y = J ?? N;
      ye(null);
      let v = null;
      const L = new URLSearchParams(window.location.search);
      if (me(N) === "video" && Er.some((j) => L.has(j)))
        try {
          const j = y;
          v = Vr(j, L);
          const ce = Ze(j, v.query);
          (v.query.startFrom !== (j.view.startFrom ?? "end") || !nr(
            JSON.parse(Ye(ce)),
            JSON.parse(Ye(Ze(j, Vt(j))))
          )) && (y = ce, ye(y));
        } catch (j) {
          $t(!0), rt(j instanceof Error ? j.message : "Could not read review URL."), Et(!1);
          return;
        }
      let A = null;
      try {
        A = await Wi(a, N.id);
      } catch (j) {
        i && (Ae(!0), K(
          j instanceof Error ? j.message : "Could not load progress."
        ));
      }
      if (!i) return;
      const F = (A == null ? void 0 : A.signature) === Ye(y) ? A : null, se = v ? v.query.filter : F ? Re(F.filter) : qo(y.view.filter);
      Lt(se), k(
        F ? qn(F.displayMode, me(N)) : Rn(N)
      ), _(
        F ? F.cardSize ?? Fr : Fr
      );
      try {
        const j = await Nt(
          y,
          se,
          v ? v.startAtEnd : !F && y.view.startFrom !== "beginning",
          y.view.selectAllOnLoad === !0
        );
        if (!i) return;
        const ce = hn(
          j.items.map((Ge) => Ge.id),
          (F == null ? void 0 : F.focusedId) ?? null,
          (F == null ? void 0 : F.index) ?? 0
        );
        Te(ce), Se(ce);
      } catch {
      }
      i && (St.current = dt, sr(!0));
    })(), () => {
      var y;
      i = !1, dr.current++, Dt.current++, (y = ur.current) == null || y.abort();
    };
  }, [N == null ? void 0 : N.id, ge, dt]), G(() => {
    !$ || ge || !fe || V || ue || D || Pt.current || St.current !== dt || rr($.id, {
      filter: ae,
      objectFilter: $.view.objectFilter,
      searchMode: $.view.searchMode,
      startFrom: $.view.startFrom ?? "end"
    });
  }, [$, ge, fe, V, ue, ae, D, dt]);
  const X = Rt(
    () => Ce.items.map((i) => i.id),
    [Ce.items]
  );
  G(() => {
    if (!fe || !N || !a || V || ue || D || (ee == null ? void 0 : ee.id) === N.id || oe)
      return;
    const i = {
      version: 1,
      signature: Ye(N),
      filter: ae,
      focusedId: we,
      index: Math.max(0, X.indexOf(we ?? -1)),
      displayMode: f,
      cardSize: x,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        a + ":progress:" + N.id,
        JSON.stringify(i)
      );
    } catch {
    }
    if (w) return;
    let c = !0;
    const y = window.setTimeout(() => {
      zi(a, N.id, i).catch((v) => {
        c && K(
          "Progress is kept in this browser, but account sync failed. " + (v instanceof Error ? v.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      c = !1, window.clearTimeout(y);
    };
  }, [
    fe,
    a,
    N,
    V,
    ue,
    D,
    ae,
    we,
    X,
    f,
    x,
    ee,
    w,
    oe
  ]);
  const yi = Ce.items.find((i) => i.id === we) ?? null, Tr = Q === "video" ? yi : null;
  W && Tr && (l.current = Tr);
  const At = Tr ?? (W ? l.current : null), bi = yn(be, we), wi = X.length > 0 && X.every((i) => be.has(i)), Rr = be.size > 0 ? `${be.size} selected ${Q}${be.size === 1 ? "" : "s"}` : we == null ? `no ${Q}` : `focused ${Q}`, Se = Tt((i, c = !0) => {
    i != null && window.requestAnimationFrame(() => {
      const y = Xt.current.get(i);
      y == null || y.focus({ preventScroll: !0 }), c && (y == null || y.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  G(() => {
    fe && !Pe.current && Se(Oe.current);
  }, [fe, Se]), G(() => {
    V || !X.length || (Oe.current == null || !X.includes(Oe.current)) && (Te(X[0]), Pe.current || Se(X[0]));
  }, [Se, X, V]);
  const yt = Tt(
    (i) => {
      $e((c) => {
        const y = i(c);
        for (const v of /* @__PURE__ */ new Set([...c, ...y]))
          c.has(v) !== y.has(v) && nt.current.set(
            v,
            (nt.current.get(v) ?? 0) + 1
          );
        return y;
      });
    },
    []
  ), qr = Tt(
    (i) => {
      if (!X.length) return;
      const c = Math.max(
        0,
        X.indexOf(Oe.current ?? X[0])
      ), y = X[Math.max(0, Math.min(X.length - 1, c + i))];
      Te(y), Pe.current || Se(y);
    },
    [Se, X]
  ), kr = Tt(
    async (i) => {
      const c = "steps" in i ? i.steps.length > 0 : i.effect.mode !== "SKIP", y = "effect" in i && i.effect.mode === "SET_TAG_GROUP" ? i.effect.tagGroupId : null, v = y != null && (!O || !R.some((re) => re.id === y)), L = "effect" in i && c && !O, A = yn(
        xe.current,
        Oe.current
      );
      if (!N || le.current || V || ue) return;
      const F = c && !Mt ? `${Q === "tag" ? "Tag" : "Video"} write permission is required to apply ${i.label}.` : L || v ? `${i.label} needs a tag group that is unavailable.` : wr(i) && (te == null ? void 0 : te.kind) !== "ready" ? `Set up tag assessments before applying ${i.label}.` : A.length ? "" : `Select or focus a ${Q} before applying ${i.label}.`;
      if (F) {
        ot(F);
        return;
      }
      const se = ++dr.current, j = N.id, ce = [...X], Ge = Ce, Be = Oe.current, at = new Set(xe.current), dn = new Map(
        A.map((re) => [re, nt.current.get(re) ?? 0])
      ), Ut = () => se === dr.current && N.id === j;
      le.current = !0, Ve(!0), Ne(
        xe.current.size ? `${A.length} selected ${Q}s` : `the focused ${Q}`
      ), H(""), ot("");
      const un = Ge.items.filter(
        (re) => !A.includes(re.id)
      ), Ri = un.map((re) => re.id), fn = bn(
        ce,
        Ri,
        Be,
        A.includes(Be ?? -1)
      );
      Ke({
        items: un,
        totalCount: Ge.totalCount
      }), $e((re) => {
        const Me = new Set(re);
        for (const Je of A) Me.delete(Je);
        return Me;
      }), Te(fn), Pe.current || Se(fn);
      let Or = !1;
      try {
        if ("effect" in i ? await co(i, A) : await Zn(i, A), Or = !0, !Ut()) return;
        $e((re) => {
          const Me = new Set(re);
          for (const Je of A)
            (nt.current.get(Je) ?? 0) === dn.get(Je) && Me.delete(Je);
          return Me;
        }), H(
          `${i.label}: ${A.length} ${Q}${A.length === 1 ? "" : "s"} ${c ? "updated" : "skipped"}.`
        );
      } catch (re) {
        if (!Ut()) return;
        Ke(Ge), $e((Me) => {
          const Je = new Set(Me);
          for (const Qe of A)
            at.has(Qe) && (nt.current.get(Qe) ?? 0) === dn.get(Qe) && Je.add(Qe);
          return Je;
        }), Te(Be), Pe.current || Se(Be), ot(
          re instanceof Error ? re.message : "Action failed."
        );
      }
      try {
        if (await no(i), !Ut()) return;
        const re = new Set(A), Me = _t && ce.length > 0 && ce.every((st) => re.has(st)), Je = await Nt(N, ae, !1, Me);
        if (!Ut()) return;
        let Qe = Je.items.map((st) => st.id);
        if (!Qe.length && Je.totalCount > 0 && Number(ae.page) > 1) {
          const st = Math.max(1, Number(ae.page) - 1), gr = { ...ae, page: st };
          Lt(gr), Qe = (await Nt(
            N,
            gr,
            !1,
            Me
          )).items.map((Pr) => Pr.id), $e(
            (Pr) => new Set([...Pr].filter((qi) => Qe.includes(qi)))
          );
          const gn = Qe.at(-1) ?? null;
          Te(gn), Pe.current || Se(gn);
        } else {
          $e(
            (gr) => new Set([...gr].filter((pn) => Qe.includes(pn)))
          );
          const st = bn(
            ce,
            Qe,
            Be,
            Or && A.includes(Be ?? -1)
          );
          Te(st), Pe.current && st == null && ke(!1), Pe.current || Se(st);
        }
      } catch (re) {
        Ut() && ot(
          (Me) => `${Me ? `${Me} ` : ""}${Or ? "The action completed, but " : ""}the queue could not be refreshed. ${re instanceof Error ? re.message : "Refresh failed."}`
        );
      } finally {
        Ut() && (le.current = !1, Ve(!1), Ne(""), Pt.current && (Pt.current = !1, kt(Lr()), ut((re) => re + 1)));
      }
    },
    [
      Mt,
      O,
      R,
      Q,
      te,
      Nt,
      ae,
      Se,
      X,
      Ce,
      V,
      ue,
      N
    ]
  );
  function vi() {
    var y;
    if (f === "list") return 1;
    const i = (y = nn.current) == null ? void 0 : y.firstElementChild, c = i ? getComputedStyle(i).gridTemplateColumns : "";
    return Math.max(1, c.split(" ").filter(Boolean).length);
  }
  const sn = P(() => {
  });
  sn.current = (i) => {
    var F;
    if (ge || i.defaultPrevented || i.repeat || i.ctrlKey || i.altKey || i.metaKey || Z) return;
    const c = i.target, y = c instanceof Node && ((F = Cr.current) == null ? void 0 : F.contains(c)) === !0, v = c === document.body || c === document.documentElement;
    if (!y && !v) return;
    if (W && i.key === "Escape") {
      ze(i), ke(!1), Se(Oe.current);
      return;
    }
    if (!Di(c)) return;
    const L = Qn(c);
    if (i.key === "Escape") {
      ze(i), yt(() => /* @__PURE__ */ new Set());
      return;
    }
    const A = (N == null ? void 0 : N.actions.findIndex(
      (se, j) => bt(se, j) === i.key.toLowerCase()
    )) ?? -1;
    if (A >= 0 && (N != null && N.actions[A])) {
      ze(i), !D && !V && kr(N.actions[A]);
      return;
    }
    if (!W && i.key === " " && L) {
      ze(i), we != null && yt((se) => hr(se, we));
      return;
    }
    if (!W && i.key.toLowerCase() === "a") {
      ze(i), yt(
        (se) => wn(se, X)
      );
      return;
    }
    if (!(D || V) && !W && i.key === "Enter" && we != null && L) {
      ze(i), Q === "tag" ? window.open(`/tag/${we}`, "_blank", "noopener,noreferrer") : ke(!0);
      return;
    }
  }, G(() => {
    const i = (c) => sn.current(c);
    return document.addEventListener("keydown", i), () => document.removeEventListener("keydown", i);
  }, []);
  const ln = P(
    () => {
    }
  );
  ln.current = (i) => {
    var A;
    if (ge || Z || W || D || V || !X.length || i.defaultPrevented || i.repeat || i.ctrlKey || i.altKey || i.metaKey)
      return;
    const c = i.target, y = c instanceof Node && ((A = Cr.current) == null ? void 0 : A.contains(c)) === !0, v = c === document.body || c === document.documentElement;
    if (!y && !v || !i.key.startsWith("Arrow") || !Ui(c)) return;
    const L = ji(i.key, vi());
    L && (i.preventDefault(), y ? i.stopImmediatePropagation() : i.stopPropagation(), qr(L));
  }, G(() => {
    const i = (c) => ln.current(c);
    return document.addEventListener("keydown", i), () => document.removeEventListener("keydown", i);
  }, []);
  function Yt(i) {
    tt(null), wt(0), kt(i), kn(i);
  }
  function Si() {
    He.current = !0, ct({}), Yt("");
  }
  async function Ir(i) {
    if (!a) return !1;
    const c = i.map(Fo);
    try {
      await Qi(a, c);
    } catch (v) {
      throw v;
    }
    r(c), pe && !c.some((v) => v.id === pe) && Yt("");
    const y = c.find((v) => v.id === pe);
    return y && tt(null), y && J && JSON.stringify(y) !== JSON.stringify(J) && (y.view.displayMode !== J.view.displayMode && k(Rn(y)), Ye(y) !== Ye(J) && (ye(null), me(y) === "video" && rr(y.id, {
      filter: Re(y.view.filter),
      objectFilter: y.view.objectFilter,
      searchMode: y.view.searchMode,
      startFrom: y.view.startFrom ?? "end"
    }), ge || pr(
      y,
      Re({ ...y.view.filter, page: ae.page })
    ))), !0;
  }
  if (s)
    return /* @__PURE__ */ n(In, { label: "Loading reviews…" });
  if (m)
    return /* @__PURE__ */ u(qe, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Vo().catch(
            (i) => h(
              "Could not export browser reviews. " + (i instanceof Error ? i.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        On,
        {
          message: m,
          onRetry: () => void an()
        }
      )
    ] });
  return /* @__PURE__ */ u("div", { ref: Cr, className: "data-quality-page", children: [
    /* @__PURE__ */ u("header", { className: "data-quality-header", children: [
      N && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: D,
          onClick: Si,
          children: /* @__PURE__ */ n(Dn, {})
        }
      ),
      /* @__PURE__ */ u("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (N == null ? void 0 : N.name) ?? "Data Quality" }),
        (N == null ? void 0 : N.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: N.description })
      ] }),
      N && J && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: D || V || !Y,
          onClick: () => {
            ge ? wt((i) => i + 1) : (he(!0), vt(!0));
          },
          children: /* @__PURE__ */ n(Un, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: D || V || !Y,
          onClick: () => {
            he(!1), vt(!0);
          },
          children: /* @__PURE__ */ n(Pi, {})
        }
      )
    ] }),
    p && /* @__PURE__ */ n("p", { className: "dq-status", children: p }),
    $ && (te == null ? void 0 : te.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      te.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: ht,
          onClick: () => {
            ve(!0), mt(""), oo().then(fr).catch(
              (i) => mt(
                "Could not create the Confirmed absent tags custom field. " + (i instanceof Error ? i.message : "Request failed.")
              )
            ).finally(() => ve(!1));
          },
          children: ht ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    $ && ((te == null ? void 0 : te.kind) === "incompatible" || lr) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(_r, {}),
      lr || (te == null ? void 0 : te.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: ht,
          onClick: () => {
            ve(!0), fr().finally(
              () => ve(!1)
            );
          },
          children: ht ? "Checking…" : "Check again"
        }
      )
    ] }),
    o && /* @__PURE__ */ u("details", { children: [
      /* @__PURE__ */ n("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ n("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const i = localStorage.getItem("page-videos") ?? "[]", c = URL.createObjectURL(
              new Blob([i], { type: "application/json" })
            ), y = document.createElement("a");
            y.href = c, y.download = "data-quality-unassigned-legacy-reviews.json", y.click(), URL.revokeObjectURL(c);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    w && /* @__PURE__ */ u("p", { role: "alert", children: [
      w,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            K(""), Ae(!1);
          },
          children: oe ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    $ && /* @__PURE__ */ u("label", { className: "dq-layout-control", children: [
      "Review layout",
      /* @__PURE__ */ u(
        "select",
        {
          "aria-label": "Review layout",
          value: Jt,
          disabled: D || V || Z,
          onChange: (i) => tt({ id: $.id, mode: i.target.value }),
          children: [
            /* @__PURE__ */ n("option", { value: "single", children: "Single video" }),
            /* @__PURE__ */ n("option", { value: "multiple", children: "Multiple videos" })
          ]
        }
      )
    ] }),
    N && J && !ge && /* @__PURE__ */ u("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${D || V ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": D || V || void 0,
          inert: D || V ? !0 : void 0,
          onClickCapture: (i) => {
            var y, v, L, A, F;
            const c = i.target instanceof Element ? i.target.closest("button") : null;
            (c == null ? void 0 : c.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((y = c == null ? void 0 : c.textContent) == null ? void 0 : y.trim()) === "Clear all" ? Ct.current = !0 : ((v = c == null ? void 0 : c.getAttribute("aria-label")) != null && v.startsWith("Filters") || (L = c == null ? void 0 : c.getAttribute("aria-label")) != null && L.startsWith("Edit filter:") || ((A = c == null ? void 0 : c.textContent) == null ? void 0 : A.trim()) === "Cancel" || (F = c == null ? void 0 : c.getAttribute("aria-label")) != null && F.startsWith("Close ")) && (Ct.current = !1);
          },
          onKeyDownCapture: (i) => {
            var y, v;
            const c = i.target instanceof Element ? i.target.closest("button") : null;
            (i.key === "Delete" || i.key === "Backspace") && (c == null ? void 0 : c.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (i.preventDefault(), i.stopPropagation(), Ct.current = !0, (v = (y = c.parentElement) == null ? void 0 : y.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || v.click()) : i.key === "Escape" && (Ct.current = !1);
          },
          children: /* @__PURE__ */ n(
            $r,
            {
              filter: ue ? pt : ae,
              onFilterChange: Ei,
              totalCount: Ce.totalCount,
              sortOptions: Q === "tag" ? $n : Jr,
              showSearch: !0,
              showSort: !0,
              displayMode: f,
              onDisplayModeChange: (i) => k(qn(i, Q)),
              availableDisplayModes: Q === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (x - 225) / 50,
              onZoomChange: (i) => _(Math.round(225 + i * 50)),
              cardSizeEntityType: Q === "tag" ? "tags" : "videos",
              criteriaDefinitions: hi,
              objectFilter: Ar,
              onObjectFilterChange: (i) => {
                if (!D && !V) {
                  const c = Q === "video" ? oi(i) : i;
                  ft.current = Q === "video" ? ai(
                    N.view.objectFilter,
                    c,
                    Ct.current
                  ) : c, Ct.current = !1;
                }
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (ee == null ? void 0 : ee.id) === pe && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: D || V || !Y,
            onClick: Ni,
            children: /* @__PURE__ */ n(Qr, {})
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Reset to default review filters",
            title: "Reset to default review filters",
            disabled: D || V,
            onClick: Ci,
            children: /* @__PURE__ */ n(_n, {})
          }
        )
      ] })
    ] }),
    N ? ge ? /* @__PURE__ */ n(Eo, { review: N, canWrite: N.entityType === "performerOccurrence" ? b : S, onBusy: Ve, editRequest: et, renderRuleEditor: (i, c, y) => /* @__PURE__ */ n(pi, { workspace: !0, draft: i, entityTypeLocked: !0, tagGroups: R, saving: y, setDraft: (v) => c(v), onSave: () => {
    }, onCancel: () => {
    } }), onSaveDefaults: Y ? (i) => Ir(t.map((c) => c.id === i.id ? i : c)) : void 0 }, N.id) : /* @__PURE__ */ u(qe, { children: [
      $ && je.error && /* @__PURE__ */ n("p", { role: "alert", children: je.error }),
      $ && /* @__PURE__ */ n(
        Ao,
        {
          videos: Ce.items,
          review: $,
          trees: je.ids,
          disabled: D || V,
          onChoose: (i) => {
            const c = To($, i);
            ye(c), pr(c, { ...ae, page: 1 });
          }
        }
      ),
      De && !W && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(_r, {}),
        De
      ] }),
      gt && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: gt }),
      cn("top"),
      /* @__PURE__ */ u(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${z}px`
          },
          children: [
            /* @__PURE__ */ u("main", { children: [
              V && !Ce.items.length && /* @__PURE__ */ n(In, { label: "Loading review queue…" }),
              ue && !V && /* @__PURE__ */ n(
                On,
                {
                  message: ue,
                  retryLabel: Le ? "Reset to review defaults" : "Retry",
                  onRetry: () => {
                    if (Le && J && me(J) === "video") {
                      const i = Vt(J);
                      rr(J.id, { ...i, filter: { ...i.filter, page: void 0 } }), ut((c) => c + 1);
                      return;
                    }
                    Nt(
                      N,
                      ae,
                      xt,
                      _t
                    ).catch(() => {
                    });
                  }
                }
              ),
              !D && !V && !ue && !Ce.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(Dr, {}),
                /* @__PURE__ */ u("p", { children: [
                  "No ",
                  Q,
                  "s match this review."
                ] })
              ] }),
              !!Ce.items.length && /* @__PURE__ */ n("div", { ref: nn, children: /* @__PURE__ */ n(
                "div",
                {
                  className: f === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${x}px`
                  },
                  children: Ce.items.map(Ti)
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
                "aria-valuemin": Gr,
                "aria-valuemax": Br,
                "aria-valuenow": z,
                "aria-valuetext": `${z} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (i) => {
                  cr.current = {
                    pointerId: i.pointerId,
                    startX: i.clientX,
                    startWidth: z
                  }, i.currentTarget.setPointerCapture(i.pointerId);
                },
                onPointerMove: (i) => {
                  const c = cr.current;
                  (c == null ? void 0 : c.pointerId) === i.pointerId && i.currentTarget.hasPointerCapture(i.pointerId) && Nr(
                    c.startWidth + c.startX - i.clientX
                  );
                },
                onPointerUp: () => {
                  cr.current = null;
                },
                onPointerCancel: () => {
                  cr.current = null;
                },
                onKeyDown: mi,
                onDoubleClick: () => Nr(Zr),
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
                  disabled: !X.length,
                  onClick: () => yt(
                    (i) => wn(i, X)
                  ),
                  children: [
                    wi ? "Clear selection" : "Select all on page",
                    /* @__PURE__ */ n("kbd", { "aria-hidden": "true", children: "A" })
                  ]
                }
              ),
              /* @__PURE__ */ n("strong", { children: be.size > 0 ? Rr : we == null ? "Nothing to apply to" : `Applies to the ${Rr}` }),
              N.actions.map((i, c) => {
                const y = "steps" in i ? i.steps.length > 0 : i.effect.mode !== "SKIP", v = "effect" in i && i.effect.mode === "SET_TAG_GROUP" ? i.effect.tagGroupId : null, L = v != null ? R.find((F) => F.id === v) : void 0, A = v != null && !L;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    disabled: D || V || !!ue || y && !Mt || "effect" in i && y && (!O || A) || wr(i) && (te == null ? void 0 : te.kind) !== "ready" || !bi.length,
                    onClick: () => void kr(i),
                    children: [
                      /* @__PURE__ */ u("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: i.label }),
                        "effect" in i ? /* @__PURE__ */ n("small", { children: i.effect.mode === "SKIP" ? "Skip" : i.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : L ? `Assign ${L.name}` : "Unavailable tag group" }) : i.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: i.steps.flatMap(
                          (F, se) => F.tagIds.map((j, ce) => {
                            const Ge = tn[j] === void 0 ? "Tag" : tn[j] ?? "Unavailable tag", Be = fi(F, Ge), at = Oo(F, Ge);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": ui(F.mode),
                                "aria-label": at,
                                title: `Step ${se + 1}: ${at}`,
                                children: Be
                              },
                              `${se}-${j}-${ce}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      bt(i, c) && /* @__PURE__ */ n("kbd", { children: bt(i, c) })
                    ]
                  },
                  i.id
                );
              }),
              !N.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              !Mt && /* @__PURE__ */ u("p", { children: [
                Q === "tag" ? "Tag" : "Video",
                " write permission is required to apply actions."
              ] }),
              Q === "tag" && T && /* @__PURE__ */ u("p", { children: [
                "Tag groups are unavailable. ",
                T
              ] }),
              D && /* @__PURE__ */ u("p", { role: "status", children: [
                /* @__PURE__ */ n(Kn, { className: "dq-spin" }),
                " Applying action to",
                " ",
                _e,
                "…"
              ] }),
              /* @__PURE__ */ u("p", { className: "dq-shortcuts", children: [
                "←→↑↓ move · space select · enter ",
                Q === "tag" ? "open" : "preview",
                " · Q–P apply · A toggle shown · Esc clear"
              ] })
            ] })
          ]
        }
      ),
      cn("bottom")
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
                  ref: Ie,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ n("p", { children: "Choose a review to open its queue." }),
              /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                (i) => Ue[i.id] !== void 0
              ) ? t.some((i) => Ue[i.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: Ee,
                    onChange: (i) => It(
                      i.target.value
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
                  "aria-label": de === "asc" ? "Ascending" : "Descending",
                  title: de === "asc" ? "Ascending" : "Descending",
                  onClick: () => Ot(
                    (i) => i === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    jn,
                    {
                      className: de === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: Ft.map((i) => {
            const c = Ue[i.id], y = me(i), v = y === "tag" ? "tag" : y === "performerOccurrence" ? "scene" : "video";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                disabled: D,
                onClick: () => Yt(i.id),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ u("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(si, { entityType: y }),
                      /* @__PURE__ */ n("strong", { children: i.name })
                    ] }),
                    /* @__PURE__ */ n(
                      "span",
                      {
                        className: "dq-review-count",
                        "aria-label": c === void 0 ? `Counting matching ${v}s` : c === null ? `Matching ${v} count unavailable` : `${c.toLocaleString()} matching ${c === 1 ? v : `${v}s`}`,
                        children: c === void 0 ? "…" : c === null ? "—" : c.toLocaleString()
                      }
                    )
                  ] }),
                  i.description && /* @__PURE__ */ n("span", { className: "dq-review-rule-name", children: i.description })
                ]
              },
              i.id
            );
          }) })
        ]
      }
    ) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(Dr, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    W && At && $ && /* @__PURE__ */ n(
      _o,
      {
        video: At,
        review: $,
        targetLabel: Rr,
        pending: D,
        refreshing: V || !!ue,
        error: De,
        canWrite: S,
        assessmentReady: (te == null ? void 0 : te.kind) === "ready",
        selected: be.has(At.id),
        hasPrevious: X.indexOf(At.id) > 0,
        hasNext: X.indexOf(At.id) >= 0 && X.indexOf(At.id) < X.length - 1,
        onToggleSelected: () => yt((i) => hr(i, At.id)),
        onPrevious: () => qr(-1),
        onNext: () => qr(1),
        onClose: () => {
          ke(!1), Se(Oe.current);
        },
        onAction: kr
      }
    ),
    Z && /* @__PURE__ */ n(
      Do,
      {
        reviews: t,
        activeReview: J,
        tagGroups: R,
        initialEdit: Fe,
        onSave: Ir,
        onChoose: Yt,
        onEditWorkspace: (i) => {
          i !== pe && Yt(i), tt({ id: i, mode: "single" }), wt((c) => c + 1), vt(!1);
        },
        onClose: () => {
          vt(!1), Fe && Se(Oe.current, !1);
        }
      }
    )
  ] });
  async function pr(i, c, y = !1) {
    const v = Oe.current, L = Math.max(0, X.indexOf(v ?? -1));
    try {
      const F = (await Nt(
        i,
        c,
        y,
        i.view.selectAllOnLoad === !0
      )).items.map((j) => j.id);
      $e(
        (j) => new Set([...j].filter((ce) => F.includes(ce)))
      );
      const se = hn(F, v, L);
      Te(se), Pe.current || Se(se, !1);
    } catch {
    }
  }
  function Ei(i) {
    const c = ft.current;
    if (ft.current = null, D || V || !N || !J) return;
    const y = c ?? N.view.objectFilter, v = nr(
      y,
      J.view.objectFilter
    ) ? J.view.objectFilter : y, L = Re({ ...i, page: 1 }), A = {
      ...N,
      view: {
        ...N.view,
        filter: L,
        objectFilter: v
      }
    }, F = Ye(A) !== Ye(J), se = F ? A : J;
    ye(F ? A : null), H(F ? "" : "Review queue defaults restored."), pr(se, L, !0);
  }
  function Ci() {
    if (D || V || !J) return;
    ft.current = null;
    const i = Re({
      ...J.view.filter,
      page: 1
    });
    ye(null), H("Review queue defaults restored."), pr(
      J,
      i,
      J.view.startFrom !== "beginning"
    );
  }
  function Ni() {
    D || V || !N || !J || !Y || Ir(
      t.map(
        (i) => i.id === pe ? {
          ...i,
          view: {
            ...N.view,
            filter: { ...ae, page: 1 }
          }
        } : i
      )
    ).then(() => {
      ye(null), H("Queue saved to this review.");
    }).catch(
      (i) => ot(
        i instanceof Error ? i.message : "Could not save queue."
      )
    );
  }
  function Ai() {
    $e(/* @__PURE__ */ new Set()), nt.current.clear(), Te(null);
  }
  function cn(i) {
    return N ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: D || V,
        "aria-label": `Review queue pagination ${i}`,
        children: /* @__PURE__ */ n(
          Fn,
          {
            filter: {
              ...ae,
              page: Number(ae.page) || 1,
              perPage: Number(ae.perPage) || 40
            },
            totalCount: Ce.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${i}`,
            onFilterChange: (c) => {
              D || V || c.page === Number(ae.page) || Mo(
                { ...ae, page: c.page },
                N,
                (y, v) => Nt(y, v, !1, _t),
                Ai
              );
            }
          }
        )
      }
    ) : null;
  }
  function Ti(i) {
    var y, v, L;
    if (Q === "tag") {
      const A = i;
      return /* @__PURE__ */ n(
        Lo,
        {
          tag: A,
          displayMode: f === "list" ? "list" : "grid",
          focused: A.id === we,
          selected: be.has(A.id),
          setRef: (F) => {
            F ? Xt.current.set(A.id, F) : Xt.current.delete(A.id);
          },
          onFocus: () => Te(A.id),
          onToggle: () => {
            yt((F) => hr(F, A.id)), Se(A.id, !1);
          },
          onOpen: () => window.open(`/tag/${A.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        A.id
      );
    }
    const c = i;
    return /* @__PURE__ */ n(
      $o,
      {
        video: No(c, $, je.ids),
        showTagBins: ((v = (y = $ == null ? void 0 : $.presentation) == null ? void 0 : y.annotations) == null ? void 0 : v.includes("tags")) && !!((L = $.presentation.annotationParents) != null && L.length),
        displayMode: f,
        focused: c.id === we,
        selected: be.has(c.id),
        setRef: (A) => {
          A ? Xt.current.set(c.id, A) : Xt.current.delete(c.id);
        },
        onFocus: () => Te(c.id),
        onToggle: () => yt((A) => hr(A, c.id)),
        onPreview: () => {
          Te(c.id), ke(!0);
        },
        onNavigate: e
      },
      c.id
    );
  }
}
function Mo(e, t, r, o) {
  o(), r(t, e).catch(() => {
  });
}
function hr(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Fo(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Lo({
  tag: e,
  displayMode: t,
  focused: r,
  selected: o,
  setRef: a,
  onFocus: d,
  onToggle: s,
  onOpen: g,
  onNavigate: m
}) {
  return /* @__PURE__ */ n(
    "article",
    {
      ref: a,
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${e.name}${o ? ", selected" : ""}`,
      onFocus: d,
      onClick: (h) => {
        d(), h.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${o ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        Ii,
        {
          tag: e,
          selected: o,
          onSelect: s,
          onClick: g,
          onNavigate: m
        }
      ) : /* @__PURE__ */ u("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "aria-label": o ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": o,
            onClick: (h) => {
              h.stopPropagation(), s();
            },
            children: o ? "✓" : ""
          }
        ),
        /* @__PURE__ */ n("button", { type: "button", className: "dq-tag-list-name", onClick: g, children: e.name }),
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
function $o({
  video: e,
  showTagBins: t,
  displayMode: r,
  focused: o,
  selected: a,
  setRef: d,
  onFocus: s,
  onToggle: g,
  onPreview: m,
  onNavigate: h
}) {
  var q, R;
  const S = li(e), C = P(null), b = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, I = !!(b.date || b.studioName), O = !!(b.performers.length || b.tags.length);
  return Pn(() => {
    const U = C.current;
    if (!U) return;
    const T = U.querySelector(
      `a[href="/video/${e.id}"]`
    ), ne = U.querySelector(".card-title"), Y = `dq-card-title-${e.id}`;
    ne && (ne.id = Y), T && (T.target = "_blank", T.rel = "noreferrer", T.removeAttribute("aria-label"), T.setAttribute("aria-labelledby", Y), T.classList.add("dq-card-link"));
    const ie = U.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    ie && ie.setAttribute(
      "aria-label",
      a ? `Deselect ${S}` : `Select ${S}`
    );
    const p = U.querySelector(
      'button[title="Quick View"]'
    );
    p && p.setAttribute("aria-label", `Preview ${S}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (U) => {
        C.current = U, d(U);
      },
      tabIndex: 0,
      "aria-current": o ? "true" : void 0,
      "aria-label": `${S}${a ? ", selected" : ""}`,
      onFocus: s,
      onClick: (U) => {
        s(), U.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${r} ${I ? "has-card-metadata" : "no-card-metadata"} ${O ? "has-card-footer" : "no-card-footer"} ${o ? "focused" : ""} ${a ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          Oi,
          {
            video: b,
            selected: a,
            onSelect: g,
            onNavigate: h,
            onQuickView: m,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ u("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (q = e.tags) == null ? void 0 : q.map((U) => /* @__PURE__ */ n("span", { children: U.name }, U.id)),
          !((R = e.tags) != null && R.length) && /* @__PURE__ */ n("small", { children: "No matching tags" })
        ] }),
        r === "wall" && /* @__PURE__ */ n(xo, { video: e })
      ]
    }
  );
}
function xo({ video: e }) {
  const t = P(null), r = P(null), [o, a] = E(!1), [d, s] = E(!1), [g, m] = E(!1);
  return G(() => {
    const h = t.current;
    if (!h || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      a(!0), s(!0);
      return;
    }
    const S = new IntersectionObserver(
      ([b]) => a(b.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), C = new IntersectionObserver(
      ([b]) => s(b.isIntersecting && b.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return S.observe(h), C.observe(h), () => {
      S.disconnect(), C.disconnect();
    };
  }, [e.id, e.files.length]), G(() => {
    if (!o) {
      m(!1);
      return;
    }
    const h = new AbortController();
    return B(ro(e.id), {
      signal: h.signal
    }).then((S) => {
      h.signal.aborted || m(S.available === !0);
    }).catch(() => {
      h.signal.aborted || m(!1);
    }), () => h.abort();
  }, [o, e.id]), G(() => {
    const h = r.current;
    h && (d ? Promise.resolve(h.play()).catch(() => {
    }) : h.pause());
  }, [g, d]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: g && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: to(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function _o({
  video: e,
  review: t,
  targetLabel: r,
  pending: o,
  refreshing: a,
  error: d,
  canWrite: s,
  assessmentReady: g,
  selected: m,
  hasPrevious: h,
  hasNext: S,
  onToggleSelected: C,
  onPrevious: b,
  onNext: I,
  onClose: O,
  onAction: q
}) {
  const R = P(null), U = P(null), T = e.files[0], ne = li(e);
  G(() => {
    var M;
    const p = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (M = R.current) == null || M.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = p;
    };
  }, []);
  function Y(p) {
    var K, oe, Ae;
    if (p.key !== "Tab") return;
    const M = [
      ...((K = R.current) == null ? void 0 : K.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((fe) => fe.offsetParent !== null);
    if (!M.length) {
      p.preventDefault(), (oe = R.current) == null || oe.focus();
      return;
    }
    const w = M.indexOf(
      document.activeElement
    );
    p.shiftKey && w <= 0 ? (p.preventDefault(), (Ae = M.at(-1)) == null || Ae.focus()) : !p.shiftKey && w === M.length - 1 && (p.preventDefault(), M[0].focus());
  }
  function ie(p) {
    if (p.defaultPrevented || p.ctrlKey || p.metaKey || p.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const M = p.key === "ArrowLeft" || p.key === "ArrowRight";
    if (p.altKey && !M) return;
    const w = U.current, K = p.currentTarget.querySelector("video");
    if (p.key === "Enter" || p.key === "Escape")
      p.repeat || O();
    else if (p.key === " " && w)
      p.repeat || w.toggle();
    else if (M && w)
      w.seekBy(
        (p.key === "ArrowLeft" ? -1 : 1) * (p.shiftKey ? 5 : p.altKey ? 10 : 60)
      );
    else if ((p.key === "," || p.key === ".") && w) {
      const oe = [T == null ? void 0 : T.duration, K == null ? void 0 : K.duration].find(
        (fe) => fe != null && Number.isFinite(fe) && fe > 0
      ) ?? 0, Ae = e.parentVideoId != null ? (e.clipEndSec ?? oe) - (e.clipStartSec ?? 0) : oe;
      Number.isFinite(Ae) && Ae > 0 && w.seekBy((p.key === "," ? -1 : 1) * Ae * 0.1);
    } else if (p.key.toLowerCase() === "n" || p.key.toLowerCase() === "m")
      !p.repeat && !o && !a && (p.key.toLowerCase() === "n" && h && b(), p.key.toLowerCase() === "m" && S && I());
    else if (p.key === "ArrowUp" && K)
      K.volume = Math.min(1, K.volume + 0.1);
    else if (p.key === "ArrowDown" && K)
      K.volume = Math.max(0, K.volume - 0.1);
    else return;
    ze(p);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: R,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${ne}`,
      className: "dq-preview",
      onKeyDown: Y,
      onKeyDownCapture: ie,
      onMouseDown: (p) => {
        p.target === p.currentTarget && O();
      },
      children: /* @__PURE__ */ u("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ u("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !h || o || a,
              onClick: b,
              children: /* @__PURE__ */ n(Dn, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !S || o || a,
              onClick: I,
              children: /* @__PURE__ */ n(jn, {})
            }
          ),
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: ne }),
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
              onClick: C,
              disabled: a,
              children: m ? "Selected" : "Select"
            }
          ),
          /* @__PURE__ */ n(
            "a",
            {
              href: `/video/${e.id}`,
              target: "_blank",
              rel: "noreferrer",
              className: "dq-details-link",
              "aria-label": `Open ${ne} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ n(Fi, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: O,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(Vn, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: T ? /* @__PURE__ */ n(
          Ln,
          {
            autostart: !0,
            streamUrl: Yn(e.id),
            posterUrl: En(e),
            format: T.format,
            audioCodec: T.audioCodec,
            duration: T.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (p) => (U.current = p, () => {
              U.current === p && (U.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: En(e), alt: "" }) }),
        d && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: d }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((p, M) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: o || a || p.steps.length > 0 && !s || wr(p) && !g,
            onClick: () => void q(p),
            children: [
              bt(p, M) && /* @__PURE__ */ n("kbd", { children: bt(p, M) }),
              p.label
            ]
          },
          p.id
        )) })
      ] })
    }
  );
}
function Do({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: o = !1,
  onEditWorkspace: a,
  onSave: d,
  onChoose: s,
  onClose: g
}) {
  const [m, h] = E(
    () => o && t ? structuredClone(t) : null
  ), [S, C] = E(""), [b, I] = E(!1), [O, q] = E(
    o && t != null
  ), R = P(null);
  G(() => {
    var w, K;
    const p = document.activeElement, M = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (K = (w = R.current) == null ? void 0 : w.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || K.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = M, p == null || p.focus({ preventScroll: !0 });
    };
  }, []);
  function U(p) {
    var K, oe, Ae;
    if (p.defaultPrevented) {
      p.stopPropagation();
      return;
    }
    if (p.key === "Escape") {
      ze(p), b || g();
      return;
    }
    if (p.key !== "Tab") {
      p.stopPropagation();
      return;
    }
    const M = [
      ...((K = R.current) == null ? void 0 : K.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((fe) => fe.offsetParent !== null);
    if (!M.length) {
      ze(p), (oe = R.current) == null || oe.focus();
      return;
    }
    const w = M.indexOf(
      document.activeElement
    );
    p.shiftKey && w <= 0 ? (ze(p), (Ae = M.at(-1)) == null || Ae.focus()) : !p.shiftKey && w === M.length - 1 ? (ze(p), M[0].focus()) : p.stopPropagation();
  }
  function T(p, M = !!p) {
    q(M), h(
      p ? structuredClone(p) : {
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
    ), C("");
  }
  async function ne() {
    if (b) return;
    if (!m || br(m)) {
      C(m ? br(m) : "Choose a review.");
      return;
    }
    const p = { ...m, name: m.name.trim() }, M = e.some((w) => w.id === p.id) ? e.map((w) => w.id === p.id ? p : w) : [...e, p];
    I(!0), C("");
    try {
      if (!await d(M)) throw new Error("Could not save reviews.");
      !e.some((w) => w.id === p.id) && p.entityType !== "tag" ? a(p.id) : (s(p.id), g());
    } catch (w) {
      C(
        "Could not save reviews. Your edits are still open. " + (w instanceof Error ? w.message : "Retry saving.")
      );
    } finally {
      I(!1);
    }
  }
  async function Y(p) {
    if (!b) {
      I(!0), C("");
      try {
        if (!await d(p)) throw new Error("Could not save reviews.");
      } catch (M) {
        C(
          M instanceof Error ? M.message : "Could not save reviews."
        );
      } finally {
        I(!1);
      }
    }
  }
  async function ie(p) {
    var w;
    if (b) return;
    const M = (w = p.target.files) == null ? void 0 : w[0];
    if (p.target.value = "", !!M) {
      if (M.size > 2e6) {
        C("Review files must be smaller than 2 MB.");
        return;
      }
      I(!0), C("");
      try {
        const K = ir(await M.text());
        if (!await d(Ur(e, K)))
          throw new Error("Could not save reviews.");
      } catch (K) {
        C(
          K instanceof Error ? K.message : "Could not import reviews."
        );
      } finally {
        I(!1);
      }
    }
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: R,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: U,
      children: /* @__PURE__ */ u("div", { className: "dq-manager", children: [
        /* @__PURE__ */ u("header", { children: [
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: m ? e.some((p) => p.id === m.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: b,
              onClick: g,
              children: /* @__PURE__ */ n(Vn, {})
            }
          )
        ] }),
        S && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: S }),
        /* @__PURE__ */ n("fieldset", { disabled: b, className: "dq-manager-content", children: m ? /* @__PURE__ */ n(
          pi,
          {
            setup: m.entityType !== "tag" && !e.some((p) => p.id === m.id),
            draft: m,
            entityTypeLocked: O,
            tagGroups: r,
            saving: b,
            setDraft: h,
            onSave: () => void ne(),
            onCancel: g
          }
        ) : /* @__PURE__ */ u(qe, { children: [
          /* @__PURE__ */ u("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: () => {
              const p = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), M = document.createElement("a");
              M.href = p, M.download = "data-quality-reviews.json", M.click(), URL.revokeObjectURL(p);
            }, children: "Export reviews" }),
            /* @__PURE__ */ u(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => T(),
                children: [
                  /* @__PURE__ */ n(Li, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ u("label", { className: "dq-button", children: [
              /* @__PURE__ */ n($i, {}),
              " Import reviews",
              /* @__PURE__ */ n(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: ie
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((p) => /* @__PURE__ */ u("article", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ u("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(si, { entityType: me(p) }),
                /* @__PURE__ */ n("strong", { children: p.name })
              ] }),
              /* @__PURE__ */ n("p", { children: p.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => p.entityType === "tag" || me(p) === "video" && p.view.reviewMode === "multiple" ? T(p) : a(p.id), children: [
              /* @__PURE__ */ n(Un, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => T({
                  ...structuredClone(p),
                  id: crypto.randomUUID(),
                  name: `${p.name} copy`
                }, !0),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${p.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${p.name}”?`) && Y(
                    e.filter((M) => M.id !== p.id)
                  );
                },
                children: /* @__PURE__ */ n(Gn, {})
              }
            )
          ] }, p.id)) })
        ] }) })
      ] })
    }
  );
}
function pi({
  workspace: e = !1,
  setup: t = !1,
  draft: r,
  entityTypeLocked: o,
  tagGroups: a,
  saving: d = !1,
  setDraft: s,
  onSave: g,
  onCancel: m
}) {
  const [h, S] = E("Review"), C = me(r), b = (q) => {
    if (!(o || q === C)) {
      if (q === "performerOccurrence") {
        s({
          id: r.id,
          entityType: q,
          name: r.name,
          description: r.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end" },
          actions: [],
          occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: !0 }
        });
        return;
      }
      s(
        q === "tag" ? {
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
  }, I = P(/* @__PURE__ */ new WeakMap()), O = (q) => {
    let R = I.current.get(q);
    return R || (R = crypto.randomUUID(), I.current.set(q, R)), R;
  };
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      ki,
      {
        tabs: (t ? ["Review"] : e ? ["Review", ...C === "video" ? ["Appearance"] : [], "Actions", ...C === "performerOccurrence" ? ["Tag choices"] : []] : C === "performerOccurrence" ? ["Review", "Queue", "Actions", ...r.occurrence.tagIds.length ? ["Tag choices"] : []] : ["Review", "Queue", "Appearance", "Actions"]).map((q) => ({
          key: q,
          label: q,
          count: q === "Actions" ? r.actions.length : void 0,
          disabled: d
        })),
        activeTab: h,
        onTabChange: S
      }
    ) }),
    /* @__PURE__ */ u("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ u("section", { hidden: h !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ u("label", { children: [
          "Entity type",
          /* @__PURE__ */ u(
            "select",
            {
              "aria-label": "Entity type",
              value: C,
              disabled: o,
              onChange: (q) => b(q.target.value),
              children: [
                /* @__PURE__ */ n("option", { value: "video", children: "Videos" }),
                /* @__PURE__ */ n("option", { value: "tag", children: "Tags" }),
                /* @__PURE__ */ n("option", { value: "performerOccurrence", children: "Performer occurrence tags" })
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
              onChange: (q) => s({ ...r, name: q.target.value })
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
              onChange: (q) => s({ ...r, description: q.target.value })
            }
          )
        ] })
      ] }),
      !e && !t && /* @__PURE__ */ u("section", { hidden: h !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ n(Tn, { draft: r, onChange: s, presentation: !1 }),
        r.entityType === "performerOccurrence" && /* @__PURE__ */ n(An, { review: r, onChange: s })
      ] }),
      !t && r.entityType === "performerOccurrence" && /* @__PURE__ */ n("section", { hidden: h !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n(An, { review: r, onChange: s, choices: !0 }) }),
      !t && (!e || C === "video") && /* @__PURE__ */ n("section", { hidden: h !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(Tn, { draft: r, onChange: s, queue: !1 }) }),
      !t && /* @__PURE__ */ n("section", { hidden: h !== "Actions", className: "dq-editor-section", children: C === "tag" ? /* @__PURE__ */ n(
        jo,
        {
          draft: r,
          saving: d,
          tagGroups: a,
          setDraft: s
        }
      ) : /* @__PURE__ */ n(
        Uo,
        {
          draft: r,
          saving: d,
          stepKey: O,
          rememberStepKey: (q, R) => I.current.set(q, O(R)),
          setDraft: s
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
            const q = URL.createObjectURL(
              new Blob([JSON.stringify([r], null, 2)], {
                type: "application/json"
              })
            ), R = document.createElement("a");
            R.href = q, R.download = "data-quality-review.json", R.click(), URL.revokeObjectURL(q);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: m, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: g, children: t ? "Create & configure" : "Save review" })
    ] })
  ] });
}
function gi({
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
function Uo({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: o,
  setDraft: a
}) {
  const d = (s, g) => a({
    ...e,
    actions: e.actions.map(
      (m, h) => h === s ? g : m
    )
  });
  return /* @__PURE__ */ u(qe, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    e.entityType === "performerOccurrence" && /* @__PURE__ */ n("p", { children: "Actions apply only to the active performer in this scene. Set performer matching in the review filters below. Save review keeps those criteria with this rule." }),
    /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      xr,
      {
        items: e.actions,
        getKey: (s) => s.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (s) => a({ ...e, actions: s }),
        renderItem: (s, { index: g, dragHandleProps: m, isOver: h }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: h ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ u("legend", { children: [
                "Action ",
                g + 1
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...m,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${g + 1}`,
                    children: /* @__PURE__ */ n(Wr, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: s.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => a({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, g + 1),
                        {
                          ...structuredClone(s),
                          id: crypto.randomUUID(),
                          label: s.label + " copy"
                        },
                        ...e.actions.slice(g + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                gi,
                {
                  action: s,
                  onChange: (S) => d(g, S)
                }
              ),
              /* @__PURE__ */ n(
                xr,
                {
                  items: s.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (S) => d(g, { ...s, steps: S }),
                  renderItem: (S, C) => /* @__PURE__ */ n(
                    Ko,
                    {
                      occurrence: e.entityType === "performerOccurrence",
                      dragHandleProps: C.dragHandleProps,
                      saving: t,
                      isOver: C.isOver,
                      step: S,
                      index: C.index,
                      onChange: (b) => {
                        o(b, S), d(g, {
                          ...s,
                          steps: s.steps.map(
                            (I, O) => O === C.index ? b : I
                          )
                        });
                      },
                      onRemove: () => d(g, {
                        ...s,
                        steps: s.steps.filter(
                          (b, I) => I !== C.index
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
                    onClick: () => d(g, {
                      ...s,
                      steps: [...s.steps, { mode: "ADD", tagIds: [] }]
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
                        (S, C) => C !== g
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
function jo({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: o
}) {
  const a = (d, s) => o({
    ...e,
    actions: e.actions.map(
      (g, m) => m === d ? s : g
    )
  });
  return /* @__PURE__ */ u(qe, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      xr,
      {
        items: e.actions,
        getKey: (d) => d.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (d) => o({ ...e, actions: d }),
        renderItem: (d, { index: s, dragHandleProps: g, isOver: m }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: m ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ u("legend", { children: [
                "Action ",
                s + 1
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...g,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${s + 1}`,
                    children: /* @__PURE__ */ n(Wr, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: d.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => o({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, s + 1),
                        {
                          ...structuredClone(d),
                          id: crypto.randomUUID(),
                          label: d.label + " copy"
                        },
                        ...e.actions.slice(s + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                gi,
                {
                  action: d,
                  onChange: (h) => a(s, h)
                }
              ),
              /* @__PURE__ */ u("label", { children: [
                "Action effect",
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: d.effect.mode === "SET_TAG_GROUP" ? `group:${d.effect.tagGroupId}` : d.effect.mode,
                    onChange: (h) => {
                      const S = h.target.value;
                      a(s, {
                        ...d,
                        effect: S === "SKIP" ? { mode: "SKIP" } : S === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : {
                          mode: "SET_TAG_GROUP",
                          tagGroupId: Number(S.slice(6))
                        }
                      });
                    },
                    children: [
                      /* @__PURE__ */ n("option", { value: "SKIP", children: "Skip" }),
                      /* @__PURE__ */ n("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
                      d.effect.mode === "SET_TAG_GROUP" && !r.some(
                        (h) => h.id === d.effect.tagGroupId
                      ) && /* @__PURE__ */ n(
                        "option",
                        {
                          value: `group:${d.effect.tagGroupId}`,
                          disabled: !0,
                          children: "Unavailable tag group"
                        }
                      ),
                      r.map((h) => /* @__PURE__ */ n("option", { value: `group:${h.id}`, children: h.name }, h.id))
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
                      (h, S) => S !== s
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
function Ko({
  occurrence: e = !1,
  step: t,
  index: r,
  dragHandleProps: o,
  saving: a,
  isOver: d,
  onChange: s,
  onRemove: g
}) {
  const m = ui(t.mode);
  return /* @__PURE__ */ u(
    "div",
    {
      className: d ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": m,
      children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            ...o,
            disabled: a,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${r + 1}`,
            children: /* @__PURE__ */ n(Wr, {})
          }
        ),
        /* @__PURE__ */ u("span", { children: [
          "Step ",
          r + 1
        ] }),
        /* @__PURE__ */ u(
          "select",
          {
            "aria-label": "Tag operation",
            value: t.mode,
            onChange: (h) => s({ ...t, mode: h.target.value }),
            children: [
              /* @__PURE__ */ n("option", { value: "ADD", children: "Add tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE", children: "Remove tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE_TREE", children: "Remove tags and descendants" }),
              !e && /* @__PURE__ */ u(qe, { children: [
                /* @__PURE__ */ n("option", { value: "MARK_PRESENT", children: "Mark present" }),
                /* @__PURE__ */ n("option", { value: "MARK_ABSENT", children: "Mark absent" }),
                /* @__PURE__ */ n("option", { value: "CLEAR_ABSENCE", children: "Clear absence" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ n("div", { className: "dq-step-tags", children: /* @__PURE__ */ n(
          lt,
          {
            entityType: "tag",
            values: t.tagIds,
            onChange: (h) => s({ ...t, tagIds: h }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: g, children: /* @__PURE__ */ n(Gn, {}) })
      ]
    }
  );
}
async function Vo() {
  const e = await B("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let o = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const s = JSON.parse(r);
      Array.isArray(s.reviews) && (o = JSON.stringify(s.reviews, null, 2));
    } catch {
    }
  const a = URL.createObjectURL(
    new Blob([o], { type: "application/json" })
  ), d = document.createElement("a");
  d.href = a, d.download = "data-quality-browser-recovery.json", d.click(), URL.revokeObjectURL(a);
}
function In({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(Kn, { className: "dq-spin" }),
    e
  ] });
}
function On({
  message: e,
  onRetry: t,
  retryLabel: r = "Retry"
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(_r, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: r })
  ] });
}
const zo = { components: { DataQualityPage: Po } };
export {
  Po as DataQualityPage,
  zo as default,
  nr as objectFiltersEqual
};
