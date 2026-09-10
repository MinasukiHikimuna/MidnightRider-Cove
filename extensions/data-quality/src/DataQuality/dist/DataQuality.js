import { jsxs as u, jsx as n, Fragment as ke } from "react/jsx-runtime";
import { useRef as P, useState as C, useMemo as vt, useEffect as K, useCallback as wt, useLayoutEffect as pn } from "react";
import { DetailListToolbar as vr, VIDEO_SORT_OPTIONS as Or, VIDEO_CRITERIA as ir, EntityReferenceMultiSelector as tt, PERFORMER_CRITERIA as Qr, FilterDialog as gn, DetailListPagination as mn, VideoPlayer as hn, TAG_SORT_OPTIONS as yn, TAG_CRITERIA as bn, EntityDetailTabs as li, TagTile as di, VideoCard as ui, SortableList as Sr } from "@cove/runtime/components";
import { ChevronLeft as wn, Pencil as vn, Settings as fi, AlertTriangle as Er, Save as pi, RotateCcw as gi, ChevronRight as Sn, Film as Cr, Loader2 as En, Tags as mi, ExternalLink as hi, X as Cn, Plus as yi, Upload as bi, Trash2 as Nn, GripVertical as Pr } from "@cove/runtime/lucide-react";
import { extensionFetch as wi } from "@cove/runtime/api";
function $e(e) {
  return e.entityType ?? "video";
}
function lt(e, t) {
  return "qwertyuiop"[t] ?? "";
}
function or(e) {
  if (e.entityType === "performerOccurrence") {
    if (!Tn(e.occurrence))
      return "Complete the optional occurrence condition before saving.";
    if (e.actions.some((t) => t.steps.some((r) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(r.mode))))
      return "Occurrence actions support adding and removing tags on the active performer. Video tag assessments are not supported here.";
  }
  return $e(e) === "video" && e.actions.some(
    (t) => An(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => Pt(t, $e(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
function Me(e) {
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
function qt(e) {
  const { page: t, ...r } = e.view.filter, i = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    e.entityType === "performerOccurrence" ? ["performerOccurrence", ...i, e.occurrence] : $e(e) === "tag" ? ["tag", ...i] : i
  );
}
function Pt(e, t) {
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
function ar(e) {
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
function Jt(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || r.entityType === "video" || r.entityType === "tag" || r.entityType === "performerOccurrence") && (r.entityType !== "performerOccurrence" || Tn(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && vi(r.presentation, r.entityType === "tag") && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (r.entityType === "tag" ? "effect" in i && !("steps" in i) && Pt(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (a) => a && Array.isArray(a.tagIds)
      ) && Pt(i, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => or(r)))
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
const kn = "ext:com.midnightrider.data-quality:configuration", Ei = "ext:cove-data-quality:video-reviews", Ar = "ext:com.midnightrider.data-quality:progress", Qt = /* @__PURE__ */ new Map(), rr = /* @__PURE__ */ new Map(), It = (e, t) => e.includes("*") || e.includes(t), sr = (e) => _(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Ci = () => ({
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
function Ot(e) {
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
      const s = Jt(l);
      r ?? (r = s), s.forEach((p) => i.add(p.id));
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
  const t = await _("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function In(e, t) {
  const r = (rr.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return rr.set(e, r), r.finally(() => {
    rr.get(e) === r && rr.delete(e);
  }).catch(() => {
  }), r;
}
let Kt = null;
function Ai() {
  if (Kt) return Kt;
  const e = Ti();
  return Kt = e, e.finally(() => {
    Kt === e && (Kt = null);
  }).catch(() => {
  }), e;
}
async function Ti() {
  var w;
  const e = await _("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = It(e.permissions, "savedfilters.read"), a = i && It(e.permissions, "savedfilters.write"), l = i ? (await sr(kn)).filter((I) => I.name === "Data Quality configuration").sort((I, T) => I.id - T.id) : [];
  if (l.length > 1) {
    const I = (T) => {
      const { revision: A, ...R } = Ot(T.uiOptions);
      return JSON.stringify(R);
    };
    if (l.some((T) => I(T) !== I(l[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (a)
      for (const T of l.slice(1))
        await _(`/api/savedfilters/${T.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${T.id}` })
        });
    l.splice(1);
  }
  let s = l.length ? Ot(l[0].uiOptions) : Ci();
  const p = localStorage.getItem(`${r}:migrated`) === "true", m = localStorage.getItem(r), h = localStorage.getItem(`${r}:local-only`) === "true";
  !l.length && m && (s = Ot(m));
  let S = !l.length;
  if (l.length && h && m) {
    const I = Ot(m);
    if (I.reviews.some((A) => {
      const R = s.reviews.find((W) => W.id === A.id);
      return R && JSON.stringify(R) !== JSON.stringify(A);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const T = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...I.deletedIds])
    ];
    s = {
      ...s,
      reviews: Nr(s.reviews, I.reviews).filter(
        (A) => !T.includes(A.id)
      ),
      deletedIds: T,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...I.importedIds])
      ]
    }, S = !0;
  }
  if (!p) {
    const I = JSON.stringify(s), T = Ni(t);
    if (l.length && T.reviews.some((k) => {
      const X = s.reviews.find((ne) => ne.id === k.id);
      return X && JSON.stringify(X) !== JSON.stringify(k);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const A = i ? (await sr(Ei)).flatMap(
      (k) => Jt(k.uiOptions ?? "[]")
    ) : [], R = T.known.filter(
      (k) => !T.reviews.some((X) => X.id === k)
    ), W = /* @__PURE__ */ new Set([...s.deletedIds, ...R]);
    s = {
      ...s,
      reviews: Nr(
        T.reviews,
        s.reviews,
        A.filter(
          (k) => !T.known.includes(k.id) && !s.importedIds.includes(k.id)
        )
      ).filter((k) => !W.has(k.id)),
      deletedIds: [...W],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...T.known,
          ...A.map((k) => k.id)
        ])
      ]
    }, S || (S = JSON.stringify(s) !== I);
  }
  const E = {
    userId: t,
    recordId: (w = l[0]) == null ? void 0 : w.id,
    config: s,
    readable: i,
    writable: a,
    durable: a
  };
  if (Qt.set(r, E), S && a) {
    const I = s;
    l.length && (E.config = Ot(l[0].uiOptions)), await On(r, I), s = E.config;
  } else l.length || (localStorage.setItem(r, JSON.stringify(s)), !i && (!p || h) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (a)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: s.reviews,
    storageKey: r,
    canWrite: It(e.permissions, "videos.write"),
    canWriteVideos: It(e.permissions, "videos.write"),
    canWriteTags: It(e.permissions, "tags.write"),
    canReadTagGroups: It(e.permissions, "taggroups.read"),
    canConfigure: !i || a,
    storageNotice: i ? a ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function On(e, t) {
  const r = Qt.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await qn(r), r.recordId != null) {
      const l = await _(
        `/api/savedfilters/${r.recordId}`
      );
      if (Ot(l.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const a = await _(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: kn,
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
  return Jt(JSON.stringify(t)), In(e, async () => {
    const r = Qt.get(e);
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
async function ki(e, t) {
  const r = Qt.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), a = i ? Xr(i) : null;
  if (!r.readable) return a;
  const l = (await sr(Ar)).find(
    (p) => p.name === t
  ), s = l ? Xr(l.uiOptions) : null;
  return a && (!s || a.updatedAt > s.updatedAt) ? a : s;
}
function qi(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return In(i, async () => {
    const a = Qt.get(e);
    if (!(a != null && a.writable)) return;
    await qn(a);
    const l = (await sr(Ar)).find(
      (s) => s.name === t
    );
    await _(
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
const St = "confirmed_absent_tags", Mr = "Confirmed absent tags", Ii = {
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
      t === "modifier" && typeof r == "string" ? Ii[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === St.toLowerCase() ? r.toLowerCase() : Mt(r)
    ])
  ) : e;
}
async function _(e, t = {}) {
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
  return _(`/api/videos/${e}?dqRead=${Oi}-${++Pi}`, { cache: "no-store" });
}
async function Bt(e, t, r) {
  const i = { ...e.view.objectFilter }, a = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return _("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Mt({
        findFilter: Me(t),
        objectFilter: i,
        filterExpression: a
      })
    )
  });
}
async function Yr(e, t, r) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, _("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Mt({
        findFilter: Me(t),
        objectFilter: i
      })
    )
  });
}
function Mi(e) {
  return _("/api/taggroups", { signal: e });
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
function xi(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Li(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Wt(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const i of e) {
    await _(`/api/tags/${i}`, { signal: t }), r.add(i);
    for (let a = 1; ; a++) {
      const l = await _("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Mt({
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
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${St} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function $r() {
  const t = (await _("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === St.toLowerCase()
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
    await _("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: St,
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
function cr(e) {
  return [...new Set(e)];
}
function Ui(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${St} value is not a valid tag list.`
    );
  return cr(e);
}
function ji(e) {
  return cr(
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
      tagIds: h.mode === "REMOVE_TREE" ? await Wt(h.tagIds) : cr(h.tagIds)
    }))
  ), a = i.filter(
    (h) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(h.mode)
  ), l = i.filter(
    (h) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(h.mode)
  ), s = cr(t), p = r.definition.key;
  let m = 0;
  for (const h of s)
    try {
      const S = await Fr(h), E = ji(S), w = { ...S.customFields ?? {} }, I = w[p], T = Ui(I), A = new Set(E), R = new Set(T);
      for (const ne of a)
        for (const ce of ne.tagIds)
          ne.mode === "ADD" ? A.add(ce) : A.delete(ce);
      for (const ne of l)
        for (const ce of ne.tagIds)
          ne.mode === "MARK_PRESENT" ? (A.add(ce), R.delete(ce)) : ne.mode === "MARK_ABSENT" ? (A.delete(ce), R.add(ce)) : R.delete(ce);
      const W = [...A], k = [...R];
      JSON.stringify(E) === JSON.stringify(W) && JSON.stringify(T) === JSON.stringify(k) && (I === void 0 ? k.length === 0 : JSON.stringify(I) === JSON.stringify(T)) || await _(`/api/videos/${h}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: W,
          customFields: {
            ...w,
            [p]: k
          }
        })
      }), m++;
    } catch (S) {
      throw new Error(
        `Assessment stopped after ${m} video${m === 1 ? "" : "s"} completed; video ${h} was affected. Refresh and inspect it before retrying. ${S instanceof Error ? S.message : "Request failed."}`
      );
    }
}
async function Mn(e, t) {
  if (!Pt(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (ar(e)) {
    await Ki(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (i) => ({
      mode: i.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: i.mode === "REMOVE_TREE" ? await Wt(i.tagIds) : i.tagIds
    }))
  );
  for (let i = 0; i < r.length; i++)
    try {
      await _("/api/videos/bulk", {
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
  if (!Pt(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await _("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
async function Gi(e, t, r) {
  if (!Pt(r) || r.steps.some(
    (l) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(l.mode)
  ))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const i = await Promise.all(
    r.steps.map(async (l) => ({
      ...l,
      tagIds: l.mode === "REMOVE_TREE" ? await Wt(l.tagIds) : l.tagIds
    }))
  );
  let a = t.applications;
  for (const l of i)
    a = await xn(
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
    const p = await _("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Mt({
          findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: l,
          filterExpression: a
        })
      )
    });
    if (p.items.forEach((m) => i.add(m.id)), s * 1e3 >= p.totalCount) return [...i];
    if (!p.items.length)
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
  const a = await Bt(
    $n(e, t),
    { ...e.view.filter, page: r },
    i
  ), l = t === null ? null : new Set(t), s = e.occurrence, p = a.items.length && s.includeSubtags !== !1 && !["any", "isNull"].includes(s.condition) ? await Promise.all(s.conditionTagIds.map((S) => Wt([S], i))) : s.conditionTagIds.map((S) => [S]), m = new Array(a.items.length);
  let h = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, a.items.length) }, async () => {
      for (; h < a.items.length; ) {
        const S = h++, E = a.items[S], w = await _(
          `/api/tagapplications?hostType=video&hostId=${E.id}&contextType=performer`,
          { signal: i }
        );
        m[S] = E.performers.filter((I) => l === null || l.has(I.id)).flatMap((I) => {
          const T = w.filter(
            (A) => A.hostType === "video" && A.hostId === E.id && A.contextType === "performer" && A.contextId === I.id
          );
          return Bi(
            e.occurrence,
            T.map((A) => A.tag.id),
            p
          ) ? [
            {
              key: `${E.id}:${I.id}`,
              video: E,
              performer: I,
              applications: T
            }
          ] : [];
        });
      }
    })
  ), { items: m.flat(), totalCount: a.totalCount };
}
async function xn(e, t, r) {
  const i = new Set(e.occurrence.tagIds);
  if (r.some((m) => !i.has(m)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const a = await Fr(t.video.id);
  if (!a.performers.some(
    (m) => m.id === t.performer.id
  ))
    throw new Error(
      "This performer is no longer linked to the scene. Refresh the queue."
    );
  const l = `/api/tagapplications?hostType=video&hostId=${a.id}&contextType=performer&contextId=${t.performer.id}`, s = (await _(l)).filter(
    (m) => m.hostType === "video" && m.hostId === a.id && m.contextType === "performer" && m.contextId === t.performer.id
  ), p = new Set(r);
  try {
    for (const m of p)
      s.some((h) => h.tag.id === m) || await _("/api/tagapplications", {
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
      i.has(m.tag.id) && !p.has(m.tag.id) && await _(`/api/tagapplications/${m.id}`, {
        method: "DELETE"
      });
    return await _(l);
  } catch (m) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${m instanceof Error ? m.message : "Request failed."}`
    );
  }
}
const xr = [
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
    filter: Me({
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
  if (!xr.some((s) => t.has(s))) {
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
    const s = t.get("sorts").split(",").map((p) => {
      const m = p.lastIndexOf(":");
      return { key: p.slice(0, m), direction: p.slice(m + 1) };
    });
    if (s.some((p) => !p.key || !["asc", "desc"].includes(p.direction)))
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
      filter: Me(i),
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
  xr.forEach((i) => r.delete(i)), r.set("review", e);
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
function Vt(e, t) {
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
async function Gt(e) {
  var l;
  if (e.occurrence) {
    const s = (await _(zi(e))).filter(
      (p) => p.hostType === "video" && p.hostId === e.video.id && p.contextType === "performer" && p.contextId === e.occurrence.performer.id
    );
    return {
      ids: [...new Set(s.map((p) => p.tag.id))],
      names: [...new Set(s.map((p) => p.tag.name))],
      absent: [],
      applications: s
    };
  }
  const t = await Fr(e.video.id), r = (t.tags ?? []).filter(
    (s) => s.canRemove !== !1 || s.isDerived !== !0
  ), i = Object.keys(t.customFields ?? {}).find(
    (s) => s.toLowerCase() === St
  ) ?? St, a = ((l = t.customFields) == null ? void 0 : l[i]) ?? [];
  if (!Array.isArray(a) || a.some((s) => !Number.isSafeInteger(s)))
    throw new Error(
      "Confirmed absent tags are invalid. Inspect the video before editing."
    );
  return { ids: r.map((s) => s.id), names: r.map((s) => s.name), absent: a };
}
async function Hi(e, t, r) {
  if (t.occurrence && e.entityType === "performerOccurrence")
    await xn(
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
      a.length && await _("/api/videos/bulk", {
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
function Lr(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Zi(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function Ln(e) {
  return [
    ...new Set(
      Lr(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function _n(e, t) {
  const r = Lr(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((i) => {
      const a = String(i.key ?? ""), l = Yi[String(i.modifier ?? "EQUALS")], s = (E, w) => String(w ?? "").trim() || t[String(E)] || String(E ?? ""), p = s(
        i.value,
        i.displayValue
      ), m = s(
        i.value2,
        i.displayValue2
      ), h = String(i.modifier ?? "EQUALS"), S = h === "IS_NULL" || h === "NOT_NULL" ? [] : h === "BETWEEN" || h === "NOT_BETWEEN" ? [p, "and", m] : [p];
      return {
        ...i,
        label: [Zi(a), l, ...S].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function Dn(e) {
  const t = Lr(e.customFieldCriteria);
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
const We = (e) => e instanceof Error ? e.message : "Request failed.";
function eo({
  actions: e,
  disabled: t,
  canWrite: r,
  onApply: i
}) {
  const [a, l] = C({});
  K(() => {
    let p = !0;
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
            (await _(`/api/tags/${m}`)).name
          ];
        } catch {
          return [m, "Unavailable tag"];
        }
      })
    ).then((m) => {
      p && l(Object.fromEntries(m));
    }), () => {
      p = !1;
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
    e.map((p, m) => /* @__PURE__ */ u("div", { className: "dq-action-pair", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: t || !r && p.steps.length > 0,
          onClick: (h) => i(p, h.shiftKey),
          children: /* @__PURE__ */ u("span", { children: [
            lt(p, m) && /* @__PURE__ */ n("kbd", { children: lt(p, m) }),
            " ",
            p.label
          ] })
        }
      ),
      p.steps.length > 0 && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button",
          disabled: t || !r,
          "aria-label": `Apply & stay: ${p.label}`,
          onClick: () => i(p, !0),
          children: "Apply & stay"
        }
      ),
      p.steps.length > 0 && /* @__PURE__ */ n("small", { className: "dq-review-action-summary", children: p.steps.map(
        (h) => `${s[h.mode]}: ${h.tagIds.map((S) => a[S] ?? "Loading tag…").join(", ")}`
      ).join("; ") })
    ] }, p.id))
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
  var gt;
  const s = P(null), p = P("");
  if (!s.current)
    try {
      s.current = tn(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (c) {
      p.current = We(c), s.current = { query: Rr(e), startAtEnd: !1 };
    }
  const [m, h] = C(null), S = P(null), E = P(null), w = P(null), [I, T] = C(!!p.current), A = P(0), [R, W] = C(s.current.query), k = P(R);
  k.current = R;
  const [X, ne] = C(0), ce = P(s.current.startAtEnd), [g, O] = C([]), [v, L] = C(null), Y = P(null), [Ee, he] = C(null), [zt, le] = C(0), Ft = vt(() => {
    if (!v) return null;
    const c = g.findIndex((f) => f.key === v.key);
    return c < 0 ? null : g.slice(c + 1).find((f) => f.video.id !== v.video.id) ?? null;
  }, [v, g]), [De, rt] = C(0), [ye, Et] = C(!1), [oe, $t] = C(!1), Ue = P(!1), Ge = P(!0), ze = P(null);
  K(() => (Ge.current = !0, () => {
    Ge.current = !1;
  }), []);
  const [dt, ae] = C(p.current), [ut, je] = C(""), [ue, se] = C(null), [Ce, Q] = C(!1), [N, j] = C([]), B = P([]), nt = P(null), Ct = P(null), ft = P(null);
  K(() => {
    var c, f;
    Ce && ((f = (c = ft.current) == null ? void 0 : c.querySelector("input")) == null || f.focus());
  }, [Ce]);
  const [He, Z] = C(!1);
  K(() => {
    if (ye || He || !Ct.current) return;
    const c = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const f = Ct.current;
      f != null && f.isConnected && !f.disabled && f.focus(), Ct.current = null;
    });
    return () => cancelAnimationFrame(c);
  }, [ye, He, X]);
  const [Xe, xt] = C([]), [lr, qe] = C({}), Ye = P(null), U = P(0), Ke = P(!1), [xe, Ht] = C({});
  K(() => {
    let c = !0;
    return Promise.all(
      Ln(R.objectFilter).map(
        async (f) => [
          String(f),
          (await _(`/api/tags/${f}`)).name
        ]
      )
    ).then((f) => {
      c && Ht(Object.fromEntries(f));
    }).catch(() => {
    }), () => {
      c = !1;
    };
  }, [R.objectFilter]);
  const it = P(0), Lt = P(e);
  Lt.current = e;
  const Ie = m ?? e, be = vt(
    () => Vt(Ie, R),
    [Ie, R]
  ), Nt = P(be);
  Nt.current = be;
  const Oe = oe || ye || Ce, ie = Number(R.filter.page);
  function H(c, f = !1) {
    Ue.current || (p.current = "", ce.current = f, k.current = c, W(c), rt(0), Et(!0), f || rn(e.id, c), ne((q) => q + 1));
  }
  function Pe() {
    if (Ue.current = !1, $t(!1), Ge.current && ze.current) {
      const c = ze.current;
      ze.current = null, H(c.query, c.startAtEnd);
    }
  }
  K(() => {
    const c = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const f = tn(
            Lt.current,
            new URLSearchParams(window.location.search)
          );
          Ue.current ? ze.current = f : H(f.query, f.startAtEnd);
        } catch (f) {
          ae(We(f));
        }
    };
    return window.addEventListener("popstate", c), () => window.removeEventListener("popstate", c);
  }, [e.id]), K(() => (r(oe || ye || Ce || !!m), () => r(!1)), [oe, ye, Ce, !!m, r]);
  async function Ne(c, f, q) {
    if (c.entityType === "performerOccurrence") {
      const M = await Ji(
        c,
        Ye.current,
        f,
        q
      );
      return {
        items: M.items.map((V) => ({
          key: V.key,
          video: V.video,
          occurrence: V
        })),
        totalCount: M.totalCount
      };
    }
    const x = await Bt(
      c,
      { ...c.view.filter, page: f },
      q
    );
    return {
      items: x.items.map((M) => ({ key: String(M.id), video: M })),
      totalCount: x.totalCount
    };
  }
  function Be(c, f, q, x = !1, M = !1) {
    if (!Ge.current || ze.current) return;
    T(!0), O(
      M ? c.items : br(c.items, k.current.startFrom === "end")
    ), rt(c.totalCount), we(q, x);
    const V = {
      ...k.current,
      filter: { ...k.current.filter, page: f }
    };
    k.current = V, W(V), rn(e.id, V);
  }
  function we(c, f = !1) {
    (c == null ? void 0 : c.key) !== (v == null ? void 0 : v.key) && (Y.current = null), (c == null ? void 0 : c.video.id) !== (v == null ? void 0 : v.video.id) && he(f && c ? c.video.id : null), L(c);
  }
  K(() => {
    if (p.current) return;
    const c = new AbortController();
    w.current = c;
    const f = ++it.current;
    return Et(!0), ae(""), je(""), Y.current = null, he(null), L(null), O([]), Q(!1), (async () => {
      const q = Vt(Lt.current, k.current);
      Ye.current = q.entityType === "performerOccurrence" ? await Fn(q, c.signal) : null;
      let x = Number(q.view.filter.page), M = await Ne(q, x, c.signal);
      const V = Math.max(
        1,
        Math.ceil(M.totalCount / Number(q.view.filter.perPage))
      );
      if ((ce.current || x > V) && (x = V, M = await Ne(q, x, c.signal)), ce.current = !1, f !== it.current || c.signal.aborted) return;
      const Fe = br(M.items, q.view.startFrom === "end");
      Be(M, x, Fe[0] ?? null);
    })().catch((q) => {
      !c.signal.aborted && f === it.current && ae(We(q));
    }).finally(() => {
      !c.signal.aborted && f === it.current && (T(!0), Et(!1));
    }), () => {
      c.abort(), it.current++;
    };
  }, [X, e.id]), K(() => {
    if (se(null), !v) return;
    let c = !0;
    return Gt(v).then((f) => {
      c && (se(f), xt(
        e.entityType === "performerOccurrence" ? f.ids.filter((q) => e.occurrence.tagIds.includes(q)) : []
      ));
    }).catch((f) => {
      c && ae(`Could not load current tags. ${We(f)}`);
    }), () => {
      c = !1;
    };
  }, [v]), K(() => {
    if (e.entityType !== "performerOccurrence" || e.actions.length)
      return;
    let c = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (f) => [
          f,
          (await _(`/api/tags/${f}`)).name
        ]
      )
    ).then((f) => {
      c && qe(Object.fromEntries(f));
    }).catch((f) => {
      c && ae(We(f));
    }), () => {
      c = !1;
    };
  }, [e]);
  async function _t(c = !1, f = !1, q = !1) {
    var at;
    if (!v) return;
    const x = g.findIndex((z) => z.key === v.key), M = R.startFrom === "end" ? -1 : 1, V = ((at = Y.current) == null ? void 0 : at.key) === v.key ? Y.current : { key: v.key, page: ie, before: g.slice(0, x + 1).map((z) => z.key), after: g.slice(x + 1).map((z) => z.key) }, Fe = new Set(V.after), G = new Set(V.before), Ze = g.find((z) => {
      var Ve;
      return Fe.has(z.key) || (M === 1 || ie < V.page) && ((Ve = Y.current) == null ? void 0 : Ve.key) === v.key && !G.has(z.key);
    });
    if (!c && Ze) {
      we(Ze, q);
      return;
    }
    const fe = c ? G : new Set(g.map((z) => z.key)), Te = 1100 - (Date.now() - U.current);
    Te > 0 && await new Promise((z) => window.setTimeout(z, Te));
    let pe = M === -1 && !c ? Math.max(1, ie - 1) : ie;
    for (; Ge.current && !ze.current; ) {
      let z = await Ne(be, pe);
      const Ve = Math.max(
        1,
        Math.ceil(z.totalCount / Number(R.filter.perPage))
      );
      pe > Ve && (pe = Ve, z = await Ne(be, pe));
      const Dt = br(z.items, M === -1), Yt = new Map(Dt.map((ge) => [ge.key, ge])), st = c ? V.after.flatMap((ge) => {
        const mt = Yt.get(ge);
        return mt ? [mt] : [];
      }) : [], Zt = new Set(st.map((ge) => ge.key)), ct = c ? {
        ...z,
        items: [
          ...st,
          ...Dt.filter(
            (ge) => ge.key !== v.key && !Zt.has(ge.key)
          )
        ]
      } : z;
      if (f) {
        Y.current = V, Be(ct, pe, v, !1, c);
        return;
      }
      const Je = M === -1 && ie === 1 && !c ? void 0 : ct.items.find(
        (ge) => !fe.has(ge.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(c && M === -1 && pe === V.page) || Fe.has(ge.key))
      );
      if (Je || (M === -1 ? pe <= 1 : pe >= Ve)) {
        Be(
          ct,
          pe,
          Je ?? null,
          q,
          c
        ), Je || je(
          z.totalCount ? "Reached the end in this direction. Matching items remain available from the scene pages." : "No matching scenes."
        );
        return;
      }
      pe += M;
    }
  }
  async function Ae(c, f = !1, q = !1, x = !1) {
    if (m || !v || Ue.current || ye || Ce && !q)
      return;
    const M = q || x || !!(c != null && c.steps.length), V = M && !f;
    if (M && (!t || !ue)) return;
    Ue.current = !0, $t(!0), ae(""), je("");
    const Fe = g.findIndex((fe) => fe.key === v.key), G = M && !f && Fe >= 0 ? g[Fe + 1] ?? null : null;
    G && (O(
      (fe) => fe.filter((Te) => Te.key !== v.key)
    ), we(G, !0));
    let Ze = !1;
    try {
      if (M) {
        const fe = await Gt(v);
        if (c)
          await Xi(be, v, c);
        else {
          const pe = x && e.entityType === "performerOccurrence" ? e.occurrence.tagIds.filter((Ve) => fe.ids.includes(Ve)) : B.current, z = Wi(pe, x ? Xe : N);
          await Hi(be, v, z);
        }
        U.current = Date.now();
        const Te = await Gt(v);
        G || se(Te), Ze = !0, Q(!1), je("Tags saved.");
      }
      if (!Ge.current || ze.current) return;
      M ? await _t(!0, f, V) : f || await _t(), f && q && requestAnimationFrame(() => {
        var fe;
        return (fe = nt.current) == null ? void 0 : fe.focus();
      });
    } catch (fe) {
      if (ae(
        Ze ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${We(fe)}` : M ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${We(fe)}` : `Could not advance. ${We(fe)}`
      ), M && !Ze) {
        G && (O(g), he(null), le((Te) => Te + 1), L(v)), U.current = Date.now();
        try {
          se(await Gt(v));
        } catch {
          se(null), ae(
            (Te) => `${Te} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Pe();
    }
  }
  K(() => {
    const c = (f) => {
      if (Ce || m || oe || ye || He || f.defaultPrevented || f.repeat || f.ctrlKey || f.altKey || f.metaKey || !Rn(f.target) || document.querySelector('[role="dialog"], dialog[open]'))
        return;
      const q = f.key.toLowerCase(), x = e.actions.find(
        (M, V) => lt(M, V) === q
      );
      x && (f.preventDefault(), f.stopPropagation(), Ae(x, f.shiftKey));
    };
    return document.addEventListener("keydown", c), () => document.removeEventListener("keydown", c);
  });
  function At() {
    !i || m || Ue.current || Ce || (E.current = document.activeElement, S.current = {
      error: dt,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(k.current),
      items: g,
      current: v,
      total: De,
      targets: Ye.current,
      stayedCursor: Y.current
    }, h(structuredClone(Vt(e, k.current))), je(""), ae(""));
  }
  K(() => {
    a && a !== A.current && I && !ye && (A.current = a, At());
  }, [a, ye, I]);
  function pt() {
    h(null), requestAnimationFrame(() => {
      var c;
      return (c = E.current) == null ? void 0 : c.focus();
    });
  }
  function Xt() {
    var f;
    const c = S.current;
    !c || oe || ((f = w.current) == null || f.abort(), it.current++, k.current = c.query, W(c.query), O(c.items), L(c.current), rt(c.total), Ye.current = c.targets, Y.current = c.stayedCursor, Et(!1), ae(c.error), je(""), window.history.replaceState(window.history.state, "", c.url), pt());
  }
  async function ot() {
    if (!m || !i || Ue.current) return;
    const c = Vt(
      { ...m, name: m.name.trim() },
      k.current
    ), f = or(c);
    if (f) {
      ae(f);
      return;
    }
    Ue.current = !0, $t(!0), ae("");
    try {
      if (await i(c) === !1) throw new Error("Could not save review.");
      pt(), je("Review saved.");
    } catch (q) {
      ae(
        "Could not save review. Your edits are still open. " + We(q)
      );
    } finally {
      Pe();
    }
  }
  const ee = R.performerScope, D = (c) => H({
    ...k.current,
    filter: { ...k.current.filter, page: 1 },
    performerScope: { ...ee, ...c }
  });
  return /* @__PURE__ */ u(
    "section",
    {
      className: "dq-review-workspace",
      "aria-label": ee ? "Performer occurrence review" : "Video review",
      children: [
        m && /* @__PURE__ */ u("section", { className: "dq-rule-editor", "aria-label": "Edit review rule", children: [
          /* @__PURE__ */ n("h2", { children: "Edit review" }),
          /* @__PURE__ */ n("p", { children: "Preview matching scenes below. Save review keeps all rule changes; Cancel restores your previous view." }),
          /* @__PURE__ */ u("fieldset", { disabled: oe, children: [
            l == null ? void 0 : l(
              Vt(m, R),
              h,
              oe
            ),
            /* @__PURE__ */ u("label", { children: [
              "Review direction",
              /* @__PURE__ */ u(
                "select",
                {
                  "aria-label": "Review direction",
                  value: R.startFrom,
                  onChange: (c) => H({
                    ...k.current,
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
                disabled: oe || ye,
                onClick: () => void ot(),
                children: "Save review"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button",
                type: "button",
                disabled: oe,
                onClick: Xt,
                children: "Cancel"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u(
          "fieldset",
          {
            className: "dq-review-filters",
            disabled: Oe,
            onClickCapture: (c) => {
              var x;
              const f = c.target instanceof Element ? c.target.closest("button") : null, q = (f == null ? void 0 : f.getAttribute("aria-label")) ?? ((x = f == null ? void 0 : f.textContent) == null ? void 0 : x.trim()) ?? "";
              f && !f.closest('[role="dialog"], dialog') && /^(Filters|Edit filter:|Edit performer criteria)/.test(q) && (Ct.current = f);
            },
            children: [
              /* @__PURE__ */ n("legend", { children: "Scene filters" }),
              /* @__PURE__ */ n(
                "div",
                {
                  onKeyDownCapture: (c) => {
                    var f;
                    c.key === "Escape" && (Ke.current = !1), ["Delete", "Backspace"].includes(c.key) && c.target instanceof Element && ((f = c.target.closest("button")) == null ? void 0 : f.getAttribute("aria-label")) === "Edit filter: Custom Fields" && (Ke.current = !0);
                  },
                  onClickCapture: (c) => {
                    var q, x;
                    const f = c.target instanceof Element ? c.target.closest("button") : null;
                    (f == null ? void 0 : f.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((q = f == null ? void 0 : f.textContent) == null ? void 0 : q.trim()) === "Clear all" ? Ke.current = !0 : (/^(Cancel|Filters)/.test(((x = f == null ? void 0 : f.textContent) == null ? void 0 : x.trim()) ?? "") || /^(Close|Dismiss)/.test((f == null ? void 0 : f.getAttribute("aria-label")) ?? "")) && (Ke.current = !1);
                  },
                  children: /* @__PURE__ */ n(
                    vr,
                    {
                      filter: R.filter,
                      objectFilter: _n(
                        R.objectFilter,
                        xe
                      ),
                      criteriaDefinitions: [
                        ...ir,
                        {
                          id: "custom-fields",
                          label: "Custom Fields",
                          filterKey: "customFieldCriteria"
                        }
                      ],
                      totalCount: De,
                      sortOptions: Or,
                      showSearch: !0,
                      showSort: !0,
                      showPagingControls: !1,
                      onFilterChange: (c) => {
                        (c.sort !== k.current.filter.sort || c.direction !== k.current.filter.direction) && (c = { ...c, sorts: void 0 }), H({
                          ...k.current,
                          filter: Me(c)
                        });
                      },
                      onObjectFilterChange: (c) => {
                        const f = Un(
                          k.current.objectFilter,
                          Dn(c),
                          Ke.current
                        );
                        Ke.current = !1, H({
                          ...k.current,
                          objectFilter: f,
                          filter: { ...k.current.filter, page: 1 }
                        });
                      }
                    }
                  )
                }
              ),
              ee && /* @__PURE__ */ u("div", { className: "dq-scope-controls", children: [
                /* @__PURE__ */ u("label", { children: [
                  "Performers to review",
                  " ",
                  /* @__PURE__ */ u(
                    "select",
                    {
                      value: ee.targetMode,
                      onChange: (c) => D({
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
                ee.targetMode === "selected" && /* @__PURE__ */ n(
                  tt,
                  {
                    entityType: "performer",
                    values: ee.performerIds,
                    onChange: (c) => D({ performerIds: c }),
                    placeholder: "Select performers to review...",
                    allowCreate: !1
                  }
                ),
                ee.targetMode === "filter" && /* @__PURE__ */ u(ke, { children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => Z(!0),
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
                      objectFilter: ee.performerFilter,
                      onObjectFilterChange: (c) => D({ performerFilter: c })
                    }
                  ) })
                ] }),
                /* @__PURE__ */ u("label", { children: [
                  "Occurrence tags",
                  " ",
                  /* @__PURE__ */ u(
                    "select",
                    {
                      value: ee.condition,
                      onChange: (c) => D({
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
                !["any", "isNull"].includes(ee.condition) && /* @__PURE__ */ u(ke, { children: [
                  /* @__PURE__ */ n(
                    tt,
                    {
                      entityType: "tag",
                      values: ee.conditionTagIds,
                      onChange: (c) => D({ conditionTagIds: c }),
                      placeholder: "Occurrence condition tags...",
                      allowCreate: !1
                    }
                  ),
                  /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "checkbox",
                        checked: ee.includeSubtags ?? !0,
                        onChange: (c) => D({ includeSubtags: c.target.checked })
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
                      const c = Rr(e);
                      H(c, c.startFrom === "end");
                    },
                    children: "Reset to review defaults"
                  }
                ),
                i && /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    onClick: At,
                    children: "Save as review defaults"
                  }
                )
              ] })
            ]
          }
        ),
        ee && /* @__PURE__ */ n(
          gn,
          {
            open: He,
            onClose: () => Z(!1),
            criteria: Qr,
            activeFilter: ee.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (c) => {
              Z(!1), D({ performerFilter: c });
            }
          }
        ),
        /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
          dt && /* @__PURE__ */ u("p", { role: "alert", children: [
            dt,
            " ",
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: oe,
                onClick: () => {
                  v ? Gt(v).then(se).catch((c) => ae(We(c))) : H(k.current);
                },
                children: v ? "Reload tags" : "Retry queue"
              }
            )
          ] }),
          ut && /* @__PURE__ */ n("p", { role: "status", children: ut })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-review-layout", children: [
          /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
            /* @__PURE__ */ n("fieldset", { disabled: Oe, children: /* @__PURE__ */ n(
              mn,
              {
                filter: R.filter,
                totalCount: De,
                onFilterChange: (c) => H({ ...R, filter: Me(c) })
              }
            ) }),
            /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: g.map((c) => {
              var f, q, x;
              return /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  title: `${c.occurrence ? `${c.occurrence.performer.name} — ` : ""}${c.video.title || ((f = c.video.files[0]) == null ? void 0 : f.basename) || "Scene"}`,
                  "aria-label": `${c.occurrence ? `${c.occurrence.performer.name} — ` : ""}${c.video.title || ((q = c.video.files[0]) == null ? void 0 : q.basename) || "Scene"}`,
                  disabled: Oe,
                  "aria-pressed": (v == null ? void 0 : v.key) === c.key,
                  onClick: () => {
                    we(c), ae(""), je("");
                  },
                  children: [
                    c.occurrence && /* @__PURE__ */ n(nn, { performer: c.occurrence.performer }),
                    /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: c.video.title || ((x = c.video.files[0]) == null ? void 0 : x.basename) || "Scene" })
                  ]
                },
                c.key
              );
            }) })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-inspector", children: v ? /* @__PURE__ */ u(ke, { children: [
            /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
              /* @__PURE__ */ n("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ n(
                "a",
                {
                  href: `/video/${v.video.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: v.video.title || ((gt = v.video.files[0]) == null ? void 0 : gt.basename) || `Video ${v.video.id}`
                }
              ) }),
              [v, Ft].filter(Boolean).map((c) => {
                var x, M, V;
                const f = c, q = f.key === v.key;
                return /* @__PURE__ */ n(
                  "div",
                  {
                    className: q ? "dq-review-video-current" : "dq-review-video-preload",
                    "aria-hidden": q ? void 0 : !0,
                    inert: q ? void 0 : !0,
                    children: /* @__PURE__ */ n(
                      hn,
                      {
                        videoId: f.video.id,
                        streamUrl: Pn(f.video.id),
                        posterUrl: q ? Fi(f.video) : void 0,
                        duration: ((x = f.video.files[0]) == null ? void 0 : x.duration) ?? 0,
                        format: (M = f.video.files[0]) == null ? void 0 : M.format,
                        audioCodec: (V = f.video.files[0]) == null ? void 0 : V.audioCodec,
                        extensionSurface: q ? "quick-view" : void 0,
                        autostart: q && Ee === f.video.id,
                        showAbLoop: q,
                        clip: f.video.parentVideoId != null ? {
                          start: f.video.clipStartSec ?? 0,
                          end: f.video.clipEndSec,
                          loop: !1
                        } : void 0
                      }
                    )
                  },
                  `${f.video.id}:${zt}`
                );
              })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-panel", children: [
              /* @__PURE__ */ n("h2", { children: v.occurrence ? `Reviewing ${v.occurrence.performer.name}` : "Reviewing this video" }),
              /* @__PURE__ */ n("p", { children: ee ? "Tags apply only to this performer in this video." : "Tags apply to the video." }),
              ee && /* @__PURE__ */ n(
                "div",
                {
                  className: "dq-review-partners",
                  "aria-label": "Matching scene partners",
                  children: g.filter((c) => c.video.id === v.video.id).map((c) => {
                    var f, q;
                    return /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button dq-partner-button",
                        title: (f = c.occurrence) == null ? void 0 : f.performer.name,
                        "aria-label": (q = c.occurrence) == null ? void 0 : q.performer.name,
                        disabled: Oe,
                        "aria-pressed": c.key === v.key,
                        onClick: () => {
                          we(c), ae("");
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
                ee ? "occurrence" : "video",
                " tags:",
                " ",
                ue ? ue.names.join(", ") || "None" : "Loading…"
              ] }),
              ue != null && ue.absent.length ? /* @__PURE__ */ u("p", { children: [
                "Confirmed absent tags:",
                " ",
                /* @__PURE__ */ n(
                  tt,
                  {
                    entityType: "tag",
                    values: ue.absent,
                    onChange: () => {
                    },
                    disabled: !0,
                    allowCreate: !1
                  }
                )
              ] }) : null,
              Ce ? /* @__PURE__ */ u(
                "fieldset",
                {
                  ref: ft,
                  disabled: oe,
                  className: "dq-tag-editor",
                  children: [
                    /* @__PURE__ */ u("legend", { children: [
                      "Edit ",
                      ee ? "occurrence" : "video",
                      " tags"
                    ] }),
                    /* @__PURE__ */ n(
                      tt,
                      {
                        entityType: "tag",
                        values: N,
                        onChange: j,
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
                          disabled: !ue,
                          onClick: () => void Ae(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !ue,
                          onClick: () => void Ae(void 0, !1, !0),
                          children: "Save & next"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => {
                            Q(!1), requestAnimationFrame(
                              () => {
                                var c;
                                return (c = nt.current) == null ? void 0 : c.focus();
                              }
                            );
                          },
                          children: "Cancel"
                        }
                      )
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ u(ke, { children: [
                /* @__PURE__ */ n(
                  eo,
                  {
                    actions: Ie.actions,
                    canWrite: t,
                    disabled: oe || ye || !ue || !!m,
                    onApply: (c, f) => void Ae(c, f)
                  }
                ),
                e.entityType === "performerOccurrence" && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                  "fieldset",
                  {
                    disabled: !t || oe || !ue || !!m,
                    children: [
                      /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                      e.occurrence.tagIds.map((c) => /* @__PURE__ */ u("label", { children: [
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: e.occurrence.multiple ? "checkbox" : "radio",
                            name: "legacy-choice",
                            checked: Xe.includes(c),
                            onChange: (f) => xt(
                              e.occurrence.multiple ? f.target.checked ? [...Xe, c] : Xe.filter(
                                (q) => q !== c
                              ) : [c]
                            )
                          }
                        ),
                        lr[c] ?? "Loading tag…"
                      ] }, c)),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          onClick: () => xt([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void Ae(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Ae(void 0, !1, !1, !0),
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
                    ref: nt,
                    className: "dq-button",
                    disabled: Oe || !!m || !t || !ue,
                    onClick: () => {
                      B.current = [...ue.ids], j([...ue.ids]), Q(!0);
                    },
                    children: "Edit tags"
                  }
                ),
                /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: Oe || !!m,
                    onClick: () => void Ae(),
                    children: [
                      "Skip",
                      ee ? " performer" : " video"
                    ]
                  }
                )
              ] }),
              !t && /* @__PURE__ */ n("p", { children: "Write permission is required to change tags." })
            ] })
          ] }) : /* @__PURE__ */ n("p", { role: "status", children: ye ? "Loading review…" : De ? "Reached the end in this direction." : "No matching scenes." }) })
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
      tt,
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
    !["any", "isNull"].includes(i.condition) && /* @__PURE__ */ u(ke, { children: [
      /* @__PURE__ */ n(
        tt,
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
  var p, m, h;
  const [t, r] = C({}), [i, a] = C(""), l = (((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.annotations) ?? []).includes("tags") ? ((m = e == null ? void 0 : e.presentation) == null ? void 0 : m.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...l,
      ...((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.binParents) ?? []
    ])
  ]);
  return K(() => {
    let S = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(s).map(
        async (E) => [E, await Wt([E])]
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
        (p) => {
          var m;
          return p !== s.id && ((m = r[p]) == null ? void 0 : m.includes(s.id));
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
  var p, m, h;
  const l = new Set(
    (((p = t.presentation) == null ? void 0 : p.binParents) ?? []).flatMap(
      (S) => (r[S] ?? []).filter((E) => E !== S)
    )
  ), s = /* @__PURE__ */ new Map();
  for (const S of e)
    for (const E of S.tags ?? [])
      if (l.has(E.id)) {
        const w = s.get(E.id) ?? { name: E.name, count: 0 };
        w.count++, s.set(E.id, w);
      }
  return (h = (m = t.presentation) == null ? void 0 : m.binParents) != null && h.length ? /* @__PURE__ */ u("div", { className: "dq-row", "aria-label": "Tag bins", children: [
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
  const [a, l] = C(!1), s = $e(e) === "tag" ? "tag" : "video", p = e.view.filter, m = s === "tag" ? yn : Or, h = (w) => t({
    ...e,
    view: { ...e.view, filter: { ...p, ...w } }
  }), S = s === "video" ? e.presentation ?? {} : {}, E = (w) => t({ ...e, presentation: { ...S, ...w } });
  return /* @__PURE__ */ u(ke, { children: [
    i && /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ u("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(p.q ?? ""),
            onChange: (w) => h({ q: w.target.value })
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
              value: String(p.sort ?? "date"),
              onChange: (w) => h({ sort: w.target.value, sorts: void 0 }),
              children: [
                !m.some((w) => w.value === p.sort) && p.sort != null && /* @__PURE__ */ n("option", { value: String(p.sort), children: String(p.sort) }),
                m.map((w) => /* @__PURE__ */ n("option", { value: w.value, children: w.label }, w.value))
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
              value: String(p.direction ?? "desc"),
              onChange: (w) => h({ direction: w.target.value }),
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
              value: Number(p.perPage) || 40,
              onChange: (w) => h({
                perPage: Math.max(
                  1,
                  Math.min(1e3, Number(w.target.value) || 40)
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
              onChange: (w) => t({
                ...e,
                view: {
                  ...e.view,
                  startFrom: w.target.value
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
      a && /* @__PURE__ */ n("div", { onKeyDown: (w) => w.stopPropagation(), children: /* @__PURE__ */ n(
        gn,
        {
          open: !0,
          onClose: () => l(!1),
          criteria: s === "tag" ? bn : ir,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: s === "video",
          subjectLabel: s === "tag" ? "tags" : "videos",
          onApply: (w) => {
            t({ ...e, view: { ...e.view, objectFilter: w } }), l(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ u(ke, { children: [
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
            onChange: (w) => t({
              ...e,
              view: {
                ...e.view,
                displayMode: w.target.value
              }
            }),
            children: (s === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((w) => /* @__PURE__ */ n("option", { children: w }, w))
          }
        )
      ] }) }),
      s === "video" && /* @__PURE__ */ u(ke, { children: [
        /* @__PURE__ */ n("h4", { children: "Card annotations" }),
        /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((w) => {
          const I = S.annotations ?? [];
          return /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: I.includes(w),
                onChange: (T) => E({
                  annotations: T.target.checked ? [...I, w] : I.filter((A) => A !== w)
                })
              }
            ),
            w
          ] }, w);
        }) }),
        (S.annotations ?? []).includes("tags") && /* @__PURE__ */ u(ke, { children: [
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
          /* @__PURE__ */ n(
            tt,
            {
              entityType: "tag",
              values: S.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (w) => E({ annotationParents: w }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ n("h4", { children: "Tag bins" }),
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ n(
          tt,
          {
            entityType: "tag",
            values: S.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (w) => E({ binParents: w }),
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
  return $e(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function cn(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function ln() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function dn(e) {
  const t = new URLSearchParams(window.location.search);
  xr.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function so(e) {
  return Me({ ...e, page: 1 });
}
function kr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, p) => kr(s, t[p]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, a = Object.keys(r).sort(), l = Object.keys(i).sort();
  return a.length === l.length && a.every(
    (s, p) => s === l[p] && kr(r[s], i[s])
  );
}
function Kn(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function _e(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
const Vn = "data-quality.workspace-layout.v1", _r = 240, qr = 192, Ir = 560;
function Gn(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(Ir, Math.max(qr, e)) : _r;
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
  }), [a, l] = C(""), [s, p] = C(!0), [m, h] = C(""), [S, E] = C(!1), [w, I] = C(!1), [T, A] = C(!1), [R, W] = C([]), [k, X] = C(""), [ne, ce] = C(!0), [g, O] = C(""), [v, L] = C(""), [Y, Ee] = C(!1), [he, zt] = C(!1), [le, Ft] = C(ln), [De, rt] = C({}), [ye, Et] = C("name"), [oe, $t] = C("asc"), Ue = P(null), Ge = P(!1), [ze, dt] = C(0), [ae, ut] = C(!1), [je, ue] = C(!1), [se, Ce] = C(
    null
  ), Q = t.find((o) => o.id === le) ?? null, N = vt(
    () => (se == null ? void 0 : se.id) === le && Q ? { ...Q, view: se.view } : Q,
    [se, le, Q]
  );
  K(() => {
    const o = () => Ft(ln());
    return window.addEventListener("popstate", o), () => window.removeEventListener("popstate", o);
  }, []);
  const j = N ? $e(N) : "video", B = j === "video" ? N : null, nt = j === "tag" ? w : S, Ct = vt(() => {
    const o = oe === "asc" ? 1 : -1;
    return [...t].sort((d, y) => {
      if (ye === "count") {
        const b = De[d.id], $ = De[y.id], F = typeof b == "number", J = typeof $ == "number";
        if (F !== J) return F ? -1 : 1;
        if (F && J && b !== $)
          return (b - $) * o;
      }
      return d.name.localeCompare(y.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * o;
    });
  }, [oe, ye, De, t]), ft = P(
    null
  ), He = ro(B), [Z, Xe] = C({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [xt, lr] = C({
    page: 1,
    perPage: 40
  }), [qe, Ye] = C({ items: [], totalCount: 0 }), [U, Ke] = C(!1), [xe, Ht] = C(""), [it, Lt] = C(!1), [Ie, be] = C(() => /* @__PURE__ */ new Set()), Nt = P(Ie);
  Nt.current = Ie;
  const Oe = P(/* @__PURE__ */ new Map()), [ie, H] = C(null), Pe = P(ie);
  Pe.current = ie;
  const [Ne, Be] = C(!1), we = P(Ne);
  we.current = Ne;
  const _t = P(null), [Ae, At] = C("grid"), [pt, Xt] = C(wr), [ot, ee] = C(co), [D, gt] = C(!1), c = P(!1), [f, q] = C(""), [x, M] = C(""), [V, Fe] = C(""), [G, Ze] = C(null), [fe, Te] = C(""), [pe, at] = C(!1), [z, Ve] = C({}), [Dt, Yt] = C({}), st = P(/* @__PURE__ */ new Map()), Zt = P(null), ct = P(null), Je = P(0), ge = P(0), mt = P(null), ht = P(!1), Dr = JSON.stringify([
    ...new Set(
      (B == null ? void 0 : B.actions.flatMap(
        (o) => o.steps.flatMap((d) => d.tagIds)
      )) ?? []
    )
  ]);
  function dr(o) {
    const d = Gn(o);
    ee(d), lo(d);
  }
  function zn(o) {
    const d = o.shiftKey ? 40 : 16;
    let y = null;
    o.key === "ArrowLeft" && (y = ot + d), o.key === "ArrowRight" && (y = ot - d), o.key === "Home" && (y = qr), o.key === "End" && (y = Ir), y !== null && (o.preventDefault(), o.stopPropagation(), dr(y));
  }
  K(() => {
    if (!x) return;
    const o = window.setTimeout(() => M(""), 4e3);
    return () => window.clearTimeout(o);
  }, [x]), K(() => {
    const o = JSON.parse(Dr);
    if (Yt({}), !o.length) return;
    const d = new AbortController();
    let y = !0;
    return Promise.all(
      o.map(async (b) => {
        var $;
        try {
          const F = await _(`/api/tags/${b}`, {
            signal: d.signal
          });
          return [b, (($ = F.name) == null ? void 0 : $.trim()) || null];
        } catch {
          return [b, null];
        }
      })
    ).then((b) => {
      y && Yt(Object.fromEntries(b));
    }), () => {
      y = !1, d.abort();
    };
  }, [Dr]), K(() => {
    const o = B ? Ln(B.view.objectFilter) : [];
    if (Ve({}), !o.length) return;
    const d = new AbortController();
    let y = !0;
    return Promise.all(
      o.map(async (b) => {
        var $;
        try {
          const F = await _(`/api/tags/${b}`, {
            signal: d.signal
          });
          return ($ = F.name) != null && $.trim() ? [String(b), F.name] : null;
        } catch {
          return null;
        }
      })
    ).then((b) => {
      y && Ve(
        Object.fromEntries(b.filter(($) => $ !== null))
      );
    }), () => {
      y = !1, d.abort();
    };
  }, [B == null ? void 0 : B.id, B == null ? void 0 : B.view.objectFilter]);
  const ur = vt(
    () => B ? _n(
      B.view.objectFilter,
      z
    ) : (N == null ? void 0 : N.view.objectFilter) ?? {},
    [z, N, B]
  ), Hn = vt(
    () => j === "video" && Array.isArray(ur.customFieldCriteria) ? [...ir, ao] : j === "tag" ? bn : ir,
    [j, ur.customFieldCriteria]
  ), Ur = wt(async () => {
    p(!0), h("");
    try {
      const o = await Ai();
      r(o.reviews), l(o.storageKey), E(o.canWriteVideos ?? o.canWrite), I(o.canWriteTags ?? !1), A(o.canReadTagGroups ?? !1), ce(o.canConfigure ?? !0), O(o.storageNotice ?? ""), le && !o.reviews.some((d) => d.id === le) && (Ft(""), dn(""));
    } catch (o) {
      h(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      p(!1);
    }
  }, [le]);
  K(() => {
    if (!T) {
      W([]), X("");
      return;
    }
    const o = new AbortController();
    return X(""), Mi(o.signal).then(W).catch((d) => {
      o.signal.aborted || X(
        d instanceof Error ? d.message : "Could not load tag groups."
      );
    }), () => o.abort();
  }, [T]), K(() => {
    Ur();
  }, []), K(() => {
    if (le || t.length === 0) return;
    const o = new AbortController();
    rt({});
    for (const d of t)
      (d.entityType === "performerOccurrence" ? Fn(d, o.signal).then((b) => (b == null ? void 0 : b.length) === 0 ? { items: [], totalCount: 0 } : Bt($n(d, b), { ...d.view.filter, page: 1, perPage: 1 }, o.signal)) : $e(d) === "tag" ? Yr(
        d,
        Me({ ...d.view.filter, page: 1, perPage: 1 }),
        o.signal
      ) : Bt(
        d,
        Me({ ...d.view.filter, page: 1, perPage: 1 }),
        o.signal
      )).then((b) => {
        o.signal.aborted || rt(($) => ({
          ...$,
          [d.id]: b.totalCount
        }));
      }).catch(() => {
        o.signal.aborted || rt((b) => ({ ...b, [d.id]: null }));
      });
    return () => o.abort();
  }, [le, t]), pn(() => {
    var o;
    le || s || !Ge.current || (Ge.current = !1, (o = Ue.current) == null || o.focus());
  }, [le, s]);
  const er = wt(async () => {
    Te("");
    try {
      Ze(await $r());
    } catch (o) {
      Ze(null), Te(
        "Tag assessment setup could not be checked. " + (o instanceof Error ? o.message : "Request failed.")
      );
    }
  }, []);
  K(() => {
    er();
  }, [er]);
  const yt = wt(
    async (o, d, y = !1) => {
      var J;
      const b = ++Je.current;
      (J = mt.current) == null || J.abort();
      const $ = new AbortController();
      mt.current = $, d = Me(d);
      const F = Number(d.page);
      y && (d = { ...d, page: 1 }), Xe(d), Lt(y), Ke(!0), Ht("");
      try {
        const de = (Rt) => $e(o) === "tag" ? Yr(
          o,
          Rt,
          $.signal
        ) : Bt(
          o,
          Rt,
          $.signal
        );
        let Re = await de(d);
        const Qe = Math.max(
          1,
          Math.ceil(Re.totalCount / Number(d.perPage))
        ), Le = y ? Qe : Math.min(F, Qe);
        return Number(d.page) !== Le && (d = { ...d, page: Le }, Re = await de(d)), b === Je.current && (Ye(Re), Xe(d), lr(d)), Re;
      } catch (de) {
        throw b === Je.current && Ht(
          de instanceof Error ? de.message : "Could not load the review queue."
        ), de;
      } finally {
        b === Je.current && Ke(!1);
      }
    },
    []
  );
  K(() => {
    var d;
    if (ge.current += 1, Je.current += 1, (d = mt.current) == null || d.abort(), zt(!1), L(""), Ee(!1), be(/* @__PURE__ */ new Set()), Oe.current.clear(), H(null), Be(!1), gt(!1), c.current = !1, q(""), M(""), Fe(""), Ye({ items: [], totalCount: 0 }), !N || $e(N) !== "tag") {
      Ke(!1);
      return;
    }
    let o = !0;
    return Ke(!0), (async () => {
      let y = null;
      try {
        y = await ki(a, N.id);
      } catch (F) {
        o && (Ee(!0), L(
          F instanceof Error ? F.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const b = (y == null ? void 0 : y.signature) === qt(N) ? y : null, $ = b ? Me(b.filter) : so(N.view.filter);
      Xe($), At(
        b ? cn(b.displayMode, $e(N)) : sn(N)
      ), Xt(
        b ? b.cardSize ?? wr : wr
      );
      try {
        const F = await yt(
          N,
          $,
          !b && N.view.startFrom !== "beginning"
        );
        if (!o) return;
        const J = Wr(
          F.items.map((de) => de.id),
          (b == null ? void 0 : b.focusedId) ?? null,
          (b == null ? void 0 : b.index) ?? 0
        );
        H(J), ve(J);
      } catch {
      }
      o && zt(!0);
    })(), () => {
      var y;
      o = !1, ge.current++, Je.current++, (y = mt.current) == null || y.abort();
    };
  }, [N == null ? void 0 : N.id]);
  const te = vt(
    () => qe.items.map((o) => o.id),
    [qe.items]
  );
  K(() => {
    if (!he || !N || !a || U || xe || D || (se == null ? void 0 : se.id) === N.id || Y)
      return;
    const o = {
      version: 1,
      signature: qt(N),
      filter: Z,
      focusedId: ie,
      index: Math.max(0, te.indexOf(ie ?? -1)),
      displayMode: Ae,
      cardSize: pt,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        a + ":progress:" + N.id,
        JSON.stringify(o)
      );
    } catch {
    }
    if (v) return;
    let d = !0;
    const y = window.setTimeout(() => {
      qi(a, N.id, o).catch((b) => {
        d && L(
          "Progress is kept in this browser, but account sync failed. " + (b instanceof Error ? b.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      d = !1, window.clearTimeout(y);
    };
  }, [
    he,
    a,
    N,
    U,
    xe,
    D,
    Z,
    ie,
    te,
    Ae,
    pt,
    se,
    v,
    Y
  ]);
  const Xn = qe.items.find((o) => o.id === ie) ?? null, fr = j === "video" ? Xn : null;
  Ne && fr && (_t.current = fr);
  const bt = fr ?? (Ne ? _t.current : null), Yn = zr(Ie, ie), jr = Ie.size > 0 ? `${Ie.size} selected ${j}${Ie.size === 1 ? "" : "s"}` : ie == null ? `no ${j}` : `focused ${j}`, ve = wt((o, d = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const y = st.current.get(o);
      y == null || y.focus({ preventScroll: !0 }), d && (y == null || y.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  K(() => {
    he && !we.current && ve(Pe.current);
  }, [he, ve]), K(() => {
    U || !te.length || (Pe.current == null || !te.includes(Pe.current)) && (H(te[0]), we.current || ve(te[0]));
  }, [ve, te, U]);
  const Tt = wt(
    (o) => {
      be((d) => {
        const y = o(d);
        for (const b of /* @__PURE__ */ new Set([...d, ...y]))
          d.has(b) !== y.has(b) && Oe.current.set(
            b,
            (Oe.current.get(b) ?? 0) + 1
          );
        return y;
      });
    },
    []
  ), pr = wt(
    (o) => {
      if (!te.length) return;
      const d = Math.max(
        0,
        te.indexOf(Pe.current ?? te[0])
      ), y = te[Math.max(0, Math.min(te.length - 1, d + o))];
      H(y), we.current || ve(y);
    },
    [ve, te]
  ), gr = wt(
    async (o) => {
      const d = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", y = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, b = y != null && (!T || !R.some((re) => re.id === y)), $ = "effect" in o && d && !T, F = zr(
        Nt.current,
        Pe.current
      );
      if (!N || c.current || U || xe || d && !nt || $ || b || ar(o) && (G == null ? void 0 : G.kind) !== "ready" || !F.length)
        return;
      const J = ++ge.current, de = N.id, Re = [...te], Qe = qe, Le = Pe.current, Rt = new Set(Nt.current), jt = new Map(
        F.map((re) => [re, Oe.current.get(re) ?? 0])
      ), kt = () => J === ge.current && N.id === de;
      c.current = !0, gt(!0), q(
        Nt.current.size ? `${F.length} selected ${j}s` : `the focused ${j}`
      ), M(""), Fe("");
      const Vr = Qe.items.filter(
        (re) => !F.includes(re.id)
      ), si = Vr.map((re) => re.id), Gr = Hr(
        Re,
        si,
        Le,
        F.includes(Le ?? -1)
      );
      Ye({
        items: Vr,
        totalCount: Qe.totalCount
      }), be((re) => {
        const me = new Set(re);
        for (const Se of F) me.delete(Se);
        return me;
      }), H(Gr), we.current || ve(Gr);
      let hr = !1;
      try {
        if ("effect" in o ? await Vi(o, F) : await Mn(o, F), hr = !0, !kt()) return;
        be((re) => {
          const me = new Set(re);
          for (const Se of F)
            (Oe.current.get(Se) ?? 0) === jt.get(Se) && me.delete(Se);
          return me;
        }), M(
          `${o.label}: ${F.length} ${j}${F.length === 1 ? "" : "s"} ${d ? "updated" : "skipped"}.`
        );
      } catch (re) {
        if (!kt()) return;
        Ye(Qe), be((me) => {
          const Se = new Set(me);
          for (const et of F)
            Rt.has(et) && (Oe.current.get(et) ?? 0) === jt.get(et) && Se.add(et);
          return Se;
        }), H(Le), we.current || ve(Le), Fe(
          re instanceof Error ? re.message : "Action failed."
        );
      }
      try {
        if (await Li(o), !kt()) return;
        const re = await yt(N, Z);
        if (!kt()) return;
        let me = re.items.map((Se) => Se.id);
        if (!me.length && re.totalCount > 0 && Number(Z.page) > 1) {
          const Se = Math.max(1, Number(Z.page) - 1), et = { ...Z, page: Se };
          Xe(et), me = (await yt(N, et)).items.map((yr) => yr.id), be(
            (yr) => new Set([...yr].filter((ci) => me.includes(ci)))
          );
          const Jr = me.at(-1) ?? null;
          H(Jr), we.current || ve(Jr);
        } else {
          be(
            (et) => new Set([...et].filter((Br) => me.includes(Br)))
          );
          const Se = Hr(
            Re,
            me,
            Le,
            hr && F.includes(Le ?? -1)
          );
          H(Se), we.current && Se == null && Be(!1), we.current || ve(Se);
        }
      } catch (re) {
        kt() && Fe(
          (me) => `${me ? `${me} ` : ""}${hr ? "The action completed, but " : ""}the queue could not be refreshed. ${re instanceof Error ? re.message : "Refresh failed."}`
        );
      } finally {
        kt() && (c.current = !1, gt(!1), q(""));
      }
    },
    [
      nt,
      T,
      R,
      j,
      G,
      yt,
      Z,
      ve,
      te,
      qe,
      U,
      xe,
      N
    ]
  );
  function Zn() {
    var y;
    if (Ae === "list") return 1;
    const o = (y = Zt.current) == null ? void 0 : y.firstElementChild, d = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, d.split(" ").filter(Boolean).length);
  }
  function ei(o) {
    if (j !== "tag" || o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || ae) return;
    if (Ne && o.key === "Escape") {
      _e(o), Be(!1), ve(Pe.current);
      return;
    }
    if (!Rn(o.target)) return;
    if (o.key === "Escape") {
      _e(o), Tt(() => /* @__PURE__ */ new Set());
      return;
    }
    const d = (N == null ? void 0 : N.actions.findIndex(
      ($, F) => lt($, F) === o.key.toLowerCase()
    )) ?? -1;
    if (d >= 0 && (N != null && N.actions[d])) {
      _e(o), !D && !U && gr(N.actions[d]);
      return;
    }
    if (!Ne && o.key === " ") {
      _e(o), ie != null && Tt(($) => nr($, ie));
      return;
    }
    if (!Ne && o.key.toLowerCase() === "a") {
      _e(o), Tt(
        ($) => Si($, te)
      );
      return;
    }
    if (D || U || Ne) return;
    if (o.key === "Enter" && ie != null) {
      _e(o), j === "tag" ? window.open(`/tag/${ie}`, "_blank", "noopener,noreferrer") : Be(!0);
      return;
    }
    const y = Zn(), b = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -y : o.key === "ArrowDown" ? y : 0;
    b && (_e(o), pr(b));
  }
  function Ut(o) {
    dt(0), Ft(o), dn(o);
  }
  function ti() {
    Ge.current = !0, rt({}), Ut("");
  }
  async function mr(o) {
    if (!a) return !1;
    const d = o.map(go);
    try {
      await Ri(a, d);
    } catch (b) {
      throw b;
    }
    r(d), le && !d.some((b) => b.id === le) && Ut("");
    const y = d.find((b) => b.id === le);
    return y && Q && JSON.stringify(y) !== JSON.stringify(Q) && (y.view.displayMode !== Q.view.displayMode && At(sn(y)), y.entityType === "tag" && qt(y) !== qt(Q) && (Ce(null), tr(
      y,
      Me({ ...y.view.filter, page: Z.page })
    ))), !0;
  }
  if (s)
    return /* @__PURE__ */ n(un, { label: "Loading reviews…" });
  if (m)
    return /* @__PURE__ */ u(ke, { children: [
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
          message: m,
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
          disabled: D,
          onClick: ti,
          children: /* @__PURE__ */ n(wn, {})
        }
      ),
      /* @__PURE__ */ u("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (N == null ? void 0 : N.name) ?? "Data Quality" }),
        (N == null ? void 0 : N.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: N.description })
      ] }),
      N && Q && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: D || U || !ne,
          onClick: () => {
            N.entityType !== "tag" ? dt((o) => o + 1) : (ue(!0), ut(!0));
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
          disabled: D || U || !ne,
          onClick: () => {
            ue(!1), ut(!0);
          },
          children: /* @__PURE__ */ n(fi, {})
        }
      )
    ] }),
    g && /* @__PURE__ */ n("p", { className: "dq-status", children: g }),
    B && (G == null ? void 0 : G.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      G.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: pe,
          onClick: () => {
            at(!0), Te(""), Di().then(er).catch(
              (o) => Te(
                "Could not create the Confirmed absent tags custom field. " + (o instanceof Error ? o.message : "Request failed.")
              )
            ).finally(() => at(!1));
          },
          children: pe ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    B && ((G == null ? void 0 : G.kind) === "incompatible" || fe) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(Er, {}),
      fe || (G == null ? void 0 : G.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: pe,
          onClick: () => {
            at(!0), er().finally(
              () => at(!1)
            );
          },
          children: pe ? "Checking…" : "Check again"
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
    v && /* @__PURE__ */ u("p", { role: "alert", children: [
      v,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            L(""), Ee(!1);
          },
          children: Y ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    N && Q && N.entityType === "tag" && /* @__PURE__ */ u("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${D || U ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": D || U || void 0,
          inert: D || U ? !0 : void 0,
          onClickCapture: (o) => {
            var y, b, $, F, J;
            const d = o.target instanceof Element ? o.target.closest("button") : null;
            (d == null ? void 0 : d.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((y = d == null ? void 0 : d.textContent) == null ? void 0 : y.trim()) === "Clear all" ? ht.current = !0 : ((b = d == null ? void 0 : d.getAttribute("aria-label")) != null && b.startsWith("Filters") || ($ = d == null ? void 0 : d.getAttribute("aria-label")) != null && $.startsWith("Edit filter:") || ((F = d == null ? void 0 : d.textContent) == null ? void 0 : F.trim()) === "Cancel" || (J = d == null ? void 0 : d.getAttribute("aria-label")) != null && J.startsWith("Close ")) && (ht.current = !1);
          },
          onKeyDownCapture: (o) => {
            var y, b;
            const d = o.target instanceof Element ? o.target.closest("button") : null;
            (o.key === "Delete" || o.key === "Backspace") && (d == null ? void 0 : d.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (o.preventDefault(), o.stopPropagation(), ht.current = !0, (b = (y = d.parentElement) == null ? void 0 : y.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || b.click()) : o.key === "Escape" && (ht.current = !1);
          },
          children: /* @__PURE__ */ n(
            vr,
            {
              filter: xe ? xt : Z,
              onFilterChange: ri,
              totalCount: qe.totalCount,
              sortOptions: j === "tag" ? yn : Or,
              showSearch: !0,
              showSort: !0,
              displayMode: Ae,
              onDisplayModeChange: (o) => At(cn(o, j)),
              availableDisplayModes: j === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (pt - 225) / 50,
              onZoomChange: (o) => Xt(Math.round(225 + o * 50)),
              cardSizeEntityType: j === "tag" ? "tags" : "videos",
              criteriaDefinitions: Hn,
              objectFilter: ur,
              onObjectFilterChange: (o) => {
                if (!D && !U) {
                  const d = j === "video" ? Dn(o) : o;
                  ft.current = j === "video" ? Un(
                    N.view.objectFilter,
                    d,
                    ht.current
                  ) : d, ht.current = !1;
                }
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (se == null ? void 0 : se.id) === le && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: D || U || !ne,
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
            disabled: D || U,
            onClick: ni,
            children: /* @__PURE__ */ n(gi, {})
          }
        )
      ] })
    ] }),
    N ? j !== "tag" ? /* @__PURE__ */ n(to, { review: N, canWrite: N.entityType === "performerOccurrence" ? w : S, onBusy: gt, editRequest: ze, renderRuleEditor: (o, d, y) => /* @__PURE__ */ n(Qn, { workspace: !0, draft: o, entityTypeLocked: !0, tagGroups: R, saving: y, setDraft: (b) => d(b), onSave: () => {
    }, onCancel: () => {
    } }), onSaveDefaults: ne ? (o) => mr(t.map((d) => d.id === o.id ? o : d)) : void 0 }, N.id) : /* @__PURE__ */ u(ke, { children: [
      B && He.error && /* @__PURE__ */ n("p", { role: "alert", children: He.error }),
      B && /* @__PURE__ */ n(
        io,
        {
          videos: qe.items,
          review: B,
          trees: He.ids,
          disabled: D || U,
          onChoose: (o) => {
            const d = oo(B, o);
            Ce(d), tr(d, { ...Z, page: 1 });
          }
        }
      ),
      V && !Ne && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(Er, {}),
        V
      ] }),
      x && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: x }),
      Kr("top"),
      /* @__PURE__ */ u(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${ot}px`
          },
          children: [
            /* @__PURE__ */ u("main", { children: [
              U && !qe.items.length && /* @__PURE__ */ n(un, { label: "Loading review queue…" }),
              xe && !U && /* @__PURE__ */ n(
                fn,
                {
                  message: xe,
                  onRetry: () => void yt(
                    N,
                    Z,
                    it
                  ).catch(() => {
                  })
                }
              ),
              !D && !U && !xe && !qe.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(Cr, {}),
                /* @__PURE__ */ u("p", { children: [
                  "No ",
                  j,
                  "s match this review."
                ] })
              ] }),
              !!qe.items.length && /* @__PURE__ */ n("div", { ref: Zt, children: /* @__PURE__ */ n(
                "div",
                {
                  className: Ae === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${pt}px`
                  },
                  children: qe.items.map(ai)
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
                "aria-valuemax": Ir,
                "aria-valuenow": ot,
                "aria-valuetext": `${ot} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (o) => {
                  ct.current = {
                    pointerId: o.pointerId,
                    startX: o.clientX,
                    startWidth: ot
                  }, o.currentTarget.setPointerCapture(o.pointerId);
                },
                onPointerMove: (o) => {
                  const d = ct.current;
                  (d == null ? void 0 : d.pointerId) === o.pointerId && o.currentTarget.hasPointerCapture(o.pointerId) && dr(
                    d.startWidth + d.startX - o.clientX
                  );
                },
                onPointerUp: () => {
                  ct.current = null;
                },
                onPointerCancel: () => {
                  ct.current = null;
                },
                onKeyDown: zn,
                onDoubleClick: () => dr(_r),
                children: /* @__PURE__ */ n("span", {})
              }
            ),
            /* @__PURE__ */ u("aside", { className: "dq-actions", children: [
              Ie.size > 0 && /* @__PURE__ */ n("strong", { children: jr }),
              N.actions.map((o, d) => {
                const y = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", b = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, $ = b != null ? R.find((J) => J.id === b) : void 0, F = b != null && !$;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    disabled: D || U || !!xe || y && !nt || "effect" in o && y && (!T || F) || ar(o) && (G == null ? void 0 : G.kind) !== "ready" || !Yn.length,
                    onClick: () => void gr(o),
                    children: [
                      /* @__PURE__ */ u("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: o.label }),
                        "effect" in o ? /* @__PURE__ */ n("small", { children: o.effect.mode === "SKIP" ? "Skip" : o.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : $ ? `Assign ${$.name}` : "Unavailable tag group" }) : o.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: o.steps.flatMap(
                          (J, de) => J.tagIds.map((Re, Qe) => {
                            const Le = Dt[Re] === void 0 ? "Tag" : Dt[Re] ?? "Unavailable tag", Rt = Jn(J, Le), jt = uo(J, Le);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": Bn(J.mode),
                                "aria-label": jt,
                                title: `Step ${de + 1}: ${jt}`,
                                children: Rt
                              },
                              `${de}-${Re}-${Qe}`
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
              !nt && /* @__PURE__ */ u("p", { children: [
                j === "tag" ? "Tag" : "Video",
                " write permission is required to apply actions."
              ] }),
              j === "tag" && k && /* @__PURE__ */ u("p", { children: [
                "Tag groups are unavailable. ",
                k
              ] }),
              D && /* @__PURE__ */ u("p", { role: "status", children: [
                /* @__PURE__ */ n(En, { className: "dq-spin" }),
                " Applying action to",
                " ",
                f,
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
                  ref: Ue,
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
                    value: ye,
                    onChange: (o) => Et(
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
                  "aria-label": oe === "asc" ? "Ascending" : "Descending",
                  title: oe === "asc" ? "Ascending" : "Descending",
                  onClick: () => $t(
                    (o) => o === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    Sn,
                    {
                      className: oe === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: Ct.map((o) => {
            const d = De[o.id], y = $e(o), b = y === "tag" ? "tag" : y === "performerOccurrence" ? "scene" : "video";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                disabled: D,
                onClick: () => Ut(o.id),
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
                        "aria-label": d === void 0 ? `Counting matching ${b}s` : d === null ? `Matching ${b} count unavailable` : `${d.toLocaleString()} matching ${d === 1 ? b : `${b}s`}`,
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
    Ne && bt && B && /* @__PURE__ */ n(
      bo,
      {
        video: bt,
        review: B,
        targetLabel: jr,
        pending: D,
        refreshing: U || !!xe,
        error: V,
        canWrite: S,
        assessmentReady: (G == null ? void 0 : G.kind) === "ready",
        selected: Ie.has(bt.id),
        hasPrevious: te.indexOf(bt.id) > 0,
        hasNext: te.indexOf(bt.id) >= 0 && te.indexOf(bt.id) < te.length - 1,
        onToggleSelected: () => Tt((o) => nr(o, bt.id)),
        onPrevious: () => pr(-1),
        onNext: () => pr(1),
        onClose: () => {
          Be(!1), ve(Pe.current);
        },
        onAction: gr
      }
    ),
    ae && /* @__PURE__ */ n(
      wo,
      {
        reviews: t,
        activeReview: Q,
        tagGroups: R,
        initialEdit: je,
        onSave: mr,
        onChoose: Ut,
        onEditWorkspace: (o) => {
          o !== le && Ut(o), dt((d) => d + 1), ut(!1);
        },
        onClose: () => {
          ut(!1), je && ve(Pe.current, !1);
        }
      }
    )
  ] });
  async function tr(o, d, y = !1) {
    const b = Pe.current, $ = Math.max(0, te.indexOf(b ?? -1));
    try {
      const J = (await yt(o, d, y)).items.map((Re) => Re.id);
      be(
        (Re) => new Set([...Re].filter((Qe) => J.includes(Qe)))
      );
      const de = Wr(J, b, $);
      H(de), we.current || ve(de, !1);
    } catch {
    }
  }
  function ri(o) {
    const d = ft.current;
    if (ft.current = null, D || U || !N || !Q) return;
    const y = d ?? N.view.objectFilter, b = kr(
      y,
      Q.view.objectFilter
    ) ? Q.view.objectFilter : y, $ = Me({ ...o, page: 1 }), F = {
      ...N,
      view: {
        ...N.view,
        filter: $,
        objectFilter: b
      }
    }, J = qt(F) !== qt(Q), de = J ? F : Q;
    Ce(J ? F : null), M(J ? "" : "Review queue defaults restored."), tr(de, $, !0);
  }
  function ni() {
    if (D || U || !Q) return;
    ft.current = null;
    const o = Me({
      ...Q.view.filter,
      page: 1
    });
    Ce(null), M("Review queue defaults restored."), tr(
      Q,
      o,
      Q.view.startFrom !== "beginning"
    );
  }
  function ii() {
    D || U || !N || !Q || !ne || mr(
      t.map(
        (o) => o.id === le ? {
          ...o,
          view: {
            ...N.view,
            filter: { ...Z, page: 1 }
          }
        } : o
      )
    ).then(() => {
      Ce(null), M("Queue saved to this review.");
    }).catch(
      (o) => Fe(
        o instanceof Error ? o.message : "Could not save queue."
      )
    );
  }
  function oi() {
    be(/* @__PURE__ */ new Set()), Oe.current.clear(), H(null);
  }
  function Kr(o) {
    return N ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: D || U,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          mn,
          {
            filter: {
              ...Z,
              page: Number(Z.page) || 1,
              perPage: Number(Z.perPage) || 40
            },
            totalCount: qe.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${o}`,
            onFilterChange: (d) => {
              D || U || d.page === Number(Z.page) || po(
                { ...Z, page: d.page },
                N,
                yt,
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
          displayMode: Ae === "list" ? "list" : "grid",
          focused: y.id === ie,
          selected: Ie.has(y.id),
          setRef: (b) => {
            b ? st.current.set(y.id, b) : st.current.delete(y.id);
          },
          onFocus: () => H(y.id),
          onToggle: () => Tt((b) => nr(b, y.id)),
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
        video: no(d, B, He.ids),
        displayMode: Ae,
        focused: d.id === ie,
        selected: Ie.has(d.id),
        setRef: (y) => {
          y ? st.current.set(d.id, y) : st.current.delete(d.id);
        },
        onFocus: () => H(d.id),
        onToggle: () => Tt((y) => nr(y, d.id)),
        onPreview: () => {
          H(d.id), Be(!0);
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
function nr(e, t) {
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
  onOpen: p,
  onNavigate: m
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
          onClick: p,
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
        /* @__PURE__ */ n("button", { type: "button", className: "dq-tag-list-name", onClick: p, children: e.name }),
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
  onPreview: p,
  onNavigate: m
}) {
  const h = Kn(e), S = P(null), E = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, w = !!(E.date || E.studioName), I = !!(E.performers.length || E.tags.length);
  return pn(() => {
    const T = S.current;
    if (!T) return;
    const A = T.querySelector(
      `a[href="/video/${e.id}"]`
    ), R = T.querySelector(".card-title"), W = `dq-card-title-${e.id}`;
    R && (R.id = W), A && (A.target = "_blank", A.rel = "noreferrer", A.removeAttribute("aria-label"), A.setAttribute("aria-labelledby", W), A.classList.add("dq-card-link"));
    const k = T.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    k && k.setAttribute(
      "aria-label",
      i ? `Deselect ${h}` : `Select ${h}`
    );
    const X = T.querySelector(
      'button[title="Quick View"]'
    );
    X && X.setAttribute("aria-label", `Preview ${h}`);
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
      className: `dq-review-card relative h-full ${t} ${w ? "has-card-metadata" : "no-card-metadata"} ${I ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          ui,
          {
            video: E,
            selected: i,
            onSelect: s,
            onNavigate: m,
            onQuickView: p,
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
  const t = P(null), r = P(null), [i, a] = C(!1), [l, s] = C(!1), [p, m] = C(!1);
  return K(() => {
    const h = t.current;
    if (!h || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      a(!0), s(!0);
      return;
    }
    const S = new IntersectionObserver(
      ([w]) => a(w.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), E = new IntersectionObserver(
      ([w]) => s(w.isIntersecting && w.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return S.observe(h), E.observe(h), () => {
      S.disconnect(), E.disconnect();
    };
  }, [e.id, e.files.length]), K(() => {
    if (!i) {
      m(!1);
      return;
    }
    const h = new AbortController();
    return _(xi(e.id), {
      signal: h.signal
    }).then((S) => {
      h.signal.aborted || m(S.available === !0);
    }).catch(() => {
      h.signal.aborted || m(!1);
    }), () => h.abort();
  }, [i, e.id]), K(() => {
    const h = r.current;
    h && (l ? Promise.resolve(h.play()).catch(() => {
    }) : h.pause());
  }, [p, l]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: p && /* @__PURE__ */ n(
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
  assessmentReady: p,
  selected: m,
  hasPrevious: h,
  hasNext: S,
  onToggleSelected: E,
  onPrevious: w,
  onNext: I,
  onClose: T,
  onAction: A
}) {
  const R = P(null), W = P(null), k = e.files[0], X = Kn(e);
  K(() => {
    var O;
    const g = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (O = R.current) == null || O.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = g;
    };
  }, []);
  function ne(g) {
    var L, Y, Ee;
    if (g.key !== "Tab") return;
    const O = [
      ...((L = R.current) == null ? void 0 : L.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((he) => he.offsetParent !== null);
    if (!O.length) {
      g.preventDefault(), (Y = R.current) == null || Y.focus();
      return;
    }
    const v = O.indexOf(
      document.activeElement
    );
    g.shiftKey && v <= 0 ? (g.preventDefault(), (Ee = O.at(-1)) == null || Ee.focus()) : !g.shiftKey && v === O.length - 1 && (g.preventDefault(), O[0].focus());
  }
  function ce(g) {
    if (g.defaultPrevented || g.ctrlKey || g.metaKey || g.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const O = g.key === "ArrowLeft" || g.key === "ArrowRight";
    if (g.altKey && !O) return;
    const v = W.current, L = g.currentTarget.querySelector("video");
    if (g.key === "Enter" || g.key === "Escape")
      g.repeat || T();
    else if (g.key === " " && v)
      g.repeat || v.toggle();
    else if (O && v)
      v.seekBy(
        (g.key === "ArrowLeft" ? -1 : 1) * (g.shiftKey ? 5 : g.altKey ? 10 : 60)
      );
    else if ((g.key === "," || g.key === ".") && v) {
      const Y = [k == null ? void 0 : k.duration, L == null ? void 0 : L.duration].find(
        (he) => he != null && Number.isFinite(he) && he > 0
      ) ?? 0, Ee = e.parentVideoId != null ? (e.clipEndSec ?? Y) - (e.clipStartSec ?? 0) : Y;
      Number.isFinite(Ee) && Ee > 0 && v.seekBy((g.key === "," ? -1 : 1) * Ee * 0.1);
    } else if (g.key.toLowerCase() === "n" || g.key.toLowerCase() === "m")
      !g.repeat && !i && !a && (g.key.toLowerCase() === "n" && h && w(), g.key.toLowerCase() === "m" && S && I());
    else if (g.key === "ArrowUp" && L)
      L.volume = Math.min(1, L.volume + 0.1);
    else if (g.key === "ArrowDown" && L)
      L.volume = Math.max(0, L.volume - 0.1);
    else return;
    _e(g);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: R,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${X}`,
      className: "dq-preview",
      onKeyDown: ne,
      onKeyDownCapture: ce,
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
              onClick: w,
              children: /* @__PURE__ */ n(wn, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !S || i || a,
              onClick: I,
              children: /* @__PURE__ */ n(Sn, {})
            }
          ),
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: X }),
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
              "aria-label": `Open ${X} details in new tab`,
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
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: k ? /* @__PURE__ */ n(
          hn,
          {
            autostart: !0,
            streamUrl: Pn(e.id),
            posterUrl: Zr(e),
            format: k.format,
            audioCodec: k.audioCodec,
            duration: k.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (g) => (W.current = g, () => {
              W.current === g && (W.current = null);
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
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((g, O) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: i || a || g.steps.length > 0 && !s || ar(g) && !p,
            onClick: () => void A(g),
            children: [
              lt(g, O) && /* @__PURE__ */ n("kbd", { children: lt(g, O) }),
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
  onClose: p
}) {
  const [m, h] = C(
    () => i && t ? structuredClone(t) : null
  ), [S, E] = C(""), [w, I] = C(!1), [T, A] = C(
    i && t != null
  ), R = P(null);
  K(() => {
    var v, L;
    const g = document.activeElement, O = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (L = (v = R.current) == null ? void 0 : v.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || L.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = O, g == null || g.focus({ preventScroll: !0 });
    };
  }, []);
  function W(g) {
    var L, Y, Ee;
    if (g.defaultPrevented) {
      g.stopPropagation();
      return;
    }
    if (g.key === "Escape") {
      _e(g), w || p();
      return;
    }
    if (g.key !== "Tab") {
      g.stopPropagation();
      return;
    }
    const O = [
      ...((L = R.current) == null ? void 0 : L.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((he) => he.offsetParent !== null);
    if (!O.length) {
      _e(g), (Y = R.current) == null || Y.focus();
      return;
    }
    const v = O.indexOf(
      document.activeElement
    );
    g.shiftKey && v <= 0 ? (_e(g), (Ee = O.at(-1)) == null || Ee.focus()) : !g.shiftKey && v === O.length - 1 ? (_e(g), O[0].focus()) : g.stopPropagation();
  }
  function k(g, O = !!g) {
    A(O), h(
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
  async function X() {
    if (w) return;
    if (!m || or(m)) {
      E(m ? or(m) : "Choose a review.");
      return;
    }
    const g = { ...m, name: m.name.trim() }, O = e.some((v) => v.id === g.id) ? e.map((v) => v.id === g.id ? g : v) : [...e, g];
    I(!0), E("");
    try {
      if (!await l(O)) throw new Error("Could not save reviews.");
      g.entityType !== "tag" ? a(g.id) : (s(g.id), p());
    } catch (v) {
      E(
        "Could not save reviews. Your edits are still open. " + (v instanceof Error ? v.message : "Retry saving.")
      );
    } finally {
      I(!1);
    }
  }
  async function ne(g) {
    if (!w) {
      I(!0), E("");
      try {
        if (!await l(g)) throw new Error("Could not save reviews.");
      } catch (O) {
        E(
          O instanceof Error ? O.message : "Could not save reviews."
        );
      } finally {
        I(!1);
      }
    }
  }
  async function ce(g) {
    var v;
    if (w) return;
    const O = (v = g.target.files) == null ? void 0 : v[0];
    if (g.target.value = "", !!O) {
      if (O.size > 2e6) {
        E("Review files must be smaller than 2 MB.");
        return;
      }
      I(!0), E("");
      try {
        const L = Jt(await O.text());
        if (!await l(Nr(e, L)))
          throw new Error("Could not save reviews.");
      } catch (L) {
        E(
          L instanceof Error ? L.message : "Could not import reviews."
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
      onKeyDown: W,
      children: /* @__PURE__ */ u("div", { className: "dq-manager", children: [
        /* @__PURE__ */ u("header", { children: [
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: m ? e.some((g) => g.id === m.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: w,
              onClick: p,
              children: /* @__PURE__ */ n(Cn, {})
            }
          )
        ] }),
        S && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: S }),
        /* @__PURE__ */ n("fieldset", { disabled: w, className: "dq-manager-content", children: m ? /* @__PURE__ */ n(
          Qn,
          {
            setup: m.entityType !== "tag",
            draft: m,
            entityTypeLocked: T,
            tagGroups: r,
            saving: w,
            setDraft: h,
            onSave: () => void X(),
            onCancel: p
          }
        ) : /* @__PURE__ */ u(ke, { children: [
          /* @__PURE__ */ u("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: () => {
              const g = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), O = document.createElement("a");
              O.href = g, O.download = "data-quality-reviews.json", O.click(), URL.revokeObjectURL(g);
            }, children: "Export reviews" }),
            /* @__PURE__ */ u(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => k(),
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
                  onChange: ce
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((g) => /* @__PURE__ */ u("article", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ u("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(jn, { entityType: $e(g) }),
                /* @__PURE__ */ n("strong", { children: g.name })
              ] }),
              /* @__PURE__ */ n("p", { children: g.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => g.entityType === "tag" ? k(g) : a(g.id), children: [
              /* @__PURE__ */ n(vn, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => k({
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
                    e.filter((O) => O.id !== g.id)
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
  onSave: p,
  onCancel: m
}) {
  const [h, S] = C("Review"), E = $e(r), w = (A) => {
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
  }, I = P(/* @__PURE__ */ new WeakMap()), T = (A) => {
    let R = I.current.get(A);
    return R || (R = crypto.randomUUID(), I.current.set(A, R)), R;
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
              onChange: (A) => w(A.target.value),
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
          rememberStepKey: (A, R) => I.current.set(A, T(R)),
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
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: m, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: p, children: t ? "Create & configure" : "Save review" })
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
  const l = (s, p) => a({
    ...e,
    actions: e.actions.map(
      (m, h) => h === s ? p : m
    )
  });
  return /* @__PURE__ */ u(ke, { children: [
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
        renderItem: (s, { index: p, dragHandleProps: m, isOver: h }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: h ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ u("legend", { children: [
                "Action ",
                p + 1
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...m,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${p + 1}`,
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
                        ...e.actions.slice(0, p + 1),
                        {
                          ...structuredClone(s),
                          id: crypto.randomUUID(),
                          label: s.label + " copy"
                        },
                        ...e.actions.slice(p + 1)
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
                  onChange: (S) => l(p, S)
                }
              ),
              /* @__PURE__ */ n(
                Sr,
                {
                  items: s.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (S) => l(p, { ...s, steps: S }),
                  renderItem: (S, E) => /* @__PURE__ */ n(
                    Eo,
                    {
                      occurrence: e.entityType === "performerOccurrence",
                      dragHandleProps: E.dragHandleProps,
                      saving: t,
                      isOver: E.isOver,
                      step: S,
                      index: E.index,
                      onChange: (w) => {
                        i(w, S), l(p, {
                          ...s,
                          steps: s.steps.map(
                            (I, T) => T === E.index ? w : I
                          )
                        });
                      },
                      onRemove: () => l(p, {
                        ...s,
                        steps: s.steps.filter(
                          (w, I) => I !== E.index
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
                    onClick: () => l(p, {
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
                        (S, E) => E !== p
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
      (p, m) => m === l ? s : p
    )
  });
  return /* @__PURE__ */ u(ke, { children: [
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
        renderItem: (l, { index: s, dragHandleProps: p, isOver: m }) => /* @__PURE__ */ u(
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
                    ...p,
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
  onRemove: p
}) {
  const m = Bn(t.mode);
  return /* @__PURE__ */ u(
    "div",
    {
      className: l ? "dq-action-step dq-drag-over" : "dq-action-step",
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
              !e && /* @__PURE__ */ u(ke, { children: [
                /* @__PURE__ */ n("option", { value: "MARK_PRESENT", children: "Mark present" }),
                /* @__PURE__ */ n("option", { value: "MARK_ABSENT", children: "Mark absent" }),
                /* @__PURE__ */ n("option", { value: "CLEAR_ABSENCE", children: "Clear absence" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ n("div", { className: "dq-step-tags", children: /* @__PURE__ */ n(
          tt,
          {
            entityType: "tag",
            values: t.tagIds,
            onChange: (h) => s({ ...t, tagIds: h }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: p, children: /* @__PURE__ */ n(Nn, {}) })
      ]
    }
  );
}
async function Co() {
  const e = await _("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
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
  kr as objectFiltersEqual
};
