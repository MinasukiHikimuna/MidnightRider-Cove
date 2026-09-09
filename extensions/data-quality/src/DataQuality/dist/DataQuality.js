import { jsxs as d, jsx as n, Fragment as Ee } from "react/jsx-runtime";
import { useState as E, useRef as D, useEffect as re, useMemo as ft, useCallback as We, useLayoutEffect as Qr } from "react";
import { VideoPlayer as Hr, EntityReferenceMultiSelector as nt, FilterDialog as Xr, PERFORMER_CRITERIA as Kn, TAG_SORT_OPTIONS as Yr, VIDEO_SORT_OPTIONS as Zr, TAG_CRITERIA as en, VIDEO_CRITERIA as er, DetailListToolbar as Gn, DetailListPagination as Vn, TagTile as Bn, VideoCard as Jn, EntityDetailTabs as zn, SortableList as tr } from "@cove/runtime/components";
import { ChevronLeft as tn, Pencil as rn, Settings as Wn, AlertTriangle as rr, Save as Qn, RotateCcw as Hn, ChevronRight as nn, Film as nr, Loader2 as on, Tags as Xn, ExternalLink as Yn, X as sn, Plus as Zn, Upload as ei, Trash2 as an, GripVertical as ur } from "@cove/runtime/lucide-react";
import { extensionFetch as ti } from "@cove/runtime/api";
function xr(e) {
  return JSON.stringify([[...e.occurrence.tagIds].sort((t, r) => t - r), e.occurrence.multiple]);
}
function ve(e) {
  return e.entityType ?? "video";
}
function ht(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function ir(e) {
  if (e.entityType === "performerOccurrence") {
    if (!cn(e.occurrence))
      return "Choose target performers, occurrence conditions, and at least one tag choice.";
    if (e.actions.length)
      return "Performer occurrence reviews use tag choices instead of video actions.";
  }
  if (ve(e) === "video" && e.actions.some(
    (r) => ln(r)
  ))
    return "An action cannot contain contradictory assessments for the same tag.";
  if (!e.name.trim() || !e.actions.every((r) => mt(r, ve(e))))
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
function _r(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function De(e) {
  const { page: t, ...r } = e.view.filter, i = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    e.entityType === "performerOccurrence" ? ["performerOccurrence", ...i, e.occurrence] : ve(e) === "tag" ? ["tag", ...i] : i
  );
}
function mt(e, t) {
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
  ) && !ln(e) : !1;
}
function Ut(e) {
  return "steps" in e ? e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  ) : !1;
}
function ln(e) {
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
function yt(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || r.entityType === "video" || r.entityType === "tag" || r.entityType === "performerOccurrence") && (r.entityType !== "performerOccurrence" || cn(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && ri(r.presentation, r.entityType === "tag") && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (r.entityType === "tag" ? "effect" in i && !("steps" in i) && mt(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (s) => s && Array.isArray(s.tagIds)
      ) && mt(i, "video"))
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
function ri(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const r = e;
  return (r.cardSize === void 0 || r.cardSize === null || Number.isFinite(r.cardSize) && r.cardSize >= 115 && r.cardSize <= 380) && (!t || r.annotations === void 0 && r.annotationParents === void 0 && r.binParents === void 0) && (r.annotations === void 0 || Array.isArray(r.annotations) && r.annotations.every(
    (i) => ["date", "studio", "performers", "tags"].includes(i)
  )) && [r.annotationParents, r.binParents].every(
    (i) => i === void 0 || Array.isArray(i) && i.every((s) => Number.isSafeInteger(s) && s > 0)
  );
}
function or(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const s of i)
      r.has(s.id) || (r.add(s.id), t.push(s));
  return t;
}
function cn(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (i) => Array.isArray(i) && i.every((s) => Number.isSafeInteger(s) && s > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && (t.targetMode !== "selected" || t.performerIds.length > 0) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && ["any", "includes", "includesAll", "excludes", "isNull"].includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && r(t.tagIds) && t.tagIds.length > 0 && typeof t.multiple == "boolean";
}
function Lr(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function Fr(e, t, r, i) {
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
function ni(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((s) => r.has(s));
  for (const s of t)
    i ? r.delete(s) : r.add(s);
  return r;
}
function ii(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const dn = "ext:com.midnightrider.data-quality:configuration", oi = "ext:cove-data-quality:video-reviews", sr = "ext:com.midnightrider.data-quality:progress", bt = /* @__PURE__ */ new Map(), Lt = /* @__PURE__ */ new Map(), tt = (e, t) => e.includes("*") || e.includes(t), jt = (e) => x(`/api/savedfilters?mode=${encodeURIComponent(e)}`), si = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function ar(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function rt(e) {
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
    reviews: yt(JSON.stringify(t.reviews)),
    deletedIds: ar(t.deletedIds),
    importedIds: ar(t.importedIds)
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
    const c = localStorage.getItem(s);
    if (c !== null) {
      const a = yt(c);
      r ?? (r = a), a.forEach((u) => i.add(u.id));
    }
    ar(
      JSON.parse(localStorage.getItem(`${s}:account-imports`) ?? "[]")
    ).forEach((a) => i.add(a));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function un(e) {
  const t = await x("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function fn(e, t) {
  const r = (Lt.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Lt.set(e, r), r.finally(() => {
    Lt.get(e) === r && Lt.delete(e);
  }).catch(() => {
  }), r;
}
let pt = null;
function li() {
  if (pt) return pt;
  const e = ci();
  return pt = e, e.finally(() => {
    pt === e && (pt = null);
  }).catch(() => {
  }), e;
}
async function ci() {
  var g;
  const e = await x("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = tt(e.permissions, "savedfilters.read"), s = i && tt(e.permissions, "savedfilters.write"), c = i ? (await jt(dn)).filter((S) => S.name === "Data Quality configuration").sort((S, C) => S.id - C.id) : [];
  if (c.length > 1) {
    const S = (C) => {
      const { revision: q, ...F } = rt(C.uiOptions);
      return JSON.stringify(F);
    };
    if (c.some((C) => S(C) !== S(c[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (s)
      for (const C of c.slice(1))
        await x(`/api/savedfilters/${C.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${C.id}` })
        });
    c.splice(1);
  }
  let a = c.length ? rt(c[0].uiOptions) : si();
  const u = localStorage.getItem(`${r}:migrated`) === "true", y = localStorage.getItem(r), p = localStorage.getItem(`${r}:local-only`) === "true";
  !c.length && y && (a = rt(y));
  let b = !c.length;
  if (c.length && p && y) {
    const S = rt(y);
    if (S.reviews.some((q) => {
      const F = a.reviews.find((B) => B.id === q.id);
      return F && JSON.stringify(F) !== JSON.stringify(q);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const C = [
      .../* @__PURE__ */ new Set([...a.deletedIds, ...S.deletedIds])
    ];
    a = {
      ...a,
      reviews: or(a.reviews, S.reviews).filter(
        (q) => !C.includes(q.id)
      ),
      deletedIds: C,
      importedIds: [
        .../* @__PURE__ */ new Set([...a.importedIds, ...S.importedIds])
      ]
    }, b = !0;
  }
  if (!u) {
    const S = JSON.stringify(a), C = ai(t);
    if (c.length && C.reviews.some((T) => {
      const Q = a.reviews.find((J) => J.id === T.id);
      return Q && JSON.stringify(Q) !== JSON.stringify(T);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const q = i ? (await jt(oi)).flatMap(
      (T) => yt(T.uiOptions ?? "[]")
    ) : [], F = C.known.filter(
      (T) => !C.reviews.some((Q) => Q.id === T)
    ), B = /* @__PURE__ */ new Set([...a.deletedIds, ...F]);
    a = {
      ...a,
      reviews: or(
        C.reviews,
        a.reviews,
        q.filter(
          (T) => !C.known.includes(T.id) && !a.importedIds.includes(T.id)
        )
      ).filter((T) => !B.has(T.id)),
      deletedIds: [...B],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...a.importedIds,
          ...C.known,
          ...q.map((T) => T.id)
        ])
      ]
    }, b || (b = JSON.stringify(a) !== S);
  }
  const w = {
    userId: t,
    recordId: (g = c[0]) == null ? void 0 : g.id,
    config: a,
    readable: i,
    writable: s,
    durable: s
  };
  if (bt.set(r, w), b && s) {
    const S = a;
    c.length && (w.config = rt(c[0].uiOptions)), await pn(r, S), a = w.config;
  } else c.length || (localStorage.setItem(r, JSON.stringify(a)), !i && (!u || p) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (s)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: a.reviews,
    storageKey: r,
    canWrite: tt(e.permissions, "videos.write"),
    canWriteVideos: tt(e.permissions, "videos.write"),
    canWriteTags: tt(e.permissions, "tags.write"),
    canReadTagGroups: tt(e.permissions, "taggroups.read"),
    canConfigure: !i || s,
    storageNotice: i ? s ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function pn(e, t) {
  const r = bt.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await un(r), r.recordId != null) {
      const c = await x(
        `/api/savedfilters/${r.recordId}`
      );
      if (rt(c.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const s = await x(
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
  return yt(JSON.stringify(t)), fn(e, async () => {
    const r = bt.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((s) => !t.some((c) => c.id === s.id)).map((s) => s.id);
    await pn(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((s) => !t.some((c) => c.id === s))
    });
  });
}
function Dr(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([r, i]) => /^[1-9]\d*:[1-9]\d*$/.test(r) && ["reviewed", "cannotDetermine"].includes(String(i)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function gn(e, t) {
  const r = bt.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), s = i ? Dr(i) : null;
  if (!r.readable) return s;
  const c = (await jt(sr)).find(
    (u) => u.name === t
  ), a = c ? Dr(c.uiOptions) : null;
  return s && (!a || s.updatedAt > a.updatedAt) ? s : a;
}
function hn(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return fn(i, async () => {
    const s = bt.get(e);
    if (!(s != null && s.writable)) return;
    await un(s);
    const c = (await jt(sr)).find(
      (a) => a.name === t
    );
    await x(
      c ? `/api/savedfilters/${c.id}` : "/api/savedfilters",
      {
        method: c ? "PUT" : "POST",
        body: JSON.stringify({
          mode: sr,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const wt = "confirmed_absent_tags", fr = "Confirmed absent tags", ui = {
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
function it(e) {
  return Array.isArray(e) ? e.map(it) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? ui[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === wt.toLowerCase() ? r.toLowerCase() : it(r)
    ])
  ) : e;
}
async function x(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await ti(e, { ...t, headers: r });
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
async function Dt(e, t, r) {
  const i = { ...e.view.objectFilter }, s = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return x("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      it({
        findFilter: be(t),
        objectFilter: i,
        filterExpression: s
      })
    )
  });
}
async function Ur(e, t, r) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, x("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      it({
        findFilter: be(t),
        objectFilter: i
      })
    )
  });
}
function fi(e) {
  return x("/api/taggroups", { signal: e });
}
function pi(e) {
  return `/api/videos/${e.id}/image?max=1280&v=${encodeURIComponent(e.updatedAt)}`;
}
function mn(e) {
  return `/api/stream/video/${e}`;
}
function jr(e) {
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
async function pr(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await x(`/api/tags/${r}`), t.add(r);
    for (let i = 1; ; i++) {
      const s = await x("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          it({
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
function yi(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${wt} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function gr() {
  const t = (await x("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === wt.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${fr} custom field before applying tag assessments.`
    };
  const r = yi(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function bi() {
  const e = await gr();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await x("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: wt,
        label: fr,
        type: "tag",
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function Kt(e) {
  return [...new Set(e)];
}
function wi(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${wt} value is not a valid tag list.`
    );
  return Kt(e);
}
function vi(e) {
  return Kt(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function Si(e, t) {
  let r;
  try {
    r = await gr();
  } catch (p) {
    throw new Error(
      `Could not verify the ${fr} custom field. ${p instanceof Error ? p.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const i = await Promise.all(
    e.steps.map(async (p) => ({
      ...p,
      tagIds: p.mode === "REMOVE_TREE" ? await pr(p.tagIds) : Kt(p.tagIds)
    }))
  ), s = i.filter(
    (p) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(p.mode)
  ), c = i.filter(
    (p) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(p.mode)
  ), a = Kt(t), u = r.definition.key;
  let y = 0;
  for (const p of a)
    try {
      const b = await x(`/api/videos/${p}`), w = vi(b), g = { ...b.customFields ?? {} }, S = g[u], C = wi(S), q = new Set(w), F = new Set(C);
      for (const J of s)
        for (const A of J.tagIds)
          J.mode === "ADD" ? q.add(A) : q.delete(A);
      for (const J of c)
        for (const A of J.tagIds)
          J.mode === "MARK_PRESENT" ? (q.add(A), F.delete(A)) : J.mode === "MARK_ABSENT" ? (q.delete(A), F.add(A)) : F.delete(A);
      const B = [...q], T = [...F];
      JSON.stringify(w) === JSON.stringify(B) && JSON.stringify(C) === JSON.stringify(T) && (S === void 0 ? T.length === 0 : JSON.stringify(S) === JSON.stringify(C)) || await x(`/api/videos/${p}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: B,
          customFields: {
            ...g,
            [u]: T
          }
        })
      }), y++;
    } catch (b) {
      throw new Error(
        `Assessment stopped after ${y} video${y === 1 ? "" : "s"} completed; video ${p} was affected. Refresh and inspect it before retrying. ${b instanceof Error ? b.message : "Request failed."}`
      );
    }
}
async function Ei(e, t) {
  if (!mt(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (Ut(e)) {
    await Si(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (i) => ({
      mode: i.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: i.mode === "REMOVE_TREE" ? await pr(i.tagIds) : i.tagIds
    }))
  );
  for (let i = 0; i < r.length; i++)
    try {
      await x("/api/videos/bulk", {
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
  if (!mt(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await x("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
async function yn(e, t) {
  const r = e.occurrence;
  if (r.targetMode === "all") return null;
  if (r.targetMode === "selected") return r.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: s, ...c } = r.performerFilter;
  for (let a = 1; ; a++) {
    const u = await x("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        it({
          findFilter: { page: a, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: c,
          filterExpression: s
        })
      )
    });
    if (u.items.forEach((y) => i.add(y.id)), a * 1e3 >= u.totalCount) return [...i];
    if (!u.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function bn(e, t) {
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
function Ni(e, t) {
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
async function gt(e, t, r, i) {
  if ((t == null ? void 0 : t.length) === 0)
    return { items: [], totalCount: 0 };
  const s = await Dt(
    bn(e, t),
    { ...e.view.filter, page: r },
    i
  ), c = t === null ? null : new Set(t), a = new Array(s.items.length);
  let u = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, s.items.length) }, async () => {
      for (; u < s.items.length; ) {
        const y = u++, p = s.items[y], b = await x(
          `/api/tagapplications?hostType=video&hostId=${p.id}&contextType=performer`,
          { signal: i }
        );
        a[y] = p.performers.filter((w) => c === null || c.has(w.id)).flatMap((w) => {
          const g = b.filter(
            (S) => S.hostType === "video" && S.hostId === p.id && S.contextType === "performer" && S.contextId === w.id
          );
          return Ni(
            e.occurrence,
            g.map((S) => S.tag.id)
          ) ? [
            {
              key: `${p.id}:${w.id}`,
              video: p,
              performer: w,
              applications: g
            }
          ] : [];
        });
      }
    })
  ), { items: a.flat(), totalCount: s.totalCount };
}
async function Ai(e, t, r) {
  const i = new Set(e.occurrence.tagIds);
  if (r.some((y) => !i.has(y)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const s = await x(`/api/videos/${t.video.id}`);
  if (!s.performers.some(
    (y) => y.id === t.performer.id
  ))
    throw new Error(
      "This performer is no longer linked to the scene. Refresh the queue."
    );
  const c = `/api/tagapplications?hostType=video&hostId=${s.id}&contextType=performer&contextId=${t.performer.id}`, a = (await x(c)).filter(
    (y) => y.hostType === "video" && y.hostId === s.id && y.contextType === "performer" && y.contextId === t.performer.id
  ), u = new Set(r);
  try {
    for (const y of u)
      a.some((p) => p.tag.id === y) || await x("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: "video",
          hostId: s.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: y,
          sourceKey: "user"
        })
      });
    for (const y of a)
      i.has(y.tag.id) && !u.has(y.tag.id) && await x(`/api/tagapplications/${y.id}`, {
        method: "DELETE"
      });
    return await x(c);
  } catch (y) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${y instanceof Error ? y.message : "Request failed."}`
    );
  }
}
function Kr({
  review: e,
  onChange: t,
  choices: r = !1
}) {
  const [i, s] = E(!1), c = e.occurrence, a = (u) => t({ ...e, occurrence: { ...c, ...u } });
  return r ? /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ n("p", { children: "Choose the tags this review can change on the active performer’s appearance in a scene. Other tags are preserved." }),
    /* @__PURE__ */ n(
      nt,
      {
        entityType: "tag",
        values: c.tagIds,
        onChange: (u) => a({ tagIds: u }),
        placeholder: "Search review tag choices...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
      /* @__PURE__ */ n(
        "input",
        {
          type: "checkbox",
          checked: c.multiple,
          onChange: (u) => a({ multiple: u.target.checked })
        }
      ),
      "Allow multiple tags, for example when a hairstyle changes during the scene"
    ] }),
    /* @__PURE__ */ n("p", { children: "Save & next performer records the selected tags, including an explicit empty answer. Cannot determine records an inconclusive outcome without changing tags. Skip leaves the occurrence unresolved." })
  ] }) : /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Target performers" }),
    /* @__PURE__ */ n("p", { children: "Scene filters choose videos. These settings choose which performers within those videos need review." }),
    /* @__PURE__ */ d("label", { children: [
      "Performers to review",
      /* @__PURE__ */ d(
        "select",
        {
          "aria-label": "Performers to review",
          value: c.targetMode,
          onChange: (u) => a({
            targetMode: u.target.value
          }),
          children: [
            /* @__PURE__ */ n("option", { value: "all", children: "All performers in each scene" }),
            /* @__PURE__ */ n("option", { value: "selected", children: "Selected performers only" }),
            /* @__PURE__ */ n("option", { value: "filter", children: "Performers matching a filter" })
          ]
        }
      )
    ] }),
    c.targetMode === "selected" && /* @__PURE__ */ n(
      nt,
      {
        entityType: "performer",
        values: c.performerIds,
        onChange: (u) => a({ performerIds: u }),
        placeholder: "Search target performers...",
        allowCreate: !1
      }
    ),
    c.targetMode === "filter" && /* @__PURE__ */ d(Ee, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button",
          onClick: () => s(!0),
          children: "Edit target performer filters"
        }
      ),
      /* @__PURE__ */ n("p", { children: Object.keys(c.performerFilter).length ? "Performer filters configured" : "No performer restrictions" })
    ] }),
    i && /* @__PURE__ */ n(
      Xr,
      {
        open: !0,
        criteria: Kn,
        activeFilter: c.performerFilter,
        subjectLabel: "performers",
        supportsFilterExpressions: !0,
        onClose: () => s(!1),
        onApply: (u) => {
          a({ performerFilter: u }), s(!1);
        }
      }
    ),
    /* @__PURE__ */ d("label", { children: [
      "Occurrence condition",
      /* @__PURE__ */ d(
        "select",
        {
          "aria-label": "Occurrence condition",
          value: c.condition,
          onChange: (u) => a({
            condition: u.target.value
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
    !["any", "isNull"].includes(c.condition) && /* @__PURE__ */ n(
      nt,
      {
        entityType: "tag",
        values: c.conditionTagIds,
        onChange: (u) => a({ conditionTagIds: u }),
        placeholder: "Search occurrence condition tags...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("p", { children: "Conditions check exact tags on the same performer’s occurrence, independently of scene tags and the performer’s profile." })
  ] });
}
function Ti({
  review: e,
  storageKey: t,
  canWrite: r,
  onBusy: i
}) {
  var N, L, K, Ue;
  const [s, c] = E([]), [a, u] = E(1), [y, p] = E(0), [b, w] = E(null), [g, S] = E(
    {}
  ), [C, q] = E([]), [F, B] = E({}), [T, Q] = E(!0), [J, A] = E(!1), [m, O] = E(!1), _ = D(!1), [H, te] = E(""), [ce, pe] = E(""), [ot, ne] = E(""), [vt, _e] = E(0), Le = D(null), Fe = D(null), st = D(null), Ce = D(/* @__PURE__ */ new Set()), j = s.find((v) => v.key === b) ?? null, St = s.findIndex((v) => v.key === b), Oe = Number(be(e.view.filter).perPage), at = Math.max(1, Math.ceil(y / Oe)), Ne = (v, k, $ = g) => ({
    version: 1,
    signature: De(e),
    filter: { ...e.view.filter, page: v },
    focusedId: k ? Number(k.split(":")[0]) : null,
    index: 0,
    displayMode: "grid",
    cardSize: null,
    updatedAt: Date.now(),
    occurrence: {
      answerSignature: xr(e),
      focusedKey: k,
      outcomes: $
    }
  });
  async function Ae(v) {
    Fe.current = v;
    try {
      await hn(t, e.id, v);
    } catch (k) {
      ne(
        `Progress sync failed. Retry sync before leaving this browser. ${k instanceof Error ? k.message : "Request failed."}`
      );
    }
  }
  function Pe(v) {
    pe(""), w((v == null ? void 0 : v.key) ?? null), q(
      v ? [
        ...new Set(
          v.applications.map((k) => k.tag.id).filter((k) => e.occurrence.tagIds.includes(k))
        )
      ] : []
    );
  }
  re(() => {
    const v = new AbortController();
    return st.current = v, Q(!0), A(!1), te(""), c([]), w(null), q([]), S({}), p(0), Fe.current = null, Ce.current.clear(), (async () => {
      var he, lt;
      const k = await gn(t, e.id), $ = (k == null ? void 0 : k.signature) === De(e) ? k : null, M = ((he = k == null ? void 0 : k.occurrence) == null ? void 0 : he.answerSignature) === xr(e) ? k.occurrence.outcomes : ((lt = $ == null ? void 0 : $.occurrence) == null ? void 0 : lt.outcomes) ?? {}, G = await yn(e, v.signal), ge = await Promise.all(
        e.occurrence.tagIds.map(
          async (Te) => [
            Te,
            (await x(`/api/tags/${Te}`, {
              signal: v.signal
            })).name
          ]
        )
      );
      let z = $ ? Number(be($.filter).page) : 1, V = await gt(
        e,
        G,
        z,
        v.signal
      );
      const ue = Math.max(1, Math.ceil(V.totalCount / Oe));
      (!$ && e.view.startFrom === "end" || z > ue) && (z = ue, V = await gt(
        e,
        G,
        z,
        v.signal
      ));
      let P = V.items.find(
        (Te) => {
          var Et;
          return Te.key === ((Et = $ == null ? void 0 : $.occurrence) == null ? void 0 : Et.focusedKey);
        }
      ) ?? V.items.find((Te) => !M[Te.key]);
      const je = e.view.startFrom === "end" ? -1 : 1;
      for (; !P && (je === 1 ? z < Math.ceil(V.totalCount / Oe) : z > 1); )
        z += je, V = await gt(
          e,
          G,
          z,
          v.signal
        ), P = V.items.find((Te) => !M[Te.key]);
      v.signal.aborted || (Le.current = G, B(Object.fromEntries(ge)), S(M), c(V.items), u(z), p(V.totalCount), Pe(P ?? null), A(!0));
    })().catch((k) => {
      v.signal.aborted || te(
        k instanceof Error ? k.message : "Could not load occurrences."
      );
    }).finally(() => {
      v.signal.aborted || Q(!1);
    }), () => v.abort();
  }, [e, t, vt]), re(() => (i(m || T), () => i(!1)), [m, T, i]);
  async function oe(v, k = g) {
    var $;
    if (!(!J || m || T)) {
      Q(!0), te("");
      try {
        const M = await gt(
          e,
          Le.current,
          v,
          ($ = st.current) == null ? void 0 : $.signal
        ), G = Math.max(1, Math.ceil(M.totalCount / Oe));
        if (v > G) {
          await oe(G, k);
          return;
        }
        c(M.items), u(v), p(M.totalCount);
        const ge = M.items.find((z) => !k[z.key]) ?? null;
        Pe(ge), await Ae(Ne(v, (ge == null ? void 0 : ge.key) ?? null, k));
      } catch (M) {
        te(
          M instanceof Error ? M.message : "Could not load occurrences."
        );
      } finally {
        Q(!1);
      }
    }
  }
  async function Me(v) {
    var k;
    if (!(!J || !j || _.current || T || v && !r)) {
      _.current = !0, O(!0), i(!0), te("");
      try {
        if (v === "reviewed") {
          const G = await Ai(
            e,
            j,
            C
          );
          c(
            (ge) => ge.map(
              (z) => z.key === j.key ? { ...z, applications: G } : z
            )
          );
        }
        const $ = { ...g };
        v ? $[j.key] = v : Ce.current.add(j.key), S($);
        const M = s.slice(St + 1).find(
          (G) => !$[G.key] && !Ce.current.has(G.key)
        ) ?? null;
        if (M)
          Pe(M), await Ae(Ne(a, M.key, $));
        else {
          await Ae(Ne(a, null, $)), await new Promise((z) => window.setTimeout(z, 1100));
          let G = a;
          const ge = e.view.startFrom === "end" ? -1 : 1;
          for (; ; ) {
            const z = await gt(
              e,
              Le.current,
              G,
              (k = st.current) == null ? void 0 : k.signal
            ), V = Math.max(1, Math.ceil(z.totalCount / Oe));
            if (G > V) {
              G = V;
              continue;
            }
            const ue = z.items.find(
              (P) => !$[P.key] && !Ce.current.has(P.key)
            );
            if (ue || (ge === 1 ? G >= V : G <= 1)) {
              c(z.items), u(G), p(z.totalCount), Pe(ue ?? null), await Ae(
                Ne(G, (ue == null ? void 0 : ue.key) ?? null, $)
              ), ue || pe(
                "No more unresolved occurrences in this direction. Skipped performers remain unresolved and can be revisited from the scene pages."
              );
              break;
            }
            G += ge;
          }
        }
      } catch ($) {
        te(
          $ instanceof Error ? $.message : "Could not save this occurrence."
        );
      } finally {
        _.current = !1, O(!1), i(!1);
      }
    }
  }
  const X = s.filter((v) => !g[v.key]).length;
  return /* @__PURE__ */ d(
    "section",
    {
      className: "dq-occurrence-workspace",
      "aria-label": "Performer occurrence review",
      onKeyDown: (v) => v.stopPropagation(),
      children: [
        /* @__PURE__ */ d("div", { className: "dq-occurrence-toolbar", children: [
          /* @__PURE__ */ n("p", { role: "status", children: T ? "Loading performer occurrences…" : `${X} unresolved of ${s.length} performer ${s.length === 1 ? "occurrence" : "occurrences"} on this page · ${y} matching ${y === 1 ? "scene" : "scenes"}` }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: !J || m || T || a <= 1,
              onClick: () => void oe(a - 1),
              children: "Previous scene page"
            }
          ),
          /* @__PURE__ */ d("span", { children: [
            "Scene page ",
            a,
            " of ",
            at
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: !J || m || T,
              onClick: () => void oe(a),
              children: "Refresh page"
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: !J || m || T || a >= at,
              onClick: () => void oe(a + 1),
              children: "Next scene page"
            }
          )
        ] }),
        H && /* @__PURE__ */ d("p", { role: "alert", children: [
          H,
          " ",
          !m && /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => _e((v) => v + 1),
              children: "Reload queue"
            }
          )
        ] }),
        ce && /* @__PURE__ */ n("p", { role: "status", children: ce }),
        ot && /* @__PURE__ */ d("p", { role: "alert", children: [
          ot,
          " ",
          Fe.current && /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: () => {
                ne(""), Ae(Fe.current);
              },
              children: "Retry progress sync"
            }
          )
        ] }),
        !T && !j && /* @__PURE__ */ n("p", { children: s.length ? "No active performer. Choose an occurrence below to review or revisit it." : "No performer occurrences match on this page." }),
        /* @__PURE__ */ d("fieldset", { disabled: !J || m || T, className: "dq-occurrence-content", children: [
          j && /* @__PURE__ */ d(Ee, { children: [
            /* @__PURE__ */ d("div", { className: "dq-occurrence-media", children: [
              /* @__PURE__ */ n(
                "a",
                {
                  href: `/video/${j.video.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: j.video.title || ((N = j.video.files[0]) == null ? void 0 : N.basename) || "Open scene"
                }
              ),
              /* @__PURE__ */ n(
                Hr,
                {
                  videoId: j.video.id,
                  streamUrl: mn(j.video.id),
                  posterUrl: pi(j.video),
                  duration: ((L = j.video.files[0]) == null ? void 0 : L.duration) ?? 0,
                  format: (K = j.video.files[0]) == null ? void 0 : K.format,
                  audioCodec: (Ue = j.video.files[0]) == null ? void 0 : Ue.audioCodec,
                  extensionSurface: "quick-view",
                  showAbLoop: !0,
                  clip: j.video.parentVideoId != null ? {
                    start: j.video.clipStartSec ?? 0,
                    end: j.video.clipEndSec,
                    loop: !1
                  } : void 0
                },
                j.video.id
              )
            ] }),
            /* @__PURE__ */ d("div", { className: "dq-occurrence-panel", children: [
              /* @__PURE__ */ d("h2", { children: [
                "Reviewing ",
                j.performer.name
              ] }),
              /* @__PURE__ */ n("p", { children: "Tags apply only to this performer in this scene." }),
              /* @__PURE__ */ n(
                "div",
                {
                  className: "dq-occurrence-performers",
                  "aria-label": "Performers in this scene",
                  children: s.filter((v) => v.video.id === j.video.id).map((v) => /* @__PURE__ */ d(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      "aria-pressed": v.key === j.key,
                      onClick: () => {
                        Pe(v), Ae(Ne(a, v.key));
                      },
                      children: [
                        v.performer.imagePath ? /* @__PURE__ */ n(
                          "img",
                          {
                            src: `/api/performers/${v.performer.id}/image?max=96`,
                            alt: "",
                            onError: (k) => {
                              k.currentTarget.hidden = !0;
                            }
                          }
                        ) : /* @__PURE__ */ n("span", { className: "dq-occurrence-avatar", "aria-hidden": "true", children: v.performer.name.slice(0, 1) }),
                        v.performer.name,
                        " ·",
                        " ",
                        g[v.key] === "reviewed" ? "Reviewed" : g[v.key] === "cannotDetermine" ? "Cannot determine" : "Unresolved"
                      ]
                    },
                    v.key
                  ))
                }
              ),
              /* @__PURE__ */ d("fieldset", { disabled: !r, className: "dq-occurrence-choices", children: [
                /* @__PURE__ */ n("legend", { children: "Occurrence tags" }),
                e.occurrence.tagIds.map((v) => /* @__PURE__ */ d("label", { children: [
                  /* @__PURE__ */ n(
                    "input",
                    {
                      type: e.occurrence.multiple ? "checkbox" : "radio",
                      name: "occurrence-tag",
                      checked: C.includes(v),
                      onChange: (k) => q(
                        e.occurrence.multiple ? k.target.checked ? [...C, v] : C.filter(($) => $ !== v) : [v]
                      )
                    }
                  ),
                  F[v] ?? "Loading tag…"
                ] }, v)),
                /* @__PURE__ */ d("label", { children: [
                  /* @__PURE__ */ n(
                    "input",
                    {
                      type: e.occurrence.multiple ? "checkbox" : "radio",
                      name: "occurrence-tag",
                      checked: C.length === 0,
                      onChange: () => q([])
                    }
                  ),
                  "No applicable tags"
                ] })
              ] }),
              /* @__PURE__ */ d("div", { className: "dq-occurrence-actions", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button primary",
                    disabled: !r || !e.occurrence.multiple && C.length > 1,
                    onClick: () => void Me("reviewed"),
                    children: m ? "Saving…" : "Save & next performer"
                  }
                ),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: !r,
                    onClick: () => void Me("cannotDetermine"),
                    children: "Cannot determine & next"
                  }
                ),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    onClick: () => void Me(),
                    children: "Skip performer"
                  }
                )
              ] }),
              !r && /* @__PURE__ */ n("p", { children: "Tag write permission is required to save occurrence reviews." })
            ] })
          ] }),
          /* @__PURE__ */ d("details", { className: "dq-occurrence-list", open: !j, children: [
            /* @__PURE__ */ d("summary", { children: [
              "All ",
              s.length,
              " occurrences on this scene page"
            ] }),
            s.map((v) => /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                className: "dq-button",
                "aria-pressed": v.key === b,
                onClick: () => {
                  Pe(v), Ae(Ne(a, v.key));
                },
                children: [
                  v.performer.name,
                  " — ",
                  v.video.title || "Scene",
                  " ·",
                  " ",
                  g[v.key] === "reviewed" ? "Reviewed" : g[v.key] === "cannotDetermine" ? "Cannot determine" : "Unresolved"
                ]
              },
              v.key
            ))
          ] })
        ] })
      ]
    }
  );
}
function Ri(e) {
  var u, y, p;
  const [t, r] = E({}), [i, s] = E(""), c = (((u = e == null ? void 0 : e.presentation) == null ? void 0 : u.annotations) ?? []).includes("tags") ? ((y = e == null ? void 0 : e.presentation) == null ? void 0 : y.annotationParents) ?? [] : [], a = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...c,
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return re(() => {
    let b = !0;
    return r({}), s(""), Promise.all(
      JSON.parse(a).map(
        async (w) => [w, await pr([w])]
      )
    ).then((w) => {
      b && r(Object.fromEntries(w));
    }).catch(() => {
      b && s(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      b = !1;
    };
  }, [a]), { ids: t, error: i };
}
function Ii(e, t, r) {
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
        (u) => {
          var y;
          return u !== a.id && ((y = r[u]) == null ? void 0 : y.includes(a.id));
        }
      )
    ) : []
  };
}
function ki({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: s
}) {
  var u, y, p;
  const c = new Set(
    (((u = t.presentation) == null ? void 0 : u.binParents) ?? []).flatMap(
      (b) => (r[b] ?? []).filter((w) => w !== b)
    )
  ), a = /* @__PURE__ */ new Map();
  for (const b of e)
    for (const w of b.tags ?? [])
      if (c.has(w.id)) {
        const g = a.get(w.id) ?? { name: w.name, count: 0 };
        g.count++, a.set(w.id, g);
      }
  return (p = (y = t.presentation) == null ? void 0 : y.binParents) != null && p.length ? /* @__PURE__ */ d("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...a].sort((b, w) => b[1].name.localeCompare(w[1].name)).map(([b, w]) => /* @__PURE__ */ d(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => s(b),
        children: [
          w.name,
          " (",
          w.count,
          ")"
        ]
      },
      b
    )),
    !a.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function qi(e, t) {
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
function Gr({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [s, c] = E(!1), a = ve(e) === "tag" ? "tag" : "video", u = e.view.filter, y = a === "tag" ? Yr : Zr, p = (g) => t({
    ...e,
    view: { ...e.view, filter: { ...u, ...g } }
  }), b = a === "video" ? e.presentation ?? {} : {}, w = (g) => t({ ...e, presentation: { ...b, ...g } });
  return /* @__PURE__ */ d(Ee, { children: [
    i && /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ d("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(u.q ?? ""),
            onChange: (g) => p({ q: g.target.value })
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
              onChange: (g) => p({ sort: g.target.value, sorts: void 0 }),
              children: [
                !y.some((g) => g.value === u.sort) && u.sort != null && /* @__PURE__ */ n("option", { value: String(u.sort), children: String(u.sort) }),
                y.map((g) => /* @__PURE__ */ n("option", { value: g.value, children: g.label }, g.value))
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
              onChange: (g) => p({ direction: g.target.value }),
              children: [
                /* @__PURE__ */ n("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ n("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          a === "tag" ? "Tags" : "Videos",
          " per page",
          /* @__PURE__ */ n(
            "input",
            {
              type: "number",
              min: "1",
              max: "1000",
              value: Number(u.perPage) || 40,
              onChange: (g) => p({
                perPage: Math.max(
                  1,
                  Math.min(1e3, Number(g.target.value) || 40)
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
              onChange: (g) => t({
                ...e,
                view: {
                  ...e.view,
                  startFrom: g.target.value
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
            a,
            " filters"
          ]
        }
      ),
      /* @__PURE__ */ d("p", { children: [
        Object.keys(e.view.objectFilter).length ? `${a === "tag" ? "Tag" : "Video"} filters configured` : `No ${a} filters`,
        ". Choose which ",
        a === "tag" ? "tags" : "videos",
        " enter the queue."
      ] }),
      s && /* @__PURE__ */ n("div", { onKeyDown: (g) => g.stopPropagation(), children: /* @__PURE__ */ n(
        Xr,
        {
          open: !0,
          onClose: () => c(!1),
          criteria: a === "tag" ? en : er,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: a === "video",
          subjectLabel: a === "tag" ? "tags" : "videos",
          onApply: (g) => {
            t({ ...e, view: { ...e.view, objectFilter: g } }), c(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ d(Ee, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ d("p", { className: "dq-editor-note", children: [
        "Choose how ",
        a === "tag" ? "tags" : "videos and tags",
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ n("div", { className: "dq-field-grid", children: /* @__PURE__ */ d("label", { children: [
        "Preferred view",
        /* @__PURE__ */ n(
          "select",
          {
            value: a === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid",
            onChange: (g) => t({
              ...e,
              view: {
                ...e.view,
                displayMode: g.target.value
              }
            }),
            children: (a === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((g) => /* @__PURE__ */ n("option", { children: g }, g))
          }
        )
      ] }) }),
      a === "video" && /* @__PURE__ */ d(Ee, { children: [
        /* @__PURE__ */ n("h4", { children: "Card annotations" }),
        /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((g) => {
          const S = b.annotations ?? [];
          return /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: S.includes(g),
                onChange: (C) => w({
                  annotations: C.target.checked ? [...S, g] : S.filter((q) => q !== g)
                })
              }
            ),
            g
          ] }, g);
        }) }),
        (b.annotations ?? []).includes("tags") && /* @__PURE__ */ d(Ee, { children: [
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
          /* @__PURE__ */ n(
            nt,
            {
              entityType: "tag",
              values: b.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (g) => w({ annotationParents: g }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ n("h4", { children: "Tag bins" }),
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ n(
          nt,
          {
            entityType: "tag",
            values: b.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (g) => w({ binParents: g }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const Oi = {
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
function hr(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Pi(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function Mi(e) {
  return [
    ...new Set(
      hr(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function $i(e, t) {
  const r = hr(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((i) => {
      const s = String(i.key ?? ""), c = Oi[String(i.modifier ?? "EQUALS")], a = (w, g) => String(g ?? "").trim() || t[String(w)] || String(w ?? ""), u = a(
        i.value,
        i.displayValue
      ), y = a(
        i.value2,
        i.displayValue2
      ), p = String(i.modifier ?? "EQUALS"), b = p === "IS_NULL" || p === "NOT_NULL" ? [] : p === "BETWEEN" || p === "NOT_BETWEEN" ? [u, "and", y] : [u];
      return {
        ...i,
        label: [Pi(s), c, ...b].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function xi(e) {
  const t = hr(e.customFieldCriteria);
  return t.length ? {
    ...e,
    customFieldCriteria: t.map(
      ({ label: r, ...i }) => i
    )
  } : e;
}
function _i(e, t, r) {
  return r || "customFieldCriteria" in t || !Array.isArray(e.customFieldCriteria) ? t : { ...t, customFieldCriteria: e.customFieldCriteria };
}
const Zt = 180, Li = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function wn({ entityType: e }) {
  return e === "tag" ? /* @__PURE__ */ n(Xn, { role: "img", "aria-label": "Tag review" }) : /* @__PURE__ */ n(nr, { role: "img", "aria-label": e === "performerOccurrence" ? "Performer occurrence review" : "Video review" });
}
function Vr(e) {
  return ve(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Br(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Fi() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Jr(e) {
  const t = new URLSearchParams(window.location.search);
  e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function Di(e) {
  return be({ ...e, page: 1 });
}
function lr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((a, u) => lr(a, t[u]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, s = Object.keys(r).sort(), c = Object.keys(i).sort();
  return s.length === c.length && s.every(
    (a, u) => a === c[u] && lr(r[a], i[a])
  );
}
function vn(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function we(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
const Sn = "data-quality.workspace-layout.v1", mr = 240, cr = 192, dr = 560;
function En(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(dr, Math.max(cr, e)) : mr;
}
function Ui() {
  try {
    const e = JSON.parse(
      localStorage.getItem(Sn) ?? "null"
    );
    return En(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return mr;
  }
}
function ji(e) {
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
function Ki(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : Nn(e, t);
}
function Gi({
  onNavigate: e
}) {
  const [t, r] = E([]), [i] = E(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [s, c] = E(""), [a, u] = E(!0), [y, p] = E(""), [b, w] = E(!1), [g, S] = E(!1), [C, q] = E(!1), [F, B] = E([]), [T, Q] = E(""), [J, A] = E(!0), [m, O] = E(""), [_, H] = E(""), [te, ce] = E(!1), [pe, ot] = E(!1), [ne, vt] = E(Fi), [_e, Le] = E({}), [Fe, st] = E("name"), [Ce, j] = E("asc"), St = D(null), Oe = D(!1), [at, Ne] = E(!1), [Ae, Pe] = E(!1), [oe, Me] = E(
    null
  ), X = t.find((o) => o.id === ne) ?? null, N = ft(
    () => (oe == null ? void 0 : oe.id) === ne && X ? { ...X, view: oe.view } : X,
    [oe, ne, X]
  ), L = N ? ve(N) : "video", K = L === "video" ? N : null, Ue = L === "tag" ? g : b, v = ft(() => {
    const o = Ce === "asc" ? 1 : -1;
    return [...t].sort((l, f) => {
      if (Fe === "count") {
        const h = _e[l.id], I = _e[f.id], R = typeof h == "number", U = typeof I == "number";
        if (R !== U) return R ? -1 : 1;
        if (R && U && h !== I)
          return (h - I) * o;
      }
      return l.name.localeCompare(f.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * o;
    });
  }, [Ce, Fe, _e, t]), k = D(
    null
  ), $ = Ri(K), [M, G] = E({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [ge, z] = E({
    page: 1,
    perPage: 40
  }), [V, ue] = E({ items: [], totalCount: 0 }), [P, je] = E(!1), [he, lt] = E(""), [Te, Et] = E(!1), [Re, $e] = E(() => /* @__PURE__ */ new Set()), Ct = D(Re);
  Ct.current = Re;
  const Ke = D(/* @__PURE__ */ new Map()), [fe, me] = E(null), Se = D(fe);
  Se.current = fe;
  const [Ie, Qe] = E(!1), ke = D(Ie);
  ke.current = Ie;
  const yr = D(null), [Ge, Gt] = E("grid"), [Nt, br] = E(Zt), [He, Tn] = E(Ui), [W, At] = E(!1), Tt = D(!1), [Rn, Vt] = E(""), [Rt, Ve] = E(""), [Bt, ct] = E(""), [ee, wr] = E(null), [vr, It] = E(""), [kt, qt] = E(!1), [Sr, Er] = E({}), [Cr, Nr] = E({}), dt = D(/* @__PURE__ */ new Map()), Ar = D(null), Ot = D(null), Xe = D(0), Pt = D(0), Mt = D(null), Be = D(!1), Tr = JSON.stringify([
    ...new Set(
      (K == null ? void 0 : K.actions.flatMap(
        (o) => o.steps.flatMap((l) => l.tagIds)
      )) ?? []
    )
  ]);
  function Jt(o) {
    const l = En(o);
    Tn(l), ji(l);
  }
  function In(o) {
    const l = o.shiftKey ? 40 : 16;
    let f = null;
    o.key === "ArrowLeft" && (f = He + l), o.key === "ArrowRight" && (f = He - l), o.key === "Home" && (f = cr), o.key === "End" && (f = dr), f !== null && (o.preventDefault(), o.stopPropagation(), Jt(f));
  }
  re(() => {
    if (!Rt) return;
    const o = window.setTimeout(() => Ve(""), 4e3);
    return () => window.clearTimeout(o);
  }, [Rt]), re(() => {
    const o = JSON.parse(Tr);
    if (Nr({}), !o.length) return;
    const l = new AbortController();
    let f = !0;
    return Promise.all(
      o.map(async (h) => {
        var I;
        try {
          const R = await x(`/api/tags/${h}`, {
            signal: l.signal
          });
          return [h, ((I = R.name) == null ? void 0 : I.trim()) || null];
        } catch {
          return [h, null];
        }
      })
    ).then((h) => {
      f && Nr(Object.fromEntries(h));
    }), () => {
      f = !1, l.abort();
    };
  }, [Tr]), re(() => {
    const o = K ? Mi(K.view.objectFilter) : [];
    if (Er({}), !o.length) return;
    const l = new AbortController();
    let f = !0;
    return Promise.all(
      o.map(async (h) => {
        var I;
        try {
          const R = await x(`/api/tags/${h}`, {
            signal: l.signal
          });
          return (I = R.name) != null && I.trim() ? [String(h), R.name] : null;
        } catch {
          return null;
        }
      })
    ).then((h) => {
      f && Er(
        Object.fromEntries(h.filter((I) => I !== null))
      );
    }), () => {
      f = !1, l.abort();
    };
  }, [K == null ? void 0 : K.id, K == null ? void 0 : K.view.objectFilter]);
  const zt = ft(
    () => K ? $i(
      K.view.objectFilter,
      Sr
    ) : (N == null ? void 0 : N.view.objectFilter) ?? {},
    [Sr, N, K]
  ), kn = ft(
    () => L === "video" && Array.isArray(zt.customFieldCriteria) ? [...er, Li] : L === "tag" ? en : er,
    [L, zt.customFieldCriteria]
  ), Rr = We(async () => {
    u(!0), p("");
    try {
      const o = await li();
      r(o.reviews), c(o.storageKey), w(o.canWriteVideos ?? o.canWrite), S(o.canWriteTags ?? !1), q(o.canReadTagGroups ?? !1), A(o.canConfigure ?? !0), O(o.storageNotice ?? ""), ne && !o.reviews.some((l) => l.id === ne) && (vt(""), Jr(""));
    } catch (o) {
      p(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      u(!1);
    }
  }, [ne]);
  re(() => {
    if (!C) {
      B([]), Q("");
      return;
    }
    const o = new AbortController();
    return Q(""), fi(o.signal).then(B).catch((l) => {
      o.signal.aborted || Q(
        l instanceof Error ? l.message : "Could not load tag groups."
      );
    }), () => o.abort();
  }, [C]), re(() => {
    Rr();
  }, []), re(() => {
    if (ne || t.length === 0) return;
    const o = new AbortController();
    Le({});
    for (const l of t)
      (l.entityType === "performerOccurrence" ? yn(l, o.signal).then((h) => (h == null ? void 0 : h.length) === 0 ? { totalCount: 0 } : Dt(bn(l, h), { ...l.view.filter, page: 1, perPage: 1 }, o.signal)) : ve(l) === "tag" ? Ur(
        l,
        be({ ...l.view.filter, page: 1, perPage: 1 }),
        o.signal
      ) : Dt(
        l,
        be({ ...l.view.filter, page: 1, perPage: 1 }),
        o.signal
      )).then((h) => {
        o.signal.aborted || Le((I) => ({
          ...I,
          [l.id]: h.totalCount
        }));
      }).catch(() => {
        o.signal.aborted || Le((h) => ({ ...h, [l.id]: null }));
      });
    return () => o.abort();
  }, [ne, t]), Qr(() => {
    var o;
    ne || a || !Oe.current || (Oe.current = !1, (o = St.current) == null || o.focus());
  }, [ne, a]);
  const $t = We(async () => {
    It("");
    try {
      wr(await gr());
    } catch (o) {
      wr(null), It(
        "Tag assessment setup could not be checked. " + (o instanceof Error ? o.message : "Request failed.")
      );
    }
  }, []);
  re(() => {
    $t();
  }, [$t]);
  const Je = We(
    async (o, l, f = !1) => {
      var U;
      const h = ++Xe.current;
      (U = Mt.current) == null || U.abort();
      const I = new AbortController();
      Mt.current = I, l = be(l);
      const R = Number(l.page);
      f && (l = { ...l, page: 1 }), G(l), Et(f), je(!0), lt("");
      try {
        const ie = (Ze) => ve(o) === "tag" ? Ur(
          o,
          Ze,
          I.signal
        ) : Dt(
          o,
          Ze,
          I.signal
        );
        let de = await ie(l);
        const qe = Math.max(
          1,
          Math.ceil(de.totalCount / Number(l.perPage))
        ), ye = f ? qe : Math.min(R, qe);
        return Number(l.page) !== ye && (l = { ...l, page: ye }, de = await ie(l)), h === Xe.current && (ue(de), G(l), z(l)), de;
      } catch (ie) {
        throw h === Xe.current && lt(
          ie instanceof Error ? ie.message : "Could not load the review queue."
        ), ie;
      } finally {
        h === Xe.current && je(!1);
      }
    },
    []
  );
  re(() => {
    var l;
    if (Pt.current += 1, Xe.current += 1, (l = Mt.current) == null || l.abort(), ot(!1), H(""), ce(!1), $e(/* @__PURE__ */ new Set()), Ke.current.clear(), me(null), Qe(!1), At(!1), Tt.current = !1, Vt(""), Ve(""), ct(""), ue({ items: [], totalCount: 0 }), !N || N.entityType === "performerOccurrence") {
      je(!1);
      return;
    }
    let o = !0;
    return je(!0), (async () => {
      let f = null;
      try {
        f = await gn(s, N.id);
      } catch (R) {
        o && (ce(!0), H(
          R instanceof Error ? R.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const h = (f == null ? void 0 : f.signature) === De(N) ? f : null, I = h ? be(h.filter) : Di(N.view.filter);
      G(I), Gt(
        h ? Br(h.displayMode, ve(N)) : Vr(N)
      ), br(
        h ? h.cardSize ?? Zt : Zt
      );
      try {
        const R = await Je(
          N,
          I,
          !h && N.view.startFrom !== "beginning"
        );
        if (!o) return;
        const U = _r(
          R.items.map((ie) => ie.id),
          (h == null ? void 0 : h.focusedId) ?? null,
          (h == null ? void 0 : h.index) ?? 0
        );
        me(U), ae(U);
      } catch {
      }
      o && ot(!0);
    })(), () => {
      var f;
      o = !1, Pt.current++, Xe.current++, (f = Mt.current) == null || f.abort();
    };
  }, [N == null ? void 0 : N.id]);
  const Y = ft(
    () => V.items.map((o) => o.id),
    [V.items]
  );
  re(() => {
    if (!pe || !N || !s || P || he || W || (oe == null ? void 0 : oe.id) === N.id || te)
      return;
    const o = {
      version: 1,
      signature: De(N),
      filter: M,
      focusedId: fe,
      index: Math.max(0, Y.indexOf(fe ?? -1)),
      displayMode: Ge,
      cardSize: Nt,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        s + ":progress:" + N.id,
        JSON.stringify(o)
      );
    } catch {
    }
    if (_) return;
    let l = !0;
    const f = window.setTimeout(() => {
      hn(s, N.id, o).catch((h) => {
        l && H(
          "Progress is kept in this browser, but account sync failed. " + (h instanceof Error ? h.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      l = !1, window.clearTimeout(f);
    };
  }, [
    pe,
    s,
    N,
    P,
    he,
    W,
    M,
    fe,
    Y,
    Ge,
    Nt,
    oe,
    _,
    te
  ]);
  const qn = V.items.find((o) => o.id === fe) ?? null, Wt = L === "video" ? qn : null;
  Ie && Wt && (yr.current = Wt);
  const ze = Wt ?? (Ie ? yr.current : null), On = Lr(Re, fe), Ir = Re.size > 0 ? `${Re.size} selected ${L}${Re.size === 1 ? "" : "s"}` : fe == null ? `no ${L}` : `focused ${L}`, ae = We((o, l = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const f = dt.current.get(o);
      f == null || f.focus({ preventScroll: !0 }), l && (f == null || f.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  re(() => {
    pe && !ke.current && ae(Se.current);
  }, [pe, ae]), re(() => {
    P || !Y.length || (Se.current == null || !Y.includes(Se.current)) && (me(Y[0]), ke.current || ae(Y[0]));
  }, [ae, Y, P]);
  const Ye = We(
    (o) => {
      $e((l) => {
        const f = o(l);
        for (const h of /* @__PURE__ */ new Set([...l, ...f]))
          l.has(h) !== f.has(h) && Ke.current.set(
            h,
            (Ke.current.get(h) ?? 0) + 1
          );
        return f;
      });
    },
    []
  ), Qt = We(
    (o) => {
      if (!Y.length) return;
      const l = Math.max(
        0,
        Y.indexOf(Se.current ?? Y[0])
      ), f = Y[Math.max(0, Math.min(Y.length - 1, l + o))];
      me(f), ke.current || ae(f);
    },
    [ae, Y]
  ), Ht = We(
    async (o) => {
      const l = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", f = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, h = f != null && (!C || !F.some((Z) => Z.id === f)), I = "effect" in o && l && !C, R = Lr(
        Ct.current,
        Se.current
      );
      if (!N || Tt.current || P || he || l && !Ue || I || h || Ut(o) && (ee == null ? void 0 : ee.kind) !== "ready" || !R.length)
        return;
      const U = ++Pt.current, ie = N.id, de = [...Y], qe = V, ye = Se.current, Ze = new Set(Ct.current), ut = new Map(
        R.map((Z) => [Z, Ke.current.get(Z) ?? 0])
      ), et = () => U === Pt.current && N.id === ie;
      Tt.current = !0, At(!0), Vt(
        Ct.current.size ? `${R.length} selected ${L}s` : `the focused ${L}`
      ), Ve(""), ct("");
      const Or = qe.items.filter(
        (Z) => !R.includes(Z.id)
      ), Un = Or.map((Z) => Z.id), Pr = Fr(
        de,
        Un,
        ye,
        R.includes(ye ?? -1)
      );
      ue({
        items: Or,
        totalCount: qe.totalCount
      }), $e((Z) => {
        const se = new Set(Z);
        for (const le of R) se.delete(le);
        return se;
      }), me(Pr), ke.current || ae(Pr);
      let Xt = !1;
      try {
        if ("effect" in o ? await Ci(o, R) : await Ei(o, R), Xt = !0, !et()) return;
        $e((Z) => {
          const se = new Set(Z);
          for (const le of R)
            (Ke.current.get(le) ?? 0) === ut.get(le) && se.delete(le);
          return se;
        }), Ve(
          `${o.label}: ${R.length} ${L}${R.length === 1 ? "" : "s"} ${l ? "updated" : "skipped"}.`
        );
      } catch (Z) {
        if (!et()) return;
        ue(qe), $e((se) => {
          const le = new Set(se);
          for (const xe of R)
            Ze.has(xe) && (Ke.current.get(xe) ?? 0) === ut.get(xe) && le.add(xe);
          return le;
        }), me(ye), ke.current || ae(ye), ct(
          Z instanceof Error ? Z.message : "Action failed."
        );
      }
      try {
        if (await mi(o), !et()) return;
        const Z = await Je(N, M);
        if (!et()) return;
        let se = Z.items.map((le) => le.id);
        if (!se.length && Z.totalCount > 0 && Number(M.page) > 1) {
          const le = Math.max(1, Number(M.page) - 1), xe = { ...M, page: le };
          G(xe), se = (await Je(N, xe)).items.map((Yt) => Yt.id), $e(
            (Yt) => new Set([...Yt].filter((jn) => se.includes(jn)))
          );
          const $r = se.at(-1) ?? null;
          me($r), ke.current || ae($r);
        } else {
          $e(
            (xe) => new Set([...xe].filter((Mr) => se.includes(Mr)))
          );
          const le = Fr(
            de,
            se,
            ye,
            Xt && R.includes(ye ?? -1)
          );
          me(le), ke.current && le == null && Qe(!1), ke.current || ae(le);
        }
      } catch (Z) {
        et() && ct(
          (se) => `${se ? `${se} ` : ""}${Xt ? "The action completed, but " : ""}the queue could not be refreshed. ${Z instanceof Error ? Z.message : "Refresh failed."}`
        );
      } finally {
        et() && (Tt.current = !1, At(!1), Vt(""));
      }
    },
    [
      Ue,
      C,
      F,
      L,
      ee,
      Je,
      M,
      ae,
      Y,
      V,
      P,
      he,
      N
    ]
  );
  function Pn() {
    var f;
    if (Ge === "list") return 1;
    const o = (f = Ar.current) == null ? void 0 : f.firstElementChild, l = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, l.split(" ").filter(Boolean).length);
  }
  function Mn(o) {
    if (o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || at) return;
    if (Ie && o.key === "Escape") {
      we(o), Qe(!1), ae(Se.current);
      return;
    }
    if (!ii(o.target)) return;
    if (o.key === "Escape") {
      we(o), Ye(() => /* @__PURE__ */ new Set());
      return;
    }
    const l = (N == null ? void 0 : N.actions.findIndex(
      (I, R) => ht(I, R) === o.key
    )) ?? -1;
    if (l >= 0 && (N != null && N.actions[l])) {
      we(o), !W && !P && Ht(N.actions[l]);
      return;
    }
    if (!Ie && o.key === " ") {
      we(o), fe != null && Ye((I) => Ft(I, fe));
      return;
    }
    if (!Ie && o.key.toLowerCase() === "a") {
      we(o), Ye(
        (I) => ni(I, Y)
      );
      return;
    }
    if (W || P || Ie) return;
    if (o.key === "Enter" && fe != null) {
      we(o), L === "tag" ? window.open(`/tag/${fe}`, "_blank", "noopener,noreferrer") : Qe(!0);
      return;
    }
    const f = Pn(), h = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -f : o.key === "ArrowDown" ? f : 0;
    h && (we(o), Qt(h));
  }
  function xt(o) {
    vt(o), Jr(o);
  }
  function $n() {
    Oe.current = !0, Le({}), xt("");
  }
  async function kr(o) {
    if (!s) return !1;
    const l = o.map(Bi);
    try {
      await di(s, l);
    } catch (h) {
      throw h;
    }
    r(l), ne && !l.some((h) => h.id === ne) && xt("");
    const f = l.find((h) => h.id === ne);
    return f && X && JSON.stringify(f) !== JSON.stringify(X) && (f.view.displayMode !== X.view.displayMode && Gt(Vr(f)), f.entityType !== "performerOccurrence" && De(f) !== De(X) && (Me(null), _t(
      f,
      be({ ...f.view.filter, page: M.page })
    ))), !0;
  }
  if (a)
    return /* @__PURE__ */ n(zr, { label: "Loading reviews…" });
  if (y)
    return /* @__PURE__ */ d(Ee, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void to().catch(
            (o) => p(
              "Could not export browser reviews. " + (o instanceof Error ? o.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        Wr,
        {
          message: y,
          onRetry: () => void Rr()
        }
      )
    ] });
  return /* @__PURE__ */ d("div", { className: "data-quality-page", onKeyDown: Mn, children: [
    /* @__PURE__ */ d("header", { className: "data-quality-header", children: [
      N && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: W,
          onClick: $n,
          children: /* @__PURE__ */ n(tn, {})
        }
      ),
      /* @__PURE__ */ d("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (N == null ? void 0 : N.name) ?? "Data Quality" }),
        (N == null ? void 0 : N.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: N.description })
      ] }),
      N && X && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: W || P || !J,
          onClick: () => {
            Pe(!0), Ne(!0);
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
          disabled: W || P || !J,
          onClick: () => {
            Pe(!1), Ne(!0);
          },
          children: /* @__PURE__ */ n(Wn, {})
        }
      )
    ] }),
    m && /* @__PURE__ */ n("p", { className: "dq-status", children: m }),
    K && (ee == null ? void 0 : ee.kind) === "missing" && /* @__PURE__ */ d("div", { role: "status", className: "dq-status", children: [
      ee.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: kt,
          onClick: () => {
            qt(!0), It(""), bi().then($t).catch(
              (o) => It(
                "Could not create the Confirmed absent tags custom field. " + (o instanceof Error ? o.message : "Request failed.")
              )
            ).finally(() => qt(!1));
          },
          children: kt ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    K && ((ee == null ? void 0 : ee.kind) === "incompatible" || vr) && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(rr, {}),
      vr || (ee == null ? void 0 : ee.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: kt,
          onClick: () => {
            qt(!0), $t().finally(
              () => qt(!1)
            );
          },
          children: kt ? "Checking…" : "Check again"
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
            const o = localStorage.getItem("page-videos") ?? "[]", l = URL.createObjectURL(
              new Blob([o], { type: "application/json" })
            ), f = document.createElement("a");
            f.href = l, f.download = "data-quality-unassigned-legacy-reviews.json", f.click(), URL.revokeObjectURL(l);
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
            H(""), ce(!1);
          },
          children: te ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    N && X && N.entityType !== "performerOccurrence" && /* @__PURE__ */ d("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${W || P ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": W || P || void 0,
          inert: W || P ? !0 : void 0,
          onClickCapture: (o) => {
            var f, h, I, R, U;
            const l = o.target instanceof Element ? o.target.closest("button") : null;
            (l == null ? void 0 : l.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((f = l == null ? void 0 : l.textContent) == null ? void 0 : f.trim()) === "Clear all" ? Be.current = !0 : ((h = l == null ? void 0 : l.getAttribute("aria-label")) != null && h.startsWith("Filters") || (I = l == null ? void 0 : l.getAttribute("aria-label")) != null && I.startsWith("Edit filter:") || ((R = l == null ? void 0 : l.textContent) == null ? void 0 : R.trim()) === "Cancel" || (U = l == null ? void 0 : l.getAttribute("aria-label")) != null && U.startsWith("Close ")) && (Be.current = !1);
          },
          onKeyDownCapture: (o) => {
            var f, h;
            const l = o.target instanceof Element ? o.target.closest("button") : null;
            (o.key === "Delete" || o.key === "Backspace") && (l == null ? void 0 : l.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (o.preventDefault(), o.stopPropagation(), Be.current = !0, (h = (f = l.parentElement) == null ? void 0 : f.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || h.click()) : o.key === "Escape" && (Be.current = !1);
          },
          children: /* @__PURE__ */ n(
            Gn,
            {
              filter: he ? ge : M,
              onFilterChange: xn,
              totalCount: V.totalCount,
              sortOptions: L === "tag" ? Yr : Zr,
              showSearch: !0,
              showSort: !0,
              displayMode: Ge,
              onDisplayModeChange: (o) => Gt(Br(o, L)),
              availableDisplayModes: L === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (Nt - 225) / 50,
              onZoomChange: (o) => br(Math.round(225 + o * 50)),
              cardSizeEntityType: L === "tag" ? "tags" : "videos",
              criteriaDefinitions: kn,
              objectFilter: zt,
              onObjectFilterChange: (o) => {
                if (!W && !P) {
                  const l = L === "video" ? xi(o) : o;
                  k.current = L === "video" ? _i(
                    N.view.objectFilter,
                    l,
                    Be.current
                  ) : l, Be.current = !1;
                }
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (oe == null ? void 0 : oe.id) === ne && /* @__PURE__ */ d("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: W || P || !J,
            onClick: Ln,
            children: /* @__PURE__ */ n(Qn, {})
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Reset to default review filters",
            title: "Reset to default review filters",
            disabled: W || P,
            onClick: _n,
            children: /* @__PURE__ */ n(Hn, {})
          }
        )
      ] })
    ] }),
    N ? N.entityType === "performerOccurrence" ? /* @__PURE__ */ n(Ti, { review: N, storageKey: s, canWrite: g, onBusy: At }, N.id) : /* @__PURE__ */ d(Ee, { children: [
      L === "video" && $.error && /* @__PURE__ */ n("p", { role: "alert", children: $.error }),
      K && /* @__PURE__ */ n(
        ki,
        {
          videos: V.items,
          review: K,
          trees: $.ids,
          disabled: W || P,
          onChoose: (o) => {
            const l = qi(K, o);
            Me(l), _t(l, { ...M, page: 1 });
          }
        }
      ),
      Bt && !Ie && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(rr, {}),
        Bt
      ] }),
      Rt && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: Rt }),
      qr("top"),
      /* @__PURE__ */ d(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${He}px`
          },
          children: [
            /* @__PURE__ */ d("main", { children: [
              P && !V.items.length && /* @__PURE__ */ n(zr, { label: "Loading review queue…" }),
              he && !P && /* @__PURE__ */ n(
                Wr,
                {
                  message: he,
                  onRetry: () => void Je(
                    N,
                    M,
                    Te
                  ).catch(() => {
                  })
                }
              ),
              !W && !P && !he && !V.items.length && /* @__PURE__ */ d("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(nr, {}),
                /* @__PURE__ */ d("p", { children: [
                  "No ",
                  L,
                  "s match this review."
                ] })
              ] }),
              !!V.items.length && /* @__PURE__ */ n("div", { ref: Ar, children: /* @__PURE__ */ n(
                "div",
                {
                  className: Ge === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${Nt}px`
                  },
                  children: V.items.map(Dn)
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
                "aria-valuemin": cr,
                "aria-valuemax": dr,
                "aria-valuenow": He,
                "aria-valuetext": `${He} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (o) => {
                  Ot.current = {
                    pointerId: o.pointerId,
                    startX: o.clientX,
                    startWidth: He
                  }, o.currentTarget.setPointerCapture(o.pointerId);
                },
                onPointerMove: (o) => {
                  const l = Ot.current;
                  (l == null ? void 0 : l.pointerId) === o.pointerId && o.currentTarget.hasPointerCapture(o.pointerId) && Jt(
                    l.startWidth + l.startX - o.clientX
                  );
                },
                onPointerUp: () => {
                  Ot.current = null;
                },
                onPointerCancel: () => {
                  Ot.current = null;
                },
                onKeyDown: In,
                onDoubleClick: () => Jt(mr),
                children: /* @__PURE__ */ n("span", {})
              }
            ),
            /* @__PURE__ */ d("aside", { className: "dq-actions", children: [
              Re.size > 0 && /* @__PURE__ */ n("strong", { children: Ir }),
              N.actions.map((o, l) => {
                const f = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", h = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, I = h != null ? F.find((U) => U.id === h) : void 0, R = h != null && !I;
                return /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    disabled: W || P || !!he || f && !Ue || "effect" in o && f && (!C || R) || Ut(o) && (ee == null ? void 0 : ee.kind) !== "ready" || !On.length,
                    onClick: () => void Ht(o),
                    children: [
                      /* @__PURE__ */ d("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: o.label }),
                        "effect" in o ? /* @__PURE__ */ n("small", { children: o.effect.mode === "SKIP" ? "Skip" : o.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : I ? `Assign ${I.name}` : "Unavailable tag group" }) : o.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: o.steps.flatMap(
                          (U, ie) => U.tagIds.map((de, qe) => {
                            const ye = Cr[de] === void 0 ? "Tag" : Cr[de] ?? "Unavailable tag", Ze = Nn(U, ye), ut = Ki(U, ye);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": Cn(U.mode),
                                "aria-label": ut,
                                title: `Step ${ie + 1}: ${ut}`,
                                children: Ze
                              },
                              `${ie}-${de}-${qe}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      ht(o, l) && /* @__PURE__ */ n("kbd", { children: ht(o, l) })
                    ]
                  },
                  o.id
                );
              }),
              !N.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              !Ue && /* @__PURE__ */ d("p", { children: [
                L === "tag" ? "Tag" : "Video",
                " write permission is required to apply actions."
              ] }),
              L === "tag" && T && /* @__PURE__ */ d("p", { children: [
                "Tag groups are unavailable. ",
                T
              ] }),
              W && /* @__PURE__ */ d("p", { role: "status", children: [
                /* @__PURE__ */ n(on, { className: "dq-spin" }),
                " Applying action to",
                " ",
                Rn,
                "…"
              ] }),
              /* @__PURE__ */ d("p", { className: "dq-shortcuts", children: [
                "←→↑↓ move · space select · enter ",
                L === "tag" ? "open" : "preview",
                " · 1–9 apply · A toggle shown · Esc clear"
              ] })
            ] })
          ]
        }
      ),
      qr("bottom")
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
                  ref: St,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ n("p", { children: "Choose a review to open its queue." }),
              /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                (o) => _e[o.id] !== void 0
              ) ? t.some((o) => _e[o.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ d("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ d("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ d(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: Fe,
                    onChange: (o) => st(
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
                  "aria-label": Ce === "asc" ? "Ascending" : "Descending",
                  title: Ce === "asc" ? "Ascending" : "Descending",
                  onClick: () => j(
                    (o) => o === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    nn,
                    {
                      className: Ce === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: v.map((o) => {
            const l = _e[o.id], f = ve(o), h = f === "tag" ? "tag" : f === "performerOccurrence" ? "scene" : "video";
            return /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                disabled: W,
                onClick: () => xt(o.id),
                children: [
                  /* @__PURE__ */ d("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ d("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(wn, { entityType: f }),
                      /* @__PURE__ */ n("strong", { children: o.name })
                    ] }),
                    /* @__PURE__ */ n(
                      "span",
                      {
                        className: "dq-review-count",
                        "aria-label": l === void 0 ? `Counting matching ${h}s` : l === null ? `Matching ${h} count unavailable` : `${l.toLocaleString()} matching ${l === 1 ? h : `${h}s`}`,
                        children: l === void 0 ? "…" : l === null ? "—" : l.toLocaleString()
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
      /* @__PURE__ */ n(nr, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    Ie && ze && K && /* @__PURE__ */ n(
      Qi,
      {
        video: ze,
        review: K,
        targetLabel: Ir,
        pending: W,
        refreshing: P || !!he,
        error: Bt,
        canWrite: b,
        assessmentReady: (ee == null ? void 0 : ee.kind) === "ready",
        selected: Re.has(ze.id),
        hasPrevious: Y.indexOf(ze.id) > 0,
        hasNext: Y.indexOf(ze.id) >= 0 && Y.indexOf(ze.id) < Y.length - 1,
        onToggleSelected: () => Ye((o) => Ft(o, ze.id)),
        onPrevious: () => Qt(-1),
        onNext: () => Qt(1),
        onClose: () => {
          Qe(!1), ae(Se.current);
        },
        onAction: Ht
      }
    ),
    at && /* @__PURE__ */ n(
      Hi,
      {
        reviews: t,
        activeReview: X,
        tagGroups: F,
        initialEdit: Ae,
        onSave: kr,
        onChoose: xt,
        onClose: () => {
          Ne(!1), Ae && ae(Se.current, !1);
        }
      }
    )
  ] });
  async function _t(o, l, f = !1) {
    const h = Se.current, I = Math.max(0, Y.indexOf(h ?? -1));
    try {
      const U = (await Je(o, l, f)).items.map((de) => de.id);
      $e(
        (de) => new Set([...de].filter((qe) => U.includes(qe)))
      );
      const ie = _r(U, h, I);
      me(ie), ke.current || ae(ie, !1);
    } catch {
    }
  }
  function xn(o) {
    const l = k.current;
    if (k.current = null, W || P || !N || !X) return;
    const f = l ?? N.view.objectFilter, h = lr(
      f,
      X.view.objectFilter
    ) ? X.view.objectFilter : f, I = be({ ...o, page: 1 }), R = {
      ...N,
      view: {
        ...N.view,
        filter: I,
        objectFilter: h
      }
    }, U = De(R) !== De(X), ie = U ? R : X;
    Me(U ? R : null), Ve(U ? "" : "Review queue defaults restored."), _t(ie, I, !0);
  }
  function _n() {
    if (W || P || !X) return;
    k.current = null;
    const o = be({
      ...X.view.filter,
      page: 1
    });
    Me(null), Ve("Review queue defaults restored."), _t(
      X,
      o,
      X.view.startFrom !== "beginning"
    );
  }
  function Ln() {
    W || P || !N || !X || !J || kr(
      t.map(
        (o) => o.id === ne ? {
          ...o,
          view: {
            ...N.view,
            filter: { ...M, page: 1 }
          }
        } : o
      )
    ).then(() => {
      Me(null), Ve("Queue saved to this review.");
    }).catch(
      (o) => ct(
        o instanceof Error ? o.message : "Could not save queue."
      )
    );
  }
  function Fn() {
    $e(/* @__PURE__ */ new Set()), Ke.current.clear(), me(null);
  }
  function qr(o) {
    return N ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: W || P,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          Vn,
          {
            filter: {
              ...M,
              page: Number(M.page) || 1,
              perPage: Number(M.perPage) || 40
            },
            totalCount: V.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${o}`,
            onFilterChange: (l) => {
              W || P || l.page === Number(M.page) || Vi(
                { ...M, page: l.page },
                N,
                Je,
                Fn
              );
            }
          }
        )
      }
    ) : null;
  }
  function Dn(o) {
    if (L === "tag") {
      const f = o;
      return /* @__PURE__ */ n(
        Ji,
        {
          tag: f,
          displayMode: Ge === "list" ? "list" : "grid",
          focused: f.id === fe,
          selected: Re.has(f.id),
          setRef: (h) => {
            h ? dt.current.set(f.id, h) : dt.current.delete(f.id);
          },
          onFocus: () => me(f.id),
          onToggle: () => Ye((h) => Ft(h, f.id)),
          onOpen: () => window.open(`/tag/${f.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        f.id
      );
    }
    const l = o;
    return /* @__PURE__ */ n(
      zi,
      {
        video: Ii(l, K, $.ids),
        displayMode: Ge,
        focused: l.id === fe,
        selected: Re.has(l.id),
        setRef: (f) => {
          f ? dt.current.set(l.id, f) : dt.current.delete(l.id);
        },
        onFocus: () => me(l.id),
        onToggle: () => Ye((f) => Ft(f, l.id)),
        onPreview: () => {
          me(l.id), Qe(!0);
        },
        onNavigate: e
      },
      l.id
    );
  }
}
function Vi(e, t, r, i) {
  i(), r(t, e).catch(() => {
  });
}
function Ft(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Bi(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Ji({
  tag: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: s,
  onFocus: c,
  onToggle: a,
  onOpen: u,
  onNavigate: y
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
        Bn,
        {
          tag: e,
          selected: i,
          onSelect: a,
          onClick: u,
          onNavigate: y
        }
      ) : /* @__PURE__ */ d("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "aria-label": i ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": i,
            onClick: (p) => {
              p.stopPropagation(), a();
            },
            children: i ? "✓" : ""
          }
        ),
        /* @__PURE__ */ n("button", { type: "button", className: "dq-tag-list-name", onClick: u, children: e.name }),
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
function zi({
  video: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: s,
  onFocus: c,
  onToggle: a,
  onPreview: u,
  onNavigate: y
}) {
  const p = vn(e), b = D(null), w = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, g = !!(w.date || w.studioName), S = !!(w.performers.length || w.tags.length);
  return Qr(() => {
    const C = b.current;
    if (!C) return;
    const q = C.querySelector(
      `a[href="/video/${e.id}"]`
    ), F = C.querySelector(".card-title"), B = `dq-card-title-${e.id}`;
    F && (F.id = B), q && (q.target = "_blank", q.rel = "noreferrer", q.removeAttribute("aria-label"), q.setAttribute("aria-labelledby", B), q.classList.add("dq-card-link"));
    const T = C.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    T && T.setAttribute(
      "aria-label",
      i ? `Deselect ${p}` : `Select ${p}`
    );
    const Q = C.querySelector(
      'button[title="Quick View"]'
    );
    Q && Q.setAttribute("aria-label", `Preview ${p}`);
  }), /* @__PURE__ */ d(
    "article",
    {
      ref: (C) => {
        b.current = C, s(C);
      },
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${p}${i ? ", selected" : ""}`,
      onFocus: c,
      onClick: (C) => {
        c(), C.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${t} ${g ? "has-card-metadata" : "no-card-metadata"} ${S ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          Jn,
          {
            video: w,
            selected: i,
            onSelect: a,
            onNavigate: y,
            onQuickView: u,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t === "wall" && /* @__PURE__ */ n(Wi, { video: e })
      ]
    }
  );
}
function Wi({ video: e }) {
  const t = D(null), r = D(null), [i, s] = E(!1), [c, a] = E(!1), [u, y] = E(!1);
  return re(() => {
    const p = t.current;
    if (!p || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      s(!0), a(!0);
      return;
    }
    const b = new IntersectionObserver(
      ([g]) => s(g.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), w = new IntersectionObserver(
      ([g]) => a(g.isIntersecting && g.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return b.observe(p), w.observe(p), () => {
      b.disconnect(), w.disconnect();
    };
  }, [e.id, e.files.length]), re(() => {
    if (!i) {
      y(!1);
      return;
    }
    const p = new AbortController();
    return x(hi(e.id), {
      signal: p.signal
    }).then((b) => {
      p.signal.aborted || y(b.available === !0);
    }).catch(() => {
      p.signal.aborted || y(!1);
    }), () => p.abort();
  }, [i, e.id]), re(() => {
    const p = r.current;
    p && (c ? Promise.resolve(p.play()).catch(() => {
    }) : p.pause());
  }, [u, c]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: u && /* @__PURE__ */ n(
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
function Qi({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: s,
  error: c,
  canWrite: a,
  assessmentReady: u,
  selected: y,
  hasPrevious: p,
  hasNext: b,
  onToggleSelected: w,
  onPrevious: g,
  onNext: S,
  onClose: C,
  onAction: q
}) {
  const F = D(null), B = D(null), T = e.files[0], Q = vn(e);
  re(() => {
    var O;
    const m = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (O = F.current) == null || O.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = m;
    };
  }, []);
  function J(m) {
    var H, te, ce;
    if (m.key !== "Tab") return;
    const O = [
      ...((H = F.current) == null ? void 0 : H.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((pe) => pe.offsetParent !== null);
    if (!O.length) {
      m.preventDefault(), (te = F.current) == null || te.focus();
      return;
    }
    const _ = O.indexOf(
      document.activeElement
    );
    m.shiftKey && _ <= 0 ? (m.preventDefault(), (ce = O.at(-1)) == null || ce.focus()) : !m.shiftKey && _ === O.length - 1 && (m.preventDefault(), O[0].focus());
  }
  function A(m) {
    if (m.defaultPrevented || m.ctrlKey || m.metaKey || m.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const O = m.key === "ArrowLeft" || m.key === "ArrowRight";
    if (m.altKey && !O) return;
    const _ = B.current, H = m.currentTarget.querySelector("video");
    if (m.key === "Enter" || m.key === "Escape")
      m.repeat || C();
    else if (m.key === " " && _)
      m.repeat || _.toggle();
    else if (O && _)
      _.seekBy(
        (m.key === "ArrowLeft" ? -1 : 1) * (m.shiftKey ? 5 : m.altKey ? 10 : 60)
      );
    else if ((m.key === "," || m.key === ".") && _) {
      const te = [T == null ? void 0 : T.duration, H == null ? void 0 : H.duration].find(
        (pe) => pe != null && Number.isFinite(pe) && pe > 0
      ) ?? 0, ce = e.parentVideoId != null ? (e.clipEndSec ?? te) - (e.clipStartSec ?? 0) : te;
      Number.isFinite(ce) && ce > 0 && _.seekBy((m.key === "," ? -1 : 1) * ce * 0.1);
    } else if (m.key.toLowerCase() === "n" || m.key.toLowerCase() === "m")
      !m.repeat && !i && !s && (m.key.toLowerCase() === "n" && p && g(), m.key.toLowerCase() === "m" && b && S());
    else if (m.key === "ArrowUp" && H)
      H.volume = Math.min(1, H.volume + 0.1);
    else if (m.key === "ArrowDown" && H)
      H.volume = Math.max(0, H.volume - 0.1);
    else return;
    we(m);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: F,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${Q}`,
      className: "dq-preview",
      onKeyDown: J,
      onKeyDownCapture: A,
      onMouseDown: (m) => {
        m.target === m.currentTarget && C();
      },
      children: /* @__PURE__ */ d("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ d("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !p || i || s,
              onClick: g,
              children: /* @__PURE__ */ n(tn, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !b || i || s,
              onClick: S,
              children: /* @__PURE__ */ n(nn, {})
            }
          ),
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ n("h2", { children: Q }),
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
              onClick: w,
              disabled: s,
              children: y ? "Selected" : "Select"
            }
          ),
          /* @__PURE__ */ n(
            "a",
            {
              href: `/video/${e.id}`,
              target: "_blank",
              rel: "noreferrer",
              className: "dq-details-link",
              "aria-label": `Open ${Q} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ n(Yn, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: C,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(sn, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: T ? /* @__PURE__ */ n(
          Hr,
          {
            autostart: !0,
            streamUrl: mn(e.id),
            posterUrl: jr(e),
            format: T.format,
            audioCodec: T.audioCodec,
            duration: T.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (m) => (B.current = m, () => {
              B.current === m && (B.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: jr(e), alt: "" }) }),
        c && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: c }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((m, O) => /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            disabled: i || s || m.steps.length > 0 && !a || Ut(m) && !u,
            onClick: () => void q(m),
            children: [
              ht(m, O) && /* @__PURE__ */ n("kbd", { children: ht(m, O) }),
              m.label
            ]
          },
          m.id
        )) })
      ] })
    }
  );
}
function Hi({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: i = !1,
  onSave: s,
  onChoose: c,
  onClose: a
}) {
  const [u, y] = E(
    () => i && t ? structuredClone(t) : null
  ), [p, b] = E(""), [w, g] = E(!1), [S, C] = E(
    i && t != null
  ), q = D(null);
  re(() => {
    var O, _;
    const A = document.activeElement, m = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (_ = (O = q.current) == null ? void 0 : O.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || _.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = m, A == null || A.focus({ preventScroll: !0 });
    };
  }, []);
  function F(A) {
    var _, H, te;
    if (A.defaultPrevented) {
      A.stopPropagation();
      return;
    }
    if (A.key === "Escape") {
      we(A), w || a();
      return;
    }
    if (A.key !== "Tab") {
      A.stopPropagation();
      return;
    }
    const m = [
      ...((_ = q.current) == null ? void 0 : _.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ce) => ce.offsetParent !== null);
    if (!m.length) {
      we(A), (H = q.current) == null || H.focus();
      return;
    }
    const O = m.indexOf(
      document.activeElement
    );
    A.shiftKey && O <= 0 ? (we(A), (te = m.at(-1)) == null || te.focus()) : !A.shiftKey && O === m.length - 1 ? (we(A), m[0].focus()) : A.stopPropagation();
  }
  function B(A, m = !!A) {
    C(m), y(
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
    ), b("");
  }
  async function T() {
    if (w) return;
    if (!u || ir(u)) {
      b(u ? ir(u) : "Choose a review.");
      return;
    }
    const A = { ...u, name: u.name.trim() }, m = e.some((O) => O.id === A.id) ? e.map((O) => O.id === A.id ? A : O) : [...e, A];
    g(!0), b("");
    try {
      if (!await s(m)) throw new Error("Could not save reviews.");
      c(A.id), a();
    } catch (O) {
      b(
        "Could not save reviews. Your edits are still open. " + (O instanceof Error ? O.message : "Retry saving.")
      );
    } finally {
      g(!1);
    }
  }
  async function Q(A) {
    if (!w) {
      g(!0), b("");
      try {
        if (!await s(A)) throw new Error("Could not save reviews.");
      } catch (m) {
        b(
          m instanceof Error ? m.message : "Could not save reviews."
        );
      } finally {
        g(!1);
      }
    }
  }
  async function J(A) {
    var O;
    if (w) return;
    const m = (O = A.target.files) == null ? void 0 : O[0];
    if (A.target.value = "", !!m) {
      if (m.size > 2e6) {
        b("Review files must be smaller than 2 MB.");
        return;
      }
      g(!0), b("");
      try {
        const _ = yt(await m.text());
        if (!await s(or(e, _)))
          throw new Error("Could not save reviews.");
      } catch (_) {
        b(
          _ instanceof Error ? _.message : "Could not import reviews."
        );
      } finally {
        g(!1);
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
      onKeyDown: F,
      children: /* @__PURE__ */ d("div", { className: "dq-manager", children: [
        /* @__PURE__ */ d("header", { children: [
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ n("h2", { children: u ? e.some((A) => A.id === u.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: w,
              onClick: a,
              children: /* @__PURE__ */ n(sn, {})
            }
          )
        ] }),
        p && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: p }),
        /* @__PURE__ */ n("fieldset", { disabled: w, className: "dq-manager-content", children: u ? /* @__PURE__ */ n(
          Xi,
          {
            draft: u,
            entityTypeLocked: S,
            tagGroups: r,
            saving: w,
            setDraft: y,
            onSave: () => void T(),
            onCancel: a
          }
        ) : /* @__PURE__ */ d(Ee, { children: [
          /* @__PURE__ */ d("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ d(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => B(),
                children: [
                  /* @__PURE__ */ n(Zn, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ d("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(ei, {}),
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
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((A) => /* @__PURE__ */ d("article", { children: [
            /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ d("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(wn, { entityType: ve(A) }),
                /* @__PURE__ */ n("strong", { children: A.name })
              ] }),
              /* @__PURE__ */ n("p", { children: A.description || "No description" })
            ] }),
            /* @__PURE__ */ d("button", { type: "button", onClick: () => B(A), children: [
              /* @__PURE__ */ n(rn, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => B({
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
                  window.confirm(`Delete review “${A.name}”?`) && Q(
                    e.filter((m) => m.id !== A.id)
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
function Xi({
  draft: e,
  entityTypeLocked: t,
  tagGroups: r,
  saving: i = !1,
  setDraft: s,
  onSave: c,
  onCancel: a
}) {
  const [u, y] = E("Review"), p = ve(e), b = (S) => {
    if (!(t || S === p)) {
      if (S === "performerOccurrence") {
        s({
          id: e.id,
          entityType: S,
          name: e.name,
          description: e.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "beginning" },
          actions: [],
          occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: !0 }
        });
        return;
      }
      s(
        S === "tag" ? {
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
  }, w = D(/* @__PURE__ */ new WeakMap()), g = (S) => {
    let C = w.current.get(S);
    return C || (C = crypto.randomUUID(), w.current.set(S, C)), C;
  };
  return /* @__PURE__ */ d("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      zn,
      {
        tabs: (p === "performerOccurrence" ? ["Review", "Queue", "Tag choices"] : ["Review", "Queue", "Appearance", "Actions"]).map((S) => ({
          key: S,
          label: S,
          count: S === "Actions" ? e.actions.length : void 0,
          disabled: i
        })),
        activeTab: u,
        onTabChange: y
      }
    ) }),
    /* @__PURE__ */ d("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ d("section", { hidden: u !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ d("label", { children: [
          "Entity type",
          /* @__PURE__ */ d(
            "select",
            {
              "aria-label": "Entity type",
              value: p,
              disabled: t,
              onChange: (S) => b(S.target.value),
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
              onChange: (S) => s({ ...e, name: S.target.value })
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
              onChange: (S) => s({ ...e, description: S.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ d("section", { hidden: u !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ n(Gr, { draft: e, onChange: s, presentation: !1 }),
        e.entityType === "performerOccurrence" && /* @__PURE__ */ n(Kr, { review: e, onChange: s })
      ] }),
      e.entityType === "performerOccurrence" && /* @__PURE__ */ n("section", { hidden: u !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n(Kr, { review: e, onChange: s, choices: !0 }) }),
      /* @__PURE__ */ n("section", { hidden: u !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(Gr, { draft: e, onChange: s, queue: !1 }) }),
      /* @__PURE__ */ n("section", { hidden: u !== "Actions", className: "dq-editor-section", children: p === "tag" ? /* @__PURE__ */ n(
        Zi,
        {
          draft: e,
          saving: i,
          tagGroups: r,
          setDraft: s
        }
      ) : /* @__PURE__ */ n(
        Yi,
        {
          draft: e,
          saving: i,
          stepKey: g,
          rememberStepKey: (S, C) => w.current.set(S, g(C)),
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
            const S = URL.createObjectURL(
              new Blob([JSON.stringify([e], null, 2)], {
                type: "application/json"
              })
            ), C = document.createElement("a");
            C.href = S, C.download = "data-quality-review.json", C.click(), URL.revokeObjectURL(S);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: a, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: c, children: "Save review" })
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
function Yi({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: i,
  setDraft: s
}) {
  const c = (a, u) => s({
    ...e,
    actions: e.actions.map(
      (y, p) => p === a ? u : y
    )
  });
  return /* @__PURE__ */ d(Ee, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      tr,
      {
        items: e.actions,
        getKey: (a) => a.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (a) => s({ ...e, actions: a }),
        renderItem: (a, { index: u, dragHandleProps: y, isOver: p }) => /* @__PURE__ */ d(
          "fieldset",
          {
            className: p ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ d("legend", { children: [
                "Action ",
                u + 1
              ] }),
              /* @__PURE__ */ d("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...y,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${u + 1}`,
                    children: /* @__PURE__ */ n(ur, {})
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
                        ...e.actions.slice(0, u + 1),
                        {
                          ...structuredClone(a),
                          id: crypto.randomUUID(),
                          label: a.label + " copy",
                          shortcut: ""
                        },
                        ...e.actions.slice(u + 1)
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
                  index: u,
                  onChange: (b) => c(u, b)
                }
              ),
              /* @__PURE__ */ n(
                tr,
                {
                  items: a.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (b) => c(u, { ...a, steps: b }),
                  renderItem: (b, w) => /* @__PURE__ */ n(
                    eo,
                    {
                      dragHandleProps: w.dragHandleProps,
                      saving: t,
                      isOver: w.isOver,
                      step: b,
                      index: w.index,
                      onChange: (g) => {
                        i(g, b), c(u, {
                          ...a,
                          steps: a.steps.map(
                            (S, C) => C === w.index ? g : S
                          )
                        });
                      },
                      onRemove: () => c(u, {
                        ...a,
                        steps: a.steps.filter(
                          (g, S) => S !== w.index
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
                    onClick: () => c(u, {
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
                        (b, w) => w !== u
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
function Zi({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: i
}) {
  const s = (c, a) => i({
    ...e,
    actions: e.actions.map(
      (u, y) => y === c ? a : u
    )
  });
  return /* @__PURE__ */ d(Ee, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      tr,
      {
        items: e.actions,
        getKey: (c) => c.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (c) => i({ ...e, actions: c }),
        renderItem: (c, { index: a, dragHandleProps: u, isOver: y }) => /* @__PURE__ */ d(
          "fieldset",
          {
            className: y ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ d("legend", { children: [
                "Action ",
                a + 1
              ] }),
              /* @__PURE__ */ d("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...u,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${a + 1}`,
                    children: /* @__PURE__ */ n(ur, {})
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
                An,
                {
                  action: c,
                  index: a,
                  onChange: (p) => s(a, p)
                }
              ),
              /* @__PURE__ */ d("label", { children: [
                "Action effect",
                /* @__PURE__ */ d(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: c.effect.mode === "SET_TAG_GROUP" ? `group:${c.effect.tagGroupId}` : c.effect.mode,
                    onChange: (p) => {
                      const b = p.target.value;
                      s(a, {
                        ...c,
                        effect: b === "SKIP" ? { mode: "SKIP" } : b === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : {
                          mode: "SET_TAG_GROUP",
                          tagGroupId: Number(b.slice(6))
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
                      (p, b) => b !== a
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
function eo({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: i,
  isOver: s,
  onChange: c,
  onRemove: a
}) {
  const u = Cn(e.mode);
  return /* @__PURE__ */ d(
    "div",
    {
      className: s ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": u,
      children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            ...r,
            disabled: i,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${t + 1}`,
            children: /* @__PURE__ */ n(ur, {})
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
            onChange: (y) => c({ ...e, mode: y.target.value }),
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
          nt,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (y) => c({ ...e, tagIds: y }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: a, children: /* @__PURE__ */ n(an, {}) })
      ]
    }
  );
}
async function to() {
  const e = await x("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
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
function zr({ label: e }) {
  return /* @__PURE__ */ d("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(on, { className: "dq-spin" }),
    e
  ] });
}
function Wr({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ d("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(rr, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const ao = { components: { DataQualityPage: Gi } };
export {
  Gi as DataQualityPage,
  ao as default,
  lr as objectFiltersEqual
};
