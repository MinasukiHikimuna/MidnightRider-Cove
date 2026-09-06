import { jsxs as u, jsx as n, Fragment as de } from "react/jsx-runtime";
import { useState as E, useEffect as Y, useMemo as _t, useRef as F, useCallback as ge, useLayoutEffect as Er } from "react";
import { countActiveObjectFilters as Cr, VIDEO_CRITERIA as Be, ActiveObjectFilterChips as Ar, FilterDialog as tr, VIDEO_SORT_OPTIONS as Ft, EntityReferenceMultiSelector as pt, DetailListPagination as qr, VideoPlayer as Rr, VideoCard as kr, EntityDetailTabs as Ir, SortableList as Ut } from "@cove/runtime/components";
import { Pencil as rr, AlertTriangle as ht, LayoutGrid as Or, Grid3X3 as Tr, ZoomOut as Pr, ZoomIn as xr, Film as Kt, Loader2 as nr, ChevronLeft as Mr, ChevronRight as $r, ExternalLink as Lr, X as ir, Plus as Dr, Upload as jr, Trash2 as or, GripVertical as sr } from "@cove/runtime/lucide-react";
import { extensionFetch as _r } from "@cove/runtime/api";
function Te(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function gt(e) {
  if (e.actions.some(ar))
    return "An action cannot contain contradictory assessments for the same tag.";
  if (!e.name.trim() || !e.actions.every(wt))
    return "Name the review and complete every action step before saving.";
  if (new Set(e.actions.map((r) => r.id)).size !== e.actions.length)
    return "Action IDs must be unique within a review.";
  const t = e.actions.map(
    (r, i) => r.shortcut ?? (i < 9 ? String(i + 1) : "")
  ).filter(Boolean);
  return t.some((r) => !/^[1-9]$/.test(r)) || new Set(t).size !== t.length ? "Assign each shortcut 1–9 only once, or choose None. Navigation and player keys are reserved." : "";
}
function me(e) {
  const t = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(100, t(e.perPage, 40)))
  };
}
function Jt(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function Se(e) {
  const { page: t, ...r } = e.view.filter;
  return JSON.stringify([
    r,
    e.view.objectFilter,
    e.view.searchMode
  ]);
}
function wt(e) {
  return !!e.label.trim() && e.steps.every(
    (t) => [
      "ADD",
      "REMOVE",
      "REMOVE_TREE",
      "MARK_PRESENT",
      "MARK_ABSENT",
      "CLEAR_ABSENCE"
    ].includes(t.mode) && t.tagIds.length > 0 && t.tagIds.every((r) => Number.isSafeInteger(r) && r > 0)
  ) && !ar(e);
}
function Qe(e) {
  return e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  );
}
function ar(e) {
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
function Pe(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Fr(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && Array.isArray(i.steps) && i.steps.every((s) => s && Array.isArray(s.tagIds)) && wt(i)
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => gt(r)))
    throw new Error(
      "Saved reviews contain invalid actions or shortcuts. Existing data has been kept; assign shortcuts 1–9 only once or leave them empty."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Fr(e) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.cardSize === void 0 || t.cardSize === null || Number.isFinite(t.cardSize) && t.cardSize >= 115 && t.cardSize <= 380) && (t.annotations === void 0 || Array.isArray(t.annotations) && t.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [t.annotationParents, t.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function mt(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const s of i)
      r.has(s.id) || (r.add(s.id), t.push(s));
  return t;
}
function Vt(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function Ur(e, t, r, i) {
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
function Kr(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((s) => r.has(s));
  for (const s of t)
    i ? r.delete(s) : r.add(s);
  return r;
}
function Jr(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const lr = "ext:com.midnightrider.data-quality:configuration", Vr = "ext:cove-data-quality:video-reviews", bt = "ext:com.midnightrider.data-quality:progress", xe = /* @__PURE__ */ new Map(), ze = /* @__PURE__ */ new Map(), ct = (e, t) => e.includes("*") || e.includes(t), Ge = (e) => U(`/api/savedfilters?mode=${encodeURIComponent(e)}`), zr = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function yt(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Ne(e) {
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
    reviews: Pe(JSON.stringify(t.reviews)),
    deletedIds: yt(t.deletedIds),
    importedIds: yt(t.importedIds)
  };
}
function Br(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const s of t) {
    const c = localStorage.getItem(s);
    if (c !== null) {
      const a = Pe(c);
      r ?? (r = a), a.forEach((y) => i.add(y.id));
    }
    yt(
      JSON.parse(localStorage.getItem(`${s}:account-imports`) ?? "[]")
    ).forEach((a) => i.add(a));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function cr(e) {
  const t = await U("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function dr(e, t) {
  const r = (ze.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return ze.set(e, r), r.finally(() => {
    ze.get(e) === r && ze.delete(e);
  }).catch(() => {
  }), r;
}
let Oe = null;
function Qr() {
  if (Oe) return Oe;
  const e = Gr();
  return Oe = e, e.finally(() => {
    Oe === e && (Oe = null);
  }).catch(() => {
  }), e;
}
async function Gr() {
  var w;
  const e = await U("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = ct(e.permissions, "savedfilters.read"), s = i && ct(e.permissions, "savedfilters.write"), c = i ? (await Ge(lr)).filter((q) => q.name === "Data Quality configuration").sort((q, v) => q.id - v.id) : [];
  if (c.length > 1) {
    const q = (v) => {
      const { revision: N, ...k } = Ne(v.uiOptions);
      return JSON.stringify(k);
    };
    if (c.some((v) => q(v) !== q(c[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (s)
      for (const v of c.slice(1))
        await U(`/api/savedfilters/${v.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${v.id}` })
        });
    c.splice(1);
  }
  let a = c.length ? Ne(c[0].uiOptions) : zr();
  const y = localStorage.getItem(`${r}:migrated`) === "true", S = localStorage.getItem(r), g = localStorage.getItem(`${r}:local-only`) === "true";
  !c.length && S && (a = Ne(S));
  let l = !c.length;
  if (c.length && g && S) {
    const q = Ne(S);
    if (q.reviews.some((N) => {
      const k = a.reviews.find((O) => O.id === N.id);
      return k && JSON.stringify(k) !== JSON.stringify(N);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const v = [
      .../* @__PURE__ */ new Set([...a.deletedIds, ...q.deletedIds])
    ];
    a = {
      ...a,
      reviews: mt(a.reviews, q.reviews).filter(
        (N) => !v.includes(N.id)
      ),
      deletedIds: v,
      importedIds: [
        .../* @__PURE__ */ new Set([...a.importedIds, ...q.importedIds])
      ]
    }, l = !0;
  }
  if (!y) {
    const q = JSON.stringify(a), v = Br(t);
    if (c.length && v.reviews.some((R) => {
      const h = a.reviews.find((A) => A.id === R.id);
      return h && JSON.stringify(h) !== JSON.stringify(R);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = i ? (await Ge(Vr)).flatMap(
      (R) => Pe(R.uiOptions ?? "[]")
    ) : [], k = v.known.filter(
      (R) => !v.reviews.some((h) => h.id === R)
    ), O = /* @__PURE__ */ new Set([...a.deletedIds, ...k]);
    a = {
      ...a,
      reviews: mt(
        v.reviews,
        a.reviews,
        N.filter(
          (R) => !v.known.includes(R.id) && !a.importedIds.includes(R.id)
        )
      ).filter((R) => !O.has(R.id)),
      deletedIds: [...O],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...a.importedIds,
          ...v.known,
          ...N.map((R) => R.id)
        ])
      ]
    }, l || (l = JSON.stringify(a) !== q);
  }
  const d = {
    userId: t,
    recordId: (w = c[0]) == null ? void 0 : w.id,
    config: a,
    readable: i,
    writable: s,
    durable: s
  };
  if (xe.set(r, d), l && s) {
    const q = a;
    c.length && (d.config = Ne(c[0].uiOptions)), await ur(r, q), a = d.config;
  } else c.length || (localStorage.setItem(r, JSON.stringify(a)), !i && (!y || g) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (s)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: a.reviews,
    storageKey: r,
    canWrite: ct(e.permissions, "videos.write"),
    canConfigure: !i || s,
    storageNotice: i ? s ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function ur(e, t) {
  const r = xe.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await cr(r), r.recordId != null) {
      const c = await U(
        `/api/savedfilters/${r.recordId}`
      );
      if (Ne(c.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const s = await U(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: lr,
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
function Hr(e, t) {
  return Pe(JSON.stringify(t)), dr(e, async () => {
    const r = xe.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((s) => !t.some((c) => c.id === s.id)).map((s) => s.id);
    await ur(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((s) => !t.some((c) => c.id === s))
    });
  });
}
function zt(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Wr(e, t) {
  const r = xe.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), s = i ? zt(i) : null;
  if (!r.readable) return s;
  const c = (await Ge(bt)).find(
    (y) => y.name === t
  ), a = c ? zt(c.uiOptions) : null;
  return s && (!a || s.updatedAt > a.updatedAt) ? s : a;
}
function Xr(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return dr(i, async () => {
    const s = xe.get(e);
    if (!(s != null && s.writable)) return;
    await cr(s);
    const c = (await Ge(bt)).find(
      (a) => a.name === t
    );
    await U(
      c ? `/api/savedfilters/${c.id}` : "/api/savedfilters",
      {
        method: c ? "PUT" : "POST",
        body: JSON.stringify({
          mode: bt,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Me = "confirmed_absent_tags", vt = "Confirmed absent tags", Yr = {
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
function He(e) {
  return Array.isArray(e) ? e.map(He) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? Yr[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === Me.toLowerCase() ? r.toLowerCase() : He(r)
    ])
  ) : e;
}
async function U(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await _r(e, { ...t, headers: r });
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
async function Bt(e, t, r) {
  const i = { ...e.view.objectFilter }, s = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return U("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      He({
        findFilter: me(t),
        objectFilter: i,
        filterExpression: s
      })
    )
  });
}
function Zr(e) {
  return `/api/stream/video/${e}`;
}
function Qt(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function en(e) {
  return `/api/stream/video/${e}/preview`;
}
function tn(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function rn(e) {
  return e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function St(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await U(`/api/tags/${r}`), t.add(r);
    for (let i = 1; ; i++) {
      const s = await U("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          He({
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
function nn(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${Me} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function Nt() {
  const t = (await U("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === Me.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${vt} custom field before applying tag assessments.`
    };
  const r = nn(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function on() {
  const e = await Nt();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await U("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: Me,
        label: vt,
        type: "tag",
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function We(e) {
  return [...new Set(e)];
}
function sn(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${Me} value is not a valid tag list.`
    );
  return We(e);
}
function an(e) {
  return We(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function ln(e, t) {
  let r;
  try {
    r = await Nt();
  } catch (g) {
    throw new Error(
      `Could not verify the ${vt} custom field. ${g instanceof Error ? g.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const i = await Promise.all(
    e.steps.map(async (g) => ({
      ...g,
      tagIds: g.mode === "REMOVE_TREE" ? await St(g.tagIds) : We(g.tagIds)
    }))
  ), s = i.filter(
    (g) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(g.mode)
  ), c = i.filter(
    (g) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(g.mode)
  ), a = We(t), y = r.definition.key;
  let S = 0;
  for (const g of a)
    try {
      const l = await U(`/api/videos/${g}`), d = an(l), w = { ...l.customFields ?? {} }, q = w[y], v = sn(q), N = new Set(d), k = new Set(v);
      for (const A of s)
        for (const I of A.tagIds)
          A.mode === "ADD" ? N.add(I) : N.delete(I);
      for (const A of c)
        for (const I of A.tagIds)
          A.mode === "MARK_PRESENT" ? (N.add(I), k.delete(I)) : A.mode === "MARK_ABSENT" ? (N.delete(I), k.add(I)) : k.delete(I);
      const O = [...N], R = [...k];
      JSON.stringify(d) === JSON.stringify(O) && JSON.stringify(v) === JSON.stringify(R) && (q === void 0 ? R.length === 0 : JSON.stringify(q) === JSON.stringify(v)) || await U(`/api/videos/${g}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: O,
          customFields: {
            ...w,
            [y]: R
          }
        })
      }), S++;
    } catch (l) {
      throw new Error(
        `Assessment stopped after ${S} video${S === 1 ? "" : "s"} completed; video ${g} was affected. Refresh and inspect it before retrying. ${l instanceof Error ? l.message : "Request failed."}`
      );
    }
}
async function cn(e, t) {
  if (!wt(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (Qe(e)) {
    await ln(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (i) => ({
      mode: i.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: i.mode === "REMOVE_TREE" ? await St(i.tagIds) : i.tagIds
    }))
  );
  for (let i = 0; i < r.length; i++)
    try {
      await U("/api/videos/bulk", {
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
function dn(e) {
  var y, S, g;
  const [t, r] = E({}), [i, s] = E(""), c = (((y = e == null ? void 0 : e.presentation) == null ? void 0 : y.annotations) ?? []).includes("tags") ? ((S = e == null ? void 0 : e.presentation) == null ? void 0 : S.annotationParents) ?? [] : [], a = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...c,
      ...((g = e == null ? void 0 : e.presentation) == null ? void 0 : g.binParents) ?? []
    ])
  ]);
  return Y(() => {
    let l = !0;
    return r({}), s(""), Promise.all(
      JSON.parse(a).map(
        async (d) => [d, await St([d])]
      )
    ).then((d) => {
      l && r(Object.fromEntries(d));
    }).catch(() => {
      l && s(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      l = !1;
    };
  }, [a]), { ids: t, error: i };
}
function un(e, t, r) {
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
        (y) => {
          var S;
          return y !== a.id && ((S = r[y]) == null ? void 0 : S.includes(a.id));
        }
      )
    ) : []
  };
}
function fn({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: s
}) {
  var y, S, g;
  const c = new Set(
    (((y = t.presentation) == null ? void 0 : y.binParents) ?? []).flatMap(
      (l) => (r[l] ?? []).filter((d) => d !== l)
    )
  ), a = /* @__PURE__ */ new Map();
  for (const l of e)
    for (const d of l.tags ?? [])
      if (c.has(d.id)) {
        const w = a.get(d.id) ?? { name: d.name, count: 0 };
        w.count++, a.set(d.id, w);
      }
  return (g = (S = t.presentation) == null ? void 0 : S.binParents) != null && g.length ? /* @__PURE__ */ u("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...a].sort((l, d) => l[1].name.localeCompare(d[1].name)).map(([l, d]) => /* @__PURE__ */ u(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => s(l),
        children: [
          d.name,
          " (",
          d.count,
          ")"
        ]
      },
      l
    )),
    !a.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function pn(e, t) {
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
function hn({
  objectFilter: e,
  overridden: t,
  disabled: r,
  onApply: i,
  onReset: s
}) {
  const [c, a] = E(!1), y = Cr(Be, e);
  return /* @__PURE__ */ u("section", { className: "dq-filter-panel", children: [
    /* @__PURE__ */ u("details", { children: [
      /* @__PURE__ */ u("summary", { children: [
        /* @__PURE__ */ n("span", { children: "Queue filters" }),
        /* @__PURE__ */ u("span", { className: "dq-filter-count", children: [
          y,
          " active",
          t ? " · adjusted" : ""
        ] })
      ] }),
      /* @__PURE__ */ u("div", { className: "dq-filter-panel-body", children: [
        y ? /* @__PURE__ */ n(
          "div",
          {
            className: r ? "dq-filter-chips-disabled" : void 0,
            "aria-disabled": r || void 0,
            inert: r ? !0 : void 0,
            children: /* @__PURE__ */ n(
              Ar,
              {
                criteriaDefinitions: Be,
                objectFilter: e,
                onRemove: () => {
                },
                onEdit: () => {
                  r || a(!0);
                },
                ariaLabel: "Current queue filters",
                removable: !1
              }
            )
          }
        ) : /* @__PURE__ */ n("p", { children: "No video filters. All videos can enter the queue." }),
        /* @__PURE__ */ u("div", { className: "dq-filter-panel-actions", children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: r,
              onClick: () => a(!0),
              children: "Adjust filters"
            }
          ),
          t && /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: r,
              onClick: s,
              children: "Reset filters to review defaults"
            }
          )
        ] })
      ] })
    ] }),
    c && /* @__PURE__ */ n("div", { onKeyDown: (S) => S.stopPropagation(), children: /* @__PURE__ */ n(
      tr,
      {
        open: !0,
        onClose: () => a(!1),
        criteria: Be,
        activeFilter: e,
        supportsFilterExpressions: !0,
        subjectLabel: "videos",
        onApply: (S) => {
          r || (i(S), a(!1));
        }
      }
    ) })
  ] });
}
function Gt({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [s, c] = E(!1), a = e.view.filter, y = (l) => t({
    ...e,
    view: { ...e.view, filter: { ...a, ...l } }
  }), S = e.presentation ?? {}, g = (l) => t({ ...e, presentation: { ...S, ...l } });
  return /* @__PURE__ */ u(de, { children: [
    i && /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ u("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(a.q ?? ""),
            onChange: (l) => y({ q: l.target.value })
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
              value: String(a.sort ?? "date"),
              onChange: (l) => y({ sort: l.target.value, sorts: void 0 }),
              children: [
                !Ft.some((l) => l.value === a.sort) && a.sort != null && /* @__PURE__ */ n("option", { value: String(a.sort), children: String(a.sort) }),
                Ft.map((l) => /* @__PURE__ */ n("option", { value: l.value, children: l.label }, l.value))
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
              value: String(a.direction ?? "desc"),
              onChange: (l) => y({ direction: l.target.value }),
              children: [
                /* @__PURE__ */ n("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ n("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ u("label", { children: [
          "Videos per page",
          /* @__PURE__ */ n(
            "input",
            {
              type: "number",
              min: "1",
              max: "100",
              value: Number(a.perPage) || 40,
              onChange: (l) => y({
                perPage: Math.max(
                  1,
                  Math.min(100, Number(l.target.value) || 40)
                )
              })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button",
          onClick: () => c(!0),
          children: "Edit video filters"
        }
      ),
      /* @__PURE__ */ u("p", { children: [
        Object.keys(e.view.objectFilter).length ? "Video filters configured" : "No video filters",
        ". Choose which videos enter the queue."
      ] }),
      s && /* @__PURE__ */ n("div", { onKeyDown: (l) => l.stopPropagation(), children: /* @__PURE__ */ n(
        tr,
        {
          open: !0,
          onClose: () => c(!1),
          criteria: Be,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: !0,
          subjectLabel: "videos",
          onApply: (l) => {
            t({ ...e, view: { ...e.view, objectFilter: l } }), c(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ u(de, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Choose how videos and tags appear while reviewing." }),
      /* @__PURE__ */ n("div", { className: "dq-field-grid", children: /* @__PURE__ */ u("label", { children: [
        "Preferred view",
        /* @__PURE__ */ n(
          "select",
          {
            value: e.view.displayMode === "wall" ? "wall" : "grid",
            onChange: (l) => t({
              ...e,
              view: {
                ...e.view,
                displayMode: l.target.value
              }
            }),
            children: ["grid", "wall"].map((l) => /* @__PURE__ */ n("option", { children: l }, l))
          }
        )
      ] }) }),
      /* @__PURE__ */ n("h4", { children: "Card annotations" }),
      /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((l) => {
        const d = S.annotations ?? [];
        return /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: d.includes(l),
              onChange: (w) => g({
                annotations: w.target.checked ? [...d, l] : d.filter((q) => q !== l)
              })
            }
          ),
          l
        ] }, l);
      }) }),
      (S.annotations ?? []).includes("tags") && /* @__PURE__ */ u(de, { children: [
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
        /* @__PURE__ */ n(
          pt,
          {
            entityType: "tag",
            values: S.annotationParents ?? [],
            placeholder: "Search annotation parent tags...",
            onChange: (l) => g({ annotationParents: l }),
            allowCreate: !1
          }
        )
      ] }),
      /* @__PURE__ */ n("h4", { children: "Tag bins" }),
      /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
      /* @__PURE__ */ n(
        pt,
        {
          entityType: "tag",
          values: S.binParents ?? [],
          placeholder: "Search tag-bin parent tags...",
          onChange: (l) => g({ binParents: l }),
          allowCreate: !1
        }
      )
    ] })
  ] });
}
const dt = 180, ut = 115, Ht = 380;
function Wt(e) {
  return e.view.displayMode === "wall" ? "wall" : "grid";
}
function gn(e) {
  return e === "wall" ? "wall" : "grid";
}
function mn() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Xt(e) {
  const t = new URLSearchParams(window.location.search);
  e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function bn(e) {
  return me({ ...e, page: 1 });
}
function Xe(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((a, y) => Xe(a, t[y]));
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  const r = e, i = t, s = Object.keys(r).sort(), c = Object.keys(i).sort();
  return s.length === c.length && s.every(
    (a, y) => a === c[y] && Xe(r[a], i[a])
  );
}
function yn(e, t) {
  if (t === 0) return "Showing 0 of 0";
  const r = Number(e.perPage) || 40, i = Math.max(1, Math.ceil(t / r)), s = Math.min(Math.max(1, Number(e.page) || 1), i), c = (s - 1) * r + 1, a = Math.min(s * r, t);
  return `Showing ${c.toLocaleString()}-${a.toLocaleString()} of ${t.toLocaleString()}`;
}
function fr(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function X(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
function wn({
  onNavigate: e
}) {
  const [t, r] = E([]), [i] = E(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [s, c] = E(""), [a, y] = E(!0), [S, g] = E(""), [l, d] = E(!1), [w, q] = E(!0), [v, N] = E(""), [k, O] = E(""), [R, h] = E(!1), [A, I] = E(!1), [p, $] = E(mn), [J, j] = E(!1), [se, ie] = E(!1), [ae, Et] = E(!1), [B, be] = E(
    null
  ), P = t.find((o) => o.id === p) ?? null, b = _t(
    () => (B == null ? void 0 : B.id) === p && P ? { ...P, view: B.view } : P,
    [B, p, P]
  ), pr = !!(b && P && !Xe(
    b.view.objectFilter,
    P.view.objectFilter
  )), $e = dn(b), [L, Ee] = E({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [hr, gr] = E({
    page: 1,
    perPage: 40
  }), [ee, Ct] = E({ items: [], totalCount: 0 }), [T, Le] = E(!1), [oe, At] = E(""), [le, ue] = E(() => /* @__PURE__ */ new Set()), Ye = F(le);
  Ye.current = le;
  const ye = F(/* @__PURE__ */ new Map()), [Q, te] = E(null), G = F(Q);
  G.current = Q;
  const [re, we] = E(!1), ce = F(re);
  ce.current = re;
  const qt = F(null), [Ce, Ze] = E("grid"), [fe, Rt] = E(dt), [_, et] = E(!1), De = F(!1), [mr, tt] = E(""), [kt, Ae] = E(""), [rt, qe] = E(""), [D, It] = E(null), [Ot, je] = E(""), [_e, Fe] = E(!1), nt = F(/* @__PURE__ */ new Map()), Tt = F(null), ve = F(0), Ue = F(0), Ke = F(null), Pt = ge(async () => {
    y(!0), g("");
    try {
      const o = await Qr();
      r(o.reviews), c(o.storageKey), d(o.canWrite), q(o.canConfigure ?? !0), N(o.storageNotice ?? ""), p && !o.reviews.some((f) => f.id === p) && ($(""), Xt(""));
    } catch (o) {
      g(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      y(!1);
    }
  }, [p]);
  Y(() => {
    Pt();
  }, []);
  const Je = ge(async () => {
    je("");
    try {
      It(await Nt());
    } catch (o) {
      It(null), je(
        "Tag assessment setup could not be checked. " + (o instanceof Error ? o.message : "Request failed.")
      );
    }
  }, []);
  Y(() => {
    Je();
  }, [Je]);
  const pe = ge(
    async (o, f) => {
      var K;
      const m = ++ve.current;
      (K = Ke.current) == null || K.abort();
      const C = new AbortController();
      Ke.current = C, f = me(f), Ee(f), Le(!0), At("");
      try {
        let M = await Bt(
          o,
          f,
          C.signal
        );
        const ne = Math.max(
          1,
          Math.ceil(M.totalCount / Number(f.perPage))
        );
        return Number(f.page) > ne && (f = { ...f, page: ne }, M = await Bt(
          o,
          f,
          C.signal
        )), m === ve.current && (Ct(M), Ee(f), gr(f)), M;
      } catch (M) {
        throw m === ve.current && At(
          M instanceof Error ? M.message : "Could not load the review queue."
        ), M;
      } finally {
        m === ve.current && Le(!1);
      }
    },
    []
  );
  Y(() => {
    var f;
    if (Ue.current += 1, ve.current += 1, (f = Ke.current) == null || f.abort(), I(!1), O(""), h(!1), ue(/* @__PURE__ */ new Set()), ye.current.clear(), te(null), we(!1), et(!1), De.current = !1, tt(""), Ae(""), qe(""), Ct({ items: [], totalCount: 0 }), !b) {
      Le(!1);
      return;
    }
    let o = !0;
    return Le(!0), (async () => {
      let m = null;
      try {
        m = await Wr(s, b.id);
      } catch (M) {
        o && (h(!0), O(
          M instanceof Error ? M.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const C = (m == null ? void 0 : m.signature) === Se(b) ? m : null, K = C ? me(C.filter) : bn(b.view.filter);
      Ee(K), Ze(
        C ? gn(C.displayMode) : Wt(b)
      ), Rt(
        C ? C.cardSize ?? dt : dt
      );
      try {
        const M = await pe(b, K);
        if (!o) return;
        const ne = Jt(
          M.items.map((H) => H.id),
          (C == null ? void 0 : C.focusedId) ?? null,
          (C == null ? void 0 : C.index) ?? 0
        );
        te(ne), V(ne);
      } catch {
      }
      o && I(!0);
    })(), () => {
      var m;
      o = !1, Ue.current++, ve.current++, (m = Ke.current) == null || m.abort();
    };
  }, [b == null ? void 0 : b.id]);
  const x = _t(
    () => ee.items.map((o) => o.id),
    [ee.items]
  );
  Y(() => {
    if (!A || !b || !s || T || oe || _ || (B == null ? void 0 : B.id) === b.id || R)
      return;
    const o = {
      version: 1,
      signature: Se(b),
      filter: L,
      focusedId: Q,
      index: Math.max(0, x.indexOf(Q ?? -1)),
      displayMode: Ce,
      cardSize: fe,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        s + ":progress:" + b.id,
        JSON.stringify(o)
      );
    } catch {
    }
    if (k) return;
    let f = !0;
    const m = window.setTimeout(() => {
      Xr(s, b.id, o).catch((C) => {
        f && O(
          "Progress is kept in this browser, but account sync failed. " + (C instanceof Error ? C.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      f = !1, window.clearTimeout(m);
    };
  }, [
    A,
    s,
    b,
    T,
    oe,
    _,
    L,
    Q,
    x,
    Ce,
    fe,
    B,
    k,
    R
  ]);
  const it = ee.items.find((o) => o.id === Q) ?? null;
  re && it && (qt.current = it);
  const he = it ?? (re ? qt.current : null), br = Vt(le, Q), xt = le.size > 0 ? `${le.size} selected video${le.size === 1 ? "" : "s"}` : Q == null ? "no video" : "focused video", V = ge((o, f = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const m = nt.current.get(o);
      m == null || m.focus({ preventScroll: !0 }), f && (m == null || m.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  Y(() => {
    A && !ce.current && V(G.current);
  }, [A, V]), Y(() => {
    T || !x.length || (G.current == null || !x.includes(G.current)) && (te(x[0]), ce.current || V(x[0]));
  }, [V, x, T]);
  const Re = ge(
    (o) => {
      ue((f) => {
        const m = o(f);
        for (const C of /* @__PURE__ */ new Set([...f, ...m]))
          f.has(C) !== m.has(C) && ye.current.set(
            C,
            (ye.current.get(C) ?? 0) + 1
          );
        return m;
      });
    },
    []
  ), ot = ge(
    (o) => {
      if (!x.length) return;
      const f = Math.max(
        0,
        x.indexOf(G.current ?? x[0])
      ), m = x[Math.max(0, Math.min(x.length - 1, f + o))];
      te(m), ce.current || V(m);
    },
    [V, x]
  ), st = ge(
    async (o) => {
      const f = Vt(
        Ye.current,
        G.current
      );
      if (!b || De.current || T || oe || !l || Qe(o) && (D == null ? void 0 : D.kind) !== "ready" || !f.length)
        return;
      const m = ++Ue.current, C = b.id, K = [...x], M = G.current, ne = new Map(
        f.map((z) => [z, ye.current.get(z) ?? 0])
      ), H = () => m === Ue.current && b.id === C;
      De.current = !0, et(!0), tt(
        Ye.current.size ? `${f.length} selected videos` : "the focused video"
      ), Ae(""), qe("");
      let Ie = !1;
      try {
        if (await cn(o, f), Ie = !0, !H()) return;
        ue((z) => {
          const W = new Set(z);
          for (const Z of f)
            (ye.current.get(Z) ?? 0) === ne.get(Z) && W.delete(Z);
          return W;
        }), Ae(
          `${o.label}: ${f.length} video${f.length === 1 ? "" : "s"} ${o.steps.length ? "updated" : "skipped"}.`
        );
      } catch (z) {
        if (!H()) return;
        qe(
          z instanceof Error ? z.message : "Action failed."
        );
      }
      try {
        if (await rn(o), !H()) return;
        const z = await pe(b, L);
        if (!H()) return;
        let W = z.items.map((Z) => Z.id);
        if (!W.length && z.totalCount > 0 && Number(L.page) > 1) {
          const Z = Math.max(1, Number(L.page) - 1), Ve = { ...L, page: Z };
          Ee(Ve), W = (await pe(b, Ve)).items.map((lt) => lt.id), ue(
            (lt) => new Set([...lt].filter((Nr) => W.includes(Nr)))
          );
          const jt = W.at(-1) ?? null;
          te(jt), ce.current || V(jt);
        } else {
          ue(
            (Ve) => new Set([...Ve].filter((Dt) => W.includes(Dt)))
          );
          const Z = Ur(
            K,
            W,
            M,
            Ie && f.includes(M ?? -1)
          );
          te(Z), ce.current && Z == null && we(!1), ce.current || V(Z);
        }
      } catch (z) {
        H() && qe(
          (W) => `${W ? `${W} ` : ""}${Ie ? "The action completed, but " : ""}the queue could not be refreshed. ${z instanceof Error ? z.message : "Refresh failed."}`
        );
      } finally {
        H() && (De.current = !1, et(!1), tt(""));
      }
    },
    [
      l,
      D,
      pe,
      L,
      V,
      x,
      T,
      oe,
      b
    ]
  );
  function yr() {
    var m;
    const o = (m = Tt.current) == null ? void 0 : m.firstElementChild, f = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, f.split(" ").filter(Boolean).length);
  }
  function wr(o) {
    if (o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || J || ae) return;
    if (re && o.key === "Escape") {
      X(o), we(!1), V(G.current);
      return;
    }
    if (!Jr(o.target)) return;
    if (o.key === "Escape") {
      X(o), Re(() => /* @__PURE__ */ new Set());
      return;
    }
    const f = (b == null ? void 0 : b.actions.findIndex(
      (K, M) => Te(K, M) === o.key
    )) ?? -1;
    if (f >= 0 && (b != null && b.actions[f])) {
      X(o), !_ && !T && st(b.actions[f]);
      return;
    }
    if (!re && o.key === " ") {
      X(o), Q != null && Re((K) => ft(K, Q));
      return;
    }
    if (!re && o.key.toLowerCase() === "a") {
      X(o), Re(
        (K) => Kr(K, x)
      );
      return;
    }
    if (_ || T || re) return;
    if (o.key === "Enter" && Q != null) {
      X(o), we(!0);
      return;
    }
    const m = yr(), C = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -m : o.key === "ArrowDown" ? m : 0;
    C && (X(o), ot(C));
  }
  function at(o) {
    $(o), Xt(o);
  }
  async function Mt(o) {
    if (!s) return !1;
    const f = o.map(Sn);
    try {
      await Hr(s, f);
    } catch (C) {
      throw C;
    }
    r(f), p && !f.some((C) => C.id === p) && at("");
    const m = f.find((C) => C.id === p);
    return m && P && JSON.stringify(m) !== JSON.stringify(P) && (m.view.displayMode !== P.view.displayMode && Ze(Wt(m)), Se(m) !== Se(P) && (be(null), ke(
      m,
      me({ ...m.view.filter, page: L.page })
    ))), !0;
  }
  if (a)
    return /* @__PURE__ */ n(Zt, { label: "Loading Data Quality reviews…" });
  if (S)
    return /* @__PURE__ */ u(de, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Rn().catch(
            (o) => g(
              "Could not export browser reviews. " + (o instanceof Error ? o.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        er,
        {
          message: S,
          onRetry: () => void Pt()
        }
      )
    ] });
  return /* @__PURE__ */ u("div", { className: "data-quality-page", onKeyDown: wr, children: [
    /* @__PURE__ */ u("header", { className: "data-quality-header", children: [
      /* @__PURE__ */ u("div", { children: [
        /* @__PURE__ */ n("h1", { children: "Data Quality" }),
        /* @__PURE__ */ n("p", { children: "A focused queue for previewing videos and applying saved review actions." })
      ] }),
      /* @__PURE__ */ u(
        "button",
        {
          className: "dq-button",
          type: "button",
          disabled: _ || T || !w,
          onClick: () => {
            ie(!1), j(!0);
          },
          children: [
            /* @__PURE__ */ n(rr, {}),
            " Manage reviews"
          ]
        }
      )
    ] }),
    v && /* @__PURE__ */ n("p", { className: "dq-status", children: v }),
    (D == null ? void 0 : D.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      D.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: _e,
          onClick: () => {
            Fe(!0), je(""), on().then(Je).catch(
              (o) => je(
                "Could not create the Confirmed absent tags custom field. " + (o instanceof Error ? o.message : "Request failed.")
              )
            ).finally(() => Fe(!1));
          },
          children: _e ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    ((D == null ? void 0 : D.kind) === "incompatible" || Ot) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(ht, {}),
      Ot || (D == null ? void 0 : D.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: _e,
          onClick: () => {
            Fe(!0), Je().finally(
              () => Fe(!1)
            );
          },
          children: _e ? "Checking…" : "Check again"
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
            const o = localStorage.getItem("page-videos") ?? "[]", f = URL.createObjectURL(
              new Blob([o], { type: "application/json" })
            ), m = document.createElement("a");
            m.href = f, m.download = "data-quality-unassigned-legacy-reviews.json", m.click(), URL.revokeObjectURL(f);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    k && /* @__PURE__ */ u("p", { role: "alert", children: [
      k,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            O(""), h(!1);
          },
          children: R ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    /* @__PURE__ */ u("section", { className: "dq-toolbar", children: [
      /* @__PURE__ */ u("label", { className: "dq-review-select", children: [
        "Review",
        /* @__PURE__ */ u(
          "select",
          {
            value: (b == null ? void 0 : b.id) ?? "",
            disabled: _,
            onChange: (o) => at(o.target.value),
            children: [
              /* @__PURE__ */ n("option", { value: "", children: "Choose a review…" }),
              t.map((o) => /* @__PURE__ */ n("option", { value: o.id, children: o.name }, o.id))
            ]
          }
        )
      ] }),
      b && /* @__PURE__ */ n("span", { className: "dq-range-count", children: yn(hr, ee.totalCount) }),
      b && /* @__PURE__ */ u(de, { children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: _ || T || !w,
            onClick: () => {
              ie(!0), j(!0);
            },
            children: "Edit review"
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: _ || T,
            onClick: () => Et(!0),
            children: "Adjust queue"
          }
        ),
        (B == null ? void 0 : B.id) === p && /* @__PURE__ */ u(de, { children: [
          /* @__PURE__ */ n("span", { children: "Temporary queue" }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: _ || T || !w,
              onClick: () => {
                P && Mt(
                  t.map(
                    (o) => o.id === p ? {
                      ...o,
                      view: {
                        ...b.view,
                        filter: { ...L, page: 1 }
                      }
                    } : o
                  )
                ).then(() => {
                  be(null), Ae("Queue saved to this review.");
                }).catch(
                  (o) => qe(
                    o instanceof Error ? o.message : "Could not save queue."
                  )
                );
              },
              children: "Save queue to review"
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: _ || T,
              onClick: () => {
                be(null), P && ke(
                  P,
                  me({
                    ...P.view.filter,
                    page: L.page
                  })
                );
              },
              children: "Reset to saved queue"
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-review-description", children: b.description && /* @__PURE__ */ n("p", { children: b.description }) }),
        /* @__PURE__ */ n(
          "div",
          {
            className: "dq-view-switch flex min-h-10 items-center gap-0.5 rounded-lg border border-border bg-card/70 px-1.5 py-1 shadow-sm sm:min-h-0",
            role: "group",
            "aria-label": "Review view",
            children: [
              { mode: "grid", label: "Grid", Icon: Or },
              { mode: "wall", label: "Wall", Icon: Tr }
            ].map(({ mode: o, label: f, Icon: m }) => /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: `inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-transparent p-2 text-secondary hover:bg-card/80 hover:text-foreground focus:border-accent focus:outline-none sm:min-h-0 sm:min-w-0 sm:p-1.5 ${Ce === o ? "bg-background/60 text-accent shadow-sm" : ""}`,
                "aria-label": f,
                title: f,
                "aria-pressed": Ce === o,
                onClick: () => Ze(o),
                children: /* @__PURE__ */ n(m, { className: "h-3.5 w-3.5" })
              },
              o
            ))
          }
        ),
        /* @__PURE__ */ u("div", { className: "hidden items-center gap-1 pl-1 md:flex", children: [
          /* @__PURE__ */ n(Pr, { className: "h-3 w-3 text-muted" }),
          /* @__PURE__ */ n(
            "input",
            {
              "aria-label": `Card size: ${fe}px`,
              title: `Card size: ${fe}px`,
              type: "range",
              min: ut,
              max: Ht,
              step: "5",
              className: "themed-range-input h-1 w-16 cursor-pointer sm:w-20",
              value: fe,
              style: {
                "--range-fill": `${(fe - ut) / (Ht - ut) * 100}%`
              },
              onChange: (o) => Rt(Number(o.target.value))
            }
          ),
          /* @__PURE__ */ n(xr, { className: "h-3 w-3 text-muted" })
        ] })
      ] })
    ] }),
    b && P && /* @__PURE__ */ n(
      hn,
      {
        objectFilter: b.view.objectFilter,
        overridden: pr,
        disabled: _ || T,
        onApply: $t,
        onReset: () => $t(P.view.objectFilter)
      }
    ),
    b ? /* @__PURE__ */ u(de, { children: [
      $e.error && /* @__PURE__ */ n("p", { role: "alert", children: $e.error }),
      /* @__PURE__ */ n(
        fn,
        {
          videos: ee.items,
          review: b,
          trees: $e.ids,
          disabled: _ || T,
          onChoose: (o) => {
            const f = pn(b, o);
            be(f), ke(f, { ...L, page: 1 });
          }
        }
      ),
      rt && !re && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(ht, {}),
        rt
      ] }),
      kt && /* @__PURE__ */ n("p", { role: "status", className: "dq-status", children: kt }),
      /* @__PURE__ */ u("div", { className: "dq-workspace", children: [
        /* @__PURE__ */ u("main", { children: [
          Lt("top"),
          T && !ee.items.length && /* @__PURE__ */ n(Zt, { label: "Loading review queue…" }),
          oe && !T && /* @__PURE__ */ n(
            er,
            {
              message: oe,
              onRetry: () => void pe(b, L).catch(() => {
              })
            }
          ),
          !T && !oe && !ee.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
            /* @__PURE__ */ n(Kt, {}),
            /* @__PURE__ */ n("p", { children: "No videos match this review." })
          ] }),
          !!ee.items.length && /* @__PURE__ */ n("div", { ref: Tt, children: /* @__PURE__ */ n(
            "div",
            {
              className: "dq-grid",
              style: {
                "--dq-card-width": `${fe}px`
              },
              children: ee.items.map(Sr)
            }
          ) }),
          Lt("bottom")
        ] }),
        /* @__PURE__ */ u("aside", { className: "dq-actions", children: [
          /* @__PURE__ */ n("strong", { children: xt }),
          b.actions.map((o, f) => /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              disabled: _ || T || !!oe || !l || Qe(o) && (D == null ? void 0 : D.kind) !== "ready" || !br.length,
              onClick: () => void st(o),
              children: [
                Te(o, f) && /* @__PURE__ */ n("kbd", { children: Te(o, f) }),
                /* @__PURE__ */ n("span", { children: o.label }),
                /* @__PURE__ */ n("small", { children: o.steps.length ? `${o.steps.length} step(s)` : "Skip" })
              ]
            },
            o.id
          )),
          !b.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
          !l && /* @__PURE__ */ n("p", { children: "Video write permission is required to apply actions." }),
          _ && /* @__PURE__ */ u("p", { role: "status", children: [
            /* @__PURE__ */ n(nr, { className: "dq-spin" }),
            " Applying action to",
            " ",
            mr,
            "…"
          ] }),
          /* @__PURE__ */ n("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(Kt, {}),
      /* @__PURE__ */ n("p", { children: t.length ? "Choose a saved review to open its queue." : "No saved reviews are available in this browser." })
    ] }),
    re && he && b && /* @__PURE__ */ n(
      Cn,
      {
        video: he,
        review: b,
        targetLabel: xt,
        pending: _,
        refreshing: T || !!oe,
        error: rt,
        canWrite: l,
        assessmentReady: (D == null ? void 0 : D.kind) === "ready",
        selected: le.has(he.id),
        hasPrevious: x.indexOf(he.id) > 0,
        hasNext: x.indexOf(he.id) >= 0 && x.indexOf(he.id) < x.length - 1,
        onToggleSelected: () => Re((o) => ft(o, he.id)),
        onPrevious: () => ot(-1),
        onNext: () => ot(1),
        onClose: () => {
          we(!1), V(G.current);
        },
        onAction: st
      }
    ),
    ae && b && /* @__PURE__ */ n(
      Yt,
      {
        reviews: t,
        activeReview: { ...b, view: { ...b.view, filter: L } },
        initialEdit: !0,
        temporary: !0,
        onSave: (o) => {
          const f = o.find((m) => m.id === p);
          return be(f), ke(
            f,
            me({ ...f.view.filter, page: L.page })
          ), !0;
        },
        onChoose: () => {
        },
        onClose: () => {
          Et(!1), V(G.current, !1);
        }
      }
    ),
    J && /* @__PURE__ */ n(
      Yt,
      {
        reviews: t,
        activeReview: P,
        initialEdit: se,
        onSave: Mt,
        onChoose: at,
        onClose: () => {
          j(!1), se && V(G.current, !1);
        }
      }
    )
  ] });
  async function ke(o, f) {
    const m = G.current, C = Math.max(0, x.indexOf(m ?? -1));
    try {
      const M = (await pe(o, f)).items.map((H) => H.id);
      ue(
        (H) => new Set([...H].filter((Ie) => M.includes(Ie)))
      );
      const ne = Jt(M, m, C);
      te(ne), ce.current || V(ne, !1);
    } catch {
    }
  }
  function $t(o) {
    if (_ || T || !b || !P) return;
    const f = Xe(
      o,
      P.view.objectFilter
    ), m = {
      ...b,
      view: {
        ...b.view,
        objectFilter: f ? P.view.objectFilter : o
      }
    }, C = Se(m) !== Se(P), K = C ? m : P;
    be(C ? m : null), Ae(
      f ? "Review filter defaults restored." : "Queue filters adjusted for this session."
    ), ke(K, { ...L, page: 1 });
  }
  function vr() {
    ue(/* @__PURE__ */ new Set()), ye.current.clear(), te(null);
  }
  function Lt(o) {
    return b ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: _ || T,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          qr,
          {
            filter: {
              ...L,
              page: Number(L.page) || 1,
              perPage: Number(L.perPage) || 40
            },
            totalCount: ee.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${o}`,
            onFilterChange: (f) => {
              _ || T || f.page === Number(L.page) || vn(
                { ...L, page: f.page },
                b,
                Ee,
                pe,
                vr
              );
            }
          }
        )
      }
    ) : null;
  }
  function Sr(o) {
    return /* @__PURE__ */ n(
      Nn,
      {
        video: un(o, b, $e.ids),
        displayMode: Ce,
        focused: o.id === Q,
        selected: le.has(o.id),
        setRef: (f) => {
          f ? nt.current.set(o.id, f) : nt.current.delete(o.id);
        },
        onFocus: () => te(o.id),
        onToggle: () => Re((f) => ft(f, o.id)),
        onPreview: () => {
          te(o.id), we(!0);
        },
        onNavigate: e
      },
      o.id
    );
  }
}
function vn(e, t, r, i, s) {
  r(e), s(), i(t, e).catch(() => {
  });
}
function ft(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Sn(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Nn({
  video: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: s,
  onFocus: c,
  onToggle: a,
  onPreview: y,
  onNavigate: S
}) {
  const g = fr(e), l = F(null), d = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, w = !!(d.date || d.studioName), q = !!(d.performers.length || d.tags.length);
  return Er(() => {
    const v = l.current;
    if (!v) return;
    const N = v.querySelector(
      `a[href="/video/${e.id}"]`
    ), k = v.querySelector(".card-title"), O = `dq-card-title-${e.id}`;
    k && (k.id = O), N && (N.target = "_blank", N.rel = "noreferrer", N.removeAttribute("aria-label"), N.setAttribute("aria-labelledby", O), N.classList.add("dq-card-link"));
    const R = v.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    R && R.setAttribute(
      "aria-label",
      i ? `Deselect ${g}` : `Select ${g}`
    );
    const h = v.querySelector(
      'button[title="Quick View"]'
    );
    h && h.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (v) => {
        l.current = v, s(v);
      },
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${g}${i ? ", selected" : ""}`,
      onFocus: c,
      onClick: (v) => {
        c(), v.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${t} ${w ? "has-card-metadata" : "no-card-metadata"} ${q ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          kr,
          {
            video: d,
            selected: i,
            onSelect: a,
            onNavigate: S,
            onQuickView: y,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t === "wall" && /* @__PURE__ */ n(En, { video: e })
      ]
    }
  );
}
function En({ video: e }) {
  const t = F(null), r = F(null), [i, s] = E(!1), [c, a] = E(!1), [y, S] = E(!1);
  return Y(() => {
    const g = t.current;
    if (!g || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      s(!0), a(!0);
      return;
    }
    const l = new IntersectionObserver(
      ([w]) => s(w.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), d = new IntersectionObserver(
      ([w]) => a(w.isIntersecting && w.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return l.observe(g), d.observe(g), () => {
      l.disconnect(), d.disconnect();
    };
  }, [e.id, e.files.length]), Y(() => {
    if (!i) {
      S(!1);
      return;
    }
    const g = new AbortController();
    return U(tn(e.id), {
      signal: g.signal
    }).then((l) => {
      g.signal.aborted || S(l.available === !0);
    }).catch(() => {
      g.signal.aborted || S(!1);
    }), () => g.abort();
  }, [i, e.id]), Y(() => {
    const g = r.current;
    g && (c ? Promise.resolve(g.play()).catch(() => {
    }) : g.pause());
  }, [y, c]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: y && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: en(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Cn({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: s,
  error: c,
  canWrite: a,
  assessmentReady: y,
  selected: S,
  hasPrevious: g,
  hasNext: l,
  onToggleSelected: d,
  onPrevious: w,
  onNext: q,
  onClose: v,
  onAction: N
}) {
  const k = F(null), O = F(null), R = e.files[0], h = fr(e);
  Y(() => {
    var $;
    const p = document.body.style.overflow;
    return document.body.style.overflow = "hidden", ($ = k.current) == null || $.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = p;
    };
  }, []);
  function A(p) {
    var j, se, ie;
    if (p.key !== "Tab") return;
    const $ = [
      ...((j = k.current) == null ? void 0 : j.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ae) => ae.offsetParent !== null);
    if (!$.length) {
      p.preventDefault(), (se = k.current) == null || se.focus();
      return;
    }
    const J = $.indexOf(
      document.activeElement
    );
    p.shiftKey && J <= 0 ? (p.preventDefault(), (ie = $.at(-1)) == null || ie.focus()) : !p.shiftKey && J === $.length - 1 && (p.preventDefault(), $[0].focus());
  }
  function I(p) {
    if (p.defaultPrevented || p.ctrlKey || p.metaKey || p.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const $ = p.key === "ArrowLeft" || p.key === "ArrowRight";
    if (p.altKey && !$) return;
    const J = O.current, j = p.currentTarget.querySelector("video");
    if (p.key === "Enter" || p.key === "Escape")
      p.repeat || v();
    else if (p.key === " " && J)
      p.repeat || J.toggle();
    else if ($ && J)
      J.seekBy(
        (p.key === "ArrowLeft" ? -1 : 1) * (p.shiftKey ? 5 : p.altKey ? 10 : 60)
      );
    else if ((p.key === "," || p.key === ".") && J) {
      const se = [R == null ? void 0 : R.duration, j == null ? void 0 : j.duration].find(
        (ae) => ae != null && Number.isFinite(ae) && ae > 0
      ) ?? 0, ie = e.parentVideoId != null ? (e.clipEndSec ?? se) - (e.clipStartSec ?? 0) : se;
      Number.isFinite(ie) && ie > 0 && J.seekBy((p.key === "," ? -1 : 1) * ie * 0.1);
    } else if (p.key.toLowerCase() === "n" || p.key.toLowerCase() === "m")
      !p.repeat && !i && !s && (p.key.toLowerCase() === "n" && g && w(), p.key.toLowerCase() === "m" && l && q());
    else if (p.key === "ArrowUp" && j)
      j.volume = Math.min(1, j.volume + 0.1);
    else if (p.key === "ArrowDown" && j)
      j.volume = Math.max(0, j.volume - 0.1);
    else return;
    X(p);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: k,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${h}`,
      className: "dq-preview",
      onKeyDown: A,
      onKeyDownCapture: I,
      onMouseDown: (p) => {
        p.target === p.currentTarget && v();
      },
      children: /* @__PURE__ */ u("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ u("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !g || i || s,
              onClick: w,
              children: /* @__PURE__ */ n(Mr, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !l || i || s,
              onClick: q,
              children: /* @__PURE__ */ n($r, {})
            }
          ),
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: h }),
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
              onClick: d,
              disabled: s,
              children: S ? "Selected" : "Select"
            }
          ),
          /* @__PURE__ */ n(
            "a",
            {
              href: `/video/${e.id}`,
              target: "_blank",
              rel: "noreferrer",
              className: "dq-details-link",
              "aria-label": `Open ${h} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ n(Lr, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: v,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(ir, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: R ? /* @__PURE__ */ n(
          Rr,
          {
            autostart: !0,
            streamUrl: Zr(e.id),
            posterUrl: Qt(e),
            format: R.format,
            audioCodec: R.audioCodec,
            duration: R.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (p) => (O.current = p, () => {
              O.current === p && (O.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: Qt(e), alt: "" }) }),
        c && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: c }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((p, $) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: i || s || !a || Qe(p) && !y,
            onClick: () => void N(p),
            children: [
              Te(p, $) && /* @__PURE__ */ n("kbd", { children: Te(p, $) }),
              p.label
            ]
          },
          p.id
        )) })
      ] })
    }
  );
}
function Yt({
  reviews: e,
  activeReview: t,
  initialEdit: r = !1,
  temporary: i = !1,
  onSave: s,
  onChoose: c,
  onClose: a
}) {
  const [y, S] = E(
    () => r && t ? structuredClone(t) : null
  ), [g, l] = E(""), [d, w] = E(!1), q = F(null);
  Y(() => {
    var I, p;
    const h = document.activeElement, A = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (p = (I = q.current) == null ? void 0 : I.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || p.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = A, h == null || h.focus({ preventScroll: !0 });
    };
  }, []);
  function v(h) {
    var p, $, J;
    if (h.defaultPrevented) {
      h.stopPropagation();
      return;
    }
    if (h.key === "Escape") {
      X(h), d || a();
      return;
    }
    if (h.key !== "Tab") {
      h.stopPropagation();
      return;
    }
    const A = [
      ...((p = q.current) == null ? void 0 : p.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((j) => j.offsetParent !== null);
    if (!A.length) {
      X(h), ($ = q.current) == null || $.focus();
      return;
    }
    const I = A.indexOf(
      document.activeElement
    );
    h.shiftKey && I <= 0 ? (X(h), (J = A.at(-1)) == null || J.focus()) : !h.shiftKey && I === A.length - 1 ? (X(h), A[0].focus()) : h.stopPropagation();
  }
  function N(h) {
    S(
      h ? structuredClone(h) : {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        view: structuredClone(
          (t == null ? void 0 : t.view) ?? {
            filter: {
              page: 1,
              perPage: 40,
              sort: "date",
              direction: "desc"
            },
            objectFilter: {},
            displayMode: "grid",
            searchMode: "text"
          }
        ),
        actions: []
      }
    ), l("");
  }
  async function k() {
    if (d) return;
    if (!y || gt(y)) {
      l(y ? gt(y) : "Choose a review.");
      return;
    }
    const h = { ...y, name: y.name.trim() }, A = e.some((I) => I.id === h.id) ? e.map((I) => I.id === h.id ? h : I) : [...e, h];
    w(!0), l("");
    try {
      if (!await s(A)) throw new Error("Could not save reviews.");
      c(h.id), a();
    } catch (I) {
      l(
        "Could not save reviews. Your edits are still open. " + (I instanceof Error ? I.message : "Retry saving.")
      );
    } finally {
      w(!1);
    }
  }
  async function O(h) {
    if (!d) {
      w(!0), l("");
      try {
        if (!await s(h)) throw new Error("Could not save reviews.");
      } catch (A) {
        l(
          A instanceof Error ? A.message : "Could not save reviews."
        );
      } finally {
        w(!1);
      }
    }
  }
  async function R(h) {
    var I;
    if (d) return;
    const A = (I = h.target.files) == null ? void 0 : I[0];
    if (h.target.value = "", !!A) {
      if (A.size > 2e6) {
        l("Review files must be smaller than 2 MB.");
        return;
      }
      w(!0), l("");
      try {
        const p = Pe(await A.text());
        if (!await s(mt(e, p)))
          throw new Error("Could not save reviews.");
      } catch (p) {
        l(
          p instanceof Error ? p.message : "Could not import reviews."
        );
      } finally {
        w(!1);
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
      onKeyDown: v,
      children: /* @__PURE__ */ u("div", { className: "dq-manager", children: [
        /* @__PURE__ */ u("header", { children: [
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: i ? "Adjust queue temporarily" : y ? e.some((h) => h.id === y.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: i ? "Apply changes for this session. Saved review settings stay available through Reset to saved queue." : "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: d,
              onClick: a,
              children: /* @__PURE__ */ n(ir, {})
            }
          )
        ] }),
        g && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: g }),
        /* @__PURE__ */ n("fieldset", { disabled: d, className: "dq-manager-content", children: y ? /* @__PURE__ */ n(
          An,
          {
            draft: y,
            temporary: i,
            saving: d,
            setDraft: S,
            onSave: () => void k(),
            onCancel: a
          }
        ) : /* @__PURE__ */ u(de, { children: [
          /* @__PURE__ */ u("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ u(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => N(),
                children: [
                  /* @__PURE__ */ n(Dr, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ u("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(jr, {}),
              " Import reviews",
              /* @__PURE__ */ n(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: R
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((h) => /* @__PURE__ */ u("article", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ n("strong", { children: h.name }),
              /* @__PURE__ */ n("p", { children: h.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => N(h), children: [
              /* @__PURE__ */ n(rr, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => N({
                  ...structuredClone(h),
                  id: crypto.randomUUID(),
                  name: `${h.name} copy`
                }),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${h.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${h.name}”?`) && O(
                    e.filter((A) => A.id !== h.id)
                  );
                },
                children: /* @__PURE__ */ n(or, {})
              }
            )
          ] }, h.id)) })
        ] }) })
      ] })
    }
  );
}
function An({
  draft: e,
  temporary: t = !1,
  saving: r = !1,
  setDraft: i,
  onSave: s,
  onCancel: c
}) {
  const [a, y] = E("Review"), S = F(/* @__PURE__ */ new WeakMap()), g = (d) => {
    let w = S.current.get(d);
    return w || (w = crypto.randomUUID(), S.current.set(d, w)), w;
  }, l = (d, w) => i({
    ...e,
    actions: e.actions.map(
      (q, v) => v === d ? w : q
    )
  });
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    !t && /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      Ir,
      {
        tabs: ["Review", "Queue", "Appearance", "Actions"].map((d) => ({
          key: d,
          label: d,
          count: d === "Actions" ? e.actions.length : void 0,
          disabled: r
        })),
        activeTab: a,
        onTabChange: y
      }
    ) }),
    /* @__PURE__ */ u("div", { className: "dq-editor-body", children: [
      !t && /* @__PURE__ */ u("section", { hidden: a !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ u("label", { children: [
          "Review name",
          /* @__PURE__ */ n(
            "input",
            {
              autoFocus: !0,
              "aria-label": "Review name",
              value: e.name,
              onChange: (d) => i({ ...e, name: d.target.value })
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
              onChange: (d) => i({ ...e, description: d.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n(
        "section",
        {
          hidden: !t && a !== "Queue",
          className: "dq-editor-section",
          children: /* @__PURE__ */ n(Gt, { draft: e, onChange: i, presentation: !1 })
        }
      ),
      !t && /* @__PURE__ */ n(
        "section",
        {
          hidden: a !== "Appearance",
          className: "dq-editor-section",
          children: /* @__PURE__ */ n(Gt, { draft: e, onChange: i, queue: !1 })
        }
      ),
      !t && /* @__PURE__ */ u("section", { hidden: a !== "Actions", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Actions" }),
        /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
        /* @__PURE__ */ n(
          Ut,
          {
            items: e.actions,
            getKey: (d) => d.id,
            disabled: r,
            className: "dq-sortable-list",
            onReorder: (d) => i({ ...e, actions: d }),
            renderItem: (d, { index: w, dragHandleProps: q, isOver: v }) => /* @__PURE__ */ u(
              "fieldset",
              {
                className: v ? "dq-action-card dq-drag-over" : "dq-action-card",
                children: [
                  /* @__PURE__ */ u("legend", { children: [
                    "Action ",
                    w + 1
                  ] }),
                  /* @__PURE__ */ u("div", { className: "dq-action-heading", children: [
                    /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        ...q,
                        disabled: r,
                        className: "dq-drag-handle",
                        "aria-label": `Reorder action ${w + 1}`,
                        children: /* @__PURE__ */ n(sr, {})
                      }
                    ),
                    /* @__PURE__ */ n("strong", { children: d.label || "New action" }),
                    /* @__PURE__ */ n("div", { className: "dq-row", children: /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        onClick: () => i({
                          ...e,
                          actions: [
                            ...e.actions.slice(0, w + 1),
                            {
                              ...structuredClone(d),
                              id: crypto.randomUUID(),
                              label: d.label + " copy",
                              shortcut: ""
                            },
                            ...e.actions.slice(w + 1)
                          ]
                        }),
                        children: "Duplicate action"
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ u("div", { className: "dq-field-grid", children: [
                    /* @__PURE__ */ u("label", { children: [
                      "Shortcut",
                      /* @__PURE__ */ u(
                        "select",
                        {
                          value: d.shortcut ?? "auto",
                          onChange: (N) => l(w, {
                            ...d,
                            shortcut: N.target.value === "auto" ? void 0 : N.target.value
                          }),
                          children: [
                            /* @__PURE__ */ u("option", { value: "auto", children: [
                              "Position (",
                              w < 9 ? w + 1 : "none",
                              ")"
                            ] }),
                            /* @__PURE__ */ n("option", { value: "", children: "None" }),
                            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((N) => /* @__PURE__ */ n("option", { value: N, children: N }, N))
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ u("label", { children: [
                      "Button label",
                      /* @__PURE__ */ n(
                        "input",
                        {
                          value: d.label,
                          onChange: (N) => l(w, {
                            ...d,
                            label: N.target.value
                          })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ n(
                    Ut,
                    {
                      items: d.steps,
                      getKey: g,
                      disabled: r,
                      className: "dq-sortable-list",
                      onReorder: (N) => l(w, { ...d, steps: N }),
                      renderItem: (N, { index: k, dragHandleProps: O, isOver: R }) => /* @__PURE__ */ n(
                        qn,
                        {
                          dragHandleProps: O,
                          saving: r,
                          isOver: R,
                          step: N,
                          index: k,
                          onChange: (h) => {
                            S.current.set(h, g(N)), l(w, {
                              ...d,
                              steps: d.steps.map(
                                (A, I) => I === k ? h : A
                              )
                            });
                          },
                          onRemove: () => l(w, {
                            ...d,
                            steps: d.steps.filter(
                              (h, A) => A !== k
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
                        onClick: () => l(w, {
                          ...d,
                          steps: [...d.steps, { mode: "ADD", tagIds: [] }]
                        }),
                        children: "Add step"
                      }
                    ),
                    /* @__PURE__ */ n(
                      "button",
                      {
                        className: "dq-button",
                        type: "button",
                        onClick: () => i({
                          ...e,
                          actions: e.actions.filter(
                            (N, k) => k !== w
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
            onClick: () => i({
              ...e,
              actions: [
                ...e.actions,
                { id: crypto.randomUUID(), label: "", steps: [] }
              ]
            }),
            children: "Add action"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ u("div", { className: "dq-editor-footer", children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const d = URL.createObjectURL(
              new Blob([JSON.stringify([e], null, 2)], {
                type: "application/json"
              })
            ), w = document.createElement("a");
            w.href = d, w.download = "data-quality-review.json", w.click(), URL.revokeObjectURL(d);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: c, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: s, children: t ? "Apply temporary queue" : "Save review" })
    ] })
  ] });
}
function qn({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: i,
  isOver: s,
  onChange: c,
  onRemove: a
}) {
  return /* @__PURE__ */ u("div", { className: s ? "dq-action-step dq-drag-over" : "dq-action-step", children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        ...r,
        disabled: i,
        className: "dq-drag-handle",
        "aria-label": `Reorder step ${t + 1}`,
        children: /* @__PURE__ */ n(sr, {})
      }
    ),
    /* @__PURE__ */ u("span", { children: [
      "Step ",
      t + 1
    ] }),
    /* @__PURE__ */ u(
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
    /* @__PURE__ */ n(
      pt,
      {
        entityType: "tag",
        values: e.tagIds,
        onChange: (y) => c({ ...e, tagIds: y }),
        placeholder: "Choose tags",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: a, children: /* @__PURE__ */ n(or, {}) })
  ] });
}
async function Rn() {
  const e = await U("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
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
function Zt({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(nr, { className: "dq-spin" }),
    e
  ] });
}
function er({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(ht, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const xn = { components: { DataQualityPage: wn } };
export {
  wn as DataQualityPage,
  xn as default,
  Xe as objectFiltersEqual
};
