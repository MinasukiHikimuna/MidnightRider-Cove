import { jsxs as l, Fragment as ve, jsx as n } from "react/jsx-runtime";
import { useState as E, useRef as M, useEffect as K, useMemo as kt, useCallback as bt, useLayoutEffect as An } from "react";
import { DetailListToolbar as Bt, VIDEO_CRITERIA as Vt, PERFORMER_CRITERIA as Er, VIDEO_SORT_OPTIONS as xr, EntityReferenceMultiSelector as it, FilterDialog as Tn, DetailListPagination as Rn, VideoPlayer as qn, TAG_SORT_OPTIONS as In, TAG_CRITERIA as On, EntityDetailTabs as Si, TagTile as Ei, VideoCard as Ci, SortableList as Cr } from "@cove/runtime/components";
import { ChevronLeft as kn, Pencil as Pn, Settings as Ni, AlertTriangle as Nr, Save as Ai, RotateCcw as Ti, ChevronRight as Mn, Film as Ar, Loader2 as Fn, Tags as Ri, ExternalLink as qi, X as $n, Plus as Ii, Upload as Oi, Trash2 as xn, GripVertical as Lr } from "@cove/runtime/lucide-react";
import { extensionFetch as ki } from "@cove/runtime/api";
function _e(e) {
  return e.entityType ?? "video";
}
function wt(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function ir(e) {
  if (e.entityType === "performerOccurrence") {
    if (!Dn(e.occurrence))
      return "Complete the optional occurrence condition before saving.";
    if (e.actions.some((r) => r.steps.some((i) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(i.mode))))
      return "Occurrence actions support adding and removing tags on the active performer. Video tag assessments are not supported here.";
  }
  if (_e(e) === "video" && e.actions.some(
    (r) => Ln(r)
  ))
    return "An action cannot contain contradictory assessments for the same tag.";
  if (!e.name.trim() || !e.actions.every((r) => vt(r, _e(e))))
    return "Name the review and complete every action step before saving.";
  if (new Set(e.actions.map((r) => r.id)).size !== e.actions.length)
    return "Action IDs must be unique within a review.";
  const t = e.actions.map(
    (r, i) => r.shortcut ?? (i < 9 ? String(i + 1) : "")
  ).filter(Boolean);
  return t.some((r) => !/^[1-9]$/.test(r)) || new Set(t).size !== t.length ? "Assign each shortcut 1–9 only once, or choose None. Navigation and player keys are reserved." : "";
}
function $e(e) {
  const t = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(1e3, t(e.perPage, 40)))
  };
}
function an(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function It(e) {
  const { page: t, ...r } = e.view.filter, i = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    e.entityType === "performerOccurrence" ? ["performerOccurrence", ...i, e.occurrence] : _e(e) === "tag" ? ["tag", ...i] : i
  );
}
function vt(e, t) {
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
  ) && !Ln(e) : !1;
}
function or(e) {
  return "steps" in e ? e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  ) : !1;
}
function Ln(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.steps)
    if (["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(r.mode))
      for (const i of r.tagIds) {
        const s = t.get(i);
        if (s && s !== r.mode) return !0;
        t.set(i, r.mode);
      }
  return !1;
}
function Jt(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || r.entityType === "video" || r.entityType === "tag" || r.entityType === "performerOccurrence") && (r.entityType !== "performerOccurrence" || Dn(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Pi(r.presentation, r.entityType === "tag") && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (r.entityType === "tag" ? "effect" in i && !("steps" in i) && vt(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (s) => s && Array.isArray(s.tagIds)
      ) && vt(i, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => ir(r)))
    throw new Error(
      "Saved reviews contain invalid actions or shortcuts. Existing data has been kept; assign shortcuts 1–9 only once or leave them empty."
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
    (i) => i === void 0 || Array.isArray(i) && i.every((s) => Number.isSafeInteger(s) && s > 0)
  );
}
function Tr(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const s of i)
      r.has(s.id) || (r.add(s.id), t.push(s));
  return t;
}
function Dn(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (i) => Array.isArray(i) && i.every((s) => Number.isSafeInteger(s) && s > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && (t.targetMode !== "selected" || t.performerIds.length > 0) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && ["any", "includes", "includesAll", "excludes", "isNull"].includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && r(t.tagIds) && typeof t.multiple == "boolean";
}
function sn(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function cn(e, t, r, i) {
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
function Mi(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((s) => r.has(s));
  for (const s of t)
    i ? r.delete(s) : r.add(s);
  return r;
}
function _n(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const Un = "ext:com.midnightrider.data-quality:configuration", Fi = "ext:cove-data-quality:video-reviews", Rr = "ext:com.midnightrider.data-quality:progress", zt = /* @__PURE__ */ new Map(), tr = /* @__PURE__ */ new Map(), Ot = (e, t) => e.includes("*") || e.includes(t), ar = (e) => U(`/api/savedfilters?mode=${encodeURIComponent(e)}`), $i = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function qr(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Pt(e) {
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
    reviews: Jt(JSON.stringify(t.reviews)),
    deletedIds: qr(t.deletedIds),
    importedIds: qr(t.importedIds)
  };
}
function xi(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const s of t) {
    const c = localStorage.getItem(s);
    if (c !== null) {
      const o = Jt(c);
      r ?? (r = o), o.forEach((g) => i.add(g.id));
    }
    qr(
      JSON.parse(localStorage.getItem(`${s}:account-imports`) ?? "[]")
    ).forEach((o) => i.add(o));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function jn(e) {
  const t = await U("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Kn(e, t) {
  const r = (tr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return tr.set(e, r), r.finally(() => {
    tr.get(e) === r && tr.delete(e);
  }).catch(() => {
  }), r;
}
let Ut = null;
function Li() {
  if (Ut) return Ut;
  const e = Di();
  return Ut = e, e.finally(() => {
    Ut === e && (Ut = null);
  }).catch(() => {
  }), e;
}
async function Di() {
  var b;
  const e = await U("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = Ot(e.permissions, "savedfilters.read"), s = i && Ot(e.permissions, "savedfilters.write"), c = i ? (await ar(Un)).filter((R) => R.name === "Data Quality configuration").sort((R, A) => R.id - A.id) : [];
  if (c.length > 1) {
    const R = (A) => {
      const { revision: k, ...q } = Pt(A.uiOptions);
      return JSON.stringify(q);
    };
    if (c.some((A) => R(A) !== R(c[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (s)
      for (const A of c.slice(1))
        await U(`/api/savedfilters/${A.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${A.id}` })
        });
    c.splice(1);
  }
  let o = c.length ? Pt(c[0].uiOptions) : $i();
  const g = localStorage.getItem(`${r}:migrated`) === "true", f = localStorage.getItem(r), p = localStorage.getItem(`${r}:local-only`) === "true";
  !c.length && f && (o = Pt(f));
  let N = !c.length;
  if (c.length && p && f) {
    const R = Pt(f);
    if (R.reviews.some((k) => {
      const q = o.reviews.find((V) => V.id === k.id);
      return q && JSON.stringify(q) !== JSON.stringify(k);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const A = [
      .../* @__PURE__ */ new Set([...o.deletedIds, ...R.deletedIds])
    ];
    o = {
      ...o,
      reviews: Tr(o.reviews, R.reviews).filter(
        (k) => !A.includes(k.id)
      ),
      deletedIds: A,
      importedIds: [
        .../* @__PURE__ */ new Set([...o.importedIds, ...R.importedIds])
      ]
    }, N = !0;
  }
  if (!g) {
    const R = JSON.stringify(o), A = xi(t);
    if (c.length && A.reviews.some((I) => {
      const G = o.reviews.find((re) => re.id === I.id);
      return G && JSON.stringify(G) !== JSON.stringify(I);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const k = i ? (await ar(Fi)).flatMap(
      (I) => Jt(I.uiOptions ?? "[]")
    ) : [], q = A.known.filter(
      (I) => !A.reviews.some((G) => G.id === I)
    ), V = /* @__PURE__ */ new Set([...o.deletedIds, ...q]);
    o = {
      ...o,
      reviews: Tr(
        A.reviews,
        o.reviews,
        k.filter(
          (I) => !A.known.includes(I.id) && !o.importedIds.includes(I.id)
        )
      ).filter((I) => !V.has(I.id)),
      deletedIds: [...V],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...o.importedIds,
          ...A.known,
          ...k.map((I) => I.id)
        ])
      ]
    }, N || (N = JSON.stringify(o) !== R);
  }
  const S = {
    userId: t,
    recordId: (b = c[0]) == null ? void 0 : b.id,
    config: o,
    readable: i,
    writable: s,
    durable: s
  };
  if (zt.set(r, S), N && s) {
    const R = o;
    c.length && (S.config = Pt(c[0].uiOptions)), await Bn(r, R), o = S.config;
  } else c.length || (localStorage.setItem(r, JSON.stringify(o)), !i && (!g || p) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (s)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: o.reviews,
    storageKey: r,
    canWrite: Ot(e.permissions, "videos.write"),
    canWriteVideos: Ot(e.permissions, "videos.write"),
    canWriteTags: Ot(e.permissions, "tags.write"),
    canReadTagGroups: Ot(e.permissions, "taggroups.read"),
    canConfigure: !i || s,
    storageNotice: i ? s ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Bn(e, t) {
  const r = zt.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await jn(r), r.recordId != null) {
      const c = await U(
        `/api/savedfilters/${r.recordId}`
      );
      if (Pt(c.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const s = await U(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Un,
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
function _i(e, t) {
  return Jt(JSON.stringify(t)), Kn(e, async () => {
    const r = zt.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((s) => !t.some((c) => c.id === s.id)).map((s) => s.id);
    await Bn(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((s) => !t.some((c) => c.id === s))
    });
  });
}
function ln(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([r, i]) => /^[1-9]\d*:[1-9]\d*$/.test(r) && ["reviewed", "cannotDetermine"].includes(String(i)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Ui(e, t) {
  const r = zt.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), s = i ? ln(i) : null;
  if (!r.readable) return s;
  const c = (await ar(Rr)).find(
    (g) => g.name === t
  ), o = c ? ln(c.uiOptions) : null;
  return s && (!o || s.updatedAt > o.updatedAt) ? s : o;
}
function ji(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return Kn(i, async () => {
    const s = zt.get(e);
    if (!(s != null && s.writable)) return;
    await jn(s);
    const c = (await ar(Rr)).find(
      (o) => o.name === t
    );
    await U(
      c ? `/api/savedfilters/${c.id}` : "/api/savedfilters",
      {
        method: c ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Rr,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const at = "confirmed_absent_tags", Dr = "Confirmed absent tags", Ki = {
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
function Mt(e) {
  return Array.isArray(e) ? e.map(Mt) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? Ki[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === at.toLowerCase() ? r.toLowerCase() : Mt(r)
    ])
  ) : e;
}
async function U(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await ki(e, { ...t, headers: r });
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
const Bi = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Vi = 0;
function lr(e) {
  return U(`/api/videos/${e}?dqRead=${Bi}-${++Vi}`, { cache: "no-store" });
}
async function Kt(e, t, r) {
  const i = { ...e.view.objectFilter }, s = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return U("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Mt({
        findFilter: $e(t),
        objectFilter: i,
        filterExpression: s
      })
    )
  });
}
async function dn(e, t, r) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, U("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Mt({
        findFilter: $e(t),
        objectFilter: i
      })
    )
  });
}
function Gi(e) {
  return U("/api/taggroups", { signal: e });
}
function Ji(e) {
  return `/api/videos/${e.id}/image?max=1280&v=${encodeURIComponent(e.updatedAt)}`;
}
function Vn(e) {
  return `/api/stream/video/${e}`;
}
function un(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function zi(e) {
  return `/api/stream/video/${e}/preview`;
}
function Wi(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Qi(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Ft(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const i of e) {
    await U(`/api/tags/${i}`, { signal: t }), r.add(i);
    for (let s = 1; ; s++) {
      const c = await U("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Mt({
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
function Hi(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${at} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function _r() {
  const t = (await U("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === at.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${Dr} custom field before applying tag assessments.`
    };
  const r = Hi(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function Xi() {
  const e = await _r();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await U("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: at,
        label: Dr,
        type: "tag",
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function sr(e) {
  return [...new Set(e)];
}
function Yi(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${at} value is not a valid tag list.`
    );
  return sr(e);
}
function Zi(e) {
  return sr(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function eo(e, t) {
  let r;
  try {
    r = await _r();
  } catch (p) {
    throw new Error(
      `Could not verify the ${Dr} custom field. ${p instanceof Error ? p.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const i = await Promise.all(
    e.steps.map(async (p) => ({
      ...p,
      tagIds: p.mode === "REMOVE_TREE" ? await Ft(p.tagIds) : sr(p.tagIds)
    }))
  ), s = i.filter(
    (p) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(p.mode)
  ), c = i.filter(
    (p) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(p.mode)
  ), o = sr(t), g = r.definition.key;
  let f = 0;
  for (const p of o)
    try {
      const N = await lr(p), S = Zi(N), b = { ...N.customFields ?? {} }, R = b[g], A = Yi(R), k = new Set(S), q = new Set(A);
      for (const re of s)
        for (const ce of re.tagIds)
          re.mode === "ADD" ? k.add(ce) : k.delete(ce);
      for (const re of c)
        for (const ce of re.tagIds)
          re.mode === "MARK_PRESENT" ? (k.add(ce), q.delete(ce)) : re.mode === "MARK_ABSENT" ? (k.delete(ce), q.add(ce)) : q.delete(ce);
      const V = [...k], I = [...q];
      JSON.stringify(S) === JSON.stringify(V) && JSON.stringify(A) === JSON.stringify(I) && (R === void 0 ? I.length === 0 : JSON.stringify(R) === JSON.stringify(A)) || await U(`/api/videos/${p}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: V,
          customFields: {
            ...b,
            [g]: I
          }
        })
      }), f++;
    } catch (N) {
      throw new Error(
        `Assessment stopped after ${f} video${f === 1 ? "" : "s"} completed; video ${p} was affected. Refresh and inspect it before retrying. ${N instanceof Error ? N.message : "Request failed."}`
      );
    }
}
async function Gn(e, t) {
  if (!vt(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (or(e)) {
    await eo(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (i) => ({
      mode: i.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: i.mode === "REMOVE_TREE" ? await Ft(i.tagIds) : i.tagIds
    }))
  );
  for (let i = 0; i < r.length; i++)
    try {
      await U("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({
          ids: [...t],
          tagIds: [...r[i].tagIds],
          tagMode: r[i].mode
        })
      });
    } catch (s) {
      throw new Error(
        `Step ${i + 1} failed; ${i} earlier step(s) completed. Refresh and check the selected videos before retrying. ${s instanceof Error ? s.message : "Request failed."}`
      );
    }
}
async function to(e, t) {
  if (!vt(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await U("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const ro = {
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
function Ur(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function no(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function jr(e) {
  return [
    ...new Set(
      Ur(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Kr(e, t) {
  const r = Ur(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((i) => {
      const s = String(i.key ?? ""), c = ro[String(i.modifier ?? "EQUALS")], o = (S, b) => String(b ?? "").trim() || t[String(S)] || String(S ?? ""), g = o(
        i.value,
        i.displayValue
      ), f = o(
        i.value2,
        i.displayValue2
      ), p = String(i.modifier ?? "EQUALS"), N = p === "IS_NULL" || p === "NOT_NULL" ? [] : p === "BETWEEN" || p === "NOT_BETWEEN" ? [g, "and", f] : [g];
      return {
        ...i,
        label: [no(s), c, ...N].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function Jn(e) {
  const t = Ur(e.customFieldCriteria);
  return t.length ? {
    ...e,
    customFieldCriteria: t.map(
      ({ label: r, ...i }) => i
    )
  } : e;
}
function zn(e, t, r) {
  return r || "customFieldCriteria" in t || !Array.isArray(e.customFieldCriteria) ? t : { ...t, customFieldCriteria: e.customFieldCriteria };
}
async function io(e, t, r) {
  if (!vt(r) || r.steps.some(
    (c) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(c.mode)
  ))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const i = await Promise.all(
    r.steps.map(async (c) => ({
      ...c,
      tagIds: c.mode === "REMOVE_TREE" ? await Ft(c.tagIds) : c.tagIds
    }))
  );
  let s = t.applications;
  for (const c of i)
    s = await Hn(
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
  return s;
}
async function Br(e, t) {
  const r = e.occurrence;
  if (r.targetMode === "all" || r.targetMode === "filter" && Object.keys(r.performerFilter).length === 0) return null;
  if (r.targetMode === "selected") return r.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: s, ...c } = r.performerFilter;
  for (let o = 1; ; o++) {
    const g = await U("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Mt({
          findFilter: { page: o, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: c,
          filterExpression: s
        })
      )
    });
    if (g.items.forEach((f) => i.add(f.id)), o * 1e3 >= g.totalCount) return [...i];
    if (!g.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Wn(e, t) {
  const { _filterExpression: r, ...i } = e.view.objectFilter, s = e.occurrence, c = {
    mode: "atLeastOne",
    conditionOperator: "and",
    ...t === null ? {} : {
      performerIdsCriterion: { modifier: "includes", value: t }
    },
    ...s.condition === "any" ? {} : {
      performerOccurrenceTagsCriterion: {
        modifier: s.condition,
        value: s.conditionTagIds
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
            { filter: { performerFilterCriterion: c } }
          ]
        }
      }
    }
  };
}
function oo(e, t) {
  const r = new Set(t);
  switch (e.condition) {
    case "any":
      return !0;
    case "isNull":
      return r.size === 0;
    case "includes":
      return e.conditionTagIds.some((i) => r.has(i));
    case "includesAll":
      return e.conditionTagIds.every((i) => r.has(i));
    case "excludes":
      return e.conditionTagIds.every((i) => !r.has(i));
  }
}
async function Qn(e, t, r, i) {
  if ((t == null ? void 0 : t.length) === 0)
    return { items: [], totalCount: 0 };
  const s = await Kt(
    Wn(e, t),
    { ...e.view.filter, page: r },
    i
  ), c = t === null ? null : new Set(t), o = new Array(s.items.length);
  let g = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, s.items.length) }, async () => {
      for (; g < s.items.length; ) {
        const f = g++, p = s.items[f], N = await U(
          `/api/tagapplications?hostType=video&hostId=${p.id}&contextType=performer`,
          { signal: i }
        );
        o[f] = p.performers.filter((S) => c === null || c.has(S.id)).flatMap((S) => {
          const b = N.filter(
            (R) => R.hostType === "video" && R.hostId === p.id && R.contextType === "performer" && R.contextId === S.id
          );
          return oo(
            e.occurrence,
            b.map((R) => R.tag.id)
          ) ? [
            {
              key: `${p.id}:${S.id}`,
              video: p,
              performer: S,
              applications: b
            }
          ] : [];
        });
      }
    })
  ), { items: o.flat(), totalCount: s.totalCount };
}
async function Hn(e, t, r) {
  const i = new Set(e.occurrence.tagIds);
  if (r.some((f) => !i.has(f)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const s = await lr(t.video.id);
  if (!s.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      "This performer is no longer linked to the scene. Refresh the queue."
    );
  const c = `/api/tagapplications?hostType=video&hostId=${s.id}&contextType=performer&contextId=${t.performer.id}`, o = (await U(c)).filter(
    (f) => f.hostType === "video" && f.hostId === s.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), g = new Set(r);
  try {
    for (const f of g)
      o.some((p) => p.tag.id === f) || await U("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: "video",
          hostId: s.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: f,
          sourceKey: "user"
        })
      });
    for (const f of o)
      i.has(f.tag.id) && !g.has(f.tag.id) && await U(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await U(c);
  } catch (f) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${f instanceof Error ? f.message : "Request failed."}`
    );
  }
}
function ot(e, t) {
  return {
    added: t.filter((r) => !e.includes(r)),
    removed: e.filter((r) => !t.includes(r))
  };
}
function ao(e) {
  return `/api/tagapplications?hostType=video&hostId=${e.video.id}&contextType=performer&contextId=${e.occurrence.performer.id}`;
}
async function Oe(e) {
  var c;
  if (e.occurrence) {
    const o = (await U(ao(e))).filter(
      (g) => g.hostType === "video" && g.hostId === e.video.id && g.contextType === "performer" && g.contextId === e.occurrence.performer.id
    );
    return {
      ids: [...new Set(o.map((g) => g.tag.id))],
      names: [...new Set(o.map((g) => g.tag.name))],
      absent: [],
      applications: o
    };
  }
  const t = await lr(e.video.id), r = (t.tags ?? []).filter(
    (o) => o.canRemove !== !1 || o.isDerived !== !0
  ), i = Object.keys(t.customFields ?? {}).find(
    (o) => o.toLowerCase() === at
  ) ?? at, s = ((c = t.customFields) == null ? void 0 : c[i]) ?? [];
  if (!Array.isArray(s) || s.some((o) => !Number.isSafeInteger(o)))
    throw new Error(
      "Confirmed absent tags are invalid. Inspect the video before editing."
    );
  return { ids: r.map((o) => o.id), names: r.map((o) => o.name), absent: s };
}
async function dr(e, t, r) {
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
    for (const [i, s] of [
      ["ADD", r.added],
      ["REMOVE", r.removed]
    ])
      s.length && await U("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({ ids: [t.video.id], tagMode: i, tagIds: s })
      });
}
async function so(e, t, r) {
  t.occurrence && e.entityType === "performerOccurrence" ? await io(e, t.occurrence, r) : await Gn(r, [t.video.id]);
}
async function co(e) {
  return [
    ...new Set(
      (await Promise.all(
        e.steps.map(
          (t) => t.mode === "REMOVE_TREE" ? Ft(t.tagIds) : t.tagIds
        )
      )).flat()
    )
  ];
}
function cr(e, t, r, i) {
  const s = (c) => c.filter((o) => i.includes(o));
  return {
    item: e,
    before: t,
    after: r,
    tags: ot(s(t.ids), s(r.ids)),
    absence: ot(s(t.absent), s(r.absent))
  };
}
function Ir(e, t) {
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
async function lo(e, t) {
  const r = await Oe(t.item);
  if (Ir(t, r), t.absence.added.length || t.absence.removed.length) {
    const i = await lr(t.item.video.id), s = await Oe(t.item), c = Object.keys(i.customFields ?? {}).find(
      (o) => o.toLowerCase() === at
    ) ?? at;
    Ir(t, s), await U(`/api/videos/${i.id}`, {
      method: "PUT",
      body: JSON.stringify({
        tagIds: [
          ...s.ids.filter((o) => !t.tags.added.includes(o)),
          ...t.tags.removed
        ],
        customFields: {
          ...i.customFields,
          [c]: [
            ...s.absent.filter(
              (o) => !t.absence.added.includes(o)
            ),
            ...t.absence.removed
          ]
        }
      })
    });
  } else
    await dr(e, t.item, {
      added: t.tags.removed,
      removed: t.tags.added
    });
}
const Or = (e) => e instanceof Error ? e.message : "Request failed.", fn = (e) => [...e].sort((t, r) => t - r), Gt = (e, t) => JSON.stringify(fn(e)) === JSON.stringify(fn(t)), kr = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Xn(e, t) {
  const r = new Set(e);
  for (const i of t.steps)
    for (const s of i.tagIds)
      i.mode === "ADD" ? r.add(s) : r.delete(s);
  return [...r];
}
async function uo(e, t, r, i = () => {
}) {
  if (!vt(t, "performerOccurrence") || !t.steps.length || t.steps.some(
    (p) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(p.mode)
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const s = structuredClone(e), c = structuredClone(t);
  for (const p of c.steps)
    p.mode === "REMOVE_TREE" && (p.tagIds = await Ft(p.tagIds, r), p.mode = "REMOVE");
  r.throwIfAborted();
  const o = [...new Set(c.steps.flatMap((p) => p.tagIds))];
  s.view.filter = {
    ...s.view.filter,
    page: 1,
    perPage: 250,
    sort: "id",
    direction: "asc",
    sorts: void 0
  };
  const g = await Br(s, r), f = /* @__PURE__ */ new Map();
  for (let p = 1; ; p++) {
    r.throwIfAborted();
    const N = await Qn(s, g, p, r);
    for (const S of N.items) {
      const b = {
        ids: [...new Set(S.applications.map((A) => A.tag.id))],
        names: S.applications.map((A) => A.tag.name),
        absent: [],
        applications: S.applications
      }, R = Xn(b.ids, c);
      f.set(S.key, {
        item: { key: S.key, video: S.video, occurrence: S },
        before: b,
        expected: b,
        desired: R,
        conflict: ot(b.ids, R).removed.length > 0,
        status: Gt(b.ids, R) ? "unchanged" : "pending"
      });
    }
    if (i(f.size), p * 250 >= N.totalCount) break;
    if (p > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return r.throwIfAborted(), { review: s, action: c, touched: o, entries: [...f.values()] };
}
function fo(e, t, r) {
  const i = (c) => c.ids.filter((o) => r.includes(o));
  if (!Gt(i(e), i(t))) return !1;
  const s = (c) => (c.applications ?? []).filter((o) => r.includes(o.tag.id)).map((o) => o.id);
  return Gt(s(e), s(t));
}
async function Yn(e, t, r, i) {
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
async function po(e, t, r, i, s = !1) {
  const c = e.entries.filter(
    (o) => s ? o.status === "failed" : o.status === "pending"
  );
  await Yn(
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
      let g;
      try {
        if (g = await Oe(o.item), !fo(o.expected, g, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (b) {
        o.status = "failed", o.error = Or(b);
        return;
      }
      const f = Xn(g.ids, e.action), p = ot(g.ids, f);
      let N;
      try {
        await dr(e.review, o.item, p);
      } catch (b) {
        N = b;
      }
      let S = !1;
      try {
        const b = await Oe(o.item);
        S = !0, o.expected = b;
        const R = cr(
          o.item,
          o.before,
          b,
          e.touched
        );
        if (o.operation = kr(R) ? R : void 0, N) throw N;
        if (!Gt(
          b.ids.filter((A) => e.touched.includes(A)),
          f.filter((A) => e.touched.includes(A))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (b) {
        if (o.status = "failed", o.error = Or(b), !S)
          try {
            const R = await Oe(o.item);
            o.expected = R;
            const A = cr(
              o.item,
              o.before,
              R,
              e.touched
            );
            o.operation = kr(A) ? A : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    i
  );
}
async function go(e, t, r) {
  await Yn(
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
        const g = await Oe(i.item);
        Ir(s, g), o = !0, await dr(e.review, i.item, {
          added: s.tags.removed,
          removed: s.tags.added
        });
        const f = await Oe(i.item);
        if (!Gt(
          f.ids.filter((p) => c.includes(p)),
          i.before.ids.filter((p) => c.includes(p))
        ))
          throw new Error("Undo did not restore all affected tags.");
        i.operation = void 0, i.expected = f, i.status = "unchanged", i.error = void 0;
      } catch (g) {
        if (i.error = `Undo stopped: ${Or(g)}`, i.status = "failed", o)
          try {
            const f = await Oe(i.item), p = cr(
              i.item,
              i.before,
              f,
              c
            );
            i.operation = kr(p) ? p : void 0, i.expected = f;
          } catch {
            i.unverified = !0;
          }
      }
    },
    r
  );
}
async function pn(e, t, r) {
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
            (await U(`/api/${t}/${o}`, {
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
function ho({
  review: e,
  disabled: t,
  hidden: r = !1,
  onOpen: i,
  onClose: s,
  onWrite: c
}) {
  const [o, g] = E(!1), [f, p] = E(null), [N, S] = E(""), [b, R] = E(!1), [A, k] = E(!1), [q, V] = E(""), [I, G] = E(""), [re, ce] = E({}), [h, P] = E(!1), [T, $] = E(!1), _ = h && f ? f.review : e, [ie, Q] = E(!1), [Xe, B] = E([]), [xe, oe] = E(!1), [, Se] = E(0), Ee = M(null), st = M(null), z = M(!1), ke = M(null), he = M(!1), Y = M(!1), Ae = M({ onClose: s, onWrite: c });
  Ae.current = { onClose: s, onWrite: c }, K(() => {
    var y;
    o && ((y = Ee.current) == null || y.showModal());
  }, [o]), K(() => {
    if (!o || _.occurrence.targetMode !== "selected") return;
    const y = new AbortController();
    return B([]), pn(
      _.occurrence.performerIds,
      "performers",
      y.signal
    ).then((O) => {
      y.signal.aborted || B(O.map(([, pe]) => pe));
    }).catch(() => {
    }), () => y.abort();
  }, [
    o,
    _.occurrence.targetMode,
    JSON.stringify(_.occurrence.performerIds)
  ]), K(
    () => () => {
      var y;
      z.current = !0, (y = ke.current) == null || y.abort();
    },
    []
  ), K(() => {
    if (!A) return;
    const y = (O) => {
      O.preventDefault(), O.returnValue = "";
    };
    return window.addEventListener("beforeunload", y), () => window.removeEventListener("beforeunload", y);
  }, [A]);
  function me() {
    Y.current || (g(!1), Ae.current.onClose(he.current), he.current = !1, requestAnimationFrame(() => {
      var y;
      return (y = st.current) == null ? void 0 : y.focus();
    }));
  }
  async function Ye() {
    const y = e.actions.find((O) => O.id === N);
    if (!(!y || Y.current)) {
      Y.current = !0, k(!0), V(""), G("Loading all matching occurrences…"), p(null), P(!1), $(!1), oe(!1), ke.current = new AbortController();
      try {
        const O = await uo(
          e,
          y,
          ke.current.signal,
          (ct) => G(`Loaded ${ct.toLocaleString()} matching occurrences…`)
        ), pe = await pn(
          [
            .../* @__PURE__ */ new Set([
              ...O.touched,
              ...O.review.occurrence.conditionTagIds,
              ...jr(O.review.view.objectFilter)
            ])
          ],
          "tags",
          ke.current.signal
        );
        ke.current.signal.throwIfAborted(), ce(Object.fromEntries(pe)), p(O), G("Preview ready. No tags have been changed.");
      } catch (O) {
        V(
          ke.current.signal.aborted ? "Preview cancelled. No tags were changed." : String(O instanceof Error ? O.message : O)
        ), G("");
      } finally {
        Y.current = !1, k(!1), ke.current = null;
      }
    }
  }
  async function Ge(y) {
    if (!f || Y.current) return;
    Y.current = !0, z.current = !1, he.current = !0, Ae.current.onWrite(), k(!0), P(!0), V(""), y === "undo" && $(!0), G(y === "undo" ? "Undoing batch…" : "Applying batch…");
    const O = () => Se((pe) => pe + 1);
    try {
      y === "undo" ? await go(f, () => z.current, O) : await po(
        f,
        b,
        () => z.current,
        O,
        y === "retry"
      ), G(
        z.current ? "Stopped after in-flight operations settled. Completed changes are retained." : y === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (pe) {
      V(pe instanceof Error ? pe.message : String(pe));
    } finally {
      Y.current = !1, k(!1), O();
    }
  }
  const Te = (f == null ? void 0 : f.entries) ?? [], pt = Te.filter((y) => y.conflict), ee = (y) => Te.filter((O) => O.status === y).length, ye = h && f ? [f.action] : e.actions.filter((y) => y.steps.length), Z = Te.some((y) => y.operation), v = (y) => y.map((O) => re[O] ?? `Tag ${O}`).join(", ") || "None";
  return /* @__PURE__ */ l(ve, { children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-button",
        hidden: r,
        ref: st,
        disabled: t || !ye.length,
        onClick: () => {
          var y;
          h || (p(null), G(""), V("")), i(), g(!0), S(
            ye.some((O) => O.id === N) ? N : ((y = ye[0]) == null ? void 0 : y.id) ?? ""
          );
        },
        children: h ? "Batch results / undo" : "Apply to all matching occurrences"
      }
    ),
    o && /* @__PURE__ */ l(
      "dialog",
      {
        ref: Ee,
        className: "dq-batch-dialog",
        "aria-labelledby": "dq-batch-title",
        "aria-modal": "true",
        onCancel: (y) => {
          y.preventDefault(), me();
        },
        children: [
          /* @__PURE__ */ n("h2", { id: "dq-batch-title", children: "Batch occurrence approval" }),
          /* @__PURE__ */ n("p", { children: "Apply one answer across all matching pages. Only targeted performer occurrences change." }),
          /* @__PURE__ */ n("p", { children: "Keep this page open while running. Results and undo last until you leave this workspace." }),
          /* @__PURE__ */ l("fieldset", { disabled: A || h, children: [
            /* @__PURE__ */ n("legend", { children: "Batch scope and action" }),
            /* @__PURE__ */ n("p", { children: "Uses your current filters. To include every existing appearance, remove filters that exclude already answered occurrences." }),
            /* @__PURE__ */ l("p", { children: [
              "Performer scope:",
              " ",
              _.occurrence.targetMode === "all" ? "All performers" : _.occurrence.targetMode === "selected" ? Xe.join(", ") || `${_.occurrence.performerIds.length} selected performer(s)` : "Matching performer criteria",
              ". Occurrence condition:",
              " ",
              _.occurrence.condition === "any" ? "Any occurrence tags" : {
                includes: "Has any selected tag",
                includesAll: "Has all selected tags",
                excludes: "Has none of the selected tags",
                isNull: "Has no occurrence tags"
              }[_.occurrence.condition],
              "."
            ] }),
            _.occurrence.conditionTagIds.length > 0 && f && /* @__PURE__ */ l("p", { children: [
              "Condition tags:",
              " ",
              v(_.occurrence.conditionTagIds),
              "."
            ] }),
            /* @__PURE__ */ l("p", { children: [
              "Search: ",
              String(_.view.filter.q || "Any"),
              ".",
              " ",
              Object.keys(_.view.objectFilter).length === 0 && "Scene filters: None."
            ] }),
            /* @__PURE__ */ n(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": "Batch scene filters",
                children: /* @__PURE__ */ n(
                  Bt,
                  {
                    filter: _.view.filter,
                    objectFilter: Kr(
                      _.view.objectFilter,
                      re
                    ),
                    criteriaDefinitions: [
                      ...Vt,
                      {
                        id: "custom-fields",
                        label: "Custom Fields",
                        filterKey: "customFieldCriteria"
                      }
                    ],
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
                  Bt,
                  {
                    filter: {},
                    objectFilter: _.occurrence.performerFilter,
                    criteriaDefinitions: Er,
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
            !ye.length && /* @__PURE__ */ n("p", { children: "Configure an occurrence tag action in this review before starting a batch." }),
            /* @__PURE__ */ l("label", { children: [
              "Answer",
              " ",
              /* @__PURE__ */ n(
                "select",
                {
                  "aria-label": "Batch answer",
                  value: N,
                  onChange: (y) => {
                    S(y.target.value), p(null), G("");
                  },
                  children: ye.map((y) => /* @__PURE__ */ n("option", { value: y.id, children: y.label }, y.id))
                }
              )
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: !ye.length,
                onClick: () => void Ye(),
                children: "Preview all matches"
              }
            ),
            /* @__PURE__ */ l("label", { children: [
              "Conflicting answers",
              " ",
              /* @__PURE__ */ l(
                "select",
                {
                  "aria-label": "Conflicting answers",
                  value: b ? "replace" : "skip",
                  onChange: (y) => R(y.target.value === "replace"),
                  children: [
                    /* @__PURE__ */ n("option", { value: "skip", children: "Skip conflicts" }),
                    /* @__PURE__ */ n("option", { value: "replace", children: "Replace conflicting answers" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ n("p", { children: "Conflicts are existing tags this action removes. Configure opposite answers as removals." })
          ] }),
          /* @__PURE__ */ l("div", { "aria-live": "polite", children: [
            I && /* @__PURE__ */ n("p", { role: "status", children: I }),
            q && /* @__PURE__ */ n("p", { role: "alert", children: q }),
            f && /* @__PURE__ */ l(ve, { children: [
              /* @__PURE__ */ n("p", { children: /* @__PURE__ */ l("strong", { children: [
                Te.length.toLocaleString(),
                " occurrences in",
                " ",
                new Set(
                  Te.map((y) => y.item.video.id)
                ).size.toLocaleString(),
                " ",
                "scenes"
              ] }) }),
              h ? /* @__PURE__ */ l("p", { children: [
                ee("changed"),
                " changed; ",
                ee("unchanged"),
                " unchanged;",
                " ",
                ee("skipped"),
                " skipped; ",
                ee("failed"),
                " failed;",
                " ",
                ee("pending"),
                " remaining."
              ] }) : /* @__PURE__ */ l("p", { children: [
                Te.filter(
                  (y) => y.status === "pending" && (b || !y.conflict)
                ).length.toLocaleString(),
                " ",
                "to change; ",
                ee("unchanged").toLocaleString(),
                " already correct; ",
                pt.length.toLocaleString(),
                " conflicts (",
                b ? "will replace" : "will skip",
                ")."
              ] })
            ] })
          ] }),
          f && /* @__PURE__ */ l(ve, { children: [
            !h && /* @__PURE__ */ l("p", { children: [
              "Planned additions:",
              " ",
              v([
                ...new Set(
                  Te.filter((y) => b || !y.conflict).flatMap(
                    (y) => ot(y.before.ids, y.desired).added
                  )
                )
              ]),
              ". Planned removals:",
              " ",
              v([
                ...new Set(
                  Te.filter((y) => b || !y.conflict).flatMap(
                    (y) => ot(y.before.ids, y.desired).removed
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
                onClick: () => oe(!xe),
                children: xe ? "Hide occurrence details" : "Inspect occurrences and conflicts"
              }
            ),
            xe && /* @__PURE__ */ n("div", { className: "dq-batch-items", children: /* @__PURE__ */ l("table", { children: [
              /* @__PURE__ */ n("thead", { children: /* @__PURE__ */ l("tr", { children: [
                /* @__PURE__ */ n("th", { children: "Occurrence" }),
                /* @__PURE__ */ n("th", { children: "Changes / result" })
              ] }) }),
              /* @__PURE__ */ n("tbody", { children: Te.map((y) => {
                var O;
                return /* @__PURE__ */ l("tr", { children: [
                  /* @__PURE__ */ n("td", { children: /* @__PURE__ */ l(
                    "a",
                    {
                      href: `/video/${y.item.video.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      children: [
                        (O = y.item.occurrence) == null ? void 0 : O.performer.name,
                        " —",
                        " ",
                        y.item.video.title || "Scene"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ l("td", { children: [
                    y.conflict && /* @__PURE__ */ n("strong", { children: "Conflict. " }),
                    h ? `${y.status}. ${y.error ?? ""}` : `Add: ${v(ot(y.before.ids, y.desired).added)}; Remove: ${v(ot(y.before.ids, y.desired).removed)}`
                  ] })
                ] }, y.item.key);
              }) })
            ] }) }),
            /* @__PURE__ */ l("div", { className: "dq-row", children: [
              !T && /* @__PURE__ */ l(ve, { children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button primary",
                    disabled: A || !ee("pending"),
                    onClick: () => void Ge("apply"),
                    children: h ? "Continue remaining" : "Apply batch"
                  }
                ),
                h && ee("failed") > 0 && /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: A,
                    onClick: () => void Ge("retry"),
                    children: "Retry failed occurrences"
                  }
                )
              ] }),
              Z && /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  disabled: A,
                  onClick: () => void Ge("undo"),
                  children: "Undo batch"
                }
              )
            ] })
          ] }),
          ie && /* @__PURE__ */ l("div", { role: "group", "aria-label": "Discard batch results", children: [
            /* @__PURE__ */ n("p", { children: "Starting a new batch discards these results and their undo history. Existing tag changes remain." }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: A,
                onClick: () => {
                  var y;
                  p(null), P(!1), R(!1), S(
                    ((y = e.actions.find((O) => O.steps.length)) == null ? void 0 : y.id) ?? ""
                  ), $(!1), G(""), Q(!1);
                },
                children: "Discard results and start new batch"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => Q(!1),
                children: "Keep results"
              }
            )
          ] }),
          /* @__PURE__ */ l("div", { className: "dq-row", children: [
            A && /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => {
                  var y;
                  z.current = !0, (y = ke.current) == null || y.abort(), G("Stopping after in-flight operations settle…");
                },
                children: [
                  "Cancel ",
                  ke.current ? "preview" : "run"
                ]
              }
            ),
            h && /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: A,
                onClick: () => Q(!0),
                children: "New batch"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: A,
                onClick: me,
                children: "Close"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
const Vr = [
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
], mo = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: []
};
function Pr(e) {
  const t = e.entityType === "performerOccurrence" ? e.occurrence : void 0;
  return {
    filter: $e({
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
        conditionTagIds: [...t.conditionTagIds]
      }
    } : {}
  };
}
function gn(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function hn(e, t) {
  if (!Vr.some((o) => t.has(o))) {
    const o = Pr(e);
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
    const o = t.get("sorts").split(",").map((g) => {
      const f = g.lastIndexOf(":");
      return { key: g.slice(0, f), direction: g.slice(f + 1) };
    });
    if (o.some((g) => !g.key || !["asc", "desc"].includes(g.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = o, i.sort = o[0].key, i.direction = o[0].direction;
  }
  let s;
  if (e.entityType === "performerOccurrence" && (s = {
    ...mo,
    ...gn(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(s.targetMode) || !["any", "includes", "includesAll", "excludes", "isNull"].includes(
    s.condition
  ) || !Array.isArray(s.performerIds) || !Array.isArray(s.conditionTagIds) || [...s.performerIds, ...s.conditionTagIds].some(
    (o) => !Number.isSafeInteger(o) || o <= 0
  ) || !s.performerFilter || typeof s.performerFilter != "object" || Array.isArray(s.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const c = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: $e(i),
      objectFilter: gn(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: c,
      performerScope: s
    },
    startAtEnd: !t.has("page") && c === "end"
  };
}
function rr(e, t) {
  const r = new URLSearchParams(window.location.search);
  Vr.forEach((i) => r.delete(i)), r.set("review", e);
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
function jt(e, t) {
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
function mn({
  performer: e
}) {
  return /* @__PURE__ */ l("span", { className: "dq-performer-avatar", "aria-hidden": "true", children: [
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
function vr(e, t) {
  if (!t) return e;
  const r = /* @__PURE__ */ new Map();
  for (const i of e)
    r.set(i.video.id, [...r.get(i.video.id) ?? [], i]);
  return [...r.values()].reverse().flat();
}
const ze = (e) => e instanceof Error ? e.message : "Request failed.";
function yo({
  actions: e,
  disabled: t,
  canWrite: r,
  onApply: i
}) {
  const [s, c] = E({});
  K(() => {
    let g = !0;
    return Promise.all(
      [
        ...new Set(
          e.flatMap(
            (f) => f.steps.flatMap((p) => p.tagIds)
          )
        )
      ].map(async (f) => {
        try {
          return [
            f,
            (await U(`/api/tags/${f}`)).name
          ];
        } catch {
          return [f, "Unavailable tag"];
        }
      })
    ).then((f) => {
      g && c(Object.fromEntries(f));
    }), () => {
      g = !1;
    };
  }, [e]);
  const o = {
    ADD: "Add",
    REMOVE: "Remove",
    REMOVE_TREE: "Remove tree",
    MARK_PRESENT: "Mark present",
    MARK_ABSENT: "Mark absent",
    CLEAR_ABSENCE: "Clear absence"
  };
  return /* @__PURE__ */ l("div", { className: "dq-review-actions", children: [
    /* @__PURE__ */ n("p", { children: "Actions apply and advance. Shift-click or Shift + shortcut applies and stays." }),
    e.map((g, f) => /* @__PURE__ */ l("div", { className: "dq-action-pair", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: t || !r && g.steps.length > 0,
          onClick: (p) => i(g, p.shiftKey),
          children: /* @__PURE__ */ l("span", { children: [
            /* @__PURE__ */ n("kbd", { children: wt(g, f) }),
            " ",
            g.label
          ] })
        }
      ),
      g.steps.length > 0 && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button",
          disabled: t || !r,
          "aria-label": `Apply & stay: ${g.label}`,
          onClick: () => i(g, !0),
          children: "Apply & stay"
        }
      ),
      g.steps.length > 0 && /* @__PURE__ */ n("small", { className: "dq-review-action-summary", children: g.steps.map(
        (p) => `${o[p.mode]}: ${p.tagIds.map((N) => s[N] ?? "Loading tag…").join(", ")}`
      ).join("; ") })
    ] }, g.id))
  ] });
}
function bo({
  review: e,
  canWrite: t,
  onBusy: r,
  onSaveDefaults: i,
  editRequest: s = 0,
  renderRuleEditor: c
}) {
  var $t, rt, Qt, H;
  const o = M(null), g = M("");
  if (!o.current)
    try {
      o.current = hn(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (d) {
      g.current = ze(d), o.current = { query: Pr(e), startAtEnd: !1 };
    }
  const [f, p] = E(null), N = M(null), S = M(null), b = M(null), [R, A] = E(!!g.current), k = M(0), [q, V] = E(o.current.query), I = M(q);
  I.current = q;
  const [G, re] = E(0), ce = M(o.current.startAtEnd), [h, P] = E([]), [T, $] = E(null), [_, ie] = E(0), [Q, Xe] = E(!1), [B, xe] = E(!1), oe = M(!1), Se = M(!0), Ee = M(null);
  K(() => (Se.current = !0, () => {
    Se.current = !1;
  }), []);
  const [st, z] = E(g.current), [ke, he] = E(""), [Y, Ae] = E(null), [me, Ye] = E(!1), [Ge, Te] = E([]), pt = M([]), ee = M(null), ye = M(null), Z = M(null);
  K(() => {
    var d, m;
    me && ((m = (d = Z.current) == null ? void 0 : d.querySelector("input")) == null || m.focus());
  }, [me]);
  const [v, y] = E(null), [O, pe] = E(!1);
  K(() => {
    if (Q || O || !ye.current) return;
    const d = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const m = ye.current;
      m != null && m.isConnected && !m.disabled && m.focus(), ye.current = null;
    });
    return () => cancelAnimationFrame(d);
  }, [Q, O, G]);
  const [ct, Ze] = E([]), [St, le] = E({}), Le = M(null), lt = M(0), dt = M(!1), [Pe, Et] = E({});
  K(() => {
    let d = !0;
    return Promise.all(
      jr(q.objectFilter).map(
        async (m) => [
          String(m),
          (await U(`/api/tags/${m}`)).name
        ]
      )
    ).then((m) => {
      d && Et(Object.fromEntries(m));
    }).catch(() => {
    }), () => {
      d = !1;
    };
  }, [q.objectFilter]);
  const j = M(0), ut = M(e);
  ut.current = e;
  const Me = f ?? e, Ue = kt(
    () => jt(Me, q),
    [Me, q]
  ), ur = M(Ue);
  ur.current = Ue;
  const We = B || Q || me, Fe = Number(q.filter.page);
  function de(d, m = !1) {
    oe.current || (g.current = "", ce.current = m, I.current = d, V(d), ie(0), Xe(!0), m || rr(e.id, d), re((F) => F + 1));
  }
  function Qe() {
    if (oe.current = !1, xe(!1), Se.current && Ee.current) {
      const d = Ee.current;
      Ee.current = null, de(d.query, d.startAtEnd);
    }
  }
  K(() => {
    const d = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const m = hn(
            ut.current,
            new URLSearchParams(window.location.search)
          );
          oe.current ? Ee.current = m : de(m.query, m.startAtEnd);
        } catch (m) {
          z(ze(m));
        }
    };
    return window.addEventListener("popstate", d), () => window.removeEventListener("popstate", d);
  }, [e.id]), K(() => (r(B || Q || me || !!f), () => r(!1)), [B, Q, me, !!f, r]);
  async function je(d, m, F) {
    if (d.entityType === "performerOccurrence") {
      const W = await Qn(
        d,
        Le.current,
        m,
        F
      );
      return {
        items: W.items.map((J) => ({
          key: J.key,
          video: J.video,
          occurrence: J
        })),
        totalCount: W.totalCount
      };
    }
    const D = await Kt(
      d,
      { ...d.view.filter, page: m },
      F
    );
    return {
      items: D.items.map((W) => ({ key: String(W.id), video: W })),
      totalCount: D.totalCount
    };
  }
  function be(d, m, F) {
    if (!Se.current || Ee.current) return;
    A(!0), P(vr(d.items, I.current.startFrom === "end")), ie(d.totalCount), $(F);
    const D = {
      ...I.current,
      filter: { ...I.current.filter, page: m }
    };
    I.current = D, V(D), rr(e.id, D);
  }
  K(() => {
    if (g.current) return;
    const d = new AbortController();
    b.current = d;
    const m = ++j.current;
    return Xe(!0), z(""), he(""), $(null), P([]), Ye(!1), (async () => {
      const F = jt(ut.current, I.current);
      Le.current = F.entityType === "performerOccurrence" ? await Br(F, d.signal) : null;
      let D = Number(F.view.filter.page), W = await je(F, D, d.signal);
      const J = Math.max(
        1,
        Math.ceil(W.totalCount / Number(F.view.filter.perPage))
      );
      if ((ce.current || D > J) && (D = J, W = await je(F, D, d.signal)), ce.current = !1, m !== j.current || d.signal.aborted) return;
      const fe = vr(W.items, F.view.startFrom === "end");
      be(W, D, fe[0] ?? null);
    })().catch((F) => {
      !d.signal.aborted && m === j.current && z(ze(F));
    }).finally(() => {
      !d.signal.aborted && m === j.current && (A(!0), Xe(!1));
    }), () => {
      d.abort(), j.current++;
    };
  }, [G, e.id]), K(() => {
    if (Ae(null), !T) return;
    let d = !0;
    return Oe(T).then((m) => {
      d && (Ae(m), Ze(
        e.entityType === "performerOccurrence" ? m.ids.filter((F) => e.occurrence.tagIds.includes(F)) : []
      ));
    }).catch((m) => {
      d && z(`Could not load current tags. ${ze(m)}`);
    }), () => {
      d = !1;
    };
  }, [T]), K(() => {
    if (e.entityType !== "performerOccurrence" || e.actions.length)
      return;
    let d = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (m) => [
          m,
          (await U(`/api/tags/${m}`)).name
        ]
      )
    ).then((m) => {
      d && le(Object.fromEntries(m));
    }).catch((m) => {
      d && z(ze(m));
    }), () => {
      d = !1;
    };
  }, [e]);
  async function Re() {
    if (!T) return;
    const d = h.findIndex((J) => J.key === T.key);
    if (d >= 0 && d + 1 < h.length) {
      $(h[d + 1]);
      return;
    }
    const m = new Set(h.map((J) => J.key)), F = 1100 - (Date.now() - lt.current);
    F > 0 && await new Promise((J) => window.setTimeout(J, F));
    const D = q.startFrom === "end" ? -1 : 1;
    let W = D === -1 ? Math.max(1, Fe - 1) : Fe;
    for (; Se.current && !Ee.current; ) {
      let J = await je(Ue, W);
      const fe = Math.max(
        1,
        Math.ceil(J.totalCount / Number(q.filter.perPage))
      );
      W > fe && (W = fe, J = await je(Ue, W));
      const qe = D === -1 && Fe === 1 ? void 0 : vr(J.items, D === -1).find(
        (te) => !m.has(te.key)
      );
      if (qe || (D === -1 ? W <= 1 : W >= fe)) {
        be(J, W, qe ?? null), qe || he(
          J.totalCount ? "Reached the end in this direction. Matching items remain available from the scene pages." : "No matching scenes."
        );
        return;
      }
      W += D;
    }
  }
  async function ue(d, m = !1, F = !1, D = !1) {
    if (f || !T || oe.current || Q || me && !F)
      return;
    const W = F || D || !!(d != null && d.steps.length);
    if (W && (!t || !Y)) return;
    oe.current = !0, xe(!0), z(""), he("");
    let J = !1;
    try {
      if (W) {
        const fe = await Oe(T);
        let qe;
        if (d)
          qe = await co(d), await so(Ue, T, d);
        else {
          const gt = D && e.entityType === "performerOccurrence" ? e.occurrence.tagIds.filter((Nt) => fe.ids.includes(Nt)) : pt.current, ft = ot(gt, D ? ct : Ge);
          qe = [...ft.added, ...ft.removed], await dr(Ue, T, ft);
        }
        lt.current = Date.now();
        const te = await Oe(T);
        Ae(te);
        const Ct = cr(T, fe, te, qe);
        [Ct.tags, Ct.absence].some(
          (gt) => gt.added.length || gt.removed.length
        ) && y({
          ...Ct,
          cursor: {
            query: structuredClone(q),
            items: [...h],
            total: _,
            targets: Le.current ? [...Le.current] : null
          }
        }), J = !0, Ye(!1), he("Tags saved.");
      }
      if (!Se.current || Ee.current) return;
      m ? F && requestAnimationFrame(() => {
        var fe;
        return (fe = ee.current) == null ? void 0 : fe.focus();
      }) : await Re();
    } catch (fe) {
      if (z(
        J ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${ze(fe)}` : W ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${ze(fe)}` : `Could not advance. ${ze(fe)}`
      ), W && !J) {
        lt.current = Date.now();
        try {
          Ae(await Oe(T));
        } catch {
          Ae(null), z(
            (qe) => `${qe} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Qe();
    }
  }
  async function Ke() {
    if (!(!v || oe.current || me || Q)) {
      oe.current = !0, xe(!0), z(""), he("");
      try {
        await lo(Ue, v), y(null), lt.current = Date.now();
        const d = await Oe(v.item);
        if (!Se.current || Ee.current) return;
        Ze(
          e.entityType === "performerOccurrence" ? d.ids.filter((m) => e.occurrence.tagIds.includes(m)) : []
        ), Le.current = v.cursor.targets, I.current = v.cursor.query, V(v.cursor.query), rr(e.id, v.cursor.query), P(v.cursor.items), ie(v.cursor.total), $(v.item), Ae(d), y(null), he("Latest tag operation undone. Inspecting the affected item.");
      } catch (d) {
        if (!Se.current || Ee.current) return;
        z(`Undo stopped. ${ze(d)}`), Le.current = v.cursor.targets, I.current = v.cursor.query, V(v.cursor.query), rr(e.id, v.cursor.query), P(v.cursor.items), ie(v.cursor.total), $(v.item);
        try {
          Ae(await Oe(v.item));
        } catch {
          Ae(null);
        }
      } finally {
        Qe();
      }
    }
  }
  K(() => {
    const d = (m) => {
      if (me || f || B || Q || O || m.defaultPrevented || m.repeat || m.ctrlKey || m.altKey || m.metaKey || !_n(m.target) || document.querySelector('[role="dialog"], dialog[open]'))
        return;
      const F = /^Digit[1-9]$/.test(m.code) ? m.code.slice(5) : m.key, D = e.actions.find(
        (W, J) => wt(W, J) === F
      );
      D && (m.preventDefault(), m.stopPropagation(), ue(D, m.shiftKey));
    };
    return document.addEventListener("keydown", d), () => document.removeEventListener("keydown", d);
  });
  function et() {
    !i || f || oe.current || me || (S.current = document.activeElement, N.current = {
      error: st,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(I.current),
      items: h,
      current: T,
      total: _,
      targets: Le.current
    }, p(structuredClone(jt(e, I.current))), he(""), z(""));
  }
  K(() => {
    s && s !== k.current && R && !Q && (k.current = s, et());
  }, [s, Q, R]);
  function De() {
    p(null), requestAnimationFrame(() => {
      var d;
      return (d = S.current) == null ? void 0 : d.focus();
    });
  }
  function Wt() {
    var m;
    const d = N.current;
    !d || B || ((m = b.current) == null || m.abort(), j.current++, I.current = d.query, V(d.query), P(d.items), $(d.current), ie(d.total), Le.current = d.targets, Xe(!1), z(d.error), he(""), window.history.replaceState(window.history.state, "", d.url), De());
  }
  async function tt() {
    if (!f || !i || oe.current) return;
    const d = jt(
      { ...f, name: f.name.trim() },
      I.current
    ), m = ir(d);
    if (m) {
      z(m);
      return;
    }
    oe.current = !0, xe(!0), z("");
    try {
      if (await i(d) === !1) throw new Error("Could not save review.");
      De(), he("Review saved.");
    } catch (F) {
      z(
        "Could not save review. Your edits are still open. " + ze(F)
      );
    } finally {
      Qe();
    }
  }
  const ne = q.performerScope, Je = (d) => de({
    ...I.current,
    filter: { ...I.current.filter, page: 1 },
    performerScope: { ...ne, ...d }
  });
  return /* @__PURE__ */ l(
    "section",
    {
      className: "dq-review-workspace",
      "aria-label": ne ? "Performer occurrence review" : "Video review",
      children: [
        f && /* @__PURE__ */ l("section", { className: "dq-rule-editor", "aria-label": "Edit review rule", children: [
          /* @__PURE__ */ n("h2", { children: "Edit review" }),
          /* @__PURE__ */ n("p", { children: "Preview matching scenes below. Save review keeps all rule changes; Cancel restores your previous view." }),
          /* @__PURE__ */ l("fieldset", { disabled: B, children: [
            c == null ? void 0 : c(
              jt(f, q),
              p,
              B
            ),
            /* @__PURE__ */ l("label", { children: [
              "Review direction",
              /* @__PURE__ */ l(
                "select",
                {
                  "aria-label": "Review direction",
                  value: q.startFrom,
                  onChange: (d) => de({
                    ...I.current,
                    startFrom: d.target.value
                  }),
                  children: [
                    /* @__PURE__ */ n("option", { value: "end", children: "Start from the end" }),
                    /* @__PURE__ */ n("option", { value: "beginning", children: "Start from the beginning" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ l("div", { className: "dq-row", children: [
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button primary",
                type: "button",
                disabled: B || Q,
                onClick: () => void tt(),
                children: "Save review"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button",
                type: "button",
                disabled: B,
                onClick: Wt,
                children: "Cancel"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ l(
          "fieldset",
          {
            className: "dq-review-filters",
            disabled: We,
            onClickCapture: (d) => {
              var D;
              const m = d.target instanceof Element ? d.target.closest("button") : null, F = (m == null ? void 0 : m.getAttribute("aria-label")) ?? ((D = m == null ? void 0 : m.textContent) == null ? void 0 : D.trim()) ?? "";
              m && !m.closest('[role="dialog"], dialog') && /^(Filters|Edit filter:|Edit performer criteria)/.test(F) && (ye.current = m);
            },
            children: [
              /* @__PURE__ */ n("legend", { children: "Scene filters" }),
              /* @__PURE__ */ n(
                "div",
                {
                  onKeyDownCapture: (d) => {
                    var m;
                    d.key === "Escape" && (dt.current = !1), ["Delete", "Backspace"].includes(d.key) && d.target instanceof Element && ((m = d.target.closest("button")) == null ? void 0 : m.getAttribute("aria-label")) === "Edit filter: Custom Fields" && (dt.current = !0);
                  },
                  onClickCapture: (d) => {
                    var F, D;
                    const m = d.target instanceof Element ? d.target.closest("button") : null;
                    (m == null ? void 0 : m.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((F = m == null ? void 0 : m.textContent) == null ? void 0 : F.trim()) === "Clear all" ? dt.current = !0 : (/^(Cancel|Filters)/.test(((D = m == null ? void 0 : m.textContent) == null ? void 0 : D.trim()) ?? "") || /^(Close|Dismiss)/.test((m == null ? void 0 : m.getAttribute("aria-label")) ?? "")) && (dt.current = !1);
                  },
                  children: /* @__PURE__ */ n(
                    Bt,
                    {
                      filter: q.filter,
                      objectFilter: Kr(
                        q.objectFilter,
                        Pe
                      ),
                      criteriaDefinitions: [
                        ...Vt,
                        {
                          id: "custom-fields",
                          label: "Custom Fields",
                          filterKey: "customFieldCriteria"
                        }
                      ],
                      totalCount: _,
                      sortOptions: xr,
                      showSearch: !0,
                      showSort: !0,
                      showPagingControls: !1,
                      onFilterChange: (d) => {
                        (d.sort !== I.current.filter.sort || d.direction !== I.current.filter.direction) && (d = { ...d, sorts: void 0 }), de({
                          ...I.current,
                          filter: $e(d)
                        });
                      },
                      onObjectFilterChange: (d) => {
                        const m = zn(
                          I.current.objectFilter,
                          Jn(d),
                          dt.current
                        );
                        dt.current = !1, de({
                          ...I.current,
                          objectFilter: m,
                          filter: { ...I.current.filter, page: 1 }
                        });
                      }
                    }
                  )
                }
              ),
              ne && /* @__PURE__ */ l("div", { className: "dq-scope-controls", children: [
                /* @__PURE__ */ l("label", { children: [
                  "Performers to review",
                  " ",
                  /* @__PURE__ */ l(
                    "select",
                    {
                      value: ne.targetMode,
                      onChange: (d) => Je({
                        targetMode: d.target.value
                      }),
                      children: [
                        /* @__PURE__ */ n("option", { value: "all", children: "All performers" }),
                        /* @__PURE__ */ n("option", { value: "selected", children: "Specific performers" }),
                        /* @__PURE__ */ n("option", { value: "filter", children: "Matching performer criteria" })
                      ]
                    }
                  )
                ] }),
                ne.targetMode === "selected" && /* @__PURE__ */ n(
                  it,
                  {
                    entityType: "performer",
                    values: ne.performerIds,
                    onChange: (d) => Je({ performerIds: d }),
                    placeholder: "Select performers to review...",
                    allowCreate: !1
                  }
                ),
                ne.targetMode === "filter" && /* @__PURE__ */ l(ve, { children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => pe(!0),
                      children: "Edit performer criteria"
                    }
                  ),
                  /* @__PURE__ */ n("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ n(
                    Bt,
                    {
                      filter: {},
                      onFilterChange: () => {
                      },
                      totalCount: 0,
                      sortOptions: [],
                      showSearch: !1,
                      showSort: !1,
                      showPagingControls: !1,
                      criteriaDefinitions: Er,
                      objectFilter: ne.performerFilter,
                      onObjectFilterChange: (d) => Je({ performerFilter: d })
                    }
                  ) })
                ] }),
                /* @__PURE__ */ l("label", { children: [
                  "Occurrence tags",
                  " ",
                  /* @__PURE__ */ l(
                    "select",
                    {
                      value: ne.condition,
                      onChange: (d) => Je({
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
                !["any", "isNull"].includes(ne.condition) && /* @__PURE__ */ n(
                  it,
                  {
                    entityType: "tag",
                    values: ne.conditionTagIds,
                    onChange: (d) => Je({ conditionTagIds: d }),
                    placeholder: "Occurrence condition tags...",
                    allowCreate: !1
                  }
                )
              ] }),
              !f && /* @__PURE__ */ l("div", { className: "dq-row", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    onClick: () => {
                      const d = Pr(e);
                      de(d, d.startFrom === "end");
                    },
                    children: "Reset to review defaults"
                  }
                ),
                i && /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    onClick: et,
                    children: "Save as review defaults"
                  }
                )
              ] })
            ]
          }
        ),
        ne && /* @__PURE__ */ n(
          Tn,
          {
            open: O,
            onClose: () => pe(!1),
            criteria: Er,
            activeFilter: ne.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (d) => {
              pe(!1), Je({ performerFilter: d });
            }
          }
        ),
        Ue.entityType === "performerOccurrence" && t && /* @__PURE__ */ n(
          ho,
          {
            review: Ue,
            hidden: !!f,
            disabled: We || !!f,
            onOpen: () => {
              oe.current = !0, xe(!0);
            },
            onWrite: () => {
              y(null), lt.current = Date.now();
            },
            onClose: (d) => {
              d ? (lt.current = Date.now(), new Promise((m) => window.setTimeout(m, 1100)).then(() => {
                Qe(), Se.current && re((m) => m + 1);
              })) : Qe();
            }
          }
        ),
        /* @__PURE__ */ l("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
          st && /* @__PURE__ */ l("p", { role: "alert", children: [
            st,
            " ",
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: B,
                onClick: () => {
                  T ? Oe(T).then(Ae).catch((d) => z(ze(d))) : de(I.current);
                },
                children: T ? "Reload tags" : "Retry queue"
              }
            )
          ] }),
          ke && /* @__PURE__ */ n("p", { role: "status", children: ke }),
          v && !f && /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: We,
              onClick: () => void Ke(),
              children: "Undo latest tag operation"
            }
          )
        ] }),
        /* @__PURE__ */ l("div", { className: "dq-review-layout", children: [
          /* @__PURE__ */ l("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
            /* @__PURE__ */ n("fieldset", { disabled: We, children: /* @__PURE__ */ n(
              Rn,
              {
                filter: q.filter,
                totalCount: _,
                onFilterChange: (d) => de({ ...q, filter: $e(d) })
              }
            ) }),
            /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: h.map((d) => {
              var m, F, D;
              return /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  title: `${d.occurrence ? `${d.occurrence.performer.name} — ` : ""}${d.video.title || ((m = d.video.files[0]) == null ? void 0 : m.basename) || "Scene"}`,
                  "aria-label": `${d.occurrence ? `${d.occurrence.performer.name} — ` : ""}${d.video.title || ((F = d.video.files[0]) == null ? void 0 : F.basename) || "Scene"}`,
                  disabled: We,
                  "aria-pressed": (T == null ? void 0 : T.key) === d.key,
                  onClick: () => {
                    $(d), z(""), he("");
                  },
                  children: [
                    d.occurrence && /* @__PURE__ */ n(mn, { performer: d.occurrence.performer }),
                    /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: d.video.title || ((D = d.video.files[0]) == null ? void 0 : D.basename) || "Scene" })
                  ]
                },
                d.key
              );
            }) })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-inspector", children: T ? /* @__PURE__ */ l(ve, { children: [
            /* @__PURE__ */ l("div", { className: "dq-review-media", children: [
              /* @__PURE__ */ n("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ n(
                "a",
                {
                  href: `/video/${T.video.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: T.video.title || (($t = T.video.files[0]) == null ? void 0 : $t.basename) || `Video ${T.video.id}`
                }
              ) }),
              /* @__PURE__ */ n(
                qn,
                {
                  videoId: T.video.id,
                  streamUrl: Vn(T.video.id),
                  posterUrl: Ji(T.video),
                  duration: ((rt = T.video.files[0]) == null ? void 0 : rt.duration) ?? 0,
                  format: (Qt = T.video.files[0]) == null ? void 0 : Qt.format,
                  audioCodec: (H = T.video.files[0]) == null ? void 0 : H.audioCodec,
                  extensionSurface: "quick-view",
                  showAbLoop: !0,
                  clip: T.video.parentVideoId != null ? {
                    start: T.video.clipStartSec ?? 0,
                    end: T.video.clipEndSec,
                    loop: !1
                  } : void 0
                },
                T.video.id
              )
            ] }),
            /* @__PURE__ */ l("div", { className: "dq-review-panel", children: [
              /* @__PURE__ */ n("h2", { children: T.occurrence ? `Reviewing ${T.occurrence.performer.name}` : "Reviewing this video" }),
              /* @__PURE__ */ n("p", { children: ne ? "Tags apply only to this performer in this video." : "Tags apply to the video." }),
              ne && /* @__PURE__ */ n(
                "div",
                {
                  className: "dq-review-partners",
                  "aria-label": "Matching scene partners",
                  children: h.filter((d) => d.video.id === T.video.id).map((d) => {
                    var m, F;
                    return /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button dq-partner-button",
                        title: (m = d.occurrence) == null ? void 0 : m.performer.name,
                        "aria-label": (F = d.occurrence) == null ? void 0 : F.performer.name,
                        disabled: We,
                        "aria-pressed": d.key === T.key,
                        onClick: () => {
                          $(d), z("");
                        },
                        children: d.occurrence && /* @__PURE__ */ n(
                          mn,
                          {
                            performer: d.occurrence.performer
                          }
                        )
                      },
                      d.key
                    );
                  })
                }
              ),
              /* @__PURE__ */ l("p", { children: [
                "Current ",
                ne ? "occurrence" : "video",
                " tags:",
                " ",
                Y ? Y.names.join(", ") || "None" : "Loading…"
              ] }),
              Y != null && Y.absent.length ? /* @__PURE__ */ l("p", { children: [
                "Confirmed absent tags:",
                " ",
                /* @__PURE__ */ n(
                  it,
                  {
                    entityType: "tag",
                    values: Y.absent,
                    onChange: () => {
                    },
                    disabled: !0,
                    allowCreate: !1
                  }
                )
              ] }) : null,
              me ? /* @__PURE__ */ l(
                "fieldset",
                {
                  ref: Z,
                  disabled: B,
                  className: "dq-tag-editor",
                  children: [
                    /* @__PURE__ */ l("legend", { children: [
                      "Edit ",
                      ne ? "occurrence" : "video",
                      " tags"
                    ] }),
                    /* @__PURE__ */ n(
                      it,
                      {
                        entityType: "tag",
                        values: Ge,
                        onChange: Te,
                        placeholder: "Choose tags for this item...",
                        allowCreate: !1
                      }
                    ),
                    /* @__PURE__ */ l("div", { className: "dq-row", children: [
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          disabled: !Y,
                          onClick: () => void ue(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !Y,
                          onClick: () => void ue(void 0, !1, !0),
                          children: "Save & next"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => {
                            Ye(!1), requestAnimationFrame(
                              () => {
                                var d;
                                return (d = ee.current) == null ? void 0 : d.focus();
                              }
                            );
                          },
                          children: "Cancel"
                        }
                      )
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ l(ve, { children: [
                /* @__PURE__ */ n(
                  yo,
                  {
                    actions: Me.actions,
                    canWrite: t,
                    disabled: B || Q || !Y || !!f,
                    onApply: (d, m) => void ue(d, m)
                  }
                ),
                e.entityType === "performerOccurrence" && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ l(
                  "fieldset",
                  {
                    disabled: !t || B || !Y || !!f,
                    children: [
                      /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                      e.occurrence.tagIds.map((d) => /* @__PURE__ */ l("label", { children: [
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: e.occurrence.multiple ? "checkbox" : "radio",
                            name: "legacy-choice",
                            checked: ct.includes(d),
                            onChange: (m) => Ze(
                              e.occurrence.multiple ? m.target.checked ? [...ct, d] : ct.filter(
                                (F) => F !== d
                              ) : [d]
                            )
                          }
                        ),
                        St[d] ?? "Loading tag…"
                      ] }, d)),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          onClick: () => Ze([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void ue(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void ue(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ l("div", { className: "dq-row", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ref: ee,
                    className: "dq-button",
                    disabled: We || !!f || !t || !Y,
                    onClick: () => {
                      pt.current = [...Y.ids], Te([...Y.ids]), Ye(!0);
                    },
                    children: "Edit tags"
                  }
                ),
                /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: We || !!f,
                    onClick: () => void ue(),
                    children: [
                      "Skip",
                      ne ? " performer" : " video"
                    ]
                  }
                )
              ] }),
              !t && /* @__PURE__ */ n("p", { children: "Write permission is required to change tags." })
            ] })
          ] }) : /* @__PURE__ */ n("p", { role: "status", children: Q ? "Loading review…" : _ ? "Reached the end in this direction." : "No matching scenes." }) })
        ] })
      ]
    }
  );
}
function yn({
  review: e,
  onChange: t,
  choices: r = !1
}) {
  const i = e.occurrence, s = (c) => t({ ...e, occurrence: { ...i, ...c } });
  return r ? /* @__PURE__ */ l("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ n("p", { children: "Choose the tags this review can change on the active performer’s appearance in a scene. Other tags are preserved." }),
    /* @__PURE__ */ n(
      it,
      {
        entityType: "tag",
        values: i.tagIds,
        onChange: (c) => s({ tagIds: c }),
        placeholder: "Search review tag choices...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
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
  ] }) : /* @__PURE__ */ l("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Occurrence condition (optional)" }),
    /* @__PURE__ */ n("p", { children: "Leave this unrestricted to review any appearance. Set performer matching in the review workspace and save it with the rule." }),
    /* @__PURE__ */ l("label", { children: [
      "Occurrence condition",
      /* @__PURE__ */ l(
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
    !["any", "isNull"].includes(i.condition) && /* @__PURE__ */ n(
      it,
      {
        entityType: "tag",
        values: i.conditionTagIds,
        onChange: (c) => s({ conditionTagIds: c }),
        placeholder: "Search occurrence condition tags...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("p", { children: "Conditions check exact tags on the same performer’s occurrence, independently of scene tags and the performer’s profile." })
  ] });
}
function wo(e) {
  var g, f, p;
  const [t, r] = E({}), [i, s] = E(""), c = (((g = e == null ? void 0 : e.presentation) == null ? void 0 : g.annotations) ?? []).includes("tags") ? ((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.annotationParents) ?? [] : [], o = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...c,
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return K(() => {
    let N = !0;
    return r({}), s(""), Promise.all(
      JSON.parse(o).map(
        async (S) => [S, await Ft([S])]
      )
    ).then((S) => {
      N && r(Object.fromEntries(S));
    }).catch(() => {
      N && s(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      N = !1;
    };
  }, [o]), { ids: t, error: i };
}
function vo(e, t, r) {
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
        (g) => {
          var f;
          return g !== o.id && ((f = r[g]) == null ? void 0 : f.includes(o.id));
        }
      )
    ) : []
  };
}
function So({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: s
}) {
  var g, f, p;
  const c = new Set(
    (((g = t.presentation) == null ? void 0 : g.binParents) ?? []).flatMap(
      (N) => (r[N] ?? []).filter((S) => S !== N)
    )
  ), o = /* @__PURE__ */ new Map();
  for (const N of e)
    for (const S of N.tags ?? [])
      if (c.has(S.id)) {
        const b = o.get(S.id) ?? { name: S.name, count: 0 };
        b.count++, o.set(S.id, b);
      }
  return (p = (f = t.presentation) == null ? void 0 : f.binParents) != null && p.length ? /* @__PURE__ */ l("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...o].sort((N, S) => N[1].name.localeCompare(S[1].name)).map(([N, S]) => /* @__PURE__ */ l(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => s(N),
        children: [
          S.name,
          " (",
          S.count,
          ")"
        ]
      },
      N
    )),
    !o.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function Eo(e, t) {
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
function bn({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [s, c] = E(!1), o = _e(e) === "tag" ? "tag" : "video", g = e.view.filter, f = o === "tag" ? In : xr, p = (b) => t({
    ...e,
    view: { ...e.view, filter: { ...g, ...b } }
  }), N = o === "video" ? e.presentation ?? {} : {}, S = (b) => t({ ...e, presentation: { ...N, ...b } });
  return /* @__PURE__ */ l(ve, { children: [
    i && /* @__PURE__ */ l("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ l("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(g.q ?? ""),
            onChange: (b) => p({ q: b.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ l("div", { className: "dq-field-grid", children: [
        /* @__PURE__ */ l("label", { children: [
          "Sort",
          /* @__PURE__ */ l(
            "select",
            {
              "aria-label": "Sort",
              value: String(g.sort ?? "date"),
              onChange: (b) => p({ sort: b.target.value, sorts: void 0 }),
              children: [
                !f.some((b) => b.value === g.sort) && g.sort != null && /* @__PURE__ */ n("option", { value: String(g.sort), children: String(g.sort) }),
                f.map((b) => /* @__PURE__ */ n("option", { value: b.value, children: b.label }, b.value))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ l("label", { children: [
          "Direction",
          /* @__PURE__ */ l(
            "select",
            {
              "aria-label": "Direction",
              value: String(g.direction ?? "desc"),
              onChange: (b) => p({ direction: b.target.value }),
              children: [
                /* @__PURE__ */ n("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ n("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ l("label", { children: [
          o === "tag" ? "Tags" : "Videos",
          " per page",
          /* @__PURE__ */ n(
            "input",
            {
              type: "number",
              min: "1",
              max: "1000",
              value: Number(g.perPage) || 40,
              onChange: (b) => p({
                perPage: Math.max(
                  1,
                  Math.min(1e3, Number(b.target.value) || 40)
                )
              })
            }
          )
        ] }),
        /* @__PURE__ */ l("label", { children: [
          "Start from",
          /* @__PURE__ */ l(
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
      /* @__PURE__ */ l(
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
      /* @__PURE__ */ l("p", { children: [
        Object.keys(e.view.objectFilter).length ? `${o === "tag" ? "Tag" : "Video"} filters configured` : `No ${o} filters`,
        ". Choose which ",
        o === "tag" ? "tags" : "videos",
        " enter the queue."
      ] }),
      s && /* @__PURE__ */ n("div", { onKeyDown: (b) => b.stopPropagation(), children: /* @__PURE__ */ n(
        Tn,
        {
          open: !0,
          onClose: () => c(!1),
          criteria: o === "tag" ? On : Vt,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: o === "video",
          subjectLabel: o === "tag" ? "tags" : "videos",
          onApply: (b) => {
            t({ ...e, view: { ...e.view, objectFilter: b } }), c(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ l(ve, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ l("p", { className: "dq-editor-note", children: [
        "Choose how ",
        o === "tag" ? "tags" : "videos and tags",
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ n("div", { className: "dq-field-grid", children: /* @__PURE__ */ l("label", { children: [
        "Preferred view",
        /* @__PURE__ */ n(
          "select",
          {
            value: o === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid",
            onChange: (b) => t({
              ...e,
              view: {
                ...e.view,
                displayMode: b.target.value
              }
            }),
            children: (o === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((b) => /* @__PURE__ */ n("option", { children: b }, b))
          }
        )
      ] }) }),
      o === "video" && /* @__PURE__ */ l(ve, { children: [
        /* @__PURE__ */ n("h4", { children: "Card annotations" }),
        /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((b) => {
          const R = N.annotations ?? [];
          return /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: R.includes(b),
                onChange: (A) => S({
                  annotations: A.target.checked ? [...R, b] : R.filter((k) => k !== b)
                })
              }
            ),
            b
          ] }, b);
        }) }),
        (N.annotations ?? []).includes("tags") && /* @__PURE__ */ l(ve, { children: [
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
          /* @__PURE__ */ n(
            it,
            {
              entityType: "tag",
              values: N.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (b) => S({ annotationParents: b }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ n("h4", { children: "Tag bins" }),
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ n(
          it,
          {
            entityType: "tag",
            values: N.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (b) => S({ binParents: b }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const Sr = 180, Co = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function Zn({ entityType: e }) {
  return e === "tag" ? /* @__PURE__ */ n(Ri, { role: "img", "aria-label": "Tag review" }) : /* @__PURE__ */ n(Ar, { role: "img", "aria-label": e === "performerOccurrence" ? "Performer occurrence review" : "Video review" });
}
function wn(e) {
  return _e(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function vn(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Sn() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function En(e) {
  const t = new URLSearchParams(window.location.search);
  Vr.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function No(e) {
  return $e({ ...e, page: 1 });
}
function Mr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((o, g) => Mr(o, t[g]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, s = Object.keys(r).sort(), c = Object.keys(i).sort();
  return s.length === c.length && s.every(
    (o, g) => o === c[g] && Mr(r[o], i[o])
  );
}
function ei(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Ve(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
const ti = "data-quality.workspace-layout.v1", Gr = 240, Fr = 192, $r = 560;
function ri(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min($r, Math.max(Fr, e)) : Gr;
}
function Ao() {
  try {
    const e = JSON.parse(
      localStorage.getItem(ti) ?? "null"
    );
    return ri(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return Gr;
  }
}
function To(e) {
  try {
    localStorage.setItem(
      ti,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function ni(e) {
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
function ii(e, t) {
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
function Ro(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : ii(e, t);
}
function qo({
  onNavigate: e
}) {
  const [t, r] = E([]), [i] = E(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [s, c] = E(""), [o, g] = E(!0), [f, p] = E(""), [N, S] = E(!1), [b, R] = E(!1), [A, k] = E(!1), [q, V] = E([]), [I, G] = E(""), [re, ce] = E(!0), [h, P] = E(""), [T, $] = E(""), [_, ie] = E(!1), [Q, Xe] = E(!1), [B, xe] = E(Sn), [oe, Se] = E({}), [Ee, st] = E("name"), [z, ke] = E("asc"), he = M(null), Y = M(!1), [Ae, me] = E(0), [Ye, Ge] = E(!1), [Te, pt] = E(!1), [ee, ye] = E(
    null
  ), Z = t.find((a) => a.id === B) ?? null, v = kt(
    () => (ee == null ? void 0 : ee.id) === B && Z ? { ...Z, view: ee.view } : Z,
    [ee, B, Z]
  );
  K(() => {
    const a = () => xe(Sn());
    return window.addEventListener("popstate", a), () => window.removeEventListener("popstate", a);
  }, []);
  const y = v ? _e(v) : "video", O = y === "video" ? v : null, pe = y === "tag" ? b : N, ct = kt(() => {
    const a = z === "asc" ? 1 : -1;
    return [...t].sort((u, w) => {
      if (Ee === "count") {
        const C = oe[u.id], L = oe[w.id], x = typeof C == "number", X = typeof L == "number";
        if (x !== X) return x ? -1 : 1;
        if (x && X && C !== L)
          return (C - L) * a;
      }
      return u.name.localeCompare(w.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * a;
    });
  }, [z, Ee, oe, t]), Ze = M(
    null
  ), St = wo(O), [le, Le] = E({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [lt, dt] = E({
    page: 1,
    perPage: 40
  }), [Pe, Et] = E({ items: [], totalCount: 0 }), [j, ut] = E(!1), [Me, Ue] = E(""), [ur, We] = E(!1), [Fe, de] = E(() => /* @__PURE__ */ new Set()), Qe = M(Fe);
  Qe.current = Fe;
  const je = M(/* @__PURE__ */ new Map()), [be, Re] = E(null), ue = M(be);
  ue.current = be;
  const [Ke, et] = E(!1), De = M(Ke);
  De.current = Ke;
  const Wt = M(null), [tt, ne] = E("grid"), [Je, $t] = E(Sr), [rt, Qt] = E(Ao), [H, d] = E(!1), m = M(!1), [F, D] = E(""), [W, J] = E(""), [fe, qe] = E(""), [te, Ct] = E(null), [gt, xt] = E(""), [ft, Nt] = E(!1), [Jr, zr] = E({}), [Wr, Qr] = E({}), Lt = M(/* @__PURE__ */ new Map()), Hr = M(null), Ht = M(null), At = M(0), Xt = M(0), Yt = M(null), ht = M(!1), Xr = JSON.stringify([
    ...new Set(
      (O == null ? void 0 : O.actions.flatMap(
        (a) => a.steps.flatMap((u) => u.tagIds)
      )) ?? []
    )
  ]);
  function fr(a) {
    const u = ri(a);
    Qt(u), To(u);
  }
  function si(a) {
    const u = a.shiftKey ? 40 : 16;
    let w = null;
    a.key === "ArrowLeft" && (w = rt + u), a.key === "ArrowRight" && (w = rt - u), a.key === "Home" && (w = Fr), a.key === "End" && (w = $r), w !== null && (a.preventDefault(), a.stopPropagation(), fr(w));
  }
  K(() => {
    if (!W) return;
    const a = window.setTimeout(() => J(""), 4e3);
    return () => window.clearTimeout(a);
  }, [W]), K(() => {
    const a = JSON.parse(Xr);
    if (Qr({}), !a.length) return;
    const u = new AbortController();
    let w = !0;
    return Promise.all(
      a.map(async (C) => {
        var L;
        try {
          const x = await U(`/api/tags/${C}`, {
            signal: u.signal
          });
          return [C, ((L = x.name) == null ? void 0 : L.trim()) || null];
        } catch {
          return [C, null];
        }
      })
    ).then((C) => {
      w && Qr(Object.fromEntries(C));
    }), () => {
      w = !1, u.abort();
    };
  }, [Xr]), K(() => {
    const a = O ? jr(O.view.objectFilter) : [];
    if (zr({}), !a.length) return;
    const u = new AbortController();
    let w = !0;
    return Promise.all(
      a.map(async (C) => {
        var L;
        try {
          const x = await U(`/api/tags/${C}`, {
            signal: u.signal
          });
          return (L = x.name) != null && L.trim() ? [String(C), x.name] : null;
        } catch {
          return null;
        }
      })
    ).then((C) => {
      w && zr(
        Object.fromEntries(C.filter((L) => L !== null))
      );
    }), () => {
      w = !1, u.abort();
    };
  }, [O == null ? void 0 : O.id, O == null ? void 0 : O.view.objectFilter]);
  const pr = kt(
    () => O ? Kr(
      O.view.objectFilter,
      Jr
    ) : (v == null ? void 0 : v.view.objectFilter) ?? {},
    [Jr, v, O]
  ), ci = kt(
    () => y === "video" && Array.isArray(pr.customFieldCriteria) ? [...Vt, Co] : y === "tag" ? On : Vt,
    [y, pr.customFieldCriteria]
  ), Yr = bt(async () => {
    g(!0), p("");
    try {
      const a = await Li();
      r(a.reviews), c(a.storageKey), S(a.canWriteVideos ?? a.canWrite), R(a.canWriteTags ?? !1), k(a.canReadTagGroups ?? !1), ce(a.canConfigure ?? !0), P(a.storageNotice ?? ""), B && !a.reviews.some((u) => u.id === B) && (xe(""), En(""));
    } catch (a) {
      p(
        a instanceof Error ? a.message : "Could not load reviews."
      );
    } finally {
      g(!1);
    }
  }, [B]);
  K(() => {
    if (!A) {
      V([]), G("");
      return;
    }
    const a = new AbortController();
    return G(""), Gi(a.signal).then(V).catch((u) => {
      a.signal.aborted || G(
        u instanceof Error ? u.message : "Could not load tag groups."
      );
    }), () => a.abort();
  }, [A]), K(() => {
    Yr();
  }, []), K(() => {
    if (B || t.length === 0) return;
    const a = new AbortController();
    Se({});
    for (const u of t)
      (u.entityType === "performerOccurrence" ? Br(u, a.signal).then((C) => (C == null ? void 0 : C.length) === 0 ? { items: [], totalCount: 0 } : Kt(Wn(u, C), { ...u.view.filter, page: 1, perPage: 1 }, a.signal)) : _e(u) === "tag" ? dn(
        u,
        $e({ ...u.view.filter, page: 1, perPage: 1 }),
        a.signal
      ) : Kt(
        u,
        $e({ ...u.view.filter, page: 1, perPage: 1 }),
        a.signal
      )).then((C) => {
        a.signal.aborted || Se((L) => ({
          ...L,
          [u.id]: C.totalCount
        }));
      }).catch(() => {
        a.signal.aborted || Se((C) => ({ ...C, [u.id]: null }));
      });
    return () => a.abort();
  }, [B, t]), An(() => {
    var a;
    B || o || !Y.current || (Y.current = !1, (a = he.current) == null || a.focus());
  }, [B, o]);
  const Zt = bt(async () => {
    xt("");
    try {
      Ct(await _r());
    } catch (a) {
      Ct(null), xt(
        "Tag assessment setup could not be checked. " + (a instanceof Error ? a.message : "Request failed.")
      );
    }
  }, []);
  K(() => {
    Zt();
  }, [Zt]);
  const mt = bt(
    async (a, u, w = !1) => {
      var X;
      const C = ++At.current;
      (X = Yt.current) == null || X.abort();
      const L = new AbortController();
      Yt.current = L, u = $e(u);
      const x = Number(u.page);
      w && (u = { ...u, page: 1 }), Le(u), We(w), ut(!0), Ue("");
      try {
        const ge = (Rt) => _e(a) === "tag" ? dn(
          a,
          Rt,
          L.signal
        ) : Kt(
          a,
          Rt,
          L.signal
        );
        let Ie = await ge(u);
        const He = Math.max(
          1,
          Math.ceil(Ie.totalCount / Number(u.perPage))
        ), Be = w ? He : Math.min(x, He);
        return Number(u.page) !== Be && (u = { ...u, page: Be }, Ie = await ge(u)), C === At.current && (Et(Ie), Le(u), dt(u)), Ie;
      } catch (ge) {
        throw C === At.current && Ue(
          ge instanceof Error ? ge.message : "Could not load the review queue."
        ), ge;
      } finally {
        C === At.current && ut(!1);
      }
    },
    []
  );
  K(() => {
    var u;
    if (Xt.current += 1, At.current += 1, (u = Yt.current) == null || u.abort(), Xe(!1), $(""), ie(!1), de(/* @__PURE__ */ new Set()), je.current.clear(), Re(null), et(!1), d(!1), m.current = !1, D(""), J(""), qe(""), Et({ items: [], totalCount: 0 }), !v || _e(v) !== "tag") {
      ut(!1);
      return;
    }
    let a = !0;
    return ut(!0), (async () => {
      let w = null;
      try {
        w = await Ui(s, v.id);
      } catch (x) {
        a && (ie(!0), $(
          x instanceof Error ? x.message : "Could not load progress."
        ));
      }
      if (!a) return;
      const C = (w == null ? void 0 : w.signature) === It(v) ? w : null, L = C ? $e(C.filter) : No(v.view.filter);
      Le(L), ne(
        C ? vn(C.displayMode, _e(v)) : wn(v)
      ), $t(
        C ? C.cardSize ?? Sr : Sr
      );
      try {
        const x = await mt(
          v,
          L,
          !C && v.view.startFrom !== "beginning"
        );
        if (!a) return;
        const X = an(
          x.items.map((ge) => ge.id),
          (C == null ? void 0 : C.focusedId) ?? null,
          (C == null ? void 0 : C.index) ?? 0
        );
        Re(X), Ce(X);
      } catch {
      }
      a && Xe(!0);
    })(), () => {
      var w;
      a = !1, Xt.current++, At.current++, (w = Yt.current) == null || w.abort();
    };
  }, [v == null ? void 0 : v.id]);
  const ae = kt(
    () => Pe.items.map((a) => a.id),
    [Pe.items]
  );
  K(() => {
    if (!Q || !v || !s || j || Me || H || (ee == null ? void 0 : ee.id) === v.id || _)
      return;
    const a = {
      version: 1,
      signature: It(v),
      filter: le,
      focusedId: be,
      index: Math.max(0, ae.indexOf(be ?? -1)),
      displayMode: tt,
      cardSize: Je,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        s + ":progress:" + v.id,
        JSON.stringify(a)
      );
    } catch {
    }
    if (T) return;
    let u = !0;
    const w = window.setTimeout(() => {
      ji(s, v.id, a).catch((C) => {
        u && $(
          "Progress is kept in this browser, but account sync failed. " + (C instanceof Error ? C.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      u = !1, window.clearTimeout(w);
    };
  }, [
    Q,
    s,
    v,
    j,
    Me,
    H,
    le,
    be,
    ae,
    tt,
    Je,
    ee,
    T,
    _
  ]);
  const li = Pe.items.find((a) => a.id === be) ?? null, gr = y === "video" ? li : null;
  Ke && gr && (Wt.current = gr);
  const yt = gr ?? (Ke ? Wt.current : null), di = sn(Fe, be), Zr = Fe.size > 0 ? `${Fe.size} selected ${y}${Fe.size === 1 ? "" : "s"}` : be == null ? `no ${y}` : `focused ${y}`, Ce = bt((a, u = !0) => {
    a != null && window.requestAnimationFrame(() => {
      const w = Lt.current.get(a);
      w == null || w.focus({ preventScroll: !0 }), u && (w == null || w.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  K(() => {
    Q && !De.current && Ce(ue.current);
  }, [Q, Ce]), K(() => {
    j || !ae.length || (ue.current == null || !ae.includes(ue.current)) && (Re(ae[0]), De.current || Ce(ae[0]));
  }, [Ce, ae, j]);
  const Tt = bt(
    (a) => {
      de((u) => {
        const w = a(u);
        for (const C of /* @__PURE__ */ new Set([...u, ...w]))
          u.has(C) !== w.has(C) && je.current.set(
            C,
            (je.current.get(C) ?? 0) + 1
          );
        return w;
      });
    },
    []
  ), hr = bt(
    (a) => {
      if (!ae.length) return;
      const u = Math.max(
        0,
        ae.indexOf(ue.current ?? ae[0])
      ), w = ae[Math.max(0, Math.min(ae.length - 1, u + a))];
      Re(w), De.current || Ce(w);
    },
    [Ce, ae]
  ), mr = bt(
    async (a) => {
      const u = "steps" in a ? a.steps.length > 0 : a.effect.mode !== "SKIP", w = "effect" in a && a.effect.mode === "SET_TAG_GROUP" ? a.effect.tagGroupId : null, C = w != null && (!A || !q.some((se) => se.id === w)), L = "effect" in a && u && !A, x = sn(
        Qe.current,
        ue.current
      );
      if (!v || m.current || j || Me || u && !pe || L || C || or(a) && (te == null ? void 0 : te.kind) !== "ready" || !x.length)
        return;
      const X = ++Xt.current, ge = v.id, Ie = [...ae], He = Pe, Be = ue.current, Rt = new Set(Qe.current), _t = new Map(
        x.map((se) => [se, je.current.get(se) ?? 0])
      ), qt = () => X === Xt.current && v.id === ge;
      m.current = !0, d(!0), D(
        Qe.current.size ? `${x.length} selected ${y}s` : `the focused ${y}`
      ), J(""), qe("");
      const tn = He.items.filter(
        (se) => !x.includes(se.id)
      ), wi = tn.map((se) => se.id), rn = cn(
        Ie,
        wi,
        Be,
        x.includes(Be ?? -1)
      );
      Et({
        items: tn,
        totalCount: He.totalCount
      }), de((se) => {
        const we = new Set(se);
        for (const Ne of x) we.delete(Ne);
        return we;
      }), Re(rn), De.current || Ce(rn);
      let br = !1;
      try {
        if ("effect" in a ? await to(a, x) : await Gn(a, x), br = !0, !qt()) return;
        de((se) => {
          const we = new Set(se);
          for (const Ne of x)
            (je.current.get(Ne) ?? 0) === _t.get(Ne) && we.delete(Ne);
          return we;
        }), J(
          `${a.label}: ${x.length} ${y}${x.length === 1 ? "" : "s"} ${u ? "updated" : "skipped"}.`
        );
      } catch (se) {
        if (!qt()) return;
        Et(He), de((we) => {
          const Ne = new Set(we);
          for (const nt of x)
            Rt.has(nt) && (je.current.get(nt) ?? 0) === _t.get(nt) && Ne.add(nt);
          return Ne;
        }), Re(Be), De.current || Ce(Be), qe(
          se instanceof Error ? se.message : "Action failed."
        );
      }
      try {
        if (await Qi(a), !qt()) return;
        const se = await mt(v, le);
        if (!qt()) return;
        let we = se.items.map((Ne) => Ne.id);
        if (!we.length && se.totalCount > 0 && Number(le.page) > 1) {
          const Ne = Math.max(1, Number(le.page) - 1), nt = { ...le, page: Ne };
          Le(nt), we = (await mt(v, nt)).items.map((wr) => wr.id), de(
            (wr) => new Set([...wr].filter((vi) => we.includes(vi)))
          );
          const on = we.at(-1) ?? null;
          Re(on), De.current || Ce(on);
        } else {
          de(
            (nt) => new Set([...nt].filter((nn) => we.includes(nn)))
          );
          const Ne = cn(
            Ie,
            we,
            Be,
            br && x.includes(Be ?? -1)
          );
          Re(Ne), De.current && Ne == null && et(!1), De.current || Ce(Ne);
        }
      } catch (se) {
        qt() && qe(
          (we) => `${we ? `${we} ` : ""}${br ? "The action completed, but " : ""}the queue could not be refreshed. ${se instanceof Error ? se.message : "Refresh failed."}`
        );
      } finally {
        qt() && (m.current = !1, d(!1), D(""));
      }
    },
    [
      pe,
      A,
      q,
      y,
      te,
      mt,
      le,
      Ce,
      ae,
      Pe,
      j,
      Me,
      v
    ]
  );
  function ui() {
    var w;
    if (tt === "list") return 1;
    const a = (w = Hr.current) == null ? void 0 : w.firstElementChild, u = a ? getComputedStyle(a).gridTemplateColumns : "";
    return Math.max(1, u.split(" ").filter(Boolean).length);
  }
  function fi(a) {
    if (y !== "tag" || a.defaultPrevented || a.repeat || a.ctrlKey || a.altKey || a.metaKey || Ye) return;
    if (Ke && a.key === "Escape") {
      Ve(a), et(!1), Ce(ue.current);
      return;
    }
    if (!_n(a.target)) return;
    if (a.key === "Escape") {
      Ve(a), Tt(() => /* @__PURE__ */ new Set());
      return;
    }
    const u = (v == null ? void 0 : v.actions.findIndex(
      (L, x) => wt(L, x) === a.key
    )) ?? -1;
    if (u >= 0 && (v != null && v.actions[u])) {
      Ve(a), !H && !j && mr(v.actions[u]);
      return;
    }
    if (!Ke && a.key === " ") {
      Ve(a), be != null && Tt((L) => nr(L, be));
      return;
    }
    if (!Ke && a.key.toLowerCase() === "a") {
      Ve(a), Tt(
        (L) => Mi(L, ae)
      );
      return;
    }
    if (H || j || Ke) return;
    if (a.key === "Enter" && be != null) {
      Ve(a), y === "tag" ? window.open(`/tag/${be}`, "_blank", "noopener,noreferrer") : et(!0);
      return;
    }
    const w = ui(), C = a.key === "ArrowLeft" ? -1 : a.key === "ArrowRight" ? 1 : a.key === "ArrowUp" ? -w : a.key === "ArrowDown" ? w : 0;
    C && (Ve(a), hr(C));
  }
  function Dt(a) {
    me(0), xe(a), En(a);
  }
  function pi() {
    Y.current = !0, Se({}), Dt("");
  }
  async function yr(a) {
    if (!s) return !1;
    const u = a.map(Oo);
    try {
      await _i(s, u);
    } catch (C) {
      throw C;
    }
    r(u), B && !u.some((C) => C.id === B) && Dt("");
    const w = u.find((C) => C.id === B);
    return w && Z && JSON.stringify(w) !== JSON.stringify(Z) && (w.view.displayMode !== Z.view.displayMode && ne(wn(w)), w.entityType === "tag" && It(w) !== It(Z) && (ye(null), er(
      w,
      $e({ ...w.view.filter, page: le.page })
    ))), !0;
  }
  if (o)
    return /* @__PURE__ */ n(Cn, { label: "Loading reviews…" });
  if (f)
    return /* @__PURE__ */ l(ve, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void _o().catch(
            (a) => p(
              "Could not export browser reviews. " + (a instanceof Error ? a.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        Nn,
        {
          message: f,
          onRetry: () => void Yr()
        }
      )
    ] });
  return /* @__PURE__ */ l("div", { className: "data-quality-page", onKeyDown: fi, children: [
    /* @__PURE__ */ l("header", { className: "data-quality-header", children: [
      v && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: H,
          onClick: pi,
          children: /* @__PURE__ */ n(kn, {})
        }
      ),
      /* @__PURE__ */ l("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (v == null ? void 0 : v.name) ?? "Data Quality" }),
        (v == null ? void 0 : v.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: v.description })
      ] }),
      v && Z && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: H || j || !re,
          onClick: () => {
            v.entityType !== "tag" ? me((a) => a + 1) : (pt(!0), Ge(!0));
          },
          children: /* @__PURE__ */ n(Pn, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: H || j || !re,
          onClick: () => {
            pt(!1), Ge(!0);
          },
          children: /* @__PURE__ */ n(Ni, {})
        }
      )
    ] }),
    h && /* @__PURE__ */ n("p", { className: "dq-status", children: h }),
    O && (te == null ? void 0 : te.kind) === "missing" && /* @__PURE__ */ l("div", { role: "status", className: "dq-status", children: [
      te.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: ft,
          onClick: () => {
            Nt(!0), xt(""), Xi().then(Zt).catch(
              (a) => xt(
                "Could not create the Confirmed absent tags custom field. " + (a instanceof Error ? a.message : "Request failed.")
              )
            ).finally(() => Nt(!1));
          },
          children: ft ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    O && ((te == null ? void 0 : te.kind) === "incompatible" || gt) && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(Nr, {}),
      gt || (te == null ? void 0 : te.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: ft,
          onClick: () => {
            Nt(!0), Zt().finally(
              () => Nt(!1)
            );
          },
          children: ft ? "Checking…" : "Check again"
        }
      )
    ] }),
    i && /* @__PURE__ */ l("details", { children: [
      /* @__PURE__ */ n("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ n("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const a = localStorage.getItem("page-videos") ?? "[]", u = URL.createObjectURL(
              new Blob([a], { type: "application/json" })
            ), w = document.createElement("a");
            w.href = u, w.download = "data-quality-unassigned-legacy-reviews.json", w.click(), URL.revokeObjectURL(u);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    T && /* @__PURE__ */ l("p", { role: "alert", children: [
      T,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            $(""), ie(!1);
          },
          children: _ ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    v && Z && v.entityType === "tag" && /* @__PURE__ */ l("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${H || j ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": H || j || void 0,
          inert: H || j ? !0 : void 0,
          onClickCapture: (a) => {
            var w, C, L, x, X;
            const u = a.target instanceof Element ? a.target.closest("button") : null;
            (u == null ? void 0 : u.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((w = u == null ? void 0 : u.textContent) == null ? void 0 : w.trim()) === "Clear all" ? ht.current = !0 : ((C = u == null ? void 0 : u.getAttribute("aria-label")) != null && C.startsWith("Filters") || (L = u == null ? void 0 : u.getAttribute("aria-label")) != null && L.startsWith("Edit filter:") || ((x = u == null ? void 0 : u.textContent) == null ? void 0 : x.trim()) === "Cancel" || (X = u == null ? void 0 : u.getAttribute("aria-label")) != null && X.startsWith("Close ")) && (ht.current = !1);
          },
          onKeyDownCapture: (a) => {
            var w, C;
            const u = a.target instanceof Element ? a.target.closest("button") : null;
            (a.key === "Delete" || a.key === "Backspace") && (u == null ? void 0 : u.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (a.preventDefault(), a.stopPropagation(), ht.current = !0, (C = (w = u.parentElement) == null ? void 0 : w.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || C.click()) : a.key === "Escape" && (ht.current = !1);
          },
          children: /* @__PURE__ */ n(
            Bt,
            {
              filter: Me ? lt : le,
              onFilterChange: gi,
              totalCount: Pe.totalCount,
              sortOptions: y === "tag" ? In : xr,
              showSearch: !0,
              showSort: !0,
              displayMode: tt,
              onDisplayModeChange: (a) => ne(vn(a, y)),
              availableDisplayModes: y === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (Je - 225) / 50,
              onZoomChange: (a) => $t(Math.round(225 + a * 50)),
              cardSizeEntityType: y === "tag" ? "tags" : "videos",
              criteriaDefinitions: ci,
              objectFilter: pr,
              onObjectFilterChange: (a) => {
                if (!H && !j) {
                  const u = y === "video" ? Jn(a) : a;
                  Ze.current = y === "video" ? zn(
                    v.view.objectFilter,
                    u,
                    ht.current
                  ) : u, ht.current = !1;
                }
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (ee == null ? void 0 : ee.id) === B && /* @__PURE__ */ l("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: H || j || !re,
            onClick: mi,
            children: /* @__PURE__ */ n(Ai, {})
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Reset to default review filters",
            title: "Reset to default review filters",
            disabled: H || j,
            onClick: hi,
            children: /* @__PURE__ */ n(Ti, {})
          }
        )
      ] })
    ] }),
    v ? y !== "tag" ? /* @__PURE__ */ n(bo, { review: v, canWrite: v.entityType === "performerOccurrence" ? b : N, onBusy: d, editRequest: Ae, renderRuleEditor: (a, u, w) => /* @__PURE__ */ n(oi, { workspace: !0, draft: a, entityTypeLocked: !0, tagGroups: q, saving: w, setDraft: (C) => u(C), onSave: () => {
    }, onCancel: () => {
    } }), onSaveDefaults: re ? (a) => yr(t.map((u) => u.id === a.id ? a : u)) : void 0 }, v.id) : /* @__PURE__ */ l(ve, { children: [
      O && St.error && /* @__PURE__ */ n("p", { role: "alert", children: St.error }),
      O && /* @__PURE__ */ n(
        So,
        {
          videos: Pe.items,
          review: O,
          trees: St.ids,
          disabled: H || j,
          onChoose: (a) => {
            const u = Eo(O, a);
            ye(u), er(u, { ...le, page: 1 });
          }
        }
      ),
      fe && !Ke && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(Nr, {}),
        fe
      ] }),
      W && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: W }),
      en("top"),
      /* @__PURE__ */ l(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${rt}px`
          },
          children: [
            /* @__PURE__ */ l("main", { children: [
              j && !Pe.items.length && /* @__PURE__ */ n(Cn, { label: "Loading review queue…" }),
              Me && !j && /* @__PURE__ */ n(
                Nn,
                {
                  message: Me,
                  onRetry: () => void mt(
                    v,
                    le,
                    ur
                  ).catch(() => {
                  })
                }
              ),
              !H && !j && !Me && !Pe.items.length && /* @__PURE__ */ l("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(Ar, {}),
                /* @__PURE__ */ l("p", { children: [
                  "No ",
                  y,
                  "s match this review."
                ] })
              ] }),
              !!Pe.items.length && /* @__PURE__ */ n("div", { ref: Hr, children: /* @__PURE__ */ n(
                "div",
                {
                  className: tt === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${Je}px`
                  },
                  children: Pe.items.map(bi)
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
                "aria-valuemin": Fr,
                "aria-valuemax": $r,
                "aria-valuenow": rt,
                "aria-valuetext": `${rt} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (a) => {
                  Ht.current = {
                    pointerId: a.pointerId,
                    startX: a.clientX,
                    startWidth: rt
                  }, a.currentTarget.setPointerCapture(a.pointerId);
                },
                onPointerMove: (a) => {
                  const u = Ht.current;
                  (u == null ? void 0 : u.pointerId) === a.pointerId && a.currentTarget.hasPointerCapture(a.pointerId) && fr(
                    u.startWidth + u.startX - a.clientX
                  );
                },
                onPointerUp: () => {
                  Ht.current = null;
                },
                onPointerCancel: () => {
                  Ht.current = null;
                },
                onKeyDown: si,
                onDoubleClick: () => fr(Gr),
                children: /* @__PURE__ */ n("span", {})
              }
            ),
            /* @__PURE__ */ l("aside", { className: "dq-actions", children: [
              Fe.size > 0 && /* @__PURE__ */ n("strong", { children: Zr }),
              v.actions.map((a, u) => {
                const w = "steps" in a ? a.steps.length > 0 : a.effect.mode !== "SKIP", C = "effect" in a && a.effect.mode === "SET_TAG_GROUP" ? a.effect.tagGroupId : null, L = C != null ? q.find((X) => X.id === C) : void 0, x = C != null && !L;
                return /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    disabled: H || j || !!Me || w && !pe || "effect" in a && w && (!A || x) || or(a) && (te == null ? void 0 : te.kind) !== "ready" || !di.length,
                    onClick: () => void mr(a),
                    children: [
                      /* @__PURE__ */ l("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: a.label }),
                        "effect" in a ? /* @__PURE__ */ n("small", { children: a.effect.mode === "SKIP" ? "Skip" : a.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : L ? `Assign ${L.name}` : "Unavailable tag group" }) : a.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: a.steps.flatMap(
                          (X, ge) => X.tagIds.map((Ie, He) => {
                            const Be = Wr[Ie] === void 0 ? "Tag" : Wr[Ie] ?? "Unavailable tag", Rt = ii(X, Be), _t = Ro(X, Be);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": ni(X.mode),
                                "aria-label": _t,
                                title: `Step ${ge + 1}: ${_t}`,
                                children: Rt
                              },
                              `${ge}-${Ie}-${He}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      wt(a, u) && /* @__PURE__ */ n("kbd", { children: wt(a, u) })
                    ]
                  },
                  a.id
                );
              }),
              !v.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              !pe && /* @__PURE__ */ l("p", { children: [
                y === "tag" ? "Tag" : "Video",
                " write permission is required to apply actions."
              ] }),
              y === "tag" && I && /* @__PURE__ */ l("p", { children: [
                "Tag groups are unavailable. ",
                I
              ] }),
              H && /* @__PURE__ */ l("p", { role: "status", children: [
                /* @__PURE__ */ n(Fn, { className: "dq-spin" }),
                " Applying action to",
                " ",
                F,
                "…"
              ] }),
              /* @__PURE__ */ l("p", { className: "dq-shortcuts", children: [
                "←→↑↓ move · space select · enter ",
                y === "tag" ? "open" : "preview",
                " · 1–9 apply · A toggle shown · Esc clear"
              ] })
            ] })
          ]
        }
      ),
      en("bottom")
    ] }) : t.length ? /* @__PURE__ */ l(
      "section",
      {
        className: "dq-review-browser",
        "aria-labelledby": "dq-reviews-title",
        children: [
          /* @__PURE__ */ l("div", { className: "dq-review-browser-heading", children: [
            /* @__PURE__ */ l("div", { children: [
              /* @__PURE__ */ n(
                "h2",
                {
                  id: "dq-reviews-title",
                  ref: he,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ n("p", { children: "Choose a review to open its queue." }),
              /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                (a) => oe[a.id] !== void 0
              ) ? t.some((a) => oe[a.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ l("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ l("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ l(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: Ee,
                    onChange: (a) => st(
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
                  "aria-label": z === "asc" ? "Ascending" : "Descending",
                  title: z === "asc" ? "Ascending" : "Descending",
                  onClick: () => ke(
                    (a) => a === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    Mn,
                    {
                      className: z === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: ct.map((a) => {
            const u = oe[a.id], w = _e(a), C = w === "tag" ? "tag" : w === "performerOccurrence" ? "scene" : "video";
            return /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                disabled: H,
                onClick: () => Dt(a.id),
                children: [
                  /* @__PURE__ */ l("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ l("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(Zn, { entityType: w }),
                      /* @__PURE__ */ n("strong", { children: a.name })
                    ] }),
                    /* @__PURE__ */ n(
                      "span",
                      {
                        className: "dq-review-count",
                        "aria-label": u === void 0 ? `Counting matching ${C}s` : u === null ? `Matching ${C} count unavailable` : `${u.toLocaleString()} matching ${u === 1 ? C : `${C}s`}`,
                        children: u === void 0 ? "…" : u === null ? "—" : u.toLocaleString()
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
    ) : /* @__PURE__ */ l("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(Ar, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    Ke && yt && O && /* @__PURE__ */ n(
      Fo,
      {
        video: yt,
        review: O,
        targetLabel: Zr,
        pending: H,
        refreshing: j || !!Me,
        error: fe,
        canWrite: N,
        assessmentReady: (te == null ? void 0 : te.kind) === "ready",
        selected: Fe.has(yt.id),
        hasPrevious: ae.indexOf(yt.id) > 0,
        hasNext: ae.indexOf(yt.id) >= 0 && ae.indexOf(yt.id) < ae.length - 1,
        onToggleSelected: () => Tt((a) => nr(a, yt.id)),
        onPrevious: () => hr(-1),
        onNext: () => hr(1),
        onClose: () => {
          et(!1), Ce(ue.current);
        },
        onAction: mr
      }
    ),
    Ye && /* @__PURE__ */ n(
      $o,
      {
        reviews: t,
        activeReview: Z,
        tagGroups: q,
        initialEdit: Te,
        onSave: yr,
        onChoose: Dt,
        onEditWorkspace: (a) => {
          a !== B && Dt(a), me((u) => u + 1), Ge(!1);
        },
        onClose: () => {
          Ge(!1), Te && Ce(ue.current, !1);
        }
      }
    )
  ] });
  async function er(a, u, w = !1) {
    const C = ue.current, L = Math.max(0, ae.indexOf(C ?? -1));
    try {
      const X = (await mt(a, u, w)).items.map((Ie) => Ie.id);
      de(
        (Ie) => new Set([...Ie].filter((He) => X.includes(He)))
      );
      const ge = an(X, C, L);
      Re(ge), De.current || Ce(ge, !1);
    } catch {
    }
  }
  function gi(a) {
    const u = Ze.current;
    if (Ze.current = null, H || j || !v || !Z) return;
    const w = u ?? v.view.objectFilter, C = Mr(
      w,
      Z.view.objectFilter
    ) ? Z.view.objectFilter : w, L = $e({ ...a, page: 1 }), x = {
      ...v,
      view: {
        ...v.view,
        filter: L,
        objectFilter: C
      }
    }, X = It(x) !== It(Z), ge = X ? x : Z;
    ye(X ? x : null), J(X ? "" : "Review queue defaults restored."), er(ge, L, !0);
  }
  function hi() {
    if (H || j || !Z) return;
    Ze.current = null;
    const a = $e({
      ...Z.view.filter,
      page: 1
    });
    ye(null), J("Review queue defaults restored."), er(
      Z,
      a,
      Z.view.startFrom !== "beginning"
    );
  }
  function mi() {
    H || j || !v || !Z || !re || yr(
      t.map(
        (a) => a.id === B ? {
          ...a,
          view: {
            ...v.view,
            filter: { ...le, page: 1 }
          }
        } : a
      )
    ).then(() => {
      ye(null), J("Queue saved to this review.");
    }).catch(
      (a) => qe(
        a instanceof Error ? a.message : "Could not save queue."
      )
    );
  }
  function yi() {
    de(/* @__PURE__ */ new Set()), je.current.clear(), Re(null);
  }
  function en(a) {
    return v ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: H || j,
        "aria-label": `Review queue pagination ${a}`,
        children: /* @__PURE__ */ n(
          Rn,
          {
            filter: {
              ...le,
              page: Number(le.page) || 1,
              perPage: Number(le.perPage) || 40
            },
            totalCount: Pe.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${a}`,
            onFilterChange: (u) => {
              H || j || u.page === Number(le.page) || Io(
                { ...le, page: u.page },
                v,
                mt,
                yi
              );
            }
          }
        )
      }
    ) : null;
  }
  function bi(a) {
    if (y === "tag") {
      const w = a;
      return /* @__PURE__ */ n(
        ko,
        {
          tag: w,
          displayMode: tt === "list" ? "list" : "grid",
          focused: w.id === be,
          selected: Fe.has(w.id),
          setRef: (C) => {
            C ? Lt.current.set(w.id, C) : Lt.current.delete(w.id);
          },
          onFocus: () => Re(w.id),
          onToggle: () => Tt((C) => nr(C, w.id)),
          onOpen: () => window.open(`/tag/${w.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        w.id
      );
    }
    const u = a;
    return /* @__PURE__ */ n(
      Po,
      {
        video: vo(u, O, St.ids),
        displayMode: tt,
        focused: u.id === be,
        selected: Fe.has(u.id),
        setRef: (w) => {
          w ? Lt.current.set(u.id, w) : Lt.current.delete(u.id);
        },
        onFocus: () => Re(u.id),
        onToggle: () => Tt((w) => nr(w, u.id)),
        onPreview: () => {
          Re(u.id), et(!0);
        },
        onNavigate: e
      },
      u.id
    );
  }
}
function Io(e, t, r, i) {
  i(), r(t, e).catch(() => {
  });
}
function nr(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Oo(e) {
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
  setRef: s,
  onFocus: c,
  onToggle: o,
  onOpen: g,
  onNavigate: f
}) {
  return /* @__PURE__ */ n(
    "article",
    {
      ref: s,
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${e.name}${i ? ", selected" : ""}`,
      onFocus: c,
      onClick: (p) => {
        c(), p.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        Ei,
        {
          tag: e,
          selected: i,
          onSelect: o,
          onClick: g,
          onNavigate: f
        }
      ) : /* @__PURE__ */ l("div", { className: "dq-tag-list-row", children: [
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
        /* @__PURE__ */ n("button", { type: "button", className: "dq-tag-list-name", onClick: g, children: e.name }),
        /* @__PURE__ */ n("span", { children: e.tagGroupName || "Ungrouped" }),
        /* @__PURE__ */ n("span", { children: e.description || "" }),
        /* @__PURE__ */ l("span", { children: [
          e.videoCount ?? 0,
          " videos"
        ] })
      ] })
    }
  );
}
function Po({
  video: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: s,
  onFocus: c,
  onToggle: o,
  onPreview: g,
  onNavigate: f
}) {
  const p = ei(e), N = M(null), S = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, b = !!(S.date || S.studioName), R = !!(S.performers.length || S.tags.length);
  return An(() => {
    const A = N.current;
    if (!A) return;
    const k = A.querySelector(
      `a[href="/video/${e.id}"]`
    ), q = A.querySelector(".card-title"), V = `dq-card-title-${e.id}`;
    q && (q.id = V), k && (k.target = "_blank", k.rel = "noreferrer", k.removeAttribute("aria-label"), k.setAttribute("aria-labelledby", V), k.classList.add("dq-card-link"));
    const I = A.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    I && I.setAttribute(
      "aria-label",
      i ? `Deselect ${p}` : `Select ${p}`
    );
    const G = A.querySelector(
      'button[title="Quick View"]'
    );
    G && G.setAttribute("aria-label", `Preview ${p}`);
  }), /* @__PURE__ */ l(
    "article",
    {
      ref: (A) => {
        N.current = A, s(A);
      },
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${p}${i ? ", selected" : ""}`,
      onFocus: c,
      onClick: (A) => {
        c(), A.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${t} ${b ? "has-card-metadata" : "no-card-metadata"} ${R ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          Ci,
          {
            video: S,
            selected: i,
            onSelect: o,
            onNavigate: f,
            onQuickView: g,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t === "wall" && /* @__PURE__ */ n(Mo, { video: e })
      ]
    }
  );
}
function Mo({ video: e }) {
  const t = M(null), r = M(null), [i, s] = E(!1), [c, o] = E(!1), [g, f] = E(!1);
  return K(() => {
    const p = t.current;
    if (!p || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      s(!0), o(!0);
      return;
    }
    const N = new IntersectionObserver(
      ([b]) => s(b.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), S = new IntersectionObserver(
      ([b]) => o(b.isIntersecting && b.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return N.observe(p), S.observe(p), () => {
      N.disconnect(), S.disconnect();
    };
  }, [e.id, e.files.length]), K(() => {
    if (!i) {
      f(!1);
      return;
    }
    const p = new AbortController();
    return U(Wi(e.id), {
      signal: p.signal
    }).then((N) => {
      p.signal.aborted || f(N.available === !0);
    }).catch(() => {
      p.signal.aborted || f(!1);
    }), () => p.abort();
  }, [i, e.id]), K(() => {
    const p = r.current;
    p && (c ? Promise.resolve(p.play()).catch(() => {
    }) : p.pause());
  }, [g, c]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: g && /* @__PURE__ */ n(
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
function Fo({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: s,
  error: c,
  canWrite: o,
  assessmentReady: g,
  selected: f,
  hasPrevious: p,
  hasNext: N,
  onToggleSelected: S,
  onPrevious: b,
  onNext: R,
  onClose: A,
  onAction: k
}) {
  const q = M(null), V = M(null), I = e.files[0], G = ei(e);
  K(() => {
    var P;
    const h = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (P = q.current) == null || P.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = h;
    };
  }, []);
  function re(h) {
    var $, _, ie;
    if (h.key !== "Tab") return;
    const P = [
      ...(($ = q.current) == null ? void 0 : $.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((Q) => Q.offsetParent !== null);
    if (!P.length) {
      h.preventDefault(), (_ = q.current) == null || _.focus();
      return;
    }
    const T = P.indexOf(
      document.activeElement
    );
    h.shiftKey && T <= 0 ? (h.preventDefault(), (ie = P.at(-1)) == null || ie.focus()) : !h.shiftKey && T === P.length - 1 && (h.preventDefault(), P[0].focus());
  }
  function ce(h) {
    if (h.defaultPrevented || h.ctrlKey || h.metaKey || h.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const P = h.key === "ArrowLeft" || h.key === "ArrowRight";
    if (h.altKey && !P) return;
    const T = V.current, $ = h.currentTarget.querySelector("video");
    if (h.key === "Enter" || h.key === "Escape")
      h.repeat || A();
    else if (h.key === " " && T)
      h.repeat || T.toggle();
    else if (P && T)
      T.seekBy(
        (h.key === "ArrowLeft" ? -1 : 1) * (h.shiftKey ? 5 : h.altKey ? 10 : 60)
      );
    else if ((h.key === "," || h.key === ".") && T) {
      const _ = [I == null ? void 0 : I.duration, $ == null ? void 0 : $.duration].find(
        (Q) => Q != null && Number.isFinite(Q) && Q > 0
      ) ?? 0, ie = e.parentVideoId != null ? (e.clipEndSec ?? _) - (e.clipStartSec ?? 0) : _;
      Number.isFinite(ie) && ie > 0 && T.seekBy((h.key === "," ? -1 : 1) * ie * 0.1);
    } else if (h.key.toLowerCase() === "n" || h.key.toLowerCase() === "m")
      !h.repeat && !i && !s && (h.key.toLowerCase() === "n" && p && b(), h.key.toLowerCase() === "m" && N && R());
    else if (h.key === "ArrowUp" && $)
      $.volume = Math.min(1, $.volume + 0.1);
    else if (h.key === "ArrowDown" && $)
      $.volume = Math.max(0, $.volume - 0.1);
    else return;
    Ve(h);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: q,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${G}`,
      className: "dq-preview",
      onKeyDown: re,
      onKeyDownCapture: ce,
      onMouseDown: (h) => {
        h.target === h.currentTarget && A();
      },
      children: /* @__PURE__ */ l("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ l("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !p || i || s,
              onClick: b,
              children: /* @__PURE__ */ n(kn, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !N || i || s,
              onClick: R,
              children: /* @__PURE__ */ n(Mn, {})
            }
          ),
          /* @__PURE__ */ l("div", { children: [
            /* @__PURE__ */ n("h2", { children: G }),
            /* @__PURE__ */ l("p", { children: [
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
              "aria-label": `Open ${G} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ n(qi, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: A,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n($n, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: I ? /* @__PURE__ */ n(
          qn,
          {
            autostart: !0,
            streamUrl: Vn(e.id),
            posterUrl: un(e),
            format: I.format,
            audioCodec: I.audioCodec,
            duration: I.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (h) => (V.current = h, () => {
              V.current === h && (V.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: un(e), alt: "" }) }),
        c && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: c }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((h, P) => /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            disabled: i || s || h.steps.length > 0 && !o || or(h) && !g,
            onClick: () => void k(h),
            children: [
              wt(h, P) && /* @__PURE__ */ n("kbd", { children: wt(h, P) }),
              h.label
            ]
          },
          h.id
        )) })
      ] })
    }
  );
}
function $o({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: i = !1,
  onEditWorkspace: s,
  onSave: c,
  onChoose: o,
  onClose: g
}) {
  const [f, p] = E(
    () => i && t ? structuredClone(t) : null
  ), [N, S] = E(""), [b, R] = E(!1), [A, k] = E(
    i && t != null
  ), q = M(null);
  K(() => {
    var T, $;
    const h = document.activeElement, P = document.body.style.overflow;
    return document.body.style.overflow = "hidden", ($ = (T = q.current) == null ? void 0 : T.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || $.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = P, h == null || h.focus({ preventScroll: !0 });
    };
  }, []);
  function V(h) {
    var $, _, ie;
    if (h.defaultPrevented) {
      h.stopPropagation();
      return;
    }
    if (h.key === "Escape") {
      Ve(h), b || g();
      return;
    }
    if (h.key !== "Tab") {
      h.stopPropagation();
      return;
    }
    const P = [
      ...(($ = q.current) == null ? void 0 : $.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((Q) => Q.offsetParent !== null);
    if (!P.length) {
      Ve(h), (_ = q.current) == null || _.focus();
      return;
    }
    const T = P.indexOf(
      document.activeElement
    );
    h.shiftKey && T <= 0 ? (Ve(h), (ie = P.at(-1)) == null || ie.focus()) : !h.shiftKey && T === P.length - 1 ? (Ve(h), P[0].focus()) : h.stopPropagation();
  }
  function I(h, P = !!h) {
    k(P), p(
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
  async function G() {
    if (b) return;
    if (!f || ir(f)) {
      S(f ? ir(f) : "Choose a review.");
      return;
    }
    const h = { ...f, name: f.name.trim() }, P = e.some((T) => T.id === h.id) ? e.map((T) => T.id === h.id ? h : T) : [...e, h];
    R(!0), S("");
    try {
      if (!await c(P)) throw new Error("Could not save reviews.");
      h.entityType !== "tag" ? s(h.id) : (o(h.id), g());
    } catch (T) {
      S(
        "Could not save reviews. Your edits are still open. " + (T instanceof Error ? T.message : "Retry saving.")
      );
    } finally {
      R(!1);
    }
  }
  async function re(h) {
    if (!b) {
      R(!0), S("");
      try {
        if (!await c(h)) throw new Error("Could not save reviews.");
      } catch (P) {
        S(
          P instanceof Error ? P.message : "Could not save reviews."
        );
      } finally {
        R(!1);
      }
    }
  }
  async function ce(h) {
    var T;
    if (b) return;
    const P = (T = h.target.files) == null ? void 0 : T[0];
    if (h.target.value = "", !!P) {
      if (P.size > 2e6) {
        S("Review files must be smaller than 2 MB.");
        return;
      }
      R(!0), S("");
      try {
        const $ = Jt(await P.text());
        if (!await c(Tr(e, $)))
          throw new Error("Could not save reviews.");
      } catch ($) {
        S(
          $ instanceof Error ? $.message : "Could not import reviews."
        );
      } finally {
        R(!1);
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
      onKeyDown: V,
      children: /* @__PURE__ */ l("div", { className: "dq-manager", children: [
        /* @__PURE__ */ l("header", { children: [
          /* @__PURE__ */ l("div", { children: [
            /* @__PURE__ */ n("h2", { children: f ? e.some((h) => h.id === f.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: b,
              onClick: g,
              children: /* @__PURE__ */ n($n, {})
            }
          )
        ] }),
        N && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: N }),
        /* @__PURE__ */ n("fieldset", { disabled: b, className: "dq-manager-content", children: f ? /* @__PURE__ */ n(
          oi,
          {
            setup: f.entityType !== "tag",
            draft: f,
            entityTypeLocked: A,
            tagGroups: r,
            saving: b,
            setDraft: p,
            onSave: () => void G(),
            onCancel: g
          }
        ) : /* @__PURE__ */ l(ve, { children: [
          /* @__PURE__ */ l("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: () => {
              const h = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), P = document.createElement("a");
              P.href = h, P.download = "data-quality-reviews.json", P.click(), URL.revokeObjectURL(h);
            }, children: "Export reviews" }),
            /* @__PURE__ */ l(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => I(),
                children: [
                  /* @__PURE__ */ n(Ii, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ l("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(Oi, {}),
              " Import reviews",
              /* @__PURE__ */ n(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: ce
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((h) => /* @__PURE__ */ l("article", { children: [
            /* @__PURE__ */ l("div", { children: [
              /* @__PURE__ */ l("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(Zn, { entityType: _e(h) }),
                /* @__PURE__ */ n("strong", { children: h.name })
              ] }),
              /* @__PURE__ */ n("p", { children: h.description || "No description" })
            ] }),
            /* @__PURE__ */ l("button", { type: "button", onClick: () => h.entityType === "tag" ? I(h) : s(h.id), children: [
              /* @__PURE__ */ n(Pn, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => I({
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
                  window.confirm(`Delete review “${h.name}”?`) && re(
                    e.filter((P) => P.id !== h.id)
                  );
                },
                children: /* @__PURE__ */ n(xn, {})
              }
            )
          ] }, h.id)) })
        ] }) })
      ] })
    }
  );
}
function oi({
  workspace: e = !1,
  setup: t = !1,
  draft: r,
  entityTypeLocked: i,
  tagGroups: s,
  saving: c = !1,
  setDraft: o,
  onSave: g,
  onCancel: f
}) {
  const [p, N] = E("Review"), S = _e(r), b = (k) => {
    if (!(i || k === S)) {
      if (k === "performerOccurrence") {
        o({
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
      o(
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
  }, R = M(/* @__PURE__ */ new WeakMap()), A = (k) => {
    let q = R.current.get(k);
    return q || (q = crypto.randomUUID(), R.current.set(k, q)), q;
  };
  return /* @__PURE__ */ l("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      Si,
      {
        tabs: (t ? ["Review"] : e ? ["Review", "Actions", ...S === "performerOccurrence" ? ["Tag choices"] : []] : S === "performerOccurrence" ? ["Review", "Queue", "Actions", ...r.occurrence.tagIds.length ? ["Tag choices"] : []] : ["Review", "Queue", "Appearance", "Actions"]).map((k) => ({
          key: k,
          label: k,
          count: k === "Actions" ? r.actions.length : void 0,
          disabled: c
        })),
        activeTab: p,
        onTabChange: N
      }
    ) }),
    /* @__PURE__ */ l("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ l("section", { hidden: p !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ l("label", { children: [
          "Entity type",
          /* @__PURE__ */ l(
            "select",
            {
              "aria-label": "Entity type",
              value: S,
              disabled: i,
              onChange: (k) => b(k.target.value),
              children: [
                /* @__PURE__ */ n("option", { value: "video", children: "Videos" }),
                /* @__PURE__ */ n("option", { value: "tag", children: "Tags" }),
                /* @__PURE__ */ n("option", { value: "performerOccurrence", children: "Performer occurrence tags" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ l("label", { children: [
          "Review name",
          /* @__PURE__ */ n(
            "input",
            {
              autoFocus: !0,
              "aria-label": "Review name",
              value: r.name,
              onChange: (k) => o({ ...r, name: k.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ l("label", { children: [
          "Description",
          /* @__PURE__ */ n(
            "textarea",
            {
              "aria-label": "Description",
              value: r.description,
              onChange: (k) => o({ ...r, description: k.target.value })
            }
          )
        ] })
      ] }),
      !e && !t && /* @__PURE__ */ l("section", { hidden: p !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ n(bn, { draft: r, onChange: o, presentation: !1 }),
        r.entityType === "performerOccurrence" && /* @__PURE__ */ n(yn, { review: r, onChange: o })
      ] }),
      !t && r.entityType === "performerOccurrence" && /* @__PURE__ */ n("section", { hidden: p !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n(yn, { review: r, onChange: o, choices: !0 }) }),
      !e && !t && /* @__PURE__ */ n("section", { hidden: p !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(bn, { draft: r, onChange: o, queue: !1 }) }),
      !t && /* @__PURE__ */ n("section", { hidden: p !== "Actions", className: "dq-editor-section", children: S === "tag" ? /* @__PURE__ */ n(
        Lo,
        {
          draft: r,
          saving: c,
          tagGroups: s,
          setDraft: o
        }
      ) : /* @__PURE__ */ n(
        xo,
        {
          draft: r,
          saving: c,
          stepKey: A,
          rememberStepKey: (k, q) => R.current.set(k, A(q)),
          setDraft: o
        }
      ) })
    ] }),
    !e && /* @__PURE__ */ l("div", { className: "dq-editor-footer", children: [
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
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: g, children: t ? "Create & configure" : "Save review" })
    ] })
  ] });
}
function ai({
  action: e,
  index: t,
  onChange: r
}) {
  return /* @__PURE__ */ l("div", { className: "dq-field-grid", children: [
    /* @__PURE__ */ l("label", { children: [
      "Shortcut",
      /* @__PURE__ */ l(
        "select",
        {
          value: e.shortcut ?? "auto",
          onChange: (i) => r({
            ...e,
            shortcut: i.target.value === "auto" ? void 0 : i.target.value
          }),
          children: [
            /* @__PURE__ */ l("option", { value: "auto", children: [
              "Position (",
              t < 9 ? t + 1 : "none",
              ")"
            ] }),
            /* @__PURE__ */ n("option", { value: "", children: "None" }),
            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => /* @__PURE__ */ n("option", { value: i, children: i }, i))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ l("label", { children: [
      "Button label",
      /* @__PURE__ */ n(
        "input",
        {
          value: e.label,
          onChange: (i) => r({ ...e, label: i.target.value })
        }
      )
    ] })
  ] });
}
function xo({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: i,
  setDraft: s
}) {
  const c = (o, g) => s({
    ...e,
    actions: e.actions.map(
      (f, p) => p === o ? g : f
    )
  });
  return /* @__PURE__ */ l(ve, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    e.entityType === "performerOccurrence" && /* @__PURE__ */ n("p", { children: "Actions apply only to the active performer in this scene. Set performer matching in the review filters below. Save review keeps those criteria with this rule." }),
    /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      Cr,
      {
        items: e.actions,
        getKey: (o) => o.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (o) => s({ ...e, actions: o }),
        renderItem: (o, { index: g, dragHandleProps: f, isOver: p }) => /* @__PURE__ */ l(
          "fieldset",
          {
            className: p ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ l("legend", { children: [
                "Action ",
                g + 1
              ] }),
              /* @__PURE__ */ l("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...f,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${g + 1}`,
                    children: /* @__PURE__ */ n(Lr, {})
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
                        ...e.actions.slice(0, g + 1),
                        {
                          ...structuredClone(o),
                          id: crypto.randomUUID(),
                          label: o.label + " copy",
                          shortcut: ""
                        },
                        ...e.actions.slice(g + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                ai,
                {
                  action: o,
                  index: g,
                  onChange: (N) => c(g, N)
                }
              ),
              /* @__PURE__ */ n(
                Cr,
                {
                  items: o.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (N) => c(g, { ...o, steps: N }),
                  renderItem: (N, S) => /* @__PURE__ */ n(
                    Do,
                    {
                      occurrence: e.entityType === "performerOccurrence",
                      dragHandleProps: S.dragHandleProps,
                      saving: t,
                      isOver: S.isOver,
                      step: N,
                      index: S.index,
                      onChange: (b) => {
                        i(b, N), c(g, {
                          ...o,
                          steps: o.steps.map(
                            (R, A) => A === S.index ? b : R
                          )
                        });
                      },
                      onRemove: () => c(g, {
                        ...o,
                        steps: o.steps.filter(
                          (b, R) => R !== S.index
                        )
                      })
                    }
                  )
                }
              ),
              /* @__PURE__ */ l("div", { className: "dq-row", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    className: "dq-button",
                    type: "button",
                    onClick: () => c(g, {
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
                        (N, S) => S !== g
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
function Lo({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: i
}) {
  const s = (c, o) => i({
    ...e,
    actions: e.actions.map(
      (g, f) => f === c ? o : g
    )
  });
  return /* @__PURE__ */ l(ve, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      Cr,
      {
        items: e.actions,
        getKey: (c) => c.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (c) => i({ ...e, actions: c }),
        renderItem: (c, { index: o, dragHandleProps: g, isOver: f }) => /* @__PURE__ */ l(
          "fieldset",
          {
            className: f ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ l("legend", { children: [
                "Action ",
                o + 1
              ] }),
              /* @__PURE__ */ l("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...g,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${o + 1}`,
                    children: /* @__PURE__ */ n(Lr, {})
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
                          label: c.label + " copy",
                          shortcut: ""
                        },
                        ...e.actions.slice(o + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                ai,
                {
                  action: c,
                  index: o,
                  onChange: (p) => s(o, p)
                }
              ),
              /* @__PURE__ */ l("label", { children: [
                "Action effect",
                /* @__PURE__ */ l(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: c.effect.mode === "SET_TAG_GROUP" ? `group:${c.effect.tagGroupId}` : c.effect.mode,
                    onChange: (p) => {
                      const N = p.target.value;
                      s(o, {
                        ...c,
                        effect: N === "SKIP" ? { mode: "SKIP" } : N === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : {
                          mode: "SET_TAG_GROUP",
                          tagGroupId: Number(N.slice(6))
                        }
                      });
                    },
                    children: [
                      /* @__PURE__ */ n("option", { value: "SKIP", children: "Skip" }),
                      /* @__PURE__ */ n("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
                      c.effect.mode === "SET_TAG_GROUP" && !r.some(
                        (p) => p.id === c.effect.tagGroupId
                      ) && /* @__PURE__ */ n(
                        "option",
                        {
                          value: `group:${c.effect.tagGroupId}`,
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
                      (p, N) => N !== o
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
function Do({
  occurrence: e = !1,
  step: t,
  index: r,
  dragHandleProps: i,
  saving: s,
  isOver: c,
  onChange: o,
  onRemove: g
}) {
  const f = ni(t.mode);
  return /* @__PURE__ */ l(
    "div",
    {
      className: c ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": f,
      children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            ...i,
            disabled: s,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${r + 1}`,
            children: /* @__PURE__ */ n(Lr, {})
          }
        ),
        /* @__PURE__ */ l("span", { children: [
          "Step ",
          r + 1
        ] }),
        /* @__PURE__ */ l(
          "select",
          {
            "aria-label": "Tag operation",
            value: t.mode,
            onChange: (p) => o({ ...t, mode: p.target.value }),
            children: [
              /* @__PURE__ */ n("option", { value: "ADD", children: "Add tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE", children: "Remove tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE_TREE", children: "Remove tags and descendants" }),
              !e && /* @__PURE__ */ l(ve, { children: [
                /* @__PURE__ */ n("option", { value: "MARK_PRESENT", children: "Mark present" }),
                /* @__PURE__ */ n("option", { value: "MARK_ABSENT", children: "Mark absent" }),
                /* @__PURE__ */ n("option", { value: "CLEAR_ABSENCE", children: "Clear absence" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ n("div", { className: "dq-step-tags", children: /* @__PURE__ */ n(
          it,
          {
            entityType: "tag",
            values: t.tagIds,
            onChange: (p) => o({ ...t, tagIds: p }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: g, children: /* @__PURE__ */ n(xn, {}) })
      ]
    }
  );
}
async function _o() {
  const e = await U("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
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
function Cn({ label: e }) {
  return /* @__PURE__ */ l("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(Fn, { className: "dq-spin" }),
    e
  ] });
}
function Nn({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ l("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(Nr, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const Go = { components: { DataQualityPage: qo } };
export {
  qo as DataQualityPage,
  Go as default,
  Mr as objectFiltersEqual
};
