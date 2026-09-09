import { jsxs as d, jsx as i, Fragment as ve } from "react/jsx-runtime";
import { useState as N, useEffect as H, useRef as D, useMemo as Ge, useCallback as Re, useLayoutEffect as Fr } from "react";
import { TAG_SORT_OPTIONS as Ur, VIDEO_SORT_OPTIONS as jr, FilterDialog as kn, TAG_CRITERIA as Kr, VIDEO_CRITERIA as Dt, EntityReferenceMultiSelector as xt, DetailListToolbar as Pn, DetailListPagination as Mn, VideoPlayer as _n, TagTile as $n, VideoCard as Ln, EntityDetailTabs as Dn, SortableList as Ft } from "@cove/runtime/components";
import { ChevronLeft as Gr, Pencil as Br, Settings as xn, AlertTriangle as Ut, Save as Fn, RotateCcw as Un, ChevronRight as Vr, Film as jt, Loader2 as Jr, Tags as jn, ExternalLink as Kn, X as Wr, Plus as Gn, Upload as Bn, Trash2 as zr, GripVertical as Qt } from "@cove/runtime/lucide-react";
import { extensionFetch as Vn } from "@cove/runtime/api";
function ce(e) {
  return e.entityType === "tag" ? "tag" : "video";
}
function Ve(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function Kt(e) {
  if (ce(e) === "video" && e.actions.some(
    (r) => Qr(r)
  ))
    return "An action cannot contain contradictory assessments for the same tag.";
  if (!e.name.trim() || !e.actions.every((r) => Je(r, ce(e))))
    return "Name the review and complete every action step before saving.";
  if (new Set(e.actions.map((r) => r.id)).size !== e.actions.length)
    return "Action IDs must be unique within a review.";
  const t = e.actions.map(
    (r, o) => r.shortcut ?? (o < 9 ? String(o + 1) : "")
  ).filter(Boolean);
  return t.some((r) => !/^[1-9]$/.test(r)) || new Set(t).size !== t.length ? "Assign each shortcut 1–9 only once, or choose None. Navigation and player keys are reserved." : "";
}
function be(e) {
  const t = (r, o) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : o;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(1e3, t(e.perPage, 40)))
  };
}
function Tr(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function $e(e) {
  const { page: t, ...r } = e.view.filter, o = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    ce(e) === "tag" ? ["tag", ...o] : o
  );
}
function Je(e, t) {
  const r = t ?? ("effect" in e ? "tag" : "video");
  return e.label.trim() ? r === "tag" ? !("effect" in e) || "steps" in e || !e.effect || typeof e.effect != "object" ? !1 : ["SET_TAG_GROUP", "CLEAR_TAG_GROUP", "SKIP"].includes(
    e.effect.mode
  ) && (e.effect.mode !== "SET_TAG_GROUP" || Number.isSafeInteger(e.effect.tagGroupId) && e.effect.tagGroupId > 0) : !("steps" in e) || "effect" in e ? !1 : e.steps.every(
    (o) => [
      "ADD",
      "REMOVE",
      "REMOVE_TREE",
      "MARK_PRESENT",
      "MARK_ABSENT",
      "CLEAR_ABSENCE"
    ].includes(o.mode) && o.tagIds.length > 0 && o.tagIds.every((s) => Number.isSafeInteger(s) && s > 0)
  ) && !Qr(e) : !1;
}
function wt(e) {
  return "steps" in e ? e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  ) : !1;
}
function Qr(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.steps)
    if (["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(r.mode))
      for (const o of r.tagIds) {
        const s = t.get(o);
        if (s && s !== r.mode) return !0;
        t.set(o, r.mode);
      }
  return !1;
}
function ze(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || r.entityType === "video" || r.entityType === "tag") && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Jn(r.presentation, r.entityType === "tag") && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (o) => typeof o == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (o) => typeof (o == null ? void 0 : o.id) == "string" && typeof o.label == "string" && (o.shortcut === void 0 || typeof o.shortcut == "string") && (r.entityType === "tag" ? "effect" in o && !("steps" in o) && Je(o, "tag") : "steps" in o && !("effect" in o) && Array.isArray(o.steps) && o.steps.every(
        (s) => s && Array.isArray(s.tagIds)
      ) && Je(o, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => Kt(r)))
    throw new Error(
      "Saved reviews contain invalid actions or shortcuts. Existing data has been kept; assign shortcuts 1–9 only once or leave them empty."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Jn(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const r = e;
  return (r.cardSize === void 0 || r.cardSize === null || Number.isFinite(r.cardSize) && r.cardSize >= 115 && r.cardSize <= 380) && (!t || r.annotations === void 0 && r.annotationParents === void 0 && r.binParents === void 0) && (r.annotations === void 0 || Array.isArray(r.annotations) && r.annotations.every(
    (o) => ["date", "studio", "performers", "tags"].includes(o)
  )) && [r.annotationParents, r.binParents].every(
    (o) => o === void 0 || Array.isArray(o) && o.every((s) => Number.isSafeInteger(s) && s > 0)
  );
}
function Gt(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const o of e)
    for (const s of o)
      r.has(s.id) || (r.add(s.id), t.push(s));
  return t;
}
function Rr(e, t) {
  return e.size > 0 ? [...e].sort((r, o) => r - o) : t == null ? [] : [t];
}
function qr(e, t, r, o) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!o && t.includes(r)) return r;
  const s = Math.max(0, e.indexOf(r));
  if (o) {
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
function Wn(e, t) {
  const r = new Set(e), o = t.length > 0 && t.every((s) => r.has(s));
  for (const s of t)
    o ? r.delete(s) : r.add(s);
  return r;
}
function zn(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const Hr = "ext:com.midnightrider.data-quality:configuration", Qn = "ext:cove-data-quality:video-reviews", Bt = "ext:com.midnightrider.data-quality:progress", Qe = /* @__PURE__ */ new Map(), bt = /* @__PURE__ */ new Map(), Le = (e, t) => e.includes("*") || e.includes(t), vt = (e) => F(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Hn = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Vt(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function De(e) {
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
    reviews: ze(JSON.stringify(t.reviews)),
    deletedIds: Vt(t.deletedIds),
    importedIds: Vt(t.importedIds)
  };
}
function Xn(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const o = /* @__PURE__ */ new Set();
  for (const s of t) {
    const c = localStorage.getItem(s);
    if (c !== null) {
      const l = ze(c);
      r ?? (r = l), l.forEach((f) => o.add(f.id));
    }
    Vt(
      JSON.parse(localStorage.getItem(`${s}:account-imports`) ?? "[]")
    ).forEach((l) => o.add(l));
  }
  return {
    reviews: r ?? [],
    known: [...o],
    present: r !== void 0
  };
}
async function Xr(e) {
  const t = await F("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Yr(e, t) {
  const r = (bt.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return bt.set(e, r), r.finally(() => {
    bt.get(e) === r && bt.delete(e);
  }).catch(() => {
  }), r;
}
let Be = null;
function Yn() {
  if (Be) return Be;
  const e = Zn();
  return Be = e, e.finally(() => {
    Be === e && (Be = null);
  }).catch(() => {
  }), e;
}
async function Zn() {
  var m;
  const e = await F("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, o = Le(e.permissions, "savedfilters.read"), s = o && Le(e.permissions, "savedfilters.write"), c = o ? (await vt(Hr)).filter((S) => S.name === "Data Quality configuration").sort((S, w) => S.id - w.id) : [];
  if (c.length > 1) {
    const S = (w) => {
      const { revision: I, ...P } = De(w.uiOptions);
      return JSON.stringify(P);
    };
    if (c.some((w) => S(w) !== S(c[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (s)
      for (const w of c.slice(1))
        await F(`/api/savedfilters/${w.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${w.id}` })
        });
    c.splice(1);
  }
  let l = c.length ? De(c[0].uiOptions) : Hn();
  const f = localStorage.getItem(`${r}:migrated`) === "true", C = localStorage.getItem(r), p = localStorage.getItem(`${r}:local-only`) === "true";
  !c.length && C && (l = De(C));
  let b = !c.length;
  if (c.length && p && C) {
    const S = De(C);
    if (S.reviews.some((I) => {
      const P = l.reviews.find((x) => x.id === I.id);
      return P && JSON.stringify(P) !== JSON.stringify(I);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const w = [
      .../* @__PURE__ */ new Set([...l.deletedIds, ...S.deletedIds])
    ];
    l = {
      ...l,
      reviews: Gt(l.reviews, S.reviews).filter(
        (I) => !w.includes(I.id)
      ),
      deletedIds: w,
      importedIds: [
        .../* @__PURE__ */ new Set([...l.importedIds, ...S.importedIds])
      ]
    }, b = !0;
  }
  if (!f) {
    const S = JSON.stringify(l), w = Xn(t);
    if (c.length && w.reviews.some((R) => {
      const V = l.reviews.find((W) => W.id === R.id);
      return V && JSON.stringify(V) !== JSON.stringify(R);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const I = o ? (await vt(Qn)).flatMap(
      (R) => ze(R.uiOptions ?? "[]")
    ) : [], P = w.known.filter(
      (R) => !w.reviews.some((V) => V.id === R)
    ), x = /* @__PURE__ */ new Set([...l.deletedIds, ...P]);
    l = {
      ...l,
      reviews: Gt(
        w.reviews,
        l.reviews,
        I.filter(
          (R) => !w.known.includes(R.id) && !l.importedIds.includes(R.id)
        )
      ).filter((R) => !x.has(R.id)),
      deletedIds: [...x],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...l.importedIds,
          ...w.known,
          ...I.map((R) => R.id)
        ])
      ]
    }, b || (b = JSON.stringify(l) !== S);
  }
  const y = {
    userId: t,
    recordId: (m = c[0]) == null ? void 0 : m.id,
    config: l,
    readable: o,
    writable: s,
    durable: s
  };
  if (Qe.set(r, y), b && s) {
    const S = l;
    c.length && (y.config = De(c[0].uiOptions)), await Zr(r, S), l = y.config;
  } else c.length || (localStorage.setItem(r, JSON.stringify(l)), !o && (!f || p) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!o) localStorage.setItem(`${r}:migrated`, "true");
  else if (s)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: l.reviews,
    storageKey: r,
    canWrite: Le(e.permissions, "videos.write"),
    canWriteVideos: Le(e.permissions, "videos.write"),
    canWriteTags: Le(e.permissions, "tags.write"),
    canReadTagGroups: Le(e.permissions, "taggroups.read"),
    canConfigure: !o || s,
    storageNotice: o ? s ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Zr(e, t) {
  const r = Qe.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const o = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await Xr(r), r.recordId != null) {
      const c = await F(
        `/api/savedfilters/${r.recordId}`
      );
      if (De(c.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const s = await F(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Hr,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(o)
        })
      }
    );
    r.recordId = s.id;
  } else
    localStorage.setItem(e, JSON.stringify(o)), localStorage.setItem(`${e}:local-only`, "true");
  if (r.config = o, r.durable)
    try {
      localStorage.setItem(e, JSON.stringify(o)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function ei(e, t) {
  return ze(JSON.stringify(t)), Yr(e, async () => {
    const r = Qe.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const o = r.config.reviews.filter((s) => !t.some((c) => c.id === s.id)).map((s) => s.id);
    await Zr(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...o])
      ].filter((s) => !t.some((c) => c.id === s))
    });
  });
}
function Ir(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function ti(e, t) {
  const r = Qe.get(e);
  if (!r) return null;
  const o = localStorage.getItem(`${e}:progress:${t}`), s = o ? Ir(o) : null;
  if (!r.readable) return s;
  const c = (await vt(Bt)).find(
    (f) => f.name === t
  ), l = c ? Ir(c.uiOptions) : null;
  return s && (!l || s.updatedAt > l.updatedAt) ? s : l;
}
function ri(e, t, r) {
  const o = `${e}:progress:${t}`;
  try {
    localStorage.setItem(o, JSON.stringify(r));
  } catch {
  }
  return Yr(o, async () => {
    const s = Qe.get(e);
    if (!(s != null && s.writable)) return;
    await Xr(s);
    const c = (await vt(Bt)).find(
      (l) => l.name === t
    );
    await F(
      c ? `/api/savedfilters/${c.id}` : "/api/savedfilters",
      {
        method: c ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Bt,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const He = "confirmed_absent_tags", Ht = "Confirmed absent tags", ni = {
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
function We(e) {
  return Array.isArray(e) ? e.map(We) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? ni[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === He.toLowerCase() ? r.toLowerCase() : We(r)
    ])
  ) : e;
}
async function F(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const o = await Vn(e, { ...t, headers: r });
  if (!o.ok) {
    let c = o.statusText || `Request failed (${o.status}).`;
    try {
      const l = await o.json();
      c = l.message || l.detail || l.error || c;
    } catch {
    }
    throw new Error(c);
  }
  if (o.status === 204 || o.status === 205) return;
  const s = await o.text();
  return s ? JSON.parse(s) : void 0;
}
async function Or(e, t, r) {
  const o = { ...e.view.objectFilter }, s = o._filterExpression;
  if (delete o._filterExpression, delete o.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return F("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      We({
        findFilter: be(t),
        objectFilter: o,
        filterExpression: s
      })
    )
  });
}
async function kr(e, t, r) {
  const o = { ...e.view.objectFilter };
  return delete o._filterExpression, F("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      We({
        findFilter: be(t),
        objectFilter: o
      })
    )
  });
}
function ii(e) {
  return F("/api/taggroups", { signal: e });
}
function oi(e) {
  return `/api/stream/video/${e}`;
}
function Pr(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function ai(e) {
  return `/api/stream/video/${e}/preview`;
}
function si(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function li(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Xt(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await F(`/api/tags/${r}`), t.add(r);
    for (let o = 1; ; o++) {
      const s = await F("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          We({
            findFilter: { page: o, perPage: 1e3, sort: "id", direction: "asc" },
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
      if (o * 1e3 >= s.totalCount) break;
      if (!s.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...t];
}
function ci(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${He} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function Yt() {
  const t = (await F("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === He.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${Ht} custom field before applying tag assessments.`
    };
  const r = ci(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function di() {
  const e = await Yt();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await F("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: He,
        label: Ht,
        type: "tag",
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function St(e) {
  return [...new Set(e)];
}
function ui(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${He} value is not a valid tag list.`
    );
  return St(e);
}
function fi(e) {
  return St(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function pi(e, t) {
  let r;
  try {
    r = await Yt();
  } catch (p) {
    throw new Error(
      `Could not verify the ${Ht} custom field. ${p instanceof Error ? p.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const o = await Promise.all(
    e.steps.map(async (p) => ({
      ...p,
      tagIds: p.mode === "REMOVE_TREE" ? await Xt(p.tagIds) : St(p.tagIds)
    }))
  ), s = o.filter(
    (p) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(p.mode)
  ), c = o.filter(
    (p) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(p.mode)
  ), l = St(t), f = r.definition.key;
  let C = 0;
  for (const p of l)
    try {
      const b = await F(`/api/videos/${p}`), y = fi(b), m = { ...b.customFields ?? {} }, S = m[f], w = ui(S), I = new Set(y), P = new Set(w);
      for (const W of s)
        for (const E of W.tagIds)
          W.mode === "ADD" ? I.add(E) : I.delete(E);
      for (const W of c)
        for (const E of W.tagIds)
          W.mode === "MARK_PRESENT" ? (I.add(E), P.delete(E)) : W.mode === "MARK_ABSENT" ? (I.delete(E), P.add(E)) : P.delete(E);
      const x = [...I], R = [...P];
      JSON.stringify(y) === JSON.stringify(x) && JSON.stringify(w) === JSON.stringify(R) && (S === void 0 ? R.length === 0 : JSON.stringify(S) === JSON.stringify(w)) || await F(`/api/videos/${p}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: x,
          customFields: {
            ...m,
            [f]: R
          }
        })
      }), C++;
    } catch (b) {
      throw new Error(
        `Assessment stopped after ${C} video${C === 1 ? "" : "s"} completed; video ${p} was affected. Refresh and inspect it before retrying. ${b instanceof Error ? b.message : "Request failed."}`
      );
    }
}
async function gi(e, t) {
  if (!Je(e) || t.length === 0 || t.some((o) => !Number.isSafeInteger(o) || o <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (wt(e)) {
    await pi(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (o) => ({
      mode: o.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: o.mode === "REMOVE_TREE" ? await Xt(o.tagIds) : o.tagIds
    }))
  );
  for (let o = 0; o < r.length; o++)
    try {
      await F("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({
          ids: [...t],
          tagIds: [...r[o].tagIds],
          tagMode: r[o].mode
        })
      });
    } catch (s) {
      throw new Error(
        `Step ${o + 1} failed; ${o} earlier step(s) completed. Refresh and check the selected videos before retrying. ${s instanceof Error ? s.message : "Request failed."}`
      );
    }
}
async function mi(e, t) {
  if (!Je(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await F("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
function hi(e) {
  var f, C, p;
  const [t, r] = N({}), [o, s] = N(""), c = (((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.annotations) ?? []).includes("tags") ? ((C = e == null ? void 0 : e.presentation) == null ? void 0 : C.annotationParents) ?? [] : [], l = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...c,
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return H(() => {
    let b = !0;
    return r({}), s(""), Promise.all(
      JSON.parse(l).map(
        async (y) => [y, await Xt([y])]
      )
    ).then((y) => {
      b && r(Object.fromEntries(y));
    }).catch(() => {
      b && s(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      b = !1;
    };
  }, [l]), { ids: t, error: o };
}
function bi(e, t, r) {
  const o = t == null ? void 0 : t.presentation, s = (o == null ? void 0 : o.annotations) ?? [], c = (o == null ? void 0 : o.annotationParents) ?? [];
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
      (l) => c.some(
        (f) => {
          var C;
          return f !== l.id && ((C = r[f]) == null ? void 0 : C.includes(l.id));
        }
      )
    ) : []
  };
}
function yi({
  videos: e,
  review: t,
  trees: r,
  disabled: o,
  onChoose: s
}) {
  var f, C, p;
  const c = new Set(
    (((f = t.presentation) == null ? void 0 : f.binParents) ?? []).flatMap(
      (b) => (r[b] ?? []).filter((y) => y !== b)
    )
  ), l = /* @__PURE__ */ new Map();
  for (const b of e)
    for (const y of b.tags ?? [])
      if (c.has(y.id)) {
        const m = l.get(y.id) ?? { name: y.name, count: 0 };
        m.count++, l.set(y.id, m);
      }
  return (p = (C = t.presentation) == null ? void 0 : C.binParents) != null && p.length ? /* @__PURE__ */ d("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ i("span", { children: "Tags on this page:" }),
    [...l].sort((b, y) => b[1].name.localeCompare(y[1].name)).map(([b, y]) => /* @__PURE__ */ d(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: o,
        onClick: () => s(b),
        children: [
          y.name,
          " (",
          y.count,
          ")"
        ]
      },
      b
    )),
    !l.size && /* @__PURE__ */ i("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function wi(e, t) {
  const { _filterExpression: r, ...o } = e.view.objectFilter;
  return {
    ...e,
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...Object.keys(o).length ? [{ filter: o }] : [],
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
function Mr({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: o = !0
}) {
  const [s, c] = N(!1), l = ce(e), f = e.view.filter, C = l === "tag" ? Ur : jr, p = (m) => t({
    ...e,
    view: { ...e.view, filter: { ...f, ...m } }
  }), b = l === "video" ? e.presentation ?? {} : {}, y = (m) => t({ ...e, presentation: { ...b, ...m } });
  return /* @__PURE__ */ d(ve, { children: [
    o && /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ i("legend", { children: "Queue" }),
      /* @__PURE__ */ d("label", { children: [
        "Search",
        /* @__PURE__ */ i(
          "input",
          {
            value: String(f.q ?? ""),
            onChange: (m) => p({ q: m.target.value })
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
              value: String(f.sort ?? "date"),
              onChange: (m) => p({ sort: m.target.value, sorts: void 0 }),
              children: [
                !C.some((m) => m.value === f.sort) && f.sort != null && /* @__PURE__ */ i("option", { value: String(f.sort), children: String(f.sort) }),
                C.map((m) => /* @__PURE__ */ i("option", { value: m.value, children: m.label }, m.value))
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
              value: String(f.direction ?? "desc"),
              onChange: (m) => p({ direction: m.target.value }),
              children: [
                /* @__PURE__ */ i("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ i("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          l === "tag" ? "Tags" : "Videos",
          " per page",
          /* @__PURE__ */ i(
            "input",
            {
              type: "number",
              min: "1",
              max: "1000",
              value: Number(f.perPage) || 40,
              onChange: (m) => p({
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
                /* @__PURE__ */ i("option", { value: "end", children: "The end" }),
                /* @__PURE__ */ i("option", { value: "beginning", children: "The beginning" })
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
      s && /* @__PURE__ */ i("div", { onKeyDown: (m) => m.stopPropagation(), children: /* @__PURE__ */ i(
        kn,
        {
          open: !0,
          onClose: () => c(!1),
          criteria: l === "tag" ? Kr : Dt,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: l === "video",
          subjectLabel: l === "tag" ? "tags" : "videos",
          onApply: (m) => {
            t({ ...e, view: { ...e.view, objectFilter: m } }), c(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ d(ve, { children: [
      /* @__PURE__ */ i("h3", { children: "Appearance" }),
      /* @__PURE__ */ d("p", { className: "dq-editor-note", children: [
        "Choose how ",
        l === "tag" ? "tags" : "videos and tags",
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ i("div", { className: "dq-field-grid", children: /* @__PURE__ */ d("label", { children: [
        "Preferred view",
        /* @__PURE__ */ i(
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
            children: (l === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((m) => /* @__PURE__ */ i("option", { children: m }, m))
          }
        )
      ] }) }),
      l === "video" && /* @__PURE__ */ d(ve, { children: [
        /* @__PURE__ */ i("h4", { children: "Card annotations" }),
        /* @__PURE__ */ i("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((m) => {
          const S = b.annotations ?? [];
          return /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ i(
              "input",
              {
                type: "checkbox",
                checked: S.includes(m),
                onChange: (w) => y({
                  annotations: w.target.checked ? [...S, m] : S.filter((I) => I !== m)
                })
              }
            ),
            m
          ] }, m);
        }) }),
        (b.annotations ?? []).includes("tags") && /* @__PURE__ */ d(ve, { children: [
          /* @__PURE__ */ i("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
          /* @__PURE__ */ i(
            xt,
            {
              entityType: "tag",
              values: b.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (m) => y({ annotationParents: m }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ i("h4", { children: "Tag bins" }),
        /* @__PURE__ */ i("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ i(
          xt,
          {
            entityType: "tag",
            values: b.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (m) => y({ binParents: m }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const vi = {
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
function Zt(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Si(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function Ei(e) {
  return [
    ...new Set(
      Zt(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Ni(e, t) {
  const r = Zt(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((o) => {
      const s = String(o.key ?? ""), c = vi[String(o.modifier ?? "EQUALS")], l = (y, m) => String(m ?? "").trim() || t[String(y)] || String(y ?? ""), f = l(
        o.value,
        o.displayValue
      ), C = l(
        o.value2,
        o.displayValue2
      ), p = String(o.modifier ?? "EQUALS"), b = p === "IS_NULL" || p === "NOT_NULL" ? [] : p === "BETWEEN" || p === "NOT_BETWEEN" ? [f, "and", C] : [f];
      return {
        ...o,
        label: [Si(s), c, ...b].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function Ci(e) {
  const t = Zt(e.customFieldCriteria);
  return t.length ? {
    ...e,
    customFieldCriteria: t.map(
      ({ label: r, ...o }) => o
    )
  } : e;
}
function Ai(e, t, r) {
  return r || "customFieldCriteria" in t || !Array.isArray(e.customFieldCriteria) ? t : { ...t, customFieldCriteria: e.customFieldCriteria };
}
const Lt = 180, Ti = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function en({ entityType: e }) {
  return e === "tag" ? /* @__PURE__ */ i(jn, { role: "img", "aria-label": "Tag review" }) : /* @__PURE__ */ i(jt, { role: "img", "aria-label": "Video review" });
}
function _r(e) {
  return ce(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function $r(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Ri() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Lr(e) {
  const t = new URLSearchParams(window.location.search);
  e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function qi(e) {
  return be({ ...e, page: 1 });
}
function Jt(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((l, f) => Jt(l, t[f]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, o = t, s = Object.keys(r).sort(), c = Object.keys(o).sort();
  return s.length === c.length && s.every(
    (l, f) => l === c[f] && Jt(r[l], o[l])
  );
}
function tn(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function le(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
const rn = "data-quality.workspace-layout.v1", er = 240, Wt = 192, zt = 560;
function nn(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(zt, Math.max(Wt, e)) : er;
}
function Ii() {
  try {
    const e = JSON.parse(
      localStorage.getItem(rn) ?? "null"
    );
    return nn(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return er;
  }
}
function Oi(e) {
  try {
    localStorage.setItem(
      rn,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function on(e) {
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
function an(e, t) {
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
function ki(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : an(e, t);
}
function Pi({
  onNavigate: e
}) {
  const [t, r] = N([]), [o] = N(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [s, c] = N(""), [l, f] = N(!0), [C, p] = N(""), [b, y] = N(!1), [m, S] = N(!1), [w, I] = N(!1), [P, x] = N([]), [R, V] = N(""), [W, E] = N(!0), [h, q] = N(""), [_, G] = N(""), [ne, ie] = N(!1), [ue, tr] = N(!1), [Z, rr] = N(Ri), [qe, Xe] = N({}), [Et, ln] = N("name"), [xe, cn] = N("asc"), nr = D(null), Nt = D(!1), [ir, Ct] = N(!1), [or, ar] = N(!1), [oe, Fe] = N(
    null
  ), U = t.find((n) => n.id === Z) ?? null, v = Ge(
    () => (oe == null ? void 0 : oe.id) === Z && U ? { ...U, view: oe.view } : U,
    [oe, Z, U]
  ), M = v ? ce(v) : "video", L = M === "video" ? v : null, Ye = M === "tag" ? m : b, dn = Ge(() => {
    const n = xe === "asc" ? 1 : -1;
    return [...t].sort((a, u) => {
      if (Et === "count") {
        const g = qe[a.id], T = qe[u.id], A = typeof g == "number", k = typeof T == "number";
        if (A !== k) return A ? -1 : 1;
        if (A && k && g !== T)
          return (g - T) * n;
      }
      return a.name.localeCompare(u.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * n;
    });
  }, [xe, Et, qe, t]), Ze = D(
    null
  ), et = hi(L), [z, tt] = N({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [un, fn] = N({
    page: 1,
    perPage: 40
  }), [ae, rt] = N({ items: [], totalCount: 0 }), [O, nt] = N(!1), [fe, sr] = N(""), [pn, gn] = N(!1), [pe, ye] = N(() => /* @__PURE__ */ new Set()), it = D(pe);
  it.current = pe;
  const Se = D(/* @__PURE__ */ new Map()), [te, re] = N(null), de = D(te);
  de.current = te;
  const [ge, Ie] = N(!1), me = D(ge);
  me.current = ge;
  const lr = D(null), [Ee, At] = N("grid"), [ot, cr] = N(Lt), [Oe, mn] = N(Ii), [$, Tt] = N(!1), at = D(!1), [hn, Rt] = N(""), [st, Ne] = N(""), [qt, Ue] = N(""), [B, dr] = N(null), [ur, lt] = N(""), [ct, dt] = N(!1), [fr, pr] = N({}), [gr, mr] = N({}), je = D(/* @__PURE__ */ new Map()), hr = D(null), ut = D(null), ke = D(0), ft = D(0), pt = D(null), Ce = D(!1), br = JSON.stringify([
    ...new Set(
      (L == null ? void 0 : L.actions.flatMap(
        (n) => n.steps.flatMap((a) => a.tagIds)
      )) ?? []
    )
  ]);
  function It(n) {
    const a = nn(n);
    mn(a), Oi(a);
  }
  function bn(n) {
    const a = n.shiftKey ? 40 : 16;
    let u = null;
    n.key === "ArrowLeft" && (u = Oe + a), n.key === "ArrowRight" && (u = Oe - a), n.key === "Home" && (u = Wt), n.key === "End" && (u = zt), u !== null && (n.preventDefault(), n.stopPropagation(), It(u));
  }
  H(() => {
    if (!st) return;
    const n = window.setTimeout(() => Ne(""), 4e3);
    return () => window.clearTimeout(n);
  }, [st]), H(() => {
    const n = JSON.parse(br);
    if (mr({}), !n.length) return;
    const a = new AbortController();
    let u = !0;
    return Promise.all(
      n.map(async (g) => {
        var T;
        try {
          const A = await F(`/api/tags/${g}`, {
            signal: a.signal
          });
          return [g, ((T = A.name) == null ? void 0 : T.trim()) || null];
        } catch {
          return [g, null];
        }
      })
    ).then((g) => {
      u && mr(Object.fromEntries(g));
    }), () => {
      u = !1, a.abort();
    };
  }, [br]), H(() => {
    const n = L ? Ei(L.view.objectFilter) : [];
    if (pr({}), !n.length) return;
    const a = new AbortController();
    let u = !0;
    return Promise.all(
      n.map(async (g) => {
        var T;
        try {
          const A = await F(`/api/tags/${g}`, {
            signal: a.signal
          });
          return (T = A.name) != null && T.trim() ? [String(g), A.name] : null;
        } catch {
          return null;
        }
      })
    ).then((g) => {
      u && pr(
        Object.fromEntries(g.filter((T) => T !== null))
      );
    }), () => {
      u = !1, a.abort();
    };
  }, [L == null ? void 0 : L.id, L == null ? void 0 : L.view.objectFilter]);
  const Ot = Ge(
    () => L ? Ni(
      L.view.objectFilter,
      fr
    ) : (v == null ? void 0 : v.view.objectFilter) ?? {},
    [fr, v, L]
  ), yn = Ge(
    () => M === "video" && Array.isArray(Ot.customFieldCriteria) ? [...Dt, Ti] : M === "tag" ? Kr : Dt,
    [M, Ot.customFieldCriteria]
  ), yr = Re(async () => {
    f(!0), p("");
    try {
      const n = await Yn();
      r(n.reviews), c(n.storageKey), y(n.canWriteVideos ?? n.canWrite), S(n.canWriteTags ?? !1), I(n.canReadTagGroups ?? !1), E(n.canConfigure ?? !0), q(n.storageNotice ?? ""), Z && !n.reviews.some((a) => a.id === Z) && (rr(""), Lr(""));
    } catch (n) {
      p(
        n instanceof Error ? n.message : "Could not load reviews."
      );
    } finally {
      f(!1);
    }
  }, [Z]);
  H(() => {
    if (!w) {
      x([]), V("");
      return;
    }
    const n = new AbortController();
    return V(""), ii(n.signal).then(x).catch((a) => {
      n.signal.aborted || V(
        a instanceof Error ? a.message : "Could not load tag groups."
      );
    }), () => n.abort();
  }, [w]), H(() => {
    yr();
  }, []), H(() => {
    if (Z || t.length === 0) return;
    const n = new AbortController();
    Xe({});
    for (const a of t)
      (ce(a) === "tag" ? kr(
        a,
        be({ ...a.view.filter, page: 1, perPage: 1 }),
        n.signal
      ) : Or(
        a,
        be({ ...a.view.filter, page: 1, perPage: 1 }),
        n.signal
      )).then((g) => {
        n.signal.aborted || Xe((T) => ({
          ...T,
          [a.id]: g.totalCount
        }));
      }).catch(() => {
        n.signal.aborted || Xe((g) => ({ ...g, [a.id]: null }));
      });
    return () => n.abort();
  }, [Z, t]), Fr(() => {
    var n;
    Z || l || !Nt.current || (Nt.current = !1, (n = nr.current) == null || n.focus());
  }, [Z, l]);
  const gt = Re(async () => {
    lt("");
    try {
      dr(await Yt());
    } catch (n) {
      dr(null), lt(
        "Tag assessment setup could not be checked. " + (n instanceof Error ? n.message : "Request failed.")
      );
    }
  }, []);
  H(() => {
    gt();
  }, [gt]);
  const Ae = Re(
    async (n, a, u = !1) => {
      var k;
      const g = ++ke.current;
      (k = pt.current) == null || k.abort();
      const T = new AbortController();
      pt.current = T, a = be(a);
      const A = Number(a.page);
      u && (a = { ...a, page: 1 }), tt(a), gn(u), nt(!0), sr("");
      try {
        const J = (Me) => ce(n) === "tag" ? kr(
          n,
          Me,
          T.signal
        ) : Or(
          n,
          Me,
          T.signal
        );
        let ee = await J(a);
        const he = Math.max(
          1,
          Math.ceil(ee.totalCount / Number(a.perPage))
        ), se = u ? he : Math.min(A, he);
        return Number(a.page) !== se && (a = { ...a, page: se }, ee = await J(a)), g === ke.current && (rt(ee), tt(a), fn(a)), ee;
      } catch (J) {
        throw g === ke.current && sr(
          J instanceof Error ? J.message : "Could not load the review queue."
        ), J;
      } finally {
        g === ke.current && nt(!1);
      }
    },
    []
  );
  H(() => {
    var a;
    if (ft.current += 1, ke.current += 1, (a = pt.current) == null || a.abort(), tr(!1), G(""), ie(!1), ye(/* @__PURE__ */ new Set()), Se.current.clear(), re(null), Ie(!1), Tt(!1), at.current = !1, Rt(""), Ne(""), Ue(""), rt({ items: [], totalCount: 0 }), !v) {
      nt(!1);
      return;
    }
    let n = !0;
    return nt(!0), (async () => {
      let u = null;
      try {
        u = await ti(s, v.id);
      } catch (A) {
        n && (ie(!0), G(
          A instanceof Error ? A.message : "Could not load progress."
        ));
      }
      if (!n) return;
      const g = (u == null ? void 0 : u.signature) === $e(v) ? u : null, T = g ? be(g.filter) : qi(v.view.filter);
      tt(T), At(
        g ? $r(g.displayMode, ce(v)) : _r(v)
      ), cr(
        g ? g.cardSize ?? Lt : Lt
      );
      try {
        const A = await Ae(
          v,
          T,
          !g && v.view.startFrom !== "beginning"
        );
        if (!n) return;
        const k = Tr(
          A.items.map((J) => J.id),
          (g == null ? void 0 : g.focusedId) ?? null,
          (g == null ? void 0 : g.index) ?? 0
        );
        re(k), X(k);
      } catch {
      }
      n && tr(!0);
    })(), () => {
      var u;
      n = !1, ft.current++, ke.current++, (u = pt.current) == null || u.abort();
    };
  }, [v == null ? void 0 : v.id]);
  const j = Ge(
    () => ae.items.map((n) => n.id),
    [ae.items]
  );
  H(() => {
    if (!ue || !v || !s || O || fe || $ || (oe == null ? void 0 : oe.id) === v.id || ne)
      return;
    const n = {
      version: 1,
      signature: $e(v),
      filter: z,
      focusedId: te,
      index: Math.max(0, j.indexOf(te ?? -1)),
      displayMode: Ee,
      cardSize: ot,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        s + ":progress:" + v.id,
        JSON.stringify(n)
      );
    } catch {
    }
    if (_) return;
    let a = !0;
    const u = window.setTimeout(() => {
      ri(s, v.id, n).catch((g) => {
        a && G(
          "Progress is kept in this browser, but account sync failed. " + (g instanceof Error ? g.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      a = !1, window.clearTimeout(u);
    };
  }, [
    ue,
    s,
    v,
    O,
    fe,
    $,
    z,
    te,
    j,
    Ee,
    ot,
    oe,
    _,
    ne
  ]);
  const wn = ae.items.find((n) => n.id === te) ?? null, kt = M === "video" ? wn : null;
  ge && kt && (lr.current = kt);
  const Te = kt ?? (ge ? lr.current : null), vn = Rr(pe, te), wr = pe.size > 0 ? `${pe.size} selected ${M}${pe.size === 1 ? "" : "s"}` : te == null ? `no ${M}` : `focused ${M}`, X = Re((n, a = !0) => {
    n != null && window.requestAnimationFrame(() => {
      const u = je.current.get(n);
      u == null || u.focus({ preventScroll: !0 }), a && (u == null || u.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  H(() => {
    ue && !me.current && X(de.current);
  }, [ue, X]), H(() => {
    O || !j.length || (de.current == null || !j.includes(de.current)) && (re(j[0]), me.current || X(j[0]));
  }, [X, j, O]);
  const Pe = Re(
    (n) => {
      ye((a) => {
        const u = n(a);
        for (const g of /* @__PURE__ */ new Set([...a, ...u]))
          a.has(g) !== u.has(g) && Se.current.set(
            g,
            (Se.current.get(g) ?? 0) + 1
          );
        return u;
      });
    },
    []
  ), Pt = Re(
    (n) => {
      if (!j.length) return;
      const a = Math.max(
        0,
        j.indexOf(de.current ?? j[0])
      ), u = j[Math.max(0, Math.min(j.length - 1, a + n))];
      re(u), me.current || X(u);
    },
    [X, j]
  ), Mt = Re(
    async (n) => {
      const a = "steps" in n ? n.steps.length > 0 : n.effect.mode !== "SKIP", u = "effect" in n && n.effect.mode === "SET_TAG_GROUP" ? n.effect.tagGroupId : null, g = u != null && (!w || !P.some((K) => K.id === u)), T = "effect" in n && a && !w, A = Rr(
        it.current,
        de.current
      );
      if (!v || at.current || O || fe || a && !Ye || T || g || wt(n) && (B == null ? void 0 : B.kind) !== "ready" || !A.length)
        return;
      const k = ++ft.current, J = v.id, ee = [...j], he = ae, se = de.current, Me = new Set(it.current), Ke = new Map(
        A.map((K) => [K, Se.current.get(K) ?? 0])
      ), _e = () => k === ft.current && v.id === J;
      at.current = !0, Tt(!0), Rt(
        it.current.size ? `${A.length} selected ${M}s` : `the focused ${M}`
      ), Ne(""), Ue("");
      const Er = he.items.filter(
        (K) => !A.includes(K.id)
      ), In = Er.map((K) => K.id), Nr = qr(
        ee,
        In,
        se,
        A.includes(se ?? -1)
      );
      rt({
        items: Er,
        totalCount: he.totalCount
      }), ye((K) => {
        const Q = new Set(K);
        for (const Y of A) Q.delete(Y);
        return Q;
      }), re(Nr), me.current || X(Nr);
      let _t = !1;
      try {
        if ("effect" in n ? await mi(n, A) : await gi(n, A), _t = !0, !_e()) return;
        ye((K) => {
          const Q = new Set(K);
          for (const Y of A)
            (Se.current.get(Y) ?? 0) === Ke.get(Y) && Q.delete(Y);
          return Q;
        }), Ne(
          `${n.label}: ${A.length} ${M}${A.length === 1 ? "" : "s"} ${a ? "updated" : "skipped"}.`
        );
      } catch (K) {
        if (!_e()) return;
        rt(he), ye((Q) => {
          const Y = new Set(Q);
          for (const we of A)
            Me.has(we) && (Se.current.get(we) ?? 0) === Ke.get(we) && Y.add(we);
          return Y;
        }), re(se), me.current || X(se), Ue(
          K instanceof Error ? K.message : "Action failed."
        );
      }
      try {
        if (await li(n), !_e()) return;
        const K = await Ae(v, z);
        if (!_e()) return;
        let Q = K.items.map((Y) => Y.id);
        if (!Q.length && K.totalCount > 0 && Number(z.page) > 1) {
          const Y = Math.max(1, Number(z.page) - 1), we = { ...z, page: Y };
          tt(we), Q = (await Ae(v, we)).items.map(($t) => $t.id), ye(
            ($t) => new Set([...$t].filter((On) => Q.includes(On)))
          );
          const Ar = Q.at(-1) ?? null;
          re(Ar), me.current || X(Ar);
        } else {
          ye(
            (we) => new Set([...we].filter((Cr) => Q.includes(Cr)))
          );
          const Y = qr(
            ee,
            Q,
            se,
            _t && A.includes(se ?? -1)
          );
          re(Y), me.current && Y == null && Ie(!1), me.current || X(Y);
        }
      } catch (K) {
        _e() && Ue(
          (Q) => `${Q ? `${Q} ` : ""}${_t ? "The action completed, but " : ""}the queue could not be refreshed. ${K instanceof Error ? K.message : "Refresh failed."}`
        );
      } finally {
        _e() && (at.current = !1, Tt(!1), Rt(""));
      }
    },
    [
      Ye,
      w,
      P,
      M,
      B,
      Ae,
      z,
      X,
      j,
      ae,
      O,
      fe,
      v
    ]
  );
  function Sn() {
    var u;
    if (Ee === "list") return 1;
    const n = (u = hr.current) == null ? void 0 : u.firstElementChild, a = n ? getComputedStyle(n).gridTemplateColumns : "";
    return Math.max(1, a.split(" ").filter(Boolean).length);
  }
  function En(n) {
    if (n.defaultPrevented || n.repeat || n.ctrlKey || n.altKey || n.metaKey || ir) return;
    if (ge && n.key === "Escape") {
      le(n), Ie(!1), X(de.current);
      return;
    }
    if (!zn(n.target)) return;
    if (n.key === "Escape") {
      le(n), Pe(() => /* @__PURE__ */ new Set());
      return;
    }
    const a = (v == null ? void 0 : v.actions.findIndex(
      (T, A) => Ve(T, A) === n.key
    )) ?? -1;
    if (a >= 0 && (v != null && v.actions[a])) {
      le(n), !$ && !O && Mt(v.actions[a]);
      return;
    }
    if (!ge && n.key === " ") {
      le(n), te != null && Pe((T) => yt(T, te));
      return;
    }
    if (!ge && n.key.toLowerCase() === "a") {
      le(n), Pe(
        (T) => Wn(T, j)
      );
      return;
    }
    if ($ || O || ge) return;
    if (n.key === "Enter" && te != null) {
      le(n), M === "tag" ? window.open(`/tag/${te}`, "_blank", "noopener,noreferrer") : Ie(!0);
      return;
    }
    const u = Sn(), g = n.key === "ArrowLeft" ? -1 : n.key === "ArrowRight" ? 1 : n.key === "ArrowUp" ? -u : n.key === "ArrowDown" ? u : 0;
    g && (le(n), Pt(g));
  }
  function mt(n) {
    rr(n), Lr(n);
  }
  function Nn() {
    Nt.current = !0, Xe({}), mt("");
  }
  async function vr(n) {
    if (!s) return !1;
    const a = n.map(_i);
    try {
      await ei(s, a);
    } catch (g) {
      throw g;
    }
    r(a), Z && !a.some((g) => g.id === Z) && mt("");
    const u = a.find((g) => g.id === Z);
    return u && U && JSON.stringify(u) !== JSON.stringify(U) && (u.view.displayMode !== U.view.displayMode && At(_r(u)), $e(u) !== $e(U) && (Fe(null), ht(
      u,
      be({ ...u.view.filter, page: z.page })
    ))), !0;
  }
  if (l)
    return /* @__PURE__ */ i(Dr, { label: "Loading reviews…" });
  if (C)
    return /* @__PURE__ */ d(ve, { children: [
      /* @__PURE__ */ i(
        "button",
        {
          className: "dq-button",
          onClick: () => void Bi().catch(
            (n) => p(
              "Could not export browser reviews. " + (n instanceof Error ? n.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ i(
        xr,
        {
          message: C,
          onRetry: () => void yr()
        }
      )
    ] });
  return /* @__PURE__ */ d("div", { className: "data-quality-page", onKeyDown: En, children: [
    /* @__PURE__ */ d("header", { className: "data-quality-header", children: [
      v && /* @__PURE__ */ i(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: $,
          onClick: Nn,
          children: /* @__PURE__ */ i(Gr, {})
        }
      ),
      /* @__PURE__ */ d("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ i("h1", { children: (v == null ? void 0 : v.name) ?? "Data Quality" }),
        (v == null ? void 0 : v.description) && /* @__PURE__ */ i("p", { className: "dq-review-description", children: v.description })
      ] }),
      v && U && /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: $ || O || !W,
          onClick: () => {
            ar(!0), Ct(!0);
          },
          children: /* @__PURE__ */ i(Br, {})
        }
      ),
      /* @__PURE__ */ i(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: $ || O || !W,
          onClick: () => {
            ar(!1), Ct(!0);
          },
          children: /* @__PURE__ */ i(xn, {})
        }
      )
    ] }),
    h && /* @__PURE__ */ i("p", { className: "dq-status", children: h }),
    L && (B == null ? void 0 : B.kind) === "missing" && /* @__PURE__ */ d("div", { role: "status", className: "dq-status", children: [
      B.message,
      " ",
      /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          disabled: ct,
          onClick: () => {
            dt(!0), lt(""), di().then(gt).catch(
              (n) => lt(
                "Could not create the Confirmed absent tags custom field. " + (n instanceof Error ? n.message : "Request failed.")
              )
            ).finally(() => dt(!1));
          },
          children: ct ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    L && ((B == null ? void 0 : B.kind) === "incompatible" || ur) && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ i(Ut, {}),
      ur || (B == null ? void 0 : B.message),
      /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          disabled: ct,
          onClick: () => {
            dt(!0), gt().finally(
              () => dt(!1)
            );
          },
          children: ct ? "Checking…" : "Check again"
        }
      )
    ] }),
    o && /* @__PURE__ */ d("details", { children: [
      /* @__PURE__ */ i("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ i("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ i(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const n = localStorage.getItem("page-videos") ?? "[]", a = URL.createObjectURL(
              new Blob([n], { type: "application/json" })
            ), u = document.createElement("a");
            u.href = a, u.download = "data-quality-unassigned-legacy-reviews.json", u.click(), URL.revokeObjectURL(a);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    _ && /* @__PURE__ */ d("p", { role: "alert", children: [
      _,
      " ",
      /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          onClick: () => {
            G(""), ie(!1);
          },
          children: ne ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    v && U && /* @__PURE__ */ d("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ i(
        "div",
        {
          className: `dq-native-toolbar-host${$ || O ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": $ || O || void 0,
          inert: $ || O ? !0 : void 0,
          onClickCapture: (n) => {
            var u, g, T, A, k;
            const a = n.target instanceof Element ? n.target.closest("button") : null;
            (a == null ? void 0 : a.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((u = a == null ? void 0 : a.textContent) == null ? void 0 : u.trim()) === "Clear all" ? Ce.current = !0 : ((g = a == null ? void 0 : a.getAttribute("aria-label")) != null && g.startsWith("Filters") || (T = a == null ? void 0 : a.getAttribute("aria-label")) != null && T.startsWith("Edit filter:") || ((A = a == null ? void 0 : a.textContent) == null ? void 0 : A.trim()) === "Cancel" || (k = a == null ? void 0 : a.getAttribute("aria-label")) != null && k.startsWith("Close ")) && (Ce.current = !1);
          },
          onKeyDownCapture: (n) => {
            var u, g;
            const a = n.target instanceof Element ? n.target.closest("button") : null;
            (n.key === "Delete" || n.key === "Backspace") && (a == null ? void 0 : a.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (n.preventDefault(), n.stopPropagation(), Ce.current = !0, (g = (u = a.parentElement) == null ? void 0 : u.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || g.click()) : n.key === "Escape" && (Ce.current = !1);
          },
          children: /* @__PURE__ */ i(
            Pn,
            {
              filter: fe ? un : z,
              onFilterChange: Cn,
              totalCount: ae.totalCount,
              sortOptions: M === "tag" ? Ur : jr,
              showSearch: !0,
              showSort: !0,
              displayMode: Ee,
              onDisplayModeChange: (n) => At($r(n, M)),
              availableDisplayModes: M === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (ot - 225) / 50,
              onZoomChange: (n) => cr(Math.round(225 + n * 50)),
              cardSizeEntityType: M === "tag" ? "tags" : "videos",
              criteriaDefinitions: yn,
              objectFilter: Ot,
              onObjectFilterChange: (n) => {
                if (!$ && !O) {
                  const a = M === "video" ? Ci(n) : n;
                  Ze.current = M === "video" ? Ai(
                    v.view.objectFilter,
                    a,
                    Ce.current
                  ) : a, Ce.current = !1;
                }
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (oe == null ? void 0 : oe.id) === Z && /* @__PURE__ */ d("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: $ || O || !W,
            onClick: Tn,
            children: /* @__PURE__ */ i(Fn, {})
          }
        ),
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Reset to default review filters",
            title: "Reset to default review filters",
            disabled: $ || O,
            onClick: An,
            children: /* @__PURE__ */ i(Un, {})
          }
        )
      ] })
    ] }),
    v ? /* @__PURE__ */ d(ve, { children: [
      M === "video" && et.error && /* @__PURE__ */ i("p", { role: "alert", children: et.error }),
      L && /* @__PURE__ */ i(
        yi,
        {
          videos: ae.items,
          review: L,
          trees: et.ids,
          disabled: $ || O,
          onChoose: (n) => {
            const a = wi(L, n);
            Fe(a), ht(a, { ...z, page: 1 });
          }
        }
      ),
      qt && !ge && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ i(Ut, {}),
        qt
      ] }),
      st && /* @__PURE__ */ i("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: st }),
      Sr("top"),
      /* @__PURE__ */ d(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${Oe}px`
          },
          children: [
            /* @__PURE__ */ d("main", { children: [
              O && !ae.items.length && /* @__PURE__ */ i(Dr, { label: "Loading review queue…" }),
              fe && !O && /* @__PURE__ */ i(
                xr,
                {
                  message: fe,
                  onRetry: () => void Ae(
                    v,
                    z,
                    pn
                  ).catch(() => {
                  })
                }
              ),
              !$ && !O && !fe && !ae.items.length && /* @__PURE__ */ d("div", { className: "dq-empty", children: [
                /* @__PURE__ */ i(jt, {}),
                /* @__PURE__ */ d("p", { children: [
                  "No ",
                  M,
                  "s match this review."
                ] })
              ] }),
              !!ae.items.length && /* @__PURE__ */ i("div", { ref: hr, children: /* @__PURE__ */ i(
                "div",
                {
                  className: Ee === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${ot}px`
                  },
                  children: ae.items.map(qn)
                }
              ) })
            ] }),
            /* @__PURE__ */ i(
              "div",
              {
                className: "dq-workspace-separator",
                role: "separator",
                tabIndex: 0,
                "aria-label": "Resize review sidebar",
                "aria-orientation": "vertical",
                "aria-valuemin": Wt,
                "aria-valuemax": zt,
                "aria-valuenow": Oe,
                "aria-valuetext": `${Oe} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (n) => {
                  ut.current = {
                    pointerId: n.pointerId,
                    startX: n.clientX,
                    startWidth: Oe
                  }, n.currentTarget.setPointerCapture(n.pointerId);
                },
                onPointerMove: (n) => {
                  const a = ut.current;
                  (a == null ? void 0 : a.pointerId) === n.pointerId && n.currentTarget.hasPointerCapture(n.pointerId) && It(
                    a.startWidth + a.startX - n.clientX
                  );
                },
                onPointerUp: () => {
                  ut.current = null;
                },
                onPointerCancel: () => {
                  ut.current = null;
                },
                onKeyDown: bn,
                onDoubleClick: () => It(er),
                children: /* @__PURE__ */ i("span", {})
              }
            ),
            /* @__PURE__ */ d("aside", { className: "dq-actions", children: [
              pe.size > 0 && /* @__PURE__ */ i("strong", { children: wr }),
              v.actions.map((n, a) => {
                const u = "steps" in n ? n.steps.length > 0 : n.effect.mode !== "SKIP", g = "effect" in n && n.effect.mode === "SET_TAG_GROUP" ? n.effect.tagGroupId : null, T = g != null ? P.find((k) => k.id === g) : void 0, A = g != null && !T;
                return /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    disabled: $ || O || !!fe || u && !Ye || "effect" in n && u && (!w || A) || wt(n) && (B == null ? void 0 : B.kind) !== "ready" || !vn.length,
                    onClick: () => void Mt(n),
                    children: [
                      /* @__PURE__ */ d("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ i("span", { className: "dq-action-label", children: n.label }),
                        "effect" in n ? /* @__PURE__ */ i("small", { children: n.effect.mode === "SKIP" ? "Skip" : n.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : T ? `Assign ${T.name}` : "Unavailable tag group" }) : n.steps.length ? /* @__PURE__ */ i("span", { className: "dq-action-steps", children: n.steps.flatMap(
                          (k, J) => k.tagIds.map((ee, he) => {
                            const se = gr[ee] === void 0 ? "Tag" : gr[ee] ?? "Unavailable tag", Me = an(k, se), Ke = ki(k, se);
                            return /* @__PURE__ */ i(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": on(k.mode),
                                "aria-label": Ke,
                                title: `Step ${J + 1}: ${Ke}`,
                                children: Me
                              },
                              `${J}-${ee}-${he}`
                            );
                          })
                        ) }) : /* @__PURE__ */ i("small", { children: "Skip" })
                      ] }),
                      Ve(n, a) && /* @__PURE__ */ i("kbd", { children: Ve(n, a) })
                    ]
                  },
                  n.id
                );
              }),
              !v.actions.length && /* @__PURE__ */ i("p", { children: "This review has no actions." }),
              !Ye && /* @__PURE__ */ d("p", { children: [
                M === "tag" ? "Tag" : "Video",
                " write permission is required to apply actions."
              ] }),
              M === "tag" && R && /* @__PURE__ */ d("p", { children: [
                "Tag groups are unavailable. ",
                R
              ] }),
              $ && /* @__PURE__ */ d("p", { role: "status", children: [
                /* @__PURE__ */ i(Jr, { className: "dq-spin" }),
                " Applying action to",
                " ",
                hn,
                "…"
              ] }),
              /* @__PURE__ */ d("p", { className: "dq-shortcuts", children: [
                "←→↑↓ move · space select · enter ",
                M === "tag" ? "open" : "preview",
                " · 1–9 apply · A toggle shown · Esc clear"
              ] })
            ] })
          ]
        }
      ),
      Sr("bottom")
    ] }) : t.length ? /* @__PURE__ */ d(
      "section",
      {
        className: "dq-review-browser",
        "aria-labelledby": "dq-reviews-title",
        children: [
          /* @__PURE__ */ d("div", { className: "dq-review-browser-heading", children: [
            /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ i(
                "h2",
                {
                  id: "dq-reviews-title",
                  ref: nr,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ i("p", { children: "Choose a review to open its queue." }),
              /* @__PURE__ */ i("span", { className: "dq-sr-only", role: "status", children: t.every(
                (n) => qe[n.id] !== void 0
              ) ? t.some((n) => qe[n.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ d("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ d("label", { children: [
                /* @__PURE__ */ i("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ d(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: Et,
                    onChange: (n) => ln(
                      n.target.value
                    ),
                    children: [
                      /* @__PURE__ */ i("option", { value: "name", children: "Name" }),
                      /* @__PURE__ */ i("option", { value: "count", children: "Item count" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ i(
                "button",
                {
                  type: "button",
                  "aria-label": xe === "asc" ? "Ascending" : "Descending",
                  title: xe === "asc" ? "Ascending" : "Descending",
                  onClick: () => cn(
                    (n) => n === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ i(
                    Vr,
                    {
                      className: xe === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ i("div", { className: "dq-review-browser-list", children: dn.map((n) => {
            const a = qe[n.id], u = ce(n), g = u === "tag" ? "tag" : "video";
            return /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                disabled: $,
                onClick: () => mt(n.id),
                children: [
                  /* @__PURE__ */ d("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ d("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ i(en, { entityType: u }),
                      /* @__PURE__ */ i("strong", { children: n.name })
                    ] }),
                    /* @__PURE__ */ i(
                      "span",
                      {
                        className: "dq-review-count",
                        "aria-label": a === void 0 ? `Counting matching ${g}s` : a === null ? `Matching ${g} count unavailable` : `${a.toLocaleString()} matching ${a === 1 ? g : `${g}s`}`,
                        children: a === void 0 ? "…" : a === null ? "—" : a.toLocaleString()
                      }
                    )
                  ] }),
                  n.description && /* @__PURE__ */ i("span", { className: "dq-review-rule-name", children: n.description })
                ]
              },
              n.id
            );
          }) })
        ]
      }
    ) : /* @__PURE__ */ d("div", { className: "dq-empty", children: [
      /* @__PURE__ */ i(jt, {}),
      /* @__PURE__ */ i("p", { children: "No saved reviews are available in this browser." })
    ] }),
    ge && Te && L && /* @__PURE__ */ i(
      xi,
      {
        video: Te,
        review: L,
        targetLabel: wr,
        pending: $,
        refreshing: O || !!fe,
        error: qt,
        canWrite: b,
        assessmentReady: (B == null ? void 0 : B.kind) === "ready",
        selected: pe.has(Te.id),
        hasPrevious: j.indexOf(Te.id) > 0,
        hasNext: j.indexOf(Te.id) >= 0 && j.indexOf(Te.id) < j.length - 1,
        onToggleSelected: () => Pe((n) => yt(n, Te.id)),
        onPrevious: () => Pt(-1),
        onNext: () => Pt(1),
        onClose: () => {
          Ie(!1), X(de.current);
        },
        onAction: Mt
      }
    ),
    ir && /* @__PURE__ */ i(
      Fi,
      {
        reviews: t,
        activeReview: U,
        tagGroups: P,
        initialEdit: or,
        onSave: vr,
        onChoose: mt,
        onClose: () => {
          Ct(!1), or && X(de.current, !1);
        }
      }
    )
  ] });
  async function ht(n, a, u = !1) {
    const g = de.current, T = Math.max(0, j.indexOf(g ?? -1));
    try {
      const k = (await Ae(n, a, u)).items.map((ee) => ee.id);
      ye(
        (ee) => new Set([...ee].filter((he) => k.includes(he)))
      );
      const J = Tr(k, g, T);
      re(J), me.current || X(J, !1);
    } catch {
    }
  }
  function Cn(n) {
    const a = Ze.current;
    if (Ze.current = null, $ || O || !v || !U) return;
    const u = a ?? v.view.objectFilter, g = Jt(
      u,
      U.view.objectFilter
    ) ? U.view.objectFilter : u, T = be({ ...n, page: 1 }), A = {
      ...v,
      view: {
        ...v.view,
        filter: T,
        objectFilter: g
      }
    }, k = $e(A) !== $e(U), J = k ? A : U;
    Fe(k ? A : null), Ne(k ? "" : "Review queue defaults restored."), ht(J, T, !0);
  }
  function An() {
    if ($ || O || !U) return;
    Ze.current = null;
    const n = be({
      ...U.view.filter,
      page: 1
    });
    Fe(null), Ne("Review queue defaults restored."), ht(
      U,
      n,
      U.view.startFrom !== "beginning"
    );
  }
  function Tn() {
    $ || O || !v || !U || !W || vr(
      t.map(
        (n) => n.id === Z ? {
          ...n,
          view: {
            ...v.view,
            filter: { ...z, page: 1 }
          }
        } : n
      )
    ).then(() => {
      Fe(null), Ne("Queue saved to this review.");
    }).catch(
      (n) => Ue(
        n instanceof Error ? n.message : "Could not save queue."
      )
    );
  }
  function Rn() {
    ye(/* @__PURE__ */ new Set()), Se.current.clear(), re(null);
  }
  function Sr(n) {
    return v ? /* @__PURE__ */ i(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: $ || O,
        "aria-label": `Review queue pagination ${n}`,
        children: /* @__PURE__ */ i(
          Mn,
          {
            filter: {
              ...z,
              page: Number(z.page) || 1,
              perPage: Number(z.perPage) || 40
            },
            totalCount: ae.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${n}`,
            onFilterChange: (a) => {
              $ || O || a.page === Number(z.page) || Mi(
                { ...z, page: a.page },
                v,
                Ae,
                Rn
              );
            }
          }
        )
      }
    ) : null;
  }
  function qn(n) {
    if (M === "tag") {
      const u = n;
      return /* @__PURE__ */ i(
        $i,
        {
          tag: u,
          displayMode: Ee === "list" ? "list" : "grid",
          focused: u.id === te,
          selected: pe.has(u.id),
          setRef: (g) => {
            g ? je.current.set(u.id, g) : je.current.delete(u.id);
          },
          onFocus: () => re(u.id),
          onToggle: () => Pe((g) => yt(g, u.id)),
          onOpen: () => window.open(`/tag/${u.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        u.id
      );
    }
    const a = n;
    return /* @__PURE__ */ i(
      Li,
      {
        video: bi(a, L, et.ids),
        displayMode: Ee,
        focused: a.id === te,
        selected: pe.has(a.id),
        setRef: (u) => {
          u ? je.current.set(a.id, u) : je.current.delete(a.id);
        },
        onFocus: () => re(a.id),
        onToggle: () => Pe((u) => yt(u, a.id)),
        onPreview: () => {
          re(a.id), Ie(!0);
        },
        onNavigate: e
      },
      a.id
    );
  }
}
function Mi(e, t, r, o) {
  o(), r(t, e).catch(() => {
  });
}
function yt(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function _i(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function $i({
  tag: e,
  displayMode: t,
  focused: r,
  selected: o,
  setRef: s,
  onFocus: c,
  onToggle: l,
  onOpen: f,
  onNavigate: C
}) {
  return /* @__PURE__ */ i(
    "article",
    {
      ref: s,
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${e.name}${o ? ", selected" : ""}`,
      onFocus: c,
      onClick: (p) => {
        c(), p.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${o ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ i(
        $n,
        {
          tag: e,
          selected: o,
          onSelect: l,
          onClick: f,
          onNavigate: C
        }
      ) : /* @__PURE__ */ d("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            "aria-label": o ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": o,
            onClick: (p) => {
              p.stopPropagation(), l();
            },
            children: o ? "✓" : ""
          }
        ),
        /* @__PURE__ */ i("button", { type: "button", className: "dq-tag-list-name", onClick: f, children: e.name }),
        /* @__PURE__ */ i("span", { children: e.tagGroupName || "Ungrouped" }),
        /* @__PURE__ */ i("span", { children: e.description || "" }),
        /* @__PURE__ */ d("span", { children: [
          e.videoCount ?? 0,
          " videos"
        ] })
      ] })
    }
  );
}
function Li({
  video: e,
  displayMode: t,
  focused: r,
  selected: o,
  setRef: s,
  onFocus: c,
  onToggle: l,
  onPreview: f,
  onNavigate: C
}) {
  const p = tn(e), b = D(null), y = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, m = !!(y.date || y.studioName), S = !!(y.performers.length || y.tags.length);
  return Fr(() => {
    const w = b.current;
    if (!w) return;
    const I = w.querySelector(
      `a[href="/video/${e.id}"]`
    ), P = w.querySelector(".card-title"), x = `dq-card-title-${e.id}`;
    P && (P.id = x), I && (I.target = "_blank", I.rel = "noreferrer", I.removeAttribute("aria-label"), I.setAttribute("aria-labelledby", x), I.classList.add("dq-card-link"));
    const R = w.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    R && R.setAttribute(
      "aria-label",
      o ? `Deselect ${p}` : `Select ${p}`
    );
    const V = w.querySelector(
      'button[title="Quick View"]'
    );
    V && V.setAttribute("aria-label", `Preview ${p}`);
  }), /* @__PURE__ */ d(
    "article",
    {
      ref: (w) => {
        b.current = w, s(w);
      },
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${p}${o ? ", selected" : ""}`,
      onFocus: c,
      onClick: (w) => {
        c(), w.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${t} ${m ? "has-card-metadata" : "no-card-metadata"} ${S ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ i(
          Ln,
          {
            video: y,
            selected: o,
            onSelect: l,
            onNavigate: C,
            onQuickView: f,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t === "wall" && /* @__PURE__ */ i(Di, { video: e })
      ]
    }
  );
}
function Di({ video: e }) {
  const t = D(null), r = D(null), [o, s] = N(!1), [c, l] = N(!1), [f, C] = N(!1);
  return H(() => {
    const p = t.current;
    if (!p || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      s(!0), l(!0);
      return;
    }
    const b = new IntersectionObserver(
      ([m]) => s(m.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), y = new IntersectionObserver(
      ([m]) => l(m.isIntersecting && m.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return b.observe(p), y.observe(p), () => {
      b.disconnect(), y.disconnect();
    };
  }, [e.id, e.files.length]), H(() => {
    if (!o) {
      C(!1);
      return;
    }
    const p = new AbortController();
    return F(si(e.id), {
      signal: p.signal
    }).then((b) => {
      p.signal.aborted || C(b.available === !0);
    }).catch(() => {
      p.signal.aborted || C(!1);
    }), () => p.abort();
  }, [o, e.id]), H(() => {
    const p = r.current;
    p && (c ? Promise.resolve(p.play()).catch(() => {
    }) : p.pause());
  }, [f, c]), /* @__PURE__ */ i("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: f && /* @__PURE__ */ i(
    "video",
    {
      ref: r,
      src: ai(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function xi({
  video: e,
  review: t,
  targetLabel: r,
  pending: o,
  refreshing: s,
  error: c,
  canWrite: l,
  assessmentReady: f,
  selected: C,
  hasPrevious: p,
  hasNext: b,
  onToggleSelected: y,
  onPrevious: m,
  onNext: S,
  onClose: w,
  onAction: I
}) {
  const P = D(null), x = D(null), R = e.files[0], V = tn(e);
  H(() => {
    var q;
    const h = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (q = P.current) == null || q.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = h;
    };
  }, []);
  function W(h) {
    var G, ne, ie;
    if (h.key !== "Tab") return;
    const q = [
      ...((G = P.current) == null ? void 0 : G.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ue) => ue.offsetParent !== null);
    if (!q.length) {
      h.preventDefault(), (ne = P.current) == null || ne.focus();
      return;
    }
    const _ = q.indexOf(
      document.activeElement
    );
    h.shiftKey && _ <= 0 ? (h.preventDefault(), (ie = q.at(-1)) == null || ie.focus()) : !h.shiftKey && _ === q.length - 1 && (h.preventDefault(), q[0].focus());
  }
  function E(h) {
    if (h.defaultPrevented || h.ctrlKey || h.metaKey || h.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const q = h.key === "ArrowLeft" || h.key === "ArrowRight";
    if (h.altKey && !q) return;
    const _ = x.current, G = h.currentTarget.querySelector("video");
    if (h.key === "Enter" || h.key === "Escape")
      h.repeat || w();
    else if (h.key === " " && _)
      h.repeat || _.toggle();
    else if (q && _)
      _.seekBy(
        (h.key === "ArrowLeft" ? -1 : 1) * (h.shiftKey ? 5 : h.altKey ? 10 : 60)
      );
    else if ((h.key === "," || h.key === ".") && _) {
      const ne = [R == null ? void 0 : R.duration, G == null ? void 0 : G.duration].find(
        (ue) => ue != null && Number.isFinite(ue) && ue > 0
      ) ?? 0, ie = e.parentVideoId != null ? (e.clipEndSec ?? ne) - (e.clipStartSec ?? 0) : ne;
      Number.isFinite(ie) && ie > 0 && _.seekBy((h.key === "," ? -1 : 1) * ie * 0.1);
    } else if (h.key.toLowerCase() === "n" || h.key.toLowerCase() === "m")
      !h.repeat && !o && !s && (h.key.toLowerCase() === "n" && p && m(), h.key.toLowerCase() === "m" && b && S());
    else if (h.key === "ArrowUp" && G)
      G.volume = Math.min(1, G.volume + 0.1);
    else if (h.key === "ArrowDown" && G)
      G.volume = Math.max(0, G.volume - 0.1);
    else return;
    le(h);
  }
  return /* @__PURE__ */ i(
    "div",
    {
      ref: P,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${V}`,
      className: "dq-preview",
      onKeyDown: W,
      onKeyDownCapture: E,
      onMouseDown: (h) => {
        h.target === h.currentTarget && w();
      },
      children: /* @__PURE__ */ d("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ d("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !p || o || s,
              onClick: m,
              children: /* @__PURE__ */ i(Gr, {})
            }
          ),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !b || o || s,
              onClick: S,
              children: /* @__PURE__ */ i(Vr, {})
            }
          ),
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ i("h2", { children: V }),
            /* @__PURE__ */ d("p", { children: [
              "Actions target ",
              r,
              "."
            ] })
          ] }),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              onClick: y,
              disabled: s,
              children: C ? "Selected" : "Select"
            }
          ),
          /* @__PURE__ */ i(
            "a",
            {
              href: `/video/${e.id}`,
              target: "_blank",
              rel: "noreferrer",
              className: "dq-details-link",
              "aria-label": `Open ${V} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ i(Kn, {})
            }
          ),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              onClick: w,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ i(Wr, {})
            }
          )
        ] }),
        /* @__PURE__ */ i("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: R ? /* @__PURE__ */ i(
          _n,
          {
            autostart: !0,
            streamUrl: oi(e.id),
            posterUrl: Pr(e),
            format: R.format,
            audioCodec: R.audioCodec,
            duration: R.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (h) => (x.current = h, () => {
              x.current === h && (x.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ i("img", { src: Pr(e), alt: "" }) }),
        c && /* @__PURE__ */ i("p", { role: "alert", className: "dq-alert", children: c }),
        /* @__PURE__ */ i("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ i("footer", { "data-review-player-controls": !0, children: t.actions.map((h, q) => /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            disabled: o || s || h.steps.length > 0 && !l || wt(h) && !f,
            onClick: () => void I(h),
            children: [
              Ve(h, q) && /* @__PURE__ */ i("kbd", { children: Ve(h, q) }),
              h.label
            ]
          },
          h.id
        )) })
      ] })
    }
  );
}
function Fi({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: o = !1,
  onSave: s,
  onChoose: c,
  onClose: l
}) {
  const [f, C] = N(
    () => o && t ? structuredClone(t) : null
  ), [p, b] = N(""), [y, m] = N(!1), [S, w] = N(
    o && t != null
  ), I = D(null);
  H(() => {
    var q, _;
    const E = document.activeElement, h = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (_ = (q = I.current) == null ? void 0 : q.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || _.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = h, E == null || E.focus({ preventScroll: !0 });
    };
  }, []);
  function P(E) {
    var _, G, ne;
    if (E.defaultPrevented) {
      E.stopPropagation();
      return;
    }
    if (E.key === "Escape") {
      le(E), y || l();
      return;
    }
    if (E.key !== "Tab") {
      E.stopPropagation();
      return;
    }
    const h = [
      ...((_ = I.current) == null ? void 0 : _.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ie) => ie.offsetParent !== null);
    if (!h.length) {
      le(E), (G = I.current) == null || G.focus();
      return;
    }
    const q = h.indexOf(
      document.activeElement
    );
    E.shiftKey && q <= 0 ? (le(E), (ne = h.at(-1)) == null || ne.focus()) : !E.shiftKey && q === h.length - 1 ? (le(E), h[0].focus()) : E.stopPropagation();
  }
  function x(E, h = !!E) {
    w(h), C(
      E ? structuredClone(E) : {
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
  async function R() {
    if (y) return;
    if (!f || Kt(f)) {
      b(f ? Kt(f) : "Choose a review.");
      return;
    }
    const E = { ...f, name: f.name.trim() }, h = e.some((q) => q.id === E.id) ? e.map((q) => q.id === E.id ? E : q) : [...e, E];
    m(!0), b("");
    try {
      if (!await s(h)) throw new Error("Could not save reviews.");
      c(E.id), l();
    } catch (q) {
      b(
        "Could not save reviews. Your edits are still open. " + (q instanceof Error ? q.message : "Retry saving.")
      );
    } finally {
      m(!1);
    }
  }
  async function V(E) {
    if (!y) {
      m(!0), b("");
      try {
        if (!await s(E)) throw new Error("Could not save reviews.");
      } catch (h) {
        b(
          h instanceof Error ? h.message : "Could not save reviews."
        );
      } finally {
        m(!1);
      }
    }
  }
  async function W(E) {
    var q;
    if (y) return;
    const h = (q = E.target.files) == null ? void 0 : q[0];
    if (E.target.value = "", !!h) {
      if (h.size > 2e6) {
        b("Review files must be smaller than 2 MB.");
        return;
      }
      m(!0), b("");
      try {
        const _ = ze(await h.text());
        if (!await s(Gt(e, _)))
          throw new Error("Could not save reviews.");
      } catch (_) {
        b(
          _ instanceof Error ? _.message : "Could not import reviews."
        );
      } finally {
        m(!1);
      }
    }
  }
  return /* @__PURE__ */ i(
    "div",
    {
      ref: I,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: P,
      children: /* @__PURE__ */ d("div", { className: "dq-manager", children: [
        /* @__PURE__ */ d("header", { children: [
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ i("h2", { children: f ? e.some((E) => E.id === f.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ i("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: y,
              onClick: l,
              children: /* @__PURE__ */ i(Wr, {})
            }
          )
        ] }),
        p && /* @__PURE__ */ i("p", { role: "alert", className: "dq-alert", children: p }),
        /* @__PURE__ */ i("fieldset", { disabled: y, className: "dq-manager-content", children: f ? /* @__PURE__ */ i(
          Ui,
          {
            draft: f,
            entityTypeLocked: S,
            tagGroups: r,
            saving: y,
            setDraft: C,
            onSave: () => void R(),
            onCancel: l
          }
        ) : /* @__PURE__ */ d(ve, { children: [
          /* @__PURE__ */ d("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ d(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => x(),
                children: [
                  /* @__PURE__ */ i(Gn, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ d("label", { className: "dq-button", children: [
              /* @__PURE__ */ i(Bn, {}),
              " Import reviews",
              /* @__PURE__ */ i(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: W
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ i("div", { className: "dq-review-list", children: e.map((E) => /* @__PURE__ */ d("article", { children: [
            /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ d("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ i(en, { entityType: ce(E) }),
                /* @__PURE__ */ i("strong", { children: E.name })
              ] }),
              /* @__PURE__ */ i("p", { children: E.description || "No description" })
            ] }),
            /* @__PURE__ */ d("button", { type: "button", onClick: () => x(E), children: [
              /* @__PURE__ */ i(Br, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                onClick: () => x({
                  ...structuredClone(E),
                  id: crypto.randomUUID(),
                  name: `${E.name} copy`
                }, !0),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${E.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${E.name}”?`) && V(
                    e.filter((h) => h.id !== E.id)
                  );
                },
                children: /* @__PURE__ */ i(zr, {})
              }
            )
          ] }, E.id)) })
        ] }) })
      ] })
    }
  );
}
function Ui({
  draft: e,
  entityTypeLocked: t,
  tagGroups: r,
  saving: o = !1,
  setDraft: s,
  onSave: c,
  onCancel: l
}) {
  const [f, C] = N("Review"), p = ce(e), b = (S) => {
    t || S === p || s(
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
  }, y = D(/* @__PURE__ */ new WeakMap()), m = (S) => {
    let w = y.current.get(S);
    return w || (w = crypto.randomUUID(), y.current.set(S, w)), w;
  };
  return /* @__PURE__ */ d("div", { className: "dq-editor", children: [
    /* @__PURE__ */ i("div", { className: "dq-editor-nav", children: /* @__PURE__ */ i(
      Dn,
      {
        tabs: ["Review", "Queue", "Appearance", "Actions"].map((S) => ({
          key: S,
          label: S,
          count: S === "Actions" ? e.actions.length : void 0,
          disabled: o
        })),
        activeTab: f,
        onTabChange: C
      }
    ) }),
    /* @__PURE__ */ d("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ d("section", { hidden: f !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ i("h3", { children: "Review details" }),
        /* @__PURE__ */ i("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
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
                /* @__PURE__ */ i("option", { value: "video", children: "Videos" }),
                /* @__PURE__ */ i("option", { value: "tag", children: "Tags" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          "Review name",
          /* @__PURE__ */ i(
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
          /* @__PURE__ */ i(
            "textarea",
            {
              "aria-label": "Description",
              value: e.description,
              onChange: (S) => s({ ...e, description: S.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ i("section", { hidden: f !== "Queue", className: "dq-editor-section", children: /* @__PURE__ */ i(Mr, { draft: e, onChange: s, presentation: !1 }) }),
      /* @__PURE__ */ i("section", { hidden: f !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ i(Mr, { draft: e, onChange: s, queue: !1 }) }),
      /* @__PURE__ */ i("section", { hidden: f !== "Actions", className: "dq-editor-section", children: p === "tag" ? /* @__PURE__ */ i(
        Ki,
        {
          draft: e,
          saving: o,
          tagGroups: r,
          setDraft: s
        }
      ) : /* @__PURE__ */ i(
        ji,
        {
          draft: e,
          saving: o,
          stepKey: m,
          rememberStepKey: (S, w) => y.current.set(S, m(w)),
          setDraft: s
        }
      ) })
    ] }),
    /* @__PURE__ */ d("div", { className: "dq-editor-footer", children: [
      /* @__PURE__ */ i(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const S = URL.createObjectURL(
              new Blob([JSON.stringify([e], null, 2)], {
                type: "application/json"
              })
            ), w = document.createElement("a");
            w.href = S, w.download = "data-quality-review.json", w.click(), URL.revokeObjectURL(S);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ i("button", { className: "dq-button", type: "button", onClick: l, children: "Cancel" }),
      /* @__PURE__ */ i("button", { className: "dq-button primary", type: "button", onClick: c, children: "Save review" })
    ] })
  ] });
}
function sn({
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
          onChange: (o) => r({
            ...e,
            shortcut: o.target.value === "auto" ? void 0 : o.target.value
          }),
          children: [
            /* @__PURE__ */ d("option", { value: "auto", children: [
              "Position (",
              t < 9 ? t + 1 : "none",
              ")"
            ] }),
            /* @__PURE__ */ i("option", { value: "", children: "None" }),
            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((o) => /* @__PURE__ */ i("option", { value: o, children: o }, o))
          ]
        }
      )
    ] }),
    /* @__PURE__ */ d("label", { children: [
      "Button label",
      /* @__PURE__ */ i(
        "input",
        {
          value: e.label,
          onChange: (o) => r({ ...e, label: o.target.value })
        }
      )
    ] })
  ] });
}
function ji({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: o,
  setDraft: s
}) {
  const c = (l, f) => s({
    ...e,
    actions: e.actions.map(
      (C, p) => p === l ? f : C
    )
  });
  return /* @__PURE__ */ d(ve, { children: [
    /* @__PURE__ */ i("h3", { children: "Actions" }),
    /* @__PURE__ */ i("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
    /* @__PURE__ */ i("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ i(
      Ft,
      {
        items: e.actions,
        getKey: (l) => l.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (l) => s({ ...e, actions: l }),
        renderItem: (l, { index: f, dragHandleProps: C, isOver: p }) => /* @__PURE__ */ d(
          "fieldset",
          {
            className: p ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ d("legend", { children: [
                "Action ",
                f + 1
              ] }),
              /* @__PURE__ */ d("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    ...C,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${f + 1}`,
                    children: /* @__PURE__ */ i(Qt, {})
                  }
                ),
                /* @__PURE__ */ i("strong", { children: l.label || "New action" }),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    onClick: () => s({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, f + 1),
                        {
                          ...structuredClone(l),
                          id: crypto.randomUUID(),
                          label: l.label + " copy",
                          shortcut: ""
                        },
                        ...e.actions.slice(f + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ i(
                sn,
                {
                  action: l,
                  index: f,
                  onChange: (b) => c(f, b)
                }
              ),
              /* @__PURE__ */ i(
                Ft,
                {
                  items: l.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (b) => c(f, { ...l, steps: b }),
                  renderItem: (b, y) => /* @__PURE__ */ i(
                    Gi,
                    {
                      dragHandleProps: y.dragHandleProps,
                      saving: t,
                      isOver: y.isOver,
                      step: b,
                      index: y.index,
                      onChange: (m) => {
                        o(m, b), c(f, {
                          ...l,
                          steps: l.steps.map(
                            (S, w) => w === y.index ? m : S
                          )
                        });
                      },
                      onRemove: () => c(f, {
                        ...l,
                        steps: l.steps.filter(
                          (m, S) => S !== y.index
                        )
                      })
                    }
                  )
                }
              ),
              /* @__PURE__ */ d("div", { className: "dq-row", children: [
                /* @__PURE__ */ i(
                  "button",
                  {
                    className: "dq-button",
                    type: "button",
                    onClick: () => c(f, {
                      ...l,
                      steps: [...l.steps, { mode: "ADD", tagIds: [] }]
                    }),
                    children: "Add step"
                  }
                ),
                /* @__PURE__ */ i(
                  "button",
                  {
                    className: "dq-button",
                    type: "button",
                    onClick: () => s({
                      ...e,
                      actions: e.actions.filter(
                        (b, y) => y !== f
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
    /* @__PURE__ */ i(
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
function Ki({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: o
}) {
  const s = (c, l) => o({
    ...e,
    actions: e.actions.map(
      (f, C) => C === c ? l : f
    )
  });
  return /* @__PURE__ */ d(ve, { children: [
    /* @__PURE__ */ i("h3", { children: "Actions" }),
    /* @__PURE__ */ i("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ i("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ i(
      Ft,
      {
        items: e.actions,
        getKey: (c) => c.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (c) => o({ ...e, actions: c }),
        renderItem: (c, { index: l, dragHandleProps: f, isOver: C }) => /* @__PURE__ */ d(
          "fieldset",
          {
            className: C ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ d("legend", { children: [
                "Action ",
                l + 1
              ] }),
              /* @__PURE__ */ d("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    ...f,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${l + 1}`,
                    children: /* @__PURE__ */ i(Qt, {})
                  }
                ),
                /* @__PURE__ */ i("strong", { children: c.label || "New action" }),
                /* @__PURE__ */ i(
                  "button",
                  {
                    type: "button",
                    onClick: () => o({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, l + 1),
                        {
                          ...structuredClone(c),
                          id: crypto.randomUUID(),
                          label: c.label + " copy",
                          shortcut: ""
                        },
                        ...e.actions.slice(l + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ i(
                sn,
                {
                  action: c,
                  index: l,
                  onChange: (p) => s(l, p)
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
                      s(l, {
                        ...c,
                        effect: b === "SKIP" ? { mode: "SKIP" } : b === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : {
                          mode: "SET_TAG_GROUP",
                          tagGroupId: Number(b.slice(6))
                        }
                      });
                    },
                    children: [
                      /* @__PURE__ */ i("option", { value: "SKIP", children: "Skip" }),
                      /* @__PURE__ */ i("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
                      c.effect.mode === "SET_TAG_GROUP" && !r.some(
                        (p) => p.id === c.effect.tagGroupId
                      ) && /* @__PURE__ */ i(
                        "option",
                        {
                          value: `group:${c.effect.tagGroupId}`,
                          disabled: !0,
                          children: "Unavailable tag group"
                        }
                      ),
                      r.map((p) => /* @__PURE__ */ i("option", { value: `group:${p.id}`, children: p.name }, p.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ i(
                "button",
                {
                  className: "dq-button",
                  type: "button",
                  onClick: () => o({
                    ...e,
                    actions: e.actions.filter(
                      (p, b) => b !== l
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
    /* @__PURE__ */ i(
      "button",
      {
        className: "dq-button",
        type: "button",
        onClick: () => o({
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
function Gi({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: o,
  isOver: s,
  onChange: c,
  onRemove: l
}) {
  const f = on(e.mode);
  return /* @__PURE__ */ d(
    "div",
    {
      className: s ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": f,
      children: [
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            ...r,
            disabled: o,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${t + 1}`,
            children: /* @__PURE__ */ i(Qt, {})
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
            onChange: (C) => c({ ...e, mode: C.target.value }),
            children: [
              /* @__PURE__ */ i("option", { value: "ADD", children: "Add tags" }),
              /* @__PURE__ */ i("option", { value: "REMOVE", children: "Remove tags" }),
              /* @__PURE__ */ i("option", { value: "REMOVE_TREE", children: "Remove tags and descendants" }),
              /* @__PURE__ */ i("option", { value: "MARK_PRESENT", children: "Mark present" }),
              /* @__PURE__ */ i("option", { value: "MARK_ABSENT", children: "Mark absent" }),
              /* @__PURE__ */ i("option", { value: "CLEAR_ABSENCE", children: "Clear absence" })
            ]
          }
        ),
        /* @__PURE__ */ i("div", { className: "dq-step-tags", children: /* @__PURE__ */ i(
          xt,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (C) => c({ ...e, tagIds: C }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ i("button", { type: "button", "aria-label": "Remove step", onClick: l, children: /* @__PURE__ */ i(zr, {}) })
      ]
    }
  );
}
async function Bi() {
  const e = await F("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let o = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const l = JSON.parse(r);
      Array.isArray(l.reviews) && (o = JSON.stringify(l.reviews, null, 2));
    } catch {
    }
  const s = URL.createObjectURL(
    new Blob([o], { type: "application/json" })
  ), c = document.createElement("a");
  c.href = s, c.download = "data-quality-browser-recovery.json", c.click(), URL.revokeObjectURL(s);
}
function Dr({ label: e }) {
  return /* @__PURE__ */ d("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ i(Jr, { className: "dq-spin" }),
    e
  ] });
}
function xr({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ d("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ i(Ut, {}),
    /* @__PURE__ */ i("p", { children: e }),
    /* @__PURE__ */ i("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const Hi = { components: { DataQualityPage: Pi } };
export {
  Pi as DataQualityPage,
  Hi as default,
  Jt as objectFiltersEqual
};
