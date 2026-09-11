import { jsxs as u, jsx as n, Fragment as Pe } from "react/jsx-runtime";
import { useRef as M, useState as E, useMemo as Et, useEffect as Q, useCallback as St, useLayoutEffect as Cn } from "react";
import { DetailListToolbar as Ir, VIDEO_SORT_OPTIONS as Ur, VIDEO_CRITERIA as fr, EntityReferenceMultiSelector as et, PERFORMER_CRITERIA as sn, FilterDialog as Nn, DetailListPagination as An, VideoPlayer as Tn, TAG_SORT_OPTIONS as Rn, TAG_CRITERIA as qn, EntityDetailTabs as vi, TagTile as Si, VideoCard as Ei, SortableList as Or } from "@cove/runtime/components";
import { Save as kn, ChevronLeft as In, Pencil as On, Settings as Ci, AlertTriangle as Pr, RotateCcw as Ni, ChevronRight as Pn, Film as Mr, Loader2 as Mn, Tags as Ai, ExternalLink as Ti, X as Fn, Plus as Ri, Upload as qi, Trash2 as $n, GripVertical as jr } from "@cove/runtime/lucide-react";
import { extensionFetch as ki } from "@cove/runtime/api";
function Se(e) {
  return e.entityType ?? "video";
}
function lt(e, t) {
  return "qwertyuiop"[t] ?? "";
}
function pr(e) {
  if (e.entityType === "performerOccurrence") {
    if (!xn(e.occurrence))
      return "Complete the optional occurrence condition before saving.";
    if (e.actions.some((t) => t.steps.some((r) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(r.mode))))
      return "Occurrence actions support adding and removing tags on the active performer. Video tag assessments are not supported here.";
  }
  return Se(e) === "video" && e.actions.some(
    (t) => Ln(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => Dt(t, Se(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
function Oe(e) {
  const t = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(1e3, t(e.perPage, 40)))
  };
}
function ln(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function st(e) {
  const { page: t, ...r } = e.view.filter, i = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    e.entityType === "performerOccurrence" ? ["performerOccurrence", ...i, e.occurrence] : Se(e) === "tag" ? ["tag", ...i] : i
  );
}
function Dt(e, t) {
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
  ) && !Ln(e) : !1;
}
function gr(e) {
  return "steps" in e ? e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  ) : !1;
}
function Ln(e) {
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
function er(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || r.entityType === "video" || r.entityType === "tag" || r.entityType === "performerOccurrence") && (r.entityType !== "performerOccurrence" || xn(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && (r.view.reviewMode === void 0 || ["single", "multiple"].includes(r.view.reviewMode)) && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Ii(r.presentation, r.entityType === "tag") && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (r.entityType === "tag" ? "effect" in i && !("steps" in i) && Dt(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (a) => a && Array.isArray(a.tagIds)
      ) && Dt(i, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => pr(r)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Ii(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const r = e;
  return (r.cardSize === void 0 || r.cardSize === null || Number.isFinite(r.cardSize) && r.cardSize >= 115 && r.cardSize <= 380) && (!t || r.annotations === void 0 && r.annotationParents === void 0 && r.binParents === void 0) && (r.annotations === void 0 || Array.isArray(r.annotations) && r.annotations.every(
    (i) => ["date", "studio", "performers", "tags"].includes(i)
  )) && [r.annotationParents, r.binParents].every(
    (i) => i === void 0 || Array.isArray(i) && i.every((a) => Number.isSafeInteger(a) && a > 0)
  );
}
function Fr(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const a of i)
      r.has(a.id) || (r.add(a.id), t.push(a));
  return t;
}
function xn(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (i) => Array.isArray(i) && i.every((a) => Number.isSafeInteger(a) && a > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && (t.targetMode !== "selected" || t.performerIds.length > 0) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && ["any", "includes", "includesAll", "excludes", "isNull"].includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && r(t.tagIds) && typeof t.multiple == "boolean";
}
function cn(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function dn(e, t, r, i) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!i && t.includes(r)) return r;
  const a = Math.max(0, e.indexOf(r));
  if (i) {
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
function Oi(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((a) => r.has(a));
  for (const a of t)
    i ? r.delete(a) : r.add(a);
  return r;
}
function _n(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const Dn = "ext:com.midnightrider.data-quality:configuration", Pi = "ext:cove-data-quality:video-reviews", $r = "ext:com.midnightrider.data-quality:progress", tr = /* @__PURE__ */ new Map(), dr = /* @__PURE__ */ new Map(), xt = (e, t) => e.includes("*") || e.includes(t), mr = (e) => K(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Mi = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Lr(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function _t(e) {
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
    reviews: er(JSON.stringify(t.reviews)),
    deletedIds: Lr(t.deletedIds),
    importedIds: Lr(t.importedIds)
  };
}
function Fi(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const a of t) {
    const c = localStorage.getItem(a);
    if (c !== null) {
      const l = er(c);
      r ?? (r = l), l.forEach((g) => i.add(g.id));
    }
    Lr(
      JSON.parse(localStorage.getItem(`${a}:account-imports`) ?? "[]")
    ).forEach((l) => i.add(l));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function Un(e) {
  const t = await K("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function jn(e, t) {
  const r = (dr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return dr.set(e, r), r.finally(() => {
    dr.get(e) === r && dr.delete(e);
  }).catch(() => {
  }), r;
}
let zt = null;
function $i() {
  if (zt) return zt;
  const e = Li();
  return zt = e, e.finally(() => {
    zt === e && (zt = null);
  }).catch(() => {
  }), e;
}
async function Li() {
  var b;
  const e = await K("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = xt(e.permissions, "savedfilters.read"), a = i && xt(e.permissions, "savedfilters.write"), c = i ? (await mr(Dn)).filter((I) => I.name === "Data Quality configuration").sort((I, O) => I.id - O.id) : [];
  if (c.length > 1) {
    const I = (O) => {
      const { revision: R, ...q } = _t(O.uiOptions);
      return JSON.stringify(q);
    };
    if (c.some((O) => I(O) !== I(c[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (a)
      for (const O of c.slice(1))
        await K(`/api/savedfilters/${O.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${O.id}` })
        });
    c.splice(1);
  }
  let l = c.length ? _t(c[0].uiOptions) : Mi();
  const g = localStorage.getItem(`${r}:migrated`) === "true", m = localStorage.getItem(r), h = localStorage.getItem(`${r}:local-only`) === "true";
  !c.length && m && (l = _t(m));
  let v = !c.length;
  if (c.length && h && m) {
    const I = _t(m);
    if (I.reviews.some((R) => {
      const q = l.reviews.find((D) => D.id === R.id);
      return q && JSON.stringify(q) !== JSON.stringify(R);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const O = [
      .../* @__PURE__ */ new Set([...l.deletedIds, ...I.deletedIds])
    ];
    l = {
      ...l,
      reviews: Fr(l.reviews, I.reviews).filter(
        (R) => !O.includes(R.id)
      ),
      deletedIds: O,
      importedIds: [
        .../* @__PURE__ */ new Set([...l.importedIds, ...I.importedIds])
      ]
    }, v = !0;
  }
  if (!g) {
    const I = JSON.stringify(l), O = Fi(t);
    if (c.length && O.reviews.some((A) => {
      const te = l.reviews.find((X) => X.id === A.id);
      return te && JSON.stringify(te) !== JSON.stringify(A);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const R = i ? (await mr(Pi)).flatMap(
      (A) => er(A.uiOptions ?? "[]")
    ) : [], q = O.known.filter(
      (A) => !O.reviews.some((te) => te.id === A)
    ), D = /* @__PURE__ */ new Set([...l.deletedIds, ...q]);
    l = {
      ...l,
      reviews: Fr(
        O.reviews,
        l.reviews,
        R.filter(
          (A) => !O.known.includes(A.id) && !l.importedIds.includes(A.id)
        )
      ).filter((A) => !D.has(A.id)),
      deletedIds: [...D],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...l.importedIds,
          ...O.known,
          ...R.map((A) => A.id)
        ])
      ]
    }, v || (v = JSON.stringify(l) !== I);
  }
  const C = {
    userId: t,
    recordId: (b = c[0]) == null ? void 0 : b.id,
    config: l,
    readable: i,
    writable: a,
    durable: a
  };
  if (tr.set(r, C), v && a) {
    const I = l;
    c.length && (C.config = _t(c[0].uiOptions)), await Kn(r, I), l = C.config;
  } else c.length || (localStorage.setItem(r, JSON.stringify(l)), !i && (!g || h) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (a)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: l.reviews,
    storageKey: r,
    canWrite: xt(e.permissions, "videos.write"),
    canWriteVideos: xt(e.permissions, "videos.write"),
    canWriteTags: xt(e.permissions, "tags.write"),
    canReadTagGroups: xt(e.permissions, "taggroups.read"),
    canConfigure: !i || a,
    storageNotice: i ? a ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Kn(e, t) {
  const r = tr.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await Un(r), r.recordId != null) {
      const c = await K(
        `/api/savedfilters/${r.recordId}`
      );
      if (_t(c.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const a = await K(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Dn,
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
function xi(e, t) {
  return er(JSON.stringify(t)), jn(e, async () => {
    const r = tr.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((a) => !t.some((c) => c.id === a.id)).map((a) => a.id);
    await Kn(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((a) => !t.some((c) => c.id === a))
    });
  });
}
function un(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([r, i]) => /^[1-9]\d*:[1-9]\d*$/.test(r) && ["reviewed", "cannotDetermine"].includes(String(i)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function _i(e, t) {
  const r = tr.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), a = i ? un(i) : null;
  if (!r.readable) return a;
  const c = (await mr($r)).find(
    (g) => g.name === t
  ), l = c ? un(c.uiOptions) : null;
  return a && (!l || a.updatedAt > l.updatedAt) ? a : l;
}
function Di(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return jn(i, async () => {
    const a = tr.get(e);
    if (!(a != null && a.writable)) return;
    await Un(a);
    const c = (await mr($r)).find(
      (l) => l.name === t
    );
    await K(
      c ? `/api/savedfilters/${c.id}` : "/api/savedfilters",
      {
        method: c ? "PUT" : "POST",
        body: JSON.stringify({
          mode: $r,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Nt = "confirmed_absent_tags", Kr = "Confirmed absent tags", Ui = {
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
function Ut(e) {
  return Array.isArray(e) ? e.map(Ut) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? Ui[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === Nt.toLowerCase() ? r.toLowerCase() : Ut(r)
    ])
  ) : e;
}
async function K(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await ki(e, { ...t, headers: r });
  if (!i.ok) {
    let c = i.statusText || `Request failed (${i.status}).`;
    try {
      const l = await i.json();
      c = l.message || l.detail || l.error || c;
    } catch {
    }
    throw new Error(c);
  }
  if (i.status === 204 || i.status === 205) return;
  const a = await i.text();
  return a ? JSON.parse(a) : void 0;
}
const ji = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Ki = 0;
function Vr(e) {
  return K(`/api/videos/${e}?dqRead=${ji}-${++Ki}`, { cache: "no-store" });
}
async function Xt(e, t, r) {
  const i = { ...e.view.objectFilter }, a = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return K("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Ut({
        findFilter: Oe(t),
        objectFilter: i,
        filterExpression: a
      })
    )
  });
}
async function fn(e, t, r) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, K("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Ut({
        findFilter: Oe(t),
        objectFilter: i
      })
    )
  });
}
function Vi(e) {
  return K("/api/taggroups", { signal: e });
}
function Gi(e) {
  return `/api/videos/${e.id}/image?max=1280&v=${encodeURIComponent(e.updatedAt)}`;
}
function Vn(e) {
  return `/api/stream/video/${e}`;
}
function pn(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Bi(e) {
  return `/api/stream/video/${e}/preview`;
}
function Ji(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Qi(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function rr(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const i of e) {
    await K(`/api/tags/${i}`, { signal: t }), r.add(i);
    for (let a = 1; ; a++) {
      const c = await K("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Ut({
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
      for (const l of c.items) r.add(l.id);
      if (a * 1e3 >= c.totalCount) break;
      if (!c.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...r];
}
function Wi(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${Nt} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function Gr() {
  const t = (await K("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === Nt.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${Kr} custom field before applying tag assessments.`
    };
  const r = Wi(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function zi() {
  const e = await Gr();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await K("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: Nt,
        label: Kr,
        type: "tag",
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function hr(e) {
  return [...new Set(e)];
}
function Hi(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${Nt} value is not a valid tag list.`
    );
  return hr(e);
}
function Xi(e) {
  return hr(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function Yi(e, t) {
  let r;
  try {
    r = await Gr();
  } catch (h) {
    throw new Error(
      `Could not verify the ${Kr} custom field. ${h instanceof Error ? h.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const i = await Promise.all(
    e.steps.map(async (h) => ({
      ...h,
      tagIds: h.mode === "REMOVE_TREE" ? await rr(h.tagIds) : hr(h.tagIds)
    }))
  ), a = i.filter(
    (h) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(h.mode)
  ), c = i.filter(
    (h) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(h.mode)
  ), l = hr(t), g = r.definition.key;
  let m = 0;
  for (const h of l)
    try {
      const v = await Vr(h), C = Xi(v), b = { ...v.customFields ?? {} }, I = b[g], O = Hi(I), R = new Set(C), q = new Set(O);
      for (const X of a)
        for (const re of X.tagIds)
          X.mode === "ADD" ? R.add(re) : R.delete(re);
      for (const X of c)
        for (const re of X.tagIds)
          X.mode === "MARK_PRESENT" ? (R.add(re), q.delete(re)) : X.mode === "MARK_ABSENT" ? (R.delete(re), q.add(re)) : q.delete(re);
      const D = [...R], A = [...q];
      JSON.stringify(C) === JSON.stringify(D) && JSON.stringify(O) === JSON.stringify(A) && (I === void 0 ? A.length === 0 : JSON.stringify(I) === JSON.stringify(O)) || await K(`/api/videos/${h}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: D,
          customFields: {
            ...b,
            [g]: A
          }
        })
      }), m++;
    } catch (v) {
      throw new Error(
        `Assessment stopped after ${m} video${m === 1 ? "" : "s"} completed; video ${h} was affected. Refresh and inspect it before retrying. ${v instanceof Error ? v.message : "Request failed."}`
      );
    }
}
async function Gn(e, t) {
  if (!Dt(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (gr(e)) {
    await Yi(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (i) => ({
      mode: i.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: i.mode === "REMOVE_TREE" ? await rr(i.tagIds) : i.tagIds
    }))
  );
  for (let i = 0; i < r.length; i++)
    try {
      await K("/api/videos/bulk", {
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
async function Zi(e, t) {
  if (!Dt(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await K("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
async function eo(e, t, r) {
  if (!Dt(r) || r.steps.some(
    (c) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(c.mode)
  ))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const i = await Promise.all(
    r.steps.map(async (c) => ({
      ...c,
      tagIds: c.mode === "REMOVE_TREE" ? await rr(c.tagIds) : c.tagIds
    }))
  );
  let a = t.applications;
  for (const c of i)
    a = await Qn(
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
async function Bn(e, t) {
  const r = e.occurrence;
  if (r.targetMode === "all" || r.targetMode === "filter" && Object.keys(r.performerFilter).length === 0) return null;
  if (r.targetMode === "selected") return r.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: a, ...c } = r.performerFilter;
  for (let l = 1; ; l++) {
    const g = await K("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Ut({
          findFilter: { page: l, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: c,
          filterExpression: a
        })
      )
    });
    if (g.items.forEach((m) => i.add(m.id)), l * 1e3 >= g.totalCount) return [...i];
    if (!g.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Jn(e, t) {
  const { _filterExpression: r, ...i } = e.view.objectFilter, a = e.occurrence, c = {
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
            { filter: { performerFilterCriterion: c } }
          ]
        }
      }
    }
  };
}
function to(e, t, r = e.conditionTagIds.map((i) => [i])) {
  const i = new Set(t), a = (c) => c.some((l) => i.has(l));
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
async function ro(e, t, r, i) {
  if ((t == null ? void 0 : t.length) === 0)
    return { items: [], totalCount: 0 };
  const a = await Xt(
    Jn(e, t),
    { ...e.view.filter, page: r },
    i
  ), c = t === null ? null : new Set(t), l = e.occurrence, g = a.items.length && l.includeSubtags !== !1 && !["any", "isNull"].includes(l.condition) ? await Promise.all(l.conditionTagIds.map((v) => rr([v], i))) : l.conditionTagIds.map((v) => [v]), m = new Array(a.items.length);
  let h = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, a.items.length) }, async () => {
      for (; h < a.items.length; ) {
        const v = h++, C = a.items[v], b = await K(
          `/api/tagapplications?hostType=video&hostId=${C.id}&contextType=performer`,
          { signal: i }
        );
        m[v] = C.performers.filter((I) => c === null || c.has(I.id)).flatMap((I) => {
          const O = b.filter(
            (R) => R.hostType === "video" && R.hostId === C.id && R.contextType === "performer" && R.contextId === I.id
          );
          return to(
            e.occurrence,
            O.map((R) => R.tag.id),
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
async function Qn(e, t, r) {
  const i = new Set(e.occurrence.tagIds);
  if (r.some((m) => !i.has(m)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const a = await Vr(t.video.id);
  if (!a.performers.some(
    (m) => m.id === t.performer.id
  ))
    throw new Error(
      "This performer is no longer linked to the scene. Refresh the queue."
    );
  const c = `/api/tagapplications?hostType=video&hostId=${a.id}&contextType=performer&contextId=${t.performer.id}`, l = (await K(c)).filter(
    (m) => m.hostType === "video" && m.hostId === a.id && m.contextType === "performer" && m.contextId === t.performer.id
  ), g = new Set(r);
  try {
    for (const m of g)
      l.some((h) => h.tag.id === m) || await K("/api/tagapplications", {
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
    for (const m of l)
      i.has(m.tag.id) && !g.has(m.tag.id) && await K(`/api/tagapplications/${m.id}`, {
        method: "DELETE"
      });
    return await K(c);
  } catch (m) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${m instanceof Error ? m.message : "Request failed."}`
    );
  }
}
const br = [
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
], no = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0
};
function Zt(e) {
  const t = e.entityType === "performerOccurrence" ? e.occurrence : void 0;
  return {
    filter: Oe({
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
function gn(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function xr(e, t) {
  if (!br.some((l) => t.has(l))) {
    const l = Zt(e);
    return { query: l, startAtEnd: l.startFrom === "end" };
  }
  const i = {
    q: t.get("q") ?? "",
    page: Number(t.get("page") ?? 1),
    perPage: Number(t.get("perPage") ?? 40),
    sort: t.get("sort") ?? "date",
    direction: t.get("direction") === "asc" ? "asc" : "desc"
  };
  if (t.has("seed") && (i.seed = Number(t.get("seed"))), t.get("sorts")) {
    const l = t.get("sorts").split(",").map((g) => {
      const m = g.lastIndexOf(":");
      return { key: g.slice(0, m), direction: g.slice(m + 1) };
    });
    if (l.some((g) => !g.key || !["asc", "desc"].includes(g.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = l, i.sort = l[0].key, i.direction = l[0].direction;
  }
  let a;
  if (e.entityType === "performerOccurrence" && (a = {
    ...no,
    ...gn(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(a.targetMode) || !["any", "includes", "includesAll", "excludes", "isNull"].includes(
    a.condition
  ) || !Array.isArray(a.performerIds) || !Array.isArray(a.conditionTagIds) || typeof a.includeSubtags != "boolean" || [...a.performerIds, ...a.conditionTagIds].some(
    (l) => !Number.isSafeInteger(l) || l <= 0
  ) || !a.performerFilter || typeof a.performerFilter != "object" || Array.isArray(a.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const c = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Oe(i),
      objectFilter: gn(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: c,
      performerScope: a
    },
    startAtEnd: !t.has("page") && c === "end"
  };
}
function Yt(e, t) {
  const r = new URLSearchParams(window.location.search);
  br.forEach((i) => r.delete(i)), r.set("review", e);
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
function Ct(e, t) {
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
function io(e, t) {
  return {
    added: t.filter((r) => !e.includes(r)),
    removed: e.filter((r) => !t.includes(r))
  };
}
function oo(e) {
  return `/api/tagapplications?hostType=video&hostId=${e.video.id}&contextType=performer&contextId=${e.occurrence.performer.id}`;
}
async function Ht(e) {
  var c;
  if (e.occurrence) {
    const l = (await K(oo(e))).filter(
      (g) => g.hostType === "video" && g.hostId === e.video.id && g.contextType === "performer" && g.contextId === e.occurrence.performer.id
    );
    return {
      ids: [...new Set(l.map((g) => g.tag.id))],
      names: [...new Set(l.map((g) => g.tag.name))],
      absent: [],
      applications: l
    };
  }
  const t = await Vr(e.video.id), r = (t.tags ?? []).filter(
    (l) => l.canRemove !== !1 || l.isDerived !== !0
  ), i = Object.keys(t.customFields ?? {}).find(
    (l) => l.toLowerCase() === Nt
  ) ?? Nt, a = ((c = t.customFields) == null ? void 0 : c[i]) ?? [];
  if (!Array.isArray(a) || a.some((l) => !Number.isSafeInteger(l)))
    throw new Error(
      "Confirmed absent tags are invalid. Inspect the video before editing."
    );
  return { ids: r.map((l) => l.id), names: r.map((l) => l.name), absent: a };
}
async function ao(e, t, r) {
  if (t.occurrence && e.entityType === "performerOccurrence")
    await Qn(
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
      a.length && await K("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({ ids: [t.video.id], tagMode: i, tagIds: a })
      });
}
async function so(e, t, r) {
  t.occurrence && e.entityType === "performerOccurrence" ? await eo(e, t.occurrence, r) : await Gn(r, [t.video.id]);
}
const lo = {
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
function Br(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function co(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function Wn(e) {
  return [
    ...new Set(
      Br(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function zn(e, t) {
  const r = Br(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((i) => {
      const a = String(i.key ?? ""), c = lo[String(i.modifier ?? "EQUALS")], l = (C, b) => String(b ?? "").trim() || t[String(C)] || String(C ?? ""), g = l(
        i.value,
        i.displayValue
      ), m = l(
        i.value2,
        i.displayValue2
      ), h = String(i.modifier ?? "EQUALS"), v = h === "IS_NULL" || h === "NOT_NULL" ? [] : h === "BETWEEN" || h === "NOT_BETWEEN" ? [g, "and", m] : [g];
      return {
        ...i,
        label: [co(a), c, ...v].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function Hn(e) {
  const t = Br(e.customFieldCriteria);
  return t.length ? {
    ...e,
    customFieldCriteria: t.map(
      ({ label: r, ...i }) => i
    )
  } : e;
}
function Xn(e, t, r) {
  return r || "customFieldCriteria" in t || !Array.isArray(e.customFieldCriteria) ? t : { ...t, customFieldCriteria: e.customFieldCriteria };
}
function mn({
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
function Rr(e, t) {
  if (!t) return e;
  const r = /* @__PURE__ */ new Map();
  for (const i of e)
    r.set(i.video.id, [...r.get(i.video.id) ?? [], i]);
  return [...r.values()].reverse().flat();
}
const We = (e) => e instanceof Error ? e.message : "Request failed.";
function uo({
  actions: e,
  disabled: t,
  canWrite: r,
  onApply: i
}) {
  const [a, c] = E({});
  Q(() => {
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
            (await K(`/api/tags/${m}`)).name
          ];
        } catch {
          return [m, "Unavailable tag"];
        }
      })
    ).then((m) => {
      g && c(Object.fromEntries(m));
    }), () => {
      g = !1;
    };
  }, [e]);
  const l = {
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
            lt(g, m) && /* @__PURE__ */ n("kbd", { children: lt(g, m) }),
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
          children: /* @__PURE__ */ n(kn, { "aria-hidden": "true" })
        }
      ),
      g.steps.length > 0 && /* @__PURE__ */ n("small", { className: "dq-review-action-summary", children: g.steps.map(
        (h) => `${l[h.mode]}: ${h.tagIds.map((v) => a[v] ?? "Loading tag…").join(", ")}`
      ).join("; ") })
    ] }, g.id))
  ] });
}
function fo({
  review: e,
  canWrite: t,
  onBusy: r,
  onSaveDefaults: i,
  editRequest: a = 0,
  renderRuleEditor: c
}) {
  var Xe;
  const l = M(null), g = M("");
  if (!l.current)
    try {
      l.current = xr(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (s) {
      g.current = We(s), l.current = { query: Zt(e), startAtEnd: !1 };
    }
  const [m, h] = E(null), v = M(null), C = M(null), b = M(null), [I, O] = E(!!g.current), R = M(0), [q, D] = E(l.current.query), A = M(q);
  A.current = q;
  const [te, X] = E(0), re = M(l.current.startAtEnd), [f, P] = E([]), [w, j] = E(null), ne = M(null), [ke, de] = E(null), [nr, ue] = E(0), At = Et(() => {
    if (!w) return null;
    const s = f.findIndex((p) => p.key === w.key);
    return s < 0 ? null : f.slice(s + 1).find((p) => p.video.id !== w.video.id) ?? null;
  }, [w, f]), [Ue, tt] = E(0), [Ee, Tt] = E(!1), [se, jt] = E(!1), je = M(!1), Be = M(!0), ze = M(null);
  Q(() => (Be.current = !0, () => {
    Be.current = !1;
  }), []);
  const [ct, ae] = E(g.current), [dt, Ke] = E(""), [ge, ee] = E(null), [me, V] = E(!1), [N, W] = E([]), L = M([]), Je = M(null), He = M(null), Kt = M(null);
  Q(() => {
    var s, p;
    me && ((p = (s = Kt.current) == null ? void 0 : s.querySelector("input")) == null || p.focus());
  }, [me]);
  const [he, rt] = E(!1);
  Q(() => {
    if (Ee || he || !He.current) return;
    const s = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const p = He.current;
      p != null && p.isConnected && !p.disabled && p.focus(), He.current = null;
    });
    return () => cancelAnimationFrame(s);
  }, [Ee, he, te]);
  const [nt, ut] = E([]), [Rt, qt] = E({}), kt = M(null), it = M(0), Ve = M(!1), [ie, It] = E({});
  Q(() => {
    let s = !0;
    return Promise.all(
      Wn(q.objectFilter).map(
        async (p) => [
          String(p),
          (await K(`/api/tags/${p}`)).name
        ]
      )
    ).then((p) => {
      s && It(Object.fromEntries(p));
    }).catch(() => {
    }), () => {
      s = !1;
    };
  }, [q.objectFilter]);
  const ot = M(0), Vt = M(e);
  Vt.current = e;
  const Ce = m ?? e, Ge = Et(
    () => Ct(Ce, q),
    [Ce, q]
  ), G = M(Ge);
  G.current = Ge;
  const _e = se || Ee || me, fe = Number(q.filter.page);
  function Le(s, p = !1) {
    je.current || (g.current = "", re.current = p, A.current = s, D(s), tt(0), Tt(!0), p || Yt(e.id, s), X((T) => T + 1));
  }
  function Gt() {
    if (je.current = !1, jt(!1), Be.current && ze.current) {
      const s = ze.current;
      ze.current = null, Le(s.query, s.startAtEnd);
    }
  }
  Q(() => {
    const s = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const p = xr(
            Vt.current,
            new URLSearchParams(window.location.search)
          );
          je.current ? ze.current = p : Le(p.query, p.startAtEnd);
        } catch (p) {
          ae(We(p));
        }
    };
    return window.addEventListener("popstate", s), () => window.removeEventListener("popstate", s);
  }, [e.id]), Q(() => (r(se || Ee || me || !!m), () => r(!1)), [se, Ee, me, !!m, r]);
  async function ft(s, p, T) {
    if (s.entityType === "performerOccurrence") {
      const x = await ro(
        s,
        kt.current,
        p,
        T
      );
      return {
        items: x.items.map((z) => ({
          key: z.key,
          video: z.video,
          occurrence: z
        })),
        totalCount: x.totalCount
      };
    }
    const _ = await Xt(
      s,
      { ...s.view.filter, page: p },
      T
    );
    return {
      items: _.items.map((x) => ({ key: String(x.id), video: x })),
      totalCount: _.totalCount
    };
  }
  function Bt(s, p, T, _ = !1, x = !1) {
    if (!Be.current || ze.current) return;
    O(!0), P(
      x ? s.items : Rr(s.items, A.current.startFrom === "end")
    ), tt(s.totalCount), pt(T, _);
    const z = {
      ...A.current,
      filter: { ...A.current.filter, page: p }
    };
    A.current = z, D(z), Yt(e.id, z);
  }
  function pt(s, p = !1) {
    (s == null ? void 0 : s.key) !== (w == null ? void 0 : w.key) && (ne.current = null), (s == null ? void 0 : s.video.id) !== (w == null ? void 0 : w.video.id) && de(p && s ? s.video.id : null), j(s);
  }
  Q(() => {
    if (g.current) return;
    const s = new AbortController();
    b.current = s;
    const p = ++ot.current;
    return Tt(!0), ae(""), Ke(""), ne.current = null, de(null), j(null), P([]), V(!1), (async () => {
      const T = Ct(Vt.current, A.current);
      kt.current = T.entityType === "performerOccurrence" ? await Bn(T, s.signal) : null;
      let _ = Number(T.view.filter.page), x = await ft(T, _, s.signal);
      const z = Math.max(
        1,
        Math.ceil(x.totalCount / Number(T.view.filter.perPage))
      );
      if ((re.current || _ > z) && (_ = z, x = await ft(T, _, s.signal)), re.current = !1, p !== ot.current || s.signal.aborted) return;
      const Me = Rr(x.items, T.view.startFrom === "end");
      Bt(x, _, Me[0] ?? null);
    })().catch((T) => {
      !s.signal.aborted && p === ot.current && ae(We(T));
    }).finally(() => {
      !s.signal.aborted && p === ot.current && (O(!0), Tt(!1));
    }), () => {
      s.abort(), ot.current++;
    };
  }, [te, e.id]), Q(() => {
    if (ee(null), !w) return;
    let s = !0;
    return Ht(w).then((p) => {
      s && (ee(p), ut(
        e.entityType === "performerOccurrence" ? p.ids.filter((T) => e.occurrence.tagIds.includes(T)) : []
      ));
    }).catch((p) => {
      s && ae(`Could not load current tags. ${We(p)}`);
    }), () => {
      s = !1;
    };
  }, [w]), Q(() => {
    if (e.entityType !== "performerOccurrence" || e.actions.length)
      return;
    let s = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (p) => [
          p,
          (await K(`/api/tags/${p}`)).name
        ]
      )
    ).then((p) => {
      s && qt(Object.fromEntries(p));
    }).catch((p) => {
      s && ae(We(p));
    }), () => {
      s = !1;
    };
  }, [e]);
  async function xe(s = !1, p = !1, T = !1) {
    var mt;
    if (!w) return;
    const _ = f.findIndex((H) => H.key === w.key), x = q.startFrom === "end" ? -1 : 1, z = ((mt = ne.current) == null ? void 0 : mt.key) === w.key ? ne.current : { key: w.key, page: fe, before: f.slice(0, _ + 1).map((H) => H.key), after: f.slice(_ + 1).map((H) => H.key) }, Me = new Set(z.after), Ye = new Set(z.before), U = f.find((H) => {
      var Te;
      return Me.has(H.key) || (x === 1 || fe < z.page) && ((Te = ne.current) == null ? void 0 : Te.key) === w.key && !Ye.has(H.key);
    });
    if (!s && U) {
      pt(U, T);
      return;
    }
    const le = s ? Ye : new Set(f.map((H) => H.key)), Ae = 1100 - (Date.now() - it.current);
    Ae > 0 && await new Promise((H) => window.setTimeout(H, Ae));
    let Fe = x === -1 && !s ? Math.max(1, fe - 1) : fe;
    for (; Be.current && !ze.current; ) {
      let H = await ft(Ge, Fe);
      const Te = Math.max(
        1,
        Math.ceil(H.totalCount / Number(q.filter.perPage))
      );
      Fe > Te && (Fe = Te, H = await ft(Ge, Fe));
      const Ot = Rr(H.items, x === -1), ht = new Map(Ot.map((be) => [be.key, be])), Y = s ? z.after.flatMap((be) => {
        const yt = ht.get(be);
        return yt ? [yt] : [];
      }) : [], ir = new Set(Y.map((be) => be.key)), Pt = s ? {
        ...H,
        items: [
          ...Y,
          ...Ot.filter(
            (be) => be.key !== w.key && !ir.has(be.key)
          )
        ]
      } : H;
      if (p) {
        ne.current = z, Bt(Pt, Fe, w, !1, s);
        return;
      }
      const at = x === -1 && fe === 1 && !s ? void 0 : Pt.items.find(
        (be) => !le.has(be.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(s && x === -1 && Fe === z.page) || Me.has(be.key))
      );
      if (at || (x === -1 ? Fe <= 1 : Fe >= Te)) {
        Bt(
          Pt,
          Fe,
          at ?? null,
          T,
          s
        ), at || Ke(
          H.totalCount ? "Reached the end in this direction. Matching items remain available from the scene pages." : "No matching scenes."
        );
        return;
      }
      Fe += x;
    }
  }
  async function ye(s, p = !1, T = !1, _ = !1) {
    if (m || !w || je.current || Ee || me && !T)
      return;
    const x = T || _ || !!(s != null && s.steps.length), z = x && !p;
    if (x && (!t || !ge)) return;
    je.current = !0, jt(!0), ae(""), Ke("");
    const Me = f.findIndex((le) => le.key === w.key), Ye = x && !p && Me >= 0 ? f[Me + 1] ?? null : null;
    Ye && (P(
      (le) => le.filter((Ae) => Ae.key !== w.key)
    ), pt(Ye, !0));
    let U = !1;
    try {
      if (x) {
        const le = await Ht(w);
        if (s)
          await so(Ge, w, s);
        else {
          const Fe = _ && e.entityType === "performerOccurrence" ? e.occurrence.tagIds.filter((Te) => le.ids.includes(Te)) : L.current, H = io(Fe, _ ? nt : N);
          await ao(Ge, w, H);
        }
        it.current = Date.now();
        const Ae = await Ht(w);
        Ye || ee(Ae), U = !0, V(!1), Ke("Tags saved.");
      }
      if (!Be.current || ze.current) return;
      x ? await xe(!0, p, z) : p || await xe(), p && T && requestAnimationFrame(() => {
        var le;
        return (le = Je.current) == null ? void 0 : le.focus();
      });
    } catch (le) {
      if (ae(
        U ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${We(le)}` : x ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${We(le)}` : `Could not advance. ${We(le)}`
      ), x && !U) {
        Ye && (P(f), de(null), ue((Ae) => Ae + 1), j(w)), it.current = Date.now();
        try {
          ee(await Ht(w));
        } catch {
          ee(null), ae(
            (Ae) => `${Ae} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Gt();
    }
  }
  Q(() => {
    const s = (p) => {
      if (me || m || se || Ee || he || p.defaultPrevented || p.repeat || p.ctrlKey || p.altKey || p.metaKey || !_n(p.target) || document.querySelector('[role="dialog"], dialog[open]'))
        return;
      const T = p.key.toLowerCase(), _ = e.actions.find(
        (x, z) => lt(x, z) === T
      );
      _ && (p.preventDefault(), p.stopPropagation(), ye(_, p.shiftKey));
    };
    return document.addEventListener("keydown", s), () => document.removeEventListener("keydown", s);
  });
  function gt() {
    !i || m || je.current || me || (C.current = document.activeElement, v.current = {
      error: ct,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(A.current),
      items: f,
      current: w,
      total: Ue,
      targets: kt.current,
      stayedCursor: ne.current
    }, h(structuredClone(Ct(e, A.current))), Ke(""), ae(""));
  }
  Q(() => {
    a && a !== R.current && I && !Ee && (R.current = a, gt());
  }, [a, Ee, I]);
  function Qe() {
    h(null), requestAnimationFrame(() => {
      var s;
      return (s = C.current) == null ? void 0 : s.focus();
    });
  }
  function Ne() {
    var p;
    const s = v.current;
    !s || se || ((p = b.current) == null || p.abort(), ot.current++, A.current = s.query, D(s.query), P(s.items), j(s.current), tt(s.total), kt.current = s.targets, ne.current = s.stayedCursor, Tt(!1), ae(s.error), Ke(""), window.history.replaceState(window.history.state, "", s.url), Qe());
  }
  async function Ie() {
    if (!m || !i || je.current) return;
    const s = Ct(
      { ...m, name: m.name.trim() },
      A.current
    ), p = pr(s);
    if (p) {
      ae(p);
      return;
    }
    je.current = !0, jt(!0), ae("");
    try {
      if (await i(s) === !1) throw new Error("Could not save review.");
      Qe(), Ke("Review saved.");
    } catch (T) {
      ae(
        "Could not save review. Your edits are still open. " + We(T)
      );
    } finally {
      Gt();
    }
  }
  const B = q.performerScope, pe = (s) => Le({
    ...A.current,
    filter: { ...A.current.filter, page: 1 },
    performerScope: { ...B, ...s }
  });
  return /* @__PURE__ */ u(
    "section",
    {
      className: "dq-review-workspace",
      "aria-label": B ? "Performer occurrence review" : "Video review",
      children: [
        m && /* @__PURE__ */ u("section", { className: "dq-rule-editor", "aria-label": "Edit review rule", children: [
          /* @__PURE__ */ n("h2", { children: "Edit review" }),
          /* @__PURE__ */ n("p", { children: "Preview matching scenes below. Save review keeps all rule changes; Cancel restores your previous view." }),
          /* @__PURE__ */ u("fieldset", { disabled: se, children: [
            c == null ? void 0 : c(
              Ct(m, q),
              h,
              se
            ),
            /* @__PURE__ */ u("label", { children: [
              "Review direction",
              /* @__PURE__ */ u(
                "select",
                {
                  "aria-label": "Review direction",
                  value: q.startFrom,
                  onChange: (s) => Le({
                    ...A.current,
                    startFrom: s.target.value
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
                disabled: se || Ee,
                onClick: () => void Ie(),
                children: "Save review"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button",
                type: "button",
                disabled: se,
                onClick: Ne,
                children: "Cancel"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u(
          "fieldset",
          {
            className: "dq-review-filters",
            disabled: _e,
            onClickCapture: (s) => {
              var _;
              const p = s.target instanceof Element ? s.target.closest("button") : null, T = (p == null ? void 0 : p.getAttribute("aria-label")) ?? ((_ = p == null ? void 0 : p.textContent) == null ? void 0 : _.trim()) ?? "";
              p && !p.closest('[role="dialog"], dialog') && /^(Filters|Edit filter:|Edit performer criteria)/.test(T) && (He.current = p);
            },
            children: [
              /* @__PURE__ */ n("legend", { children: "Scene filters" }),
              /* @__PURE__ */ n(
                "div",
                {
                  onKeyDownCapture: (s) => {
                    var p;
                    s.key === "Escape" && (Ve.current = !1), ["Delete", "Backspace"].includes(s.key) && s.target instanceof Element && ((p = s.target.closest("button")) == null ? void 0 : p.getAttribute("aria-label")) === "Edit filter: Custom Fields" && (Ve.current = !0);
                  },
                  onClickCapture: (s) => {
                    var T, _;
                    const p = s.target instanceof Element ? s.target.closest("button") : null;
                    (p == null ? void 0 : p.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((T = p == null ? void 0 : p.textContent) == null ? void 0 : T.trim()) === "Clear all" ? Ve.current = !0 : (/^(Cancel|Filters)/.test(((_ = p == null ? void 0 : p.textContent) == null ? void 0 : _.trim()) ?? "") || /^(Close|Dismiss)/.test((p == null ? void 0 : p.getAttribute("aria-label")) ?? "")) && (Ve.current = !1);
                  },
                  children: /* @__PURE__ */ n(
                    Ir,
                    {
                      filter: q.filter,
                      objectFilter: zn(
                        q.objectFilter,
                        ie
                      ),
                      criteriaDefinitions: [
                        ...fr,
                        {
                          id: "custom-fields",
                          label: "Custom Fields",
                          filterKey: "customFieldCriteria"
                        }
                      ],
                      totalCount: Ue,
                      sortOptions: Ur,
                      showSearch: !0,
                      showSort: !0,
                      showPagingControls: !1,
                      onFilterChange: (s) => {
                        (s.sort !== A.current.filter.sort || s.direction !== A.current.filter.direction) && (s = { ...s, sorts: void 0 }), Le({
                          ...A.current,
                          filter: Oe(s)
                        });
                      },
                      onObjectFilterChange: (s) => {
                        const p = Xn(
                          A.current.objectFilter,
                          Hn(s),
                          Ve.current
                        );
                        Ve.current = !1, Le({
                          ...A.current,
                          objectFilter: p,
                          filter: { ...A.current.filter, page: 1 }
                        });
                      }
                    }
                  )
                }
              ),
              B && /* @__PURE__ */ u("div", { className: "dq-scope-controls", children: [
                /* @__PURE__ */ u("label", { children: [
                  "Performers to review",
                  " ",
                  /* @__PURE__ */ u(
                    "select",
                    {
                      value: B.targetMode,
                      onChange: (s) => pe({
                        targetMode: s.target.value
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
                  et,
                  {
                    entityType: "performer",
                    values: B.performerIds,
                    onChange: (s) => pe({ performerIds: s }),
                    placeholder: "Select performers to review...",
                    allowCreate: !1
                  }
                ),
                B.targetMode === "filter" && /* @__PURE__ */ u(Pe, { children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => rt(!0),
                      children: "Edit performer criteria"
                    }
                  ),
                  /* @__PURE__ */ n("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ n(
                    Ir,
                    {
                      filter: {},
                      onFilterChange: () => {
                      },
                      totalCount: 0,
                      sortOptions: [],
                      showSearch: !1,
                      showSort: !1,
                      showPagingControls: !1,
                      criteriaDefinitions: sn,
                      objectFilter: B.performerFilter,
                      onObjectFilterChange: (s) => pe({ performerFilter: s })
                    }
                  ) })
                ] }),
                /* @__PURE__ */ u("label", { children: [
                  "Occurrence tags",
                  " ",
                  /* @__PURE__ */ u(
                    "select",
                    {
                      value: B.condition,
                      onChange: (s) => pe({
                        condition: s.target.value
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
                !["any", "isNull"].includes(B.condition) && /* @__PURE__ */ u(Pe, { children: [
                  /* @__PURE__ */ n(
                    et,
                    {
                      entityType: "tag",
                      values: B.conditionTagIds,
                      onChange: (s) => pe({ conditionTagIds: s }),
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
                        onChange: (s) => pe({ includeSubtags: s.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] })
                ] })
              ] }),
              !m && /* @__PURE__ */ u("div", { className: "dq-row", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    onClick: () => {
                      const s = Zt(e);
                      Le(s, s.startFrom === "end");
                    },
                    children: "Reset to review defaults"
                  }
                ),
                i && /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    onClick: gt,
                    children: "Save as review defaults"
                  }
                )
              ] })
            ]
          }
        ),
        B && /* @__PURE__ */ n(
          Nn,
          {
            open: he,
            onClose: () => rt(!1),
            criteria: sn,
            activeFilter: B.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (s) => {
              rt(!1), pe({ performerFilter: s });
            }
          }
        ),
        /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
          ct && /* @__PURE__ */ u("p", { role: "alert", children: [
            ct,
            " ",
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: se,
                onClick: () => {
                  w ? Ht(w).then(ee).catch((s) => ae(We(s))) : Le(A.current);
                },
                children: w ? "Reload tags" : "Retry queue"
              }
            )
          ] }),
          dt && /* @__PURE__ */ n("p", { role: "status", children: dt })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-review-layout", children: [
          /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
            /* @__PURE__ */ n("fieldset", { disabled: _e, children: /* @__PURE__ */ n(
              An,
              {
                filter: q.filter,
                totalCount: Ue,
                onFilterChange: (s) => Le({ ...q, filter: Oe(s) })
              }
            ) }),
            /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: f.map((s) => {
              var p, T, _;
              return /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  title: `${s.occurrence ? `${s.occurrence.performer.name} — ` : ""}${s.video.title || ((p = s.video.files[0]) == null ? void 0 : p.basename) || "Scene"}`,
                  "aria-label": `${s.occurrence ? `${s.occurrence.performer.name} — ` : ""}${s.video.title || ((T = s.video.files[0]) == null ? void 0 : T.basename) || "Scene"}`,
                  disabled: _e,
                  "aria-pressed": (w == null ? void 0 : w.key) === s.key,
                  onClick: () => {
                    pt(s), ae(""), Ke("");
                  },
                  children: [
                    s.occurrence && /* @__PURE__ */ n(mn, { performer: s.occurrence.performer }),
                    /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: s.video.title || ((_ = s.video.files[0]) == null ? void 0 : _.basename) || "Scene" })
                  ]
                },
                s.key
              );
            }) })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-inspector", children: w ? /* @__PURE__ */ u(Pe, { children: [
            /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
              /* @__PURE__ */ n("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ n(
                "a",
                {
                  href: `/video/${w.video.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: w.video.title || ((Xe = w.video.files[0]) == null ? void 0 : Xe.basename) || `Video ${w.video.id}`
                }
              ) }),
              [w, At].filter(Boolean).map((s) => {
                var _, x, z;
                const p = s, T = p.key === w.key;
                return /* @__PURE__ */ n(
                  "div",
                  {
                    className: T ? "dq-review-video-current" : "dq-review-video-preload",
                    "aria-hidden": T ? void 0 : !0,
                    inert: T ? void 0 : !0,
                    children: /* @__PURE__ */ n(
                      Tn,
                      {
                        videoId: p.video.id,
                        streamUrl: Vn(p.video.id),
                        posterUrl: T ? Gi(p.video) : void 0,
                        duration: ((_ = p.video.files[0]) == null ? void 0 : _.duration) ?? 0,
                        format: (x = p.video.files[0]) == null ? void 0 : x.format,
                        audioCodec: (z = p.video.files[0]) == null ? void 0 : z.audioCodec,
                        extensionSurface: T ? "quick-view" : void 0,
                        autostart: T && ke === p.video.id,
                        keyboardShortcutsEnabled: T,
                        showAbLoop: T,
                        clip: p.video.parentVideoId != null ? {
                          start: p.video.clipStartSec ?? 0,
                          end: p.video.clipEndSec,
                          loop: !1
                        } : void 0
                      }
                    )
                  },
                  `${p.video.id}:${nr}`
                );
              })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-panel", children: [
              /* @__PURE__ */ n("h2", { children: w.occurrence ? `Reviewing ${w.occurrence.performer.name}` : "Reviewing this video" }),
              /* @__PURE__ */ n("p", { children: B ? "Tags apply only to this performer in this video." : "Tags apply to the video." }),
              B && /* @__PURE__ */ n(
                "div",
                {
                  className: "dq-review-partners",
                  "aria-label": "Matching scene partners",
                  children: f.filter((s) => s.video.id === w.video.id).map((s) => {
                    var p, T;
                    return /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button dq-partner-button",
                        title: (p = s.occurrence) == null ? void 0 : p.performer.name,
                        "aria-label": (T = s.occurrence) == null ? void 0 : T.performer.name,
                        disabled: _e,
                        "aria-pressed": s.key === w.key,
                        onClick: () => {
                          pt(s), ae("");
                        },
                        children: s.occurrence && /* @__PURE__ */ n(
                          mn,
                          {
                            performer: s.occurrence.performer
                          }
                        )
                      },
                      s.key
                    );
                  })
                }
              ),
              /* @__PURE__ */ u("p", { children: [
                "Current ",
                B ? "occurrence" : "video",
                " tags:",
                " ",
                ge ? ge.names.join(", ") || "None" : "Loading…"
              ] }),
              ge != null && ge.absent.length ? /* @__PURE__ */ u("p", { children: [
                "Confirmed absent tags:",
                " ",
                /* @__PURE__ */ n(
                  et,
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
                  ref: Kt,
                  disabled: se,
                  className: "dq-tag-editor",
                  children: [
                    /* @__PURE__ */ u("legend", { children: [
                      "Edit ",
                      B ? "occurrence" : "video",
                      " tags"
                    ] }),
                    /* @__PURE__ */ n(
                      et,
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
                          onClick: () => void ye(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !ge,
                          onClick: () => void ye(void 0, !1, !0),
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
                                var s;
                                return (s = Je.current) == null ? void 0 : s.focus();
                              }
                            );
                          },
                          children: "Cancel"
                        }
                      )
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ u(Pe, { children: [
                /* @__PURE__ */ n(
                  uo,
                  {
                    actions: Ce.actions,
                    canWrite: t,
                    disabled: se || Ee || !ge || !!m,
                    onApply: (s, p) => void ye(s, p)
                  }
                ),
                e.entityType === "performerOccurrence" && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                  "fieldset",
                  {
                    disabled: !t || se || !ge || !!m,
                    children: [
                      /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                      e.occurrence.tagIds.map((s) => /* @__PURE__ */ u("label", { children: [
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: e.occurrence.multiple ? "checkbox" : "radio",
                            name: "legacy-choice",
                            checked: nt.includes(s),
                            onChange: (p) => ut(
                              e.occurrence.multiple ? p.target.checked ? [...nt, s] : nt.filter(
                                (T) => T !== s
                              ) : [s]
                            )
                          }
                        ),
                        Rt[s] ?? "Loading tag…"
                      ] }, s)),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          onClick: () => ut([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void ye(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void ye(void 0, !1, !1, !0),
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
                    ref: Je,
                    className: "dq-button",
                    disabled: _e || !!m || !t || !ge,
                    onClick: () => {
                      L.current = [...ge.ids], W([...ge.ids]), V(!0);
                    },
                    children: "Edit tags"
                  }
                ),
                /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: _e || !!m,
                    onClick: () => void ye(),
                    children: [
                      "Skip",
                      B ? " performer" : " video"
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
function hn({
  review: e,
  onChange: t,
  choices: r = !1
}) {
  const i = e.occurrence, a = (c) => t({ ...e, occurrence: { ...i, ...c } });
  return r ? /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ n("p", { children: "Choose the tags this review can change on the active performer’s appearance in a scene. Other tags are preserved." }),
    /* @__PURE__ */ n(
      et,
      {
        entityType: "tag",
        values: i.tagIds,
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
          checked: i.multiple,
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
          value: i.condition,
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
    !["any", "isNull"].includes(i.condition) && /* @__PURE__ */ u(Pe, { children: [
      /* @__PURE__ */ n(
        et,
        {
          entityType: "tag",
          values: i.conditionTagIds,
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
            checked: i.includeSubtags ?? !0,
            onChange: (c) => a({ includeSubtags: c.target.checked })
          }
        ),
        "Include subtags"
      ] })
    ] }),
    /* @__PURE__ */ n("p", { children: "Conditions check tags on the same performer’s occurrence, independently of scene tags and the performer’s profile." })
  ] });
}
function po(e) {
  var g, m, h;
  const [t, r] = E({}), [i, a] = E(""), c = (((g = e == null ? void 0 : e.presentation) == null ? void 0 : g.annotations) ?? []).includes("tags") ? ((m = e == null ? void 0 : e.presentation) == null ? void 0 : m.annotationParents) ?? [] : [], l = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...c,
      ...((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.binParents) ?? []
    ])
  ]);
  return Q(() => {
    let v = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(l).map(
        async (C) => [C, await rr([C])]
      )
    ).then((C) => {
      v && r(Object.fromEntries(C));
    }).catch(() => {
      v && a(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      v = !1;
    };
  }, [l]), { ids: t, error: i };
}
function go(e, t, r) {
  const i = t == null ? void 0 : t.presentation, a = (i == null ? void 0 : i.annotations) ?? [], c = (i == null ? void 0 : i.annotationParents) ?? [];
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
      (l) => c.some(
        (g) => {
          var m;
          return g !== l.id && ((m = r[g]) == null ? void 0 : m.includes(l.id));
        }
      )
    ) : []
  };
}
function mo({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: a
}) {
  var g, m, h;
  const c = new Set(
    (((g = t.presentation) == null ? void 0 : g.binParents) ?? []).flatMap(
      (v) => (r[v] ?? []).filter((C) => C !== v)
    )
  ), l = /* @__PURE__ */ new Map();
  for (const v of e)
    for (const C of v.tags ?? [])
      if (c.has(C.id)) {
        const b = l.get(C.id) ?? { name: C.name, count: 0 };
        b.count++, l.set(C.id, b);
      }
  return (h = (m = t.presentation) == null ? void 0 : m.binParents) != null && h.length ? /* @__PURE__ */ u("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...l].sort((v, C) => v[1].name.localeCompare(C[1].name)).map(([v, C]) => /* @__PURE__ */ u(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => a(v),
        children: [
          C.name,
          " (",
          C.count,
          ")"
        ]
      },
      v
    )),
    !l.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function ho(e, t) {
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
function yn({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [a, c] = E(!1), l = Se(e) === "tag" ? "tag" : "video", g = e.view.filter, m = l === "tag" ? Rn : Ur, h = (b) => t({
    ...e,
    view: { ...e.view, filter: { ...g, ...b } }
  }), v = l === "video" ? e.presentation ?? {} : {}, C = (b) => t({ ...e, presentation: { ...v, ...b } });
  return /* @__PURE__ */ u(Pe, { children: [
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
          l === "tag" ? "Tags" : "Videos",
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
          onClick: () => c(!0),
          children: [
            "Edit ",
            l,
            " filters"
          ]
        }
      ),
      /* @__PURE__ */ u("p", { children: [
        Object.keys(e.view.objectFilter).length ? `${l === "tag" ? "Tag" : "Video"} filters configured` : `No ${l} filters`,
        ". Choose which ",
        l === "tag" ? "tags" : "videos",
        " enter the queue."
      ] }),
      a && /* @__PURE__ */ n("div", { onKeyDown: (b) => b.stopPropagation(), children: /* @__PURE__ */ n(
        Nn,
        {
          open: !0,
          onClose: () => c(!1),
          criteria: l === "tag" ? qn : fr,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: l === "video",
          subjectLabel: l === "tag" ? "tags" : "videos",
          onApply: (b) => {
            t({ ...e, view: { ...e.view, objectFilter: b } }), c(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ u(Pe, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ u("p", { className: "dq-editor-note", children: [
        "Choose how ",
        l === "tag" ? "tags" : "videos and tags",
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ u("div", { className: "dq-field-grid", children: [
        Se(e) === "video" && /* @__PURE__ */ u("label", { children: [
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
              value: l === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid",
              onChange: (b) => t({
                ...e,
                view: {
                  ...e.view,
                  displayMode: b.target.value
                }
              }),
              children: (l === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((b) => /* @__PURE__ */ n("option", { children: b }, b))
            }
          )
        ] })
      ] }),
      l === "video" && /* @__PURE__ */ u(Pe, { children: [
        /* @__PURE__ */ n("h4", { children: "Card annotations" }),
        /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((b) => {
          const I = v.annotations ?? [];
          return /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: I.includes(b),
                onChange: (O) => C({
                  annotations: O.target.checked ? [...I, b] : I.filter((R) => R !== b)
                })
              }
            ),
            b
          ] }, b);
        }) }),
        (v.annotations ?? []).includes("tags") && /* @__PURE__ */ u(Pe, { children: [
          /* @__PURE__ */ n("h4", { children: "Card tag bins" }),
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected. This setting is separate from the queue filters." }),
          /* @__PURE__ */ n(
            et,
            {
              entityType: "tag",
              values: v.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (b) => C({ annotationParents: b }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ n("h4", { children: "Queue tag bins" }),
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ n(
          et,
          {
            entityType: "tag",
            values: v.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (b) => C({ binParents: b }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const qr = 180, yo = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function Yn({ entityType: e }) {
  return e === "tag" ? /* @__PURE__ */ n(Ai, { role: "img", "aria-label": "Tag review" }) : /* @__PURE__ */ n(Mr, { role: "img", "aria-label": e === "performerOccurrence" ? "Performer occurrence review" : "Video review" });
}
function bn(e) {
  return Se(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function wn(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function kr() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function vn(e) {
  const t = new URLSearchParams(window.location.search);
  br.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function bo(e) {
  return Oe({ ...e, page: 1 });
}
function yr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((l, g) => yr(l, t[g]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, a = Object.keys(r).sort(), c = Object.keys(i).sort();
  return a.length === c.length && a.every(
    (l, g) => l === c[g] && yr(r[l], i[l])
  );
}
function Zn(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function De(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
const ei = "data-quality.workspace-layout.v1", Jr = 240, _r = 192, Dr = 560;
function ti(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(Dr, Math.max(_r, e)) : Jr;
}
function wo() {
  try {
    const e = JSON.parse(
      localStorage.getItem(ei) ?? "null"
    );
    return ti(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return Jr;
  }
}
function vo(e) {
  try {
    localStorage.setItem(
      ei,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function ri(e) {
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
function ni(e, t) {
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
function So(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : ni(e, t);
}
function Eo({
  onNavigate: e
}) {
  const [t, r] = E([]), [i] = E(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [a, c] = E(""), [l, g] = E(!0), [m, h] = E(""), [v, C] = E(!1), [b, I] = E(!1), [O, R] = E(!1), [q, D] = E([]), [A, te] = E(""), [X, re] = E(!0), [f, P] = E(""), [w, j] = E(""), [ne, ke] = E(!1), [de, nr] = E(!1), [ue, At] = E(kr), [Ue, tt] = E({}), [Ee, Tt] = E("name"), [se, jt] = E("asc"), je = M(null), Be = M(!1), [ze, ct] = E(0), [ae, dt] = E(!1), [Ke, ge] = E(!1), [ee, me] = E(
    null
  ), V = t.find((o) => o.id === ue) ?? null, N = Et(
    () => (ee == null ? void 0 : ee.id) === ue && V ? { ...V, view: {
      ...V.view,
      filter: ee.view.filter,
      objectFilter: ee.view.objectFilter,
      searchMode: ee.view.searchMode,
      startFrom: ee.view.startFrom
    } } : V,
    [ee, ue, V]
  ), W = N ? Se(N) : "video", L = W === "video" ? N : null, [Je, He] = E(null), Kt = (Je == null ? void 0 : Je.id) === (N == null ? void 0 : N.id) ? Je == null ? void 0 : Je.mode : (N == null ? void 0 : N.view.reviewMode) ?? "single", he = W === "performerOccurrence" || W === "video" && Kt === "single", [rt, nt] = E(0), ut = M(-1), Rt = M(!1);
  Q(() => {
    const o = () => {
      if (!he && Ae.current) {
        Rt.current = !0;
        return;
      }
      At(kr()), he || nt((d) => d + 1);
    };
    return window.addEventListener("popstate", o), () => window.removeEventListener("popstate", o);
  }, [he]);
  const qt = W === "tag" ? b : v, kt = Et(() => {
    const o = se === "asc" ? 1 : -1;
    return [...t].sort((d, y) => {
      if (Ee === "count") {
        const S = Ue[d.id], F = Ue[y.id], k = typeof S == "number", $ = typeof F == "number";
        if (k !== $) return k ? -1 : 1;
        if (k && $ && S !== F)
          return (S - F) * o;
      }
      return d.name.localeCompare(y.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * o;
    });
  }, [se, Ee, Ue, t]), it = M(
    null
  ), Ve = po(L), [ie, It] = E({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [ot, Vt] = E({
    page: 1,
    perPage: 40
  }), [Ce, Ge] = E({ items: [], totalCount: 0 }), [G, _e] = E(!1), [fe, Le] = E(""), [Gt, ft] = E(!1), [Bt, pt] = E(!1), [xe, ye] = E(() => /* @__PURE__ */ new Set()), gt = M(xe);
  gt.current = xe;
  const Qe = M(/* @__PURE__ */ new Map()), [Ne, Ie] = E(null), B = M(Ne);
  B.current = Ne;
  const [pe, Xe] = E(!1), s = M(pe);
  s.current = pe;
  const p = M(null), [T, _] = E("grid"), [x, z] = E(qr), [Me, Ye] = E(wo), [U, le] = E(!1), Ae = M(!1), [Fe, mt] = E(""), [H, Te] = E(""), [Ot, ht] = E(""), [Y, ir] = E(null), [Pt, at] = E(""), [be, yt] = E(!1), [Qr, Wr] = E({}), [zr, Hr] = E({}), Jt = M(/* @__PURE__ */ new Map()), Xr = M(null), or = M(null), Mt = M(0), ar = M(0), sr = M(null), bt = M(!1), Yr = JSON.stringify([
    ...new Set(
      (L == null ? void 0 : L.actions.flatMap(
        (o) => o.steps.flatMap((d) => d.tagIds)
      )) ?? []
    )
  ]);
  function wr(o) {
    const d = ti(o);
    Ye(d), vo(d);
  }
  function ai(o) {
    const d = o.shiftKey ? 40 : 16;
    let y = null;
    o.key === "ArrowLeft" && (y = Me + d), o.key === "ArrowRight" && (y = Me - d), o.key === "Home" && (y = _r), o.key === "End" && (y = Dr), y !== null && (o.preventDefault(), o.stopPropagation(), wr(y));
  }
  Q(() => {
    if (!H) return;
    const o = window.setTimeout(() => Te(""), 4e3);
    return () => window.clearTimeout(o);
  }, [H]), Q(() => {
    const o = JSON.parse(Yr);
    if (Hr({}), !o.length) return;
    const d = new AbortController();
    let y = !0;
    return Promise.all(
      o.map(async (S) => {
        var F;
        try {
          const k = await K(`/api/tags/${S}`, {
            signal: d.signal
          });
          return [S, ((F = k.name) == null ? void 0 : F.trim()) || null];
        } catch {
          return [S, null];
        }
      })
    ).then((S) => {
      y && Hr(Object.fromEntries(S));
    }), () => {
      y = !1, d.abort();
    };
  }, [Yr]), Q(() => {
    const o = L ? Wn(L.view.objectFilter) : [];
    if (Wr({}), !o.length) return;
    const d = new AbortController();
    let y = !0;
    return Promise.all(
      o.map(async (S) => {
        var F;
        try {
          const k = await K(`/api/tags/${S}`, {
            signal: d.signal
          });
          return (F = k.name) != null && F.trim() ? [String(S), k.name] : null;
        } catch {
          return null;
        }
      })
    ).then((S) => {
      y && Wr(
        Object.fromEntries(S.filter((F) => F !== null))
      );
    }), () => {
      y = !1, d.abort();
    };
  }, [L == null ? void 0 : L.id, L == null ? void 0 : L.view.objectFilter]);
  const vr = Et(
    () => L ? zn(
      L.view.objectFilter,
      Qr
    ) : (N == null ? void 0 : N.view.objectFilter) ?? {},
    [Qr, N, L]
  ), si = Et(
    () => W === "video" && Array.isArray(vr.customFieldCriteria) ? [...fr, yo] : W === "tag" ? qn : fr,
    [W, vr.customFieldCriteria]
  ), Zr = St(async () => {
    g(!0), h("");
    try {
      const o = await $i();
      r(o.reviews), c(o.storageKey), C(o.canWriteVideos ?? o.canWrite), I(o.canWriteTags ?? !1), R(o.canReadTagGroups ?? !1), re(o.canConfigure ?? !0), P(o.storageNotice ?? ""), ue && !o.reviews.some((d) => d.id === ue) && (At(""), vn(""));
    } catch (o) {
      h(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      g(!1);
    }
  }, [ue]);
  Q(() => {
    if (!O) {
      D([]), te("");
      return;
    }
    const o = new AbortController();
    return te(""), Vi(o.signal).then(D).catch((d) => {
      o.signal.aborted || te(
        d instanceof Error ? d.message : "Could not load tag groups."
      );
    }), () => o.abort();
  }, [O]), Q(() => {
    Zr();
  }, []), Q(() => {
    if (ue || t.length === 0) return;
    const o = new AbortController();
    tt({});
    for (const d of t)
      (d.entityType === "performerOccurrence" ? Bn(d, o.signal).then((S) => (S == null ? void 0 : S.length) === 0 ? { items: [], totalCount: 0 } : Xt(Jn(d, S), { ...d.view.filter, page: 1, perPage: 1 }, o.signal)) : Se(d) === "tag" ? fn(
        d,
        Oe({ ...d.view.filter, page: 1, perPage: 1 }),
        o.signal
      ) : Xt(
        d,
        Oe({ ...d.view.filter, page: 1, perPage: 1 }),
        o.signal
      )).then((S) => {
        o.signal.aborted || tt((F) => ({
          ...F,
          [d.id]: S.totalCount
        }));
      }).catch(() => {
        o.signal.aborted || tt((S) => ({ ...S, [d.id]: null }));
      });
    return () => o.abort();
  }, [ue, t]), Cn(() => {
    var o;
    ue || l || !Be.current || (Be.current = !1, (o = je.current) == null || o.focus());
  }, [ue, l]);
  const lr = St(async () => {
    at("");
    try {
      ir(await Gr());
    } catch (o) {
      ir(null), at(
        "Tag assessment setup could not be checked. " + (o instanceof Error ? o.message : "Request failed.")
      );
    }
  }, []);
  Q(() => {
    lr();
  }, [lr]);
  const wt = St(
    async (o, d, y = !1) => {
      var $;
      const S = ++Mt.current;
      ($ = sr.current) == null || $.abort();
      const F = new AbortController();
      sr.current = F, d = Oe(d);
      const k = Number(d.page);
      y && (d = { ...d, page: 1 }), It(d), pt(y), _e(!0), Le("");
      try {
        const ce = ($t) => Se(o) === "tag" ? fn(
          o,
          $t,
          F.signal
        ) : Xt(
          o,
          $t,
          F.signal
        );
        let J = await ce(d);
        const Re = Math.max(
          1,
          Math.ceil(J.totalCount / Number(d.perPage))
        ), $e = y ? Re : Math.min(k, Re);
        return Number(d.page) !== $e && (d = { ...d, page: $e }, J = await ce(d)), S === Mt.current && (Ge(J), It(d), Vt(d)), J;
      } catch (ce) {
        throw S === Mt.current && Le(
          ce instanceof Error ? ce.message : "Could not load the review queue."
        ), ce;
      } finally {
        S === Mt.current && _e(!1);
      }
    },
    []
  );
  Q(() => {
    var d;
    if (ar.current += 1, ut.current = -1, Mt.current += 1, (d = sr.current) == null || d.abort(), nr(!1), j(""), ke(!1), ye(/* @__PURE__ */ new Set()), Qe.current.clear(), Ie(null), Xe(!1), le(!1), Ae.current = !1, mt(""), Te(""), ht(""), Ge({ items: [], totalCount: 0 }), ft(!1), !N || he) {
      _e(!1);
      return;
    }
    let o = !0;
    return _e(!0), (async () => {
      let y = V ?? N;
      me(null);
      let S = null;
      const F = new URLSearchParams(window.location.search);
      if (Se(N) === "video" && br.some((J) => F.has(J)))
        try {
          const J = y;
          S = xr(J, F);
          const Re = Ct(J, S.query);
          (S.query.startFrom !== (J.view.startFrom ?? "end") || !yr(
            JSON.parse(st(Re)),
            JSON.parse(st(Ct(J, Zt(J))))
          )) && (y = Re, me(y));
        } catch (J) {
          ft(!0), Le(J instanceof Error ? J.message : "Could not read review URL."), _e(!1);
          return;
        }
      let k = null;
      try {
        k = await _i(a, N.id);
      } catch (J) {
        o && (ke(!0), j(
          J instanceof Error ? J.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const $ = (k == null ? void 0 : k.signature) === st(y) ? k : null, ce = S ? S.query.filter : $ ? Oe($.filter) : bo(y.view.filter);
      It(ce), _(
        $ ? wn($.displayMode, Se(N)) : bn(N)
      ), z(
        $ ? $.cardSize ?? qr : qr
      );
      try {
        const J = await wt(
          y,
          ce,
          S ? S.startAtEnd : !$ && y.view.startFrom !== "beginning"
        );
        if (!o) return;
        const Re = ln(
          J.items.map(($e) => $e.id),
          ($ == null ? void 0 : $.focusedId) ?? null,
          ($ == null ? void 0 : $.index) ?? 0
        );
        Ie(Re), we(Re);
      } catch {
      }
      o && (ut.current = rt, nr(!0));
    })(), () => {
      var y;
      o = !1, ar.current++, Mt.current++, (y = sr.current) == null || y.abort();
    };
  }, [N == null ? void 0 : N.id, he, rt]), Q(() => {
    !L || he || !de || G || fe || U || Rt.current || ut.current !== rt || Yt(L.id, {
      filter: ie,
      objectFilter: L.view.objectFilter,
      searchMode: L.view.searchMode,
      startFrom: L.view.startFrom ?? "end"
    });
  }, [L, he, de, G, fe, ie, U, rt]);
  const oe = Et(
    () => Ce.items.map((o) => o.id),
    [Ce.items]
  );
  Q(() => {
    if (!de || !N || !a || G || fe || U || (ee == null ? void 0 : ee.id) === N.id || ne)
      return;
    const o = {
      version: 1,
      signature: st(N),
      filter: ie,
      focusedId: Ne,
      index: Math.max(0, oe.indexOf(Ne ?? -1)),
      displayMode: T,
      cardSize: x,
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
    let d = !0;
    const y = window.setTimeout(() => {
      Di(a, N.id, o).catch((S) => {
        d && j(
          "Progress is kept in this browser, but account sync failed. " + (S instanceof Error ? S.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      d = !1, window.clearTimeout(y);
    };
  }, [
    de,
    a,
    N,
    G,
    fe,
    U,
    ie,
    Ne,
    oe,
    T,
    x,
    ee,
    w,
    ne
  ]);
  const li = Ce.items.find((o) => o.id === Ne) ?? null, Sr = W === "video" ? li : null;
  pe && Sr && (p.current = Sr);
  const vt = Sr ?? (pe ? p.current : null), ci = cn(xe, Ne), en = xe.size > 0 ? `${xe.size} selected ${W}${xe.size === 1 ? "" : "s"}` : Ne == null ? `no ${W}` : `focused ${W}`, we = St((o, d = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const y = Jt.current.get(o);
      y == null || y.focus({ preventScroll: !0 }), d && (y == null || y.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  Q(() => {
    de && !s.current && we(B.current);
  }, [de, we]), Q(() => {
    G || !oe.length || (B.current == null || !oe.includes(B.current)) && (Ie(oe[0]), s.current || we(oe[0]));
  }, [we, oe, G]);
  const Ft = St(
    (o) => {
      ye((d) => {
        const y = o(d);
        for (const S of /* @__PURE__ */ new Set([...d, ...y]))
          d.has(S) !== y.has(S) && Qe.current.set(
            S,
            (Qe.current.get(S) ?? 0) + 1
          );
        return y;
      });
    },
    []
  ), Er = St(
    (o) => {
      if (!oe.length) return;
      const d = Math.max(
        0,
        oe.indexOf(B.current ?? oe[0])
      ), y = oe[Math.max(0, Math.min(oe.length - 1, d + o))];
      Ie(y), s.current || we(y);
    },
    [we, oe]
  ), Cr = St(
    async (o) => {
      const d = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", y = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, S = y != null && (!O || !q.some((Z) => Z.id === y)), F = "effect" in o && d && !O, k = cn(
        gt.current,
        B.current
      );
      if (!N || Ae.current || G || fe || d && !qt || F || S || gr(o) && (Y == null ? void 0 : Y.kind) !== "ready" || !k.length)
        return;
      const $ = ++ar.current, ce = N.id, J = [...oe], Re = Ce, $e = B.current, $t = new Set(gt.current), Wt = new Map(
        k.map((Z) => [Z, Qe.current.get(Z) ?? 0])
      ), Lt = () => $ === ar.current && N.id === ce;
      Ae.current = !0, le(!0), mt(
        gt.current.size ? `${k.length} selected ${W}s` : `the focused ${W}`
      ), Te(""), ht("");
      const rn = Re.items.filter(
        (Z) => !k.includes(Z.id)
      ), bi = rn.map((Z) => Z.id), nn = dn(
        J,
        bi,
        $e,
        k.includes($e ?? -1)
      );
      Ge({
        items: rn,
        totalCount: Re.totalCount
      }), ye((Z) => {
        const ve = new Set(Z);
        for (const qe of k) ve.delete(qe);
        return ve;
      }), Ie(nn), s.current || we(nn);
      let Ar = !1;
      try {
        if ("effect" in o ? await Zi(o, k) : await Gn(o, k), Ar = !0, !Lt()) return;
        ye((Z) => {
          const ve = new Set(Z);
          for (const qe of k)
            (Qe.current.get(qe) ?? 0) === Wt.get(qe) && ve.delete(qe);
          return ve;
        }), Te(
          `${o.label}: ${k.length} ${W}${k.length === 1 ? "" : "s"} ${d ? "updated" : "skipped"}.`
        );
      } catch (Z) {
        if (!Lt()) return;
        Ge(Re), ye((ve) => {
          const qe = new Set(ve);
          for (const Ze of k)
            $t.has(Ze) && (Qe.current.get(Ze) ?? 0) === Wt.get(Ze) && qe.add(Ze);
          return qe;
        }), Ie($e), s.current || we($e), ht(
          Z instanceof Error ? Z.message : "Action failed."
        );
      }
      try {
        if (await Qi(o), !Lt()) return;
        const Z = await wt(N, ie);
        if (!Lt()) return;
        let ve = Z.items.map((qe) => qe.id);
        if (!ve.length && Z.totalCount > 0 && Number(ie.page) > 1) {
          const qe = Math.max(1, Number(ie.page) - 1), Ze = { ...ie, page: qe };
          It(Ze), ve = (await wt(N, Ze)).items.map((Tr) => Tr.id), ye(
            (Tr) => new Set([...Tr].filter((wi) => ve.includes(wi)))
          );
          const an = ve.at(-1) ?? null;
          Ie(an), s.current || we(an);
        } else {
          ye(
            (Ze) => new Set([...Ze].filter((on) => ve.includes(on)))
          );
          const qe = dn(
            J,
            ve,
            $e,
            Ar && k.includes($e ?? -1)
          );
          Ie(qe), s.current && qe == null && Xe(!1), s.current || we(qe);
        }
      } catch (Z) {
        Lt() && ht(
          (ve) => `${ve ? `${ve} ` : ""}${Ar ? "The action completed, but " : ""}the queue could not be refreshed. ${Z instanceof Error ? Z.message : "Refresh failed."}`
        );
      } finally {
        Lt() && (Ae.current = !1, le(!1), mt(""), Rt.current && (Rt.current = !1, At(kr()), nt((Z) => Z + 1)));
      }
    },
    [
      qt,
      O,
      q,
      W,
      Y,
      wt,
      ie,
      we,
      oe,
      Ce,
      G,
      fe,
      N
    ]
  );
  function di() {
    var y;
    if (T === "list") return 1;
    const o = (y = Xr.current) == null ? void 0 : y.firstElementChild, d = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, d.split(" ").filter(Boolean).length);
  }
  function ui(o) {
    if (he || o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || ae) return;
    if (pe && o.key === "Escape") {
      De(o), Xe(!1), we(B.current);
      return;
    }
    if (!_n(o.target)) return;
    if (o.key === "Escape") {
      De(o), Ft(() => /* @__PURE__ */ new Set());
      return;
    }
    const d = (N == null ? void 0 : N.actions.findIndex(
      (F, k) => lt(F, k) === o.key.toLowerCase()
    )) ?? -1;
    if (d >= 0 && (N != null && N.actions[d])) {
      De(o), !U && !G && Cr(N.actions[d]);
      return;
    }
    if (!pe && o.key === " ") {
      De(o), Ne != null && Ft((F) => ur(F, Ne));
      return;
    }
    if (!pe && o.key.toLowerCase() === "a") {
      De(o), Ft(
        (F) => Oi(F, oe)
      );
      return;
    }
    if (U || G || pe) return;
    if (o.key === "Enter" && Ne != null) {
      De(o), W === "tag" ? window.open(`/tag/${Ne}`, "_blank", "noopener,noreferrer") : Xe(!0);
      return;
    }
    const y = di(), S = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -y : o.key === "ArrowDown" ? y : 0;
    S && (De(o), Er(S));
  }
  function Qt(o) {
    He(null), ct(0), At(o), vn(o);
  }
  function fi() {
    Be.current = !0, tt({}), Qt("");
  }
  async function Nr(o) {
    if (!a) return !1;
    const d = o.map(No);
    try {
      await xi(a, d);
    } catch (S) {
      throw S;
    }
    r(d), ue && !d.some((S) => S.id === ue) && Qt("");
    const y = d.find((S) => S.id === ue);
    return y && He(null), y && V && JSON.stringify(y) !== JSON.stringify(V) && (y.view.displayMode !== V.view.displayMode && _(bn(y)), st(y) !== st(V) && (me(null), Se(y) === "video" && Yt(y.id, {
      filter: Oe(y.view.filter),
      objectFilter: y.view.objectFilter,
      searchMode: y.view.searchMode,
      startFrom: y.view.startFrom ?? "end"
    }), he || cr(
      y,
      Oe({ ...y.view.filter, page: ie.page })
    ))), !0;
  }
  if (l)
    return /* @__PURE__ */ n(Sn, { label: "Loading reviews…" });
  if (m)
    return /* @__PURE__ */ u(Pe, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Mo().catch(
            (o) => h(
              "Could not export browser reviews. " + (o instanceof Error ? o.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        En,
        {
          message: m,
          onRetry: () => void Zr()
        }
      )
    ] });
  return /* @__PURE__ */ u("div", { className: "data-quality-page", onKeyDown: ui, children: [
    /* @__PURE__ */ u("header", { className: "data-quality-header", children: [
      N && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: U,
          onClick: fi,
          children: /* @__PURE__ */ n(In, {})
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
          disabled: U || G || !X,
          onClick: () => {
            he ? ct((o) => o + 1) : (ge(!0), dt(!0));
          },
          children: /* @__PURE__ */ n(On, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: U || G || !X,
          onClick: () => {
            ge(!1), dt(!0);
          },
          children: /* @__PURE__ */ n(Ci, {})
        }
      )
    ] }),
    f && /* @__PURE__ */ n("p", { className: "dq-status", children: f }),
    L && (Y == null ? void 0 : Y.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      Y.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: be,
          onClick: () => {
            yt(!0), at(""), zi().then(lr).catch(
              (o) => at(
                "Could not create the Confirmed absent tags custom field. " + (o instanceof Error ? o.message : "Request failed.")
              )
            ).finally(() => yt(!1));
          },
          children: be ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    L && ((Y == null ? void 0 : Y.kind) === "incompatible" || Pt) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(Pr, {}),
      Pt || (Y == null ? void 0 : Y.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: be,
          onClick: () => {
            yt(!0), lr().finally(
              () => yt(!1)
            );
          },
          children: be ? "Checking…" : "Check again"
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
            const o = localStorage.getItem("page-videos") ?? "[]", d = URL.createObjectURL(
              new Blob([o], { type: "application/json" })
            ), y = document.createElement("a");
            y.href = d, y.download = "data-quality-unassigned-legacy-reviews.json", y.click(), URL.revokeObjectURL(d);
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
            j(""), ke(!1);
          },
          children: ne ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    L && /* @__PURE__ */ u("label", { className: "dq-layout-control", children: [
      "Review layout",
      /* @__PURE__ */ u(
        "select",
        {
          "aria-label": "Review layout",
          value: Kt,
          disabled: U || G || ae,
          onChange: (o) => He({ id: L.id, mode: o.target.value }),
          children: [
            /* @__PURE__ */ n("option", { value: "single", children: "Single video" }),
            /* @__PURE__ */ n("option", { value: "multiple", children: "Multiple videos" })
          ]
        }
      )
    ] }),
    N && V && !he && /* @__PURE__ */ u("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${U || G ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": U || G || void 0,
          inert: U || G ? !0 : void 0,
          onClickCapture: (o) => {
            var y, S, F, k, $;
            const d = o.target instanceof Element ? o.target.closest("button") : null;
            (d == null ? void 0 : d.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((y = d == null ? void 0 : d.textContent) == null ? void 0 : y.trim()) === "Clear all" ? bt.current = !0 : ((S = d == null ? void 0 : d.getAttribute("aria-label")) != null && S.startsWith("Filters") || (F = d == null ? void 0 : d.getAttribute("aria-label")) != null && F.startsWith("Edit filter:") || ((k = d == null ? void 0 : d.textContent) == null ? void 0 : k.trim()) === "Cancel" || ($ = d == null ? void 0 : d.getAttribute("aria-label")) != null && $.startsWith("Close ")) && (bt.current = !1);
          },
          onKeyDownCapture: (o) => {
            var y, S;
            const d = o.target instanceof Element ? o.target.closest("button") : null;
            (o.key === "Delete" || o.key === "Backspace") && (d == null ? void 0 : d.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (o.preventDefault(), o.stopPropagation(), bt.current = !0, (S = (y = d.parentElement) == null ? void 0 : y.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || S.click()) : o.key === "Escape" && (bt.current = !1);
          },
          children: /* @__PURE__ */ n(
            Ir,
            {
              filter: fe ? ot : ie,
              onFilterChange: pi,
              totalCount: Ce.totalCount,
              sortOptions: W === "tag" ? Rn : Ur,
              showSearch: !0,
              showSort: !0,
              displayMode: T,
              onDisplayModeChange: (o) => _(wn(o, W)),
              availableDisplayModes: W === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (x - 225) / 50,
              onZoomChange: (o) => z(Math.round(225 + o * 50)),
              cardSizeEntityType: W === "tag" ? "tags" : "videos",
              criteriaDefinitions: si,
              objectFilter: vr,
              onObjectFilterChange: (o) => {
                if (!U && !G) {
                  const d = W === "video" ? Hn(o) : o;
                  it.current = W === "video" ? Xn(
                    N.view.objectFilter,
                    d,
                    bt.current
                  ) : d, bt.current = !1;
                }
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (ee == null ? void 0 : ee.id) === ue && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: U || G || !X,
            onClick: mi,
            children: /* @__PURE__ */ n(kn, {})
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Reset to default review filters",
            title: "Reset to default review filters",
            disabled: U || G,
            onClick: gi,
            children: /* @__PURE__ */ n(Ni, {})
          }
        )
      ] })
    ] }),
    N ? he ? /* @__PURE__ */ n(fo, { review: N, canWrite: N.entityType === "performerOccurrence" ? b : v, onBusy: le, editRequest: ze, renderRuleEditor: (o, d, y) => /* @__PURE__ */ n(ii, { workspace: !0, draft: o, entityTypeLocked: !0, tagGroups: q, saving: y, setDraft: (S) => d(S), onSave: () => {
    }, onCancel: () => {
    } }), onSaveDefaults: X ? (o) => Nr(t.map((d) => d.id === o.id ? o : d)) : void 0 }, N.id) : /* @__PURE__ */ u(Pe, { children: [
      L && Ve.error && /* @__PURE__ */ n("p", { role: "alert", children: Ve.error }),
      L && /* @__PURE__ */ n(
        mo,
        {
          videos: Ce.items,
          review: L,
          trees: Ve.ids,
          disabled: U || G,
          onChoose: (o) => {
            const d = ho(L, o);
            me(d), cr(d, { ...ie, page: 1 });
          }
        }
      ),
      Ot && !pe && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(Pr, {}),
        Ot
      ] }),
      H && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: H }),
      tn("top"),
      /* @__PURE__ */ u(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${Me}px`
          },
          children: [
            /* @__PURE__ */ u("main", { children: [
              G && !Ce.items.length && /* @__PURE__ */ n(Sn, { label: "Loading review queue…" }),
              fe && !G && /* @__PURE__ */ n(
                En,
                {
                  message: fe,
                  retryLabel: Gt ? "Reset to review defaults" : "Retry",
                  onRetry: () => {
                    if (Gt && V && Se(V) === "video") {
                      const o = Zt(V);
                      Yt(V.id, { ...o, filter: { ...o.filter, page: void 0 } }), nt((d) => d + 1);
                      return;
                    }
                    wt(
                      N,
                      ie,
                      Bt
                    ).catch(() => {
                    });
                  }
                }
              ),
              !U && !G && !fe && !Ce.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(Mr, {}),
                /* @__PURE__ */ u("p", { children: [
                  "No ",
                  W,
                  "s match this review."
                ] })
              ] }),
              !!Ce.items.length && /* @__PURE__ */ n("div", { ref: Xr, children: /* @__PURE__ */ n(
                "div",
                {
                  className: T === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${x}px`
                  },
                  children: Ce.items.map(yi)
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
                "aria-valuemin": _r,
                "aria-valuemax": Dr,
                "aria-valuenow": Me,
                "aria-valuetext": `${Me} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (o) => {
                  or.current = {
                    pointerId: o.pointerId,
                    startX: o.clientX,
                    startWidth: Me
                  }, o.currentTarget.setPointerCapture(o.pointerId);
                },
                onPointerMove: (o) => {
                  const d = or.current;
                  (d == null ? void 0 : d.pointerId) === o.pointerId && o.currentTarget.hasPointerCapture(o.pointerId) && wr(
                    d.startWidth + d.startX - o.clientX
                  );
                },
                onPointerUp: () => {
                  or.current = null;
                },
                onPointerCancel: () => {
                  or.current = null;
                },
                onKeyDown: ai,
                onDoubleClick: () => wr(Jr),
                children: /* @__PURE__ */ n("span", {})
              }
            ),
            /* @__PURE__ */ u("aside", { className: "dq-actions", children: [
              xe.size > 0 && /* @__PURE__ */ n("strong", { children: en }),
              N.actions.map((o, d) => {
                const y = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", S = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, F = S != null ? q.find(($) => $.id === S) : void 0, k = S != null && !F;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    disabled: U || G || !!fe || y && !qt || "effect" in o && y && (!O || k) || gr(o) && (Y == null ? void 0 : Y.kind) !== "ready" || !ci.length,
                    onClick: () => void Cr(o),
                    children: [
                      /* @__PURE__ */ u("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: o.label }),
                        "effect" in o ? /* @__PURE__ */ n("small", { children: o.effect.mode === "SKIP" ? "Skip" : o.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : F ? `Assign ${F.name}` : "Unavailable tag group" }) : o.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: o.steps.flatMap(
                          ($, ce) => $.tagIds.map((J, Re) => {
                            const $e = zr[J] === void 0 ? "Tag" : zr[J] ?? "Unavailable tag", $t = ni($, $e), Wt = So($, $e);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": ri($.mode),
                                "aria-label": Wt,
                                title: `Step ${ce + 1}: ${Wt}`,
                                children: $t
                              },
                              `${ce}-${J}-${Re}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      lt(o, d) && /* @__PURE__ */ n("kbd", { children: lt(o, d) })
                    ]
                  },
                  o.id
                );
              }),
              !N.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              !qt && /* @__PURE__ */ u("p", { children: [
                W === "tag" ? "Tag" : "Video",
                " write permission is required to apply actions."
              ] }),
              W === "tag" && A && /* @__PURE__ */ u("p", { children: [
                "Tag groups are unavailable. ",
                A
              ] }),
              U && /* @__PURE__ */ u("p", { role: "status", children: [
                /* @__PURE__ */ n(Mn, { className: "dq-spin" }),
                " Applying action to",
                " ",
                Fe,
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
      tn("bottom")
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
                  ref: je,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ n("p", { children: "Choose a review to open its queue." }),
              /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                (o) => Ue[o.id] !== void 0
              ) ? t.some((o) => Ue[o.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: Ee,
                    onChange: (o) => Tt(
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
                  onClick: () => jt(
                    (o) => o === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    Pn,
                    {
                      className: se === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: kt.map((o) => {
            const d = Ue[o.id], y = Se(o), S = y === "tag" ? "tag" : y === "performerOccurrence" ? "scene" : "video";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                disabled: U,
                onClick: () => Qt(o.id),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ u("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(Yn, { entityType: y }),
                      /* @__PURE__ */ n("strong", { children: o.name })
                    ] }),
                    /* @__PURE__ */ n(
                      "span",
                      {
                        className: "dq-review-count",
                        "aria-label": d === void 0 ? `Counting matching ${S}s` : d === null ? `Matching ${S} count unavailable` : `${d.toLocaleString()} matching ${d === 1 ? S : `${S}s`}`,
                        children: d === void 0 ? "…" : d === null ? "—" : d.toLocaleString()
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
      /* @__PURE__ */ n(Mr, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    pe && vt && L && /* @__PURE__ */ n(
      qo,
      {
        video: vt,
        review: L,
        targetLabel: en,
        pending: U,
        refreshing: G || !!fe,
        error: Ot,
        canWrite: v,
        assessmentReady: (Y == null ? void 0 : Y.kind) === "ready",
        selected: xe.has(vt.id),
        hasPrevious: oe.indexOf(vt.id) > 0,
        hasNext: oe.indexOf(vt.id) >= 0 && oe.indexOf(vt.id) < oe.length - 1,
        onToggleSelected: () => Ft((o) => ur(o, vt.id)),
        onPrevious: () => Er(-1),
        onNext: () => Er(1),
        onClose: () => {
          Xe(!1), we(B.current);
        },
        onAction: Cr
      }
    ),
    ae && /* @__PURE__ */ n(
      ko,
      {
        reviews: t,
        activeReview: V,
        tagGroups: q,
        initialEdit: Ke,
        onSave: Nr,
        onChoose: Qt,
        onEditWorkspace: (o) => {
          o !== ue && Qt(o), He({ id: o, mode: "single" }), ct((d) => d + 1), dt(!1);
        },
        onClose: () => {
          dt(!1), Ke && we(B.current, !1);
        }
      }
    )
  ] });
  async function cr(o, d, y = !1) {
    const S = B.current, F = Math.max(0, oe.indexOf(S ?? -1));
    try {
      const $ = (await wt(o, d, y)).items.map((J) => J.id);
      ye(
        (J) => new Set([...J].filter((Re) => $.includes(Re)))
      );
      const ce = ln($, S, F);
      Ie(ce), s.current || we(ce, !1);
    } catch {
    }
  }
  function pi(o) {
    const d = it.current;
    if (it.current = null, U || G || !N || !V) return;
    const y = d ?? N.view.objectFilter, S = yr(
      y,
      V.view.objectFilter
    ) ? V.view.objectFilter : y, F = Oe({ ...o, page: 1 }), k = {
      ...N,
      view: {
        ...N.view,
        filter: F,
        objectFilter: S
      }
    }, $ = st(k) !== st(V), ce = $ ? k : V;
    me($ ? k : null), Te($ ? "" : "Review queue defaults restored."), cr(ce, F, !0);
  }
  function gi() {
    if (U || G || !V) return;
    it.current = null;
    const o = Oe({
      ...V.view.filter,
      page: 1
    });
    me(null), Te("Review queue defaults restored."), cr(
      V,
      o,
      V.view.startFrom !== "beginning"
    );
  }
  function mi() {
    U || G || !N || !V || !X || Nr(
      t.map(
        (o) => o.id === ue ? {
          ...o,
          view: {
            ...N.view,
            filter: { ...ie, page: 1 }
          }
        } : o
      )
    ).then(() => {
      me(null), Te("Queue saved to this review.");
    }).catch(
      (o) => ht(
        o instanceof Error ? o.message : "Could not save queue."
      )
    );
  }
  function hi() {
    ye(/* @__PURE__ */ new Set()), Qe.current.clear(), Ie(null);
  }
  function tn(o) {
    return N ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: U || G,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          An,
          {
            filter: {
              ...ie,
              page: Number(ie.page) || 1,
              perPage: Number(ie.perPage) || 40
            },
            totalCount: Ce.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${o}`,
            onFilterChange: (d) => {
              U || G || d.page === Number(ie.page) || Co(
                { ...ie, page: d.page },
                N,
                wt,
                hi
              );
            }
          }
        )
      }
    ) : null;
  }
  function yi(o) {
    var y, S, F;
    if (W === "tag") {
      const k = o;
      return /* @__PURE__ */ n(
        Ao,
        {
          tag: k,
          displayMode: T === "list" ? "list" : "grid",
          focused: k.id === Ne,
          selected: xe.has(k.id),
          setRef: ($) => {
            $ ? Jt.current.set(k.id, $) : Jt.current.delete(k.id);
          },
          onFocus: () => Ie(k.id),
          onToggle: () => {
            Ft(($) => ur($, k.id)), we(k.id, !1);
          },
          onOpen: () => window.open(`/tag/${k.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        k.id
      );
    }
    const d = o;
    return /* @__PURE__ */ n(
      To,
      {
        video: go(d, L, Ve.ids),
        showTagBins: ((S = (y = L == null ? void 0 : L.presentation) == null ? void 0 : y.annotations) == null ? void 0 : S.includes("tags")) && !!((F = L.presentation.annotationParents) != null && F.length),
        displayMode: T,
        focused: d.id === Ne,
        selected: xe.has(d.id),
        setRef: (k) => {
          k ? Jt.current.set(d.id, k) : Jt.current.delete(d.id);
        },
        onFocus: () => Ie(d.id),
        onToggle: () => Ft((k) => ur(k, d.id)),
        onPreview: () => {
          Ie(d.id), Xe(!0);
        },
        onNavigate: e
      },
      d.id
    );
  }
}
function Co(e, t, r, i) {
  i(), r(t, e).catch(() => {
  });
}
function ur(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function No(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Ao({
  tag: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: a,
  onFocus: c,
  onToggle: l,
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
      onFocus: c,
      onClick: (h) => {
        c(), h.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        Si,
        {
          tag: e,
          selected: i,
          onSelect: l,
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
              h.stopPropagation(), l();
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
function To({
  video: e,
  showTagBins: t,
  displayMode: r,
  focused: i,
  selected: a,
  setRef: c,
  onFocus: l,
  onToggle: g,
  onPreview: m,
  onNavigate: h
}) {
  var R, q;
  const v = Zn(e), C = M(null), b = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, I = !!(b.date || b.studioName), O = !!(b.performers.length || b.tags.length);
  return Cn(() => {
    const D = C.current;
    if (!D) return;
    const A = D.querySelector(
      `a[href="/video/${e.id}"]`
    ), te = D.querySelector(".card-title"), X = `dq-card-title-${e.id}`;
    te && (te.id = X), A && (A.target = "_blank", A.rel = "noreferrer", A.removeAttribute("aria-label"), A.setAttribute("aria-labelledby", X), A.classList.add("dq-card-link"));
    const re = D.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    re && re.setAttribute(
      "aria-label",
      a ? `Deselect ${v}` : `Select ${v}`
    );
    const f = D.querySelector(
      'button[title="Quick View"]'
    );
    f && f.setAttribute("aria-label", `Preview ${v}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (D) => {
        C.current = D, c(D);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${v}${a ? ", selected" : ""}`,
      onFocus: l,
      onClick: (D) => {
        l(), D.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${r} ${I ? "has-card-metadata" : "no-card-metadata"} ${O ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${a ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          Ei,
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
          (R = e.tags) == null ? void 0 : R.map((D) => /* @__PURE__ */ n("span", { children: D.name }, D.id)),
          !((q = e.tags) != null && q.length) && /* @__PURE__ */ n("small", { children: "No matching tags" })
        ] }),
        r === "wall" && /* @__PURE__ */ n(Ro, { video: e })
      ]
    }
  );
}
function Ro({ video: e }) {
  const t = M(null), r = M(null), [i, a] = E(!1), [c, l] = E(!1), [g, m] = E(!1);
  return Q(() => {
    const h = t.current;
    if (!h || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      a(!0), l(!0);
      return;
    }
    const v = new IntersectionObserver(
      ([b]) => a(b.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), C = new IntersectionObserver(
      ([b]) => l(b.isIntersecting && b.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return v.observe(h), C.observe(h), () => {
      v.disconnect(), C.disconnect();
    };
  }, [e.id, e.files.length]), Q(() => {
    if (!i) {
      m(!1);
      return;
    }
    const h = new AbortController();
    return K(Ji(e.id), {
      signal: h.signal
    }).then((v) => {
      h.signal.aborted || m(v.available === !0);
    }).catch(() => {
      h.signal.aborted || m(!1);
    }), () => h.abort();
  }, [i, e.id]), Q(() => {
    const h = r.current;
    h && (c ? Promise.resolve(h.play()).catch(() => {
    }) : h.pause());
  }, [g, c]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: g && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: Bi(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function qo({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: a,
  error: c,
  canWrite: l,
  assessmentReady: g,
  selected: m,
  hasPrevious: h,
  hasNext: v,
  onToggleSelected: C,
  onPrevious: b,
  onNext: I,
  onClose: O,
  onAction: R
}) {
  const q = M(null), D = M(null), A = e.files[0], te = Zn(e);
  Q(() => {
    var P;
    const f = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (P = q.current) == null || P.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = f;
    };
  }, []);
  function X(f) {
    var j, ne, ke;
    if (f.key !== "Tab") return;
    const P = [
      ...((j = q.current) == null ? void 0 : j.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((de) => de.offsetParent !== null);
    if (!P.length) {
      f.preventDefault(), (ne = q.current) == null || ne.focus();
      return;
    }
    const w = P.indexOf(
      document.activeElement
    );
    f.shiftKey && w <= 0 ? (f.preventDefault(), (ke = P.at(-1)) == null || ke.focus()) : !f.shiftKey && w === P.length - 1 && (f.preventDefault(), P[0].focus());
  }
  function re(f) {
    if (f.defaultPrevented || f.ctrlKey || f.metaKey || f.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const P = f.key === "ArrowLeft" || f.key === "ArrowRight";
    if (f.altKey && !P) return;
    const w = D.current, j = f.currentTarget.querySelector("video");
    if (f.key === "Enter" || f.key === "Escape")
      f.repeat || O();
    else if (f.key === " " && w)
      f.repeat || w.toggle();
    else if (P && w)
      w.seekBy(
        (f.key === "ArrowLeft" ? -1 : 1) * (f.shiftKey ? 5 : f.altKey ? 10 : 60)
      );
    else if ((f.key === "," || f.key === ".") && w) {
      const ne = [A == null ? void 0 : A.duration, j == null ? void 0 : j.duration].find(
        (de) => de != null && Number.isFinite(de) && de > 0
      ) ?? 0, ke = e.parentVideoId != null ? (e.clipEndSec ?? ne) - (e.clipStartSec ?? 0) : ne;
      Number.isFinite(ke) && ke > 0 && w.seekBy((f.key === "," ? -1 : 1) * ke * 0.1);
    } else if (f.key.toLowerCase() === "n" || f.key.toLowerCase() === "m")
      !f.repeat && !i && !a && (f.key.toLowerCase() === "n" && h && b(), f.key.toLowerCase() === "m" && v && I());
    else if (f.key === "ArrowUp" && j)
      j.volume = Math.min(1, j.volume + 0.1);
    else if (f.key === "ArrowDown" && j)
      j.volume = Math.max(0, j.volume - 0.1);
    else return;
    De(f);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: q,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${te}`,
      className: "dq-preview",
      onKeyDown: X,
      onKeyDownCapture: re,
      onMouseDown: (f) => {
        f.target === f.currentTarget && O();
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
              children: /* @__PURE__ */ n(In, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !v || i || a,
              onClick: I,
              children: /* @__PURE__ */ n(Pn, {})
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
              "aria-label": `Open ${te} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ n(Ti, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: O,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(Fn, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: A ? /* @__PURE__ */ n(
          Tn,
          {
            autostart: !0,
            streamUrl: Vn(e.id),
            posterUrl: pn(e),
            format: A.format,
            audioCodec: A.audioCodec,
            duration: A.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (f) => (D.current = f, () => {
              D.current === f && (D.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: pn(e), alt: "" }) }),
        c && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: c }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((f, P) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: i || a || f.steps.length > 0 && !l || gr(f) && !g,
            onClick: () => void R(f),
            children: [
              lt(f, P) && /* @__PURE__ */ n("kbd", { children: lt(f, P) }),
              f.label
            ]
          },
          f.id
        )) })
      ] })
    }
  );
}
function ko({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: i = !1,
  onEditWorkspace: a,
  onSave: c,
  onChoose: l,
  onClose: g
}) {
  const [m, h] = E(
    () => i && t ? structuredClone(t) : null
  ), [v, C] = E(""), [b, I] = E(!1), [O, R] = E(
    i && t != null
  ), q = M(null);
  Q(() => {
    var w, j;
    const f = document.activeElement, P = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (j = (w = q.current) == null ? void 0 : w.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || j.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = P, f == null || f.focus({ preventScroll: !0 });
    };
  }, []);
  function D(f) {
    var j, ne, ke;
    if (f.defaultPrevented) {
      f.stopPropagation();
      return;
    }
    if (f.key === "Escape") {
      De(f), b || g();
      return;
    }
    if (f.key !== "Tab") {
      f.stopPropagation();
      return;
    }
    const P = [
      ...((j = q.current) == null ? void 0 : j.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((de) => de.offsetParent !== null);
    if (!P.length) {
      De(f), (ne = q.current) == null || ne.focus();
      return;
    }
    const w = P.indexOf(
      document.activeElement
    );
    f.shiftKey && w <= 0 ? (De(f), (ke = P.at(-1)) == null || ke.focus()) : !f.shiftKey && w === P.length - 1 ? (De(f), P[0].focus()) : f.stopPropagation();
  }
  function A(f, P = !!f) {
    R(P), h(
      f ? structuredClone(f) : {
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
  async function te() {
    if (b) return;
    if (!m || pr(m)) {
      C(m ? pr(m) : "Choose a review.");
      return;
    }
    const f = { ...m, name: m.name.trim() }, P = e.some((w) => w.id === f.id) ? e.map((w) => w.id === f.id ? f : w) : [...e, f];
    I(!0), C("");
    try {
      if (!await c(P)) throw new Error("Could not save reviews.");
      !e.some((w) => w.id === f.id) && f.entityType !== "tag" ? a(f.id) : (l(f.id), g());
    } catch (w) {
      C(
        "Could not save reviews. Your edits are still open. " + (w instanceof Error ? w.message : "Retry saving.")
      );
    } finally {
      I(!1);
    }
  }
  async function X(f) {
    if (!b) {
      I(!0), C("");
      try {
        if (!await c(f)) throw new Error("Could not save reviews.");
      } catch (P) {
        C(
          P instanceof Error ? P.message : "Could not save reviews."
        );
      } finally {
        I(!1);
      }
    }
  }
  async function re(f) {
    var w;
    if (b) return;
    const P = (w = f.target.files) == null ? void 0 : w[0];
    if (f.target.value = "", !!P) {
      if (P.size > 2e6) {
        C("Review files must be smaller than 2 MB.");
        return;
      }
      I(!0), C("");
      try {
        const j = er(await P.text());
        if (!await c(Fr(e, j)))
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
      ref: q,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: D,
      children: /* @__PURE__ */ u("div", { className: "dq-manager", children: [
        /* @__PURE__ */ u("header", { children: [
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: m ? e.some((f) => f.id === m.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: b,
              onClick: g,
              children: /* @__PURE__ */ n(Fn, {})
            }
          )
        ] }),
        v && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: v }),
        /* @__PURE__ */ n("fieldset", { disabled: b, className: "dq-manager-content", children: m ? /* @__PURE__ */ n(
          ii,
          {
            setup: m.entityType !== "tag" && !e.some((f) => f.id === m.id),
            draft: m,
            entityTypeLocked: O,
            tagGroups: r,
            saving: b,
            setDraft: h,
            onSave: () => void te(),
            onCancel: g
          }
        ) : /* @__PURE__ */ u(Pe, { children: [
          /* @__PURE__ */ u("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: () => {
              const f = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), P = document.createElement("a");
              P.href = f, P.download = "data-quality-reviews.json", P.click(), URL.revokeObjectURL(f);
            }, children: "Export reviews" }),
            /* @__PURE__ */ u(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => A(),
                children: [
                  /* @__PURE__ */ n(Ri, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ u("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(qi, {}),
              " Import reviews",
              /* @__PURE__ */ n(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: re
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((f) => /* @__PURE__ */ u("article", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ u("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(Yn, { entityType: Se(f) }),
                /* @__PURE__ */ n("strong", { children: f.name })
              ] }),
              /* @__PURE__ */ n("p", { children: f.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => f.entityType === "tag" || Se(f) === "video" && f.view.reviewMode === "multiple" ? A(f) : a(f.id), children: [
              /* @__PURE__ */ n(On, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => A({
                  ...structuredClone(f),
                  id: crypto.randomUUID(),
                  name: `${f.name} copy`
                }, !0),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${f.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${f.name}”?`) && X(
                    e.filter((P) => P.id !== f.id)
                  );
                },
                children: /* @__PURE__ */ n($n, {})
              }
            )
          ] }, f.id)) })
        ] }) })
      ] })
    }
  );
}
function ii({
  workspace: e = !1,
  setup: t = !1,
  draft: r,
  entityTypeLocked: i,
  tagGroups: a,
  saving: c = !1,
  setDraft: l,
  onSave: g,
  onCancel: m
}) {
  const [h, v] = E("Review"), C = Se(r), b = (R) => {
    if (!(i || R === C)) {
      if (R === "performerOccurrence") {
        l({
          id: r.id,
          entityType: R,
          name: r.name,
          description: r.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end" },
          actions: [],
          occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: !0 }
        });
        return;
      }
      l(
        R === "tag" ? {
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
  }, I = M(/* @__PURE__ */ new WeakMap()), O = (R) => {
    let q = I.current.get(R);
    return q || (q = crypto.randomUUID(), I.current.set(R, q)), q;
  };
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      vi,
      {
        tabs: (t ? ["Review"] : e ? ["Review", ...C === "video" ? ["Appearance"] : [], "Actions", ...C === "performerOccurrence" ? ["Tag choices"] : []] : C === "performerOccurrence" ? ["Review", "Queue", "Actions", ...r.occurrence.tagIds.length ? ["Tag choices"] : []] : ["Review", "Queue", "Appearance", "Actions"]).map((R) => ({
          key: R,
          label: R,
          count: R === "Actions" ? r.actions.length : void 0,
          disabled: c
        })),
        activeTab: h,
        onTabChange: v
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
              onChange: (R) => b(R.target.value),
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
              onChange: (R) => l({ ...r, name: R.target.value })
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
              onChange: (R) => l({ ...r, description: R.target.value })
            }
          )
        ] })
      ] }),
      !e && !t && /* @__PURE__ */ u("section", { hidden: h !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ n(yn, { draft: r, onChange: l, presentation: !1 }),
        r.entityType === "performerOccurrence" && /* @__PURE__ */ n(hn, { review: r, onChange: l })
      ] }),
      !t && r.entityType === "performerOccurrence" && /* @__PURE__ */ n("section", { hidden: h !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n(hn, { review: r, onChange: l, choices: !0 }) }),
      !t && (!e || C === "video") && /* @__PURE__ */ n("section", { hidden: h !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(yn, { draft: r, onChange: l, queue: !1 }) }),
      !t && /* @__PURE__ */ n("section", { hidden: h !== "Actions", className: "dq-editor-section", children: C === "tag" ? /* @__PURE__ */ n(
        Oo,
        {
          draft: r,
          saving: c,
          tagGroups: a,
          setDraft: l
        }
      ) : /* @__PURE__ */ n(
        Io,
        {
          draft: r,
          saving: c,
          stepKey: O,
          rememberStepKey: (R, q) => I.current.set(R, O(q)),
          setDraft: l
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
            const R = URL.createObjectURL(
              new Blob([JSON.stringify([r], null, 2)], {
                type: "application/json"
              })
            ), q = document.createElement("a");
            q.href = R, q.download = "data-quality-review.json", q.click(), URL.revokeObjectURL(R);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: m, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: g, children: t ? "Create & configure" : "Save review" })
    ] })
  ] });
}
function oi({
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
function Io({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: i,
  setDraft: a
}) {
  const c = (l, g) => a({
    ...e,
    actions: e.actions.map(
      (m, h) => h === l ? g : m
    )
  });
  return /* @__PURE__ */ u(Pe, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    e.entityType === "performerOccurrence" && /* @__PURE__ */ n("p", { children: "Actions apply only to the active performer in this scene. Set performer matching in the review filters below. Save review keeps those criteria with this rule." }),
    /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      Or,
      {
        items: e.actions,
        getKey: (l) => l.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (l) => a({ ...e, actions: l }),
        renderItem: (l, { index: g, dragHandleProps: m, isOver: h }) => /* @__PURE__ */ u(
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
                    children: /* @__PURE__ */ n(jr, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: l.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => a({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, g + 1),
                        {
                          ...structuredClone(l),
                          id: crypto.randomUUID(),
                          label: l.label + " copy"
                        },
                        ...e.actions.slice(g + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                oi,
                {
                  action: l,
                  onChange: (v) => c(g, v)
                }
              ),
              /* @__PURE__ */ n(
                Or,
                {
                  items: l.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (v) => c(g, { ...l, steps: v }),
                  renderItem: (v, C) => /* @__PURE__ */ n(
                    Po,
                    {
                      occurrence: e.entityType === "performerOccurrence",
                      dragHandleProps: C.dragHandleProps,
                      saving: t,
                      isOver: C.isOver,
                      step: v,
                      index: C.index,
                      onChange: (b) => {
                        i(b, v), c(g, {
                          ...l,
                          steps: l.steps.map(
                            (I, O) => O === C.index ? b : I
                          )
                        });
                      },
                      onRemove: () => c(g, {
                        ...l,
                        steps: l.steps.filter(
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
                    onClick: () => c(g, {
                      ...l,
                      steps: [...l.steps, { mode: "ADD", tagIds: [] }]
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
                        (v, C) => C !== g
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
function Oo({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: i
}) {
  const a = (c, l) => i({
    ...e,
    actions: e.actions.map(
      (g, m) => m === c ? l : g
    )
  });
  return /* @__PURE__ */ u(Pe, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      Or,
      {
        items: e.actions,
        getKey: (c) => c.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (c) => i({ ...e, actions: c }),
        renderItem: (c, { index: l, dragHandleProps: g, isOver: m }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: m ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ u("legend", { children: [
                "Action ",
                l + 1
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...g,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${l + 1}`,
                    children: /* @__PURE__ */ n(jr, {})
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
                        ...e.actions.slice(0, l + 1),
                        {
                          ...structuredClone(c),
                          id: crypto.randomUUID(),
                          label: c.label + " copy"
                        },
                        ...e.actions.slice(l + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                oi,
                {
                  action: c,
                  onChange: (h) => a(l, h)
                }
              ),
              /* @__PURE__ */ u("label", { children: [
                "Action effect",
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: c.effect.mode === "SET_TAG_GROUP" ? `group:${c.effect.tagGroupId}` : c.effect.mode,
                    onChange: (h) => {
                      const v = h.target.value;
                      a(l, {
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
                        (h) => h.id === c.effect.tagGroupId
                      ) && /* @__PURE__ */ n(
                        "option",
                        {
                          value: `group:${c.effect.tagGroupId}`,
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
                      (h, v) => v !== l
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
function Po({
  occurrence: e = !1,
  step: t,
  index: r,
  dragHandleProps: i,
  saving: a,
  isOver: c,
  onChange: l,
  onRemove: g
}) {
  const m = ri(t.mode);
  return /* @__PURE__ */ u(
    "div",
    {
      className: c ? "dq-action-step dq-drag-over" : "dq-action-step",
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
            children: /* @__PURE__ */ n(jr, {})
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
            onChange: (h) => l({ ...t, mode: h.target.value }),
            children: [
              /* @__PURE__ */ n("option", { value: "ADD", children: "Add tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE", children: "Remove tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE_TREE", children: "Remove tags and descendants" }),
              !e && /* @__PURE__ */ u(Pe, { children: [
                /* @__PURE__ */ n("option", { value: "MARK_PRESENT", children: "Mark present" }),
                /* @__PURE__ */ n("option", { value: "MARK_ABSENT", children: "Mark absent" }),
                /* @__PURE__ */ n("option", { value: "CLEAR_ABSENCE", children: "Clear absence" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ n("div", { className: "dq-step-tags", children: /* @__PURE__ */ n(
          et,
          {
            entityType: "tag",
            values: t.tagIds,
            onChange: (h) => l({ ...t, tagIds: h }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: g, children: /* @__PURE__ */ n($n, {}) })
      ]
    }
  );
}
async function Mo() {
  const e = await K("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const l = JSON.parse(r);
      Array.isArray(l.reviews) && (i = JSON.stringify(l.reviews, null, 2));
    } catch {
    }
  const a = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), c = document.createElement("a");
  c.href = a, c.download = "data-quality-browser-recovery.json", c.click(), URL.revokeObjectURL(a);
}
function Sn({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(Mn, { className: "dq-spin" }),
    e
  ] });
}
function En({
  message: e,
  onRetry: t,
  retryLabel: r = "Retry"
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(Pr, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: r })
  ] });
}
const Do = { components: { DataQualityPage: Eo } };
export {
  Eo as DataQualityPage,
  Do as default,
  yr as objectFiltersEqual
};
