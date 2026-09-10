import { jsxs as u, jsx as n, Fragment as Se } from "react/jsx-runtime";
import { useRef as O, useState as C, useCallback as dt, useEffect as K, useMemo as It, useLayoutEffect as pn } from "react";
import { DetailListToolbar as vr, VIDEO_SORT_OPTIONS as Or, VIDEO_CRITERIA as nr, EntityReferenceMultiSelector as rt, PERFORMER_CRITERIA as Qr, FilterDialog as gn, DetailListPagination as mn, VideoPlayer as hn, TAG_SORT_OPTIONS as yn, TAG_CRITERIA as bn, EntityDetailTabs as li, TagTile as di, VideoCard as ui, SortableList as Sr } from "@cove/runtime/components";
import { ChevronLeft as wn, Pencil as vn, Settings as fi, AlertTriangle as Er, Save as pi, RotateCcw as gi, ChevronRight as Sn, Film as Cr, Loader2 as En, Tags as mi, ExternalLink as hi, X as Cn, Plus as yi, Upload as bi, Trash2 as Nn, GripVertical as Pr } from "@cove/runtime/lucide-react";
import { extensionFetch as wi } from "@cove/runtime/api";
function qe(e) {
  return e.entityType ?? "video";
}
function ut(e, t) {
  return "qwertyuiop"[t] ?? "";
}
function ir(e) {
  if (e.entityType === "performerOccurrence") {
    if (!Tn(e.occurrence))
      return "Complete the optional occurrence condition before saving.";
    if (e.actions.some((t) => t.steps.some((r) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(r.mode))))
      return "Occurrence actions support adding and removing tags on the active performer. Video tag assessments are not supported here.";
  }
  return qe(e) === "video" && e.actions.some(
    (t) => An(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => kt(t, qe(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
function Ae(e) {
  const t = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(1e3, t(e.perPage, 40)))
  };
}
function Wr(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function Tt(e) {
  const { page: t, ...r } = e.view.filter, i = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    e.entityType === "performerOccurrence" ? ["performerOccurrence", ...i, e.occurrence] : qe(e) === "tag" ? ["tag", ...i] : i
  );
}
function kt(e, t) {
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
  ) && !An(e) : !1;
}
function or(e) {
  return "steps" in e ? e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  ) : !1;
}
function An(e) {
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
function Gt(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || r.entityType === "video" || r.entityType === "tag" || r.entityType === "performerOccurrence") && (r.entityType !== "performerOccurrence" || Tn(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && vi(r.presentation, r.entityType === "tag") && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (r.entityType === "tag" ? "effect" in i && !("steps" in i) && kt(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (a) => a && Array.isArray(a.tagIds)
      ) && kt(i, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => ir(r)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function vi(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const r = e;
  return (r.cardSize === void 0 || r.cardSize === null || Number.isFinite(r.cardSize) && r.cardSize >= 115 && r.cardSize <= 380) && (!t || r.annotations === void 0 && r.annotationParents === void 0 && r.binParents === void 0) && (r.annotations === void 0 || Array.isArray(r.annotations) && r.annotations.every(
    (i) => ["date", "studio", "performers", "tags"].includes(i)
  )) && [r.annotationParents, r.binParents].every(
    (i) => i === void 0 || Array.isArray(i) && i.every((a) => Number.isSafeInteger(a) && a > 0)
  );
}
function Nr(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const a of i)
      r.has(a.id) || (r.add(a.id), t.push(a));
  return t;
}
function Tn(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (i) => Array.isArray(i) && i.every((a) => Number.isSafeInteger(a) && a > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && (t.targetMode !== "selected" || t.performerIds.length > 0) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && ["any", "includes", "includesAll", "excludes", "isNull"].includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && r(t.tagIds) && typeof t.multiple == "boolean";
}
function zr(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function Hr(e, t, r, i) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!i && t.includes(r)) return r;
  const a = Math.max(0, e.indexOf(r));
  if (i) {
    for (const l of e.slice(a + 1))
      if (t.includes(l)) return l;
    if (t.includes(r)) {
      for (const l of e.slice(0, a).reverse())
        if (t.includes(l)) return l;
      return r;
    }
  }
  return t[Math.min(a, t.length - 1)];
}
function Si(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((a) => r.has(a));
  for (const a of t)
    i ? r.delete(a) : r.add(a);
  return r;
}
function Rn(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const In = "ext:com.midnightrider.data-quality:configuration", Ei = "ext:cove-data-quality:video-reviews", Ar = "ext:com.midnightrider.data-quality:progress", Bt = /* @__PURE__ */ new Map(), tr = /* @__PURE__ */ new Map(), Rt = (e, t) => e.includes("*") || e.includes(t), ar = (e) => D(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Ci = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Tr(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function qt(e) {
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
    reviews: Gt(JSON.stringify(t.reviews)),
    deletedIds: Tr(t.deletedIds),
    importedIds: Tr(t.importedIds)
  };
}
function Ni(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const a of t) {
    const l = localStorage.getItem(a);
    if (l !== null) {
      const s = Gt(l);
      r ?? (r = s), s.forEach((f) => i.add(f.id));
    }
    Tr(
      JSON.parse(localStorage.getItem(`${a}:account-imports`) ?? "[]")
    ).forEach((s) => i.add(s));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function qn(e) {
  const t = await D("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function kn(e, t) {
  const r = (tr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return tr.set(e, r), r.finally(() => {
    tr.get(e) === r && tr.delete(e);
  }).catch(() => {
  }), r;
}
let Ut = null;
function Ai() {
  if (Ut) return Ut;
  const e = Ti();
  return Ut = e, e.finally(() => {
    Ut === e && (Ut = null);
  }).catch(() => {
  }), e;
}
async function Ti() {
  var v;
  const e = await D("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = Rt(e.permissions, "savedfilters.read"), a = i && Rt(e.permissions, "savedfilters.write"), l = i ? (await ar(In)).filter((q) => q.name === "Data Quality configuration").sort((q, T) => q.id - T.id) : [];
  if (l.length > 1) {
    const q = (T) => {
      const { revision: A, ...R } = qt(T.uiOptions);
      return JSON.stringify(R);
    };
    if (l.some((T) => q(T) !== q(l[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (a)
      for (const T of l.slice(1))
        await D(`/api/savedfilters/${T.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${T.id}` })
        });
    l.splice(1);
  }
  let s = l.length ? qt(l[0].uiOptions) : Ci();
  const f = localStorage.getItem(`${r}:migrated`) === "true", p = localStorage.getItem(r), h = localStorage.getItem(`${r}:local-only`) === "true";
  !l.length && p && (s = qt(p));
  let S = !l.length;
  if (l.length && h && p) {
    const q = qt(p);
    if (q.reviews.some((A) => {
      const R = s.reviews.find((Q) => Q.id === A.id);
      return R && JSON.stringify(R) !== JSON.stringify(A);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const T = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...q.deletedIds])
    ];
    s = {
      ...s,
      reviews: Nr(s.reviews, q.reviews).filter(
        (A) => !T.includes(A.id)
      ),
      deletedIds: T,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...q.importedIds])
      ]
    }, S = !0;
  }
  if (!f) {
    const q = JSON.stringify(s), T = Ni(t);
    if (l.length && T.reviews.some((I) => {
      const Z = s.reviews.find((ne) => ne.id === I.id);
      return Z && JSON.stringify(Z) !== JSON.stringify(I);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const A = i ? (await ar(Ei)).flatMap(
      (I) => Gt(I.uiOptions ?? "[]")
    ) : [], R = T.known.filter(
      (I) => !T.reviews.some((Z) => Z.id === I)
    ), Q = /* @__PURE__ */ new Set([...s.deletedIds, ...R]);
    s = {
      ...s,
      reviews: Nr(
        T.reviews,
        s.reviews,
        A.filter(
          (I) => !T.known.includes(I.id) && !s.importedIds.includes(I.id)
        )
      ).filter((I) => !Q.has(I.id)),
      deletedIds: [...Q],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...T.known,
          ...A.map((I) => I.id)
        ])
      ]
    }, S || (S = JSON.stringify(s) !== q);
  }
  const E = {
    userId: t,
    recordId: (v = l[0]) == null ? void 0 : v.id,
    config: s,
    readable: i,
    writable: a,
    durable: a
  };
  if (Bt.set(r, E), S && a) {
    const q = s;
    l.length && (E.config = qt(l[0].uiOptions)), await On(r, q), s = E.config;
  } else l.length || (localStorage.setItem(r, JSON.stringify(s)), !i && (!f || h) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (a)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: s.reviews,
    storageKey: r,
    canWrite: Rt(e.permissions, "videos.write"),
    canWriteVideos: Rt(e.permissions, "videos.write"),
    canWriteTags: Rt(e.permissions, "tags.write"),
    canReadTagGroups: Rt(e.permissions, "taggroups.read"),
    canConfigure: !i || a,
    storageNotice: i ? a ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function On(e, t) {
  const r = Bt.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await qn(r), r.recordId != null) {
      const l = await D(
        `/api/savedfilters/${r.recordId}`
      );
      if (qt(l.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const a = await D(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: In,
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
function Ri(e, t) {
  return Gt(JSON.stringify(t)), kn(e, async () => {
    const r = Bt.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((a) => !t.some((l) => l.id === a.id)).map((a) => a.id);
    await On(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((a) => !t.some((l) => l.id === a))
    });
  });
}
function Xr(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([r, i]) => /^[1-9]\d*:[1-9]\d*$/.test(r) && ["reviewed", "cannotDetermine"].includes(String(i)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Ii(e, t) {
  const r = Bt.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), a = i ? Xr(i) : null;
  if (!r.readable) return a;
  const l = (await ar(Ar)).find(
    (f) => f.name === t
  ), s = l ? Xr(l.uiOptions) : null;
  return a && (!s || a.updatedAt > s.updatedAt) ? a : s;
}
function qi(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return kn(i, async () => {
    const a = Bt.get(e);
    if (!(a != null && a.writable)) return;
    await qn(a);
    const l = (await ar(Ar)).find(
      (s) => s.name === t
    );
    await D(
      l ? `/api/savedfilters/${l.id}` : "/api/savedfilters",
      {
        method: l ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Ar,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const bt = "confirmed_absent_tags", Mr = "Confirmed absent tags", ki = {
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
function Ot(e) {
  return Array.isArray(e) ? e.map(Ot) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? ki[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === bt.toLowerCase() ? r.toLowerCase() : Ot(r)
    ])
  ) : e;
}
async function D(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await wi(e, { ...t, headers: r });
  if (!i.ok) {
    let l = i.statusText || `Request failed (${i.status}).`;
    try {
      const s = await i.json();
      l = s.message || s.detail || s.error || l;
    } catch {
    }
    throw new Error(l);
  }
  if (i.status === 204 || i.status === 205) return;
  const a = await i.text();
  return a ? JSON.parse(a) : void 0;
}
const Oi = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Pi = 0;
function Fr(e) {
  return D(`/api/videos/${e}?dqRead=${Oi}-${++Pi}`, { cache: "no-store" });
}
async function Vt(e, t, r) {
  const i = { ...e.view.objectFilter }, a = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return D("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Ot({
        findFilter: Ae(t),
        objectFilter: i,
        filterExpression: a
      })
    )
  });
}
async function Yr(e, t, r) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, D("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Ot({
        findFilter: Ae(t),
        objectFilter: i
      })
    )
  });
}
function Mi(e) {
  return D("/api/taggroups", { signal: e });
}
function Fi(e) {
  return `/api/videos/${e.id}/image?max=1280&v=${encodeURIComponent(e.updatedAt)}`;
}
function Pn(e) {
  return `/api/stream/video/${e}`;
}
function Zr(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function $i(e) {
  return `/api/stream/video/${e}/preview`;
}
function Li(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function xi(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Jt(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const i of e) {
    await D(`/api/tags/${i}`, { signal: t }), r.add(i);
    for (let a = 1; ; a++) {
      const l = await D("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Ot({
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
      for (const s of l.items) r.add(s.id);
      if (a * 1e3 >= l.totalCount) break;
      if (!l.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...r];
}
function _i(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${bt} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function $r() {
  const t = (await D("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === bt.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${Mr} custom field before applying tag assessments.`
    };
  const r = _i(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function Di() {
  const e = await $r();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await D("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: bt,
        label: Mr,
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
function Ui(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${bt} value is not a valid tag list.`
    );
  return sr(e);
}
function ji(e) {
  return sr(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function Ki(e, t) {
  let r;
  try {
    r = await $r();
  } catch (h) {
    throw new Error(
      `Could not verify the ${Mr} custom field. ${h instanceof Error ? h.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const i = await Promise.all(
    e.steps.map(async (h) => ({
      ...h,
      tagIds: h.mode === "REMOVE_TREE" ? await Jt(h.tagIds) : sr(h.tagIds)
    }))
  ), a = i.filter(
    (h) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(h.mode)
  ), l = i.filter(
    (h) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(h.mode)
  ), s = sr(t), f = r.definition.key;
  let p = 0;
  for (const h of s)
    try {
      const S = await Fr(h), E = ji(S), v = { ...S.customFields ?? {} }, q = v[f], T = Ui(q), A = new Set(E), R = new Set(T);
      for (const ne of a)
        for (const ae of ne.tagIds)
          ne.mode === "ADD" ? A.add(ae) : A.delete(ae);
      for (const ne of l)
        for (const ae of ne.tagIds)
          ne.mode === "MARK_PRESENT" ? (A.add(ae), R.delete(ae)) : ne.mode === "MARK_ABSENT" ? (A.delete(ae), R.add(ae)) : R.delete(ae);
      const Q = [...A], I = [...R];
      JSON.stringify(E) === JSON.stringify(Q) && JSON.stringify(T) === JSON.stringify(I) && (q === void 0 ? I.length === 0 : JSON.stringify(q) === JSON.stringify(T)) || await D(`/api/videos/${h}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: Q,
          customFields: {
            ...v,
            [f]: I
          }
        })
      }), p++;
    } catch (S) {
      throw new Error(
        `Assessment stopped after ${p} video${p === 1 ? "" : "s"} completed; video ${h} was affected. Refresh and inspect it before retrying. ${S instanceof Error ? S.message : "Request failed."}`
      );
    }
}
async function Mn(e, t) {
  if (!kt(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (or(e)) {
    await Ki(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (i) => ({
      mode: i.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: i.mode === "REMOVE_TREE" ? await Jt(i.tagIds) : i.tagIds
    }))
  );
  for (let i = 0; i < r.length; i++)
    try {
      await D("/api/videos/bulk", {
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
async function Vi(e, t) {
  if (!kt(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await D("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
async function Gi(e, t, r) {
  if (!kt(r) || r.steps.some(
    (l) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(l.mode)
  ))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const i = await Promise.all(
    r.steps.map(async (l) => ({
      ...l,
      tagIds: l.mode === "REMOVE_TREE" ? await Jt(l.tagIds) : l.tagIds
    }))
  );
  let a = t.applications;
  for (const l of i)
    a = await Ln(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: l.tagIds,
          multiple: !0
        }
      },
      t,
      l.mode === "ADD" ? l.tagIds : []
    );
  return a;
}
async function Fn(e, t) {
  const r = e.occurrence;
  if (r.targetMode === "all" || r.targetMode === "filter" && Object.keys(r.performerFilter).length === 0) return null;
  if (r.targetMode === "selected") return r.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: a, ...l } = r.performerFilter;
  for (let s = 1; ; s++) {
    const f = await D("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Ot({
          findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: l,
          filterExpression: a
        })
      )
    });
    if (f.items.forEach((p) => i.add(p.id)), s * 1e3 >= f.totalCount) return [...i];
    if (!f.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function $n(e, t) {
  const { _filterExpression: r, ...i } = e.view.objectFilter, a = e.occurrence, l = {
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
            { filter: { performerFilterCriterion: l } }
          ]
        }
      }
    }
  };
}
function Bi(e, t, r = e.conditionTagIds.map((i) => [i])) {
  const i = new Set(t), a = (l) => l.some((s) => i.has(s));
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
async function Ji(e, t, r, i) {
  if ((t == null ? void 0 : t.length) === 0)
    return { items: [], totalCount: 0 };
  const a = await Vt(
    $n(e, t),
    { ...e.view.filter, page: r },
    i
  ), l = t === null ? null : new Set(t), s = e.occurrence, f = a.items.length && s.includeSubtags !== !1 && !["any", "isNull"].includes(s.condition) ? await Promise.all(s.conditionTagIds.map((S) => Jt([S], i))) : s.conditionTagIds.map((S) => [S]), p = new Array(a.items.length);
  let h = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, a.items.length) }, async () => {
      for (; h < a.items.length; ) {
        const S = h++, E = a.items[S], v = await D(
          `/api/tagapplications?hostType=video&hostId=${E.id}&contextType=performer`,
          { signal: i }
        );
        p[S] = E.performers.filter((q) => l === null || l.has(q.id)).flatMap((q) => {
          const T = v.filter(
            (A) => A.hostType === "video" && A.hostId === E.id && A.contextType === "performer" && A.contextId === q.id
          );
          return Bi(
            e.occurrence,
            T.map((A) => A.tag.id),
            f
          ) ? [
            {
              key: `${E.id}:${q.id}`,
              video: E,
              performer: q,
              applications: T
            }
          ] : [];
        });
      }
    })
  ), { items: p.flat(), totalCount: a.totalCount };
}
async function Ln(e, t, r) {
  const i = new Set(e.occurrence.tagIds);
  if (r.some((p) => !i.has(p)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const a = await Fr(t.video.id);
  if (!a.performers.some(
    (p) => p.id === t.performer.id
  ))
    throw new Error(
      "This performer is no longer linked to the scene. Refresh the queue."
    );
  const l = `/api/tagapplications?hostType=video&hostId=${a.id}&contextType=performer&contextId=${t.performer.id}`, s = (await D(l)).filter(
    (p) => p.hostType === "video" && p.hostId === a.id && p.contextType === "performer" && p.contextId === t.performer.id
  ), f = new Set(r);
  try {
    for (const p of f)
      s.some((h) => h.tag.id === p) || await D("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: "video",
          hostId: a.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: p,
          sourceKey: "user"
        })
      });
    for (const p of s)
      i.has(p.tag.id) && !f.has(p.tag.id) && await D(`/api/tagapplications/${p.id}`, {
        method: "DELETE"
      });
    return await D(l);
  } catch (p) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${p instanceof Error ? p.message : "Request failed."}`
    );
  }
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
  "startFrom"
], Qi = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0
};
function Rr(e) {
  const t = e.entityType === "performerOccurrence" ? e.occurrence : void 0;
  return {
    filter: Ae({
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
function en(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function tn(e, t) {
  if (!Lr.some((s) => t.has(s))) {
    const s = Rr(e);
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
    const s = t.get("sorts").split(",").map((f) => {
      const p = f.lastIndexOf(":");
      return { key: f.slice(0, p), direction: f.slice(p + 1) };
    });
    if (s.some((f) => !f.key || !["asc", "desc"].includes(f.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = s, i.sort = s[0].key, i.direction = s[0].direction;
  }
  let a;
  if (e.entityType === "performerOccurrence" && (a = {
    ...Qi,
    ...en(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(a.targetMode) || !["any", "includes", "includesAll", "excludes", "isNull"].includes(
    a.condition
  ) || !Array.isArray(a.performerIds) || !Array.isArray(a.conditionTagIds) || typeof a.includeSubtags != "boolean" || [...a.performerIds, ...a.conditionTagIds].some(
    (s) => !Number.isSafeInteger(s) || s <= 0
  ) || !a.performerFilter || typeof a.performerFilter != "object" || Array.isArray(a.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const l = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Ae(i),
      objectFilter: en(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: l,
      performerScope: a
    },
    startAtEnd: !t.has("page") && l === "end"
  };
}
function rn(e, t) {
  const r = new URLSearchParams(window.location.search);
  Lr.forEach((i) => r.delete(i)), r.set("review", e);
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
function Wi(e, t) {
  return {
    added: t.filter((r) => !e.includes(r)),
    removed: e.filter((r) => !t.includes(r))
  };
}
function zi(e) {
  return `/api/tagapplications?hostType=video&hostId=${e.video.id}&contextType=performer&contextId=${e.occurrence.performer.id}`;
}
async function Kt(e) {
  var l;
  if (e.occurrence) {
    const s = (await D(zi(e))).filter(
      (f) => f.hostType === "video" && f.hostId === e.video.id && f.contextType === "performer" && f.contextId === e.occurrence.performer.id
    );
    return {
      ids: [...new Set(s.map((f) => f.tag.id))],
      names: [...new Set(s.map((f) => f.tag.name))],
      absent: [],
      applications: s
    };
  }
  const t = await Fr(e.video.id), r = (t.tags ?? []).filter(
    (s) => s.canRemove !== !1 || s.isDerived !== !0
  ), i = Object.keys(t.customFields ?? {}).find(
    (s) => s.toLowerCase() === bt
  ) ?? bt, a = ((l = t.customFields) == null ? void 0 : l[i]) ?? [];
  if (!Array.isArray(a) || a.some((s) => !Number.isSafeInteger(s)))
    throw new Error(
      "Confirmed absent tags are invalid. Inspect the video before editing."
    );
  return { ids: r.map((s) => s.id), names: r.map((s) => s.name), absent: a };
}
async function Hi(e, t, r) {
  if (t.occurrence && e.entityType === "performerOccurrence")
    await Ln(
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
      a.length && await D("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({ ids: [t.video.id], tagMode: i, tagIds: a })
      });
}
async function Xi(e, t, r) {
  t.occurrence && e.entityType === "performerOccurrence" ? await Gi(e, t.occurrence, r) : await Mn(r, [t.video.id]);
}
const Yi = {
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
function xr(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Zi(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function xn(e) {
  return [
    ...new Set(
      xr(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function _n(e, t) {
  const r = xr(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((i) => {
      const a = String(i.key ?? ""), l = Yi[String(i.modifier ?? "EQUALS")], s = (E, v) => String(v ?? "").trim() || t[String(E)] || String(E ?? ""), f = s(
        i.value,
        i.displayValue
      ), p = s(
        i.value2,
        i.displayValue2
      ), h = String(i.modifier ?? "EQUALS"), S = h === "IS_NULL" || h === "NOT_NULL" ? [] : h === "BETWEEN" || h === "NOT_BETWEEN" ? [f, "and", p] : [f];
      return {
        ...i,
        label: [Zi(a), l, ...S].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function Dn(e) {
  const t = xr(e.customFieldCriteria);
  return t.length ? {
    ...e,
    customFieldCriteria: t.map(
      ({ label: r, ...i }) => i
    )
  } : e;
}
function Un(e, t, r) {
  return r || "customFieldCriteria" in t || !Array.isArray(e.customFieldCriteria) ? t : { ...t, customFieldCriteria: e.customFieldCriteria };
}
function nn({
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
function br(e, t) {
  if (!t) return e;
  const r = /* @__PURE__ */ new Map();
  for (const i of e)
    r.set(i.video.id, [...r.get(i.video.id) ?? [], i]);
  return [...r.values()].reverse().flat();
}
const Be = (e) => e instanceof Error ? e.message : "Request failed.";
function eo({
  actions: e,
  disabled: t,
  canWrite: r,
  onApply: i
}) {
  const [a, l] = C({});
  K(() => {
    let f = !0;
    return Promise.all(
      [
        ...new Set(
          e.flatMap(
            (p) => p.steps.flatMap((h) => h.tagIds)
          )
        )
      ].map(async (p) => {
        try {
          return [
            p,
            (await D(`/api/tags/${p}`)).name
          ];
        } catch {
          return [p, "Unavailable tag"];
        }
      })
    ).then((p) => {
      f && l(Object.fromEntries(p));
    }), () => {
      f = !1;
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
    e.map((f, p) => /* @__PURE__ */ u("div", { className: "dq-action-pair", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: t || !r && f.steps.length > 0,
          onClick: (h) => i(f, h.shiftKey),
          children: /* @__PURE__ */ u("span", { children: [
            ut(f, p) && /* @__PURE__ */ n("kbd", { children: ut(f, p) }),
            " ",
            f.label
          ] })
        }
      ),
      f.steps.length > 0 && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button",
          disabled: t || !r,
          "aria-label": `Apply & stay: ${f.label}`,
          onClick: () => i(f, !0),
          children: "Apply & stay"
        }
      ),
      f.steps.length > 0 && /* @__PURE__ */ n("small", { className: "dq-review-action-summary", children: f.steps.map(
        (h) => `${s[h.mode]}: ${h.tagIds.map((S) => a[S] ?? "Loading tag…").join(", ")}`
      ).join("; ") })
    ] }, f.id))
  ] });
}
function to({
  review: e,
  canWrite: t,
  onBusy: r,
  onSaveDefaults: i,
  editRequest: a = 0,
  renderRuleEditor: l
}) {
  var G, ft, pt, zt;
  const s = O(null), f = O("");
  if (!s.current)
    try {
      s.current = tn(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (c) {
      f.current = Be(c), s.current = { query: Rr(e), startAtEnd: !1 };
    }
  const [p, h] = C(null), S = O(null), E = O(null), v = O(null), [q, T] = C(!!f.current), A = O(0), [R, Q] = C(s.current.query), I = O(R);
  I.current = R;
  const [Z, ne] = C(0), ae = O(s.current.startAtEnd), [g, P] = C([]), [b, U] = C(null), ee = O(null), oe = O({ videoId: 0, playing: !1 }), [Ee, Pt] = C(null), se = dt((c) => {
    oe.current = { videoId: (b == null ? void 0 : b.video.id) ?? 0, playing: c };
  }, [b == null ? void 0 : b.video.id]), [nt, De] = C(0), [le, it] = C(!1), [be, Je] = C(!1), Ue = O(!1), Qe = O(!0), Me = O(null);
  K(() => (Qe.current = !0, () => {
    Qe.current = !1;
  }), []);
  const [Mt, ie] = C(f.current), [Ft, Te] = C(""), [de, We] = C(null), [H, je] = C(!1), [W, N] = C([]), j = O([]), V = O(null), ze = O(null), Qt = O(null);
  K(() => {
    var c, m;
    H && ((m = (c = Qt.current) == null ? void 0 : c.querySelector("input")) == null || m.focus());
  }, [H]);
  const [He, ot] = C(!1);
  K(() => {
    if (le || He || !ze.current) return;
    const c = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const m = ze.current;
      m != null && m.isConnected && !m.disabled && m.focus(), ze.current = null;
    });
    return () => cancelAnimationFrame(c);
  }, [le, He, Z]);
  const [X, at] = C([]), [cr, lr] = C({}), ue = O(null), st = O(0), x = O(!1), [wt, ke] = C({});
  K(() => {
    let c = !0;
    return Promise.all(
      xn(R.objectFilter).map(
        async (m) => [
          String(m),
          (await D(`/api/tags/${m}`)).name
        ]
      )
    ).then((m) => {
      c && ke(Object.fromEntries(m));
    }).catch(() => {
    }), () => {
      c = !1;
    };
  }, [R.objectFilter]);
  const Xe = O(0), $t = O(e);
  $t.current = e;
  const Lt = p ?? e, fe = It(
    () => jt(Lt, R),
    [Lt, R]
  ), Fe = O(fe);
  Fe.current = fe;
  const $e = be || le || H, Re = Number(R.filter.page);
  function z(c, m = !1) {
    Ue.current || (f.current = "", ae.current = m, I.current = c, Q(c), De(0), it(!0), m || rn(e.id, c), ne((k) => k + 1));
  }
  function ge() {
    if (Ue.current = !1, Je(!1), Qe.current && Me.current) {
      const c = Me.current;
      Me.current = null, z(c.query, c.startAtEnd);
    }
  }
  K(() => {
    const c = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const m = tn(
            $t.current,
            new URLSearchParams(window.location.search)
          );
          Ue.current ? Me.current = m : z(m.query, m.startAtEnd);
        } catch (m) {
          ie(Be(m));
        }
    };
    return window.addEventListener("popstate", c), () => window.removeEventListener("popstate", c);
  }, [e.id]), K(() => (r(be || le || H || !!p), () => r(!1)), [be, le, H, !!p, r]);
  async function me(c, m, k) {
    if (c.entityType === "performerOccurrence") {
      const $ = await Ji(
        c,
        ue.current,
        m,
        k
      );
      return {
        items: $.items.map((L) => ({
          key: L.key,
          video: L.video,
          occurrence: L
        })),
        totalCount: $.totalCount
      };
    }
    const _ = await Vt(
      c,
      { ...c.view.filter, page: m },
      k
    );
    return {
      items: _.items.map(($) => ({ key: String($.id), video: $ })),
      totalCount: _.totalCount
    };
  }
  function Ce(c, m, k, _ = !1) {
    if (!Qe.current || Me.current) return;
    T(!0), P(br(c.items, I.current.startFrom === "end")), De(c.totalCount), Le(k, _);
    const $ = {
      ...I.current,
      filter: { ...I.current.filter, page: m }
    };
    I.current = $, Q($), rn(e.id, $);
  }
  function Le(c, m = !1) {
    (c == null ? void 0 : c.key) !== (b == null ? void 0 : b.key) && (ee.current = null), (c == null ? void 0 : c.video.id) !== (b == null ? void 0 : b.video.id) && (oe.current = { videoId: 0, playing: !1 }, Pt(m && c ? c.video.id : null)), U(c);
  }
  K(() => {
    if (f.current) return;
    const c = new AbortController();
    v.current = c;
    const m = ++Xe.current;
    return it(!0), ie(""), Te(""), ee.current = null, Pt(null), oe.current = { videoId: 0, playing: !1 }, U(null), P([]), je(!1), (async () => {
      const k = jt($t.current, I.current);
      ue.current = k.entityType === "performerOccurrence" ? await Fn(k, c.signal) : null;
      let _ = Number(k.view.filter.page), $ = await me(k, _, c.signal);
      const L = Math.max(
        1,
        Math.ceil($.totalCount / Number(k.view.filter.perPage))
      );
      if ((ae.current || _ > L) && (_ = L, $ = await me(k, _, c.signal)), ae.current = !1, m !== Xe.current || c.signal.aborted) return;
      const xe = br($.items, k.view.startFrom === "end");
      Ce($, _, xe[0] ?? null);
    })().catch((k) => {
      !c.signal.aborted && m === Xe.current && ie(Be(k));
    }).finally(() => {
      !c.signal.aborted && m === Xe.current && (T(!0), it(!1));
    }), () => {
      c.abort(), Xe.current++;
    };
  }, [Z, e.id]), K(() => {
    if (We(null), !b) return;
    let c = !0;
    return Kt(b).then((m) => {
      c && (We(m), at(
        e.entityType === "performerOccurrence" ? m.ids.filter((k) => e.occurrence.tagIds.includes(k)) : []
      ));
    }).catch((m) => {
      c && ie(`Could not load current tags. ${Be(m)}`);
    }), () => {
      c = !1;
    };
  }, [b]), K(() => {
    if (e.entityType !== "performerOccurrence" || e.actions.length)
      return;
    let c = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (m) => [
          m,
          (await D(`/api/tags/${m}`)).name
        ]
      )
    ).then((m) => {
      c && lr(Object.fromEntries(m));
    }).catch((m) => {
      c && ie(Be(m));
    }), () => {
      c = !1;
    };
  }, [e]);
  async function Ie(c = !1, m = !1, k = !1) {
    var gt;
    if (!b) return;
    const _ = g.findIndex((Y) => Y.key === b.key), $ = R.startFrom === "end" ? -1 : 1, L = ((gt = ee.current) == null ? void 0 : gt.key) === b.key ? ee.current : { key: b.key, page: Re, before: g.slice(0, _ + 1).map((Y) => Y.key), after: g.slice(_ + 1).map((Y) => Y.key) }, xe = new Set(L.after), Ne = new Set(L.before), _e = g.find((Y) => {
      var Ze;
      return xe.has(Y.key) || ($ === 1 || Re < L.page) && ((Ze = ee.current) == null ? void 0 : Ze.key) === b.key && !Ne.has(Y.key);
    });
    if (!c && _e) {
      Le(_e, k);
      return;
    }
    const ct = c ? Ne : new Set(g.map((Y) => Y.key)), lt = 1100 - (Date.now() - st.current);
    lt > 0 && await new Promise((Y) => window.setTimeout(Y, lt));
    let we = $ === -1 && !c ? Math.max(1, Re - 1) : Re;
    for (; Qe.current && !Me.current; ) {
      let Y = await me(fe, we);
      const Ze = Math.max(
        1,
        Math.ceil(Y.totalCount / Number(R.filter.perPage))
      );
      if (we > Ze && (we = Ze, Y = await me(fe, we)), m) {
        ee.current = L, Ce(Y, we, b);
        return;
      }
      const et = $ === -1 && Re === 1 && !c ? void 0 : br(Y.items, $ === -1).find(
        (xt) => !ct.has(xt.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(c && $ === -1 && we === L.page) || xe.has(xt.key))
      );
      if (et || ($ === -1 ? we <= 1 : we >= Ze)) {
        Ce(Y, we, et ?? null, k), et || Te(
          Y.totalCount ? "Reached the end in this direction. Matching items remain available from the scene pages." : "No matching scenes."
        );
        return;
      }
      we += $;
    }
  }
  async function Ke(c, m = !1, k = !1, _ = !1) {
    if (p || !b || Ue.current || le || H && !k)
      return;
    const $ = k || _ || !!(c != null && c.steps.length), L = $ && oe.current.videoId === b.video.id && oe.current.playing;
    if ($ && (!t || !de)) return;
    Ue.current = !0, Je(!0), ie(""), Te("");
    let xe = !1;
    try {
      if ($) {
        const Ne = await Kt(b);
        if (c)
          await Xi(fe, b, c);
        else {
          const ct = _ && e.entityType === "performerOccurrence" ? e.occurrence.tagIds.filter((gt) => Ne.ids.includes(gt)) : j.current, we = Wi(ct, _ ? X : W);
          await Hi(fe, b, we);
        }
        st.current = Date.now();
        const _e = await Kt(b);
        We(_e), xe = !0, je(!1), Te("Tags saved.");
      }
      if (!Qe.current || Me.current) return;
      $ ? await Ie(!0, m, L) : m || await Ie(), m && k && requestAnimationFrame(() => {
        var Ne;
        return (Ne = V.current) == null ? void 0 : Ne.focus();
      });
    } catch (Ne) {
      if (ie(
        xe ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Be(Ne)}` : $ ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Be(Ne)}` : `Could not advance. ${Be(Ne)}`
      ), $ && !xe) {
        st.current = Date.now();
        try {
          We(await Kt(b));
        } catch {
          We(null), ie(
            (_e) => `${_e} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      ge();
    }
  }
  K(() => {
    const c = (m) => {
      if (H || p || be || le || He || m.defaultPrevented || m.repeat || m.ctrlKey || m.altKey || m.metaKey || !Rn(m.target) || document.querySelector('[role="dialog"], dialog[open]'))
        return;
      const k = m.key.toLowerCase(), _ = e.actions.find(
        ($, L) => ut($, L) === k
      );
      _ && (m.preventDefault(), m.stopPropagation(), Ke(_, m.shiftKey));
    };
    return document.addEventListener("keydown", c), () => document.removeEventListener("keydown", c);
  });
  function Ve() {
    !i || p || Ue.current || H || (E.current = document.activeElement, S.current = {
      error: Mt,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(I.current),
      items: g,
      current: b,
      total: nt,
      targets: ue.current,
      stayedCursor: ee.current
    }, h(structuredClone(jt(e, I.current))), Te(""), ie(""));
  }
  K(() => {
    a && a !== A.current && q && !le && (A.current = a, Ve());
  }, [a, le, q]);
  function vt() {
    h(null), requestAnimationFrame(() => {
      var c;
      return (c = E.current) == null ? void 0 : c.focus();
    });
  }
  function St() {
    var m;
    const c = S.current;
    !c || be || ((m = v.current) == null || m.abort(), Xe.current++, I.current = c.query, Q(c.query), P(c.items), U(c.current), De(c.total), ue.current = c.targets, ee.current = c.stayedCursor, it(!1), ie(c.error), Te(""), window.history.replaceState(window.history.state, "", c.url), vt());
  }
  async function Wt() {
    if (!p || !i || Ue.current) return;
    const c = jt(
      { ...p, name: p.name.trim() },
      I.current
    ), m = ir(c);
    if (m) {
      ie(m);
      return;
    }
    Ue.current = !0, Je(!0), ie("");
    try {
      if (await i(c) === !1) throw new Error("Could not save review.");
      vt(), Te("Review saved.");
    } catch (k) {
      ie(
        "Could not save review. Your edits are still open. " + Be(k)
      );
    } finally {
      ge();
    }
  }
  const J = R.performerScope, Ye = (c) => z({
    ...I.current,
    filter: { ...I.current.filter, page: 1 },
    performerScope: { ...J, ...c }
  });
  return /* @__PURE__ */ u(
    "section",
    {
      className: "dq-review-workspace",
      "aria-label": J ? "Performer occurrence review" : "Video review",
      children: [
        p && /* @__PURE__ */ u("section", { className: "dq-rule-editor", "aria-label": "Edit review rule", children: [
          /* @__PURE__ */ n("h2", { children: "Edit review" }),
          /* @__PURE__ */ n("p", { children: "Preview matching scenes below. Save review keeps all rule changes; Cancel restores your previous view." }),
          /* @__PURE__ */ u("fieldset", { disabled: be, children: [
            l == null ? void 0 : l(
              jt(p, R),
              h,
              be
            ),
            /* @__PURE__ */ u("label", { children: [
              "Review direction",
              /* @__PURE__ */ u(
                "select",
                {
                  "aria-label": "Review direction",
                  value: R.startFrom,
                  onChange: (c) => z({
                    ...I.current,
                    startFrom: c.target.value
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
                disabled: be || le,
                onClick: () => void Wt(),
                children: "Save review"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button",
                type: "button",
                disabled: be,
                onClick: St,
                children: "Cancel"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u(
          "fieldset",
          {
            className: "dq-review-filters",
            disabled: $e,
            onClickCapture: (c) => {
              var _;
              const m = c.target instanceof Element ? c.target.closest("button") : null, k = (m == null ? void 0 : m.getAttribute("aria-label")) ?? ((_ = m == null ? void 0 : m.textContent) == null ? void 0 : _.trim()) ?? "";
              m && !m.closest('[role="dialog"], dialog') && /^(Filters|Edit filter:|Edit performer criteria)/.test(k) && (ze.current = m);
            },
            children: [
              /* @__PURE__ */ n("legend", { children: "Scene filters" }),
              /* @__PURE__ */ n(
                "div",
                {
                  onKeyDownCapture: (c) => {
                    var m;
                    c.key === "Escape" && (x.current = !1), ["Delete", "Backspace"].includes(c.key) && c.target instanceof Element && ((m = c.target.closest("button")) == null ? void 0 : m.getAttribute("aria-label")) === "Edit filter: Custom Fields" && (x.current = !0);
                  },
                  onClickCapture: (c) => {
                    var k, _;
                    const m = c.target instanceof Element ? c.target.closest("button") : null;
                    (m == null ? void 0 : m.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((k = m == null ? void 0 : m.textContent) == null ? void 0 : k.trim()) === "Clear all" ? x.current = !0 : (/^(Cancel|Filters)/.test(((_ = m == null ? void 0 : m.textContent) == null ? void 0 : _.trim()) ?? "") || /^(Close|Dismiss)/.test((m == null ? void 0 : m.getAttribute("aria-label")) ?? "")) && (x.current = !1);
                  },
                  children: /* @__PURE__ */ n(
                    vr,
                    {
                      filter: R.filter,
                      objectFilter: _n(
                        R.objectFilter,
                        wt
                      ),
                      criteriaDefinitions: [
                        ...nr,
                        {
                          id: "custom-fields",
                          label: "Custom Fields",
                          filterKey: "customFieldCriteria"
                        }
                      ],
                      totalCount: nt,
                      sortOptions: Or,
                      showSearch: !0,
                      showSort: !0,
                      showPagingControls: !1,
                      onFilterChange: (c) => {
                        (c.sort !== I.current.filter.sort || c.direction !== I.current.filter.direction) && (c = { ...c, sorts: void 0 }), z({
                          ...I.current,
                          filter: Ae(c)
                        });
                      },
                      onObjectFilterChange: (c) => {
                        const m = Un(
                          I.current.objectFilter,
                          Dn(c),
                          x.current
                        );
                        x.current = !1, z({
                          ...I.current,
                          objectFilter: m,
                          filter: { ...I.current.filter, page: 1 }
                        });
                      }
                    }
                  )
                }
              ),
              J && /* @__PURE__ */ u("div", { className: "dq-scope-controls", children: [
                /* @__PURE__ */ u("label", { children: [
                  "Performers to review",
                  " ",
                  /* @__PURE__ */ u(
                    "select",
                    {
                      value: J.targetMode,
                      onChange: (c) => Ye({
                        targetMode: c.target.value
                      }),
                      children: [
                        /* @__PURE__ */ n("option", { value: "all", children: "All performers" }),
                        /* @__PURE__ */ n("option", { value: "selected", children: "Specific performers" }),
                        /* @__PURE__ */ n("option", { value: "filter", children: "Matching performer criteria" })
                      ]
                    }
                  )
                ] }),
                J.targetMode === "selected" && /* @__PURE__ */ n(
                  rt,
                  {
                    entityType: "performer",
                    values: J.performerIds,
                    onChange: (c) => Ye({ performerIds: c }),
                    placeholder: "Select performers to review...",
                    allowCreate: !1
                  }
                ),
                J.targetMode === "filter" && /* @__PURE__ */ u(Se, { children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => ot(!0),
                      children: "Edit performer criteria"
                    }
                  ),
                  /* @__PURE__ */ n("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ n(
                    vr,
                    {
                      filter: {},
                      onFilterChange: () => {
                      },
                      totalCount: 0,
                      sortOptions: [],
                      showSearch: !1,
                      showSort: !1,
                      showPagingControls: !1,
                      criteriaDefinitions: Qr,
                      objectFilter: J.performerFilter,
                      onObjectFilterChange: (c) => Ye({ performerFilter: c })
                    }
                  ) })
                ] }),
                /* @__PURE__ */ u("label", { children: [
                  "Occurrence tags",
                  " ",
                  /* @__PURE__ */ u(
                    "select",
                    {
                      value: J.condition,
                      onChange: (c) => Ye({
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
                !["any", "isNull"].includes(J.condition) && /* @__PURE__ */ u(Se, { children: [
                  /* @__PURE__ */ n(
                    rt,
                    {
                      entityType: "tag",
                      values: J.conditionTagIds,
                      onChange: (c) => Ye({ conditionTagIds: c }),
                      placeholder: "Occurrence condition tags...",
                      allowCreate: !1
                    }
                  ),
                  /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "checkbox",
                        checked: J.includeSubtags ?? !0,
                        onChange: (c) => Ye({ includeSubtags: c.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] })
                ] })
              ] }),
              !p && /* @__PURE__ */ u("div", { className: "dq-row", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    onClick: () => {
                      const c = Rr(e);
                      z(c, c.startFrom === "end");
                    },
                    children: "Reset to review defaults"
                  }
                ),
                i && /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    onClick: Ve,
                    children: "Save as review defaults"
                  }
                )
              ] })
            ]
          }
        ),
        J && /* @__PURE__ */ n(
          gn,
          {
            open: He,
            onClose: () => ot(!1),
            criteria: Qr,
            activeFilter: J.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (c) => {
              ot(!1), Ye({ performerFilter: c });
            }
          }
        ),
        /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
          Mt && /* @__PURE__ */ u("p", { role: "alert", children: [
            Mt,
            " ",
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: be,
                onClick: () => {
                  b ? Kt(b).then(We).catch((c) => ie(Be(c))) : z(I.current);
                },
                children: b ? "Reload tags" : "Retry queue"
              }
            )
          ] }),
          Ft && /* @__PURE__ */ n("p", { role: "status", children: Ft })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-review-layout", children: [
          /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
            /* @__PURE__ */ n("fieldset", { disabled: $e, children: /* @__PURE__ */ n(
              mn,
              {
                filter: R.filter,
                totalCount: nt,
                onFilterChange: (c) => z({ ...R, filter: Ae(c) })
              }
            ) }),
            /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: g.map((c) => {
              var m, k, _;
              return /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  title: `${c.occurrence ? `${c.occurrence.performer.name} — ` : ""}${c.video.title || ((m = c.video.files[0]) == null ? void 0 : m.basename) || "Scene"}`,
                  "aria-label": `${c.occurrence ? `${c.occurrence.performer.name} — ` : ""}${c.video.title || ((k = c.video.files[0]) == null ? void 0 : k.basename) || "Scene"}`,
                  disabled: $e,
                  "aria-pressed": (b == null ? void 0 : b.key) === c.key,
                  onClick: () => {
                    Le(c), ie(""), Te("");
                  },
                  children: [
                    c.occurrence && /* @__PURE__ */ n(nn, { performer: c.occurrence.performer }),
                    /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: c.video.title || ((_ = c.video.files[0]) == null ? void 0 : _.basename) || "Scene" })
                  ]
                },
                c.key
              );
            }) })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-inspector", children: b ? /* @__PURE__ */ u(Se, { children: [
            /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
              /* @__PURE__ */ n("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ n(
                "a",
                {
                  href: `/video/${b.video.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: b.video.title || ((G = b.video.files[0]) == null ? void 0 : G.basename) || `Video ${b.video.id}`
                }
              ) }),
              /* @__PURE__ */ n(
                hn,
                {
                  videoId: b.video.id,
                  streamUrl: Pn(b.video.id),
                  posterUrl: Fi(b.video),
                  duration: ((ft = b.video.files[0]) == null ? void 0 : ft.duration) ?? 0,
                  format: (pt = b.video.files[0]) == null ? void 0 : pt.format,
                  audioCodec: (zt = b.video.files[0]) == null ? void 0 : zt.audioCodec,
                  extensionSurface: "quick-view",
                  autostart: Ee === b.video.id,
                  onPlaybackStateChange: se,
                  showAbLoop: !0,
                  clip: b.video.parentVideoId != null ? {
                    start: b.video.clipStartSec ?? 0,
                    end: b.video.clipEndSec,
                    loop: !1
                  } : void 0
                },
                b.video.id
              )
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-panel", children: [
              /* @__PURE__ */ n("h2", { children: b.occurrence ? `Reviewing ${b.occurrence.performer.name}` : "Reviewing this video" }),
              /* @__PURE__ */ n("p", { children: J ? "Tags apply only to this performer in this video." : "Tags apply to the video." }),
              J && /* @__PURE__ */ n(
                "div",
                {
                  className: "dq-review-partners",
                  "aria-label": "Matching scene partners",
                  children: g.filter((c) => c.video.id === b.video.id).map((c) => {
                    var m, k;
                    return /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button dq-partner-button",
                        title: (m = c.occurrence) == null ? void 0 : m.performer.name,
                        "aria-label": (k = c.occurrence) == null ? void 0 : k.performer.name,
                        disabled: $e,
                        "aria-pressed": c.key === b.key,
                        onClick: () => {
                          Le(c), ie("");
                        },
                        children: c.occurrence && /* @__PURE__ */ n(
                          nn,
                          {
                            performer: c.occurrence.performer
                          }
                        )
                      },
                      c.key
                    );
                  })
                }
              ),
              /* @__PURE__ */ u("p", { children: [
                "Current ",
                J ? "occurrence" : "video",
                " tags:",
                " ",
                de ? de.names.join(", ") || "None" : "Loading…"
              ] }),
              de != null && de.absent.length ? /* @__PURE__ */ u("p", { children: [
                "Confirmed absent tags:",
                " ",
                /* @__PURE__ */ n(
                  rt,
                  {
                    entityType: "tag",
                    values: de.absent,
                    onChange: () => {
                    },
                    disabled: !0,
                    allowCreate: !1
                  }
                )
              ] }) : null,
              H ? /* @__PURE__ */ u(
                "fieldset",
                {
                  ref: Qt,
                  disabled: be,
                  className: "dq-tag-editor",
                  children: [
                    /* @__PURE__ */ u("legend", { children: [
                      "Edit ",
                      J ? "occurrence" : "video",
                      " tags"
                    ] }),
                    /* @__PURE__ */ n(
                      rt,
                      {
                        entityType: "tag",
                        values: W,
                        onChange: N,
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
                          disabled: !de,
                          onClick: () => void Ke(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !de,
                          onClick: () => void Ke(void 0, !1, !0),
                          children: "Save & next"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => {
                            je(!1), requestAnimationFrame(
                              () => {
                                var c;
                                return (c = V.current) == null ? void 0 : c.focus();
                              }
                            );
                          },
                          children: "Cancel"
                        }
                      )
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ u(Se, { children: [
                /* @__PURE__ */ n(
                  eo,
                  {
                    actions: Lt.actions,
                    canWrite: t,
                    disabled: be || le || !de || !!p,
                    onApply: (c, m) => void Ke(c, m)
                  }
                ),
                e.entityType === "performerOccurrence" && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                  "fieldset",
                  {
                    disabled: !t || be || !de || !!p,
                    children: [
                      /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                      e.occurrence.tagIds.map((c) => /* @__PURE__ */ u("label", { children: [
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: e.occurrence.multiple ? "checkbox" : "radio",
                            name: "legacy-choice",
                            checked: X.includes(c),
                            onChange: (m) => at(
                              e.occurrence.multiple ? m.target.checked ? [...X, c] : X.filter(
                                (k) => k !== c
                              ) : [c]
                            )
                          }
                        ),
                        cr[c] ?? "Loading tag…"
                      ] }, c)),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          onClick: () => at([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void Ke(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Ke(void 0, !1, !1, !0),
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
                    ref: V,
                    className: "dq-button",
                    disabled: $e || !!p || !t || !de,
                    onClick: () => {
                      j.current = [...de.ids], N([...de.ids]), je(!0);
                    },
                    children: "Edit tags"
                  }
                ),
                /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: $e || !!p,
                    onClick: () => void Ke(),
                    children: [
                      "Skip",
                      J ? " performer" : " video"
                    ]
                  }
                )
              ] }),
              !t && /* @__PURE__ */ n("p", { children: "Write permission is required to change tags." })
            ] })
          ] }) : /* @__PURE__ */ n("p", { role: "status", children: le ? "Loading review…" : nt ? "Reached the end in this direction." : "No matching scenes." }) })
        ] })
      ]
    }
  );
}
function on({
  review: e,
  onChange: t,
  choices: r = !1
}) {
  const i = e.occurrence, a = (l) => t({ ...e, occurrence: { ...i, ...l } });
  return r ? /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ n("p", { children: "Choose the tags this review can change on the active performer’s appearance in a scene. Other tags are preserved." }),
    /* @__PURE__ */ n(
      rt,
      {
        entityType: "tag",
        values: i.tagIds,
        onChange: (l) => a({ tagIds: l }),
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
          onChange: (l) => a({ multiple: l.target.checked })
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
          onChange: (l) => a({
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
    !["any", "isNull"].includes(i.condition) && /* @__PURE__ */ u(Se, { children: [
      /* @__PURE__ */ n(
        rt,
        {
          entityType: "tag",
          values: i.conditionTagIds,
          onChange: (l) => a({ conditionTagIds: l }),
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
            onChange: (l) => a({ includeSubtags: l.target.checked })
          }
        ),
        "Include subtags"
      ] })
    ] }),
    /* @__PURE__ */ n("p", { children: "Conditions check tags on the same performer’s occurrence, independently of scene tags and the performer’s profile." })
  ] });
}
function ro(e) {
  var f, p, h;
  const [t, r] = C({}), [i, a] = C(""), l = (((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.annotations) ?? []).includes("tags") ? ((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...l,
      ...((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.binParents) ?? []
    ])
  ]);
  return K(() => {
    let S = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(s).map(
        async (E) => [E, await Jt([E])]
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
  }, [s]), { ids: t, error: i };
}
function no(e, t, r) {
  const i = t == null ? void 0 : t.presentation, a = (i == null ? void 0 : i.annotations) ?? [], l = (i == null ? void 0 : i.annotationParents) ?? [];
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
    tags: a.includes("tags") && l.length > 0 ? (e.tags ?? []).filter(
      (s) => l.some(
        (f) => {
          var p;
          return f !== s.id && ((p = r[f]) == null ? void 0 : p.includes(s.id));
        }
      )
    ) : []
  };
}
function io({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: a
}) {
  var f, p, h;
  const l = new Set(
    (((f = t.presentation) == null ? void 0 : f.binParents) ?? []).flatMap(
      (S) => (r[S] ?? []).filter((E) => E !== S)
    )
  ), s = /* @__PURE__ */ new Map();
  for (const S of e)
    for (const E of S.tags ?? [])
      if (l.has(E.id)) {
        const v = s.get(E.id) ?? { name: E.name, count: 0 };
        v.count++, s.set(E.id, v);
      }
  return (h = (p = t.presentation) == null ? void 0 : p.binParents) != null && h.length ? /* @__PURE__ */ u("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...s].sort((S, E) => S[1].name.localeCompare(E[1].name)).map(([S, E]) => /* @__PURE__ */ u(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
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
function oo(e, t) {
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
function an({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [a, l] = C(!1), s = qe(e) === "tag" ? "tag" : "video", f = e.view.filter, p = s === "tag" ? yn : Or, h = (v) => t({
    ...e,
    view: { ...e.view, filter: { ...f, ...v } }
  }), S = s === "video" ? e.presentation ?? {} : {}, E = (v) => t({ ...e, presentation: { ...S, ...v } });
  return /* @__PURE__ */ u(Se, { children: [
    i && /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ u("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(f.q ?? ""),
            onChange: (v) => h({ q: v.target.value })
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
              onChange: (v) => h({ sort: v.target.value, sorts: void 0 }),
              children: [
                !p.some((v) => v.value === f.sort) && f.sort != null && /* @__PURE__ */ n("option", { value: String(f.sort), children: String(f.sort) }),
                p.map((v) => /* @__PURE__ */ n("option", { value: v.value, children: v.label }, v.value))
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
              onChange: (v) => h({ direction: v.target.value }),
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
              value: Number(f.perPage) || 40,
              onChange: (v) => h({
                perPage: Math.max(
                  1,
                  Math.min(1e3, Number(v.target.value) || 40)
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
              onChange: (v) => t({
                ...e,
                view: {
                  ...e.view,
                  startFrom: v.target.value
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
          onClick: () => l(!0),
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
      a && /* @__PURE__ */ n("div", { onKeyDown: (v) => v.stopPropagation(), children: /* @__PURE__ */ n(
        gn,
        {
          open: !0,
          onClose: () => l(!1),
          criteria: s === "tag" ? bn : nr,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: s === "video",
          subjectLabel: s === "tag" ? "tags" : "videos",
          onApply: (v) => {
            t({ ...e, view: { ...e.view, objectFilter: v } }), l(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ u(Se, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ u("p", { className: "dq-editor-note", children: [
        "Choose how ",
        s === "tag" ? "tags" : "videos and tags",
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ n("div", { className: "dq-field-grid", children: /* @__PURE__ */ u("label", { children: [
        "Preferred view",
        /* @__PURE__ */ n(
          "select",
          {
            value: s === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid",
            onChange: (v) => t({
              ...e,
              view: {
                ...e.view,
                displayMode: v.target.value
              }
            }),
            children: (s === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((v) => /* @__PURE__ */ n("option", { children: v }, v))
          }
        )
      ] }) }),
      s === "video" && /* @__PURE__ */ u(Se, { children: [
        /* @__PURE__ */ n("h4", { children: "Card annotations" }),
        /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((v) => {
          const q = S.annotations ?? [];
          return /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: q.includes(v),
                onChange: (T) => E({
                  annotations: T.target.checked ? [...q, v] : q.filter((A) => A !== v)
                })
              }
            ),
            v
          ] }, v);
        }) }),
        (S.annotations ?? []).includes("tags") && /* @__PURE__ */ u(Se, { children: [
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
          /* @__PURE__ */ n(
            rt,
            {
              entityType: "tag",
              values: S.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (v) => E({ annotationParents: v }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ n("h4", { children: "Tag bins" }),
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ n(
          rt,
          {
            entityType: "tag",
            values: S.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (v) => E({ binParents: v }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const wr = 180, ao = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function jn({ entityType: e }) {
  return e === "tag" ? /* @__PURE__ */ n(mi, { role: "img", "aria-label": "Tag review" }) : /* @__PURE__ */ n(Cr, { role: "img", "aria-label": e === "performerOccurrence" ? "Performer occurrence review" : "Video review" });
}
function sn(e) {
  return qe(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function cn(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function ln() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function dn(e) {
  const t = new URLSearchParams(window.location.search);
  Lr.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function so(e) {
  return Ae({ ...e, page: 1 });
}
function Ir(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, f) => Ir(s, t[f]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, a = Object.keys(r).sort(), l = Object.keys(i).sort();
  return a.length === l.length && a.every(
    (s, f) => s === l[f] && Ir(r[s], i[s])
  );
}
function Kn(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Pe(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
const Vn = "data-quality.workspace-layout.v1", _r = 240, qr = 192, kr = 560;
function Gn(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(kr, Math.max(qr, e)) : _r;
}
function co() {
  try {
    const e = JSON.parse(
      localStorage.getItem(Vn) ?? "null"
    );
    return Gn(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return _r;
  }
}
function lo(e) {
  try {
    localStorage.setItem(
      Vn,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function Bn(e) {
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
function Jn(e, t) {
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
function uo(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : Jn(e, t);
}
function fo({
  onNavigate: e
}) {
  const [t, r] = C([]), [i] = C(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [a, l] = C(""), [s, f] = C(!0), [p, h] = C(""), [S, E] = C(!1), [v, q] = C(!1), [T, A] = C(!1), [R, Q] = C([]), [I, Z] = C(""), [ne, ae] = C(!0), [g, P] = C(""), [b, U] = C(""), [ee, oe] = C(!1), [Ee, Pt] = C(!1), [se, nt] = C(ln), [De, le] = C({}), [it, be] = C("name"), [Je, Ue] = C("asc"), Qe = O(null), Me = O(!1), [Mt, ie] = C(0), [Ft, Te] = C(!1), [de, We] = C(!1), [H, je] = C(
    null
  ), W = t.find((o) => o.id === se) ?? null, N = It(
    () => (H == null ? void 0 : H.id) === se && W ? { ...W, view: H.view } : W,
    [H, se, W]
  );
  K(() => {
    const o = () => nt(ln());
    return window.addEventListener("popstate", o), () => window.removeEventListener("popstate", o);
  }, []);
  const j = N ? qe(N) : "video", V = j === "video" ? N : null, ze = j === "tag" ? v : S, Qt = It(() => {
    const o = Je === "asc" ? 1 : -1;
    return [...t].sort((d, y) => {
      if (it === "count") {
        const w = De[d.id], F = De[y.id], M = typeof w == "number", B = typeof F == "number";
        if (M !== B) return M ? -1 : 1;
        if (M && B && w !== F)
          return (w - F) * o;
      }
      return d.name.localeCompare(y.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * o;
    });
  }, [Je, it, De, t]), He = O(
    null
  ), ot = ro(V), [X, at] = C({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [cr, lr] = C({
    page: 1,
    perPage: 40
  }), [ue, st] = C({ items: [], totalCount: 0 }), [x, wt] = C(!1), [ke, Xe] = C(""), [$t, Lt] = C(!1), [fe, Fe] = C(() => /* @__PURE__ */ new Set()), $e = O(fe);
  $e.current = fe;
  const Re = O(/* @__PURE__ */ new Map()), [z, ge] = C(null), me = O(z);
  me.current = z;
  const [Ce, Le] = C(!1), Ie = O(Ce);
  Ie.current = Ce;
  const Ke = O(null), [Ve, vt] = C("grid"), [St, Wt] = C(wr), [J, Ye] = C(co), [G, ft] = C(!1), pt = O(!1), [zt, c] = C(""), [m, k] = C(""), [_, $] = C(""), [L, xe] = C(null), [Ne, _e] = C(""), [ct, lt] = C(!1), [we, gt] = C({}), [Y, Ze] = C({}), et = O(/* @__PURE__ */ new Map()), xt = O(null), Ht = O(null), Et = O(0), Xt = O(0), Yt = O(null), mt = O(!1), Dr = JSON.stringify([
    ...new Set(
      (V == null ? void 0 : V.actions.flatMap(
        (o) => o.steps.flatMap((d) => d.tagIds)
      )) ?? []
    )
  ]);
  function dr(o) {
    const d = Gn(o);
    Ye(d), lo(d);
  }
  function zn(o) {
    const d = o.shiftKey ? 40 : 16;
    let y = null;
    o.key === "ArrowLeft" && (y = J + d), o.key === "ArrowRight" && (y = J - d), o.key === "Home" && (y = qr), o.key === "End" && (y = kr), y !== null && (o.preventDefault(), o.stopPropagation(), dr(y));
  }
  K(() => {
    if (!m) return;
    const o = window.setTimeout(() => k(""), 4e3);
    return () => window.clearTimeout(o);
  }, [m]), K(() => {
    const o = JSON.parse(Dr);
    if (Ze({}), !o.length) return;
    const d = new AbortController();
    let y = !0;
    return Promise.all(
      o.map(async (w) => {
        var F;
        try {
          const M = await D(`/api/tags/${w}`, {
            signal: d.signal
          });
          return [w, ((F = M.name) == null ? void 0 : F.trim()) || null];
        } catch {
          return [w, null];
        }
      })
    ).then((w) => {
      y && Ze(Object.fromEntries(w));
    }), () => {
      y = !1, d.abort();
    };
  }, [Dr]), K(() => {
    const o = V ? xn(V.view.objectFilter) : [];
    if (gt({}), !o.length) return;
    const d = new AbortController();
    let y = !0;
    return Promise.all(
      o.map(async (w) => {
        var F;
        try {
          const M = await D(`/api/tags/${w}`, {
            signal: d.signal
          });
          return (F = M.name) != null && F.trim() ? [String(w), M.name] : null;
        } catch {
          return null;
        }
      })
    ).then((w) => {
      y && gt(
        Object.fromEntries(w.filter((F) => F !== null))
      );
    }), () => {
      y = !1, d.abort();
    };
  }, [V == null ? void 0 : V.id, V == null ? void 0 : V.view.objectFilter]);
  const ur = It(
    () => V ? _n(
      V.view.objectFilter,
      we
    ) : (N == null ? void 0 : N.view.objectFilter) ?? {},
    [we, N, V]
  ), Hn = It(
    () => j === "video" && Array.isArray(ur.customFieldCriteria) ? [...nr, ao] : j === "tag" ? bn : nr,
    [j, ur.customFieldCriteria]
  ), Ur = dt(async () => {
    f(!0), h("");
    try {
      const o = await Ai();
      r(o.reviews), l(o.storageKey), E(o.canWriteVideos ?? o.canWrite), q(o.canWriteTags ?? !1), A(o.canReadTagGroups ?? !1), ae(o.canConfigure ?? !0), P(o.storageNotice ?? ""), se && !o.reviews.some((d) => d.id === se) && (nt(""), dn(""));
    } catch (o) {
      h(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      f(!1);
    }
  }, [se]);
  K(() => {
    if (!T) {
      Q([]), Z("");
      return;
    }
    const o = new AbortController();
    return Z(""), Mi(o.signal).then(Q).catch((d) => {
      o.signal.aborted || Z(
        d instanceof Error ? d.message : "Could not load tag groups."
      );
    }), () => o.abort();
  }, [T]), K(() => {
    Ur();
  }, []), K(() => {
    if (se || t.length === 0) return;
    const o = new AbortController();
    le({});
    for (const d of t)
      (d.entityType === "performerOccurrence" ? Fn(d, o.signal).then((w) => (w == null ? void 0 : w.length) === 0 ? { items: [], totalCount: 0 } : Vt($n(d, w), { ...d.view.filter, page: 1, perPage: 1 }, o.signal)) : qe(d) === "tag" ? Yr(
        d,
        Ae({ ...d.view.filter, page: 1, perPage: 1 }),
        o.signal
      ) : Vt(
        d,
        Ae({ ...d.view.filter, page: 1, perPage: 1 }),
        o.signal
      )).then((w) => {
        o.signal.aborted || le((F) => ({
          ...F,
          [d.id]: w.totalCount
        }));
      }).catch(() => {
        o.signal.aborted || le((w) => ({ ...w, [d.id]: null }));
      });
    return () => o.abort();
  }, [se, t]), pn(() => {
    var o;
    se || s || !Me.current || (Me.current = !1, (o = Qe.current) == null || o.focus());
  }, [se, s]);
  const Zt = dt(async () => {
    _e("");
    try {
      xe(await $r());
    } catch (o) {
      xe(null), _e(
        "Tag assessment setup could not be checked. " + (o instanceof Error ? o.message : "Request failed.")
      );
    }
  }, []);
  K(() => {
    Zt();
  }, [Zt]);
  const ht = dt(
    async (o, d, y = !1) => {
      var B;
      const w = ++Et.current;
      (B = Yt.current) == null || B.abort();
      const F = new AbortController();
      Yt.current = F, d = Ae(d);
      const M = Number(d.page);
      y && (d = { ...d, page: 1 }), at(d), Lt(y), wt(!0), Xe("");
      try {
        const ce = (Nt) => qe(o) === "tag" ? Yr(
          o,
          Nt,
          F.signal
        ) : Vt(
          o,
          Nt,
          F.signal
        );
        let ve = await ce(d);
        const Ge = Math.max(
          1,
          Math.ceil(ve.totalCount / Number(d.perPage))
        ), Oe = y ? Ge : Math.min(M, Ge);
        return Number(d.page) !== Oe && (d = { ...d, page: Oe }, ve = await ce(d)), w === Et.current && (st(ve), at(d), lr(d)), ve;
      } catch (ce) {
        throw w === Et.current && Xe(
          ce instanceof Error ? ce.message : "Could not load the review queue."
        ), ce;
      } finally {
        w === Et.current && wt(!1);
      }
    },
    []
  );
  K(() => {
    var d;
    if (Xt.current += 1, Et.current += 1, (d = Yt.current) == null || d.abort(), Pt(!1), U(""), oe(!1), Fe(/* @__PURE__ */ new Set()), Re.current.clear(), ge(null), Le(!1), ft(!1), pt.current = !1, c(""), k(""), $(""), st({ items: [], totalCount: 0 }), !N || qe(N) !== "tag") {
      wt(!1);
      return;
    }
    let o = !0;
    return wt(!0), (async () => {
      let y = null;
      try {
        y = await Ii(a, N.id);
      } catch (M) {
        o && (oe(!0), U(
          M instanceof Error ? M.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const w = (y == null ? void 0 : y.signature) === Tt(N) ? y : null, F = w ? Ae(w.filter) : so(N.view.filter);
      at(F), vt(
        w ? cn(w.displayMode, qe(N)) : sn(N)
      ), Wt(
        w ? w.cardSize ?? wr : wr
      );
      try {
        const M = await ht(
          N,
          F,
          !w && N.view.startFrom !== "beginning"
        );
        if (!o) return;
        const B = Wr(
          M.items.map((ce) => ce.id),
          (w == null ? void 0 : w.focusedId) ?? null,
          (w == null ? void 0 : w.index) ?? 0
        );
        ge(B), he(B);
      } catch {
      }
      o && Pt(!0);
    })(), () => {
      var y;
      o = !1, Xt.current++, Et.current++, (y = Yt.current) == null || y.abort();
    };
  }, [N == null ? void 0 : N.id]);
  const te = It(
    () => ue.items.map((o) => o.id),
    [ue.items]
  );
  K(() => {
    if (!Ee || !N || !a || x || ke || G || (H == null ? void 0 : H.id) === N.id || ee)
      return;
    const o = {
      version: 1,
      signature: Tt(N),
      filter: X,
      focusedId: z,
      index: Math.max(0, te.indexOf(z ?? -1)),
      displayMode: Ve,
      cardSize: St,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        a + ":progress:" + N.id,
        JSON.stringify(o)
      );
    } catch {
    }
    if (b) return;
    let d = !0;
    const y = window.setTimeout(() => {
      qi(a, N.id, o).catch((w) => {
        d && U(
          "Progress is kept in this browser, but account sync failed. " + (w instanceof Error ? w.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      d = !1, window.clearTimeout(y);
    };
  }, [
    Ee,
    a,
    N,
    x,
    ke,
    G,
    X,
    z,
    te,
    Ve,
    St,
    H,
    b,
    ee
  ]);
  const Xn = ue.items.find((o) => o.id === z) ?? null, fr = j === "video" ? Xn : null;
  Ce && fr && (Ke.current = fr);
  const yt = fr ?? (Ce ? Ke.current : null), Yn = zr(fe, z), jr = fe.size > 0 ? `${fe.size} selected ${j}${fe.size === 1 ? "" : "s"}` : z == null ? `no ${j}` : `focused ${j}`, he = dt((o, d = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const y = et.current.get(o);
      y == null || y.focus({ preventScroll: !0 }), d && (y == null || y.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  K(() => {
    Ee && !Ie.current && he(me.current);
  }, [Ee, he]), K(() => {
    x || !te.length || (me.current == null || !te.includes(me.current)) && (ge(te[0]), Ie.current || he(te[0]));
  }, [he, te, x]);
  const Ct = dt(
    (o) => {
      Fe((d) => {
        const y = o(d);
        for (const w of /* @__PURE__ */ new Set([...d, ...y]))
          d.has(w) !== y.has(w) && Re.current.set(
            w,
            (Re.current.get(w) ?? 0) + 1
          );
        return y;
      });
    },
    []
  ), pr = dt(
    (o) => {
      if (!te.length) return;
      const d = Math.max(
        0,
        te.indexOf(me.current ?? te[0])
      ), y = te[Math.max(0, Math.min(te.length - 1, d + o))];
      ge(y), Ie.current || he(y);
    },
    [he, te]
  ), gr = dt(
    async (o) => {
      const d = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", y = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, w = y != null && (!T || !R.some((re) => re.id === y)), F = "effect" in o && d && !T, M = zr(
        $e.current,
        me.current
      );
      if (!N || pt.current || x || ke || d && !ze || F || w || or(o) && (L == null ? void 0 : L.kind) !== "ready" || !M.length)
        return;
      const B = ++Xt.current, ce = N.id, ve = [...te], Ge = ue, Oe = me.current, Nt = new Set($e.current), Dt = new Map(
        M.map((re) => [re, Re.current.get(re) ?? 0])
      ), At = () => B === Xt.current && N.id === ce;
      pt.current = !0, ft(!0), c(
        $e.current.size ? `${M.length} selected ${j}s` : `the focused ${j}`
      ), k(""), $("");
      const Vr = Ge.items.filter(
        (re) => !M.includes(re.id)
      ), si = Vr.map((re) => re.id), Gr = Hr(
        ve,
        si,
        Oe,
        M.includes(Oe ?? -1)
      );
      st({
        items: Vr,
        totalCount: Ge.totalCount
      }), Fe((re) => {
        const pe = new Set(re);
        for (const ye of M) pe.delete(ye);
        return pe;
      }), ge(Gr), Ie.current || he(Gr);
      let hr = !1;
      try {
        if ("effect" in o ? await Vi(o, M) : await Mn(o, M), hr = !0, !At()) return;
        Fe((re) => {
          const pe = new Set(re);
          for (const ye of M)
            (Re.current.get(ye) ?? 0) === Dt.get(ye) && pe.delete(ye);
          return pe;
        }), k(
          `${o.label}: ${M.length} ${j}${M.length === 1 ? "" : "s"} ${d ? "updated" : "skipped"}.`
        );
      } catch (re) {
        if (!At()) return;
        st(Ge), Fe((pe) => {
          const ye = new Set(pe);
          for (const tt of M)
            Nt.has(tt) && (Re.current.get(tt) ?? 0) === Dt.get(tt) && ye.add(tt);
          return ye;
        }), ge(Oe), Ie.current || he(Oe), $(
          re instanceof Error ? re.message : "Action failed."
        );
      }
      try {
        if (await xi(o), !At()) return;
        const re = await ht(N, X);
        if (!At()) return;
        let pe = re.items.map((ye) => ye.id);
        if (!pe.length && re.totalCount > 0 && Number(X.page) > 1) {
          const ye = Math.max(1, Number(X.page) - 1), tt = { ...X, page: ye };
          at(tt), pe = (await ht(N, tt)).items.map((yr) => yr.id), Fe(
            (yr) => new Set([...yr].filter((ci) => pe.includes(ci)))
          );
          const Jr = pe.at(-1) ?? null;
          ge(Jr), Ie.current || he(Jr);
        } else {
          Fe(
            (tt) => new Set([...tt].filter((Br) => pe.includes(Br)))
          );
          const ye = Hr(
            ve,
            pe,
            Oe,
            hr && M.includes(Oe ?? -1)
          );
          ge(ye), Ie.current && ye == null && Le(!1), Ie.current || he(ye);
        }
      } catch (re) {
        At() && $(
          (pe) => `${pe ? `${pe} ` : ""}${hr ? "The action completed, but " : ""}the queue could not be refreshed. ${re instanceof Error ? re.message : "Refresh failed."}`
        );
      } finally {
        At() && (pt.current = !1, ft(!1), c(""));
      }
    },
    [
      ze,
      T,
      R,
      j,
      L,
      ht,
      X,
      he,
      te,
      ue,
      x,
      ke,
      N
    ]
  );
  function Zn() {
    var y;
    if (Ve === "list") return 1;
    const o = (y = xt.current) == null ? void 0 : y.firstElementChild, d = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, d.split(" ").filter(Boolean).length);
  }
  function ei(o) {
    if (j !== "tag" || o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || Ft) return;
    if (Ce && o.key === "Escape") {
      Pe(o), Le(!1), he(me.current);
      return;
    }
    if (!Rn(o.target)) return;
    if (o.key === "Escape") {
      Pe(o), Ct(() => /* @__PURE__ */ new Set());
      return;
    }
    const d = (N == null ? void 0 : N.actions.findIndex(
      (F, M) => ut(F, M) === o.key.toLowerCase()
    )) ?? -1;
    if (d >= 0 && (N != null && N.actions[d])) {
      Pe(o), !G && !x && gr(N.actions[d]);
      return;
    }
    if (!Ce && o.key === " ") {
      Pe(o), z != null && Ct((F) => rr(F, z));
      return;
    }
    if (!Ce && o.key.toLowerCase() === "a") {
      Pe(o), Ct(
        (F) => Si(F, te)
      );
      return;
    }
    if (G || x || Ce) return;
    if (o.key === "Enter" && z != null) {
      Pe(o), j === "tag" ? window.open(`/tag/${z}`, "_blank", "noopener,noreferrer") : Le(!0);
      return;
    }
    const y = Zn(), w = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -y : o.key === "ArrowDown" ? y : 0;
    w && (Pe(o), pr(w));
  }
  function _t(o) {
    ie(0), nt(o), dn(o);
  }
  function ti() {
    Me.current = !0, le({}), _t("");
  }
  async function mr(o) {
    if (!a) return !1;
    const d = o.map(go);
    try {
      await Ri(a, d);
    } catch (w) {
      throw w;
    }
    r(d), se && !d.some((w) => w.id === se) && _t("");
    const y = d.find((w) => w.id === se);
    return y && W && JSON.stringify(y) !== JSON.stringify(W) && (y.view.displayMode !== W.view.displayMode && vt(sn(y)), y.entityType === "tag" && Tt(y) !== Tt(W) && (je(null), er(
      y,
      Ae({ ...y.view.filter, page: X.page })
    ))), !0;
  }
  if (s)
    return /* @__PURE__ */ n(un, { label: "Loading reviews…" });
  if (p)
    return /* @__PURE__ */ u(Se, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Co().catch(
            (o) => h(
              "Could not export browser reviews. " + (o instanceof Error ? o.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        fn,
        {
          message: p,
          onRetry: () => void Ur()
        }
      )
    ] });
  return /* @__PURE__ */ u("div", { className: "data-quality-page", onKeyDown: ei, children: [
    /* @__PURE__ */ u("header", { className: "data-quality-header", children: [
      N && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: G,
          onClick: ti,
          children: /* @__PURE__ */ n(wn, {})
        }
      ),
      /* @__PURE__ */ u("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (N == null ? void 0 : N.name) ?? "Data Quality" }),
        (N == null ? void 0 : N.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: N.description })
      ] }),
      N && W && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: G || x || !ne,
          onClick: () => {
            N.entityType !== "tag" ? ie((o) => o + 1) : (We(!0), Te(!0));
          },
          children: /* @__PURE__ */ n(vn, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: G || x || !ne,
          onClick: () => {
            We(!1), Te(!0);
          },
          children: /* @__PURE__ */ n(fi, {})
        }
      )
    ] }),
    g && /* @__PURE__ */ n("p", { className: "dq-status", children: g }),
    V && (L == null ? void 0 : L.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      L.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: ct,
          onClick: () => {
            lt(!0), _e(""), Di().then(Zt).catch(
              (o) => _e(
                "Could not create the Confirmed absent tags custom field. " + (o instanceof Error ? o.message : "Request failed.")
              )
            ).finally(() => lt(!1));
          },
          children: ct ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    V && ((L == null ? void 0 : L.kind) === "incompatible" || Ne) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(Er, {}),
      Ne || (L == null ? void 0 : L.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: ct,
          onClick: () => {
            lt(!0), Zt().finally(
              () => lt(!1)
            );
          },
          children: ct ? "Checking…" : "Check again"
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
    b && /* @__PURE__ */ u("p", { role: "alert", children: [
      b,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            U(""), oe(!1);
          },
          children: ee ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    N && W && N.entityType === "tag" && /* @__PURE__ */ u("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${G || x ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": G || x || void 0,
          inert: G || x ? !0 : void 0,
          onClickCapture: (o) => {
            var y, w, F, M, B;
            const d = o.target instanceof Element ? o.target.closest("button") : null;
            (d == null ? void 0 : d.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((y = d == null ? void 0 : d.textContent) == null ? void 0 : y.trim()) === "Clear all" ? mt.current = !0 : ((w = d == null ? void 0 : d.getAttribute("aria-label")) != null && w.startsWith("Filters") || (F = d == null ? void 0 : d.getAttribute("aria-label")) != null && F.startsWith("Edit filter:") || ((M = d == null ? void 0 : d.textContent) == null ? void 0 : M.trim()) === "Cancel" || (B = d == null ? void 0 : d.getAttribute("aria-label")) != null && B.startsWith("Close ")) && (mt.current = !1);
          },
          onKeyDownCapture: (o) => {
            var y, w;
            const d = o.target instanceof Element ? o.target.closest("button") : null;
            (o.key === "Delete" || o.key === "Backspace") && (d == null ? void 0 : d.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (o.preventDefault(), o.stopPropagation(), mt.current = !0, (w = (y = d.parentElement) == null ? void 0 : y.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || w.click()) : o.key === "Escape" && (mt.current = !1);
          },
          children: /* @__PURE__ */ n(
            vr,
            {
              filter: ke ? cr : X,
              onFilterChange: ri,
              totalCount: ue.totalCount,
              sortOptions: j === "tag" ? yn : Or,
              showSearch: !0,
              showSort: !0,
              displayMode: Ve,
              onDisplayModeChange: (o) => vt(cn(o, j)),
              availableDisplayModes: j === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (St - 225) / 50,
              onZoomChange: (o) => Wt(Math.round(225 + o * 50)),
              cardSizeEntityType: j === "tag" ? "tags" : "videos",
              criteriaDefinitions: Hn,
              objectFilter: ur,
              onObjectFilterChange: (o) => {
                if (!G && !x) {
                  const d = j === "video" ? Dn(o) : o;
                  He.current = j === "video" ? Un(
                    N.view.objectFilter,
                    d,
                    mt.current
                  ) : d, mt.current = !1;
                }
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (H == null ? void 0 : H.id) === se && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: G || x || !ne,
            onClick: ii,
            children: /* @__PURE__ */ n(pi, {})
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Reset to default review filters",
            title: "Reset to default review filters",
            disabled: G || x,
            onClick: ni,
            children: /* @__PURE__ */ n(gi, {})
          }
        )
      ] })
    ] }),
    N ? j !== "tag" ? /* @__PURE__ */ n(to, { review: N, canWrite: N.entityType === "performerOccurrence" ? v : S, onBusy: ft, editRequest: Mt, renderRuleEditor: (o, d, y) => /* @__PURE__ */ n(Qn, { workspace: !0, draft: o, entityTypeLocked: !0, tagGroups: R, saving: y, setDraft: (w) => d(w), onSave: () => {
    }, onCancel: () => {
    } }), onSaveDefaults: ne ? (o) => mr(t.map((d) => d.id === o.id ? o : d)) : void 0 }, N.id) : /* @__PURE__ */ u(Se, { children: [
      V && ot.error && /* @__PURE__ */ n("p", { role: "alert", children: ot.error }),
      V && /* @__PURE__ */ n(
        io,
        {
          videos: ue.items,
          review: V,
          trees: ot.ids,
          disabled: G || x,
          onChoose: (o) => {
            const d = oo(V, o);
            je(d), er(d, { ...X, page: 1 });
          }
        }
      ),
      _ && !Ce && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(Er, {}),
        _
      ] }),
      m && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: m }),
      Kr("top"),
      /* @__PURE__ */ u(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${J}px`
          },
          children: [
            /* @__PURE__ */ u("main", { children: [
              x && !ue.items.length && /* @__PURE__ */ n(un, { label: "Loading review queue…" }),
              ke && !x && /* @__PURE__ */ n(
                fn,
                {
                  message: ke,
                  onRetry: () => void ht(
                    N,
                    X,
                    $t
                  ).catch(() => {
                  })
                }
              ),
              !G && !x && !ke && !ue.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(Cr, {}),
                /* @__PURE__ */ u("p", { children: [
                  "No ",
                  j,
                  "s match this review."
                ] })
              ] }),
              !!ue.items.length && /* @__PURE__ */ n("div", { ref: xt, children: /* @__PURE__ */ n(
                "div",
                {
                  className: Ve === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${St}px`
                  },
                  children: ue.items.map(ai)
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
                "aria-valuemin": qr,
                "aria-valuemax": kr,
                "aria-valuenow": J,
                "aria-valuetext": `${J} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (o) => {
                  Ht.current = {
                    pointerId: o.pointerId,
                    startX: o.clientX,
                    startWidth: J
                  }, o.currentTarget.setPointerCapture(o.pointerId);
                },
                onPointerMove: (o) => {
                  const d = Ht.current;
                  (d == null ? void 0 : d.pointerId) === o.pointerId && o.currentTarget.hasPointerCapture(o.pointerId) && dr(
                    d.startWidth + d.startX - o.clientX
                  );
                },
                onPointerUp: () => {
                  Ht.current = null;
                },
                onPointerCancel: () => {
                  Ht.current = null;
                },
                onKeyDown: zn,
                onDoubleClick: () => dr(_r),
                children: /* @__PURE__ */ n("span", {})
              }
            ),
            /* @__PURE__ */ u("aside", { className: "dq-actions", children: [
              fe.size > 0 && /* @__PURE__ */ n("strong", { children: jr }),
              N.actions.map((o, d) => {
                const y = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", w = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, F = w != null ? R.find((B) => B.id === w) : void 0, M = w != null && !F;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    disabled: G || x || !!ke || y && !ze || "effect" in o && y && (!T || M) || or(o) && (L == null ? void 0 : L.kind) !== "ready" || !Yn.length,
                    onClick: () => void gr(o),
                    children: [
                      /* @__PURE__ */ u("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: o.label }),
                        "effect" in o ? /* @__PURE__ */ n("small", { children: o.effect.mode === "SKIP" ? "Skip" : o.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : F ? `Assign ${F.name}` : "Unavailable tag group" }) : o.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: o.steps.flatMap(
                          (B, ce) => B.tagIds.map((ve, Ge) => {
                            const Oe = Y[ve] === void 0 ? "Tag" : Y[ve] ?? "Unavailable tag", Nt = Jn(B, Oe), Dt = uo(B, Oe);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": Bn(B.mode),
                                "aria-label": Dt,
                                title: `Step ${ce + 1}: ${Dt}`,
                                children: Nt
                              },
                              `${ce}-${ve}-${Ge}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      ut(o, d) && /* @__PURE__ */ n("kbd", { children: ut(o, d) })
                    ]
                  },
                  o.id
                );
              }),
              !N.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              !ze && /* @__PURE__ */ u("p", { children: [
                j === "tag" ? "Tag" : "Video",
                " write permission is required to apply actions."
              ] }),
              j === "tag" && I && /* @__PURE__ */ u("p", { children: [
                "Tag groups are unavailable. ",
                I
              ] }),
              G && /* @__PURE__ */ u("p", { role: "status", children: [
                /* @__PURE__ */ n(En, { className: "dq-spin" }),
                " Applying action to",
                " ",
                zt,
                "…"
              ] }),
              /* @__PURE__ */ u("p", { className: "dq-shortcuts", children: [
                "←→↑↓ move · space select · enter ",
                j === "tag" ? "open" : "preview",
                " · Q–P apply · A toggle shown · Esc clear"
              ] })
            ] })
          ]
        }
      ),
      Kr("bottom")
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
                  ref: Qe,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ n("p", { children: "Choose a review to open its queue." }),
              /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                (o) => De[o.id] !== void 0
              ) ? t.some((o) => De[o.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: it,
                    onChange: (o) => be(
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
                  "aria-label": Je === "asc" ? "Ascending" : "Descending",
                  title: Je === "asc" ? "Ascending" : "Descending",
                  onClick: () => Ue(
                    (o) => o === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    Sn,
                    {
                      className: Je === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: Qt.map((o) => {
            const d = De[o.id], y = qe(o), w = y === "tag" ? "tag" : y === "performerOccurrence" ? "scene" : "video";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                disabled: G,
                onClick: () => _t(o.id),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ u("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(jn, { entityType: y }),
                      /* @__PURE__ */ n("strong", { children: o.name })
                    ] }),
                    /* @__PURE__ */ n(
                      "span",
                      {
                        className: "dq-review-count",
                        "aria-label": d === void 0 ? `Counting matching ${w}s` : d === null ? `Matching ${w} count unavailable` : `${d.toLocaleString()} matching ${d === 1 ? w : `${w}s`}`,
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
      /* @__PURE__ */ n(Cr, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    Ce && yt && V && /* @__PURE__ */ n(
      bo,
      {
        video: yt,
        review: V,
        targetLabel: jr,
        pending: G,
        refreshing: x || !!ke,
        error: _,
        canWrite: S,
        assessmentReady: (L == null ? void 0 : L.kind) === "ready",
        selected: fe.has(yt.id),
        hasPrevious: te.indexOf(yt.id) > 0,
        hasNext: te.indexOf(yt.id) >= 0 && te.indexOf(yt.id) < te.length - 1,
        onToggleSelected: () => Ct((o) => rr(o, yt.id)),
        onPrevious: () => pr(-1),
        onNext: () => pr(1),
        onClose: () => {
          Le(!1), he(me.current);
        },
        onAction: gr
      }
    ),
    Ft && /* @__PURE__ */ n(
      wo,
      {
        reviews: t,
        activeReview: W,
        tagGroups: R,
        initialEdit: de,
        onSave: mr,
        onChoose: _t,
        onEditWorkspace: (o) => {
          o !== se && _t(o), ie((d) => d + 1), Te(!1);
        },
        onClose: () => {
          Te(!1), de && he(me.current, !1);
        }
      }
    )
  ] });
  async function er(o, d, y = !1) {
    const w = me.current, F = Math.max(0, te.indexOf(w ?? -1));
    try {
      const B = (await ht(o, d, y)).items.map((ve) => ve.id);
      Fe(
        (ve) => new Set([...ve].filter((Ge) => B.includes(Ge)))
      );
      const ce = Wr(B, w, F);
      ge(ce), Ie.current || he(ce, !1);
    } catch {
    }
  }
  function ri(o) {
    const d = He.current;
    if (He.current = null, G || x || !N || !W) return;
    const y = d ?? N.view.objectFilter, w = Ir(
      y,
      W.view.objectFilter
    ) ? W.view.objectFilter : y, F = Ae({ ...o, page: 1 }), M = {
      ...N,
      view: {
        ...N.view,
        filter: F,
        objectFilter: w
      }
    }, B = Tt(M) !== Tt(W), ce = B ? M : W;
    je(B ? M : null), k(B ? "" : "Review queue defaults restored."), er(ce, F, !0);
  }
  function ni() {
    if (G || x || !W) return;
    He.current = null;
    const o = Ae({
      ...W.view.filter,
      page: 1
    });
    je(null), k("Review queue defaults restored."), er(
      W,
      o,
      W.view.startFrom !== "beginning"
    );
  }
  function ii() {
    G || x || !N || !W || !ne || mr(
      t.map(
        (o) => o.id === se ? {
          ...o,
          view: {
            ...N.view,
            filter: { ...X, page: 1 }
          }
        } : o
      )
    ).then(() => {
      je(null), k("Queue saved to this review.");
    }).catch(
      (o) => $(
        o instanceof Error ? o.message : "Could not save queue."
      )
    );
  }
  function oi() {
    Fe(/* @__PURE__ */ new Set()), Re.current.clear(), ge(null);
  }
  function Kr(o) {
    return N ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: G || x,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          mn,
          {
            filter: {
              ...X,
              page: Number(X.page) || 1,
              perPage: Number(X.perPage) || 40
            },
            totalCount: ue.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${o}`,
            onFilterChange: (d) => {
              G || x || d.page === Number(X.page) || po(
                { ...X, page: d.page },
                N,
                ht,
                oi
              );
            }
          }
        )
      }
    ) : null;
  }
  function ai(o) {
    if (j === "tag") {
      const y = o;
      return /* @__PURE__ */ n(
        mo,
        {
          tag: y,
          displayMode: Ve === "list" ? "list" : "grid",
          focused: y.id === z,
          selected: fe.has(y.id),
          setRef: (w) => {
            w ? et.current.set(y.id, w) : et.current.delete(y.id);
          },
          onFocus: () => ge(y.id),
          onToggle: () => Ct((w) => rr(w, y.id)),
          onOpen: () => window.open(`/tag/${y.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        y.id
      );
    }
    const d = o;
    return /* @__PURE__ */ n(
      ho,
      {
        video: no(d, V, ot.ids),
        displayMode: Ve,
        focused: d.id === z,
        selected: fe.has(d.id),
        setRef: (y) => {
          y ? et.current.set(d.id, y) : et.current.delete(d.id);
        },
        onFocus: () => ge(d.id),
        onToggle: () => Ct((y) => rr(y, d.id)),
        onPreview: () => {
          ge(d.id), Le(!0);
        },
        onNavigate: e
      },
      d.id
    );
  }
}
function po(e, t, r, i) {
  i(), r(t, e).catch(() => {
  });
}
function rr(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function go(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function mo({
  tag: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: a,
  onFocus: l,
  onToggle: s,
  onOpen: f,
  onNavigate: p
}) {
  return /* @__PURE__ */ n(
    "article",
    {
      ref: a,
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${e.name}${i ? ", selected" : ""}`,
      onFocus: l,
      onClick: (h) => {
        l(), h.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        di,
        {
          tag: e,
          selected: i,
          onSelect: s,
          onClick: f,
          onNavigate: p
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
        /* @__PURE__ */ n("button", { type: "button", className: "dq-tag-list-name", onClick: f, children: e.name }),
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
function ho({
  video: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: a,
  onFocus: l,
  onToggle: s,
  onPreview: f,
  onNavigate: p
}) {
  const h = Kn(e), S = O(null), E = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, v = !!(E.date || E.studioName), q = !!(E.performers.length || E.tags.length);
  return pn(() => {
    const T = S.current;
    if (!T) return;
    const A = T.querySelector(
      `a[href="/video/${e.id}"]`
    ), R = T.querySelector(".card-title"), Q = `dq-card-title-${e.id}`;
    R && (R.id = Q), A && (A.target = "_blank", A.rel = "noreferrer", A.removeAttribute("aria-label"), A.setAttribute("aria-labelledby", Q), A.classList.add("dq-card-link"));
    const I = T.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    I && I.setAttribute(
      "aria-label",
      i ? `Deselect ${h}` : `Select ${h}`
    );
    const Z = T.querySelector(
      'button[title="Quick View"]'
    );
    Z && Z.setAttribute("aria-label", `Preview ${h}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (T) => {
        S.current = T, a(T);
      },
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${h}${i ? ", selected" : ""}`,
      onFocus: l,
      onClick: (T) => {
        l(), T.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${t} ${v ? "has-card-metadata" : "no-card-metadata"} ${q ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          ui,
          {
            video: E,
            selected: i,
            onSelect: s,
            onNavigate: p,
            onQuickView: f,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t === "wall" && /* @__PURE__ */ n(yo, { video: e })
      ]
    }
  );
}
function yo({ video: e }) {
  const t = O(null), r = O(null), [i, a] = C(!1), [l, s] = C(!1), [f, p] = C(!1);
  return K(() => {
    const h = t.current;
    if (!h || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      a(!0), s(!0);
      return;
    }
    const S = new IntersectionObserver(
      ([v]) => a(v.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), E = new IntersectionObserver(
      ([v]) => s(v.isIntersecting && v.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return S.observe(h), E.observe(h), () => {
      S.disconnect(), E.disconnect();
    };
  }, [e.id, e.files.length]), K(() => {
    if (!i) {
      p(!1);
      return;
    }
    const h = new AbortController();
    return D(Li(e.id), {
      signal: h.signal
    }).then((S) => {
      h.signal.aborted || p(S.available === !0);
    }).catch(() => {
      h.signal.aborted || p(!1);
    }), () => h.abort();
  }, [i, e.id]), K(() => {
    const h = r.current;
    h && (l ? Promise.resolve(h.play()).catch(() => {
    }) : h.pause());
  }, [f, l]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: f && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: $i(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function bo({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: a,
  error: l,
  canWrite: s,
  assessmentReady: f,
  selected: p,
  hasPrevious: h,
  hasNext: S,
  onToggleSelected: E,
  onPrevious: v,
  onNext: q,
  onClose: T,
  onAction: A
}) {
  const R = O(null), Q = O(null), I = e.files[0], Z = Kn(e);
  K(() => {
    var P;
    const g = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (P = R.current) == null || P.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = g;
    };
  }, []);
  function ne(g) {
    var U, ee, oe;
    if (g.key !== "Tab") return;
    const P = [
      ...((U = R.current) == null ? void 0 : U.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((Ee) => Ee.offsetParent !== null);
    if (!P.length) {
      g.preventDefault(), (ee = R.current) == null || ee.focus();
      return;
    }
    const b = P.indexOf(
      document.activeElement
    );
    g.shiftKey && b <= 0 ? (g.preventDefault(), (oe = P.at(-1)) == null || oe.focus()) : !g.shiftKey && b === P.length - 1 && (g.preventDefault(), P[0].focus());
  }
  function ae(g) {
    if (g.defaultPrevented || g.ctrlKey || g.metaKey || g.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const P = g.key === "ArrowLeft" || g.key === "ArrowRight";
    if (g.altKey && !P) return;
    const b = Q.current, U = g.currentTarget.querySelector("video");
    if (g.key === "Enter" || g.key === "Escape")
      g.repeat || T();
    else if (g.key === " " && b)
      g.repeat || b.toggle();
    else if (P && b)
      b.seekBy(
        (g.key === "ArrowLeft" ? -1 : 1) * (g.shiftKey ? 5 : g.altKey ? 10 : 60)
      );
    else if ((g.key === "," || g.key === ".") && b) {
      const ee = [I == null ? void 0 : I.duration, U == null ? void 0 : U.duration].find(
        (Ee) => Ee != null && Number.isFinite(Ee) && Ee > 0
      ) ?? 0, oe = e.parentVideoId != null ? (e.clipEndSec ?? ee) - (e.clipStartSec ?? 0) : ee;
      Number.isFinite(oe) && oe > 0 && b.seekBy((g.key === "," ? -1 : 1) * oe * 0.1);
    } else if (g.key.toLowerCase() === "n" || g.key.toLowerCase() === "m")
      !g.repeat && !i && !a && (g.key.toLowerCase() === "n" && h && v(), g.key.toLowerCase() === "m" && S && q());
    else if (g.key === "ArrowUp" && U)
      U.volume = Math.min(1, U.volume + 0.1);
    else if (g.key === "ArrowDown" && U)
      U.volume = Math.max(0, U.volume - 0.1);
    else return;
    Pe(g);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: R,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${Z}`,
      className: "dq-preview",
      onKeyDown: ne,
      onKeyDownCapture: ae,
      onMouseDown: (g) => {
        g.target === g.currentTarget && T();
      },
      children: /* @__PURE__ */ u("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ u("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !h || i || a,
              onClick: v,
              children: /* @__PURE__ */ n(wn, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !S || i || a,
              onClick: q,
              children: /* @__PURE__ */ n(Sn, {})
            }
          ),
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: Z }),
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
              children: p ? "Selected" : "Select"
            }
          ),
          /* @__PURE__ */ n(
            "a",
            {
              href: `/video/${e.id}`,
              target: "_blank",
              rel: "noreferrer",
              className: "dq-details-link",
              "aria-label": `Open ${Z} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ n(hi, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: T,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(Cn, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: I ? /* @__PURE__ */ n(
          hn,
          {
            autostart: !0,
            streamUrl: Pn(e.id),
            posterUrl: Zr(e),
            format: I.format,
            audioCodec: I.audioCodec,
            duration: I.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (g) => (Q.current = g, () => {
              Q.current === g && (Q.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: Zr(e), alt: "" }) }),
        l && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: l }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((g, P) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: i || a || g.steps.length > 0 && !s || or(g) && !f,
            onClick: () => void A(g),
            children: [
              ut(g, P) && /* @__PURE__ */ n("kbd", { children: ut(g, P) }),
              g.label
            ]
          },
          g.id
        )) })
      ] })
    }
  );
}
function wo({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: i = !1,
  onEditWorkspace: a,
  onSave: l,
  onChoose: s,
  onClose: f
}) {
  const [p, h] = C(
    () => i && t ? structuredClone(t) : null
  ), [S, E] = C(""), [v, q] = C(!1), [T, A] = C(
    i && t != null
  ), R = O(null);
  K(() => {
    var b, U;
    const g = document.activeElement, P = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (U = (b = R.current) == null ? void 0 : b.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || U.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = P, g == null || g.focus({ preventScroll: !0 });
    };
  }, []);
  function Q(g) {
    var U, ee, oe;
    if (g.defaultPrevented) {
      g.stopPropagation();
      return;
    }
    if (g.key === "Escape") {
      Pe(g), v || f();
      return;
    }
    if (g.key !== "Tab") {
      g.stopPropagation();
      return;
    }
    const P = [
      ...((U = R.current) == null ? void 0 : U.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((Ee) => Ee.offsetParent !== null);
    if (!P.length) {
      Pe(g), (ee = R.current) == null || ee.focus();
      return;
    }
    const b = P.indexOf(
      document.activeElement
    );
    g.shiftKey && b <= 0 ? (Pe(g), (oe = P.at(-1)) == null || oe.focus()) : !g.shiftKey && b === P.length - 1 ? (Pe(g), P[0].focus()) : g.stopPropagation();
  }
  function I(g, P = !!g) {
    A(P), h(
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
    ), E("");
  }
  async function Z() {
    if (v) return;
    if (!p || ir(p)) {
      E(p ? ir(p) : "Choose a review.");
      return;
    }
    const g = { ...p, name: p.name.trim() }, P = e.some((b) => b.id === g.id) ? e.map((b) => b.id === g.id ? g : b) : [...e, g];
    q(!0), E("");
    try {
      if (!await l(P)) throw new Error("Could not save reviews.");
      g.entityType !== "tag" ? a(g.id) : (s(g.id), f());
    } catch (b) {
      E(
        "Could not save reviews. Your edits are still open. " + (b instanceof Error ? b.message : "Retry saving.")
      );
    } finally {
      q(!1);
    }
  }
  async function ne(g) {
    if (!v) {
      q(!0), E("");
      try {
        if (!await l(g)) throw new Error("Could not save reviews.");
      } catch (P) {
        E(
          P instanceof Error ? P.message : "Could not save reviews."
        );
      } finally {
        q(!1);
      }
    }
  }
  async function ae(g) {
    var b;
    if (v) return;
    const P = (b = g.target.files) == null ? void 0 : b[0];
    if (g.target.value = "", !!P) {
      if (P.size > 2e6) {
        E("Review files must be smaller than 2 MB.");
        return;
      }
      q(!0), E("");
      try {
        const U = Gt(await P.text());
        if (!await l(Nr(e, U)))
          throw new Error("Could not save reviews.");
      } catch (U) {
        E(
          U instanceof Error ? U.message : "Could not import reviews."
        );
      } finally {
        q(!1);
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
      onKeyDown: Q,
      children: /* @__PURE__ */ u("div", { className: "dq-manager", children: [
        /* @__PURE__ */ u("header", { children: [
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: p ? e.some((g) => g.id === p.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: v,
              onClick: f,
              children: /* @__PURE__ */ n(Cn, {})
            }
          )
        ] }),
        S && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: S }),
        /* @__PURE__ */ n("fieldset", { disabled: v, className: "dq-manager-content", children: p ? /* @__PURE__ */ n(
          Qn,
          {
            setup: p.entityType !== "tag",
            draft: p,
            entityTypeLocked: T,
            tagGroups: r,
            saving: v,
            setDraft: h,
            onSave: () => void Z(),
            onCancel: f
          }
        ) : /* @__PURE__ */ u(Se, { children: [
          /* @__PURE__ */ u("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: () => {
              const g = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), P = document.createElement("a");
              P.href = g, P.download = "data-quality-reviews.json", P.click(), URL.revokeObjectURL(g);
            }, children: "Export reviews" }),
            /* @__PURE__ */ u(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => I(),
                children: [
                  /* @__PURE__ */ n(yi, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ u("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(bi, {}),
              " Import reviews",
              /* @__PURE__ */ n(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: ae
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((g) => /* @__PURE__ */ u("article", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ u("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(jn, { entityType: qe(g) }),
                /* @__PURE__ */ n("strong", { children: g.name })
              ] }),
              /* @__PURE__ */ n("p", { children: g.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => g.entityType === "tag" ? I(g) : a(g.id), children: [
              /* @__PURE__ */ n(vn, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => I({
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
                  window.confirm(`Delete review “${g.name}”?`) && ne(
                    e.filter((P) => P.id !== g.id)
                  );
                },
                children: /* @__PURE__ */ n(Nn, {})
              }
            )
          ] }, g.id)) })
        ] }) })
      ] })
    }
  );
}
function Qn({
  workspace: e = !1,
  setup: t = !1,
  draft: r,
  entityTypeLocked: i,
  tagGroups: a,
  saving: l = !1,
  setDraft: s,
  onSave: f,
  onCancel: p
}) {
  const [h, S] = C("Review"), E = qe(r), v = (A) => {
    if (!(i || A === E)) {
      if (A === "performerOccurrence") {
        s({
          id: r.id,
          entityType: A,
          name: r.name,
          description: r.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end" },
          actions: [],
          occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: !0 }
        });
        return;
      }
      s(
        A === "tag" ? {
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
  }, q = O(/* @__PURE__ */ new WeakMap()), T = (A) => {
    let R = q.current.get(A);
    return R || (R = crypto.randomUUID(), q.current.set(A, R)), R;
  };
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      li,
      {
        tabs: (t ? ["Review"] : e ? ["Review", "Actions", ...E === "performerOccurrence" ? ["Tag choices"] : []] : E === "performerOccurrence" ? ["Review", "Queue", "Actions", ...r.occurrence.tagIds.length ? ["Tag choices"] : []] : ["Review", "Queue", "Appearance", "Actions"]).map((A) => ({
          key: A,
          label: A,
          count: A === "Actions" ? r.actions.length : void 0,
          disabled: l
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
              value: E,
              disabled: i,
              onChange: (A) => v(A.target.value),
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
              onChange: (A) => s({ ...r, name: A.target.value })
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
              onChange: (A) => s({ ...r, description: A.target.value })
            }
          )
        ] })
      ] }),
      !e && !t && /* @__PURE__ */ u("section", { hidden: h !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ n(an, { draft: r, onChange: s, presentation: !1 }),
        r.entityType === "performerOccurrence" && /* @__PURE__ */ n(on, { review: r, onChange: s })
      ] }),
      !t && r.entityType === "performerOccurrence" && /* @__PURE__ */ n("section", { hidden: h !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n(on, { review: r, onChange: s, choices: !0 }) }),
      !e && !t && /* @__PURE__ */ n("section", { hidden: h !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(an, { draft: r, onChange: s, queue: !1 }) }),
      !t && /* @__PURE__ */ n("section", { hidden: h !== "Actions", className: "dq-editor-section", children: E === "tag" ? /* @__PURE__ */ n(
        So,
        {
          draft: r,
          saving: l,
          tagGroups: a,
          setDraft: s
        }
      ) : /* @__PURE__ */ n(
        vo,
        {
          draft: r,
          saving: l,
          stepKey: T,
          rememberStepKey: (A, R) => q.current.set(A, T(R)),
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
            const A = URL.createObjectURL(
              new Blob([JSON.stringify([r], null, 2)], {
                type: "application/json"
              })
            ), R = document.createElement("a");
            R.href = A, R.download = "data-quality-review.json", R.click(), URL.revokeObjectURL(A);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: p, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: f, children: t ? "Create & configure" : "Save review" })
    ] })
  ] });
}
function Wn({
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
function vo({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: i,
  setDraft: a
}) {
  const l = (s, f) => a({
    ...e,
    actions: e.actions.map(
      (p, h) => h === s ? f : p
    )
  });
  return /* @__PURE__ */ u(Se, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    e.entityType === "performerOccurrence" && /* @__PURE__ */ n("p", { children: "Actions apply only to the active performer in this scene. Set performer matching in the review filters below. Save review keeps those criteria with this rule." }),
    /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      Sr,
      {
        items: e.actions,
        getKey: (s) => s.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (s) => a({ ...e, actions: s }),
        renderItem: (s, { index: f, dragHandleProps: p, isOver: h }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: h ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ u("legend", { children: [
                "Action ",
                f + 1
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...p,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${f + 1}`,
                    children: /* @__PURE__ */ n(Pr, {})
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
                        ...e.actions.slice(0, f + 1),
                        {
                          ...structuredClone(s),
                          id: crypto.randomUUID(),
                          label: s.label + " copy"
                        },
                        ...e.actions.slice(f + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                Wn,
                {
                  action: s,
                  onChange: (S) => l(f, S)
                }
              ),
              /* @__PURE__ */ n(
                Sr,
                {
                  items: s.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (S) => l(f, { ...s, steps: S }),
                  renderItem: (S, E) => /* @__PURE__ */ n(
                    Eo,
                    {
                      occurrence: e.entityType === "performerOccurrence",
                      dragHandleProps: E.dragHandleProps,
                      saving: t,
                      isOver: E.isOver,
                      step: S,
                      index: E.index,
                      onChange: (v) => {
                        i(v, S), l(f, {
                          ...s,
                          steps: s.steps.map(
                            (q, T) => T === E.index ? v : q
                          )
                        });
                      },
                      onRemove: () => l(f, {
                        ...s,
                        steps: s.steps.filter(
                          (v, q) => q !== E.index
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
                    onClick: () => l(f, {
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
                        (S, E) => E !== f
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
function So({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: i
}) {
  const a = (l, s) => i({
    ...e,
    actions: e.actions.map(
      (f, p) => p === l ? s : f
    )
  });
  return /* @__PURE__ */ u(Se, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      Sr,
      {
        items: e.actions,
        getKey: (l) => l.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (l) => i({ ...e, actions: l }),
        renderItem: (l, { index: s, dragHandleProps: f, isOver: p }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: p ? "dq-action-card dq-drag-over" : "dq-action-card",
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
                    ...f,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${s + 1}`,
                    children: /* @__PURE__ */ n(Pr, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: l.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => i({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, s + 1),
                        {
                          ...structuredClone(l),
                          id: crypto.randomUUID(),
                          label: l.label + " copy"
                        },
                        ...e.actions.slice(s + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                Wn,
                {
                  action: l,
                  onChange: (h) => a(s, h)
                }
              ),
              /* @__PURE__ */ u("label", { children: [
                "Action effect",
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: l.effect.mode === "SET_TAG_GROUP" ? `group:${l.effect.tagGroupId}` : l.effect.mode,
                    onChange: (h) => {
                      const S = h.target.value;
                      a(s, {
                        ...l,
                        effect: S === "SKIP" ? { mode: "SKIP" } : S === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : {
                          mode: "SET_TAG_GROUP",
                          tagGroupId: Number(S.slice(6))
                        }
                      });
                    },
                    children: [
                      /* @__PURE__ */ n("option", { value: "SKIP", children: "Skip" }),
                      /* @__PURE__ */ n("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
                      l.effect.mode === "SET_TAG_GROUP" && !r.some(
                        (h) => h.id === l.effect.tagGroupId
                      ) && /* @__PURE__ */ n(
                        "option",
                        {
                          value: `group:${l.effect.tagGroupId}`,
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
function Eo({
  occurrence: e = !1,
  step: t,
  index: r,
  dragHandleProps: i,
  saving: a,
  isOver: l,
  onChange: s,
  onRemove: f
}) {
  const p = Bn(t.mode);
  return /* @__PURE__ */ u(
    "div",
    {
      className: l ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": p,
      children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            ...i,
            disabled: a,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${r + 1}`,
            children: /* @__PURE__ */ n(Pr, {})
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
              !e && /* @__PURE__ */ u(Se, { children: [
                /* @__PURE__ */ n("option", { value: "MARK_PRESENT", children: "Mark present" }),
                /* @__PURE__ */ n("option", { value: "MARK_ABSENT", children: "Mark absent" }),
                /* @__PURE__ */ n("option", { value: "CLEAR_ABSENCE", children: "Clear absence" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ n("div", { className: "dq-step-tags", children: /* @__PURE__ */ n(
          rt,
          {
            entityType: "tag",
            values: t.tagIds,
            onChange: (h) => s({ ...t, tagIds: h }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: f, children: /* @__PURE__ */ n(Nn, {}) })
      ]
    }
  );
}
async function Co() {
  const e = await D("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const s = JSON.parse(r);
      Array.isArray(s.reviews) && (i = JSON.stringify(s.reviews, null, 2));
    } catch {
    }
  const a = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), l = document.createElement("a");
  l.href = a, l.download = "data-quality-browser-recovery.json", l.click(), URL.revokeObjectURL(a);
}
function un({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(En, { className: "dq-spin" }),
    e
  ] });
}
function fn({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(Er, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const qo = { components: { DataQualityPage: fo } };
export {
  fo as DataQualityPage,
  qo as default,
  Ir as objectFiltersEqual
};
