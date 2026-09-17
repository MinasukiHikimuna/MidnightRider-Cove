import { jsxs as u, jsx as n, Fragment as Re } from "react/jsx-runtime";
import { useRef as O, useState as S, useMemo as Rt, useEffect as V, useCallback as Tt, useLayoutEffect as On } from "react";
import { DetailListToolbar as $r, VIDEO_SORT_OPTIONS as Jr, VIDEO_CRITERIA as hr, EntityReferenceMultiSelector as lt, PERFORMER_CRITERIA as pn, FilterDialog as Mn, DetailListPagination as Pn, VideoPlayer as Fn, TAG_SORT_OPTIONS as Ln, TAG_CRITERIA as $n, EntityDetailTabs as ki, TagTile as Ii, VideoCard as Oi, SortableList as xr } from "@cove/runtime/components";
import { Save as Qr, RotateCcw as xn, ChevronLeft as _n, Pencil as Dn, Settings as Mi, AlertTriangle as _r, ChevronRight as Un, Film as Dr, Loader2 as jn, Tags as Pi, ExternalLink as Fi, X as Kn, Plus as Li, Upload as $i, Trash2 as Vn, GripVertical as Wr } from "@cove/runtime/lucide-react";
import { extensionFetch as xi } from "@cove/runtime/api";
function pe(e) {
  return e.entityType ?? "video";
}
function bt(e, t) {
  return "qwertyuiop"[t] ?? "";
}
function yr(e) {
  if (e.entityType === "performerOccurrence") {
    if (!Bn(e.occurrence))
      return "Complete the optional occurrence condition before saving.";
    if (e.actions.some((t) => t.steps.some((r) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(r.mode))))
      return "Occurrence actions support adding and removing tags on the active performer. Video tag assessments are not supported here.";
  }
  return pe(e) === "video" && e.actions.some(
    (t) => Gn(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => Vt(t, pe(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
function Te(e) {
  const t = (r, o) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : o;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(1e3, t(e.perPage, 40)))
  };
}
function gn(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function Ye(e) {
  const { page: t, ...r } = e.view.filter, o = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    e.entityType === "performerOccurrence" ? ["performerOccurrence", ...o, e.occurrence] : pe(e) === "tag" ? ["tag", ...o] : o
  );
}
function Vt(e, t) {
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
  ) && !Gn(e) : !1;
}
function br(e) {
  return "steps" in e ? e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  ) : !1;
}
function Gn(e) {
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
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || r.entityType === "video" || r.entityType === "tag" || r.entityType === "performerOccurrence") && (r.entityType !== "performerOccurrence" || Bn(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && (r.view.reviewMode === void 0 || ["single", "multiple"].includes(r.view.reviewMode)) && (r.view.selectAllOnLoad === void 0 || typeof r.view.selectAllOnLoad == "boolean") && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && _i(r.presentation, r.entityType === "tag") && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (o) => typeof o == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (o) => typeof (o == null ? void 0 : o.id) == "string" && typeof o.label == "string" && (o.shortcut === void 0 || typeof o.shortcut == "string") && (r.entityType === "tag" ? "effect" in o && !("steps" in o) && Vt(o, "tag") : "steps" in o && !("effect" in o) && Array.isArray(o.steps) && o.steps.every(
        (a) => a && Array.isArray(a.tagIds)
      ) && Vt(o, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => yr(r)))
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
function Bn(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (o) => Array.isArray(o) && o.every((a) => Number.isSafeInteger(a) && a > 0) && new Set(o).size === o.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && (t.targetMode !== "selected" || t.performerIds.length > 0) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && ["any", "includes", "includesAll", "excludes", "isNull"].includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && r(t.tagIds) && typeof t.multiple == "boolean";
}
function mn(e, t) {
  return e.size > 0 ? [...e].sort((r, o) => r - o) : t == null ? [] : [t];
}
function hn(e, t, r, o) {
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
function yn(e, t) {
  const r = new Set(e), o = t.length > 0 && t.every((a) => r.has(a));
  for (const a of t)
    o ? r.delete(a) : r.add(a);
  return r;
}
function Jn(e) {
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
const Qn = "ext:com.midnightrider.data-quality:configuration", Ki = "ext:cove-data-quality:video-reviews", jr = "ext:com.midnightrider.data-quality:progress", or = /* @__PURE__ */ new Map(), gr = /* @__PURE__ */ new Map(), Ut = (e, t) => e.includes("*") || e.includes(t), wr = (e) => Q(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Vi = () => ({
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
function jt(e) {
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
      r ?? (r = s), s.forEach((m) => o.add(m.id));
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
async function Wn(e) {
  const t = await Q("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function zn(e, t) {
  const r = (gr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return gr.set(e, r), r.finally(() => {
    gr.get(e) === r && gr.delete(e);
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
  const e = await Q("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, o = Ut(e.permissions, "savedfilters.read"), a = o && Ut(e.permissions, "savedfilters.write"), d = o ? (await wr(Qn)).filter((I) => I.name === "Data Quality configuration").sort((I, P) => I.id - P.id) : [];
  if (d.length > 1) {
    const I = (P) => {
      const { revision: k, ...q } = jt(P.uiOptions);
      return JSON.stringify(q);
    };
    if (d.some((P) => I(P) !== I(d[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (a)
      for (const P of d.slice(1))
        await Q(`/api/savedfilters/${P.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${P.id}` })
        });
    d.splice(1);
  }
  let s = d.length ? jt(d[0].uiOptions) : Vi();
  const m = localStorage.getItem(`${r}:migrated`) === "true", f = localStorage.getItem(r), y = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && f && (s = jt(f));
  let E = !d.length;
  if (d.length && y && f) {
    const I = jt(f);
    if (I.reviews.some((k) => {
      const q = s.reviews.find((G) => G.id === k.id);
      return q && JSON.stringify(q) !== JSON.stringify(k);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const P = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...I.deletedIds])
    ];
    s = {
      ...s,
      reviews: Ur(s.reviews, I.reviews).filter(
        (k) => !P.includes(k.id)
      ),
      deletedIds: P,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...I.importedIds])
      ]
    }, E = !0;
  }
  if (!m) {
    const I = JSON.stringify(s), P = Gi(t);
    if (d.length && P.reviews.some((T) => {
      const oe = s.reviews.find((ve) => ve.id === T.id);
      return oe && JSON.stringify(oe) !== JSON.stringify(T);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const k = o ? (await wr(Ki)).flatMap(
      (T) => ir(T.uiOptions ?? "[]")
    ) : [], q = P.known.filter(
      (T) => !P.reviews.some((oe) => oe.id === T)
    ), G = /* @__PURE__ */ new Set([...s.deletedIds, ...q]);
    s = {
      ...s,
      reviews: Ur(
        P.reviews,
        s.reviews,
        k.filter(
          (T) => !P.known.includes(T.id) && !s.importedIds.includes(T.id)
        )
      ).filter((T) => !G.has(T.id)),
      deletedIds: [...G],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...P.known,
          ...k.map((T) => T.id)
        ])
      ]
    }, E || (E = JSON.stringify(s) !== I);
  }
  const N = {
    userId: t,
    recordId: (b = d[0]) == null ? void 0 : b.id,
    config: s,
    readable: o,
    writable: a,
    durable: a
  };
  if (or.set(r, N), E && a) {
    const I = s;
    d.length && (N.config = jt(d[0].uiOptions)), await Hn(r, I), s = N.config;
  } else d.length || (localStorage.setItem(r, JSON.stringify(s)), !o && (!m || y) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!o) localStorage.setItem(`${r}:migrated`, "true");
  else if (a)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: s.reviews,
    storageKey: r,
    canWrite: Ut(e.permissions, "videos.write"),
    canWriteVideos: Ut(e.permissions, "videos.write"),
    canWriteTags: Ut(e.permissions, "tags.write"),
    canReadTagGroups: Ut(e.permissions, "taggroups.read"),
    canConfigure: !o || a,
    storageNotice: o ? a ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Hn(e, t) {
  const r = or.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const o = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await Wn(r), r.recordId != null) {
      const d = await Q(
        `/api/savedfilters/${r.recordId}`
      );
      if (jt(d.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const a = await Q(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Qn,
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
  return ir(JSON.stringify(t)), zn(e, async () => {
    const r = or.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const o = r.config.reviews.filter((a) => !t.some((d) => d.id === a.id)).map((a) => a.id);
    await Hn(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...o])
      ].filter((a) => !t.some((d) => d.id === a))
    });
  });
}
function bn(e) {
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
  const o = localStorage.getItem(`${e}:progress:${t}`), a = o ? bn(o) : null;
  if (!r.readable) return a;
  const d = (await wr(jr)).find(
    (m) => m.name === t
  ), s = d ? bn(d.uiOptions) : null;
  return a && (!s || a.updatedAt > s.updatedAt) ? a : s;
}
function zi(e, t, r) {
  const o = `${e}:progress:${t}`;
  try {
    localStorage.setItem(o, JSON.stringify(r));
  } catch {
  }
  return zn(o, async () => {
    const a = or.get(e);
    if (!(a != null && a.writable)) return;
    await Wn(a);
    const d = (await wr(jr)).find(
      (s) => s.name === t
    );
    await Q(
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
const Gt = "confirmed_absent_tags", vr = "Confirmed absent tags", Hi = {
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
      t === "modifier" && typeof r == "string" ? Hi[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === Gt.toLowerCase() ? r.toLowerCase() : Bt(r)
    ])
  ) : e;
}
async function Q(e, t = {}) {
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
function Xn(e) {
  return Q(`/api/videos/${e}?dqRead=${Xi}-${++Yi}`, { cache: "no-store" });
}
async function tr(e, t, r) {
  const o = { ...e.view.objectFilter }, a = o._filterExpression;
  if (delete o._filterExpression, delete o.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return Q("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Bt({
        findFilter: Te(t),
        objectFilter: o,
        filterExpression: a
      })
    )
  });
}
async function wn(e, t, r) {
  const o = { ...e.view.objectFilter };
  return delete o._filterExpression, Q("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Bt({
        findFilter: Te(t),
        objectFilter: o
      })
    )
  });
}
function Zi(e) {
  return Q("/api/taggroups", { signal: e });
}
function eo(e) {
  return `/api/videos/${e.id}/image?max=1280&v=${encodeURIComponent(e.updatedAt)}`;
}
function Yn(e) {
  return `/api/stream/video/${e}`;
}
function vn(e) {
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
async function Sr(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const o of e) {
    await Q(`/api/tags/${o}`, { signal: t }), r.add(o);
    for (let a = 1; ; a++) {
      const d = await Q("/api/tags/find", {
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
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${Gt} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function zr() {
  const t = (await Q("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === Gt.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${vr} custom field before applying tag assessments.`
    };
  const r = io(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function oo() {
  const e = await zr();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await Q("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: Gt,
        label: vr,
        type: "tag",
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function Sn(e) {
  return [...new Set(e)];
}
function ao(e, t, r) {
  const o = [...e.tagIds], a = (d) => {
    if (r === null)
      throw new Error(
        `The ${vr} custom field is not available.`
      );
    return { customFields: { [r]: o }, customFieldMode: d };
  };
  switch (e.mode) {
    case "ADD":
      return { ids: t, tagIds: o, tagMode: "ADD" };
    case "REMOVE":
    case "REMOVE_TREE":
      return { ids: t, tagIds: o, tagMode: "REMOVE" };
    case "MARK_PRESENT":
      return { ids: t, tagIds: o, tagMode: "ADD", ...a("REMOVE") };
    case "MARK_ABSENT":
      return { ids: t, tagIds: o, tagMode: "REMOVE", ...a("ADD") };
    case "CLEAR_ABSENCE":
      return { ids: t, ...a("REMOVE") };
  }
}
async function Zn(e, t) {
  if (!Vt(e) || t.length === 0 || t.some((f) => !Number.isSafeInteger(f) || f <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  let r = null;
  if (br(e)) {
    let f;
    try {
      f = await zr();
    } catch (y) {
      throw new Error(
        `Could not verify the ${vr} custom field. ${y instanceof Error ? y.message : "Request failed."}`
      );
    }
    if (f.kind !== "ready") throw new Error(f.message);
    r = f.definition.key;
  }
  const o = Sn(t), a = await Promise.all(
    e.steps.map(async (f) => ({
      mode: f.mode,
      tagIds: f.mode === "REMOVE_TREE" ? await Sr(f.tagIds) : Sn(f.tagIds)
    }))
  ), d = (f) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(f), m = [
    ...a.filter((f) => !d(f.mode)),
    ...a.filter((f) => d(f.mode))
  ].map(
    (f) => ao(f, o, r)
  );
  for (let f = 0; f < m.length; f++)
    try {
      await Q("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify(m[f])
      });
    } catch (y) {
      throw new Error(
        `Step ${f + 1} failed; ${f} earlier step(s) completed. Refresh and check the selected videos before retrying. ${y instanceof Error ? y.message : "Request failed."}`
      );
    }
}
async function so(e, t) {
  if (!Vt(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await Q("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
async function lo(e, t, r) {
  if (!Vt(r) || r.steps.some(
    (d) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(d.mode)
  ))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const o = await Promise.all(
    r.steps.map(async (d) => ({
      ...d,
      tagIds: d.mode === "REMOVE_TREE" ? await Sr(d.tagIds) : d.tagIds
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
    const m = await Q("/api/performers/find", {
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
    if (m.items.forEach((f) => o.add(f.id)), s * 1e3 >= m.totalCount) return [...o];
    if (!m.items.length)
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
function co(e, t, r = e.conditionTagIds.map((o) => [o])) {
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
async function uo(e, t, r, o) {
  if ((t == null ? void 0 : t.length) === 0)
    return { items: [], totalCount: 0 };
  const a = await tr(
    ti(e, t),
    { ...e.view.filter, page: r },
    o
  ), d = t === null ? null : new Set(t), s = e.occurrence, m = a.items.length && s.includeSubtags !== !1 && !["any", "isNull"].includes(s.condition) ? await Promise.all(s.conditionTagIds.map((E) => Sr([E], o))) : s.conditionTagIds.map((E) => [E]), f = new Array(a.items.length);
  let y = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, a.items.length) }, async () => {
      for (; y < a.items.length; ) {
        const E = y++, N = a.items[E], b = await Q(
          `/api/tagapplications?hostType=video&hostId=${N.id}&contextType=performer`,
          { signal: o }
        );
        f[E] = N.performers.filter((I) => d === null || d.has(I.id)).flatMap((I) => {
          const P = b.filter(
            (k) => k.hostType === "video" && k.hostId === N.id && k.contextType === "performer" && k.contextId === I.id
          );
          return co(
            e.occurrence,
            P.map((k) => k.tag.id),
            m
          ) ? [
            {
              key: `${N.id}:${I.id}`,
              video: N,
              performer: I,
              applications: P
            }
          ] : [];
        });
      }
    })
  ), { items: f.flat(), totalCount: a.totalCount };
}
async function ri(e, t, r) {
  const o = new Set(e.occurrence.tagIds);
  if (r.some((f) => !o.has(f)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const a = await Xn(t.video.id);
  if (!a.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      "This performer is no longer linked to the scene. Refresh the queue."
    );
  const d = `/api/tagapplications?hostType=video&hostId=${a.id}&contextType=performer&contextId=${t.performer.id}`, s = (await Q(d)).filter(
    (f) => f.hostType === "video" && f.hostId === a.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), m = new Set(r);
  try {
    for (const f of m)
      s.some((y) => y.tag.id === f) || await Q("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: "video",
          hostId: a.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: f,
          sourceKey: "user"
        })
      });
    for (const f of s)
      o.has(f.tag.id) && !m.has(f.tag.id) && await Q(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await Q(d);
  } catch (f) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${f instanceof Error ? f.message : "Request failed."}`
    );
  }
}
function nr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, m) => nr(s, t[m]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, o = t, a = Object.keys(r).sort(), d = Object.keys(o).sort();
  return a.length === d.length && a.every(
    (s, m) => s === d[m] && nr(r[s], o[s])
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
], fo = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0
};
function Kt(e) {
  const t = e.entityType === "performerOccurrence" ? e.occurrence : void 0;
  return {
    filter: Te({
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
function En(e) {
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
    const s = Kt(e);
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
    const s = t.get("sorts").split(",").map((m) => {
      const f = m.lastIndexOf(":");
      return { key: m.slice(0, f), direction: m.slice(f + 1) };
    });
    if (s.some((m) => !m.key || !["asc", "desc"].includes(m.direction)))
      throw new Error("Invalid review URL sort.");
    o.sorts = s, o.sort = s[0].key, o.direction = s[0].direction;
  }
  let a;
  if (e.entityType === "performerOccurrence" && (a = {
    ...fo,
    ...En(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(a.targetMode) || !["any", "includes", "includesAll", "excludes", "isNull"].includes(
    a.condition
  ) || !Array.isArray(a.performerIds) || !Array.isArray(a.conditionTagIds) || typeof a.includeSubtags != "boolean" || [...a.performerIds, ...a.conditionTagIds].some(
    (s) => !Number.isSafeInteger(s) || s <= 0
  ) || !a.performerFilter || typeof a.performerFilter != "object" || Array.isArray(a.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const d = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Te(o),
      objectFilter: En(t.get("filters")),
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
function po(e, t) {
  return {
    added: t.filter((r) => !e.includes(r)),
    removed: e.filter((r) => !t.includes(r))
  };
}
function go(e) {
  return `/api/tagapplications?hostType=video&hostId=${e.video.id}&contextType=performer&contextId=${e.occurrence.performer.id}`;
}
async function er(e) {
  var d;
  if (e.occurrence) {
    const s = (await Q(go(e))).filter(
      (m) => m.hostType === "video" && m.hostId === e.video.id && m.contextType === "performer" && m.contextId === e.occurrence.performer.id
    );
    return {
      ids: [...new Set(s.map((m) => m.tag.id))],
      names: [...new Set(s.map((m) => m.tag.name))],
      absent: [],
      applications: s
    };
  }
  const t = await Xn(e.video.id), r = (t.tags ?? []).filter(
    (s) => s.canRemove !== !1 || s.isDerived !== !0
  ), o = Object.keys(t.customFields ?? {}).find(
    (s) => s.toLowerCase() === Gt
  ) ?? Gt, a = ((d = t.customFields) == null ? void 0 : d[o]) ?? [];
  if (!Array.isArray(a) || a.some((s) => !Number.isSafeInteger(s)))
    throw new Error(
      "Confirmed absent tags are invalid. Inspect the video before editing."
    );
  return { ids: r.map((s) => s.id), names: r.map((s) => s.name), absent: a };
}
async function mo(e, t, r) {
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
      a.length && await Q("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({ ids: [t.video.id], tagMode: o, tagIds: a })
      });
}
async function ho(e, t, r) {
  t.occurrence && e.entityType === "performerOccurrence" ? await lo(e, t.occurrence, r) : await Zn(r, [t.video.id]);
}
const yo = {
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
function Hr(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function bo(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function ni(e) {
  return [
    ...new Set(
      Hr(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function ii(e, t) {
  const r = Hr(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((o) => {
      const a = String(o.key ?? ""), d = yo[String(o.modifier ?? "EQUALS")], s = (N, b) => String(b ?? "").trim() || t[String(N)] || String(N ?? ""), m = s(
        o.value,
        o.displayValue
      ), f = s(
        o.value2,
        o.displayValue2
      ), y = String(o.modifier ?? "EQUALS"), E = y === "IS_NULL" || y === "NOT_NULL" ? [] : y === "BETWEEN" || y === "NOT_BETWEEN" ? [m, "and", f] : [m];
      return {
        ...o,
        label: [bo(a), d, ...E].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function oi(e) {
  const t = Hr(e.customFieldCriteria);
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
function Cn({
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
function Pr(e, t) {
  if (!t) return e;
  const r = /* @__PURE__ */ new Map();
  for (const o of e)
    r.set(o.video.id, [...r.get(o.video.id) ?? [], o]);
  return [...r.values()].reverse().flat();
}
const We = (e) => e instanceof Error ? e.message : "Request failed.";
function wo({
  actions: e,
  disabled: t,
  canWrite: r,
  onApply: o
}) {
  const [a, d] = S({});
  V(() => {
    let m = !0;
    return Promise.all(
      [
        ...new Set(
          e.flatMap(
            (f) => f.steps.flatMap((y) => y.tagIds)
          )
        )
      ].map(async (f) => {
        try {
          return [
            f,
            (await Q(`/api/tags/${f}`)).name
          ];
        } catch {
          return [f, "Unavailable tag"];
        }
      })
    ).then((f) => {
      m && d(Object.fromEntries(f));
    }), () => {
      m = !1;
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
    e.map((m, f) => /* @__PURE__ */ u("div", { className: "dq-action-pair", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: t || !r && m.steps.length > 0,
          onClick: (y) => o(m, y.shiftKey),
          children: /* @__PURE__ */ u("span", { children: [
            bt(m, f) && /* @__PURE__ */ n("kbd", { children: bt(m, f) }),
            " ",
            m.label
          ] })
        }
      ),
      m.steps.length > 0 && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button dq-apply-stay-button",
          disabled: t || !r,
          "aria-label": `Apply & stay: ${m.label}`,
          title: `Apply & stay: ${m.label}`,
          onClick: () => o(m, !0),
          children: /* @__PURE__ */ n(Qr, { "aria-hidden": "true" })
        }
      ),
      m.steps.length > 0 && /* @__PURE__ */ n("small", { className: "dq-review-action-summary", children: m.steps.map(
        (y) => `${s[y.mode]}: ${y.tagIds.map((E) => a[E] ?? "Loading tag…").join(", ")}`
      ).join("; ") })
    ] }, m.id))
  ] });
}
function vo({
  review: e,
  canWrite: t,
  onBusy: r,
  onSaveDefaults: o,
  editRequest: a = 0,
  renderRuleEditor: d
}) {
  var Oe;
  const s = O(null), m = O("");
  if (!s.current)
    try {
      s.current = Vr(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (l) {
      m.current = We(l), s.current = { query: Kt(e), startAtEnd: !1 };
    }
  const [f, y] = S(null), E = O(null), N = O(null), b = O(null), [I, P] = S(!!m.current), k = O(0), [q, G] = S(s.current.query), T = O(q);
  T.current = q;
  const [oe, ve] = S(0), Pe = O(s.current.startAtEnd), [g, M] = S([]), [w, j] = S(null), re = O(null), [Ne, de] = S(null), [ar, ue] = S(0), qt = Rt(() => {
    if (!w) return null;
    const l = g.findIndex((p) => p.key === w.key);
    return l < 0 ? null : g.slice(l + 1).find((p) => p.video.id !== w.video.id) ?? null;
  }, [w, g]), [Ue, ct] = S(0), [Se, kt] = S(!1), [le, It] = S(!1), ke = O(!1), He = O(!0), et = O(null);
  V(() => (He.current = !0, () => {
    He.current = !1;
  }), []);
  const [wt, Y] = S(m.current), [vt, Fe] = S(""), [ge, Z] = S(null), [me, B] = S(!1), [C, J] = S([]), $ = O([]), Xe = O(null), tt = O(null), Jt = O(null);
  V(() => {
    var l, p;
    me && ((p = (l = Jt.current) == null ? void 0 : l.querySelector("input")) == null || p.focus());
  }, [me]);
  const [fe, dt] = S(!1);
  V(() => {
    if (Se || fe || !tt.current) return;
    const l = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const p = tt.current;
      p != null && p.isConnected && !p.disabled && p.focus(), tt.current = null;
    });
    return () => cancelAnimationFrame(l);
  }, [Se, fe, oe]);
  const [ut, St] = S([]), [Ot, Mt] = S({}), Pt = O(null), ft = O(0), je = O(!1), [ne, Ft] = S({});
  V(() => {
    let l = !0;
    return Promise.all(
      ni(q.objectFilter).map(
        async (p) => [
          String(p),
          (await Q(`/api/tags/${p}`)).name
        ]
      )
    ).then((p) => {
      l && Ft(Object.fromEntries(p));
    }).catch(() => {
    }), () => {
      l = !1;
    };
  }, [q.objectFilter]);
  const pt = O(0), Qt = O(e);
  Qt.current = e;
  const Ee = f ?? e, Ke = Rt(
    () => Ze(Ee, q),
    [Ee, q]
  ), K = O(Ke);
  K.current = Ke;
  const Et = q.startFrom !== (e.view.startFrom ?? "end") || !nr(
    JSON.parse(Ye(Ze(e, q))),
    JSON.parse(Ye(Ze(e, Kt(e))))
  ), ce = le || Se || me, rt = Number(q.filter.page);
  function Le(l, p = !1) {
    ke.current || (m.current = "", Pe.current = p, T.current = l, G(l), ct(0), kt(!0), p || rr(e.id, l), ve((R) => R + 1));
  }
  function Lt() {
    if (ke.current = !1, It(!1), He.current && et.current) {
      const l = et.current;
      et.current = null, Le(l.query, l.startAtEnd);
    }
  }
  V(() => {
    const l = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const p = Vr(
            Qt.current,
            new URLSearchParams(window.location.search)
          );
          ke.current ? et.current = p : Le(p.query, p.startAtEnd);
        } catch (p) {
          Y(We(p));
        }
    };
    return window.addEventListener("popstate", l), () => window.removeEventListener("popstate", l);
  }, [e.id]), V(() => (r(le || Se || me || !!f), () => r(!1)), [le, Se, me, !!f, r]);
  async function $t(l, p, R) {
    if (l.entityType === "performerOccurrence") {
      const _ = await uo(
        l,
        Pt.current,
        p,
        R
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
      { ...l.view.filter, page: p },
      R
    );
    return {
      items: x.items.map((_) => ({ key: String(_.id), video: _ })),
      totalCount: x.totalCount
    };
  }
  function Wt(l, p, R, x = !1, _ = !1) {
    if (!He.current || et.current) return;
    P(!0), M(
      _ ? l.items : Pr(l.items, T.current.startFrom === "end")
    ), ct(l.totalCount), he(R, x);
    const z = {
      ...T.current,
      filter: { ...T.current.filter, page: p }
    };
    T.current = z, G(z), rr(e.id, z);
  }
  function he(l, p = !1) {
    (l == null ? void 0 : l.key) !== (w == null ? void 0 : w.key) && (re.current = null), (l == null ? void 0 : l.video.id) !== (w == null ? void 0 : w.video.id) && de(p && l ? l.video.id : null), j(l);
  }
  V(() => {
    if (m.current) return;
    const l = new AbortController();
    b.current = l;
    const p = ++pt.current;
    return kt(!0), Y(""), Fe(""), re.current = null, de(null), j(null), M([]), B(!1), (async () => {
      const R = Ze(Qt.current, T.current);
      Pt.current = R.entityType === "performerOccurrence" ? await ei(R, l.signal) : null;
      let x = Number(R.view.filter.page), _ = await $t(R, x, l.signal);
      const z = Math.max(
        1,
        Math.ceil(_.totalCount / Number(R.view.filter.perPage))
      );
      if ((Pe.current || x > z) && (x = z, _ = await $t(R, x, l.signal)), Pe.current = !1, p !== pt.current || l.signal.aborted) return;
      const it = Pr(_.items, R.view.startFrom === "end");
      Wt(_, x, it[0] ?? null);
    })().catch((R) => {
      !l.signal.aborted && p === pt.current && Y(We(R));
    }).finally(() => {
      !l.signal.aborted && p === pt.current && (P(!0), kt(!1));
    }), () => {
      l.abort(), pt.current++;
    };
  }, [oe, e.id]), V(() => {
    if (Z(null), !w) return;
    let l = !0;
    return er(w).then((p) => {
      l && (Z(p), St(
        e.entityType === "performerOccurrence" ? p.ids.filter((R) => e.occurrence.tagIds.includes(R)) : []
      ));
    }).catch((p) => {
      l && Y(`Could not load current tags. ${We(p)}`);
    }), () => {
      l = !1;
    };
  }, [w]), V(() => {
    if (e.entityType !== "performerOccurrence" || e.actions.length)
      return;
    let l = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (p) => [
          p,
          (await Q(`/api/tags/${p}`)).name
        ]
      )
    ).then((p) => {
      l && Mt(Object.fromEntries(p));
    }).catch((p) => {
      l && Y(We(p));
    }), () => {
      l = !1;
    };
  }, [e]);
  async function $e(l = !1, p = !1, R = !1) {
    var gt;
    if (!w) return;
    const x = g.findIndex((H) => H.key === w.key), _ = q.startFrom === "end" ? -1 : 1, z = ((gt = re.current) == null ? void 0 : gt.key) === w.key ? re.current : { key: w.key, page: rt, before: g.slice(0, x + 1).map((H) => H.key), after: g.slice(x + 1).map((H) => H.key) }, it = new Set(z.after), D = new Set(z.before), Ve = g.find((H) => {
      var De;
      return it.has(H.key) || (_ === 1 || rt < z.page) && ((De = re.current) == null ? void 0 : De.key) === w.key && !D.has(H.key);
    });
    if (!l && Ve) {
      he(Ve, R);
      return;
    }
    const ae = l ? D : new Set(g.map((H) => H.key)), _e = 1100 - (Date.now() - ft.current);
    _e > 0 && await new Promise((H) => window.setTimeout(H, _e));
    let Ce = _ === -1 && !l ? Math.max(1, rt - 1) : rt;
    for (; He.current && !et.current; ) {
      let H = await $t(Ke, Ce);
      const De = Math.max(
        1,
        Math.ceil(H.totalCount / Number(q.filter.perPage))
      );
      Ce > De && (Ce = De, H = await $t(Ke, Ce));
      const ot = Pr(H.items, _ === -1), ee = new Map(ot.map((be) => [be.key, be])), zt = l ? z.after.flatMap((be) => {
        const Ht = ee.get(be);
        return Ht ? [Ht] : [];
      }) : [], sr = new Set(zt.map((be) => be.key)), mt = l ? {
        ...H,
        items: [
          ...zt,
          ...ot.filter(
            (be) => be.key !== w.key && !sr.has(be.key)
          )
        ]
      } : H;
      if (p) {
        re.current = z, Wt(mt, Ce, w, !1, l);
        return;
      }
      const ht = _ === -1 && rt === 1 && !l ? void 0 : mt.items.find(
        (be) => !ae.has(be.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(l && _ === -1 && Ce === z.page) || it.has(be.key))
      );
      if (ht || (_ === -1 ? Ce <= 1 : Ce >= De)) {
        Wt(
          mt,
          Ce,
          ht ?? null,
          R,
          l
        ), ht || Fe(
          H.totalCount ? "Reached the end in this direction. Matching items remain available from the scene pages." : "No matching scenes."
        );
        return;
      }
      Ce += _;
    }
  }
  async function xe(l, p = !1, R = !1, x = !1) {
    if (f || !w || ke.current || Se || me && !R)
      return;
    const _ = R || x || !!(l != null && l.steps.length), z = _ && !p;
    if (_ && (!t || !ge)) return;
    ke.current = !0, It(!0), Y(""), Fe("");
    const it = g.findIndex((ae) => ae.key === w.key), D = _ && !p && it >= 0 ? g[it + 1] ?? null : null;
    D && (M(
      (ae) => ae.filter((_e) => _e.key !== w.key)
    ), he(D, !0));
    let Ve = !1;
    try {
      if (_) {
        const ae = await er(w);
        if (l)
          await ho(Ke, w, l);
        else {
          const Ce = x && e.entityType === "performerOccurrence" ? e.occurrence.tagIds.filter((De) => ae.ids.includes(De)) : $.current, H = po(Ce, x ? ut : C);
          await mo(Ke, w, H);
        }
        ft.current = Date.now();
        const _e = await er(w);
        D || Z(_e), Ve = !0, B(!1), Fe("Tags saved.");
      }
      if (!He.current || et.current) return;
      _ ? await $e(!0, p, z) : p || await $e(), p && R && requestAnimationFrame(() => {
        var ae;
        return (ae = Xe.current) == null ? void 0 : ae.focus();
      });
    } catch (ae) {
      if (Y(
        Ve ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${We(ae)}` : _ ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${We(ae)}` : `Could not advance. ${We(ae)}`
      ), _ && !Ve) {
        D && (M(g), de(null), ue((_e) => _e + 1), j(w)), ft.current = Date.now();
        try {
          Z(await er(w));
        } catch {
          Z(null), Y(
            (_e) => `${_e} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Lt();
    }
  }
  V(() => {
    const l = (p) => {
      if (me || f || le || Se || fe || p.defaultPrevented || p.repeat || p.ctrlKey || p.altKey || p.metaKey || !Jn(p.target) || document.querySelector('[role="dialog"], dialog[open]'))
        return;
      const R = p.key.toLowerCase(), x = e.actions.find(
        (_, z) => bt(_, z) === R
      );
      x && (p.preventDefault(), p.stopPropagation(), xe(x, p.shiftKey));
    };
    return document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l);
  });
  function nt() {
    !o || f || ke.current || me || (N.current = document.activeElement, E.current = {
      error: wt,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(T.current),
      items: g,
      current: w,
      total: Ue,
      targets: Pt.current,
      stayedCursor: re.current
    }, y(structuredClone(Ze(e, T.current))), Fe(""), Y(""));
  }
  V(() => {
    a && a !== k.current && I && !Se && (k.current = a, nt());
  }, [a, Se, I]);
  function xt() {
    y(null), requestAnimationFrame(() => {
      var l;
      return (l = N.current) == null ? void 0 : l.focus();
    });
  }
  function ye() {
    var p;
    const l = E.current;
    !l || le || ((p = b.current) == null || p.abort(), pt.current++, T.current = l.query, G(l.query), M(l.items), j(l.current), ct(l.total), Pt.current = l.targets, re.current = l.stayedCursor, kt(!1), Y(l.error), Fe(""), window.history.replaceState(window.history.state, "", l.url), xt());
  }
  async function Ae() {
    if (!f || !o || ke.current) return;
    const l = Ze(
      { ...f, name: f.name.trim() },
      T.current
    ), p = yr(l);
    if (p) {
      Y(p);
      return;
    }
    ke.current = !0, It(!0), Y("");
    try {
      if (await o(l) === !1) throw new Error("Could not save review.");
      xt(), Fe("Review saved.");
    } catch (R) {
      Y(
        "Could not save review. Your edits are still open. " + We(R)
      );
    } finally {
      Lt();
    }
  }
  async function Ie() {
    if (!o || ke.current) return;
    const l = Ze(e, {
      ...T.current,
      filter: { ...T.current.filter, page: 1 }
    });
    ke.current = !0, It(!0), Y("");
    try {
      if (await o(l) === !1) throw new Error("Could not save review.");
      Fe("Queue saved to this review.");
    } catch (p) {
      Y("Could not save queue. " + We(p));
    } finally {
      Lt();
    }
  }
  const W = q.performerScope, qe = (l) => Le({
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
        f && /* @__PURE__ */ u("section", { className: "dq-rule-editor", "aria-label": "Edit review rule", children: [
          /* @__PURE__ */ n("h2", { children: "Edit review" }),
          /* @__PURE__ */ n("p", { children: "Preview matching scenes below. Save review keeps all rule changes; Cancel restores your previous view." }),
          /* @__PURE__ */ u("fieldset", { disabled: le, children: [
            d == null ? void 0 : d(
              Ze(f, q),
              y,
              le
            ),
            /* @__PURE__ */ u("label", { children: [
              "Review direction",
              /* @__PURE__ */ u(
                "select",
                {
                  "aria-label": "Review direction",
                  value: q.startFrom,
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
                disabled: le || Se,
                onClick: () => void Ae(),
                children: "Save review"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button",
                type: "button",
                disabled: le,
                onClick: ye,
                children: "Cancel"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u(
          "fieldset",
          {
            className: "dq-review-filters",
            disabled: ce,
            onClickCapture: (l) => {
              var x;
              const p = l.target instanceof Element ? l.target.closest("button") : null, R = (p == null ? void 0 : p.getAttribute("aria-label")) ?? ((x = p == null ? void 0 : p.textContent) == null ? void 0 : x.trim()) ?? "";
              p && !p.closest('[role="dialog"], dialog') && /^(Filters|Edit filter:|Edit performer criteria)/.test(R) && (tt.current = p);
            },
            children: [
              /* @__PURE__ */ n("legend", { children: "Scene filters" }),
              /* @__PURE__ */ u(
                "div",
                {
                  className: "dq-queue-toolbar",
                  onKeyDownCapture: (l) => {
                    var p;
                    l.key === "Escape" && (je.current = !1), ["Delete", "Backspace"].includes(l.key) && l.target instanceof Element && ((p = l.target.closest("button")) == null ? void 0 : p.getAttribute("aria-label")) === "Edit filter: Custom Fields" && (je.current = !0);
                  },
                  onClickCapture: (l) => {
                    var R, x;
                    const p = l.target instanceof Element ? l.target.closest("button") : null;
                    (p == null ? void 0 : p.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((R = p == null ? void 0 : p.textContent) == null ? void 0 : R.trim()) === "Clear all" ? je.current = !0 : (/^(Cancel|Filters)/.test(((x = p == null ? void 0 : p.textContent) == null ? void 0 : x.trim()) ?? "") || /^(Close|Dismiss)/.test((p == null ? void 0 : p.getAttribute("aria-label")) ?? "")) && (je.current = !1);
                  },
                  children: [
                    /* @__PURE__ */ n(
                      $r,
                      {
                        filter: q.filter,
                        objectFilter: ii(
                          q.objectFilter,
                          ne
                        ),
                        criteriaDefinitions: [
                          ...hr,
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
                            filter: Te(l)
                          });
                        },
                        onObjectFilterChange: (l) => {
                          const p = ai(
                            T.current.objectFilter,
                            oi(l),
                            je.current
                          );
                          je.current = !1, Le({
                            ...T.current,
                            objectFilter: p,
                            filter: { ...T.current.filter, page: 1 }
                          });
                        }
                      }
                    ),
                    !f && Et && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          "aria-label": "Save changes to review filters",
                          title: "Save changes to review filters",
                          disabled: !o,
                          onClick: () => void Ie(),
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
                            const l = Kt(e);
                            Le(l, l.startFrom === "end");
                          },
                          children: /* @__PURE__ */ n(xn, { "aria-hidden": "true" })
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
                      onChange: (l) => qe({
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
                    onChange: (l) => qe({ performerIds: l }),
                    placeholder: "Select performers to review...",
                    allowCreate: !1
                  }
                ),
                W.targetMode === "filter" && /* @__PURE__ */ u(Re, { children: [
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
                      criteriaDefinitions: pn,
                      objectFilter: W.performerFilter,
                      onObjectFilterChange: (l) => qe({ performerFilter: l })
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
                      onChange: (l) => qe({
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
                !["any", "isNull"].includes(W.condition) && /* @__PURE__ */ u(Re, { children: [
                  /* @__PURE__ */ n(
                    lt,
                    {
                      entityType: "tag",
                      values: W.conditionTagIds,
                      onChange: (l) => qe({ conditionTagIds: l }),
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
                        onChange: (l) => qe({ includeSubtags: l.target.checked })
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
            open: fe,
            onClose: () => dt(!1),
            criteria: pn,
            activeFilter: W.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (l) => {
              dt(!1), qe({ performerFilter: l });
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
                disabled: le,
                onClick: () => {
                  w ? er(w).then(Z).catch((l) => Y(We(l))) : Le(T.current);
                },
                children: w ? "Reload tags" : "Retry queue"
              }
            )
          ] }),
          vt && /* @__PURE__ */ n("p", { role: "status", children: vt })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-review-layout", children: [
          /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
            /* @__PURE__ */ n("fieldset", { disabled: ce, children: /* @__PURE__ */ n(
              Pn,
              {
                filter: q.filter,
                totalCount: Ue,
                onFilterChange: (l) => Le({ ...q, filter: Te(l) })
              }
            ) }),
            /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: g.map((l) => {
              var p, R, x;
              return /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  title: `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${l.video.title || ((p = l.video.files[0]) == null ? void 0 : p.basename) || "Scene"}`,
                  "aria-label": `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${l.video.title || ((R = l.video.files[0]) == null ? void 0 : R.basename) || "Scene"}`,
                  disabled: ce,
                  "aria-pressed": (w == null ? void 0 : w.key) === l.key,
                  onClick: () => {
                    he(l), Y(""), Fe("");
                  },
                  children: [
                    l.occurrence && /* @__PURE__ */ n(Cn, { performer: l.occurrence.performer }),
                    /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: l.video.title || ((x = l.video.files[0]) == null ? void 0 : x.basename) || "Scene" })
                  ]
                },
                l.key
              );
            }) })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-inspector", children: w ? /* @__PURE__ */ u(Re, { children: [
            /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
              /* @__PURE__ */ n("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ n(
                "a",
                {
                  href: `/video/${w.video.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: w.video.title || ((Oe = w.video.files[0]) == null ? void 0 : Oe.basename) || `Video ${w.video.id}`
                }
              ) }),
              [w, qt].filter(Boolean).map((l) => {
                var x, _, z;
                const p = l, R = p.key === w.key;
                return /* @__PURE__ */ n(
                  "div",
                  {
                    className: R ? "dq-review-video-current" : "dq-review-video-preload",
                    "aria-hidden": R ? void 0 : !0,
                    inert: R ? void 0 : !0,
                    children: /* @__PURE__ */ n(
                      Fn,
                      {
                        videoId: p.video.id,
                        streamUrl: Yn(p.video.id),
                        posterUrl: R ? eo(p.video) : void 0,
                        duration: ((x = p.video.files[0]) == null ? void 0 : x.duration) ?? 0,
                        format: (_ = p.video.files[0]) == null ? void 0 : _.format,
                        audioCodec: (z = p.video.files[0]) == null ? void 0 : z.audioCodec,
                        extensionSurface: R ? "quick-view" : void 0,
                        autostart: R && Ne === p.video.id,
                        keyboardShortcutsEnabled: R,
                        showAbLoop: R,
                        clip: p.video.parentVideoId != null ? {
                          start: p.video.clipStartSec ?? 0,
                          end: p.video.clipEndSec,
                          loop: !1
                        } : void 0
                      }
                    )
                  },
                  `${p.video.id}:${ar}`
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
                  children: g.filter((l) => l.video.id === w.video.id).map((l) => {
                    var p, R;
                    return /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button dq-partner-button",
                        title: (p = l.occurrence) == null ? void 0 : p.performer.name,
                        "aria-label": (R = l.occurrence) == null ? void 0 : R.performer.name,
                        disabled: ce,
                        "aria-pressed": l.key === w.key,
                        onClick: () => {
                          he(l), Y("");
                        },
                        children: l.occurrence && /* @__PURE__ */ n(
                          Cn,
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
                ge ? ge.names.join(", ") || "None" : "Loading…"
              ] }),
              ge != null && ge.absent.length ? /* @__PURE__ */ u("p", { children: [
                "Confirmed absent tags:",
                " ",
                /* @__PURE__ */ n(
                  lt,
                  {
                    entityType: "tag",
                    values: ge.absent,
                    onChange: () => {
                    },
                    disabled: !0,
                    allowCreate: !1
                  }
                )
              ] }) : null,
              me ? /* @__PURE__ */ u(
                "fieldset",
                {
                  ref: Jt,
                  disabled: le,
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
                        values: C,
                        onChange: J,
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
                          disabled: !ge,
                          onClick: () => void xe(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !ge,
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
                            B(!1), requestAnimationFrame(
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
              ) : /* @__PURE__ */ u(Re, { children: [
                /* @__PURE__ */ n(
                  wo,
                  {
                    actions: Ee.actions,
                    canWrite: t,
                    disabled: le || Se || !ge || !!f,
                    onApply: (l, p) => void xe(l, p)
                  }
                ),
                e.entityType === "performerOccurrence" && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                  "fieldset",
                  {
                    className: "dq-tag-choices",
                    disabled: !t || le || !ge || !!f,
                    children: [
                      /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                      e.occurrence.tagIds.map((l) => /* @__PURE__ */ u("label", { children: [
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: e.occurrence.multiple ? "checkbox" : "radio",
                            name: "legacy-choice",
                            checked: ut.includes(l),
                            onChange: (p) => St(
                              e.occurrence.multiple ? p.target.checked ? [...ut, l] : ut.filter(
                                (R) => R !== l
                              ) : [l]
                            )
                          }
                        ),
                        Ot[l] ?? "Loading tag…"
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
                    disabled: ce || !!f || !t || !ge,
                    onClick: () => {
                      $.current = [...ge.ids], J([...ge.ids]), B(!0);
                    },
                    children: "Edit tags"
                  }
                ),
                /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: ce || !!f,
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
          ] }) : /* @__PURE__ */ n("p", { role: "status", children: Se ? "Loading review…" : Ue ? "Reached the end in this direction." : "No matching scenes." }) })
        ] })
      ]
    }
  );
}
function Nn({
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
    !["any", "isNull"].includes(o.condition) && /* @__PURE__ */ u(Re, { children: [
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
function So(e) {
  var m, f, y;
  const [t, r] = S({}), [o, a] = S(""), d = (((m = e == null ? void 0 : e.presentation) == null ? void 0 : m.annotations) ?? []).includes("tags") ? ((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...d,
      ...((y = e == null ? void 0 : e.presentation) == null ? void 0 : y.binParents) ?? []
    ])
  ]);
  return V(() => {
    let E = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(s).map(
        async (N) => [N, await Sr([N])]
      )
    ).then((N) => {
      E && r(Object.fromEntries(N));
    }).catch(() => {
      E && a(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      E = !1;
    };
  }, [s]), { ids: t, error: o };
}
function Eo(e, t, r) {
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
        (m) => {
          var f;
          return m !== s.id && ((f = r[m]) == null ? void 0 : f.includes(s.id));
        }
      )
    ) : []
  };
}
function Co({
  videos: e,
  review: t,
  trees: r,
  disabled: o,
  onChoose: a
}) {
  var m, f, y;
  const d = new Set(
    (((m = t.presentation) == null ? void 0 : m.binParents) ?? []).flatMap(
      (E) => (r[E] ?? []).filter((N) => N !== E)
    )
  ), s = /* @__PURE__ */ new Map();
  for (const E of e)
    for (const N of E.tags ?? [])
      if (d.has(N.id)) {
        const b = s.get(N.id) ?? { name: N.name, count: 0 };
        b.count++, s.set(N.id, b);
      }
  return (y = (f = t.presentation) == null ? void 0 : f.binParents) != null && y.length ? /* @__PURE__ */ u("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...s].sort((E, N) => E[1].name.localeCompare(N[1].name)).map(([E, N]) => /* @__PURE__ */ u(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: o,
        onClick: () => a(E),
        children: [
          N.name,
          " (",
          N.count,
          ")"
        ]
      },
      E
    )),
    !s.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function No(e, t) {
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
function An({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: o = !0
}) {
  const [a, d] = S(!1), s = pe(e) === "tag" ? "tag" : "video", m = e.view.filter, f = s === "tag" ? Ln : Jr, y = (b) => t({
    ...e,
    view: { ...e.view, filter: { ...m, ...b } }
  }), E = s === "video" ? e.presentation ?? {} : {}, N = (b) => t({ ...e, presentation: { ...E, ...b } });
  return /* @__PURE__ */ u(Re, { children: [
    o && /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ u("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(m.q ?? ""),
            onChange: (b) => y({ q: b.target.value })
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
              value: String(m.sort ?? "date"),
              onChange: (b) => y({ sort: b.target.value, sorts: void 0 }),
              children: [
                !f.some((b) => b.value === m.sort) && m.sort != null && /* @__PURE__ */ n("option", { value: String(m.sort), children: String(m.sort) }),
                f.map((b) => /* @__PURE__ */ n("option", { value: b.value, children: b.label }, b.value))
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
              value: String(m.direction ?? "desc"),
              onChange: (b) => y({ direction: b.target.value }),
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
              value: Number(m.perPage) || 40,
              onChange: (b) => y({
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
          criteria: s === "tag" ? $n : hr,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: s === "video",
          subjectLabel: s === "tag" ? "tags" : "videos",
          onApply: (b) => {
            t({ ...e, view: { ...e.view, objectFilter: b } }), d(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ u(Re, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ u("p", { className: "dq-editor-note", children: [
        "Choose how ",
        s === "tag" ? "tags" : "videos and tags",
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ u("div", { className: "dq-field-grid", children: [
        pe(e) === "video" && /* @__PURE__ */ u("label", { children: [
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
        pe(e) !== "performerOccurrence" && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
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
      s === "video" && /* @__PURE__ */ u(Re, { children: [
        /* @__PURE__ */ n("h4", { children: "Card annotations" }),
        /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((b) => {
          const I = E.annotations ?? [];
          return /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: I.includes(b),
                onChange: (P) => N({
                  annotations: P.target.checked ? [...I, b] : I.filter((k) => k !== b)
                })
              }
            ),
            b
          ] }, b);
        }) }),
        (E.annotations ?? []).includes("tags") && /* @__PURE__ */ u(Re, { children: [
          /* @__PURE__ */ n("h4", { children: "Card tag bins" }),
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected. This setting is separate from the queue filters." }),
          /* @__PURE__ */ n(
            lt,
            {
              entityType: "tag",
              values: E.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (b) => N({ annotationParents: b }),
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
            values: E.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (b) => N({ binParents: b }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const Fr = 180, Ao = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function si({ entityType: e }) {
  return e === "tag" ? /* @__PURE__ */ n(Pi, { role: "img", "aria-label": "Tag review" }) : /* @__PURE__ */ n(Dr, { role: "img", "aria-label": e === "performerOccurrence" ? "Performer occurrence review" : "Video review" });
}
function Tn(e) {
  return pe(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Rn(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Lr() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function qn(e) {
  const t = new URLSearchParams(window.location.search);
  Er.forEach((o) => t.delete(o)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function To(e) {
  return Te({ ...e, page: 1 });
}
function li(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function ze(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const ci = "data-quality.workspace-layout.v1", Xr = 240, Gr = 192, Br = 560;
function di(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(Br, Math.max(Gr, e)) : Xr;
}
function Ro() {
  try {
    const e = JSON.parse(
      localStorage.getItem(ci) ?? "null"
    );
    return di(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return Xr;
  }
}
function qo(e) {
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
function ko(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : fi(e, t);
}
function Io({
  onNavigate: e
}) {
  const [t, r] = S([]), [o] = S(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [a, d] = S(""), [s, m] = S(!0), [f, y] = S(""), [E, N] = S(!1), [b, I] = S(!1), [P, k] = S(!1), [q, G] = S([]), [T, oe] = S(""), [ve, Pe] = S(!0), [g, M] = S(""), [w, j] = S(""), [re, Ne] = S(!1), [de, ar] = S(!1), [ue, qt] = S(Lr), [Ue, ct] = S({}), [Se, kt] = S("name"), [le, It] = S("asc"), ke = O(null), He = O(!1), [et, wt] = S(0), [Y, vt] = S(!1), [Fe, ge] = S(!1), [Z, me] = S(
    null
  ), B = t.find((i) => i.id === ue) ?? null, C = Rt(
    () => (Z == null ? void 0 : Z.id) === ue && B ? { ...B, view: {
      ...B.view,
      filter: Z.view.filter,
      objectFilter: Z.view.objectFilter,
      searchMode: Z.view.searchMode,
      startFrom: Z.view.startFrom
    } } : B,
    [Z, ue, B]
  ), J = C ? pe(C) : "video", $ = J === "video" ? C : null, [Xe, tt] = S(null), Jt = (Xe == null ? void 0 : Xe.id) === (C == null ? void 0 : C.id) ? Xe == null ? void 0 : Xe.mode : (C == null ? void 0 : C.view.reviewMode) ?? "single", fe = J === "performerOccurrence" || J === "video" && Jt === "single", [dt, ut] = S(0), St = O(-1), Ot = O(!1);
  V(() => {
    const i = () => {
      if (!fe && ae.current) {
        Ot.current = !0;
        return;
      }
      qt(Lr()), fe || ut((c) => c + 1);
    };
    return window.addEventListener("popstate", i), () => window.removeEventListener("popstate", i);
  }, [fe]);
  const Mt = J === "tag" ? b : E, Pt = Rt(() => {
    const i = le === "asc" ? 1 : -1;
    return [...t].sort((c, h) => {
      if (Se === "count") {
        const v = Ue[c.id], L = Ue[h.id], A = typeof v == "number", F = typeof L == "number";
        if (A !== F) return A ? -1 : 1;
        if (A && F && v !== L)
          return (v - L) * i;
      }
      return c.name.localeCompare(h.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * i;
    });
  }, [le, Se, Ue, t]), ft = O(
    null
  ), je = So($), [ne, Ft] = S({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [pt, Qt] = S({
    page: 1,
    perPage: 40
  }), [Ee, Ke] = S({ items: [], totalCount: 0 }), [K, Et] = S(!1), [ce, rt] = S(""), [Le, Lt] = S(!1), [$t, Wt] = S(!1), [he, $e] = S(() => /* @__PURE__ */ new Set()), xe = O(he);
  xe.current = he;
  const nt = O(/* @__PURE__ */ new Map()), xt = (C == null ? void 0 : C.view.selectAllOnLoad) === !0, [ye, Ae] = S(null), Ie = O(ye);
  Ie.current = ye;
  const [W, qe] = S(!1), Oe = O(W);
  Oe.current = W;
  const l = O(null), [p, R] = S("grid"), [x, _] = S(Fr), [z, it] = S(Ro), [D, Ve] = S(!1), ae = O(!1), [_e, Ce] = S(""), [gt, H] = S(""), [De, ot] = S(""), [ee, zt] = S(null), [sr, mt] = S(""), [ht, be] = S(!1), [Ht, Yr] = S({}), [Zr, en] = S({}), Xt = O(/* @__PURE__ */ new Map()), tn = O(null), Cr = O(null), lr = O(null), _t = O(0), cr = O(0), dr = O(null), Ct = O(!1), rn = JSON.stringify([
    ...new Set(
      ($ == null ? void 0 : $.actions.flatMap(
        (i) => i.steps.flatMap((c) => c.tagIds)
      )) ?? []
    )
  ]);
  function Nr(i) {
    const c = di(i);
    it(c), qo(c);
  }
  function mi(i) {
    const c = i.shiftKey ? 40 : 16;
    let h = null;
    i.key === "ArrowLeft" && (h = z + c), i.key === "ArrowRight" && (h = z - c), i.key === "Home" && (h = Gr), i.key === "End" && (h = Br), h !== null && (i.preventDefault(), i.stopPropagation(), Nr(h));
  }
  V(() => {
    if (!gt) return;
    const i = window.setTimeout(() => H(""), 4e3);
    return () => window.clearTimeout(i);
  }, [gt]), V(() => {
    const i = JSON.parse(rn);
    if (en({}), !i.length) return;
    const c = new AbortController();
    let h = !0;
    return Promise.all(
      i.map(async (v) => {
        var L;
        try {
          const A = await Q(`/api/tags/${v}`, {
            signal: c.signal
          });
          return [v, ((L = A.name) == null ? void 0 : L.trim()) || null];
        } catch {
          return [v, null];
        }
      })
    ).then((v) => {
      h && en(Object.fromEntries(v));
    }), () => {
      h = !1, c.abort();
    };
  }, [rn]), V(() => {
    const i = $ ? ni($.view.objectFilter) : [];
    if (Yr({}), !i.length) return;
    const c = new AbortController();
    let h = !0;
    return Promise.all(
      i.map(async (v) => {
        var L;
        try {
          const A = await Q(`/api/tags/${v}`, {
            signal: c.signal
          });
          return (L = A.name) != null && L.trim() ? [String(v), A.name] : null;
        } catch {
          return null;
        }
      })
    ).then((v) => {
      h && Yr(
        Object.fromEntries(v.filter((L) => L !== null))
      );
    }), () => {
      h = !1, c.abort();
    };
  }, [$ == null ? void 0 : $.id, $ == null ? void 0 : $.view.objectFilter]);
  const Ar = Rt(
    () => $ ? ii(
      $.view.objectFilter,
      Ht
    ) : (C == null ? void 0 : C.view.objectFilter) ?? {},
    [Ht, C, $]
  ), hi = Rt(
    () => J === "video" && Array.isArray(Ar.customFieldCriteria) ? [...hr, Ao] : J === "tag" ? $n : hr,
    [J, Ar.customFieldCriteria]
  ), nn = Tt(async () => {
    m(!0), y("");
    try {
      const i = await Bi();
      r(i.reviews), d(i.storageKey), N(i.canWriteVideos ?? i.canWrite), I(i.canWriteTags ?? !1), k(i.canReadTagGroups ?? !1), Pe(i.canConfigure ?? !0), M(i.storageNotice ?? ""), ue && !i.reviews.some((c) => c.id === ue) && (qt(""), qn(""));
    } catch (i) {
      y(
        i instanceof Error ? i.message : "Could not load reviews."
      );
    } finally {
      m(!1);
    }
  }, [ue]);
  V(() => {
    if (!P) {
      G([]), oe("");
      return;
    }
    const i = new AbortController();
    return oe(""), Zi(i.signal).then(G).catch((c) => {
      i.signal.aborted || oe(
        c instanceof Error ? c.message : "Could not load tag groups."
      );
    }), () => i.abort();
  }, [P]), V(() => {
    nn();
  }, []), V(() => {
    if (ue || t.length === 0) return;
    const i = new AbortController();
    ct({});
    for (const c of t)
      (c.entityType === "performerOccurrence" ? ei(c, i.signal).then((v) => (v == null ? void 0 : v.length) === 0 ? { items: [], totalCount: 0 } : tr(ti(c, v), { ...c.view.filter, page: 1, perPage: 1 }, i.signal)) : pe(c) === "tag" ? wn(
        c,
        Te({ ...c.view.filter, page: 1, perPage: 1 }),
        i.signal
      ) : tr(
        c,
        Te({ ...c.view.filter, page: 1, perPage: 1 }),
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
  }, [ue, t]), On(() => {
    var i;
    ue || s || !He.current || (He.current = !1, (i = ke.current) == null || i.focus());
  }, [ue, s]);
  const ur = Tt(async () => {
    mt("");
    try {
      zt(await zr());
    } catch (i) {
      zt(null), mt(
        "Tag assessment setup could not be checked. " + (i instanceof Error ? i.message : "Request failed.")
      );
    }
  }, []);
  V(() => {
    ur();
  }, [ur]);
  const Nt = Tt(
    async (i, c, h = !1, v = !1) => {
      var ie;
      const L = ++_t.current;
      (ie = dr.current) == null || ie.abort();
      const A = new AbortController();
      dr.current = A, c = Te(c);
      const F = Number(c.page);
      h && (c = { ...c, page: 1 }), Ft(c), Wt(h), Et(!0), rt("");
      try {
        const U = (at) => pe(i) === "tag" ? wn(
          i,
          at,
          A.signal
        ) : tr(
          i,
          at,
          A.signal
        );
        let se = await U(c);
        const Ge = Math.max(
          1,
          Math.ceil(se.totalCount / Number(c.perPage))
        ), Be = h ? Ge : Math.min(F, Ge);
        return Number(c.page) !== Be && (c = { ...c, page: Be }, se = await U(c)), L === _t.current && (Ke(se), v && yt(
          () => new Set(se.items.map((at) => at.id))
        ), Ft(c), Qt(c)), se;
      } catch (U) {
        throw L === _t.current && rt(
          U instanceof Error ? U.message : "Could not load the review queue."
        ), U;
      } finally {
        L === _t.current && Et(!1);
      }
    },
    []
  );
  V(() => {
    var c;
    if (cr.current += 1, St.current = -1, _t.current += 1, (c = dr.current) == null || c.abort(), ar(!1), j(""), Ne(!1), $e(/* @__PURE__ */ new Set()), nt.current.clear(), Ae(null), qe(!1), Ve(!1), ae.current = !1, Ce(""), H(""), ot(""), Ke({ items: [], totalCount: 0 }), Lt(!1), !C || fe) {
      Et(!1);
      return;
    }
    let i = !0;
    return Et(!0), (async () => {
      let h = B ?? C;
      me(null);
      let v = null;
      const L = new URLSearchParams(window.location.search);
      if (pe(C) === "video" && Er.some((U) => L.has(U)))
        try {
          const U = h;
          v = Vr(U, L);
          const se = Ze(U, v.query);
          (v.query.startFrom !== (U.view.startFrom ?? "end") || !nr(
            JSON.parse(Ye(se)),
            JSON.parse(Ye(Ze(U, Kt(U))))
          )) && (h = se, me(h));
        } catch (U) {
          Lt(!0), rt(U instanceof Error ? U.message : "Could not read review URL."), Et(!1);
          return;
        }
      let A = null;
      try {
        A = await Wi(a, C.id);
      } catch (U) {
        i && (Ne(!0), j(
          U instanceof Error ? U.message : "Could not load progress."
        ));
      }
      if (!i) return;
      const F = (A == null ? void 0 : A.signature) === Ye(h) ? A : null, ie = v ? v.query.filter : F ? Te(F.filter) : To(h.view.filter);
      Ft(ie), R(
        F ? Rn(F.displayMode, pe(C)) : Tn(C)
      ), _(
        F ? F.cardSize ?? Fr : Fr
      );
      try {
        const U = await Nt(
          h,
          ie,
          v ? v.startAtEnd : !F && h.view.startFrom !== "beginning",
          h.view.selectAllOnLoad === !0
        );
        if (!i) return;
        const se = gn(
          U.items.map((Ge) => Ge.id),
          (F == null ? void 0 : F.focusedId) ?? null,
          (F == null ? void 0 : F.index) ?? 0
        );
        Ae(se), we(se);
      } catch {
      }
      i && (St.current = dt, ar(!0));
    })(), () => {
      var h;
      i = !1, cr.current++, _t.current++, (h = dr.current) == null || h.abort();
    };
  }, [C == null ? void 0 : C.id, fe, dt]), V(() => {
    !$ || fe || !de || K || ce || D || Ot.current || St.current !== dt || rr($.id, {
      filter: ne,
      objectFilter: $.view.objectFilter,
      searchMode: $.view.searchMode,
      startFrom: $.view.startFrom ?? "end"
    });
  }, [$, fe, de, K, ce, ne, D, dt]);
  const X = Rt(
    () => Ee.items.map((i) => i.id),
    [Ee.items]
  );
  V(() => {
    if (!de || !C || !a || K || ce || D || (Z == null ? void 0 : Z.id) === C.id || re)
      return;
    const i = {
      version: 1,
      signature: Ye(C),
      filter: ne,
      focusedId: ye,
      index: Math.max(0, X.indexOf(ye ?? -1)),
      displayMode: p,
      cardSize: x,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        a + ":progress:" + C.id,
        JSON.stringify(i)
      );
    } catch {
    }
    if (w) return;
    let c = !0;
    const h = window.setTimeout(() => {
      zi(a, C.id, i).catch((v) => {
        c && j(
          "Progress is kept in this browser, but account sync failed. " + (v instanceof Error ? v.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      c = !1, window.clearTimeout(h);
    };
  }, [
    de,
    a,
    C,
    K,
    ce,
    D,
    ne,
    ye,
    X,
    p,
    x,
    Z,
    w,
    re
  ]);
  const yi = Ee.items.find((i) => i.id === ye) ?? null, Tr = J === "video" ? yi : null;
  W && Tr && (l.current = Tr);
  const At = Tr ?? (W ? l.current : null), bi = mn(he, ye), wi = X.length > 0 && X.every((i) => he.has(i)), Rr = he.size > 0 ? `${he.size} selected ${J}${he.size === 1 ? "" : "s"}` : ye == null ? `no ${J}` : `focused ${J}`, we = Tt((i, c = !0) => {
    i != null && window.requestAnimationFrame(() => {
      const h = Xt.current.get(i);
      h == null || h.focus({ preventScroll: !0 }), c && (h == null || h.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  V(() => {
    de && !Oe.current && we(Ie.current);
  }, [de, we]), V(() => {
    K || !X.length || (Ie.current == null || !X.includes(Ie.current)) && (Ae(X[0]), Oe.current || we(X[0]));
  }, [we, X, K]);
  const yt = Tt(
    (i) => {
      $e((c) => {
        const h = i(c);
        for (const v of /* @__PURE__ */ new Set([...c, ...h]))
          c.has(v) !== h.has(v) && nt.current.set(
            v,
            (nt.current.get(v) ?? 0) + 1
          );
        return h;
      });
    },
    []
  ), qr = Tt(
    (i) => {
      if (!X.length) return;
      const c = Math.max(
        0,
        X.indexOf(Ie.current ?? X[0])
      ), h = X[Math.max(0, Math.min(X.length - 1, c + i))];
      Ae(h), Oe.current || we(h);
    },
    [we, X]
  ), kr = Tt(
    async (i) => {
      const c = "steps" in i ? i.steps.length > 0 : i.effect.mode !== "SKIP", h = "effect" in i && i.effect.mode === "SET_TAG_GROUP" ? i.effect.tagGroupId : null, v = h != null && (!P || !q.some((te) => te.id === h)), L = "effect" in i && c && !P, A = mn(
        xe.current,
        Ie.current
      );
      if (!C || ae.current || K || ce) return;
      const F = c && !Mt ? `${J === "tag" ? "Tag" : "Video"} write permission is required to apply ${i.label}.` : L || v ? `${i.label} needs a tag group that is unavailable.` : br(i) && (ee == null ? void 0 : ee.kind) !== "ready" ? `Set up tag assessments before applying ${i.label}.` : A.length ? "" : `Select or focus a ${J} before applying ${i.label}.`;
      if (F) {
        ot(F);
        return;
      }
      const ie = ++cr.current, U = C.id, se = [...X], Ge = Ee, Be = Ie.current, at = new Set(xe.current), ln = new Map(
        A.map((te) => [te, nt.current.get(te) ?? 0])
      ), Dt = () => ie === cr.current && C.id === U;
      ae.current = !0, Ve(!0), Ce(
        xe.current.size ? `${A.length} selected ${J}s` : `the focused ${J}`
      ), H(""), ot("");
      const cn = Ge.items.filter(
        (te) => !A.includes(te.id)
      ), Ri = cn.map((te) => te.id), dn = hn(
        se,
        Ri,
        Be,
        A.includes(Be ?? -1)
      );
      Ke({
        items: cn,
        totalCount: Ge.totalCount
      }), $e((te) => {
        const Me = new Set(te);
        for (const Je of A) Me.delete(Je);
        return Me;
      }), Ae(dn), Oe.current || we(dn);
      let Or = !1;
      try {
        if ("effect" in i ? await so(i, A) : await Zn(i, A), Or = !0, !Dt()) return;
        $e((te) => {
          const Me = new Set(te);
          for (const Je of A)
            (nt.current.get(Je) ?? 0) === ln.get(Je) && Me.delete(Je);
          return Me;
        }), H(
          `${i.label}: ${A.length} ${J}${A.length === 1 ? "" : "s"} ${c ? "updated" : "skipped"}.`
        );
      } catch (te) {
        if (!Dt()) return;
        Ke(Ge), $e((Me) => {
          const Je = new Set(Me);
          for (const Qe of A)
            at.has(Qe) && (nt.current.get(Qe) ?? 0) === ln.get(Qe) && Je.add(Qe);
          return Je;
        }), Ae(Be), Oe.current || we(Be), ot(
          te instanceof Error ? te.message : "Action failed."
        );
      }
      try {
        if (await no(i), !Dt()) return;
        const te = new Set(A), Me = xt && se.length > 0 && se.every((st) => te.has(st)), Je = await Nt(C, ne, !1, Me);
        if (!Dt()) return;
        let Qe = Je.items.map((st) => st.id);
        if (!Qe.length && Je.totalCount > 0 && Number(ne.page) > 1) {
          const st = Math.max(1, Number(ne.page) - 1), pr = { ...ne, page: st };
          Ft(pr), Qe = (await Nt(
            C,
            pr,
            !1,
            Me
          )).items.map((Mr) => Mr.id), $e(
            (Mr) => new Set([...Mr].filter((qi) => Qe.includes(qi)))
          );
          const fn = Qe.at(-1) ?? null;
          Ae(fn), Oe.current || we(fn);
        } else {
          $e(
            (pr) => new Set([...pr].filter((un) => Qe.includes(un)))
          );
          const st = hn(
            se,
            Qe,
            Be,
            Or && A.includes(Be ?? -1)
          );
          Ae(st), Oe.current && st == null && qe(!1), Oe.current || we(st);
        }
      } catch (te) {
        Dt() && ot(
          (Me) => `${Me ? `${Me} ` : ""}${Or ? "The action completed, but " : ""}the queue could not be refreshed. ${te instanceof Error ? te.message : "Refresh failed."}`
        );
      } finally {
        Dt() && (ae.current = !1, Ve(!1), Ce(""), Ot.current && (Ot.current = !1, qt(Lr()), ut((te) => te + 1)));
      }
    },
    [
      Mt,
      P,
      q,
      J,
      ee,
      Nt,
      ne,
      we,
      X,
      Ee,
      K,
      ce,
      C
    ]
  );
  function vi() {
    var h;
    if (p === "list") return 1;
    const i = (h = tn.current) == null ? void 0 : h.firstElementChild, c = i ? getComputedStyle(i).gridTemplateColumns : "";
    return Math.max(1, c.split(" ").filter(Boolean).length);
  }
  const on = O(() => {
  });
  on.current = (i) => {
    var F;
    if (fe || i.defaultPrevented || i.repeat || i.ctrlKey || i.altKey || i.metaKey || Y) return;
    const c = i.target, h = c instanceof Node && ((F = Cr.current) == null ? void 0 : F.contains(c)) === !0, v = c === document.body || c === document.documentElement;
    if (!h && !v) return;
    if (W && i.key === "Escape") {
      ze(i), qe(!1), we(Ie.current);
      return;
    }
    if (!Di(c)) return;
    const L = Jn(c);
    if (i.key === "Escape") {
      ze(i), yt(() => /* @__PURE__ */ new Set());
      return;
    }
    const A = (C == null ? void 0 : C.actions.findIndex(
      (ie, U) => bt(ie, U) === i.key.toLowerCase()
    )) ?? -1;
    if (A >= 0 && (C != null && C.actions[A])) {
      ze(i), !D && !K && kr(C.actions[A]);
      return;
    }
    if (!W && i.key === " " && L) {
      ze(i), ye != null && yt((ie) => mr(ie, ye));
      return;
    }
    if (!W && i.key.toLowerCase() === "a") {
      ze(i), yt(
        (ie) => yn(ie, X)
      );
      return;
    }
    if (!(D || K) && !W && i.key === "Enter" && ye != null && L) {
      ze(i), J === "tag" ? window.open(`/tag/${ye}`, "_blank", "noopener,noreferrer") : qe(!0);
      return;
    }
  }, V(() => {
    const i = (c) => on.current(c);
    return document.addEventListener("keydown", i), () => document.removeEventListener("keydown", i);
  }, []);
  const an = O(
    () => {
    }
  );
  an.current = (i) => {
    var A;
    if (fe || Y || W || D || K || !X.length || i.defaultPrevented || i.repeat || i.ctrlKey || i.altKey || i.metaKey)
      return;
    const c = i.target, h = c instanceof Node && ((A = Cr.current) == null ? void 0 : A.contains(c)) === !0, v = c === document.body || c === document.documentElement;
    if (!h && !v || !i.key.startsWith("Arrow") || !Ui(c)) return;
    const L = ji(i.key, vi());
    L && (i.preventDefault(), h ? i.stopImmediatePropagation() : i.stopPropagation(), qr(L));
  }, V(() => {
    const i = (c) => an.current(c);
    return document.addEventListener("keydown", i), () => document.removeEventListener("keydown", i);
  }, []);
  function Yt(i) {
    tt(null), wt(0), qt(i), qn(i);
  }
  function Si() {
    He.current = !0, ct({}), Yt("");
  }
  async function Ir(i) {
    if (!a) return !1;
    const c = i.map(Mo);
    try {
      await Qi(a, c);
    } catch (v) {
      throw v;
    }
    r(c), ue && !c.some((v) => v.id === ue) && Yt("");
    const h = c.find((v) => v.id === ue);
    return h && tt(null), h && B && JSON.stringify(h) !== JSON.stringify(B) && (h.view.displayMode !== B.view.displayMode && R(Tn(h)), Ye(h) !== Ye(B) && (me(null), pe(h) === "video" && rr(h.id, {
      filter: Te(h.view.filter),
      objectFilter: h.view.objectFilter,
      searchMode: h.view.searchMode,
      startFrom: h.view.startFrom ?? "end"
    }), fe || fr(
      h,
      Te({ ...h.view.filter, page: ne.page })
    ))), !0;
  }
  if (s)
    return /* @__PURE__ */ n(kn, { label: "Loading reviews…" });
  if (f)
    return /* @__PURE__ */ u(Re, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void jo().catch(
            (i) => y(
              "Could not export browser reviews. " + (i instanceof Error ? i.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        In,
        {
          message: f,
          onRetry: () => void nn()
        }
      )
    ] });
  return /* @__PURE__ */ u("div", { ref: Cr, className: "data-quality-page", children: [
    /* @__PURE__ */ u("header", { className: "data-quality-header", children: [
      C && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: D,
          onClick: Si,
          children: /* @__PURE__ */ n(_n, {})
        }
      ),
      /* @__PURE__ */ u("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (C == null ? void 0 : C.name) ?? "Data Quality" }),
        (C == null ? void 0 : C.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: C.description })
      ] }),
      C && B && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: D || K || !ve,
          onClick: () => {
            fe ? wt((i) => i + 1) : (ge(!0), vt(!0));
          },
          children: /* @__PURE__ */ n(Dn, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: D || K || !ve,
          onClick: () => {
            ge(!1), vt(!0);
          },
          children: /* @__PURE__ */ n(Mi, {})
        }
      )
    ] }),
    g && /* @__PURE__ */ n("p", { className: "dq-status", children: g }),
    $ && (ee == null ? void 0 : ee.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      ee.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: ht,
          onClick: () => {
            be(!0), mt(""), oo().then(ur).catch(
              (i) => mt(
                "Could not create the Confirmed absent tags custom field. " + (i instanceof Error ? i.message : "Request failed.")
              )
            ).finally(() => be(!1));
          },
          children: ht ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    $ && ((ee == null ? void 0 : ee.kind) === "incompatible" || sr) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(_r, {}),
      sr || (ee == null ? void 0 : ee.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: ht,
          onClick: () => {
            be(!0), ur().finally(
              () => be(!1)
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
            ), h = document.createElement("a");
            h.href = c, h.download = "data-quality-unassigned-legacy-reviews.json", h.click(), URL.revokeObjectURL(c);
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
            j(""), Ne(!1);
          },
          children: re ? "Start fresh progress" : "Retry progress sync"
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
          disabled: D || K || Y,
          onChange: (i) => tt({ id: $.id, mode: i.target.value }),
          children: [
            /* @__PURE__ */ n("option", { value: "single", children: "Single video" }),
            /* @__PURE__ */ n("option", { value: "multiple", children: "Multiple videos" })
          ]
        }
      )
    ] }),
    C && B && !fe && /* @__PURE__ */ u("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${D || K ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": D || K || void 0,
          inert: D || K ? !0 : void 0,
          onClickCapture: (i) => {
            var h, v, L, A, F;
            const c = i.target instanceof Element ? i.target.closest("button") : null;
            (c == null ? void 0 : c.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((h = c == null ? void 0 : c.textContent) == null ? void 0 : h.trim()) === "Clear all" ? Ct.current = !0 : ((v = c == null ? void 0 : c.getAttribute("aria-label")) != null && v.startsWith("Filters") || (L = c == null ? void 0 : c.getAttribute("aria-label")) != null && L.startsWith("Edit filter:") || ((A = c == null ? void 0 : c.textContent) == null ? void 0 : A.trim()) === "Cancel" || (F = c == null ? void 0 : c.getAttribute("aria-label")) != null && F.startsWith("Close ")) && (Ct.current = !1);
          },
          onKeyDownCapture: (i) => {
            var h, v;
            const c = i.target instanceof Element ? i.target.closest("button") : null;
            (i.key === "Delete" || i.key === "Backspace") && (c == null ? void 0 : c.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (i.preventDefault(), i.stopPropagation(), Ct.current = !0, (v = (h = c.parentElement) == null ? void 0 : h.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || v.click()) : i.key === "Escape" && (Ct.current = !1);
          },
          children: /* @__PURE__ */ n(
            $r,
            {
              filter: ce ? pt : ne,
              onFilterChange: Ei,
              totalCount: Ee.totalCount,
              sortOptions: J === "tag" ? Ln : Jr,
              showSearch: !0,
              showSort: !0,
              displayMode: p,
              onDisplayModeChange: (i) => R(Rn(i, J)),
              availableDisplayModes: J === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (x - 225) / 50,
              onZoomChange: (i) => _(Math.round(225 + i * 50)),
              cardSizeEntityType: J === "tag" ? "tags" : "videos",
              criteriaDefinitions: hi,
              objectFilter: Ar,
              onObjectFilterChange: (i) => {
                if (!D && !K) {
                  const c = J === "video" ? oi(i) : i;
                  ft.current = J === "video" ? ai(
                    C.view.objectFilter,
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
      (Z == null ? void 0 : Z.id) === ue && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: D || K || !ve,
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
            disabled: D || K,
            onClick: Ci,
            children: /* @__PURE__ */ n(xn, {})
          }
        )
      ] })
    ] }),
    C ? fe ? /* @__PURE__ */ n(vo, { review: C, canWrite: C.entityType === "performerOccurrence" ? b : E, onBusy: Ve, editRequest: et, renderRuleEditor: (i, c, h) => /* @__PURE__ */ n(pi, { workspace: !0, draft: i, entityTypeLocked: !0, tagGroups: q, saving: h, setDraft: (v) => c(v), onSave: () => {
    }, onCancel: () => {
    } }), onSaveDefaults: ve ? (i) => Ir(t.map((c) => c.id === i.id ? i : c)) : void 0 }, C.id) : /* @__PURE__ */ u(Re, { children: [
      $ && je.error && /* @__PURE__ */ n("p", { role: "alert", children: je.error }),
      $ && /* @__PURE__ */ n(
        Co,
        {
          videos: Ee.items,
          review: $,
          trees: je.ids,
          disabled: D || K,
          onChoose: (i) => {
            const c = No($, i);
            me(c), fr(c, { ...ne, page: 1 });
          }
        }
      ),
      De && !W && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(_r, {}),
        De
      ] }),
      gt && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: gt }),
      sn("top"),
      /* @__PURE__ */ u(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${z}px`
          },
          children: [
            /* @__PURE__ */ u("main", { children: [
              K && !Ee.items.length && /* @__PURE__ */ n(kn, { label: "Loading review queue…" }),
              ce && !K && /* @__PURE__ */ n(
                In,
                {
                  message: ce,
                  retryLabel: Le ? "Reset to review defaults" : "Retry",
                  onRetry: () => {
                    if (Le && B && pe(B) === "video") {
                      const i = Kt(B);
                      rr(B.id, { ...i, filter: { ...i.filter, page: void 0 } }), ut((c) => c + 1);
                      return;
                    }
                    Nt(
                      C,
                      ne,
                      $t,
                      xt
                    ).catch(() => {
                    });
                  }
                }
              ),
              !D && !K && !ce && !Ee.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(Dr, {}),
                /* @__PURE__ */ u("p", { children: [
                  "No ",
                  J,
                  "s match this review."
                ] })
              ] }),
              !!Ee.items.length && /* @__PURE__ */ n("div", { ref: tn, children: /* @__PURE__ */ n(
                "div",
                {
                  className: p === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${x}px`
                  },
                  children: Ee.items.map(Ti)
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
                  lr.current = {
                    pointerId: i.pointerId,
                    startX: i.clientX,
                    startWidth: z
                  }, i.currentTarget.setPointerCapture(i.pointerId);
                },
                onPointerMove: (i) => {
                  const c = lr.current;
                  (c == null ? void 0 : c.pointerId) === i.pointerId && i.currentTarget.hasPointerCapture(i.pointerId) && Nr(
                    c.startWidth + c.startX - i.clientX
                  );
                },
                onPointerUp: () => {
                  lr.current = null;
                },
                onPointerCancel: () => {
                  lr.current = null;
                },
                onKeyDown: mi,
                onDoubleClick: () => Nr(Xr),
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
                    (i) => yn(i, X)
                  ),
                  children: [
                    wi ? "Clear selection" : "Select all on page",
                    /* @__PURE__ */ n("kbd", { "aria-hidden": "true", children: "A" })
                  ]
                }
              ),
              /* @__PURE__ */ n("strong", { children: he.size > 0 ? Rr : ye == null ? "Nothing to apply to" : `Applies to the ${Rr}` }),
              C.actions.map((i, c) => {
                const h = "steps" in i ? i.steps.length > 0 : i.effect.mode !== "SKIP", v = "effect" in i && i.effect.mode === "SET_TAG_GROUP" ? i.effect.tagGroupId : null, L = v != null ? q.find((F) => F.id === v) : void 0, A = v != null && !L;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    disabled: D || K || !!ce || h && !Mt || "effect" in i && h && (!P || A) || br(i) && (ee == null ? void 0 : ee.kind) !== "ready" || !bi.length,
                    onClick: () => void kr(i),
                    children: [
                      /* @__PURE__ */ u("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: i.label }),
                        "effect" in i ? /* @__PURE__ */ n("small", { children: i.effect.mode === "SKIP" ? "Skip" : i.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : L ? `Assign ${L.name}` : "Unavailable tag group" }) : i.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: i.steps.flatMap(
                          (F, ie) => F.tagIds.map((U, se) => {
                            const Ge = Zr[U] === void 0 ? "Tag" : Zr[U] ?? "Unavailable tag", Be = fi(F, Ge), at = ko(F, Ge);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": ui(F.mode),
                                "aria-label": at,
                                title: `Step ${ie + 1}: ${at}`,
                                children: Be
                              },
                              `${ie}-${U}-${se}`
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
              !C.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              !Mt && /* @__PURE__ */ u("p", { children: [
                J === "tag" ? "Tag" : "Video",
                " write permission is required to apply actions."
              ] }),
              J === "tag" && T && /* @__PURE__ */ u("p", { children: [
                "Tag groups are unavailable. ",
                T
              ] }),
              D && /* @__PURE__ */ u("p", { role: "status", children: [
                /* @__PURE__ */ n(jn, { className: "dq-spin" }),
                " Applying action to",
                " ",
                _e,
                "…"
              ] }),
              /* @__PURE__ */ u("p", { className: "dq-shortcuts", children: [
                "←→↑↓ move · space select · enter ",
                J === "tag" ? "open" : "preview",
                " · Q–P apply · A toggle shown · Esc clear"
              ] })
            ] })
          ]
        }
      ),
      sn("bottom")
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
                  ref: ke,
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
                    value: Se,
                    onChange: (i) => kt(
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
                  "aria-label": le === "asc" ? "Ascending" : "Descending",
                  title: le === "asc" ? "Ascending" : "Descending",
                  onClick: () => It(
                    (i) => i === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    Un,
                    {
                      className: le === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: Pt.map((i) => {
            const c = Ue[i.id], h = pe(i), v = h === "tag" ? "tag" : h === "performerOccurrence" ? "scene" : "video";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                disabled: D,
                onClick: () => Yt(i.id),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ u("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(si, { entityType: h }),
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
      $o,
      {
        video: At,
        review: $,
        targetLabel: Rr,
        pending: D,
        refreshing: K || !!ce,
        error: De,
        canWrite: E,
        assessmentReady: (ee == null ? void 0 : ee.kind) === "ready",
        selected: he.has(At.id),
        hasPrevious: X.indexOf(At.id) > 0,
        hasNext: X.indexOf(At.id) >= 0 && X.indexOf(At.id) < X.length - 1,
        onToggleSelected: () => yt((i) => mr(i, At.id)),
        onPrevious: () => qr(-1),
        onNext: () => qr(1),
        onClose: () => {
          qe(!1), we(Ie.current);
        },
        onAction: kr
      }
    ),
    Y && /* @__PURE__ */ n(
      xo,
      {
        reviews: t,
        activeReview: B,
        tagGroups: q,
        initialEdit: Fe,
        onSave: Ir,
        onChoose: Yt,
        onEditWorkspace: (i) => {
          i !== ue && Yt(i), tt({ id: i, mode: "single" }), wt((c) => c + 1), vt(!1);
        },
        onClose: () => {
          vt(!1), Fe && we(Ie.current, !1);
        }
      }
    )
  ] });
  async function fr(i, c, h = !1) {
    const v = Ie.current, L = Math.max(0, X.indexOf(v ?? -1));
    try {
      const F = (await Nt(
        i,
        c,
        h,
        i.view.selectAllOnLoad === !0
      )).items.map((U) => U.id);
      $e(
        (U) => new Set([...U].filter((se) => F.includes(se)))
      );
      const ie = gn(F, v, L);
      Ae(ie), Oe.current || we(ie, !1);
    } catch {
    }
  }
  function Ei(i) {
    const c = ft.current;
    if (ft.current = null, D || K || !C || !B) return;
    const h = c ?? C.view.objectFilter, v = nr(
      h,
      B.view.objectFilter
    ) ? B.view.objectFilter : h, L = Te({ ...i, page: 1 }), A = {
      ...C,
      view: {
        ...C.view,
        filter: L,
        objectFilter: v
      }
    }, F = Ye(A) !== Ye(B), ie = F ? A : B;
    me(F ? A : null), H(F ? "" : "Review queue defaults restored."), fr(ie, L, !0);
  }
  function Ci() {
    if (D || K || !B) return;
    ft.current = null;
    const i = Te({
      ...B.view.filter,
      page: 1
    });
    me(null), H("Review queue defaults restored."), fr(
      B,
      i,
      B.view.startFrom !== "beginning"
    );
  }
  function Ni() {
    D || K || !C || !B || !ve || Ir(
      t.map(
        (i) => i.id === ue ? {
          ...i,
          view: {
            ...C.view,
            filter: { ...ne, page: 1 }
          }
        } : i
      )
    ).then(() => {
      me(null), H("Queue saved to this review.");
    }).catch(
      (i) => ot(
        i instanceof Error ? i.message : "Could not save queue."
      )
    );
  }
  function Ai() {
    $e(/* @__PURE__ */ new Set()), nt.current.clear(), Ae(null);
  }
  function sn(i) {
    return C ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: D || K,
        "aria-label": `Review queue pagination ${i}`,
        children: /* @__PURE__ */ n(
          Pn,
          {
            filter: {
              ...ne,
              page: Number(ne.page) || 1,
              perPage: Number(ne.perPage) || 40
            },
            totalCount: Ee.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${i}`,
            onFilterChange: (c) => {
              D || K || c.page === Number(ne.page) || Oo(
                { ...ne, page: c.page },
                C,
                (h, v) => Nt(h, v, !1, xt),
                Ai
              );
            }
          }
        )
      }
    ) : null;
  }
  function Ti(i) {
    var h, v, L;
    if (J === "tag") {
      const A = i;
      return /* @__PURE__ */ n(
        Po,
        {
          tag: A,
          displayMode: p === "list" ? "list" : "grid",
          focused: A.id === ye,
          selected: he.has(A.id),
          setRef: (F) => {
            F ? Xt.current.set(A.id, F) : Xt.current.delete(A.id);
          },
          onFocus: () => Ae(A.id),
          onToggle: () => {
            yt((F) => mr(F, A.id)), we(A.id, !1);
          },
          onOpen: () => window.open(`/tag/${A.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        A.id
      );
    }
    const c = i;
    return /* @__PURE__ */ n(
      Fo,
      {
        video: Eo(c, $, je.ids),
        showTagBins: ((v = (h = $ == null ? void 0 : $.presentation) == null ? void 0 : h.annotations) == null ? void 0 : v.includes("tags")) && !!((L = $.presentation.annotationParents) != null && L.length),
        displayMode: p,
        focused: c.id === ye,
        selected: he.has(c.id),
        setRef: (A) => {
          A ? Xt.current.set(c.id, A) : Xt.current.delete(c.id);
        },
        onFocus: () => Ae(c.id),
        onToggle: () => yt((A) => mr(A, c.id)),
        onPreview: () => {
          Ae(c.id), qe(!0);
        },
        onNavigate: e
      },
      c.id
    );
  }
}
function Oo(e, t, r, o) {
  o(), r(t, e).catch(() => {
  });
}
function mr(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Mo(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Po({
  tag: e,
  displayMode: t,
  focused: r,
  selected: o,
  setRef: a,
  onFocus: d,
  onToggle: s,
  onOpen: m,
  onNavigate: f
}) {
  return /* @__PURE__ */ n(
    "article",
    {
      ref: a,
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${e.name}${o ? ", selected" : ""}`,
      onFocus: d,
      onClick: (y) => {
        d(), y.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${o ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        Ii,
        {
          tag: e,
          selected: o,
          onSelect: s,
          onClick: m,
          onNavigate: f
        }
      ) : /* @__PURE__ */ u("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "aria-label": o ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": o,
            onClick: (y) => {
              y.stopPropagation(), s();
            },
            children: o ? "✓" : ""
          }
        ),
        /* @__PURE__ */ n("button", { type: "button", className: "dq-tag-list-name", onClick: m, children: e.name }),
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
function Fo({
  video: e,
  showTagBins: t,
  displayMode: r,
  focused: o,
  selected: a,
  setRef: d,
  onFocus: s,
  onToggle: m,
  onPreview: f,
  onNavigate: y
}) {
  var k, q;
  const E = li(e), N = O(null), b = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, I = !!(b.date || b.studioName), P = !!(b.performers.length || b.tags.length);
  return On(() => {
    const G = N.current;
    if (!G) return;
    const T = G.querySelector(
      `a[href="/video/${e.id}"]`
    ), oe = G.querySelector(".card-title"), ve = `dq-card-title-${e.id}`;
    oe && (oe.id = ve), T && (T.target = "_blank", T.rel = "noreferrer", T.removeAttribute("aria-label"), T.setAttribute("aria-labelledby", ve), T.classList.add("dq-card-link"));
    const Pe = G.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    Pe && Pe.setAttribute(
      "aria-label",
      a ? `Deselect ${E}` : `Select ${E}`
    );
    const g = G.querySelector(
      'button[title="Quick View"]'
    );
    g && g.setAttribute("aria-label", `Preview ${E}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (G) => {
        N.current = G, d(G);
      },
      tabIndex: 0,
      "aria-current": o ? "true" : void 0,
      "aria-label": `${E}${a ? ", selected" : ""}`,
      onFocus: s,
      onClick: (G) => {
        s(), G.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${r} ${I ? "has-card-metadata" : "no-card-metadata"} ${P ? "has-card-footer" : "no-card-footer"} ${o ? "focused" : ""} ${a ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          Oi,
          {
            video: b,
            selected: a,
            onSelect: m,
            onNavigate: y,
            onQuickView: f,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ u("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (k = e.tags) == null ? void 0 : k.map((G) => /* @__PURE__ */ n("span", { children: G.name }, G.id)),
          !((q = e.tags) != null && q.length) && /* @__PURE__ */ n("small", { children: "No matching tags" })
        ] }),
        r === "wall" && /* @__PURE__ */ n(Lo, { video: e })
      ]
    }
  );
}
function Lo({ video: e }) {
  const t = O(null), r = O(null), [o, a] = S(!1), [d, s] = S(!1), [m, f] = S(!1);
  return V(() => {
    const y = t.current;
    if (!y || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      a(!0), s(!0);
      return;
    }
    const E = new IntersectionObserver(
      ([b]) => a(b.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), N = new IntersectionObserver(
      ([b]) => s(b.isIntersecting && b.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return E.observe(y), N.observe(y), () => {
      E.disconnect(), N.disconnect();
    };
  }, [e.id, e.files.length]), V(() => {
    if (!o) {
      f(!1);
      return;
    }
    const y = new AbortController();
    return Q(ro(e.id), {
      signal: y.signal
    }).then((E) => {
      y.signal.aborted || f(E.available === !0);
    }).catch(() => {
      y.signal.aborted || f(!1);
    }), () => y.abort();
  }, [o, e.id]), V(() => {
    const y = r.current;
    y && (d ? Promise.resolve(y.play()).catch(() => {
    }) : y.pause());
  }, [m, d]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: m && /* @__PURE__ */ n(
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
function $o({
  video: e,
  review: t,
  targetLabel: r,
  pending: o,
  refreshing: a,
  error: d,
  canWrite: s,
  assessmentReady: m,
  selected: f,
  hasPrevious: y,
  hasNext: E,
  onToggleSelected: N,
  onPrevious: b,
  onNext: I,
  onClose: P,
  onAction: k
}) {
  const q = O(null), G = O(null), T = e.files[0], oe = li(e);
  V(() => {
    var M;
    const g = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (M = q.current) == null || M.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = g;
    };
  }, []);
  function ve(g) {
    var j, re, Ne;
    if (g.key !== "Tab") return;
    const M = [
      ...((j = q.current) == null ? void 0 : j.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((de) => de.offsetParent !== null);
    if (!M.length) {
      g.preventDefault(), (re = q.current) == null || re.focus();
      return;
    }
    const w = M.indexOf(
      document.activeElement
    );
    g.shiftKey && w <= 0 ? (g.preventDefault(), (Ne = M.at(-1)) == null || Ne.focus()) : !g.shiftKey && w === M.length - 1 && (g.preventDefault(), M[0].focus());
  }
  function Pe(g) {
    if (g.defaultPrevented || g.ctrlKey || g.metaKey || g.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const M = g.key === "ArrowLeft" || g.key === "ArrowRight";
    if (g.altKey && !M) return;
    const w = G.current, j = g.currentTarget.querySelector("video");
    if (g.key === "Enter" || g.key === "Escape")
      g.repeat || P();
    else if (g.key === " " && w)
      g.repeat || w.toggle();
    else if (M && w)
      w.seekBy(
        (g.key === "ArrowLeft" ? -1 : 1) * (g.shiftKey ? 5 : g.altKey ? 10 : 60)
      );
    else if ((g.key === "," || g.key === ".") && w) {
      const re = [T == null ? void 0 : T.duration, j == null ? void 0 : j.duration].find(
        (de) => de != null && Number.isFinite(de) && de > 0
      ) ?? 0, Ne = e.parentVideoId != null ? (e.clipEndSec ?? re) - (e.clipStartSec ?? 0) : re;
      Number.isFinite(Ne) && Ne > 0 && w.seekBy((g.key === "," ? -1 : 1) * Ne * 0.1);
    } else if (g.key.toLowerCase() === "n" || g.key.toLowerCase() === "m")
      !g.repeat && !o && !a && (g.key.toLowerCase() === "n" && y && b(), g.key.toLowerCase() === "m" && E && I());
    else if (g.key === "ArrowUp" && j)
      j.volume = Math.min(1, j.volume + 0.1);
    else if (g.key === "ArrowDown" && j)
      j.volume = Math.max(0, j.volume - 0.1);
    else return;
    ze(g);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: q,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${oe}`,
      className: "dq-preview",
      onKeyDown: ve,
      onKeyDownCapture: Pe,
      onMouseDown: (g) => {
        g.target === g.currentTarget && P();
      },
      children: /* @__PURE__ */ u("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ u("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !y || o || a,
              onClick: b,
              children: /* @__PURE__ */ n(_n, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !E || o || a,
              onClick: I,
              children: /* @__PURE__ */ n(Un, {})
            }
          ),
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: oe }),
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
              onClick: N,
              disabled: a,
              children: f ? "Selected" : "Select"
            }
          ),
          /* @__PURE__ */ n(
            "a",
            {
              href: `/video/${e.id}`,
              target: "_blank",
              rel: "noreferrer",
              className: "dq-details-link",
              "aria-label": `Open ${oe} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ n(Fi, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: P,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(Kn, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: T ? /* @__PURE__ */ n(
          Fn,
          {
            autostart: !0,
            streamUrl: Yn(e.id),
            posterUrl: vn(e),
            format: T.format,
            audioCodec: T.audioCodec,
            duration: T.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (g) => (G.current = g, () => {
              G.current === g && (G.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: vn(e), alt: "" }) }),
        d && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: d }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((g, M) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: o || a || g.steps.length > 0 && !s || br(g) && !m,
            onClick: () => void k(g),
            children: [
              bt(g, M) && /* @__PURE__ */ n("kbd", { children: bt(g, M) }),
              g.label
            ]
          },
          g.id
        )) })
      ] })
    }
  );
}
function xo({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: o = !1,
  onEditWorkspace: a,
  onSave: d,
  onChoose: s,
  onClose: m
}) {
  const [f, y] = S(
    () => o && t ? structuredClone(t) : null
  ), [E, N] = S(""), [b, I] = S(!1), [P, k] = S(
    o && t != null
  ), q = O(null);
  V(() => {
    var w, j;
    const g = document.activeElement, M = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (j = (w = q.current) == null ? void 0 : w.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || j.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = M, g == null || g.focus({ preventScroll: !0 });
    };
  }, []);
  function G(g) {
    var j, re, Ne;
    if (g.defaultPrevented) {
      g.stopPropagation();
      return;
    }
    if (g.key === "Escape") {
      ze(g), b || m();
      return;
    }
    if (g.key !== "Tab") {
      g.stopPropagation();
      return;
    }
    const M = [
      ...((j = q.current) == null ? void 0 : j.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((de) => de.offsetParent !== null);
    if (!M.length) {
      ze(g), (re = q.current) == null || re.focus();
      return;
    }
    const w = M.indexOf(
      document.activeElement
    );
    g.shiftKey && w <= 0 ? (ze(g), (Ne = M.at(-1)) == null || Ne.focus()) : !g.shiftKey && w === M.length - 1 ? (ze(g), M[0].focus()) : g.stopPropagation();
  }
  function T(g, M = !!g) {
    k(M), y(
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
    ), N("");
  }
  async function oe() {
    if (b) return;
    if (!f || yr(f)) {
      N(f ? yr(f) : "Choose a review.");
      return;
    }
    const g = { ...f, name: f.name.trim() }, M = e.some((w) => w.id === g.id) ? e.map((w) => w.id === g.id ? g : w) : [...e, g];
    I(!0), N("");
    try {
      if (!await d(M)) throw new Error("Could not save reviews.");
      !e.some((w) => w.id === g.id) && g.entityType !== "tag" ? a(g.id) : (s(g.id), m());
    } catch (w) {
      N(
        "Could not save reviews. Your edits are still open. " + (w instanceof Error ? w.message : "Retry saving.")
      );
    } finally {
      I(!1);
    }
  }
  async function ve(g) {
    if (!b) {
      I(!0), N("");
      try {
        if (!await d(g)) throw new Error("Could not save reviews.");
      } catch (M) {
        N(
          M instanceof Error ? M.message : "Could not save reviews."
        );
      } finally {
        I(!1);
      }
    }
  }
  async function Pe(g) {
    var w;
    if (b) return;
    const M = (w = g.target.files) == null ? void 0 : w[0];
    if (g.target.value = "", !!M) {
      if (M.size > 2e6) {
        N("Review files must be smaller than 2 MB.");
        return;
      }
      I(!0), N("");
      try {
        const j = ir(await M.text());
        if (!await d(Ur(e, j)))
          throw new Error("Could not save reviews.");
      } catch (j) {
        N(
          j instanceof Error ? j.message : "Could not import reviews."
        );
      } finally {
        I(!1);
      }
    }
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: q,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: G,
      children: /* @__PURE__ */ u("div", { className: "dq-manager", children: [
        /* @__PURE__ */ u("header", { children: [
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: f ? e.some((g) => g.id === f.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: b,
              onClick: m,
              children: /* @__PURE__ */ n(Kn, {})
            }
          )
        ] }),
        E && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: E }),
        /* @__PURE__ */ n("fieldset", { disabled: b, className: "dq-manager-content", children: f ? /* @__PURE__ */ n(
          pi,
          {
            setup: f.entityType !== "tag" && !e.some((g) => g.id === f.id),
            draft: f,
            entityTypeLocked: P,
            tagGroups: r,
            saving: b,
            setDraft: y,
            onSave: () => void oe(),
            onCancel: m
          }
        ) : /* @__PURE__ */ u(Re, { children: [
          /* @__PURE__ */ u("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: () => {
              const g = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), M = document.createElement("a");
              M.href = g, M.download = "data-quality-reviews.json", M.click(), URL.revokeObjectURL(g);
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
                  onChange: Pe
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((g) => /* @__PURE__ */ u("article", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ u("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(si, { entityType: pe(g) }),
                /* @__PURE__ */ n("strong", { children: g.name })
              ] }),
              /* @__PURE__ */ n("p", { children: g.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => g.entityType === "tag" || pe(g) === "video" && g.view.reviewMode === "multiple" ? T(g) : a(g.id), children: [
              /* @__PURE__ */ n(Dn, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => T({
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
                  window.confirm(`Delete review “${g.name}”?`) && ve(
                    e.filter((M) => M.id !== g.id)
                  );
                },
                children: /* @__PURE__ */ n(Vn, {})
              }
            )
          ] }, g.id)) })
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
  onSave: m,
  onCancel: f
}) {
  const [y, E] = S("Review"), N = pe(r), b = (k) => {
    if (!(o || k === N)) {
      if (k === "performerOccurrence") {
        s({
          id: r.id,
          entityType: k,
          name: r.name,
          description: r.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end" },
          actions: [],
          occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: !0 }
        });
        return;
      }
      s(
        k === "tag" ? {
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
  }, I = O(/* @__PURE__ */ new WeakMap()), P = (k) => {
    let q = I.current.get(k);
    return q || (q = crypto.randomUUID(), I.current.set(k, q)), q;
  };
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      ki,
      {
        tabs: (t ? ["Review"] : e ? ["Review", ...N === "video" ? ["Appearance"] : [], "Actions", ...N === "performerOccurrence" ? ["Tag choices"] : []] : N === "performerOccurrence" ? ["Review", "Queue", "Actions", ...r.occurrence.tagIds.length ? ["Tag choices"] : []] : ["Review", "Queue", "Appearance", "Actions"]).map((k) => ({
          key: k,
          label: k,
          count: k === "Actions" ? r.actions.length : void 0,
          disabled: d
        })),
        activeTab: y,
        onTabChange: E
      }
    ) }),
    /* @__PURE__ */ u("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ u("section", { hidden: y !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ u("label", { children: [
          "Entity type",
          /* @__PURE__ */ u(
            "select",
            {
              "aria-label": "Entity type",
              value: N,
              disabled: o,
              onChange: (k) => b(k.target.value),
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
              onChange: (k) => s({ ...r, name: k.target.value })
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
              onChange: (k) => s({ ...r, description: k.target.value })
            }
          )
        ] })
      ] }),
      !e && !t && /* @__PURE__ */ u("section", { hidden: y !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ n(An, { draft: r, onChange: s, presentation: !1 }),
        r.entityType === "performerOccurrence" && /* @__PURE__ */ n(Nn, { review: r, onChange: s })
      ] }),
      !t && r.entityType === "performerOccurrence" && /* @__PURE__ */ n("section", { hidden: y !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n(Nn, { review: r, onChange: s, choices: !0 }) }),
      !t && (!e || N === "video") && /* @__PURE__ */ n("section", { hidden: y !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(An, { draft: r, onChange: s, queue: !1 }) }),
      !t && /* @__PURE__ */ n("section", { hidden: y !== "Actions", className: "dq-editor-section", children: N === "tag" ? /* @__PURE__ */ n(
        Do,
        {
          draft: r,
          saving: d,
          tagGroups: a,
          setDraft: s
        }
      ) : /* @__PURE__ */ n(
        _o,
        {
          draft: r,
          saving: d,
          stepKey: P,
          rememberStepKey: (k, q) => I.current.set(k, P(q)),
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
            const k = URL.createObjectURL(
              new Blob([JSON.stringify([r], null, 2)], {
                type: "application/json"
              })
            ), q = document.createElement("a");
            q.href = k, q.download = "data-quality-review.json", q.click(), URL.revokeObjectURL(k);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: f, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: m, children: t ? "Create & configure" : "Save review" })
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
function _o({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: o,
  setDraft: a
}) {
  const d = (s, m) => a({
    ...e,
    actions: e.actions.map(
      (f, y) => y === s ? m : f
    )
  });
  return /* @__PURE__ */ u(Re, { children: [
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
        renderItem: (s, { index: m, dragHandleProps: f, isOver: y }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: y ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ u("legend", { children: [
                "Action ",
                m + 1
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...f,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${m + 1}`,
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
                        ...e.actions.slice(0, m + 1),
                        {
                          ...structuredClone(s),
                          id: crypto.randomUUID(),
                          label: s.label + " copy"
                        },
                        ...e.actions.slice(m + 1)
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
                  onChange: (E) => d(m, E)
                }
              ),
              /* @__PURE__ */ n(
                xr,
                {
                  items: s.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (E) => d(m, { ...s, steps: E }),
                  renderItem: (E, N) => /* @__PURE__ */ n(
                    Uo,
                    {
                      occurrence: e.entityType === "performerOccurrence",
                      dragHandleProps: N.dragHandleProps,
                      saving: t,
                      isOver: N.isOver,
                      step: E,
                      index: N.index,
                      onChange: (b) => {
                        o(b, E), d(m, {
                          ...s,
                          steps: s.steps.map(
                            (I, P) => P === N.index ? b : I
                          )
                        });
                      },
                      onRemove: () => d(m, {
                        ...s,
                        steps: s.steps.filter(
                          (b, I) => I !== N.index
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
                    onClick: () => d(m, {
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
                        (E, N) => N !== m
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
function Do({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: o
}) {
  const a = (d, s) => o({
    ...e,
    actions: e.actions.map(
      (m, f) => f === d ? s : m
    )
  });
  return /* @__PURE__ */ u(Re, { children: [
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
        renderItem: (d, { index: s, dragHandleProps: m, isOver: f }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: f ? "dq-action-card dq-drag-over" : "dq-action-card",
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
                    ...m,
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
                  onChange: (y) => a(s, y)
                }
              ),
              /* @__PURE__ */ u("label", { children: [
                "Action effect",
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: d.effect.mode === "SET_TAG_GROUP" ? `group:${d.effect.tagGroupId}` : d.effect.mode,
                    onChange: (y) => {
                      const E = y.target.value;
                      a(s, {
                        ...d,
                        effect: E === "SKIP" ? { mode: "SKIP" } : E === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : {
                          mode: "SET_TAG_GROUP",
                          tagGroupId: Number(E.slice(6))
                        }
                      });
                    },
                    children: [
                      /* @__PURE__ */ n("option", { value: "SKIP", children: "Skip" }),
                      /* @__PURE__ */ n("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
                      d.effect.mode === "SET_TAG_GROUP" && !r.some(
                        (y) => y.id === d.effect.tagGroupId
                      ) && /* @__PURE__ */ n(
                        "option",
                        {
                          value: `group:${d.effect.tagGroupId}`,
                          disabled: !0,
                          children: "Unavailable tag group"
                        }
                      ),
                      r.map((y) => /* @__PURE__ */ n("option", { value: `group:${y.id}`, children: y.name }, y.id))
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
                      (y, E) => E !== s
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
function Uo({
  occurrence: e = !1,
  step: t,
  index: r,
  dragHandleProps: o,
  saving: a,
  isOver: d,
  onChange: s,
  onRemove: m
}) {
  const f = ui(t.mode);
  return /* @__PURE__ */ u(
    "div",
    {
      className: d ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": f,
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
            onChange: (y) => s({ ...t, mode: y.target.value }),
            children: [
              /* @__PURE__ */ n("option", { value: "ADD", children: "Add tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE", children: "Remove tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE_TREE", children: "Remove tags and descendants" }),
              !e && /* @__PURE__ */ u(Re, { children: [
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
            onChange: (y) => s({ ...t, tagIds: y }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: m, children: /* @__PURE__ */ n(Vn, {}) })
      ]
    }
  );
}
async function jo() {
  const e = await Q("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
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
function kn({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(jn, { className: "dq-spin" }),
    e
  ] });
}
function In({
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
const Qo = { components: { DataQualityPage: Io } };
export {
  Io as DataQualityPage,
  Qo as default,
  nr as objectFiltersEqual
};
