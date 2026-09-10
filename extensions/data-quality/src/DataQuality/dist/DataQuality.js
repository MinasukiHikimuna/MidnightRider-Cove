import { jsxs as u, jsx as n, Fragment as Pe } from "react/jsx-runtime";
import { useRef as P, useState as E, useEffect as V, useMemo as At, useCallback as ut, useLayoutEffect as mn } from "react";
import { DetailListToolbar as yr, VIDEO_SORT_OPTIONS as Ir, VIDEO_CRITERIA as er, EntityReferenceMultiSelector as He, PERFORMER_CRITERIA as zr, FilterDialog as hn, DetailListPagination as yn, VideoPlayer as bn, TAG_SORT_OPTIONS as wn, TAG_CRITERIA as vn, EntityDetailTabs as fi, TagTile as pi, VideoCard as gi, SortableList as br } from "@cove/runtime/components";
import { ChevronLeft as Sn, Pencil as En, Settings as mi, AlertTriangle as wr, Save as hi, RotateCcw as yi, ChevronRight as Cn, Film as vr, Loader2 as Nn, Tags as bi, ExternalLink as wi, X as An, Plus as vi, Upload as Si, Trash2 as Tn, GripVertical as Or } from "@cove/runtime/lucide-react";
import { extensionFetch as Ei } from "@cove/runtime/api";
function ke(e) {
  return e.entityType ?? "video";
}
function ft(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function tr(e) {
  if (e.entityType === "performerOccurrence") {
    if (!qn(e.occurrence))
      return "Complete the optional occurrence condition before saving.";
    if (e.actions.some((r) => r.steps.some((i) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(i.mode))))
      return "Occurrence actions support adding and removing tags on the active performer. Video tag assessments are not supported here.";
  }
  if (ke(e) === "video" && e.actions.some(
    (r) => Rn(r)
  ))
    return "An action cannot contain contradictory assessments for the same tag.";
  if (!e.name.trim() || !e.actions.every((r) => Rt(r, ke(e))))
    return "Name the review and complete every action step before saving.";
  if (new Set(e.actions.map((r) => r.id)).size !== e.actions.length)
    return "Action IDs must be unique within a review.";
  const t = e.actions.map(
    (r, i) => r.shortcut ?? (i < 9 ? String(i + 1) : "")
  ).filter(Boolean);
  return t.some((r) => !/^[1-9]$/.test(r)) || new Set(t).size !== t.length ? "Assign each shortcut 1–9 only once, or choose None. Navigation and player keys are reserved." : "";
}
function Ae(e) {
  const t = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(1e3, t(e.perPage, 40)))
  };
}
function Hr(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function Ct(e) {
  const { page: t, ...r } = e.view.filter, i = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    e.entityType === "performerOccurrence" ? ["performerOccurrence", ...i, e.occurrence] : ke(e) === "tag" ? ["tag", ...i] : i
  );
}
function Rt(e, t) {
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
  ) && !Rn(e) : !1;
}
function rr(e) {
  return "steps" in e ? e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  ) : !1;
}
function Rn(e) {
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
function Ut(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || r.entityType === "video" || r.entityType === "tag" || r.entityType === "performerOccurrence") && (r.entityType !== "performerOccurrence" || qn(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Ci(r.presentation, r.entityType === "tag") && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (r.entityType === "tag" ? "effect" in i && !("steps" in i) && Rt(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (s) => s && Array.isArray(s.tagIds)
      ) && Rt(i, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => tr(r)))
    throw new Error(
      "Saved reviews contain invalid actions or shortcuts. Existing data has been kept; assign shortcuts 1–9 only once or leave them empty."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Ci(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const r = e;
  return (r.cardSize === void 0 || r.cardSize === null || Number.isFinite(r.cardSize) && r.cardSize >= 115 && r.cardSize <= 380) && (!t || r.annotations === void 0 && r.annotationParents === void 0 && r.binParents === void 0) && (r.annotations === void 0 || Array.isArray(r.annotations) && r.annotations.every(
    (i) => ["date", "studio", "performers", "tags"].includes(i)
  )) && [r.annotationParents, r.binParents].every(
    (i) => i === void 0 || Array.isArray(i) && i.every((s) => Number.isSafeInteger(s) && s > 0)
  );
}
function Sr(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const s of i)
      r.has(s.id) || (r.add(s.id), t.push(s));
  return t;
}
function qn(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (i) => Array.isArray(i) && i.every((s) => Number.isSafeInteger(s) && s > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && (t.targetMode !== "selected" || t.performerIds.length > 0) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && ["any", "includes", "includesAll", "excludes", "isNull"].includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && r(t.tagIds) && typeof t.multiple == "boolean";
}
function Xr(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function Yr(e, t, r, i) {
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
function Ni(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((s) => r.has(s));
  for (const s of t)
    i ? r.delete(s) : r.add(s);
  return r;
}
function In(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const On = "ext:com.midnightrider.data-quality:configuration", Ai = "ext:cove-data-quality:video-reviews", Er = "ext:com.midnightrider.data-quality:progress", jt = /* @__PURE__ */ new Map(), Xt = /* @__PURE__ */ new Map(), Nt = (e, t) => e.includes("*") || e.includes(t), nr = (e) => _(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Ti = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Cr(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Tt(e) {
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
    reviews: Ut(JSON.stringify(t.reviews)),
    deletedIds: Cr(t.deletedIds),
    importedIds: Cr(t.importedIds)
  };
}
function Ri(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const s of t) {
    const c = localStorage.getItem(s);
    if (c !== null) {
      const a = Ut(c);
      r ?? (r = a), a.forEach((f) => i.add(f.id));
    }
    Cr(
      JSON.parse(localStorage.getItem(`${s}:account-imports`) ?? "[]")
    ).forEach((a) => i.add(a));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function kn(e) {
  const t = await _("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Pn(e, t) {
  const r = (Xt.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Xt.set(e, r), r.finally(() => {
    Xt.get(e) === r && Xt.delete(e);
  }).catch(() => {
  }), r;
}
let Lt = null;
function qi() {
  if (Lt) return Lt;
  const e = Ii();
  return Lt = e, e.finally(() => {
    Lt === e && (Lt = null);
  }).catch(() => {
  }), e;
}
async function Ii() {
  var v;
  const e = await _("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = Nt(e.permissions, "savedfilters.read"), s = i && Nt(e.permissions, "savedfilters.write"), c = i ? (await nr(On)).filter((q) => q.name === "Data Quality configuration").sort((q, R) => q.id - R.id) : [];
  if (c.length > 1) {
    const q = (R) => {
      const { revision: I, ...A } = Tt(R.uiOptions);
      return JSON.stringify(A);
    };
    if (c.some((R) => q(R) !== q(c[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (s)
      for (const R of c.slice(1))
        await _(`/api/savedfilters/${R.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${R.id}` })
        });
    c.splice(1);
  }
  let a = c.length ? Tt(c[0].uiOptions) : Ti();
  const f = localStorage.getItem(`${r}:migrated`) === "true", p = localStorage.getItem(r), m = localStorage.getItem(`${r}:local-only`) === "true";
  !c.length && p && (a = Tt(p));
  let C = !c.length;
  if (c.length && m && p) {
    const q = Tt(p);
    if (q.reviews.some((I) => {
      const A = a.reviews.find((W) => W.id === I.id);
      return A && JSON.stringify(A) !== JSON.stringify(I);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const R = [
      .../* @__PURE__ */ new Set([...a.deletedIds, ...q.deletedIds])
    ];
    a = {
      ...a,
      reviews: Sr(a.reviews, q.reviews).filter(
        (I) => !R.includes(I.id)
      ),
      deletedIds: R,
      importedIds: [
        .../* @__PURE__ */ new Set([...a.importedIds, ...q.importedIds])
      ]
    }, C = !0;
  }
  if (!f) {
    const q = JSON.stringify(a), R = Ri(t);
    if (c.length && R.reviews.some((T) => {
      const Z = a.reviews.find((re) => re.id === T.id);
      return Z && JSON.stringify(Z) !== JSON.stringify(T);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const I = i ? (await nr(Ai)).flatMap(
      (T) => Ut(T.uiOptions ?? "[]")
    ) : [], A = R.known.filter(
      (T) => !R.reviews.some((Z) => Z.id === T)
    ), W = /* @__PURE__ */ new Set([...a.deletedIds, ...A]);
    a = {
      ...a,
      reviews: Sr(
        R.reviews,
        a.reviews,
        I.filter(
          (T) => !R.known.includes(T.id) && !a.importedIds.includes(T.id)
        )
      ).filter((T) => !W.has(T.id)),
      deletedIds: [...W],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...a.importedIds,
          ...R.known,
          ...I.map((T) => T.id)
        ])
      ]
    }, C || (C = JSON.stringify(a) !== q);
  }
  const S = {
    userId: t,
    recordId: (v = c[0]) == null ? void 0 : v.id,
    config: a,
    readable: i,
    writable: s,
    durable: s
  };
  if (jt.set(r, S), C && s) {
    const q = a;
    c.length && (S.config = Tt(c[0].uiOptions)), await Mn(r, q), a = S.config;
  } else c.length || (localStorage.setItem(r, JSON.stringify(a)), !i && (!f || m) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (s)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: a.reviews,
    storageKey: r,
    canWrite: Nt(e.permissions, "videos.write"),
    canWriteVideos: Nt(e.permissions, "videos.write"),
    canWriteTags: Nt(e.permissions, "tags.write"),
    canReadTagGroups: Nt(e.permissions, "taggroups.read"),
    canConfigure: !i || s,
    storageNotice: i ? s ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Mn(e, t) {
  const r = jt.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await kn(r), r.recordId != null) {
      const c = await _(
        `/api/savedfilters/${r.recordId}`
      );
      if (Tt(c.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const s = await _(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: On,
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
function Oi(e, t) {
  return Ut(JSON.stringify(t)), Pn(e, async () => {
    const r = jt.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((s) => !t.some((c) => c.id === s.id)).map((s) => s.id);
    await Mn(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((s) => !t.some((c) => c.id === s))
    });
  });
}
function Zr(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([r, i]) => /^[1-9]\d*:[1-9]\d*$/.test(r) && ["reviewed", "cannotDetermine"].includes(String(i)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function ki(e, t) {
  const r = jt.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), s = i ? Zr(i) : null;
  if (!r.readable) return s;
  const c = (await nr(Er)).find(
    (f) => f.name === t
  ), a = c ? Zr(c.uiOptions) : null;
  return s && (!a || s.updatedAt > a.updatedAt) ? s : a;
}
function Pi(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return Pn(i, async () => {
    const s = jt.get(e);
    if (!(s != null && s.writable)) return;
    await kn(s);
    const c = (await nr(Er)).find(
      (a) => a.name === t
    );
    await _(
      c ? `/api/savedfilters/${c.id}` : "/api/savedfilters",
      {
        method: c ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Er,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Xe = "confirmed_absent_tags", kr = "Confirmed absent tags", Mi = {
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
function qt(e) {
  return Array.isArray(e) ? e.map(qt) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? Mi[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === Xe.toLowerCase() ? r.toLowerCase() : qt(r)
    ])
  ) : e;
}
async function _(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await Ei(e, { ...t, headers: r });
  if (!i.ok) {
    let c = i.statusText || `Request failed (${i.status}).`;
    try {
      const a = await i.json();
      c = a.message || a.detail || a.error || c;
    } catch {
    }
    throw new Error(c);
  }
  if (i.status === 204 || i.status === 205) return;
  const s = await i.text();
  return s ? JSON.parse(s) : void 0;
}
const Fi = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let $i = 0;
function or(e) {
  return _(`/api/videos/${e}?dqRead=${Fi}-${++$i}`, { cache: "no-store" });
}
async function Dt(e, t, r) {
  const i = { ...e.view.objectFilter }, s = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return _("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      qt({
        findFilter: Ae(t),
        objectFilter: i,
        filterExpression: s
      })
    )
  });
}
async function en(e, t, r) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, _("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      qt({
        findFilter: Ae(t),
        objectFilter: i
      })
    )
  });
}
function xi(e) {
  return _("/api/taggroups", { signal: e });
}
function Li(e) {
  return `/api/videos/${e.id}/image?max=1280&v=${encodeURIComponent(e.updatedAt)}`;
}
function Fn(e) {
  return `/api/stream/video/${e}`;
}
function tn(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function _i(e) {
  return `/api/stream/video/${e}/preview`;
}
function Di(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Ui(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Kt(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await _(`/api/tags/${r}`), t.add(r);
    for (let i = 1; ; i++) {
      const s = await _("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          qt({
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
      for (const c of s.items) t.add(c.id);
      if (i * 1e3 >= s.totalCount) break;
      if (!s.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...t];
}
function ji(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${Xe} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function Pr() {
  const t = (await _("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === Xe.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${kr} custom field before applying tag assessments.`
    };
  const r = ji(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function Ki() {
  const e = await Pr();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await _("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: Xe,
        label: kr,
        type: "tag",
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function ir(e) {
  return [...new Set(e)];
}
function Vi(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${Xe} value is not a valid tag list.`
    );
  return ir(e);
}
function Gi(e) {
  return ir(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function Bi(e, t) {
  let r;
  try {
    r = await Pr();
  } catch (m) {
    throw new Error(
      `Could not verify the ${kr} custom field. ${m instanceof Error ? m.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const i = await Promise.all(
    e.steps.map(async (m) => ({
      ...m,
      tagIds: m.mode === "REMOVE_TREE" ? await Kt(m.tagIds) : ir(m.tagIds)
    }))
  ), s = i.filter(
    (m) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(m.mode)
  ), c = i.filter(
    (m) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(m.mode)
  ), a = ir(t), f = r.definition.key;
  let p = 0;
  for (const m of a)
    try {
      const C = await or(m), S = Gi(C), v = { ...C.customFields ?? {} }, q = v[f], R = Vi(q), I = new Set(S), A = new Set(R);
      for (const re of s)
        for (const ce of re.tagIds)
          re.mode === "ADD" ? I.add(ce) : I.delete(ce);
      for (const re of c)
        for (const ce of re.tagIds)
          re.mode === "MARK_PRESENT" ? (I.add(ce), A.delete(ce)) : re.mode === "MARK_ABSENT" ? (I.delete(ce), A.add(ce)) : A.delete(ce);
      const W = [...I], T = [...A];
      JSON.stringify(S) === JSON.stringify(W) && JSON.stringify(R) === JSON.stringify(T) && (q === void 0 ? T.length === 0 : JSON.stringify(q) === JSON.stringify(R)) || await _(`/api/videos/${m}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: W,
          customFields: {
            ...v,
            [f]: T
          }
        })
      }), p++;
    } catch (C) {
      throw new Error(
        `Assessment stopped after ${p} video${p === 1 ? "" : "s"} completed; video ${m} was affected. Refresh and inspect it before retrying. ${C instanceof Error ? C.message : "Request failed."}`
      );
    }
}
async function $n(e, t) {
  if (!Rt(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (rr(e)) {
    await Bi(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (i) => ({
      mode: i.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: i.mode === "REMOVE_TREE" ? await Kt(i.tagIds) : i.tagIds
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
    } catch (s) {
      throw new Error(
        `Step ${i + 1} failed; ${i} earlier step(s) completed. Refresh and check the selected videos before retrying. ${s instanceof Error ? s.message : "Request failed."}`
      );
    }
}
async function Ji(e, t) {
  if (!Rt(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await _("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
async function Wi(e, t, r) {
  if (!Rt(r) || r.steps.some(
    (c) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(c.mode)
  ))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const i = await Promise.all(
    r.steps.map(async (c) => ({
      ...c,
      tagIds: c.mode === "REMOVE_TREE" ? await Kt(c.tagIds) : c.tagIds
    }))
  );
  let s = t.applications;
  for (const c of i)
    s = await _n(
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
async function xn(e, t) {
  const r = e.occurrence;
  if (r.targetMode === "all" || r.targetMode === "filter" && Object.keys(r.performerFilter).length === 0) return null;
  if (r.targetMode === "selected") return r.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: s, ...c } = r.performerFilter;
  for (let a = 1; ; a++) {
    const f = await _("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        qt({
          findFilter: { page: a, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: c,
          filterExpression: s
        })
      )
    });
    if (f.items.forEach((p) => i.add(p.id)), a * 1e3 >= f.totalCount) return [...i];
    if (!f.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Ln(e, t) {
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
function Qi(e, t) {
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
async function zi(e, t, r, i) {
  if ((t == null ? void 0 : t.length) === 0)
    return { items: [], totalCount: 0 };
  const s = await Dt(
    Ln(e, t),
    { ...e.view.filter, page: r },
    i
  ), c = t === null ? null : new Set(t), a = new Array(s.items.length);
  let f = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, s.items.length) }, async () => {
      for (; f < s.items.length; ) {
        const p = f++, m = s.items[p], C = await _(
          `/api/tagapplications?hostType=video&hostId=${m.id}&contextType=performer`,
          { signal: i }
        );
        a[p] = m.performers.filter((S) => c === null || c.has(S.id)).flatMap((S) => {
          const v = C.filter(
            (q) => q.hostType === "video" && q.hostId === m.id && q.contextType === "performer" && q.contextId === S.id
          );
          return Qi(
            e.occurrence,
            v.map((q) => q.tag.id)
          ) ? [
            {
              key: `${m.id}:${S.id}`,
              video: m,
              performer: S,
              applications: v
            }
          ] : [];
        });
      }
    })
  ), { items: a.flat(), totalCount: s.totalCount };
}
async function _n(e, t, r) {
  const i = new Set(e.occurrence.tagIds);
  if (r.some((p) => !i.has(p)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const s = await or(t.video.id);
  if (!s.performers.some(
    (p) => p.id === t.performer.id
  ))
    throw new Error(
      "This performer is no longer linked to the scene. Refresh the queue."
    );
  const c = `/api/tagapplications?hostType=video&hostId=${s.id}&contextType=performer&contextId=${t.performer.id}`, a = (await _(c)).filter(
    (p) => p.hostType === "video" && p.hostId === s.id && p.contextType === "performer" && p.contextId === t.performer.id
  ), f = new Set(r);
  try {
    for (const p of f)
      a.some((m) => m.tag.id === p) || await _("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: "video",
          hostId: s.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: p,
          sourceKey: "user"
        })
      });
    for (const p of a)
      i.has(p.tag.id) && !f.has(p.tag.id) && await _(`/api/tagapplications/${p.id}`, {
        method: "DELETE"
      });
    return await _(c);
  } catch (p) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${p instanceof Error ? p.message : "Request failed."}`
    );
  }
}
const Mr = [
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
], Hi = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: []
};
function Nr(e) {
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
        conditionTagIds: [...t.conditionTagIds]
      }
    } : {}
  };
}
function rn(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function nn(e, t) {
  if (!Mr.some((a) => t.has(a))) {
    const a = Nr(e);
    return { query: a, startAtEnd: a.startFrom === "end" };
  }
  const i = {
    q: t.get("q") ?? "",
    page: Number(t.get("page") ?? 1),
    perPage: Number(t.get("perPage") ?? 40),
    sort: t.get("sort") ?? "date",
    direction: t.get("direction") === "asc" ? "asc" : "desc"
  };
  if (t.has("seed") && (i.seed = Number(t.get("seed"))), t.get("sorts")) {
    const a = t.get("sorts").split(",").map((f) => {
      const p = f.lastIndexOf(":");
      return { key: f.slice(0, p), direction: f.slice(p + 1) };
    });
    if (a.some((f) => !f.key || !["asc", "desc"].includes(f.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = a, i.sort = a[0].key, i.direction = a[0].direction;
  }
  let s;
  if (e.entityType === "performerOccurrence" && (s = {
    ...Hi,
    ...rn(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(s.targetMode) || !["any", "includes", "includesAll", "excludes", "isNull"].includes(
    s.condition
  ) || !Array.isArray(s.performerIds) || !Array.isArray(s.conditionTagIds) || [...s.performerIds, ...s.conditionTagIds].some(
    (a) => !Number.isSafeInteger(a) || a <= 0
  ) || !s.performerFilter || typeof s.performerFilter != "object" || Array.isArray(s.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const c = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Ae(i),
      objectFilter: rn(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: c,
      performerScope: s
    },
    startAtEnd: !t.has("page") && c === "end"
  };
}
function Yt(e, t) {
  const r = new URLSearchParams(window.location.search);
  Mr.forEach((i) => r.delete(i)), r.set("review", e);
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
function _t(e, t) {
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
function Ar(e, t) {
  return {
    added: t.filter((r) => !e.includes(r)),
    removed: e.filter((r) => !t.includes(r))
  };
}
function Xi(e) {
  return `/api/tagapplications?hostType=video&hostId=${e.video.id}&contextType=performer&contextId=${e.occurrence.performer.id}`;
}
async function ze(e) {
  var c;
  if (e.occurrence) {
    const a = (await _(Xi(e))).filter(
      (f) => f.hostType === "video" && f.hostId === e.video.id && f.contextType === "performer" && f.contextId === e.occurrence.performer.id
    );
    return {
      ids: [...new Set(a.map((f) => f.tag.id))],
      names: [...new Set(a.map((f) => f.tag.name))],
      absent: [],
      applications: a
    };
  }
  const t = await or(e.video.id), r = (t.tags ?? []).filter(
    (a) => a.canRemove !== !1 || a.isDerived !== !0
  ), i = Object.keys(t.customFields ?? {}).find(
    (a) => a.toLowerCase() === Xe
  ) ?? Xe, s = ((c = t.customFields) == null ? void 0 : c[i]) ?? [];
  if (!Array.isArray(s) || s.some((a) => !Number.isSafeInteger(a)))
    throw new Error(
      "Confirmed absent tags are invalid. Inspect the video before editing."
    );
  return { ids: r.map((a) => a.id), names: r.map((a) => a.name), absent: s };
}
async function Dn(e, t, r) {
  if (t.occurrence && e.entityType === "performerOccurrence")
    await _n(
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
      s.length && await _("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({ ids: [t.video.id], tagMode: i, tagIds: s })
      });
}
async function Yi(e, t, r) {
  t.occurrence && e.entityType === "performerOccurrence" ? await Wi(e, t.occurrence, r) : await $n(r, [t.video.id]);
}
async function Zi(e) {
  return [
    ...new Set(
      (await Promise.all(
        e.steps.map(
          (t) => t.mode === "REMOVE_TREE" ? Kt(t.tagIds) : t.tagIds
        )
      )).flat()
    )
  ];
}
function eo(e, t, r, i) {
  const s = (c) => c.filter((a) => i.includes(a));
  return {
    item: e,
    before: t,
    after: r,
    tags: Ar(s(t.ids), s(r.ids)),
    absence: Ar(s(t.absent), s(r.absent))
  };
}
function on(e, t) {
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
      const s = (r = e.after.applications) == null ? void 0 : r.filter((a) => a.tag.id === i).map((a) => a.id).sort(), c = t.applications.filter((a) => a.tag.id === i).map((a) => a.id).sort();
      if (JSON.stringify(s) !== JSON.stringify(c))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
async function to(e, t) {
  const r = await ze(t.item);
  if (on(t, r), t.absence.added.length || t.absence.removed.length) {
    const i = await or(t.item.video.id), s = await ze(t.item), c = Object.keys(i.customFields ?? {}).find(
      (a) => a.toLowerCase() === Xe
    ) ?? Xe;
    on(t, s), await _(`/api/videos/${i.id}`, {
      method: "PUT",
      body: JSON.stringify({
        tagIds: [
          ...s.ids.filter((a) => !t.tags.added.includes(a)),
          ...t.tags.removed
        ],
        customFields: {
          ...i.customFields,
          [c]: [
            ...s.absent.filter(
              (a) => !t.absence.added.includes(a)
            ),
            ...t.absence.removed
          ]
        }
      })
    });
  } else
    await Dn(e, t.item, {
      added: t.tags.removed,
      removed: t.tags.added
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
function Fr(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function no(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function Un(e) {
  return [
    ...new Set(
      Fr(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function jn(e, t) {
  const r = Fr(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((i) => {
      const s = String(i.key ?? ""), c = ro[String(i.modifier ?? "EQUALS")], a = (S, v) => String(v ?? "").trim() || t[String(S)] || String(S ?? ""), f = a(
        i.value,
        i.displayValue
      ), p = a(
        i.value2,
        i.displayValue2
      ), m = String(i.modifier ?? "EQUALS"), C = m === "IS_NULL" || m === "NOT_NULL" ? [] : m === "BETWEEN" || m === "NOT_BETWEEN" ? [f, "and", p] : [f];
      return {
        ...i,
        label: [no(s), c, ...C].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function Kn(e) {
  const t = Fr(e.customFieldCriteria);
  return t.length ? {
    ...e,
    customFieldCriteria: t.map(
      ({ label: r, ...i }) => i
    )
  } : e;
}
function Vn(e, t, r) {
  return r || "customFieldCriteria" in t || !Array.isArray(e.customFieldCriteria) ? t : { ...t, customFieldCriteria: e.customFieldCriteria };
}
function an({
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
function mr(e, t) {
  if (!t) return e;
  const r = /* @__PURE__ */ new Map();
  for (const i of e)
    r.set(i.video.id, [...r.get(i.video.id) ?? [], i]);
  return [...r.values()].reverse().flat();
}
const De = (e) => e instanceof Error ? e.message : "Request failed.";
function io({
  actions: e,
  disabled: t,
  canWrite: r,
  onApply: i
}) {
  const [s, c] = E({});
  V(() => {
    let f = !0;
    return Promise.all(
      [
        ...new Set(
          e.flatMap(
            (p) => p.steps.flatMap((m) => m.tagIds)
          )
        )
      ].map(async (p) => {
        try {
          return [
            p,
            (await _(`/api/tags/${p}`)).name
          ];
        } catch {
          return [p, "Unavailable tag"];
        }
      })
    ).then((p) => {
      f && c(Object.fromEntries(p));
    }), () => {
      f = !1;
    };
  }, [e]);
  const a = {
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
          onClick: (m) => i(f, m.shiftKey),
          children: /* @__PURE__ */ u("span", { children: [
            /* @__PURE__ */ n("kbd", { children: ft(f, p) }),
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
        (m) => `${a[m.mode]}: ${m.tagIds.map((C) => s[C] ?? "Loading tag…").join(", ")}`
      ).join("; ") })
    ] }, f.id))
  ] });
}
function oo({
  review: e,
  canWrite: t,
  onBusy: r,
  onSaveDefaults: i,
  editRequest: s = 0,
  renderRuleEditor: c
}) {
  var Pt, We, Bt, B;
  const a = P(null), f = P("");
  if (!a.current)
    try {
      a.current = nn(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (l) {
      f.current = De(l), a.current = { query: Nr(e), startAtEnd: !1 };
    }
  const [p, m] = E(null), C = P(null), S = P(null), v = P(null), [q, R] = E(!!f.current), I = P(0), [A, W] = E(a.current.query), T = P(A);
  T.current = A;
  const [Z, re] = E(0), ce = P(a.current.startAtEnd), [g, O] = E([]), [N, x] = E(null), [le, ne] = E(0), [Q, it] = E(!1), [K, Ye] = E(!1), fe = P(!1), Te = P(!0), Re = P(null);
  V(() => (Te.current = !0, () => {
    Te.current = !1;
  }), []);
  const [It, H] = E(f.current), [Vt, qe] = E(""), [de, Le] = E(null), [Se, ot] = E(!1), [at, Ot] = E([]), kt = P([]), me = P(null), Ue = P(null), X = P(null);
  V(() => {
    var l, h;
    Se && ((h = (l = X.current) == null ? void 0 : l.querySelector("input")) == null || h.focus());
  }, [Se]);
  const [w, U] = E(null), [G, Ze] = E(!1);
  V(() => {
    if (Q || G || !Ue.current) return;
    const l = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const h = Ue.current;
      h != null && h.isConnected && !h.disabled && h.focus(), Ue.current = null;
    });
    return () => cancelAnimationFrame(l);
  }, [Q, G, Z]);
  const [pt, Ve] = E([]), [gt, ie] = E({}), Ie = P(null), mt = P(0), et = P(!1), [Ee, ht] = E({});
  V(() => {
    let l = !0;
    return Promise.all(
      Un(A.objectFilter).map(
        async (h) => [
          String(h),
          (await _(`/api/tags/${h}`)).name
        ]
      )
    ).then((h) => {
      l && ht(Object.fromEntries(h));
    }).catch(() => {
    }), () => {
      l = !1;
    };
  }, [A.objectFilter]);
  const L = P(0), tt = P(e);
  tt.current = e;
  const Ce = p ?? e, je = At(
    () => _t(Ce, A),
    [Ce, A]
  ), ar = P(je);
  ar.current = je;
  const Ge = K || Q || Se, Ne = Number(A.filter.page);
  function oe(l, h = !1) {
    fe.current || (f.current = "", ce.current = h, T.current = l, W(l), ne(0), it(!0), h || Yt(e.id, l), re((k) => k + 1));
  }
  function rt() {
    if (fe.current = !1, Ye(!1), Te.current && Re.current) {
      const l = Re.current;
      Re.current = null, oe(l.query, l.startAtEnd);
    }
  }
  V(() => {
    const l = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const h = nn(
            tt.current,
            new URLSearchParams(window.location.search)
          );
          fe.current ? Re.current = h : oe(h.query, h.startAtEnd);
        } catch (h) {
          H(De(h));
        }
    };
    return window.addEventListener("popstate", l), () => window.removeEventListener("popstate", l);
  }, [e.id]), V(() => (r(K || Q || Se || !!p), () => r(!1)), [K, Q, Se, !!p, r]);
  async function Me(l, h, k) {
    if (l.entityType === "performerOccurrence") {
      const j = await zi(
        l,
        Ie.current,
        h,
        k
      );
      return {
        items: j.items.map((D) => ({
          key: D.key,
          video: D.video,
          occurrence: D
        })),
        totalCount: j.totalCount
      };
    }
    const $ = await Dt(
      l,
      { ...l.view.filter, page: h },
      k
    );
    return {
      items: $.items.map((j) => ({ key: String(j.id), video: j })),
      totalCount: $.totalCount
    };
  }
  function pe(l, h, k) {
    if (!Te.current || Re.current) return;
    R(!0), O(mr(l.items, T.current.startFrom === "end")), ne(l.totalCount), x(k);
    const $ = {
      ...T.current,
      filter: { ...T.current.filter, page: h }
    };
    T.current = $, W($), Yt(e.id, $);
  }
  V(() => {
    if (f.current) return;
    const l = new AbortController();
    v.current = l;
    const h = ++L.current;
    return it(!0), H(""), qe(""), x(null), O([]), ot(!1), (async () => {
      const k = _t(tt.current, T.current);
      Ie.current = k.entityType === "performerOccurrence" ? await xn(k, l.signal) : null;
      let $ = Number(k.view.filter.page), j = await Me(k, $, l.signal);
      const D = Math.max(
        1,
        Math.ceil(j.totalCount / Number(k.view.filter.perPage))
      );
      if ((ce.current || $ > D) && ($ = D, j = await Me(k, $, l.signal)), ce.current = !1, h !== L.current || l.signal.aborted) return;
      const se = mr(j.items, k.view.startFrom === "end");
      pe(j, $, se[0] ?? null);
    })().catch((k) => {
      !l.signal.aborted && h === L.current && H(De(k));
    }).finally(() => {
      !l.signal.aborted && h === L.current && (R(!0), it(!1));
    }), () => {
      l.abort(), L.current++;
    };
  }, [Z, e.id]), V(() => {
    if (Le(null), !N) return;
    let l = !0;
    return ze(N).then((h) => {
      l && (Le(h), Ve(
        e.entityType === "performerOccurrence" ? h.ids.filter((k) => e.occurrence.tagIds.includes(k)) : []
      ));
    }).catch((h) => {
      l && H(`Could not load current tags. ${De(h)}`);
    }), () => {
      l = !1;
    };
  }, [N]), V(() => {
    if (e.entityType !== "performerOccurrence" || e.actions.length)
      return;
    let l = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (h) => [
          h,
          (await _(`/api/tags/${h}`)).name
        ]
      )
    ).then((h) => {
      l && ie(Object.fromEntries(h));
    }).catch((h) => {
      l && H(De(h));
    }), () => {
      l = !1;
    };
  }, [e]);
  async function be() {
    if (!N) return;
    const l = g.findIndex((D) => D.key === N.key);
    if (l >= 0 && l + 1 < g.length) {
      x(g[l + 1]);
      return;
    }
    const h = new Set(g.map((D) => D.key)), k = 1100 - (Date.now() - mt.current);
    k > 0 && await new Promise((D) => window.setTimeout(D, k));
    const $ = A.startFrom === "end" ? -1 : 1;
    let j = $ === -1 ? Math.max(1, Ne - 1) : Ne;
    for (; Te.current && !Re.current; ) {
      let D = await Me(je, j);
      const se = Math.max(
        1,
        Math.ceil(D.totalCount / Number(A.filter.perPage))
      );
      j > se && (j = se, D = await Me(je, j));
      const we = $ === -1 && Ne === 1 ? void 0 : mr(D.items, $ === -1).find(
        (z) => !h.has(z.key)
      );
      if (we || ($ === -1 ? j <= 1 : j >= se)) {
        pe(D, j, we ?? null), we || qe(
          D.totalCount ? "Reached the end in this direction. Matching items remain available from the scene pages." : "No matching scenes."
        );
        return;
      }
      j += $;
    }
  }
  async function ae(l, h = !1, k = !1, $ = !1) {
    if (p || !N || fe.current || Q || Se && !k)
      return;
    const j = k || $ || !!(l != null && l.steps.length);
    if (j && (!t || !de)) return;
    fe.current = !0, Ye(!0), H(""), qe("");
    let D = !1;
    try {
      if (j) {
        const se = await ze(N);
        let we;
        if (l)
          we = await Zi(l), await Yi(je, N, l);
        else {
          const st = $ && e.entityType === "performerOccurrence" ? e.occurrence.tagIds.filter((bt) => se.ids.includes(bt)) : kt.current, nt = Ar(st, $ ? pt : at);
          we = [...nt.added, ...nt.removed], await Dn(je, N, nt);
        }
        mt.current = Date.now();
        const z = await ze(N);
        Le(z);
        const yt = eo(N, se, z, we);
        [yt.tags, yt.absence].some(
          (st) => st.added.length || st.removed.length
        ) && U({
          ...yt,
          cursor: {
            query: structuredClone(A),
            items: [...g],
            total: le,
            targets: Ie.current ? [...Ie.current] : null
          }
        }), D = !0, ot(!1), qe("Tags saved.");
      }
      if (!Te.current || Re.current) return;
      h ? k && requestAnimationFrame(() => {
        var se;
        return (se = me.current) == null ? void 0 : se.focus();
      }) : await be();
    } catch (se) {
      if (H(
        D ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${De(se)}` : j ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${De(se)}` : `Could not advance. ${De(se)}`
      ), j && !D) {
        mt.current = Date.now();
        try {
          Le(await ze(N));
        } catch {
          Le(null), H(
            (we) => `${we} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      rt();
    }
  }
  async function Fe() {
    if (!(!w || fe.current || Se || Q)) {
      fe.current = !0, Ye(!0), H(""), qe("");
      try {
        await to(je, w), U(null), mt.current = Date.now();
        const l = await ze(w.item);
        if (!Te.current || Re.current) return;
        Ve(
          e.entityType === "performerOccurrence" ? l.ids.filter((h) => e.occurrence.tagIds.includes(h)) : []
        ), Ie.current = w.cursor.targets, T.current = w.cursor.query, W(w.cursor.query), Yt(e.id, w.cursor.query), O(w.cursor.items), ne(w.cursor.total), x(w.item), Le(l), U(null), qe("Latest tag operation undone. Inspecting the affected item.");
      } catch (l) {
        if (!Te.current || Re.current) return;
        H(`Undo stopped. ${De(l)}`), Ie.current = w.cursor.targets, T.current = w.cursor.query, W(w.cursor.query), Yt(e.id, w.cursor.query), O(w.cursor.items), ne(w.cursor.total), x(w.item);
        try {
          Le(await ze(w.item));
        } catch {
          Le(null);
        }
      } finally {
        rt();
      }
    }
  }
  V(() => {
    const l = (h) => {
      if (Se || p || K || Q || G || h.defaultPrevented || h.repeat || h.ctrlKey || h.altKey || h.metaKey || !In(h.target) || document.querySelector('[role="dialog"], dialog[open]'))
        return;
      const k = /^Digit[1-9]$/.test(h.code) ? h.code.slice(5) : h.key, $ = e.actions.find(
        (j, D) => ft(j, D) === k
      );
      $ && (h.preventDefault(), h.stopPropagation(), ae($, h.shiftKey));
    };
    return document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l);
  });
  function Be() {
    !i || p || fe.current || Se || (S.current = document.activeElement, C.current = {
      error: It,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(T.current),
      items: g,
      current: N,
      total: le,
      targets: Ie.current
    }, m(structuredClone(_t(e, T.current))), qe(""), H(""));
  }
  V(() => {
    s && s !== I.current && q && !Q && (I.current = s, Be());
  }, [s, Q, q]);
  function Oe() {
    m(null), requestAnimationFrame(() => {
      var l;
      return (l = S.current) == null ? void 0 : l.focus();
    });
  }
  function Gt() {
    var h;
    const l = C.current;
    !l || K || ((h = v.current) == null || h.abort(), L.current++, T.current = l.query, W(l.query), O(l.items), x(l.current), ne(l.total), Ie.current = l.targets, it(!1), H(l.error), qe(""), window.history.replaceState(window.history.state, "", l.url), Oe());
  }
  async function Je() {
    if (!p || !i || fe.current) return;
    const l = _t(
      { ...p, name: p.name.trim() },
      T.current
    ), h = tr(l);
    if (h) {
      H(h);
      return;
    }
    fe.current = !0, Ye(!0), H("");
    try {
      if (await i(l) === !1) throw new Error("Could not save review.");
      Oe(), qe("Review saved.");
    } catch (k) {
      H(
        "Could not save review. Your edits are still open. " + De(k)
      );
    } finally {
      rt();
    }
  }
  const Y = A.performerScope, _e = (l) => oe({
    ...T.current,
    filter: { ...T.current.filter, page: 1 },
    performerScope: { ...Y, ...l }
  });
  return /* @__PURE__ */ u(
    "section",
    {
      className: "dq-review-workspace",
      "aria-label": Y ? "Performer occurrence review" : "Video review",
      children: [
        p && /* @__PURE__ */ u("section", { className: "dq-rule-editor", "aria-label": "Edit review rule", children: [
          /* @__PURE__ */ n("h2", { children: "Edit review" }),
          /* @__PURE__ */ n("p", { children: "Preview matching scenes below. Save review keeps all rule changes; Cancel restores your previous view." }),
          /* @__PURE__ */ u("fieldset", { disabled: K, children: [
            c == null ? void 0 : c(
              _t(p, A),
              m,
              K
            ),
            /* @__PURE__ */ u("label", { children: [
              "Review direction",
              /* @__PURE__ */ u(
                "select",
                {
                  "aria-label": "Review direction",
                  value: A.startFrom,
                  onChange: (l) => oe({
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
                disabled: K || Q,
                onClick: () => void Je(),
                children: "Save review"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button",
                type: "button",
                disabled: K,
                onClick: Gt,
                children: "Cancel"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ u(
          "fieldset",
          {
            className: "dq-review-filters",
            disabled: Ge,
            onClickCapture: (l) => {
              var $;
              const h = l.target instanceof Element ? l.target.closest("button") : null, k = (h == null ? void 0 : h.getAttribute("aria-label")) ?? (($ = h == null ? void 0 : h.textContent) == null ? void 0 : $.trim()) ?? "";
              h && !h.closest('[role="dialog"], dialog') && /^(Filters|Edit filter:|Edit performer criteria)/.test(k) && (Ue.current = h);
            },
            children: [
              /* @__PURE__ */ n("legend", { children: "Scene filters" }),
              /* @__PURE__ */ n(
                "div",
                {
                  onKeyDownCapture: (l) => {
                    var h;
                    l.key === "Escape" && (et.current = !1), ["Delete", "Backspace"].includes(l.key) && l.target instanceof Element && ((h = l.target.closest("button")) == null ? void 0 : h.getAttribute("aria-label")) === "Edit filter: Custom Fields" && (et.current = !0);
                  },
                  onClickCapture: (l) => {
                    var k, $;
                    const h = l.target instanceof Element ? l.target.closest("button") : null;
                    (h == null ? void 0 : h.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((k = h == null ? void 0 : h.textContent) == null ? void 0 : k.trim()) === "Clear all" ? et.current = !0 : (/^(Cancel|Filters)/.test((($ = h == null ? void 0 : h.textContent) == null ? void 0 : $.trim()) ?? "") || /^(Close|Dismiss)/.test((h == null ? void 0 : h.getAttribute("aria-label")) ?? "")) && (et.current = !1);
                  },
                  children: /* @__PURE__ */ n(
                    yr,
                    {
                      filter: A.filter,
                      objectFilter: jn(
                        A.objectFilter,
                        Ee
                      ),
                      criteriaDefinitions: [
                        ...er,
                        {
                          id: "custom-fields",
                          label: "Custom Fields",
                          filterKey: "customFieldCriteria"
                        }
                      ],
                      totalCount: le,
                      sortOptions: Ir,
                      showSearch: !0,
                      showSort: !0,
                      showPagingControls: !1,
                      onFilterChange: (l) => {
                        (l.sort !== T.current.filter.sort || l.direction !== T.current.filter.direction) && (l = { ...l, sorts: void 0 }), oe({
                          ...T.current,
                          filter: Ae(l)
                        });
                      },
                      onObjectFilterChange: (l) => {
                        const h = Vn(
                          T.current.objectFilter,
                          Kn(l),
                          et.current
                        );
                        et.current = !1, oe({
                          ...T.current,
                          objectFilter: h,
                          filter: { ...T.current.filter, page: 1 }
                        });
                      }
                    }
                  )
                }
              ),
              Y && /* @__PURE__ */ u("div", { className: "dq-scope-controls", children: [
                /* @__PURE__ */ u("label", { children: [
                  "Performers to review",
                  " ",
                  /* @__PURE__ */ u(
                    "select",
                    {
                      value: Y.targetMode,
                      onChange: (l) => _e({
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
                Y.targetMode === "selected" && /* @__PURE__ */ n(
                  He,
                  {
                    entityType: "performer",
                    values: Y.performerIds,
                    onChange: (l) => _e({ performerIds: l }),
                    placeholder: "Select performers to review...",
                    allowCreate: !1
                  }
                ),
                Y.targetMode === "filter" && /* @__PURE__ */ u(Pe, { children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => Ze(!0),
                      children: "Edit performer criteria"
                    }
                  ),
                  /* @__PURE__ */ n("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ n(
                    yr,
                    {
                      filter: {},
                      onFilterChange: () => {
                      },
                      totalCount: 0,
                      sortOptions: [],
                      showSearch: !1,
                      showSort: !1,
                      showPagingControls: !1,
                      criteriaDefinitions: zr,
                      objectFilter: Y.performerFilter,
                      onObjectFilterChange: (l) => _e({ performerFilter: l })
                    }
                  ) })
                ] }),
                /* @__PURE__ */ u("label", { children: [
                  "Occurrence tags",
                  " ",
                  /* @__PURE__ */ u(
                    "select",
                    {
                      value: Y.condition,
                      onChange: (l) => _e({
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
                !["any", "isNull"].includes(Y.condition) && /* @__PURE__ */ n(
                  He,
                  {
                    entityType: "tag",
                    values: Y.conditionTagIds,
                    onChange: (l) => _e({ conditionTagIds: l }),
                    placeholder: "Occurrence condition tags...",
                    allowCreate: !1
                  }
                )
              ] }),
              !p && /* @__PURE__ */ u("div", { className: "dq-row", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    onClick: () => {
                      const l = Nr(e);
                      oe(l, l.startFrom === "end");
                    },
                    children: "Reset to review defaults"
                  }
                ),
                i && /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    onClick: Be,
                    children: "Save as review defaults"
                  }
                )
              ] })
            ]
          }
        ),
        Y && /* @__PURE__ */ n(
          hn,
          {
            open: G,
            onClose: () => Ze(!1),
            criteria: zr,
            activeFilter: Y.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (l) => {
              Ze(!1), _e({ performerFilter: l });
            }
          }
        ),
        /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
          It && /* @__PURE__ */ u("p", { role: "alert", children: [
            It,
            " ",
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: K,
                onClick: () => {
                  N ? ze(N).then(Le).catch((l) => H(De(l))) : oe(T.current);
                },
                children: N ? "Reload tags" : "Retry queue"
              }
            )
          ] }),
          Vt && /* @__PURE__ */ n("p", { role: "status", children: Vt }),
          w && !p && /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: Ge,
              onClick: () => void Fe(),
              children: "Undo latest tag operation"
            }
          )
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-review-layout", children: [
          /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
            /* @__PURE__ */ n("fieldset", { disabled: Ge, children: /* @__PURE__ */ n(
              yn,
              {
                filter: A.filter,
                totalCount: le,
                onFilterChange: (l) => oe({ ...A, filter: Ae(l) })
              }
            ) }),
            /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: g.map((l) => {
              var h, k, $;
              return /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  title: `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${l.video.title || ((h = l.video.files[0]) == null ? void 0 : h.basename) || "Scene"}`,
                  "aria-label": `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${l.video.title || ((k = l.video.files[0]) == null ? void 0 : k.basename) || "Scene"}`,
                  disabled: Ge,
                  "aria-pressed": (N == null ? void 0 : N.key) === l.key,
                  onClick: () => {
                    x(l), H(""), qe("");
                  },
                  children: [
                    l.occurrence && /* @__PURE__ */ n(an, { performer: l.occurrence.performer }),
                    /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: l.video.title || (($ = l.video.files[0]) == null ? void 0 : $.basename) || "Scene" })
                  ]
                },
                l.key
              );
            }) })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-inspector", children: N ? /* @__PURE__ */ u(Pe, { children: [
            /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
              /* @__PURE__ */ n("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ n(
                "a",
                {
                  href: `/video/${N.video.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: N.video.title || ((Pt = N.video.files[0]) == null ? void 0 : Pt.basename) || `Video ${N.video.id}`
                }
              ) }),
              /* @__PURE__ */ n(
                bn,
                {
                  videoId: N.video.id,
                  streamUrl: Fn(N.video.id),
                  posterUrl: Li(N.video),
                  duration: ((We = N.video.files[0]) == null ? void 0 : We.duration) ?? 0,
                  format: (Bt = N.video.files[0]) == null ? void 0 : Bt.format,
                  audioCodec: (B = N.video.files[0]) == null ? void 0 : B.audioCodec,
                  extensionSurface: "quick-view",
                  showAbLoop: !0,
                  clip: N.video.parentVideoId != null ? {
                    start: N.video.clipStartSec ?? 0,
                    end: N.video.clipEndSec,
                    loop: !1
                  } : void 0
                },
                N.video.id
              )
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-panel", children: [
              /* @__PURE__ */ n("h2", { children: N.occurrence ? `Reviewing ${N.occurrence.performer.name}` : "Reviewing this video" }),
              /* @__PURE__ */ n("p", { children: Y ? "Tags apply only to this performer in this video." : "Tags apply to the video." }),
              Y && /* @__PURE__ */ n(
                "div",
                {
                  className: "dq-review-partners",
                  "aria-label": "Matching scene partners",
                  children: g.filter((l) => l.video.id === N.video.id).map((l) => {
                    var h, k;
                    return /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button dq-partner-button",
                        title: (h = l.occurrence) == null ? void 0 : h.performer.name,
                        "aria-label": (k = l.occurrence) == null ? void 0 : k.performer.name,
                        disabled: Ge,
                        "aria-pressed": l.key === N.key,
                        onClick: () => {
                          x(l), H("");
                        },
                        children: l.occurrence && /* @__PURE__ */ n(
                          an,
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
                Y ? "occurrence" : "video",
                " tags:",
                " ",
                de ? de.names.join(", ") || "None" : "Loading…"
              ] }),
              de != null && de.absent.length ? /* @__PURE__ */ u("p", { children: [
                "Confirmed absent tags:",
                " ",
                /* @__PURE__ */ n(
                  He,
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
              Se ? /* @__PURE__ */ u(
                "fieldset",
                {
                  ref: X,
                  disabled: K,
                  className: "dq-tag-editor",
                  children: [
                    /* @__PURE__ */ u("legend", { children: [
                      "Edit ",
                      Y ? "occurrence" : "video",
                      " tags"
                    ] }),
                    /* @__PURE__ */ n(
                      He,
                      {
                        entityType: "tag",
                        values: at,
                        onChange: Ot,
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
                          onClick: () => void ae(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !de,
                          onClick: () => void ae(void 0, !1, !0),
                          children: "Save & next"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => {
                            ot(!1), requestAnimationFrame(
                              () => {
                                var l;
                                return (l = me.current) == null ? void 0 : l.focus();
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
                  io,
                  {
                    actions: Ce.actions,
                    canWrite: t,
                    disabled: K || Q || !de || !!p,
                    onApply: (l, h) => void ae(l, h)
                  }
                ),
                e.entityType === "performerOccurrence" && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                  "fieldset",
                  {
                    disabled: !t || K || !de || !!p,
                    children: [
                      /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                      e.occurrence.tagIds.map((l) => /* @__PURE__ */ u("label", { children: [
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: e.occurrence.multiple ? "checkbox" : "radio",
                            name: "legacy-choice",
                            checked: pt.includes(l),
                            onChange: (h) => Ve(
                              e.occurrence.multiple ? h.target.checked ? [...pt, l] : pt.filter(
                                (k) => k !== l
                              ) : [l]
                            )
                          }
                        ),
                        gt[l] ?? "Loading tag…"
                      ] }, l)),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          onClick: () => Ve([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void ae(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void ae(void 0, !1, !1, !0),
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
                    ref: me,
                    className: "dq-button",
                    disabled: Ge || !!p || !t || !de,
                    onClick: () => {
                      kt.current = [...de.ids], Ot([...de.ids]), ot(!0);
                    },
                    children: "Edit tags"
                  }
                ),
                /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: Ge || !!p,
                    onClick: () => void ae(),
                    children: [
                      "Skip",
                      Y ? " performer" : " video"
                    ]
                  }
                )
              ] }),
              !t && /* @__PURE__ */ n("p", { children: "Write permission is required to change tags." })
            ] })
          ] }) : /* @__PURE__ */ n("p", { role: "status", children: Q ? "Loading review…" : le ? "Reached the end in this direction." : "No matching scenes." }) })
        ] })
      ]
    }
  );
}
function sn({
  review: e,
  onChange: t,
  choices: r = !1
}) {
  const i = e.occurrence, s = (c) => t({ ...e, occurrence: { ...i, ...c } });
  return r ? /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ n("p", { children: "Choose the tags this review can change on the active performer’s appearance in a scene. Other tags are preserved." }),
    /* @__PURE__ */ n(
      He,
      {
        entityType: "tag",
        values: i.tagIds,
        onChange: (c) => s({ tagIds: c }),
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
          onChange: (c) => s({ multiple: c.target.checked })
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
      He,
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
function ao(e) {
  var f, p, m;
  const [t, r] = E({}), [i, s] = E(""), c = (((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.annotations) ?? []).includes("tags") ? ((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.annotationParents) ?? [] : [], a = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...c,
      ...((m = e == null ? void 0 : e.presentation) == null ? void 0 : m.binParents) ?? []
    ])
  ]);
  return V(() => {
    let C = !0;
    return r({}), s(""), Promise.all(
      JSON.parse(a).map(
        async (S) => [S, await Kt([S])]
      )
    ).then((S) => {
      C && r(Object.fromEntries(S));
    }).catch(() => {
      C && s(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      C = !1;
    };
  }, [a]), { ids: t, error: i };
}
function so(e, t, r) {
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
      (a) => c.some(
        (f) => {
          var p;
          return f !== a.id && ((p = r[f]) == null ? void 0 : p.includes(a.id));
        }
      )
    ) : []
  };
}
function co({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: s
}) {
  var f, p, m;
  const c = new Set(
    (((f = t.presentation) == null ? void 0 : f.binParents) ?? []).flatMap(
      (C) => (r[C] ?? []).filter((S) => S !== C)
    )
  ), a = /* @__PURE__ */ new Map();
  for (const C of e)
    for (const S of C.tags ?? [])
      if (c.has(S.id)) {
        const v = a.get(S.id) ?? { name: S.name, count: 0 };
        v.count++, a.set(S.id, v);
      }
  return (m = (p = t.presentation) == null ? void 0 : p.binParents) != null && m.length ? /* @__PURE__ */ u("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...a].sort((C, S) => C[1].name.localeCompare(S[1].name)).map(([C, S]) => /* @__PURE__ */ u(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => s(C),
        children: [
          S.name,
          " (",
          S.count,
          ")"
        ]
      },
      C
    )),
    !a.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function lo(e, t) {
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
function cn({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [s, c] = E(!1), a = ke(e) === "tag" ? "tag" : "video", f = e.view.filter, p = a === "tag" ? wn : Ir, m = (v) => t({
    ...e,
    view: { ...e.view, filter: { ...f, ...v } }
  }), C = a === "video" ? e.presentation ?? {} : {}, S = (v) => t({ ...e, presentation: { ...C, ...v } });
  return /* @__PURE__ */ u(Pe, { children: [
    i && /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ u("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(f.q ?? ""),
            onChange: (v) => m({ q: v.target.value })
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
              onChange: (v) => m({ sort: v.target.value, sorts: void 0 }),
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
              onChange: (v) => m({ direction: v.target.value }),
              children: [
                /* @__PURE__ */ n("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ n("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ u("label", { children: [
          a === "tag" ? "Tags" : "Videos",
          " per page",
          /* @__PURE__ */ n(
            "input",
            {
              type: "number",
              min: "1",
              max: "1000",
              value: Number(f.perPage) || 40,
              onChange: (v) => m({
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
          onClick: () => c(!0),
          children: [
            "Edit ",
            a,
            " filters"
          ]
        }
      ),
      /* @__PURE__ */ u("p", { children: [
        Object.keys(e.view.objectFilter).length ? `${a === "tag" ? "Tag" : "Video"} filters configured` : `No ${a} filters`,
        ". Choose which ",
        a === "tag" ? "tags" : "videos",
        " enter the queue."
      ] }),
      s && /* @__PURE__ */ n("div", { onKeyDown: (v) => v.stopPropagation(), children: /* @__PURE__ */ n(
        hn,
        {
          open: !0,
          onClose: () => c(!1),
          criteria: a === "tag" ? vn : er,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: a === "video",
          subjectLabel: a === "tag" ? "tags" : "videos",
          onApply: (v) => {
            t({ ...e, view: { ...e.view, objectFilter: v } }), c(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ u(Pe, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ u("p", { className: "dq-editor-note", children: [
        "Choose how ",
        a === "tag" ? "tags" : "videos and tags",
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ n("div", { className: "dq-field-grid", children: /* @__PURE__ */ u("label", { children: [
        "Preferred view",
        /* @__PURE__ */ n(
          "select",
          {
            value: a === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid",
            onChange: (v) => t({
              ...e,
              view: {
                ...e.view,
                displayMode: v.target.value
              }
            }),
            children: (a === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((v) => /* @__PURE__ */ n("option", { children: v }, v))
          }
        )
      ] }) }),
      a === "video" && /* @__PURE__ */ u(Pe, { children: [
        /* @__PURE__ */ n("h4", { children: "Card annotations" }),
        /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((v) => {
          const q = C.annotations ?? [];
          return /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: q.includes(v),
                onChange: (R) => S({
                  annotations: R.target.checked ? [...q, v] : q.filter((I) => I !== v)
                })
              }
            ),
            v
          ] }, v);
        }) }),
        (C.annotations ?? []).includes("tags") && /* @__PURE__ */ u(Pe, { children: [
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
          /* @__PURE__ */ n(
            He,
            {
              entityType: "tag",
              values: C.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (v) => S({ annotationParents: v }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ n("h4", { children: "Tag bins" }),
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ n(
          He,
          {
            entityType: "tag",
            values: C.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (v) => S({ binParents: v }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const hr = 180, uo = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function Gn({ entityType: e }) {
  return e === "tag" ? /* @__PURE__ */ n(bi, { role: "img", "aria-label": "Tag review" }) : /* @__PURE__ */ n(vr, { role: "img", "aria-label": e === "performerOccurrence" ? "Performer occurrence review" : "Video review" });
}
function ln(e) {
  return ke(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function dn(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function un() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function fn(e) {
  const t = new URLSearchParams(window.location.search);
  Mr.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function fo(e) {
  return Ae({ ...e, page: 1 });
}
function Tr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((a, f) => Tr(a, t[f]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, s = Object.keys(r).sort(), c = Object.keys(i).sort();
  return s.length === c.length && s.every(
    (a, f) => a === c[f] && Tr(r[a], i[a])
  );
}
function Bn(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function xe(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
const Jn = "data-quality.workspace-layout.v1", $r = 240, Rr = 192, qr = 560;
function Wn(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(qr, Math.max(Rr, e)) : $r;
}
function po() {
  try {
    const e = JSON.parse(
      localStorage.getItem(Jn) ?? "null"
    );
    return Wn(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return $r;
  }
}
function go(e) {
  try {
    localStorage.setItem(
      Jn,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function Qn(e) {
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
function zn(e, t) {
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
function mo(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : zn(e, t);
}
function ho({
  onNavigate: e
}) {
  const [t, r] = E([]), [i] = E(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [s, c] = E(""), [a, f] = E(!0), [p, m] = E(""), [C, S] = E(!1), [v, q] = E(!1), [R, I] = E(!1), [A, W] = E([]), [T, Z] = E(""), [re, ce] = E(!0), [g, O] = E(""), [N, x] = E(""), [le, ne] = E(!1), [Q, it] = E(!1), [K, Ye] = E(un), [fe, Te] = E({}), [Re, It] = E("name"), [H, Vt] = E("asc"), qe = P(null), de = P(!1), [Le, Se] = E(0), [ot, at] = E(!1), [Ot, kt] = E(!1), [me, Ue] = E(
    null
  ), X = t.find((o) => o.id === K) ?? null, w = At(
    () => (me == null ? void 0 : me.id) === K && X ? { ...X, view: me.view } : X,
    [me, K, X]
  );
  V(() => {
    const o = () => Ye(un());
    return window.addEventListener("popstate", o), () => window.removeEventListener("popstate", o);
  }, []);
  const U = w ? ke(w) : "video", G = U === "video" ? w : null, Ze = U === "tag" ? v : C, pt = At(() => {
    const o = H === "asc" ? 1 : -1;
    return [...t].sort((d, y) => {
      if (Re === "count") {
        const b = fe[d.id], F = fe[y.id], M = typeof b == "number", J = typeof F == "number";
        if (M !== J) return M ? -1 : 1;
        if (M && J && b !== F)
          return (b - F) * o;
      }
      return d.name.localeCompare(y.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * o;
    });
  }, [H, Re, fe, t]), Ve = P(
    null
  ), gt = ao(G), [ie, Ie] = E({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [mt, et] = E({
    page: 1,
    perPage: 40
  }), [Ee, ht] = E({ items: [], totalCount: 0 }), [L, tt] = E(!1), [Ce, je] = E(""), [ar, Ge] = E(!1), [Ne, oe] = E(() => /* @__PURE__ */ new Set()), rt = P(Ne);
  rt.current = Ne;
  const Me = P(/* @__PURE__ */ new Map()), [pe, be] = E(null), ae = P(pe);
  ae.current = pe;
  const [Fe, Be] = E(!1), Oe = P(Fe);
  Oe.current = Fe;
  const Gt = P(null), [Je, Y] = E("grid"), [_e, Pt] = E(hr), [We, Bt] = E(po), [B, l] = E(!1), h = P(!1), [k, $] = E(""), [j, D] = E(""), [se, we] = E(""), [z, yt] = E(null), [st, Mt] = E(""), [nt, bt] = E(!1), [xr, Lr] = E({}), [_r, Dr] = E({}), Ft = P(/* @__PURE__ */ new Map()), Ur = P(null), Jt = P(null), wt = P(0), Wt = P(0), Qt = P(null), ct = P(!1), jr = JSON.stringify([
    ...new Set(
      (G == null ? void 0 : G.actions.flatMap(
        (o) => o.steps.flatMap((d) => d.tagIds)
      )) ?? []
    )
  ]);
  function sr(o) {
    const d = Wn(o);
    Bt(d), go(d);
  }
  function Yn(o) {
    const d = o.shiftKey ? 40 : 16;
    let y = null;
    o.key === "ArrowLeft" && (y = We + d), o.key === "ArrowRight" && (y = We - d), o.key === "Home" && (y = Rr), o.key === "End" && (y = qr), y !== null && (o.preventDefault(), o.stopPropagation(), sr(y));
  }
  V(() => {
    if (!j) return;
    const o = window.setTimeout(() => D(""), 4e3);
    return () => window.clearTimeout(o);
  }, [j]), V(() => {
    const o = JSON.parse(jr);
    if (Dr({}), !o.length) return;
    const d = new AbortController();
    let y = !0;
    return Promise.all(
      o.map(async (b) => {
        var F;
        try {
          const M = await _(`/api/tags/${b}`, {
            signal: d.signal
          });
          return [b, ((F = M.name) == null ? void 0 : F.trim()) || null];
        } catch {
          return [b, null];
        }
      })
    ).then((b) => {
      y && Dr(Object.fromEntries(b));
    }), () => {
      y = !1, d.abort();
    };
  }, [jr]), V(() => {
    const o = G ? Un(G.view.objectFilter) : [];
    if (Lr({}), !o.length) return;
    const d = new AbortController();
    let y = !0;
    return Promise.all(
      o.map(async (b) => {
        var F;
        try {
          const M = await _(`/api/tags/${b}`, {
            signal: d.signal
          });
          return (F = M.name) != null && F.trim() ? [String(b), M.name] : null;
        } catch {
          return null;
        }
      })
    ).then((b) => {
      y && Lr(
        Object.fromEntries(b.filter((F) => F !== null))
      );
    }), () => {
      y = !1, d.abort();
    };
  }, [G == null ? void 0 : G.id, G == null ? void 0 : G.view.objectFilter]);
  const cr = At(
    () => G ? jn(
      G.view.objectFilter,
      xr
    ) : (w == null ? void 0 : w.view.objectFilter) ?? {},
    [xr, w, G]
  ), Zn = At(
    () => U === "video" && Array.isArray(cr.customFieldCriteria) ? [...er, uo] : U === "tag" ? vn : er,
    [U, cr.customFieldCriteria]
  ), Kr = ut(async () => {
    f(!0), m("");
    try {
      const o = await qi();
      r(o.reviews), c(o.storageKey), S(o.canWriteVideos ?? o.canWrite), q(o.canWriteTags ?? !1), I(o.canReadTagGroups ?? !1), ce(o.canConfigure ?? !0), O(o.storageNotice ?? ""), K && !o.reviews.some((d) => d.id === K) && (Ye(""), fn(""));
    } catch (o) {
      m(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      f(!1);
    }
  }, [K]);
  V(() => {
    if (!R) {
      W([]), Z("");
      return;
    }
    const o = new AbortController();
    return Z(""), xi(o.signal).then(W).catch((d) => {
      o.signal.aborted || Z(
        d instanceof Error ? d.message : "Could not load tag groups."
      );
    }), () => o.abort();
  }, [R]), V(() => {
    Kr();
  }, []), V(() => {
    if (K || t.length === 0) return;
    const o = new AbortController();
    Te({});
    for (const d of t)
      (d.entityType === "performerOccurrence" ? xn(d, o.signal).then((b) => (b == null ? void 0 : b.length) === 0 ? { items: [], totalCount: 0 } : Dt(Ln(d, b), { ...d.view.filter, page: 1, perPage: 1 }, o.signal)) : ke(d) === "tag" ? en(
        d,
        Ae({ ...d.view.filter, page: 1, perPage: 1 }),
        o.signal
      ) : Dt(
        d,
        Ae({ ...d.view.filter, page: 1, perPage: 1 }),
        o.signal
      )).then((b) => {
        o.signal.aborted || Te((F) => ({
          ...F,
          [d.id]: b.totalCount
        }));
      }).catch(() => {
        o.signal.aborted || Te((b) => ({ ...b, [d.id]: null }));
      });
    return () => o.abort();
  }, [K, t]), mn(() => {
    var o;
    K || a || !de.current || (de.current = !1, (o = qe.current) == null || o.focus());
  }, [K, a]);
  const zt = ut(async () => {
    Mt("");
    try {
      yt(await Pr());
    } catch (o) {
      yt(null), Mt(
        "Tag assessment setup could not be checked. " + (o instanceof Error ? o.message : "Request failed.")
      );
    }
  }, []);
  V(() => {
    zt();
  }, [zt]);
  const lt = ut(
    async (o, d, y = !1) => {
      var J;
      const b = ++wt.current;
      (J = Qt.current) == null || J.abort();
      const F = new AbortController();
      Qt.current = F, d = Ae(d);
      const M = Number(d.page);
      y && (d = { ...d, page: 1 }), Ie(d), Ge(y), tt(!0), je("");
      try {
        const ue = (St) => ke(o) === "tag" ? en(
          o,
          St,
          F.signal
        ) : Dt(
          o,
          St,
          F.signal
        );
        let ve = await ue(d);
        const Ke = Math.max(
          1,
          Math.ceil(ve.totalCount / Number(d.perPage))
        ), $e = y ? Ke : Math.min(M, Ke);
        return Number(d.page) !== $e && (d = { ...d, page: $e }, ve = await ue(d)), b === wt.current && (ht(ve), Ie(d), et(d)), ve;
      } catch (ue) {
        throw b === wt.current && je(
          ue instanceof Error ? ue.message : "Could not load the review queue."
        ), ue;
      } finally {
        b === wt.current && tt(!1);
      }
    },
    []
  );
  V(() => {
    var d;
    if (Wt.current += 1, wt.current += 1, (d = Qt.current) == null || d.abort(), it(!1), x(""), ne(!1), oe(/* @__PURE__ */ new Set()), Me.current.clear(), be(null), Be(!1), l(!1), h.current = !1, $(""), D(""), we(""), ht({ items: [], totalCount: 0 }), !w || ke(w) !== "tag") {
      tt(!1);
      return;
    }
    let o = !0;
    return tt(!0), (async () => {
      let y = null;
      try {
        y = await ki(s, w.id);
      } catch (M) {
        o && (ne(!0), x(
          M instanceof Error ? M.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const b = (y == null ? void 0 : y.signature) === Ct(w) ? y : null, F = b ? Ae(b.filter) : fo(w.view.filter);
      Ie(F), Y(
        b ? dn(b.displayMode, ke(w)) : ln(w)
      ), Pt(
        b ? b.cardSize ?? hr : hr
      );
      try {
        const M = await lt(
          w,
          F,
          !b && w.view.startFrom !== "beginning"
        );
        if (!o) return;
        const J = Hr(
          M.items.map((ue) => ue.id),
          (b == null ? void 0 : b.focusedId) ?? null,
          (b == null ? void 0 : b.index) ?? 0
        );
        be(J), he(J);
      } catch {
      }
      o && it(!0);
    })(), () => {
      var y;
      o = !1, Wt.current++, wt.current++, (y = Qt.current) == null || y.abort();
    };
  }, [w == null ? void 0 : w.id]);
  const ee = At(
    () => Ee.items.map((o) => o.id),
    [Ee.items]
  );
  V(() => {
    if (!Q || !w || !s || L || Ce || B || (me == null ? void 0 : me.id) === w.id || le)
      return;
    const o = {
      version: 1,
      signature: Ct(w),
      filter: ie,
      focusedId: pe,
      index: Math.max(0, ee.indexOf(pe ?? -1)),
      displayMode: Je,
      cardSize: _e,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        s + ":progress:" + w.id,
        JSON.stringify(o)
      );
    } catch {
    }
    if (N) return;
    let d = !0;
    const y = window.setTimeout(() => {
      Pi(s, w.id, o).catch((b) => {
        d && x(
          "Progress is kept in this browser, but account sync failed. " + (b instanceof Error ? b.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      d = !1, window.clearTimeout(y);
    };
  }, [
    Q,
    s,
    w,
    L,
    Ce,
    B,
    ie,
    pe,
    ee,
    Je,
    _e,
    me,
    N,
    le
  ]);
  const ei = Ee.items.find((o) => o.id === pe) ?? null, lr = U === "video" ? ei : null;
  Fe && lr && (Gt.current = lr);
  const dt = lr ?? (Fe ? Gt.current : null), ti = Xr(Ne, pe), Vr = Ne.size > 0 ? `${Ne.size} selected ${U}${Ne.size === 1 ? "" : "s"}` : pe == null ? `no ${U}` : `focused ${U}`, he = ut((o, d = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const y = Ft.current.get(o);
      y == null || y.focus({ preventScroll: !0 }), d && (y == null || y.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  V(() => {
    Q && !Oe.current && he(ae.current);
  }, [Q, he]), V(() => {
    L || !ee.length || (ae.current == null || !ee.includes(ae.current)) && (be(ee[0]), Oe.current || he(ee[0]));
  }, [he, ee, L]);
  const vt = ut(
    (o) => {
      oe((d) => {
        const y = o(d);
        for (const b of /* @__PURE__ */ new Set([...d, ...y]))
          d.has(b) !== y.has(b) && Me.current.set(
            b,
            (Me.current.get(b) ?? 0) + 1
          );
        return y;
      });
    },
    []
  ), dr = ut(
    (o) => {
      if (!ee.length) return;
      const d = Math.max(
        0,
        ee.indexOf(ae.current ?? ee[0])
      ), y = ee[Math.max(0, Math.min(ee.length - 1, d + o))];
      be(y), Oe.current || he(y);
    },
    [he, ee]
  ), ur = ut(
    async (o) => {
      const d = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", y = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, b = y != null && (!R || !A.some((te) => te.id === y)), F = "effect" in o && d && !R, M = Xr(
        rt.current,
        ae.current
      );
      if (!w || h.current || L || Ce || d && !Ze || F || b || rr(o) && (z == null ? void 0 : z.kind) !== "ready" || !M.length)
        return;
      const J = ++Wt.current, ue = w.id, ve = [...ee], Ke = Ee, $e = ae.current, St = new Set(rt.current), xt = new Map(
        M.map((te) => [te, Me.current.get(te) ?? 0])
      ), Et = () => J === Wt.current && w.id === ue;
      h.current = !0, l(!0), $(
        rt.current.size ? `${M.length} selected ${U}s` : `the focused ${U}`
      ), D(""), we("");
      const Br = Ke.items.filter(
        (te) => !M.includes(te.id)
      ), di = Br.map((te) => te.id), Jr = Yr(
        ve,
        di,
        $e,
        M.includes($e ?? -1)
      );
      ht({
        items: Br,
        totalCount: Ke.totalCount
      }), oe((te) => {
        const ge = new Set(te);
        for (const ye of M) ge.delete(ye);
        return ge;
      }), be(Jr), Oe.current || he(Jr);
      let pr = !1;
      try {
        if ("effect" in o ? await Ji(o, M) : await $n(o, M), pr = !0, !Et()) return;
        oe((te) => {
          const ge = new Set(te);
          for (const ye of M)
            (Me.current.get(ye) ?? 0) === xt.get(ye) && ge.delete(ye);
          return ge;
        }), D(
          `${o.label}: ${M.length} ${U}${M.length === 1 ? "" : "s"} ${d ? "updated" : "skipped"}.`
        );
      } catch (te) {
        if (!Et()) return;
        ht(Ke), oe((ge) => {
          const ye = new Set(ge);
          for (const Qe of M)
            St.has(Qe) && (Me.current.get(Qe) ?? 0) === xt.get(Qe) && ye.add(Qe);
          return ye;
        }), be($e), Oe.current || he($e), we(
          te instanceof Error ? te.message : "Action failed."
        );
      }
      try {
        if (await Ui(o), !Et()) return;
        const te = await lt(w, ie);
        if (!Et()) return;
        let ge = te.items.map((ye) => ye.id);
        if (!ge.length && te.totalCount > 0 && Number(ie.page) > 1) {
          const ye = Math.max(1, Number(ie.page) - 1), Qe = { ...ie, page: ye };
          Ie(Qe), ge = (await lt(w, Qe)).items.map((gr) => gr.id), oe(
            (gr) => new Set([...gr].filter((ui) => ge.includes(ui)))
          );
          const Qr = ge.at(-1) ?? null;
          be(Qr), Oe.current || he(Qr);
        } else {
          oe(
            (Qe) => new Set([...Qe].filter((Wr) => ge.includes(Wr)))
          );
          const ye = Yr(
            ve,
            ge,
            $e,
            pr && M.includes($e ?? -1)
          );
          be(ye), Oe.current && ye == null && Be(!1), Oe.current || he(ye);
        }
      } catch (te) {
        Et() && we(
          (ge) => `${ge ? `${ge} ` : ""}${pr ? "The action completed, but " : ""}the queue could not be refreshed. ${te instanceof Error ? te.message : "Refresh failed."}`
        );
      } finally {
        Et() && (h.current = !1, l(!1), $(""));
      }
    },
    [
      Ze,
      R,
      A,
      U,
      z,
      lt,
      ie,
      he,
      ee,
      Ee,
      L,
      Ce,
      w
    ]
  );
  function ri() {
    var y;
    if (Je === "list") return 1;
    const o = (y = Ur.current) == null ? void 0 : y.firstElementChild, d = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, d.split(" ").filter(Boolean).length);
  }
  function ni(o) {
    if (U !== "tag" || o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || ot) return;
    if (Fe && o.key === "Escape") {
      xe(o), Be(!1), he(ae.current);
      return;
    }
    if (!In(o.target)) return;
    if (o.key === "Escape") {
      xe(o), vt(() => /* @__PURE__ */ new Set());
      return;
    }
    const d = (w == null ? void 0 : w.actions.findIndex(
      (F, M) => ft(F, M) === o.key
    )) ?? -1;
    if (d >= 0 && (w != null && w.actions[d])) {
      xe(o), !B && !L && ur(w.actions[d]);
      return;
    }
    if (!Fe && o.key === " ") {
      xe(o), pe != null && vt((F) => Zt(F, pe));
      return;
    }
    if (!Fe && o.key.toLowerCase() === "a") {
      xe(o), vt(
        (F) => Ni(F, ee)
      );
      return;
    }
    if (B || L || Fe) return;
    if (o.key === "Enter" && pe != null) {
      xe(o), U === "tag" ? window.open(`/tag/${pe}`, "_blank", "noopener,noreferrer") : Be(!0);
      return;
    }
    const y = ri(), b = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -y : o.key === "ArrowDown" ? y : 0;
    b && (xe(o), dr(b));
  }
  function $t(o) {
    Se(0), Ye(o), fn(o);
  }
  function ii() {
    de.current = !0, Te({}), $t("");
  }
  async function fr(o) {
    if (!s) return !1;
    const d = o.map(bo);
    try {
      await Oi(s, d);
    } catch (b) {
      throw b;
    }
    r(d), K && !d.some((b) => b.id === K) && $t("");
    const y = d.find((b) => b.id === K);
    return y && X && JSON.stringify(y) !== JSON.stringify(X) && (y.view.displayMode !== X.view.displayMode && Y(ln(y)), y.entityType === "tag" && Ct(y) !== Ct(X) && (Ue(null), Ht(
      y,
      Ae({ ...y.view.filter, page: ie.page })
    ))), !0;
  }
  if (a)
    return /* @__PURE__ */ n(pn, { label: "Loading reviews…" });
  if (p)
    return /* @__PURE__ */ u(Pe, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Ro().catch(
            (o) => m(
              "Could not export browser reviews. " + (o instanceof Error ? o.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        gn,
        {
          message: p,
          onRetry: () => void Kr()
        }
      )
    ] });
  return /* @__PURE__ */ u("div", { className: "data-quality-page", onKeyDown: ni, children: [
    /* @__PURE__ */ u("header", { className: "data-quality-header", children: [
      w && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: B,
          onClick: ii,
          children: /* @__PURE__ */ n(Sn, {})
        }
      ),
      /* @__PURE__ */ u("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (w == null ? void 0 : w.name) ?? "Data Quality" }),
        (w == null ? void 0 : w.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: w.description })
      ] }),
      w && X && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: B || L || !re,
          onClick: () => {
            w.entityType !== "tag" ? Se((o) => o + 1) : (kt(!0), at(!0));
          },
          children: /* @__PURE__ */ n(En, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: B || L || !re,
          onClick: () => {
            kt(!1), at(!0);
          },
          children: /* @__PURE__ */ n(mi, {})
        }
      )
    ] }),
    g && /* @__PURE__ */ n("p", { className: "dq-status", children: g }),
    G && (z == null ? void 0 : z.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      z.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: nt,
          onClick: () => {
            bt(!0), Mt(""), Ki().then(zt).catch(
              (o) => Mt(
                "Could not create the Confirmed absent tags custom field. " + (o instanceof Error ? o.message : "Request failed.")
              )
            ).finally(() => bt(!1));
          },
          children: nt ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    G && ((z == null ? void 0 : z.kind) === "incompatible" || st) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(wr, {}),
      st || (z == null ? void 0 : z.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: nt,
          onClick: () => {
            bt(!0), zt().finally(
              () => bt(!1)
            );
          },
          children: nt ? "Checking…" : "Check again"
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
    N && /* @__PURE__ */ u("p", { role: "alert", children: [
      N,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            x(""), ne(!1);
          },
          children: le ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    w && X && w.entityType === "tag" && /* @__PURE__ */ u("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${B || L ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": B || L || void 0,
          inert: B || L ? !0 : void 0,
          onClickCapture: (o) => {
            var y, b, F, M, J;
            const d = o.target instanceof Element ? o.target.closest("button") : null;
            (d == null ? void 0 : d.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((y = d == null ? void 0 : d.textContent) == null ? void 0 : y.trim()) === "Clear all" ? ct.current = !0 : ((b = d == null ? void 0 : d.getAttribute("aria-label")) != null && b.startsWith("Filters") || (F = d == null ? void 0 : d.getAttribute("aria-label")) != null && F.startsWith("Edit filter:") || ((M = d == null ? void 0 : d.textContent) == null ? void 0 : M.trim()) === "Cancel" || (J = d == null ? void 0 : d.getAttribute("aria-label")) != null && J.startsWith("Close ")) && (ct.current = !1);
          },
          onKeyDownCapture: (o) => {
            var y, b;
            const d = o.target instanceof Element ? o.target.closest("button") : null;
            (o.key === "Delete" || o.key === "Backspace") && (d == null ? void 0 : d.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (o.preventDefault(), o.stopPropagation(), ct.current = !0, (b = (y = d.parentElement) == null ? void 0 : y.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || b.click()) : o.key === "Escape" && (ct.current = !1);
          },
          children: /* @__PURE__ */ n(
            yr,
            {
              filter: Ce ? mt : ie,
              onFilterChange: oi,
              totalCount: Ee.totalCount,
              sortOptions: U === "tag" ? wn : Ir,
              showSearch: !0,
              showSort: !0,
              displayMode: Je,
              onDisplayModeChange: (o) => Y(dn(o, U)),
              availableDisplayModes: U === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (_e - 225) / 50,
              onZoomChange: (o) => Pt(Math.round(225 + o * 50)),
              cardSizeEntityType: U === "tag" ? "tags" : "videos",
              criteriaDefinitions: Zn,
              objectFilter: cr,
              onObjectFilterChange: (o) => {
                if (!B && !L) {
                  const d = U === "video" ? Kn(o) : o;
                  Ve.current = U === "video" ? Vn(
                    w.view.objectFilter,
                    d,
                    ct.current
                  ) : d, ct.current = !1;
                }
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (me == null ? void 0 : me.id) === K && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: B || L || !re,
            onClick: si,
            children: /* @__PURE__ */ n(hi, {})
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Reset to default review filters",
            title: "Reset to default review filters",
            disabled: B || L,
            onClick: ai,
            children: /* @__PURE__ */ n(yi, {})
          }
        )
      ] })
    ] }),
    w ? U !== "tag" ? /* @__PURE__ */ n(oo, { review: w, canWrite: w.entityType === "performerOccurrence" ? v : C, onBusy: l, editRequest: Le, renderRuleEditor: (o, d, y) => /* @__PURE__ */ n(Hn, { workspace: !0, draft: o, entityTypeLocked: !0, tagGroups: A, saving: y, setDraft: (b) => d(b), onSave: () => {
    }, onCancel: () => {
    } }), onSaveDefaults: re ? (o) => fr(t.map((d) => d.id === o.id ? o : d)) : void 0 }, w.id) : /* @__PURE__ */ u(Pe, { children: [
      G && gt.error && /* @__PURE__ */ n("p", { role: "alert", children: gt.error }),
      G && /* @__PURE__ */ n(
        co,
        {
          videos: Ee.items,
          review: G,
          trees: gt.ids,
          disabled: B || L,
          onChoose: (o) => {
            const d = lo(G, o);
            Ue(d), Ht(d, { ...ie, page: 1 });
          }
        }
      ),
      se && !Fe && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(wr, {}),
        se
      ] }),
      j && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: j }),
      Gr("top"),
      /* @__PURE__ */ u(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${We}px`
          },
          children: [
            /* @__PURE__ */ u("main", { children: [
              L && !Ee.items.length && /* @__PURE__ */ n(pn, { label: "Loading review queue…" }),
              Ce && !L && /* @__PURE__ */ n(
                gn,
                {
                  message: Ce,
                  onRetry: () => void lt(
                    w,
                    ie,
                    ar
                  ).catch(() => {
                  })
                }
              ),
              !B && !L && !Ce && !Ee.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(vr, {}),
                /* @__PURE__ */ u("p", { children: [
                  "No ",
                  U,
                  "s match this review."
                ] })
              ] }),
              !!Ee.items.length && /* @__PURE__ */ n("div", { ref: Ur, children: /* @__PURE__ */ n(
                "div",
                {
                  className: Je === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${_e}px`
                  },
                  children: Ee.items.map(li)
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
                "aria-valuemin": Rr,
                "aria-valuemax": qr,
                "aria-valuenow": We,
                "aria-valuetext": `${We} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (o) => {
                  Jt.current = {
                    pointerId: o.pointerId,
                    startX: o.clientX,
                    startWidth: We
                  }, o.currentTarget.setPointerCapture(o.pointerId);
                },
                onPointerMove: (o) => {
                  const d = Jt.current;
                  (d == null ? void 0 : d.pointerId) === o.pointerId && o.currentTarget.hasPointerCapture(o.pointerId) && sr(
                    d.startWidth + d.startX - o.clientX
                  );
                },
                onPointerUp: () => {
                  Jt.current = null;
                },
                onPointerCancel: () => {
                  Jt.current = null;
                },
                onKeyDown: Yn,
                onDoubleClick: () => sr($r),
                children: /* @__PURE__ */ n("span", {})
              }
            ),
            /* @__PURE__ */ u("aside", { className: "dq-actions", children: [
              Ne.size > 0 && /* @__PURE__ */ n("strong", { children: Vr }),
              w.actions.map((o, d) => {
                const y = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", b = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, F = b != null ? A.find((J) => J.id === b) : void 0, M = b != null && !F;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    disabled: B || L || !!Ce || y && !Ze || "effect" in o && y && (!R || M) || rr(o) && (z == null ? void 0 : z.kind) !== "ready" || !ti.length,
                    onClick: () => void ur(o),
                    children: [
                      /* @__PURE__ */ u("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: o.label }),
                        "effect" in o ? /* @__PURE__ */ n("small", { children: o.effect.mode === "SKIP" ? "Skip" : o.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : F ? `Assign ${F.name}` : "Unavailable tag group" }) : o.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: o.steps.flatMap(
                          (J, ue) => J.tagIds.map((ve, Ke) => {
                            const $e = _r[ve] === void 0 ? "Tag" : _r[ve] ?? "Unavailable tag", St = zn(J, $e), xt = mo(J, $e);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": Qn(J.mode),
                                "aria-label": xt,
                                title: `Step ${ue + 1}: ${xt}`,
                                children: St
                              },
                              `${ue}-${ve}-${Ke}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      ft(o, d) && /* @__PURE__ */ n("kbd", { children: ft(o, d) })
                    ]
                  },
                  o.id
                );
              }),
              !w.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              !Ze && /* @__PURE__ */ u("p", { children: [
                U === "tag" ? "Tag" : "Video",
                " write permission is required to apply actions."
              ] }),
              U === "tag" && T && /* @__PURE__ */ u("p", { children: [
                "Tag groups are unavailable. ",
                T
              ] }),
              B && /* @__PURE__ */ u("p", { role: "status", children: [
                /* @__PURE__ */ n(Nn, { className: "dq-spin" }),
                " Applying action to",
                " ",
                k,
                "…"
              ] }),
              /* @__PURE__ */ u("p", { className: "dq-shortcuts", children: [
                "←→↑↓ move · space select · enter ",
                U === "tag" ? "open" : "preview",
                " · 1–9 apply · A toggle shown · Esc clear"
              ] })
            ] })
          ]
        }
      ),
      Gr("bottom")
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
                  ref: qe,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ n("p", { children: "Choose a review to open its queue." }),
              /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                (o) => fe[o.id] !== void 0
              ) ? t.some((o) => fe[o.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: Re,
                    onChange: (o) => It(
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
                  "aria-label": H === "asc" ? "Ascending" : "Descending",
                  title: H === "asc" ? "Ascending" : "Descending",
                  onClick: () => Vt(
                    (o) => o === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    Cn,
                    {
                      className: H === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: pt.map((o) => {
            const d = fe[o.id], y = ke(o), b = y === "tag" ? "tag" : y === "performerOccurrence" ? "scene" : "video";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                disabled: B,
                onClick: () => $t(o.id),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ u("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(Gn, { entityType: y }),
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
      /* @__PURE__ */ n(vr, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    Fe && dt && G && /* @__PURE__ */ n(
      Eo,
      {
        video: dt,
        review: G,
        targetLabel: Vr,
        pending: B,
        refreshing: L || !!Ce,
        error: se,
        canWrite: C,
        assessmentReady: (z == null ? void 0 : z.kind) === "ready",
        selected: Ne.has(dt.id),
        hasPrevious: ee.indexOf(dt.id) > 0,
        hasNext: ee.indexOf(dt.id) >= 0 && ee.indexOf(dt.id) < ee.length - 1,
        onToggleSelected: () => vt((o) => Zt(o, dt.id)),
        onPrevious: () => dr(-1),
        onNext: () => dr(1),
        onClose: () => {
          Be(!1), he(ae.current);
        },
        onAction: ur
      }
    ),
    ot && /* @__PURE__ */ n(
      Co,
      {
        reviews: t,
        activeReview: X,
        tagGroups: A,
        initialEdit: Ot,
        onSave: fr,
        onChoose: $t,
        onEditWorkspace: (o) => {
          o !== K && $t(o), Se((d) => d + 1), at(!1);
        },
        onClose: () => {
          at(!1), Ot && he(ae.current, !1);
        }
      }
    )
  ] });
  async function Ht(o, d, y = !1) {
    const b = ae.current, F = Math.max(0, ee.indexOf(b ?? -1));
    try {
      const J = (await lt(o, d, y)).items.map((ve) => ve.id);
      oe(
        (ve) => new Set([...ve].filter((Ke) => J.includes(Ke)))
      );
      const ue = Hr(J, b, F);
      be(ue), Oe.current || he(ue, !1);
    } catch {
    }
  }
  function oi(o) {
    const d = Ve.current;
    if (Ve.current = null, B || L || !w || !X) return;
    const y = d ?? w.view.objectFilter, b = Tr(
      y,
      X.view.objectFilter
    ) ? X.view.objectFilter : y, F = Ae({ ...o, page: 1 }), M = {
      ...w,
      view: {
        ...w.view,
        filter: F,
        objectFilter: b
      }
    }, J = Ct(M) !== Ct(X), ue = J ? M : X;
    Ue(J ? M : null), D(J ? "" : "Review queue defaults restored."), Ht(ue, F, !0);
  }
  function ai() {
    if (B || L || !X) return;
    Ve.current = null;
    const o = Ae({
      ...X.view.filter,
      page: 1
    });
    Ue(null), D("Review queue defaults restored."), Ht(
      X,
      o,
      X.view.startFrom !== "beginning"
    );
  }
  function si() {
    B || L || !w || !X || !re || fr(
      t.map(
        (o) => o.id === K ? {
          ...o,
          view: {
            ...w.view,
            filter: { ...ie, page: 1 }
          }
        } : o
      )
    ).then(() => {
      Ue(null), D("Queue saved to this review.");
    }).catch(
      (o) => we(
        o instanceof Error ? o.message : "Could not save queue."
      )
    );
  }
  function ci() {
    oe(/* @__PURE__ */ new Set()), Me.current.clear(), be(null);
  }
  function Gr(o) {
    return w ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: B || L,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          yn,
          {
            filter: {
              ...ie,
              page: Number(ie.page) || 1,
              perPage: Number(ie.perPage) || 40
            },
            totalCount: Ee.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${o}`,
            onFilterChange: (d) => {
              B || L || d.page === Number(ie.page) || yo(
                { ...ie, page: d.page },
                w,
                lt,
                ci
              );
            }
          }
        )
      }
    ) : null;
  }
  function li(o) {
    if (U === "tag") {
      const y = o;
      return /* @__PURE__ */ n(
        wo,
        {
          tag: y,
          displayMode: Je === "list" ? "list" : "grid",
          focused: y.id === pe,
          selected: Ne.has(y.id),
          setRef: (b) => {
            b ? Ft.current.set(y.id, b) : Ft.current.delete(y.id);
          },
          onFocus: () => be(y.id),
          onToggle: () => vt((b) => Zt(b, y.id)),
          onOpen: () => window.open(`/tag/${y.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        y.id
      );
    }
    const d = o;
    return /* @__PURE__ */ n(
      vo,
      {
        video: so(d, G, gt.ids),
        displayMode: Je,
        focused: d.id === pe,
        selected: Ne.has(d.id),
        setRef: (y) => {
          y ? Ft.current.set(d.id, y) : Ft.current.delete(d.id);
        },
        onFocus: () => be(d.id),
        onToggle: () => vt((y) => Zt(y, d.id)),
        onPreview: () => {
          be(d.id), Be(!0);
        },
        onNavigate: e
      },
      d.id
    );
  }
}
function yo(e, t, r, i) {
  i(), r(t, e).catch(() => {
  });
}
function Zt(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function bo(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function wo({
  tag: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: s,
  onFocus: c,
  onToggle: a,
  onOpen: f,
  onNavigate: p
}) {
  return /* @__PURE__ */ n(
    "article",
    {
      ref: s,
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${e.name}${i ? ", selected" : ""}`,
      onFocus: c,
      onClick: (m) => {
        c(), m.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        pi,
        {
          tag: e,
          selected: i,
          onSelect: a,
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
            onClick: (m) => {
              m.stopPropagation(), a();
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
function vo({
  video: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: s,
  onFocus: c,
  onToggle: a,
  onPreview: f,
  onNavigate: p
}) {
  const m = Bn(e), C = P(null), S = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, v = !!(S.date || S.studioName), q = !!(S.performers.length || S.tags.length);
  return mn(() => {
    const R = C.current;
    if (!R) return;
    const I = R.querySelector(
      `a[href="/video/${e.id}"]`
    ), A = R.querySelector(".card-title"), W = `dq-card-title-${e.id}`;
    A && (A.id = W), I && (I.target = "_blank", I.rel = "noreferrer", I.removeAttribute("aria-label"), I.setAttribute("aria-labelledby", W), I.classList.add("dq-card-link"));
    const T = R.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    T && T.setAttribute(
      "aria-label",
      i ? `Deselect ${m}` : `Select ${m}`
    );
    const Z = R.querySelector(
      'button[title="Quick View"]'
    );
    Z && Z.setAttribute("aria-label", `Preview ${m}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (R) => {
        C.current = R, s(R);
      },
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${m}${i ? ", selected" : ""}`,
      onFocus: c,
      onClick: (R) => {
        c(), R.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${t} ${v ? "has-card-metadata" : "no-card-metadata"} ${q ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          gi,
          {
            video: S,
            selected: i,
            onSelect: a,
            onNavigate: p,
            onQuickView: f,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t === "wall" && /* @__PURE__ */ n(So, { video: e })
      ]
    }
  );
}
function So({ video: e }) {
  const t = P(null), r = P(null), [i, s] = E(!1), [c, a] = E(!1), [f, p] = E(!1);
  return V(() => {
    const m = t.current;
    if (!m || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      s(!0), a(!0);
      return;
    }
    const C = new IntersectionObserver(
      ([v]) => s(v.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), S = new IntersectionObserver(
      ([v]) => a(v.isIntersecting && v.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return C.observe(m), S.observe(m), () => {
      C.disconnect(), S.disconnect();
    };
  }, [e.id, e.files.length]), V(() => {
    if (!i) {
      p(!1);
      return;
    }
    const m = new AbortController();
    return _(Di(e.id), {
      signal: m.signal
    }).then((C) => {
      m.signal.aborted || p(C.available === !0);
    }).catch(() => {
      m.signal.aborted || p(!1);
    }), () => m.abort();
  }, [i, e.id]), V(() => {
    const m = r.current;
    m && (c ? Promise.resolve(m.play()).catch(() => {
    }) : m.pause());
  }, [f, c]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: f && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: _i(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Eo({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: s,
  error: c,
  canWrite: a,
  assessmentReady: f,
  selected: p,
  hasPrevious: m,
  hasNext: C,
  onToggleSelected: S,
  onPrevious: v,
  onNext: q,
  onClose: R,
  onAction: I
}) {
  const A = P(null), W = P(null), T = e.files[0], Z = Bn(e);
  V(() => {
    var O;
    const g = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (O = A.current) == null || O.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = g;
    };
  }, []);
  function re(g) {
    var x, le, ne;
    if (g.key !== "Tab") return;
    const O = [
      ...((x = A.current) == null ? void 0 : x.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((Q) => Q.offsetParent !== null);
    if (!O.length) {
      g.preventDefault(), (le = A.current) == null || le.focus();
      return;
    }
    const N = O.indexOf(
      document.activeElement
    );
    g.shiftKey && N <= 0 ? (g.preventDefault(), (ne = O.at(-1)) == null || ne.focus()) : !g.shiftKey && N === O.length - 1 && (g.preventDefault(), O[0].focus());
  }
  function ce(g) {
    if (g.defaultPrevented || g.ctrlKey || g.metaKey || g.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const O = g.key === "ArrowLeft" || g.key === "ArrowRight";
    if (g.altKey && !O) return;
    const N = W.current, x = g.currentTarget.querySelector("video");
    if (g.key === "Enter" || g.key === "Escape")
      g.repeat || R();
    else if (g.key === " " && N)
      g.repeat || N.toggle();
    else if (O && N)
      N.seekBy(
        (g.key === "ArrowLeft" ? -1 : 1) * (g.shiftKey ? 5 : g.altKey ? 10 : 60)
      );
    else if ((g.key === "," || g.key === ".") && N) {
      const le = [T == null ? void 0 : T.duration, x == null ? void 0 : x.duration].find(
        (Q) => Q != null && Number.isFinite(Q) && Q > 0
      ) ?? 0, ne = e.parentVideoId != null ? (e.clipEndSec ?? le) - (e.clipStartSec ?? 0) : le;
      Number.isFinite(ne) && ne > 0 && N.seekBy((g.key === "," ? -1 : 1) * ne * 0.1);
    } else if (g.key.toLowerCase() === "n" || g.key.toLowerCase() === "m")
      !g.repeat && !i && !s && (g.key.toLowerCase() === "n" && m && v(), g.key.toLowerCase() === "m" && C && q());
    else if (g.key === "ArrowUp" && x)
      x.volume = Math.min(1, x.volume + 0.1);
    else if (g.key === "ArrowDown" && x)
      x.volume = Math.max(0, x.volume - 0.1);
    else return;
    xe(g);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: A,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${Z}`,
      className: "dq-preview",
      onKeyDown: re,
      onKeyDownCapture: ce,
      onMouseDown: (g) => {
        g.target === g.currentTarget && R();
      },
      children: /* @__PURE__ */ u("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ u("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !m || i || s,
              onClick: v,
              children: /* @__PURE__ */ n(Sn, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !C || i || s,
              onClick: q,
              children: /* @__PURE__ */ n(Cn, {})
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
              onClick: S,
              disabled: s,
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
              children: /* @__PURE__ */ n(wi, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: R,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(An, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: T ? /* @__PURE__ */ n(
          bn,
          {
            autostart: !0,
            streamUrl: Fn(e.id),
            posterUrl: tn(e),
            format: T.format,
            audioCodec: T.audioCodec,
            duration: T.duration ?? 0,
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
        ) : /* @__PURE__ */ n("img", { src: tn(e), alt: "" }) }),
        c && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: c }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((g, O) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: i || s || g.steps.length > 0 && !a || rr(g) && !f,
            onClick: () => void I(g),
            children: [
              ft(g, O) && /* @__PURE__ */ n("kbd", { children: ft(g, O) }),
              g.label
            ]
          },
          g.id
        )) })
      ] })
    }
  );
}
function Co({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: i = !1,
  onEditWorkspace: s,
  onSave: c,
  onChoose: a,
  onClose: f
}) {
  const [p, m] = E(
    () => i && t ? structuredClone(t) : null
  ), [C, S] = E(""), [v, q] = E(!1), [R, I] = E(
    i && t != null
  ), A = P(null);
  V(() => {
    var N, x;
    const g = document.activeElement, O = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (x = (N = A.current) == null ? void 0 : N.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || x.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = O, g == null || g.focus({ preventScroll: !0 });
    };
  }, []);
  function W(g) {
    var x, le, ne;
    if (g.defaultPrevented) {
      g.stopPropagation();
      return;
    }
    if (g.key === "Escape") {
      xe(g), v || f();
      return;
    }
    if (g.key !== "Tab") {
      g.stopPropagation();
      return;
    }
    const O = [
      ...((x = A.current) == null ? void 0 : x.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((Q) => Q.offsetParent !== null);
    if (!O.length) {
      xe(g), (le = A.current) == null || le.focus();
      return;
    }
    const N = O.indexOf(
      document.activeElement
    );
    g.shiftKey && N <= 0 ? (xe(g), (ne = O.at(-1)) == null || ne.focus()) : !g.shiftKey && N === O.length - 1 ? (xe(g), O[0].focus()) : g.stopPropagation();
  }
  function T(g, O = !!g) {
    I(O), m(
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
    ), S("");
  }
  async function Z() {
    if (v) return;
    if (!p || tr(p)) {
      S(p ? tr(p) : "Choose a review.");
      return;
    }
    const g = { ...p, name: p.name.trim() }, O = e.some((N) => N.id === g.id) ? e.map((N) => N.id === g.id ? g : N) : [...e, g];
    q(!0), S("");
    try {
      if (!await c(O)) throw new Error("Could not save reviews.");
      g.entityType !== "tag" ? s(g.id) : (a(g.id), f());
    } catch (N) {
      S(
        "Could not save reviews. Your edits are still open. " + (N instanceof Error ? N.message : "Retry saving.")
      );
    } finally {
      q(!1);
    }
  }
  async function re(g) {
    if (!v) {
      q(!0), S("");
      try {
        if (!await c(g)) throw new Error("Could not save reviews.");
      } catch (O) {
        S(
          O instanceof Error ? O.message : "Could not save reviews."
        );
      } finally {
        q(!1);
      }
    }
  }
  async function ce(g) {
    var N;
    if (v) return;
    const O = (N = g.target.files) == null ? void 0 : N[0];
    if (g.target.value = "", !!O) {
      if (O.size > 2e6) {
        S("Review files must be smaller than 2 MB.");
        return;
      }
      q(!0), S("");
      try {
        const x = Ut(await O.text());
        if (!await c(Sr(e, x)))
          throw new Error("Could not save reviews.");
      } catch (x) {
        S(
          x instanceof Error ? x.message : "Could not import reviews."
        );
      } finally {
        q(!1);
      }
    }
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: A,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: W,
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
              children: /* @__PURE__ */ n(An, {})
            }
          )
        ] }),
        C && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: C }),
        /* @__PURE__ */ n("fieldset", { disabled: v, className: "dq-manager-content", children: p ? /* @__PURE__ */ n(
          Hn,
          {
            setup: p.entityType !== "tag",
            draft: p,
            entityTypeLocked: R,
            tagGroups: r,
            saving: v,
            setDraft: m,
            onSave: () => void Z(),
            onCancel: f
          }
        ) : /* @__PURE__ */ u(Pe, { children: [
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
                onClick: () => T(),
                children: [
                  /* @__PURE__ */ n(vi, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ u("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(Si, {}),
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
                /* @__PURE__ */ n(Gn, { entityType: ke(g) }),
                /* @__PURE__ */ n("strong", { children: g.name })
              ] }),
              /* @__PURE__ */ n("p", { children: g.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => g.entityType === "tag" ? T(g) : s(g.id), children: [
              /* @__PURE__ */ n(En, {}),
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
                  window.confirm(`Delete review “${g.name}”?`) && re(
                    e.filter((O) => O.id !== g.id)
                  );
                },
                children: /* @__PURE__ */ n(Tn, {})
              }
            )
          ] }, g.id)) })
        ] }) })
      ] })
    }
  );
}
function Hn({
  workspace: e = !1,
  setup: t = !1,
  draft: r,
  entityTypeLocked: i,
  tagGroups: s,
  saving: c = !1,
  setDraft: a,
  onSave: f,
  onCancel: p
}) {
  const [m, C] = E("Review"), S = ke(r), v = (I) => {
    if (!(i || I === S)) {
      if (I === "performerOccurrence") {
        a({
          id: r.id,
          entityType: I,
          name: r.name,
          description: r.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end" },
          actions: [],
          occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: !0 }
        });
        return;
      }
      a(
        I === "tag" ? {
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
  }, q = P(/* @__PURE__ */ new WeakMap()), R = (I) => {
    let A = q.current.get(I);
    return A || (A = crypto.randomUUID(), q.current.set(I, A)), A;
  };
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      fi,
      {
        tabs: (t ? ["Review"] : e ? ["Review", "Actions", ...S === "performerOccurrence" ? ["Tag choices"] : []] : S === "performerOccurrence" ? ["Review", "Queue", "Actions", ...r.occurrence.tagIds.length ? ["Tag choices"] : []] : ["Review", "Queue", "Appearance", "Actions"]).map((I) => ({
          key: I,
          label: I,
          count: I === "Actions" ? r.actions.length : void 0,
          disabled: c
        })),
        activeTab: m,
        onTabChange: C
      }
    ) }),
    /* @__PURE__ */ u("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ u("section", { hidden: m !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ u("label", { children: [
          "Entity type",
          /* @__PURE__ */ u(
            "select",
            {
              "aria-label": "Entity type",
              value: S,
              disabled: i,
              onChange: (I) => v(I.target.value),
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
              onChange: (I) => a({ ...r, name: I.target.value })
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
              onChange: (I) => a({ ...r, description: I.target.value })
            }
          )
        ] })
      ] }),
      !e && !t && /* @__PURE__ */ u("section", { hidden: m !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ n(cn, { draft: r, onChange: a, presentation: !1 }),
        r.entityType === "performerOccurrence" && /* @__PURE__ */ n(sn, { review: r, onChange: a })
      ] }),
      !t && r.entityType === "performerOccurrence" && /* @__PURE__ */ n("section", { hidden: m !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n(sn, { review: r, onChange: a, choices: !0 }) }),
      !e && !t && /* @__PURE__ */ n("section", { hidden: m !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(cn, { draft: r, onChange: a, queue: !1 }) }),
      !t && /* @__PURE__ */ n("section", { hidden: m !== "Actions", className: "dq-editor-section", children: S === "tag" ? /* @__PURE__ */ n(
        Ao,
        {
          draft: r,
          saving: c,
          tagGroups: s,
          setDraft: a
        }
      ) : /* @__PURE__ */ n(
        No,
        {
          draft: r,
          saving: c,
          stepKey: R,
          rememberStepKey: (I, A) => q.current.set(I, R(A)),
          setDraft: a
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
            const I = URL.createObjectURL(
              new Blob([JSON.stringify([r], null, 2)], {
                type: "application/json"
              })
            ), A = document.createElement("a");
            A.href = I, A.download = "data-quality-review.json", A.click(), URL.revokeObjectURL(I);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: p, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: f, children: t ? "Create & configure" : "Save review" })
    ] })
  ] });
}
function Xn({
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
function No({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: i,
  setDraft: s
}) {
  const c = (a, f) => s({
    ...e,
    actions: e.actions.map(
      (p, m) => m === a ? f : p
    )
  });
  return /* @__PURE__ */ u(Pe, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    e.entityType === "performerOccurrence" && /* @__PURE__ */ n("p", { children: "Actions apply only to the active performer in this scene. Set performer matching in the review filters below. Save review keeps those criteria with this rule." }),
    /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      br,
      {
        items: e.actions,
        getKey: (a) => a.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (a) => s({ ...e, actions: a }),
        renderItem: (a, { index: f, dragHandleProps: p, isOver: m }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: m ? "dq-action-card dq-drag-over" : "dq-action-card",
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
                    children: /* @__PURE__ */ n(Or, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: a.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => s({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, f + 1),
                        {
                          ...structuredClone(a),
                          id: crypto.randomUUID(),
                          label: a.label + " copy",
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
                Xn,
                {
                  action: a,
                  index: f,
                  onChange: (C) => c(f, C)
                }
              ),
              /* @__PURE__ */ n(
                br,
                {
                  items: a.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (C) => c(f, { ...a, steps: C }),
                  renderItem: (C, S) => /* @__PURE__ */ n(
                    To,
                    {
                      occurrence: e.entityType === "performerOccurrence",
                      dragHandleProps: S.dragHandleProps,
                      saving: t,
                      isOver: S.isOver,
                      step: C,
                      index: S.index,
                      onChange: (v) => {
                        i(v, C), c(f, {
                          ...a,
                          steps: a.steps.map(
                            (q, R) => R === S.index ? v : q
                          )
                        });
                      },
                      onRemove: () => c(f, {
                        ...a,
                        steps: a.steps.filter(
                          (v, q) => q !== S.index
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
                      ...a,
                      steps: [...a.steps, { mode: "ADD", tagIds: [] }]
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
                        (C, S) => S !== f
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
function Ao({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: i
}) {
  const s = (c, a) => i({
    ...e,
    actions: e.actions.map(
      (f, p) => p === c ? a : f
    )
  });
  return /* @__PURE__ */ u(Pe, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      br,
      {
        items: e.actions,
        getKey: (c) => c.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (c) => i({ ...e, actions: c }),
        renderItem: (c, { index: a, dragHandleProps: f, isOver: p }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: p ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ u("legend", { children: [
                "Action ",
                a + 1
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...f,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${a + 1}`,
                    children: /* @__PURE__ */ n(Or, {})
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
                        ...e.actions.slice(0, a + 1),
                        {
                          ...structuredClone(c),
                          id: crypto.randomUUID(),
                          label: c.label + " copy",
                          shortcut: ""
                        },
                        ...e.actions.slice(a + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                Xn,
                {
                  action: c,
                  index: a,
                  onChange: (m) => s(a, m)
                }
              ),
              /* @__PURE__ */ u("label", { children: [
                "Action effect",
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: c.effect.mode === "SET_TAG_GROUP" ? `group:${c.effect.tagGroupId}` : c.effect.mode,
                    onChange: (m) => {
                      const C = m.target.value;
                      s(a, {
                        ...c,
                        effect: C === "SKIP" ? { mode: "SKIP" } : C === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : {
                          mode: "SET_TAG_GROUP",
                          tagGroupId: Number(C.slice(6))
                        }
                      });
                    },
                    children: [
                      /* @__PURE__ */ n("option", { value: "SKIP", children: "Skip" }),
                      /* @__PURE__ */ n("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
                      c.effect.mode === "SET_TAG_GROUP" && !r.some(
                        (m) => m.id === c.effect.tagGroupId
                      ) && /* @__PURE__ */ n(
                        "option",
                        {
                          value: `group:${c.effect.tagGroupId}`,
                          disabled: !0,
                          children: "Unavailable tag group"
                        }
                      ),
                      r.map((m) => /* @__PURE__ */ n("option", { value: `group:${m.id}`, children: m.name }, m.id))
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
                      (m, C) => C !== a
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
function To({
  occurrence: e = !1,
  step: t,
  index: r,
  dragHandleProps: i,
  saving: s,
  isOver: c,
  onChange: a,
  onRemove: f
}) {
  const p = Qn(t.mode);
  return /* @__PURE__ */ u(
    "div",
    {
      className: c ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": p,
      children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            ...i,
            disabled: s,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${r + 1}`,
            children: /* @__PURE__ */ n(Or, {})
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
            onChange: (m) => a({ ...t, mode: m.target.value }),
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
          He,
          {
            entityType: "tag",
            values: t.tagIds,
            onChange: (m) => a({ ...t, tagIds: m }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: f, children: /* @__PURE__ */ n(Tn, {}) })
      ]
    }
  );
}
async function Ro() {
  const e = await _("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const a = JSON.parse(r);
      Array.isArray(a.reviews) && (i = JSON.stringify(a.reviews, null, 2));
    } catch {
    }
  const s = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), c = document.createElement("a");
  c.href = s, c.download = "data-quality-browser-recovery.json", c.click(), URL.revokeObjectURL(s);
}
function pn({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(Nn, { className: "dq-spin" }),
    e
  ] });
}
function gn({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(wr, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const Mo = { components: { DataQualityPage: ho } };
export {
  ho as DataQualityPage,
  Mo as default,
  Tr as objectFiltersEqual
};
