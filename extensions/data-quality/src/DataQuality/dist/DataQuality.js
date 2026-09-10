import { jsxs as u, jsx as n, Fragment as Ee } from "react/jsx-runtime";
import { useRef as F, useState as N, useEffect as K, useMemo as mt, useCallback as Ze, useLayoutEffect as fn } from "react";
import { DetailListToolbar as dr, VIDEO_SORT_OPTIONS as Cr, VIDEO_CRITERIA as Gt, EntityReferenceMultiSelector as _e, PERFORMER_CRITERIA as Jr, FilterDialog as pn, DetailListPagination as gn, VideoPlayer as mn, TAG_SORT_OPTIONS as hn, TAG_CRITERIA as yn, TagTile as li, VideoCard as di, EntityDetailTabs as ui, SortableList as ur } from "@cove/runtime/components";
import { ChevronLeft as bn, Pencil as wn, Settings as fi, AlertTriangle as fr, Save as pi, RotateCcw as gi, ChevronRight as vn, Film as pr, Loader2 as Sn, Tags as mi, ExternalLink as hi, X as En, Plus as yi, Upload as bi, Trash2 as Cn, GripVertical as Nr } from "@cove/runtime/lucide-react";
import { extensionFetch as wi } from "@cove/runtime/api";
function Se(e) {
  return e.entityType ?? "video";
}
function et(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function gr(e) {
  if (e.entityType === "performerOccurrence") {
    if (!An(e.occurrence))
      return "Complete the optional occurrence condition before saving.";
    if (e.actions.some((r) => r.steps.some((i) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(i.mode))))
      return "Occurrence actions support adding and removing tags on the active performer. Video tag assessments are not supported here.";
  }
  if (Se(e) === "video" && e.actions.some(
    (r) => Nn(r)
  ))
    return "An action cannot contain contradictory assessments for the same tag.";
  if (!e.name.trim() || !e.actions.every((r) => yt(r, Se(e))))
    return "Name the review and complete every action step before saving.";
  if (new Set(e.actions.map((r) => r.id)).size !== e.actions.length)
    return "Action IDs must be unique within a review.";
  const t = e.actions.map(
    (r, i) => r.shortcut ?? (i < 9 ? String(i + 1) : "")
  ).filter(Boolean);
  return t.some((r) => !/^[1-9]$/.test(r)) || new Set(t).size !== t.length ? "Assign each shortcut 1–9 only once, or choose None. Navigation and player keys are reserved." : "";
}
function be(e) {
  const t = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(1e3, t(e.perPage, 40)))
  };
}
function Qr(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function pt(e) {
  const { page: t, ...r } = e.view.filter, i = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    e.entityType === "performerOccurrence" ? ["performerOccurrence", ...i, e.occurrence] : Se(e) === "tag" ? ["tag", ...i] : i
  );
}
function yt(e, t) {
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
  ) && !Nn(e) : !1;
}
function Bt(e) {
  return "steps" in e ? e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  ) : !1;
}
function Nn(e) {
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
function Tt(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || r.entityType === "video" || r.entityType === "tag" || r.entityType === "performerOccurrence") && (r.entityType !== "performerOccurrence" || An(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && vi(r.presentation, r.entityType === "tag") && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (r.entityType === "tag" ? "effect" in i && !("steps" in i) && yt(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (a) => a && Array.isArray(a.tagIds)
      ) && yt(i, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => gr(r)))
    throw new Error(
      "Saved reviews contain invalid actions or shortcuts. Existing data has been kept; assign shortcuts 1–9 only once or leave them empty."
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
function mr(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const a of i)
      r.has(a.id) || (r.add(a.id), t.push(a));
  return t;
}
function An(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (i) => Array.isArray(i) && i.every((a) => Number.isSafeInteger(a) && a > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && (t.targetMode !== "selected" || t.performerIds.length > 0) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && ["any", "includes", "includesAll", "excludes", "isNull"].includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && r(t.tagIds) && typeof t.multiple == "boolean";
}
function Wr(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function zr(e, t, r, i) {
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
function Si(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((a) => r.has(a));
  for (const a of t)
    i ? r.delete(a) : r.add(a);
  return r;
}
function Tn(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const Rn = "ext:com.midnightrider.data-quality:configuration", Ei = "ext:cove-data-quality:video-reviews", hr = "ext:com.midnightrider.data-quality:progress", Rt = /* @__PURE__ */ new Map(), jt = /* @__PURE__ */ new Map(), gt = (e, t) => e.includes("*") || e.includes(t), Jt = (e) => L(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Ci = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function yr(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function ht(e) {
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
    reviews: Tt(JSON.stringify(t.reviews)),
    deletedIds: yr(t.deletedIds),
    importedIds: yr(t.importedIds)
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
    const c = localStorage.getItem(a);
    if (c !== null) {
      const s = Tt(c);
      r ?? (r = s), s.forEach((f) => i.add(f.id));
    }
    yr(
      JSON.parse(localStorage.getItem(`${a}:account-imports`) ?? "[]")
    ).forEach((s) => i.add(s));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function In(e) {
  const t = await L("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function qn(e, t) {
  const r = (jt.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return jt.set(e, r), r.finally(() => {
    jt.get(e) === r && jt.delete(e);
  }).catch(() => {
  }), r;
}
let Nt = null;
function Ai() {
  if (Nt) return Nt;
  const e = Ti();
  return Nt = e, e.finally(() => {
    Nt === e && (Nt = null);
  }).catch(() => {
  }), e;
}
async function Ti() {
  var b;
  const e = await L("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = gt(e.permissions, "savedfilters.read"), a = i && gt(e.permissions, "savedfilters.write"), c = i ? (await Jt(Rn)).filter((A) => A.name === "Data Quality configuration").sort((A, y) => A.id - y.id) : [];
  if (c.length > 1) {
    const A = (y) => {
      const { revision: P, ...U } = ht(y.uiOptions);
      return JSON.stringify(U);
    };
    if (c.some((y) => A(y) !== A(c[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (a)
      for (const y of c.slice(1))
        await L(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    c.splice(1);
  }
  let s = c.length ? ht(c[0].uiOptions) : Ci();
  const f = localStorage.getItem(`${r}:migrated`) === "true", m = localStorage.getItem(r), g = localStorage.getItem(`${r}:local-only`) === "true";
  !c.length && m && (s = ht(m));
  let S = !c.length;
  if (c.length && g && m) {
    const A = ht(m);
    if (A.reviews.some((P) => {
      const U = s.reviews.find((B) => B.id === P.id);
      return U && JSON.stringify(U) !== JSON.stringify(P);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const y = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...A.deletedIds])
    ];
    s = {
      ...s,
      reviews: mr(s.reviews, A.reviews).filter(
        (P) => !y.includes(P.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...A.importedIds])
      ]
    }, S = !0;
  }
  if (!f) {
    const A = JSON.stringify(s), y = Ni(t);
    if (c.length && y.reviews.some((I) => {
      const te = s.reviews.find((J) => J.id === I.id);
      return te && JSON.stringify(te) !== JSON.stringify(I);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const P = i ? (await Jt(Ei)).flatMap(
      (I) => Tt(I.uiOptions ?? "[]")
    ) : [], U = y.known.filter(
      (I) => !y.reviews.some((te) => te.id === I)
    ), B = /* @__PURE__ */ new Set([...s.deletedIds, ...U]);
    s = {
      ...s,
      reviews: mr(
        y.reviews,
        s.reviews,
        P.filter(
          (I) => !y.known.includes(I.id) && !s.importedIds.includes(I.id)
        )
      ).filter((I) => !B.has(I.id)),
      deletedIds: [...B],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...y.known,
          ...P.map((I) => I.id)
        ])
      ]
    }, S || (S = JSON.stringify(s) !== A);
  }
  const E = {
    userId: t,
    recordId: (b = c[0]) == null ? void 0 : b.id,
    config: s,
    readable: i,
    writable: a,
    durable: a
  };
  if (Rt.set(r, E), S && a) {
    const A = s;
    c.length && (E.config = ht(c[0].uiOptions)), await On(r, A), s = E.config;
  } else c.length || (localStorage.setItem(r, JSON.stringify(s)), !i && (!f || g) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (a)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: s.reviews,
    storageKey: r,
    canWrite: gt(e.permissions, "videos.write"),
    canWriteVideos: gt(e.permissions, "videos.write"),
    canWriteTags: gt(e.permissions, "tags.write"),
    canReadTagGroups: gt(e.permissions, "taggroups.read"),
    canConfigure: !i || a,
    storageNotice: i ? a ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function On(e, t) {
  const r = Rt.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await In(r), r.recordId != null) {
      const c = await L(
        `/api/savedfilters/${r.recordId}`
      );
      if (ht(c.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const a = await L(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Rn,
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
  return Tt(JSON.stringify(t)), qn(e, async () => {
    const r = Rt.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((a) => !t.some((c) => c.id === a.id)).map((a) => a.id);
    await On(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((a) => !t.some((c) => c.id === a))
    });
  });
}
function Hr(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([r, i]) => /^[1-9]\d*:[1-9]\d*$/.test(r) && ["reviewed", "cannotDetermine"].includes(String(i)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Ii(e, t) {
  const r = Rt.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), a = i ? Hr(i) : null;
  if (!r.readable) return a;
  const c = (await Jt(hr)).find(
    (f) => f.name === t
  ), s = c ? Hr(c.uiOptions) : null;
  return a && (!s || a.updatedAt > s.updatedAt) ? a : s;
}
function qi(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return qn(i, async () => {
    const a = Rt.get(e);
    if (!(a != null && a.writable)) return;
    await In(a);
    const c = (await Jt(hr)).find(
      (s) => s.name === t
    );
    await L(
      c ? `/api/savedfilters/${c.id}` : "/api/savedfilters",
      {
        method: c ? "PUT" : "POST",
        body: JSON.stringify({
          mode: hr,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const De = "confirmed_absent_tags", Ar = "Confirmed absent tags", Oi = {
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
function bt(e) {
  return Array.isArray(e) ? e.map(bt) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? Oi[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === De.toLowerCase() ? r.toLowerCase() : bt(r)
    ])
  ) : e;
}
async function L(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await wi(e, { ...t, headers: r });
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
const ki = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Pi = 0;
function Wt(e) {
  return L(`/api/videos/${e}?dqRead=${ki}-${++Pi}`, { cache: "no-store" });
}
async function At(e, t, r) {
  const i = { ...e.view.objectFilter }, a = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return L("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      bt({
        findFilter: be(t),
        objectFilter: i,
        filterExpression: a
      })
    )
  });
}
async function Xr(e, t, r) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, L("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      bt({
        findFilter: be(t),
        objectFilter: i
      })
    )
  });
}
function Mi(e) {
  return L("/api/taggroups", { signal: e });
}
function Fi(e) {
  return `/api/videos/${e.id}/image?max=1280&v=${encodeURIComponent(e.updatedAt)}`;
}
function kn(e) {
  return `/api/stream/video/${e}`;
}
function Yr(e) {
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
async function It(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await L(`/api/tags/${r}`), t.add(r);
    for (let i = 1; ; i++) {
      const a = await L("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          bt({
            findFilter: { page: i, perPage: 1e3, sort: "id", direction: "asc" },
            objectFilter: {
              parentsCriterion: {
                value: [r],
                modifier: "INCLUDES",
                depth: -1
              }
            }
          })
        )
      });
      for (const c of a.items) t.add(c.id);
      if (i * 1e3 >= a.totalCount) break;
      if (!a.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...t];
}
function _i(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${De} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function Tr() {
  const t = (await L("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === De.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${Ar} custom field before applying tag assessments.`
    };
  const r = _i(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function Di() {
  const e = await Tr();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await L("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: De,
        label: Ar,
        type: "tag",
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function Qt(e) {
  return [...new Set(e)];
}
function Ui(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${De} value is not a valid tag list.`
    );
  return Qt(e);
}
function ji(e) {
  return Qt(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function Ki(e, t) {
  let r;
  try {
    r = await Tr();
  } catch (g) {
    throw new Error(
      `Could not verify the ${Ar} custom field. ${g instanceof Error ? g.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const i = await Promise.all(
    e.steps.map(async (g) => ({
      ...g,
      tagIds: g.mode === "REMOVE_TREE" ? await It(g.tagIds) : Qt(g.tagIds)
    }))
  ), a = i.filter(
    (g) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(g.mode)
  ), c = i.filter(
    (g) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(g.mode)
  ), s = Qt(t), f = r.definition.key;
  let m = 0;
  for (const g of s)
    try {
      const S = await Wt(g), E = ji(S), b = { ...S.customFields ?? {} }, A = b[f], y = Ui(A), P = new Set(E), U = new Set(y);
      for (const J of a)
        for (const T of J.tagIds)
          J.mode === "ADD" ? P.add(T) : P.delete(T);
      for (const J of c)
        for (const T of J.tagIds)
          J.mode === "MARK_PRESENT" ? (P.add(T), U.delete(T)) : J.mode === "MARK_ABSENT" ? (P.delete(T), U.add(T)) : U.delete(T);
      const B = [...P], I = [...U];
      JSON.stringify(E) === JSON.stringify(B) && JSON.stringify(y) === JSON.stringify(I) && (A === void 0 ? I.length === 0 : JSON.stringify(A) === JSON.stringify(y)) || await L(`/api/videos/${g}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: B,
          customFields: {
            ...b,
            [f]: I
          }
        })
      }), m++;
    } catch (S) {
      throw new Error(
        `Assessment stopped after ${m} video${m === 1 ? "" : "s"} completed; video ${g} was affected. Refresh and inspect it before retrying. ${S instanceof Error ? S.message : "Request failed."}`
      );
    }
}
async function Pn(e, t) {
  if (!yt(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (Bt(e)) {
    await Ki(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (i) => ({
      mode: i.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: i.mode === "REMOVE_TREE" ? await It(i.tagIds) : i.tagIds
    }))
  );
  for (let i = 0; i < r.length; i++)
    try {
      await L("/api/videos/bulk", {
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
  if (!yt(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await L("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
async function Gi(e, t, r) {
  if (!yt(r) || r.steps.some(
    (c) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(c.mode)
  ))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const i = await Promise.all(
    r.steps.map(async (c) => ({
      ...c,
      tagIds: c.mode === "REMOVE_TREE" ? await It(c.tagIds) : c.tagIds
    }))
  );
  let a = t.applications;
  for (const c of i)
    a = await $n(
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
async function Mn(e, t) {
  const r = e.occurrence;
  if (r.targetMode === "all" || r.targetMode === "filter" && Object.keys(r.performerFilter).length === 0) return null;
  if (r.targetMode === "selected") return r.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: a, ...c } = r.performerFilter;
  for (let s = 1; ; s++) {
    const f = await L("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        bt({
          findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: c,
          filterExpression: a
        })
      )
    });
    if (f.items.forEach((m) => i.add(m.id)), s * 1e3 >= f.totalCount) return [...i];
    if (!f.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Fn(e, t) {
  const { _filterExpression: r, ...i } = e.view.objectFilter, a = e.occurrence, c = {
    mode: "atLeastOne",
    conditionOperator: "and",
    ...t === null ? {} : {
      performerIdsCriterion: { modifier: "includes", value: t }
    },
    ...a.condition === "any" ? {} : {
      performerOccurrenceTagsCriterion: {
        modifier: a.condition,
        value: a.conditionTagIds
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
function Bi(e, t) {
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
async function Ji(e, t, r, i) {
  if ((t == null ? void 0 : t.length) === 0)
    return { items: [], totalCount: 0 };
  const a = await At(
    Fn(e, t),
    { ...e.view.filter, page: r },
    i
  ), c = t === null ? null : new Set(t), s = new Array(a.items.length);
  let f = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, a.items.length) }, async () => {
      for (; f < a.items.length; ) {
        const m = f++, g = a.items[m], S = await L(
          `/api/tagapplications?hostType=video&hostId=${g.id}&contextType=performer`,
          { signal: i }
        );
        s[m] = g.performers.filter((E) => c === null || c.has(E.id)).flatMap((E) => {
          const b = S.filter(
            (A) => A.hostType === "video" && A.hostId === g.id && A.contextType === "performer" && A.contextId === E.id
          );
          return Bi(
            e.occurrence,
            b.map((A) => A.tag.id)
          ) ? [
            {
              key: `${g.id}:${E.id}`,
              video: g,
              performer: E,
              applications: b
            }
          ] : [];
        });
      }
    })
  ), { items: s.flat(), totalCount: a.totalCount };
}
async function $n(e, t, r) {
  const i = new Set(e.occurrence.tagIds);
  if (r.some((m) => !i.has(m)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const a = await Wt(t.video.id);
  if (!a.performers.some(
    (m) => m.id === t.performer.id
  ))
    throw new Error(
      "This performer is no longer linked to the scene. Refresh the queue."
    );
  const c = `/api/tagapplications?hostType=video&hostId=${a.id}&contextType=performer&contextId=${t.performer.id}`, s = (await L(c)).filter(
    (m) => m.hostType === "video" && m.hostId === a.id && m.contextType === "performer" && m.contextId === t.performer.id
  ), f = new Set(r);
  try {
    for (const m of f)
      s.some((g) => g.tag.id === m) || await L("/api/tagapplications", {
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
      i.has(m.tag.id) && !f.has(m.tag.id) && await L(`/api/tagapplications/${m.id}`, {
        method: "DELETE"
      });
    return await L(c);
  } catch (m) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${m instanceof Error ? m.message : "Request failed."}`
    );
  }
}
const Rr = [
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
  conditionTagIds: []
};
function br(e) {
  const t = e.entityType === "performerOccurrence" ? e.occurrence : void 0;
  return {
    filter: be({
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
function Zr(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function en(e, t) {
  if (!Rr.some((s) => t.has(s))) {
    const s = br(e);
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
      const m = f.lastIndexOf(":");
      return { key: f.slice(0, m), direction: f.slice(m + 1) };
    });
    if (s.some((f) => !f.key || !["asc", "desc"].includes(f.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = s, i.sort = s[0].key, i.direction = s[0].direction;
  }
  let a;
  if (e.entityType === "performerOccurrence" && (a = {
    ...Qi,
    ...Zr(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(a.targetMode) || !["any", "includes", "includesAll", "excludes", "isNull"].includes(
    a.condition
  ) || !Array.isArray(a.performerIds) || !Array.isArray(a.conditionTagIds) || [...a.performerIds, ...a.conditionTagIds].some(
    (s) => !Number.isSafeInteger(s) || s <= 0
  ) || !a.performerFilter || typeof a.performerFilter != "object" || Array.isArray(a.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const c = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: be(i),
      objectFilter: Zr(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: c,
      performerScope: a
    },
    startAtEnd: !t.has("page") && c === "end"
  };
}
function Kt(e, t) {
  const r = new URLSearchParams(window.location.search);
  Rr.forEach((i) => r.delete(i)), r.set("review", e);
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
function sr(e, t) {
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
function wr(e, t) {
  return {
    added: t.filter((r) => !e.includes(r)),
    removed: e.filter((r) => !t.includes(r))
  };
}
function Wi(e) {
  return `/api/tagapplications?hostType=video&hostId=${e.video.id}&contextType=performer&contextId=${e.occurrence.performer.id}`;
}
async function Le(e) {
  var c;
  if (e.occurrence) {
    const s = (await L(Wi(e))).filter(
      (f) => f.hostType === "video" && f.hostId === e.video.id && f.contextType === "performer" && f.contextId === e.occurrence.performer.id
    );
    return {
      ids: [...new Set(s.map((f) => f.tag.id))],
      names: [...new Set(s.map((f) => f.tag.name))],
      absent: [],
      applications: s
    };
  }
  const t = await Wt(e.video.id), r = (t.tags ?? []).filter(
    (s) => s.canRemove !== !1 || s.isDerived !== !0
  ), i = Object.keys(t.customFields ?? {}).find(
    (s) => s.toLowerCase() === De
  ) ?? De, a = ((c = t.customFields) == null ? void 0 : c[i]) ?? [];
  if (!Array.isArray(a) || a.some((s) => !Number.isSafeInteger(s)))
    throw new Error(
      "Confirmed absent tags are invalid. Inspect the video before editing."
    );
  return { ids: r.map((s) => s.id), names: r.map((s) => s.name), absent: a };
}
async function xn(e, t, r) {
  if (t.occurrence && e.entityType === "performerOccurrence")
    await $n(
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
      a.length && await L("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({ ids: [t.video.id], tagMode: i, tagIds: a })
      });
}
async function zi(e, t, r) {
  t.occurrence && e.entityType === "performerOccurrence" ? await Gi(e, t.occurrence, r) : await Pn(r, [t.video.id]);
}
async function Hi(e) {
  return [
    ...new Set(
      (await Promise.all(
        e.steps.map(
          (t) => t.mode === "REMOVE_TREE" ? It(t.tagIds) : t.tagIds
        )
      )).flat()
    )
  ];
}
function Xi(e, t, r, i) {
  const a = (c) => c.filter((s) => i.includes(s));
  return {
    item: e,
    before: t,
    after: r,
    tags: wr(a(t.ids), a(r.ids)),
    absence: wr(a(t.absent), a(r.absent))
  };
}
function tn(e, t) {
  var r;
  for (const [i, a] of [
    [e.tags, t.ids],
    [e.absence, t.absent]
  ])
    if (i.added.some((c) => !a.includes(c)) || i.removed.some((c) => a.includes(c)))
      throw new Error(
        "Undo conflict: affected tags changed since this operation. Inspect the item; no undo changes were made."
      );
  if (t.applications)
    for (const i of e.tags.added) {
      const a = (r = e.after.applications) == null ? void 0 : r.filter((s) => s.tag.id === i).map((s) => s.id).sort(), c = t.applications.filter((s) => s.tag.id === i).map((s) => s.id).sort();
      if (JSON.stringify(a) !== JSON.stringify(c))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
async function Yi(e, t) {
  const r = await Le(t.item);
  if (tn(t, r), t.absence.added.length || t.absence.removed.length) {
    const i = await Wt(t.item.video.id), a = await Le(t.item), c = Object.keys(i.customFields ?? {}).find(
      (s) => s.toLowerCase() === De
    ) ?? De;
    tn(t, a), await L(`/api/videos/${i.id}`, {
      method: "PUT",
      body: JSON.stringify({
        tagIds: [
          ...a.ids.filter((s) => !t.tags.added.includes(s)),
          ...t.tags.removed
        ],
        customFields: {
          ...i.customFields,
          [c]: [
            ...a.absent.filter(
              (s) => !t.absence.added.includes(s)
            ),
            ...t.absence.removed
          ]
        }
      })
    });
  } else
    await xn(e, t.item, {
      added: t.tags.removed,
      removed: t.tags.added
    });
}
const Zi = {
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
function Ir(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function eo(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function Ln(e) {
  return [
    ...new Set(
      Ir(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function _n(e, t) {
  const r = Ir(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((i) => {
      const a = String(i.key ?? ""), c = Zi[String(i.modifier ?? "EQUALS")], s = (E, b) => String(b ?? "").trim() || t[String(E)] || String(E ?? ""), f = s(
        i.value,
        i.displayValue
      ), m = s(
        i.value2,
        i.displayValue2
      ), g = String(i.modifier ?? "EQUALS"), S = g === "IS_NULL" || g === "NOT_NULL" ? [] : g === "BETWEEN" || g === "NOT_BETWEEN" ? [f, "and", m] : [f];
      return {
        ...i,
        label: [eo(a), c, ...S].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function Dn(e) {
  const t = Ir(e.customFieldCriteria);
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
function rn({
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
function cr(e, t) {
  if (!t) return e;
  const r = /* @__PURE__ */ new Map();
  for (const i of e)
    r.set(i.video.id, [...r.get(i.video.id) ?? [], i]);
  return [...r.values()].reverse().flat();
}
const qe = (e) => e instanceof Error ? e.message : "Request failed.";
function to({
  actions: e,
  disabled: t,
  canWrite: r,
  onApply: i
}) {
  const [a, c] = N({});
  K(() => {
    let f = !0;
    return Promise.all(
      [
        ...new Set(
          e.flatMap(
            (m) => m.steps.flatMap((g) => g.tagIds)
          )
        )
      ].map(async (m) => {
        try {
          return [
            m,
            (await L(`/api/tags/${m}`)).name
          ];
        } catch {
          return [m, "Unavailable tag"];
        }
      })
    ).then((m) => {
      f && c(Object.fromEntries(m));
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
    e.map((f, m) => /* @__PURE__ */ u("div", { className: "dq-action-pair", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: t || !r && f.steps.length > 0,
          onClick: (g) => i(f, g.shiftKey),
          children: /* @__PURE__ */ u("span", { children: [
            /* @__PURE__ */ n("kbd", { children: et(f, m) }),
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
        (g) => `${s[g.mode]}: ${g.tagIds.map((S) => a[S] ?? "Loading tag…").join(", ")}`
      ).join("; ") })
    ] }, f.id))
  ] });
}
function ro({
  review: e,
  canWrite: t,
  onBusy: r,
  onSaveDefaults: i
}) {
  var Ne, We, ke, fe;
  const a = F(null), c = F("");
  if (!a.current)
    try {
      a.current = en(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (l) {
      c.current = qe(l), a.current = { query: br(e), startAtEnd: !1 };
    }
  const [s, f] = N(a.current.query), m = F(s);
  m.current = s;
  const [g, S] = N(0), E = F(a.current.startAtEnd), [b, A] = N([]), [y, P] = N(null), [U, B] = N(0), [I, te] = N(!1), [J, T] = N(!1), v = F(!1), q = F(!0), x = F(null);
  K(() => (q.current = !0, () => {
    q.current = !1;
  }), []);
  const [X, V] = N(c.current), [he, se] = N(""), [le, z] = N(null), [we, Re] = N(!1), [Ge, tt] = N([]), qt = F([]), Me = F(null), rt = F(null), wt = F(null);
  K(() => {
    var l, p;
    we && ((p = (l = wt.current) == null ? void 0 : l.querySelector("input")) == null || p.focus());
  }, [we]);
  const [Y, nt] = N(null), [Ue, it] = N(!1);
  K(() => {
    if (I || Ue || !rt.current) return;
    const l = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const p = rt.current;
      p != null && p.isConnected && !p.disabled && p.focus(), rt.current = null;
    });
    return () => cancelAnimationFrame(l);
  }, [I, Ue, g]);
  const [Be, de] = N([]), [Je, Z] = N({}), C = F(null), _ = F(0), j = F(!1), [ot, zt] = N({});
  K(() => {
    let l = !0;
    return Promise.all(
      Ln(s.objectFilter).map(
        async (p) => [
          String(p),
          (await L(`/api/tags/${p}`)).name
        ]
      )
    ).then((p) => {
      l && zt(Object.fromEntries(p));
    }).catch(() => {
    }), () => {
      l = !1;
    };
  }, [s.objectFilter]);
  const je = F(0), Ke = F(e);
  Ke.current = e;
  const H = mt(() => sr(e, s), [e, s]), at = F(H);
  at.current = H;
  const Fe = J || I || we, vt = Number(s.filter.page);
  function re(l, p = !1) {
    v.current || (c.current = "", E.current = p, m.current = l, f(l), B(0), te(!0), p || Kt(e.id, l), S((R) => R + 1));
  }
  function Ve() {
    if (v.current = !1, T(!1), q.current && x.current) {
      const l = x.current;
      x.current = null, re(l.query, l.startAtEnd);
    }
  }
  K(() => {
    const l = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const p = en(
            Ke.current,
            new URLSearchParams(window.location.search)
          );
          v.current ? x.current = p : re(p.query, p.startAtEnd);
        } catch (p) {
          V(qe(p));
        }
    };
    return window.addEventListener("popstate", l), () => window.removeEventListener("popstate", l);
  }, [e.id]), K(() => (r(J || I || we), () => r(!1)), [J, I, we, r]);
  async function D(l, p, R) {
    if (l.entityType === "performerOccurrence") {
      const $ = await Ji(
        l,
        C.current,
        p,
        R
      );
      return {
        items: $.items.map((Q) => ({
          key: Q.key,
          video: Q.video,
          occurrence: Q
        })),
        totalCount: $.totalCount
      };
    }
    const O = await At(
      l,
      { ...l.view.filter, page: p },
      R
    );
    return {
      items: O.items.map(($) => ({ key: String($.id), video: $ })),
      totalCount: O.totalCount
    };
  }
  function Qe(l, p, R) {
    if (!q.current || x.current) return;
    A(cr(l.items, m.current.startFrom === "end")), B(l.totalCount), P(R);
    const O = {
      ...m.current,
      filter: { ...m.current.filter, page: p }
    };
    m.current = O, f(O), Kt(e.id, O);
  }
  K(() => {
    if (c.current) return;
    const l = new AbortController(), p = ++je.current;
    return te(!0), V(""), se(""), P(null), A([]), Re(!1), (async () => {
      const R = sr(Ke.current, m.current);
      C.current = R.entityType === "performerOccurrence" ? await Mn(R, l.signal) : null;
      let O = Number(R.view.filter.page), $ = await D(R, O, l.signal);
      const Q = Math.max(
        1,
        Math.ceil($.totalCount / Number(R.view.filter.perPage))
      );
      if ((E.current || O > Q) && (O = Q, $ = await D(R, O, l.signal)), E.current = !1, p !== je.current || l.signal.aborted) return;
      const ee = cr($.items, R.view.startFrom === "end");
      Qe($, O, ee[0] ?? null);
    })().catch((R) => {
      l.signal.aborted || V(qe(R));
    }).finally(() => {
      l.signal.aborted || te(!1);
    }), () => {
      l.abort(), je.current++;
    };
  }, [g, e.id]), K(() => {
    if (z(null), !y) return;
    let l = !0;
    return Le(y).then((p) => {
      l && (z(p), de(
        e.entityType === "performerOccurrence" ? p.ids.filter((R) => e.occurrence.tagIds.includes(R)) : []
      ));
    }).catch((p) => {
      l && V(`Could not load current tags. ${qe(p)}`);
    }), () => {
      l = !1;
    };
  }, [y]), K(() => {
    if (e.entityType !== "performerOccurrence" || e.actions.length)
      return;
    let l = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (p) => [
          p,
          (await L(`/api/tags/${p}`)).name
        ]
      )
    ).then((p) => {
      l && Z(Object.fromEntries(p));
    }).catch((p) => {
      l && V(qe(p));
    }), () => {
      l = !1;
    };
  }, [e]);
  async function Ce() {
    if (!y) return;
    const l = b.findIndex((Q) => Q.key === y.key);
    if (l >= 0 && l + 1 < b.length) {
      P(b[l + 1]);
      return;
    }
    const p = new Set(b.map((Q) => Q.key)), R = 1100 - (Date.now() - _.current);
    R > 0 && await new Promise((Q) => window.setTimeout(Q, R));
    const O = s.startFrom === "end" ? -1 : 1;
    let $ = O === -1 ? Math.max(1, vt - 1) : vt;
    for (; q.current && !x.current; ) {
      let Q = await D(H, $);
      const ee = Math.max(
        1,
        Math.ceil(Q.totalCount / Number(s.filter.perPage))
      );
      $ > ee && ($ = ee, Q = await D(H, $));
      const ve = O === -1 && vt === 1 ? void 0 : cr(Q.items, O === -1).find(
        ($e) => !p.has($e.key)
      );
      if (ve || (O === -1 ? $ <= 1 : $ >= ee)) {
        Qe(Q, $, ve ?? null), ve || se(
          Q.totalCount ? "Reached the end in this direction. Matching items remain available from the scene pages." : "No matching scenes."
        );
        return;
      }
      $ += O;
    }
  }
  async function Oe(l, p = !1, R = !1, O = !1) {
    if (!y || v.current || I || we && !R) return;
    const $ = R || O || !!(l != null && l.steps.length);
    if ($ && (!t || !le)) return;
    v.current = !0, T(!0), V(""), se("");
    let Q = !1;
    try {
      if ($) {
        const ee = await Le(y);
        let ve;
        if (l)
          ve = await Hi(l), await zi(H, y, l);
        else {
          const Ie = O && e.entityType === "performerOccurrence" ? e.occurrence.tagIds.filter((ct) => ee.ids.includes(ct)) : qt.current, G = wr(Ie, O ? Be : Ge);
          ve = [...G.added, ...G.removed], await xn(H, y, G);
        }
        _.current = Date.now();
        const $e = await Le(y);
        z($e);
        const st = Xi(y, ee, $e, ve);
        [st.tags, st.absence].some(
          (Ie) => Ie.added.length || Ie.removed.length
        ) && nt({
          ...st,
          cursor: {
            query: structuredClone(s),
            items: [...b],
            total: U,
            targets: C.current ? [...C.current] : null
          }
        }), Q = !0, Re(!1), se("Tags saved.");
      }
      if (!q.current || x.current) return;
      p ? R && requestAnimationFrame(() => {
        var ee;
        return (ee = Me.current) == null ? void 0 : ee.focus();
      }) : await Ce();
    } catch (ee) {
      if (V(
        Q ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${qe(ee)}` : $ ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${qe(ee)}` : `Could not advance. ${qe(ee)}`
      ), $ && !Q) {
        _.current = Date.now();
        try {
          z(await Le(y));
        } catch {
          z(null), V(
            (ve) => `${ve} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Ve();
    }
  }
  async function Ht() {
    if (!(!Y || v.current || we || I)) {
      v.current = !0, T(!0), V(""), se("");
      try {
        await Yi(H, Y), nt(null), _.current = Date.now();
        const l = await Le(Y.item);
        if (!q.current || x.current) return;
        de(
          e.entityType === "performerOccurrence" ? l.ids.filter((p) => e.occurrence.tagIds.includes(p)) : []
        ), C.current = Y.cursor.targets, m.current = Y.cursor.query, f(Y.cursor.query), Kt(e.id, Y.cursor.query), A(Y.cursor.items), B(Y.cursor.total), P(Y.item), z(l), nt(null), se("Latest tag operation undone. Inspecting the affected item.");
      } catch (l) {
        if (!q.current || x.current) return;
        V(`Undo stopped. ${qe(l)}`), C.current = Y.cursor.targets, m.current = Y.cursor.query, f(Y.cursor.query), Kt(e.id, Y.cursor.query), A(Y.cursor.items), B(Y.cursor.total), P(Y.item);
        try {
          z(await Le(Y.item));
        } catch {
          z(null);
        }
      } finally {
        Ve();
      }
    }
  }
  K(() => {
    const l = (p) => {
      if (we || J || I || Ue || p.defaultPrevented || p.repeat || p.ctrlKey || p.altKey || p.metaKey || !Tn(p.target) || document.querySelector('[role="dialog"], dialog[open]'))
        return;
      const R = /^Digit[1-9]$/.test(p.code) ? p.code.slice(5) : p.key, O = e.actions.find(
        ($, Q) => et($, Q) === R
      );
      O && (p.preventDefault(), p.stopPropagation(), Oe(O, p.shiftKey));
    };
    return document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l);
  });
  const oe = s.performerScope, ue = (l) => re({
    ...m.current,
    filter: { ...m.current.filter, page: 1 },
    performerScope: { ...oe, ...l }
  });
  return /* @__PURE__ */ u(
    "section",
    {
      className: "dq-review-workspace",
      "aria-label": oe ? "Performer occurrence review" : "Video review",
      children: [
        /* @__PURE__ */ u(
          "fieldset",
          {
            className: "dq-review-filters",
            disabled: Fe,
            onClickCapture: (l) => {
              var O;
              const p = l.target instanceof Element ? l.target.closest("button") : null, R = (p == null ? void 0 : p.getAttribute("aria-label")) ?? ((O = p == null ? void 0 : p.textContent) == null ? void 0 : O.trim()) ?? "";
              p && !p.closest('[role="dialog"], dialog') && /^(Filters|Edit filter:|Edit performer criteria)/.test(R) && (rt.current = p);
            },
            children: [
              /* @__PURE__ */ n("legend", { children: "Scene filters" }),
              /* @__PURE__ */ n(
                "div",
                {
                  onKeyDownCapture: (l) => {
                    var p;
                    l.key === "Escape" && (j.current = !1), ["Delete", "Backspace"].includes(l.key) && l.target instanceof Element && ((p = l.target.closest("button")) == null ? void 0 : p.getAttribute("aria-label")) === "Edit filter: Custom Fields" && (j.current = !0);
                  },
                  onClickCapture: (l) => {
                    var R, O;
                    const p = l.target instanceof Element ? l.target.closest("button") : null;
                    (p == null ? void 0 : p.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((R = p == null ? void 0 : p.textContent) == null ? void 0 : R.trim()) === "Clear all" ? j.current = !0 : (/^(Cancel|Filters)/.test(((O = p == null ? void 0 : p.textContent) == null ? void 0 : O.trim()) ?? "") || /^(Close|Dismiss)/.test((p == null ? void 0 : p.getAttribute("aria-label")) ?? "")) && (j.current = !1);
                  },
                  children: /* @__PURE__ */ n(
                    dr,
                    {
                      filter: s.filter,
                      objectFilter: _n(
                        s.objectFilter,
                        ot
                      ),
                      criteriaDefinitions: [
                        ...Gt,
                        {
                          id: "custom-fields",
                          label: "Custom Fields",
                          filterKey: "customFieldCriteria"
                        }
                      ],
                      totalCount: U,
                      sortOptions: Cr,
                      showSearch: !0,
                      showSort: !0,
                      showPagingControls: !1,
                      onFilterChange: (l) => {
                        (l.sort !== m.current.filter.sort || l.direction !== m.current.filter.direction) && (l = { ...l, sorts: void 0 }), re({
                          ...m.current,
                          filter: be(l)
                        });
                      },
                      onObjectFilterChange: (l) => {
                        const p = Un(
                          m.current.objectFilter,
                          Dn(l),
                          j.current
                        );
                        j.current = !1, re({
                          ...m.current,
                          objectFilter: p,
                          filter: { ...m.current.filter, page: 1 }
                        });
                      }
                    }
                  )
                }
              ),
              oe && /* @__PURE__ */ u("div", { className: "dq-scope-controls", children: [
                /* @__PURE__ */ u("label", { children: [
                  "Performers to review",
                  " ",
                  /* @__PURE__ */ u(
                    "select",
                    {
                      value: oe.targetMode,
                      onChange: (l) => ue({
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
                oe.targetMode === "selected" && /* @__PURE__ */ n(
                  _e,
                  {
                    entityType: "performer",
                    values: oe.performerIds,
                    onChange: (l) => ue({ performerIds: l }),
                    placeholder: "Select performers to review...",
                    allowCreate: !1
                  }
                ),
                oe.targetMode === "filter" && /* @__PURE__ */ u(Ee, { children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => it(!0),
                      children: "Edit performer criteria"
                    }
                  ),
                  /* @__PURE__ */ n("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ n(
                    dr,
                    {
                      filter: {},
                      onFilterChange: () => {
                      },
                      totalCount: 0,
                      sortOptions: [],
                      showSearch: !1,
                      showSort: !1,
                      showPagingControls: !1,
                      criteriaDefinitions: Jr,
                      objectFilter: oe.performerFilter,
                      onObjectFilterChange: (l) => ue({ performerFilter: l })
                    }
                  ) })
                ] }),
                /* @__PURE__ */ u("label", { children: [
                  "Occurrence tags",
                  " ",
                  /* @__PURE__ */ u(
                    "select",
                    {
                      value: oe.condition,
                      onChange: (l) => ue({
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
                !["any", "isNull"].includes(oe.condition) && /* @__PURE__ */ n(
                  _e,
                  {
                    entityType: "tag",
                    values: oe.conditionTagIds,
                    onChange: (l) => ue({ conditionTagIds: l }),
                    placeholder: "Occurrence condition tags...",
                    allowCreate: !1
                  }
                )
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-row", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    onClick: () => {
                      const l = br(e);
                      re(l, l.startFrom === "end");
                    },
                    children: "Reset to review defaults"
                  }
                ),
                i && /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    onClick: () => {
                      v.current = !0, T(!0), V(""), i(sr(e, s)).then(() => se("Review defaults saved.")).catch((l) => V(qe(l))).finally(Ve);
                    },
                    children: "Save as review defaults"
                  }
                )
              ] })
            ]
          }
        ),
        oe && /* @__PURE__ */ n(
          pn,
          {
            open: Ue,
            onClose: () => it(!1),
            criteria: Jr,
            activeFilter: oe.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (l) => {
              it(!1), ue({ performerFilter: l });
            }
          }
        ),
        /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
          X && /* @__PURE__ */ u("p", { role: "alert", children: [
            X,
            " ",
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: J,
                onClick: () => {
                  y ? Le(y).then(z).catch((l) => V(qe(l))) : re(m.current);
                },
                children: y ? "Reload tags" : "Retry queue"
              }
            )
          ] }),
          he && /* @__PURE__ */ n("p", { role: "status", children: he }),
          Y && /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: Fe,
              onClick: () => void Ht(),
              children: "Undo latest tag operation"
            }
          )
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-review-layout", children: [
          /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
            /* @__PURE__ */ n("fieldset", { disabled: Fe, children: /* @__PURE__ */ n(
              gn,
              {
                filter: s.filter,
                totalCount: U,
                onFilterChange: (l) => re({ ...s, filter: be(l) })
              }
            ) }),
            /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: b.map((l) => {
              var p, R, O;
              return /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  title: `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${l.video.title || ((p = l.video.files[0]) == null ? void 0 : p.basename) || "Scene"}`,
                  "aria-label": `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${l.video.title || ((R = l.video.files[0]) == null ? void 0 : R.basename) || "Scene"}`,
                  disabled: Fe,
                  "aria-pressed": (y == null ? void 0 : y.key) === l.key,
                  onClick: () => {
                    P(l), V(""), se("");
                  },
                  children: [
                    l.occurrence && /* @__PURE__ */ n(rn, { performer: l.occurrence.performer }),
                    /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: l.video.title || ((O = l.video.files[0]) == null ? void 0 : O.basename) || "Scene" })
                  ]
                },
                l.key
              );
            }) })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-inspector", children: y ? /* @__PURE__ */ u(Ee, { children: [
            /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
              /* @__PURE__ */ n("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ n(
                "a",
                {
                  href: `/video/${y.video.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: y.video.title || ((Ne = y.video.files[0]) == null ? void 0 : Ne.basename) || `Video ${y.video.id}`
                }
              ) }),
              /* @__PURE__ */ n(
                mn,
                {
                  videoId: y.video.id,
                  streamUrl: kn(y.video.id),
                  posterUrl: Fi(y.video),
                  duration: ((We = y.video.files[0]) == null ? void 0 : We.duration) ?? 0,
                  format: (ke = y.video.files[0]) == null ? void 0 : ke.format,
                  audioCodec: (fe = y.video.files[0]) == null ? void 0 : fe.audioCodec,
                  extensionSurface: "quick-view",
                  showAbLoop: !0,
                  clip: y.video.parentVideoId != null ? {
                    start: y.video.clipStartSec ?? 0,
                    end: y.video.clipEndSec,
                    loop: !1
                  } : void 0
                },
                y.video.id
              )
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-panel", children: [
              /* @__PURE__ */ n("h2", { children: y.occurrence ? `Reviewing ${y.occurrence.performer.name}` : "Reviewing this video" }),
              /* @__PURE__ */ n("p", { children: oe ? "Tags apply only to this performer in this video." : "Tags apply to the video." }),
              oe && /* @__PURE__ */ n(
                "div",
                {
                  className: "dq-review-partners",
                  "aria-label": "Matching scene partners",
                  children: b.filter((l) => l.video.id === y.video.id).map((l) => {
                    var p, R;
                    return /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button dq-partner-button",
                        title: (p = l.occurrence) == null ? void 0 : p.performer.name,
                        "aria-label": (R = l.occurrence) == null ? void 0 : R.performer.name,
                        disabled: Fe,
                        "aria-pressed": l.key === y.key,
                        onClick: () => {
                          P(l), V("");
                        },
                        children: l.occurrence && /* @__PURE__ */ n(
                          rn,
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
                oe ? "occurrence" : "video",
                " tags:",
                " ",
                le ? le.names.join(", ") || "None" : "Loading…"
              ] }),
              le != null && le.absent.length ? /* @__PURE__ */ u("p", { children: [
                "Confirmed absent tags:",
                " ",
                /* @__PURE__ */ n(
                  _e,
                  {
                    entityType: "tag",
                    values: le.absent,
                    onChange: () => {
                    },
                    disabled: !0,
                    allowCreate: !1
                  }
                )
              ] }) : null,
              we ? /* @__PURE__ */ u(
                "fieldset",
                {
                  ref: wt,
                  disabled: J,
                  className: "dq-tag-editor",
                  children: [
                    /* @__PURE__ */ u("legend", { children: [
                      "Edit ",
                      oe ? "occurrence" : "video",
                      " tags"
                    ] }),
                    /* @__PURE__ */ n(
                      _e,
                      {
                        entityType: "tag",
                        values: Ge,
                        onChange: tt,
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
                          disabled: !le,
                          onClick: () => void Oe(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !le,
                          onClick: () => void Oe(void 0, !1, !0),
                          children: "Save & next"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => {
                            Re(!1), requestAnimationFrame(
                              () => {
                                var l;
                                return (l = Me.current) == null ? void 0 : l.focus();
                              }
                            );
                          },
                          children: "Cancel"
                        }
                      )
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ u(Ee, { children: [
                /* @__PURE__ */ n(
                  to,
                  {
                    actions: e.actions,
                    canWrite: t,
                    disabled: J || I || !le,
                    onApply: (l, p) => void Oe(l, p)
                  }
                ),
                e.entityType === "performerOccurrence" && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u("fieldset", { disabled: !t || J || !le, children: [
                  /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                  e.occurrence.tagIds.map((l) => /* @__PURE__ */ u("label", { children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: e.occurrence.multiple ? "checkbox" : "radio",
                        name: "legacy-choice",
                        checked: Be.includes(l),
                        onChange: (p) => de(
                          e.occurrence.multiple ? p.target.checked ? [...Be, l] : Be.filter(
                            (R) => R !== l
                          ) : [l]
                        )
                      }
                    ),
                    Je[l] ?? "Loading tag…"
                  ] }, l)),
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      onClick: () => de([]),
                      children: "No applicable tags"
                    }
                  ),
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => void Oe(void 0, !0, !1, !0),
                      children: "Save choices"
                    }
                  ),
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button primary",
                      onClick: () => void Oe(void 0, !1, !1, !0),
                      children: "Save & next performer"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-row", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ref: Me,
                    className: "dq-button",
                    disabled: Fe || !t || !le,
                    onClick: () => {
                      qt.current = [...le.ids], tt([...le.ids]), Re(!0);
                    },
                    children: "Edit tags"
                  }
                ),
                /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: Fe,
                    onClick: () => void Oe(),
                    children: [
                      "Skip",
                      oe ? " performer" : " video"
                    ]
                  }
                )
              ] }),
              !t && /* @__PURE__ */ n("p", { children: "Write permission is required to change tags." })
            ] })
          ] }) : /* @__PURE__ */ n("p", { role: "status", children: I ? "Loading review…" : U ? "Reached the end in this direction." : "No matching scenes." }) })
        ] })
      ]
    }
  );
}
function nn({
  review: e,
  onChange: t,
  choices: r = !1
}) {
  const i = e.occurrence, a = (c) => t({ ...e, occurrence: { ...i, ...c } });
  return r ? /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ n("p", { children: "Choose the tags this review can change on the active performer’s appearance in a scene. Other tags are preserved." }),
    /* @__PURE__ */ n(
      _e,
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
    /* @__PURE__ */ n("p", { children: "Leave this unrestricted to review any appearance. Choose performers temporarily in the review workspace." }),
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
    !["any", "isNull"].includes(i.condition) && /* @__PURE__ */ n(
      _e,
      {
        entityType: "tag",
        values: i.conditionTagIds,
        onChange: (c) => a({ conditionTagIds: c }),
        placeholder: "Search occurrence condition tags...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("p", { children: "Conditions check exact tags on the same performer’s occurrence, independently of scene tags and the performer’s profile." })
  ] });
}
function no(e) {
  var f, m, g;
  const [t, r] = N({}), [i, a] = N(""), c = (((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.annotations) ?? []).includes("tags") ? ((m = e == null ? void 0 : e.presentation) == null ? void 0 : m.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...c,
      ...((g = e == null ? void 0 : e.presentation) == null ? void 0 : g.binParents) ?? []
    ])
  ]);
  return K(() => {
    let S = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(s).map(
        async (E) => [E, await It([E])]
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
function io(e, t, r) {
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
        (f) => {
          var m;
          return f !== s.id && ((m = r[f]) == null ? void 0 : m.includes(s.id));
        }
      )
    ) : []
  };
}
function oo({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: a
}) {
  var f, m, g;
  const c = new Set(
    (((f = t.presentation) == null ? void 0 : f.binParents) ?? []).flatMap(
      (S) => (r[S] ?? []).filter((E) => E !== S)
    )
  ), s = /* @__PURE__ */ new Map();
  for (const S of e)
    for (const E of S.tags ?? [])
      if (c.has(E.id)) {
        const b = s.get(E.id) ?? { name: E.name, count: 0 };
        b.count++, s.set(E.id, b);
      }
  return (g = (m = t.presentation) == null ? void 0 : m.binParents) != null && g.length ? /* @__PURE__ */ u("div", { className: "dq-row", "aria-label": "Tag bins", children: [
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
function ao(e, t) {
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
function on({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [a, c] = N(!1), s = Se(e) === "tag" ? "tag" : "video", f = e.view.filter, m = s === "tag" ? hn : Cr, g = (b) => t({
    ...e,
    view: { ...e.view, filter: { ...f, ...b } }
  }), S = s === "video" ? e.presentation ?? {} : {}, E = (b) => t({ ...e, presentation: { ...S, ...b } });
  return /* @__PURE__ */ u(Ee, { children: [
    i && /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ u("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(f.q ?? ""),
            onChange: (b) => g({ q: b.target.value })
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
              onChange: (b) => g({ sort: b.target.value, sorts: void 0 }),
              children: [
                !m.some((b) => b.value === f.sort) && f.sort != null && /* @__PURE__ */ n("option", { value: String(f.sort), children: String(f.sort) }),
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
              value: String(f.direction ?? "desc"),
              onChange: (b) => g({ direction: b.target.value }),
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
              onChange: (b) => g({
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
        pn,
        {
          open: !0,
          onClose: () => c(!1),
          criteria: s === "tag" ? yn : Gt,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: s === "video",
          subjectLabel: s === "tag" ? "tags" : "videos",
          onApply: (b) => {
            t({ ...e, view: { ...e.view, objectFilter: b } }), c(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ u(Ee, { children: [
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
      ] }) }),
      s === "video" && /* @__PURE__ */ u(Ee, { children: [
        /* @__PURE__ */ n("h4", { children: "Card annotations" }),
        /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((b) => {
          const A = S.annotations ?? [];
          return /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: A.includes(b),
                onChange: (y) => E({
                  annotations: y.target.checked ? [...A, b] : A.filter((P) => P !== b)
                })
              }
            ),
            b
          ] }, b);
        }) }),
        (S.annotations ?? []).includes("tags") && /* @__PURE__ */ u(Ee, { children: [
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
          /* @__PURE__ */ n(
            _e,
            {
              entityType: "tag",
              values: S.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (b) => E({ annotationParents: b }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ n("h4", { children: "Tag bins" }),
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ n(
          _e,
          {
            entityType: "tag",
            values: S.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (b) => E({ binParents: b }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const lr = 180, so = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function jn({ entityType: e }) {
  return e === "tag" ? /* @__PURE__ */ n(mi, { role: "img", "aria-label": "Tag review" }) : /* @__PURE__ */ n(pr, { role: "img", "aria-label": e === "performerOccurrence" ? "Performer occurrence review" : "Video review" });
}
function an(e) {
  return Se(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function sn(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function cn() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function ln(e) {
  const t = new URLSearchParams(window.location.search);
  Rr.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function co(e) {
  return be({ ...e, page: 1 });
}
function vr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, f) => vr(s, t[f]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, a = Object.keys(r).sort(), c = Object.keys(i).sort();
  return a.length === c.length && a.every(
    (s, f) => s === c[f] && vr(r[s], i[s])
  );
}
function Kn(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Te(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
const Vn = "data-quality.workspace-layout.v1", qr = 240, Sr = 192, Er = 560;
function Gn(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(Er, Math.max(Sr, e)) : qr;
}
function lo() {
  try {
    const e = JSON.parse(
      localStorage.getItem(Vn) ?? "null"
    );
    return Gn(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return qr;
  }
}
function uo(e) {
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
function fo(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : Jn(e, t);
}
function po({
  onNavigate: e
}) {
  const [t, r] = N([]), [i] = N(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [a, c] = N(""), [s, f] = N(!0), [m, g] = N(""), [S, E] = N(!1), [b, A] = N(!1), [y, P] = N(!1), [U, B] = N([]), [I, te] = N(""), [J, T] = N(!0), [v, q] = N(""), [x, X] = N(""), [V, he] = N(!1), [se, le] = N(!1), [z, we] = N(cn), [Re, Ge] = N({}), [tt, qt] = N("name"), [Me, rt] = N("asc"), wt = F(null), Y = F(!1), [nt, Ue] = N(!1), [it, Be] = N(!1), [de, Je] = N(
    null
  ), Z = t.find((o) => o.id === z) ?? null, C = mt(
    () => (de == null ? void 0 : de.id) === z && Z ? { ...Z, view: de.view } : Z,
    [de, z, Z]
  );
  K(() => {
    const o = () => we(cn());
    return window.addEventListener("popstate", o), () => window.removeEventListener("popstate", o);
  }, []);
  const _ = C ? Se(C) : "video", j = _ === "video" ? C : null, ot = _ === "tag" ? b : S, zt = mt(() => {
    const o = Me === "asc" ? 1 : -1;
    return [...t].sort((d, h) => {
      if (tt === "count") {
        const w = Re[d.id], M = Re[h.id], k = typeof w == "number", W = typeof M == "number";
        if (k !== W) return k ? -1 : 1;
        if (k && W && w !== M)
          return (w - M) * o;
      }
      return d.name.localeCompare(h.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * o;
    });
  }, [Me, tt, Re, t]), je = F(
    null
  ), Ke = no(j), [H, at] = N({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Fe, vt] = N({
    page: 1,
    perPage: 40
  }), [re, Ve] = N({ items: [], totalCount: 0 }), [D, Qe] = N(!1), [Ce, Oe] = N(""), [Ht, oe] = N(!1), [ue, Ne] = N(() => /* @__PURE__ */ new Set()), We = F(ue);
  We.current = ue;
  const ke = F(/* @__PURE__ */ new Map()), [fe, l] = N(null), p = F(fe);
  p.current = fe;
  const [R, O] = N(!1), $ = F(R);
  $.current = R;
  const Q = F(null), [ee, ve] = N("grid"), [$e, st] = N(lr), [Ie, Or] = N(lo), [G, ct] = N(!1), Ot = F(!1), [Wn, Xt] = N(""), [kt, ze] = N(""), [Yt, St] = N(""), [ae, kr] = N(null), [Pr, Pt] = N(""), [Mt, Ft] = N(!1), [Mr, Fr] = N({}), [$r, xr] = N({}), Et = F(/* @__PURE__ */ new Map()), Lr = F(null), $t = F(null), lt = F(0), xt = F(0), Lt = F(null), He = F(!1), _r = JSON.stringify([
    ...new Set(
      (j == null ? void 0 : j.actions.flatMap(
        (o) => o.steps.flatMap((d) => d.tagIds)
      )) ?? []
    )
  ]);
  function Zt(o) {
    const d = Gn(o);
    Or(d), uo(d);
  }
  function zn(o) {
    const d = o.shiftKey ? 40 : 16;
    let h = null;
    o.key === "ArrowLeft" && (h = Ie + d), o.key === "ArrowRight" && (h = Ie - d), o.key === "Home" && (h = Sr), o.key === "End" && (h = Er), h !== null && (o.preventDefault(), o.stopPropagation(), Zt(h));
  }
  K(() => {
    if (!kt) return;
    const o = window.setTimeout(() => ze(""), 4e3);
    return () => window.clearTimeout(o);
  }, [kt]), K(() => {
    const o = JSON.parse(_r);
    if (xr({}), !o.length) return;
    const d = new AbortController();
    let h = !0;
    return Promise.all(
      o.map(async (w) => {
        var M;
        try {
          const k = await L(`/api/tags/${w}`, {
            signal: d.signal
          });
          return [w, ((M = k.name) == null ? void 0 : M.trim()) || null];
        } catch {
          return [w, null];
        }
      })
    ).then((w) => {
      h && xr(Object.fromEntries(w));
    }), () => {
      h = !1, d.abort();
    };
  }, [_r]), K(() => {
    const o = j ? Ln(j.view.objectFilter) : [];
    if (Fr({}), !o.length) return;
    const d = new AbortController();
    let h = !0;
    return Promise.all(
      o.map(async (w) => {
        var M;
        try {
          const k = await L(`/api/tags/${w}`, {
            signal: d.signal
          });
          return (M = k.name) != null && M.trim() ? [String(w), k.name] : null;
        } catch {
          return null;
        }
      })
    ).then((w) => {
      h && Fr(
        Object.fromEntries(w.filter((M) => M !== null))
      );
    }), () => {
      h = !1, d.abort();
    };
  }, [j == null ? void 0 : j.id, j == null ? void 0 : j.view.objectFilter]);
  const er = mt(
    () => j ? _n(
      j.view.objectFilter,
      Mr
    ) : (C == null ? void 0 : C.view.objectFilter) ?? {},
    [Mr, C, j]
  ), Hn = mt(
    () => _ === "video" && Array.isArray(er.customFieldCriteria) ? [...Gt, so] : _ === "tag" ? yn : Gt,
    [_, er.customFieldCriteria]
  ), Dr = Ze(async () => {
    f(!0), g("");
    try {
      const o = await Ai();
      r(o.reviews), c(o.storageKey), E(o.canWriteVideos ?? o.canWrite), A(o.canWriteTags ?? !1), P(o.canReadTagGroups ?? !1), T(o.canConfigure ?? !0), q(o.storageNotice ?? ""), z && !o.reviews.some((d) => d.id === z) && (we(""), ln(""));
    } catch (o) {
      g(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      f(!1);
    }
  }, [z]);
  K(() => {
    if (!y) {
      B([]), te("");
      return;
    }
    const o = new AbortController();
    return te(""), Mi(o.signal).then(B).catch((d) => {
      o.signal.aborted || te(
        d instanceof Error ? d.message : "Could not load tag groups."
      );
    }), () => o.abort();
  }, [y]), K(() => {
    Dr();
  }, []), K(() => {
    if (z || t.length === 0) return;
    const o = new AbortController();
    Ge({});
    for (const d of t)
      (d.entityType === "performerOccurrence" ? Mn(d, o.signal).then((w) => (w == null ? void 0 : w.length) === 0 ? { items: [], totalCount: 0 } : At(Fn(d, w), { ...d.view.filter, page: 1, perPage: 1 }, o.signal)) : Se(d) === "tag" ? Xr(
        d,
        be({ ...d.view.filter, page: 1, perPage: 1 }),
        o.signal
      ) : At(
        d,
        be({ ...d.view.filter, page: 1, perPage: 1 }),
        o.signal
      )).then((w) => {
        o.signal.aborted || Ge((M) => ({
          ...M,
          [d.id]: w.totalCount
        }));
      }).catch(() => {
        o.signal.aborted || Ge((w) => ({ ...w, [d.id]: null }));
      });
    return () => o.abort();
  }, [z, t]), fn(() => {
    var o;
    z || s || !Y.current || (Y.current = !1, (o = wt.current) == null || o.focus());
  }, [z, s]);
  const _t = Ze(async () => {
    Pt("");
    try {
      kr(await Tr());
    } catch (o) {
      kr(null), Pt(
        "Tag assessment setup could not be checked. " + (o instanceof Error ? o.message : "Request failed.")
      );
    }
  }, []);
  K(() => {
    _t();
  }, [_t]);
  const Xe = Ze(
    async (o, d, h = !1) => {
      var W;
      const w = ++lt.current;
      (W = Lt.current) == null || W.abort();
      const M = new AbortController();
      Lt.current = M, d = be(d);
      const k = Number(d.page);
      h && (d = { ...d, page: 1 }), at(d), oe(h), Qe(!0), Oe("");
      try {
        const ce = (ut) => Se(o) === "tag" ? Xr(
          o,
          ut,
          M.signal
        ) : At(
          o,
          ut,
          M.signal
        );
        let ye = await ce(d);
        const Pe = Math.max(
          1,
          Math.ceil(ye.totalCount / Number(d.perPage))
        ), Ae = h ? Pe : Math.min(k, Pe);
        return Number(d.page) !== Ae && (d = { ...d, page: Ae }, ye = await ce(d)), w === lt.current && (Ve(ye), at(d), vt(d)), ye;
      } catch (ce) {
        throw w === lt.current && Oe(
          ce instanceof Error ? ce.message : "Could not load the review queue."
        ), ce;
      } finally {
        w === lt.current && Qe(!1);
      }
    },
    []
  );
  K(() => {
    var d;
    if (xt.current += 1, lt.current += 1, (d = Lt.current) == null || d.abort(), le(!1), X(""), he(!1), Ne(/* @__PURE__ */ new Set()), ke.current.clear(), l(null), O(!1), ct(!1), Ot.current = !1, Xt(""), ze(""), St(""), Ve({ items: [], totalCount: 0 }), !C || Se(C) !== "tag") {
      Qe(!1);
      return;
    }
    let o = !0;
    return Qe(!0), (async () => {
      let h = null;
      try {
        h = await Ii(a, C.id);
      } catch (k) {
        o && (he(!0), X(
          k instanceof Error ? k.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const w = (h == null ? void 0 : h.signature) === pt(C) ? h : null, M = w ? be(w.filter) : co(C.view.filter);
      at(M), ve(
        w ? sn(w.displayMode, Se(C)) : an(C)
      ), st(
        w ? w.cardSize ?? lr : lr
      );
      try {
        const k = await Xe(
          C,
          M,
          !w && C.view.startFrom !== "beginning"
        );
        if (!o) return;
        const W = Qr(
          k.items.map((ce) => ce.id),
          (w == null ? void 0 : w.focusedId) ?? null,
          (w == null ? void 0 : w.index) ?? 0
        );
        l(W), ge(W);
      } catch {
      }
      o && le(!0);
    })(), () => {
      var h;
      o = !1, xt.current++, lt.current++, (h = Lt.current) == null || h.abort();
    };
  }, [C == null ? void 0 : C.id]);
  const ne = mt(
    () => re.items.map((o) => o.id),
    [re.items]
  );
  K(() => {
    if (!se || !C || !a || D || Ce || G || (de == null ? void 0 : de.id) === C.id || V)
      return;
    const o = {
      version: 1,
      signature: pt(C),
      filter: H,
      focusedId: fe,
      index: Math.max(0, ne.indexOf(fe ?? -1)),
      displayMode: ee,
      cardSize: $e,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        a + ":progress:" + C.id,
        JSON.stringify(o)
      );
    } catch {
    }
    if (x) return;
    let d = !0;
    const h = window.setTimeout(() => {
      qi(a, C.id, o).catch((w) => {
        d && X(
          "Progress is kept in this browser, but account sync failed. " + (w instanceof Error ? w.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      d = !1, window.clearTimeout(h);
    };
  }, [
    se,
    a,
    C,
    D,
    Ce,
    G,
    H,
    fe,
    ne,
    ee,
    $e,
    de,
    x,
    V
  ]);
  const Xn = re.items.find((o) => o.id === fe) ?? null, tr = _ === "video" ? Xn : null;
  R && tr && (Q.current = tr);
  const Ye = tr ?? (R ? Q.current : null), Yn = Wr(ue, fe), Ur = ue.size > 0 ? `${ue.size} selected ${_}${ue.size === 1 ? "" : "s"}` : fe == null ? `no ${_}` : `focused ${_}`, ge = Ze((o, d = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const h = Et.current.get(o);
      h == null || h.focus({ preventScroll: !0 }), d && (h == null || h.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  K(() => {
    se && !$.current && ge(p.current);
  }, [se, ge]), K(() => {
    D || !ne.length || (p.current == null || !ne.includes(p.current)) && (l(ne[0]), $.current || ge(ne[0]));
  }, [ge, ne, D]);
  const dt = Ze(
    (o) => {
      Ne((d) => {
        const h = o(d);
        for (const w of /* @__PURE__ */ new Set([...d, ...h]))
          d.has(w) !== h.has(w) && ke.current.set(
            w,
            (ke.current.get(w) ?? 0) + 1
          );
        return h;
      });
    },
    []
  ), rr = Ze(
    (o) => {
      if (!ne.length) return;
      const d = Math.max(
        0,
        ne.indexOf(p.current ?? ne[0])
      ), h = ne[Math.max(0, Math.min(ne.length - 1, d + o))];
      l(h), $.current || ge(h);
    },
    [ge, ne]
  ), nr = Ze(
    async (o) => {
      const d = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", h = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, w = h != null && (!y || !U.some((ie) => ie.id === h)), M = "effect" in o && d && !y, k = Wr(
        We.current,
        p.current
      );
      if (!C || Ot.current || D || Ce || d && !ot || M || w || Bt(o) && (ae == null ? void 0 : ae.kind) !== "ready" || !k.length)
        return;
      const W = ++xt.current, ce = C.id, ye = [...ne], Pe = re, Ae = p.current, ut = new Set(We.current), Ct = new Map(
        k.map((ie) => [ie, ke.current.get(ie) ?? 0])
      ), ft = () => W === xt.current && C.id === ce;
      Ot.current = !0, ct(!0), Xt(
        We.current.size ? `${k.length} selected ${_}s` : `the focused ${_}`
      ), ze(""), St("");
      const Kr = Pe.items.filter(
        (ie) => !k.includes(ie.id)
      ), si = Kr.map((ie) => ie.id), Vr = zr(
        ye,
        si,
        Ae,
        k.includes(Ae ?? -1)
      );
      Ve({
        items: Kr,
        totalCount: Pe.totalCount
      }), Ne((ie) => {
        const pe = new Set(ie);
        for (const me of k) pe.delete(me);
        return pe;
      }), l(Vr), $.current || ge(Vr);
      let or = !1;
      try {
        if ("effect" in o ? await Vi(o, k) : await Pn(o, k), or = !0, !ft()) return;
        Ne((ie) => {
          const pe = new Set(ie);
          for (const me of k)
            (ke.current.get(me) ?? 0) === Ct.get(me) && pe.delete(me);
          return pe;
        }), ze(
          `${o.label}: ${k.length} ${_}${k.length === 1 ? "" : "s"} ${d ? "updated" : "skipped"}.`
        );
      } catch (ie) {
        if (!ft()) return;
        Ve(Pe), Ne((pe) => {
          const me = new Set(pe);
          for (const xe of k)
            ut.has(xe) && (ke.current.get(xe) ?? 0) === Ct.get(xe) && me.add(xe);
          return me;
        }), l(Ae), $.current || ge(Ae), St(
          ie instanceof Error ? ie.message : "Action failed."
        );
      }
      try {
        if (await Li(o), !ft()) return;
        const ie = await Xe(C, H);
        if (!ft()) return;
        let pe = ie.items.map((me) => me.id);
        if (!pe.length && ie.totalCount > 0 && Number(H.page) > 1) {
          const me = Math.max(1, Number(H.page) - 1), xe = { ...H, page: me };
          at(xe), pe = (await Xe(C, xe)).items.map((ar) => ar.id), Ne(
            (ar) => new Set([...ar].filter((ci) => pe.includes(ci)))
          );
          const Br = pe.at(-1) ?? null;
          l(Br), $.current || ge(Br);
        } else {
          Ne(
            (xe) => new Set([...xe].filter((Gr) => pe.includes(Gr)))
          );
          const me = zr(
            ye,
            pe,
            Ae,
            or && k.includes(Ae ?? -1)
          );
          l(me), $.current && me == null && O(!1), $.current || ge(me);
        }
      } catch (ie) {
        ft() && St(
          (pe) => `${pe ? `${pe} ` : ""}${or ? "The action completed, but " : ""}the queue could not be refreshed. ${ie instanceof Error ? ie.message : "Refresh failed."}`
        );
      } finally {
        ft() && (Ot.current = !1, ct(!1), Xt(""));
      }
    },
    [
      ot,
      y,
      U,
      _,
      ae,
      Xe,
      H,
      ge,
      ne,
      re,
      D,
      Ce,
      C
    ]
  );
  function Zn() {
    var h;
    if (ee === "list") return 1;
    const o = (h = Lr.current) == null ? void 0 : h.firstElementChild, d = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, d.split(" ").filter(Boolean).length);
  }
  function ei(o) {
    if (_ !== "tag" || o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || nt) return;
    if (R && o.key === "Escape") {
      Te(o), O(!1), ge(p.current);
      return;
    }
    if (!Tn(o.target)) return;
    if (o.key === "Escape") {
      Te(o), dt(() => /* @__PURE__ */ new Set());
      return;
    }
    const d = (C == null ? void 0 : C.actions.findIndex(
      (M, k) => et(M, k) === o.key
    )) ?? -1;
    if (d >= 0 && (C != null && C.actions[d])) {
      Te(o), !G && !D && nr(C.actions[d]);
      return;
    }
    if (!R && o.key === " ") {
      Te(o), fe != null && dt((M) => Vt(M, fe));
      return;
    }
    if (!R && o.key.toLowerCase() === "a") {
      Te(o), dt(
        (M) => Si(M, ne)
      );
      return;
    }
    if (G || D || R) return;
    if (o.key === "Enter" && fe != null) {
      Te(o), _ === "tag" ? window.open(`/tag/${fe}`, "_blank", "noopener,noreferrer") : O(!0);
      return;
    }
    const h = Zn(), w = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -h : o.key === "ArrowDown" ? h : 0;
    w && (Te(o), rr(w));
  }
  function Dt(o) {
    we(o), ln(o);
  }
  function ti() {
    Y.current = !0, Ge({}), Dt("");
  }
  async function ir(o) {
    if (!a) return !1;
    const d = o.map(mo);
    try {
      await Ri(a, d);
    } catch (w) {
      throw w;
    }
    r(d), z && !d.some((w) => w.id === z) && Dt("");
    const h = d.find((w) => w.id === z);
    return h && Z && JSON.stringify(h) !== JSON.stringify(Z) && (h.view.displayMode !== Z.view.displayMode && ve(an(h)), h.entityType === "tag" && pt(h) !== pt(Z) && (Je(null), Ut(
      h,
      be({ ...h.view.filter, page: H.page })
    ))), !0;
  }
  if (s)
    return /* @__PURE__ */ n(dn, { label: "Loading reviews…" });
  if (m)
    return /* @__PURE__ */ u(Ee, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Ao().catch(
            (o) => g(
              "Could not export browser reviews. " + (o instanceof Error ? o.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        un,
        {
          message: m,
          onRetry: () => void Dr()
        }
      )
    ] });
  return /* @__PURE__ */ u("div", { className: "data-quality-page", onKeyDown: ei, children: [
    /* @__PURE__ */ u("header", { className: "data-quality-header", children: [
      C && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: G,
          onClick: ti,
          children: /* @__PURE__ */ n(bn, {})
        }
      ),
      /* @__PURE__ */ u("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (C == null ? void 0 : C.name) ?? "Data Quality" }),
        (C == null ? void 0 : C.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: C.description })
      ] }),
      C && Z && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: G || D || !J,
          onClick: () => {
            Be(!0), Ue(!0);
          },
          children: /* @__PURE__ */ n(wn, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: G || D || !J,
          onClick: () => {
            Be(!1), Ue(!0);
          },
          children: /* @__PURE__ */ n(fi, {})
        }
      )
    ] }),
    v && /* @__PURE__ */ n("p", { className: "dq-status", children: v }),
    j && (ae == null ? void 0 : ae.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      ae.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: Mt,
          onClick: () => {
            Ft(!0), Pt(""), Di().then(_t).catch(
              (o) => Pt(
                "Could not create the Confirmed absent tags custom field. " + (o instanceof Error ? o.message : "Request failed.")
              )
            ).finally(() => Ft(!1));
          },
          children: Mt ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    j && ((ae == null ? void 0 : ae.kind) === "incompatible" || Pr) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(fr, {}),
      Pr || (ae == null ? void 0 : ae.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: Mt,
          onClick: () => {
            Ft(!0), _t().finally(
              () => Ft(!1)
            );
          },
          children: Mt ? "Checking…" : "Check again"
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
            ), h = document.createElement("a");
            h.href = d, h.download = "data-quality-unassigned-legacy-reviews.json", h.click(), URL.revokeObjectURL(d);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    x && /* @__PURE__ */ u("p", { role: "alert", children: [
      x,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            X(""), he(!1);
          },
          children: V ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    C && Z && C.entityType === "tag" && /* @__PURE__ */ u("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${G || D ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": G || D || void 0,
          inert: G || D ? !0 : void 0,
          onClickCapture: (o) => {
            var h, w, M, k, W;
            const d = o.target instanceof Element ? o.target.closest("button") : null;
            (d == null ? void 0 : d.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((h = d == null ? void 0 : d.textContent) == null ? void 0 : h.trim()) === "Clear all" ? He.current = !0 : ((w = d == null ? void 0 : d.getAttribute("aria-label")) != null && w.startsWith("Filters") || (M = d == null ? void 0 : d.getAttribute("aria-label")) != null && M.startsWith("Edit filter:") || ((k = d == null ? void 0 : d.textContent) == null ? void 0 : k.trim()) === "Cancel" || (W = d == null ? void 0 : d.getAttribute("aria-label")) != null && W.startsWith("Close ")) && (He.current = !1);
          },
          onKeyDownCapture: (o) => {
            var h, w;
            const d = o.target instanceof Element ? o.target.closest("button") : null;
            (o.key === "Delete" || o.key === "Backspace") && (d == null ? void 0 : d.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (o.preventDefault(), o.stopPropagation(), He.current = !0, (w = (h = d.parentElement) == null ? void 0 : h.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || w.click()) : o.key === "Escape" && (He.current = !1);
          },
          children: /* @__PURE__ */ n(
            dr,
            {
              filter: Ce ? Fe : H,
              onFilterChange: ri,
              totalCount: re.totalCount,
              sortOptions: _ === "tag" ? hn : Cr,
              showSearch: !0,
              showSort: !0,
              displayMode: ee,
              onDisplayModeChange: (o) => ve(sn(o, _)),
              availableDisplayModes: _ === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: ($e - 225) / 50,
              onZoomChange: (o) => st(Math.round(225 + o * 50)),
              cardSizeEntityType: _ === "tag" ? "tags" : "videos",
              criteriaDefinitions: Hn,
              objectFilter: er,
              onObjectFilterChange: (o) => {
                if (!G && !D) {
                  const d = _ === "video" ? Dn(o) : o;
                  je.current = _ === "video" ? Un(
                    C.view.objectFilter,
                    d,
                    He.current
                  ) : d, He.current = !1;
                }
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (de == null ? void 0 : de.id) === z && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: G || D || !J,
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
            disabled: G || D,
            onClick: ni,
            children: /* @__PURE__ */ n(gi, {})
          }
        )
      ] })
    ] }),
    C ? _ !== "tag" ? /* @__PURE__ */ n(ro, { review: C, canWrite: C.entityType === "performerOccurrence" ? b : S, onBusy: ct, onSaveDefaults: J ? (o) => ir(t.map((d) => d.id === o.id ? o : d)) : void 0 }, C.id) : /* @__PURE__ */ u(Ee, { children: [
      j && Ke.error && /* @__PURE__ */ n("p", { role: "alert", children: Ke.error }),
      j && /* @__PURE__ */ n(
        oo,
        {
          videos: re.items,
          review: j,
          trees: Ke.ids,
          disabled: G || D,
          onChoose: (o) => {
            const d = ao(j, o);
            Je(d), Ut(d, { ...H, page: 1 });
          }
        }
      ),
      Yt && !R && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(fr, {}),
        Yt
      ] }),
      kt && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: kt }),
      jr("top"),
      /* @__PURE__ */ u(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${Ie}px`
          },
          children: [
            /* @__PURE__ */ u("main", { children: [
              D && !re.items.length && /* @__PURE__ */ n(dn, { label: "Loading review queue…" }),
              Ce && !D && /* @__PURE__ */ n(
                un,
                {
                  message: Ce,
                  onRetry: () => void Xe(
                    C,
                    H,
                    Ht
                  ).catch(() => {
                  })
                }
              ),
              !G && !D && !Ce && !re.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(pr, {}),
                /* @__PURE__ */ u("p", { children: [
                  "No ",
                  _,
                  "s match this review."
                ] })
              ] }),
              !!re.items.length && /* @__PURE__ */ n("div", { ref: Lr, children: /* @__PURE__ */ n(
                "div",
                {
                  className: ee === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${$e}px`
                  },
                  children: re.items.map(ai)
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
                "aria-valuemin": Sr,
                "aria-valuemax": Er,
                "aria-valuenow": Ie,
                "aria-valuetext": `${Ie} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (o) => {
                  $t.current = {
                    pointerId: o.pointerId,
                    startX: o.clientX,
                    startWidth: Ie
                  }, o.currentTarget.setPointerCapture(o.pointerId);
                },
                onPointerMove: (o) => {
                  const d = $t.current;
                  (d == null ? void 0 : d.pointerId) === o.pointerId && o.currentTarget.hasPointerCapture(o.pointerId) && Zt(
                    d.startWidth + d.startX - o.clientX
                  );
                },
                onPointerUp: () => {
                  $t.current = null;
                },
                onPointerCancel: () => {
                  $t.current = null;
                },
                onKeyDown: zn,
                onDoubleClick: () => Zt(qr),
                children: /* @__PURE__ */ n("span", {})
              }
            ),
            /* @__PURE__ */ u("aside", { className: "dq-actions", children: [
              ue.size > 0 && /* @__PURE__ */ n("strong", { children: Ur }),
              C.actions.map((o, d) => {
                const h = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", w = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, M = w != null ? U.find((W) => W.id === w) : void 0, k = w != null && !M;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    disabled: G || D || !!Ce || h && !ot || "effect" in o && h && (!y || k) || Bt(o) && (ae == null ? void 0 : ae.kind) !== "ready" || !Yn.length,
                    onClick: () => void nr(o),
                    children: [
                      /* @__PURE__ */ u("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: o.label }),
                        "effect" in o ? /* @__PURE__ */ n("small", { children: o.effect.mode === "SKIP" ? "Skip" : o.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : M ? `Assign ${M.name}` : "Unavailable tag group" }) : o.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: o.steps.flatMap(
                          (W, ce) => W.tagIds.map((ye, Pe) => {
                            const Ae = $r[ye] === void 0 ? "Tag" : $r[ye] ?? "Unavailable tag", ut = Jn(W, Ae), Ct = fo(W, Ae);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": Bn(W.mode),
                                "aria-label": Ct,
                                title: `Step ${ce + 1}: ${Ct}`,
                                children: ut
                              },
                              `${ce}-${ye}-${Pe}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      et(o, d) && /* @__PURE__ */ n("kbd", { children: et(o, d) })
                    ]
                  },
                  o.id
                );
              }),
              !C.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              !ot && /* @__PURE__ */ u("p", { children: [
                _ === "tag" ? "Tag" : "Video",
                " write permission is required to apply actions."
              ] }),
              _ === "tag" && I && /* @__PURE__ */ u("p", { children: [
                "Tag groups are unavailable. ",
                I
              ] }),
              G && /* @__PURE__ */ u("p", { role: "status", children: [
                /* @__PURE__ */ n(Sn, { className: "dq-spin" }),
                " Applying action to",
                " ",
                Wn,
                "…"
              ] }),
              /* @__PURE__ */ u("p", { className: "dq-shortcuts", children: [
                "←→↑↓ move · space select · enter ",
                _ === "tag" ? "open" : "preview",
                " · 1–9 apply · A toggle shown · Esc clear"
              ] })
            ] })
          ]
        }
      ),
      jr("bottom")
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
                  ref: wt,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ n("p", { children: "Choose a review to open its queue." }),
              /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                (o) => Re[o.id] !== void 0
              ) ? t.some((o) => Re[o.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: tt,
                    onChange: (o) => qt(
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
                  "aria-label": Me === "asc" ? "Ascending" : "Descending",
                  title: Me === "asc" ? "Ascending" : "Descending",
                  onClick: () => rt(
                    (o) => o === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    vn,
                    {
                      className: Me === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: zt.map((o) => {
            const d = Re[o.id], h = Se(o), w = h === "tag" ? "tag" : h === "performerOccurrence" ? "scene" : "video";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                disabled: G,
                onClick: () => Dt(o.id),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ u("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(jn, { entityType: h }),
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
      /* @__PURE__ */ n(pr, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    R && Ye && j && /* @__PURE__ */ n(
      wo,
      {
        video: Ye,
        review: j,
        targetLabel: Ur,
        pending: G,
        refreshing: D || !!Ce,
        error: Yt,
        canWrite: S,
        assessmentReady: (ae == null ? void 0 : ae.kind) === "ready",
        selected: ue.has(Ye.id),
        hasPrevious: ne.indexOf(Ye.id) > 0,
        hasNext: ne.indexOf(Ye.id) >= 0 && ne.indexOf(Ye.id) < ne.length - 1,
        onToggleSelected: () => dt((o) => Vt(o, Ye.id)),
        onPrevious: () => rr(-1),
        onNext: () => rr(1),
        onClose: () => {
          O(!1), ge(p.current);
        },
        onAction: nr
      }
    ),
    nt && /* @__PURE__ */ n(
      vo,
      {
        reviews: t,
        activeReview: Z,
        tagGroups: U,
        initialEdit: it,
        onSave: ir,
        onChoose: Dt,
        onClose: () => {
          Ue(!1), it && ge(p.current, !1);
        }
      }
    )
  ] });
  async function Ut(o, d, h = !1) {
    const w = p.current, M = Math.max(0, ne.indexOf(w ?? -1));
    try {
      const W = (await Xe(o, d, h)).items.map((ye) => ye.id);
      Ne(
        (ye) => new Set([...ye].filter((Pe) => W.includes(Pe)))
      );
      const ce = Qr(W, w, M);
      l(ce), $.current || ge(ce, !1);
    } catch {
    }
  }
  function ri(o) {
    const d = je.current;
    if (je.current = null, G || D || !C || !Z) return;
    const h = d ?? C.view.objectFilter, w = vr(
      h,
      Z.view.objectFilter
    ) ? Z.view.objectFilter : h, M = be({ ...o, page: 1 }), k = {
      ...C,
      view: {
        ...C.view,
        filter: M,
        objectFilter: w
      }
    }, W = pt(k) !== pt(Z), ce = W ? k : Z;
    Je(W ? k : null), ze(W ? "" : "Review queue defaults restored."), Ut(ce, M, !0);
  }
  function ni() {
    if (G || D || !Z) return;
    je.current = null;
    const o = be({
      ...Z.view.filter,
      page: 1
    });
    Je(null), ze("Review queue defaults restored."), Ut(
      Z,
      o,
      Z.view.startFrom !== "beginning"
    );
  }
  function ii() {
    G || D || !C || !Z || !J || ir(
      t.map(
        (o) => o.id === z ? {
          ...o,
          view: {
            ...C.view,
            filter: { ...H, page: 1 }
          }
        } : o
      )
    ).then(() => {
      Je(null), ze("Queue saved to this review.");
    }).catch(
      (o) => St(
        o instanceof Error ? o.message : "Could not save queue."
      )
    );
  }
  function oi() {
    Ne(/* @__PURE__ */ new Set()), ke.current.clear(), l(null);
  }
  function jr(o) {
    return C ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: G || D,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          gn,
          {
            filter: {
              ...H,
              page: Number(H.page) || 1,
              perPage: Number(H.perPage) || 40
            },
            totalCount: re.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${o}`,
            onFilterChange: (d) => {
              G || D || d.page === Number(H.page) || go(
                { ...H, page: d.page },
                C,
                Xe,
                oi
              );
            }
          }
        )
      }
    ) : null;
  }
  function ai(o) {
    if (_ === "tag") {
      const h = o;
      return /* @__PURE__ */ n(
        ho,
        {
          tag: h,
          displayMode: ee === "list" ? "list" : "grid",
          focused: h.id === fe,
          selected: ue.has(h.id),
          setRef: (w) => {
            w ? Et.current.set(h.id, w) : Et.current.delete(h.id);
          },
          onFocus: () => l(h.id),
          onToggle: () => dt((w) => Vt(w, h.id)),
          onOpen: () => window.open(`/tag/${h.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        h.id
      );
    }
    const d = o;
    return /* @__PURE__ */ n(
      yo,
      {
        video: io(d, j, Ke.ids),
        displayMode: ee,
        focused: d.id === fe,
        selected: ue.has(d.id),
        setRef: (h) => {
          h ? Et.current.set(d.id, h) : Et.current.delete(d.id);
        },
        onFocus: () => l(d.id),
        onToggle: () => dt((h) => Vt(h, d.id)),
        onPreview: () => {
          l(d.id), O(!0);
        },
        onNavigate: e
      },
      d.id
    );
  }
}
function go(e, t, r, i) {
  i(), r(t, e).catch(() => {
  });
}
function Vt(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function mo(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function ho({
  tag: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: a,
  onFocus: c,
  onToggle: s,
  onOpen: f,
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
      onClick: (g) => {
        c(), g.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        li,
        {
          tag: e,
          selected: i,
          onSelect: s,
          onClick: f,
          onNavigate: m
        }
      ) : /* @__PURE__ */ u("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "aria-label": i ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": i,
            onClick: (g) => {
              g.stopPropagation(), s();
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
function yo({
  video: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: a,
  onFocus: c,
  onToggle: s,
  onPreview: f,
  onNavigate: m
}) {
  const g = Kn(e), S = F(null), E = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, b = !!(E.date || E.studioName), A = !!(E.performers.length || E.tags.length);
  return fn(() => {
    const y = S.current;
    if (!y) return;
    const P = y.querySelector(
      `a[href="/video/${e.id}"]`
    ), U = y.querySelector(".card-title"), B = `dq-card-title-${e.id}`;
    U && (U.id = B), P && (P.target = "_blank", P.rel = "noreferrer", P.removeAttribute("aria-label"), P.setAttribute("aria-labelledby", B), P.classList.add("dq-card-link"));
    const I = y.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    I && I.setAttribute(
      "aria-label",
      i ? `Deselect ${g}` : `Select ${g}`
    );
    const te = y.querySelector(
      'button[title="Quick View"]'
    );
    te && te.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (y) => {
        S.current = y, a(y);
      },
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${g}${i ? ", selected" : ""}`,
      onFocus: c,
      onClick: (y) => {
        c(), y.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${t} ${b ? "has-card-metadata" : "no-card-metadata"} ${A ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          di,
          {
            video: E,
            selected: i,
            onSelect: s,
            onNavigate: m,
            onQuickView: f,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t === "wall" && /* @__PURE__ */ n(bo, { video: e })
      ]
    }
  );
}
function bo({ video: e }) {
  const t = F(null), r = F(null), [i, a] = N(!1), [c, s] = N(!1), [f, m] = N(!1);
  return K(() => {
    const g = t.current;
    if (!g || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      a(!0), s(!0);
      return;
    }
    const S = new IntersectionObserver(
      ([b]) => a(b.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), E = new IntersectionObserver(
      ([b]) => s(b.isIntersecting && b.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return S.observe(g), E.observe(g), () => {
      S.disconnect(), E.disconnect();
    };
  }, [e.id, e.files.length]), K(() => {
    if (!i) {
      m(!1);
      return;
    }
    const g = new AbortController();
    return L(xi(e.id), {
      signal: g.signal
    }).then((S) => {
      g.signal.aborted || m(S.available === !0);
    }).catch(() => {
      g.signal.aborted || m(!1);
    }), () => g.abort();
  }, [i, e.id]), K(() => {
    const g = r.current;
    g && (c ? Promise.resolve(g.play()).catch(() => {
    }) : g.pause());
  }, [f, c]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: f && /* @__PURE__ */ n(
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
function wo({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: a,
  error: c,
  canWrite: s,
  assessmentReady: f,
  selected: m,
  hasPrevious: g,
  hasNext: S,
  onToggleSelected: E,
  onPrevious: b,
  onNext: A,
  onClose: y,
  onAction: P
}) {
  const U = F(null), B = F(null), I = e.files[0], te = Kn(e);
  K(() => {
    var q;
    const v = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (q = U.current) == null || q.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = v;
    };
  }, []);
  function J(v) {
    var X, V, he;
    if (v.key !== "Tab") return;
    const q = [
      ...((X = U.current) == null ? void 0 : X.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((se) => se.offsetParent !== null);
    if (!q.length) {
      v.preventDefault(), (V = U.current) == null || V.focus();
      return;
    }
    const x = q.indexOf(
      document.activeElement
    );
    v.shiftKey && x <= 0 ? (v.preventDefault(), (he = q.at(-1)) == null || he.focus()) : !v.shiftKey && x === q.length - 1 && (v.preventDefault(), q[0].focus());
  }
  function T(v) {
    if (v.defaultPrevented || v.ctrlKey || v.metaKey || v.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const q = v.key === "ArrowLeft" || v.key === "ArrowRight";
    if (v.altKey && !q) return;
    const x = B.current, X = v.currentTarget.querySelector("video");
    if (v.key === "Enter" || v.key === "Escape")
      v.repeat || y();
    else if (v.key === " " && x)
      v.repeat || x.toggle();
    else if (q && x)
      x.seekBy(
        (v.key === "ArrowLeft" ? -1 : 1) * (v.shiftKey ? 5 : v.altKey ? 10 : 60)
      );
    else if ((v.key === "," || v.key === ".") && x) {
      const V = [I == null ? void 0 : I.duration, X == null ? void 0 : X.duration].find(
        (se) => se != null && Number.isFinite(se) && se > 0
      ) ?? 0, he = e.parentVideoId != null ? (e.clipEndSec ?? V) - (e.clipStartSec ?? 0) : V;
      Number.isFinite(he) && he > 0 && x.seekBy((v.key === "," ? -1 : 1) * he * 0.1);
    } else if (v.key.toLowerCase() === "n" || v.key.toLowerCase() === "m")
      !v.repeat && !i && !a && (v.key.toLowerCase() === "n" && g && b(), v.key.toLowerCase() === "m" && S && A());
    else if (v.key === "ArrowUp" && X)
      X.volume = Math.min(1, X.volume + 0.1);
    else if (v.key === "ArrowDown" && X)
      X.volume = Math.max(0, X.volume - 0.1);
    else return;
    Te(v);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: U,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${te}`,
      className: "dq-preview",
      onKeyDown: J,
      onKeyDownCapture: T,
      onMouseDown: (v) => {
        v.target === v.currentTarget && y();
      },
      children: /* @__PURE__ */ u("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ u("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !g || i || a,
              onClick: b,
              children: /* @__PURE__ */ n(bn, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !S || i || a,
              onClick: A,
              children: /* @__PURE__ */ n(vn, {})
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
              "aria-label": `Open ${te} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ n(hi, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: y,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(En, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: I ? /* @__PURE__ */ n(
          mn,
          {
            autostart: !0,
            streamUrl: kn(e.id),
            posterUrl: Yr(e),
            format: I.format,
            audioCodec: I.audioCodec,
            duration: I.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (v) => (B.current = v, () => {
              B.current === v && (B.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: Yr(e), alt: "" }) }),
        c && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: c }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((v, q) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: i || a || v.steps.length > 0 && !s || Bt(v) && !f,
            onClick: () => void P(v),
            children: [
              et(v, q) && /* @__PURE__ */ n("kbd", { children: et(v, q) }),
              v.label
            ]
          },
          v.id
        )) })
      ] })
    }
  );
}
function vo({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: i = !1,
  onSave: a,
  onChoose: c,
  onClose: s
}) {
  const [f, m] = N(
    () => i && t ? structuredClone(t) : null
  ), [g, S] = N(""), [E, b] = N(!1), [A, y] = N(
    i && t != null
  ), P = F(null);
  K(() => {
    var q, x;
    const T = document.activeElement, v = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (x = (q = P.current) == null ? void 0 : q.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || x.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = v, T == null || T.focus({ preventScroll: !0 });
    };
  }, []);
  function U(T) {
    var x, X, V;
    if (T.defaultPrevented) {
      T.stopPropagation();
      return;
    }
    if (T.key === "Escape") {
      Te(T), E || s();
      return;
    }
    if (T.key !== "Tab") {
      T.stopPropagation();
      return;
    }
    const v = [
      ...((x = P.current) == null ? void 0 : x.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((he) => he.offsetParent !== null);
    if (!v.length) {
      Te(T), (X = P.current) == null || X.focus();
      return;
    }
    const q = v.indexOf(
      document.activeElement
    );
    T.shiftKey && q <= 0 ? (Te(T), (V = v.at(-1)) == null || V.focus()) : !T.shiftKey && q === v.length - 1 ? (Te(T), v[0].focus()) : T.stopPropagation();
  }
  function B(T, v = !!T) {
    y(v), m(
      T ? structuredClone(T) : {
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
  async function I() {
    if (E) return;
    if (!f || gr(f)) {
      S(f ? gr(f) : "Choose a review.");
      return;
    }
    const T = { ...f, name: f.name.trim() }, v = e.some((q) => q.id === T.id) ? e.map((q) => q.id === T.id ? T : q) : [...e, T];
    b(!0), S("");
    try {
      if (!await a(v)) throw new Error("Could not save reviews.");
      c(T.id), s();
    } catch (q) {
      S(
        "Could not save reviews. Your edits are still open. " + (q instanceof Error ? q.message : "Retry saving.")
      );
    } finally {
      b(!1);
    }
  }
  async function te(T) {
    if (!E) {
      b(!0), S("");
      try {
        if (!await a(T)) throw new Error("Could not save reviews.");
      } catch (v) {
        S(
          v instanceof Error ? v.message : "Could not save reviews."
        );
      } finally {
        b(!1);
      }
    }
  }
  async function J(T) {
    var q;
    if (E) return;
    const v = (q = T.target.files) == null ? void 0 : q[0];
    if (T.target.value = "", !!v) {
      if (v.size > 2e6) {
        S("Review files must be smaller than 2 MB.");
        return;
      }
      b(!0), S("");
      try {
        const x = Tt(await v.text());
        if (!await a(mr(e, x)))
          throw new Error("Could not save reviews.");
      } catch (x) {
        S(
          x instanceof Error ? x.message : "Could not import reviews."
        );
      } finally {
        b(!1);
      }
    }
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: P,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: U,
      children: /* @__PURE__ */ u("div", { className: "dq-manager", children: [
        /* @__PURE__ */ u("header", { children: [
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: f ? e.some((T) => T.id === f.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: E,
              onClick: s,
              children: /* @__PURE__ */ n(En, {})
            }
          )
        ] }),
        g && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: g }),
        /* @__PURE__ */ n("fieldset", { disabled: E, className: "dq-manager-content", children: f ? /* @__PURE__ */ n(
          So,
          {
            draft: f,
            entityTypeLocked: A,
            tagGroups: r,
            saving: E,
            setDraft: m,
            onSave: () => void I(),
            onCancel: s
          }
        ) : /* @__PURE__ */ u(Ee, { children: [
          /* @__PURE__ */ u("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ u(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => B(),
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
                  onChange: J
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((T) => /* @__PURE__ */ u("article", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ u("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(jn, { entityType: Se(T) }),
                /* @__PURE__ */ n("strong", { children: T.name })
              ] }),
              /* @__PURE__ */ n("p", { children: T.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => B(T), children: [
              /* @__PURE__ */ n(wn, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => B({
                  ...structuredClone(T),
                  id: crypto.randomUUID(),
                  name: `${T.name} copy`
                }, !0),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${T.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${T.name}”?`) && te(
                    e.filter((v) => v.id !== T.id)
                  );
                },
                children: /* @__PURE__ */ n(Cn, {})
              }
            )
          ] }, T.id)) })
        ] }) })
      ] })
    }
  );
}
function So({
  draft: e,
  entityTypeLocked: t,
  tagGroups: r,
  saving: i = !1,
  setDraft: a,
  onSave: c,
  onCancel: s
}) {
  const [f, m] = N("Review"), g = Se(e), S = (A) => {
    if (!(t || A === g)) {
      if (A === "performerOccurrence") {
        a({
          id: e.id,
          entityType: A,
          name: e.name,
          description: e.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end" },
          actions: [],
          occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: !0 }
        });
        return;
      }
      a(
        A === "tag" ? {
          id: e.id,
          entityType: "tag",
          name: e.name,
          description: e.description,
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
          id: e.id,
          entityType: "video",
          name: e.name,
          description: e.description,
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
  }, E = F(/* @__PURE__ */ new WeakMap()), b = (A) => {
    let y = E.current.get(A);
    return y || (y = crypto.randomUUID(), E.current.set(A, y)), y;
  };
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      ui,
      {
        tabs: (g === "performerOccurrence" ? ["Review", "Queue", "Actions", ...e.occurrence.tagIds.length ? ["Tag choices"] : []] : ["Review", "Queue", "Appearance", "Actions"]).map((A) => ({
          key: A,
          label: A,
          count: A === "Actions" ? e.actions.length : void 0,
          disabled: i
        })),
        activeTab: f,
        onTabChange: m
      }
    ) }),
    /* @__PURE__ */ u("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ u("section", { hidden: f !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ u("label", { children: [
          "Entity type",
          /* @__PURE__ */ u(
            "select",
            {
              "aria-label": "Entity type",
              value: g,
              disabled: t,
              onChange: (A) => S(A.target.value),
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
              value: e.name,
              onChange: (A) => a({ ...e, name: A.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ u("label", { children: [
          "Description",
          /* @__PURE__ */ n(
            "textarea",
            {
              "aria-label": "Description",
              value: e.description,
              onChange: (A) => a({ ...e, description: A.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u("section", { hidden: f !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ n(on, { draft: e, onChange: a, presentation: !1 }),
        e.entityType === "performerOccurrence" && /* @__PURE__ */ n(nn, { review: e, onChange: a })
      ] }),
      e.entityType === "performerOccurrence" && /* @__PURE__ */ n("section", { hidden: f !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n(nn, { review: e, onChange: a, choices: !0 }) }),
      /* @__PURE__ */ n("section", { hidden: f !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(on, { draft: e, onChange: a, queue: !1 }) }),
      /* @__PURE__ */ n("section", { hidden: f !== "Actions", className: "dq-editor-section", children: g === "tag" ? /* @__PURE__ */ n(
        Co,
        {
          draft: e,
          saving: i,
          tagGroups: r,
          setDraft: a
        }
      ) : /* @__PURE__ */ n(
        Eo,
        {
          draft: e,
          saving: i,
          stepKey: b,
          rememberStepKey: (A, y) => E.current.set(A, b(y)),
          setDraft: a
        }
      ) })
    ] }),
    /* @__PURE__ */ u("div", { className: "dq-editor-footer", children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const A = URL.createObjectURL(
              new Blob([JSON.stringify([e], null, 2)], {
                type: "application/json"
              })
            ), y = document.createElement("a");
            y.href = A, y.download = "data-quality-review.json", y.click(), URL.revokeObjectURL(A);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: s, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: c, children: "Save review" })
    ] })
  ] });
}
function Qn({
  action: e,
  index: t,
  onChange: r
}) {
  return /* @__PURE__ */ u("div", { className: "dq-field-grid", children: [
    /* @__PURE__ */ u("label", { children: [
      "Shortcut",
      /* @__PURE__ */ u(
        "select",
        {
          value: e.shortcut ?? "auto",
          onChange: (i) => r({
            ...e,
            shortcut: i.target.value === "auto" ? void 0 : i.target.value
          }),
          children: [
            /* @__PURE__ */ u("option", { value: "auto", children: [
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
    /* @__PURE__ */ u("label", { children: [
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
function Eo({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: i,
  setDraft: a
}) {
  const c = (s, f) => a({
    ...e,
    actions: e.actions.map(
      (m, g) => g === s ? f : m
    )
  });
  return /* @__PURE__ */ u(Ee, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    e.entityType === "performerOccurrence" && /* @__PURE__ */ n("p", { children: "Actions apply only to the active performer in this scene. Choose performers with the temporary filter while reviewing." }),
    /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      ur,
      {
        items: e.actions,
        getKey: (s) => s.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (s) => a({ ...e, actions: s }),
        renderItem: (s, { index: f, dragHandleProps: m, isOver: g }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: g ? "dq-action-card dq-drag-over" : "dq-action-card",
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
                    ...m,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${f + 1}`,
                    children: /* @__PURE__ */ n(Nr, {})
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
                          label: s.label + " copy",
                          shortcut: ""
                        },
                        ...e.actions.slice(f + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                Qn,
                {
                  action: s,
                  index: f,
                  onChange: (S) => c(f, S)
                }
              ),
              /* @__PURE__ */ n(
                ur,
                {
                  items: s.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (S) => c(f, { ...s, steps: S }),
                  renderItem: (S, E) => /* @__PURE__ */ n(
                    No,
                    {
                      occurrence: e.entityType === "performerOccurrence",
                      dragHandleProps: E.dragHandleProps,
                      saving: t,
                      isOver: E.isOver,
                      step: S,
                      index: E.index,
                      onChange: (b) => {
                        i(b, S), c(f, {
                          ...s,
                          steps: s.steps.map(
                            (A, y) => y === E.index ? b : A
                          )
                        });
                      },
                      onRemove: () => c(f, {
                        ...s,
                        steps: s.steps.filter(
                          (b, A) => A !== E.index
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
                    onClick: () => c(f, {
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
function Co({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: i
}) {
  const a = (c, s) => i({
    ...e,
    actions: e.actions.map(
      (f, m) => m === c ? s : f
    )
  });
  return /* @__PURE__ */ u(Ee, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      ur,
      {
        items: e.actions,
        getKey: (c) => c.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (c) => i({ ...e, actions: c }),
        renderItem: (c, { index: s, dragHandleProps: f, isOver: m }) => /* @__PURE__ */ u(
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
                    ...f,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${s + 1}`,
                    children: /* @__PURE__ */ n(Nr, {})
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
                          label: c.label + " copy",
                          shortcut: ""
                        },
                        ...e.actions.slice(s + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                Qn,
                {
                  action: c,
                  index: s,
                  onChange: (g) => a(s, g)
                }
              ),
              /* @__PURE__ */ u("label", { children: [
                "Action effect",
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: c.effect.mode === "SET_TAG_GROUP" ? `group:${c.effect.tagGroupId}` : c.effect.mode,
                    onChange: (g) => {
                      const S = g.target.value;
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
                      (g, S) => S !== s
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
function No({
  occurrence: e = !1,
  step: t,
  index: r,
  dragHandleProps: i,
  saving: a,
  isOver: c,
  onChange: s,
  onRemove: f
}) {
  const m = Bn(t.mode);
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
            children: /* @__PURE__ */ n(Nr, {})
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
            onChange: (g) => s({ ...t, mode: g.target.value }),
            children: [
              /* @__PURE__ */ n("option", { value: "ADD", children: "Add tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE", children: "Remove tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE_TREE", children: "Remove tags and descendants" }),
              !e && /* @__PURE__ */ u(Ee, { children: [
                /* @__PURE__ */ n("option", { value: "MARK_PRESENT", children: "Mark present" }),
                /* @__PURE__ */ n("option", { value: "MARK_ABSENT", children: "Mark absent" }),
                /* @__PURE__ */ n("option", { value: "CLEAR_ABSENCE", children: "Clear absence" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ n("div", { className: "dq-step-tags", children: /* @__PURE__ */ n(
          _e,
          {
            entityType: "tag",
            values: t.tagIds,
            onChange: (g) => s({ ...t, tagIds: g }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: f, children: /* @__PURE__ */ n(Cn, {}) })
      ]
    }
  );
}
async function Ao() {
  const e = await L("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
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
function dn({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(Sn, { className: "dq-spin" }),
    e
  ] });
}
function un({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(fr, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const ko = { components: { DataQualityPage: po } };
export {
  po as DataQualityPage,
  ko as default,
  vr as objectFiltersEqual
};
