import { jsxs as d, jsx as n, Fragment as Te } from "react/jsx-runtime";
import { useState as C, useEffect as ne, useMemo as at, useRef as B, useCallback as Qe, useLayoutEffect as Hr } from "react";
import { useKeySequence as Kn, EntityReferenceMultiSelector as dt, VideoPlayer as Xr, TAG_SORT_OPTIONS as Yr, VIDEO_SORT_OPTIONS as Zr, FilterDialog as Gn, TAG_CRITERIA as en, VIDEO_CRITERIA as nr, DetailListToolbar as Vn, DetailListPagination as Bn, TagTile as Jn, VideoCard as zn, EntityDetailTabs as Wn, SortableList as ir } from "@cove/runtime/components";
import { ChevronLeft as tn, Pencil as rn, Settings as Qn, AlertTriangle as or, Save as Hn, RotateCcw as Xn, ChevronRight as nn, Film as sr, Loader2 as on, Tags as Yn, ExternalLink as Zn, X as sn, Plus as ei, Upload as ti, Trash2 as an, GripVertical as gr } from "@cove/runtime/lucide-react";
import { extensionFetch as ri } from "@cove/runtime/api";
function tr(e) {
  return e.actions.length ? JSON.stringify(["actions", e.actions.map((t) => t.steps)]) : JSON.stringify([[...e.occurrence.tagIds].sort((t, r) => t - r), e.occurrence.multiple]);
}
function Ce(e) {
  return e.entityType ?? "video";
}
function Me(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function ar(e) {
  if (e.entityType === "performerOccurrence") {
    if (!ln(e.occurrence))
      return "Complete the optional occurrence condition before saving.";
    if (e.actions.some((r) => r.steps.some((i) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(i.mode))))
      return "Occurrence actions support adding and removing tags on the active performer. Video tag assessments are not supported here.";
  }
  if (Ce(e) === "video" && e.actions.some(
    (r) => cn(r)
  ))
    return "An action cannot contain contradictory assessments for the same tag.";
  if (!e.name.trim() || !e.actions.every((r) => ut(r, Ce(e))))
    return "Name the review and complete every action step before saving.";
  if (new Set(e.actions.map((r) => r.id)).size !== e.actions.length)
    return "Action IDs must be unique within a review.";
  const t = e.actions.map(
    (r, i) => r.shortcut ?? (i < 9 ? String(i + 1) : "")
  ).filter(Boolean);
  return t.some((r) => !/^[1-9]$/.test(r)) || new Set(t).size !== t.length ? "Assign each shortcut 1–9 only once, or choose None. Navigation and player keys are reserved." : "";
}
function Se(e) {
  const t = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(1e3, t(e.perPage, 40)))
  };
}
function Lr(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function Le(e) {
  const { page: t, ...r } = e.view.filter, i = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    e.entityType === "performerOccurrence" ? ["performerOccurrence", ...i, e.occurrence] : Ce(e) === "tag" ? ["tag", ...i] : i
  );
}
function ut(e, t) {
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
  ) && !cn(e) : !1;
}
function Ft(e) {
  return "steps" in e ? e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  ) : !1;
}
function cn(e) {
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
function bt(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || r.entityType === "video" || r.entityType === "tag" || r.entityType === "performerOccurrence") && (r.entityType !== "performerOccurrence" || ln(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && ni(r.presentation, r.entityType === "tag") && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (r.entityType === "tag" ? "effect" in i && !("steps" in i) && ut(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (s) => s && Array.isArray(s.tagIds)
      ) && ut(i, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => ar(r)))
    throw new Error(
      "Saved reviews contain invalid actions or shortcuts. Existing data has been kept; assign shortcuts 1–9 only once or leave them empty."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function ni(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const r = e;
  return (r.cardSize === void 0 || r.cardSize === null || Number.isFinite(r.cardSize) && r.cardSize >= 115 && r.cardSize <= 380) && (!t || r.annotations === void 0 && r.annotationParents === void 0 && r.binParents === void 0) && (r.annotations === void 0 || Array.isArray(r.annotations) && r.annotations.every(
    (i) => ["date", "studio", "performers", "tags"].includes(i)
  )) && [r.annotationParents, r.binParents].every(
    (i) => i === void 0 || Array.isArray(i) && i.every((s) => Number.isSafeInteger(s) && s > 0)
  );
}
function cr(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const s of i)
      r.has(s.id) || (r.add(s.id), t.push(s));
  return t;
}
function ln(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (i) => Array.isArray(i) && i.every((s) => Number.isSafeInteger(s) && s > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && (t.targetMode !== "selected" || t.performerIds.length > 0) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && ["any", "includes", "includesAll", "excludes", "isNull"].includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && r(t.tagIds) && typeof t.multiple == "boolean";
}
function Dr(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function Fr(e, t, r, i) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!i && t.includes(r)) return r;
  const s = Math.max(0, e.indexOf(r));
  if (i) {
    for (const a of e.slice(s + 1))
      if (t.includes(a)) return a;
    if (t.includes(r)) {
      for (const a of e.slice(0, s).reverse())
        if (t.includes(a)) return a;
      return r;
    }
  }
  return t[Math.min(s, t.length - 1)];
}
function ii(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((s) => r.has(s));
  for (const s of t)
    i ? r.delete(s) : r.add(s);
  return r;
}
function ct(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const dn = "ext:com.midnightrider.data-quality:configuration", oi = "ext:cove-data-quality:video-reviews", lr = "ext:com.midnightrider.data-quality:progress", wt = /* @__PURE__ */ new Map(), xt = /* @__PURE__ */ new Map(), st = (e, t) => e.includes("*") || e.includes(t), Ut = (e) => F(`/api/savedfilters?mode=${encodeURIComponent(e)}`), si = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function dr(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function lt(e) {
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
    reviews: bt(JSON.stringify(t.reviews)),
    deletedIds: dr(t.deletedIds),
    importedIds: dr(t.importedIds)
  };
}
function ai(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const s of t) {
    const a = localStorage.getItem(s);
    if (a !== null) {
      const l = bt(a);
      r ?? (r = l), l.forEach((h) => i.add(h.id));
    }
    dr(
      JSON.parse(localStorage.getItem(`${s}:account-imports`) ?? "[]")
    ).forEach((l) => i.add(l));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function un(e) {
  const t = await F("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function fn(e, t) {
  const r = (xt.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return xt.set(e, r), r.finally(() => {
    xt.get(e) === r && xt.delete(e);
  }).catch(() => {
  }), r;
}
let mt = null;
function ci() {
  if (mt) return mt;
  const e = li();
  return mt = e, e.finally(() => {
    mt === e && (mt = null);
  }).catch(() => {
  }), e;
}
async function li() {
  var m;
  const e = await F("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = st(e.permissions, "savedfilters.read"), s = i && st(e.permissions, "savedfilters.write"), a = i ? (await Ut(dn)).filter((E) => E.name === "Data Quality configuration").sort((E, N) => E.id - N.id) : [];
  if (a.length > 1) {
    const E = (N) => {
      const { revision: P, ...U } = lt(N.uiOptions);
      return JSON.stringify(U);
    };
    if (a.some((N) => E(N) !== E(a[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (s)
      for (const N of a.slice(1))
        await F(`/api/savedfilters/${N.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${N.id}` })
        });
    a.splice(1);
  }
  let l = a.length ? lt(a[0].uiOptions) : si();
  const h = localStorage.getItem(`${r}:migrated`) === "true", u = localStorage.getItem(r), f = localStorage.getItem(`${r}:local-only`) === "true";
  !a.length && u && (l = lt(u));
  let w = !a.length;
  if (a.length && f && u) {
    const E = lt(u);
    if (E.reviews.some((P) => {
      const U = l.reviews.find((x) => x.id === P.id);
      return U && JSON.stringify(U) !== JSON.stringify(P);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const N = [
      .../* @__PURE__ */ new Set([...l.deletedIds, ...E.deletedIds])
    ];
    l = {
      ...l,
      reviews: cr(l.reviews, E.reviews).filter(
        (P) => !N.includes(P.id)
      ),
      deletedIds: N,
      importedIds: [
        .../* @__PURE__ */ new Set([...l.importedIds, ...E.importedIds])
      ]
    }, w = !0;
  }
  if (!h) {
    const E = JSON.stringify(l), N = ai(t);
    if (a.length && N.reviews.some((O) => {
      const z = l.reviews.find((X) => X.id === O.id);
      return z && JSON.stringify(z) !== JSON.stringify(O);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const P = i ? (await Ut(oi)).flatMap(
      (O) => bt(O.uiOptions ?? "[]")
    ) : [], U = N.known.filter(
      (O) => !N.reviews.some((z) => z.id === O)
    ), x = /* @__PURE__ */ new Set([...l.deletedIds, ...U]);
    l = {
      ...l,
      reviews: cr(
        N.reviews,
        l.reviews,
        P.filter(
          (O) => !N.known.includes(O.id) && !l.importedIds.includes(O.id)
        )
      ).filter((O) => !x.has(O.id)),
      deletedIds: [...x],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...l.importedIds,
          ...N.known,
          ...P.map((O) => O.id)
        ])
      ]
    }, w || (w = JSON.stringify(l) !== E);
  }
  const y = {
    userId: t,
    recordId: (m = a[0]) == null ? void 0 : m.id,
    config: l,
    readable: i,
    writable: s,
    durable: s
  };
  if (wt.set(r, y), w && s) {
    const E = l;
    a.length && (y.config = lt(a[0].uiOptions)), await pn(r, E), l = y.config;
  } else a.length || (localStorage.setItem(r, JSON.stringify(l)), !i && (!h || f) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (s)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: l.reviews,
    storageKey: r,
    canWrite: st(e.permissions, "videos.write"),
    canWriteVideos: st(e.permissions, "videos.write"),
    canWriteTags: st(e.permissions, "tags.write"),
    canReadTagGroups: st(e.permissions, "taggroups.read"),
    canConfigure: !i || s,
    storageNotice: i ? s ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function pn(e, t) {
  const r = wt.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await un(r), r.recordId != null) {
      const a = await F(
        `/api/savedfilters/${r.recordId}`
      );
      if (lt(a.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const s = await F(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: dn,
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
function di(e, t) {
  return bt(JSON.stringify(t)), fn(e, async () => {
    const r = wt.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((s) => !t.some((a) => a.id === s.id)).map((s) => s.id);
    await pn(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((s) => !t.some((a) => a.id === s))
    });
  });
}
function Ur(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([r, i]) => /^[1-9]\d*:[1-9]\d*$/.test(r) && ["reviewed", "cannotDetermine"].includes(String(i)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function gn(e, t) {
  const r = wt.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), s = i ? Ur(i) : null;
  if (!r.readable) return s;
  const a = (await Ut(lr)).find(
    (h) => h.name === t
  ), l = a ? Ur(a.uiOptions) : null;
  return s && (!l || s.updatedAt > l.updatedAt) ? s : l;
}
function hn(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return fn(i, async () => {
    const s = wt.get(e);
    if (!(s != null && s.writable)) return;
    await un(s);
    const a = (await Ut(lr)).find(
      (l) => l.name === t
    );
    await F(
      a ? `/api/savedfilters/${a.id}` : "/api/savedfilters",
      {
        method: a ? "PUT" : "POST",
        body: JSON.stringify({
          mode: lr,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const vt = "confirmed_absent_tags", hr = "Confirmed absent tags", ui = {
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
function ft(e) {
  return Array.isArray(e) ? e.map(ft) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? ui[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === vt.toLowerCase() ? r.toLowerCase() : ft(r)
    ])
  ) : e;
}
async function F(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await ri(e, { ...t, headers: r });
  if (!i.ok) {
    let a = i.statusText || `Request failed (${i.status}).`;
    try {
      const l = await i.json();
      a = l.message || l.detail || l.error || a;
    } catch {
    }
    throw new Error(a);
  }
  if (i.status === 204 || i.status === 205) return;
  const s = await i.text();
  return s ? JSON.parse(s) : void 0;
}
async function Dt(e, t, r) {
  const i = { ...e.view.objectFilter }, s = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return F("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      ft({
        findFilter: Se(t),
        objectFilter: i,
        filterExpression: s
      })
    )
  });
}
async function jr(e, t, r) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, F("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      ft({
        findFilter: Se(t),
        objectFilter: i
      })
    )
  });
}
function fi(e) {
  return F("/api/taggroups", { signal: e });
}
function pi(e) {
  return `/api/videos/${e.id}/image?max=1280&v=${encodeURIComponent(e.updatedAt)}`;
}
function mn(e) {
  return `/api/stream/video/${e}`;
}
function Kr(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function gi(e) {
  return `/api/stream/video/${e}/preview`;
}
function hi(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function mi(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Kt(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await F(`/api/tags/${r}`), t.add(r);
    for (let i = 1; ; i++) {
      const s = await F("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          ft({
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
      for (const a of s.items) t.add(a.id);
      if (i * 1e3 >= s.totalCount) break;
      if (!s.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...t];
}
function yi(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${vt} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function mr() {
  const t = (await F("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === vt.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${hr} custom field before applying tag assessments.`
    };
  const r = yi(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function bi() {
  const e = await mr();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await F("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: vt,
        label: hr,
        type: "tag",
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function jt(e) {
  return [...new Set(e)];
}
function wi(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${vt} value is not a valid tag list.`
    );
  return jt(e);
}
function vi(e) {
  return jt(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function Si(e, t) {
  let r;
  try {
    r = await mr();
  } catch (f) {
    throw new Error(
      `Could not verify the ${hr} custom field. ${f instanceof Error ? f.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const i = await Promise.all(
    e.steps.map(async (f) => ({
      ...f,
      tagIds: f.mode === "REMOVE_TREE" ? await Kt(f.tagIds) : jt(f.tagIds)
    }))
  ), s = i.filter(
    (f) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(f.mode)
  ), a = i.filter(
    (f) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(f.mode)
  ), l = jt(t), h = r.definition.key;
  let u = 0;
  for (const f of l)
    try {
      const w = await F(`/api/videos/${f}`), y = vi(w), m = { ...w.customFields ?? {} }, E = m[h], N = wi(E), P = new Set(y), U = new Set(N);
      for (const X of s)
        for (const A of X.tagIds)
          X.mode === "ADD" ? P.add(A) : P.delete(A);
      for (const X of a)
        for (const A of X.tagIds)
          X.mode === "MARK_PRESENT" ? (P.add(A), U.delete(A)) : X.mode === "MARK_ABSENT" ? (P.delete(A), U.add(A)) : U.delete(A);
      const x = [...P], O = [...U];
      JSON.stringify(y) === JSON.stringify(x) && JSON.stringify(N) === JSON.stringify(O) && (E === void 0 ? O.length === 0 : JSON.stringify(E) === JSON.stringify(N)) || await F(`/api/videos/${f}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: x,
          customFields: {
            ...m,
            [h]: O
          }
        })
      }), u++;
    } catch (w) {
      throw new Error(
        `Assessment stopped after ${u} video${u === 1 ? "" : "s"} completed; video ${f} was affected. Refresh and inspect it before retrying. ${w instanceof Error ? w.message : "Request failed."}`
      );
    }
}
async function Ei(e, t) {
  if (!ut(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (Ft(e)) {
    await Si(e, t);
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
      await F("/api/videos/bulk", {
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
async function Ci(e, t) {
  if (!ut(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await F("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
async function Ni(e, t, r) {
  if (!ut(r) || r.steps.some(
    (a) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(a.mode)
  ))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const i = await Promise.all(
    r.steps.map(async (a) => ({
      ...a,
      tagIds: a.mode === "REMOVE_TREE" ? await Kt(a.tagIds) : a.tagIds
    }))
  );
  let s = t.applications;
  for (const a of i)
    s = await bn(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: a.tagIds,
          multiple: !0
        }
      },
      t,
      a.mode === "ADD" ? a.tagIds : []
    );
  return s;
}
async function Ai(e, t) {
  const r = e.occurrence;
  if (r.targetMode === "all") return null;
  if (r.targetMode === "selected") return r.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: s, ...a } = r.performerFilter;
  for (let l = 1; ; l++) {
    const h = await F("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        ft({
          findFilter: { page: l, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: a,
          filterExpression: s
        })
      )
    });
    if (h.items.forEach((u) => i.add(u.id)), l * 1e3 >= h.totalCount) return [...i];
    if (!h.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function yn(e, t) {
  const { _filterExpression: r, ...i } = e.view.objectFilter, s = e.occurrence, a = {
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
            { filter: { performerFilterCriterion: a } }
          ]
        }
      }
    }
  };
}
function Ti(e, t) {
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
async function yt(e, t, r, i) {
  if ((t == null ? void 0 : t.length) === 0)
    return { items: [], totalCount: 0 };
  const s = await Dt(
    yn(e, t),
    { ...e.view.filter, page: r },
    i
  ), a = t === null ? null : new Set(t), l = new Array(s.items.length);
  let h = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, s.items.length) }, async () => {
      for (; h < s.items.length; ) {
        const u = h++, f = s.items[u], w = await F(
          `/api/tagapplications?hostType=video&hostId=${f.id}&contextType=performer`,
          { signal: i }
        );
        l[u] = f.performers.filter((y) => a === null || a.has(y.id)).flatMap((y) => {
          const m = w.filter(
            (E) => E.hostType === "video" && E.hostId === f.id && E.contextType === "performer" && E.contextId === y.id
          );
          return Ti(
            e.occurrence,
            m.map((E) => E.tag.id)
          ) ? [
            {
              key: `${f.id}:${y.id}`,
              video: f,
              performer: y,
              applications: m
            }
          ] : [];
        });
      }
    })
  ), { items: l.flat(), totalCount: s.totalCount };
}
async function bn(e, t, r) {
  const i = new Set(e.occurrence.tagIds);
  if (r.some((u) => !i.has(u)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const s = await F(`/api/videos/${t.video.id}`);
  if (!s.performers.some(
    (u) => u.id === t.performer.id
  ))
    throw new Error(
      "This performer is no longer linked to the scene. Refresh the queue."
    );
  const a = `/api/tagapplications?hostType=video&hostId=${s.id}&contextType=performer&contextId=${t.performer.id}`, l = (await F(a)).filter(
    (u) => u.hostType === "video" && u.hostId === s.id && u.contextType === "performer" && u.contextId === t.performer.id
  ), h = new Set(r);
  try {
    for (const u of h)
      l.some((f) => f.tag.id === u) || await F("/api/tagapplications", {
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
    for (const u of l)
      i.has(u.tag.id) && !h.has(u.tag.id) && await F(`/api/tagapplications/${u.id}`, {
        method: "DELETE"
      });
    return await F(a);
  } catch (u) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${u instanceof Error ? u.message : "Request failed."}`
    );
  }
}
function Gr({
  review: e,
  onChange: t,
  choices: r = !1
}) {
  const i = e.occurrence, s = (a) => t({ ...e, occurrence: { ...i, ...a } });
  return r ? /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ n("p", { children: "Choose the tags this review can change on the active performer’s appearance in a scene. Other tags are preserved." }),
    /* @__PURE__ */ n(
      dt,
      {
        entityType: "tag",
        values: i.tagIds,
        onChange: (a) => s({ tagIds: a }),
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
          onChange: (a) => s({ multiple: a.target.checked })
        }
      ),
      "Allow multiple tags, for example when a hairstyle changes during the scene"
    ] }),
    /* @__PURE__ */ n("p", { children: "Save & next performer records the selected tags, including an explicit empty answer. Cannot determine records an inconclusive outcome without changing tags. Skip leaves the occurrence unresolved." })
  ] }) : /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Occurrence condition (optional)" }),
    /* @__PURE__ */ n("p", { children: "Leave this unrestricted to review any appearance. Choose performers temporarily in the review workspace." }),
    /* @__PURE__ */ d("label", { children: [
      "Occurrence condition",
      /* @__PURE__ */ d(
        "select",
        {
          "aria-label": "Occurrence condition",
          value: i.condition,
          onChange: (a) => s({
            condition: a.target.value
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
      dt,
      {
        entityType: "tag",
        values: i.conditionTagIds,
        onChange: (a) => s({ conditionTagIds: a }),
        placeholder: "Search occurrence condition tags...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("p", { children: "Conditions check exact tags on the same performer’s occurrence, independently of scene tags and the performer’s profile." })
  ] });
}
function Ri({
  review: e,
  storageKey: t,
  canWrite: r,
  onBusy: i
}) {
  var Ue, je, ee, Ke;
  const [s, a] = C([]), [l, h] = C(
    () => ct(document.activeElement)
  );
  ne(() => {
    const p = (M) => h(ct(M.target)), T = (M) => h(ct(M.relatedTarget ?? document.body));
    return document.addEventListener("focusin", p), document.addEventListener("focusout", T), () => {
      document.removeEventListener("focusin", p), document.removeEventListener("focusout", T);
    };
  }, []);
  const u = at(
    () => ({
      ...e,
      occurrence: {
        ...e.occurrence,
        targetMode: s.length ? "selected" : "all",
        performerIds: s,
        performerFilter: {}
      }
    }),
    [e, s]
  ), [f, w] = C([]), [y, m] = C(1), [E, N] = C(0), [P, U] = C(null), [x, O] = C(
    {}
  ), [z, X] = C([]), [A, v] = C({}), [R, D] = C(!0), [j, ce] = C(!1), [W, ye] = C(!1), He = B(!1), [oe, qe] = C(""), [Oe, De] = C(""), [Xe, St] = C(""), [Fe, Gt] = C(0), Ye = B(null), $e = B(null), Ze = B(null), _e = B(/* @__PURE__ */ new Set()), L = f.find((p) => p.key === P) ?? null, Et = f.findIndex((p) => p.key === P), se = Number(Se(u.view.filter).perPage), xe = Math.max(1, Math.ceil(E / se)), K = (p, T, M = x) => ({
    version: 1,
    signature: Le(u),
    filter: { ...u.view.filter, page: p },
    focusedId: T ? Number(T.split(":")[0]) : null,
    index: 0,
    displayMode: "grid",
    cardSize: null,
    updatedAt: Date.now(),
    occurrence: {
      answerSignature: tr(u),
      focusedKey: T,
      outcomes: M
    }
  });
  async function S(p) {
    $e.current = p;
    try {
      await hn(t, u.id, p);
    } catch (T) {
      St(
        `Progress sync failed. Retry sync before leaving this browser. ${T instanceof Error ? T.message : "Request failed."}`
      );
    }
  }
  function _(p) {
    De(""), U((p == null ? void 0 : p.key) ?? null), X(
      p ? [
        ...new Set(
          p.applications.map((T) => T.tag.id).filter((T) => u.occurrence.tagIds.includes(T))
        )
      ] : []
    );
  }
  ne(() => {
    const p = new AbortController();
    return Ze.current = p, D(!0), ce(!1), qe(""), w([]), U(null), X([]), O({}), N(0), $e.current = null, _e.current.clear(), (async () => {
      var Ge, Re, de, fe;
      const T = await gn(t, u.id), $ = (((Ge = T == null ? void 0 : T.occurrence) == null ? void 0 : Ge.answerSignature) === void 0 || T.occurrence.answerSignature === tr(u)) && (T == null ? void 0 : T.signature) === Le(u) ? T : null, q = ((Re = T == null ? void 0 : T.occurrence) == null ? void 0 : Re.answerSignature) === tr(u) ? T.occurrence.outcomes : ((de = T == null ? void 0 : T.occurrence) == null ? void 0 : de.answerSignature) === void 0 ? ((fe = $ == null ? void 0 : $.occurrence) == null ? void 0 : fe.outcomes) ?? {} : {}, V = await Ai(u, p.signal), ie = await Promise.all(
        (u.actions.length ? [] : u.occurrence.tagIds).map(
          async (te) => [
            te,
            (await F(`/api/tags/${te}`, {
              signal: p.signal
            })).name
          ]
        )
      );
      let H = $ ? Number(Se($.filter).page) : 1, he = await yt(
        u,
        V,
        H,
        p.signal
      );
      const Ae = Math.max(1, Math.ceil(he.totalCount / se));
      (!$ && u.view.startFrom === "end" || H > Ae) && (H = Ae, he = await yt(
        u,
        V,
        H,
        p.signal
      ));
      let le = he.items.find(
        (te) => {
          var be;
          return te.key === ((be = $ == null ? void 0 : $.occurrence) == null ? void 0 : be.focusedKey);
        }
      ) ?? he.items.find((te) => !q[te.key]);
      const we = u.view.startFrom === "end" ? -1 : 1;
      for (; !le && (we === 1 ? H < Math.ceil(he.totalCount / se) : H > 1); )
        H += we, he = await yt(
          u,
          V,
          H,
          p.signal
        ), le = he.items.find((te) => !q[te.key]);
      p.signal.aborted || (Ye.current = V, v(Object.fromEntries(ie)), O(q), w(he.items), m(H), N(he.totalCount), _(le ?? null), ce(!0));
    })().catch((T) => {
      p.signal.aborted || qe(
        T instanceof Error ? T.message : "Could not load occurrences."
      );
    }).finally(() => {
      p.signal.aborted || D(!1);
    }), () => p.abort();
  }, [u, t, Fe]), ne(() => (i(W || R), () => i(!1)), [W, R, i]);
  async function G(p, T = x) {
    var M;
    if (!(!j || W || R)) {
      D(!0), qe("");
      try {
        const $ = await yt(
          u,
          Ye.current,
          p,
          (M = Ze.current) == null ? void 0 : M.signal
        ), q = Math.max(1, Math.ceil($.totalCount / se));
        if (p > q) {
          await G(q, T);
          return;
        }
        w($.items), m(p), N($.totalCount);
        const V = $.items.find((ie) => !T[ie.key]) ?? null;
        _(V), await S(K(p, (V == null ? void 0 : V.key) ?? null, T));
      } catch ($) {
        qe(
          $ instanceof Error ? $.message : "Could not load occurrences."
        );
      } finally {
        D(!1);
      }
    }
  }
  async function Ne(p, T) {
    var M;
    if (!(!j || !L || He.current || R || p && !r)) {
      He.current = !0, ye(!0), i(!0), qe("");
      try {
        if (p === "reviewed") {
          const V = T ? await Ni(u, L, T) : await bn(u, L, z);
          w(
            (ie) => ie.map(
              (H) => H.key === L.key ? { ...H, applications: V } : H
            )
          );
        }
        const $ = { ...x };
        p ? $[L.key] = p : _e.current.add(L.key), O($);
        const q = f.slice(Et + 1).find(
          (V) => !$[V.key] && !_e.current.has(V.key)
        ) ?? null;
        if (q)
          _(q), await S(K(y, q.key, $));
        else {
          await S(K(y, null, $)), await new Promise((H) => window.setTimeout(H, 1100));
          let V = y;
          const ie = u.view.startFrom === "end" ? -1 : 1;
          for (; ; ) {
            const H = await yt(
              u,
              Ye.current,
              V,
              (M = Ze.current) == null ? void 0 : M.signal
            ), he = Math.max(1, Math.ceil(H.totalCount / se));
            if (V > he) {
              V = he;
              continue;
            }
            const Ae = H.items.find(
              (le) => !$[le.key] && !_e.current.has(le.key)
            );
            if (Ae || (ie === 1 ? V >= he : V <= 1)) {
              w(H.items), m(V), N(H.totalCount), _(Ae ?? null), await S(
                K(V, (Ae == null ? void 0 : Ae.key) ?? null, $)
              ), Ae || De(
                "No more unresolved occurrences in this direction. Skipped performers remain unresolved and can be revisited from the scene pages."
              );
              break;
            }
            V += ie;
          }
        }
      } catch ($) {
        qe(
          $ instanceof Error ? $.message : "Could not save this occurrence."
        );
      } finally {
        He.current = !1, ye(!1), i(!1);
      }
    }
  }
  const Vt = f.filter((p) => !x[p.key]).length;
  return Kn(
    u.actions.map((p, T) => ({
      keys: Me(p, T),
      surface: "local",
      action: (M) => {
        M != null && M.repeat || M && !ct(M.target) || Ne(p.steps.length ? "reviewed" : void 0, p);
      }
    })).filter((p) => p.keys),
    j && !W && !R && l
  ), /* @__PURE__ */ d(
    "section",
    {
      className: "dq-occurrence-workspace",
      "aria-label": "Performer occurrence review",
      onKeyDown: (p) => {
        if (p.stopPropagation(), p.defaultPrevented || p.ctrlKey || p.altKey || p.metaKey || p.repeat || !ct(p.target))
          return;
        const T = u.actions.find(
          (M, $) => Me(M, $) === p.key
        );
        T && (p.preventDefault(), Ne(T.steps.length ? "reviewed" : void 0, T));
      },
      children: [
        /* @__PURE__ */ d("div", { className: "dq-occurrence-toolbar", children: [
          /* @__PURE__ */ d("div", { className: "dq-occurrence-filter", children: [
            /* @__PURE__ */ n("strong", { children: "Filter performers" }),
            /* @__PURE__ */ n(
              dt,
              {
                entityType: "performer",
                values: s,
                onChange: (p) => {
                  ce(!1), a(p);
                },
                placeholder: "All performers — select performers...",
                disabled: W || R,
                allowCreate: !1
              }
            ),
            /* @__PURE__ */ n("p", { children: s.length ? "Only selected performers are reviewed. This filter does not change the saved review." : "All performers in matching scenes. Select one or more to focus this session." }),
            s.length > 0 && /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: W || R,
                onClick: () => {
                  ce(!1), a([]);
                },
                children: "Clear performer filter"
              }
            )
          ] }),
          /* @__PURE__ */ n("p", { role: "status", children: R ? "Loading performer occurrences…" : `${Vt} unresolved of ${f.length} performer ${f.length === 1 ? "occurrence" : "occurrences"} on this page · ${E} matching ${E === 1 ? "scene" : "scenes"}` }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: !j || W || R || y <= 1,
              onClick: () => void G(y - 1),
              children: "Previous scene page"
            }
          ),
          /* @__PURE__ */ d("span", { children: [
            "Scene page ",
            y,
            " of ",
            xe
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: !j || W || R,
              onClick: () => void G(y),
              children: "Refresh page"
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: !j || W || R || y >= xe,
              onClick: () => void G(y + 1),
              children: "Next scene page"
            }
          )
        ] }),
        oe && /* @__PURE__ */ d("p", { role: "alert", children: [
          oe,
          " ",
          !W && /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => Gt((p) => p + 1),
              children: "Reload queue"
            }
          )
        ] }),
        Oe && /* @__PURE__ */ n("p", { role: "status", children: Oe }),
        Xe && /* @__PURE__ */ d("p", { role: "alert", children: [
          Xe,
          " ",
          $e.current && /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => {
                St(""), S($e.current);
              },
              children: "Retry progress sync"
            }
          )
        ] }),
        !R && !L && /* @__PURE__ */ n("p", { children: f.length ? "No active performer. Choose an occurrence below to review or revisit it." : "No performer occurrences match on this page." }),
        /* @__PURE__ */ d(
          "fieldset",
          {
            disabled: !j || W || R,
            className: "dq-occurrence-content",
            children: [
              L && /* @__PURE__ */ d(Te, { children: [
                /* @__PURE__ */ d("div", { className: "dq-occurrence-media", children: [
                  /* @__PURE__ */ n(
                    "a",
                    {
                      href: `/video/${L.video.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      children: L.video.title || ((Ue = L.video.files[0]) == null ? void 0 : Ue.basename) || "Open scene"
                    }
                  ),
                  /* @__PURE__ */ n(
                    Xr,
                    {
                      videoId: L.video.id,
                      streamUrl: mn(L.video.id),
                      posterUrl: pi(L.video),
                      duration: ((je = L.video.files[0]) == null ? void 0 : je.duration) ?? 0,
                      format: (ee = L.video.files[0]) == null ? void 0 : ee.format,
                      audioCodec: (Ke = L.video.files[0]) == null ? void 0 : Ke.audioCodec,
                      extensionSurface: "quick-view",
                      showAbLoop: !0,
                      clip: L.video.parentVideoId != null ? {
                        start: L.video.clipStartSec ?? 0,
                        end: L.video.clipEndSec,
                        loop: !1
                      } : void 0
                    },
                    L.video.id
                  )
                ] }),
                /* @__PURE__ */ d("div", { className: "dq-occurrence-panel", children: [
                  /* @__PURE__ */ d("h2", { children: [
                    "Reviewing ",
                    L.performer.name
                  ] }),
                  /* @__PURE__ */ n("p", { children: "Tags apply only to this performer in this scene." }),
                  /* @__PURE__ */ n(
                    "div",
                    {
                      className: "dq-occurrence-performers",
                      "aria-label": "Performers in this scene",
                      children: f.filter((p) => p.video.id === L.video.id).map((p) => /* @__PURE__ */ d(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          "aria-pressed": p.key === L.key,
                          onClick: () => {
                            _(p), S(K(y, p.key));
                          },
                          children: [
                            p.performer.imagePath ? /* @__PURE__ */ n(
                              "img",
                              {
                                src: `/api/performers/${p.performer.id}/image?max=96`,
                                alt: "",
                                onError: (T) => {
                                  T.currentTarget.hidden = !0;
                                }
                              }
                            ) : /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-occurrence-avatar",
                                "aria-hidden": "true",
                                children: p.performer.name.slice(0, 1)
                              }
                            ),
                            p.performer.name,
                            " ·",
                            " ",
                            x[p.key] === "reviewed" ? "Reviewed" : x[p.key] === "cannotDetermine" ? "Cannot determine" : "Unresolved"
                          ]
                        },
                        p.key
                      ))
                    }
                  ),
                  /* @__PURE__ */ d("p", { children: [
                    "Current occurrence tags:",
                    " ",
                    L.applications.length ? [
                      ...new Set(
                        L.applications.map((p) => p.tag.name)
                      )
                    ].join(", ") : "None"
                  ] }),
                  u.actions.length === 0 && u.occurrence.tagIds.length > 0 && /* @__PURE__ */ d(
                    "fieldset",
                    {
                      disabled: !r,
                      className: "dq-occurrence-choices",
                      children: [
                        /* @__PURE__ */ n("legend", { children: "Occurrence tags" }),
                        u.occurrence.tagIds.map((p) => /* @__PURE__ */ d("label", { children: [
                          /* @__PURE__ */ n(
                            "input",
                            {
                              type: u.occurrence.multiple ? "checkbox" : "radio",
                              name: "occurrence-tag",
                              checked: z.includes(p),
                              onChange: (T) => X(
                                u.occurrence.multiple ? T.target.checked ? [...z, p] : z.filter((M) => M !== p) : [p]
                              )
                            }
                          ),
                          A[p] ?? "Loading tag…"
                        ] }, p)),
                        /* @__PURE__ */ d("label", { children: [
                          /* @__PURE__ */ n(
                            "input",
                            {
                              type: u.occurrence.multiple ? "checkbox" : "radio",
                              name: "occurrence-tag",
                              checked: z.length === 0,
                              onChange: () => X([])
                            }
                          ),
                          "No applicable tags"
                        ] })
                      ]
                    }
                  ),
                  u.actions.length === 0 && u.occurrence.tagIds.length === 0 && /* @__PURE__ */ n("p", { children: "Use Edit review → Actions to add your review actions." }),
                  /* @__PURE__ */ d("div", { className: "dq-occurrence-actions", children: [
                    u.actions.map((p, T) => /* @__PURE__ */ d(
                      "button",
                      {
                        type: "button",
                        className: "dq-button primary",
                        disabled: !r && p.steps.length > 0,
                        onClick: () => void Ne(
                          p.steps.length ? "reviewed" : void 0,
                          p
                        ),
                        title: `Apply to ${L.performer.name} in this scene`,
                        children: [
                          Me(p, T) && /* @__PURE__ */ n("kbd", { children: Me(p, T) }),
                          " ",
                          p.label
                        ]
                      },
                      p.id
                    )),
                    u.actions.length === 0 && u.occurrence.tagIds.length > 0 && /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button primary",
                        disabled: !r || !u.occurrence.multiple && z.length > 1,
                        onClick: () => void Ne("reviewed"),
                        children: W ? "Saving…" : "Save & next performer"
                      }
                    ),
                    /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button",
                        disabled: !r,
                        onClick: () => void Ne("cannotDetermine"),
                        children: "Cannot determine & next"
                      }
                    ),
                    /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button",
                        onClick: () => void Ne(),
                        children: "Skip performer"
                      }
                    )
                  ] }),
                  !r && /* @__PURE__ */ n("p", { children: "Tag write permission is required to save occurrence reviews." })
                ] })
              ] }),
              /* @__PURE__ */ d("details", { className: "dq-occurrence-list", open: !L, children: [
                /* @__PURE__ */ d("summary", { children: [
                  "All ",
                  f.length,
                  " occurrences on this scene page"
                ] }),
                f.map((p) => /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    "aria-pressed": p.key === P,
                    onClick: () => {
                      _(p), S(K(y, p.key));
                    },
                    children: [
                      p.performer.name,
                      " — ",
                      p.video.title || "Scene",
                      " ·",
                      " ",
                      x[p.key] === "reviewed" ? "Reviewed" : x[p.key] === "cannotDetermine" ? "Cannot determine" : "Unresolved"
                    ]
                  },
                  p.key
                ))
              ] })
            ]
          }
        )
      ]
    }
  );
}
function Ii(e) {
  var h, u, f;
  const [t, r] = C({}), [i, s] = C(""), a = (((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.annotations) ?? []).includes("tags") ? ((u = e == null ? void 0 : e.presentation) == null ? void 0 : u.annotationParents) ?? [] : [], l = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...a,
      ...((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.binParents) ?? []
    ])
  ]);
  return ne(() => {
    let w = !0;
    return r({}), s(""), Promise.all(
      JSON.parse(l).map(
        async (y) => [y, await Kt([y])]
      )
    ).then((y) => {
      w && r(Object.fromEntries(y));
    }).catch(() => {
      w && s(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      w = !1;
    };
  }, [l]), { ids: t, error: i };
}
function ki(e, t, r) {
  const i = t == null ? void 0 : t.presentation, s = (i == null ? void 0 : i.annotations) ?? [], a = (i == null ? void 0 : i.annotationParents) ?? [];
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
    tags: s.includes("tags") && a.length > 0 ? (e.tags ?? []).filter(
      (l) => a.some(
        (h) => {
          var u;
          return h !== l.id && ((u = r[h]) == null ? void 0 : u.includes(l.id));
        }
      )
    ) : []
  };
}
function qi({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: s
}) {
  var h, u, f;
  const a = new Set(
    (((h = t.presentation) == null ? void 0 : h.binParents) ?? []).flatMap(
      (w) => (r[w] ?? []).filter((y) => y !== w)
    )
  ), l = /* @__PURE__ */ new Map();
  for (const w of e)
    for (const y of w.tags ?? [])
      if (a.has(y.id)) {
        const m = l.get(y.id) ?? { name: y.name, count: 0 };
        m.count++, l.set(y.id, m);
      }
  return (f = (u = t.presentation) == null ? void 0 : u.binParents) != null && f.length ? /* @__PURE__ */ d("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...l].sort((w, y) => w[1].name.localeCompare(y[1].name)).map(([w, y]) => /* @__PURE__ */ d(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => s(w),
        children: [
          y.name,
          " (",
          y.count,
          ")"
        ]
      },
      w
    )),
    !l.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function Oi(e, t) {
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
function Vr({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [s, a] = C(!1), l = Ce(e) === "tag" ? "tag" : "video", h = e.view.filter, u = l === "tag" ? Yr : Zr, f = (m) => t({
    ...e,
    view: { ...e.view, filter: { ...h, ...m } }
  }), w = l === "video" ? e.presentation ?? {} : {}, y = (m) => t({ ...e, presentation: { ...w, ...m } });
  return /* @__PURE__ */ d(Te, { children: [
    i && /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ d("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(h.q ?? ""),
            onChange: (m) => f({ q: m.target.value })
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
              value: String(h.sort ?? "date"),
              onChange: (m) => f({ sort: m.target.value, sorts: void 0 }),
              children: [
                !u.some((m) => m.value === h.sort) && h.sort != null && /* @__PURE__ */ n("option", { value: String(h.sort), children: String(h.sort) }),
                u.map((m) => /* @__PURE__ */ n("option", { value: m.value, children: m.label }, m.value))
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
              value: String(h.direction ?? "desc"),
              onChange: (m) => f({ direction: m.target.value }),
              children: [
                /* @__PURE__ */ n("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ n("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          l === "tag" ? "Tags" : "Videos",
          " per page",
          /* @__PURE__ */ n(
            "input",
            {
              type: "number",
              min: "1",
              max: "1000",
              value: Number(h.perPage) || 40,
              onChange: (m) => f({
                perPage: Math.max(
                  1,
                  Math.min(1e3, Number(m.target.value) || 40)
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
              onChange: (m) => t({
                ...e,
                view: {
                  ...e.view,
                  startFrom: m.target.value
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
          onClick: () => a(!0),
          children: [
            "Edit ",
            l,
            " filters"
          ]
        }
      ),
      /* @__PURE__ */ d("p", { children: [
        Object.keys(e.view.objectFilter).length ? `${l === "tag" ? "Tag" : "Video"} filters configured` : `No ${l} filters`,
        ". Choose which ",
        l === "tag" ? "tags" : "videos",
        " enter the queue."
      ] }),
      s && /* @__PURE__ */ n("div", { onKeyDown: (m) => m.stopPropagation(), children: /* @__PURE__ */ n(
        Gn,
        {
          open: !0,
          onClose: () => a(!1),
          criteria: l === "tag" ? en : nr,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: l === "video",
          subjectLabel: l === "tag" ? "tags" : "videos",
          onApply: (m) => {
            t({ ...e, view: { ...e.view, objectFilter: m } }), a(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ d(Te, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ d("p", { className: "dq-editor-note", children: [
        "Choose how ",
        l === "tag" ? "tags" : "videos and tags",
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ n("div", { className: "dq-field-grid", children: /* @__PURE__ */ d("label", { children: [
        "Preferred view",
        /* @__PURE__ */ n(
          "select",
          {
            value: l === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid",
            onChange: (m) => t({
              ...e,
              view: {
                ...e.view,
                displayMode: m.target.value
              }
            }),
            children: (l === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((m) => /* @__PURE__ */ n("option", { children: m }, m))
          }
        )
      ] }) }),
      l === "video" && /* @__PURE__ */ d(Te, { children: [
        /* @__PURE__ */ n("h4", { children: "Card annotations" }),
        /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((m) => {
          const E = w.annotations ?? [];
          return /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: E.includes(m),
                onChange: (N) => y({
                  annotations: N.target.checked ? [...E, m] : E.filter((P) => P !== m)
                })
              }
            ),
            m
          ] }, m);
        }) }),
        (w.annotations ?? []).includes("tags") && /* @__PURE__ */ d(Te, { children: [
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
          /* @__PURE__ */ n(
            dt,
            {
              entityType: "tag",
              values: w.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (m) => y({ annotationParents: m }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ n("h4", { children: "Tag bins" }),
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ n(
          dt,
          {
            entityType: "tag",
            values: w.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (m) => y({ binParents: m }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const Pi = {
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
function yr(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Mi(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function $i(e) {
  return [
    ...new Set(
      yr(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function _i(e, t) {
  const r = yr(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((i) => {
      const s = String(i.key ?? ""), a = Pi[String(i.modifier ?? "EQUALS")], l = (y, m) => String(m ?? "").trim() || t[String(y)] || String(y ?? ""), h = l(
        i.value,
        i.displayValue
      ), u = l(
        i.value2,
        i.displayValue2
      ), f = String(i.modifier ?? "EQUALS"), w = f === "IS_NULL" || f === "NOT_NULL" ? [] : f === "BETWEEN" || f === "NOT_BETWEEN" ? [h, "and", u] : [h];
      return {
        ...i,
        label: [Mi(s), a, ...w].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function xi(e) {
  const t = yr(e.customFieldCriteria);
  return t.length ? {
    ...e,
    customFieldCriteria: t.map(
      ({ label: r, ...i }) => i
    )
  } : e;
}
function Li(e, t, r) {
  return r || "customFieldCriteria" in t || !Array.isArray(e.customFieldCriteria) ? t : { ...t, customFieldCriteria: e.customFieldCriteria };
}
const rr = 180, Di = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function wn({ entityType: e }) {
  return e === "tag" ? /* @__PURE__ */ n(Yn, { role: "img", "aria-label": "Tag review" }) : /* @__PURE__ */ n(sr, { role: "img", "aria-label": e === "performerOccurrence" ? "Performer occurrence review" : "Video review" });
}
function Br(e) {
  return Ce(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Jr(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Fi() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function zr(e) {
  const t = new URLSearchParams(window.location.search);
  e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function Ui(e) {
  return Se({ ...e, page: 1 });
}
function ur(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((l, h) => ur(l, t[h]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, s = Object.keys(r).sort(), a = Object.keys(i).sort();
  return s.length === a.length && s.every(
    (l, h) => l === a[h] && ur(r[l], i[l])
  );
}
function vn(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Ee(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
const Sn = "data-quality.workspace-layout.v1", br = 240, fr = 192, pr = 560;
function En(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(pr, Math.max(fr, e)) : br;
}
function ji() {
  try {
    const e = JSON.parse(
      localStorage.getItem(Sn) ?? "null"
    );
    return En(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return br;
  }
}
function Ki(e) {
  try {
    localStorage.setItem(
      Sn,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function Cn(e) {
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
function Nn(e, t) {
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
function Gi(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : Nn(e, t);
}
function Vi({
  onNavigate: e
}) {
  const [t, r] = C([]), [i] = C(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [s, a] = C(""), [l, h] = C(!0), [u, f] = C(""), [w, y] = C(!1), [m, E] = C(!1), [N, P] = C(!1), [U, x] = C([]), [O, z] = C(""), [X, A] = C(!0), [v, R] = C(""), [D, j] = C(""), [ce, W] = C(!1), [ye, He] = C(!1), [oe, qe] = C(Fi), [Oe, De] = C({}), [Xe, St] = C("name"), [Fe, Gt] = C("asc"), Ye = B(null), $e = B(!1), [Ze, _e] = C(!1), [L, Et] = C(!1), [se, xe] = C(
    null
  ), K = t.find((o) => o.id === oe) ?? null, S = at(
    () => (se == null ? void 0 : se.id) === oe && K ? { ...K, view: se.view } : K,
    [se, oe, K]
  ), _ = S ? Ce(S) : "video", G = _ === "video" ? S : null, Ne = _ === "tag" ? m : w, Vt = at(() => {
    const o = Fe === "asc" ? 1 : -1;
    return [...t].sort((c, g) => {
      if (Xe === "count") {
        const b = Oe[c.id], k = Oe[g.id], I = typeof b == "number", J = typeof k == "number";
        if (I !== J) return I ? -1 : 1;
        if (I && J && b !== k)
          return (b - k) * o;
      }
      return c.name.localeCompare(g.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * o;
    });
  }, [Fe, Xe, Oe, t]), Ue = B(
    null
  ), je = Ii(G), [ee, Ke] = C({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [p, T] = C({
    page: 1,
    perPage: 40
  }), [M, $] = C({ items: [], totalCount: 0 }), [q, V] = C(!1), [ie, H] = C(""), [he, Ae] = C(!1), [le, we] = C(() => /* @__PURE__ */ new Set()), Ge = B(le);
  Ge.current = le;
  const Re = B(/* @__PURE__ */ new Map()), [de, fe] = C(null), te = B(de);
  te.current = de;
  const [be, et] = C(!1), Ie = B(be);
  Ie.current = be;
  const wr = B(null), [Ve, Bt] = C("grid"), [Ct, vr] = C(rr), [tt, Tn] = C(ji), [Q, Nt] = C(!1), At = B(!1), [Rn, Jt] = C(""), [Tt, Be] = C(""), [zt, pt] = C(""), [re, Sr] = C(null), [Er, Rt] = C(""), [It, kt] = C(!1), [Cr, Nr] = C({}), [Ar, Tr] = C({}), gt = B(/* @__PURE__ */ new Map()), Rr = B(null), qt = B(null), rt = B(0), Ot = B(0), Pt = B(null), Je = B(!1), Ir = JSON.stringify([
    ...new Set(
      (G == null ? void 0 : G.actions.flatMap(
        (o) => o.steps.flatMap((c) => c.tagIds)
      )) ?? []
    )
  ]);
  function Wt(o) {
    const c = En(o);
    Tn(c), Ki(c);
  }
  function In(o) {
    const c = o.shiftKey ? 40 : 16;
    let g = null;
    o.key === "ArrowLeft" && (g = tt + c), o.key === "ArrowRight" && (g = tt - c), o.key === "Home" && (g = fr), o.key === "End" && (g = pr), g !== null && (o.preventDefault(), o.stopPropagation(), Wt(g));
  }
  ne(() => {
    if (!Tt) return;
    const o = window.setTimeout(() => Be(""), 4e3);
    return () => window.clearTimeout(o);
  }, [Tt]), ne(() => {
    const o = JSON.parse(Ir);
    if (Tr({}), !o.length) return;
    const c = new AbortController();
    let g = !0;
    return Promise.all(
      o.map(async (b) => {
        var k;
        try {
          const I = await F(`/api/tags/${b}`, {
            signal: c.signal
          });
          return [b, ((k = I.name) == null ? void 0 : k.trim()) || null];
        } catch {
          return [b, null];
        }
      })
    ).then((b) => {
      g && Tr(Object.fromEntries(b));
    }), () => {
      g = !1, c.abort();
    };
  }, [Ir]), ne(() => {
    const o = G ? $i(G.view.objectFilter) : [];
    if (Nr({}), !o.length) return;
    const c = new AbortController();
    let g = !0;
    return Promise.all(
      o.map(async (b) => {
        var k;
        try {
          const I = await F(`/api/tags/${b}`, {
            signal: c.signal
          });
          return (k = I.name) != null && k.trim() ? [String(b), I.name] : null;
        } catch {
          return null;
        }
      })
    ).then((b) => {
      g && Nr(
        Object.fromEntries(b.filter((k) => k !== null))
      );
    }), () => {
      g = !1, c.abort();
    };
  }, [G == null ? void 0 : G.id, G == null ? void 0 : G.view.objectFilter]);
  const Qt = at(
    () => G ? _i(
      G.view.objectFilter,
      Cr
    ) : (S == null ? void 0 : S.view.objectFilter) ?? {},
    [Cr, S, G]
  ), kn = at(
    () => _ === "video" && Array.isArray(Qt.customFieldCriteria) ? [...nr, Di] : _ === "tag" ? en : nr,
    [_, Qt.customFieldCriteria]
  ), kr = Qe(async () => {
    h(!0), f("");
    try {
      const o = await ci();
      r(o.reviews), a(o.storageKey), y(o.canWriteVideos ?? o.canWrite), E(o.canWriteTags ?? !1), P(o.canReadTagGroups ?? !1), A(o.canConfigure ?? !0), R(o.storageNotice ?? ""), oe && !o.reviews.some((c) => c.id === oe) && (qe(""), zr(""));
    } catch (o) {
      f(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      h(!1);
    }
  }, [oe]);
  ne(() => {
    if (!N) {
      x([]), z("");
      return;
    }
    const o = new AbortController();
    return z(""), fi(o.signal).then(x).catch((c) => {
      o.signal.aborted || z(
        c instanceof Error ? c.message : "Could not load tag groups."
      );
    }), () => o.abort();
  }, [N]), ne(() => {
    kr();
  }, []), ne(() => {
    if (oe || t.length === 0) return;
    const o = new AbortController();
    De({});
    for (const c of t)
      (c.entityType === "performerOccurrence" ? Dt(yn(c, null), { ...c.view.filter, page: 1, perPage: 1 }, o.signal) : Ce(c) === "tag" ? jr(
        c,
        Se({ ...c.view.filter, page: 1, perPage: 1 }),
        o.signal
      ) : Dt(
        c,
        Se({ ...c.view.filter, page: 1, perPage: 1 }),
        o.signal
      )).then((b) => {
        o.signal.aborted || De((k) => ({
          ...k,
          [c.id]: b.totalCount
        }));
      }).catch(() => {
        o.signal.aborted || De((b) => ({ ...b, [c.id]: null }));
      });
    return () => o.abort();
  }, [oe, t]), Hr(() => {
    var o;
    oe || l || !$e.current || ($e.current = !1, (o = Ye.current) == null || o.focus());
  }, [oe, l]);
  const Mt = Qe(async () => {
    Rt("");
    try {
      Sr(await mr());
    } catch (o) {
      Sr(null), Rt(
        "Tag assessment setup could not be checked. " + (o instanceof Error ? o.message : "Request failed.")
      );
    }
  }, []);
  ne(() => {
    Mt();
  }, [Mt]);
  const ze = Qe(
    async (o, c, g = !1) => {
      var J;
      const b = ++rt.current;
      (J = Pt.current) == null || J.abort();
      const k = new AbortController();
      Pt.current = k, c = Se(c);
      const I = Number(c.page);
      g && (c = { ...c, page: 1 }), Ke(c), Ae(g), V(!0), H("");
      try {
        const ae = (it) => Ce(o) === "tag" ? jr(
          o,
          it,
          k.signal
        ) : Dt(
          o,
          it,
          k.signal
        );
        let me = await ae(c);
        const ke = Math.max(
          1,
          Math.ceil(me.totalCount / Number(c.perPage))
        ), ve = g ? ke : Math.min(I, ke);
        return Number(c.page) !== ve && (c = { ...c, page: ve }, me = await ae(c)), b === rt.current && ($(me), Ke(c), T(c)), me;
      } catch (ae) {
        throw b === rt.current && H(
          ae instanceof Error ? ae.message : "Could not load the review queue."
        ), ae;
      } finally {
        b === rt.current && V(!1);
      }
    },
    []
  );
  ne(() => {
    var c;
    if (Ot.current += 1, rt.current += 1, (c = Pt.current) == null || c.abort(), He(!1), j(""), W(!1), we(/* @__PURE__ */ new Set()), Re.current.clear(), fe(null), et(!1), Nt(!1), At.current = !1, Jt(""), Be(""), pt(""), $({ items: [], totalCount: 0 }), !S || S.entityType === "performerOccurrence") {
      V(!1);
      return;
    }
    let o = !0;
    return V(!0), (async () => {
      let g = null;
      try {
        g = await gn(s, S.id);
      } catch (I) {
        o && (W(!0), j(
          I instanceof Error ? I.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const b = (g == null ? void 0 : g.signature) === Le(S) ? g : null, k = b ? Se(b.filter) : Ui(S.view.filter);
      Ke(k), Bt(
        b ? Jr(b.displayMode, Ce(S)) : Br(S)
      ), vr(
        b ? b.cardSize ?? rr : rr
      );
      try {
        const I = await ze(
          S,
          k,
          !b && S.view.startFrom !== "beginning"
        );
        if (!o) return;
        const J = Lr(
          I.items.map((ae) => ae.id),
          (b == null ? void 0 : b.focusedId) ?? null,
          (b == null ? void 0 : b.index) ?? 0
        );
        fe(J), pe(J);
      } catch {
      }
      o && He(!0);
    })(), () => {
      var g;
      o = !1, Ot.current++, rt.current++, (g = Pt.current) == null || g.abort();
    };
  }, [S == null ? void 0 : S.id]);
  const Y = at(
    () => M.items.map((o) => o.id),
    [M.items]
  );
  ne(() => {
    if (!ye || !S || !s || q || ie || Q || (se == null ? void 0 : se.id) === S.id || ce)
      return;
    const o = {
      version: 1,
      signature: Le(S),
      filter: ee,
      focusedId: de,
      index: Math.max(0, Y.indexOf(de ?? -1)),
      displayMode: Ve,
      cardSize: Ct,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        s + ":progress:" + S.id,
        JSON.stringify(o)
      );
    } catch {
    }
    if (D) return;
    let c = !0;
    const g = window.setTimeout(() => {
      hn(s, S.id, o).catch((b) => {
        c && j(
          "Progress is kept in this browser, but account sync failed. " + (b instanceof Error ? b.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      c = !1, window.clearTimeout(g);
    };
  }, [
    ye,
    s,
    S,
    q,
    ie,
    Q,
    ee,
    de,
    Y,
    Ve,
    Ct,
    se,
    D,
    ce
  ]);
  const qn = M.items.find((o) => o.id === de) ?? null, Ht = _ === "video" ? qn : null;
  be && Ht && (wr.current = Ht);
  const We = Ht ?? (be ? wr.current : null), On = Dr(le, de), qr = le.size > 0 ? `${le.size} selected ${_}${le.size === 1 ? "" : "s"}` : de == null ? `no ${_}` : `focused ${_}`, pe = Qe((o, c = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const g = gt.current.get(o);
      g == null || g.focus({ preventScroll: !0 }), c && (g == null || g.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  ne(() => {
    ye && !Ie.current && pe(te.current);
  }, [ye, pe]), ne(() => {
    q || !Y.length || (te.current == null || !Y.includes(te.current)) && (fe(Y[0]), Ie.current || pe(Y[0]));
  }, [pe, Y, q]);
  const nt = Qe(
    (o) => {
      we((c) => {
        const g = o(c);
        for (const b of /* @__PURE__ */ new Set([...c, ...g]))
          c.has(b) !== g.has(b) && Re.current.set(
            b,
            (Re.current.get(b) ?? 0) + 1
          );
        return g;
      });
    },
    []
  ), Xt = Qe(
    (o) => {
      if (!Y.length) return;
      const c = Math.max(
        0,
        Y.indexOf(te.current ?? Y[0])
      ), g = Y[Math.max(0, Math.min(Y.length - 1, c + o))];
      fe(g), Ie.current || pe(g);
    },
    [pe, Y]
  ), Yt = Qe(
    async (o) => {
      const c = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", g = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, b = g != null && (!N || !U.some((Z) => Z.id === g)), k = "effect" in o && c && !N, I = Dr(
        Ge.current,
        te.current
      );
      if (!S || At.current || q || ie || c && !Ne || k || b || Ft(o) && (re == null ? void 0 : re.kind) !== "ready" || !I.length)
        return;
      const J = ++Ot.current, ae = S.id, me = [...Y], ke = M, ve = te.current, it = new Set(Ge.current), ht = new Map(
        I.map((Z) => [Z, Re.current.get(Z) ?? 0])
      ), ot = () => J === Ot.current && S.id === ae;
      At.current = !0, Nt(!0), Jt(
        Ge.current.size ? `${I.length} selected ${_}s` : `the focused ${_}`
      ), Be(""), pt("");
      const Mr = ke.items.filter(
        (Z) => !I.includes(Z.id)
      ), Un = Mr.map((Z) => Z.id), $r = Fr(
        me,
        Un,
        ve,
        I.includes(ve ?? -1)
      );
      $({
        items: Mr,
        totalCount: ke.totalCount
      }), we((Z) => {
        const ue = new Set(Z);
        for (const ge of I) ue.delete(ge);
        return ue;
      }), fe($r), Ie.current || pe($r);
      let Zt = !1;
      try {
        if ("effect" in o ? await Ci(o, I) : await Ei(o, I), Zt = !0, !ot()) return;
        we((Z) => {
          const ue = new Set(Z);
          for (const ge of I)
            (Re.current.get(ge) ?? 0) === ht.get(ge) && ue.delete(ge);
          return ue;
        }), Be(
          `${o.label}: ${I.length} ${_}${I.length === 1 ? "" : "s"} ${c ? "updated" : "skipped"}.`
        );
      } catch (Z) {
        if (!ot()) return;
        $(ke), we((ue) => {
          const ge = new Set(ue);
          for (const Pe of I)
            it.has(Pe) && (Re.current.get(Pe) ?? 0) === ht.get(Pe) && ge.add(Pe);
          return ge;
        }), fe(ve), Ie.current || pe(ve), pt(
          Z instanceof Error ? Z.message : "Action failed."
        );
      }
      try {
        if (await mi(o), !ot()) return;
        const Z = await ze(S, ee);
        if (!ot()) return;
        let ue = Z.items.map((ge) => ge.id);
        if (!ue.length && Z.totalCount > 0 && Number(ee.page) > 1) {
          const ge = Math.max(1, Number(ee.page) - 1), Pe = { ...ee, page: ge };
          Ke(Pe), ue = (await ze(S, Pe)).items.map((er) => er.id), we(
            (er) => new Set([...er].filter((jn) => ue.includes(jn)))
          );
          const xr = ue.at(-1) ?? null;
          fe(xr), Ie.current || pe(xr);
        } else {
          we(
            (Pe) => new Set([...Pe].filter((_r) => ue.includes(_r)))
          );
          const ge = Fr(
            me,
            ue,
            ve,
            Zt && I.includes(ve ?? -1)
          );
          fe(ge), Ie.current && ge == null && et(!1), Ie.current || pe(ge);
        }
      } catch (Z) {
        ot() && pt(
          (ue) => `${ue ? `${ue} ` : ""}${Zt ? "The action completed, but " : ""}the queue could not be refreshed. ${Z instanceof Error ? Z.message : "Refresh failed."}`
        );
      } finally {
        ot() && (At.current = !1, Nt(!1), Jt(""));
      }
    },
    [
      Ne,
      N,
      U,
      _,
      re,
      ze,
      ee,
      pe,
      Y,
      M,
      q,
      ie,
      S
    ]
  );
  function Pn() {
    var g;
    if (Ve === "list") return 1;
    const o = (g = Rr.current) == null ? void 0 : g.firstElementChild, c = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, c.split(" ").filter(Boolean).length);
  }
  function Mn(o) {
    if (o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || Ze) return;
    if (be && o.key === "Escape") {
      Ee(o), et(!1), pe(te.current);
      return;
    }
    if (!ct(o.target)) return;
    if (o.key === "Escape") {
      Ee(o), nt(() => /* @__PURE__ */ new Set());
      return;
    }
    const c = (S == null ? void 0 : S.actions.findIndex(
      (k, I) => Me(k, I) === o.key
    )) ?? -1;
    if (c >= 0 && (S != null && S.actions[c])) {
      Ee(o), !Q && !q && Yt(S.actions[c]);
      return;
    }
    if (!be && o.key === " ") {
      Ee(o), de != null && nt((k) => Lt(k, de));
      return;
    }
    if (!be && o.key.toLowerCase() === "a") {
      Ee(o), nt(
        (k) => ii(k, Y)
      );
      return;
    }
    if (Q || q || be) return;
    if (o.key === "Enter" && de != null) {
      Ee(o), _ === "tag" ? window.open(`/tag/${de}`, "_blank", "noopener,noreferrer") : et(!0);
      return;
    }
    const g = Pn(), b = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -g : o.key === "ArrowDown" ? g : 0;
    b && (Ee(o), Xt(b));
  }
  function $t(o) {
    qe(o), zr(o);
  }
  function $n() {
    $e.current = !0, De({}), $t("");
  }
  async function Or(o) {
    if (!s) return !1;
    const c = o.map(Ji);
    try {
      await di(s, c);
    } catch (b) {
      throw b;
    }
    r(c), oe && !c.some((b) => b.id === oe) && $t("");
    const g = c.find((b) => b.id === oe);
    return g && K && JSON.stringify(g) !== JSON.stringify(K) && (g.view.displayMode !== K.view.displayMode && Bt(Br(g)), g.entityType !== "performerOccurrence" && Le(g) !== Le(K) && (xe(null), _t(
      g,
      Se({ ...g.view.filter, page: ee.page })
    ))), !0;
  }
  if (l)
    return /* @__PURE__ */ n(Wr, { label: "Loading reviews…" });
  if (u)
    return /* @__PURE__ */ d(Te, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void ro().catch(
            (o) => f(
              "Could not export browser reviews. " + (o instanceof Error ? o.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        Qr,
        {
          message: u,
          onRetry: () => void kr()
        }
      )
    ] });
  return /* @__PURE__ */ d("div", { className: "data-quality-page", onKeyDown: Mn, children: [
    /* @__PURE__ */ d("header", { className: "data-quality-header", children: [
      S && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: Q,
          onClick: $n,
          children: /* @__PURE__ */ n(tn, {})
        }
      ),
      /* @__PURE__ */ d("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (S == null ? void 0 : S.name) ?? "Data Quality" }),
        (S == null ? void 0 : S.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: S.description })
      ] }),
      S && K && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: Q || q || !X,
          onClick: () => {
            Et(!0), _e(!0);
          },
          children: /* @__PURE__ */ n(rn, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: Q || q || !X,
          onClick: () => {
            Et(!1), _e(!0);
          },
          children: /* @__PURE__ */ n(Qn, {})
        }
      )
    ] }),
    v && /* @__PURE__ */ n("p", { className: "dq-status", children: v }),
    G && (re == null ? void 0 : re.kind) === "missing" && /* @__PURE__ */ d("div", { role: "status", className: "dq-status", children: [
      re.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: It,
          onClick: () => {
            kt(!0), Rt(""), bi().then(Mt).catch(
              (o) => Rt(
                "Could not create the Confirmed absent tags custom field. " + (o instanceof Error ? o.message : "Request failed.")
              )
            ).finally(() => kt(!1));
          },
          children: It ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    G && ((re == null ? void 0 : re.kind) === "incompatible" || Er) && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(or, {}),
      Er || (re == null ? void 0 : re.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: It,
          onClick: () => {
            kt(!0), Mt().finally(
              () => kt(!1)
            );
          },
          children: It ? "Checking…" : "Check again"
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
            const o = localStorage.getItem("page-videos") ?? "[]", c = URL.createObjectURL(
              new Blob([o], { type: "application/json" })
            ), g = document.createElement("a");
            g.href = c, g.download = "data-quality-unassigned-legacy-reviews.json", g.click(), URL.revokeObjectURL(c);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    D && /* @__PURE__ */ d("p", { role: "alert", children: [
      D,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            j(""), W(!1);
          },
          children: ce ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    S && K && S.entityType !== "performerOccurrence" && /* @__PURE__ */ d("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${Q || q ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": Q || q || void 0,
          inert: Q || q ? !0 : void 0,
          onClickCapture: (o) => {
            var g, b, k, I, J;
            const c = o.target instanceof Element ? o.target.closest("button") : null;
            (c == null ? void 0 : c.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((g = c == null ? void 0 : c.textContent) == null ? void 0 : g.trim()) === "Clear all" ? Je.current = !0 : ((b = c == null ? void 0 : c.getAttribute("aria-label")) != null && b.startsWith("Filters") || (k = c == null ? void 0 : c.getAttribute("aria-label")) != null && k.startsWith("Edit filter:") || ((I = c == null ? void 0 : c.textContent) == null ? void 0 : I.trim()) === "Cancel" || (J = c == null ? void 0 : c.getAttribute("aria-label")) != null && J.startsWith("Close ")) && (Je.current = !1);
          },
          onKeyDownCapture: (o) => {
            var g, b;
            const c = o.target instanceof Element ? o.target.closest("button") : null;
            (o.key === "Delete" || o.key === "Backspace") && (c == null ? void 0 : c.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (o.preventDefault(), o.stopPropagation(), Je.current = !0, (b = (g = c.parentElement) == null ? void 0 : g.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || b.click()) : o.key === "Escape" && (Je.current = !1);
          },
          children: /* @__PURE__ */ n(
            Vn,
            {
              filter: ie ? p : ee,
              onFilterChange: _n,
              totalCount: M.totalCount,
              sortOptions: _ === "tag" ? Yr : Zr,
              showSearch: !0,
              showSort: !0,
              displayMode: Ve,
              onDisplayModeChange: (o) => Bt(Jr(o, _)),
              availableDisplayModes: _ === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (Ct - 225) / 50,
              onZoomChange: (o) => vr(Math.round(225 + o * 50)),
              cardSizeEntityType: _ === "tag" ? "tags" : "videos",
              criteriaDefinitions: kn,
              objectFilter: Qt,
              onObjectFilterChange: (o) => {
                if (!Q && !q) {
                  const c = _ === "video" ? xi(o) : o;
                  Ue.current = _ === "video" ? Li(
                    S.view.objectFilter,
                    c,
                    Je.current
                  ) : c, Je.current = !1;
                }
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (se == null ? void 0 : se.id) === oe && /* @__PURE__ */ d("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: Q || q || !X,
            onClick: Ln,
            children: /* @__PURE__ */ n(Hn, {})
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Reset to default review filters",
            title: "Reset to default review filters",
            disabled: Q || q,
            onClick: xn,
            children: /* @__PURE__ */ n(Xn, {})
          }
        )
      ] })
    ] }),
    S ? S.entityType === "performerOccurrence" ? /* @__PURE__ */ n(Ri, { review: S, storageKey: s, canWrite: m, onBusy: Nt }, S.id) : /* @__PURE__ */ d(Te, { children: [
      _ === "video" && je.error && /* @__PURE__ */ n("p", { role: "alert", children: je.error }),
      G && /* @__PURE__ */ n(
        qi,
        {
          videos: M.items,
          review: G,
          trees: je.ids,
          disabled: Q || q,
          onChoose: (o) => {
            const c = Oi(G, o);
            xe(c), _t(c, { ...ee, page: 1 });
          }
        }
      ),
      zt && !be && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(or, {}),
        zt
      ] }),
      Tt && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: Tt }),
      Pr("top"),
      /* @__PURE__ */ d(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${tt}px`
          },
          children: [
            /* @__PURE__ */ d("main", { children: [
              q && !M.items.length && /* @__PURE__ */ n(Wr, { label: "Loading review queue…" }),
              ie && !q && /* @__PURE__ */ n(
                Qr,
                {
                  message: ie,
                  onRetry: () => void ze(
                    S,
                    ee,
                    he
                  ).catch(() => {
                  })
                }
              ),
              !Q && !q && !ie && !M.items.length && /* @__PURE__ */ d("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(sr, {}),
                /* @__PURE__ */ d("p", { children: [
                  "No ",
                  _,
                  "s match this review."
                ] })
              ] }),
              !!M.items.length && /* @__PURE__ */ n("div", { ref: Rr, children: /* @__PURE__ */ n(
                "div",
                {
                  className: Ve === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${Ct}px`
                  },
                  children: M.items.map(Fn)
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
                "aria-valuemin": fr,
                "aria-valuemax": pr,
                "aria-valuenow": tt,
                "aria-valuetext": `${tt} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (o) => {
                  qt.current = {
                    pointerId: o.pointerId,
                    startX: o.clientX,
                    startWidth: tt
                  }, o.currentTarget.setPointerCapture(o.pointerId);
                },
                onPointerMove: (o) => {
                  const c = qt.current;
                  (c == null ? void 0 : c.pointerId) === o.pointerId && o.currentTarget.hasPointerCapture(o.pointerId) && Wt(
                    c.startWidth + c.startX - o.clientX
                  );
                },
                onPointerUp: () => {
                  qt.current = null;
                },
                onPointerCancel: () => {
                  qt.current = null;
                },
                onKeyDown: In,
                onDoubleClick: () => Wt(br),
                children: /* @__PURE__ */ n("span", {})
              }
            ),
            /* @__PURE__ */ d("aside", { className: "dq-actions", children: [
              le.size > 0 && /* @__PURE__ */ n("strong", { children: qr }),
              S.actions.map((o, c) => {
                const g = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", b = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, k = b != null ? U.find((J) => J.id === b) : void 0, I = b != null && !k;
                return /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    disabled: Q || q || !!ie || g && !Ne || "effect" in o && g && (!N || I) || Ft(o) && (re == null ? void 0 : re.kind) !== "ready" || !On.length,
                    onClick: () => void Yt(o),
                    children: [
                      /* @__PURE__ */ d("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: o.label }),
                        "effect" in o ? /* @__PURE__ */ n("small", { children: o.effect.mode === "SKIP" ? "Skip" : o.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : k ? `Assign ${k.name}` : "Unavailable tag group" }) : o.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: o.steps.flatMap(
                          (J, ae) => J.tagIds.map((me, ke) => {
                            const ve = Ar[me] === void 0 ? "Tag" : Ar[me] ?? "Unavailable tag", it = Nn(J, ve), ht = Gi(J, ve);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": Cn(J.mode),
                                "aria-label": ht,
                                title: `Step ${ae + 1}: ${ht}`,
                                children: it
                              },
                              `${ae}-${me}-${ke}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      Me(o, c) && /* @__PURE__ */ n("kbd", { children: Me(o, c) })
                    ]
                  },
                  o.id
                );
              }),
              !S.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              !Ne && /* @__PURE__ */ d("p", { children: [
                _ === "tag" ? "Tag" : "Video",
                " write permission is required to apply actions."
              ] }),
              _ === "tag" && O && /* @__PURE__ */ d("p", { children: [
                "Tag groups are unavailable. ",
                O
              ] }),
              Q && /* @__PURE__ */ d("p", { role: "status", children: [
                /* @__PURE__ */ n(on, { className: "dq-spin" }),
                " Applying action to",
                " ",
                Rn,
                "…"
              ] }),
              /* @__PURE__ */ d("p", { className: "dq-shortcuts", children: [
                "←→↑↓ move · space select · enter ",
                _ === "tag" ? "open" : "preview",
                " · 1–9 apply · A toggle shown · Esc clear"
              ] })
            ] })
          ]
        }
      ),
      Pr("bottom")
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
                  ref: Ye,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ n("p", { children: "Choose a review to open its queue." }),
              /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                (o) => Oe[o.id] !== void 0
              ) ? t.some((o) => Oe[o.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ d("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ d("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ d(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: Xe,
                    onChange: (o) => St(
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
                  "aria-label": Fe === "asc" ? "Ascending" : "Descending",
                  title: Fe === "asc" ? "Ascending" : "Descending",
                  onClick: () => Gt(
                    (o) => o === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    nn,
                    {
                      className: Fe === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: Vt.map((o) => {
            const c = Oe[o.id], g = Ce(o), b = g === "tag" ? "tag" : g === "performerOccurrence" ? "scene" : "video";
            return /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                disabled: Q,
                onClick: () => $t(o.id),
                children: [
                  /* @__PURE__ */ d("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ d("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(wn, { entityType: g }),
                      /* @__PURE__ */ n("strong", { children: o.name })
                    ] }),
                    /* @__PURE__ */ n(
                      "span",
                      {
                        className: "dq-review-count",
                        "aria-label": c === void 0 ? `Counting matching ${b}s` : c === null ? `Matching ${b} count unavailable` : `${c.toLocaleString()} matching ${c === 1 ? b : `${b}s`}`,
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
    ) : /* @__PURE__ */ d("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(sr, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    be && We && G && /* @__PURE__ */ n(
      Hi,
      {
        video: We,
        review: G,
        targetLabel: qr,
        pending: Q,
        refreshing: q || !!ie,
        error: zt,
        canWrite: w,
        assessmentReady: (re == null ? void 0 : re.kind) === "ready",
        selected: le.has(We.id),
        hasPrevious: Y.indexOf(We.id) > 0,
        hasNext: Y.indexOf(We.id) >= 0 && Y.indexOf(We.id) < Y.length - 1,
        onToggleSelected: () => nt((o) => Lt(o, We.id)),
        onPrevious: () => Xt(-1),
        onNext: () => Xt(1),
        onClose: () => {
          et(!1), pe(te.current);
        },
        onAction: Yt
      }
    ),
    Ze && /* @__PURE__ */ n(
      Xi,
      {
        reviews: t,
        activeReview: K,
        tagGroups: U,
        initialEdit: L,
        onSave: Or,
        onChoose: $t,
        onClose: () => {
          _e(!1), L && pe(te.current, !1);
        }
      }
    )
  ] });
  async function _t(o, c, g = !1) {
    const b = te.current, k = Math.max(0, Y.indexOf(b ?? -1));
    try {
      const J = (await ze(o, c, g)).items.map((me) => me.id);
      we(
        (me) => new Set([...me].filter((ke) => J.includes(ke)))
      );
      const ae = Lr(J, b, k);
      fe(ae), Ie.current || pe(ae, !1);
    } catch {
    }
  }
  function _n(o) {
    const c = Ue.current;
    if (Ue.current = null, Q || q || !S || !K) return;
    const g = c ?? S.view.objectFilter, b = ur(
      g,
      K.view.objectFilter
    ) ? K.view.objectFilter : g, k = Se({ ...o, page: 1 }), I = {
      ...S,
      view: {
        ...S.view,
        filter: k,
        objectFilter: b
      }
    }, J = Le(I) !== Le(K), ae = J ? I : K;
    xe(J ? I : null), Be(J ? "" : "Review queue defaults restored."), _t(ae, k, !0);
  }
  function xn() {
    if (Q || q || !K) return;
    Ue.current = null;
    const o = Se({
      ...K.view.filter,
      page: 1
    });
    xe(null), Be("Review queue defaults restored."), _t(
      K,
      o,
      K.view.startFrom !== "beginning"
    );
  }
  function Ln() {
    Q || q || !S || !K || !X || Or(
      t.map(
        (o) => o.id === oe ? {
          ...o,
          view: {
            ...S.view,
            filter: { ...ee, page: 1 }
          }
        } : o
      )
    ).then(() => {
      xe(null), Be("Queue saved to this review.");
    }).catch(
      (o) => pt(
        o instanceof Error ? o.message : "Could not save queue."
      )
    );
  }
  function Dn() {
    we(/* @__PURE__ */ new Set()), Re.current.clear(), fe(null);
  }
  function Pr(o) {
    return S ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: Q || q,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          Bn,
          {
            filter: {
              ...ee,
              page: Number(ee.page) || 1,
              perPage: Number(ee.perPage) || 40
            },
            totalCount: M.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${o}`,
            onFilterChange: (c) => {
              Q || q || c.page === Number(ee.page) || Bi(
                { ...ee, page: c.page },
                S,
                ze,
                Dn
              );
            }
          }
        )
      }
    ) : null;
  }
  function Fn(o) {
    if (_ === "tag") {
      const g = o;
      return /* @__PURE__ */ n(
        zi,
        {
          tag: g,
          displayMode: Ve === "list" ? "list" : "grid",
          focused: g.id === de,
          selected: le.has(g.id),
          setRef: (b) => {
            b ? gt.current.set(g.id, b) : gt.current.delete(g.id);
          },
          onFocus: () => fe(g.id),
          onToggle: () => nt((b) => Lt(b, g.id)),
          onOpen: () => window.open(`/tag/${g.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        g.id
      );
    }
    const c = o;
    return /* @__PURE__ */ n(
      Wi,
      {
        video: ki(c, G, je.ids),
        displayMode: Ve,
        focused: c.id === de,
        selected: le.has(c.id),
        setRef: (g) => {
          g ? gt.current.set(c.id, g) : gt.current.delete(c.id);
        },
        onFocus: () => fe(c.id),
        onToggle: () => nt((g) => Lt(g, c.id)),
        onPreview: () => {
          fe(c.id), et(!0);
        },
        onNavigate: e
      },
      c.id
    );
  }
}
function Bi(e, t, r, i) {
  i(), r(t, e).catch(() => {
  });
}
function Lt(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Ji(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function zi({
  tag: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: s,
  onFocus: a,
  onToggle: l,
  onOpen: h,
  onNavigate: u
}) {
  return /* @__PURE__ */ n(
    "article",
    {
      ref: s,
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${e.name}${i ? ", selected" : ""}`,
      onFocus: a,
      onClick: (f) => {
        a(), f.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        Jn,
        {
          tag: e,
          selected: i,
          onSelect: l,
          onClick: h,
          onNavigate: u
        }
      ) : /* @__PURE__ */ d("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "aria-label": i ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": i,
            onClick: (f) => {
              f.stopPropagation(), l();
            },
            children: i ? "✓" : ""
          }
        ),
        /* @__PURE__ */ n("button", { type: "button", className: "dq-tag-list-name", onClick: h, children: e.name }),
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
function Wi({
  video: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: s,
  onFocus: a,
  onToggle: l,
  onPreview: h,
  onNavigate: u
}) {
  const f = vn(e), w = B(null), y = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, m = !!(y.date || y.studioName), E = !!(y.performers.length || y.tags.length);
  return Hr(() => {
    const N = w.current;
    if (!N) return;
    const P = N.querySelector(
      `a[href="/video/${e.id}"]`
    ), U = N.querySelector(".card-title"), x = `dq-card-title-${e.id}`;
    U && (U.id = x), P && (P.target = "_blank", P.rel = "noreferrer", P.removeAttribute("aria-label"), P.setAttribute("aria-labelledby", x), P.classList.add("dq-card-link"));
    const O = N.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    O && O.setAttribute(
      "aria-label",
      i ? `Deselect ${f}` : `Select ${f}`
    );
    const z = N.querySelector(
      'button[title="Quick View"]'
    );
    z && z.setAttribute("aria-label", `Preview ${f}`);
  }), /* @__PURE__ */ d(
    "article",
    {
      ref: (N) => {
        w.current = N, s(N);
      },
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${f}${i ? ", selected" : ""}`,
      onFocus: a,
      onClick: (N) => {
        a(), N.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${t} ${m ? "has-card-metadata" : "no-card-metadata"} ${E ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          zn,
          {
            video: y,
            selected: i,
            onSelect: l,
            onNavigate: u,
            onQuickView: h,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t === "wall" && /* @__PURE__ */ n(Qi, { video: e })
      ]
    }
  );
}
function Qi({ video: e }) {
  const t = B(null), r = B(null), [i, s] = C(!1), [a, l] = C(!1), [h, u] = C(!1);
  return ne(() => {
    const f = t.current;
    if (!f || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      s(!0), l(!0);
      return;
    }
    const w = new IntersectionObserver(
      ([m]) => s(m.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), y = new IntersectionObserver(
      ([m]) => l(m.isIntersecting && m.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return w.observe(f), y.observe(f), () => {
      w.disconnect(), y.disconnect();
    };
  }, [e.id, e.files.length]), ne(() => {
    if (!i) {
      u(!1);
      return;
    }
    const f = new AbortController();
    return F(hi(e.id), {
      signal: f.signal
    }).then((w) => {
      f.signal.aborted || u(w.available === !0);
    }).catch(() => {
      f.signal.aborted || u(!1);
    }), () => f.abort();
  }, [i, e.id]), ne(() => {
    const f = r.current;
    f && (a ? Promise.resolve(f.play()).catch(() => {
    }) : f.pause());
  }, [h, a]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: h && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: gi(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Hi({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: s,
  error: a,
  canWrite: l,
  assessmentReady: h,
  selected: u,
  hasPrevious: f,
  hasNext: w,
  onToggleSelected: y,
  onPrevious: m,
  onNext: E,
  onClose: N,
  onAction: P
}) {
  const U = B(null), x = B(null), O = e.files[0], z = vn(e);
  ne(() => {
    var R;
    const v = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (R = U.current) == null || R.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = v;
    };
  }, []);
  function X(v) {
    var j, ce, W;
    if (v.key !== "Tab") return;
    const R = [
      ...((j = U.current) == null ? void 0 : j.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ye) => ye.offsetParent !== null);
    if (!R.length) {
      v.preventDefault(), (ce = U.current) == null || ce.focus();
      return;
    }
    const D = R.indexOf(
      document.activeElement
    );
    v.shiftKey && D <= 0 ? (v.preventDefault(), (W = R.at(-1)) == null || W.focus()) : !v.shiftKey && D === R.length - 1 && (v.preventDefault(), R[0].focus());
  }
  function A(v) {
    if (v.defaultPrevented || v.ctrlKey || v.metaKey || v.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const R = v.key === "ArrowLeft" || v.key === "ArrowRight";
    if (v.altKey && !R) return;
    const D = x.current, j = v.currentTarget.querySelector("video");
    if (v.key === "Enter" || v.key === "Escape")
      v.repeat || N();
    else if (v.key === " " && D)
      v.repeat || D.toggle();
    else if (R && D)
      D.seekBy(
        (v.key === "ArrowLeft" ? -1 : 1) * (v.shiftKey ? 5 : v.altKey ? 10 : 60)
      );
    else if ((v.key === "," || v.key === ".") && D) {
      const ce = [O == null ? void 0 : O.duration, j == null ? void 0 : j.duration].find(
        (ye) => ye != null && Number.isFinite(ye) && ye > 0
      ) ?? 0, W = e.parentVideoId != null ? (e.clipEndSec ?? ce) - (e.clipStartSec ?? 0) : ce;
      Number.isFinite(W) && W > 0 && D.seekBy((v.key === "," ? -1 : 1) * W * 0.1);
    } else if (v.key.toLowerCase() === "n" || v.key.toLowerCase() === "m")
      !v.repeat && !i && !s && (v.key.toLowerCase() === "n" && f && m(), v.key.toLowerCase() === "m" && w && E());
    else if (v.key === "ArrowUp" && j)
      j.volume = Math.min(1, j.volume + 0.1);
    else if (v.key === "ArrowDown" && j)
      j.volume = Math.max(0, j.volume - 0.1);
    else return;
    Ee(v);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: U,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${z}`,
      className: "dq-preview",
      onKeyDown: X,
      onKeyDownCapture: A,
      onMouseDown: (v) => {
        v.target === v.currentTarget && N();
      },
      children: /* @__PURE__ */ d("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ d("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !f || i || s,
              onClick: m,
              children: /* @__PURE__ */ n(tn, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !w || i || s,
              onClick: E,
              children: /* @__PURE__ */ n(nn, {})
            }
          ),
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ n("h2", { children: z }),
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
              onClick: y,
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
              "aria-label": `Open ${z} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ n(Zn, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: N,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(sn, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: O ? /* @__PURE__ */ n(
          Xr,
          {
            autostart: !0,
            streamUrl: mn(e.id),
            posterUrl: Kr(e),
            format: O.format,
            audioCodec: O.audioCodec,
            duration: O.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (v) => (x.current = v, () => {
              x.current === v && (x.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: Kr(e), alt: "" }) }),
        a && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: a }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((v, R) => /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            disabled: i || s || v.steps.length > 0 && !l || Ft(v) && !h,
            onClick: () => void P(v),
            children: [
              Me(v, R) && /* @__PURE__ */ n("kbd", { children: Me(v, R) }),
              v.label
            ]
          },
          v.id
        )) })
      ] })
    }
  );
}
function Xi({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: i = !1,
  onSave: s,
  onChoose: a,
  onClose: l
}) {
  const [h, u] = C(
    () => i && t ? structuredClone(t) : null
  ), [f, w] = C(""), [y, m] = C(!1), [E, N] = C(
    i && t != null
  ), P = B(null);
  ne(() => {
    var R, D;
    const A = document.activeElement, v = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (D = (R = P.current) == null ? void 0 : R.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || D.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = v, A == null || A.focus({ preventScroll: !0 });
    };
  }, []);
  function U(A) {
    var D, j, ce;
    if (A.defaultPrevented) {
      A.stopPropagation();
      return;
    }
    if (A.key === "Escape") {
      Ee(A), y || l();
      return;
    }
    if (A.key !== "Tab") {
      A.stopPropagation();
      return;
    }
    const v = [
      ...((D = P.current) == null ? void 0 : D.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((W) => W.offsetParent !== null);
    if (!v.length) {
      Ee(A), (j = P.current) == null || j.focus();
      return;
    }
    const R = v.indexOf(
      document.activeElement
    );
    A.shiftKey && R <= 0 ? (Ee(A), (ce = v.at(-1)) == null || ce.focus()) : !A.shiftKey && R === v.length - 1 ? (Ee(A), v[0].focus()) : A.stopPropagation();
  }
  function x(A, v = !!A) {
    N(v), u(
      A ? structuredClone(A) : {
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
    ), w("");
  }
  async function O() {
    if (y) return;
    if (!h || ar(h)) {
      w(h ? ar(h) : "Choose a review.");
      return;
    }
    const A = { ...h, name: h.name.trim() }, v = e.some((R) => R.id === A.id) ? e.map((R) => R.id === A.id ? A : R) : [...e, A];
    m(!0), w("");
    try {
      if (!await s(v)) throw new Error("Could not save reviews.");
      a(A.id), l();
    } catch (R) {
      w(
        "Could not save reviews. Your edits are still open. " + (R instanceof Error ? R.message : "Retry saving.")
      );
    } finally {
      m(!1);
    }
  }
  async function z(A) {
    if (!y) {
      m(!0), w("");
      try {
        if (!await s(A)) throw new Error("Could not save reviews.");
      } catch (v) {
        w(
          v instanceof Error ? v.message : "Could not save reviews."
        );
      } finally {
        m(!1);
      }
    }
  }
  async function X(A) {
    var R;
    if (y) return;
    const v = (R = A.target.files) == null ? void 0 : R[0];
    if (A.target.value = "", !!v) {
      if (v.size > 2e6) {
        w("Review files must be smaller than 2 MB.");
        return;
      }
      m(!0), w("");
      try {
        const D = bt(await v.text());
        if (!await s(cr(e, D)))
          throw new Error("Could not save reviews.");
      } catch (D) {
        w(
          D instanceof Error ? D.message : "Could not import reviews."
        );
      } finally {
        m(!1);
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
      children: /* @__PURE__ */ d("div", { className: "dq-manager", children: [
        /* @__PURE__ */ d("header", { children: [
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ n("h2", { children: h ? e.some((A) => A.id === h.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: y,
              onClick: l,
              children: /* @__PURE__ */ n(sn, {})
            }
          )
        ] }),
        f && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: f }),
        /* @__PURE__ */ n("fieldset", { disabled: y, className: "dq-manager-content", children: h ? /* @__PURE__ */ n(
          Yi,
          {
            draft: h,
            entityTypeLocked: E,
            tagGroups: r,
            saving: y,
            setDraft: u,
            onSave: () => void O(),
            onCancel: l
          }
        ) : /* @__PURE__ */ d(Te, { children: [
          /* @__PURE__ */ d("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ d(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => x(),
                children: [
                  /* @__PURE__ */ n(ei, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ d("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(ti, {}),
              " Import reviews",
              /* @__PURE__ */ n(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: X
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((A) => /* @__PURE__ */ d("article", { children: [
            /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ d("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(wn, { entityType: Ce(A) }),
                /* @__PURE__ */ n("strong", { children: A.name })
              ] }),
              /* @__PURE__ */ n("p", { children: A.description || "No description" })
            ] }),
            /* @__PURE__ */ d("button", { type: "button", onClick: () => x(A), children: [
              /* @__PURE__ */ n(rn, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => x({
                  ...structuredClone(A),
                  id: crypto.randomUUID(),
                  name: `${A.name} copy`
                }, !0),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${A.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${A.name}”?`) && z(
                    e.filter((v) => v.id !== A.id)
                  );
                },
                children: /* @__PURE__ */ n(an, {})
              }
            )
          ] }, A.id)) })
        ] }) })
      ] })
    }
  );
}
function Yi({
  draft: e,
  entityTypeLocked: t,
  tagGroups: r,
  saving: i = !1,
  setDraft: s,
  onSave: a,
  onCancel: l
}) {
  const [h, u] = C("Review"), f = Ce(e), w = (E) => {
    if (!(t || E === f)) {
      if (E === "performerOccurrence") {
        s({
          id: e.id,
          entityType: E,
          name: e.name,
          description: e.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "beginning" },
          actions: [],
          occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: !0 }
        });
        return;
      }
      s(
        E === "tag" ? {
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
  }, y = B(/* @__PURE__ */ new WeakMap()), m = (E) => {
    let N = y.current.get(E);
    return N || (N = crypto.randomUUID(), y.current.set(E, N)), N;
  };
  return /* @__PURE__ */ d("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      Wn,
      {
        tabs: (f === "performerOccurrence" ? ["Review", "Queue", "Actions", ...e.occurrence.tagIds.length ? ["Tag choices"] : []] : ["Review", "Queue", "Appearance", "Actions"]).map((E) => ({
          key: E,
          label: E,
          count: E === "Actions" ? e.actions.length : void 0,
          disabled: i
        })),
        activeTab: h,
        onTabChange: u
      }
    ) }),
    /* @__PURE__ */ d("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ d("section", { hidden: h !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ d("label", { children: [
          "Entity type",
          /* @__PURE__ */ d(
            "select",
            {
              "aria-label": "Entity type",
              value: f,
              disabled: t,
              onChange: (E) => w(E.target.value),
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
              value: e.name,
              onChange: (E) => s({ ...e, name: E.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          "Description",
          /* @__PURE__ */ n(
            "textarea",
            {
              "aria-label": "Description",
              value: e.description,
              onChange: (E) => s({ ...e, description: E.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ d("section", { hidden: h !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ n(Vr, { draft: e, onChange: s, presentation: !1 }),
        e.entityType === "performerOccurrence" && /* @__PURE__ */ n(Gr, { review: e, onChange: s })
      ] }),
      e.entityType === "performerOccurrence" && /* @__PURE__ */ n("section", { hidden: h !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n(Gr, { review: e, onChange: s, choices: !0 }) }),
      /* @__PURE__ */ n("section", { hidden: h !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(Vr, { draft: e, onChange: s, queue: !1 }) }),
      /* @__PURE__ */ n("section", { hidden: h !== "Actions", className: "dq-editor-section", children: f === "tag" ? /* @__PURE__ */ n(
        eo,
        {
          draft: e,
          saving: i,
          tagGroups: r,
          setDraft: s
        }
      ) : /* @__PURE__ */ n(
        Zi,
        {
          draft: e,
          saving: i,
          stepKey: m,
          rememberStepKey: (E, N) => y.current.set(E, m(N)),
          setDraft: s
        }
      ) })
    ] }),
    /* @__PURE__ */ d("div", { className: "dq-editor-footer", children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const E = URL.createObjectURL(
              new Blob([JSON.stringify([e], null, 2)], {
                type: "application/json"
              })
            ), N = document.createElement("a");
            N.href = E, N.download = "data-quality-review.json", N.click(), URL.revokeObjectURL(E);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: l, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: a, children: "Save review" })
    ] })
  ] });
}
function An({
  action: e,
  index: t,
  onChange: r
}) {
  return /* @__PURE__ */ d("div", { className: "dq-field-grid", children: [
    /* @__PURE__ */ d("label", { children: [
      "Shortcut",
      /* @__PURE__ */ d(
        "select",
        {
          value: e.shortcut ?? "auto",
          onChange: (i) => r({
            ...e,
            shortcut: i.target.value === "auto" ? void 0 : i.target.value
          }),
          children: [
            /* @__PURE__ */ d("option", { value: "auto", children: [
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
    /* @__PURE__ */ d("label", { children: [
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
function Zi({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: i,
  setDraft: s
}) {
  const a = (l, h) => s({
    ...e,
    actions: e.actions.map(
      (u, f) => f === l ? h : u
    )
  });
  return /* @__PURE__ */ d(Te, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    e.entityType === "performerOccurrence" && /* @__PURE__ */ n("p", { children: "Actions apply only to the active performer in this scene. Choose performers with the temporary filter while reviewing." }),
    /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      ir,
      {
        items: e.actions,
        getKey: (l) => l.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (l) => s({ ...e, actions: l }),
        renderItem: (l, { index: h, dragHandleProps: u, isOver: f }) => /* @__PURE__ */ d(
          "fieldset",
          {
            className: f ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ d("legend", { children: [
                "Action ",
                h + 1
              ] }),
              /* @__PURE__ */ d("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...u,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${h + 1}`,
                    children: /* @__PURE__ */ n(gr, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: l.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => s({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, h + 1),
                        {
                          ...structuredClone(l),
                          id: crypto.randomUUID(),
                          label: l.label + " copy",
                          shortcut: ""
                        },
                        ...e.actions.slice(h + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                An,
                {
                  action: l,
                  index: h,
                  onChange: (w) => a(h, w)
                }
              ),
              /* @__PURE__ */ n(
                ir,
                {
                  items: l.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (w) => a(h, { ...l, steps: w }),
                  renderItem: (w, y) => /* @__PURE__ */ n(
                    to,
                    {
                      occurrence: e.entityType === "performerOccurrence",
                      dragHandleProps: y.dragHandleProps,
                      saving: t,
                      isOver: y.isOver,
                      step: w,
                      index: y.index,
                      onChange: (m) => {
                        i(m, w), a(h, {
                          ...l,
                          steps: l.steps.map(
                            (E, N) => N === y.index ? m : E
                          )
                        });
                      },
                      onRemove: () => a(h, {
                        ...l,
                        steps: l.steps.filter(
                          (m, E) => E !== y.index
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
                    onClick: () => a(h, {
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
                    onClick: () => s({
                      ...e,
                      actions: e.actions.filter(
                        (w, y) => y !== h
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
function eo({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: i
}) {
  const s = (a, l) => i({
    ...e,
    actions: e.actions.map(
      (h, u) => u === a ? l : h
    )
  });
  return /* @__PURE__ */ d(Te, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      ir,
      {
        items: e.actions,
        getKey: (a) => a.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (a) => i({ ...e, actions: a }),
        renderItem: (a, { index: l, dragHandleProps: h, isOver: u }) => /* @__PURE__ */ d(
          "fieldset",
          {
            className: u ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ d("legend", { children: [
                "Action ",
                l + 1
              ] }),
              /* @__PURE__ */ d("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...h,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${l + 1}`,
                    children: /* @__PURE__ */ n(gr, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: a.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => i({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, l + 1),
                        {
                          ...structuredClone(a),
                          id: crypto.randomUUID(),
                          label: a.label + " copy",
                          shortcut: ""
                        },
                        ...e.actions.slice(l + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                An,
                {
                  action: a,
                  index: l,
                  onChange: (f) => s(l, f)
                }
              ),
              /* @__PURE__ */ d("label", { children: [
                "Action effect",
                /* @__PURE__ */ d(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: a.effect.mode === "SET_TAG_GROUP" ? `group:${a.effect.tagGroupId}` : a.effect.mode,
                    onChange: (f) => {
                      const w = f.target.value;
                      s(l, {
                        ...a,
                        effect: w === "SKIP" ? { mode: "SKIP" } : w === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : {
                          mode: "SET_TAG_GROUP",
                          tagGroupId: Number(w.slice(6))
                        }
                      });
                    },
                    children: [
                      /* @__PURE__ */ n("option", { value: "SKIP", children: "Skip" }),
                      /* @__PURE__ */ n("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
                      a.effect.mode === "SET_TAG_GROUP" && !r.some(
                        (f) => f.id === a.effect.tagGroupId
                      ) && /* @__PURE__ */ n(
                        "option",
                        {
                          value: `group:${a.effect.tagGroupId}`,
                          disabled: !0,
                          children: "Unavailable tag group"
                        }
                      ),
                      r.map((f) => /* @__PURE__ */ n("option", { value: `group:${f.id}`, children: f.name }, f.id))
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
                      (f, w) => w !== l
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
function to({
  occurrence: e = !1,
  step: t,
  index: r,
  dragHandleProps: i,
  saving: s,
  isOver: a,
  onChange: l,
  onRemove: h
}) {
  const u = Cn(t.mode);
  return /* @__PURE__ */ d(
    "div",
    {
      className: a ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": u,
      children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            ...i,
            disabled: s,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${r + 1}`,
            children: /* @__PURE__ */ n(gr, {})
          }
        ),
        /* @__PURE__ */ d("span", { children: [
          "Step ",
          r + 1
        ] }),
        /* @__PURE__ */ d(
          "select",
          {
            "aria-label": "Tag operation",
            value: t.mode,
            onChange: (f) => l({ ...t, mode: f.target.value }),
            children: [
              /* @__PURE__ */ n("option", { value: "ADD", children: "Add tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE", children: "Remove tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE_TREE", children: "Remove tags and descendants" }),
              !e && /* @__PURE__ */ d(Te, { children: [
                /* @__PURE__ */ n("option", { value: "MARK_PRESENT", children: "Mark present" }),
                /* @__PURE__ */ n("option", { value: "MARK_ABSENT", children: "Mark absent" }),
                /* @__PURE__ */ n("option", { value: "CLEAR_ABSENCE", children: "Clear absence" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ n("div", { className: "dq-step-tags", children: /* @__PURE__ */ n(
          dt,
          {
            entityType: "tag",
            values: t.tagIds,
            onChange: (f) => l({ ...t, tagIds: f }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: h, children: /* @__PURE__ */ n(an, {}) })
      ]
    }
  );
}
async function ro() {
  const e = await F("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const l = JSON.parse(r);
      Array.isArray(l.reviews) && (i = JSON.stringify(l.reviews, null, 2));
    } catch {
    }
  const s = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), a = document.createElement("a");
  a.href = s, a.download = "data-quality-browser-recovery.json", a.click(), URL.revokeObjectURL(s);
}
function Wr({ label: e }) {
  return /* @__PURE__ */ d("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(on, { className: "dq-spin" }),
    e
  ] });
}
function Qr({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ d("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(or, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const co = { components: { DataQualityPage: Vi } };
export {
  Vi as DataQualityPage,
  co as default,
  ur as objectFiltersEqual
};
