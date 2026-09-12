import { jsxs as u, jsx as n, Fragment as Oe } from "react/jsx-runtime";
import { useRef as M, useState as E, useMemo as Et, useEffect as J, useCallback as St, useLayoutEffect as Nn } from "react";
import { DetailListToolbar as Pr, VIDEO_SORT_OPTIONS as Kr, VIDEO_CRITERIA as mr, EntityReferenceMultiSelector as ot, PERFORMER_CRITERIA as ln, FilterDialog as An, DetailListPagination as Tn, VideoPlayer as Rn, TAG_SORT_OPTIONS as qn, TAG_CRITERIA as kn, EntityDetailTabs as Si, TagTile as Ei, VideoCard as Ci, SortableList as Mr } from "@cove/runtime/components";
import { Save as Vr, RotateCcw as In, ChevronLeft as On, Pencil as Pn, Settings as Ni, AlertTriangle as Fr, ChevronRight as Mn, Film as $r, Loader2 as Fn, Tags as Ai, ExternalLink as Ti, X as $n, Plus as Ri, Upload as qi, Trash2 as Ln, GripVertical as Gr } from "@cove/runtime/lucide-react";
import { extensionFetch as ki } from "@cove/runtime/api";
function ve(e) {
  return e.entityType ?? "video";
}
function pt(e, t) {
  return "qwertyuiop"[t] ?? "";
}
function hr(e) {
  if (e.entityType === "performerOccurrence") {
    if (!_n(e.occurrence))
      return "Complete the optional occurrence condition before saving.";
    if (e.actions.some((t) => t.steps.some((r) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(r.mode))))
      return "Occurrence actions support adding and removing tags on the active performer. Video tag assessments are not supported here.";
  }
  return ve(e) === "video" && e.actions.some(
    (t) => xn(t)
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
function cn(e, t, r) {
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
  ) && !xn(e) : !1;
}
function yr(e) {
  return "steps" in e ? e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  ) : !1;
}
function xn(e) {
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
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || r.entityType === "video" || r.entityType === "tag" || r.entityType === "performerOccurrence") && (r.entityType !== "performerOccurrence" || _n(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && (r.view.reviewMode === void 0 || ["single", "multiple"].includes(r.view.reviewMode)) && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Ii(r.presentation, r.entityType === "tag") && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
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
function Lr(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const a of i)
      r.has(a.id) || (r.add(a.id), t.push(a));
  return t;
}
function _n(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (i) => Array.isArray(i) && i.every((a) => Number.isSafeInteger(a) && a > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && (t.targetMode !== "selected" || t.performerIds.length > 0) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && ["any", "includes", "includesAll", "excludes", "isNull"].includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && r(t.tagIds) && typeof t.multiple == "boolean";
}
function dn(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function un(e, t, r, i) {
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
function Dn(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const Un = "ext:com.midnightrider.data-quality:configuration", Pi = "ext:cove-data-quality:video-reviews", xr = "ext:com.midnightrider.data-quality:progress", ir = /* @__PURE__ */ new Map(), pr = /* @__PURE__ */ new Map(), _t = (e, t) => e.includes("*") || e.includes(t), br = (e) => K(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Mi = () => ({
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
      const s = nr(c);
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
async function jn(e) {
  const t = await K("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Kn(e, t) {
  const r = (pr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return pr.set(e, r), r.finally(() => {
    pr.get(e) === r && pr.delete(e);
  }).catch(() => {
  }), r;
}
let Yt = null;
function $i() {
  if (Yt) return Yt;
  const e = Li();
  return Yt = e, e.finally(() => {
    Yt === e && (Yt = null);
  }).catch(() => {
  }), e;
}
async function Li() {
  var b;
  const e = await K("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = _t(e.permissions, "savedfilters.read"), a = i && _t(e.permissions, "savedfilters.write"), c = i ? (await br(Un)).filter((I) => I.name === "Data Quality configuration").sort((I, O) => I.id - O.id) : [];
  if (c.length > 1) {
    const I = (O) => {
      const { revision: R, ...T } = Dt(O.uiOptions);
      return JSON.stringify(T);
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
  let s = c.length ? Dt(c[0].uiOptions) : Mi();
  const g = localStorage.getItem(`${r}:migrated`) === "true", m = localStorage.getItem(r), h = localStorage.getItem(`${r}:local-only`) === "true";
  !c.length && m && (s = Dt(m));
  let v = !c.length;
  if (c.length && h && m) {
    const I = Dt(m);
    if (I.reviews.some((R) => {
      const T = s.reviews.find((_) => _.id === R.id);
      return T && JSON.stringify(T) !== JSON.stringify(R);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const O = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...I.deletedIds])
    ];
    s = {
      ...s,
      reviews: Lr(s.reviews, I.reviews).filter(
        (R) => !O.includes(R.id)
      ),
      deletedIds: O,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...I.importedIds])
      ]
    }, v = !0;
  }
  if (!g) {
    const I = JSON.stringify(s), O = Fi(t);
    if (c.length && O.reviews.some((A) => {
      const re = s.reviews.find((X) => X.id === A.id);
      return re && JSON.stringify(re) !== JSON.stringify(A);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const R = i ? (await br(Pi)).flatMap(
      (A) => nr(A.uiOptions ?? "[]")
    ) : [], T = O.known.filter(
      (A) => !O.reviews.some((re) => re.id === A)
    ), _ = /* @__PURE__ */ new Set([...s.deletedIds, ...T]);
    s = {
      ...s,
      reviews: Lr(
        O.reviews,
        s.reviews,
        R.filter(
          (A) => !O.known.includes(A.id) && !s.importedIds.includes(A.id)
        )
      ).filter((A) => !_.has(A.id)),
      deletedIds: [..._],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...O.known,
          ...R.map((A) => A.id)
        ])
      ]
    }, v || (v = JSON.stringify(s) !== I);
  }
  const C = {
    userId: t,
    recordId: (b = c[0]) == null ? void 0 : b.id,
    config: s,
    readable: i,
    writable: a,
    durable: a
  };
  if (ir.set(r, C), v && a) {
    const I = s;
    c.length && (C.config = Dt(c[0].uiOptions)), await Vn(r, I), s = C.config;
  } else c.length || (localStorage.setItem(r, JSON.stringify(s)), !i && (!g || h) && localStorage.setItem(`${r}:local-only`, "true"));
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
async function Vn(e, t) {
  const r = ir.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await jn(r), r.recordId != null) {
      const c = await K(
        `/api/savedfilters/${r.recordId}`
      );
      if (Dt(c.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const a = await K(
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
  return nr(JSON.stringify(t)), Kn(e, async () => {
    const r = ir.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((a) => !t.some((c) => c.id === a.id)).map((a) => a.id);
    await Vn(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((a) => !t.some((c) => c.id === a))
    });
  });
}
function fn(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([r, i]) => /^[1-9]\d*:[1-9]\d*$/.test(r) && ["reviewed", "cannotDetermine"].includes(String(i)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function _i(e, t) {
  const r = ir.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), a = i ? fn(i) : null;
  if (!r.readable) return a;
  const c = (await br(xr)).find(
    (g) => g.name === t
  ), s = c ? fn(c.uiOptions) : null;
  return a && (!s || a.updatedAt > s.updatedAt) ? a : s;
}
function Di(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return Kn(i, async () => {
    const a = ir.get(e);
    if (!(a != null && a.writable)) return;
    await jn(a);
    const c = (await br(xr)).find(
      (s) => s.name === t
    );
    await K(
      c ? `/api/savedfilters/${c.id}` : "/api/savedfilters",
      {
        method: c ? "PUT" : "POST",
        body: JSON.stringify({
          mode: xr,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Ct = "confirmed_absent_tags", Br = "Confirmed absent tags", Ui = {
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
      t === "modifier" && typeof r == "string" ? Ui[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === Ct.toLowerCase() ? r.toLowerCase() : Kt(r)
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
      const s = await i.json();
      c = s.message || s.detail || s.error || c;
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
function Jr(e) {
  return K(`/api/videos/${e}?dqRead=${ji}-${++Ki}`, { cache: "no-store" });
}
async function er(e, t, r) {
  const i = { ...e.view.objectFilter }, a = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return K("/api/videos/find", {
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
async function pn(e, t, r) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, K("/api/tags/find", {
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
function Vi(e) {
  return K("/api/taggroups", { signal: e });
}
function Gi(e) {
  return `/api/videos/${e.id}/image?max=1280&v=${encodeURIComponent(e.updatedAt)}`;
}
function Gn(e) {
  return `/api/stream/video/${e}`;
}
function gn(e) {
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
async function or(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const i of e) {
    await K(`/api/tags/${i}`, { signal: t }), r.add(i);
    for (let a = 1; ; a++) {
      const c = await K("/api/tags/find", {
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
function Wi(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${Ct} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function Qr() {
  const t = (await K("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === Ct.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${Br} custom field before applying tag assessments.`
    };
  const r = Wi(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function zi() {
  const e = await Qr();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await K("/api/custom-fields", {
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
function Hi(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${Ct} value is not a valid tag list.`
    );
  return wr(e);
}
function Xi(e) {
  return wr(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function Yi(e, t) {
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
  ), c = i.filter(
    (h) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(h.mode)
  ), s = wr(t), g = r.definition.key;
  let m = 0;
  for (const h of s)
    try {
      const v = await Jr(h), C = Xi(v), b = { ...v.customFields ?? {} }, I = b[g], O = Hi(I), R = new Set(C), T = new Set(O);
      for (const X of a)
        for (const ne of X.tagIds)
          X.mode === "ADD" ? R.add(ne) : R.delete(ne);
      for (const X of c)
        for (const ne of X.tagIds)
          X.mode === "MARK_PRESENT" ? (R.add(ne), T.delete(ne)) : X.mode === "MARK_ABSENT" ? (R.delete(ne), T.add(ne)) : T.delete(ne);
      const _ = [...R], A = [...T];
      JSON.stringify(C) === JSON.stringify(_) && JSON.stringify(O) === JSON.stringify(A) && (I === void 0 ? A.length === 0 : JSON.stringify(I) === JSON.stringify(O)) || await K(`/api/videos/${h}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: _,
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
async function Bn(e, t) {
  if (!jt(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (yr(e)) {
    await Yi(e, t);
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
  if (!jt(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await K("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
async function eo(e, t, r) {
  if (!jt(r) || r.steps.some(
    (c) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(c.mode)
  ))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const i = await Promise.all(
    r.steps.map(async (c) => ({
      ...c,
      tagIds: c.mode === "REMOVE_TREE" ? await or(c.tagIds) : c.tagIds
    }))
  );
  let a = t.applications;
  for (const c of i)
    a = await Wn(
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
async function Jn(e, t) {
  const r = e.occurrence;
  if (r.targetMode === "all" || r.targetMode === "filter" && Object.keys(r.performerFilter).length === 0) return null;
  if (r.targetMode === "selected") return r.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: a, ...c } = r.performerFilter;
  for (let s = 1; ; s++) {
    const g = await K("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Kt({
          findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: c,
          filterExpression: a
        })
      )
    });
    if (g.items.forEach((m) => i.add(m.id)), s * 1e3 >= g.totalCount) return [...i];
    if (!g.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Qn(e, t) {
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
  const i = new Set(t), a = (c) => c.some((s) => i.has(s));
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
  const a = await er(
    Qn(e, t),
    { ...e.view.filter, page: r },
    i
  ), c = t === null ? null : new Set(t), s = e.occurrence, g = a.items.length && s.includeSubtags !== !1 && !["any", "isNull"].includes(s.condition) ? await Promise.all(s.conditionTagIds.map((v) => or([v], i))) : s.conditionTagIds.map((v) => [v]), m = new Array(a.items.length);
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
async function Wn(e, t, r) {
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
  const c = `/api/tagapplications?hostType=video&hostId=${a.id}&contextType=performer&contextId=${t.performer.id}`, s = (await K(c)).filter(
    (m) => m.hostType === "video" && m.hostId === a.id && m.contextType === "performer" && m.contextId === t.performer.id
  ), g = new Set(r);
  try {
    for (const m of g)
      s.some((h) => h.tag.id === m) || await K("/api/tagapplications", {
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
function rr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, g) => rr(s, t[g]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, a = Object.keys(r).sort(), c = Object.keys(i).sort();
  return a.length === c.length && a.every(
    (s, g) => s === c[g] && rr(r[s], i[s])
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
], no = {
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
function mn(e) {
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
    ...no,
    ...mn(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(a.targetMode) || !["any", "includes", "includesAll", "excludes", "isNull"].includes(
    a.condition
  ) || !Array.isArray(a.performerIds) || !Array.isArray(a.conditionTagIds) || typeof a.includeSubtags != "boolean" || [...a.performerIds, ...a.conditionTagIds].some(
    (s) => !Number.isSafeInteger(s) || s <= 0
  ) || !a.performerFilter || typeof a.performerFilter != "object" || Array.isArray(a.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const c = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Ie(i),
      objectFilter: mn(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: c,
      performerScope: a
    },
    startAtEnd: !t.has("page") && c === "end"
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
function io(e, t) {
  return {
    added: t.filter((r) => !e.includes(r)),
    removed: e.filter((r) => !t.includes(r))
  };
}
function oo(e) {
  return `/api/tagapplications?hostType=video&hostId=${e.video.id}&contextType=performer&contextId=${e.occurrence.performer.id}`;
}
async function Zt(e) {
  var c;
  if (e.occurrence) {
    const s = (await K(oo(e))).filter(
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
  ) ?? Ct, a = ((c = t.customFields) == null ? void 0 : c[i]) ?? [];
  if (!Array.isArray(a) || a.some((s) => !Number.isSafeInteger(s)))
    throw new Error(
      "Confirmed absent tags are invalid. Inspect the video before editing."
    );
  return { ids: r.map((s) => s.id), names: r.map((s) => s.name), absent: a };
}
async function ao(e, t, r) {
  if (t.occurrence && e.entityType === "performerOccurrence")
    await Wn(
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
  t.occurrence && e.entityType === "performerOccurrence" ? await eo(e, t.occurrence, r) : await Bn(r, [t.video.id]);
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
function Wr(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function co(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function zn(e) {
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
function Hn(e, t) {
  const r = Wr(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((i) => {
      const a = String(i.key ?? ""), c = lo[String(i.modifier ?? "EQUALS")], s = (C, b) => String(b ?? "").trim() || t[String(C)] || String(C ?? ""), g = s(
        i.value,
        i.displayValue
      ), m = s(
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
function Xn(e) {
  const t = Wr(e.customFieldCriteria);
  return t.length ? {
    ...e,
    customFieldCriteria: t.map(
      ({ label: r, ...i }) => i
    )
  } : e;
}
function Yn(e, t, r) {
  return r || "customFieldCriteria" in t || !Array.isArray(e.customFieldCriteria) ? t : { ...t, customFieldCriteria: e.customFieldCriteria };
}
function hn({
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
const ze = (e) => e instanceof Error ? e.message : "Request failed.";
function uo({
  actions: e,
  disabled: t,
  canWrite: r,
  onApply: i
}) {
  const [a, c] = E({});
  J(() => {
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
          children: /* @__PURE__ */ n(Vr, { "aria-hidden": "true" })
        }
      ),
      g.steps.length > 0 && /* @__PURE__ */ n("small", { className: "dq-review-action-summary", children: g.steps.map(
        (h) => `${s[h.mode]}: ${h.tagIds.map((v) => a[v] ?? "Loading tag…").join(", ")}`
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
  var Jt;
  const s = M(null), g = M("");
  if (!s.current)
    try {
      s.current = Dr(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (l) {
      g.current = ze(l), s.current = { query: Ut(e), startAtEnd: !1 };
    }
  const [m, h] = E(null), v = M(null), C = M(null), b = M(null), [I, O] = E(!!g.current), R = M(0), [T, _] = E(s.current.query), A = M(T);
  A.current = T;
  const [re, X] = E(0), ne = M(s.current.startAtEnd), [p, P] = E([]), [w, j] = E(null), ie = M(null), [Re, de] = E(null), [ar, ue] = E(0), Nt = Et(() => {
    if (!w) return null;
    const l = p.findIndex((f) => f.key === w.key);
    return l < 0 ? null : p.slice(l + 1).find((f) => f.video.id !== w.video.id) ?? null;
  }, [w, p]), [Be, at] = E(0), [Se, At] = E(!1), [se, Tt] = E(!1), $e = M(!1), He = M(!0), et = M(null);
  J(() => (He.current = !0, () => {
    He.current = !1;
  }), []);
  const [gt, ee] = E(g.current), [mt, xe] = E(""), [pe, te] = E(null), [ge, V] = E(!1), [N, Q] = E([]), x = M([]), Xe = M(null), tt = M(null), Vt = M(null);
  J(() => {
    var l, f;
    ge && ((f = (l = Vt.current) == null ? void 0 : l.querySelector("input")) == null || f.focus());
  }, [ge]);
  const [me, st] = E(!1);
  J(() => {
    if (Se || me || !tt.current) return;
    const l = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const f = tt.current;
      f != null && f.isConnected && !f.disabled && f.focus(), tt.current = null;
    });
    return () => cancelAnimationFrame(l);
  }, [Se, me, re]);
  const [lt, ht] = E([]), [Rt, qt] = E({}), kt = M(null), ct = M(0), Je = M(!1), [oe, It] = E({});
  J(() => {
    let l = !0;
    return Promise.all(
      zn(T.objectFilter).map(
        async (f) => [
          String(f),
          (await K(`/api/tags/${f}`)).name
        ]
      )
    ).then((f) => {
      l && It(Object.fromEntries(f));
    }).catch(() => {
    }), () => {
      l = !1;
    };
  }, [T.objectFilter]);
  const dt = M(0), Gt = M(e);
  Gt.current = e;
  const Ee = m ?? e, Qe = Et(
    () => Ze(Ee, T),
    [Ee, T]
  ), G = M(Qe);
  G.current = Qe;
  const yt = T.startFrom !== (e.view.startFrom ?? "end") || !rr(
    JSON.parse(Ye(Ze(e, T))),
    JSON.parse(Ye(Ze(e, Ut(e))))
  ), le = se || Se || ge, rt = Number(T.filter.page);
  function _e(l, f = !1) {
    $e.current || (g.current = "", ne.current = f, A.current = l, _(l), at(0), At(!0), f || tr(e.id, l), X((k) => k + 1));
  }
  function Ot() {
    if ($e.current = !1, Tt(!1), He.current && et.current) {
      const l = et.current;
      et.current = null, _e(l.query, l.startAtEnd);
    }
  }
  J(() => {
    const l = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const f = Dr(
            Gt.current,
            new URLSearchParams(window.location.search)
          );
          $e.current ? et.current = f : _e(f.query, f.startAtEnd);
        } catch (f) {
          ee(ze(f));
        }
    };
    return window.addEventListener("popstate", l), () => window.removeEventListener("popstate", l);
  }, [e.id]), J(() => (r(se || Se || ge || !!m), () => r(!1)), [se, Se, ge, !!m, r]);
  async function Pt(l, f, k) {
    if (l.entityType === "performerOccurrence") {
      const L = await ro(
        l,
        kt.current,
        f,
        k
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
      { ...l.view.filter, page: f },
      k
    );
    return {
      items: D.items.map((L) => ({ key: String(L.id), video: L })),
      totalCount: D.totalCount
    };
  }
  function Bt(l, f, k, D = !1, L = !1) {
    if (!He.current || et.current) return;
    O(!0), P(
      L ? l.items : kr(l.items, A.current.startFrom === "end")
    ), at(l.totalCount), Ce(k, D);
    const z = {
      ...A.current,
      filter: { ...A.current.filter, page: f }
    };
    A.current = z, _(z), tr(e.id, z);
  }
  function Ce(l, f = !1) {
    (l == null ? void 0 : l.key) !== (w == null ? void 0 : w.key) && (ie.current = null), (l == null ? void 0 : l.video.id) !== (w == null ? void 0 : w.video.id) && de(f && l ? l.video.id : null), j(l);
  }
  J(() => {
    if (g.current) return;
    const l = new AbortController();
    b.current = l;
    const f = ++dt.current;
    return At(!0), ee(""), xe(""), ie.current = null, de(null), j(null), P([]), V(!1), (async () => {
      const k = Ze(Gt.current, A.current);
      kt.current = k.entityType === "performerOccurrence" ? await Jn(k, l.signal) : null;
      let D = Number(k.view.filter.page), L = await Pt(k, D, l.signal);
      const z = Math.max(
        1,
        Math.ceil(L.totalCount / Number(k.view.filter.perPage))
      );
      if ((ne.current || D > z) && (D = z, L = await Pt(k, D, l.signal)), ne.current = !1, f !== dt.current || l.signal.aborted) return;
      const U = kr(L.items, k.view.startFrom === "end");
      Bt(L, D, U[0] ?? null);
    })().catch((k) => {
      !l.signal.aborted && f === dt.current && ee(ze(k));
    }).finally(() => {
      !l.signal.aborted && f === dt.current && (O(!0), At(!1));
    }), () => {
      l.abort(), dt.current++;
    };
  }, [re, e.id]), J(() => {
    if (te(null), !w) return;
    let l = !0;
    return Zt(w).then((f) => {
      l && (te(f), ht(
        e.entityType === "performerOccurrence" ? f.ids.filter((k) => e.occurrence.tagIds.includes(k)) : []
      ));
    }).catch((f) => {
      l && ee(`Could not load current tags. ${ze(f)}`);
    }), () => {
      l = !1;
    };
  }, [w]), J(() => {
    if (e.entityType !== "performerOccurrence" || e.actions.length)
      return;
    let l = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (f) => [
          f,
          (await K(`/api/tags/${f}`)).name
        ]
      )
    ).then((f) => {
      l && qt(Object.fromEntries(f));
    }).catch((f) => {
      l && ee(ze(f));
    }), () => {
      l = !1;
    };
  }, [e]);
  async function De(l = !1, f = !1, k = !1) {
    var We;
    if (!w) return;
    const D = p.findIndex((H) => H.key === w.key), L = T.startFrom === "end" ? -1 : 1, z = ((We = ie.current) == null ? void 0 : We.key) === w.key ? ie.current : { key: w.key, page: rt, before: p.slice(0, D + 1).map((H) => H.key), after: p.slice(D + 1).map((H) => H.key) }, U = new Set(z.after), Ke = new Set(z.before), Ve = p.find((H) => {
      var Me;
      return U.has(H.key) || (L === 1 || rt < z.page) && ((Me = ie.current) == null ? void 0 : Me.key) === w.key && !Ke.has(H.key);
    });
    if (!l && Ve) {
      Ce(Ve, k);
      return;
    }
    const Ne = l ? Ke : new Set(p.map((H) => H.key)), Pe = 1100 - (Date.now() - ct.current);
    Pe > 0 && await new Promise((H) => window.setTimeout(H, Pe));
    let ye = L === -1 && !l ? Math.max(1, rt - 1) : rt;
    for (; He.current && !et.current; ) {
      let H = await Pt(Qe, ye);
      const Me = Math.max(
        1,
        Math.ceil(H.totalCount / Number(T.filter.perPage))
      );
      ye > Me && (ye = Me, H = await Pt(Qe, ye));
      const Y = kr(H.items, L === -1), sr = new Map(Y.map((ke) => [ke.key, ke])), Qt = l ? z.after.flatMap((ke) => {
        const Wt = sr.get(ke);
        return Wt ? [Wt] : [];
      }) : [], Mt = new Set(Qt.map((ke) => ke.key)), ut = l ? {
        ...H,
        items: [
          ...Qt,
          ...Y.filter(
            (ke) => ke.key !== w.key && !Mt.has(ke.key)
          )
        ]
      } : H;
      if (f) {
        ie.current = z, Bt(ut, ye, w, !1, l);
        return;
      }
      const ft = L === -1 && rt === 1 && !l ? void 0 : ut.items.find(
        (ke) => !Ne.has(ke.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(l && L === -1 && ye === z.page) || U.has(ke.key))
      );
      if (ft || (L === -1 ? ye <= 1 : ye >= Me)) {
        Bt(
          ut,
          ye,
          ft ?? null,
          k,
          l
        ), ft || xe(
          H.totalCount ? "Reached the end in this direction. Matching items remain available from the scene pages." : "No matching scenes."
        );
        return;
      }
      ye += L;
    }
  }
  async function Ue(l, f = !1, k = !1, D = !1) {
    if (m || !w || $e.current || Se || ge && !k)
      return;
    const L = k || D || !!(l != null && l.steps.length), z = L && !f;
    if (L && (!t || !pe)) return;
    $e.current = !0, Tt(!0), ee(""), xe("");
    const U = p.findIndex((Ne) => Ne.key === w.key), Ke = L && !f && U >= 0 ? p[U + 1] ?? null : null;
    Ke && (P(
      (Ne) => Ne.filter((Pe) => Pe.key !== w.key)
    ), Ce(Ke, !0));
    let Ve = !1;
    try {
      if (L) {
        const Ne = await Zt(w);
        if (l)
          await so(Qe, w, l);
        else {
          const ye = D && e.entityType === "performerOccurrence" ? e.occurrence.tagIds.filter((Me) => Ne.ids.includes(Me)) : x.current, H = io(ye, D ? lt : N);
          await ao(Qe, w, H);
        }
        ct.current = Date.now();
        const Pe = await Zt(w);
        Ke || te(Pe), Ve = !0, V(!1), xe("Tags saved.");
      }
      if (!He.current || et.current) return;
      L ? await De(!0, f, z) : f || await De(), f && k && requestAnimationFrame(() => {
        var Ne;
        return (Ne = Xe.current) == null ? void 0 : Ne.focus();
      });
    } catch (Ne) {
      if (ee(
        Ve ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${ze(Ne)}` : L ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${ze(Ne)}` : `Could not advance. ${ze(Ne)}`
      ), L && !Ve) {
        Ke && (P(p), de(null), ue((Pe) => Pe + 1), j(w)), ct.current = Date.now();
        try {
          te(await Zt(w));
        } catch {
          te(null), ee(
            (Pe) => `${Pe} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Ot();
    }
  }
  J(() => {
    const l = (f) => {
      if (ge || m || se || Se || me || f.defaultPrevented || f.repeat || f.ctrlKey || f.altKey || f.metaKey || !Dn(f.target) || document.querySelector('[role="dialog"], dialog[open]'))
        return;
      const k = f.key.toLowerCase(), D = e.actions.find(
        (L, z) => pt(L, z) === k
      );
      D && (f.preventDefault(), f.stopPropagation(), Ue(D, f.shiftKey));
    };
    return document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l);
  });
  function nt() {
    !i || m || $e.current || ge || (C.current = document.activeElement, v.current = {
      error: gt,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(A.current),
      items: p,
      current: w,
      total: Be,
      targets: kt.current,
      stayedCursor: ie.current
    }, h(structuredClone(Ze(e, A.current))), xe(""), ee(""));
  }
  J(() => {
    a && a !== R.current && I && !Se && (R.current = a, nt());
  }, [a, Se, I]);
  function he() {
    h(null), requestAnimationFrame(() => {
      var l;
      return (l = C.current) == null ? void 0 : l.focus();
    });
  }
  function qe() {
    var f;
    const l = v.current;
    !l || se || ((f = b.current) == null || f.abort(), dt.current++, A.current = l.query, _(l.query), P(l.items), j(l.current), at(l.total), kt.current = l.targets, ie.current = l.stayedCursor, At(!1), ee(l.error), xe(""), window.history.replaceState(window.history.state, "", l.url), he());
  }
  async function Le() {
    if (!m || !i || $e.current) return;
    const l = Ze(
      { ...m, name: m.name.trim() },
      A.current
    ), f = hr(l);
    if (f) {
      ee(f);
      return;
    }
    $e.current = !0, Tt(!0), ee("");
    try {
      if (await i(l) === !1) throw new Error("Could not save review.");
      he(), xe("Review saved.");
    } catch (k) {
      ee(
        "Could not save review. Your edits are still open. " + ze(k)
      );
    } finally {
      Ot();
    }
  }
  async function je() {
    if (!i || $e.current) return;
    const l = Ze(e, {
      ...A.current,
      filter: { ...A.current.filter, page: 1 }
    });
    $e.current = !0, Tt(!0), ee("");
    try {
      if (await i(l) === !1) throw new Error("Could not save review.");
      xe("Queue saved to this review.");
    } catch (f) {
      ee("Could not save queue. " + ze(f));
    } finally {
      Ot();
    }
  }
  const W = T.performerScope, fe = (l) => _e({
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
            c == null ? void 0 : c(
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
                  onChange: (l) => _e({
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
                onClick: () => void Le(),
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
              var D;
              const f = l.target instanceof Element ? l.target.closest("button") : null, k = (f == null ? void 0 : f.getAttribute("aria-label")) ?? ((D = f == null ? void 0 : f.textContent) == null ? void 0 : D.trim()) ?? "";
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
                    l.key === "Escape" && (Je.current = !1), ["Delete", "Backspace"].includes(l.key) && l.target instanceof Element && ((f = l.target.closest("button")) == null ? void 0 : f.getAttribute("aria-label")) === "Edit filter: Custom Fields" && (Je.current = !0);
                  },
                  onClickCapture: (l) => {
                    var k, D;
                    const f = l.target instanceof Element ? l.target.closest("button") : null;
                    (f == null ? void 0 : f.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((k = f == null ? void 0 : f.textContent) == null ? void 0 : k.trim()) === "Clear all" ? Je.current = !0 : (/^(Cancel|Filters)/.test(((D = f == null ? void 0 : f.textContent) == null ? void 0 : D.trim()) ?? "") || /^(Close|Dismiss)/.test((f == null ? void 0 : f.getAttribute("aria-label")) ?? "")) && (Je.current = !1);
                  },
                  children: [
                    /* @__PURE__ */ n(
                      Pr,
                      {
                        filter: T.filter,
                        objectFilter: Hn(
                          T.objectFilter,
                          oe
                        ),
                        criteriaDefinitions: [
                          ...mr,
                          {
                            id: "custom-fields",
                            label: "Custom Fields",
                            filterKey: "customFieldCriteria"
                          }
                        ],
                        totalCount: Be,
                        sortOptions: Kr,
                        showSearch: !0,
                        showSort: !0,
                        showPagingControls: !1,
                        onFilterChange: (l) => {
                          (l.sort !== A.current.filter.sort || l.direction !== A.current.filter.direction) && (l = { ...l, sorts: void 0 }), _e({
                            ...A.current,
                            filter: Ie(l)
                          });
                        },
                        onObjectFilterChange: (l) => {
                          const f = Yn(
                            A.current.objectFilter,
                            Xn(l),
                            Je.current
                          );
                          Je.current = !1, _e({
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
                          onClick: () => void je(),
                          children: /* @__PURE__ */ n(Vr, { "aria-hidden": "true" })
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
                            _e(l, l.startFrom === "end");
                          },
                          children: /* @__PURE__ */ n(In, { "aria-hidden": "true" })
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
                      onChange: (l) => fe({
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
                    onChange: (l) => fe({ performerIds: l }),
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
                      criteriaDefinitions: ln,
                      objectFilter: W.performerFilter,
                      onObjectFilterChange: (l) => fe({ performerFilter: l })
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
                      onChange: (l) => fe({
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
                      onChange: (l) => fe({ conditionTagIds: l }),
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
                        onChange: (l) => fe({ includeSubtags: l.target.checked })
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
          An,
          {
            open: me,
            onClose: () => st(!1),
            criteria: ln,
            activeFilter: W.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (l) => {
              st(!1), fe({ performerFilter: l });
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
                  w ? Zt(w).then(te).catch((l) => ee(ze(l))) : _e(A.current);
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
              Tn,
              {
                filter: T.filter,
                totalCount: Be,
                onFilterChange: (l) => _e({ ...T, filter: Ie(l) })
              }
            ) }),
            /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: p.map((l) => {
              var f, k, D;
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
                    Ce(l), ee(""), xe("");
                  },
                  children: [
                    l.occurrence && /* @__PURE__ */ n(hn, { performer: l.occurrence.performer }),
                    /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: l.video.title || ((D = l.video.files[0]) == null ? void 0 : D.basename) || "Scene" })
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
                var D, L, z;
                const f = l, k = f.key === w.key;
                return /* @__PURE__ */ n(
                  "div",
                  {
                    className: k ? "dq-review-video-current" : "dq-review-video-preload",
                    "aria-hidden": k ? void 0 : !0,
                    inert: k ? void 0 : !0,
                    children: /* @__PURE__ */ n(
                      Rn,
                      {
                        videoId: f.video.id,
                        streamUrl: Gn(f.video.id),
                        posterUrl: k ? Gi(f.video) : void 0,
                        duration: ((D = f.video.files[0]) == null ? void 0 : D.duration) ?? 0,
                        format: (L = f.video.files[0]) == null ? void 0 : L.format,
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
                          Ce(l), ee("");
                        },
                        children: l.occurrence && /* @__PURE__ */ n(
                          hn,
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
                pe ? pe.names.join(", ") || "None" : "Loading…"
              ] }),
              pe != null && pe.absent.length ? /* @__PURE__ */ u("p", { children: [
                "Confirmed absent tags:",
                " ",
                /* @__PURE__ */ n(
                  ot,
                  {
                    entityType: "tag",
                    values: pe.absent,
                    onChange: () => {
                    },
                    disabled: !0,
                    allowCreate: !1
                  }
                )
              ] }) : null,
              ge ? /* @__PURE__ */ u(
                "fieldset",
                {
                  ref: Vt,
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
                          disabled: !pe,
                          onClick: () => void Ue(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !pe,
                          onClick: () => void Ue(void 0, !1, !0),
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
                  uo,
                  {
                    actions: Ee.actions,
                    canWrite: t,
                    disabled: se || Se || !pe || !!m,
                    onApply: (l, f) => void Ue(l, f)
                  }
                ),
                e.entityType === "performerOccurrence" && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                  "fieldset",
                  {
                    disabled: !t || se || !pe || !!m,
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
                          onClick: () => void Ue(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Ue(void 0, !1, !1, !0),
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
                    disabled: le || !!m || !t || !pe,
                    onClick: () => {
                      x.current = [...pe.ids], Q([...pe.ids]), V(!0);
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
                    onClick: () => void Ue(),
                    children: [
                      "Skip",
                      W ? " performer" : " video"
                    ]
                  }
                )
              ] }),
              !t && /* @__PURE__ */ n("p", { children: "Write permission is required to change tags." })
            ] })
          ] }) : /* @__PURE__ */ n("p", { role: "status", children: Se ? "Loading review…" : Be ? "Reached the end in this direction." : "No matching scenes." }) })
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
  const i = e.occurrence, a = (c) => t({ ...e, occurrence: { ...i, ...c } });
  return r ? /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ n("p", { children: "Choose the tags this review can change on the active performer’s appearance in a scene. Other tags are preserved." }),
    /* @__PURE__ */ n(
      ot,
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
    !["any", "isNull"].includes(i.condition) && /* @__PURE__ */ u(Oe, { children: [
      /* @__PURE__ */ n(
        ot,
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
  const [t, r] = E({}), [i, a] = E(""), c = (((g = e == null ? void 0 : e.presentation) == null ? void 0 : g.annotations) ?? []).includes("tags") ? ((m = e == null ? void 0 : e.presentation) == null ? void 0 : m.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...c,
      ...((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.binParents) ?? []
    ])
  ]);
  return J(() => {
    let v = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(s).map(
        async (C) => [C, await or([C])]
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
  }, [s]), { ids: t, error: i };
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
      (s) => c.some(
        (g) => {
          var m;
          return g !== s.id && ((m = r[g]) == null ? void 0 : m.includes(s.id));
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
  ), s = /* @__PURE__ */ new Map();
  for (const v of e)
    for (const C of v.tags ?? [])
      if (c.has(C.id)) {
        const b = s.get(C.id) ?? { name: C.name, count: 0 };
        b.count++, s.set(C.id, b);
      }
  return (h = (m = t.presentation) == null ? void 0 : m.binParents) != null && h.length ? /* @__PURE__ */ u("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...s].sort((v, C) => v[1].name.localeCompare(C[1].name)).map(([v, C]) => /* @__PURE__ */ u(
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
    !s.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
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
function bn({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [a, c] = E(!1), s = ve(e) === "tag" ? "tag" : "video", g = e.view.filter, m = s === "tag" ? qn : Kr, h = (b) => t({
    ...e,
    view: { ...e.view, filter: { ...g, ...b } }
  }), v = s === "video" ? e.presentation ?? {} : {}, C = (b) => t({ ...e, presentation: { ...v, ...b } });
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
        An,
        {
          open: !0,
          onClose: () => c(!1),
          criteria: s === "tag" ? kn : mr,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: s === "video",
          subjectLabel: s === "tag" ? "tags" : "videos",
          onApply: (b) => {
            t({ ...e, view: { ...e.view, objectFilter: b } }), c(!1);
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
        (v.annotations ?? []).includes("tags") && /* @__PURE__ */ u(Oe, { children: [
          /* @__PURE__ */ n("h4", { children: "Card tag bins" }),
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected. This setting is separate from the queue filters." }),
          /* @__PURE__ */ n(
            ot,
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
          ot,
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
const Ir = 180, yo = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function Zn({ entityType: e }) {
  return e === "tag" ? /* @__PURE__ */ n(Ai, { role: "img", "aria-label": "Tag review" }) : /* @__PURE__ */ n($r, { role: "img", "aria-label": e === "performerOccurrence" ? "Performer occurrence review" : "Video review" });
}
function wn(e) {
  return ve(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function vn(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Or() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Sn(e) {
  const t = new URLSearchParams(window.location.search);
  vr.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function bo(e) {
  return Ie({ ...e, page: 1 });
}
function ei(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Ge(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
const ti = "data-quality.workspace-layout.v1", zr = 240, Ur = 192, jr = 560;
function ri(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(jr, Math.max(Ur, e)) : zr;
}
function wo() {
  try {
    const e = JSON.parse(
      localStorage.getItem(ti) ?? "null"
    );
    return ri(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return zr;
  }
}
function vo(e) {
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
function So(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : ii(e, t);
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
  }), [a, c] = E(""), [s, g] = E(!0), [m, h] = E(""), [v, C] = E(!1), [b, I] = E(!1), [O, R] = E(!1), [T, _] = E([]), [A, re] = E(""), [X, ne] = E(!0), [p, P] = E(""), [w, j] = E(""), [ie, Re] = E(!1), [de, ar] = E(!1), [ue, Nt] = E(Or), [Be, at] = E({}), [Se, At] = E("name"), [se, Tt] = E("asc"), $e = M(null), He = M(!1), [et, gt] = E(0), [ee, mt] = E(!1), [xe, pe] = E(!1), [te, ge] = E(
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
  ), Q = N ? ve(N) : "video", x = Q === "video" ? N : null, [Xe, tt] = E(null), Vt = (Xe == null ? void 0 : Xe.id) === (N == null ? void 0 : N.id) ? Xe == null ? void 0 : Xe.mode : (N == null ? void 0 : N.view.reviewMode) ?? "single", me = Q === "performerOccurrence" || Q === "video" && Vt === "single", [st, lt] = E(0), ht = M(-1), Rt = M(!1);
  J(() => {
    const o = () => {
      if (!me && Ve.current) {
        Rt.current = !0;
        return;
      }
      Nt(Or()), me || lt((d) => d + 1);
    };
    return window.addEventListener("popstate", o), () => window.removeEventListener("popstate", o);
  }, [me]);
  const qt = Q === "tag" ? b : v, kt = Et(() => {
    const o = se === "asc" ? 1 : -1;
    return [...t].sort((d, y) => {
      if (Se === "count") {
        const S = Be[d.id], F = Be[y.id], q = typeof S == "number", $ = typeof F == "number";
        if (q !== $) return q ? -1 : 1;
        if (q && $ && S !== F)
          return (S - F) * o;
      }
      return d.name.localeCompare(y.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * o;
    });
  }, [se, Se, Be, t]), ct = M(
    null
  ), Je = po(x), [oe, It] = E({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [dt, Gt] = E({
    page: 1,
    perPage: 40
  }), [Ee, Qe] = E({ items: [], totalCount: 0 }), [G, yt] = E(!1), [le, rt] = E(""), [_e, Ot] = E(!1), [Pt, Bt] = E(!1), [Ce, De] = E(() => /* @__PURE__ */ new Set()), Ue = M(Ce);
  Ue.current = Ce;
  const nt = M(/* @__PURE__ */ new Map()), [he, qe] = E(null), Le = M(he);
  Le.current = he;
  const [je, W] = E(!1), fe = M(je);
  fe.current = je;
  const Jt = M(null), [l, f] = E("grid"), [k, D] = E(Ir), [L, z] = E(wo), [U, Ke] = E(!1), Ve = M(!1), [Ne, Pe] = E(""), [ye, We] = E(""), [H, Me] = E(""), [Y, sr] = E(null), [Qt, Mt] = E(""), [ut, ft] = E(!1), [ke, Wt] = E({}), [Hr, Xr] = E({}), zt = M(/* @__PURE__ */ new Map()), Yr = M(null), lr = M(null), Ft = M(0), cr = M(0), dr = M(null), bt = M(!1), Zr = JSON.stringify([
    ...new Set(
      (x == null ? void 0 : x.actions.flatMap(
        (o) => o.steps.flatMap((d) => d.tagIds)
      )) ?? []
    )
  ]);
  function Sr(o) {
    const d = ri(o);
    z(d), vo(d);
  }
  function si(o) {
    const d = o.shiftKey ? 40 : 16;
    let y = null;
    o.key === "ArrowLeft" && (y = L + d), o.key === "ArrowRight" && (y = L - d), o.key === "Home" && (y = Ur), o.key === "End" && (y = jr), y !== null && (o.preventDefault(), o.stopPropagation(), Sr(y));
  }
  J(() => {
    if (!ye) return;
    const o = window.setTimeout(() => We(""), 4e3);
    return () => window.clearTimeout(o);
  }, [ye]), J(() => {
    const o = JSON.parse(Zr);
    if (Xr({}), !o.length) return;
    const d = new AbortController();
    let y = !0;
    return Promise.all(
      o.map(async (S) => {
        var F;
        try {
          const q = await K(`/api/tags/${S}`, {
            signal: d.signal
          });
          return [S, ((F = q.name) == null ? void 0 : F.trim()) || null];
        } catch {
          return [S, null];
        }
      })
    ).then((S) => {
      y && Xr(Object.fromEntries(S));
    }), () => {
      y = !1, d.abort();
    };
  }, [Zr]), J(() => {
    const o = x ? zn(x.view.objectFilter) : [];
    if (Wt({}), !o.length) return;
    const d = new AbortController();
    let y = !0;
    return Promise.all(
      o.map(async (S) => {
        var F;
        try {
          const q = await K(`/api/tags/${S}`, {
            signal: d.signal
          });
          return (F = q.name) != null && F.trim() ? [String(S), q.name] : null;
        } catch {
          return null;
        }
      })
    ).then((S) => {
      y && Wt(
        Object.fromEntries(S.filter((F) => F !== null))
      );
    }), () => {
      y = !1, d.abort();
    };
  }, [x == null ? void 0 : x.id, x == null ? void 0 : x.view.objectFilter]);
  const Er = Et(
    () => x ? Hn(
      x.view.objectFilter,
      ke
    ) : (N == null ? void 0 : N.view.objectFilter) ?? {},
    [ke, N, x]
  ), li = Et(
    () => Q === "video" && Array.isArray(Er.customFieldCriteria) ? [...mr, yo] : Q === "tag" ? kn : mr,
    [Q, Er.customFieldCriteria]
  ), en = St(async () => {
    g(!0), h("");
    try {
      const o = await $i();
      r(o.reviews), c(o.storageKey), C(o.canWriteVideos ?? o.canWrite), I(o.canWriteTags ?? !1), R(o.canReadTagGroups ?? !1), ne(o.canConfigure ?? !0), P(o.storageNotice ?? ""), ue && !o.reviews.some((d) => d.id === ue) && (Nt(""), Sn(""));
    } catch (o) {
      h(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      g(!1);
    }
  }, [ue]);
  J(() => {
    if (!O) {
      _([]), re("");
      return;
    }
    const o = new AbortController();
    return re(""), Vi(o.signal).then(_).catch((d) => {
      o.signal.aborted || re(
        d instanceof Error ? d.message : "Could not load tag groups."
      );
    }), () => o.abort();
  }, [O]), J(() => {
    en();
  }, []), J(() => {
    if (ue || t.length === 0) return;
    const o = new AbortController();
    at({});
    for (const d of t)
      (d.entityType === "performerOccurrence" ? Jn(d, o.signal).then((S) => (S == null ? void 0 : S.length) === 0 ? { items: [], totalCount: 0 } : er(Qn(d, S), { ...d.view.filter, page: 1, perPage: 1 }, o.signal)) : ve(d) === "tag" ? pn(
        d,
        Ie({ ...d.view.filter, page: 1, perPage: 1 }),
        o.signal
      ) : er(
        d,
        Ie({ ...d.view.filter, page: 1, perPage: 1 }),
        o.signal
      )).then((S) => {
        o.signal.aborted || at((F) => ({
          ...F,
          [d.id]: S.totalCount
        }));
      }).catch(() => {
        o.signal.aborted || at((S) => ({ ...S, [d.id]: null }));
      });
    return () => o.abort();
  }, [ue, t]), Nn(() => {
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
  J(() => {
    ur();
  }, [ur]);
  const wt = St(
    async (o, d, y = !1) => {
      var $;
      const S = ++Ft.current;
      ($ = dr.current) == null || $.abort();
      const F = new AbortController();
      dr.current = F, d = Ie(d);
      const q = Number(d.page);
      y && (d = { ...d, page: 1 }), It(d), Bt(y), yt(!0), rt("");
      try {
        const ce = (Lt) => ve(o) === "tag" ? pn(
          o,
          Lt,
          F.signal
        ) : er(
          o,
          Lt,
          F.signal
        );
        let B = await ce(d);
        const Ae = Math.max(
          1,
          Math.ceil(B.totalCount / Number(d.perPage))
        ), Fe = y ? Ae : Math.min(q, Ae);
        return Number(d.page) !== Fe && (d = { ...d, page: Fe }, B = await ce(d)), S === Ft.current && (Qe(B), It(d), Gt(d)), B;
      } catch (ce) {
        throw S === Ft.current && rt(
          ce instanceof Error ? ce.message : "Could not load the review queue."
        ), ce;
      } finally {
        S === Ft.current && yt(!1);
      }
    },
    []
  );
  J(() => {
    var d;
    if (cr.current += 1, ht.current = -1, Ft.current += 1, (d = dr.current) == null || d.abort(), ar(!1), j(""), Re(!1), De(/* @__PURE__ */ new Set()), nt.current.clear(), qe(null), W(!1), Ke(!1), Ve.current = !1, Pe(""), We(""), Me(""), Qe({ items: [], totalCount: 0 }), Ot(!1), !N || me) {
      yt(!1);
      return;
    }
    let o = !0;
    return yt(!0), (async () => {
      let y = V ?? N;
      ge(null);
      let S = null;
      const F = new URLSearchParams(window.location.search);
      if (ve(N) === "video" && vr.some((B) => F.has(B)))
        try {
          const B = y;
          S = Dr(B, F);
          const Ae = Ze(B, S.query);
          (S.query.startFrom !== (B.view.startFrom ?? "end") || !rr(
            JSON.parse(Ye(Ae)),
            JSON.parse(Ye(Ze(B, Ut(B))))
          )) && (y = Ae, ge(y));
        } catch (B) {
          Ot(!0), rt(B instanceof Error ? B.message : "Could not read review URL."), yt(!1);
          return;
        }
      let q = null;
      try {
        q = await _i(a, N.id);
      } catch (B) {
        o && (Re(!0), j(
          B instanceof Error ? B.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const $ = (q == null ? void 0 : q.signature) === Ye(y) ? q : null, ce = S ? S.query.filter : $ ? Ie($.filter) : bo(y.view.filter);
      It(ce), f(
        $ ? vn($.displayMode, ve(N)) : wn(N)
      ), D(
        $ ? $.cardSize ?? Ir : Ir
      );
      try {
        const B = await wt(
          y,
          ce,
          S ? S.startAtEnd : !$ && y.view.startFrom !== "beginning"
        );
        if (!o) return;
        const Ae = cn(
          B.items.map((Fe) => Fe.id),
          ($ == null ? void 0 : $.focusedId) ?? null,
          ($ == null ? void 0 : $.index) ?? 0
        );
        qe(Ae), be(Ae);
      } catch {
      }
      o && (ht.current = st, ar(!0));
    })(), () => {
      var y;
      o = !1, cr.current++, Ft.current++, (y = dr.current) == null || y.abort();
    };
  }, [N == null ? void 0 : N.id, me, st]), J(() => {
    !x || me || !de || G || le || U || Rt.current || ht.current !== st || tr(x.id, {
      filter: oe,
      objectFilter: x.view.objectFilter,
      searchMode: x.view.searchMode,
      startFrom: x.view.startFrom ?? "end"
    });
  }, [x, me, de, G, le, oe, U, st]);
  const ae = Et(
    () => Ee.items.map((o) => o.id),
    [Ee.items]
  );
  J(() => {
    if (!de || !N || !a || G || le || U || (te == null ? void 0 : te.id) === N.id || ie)
      return;
    const o = {
      version: 1,
      signature: Ye(N),
      filter: oe,
      focusedId: he,
      index: Math.max(0, ae.indexOf(he ?? -1)),
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
    le,
    U,
    oe,
    he,
    ae,
    l,
    k,
    te,
    w,
    ie
  ]);
  const ci = Ee.items.find((o) => o.id === he) ?? null, Cr = Q === "video" ? ci : null;
  je && Cr && (Jt.current = Cr);
  const vt = Cr ?? (je ? Jt.current : null), di = dn(Ce, he), tn = Ce.size > 0 ? `${Ce.size} selected ${Q}${Ce.size === 1 ? "" : "s"}` : he == null ? `no ${Q}` : `focused ${Q}`, be = St((o, d = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const y = zt.current.get(o);
      y == null || y.focus({ preventScroll: !0 }), d && (y == null || y.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  J(() => {
    de && !fe.current && be(Le.current);
  }, [de, be]), J(() => {
    G || !ae.length || (Le.current == null || !ae.includes(Le.current)) && (qe(ae[0]), fe.current || be(ae[0]));
  }, [be, ae, G]);
  const $t = St(
    (o) => {
      De((d) => {
        const y = o(d);
        for (const S of /* @__PURE__ */ new Set([...d, ...y]))
          d.has(S) !== y.has(S) && nt.current.set(
            S,
            (nt.current.get(S) ?? 0) + 1
          );
        return y;
      });
    },
    []
  ), Nr = St(
    (o) => {
      if (!ae.length) return;
      const d = Math.max(
        0,
        ae.indexOf(Le.current ?? ae[0])
      ), y = ae[Math.max(0, Math.min(ae.length - 1, d + o))];
      qe(y), fe.current || be(y);
    },
    [be, ae]
  ), Ar = St(
    async (o) => {
      const d = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", y = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, S = y != null && (!O || !T.some((Z) => Z.id === y)), F = "effect" in o && d && !O, q = dn(
        Ue.current,
        Le.current
      );
      if (!N || Ve.current || G || le || d && !qt || F || S || yr(o) && (Y == null ? void 0 : Y.kind) !== "ready" || !q.length)
        return;
      const $ = ++cr.current, ce = N.id, B = [...ae], Ae = Ee, Fe = Le.current, Lt = new Set(Ue.current), Xt = new Map(
        q.map((Z) => [Z, nt.current.get(Z) ?? 0])
      ), xt = () => $ === cr.current && N.id === ce;
      Ve.current = !0, Ke(!0), Pe(
        Ue.current.size ? `${q.length} selected ${Q}s` : `the focused ${Q}`
      ), We(""), Me("");
      const nn = Ae.items.filter(
        (Z) => !q.includes(Z.id)
      ), wi = nn.map((Z) => Z.id), on = un(
        B,
        wi,
        Fe,
        q.includes(Fe ?? -1)
      );
      Qe({
        items: nn,
        totalCount: Ae.totalCount
      }), De((Z) => {
        const we = new Set(Z);
        for (const Te of q) we.delete(Te);
        return we;
      }), qe(on), fe.current || be(on);
      let Rr = !1;
      try {
        if ("effect" in o ? await Zi(o, q) : await Bn(o, q), Rr = !0, !xt()) return;
        De((Z) => {
          const we = new Set(Z);
          for (const Te of q)
            (nt.current.get(Te) ?? 0) === Xt.get(Te) && we.delete(Te);
          return we;
        }), We(
          `${o.label}: ${q.length} ${Q}${q.length === 1 ? "" : "s"} ${d ? "updated" : "skipped"}.`
        );
      } catch (Z) {
        if (!xt()) return;
        Qe(Ae), De((we) => {
          const Te = new Set(we);
          for (const it of q)
            Lt.has(it) && (nt.current.get(it) ?? 0) === Xt.get(it) && Te.add(it);
          return Te;
        }), qe(Fe), fe.current || be(Fe), Me(
          Z instanceof Error ? Z.message : "Action failed."
        );
      }
      try {
        if (await Qi(o), !xt()) return;
        const Z = await wt(N, oe);
        if (!xt()) return;
        let we = Z.items.map((Te) => Te.id);
        if (!we.length && Z.totalCount > 0 && Number(oe.page) > 1) {
          const Te = Math.max(1, Number(oe.page) - 1), it = { ...oe, page: Te };
          It(it), we = (await wt(N, it)).items.map((qr) => qr.id), De(
            (qr) => new Set([...qr].filter((vi) => we.includes(vi)))
          );
          const sn = we.at(-1) ?? null;
          qe(sn), fe.current || be(sn);
        } else {
          De(
            (it) => new Set([...it].filter((an) => we.includes(an)))
          );
          const Te = un(
            B,
            we,
            Fe,
            Rr && q.includes(Fe ?? -1)
          );
          qe(Te), fe.current && Te == null && W(!1), fe.current || be(Te);
        }
      } catch (Z) {
        xt() && Me(
          (we) => `${we ? `${we} ` : ""}${Rr ? "The action completed, but " : ""}the queue could not be refreshed. ${Z instanceof Error ? Z.message : "Refresh failed."}`
        );
      } finally {
        xt() && (Ve.current = !1, Ke(!1), Pe(""), Rt.current && (Rt.current = !1, Nt(Or()), lt((Z) => Z + 1)));
      }
    },
    [
      qt,
      O,
      T,
      Q,
      Y,
      wt,
      oe,
      be,
      ae,
      Ee,
      G,
      le,
      N
    ]
  );
  function ui() {
    var y;
    if (l === "list") return 1;
    const o = (y = Yr.current) == null ? void 0 : y.firstElementChild, d = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, d.split(" ").filter(Boolean).length);
  }
  function fi(o) {
    if (me || o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || ee) return;
    if (je && o.key === "Escape") {
      Ge(o), W(!1), be(Le.current);
      return;
    }
    if (!Dn(o.target)) return;
    if (o.key === "Escape") {
      Ge(o), $t(() => /* @__PURE__ */ new Set());
      return;
    }
    const d = (N == null ? void 0 : N.actions.findIndex(
      (F, q) => pt(F, q) === o.key.toLowerCase()
    )) ?? -1;
    if (d >= 0 && (N != null && N.actions[d])) {
      Ge(o), !U && !G && Ar(N.actions[d]);
      return;
    }
    if (!je && o.key === " ") {
      Ge(o), he != null && $t((F) => gr(F, he));
      return;
    }
    if (!je && o.key.toLowerCase() === "a") {
      Ge(o), $t(
        (F) => Oi(F, ae)
      );
      return;
    }
    if (U || G || je) return;
    if (o.key === "Enter" && he != null) {
      Ge(o), Q === "tag" ? window.open(`/tag/${he}`, "_blank", "noopener,noreferrer") : W(!0);
      return;
    }
    const y = ui(), S = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -y : o.key === "ArrowDown" ? y : 0;
    S && (Ge(o), Nr(S));
  }
  function Ht(o) {
    tt(null), gt(0), Nt(o), Sn(o);
  }
  function pi() {
    He.current = !0, at({}), Ht("");
  }
  async function Tr(o) {
    if (!a) return !1;
    const d = o.map(No);
    try {
      await xi(a, d);
    } catch (S) {
      throw S;
    }
    r(d), ue && !d.some((S) => S.id === ue) && Ht("");
    const y = d.find((S) => S.id === ue);
    return y && tt(null), y && V && JSON.stringify(y) !== JSON.stringify(V) && (y.view.displayMode !== V.view.displayMode && f(wn(y)), Ye(y) !== Ye(V) && (ge(null), ve(y) === "video" && tr(y.id, {
      filter: Ie(y.view.filter),
      objectFilter: y.view.objectFilter,
      searchMode: y.view.searchMode,
      startFrom: y.view.startFrom ?? "end"
    }), me || fr(
      y,
      Ie({ ...y.view.filter, page: oe.page })
    ))), !0;
  }
  if (s)
    return /* @__PURE__ */ n(En, { label: "Loading reviews…" });
  if (m)
    return /* @__PURE__ */ u(Oe, { children: [
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
        Cn,
        {
          message: m,
          onRetry: () => void en()
        }
      )
    ] });
  return /* @__PURE__ */ u("div", { className: "data-quality-page", onKeyDown: fi, children: [
    /* @__PURE__ */ u("header", { className: "data-quality-header", children: [
      N && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: U,
          onClick: pi,
          children: /* @__PURE__ */ n(On, {})
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
            me ? gt((o) => o + 1) : (pe(!0), mt(!0));
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
          disabled: U || G || !X,
          onClick: () => {
            pe(!1), mt(!0);
          },
          children: /* @__PURE__ */ n(Ni, {})
        }
      )
    ] }),
    p && /* @__PURE__ */ n("p", { className: "dq-status", children: p }),
    x && (Y == null ? void 0 : Y.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      Y.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: ut,
          onClick: () => {
            ft(!0), Mt(""), zi().then(ur).catch(
              (o) => Mt(
                "Could not create the Confirmed absent tags custom field. " + (o instanceof Error ? o.message : "Request failed.")
              )
            ).finally(() => ft(!1));
          },
          children: ut ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    x && ((Y == null ? void 0 : Y.kind) === "incompatible" || Qt) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(Fr, {}),
      Qt || (Y == null ? void 0 : Y.message),
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
            j(""), Re(!1);
          },
          children: ie ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    x && /* @__PURE__ */ u("label", { className: "dq-layout-control", children: [
      "Review layout",
      /* @__PURE__ */ u(
        "select",
        {
          "aria-label": "Review layout",
          value: Vt,
          disabled: U || G || ee,
          onChange: (o) => tt({ id: x.id, mode: o.target.value }),
          children: [
            /* @__PURE__ */ n("option", { value: "single", children: "Single video" }),
            /* @__PURE__ */ n("option", { value: "multiple", children: "Multiple videos" })
          ]
        }
      )
    ] }),
    N && V && !me && /* @__PURE__ */ u("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${U || G ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": U || G || void 0,
          inert: U || G ? !0 : void 0,
          onClickCapture: (o) => {
            var y, S, F, q, $;
            const d = o.target instanceof Element ? o.target.closest("button") : null;
            (d == null ? void 0 : d.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((y = d == null ? void 0 : d.textContent) == null ? void 0 : y.trim()) === "Clear all" ? bt.current = !0 : ((S = d == null ? void 0 : d.getAttribute("aria-label")) != null && S.startsWith("Filters") || (F = d == null ? void 0 : d.getAttribute("aria-label")) != null && F.startsWith("Edit filter:") || ((q = d == null ? void 0 : d.textContent) == null ? void 0 : q.trim()) === "Cancel" || ($ = d == null ? void 0 : d.getAttribute("aria-label")) != null && $.startsWith("Close ")) && (bt.current = !1);
          },
          onKeyDownCapture: (o) => {
            var y, S;
            const d = o.target instanceof Element ? o.target.closest("button") : null;
            (o.key === "Delete" || o.key === "Backspace") && (d == null ? void 0 : d.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (o.preventDefault(), o.stopPropagation(), bt.current = !0, (S = (y = d.parentElement) == null ? void 0 : y.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || S.click()) : o.key === "Escape" && (bt.current = !1);
          },
          children: /* @__PURE__ */ n(
            Pr,
            {
              filter: le ? dt : oe,
              onFilterChange: gi,
              totalCount: Ee.totalCount,
              sortOptions: Q === "tag" ? qn : Kr,
              showSearch: !0,
              showSort: !0,
              displayMode: l,
              onDisplayModeChange: (o) => f(vn(o, Q)),
              availableDisplayModes: Q === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (k - 225) / 50,
              onZoomChange: (o) => D(Math.round(225 + o * 50)),
              cardSizeEntityType: Q === "tag" ? "tags" : "videos",
              criteriaDefinitions: li,
              objectFilter: Er,
              onObjectFilterChange: (o) => {
                if (!U && !G) {
                  const d = Q === "video" ? Xn(o) : o;
                  ct.current = Q === "video" ? Yn(
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
      (te == null ? void 0 : te.id) === ue && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: U || G || !X,
            onClick: hi,
            children: /* @__PURE__ */ n(Vr, {})
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
            onClick: mi,
            children: /* @__PURE__ */ n(In, {})
          }
        )
      ] })
    ] }),
    N ? me ? /* @__PURE__ */ n(fo, { review: N, canWrite: N.entityType === "performerOccurrence" ? b : v, onBusy: Ke, editRequest: et, renderRuleEditor: (o, d, y) => /* @__PURE__ */ n(oi, { workspace: !0, draft: o, entityTypeLocked: !0, tagGroups: T, saving: y, setDraft: (S) => d(S), onSave: () => {
    }, onCancel: () => {
    } }), onSaveDefaults: X ? (o) => Tr(t.map((d) => d.id === o.id ? o : d)) : void 0 }, N.id) : /* @__PURE__ */ u(Oe, { children: [
      x && Je.error && /* @__PURE__ */ n("p", { role: "alert", children: Je.error }),
      x && /* @__PURE__ */ n(
        mo,
        {
          videos: Ee.items,
          review: x,
          trees: Je.ids,
          disabled: U || G,
          onChoose: (o) => {
            const d = ho(x, o);
            ge(d), fr(d, { ...oe, page: 1 });
          }
        }
      ),
      H && !je && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(Fr, {}),
        H
      ] }),
      ye && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: ye }),
      rn("top"),
      /* @__PURE__ */ u(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${L}px`
          },
          children: [
            /* @__PURE__ */ u("main", { children: [
              G && !Ee.items.length && /* @__PURE__ */ n(En, { label: "Loading review queue…" }),
              le && !G && /* @__PURE__ */ n(
                Cn,
                {
                  message: le,
                  retryLabel: _e ? "Reset to review defaults" : "Retry",
                  onRetry: () => {
                    if (_e && V && ve(V) === "video") {
                      const o = Ut(V);
                      tr(V.id, { ...o, filter: { ...o.filter, page: void 0 } }), lt((d) => d + 1);
                      return;
                    }
                    wt(
                      N,
                      oe,
                      Pt
                    ).catch(() => {
                    });
                  }
                }
              ),
              !U && !G && !le && !Ee.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
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
                  children: Ee.items.map(bi)
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
                "aria-valuenow": L,
                "aria-valuetext": `${L} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (o) => {
                  lr.current = {
                    pointerId: o.pointerId,
                    startX: o.clientX,
                    startWidth: L
                  }, o.currentTarget.setPointerCapture(o.pointerId);
                },
                onPointerMove: (o) => {
                  const d = lr.current;
                  (d == null ? void 0 : d.pointerId) === o.pointerId && o.currentTarget.hasPointerCapture(o.pointerId) && Sr(
                    d.startWidth + d.startX - o.clientX
                  );
                },
                onPointerUp: () => {
                  lr.current = null;
                },
                onPointerCancel: () => {
                  lr.current = null;
                },
                onKeyDown: si,
                onDoubleClick: () => Sr(zr),
                children: /* @__PURE__ */ n("span", {})
              }
            ),
            /* @__PURE__ */ u("aside", { className: "dq-actions", children: [
              Ce.size > 0 && /* @__PURE__ */ n("strong", { children: tn }),
              N.actions.map((o, d) => {
                const y = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", S = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, F = S != null ? T.find(($) => $.id === S) : void 0, q = S != null && !F;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    disabled: U || G || !!le || y && !qt || "effect" in o && y && (!O || q) || yr(o) && (Y == null ? void 0 : Y.kind) !== "ready" || !di.length,
                    onClick: () => void Ar(o),
                    children: [
                      /* @__PURE__ */ u("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: o.label }),
                        "effect" in o ? /* @__PURE__ */ n("small", { children: o.effect.mode === "SKIP" ? "Skip" : o.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : F ? `Assign ${F.name}` : "Unavailable tag group" }) : o.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: o.steps.flatMap(
                          ($, ce) => $.tagIds.map((B, Ae) => {
                            const Fe = Hr[B] === void 0 ? "Tag" : Hr[B] ?? "Unavailable tag", Lt = ii($, Fe), Xt = So($, Fe);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": ni($.mode),
                                "aria-label": Xt,
                                title: `Step ${ce + 1}: ${Xt}`,
                                children: Lt
                              },
                              `${ce}-${B}-${Ae}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      pt(o, d) && /* @__PURE__ */ n("kbd", { children: pt(o, d) })
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
              U && /* @__PURE__ */ u("p", { role: "status", children: [
                /* @__PURE__ */ n(Fn, { className: "dq-spin" }),
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
      rn("bottom")
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
                (o) => Be[o.id] !== void 0
              ) ? t.some((o) => Be[o.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
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
                    Mn,
                    {
                      className: se === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: kt.map((o) => {
            const d = Be[o.id], y = ve(o), S = y === "tag" ? "tag" : y === "performerOccurrence" ? "scene" : "video";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                disabled: U,
                onClick: () => Ht(o.id),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ u("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(Zn, { entityType: y }),
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
      /* @__PURE__ */ n($r, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    je && vt && x && /* @__PURE__ */ n(
      qo,
      {
        video: vt,
        review: x,
        targetLabel: tn,
        pending: U,
        refreshing: G || !!le,
        error: H,
        canWrite: v,
        assessmentReady: (Y == null ? void 0 : Y.kind) === "ready",
        selected: Ce.has(vt.id),
        hasPrevious: ae.indexOf(vt.id) > 0,
        hasNext: ae.indexOf(vt.id) >= 0 && ae.indexOf(vt.id) < ae.length - 1,
        onToggleSelected: () => $t((o) => gr(o, vt.id)),
        onPrevious: () => Nr(-1),
        onNext: () => Nr(1),
        onClose: () => {
          W(!1), be(Le.current);
        },
        onAction: Ar
      }
    ),
    ee && /* @__PURE__ */ n(
      ko,
      {
        reviews: t,
        activeReview: V,
        tagGroups: T,
        initialEdit: xe,
        onSave: Tr,
        onChoose: Ht,
        onEditWorkspace: (o) => {
          o !== ue && Ht(o), tt({ id: o, mode: "single" }), gt((d) => d + 1), mt(!1);
        },
        onClose: () => {
          mt(!1), xe && be(Le.current, !1);
        }
      }
    )
  ] });
  async function fr(o, d, y = !1) {
    const S = Le.current, F = Math.max(0, ae.indexOf(S ?? -1));
    try {
      const $ = (await wt(o, d, y)).items.map((B) => B.id);
      De(
        (B) => new Set([...B].filter((Ae) => $.includes(Ae)))
      );
      const ce = cn($, S, F);
      qe(ce), fe.current || be(ce, !1);
    } catch {
    }
  }
  function gi(o) {
    const d = ct.current;
    if (ct.current = null, U || G || !N || !V) return;
    const y = d ?? N.view.objectFilter, S = rr(
      y,
      V.view.objectFilter
    ) ? V.view.objectFilter : y, F = Ie({ ...o, page: 1 }), q = {
      ...N,
      view: {
        ...N.view,
        filter: F,
        objectFilter: S
      }
    }, $ = Ye(q) !== Ye(V), ce = $ ? q : V;
    ge($ ? q : null), We($ ? "" : "Review queue defaults restored."), fr(ce, F, !0);
  }
  function mi() {
    if (U || G || !V) return;
    ct.current = null;
    const o = Ie({
      ...V.view.filter,
      page: 1
    });
    ge(null), We("Review queue defaults restored."), fr(
      V,
      o,
      V.view.startFrom !== "beginning"
    );
  }
  function hi() {
    U || G || !N || !V || !X || Tr(
      t.map(
        (o) => o.id === ue ? {
          ...o,
          view: {
            ...N.view,
            filter: { ...oe, page: 1 }
          }
        } : o
      )
    ).then(() => {
      ge(null), We("Queue saved to this review.");
    }).catch(
      (o) => Me(
        o instanceof Error ? o.message : "Could not save queue."
      )
    );
  }
  function yi() {
    De(/* @__PURE__ */ new Set()), nt.current.clear(), qe(null);
  }
  function rn(o) {
    return N ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: U || G,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          Tn,
          {
            filter: {
              ...oe,
              page: Number(oe.page) || 1,
              perPage: Number(oe.perPage) || 40
            },
            totalCount: Ee.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${o}`,
            onFilterChange: (d) => {
              U || G || d.page === Number(oe.page) || Co(
                { ...oe, page: d.page },
                N,
                wt,
                yi
              );
            }
          }
        )
      }
    ) : null;
  }
  function bi(o) {
    var y, S, F;
    if (Q === "tag") {
      const q = o;
      return /* @__PURE__ */ n(
        Ao,
        {
          tag: q,
          displayMode: l === "list" ? "list" : "grid",
          focused: q.id === he,
          selected: Ce.has(q.id),
          setRef: ($) => {
            $ ? zt.current.set(q.id, $) : zt.current.delete(q.id);
          },
          onFocus: () => qe(q.id),
          onToggle: () => {
            $t(($) => gr($, q.id)), be(q.id, !1);
          },
          onOpen: () => window.open(`/tag/${q.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        q.id
      );
    }
    const d = o;
    return /* @__PURE__ */ n(
      To,
      {
        video: go(d, x, Je.ids),
        showTagBins: ((S = (y = x == null ? void 0 : x.presentation) == null ? void 0 : y.annotations) == null ? void 0 : S.includes("tags")) && !!((F = x.presentation.annotationParents) != null && F.length),
        displayMode: l,
        focused: d.id === he,
        selected: Ce.has(d.id),
        setRef: (q) => {
          q ? zt.current.set(d.id, q) : zt.current.delete(d.id);
        },
        onFocus: () => qe(d.id),
        onToggle: () => $t((q) => gr(q, d.id)),
        onPreview: () => {
          qe(d.id), W(!0);
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
function gr(e, t) {
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
      onFocus: c,
      onClick: (h) => {
        c(), h.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        Ei,
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
function To({
  video: e,
  showTagBins: t,
  displayMode: r,
  focused: i,
  selected: a,
  setRef: c,
  onFocus: s,
  onToggle: g,
  onPreview: m,
  onNavigate: h
}) {
  var R, T;
  const v = ei(e), C = M(null), b = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, I = !!(b.date || b.studioName), O = !!(b.performers.length || b.tags.length);
  return Nn(() => {
    const _ = C.current;
    if (!_) return;
    const A = _.querySelector(
      `a[href="/video/${e.id}"]`
    ), re = _.querySelector(".card-title"), X = `dq-card-title-${e.id}`;
    re && (re.id = X), A && (A.target = "_blank", A.rel = "noreferrer", A.removeAttribute("aria-label"), A.setAttribute("aria-labelledby", X), A.classList.add("dq-card-link"));
    const ne = _.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    ne && ne.setAttribute(
      "aria-label",
      a ? `Deselect ${v}` : `Select ${v}`
    );
    const p = _.querySelector(
      'button[title="Quick View"]'
    );
    p && p.setAttribute("aria-label", `Preview ${v}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (_) => {
        C.current = _, c(_);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${v}${a ? ", selected" : ""}`,
      onFocus: s,
      onClick: (_) => {
        s(), _.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${r} ${I ? "has-card-metadata" : "no-card-metadata"} ${O ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${a ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          Ci,
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
          (R = e.tags) == null ? void 0 : R.map((_) => /* @__PURE__ */ n("span", { children: _.name }, _.id)),
          !((T = e.tags) != null && T.length) && /* @__PURE__ */ n("small", { children: "No matching tags" })
        ] }),
        r === "wall" && /* @__PURE__ */ n(Ro, { video: e })
      ]
    }
  );
}
function Ro({ video: e }) {
  const t = M(null), r = M(null), [i, a] = E(!1), [c, s] = E(!1), [g, m] = E(!1);
  return J(() => {
    const h = t.current;
    if (!h || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      a(!0), s(!0);
      return;
    }
    const v = new IntersectionObserver(
      ([b]) => a(b.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), C = new IntersectionObserver(
      ([b]) => s(b.isIntersecting && b.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return v.observe(h), C.observe(h), () => {
      v.disconnect(), C.disconnect();
    };
  }, [e.id, e.files.length]), J(() => {
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
  }, [i, e.id]), J(() => {
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
  canWrite: s,
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
  const T = M(null), _ = M(null), A = e.files[0], re = ei(e);
  J(() => {
    var P;
    const p = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (P = T.current) == null || P.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = p;
    };
  }, []);
  function X(p) {
    var j, ie, Re;
    if (p.key !== "Tab") return;
    const P = [
      ...((j = T.current) == null ? void 0 : j.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((de) => de.offsetParent !== null);
    if (!P.length) {
      p.preventDefault(), (ie = T.current) == null || ie.focus();
      return;
    }
    const w = P.indexOf(
      document.activeElement
    );
    p.shiftKey && w <= 0 ? (p.preventDefault(), (Re = P.at(-1)) == null || Re.focus()) : !p.shiftKey && w === P.length - 1 && (p.preventDefault(), P[0].focus());
  }
  function ne(p) {
    if (p.defaultPrevented || p.ctrlKey || p.metaKey || p.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const P = p.key === "ArrowLeft" || p.key === "ArrowRight";
    if (p.altKey && !P) return;
    const w = _.current, j = p.currentTarget.querySelector("video");
    if (p.key === "Enter" || p.key === "Escape")
      p.repeat || O();
    else if (p.key === " " && w)
      p.repeat || w.toggle();
    else if (P && w)
      w.seekBy(
        (p.key === "ArrowLeft" ? -1 : 1) * (p.shiftKey ? 5 : p.altKey ? 10 : 60)
      );
    else if ((p.key === "," || p.key === ".") && w) {
      const ie = [A == null ? void 0 : A.duration, j == null ? void 0 : j.duration].find(
        (de) => de != null && Number.isFinite(de) && de > 0
      ) ?? 0, Re = e.parentVideoId != null ? (e.clipEndSec ?? ie) - (e.clipStartSec ?? 0) : ie;
      Number.isFinite(Re) && Re > 0 && w.seekBy((p.key === "," ? -1 : 1) * Re * 0.1);
    } else if (p.key.toLowerCase() === "n" || p.key.toLowerCase() === "m")
      !p.repeat && !i && !a && (p.key.toLowerCase() === "n" && h && b(), p.key.toLowerCase() === "m" && v && I());
    else if (p.key === "ArrowUp" && j)
      j.volume = Math.min(1, j.volume + 0.1);
    else if (p.key === "ArrowDown" && j)
      j.volume = Math.max(0, j.volume - 0.1);
    else return;
    Ge(p);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: T,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${re}`,
      className: "dq-preview",
      onKeyDown: X,
      onKeyDownCapture: ne,
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
              children: /* @__PURE__ */ n(On, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !v || i || a,
              onClick: I,
              children: /* @__PURE__ */ n(Mn, {})
            }
          ),
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: re }),
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
              "aria-label": `Open ${re} details in new tab`,
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
              children: /* @__PURE__ */ n($n, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: A ? /* @__PURE__ */ n(
          Rn,
          {
            autostart: !0,
            streamUrl: Gn(e.id),
            posterUrl: gn(e),
            format: A.format,
            audioCodec: A.audioCodec,
            duration: A.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (p) => (_.current = p, () => {
              _.current === p && (_.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: gn(e), alt: "" }) }),
        c && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: c }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((p, P) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: i || a || p.steps.length > 0 && !s || yr(p) && !g,
            onClick: () => void R(p),
            children: [
              pt(p, P) && /* @__PURE__ */ n("kbd", { children: pt(p, P) }),
              p.label
            ]
          },
          p.id
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
  onChoose: s,
  onClose: g
}) {
  const [m, h] = E(
    () => i && t ? structuredClone(t) : null
  ), [v, C] = E(""), [b, I] = E(!1), [O, R] = E(
    i && t != null
  ), T = M(null);
  J(() => {
    var w, j;
    const p = document.activeElement, P = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (j = (w = T.current) == null ? void 0 : w.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || j.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = P, p == null || p.focus({ preventScroll: !0 });
    };
  }, []);
  function _(p) {
    var j, ie, Re;
    if (p.defaultPrevented) {
      p.stopPropagation();
      return;
    }
    if (p.key === "Escape") {
      Ge(p), b || g();
      return;
    }
    if (p.key !== "Tab") {
      p.stopPropagation();
      return;
    }
    const P = [
      ...((j = T.current) == null ? void 0 : j.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((de) => de.offsetParent !== null);
    if (!P.length) {
      Ge(p), (ie = T.current) == null || ie.focus();
      return;
    }
    const w = P.indexOf(
      document.activeElement
    );
    p.shiftKey && w <= 0 ? (Ge(p), (Re = P.at(-1)) == null || Re.focus()) : !p.shiftKey && w === P.length - 1 ? (Ge(p), P[0].focus()) : p.stopPropagation();
  }
  function A(p, P = !!p) {
    R(P), h(
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
  async function re() {
    if (b) return;
    if (!m || hr(m)) {
      C(m ? hr(m) : "Choose a review.");
      return;
    }
    const p = { ...m, name: m.name.trim() }, P = e.some((w) => w.id === p.id) ? e.map((w) => w.id === p.id ? p : w) : [...e, p];
    I(!0), C("");
    try {
      if (!await c(P)) throw new Error("Could not save reviews.");
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
        if (!await c(p)) throw new Error("Could not save reviews.");
      } catch (P) {
        C(
          P instanceof Error ? P.message : "Could not save reviews."
        );
      } finally {
        I(!1);
      }
    }
  }
  async function ne(p) {
    var w;
    if (b) return;
    const P = (w = p.target.files) == null ? void 0 : w[0];
    if (p.target.value = "", !!P) {
      if (P.size > 2e6) {
        C("Review files must be smaller than 2 MB.");
        return;
      }
      I(!0), C("");
      try {
        const j = nr(await P.text());
        if (!await c(Lr(e, j)))
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
      onKeyDown: _,
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
              children: /* @__PURE__ */ n($n, {})
            }
          )
        ] }),
        v && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: v }),
        /* @__PURE__ */ n("fieldset", { disabled: b, className: "dq-manager-content", children: m ? /* @__PURE__ */ n(
          oi,
          {
            setup: m.entityType !== "tag" && !e.some((p) => p.id === m.id),
            draft: m,
            entityTypeLocked: O,
            tagGroups: r,
            saving: b,
            setDraft: h,
            onSave: () => void re(),
            onCancel: g
          }
        ) : /* @__PURE__ */ u(Oe, { children: [
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
                  onChange: ne
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((p) => /* @__PURE__ */ u("article", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ u("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(Zn, { entityType: ve(p) }),
                /* @__PURE__ */ n("strong", { children: p.name })
              ] }),
              /* @__PURE__ */ n("p", { children: p.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => p.entityType === "tag" || ve(p) === "video" && p.view.reviewMode === "multiple" ? A(p) : a(p.id), children: [
              /* @__PURE__ */ n(Pn, {}),
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
                    e.filter((P) => P.id !== p.id)
                  );
                },
                children: /* @__PURE__ */ n(Ln, {})
              }
            )
          ] }, p.id)) })
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
  tagGroups: a,
  saving: c = !1,
  setDraft: s,
  onSave: g,
  onCancel: m
}) {
  const [h, v] = E("Review"), C = ve(r), b = (R) => {
    if (!(i || R === C)) {
      if (R === "performerOccurrence") {
        s({
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
      s(
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
    let T = I.current.get(R);
    return T || (T = crypto.randomUUID(), I.current.set(R, T)), T;
  };
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      Si,
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
              onChange: (R) => s({ ...r, name: R.target.value })
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
              onChange: (R) => s({ ...r, description: R.target.value })
            }
          )
        ] })
      ] }),
      !e && !t && /* @__PURE__ */ u("section", { hidden: h !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ n(bn, { draft: r, onChange: s, presentation: !1 }),
        r.entityType === "performerOccurrence" && /* @__PURE__ */ n(yn, { review: r, onChange: s })
      ] }),
      !t && r.entityType === "performerOccurrence" && /* @__PURE__ */ n("section", { hidden: h !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n(yn, { review: r, onChange: s, choices: !0 }) }),
      !t && (!e || C === "video") && /* @__PURE__ */ n("section", { hidden: h !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(bn, { draft: r, onChange: s, queue: !1 }) }),
      !t && /* @__PURE__ */ n("section", { hidden: h !== "Actions", className: "dq-editor-section", children: C === "tag" ? /* @__PURE__ */ n(
        Oo,
        {
          draft: r,
          saving: c,
          tagGroups: a,
          setDraft: s
        }
      ) : /* @__PURE__ */ n(
        Io,
        {
          draft: r,
          saving: c,
          stepKey: O,
          rememberStepKey: (R, T) => I.current.set(R, O(T)),
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
            const R = URL.createObjectURL(
              new Blob([JSON.stringify([r], null, 2)], {
                type: "application/json"
              })
            ), T = document.createElement("a");
            T.href = R, T.download = "data-quality-review.json", T.click(), URL.revokeObjectURL(R);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: m, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: g, children: t ? "Create & configure" : "Save review" })
    ] })
  ] });
}
function ai({
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
  const c = (s, g) => a({
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
                    children: /* @__PURE__ */ n(Gr, {})
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
                ai,
                {
                  action: s,
                  onChange: (v) => c(g, v)
                }
              ),
              /* @__PURE__ */ n(
                Mr,
                {
                  items: s.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (v) => c(g, { ...s, steps: v }),
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
                          ...s,
                          steps: s.steps.map(
                            (I, O) => O === C.index ? b : I
                          )
                        });
                      },
                      onRemove: () => c(g, {
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
                    onClick: () => c(g, {
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
  const a = (c, s) => i({
    ...e,
    actions: e.actions.map(
      (g, m) => m === c ? s : g
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
        getKey: (c) => c.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (c) => i({ ...e, actions: c }),
        renderItem: (c, { index: s, dragHandleProps: g, isOver: m }) => /* @__PURE__ */ u(
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
                    children: /* @__PURE__ */ n(Gr, {})
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
                ai,
                {
                  action: c,
                  onChange: (h) => a(s, h)
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
                      a(s, {
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
                      (h, v) => v !== s
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
  onChange: s,
  onRemove: g
}) {
  const m = ni(t.mode);
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
            children: /* @__PURE__ */ n(Gr, {})
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
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: g, children: /* @__PURE__ */ n(Ln, {}) })
      ]
    }
  );
}
async function Mo() {
  const e = await K("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const s = JSON.parse(r);
      Array.isArray(s.reviews) && (i = JSON.stringify(s.reviews, null, 2));
    } catch {
    }
  const a = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), c = document.createElement("a");
  c.href = a, c.download = "data-quality-browser-recovery.json", c.click(), URL.revokeObjectURL(a);
}
function En({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(Fn, { className: "dq-spin" }),
    e
  ] });
}
function Cn({
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
const Do = { components: { DataQualityPage: Eo } };
export {
  Eo as DataQualityPage,
  Do as default,
  rr as objectFiltersEqual
};
