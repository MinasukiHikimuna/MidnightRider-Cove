import { jsxs as u, jsx as n, Fragment as Re } from "react/jsx-runtime";
import { useRef as M, useState as w, useMemo as Tt, useEffect as V, useCallback as At, useLayoutEffect as On } from "react";
import { DetailListToolbar as Fr, VIDEO_SORT_OPTIONS as Gr, VIDEO_CRITERIA as Br, EntityReferenceMultiSelector as st, PERFORMER_CRITERIA as pn, FilterDialog as Mn, DetailListPagination as Pn, VideoPlayer as Fn, useCustomFieldFilterSection as qi, TAG_SORT_OPTIONS as $n, TAG_CRITERIA as xn, EntityDetailTabs as ki, TagTile as Ii, VideoCard as Oi, SortableList as $r } from "@cove/runtime/components";
import { Save as Jr, RotateCcw as Ln, ChevronLeft as _n, Pencil as Dn, Settings as Mi, AlertTriangle as xr, ChevronRight as jn, Film as Lr, Loader2 as Un, Tags as Pi, ExternalLink as Fi, X as Kn, Plus as $i, Upload as xi, Trash2 as Vn, GripVertical as Qr } from "@cove/runtime/lucide-react";
import { extensionFetch as Li } from "@cove/runtime/api";
function pe(e) {
  return e.entityType ?? "video";
}
function bt(e, t) {
  return "qwertyuiop"[t] ?? "";
}
function hr(e) {
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
function Xe(e) {
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
function mr(e) {
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
function nr(e) {
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
  if (t.some((r) => hr(r)))
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
function _r(...e) {
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
function hn(e, t) {
  return e.size > 0 ? [...e].sort((r, o) => r - o) : t == null ? [] : [t];
}
function mn(e, t, r, o) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!o && t.includes(r)) return r;
  const a = Math.max(0, e.indexOf(r));
  if (o) {
    for (const c of e.slice(a + 1))
      if (t.includes(c)) return c;
    if (t.includes(r)) {
      for (const c of e.slice(0, a).reverse())
        if (t.includes(c)) return c;
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
function ji(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Ui(e, t) {
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
const Qn = "ext:com.midnightrider.data-quality:configuration", Ki = "ext:cove-data-quality:video-reviews", Dr = "ext:com.midnightrider.data-quality:progress", ir = /* @__PURE__ */ new Map(), pr = /* @__PURE__ */ new Map(), jt = (e, t) => e.includes("*") || e.includes(t), yr = (e) => J(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Vi = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function jr(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Ut(e) {
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
    reviews: nr(JSON.stringify(t.reviews)),
    deletedIds: jr(t.deletedIds),
    importedIds: jr(t.importedIds)
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
    const c = localStorage.getItem(a);
    if (c !== null) {
      const s = nr(c);
      r ?? (r = s), s.forEach((h) => o.add(h.id));
    }
    jr(
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
  const t = await J("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Wn(e, t) {
  const r = (pr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return pr.set(e, r), r.finally(() => {
    pr.get(e) === r && pr.delete(e);
  }).catch(() => {
  }), r;
}
let Yt = null;
function Bi() {
  if (Yt) return Yt;
  const e = Ji();
  return Yt = e, e.finally(() => {
    Yt === e && (Yt = null);
  }).catch(() => {
  }), e;
}
async function Ji() {
  var I;
  const e = await J("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, o = jt(e.permissions, "savedfilters.read"), a = o && jt(e.permissions, "savedfilters.write"), c = o ? (await yr(Qn)).filter((b) => b.name === "Data Quality configuration").sort((b, O) => b.id - O.id) : [];
  if (c.length > 1) {
    const b = (O) => {
      const { revision: k, ...R } = Ut(O.uiOptions);
      return JSON.stringify(R);
    };
    if (c.some((O) => b(O) !== b(c[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (a)
      for (const O of c.slice(1))
        await J(`/api/savedfilters/${O.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${O.id}` })
        });
    c.splice(1);
  }
  let s = c.length ? Ut(c[0].uiOptions) : Vi();
  const h = localStorage.getItem(`${r}:migrated`) === "true", d = localStorage.getItem(r), y = localStorage.getItem(`${r}:local-only`) === "true";
  !c.length && d && (s = Ut(d));
  let S = !c.length;
  if (c.length && y && d) {
    const b = Ut(d);
    if (b.reviews.some((k) => {
      const R = s.reviews.find((G) => G.id === k.id);
      return R && JSON.stringify(R) !== JSON.stringify(k);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const O = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...b.deletedIds])
    ];
    s = {
      ...s,
      reviews: _r(s.reviews, b.reviews).filter(
        (k) => !O.includes(k.id)
      ),
      deletedIds: O,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...b.importedIds])
      ]
    }, S = !0;
  }
  if (!h) {
    const b = JSON.stringify(s), O = Gi(t);
    if (c.length && O.reviews.some((T) => {
      const oe = s.reviews.find((we) => we.id === T.id);
      return oe && JSON.stringify(oe) !== JSON.stringify(T);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const k = o ? (await yr(Ki)).flatMap(
      (T) => nr(T.uiOptions ?? "[]")
    ) : [], R = O.known.filter(
      (T) => !O.reviews.some((oe) => oe.id === T)
    ), G = /* @__PURE__ */ new Set([...s.deletedIds, ...R]);
    s = {
      ...s,
      reviews: _r(
        O.reviews,
        s.reviews,
        k.filter(
          (T) => !O.known.includes(T.id) && !s.importedIds.includes(T.id)
        )
      ).filter((T) => !G.has(T.id)),
      deletedIds: [...G],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...O.known,
          ...k.map((T) => T.id)
        ])
      ]
    }, S || (S = JSON.stringify(s) !== b);
  }
  const E = {
    userId: t,
    recordId: (I = c[0]) == null ? void 0 : I.id,
    config: s,
    readable: o,
    writable: a,
    durable: a
  };
  if (ir.set(r, E), S && a) {
    const b = s;
    c.length && (E.config = Ut(c[0].uiOptions)), await Hn(r, b), s = E.config;
  } else c.length || (localStorage.setItem(r, JSON.stringify(s)), !o && (!h || y) && localStorage.setItem(`${r}:local-only`, "true"));
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
async function Hn(e, t) {
  const r = ir.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const o = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await zn(r), r.recordId != null) {
      const c = await J(
        `/api/savedfilters/${r.recordId}`
      );
      if (Ut(c.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const a = await J(
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
  return nr(JSON.stringify(t)), Wn(e, async () => {
    const r = ir.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const o = r.config.reviews.filter((a) => !t.some((c) => c.id === a.id)).map((a) => a.id);
    await Hn(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...o])
      ].filter((a) => !t.some((c) => c.id === a))
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
async function zi(e, t) {
  const r = ir.get(e);
  if (!r) return null;
  const o = localStorage.getItem(`${e}:progress:${t}`), a = o ? bn(o) : null;
  if (!r.readable) return a;
  const c = (await yr(Dr)).find(
    (h) => h.name === t
  ), s = c ? bn(c.uiOptions) : null;
  return a && (!s || a.updatedAt > s.updatedAt) ? a : s;
}
function Wi(e, t, r) {
  const o = `${e}:progress:${t}`;
  try {
    localStorage.setItem(o, JSON.stringify(r));
  } catch {
  }
  return Wn(o, async () => {
    const a = ir.get(e);
    if (!(a != null && a.writable)) return;
    await zn(a);
    const c = (await yr(Dr)).find(
      (s) => s.name === t
    );
    await J(
      c ? `/api/savedfilters/${c.id}` : "/api/savedfilters",
      {
        method: c ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Dr,
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
async function J(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const o = await Li(e, { ...t, headers: r });
  if (!o.ok) {
    let c = o.statusText || `Request failed (${o.status}).`;
    try {
      const s = await o.json();
      c = s.message || s.detail || s.error || c;
    } catch {
    }
    throw new Error(c);
  }
  if (o.status === 204 || o.status === 205) return;
  const a = await o.text();
  return a ? JSON.parse(a) : void 0;
}
const Xi = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Yi = 0;
function Xn(e) {
  return J(`/api/videos/${e}?dqRead=${Xi}-${++Yi}`, { cache: "no-store" });
}
async function er(e, t, r) {
  const o = { ...e.view.objectFilter }, a = o._filterExpression;
  if (delete o._filterExpression, delete o.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return J("/api/videos/find", {
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
async function vn(e, t, r) {
  const o = { ...e.view.objectFilter };
  return delete o._filterExpression, J("/api/tags/find", {
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
  return J("/api/taggroups", { signal: e });
}
function eo(e) {
  return `/api/videos/${e.id}/image?max=1280&v=${encodeURIComponent(e.updatedAt)}`;
}
function Yn(e) {
  return `/api/stream/video/${e}`;
}
function wn(e) {
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
async function wr(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const o of e) {
    await J(`/api/tags/${o}`, { signal: t }), r.add(o);
    for (let a = 1; ; a++) {
      const c = await J("/api/tags/find", {
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
      for (const s of c.items) r.add(s.id);
      if (a * 1e3 >= c.totalCount) break;
      if (!c.items.length)
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
  const t = (await J("/api/custom-fields")).find(
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
    await J("/api/custom-fields", {
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
  const o = [...e.tagIds], a = (c) => {
    if (r === null)
      throw new Error(
        `The ${vr} custom field is not available.`
      );
    return { customFields: { [r]: o }, customFieldMode: c };
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
  if (!Vt(e) || t.length === 0 || t.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  let r = null;
  if (mr(e)) {
    let d;
    try {
      d = await zr();
    } catch (y) {
      throw new Error(
        `Could not verify the ${vr} custom field. ${y instanceof Error ? y.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    r = d.definition.key;
  }
  const o = Sn(t), a = await Promise.all(
    e.steps.map(async (d) => ({
      mode: d.mode,
      tagIds: d.mode === "REMOVE_TREE" ? await wr(d.tagIds) : Sn(d.tagIds)
    }))
  ), c = (d) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(d), h = [
    ...a.filter((d) => !c(d.mode)),
    ...a.filter((d) => c(d.mode))
  ].map(
    (d) => ao(d, o, r)
  );
  for (let d = 0; d < h.length; d++)
    try {
      await J("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify(h[d])
      });
    } catch (y) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected videos before retrying. ${y instanceof Error ? y.message : "Request failed."}`
      );
    }
}
async function so(e, t) {
  if (!Vt(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await J("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
async function lo(e, t, r) {
  if (!Vt(r) || r.steps.some(
    (c) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(c.mode)
  ))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const o = await Promise.all(
    r.steps.map(async (c) => ({
      ...c,
      tagIds: c.mode === "REMOVE_TREE" ? await wr(c.tagIds) : c.tagIds
    }))
  );
  let a = t.applications;
  for (const c of o)
    a = await ri(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: c.tagIds,
          multiple: !0
        }
      },
      t,
      c.mode === "ADD" ? c.tagIds : []
    );
  return a;
}
async function ei(e, t) {
  const r = e.occurrence;
  if (r.targetMode === "all" || r.targetMode === "filter" && Object.keys(r.performerFilter).length === 0) return null;
  if (r.targetMode === "selected") return r.performerIds;
  const o = /* @__PURE__ */ new Set(), { _filterExpression: a, ...c } = r.performerFilter;
  for (let s = 1; ; s++) {
    const h = await J("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Bt({
          findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: c,
          filterExpression: a
        })
      )
    });
    if (h.items.forEach((d) => o.add(d.id)), s * 1e3 >= h.totalCount) return [...o];
    if (!h.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function ti(e, t) {
  const { _filterExpression: r, ...o } = e.view.objectFilter, a = e.occurrence, c = {
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
            { filter: { performerFilterCriterion: c } }
          ]
        }
      }
    }
  };
}
function co(e, t, r = e.conditionTagIds.map((o) => [o])) {
  const o = new Set(t), a = (c) => c.some((s) => o.has(s));
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
  const a = await er(
    ti(e, t),
    { ...e.view.filter, page: r },
    o
  ), c = t === null ? null : new Set(t), s = e.occurrence, h = a.items.length && s.includeSubtags !== !1 && !["any", "isNull"].includes(s.condition) ? await Promise.all(s.conditionTagIds.map((S) => wr([S], o))) : s.conditionTagIds.map((S) => [S]), d = new Array(a.items.length);
  let y = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, a.items.length) }, async () => {
      for (; y < a.items.length; ) {
        const S = y++, E = a.items[S], I = await J(
          `/api/tagapplications?hostType=video&hostId=${E.id}&contextType=performer`,
          { signal: o }
        );
        d[S] = E.performers.filter((b) => c === null || c.has(b.id)).flatMap((b) => {
          const O = I.filter(
            (k) => k.hostType === "video" && k.hostId === E.id && k.contextType === "performer" && k.contextId === b.id
          );
          return co(
            e.occurrence,
            O.map((k) => k.tag.id),
            h
          ) ? [
            {
              key: `${E.id}:${b.id}`,
              video: E,
              performer: b,
              applications: O
            }
          ] : [];
        });
      }
    })
  ), { items: d.flat(), totalCount: a.totalCount };
}
async function ri(e, t, r) {
  const o = new Set(e.occurrence.tagIds);
  if (r.some((d) => !o.has(d)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const a = await Xn(t.video.id);
  if (!a.performers.some(
    (d) => d.id === t.performer.id
  ))
    throw new Error(
      "This performer is no longer linked to the scene. Refresh the queue."
    );
  const c = `/api/tagapplications?hostType=video&hostId=${a.id}&contextType=performer&contextId=${t.performer.id}`, s = (await J(c)).filter(
    (d) => d.hostType === "video" && d.hostId === a.id && d.contextType === "performer" && d.contextId === t.performer.id
  ), h = new Set(r);
  try {
    for (const d of h)
      s.some((y) => y.tag.id === d) || await J("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: "video",
          hostId: a.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: d,
          sourceKey: "user"
        })
      });
    for (const d of s)
      o.has(d.tag.id) && !h.has(d.tag.id) && await J(`/api/tagapplications/${d.id}`, {
        method: "DELETE"
      });
    return await J(c);
  } catch (d) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${d instanceof Error ? d.message : "Request failed."}`
    );
  }
}
function rr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, h) => rr(s, t[h]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, o = t, a = Object.keys(r).sort(), c = Object.keys(o).sort();
  return a.length === c.length && a.every(
    (s, h) => s === c[h] && rr(r[s], o[s])
  );
}
const Sr = [
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
function Ur(e, t) {
  if (!Sr.some((s) => t.has(s))) {
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
    const s = t.get("sorts").split(",").map((h) => {
      const d = h.lastIndexOf(":");
      return { key: h.slice(0, d), direction: h.slice(d + 1) };
    });
    if (s.some((h) => !h.key || !["asc", "desc"].includes(h.direction)))
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
  const c = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Te(o),
      objectFilter: En(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: c,
      performerScope: a
    },
    startAtEnd: !t.has("page") && c === "end"
  };
}
function tr(e, t) {
  const r = new URLSearchParams(window.location.search);
  Sr.forEach((o) => r.delete(o)), r.set("review", e);
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
function Ye(e, t) {
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
async function Zt(e) {
  var c;
  if (e.occurrence) {
    const s = (await J(go(e))).filter(
      (h) => h.hostType === "video" && h.hostId === e.video.id && h.contextType === "performer" && h.contextId === e.occurrence.performer.id
    );
    return {
      ids: [...new Set(s.map((h) => h.tag.id))],
      names: [...new Set(s.map((h) => h.tag.name))],
      absent: [],
      applications: s
    };
  }
  const t = await Xn(e.video.id), r = (t.tags ?? []).filter(
    (s) => s.canRemove !== !1 || s.isDerived !== !0
  ), o = Object.keys(t.customFields ?? {}).find(
    (s) => s.toLowerCase() === Gt
  ) ?? Gt, a = ((c = t.customFields) == null ? void 0 : c[o]) ?? [];
  if (!Array.isArray(a) || a.some((s) => !Number.isSafeInteger(s)))
    throw new Error(
      "Confirmed absent tags are invalid. Inspect the video before editing."
    );
  return { ids: r.map((s) => s.id), names: r.map((s) => s.name), absent: a };
}
async function ho(e, t, r) {
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
      a.length && await J("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({ ids: [t.video.id], tagMode: o, tagIds: a })
      });
}
async function mo(e, t, r) {
  t.occurrence && e.entityType === "performerOccurrence" ? await lo(e, t.occurrence, r) : await Zn(r, [t.video.id]);
}
function br(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Wr(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Hr(e) {
  return !!String(e ?? "").trim();
}
function ni(e) {
  return [
    ...new Set(
      br(e.customFieldCriteria).filter(Wr).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Hr(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function ii(e, t) {
  const r = br(e.customFieldCriteria);
  if (!r.length) return e;
  let o = !1;
  const a = r.map((c) => {
    if (!Wr(c)) return c;
    const s = { ...c };
    for (const [h, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const y = t[String(c[h] ?? "")];
      y && !Hr(c[d]) && (s[d] = y, o = !0);
    }
    return s;
  });
  return o ? { ...e, customFieldCriteria: a } : e;
}
function oi(e, t, r) {
  const o = br(e.customFieldCriteria);
  if (!o.length) return e;
  const a = br(r.customFieldCriteria), c = (d, y) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (S) => (d[S] ?? void 0) === (y[S] ?? void 0)
  );
  let s = !1;
  const h = o.map((d) => {
    if (!Wr(d)) return d;
    const y = a.find((E) => c(E, d));
    if (!y) return d;
    const S = { ...d };
    for (const [E, I] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const b = t[String(d[E] ?? "")];
      b && d[I] === b && !Hr(y[I]) && (delete S[I], s = !0);
    }
    return S;
  });
  return s ? { ...e, customFieldCriteria: h } : e;
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
function Or(e, t) {
  if (!t) return e;
  const r = /* @__PURE__ */ new Map();
  for (const o of e)
    r.set(o.video.id, [...r.get(o.video.id) ?? [], o]);
  return [...r.values()].reverse().flat();
}
const Qe = (e) => e instanceof Error ? e.message : "Request failed.";
function yo({
  actions: e,
  disabled: t,
  canWrite: r,
  onApply: o
}) {
  const [a, c] = w({});
  V(() => {
    let h = !0;
    return Promise.all(
      [
        ...new Set(
          e.flatMap(
            (d) => d.steps.flatMap((y) => y.tagIds)
          )
        )
      ].map(async (d) => {
        try {
          return [
            d,
            (await J(`/api/tags/${d}`)).name
          ];
        } catch {
          return [d, "Unavailable tag"];
        }
      })
    ).then((d) => {
      h && c(Object.fromEntries(d));
    }), () => {
      h = !1;
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
    e.map((h, d) => /* @__PURE__ */ u("div", { className: "dq-action-pair", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: t || !r && h.steps.length > 0,
          onClick: (y) => o(h, y.shiftKey),
          children: /* @__PURE__ */ u("span", { children: [
            bt(h, d) && /* @__PURE__ */ n("kbd", { children: bt(h, d) }),
            " ",
            h.label
          ] })
        }
      ),
      h.steps.length > 0 && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button dq-apply-stay-button",
          disabled: t || !r,
          "aria-label": `Apply & stay: ${h.label}`,
          title: `Apply & stay: ${h.label}`,
          onClick: () => o(h, !0),
          children: /* @__PURE__ */ n(Jr, { "aria-hidden": "true" })
        }
      ),
      h.steps.length > 0 && /* @__PURE__ */ n("small", { className: "dq-review-action-summary", children: h.steps.map(
        (y) => `${s[y.mode]}: ${y.tagIds.map((S) => a[S] ?? "Loading tag…").join(", ")}`
      ).join("; ") })
    ] }, h.id))
  ] });
}
function bo({
  review: e,
  canWrite: t,
  onBusy: r,
  onSaveDefaults: o,
  editRequest: a = 0,
  renderRuleEditor: c
}) {
  var Oe;
  const s = M(null), h = M("");
  if (!s.current)
    try {
      s.current = Ur(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (l) {
      h.current = Qe(l), s.current = { query: Kt(e), startAtEnd: !1 };
    }
  const [d, y] = w(null), S = M(null), E = M(null), I = M(null), [b, O] = w(!!h.current), k = M(0), [R, G] = w(s.current.query), T = M(R);
  T.current = R;
  const [oe, we] = w(0), Pe = M(s.current.startAtEnd), [p, P] = w([]), [v, U] = w(null), re = M(null), [Ne, de] = w(null), [or, ue] = w(0), Rt = Tt(() => {
    if (!v) return null;
    const l = p.findIndex((g) => g.key === v.key);
    return l < 0 ? null : p.slice(l + 1).find((g) => g.video.id !== v.video.id) ?? null;
  }, [v, p]), [je, lt] = w(0), [Se, qt] = w(!1), [le, kt] = w(!1), ke = M(!1), We = M(!0), Ze = M(null);
  V(() => (We.current = !0, () => {
    We.current = !1;
  }), []);
  const [vt, Y] = w(h.current), [wt, Fe] = w(""), [ge, Z] = w(null), [he, B] = w(!1), [N, W] = w([]), x = M([]), He = M(null), et = M(null), Jt = M(null);
  V(() => {
    var l, g;
    he && ((g = (l = Jt.current) == null ? void 0 : l.querySelector("input")) == null || g.focus());
  }, [he]);
  const [fe, ct] = w(!1);
  V(() => {
    if (Se || fe || !et.current) return;
    const l = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const g = et.current;
      g != null && g.isConnected && !g.disabled && g.focus(), et.current = null;
    });
    return () => cancelAnimationFrame(l);
  }, [Se, fe, oe]);
  const [dt, St] = w([]), [It, Ot] = w({}), Mt = M(null), ut = M(0), [ft, ne] = w({});
  V(() => {
    let l = !0;
    return Promise.all(
      ni(R.objectFilter).map(
        async (g) => [
          String(g),
          (await J(`/api/tags/${g}`)).name
        ]
      )
    ).then((g) => {
      l && ne(Object.fromEntries(g));
    }).catch(() => {
    }), () => {
      l = !1;
    };
  }, [R.objectFilter]);
  const Pt = Tt(
    () => ii(R.objectFilter, ft),
    [ft, R.objectFilter]
  ), pt = M(0), Qt = M(e);
  Qt.current = e;
  const Ee = d ?? e, Ue = Tt(
    () => Ye(Ee, R),
    [Ee, R]
  ), K = M(Ue);
  K.current = Ue;
  const Et = R.startFrom !== (e.view.startFrom ?? "end") || !rr(
    JSON.parse(Xe(Ye(e, R))),
    JSON.parse(Xe(Ye(e, Kt(e))))
  ), ce = le || Se || he, tt = Number(R.filter.page);
  function $e(l, g = !1) {
    ke.current || (h.current = "", Pe.current = g, T.current = l, G(l), lt(0), qt(!0), g || tr(e.id, l), we((q) => q + 1));
  }
  function Ft() {
    if (ke.current = !1, kt(!1), We.current && Ze.current) {
      const l = Ze.current;
      Ze.current = null, $e(l.query, l.startAtEnd);
    }
  }
  V(() => {
    const l = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const g = Ur(
            Qt.current,
            new URLSearchParams(window.location.search)
          );
          ke.current ? Ze.current = g : $e(g.query, g.startAtEnd);
        } catch (g) {
          Y(Qe(g));
        }
    };
    return window.addEventListener("popstate", l), () => window.removeEventListener("popstate", l);
  }, [e.id]), V(() => (r(le || Se || he || !!d), () => r(!1)), [le, Se, he, !!d, r]);
  async function $t(l, g, q) {
    if (l.entityType === "performerOccurrence") {
      const L = await uo(
        l,
        Mt.current,
        g,
        q
      );
      return {
        items: L.items.map((z) => ({
          key: z.key,
          video: z.video,
          occurrence: z
        })),
        totalCount: L.totalCount
      };
    }
    const D = await er(
      l,
      { ...l.view.filter, page: g },
      q
    );
    return {
      items: D.items.map((L) => ({ key: String(L.id), video: L })),
      totalCount: D.totalCount
    };
  }
  function zt(l, g, q, D = !1, L = !1) {
    if (!We.current || Ze.current) return;
    O(!0), P(
      L ? l.items : Or(l.items, T.current.startFrom === "end")
    ), lt(l.totalCount), me(q, D);
    const z = {
      ...T.current,
      filter: { ...T.current.filter, page: g }
    };
    T.current = z, G(z), tr(e.id, z);
  }
  function me(l, g = !1) {
    (l == null ? void 0 : l.key) !== (v == null ? void 0 : v.key) && (re.current = null), (l == null ? void 0 : l.video.id) !== (v == null ? void 0 : v.video.id) && de(g && l ? l.video.id : null), U(l);
  }
  V(() => {
    if (h.current) return;
    const l = new AbortController();
    I.current = l;
    const g = ++pt.current;
    return qt(!0), Y(""), Fe(""), re.current = null, de(null), U(null), P([]), B(!1), (async () => {
      const q = Ye(Qt.current, T.current);
      Mt.current = q.entityType === "performerOccurrence" ? await ei(q, l.signal) : null;
      let D = Number(q.view.filter.page), L = await $t(q, D, l.signal);
      const z = Math.max(
        1,
        Math.ceil(L.totalCount / Number(q.view.filter.perPage))
      );
      if ((Pe.current || D > z) && (D = z, L = await $t(q, D, l.signal)), Pe.current = !1, g !== pt.current || l.signal.aborted) return;
      const nt = Or(L.items, q.view.startFrom === "end");
      zt(L, D, nt[0] ?? null);
    })().catch((q) => {
      !l.signal.aborted && g === pt.current && Y(Qe(q));
    }).finally(() => {
      !l.signal.aborted && g === pt.current && (O(!0), qt(!1));
    }), () => {
      l.abort(), pt.current++;
    };
  }, [oe, e.id]), V(() => {
    if (Z(null), !v) return;
    let l = !0;
    return Zt(v).then((g) => {
      l && (Z(g), St(
        e.entityType === "performerOccurrence" ? g.ids.filter((q) => e.occurrence.tagIds.includes(q)) : []
      ));
    }).catch((g) => {
      l && Y(`Could not load current tags. ${Qe(g)}`);
    }), () => {
      l = !1;
    };
  }, [v]), V(() => {
    if (e.entityType !== "performerOccurrence" || e.actions.length)
      return;
    let l = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (g) => [
          g,
          (await J(`/api/tags/${g}`)).name
        ]
      )
    ).then((g) => {
      l && Ot(Object.fromEntries(g));
    }).catch((g) => {
      l && Y(Qe(g));
    }), () => {
      l = !1;
    };
  }, [e]);
  async function xe(l = !1, g = !1, q = !1) {
    var gt;
    if (!v) return;
    const D = p.findIndex((H) => H.key === v.key), L = R.startFrom === "end" ? -1 : 1, z = ((gt = re.current) == null ? void 0 : gt.key) === v.key ? re.current : { key: v.key, page: tt, before: p.slice(0, D + 1).map((H) => H.key), after: p.slice(D + 1).map((H) => H.key) }, nt = new Set(z.after), _ = new Set(z.before), Ke = p.find((H) => {
      var De;
      return nt.has(H.key) || (L === 1 || tt < z.page) && ((De = re.current) == null ? void 0 : De.key) === v.key && !_.has(H.key);
    });
    if (!l && Ke) {
      me(Ke, q);
      return;
    }
    const ae = l ? _ : new Set(p.map((H) => H.key)), _e = 1100 - (Date.now() - ut.current);
    _e > 0 && await new Promise((H) => window.setTimeout(H, _e));
    let Ce = L === -1 && !l ? Math.max(1, tt - 1) : tt;
    for (; We.current && !Ze.current; ) {
      let H = await $t(Ue, Ce);
      const De = Math.max(
        1,
        Math.ceil(H.totalCount / Number(R.filter.perPage))
      );
      Ce > De && (Ce = De, H = await $t(Ue, Ce));
      const it = Or(H.items, L === -1), ee = new Map(it.map((be) => [be.key, be])), Wt = l ? z.after.flatMap((be) => {
        const Lt = ee.get(be);
        return Lt ? [Lt] : [];
      }) : [], ar = new Set(Wt.map((be) => be.key)), ht = l ? {
        ...H,
        items: [
          ...Wt,
          ...it.filter(
            (be) => be.key !== v.key && !ar.has(be.key)
          )
        ]
      } : H;
      if (g) {
        re.current = z, zt(ht, Ce, v, !1, l);
        return;
      }
      const mt = L === -1 && tt === 1 && !l ? void 0 : ht.items.find(
        (be) => !ae.has(be.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(l && L === -1 && Ce === z.page) || nt.has(be.key))
      );
      if (mt || (L === -1 ? Ce <= 1 : Ce >= De)) {
        zt(
          ht,
          Ce,
          mt ?? null,
          q,
          l
        ), mt || Fe(
          H.totalCount ? "Reached the end in this direction. Matching items remain available from the scene pages." : "No matching scenes."
        );
        return;
      }
      Ce += L;
    }
  }
  async function Le(l, g = !1, q = !1, D = !1) {
    if (d || !v || ke.current || Se || he && !q)
      return;
    const L = q || D || !!(l != null && l.steps.length), z = L && !g;
    if (L && (!t || !ge)) return;
    ke.current = !0, kt(!0), Y(""), Fe("");
    const nt = p.findIndex((ae) => ae.key === v.key), _ = L && !g && nt >= 0 ? p[nt + 1] ?? null : null;
    _ && (P(
      (ae) => ae.filter((_e) => _e.key !== v.key)
    ), me(_, !0));
    let Ke = !1;
    try {
      if (L) {
        const ae = await Zt(v);
        if (l)
          await mo(Ue, v, l);
        else {
          const Ce = D && e.entityType === "performerOccurrence" ? e.occurrence.tagIds.filter((De) => ae.ids.includes(De)) : x.current, H = po(Ce, D ? dt : N);
          await ho(Ue, v, H);
        }
        ut.current = Date.now();
        const _e = await Zt(v);
        _ || Z(_e), Ke = !0, B(!1), Fe("Tags saved.");
      }
      if (!We.current || Ze.current) return;
      L ? await xe(!0, g, z) : g || await xe(), g && q && requestAnimationFrame(() => {
        var ae;
        return (ae = He.current) == null ? void 0 : ae.focus();
      });
    } catch (ae) {
      if (Y(
        Ke ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Qe(ae)}` : L ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Qe(ae)}` : `Could not advance. ${Qe(ae)}`
      ), L && !Ke) {
        _ && (P(p), de(null), ue((_e) => _e + 1), U(v)), ut.current = Date.now();
        try {
          Z(await Zt(v));
        } catch {
          Z(null), Y(
            (_e) => `${_e} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Ft();
    }
  }
  V(() => {
    const l = (g) => {
      if (he || d || le || Se || fe || g.defaultPrevented || g.repeat || g.ctrlKey || g.altKey || g.metaKey || !Jn(g.target) || document.querySelector('[role="dialog"], dialog[open]'))
        return;
      const q = g.key.toLowerCase(), D = e.actions.find(
        (L, z) => bt(L, z) === q
      );
      D && (g.preventDefault(), g.stopPropagation(), Le(D, g.shiftKey));
    };
    return document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l);
  });
  function rt() {
    !o || d || ke.current || he || (E.current = document.activeElement, S.current = {
      error: vt,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(T.current),
      items: p,
      current: v,
      total: je,
      targets: Mt.current,
      stayedCursor: re.current
    }, y(structuredClone(Ye(e, T.current))), Fe(""), Y(""));
  }
  V(() => {
    a && a !== k.current && b && !Se && (k.current = a, rt());
  }, [a, Se, b]);
  function xt() {
    y(null), requestAnimationFrame(() => {
      var l;
      return (l = E.current) == null ? void 0 : l.focus();
    });
  }
  function ye() {
    var g;
    const l = S.current;
    !l || le || ((g = I.current) == null || g.abort(), pt.current++, T.current = l.query, G(l.query), P(l.items), U(l.current), lt(l.total), Mt.current = l.targets, re.current = l.stayedCursor, qt(!1), Y(l.error), Fe(""), window.history.replaceState(window.history.state, "", l.url), xt());
  }
  async function Ae() {
    if (!d || !o || ke.current) return;
    const l = Ye(
      { ...d, name: d.name.trim() },
      T.current
    ), g = hr(l);
    if (g) {
      Y(g);
      return;
    }
    ke.current = !0, kt(!0), Y("");
    try {
      if (await o(l) === !1) throw new Error("Could not save review.");
      xt(), Fe("Review saved.");
    } catch (q) {
      Y(
        "Could not save review. Your edits are still open. " + Qe(q)
      );
    } finally {
      Ft();
    }
  }
  async function Ie() {
    if (!o || ke.current) return;
    const l = Ye(e, {
      ...T.current,
      filter: { ...T.current.filter, page: 1 }
    });
    ke.current = !0, kt(!0), Y("");
    try {
      if (await o(l) === !1) throw new Error("Could not save review.");
      Fe("Queue saved to this review.");
    } catch (g) {
      Y("Could not save queue. " + Qe(g));
    } finally {
      Ft();
    }
  }
  const Q = R.performerScope, qe = (l) => $e({
    ...T.current,
    filter: { ...T.current.filter, page: 1 },
    performerScope: { ...Q, ...l }
  });
  return /* @__PURE__ */ u(
    "section",
    {
      className: "dq-review-workspace",
      "aria-label": Q ? "Performer occurrence review" : "Video review",
      children: [
        d && /* @__PURE__ */ u("section", { className: "dq-rule-editor", "aria-label": "Edit review rule", children: [
          /* @__PURE__ */ n("h2", { children: "Edit review" }),
          /* @__PURE__ */ n("p", { children: "Preview matching scenes below. Save review keeps all rule changes; Cancel restores your previous view." }),
          /* @__PURE__ */ u("fieldset", { disabled: le, children: [
            c == null ? void 0 : c(
              Ye(d, R),
              y,
              le
            ),
            /* @__PURE__ */ u("label", { children: [
              "Review direction",
              /* @__PURE__ */ u(
                "select",
                {
                  "aria-label": "Review direction",
                  value: R.startFrom,
                  onChange: (l) => $e({
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
              var D;
              const g = l.target instanceof Element ? l.target.closest("button") : null, q = (g == null ? void 0 : g.getAttribute("aria-label")) ?? ((D = g == null ? void 0 : g.textContent) == null ? void 0 : D.trim()) ?? "";
              g && !g.closest('[role="dialog"], dialog') && /^(Filters|Edit filter:|Edit performer criteria)/.test(q) && (et.current = g);
            },
            children: [
              /* @__PURE__ */ n("legend", { children: "Scene filters" }),
              /* @__PURE__ */ u("div", { className: "dq-queue-toolbar", children: [
                /* @__PURE__ */ n(
                  Fr,
                  {
                    filter: R.filter,
                    objectFilter: Pt,
                    criteriaDefinitions: Br,
                    customFieldEntityType: "video",
                    totalCount: je,
                    sortOptions: Gr,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    onFilterChange: (l) => {
                      (l.sort !== T.current.filter.sort || l.direction !== T.current.filter.direction) && (l = { ...l, sorts: void 0 }), $e({
                        ...T.current,
                        filter: Te(l)
                      });
                    },
                    onObjectFilterChange: (l) => {
                      $e({
                        ...T.current,
                        objectFilter: oi(
                          l,
                          ft,
                          T.current.objectFilter
                        ),
                        filter: { ...T.current.filter, page: 1 }
                      });
                    }
                  }
                ),
                !d && Et && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      "aria-label": "Save changes to review filters",
                      title: "Save changes to review filters",
                      disabled: !o,
                      onClick: () => void Ie(),
                      children: /* @__PURE__ */ n(Jr, { "aria-hidden": "true" })
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
                        $e(l, l.startFrom === "end");
                      },
                      children: /* @__PURE__ */ n(Ln, { "aria-hidden": "true" })
                    }
                  )
                ] })
              ] }),
              Q && /* @__PURE__ */ u("div", { className: "dq-scope-controls", children: [
                /* @__PURE__ */ u("label", { children: [
                  "Performers to review",
                  " ",
                  /* @__PURE__ */ u(
                    "select",
                    {
                      value: Q.targetMode,
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
                Q.targetMode === "selected" && /* @__PURE__ */ n(
                  st,
                  {
                    entityType: "performer",
                    values: Q.performerIds,
                    onChange: (l) => qe({ performerIds: l }),
                    placeholder: "Select performers to review...",
                    allowCreate: !1
                  }
                ),
                Q.targetMode === "filter" && /* @__PURE__ */ u(Re, { children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => ct(!0),
                      children: "Edit performer criteria"
                    }
                  ),
                  /* @__PURE__ */ n("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ n(
                    Fr,
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
                      objectFilter: Q.performerFilter,
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
                      value: Q.condition,
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
                !["any", "isNull"].includes(Q.condition) && /* @__PURE__ */ u(Re, { children: [
                  /* @__PURE__ */ n(
                    st,
                    {
                      entityType: "tag",
                      values: Q.conditionTagIds,
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
                        checked: Q.includeSubtags ?? !0,
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
        Q && /* @__PURE__ */ n(
          Mn,
          {
            open: fe,
            onClose: () => ct(!1),
            criteria: pn,
            activeFilter: Q.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (l) => {
              ct(!1), qe({ performerFilter: l });
            }
          }
        ),
        /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
          vt && /* @__PURE__ */ u("p", { role: "alert", children: [
            vt,
            " ",
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: le,
                onClick: () => {
                  v ? Zt(v).then(Z).catch((l) => Y(Qe(l))) : $e(T.current);
                },
                children: v ? "Reload tags" : "Retry queue"
              }
            )
          ] }),
          wt && /* @__PURE__ */ n("p", { role: "status", children: wt })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-review-layout", children: [
          /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
            /* @__PURE__ */ n("fieldset", { disabled: ce, children: /* @__PURE__ */ n(
              Pn,
              {
                filter: R.filter,
                totalCount: je,
                onFilterChange: (l) => $e({ ...R, filter: Te(l) })
              }
            ) }),
            /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: p.map((l) => {
              var g, q, D;
              return /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  title: `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${l.video.title || ((g = l.video.files[0]) == null ? void 0 : g.basename) || "Scene"}`,
                  "aria-label": `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${l.video.title || ((q = l.video.files[0]) == null ? void 0 : q.basename) || "Scene"}`,
                  disabled: ce,
                  "aria-pressed": (v == null ? void 0 : v.key) === l.key,
                  onClick: () => {
                    me(l), Y(""), Fe("");
                  },
                  children: [
                    l.occurrence && /* @__PURE__ */ n(Cn, { performer: l.occurrence.performer }),
                    /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: l.video.title || ((D = l.video.files[0]) == null ? void 0 : D.basename) || "Scene" })
                  ]
                },
                l.key
              );
            }) })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-inspector", children: v ? /* @__PURE__ */ u(Re, { children: [
            /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
              /* @__PURE__ */ n("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ n(
                "a",
                {
                  href: `/video/${v.video.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: v.video.title || ((Oe = v.video.files[0]) == null ? void 0 : Oe.basename) || `Video ${v.video.id}`
                }
              ) }),
              [v, Rt].filter(Boolean).map((l) => {
                var D, L, z;
                const g = l, q = g.key === v.key;
                return /* @__PURE__ */ n(
                  "div",
                  {
                    className: q ? "dq-review-video-current" : "dq-review-video-preload",
                    "aria-hidden": q ? void 0 : !0,
                    inert: q ? void 0 : !0,
                    children: /* @__PURE__ */ n(
                      Fn,
                      {
                        videoId: g.video.id,
                        streamUrl: Yn(g.video.id),
                        posterUrl: q ? eo(g.video) : void 0,
                        duration: ((D = g.video.files[0]) == null ? void 0 : D.duration) ?? 0,
                        format: (L = g.video.files[0]) == null ? void 0 : L.format,
                        audioCodec: (z = g.video.files[0]) == null ? void 0 : z.audioCodec,
                        extensionSurface: q ? "quick-view" : void 0,
                        autostart: q && Ne === g.video.id,
                        keyboardShortcutsEnabled: q,
                        showAbLoop: q,
                        clip: g.video.parentVideoId != null ? {
                          start: g.video.clipStartSec ?? 0,
                          end: g.video.clipEndSec,
                          loop: !1
                        } : void 0
                      }
                    )
                  },
                  `${g.video.id}:${or}`
                );
              })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-panel", children: [
              /* @__PURE__ */ n("h2", { children: v.occurrence ? `Reviewing ${v.occurrence.performer.name}` : "Reviewing this video" }),
              /* @__PURE__ */ n("p", { children: Q ? "Tags apply only to this performer in this video." : "Tags apply to the video." }),
              Q && /* @__PURE__ */ n(
                "div",
                {
                  className: "dq-review-partners",
                  "aria-label": "Matching scene partners",
                  children: p.filter((l) => l.video.id === v.video.id).map((l) => {
                    var g, q;
                    return /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button dq-partner-button",
                        title: (g = l.occurrence) == null ? void 0 : g.performer.name,
                        "aria-label": (q = l.occurrence) == null ? void 0 : q.performer.name,
                        disabled: ce,
                        "aria-pressed": l.key === v.key,
                        onClick: () => {
                          me(l), Y("");
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
                Q ? "occurrence" : "video",
                " tags:",
                " ",
                ge ? ge.names.join(", ") || "None" : "Loading…"
              ] }),
              ge != null && ge.absent.length ? /* @__PURE__ */ u("p", { children: [
                "Confirmed absent tags:",
                " ",
                /* @__PURE__ */ n(
                  st,
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
              he ? /* @__PURE__ */ u(
                "fieldset",
                {
                  ref: Jt,
                  disabled: le,
                  className: "dq-tag-editor",
                  children: [
                    /* @__PURE__ */ u("legend", { children: [
                      "Edit ",
                      Q ? "occurrence" : "video",
                      " tags"
                    ] }),
                    /* @__PURE__ */ n(
                      st,
                      {
                        entityType: "tag",
                        values: N,
                        onChange: W,
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
                          onClick: () => void Le(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !ge,
                          onClick: () => void Le(void 0, !1, !0),
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
                                return (l = He.current) == null ? void 0 : l.focus();
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
                  yo,
                  {
                    actions: Ee.actions,
                    canWrite: t,
                    disabled: le || Se || !ge || !!d,
                    onApply: (l, g) => void Le(l, g)
                  }
                ),
                e.entityType === "performerOccurrence" && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                  "fieldset",
                  {
                    className: "dq-tag-choices",
                    disabled: !t || le || !ge || !!d,
                    children: [
                      /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                      e.occurrence.tagIds.map((l) => /* @__PURE__ */ u("label", { children: [
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: e.occurrence.multiple ? "checkbox" : "radio",
                            name: "legacy-choice",
                            checked: dt.includes(l),
                            onChange: (g) => St(
                              e.occurrence.multiple ? g.target.checked ? [...dt, l] : dt.filter(
                                (q) => q !== l
                              ) : [l]
                            )
                          }
                        ),
                        It[l] ?? "Loading tag…"
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
                          onClick: () => void Le(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Le(void 0, !1, !1, !0),
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
                    ref: He,
                    className: "dq-button",
                    disabled: ce || !!d || !t || !ge,
                    onClick: () => {
                      x.current = [...ge.ids], W([...ge.ids]), B(!0);
                    },
                    children: "Edit tags"
                  }
                ),
                /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: ce || !!d,
                    onClick: () => void Le(),
                    children: [
                      "Skip",
                      Q ? " performer" : " video"
                    ]
                  }
                )
              ] }),
              !t && /* @__PURE__ */ n("p", { children: "Write permission is required to change tags." })
            ] })
          ] }) : /* @__PURE__ */ n("p", { role: "status", children: Se ? "Loading review…" : je ? "Reached the end in this direction." : "No matching scenes." }) })
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
  const o = e.occurrence, a = (c) => t({ ...e, occurrence: { ...o, ...c } });
  return r ? /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ n("p", { children: "Choose the tags this review can change on the active performer’s appearance in a scene. Other tags are preserved." }),
    /* @__PURE__ */ n(
      st,
      {
        entityType: "tag",
        values: o.tagIds,
        onChange: (c) => a({ tagIds: c }),
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
          onChange: (c) => a({ multiple: c.target.checked })
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
          onChange: (c) => a({
            condition: c.target.value
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
        st,
        {
          entityType: "tag",
          values: o.conditionTagIds,
          onChange: (c) => a({ conditionTagIds: c }),
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
            onChange: (c) => a({ includeSubtags: c.target.checked })
          }
        ),
        "Include subtags"
      ] })
    ] }),
    /* @__PURE__ */ n("p", { children: "Conditions check tags on the same performer’s occurrence, independently of scene tags and the performer’s profile." })
  ] });
}
function vo(e) {
  var h, d, y;
  const [t, r] = w({}), [o, a] = w(""), c = (((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.annotations) ?? []).includes("tags") ? ((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...c,
      ...((y = e == null ? void 0 : e.presentation) == null ? void 0 : y.binParents) ?? []
    ])
  ]);
  return V(() => {
    let S = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(s).map(
        async (E) => [E, await wr([E])]
      )
    ).then((E) => {
      S && r(Object.fromEntries(E));
    }).catch(() => {
      S && a(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      S = !1;
    };
  }, [s]), { ids: t, error: o };
}
function wo(e, t, r) {
  const o = t == null ? void 0 : t.presentation, a = (o == null ? void 0 : o.annotations) ?? [], c = (o == null ? void 0 : o.annotationParents) ?? [];
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
    tags: a.includes("tags") && c.length > 0 ? (e.tags ?? []).filter(
      (s) => c.some(
        (h) => {
          var d;
          return h !== s.id && ((d = r[h]) == null ? void 0 : d.includes(s.id));
        }
      )
    ) : []
  };
}
function So({
  videos: e,
  review: t,
  trees: r,
  disabled: o,
  onChoose: a
}) {
  var h, d, y;
  const c = new Set(
    (((h = t.presentation) == null ? void 0 : h.binParents) ?? []).flatMap(
      (S) => (r[S] ?? []).filter((E) => E !== S)
    )
  ), s = /* @__PURE__ */ new Map();
  for (const S of e)
    for (const E of S.tags ?? [])
      if (c.has(E.id)) {
        const I = s.get(E.id) ?? { name: E.name, count: 0 };
        I.count++, s.set(E.id, I);
      }
  return (y = (d = t.presentation) == null ? void 0 : d.binParents) != null && y.length ? /* @__PURE__ */ u("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...s].sort((S, E) => S[1].name.localeCompare(E[1].name)).map(([S, E]) => /* @__PURE__ */ u(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: o,
        onClick: () => a(S),
        children: [
          E.name,
          " (",
          E.count,
          ")"
        ]
      },
      S
    )),
    !s.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function Eo(e, t) {
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
  const [a, c] = w(!1), s = pe(e) === "tag" ? "tag" : "video", h = qi(
    s === "video" ? "video" : void 0,
    e.view.objectFilter
  ), d = e.view.filter, y = s === "tag" ? $n : Gr, S = (b) => t({
    ...e,
    view: { ...e.view, filter: { ...d, ...b } }
  }), E = s === "video" ? e.presentation ?? {} : {}, I = (b) => t({ ...e, presentation: { ...E, ...b } });
  return /* @__PURE__ */ u(Re, { children: [
    o && /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ u("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(d.q ?? ""),
            onChange: (b) => S({ q: b.target.value })
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
              value: String(d.sort ?? "date"),
              onChange: (b) => S({ sort: b.target.value, sorts: void 0 }),
              children: [
                !y.some((b) => b.value === d.sort) && d.sort != null && /* @__PURE__ */ n("option", { value: String(d.sort), children: String(d.sort) }),
                y.map((b) => /* @__PURE__ */ n("option", { value: b.value, children: b.label }, b.value))
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
              value: String(d.direction ?? "desc"),
              onChange: (b) => S({ direction: b.target.value }),
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
              value: Number(d.perPage) || 40,
              onChange: (b) => S({
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
          onClick: () => c(!0),
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
          onClose: () => c(!1),
          criteria: s === "tag" ? xn : Br,
          activeFilter: e.view.objectFilter,
          customSections: h ? [h] : void 0,
          supportsFilterExpressions: s === "video",
          subjectLabel: s === "tag" ? "tags" : "videos",
          onApply: (b) => {
            t({ ...e, view: { ...e.view, objectFilter: b } }), c(!1);
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
          const O = E.annotations ?? [];
          return /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: O.includes(b),
                onChange: (k) => I({
                  annotations: k.target.checked ? [...O, b] : O.filter((R) => R !== b)
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
            st,
            {
              entityType: "tag",
              values: E.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (b) => I({ annotationParents: b }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ n("h4", { children: "Queue tag bins" }),
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ n(
          st,
          {
            entityType: "tag",
            values: E.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (b) => I({ binParents: b }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const Mr = 180;
function ai({ entityType: e }) {
  return e === "tag" ? /* @__PURE__ */ n(Pi, { role: "img", "aria-label": "Tag review" }) : /* @__PURE__ */ n(Lr, { role: "img", "aria-label": e === "performerOccurrence" ? "Performer occurrence review" : "Video review" });
}
function Tn(e) {
  return pe(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Rn(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Pr() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function qn(e) {
  const t = new URLSearchParams(window.location.search);
  Sr.forEach((o) => t.delete(o)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function Co(e) {
  return Te({ ...e, page: 1 });
}
function si(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function ze(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const li = "data-quality.workspace-layout.v1", Xr = 240, Kr = 192, Vr = 560;
function ci(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(Vr, Math.max(Kr, e)) : Xr;
}
function No() {
  try {
    const e = JSON.parse(
      localStorage.getItem(li) ?? "null"
    );
    return ci(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return Xr;
  }
}
function Ao(e) {
  try {
    localStorage.setItem(
      li,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function di(e) {
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
function ui(e, t) {
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
function To(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : ui(e, t);
}
function Ro({
  onNavigate: e
}) {
  const [t, r] = w([]), [o] = w(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [a, c] = w(""), [s, h] = w(!0), [d, y] = w(""), [S, E] = w(!1), [I, b] = w(!1), [O, k] = w(!1), [R, G] = w([]), [T, oe] = w(""), [we, Pe] = w(!0), [p, P] = w(""), [v, U] = w(""), [re, Ne] = w(!1), [de, or] = w(!1), [ue, Rt] = w(Pr), [je, lt] = w({}), [Se, qt] = w("name"), [le, kt] = w("asc"), ke = M(null), We = M(!1), [Ze, vt] = w(0), [Y, wt] = w(!1), [Fe, ge] = w(!1), [Z, he] = w(
    null
  ), B = t.find((i) => i.id === ue) ?? null, N = Tt(
    () => (Z == null ? void 0 : Z.id) === ue && B ? { ...B, view: {
      ...B.view,
      filter: Z.view.filter,
      objectFilter: Z.view.objectFilter,
      searchMode: Z.view.searchMode,
      startFrom: Z.view.startFrom
    } } : B,
    [Z, ue, B]
  ), W = N ? pe(N) : "video", x = W === "video" ? N : null, [He, et] = w(null), Jt = (He == null ? void 0 : He.id) === (N == null ? void 0 : N.id) ? He == null ? void 0 : He.mode : (N == null ? void 0 : N.view.reviewMode) ?? "single", fe = W === "performerOccurrence" || W === "video" && Jt === "single", [ct, dt] = w(0), St = M(-1), It = M(!1);
  V(() => {
    const i = () => {
      if (!fe && ae.current) {
        It.current = !0;
        return;
      }
      Rt(Pr()), fe || dt((f) => f + 1);
    };
    return window.addEventListener("popstate", i), () => window.removeEventListener("popstate", i);
  }, [fe]);
  const Ot = W === "tag" ? I : S, Mt = Tt(() => {
    const i = le === "asc" ? 1 : -1;
    return [...t].sort((f, m) => {
      if (Se === "count") {
        const C = je[f.id], $ = je[m.id], A = typeof C == "number", F = typeof $ == "number";
        if (A !== F) return A ? -1 : 1;
        if (A && F && C !== $)
          return (C - $) * i;
      }
      return f.name.localeCompare(m.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * i;
    });
  }, [le, Se, je, t]), ut = M(
    null
  ), ft = vo(x), [ne, Pt] = w({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [pt, Qt] = w({
    page: 1,
    perPage: 40
  }), [Ee, Ue] = w({ items: [], totalCount: 0 }), [K, Et] = w(!1), [ce, tt] = w(""), [$e, Ft] = w(!1), [$t, zt] = w(!1), [me, xe] = w(() => /* @__PURE__ */ new Set()), Le = M(me);
  Le.current = me;
  const rt = M(/* @__PURE__ */ new Map()), xt = (N == null ? void 0 : N.view.selectAllOnLoad) === !0, [ye, Ae] = w(null), Ie = M(ye);
  Ie.current = ye;
  const [Q, qe] = w(!1), Oe = M(Q);
  Oe.current = Q;
  const l = M(null), [g, q] = w("grid"), [D, L] = w(Mr), [z, nt] = w(No), [_, Ke] = w(!1), ae = M(!1), [_e, Ce] = w(""), [gt, H] = w(""), [De, it] = w(""), [ee, Wt] = w(null), [ar, ht] = w(""), [mt, be] = w(!1), [Lt, Yr] = w({}), [Zr, en] = w({}), Ht = M(/* @__PURE__ */ new Map()), tn = M(null), Er = M(null), sr = M(null), _t = M(0), lr = M(0), cr = M(null), rn = JSON.stringify([
    ...new Set(
      (x == null ? void 0 : x.actions.flatMap(
        (i) => i.steps.flatMap((f) => f.tagIds)
      )) ?? []
    )
  ]);
  function Cr(i) {
    const f = ci(i);
    nt(f), Ao(f);
  }
  function gi(i) {
    const f = i.shiftKey ? 40 : 16;
    let m = null;
    i.key === "ArrowLeft" && (m = z + f), i.key === "ArrowRight" && (m = z - f), i.key === "Home" && (m = Kr), i.key === "End" && (m = Vr), m !== null && (i.preventDefault(), i.stopPropagation(), Cr(m));
  }
  V(() => {
    if (!gt) return;
    const i = window.setTimeout(() => H(""), 4e3);
    return () => window.clearTimeout(i);
  }, [gt]), V(() => {
    const i = JSON.parse(rn);
    if (en({}), !i.length) return;
    const f = new AbortController();
    let m = !0;
    return Promise.all(
      i.map(async (C) => {
        var $;
        try {
          const A = await J(`/api/tags/${C}`, {
            signal: f.signal
          });
          return [C, (($ = A.name) == null ? void 0 : $.trim()) || null];
        } catch {
          return [C, null];
        }
      })
    ).then((C) => {
      m && en(Object.fromEntries(C));
    }), () => {
      m = !1, f.abort();
    };
  }, [rn]), V(() => {
    const i = x ? ni(x.view.objectFilter) : [];
    if (Yr({}), !i.length) return;
    const f = new AbortController();
    let m = !0;
    return Promise.all(
      i.map(async (C) => {
        var $;
        try {
          const A = await J(`/api/tags/${C}`, {
            signal: f.signal
          });
          return ($ = A.name) != null && $.trim() ? [String(C), A.name] : null;
        } catch {
          return null;
        }
      })
    ).then((C) => {
      m && Yr(
        Object.fromEntries(C.filter(($) => $ !== null))
      );
    }), () => {
      m = !1, f.abort();
    };
  }, [x == null ? void 0 : x.id, x == null ? void 0 : x.view.objectFilter]);
  const hi = Tt(
    () => x ? ii(
      x.view.objectFilter,
      Lt
    ) : (N == null ? void 0 : N.view.objectFilter) ?? {},
    [Lt, N, x]
  ), nn = At(async () => {
    h(!0), y("");
    try {
      const i = await Bi();
      r(i.reviews), c(i.storageKey), E(i.canWriteVideos ?? i.canWrite), b(i.canWriteTags ?? !1), k(i.canReadTagGroups ?? !1), Pe(i.canConfigure ?? !0), P(i.storageNotice ?? ""), ue && !i.reviews.some((f) => f.id === ue) && (Rt(""), qn(""));
    } catch (i) {
      y(
        i instanceof Error ? i.message : "Could not load reviews."
      );
    } finally {
      h(!1);
    }
  }, [ue]);
  V(() => {
    if (!O) {
      G([]), oe("");
      return;
    }
    const i = new AbortController();
    return oe(""), Zi(i.signal).then(G).catch((f) => {
      i.signal.aborted || oe(
        f instanceof Error ? f.message : "Could not load tag groups."
      );
    }), () => i.abort();
  }, [O]), V(() => {
    nn();
  }, []), V(() => {
    if (ue || t.length === 0) return;
    const i = new AbortController();
    lt({});
    for (const f of t)
      (f.entityType === "performerOccurrence" ? ei(f, i.signal).then((C) => (C == null ? void 0 : C.length) === 0 ? { items: [], totalCount: 0 } : er(ti(f, C), { ...f.view.filter, page: 1, perPage: 1 }, i.signal)) : pe(f) === "tag" ? vn(
        f,
        Te({ ...f.view.filter, page: 1, perPage: 1 }),
        i.signal
      ) : er(
        f,
        Te({ ...f.view.filter, page: 1, perPage: 1 }),
        i.signal
      )).then((C) => {
        i.signal.aborted || lt(($) => ({
          ...$,
          [f.id]: C.totalCount
        }));
      }).catch(() => {
        i.signal.aborted || lt((C) => ({ ...C, [f.id]: null }));
      });
    return () => i.abort();
  }, [ue, t]), On(() => {
    var i;
    ue || s || !We.current || (We.current = !1, (i = ke.current) == null || i.focus());
  }, [ue, s]);
  const dr = At(async () => {
    ht("");
    try {
      Wt(await zr());
    } catch (i) {
      Wt(null), ht(
        "Tag assessment setup could not be checked. " + (i instanceof Error ? i.message : "Request failed.")
      );
    }
  }, []);
  V(() => {
    dr();
  }, [dr]);
  const Ct = At(
    async (i, f, m = !1, C = !1) => {
      var ie;
      const $ = ++_t.current;
      (ie = cr.current) == null || ie.abort();
      const A = new AbortController();
      cr.current = A, f = Te(f);
      const F = Number(f.page);
      m && (f = { ...f, page: 1 }), Pt(f), zt(m), Et(!0), tt("");
      try {
        const j = (ot) => pe(i) === "tag" ? vn(
          i,
          ot,
          A.signal
        ) : er(
          i,
          ot,
          A.signal
        );
        let se = await j(f);
        const Ve = Math.max(
          1,
          Math.ceil(se.totalCount / Number(f.perPage))
        ), Ge = m ? Ve : Math.min(F, Ve);
        return Number(f.page) !== Ge && (f = { ...f, page: Ge }, se = await j(f)), $ === _t.current && (Ue(se), C && yt(
          () => new Set(se.items.map((ot) => ot.id))
        ), Pt(f), Qt(f)), se;
      } catch (j) {
        throw $ === _t.current && tt(
          j instanceof Error ? j.message : "Could not load the review queue."
        ), j;
      } finally {
        $ === _t.current && Et(!1);
      }
    },
    []
  );
  V(() => {
    var f;
    if (lr.current += 1, St.current = -1, _t.current += 1, (f = cr.current) == null || f.abort(), or(!1), U(""), Ne(!1), xe(/* @__PURE__ */ new Set()), rt.current.clear(), Ae(null), qe(!1), Ke(!1), ae.current = !1, Ce(""), H(""), it(""), Ue({ items: [], totalCount: 0 }), Ft(!1), !N || fe) {
      Et(!1);
      return;
    }
    let i = !0;
    return Et(!0), (async () => {
      let m = B ?? N;
      he(null);
      let C = null;
      const $ = new URLSearchParams(window.location.search);
      if (pe(N) === "video" && Sr.some((j) => $.has(j)))
        try {
          const j = m;
          C = Ur(j, $);
          const se = Ye(j, C.query);
          (C.query.startFrom !== (j.view.startFrom ?? "end") || !rr(
            JSON.parse(Xe(se)),
            JSON.parse(Xe(Ye(j, Kt(j))))
          )) && (m = se, he(m));
        } catch (j) {
          Ft(!0), tt(j instanceof Error ? j.message : "Could not read review URL."), Et(!1);
          return;
        }
      let A = null;
      try {
        A = await zi(a, N.id);
      } catch (j) {
        i && (Ne(!0), U(
          j instanceof Error ? j.message : "Could not load progress."
        ));
      }
      if (!i) return;
      const F = (A == null ? void 0 : A.signature) === Xe(m) ? A : null, ie = C ? C.query.filter : F ? Te(F.filter) : Co(m.view.filter);
      Pt(ie), q(
        F ? Rn(F.displayMode, pe(N)) : Tn(N)
      ), L(
        F ? F.cardSize ?? Mr : Mr
      );
      try {
        const j = await Ct(
          m,
          ie,
          C ? C.startAtEnd : !F && m.view.startFrom !== "beginning",
          m.view.selectAllOnLoad === !0
        );
        if (!i) return;
        const se = gn(
          j.items.map((Ve) => Ve.id),
          (F == null ? void 0 : F.focusedId) ?? null,
          (F == null ? void 0 : F.index) ?? 0
        );
        Ae(se), ve(se);
      } catch {
      }
      i && (St.current = ct, or(!0));
    })(), () => {
      var m;
      i = !1, lr.current++, _t.current++, (m = cr.current) == null || m.abort();
    };
  }, [N == null ? void 0 : N.id, fe, ct]), V(() => {
    !x || fe || !de || K || ce || _ || It.current || St.current !== ct || tr(x.id, {
      filter: ne,
      objectFilter: x.view.objectFilter,
      searchMode: x.view.searchMode,
      startFrom: x.view.startFrom ?? "end"
    });
  }, [x, fe, de, K, ce, ne, _, ct]);
  const X = Tt(
    () => Ee.items.map((i) => i.id),
    [Ee.items]
  );
  V(() => {
    if (!de || !N || !a || K || ce || _ || (Z == null ? void 0 : Z.id) === N.id || re)
      return;
    const i = {
      version: 1,
      signature: Xe(N),
      filter: ne,
      focusedId: ye,
      index: Math.max(0, X.indexOf(ye ?? -1)),
      displayMode: g,
      cardSize: D,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        a + ":progress:" + N.id,
        JSON.stringify(i)
      );
    } catch {
    }
    if (v) return;
    let f = !0;
    const m = window.setTimeout(() => {
      Wi(a, N.id, i).catch((C) => {
        f && U(
          "Progress is kept in this browser, but account sync failed. " + (C instanceof Error ? C.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      f = !1, window.clearTimeout(m);
    };
  }, [
    de,
    a,
    N,
    K,
    ce,
    _,
    ne,
    ye,
    X,
    g,
    D,
    Z,
    v,
    re
  ]);
  const mi = Ee.items.find((i) => i.id === ye) ?? null, Nr = W === "video" ? mi : null;
  Q && Nr && (l.current = Nr);
  const Nt = Nr ?? (Q ? l.current : null), yi = hn(me, ye), bi = X.length > 0 && X.every((i) => me.has(i)), Ar = me.size > 0 ? `${me.size} selected ${W}${me.size === 1 ? "" : "s"}` : ye == null ? `no ${W}` : `focused ${W}`, ve = At((i, f = !0) => {
    i != null && window.requestAnimationFrame(() => {
      const m = Ht.current.get(i);
      m == null || m.focus({ preventScroll: !0 }), f && (m == null || m.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  V(() => {
    de && !Oe.current && ve(Ie.current);
  }, [de, ve]), V(() => {
    K || !X.length || (Ie.current == null || !X.includes(Ie.current)) && (Ae(X[0]), Oe.current || ve(X[0]));
  }, [ve, X, K]);
  const yt = At(
    (i) => {
      xe((f) => {
        const m = i(f);
        for (const C of /* @__PURE__ */ new Set([...f, ...m]))
          f.has(C) !== m.has(C) && rt.current.set(
            C,
            (rt.current.get(C) ?? 0) + 1
          );
        return m;
      });
    },
    []
  ), Tr = At(
    (i) => {
      if (!X.length) return;
      const f = Math.max(
        0,
        X.indexOf(Ie.current ?? X[0])
      ), m = X[Math.max(0, Math.min(X.length - 1, f + i))];
      Ae(m), Oe.current || ve(m);
    },
    [ve, X]
  ), Rr = At(
    async (i) => {
      const f = "steps" in i ? i.steps.length > 0 : i.effect.mode !== "SKIP", m = "effect" in i && i.effect.mode === "SET_TAG_GROUP" ? i.effect.tagGroupId : null, C = m != null && (!O || !R.some((te) => te.id === m)), $ = "effect" in i && f && !O, A = hn(
        Le.current,
        Ie.current
      );
      if (!N || ae.current || K || ce) return;
      const F = f && !Ot ? `${W === "tag" ? "Tag" : "Video"} write permission is required to apply ${i.label}.` : $ || C ? `${i.label} needs a tag group that is unavailable.` : mr(i) && (ee == null ? void 0 : ee.kind) !== "ready" ? `Set up tag assessments before applying ${i.label}.` : A.length ? "" : `Select or focus a ${W} before applying ${i.label}.`;
      if (F) {
        it(F);
        return;
      }
      const ie = ++lr.current, j = N.id, se = [...X], Ve = Ee, Ge = Ie.current, ot = new Set(Le.current), ln = new Map(
        A.map((te) => [te, rt.current.get(te) ?? 0])
      ), Dt = () => ie === lr.current && N.id === j;
      ae.current = !0, Ke(!0), Ce(
        Le.current.size ? `${A.length} selected ${W}s` : `the focused ${W}`
      ), H(""), it("");
      const cn = Ve.items.filter(
        (te) => !A.includes(te.id)
      ), Ti = cn.map((te) => te.id), dn = mn(
        se,
        Ti,
        Ge,
        A.includes(Ge ?? -1)
      );
      Ue({
        items: cn,
        totalCount: Ve.totalCount
      }), xe((te) => {
        const Me = new Set(te);
        for (const Be of A) Me.delete(Be);
        return Me;
      }), Ae(dn), Oe.current || ve(dn);
      let kr = !1;
      try {
        if ("effect" in i ? await so(i, A) : await Zn(i, A), kr = !0, !Dt()) return;
        xe((te) => {
          const Me = new Set(te);
          for (const Be of A)
            (rt.current.get(Be) ?? 0) === ln.get(Be) && Me.delete(Be);
          return Me;
        }), H(
          `${i.label}: ${A.length} ${W}${A.length === 1 ? "" : "s"} ${f ? "updated" : "skipped"}.`
        );
      } catch (te) {
        if (!Dt()) return;
        Ue(Ve), xe((Me) => {
          const Be = new Set(Me);
          for (const Je of A)
            ot.has(Je) && (rt.current.get(Je) ?? 0) === ln.get(Je) && Be.add(Je);
          return Be;
        }), Ae(Ge), Oe.current || ve(Ge), it(
          te instanceof Error ? te.message : "Action failed."
        );
      }
      try {
        if (await no(i), !Dt()) return;
        const te = new Set(A), Me = xt && se.length > 0 && se.every((at) => te.has(at)), Be = await Ct(N, ne, !1, Me);
        if (!Dt()) return;
        let Je = Be.items.map((at) => at.id);
        if (!Je.length && Be.totalCount > 0 && Number(ne.page) > 1) {
          const at = Math.max(1, Number(ne.page) - 1), fr = { ...ne, page: at };
          Pt(fr), Je = (await Ct(
            N,
            fr,
            !1,
            Me
          )).items.map((Ir) => Ir.id), xe(
            (Ir) => new Set([...Ir].filter((Ri) => Je.includes(Ri)))
          );
          const fn = Je.at(-1) ?? null;
          Ae(fn), Oe.current || ve(fn);
        } else {
          xe(
            (fr) => new Set([...fr].filter((un) => Je.includes(un)))
          );
          const at = mn(
            se,
            Je,
            Ge,
            kr && A.includes(Ge ?? -1)
          );
          Ae(at), Oe.current && at == null && qe(!1), Oe.current || ve(at);
        }
      } catch (te) {
        Dt() && it(
          (Me) => `${Me ? `${Me} ` : ""}${kr ? "The action completed, but " : ""}the queue could not be refreshed. ${te instanceof Error ? te.message : "Refresh failed."}`
        );
      } finally {
        Dt() && (ae.current = !1, Ke(!1), Ce(""), It.current && (It.current = !1, Rt(Pr()), dt((te) => te + 1)));
      }
    },
    [
      Ot,
      O,
      R,
      W,
      ee,
      Ct,
      ne,
      ve,
      X,
      Ee,
      K,
      ce,
      N
    ]
  );
  function vi() {
    var m;
    if (g === "list") return 1;
    const i = (m = tn.current) == null ? void 0 : m.firstElementChild, f = i ? getComputedStyle(i).gridTemplateColumns : "";
    return Math.max(1, f.split(" ").filter(Boolean).length);
  }
  const on = M(() => {
  });
  on.current = (i) => {
    var F;
    if (fe || i.defaultPrevented || i.repeat || i.ctrlKey || i.altKey || i.metaKey || Y) return;
    const f = i.target, m = f instanceof Node && ((F = Er.current) == null ? void 0 : F.contains(f)) === !0, C = f === document.body || f === document.documentElement;
    if (!m && !C) return;
    if (Q && i.key === "Escape") {
      ze(i), qe(!1), ve(Ie.current);
      return;
    }
    if (!Di(f)) return;
    const $ = Jn(f);
    if (i.key === "Escape") {
      ze(i), yt(() => /* @__PURE__ */ new Set());
      return;
    }
    const A = (N == null ? void 0 : N.actions.findIndex(
      (ie, j) => bt(ie, j) === i.key.toLowerCase()
    )) ?? -1;
    if (A >= 0 && (N != null && N.actions[A])) {
      ze(i), !_ && !K && Rr(N.actions[A]);
      return;
    }
    if (!Q && i.key === " " && $) {
      ze(i), ye != null && yt((ie) => gr(ie, ye));
      return;
    }
    if (!Q && i.key.toLowerCase() === "a") {
      ze(i), yt(
        (ie) => yn(ie, X)
      );
      return;
    }
    if (!(_ || K) && !Q && i.key === "Enter" && ye != null && $) {
      ze(i), W === "tag" ? window.open(`/tag/${ye}`, "_blank", "noopener,noreferrer") : qe(!0);
      return;
    }
  }, V(() => {
    const i = (f) => on.current(f);
    return document.addEventListener("keydown", i), () => document.removeEventListener("keydown", i);
  }, []);
  const an = M(
    () => {
    }
  );
  an.current = (i) => {
    var A;
    if (fe || Y || Q || _ || K || !X.length || i.defaultPrevented || i.repeat || i.ctrlKey || i.altKey || i.metaKey)
      return;
    const f = i.target, m = f instanceof Node && ((A = Er.current) == null ? void 0 : A.contains(f)) === !0, C = f === document.body || f === document.documentElement;
    if (!m && !C || !i.key.startsWith("Arrow") || !ji(f)) return;
    const $ = Ui(i.key, vi());
    $ && (i.preventDefault(), m ? i.stopImmediatePropagation() : i.stopPropagation(), Tr($));
  }, V(() => {
    const i = (f) => an.current(f);
    return document.addEventListener("keydown", i), () => document.removeEventListener("keydown", i);
  }, []);
  function Xt(i) {
    et(null), vt(0), Rt(i), qn(i);
  }
  function wi() {
    We.current = !0, lt({}), Xt("");
  }
  async function qr(i) {
    if (!a) return !1;
    const f = i.map(ko);
    try {
      await Qi(a, f);
    } catch (C) {
      throw C;
    }
    r(f), ue && !f.some((C) => C.id === ue) && Xt("");
    const m = f.find((C) => C.id === ue);
    return m && et(null), m && B && JSON.stringify(m) !== JSON.stringify(B) && (m.view.displayMode !== B.view.displayMode && q(Tn(m)), Xe(m) !== Xe(B) && (he(null), pe(m) === "video" && tr(m.id, {
      filter: Te(m.view.filter),
      objectFilter: m.view.objectFilter,
      searchMode: m.view.searchMode,
      startFrom: m.view.startFrom ?? "end"
    }), fe || ur(
      m,
      Te({ ...m.view.filter, page: ne.page })
    ))), !0;
  }
  if (s)
    return /* @__PURE__ */ n(kn, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ u(Re, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void _o().catch(
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
          message: d,
          onRetry: () => void nn()
        }
      )
    ] });
  return /* @__PURE__ */ u("div", { ref: Er, className: "data-quality-page", children: [
    /* @__PURE__ */ u("header", { className: "data-quality-header", children: [
      N && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: _,
          onClick: wi,
          children: /* @__PURE__ */ n(_n, {})
        }
      ),
      /* @__PURE__ */ u("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (N == null ? void 0 : N.name) ?? "Data Quality" }),
        (N == null ? void 0 : N.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: N.description })
      ] }),
      N && B && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: _ || K || !we,
          onClick: () => {
            fe ? vt((i) => i + 1) : (ge(!0), wt(!0));
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
          disabled: _ || K || !we,
          onClick: () => {
            ge(!1), wt(!0);
          },
          children: /* @__PURE__ */ n(Mi, {})
        }
      )
    ] }),
    p && /* @__PURE__ */ n("p", { className: "dq-status", children: p }),
    x && (ee == null ? void 0 : ee.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      ee.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: mt,
          onClick: () => {
            be(!0), ht(""), oo().then(dr).catch(
              (i) => ht(
                "Could not create the Confirmed absent tags custom field. " + (i instanceof Error ? i.message : "Request failed.")
              )
            ).finally(() => be(!1));
          },
          children: mt ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    x && ((ee == null ? void 0 : ee.kind) === "incompatible" || ar) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(xr, {}),
      ar || (ee == null ? void 0 : ee.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: mt,
          onClick: () => {
            be(!0), dr().finally(
              () => be(!1)
            );
          },
          children: mt ? "Checking…" : "Check again"
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
            const i = localStorage.getItem("page-videos") ?? "[]", f = URL.createObjectURL(
              new Blob([i], { type: "application/json" })
            ), m = document.createElement("a");
            m.href = f, m.download = "data-quality-unassigned-legacy-reviews.json", m.click(), URL.revokeObjectURL(f);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    v && /* @__PURE__ */ u("p", { role: "alert", children: [
      v,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            U(""), Ne(!1);
          },
          children: re ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    x && /* @__PURE__ */ u("label", { className: "dq-layout-control", children: [
      "Review layout",
      /* @__PURE__ */ u(
        "select",
        {
          "aria-label": "Review layout",
          value: Jt,
          disabled: _ || K || Y,
          onChange: (i) => et({ id: x.id, mode: i.target.value }),
          children: [
            /* @__PURE__ */ n("option", { value: "single", children: "Single video" }),
            /* @__PURE__ */ n("option", { value: "multiple", children: "Multiple videos" })
          ]
        }
      )
    ] }),
    N && B && !fe && /* @__PURE__ */ u("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${_ || K ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": _ || K || void 0,
          inert: _ || K ? !0 : void 0,
          children: /* @__PURE__ */ n(
            Fr,
            {
              filter: ce ? pt : ne,
              onFilterChange: Si,
              totalCount: Ee.totalCount,
              sortOptions: W === "tag" ? $n : Gr,
              showSearch: !0,
              showSort: !0,
              displayMode: g,
              onDisplayModeChange: (i) => q(Rn(i, W)),
              availableDisplayModes: W === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (D - 225) / 50,
              onZoomChange: (i) => L(Math.round(225 + i * 50)),
              cardSizeEntityType: W === "tag" ? "tags" : "videos",
              criteriaDefinitions: W === "tag" ? xn : Br,
              customFieldEntityType: W === "video" ? "video" : void 0,
              objectFilter: hi,
              onObjectFilterChange: (i) => {
                !_ && !K && (ut.current = W === "video" ? oi(
                  i,
                  Lt,
                  N.view.objectFilter
                ) : i);
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
            disabled: _ || K || !we,
            onClick: Ci,
            children: /* @__PURE__ */ n(Jr, {})
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Reset to default review filters",
            title: "Reset to default review filters",
            disabled: _ || K,
            onClick: Ei,
            children: /* @__PURE__ */ n(Ln, {})
          }
        )
      ] })
    ] }),
    N ? fe ? /* @__PURE__ */ n(bo, { review: N, canWrite: N.entityType === "performerOccurrence" ? I : S, onBusy: Ke, editRequest: Ze, renderRuleEditor: (i, f, m) => /* @__PURE__ */ n(fi, { workspace: !0, draft: i, entityTypeLocked: !0, tagGroups: R, saving: m, setDraft: (C) => f(C), onSave: () => {
    }, onCancel: () => {
    } }), onSaveDefaults: we ? (i) => qr(t.map((f) => f.id === i.id ? i : f)) : void 0 }, N.id) : /* @__PURE__ */ u(Re, { children: [
      x && ft.error && /* @__PURE__ */ n("p", { role: "alert", children: ft.error }),
      x && /* @__PURE__ */ n(
        So,
        {
          videos: Ee.items,
          review: x,
          trees: ft.ids,
          disabled: _ || K,
          onChoose: (i) => {
            const f = Eo(x, i);
            he(f), ur(f, { ...ne, page: 1 });
          }
        }
      ),
      De && !Q && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(xr, {}),
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
                  retryLabel: $e ? "Reset to review defaults" : "Retry",
                  onRetry: () => {
                    if ($e && B && pe(B) === "video") {
                      const i = Kt(B);
                      tr(B.id, { ...i, filter: { ...i.filter, page: void 0 } }), dt((f) => f + 1);
                      return;
                    }
                    Ct(
                      N,
                      ne,
                      $t,
                      xt
                    ).catch(() => {
                    });
                  }
                }
              ),
              !_ && !K && !ce && !Ee.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(Lr, {}),
                /* @__PURE__ */ u("p", { children: [
                  "No ",
                  W,
                  "s match this review."
                ] })
              ] }),
              !!Ee.items.length && /* @__PURE__ */ n("div", { ref: tn, children: /* @__PURE__ */ n(
                "div",
                {
                  className: g === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${D}px`
                  },
                  children: Ee.items.map(Ai)
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
                "aria-valuemin": Kr,
                "aria-valuemax": Vr,
                "aria-valuenow": z,
                "aria-valuetext": `${z} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (i) => {
                  sr.current = {
                    pointerId: i.pointerId,
                    startX: i.clientX,
                    startWidth: z
                  }, i.currentTarget.setPointerCapture(i.pointerId);
                },
                onPointerMove: (i) => {
                  const f = sr.current;
                  (f == null ? void 0 : f.pointerId) === i.pointerId && i.currentTarget.hasPointerCapture(i.pointerId) && Cr(
                    f.startWidth + f.startX - i.clientX
                  );
                },
                onPointerUp: () => {
                  sr.current = null;
                },
                onPointerCancel: () => {
                  sr.current = null;
                },
                onKeyDown: gi,
                onDoubleClick: () => Cr(Xr),
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
                    bi ? "Clear selection" : "Select all on page",
                    /* @__PURE__ */ n("kbd", { "aria-hidden": "true", children: "A" })
                  ]
                }
              ),
              /* @__PURE__ */ n("strong", { children: me.size > 0 ? Ar : ye == null ? "Nothing to apply to" : `Applies to the ${Ar}` }),
              N.actions.map((i, f) => {
                const m = "steps" in i ? i.steps.length > 0 : i.effect.mode !== "SKIP", C = "effect" in i && i.effect.mode === "SET_TAG_GROUP" ? i.effect.tagGroupId : null, $ = C != null ? R.find((F) => F.id === C) : void 0, A = C != null && !$;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    disabled: _ || K || !!ce || m && !Ot || "effect" in i && m && (!O || A) || mr(i) && (ee == null ? void 0 : ee.kind) !== "ready" || !yi.length,
                    onClick: () => void Rr(i),
                    children: [
                      /* @__PURE__ */ u("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: i.label }),
                        "effect" in i ? /* @__PURE__ */ n("small", { children: i.effect.mode === "SKIP" ? "Skip" : i.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : $ ? `Assign ${$.name}` : "Unavailable tag group" }) : i.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: i.steps.flatMap(
                          (F, ie) => F.tagIds.map((j, se) => {
                            const Ve = Zr[j] === void 0 ? "Tag" : Zr[j] ?? "Unavailable tag", Ge = ui(F, Ve), ot = To(F, Ve);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": di(F.mode),
                                "aria-label": ot,
                                title: `Step ${ie + 1}: ${ot}`,
                                children: Ge
                              },
                              `${ie}-${j}-${se}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      bt(i, f) && /* @__PURE__ */ n("kbd", { children: bt(i, f) })
                    ]
                  },
                  i.id
                );
              }),
              !N.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              !Ot && /* @__PURE__ */ u("p", { children: [
                W === "tag" ? "Tag" : "Video",
                " write permission is required to apply actions."
              ] }),
              W === "tag" && T && /* @__PURE__ */ u("p", { children: [
                "Tag groups are unavailable. ",
                T
              ] }),
              _ && /* @__PURE__ */ u("p", { role: "status", children: [
                /* @__PURE__ */ n(Un, { className: "dq-spin" }),
                " Applying action to",
                " ",
                _e,
                "…"
              ] }),
              /* @__PURE__ */ u("p", { className: "dq-shortcuts", children: [
                "←→↑↓ move · space select · enter ",
                W === "tag" ? "open" : "preview",
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
                (i) => je[i.id] !== void 0
              ) ? t.some((i) => je[i.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: Se,
                    onChange: (i) => qt(
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
                  onClick: () => kt(
                    (i) => i === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    jn,
                    {
                      className: le === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: Mt.map((i) => {
            const f = je[i.id], m = pe(i), C = m === "tag" ? "tag" : m === "performerOccurrence" ? "scene" : "video";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                disabled: _,
                onClick: () => Xt(i.id),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ u("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(ai, { entityType: m }),
                      /* @__PURE__ */ n("strong", { children: i.name })
                    ] }),
                    /* @__PURE__ */ n(
                      "span",
                      {
                        className: "dq-review-count",
                        "aria-label": f === void 0 ? `Counting matching ${C}s` : f === null ? `Matching ${C} count unavailable` : `${f.toLocaleString()} matching ${f === 1 ? C : `${C}s`}`,
                        children: f === void 0 ? "…" : f === null ? "—" : f.toLocaleString()
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
      /* @__PURE__ */ n(Lr, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    Q && Nt && x && /* @__PURE__ */ n(
      Po,
      {
        video: Nt,
        review: x,
        targetLabel: Ar,
        pending: _,
        refreshing: K || !!ce,
        error: De,
        canWrite: S,
        assessmentReady: (ee == null ? void 0 : ee.kind) === "ready",
        selected: me.has(Nt.id),
        hasPrevious: X.indexOf(Nt.id) > 0,
        hasNext: X.indexOf(Nt.id) >= 0 && X.indexOf(Nt.id) < X.length - 1,
        onToggleSelected: () => yt((i) => gr(i, Nt.id)),
        onPrevious: () => Tr(-1),
        onNext: () => Tr(1),
        onClose: () => {
          qe(!1), ve(Ie.current);
        },
        onAction: Rr
      }
    ),
    Y && /* @__PURE__ */ n(
      Fo,
      {
        reviews: t,
        activeReview: B,
        tagGroups: R,
        initialEdit: Fe,
        onSave: qr,
        onChoose: Xt,
        onEditWorkspace: (i) => {
          i !== ue && Xt(i), et({ id: i, mode: "single" }), vt((f) => f + 1), wt(!1);
        },
        onClose: () => {
          wt(!1), Fe && ve(Ie.current, !1);
        }
      }
    )
  ] });
  async function ur(i, f, m = !1) {
    const C = Ie.current, $ = Math.max(0, X.indexOf(C ?? -1));
    try {
      const F = (await Ct(
        i,
        f,
        m,
        i.view.selectAllOnLoad === !0
      )).items.map((j) => j.id);
      xe(
        (j) => new Set([...j].filter((se) => F.includes(se)))
      );
      const ie = gn(F, C, $);
      Ae(ie), Oe.current || ve(ie, !1);
    } catch {
    }
  }
  function Si(i) {
    const f = ut.current;
    if (ut.current = null, _ || K || !N || !B) return;
    const m = f ?? N.view.objectFilter, C = rr(
      m,
      B.view.objectFilter
    ) ? B.view.objectFilter : m, $ = Te({ ...i, page: 1 }), A = {
      ...N,
      view: {
        ...N.view,
        filter: $,
        objectFilter: C
      }
    }, F = Xe(A) !== Xe(B), ie = F ? A : B;
    he(F ? A : null), H(F ? "" : "Review queue defaults restored."), ur(ie, $, !0);
  }
  function Ei() {
    if (_ || K || !B) return;
    ut.current = null;
    const i = Te({
      ...B.view.filter,
      page: 1
    });
    he(null), H("Review queue defaults restored."), ur(
      B,
      i,
      B.view.startFrom !== "beginning"
    );
  }
  function Ci() {
    _ || K || !N || !B || !we || qr(
      t.map(
        (i) => i.id === ue ? {
          ...i,
          view: {
            ...N.view,
            filter: { ...ne, page: 1 }
          }
        } : i
      )
    ).then(() => {
      he(null), H("Queue saved to this review.");
    }).catch(
      (i) => it(
        i instanceof Error ? i.message : "Could not save queue."
      )
    );
  }
  function Ni() {
    xe(/* @__PURE__ */ new Set()), rt.current.clear(), Ae(null);
  }
  function sn(i) {
    return N ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: _ || K,
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
            onFilterChange: (f) => {
              _ || K || f.page === Number(ne.page) || qo(
                { ...ne, page: f.page },
                N,
                (m, C) => Ct(m, C, !1, xt),
                Ni
              );
            }
          }
        )
      }
    ) : null;
  }
  function Ai(i) {
    var m, C, $;
    if (W === "tag") {
      const A = i;
      return /* @__PURE__ */ n(
        Io,
        {
          tag: A,
          displayMode: g === "list" ? "list" : "grid",
          focused: A.id === ye,
          selected: me.has(A.id),
          setRef: (F) => {
            F ? Ht.current.set(A.id, F) : Ht.current.delete(A.id);
          },
          onFocus: () => Ae(A.id),
          onToggle: () => {
            yt((F) => gr(F, A.id)), ve(A.id, !1);
          },
          onOpen: () => window.open(`/tag/${A.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        A.id
      );
    }
    const f = i;
    return /* @__PURE__ */ n(
      Oo,
      {
        video: wo(f, x, ft.ids),
        showTagBins: ((C = (m = x == null ? void 0 : x.presentation) == null ? void 0 : m.annotations) == null ? void 0 : C.includes("tags")) && !!(($ = x.presentation.annotationParents) != null && $.length),
        displayMode: g,
        focused: f.id === ye,
        selected: me.has(f.id),
        setRef: (A) => {
          A ? Ht.current.set(f.id, A) : Ht.current.delete(f.id);
        },
        onFocus: () => Ae(f.id),
        onToggle: () => yt((A) => gr(A, f.id)),
        onPreview: () => {
          Ae(f.id), qe(!0);
        },
        onNavigate: e
      },
      f.id
    );
  }
}
function qo(e, t, r, o) {
  o(), r(t, e).catch(() => {
  });
}
function gr(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function ko(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Io({
  tag: e,
  displayMode: t,
  focused: r,
  selected: o,
  setRef: a,
  onFocus: c,
  onToggle: s,
  onOpen: h,
  onNavigate: d
}) {
  return /* @__PURE__ */ n(
    "article",
    {
      ref: a,
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${e.name}${o ? ", selected" : ""}`,
      onFocus: c,
      onClick: (y) => {
        c(), y.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${o ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        Ii,
        {
          tag: e,
          selected: o,
          onSelect: s,
          onClick: h,
          onNavigate: d
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
        /* @__PURE__ */ n("button", { type: "button", className: "dq-tag-list-name", onClick: h, children: e.name }),
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
function Oo({
  video: e,
  showTagBins: t,
  displayMode: r,
  focused: o,
  selected: a,
  setRef: c,
  onFocus: s,
  onToggle: h,
  onPreview: d,
  onNavigate: y
}) {
  var k, R;
  const S = si(e), E = M(null), I = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, b = !!(I.date || I.studioName), O = !!(I.performers.length || I.tags.length);
  return On(() => {
    const G = E.current;
    if (!G) return;
    const T = G.querySelector(
      `a[href="/video/${e.id}"]`
    ), oe = G.querySelector(".card-title"), we = `dq-card-title-${e.id}`;
    oe && (oe.id = we), T && (T.target = "_blank", T.rel = "noreferrer", T.removeAttribute("aria-label"), T.setAttribute("aria-labelledby", we), T.classList.add("dq-card-link"));
    const Pe = G.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    Pe && Pe.setAttribute(
      "aria-label",
      a ? `Deselect ${S}` : `Select ${S}`
    );
    const p = G.querySelector(
      'button[title="Quick View"]'
    );
    p && p.setAttribute("aria-label", `Preview ${S}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (G) => {
        E.current = G, c(G);
      },
      tabIndex: 0,
      "aria-current": o ? "true" : void 0,
      "aria-label": `${S}${a ? ", selected" : ""}`,
      onFocus: s,
      onClick: (G) => {
        s(), G.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${r} ${b ? "has-card-metadata" : "no-card-metadata"} ${O ? "has-card-footer" : "no-card-footer"} ${o ? "focused" : ""} ${a ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          Oi,
          {
            video: I,
            selected: a,
            onSelect: h,
            onNavigate: y,
            onQuickView: d,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ u("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (k = e.tags) == null ? void 0 : k.map((G) => /* @__PURE__ */ n("span", { children: G.name }, G.id)),
          !((R = e.tags) != null && R.length) && /* @__PURE__ */ n("small", { children: "No matching tags" })
        ] }),
        r === "wall" && /* @__PURE__ */ n(Mo, { video: e })
      ]
    }
  );
}
function Mo({ video: e }) {
  const t = M(null), r = M(null), [o, a] = w(!1), [c, s] = w(!1), [h, d] = w(!1);
  return V(() => {
    const y = t.current;
    if (!y || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      a(!0), s(!0);
      return;
    }
    const S = new IntersectionObserver(
      ([I]) => a(I.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), E = new IntersectionObserver(
      ([I]) => s(I.isIntersecting && I.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return S.observe(y), E.observe(y), () => {
      S.disconnect(), E.disconnect();
    };
  }, [e.id, e.files.length]), V(() => {
    if (!o) {
      d(!1);
      return;
    }
    const y = new AbortController();
    return J(ro(e.id), {
      signal: y.signal
    }).then((S) => {
      y.signal.aborted || d(S.available === !0);
    }).catch(() => {
      y.signal.aborted || d(!1);
    }), () => y.abort();
  }, [o, e.id]), V(() => {
    const y = r.current;
    y && (c ? Promise.resolve(y.play()).catch(() => {
    }) : y.pause());
  }, [h, c]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: h && /* @__PURE__ */ n(
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
function Po({
  video: e,
  review: t,
  targetLabel: r,
  pending: o,
  refreshing: a,
  error: c,
  canWrite: s,
  assessmentReady: h,
  selected: d,
  hasPrevious: y,
  hasNext: S,
  onToggleSelected: E,
  onPrevious: I,
  onNext: b,
  onClose: O,
  onAction: k
}) {
  const R = M(null), G = M(null), T = e.files[0], oe = si(e);
  V(() => {
    var P;
    const p = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (P = R.current) == null || P.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = p;
    };
  }, []);
  function we(p) {
    var U, re, Ne;
    if (p.key !== "Tab") return;
    const P = [
      ...((U = R.current) == null ? void 0 : U.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((de) => de.offsetParent !== null);
    if (!P.length) {
      p.preventDefault(), (re = R.current) == null || re.focus();
      return;
    }
    const v = P.indexOf(
      document.activeElement
    );
    p.shiftKey && v <= 0 ? (p.preventDefault(), (Ne = P.at(-1)) == null || Ne.focus()) : !p.shiftKey && v === P.length - 1 && (p.preventDefault(), P[0].focus());
  }
  function Pe(p) {
    if (p.defaultPrevented || p.ctrlKey || p.metaKey || p.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const P = p.key === "ArrowLeft" || p.key === "ArrowRight";
    if (p.altKey && !P) return;
    const v = G.current, U = p.currentTarget.querySelector("video");
    if (p.key === "Enter" || p.key === "Escape")
      p.repeat || O();
    else if (p.key === " " && v)
      p.repeat || v.toggle();
    else if (P && v)
      v.seekBy(
        (p.key === "ArrowLeft" ? -1 : 1) * (p.shiftKey ? 5 : p.altKey ? 10 : 60)
      );
    else if ((p.key === "," || p.key === ".") && v) {
      const re = [T == null ? void 0 : T.duration, U == null ? void 0 : U.duration].find(
        (de) => de != null && Number.isFinite(de) && de > 0
      ) ?? 0, Ne = e.parentVideoId != null ? (e.clipEndSec ?? re) - (e.clipStartSec ?? 0) : re;
      Number.isFinite(Ne) && Ne > 0 && v.seekBy((p.key === "," ? -1 : 1) * Ne * 0.1);
    } else if (p.key.toLowerCase() === "n" || p.key.toLowerCase() === "m")
      !p.repeat && !o && !a && (p.key.toLowerCase() === "n" && y && I(), p.key.toLowerCase() === "m" && S && b());
    else if (p.key === "ArrowUp" && U)
      U.volume = Math.min(1, U.volume + 0.1);
    else if (p.key === "ArrowDown" && U)
      U.volume = Math.max(0, U.volume - 0.1);
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
      "aria-label": `Review preview: ${oe}`,
      className: "dq-preview",
      onKeyDown: we,
      onKeyDownCapture: Pe,
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
              disabled: !y || o || a,
              onClick: I,
              children: /* @__PURE__ */ n(_n, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !S || o || a,
              onClick: b,
              children: /* @__PURE__ */ n(jn, {})
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
              onClick: E,
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
              "aria-label": `Open ${oe} details in new tab`,
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
              children: /* @__PURE__ */ n(Kn, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: T ? /* @__PURE__ */ n(
          Fn,
          {
            autostart: !0,
            streamUrl: Yn(e.id),
            posterUrl: wn(e),
            format: T.format,
            audioCodec: T.audioCodec,
            duration: T.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (p) => (G.current = p, () => {
              G.current === p && (G.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: wn(e), alt: "" }) }),
        c && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: c }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((p, P) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: o || a || p.steps.length > 0 && !s || mr(p) && !h,
            onClick: () => void k(p),
            children: [
              bt(p, P) && /* @__PURE__ */ n("kbd", { children: bt(p, P) }),
              p.label
            ]
          },
          p.id
        )) })
      ] })
    }
  );
}
function Fo({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: o = !1,
  onEditWorkspace: a,
  onSave: c,
  onChoose: s,
  onClose: h
}) {
  const [d, y] = w(
    () => o && t ? structuredClone(t) : null
  ), [S, E] = w(""), [I, b] = w(!1), [O, k] = w(
    o && t != null
  ), R = M(null);
  V(() => {
    var v, U;
    const p = document.activeElement, P = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (U = (v = R.current) == null ? void 0 : v.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || U.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = P, p == null || p.focus({ preventScroll: !0 });
    };
  }, []);
  function G(p) {
    var U, re, Ne;
    if (p.defaultPrevented) {
      p.stopPropagation();
      return;
    }
    if (p.key === "Escape") {
      ze(p), I || h();
      return;
    }
    if (p.key !== "Tab") {
      p.stopPropagation();
      return;
    }
    const P = [
      ...((U = R.current) == null ? void 0 : U.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((de) => de.offsetParent !== null);
    if (!P.length) {
      ze(p), (re = R.current) == null || re.focus();
      return;
    }
    const v = P.indexOf(
      document.activeElement
    );
    p.shiftKey && v <= 0 ? (ze(p), (Ne = P.at(-1)) == null || Ne.focus()) : !p.shiftKey && v === P.length - 1 ? (ze(p), P[0].focus()) : p.stopPropagation();
  }
  function T(p, P = !!p) {
    k(P), y(
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
    ), E("");
  }
  async function oe() {
    if (I) return;
    if (!d || hr(d)) {
      E(d ? hr(d) : "Choose a review.");
      return;
    }
    const p = { ...d, name: d.name.trim() }, P = e.some((v) => v.id === p.id) ? e.map((v) => v.id === p.id ? p : v) : [...e, p];
    b(!0), E("");
    try {
      if (!await c(P)) throw new Error("Could not save reviews.");
      !e.some((v) => v.id === p.id) && p.entityType !== "tag" ? a(p.id) : (s(p.id), h());
    } catch (v) {
      E(
        "Could not save reviews. Your edits are still open. " + (v instanceof Error ? v.message : "Retry saving.")
      );
    } finally {
      b(!1);
    }
  }
  async function we(p) {
    if (!I) {
      b(!0), E("");
      try {
        if (!await c(p)) throw new Error("Could not save reviews.");
      } catch (P) {
        E(
          P instanceof Error ? P.message : "Could not save reviews."
        );
      } finally {
        b(!1);
      }
    }
  }
  async function Pe(p) {
    var v;
    if (I) return;
    const P = (v = p.target.files) == null ? void 0 : v[0];
    if (p.target.value = "", !!P) {
      if (P.size > 2e6) {
        E("Review files must be smaller than 2 MB.");
        return;
      }
      b(!0), E("");
      try {
        const U = nr(await P.text());
        if (!await c(_r(e, U)))
          throw new Error("Could not save reviews.");
      } catch (U) {
        E(
          U instanceof Error ? U.message : "Could not import reviews."
        );
      } finally {
        b(!1);
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
      onKeyDown: G,
      children: /* @__PURE__ */ u("div", { className: "dq-manager", children: [
        /* @__PURE__ */ u("header", { children: [
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: d ? e.some((p) => p.id === d.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: I,
              onClick: h,
              children: /* @__PURE__ */ n(Kn, {})
            }
          )
        ] }),
        S && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: S }),
        /* @__PURE__ */ n("fieldset", { disabled: I, className: "dq-manager-content", children: d ? /* @__PURE__ */ n(
          fi,
          {
            setup: d.entityType !== "tag" && !e.some((p) => p.id === d.id),
            draft: d,
            entityTypeLocked: O,
            tagGroups: r,
            saving: I,
            setDraft: y,
            onSave: () => void oe(),
            onCancel: h
          }
        ) : /* @__PURE__ */ u(Re, { children: [
          /* @__PURE__ */ u("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: () => {
              const p = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), P = document.createElement("a");
              P.href = p, P.download = "data-quality-reviews.json", P.click(), URL.revokeObjectURL(p);
            }, children: "Export reviews" }),
            /* @__PURE__ */ u(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => T(),
                children: [
                  /* @__PURE__ */ n($i, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ u("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(xi, {}),
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
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((p) => /* @__PURE__ */ u("article", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ u("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(ai, { entityType: pe(p) }),
                /* @__PURE__ */ n("strong", { children: p.name })
              ] }),
              /* @__PURE__ */ n("p", { children: p.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => p.entityType === "tag" || pe(p) === "video" && p.view.reviewMode === "multiple" ? T(p) : a(p.id), children: [
              /* @__PURE__ */ n(Dn, {}),
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
                  window.confirm(`Delete review “${p.name}”?`) && we(
                    e.filter((P) => P.id !== p.id)
                  );
                },
                children: /* @__PURE__ */ n(Vn, {})
              }
            )
          ] }, p.id)) })
        ] }) })
      ] })
    }
  );
}
function fi({
  workspace: e = !1,
  setup: t = !1,
  draft: r,
  entityTypeLocked: o,
  tagGroups: a,
  saving: c = !1,
  setDraft: s,
  onSave: h,
  onCancel: d
}) {
  const [y, S] = w("Review"), E = pe(r), I = (k) => {
    if (!(o || k === E)) {
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
  }, b = M(/* @__PURE__ */ new WeakMap()), O = (k) => {
    let R = b.current.get(k);
    return R || (R = crypto.randomUUID(), b.current.set(k, R)), R;
  };
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      ki,
      {
        tabs: (t ? ["Review"] : e ? ["Review", ...E === "video" ? ["Appearance"] : [], "Actions", ...E === "performerOccurrence" ? ["Tag choices"] : []] : E === "performerOccurrence" ? ["Review", "Queue", "Actions", ...r.occurrence.tagIds.length ? ["Tag choices"] : []] : ["Review", "Queue", "Appearance", "Actions"]).map((k) => ({
          key: k,
          label: k,
          count: k === "Actions" ? r.actions.length : void 0,
          disabled: c
        })),
        activeTab: y,
        onTabChange: S
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
              value: E,
              disabled: o,
              onChange: (k) => I(k.target.value),
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
      !t && (!e || E === "video") && /* @__PURE__ */ n("section", { hidden: y !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(An, { draft: r, onChange: s, queue: !1 }) }),
      !t && /* @__PURE__ */ n("section", { hidden: y !== "Actions", className: "dq-editor-section", children: E === "tag" ? /* @__PURE__ */ n(
        xo,
        {
          draft: r,
          saving: c,
          tagGroups: a,
          setDraft: s
        }
      ) : /* @__PURE__ */ n(
        $o,
        {
          draft: r,
          saving: c,
          stepKey: O,
          rememberStepKey: (k, R) => b.current.set(k, O(R)),
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
            ), R = document.createElement("a");
            R.href = k, R.download = "data-quality-review.json", R.click(), URL.revokeObjectURL(k);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: d, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: h, children: t ? "Create & configure" : "Save review" })
    ] })
  ] });
}
function pi({
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
function $o({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: o,
  setDraft: a
}) {
  const c = (s, h) => a({
    ...e,
    actions: e.actions.map(
      (d, y) => y === s ? h : d
    )
  });
  return /* @__PURE__ */ u(Re, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    e.entityType === "performerOccurrence" && /* @__PURE__ */ n("p", { children: "Actions apply only to the active performer in this scene. Set performer matching in the review filters below. Save review keeps those criteria with this rule." }),
    /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      $r,
      {
        items: e.actions,
        getKey: (s) => s.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (s) => a({ ...e, actions: s }),
        renderItem: (s, { index: h, dragHandleProps: d, isOver: y }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: y ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ u("legend", { children: [
                "Action ",
                h + 1
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...d,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${h + 1}`,
                    children: /* @__PURE__ */ n(Qr, {})
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
                        ...e.actions.slice(0, h + 1),
                        {
                          ...structuredClone(s),
                          id: crypto.randomUUID(),
                          label: s.label + " copy"
                        },
                        ...e.actions.slice(h + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                pi,
                {
                  action: s,
                  onChange: (S) => c(h, S)
                }
              ),
              /* @__PURE__ */ n(
                $r,
                {
                  items: s.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (S) => c(h, { ...s, steps: S }),
                  renderItem: (S, E) => /* @__PURE__ */ n(
                    Lo,
                    {
                      occurrence: e.entityType === "performerOccurrence",
                      dragHandleProps: E.dragHandleProps,
                      saving: t,
                      isOver: E.isOver,
                      step: S,
                      index: E.index,
                      onChange: (I) => {
                        o(I, S), c(h, {
                          ...s,
                          steps: s.steps.map(
                            (b, O) => O === E.index ? I : b
                          )
                        });
                      },
                      onRemove: () => c(h, {
                        ...s,
                        steps: s.steps.filter(
                          (I, b) => b !== E.index
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
                    onClick: () => c(h, {
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
                        (S, E) => E !== h
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
function xo({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: o
}) {
  const a = (c, s) => o({
    ...e,
    actions: e.actions.map(
      (h, d) => d === c ? s : h
    )
  });
  return /* @__PURE__ */ u(Re, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      $r,
      {
        items: e.actions,
        getKey: (c) => c.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (c) => o({ ...e, actions: c }),
        renderItem: (c, { index: s, dragHandleProps: h, isOver: d }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: d ? "dq-action-card dq-drag-over" : "dq-action-card",
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
                    ...h,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${s + 1}`,
                    children: /* @__PURE__ */ n(Qr, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: c.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => o({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, s + 1),
                        {
                          ...structuredClone(c),
                          id: crypto.randomUUID(),
                          label: c.label + " copy"
                        },
                        ...e.actions.slice(s + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                pi,
                {
                  action: c,
                  onChange: (y) => a(s, y)
                }
              ),
              /* @__PURE__ */ u("label", { children: [
                "Action effect",
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: c.effect.mode === "SET_TAG_GROUP" ? `group:${c.effect.tagGroupId}` : c.effect.mode,
                    onChange: (y) => {
                      const S = y.target.value;
                      a(s, {
                        ...c,
                        effect: S === "SKIP" ? { mode: "SKIP" } : S === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : {
                          mode: "SET_TAG_GROUP",
                          tagGroupId: Number(S.slice(6))
                        }
                      });
                    },
                    children: [
                      /* @__PURE__ */ n("option", { value: "SKIP", children: "Skip" }),
                      /* @__PURE__ */ n("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
                      c.effect.mode === "SET_TAG_GROUP" && !r.some(
                        (y) => y.id === c.effect.tagGroupId
                      ) && /* @__PURE__ */ n(
                        "option",
                        {
                          value: `group:${c.effect.tagGroupId}`,
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
                      (y, S) => S !== s
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
function Lo({
  occurrence: e = !1,
  step: t,
  index: r,
  dragHandleProps: o,
  saving: a,
  isOver: c,
  onChange: s,
  onRemove: h
}) {
  const d = di(t.mode);
  return /* @__PURE__ */ u(
    "div",
    {
      className: c ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": d,
      children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            ...o,
            disabled: a,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${r + 1}`,
            children: /* @__PURE__ */ n(Qr, {})
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
          st,
          {
            entityType: "tag",
            values: t.tagIds,
            onChange: (y) => s({ ...t, tagIds: y }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: h, children: /* @__PURE__ */ n(Vn, {}) })
      ]
    }
  );
}
async function _o() {
  const e = await J("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let o = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const s = JSON.parse(r);
      Array.isArray(s.reviews) && (o = JSON.stringify(s.reviews, null, 2));
    } catch {
    }
  const a = URL.createObjectURL(
    new Blob([o], { type: "application/json" })
  ), c = document.createElement("a");
  c.href = a, c.download = "data-quality-browser-recovery.json", c.click(), URL.revokeObjectURL(a);
}
function kn({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(Un, { className: "dq-spin" }),
    e
  ] });
}
function In({
  message: e,
  onRetry: t,
  retryLabel: r = "Retry"
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(xr, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: r })
  ] });
}
const Go = { components: { DataQualityPage: Ro } };
export {
  Ro as DataQualityPage,
  Go as default,
  rr as objectFiltersEqual
};
