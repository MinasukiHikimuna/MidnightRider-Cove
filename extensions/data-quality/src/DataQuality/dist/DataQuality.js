import { jsxs as d, Fragment as ve, jsx as n } from "react/jsx-runtime";
import { useState as C, useRef as P, useEffect as J, useMemo as $t, useCallback as Ft, useLayoutEffect as Wn } from "react";
import { DetailListToolbar as sr, VIDEO_CRITERIA as Tr, PERFORMER_CRITERIA as Vr, VIDEO_SORT_OPTIONS as nn, EntityReferenceMultiSelector as pt, FilterDialog as Hn, DetailListPagination as Xn, VideoPlayer as Yn, useCustomFieldFilterSection as Xi, TAG_SORT_OPTIONS as Zn, TAG_CRITERIA as ei, EntityDetailTabs as Yi, TagTile as Zi, VideoCard as eo, SortableList as Br } from "@cove/runtime/components";
import { Save as on, RotateCcw as ti, ChevronLeft as ri, Pencil as ni, Settings as to, AlertTriangle as Gr, ChevronRight as ii, Film as Jr, Loader2 as oi, Tags as ro, ExternalLink as no, X as ai, Plus as io, Upload as oo, Trash2 as si, GripVertical as an } from "@cove/runtime/lucide-react";
import { extensionFetch as ao } from "@cove/runtime/api";
function we(e) {
  return e.entityType ?? "video";
}
function Nt(e, t) {
  return "qwertyuiop"[t] ?? "";
}
function Sr(e) {
  return e.entityType === "performerOccurrence" && !li(e.occurrence) ? "Complete the optional occurrence condition before saving." : we(e) !== "tag" && e.actions.some(
    (t) => ci(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => Lt(t, we(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
function Pe(e) {
  const t = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(1e3, t(e.perPage, 40)))
  };
}
function In(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function at(e) {
  const { page: t, ...r } = e.view.filter, i = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    e.entityType === "performerOccurrence" ? ["performerOccurrence", ...i, e.occurrence] : we(e) === "tag" ? ["tag", ...i] : i
  );
}
function Lt(e, t) {
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
    ].includes(i.mode) && i.tagIds.length > 0 && i.tagIds.every((s) => Number.isSafeInteger(s) && s > 0)
  ) && !ci(e) : !1;
}
function xt(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function ht(e) {
  return "steps" in e ? e.steps.some((t) => xt(t.mode)) : !1;
}
function ci(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.steps)
    if (xt(r.mode))
      for (const i of r.tagIds) {
        const s = t.get(i);
        if (s && s !== r.mode) return !0;
        t.set(i, r.mode);
      }
  return !1;
}
function dr(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || r.entityType === "video" || r.entityType === "tag" || r.entityType === "performerOccurrence") && (r.entityType !== "performerOccurrence" || li(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && (r.view.reviewMode === void 0 || ["single", "multiple"].includes(r.view.reviewMode)) && (r.view.selectAllOnLoad === void 0 || typeof r.view.selectAllOnLoad == "boolean") && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && so(r.presentation, r.entityType === "tag") && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (r.entityType === "tag" ? "effect" in i && !("steps" in i) && Lt(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (s) => s && Array.isArray(s.tagIds)
      ) && Lt(i, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => Sr(r)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function so(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const r = e;
  return (r.cardSize === void 0 || r.cardSize === null || Number.isFinite(r.cardSize) && r.cardSize >= 115 && r.cardSize <= 380) && (!t || r.annotations === void 0 && r.annotationParents === void 0 && r.binParents === void 0) && (r.annotations === void 0 || Array.isArray(r.annotations) && r.annotations.every(
    (i) => ["date", "studio", "performers", "tags"].includes(i)
  )) && [r.annotationParents, r.binParents].every(
    (i) => i === void 0 || Array.isArray(i) && i.every((s) => Number.isSafeInteger(s) && s > 0)
  );
}
function Qr(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const s of i)
      r.has(s.id) || (r.add(s.id), t.push(s));
  return t;
}
function li(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (i) => Array.isArray(i) && i.every((s) => Number.isSafeInteger(s) && s > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && (t.targetMode !== "selected" || t.performerIds.length > 0) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && ["any", "includes", "includesAll", "excludes", "isNull"].includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && r(t.tagIds) && typeof t.multiple == "boolean";
}
function Mn(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function Pn(e, t, r, i) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!i && t.includes(r)) return r;
  const s = Math.max(0, e.indexOf(r));
  if (i) {
    for (const c of e.slice(s + 1))
      if (t.includes(c)) return c;
    if (t.includes(r)) {
      for (const c of e.slice(0, s).reverse())
        if (t.includes(c)) return c;
      return r;
    }
  }
  return t[Math.min(s, t.length - 1)];
}
function Fn(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((s) => r.has(s));
  for (const s of t)
    i ? r.delete(s) : r.add(s);
  return r;
}
function di(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function co(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-actions, .dq-pagination-row, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function lo(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function uo(e, t) {
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
const ui = "ext:com.midnightrider.data-quality:configuration", fo = "ext:cove-data-quality:video-reviews", zr = "ext:com.midnightrider.data-quality:progress", ur = /* @__PURE__ */ new Map(), wr = /* @__PURE__ */ new Map(), Jt = (e, t) => e.includes("*") || e.includes(t), Cr = (e) => W(`/api/savedfilters?mode=${encodeURIComponent(e)}`), po = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Wr(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Qt(e) {
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
    reviews: dr(JSON.stringify(t.reviews)),
    deletedIds: Wr(t.deletedIds),
    importedIds: Wr(t.importedIds)
  };
}
function go(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const s of t) {
    const c = localStorage.getItem(s);
    if (c !== null) {
      const o = dr(c);
      r ?? (r = o), o.forEach((f) => i.add(f.id));
    }
    Wr(
      JSON.parse(localStorage.getItem(`${s}:account-imports`) ?? "[]")
    ).forEach((o) => i.add(o));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function fi(e) {
  const t = await W("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function pi(e, t) {
  const r = (wr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return wr.set(e, r), r.finally(() => {
    wr.get(e) === r && wr.delete(e);
  }).catch(() => {
  }), r;
}
let ir = null;
function ho() {
  if (ir) return ir;
  const e = mo();
  return ir = e, e.finally(() => {
    ir === e && (ir = null);
  }).catch(() => {
  }), e;
}
async function mo() {
  var T;
  const e = await W("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = Jt(e.permissions, "savedfilters.read"), s = i && Jt(e.permissions, "savedfilters.write"), c = i ? (await Cr(ui)).filter((y) => y.name === "Data Quality configuration").sort((y, R) => y.id - R.id) : [];
  if (c.length > 1) {
    const y = (R) => {
      const { revision: M, ...x } = Qt(R.uiOptions);
      return JSON.stringify(x);
    };
    if (c.some((R) => y(R) !== y(c[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (s)
      for (const R of c.slice(1))
        await W(`/api/savedfilters/${R.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${R.id}` })
        });
    c.splice(1);
  }
  let o = c.length ? Qt(c[0].uiOptions) : po();
  const f = localStorage.getItem(`${r}:migrated`) === "true", u = localStorage.getItem(r), g = localStorage.getItem(`${r}:local-only`) === "true";
  !c.length && u && (o = Qt(u));
  let v = !c.length;
  if (c.length && g && u) {
    const y = Qt(u);
    if (y.reviews.some((M) => {
      const x = o.reviews.find((F) => F.id === M.id);
      return x && JSON.stringify(x) !== JSON.stringify(M);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const R = [
      .../* @__PURE__ */ new Set([...o.deletedIds, ...y.deletedIds])
    ];
    o = {
      ...o,
      reviews: Qr(o.reviews, y.reviews).filter(
        (M) => !R.includes(M.id)
      ),
      deletedIds: R,
      importedIds: [
        .../* @__PURE__ */ new Set([...o.importedIds, ...y.importedIds])
      ]
    }, v = !0;
  }
  if (!f) {
    const y = JSON.stringify(o), R = go(t);
    if (c.length && R.reviews.some((D) => {
      const $ = o.reviews.find((fe) => fe.id === D.id);
      return $ && JSON.stringify($) !== JSON.stringify(D);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const M = i ? (await Cr(fo)).flatMap(
      (D) => dr(D.uiOptions ?? "[]")
    ) : [], x = R.known.filter(
      (D) => !R.reviews.some(($) => $.id === D)
    ), F = /* @__PURE__ */ new Set([...o.deletedIds, ...x]);
    o = {
      ...o,
      reviews: Qr(
        R.reviews,
        o.reviews,
        M.filter(
          (D) => !R.known.includes(D.id) && !o.importedIds.includes(D.id)
        )
      ).filter((D) => !F.has(D.id)),
      deletedIds: [...F],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...o.importedIds,
          ...R.known,
          ...M.map((D) => D.id)
        ])
      ]
    }, v || (v = JSON.stringify(o) !== y);
  }
  const S = {
    userId: t,
    recordId: (T = c[0]) == null ? void 0 : T.id,
    config: o,
    readable: i,
    writable: s,
    durable: s
  };
  if (ur.set(r, S), v && s) {
    const y = o;
    c.length && (S.config = Qt(c[0].uiOptions)), await gi(r, y), o = S.config;
  } else c.length || (localStorage.setItem(r, JSON.stringify(o)), !i && (!f || g) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (s)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: o.reviews,
    storageKey: r,
    canWrite: Jt(e.permissions, "videos.write"),
    canWriteVideos: Jt(e.permissions, "videos.write"),
    canWriteTags: Jt(e.permissions, "tags.write"),
    canReadTagGroups: Jt(e.permissions, "taggroups.read"),
    canConfigure: !i || s,
    storageNotice: i ? s ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function gi(e, t) {
  const r = ur.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await fi(r), r.recordId != null) {
      const c = await W(
        `/api/savedfilters/${r.recordId}`
      );
      if (Qt(c.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const s = await W(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: ui,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(i)
        })
      }
    );
    r.recordId = s.id;
  } else
    localStorage.setItem(e, JSON.stringify(i)), localStorage.setItem(`${e}:local-only`, "true");
  if (r.config = i, r.durable)
    try {
      localStorage.setItem(e, JSON.stringify(i)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function bo(e, t) {
  return dr(JSON.stringify(t)), pi(e, async () => {
    const r = ur.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((s) => !t.some((c) => c.id === s.id)).map((s) => s.id);
    await gi(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((s) => !t.some((c) => c.id === s))
    });
  });
}
function $n(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([r, i]) => /^[1-9]\d*:[1-9]\d*$/.test(r) && ["reviewed", "cannotDetermine"].includes(String(i)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function yo(e, t) {
  const r = ur.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), s = i ? $n(i) : null;
  if (!r.readable) return s;
  const c = (await Cr(zr)).find(
    (f) => f.name === t
  ), o = c ? $n(c.uiOptions) : null;
  return s && (!o || s.updatedAt > o.updatedAt) ? s : o;
}
function wo(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return pi(i, async () => {
    const s = ur.get(e);
    if (!(s != null && s.writable)) return;
    await fi(s);
    const c = (await Cr(zr)).find(
      (o) => o.name === t
    );
    await W(
      c ? `/api/savedfilters/${c.id}` : "/api/savedfilters",
      {
        method: c ? "PUT" : "POST",
        body: JSON.stringify({
          mode: zr,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Er = "confirmed_absent_tags", sn = "Confirmed absent tags", Rr = "confirmed_absent_occurrence_tags", hi = {
  key: Er,
  label: sn,
  type: "tag",
  subject: "tag assessments"
}, cn = {
  key: Rr,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, vo = {
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
      t === "modifier" && typeof r == "string" ? vo[r] ?? r : t === "key" && typeof r == "string" && [
        Er,
        Rr
      ].includes(r.toLowerCase()) ? r.toLowerCase() : Wt(r)
    ])
  ) : e;
}
async function W(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await ao(e, { ...t, headers: r });
  if (!i.ok) {
    let c = i.statusText || `Request failed (${i.status}).`;
    try {
      const o = await i.json();
      c = o.message || o.detail || o.error || c;
    } catch {
    }
    throw new Error(c);
  }
  if (i.status === 204 || i.status === 205) return;
  const s = await i.text();
  return s ? JSON.parse(s) : void 0;
}
const So = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Co = 0;
function Hr(e) {
  return W(`/api/videos/${e}?dqRead=${So}-${++Co}`, { cache: "no-store" });
}
async function or(e, t, r) {
  const i = { ...e.view.objectFilter }, s = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return W("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Wt({
        findFilter: Pe(t),
        objectFilter: i,
        filterExpression: s
      })
    )
  });
}
async function xn(e, t, r) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, W("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Wt({
        findFilter: Pe(t),
        objectFilter: i
      })
    )
  });
}
function Eo(e) {
  return W("/api/taggroups", { signal: e });
}
function No(e) {
  return `/api/videos/${e.id}/image?max=1280&v=${encodeURIComponent(e.updatedAt)}`;
}
function mi(e) {
  return `/api/stream/video/${e}`;
}
function Ln(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Ao(e) {
  return `/api/stream/video/${e}/preview`;
}
function To(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Ro(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function fr(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const i of e) {
    await W(`/api/tags/${i}`, { signal: t }), r.add(i);
    for (let s = 1; ; s++) {
      const c = await W("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Wt({
            findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
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
      for (const o of c.items) r.add(o.id);
      if (s * 1e3 >= c.totalCount) break;
      if (!c.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...r];
}
function ko(e, t) {
  const r = [];
  return t.type !== e.type && r.push(`type "${e.type}"`), t.isMultiValue || r.push("multiple values enabled"), t.entityTypes.includes("video") || r.push("video applicability"), t.filterable || r.push("filtering enabled"), r.length ? `The ${e.key} custom field is incompatible. It must have ${r.join(", ")}.` : "";
}
async function ln(e) {
  const r = (await W("/api/custom-fields")).find(
    (s) => s.key.toLowerCase() === e.key
  );
  if (!r)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = ko(e, r);
  return i ? { kind: "incompatible", message: i } : { kind: "ready", definition: r, message: "" };
}
async function bi(e) {
  const t = await ln(e);
  if (t.kind !== "ready") {
    if (t.kind === "incompatible") throw new Error(t.message);
    await W("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: e.key,
        label: e.label,
        type: e.type,
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function yi() {
  return ln(hi);
}
function qo() {
  return bi(hi);
}
function wi() {
  return ln(cn);
}
function Oo() {
  return bi(cn);
}
function Nr(e) {
  return [...new Set(e)];
}
function vi(e, t) {
  const r = e.customFields ?? {}, i = Object.keys(r).find(
    (c) => c.toLowerCase() === Rr
  ), s = i === void 0 ? [] : r[i];
  return Nr(
    (Array.isArray(s) ? s : []).filter(
      (c) => typeof c == "string" && /^[1-9]\d*:[1-9]\d*$/.test(c)
    ).map((c) => c.split(":").map(Number)).filter(([c]) => c === t).map(([, c]) => c)
  );
}
async function Io() {
  let e;
  try {
    e = await wi();
  } catch (t) {
    throw new Error(
      `Could not verify the ${cn.label} custom field. ${t instanceof Error ? t.message : "Request failed."}`
    );
  }
  if (e.kind !== "ready") throw new Error(e.message);
  return e.definition.key;
}
async function Mo(e, t, r, i, s) {
  await W("/api/videos/bulk", {
    method: "POST",
    body: JSON.stringify({
      ids: [t],
      customFields: {
        [e]: Nr(i).map((c) => `${r}:${c}`)
      },
      customFieldMode: s
    })
  });
}
function Po(e, t, r) {
  const i = [...e.tagIds], s = (c) => {
    if (r === null)
      throw new Error(
        `The ${sn} custom field is not available.`
      );
    return { customFields: { [r]: i }, customFieldMode: c };
  };
  switch (e.mode) {
    case "ADD":
      return { ids: t, tagIds: i, tagMode: "ADD" };
    case "REMOVE":
    case "REMOVE_TREE":
      return { ids: t, tagIds: i, tagMode: "REMOVE" };
    case "MARK_PRESENT":
      return { ids: t, tagIds: i, tagMode: "ADD", ...s("REMOVE") };
    case "MARK_ABSENT":
      return { ids: t, tagIds: i, tagMode: "REMOVE", ...s("ADD") };
    case "CLEAR_ABSENCE":
      return { ids: t, ...s("REMOVE") };
  }
}
async function Si(e, t) {
  if (!Lt(e) || t.length === 0 || t.some((f) => !Number.isSafeInteger(f) || f <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  let r = null;
  if (ht(e)) {
    let f;
    try {
      f = await yi();
    } catch (u) {
      throw new Error(
        `Could not verify the ${sn} custom field. ${u instanceof Error ? u.message : "Request failed."}`
      );
    }
    if (f.kind !== "ready") throw new Error(f.message);
    r = f.definition.key;
  }
  const i = Nr(t), s = await Promise.all(
    e.steps.map(async (f) => ({
      mode: f.mode,
      tagIds: f.mode === "REMOVE_TREE" ? await fr(f.tagIds) : Nr(f.tagIds)
    }))
  ), o = [
    ...s.filter((f) => !xt(f.mode)),
    ...s.filter((f) => xt(f.mode))
  ].map(
    (f) => Po(f, i, r)
  );
  for (let f = 0; f < o.length; f++)
    try {
      await W("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify(o[f])
      });
    } catch (u) {
      throw new Error(
        `Step ${f + 1} failed; ${f} earlier step(s) completed. Refresh and check the selected videos before retrying. ${u instanceof Error ? u.message : "Request failed."}`
      );
    }
}
async function Fo(e, t) {
  if (!Lt(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await W("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
function Ar(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function dn(e) {
  return String(e.type).toLowerCase() === "tag";
}
function un(e) {
  return !!String(e ?? "").trim();
}
function fn(e) {
  return [
    ...new Set(
      Ar(e.customFieldCriteria).filter(dn).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !un(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function pn(e, t) {
  const r = Ar(e.customFieldCriteria);
  if (!r.length) return e;
  let i = !1;
  const s = r.map((c) => {
    if (!dn(c)) return c;
    const o = { ...c };
    for (const [f, u] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const g = t[String(c[f] ?? "")];
      g && !un(c[u]) && (o[u] = g, i = !0);
    }
    return o;
  });
  return i ? { ...e, customFieldCriteria: s } : e;
}
function Ci(e, t, r) {
  const i = Ar(e.customFieldCriteria);
  if (!i.length) return e;
  const s = Ar(r.customFieldCriteria), c = (u, g) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (v) => (u[v] ?? void 0) === (g[v] ?? void 0)
  );
  let o = !1;
  const f = i.map((u) => {
    if (!dn(u)) return u;
    const g = s.find((S) => c(S, u));
    if (!g) return u;
    const v = { ...u };
    for (const [S, T] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const y = t[String(u[S] ?? "")];
      y && u[T] === y && !un(g[T]) && (delete v[T], o = !0);
    }
    return v;
  });
  return o ? { ...e, customFieldCriteria: f } : e;
}
async function $o(e, t, r) {
  if (!Lt(r))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const i = r.steps.some((o) => xt(o.mode)) ? await Io() : "", s = await Promise.all(
    r.steps.map(async (o) => ({
      ...o,
      tagIds: o.mode === "REMOVE_TREE" ? await fr(o.tagIds) : o.tagIds
    }))
  );
  let c = t.applications;
  for (const o of [
    ...s.filter((f) => !xt(f.mode)),
    ...s.filter((f) => xt(f.mode))
  ]) {
    const f = (u) => Mo(
      i,
      t.video.id,
      t.performer.id,
      o.tagIds,
      u
    );
    (o.mode === "MARK_PRESENT" || o.mode === "CLEAR_ABSENCE") && await f("REMOVE"), o.mode !== "CLEAR_ABSENCE" && (c = await Ti(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: o.tagIds,
          multiple: !0
        }
      },
      t,
      ["ADD", "MARK_PRESENT"].includes(o.mode) ? o.tagIds : []
    )), o.mode === "MARK_ABSENT" && await f("ADD");
  }
  return c;
}
async function gn(e, t) {
  const r = e.occurrence;
  if (r.targetMode === "all" || r.targetMode === "filter" && Object.keys(r.performerFilter).length === 0) return null;
  if (r.targetMode === "selected") return r.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: s, ...c } = r.performerFilter;
  for (let o = 1; ; o++) {
    const f = await W("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Wt({
          findFilter: { page: o, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: c,
          filterExpression: s
        })
      )
    });
    if (f.items.forEach((u) => i.add(u.id)), o * 1e3 >= f.totalCount) return [...i];
    if (!f.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Ei(e) {
  return e.condition === "excludes" && e.hideConfirmedAbsent !== !1;
}
function Ni(e, t) {
  const { _filterExpression: r, ...i } = e.view.objectFilter, s = e.occurrence, c = {
    mode: "atLeastOne",
    conditionOperator: "and",
    ...t === null ? {} : {
      performerIdsCriterion: { modifier: "includes", value: t }
    },
    ...s.condition === "any" ? {} : {
      performerOccurrenceTagsCriterion: {
        modifier: s.condition,
        value: s.conditionTagIds,
        depth: s.includeSubtags === !1 ? 0 : -1
      }
    }
  }, o = Ei(s) && (t == null ? void 0 : t.length) === 1 && s.conditionTagIds.length === 1 ? `${t[0]}:${s.conditionTagIds[0]}` : null;
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
            { filter: i },
            { filter: { performerFilterCriterion: c } },
            ...o ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: Rr,
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
function xo(e, t, r = e.conditionTagIds.map((i) => [i])) {
  const i = new Set(t), s = (c) => c.some((o) => i.has(o));
  switch (e.condition) {
    case "any":
      return !0;
    case "isNull":
      return i.size === 0;
    case "includes":
      return r.some(s);
    case "includesAll":
      return r.every(s);
    case "excludes":
      return !r.some(s);
  }
}
function Lo(e, t, r) {
  if (!Ei(e)) return !1;
  const i = vi(t, r);
  return e.conditionTagIds.every((s) => i.includes(s));
}
async function Ai(e, t, r, i) {
  if ((t == null ? void 0 : t.length) === 0)
    return { items: [], totalCount: 0 };
  const s = await or(
    Ni(e, t),
    { ...e.view.filter, page: r },
    i
  ), c = t === null ? null : new Set(t), o = e.occurrence, f = s.items.length && o.includeSubtags !== !1 && !["any", "isNull"].includes(o.condition) ? await Promise.all(o.conditionTagIds.map((v) => fr([v], i))) : o.conditionTagIds.map((v) => [v]), u = new Array(s.items.length);
  let g = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, s.items.length) }, async () => {
      for (; g < s.items.length; ) {
        const v = g++, S = s.items[v], T = await W(
          `/api/tagapplications?hostType=video&hostId=${S.id}&contextType=performer`,
          { signal: i }
        );
        u[v] = S.performers.filter((y) => c === null || c.has(y.id)).flatMap((y) => {
          const R = T.filter(
            (M) => M.hostType === "video" && M.hostId === S.id && M.contextType === "performer" && M.contextId === y.id
          );
          return xo(
            e.occurrence,
            R.map((M) => M.tag.id),
            f
          ) && !Lo(o, S, y.id) ? [
            {
              key: `${S.id}:${y.id}`,
              video: S,
              performer: y,
              applications: R
            }
          ] : [];
        });
      }
    })
  ), { items: u.flat(), totalCount: s.totalCount };
}
async function Ti(e, t, r) {
  const i = new Set(e.occurrence.tagIds);
  if (r.some((u) => !i.has(u)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const s = await Hr(t.video.id);
  if (!s.performers.some(
    (u) => u.id === t.performer.id
  ))
    throw new Error(
      "This performer is no longer linked to the scene. Refresh the queue."
    );
  const c = `/api/tagapplications?hostType=video&hostId=${s.id}&contextType=performer&contextId=${t.performer.id}`, o = (await W(c)).filter(
    (u) => u.hostType === "video" && u.hostId === s.id && u.contextType === "performer" && u.contextId === t.performer.id
  ), f = new Set(r);
  try {
    for (const u of f)
      o.some((g) => g.tag.id === u) || await W("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: "video",
          hostId: s.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: u,
          sourceKey: "user"
        })
      });
    for (const u of o)
      i.has(u.tag.id) && !f.has(u.tag.id) && await W(`/api/tagapplications/${u.id}`, {
        method: "DELETE"
      });
    return await W(c);
  } catch (u) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${u instanceof Error ? u.message : "Request failed."}`
    );
  }
}
function gt(e, t) {
  return {
    added: t.filter((r) => !e.includes(r)),
    removed: e.filter((r) => !t.includes(r))
  };
}
function Do(e) {
  return `/api/tagapplications?hostType=video&hostId=${e.video.id}&contextType=performer&contextId=${e.occurrence.performer.id}`;
}
async function tt(e, t = !0) {
  var o;
  if (e.occurrence) {
    const f = t ? vi(
      await Hr(e.video.id),
      e.occurrence.performer.id
    ) : [], u = (await W(Do(e))).filter(
      (g) => g.hostType === "video" && g.hostId === e.video.id && g.contextType === "performer" && g.contextId === e.occurrence.performer.id
    );
    return {
      ids: [...new Set(u.map((g) => g.tag.id))],
      names: [...new Set(u.map((g) => g.tag.name))],
      absent: f,
      applications: u
    };
  }
  const r = await Hr(e.video.id), i = (r.tags ?? []).filter(
    (f) => f.canRemove !== !1 || f.isDerived !== !0
  ), s = Object.keys(r.customFields ?? {}).find(
    (f) => f.toLowerCase() === Er
  ) ?? Er, c = ((o = r.customFields) == null ? void 0 : o[s]) ?? [];
  if (!Array.isArray(c) || c.some((f) => !Number.isSafeInteger(f)))
    throw new Error(
      "Confirmed absent tags are invalid. Inspect the video before editing."
    );
  return { ids: i.map((f) => f.id), names: i.map((f) => f.name), absent: c };
}
async function hn(e, t, r) {
  if (t.occurrence && e.entityType === "performerOccurrence")
    await Ti(
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
    for (const [i, s] of [
      ["ADD", r.added],
      ["REMOVE", r.removed]
    ])
      s.length && await W("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({ ids: [t.video.id], tagMode: i, tagIds: s })
      });
}
async function _o(e, t, r) {
  t.occurrence && e.entityType === "performerOccurrence" ? await $o(e, t.occurrence, r) : await Si(r, [t.video.id]);
}
function Xr(e, t, r, i) {
  const s = (c) => c.filter((o) => i.includes(o));
  return {
    item: e,
    before: t,
    after: r,
    tags: gt(s(t.ids), s(r.ids)),
    absence: gt(s(t.absent), s(r.absent))
  };
}
function jo(e, t) {
  var r;
  for (const [i, s] of [
    [e.tags, t.ids],
    [e.absence, t.absent]
  ])
    if (i.added.some((c) => !s.includes(c)) || i.removed.some((c) => s.includes(c)))
      throw new Error(
        "Undo conflict: affected tags changed since this operation. Inspect the item; no undo changes were made."
      );
  if (t.applications)
    for (const i of e.tags.added) {
      const s = (r = e.after.applications) == null ? void 0 : r.filter((o) => o.tag.id === i).map((o) => o.id).sort(), c = t.applications.filter((o) => o.tag.id === i).map((o) => o.id).sort();
      if (JSON.stringify(s) !== JSON.stringify(c))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
const Yr = (e) => e instanceof Error ? e.message : "Request failed.", Dn = (e) => [...e].sort((t, r) => t - r), cr = (e, t) => JSON.stringify(Dn(e)) === JSON.stringify(Dn(t)), Zr = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Ri(e, t) {
  const r = new Set(e);
  for (const i of t.steps)
    for (const s of i.tagIds)
      i.mode === "ADD" ? r.add(s) : r.delete(s);
  return [...r];
}
async function Uo(e, t, r, i = () => {
}) {
  if (!Lt(t, "performerOccurrence") || !t.steps.length || t.steps.some(
    (g) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(g.mode)
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const s = structuredClone(e), c = structuredClone(t);
  for (const g of c.steps)
    g.mode === "REMOVE_TREE" && (g.tagIds = await fr(g.tagIds, r), g.mode = "REMOVE");
  r.throwIfAborted();
  const o = [...new Set(c.steps.flatMap((g) => g.tagIds))];
  s.view.filter = {
    ...s.view.filter,
    page: 1,
    perPage: 250,
    sort: "id",
    direction: "asc",
    sorts: void 0
  };
  const f = await gn(s, r), u = /* @__PURE__ */ new Map();
  for (let g = 1; ; g++) {
    r.throwIfAborted();
    const v = await Ai(s, f, g, r);
    for (const S of v.items) {
      const T = {
        ids: [...new Set(S.applications.map((R) => R.tag.id))],
        names: S.applications.map((R) => R.tag.name),
        absent: [],
        applications: S.applications
      }, y = Ri(T.ids, c);
      u.set(S.key, {
        item: { key: S.key, video: S.video, occurrence: S },
        before: T,
        expected: T,
        desired: y,
        conflict: gt(T.ids, y).removed.length > 0,
        status: cr(T.ids, y) ? "unchanged" : "pending"
      });
    }
    if (i(u.size), g * 250 >= v.totalCount) break;
    if (g > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return r.throwIfAborted(), { review: s, action: c, touched: o, entries: [...u.values()] };
}
function Ko(e, t, r) {
  const i = (c) => c.ids.filter((o) => r.includes(o));
  if (!cr(i(e), i(t))) return !1;
  const s = (c) => (c.applications ?? []).filter((o) => r.includes(o.tag.id)).map((o) => o.id);
  return cr(s(e), s(t));
}
async function ki(e, t, r, i) {
  let s = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; !t() && s < e.length; ) {
        const c = e[s++];
        await r(c), i();
      }
    })
  );
}
async function Vo(e, t, r, i, s = !1) {
  const c = e.entries.filter(
    (o) => s ? o.status === "failed" : o.status === "pending"
  );
  await ki(
    c,
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
        if (f = await tt(o.item, !1), !Ko(o.expected, f, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (T) {
        o.status = "failed", o.error = Yr(T);
        return;
      }
      const u = Ri(f.ids, e.action), g = gt(f.ids, u);
      let v;
      try {
        await hn(e.review, o.item, g);
      } catch (T) {
        v = T;
      }
      let S = !1;
      try {
        const T = await tt(o.item, !1);
        S = !0, o.expected = T;
        const y = Xr(
          o.item,
          o.before,
          T,
          e.touched
        );
        if (o.operation = Zr(y) ? y : void 0, v) throw v;
        if (!cr(
          T.ids.filter((R) => e.touched.includes(R)),
          u.filter((R) => e.touched.includes(R))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (T) {
        if (o.status = "failed", o.error = Yr(T), !S)
          try {
            const y = await tt(o.item, !1);
            o.expected = y;
            const R = Xr(
              o.item,
              o.before,
              y,
              e.touched
            );
            o.operation = Zr(R) ? R : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    i
  );
}
async function Bo(e, t, r) {
  await ki(
    e.entries.filter((i) => i.operation),
    t,
    async (i) => {
      const s = i.operation;
      if (i.unverified) {
        i.error = "Undo unavailable: the previous write could not be verified. Inspect this occurrence.";
        return;
      }
      const c = [...s.tags.added, ...s.tags.removed];
      let o = !1;
      try {
        const f = await tt(i.item, !1);
        jo(s, f), o = !0, await hn(e.review, i.item, {
          added: s.tags.removed,
          removed: s.tags.added
        });
        const u = await tt(i.item, !1);
        if (!cr(
          u.ids.filter((g) => c.includes(g)),
          i.before.ids.filter((g) => c.includes(g))
        ))
          throw new Error("Undo did not restore all affected tags.");
        i.operation = void 0, i.expected = u, i.status = "unchanged", i.error = void 0;
      } catch (f) {
        if (i.error = `Undo stopped: ${Yr(f)}`, i.status = "failed", o)
          try {
            const u = await tt(i.item, !1), g = Xr(
              i.item,
              i.before,
              u,
              c
            );
            i.operation = Zr(g) ? g : void 0, i.expected = u;
          } catch {
            i.unverified = !0;
          }
      }
    },
    r
  );
}
async function _n(e, t, r) {
  const i = new Array(e.length);
  let s = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; s < e.length; ) {
        r.throwIfAborted();
        const c = s++, o = e[c];
        try {
          i[c] = [
            o,
            (await W(`/api/${t}/${o}`, {
              signal: r
            })).name
          ];
        } catch {
          r.throwIfAborted(), i[c] = [
            o,
            `${t === "tags" ? "Tag" : "Performer"} ${o}`
          ];
        }
      }
    })
  ), i;
}
function Go({
  review: e,
  disabled: t,
  hidden: r = !1,
  onOpen: i,
  onClose: s,
  onWrite: c
}) {
  const [o, f] = C(!1), [u, g] = C(null), [v, S] = C(""), [T, y] = C(!1), [R, M] = C(!1), [x, F] = C(""), [D, $] = C(""), [fe, De] = C({}), [h, O] = C(!1), [_, N] = C(!1), B = h && u ? u.review : e, [ie, pe] = C(!1), [mt, se] = C([]), [rt, Be] = C(!1), [, Ge] = C(0), nt = P(null), Se = P(null), Ce = P(!1), ne = P(null), Ve = P(!1), oe = P(!1), _e = P({ onClose: s, onWrite: c });
  _e.current = { onClose: s, onWrite: c }, J(() => {
    var b;
    o && ((b = nt.current) == null || b.showModal());
  }, [o]), J(() => {
    if (!o || B.occurrence.targetMode !== "selected") return;
    const b = new AbortController();
    return se([]), _n(
      B.occurrence.performerIds,
      "performers",
      b.signal
    ).then((k) => {
      b.signal.aborted || se(k.map(([, be]) => be));
    }).catch(() => {
    }), () => b.abort();
  }, [
    o,
    B.occurrence.targetMode,
    JSON.stringify(B.occurrence.performerIds)
  ]), J(
    () => () => {
      var b;
      Ce.current = !0, (b = ne.current) == null || b.abort();
    },
    []
  ), J(() => {
    if (!R) return;
    const b = (k) => {
      k.preventDefault(), k.returnValue = "";
    };
    return window.addEventListener("beforeunload", b), () => window.removeEventListener("beforeunload", b);
  }, [R]);
  function Fe() {
    oe.current || (f(!1), _e.current.onClose(Ve.current), Ve.current = !1, requestAnimationFrame(() => {
      var b;
      return (b = Se.current) == null ? void 0 : b.focus();
    }));
  }
  async function it() {
    const b = e.actions.find((k) => k.id === v);
    if (!(!b || oe.current)) {
      oe.current = !0, M(!0), F(""), $("Loading all matching occurrences…"), g(null), O(!1), N(!1), Be(!1), ne.current = new AbortController();
      try {
        const k = await Uo(
          e,
          b,
          ne.current.signal,
          (bt) => $(`Loaded ${bt.toLocaleString()} matching occurrences…`)
        ), be = await _n(
          [
            .../* @__PURE__ */ new Set([
              ...k.touched,
              ...k.review.occurrence.conditionTagIds,
              ...fn(k.review.view.objectFilter)
            ])
          ],
          "tags",
          ne.current.signal
        );
        ne.current.signal.throwIfAborted(), De(Object.fromEntries(be)), g(k), $("Preview ready. No tags have been changed.");
      } catch (k) {
        F(
          ne.current.signal.aborted ? "Preview cancelled. No tags were changed." : String(k instanceof Error ? k.message : k)
        ), $("");
      } finally {
        oe.current = !1, M(!1), ne.current = null;
      }
    }
  }
  async function Z(b) {
    if (!u || oe.current) return;
    oe.current = !0, Ce.current = !1, Ve.current = !0, _e.current.onWrite(), M(!0), O(!0), F(""), b === "undo" && N(!0), $(b === "undo" ? "Undoing batch…" : "Applying batch…");
    const k = () => Ge((be) => be + 1);
    try {
      b === "undo" ? await Bo(u, () => Ce.current, k) : await Vo(
        u,
        T,
        () => Ce.current,
        k,
        b === "retry"
      ), $(
        Ce.current ? "Stopped after in-flight operations settled. Completed changes are retained." : b === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (be) {
      F(be instanceof Error ? be.message : String(be));
    } finally {
      oe.current = !1, M(!1), k();
    }
  }
  const Ie = (u == null ? void 0 : u.entries) ?? [], $e = Ie.filter((b) => b.conflict), K = (b) => Ie.filter((k) => k.status === b).length, ce = h && u ? [u.action] : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((b) => b.steps.length && !ht(b))
  ), V = Ie.some((b) => b.operation), E = (b) => b.map((k) => fe[k] ?? `Tag ${k}`).join(", ") || "None";
  return /* @__PURE__ */ d(ve, { children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-button",
        hidden: r,
        ref: Se,
        disabled: t || !ce.length,
        onClick: () => {
          var b;
          h || (g(null), $(""), F("")), i(), f(!0), S(
            ce.some((k) => k.id === v) ? v : ((b = ce[0]) == null ? void 0 : b.id) ?? ""
          );
        },
        children: h ? "Batch results / undo" : "Apply to all matching occurrences"
      }
    ),
    o && /* @__PURE__ */ d(
      "dialog",
      {
        ref: nt,
        className: "dq-batch-dialog",
        "aria-labelledby": "dq-batch-title",
        "aria-modal": "true",
        onCancel: (b) => {
          b.preventDefault(), Fe();
        },
        children: [
          /* @__PURE__ */ n("h2", { id: "dq-batch-title", children: "Batch occurrence approval" }),
          /* @__PURE__ */ n("p", { children: "Apply one answer across all matching pages. Only targeted performer occurrences change." }),
          /* @__PURE__ */ n("p", { children: "Keep this page open while running. Results and undo last until you leave this workspace." }),
          /* @__PURE__ */ d("fieldset", { disabled: R || h, children: [
            /* @__PURE__ */ n("legend", { children: "Batch scope and action" }),
            /* @__PURE__ */ n("p", { children: "Uses your current filters. To include every existing appearance, remove filters that exclude already answered occurrences." }),
            /* @__PURE__ */ d("p", { children: [
              "Performer scope:",
              " ",
              B.occurrence.targetMode === "all" ? "All performers" : B.occurrence.targetMode === "selected" ? mt.join(", ") || `${B.occurrence.performerIds.length} selected performer(s)` : "Matching performer criteria",
              ". Occurrence condition:",
              " ",
              B.occurrence.condition === "any" ? "Any occurrence tags" : {
                includes: "Has any selected tag",
                includesAll: "Has all selected tags",
                excludes: "Has none of the selected tags",
                isNull: "Has no occurrence tags"
              }[B.occurrence.condition],
              "."
            ] }),
            B.occurrence.condition === "excludes" && B.occurrence.hideConfirmedAbsent !== !1 && /* @__PURE__ */ n("p", { children: "Occurrences confirmed absent for every condition tag are hidden and left unchanged." }),
            B.occurrence.conditionTagIds.length > 0 && u && /* @__PURE__ */ d("p", { children: [
              "Condition tags:",
              " ",
              E(B.occurrence.conditionTagIds),
              B.occurrence.includeSubtags === !1 ? " (exact tags only)" : " (including subtags)",
              "."
            ] }),
            /* @__PURE__ */ d("p", { children: [
              "Search: ",
              String(B.view.filter.q || "Any"),
              ".",
              " ",
              Object.keys(B.view.objectFilter).length === 0 && "Scene filters: None."
            ] }),
            /* @__PURE__ */ n(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": "Batch scene filters",
                children: /* @__PURE__ */ n(
                  sr,
                  {
                    filter: B.view.filter,
                    objectFilter: pn(
                      B.view.objectFilter,
                      fe
                    ),
                    criteriaDefinitions: Tr,
                    customFieldEntityType: "video",
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
            B.occurrence.targetMode === "filter" && /* @__PURE__ */ n(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": "Batch performer criteria",
                children: /* @__PURE__ */ n(
                  sr,
                  {
                    filter: {},
                    objectFilter: B.occurrence.performerFilter,
                    criteriaDefinitions: Vr,
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
            !ce.length && /* @__PURE__ */ n("p", { children: "Configure an occurrence tag action in this review before starting a batch." }),
            /* @__PURE__ */ d("label", { children: [
              "Answer",
              " ",
              /* @__PURE__ */ n(
                "select",
                {
                  "aria-label": "Batch answer",
                  value: v,
                  onChange: (b) => {
                    S(b.target.value), g(null), $("");
                  },
                  children: ce.map((b) => /* @__PURE__ */ n("option", { value: b.id, children: b.label }, b.id))
                }
              )
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: !ce.length,
                onClick: () => void it(),
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
                  value: T ? "replace" : "skip",
                  onChange: (b) => y(b.target.value === "replace"),
                  children: [
                    /* @__PURE__ */ n("option", { value: "skip", children: "Skip conflicts" }),
                    /* @__PURE__ */ n("option", { value: "replace", children: "Replace conflicting answers" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ n("p", { children: "Conflicts are existing tags this action removes. Configure opposite answers as removals." })
          ] }),
          /* @__PURE__ */ d("div", { "aria-live": "polite", children: [
            D && /* @__PURE__ */ n("p", { role: "status", children: D }),
            x && /* @__PURE__ */ n("p", { role: "alert", children: x }),
            u && /* @__PURE__ */ d(ve, { children: [
              /* @__PURE__ */ n("p", { children: /* @__PURE__ */ d("strong", { children: [
                Ie.length.toLocaleString(),
                " occurrences in",
                " ",
                new Set(
                  Ie.map((b) => b.item.video.id)
                ).size.toLocaleString(),
                " ",
                "scenes"
              ] }) }),
              h ? /* @__PURE__ */ d("p", { children: [
                K("changed"),
                " changed; ",
                K("unchanged"),
                " unchanged;",
                " ",
                K("skipped"),
                " skipped; ",
                K("failed"),
                " failed;",
                " ",
                K("pending"),
                " remaining."
              ] }) : /* @__PURE__ */ d("p", { children: [
                Ie.filter(
                  (b) => b.status === "pending" && (T || !b.conflict)
                ).length.toLocaleString(),
                " ",
                "to change; ",
                K("unchanged").toLocaleString(),
                " already correct; ",
                $e.length.toLocaleString(),
                " conflicts (",
                T ? "will replace" : "will skip",
                ")."
              ] })
            ] })
          ] }),
          u && /* @__PURE__ */ d(ve, { children: [
            !h && /* @__PURE__ */ d("p", { children: [
              "Planned additions:",
              " ",
              E([
                ...new Set(
                  Ie.filter((b) => T || !b.conflict).flatMap(
                    (b) => gt(b.before.ids, b.desired).added
                  )
                )
              ]),
              ". Planned removals:",
              " ",
              E([
                ...new Set(
                  Ie.filter((b) => T || !b.conflict).flatMap(
                    (b) => gt(b.before.ids, b.desired).removed
                  )
                )
              ]),
              "."
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => Be(!rt),
                children: rt ? "Hide occurrence details" : "Inspect occurrences and conflicts"
              }
            ),
            rt && /* @__PURE__ */ n("div", { className: "dq-batch-items", children: /* @__PURE__ */ d("table", { children: [
              /* @__PURE__ */ n("thead", { children: /* @__PURE__ */ d("tr", { children: [
                /* @__PURE__ */ n("th", { children: "Occurrence" }),
                /* @__PURE__ */ n("th", { children: "Changes / result" })
              ] }) }),
              /* @__PURE__ */ n("tbody", { children: Ie.map((b) => {
                var k;
                return /* @__PURE__ */ d("tr", { children: [
                  /* @__PURE__ */ n("td", { children: /* @__PURE__ */ d(
                    "a",
                    {
                      href: `/video/${b.item.video.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      children: [
                        (k = b.item.occurrence) == null ? void 0 : k.performer.name,
                        " —",
                        " ",
                        b.item.video.title || "Scene"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ d("td", { children: [
                    b.conflict && /* @__PURE__ */ n("strong", { children: "Conflict. " }),
                    h ? `${b.status}. ${b.error ?? ""}` : `Add: ${E(gt(b.before.ids, b.desired).added)}; Remove: ${E(gt(b.before.ids, b.desired).removed)}`
                  ] })
                ] }, b.item.key);
              }) })
            ] }) }),
            /* @__PURE__ */ d("div", { className: "dq-row", children: [
              !_ && /* @__PURE__ */ d(ve, { children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button primary",
                    disabled: R || !K("pending"),
                    onClick: () => void Z("apply"),
                    children: h ? "Continue remaining" : "Apply batch"
                  }
                ),
                h && K("failed") > 0 && /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: R,
                    onClick: () => void Z("retry"),
                    children: "Retry failed occurrences"
                  }
                )
              ] }),
              V && /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  disabled: R,
                  onClick: () => void Z("undo"),
                  children: "Undo batch"
                }
              )
            ] })
          ] }),
          ie && /* @__PURE__ */ d("div", { role: "group", "aria-label": "Discard batch results", children: [
            /* @__PURE__ */ n("p", { children: "Starting a new batch discards these results and their undo history. Existing tag changes remain." }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: R,
                onClick: () => {
                  var b;
                  g(null), O(!1), y(!1), S(
                    ((b = e.actions.find((k) => k.steps.length)) == null ? void 0 : b.id) ?? ""
                  ), N(!1), $(""), pe(!1);
                },
                children: "Discard results and start new batch"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => pe(!1),
                children: "Keep results"
              }
            )
          ] }),
          /* @__PURE__ */ d("div", { className: "dq-row", children: [
            R && /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => {
                  var b;
                  Ce.current = !0, (b = ne.current) == null || b.abort(), $("Stopping after in-flight operations settle…");
                },
                children: [
                  "Cancel ",
                  ne.current ? "preview" : "run"
                ]
              }
            ),
            h && /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: R,
                onClick: () => pe(!0),
                children: "New batch"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: R,
                onClick: Fe,
                children: "Close"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
function lr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((o, f) => lr(o, t[f]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, s = Object.keys(r).sort(), c = Object.keys(i).sort();
  return s.length === c.length && s.every(
    (o, f) => o === c[f] && lr(r[o], i[o])
  );
}
const kr = [
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
], Jo = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function zt(e) {
  const t = e.entityType === "performerOccurrence" ? e.occurrence : void 0;
  return {
    filter: Pe({
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
        includeSubtags: t.includeSubtags ?? !0,
        hideConfirmedAbsent: t.hideConfirmedAbsent ?? !0
      }
    } : {}
  };
}
function jn(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function en(e, t) {
  if (!kr.some((o) => t.has(o))) {
    const o = zt(e);
    return { query: o, startAtEnd: o.startFrom === "end" };
  }
  const i = {
    q: t.get("q") ?? "",
    page: Number(t.get("page") ?? 1),
    perPage: Number(t.get("perPage") ?? 40),
    sort: t.get("sort") ?? "date",
    direction: t.get("direction") === "asc" ? "asc" : "desc"
  };
  if (t.has("seed") && (i.seed = Number(t.get("seed"))), t.get("sorts")) {
    const o = t.get("sorts").split(",").map((f) => {
      const u = f.lastIndexOf(":");
      return { key: f.slice(0, u), direction: f.slice(u + 1) };
    });
    if (o.some((f) => !f.key || !["asc", "desc"].includes(f.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = o, i.sort = o[0].key, i.direction = o[0].direction;
  }
  let s;
  if (e.entityType === "performerOccurrence" && (s = {
    ...Jo,
    ...jn(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(s.targetMode) || !["any", "includes", "includesAll", "excludes", "isNull"].includes(
    s.condition
  ) || !Array.isArray(s.performerIds) || !Array.isArray(s.conditionTagIds) || typeof s.includeSubtags != "boolean" || typeof s.hideConfirmedAbsent != "boolean" || [...s.performerIds, ...s.conditionTagIds].some(
    (o) => !Number.isSafeInteger(o) || o <= 0
  ) || !s.performerFilter || typeof s.performerFilter != "object" || Array.isArray(s.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const c = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Pe(i),
      objectFilter: jn(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: c,
      performerScope: s
    },
    startAtEnd: !t.has("page") && c === "end"
  };
}
function ar(e, t) {
  const r = new URLSearchParams(window.location.search);
  kr.forEach((i) => r.delete(i)), r.set("review", e);
  for (const i of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[i] !== void 0 && r.set(i, String(t.filter[i]));
  Array.isArray(t.filter.sorts) && r.set(
    "sorts",
    t.filter.sorts.map((i) => `${i.key}:${i.direction}`).join(",")
  ), r.set("filters", JSON.stringify(t.objectFilter)), r.set("searchMode", t.searchMode), r.set("startFrom", t.startFrom), t.performerScope && r.set("performerScope", JSON.stringify(t.performerScope)), window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${r}${window.location.hash}`
  );
}
function st(e, t) {
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
function Un({
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
function jr(e, t) {
  if (!t) return e;
  const r = /* @__PURE__ */ new Map();
  for (const i of e)
    r.set(i.video.id, [...r.get(i.video.id) ?? [], i]);
  return [...r.values()].reverse().flat();
}
const Ze = (e) => e instanceof Error ? e.message : "Request failed.";
function Qo({
  actions: e,
  disabled: t,
  canWrite: r,
  canAssess: i = !0,
  onApply: s
}) {
  const [c, o] = C({});
  J(() => {
    let u = !0;
    return Promise.all(
      [
        ...new Set(
          e.flatMap(
            (g) => g.steps.flatMap((v) => v.tagIds)
          )
        )
      ].map(async (g) => {
        try {
          return [
            g,
            (await W(`/api/tags/${g}`)).name
          ];
        } catch {
          return [g, "Unavailable tag"];
        }
      })
    ).then((g) => {
      u && o(Object.fromEntries(g));
    }), () => {
      u = !1;
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
  return /* @__PURE__ */ d("div", { className: "dq-review-actions", children: [
    /* @__PURE__ */ n("p", { children: "Actions apply and advance. Shift-click or Shift + shortcut applies and stays." }),
    e.map((u, g) => /* @__PURE__ */ d("div", { className: "dq-action-pair", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: t || !r && u.steps.length > 0 || !i && ht(u),
          onClick: (v) => s(u, v.shiftKey),
          children: /* @__PURE__ */ d("span", { children: [
            Nt(u, g) && /* @__PURE__ */ n("kbd", { children: Nt(u, g) }),
            " ",
            u.label
          ] })
        }
      ),
      u.steps.length > 0 && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button dq-apply-stay-button",
          disabled: t || !r || !i && ht(u),
          "aria-label": `Apply & stay: ${u.label}`,
          title: `Apply & stay: ${u.label}`,
          onClick: () => s(u, !0),
          children: /* @__PURE__ */ n(on, { "aria-hidden": "true" })
        }
      ),
      u.steps.length > 0 && /* @__PURE__ */ n("small", { className: "dq-review-action-summary", children: u.steps.map(
        (v) => `${f[v.mode]}: ${v.tagIds.map((S) => c[S] ?? "Loading tag…").join(", ")}`
      ).join("; ") })
    ] }, u.id))
  ] });
}
function zo({
  review: e,
  canWrite: t,
  canAssess: r = !0,
  onBusy: i,
  onSaveDefaults: s,
  editRequest: c = 0,
  renderRuleEditor: o
}) {
  var dt;
  const f = P(null), u = P("");
  if (!f.current)
    try {
      f.current = en(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (l) {
      u.current = Ze(l), f.current = { query: zt(e), startAtEnd: !1 };
    }
  const [g, v] = C(null), S = P(null), T = P(null), y = P(null), [R, M] = C(!!u.current), x = P(0), [F, D] = C(f.current.query), $ = P(F);
  $.current = F;
  const [fe, De] = C(0), h = P(f.current.startAtEnd), [O, _] = C([]), [N, B] = C(null), ie = P(null), [pe, mt] = C(null), [se, rt] = C(0), Be = $t(() => {
    if (!N) return null;
    const l = O.findIndex((m) => m.key === N.key);
    return l < 0 ? null : O.slice(l + 1).find((m) => m.video.id !== N.video.id) ?? null;
  }, [N, O]), [Ge, nt] = C(0), [Se, Ce] = C(!1), [ne, Ve] = C(!1), oe = P(!1), _e = P(!0), Fe = P(null);
  J(() => (_e.current = !0, () => {
    _e.current = !1;
  }), []);
  const [it, Z] = C(u.current), [Ie, $e] = C(""), [K, ce] = C(null), [V, E] = C(!1), [b, k] = C([]), be = P([]), bt = P(null), Je = P(null), At = P(null);
  J(() => {
    var l, m;
    V && ((m = (l = At.current) == null ? void 0 : l.querySelector("input")) == null || m.focus());
  }, [V]);
  const [Tt, Ee] = C(!1);
  J(() => {
    if (Se || Tt || !Je.current) return;
    const l = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const m = Je.current;
      m != null && m.isConnected && !m.disabled && m.focus(), Je.current = null;
    });
    return () => cancelAnimationFrame(l);
  }, [Se, Tt, fe]);
  const [ct, Rt] = C([]), [Ht, Dt] = C({}), lt = P(null), kt = P(0), [yt, _t] = C({});
  J(() => {
    let l = !0;
    return Promise.all(
      fn(F.objectFilter).map(
        async (m) => [
          String(m),
          (await W(`/api/tags/${m}`)).name
        ]
      )
    ).then((m) => {
      l && _t(Object.fromEntries(m));
    }).catch(() => {
    }), () => {
      l = !1;
    };
  }, [F.objectFilter]);
  const le = $t(
    () => pn(F.objectFilter, yt),
    [yt, F.objectFilter]
  ), Qe = P(0), Xt = P(e);
  Xt.current = e;
  const Yt = g ?? e, de = $t(
    () => st(Yt, F),
    [Yt, F]
  ), jt = P(de);
  jt.current = de;
  const H = F.startFrom !== (e.view.startFrom ?? "end") || !lr(
    JSON.parse(at(st(e, F))),
    JSON.parse(at(st(e, zt(e))))
  ), je = ne || Se || V, ye = Number(F.filter.page);
  function Ue(l, m = !1) {
    oe.current || (u.current = "", h.current = m, $.current = l, D(l), nt(0), Ce(!0), m || ar(e.id, l), De((I) => I + 1));
  }
  function wt() {
    if (oe.current = !1, Ve(!1), _e.current && Fe.current) {
      const l = Fe.current;
      Fe.current = null, Ue(l.query, l.startAtEnd);
    }
  }
  J(() => {
    const l = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const m = en(
            Xt.current,
            new URLSearchParams(window.location.search)
          );
          oe.current ? Fe.current = m : Ue(m.query, m.startAtEnd);
        } catch (m) {
          Z(Ze(m));
        }
    };
    return window.addEventListener("popstate", l), () => window.removeEventListener("popstate", l);
  }, [e.id]), J(() => (i(ne || Se || V || !!g), () => i(!1)), [ne, Se, V, !!g, i]);
  async function vt(l, m, I) {
    if (l.entityType === "performerOccurrence") {
      const j = await Ai(
        l,
        lt.current,
        m,
        I
      );
      return {
        items: j.items.map((Y) => ({
          key: Y.key,
          video: Y.video,
          occurrence: Y
        })),
        totalCount: j.totalCount
      };
    }
    const G = await or(
      l,
      { ...l.view.filter, page: m },
      I
    );
    return {
      items: G.items.map((j) => ({ key: String(j.id), video: j })),
      totalCount: G.totalCount
    };
  }
  function Zt(l, m, I, G = !1, j = !1) {
    if (!_e.current || Fe.current) return;
    M(!0), _(
      j ? l.items : jr(l.items, $.current.startFrom === "end")
    ), nt(l.totalCount), qt(I, G);
    const Y = {
      ...$.current,
      filter: { ...$.current.filter, page: m }
    };
    $.current = Y, D(Y), ar(e.id, Y);
  }
  function qt(l, m = !1) {
    (l == null ? void 0 : l.key) !== (N == null ? void 0 : N.key) && (ie.current = null), (l == null ? void 0 : l.video.id) !== (N == null ? void 0 : N.video.id) && mt(m && l ? l.video.id : null), B(l);
  }
  J(() => {
    if (u.current) return;
    const l = new AbortController();
    y.current = l;
    const m = ++Qe.current;
    return Ce(!0), Z(""), $e(""), ie.current = null, mt(null), B(null), _([]), E(!1), (async () => {
      const I = st(Xt.current, $.current);
      lt.current = I.entityType === "performerOccurrence" ? await gn(I, l.signal) : null;
      let G = Number(I.view.filter.page), j = await vt(I, G, l.signal);
      const Y = Math.max(
        1,
        Math.ceil(j.totalCount / Number(I.view.filter.perPage))
      );
      (h.current || G > Y) && (G = Y, j = await vt(I, G, l.signal)), h.current = !1;
      const ke = I.view.startFrom === "end" ? -1 : 1;
      for (; I.entityType === "performerOccurrence" && !j.items.length && G + ke >= 1 && G + ke <= Y && !l.signal.aborted; )
        G += ke, j = await vt(I, G, l.signal);
      if (m !== Qe.current || l.signal.aborted) return;
      const ze = jr(j.items, I.view.startFrom === "end");
      Zt(j, G, ze[0] ?? null);
    })().catch((I) => {
      !l.signal.aborted && m === Qe.current && Z(Ze(I));
    }).finally(() => {
      !l.signal.aborted && m === Qe.current && (M(!0), Ce(!1));
    }), () => {
      l.abort(), Qe.current++;
    };
  }, [fe, e.id]), J(() => {
    if (ce(null), !N) return;
    let l = !0;
    return tt(N).then((m) => {
      l && (ce(m), Rt(
        e.entityType === "performerOccurrence" ? m.ids.filter((I) => e.occurrence.tagIds.includes(I)) : []
      ));
    }).catch((m) => {
      l && Z(`Could not load current tags. ${Ze(m)}`);
    }), () => {
      l = !1;
    };
  }, [N]), J(() => {
    if (e.entityType !== "performerOccurrence" || e.actions.length)
      return;
    let l = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (m) => [
          m,
          (await W(`/api/tags/${m}`)).name
        ]
      )
    ).then((m) => {
      l && Dt(Object.fromEntries(m));
    }).catch((m) => {
      l && Z(Ze(m));
    }), () => {
      l = !1;
    };
  }, [e]);
  async function xe(l = !1, m = !1, I = !1) {
    var Ot;
    if (!N) return;
    const G = O.findIndex((ee) => ee.key === N.key), j = F.startFrom === "end" ? -1 : 1, Y = ((Ot = ie.current) == null ? void 0 : Ot.key) === N.key ? ie.current : { key: N.key, page: ye, before: O.slice(0, G + 1).map((ee) => ee.key), after: O.slice(G + 1).map((ee) => ee.key) }, ke = new Set(Y.after), ze = new Set(Y.before), Q = O.find((ee) => {
      var Oe;
      return ke.has(ee.key) || (j === 1 || ye < Y.page) && ((Oe = ie.current) == null ? void 0 : Oe.key) === N.key && !ze.has(ee.key);
    });
    if (!l && Q) {
      qt(Q, I);
      return;
    }
    const me = l ? ze : new Set(O.map((ee) => ee.key)), qe = 1100 - (Date.now() - kt.current);
    qe > 0 && await new Promise((ee) => window.setTimeout(ee, qe));
    let Le = j === -1 && !l ? Math.max(1, ye - 1) : ye;
    for (; _e.current && !Fe.current; ) {
      let ee = await vt(de, Le);
      const Oe = Math.max(
        1,
        Math.ceil(ee.totalCount / Number(F.filter.perPage))
      );
      Le > Oe && (Le = Oe, ee = await vt(de, Le));
      const Kt = jr(ee.items, j === -1), St = new Map(Kt.map((Te) => [Te.key, Te])), te = l ? Y.after.flatMap((Te) => {
        const It = St.get(Te);
        return It ? [It] : [];
      }) : [], tr = new Set(te.map((Te) => Te.key)), Vt = l ? {
        ...ee,
        items: [
          ...te,
          ...Kt.filter(
            (Te) => Te.key !== N.key && !tr.has(Te.key)
          )
        ]
      } : ee;
      if (m) {
        ie.current = Y, Zt(Vt, Le, N, !1, l);
        return;
      }
      const Ct = j === -1 && ye === 1 && !l ? void 0 : Vt.items.find(
        (Te) => !me.has(Te.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(l && j === -1 && Le === Y.page) || ke.has(Te.key))
      );
      if (Ct || (j === -1 ? Le <= 1 : Le >= Oe)) {
        Zt(
          Vt,
          Le,
          Ct ?? null,
          I,
          l
        ), Ct || $e(
          ee.totalCount ? "Reached the end in this direction. Matching items remain available from the scene pages." : "No matching scenes."
        );
        return;
      }
      Le += j;
    }
  }
  async function Ne(l, m = !1, I = !1, G = !1) {
    if (g || !N || oe.current || Se || V && !I)
      return;
    const j = I || G || !!(l != null && l.steps.length), Y = j && !m;
    if (j && (!t || !K) || l && ht(l) && !r) return;
    oe.current = !0, Ve(!0), Z(""), $e("");
    const ke = O.findIndex((me) => me.key === N.key), ze = j && !m && ke >= 0 ? O[ke + 1] ?? null : null;
    ze && (_(
      (me) => me.filter((qe) => qe.key !== N.key)
    ), qt(ze, !0));
    let Q = !1;
    try {
      if (j) {
        const me = await tt(N);
        if (l)
          await _o(de, N, l);
        else {
          const Le = G && e.entityType === "performerOccurrence" ? e.occurrence.tagIds.filter((Oe) => me.ids.includes(Oe)) : be.current, ee = gt(Le, G ? ct : b);
          await hn(de, N, ee);
        }
        kt.current = Date.now();
        const qe = await tt(N);
        ze || ce(qe), Q = !0, E(!1), $e("Tags saved.");
      }
      if (!_e.current || Fe.current) return;
      j ? await xe(!0, m, Y) : m || await xe(), m && I && requestAnimationFrame(() => {
        var me;
        return (me = bt.current) == null ? void 0 : me.focus();
      });
    } catch (me) {
      if (Z(
        Q ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Ze(me)}` : j ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Ze(me)}` : `Could not advance. ${Ze(me)}`
      ), j && !Q) {
        ze && (_(O), mt(null), rt((qe) => qe + 1), B(N)), kt.current = Date.now();
        try {
          ce(await tt(N));
        } catch {
          ce(null), Z(
            (qe) => `${qe} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      wt();
    }
  }
  J(() => {
    const l = (m) => {
      if (V || g || ne || Se || Tt || m.defaultPrevented || m.repeat || m.ctrlKey || m.altKey || m.metaKey || !di(m.target) || document.querySelector('[role="dialog"], dialog[open]'))
        return;
      const I = m.key.toLowerCase(), G = e.actions.find(
        (j, Y) => Nt(j, Y) === I
      );
      G && (m.preventDefault(), m.stopPropagation(), Ne(G, m.shiftKey));
    };
    return document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l);
  });
  function Ut() {
    !s || g || oe.current || V || (T.current = document.activeElement, S.current = {
      error: it,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone($.current),
      items: O,
      current: N,
      total: Ge,
      targets: lt.current,
      stayedCursor: ie.current
    }, v(structuredClone(st(e, $.current))), $e(""), Z(""));
  }
  J(() => {
    c && c !== x.current && R && !Se && (x.current = c, Ut());
  }, [c, Se, R]);
  function ot() {
    v(null), requestAnimationFrame(() => {
      var l;
      return (l = T.current) == null ? void 0 : l.focus();
    });
  }
  function er() {
    var m;
    const l = S.current;
    !l || ne || ((m = y.current) == null || m.abort(), Qe.current++, $.current = l.query, D(l.query), _(l.items), B(l.current), nt(l.total), lt.current = l.targets, ie.current = l.stayedCursor, Ce(!1), Z(l.error), $e(""), window.history.replaceState(window.history.state, "", l.url), ot());
  }
  async function Ae() {
    if (!g || !s || oe.current) return;
    const l = st(
      { ...g, name: g.name.trim() },
      $.current
    ), m = Sr(l);
    if (m) {
      Z(m);
      return;
    }
    oe.current = !0, Ve(!0), Z("");
    try {
      if (await s(l) === !1) throw new Error("Could not save review.");
      ot(), $e("Review saved.");
    } catch (I) {
      Z(
        "Could not save review. Your edits are still open. " + Ze(I)
      );
    } finally {
      wt();
    }
  }
  async function Me() {
    if (!s || oe.current) return;
    const l = st(e, {
      ...$.current,
      filter: { ...$.current.filter, page: 1 }
    });
    oe.current = !0, Ve(!0), Z("");
    try {
      if (await s(l) === !1) throw new Error("Could not save review.");
      $e("Queue saved to this review.");
    } catch (m) {
      Z("Could not save queue. " + Ze(m));
    } finally {
      wt();
    }
  }
  const X = F.performerScope, ge = (l) => Ue({
    ...$.current,
    filter: { ...$.current.filter, page: 1 },
    performerScope: { ...X, ...l }
  });
  return /* @__PURE__ */ d(
    "section",
    {
      className: "dq-review-workspace",
      "aria-label": X ? "Performer occurrence review" : "Video review",
      children: [
        g && /* @__PURE__ */ d("section", { className: "dq-rule-editor", "aria-label": "Edit review rule", children: [
          /* @__PURE__ */ n("h2", { children: "Edit review" }),
          /* @__PURE__ */ n("p", { children: "Preview matching scenes below. Save review keeps all rule changes; Cancel restores your previous view." }),
          /* @__PURE__ */ d("fieldset", { disabled: ne, children: [
            o == null ? void 0 : o(
              st(g, F),
              v,
              ne
            ),
            /* @__PURE__ */ d("label", { children: [
              "Review direction",
              /* @__PURE__ */ d(
                "select",
                {
                  "aria-label": "Review direction",
                  value: F.startFrom,
                  onChange: (l) => Ue({
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
                disabled: ne || Se,
                onClick: () => void Ae(),
                children: "Save review"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button",
                type: "button",
                disabled: ne,
                onClick: er,
                children: "Cancel"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ d(
          "fieldset",
          {
            className: "dq-review-filters",
            disabled: je,
            onClickCapture: (l) => {
              var G;
              const m = l.target instanceof Element ? l.target.closest("button") : null, I = (m == null ? void 0 : m.getAttribute("aria-label")) ?? ((G = m == null ? void 0 : m.textContent) == null ? void 0 : G.trim()) ?? "";
              m && !m.closest('[role="dialog"], dialog') && /^(Filters|Edit filter:|Edit performer criteria)/.test(I) && (Je.current = m);
            },
            children: [
              /* @__PURE__ */ n("legend", { children: "Scene filters" }),
              /* @__PURE__ */ d("div", { className: "dq-queue-toolbar", children: [
                /* @__PURE__ */ n(
                  sr,
                  {
                    filter: F.filter,
                    objectFilter: le,
                    criteriaDefinitions: Tr,
                    customFieldEntityType: "video",
                    totalCount: Ge,
                    sortOptions: nn,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    onFilterChange: (l) => {
                      (l.sort !== $.current.filter.sort || l.direction !== $.current.filter.direction) && (l = { ...l, sorts: void 0 }), Ue({
                        ...$.current,
                        filter: Pe(l)
                      });
                    },
                    onObjectFilterChange: (l) => {
                      Ue({
                        ...$.current,
                        objectFilter: Ci(
                          l,
                          yt,
                          $.current.objectFilter
                        ),
                        filter: { ...$.current.filter, page: 1 }
                      });
                    }
                  }
                ),
                !g && H && /* @__PURE__ */ d("div", { className: "dq-review-defaults", children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      "aria-label": "Save changes to review filters",
                      title: "Save changes to review filters",
                      disabled: !s,
                      onClick: () => void Me(),
                      children: /* @__PURE__ */ n(on, { "aria-hidden": "true" })
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
                        const l = zt(e);
                        Ue(l, l.startFrom === "end");
                      },
                      children: /* @__PURE__ */ n(ti, { "aria-hidden": "true" })
                    }
                  )
                ] })
              ] }),
              X && /* @__PURE__ */ d("div", { className: "dq-scope-controls", children: [
                /* @__PURE__ */ d("label", { children: [
                  "Performers to review",
                  " ",
                  /* @__PURE__ */ d(
                    "select",
                    {
                      value: X.targetMode,
                      onChange: (l) => ge({
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
                X.targetMode === "selected" && /* @__PURE__ */ n(
                  pt,
                  {
                    entityType: "performer",
                    values: X.performerIds,
                    onChange: (l) => ge({ performerIds: l }),
                    placeholder: "Select performers to review...",
                    allowCreate: !1
                  }
                ),
                X.targetMode === "filter" && /* @__PURE__ */ d(ve, { children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => Ee(!0),
                      children: "Edit performer criteria"
                    }
                  ),
                  /* @__PURE__ */ n("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ n(
                    sr,
                    {
                      filter: {},
                      onFilterChange: () => {
                      },
                      totalCount: 0,
                      sortOptions: [],
                      showSearch: !1,
                      showSort: !1,
                      showPagingControls: !1,
                      criteriaDefinitions: Vr,
                      objectFilter: X.performerFilter,
                      onObjectFilterChange: (l) => ge({ performerFilter: l })
                    }
                  ) })
                ] }),
                /* @__PURE__ */ d("label", { children: [
                  "Occurrence tags",
                  " ",
                  /* @__PURE__ */ d(
                    "select",
                    {
                      value: X.condition,
                      onChange: (l) => ge({
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
                !["any", "isNull"].includes(X.condition) && /* @__PURE__ */ d(ve, { children: [
                  /* @__PURE__ */ n(
                    pt,
                    {
                      entityType: "tag",
                      values: X.conditionTagIds,
                      onChange: (l) => ge({ conditionTagIds: l }),
                      placeholder: "Occurrence condition tags...",
                      allowCreate: !1
                    }
                  ),
                  /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "checkbox",
                        checked: X.includeSubtags ?? !0,
                        onChange: (l) => ge({ includeSubtags: l.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  X.condition === "excludes" && /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "checkbox",
                        checked: X.hideConfirmedAbsent ?? !0,
                        onChange: (l) => ge({ hideConfirmedAbsent: l.target.checked })
                      }
                    ),
                    "Hide occurrences confirmed absent"
                  ] })
                ] })
              ] })
            ]
          }
        ),
        X && /* @__PURE__ */ n(
          Hn,
          {
            open: Tt,
            onClose: () => Ee(!1),
            criteria: Vr,
            activeFilter: X.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (l) => {
              Ee(!1), ge({ performerFilter: l });
            }
          }
        ),
        de.entityType === "performerOccurrence" && t && /* @__PURE__ */ n(
          Go,
          {
            review: de,
            hidden: !!g,
            disabled: je || !!g,
            onOpen: () => {
              oe.current = !0, Ve(!0);
            },
            onWrite: () => {
              kt.current = Date.now();
            },
            onClose: (l) => {
              l ? (kt.current = Date.now(), new Promise((m) => window.setTimeout(m, 1100)).then(() => {
                wt(), _e.current && De((m) => m + 1);
              })) : wt();
            }
          }
        ),
        /* @__PURE__ */ d("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
          it && /* @__PURE__ */ d("p", { role: "alert", children: [
            it,
            " ",
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: ne,
                onClick: () => {
                  N ? tt(N).then(ce).catch((l) => Z(Ze(l))) : Ue($.current);
                },
                children: N ? "Reload tags" : "Retry queue"
              }
            )
          ] }),
          Ie && /* @__PURE__ */ n("p", { role: "status", children: Ie })
        ] }),
        /* @__PURE__ */ d("div", { className: "dq-review-layout", children: [
          /* @__PURE__ */ d("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
            /* @__PURE__ */ n("fieldset", { disabled: je, children: /* @__PURE__ */ n(
              Xn,
              {
                filter: F.filter,
                totalCount: Ge,
                onFilterChange: (l) => Ue({ ...F, filter: Pe(l) })
              }
            ) }),
            /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: O.map((l) => {
              var m, I, G;
              return /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  title: `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${l.video.title || ((m = l.video.files[0]) == null ? void 0 : m.basename) || "Scene"}`,
                  "aria-label": `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${l.video.title || ((I = l.video.files[0]) == null ? void 0 : I.basename) || "Scene"}`,
                  disabled: je,
                  "aria-pressed": (N == null ? void 0 : N.key) === l.key,
                  onClick: () => {
                    qt(l), Z(""), $e("");
                  },
                  children: [
                    l.occurrence && /* @__PURE__ */ n(Un, { performer: l.occurrence.performer }),
                    /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: l.video.title || ((G = l.video.files[0]) == null ? void 0 : G.basename) || "Scene" })
                  ]
                },
                l.key
              );
            }) })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-inspector", children: N ? /* @__PURE__ */ d(ve, { children: [
            /* @__PURE__ */ d("div", { className: "dq-review-media", children: [
              /* @__PURE__ */ n("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ n(
                "a",
                {
                  href: `/video/${N.video.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: N.video.title || ((dt = N.video.files[0]) == null ? void 0 : dt.basename) || `Video ${N.video.id}`
                }
              ) }),
              [N, Be].filter(Boolean).map((l) => {
                var G, j, Y;
                const m = l, I = m.key === N.key;
                return /* @__PURE__ */ n(
                  "div",
                  {
                    className: I ? "dq-review-video-current" : "dq-review-video-preload",
                    "aria-hidden": I ? void 0 : !0,
                    inert: I ? void 0 : !0,
                    children: /* @__PURE__ */ n(
                      Yn,
                      {
                        videoId: m.video.id,
                        streamUrl: mi(m.video.id),
                        posterUrl: I ? No(m.video) : void 0,
                        duration: ((G = m.video.files[0]) == null ? void 0 : G.duration) ?? 0,
                        format: (j = m.video.files[0]) == null ? void 0 : j.format,
                        audioCodec: (Y = m.video.files[0]) == null ? void 0 : Y.audioCodec,
                        extensionSurface: I ? "quick-view" : void 0,
                        autostart: I && pe === m.video.id,
                        keyboardShortcutsEnabled: I,
                        showAbLoop: I,
                        clip: m.video.parentVideoId != null ? {
                          start: m.video.clipStartSec ?? 0,
                          end: m.video.clipEndSec,
                          loop: !1
                        } : void 0
                      }
                    )
                  },
                  `${m.video.id}:${se}`
                );
              })
            ] }),
            /* @__PURE__ */ d("div", { className: "dq-review-panel", children: [
              /* @__PURE__ */ n("h2", { children: N.occurrence ? `Reviewing ${N.occurrence.performer.name}` : "Reviewing this video" }),
              /* @__PURE__ */ n("p", { children: X ? "Tags apply only to this performer in this video." : "Tags apply to the video." }),
              X && /* @__PURE__ */ n(
                "div",
                {
                  className: "dq-review-partners",
                  "aria-label": "Matching scene partners",
                  children: O.filter((l) => l.video.id === N.video.id).map((l) => {
                    var m, I;
                    return /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button dq-partner-button",
                        title: (m = l.occurrence) == null ? void 0 : m.performer.name,
                        "aria-label": (I = l.occurrence) == null ? void 0 : I.performer.name,
                        disabled: je,
                        "aria-pressed": l.key === N.key,
                        onClick: () => {
                          qt(l), Z("");
                        },
                        children: l.occurrence && /* @__PURE__ */ n(
                          Un,
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
                X ? "occurrence" : "video",
                " tags:",
                " ",
                K ? K.names.join(", ") || "None" : "Loading…"
              ] }),
              K != null && K.absent.length ? /* @__PURE__ */ d("p", { children: [
                "Confirmed absent tags:",
                " ",
                /* @__PURE__ */ n(
                  pt,
                  {
                    entityType: "tag",
                    values: K.absent,
                    onChange: () => {
                    },
                    disabled: !0,
                    allowCreate: !1
                  }
                )
              ] }) : null,
              V ? /* @__PURE__ */ d(
                "fieldset",
                {
                  ref: At,
                  disabled: ne,
                  className: "dq-tag-editor",
                  children: [
                    /* @__PURE__ */ d("legend", { children: [
                      "Edit ",
                      X ? "occurrence" : "video",
                      " tags"
                    ] }),
                    /* @__PURE__ */ n(
                      pt,
                      {
                        entityType: "tag",
                        values: b,
                        onChange: k,
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
                          disabled: !K,
                          onClick: () => void Ne(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !K,
                          onClick: () => void Ne(void 0, !1, !0),
                          children: "Save & next"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => {
                            E(!1), requestAnimationFrame(
                              () => {
                                var l;
                                return (l = bt.current) == null ? void 0 : l.focus();
                              }
                            );
                          },
                          children: "Cancel"
                        }
                      )
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ d(ve, { children: [
                /* @__PURE__ */ n(
                  Qo,
                  {
                    actions: Yt.actions,
                    canWrite: t,
                    canAssess: r,
                    disabled: ne || Se || !K || !!g,
                    onApply: (l, m) => void Ne(l, m)
                  }
                ),
                e.entityType === "performerOccurrence" && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ d(
                  "fieldset",
                  {
                    className: "dq-tag-choices",
                    disabled: !t || ne || !K || !!g,
                    children: [
                      /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                      e.occurrence.tagIds.map((l) => /* @__PURE__ */ d("label", { children: [
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: e.occurrence.multiple ? "checkbox" : "radio",
                            name: "legacy-choice",
                            checked: ct.includes(l),
                            onChange: (m) => Rt(
                              e.occurrence.multiple ? m.target.checked ? [...ct, l] : ct.filter(
                                (I) => I !== l
                              ) : [l]
                            )
                          }
                        ),
                        Ht[l] ?? "Loading tag…"
                      ] }, l)),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          onClick: () => Rt([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void Ne(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Ne(void 0, !1, !1, !0),
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
                    ref: bt,
                    className: "dq-button",
                    disabled: je || !!g || !t || !K,
                    onClick: () => {
                      be.current = [...K.ids], k([...K.ids]), E(!0);
                    },
                    children: "Edit tags"
                  }
                ),
                /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: je || !!g,
                    onClick: () => void Ne(),
                    children: [
                      "Skip",
                      X ? " performer" : " video"
                    ]
                  }
                )
              ] }),
              !t && /* @__PURE__ */ n("p", { children: "Write permission is required to change tags." })
            ] })
          ] }) : /* @__PURE__ */ n("p", { role: "status", children: Se ? "Loading review…" : Ge ? "Reached the end in this direction." : "No matching scenes." }) })
        ] })
      ]
    }
  );
}
function Kn({
  review: e,
  onChange: t,
  choices: r = !1
}) {
  const i = e.occurrence, s = (c) => t({ ...e, occurrence: { ...i, ...c } });
  return r ? /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ n("p", { children: "Choose the tags this review can change on the active performer’s appearance in a scene. Other tags are preserved." }),
    /* @__PURE__ */ n(
      pt,
      {
        entityType: "tag",
        values: i.tagIds,
        onChange: (c) => s({ tagIds: c }),
        placeholder: "Search review tag choices...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
      /* @__PURE__ */ n(
        "input",
        {
          type: "checkbox",
          checked: i.multiple,
          onChange: (c) => s({ multiple: c.target.checked })
        }
      ),
      "Allow multiple tags, for example when a hairstyle changes during the scene"
    ] }),
    /* @__PURE__ */ n("p", { children: "Save & next performer applies the selected tags and advances. Save choices stays on the performer. Skip only moves the cursor; eligibility comes from the filters." })
  ] }) : /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Occurrence condition (optional)" }),
    /* @__PURE__ */ n("p", { children: "Leave this unrestricted to review any appearance. Set performer matching in the review workspace and save it with the rule." }),
    /* @__PURE__ */ d("label", { children: [
      "Occurrence condition",
      /* @__PURE__ */ d(
        "select",
        {
          "aria-label": "Occurrence condition",
          value: i.condition,
          onChange: (c) => s({
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
    !["any", "isNull"].includes(i.condition) && /* @__PURE__ */ d(ve, { children: [
      /* @__PURE__ */ n(
        pt,
        {
          entityType: "tag",
          values: i.conditionTagIds,
          onChange: (c) => s({ conditionTagIds: c }),
          placeholder: "Search occurrence condition tags...",
          allowCreate: !1
        }
      ),
      /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
        /* @__PURE__ */ n(
          "input",
          {
            type: "checkbox",
            checked: i.includeSubtags ?? !0,
            onChange: (c) => s({ includeSubtags: c.target.checked })
          }
        ),
        "Include subtags"
      ] }),
      i.condition === "excludes" && /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
        /* @__PURE__ */ n(
          "input",
          {
            type: "checkbox",
            checked: i.hideConfirmedAbsent ?? !0,
            onChange: (c) => s({ hideConfirmedAbsent: c.target.checked })
          }
        ),
        "Hide occurrences confirmed absent"
      ] })
    ] }),
    /* @__PURE__ */ n("p", { children: "Conditions check tags on the same performer’s occurrence, independently of scene tags and the performer’s profile." })
  ] });
}
function Wo(e) {
  var f, u, g;
  const [t, r] = C({}), [i, s] = C(""), c = (((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.annotations) ?? []).includes("tags") ? ((u = e == null ? void 0 : e.presentation) == null ? void 0 : u.annotationParents) ?? [] : [], o = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...c,
      ...((g = e == null ? void 0 : e.presentation) == null ? void 0 : g.binParents) ?? []
    ])
  ]);
  return J(() => {
    let v = !0;
    return r({}), s(""), Promise.all(
      JSON.parse(o).map(
        async (S) => [S, await fr([S])]
      )
    ).then((S) => {
      v && r(Object.fromEntries(S));
    }).catch(() => {
      v && s(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      v = !1;
    };
  }, [o]), { ids: t, error: i };
}
function Ho(e, t, r) {
  const i = t == null ? void 0 : t.presentation, s = (i == null ? void 0 : i.annotations) ?? [], c = (i == null ? void 0 : i.annotationParents) ?? [];
  return {
    ...e,
    details: void 0,
    organized: !1,
    groups: [],
    galleries: [],
    date: s.includes("date") ? e.date : void 0,
    studioId: s.includes("studio") ? e.studioId : void 0,
    studioName: s.includes("studio") ? e.studioName : void 0,
    performers: s.includes("performers") ? e.performers : [],
    tags: s.includes("tags") && c.length > 0 ? (e.tags ?? []).filter(
      (o) => c.some(
        (f) => {
          var u;
          return f !== o.id && ((u = r[f]) == null ? void 0 : u.includes(o.id));
        }
      )
    ) : []
  };
}
function Xo({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: s
}) {
  var f, u, g;
  const c = new Set(
    (((f = t.presentation) == null ? void 0 : f.binParents) ?? []).flatMap(
      (v) => (r[v] ?? []).filter((S) => S !== v)
    )
  ), o = /* @__PURE__ */ new Map();
  for (const v of e)
    for (const S of v.tags ?? [])
      if (c.has(S.id)) {
        const T = o.get(S.id) ?? { name: S.name, count: 0 };
        T.count++, o.set(S.id, T);
      }
  return (g = (u = t.presentation) == null ? void 0 : u.binParents) != null && g.length ? /* @__PURE__ */ d("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...o].sort((v, S) => v[1].name.localeCompare(S[1].name)).map(([v, S]) => /* @__PURE__ */ d(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => s(v),
        children: [
          S.name,
          " (",
          S.count,
          ")"
        ]
      },
      v
    )),
    !o.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function Yo(e, t) {
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
function Vn({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [s, c] = C(!1), o = we(e) === "tag" ? "tag" : "video", f = Xi(
    o === "video" ? "video" : void 0,
    e.view.objectFilter
  ), u = e.view.filter, g = o === "tag" ? Zn : nn, v = (y) => t({
    ...e,
    view: { ...e.view, filter: { ...u, ...y } }
  }), S = o === "video" ? e.presentation ?? {} : {}, T = (y) => t({ ...e, presentation: { ...S, ...y } });
  return /* @__PURE__ */ d(ve, { children: [
    i && /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ d("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(u.q ?? ""),
            onChange: (y) => v({ q: y.target.value })
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
              value: String(u.sort ?? "date"),
              onChange: (y) => v({ sort: y.target.value, sorts: void 0 }),
              children: [
                !g.some((y) => y.value === u.sort) && u.sort != null && /* @__PURE__ */ n("option", { value: String(u.sort), children: String(u.sort) }),
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
              value: String(u.direction ?? "desc"),
              onChange: (y) => v({ direction: y.target.value }),
              children: [
                /* @__PURE__ */ n("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ n("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          o === "tag" ? "Tags" : "Videos",
          " per page",
          /* @__PURE__ */ n(
            "input",
            {
              type: "number",
              min: "1",
              max: "1000",
              value: Number(u.perPage) || 40,
              onChange: (y) => v({
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
          onClick: () => c(!0),
          children: [
            "Edit ",
            o,
            " filters"
          ]
        }
      ),
      /* @__PURE__ */ d("p", { children: [
        Object.keys(e.view.objectFilter).length ? `${o === "tag" ? "Tag" : "Video"} filters configured` : `No ${o} filters`,
        ". Choose which ",
        o === "tag" ? "tags" : "videos",
        " enter the queue."
      ] }),
      s && /* @__PURE__ */ n("div", { onKeyDown: (y) => y.stopPropagation(), children: /* @__PURE__ */ n(
        Hn,
        {
          open: !0,
          onClose: () => c(!1),
          criteria: o === "tag" ? ei : Tr,
          activeFilter: e.view.objectFilter,
          customSections: f ? [f] : void 0,
          supportsFilterExpressions: o === "video",
          subjectLabel: o === "tag" ? "tags" : "videos",
          onApply: (y) => {
            t({ ...e, view: { ...e.view, objectFilter: y } }), c(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ d(ve, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ d("p", { className: "dq-editor-note", children: [
        "Choose how ",
        o === "tag" ? "tags" : "videos and tags",
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ d("div", { className: "dq-field-grid", children: [
        we(e) === "video" && /* @__PURE__ */ d("label", { children: [
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
        we(e) !== "performerOccurrence" && /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: e.view.selectAllOnLoad ?? !1,
              onChange: (y) => t({ ...e, view: { ...e.view, selectAllOnLoad: y.target.checked ? !0 : void 0 } })
            }
          ),
          "Select all ",
          o === "tag" ? "tags" : "videos",
          " on page load",
          o === "video" && /* @__PURE__ */ n("small", { children: " (multiple-videos layout)" })
        ] }),
        /* @__PURE__ */ d("label", { children: [
          "Preferred view",
          /* @__PURE__ */ n(
            "select",
            {
              value: o === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid",
              onChange: (y) => t({
                ...e,
                view: {
                  ...e.view,
                  displayMode: y.target.value
                }
              }),
              children: (o === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((y) => /* @__PURE__ */ n("option", { children: y }, y))
            }
          )
        ] })
      ] }),
      o === "video" && /* @__PURE__ */ d(ve, { children: [
        /* @__PURE__ */ n("h4", { children: "Card annotations" }),
        /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((y) => {
          const R = S.annotations ?? [];
          return /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: R.includes(y),
                onChange: (M) => T({
                  annotations: M.target.checked ? [...R, y] : R.filter((x) => x !== y)
                })
              }
            ),
            y
          ] }, y);
        }) }),
        (S.annotations ?? []).includes("tags") && /* @__PURE__ */ d(ve, { children: [
          /* @__PURE__ */ n("h4", { children: "Card tag bins" }),
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected. This setting is separate from the queue filters." }),
          /* @__PURE__ */ n(
            pt,
            {
              entityType: "tag",
              values: S.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (y) => T({ annotationParents: y }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ n("h4", { children: "Queue tag bins" }),
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ n(
          pt,
          {
            entityType: "tag",
            values: S.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (y) => T({ binParents: y }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const Ur = 180;
function qi({ entityType: e }) {
  return e === "tag" ? /* @__PURE__ */ n(ro, { role: "img", "aria-label": "Tag review" }) : /* @__PURE__ */ n(Jr, { role: "img", "aria-label": e === "performerOccurrence" ? "Performer occurrence review" : "Video review" });
}
function Bn(e) {
  return we(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Gn(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Kr() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Jn(e) {
  const t = new URLSearchParams(window.location.search);
  kr.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function Zo(e) {
  return Pe({ ...e, page: 1 });
}
function Oi(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function et(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Ii = "data-quality.workspace-layout.v1", mn = 240, tn = 192, rn = 560;
function Mi(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(rn, Math.max(tn, e)) : mn;
}
function ea() {
  try {
    const e = JSON.parse(
      localStorage.getItem(Ii) ?? "null"
    );
    return Mi(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return mn;
  }
}
function ta(e) {
  try {
    localStorage.setItem(
      Ii,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function Pi(e) {
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
function Fi(e, t) {
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
function ra(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : Fi(e, t);
}
function na({
  onNavigate: e
}) {
  const [t, r] = C([]), [i] = C(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [s, c] = C(""), [o, f] = C(!0), [u, g] = C(""), [v, S] = C(!1), [T, y] = C(!1), [R, M] = C(!1), [x, F] = C([]), [D, $] = C(""), [fe, De] = C(!0), [h, O] = C(""), [_, N] = C(""), [B, ie] = C(!1), [pe, mt] = C(!1), [se, rt] = C(Kr), [Be, Ge] = C({}), [nt, Se] = C("name"), [Ce, ne] = C("asc"), Ve = P(null), oe = P(!1), [_e, Fe] = C(0), [it, Z] = C(!1), [Ie, $e] = C(!1), [K, ce] = C(
    null
  ), V = t.find((a) => a.id === se) ?? null, E = $t(
    () => (K == null ? void 0 : K.id) === se && V ? { ...V, view: {
      ...V.view,
      filter: K.view.filter,
      objectFilter: K.view.objectFilter,
      searchMode: K.view.searchMode,
      startFrom: K.view.startFrom
    } } : V,
    [K, se, V]
  ), b = E ? we(E) : "video", k = b === "video" ? E : null, be = b === "performerOccurrence" && !!(E != null && E.actions.some(ht)), bt = !!k || be, [Je, At] = C(null), Tt = (Je == null ? void 0 : Je.id) === (E == null ? void 0 : E.id) ? Je == null ? void 0 : Je.mode : (E == null ? void 0 : E.view.reviewMode) ?? "single", Ee = b === "performerOccurrence" || b === "video" && Tt === "single", [ct, Rt] = C(0), Ht = P(-1), Dt = P(!1);
  J(() => {
    const a = () => {
      if (!Ee && qe.current) {
        Dt.current = !0;
        return;
      }
      rt(Kr()), Ee || Rt((p) => p + 1);
    };
    return window.addEventListener("popstate", a), () => window.removeEventListener("popstate", a);
  }, [Ee]);
  const lt = b === "tag" ? T : v, kt = $t(() => {
    const a = Ce === "asc" ? 1 : -1;
    return [...t].sort((p, w) => {
      if (nt === "count") {
        const A = Be[p.id], U = Be[w.id], q = typeof A == "number", L = typeof U == "number";
        if (q !== L) return q ? -1 : 1;
        if (q && L && A !== U)
          return (A - U) * a;
      }
      return p.name.localeCompare(w.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * a;
    });
  }, [Ce, nt, Be, t]), yt = P(
    null
  ), _t = Wo(k), [le, Qe] = C({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Xt, Yt] = C({
    page: 1,
    perPage: 40
  }), [de, jt] = C({ items: [], totalCount: 0 }), [H, je] = C(!1), [ye, Ue] = C(""), [wt, vt] = C(!1), [Zt, qt] = C(!1), [xe, Ne] = C(() => /* @__PURE__ */ new Set()), Ut = P(xe);
  Ut.current = xe;
  const ot = P(/* @__PURE__ */ new Map()), er = (E == null ? void 0 : E.view.selectAllOnLoad) === !0, [Ae, Me] = C(null), X = P(Ae);
  X.current = Ae;
  const [ge, dt] = C(!1), l = P(ge);
  l.current = ge;
  const m = P(null), [I, G] = C("grid"), [j, Y] = C(Ur), [ke, ze] = C(ea), [Q, me] = C(!1), qe = P(!1), [Le, Ot] = C(""), [ee, Oe] = C(""), [Kt, St] = C(""), [te, tr] = C(null), [Vt, Ct] = C(""), [Te, It] = C(!1), [qr, bn] = C({}), [yn, wn] = C({}), rr = P(/* @__PURE__ */ new Map()), vn = P(null), Or = P(null), pr = P(null), Bt = P(0), gr = P(0), hr = P(null), Sn = JSON.stringify([
    ...new Set(
      (k == null ? void 0 : k.actions.flatMap(
        (a) => a.steps.flatMap((p) => p.tagIds)
      )) ?? []
    )
  ]);
  function Ir(a) {
    const p = Mi(a);
    ze(p), ta(p);
  }
  function Li(a) {
    const p = a.shiftKey ? 40 : 16;
    let w = null;
    a.key === "ArrowLeft" && (w = ke + p), a.key === "ArrowRight" && (w = ke - p), a.key === "Home" && (w = tn), a.key === "End" && (w = rn), w !== null && (a.preventDefault(), a.stopPropagation(), Ir(w));
  }
  J(() => {
    if (!ee) return;
    const a = window.setTimeout(() => Oe(""), 4e3);
    return () => window.clearTimeout(a);
  }, [ee]), J(() => {
    const a = JSON.parse(Sn);
    if (wn({}), !a.length) return;
    const p = new AbortController();
    let w = !0;
    return Promise.all(
      a.map(async (A) => {
        var U;
        try {
          const q = await W(`/api/tags/${A}`, {
            signal: p.signal
          });
          return [A, ((U = q.name) == null ? void 0 : U.trim()) || null];
        } catch {
          return [A, null];
        }
      })
    ).then((A) => {
      w && wn(Object.fromEntries(A));
    }), () => {
      w = !1, p.abort();
    };
  }, [Sn]), J(() => {
    const a = k ? fn(k.view.objectFilter) : [];
    if (bn({}), !a.length) return;
    const p = new AbortController();
    let w = !0;
    return Promise.all(
      a.map(async (A) => {
        var U;
        try {
          const q = await W(`/api/tags/${A}`, {
            signal: p.signal
          });
          return (U = q.name) != null && U.trim() ? [String(A), q.name] : null;
        } catch {
          return null;
        }
      })
    ).then((A) => {
      w && bn(
        Object.fromEntries(A.filter((U) => U !== null))
      );
    }), () => {
      w = !1, p.abort();
    };
  }, [k == null ? void 0 : k.id, k == null ? void 0 : k.view.objectFilter]);
  const Di = $t(
    () => k ? pn(
      k.view.objectFilter,
      qr
    ) : (E == null ? void 0 : E.view.objectFilter) ?? {},
    [qr, E, k]
  ), Cn = Ft(async () => {
    f(!0), g("");
    try {
      const a = await ho();
      r(a.reviews), c(a.storageKey), S(a.canWriteVideos ?? a.canWrite), y(a.canWriteTags ?? !1), M(a.canReadTagGroups ?? !1), De(a.canConfigure ?? !0), O(a.storageNotice ?? ""), se && !a.reviews.some((p) => p.id === se) && (rt(""), Jn(""));
    } catch (a) {
      g(
        a instanceof Error ? a.message : "Could not load reviews."
      );
    } finally {
      f(!1);
    }
  }, [se]);
  J(() => {
    if (!R) {
      F([]), $("");
      return;
    }
    const a = new AbortController();
    return $(""), Eo(a.signal).then(F).catch((p) => {
      a.signal.aborted || $(
        p instanceof Error ? p.message : "Could not load tag groups."
      );
    }), () => a.abort();
  }, [R]), J(() => {
    Cn();
  }, []), J(() => {
    if (se || t.length === 0) return;
    const a = new AbortController();
    Ge({});
    for (const p of t)
      (p.entityType === "performerOccurrence" ? gn(p, a.signal).then((A) => (A == null ? void 0 : A.length) === 0 ? { items: [], totalCount: 0 } : or(Ni(p, A), { ...p.view.filter, page: 1, perPage: 1 }, a.signal)) : we(p) === "tag" ? xn(
        p,
        Pe({ ...p.view.filter, page: 1, perPage: 1 }),
        a.signal
      ) : or(
        p,
        Pe({ ...p.view.filter, page: 1, perPage: 1 }),
        a.signal
      )).then((A) => {
        a.signal.aborted || Ge((U) => ({
          ...U,
          [p.id]: A.totalCount
        }));
      }).catch(() => {
        a.signal.aborted || Ge((A) => ({ ...A, [p.id]: null }));
      });
    return () => a.abort();
  }, [se, t]), Wn(() => {
    var a;
    se || o || !oe.current || (oe.current = !1, (a = Ve.current) == null || a.focus());
  }, [se, o]);
  const Mr = P(0), mr = Ft(async () => {
    const a = ++Mr.current;
    tr(null), Ct("");
    try {
      const p = await (be ? wi() : yi());
      a === Mr.current && tr(p);
    } catch (p) {
      if (a !== Mr.current) return;
      tr(null), Ct(
        "Tag assessment setup could not be checked. " + (p instanceof Error ? p.message : "Request failed.")
      );
    }
  }, [be]);
  J(() => {
    mr();
  }, [mr]);
  const Mt = Ft(
    async (a, p, w = !1, A = !1) => {
      var ue;
      const U = ++Bt.current;
      (ue = hr.current) == null || ue.abort();
      const q = new AbortController();
      hr.current = q, p = Pe(p);
      const L = Number(p.page);
      w && (p = { ...p, page: 1 }), Qe(p), qt(w), je(!0), Ue("");
      try {
        const z = (ut) => we(a) === "tag" ? xn(
          a,
          ut,
          q.signal
        ) : or(
          a,
          ut,
          q.signal
        );
        let he = await z(p);
        const We = Math.max(
          1,
          Math.ceil(he.totalCount / Number(p.perPage))
        ), He = w ? We : Math.min(L, We);
        return Number(p.page) !== He && (p = { ...p, page: He }, he = await z(p)), U === Bt.current && (jt(he), A && Et(
          () => new Set(he.items.map((ut) => ut.id))
        ), Qe(p), Yt(p)), he;
      } catch (z) {
        throw U === Bt.current && Ue(
          z instanceof Error ? z.message : "Could not load the review queue."
        ), z;
      } finally {
        U === Bt.current && je(!1);
      }
    },
    []
  );
  J(() => {
    var p;
    if (gr.current += 1, Ht.current = -1, Bt.current += 1, (p = hr.current) == null || p.abort(), mt(!1), N(""), ie(!1), Ne(/* @__PURE__ */ new Set()), ot.current.clear(), Me(null), dt(!1), me(!1), qe.current = !1, Ot(""), Oe(""), St(""), jt({ items: [], totalCount: 0 }), vt(!1), !E || Ee) {
      je(!1);
      return;
    }
    let a = !0;
    return je(!0), (async () => {
      let w = V ?? E;
      ce(null);
      let A = null;
      const U = new URLSearchParams(window.location.search);
      if (we(E) === "video" && kr.some((z) => U.has(z)))
        try {
          const z = w;
          A = en(z, U);
          const he = st(z, A.query);
          (A.query.startFrom !== (z.view.startFrom ?? "end") || !lr(
            JSON.parse(at(he)),
            JSON.parse(at(st(z, zt(z))))
          )) && (w = he, ce(w));
        } catch (z) {
          vt(!0), Ue(z instanceof Error ? z.message : "Could not read review URL."), je(!1);
          return;
        }
      let q = null;
      try {
        q = await yo(s, E.id);
      } catch (z) {
        a && (ie(!0), N(
          z instanceof Error ? z.message : "Could not load progress."
        ));
      }
      if (!a) return;
      const L = (q == null ? void 0 : q.signature) === at(w) ? q : null, ue = A ? A.query.filter : L ? Pe(L.filter) : Zo(w.view.filter);
      Qe(ue), G(
        L ? Gn(L.displayMode, we(E)) : Bn(E)
      ), Y(
        L ? L.cardSize ?? Ur : Ur
      );
      try {
        const z = await Mt(
          w,
          ue,
          A ? A.startAtEnd : !L && w.view.startFrom !== "beginning",
          w.view.selectAllOnLoad === !0
        );
        if (!a) return;
        const he = In(
          z.items.map((We) => We.id),
          (L == null ? void 0 : L.focusedId) ?? null,
          (L == null ? void 0 : L.index) ?? 0
        );
        Me(he), Re(he);
      } catch {
      }
      a && (Ht.current = ct, mt(!0));
    })(), () => {
      var w;
      a = !1, gr.current++, Bt.current++, (w = hr.current) == null || w.abort();
    };
  }, [E == null ? void 0 : E.id, Ee, ct]), J(() => {
    !k || Ee || !pe || H || ye || Q || Dt.current || Ht.current !== ct || ar(k.id, {
      filter: le,
      objectFilter: k.view.objectFilter,
      searchMode: k.view.searchMode,
      startFrom: k.view.startFrom ?? "end"
    });
  }, [k, Ee, pe, H, ye, le, Q, ct]);
  const re = $t(
    () => de.items.map((a) => a.id),
    [de.items]
  );
  J(() => {
    if (!pe || !E || !s || H || ye || Q || (K == null ? void 0 : K.id) === E.id || B)
      return;
    const a = {
      version: 1,
      signature: at(E),
      filter: le,
      focusedId: Ae,
      index: Math.max(0, re.indexOf(Ae ?? -1)),
      displayMode: I,
      cardSize: j,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        s + ":progress:" + E.id,
        JSON.stringify(a)
      );
    } catch {
    }
    if (_) return;
    let p = !0;
    const w = window.setTimeout(() => {
      wo(s, E.id, a).catch((A) => {
        p && N(
          "Progress is kept in this browser, but account sync failed. " + (A instanceof Error ? A.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      p = !1, window.clearTimeout(w);
    };
  }, [
    pe,
    s,
    E,
    H,
    ye,
    Q,
    le,
    Ae,
    re,
    I,
    j,
    K,
    _,
    B
  ]);
  const _i = de.items.find((a) => a.id === Ae) ?? null, Pr = b === "video" ? _i : null;
  ge && Pr && (m.current = Pr);
  const Pt = Pr ?? (ge ? m.current : null), ji = Mn(xe, Ae), Ui = re.length > 0 && re.every((a) => xe.has(a)), Fr = xe.size > 0 ? `${xe.size} selected ${b}${xe.size === 1 ? "" : "s"}` : Ae == null ? `no ${b}` : `focused ${b}`, Re = Ft((a, p = !0) => {
    a != null && window.requestAnimationFrame(() => {
      const w = rr.current.get(a);
      w == null || w.focus({ preventScroll: !0 }), p && (w == null || w.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  J(() => {
    pe && !l.current && Re(X.current);
  }, [pe, Re]), J(() => {
    H || !re.length || (X.current == null || !re.includes(X.current)) && (Me(re[0]), l.current || Re(re[0]));
  }, [Re, re, H]);
  const Et = Ft(
    (a) => {
      Ne((p) => {
        const w = a(p);
        for (const A of /* @__PURE__ */ new Set([...p, ...w]))
          p.has(A) !== w.has(A) && ot.current.set(
            A,
            (ot.current.get(A) ?? 0) + 1
          );
        return w;
      });
    },
    []
  ), $r = Ft(
    (a) => {
      if (!re.length) return;
      const p = Math.max(
        0,
        re.indexOf(X.current ?? re[0])
      ), w = re[Math.max(0, Math.min(re.length - 1, p + a))];
      Me(w), l.current || Re(w);
    },
    [Re, re]
  ), xr = Ft(
    async (a) => {
      const p = "steps" in a ? a.steps.length > 0 : a.effect.mode !== "SKIP", w = "effect" in a && a.effect.mode === "SET_TAG_GROUP" ? a.effect.tagGroupId : null, A = w != null && (!R || !x.some((ae) => ae.id === w)), U = "effect" in a && p && !R, q = Mn(
        Ut.current,
        X.current
      );
      if (!E || qe.current || H || ye) return;
      const L = p && !lt ? `${b === "tag" ? "Tag" : "Video"} write permission is required to apply ${a.label}.` : U || A ? `${a.label} needs a tag group that is unavailable.` : ht(a) && (te == null ? void 0 : te.kind) !== "ready" ? `Set up tag assessments before applying ${a.label}.` : q.length ? "" : `Select or focus a ${b} before applying ${a.label}.`;
      if (L) {
        St(L);
        return;
      }
      const ue = ++gr.current, z = E.id, he = [...re], We = de, He = X.current, ut = new Set(Ut.current), Tn = new Map(
        q.map((ae) => [ae, ot.current.get(ae) ?? 0])
      ), Gt = () => ue === gr.current && E.id === z;
      qe.current = !0, me(!0), Ot(
        Ut.current.size ? `${q.length} selected ${b}s` : `the focused ${b}`
      ), Oe(""), St("");
      const Rn = We.items.filter(
        (ae) => !q.includes(ae.id)
      ), Wi = Rn.map((ae) => ae.id), kn = Pn(
        he,
        Wi,
        He,
        q.includes(He ?? -1)
      );
      jt({
        items: Rn,
        totalCount: We.totalCount
      }), Ne((ae) => {
        const Ke = new Set(ae);
        for (const Xe of q) Ke.delete(Xe);
        return Ke;
      }), Me(kn), l.current || Re(kn);
      let Dr = !1;
      try {
        if ("effect" in a ? await Fo(a, q) : await Si(a, q), Dr = !0, !Gt()) return;
        Ne((ae) => {
          const Ke = new Set(ae);
          for (const Xe of q)
            (ot.current.get(Xe) ?? 0) === Tn.get(Xe) && Ke.delete(Xe);
          return Ke;
        }), Oe(
          `${a.label}: ${q.length} ${b}${q.length === 1 ? "" : "s"} ${p ? "updated" : "skipped"}.`
        );
      } catch (ae) {
        if (!Gt()) return;
        jt(We), Ne((Ke) => {
          const Xe = new Set(Ke);
          for (const Ye of q)
            ut.has(Ye) && (ot.current.get(Ye) ?? 0) === Tn.get(Ye) && Xe.add(Ye);
          return Xe;
        }), Me(He), l.current || Re(He), St(
          ae instanceof Error ? ae.message : "Action failed."
        );
      }
      try {
        if (await Ro(a), !Gt()) return;
        const ae = new Set(q), Ke = er && he.length > 0 && he.every((ft) => ae.has(ft)), Xe = await Mt(E, le, !1, Ke);
        if (!Gt()) return;
        let Ye = Xe.items.map((ft) => ft.id);
        if (!Ye.length && Xe.totalCount > 0 && Number(le.page) > 1) {
          const ft = Math.max(1, Number(le.page) - 1), yr = { ...le, page: ft };
          Qe(yr), Ye = (await Mt(
            E,
            yr,
            !1,
            Ke
          )).items.map((_r) => _r.id), Ne(
            (_r) => new Set([..._r].filter((Hi) => Ye.includes(Hi)))
          );
          const On = Ye.at(-1) ?? null;
          Me(On), l.current || Re(On);
        } else {
          Ne(
            (yr) => new Set([...yr].filter((qn) => Ye.includes(qn)))
          );
          const ft = Pn(
            he,
            Ye,
            He,
            Dr && q.includes(He ?? -1)
          );
          Me(ft), l.current && ft == null && dt(!1), l.current || Re(ft);
        }
      } catch (ae) {
        Gt() && St(
          (Ke) => `${Ke ? `${Ke} ` : ""}${Dr ? "The action completed, but " : ""}the queue could not be refreshed. ${ae instanceof Error ? ae.message : "Refresh failed."}`
        );
      } finally {
        Gt() && (qe.current = !1, me(!1), Ot(""), Dt.current && (Dt.current = !1, rt(Kr()), Rt((ae) => ae + 1)));
      }
    },
    [
      lt,
      R,
      x,
      b,
      te,
      Mt,
      le,
      Re,
      re,
      de,
      H,
      ye,
      E
    ]
  );
  function Ki() {
    var w;
    if (I === "list") return 1;
    const a = (w = vn.current) == null ? void 0 : w.firstElementChild, p = a ? getComputedStyle(a).gridTemplateColumns : "";
    return Math.max(1, p.split(" ").filter(Boolean).length);
  }
  const En = P(() => {
  });
  En.current = (a) => {
    var L;
    if (Ee || a.defaultPrevented || a.repeat || a.ctrlKey || a.altKey || a.metaKey || it) return;
    const p = a.target, w = p instanceof Node && ((L = Or.current) == null ? void 0 : L.contains(p)) === !0, A = p === document.body || p === document.documentElement;
    if (!w && !A) return;
    if (ge && a.key === "Escape") {
      et(a), dt(!1), Re(X.current);
      return;
    }
    if (!co(p)) return;
    const U = di(p);
    if (a.key === "Escape") {
      et(a), Et(() => /* @__PURE__ */ new Set());
      return;
    }
    const q = (E == null ? void 0 : E.actions.findIndex(
      (ue, z) => Nt(ue, z) === a.key.toLowerCase()
    )) ?? -1;
    if (q >= 0 && (E != null && E.actions[q])) {
      et(a), !Q && !H && xr(E.actions[q]);
      return;
    }
    if (!ge && a.key === " " && U) {
      et(a), Ae != null && Et((ue) => vr(ue, Ae));
      return;
    }
    if (!ge && a.key.toLowerCase() === "a") {
      et(a), Et(
        (ue) => Fn(ue, re)
      );
      return;
    }
    if (!(Q || H) && !ge && a.key === "Enter" && Ae != null && U) {
      et(a), b === "tag" ? window.open(`/tag/${Ae}`, "_blank", "noopener,noreferrer") : dt(!0);
      return;
    }
  }, J(() => {
    const a = (p) => En.current(p);
    return document.addEventListener("keydown", a), () => document.removeEventListener("keydown", a);
  }, []);
  const Nn = P(
    () => {
    }
  );
  Nn.current = (a) => {
    var q;
    if (Ee || it || ge || Q || H || !re.length || a.defaultPrevented || a.repeat || a.ctrlKey || a.altKey || a.metaKey)
      return;
    const p = a.target, w = p instanceof Node && ((q = Or.current) == null ? void 0 : q.contains(p)) === !0, A = p === document.body || p === document.documentElement;
    if (!w && !A || !a.key.startsWith("Arrow") || !lo(p)) return;
    const U = uo(a.key, Ki());
    U && (a.preventDefault(), w ? a.stopImmediatePropagation() : a.stopPropagation(), $r(U));
  }, J(() => {
    const a = (p) => Nn.current(p);
    return document.addEventListener("keydown", a), () => document.removeEventListener("keydown", a);
  }, []);
  function nr(a) {
    At(null), Fe(0), rt(a), Jn(a);
  }
  function Vi() {
    oe.current = !0, Ge({}), nr("");
  }
  async function Lr(a) {
    if (!s) return !1;
    const p = a.map(oa);
    try {
      await bo(s, p);
    } catch (A) {
      throw A;
    }
    r(p), se && !p.some((A) => A.id === se) && nr("");
    const w = p.find((A) => A.id === se);
    return w && At(null), w && V && JSON.stringify(w) !== JSON.stringify(V) && (w.view.displayMode !== V.view.displayMode && G(Bn(w)), at(w) !== at(V) && (ce(null), we(w) === "video" && ar(w.id, {
      filter: Pe(w.view.filter),
      objectFilter: w.view.objectFilter,
      searchMode: w.view.searchMode,
      startFrom: w.view.startFrom ?? "end"
    }), Ee || br(
      w,
      Pe({ ...w.view.filter, page: le.page })
    ))), !0;
  }
  if (o)
    return /* @__PURE__ */ n(Qn, { label: "Loading reviews…" });
  if (u)
    return /* @__PURE__ */ d(ve, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void ga().catch(
            (a) => g(
              "Could not export browser reviews. " + (a instanceof Error ? a.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        zn,
        {
          message: u,
          onRetry: () => void Cn()
        }
      )
    ] });
  return /* @__PURE__ */ d("div", { ref: Or, className: "data-quality-page", children: [
    /* @__PURE__ */ d("header", { className: "data-quality-header", children: [
      E && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: Q,
          onClick: Vi,
          children: /* @__PURE__ */ n(ri, {})
        }
      ),
      /* @__PURE__ */ d("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (E == null ? void 0 : E.name) ?? "Data Quality" }),
        (E == null ? void 0 : E.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: E.description })
      ] }),
      E && V && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: Q || H || !fe,
          onClick: () => {
            Ee ? Fe((a) => a + 1) : ($e(!0), Z(!0));
          },
          children: /* @__PURE__ */ n(ni, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: Q || H || !fe,
          onClick: () => {
            $e(!1), Z(!0);
          },
          children: /* @__PURE__ */ n(to, {})
        }
      )
    ] }),
    h && /* @__PURE__ */ n("p", { className: "dq-status", children: h }),
    bt && (te == null ? void 0 : te.kind) === "missing" && /* @__PURE__ */ d("div", { role: "status", className: "dq-status", children: [
      te.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: Te,
          onClick: () => {
            It(!0), Ct(""), (be ? Oo() : qo()).then(mr).catch(
              (a) => Ct(
                `Could not create the ${be ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (a instanceof Error ? a.message : "Request failed.")
              )
            ).finally(() => It(!1));
          },
          children: Te ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    bt && ((te == null ? void 0 : te.kind) === "incompatible" || Vt) && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(Gr, {}),
      Vt || (te == null ? void 0 : te.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: Te,
          onClick: () => {
            It(!0), mr().finally(
              () => It(!1)
            );
          },
          children: Te ? "Checking…" : "Check again"
        }
      )
    ] }),
    i && /* @__PURE__ */ d("details", { children: [
      /* @__PURE__ */ n("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ n("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const a = localStorage.getItem("page-videos") ?? "[]", p = URL.createObjectURL(
              new Blob([a], { type: "application/json" })
            ), w = document.createElement("a");
            w.href = p, w.download = "data-quality-unassigned-legacy-reviews.json", w.click(), URL.revokeObjectURL(p);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    _ && /* @__PURE__ */ d("p", { role: "alert", children: [
      _,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            N(""), ie(!1);
          },
          children: B ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    k && /* @__PURE__ */ d("label", { className: "dq-layout-control", children: [
      "Review layout",
      /* @__PURE__ */ d(
        "select",
        {
          "aria-label": "Review layout",
          value: Tt,
          disabled: Q || H || it,
          onChange: (a) => At({ id: k.id, mode: a.target.value }),
          children: [
            /* @__PURE__ */ n("option", { value: "single", children: "Single video" }),
            /* @__PURE__ */ n("option", { value: "multiple", children: "Multiple videos" })
          ]
        }
      )
    ] }),
    E && V && !Ee && /* @__PURE__ */ d("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${Q || H ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": Q || H || void 0,
          inert: Q || H ? !0 : void 0,
          children: /* @__PURE__ */ n(
            sr,
            {
              filter: ye ? Xt : le,
              onFilterChange: Bi,
              totalCount: de.totalCount,
              sortOptions: b === "tag" ? Zn : nn,
              showSearch: !0,
              showSort: !0,
              displayMode: I,
              onDisplayModeChange: (a) => G(Gn(a, b)),
              availableDisplayModes: b === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (j - 225) / 50,
              onZoomChange: (a) => Y(Math.round(225 + a * 50)),
              cardSizeEntityType: b === "tag" ? "tags" : "videos",
              criteriaDefinitions: b === "tag" ? ei : Tr,
              customFieldEntityType: b === "video" ? "video" : void 0,
              objectFilter: Di,
              onObjectFilterChange: (a) => {
                !Q && !H && (yt.current = b === "video" ? Ci(
                  a,
                  qr,
                  E.view.objectFilter
                ) : a);
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (K == null ? void 0 : K.id) === se && /* @__PURE__ */ d("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: Q || H || !fe,
            onClick: Ji,
            children: /* @__PURE__ */ n(on, {})
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Reset to default review filters",
            title: "Reset to default review filters",
            disabled: Q || H,
            onClick: Gi,
            children: /* @__PURE__ */ n(ti, {})
          }
        )
      ] })
    ] }),
    E ? Ee ? /* @__PURE__ */ n(zo, { review: E, canWrite: E.entityType === "performerOccurrence" ? T : v, canAssess: (te == null ? void 0 : te.kind) === "ready" && v, onBusy: me, editRequest: _e, renderRuleEditor: (a, p, w) => /* @__PURE__ */ n($i, { workspace: !0, draft: a, entityTypeLocked: !0, tagGroups: x, saving: w, setDraft: (A) => p(A), onSave: () => {
    }, onCancel: () => {
    } }), onSaveDefaults: fe ? (a) => Lr(t.map((p) => p.id === a.id ? a : p)) : void 0 }, E.id) : /* @__PURE__ */ d(ve, { children: [
      k && _t.error && /* @__PURE__ */ n("p", { role: "alert", children: _t.error }),
      k && /* @__PURE__ */ n(
        Xo,
        {
          videos: de.items,
          review: k,
          trees: _t.ids,
          disabled: Q || H,
          onChoose: (a) => {
            const p = Yo(k, a);
            ce(p), br(p, { ...le, page: 1 });
          }
        }
      ),
      Kt && !ge && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(Gr, {}),
        Kt
      ] }),
      ee && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: ee }),
      An("top"),
      /* @__PURE__ */ d(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${ke}px`
          },
          children: [
            /* @__PURE__ */ d("main", { children: [
              H && !de.items.length && /* @__PURE__ */ n(Qn, { label: "Loading review queue…" }),
              ye && !H && /* @__PURE__ */ n(
                zn,
                {
                  message: ye,
                  retryLabel: wt ? "Reset to review defaults" : "Retry",
                  onRetry: () => {
                    if (wt && V && we(V) === "video") {
                      const a = zt(V);
                      ar(V.id, { ...a, filter: { ...a.filter, page: void 0 } }), Rt((p) => p + 1);
                      return;
                    }
                    Mt(
                      E,
                      le,
                      Zt,
                      er
                    ).catch(() => {
                    });
                  }
                }
              ),
              !Q && !H && !ye && !de.items.length && /* @__PURE__ */ d("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(Jr, {}),
                /* @__PURE__ */ d("p", { children: [
                  "No ",
                  b,
                  "s match this review."
                ] })
              ] }),
              !!de.items.length && /* @__PURE__ */ n("div", { ref: vn, children: /* @__PURE__ */ n(
                "div",
                {
                  className: I === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${j}px`
                  },
                  children: de.items.map(zi)
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
                "aria-valuemin": tn,
                "aria-valuemax": rn,
                "aria-valuenow": ke,
                "aria-valuetext": `${ke} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (a) => {
                  pr.current = {
                    pointerId: a.pointerId,
                    startX: a.clientX,
                    startWidth: ke
                  }, a.currentTarget.setPointerCapture(a.pointerId);
                },
                onPointerMove: (a) => {
                  const p = pr.current;
                  (p == null ? void 0 : p.pointerId) === a.pointerId && a.currentTarget.hasPointerCapture(a.pointerId) && Ir(
                    p.startWidth + p.startX - a.clientX
                  );
                },
                onPointerUp: () => {
                  pr.current = null;
                },
                onPointerCancel: () => {
                  pr.current = null;
                },
                onKeyDown: Li,
                onDoubleClick: () => Ir(mn),
                children: /* @__PURE__ */ n("span", {})
              }
            ),
            /* @__PURE__ */ d("aside", { className: "dq-actions", children: [
              /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  className: "dq-selection-toggle",
                  "aria-keyshortcuts": "a",
                  disabled: !re.length,
                  onClick: () => Et(
                    (a) => Fn(a, re)
                  ),
                  children: [
                    Ui ? "Clear selection" : "Select all on page",
                    /* @__PURE__ */ n("kbd", { "aria-hidden": "true", children: "A" })
                  ]
                }
              ),
              /* @__PURE__ */ n("strong", { children: xe.size > 0 ? Fr : Ae == null ? "Nothing to apply to" : `Applies to the ${Fr}` }),
              E.actions.map((a, p) => {
                const w = "steps" in a ? a.steps.length > 0 : a.effect.mode !== "SKIP", A = "effect" in a && a.effect.mode === "SET_TAG_GROUP" ? a.effect.tagGroupId : null, U = A != null ? x.find((L) => L.id === A) : void 0, q = A != null && !U;
                return /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    disabled: Q || H || !!ye || w && !lt || "effect" in a && w && (!R || q) || ht(a) && (te == null ? void 0 : te.kind) !== "ready" || !ji.length,
                    onClick: () => void xr(a),
                    children: [
                      /* @__PURE__ */ d("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: a.label }),
                        "effect" in a ? /* @__PURE__ */ n("small", { children: a.effect.mode === "SKIP" ? "Skip" : a.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : U ? `Assign ${U.name}` : "Unavailable tag group" }) : a.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: a.steps.flatMap(
                          (L, ue) => L.tagIds.map((z, he) => {
                            const We = yn[z] === void 0 ? "Tag" : yn[z] ?? "Unavailable tag", He = Fi(L, We), ut = ra(L, We);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": Pi(L.mode),
                                "aria-label": ut,
                                title: `Step ${ue + 1}: ${ut}`,
                                children: He
                              },
                              `${ue}-${z}-${he}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      Nt(a, p) && /* @__PURE__ */ n("kbd", { children: Nt(a, p) })
                    ]
                  },
                  a.id
                );
              }),
              !E.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              !lt && /* @__PURE__ */ d("p", { children: [
                b === "tag" ? "Tag" : "Video",
                " write permission is required to apply actions."
              ] }),
              b === "tag" && D && /* @__PURE__ */ d("p", { children: [
                "Tag groups are unavailable. ",
                D
              ] }),
              Q && /* @__PURE__ */ d("p", { role: "status", children: [
                /* @__PURE__ */ n(oi, { className: "dq-spin" }),
                " Applying action to",
                " ",
                Le,
                "…"
              ] }),
              /* @__PURE__ */ d("p", { className: "dq-shortcuts", children: [
                "←→↑↓ move · space select · enter ",
                b === "tag" ? "open" : "preview",
                " · Q–P apply · A toggle shown · Esc clear"
              ] })
            ] })
          ]
        }
      ),
      An("bottom")
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
                  ref: Ve,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ n("p", { children: "Choose a review to open its queue." }),
              /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                (a) => Be[a.id] !== void 0
              ) ? t.some((a) => Be[a.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ d("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ d("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ d(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: nt,
                    onChange: (a) => Se(
                      a.target.value
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
                  "aria-label": Ce === "asc" ? "Ascending" : "Descending",
                  title: Ce === "asc" ? "Ascending" : "Descending",
                  onClick: () => ne(
                    (a) => a === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    ii,
                    {
                      className: Ce === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: kt.map((a) => {
            const p = Be[a.id], w = we(a), A = w === "tag" ? "tag" : w === "performerOccurrence" ? "scene" : "video";
            return /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                disabled: Q,
                onClick: () => nr(a.id),
                children: [
                  /* @__PURE__ */ d("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ d("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(qi, { entityType: w }),
                      /* @__PURE__ */ n("strong", { children: a.name })
                    ] }),
                    /* @__PURE__ */ n(
                      "span",
                      {
                        className: "dq-review-count",
                        "aria-label": p === void 0 ? `Counting matching ${A}s` : p === null ? `Matching ${A} count unavailable` : `${p.toLocaleString()} matching ${p === 1 ? A : `${A}s`}`,
                        children: p === void 0 ? "…" : p === null ? "—" : p.toLocaleString()
                      }
                    )
                  ] }),
                  a.description && /* @__PURE__ */ n("span", { className: "dq-review-rule-name", children: a.description })
                ]
              },
              a.id
            );
          }) })
        ]
      }
    ) : /* @__PURE__ */ d("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(Jr, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    ge && Pt && k && /* @__PURE__ */ n(
      la,
      {
        video: Pt,
        review: k,
        targetLabel: Fr,
        pending: Q,
        refreshing: H || !!ye,
        error: Kt,
        canWrite: v,
        assessmentReady: (te == null ? void 0 : te.kind) === "ready",
        selected: xe.has(Pt.id),
        hasPrevious: re.indexOf(Pt.id) > 0,
        hasNext: re.indexOf(Pt.id) >= 0 && re.indexOf(Pt.id) < re.length - 1,
        onToggleSelected: () => Et((a) => vr(a, Pt.id)),
        onPrevious: () => $r(-1),
        onNext: () => $r(1),
        onClose: () => {
          dt(!1), Re(X.current);
        },
        onAction: xr
      }
    ),
    it && /* @__PURE__ */ n(
      da,
      {
        reviews: t,
        activeReview: V,
        tagGroups: x,
        initialEdit: Ie,
        onSave: Lr,
        onChoose: nr,
        onEditWorkspace: (a) => {
          a !== se && nr(a), At({ id: a, mode: "single" }), Fe((p) => p + 1), Z(!1);
        },
        onClose: () => {
          Z(!1), Ie && Re(X.current, !1);
        }
      }
    )
  ] });
  async function br(a, p, w = !1) {
    const A = X.current, U = Math.max(0, re.indexOf(A ?? -1));
    try {
      const L = (await Mt(
        a,
        p,
        w,
        a.view.selectAllOnLoad === !0
      )).items.map((z) => z.id);
      Ne(
        (z) => new Set([...z].filter((he) => L.includes(he)))
      );
      const ue = In(L, A, U);
      Me(ue), l.current || Re(ue, !1);
    } catch {
    }
  }
  function Bi(a) {
    const p = yt.current;
    if (yt.current = null, Q || H || !E || !V) return;
    const w = p ?? E.view.objectFilter, A = lr(
      w,
      V.view.objectFilter
    ) ? V.view.objectFilter : w, U = Pe({ ...a, page: 1 }), q = {
      ...E,
      view: {
        ...E.view,
        filter: U,
        objectFilter: A
      }
    }, L = at(q) !== at(V), ue = L ? q : V;
    ce(L ? q : null), Oe(L ? "" : "Review queue defaults restored."), br(ue, U, !0);
  }
  function Gi() {
    if (Q || H || !V) return;
    yt.current = null;
    const a = Pe({
      ...V.view.filter,
      page: 1
    });
    ce(null), Oe("Review queue defaults restored."), br(
      V,
      a,
      V.view.startFrom !== "beginning"
    );
  }
  function Ji() {
    Q || H || !E || !V || !fe || Lr(
      t.map(
        (a) => a.id === se ? {
          ...a,
          view: {
            ...E.view,
            filter: { ...le, page: 1 }
          }
        } : a
      )
    ).then(() => {
      ce(null), Oe("Queue saved to this review.");
    }).catch(
      (a) => St(
        a instanceof Error ? a.message : "Could not save queue."
      )
    );
  }
  function Qi() {
    Ne(/* @__PURE__ */ new Set()), ot.current.clear(), Me(null);
  }
  function An(a) {
    return E ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: Q || H,
        "aria-label": `Review queue pagination ${a}`,
        children: /* @__PURE__ */ n(
          Xn,
          {
            filter: {
              ...le,
              page: Number(le.page) || 1,
              perPage: Number(le.perPage) || 40
            },
            totalCount: de.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${a}`,
            onFilterChange: (p) => {
              Q || H || p.page === Number(le.page) || ia(
                { ...le, page: p.page },
                E,
                (w, A) => Mt(w, A, !1, er),
                Qi
              );
            }
          }
        )
      }
    ) : null;
  }
  function zi(a) {
    var w, A, U;
    if (b === "tag") {
      const q = a;
      return /* @__PURE__ */ n(
        aa,
        {
          tag: q,
          displayMode: I === "list" ? "list" : "grid",
          focused: q.id === Ae,
          selected: xe.has(q.id),
          setRef: (L) => {
            L ? rr.current.set(q.id, L) : rr.current.delete(q.id);
          },
          onFocus: () => Me(q.id),
          onToggle: () => {
            Et((L) => vr(L, q.id)), Re(q.id, !1);
          },
          onOpen: () => window.open(`/tag/${q.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        q.id
      );
    }
    const p = a;
    return /* @__PURE__ */ n(
      sa,
      {
        video: Ho(p, k, _t.ids),
        showTagBins: ((A = (w = k == null ? void 0 : k.presentation) == null ? void 0 : w.annotations) == null ? void 0 : A.includes("tags")) && !!((U = k.presentation.annotationParents) != null && U.length),
        displayMode: I,
        focused: p.id === Ae,
        selected: xe.has(p.id),
        setRef: (q) => {
          q ? rr.current.set(p.id, q) : rr.current.delete(p.id);
        },
        onFocus: () => Me(p.id),
        onToggle: () => Et((q) => vr(q, p.id)),
        onPreview: () => {
          Me(p.id), dt(!0);
        },
        onNavigate: e
      },
      p.id
    );
  }
}
function ia(e, t, r, i) {
  i(), r(t, e).catch(() => {
  });
}
function vr(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function oa(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function aa({
  tag: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: s,
  onFocus: c,
  onToggle: o,
  onOpen: f,
  onNavigate: u
}) {
  return /* @__PURE__ */ n(
    "article",
    {
      ref: s,
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${e.name}${i ? ", selected" : ""}`,
      onFocus: c,
      onClick: (g) => {
        c(), g.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        Zi,
        {
          tag: e,
          selected: i,
          onSelect: o,
          onClick: f,
          onNavigate: u
        }
      ) : /* @__PURE__ */ d("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "aria-label": i ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": i,
            onClick: (g) => {
              g.stopPropagation(), o();
            },
            children: i ? "✓" : ""
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
function sa({
  video: e,
  showTagBins: t,
  displayMode: r,
  focused: i,
  selected: s,
  setRef: c,
  onFocus: o,
  onToggle: f,
  onPreview: u,
  onNavigate: g
}) {
  var M, x;
  const v = Oi(e), S = P(null), T = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(T.date || T.studioName), R = !!(T.performers.length || T.tags.length);
  return Wn(() => {
    const F = S.current;
    if (!F) return;
    const D = F.querySelector(
      `a[href="/video/${e.id}"]`
    ), $ = F.querySelector(".card-title"), fe = `dq-card-title-${e.id}`;
    $ && ($.id = fe), D && (D.target = "_blank", D.rel = "noreferrer", D.removeAttribute("aria-label"), D.setAttribute("aria-labelledby", fe), D.classList.add("dq-card-link"));
    const De = F.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    De && De.setAttribute(
      "aria-label",
      s ? `Deselect ${v}` : `Select ${v}`
    );
    const h = F.querySelector(
      'button[title="Quick View"]'
    );
    h && h.setAttribute("aria-label", `Preview ${v}`);
  }), /* @__PURE__ */ d(
    "article",
    {
      ref: (F) => {
        S.current = F, c(F);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${v}${s ? ", selected" : ""}`,
      onFocus: o,
      onClick: (F) => {
        o(), F.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${r} ${y ? "has-card-metadata" : "no-card-metadata"} ${R ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${s ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          eo,
          {
            video: T,
            selected: s,
            onSelect: f,
            onNavigate: g,
            onQuickView: u,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ d("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (M = e.tags) == null ? void 0 : M.map((F) => /* @__PURE__ */ n("span", { children: F.name }, F.id)),
          !((x = e.tags) != null && x.length) && /* @__PURE__ */ n("small", { children: "No matching tags" })
        ] }),
        r === "wall" && /* @__PURE__ */ n(ca, { video: e })
      ]
    }
  );
}
function ca({ video: e }) {
  const t = P(null), r = P(null), [i, s] = C(!1), [c, o] = C(!1), [f, u] = C(!1);
  return J(() => {
    const g = t.current;
    if (!g || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      s(!0), o(!0);
      return;
    }
    const v = new IntersectionObserver(
      ([T]) => s(T.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), S = new IntersectionObserver(
      ([T]) => o(T.isIntersecting && T.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return v.observe(g), S.observe(g), () => {
      v.disconnect(), S.disconnect();
    };
  }, [e.id, e.files.length]), J(() => {
    if (!i) {
      u(!1);
      return;
    }
    const g = new AbortController();
    return W(To(e.id), {
      signal: g.signal
    }).then((v) => {
      g.signal.aborted || u(v.available === !0);
    }).catch(() => {
      g.signal.aborted || u(!1);
    }), () => g.abort();
  }, [i, e.id]), J(() => {
    const g = r.current;
    g && (c ? Promise.resolve(g.play()).catch(() => {
    }) : g.pause());
  }, [f, c]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: f && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: Ao(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function la({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: s,
  error: c,
  canWrite: o,
  assessmentReady: f,
  selected: u,
  hasPrevious: g,
  hasNext: v,
  onToggleSelected: S,
  onPrevious: T,
  onNext: y,
  onClose: R,
  onAction: M
}) {
  const x = P(null), F = P(null), D = e.files[0], $ = Oi(e);
  J(() => {
    var O;
    const h = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (O = x.current) == null || O.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = h;
    };
  }, []);
  function fe(h) {
    var N, B, ie;
    if (h.key !== "Tab") return;
    const O = [
      ...((N = x.current) == null ? void 0 : N.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((pe) => pe.offsetParent !== null);
    if (!O.length) {
      h.preventDefault(), (B = x.current) == null || B.focus();
      return;
    }
    const _ = O.indexOf(
      document.activeElement
    );
    h.shiftKey && _ <= 0 ? (h.preventDefault(), (ie = O.at(-1)) == null || ie.focus()) : !h.shiftKey && _ === O.length - 1 && (h.preventDefault(), O[0].focus());
  }
  function De(h) {
    if (h.defaultPrevented || h.ctrlKey || h.metaKey || h.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const O = h.key === "ArrowLeft" || h.key === "ArrowRight";
    if (h.altKey && !O) return;
    const _ = F.current, N = h.currentTarget.querySelector("video");
    if (h.key === "Enter" || h.key === "Escape")
      h.repeat || R();
    else if (h.key === " " && _)
      h.repeat || _.toggle();
    else if (O && _)
      _.seekBy(
        (h.key === "ArrowLeft" ? -1 : 1) * (h.shiftKey ? 5 : h.altKey ? 10 : 60)
      );
    else if ((h.key === "," || h.key === ".") && _) {
      const B = [D == null ? void 0 : D.duration, N == null ? void 0 : N.duration].find(
        (pe) => pe != null && Number.isFinite(pe) && pe > 0
      ) ?? 0, ie = e.parentVideoId != null ? (e.clipEndSec ?? B) - (e.clipStartSec ?? 0) : B;
      Number.isFinite(ie) && ie > 0 && _.seekBy((h.key === "," ? -1 : 1) * ie * 0.1);
    } else if (h.key.toLowerCase() === "n" || h.key.toLowerCase() === "m")
      !h.repeat && !i && !s && (h.key.toLowerCase() === "n" && g && T(), h.key.toLowerCase() === "m" && v && y());
    else if (h.key === "ArrowUp" && N)
      N.volume = Math.min(1, N.volume + 0.1);
    else if (h.key === "ArrowDown" && N)
      N.volume = Math.max(0, N.volume - 0.1);
    else return;
    et(h);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: x,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${$}`,
      className: "dq-preview",
      onKeyDown: fe,
      onKeyDownCapture: De,
      onMouseDown: (h) => {
        h.target === h.currentTarget && R();
      },
      children: /* @__PURE__ */ d("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ d("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !g || i || s,
              onClick: T,
              children: /* @__PURE__ */ n(ri, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !v || i || s,
              onClick: y,
              children: /* @__PURE__ */ n(ii, {})
            }
          ),
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ n("h2", { children: $ }),
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
              onClick: S,
              disabled: s,
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
              "aria-label": `Open ${$} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ n(no, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: R,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(ai, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: D ? /* @__PURE__ */ n(
          Yn,
          {
            autostart: !0,
            streamUrl: mi(e.id),
            posterUrl: Ln(e),
            format: D.format,
            audioCodec: D.audioCodec,
            duration: D.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (h) => (F.current = h, () => {
              F.current === h && (F.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: Ln(e), alt: "" }) }),
        c && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: c }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((h, O) => /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            disabled: i || s || h.steps.length > 0 && !o || ht(h) && !f,
            onClick: () => void M(h),
            children: [
              Nt(h, O) && /* @__PURE__ */ n("kbd", { children: Nt(h, O) }),
              h.label
            ]
          },
          h.id
        )) })
      ] })
    }
  );
}
function da({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: i = !1,
  onEditWorkspace: s,
  onSave: c,
  onChoose: o,
  onClose: f
}) {
  const [u, g] = C(
    () => i && t ? structuredClone(t) : null
  ), [v, S] = C(""), [T, y] = C(!1), [R, M] = C(
    i && t != null
  ), x = P(null);
  J(() => {
    var _, N;
    const h = document.activeElement, O = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (N = (_ = x.current) == null ? void 0 : _.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || N.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = O, h == null || h.focus({ preventScroll: !0 });
    };
  }, []);
  function F(h) {
    var N, B, ie;
    if (h.defaultPrevented) {
      h.stopPropagation();
      return;
    }
    if (h.key === "Escape") {
      et(h), T || f();
      return;
    }
    if (h.key !== "Tab") {
      h.stopPropagation();
      return;
    }
    const O = [
      ...((N = x.current) == null ? void 0 : N.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((pe) => pe.offsetParent !== null);
    if (!O.length) {
      et(h), (B = x.current) == null || B.focus();
      return;
    }
    const _ = O.indexOf(
      document.activeElement
    );
    h.shiftKey && _ <= 0 ? (et(h), (ie = O.at(-1)) == null || ie.focus()) : !h.shiftKey && _ === O.length - 1 ? (et(h), O[0].focus()) : h.stopPropagation();
  }
  function D(h, O = !!h) {
    M(O), g(
      h ? structuredClone(h) : {
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
  async function $() {
    if (T) return;
    if (!u || Sr(u)) {
      S(u ? Sr(u) : "Choose a review.");
      return;
    }
    const h = { ...u, name: u.name.trim() }, O = e.some((_) => _.id === h.id) ? e.map((_) => _.id === h.id ? h : _) : [...e, h];
    y(!0), S("");
    try {
      if (!await c(O)) throw new Error("Could not save reviews.");
      !e.some((_) => _.id === h.id) && h.entityType !== "tag" ? s(h.id) : (o(h.id), f());
    } catch (_) {
      S(
        "Could not save reviews. Your edits are still open. " + (_ instanceof Error ? _.message : "Retry saving.")
      );
    } finally {
      y(!1);
    }
  }
  async function fe(h) {
    if (!T) {
      y(!0), S("");
      try {
        if (!await c(h)) throw new Error("Could not save reviews.");
      } catch (O) {
        S(
          O instanceof Error ? O.message : "Could not save reviews."
        );
      } finally {
        y(!1);
      }
    }
  }
  async function De(h) {
    var _;
    if (T) return;
    const O = (_ = h.target.files) == null ? void 0 : _[0];
    if (h.target.value = "", !!O) {
      if (O.size > 2e6) {
        S("Review files must be smaller than 2 MB.");
        return;
      }
      y(!0), S("");
      try {
        const N = dr(await O.text());
        if (!await c(Qr(e, N)))
          throw new Error("Could not save reviews.");
      } catch (N) {
        S(
          N instanceof Error ? N.message : "Could not import reviews."
        );
      } finally {
        y(!1);
      }
    }
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: x,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: F,
      children: /* @__PURE__ */ d("div", { className: "dq-manager", children: [
        /* @__PURE__ */ d("header", { children: [
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ n("h2", { children: u ? e.some((h) => h.id === u.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: T,
              onClick: f,
              children: /* @__PURE__ */ n(ai, {})
            }
          )
        ] }),
        v && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: v }),
        /* @__PURE__ */ n("fieldset", { disabled: T, className: "dq-manager-content", children: u ? /* @__PURE__ */ n(
          $i,
          {
            setup: u.entityType !== "tag" && !e.some((h) => h.id === u.id),
            draft: u,
            entityTypeLocked: R,
            tagGroups: r,
            saving: T,
            setDraft: g,
            onSave: () => void $(),
            onCancel: f
          }
        ) : /* @__PURE__ */ d(ve, { children: [
          /* @__PURE__ */ d("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: () => {
              const h = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), O = document.createElement("a");
              O.href = h, O.download = "data-quality-reviews.json", O.click(), URL.revokeObjectURL(h);
            }, children: "Export reviews" }),
            /* @__PURE__ */ d(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => D(),
                children: [
                  /* @__PURE__ */ n(io, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ d("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(oo, {}),
              " Import reviews",
              /* @__PURE__ */ n(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: De
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((h) => /* @__PURE__ */ d("article", { children: [
            /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ d("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(qi, { entityType: we(h) }),
                /* @__PURE__ */ n("strong", { children: h.name })
              ] }),
              /* @__PURE__ */ n("p", { children: h.description || "No description" })
            ] }),
            /* @__PURE__ */ d("button", { type: "button", onClick: () => h.entityType === "tag" || we(h) === "video" && h.view.reviewMode === "multiple" ? D(h) : s(h.id), children: [
              /* @__PURE__ */ n(ni, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => D({
                  ...structuredClone(h),
                  id: crypto.randomUUID(),
                  name: `${h.name} copy`
                }, !0),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${h.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${h.name}”?`) && fe(
                    e.filter((O) => O.id !== h.id)
                  );
                },
                children: /* @__PURE__ */ n(si, {})
              }
            )
          ] }, h.id)) })
        ] }) })
      ] })
    }
  );
}
function $i({
  workspace: e = !1,
  setup: t = !1,
  draft: r,
  entityTypeLocked: i,
  tagGroups: s,
  saving: c = !1,
  setDraft: o,
  onSave: f,
  onCancel: u
}) {
  const [g, v] = C("Review"), S = we(r), T = (M) => {
    if (!(i || M === S)) {
      if (M === "performerOccurrence") {
        o({
          id: r.id,
          entityType: M,
          name: r.name,
          description: r.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end" },
          actions: [],
          occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: !0 }
        });
        return;
      }
      o(
        M === "tag" ? {
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
  }, y = P(/* @__PURE__ */ new WeakMap()), R = (M) => {
    let x = y.current.get(M);
    return x || (x = crypto.randomUUID(), y.current.set(M, x)), x;
  };
  return /* @__PURE__ */ d("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      Yi,
      {
        tabs: (t ? ["Review"] : e ? ["Review", ...S === "video" ? ["Appearance"] : [], "Actions", ...S === "performerOccurrence" ? ["Tag choices"] : []] : S === "performerOccurrence" ? ["Review", "Queue", "Actions", ...r.occurrence.tagIds.length ? ["Tag choices"] : []] : ["Review", "Queue", "Appearance", "Actions"]).map((M) => ({
          key: M,
          label: M,
          count: M === "Actions" ? r.actions.length : void 0,
          disabled: c
        })),
        activeTab: g,
        onTabChange: v
      }
    ) }),
    /* @__PURE__ */ d("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ d("section", { hidden: g !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ d("label", { children: [
          "Entity type",
          /* @__PURE__ */ d(
            "select",
            {
              "aria-label": "Entity type",
              value: S,
              disabled: i,
              onChange: (M) => T(M.target.value),
              children: [
                /* @__PURE__ */ n("option", { value: "video", children: "Videos" }),
                /* @__PURE__ */ n("option", { value: "tag", children: "Tags" }),
                /* @__PURE__ */ n("option", { value: "performerOccurrence", children: "Performer occurrence tags" })
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
              onChange: (M) => o({ ...r, name: M.target.value })
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
              onChange: (M) => o({ ...r, description: M.target.value })
            }
          )
        ] })
      ] }),
      !e && !t && /* @__PURE__ */ d("section", { hidden: g !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ n(Vn, { draft: r, onChange: o, presentation: !1 }),
        r.entityType === "performerOccurrence" && /* @__PURE__ */ n(Kn, { review: r, onChange: o })
      ] }),
      !t && r.entityType === "performerOccurrence" && /* @__PURE__ */ n("section", { hidden: g !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n(Kn, { review: r, onChange: o, choices: !0 }) }),
      !t && (!e || S === "video") && /* @__PURE__ */ n("section", { hidden: g !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(Vn, { draft: r, onChange: o, queue: !1 }) }),
      !t && /* @__PURE__ */ n("section", { hidden: g !== "Actions", className: "dq-editor-section", children: S === "tag" ? /* @__PURE__ */ n(
        fa,
        {
          draft: r,
          saving: c,
          tagGroups: s,
          setDraft: o
        }
      ) : /* @__PURE__ */ n(
        ua,
        {
          draft: r,
          saving: c,
          stepKey: R,
          rememberStepKey: (M, x) => y.current.set(M, R(x)),
          setDraft: o
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
            const M = URL.createObjectURL(
              new Blob([JSON.stringify([r], null, 2)], {
                type: "application/json"
              })
            ), x = document.createElement("a");
            x.href = M, x.download = "data-quality-review.json", x.click(), URL.revokeObjectURL(M);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: u, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: f, children: t ? "Create & configure" : "Save review" })
    ] })
  ] });
}
function xi({
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
function ua({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: i,
  setDraft: s
}) {
  const c = (o, f) => s({
    ...e,
    actions: e.actions.map(
      (u, g) => g === o ? f : u
    )
  });
  return /* @__PURE__ */ d(ve, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    e.entityType === "performerOccurrence" && /* @__PURE__ */ n("p", { children: "Actions apply only to the active performer in this scene. Set performer matching in the review filters below. Save review keeps those criteria with this rule." }),
    /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      Br,
      {
        items: e.actions,
        getKey: (o) => o.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (o) => s({ ...e, actions: o }),
        renderItem: (o, { index: f, dragHandleProps: u, isOver: g }) => /* @__PURE__ */ d(
          "fieldset",
          {
            className: g ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ d("legend", { children: [
                "Action ",
                f + 1
              ] }),
              /* @__PURE__ */ d("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...u,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${f + 1}`,
                    children: /* @__PURE__ */ n(an, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: o.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => s({
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
                xi,
                {
                  action: o,
                  onChange: (v) => c(f, v)
                }
              ),
              /* @__PURE__ */ n(
                Br,
                {
                  items: o.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (v) => c(f, { ...o, steps: v }),
                  renderItem: (v, S) => /* @__PURE__ */ n(
                    pa,
                    {
                      dragHandleProps: S.dragHandleProps,
                      saving: t,
                      isOver: S.isOver,
                      step: v,
                      index: S.index,
                      onChange: (T) => {
                        i(T, v), c(f, {
                          ...o,
                          steps: o.steps.map(
                            (y, R) => R === S.index ? T : y
                          )
                        });
                      },
                      onRemove: () => c(f, {
                        ...o,
                        steps: o.steps.filter(
                          (T, y) => y !== S.index
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
                    onClick: () => c(f, {
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
                    onClick: () => s({
                      ...e,
                      actions: e.actions.filter(
                        (v, S) => S !== f
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
        onClick: () => s({
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
function fa({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: i
}) {
  const s = (c, o) => i({
    ...e,
    actions: e.actions.map(
      (f, u) => u === c ? o : f
    )
  });
  return /* @__PURE__ */ d(ve, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      Br,
      {
        items: e.actions,
        getKey: (c) => c.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (c) => i({ ...e, actions: c }),
        renderItem: (c, { index: o, dragHandleProps: f, isOver: u }) => /* @__PURE__ */ d(
          "fieldset",
          {
            className: u ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ d("legend", { children: [
                "Action ",
                o + 1
              ] }),
              /* @__PURE__ */ d("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...f,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${o + 1}`,
                    children: /* @__PURE__ */ n(an, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: c.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => i({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, o + 1),
                        {
                          ...structuredClone(c),
                          id: crypto.randomUUID(),
                          label: c.label + " copy"
                        },
                        ...e.actions.slice(o + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                xi,
                {
                  action: c,
                  onChange: (g) => s(o, g)
                }
              ),
              /* @__PURE__ */ d("label", { children: [
                "Action effect",
                /* @__PURE__ */ d(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: c.effect.mode === "SET_TAG_GROUP" ? `group:${c.effect.tagGroupId}` : c.effect.mode,
                    onChange: (g) => {
                      const v = g.target.value;
                      s(o, {
                        ...c,
                        effect: v === "SKIP" ? { mode: "SKIP" } : v === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : {
                          mode: "SET_TAG_GROUP",
                          tagGroupId: Number(v.slice(6))
                        }
                      });
                    },
                    children: [
                      /* @__PURE__ */ n("option", { value: "SKIP", children: "Skip" }),
                      /* @__PURE__ */ n("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
                      c.effect.mode === "SET_TAG_GROUP" && !r.some(
                        (g) => g.id === c.effect.tagGroupId
                      ) && /* @__PURE__ */ n(
                        "option",
                        {
                          value: `group:${c.effect.tagGroupId}`,
                          disabled: !0,
                          children: "Unavailable tag group"
                        }
                      ),
                      r.map((g) => /* @__PURE__ */ n("option", { value: `group:${g.id}`, children: g.name }, g.id))
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
                      (g, v) => v !== o
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
function pa({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: i,
  isOver: s,
  onChange: c,
  onRemove: o
}) {
  const f = Pi(e.mode);
  return /* @__PURE__ */ d(
    "div",
    {
      className: s ? "dq-action-step dq-drag-over" : "dq-action-step",
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
            children: /* @__PURE__ */ n(an, {})
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
            onChange: (u) => c({ ...e, mode: u.target.value }),
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
          pt,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (u) => c({ ...e, tagIds: u }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: o, children: /* @__PURE__ */ n(si, {}) })
      ]
    }
  );
}
async function ga() {
  const e = await W("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const o = JSON.parse(r);
      Array.isArray(o.reviews) && (i = JSON.stringify(o.reviews, null, 2));
    } catch {
    }
  const s = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), c = document.createElement("a");
  c.href = s, c.download = "data-quality-browser-recovery.json", c.click(), URL.revokeObjectURL(s);
}
function Qn({ label: e }) {
  return /* @__PURE__ */ d("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(oi, { className: "dq-spin" }),
    e
  ] });
}
function zn({
  message: e,
  onRetry: t,
  retryLabel: r = "Retry"
}) {
  return /* @__PURE__ */ d("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(Gr, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: r })
  ] });
}
const va = { components: { DataQualityPage: na } };
export {
  na as DataQualityPage,
  va as default,
  lr as objectFiltersEqual
};
