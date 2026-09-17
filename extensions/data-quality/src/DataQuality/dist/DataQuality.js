import { jsxs as u, jsx as n, Fragment as Oe } from "react/jsx-runtime";
import { useRef as P, useState as E, useMemo as Et, useEffect as B, useCallback as St, useLayoutEffect as Tn } from "react";
import { DetailListToolbar as Pr, VIDEO_SORT_OPTIONS as Kr, VIDEO_CRITERIA as mr, EntityReferenceMultiSelector as ot, PERFORMER_CRITERIA as dn, FilterDialog as Rn, DetailListPagination as qn, VideoPlayer as kn, TAG_SORT_OPTIONS as In, TAG_CRITERIA as On, EntityDetailTabs as Ci, TagTile as Ni, VideoCard as Ai, SortableList as Mr } from "@cove/runtime/components";
import { Save as Gr, RotateCcw as Pn, ChevronLeft as Mn, Pencil as Fn, Settings as Ti, AlertTriangle as Fr, ChevronRight as $n, Film as $r, Loader2 as xn, Tags as Ri, ExternalLink as qi, X as Ln, Plus as ki, Upload as Ii, Trash2 as _n, GripVertical as Vr } from "@cove/runtime/lucide-react";
import { extensionFetch as Oi } from "@cove/runtime/api";
function ve(e) {
  return e.entityType ?? "video";
}
function pt(e, t) {
  return "qwertyuiop"[t] ?? "";
}
function hr(e) {
  if (e.entityType === "performerOccurrence") {
    if (!Un(e.occurrence))
      return "Complete the optional occurrence condition before saving.";
    if (e.actions.some((t) => t.steps.some((r) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(r.mode))))
      return "Occurrence actions support adding and removing tags on the active performer. Video tag assessments are not supported here.";
  }
  return ve(e) === "video" && e.actions.some(
    (t) => Dn(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => jt(t, ve(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
function Ie(e) {
  const t = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(1e3, t(e.perPage, 40)))
  };
}
function un(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function Ye(e) {
  const { page: t, ...r } = e.view.filter, i = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    e.entityType === "performerOccurrence" ? ["performerOccurrence", ...i, e.occurrence] : ve(e) === "tag" ? ["tag", ...i] : i
  );
}
function jt(e, t) {
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
  ) && !Dn(e) : !1;
}
function yr(e) {
  return "steps" in e ? e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  ) : !1;
}
function Dn(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.steps)
    if (["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(r.mode))
      for (const i of r.tagIds) {
        const a = t.get(i);
        if (a && a !== r.mode) return !0;
        t.set(i, r.mode);
      }
  return !1;
}
function nr(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || r.entityType === "video" || r.entityType === "tag" || r.entityType === "performerOccurrence") && (r.entityType !== "performerOccurrence" || Un(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && (r.view.reviewMode === void 0 || ["single", "multiple"].includes(r.view.reviewMode)) && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Pi(r.presentation, r.entityType === "tag") && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (r.entityType === "tag" ? "effect" in i && !("steps" in i) && jt(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (a) => a && Array.isArray(a.tagIds)
      ) && jt(i, "video"))
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
function Pi(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const r = e;
  return (r.cardSize === void 0 || r.cardSize === null || Number.isFinite(r.cardSize) && r.cardSize >= 115 && r.cardSize <= 380) && (!t || r.annotations === void 0 && r.annotationParents === void 0 && r.binParents === void 0) && (r.annotations === void 0 || Array.isArray(r.annotations) && r.annotations.every(
    (i) => ["date", "studio", "performers", "tags"].includes(i)
  )) && [r.annotationParents, r.binParents].every(
    (i) => i === void 0 || Array.isArray(i) && i.every((a) => Number.isSafeInteger(a) && a > 0)
  );
}
function xr(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const a of i)
      r.has(a.id) || (r.add(a.id), t.push(a));
  return t;
}
function Un(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (i) => Array.isArray(i) && i.every((a) => Number.isSafeInteger(a) && a > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && (t.targetMode !== "selected" || t.performerIds.length > 0) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && ["any", "includes", "includesAll", "excludes", "isNull"].includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && r(t.tagIds) && typeof t.multiple == "boolean";
}
function fn(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function pn(e, t, r, i) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!i && t.includes(r)) return r;
  const a = Math.max(0, e.indexOf(r));
  if (i) {
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
function Mi(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((a) => r.has(a));
  for (const a of t)
    i ? r.delete(a) : r.add(a);
  return r;
}
function jn(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function Fi(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function $i(e, t) {
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
const Kn = "ext:com.midnightrider.data-quality:configuration", xi = "ext:cove-data-quality:video-reviews", Lr = "ext:com.midnightrider.data-quality:progress", ir = /* @__PURE__ */ new Map(), pr = /* @__PURE__ */ new Map(), _t = (e, t) => e.includes("*") || e.includes(t), br = (e) => G(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Li = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function _r(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Dt(e) {
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
    deletedIds: _r(t.deletedIds),
    importedIds: _r(t.importedIds)
  };
}
function _i(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const a of t) {
    const d = localStorage.getItem(a);
    if (d !== null) {
      const s = nr(d);
      r ?? (r = s), s.forEach((g) => i.add(g.id));
    }
    _r(
      JSON.parse(localStorage.getItem(`${a}:account-imports`) ?? "[]")
    ).forEach((s) => i.add(s));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function Gn(e) {
  const t = await G("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Vn(e, t) {
  const r = (pr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return pr.set(e, r), r.finally(() => {
    pr.get(e) === r && pr.delete(e);
  }).catch(() => {
  }), r;
}
let Yt = null;
function Di() {
  if (Yt) return Yt;
  const e = Ui();
  return Yt = e, e.finally(() => {
    Yt === e && (Yt = null);
  }).catch(() => {
  }), e;
}
async function Ui() {
  var b;
  const e = await G("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = _t(e.permissions, "savedfilters.read"), a = i && _t(e.permissions, "savedfilters.write"), d = i ? (await br(Kn)).filter((I) => I.name === "Data Quality configuration").sort((I, O) => I.id - O.id) : [];
  if (d.length > 1) {
    const I = (O) => {
      const { revision: q, ...T } = Dt(O.uiOptions);
      return JSON.stringify(T);
    };
    if (d.some((O) => I(O) !== I(d[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (a)
      for (const O of d.slice(1))
        await G(`/api/savedfilters/${O.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${O.id}` })
        });
    d.splice(1);
  }
  let s = d.length ? Dt(d[0].uiOptions) : Li();
  const g = localStorage.getItem(`${r}:migrated`) === "true", m = localStorage.getItem(r), h = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && m && (s = Dt(m));
  let S = !d.length;
  if (d.length && h && m) {
    const I = Dt(m);
    if (I.reviews.some((q) => {
      const T = s.reviews.find((D) => D.id === q.id);
      return T && JSON.stringify(T) !== JSON.stringify(q);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const O = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...I.deletedIds])
    ];
    s = {
      ...s,
      reviews: xr(s.reviews, I.reviews).filter(
        (q) => !O.includes(q.id)
      ),
      deletedIds: O,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...I.importedIds])
      ]
    }, S = !0;
  }
  if (!g) {
    const I = JSON.stringify(s), O = _i(t);
    if (d.length && O.reviews.some((A) => {
      const ne = s.reviews.find((X) => X.id === A.id);
      return ne && JSON.stringify(ne) !== JSON.stringify(A);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const q = i ? (await br(xi)).flatMap(
      (A) => nr(A.uiOptions ?? "[]")
    ) : [], T = O.known.filter(
      (A) => !O.reviews.some((ne) => ne.id === A)
    ), D = /* @__PURE__ */ new Set([...s.deletedIds, ...T]);
    s = {
      ...s,
      reviews: xr(
        O.reviews,
        s.reviews,
        q.filter(
          (A) => !O.known.includes(A.id) && !s.importedIds.includes(A.id)
        )
      ).filter((A) => !D.has(A.id)),
      deletedIds: [...D],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...O.known,
          ...q.map((A) => A.id)
        ])
      ]
    }, S || (S = JSON.stringify(s) !== I);
  }
  const C = {
    userId: t,
    recordId: (b = d[0]) == null ? void 0 : b.id,
    config: s,
    readable: i,
    writable: a,
    durable: a
  };
  if (ir.set(r, C), S && a) {
    const I = s;
    d.length && (C.config = Dt(d[0].uiOptions)), await Bn(r, I), s = C.config;
  } else d.length || (localStorage.setItem(r, JSON.stringify(s)), !i && (!g || h) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (a)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: s.reviews,
    storageKey: r,
    canWrite: _t(e.permissions, "videos.write"),
    canWriteVideos: _t(e.permissions, "videos.write"),
    canWriteTags: _t(e.permissions, "tags.write"),
    canReadTagGroups: _t(e.permissions, "taggroups.read"),
    canConfigure: !i || a,
    storageNotice: i ? a ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Bn(e, t) {
  const r = ir.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await Gn(r), r.recordId != null) {
      const d = await G(
        `/api/savedfilters/${r.recordId}`
      );
      if (Dt(d.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const a = await G(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Kn,
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
function ji(e, t) {
  return nr(JSON.stringify(t)), Vn(e, async () => {
    const r = ir.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((a) => !t.some((d) => d.id === a.id)).map((a) => a.id);
    await Bn(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((a) => !t.some((d) => d.id === a))
    });
  });
}
function gn(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([r, i]) => /^[1-9]\d*:[1-9]\d*$/.test(r) && ["reviewed", "cannotDetermine"].includes(String(i)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Ki(e, t) {
  const r = ir.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), a = i ? gn(i) : null;
  if (!r.readable) return a;
  const d = (await br(Lr)).find(
    (g) => g.name === t
  ), s = d ? gn(d.uiOptions) : null;
  return a && (!s || a.updatedAt > s.updatedAt) ? a : s;
}
function Gi(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return Vn(i, async () => {
    const a = ir.get(e);
    if (!(a != null && a.writable)) return;
    await Gn(a);
    const d = (await br(Lr)).find(
      (s) => s.name === t
    );
    await G(
      d ? `/api/savedfilters/${d.id}` : "/api/savedfilters",
      {
        method: d ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Lr,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Ct = "confirmed_absent_tags", Br = "Confirmed absent tags", Vi = {
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
function Kt(e) {
  return Array.isArray(e) ? e.map(Kt) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? Vi[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === Ct.toLowerCase() ? r.toLowerCase() : Kt(r)
    ])
  ) : e;
}
async function G(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await Oi(e, { ...t, headers: r });
  if (!i.ok) {
    let d = i.statusText || `Request failed (${i.status}).`;
    try {
      const s = await i.json();
      d = s.message || s.detail || s.error || d;
    } catch {
    }
    throw new Error(d);
  }
  if (i.status === 204 || i.status === 205) return;
  const a = await i.text();
  return a ? JSON.parse(a) : void 0;
}
const Bi = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Ji = 0;
function Jr(e) {
  return G(`/api/videos/${e}?dqRead=${Bi}-${++Ji}`, { cache: "no-store" });
}
async function er(e, t, r) {
  const i = { ...e.view.objectFilter }, a = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return G("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Kt({
        findFilter: Ie(t),
        objectFilter: i,
        filterExpression: a
      })
    )
  });
}
async function mn(e, t, r) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, G("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Kt({
        findFilter: Ie(t),
        objectFilter: i
      })
    )
  });
}
function Qi(e) {
  return G("/api/taggroups", { signal: e });
}
function Wi(e) {
  return `/api/videos/${e.id}/image?max=1280&v=${encodeURIComponent(e.updatedAt)}`;
}
function Jn(e) {
  return `/api/stream/video/${e}`;
}
function hn(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function zi(e) {
  return `/api/stream/video/${e}/preview`;
}
function Hi(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Xi(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function or(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const i of e) {
    await G(`/api/tags/${i}`, { signal: t }), r.add(i);
    for (let a = 1; ; a++) {
      const d = await G("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Kt({
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
function Yi(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${Ct} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function Qr() {
  const t = (await G("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === Ct.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${Br} custom field before applying tag assessments.`
    };
  const r = Yi(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function Zi() {
  const e = await Qr();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await G("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: Ct,
        label: Br,
        type: "tag",
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function wr(e) {
  return [...new Set(e)];
}
function eo(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${Ct} value is not a valid tag list.`
    );
  return wr(e);
}
function to(e) {
  return wr(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function ro(e, t) {
  let r;
  try {
    r = await Qr();
  } catch (h) {
    throw new Error(
      `Could not verify the ${Br} custom field. ${h instanceof Error ? h.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const i = await Promise.all(
    e.steps.map(async (h) => ({
      ...h,
      tagIds: h.mode === "REMOVE_TREE" ? await or(h.tagIds) : wr(h.tagIds)
    }))
  ), a = i.filter(
    (h) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(h.mode)
  ), d = i.filter(
    (h) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(h.mode)
  ), s = wr(t), g = r.definition.key;
  let m = 0;
  for (const h of s)
    try {
      const S = await Jr(h), C = to(S), b = { ...S.customFields ?? {} }, I = b[g], O = eo(I), q = new Set(C), T = new Set(O);
      for (const X of a)
        for (const ie of X.tagIds)
          X.mode === "ADD" ? q.add(ie) : q.delete(ie);
      for (const X of d)
        for (const ie of X.tagIds)
          X.mode === "MARK_PRESENT" ? (q.add(ie), T.delete(ie)) : X.mode === "MARK_ABSENT" ? (q.delete(ie), T.add(ie)) : T.delete(ie);
      const D = [...q], A = [...T];
      JSON.stringify(C) === JSON.stringify(D) && JSON.stringify(O) === JSON.stringify(A) && (I === void 0 ? A.length === 0 : JSON.stringify(I) === JSON.stringify(O)) || await G(`/api/videos/${h}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: D,
          customFields: {
            ...b,
            [g]: A
          }
        })
      }), m++;
    } catch (S) {
      throw new Error(
        `Assessment stopped after ${m} video${m === 1 ? "" : "s"} completed; video ${h} was affected. Refresh and inspect it before retrying. ${S instanceof Error ? S.message : "Request failed."}`
      );
    }
}
async function Qn(e, t) {
  if (!jt(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (yr(e)) {
    await ro(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (i) => ({
      mode: i.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: i.mode === "REMOVE_TREE" ? await or(i.tagIds) : i.tagIds
    }))
  );
  for (let i = 0; i < r.length; i++)
    try {
      await G("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({
          ids: [...t],
          tagIds: [...r[i].tagIds],
          tagMode: r[i].mode
        })
      });
    } catch (a) {
      throw new Error(
        `Step ${i + 1} failed; ${i} earlier step(s) completed. Refresh and check the selected videos before retrying. ${a instanceof Error ? a.message : "Request failed."}`
      );
    }
}
async function no(e, t) {
  if (!jt(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await G("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
async function io(e, t, r) {
  if (!jt(r) || r.steps.some(
    (d) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(d.mode)
  ))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const i = await Promise.all(
    r.steps.map(async (d) => ({
      ...d,
      tagIds: d.mode === "REMOVE_TREE" ? await or(d.tagIds) : d.tagIds
    }))
  );
  let a = t.applications;
  for (const d of i)
    a = await Hn(
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
async function Wn(e, t) {
  const r = e.occurrence;
  if (r.targetMode === "all" || r.targetMode === "filter" && Object.keys(r.performerFilter).length === 0) return null;
  if (r.targetMode === "selected") return r.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: a, ...d } = r.performerFilter;
  for (let s = 1; ; s++) {
    const g = await G("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Kt({
          findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: d,
          filterExpression: a
        })
      )
    });
    if (g.items.forEach((m) => i.add(m.id)), s * 1e3 >= g.totalCount) return [...i];
    if (!g.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function zn(e, t) {
  const { _filterExpression: r, ...i } = e.view.objectFilter, a = e.occurrence, d = {
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
            { filter: i },
            { filter: { performerFilterCriterion: d } }
          ]
        }
      }
    }
  };
}
function oo(e, t, r = e.conditionTagIds.map((i) => [i])) {
  const i = new Set(t), a = (d) => d.some((s) => i.has(s));
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
  }
}
async function ao(e, t, r, i) {
  if ((t == null ? void 0 : t.length) === 0)
    return { items: [], totalCount: 0 };
  const a = await er(
    zn(e, t),
    { ...e.view.filter, page: r },
    i
  ), d = t === null ? null : new Set(t), s = e.occurrence, g = a.items.length && s.includeSubtags !== !1 && !["any", "isNull"].includes(s.condition) ? await Promise.all(s.conditionTagIds.map((S) => or([S], i))) : s.conditionTagIds.map((S) => [S]), m = new Array(a.items.length);
  let h = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, a.items.length) }, async () => {
      for (; h < a.items.length; ) {
        const S = h++, C = a.items[S], b = await G(
          `/api/tagapplications?hostType=video&hostId=${C.id}&contextType=performer`,
          { signal: i }
        );
        m[S] = C.performers.filter((I) => d === null || d.has(I.id)).flatMap((I) => {
          const O = b.filter(
            (q) => q.hostType === "video" && q.hostId === C.id && q.contextType === "performer" && q.contextId === I.id
          );
          return oo(
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
async function Hn(e, t, r) {
  const i = new Set(e.occurrence.tagIds);
  if (r.some((m) => !i.has(m)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const a = await Jr(t.video.id);
  if (!a.performers.some(
    (m) => m.id === t.performer.id
  ))
    throw new Error(
      "This performer is no longer linked to the scene. Refresh the queue."
    );
  const d = `/api/tagapplications?hostType=video&hostId=${a.id}&contextType=performer&contextId=${t.performer.id}`, s = (await G(d)).filter(
    (m) => m.hostType === "video" && m.hostId === a.id && m.contextType === "performer" && m.contextId === t.performer.id
  ), g = new Set(r);
  try {
    for (const m of g)
      s.some((h) => h.tag.id === m) || await G("/api/tagapplications", {
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
      i.has(m.tag.id) && !g.has(m.tag.id) && await G(`/api/tagapplications/${m.id}`, {
        method: "DELETE"
      });
    return await G(d);
  } catch (m) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${m instanceof Error ? m.message : "Request failed."}`
    );
  }
}
function rr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, g) => rr(s, t[g]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, a = Object.keys(r).sort(), d = Object.keys(i).sort();
  return a.length === d.length && a.every(
    (s, g) => s === d[g] && rr(r[s], i[s])
  );
}
const vr = [
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
], so = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0
};
function Ut(e) {
  const t = e.entityType === "performerOccurrence" ? e.occurrence : void 0;
  return {
    filter: Ie({
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
function yn(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function Dr(e, t) {
  if (!vr.some((s) => t.has(s))) {
    const s = Ut(e);
    return { query: s, startAtEnd: s.startFrom === "end" };
  }
  const i = {
    q: t.get("q") ?? "",
    page: Number(t.get("page") ?? 1),
    perPage: Number(t.get("perPage") ?? 40),
    sort: t.get("sort") ?? "date",
    direction: t.get("direction") === "asc" ? "asc" : "desc"
  };
  if (t.has("seed") && (i.seed = Number(t.get("seed"))), t.get("sorts")) {
    const s = t.get("sorts").split(",").map((g) => {
      const m = g.lastIndexOf(":");
      return { key: g.slice(0, m), direction: g.slice(m + 1) };
    });
    if (s.some((g) => !g.key || !["asc", "desc"].includes(g.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = s, i.sort = s[0].key, i.direction = s[0].direction;
  }
  let a;
  if (e.entityType === "performerOccurrence" && (a = {
    ...so,
    ...yn(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(a.targetMode) || !["any", "includes", "includesAll", "excludes", "isNull"].includes(
    a.condition
  ) || !Array.isArray(a.performerIds) || !Array.isArray(a.conditionTagIds) || typeof a.includeSubtags != "boolean" || [...a.performerIds, ...a.conditionTagIds].some(
    (s) => !Number.isSafeInteger(s) || s <= 0
  ) || !a.performerFilter || typeof a.performerFilter != "object" || Array.isArray(a.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const d = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Ie(i),
      objectFilter: yn(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: d,
      performerScope: a
    },
    startAtEnd: !t.has("page") && d === "end"
  };
}
function tr(e, t) {
  const r = new URLSearchParams(window.location.search);
  vr.forEach((i) => r.delete(i)), r.set("review", e);
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
function lo(e, t) {
  return {
    added: t.filter((r) => !e.includes(r)),
    removed: e.filter((r) => !t.includes(r))
  };
}
function co(e) {
  return `/api/tagapplications?hostType=video&hostId=${e.video.id}&contextType=performer&contextId=${e.occurrence.performer.id}`;
}
async function Zt(e) {
  var d;
  if (e.occurrence) {
    const s = (await G(co(e))).filter(
      (g) => g.hostType === "video" && g.hostId === e.video.id && g.contextType === "performer" && g.contextId === e.occurrence.performer.id
    );
    return {
      ids: [...new Set(s.map((g) => g.tag.id))],
      names: [...new Set(s.map((g) => g.tag.name))],
      absent: [],
      applications: s
    };
  }
  const t = await Jr(e.video.id), r = (t.tags ?? []).filter(
    (s) => s.canRemove !== !1 || s.isDerived !== !0
  ), i = Object.keys(t.customFields ?? {}).find(
    (s) => s.toLowerCase() === Ct
  ) ?? Ct, a = ((d = t.customFields) == null ? void 0 : d[i]) ?? [];
  if (!Array.isArray(a) || a.some((s) => !Number.isSafeInteger(s)))
    throw new Error(
      "Confirmed absent tags are invalid. Inspect the video before editing."
    );
  return { ids: r.map((s) => s.id), names: r.map((s) => s.name), absent: a };
}
async function uo(e, t, r) {
  if (t.occurrence && e.entityType === "performerOccurrence")
    await Hn(
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
      a.length && await G("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({ ids: [t.video.id], tagMode: i, tagIds: a })
      });
}
async function fo(e, t, r) {
  t.occurrence && e.entityType === "performerOccurrence" ? await io(e, t.occurrence, r) : await Qn(r, [t.video.id]);
}
const po = {
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
function Wr(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function go(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function Xn(e) {
  return [
    ...new Set(
      Wr(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Yn(e, t) {
  const r = Wr(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((i) => {
      const a = String(i.key ?? ""), d = po[String(i.modifier ?? "EQUALS")], s = (C, b) => String(b ?? "").trim() || t[String(C)] || String(C ?? ""), g = s(
        i.value,
        i.displayValue
      ), m = s(
        i.value2,
        i.displayValue2
      ), h = String(i.modifier ?? "EQUALS"), S = h === "IS_NULL" || h === "NOT_NULL" ? [] : h === "BETWEEN" || h === "NOT_BETWEEN" ? [g, "and", m] : [g];
      return {
        ...i,
        label: [go(a), d, ...S].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function Zn(e) {
  const t = Wr(e.customFieldCriteria);
  return t.length ? {
    ...e,
    customFieldCriteria: t.map(
      ({ label: r, ...i }) => i
    )
  } : e;
}
function ei(e, t, r) {
  return r || "customFieldCriteria" in t || !Array.isArray(e.customFieldCriteria) ? t : { ...t, customFieldCriteria: e.customFieldCriteria };
}
function bn({
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
function kr(e, t) {
  if (!t) return e;
  const r = /* @__PURE__ */ new Map();
  for (const i of e)
    r.set(i.video.id, [...r.get(i.video.id) ?? [], i]);
  return [...r.values()].reverse().flat();
}
const We = (e) => e instanceof Error ? e.message : "Request failed.";
function mo({
  actions: e,
  disabled: t,
  canWrite: r,
  onApply: i
}) {
  const [a, d] = E({});
  B(() => {
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
            (await G(`/api/tags/${m}`)).name
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
          onClick: (h) => i(g, h.shiftKey),
          children: /* @__PURE__ */ u("span", { children: [
            pt(g, m) && /* @__PURE__ */ n("kbd", { children: pt(g, m) }),
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
          onClick: () => i(g, !0),
          children: /* @__PURE__ */ n(Gr, { "aria-hidden": "true" })
        }
      ),
      g.steps.length > 0 && /* @__PURE__ */ n("small", { className: "dq-review-action-summary", children: g.steps.map(
        (h) => `${s[h.mode]}: ${h.tagIds.map((S) => a[S] ?? "Loading tag…").join(", ")}`
      ).join("; ") })
    ] }, g.id))
  ] });
}
function ho({
  review: e,
  canWrite: t,
  onBusy: r,
  onSaveDefaults: i,
  editRequest: a = 0,
  renderRuleEditor: d
}) {
  var Jt;
  const s = P(null), g = P("");
  if (!s.current)
    try {
      s.current = Dr(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (l) {
      g.current = We(l), s.current = { query: Ut(e), startAtEnd: !1 };
    }
  const [m, h] = E(null), S = P(null), C = P(null), b = P(null), [I, O] = E(!!g.current), q = P(0), [T, D] = E(s.current.query), A = P(T);
  A.current = T;
  const [ne, X] = E(0), ie = P(s.current.startAtEnd), [p, M] = E([]), [w, j] = E(null), oe = P(null), [Re, de] = E(null), [ar, ue] = E(0), Nt = Et(() => {
    if (!w) return null;
    const l = p.findIndex((f) => f.key === w.key);
    return l < 0 ? null : p.slice(l + 1).find((f) => f.video.id !== w.video.id) ?? null;
  }, [w, p]), [Ve, at] = E(0), [Se, At] = E(!1), [se, Tt] = E(!1), $e = P(!1), He = P(!0), et = P(null);
  B(() => (He.current = !0, () => {
    He.current = !1;
  }), []);
  const [gt, Y] = E(g.current), [mt, _e] = E(""), [ge, te] = E(null), [me, V] = E(!1), [N, Q] = E([]), L = P([]), Xe = P(null), tt = P(null), Gt = P(null);
  B(() => {
    var l, f;
    me && ((f = (l = Gt.current) == null ? void 0 : l.querySelector("input")) == null || f.focus());
  }, [me]);
  const [fe, st] = E(!1);
  B(() => {
    if (Se || fe || !tt.current) return;
    const l = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const f = tt.current;
      f != null && f.isConnected && !f.disabled && f.focus(), tt.current = null;
    });
    return () => cancelAnimationFrame(l);
  }, [Se, fe, ne]);
  const [lt, ht] = E([]), [Rt, qt] = E({}), kt = P(null), ct = P(0), Be = P(!1), [ae, It] = E({});
  B(() => {
    let l = !0;
    return Promise.all(
      Xn(T.objectFilter).map(
        async (f) => [
          String(f),
          (await G(`/api/tags/${f}`)).name
        ]
      )
    ).then((f) => {
      l && It(Object.fromEntries(f));
    }).catch(() => {
    }), () => {
      l = !1;
    };
  }, [T.objectFilter]);
  const dt = P(0), Vt = P(e);
  Vt.current = e;
  const Ee = m ?? e, Je = Et(
    () => Ze(Ee, T),
    [Ee, T]
  ), K = P(Je);
  K.current = Je;
  const yt = T.startFrom !== (e.view.startFrom ?? "end") || !rr(
    JSON.parse(Ye(Ze(e, T))),
    JSON.parse(Ye(Ze(e, Ut(e))))
  ), le = se || Se || me, rt = Number(T.filter.page);
  function De(l, f = !1) {
    $e.current || (g.current = "", ie.current = f, A.current = l, D(l), at(0), At(!0), f || tr(e.id, l), X((k) => k + 1));
  }
  function Ot() {
    if ($e.current = !1, Tt(!1), He.current && et.current) {
      const l = et.current;
      et.current = null, De(l.query, l.startAtEnd);
    }
  }
  B(() => {
    const l = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const f = Dr(
            Vt.current,
            new URLSearchParams(window.location.search)
          );
          $e.current ? et.current = f : De(f.query, f.startAtEnd);
        } catch (f) {
          Y(We(f));
        }
    };
    return window.addEventListener("popstate", l), () => window.removeEventListener("popstate", l);
  }, [e.id]), B(() => (r(se || Se || me || !!m), () => r(!1)), [se, Se, me, !!m, r]);
  async function Pt(l, f, k) {
    if (l.entityType === "performerOccurrence") {
      const $ = await ao(
        l,
        kt.current,
        f,
        k
      );
      return {
        items: $.items.map((z) => ({
          key: z.key,
          video: z.video,
          occurrence: z
        })),
        totalCount: $.totalCount
      };
    }
    const U = await er(
      l,
      { ...l.view.filter, page: f },
      k
    );
    return {
      items: U.items.map(($) => ({ key: String($.id), video: $ })),
      totalCount: U.totalCount
    };
  }
  function Bt(l, f, k, U = !1, $ = !1) {
    if (!He.current || et.current) return;
    O(!0), M(
      $ ? l.items : kr(l.items, A.current.startFrom === "end")
    ), at(l.totalCount), Ce(k, U);
    const z = {
      ...A.current,
      filter: { ...A.current.filter, page: f }
    };
    A.current = z, D(z), tr(e.id, z);
  }
  function Ce(l, f = !1) {
    (l == null ? void 0 : l.key) !== (w == null ? void 0 : w.key) && (oe.current = null), (l == null ? void 0 : l.video.id) !== (w == null ? void 0 : w.video.id) && de(f && l ? l.video.id : null), j(l);
  }
  B(() => {
    if (g.current) return;
    const l = new AbortController();
    b.current = l;
    const f = ++dt.current;
    return At(!0), Y(""), _e(""), oe.current = null, de(null), j(null), M([]), V(!1), (async () => {
      const k = Ze(Vt.current, A.current);
      kt.current = k.entityType === "performerOccurrence" ? await Wn(k, l.signal) : null;
      let U = Number(k.view.filter.page), $ = await Pt(k, U, l.signal);
      const z = Math.max(
        1,
        Math.ceil($.totalCount / Number(k.view.filter.perPage))
      );
      if ((ie.current || U > z) && (U = z, $ = await Pt(k, U, l.signal)), ie.current = !1, f !== dt.current || l.signal.aborted) return;
      const _ = kr($.items, k.view.startFrom === "end");
      Bt($, U, _[0] ?? null);
    })().catch((k) => {
      !l.signal.aborted && f === dt.current && Y(We(k));
    }).finally(() => {
      !l.signal.aborted && f === dt.current && (O(!0), At(!1));
    }), () => {
      l.abort(), dt.current++;
    };
  }, [ne, e.id]), B(() => {
    if (te(null), !w) return;
    let l = !0;
    return Zt(w).then((f) => {
      l && (te(f), ht(
        e.entityType === "performerOccurrence" ? f.ids.filter((k) => e.occurrence.tagIds.includes(k)) : []
      ));
    }).catch((f) => {
      l && Y(`Could not load current tags. ${We(f)}`);
    }), () => {
      l = !1;
    };
  }, [w]), B(() => {
    if (e.entityType !== "performerOccurrence" || e.actions.length)
      return;
    let l = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (f) => [
          f,
          (await G(`/api/tags/${f}`)).name
        ]
      )
    ).then((f) => {
      l && qt(Object.fromEntries(f));
    }).catch((f) => {
      l && Y(We(f));
    }), () => {
      l = !1;
    };
  }, [e]);
  async function Ue(l = !1, f = !1, k = !1) {
    var Qe;
    if (!w) return;
    const U = p.findIndex((H) => H.key === w.key), $ = T.startFrom === "end" ? -1 : 1, z = ((Qe = oe.current) == null ? void 0 : Qe.key) === w.key ? oe.current : { key: w.key, page: rt, before: p.slice(0, U + 1).map((H) => H.key), after: p.slice(U + 1).map((H) => H.key) }, _ = new Set(z.after), Ke = new Set(z.before), Ge = p.find((H) => {
      var Me;
      return _.has(H.key) || ($ === 1 || rt < z.page) && ((Me = oe.current) == null ? void 0 : Me.key) === w.key && !Ke.has(H.key);
    });
    if (!l && Ge) {
      Ce(Ge, k);
      return;
    }
    const Ne = l ? Ke : new Set(p.map((H) => H.key)), Pe = 1100 - (Date.now() - ct.current);
    Pe > 0 && await new Promise((H) => window.setTimeout(H, Pe));
    let ye = $ === -1 && !l ? Math.max(1, rt - 1) : rt;
    for (; He.current && !et.current; ) {
      let H = await Pt(Je, ye);
      const Me = Math.max(
        1,
        Math.ceil(H.totalCount / Number(T.filter.perPage))
      );
      ye > Me && (ye = Me, H = await Pt(Je, ye));
      const Z = kr(H.items, $ === -1), sr = new Map(Z.map((ke) => [ke.key, ke])), Qt = l ? z.after.flatMap((ke) => {
        const Wt = sr.get(ke);
        return Wt ? [Wt] : [];
      }) : [], Mt = new Set(Qt.map((ke) => ke.key)), ut = l ? {
        ...H,
        items: [
          ...Qt,
          ...Z.filter(
            (ke) => ke.key !== w.key && !Mt.has(ke.key)
          )
        ]
      } : H;
      if (f) {
        oe.current = z, Bt(ut, ye, w, !1, l);
        return;
      }
      const ft = $ === -1 && rt === 1 && !l ? void 0 : ut.items.find(
        (ke) => !Ne.has(ke.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(l && $ === -1 && ye === z.page) || _.has(ke.key))
      );
      if (ft || ($ === -1 ? ye <= 1 : ye >= Me)) {
        Bt(
          ut,
          ye,
          ft ?? null,
          k,
          l
        ), ft || _e(
          H.totalCount ? "Reached the end in this direction. Matching items remain available from the scene pages." : "No matching scenes."
        );
        return;
      }
      ye += $;
    }
  }
  async function je(l, f = !1, k = !1, U = !1) {
    if (m || !w || $e.current || Se || me && !k)
      return;
    const $ = k || U || !!(l != null && l.steps.length), z = $ && !f;
    if ($ && (!t || !ge)) return;
    $e.current = !0, Tt(!0), Y(""), _e("");
    const _ = p.findIndex((Ne) => Ne.key === w.key), Ke = $ && !f && _ >= 0 ? p[_ + 1] ?? null : null;
    Ke && (M(
      (Ne) => Ne.filter((Pe) => Pe.key !== w.key)
    ), Ce(Ke, !0));
    let Ge = !1;
    try {
      if ($) {
        const Ne = await Zt(w);
        if (l)
          await fo(Je, w, l);
        else {
          const ye = U && e.entityType === "performerOccurrence" ? e.occurrence.tagIds.filter((Me) => Ne.ids.includes(Me)) : L.current, H = lo(ye, U ? lt : N);
          await uo(Je, w, H);
        }
        ct.current = Date.now();
        const Pe = await Zt(w);
        Ke || te(Pe), Ge = !0, V(!1), _e("Tags saved.");
      }
      if (!He.current || et.current) return;
      $ ? await Ue(!0, f, z) : f || await Ue(), f && k && requestAnimationFrame(() => {
        var Ne;
        return (Ne = Xe.current) == null ? void 0 : Ne.focus();
      });
    } catch (Ne) {
      if (Y(
        Ge ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${We(Ne)}` : $ ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${We(Ne)}` : `Could not advance. ${We(Ne)}`
      ), $ && !Ge) {
        Ke && (M(p), de(null), ue((Pe) => Pe + 1), j(w)), ct.current = Date.now();
        try {
          te(await Zt(w));
        } catch {
          te(null), Y(
            (Pe) => `${Pe} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Ot();
    }
  }
  B(() => {
    const l = (f) => {
      if (me || m || se || Se || fe || f.defaultPrevented || f.repeat || f.ctrlKey || f.altKey || f.metaKey || !jn(f.target) || document.querySelector('[role="dialog"], dialog[open]'))
        return;
      const k = f.key.toLowerCase(), U = e.actions.find(
        ($, z) => pt($, z) === k
      );
      U && (f.preventDefault(), f.stopPropagation(), je(U, f.shiftKey));
    };
    return document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l);
  });
  function nt() {
    !i || m || $e.current || me || (C.current = document.activeElement, S.current = {
      error: gt,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(A.current),
      items: p,
      current: w,
      total: Ve,
      targets: kt.current,
      stayedCursor: oe.current
    }, h(structuredClone(Ze(e, A.current))), _e(""), Y(""));
  }
  B(() => {
    a && a !== q.current && I && !Se && (q.current = a, nt());
  }, [a, Se, I]);
  function he() {
    h(null), requestAnimationFrame(() => {
      var l;
      return (l = C.current) == null ? void 0 : l.focus();
    });
  }
  function qe() {
    var f;
    const l = S.current;
    !l || se || ((f = b.current) == null || f.abort(), dt.current++, A.current = l.query, D(l.query), M(l.items), j(l.current), at(l.total), kt.current = l.targets, oe.current = l.stayedCursor, At(!1), Y(l.error), _e(""), window.history.replaceState(window.history.state, "", l.url), he());
  }
  async function xe() {
    if (!m || !i || $e.current) return;
    const l = Ze(
      { ...m, name: m.name.trim() },
      A.current
    ), f = hr(l);
    if (f) {
      Y(f);
      return;
    }
    $e.current = !0, Tt(!0), Y("");
    try {
      if (await i(l) === !1) throw new Error("Could not save review.");
      he(), _e("Review saved.");
    } catch (k) {
      Y(
        "Could not save review. Your edits are still open. " + We(k)
      );
    } finally {
      Ot();
    }
  }
  async function Le() {
    if (!i || $e.current) return;
    const l = Ze(e, {
      ...A.current,
      filter: { ...A.current.filter, page: 1 }
    });
    $e.current = !0, Tt(!0), Y("");
    try {
      if (await i(l) === !1) throw new Error("Could not save review.");
      _e("Queue saved to this review.");
    } catch (f) {
      Y("Could not save queue. " + We(f));
    } finally {
      Ot();
    }
  }
  const W = T.performerScope, pe = (l) => De({
    ...A.current,
    filter: { ...A.current.filter, page: 1 },
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
          /* @__PURE__ */ u("fieldset", { disabled: se, children: [
            d == null ? void 0 : d(
              Ze(m, T),
              h,
              se
            ),
            /* @__PURE__ */ u("label", { children: [
              "Review direction",
              /* @__PURE__ */ u(
                "select",
                {
                  "aria-label": "Review direction",
                  value: T.startFrom,
                  onChange: (l) => De({
                    ...A.current,
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
                disabled: se || Se,
                onClick: () => void xe(),
                children: "Save review"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button",
                type: "button",
                disabled: se,
                onClick: qe,
                children: "Cancel"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u(
          "fieldset",
          {
            className: "dq-review-filters",
            disabled: le,
            onClickCapture: (l) => {
              var U;
              const f = l.target instanceof Element ? l.target.closest("button") : null, k = (f == null ? void 0 : f.getAttribute("aria-label")) ?? ((U = f == null ? void 0 : f.textContent) == null ? void 0 : U.trim()) ?? "";
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
                    l.key === "Escape" && (Be.current = !1), ["Delete", "Backspace"].includes(l.key) && l.target instanceof Element && ((f = l.target.closest("button")) == null ? void 0 : f.getAttribute("aria-label")) === "Edit filter: Custom Fields" && (Be.current = !0);
                  },
                  onClickCapture: (l) => {
                    var k, U;
                    const f = l.target instanceof Element ? l.target.closest("button") : null;
                    (f == null ? void 0 : f.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((k = f == null ? void 0 : f.textContent) == null ? void 0 : k.trim()) === "Clear all" ? Be.current = !0 : (/^(Cancel|Filters)/.test(((U = f == null ? void 0 : f.textContent) == null ? void 0 : U.trim()) ?? "") || /^(Close|Dismiss)/.test((f == null ? void 0 : f.getAttribute("aria-label")) ?? "")) && (Be.current = !1);
                  },
                  children: [
                    /* @__PURE__ */ n(
                      Pr,
                      {
                        filter: T.filter,
                        objectFilter: Yn(
                          T.objectFilter,
                          ae
                        ),
                        criteriaDefinitions: [
                          ...mr,
                          {
                            id: "custom-fields",
                            label: "Custom Fields",
                            filterKey: "customFieldCriteria"
                          }
                        ],
                        totalCount: Ve,
                        sortOptions: Kr,
                        showSearch: !0,
                        showSort: !0,
                        showPagingControls: !1,
                        onFilterChange: (l) => {
                          (l.sort !== A.current.filter.sort || l.direction !== A.current.filter.direction) && (l = { ...l, sorts: void 0 }), De({
                            ...A.current,
                            filter: Ie(l)
                          });
                        },
                        onObjectFilterChange: (l) => {
                          const f = ei(
                            A.current.objectFilter,
                            Zn(l),
                            Be.current
                          );
                          Be.current = !1, De({
                            ...A.current,
                            objectFilter: f,
                            filter: { ...A.current.filter, page: 1 }
                          });
                        }
                      }
                    ),
                    !m && yt && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          "aria-label": "Save changes to review filters",
                          title: "Save changes to review filters",
                          disabled: !i,
                          onClick: () => void Le(),
                          children: /* @__PURE__ */ n(Gr, { "aria-hidden": "true" })
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
                            const l = Ut(e);
                            De(l, l.startFrom === "end");
                          },
                          children: /* @__PURE__ */ n(Pn, { "aria-hidden": "true" })
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
                      onChange: (l) => pe({
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
                  ot,
                  {
                    entityType: "performer",
                    values: W.performerIds,
                    onChange: (l) => pe({ performerIds: l }),
                    placeholder: "Select performers to review...",
                    allowCreate: !1
                  }
                ),
                W.targetMode === "filter" && /* @__PURE__ */ u(Oe, { children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => st(!0),
                      children: "Edit performer criteria"
                    }
                  ),
                  /* @__PURE__ */ n("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ n(
                    Pr,
                    {
                      filter: {},
                      onFilterChange: () => {
                      },
                      totalCount: 0,
                      sortOptions: [],
                      showSearch: !1,
                      showSort: !1,
                      showPagingControls: !1,
                      criteriaDefinitions: dn,
                      objectFilter: W.performerFilter,
                      onObjectFilterChange: (l) => pe({ performerFilter: l })
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
                      onChange: (l) => pe({
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
                !["any", "isNull"].includes(W.condition) && /* @__PURE__ */ u(Oe, { children: [
                  /* @__PURE__ */ n(
                    ot,
                    {
                      entityType: "tag",
                      values: W.conditionTagIds,
                      onChange: (l) => pe({ conditionTagIds: l }),
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
                        onChange: (l) => pe({ includeSubtags: l.target.checked })
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
          Rn,
          {
            open: fe,
            onClose: () => st(!1),
            criteria: dn,
            activeFilter: W.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (l) => {
              st(!1), pe({ performerFilter: l });
            }
          }
        ),
        /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
          gt && /* @__PURE__ */ u("p", { role: "alert", children: [
            gt,
            " ",
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: se,
                onClick: () => {
                  w ? Zt(w).then(te).catch((l) => Y(We(l))) : De(A.current);
                },
                children: w ? "Reload tags" : "Retry queue"
              }
            )
          ] }),
          mt && /* @__PURE__ */ n("p", { role: "status", children: mt })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-review-layout", children: [
          /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
            /* @__PURE__ */ n("fieldset", { disabled: le, children: /* @__PURE__ */ n(
              qn,
              {
                filter: T.filter,
                totalCount: Ve,
                onFilterChange: (l) => De({ ...T, filter: Ie(l) })
              }
            ) }),
            /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: p.map((l) => {
              var f, k, U;
              return /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  title: `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${l.video.title || ((f = l.video.files[0]) == null ? void 0 : f.basename) || "Scene"}`,
                  "aria-label": `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${l.video.title || ((k = l.video.files[0]) == null ? void 0 : k.basename) || "Scene"}`,
                  disabled: le,
                  "aria-pressed": (w == null ? void 0 : w.key) === l.key,
                  onClick: () => {
                    Ce(l), Y(""), _e("");
                  },
                  children: [
                    l.occurrence && /* @__PURE__ */ n(bn, { performer: l.occurrence.performer }),
                    /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: l.video.title || ((U = l.video.files[0]) == null ? void 0 : U.basename) || "Scene" })
                  ]
                },
                l.key
              );
            }) })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-inspector", children: w ? /* @__PURE__ */ u(Oe, { children: [
            /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
              /* @__PURE__ */ n("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ n(
                "a",
                {
                  href: `/video/${w.video.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: w.video.title || ((Jt = w.video.files[0]) == null ? void 0 : Jt.basename) || `Video ${w.video.id}`
                }
              ) }),
              [w, Nt].filter(Boolean).map((l) => {
                var U, $, z;
                const f = l, k = f.key === w.key;
                return /* @__PURE__ */ n(
                  "div",
                  {
                    className: k ? "dq-review-video-current" : "dq-review-video-preload",
                    "aria-hidden": k ? void 0 : !0,
                    inert: k ? void 0 : !0,
                    children: /* @__PURE__ */ n(
                      kn,
                      {
                        videoId: f.video.id,
                        streamUrl: Jn(f.video.id),
                        posterUrl: k ? Wi(f.video) : void 0,
                        duration: ((U = f.video.files[0]) == null ? void 0 : U.duration) ?? 0,
                        format: ($ = f.video.files[0]) == null ? void 0 : $.format,
                        audioCodec: (z = f.video.files[0]) == null ? void 0 : z.audioCodec,
                        extensionSurface: k ? "quick-view" : void 0,
                        autostart: k && Re === f.video.id,
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
                  `${f.video.id}:${ar}`
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
                        disabled: le,
                        "aria-pressed": l.key === w.key,
                        onClick: () => {
                          Ce(l), Y("");
                        },
                        children: l.occurrence && /* @__PURE__ */ n(
                          bn,
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
                  ot,
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
                  ref: Gt,
                  disabled: se,
                  className: "dq-tag-editor",
                  children: [
                    /* @__PURE__ */ u("legend", { children: [
                      "Edit ",
                      W ? "occurrence" : "video",
                      " tags"
                    ] }),
                    /* @__PURE__ */ n(
                      ot,
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
                          disabled: !ge,
                          onClick: () => void je(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !ge,
                          onClick: () => void je(void 0, !1, !0),
                          children: "Save & next"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => {
                            V(!1), requestAnimationFrame(
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
              ) : /* @__PURE__ */ u(Oe, { children: [
                /* @__PURE__ */ n(
                  mo,
                  {
                    actions: Ee.actions,
                    canWrite: t,
                    disabled: se || Se || !ge || !!m,
                    onApply: (l, f) => void je(l, f)
                  }
                ),
                e.entityType === "performerOccurrence" && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                  "fieldset",
                  {
                    className: "dq-tag-choices",
                    disabled: !t || se || !ge || !!m,
                    children: [
                      /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                      e.occurrence.tagIds.map((l) => /* @__PURE__ */ u("label", { children: [
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: e.occurrence.multiple ? "checkbox" : "radio",
                            name: "legacy-choice",
                            checked: lt.includes(l),
                            onChange: (f) => ht(
                              e.occurrence.multiple ? f.target.checked ? [...lt, l] : lt.filter(
                                (k) => k !== l
                              ) : [l]
                            )
                          }
                        ),
                        Rt[l] ?? "Loading tag…"
                      ] }, l)),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          onClick: () => ht([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void je(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void je(void 0, !1, !1, !0),
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
                    disabled: le || !!m || !t || !ge,
                    onClick: () => {
                      L.current = [...ge.ids], Q([...ge.ids]), V(!0);
                    },
                    children: "Edit tags"
                  }
                ),
                /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: le || !!m,
                    onClick: () => void je(),
                    children: [
                      "Skip",
                      W ? " performer" : " video"
                    ]
                  }
                )
              ] }),
              !t && /* @__PURE__ */ n("p", { children: "Write permission is required to change tags." })
            ] })
          ] }) : /* @__PURE__ */ n("p", { role: "status", children: Se ? "Loading review…" : Ve ? "Reached the end in this direction." : "No matching scenes." }) })
        ] })
      ]
    }
  );
}
function wn({
  review: e,
  onChange: t,
  choices: r = !1
}) {
  const i = e.occurrence, a = (d) => t({ ...e, occurrence: { ...i, ...d } });
  return r ? /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ n("p", { children: "Choose the tags this review can change on the active performer’s appearance in a scene. Other tags are preserved." }),
    /* @__PURE__ */ n(
      ot,
      {
        entityType: "tag",
        values: i.tagIds,
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
          checked: i.multiple,
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
          value: i.condition,
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
    !["any", "isNull"].includes(i.condition) && /* @__PURE__ */ u(Oe, { children: [
      /* @__PURE__ */ n(
        ot,
        {
          entityType: "tag",
          values: i.conditionTagIds,
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
            checked: i.includeSubtags ?? !0,
            onChange: (d) => a({ includeSubtags: d.target.checked })
          }
        ),
        "Include subtags"
      ] })
    ] }),
    /* @__PURE__ */ n("p", { children: "Conditions check tags on the same performer’s occurrence, independently of scene tags and the performer’s profile." })
  ] });
}
function yo(e) {
  var g, m, h;
  const [t, r] = E({}), [i, a] = E(""), d = (((g = e == null ? void 0 : e.presentation) == null ? void 0 : g.annotations) ?? []).includes("tags") ? ((m = e == null ? void 0 : e.presentation) == null ? void 0 : m.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...d,
      ...((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.binParents) ?? []
    ])
  ]);
  return B(() => {
    let S = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(s).map(
        async (C) => [C, await or([C])]
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
  }, [s]), { ids: t, error: i };
}
function bo(e, t, r) {
  const i = t == null ? void 0 : t.presentation, a = (i == null ? void 0 : i.annotations) ?? [], d = (i == null ? void 0 : i.annotationParents) ?? [];
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
function wo({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
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
        disabled: i,
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
function vo(e, t) {
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
function vn({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [a, d] = E(!1), s = ve(e) === "tag" ? "tag" : "video", g = e.view.filter, m = s === "tag" ? In : Kr, h = (b) => t({
    ...e,
    view: { ...e.view, filter: { ...g, ...b } }
  }), S = s === "video" ? e.presentation ?? {} : {}, C = (b) => t({ ...e, presentation: { ...S, ...b } });
  return /* @__PURE__ */ u(Oe, { children: [
    i && /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
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
        Rn,
        {
          open: !0,
          onClose: () => d(!1),
          criteria: s === "tag" ? On : mr,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: s === "video",
          subjectLabel: s === "tag" ? "tags" : "videos",
          onApply: (b) => {
            t({ ...e, view: { ...e.view, objectFilter: b } }), d(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ u(Oe, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ u("p", { className: "dq-editor-note", children: [
        "Choose how ",
        s === "tag" ? "tags" : "videos and tags",
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ u("div", { className: "dq-field-grid", children: [
        ve(e) === "video" && /* @__PURE__ */ u("label", { children: [
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
      s === "video" && /* @__PURE__ */ u(Oe, { children: [
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
        (S.annotations ?? []).includes("tags") && /* @__PURE__ */ u(Oe, { children: [
          /* @__PURE__ */ n("h4", { children: "Card tag bins" }),
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected. This setting is separate from the queue filters." }),
          /* @__PURE__ */ n(
            ot,
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
          ot,
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
const Ir = 180, So = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function ti({ entityType: e }) {
  return e === "tag" ? /* @__PURE__ */ n(Ri, { role: "img", "aria-label": "Tag review" }) : /* @__PURE__ */ n($r, { role: "img", "aria-label": e === "performerOccurrence" ? "Performer occurrence review" : "Video review" });
}
function Sn(e) {
  return ve(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function En(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Or() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Cn(e) {
  const t = new URLSearchParams(window.location.search);
  vr.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function Eo(e) {
  return Ie({ ...e, page: 1 });
}
function ri(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function ze(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
const ni = "data-quality.workspace-layout.v1", zr = 240, Ur = 192, jr = 560;
function ii(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(jr, Math.max(Ur, e)) : zr;
}
function Co() {
  try {
    const e = JSON.parse(
      localStorage.getItem(ni) ?? "null"
    );
    return ii(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return zr;
  }
}
function No(e) {
  try {
    localStorage.setItem(
      ni,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function oi(e) {
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
function ai(e, t) {
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
function Ao(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : ai(e, t);
}
function To({
  onNavigate: e
}) {
  const [t, r] = E([]), [i] = E(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [a, d] = E(""), [s, g] = E(!0), [m, h] = E(""), [S, C] = E(!1), [b, I] = E(!1), [O, q] = E(!1), [T, D] = E([]), [A, ne] = E(""), [X, ie] = E(!0), [p, M] = E(""), [w, j] = E(""), [oe, Re] = E(!1), [de, ar] = E(!1), [ue, Nt] = E(Or), [Ve, at] = E({}), [Se, At] = E("name"), [se, Tt] = E("asc"), $e = P(null), He = P(!1), [et, gt] = E(0), [Y, mt] = E(!1), [_e, ge] = E(!1), [te, me] = E(
    null
  ), V = t.find((o) => o.id === ue) ?? null, N = Et(
    () => (te == null ? void 0 : te.id) === ue && V ? { ...V, view: {
      ...V.view,
      filter: te.view.filter,
      objectFilter: te.view.objectFilter,
      searchMode: te.view.searchMode,
      startFrom: te.view.startFrom
    } } : V,
    [te, ue, V]
  ), Q = N ? ve(N) : "video", L = Q === "video" ? N : null, [Xe, tt] = E(null), Gt = (Xe == null ? void 0 : Xe.id) === (N == null ? void 0 : N.id) ? Xe == null ? void 0 : Xe.mode : (N == null ? void 0 : N.view.reviewMode) ?? "single", fe = Q === "performerOccurrence" || Q === "video" && Gt === "single", [st, lt] = E(0), ht = P(-1), Rt = P(!1);
  B(() => {
    const o = () => {
      if (!fe && Ge.current) {
        Rt.current = !0;
        return;
      }
      Nt(Or()), fe || lt((c) => c + 1);
    };
    return window.addEventListener("popstate", o), () => window.removeEventListener("popstate", o);
  }, [fe]);
  const qt = Q === "tag" ? b : S, kt = Et(() => {
    const o = se === "asc" ? 1 : -1;
    return [...t].sort((c, y) => {
      if (Se === "count") {
        const v = Ve[c.id], x = Ve[y.id], R = typeof v == "number", F = typeof x == "number";
        if (R !== F) return R ? -1 : 1;
        if (R && F && v !== x)
          return (v - x) * o;
      }
      return c.name.localeCompare(y.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * o;
    });
  }, [se, Se, Ve, t]), ct = P(
    null
  ), Be = yo(L), [ae, It] = E({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [dt, Vt] = E({
    page: 1,
    perPage: 40
  }), [Ee, Je] = E({ items: [], totalCount: 0 }), [K, yt] = E(!1), [le, rt] = E(""), [De, Ot] = E(!1), [Pt, Bt] = E(!1), [Ce, Ue] = E(() => /* @__PURE__ */ new Set()), je = P(Ce);
  je.current = Ce;
  const nt = P(/* @__PURE__ */ new Map()), [he, qe] = E(null), xe = P(he);
  xe.current = he;
  const [Le, W] = E(!1), pe = P(Le);
  pe.current = Le;
  const Jt = P(null), [l, f] = E("grid"), [k, U] = E(Ir), [$, z] = E(Co), [_, Ke] = E(!1), Ge = P(!1), [Ne, Pe] = E(""), [ye, Qe] = E(""), [H, Me] = E(""), [Z, sr] = E(null), [Qt, Mt] = E(""), [ut, ft] = E(!1), [ke, Wt] = E({}), [Hr, Xr] = E({}), zt = P(/* @__PURE__ */ new Map()), Yr = P(null), Zr = P(null), lr = P(null), Ft = P(0), cr = P(0), dr = P(null), bt = P(!1), en = JSON.stringify([
    ...new Set(
      (L == null ? void 0 : L.actions.flatMap(
        (o) => o.steps.flatMap((c) => c.tagIds)
      )) ?? []
    )
  ]);
  function Sr(o) {
    const c = ii(o);
    z(c), No(c);
  }
  function ci(o) {
    const c = o.shiftKey ? 40 : 16;
    let y = null;
    o.key === "ArrowLeft" && (y = $ + c), o.key === "ArrowRight" && (y = $ - c), o.key === "Home" && (y = Ur), o.key === "End" && (y = jr), y !== null && (o.preventDefault(), o.stopPropagation(), Sr(y));
  }
  B(() => {
    if (!ye) return;
    const o = window.setTimeout(() => Qe(""), 4e3);
    return () => window.clearTimeout(o);
  }, [ye]), B(() => {
    const o = JSON.parse(en);
    if (Xr({}), !o.length) return;
    const c = new AbortController();
    let y = !0;
    return Promise.all(
      o.map(async (v) => {
        var x;
        try {
          const R = await G(`/api/tags/${v}`, {
            signal: c.signal
          });
          return [v, ((x = R.name) == null ? void 0 : x.trim()) || null];
        } catch {
          return [v, null];
        }
      })
    ).then((v) => {
      y && Xr(Object.fromEntries(v));
    }), () => {
      y = !1, c.abort();
    };
  }, [en]), B(() => {
    const o = L ? Xn(L.view.objectFilter) : [];
    if (Wt({}), !o.length) return;
    const c = new AbortController();
    let y = !0;
    return Promise.all(
      o.map(async (v) => {
        var x;
        try {
          const R = await G(`/api/tags/${v}`, {
            signal: c.signal
          });
          return (x = R.name) != null && x.trim() ? [String(v), R.name] : null;
        } catch {
          return null;
        }
      })
    ).then((v) => {
      y && Wt(
        Object.fromEntries(v.filter((x) => x !== null))
      );
    }), () => {
      y = !1, c.abort();
    };
  }, [L == null ? void 0 : L.id, L == null ? void 0 : L.view.objectFilter]);
  const Er = Et(
    () => L ? Yn(
      L.view.objectFilter,
      ke
    ) : (N == null ? void 0 : N.view.objectFilter) ?? {},
    [ke, N, L]
  ), di = Et(
    () => Q === "video" && Array.isArray(Er.customFieldCriteria) ? [...mr, So] : Q === "tag" ? On : mr,
    [Q, Er.customFieldCriteria]
  ), tn = St(async () => {
    g(!0), h("");
    try {
      const o = await Di();
      r(o.reviews), d(o.storageKey), C(o.canWriteVideos ?? o.canWrite), I(o.canWriteTags ?? !1), q(o.canReadTagGroups ?? !1), ie(o.canConfigure ?? !0), M(o.storageNotice ?? ""), ue && !o.reviews.some((c) => c.id === ue) && (Nt(""), Cn(""));
    } catch (o) {
      h(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      g(!1);
    }
  }, [ue]);
  B(() => {
    if (!O) {
      D([]), ne("");
      return;
    }
    const o = new AbortController();
    return ne(""), Qi(o.signal).then(D).catch((c) => {
      o.signal.aborted || ne(
        c instanceof Error ? c.message : "Could not load tag groups."
      );
    }), () => o.abort();
  }, [O]), B(() => {
    tn();
  }, []), B(() => {
    if (ue || t.length === 0) return;
    const o = new AbortController();
    at({});
    for (const c of t)
      (c.entityType === "performerOccurrence" ? Wn(c, o.signal).then((v) => (v == null ? void 0 : v.length) === 0 ? { items: [], totalCount: 0 } : er(zn(c, v), { ...c.view.filter, page: 1, perPage: 1 }, o.signal)) : ve(c) === "tag" ? mn(
        c,
        Ie({ ...c.view.filter, page: 1, perPage: 1 }),
        o.signal
      ) : er(
        c,
        Ie({ ...c.view.filter, page: 1, perPage: 1 }),
        o.signal
      )).then((v) => {
        o.signal.aborted || at((x) => ({
          ...x,
          [c.id]: v.totalCount
        }));
      }).catch(() => {
        o.signal.aborted || at((v) => ({ ...v, [c.id]: null }));
      });
    return () => o.abort();
  }, [ue, t]), Tn(() => {
    var o;
    ue || s || !He.current || (He.current = !1, (o = $e.current) == null || o.focus());
  }, [ue, s]);
  const ur = St(async () => {
    Mt("");
    try {
      sr(await Qr());
    } catch (o) {
      sr(null), Mt(
        "Tag assessment setup could not be checked. " + (o instanceof Error ? o.message : "Request failed.")
      );
    }
  }, []);
  B(() => {
    ur();
  }, [ur]);
  const wt = St(
    async (o, c, y = !1) => {
      var F;
      const v = ++Ft.current;
      (F = dr.current) == null || F.abort();
      const x = new AbortController();
      dr.current = x, c = Ie(c);
      const R = Number(c.page);
      y && (c = { ...c, page: 1 }), It(c), Bt(y), yt(!0), rt("");
      try {
        const ce = (xt) => ve(o) === "tag" ? mn(
          o,
          xt,
          x.signal
        ) : er(
          o,
          xt,
          x.signal
        );
        let J = await ce(c);
        const Ae = Math.max(
          1,
          Math.ceil(J.totalCount / Number(c.perPage))
        ), Fe = y ? Ae : Math.min(R, Ae);
        return Number(c.page) !== Fe && (c = { ...c, page: Fe }, J = await ce(c)), v === Ft.current && (Je(J), It(c), Vt(c)), J;
      } catch (ce) {
        throw v === Ft.current && rt(
          ce instanceof Error ? ce.message : "Could not load the review queue."
        ), ce;
      } finally {
        v === Ft.current && yt(!1);
      }
    },
    []
  );
  B(() => {
    var c;
    if (cr.current += 1, ht.current = -1, Ft.current += 1, (c = dr.current) == null || c.abort(), ar(!1), j(""), Re(!1), Ue(/* @__PURE__ */ new Set()), nt.current.clear(), qe(null), W(!1), Ke(!1), Ge.current = !1, Pe(""), Qe(""), Me(""), Je({ items: [], totalCount: 0 }), Ot(!1), !N || fe) {
      yt(!1);
      return;
    }
    let o = !0;
    return yt(!0), (async () => {
      let y = V ?? N;
      me(null);
      let v = null;
      const x = new URLSearchParams(window.location.search);
      if (ve(N) === "video" && vr.some((J) => x.has(J)))
        try {
          const J = y;
          v = Dr(J, x);
          const Ae = Ze(J, v.query);
          (v.query.startFrom !== (J.view.startFrom ?? "end") || !rr(
            JSON.parse(Ye(Ae)),
            JSON.parse(Ye(Ze(J, Ut(J))))
          )) && (y = Ae, me(y));
        } catch (J) {
          Ot(!0), rt(J instanceof Error ? J.message : "Could not read review URL."), yt(!1);
          return;
        }
      let R = null;
      try {
        R = await Ki(a, N.id);
      } catch (J) {
        o && (Re(!0), j(
          J instanceof Error ? J.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const F = (R == null ? void 0 : R.signature) === Ye(y) ? R : null, ce = v ? v.query.filter : F ? Ie(F.filter) : Eo(y.view.filter);
      It(ce), f(
        F ? En(F.displayMode, ve(N)) : Sn(N)
      ), U(
        F ? F.cardSize ?? Ir : Ir
      );
      try {
        const J = await wt(
          y,
          ce,
          v ? v.startAtEnd : !F && y.view.startFrom !== "beginning"
        );
        if (!o) return;
        const Ae = un(
          J.items.map((Fe) => Fe.id),
          (F == null ? void 0 : F.focusedId) ?? null,
          (F == null ? void 0 : F.index) ?? 0
        );
        qe(Ae), be(Ae);
      } catch {
      }
      o && (ht.current = st, ar(!0));
    })(), () => {
      var y;
      o = !1, cr.current++, Ft.current++, (y = dr.current) == null || y.abort();
    };
  }, [N == null ? void 0 : N.id, fe, st]), B(() => {
    !L || fe || !de || K || le || _ || Rt.current || ht.current !== st || tr(L.id, {
      filter: ae,
      objectFilter: L.view.objectFilter,
      searchMode: L.view.searchMode,
      startFrom: L.view.startFrom ?? "end"
    });
  }, [L, fe, de, K, le, ae, _, st]);
  const re = Et(
    () => Ee.items.map((o) => o.id),
    [Ee.items]
  );
  B(() => {
    if (!de || !N || !a || K || le || _ || (te == null ? void 0 : te.id) === N.id || oe)
      return;
    const o = {
      version: 1,
      signature: Ye(N),
      filter: ae,
      focusedId: he,
      index: Math.max(0, re.indexOf(he ?? -1)),
      displayMode: l,
      cardSize: k,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        a + ":progress:" + N.id,
        JSON.stringify(o)
      );
    } catch {
    }
    if (w) return;
    let c = !0;
    const y = window.setTimeout(() => {
      Gi(a, N.id, o).catch((v) => {
        c && j(
          "Progress is kept in this browser, but account sync failed. " + (v instanceof Error ? v.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      c = !1, window.clearTimeout(y);
    };
  }, [
    de,
    a,
    N,
    K,
    le,
    _,
    ae,
    he,
    re,
    l,
    k,
    te,
    w,
    oe
  ]);
  const ui = Ee.items.find((o) => o.id === he) ?? null, Cr = Q === "video" ? ui : null;
  Le && Cr && (Jt.current = Cr);
  const vt = Cr ?? (Le ? Jt.current : null), fi = fn(Ce, he), rn = Ce.size > 0 ? `${Ce.size} selected ${Q}${Ce.size === 1 ? "" : "s"}` : he == null ? `no ${Q}` : `focused ${Q}`, be = St((o, c = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const y = zt.current.get(o);
      y == null || y.focus({ preventScroll: !0 }), c && (y == null || y.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  B(() => {
    de && !pe.current && be(xe.current);
  }, [de, be]), B(() => {
    K || !re.length || (xe.current == null || !re.includes(xe.current)) && (qe(re[0]), pe.current || be(re[0]));
  }, [be, re, K]);
  const $t = St(
    (o) => {
      Ue((c) => {
        const y = o(c);
        for (const v of /* @__PURE__ */ new Set([...c, ...y]))
          c.has(v) !== y.has(v) && nt.current.set(
            v,
            (nt.current.get(v) ?? 0) + 1
          );
        return y;
      });
    },
    []
  ), Nr = St(
    (o) => {
      if (!re.length) return;
      const c = Math.max(
        0,
        re.indexOf(xe.current ?? re[0])
      ), y = re[Math.max(0, Math.min(re.length - 1, c + o))];
      qe(y), pe.current || be(y);
    },
    [be, re]
  ), Ar = St(
    async (o) => {
      const c = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", y = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, v = y != null && (!O || !T.some((ee) => ee.id === y)), x = "effect" in o && c && !O, R = fn(
        je.current,
        xe.current
      );
      if (!N || Ge.current || K || le || c && !qt || x || v || yr(o) && (Z == null ? void 0 : Z.kind) !== "ready" || !R.length)
        return;
      const F = ++cr.current, ce = N.id, J = [...re], Ae = Ee, Fe = xe.current, xt = new Set(je.current), Xt = new Map(
        R.map((ee) => [ee, nt.current.get(ee) ?? 0])
      ), Lt = () => F === cr.current && N.id === ce;
      Ge.current = !0, Ke(!0), Pe(
        je.current.size ? `${R.length} selected ${Q}s` : `the focused ${Q}`
      ), Qe(""), Me("");
      const an = Ae.items.filter(
        (ee) => !R.includes(ee.id)
      ), Si = an.map((ee) => ee.id), sn = pn(
        J,
        Si,
        Fe,
        R.includes(Fe ?? -1)
      );
      Je({
        items: an,
        totalCount: Ae.totalCount
      }), Ue((ee) => {
        const we = new Set(ee);
        for (const Te of R) we.delete(Te);
        return we;
      }), qe(sn), pe.current || be(sn);
      let Rr = !1;
      try {
        if ("effect" in o ? await no(o, R) : await Qn(o, R), Rr = !0, !Lt()) return;
        Ue((ee) => {
          const we = new Set(ee);
          for (const Te of R)
            (nt.current.get(Te) ?? 0) === Xt.get(Te) && we.delete(Te);
          return we;
        }), Qe(
          `${o.label}: ${R.length} ${Q}${R.length === 1 ? "" : "s"} ${c ? "updated" : "skipped"}.`
        );
      } catch (ee) {
        if (!Lt()) return;
        Je(Ae), Ue((we) => {
          const Te = new Set(we);
          for (const it of R)
            xt.has(it) && (nt.current.get(it) ?? 0) === Xt.get(it) && Te.add(it);
          return Te;
        }), qe(Fe), pe.current || be(Fe), Me(
          ee instanceof Error ? ee.message : "Action failed."
        );
      }
      try {
        if (await Xi(o), !Lt()) return;
        const ee = await wt(N, ae);
        if (!Lt()) return;
        let we = ee.items.map((Te) => Te.id);
        if (!we.length && ee.totalCount > 0 && Number(ae.page) > 1) {
          const Te = Math.max(1, Number(ae.page) - 1), it = { ...ae, page: Te };
          It(it), we = (await wt(N, it)).items.map((qr) => qr.id), Ue(
            (qr) => new Set([...qr].filter((Ei) => we.includes(Ei)))
          );
          const cn = we.at(-1) ?? null;
          qe(cn), pe.current || be(cn);
        } else {
          Ue(
            (it) => new Set([...it].filter((ln) => we.includes(ln)))
          );
          const Te = pn(
            J,
            we,
            Fe,
            Rr && R.includes(Fe ?? -1)
          );
          qe(Te), pe.current && Te == null && W(!1), pe.current || be(Te);
        }
      } catch (ee) {
        Lt() && Me(
          (we) => `${we ? `${we} ` : ""}${Rr ? "The action completed, but " : ""}the queue could not be refreshed. ${ee instanceof Error ? ee.message : "Refresh failed."}`
        );
      } finally {
        Lt() && (Ge.current = !1, Ke(!1), Pe(""), Rt.current && (Rt.current = !1, Nt(Or()), lt((ee) => ee + 1)));
      }
    },
    [
      qt,
      O,
      T,
      Q,
      Z,
      wt,
      ae,
      be,
      re,
      Ee,
      K,
      le,
      N
    ]
  );
  function pi() {
    var y;
    if (l === "list") return 1;
    const o = (y = Yr.current) == null ? void 0 : y.firstElementChild, c = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, c.split(" ").filter(Boolean).length);
  }
  function gi(o) {
    if (fe || o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || Y) return;
    if (Le && o.key === "Escape") {
      ze(o), W(!1), be(xe.current);
      return;
    }
    if (!jn(o.target)) return;
    if (o.key === "Escape") {
      ze(o), $t(() => /* @__PURE__ */ new Set());
      return;
    }
    const c = (N == null ? void 0 : N.actions.findIndex(
      (y, v) => pt(y, v) === o.key.toLowerCase()
    )) ?? -1;
    if (c >= 0 && (N != null && N.actions[c])) {
      ze(o), !_ && !K && Ar(N.actions[c]);
      return;
    }
    if (!Le && o.key === " ") {
      ze(o), he != null && $t((y) => gr(y, he));
      return;
    }
    if (!Le && o.key.toLowerCase() === "a") {
      ze(o), $t(
        (y) => Mi(y, re)
      );
      return;
    }
    if (!(_ || K) && !Le && o.key === "Enter" && he != null) {
      ze(o), Q === "tag" ? window.open(`/tag/${he}`, "_blank", "noopener,noreferrer") : W(!0);
      return;
    }
  }
  const nn = P(
    () => {
    }
  );
  nn.current = (o) => {
    var R;
    if (fe || Y || Le || _ || K || !re.length || o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey)
      return;
    const c = o.target, y = c instanceof Node && ((R = Zr.current) == null ? void 0 : R.contains(c)) === !0, v = c === document.body || c === document.documentElement;
    if (!y && !v || !o.key.startsWith("Arrow") || !Fi(c)) return;
    const x = $i(o.key, pi());
    x && (o.preventDefault(), y ? o.stopImmediatePropagation() : o.stopPropagation(), Nr(x));
  }, B(() => {
    const o = (c) => nn.current(c);
    return document.addEventListener("keydown", o), () => document.removeEventListener("keydown", o);
  }, []);
  function Ht(o) {
    tt(null), gt(0), Nt(o), Cn(o);
  }
  function mi() {
    He.current = !0, at({}), Ht("");
  }
  async function Tr(o) {
    if (!a) return !1;
    const c = o.map(qo);
    try {
      await ji(a, c);
    } catch (v) {
      throw v;
    }
    r(c), ue && !c.some((v) => v.id === ue) && Ht("");
    const y = c.find((v) => v.id === ue);
    return y && tt(null), y && V && JSON.stringify(y) !== JSON.stringify(V) && (y.view.displayMode !== V.view.displayMode && f(Sn(y)), Ye(y) !== Ye(V) && (me(null), ve(y) === "video" && tr(y.id, {
      filter: Ie(y.view.filter),
      objectFilter: y.view.objectFilter,
      searchMode: y.view.searchMode,
      startFrom: y.view.startFrom ?? "end"
    }), fe || fr(
      y,
      Ie({ ...y.view.filter, page: ae.page })
    ))), !0;
  }
  if (s)
    return /* @__PURE__ */ n(Nn, { label: "Loading reviews…" });
  if (m)
    return /* @__PURE__ */ u(Oe, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Lo().catch(
            (o) => h(
              "Could not export browser reviews. " + (o instanceof Error ? o.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        An,
        {
          message: m,
          onRetry: () => void tn()
        }
      )
    ] });
  return /* @__PURE__ */ u("div", { ref: Zr, className: "data-quality-page", onKeyDown: gi, children: [
    /* @__PURE__ */ u("header", { className: "data-quality-header", children: [
      N && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: _,
          onClick: mi,
          children: /* @__PURE__ */ n(Mn, {})
        }
      ),
      /* @__PURE__ */ u("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (N == null ? void 0 : N.name) ?? "Data Quality" }),
        (N == null ? void 0 : N.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: N.description })
      ] }),
      N && V && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: _ || K || !X,
          onClick: () => {
            fe ? gt((o) => o + 1) : (ge(!0), mt(!0));
          },
          children: /* @__PURE__ */ n(Fn, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: _ || K || !X,
          onClick: () => {
            ge(!1), mt(!0);
          },
          children: /* @__PURE__ */ n(Ti, {})
        }
      )
    ] }),
    p && /* @__PURE__ */ n("p", { className: "dq-status", children: p }),
    L && (Z == null ? void 0 : Z.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      Z.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: ut,
          onClick: () => {
            ft(!0), Mt(""), Zi().then(ur).catch(
              (o) => Mt(
                "Could not create the Confirmed absent tags custom field. " + (o instanceof Error ? o.message : "Request failed.")
              )
            ).finally(() => ft(!1));
          },
          children: ut ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    L && ((Z == null ? void 0 : Z.kind) === "incompatible" || Qt) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(Fr, {}),
      Qt || (Z == null ? void 0 : Z.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: ut,
          onClick: () => {
            ft(!0), ur().finally(
              () => ft(!1)
            );
          },
          children: ut ? "Checking…" : "Check again"
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
            const o = localStorage.getItem("page-videos") ?? "[]", c = URL.createObjectURL(
              new Blob([o], { type: "application/json" })
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
            j(""), Re(!1);
          },
          children: oe ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    L && /* @__PURE__ */ u("label", { className: "dq-layout-control", children: [
      "Review layout",
      /* @__PURE__ */ u(
        "select",
        {
          "aria-label": "Review layout",
          value: Gt,
          disabled: _ || K || Y,
          onChange: (o) => tt({ id: L.id, mode: o.target.value }),
          children: [
            /* @__PURE__ */ n("option", { value: "single", children: "Single video" }),
            /* @__PURE__ */ n("option", { value: "multiple", children: "Multiple videos" })
          ]
        }
      )
    ] }),
    N && V && !fe && /* @__PURE__ */ u("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${_ || K ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": _ || K || void 0,
          inert: _ || K ? !0 : void 0,
          onClickCapture: (o) => {
            var y, v, x, R, F;
            const c = o.target instanceof Element ? o.target.closest("button") : null;
            (c == null ? void 0 : c.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((y = c == null ? void 0 : c.textContent) == null ? void 0 : y.trim()) === "Clear all" ? bt.current = !0 : ((v = c == null ? void 0 : c.getAttribute("aria-label")) != null && v.startsWith("Filters") || (x = c == null ? void 0 : c.getAttribute("aria-label")) != null && x.startsWith("Edit filter:") || ((R = c == null ? void 0 : c.textContent) == null ? void 0 : R.trim()) === "Cancel" || (F = c == null ? void 0 : c.getAttribute("aria-label")) != null && F.startsWith("Close ")) && (bt.current = !1);
          },
          onKeyDownCapture: (o) => {
            var y, v;
            const c = o.target instanceof Element ? o.target.closest("button") : null;
            (o.key === "Delete" || o.key === "Backspace") && (c == null ? void 0 : c.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (o.preventDefault(), o.stopPropagation(), bt.current = !0, (v = (y = c.parentElement) == null ? void 0 : y.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || v.click()) : o.key === "Escape" && (bt.current = !1);
          },
          children: /* @__PURE__ */ n(
            Pr,
            {
              filter: le ? dt : ae,
              onFilterChange: hi,
              totalCount: Ee.totalCount,
              sortOptions: Q === "tag" ? In : Kr,
              showSearch: !0,
              showSort: !0,
              displayMode: l,
              onDisplayModeChange: (o) => f(En(o, Q)),
              availableDisplayModes: Q === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (k - 225) / 50,
              onZoomChange: (o) => U(Math.round(225 + o * 50)),
              cardSizeEntityType: Q === "tag" ? "tags" : "videos",
              criteriaDefinitions: di,
              objectFilter: Er,
              onObjectFilterChange: (o) => {
                if (!_ && !K) {
                  const c = Q === "video" ? Zn(o) : o;
                  ct.current = Q === "video" ? ei(
                    N.view.objectFilter,
                    c,
                    bt.current
                  ) : c, bt.current = !1;
                }
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (te == null ? void 0 : te.id) === ue && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: _ || K || !X,
            onClick: bi,
            children: /* @__PURE__ */ n(Gr, {})
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
            onClick: yi,
            children: /* @__PURE__ */ n(Pn, {})
          }
        )
      ] })
    ] }),
    N ? fe ? /* @__PURE__ */ n(ho, { review: N, canWrite: N.entityType === "performerOccurrence" ? b : S, onBusy: Ke, editRequest: et, renderRuleEditor: (o, c, y) => /* @__PURE__ */ n(si, { workspace: !0, draft: o, entityTypeLocked: !0, tagGroups: T, saving: y, setDraft: (v) => c(v), onSave: () => {
    }, onCancel: () => {
    } }), onSaveDefaults: X ? (o) => Tr(t.map((c) => c.id === o.id ? o : c)) : void 0 }, N.id) : /* @__PURE__ */ u(Oe, { children: [
      L && Be.error && /* @__PURE__ */ n("p", { role: "alert", children: Be.error }),
      L && /* @__PURE__ */ n(
        wo,
        {
          videos: Ee.items,
          review: L,
          trees: Be.ids,
          disabled: _ || K,
          onChoose: (o) => {
            const c = vo(L, o);
            me(c), fr(c, { ...ae, page: 1 });
          }
        }
      ),
      H && !Le && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(Fr, {}),
        H
      ] }),
      ye && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: ye }),
      on("top"),
      /* @__PURE__ */ u(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${$}px`
          },
          children: [
            /* @__PURE__ */ u("main", { children: [
              K && !Ee.items.length && /* @__PURE__ */ n(Nn, { label: "Loading review queue…" }),
              le && !K && /* @__PURE__ */ n(
                An,
                {
                  message: le,
                  retryLabel: De ? "Reset to review defaults" : "Retry",
                  onRetry: () => {
                    if (De && V && ve(V) === "video") {
                      const o = Ut(V);
                      tr(V.id, { ...o, filter: { ...o.filter, page: void 0 } }), lt((c) => c + 1);
                      return;
                    }
                    wt(
                      N,
                      ae,
                      Pt
                    ).catch(() => {
                    });
                  }
                }
              ),
              !_ && !K && !le && !Ee.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n($r, {}),
                /* @__PURE__ */ u("p", { children: [
                  "No ",
                  Q,
                  "s match this review."
                ] })
              ] }),
              !!Ee.items.length && /* @__PURE__ */ n("div", { ref: Yr, children: /* @__PURE__ */ n(
                "div",
                {
                  className: l === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${k}px`
                  },
                  children: Ee.items.map(vi)
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
                "aria-valuemin": Ur,
                "aria-valuemax": jr,
                "aria-valuenow": $,
                "aria-valuetext": `${$} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (o) => {
                  lr.current = {
                    pointerId: o.pointerId,
                    startX: o.clientX,
                    startWidth: $
                  }, o.currentTarget.setPointerCapture(o.pointerId);
                },
                onPointerMove: (o) => {
                  const c = lr.current;
                  (c == null ? void 0 : c.pointerId) === o.pointerId && o.currentTarget.hasPointerCapture(o.pointerId) && Sr(
                    c.startWidth + c.startX - o.clientX
                  );
                },
                onPointerUp: () => {
                  lr.current = null;
                },
                onPointerCancel: () => {
                  lr.current = null;
                },
                onKeyDown: ci,
                onDoubleClick: () => Sr(zr),
                children: /* @__PURE__ */ n("span", {})
              }
            ),
            /* @__PURE__ */ u("aside", { className: "dq-actions", children: [
              Ce.size > 0 && /* @__PURE__ */ n("strong", { children: rn }),
              N.actions.map((o, c) => {
                const y = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", v = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, x = v != null ? T.find((F) => F.id === v) : void 0, R = v != null && !x;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    disabled: _ || K || !!le || y && !qt || "effect" in o && y && (!O || R) || yr(o) && (Z == null ? void 0 : Z.kind) !== "ready" || !fi.length,
                    onClick: () => void Ar(o),
                    children: [
                      /* @__PURE__ */ u("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: o.label }),
                        "effect" in o ? /* @__PURE__ */ n("small", { children: o.effect.mode === "SKIP" ? "Skip" : o.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : x ? `Assign ${x.name}` : "Unavailable tag group" }) : o.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: o.steps.flatMap(
                          (F, ce) => F.tagIds.map((J, Ae) => {
                            const Fe = Hr[J] === void 0 ? "Tag" : Hr[J] ?? "Unavailable tag", xt = ai(F, Fe), Xt = Ao(F, Fe);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": oi(F.mode),
                                "aria-label": Xt,
                                title: `Step ${ce + 1}: ${Xt}`,
                                children: xt
                              },
                              `${ce}-${J}-${Ae}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      pt(o, c) && /* @__PURE__ */ n("kbd", { children: pt(o, c) })
                    ]
                  },
                  o.id
                );
              }),
              !N.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              !qt && /* @__PURE__ */ u("p", { children: [
                Q === "tag" ? "Tag" : "Video",
                " write permission is required to apply actions."
              ] }),
              Q === "tag" && A && /* @__PURE__ */ u("p", { children: [
                "Tag groups are unavailable. ",
                A
              ] }),
              _ && /* @__PURE__ */ u("p", { role: "status", children: [
                /* @__PURE__ */ n(xn, { className: "dq-spin" }),
                " Applying action to",
                " ",
                Ne,
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
      on("bottom")
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
                  ref: $e,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ n("p", { children: "Choose a review to open its queue." }),
              /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                (o) => Ve[o.id] !== void 0
              ) ? t.some((o) => Ve[o.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: Se,
                    onChange: (o) => At(
                      o.target.value
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
                  "aria-label": se === "asc" ? "Ascending" : "Descending",
                  title: se === "asc" ? "Ascending" : "Descending",
                  onClick: () => Tt(
                    (o) => o === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    $n,
                    {
                      className: se === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: kt.map((o) => {
            const c = Ve[o.id], y = ve(o), v = y === "tag" ? "tag" : y === "performerOccurrence" ? "scene" : "video";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                disabled: _,
                onClick: () => Ht(o.id),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ u("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(ti, { entityType: y }),
                      /* @__PURE__ */ n("strong", { children: o.name })
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
                  o.description && /* @__PURE__ */ n("span", { className: "dq-review-rule-name", children: o.description })
                ]
              },
              o.id
            );
          }) })
        ]
      }
    ) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n($r, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    Le && vt && L && /* @__PURE__ */ n(
      Po,
      {
        video: vt,
        review: L,
        targetLabel: rn,
        pending: _,
        refreshing: K || !!le,
        error: H,
        canWrite: S,
        assessmentReady: (Z == null ? void 0 : Z.kind) === "ready",
        selected: Ce.has(vt.id),
        hasPrevious: re.indexOf(vt.id) > 0,
        hasNext: re.indexOf(vt.id) >= 0 && re.indexOf(vt.id) < re.length - 1,
        onToggleSelected: () => $t((o) => gr(o, vt.id)),
        onPrevious: () => Nr(-1),
        onNext: () => Nr(1),
        onClose: () => {
          W(!1), be(xe.current);
        },
        onAction: Ar
      }
    ),
    Y && /* @__PURE__ */ n(
      Mo,
      {
        reviews: t,
        activeReview: V,
        tagGroups: T,
        initialEdit: _e,
        onSave: Tr,
        onChoose: Ht,
        onEditWorkspace: (o) => {
          o !== ue && Ht(o), tt({ id: o, mode: "single" }), gt((c) => c + 1), mt(!1);
        },
        onClose: () => {
          mt(!1), _e && be(xe.current, !1);
        }
      }
    )
  ] });
  async function fr(o, c, y = !1) {
    const v = xe.current, x = Math.max(0, re.indexOf(v ?? -1));
    try {
      const F = (await wt(o, c, y)).items.map((J) => J.id);
      Ue(
        (J) => new Set([...J].filter((Ae) => F.includes(Ae)))
      );
      const ce = un(F, v, x);
      qe(ce), pe.current || be(ce, !1);
    } catch {
    }
  }
  function hi(o) {
    const c = ct.current;
    if (ct.current = null, _ || K || !N || !V) return;
    const y = c ?? N.view.objectFilter, v = rr(
      y,
      V.view.objectFilter
    ) ? V.view.objectFilter : y, x = Ie({ ...o, page: 1 }), R = {
      ...N,
      view: {
        ...N.view,
        filter: x,
        objectFilter: v
      }
    }, F = Ye(R) !== Ye(V), ce = F ? R : V;
    me(F ? R : null), Qe(F ? "" : "Review queue defaults restored."), fr(ce, x, !0);
  }
  function yi() {
    if (_ || K || !V) return;
    ct.current = null;
    const o = Ie({
      ...V.view.filter,
      page: 1
    });
    me(null), Qe("Review queue defaults restored."), fr(
      V,
      o,
      V.view.startFrom !== "beginning"
    );
  }
  function bi() {
    _ || K || !N || !V || !X || Tr(
      t.map(
        (o) => o.id === ue ? {
          ...o,
          view: {
            ...N.view,
            filter: { ...ae, page: 1 }
          }
        } : o
      )
    ).then(() => {
      me(null), Qe("Queue saved to this review.");
    }).catch(
      (o) => Me(
        o instanceof Error ? o.message : "Could not save queue."
      )
    );
  }
  function wi() {
    Ue(/* @__PURE__ */ new Set()), nt.current.clear(), qe(null);
  }
  function on(o) {
    return N ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: _ || K,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          qn,
          {
            filter: {
              ...ae,
              page: Number(ae.page) || 1,
              perPage: Number(ae.perPage) || 40
            },
            totalCount: Ee.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${o}`,
            onFilterChange: (c) => {
              _ || K || c.page === Number(ae.page) || Ro(
                { ...ae, page: c.page },
                N,
                wt,
                wi
              );
            }
          }
        )
      }
    ) : null;
  }
  function vi(o) {
    var y, v, x;
    if (Q === "tag") {
      const R = o;
      return /* @__PURE__ */ n(
        ko,
        {
          tag: R,
          displayMode: l === "list" ? "list" : "grid",
          focused: R.id === he,
          selected: Ce.has(R.id),
          setRef: (F) => {
            F ? zt.current.set(R.id, F) : zt.current.delete(R.id);
          },
          onFocus: () => qe(R.id),
          onToggle: () => {
            $t((F) => gr(F, R.id)), be(R.id, !1);
          },
          onOpen: () => window.open(`/tag/${R.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        R.id
      );
    }
    const c = o;
    return /* @__PURE__ */ n(
      Io,
      {
        video: bo(c, L, Be.ids),
        showTagBins: ((v = (y = L == null ? void 0 : L.presentation) == null ? void 0 : y.annotations) == null ? void 0 : v.includes("tags")) && !!((x = L.presentation.annotationParents) != null && x.length),
        displayMode: l,
        focused: c.id === he,
        selected: Ce.has(c.id),
        setRef: (R) => {
          R ? zt.current.set(c.id, R) : zt.current.delete(c.id);
        },
        onFocus: () => qe(c.id),
        onToggle: () => $t((R) => gr(R, c.id)),
        onPreview: () => {
          qe(c.id), W(!0);
        },
        onNavigate: e
      },
      c.id
    );
  }
}
function Ro(e, t, r, i) {
  i(), r(t, e).catch(() => {
  });
}
function gr(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function qo(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function ko({
  tag: e,
  displayMode: t,
  focused: r,
  selected: i,
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
      "aria-label": `${e.name}${i ? ", selected" : ""}`,
      onFocus: d,
      onClick: (h) => {
        d(), h.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        Ni,
        {
          tag: e,
          selected: i,
          onSelect: s,
          onClick: g,
          onNavigate: m
        }
      ) : /* @__PURE__ */ u("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "aria-label": i ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": i,
            onClick: (h) => {
              h.stopPropagation(), s();
            },
            children: i ? "✓" : ""
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
function Io({
  video: e,
  showTagBins: t,
  displayMode: r,
  focused: i,
  selected: a,
  setRef: d,
  onFocus: s,
  onToggle: g,
  onPreview: m,
  onNavigate: h
}) {
  var q, T;
  const S = ri(e), C = P(null), b = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, I = !!(b.date || b.studioName), O = !!(b.performers.length || b.tags.length);
  return Tn(() => {
    const D = C.current;
    if (!D) return;
    const A = D.querySelector(
      `a[href="/video/${e.id}"]`
    ), ne = D.querySelector(".card-title"), X = `dq-card-title-${e.id}`;
    ne && (ne.id = X), A && (A.target = "_blank", A.rel = "noreferrer", A.removeAttribute("aria-label"), A.setAttribute("aria-labelledby", X), A.classList.add("dq-card-link"));
    const ie = D.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    ie && ie.setAttribute(
      "aria-label",
      a ? `Deselect ${S}` : `Select ${S}`
    );
    const p = D.querySelector(
      'button[title="Quick View"]'
    );
    p && p.setAttribute("aria-label", `Preview ${S}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (D) => {
        C.current = D, d(D);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${S}${a ? ", selected" : ""}`,
      onFocus: s,
      onClick: (D) => {
        s(), D.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${r} ${I ? "has-card-metadata" : "no-card-metadata"} ${O ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${a ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          Ai,
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
          (q = e.tags) == null ? void 0 : q.map((D) => /* @__PURE__ */ n("span", { children: D.name }, D.id)),
          !((T = e.tags) != null && T.length) && /* @__PURE__ */ n("small", { children: "No matching tags" })
        ] }),
        r === "wall" && /* @__PURE__ */ n(Oo, { video: e })
      ]
    }
  );
}
function Oo({ video: e }) {
  const t = P(null), r = P(null), [i, a] = E(!1), [d, s] = E(!1), [g, m] = E(!1);
  return B(() => {
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
  }, [e.id, e.files.length]), B(() => {
    if (!i) {
      m(!1);
      return;
    }
    const h = new AbortController();
    return G(Hi(e.id), {
      signal: h.signal
    }).then((S) => {
      h.signal.aborted || m(S.available === !0);
    }).catch(() => {
      h.signal.aborted || m(!1);
    }), () => h.abort();
  }, [i, e.id]), B(() => {
    const h = r.current;
    h && (d ? Promise.resolve(h.play()).catch(() => {
    }) : h.pause());
  }, [g, d]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: g && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: zi(e.id),
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
  pending: i,
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
  const T = P(null), D = P(null), A = e.files[0], ne = ri(e);
  B(() => {
    var M;
    const p = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (M = T.current) == null || M.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = p;
    };
  }, []);
  function X(p) {
    var j, oe, Re;
    if (p.key !== "Tab") return;
    const M = [
      ...((j = T.current) == null ? void 0 : j.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((de) => de.offsetParent !== null);
    if (!M.length) {
      p.preventDefault(), (oe = T.current) == null || oe.focus();
      return;
    }
    const w = M.indexOf(
      document.activeElement
    );
    p.shiftKey && w <= 0 ? (p.preventDefault(), (Re = M.at(-1)) == null || Re.focus()) : !p.shiftKey && w === M.length - 1 && (p.preventDefault(), M[0].focus());
  }
  function ie(p) {
    if (p.defaultPrevented || p.ctrlKey || p.metaKey || p.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const M = p.key === "ArrowLeft" || p.key === "ArrowRight";
    if (p.altKey && !M) return;
    const w = D.current, j = p.currentTarget.querySelector("video");
    if (p.key === "Enter" || p.key === "Escape")
      p.repeat || O();
    else if (p.key === " " && w)
      p.repeat || w.toggle();
    else if (M && w)
      w.seekBy(
        (p.key === "ArrowLeft" ? -1 : 1) * (p.shiftKey ? 5 : p.altKey ? 10 : 60)
      );
    else if ((p.key === "," || p.key === ".") && w) {
      const oe = [A == null ? void 0 : A.duration, j == null ? void 0 : j.duration].find(
        (de) => de != null && Number.isFinite(de) && de > 0
      ) ?? 0, Re = e.parentVideoId != null ? (e.clipEndSec ?? oe) - (e.clipStartSec ?? 0) : oe;
      Number.isFinite(Re) && Re > 0 && w.seekBy((p.key === "," ? -1 : 1) * Re * 0.1);
    } else if (p.key.toLowerCase() === "n" || p.key.toLowerCase() === "m")
      !p.repeat && !i && !a && (p.key.toLowerCase() === "n" && h && b(), p.key.toLowerCase() === "m" && S && I());
    else if (p.key === "ArrowUp" && j)
      j.volume = Math.min(1, j.volume + 0.1);
    else if (p.key === "ArrowDown" && j)
      j.volume = Math.max(0, j.volume - 0.1);
    else return;
    ze(p);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: T,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${ne}`,
      className: "dq-preview",
      onKeyDown: X,
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
              disabled: !h || i || a,
              onClick: b,
              children: /* @__PURE__ */ n(Mn, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !S || i || a,
              onClick: I,
              children: /* @__PURE__ */ n($n, {})
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
              children: /* @__PURE__ */ n(qi, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: O,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(Ln, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: A ? /* @__PURE__ */ n(
          kn,
          {
            autostart: !0,
            streamUrl: Jn(e.id),
            posterUrl: hn(e),
            format: A.format,
            audioCodec: A.audioCodec,
            duration: A.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (p) => (D.current = p, () => {
              D.current === p && (D.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: hn(e), alt: "" }) }),
        d && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: d }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((p, M) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: i || a || p.steps.length > 0 && !s || yr(p) && !g,
            onClick: () => void q(p),
            children: [
              pt(p, M) && /* @__PURE__ */ n("kbd", { children: pt(p, M) }),
              p.label
            ]
          },
          p.id
        )) })
      ] })
    }
  );
}
function Mo({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: i = !1,
  onEditWorkspace: a,
  onSave: d,
  onChoose: s,
  onClose: g
}) {
  const [m, h] = E(
    () => i && t ? structuredClone(t) : null
  ), [S, C] = E(""), [b, I] = E(!1), [O, q] = E(
    i && t != null
  ), T = P(null);
  B(() => {
    var w, j;
    const p = document.activeElement, M = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (j = (w = T.current) == null ? void 0 : w.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || j.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = M, p == null || p.focus({ preventScroll: !0 });
    };
  }, []);
  function D(p) {
    var j, oe, Re;
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
      ...((j = T.current) == null ? void 0 : j.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((de) => de.offsetParent !== null);
    if (!M.length) {
      ze(p), (oe = T.current) == null || oe.focus();
      return;
    }
    const w = M.indexOf(
      document.activeElement
    );
    p.shiftKey && w <= 0 ? (ze(p), (Re = M.at(-1)) == null || Re.focus()) : !p.shiftKey && w === M.length - 1 ? (ze(p), M[0].focus()) : p.stopPropagation();
  }
  function A(p, M = !!p) {
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
    if (!m || hr(m)) {
      C(m ? hr(m) : "Choose a review.");
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
  async function X(p) {
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
        const j = nr(await M.text());
        if (!await d(xr(e, j)))
          throw new Error("Could not save reviews.");
      } catch (j) {
        C(
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
      ref: T,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: D,
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
              children: /* @__PURE__ */ n(Ln, {})
            }
          )
        ] }),
        S && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: S }),
        /* @__PURE__ */ n("fieldset", { disabled: b, className: "dq-manager-content", children: m ? /* @__PURE__ */ n(
          si,
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
        ) : /* @__PURE__ */ u(Oe, { children: [
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
                onClick: () => A(),
                children: [
                  /* @__PURE__ */ n(ki, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ u("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(Ii, {}),
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
                /* @__PURE__ */ n(ti, { entityType: ve(p) }),
                /* @__PURE__ */ n("strong", { children: p.name })
              ] }),
              /* @__PURE__ */ n("p", { children: p.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => p.entityType === "tag" || ve(p) === "video" && p.view.reviewMode === "multiple" ? A(p) : a(p.id), children: [
              /* @__PURE__ */ n(Fn, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => A({
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
                  window.confirm(`Delete review “${p.name}”?`) && X(
                    e.filter((M) => M.id !== p.id)
                  );
                },
                children: /* @__PURE__ */ n(_n, {})
              }
            )
          ] }, p.id)) })
        ] }) })
      ] })
    }
  );
}
function si({
  workspace: e = !1,
  setup: t = !1,
  draft: r,
  entityTypeLocked: i,
  tagGroups: a,
  saving: d = !1,
  setDraft: s,
  onSave: g,
  onCancel: m
}) {
  const [h, S] = E("Review"), C = ve(r), b = (q) => {
    if (!(i || q === C)) {
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
    let T = I.current.get(q);
    return T || (T = crypto.randomUUID(), I.current.set(q, T)), T;
  };
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      Ci,
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
              disabled: i,
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
        /* @__PURE__ */ n(vn, { draft: r, onChange: s, presentation: !1 }),
        r.entityType === "performerOccurrence" && /* @__PURE__ */ n(wn, { review: r, onChange: s })
      ] }),
      !t && r.entityType === "performerOccurrence" && /* @__PURE__ */ n("section", { hidden: h !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n(wn, { review: r, onChange: s, choices: !0 }) }),
      !t && (!e || C === "video") && /* @__PURE__ */ n("section", { hidden: h !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(vn, { draft: r, onChange: s, queue: !1 }) }),
      !t && /* @__PURE__ */ n("section", { hidden: h !== "Actions", className: "dq-editor-section", children: C === "tag" ? /* @__PURE__ */ n(
        $o,
        {
          draft: r,
          saving: d,
          tagGroups: a,
          setDraft: s
        }
      ) : /* @__PURE__ */ n(
        Fo,
        {
          draft: r,
          saving: d,
          stepKey: O,
          rememberStepKey: (q, T) => I.current.set(q, O(T)),
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
            ), T = document.createElement("a");
            T.href = q, T.download = "data-quality-review.json", T.click(), URL.revokeObjectURL(q);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: m, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: g, children: t ? "Create & configure" : "Save review" })
    ] })
  ] });
}
function li({
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
function Fo({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: i,
  setDraft: a
}) {
  const d = (s, g) => a({
    ...e,
    actions: e.actions.map(
      (m, h) => h === s ? g : m
    )
  });
  return /* @__PURE__ */ u(Oe, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    e.entityType === "performerOccurrence" && /* @__PURE__ */ n("p", { children: "Actions apply only to the active performer in this scene. Set performer matching in the review filters below. Save review keeps those criteria with this rule." }),
    /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      Mr,
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
                    children: /* @__PURE__ */ n(Vr, {})
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
                li,
                {
                  action: s,
                  onChange: (S) => d(g, S)
                }
              ),
              /* @__PURE__ */ n(
                Mr,
                {
                  items: s.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (S) => d(g, { ...s, steps: S }),
                  renderItem: (S, C) => /* @__PURE__ */ n(
                    xo,
                    {
                      occurrence: e.entityType === "performerOccurrence",
                      dragHandleProps: C.dragHandleProps,
                      saving: t,
                      isOver: C.isOver,
                      step: S,
                      index: C.index,
                      onChange: (b) => {
                        i(b, S), d(g, {
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
function $o({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: i
}) {
  const a = (d, s) => i({
    ...e,
    actions: e.actions.map(
      (g, m) => m === d ? s : g
    )
  });
  return /* @__PURE__ */ u(Oe, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      Mr,
      {
        items: e.actions,
        getKey: (d) => d.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (d) => i({ ...e, actions: d }),
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
                    children: /* @__PURE__ */ n(Vr, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: d.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => i({
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
                li,
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
                  onClick: () => i({
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
function xo({
  occurrence: e = !1,
  step: t,
  index: r,
  dragHandleProps: i,
  saving: a,
  isOver: d,
  onChange: s,
  onRemove: g
}) {
  const m = oi(t.mode);
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
            ...i,
            disabled: a,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${r + 1}`,
            children: /* @__PURE__ */ n(Vr, {})
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
              !e && /* @__PURE__ */ u(Oe, { children: [
                /* @__PURE__ */ n("option", { value: "MARK_PRESENT", children: "Mark present" }),
                /* @__PURE__ */ n("option", { value: "MARK_ABSENT", children: "Mark absent" }),
                /* @__PURE__ */ n("option", { value: "CLEAR_ABSENCE", children: "Clear absence" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ n("div", { className: "dq-step-tags", children: /* @__PURE__ */ n(
          ot,
          {
            entityType: "tag",
            values: t.tagIds,
            onChange: (h) => s({ ...t, tagIds: h }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: g, children: /* @__PURE__ */ n(_n, {}) })
      ]
    }
  );
}
async function Lo() {
  const e = await G("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const s = JSON.parse(r);
      Array.isArray(s.reviews) && (i = JSON.stringify(s.reviews, null, 2));
    } catch {
    }
  const a = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), d = document.createElement("a");
  d.href = a, d.download = "data-quality-browser-recovery.json", d.click(), URL.revokeObjectURL(a);
}
function Nn({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(xn, { className: "dq-spin" }),
    e
  ] });
}
function An({
  message: e,
  onRetry: t,
  retryLabel: r = "Retry"
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(Fr, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: r })
  ] });
}
const Go = { components: { DataQualityPage: To } };
export {
  To as DataQualityPage,
  Go as default,
  rr as objectFiltersEqual
};
