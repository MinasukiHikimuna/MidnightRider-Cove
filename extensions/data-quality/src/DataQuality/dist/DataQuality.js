import { jsxs as u, jsx as n, Fragment as Ae } from "react/jsx-runtime";
import { useRef as F, useState as N, useEffect as V, useMemo as yt, useCallback as tt, useLayoutEffect as fn } from "react";
import { DetailListToolbar as ur, VIDEO_SORT_OPTIONS as Nr, VIDEO_CRITERIA as Bt, EntityReferenceMultiSelector as Ue, PERFORMER_CRITERIA as Jr, FilterDialog as pn, VideoPlayer as gn, DetailListPagination as mn, TAG_SORT_OPTIONS as hn, TAG_CRITERIA as yn, TagTile as li, VideoCard as di, EntityDetailTabs as ui, SortableList as fr } from "@cove/runtime/components";
import { ChevronLeft as bn, Pencil as wn, Settings as fi, AlertTriangle as pr, Save as pi, RotateCcw as gi, ChevronRight as vn, Film as gr, Loader2 as Sn, Tags as mi, ExternalLink as hi, X as En, Plus as yi, Upload as bi, Trash2 as Cn, GripVertical as Ar } from "@cove/runtime/lucide-react";
import { extensionFetch as wi } from "@cove/runtime/api";
function Ne(e) {
  return e.entityType ?? "video";
}
function rt(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function mr(e) {
  if (e.entityType === "performerOccurrence") {
    if (!An(e.occurrence))
      return "Complete the optional occurrence condition before saving.";
    if (e.actions.some((r) => r.steps.some((i) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(i.mode))))
      return "Occurrence actions support adding and removing tags on the active performer. Video tag assessments are not supported here.";
  }
  if (Ne(e) === "video" && e.actions.some(
    (r) => Nn(r)
  ))
    return "An action cannot contain contradictory assessments for the same tag.";
  if (!e.name.trim() || !e.actions.every((r) => wt(r, Ne(e))))
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
function Qr(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function mt(e) {
  const { page: t, ...r } = e.view.filter, i = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    e.entityType === "performerOccurrence" ? ["performerOccurrence", ...i, e.occurrence] : Ne(e) === "tag" ? ["tag", ...i] : i
  );
}
function wt(e, t) {
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
  ) && !Nn(e) : !1;
}
function Jt(e) {
  return "steps" in e ? e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  ) : !1;
}
function Nn(e) {
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
function Rt(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || r.entityType === "video" || r.entityType === "tag" || r.entityType === "performerOccurrence") && (r.entityType !== "performerOccurrence" || An(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && vi(r.presentation, r.entityType === "tag") && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (r.entityType === "tag" ? "effect" in i && !("steps" in i) && wt(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (s) => s && Array.isArray(s.tagIds)
      ) && wt(i, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => mr(r)))
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
    (i) => i === void 0 || Array.isArray(i) && i.every((s) => Number.isSafeInteger(s) && s > 0)
  );
}
function hr(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const s of i)
      r.has(s.id) || (r.add(s.id), t.push(s));
  return t;
}
function An(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (i) => Array.isArray(i) && i.every((s) => Number.isSafeInteger(s) && s > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && (t.targetMode !== "selected" || t.performerIds.length > 0) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && ["any", "includes", "includesAll", "excludes", "isNull"].includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && r(t.tagIds) && typeof t.multiple == "boolean";
}
function Wr(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function zr(e, t, r, i) {
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
function Si(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((s) => r.has(s));
  for (const s of t)
    i ? r.delete(s) : r.add(s);
  return r;
}
function Tn(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const Rn = "ext:com.midnightrider.data-quality:configuration", Ei = "ext:cove-data-quality:video-reviews", yr = "ext:com.midnightrider.data-quality:progress", It = /* @__PURE__ */ new Map(), Kt = /* @__PURE__ */ new Map(), ht = (e, t) => e.includes("*") || e.includes(t), Qt = (e) => x(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Ci = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function br(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function bt(e) {
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
    reviews: Rt(JSON.stringify(t.reviews)),
    deletedIds: br(t.deletedIds),
    importedIds: br(t.importedIds)
  };
}
function Ni(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const s of t) {
    const c = localStorage.getItem(s);
    if (c !== null) {
      const a = Rt(c);
      r ?? (r = a), a.forEach((f) => i.add(f.id));
    }
    br(
      JSON.parse(localStorage.getItem(`${s}:account-imports`) ?? "[]")
    ).forEach((a) => i.add(a));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function In(e) {
  const t = await x("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function qn(e, t) {
  const r = (Kt.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Kt.set(e, r), r.finally(() => {
    Kt.get(e) === r && Kt.delete(e);
  }).catch(() => {
  }), r;
}
let At = null;
function Ai() {
  if (At) return At;
  const e = Ti();
  return At = e, e.finally(() => {
    At === e && (At = null);
  }).catch(() => {
  }), e;
}
async function Ti() {
  var b;
  const e = await x("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = ht(e.permissions, "savedfilters.read"), s = i && ht(e.permissions, "savedfilters.write"), c = i ? (await Qt(Rn)).filter((A) => A.name === "Data Quality configuration").sort((A, h) => A.id - h.id) : [];
  if (c.length > 1) {
    const A = (h) => {
      const { revision: P, ...L } = bt(h.uiOptions);
      return JSON.stringify(L);
    };
    if (c.some((h) => A(h) !== A(c[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (s)
      for (const h of c.slice(1))
        await x(`/api/savedfilters/${h.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${h.id}` })
        });
    c.splice(1);
  }
  let a = c.length ? bt(c[0].uiOptions) : Ci();
  const f = localStorage.getItem(`${r}:migrated`) === "true", m = localStorage.getItem(r), g = localStorage.getItem(`${r}:local-only`) === "true";
  !c.length && m && (a = bt(m));
  let S = !c.length;
  if (c.length && g && m) {
    const A = bt(m);
    if (A.reviews.some((P) => {
      const L = a.reviews.find((J) => J.id === P.id);
      return L && JSON.stringify(L) !== JSON.stringify(P);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const h = [
      .../* @__PURE__ */ new Set([...a.deletedIds, ...A.deletedIds])
    ];
    a = {
      ...a,
      reviews: hr(a.reviews, A.reviews).filter(
        (P) => !h.includes(P.id)
      ),
      deletedIds: h,
      importedIds: [
        .../* @__PURE__ */ new Set([...a.importedIds, ...A.importedIds])
      ]
    }, S = !0;
  }
  if (!f) {
    const A = JSON.stringify(a), h = Ni(t);
    if (c.length && h.reviews.some((q) => {
      const te = a.reviews.find((Q) => Q.id === q.id);
      return te && JSON.stringify(te) !== JSON.stringify(q);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const P = i ? (await Qt(Ei)).flatMap(
      (q) => Rt(q.uiOptions ?? "[]")
    ) : [], L = h.known.filter(
      (q) => !h.reviews.some((te) => te.id === q)
    ), J = /* @__PURE__ */ new Set([...a.deletedIds, ...L]);
    a = {
      ...a,
      reviews: hr(
        h.reviews,
        a.reviews,
        P.filter(
          (q) => !h.known.includes(q.id) && !a.importedIds.includes(q.id)
        )
      ).filter((q) => !J.has(q.id)),
      deletedIds: [...J],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...a.importedIds,
          ...h.known,
          ...P.map((q) => q.id)
        ])
      ]
    }, S || (S = JSON.stringify(a) !== A);
  }
  const E = {
    userId: t,
    recordId: (b = c[0]) == null ? void 0 : b.id,
    config: a,
    readable: i,
    writable: s,
    durable: s
  };
  if (It.set(r, E), S && s) {
    const A = a;
    c.length && (E.config = bt(c[0].uiOptions)), await On(r, A), a = E.config;
  } else c.length || (localStorage.setItem(r, JSON.stringify(a)), !i && (!f || g) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (s)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: a.reviews,
    storageKey: r,
    canWrite: ht(e.permissions, "videos.write"),
    canWriteVideos: ht(e.permissions, "videos.write"),
    canWriteTags: ht(e.permissions, "tags.write"),
    canReadTagGroups: ht(e.permissions, "taggroups.read"),
    canConfigure: !i || s,
    storageNotice: i ? s ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function On(e, t) {
  const r = It.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await In(r), r.recordId != null) {
      const c = await x(
        `/api/savedfilters/${r.recordId}`
      );
      if (bt(c.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const s = await x(
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
    r.recordId = s.id;
  } else
    localStorage.setItem(e, JSON.stringify(i)), localStorage.setItem(`${e}:local-only`, "true");
  if (r.config = i, r.durable)
    try {
      localStorage.setItem(e, JSON.stringify(i)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function Ri(e, t) {
  return Rt(JSON.stringify(t)), qn(e, async () => {
    const r = It.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((s) => !t.some((c) => c.id === s.id)).map((s) => s.id);
    await On(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((s) => !t.some((c) => c.id === s))
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
  const r = It.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), s = i ? Hr(i) : null;
  if (!r.readable) return s;
  const c = (await Qt(yr)).find(
    (f) => f.name === t
  ), a = c ? Hr(c.uiOptions) : null;
  return s && (!a || s.updatedAt > a.updatedAt) ? s : a;
}
function qi(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return qn(i, async () => {
    const s = It.get(e);
    if (!(s != null && s.writable)) return;
    await In(s);
    const c = (await Qt(yr)).find(
      (a) => a.name === t
    );
    await x(
      c ? `/api/savedfilters/${c.id}` : "/api/savedfilters",
      {
        method: c ? "PUT" : "POST",
        body: JSON.stringify({
          mode: yr,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const je = "confirmed_absent_tags", Tr = "Confirmed absent tags", Oi = {
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
function vt(e) {
  return Array.isArray(e) ? e.map(vt) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? Oi[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === je.toLowerCase() ? r.toLowerCase() : vt(r)
    ])
  ) : e;
}
async function x(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await wi(e, { ...t, headers: r });
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
const ki = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Pi = 0;
function zt(e) {
  return x(`/api/videos/${e}?dqRead=${ki}-${++Pi}`, { cache: "no-store" });
}
async function Tt(e, t, r) {
  const i = { ...e.view.objectFilter }, s = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return x("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      vt({
        findFilter: Se(t),
        objectFilter: i,
        filterExpression: s
      })
    )
  });
}
async function Xr(e, t, r) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, x("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      vt({
        findFilter: Se(t),
        objectFilter: i
      })
    )
  });
}
function Mi(e) {
  return x("/api/taggroups", { signal: e });
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
async function qt(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await x(`/api/tags/${r}`), t.add(r);
    for (let i = 1; ; i++) {
      const s = await x("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          vt({
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
function _i(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${je} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function Rr() {
  const t = (await x("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === je.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${Tr} custom field before applying tag assessments.`
    };
  const r = _i(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function Di() {
  const e = await Rr();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await x("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: je,
        label: Tr,
        type: "tag",
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function Wt(e) {
  return [...new Set(e)];
}
function Ui(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${je} value is not a valid tag list.`
    );
  return Wt(e);
}
function ji(e) {
  return Wt(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function Ki(e, t) {
  let r;
  try {
    r = await Rr();
  } catch (g) {
    throw new Error(
      `Could not verify the ${Tr} custom field. ${g instanceof Error ? g.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const i = await Promise.all(
    e.steps.map(async (g) => ({
      ...g,
      tagIds: g.mode === "REMOVE_TREE" ? await qt(g.tagIds) : Wt(g.tagIds)
    }))
  ), s = i.filter(
    (g) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(g.mode)
  ), c = i.filter(
    (g) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(g.mode)
  ), a = Wt(t), f = r.definition.key;
  let m = 0;
  for (const g of a)
    try {
      const S = await zt(g), E = ji(S), b = { ...S.customFields ?? {} }, A = b[f], h = Ui(A), P = new Set(E), L = new Set(h);
      for (const Q of s)
        for (const T of Q.tagIds)
          Q.mode === "ADD" ? P.add(T) : P.delete(T);
      for (const Q of c)
        for (const T of Q.tagIds)
          Q.mode === "MARK_PRESENT" ? (P.add(T), L.delete(T)) : Q.mode === "MARK_ABSENT" ? (P.delete(T), L.add(T)) : L.delete(T);
      const J = [...P], q = [...L];
      JSON.stringify(E) === JSON.stringify(J) && JSON.stringify(h) === JSON.stringify(q) && (A === void 0 ? q.length === 0 : JSON.stringify(A) === JSON.stringify(h)) || await x(`/api/videos/${g}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: J,
          customFields: {
            ...b,
            [f]: q
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
  if (!wt(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (Jt(e)) {
    await Ki(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (i) => ({
      mode: i.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: i.mode === "REMOVE_TREE" ? await qt(i.tagIds) : i.tagIds
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
async function Gi(e, t) {
  if (!wt(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await x("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
async function Vi(e, t, r) {
  if (!wt(r) || r.steps.some(
    (c) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(c.mode)
  ))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const i = await Promise.all(
    r.steps.map(async (c) => ({
      ...c,
      tagIds: c.mode === "REMOVE_TREE" ? await qt(c.tagIds) : c.tagIds
    }))
  );
  let s = t.applications;
  for (const c of i)
    s = await $n(
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
async function Mn(e, t) {
  const r = e.occurrence;
  if (r.targetMode === "all" || r.targetMode === "filter" && Object.keys(r.performerFilter).length === 0) return null;
  if (r.targetMode === "selected") return r.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: s, ...c } = r.performerFilter;
  for (let a = 1; ; a++) {
    const f = await x("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        vt({
          findFilter: { page: a, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: c,
          filterExpression: s
        })
      )
    });
    if (f.items.forEach((m) => i.add(m.id)), a * 1e3 >= f.totalCount) return [...i];
    if (!f.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Fn(e, t) {
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
  const s = await Tt(
    Fn(e, t),
    { ...e.view.filter, page: r },
    i
  ), c = t === null ? null : new Set(t), a = new Array(s.items.length);
  let f = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, s.items.length) }, async () => {
      for (; f < s.items.length; ) {
        const m = f++, g = s.items[m], S = await x(
          `/api/tagapplications?hostType=video&hostId=${g.id}&contextType=performer`,
          { signal: i }
        );
        a[m] = g.performers.filter((E) => c === null || c.has(E.id)).flatMap((E) => {
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
  ), { items: a.flat(), totalCount: s.totalCount };
}
async function $n(e, t, r) {
  const i = new Set(e.occurrence.tagIds);
  if (r.some((m) => !i.has(m)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const s = await zt(t.video.id);
  if (!s.performers.some(
    (m) => m.id === t.performer.id
  ))
    throw new Error(
      "This performer is no longer linked to the scene. Refresh the queue."
    );
  const c = `/api/tagapplications?hostType=video&hostId=${s.id}&contextType=performer&contextId=${t.performer.id}`, a = (await x(c)).filter(
    (m) => m.hostType === "video" && m.hostId === s.id && m.contextType === "performer" && m.contextId === t.performer.id
  ), f = new Set(r);
  try {
    for (const m of f)
      a.some((g) => g.tag.id === m) || await x("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: "video",
          hostId: s.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: m,
          sourceKey: "user"
        })
      });
    for (const m of a)
      i.has(m.tag.id) && !f.has(m.tag.id) && await x(`/api/tagapplications/${m.id}`, {
        method: "DELETE"
      });
    return await x(c);
  } catch (m) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${m instanceof Error ? m.message : "Request failed."}`
    );
  }
}
const Ir = [
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
function wr(e) {
  const t = e.entityType === "performerOccurrence" ? e.occurrence : void 0;
  return {
    filter: Se({
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
  if (!Ir.some((a) => t.has(a))) {
    const a = wr(e);
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
      const m = f.lastIndexOf(":");
      return { key: f.slice(0, m), direction: f.slice(m + 1) };
    });
    if (a.some((f) => !f.key || !["asc", "desc"].includes(f.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = a, i.sort = a[0].key, i.direction = a[0].direction;
  }
  let s;
  if (e.entityType === "performerOccurrence" && (s = {
    ...Qi,
    ...Zr(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(s.targetMode) || !["any", "includes", "includesAll", "excludes", "isNull"].includes(
    s.condition
  ) || !Array.isArray(s.performerIds) || !Array.isArray(s.conditionTagIds) || [...s.performerIds, ...s.conditionTagIds].some(
    (a) => !Number.isSafeInteger(a) || a <= 0
  ) || !s.performerFilter || typeof s.performerFilter != "object" || Array.isArray(s.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const c = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Se(i),
      objectFilter: Zr(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: c,
      performerScope: s
    },
    startAtEnd: !t.has("page") && c === "end"
  };
}
function Gt(e, t) {
  const r = new URLSearchParams(window.location.search);
  Ir.forEach((i) => r.delete(i)), r.set("review", e);
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
function cr(e, t) {
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
function vr(e, t) {
  return {
    added: t.filter((r) => !e.includes(r)),
    removed: e.filter((r) => !t.includes(r))
  };
}
function Wi(e) {
  return `/api/tagapplications?hostType=video&hostId=${e.video.id}&contextType=performer&contextId=${e.occurrence.performer.id}`;
}
async function De(e) {
  var c;
  if (e.occurrence) {
    const a = (await x(Wi(e))).filter(
      (f) => f.hostType === "video" && f.hostId === e.video.id && f.contextType === "performer" && f.contextId === e.occurrence.performer.id
    );
    return {
      ids: [...new Set(a.map((f) => f.tag.id))],
      names: [...new Set(a.map((f) => f.tag.name))],
      absent: [],
      applications: a
    };
  }
  const t = await zt(e.video.id), r = (t.tags ?? []).filter(
    (a) => a.canRemove !== !1 || a.isDerived !== !0
  ), i = Object.keys(t.customFields ?? {}).find(
    (a) => a.toLowerCase() === je
  ) ?? je, s = ((c = t.customFields) == null ? void 0 : c[i]) ?? [];
  if (!Array.isArray(s) || s.some((a) => !Number.isSafeInteger(a)))
    throw new Error(
      "Confirmed absent tags are invalid. Inspect the video before editing."
    );
  return { ids: r.map((a) => a.id), names: r.map((a) => a.name), absent: s };
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
    for (const [i, s] of [
      ["ADD", r.added],
      ["REMOVE", r.removed]
    ])
      s.length && await x("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({ ids: [t.video.id], tagMode: i, tagIds: s })
      });
}
async function zi(e, t, r) {
  t.occurrence && e.entityType === "performerOccurrence" ? await Vi(e, t.occurrence, r) : await Pn(r, [t.video.id]);
}
async function Hi(e) {
  return [
    ...new Set(
      (await Promise.all(
        e.steps.map(
          (t) => t.mode === "REMOVE_TREE" ? qt(t.tagIds) : t.tagIds
        )
      )).flat()
    )
  ];
}
function Xi(e, t, r, i) {
  const s = (c) => c.filter((a) => i.includes(a));
  return {
    item: e,
    before: t,
    after: r,
    tags: vr(s(t.ids), s(r.ids)),
    absence: vr(s(t.absent), s(r.absent))
  };
}
function tn(e, t) {
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
async function Yi(e, t) {
  const r = await De(t.item);
  if (tn(t, r), t.absence.added.length || t.absence.removed.length) {
    const i = await zt(t.item.video.id), s = await De(t.item), c = Object.keys(i.customFields ?? {}).find(
      (a) => a.toLowerCase() === je
    ) ?? je;
    tn(t, s), await x(`/api/videos/${i.id}`, {
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
function qr(e) {
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
      qr(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function _n(e, t) {
  const r = qr(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((i) => {
      const s = String(i.key ?? ""), c = Zi[String(i.modifier ?? "EQUALS")], a = (E, b) => String(b ?? "").trim() || t[String(E)] || String(E ?? ""), f = a(
        i.value,
        i.displayValue
      ), m = a(
        i.value2,
        i.displayValue2
      ), g = String(i.modifier ?? "EQUALS"), S = g === "IS_NULL" || g === "NOT_NULL" ? [] : g === "BETWEEN" || g === "NOT_BETWEEN" ? [f, "and", m] : [f];
      return {
        ...i,
        label: [eo(s), c, ...S].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function Dn(e) {
  const t = qr(e.customFieldCriteria);
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
function lr(e, t) {
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
  const [s, c] = N({});
  V(() => {
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
            (await x(`/api/tags/${m}`)).name
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
    e.map((f, m) => /* @__PURE__ */ u("div", { className: "dq-action-pair", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: t || !r && f.steps.length > 0,
          onClick: (g) => i(f, g.shiftKey),
          children: /* @__PURE__ */ u("span", { children: [
            /* @__PURE__ */ n("kbd", { children: rt(f, m) }),
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
        (g) => `${a[g.mode]}: ${g.tagIds.map((S) => s[S] ?? "Loading tag…").join(", ")}`
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
  var ze, ke, de, ge;
  const s = F(null), c = F("");
  if (!s.current)
    try {
      s.current = en(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (l) {
      c.current = qe(l), s.current = { query: wr(e), startAtEnd: !1 };
    }
  const [a, f] = N(s.current.query), m = F(a);
  m.current = a;
  const [g, S] = N(0), E = F(s.current.startAtEnd), [b, A] = N([]), [h, P] = N(null), [L, J] = N(0), [q, te] = N(!1), [Q, T] = N(!1), v = F(!1), O = F(!0), $ = F(null);
  V(() => (O.current = !0, () => {
    O.current = !1;
  }), []);
  const [Y, B] = N(c.current), [ye, oe] = N(""), [ce, z] = N(null), [Ee, Ie] = N(!1), [Je, nt] = N([]), Ot = F([]), Fe = F(null), it = F(null), St = F(null);
  V(() => {
    var l, p;
    Ee && ((p = (l = St.current) == null ? void 0 : l.querySelector("input")) == null || p.focus());
  }, [Ee]);
  const [Z, ot] = N(null), [Ke, at] = N(!1);
  V(() => {
    if (q || Ke || !it.current) return;
    const l = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const p = it.current;
      p != null && p.isConnected && !p.disabled && p.focus(), it.current = null;
    });
    return () => cancelAnimationFrame(l);
  }, [q, Ke, g]);
  const [Qe, le] = N([]), [We, ee] = N({}), C = F(null), _ = F(0), U = F(!1), [st, Ht] = N({});
  V(() => {
    let l = !0;
    return Promise.all(
      Ln(a.objectFilter).map(
        async (p) => [
          String(p),
          (await x(`/api/tags/${p}`)).name
        ]
      )
    ).then((p) => {
      l && Ht(Object.fromEntries(p));
    }).catch(() => {
    }), () => {
      l = !1;
    };
  }, [a.objectFilter]);
  const Ge = F(0), Ve = F(e);
  Ve.current = e;
  const H = yt(() => cr(e, a), [e, a]), ct = F(H);
  ct.current = H;
  const $e = Q || q || Ee, Oe = Number(a.filter.page), be = Math.max(1, Math.ceil(L / Number(a.filter.perPage)));
  function fe(l, p = !1) {
    v.current || (c.current = "", E.current = p, m.current = l, f(l), J(0), te(!0), p || Gt(e.id, l), S((R) => R + 1));
  }
  function j() {
    if (v.current = !1, T(!1), O.current && $.current) {
      const l = $.current;
      $.current = null, fe(l.query, l.startAtEnd);
    }
  }
  V(() => {
    const l = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const p = en(
            Ve.current,
            new URLSearchParams(window.location.search)
          );
          v.current ? $.current = p : fe(p.query, p.startAtEnd);
        } catch (p) {
          B(qe(p));
        }
    };
    return window.addEventListener("popstate", l), () => window.removeEventListener("popstate", l);
  }, [e.id]), V(() => (r(Q || q || Ee), () => r(!1)), [Q, q, Ee, r]);
  async function xe(l, p, R) {
    if (l.entityType === "performerOccurrence") {
      const G = await Ji(
        l,
        C.current,
        p,
        R
      );
      return {
        items: G.items.map((D) => ({
          key: D.key,
          video: D.video,
          occurrence: D
        })),
        totalCount: G.totalCount
      };
    }
    const I = await Tt(
      l,
      { ...l.view.filter, page: p },
      R
    );
    return {
      items: I.items.map((G) => ({ key: String(G.id), video: G })),
      totalCount: I.totalCount
    };
  }
  function Ce(l, p, R) {
    if (!O.current || $.current) return;
    A(lr(l.items, m.current.startFrom === "end")), J(l.totalCount), P(R);
    const I = {
      ...m.current,
      filter: { ...m.current.filter, page: p }
    };
    m.current = I, f(I), Gt(e.id, I);
  }
  V(() => {
    if (c.current) return;
    const l = new AbortController(), p = ++Ge.current;
    return te(!0), B(""), oe(""), P(null), A([]), Ie(!1), (async () => {
      const R = cr(Ve.current, m.current);
      C.current = R.entityType === "performerOccurrence" ? await Mn(R, l.signal) : null;
      let I = Number(R.view.filter.page), G = await xe(R, I, l.signal);
      const D = Math.max(
        1,
        Math.ceil(G.totalCount / Number(R.view.filter.perPage))
      );
      if ((E.current || I > D) && (I = D, G = await xe(R, I, l.signal)), E.current = !1, p !== Ge.current || l.signal.aborted) return;
      const ae = lr(G.items, R.view.startFrom === "end");
      Ce(G, I, ae[0] ?? null);
    })().catch((R) => {
      l.signal.aborted || B(qe(R));
    }).finally(() => {
      l.signal.aborted || te(!1);
    }), () => {
      l.abort(), Ge.current++;
    };
  }, [g, e.id]), V(() => {
    if (z(null), !h) return;
    let l = !0;
    return De(h).then((p) => {
      l && (z(p), le(
        e.entityType === "performerOccurrence" ? p.ids.filter((R) => e.occurrence.tagIds.includes(R)) : []
      ));
    }).catch((p) => {
      l && B(`Could not load current tags. ${qe(p)}`);
    }), () => {
      l = !1;
    };
  }, [h]), V(() => {
    if (e.entityType !== "performerOccurrence" || e.actions.length)
      return;
    let l = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (p) => [
          p,
          (await x(`/api/tags/${p}`)).name
        ]
      )
    ).then((p) => {
      l && ee(Object.fromEntries(p));
    }).catch((p) => {
      l && B(qe(p));
    }), () => {
      l = !1;
    };
  }, [e]);
  async function kt() {
    if (!h) return;
    const l = b.findIndex((D) => D.key === h.key);
    if (l >= 0 && l + 1 < b.length) {
      P(b[l + 1]);
      return;
    }
    const p = new Set(b.map((D) => D.key)), R = 1100 - (Date.now() - _.current);
    R > 0 && await new Promise((D) => window.setTimeout(D, R));
    const I = a.startFrom === "end" ? -1 : 1;
    let G = I === -1 ? Math.max(1, Oe - 1) : Oe;
    for (; O.current && !$.current; ) {
      let D = await xe(H, G);
      const ae = Math.max(
        1,
        Math.ceil(D.totalCount / Number(a.filter.perPage))
      );
      G > ae && (G = ae, D = await xe(H, G));
      const ve = I === -1 && Oe === 1 ? void 0 : lr(D.items, I === -1).find(
        (He) => !p.has(He.key)
      );
      if (ve || (I === -1 ? G <= 1 : G >= ae)) {
        Ce(D, G, ve ?? null), ve || oe(
          D.totalCount ? "Reached the end in this direction. Matching items remain available from the scene pages." : "No matching scenes."
        );
        return;
      }
      G += I;
    }
  }
  async function Le(l, p = !1, R = !1, I = !1) {
    if (!h || v.current || q || Ee && !R) return;
    const G = R || I || !!(l != null && l.steps.length);
    if (G && (!t || !ce)) return;
    v.current = !0, T(!0), B(""), oe("");
    let D = !1;
    try {
      if (G) {
        const ae = await De(h);
        let ve;
        if (l)
          ve = await Hi(l), await zi(H, h, l);
        else {
          const lt = I && e.entityType === "performerOccurrence" ? e.occurrence.tagIds.filter((dt) => ae.ids.includes(dt)) : Ot.current, Be = vr(lt, I ? Qe : Je);
          ve = [...Be.added, ...Be.removed], await xn(H, h, Be);
        }
        _.current = Date.now();
        const He = await De(h);
        z(He);
        const Pe = Xi(h, ae, He, ve);
        [Pe.tags, Pe.absence].some(
          (lt) => lt.added.length || lt.removed.length
        ) && ot({
          ...Pe,
          cursor: {
            query: structuredClone(a),
            items: [...b],
            total: L,
            targets: C.current ? [...C.current] : null
          }
        }), D = !0, Ie(!1), oe("Tags saved.");
      }
      if (!O.current || $.current) return;
      p ? R && requestAnimationFrame(() => {
        var ae;
        return (ae = Fe.current) == null ? void 0 : ae.focus();
      }) : await kt();
    } catch (ae) {
      if (B(
        D ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${qe(ae)}` : G ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${qe(ae)}` : `Could not advance. ${qe(ae)}`
      ), G && !D) {
        _.current = Date.now();
        try {
          z(await De(h));
        } catch {
          z(null), B(
            (ve) => `${ve} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      j();
    }
  }
  async function Xt() {
    if (!(!Z || v.current || Ee || q)) {
      v.current = !0, T(!0), B(""), oe("");
      try {
        await Yi(H, Z), ot(null), _.current = Date.now();
        const l = await De(Z.item);
        if (!O.current || $.current) return;
        le(
          e.entityType === "performerOccurrence" ? l.ids.filter((p) => e.occurrence.tagIds.includes(p)) : []
        ), C.current = Z.cursor.targets, m.current = Z.cursor.query, f(Z.cursor.query), Gt(e.id, Z.cursor.query), A(Z.cursor.items), J(Z.cursor.total), P(Z.item), z(l), ot(null), oe("Latest tag operation undone. Inspecting the affected item.");
      } catch (l) {
        if (!O.current || $.current) return;
        B(`Undo stopped. ${qe(l)}`), C.current = Z.cursor.targets, m.current = Z.cursor.query, f(Z.cursor.query), Gt(e.id, Z.cursor.query), A(Z.cursor.items), J(Z.cursor.total), P(Z.item);
        try {
          z(await De(Z.item));
        } catch {
          z(null);
        }
      } finally {
        j();
      }
    }
  }
  V(() => {
    const l = (p) => {
      if (Ee || Q || q || Ke || p.defaultPrevented || p.repeat || p.ctrlKey || p.altKey || p.metaKey || !Tn(p.target) || document.querySelector('[role="dialog"], dialog[open]'))
        return;
      const R = /^Digit[1-9]$/.test(p.code) ? p.code.slice(5) : p.key, I = e.actions.find(
        (G, D) => rt(G, D) === R
      );
      I && (p.preventDefault(), p.stopPropagation(), Le(I, p.shiftKey));
    };
    return document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l);
  });
  const K = a.performerScope, pe = (l) => fe({
    ...m.current,
    filter: { ...m.current.filter, page: 1 },
    performerScope: { ...K, ...l }
  });
  return /* @__PURE__ */ u(
    "section",
    {
      className: "dq-review-workspace",
      "aria-label": K ? "Performer occurrence review" : "Video review",
      children: [
        /* @__PURE__ */ u(
          "fieldset",
          {
            className: "dq-review-filters",
            disabled: $e,
            onClickCapture: (l) => {
              var I;
              const p = l.target instanceof Element ? l.target.closest("button") : null, R = (p == null ? void 0 : p.getAttribute("aria-label")) ?? ((I = p == null ? void 0 : p.textContent) == null ? void 0 : I.trim()) ?? "";
              p && !p.closest('[role="dialog"], dialog') && /^(Filters|Edit filter:|Edit performer criteria)/.test(R) && (it.current = p);
            },
            children: [
              /* @__PURE__ */ n("legend", { children: "Scene filters" }),
              /* @__PURE__ */ n(
                "div",
                {
                  onKeyDownCapture: (l) => {
                    var p;
                    l.key === "Escape" && (U.current = !1), ["Delete", "Backspace"].includes(l.key) && l.target instanceof Element && ((p = l.target.closest("button")) == null ? void 0 : p.getAttribute("aria-label")) === "Edit filter: Custom Fields" && (U.current = !0);
                  },
                  onClickCapture: (l) => {
                    var R, I;
                    const p = l.target instanceof Element ? l.target.closest("button") : null;
                    (p == null ? void 0 : p.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((R = p == null ? void 0 : p.textContent) == null ? void 0 : R.trim()) === "Clear all" ? U.current = !0 : (/^(Cancel|Filters)/.test(((I = p == null ? void 0 : p.textContent) == null ? void 0 : I.trim()) ?? "") || /^(Close|Dismiss)/.test((p == null ? void 0 : p.getAttribute("aria-label")) ?? "")) && (U.current = !1);
                  },
                  children: /* @__PURE__ */ n(
                    ur,
                    {
                      filter: a.filter,
                      objectFilter: _n(
                        a.objectFilter,
                        st
                      ),
                      criteriaDefinitions: [
                        ...Bt,
                        {
                          id: "custom-fields",
                          label: "Custom Fields",
                          filterKey: "customFieldCriteria"
                        }
                      ],
                      totalCount: L,
                      sortOptions: Nr,
                      showSearch: !0,
                      showSort: !0,
                      showPagingControls: !1,
                      onFilterChange: (l) => {
                        (l.sort !== m.current.filter.sort || l.direction !== m.current.filter.direction) && (l = { ...l, sorts: void 0 }), fe({
                          ...m.current,
                          filter: Se(l)
                        });
                      },
                      onObjectFilterChange: (l) => {
                        const p = Un(
                          m.current.objectFilter,
                          Dn(l),
                          U.current
                        );
                        U.current = !1, fe({
                          ...m.current,
                          objectFilter: p,
                          filter: { ...m.current.filter, page: 1 }
                        });
                      }
                    }
                  )
                }
              ),
              K && /* @__PURE__ */ u("div", { className: "dq-scope-controls", children: [
                /* @__PURE__ */ u("label", { children: [
                  "Performers to review",
                  " ",
                  /* @__PURE__ */ u(
                    "select",
                    {
                      value: K.targetMode,
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
                K.targetMode === "selected" && /* @__PURE__ */ n(
                  Ue,
                  {
                    entityType: "performer",
                    values: K.performerIds,
                    onChange: (l) => pe({ performerIds: l }),
                    placeholder: "Select performers to review...",
                    allowCreate: !1
                  }
                ),
                K.targetMode === "filter" && /* @__PURE__ */ u(Ae, { children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => at(!0),
                      children: "Edit performer criteria"
                    }
                  ),
                  /* @__PURE__ */ n("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ n(
                    ur,
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
                      objectFilter: K.performerFilter,
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
                      value: K.condition,
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
                !["any", "isNull"].includes(K.condition) && /* @__PURE__ */ n(
                  Ue,
                  {
                    entityType: "tag",
                    values: K.conditionTagIds,
                    onChange: (l) => pe({ conditionTagIds: l }),
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
                      const l = wr(e);
                      fe(l, l.startFrom === "end");
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
                      v.current = !0, T(!0), B(""), i(cr(e, a)).then(() => oe("Review defaults saved.")).catch((l) => B(qe(l))).finally(j);
                    },
                    children: "Save as review defaults"
                  }
                )
              ] })
            ]
          }
        ),
        K && /* @__PURE__ */ n(
          pn,
          {
            open: Ke,
            onClose: () => at(!1),
            criteria: Jr,
            activeFilter: K.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (l) => {
              at(!1), pe({ performerFilter: l });
            }
          }
        ),
        /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
          Y && /* @__PURE__ */ u("p", { role: "alert", children: [
            Y,
            " ",
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: Q,
                onClick: () => {
                  h ? De(h).then(z).catch((l) => B(qe(l))) : fe(m.current);
                },
                children: h ? "Reload tags" : "Retry queue"
              }
            )
          ] }),
          ye && /* @__PURE__ */ n("p", { role: "status", children: ye }),
          Z && /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: $e,
              onClick: () => void Xt(),
              children: "Undo latest tag operation"
            }
          )
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-review-layout", children: [
          /* @__PURE__ */ n("div", { className: "dq-review-inspector", children: h ? /* @__PURE__ */ u(Ae, { children: [
            /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
              /* @__PURE__ */ n(
                "a",
                {
                  href: `/video/${h.video.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: h.video.title || ((ze = h.video.files[0]) == null ? void 0 : ze.basename) || "Open scene"
                }
              ),
              /* @__PURE__ */ n(
                gn,
                {
                  videoId: h.video.id,
                  streamUrl: kn(h.video.id),
                  posterUrl: Fi(h.video),
                  duration: ((ke = h.video.files[0]) == null ? void 0 : ke.duration) ?? 0,
                  format: (de = h.video.files[0]) == null ? void 0 : de.format,
                  audioCodec: (ge = h.video.files[0]) == null ? void 0 : ge.audioCodec,
                  extensionSurface: "quick-view",
                  showAbLoop: !0,
                  clip: h.video.parentVideoId != null ? {
                    start: h.video.clipStartSec ?? 0,
                    end: h.video.clipEndSec,
                    loop: !1
                  } : void 0
                },
                h.video.id
              )
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-panel", children: [
              /* @__PURE__ */ n("h2", { children: h.occurrence ? `Reviewing ${h.occurrence.performer.name}` : "Reviewing this video" }),
              /* @__PURE__ */ n("p", { children: K ? "Tags apply only to this performer in this video." : "Tags apply to the video." }),
              K && /* @__PURE__ */ n(
                "div",
                {
                  className: "dq-review-partners",
                  "aria-label": "Matching scene partners",
                  children: b.filter((l) => l.video.id === h.video.id).map((l) => {
                    var p, R;
                    return /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button dq-partner-button",
                        title: (p = l.occurrence) == null ? void 0 : p.performer.name,
                        "aria-label": (R = l.occurrence) == null ? void 0 : R.performer.name,
                        disabled: $e,
                        "aria-pressed": l.key === h.key,
                        onClick: () => {
                          P(l), B("");
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
                K ? "occurrence" : "video",
                " tags:",
                " ",
                ce ? ce.names.join(", ") || "None" : "Loading…"
              ] }),
              ce != null && ce.absent.length ? /* @__PURE__ */ u("p", { children: [
                "Confirmed absent tags:",
                " ",
                /* @__PURE__ */ n(
                  Ue,
                  {
                    entityType: "tag",
                    values: ce.absent,
                    onChange: () => {
                    },
                    disabled: !0,
                    allowCreate: !1
                  }
                )
              ] }) : null,
              Ee ? /* @__PURE__ */ u(
                "fieldset",
                {
                  ref: St,
                  disabled: Q,
                  className: "dq-tag-editor",
                  children: [
                    /* @__PURE__ */ u("legend", { children: [
                      "Edit ",
                      K ? "occurrence" : "video",
                      " tags"
                    ] }),
                    /* @__PURE__ */ n(
                      Ue,
                      {
                        entityType: "tag",
                        values: Je,
                        onChange: nt,
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
                          disabled: !ce,
                          onClick: () => void Le(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !ce,
                          onClick: () => void Le(void 0, !1, !0),
                          children: "Save & next"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => {
                            Ie(!1), requestAnimationFrame(
                              () => {
                                var l;
                                return (l = Fe.current) == null ? void 0 : l.focus();
                              }
                            );
                          },
                          children: "Cancel"
                        }
                      )
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ u(Ae, { children: [
                /* @__PURE__ */ n(
                  to,
                  {
                    actions: e.actions,
                    canWrite: t,
                    disabled: Q || q || !ce,
                    onApply: (l, p) => void Le(l, p)
                  }
                ),
                e.entityType === "performerOccurrence" && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u("fieldset", { disabled: !t || Q || !ce, children: [
                  /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                  e.occurrence.tagIds.map((l) => /* @__PURE__ */ u("label", { children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: e.occurrence.multiple ? "checkbox" : "radio",
                        name: "legacy-choice",
                        checked: Qe.includes(l),
                        onChange: (p) => le(
                          e.occurrence.multiple ? p.target.checked ? [...Qe, l] : Qe.filter(
                            (R) => R !== l
                          ) : [l]
                        )
                      }
                    ),
                    We[l] ?? "Loading tag…"
                  ] }, l)),
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      onClick: () => le([]),
                      children: "No applicable tags"
                    }
                  ),
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => void Le(void 0, !0, !1, !0),
                      children: "Save choices"
                    }
                  ),
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button primary",
                      onClick: () => void Le(void 0, !1, !1, !0),
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
                    ref: Fe,
                    className: "dq-button",
                    disabled: $e || !t || !ce,
                    onClick: () => {
                      Ot.current = [...ce.ids], nt([...ce.ids]), Ie(!0);
                    },
                    children: "Edit tags"
                  }
                ),
                /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: $e,
                    onClick: () => void Le(),
                    children: [
                      "Skip",
                      K ? " performer" : " video"
                    ]
                  }
                )
              ] }),
              !t && /* @__PURE__ */ n("p", { children: "Write permission is required to change tags." })
            ] })
          ] }) : /* @__PURE__ */ n("p", { role: "status", children: q ? "Loading review…" : L ? "Reached the end in this direction." : "No matching scenes." }) }),
          /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
            /* @__PURE__ */ u("p", { role: "status", children: [
              L,
              " matching scenes ·",
              " ",
              K ? `${b.length} performers on loaded page` : `${b.length} videos on loaded page`,
              h && b.some((l) => l.key === h.key) ? ` · Position ${b.findIndex((l) => l.key === h.key) + 1} of ${b.length}` : ""
            ] }),
            /* @__PURE__ */ u("fieldset", { disabled: $e, children: [
              /* @__PURE__ */ n(
                mn,
                {
                  filter: a.filter,
                  totalCount: L,
                  onFilterChange: (l) => fe({ ...a, filter: Se(l) })
                }
              ),
              /* @__PURE__ */ u("div", { className: "dq-row", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: Oe <= 1,
                    onClick: () => fe({
                      ...a,
                      filter: { ...a.filter, page: Oe - 1 }
                    }),
                    children: "Previous scene page"
                  }
                ),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: Oe >= be,
                    onClick: () => fe({
                      ...a,
                      filter: { ...a.filter, page: Oe + 1 }
                    }),
                    children: "Next scene page"
                  }
                ),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    onClick: () => fe(a),
                    children: "Refresh page"
                  }
                )
              ] }),
              /* @__PURE__ */ u("p", { children: [
                "Scene page ",
                Oe,
                " of ",
                be,
                " ·",
                " ",
                a.startFrom === "end" ? "Toward the beginning" : "Toward the end"
              ] })
            ] }),
            /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: b.map((l) => {
              var p, R, I;
              return /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  title: `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${l.video.title || ((p = l.video.files[0]) == null ? void 0 : p.basename) || "Scene"}`,
                  "aria-label": `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${l.video.title || ((R = l.video.files[0]) == null ? void 0 : R.basename) || "Scene"}`,
                  disabled: $e,
                  "aria-pressed": (h == null ? void 0 : h.key) === l.key,
                  onClick: () => {
                    P(l), B(""), oe("");
                  },
                  children: [
                    l.occurrence && /* @__PURE__ */ n(rn, { performer: l.occurrence.performer }),
                    /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: l.video.title || ((I = l.video.files[0]) == null ? void 0 : I.basename) || "Scene" })
                  ]
                },
                l.key
              );
            }) })
          ] })
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
  const i = e.occurrence, s = (c) => t({ ...e, occurrence: { ...i, ...c } });
  return r ? /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ n("p", { children: "Choose the tags this review can change on the active performer’s appearance in a scene. Other tags are preserved." }),
    /* @__PURE__ */ n(
      Ue,
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
    /* @__PURE__ */ n("p", { children: "Leave this unrestricted to review any appearance. Choose performers temporarily in the review workspace." }),
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
      Ue,
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
function no(e) {
  var f, m, g;
  const [t, r] = N({}), [i, s] = N(""), c = (((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.annotations) ?? []).includes("tags") ? ((m = e == null ? void 0 : e.presentation) == null ? void 0 : m.annotationParents) ?? [] : [], a = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...c,
      ...((g = e == null ? void 0 : e.presentation) == null ? void 0 : g.binParents) ?? []
    ])
  ]);
  return V(() => {
    let S = !0;
    return r({}), s(""), Promise.all(
      JSON.parse(a).map(
        async (E) => [E, await qt([E])]
      )
    ).then((E) => {
      S && r(Object.fromEntries(E));
    }).catch(() => {
      S && s(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      S = !1;
    };
  }, [a]), { ids: t, error: i };
}
function io(e, t, r) {
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
          var m;
          return f !== a.id && ((m = r[f]) == null ? void 0 : m.includes(a.id));
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
  onChoose: s
}) {
  var f, m, g;
  const c = new Set(
    (((f = t.presentation) == null ? void 0 : f.binParents) ?? []).flatMap(
      (S) => (r[S] ?? []).filter((E) => E !== S)
    )
  ), a = /* @__PURE__ */ new Map();
  for (const S of e)
    for (const E of S.tags ?? [])
      if (c.has(E.id)) {
        const b = a.get(E.id) ?? { name: E.name, count: 0 };
        b.count++, a.set(E.id, b);
      }
  return (g = (m = t.presentation) == null ? void 0 : m.binParents) != null && g.length ? /* @__PURE__ */ u("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...a].sort((S, E) => S[1].name.localeCompare(E[1].name)).map(([S, E]) => /* @__PURE__ */ u(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => s(S),
        children: [
          E.name,
          " (",
          E.count,
          ")"
        ]
      },
      S
    )),
    !a.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
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
  const [s, c] = N(!1), a = Ne(e) === "tag" ? "tag" : "video", f = e.view.filter, m = a === "tag" ? hn : Nr, g = (b) => t({
    ...e,
    view: { ...e.view, filter: { ...f, ...b } }
  }), S = a === "video" ? e.presentation ?? {} : {}, E = (b) => t({ ...e, presentation: { ...S, ...b } });
  return /* @__PURE__ */ u(Ae, { children: [
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
          a === "tag" ? "Tags" : "Videos",
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
      s && /* @__PURE__ */ n("div", { onKeyDown: (b) => b.stopPropagation(), children: /* @__PURE__ */ n(
        pn,
        {
          open: !0,
          onClose: () => c(!1),
          criteria: a === "tag" ? yn : Bt,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: a === "video",
          subjectLabel: a === "tag" ? "tags" : "videos",
          onApply: (b) => {
            t({ ...e, view: { ...e.view, objectFilter: b } }), c(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ u(Ae, { children: [
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
            onChange: (b) => t({
              ...e,
              view: {
                ...e.view,
                displayMode: b.target.value
              }
            }),
            children: (a === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((b) => /* @__PURE__ */ n("option", { children: b }, b))
          }
        )
      ] }) }),
      a === "video" && /* @__PURE__ */ u(Ae, { children: [
        /* @__PURE__ */ n("h4", { children: "Card annotations" }),
        /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((b) => {
          const A = S.annotations ?? [];
          return /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: A.includes(b),
                onChange: (h) => E({
                  annotations: h.target.checked ? [...A, b] : A.filter((P) => P !== b)
                })
              }
            ),
            b
          ] }, b);
        }) }),
        (S.annotations ?? []).includes("tags") && /* @__PURE__ */ u(Ae, { children: [
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
          /* @__PURE__ */ n(
            Ue,
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
          Ue,
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
const dr = 180, so = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function jn({ entityType: e }) {
  return e === "tag" ? /* @__PURE__ */ n(mi, { role: "img", "aria-label": "Tag review" }) : /* @__PURE__ */ n(gr, { role: "img", "aria-label": e === "performerOccurrence" ? "Performer occurrence review" : "Video review" });
}
function an(e) {
  return Ne(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function sn(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function cn() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function ln(e) {
  const t = new URLSearchParams(window.location.search);
  Ir.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function co(e) {
  return Se({ ...e, page: 1 });
}
function Sr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((a, f) => Sr(a, t[f]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, s = Object.keys(r).sort(), c = Object.keys(i).sort();
  return s.length === c.length && s.every(
    (a, f) => a === c[f] && Sr(r[a], i[a])
  );
}
function Kn(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Re(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
const Gn = "data-quality.workspace-layout.v1", Or = 240, Er = 192, Cr = 560;
function Vn(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(Cr, Math.max(Er, e)) : Or;
}
function lo() {
  try {
    const e = JSON.parse(
      localStorage.getItem(Gn) ?? "null"
    );
    return Vn(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return Or;
  }
}
function uo(e) {
  try {
    localStorage.setItem(
      Gn,
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
  }), [s, c] = N(""), [a, f] = N(!0), [m, g] = N(""), [S, E] = N(!1), [b, A] = N(!1), [h, P] = N(!1), [L, J] = N([]), [q, te] = N(""), [Q, T] = N(!0), [v, O] = N(""), [$, Y] = N(""), [B, ye] = N(!1), [oe, ce] = N(!1), [z, Ee] = N(cn), [Ie, Je] = N({}), [nt, Ot] = N("name"), [Fe, it] = N("asc"), St = F(null), Z = F(!1), [ot, Ke] = N(!1), [at, Qe] = N(!1), [le, We] = N(
    null
  ), ee = t.find((o) => o.id === z) ?? null, C = yt(
    () => (le == null ? void 0 : le.id) === z && ee ? { ...ee, view: le.view } : ee,
    [le, z, ee]
  );
  V(() => {
    const o = () => Ee(cn());
    return window.addEventListener("popstate", o), () => window.removeEventListener("popstate", o);
  }, []);
  const _ = C ? Ne(C) : "video", U = _ === "video" ? C : null, st = _ === "tag" ? b : S, Ht = yt(() => {
    const o = Fe === "asc" ? 1 : -1;
    return [...t].sort((d, y) => {
      if (nt === "count") {
        const w = Ie[d.id], M = Ie[y.id], k = typeof w == "number", W = typeof M == "number";
        if (k !== W) return k ? -1 : 1;
        if (k && W && w !== M)
          return (w - M) * o;
      }
      return d.name.localeCompare(y.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * o;
    });
  }, [Fe, nt, Ie, t]), Ge = F(
    null
  ), Ve = no(U), [H, ct] = N({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [$e, Oe] = N({
    page: 1,
    perPage: 40
  }), [be, fe] = N({ items: [], totalCount: 0 }), [j, xe] = N(!1), [Ce, kt] = N(""), [Le, Xt] = N(!1), [K, pe] = N(() => /* @__PURE__ */ new Set()), ze = F(K);
  ze.current = K;
  const ke = F(/* @__PURE__ */ new Map()), [de, ge] = N(null), l = F(de);
  l.current = de;
  const [p, R] = N(!1), I = F(p);
  I.current = p;
  const G = F(null), [D, ae] = N("grid"), [ve, He] = N(dr), [Pe, lt] = N(lo), [X, Be] = N(!1), dt = F(!1), [Wn, Yt] = N(""), [Pt, Xe] = N(""), [Zt, Et] = N(""), [ie, kr] = N(null), [Pr, Mt] = N(""), [Ft, $t] = N(!1), [Mr, Fr] = N({}), [$r, xr] = N({}), Ct = F(/* @__PURE__ */ new Map()), Lr = F(null), xt = F(null), ut = F(0), Lt = F(0), _t = F(null), Ye = F(!1), _r = JSON.stringify([
    ...new Set(
      (U == null ? void 0 : U.actions.flatMap(
        (o) => o.steps.flatMap((d) => d.tagIds)
      )) ?? []
    )
  ]);
  function er(o) {
    const d = Vn(o);
    lt(d), uo(d);
  }
  function zn(o) {
    const d = o.shiftKey ? 40 : 16;
    let y = null;
    o.key === "ArrowLeft" && (y = Pe + d), o.key === "ArrowRight" && (y = Pe - d), o.key === "Home" && (y = Er), o.key === "End" && (y = Cr), y !== null && (o.preventDefault(), o.stopPropagation(), er(y));
  }
  V(() => {
    if (!Pt) return;
    const o = window.setTimeout(() => Xe(""), 4e3);
    return () => window.clearTimeout(o);
  }, [Pt]), V(() => {
    const o = JSON.parse(_r);
    if (xr({}), !o.length) return;
    const d = new AbortController();
    let y = !0;
    return Promise.all(
      o.map(async (w) => {
        var M;
        try {
          const k = await x(`/api/tags/${w}`, {
            signal: d.signal
          });
          return [w, ((M = k.name) == null ? void 0 : M.trim()) || null];
        } catch {
          return [w, null];
        }
      })
    ).then((w) => {
      y && xr(Object.fromEntries(w));
    }), () => {
      y = !1, d.abort();
    };
  }, [_r]), V(() => {
    const o = U ? Ln(U.view.objectFilter) : [];
    if (Fr({}), !o.length) return;
    const d = new AbortController();
    let y = !0;
    return Promise.all(
      o.map(async (w) => {
        var M;
        try {
          const k = await x(`/api/tags/${w}`, {
            signal: d.signal
          });
          return (M = k.name) != null && M.trim() ? [String(w), k.name] : null;
        } catch {
          return null;
        }
      })
    ).then((w) => {
      y && Fr(
        Object.fromEntries(w.filter((M) => M !== null))
      );
    }), () => {
      y = !1, d.abort();
    };
  }, [U == null ? void 0 : U.id, U == null ? void 0 : U.view.objectFilter]);
  const tr = yt(
    () => U ? _n(
      U.view.objectFilter,
      Mr
    ) : (C == null ? void 0 : C.view.objectFilter) ?? {},
    [Mr, C, U]
  ), Hn = yt(
    () => _ === "video" && Array.isArray(tr.customFieldCriteria) ? [...Bt, so] : _ === "tag" ? yn : Bt,
    [_, tr.customFieldCriteria]
  ), Dr = tt(async () => {
    f(!0), g("");
    try {
      const o = await Ai();
      r(o.reviews), c(o.storageKey), E(o.canWriteVideos ?? o.canWrite), A(o.canWriteTags ?? !1), P(o.canReadTagGroups ?? !1), T(o.canConfigure ?? !0), O(o.storageNotice ?? ""), z && !o.reviews.some((d) => d.id === z) && (Ee(""), ln(""));
    } catch (o) {
      g(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      f(!1);
    }
  }, [z]);
  V(() => {
    if (!h) {
      J([]), te("");
      return;
    }
    const o = new AbortController();
    return te(""), Mi(o.signal).then(J).catch((d) => {
      o.signal.aborted || te(
        d instanceof Error ? d.message : "Could not load tag groups."
      );
    }), () => o.abort();
  }, [h]), V(() => {
    Dr();
  }, []), V(() => {
    if (z || t.length === 0) return;
    const o = new AbortController();
    Je({});
    for (const d of t)
      (d.entityType === "performerOccurrence" ? Mn(d, o.signal).then((w) => (w == null ? void 0 : w.length) === 0 ? { items: [], totalCount: 0 } : Tt(Fn(d, w), { ...d.view.filter, page: 1, perPage: 1 }, o.signal)) : Ne(d) === "tag" ? Xr(
        d,
        Se({ ...d.view.filter, page: 1, perPage: 1 }),
        o.signal
      ) : Tt(
        d,
        Se({ ...d.view.filter, page: 1, perPage: 1 }),
        o.signal
      )).then((w) => {
        o.signal.aborted || Je((M) => ({
          ...M,
          [d.id]: w.totalCount
        }));
      }).catch(() => {
        o.signal.aborted || Je((w) => ({ ...w, [d.id]: null }));
      });
    return () => o.abort();
  }, [z, t]), fn(() => {
    var o;
    z || a || !Z.current || (Z.current = !1, (o = St.current) == null || o.focus());
  }, [z, a]);
  const Dt = tt(async () => {
    Mt("");
    try {
      kr(await Rr());
    } catch (o) {
      kr(null), Mt(
        "Tag assessment setup could not be checked. " + (o instanceof Error ? o.message : "Request failed.")
      );
    }
  }, []);
  V(() => {
    Dt();
  }, [Dt]);
  const Ze = tt(
    async (o, d, y = !1) => {
      var W;
      const w = ++ut.current;
      (W = _t.current) == null || W.abort();
      const M = new AbortController();
      _t.current = M, d = Se(d);
      const k = Number(d.page);
      y && (d = { ...d, page: 1 }), ct(d), Xt(y), xe(!0), kt("");
      try {
        const se = (pt) => Ne(o) === "tag" ? Xr(
          o,
          pt,
          M.signal
        ) : Tt(
          o,
          pt,
          M.signal
        );
        let we = await se(d);
        const Me = Math.max(
          1,
          Math.ceil(we.totalCount / Number(d.perPage))
        ), Te = y ? Me : Math.min(k, Me);
        return Number(d.page) !== Te && (d = { ...d, page: Te }, we = await se(d)), w === ut.current && (fe(we), ct(d), Oe(d)), we;
      } catch (se) {
        throw w === ut.current && kt(
          se instanceof Error ? se.message : "Could not load the review queue."
        ), se;
      } finally {
        w === ut.current && xe(!1);
      }
    },
    []
  );
  V(() => {
    var d;
    if (Lt.current += 1, ut.current += 1, (d = _t.current) == null || d.abort(), ce(!1), Y(""), ye(!1), pe(/* @__PURE__ */ new Set()), ke.current.clear(), ge(null), R(!1), Be(!1), dt.current = !1, Yt(""), Xe(""), Et(""), fe({ items: [], totalCount: 0 }), !C || Ne(C) !== "tag") {
      xe(!1);
      return;
    }
    let o = !0;
    return xe(!0), (async () => {
      let y = null;
      try {
        y = await Ii(s, C.id);
      } catch (k) {
        o && (ye(!0), Y(
          k instanceof Error ? k.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const w = (y == null ? void 0 : y.signature) === mt(C) ? y : null, M = w ? Se(w.filter) : co(C.view.filter);
      ct(M), ae(
        w ? sn(w.displayMode, Ne(C)) : an(C)
      ), He(
        w ? w.cardSize ?? dr : dr
      );
      try {
        const k = await Ze(
          C,
          M,
          !w && C.view.startFrom !== "beginning"
        );
        if (!o) return;
        const W = Qr(
          k.items.map((se) => se.id),
          (w == null ? void 0 : w.focusedId) ?? null,
          (w == null ? void 0 : w.index) ?? 0
        );
        ge(W), me(W);
      } catch {
      }
      o && ce(!0);
    })(), () => {
      var y;
      o = !1, Lt.current++, ut.current++, (y = _t.current) == null || y.abort();
    };
  }, [C == null ? void 0 : C.id]);
  const re = yt(
    () => be.items.map((o) => o.id),
    [be.items]
  );
  V(() => {
    if (!oe || !C || !s || j || Ce || X || (le == null ? void 0 : le.id) === C.id || B)
      return;
    const o = {
      version: 1,
      signature: mt(C),
      filter: H,
      focusedId: de,
      index: Math.max(0, re.indexOf(de ?? -1)),
      displayMode: D,
      cardSize: ve,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        s + ":progress:" + C.id,
        JSON.stringify(o)
      );
    } catch {
    }
    if ($) return;
    let d = !0;
    const y = window.setTimeout(() => {
      qi(s, C.id, o).catch((w) => {
        d && Y(
          "Progress is kept in this browser, but account sync failed. " + (w instanceof Error ? w.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      d = !1, window.clearTimeout(y);
    };
  }, [
    oe,
    s,
    C,
    j,
    Ce,
    X,
    H,
    de,
    re,
    D,
    ve,
    le,
    $,
    B
  ]);
  const Xn = be.items.find((o) => o.id === de) ?? null, rr = _ === "video" ? Xn : null;
  p && rr && (G.current = rr);
  const et = rr ?? (p ? G.current : null), Yn = Wr(K, de), Ur = K.size > 0 ? `${K.size} selected ${_}${K.size === 1 ? "" : "s"}` : de == null ? `no ${_}` : `focused ${_}`, me = tt((o, d = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const y = Ct.current.get(o);
      y == null || y.focus({ preventScroll: !0 }), d && (y == null || y.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  V(() => {
    oe && !I.current && me(l.current);
  }, [oe, me]), V(() => {
    j || !re.length || (l.current == null || !re.includes(l.current)) && (ge(re[0]), I.current || me(re[0]));
  }, [me, re, j]);
  const ft = tt(
    (o) => {
      pe((d) => {
        const y = o(d);
        for (const w of /* @__PURE__ */ new Set([...d, ...y]))
          d.has(w) !== y.has(w) && ke.current.set(
            w,
            (ke.current.get(w) ?? 0) + 1
          );
        return y;
      });
    },
    []
  ), nr = tt(
    (o) => {
      if (!re.length) return;
      const d = Math.max(
        0,
        re.indexOf(l.current ?? re[0])
      ), y = re[Math.max(0, Math.min(re.length - 1, d + o))];
      ge(y), I.current || me(y);
    },
    [me, re]
  ), ir = tt(
    async (o) => {
      const d = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", y = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, w = y != null && (!h || !L.some((ne) => ne.id === y)), M = "effect" in o && d && !h, k = Wr(
        ze.current,
        l.current
      );
      if (!C || dt.current || j || Ce || d && !st || M || w || Jt(o) && (ie == null ? void 0 : ie.kind) !== "ready" || !k.length)
        return;
      const W = ++Lt.current, se = C.id, we = [...re], Me = be, Te = l.current, pt = new Set(ze.current), Nt = new Map(
        k.map((ne) => [ne, ke.current.get(ne) ?? 0])
      ), gt = () => W === Lt.current && C.id === se;
      dt.current = !0, Be(!0), Yt(
        ze.current.size ? `${k.length} selected ${_}s` : `the focused ${_}`
      ), Xe(""), Et("");
      const Kr = Me.items.filter(
        (ne) => !k.includes(ne.id)
      ), si = Kr.map((ne) => ne.id), Gr = zr(
        we,
        si,
        Te,
        k.includes(Te ?? -1)
      );
      fe({
        items: Kr,
        totalCount: Me.totalCount
      }), pe((ne) => {
        const ue = new Set(ne);
        for (const he of k) ue.delete(he);
        return ue;
      }), ge(Gr), I.current || me(Gr);
      let ar = !1;
      try {
        if ("effect" in o ? await Gi(o, k) : await Pn(o, k), ar = !0, !gt()) return;
        pe((ne) => {
          const ue = new Set(ne);
          for (const he of k)
            (ke.current.get(he) ?? 0) === Nt.get(he) && ue.delete(he);
          return ue;
        }), Xe(
          `${o.label}: ${k.length} ${_}${k.length === 1 ? "" : "s"} ${d ? "updated" : "skipped"}.`
        );
      } catch (ne) {
        if (!gt()) return;
        fe(Me), pe((ue) => {
          const he = new Set(ue);
          for (const _e of k)
            pt.has(_e) && (ke.current.get(_e) ?? 0) === Nt.get(_e) && he.add(_e);
          return he;
        }), ge(Te), I.current || me(Te), Et(
          ne instanceof Error ? ne.message : "Action failed."
        );
      }
      try {
        if (await Li(o), !gt()) return;
        const ne = await Ze(C, H);
        if (!gt()) return;
        let ue = ne.items.map((he) => he.id);
        if (!ue.length && ne.totalCount > 0 && Number(H.page) > 1) {
          const he = Math.max(1, Number(H.page) - 1), _e = { ...H, page: he };
          ct(_e), ue = (await Ze(C, _e)).items.map((sr) => sr.id), pe(
            (sr) => new Set([...sr].filter((ci) => ue.includes(ci)))
          );
          const Br = ue.at(-1) ?? null;
          ge(Br), I.current || me(Br);
        } else {
          pe(
            (_e) => new Set([..._e].filter((Vr) => ue.includes(Vr)))
          );
          const he = zr(
            we,
            ue,
            Te,
            ar && k.includes(Te ?? -1)
          );
          ge(he), I.current && he == null && R(!1), I.current || me(he);
        }
      } catch (ne) {
        gt() && Et(
          (ue) => `${ue ? `${ue} ` : ""}${ar ? "The action completed, but " : ""}the queue could not be refreshed. ${ne instanceof Error ? ne.message : "Refresh failed."}`
        );
      } finally {
        gt() && (dt.current = !1, Be(!1), Yt(""));
      }
    },
    [
      st,
      h,
      L,
      _,
      ie,
      Ze,
      H,
      me,
      re,
      be,
      j,
      Ce,
      C
    ]
  );
  function Zn() {
    var y;
    if (D === "list") return 1;
    const o = (y = Lr.current) == null ? void 0 : y.firstElementChild, d = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, d.split(" ").filter(Boolean).length);
  }
  function ei(o) {
    if (_ !== "tag" || o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || ot) return;
    if (p && o.key === "Escape") {
      Re(o), R(!1), me(l.current);
      return;
    }
    if (!Tn(o.target)) return;
    if (o.key === "Escape") {
      Re(o), ft(() => /* @__PURE__ */ new Set());
      return;
    }
    const d = (C == null ? void 0 : C.actions.findIndex(
      (M, k) => rt(M, k) === o.key
    )) ?? -1;
    if (d >= 0 && (C != null && C.actions[d])) {
      Re(o), !X && !j && ir(C.actions[d]);
      return;
    }
    if (!p && o.key === " ") {
      Re(o), de != null && ft((M) => Vt(M, de));
      return;
    }
    if (!p && o.key.toLowerCase() === "a") {
      Re(o), ft(
        (M) => Si(M, re)
      );
      return;
    }
    if (X || j || p) return;
    if (o.key === "Enter" && de != null) {
      Re(o), _ === "tag" ? window.open(`/tag/${de}`, "_blank", "noopener,noreferrer") : R(!0);
      return;
    }
    const y = Zn(), w = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -y : o.key === "ArrowDown" ? y : 0;
    w && (Re(o), nr(w));
  }
  function Ut(o) {
    Ee(o), ln(o);
  }
  function ti() {
    Z.current = !0, Je({}), Ut("");
  }
  async function or(o) {
    if (!s) return !1;
    const d = o.map(mo);
    try {
      await Ri(s, d);
    } catch (w) {
      throw w;
    }
    r(d), z && !d.some((w) => w.id === z) && Ut("");
    const y = d.find((w) => w.id === z);
    return y && ee && JSON.stringify(y) !== JSON.stringify(ee) && (y.view.displayMode !== ee.view.displayMode && ae(an(y)), y.entityType === "tag" && mt(y) !== mt(ee) && (We(null), jt(
      y,
      Se({ ...y.view.filter, page: H.page })
    ))), !0;
  }
  if (a)
    return /* @__PURE__ */ n(dn, { label: "Loading reviews…" });
  if (m)
    return /* @__PURE__ */ u(Ae, { children: [
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
          disabled: X,
          onClick: ti,
          children: /* @__PURE__ */ n(bn, {})
        }
      ),
      /* @__PURE__ */ u("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (C == null ? void 0 : C.name) ?? "Data Quality" }),
        (C == null ? void 0 : C.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: C.description })
      ] }),
      C && ee && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: X || j || !Q,
          onClick: () => {
            Qe(!0), Ke(!0);
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
          disabled: X || j || !Q,
          onClick: () => {
            Qe(!1), Ke(!0);
          },
          children: /* @__PURE__ */ n(fi, {})
        }
      )
    ] }),
    v && /* @__PURE__ */ n("p", { className: "dq-status", children: v }),
    U && (ie == null ? void 0 : ie.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      ie.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: Ft,
          onClick: () => {
            $t(!0), Mt(""), Di().then(Dt).catch(
              (o) => Mt(
                "Could not create the Confirmed absent tags custom field. " + (o instanceof Error ? o.message : "Request failed.")
              )
            ).finally(() => $t(!1));
          },
          children: Ft ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    U && ((ie == null ? void 0 : ie.kind) === "incompatible" || Pr) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(pr, {}),
      Pr || (ie == null ? void 0 : ie.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: Ft,
          onClick: () => {
            $t(!0), Dt().finally(
              () => $t(!1)
            );
          },
          children: Ft ? "Checking…" : "Check again"
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
    $ && /* @__PURE__ */ u("p", { role: "alert", children: [
      $,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            Y(""), ye(!1);
          },
          children: B ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    C && ee && C.entityType === "tag" && /* @__PURE__ */ u("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${X || j ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": X || j || void 0,
          inert: X || j ? !0 : void 0,
          onClickCapture: (o) => {
            var y, w, M, k, W;
            const d = o.target instanceof Element ? o.target.closest("button") : null;
            (d == null ? void 0 : d.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((y = d == null ? void 0 : d.textContent) == null ? void 0 : y.trim()) === "Clear all" ? Ye.current = !0 : ((w = d == null ? void 0 : d.getAttribute("aria-label")) != null && w.startsWith("Filters") || (M = d == null ? void 0 : d.getAttribute("aria-label")) != null && M.startsWith("Edit filter:") || ((k = d == null ? void 0 : d.textContent) == null ? void 0 : k.trim()) === "Cancel" || (W = d == null ? void 0 : d.getAttribute("aria-label")) != null && W.startsWith("Close ")) && (Ye.current = !1);
          },
          onKeyDownCapture: (o) => {
            var y, w;
            const d = o.target instanceof Element ? o.target.closest("button") : null;
            (o.key === "Delete" || o.key === "Backspace") && (d == null ? void 0 : d.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (o.preventDefault(), o.stopPropagation(), Ye.current = !0, (w = (y = d.parentElement) == null ? void 0 : y.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || w.click()) : o.key === "Escape" && (Ye.current = !1);
          },
          children: /* @__PURE__ */ n(
            ur,
            {
              filter: Ce ? $e : H,
              onFilterChange: ri,
              totalCount: be.totalCount,
              sortOptions: _ === "tag" ? hn : Nr,
              showSearch: !0,
              showSort: !0,
              displayMode: D,
              onDisplayModeChange: (o) => ae(sn(o, _)),
              availableDisplayModes: _ === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (ve - 225) / 50,
              onZoomChange: (o) => He(Math.round(225 + o * 50)),
              cardSizeEntityType: _ === "tag" ? "tags" : "videos",
              criteriaDefinitions: Hn,
              objectFilter: tr,
              onObjectFilterChange: (o) => {
                if (!X && !j) {
                  const d = _ === "video" ? Dn(o) : o;
                  Ge.current = _ === "video" ? Un(
                    C.view.objectFilter,
                    d,
                    Ye.current
                  ) : d, Ye.current = !1;
                }
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (le == null ? void 0 : le.id) === z && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: X || j || !Q,
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
            disabled: X || j,
            onClick: ni,
            children: /* @__PURE__ */ n(gi, {})
          }
        )
      ] })
    ] }),
    C ? _ !== "tag" ? /* @__PURE__ */ n(ro, { review: C, canWrite: C.entityType === "performerOccurrence" ? b : S, onBusy: Be, onSaveDefaults: Q ? (o) => or(t.map((d) => d.id === o.id ? o : d)) : void 0 }, C.id) : /* @__PURE__ */ u(Ae, { children: [
      U && Ve.error && /* @__PURE__ */ n("p", { role: "alert", children: Ve.error }),
      U && /* @__PURE__ */ n(
        oo,
        {
          videos: be.items,
          review: U,
          trees: Ve.ids,
          disabled: X || j,
          onChoose: (o) => {
            const d = ao(U, o);
            We(d), jt(d, { ...H, page: 1 });
          }
        }
      ),
      Zt && !p && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(pr, {}),
        Zt
      ] }),
      Pt && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: Pt }),
      jr("top"),
      /* @__PURE__ */ u(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${Pe}px`
          },
          children: [
            /* @__PURE__ */ u("main", { children: [
              j && !be.items.length && /* @__PURE__ */ n(dn, { label: "Loading review queue…" }),
              Ce && !j && /* @__PURE__ */ n(
                un,
                {
                  message: Ce,
                  onRetry: () => void Ze(
                    C,
                    H,
                    Le
                  ).catch(() => {
                  })
                }
              ),
              !X && !j && !Ce && !be.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(gr, {}),
                /* @__PURE__ */ u("p", { children: [
                  "No ",
                  _,
                  "s match this review."
                ] })
              ] }),
              !!be.items.length && /* @__PURE__ */ n("div", { ref: Lr, children: /* @__PURE__ */ n(
                "div",
                {
                  className: D === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${ve}px`
                  },
                  children: be.items.map(ai)
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
                "aria-valuemin": Er,
                "aria-valuemax": Cr,
                "aria-valuenow": Pe,
                "aria-valuetext": `${Pe} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (o) => {
                  xt.current = {
                    pointerId: o.pointerId,
                    startX: o.clientX,
                    startWidth: Pe
                  }, o.currentTarget.setPointerCapture(o.pointerId);
                },
                onPointerMove: (o) => {
                  const d = xt.current;
                  (d == null ? void 0 : d.pointerId) === o.pointerId && o.currentTarget.hasPointerCapture(o.pointerId) && er(
                    d.startWidth + d.startX - o.clientX
                  );
                },
                onPointerUp: () => {
                  xt.current = null;
                },
                onPointerCancel: () => {
                  xt.current = null;
                },
                onKeyDown: zn,
                onDoubleClick: () => er(Or),
                children: /* @__PURE__ */ n("span", {})
              }
            ),
            /* @__PURE__ */ u("aside", { className: "dq-actions", children: [
              K.size > 0 && /* @__PURE__ */ n("strong", { children: Ur }),
              C.actions.map((o, d) => {
                const y = "steps" in o ? o.steps.length > 0 : o.effect.mode !== "SKIP", w = "effect" in o && o.effect.mode === "SET_TAG_GROUP" ? o.effect.tagGroupId : null, M = w != null ? L.find((W) => W.id === w) : void 0, k = w != null && !M;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    disabled: X || j || !!Ce || y && !st || "effect" in o && y && (!h || k) || Jt(o) && (ie == null ? void 0 : ie.kind) !== "ready" || !Yn.length,
                    onClick: () => void ir(o),
                    children: [
                      /* @__PURE__ */ u("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: o.label }),
                        "effect" in o ? /* @__PURE__ */ n("small", { children: o.effect.mode === "SKIP" ? "Skip" : o.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : M ? `Assign ${M.name}` : "Unavailable tag group" }) : o.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: o.steps.flatMap(
                          (W, se) => W.tagIds.map((we, Me) => {
                            const Te = $r[we] === void 0 ? "Tag" : $r[we] ?? "Unavailable tag", pt = Jn(W, Te), Nt = fo(W, Te);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": Bn(W.mode),
                                "aria-label": Nt,
                                title: `Step ${se + 1}: ${Nt}`,
                                children: pt
                              },
                              `${se}-${we}-${Me}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      rt(o, d) && /* @__PURE__ */ n("kbd", { children: rt(o, d) })
                    ]
                  },
                  o.id
                );
              }),
              !C.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              !st && /* @__PURE__ */ u("p", { children: [
                _ === "tag" ? "Tag" : "Video",
                " write permission is required to apply actions."
              ] }),
              _ === "tag" && q && /* @__PURE__ */ u("p", { children: [
                "Tag groups are unavailable. ",
                q
              ] }),
              X && /* @__PURE__ */ u("p", { role: "status", children: [
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
                  ref: St,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ n("p", { children: "Choose a review to open its queue." }),
              /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                (o) => Ie[o.id] !== void 0
              ) ? t.some((o) => Ie[o.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: nt,
                    onChange: (o) => Ot(
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
                  onClick: () => it(
                    (o) => o === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    vn,
                    {
                      className: Fe === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: Ht.map((o) => {
            const d = Ie[o.id], y = Ne(o), w = y === "tag" ? "tag" : y === "performerOccurrence" ? "scene" : "video";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                disabled: X,
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
      /* @__PURE__ */ n(gr, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    p && et && U && /* @__PURE__ */ n(
      wo,
      {
        video: et,
        review: U,
        targetLabel: Ur,
        pending: X,
        refreshing: j || !!Ce,
        error: Zt,
        canWrite: S,
        assessmentReady: (ie == null ? void 0 : ie.kind) === "ready",
        selected: K.has(et.id),
        hasPrevious: re.indexOf(et.id) > 0,
        hasNext: re.indexOf(et.id) >= 0 && re.indexOf(et.id) < re.length - 1,
        onToggleSelected: () => ft((o) => Vt(o, et.id)),
        onPrevious: () => nr(-1),
        onNext: () => nr(1),
        onClose: () => {
          R(!1), me(l.current);
        },
        onAction: ir
      }
    ),
    ot && /* @__PURE__ */ n(
      vo,
      {
        reviews: t,
        activeReview: ee,
        tagGroups: L,
        initialEdit: at,
        onSave: or,
        onChoose: Ut,
        onClose: () => {
          Ke(!1), at && me(l.current, !1);
        }
      }
    )
  ] });
  async function jt(o, d, y = !1) {
    const w = l.current, M = Math.max(0, re.indexOf(w ?? -1));
    try {
      const W = (await Ze(o, d, y)).items.map((we) => we.id);
      pe(
        (we) => new Set([...we].filter((Me) => W.includes(Me)))
      );
      const se = Qr(W, w, M);
      ge(se), I.current || me(se, !1);
    } catch {
    }
  }
  function ri(o) {
    const d = Ge.current;
    if (Ge.current = null, X || j || !C || !ee) return;
    const y = d ?? C.view.objectFilter, w = Sr(
      y,
      ee.view.objectFilter
    ) ? ee.view.objectFilter : y, M = Se({ ...o, page: 1 }), k = {
      ...C,
      view: {
        ...C.view,
        filter: M,
        objectFilter: w
      }
    }, W = mt(k) !== mt(ee), se = W ? k : ee;
    We(W ? k : null), Xe(W ? "" : "Review queue defaults restored."), jt(se, M, !0);
  }
  function ni() {
    if (X || j || !ee) return;
    Ge.current = null;
    const o = Se({
      ...ee.view.filter,
      page: 1
    });
    We(null), Xe("Review queue defaults restored."), jt(
      ee,
      o,
      ee.view.startFrom !== "beginning"
    );
  }
  function ii() {
    X || j || !C || !ee || !Q || or(
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
      We(null), Xe("Queue saved to this review.");
    }).catch(
      (o) => Et(
        o instanceof Error ? o.message : "Could not save queue."
      )
    );
  }
  function oi() {
    pe(/* @__PURE__ */ new Set()), ke.current.clear(), ge(null);
  }
  function jr(o) {
    return C ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: X || j,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          mn,
          {
            filter: {
              ...H,
              page: Number(H.page) || 1,
              perPage: Number(H.perPage) || 40
            },
            totalCount: be.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${o}`,
            onFilterChange: (d) => {
              X || j || d.page === Number(H.page) || go(
                { ...H, page: d.page },
                C,
                Ze,
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
      const y = o;
      return /* @__PURE__ */ n(
        ho,
        {
          tag: y,
          displayMode: D === "list" ? "list" : "grid",
          focused: y.id === de,
          selected: K.has(y.id),
          setRef: (w) => {
            w ? Ct.current.set(y.id, w) : Ct.current.delete(y.id);
          },
          onFocus: () => ge(y.id),
          onToggle: () => ft((w) => Vt(w, y.id)),
          onOpen: () => window.open(`/tag/${y.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        y.id
      );
    }
    const d = o;
    return /* @__PURE__ */ n(
      yo,
      {
        video: io(d, U, Ve.ids),
        displayMode: D,
        focused: d.id === de,
        selected: K.has(d.id),
        setRef: (y) => {
          y ? Ct.current.set(d.id, y) : Ct.current.delete(d.id);
        },
        onFocus: () => ge(d.id),
        onToggle: () => ft((y) => Vt(y, d.id)),
        onPreview: () => {
          ge(d.id), R(!0);
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
  setRef: s,
  onFocus: c,
  onToggle: a,
  onOpen: f,
  onNavigate: m
}) {
  return /* @__PURE__ */ n(
    "article",
    {
      ref: s,
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
          onSelect: a,
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
              g.stopPropagation(), a();
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
  setRef: s,
  onFocus: c,
  onToggle: a,
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
    const h = S.current;
    if (!h) return;
    const P = h.querySelector(
      `a[href="/video/${e.id}"]`
    ), L = h.querySelector(".card-title"), J = `dq-card-title-${e.id}`;
    L && (L.id = J), P && (P.target = "_blank", P.rel = "noreferrer", P.removeAttribute("aria-label"), P.setAttribute("aria-labelledby", J), P.classList.add("dq-card-link"));
    const q = h.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    q && q.setAttribute(
      "aria-label",
      i ? `Deselect ${g}` : `Select ${g}`
    );
    const te = h.querySelector(
      'button[title="Quick View"]'
    );
    te && te.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (h) => {
        S.current = h, s(h);
      },
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${g}${i ? ", selected" : ""}`,
      onFocus: c,
      onClick: (h) => {
        c(), h.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${t} ${b ? "has-card-metadata" : "no-card-metadata"} ${A ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          di,
          {
            video: E,
            selected: i,
            onSelect: a,
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
  const t = F(null), r = F(null), [i, s] = N(!1), [c, a] = N(!1), [f, m] = N(!1);
  return V(() => {
    const g = t.current;
    if (!g || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      s(!0), a(!0);
      return;
    }
    const S = new IntersectionObserver(
      ([b]) => s(b.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), E = new IntersectionObserver(
      ([b]) => a(b.isIntersecting && b.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return S.observe(g), E.observe(g), () => {
      S.disconnect(), E.disconnect();
    };
  }, [e.id, e.files.length]), V(() => {
    if (!i) {
      m(!1);
      return;
    }
    const g = new AbortController();
    return x(xi(e.id), {
      signal: g.signal
    }).then((S) => {
      g.signal.aborted || m(S.available === !0);
    }).catch(() => {
      g.signal.aborted || m(!1);
    }), () => g.abort();
  }, [i, e.id]), V(() => {
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
  refreshing: s,
  error: c,
  canWrite: a,
  assessmentReady: f,
  selected: m,
  hasPrevious: g,
  hasNext: S,
  onToggleSelected: E,
  onPrevious: b,
  onNext: A,
  onClose: h,
  onAction: P
}) {
  const L = F(null), J = F(null), q = e.files[0], te = Kn(e);
  V(() => {
    var O;
    const v = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (O = L.current) == null || O.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = v;
    };
  }, []);
  function Q(v) {
    var Y, B, ye;
    if (v.key !== "Tab") return;
    const O = [
      ...((Y = L.current) == null ? void 0 : Y.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((oe) => oe.offsetParent !== null);
    if (!O.length) {
      v.preventDefault(), (B = L.current) == null || B.focus();
      return;
    }
    const $ = O.indexOf(
      document.activeElement
    );
    v.shiftKey && $ <= 0 ? (v.preventDefault(), (ye = O.at(-1)) == null || ye.focus()) : !v.shiftKey && $ === O.length - 1 && (v.preventDefault(), O[0].focus());
  }
  function T(v) {
    if (v.defaultPrevented || v.ctrlKey || v.metaKey || v.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const O = v.key === "ArrowLeft" || v.key === "ArrowRight";
    if (v.altKey && !O) return;
    const $ = J.current, Y = v.currentTarget.querySelector("video");
    if (v.key === "Enter" || v.key === "Escape")
      v.repeat || h();
    else if (v.key === " " && $)
      v.repeat || $.toggle();
    else if (O && $)
      $.seekBy(
        (v.key === "ArrowLeft" ? -1 : 1) * (v.shiftKey ? 5 : v.altKey ? 10 : 60)
      );
    else if ((v.key === "," || v.key === ".") && $) {
      const B = [q == null ? void 0 : q.duration, Y == null ? void 0 : Y.duration].find(
        (oe) => oe != null && Number.isFinite(oe) && oe > 0
      ) ?? 0, ye = e.parentVideoId != null ? (e.clipEndSec ?? B) - (e.clipStartSec ?? 0) : B;
      Number.isFinite(ye) && ye > 0 && $.seekBy((v.key === "," ? -1 : 1) * ye * 0.1);
    } else if (v.key.toLowerCase() === "n" || v.key.toLowerCase() === "m")
      !v.repeat && !i && !s && (v.key.toLowerCase() === "n" && g && b(), v.key.toLowerCase() === "m" && S && A());
    else if (v.key === "ArrowUp" && Y)
      Y.volume = Math.min(1, Y.volume + 0.1);
    else if (v.key === "ArrowDown" && Y)
      Y.volume = Math.max(0, Y.volume - 0.1);
    else return;
    Re(v);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: L,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${te}`,
      className: "dq-preview",
      onKeyDown: Q,
      onKeyDownCapture: T,
      onMouseDown: (v) => {
        v.target === v.currentTarget && h();
      },
      children: /* @__PURE__ */ u("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ u("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !g || i || s,
              onClick: b,
              children: /* @__PURE__ */ n(bn, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !S || i || s,
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
              disabled: s,
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
              onClick: h,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(En, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: q ? /* @__PURE__ */ n(
          gn,
          {
            autostart: !0,
            streamUrl: kn(e.id),
            posterUrl: Yr(e),
            format: q.format,
            audioCodec: q.audioCodec,
            duration: q.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (v) => (J.current = v, () => {
              J.current === v && (J.current = null);
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
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((v, O) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: i || s || v.steps.length > 0 && !a || Jt(v) && !f,
            onClick: () => void P(v),
            children: [
              rt(v, O) && /* @__PURE__ */ n("kbd", { children: rt(v, O) }),
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
  onSave: s,
  onChoose: c,
  onClose: a
}) {
  const [f, m] = N(
    () => i && t ? structuredClone(t) : null
  ), [g, S] = N(""), [E, b] = N(!1), [A, h] = N(
    i && t != null
  ), P = F(null);
  V(() => {
    var O, $;
    const T = document.activeElement, v = document.body.style.overflow;
    return document.body.style.overflow = "hidden", ($ = (O = P.current) == null ? void 0 : O.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || $.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = v, T == null || T.focus({ preventScroll: !0 });
    };
  }, []);
  function L(T) {
    var $, Y, B;
    if (T.defaultPrevented) {
      T.stopPropagation();
      return;
    }
    if (T.key === "Escape") {
      Re(T), E || a();
      return;
    }
    if (T.key !== "Tab") {
      T.stopPropagation();
      return;
    }
    const v = [
      ...(($ = P.current) == null ? void 0 : $.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ye) => ye.offsetParent !== null);
    if (!v.length) {
      Re(T), (Y = P.current) == null || Y.focus();
      return;
    }
    const O = v.indexOf(
      document.activeElement
    );
    T.shiftKey && O <= 0 ? (Re(T), (B = v.at(-1)) == null || B.focus()) : !T.shiftKey && O === v.length - 1 ? (Re(T), v[0].focus()) : T.stopPropagation();
  }
  function J(T, v = !!T) {
    h(v), m(
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
  async function q() {
    if (E) return;
    if (!f || mr(f)) {
      S(f ? mr(f) : "Choose a review.");
      return;
    }
    const T = { ...f, name: f.name.trim() }, v = e.some((O) => O.id === T.id) ? e.map((O) => O.id === T.id ? T : O) : [...e, T];
    b(!0), S("");
    try {
      if (!await s(v)) throw new Error("Could not save reviews.");
      c(T.id), a();
    } catch (O) {
      S(
        "Could not save reviews. Your edits are still open. " + (O instanceof Error ? O.message : "Retry saving.")
      );
    } finally {
      b(!1);
    }
  }
  async function te(T) {
    if (!E) {
      b(!0), S("");
      try {
        if (!await s(T)) throw new Error("Could not save reviews.");
      } catch (v) {
        S(
          v instanceof Error ? v.message : "Could not save reviews."
        );
      } finally {
        b(!1);
      }
    }
  }
  async function Q(T) {
    var O;
    if (E) return;
    const v = (O = T.target.files) == null ? void 0 : O[0];
    if (T.target.value = "", !!v) {
      if (v.size > 2e6) {
        S("Review files must be smaller than 2 MB.");
        return;
      }
      b(!0), S("");
      try {
        const $ = Rt(await v.text());
        if (!await s(hr(e, $)))
          throw new Error("Could not save reviews.");
      } catch ($) {
        S(
          $ instanceof Error ? $.message : "Could not import reviews."
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
      onKeyDown: L,
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
              onClick: a,
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
            onSave: () => void q(),
            onCancel: a
          }
        ) : /* @__PURE__ */ u(Ae, { children: [
          /* @__PURE__ */ u("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ u(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => J(),
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
                  onChange: Q
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((T) => /* @__PURE__ */ u("article", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ u("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(jn, { entityType: Ne(T) }),
                /* @__PURE__ */ n("strong", { children: T.name })
              ] }),
              /* @__PURE__ */ n("p", { children: T.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => J(T), children: [
              /* @__PURE__ */ n(wn, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => J({
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
  setDraft: s,
  onSave: c,
  onCancel: a
}) {
  const [f, m] = N("Review"), g = Ne(e), S = (A) => {
    if (!(t || A === g)) {
      if (A === "performerOccurrence") {
        s({
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
      s(
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
    let h = E.current.get(A);
    return h || (h = crypto.randomUUID(), E.current.set(A, h)), h;
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
              onChange: (A) => s({ ...e, name: A.target.value })
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
              onChange: (A) => s({ ...e, description: A.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u("section", { hidden: f !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ n(on, { draft: e, onChange: s, presentation: !1 }),
        e.entityType === "performerOccurrence" && /* @__PURE__ */ n(nn, { review: e, onChange: s })
      ] }),
      e.entityType === "performerOccurrence" && /* @__PURE__ */ n("section", { hidden: f !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n(nn, { review: e, onChange: s, choices: !0 }) }),
      /* @__PURE__ */ n("section", { hidden: f !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(on, { draft: e, onChange: s, queue: !1 }) }),
      /* @__PURE__ */ n("section", { hidden: f !== "Actions", className: "dq-editor-section", children: g === "tag" ? /* @__PURE__ */ n(
        Co,
        {
          draft: e,
          saving: i,
          tagGroups: r,
          setDraft: s
        }
      ) : /* @__PURE__ */ n(
        Eo,
        {
          draft: e,
          saving: i,
          stepKey: b,
          rememberStepKey: (A, h) => E.current.set(A, b(h)),
          setDraft: s
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
            ), h = document.createElement("a");
            h.href = A, h.download = "data-quality-review.json", h.click(), URL.revokeObjectURL(A);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: a, children: "Cancel" }),
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
  setDraft: s
}) {
  const c = (a, f) => s({
    ...e,
    actions: e.actions.map(
      (m, g) => g === a ? f : m
    )
  });
  return /* @__PURE__ */ u(Ae, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    e.entityType === "performerOccurrence" && /* @__PURE__ */ n("p", { children: "Actions apply only to the active performer in this scene. Choose performers with the temporary filter while reviewing." }),
    /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      fr,
      {
        items: e.actions,
        getKey: (a) => a.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (a) => s({ ...e, actions: a }),
        renderItem: (a, { index: f, dragHandleProps: m, isOver: g }) => /* @__PURE__ */ u(
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
                    children: /* @__PURE__ */ n(Ar, {})
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
                Qn,
                {
                  action: a,
                  index: f,
                  onChange: (S) => c(f, S)
                }
              ),
              /* @__PURE__ */ n(
                fr,
                {
                  items: a.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (S) => c(f, { ...a, steps: S }),
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
                          ...a,
                          steps: a.steps.map(
                            (A, h) => h === E.index ? b : A
                          )
                        });
                      },
                      onRemove: () => c(f, {
                        ...a,
                        steps: a.steps.filter(
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
function Co({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: i
}) {
  const s = (c, a) => i({
    ...e,
    actions: e.actions.map(
      (f, m) => m === c ? a : f
    )
  });
  return /* @__PURE__ */ u(Ae, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      fr,
      {
        items: e.actions,
        getKey: (c) => c.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (c) => i({ ...e, actions: c }),
        renderItem: (c, { index: a, dragHandleProps: f, isOver: m }) => /* @__PURE__ */ u(
          "fieldset",
          {
            className: m ? "dq-action-card dq-drag-over" : "dq-action-card",
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
                    children: /* @__PURE__ */ n(Ar, {})
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
                Qn,
                {
                  action: c,
                  index: a,
                  onChange: (g) => s(a, g)
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
                      s(a, {
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
                      (g, S) => S !== a
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
  saving: s,
  isOver: c,
  onChange: a,
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
            disabled: s,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${r + 1}`,
            children: /* @__PURE__ */ n(Ar, {})
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
            onChange: (g) => a({ ...t, mode: g.target.value }),
            children: [
              /* @__PURE__ */ n("option", { value: "ADD", children: "Add tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE", children: "Remove tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE_TREE", children: "Remove tags and descendants" }),
              !e && /* @__PURE__ */ u(Ae, { children: [
                /* @__PURE__ */ n("option", { value: "MARK_PRESENT", children: "Mark present" }),
                /* @__PURE__ */ n("option", { value: "MARK_ABSENT", children: "Mark absent" }),
                /* @__PURE__ */ n("option", { value: "CLEAR_ABSENCE", children: "Clear absence" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ n("div", { className: "dq-step-tags", children: /* @__PURE__ */ n(
          Ue,
          {
            entityType: "tag",
            values: t.tagIds,
            onChange: (g) => a({ ...t, tagIds: g }),
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
    /* @__PURE__ */ n(pr, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const ko = { components: { DataQualityPage: po } };
export {
  po as DataQualityPage,
  ko as default,
  Sr as objectFiltersEqual
};
