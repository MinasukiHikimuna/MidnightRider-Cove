import { jsxs as u, jsx as i, Fragment as Re } from "react/jsx-runtime";
import { useState as S, useEffect as G, useRef as D, useMemo as ke, useCallback as ve, useLayoutEffect as vr } from "react";
import { VIDEO_SORT_OPTIONS as Ct, FilterDialog as nn, VIDEO_CRITERIA as At, EntityReferenceMultiSelector as Rt, DetailListToolbar as on, DetailListPagination as sn, VideoPlayer as an, VideoCard as ln, EntityDetailTabs as cn, SortableList as ar } from "@cove/runtime/components";
import { ChevronLeft as Sr, Pencil as Er, Settings as dn, AlertTriangle as qt, Save as un, RotateCcw as fn, ChevronRight as Nr, Film as lr, Loader2 as Cr, ExternalLink as pn, X as Ar, Plus as gn, Upload as hn, Trash2 as Rr, GripVertical as qr } from "@cove/runtime/lucide-react";
import { extensionFetch as mn } from "@cove/runtime/api";
function Pe(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function It(e) {
  if (e.actions.some(Ir))
    return "An action cannot contain contradictory assessments for the same tag.";
  if (!e.name.trim() || !e.actions.every(xt))
    return "Name the review and complete every action step before saving.";
  if (new Set(e.actions.map((r) => r.id)).size !== e.actions.length)
    return "Action IDs must be unique within a review.";
  const t = e.actions.map(
    (r, o) => r.shortcut ?? (o < 9 ? String(o + 1) : "")
  ).filter(Boolean);
  return t.some((r) => !/^[1-9]$/.test(r)) || new Set(t).size !== t.length ? "Assign each shortcut 1–9 only once, or choose None. Navigation and player keys are reserved." : "";
}
function ge(e) {
  const t = (r, o) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : o;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(1e3, t(e.perPage, 40)))
  };
}
function cr(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function Ce(e) {
  const { page: t, ...r } = e.view.filter;
  return JSON.stringify([
    r,
    e.view.objectFilter,
    e.view.searchMode
  ]);
}
function xt(e) {
  return !!e.label.trim() && e.steps.every(
    (t) => [
      "ADD",
      "REMOVE",
      "REMOVE_TREE",
      "MARK_PRESENT",
      "MARK_ABSENT",
      "CLEAR_ABSENCE"
    ].includes(t.mode) && t.tagIds.length > 0 && t.tagIds.every((r) => Number.isSafeInteger(r) && r > 0)
  ) && !Ir(e);
}
function rt(e) {
  return e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  );
}
function Ir(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.steps)
    if (["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(r.mode))
      for (const o of r.tagIds) {
        const l = t.get(o);
        if (l && l !== r.mode) return !0;
        t.set(o, r.mode);
      }
  return !1;
}
function Le(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && bn(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (o) => typeof o == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (o) => typeof (o == null ? void 0 : o.id) == "string" && typeof o.label == "string" && (o.shortcut === void 0 || typeof o.shortcut == "string") && Array.isArray(o.steps) && o.steps.every((l) => l && Array.isArray(l.tagIds)) && xt(o)
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => It(r)))
    throw new Error(
      "Saved reviews contain invalid actions or shortcuts. Existing data has been kept; assign shortcuts 1–9 only once or leave them empty."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function bn(e) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.cardSize === void 0 || t.cardSize === null || Number.isFinite(t.cardSize) && t.cardSize >= 115 && t.cardSize <= 380) && (t.annotations === void 0 || Array.isArray(t.annotations) && t.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [t.annotationParents, t.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0)
  );
}
function Tt(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const o of e)
    for (const l of o)
      r.has(l.id) || (r.add(l.id), t.push(l));
  return t;
}
function dr(e, t) {
  return e.size > 0 ? [...e].sort((r, o) => r - o) : t == null ? [] : [t];
}
function ur(e, t, r, o) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!o && t.includes(r)) return r;
  const l = Math.max(0, e.indexOf(r));
  if (o) {
    for (const d of e.slice(l + 1))
      if (t.includes(d)) return d;
    if (t.includes(r)) {
      for (const d of e.slice(0, l).reverse())
        if (t.includes(d)) return d;
      return r;
    }
  }
  return t[Math.min(l, t.length - 1)];
}
function yn(e, t) {
  const r = new Set(e), o = t.length > 0 && t.every((l) => r.has(l));
  for (const l of t)
    o ? r.delete(l) : r.add(l);
  return r;
}
function wn(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const Tr = "ext:com.midnightrider.data-quality:configuration", vn = "ext:cove-data-quality:video-reviews", kt = "ext:com.midnightrider.data-quality:progress", Me = /* @__PURE__ */ new Map(), tt = /* @__PURE__ */ new Map(), vt = (e, t) => e.includes("*") || e.includes(t), nt = (e) => B(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Sn = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Ot(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Ae(e) {
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
    reviews: Le(JSON.stringify(t.reviews)),
    deletedIds: Ot(t.deletedIds),
    importedIds: Ot(t.importedIds)
  };
}
function En(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const o = /* @__PURE__ */ new Set();
  for (const l of t) {
    const d = localStorage.getItem(l);
    if (d !== null) {
      const c = Le(d);
      r ?? (r = c), c.forEach((v) => o.add(v.id));
    }
    Ot(
      JSON.parse(localStorage.getItem(`${l}:account-imports`) ?? "[]")
    ).forEach((c) => o.add(c));
  }
  return {
    reviews: r ?? [],
    known: [...o],
    present: r !== void 0
  };
}
async function kr(e) {
  const t = await B("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Or(e, t) {
  const r = (tt.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return tt.set(e, r), r.finally(() => {
    tt.get(e) === r && tt.delete(e);
  }).catch(() => {
  }), r;
}
let Oe = null;
function Nn() {
  if (Oe) return Oe;
  const e = Cn();
  return Oe = e, e.finally(() => {
    Oe === e && (Oe = null);
  }).catch(() => {
  }), e;
}
async function Cn() {
  var C;
  const e = await B("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, o = vt(e.permissions, "savedfilters.read"), l = o && vt(e.permissions, "savedfilters.write"), d = o ? (await nt(Tr)).filter((A) => A.name === "Data Quality configuration").sort((A, y) => A.id - y.id) : [];
  if (d.length > 1) {
    const A = (y) => {
      const { revision: q, ...T } = Ae(y.uiOptions);
      return JSON.stringify(T);
    };
    if (d.some((y) => A(y) !== A(d[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (l)
      for (const y of d.slice(1))
        await B(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    d.splice(1);
  }
  let c = d.length ? Ae(d[0].uiOptions) : Sn();
  const v = localStorage.getItem(`${r}:migrated`) === "true", E = localStorage.getItem(r), g = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && E && (c = Ae(E));
  let a = !d.length;
  if (d.length && g && E) {
    const A = Ae(E);
    if (A.reviews.some((q) => {
      const T = c.reviews.find((L) => L.id === q.id);
      return T && JSON.stringify(T) !== JSON.stringify(q);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const y = [
      .../* @__PURE__ */ new Set([...c.deletedIds, ...A.deletedIds])
    ];
    c = {
      ...c,
      reviews: Tt(c.reviews, A.reviews).filter(
        (q) => !y.includes(q.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...c.importedIds, ...A.importedIds])
      ]
    }, a = !0;
  }
  if (!v) {
    const A = JSON.stringify(c), y = En(t);
    if (d.length && y.reviews.some((f) => {
      const N = c.reviews.find((R) => R.id === f.id);
      return N && JSON.stringify(N) !== JSON.stringify(f);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const q = o ? (await nt(vn)).flatMap(
      (f) => Le(f.uiOptions ?? "[]")
    ) : [], T = y.known.filter(
      (f) => !y.reviews.some((N) => N.id === f)
    ), L = /* @__PURE__ */ new Set([...c.deletedIds, ...T]);
    c = {
      ...c,
      reviews: Tt(
        y.reviews,
        c.reviews,
        q.filter(
          (f) => !y.known.includes(f.id) && !c.importedIds.includes(f.id)
        )
      ).filter((f) => !L.has(f.id)),
      deletedIds: [...L],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...c.importedIds,
          ...y.known,
          ...q.map((f) => f.id)
        ])
      ]
    }, a || (a = JSON.stringify(c) !== A);
  }
  const h = {
    userId: t,
    recordId: (C = d[0]) == null ? void 0 : C.id,
    config: c,
    readable: o,
    writable: l,
    durable: l
  };
  if (Me.set(r, h), a && l) {
    const A = c;
    d.length && (h.config = Ae(d[0].uiOptions)), await Pr(r, A), c = h.config;
  } else d.length || (localStorage.setItem(r, JSON.stringify(c)), !o && (!v || g) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!o) localStorage.setItem(`${r}:migrated`, "true");
  else if (l)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: c.reviews,
    storageKey: r,
    canWrite: vt(e.permissions, "videos.write"),
    canConfigure: !o || l,
    storageNotice: o ? l ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Pr(e, t) {
  const r = Me.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const o = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await kr(r), r.recordId != null) {
      const d = await B(
        `/api/savedfilters/${r.recordId}`
      );
      if (Ae(d.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const l = await B(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Tr,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(o)
        })
      }
    );
    r.recordId = l.id;
  } else
    localStorage.setItem(e, JSON.stringify(o)), localStorage.setItem(`${e}:local-only`, "true");
  if (r.config = o, r.durable)
    try {
      localStorage.setItem(e, JSON.stringify(o)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function An(e, t) {
  return Le(JSON.stringify(t)), Or(e, async () => {
    const r = Me.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const o = r.config.reviews.filter((l) => !t.some((d) => d.id === l.id)).map((l) => l.id);
    await Pr(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...o])
      ].filter((l) => !t.some((d) => d.id === l))
    });
  });
}
function fr(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Rn(e, t) {
  const r = Me.get(e);
  if (!r) return null;
  const o = localStorage.getItem(`${e}:progress:${t}`), l = o ? fr(o) : null;
  if (!r.readable) return l;
  const d = (await nt(kt)).find(
    (v) => v.name === t
  ), c = d ? fr(d.uiOptions) : null;
  return l && (!c || l.updatedAt > c.updatedAt) ? l : c;
}
function qn(e, t, r) {
  const o = `${e}:progress:${t}`;
  try {
    localStorage.setItem(o, JSON.stringify(r));
  } catch {
  }
  return Or(o, async () => {
    const l = Me.get(e);
    if (!(l != null && l.writable)) return;
    await kr(l);
    const d = (await nt(kt)).find(
      (c) => c.name === t
    );
    await B(
      d ? `/api/savedfilters/${d.id}` : "/api/savedfilters",
      {
        method: d ? "PUT" : "POST",
        body: JSON.stringify({
          mode: kt,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const xe = "confirmed_absent_tags", Dt = "Confirmed absent tags", In = {
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
      t === "modifier" && typeof r == "string" ? In[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === xe.toLowerCase() ? r.toLowerCase() : it(r)
    ])
  ) : e;
}
async function B(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const o = await mn(e, { ...t, headers: r });
  if (!o.ok) {
    let d = o.statusText || `Request failed (${o.status}).`;
    try {
      const c = await o.json();
      d = c.message || c.detail || c.error || d;
    } catch {
    }
    throw new Error(d);
  }
  if (o.status === 204 || o.status === 205) return;
  const l = await o.text();
  return l ? JSON.parse(l) : void 0;
}
async function St(e, t, r) {
  const o = { ...e.view.objectFilter }, l = o._filterExpression;
  if (delete o._filterExpression, delete o.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return B("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      it({
        findFilter: ge(t),
        objectFilter: o,
        filterExpression: l
      })
    )
  });
}
function Tn(e) {
  return `/api/stream/video/${e}`;
}
function pr(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function kn(e) {
  return `/api/stream/video/${e}/preview`;
}
function On(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Pn(e) {
  return e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Ft(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await B(`/api/tags/${r}`), t.add(r);
    for (let o = 1; ; o++) {
      const l = await B("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          it({
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
      for (const d of l.items) t.add(d.id);
      if (o * 1e3 >= l.totalCount) break;
      if (!l.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...t];
}
function Ln(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${xe} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function $t() {
  const t = (await B("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === xe.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${Dt} custom field before applying tag assessments.`
    };
  const r = Ln(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function Mn() {
  const e = await $t();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await B("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: xe,
        label: Dt,
        type: "tag",
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function ot(e) {
  return [...new Set(e)];
}
function xn(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${xe} value is not a valid tag list.`
    );
  return ot(e);
}
function Dn(e) {
  return ot(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function Fn(e, t) {
  let r;
  try {
    r = await $t();
  } catch (g) {
    throw new Error(
      `Could not verify the ${Dt} custom field. ${g instanceof Error ? g.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const o = await Promise.all(
    e.steps.map(async (g) => ({
      ...g,
      tagIds: g.mode === "REMOVE_TREE" ? await Ft(g.tagIds) : ot(g.tagIds)
    }))
  ), l = o.filter(
    (g) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(g.mode)
  ), d = o.filter(
    (g) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(g.mode)
  ), c = ot(t), v = r.definition.key;
  let E = 0;
  for (const g of c)
    try {
      const a = await B(`/api/videos/${g}`), h = Dn(a), C = { ...a.customFields ?? {} }, A = C[v], y = xn(A), q = new Set(h), T = new Set(y);
      for (const R of l)
        for (const M of R.tagIds)
          R.mode === "ADD" ? q.add(M) : q.delete(M);
      for (const R of d)
        for (const M of R.tagIds)
          R.mode === "MARK_PRESENT" ? (q.add(M), T.delete(M)) : R.mode === "MARK_ABSENT" ? (q.delete(M), T.add(M)) : T.delete(M);
      const L = [...q], f = [...T];
      JSON.stringify(h) === JSON.stringify(L) && JSON.stringify(y) === JSON.stringify(f) && (A === void 0 ? f.length === 0 : JSON.stringify(A) === JSON.stringify(y)) || await B(`/api/videos/${g}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: L,
          customFields: {
            ...C,
            [v]: f
          }
        })
      }), E++;
    } catch (a) {
      throw new Error(
        `Assessment stopped after ${E} video${E === 1 ? "" : "s"} completed; video ${g} was affected. Refresh and inspect it before retrying. ${a instanceof Error ? a.message : "Request failed."}`
      );
    }
}
async function $n(e, t) {
  if (!xt(e) || t.length === 0 || t.some((o) => !Number.isSafeInteger(o) || o <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (rt(e)) {
    await Fn(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (o) => ({
      mode: o.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: o.mode === "REMOVE_TREE" ? await Ft(o.tagIds) : o.tagIds
    }))
  );
  for (let o = 0; o < r.length; o++)
    try {
      await B("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({
          ids: [...t],
          tagIds: [...r[o].tagIds],
          tagMode: r[o].mode
        })
      });
    } catch (l) {
      throw new Error(
        `Step ${o + 1} failed; ${o} earlier step(s) completed. Refresh and check the selected videos before retrying. ${l instanceof Error ? l.message : "Request failed."}`
      );
    }
}
function _n(e) {
  var v, E, g;
  const [t, r] = S({}), [o, l] = S(""), d = (((v = e == null ? void 0 : e.presentation) == null ? void 0 : v.annotations) ?? []).includes("tags") ? ((E = e == null ? void 0 : e.presentation) == null ? void 0 : E.annotationParents) ?? [] : [], c = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...d,
      ...((g = e == null ? void 0 : e.presentation) == null ? void 0 : g.binParents) ?? []
    ])
  ]);
  return G(() => {
    let a = !0;
    return r({}), l(""), Promise.all(
      JSON.parse(c).map(
        async (h) => [h, await Ft([h])]
      )
    ).then((h) => {
      a && r(Object.fromEntries(h));
    }).catch(() => {
      a && l(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      a = !1;
    };
  }, [c]), { ids: t, error: o };
}
function Un(e, t, r) {
  const o = t == null ? void 0 : t.presentation, l = (o == null ? void 0 : o.annotations) ?? [], d = (o == null ? void 0 : o.annotationParents) ?? [];
  return {
    ...e,
    details: void 0,
    organized: !1,
    groups: [],
    galleries: [],
    date: l.includes("date") ? e.date : void 0,
    studioId: l.includes("studio") ? e.studioId : void 0,
    studioName: l.includes("studio") ? e.studioName : void 0,
    performers: l.includes("performers") ? e.performers : [],
    tags: l.includes("tags") && d.length > 0 ? (e.tags ?? []).filter(
      (c) => d.some(
        (v) => {
          var E;
          return v !== c.id && ((E = r[v]) == null ? void 0 : E.includes(c.id));
        }
      )
    ) : []
  };
}
function jn({
  videos: e,
  review: t,
  trees: r,
  disabled: o,
  onChoose: l
}) {
  var v, E, g;
  const d = new Set(
    (((v = t.presentation) == null ? void 0 : v.binParents) ?? []).flatMap(
      (a) => (r[a] ?? []).filter((h) => h !== a)
    )
  ), c = /* @__PURE__ */ new Map();
  for (const a of e)
    for (const h of a.tags ?? [])
      if (d.has(h.id)) {
        const C = c.get(h.id) ?? { name: h.name, count: 0 };
        C.count++, c.set(h.id, C);
      }
  return (g = (E = t.presentation) == null ? void 0 : E.binParents) != null && g.length ? /* @__PURE__ */ u("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ i("span", { children: "Tags on this page:" }),
    [...c].sort((a, h) => a[1].name.localeCompare(h[1].name)).map(([a, h]) => /* @__PURE__ */ u(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: o,
        onClick: () => l(a),
        children: [
          h.name,
          " (",
          h.count,
          ")"
        ]
      },
      a
    )),
    !c.size && /* @__PURE__ */ i("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function Kn(e, t) {
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
function gr({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: o = !0
}) {
  const [l, d] = S(!1), c = e.view.filter, v = (a) => t({
    ...e,
    view: { ...e.view, filter: { ...c, ...a } }
  }), E = e.presentation ?? {}, g = (a) => t({ ...e, presentation: { ...E, ...a } });
  return /* @__PURE__ */ u(Re, { children: [
    o && /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ i("legend", { children: "Queue" }),
      /* @__PURE__ */ u("label", { children: [
        "Search",
        /* @__PURE__ */ i(
          "input",
          {
            value: String(c.q ?? ""),
            onChange: (a) => v({ q: a.target.value })
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
              value: String(c.sort ?? "date"),
              onChange: (a) => v({ sort: a.target.value, sorts: void 0 }),
              children: [
                !Ct.some((a) => a.value === c.sort) && c.sort != null && /* @__PURE__ */ i("option", { value: String(c.sort), children: String(c.sort) }),
                Ct.map((a) => /* @__PURE__ */ i("option", { value: a.value, children: a.label }, a.value))
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
              value: String(c.direction ?? "desc"),
              onChange: (a) => v({ direction: a.target.value }),
              children: [
                /* @__PURE__ */ i("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ i("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ u("label", { children: [
          "Videos per page",
          /* @__PURE__ */ i(
            "input",
            {
              type: "number",
              min: "1",
              max: "1000",
              value: Number(c.perPage) || 40,
              onChange: (a) => v({
                perPage: Math.max(
                  1,
                  Math.min(1e3, Number(a.target.value) || 40)
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
              onChange: (a) => t({
                ...e,
                view: {
                  ...e.view,
                  startFrom: a.target.value
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
      /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          className: "dq-button",
          onClick: () => d(!0),
          children: "Edit video filters"
        }
      ),
      /* @__PURE__ */ u("p", { children: [
        Object.keys(e.view.objectFilter).length ? "Video filters configured" : "No video filters",
        ". Choose which videos enter the queue."
      ] }),
      l && /* @__PURE__ */ i("div", { onKeyDown: (a) => a.stopPropagation(), children: /* @__PURE__ */ i(
        nn,
        {
          open: !0,
          onClose: () => d(!1),
          criteria: At,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: !0,
          subjectLabel: "videos",
          onApply: (a) => {
            t({ ...e, view: { ...e.view, objectFilter: a } }), d(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ u(Re, { children: [
      /* @__PURE__ */ i("h3", { children: "Appearance" }),
      /* @__PURE__ */ i("p", { className: "dq-editor-note", children: "Choose how videos and tags appear while reviewing." }),
      /* @__PURE__ */ i("div", { className: "dq-field-grid", children: /* @__PURE__ */ u("label", { children: [
        "Preferred view",
        /* @__PURE__ */ i(
          "select",
          {
            value: e.view.displayMode === "wall" ? "wall" : "grid",
            onChange: (a) => t({
              ...e,
              view: {
                ...e.view,
                displayMode: a.target.value
              }
            }),
            children: ["grid", "wall"].map((a) => /* @__PURE__ */ i("option", { children: a }, a))
          }
        )
      ] }) }),
      /* @__PURE__ */ i("h4", { children: "Card annotations" }),
      /* @__PURE__ */ i("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((a) => {
        const h = E.annotations ?? [];
        return /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ i(
            "input",
            {
              type: "checkbox",
              checked: h.includes(a),
              onChange: (C) => g({
                annotations: C.target.checked ? [...h, a] : h.filter((A) => A !== a)
              })
            }
          ),
          a
        ] }, a);
      }) }),
      (E.annotations ?? []).includes("tags") && /* @__PURE__ */ u(Re, { children: [
        /* @__PURE__ */ i("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
        /* @__PURE__ */ i(
          Rt,
          {
            entityType: "tag",
            values: E.annotationParents ?? [],
            placeholder: "Search annotation parent tags...",
            onChange: (a) => g({ annotationParents: a }),
            allowCreate: !1
          }
        )
      ] }),
      /* @__PURE__ */ i("h4", { children: "Tag bins" }),
      /* @__PURE__ */ i("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
      /* @__PURE__ */ i(
        Rt,
        {
          entityType: "tag",
          values: E.binParents ?? [],
          placeholder: "Search tag-bin parent tags...",
          onChange: (a) => g({ binParents: a }),
          allowCreate: !1
        }
      )
    ] })
  ] });
}
const Bn = {
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
function _t(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Jn(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function Vn(e) {
  return [
    ...new Set(
      _t(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function zn(e, t) {
  const r = _t(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((o) => {
      const l = String(o.key ?? ""), d = Bn[String(o.modifier ?? "EQUALS")], c = (h, C) => String(C ?? "").trim() || t[String(h)] || String(h ?? ""), v = c(
        o.value,
        o.displayValue
      ), E = c(
        o.value2,
        o.displayValue2
      ), g = String(o.modifier ?? "EQUALS"), a = g === "IS_NULL" || g === "NOT_NULL" ? [] : g === "BETWEEN" || g === "NOT_BETWEEN" ? [v, "and", E] : [v];
      return {
        ...o,
        label: [Jn(l), d, ...a].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function Qn(e) {
  const t = _t(e.customFieldCriteria);
  return t.length ? {
    ...e,
    customFieldCriteria: t.map(
      ({ label: r, ...o }) => o
    )
  } : e;
}
function Wn(e, t, r) {
  return r || "customFieldCriteria" in t || !Array.isArray(e.customFieldCriteria) ? t : { ...t, customFieldCriteria: e.customFieldCriteria };
}
const Et = 180, Hn = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function hr(e) {
  return e.view.displayMode === "wall" ? "wall" : "grid";
}
function mr(e) {
  return e === "wall" ? "wall" : "grid";
}
function Gn() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function br(e) {
  const t = new URLSearchParams(window.location.search);
  e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function Xn(e) {
  return ge({ ...e, page: 1 });
}
function Pt(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((c, v) => Pt(c, t[v]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, o = t, l = Object.keys(r).sort(), d = Object.keys(o).sort();
  return l.length === d.length && l.every(
    (c, v) => c === d[v] && Pt(r[c], o[c])
  );
}
function Lr(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function te(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
const Mr = "data-quality.workspace-layout.v1", Ut = 240, Lt = 192, Mt = 560;
function xr(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(Mt, Math.max(Lt, e)) : Ut;
}
function Yn() {
  try {
    const e = JSON.parse(
      localStorage.getItem(Mr) ?? "null"
    );
    return xr(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return Ut;
  }
}
function Zn(e) {
  try {
    localStorage.setItem(
      Mr,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function ei({
  onNavigate: e
}) {
  const [t, r] = S([]), [o] = S(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [l, d] = S(""), [c, v] = S(!0), [E, g] = S(""), [a, h] = S(!1), [C, A] = S(!0), [y, q] = S(""), [T, L] = S(""), [f, N] = S(!1), [R, M] = S(!1), [b, _] = S(Gn), [K, J] = S({}), [le, pe] = S("name"), [re, Dr] = S("asc"), jt = D(null), st = D(!1), [Kt, at] = S(!1), [Bt, Jt] = S(!1), [X, qe] = S(
    null
  ), F = t.find((n) => n.id === b) ?? null, m = ke(
    () => (X == null ? void 0 : X.id) === b && F ? { ...F, view: X.view } : F,
    [X, b, F]
  ), Fr = ke(() => {
    const n = re === "asc" ? 1 : -1;
    return [...t].sort((s, p) => {
      if (le === "count") {
        const w = K[s.id], I = K[p.id], O = typeof w == "number", P = typeof I == "number";
        if (O !== P) return O ? -1 : 1;
        if (O && P && w !== I)
          return (w - I) * n;
      }
      return s.name.localeCompare(p.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * n;
    });
  }, [re, le, K, t]), De = D(
    null
  ), Fe = _n(m), [V, $e] = S({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [$r, _r] = S({
    page: 1,
    perPage: 40
  }), [Y, _e] = S({ items: [], totalCount: 0 }), [k, Ue] = S(!1), [oe, Vt] = S(""), [Ur, jr] = S(!1), [ce, de] = S(() => /* @__PURE__ */ new Set()), je = D(ce);
  je.current = ce;
  const he = D(/* @__PURE__ */ new Map()), [Z, ee] = S(null), ne = D(Z);
  ne.current = Z;
  const [se, Se] = S(!1), ae = D(se);
  ae.current = se;
  const zt = D(null), [Ke, lt] = S("grid"), [Be, Qt] = S(Et), [Ee, Kr] = S(Yn), [x, ct] = S(!1), Je = D(!1), [Br, dt] = S(""), [Ve, me] = S(""), [ut, Ie] = S(""), [U, Wt] = S(null), [Ht, ze] = S(""), [Qe, We] = S(!1), [Gt, Xt] = S({}), ft = D(/* @__PURE__ */ new Map()), Yt = D(null), He = D(null), Ne = D(0), Ge = D(0), Xe = D(null), be = D(!1);
  function pt(n) {
    const s = xr(n);
    Kr(s), Zn(s);
  }
  function Jr(n) {
    const s = n.shiftKey ? 40 : 16;
    let p = null;
    n.key === "ArrowLeft" && (p = Ee + s), n.key === "ArrowRight" && (p = Ee - s), n.key === "Home" && (p = Lt), n.key === "End" && (p = Mt), p !== null && (n.preventDefault(), n.stopPropagation(), pt(p));
  }
  G(() => {
    if (!Ve) return;
    const n = window.setTimeout(() => me(""), 4e3);
    return () => window.clearTimeout(n);
  }, [Ve]), G(() => {
    const n = m ? Vn(m.view.objectFilter) : [];
    if (Xt({}), !n.length) return;
    const s = new AbortController();
    let p = !0;
    return Promise.all(
      n.map(async (w) => {
        var I;
        try {
          const O = await B(`/api/tags/${w}`, {
            signal: s.signal
          });
          return (I = O.name) != null && I.trim() ? [String(w), O.name] : null;
        } catch {
          return null;
        }
      })
    ).then((w) => {
      p && Xt(
        Object.fromEntries(w.filter((I) => I !== null))
      );
    }), () => {
      p = !1, s.abort();
    };
  }, [m == null ? void 0 : m.id, m == null ? void 0 : m.view.objectFilter]);
  const gt = ke(
    () => m ? zn(
      m.view.objectFilter,
      Gt
    ) : {},
    [Gt, m]
  ), Vr = ke(
    () => Array.isArray(gt.customFieldCriteria) ? [...At, Hn] : At,
    [gt.customFieldCriteria]
  ), Zt = ve(async () => {
    v(!0), g("");
    try {
      const n = await Nn();
      r(n.reviews), d(n.storageKey), h(n.canWrite), A(n.canConfigure ?? !0), q(n.storageNotice ?? ""), b && !n.reviews.some((s) => s.id === b) && (_(""), br(""));
    } catch (n) {
      g(
        n instanceof Error ? n.message : "Could not load reviews."
      );
    } finally {
      v(!1);
    }
  }, [b]);
  G(() => {
    Zt();
  }, []), G(() => {
    if (b || t.length === 0) return;
    const n = new AbortController();
    J({});
    for (const s of t)
      St(
        s,
        ge({ ...s.view.filter, page: 1, perPage: 1 }),
        n.signal
      ).then((p) => {
        n.signal.aborted || J((w) => ({
          ...w,
          [s.id]: p.totalCount
        }));
      }).catch(() => {
        n.signal.aborted || J((p) => ({ ...p, [s.id]: null }));
      });
    return () => n.abort();
  }, [b, t]), vr(() => {
    var n;
    b || c || !st.current || (st.current = !1, (n = jt.current) == null || n.focus());
  }, [b, c]);
  const Ye = ve(async () => {
    ze("");
    try {
      Wt(await $t());
    } catch (n) {
      Wt(null), ze(
        "Tag assessment setup could not be checked. " + (n instanceof Error ? n.message : "Request failed.")
      );
    }
  }, []);
  G(() => {
    Ye();
  }, [Ye]);
  const ye = ve(
    async (n, s, p = !1) => {
      var P;
      const w = ++Ne.current;
      (P = Xe.current) == null || P.abort();
      const I = new AbortController();
      Xe.current = I, s = ge(s);
      const O = Number(s.page);
      p && (s = { ...s, page: 1 }), $e(s), jr(p), Ue(!0), Vt("");
      try {
        let z = await St(
          n,
          s,
          I.signal
        );
        const ue = Math.max(
          1,
          Math.ceil(z.totalCount / Number(s.perPage))
        ), ie = p ? ue : Math.min(O, ue);
        return Number(s.page) !== ie && (s = { ...s, page: ie }, z = await St(
          n,
          s,
          I.signal
        )), w === Ne.current && (_e(z), $e(s), _r(s)), z;
      } catch (z) {
        throw w === Ne.current && Vt(
          z instanceof Error ? z.message : "Could not load the review queue."
        ), z;
      } finally {
        w === Ne.current && Ue(!1);
      }
    },
    []
  );
  G(() => {
    var s;
    if (Ge.current += 1, Ne.current += 1, (s = Xe.current) == null || s.abort(), M(!1), L(""), N(!1), de(/* @__PURE__ */ new Set()), he.current.clear(), ee(null), Se(!1), ct(!1), Je.current = !1, dt(""), me(""), Ie(""), _e({ items: [], totalCount: 0 }), !m) {
      Ue(!1);
      return;
    }
    let n = !0;
    return Ue(!0), (async () => {
      let p = null;
      try {
        p = await Rn(l, m.id);
      } catch (O) {
        n && (N(!0), L(
          O instanceof Error ? O.message : "Could not load progress."
        ));
      }
      if (!n) return;
      const w = (p == null ? void 0 : p.signature) === Ce(m) ? p : null, I = w ? ge(w.filter) : Xn(m.view.filter);
      $e(I), lt(
        w ? mr(w.displayMode) : hr(m)
      ), Qt(
        w ? w.cardSize ?? Et : Et
      );
      try {
        const O = await ye(
          m,
          I,
          !w && m.view.startFrom !== "beginning"
        );
        if (!n) return;
        const P = cr(
          O.items.map((z) => z.id),
          (w == null ? void 0 : w.focusedId) ?? null,
          (w == null ? void 0 : w.index) ?? 0
        );
        ee(P), W(P);
      } catch {
      }
      n && M(!0);
    })(), () => {
      var p;
      n = !1, Ge.current++, Ne.current++, (p = Xe.current) == null || p.abort();
    };
  }, [m == null ? void 0 : m.id]);
  const $ = ke(
    () => Y.items.map((n) => n.id),
    [Y.items]
  );
  G(() => {
    if (!R || !m || !l || k || oe || x || (X == null ? void 0 : X.id) === m.id || f)
      return;
    const n = {
      version: 1,
      signature: Ce(m),
      filter: V,
      focusedId: Z,
      index: Math.max(0, $.indexOf(Z ?? -1)),
      displayMode: Ke,
      cardSize: Be,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        l + ":progress:" + m.id,
        JSON.stringify(n)
      );
    } catch {
    }
    if (T) return;
    let s = !0;
    const p = window.setTimeout(() => {
      qn(l, m.id, n).catch((w) => {
        s && L(
          "Progress is kept in this browser, but account sync failed. " + (w instanceof Error ? w.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      s = !1, window.clearTimeout(p);
    };
  }, [
    R,
    l,
    m,
    k,
    oe,
    x,
    V,
    Z,
    $,
    Ke,
    Be,
    X,
    T,
    f
  ]);
  const ht = Y.items.find((n) => n.id === Z) ?? null;
  se && ht && (zt.current = ht);
  const we = ht ?? (se ? zt.current : null), zr = dr(ce, Z), er = ce.size > 0 ? `${ce.size} selected video${ce.size === 1 ? "" : "s"}` : Z == null ? "no video" : "focused video", W = ve((n, s = !0) => {
    n != null && window.requestAnimationFrame(() => {
      const p = ft.current.get(n);
      p == null || p.focus({ preventScroll: !0 }), s && (p == null || p.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  G(() => {
    R && !ae.current && W(ne.current);
  }, [R, W]), G(() => {
    k || !$.length || (ne.current == null || !$.includes(ne.current)) && (ee($[0]), ae.current || W($[0]));
  }, [W, $, k]);
  const Te = ve(
    (n) => {
      de((s) => {
        const p = n(s);
        for (const w of /* @__PURE__ */ new Set([...s, ...p]))
          s.has(w) !== p.has(w) && he.current.set(
            w,
            (he.current.get(w) ?? 0) + 1
          );
        return p;
      });
    },
    []
  ), mt = ve(
    (n) => {
      if (!$.length) return;
      const s = Math.max(
        0,
        $.indexOf(ne.current ?? $[0])
      ), p = $[Math.max(0, Math.min($.length - 1, s + n))];
      ee(p), ae.current || W(p);
    },
    [W, $]
  ), bt = ve(
    async (n) => {
      const s = dr(
        je.current,
        ne.current
      );
      if (!m || Je.current || k || oe || !a || rt(n) && (U == null ? void 0 : U.kind) !== "ready" || !s.length)
        return;
      const p = ++Ge.current, w = m.id, I = [...$], O = Y, P = ne.current, z = new Set(je.current), ue = new Map(
        s.map((j) => [j, he.current.get(j) ?? 0])
      ), ie = () => p === Ge.current && m.id === w;
      Je.current = !0, ct(!0), dt(
        je.current.size ? `${s.length} selected videos` : "the focused video"
      ), me(""), Ie("");
      const nr = O.items.filter(
        (j) => !s.includes(j.id)
      ), tn = nr.map((j) => j.id), ir = ur(
        I,
        tn,
        P,
        s.includes(P ?? -1)
      );
      _e({
        items: nr,
        totalCount: O.totalCount
      }), de((j) => {
        const Q = new Set(j);
        for (const H of s) Q.delete(H);
        return Q;
      }), ee(ir), ae.current || W(ir);
      let yt = !1;
      try {
        if (await $n(n, s), yt = !0, !ie()) return;
        de((j) => {
          const Q = new Set(j);
          for (const H of s)
            (he.current.get(H) ?? 0) === ue.get(H) && Q.delete(H);
          return Q;
        }), me(
          `${n.label}: ${s.length} video${s.length === 1 ? "" : "s"} ${n.steps.length ? "updated" : "skipped"}.`
        );
      } catch (j) {
        if (!ie()) return;
        _e(O), de((Q) => {
          const H = new Set(Q);
          for (const fe of s)
            z.has(fe) && (he.current.get(fe) ?? 0) === ue.get(fe) && H.add(fe);
          return H;
        }), ee(P), ae.current || W(P), Ie(
          j instanceof Error ? j.message : "Action failed."
        );
      }
      try {
        if (await Pn(n), !ie()) return;
        const j = await ye(m, V);
        if (!ie()) return;
        let Q = j.items.map((H) => H.id);
        if (!Q.length && j.totalCount > 0 && Number(V.page) > 1) {
          const H = Math.max(1, Number(V.page) - 1), fe = { ...V, page: H };
          $e(fe), Q = (await ye(m, fe)).items.map((wt) => wt.id), de(
            (wt) => new Set([...wt].filter((rn) => Q.includes(rn)))
          );
          const sr = Q.at(-1) ?? null;
          ee(sr), ae.current || W(sr);
        } else {
          de(
            (fe) => new Set([...fe].filter((or) => Q.includes(or)))
          );
          const H = ur(
            I,
            Q,
            P,
            yt && s.includes(P ?? -1)
          );
          ee(H), ae.current && H == null && Se(!1), ae.current || W(H);
        }
      } catch (j) {
        ie() && Ie(
          (Q) => `${Q ? `${Q} ` : ""}${yt ? "The action completed, but " : ""}the queue could not be refreshed. ${j instanceof Error ? j.message : "Refresh failed."}`
        );
      } finally {
        ie() && (Je.current = !1, ct(!1), dt(""));
      }
    },
    [
      a,
      U,
      ye,
      V,
      W,
      $,
      Y,
      k,
      oe,
      m
    ]
  );
  function Qr() {
    var p;
    const n = (p = Yt.current) == null ? void 0 : p.firstElementChild, s = n ? getComputedStyle(n).gridTemplateColumns : "";
    return Math.max(1, s.split(" ").filter(Boolean).length);
  }
  function Wr(n) {
    if (n.defaultPrevented || n.repeat || n.ctrlKey || n.altKey || n.metaKey || Kt) return;
    if (se && n.key === "Escape") {
      te(n), Se(!1), W(ne.current);
      return;
    }
    if (!wn(n.target)) return;
    if (n.key === "Escape") {
      te(n), Te(() => /* @__PURE__ */ new Set());
      return;
    }
    const s = (m == null ? void 0 : m.actions.findIndex(
      (I, O) => Pe(I, O) === n.key
    )) ?? -1;
    if (s >= 0 && (m != null && m.actions[s])) {
      te(n), !x && !k && bt(m.actions[s]);
      return;
    }
    if (!se && n.key === " ") {
      te(n), Z != null && Te((I) => Nt(I, Z));
      return;
    }
    if (!se && n.key.toLowerCase() === "a") {
      te(n), Te(
        (I) => yn(I, $)
      );
      return;
    }
    if (x || k || se) return;
    if (n.key === "Enter" && Z != null) {
      te(n), Se(!0);
      return;
    }
    const p = Qr(), w = n.key === "ArrowLeft" ? -1 : n.key === "ArrowRight" ? 1 : n.key === "ArrowUp" ? -p : n.key === "ArrowDown" ? p : 0;
    w && (te(n), mt(w));
  }
  function Ze(n) {
    _(n), br(n);
  }
  function Hr() {
    st.current = !0, J({}), Ze("");
  }
  async function tr(n) {
    if (!l) return !1;
    const s = n.map(ri);
    try {
      await An(l, s);
    } catch (w) {
      throw w;
    }
    r(s), b && !s.some((w) => w.id === b) && Ze("");
    const p = s.find((w) => w.id === b);
    return p && F && JSON.stringify(p) !== JSON.stringify(F) && (p.view.displayMode !== F.view.displayMode && lt(hr(p)), Ce(p) !== Ce(F) && (qe(null), et(
      p,
      ge({ ...p.view.filter, page: V.page })
    ))), !0;
  }
  if (c)
    return /* @__PURE__ */ i(yr, { label: "Loading reviews…" });
  if (E)
    return /* @__PURE__ */ u(Re, { children: [
      /* @__PURE__ */ i(
        "button",
        {
          className: "dq-button",
          onClick: () => void ci().catch(
            (n) => g(
              "Could not export browser reviews. " + (n instanceof Error ? n.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ i(
        wr,
        {
          message: E,
          onRetry: () => void Zt()
        }
      )
    ] });
  return /* @__PURE__ */ u("div", { className: "data-quality-page", onKeyDown: Wr, children: [
    /* @__PURE__ */ u("header", { className: "data-quality-header", children: [
      m && /* @__PURE__ */ i(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: x,
          onClick: Hr,
          children: /* @__PURE__ */ i(Sr, {})
        }
      ),
      /* @__PURE__ */ u("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ i("h1", { children: (m == null ? void 0 : m.name) ?? "Data Quality" }),
        (m == null ? void 0 : m.description) && /* @__PURE__ */ i("p", { className: "dq-review-description", children: m.description })
      ] }),
      m && F && /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: x || k || !C,
          onClick: () => {
            Jt(!0), at(!0);
          },
          children: /* @__PURE__ */ i(Er, {})
        }
      ),
      /* @__PURE__ */ i(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: x || k || !C,
          onClick: () => {
            Jt(!1), at(!0);
          },
          children: /* @__PURE__ */ i(dn, {})
        }
      )
    ] }),
    y && /* @__PURE__ */ i("p", { className: "dq-status", children: y }),
    (U == null ? void 0 : U.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      U.message,
      " ",
      /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          disabled: Qe,
          onClick: () => {
            We(!0), ze(""), Mn().then(Ye).catch(
              (n) => ze(
                "Could not create the Confirmed absent tags custom field. " + (n instanceof Error ? n.message : "Request failed.")
              )
            ).finally(() => We(!1));
          },
          children: Qe ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    ((U == null ? void 0 : U.kind) === "incompatible" || Ht) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ i(qt, {}),
      Ht || (U == null ? void 0 : U.message),
      /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          disabled: Qe,
          onClick: () => {
            We(!0), Ye().finally(
              () => We(!1)
            );
          },
          children: Qe ? "Checking…" : "Check again"
        }
      )
    ] }),
    o && /* @__PURE__ */ u("details", { children: [
      /* @__PURE__ */ i("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ i("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ i(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const n = localStorage.getItem("page-videos") ?? "[]", s = URL.createObjectURL(
              new Blob([n], { type: "application/json" })
            ), p = document.createElement("a");
            p.href = s, p.download = "data-quality-unassigned-legacy-reviews.json", p.click(), URL.revokeObjectURL(s);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    T && /* @__PURE__ */ u("p", { role: "alert", children: [
      T,
      " ",
      /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          onClick: () => {
            L(""), N(!1);
          },
          children: f ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    m && F && /* @__PURE__ */ u("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ i(
        "div",
        {
          className: `dq-native-toolbar-host${x || k ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": x || k || void 0,
          inert: x || k ? !0 : void 0,
          onClickCapture: (n) => {
            var p, w, I, O, P;
            const s = n.target instanceof Element ? n.target.closest("button") : null;
            (s == null ? void 0 : s.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((p = s == null ? void 0 : s.textContent) == null ? void 0 : p.trim()) === "Clear all" ? be.current = !0 : ((w = s == null ? void 0 : s.getAttribute("aria-label")) != null && w.startsWith("Filters") || (I = s == null ? void 0 : s.getAttribute("aria-label")) != null && I.startsWith("Edit filter:") || ((O = s == null ? void 0 : s.textContent) == null ? void 0 : O.trim()) === "Cancel" || (P = s == null ? void 0 : s.getAttribute("aria-label")) != null && P.startsWith("Close ")) && (be.current = !1);
          },
          onKeyDownCapture: (n) => {
            var p, w;
            const s = n.target instanceof Element ? n.target.closest("button") : null;
            (n.key === "Delete" || n.key === "Backspace") && (s == null ? void 0 : s.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (n.preventDefault(), n.stopPropagation(), be.current = !0, (w = (p = s.parentElement) == null ? void 0 : p.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || w.click()) : n.key === "Escape" && (be.current = !1);
          },
          children: /* @__PURE__ */ i(
            on,
            {
              filter: oe ? $r : V,
              onFilterChange: Gr,
              totalCount: Y.totalCount,
              sortOptions: Ct,
              showSearch: !0,
              showSort: !0,
              displayMode: Ke,
              onDisplayModeChange: (n) => lt(mr(n)),
              availableDisplayModes: ["grid", "wall"],
              zoomLevel: (Be - 225) / 50,
              onZoomChange: (n) => Qt(Math.round(225 + n * 50)),
              cardSizeEntityType: "videos",
              criteriaDefinitions: Vr,
              objectFilter: gt,
              onObjectFilterChange: (n) => {
                if (!x && !k) {
                  const s = Qn(n);
                  De.current = Wn(
                    m.view.objectFilter,
                    s,
                    be.current
                  ), be.current = !1;
                }
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (X == null ? void 0 : X.id) === b && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: x || k || !C,
            onClick: Yr,
            children: /* @__PURE__ */ i(un, {})
          }
        ),
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Reset to default review filters",
            title: "Reset to default review filters",
            disabled: x || k,
            onClick: Xr,
            children: /* @__PURE__ */ i(fn, {})
          }
        )
      ] })
    ] }),
    m ? /* @__PURE__ */ u(Re, { children: [
      Fe.error && /* @__PURE__ */ i("p", { role: "alert", children: Fe.error }),
      /* @__PURE__ */ i(
        jn,
        {
          videos: Y.items,
          review: m,
          trees: Fe.ids,
          disabled: x || k,
          onChoose: (n) => {
            const s = Kn(m, n);
            qe(s), et(s, { ...V, page: 1 });
          }
        }
      ),
      ut && !se && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ i(qt, {}),
        ut
      ] }),
      Ve && /* @__PURE__ */ i("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: Ve }),
      rr("top"),
      /* @__PURE__ */ u(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${Ee}px`
          },
          children: [
            /* @__PURE__ */ u("main", { children: [
              k && !Y.items.length && /* @__PURE__ */ i(yr, { label: "Loading review queue…" }),
              oe && !k && /* @__PURE__ */ i(
                wr,
                {
                  message: oe,
                  onRetry: () => void ye(
                    m,
                    V,
                    Ur
                  ).catch(() => {
                  })
                }
              ),
              !x && !k && !oe && !Y.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                /* @__PURE__ */ i(lr, {}),
                /* @__PURE__ */ i("p", { children: "No videos match this review." })
              ] }),
              !!Y.items.length && /* @__PURE__ */ i("div", { ref: Yt, children: /* @__PURE__ */ i(
                "div",
                {
                  className: "dq-grid",
                  style: {
                    "--dq-card-width": `${Be}px`
                  },
                  children: Y.items.map(en)
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
                "aria-valuemin": Lt,
                "aria-valuemax": Mt,
                "aria-valuenow": Ee,
                "aria-valuetext": `${Ee} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (n) => {
                  He.current = {
                    pointerId: n.pointerId,
                    startX: n.clientX,
                    startWidth: Ee
                  }, n.currentTarget.setPointerCapture(n.pointerId);
                },
                onPointerMove: (n) => {
                  const s = He.current;
                  (s == null ? void 0 : s.pointerId) === n.pointerId && n.currentTarget.hasPointerCapture(n.pointerId) && pt(
                    s.startWidth + s.startX - n.clientX
                  );
                },
                onPointerUp: () => {
                  He.current = null;
                },
                onPointerCancel: () => {
                  He.current = null;
                },
                onKeyDown: Jr,
                onDoubleClick: () => pt(Ut),
                children: /* @__PURE__ */ i("span", {})
              }
            ),
            /* @__PURE__ */ u("aside", { className: "dq-actions", children: [
              ce.size > 0 && /* @__PURE__ */ i("strong", { children: er }),
              m.actions.map((n, s) => /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  disabled: x || k || !!oe || !a || rt(n) && (U == null ? void 0 : U.kind) !== "ready" || !zr.length,
                  onClick: () => void bt(n),
                  children: [
                    Pe(n, s) && /* @__PURE__ */ i("kbd", { children: Pe(n, s) }),
                    /* @__PURE__ */ i("span", { children: n.label }),
                    /* @__PURE__ */ i("small", { children: n.steps.length ? `${n.steps.length} step(s)` : "Skip" })
                  ]
                },
                n.id
              )),
              !m.actions.length && /* @__PURE__ */ i("p", { children: "This review has no actions." }),
              !a && /* @__PURE__ */ i("p", { children: "Video write permission is required to apply actions." }),
              x && /* @__PURE__ */ u("p", { role: "status", children: [
                /* @__PURE__ */ i(Cr, { className: "dq-spin" }),
                " Applying action to",
                " ",
                Br,
                "…"
              ] }),
              /* @__PURE__ */ i("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
            ] })
          ]
        }
      ),
      rr("bottom")
    ] }) : t.length ? /* @__PURE__ */ u(
      "section",
      {
        className: "dq-review-browser",
        "aria-labelledby": "dq-reviews-title",
        children: [
          /* @__PURE__ */ u("div", { className: "dq-review-browser-heading", children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ i(
                "h2",
                {
                  id: "dq-reviews-title",
                  ref: jt,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ i("p", { children: "Choose a review to open its video queue." }),
              /* @__PURE__ */ i("span", { className: "dq-sr-only", role: "status", children: t.every(
                (n) => K[n.id] !== void 0
              ) ? t.some((n) => K[n.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ i("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: le,
                    onChange: (n) => pe(
                      n.target.value
                    ),
                    children: [
                      /* @__PURE__ */ i("option", { value: "name", children: "Name" }),
                      /* @__PURE__ */ i("option", { value: "count", children: "Video count" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ i(
                "button",
                {
                  type: "button",
                  "aria-label": re === "asc" ? "Ascending" : "Descending",
                  title: re === "asc" ? "Ascending" : "Descending",
                  onClick: () => Dr(
                    (n) => n === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ i(
                    Nr,
                    {
                      className: re === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ i("div", { className: "dq-review-browser-list", children: Fr.map((n) => {
            const s = K[n.id];
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                disabled: x,
                onClick: () => Ze(n.id),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ i("strong", { children: n.name }),
                    /* @__PURE__ */ i(
                      "span",
                      {
                        className: "dq-review-count",
                        "aria-label": s === void 0 ? "Counting matching videos" : s === null ? "Matching video count unavailable" : `${s.toLocaleString()} matching ${s === 1 ? "video" : "videos"}`,
                        children: s === void 0 ? "…" : s === null ? "—" : s.toLocaleString()
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
    ) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ i(lr, {}),
      /* @__PURE__ */ i("p", { children: "No saved reviews are available in this browser." })
    ] }),
    se && we && m && /* @__PURE__ */ i(
      oi,
      {
        video: we,
        review: m,
        targetLabel: er,
        pending: x,
        refreshing: k || !!oe,
        error: ut,
        canWrite: a,
        assessmentReady: (U == null ? void 0 : U.kind) === "ready",
        selected: ce.has(we.id),
        hasPrevious: $.indexOf(we.id) > 0,
        hasNext: $.indexOf(we.id) >= 0 && $.indexOf(we.id) < $.length - 1,
        onToggleSelected: () => Te((n) => Nt(n, we.id)),
        onPrevious: () => mt(-1),
        onNext: () => mt(1),
        onClose: () => {
          Se(!1), W(ne.current);
        },
        onAction: bt
      }
    ),
    Kt && /* @__PURE__ */ i(
      si,
      {
        reviews: t,
        activeReview: F,
        initialEdit: Bt,
        onSave: tr,
        onChoose: Ze,
        onClose: () => {
          at(!1), Bt && W(ne.current, !1);
        }
      }
    )
  ] });
  async function et(n, s, p = !1) {
    const w = ne.current, I = Math.max(0, $.indexOf(w ?? -1));
    try {
      const P = (await ye(n, s, p)).items.map((ue) => ue.id);
      de(
        (ue) => new Set([...ue].filter((ie) => P.includes(ie)))
      );
      const z = cr(P, w, I);
      ee(z), ae.current || W(z, !1);
    } catch {
    }
  }
  function Gr(n) {
    const s = De.current;
    if (De.current = null, x || k || !m || !F) return;
    const p = s ?? m.view.objectFilter, w = Pt(
      p,
      F.view.objectFilter
    ) ? F.view.objectFilter : p, I = ge({ ...n, page: 1 }), O = {
      ...m,
      view: {
        ...m.view,
        filter: I,
        objectFilter: w
      }
    }, P = Ce(O) !== Ce(F), z = P ? O : F;
    qe(P ? O : null), me(P ? "" : "Review queue defaults restored."), et(z, I, !0);
  }
  function Xr() {
    if (x || k || !F) return;
    De.current = null;
    const n = ge({
      ...F.view.filter,
      page: 1
    });
    qe(null), me("Review queue defaults restored."), et(
      F,
      n,
      F.view.startFrom !== "beginning"
    );
  }
  function Yr() {
    x || k || !m || !F || !C || tr(
      t.map(
        (n) => n.id === b ? {
          ...n,
          view: {
            ...m.view,
            filter: { ...V, page: 1 }
          }
        } : n
      )
    ).then(() => {
      qe(null), me("Queue saved to this review.");
    }).catch(
      (n) => Ie(
        n instanceof Error ? n.message : "Could not save queue."
      )
    );
  }
  function Zr() {
    de(/* @__PURE__ */ new Set()), he.current.clear(), ee(null);
  }
  function rr(n) {
    return m ? /* @__PURE__ */ i(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: x || k,
        "aria-label": `Review queue pagination ${n}`,
        children: /* @__PURE__ */ i(
          sn,
          {
            filter: {
              ...V,
              page: Number(V.page) || 1,
              perPage: Number(V.perPage) || 40
            },
            totalCount: Y.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${n}`,
            onFilterChange: (s) => {
              x || k || s.page === Number(V.page) || ti(
                { ...V, page: s.page },
                m,
                ye,
                Zr
              );
            }
          }
        )
      }
    ) : null;
  }
  function en(n) {
    return /* @__PURE__ */ i(
      ni,
      {
        video: Un(n, m, Fe.ids),
        displayMode: Ke,
        focused: n.id === Z,
        selected: ce.has(n.id),
        setRef: (s) => {
          s ? ft.current.set(n.id, s) : ft.current.delete(n.id);
        },
        onFocus: () => ee(n.id),
        onToggle: () => Te((s) => Nt(s, n.id)),
        onPreview: () => {
          ee(n.id), Se(!0);
        },
        onNavigate: e
      },
      n.id
    );
  }
}
function ti(e, t, r, o) {
  o(), r(t, e).catch(() => {
  });
}
function Nt(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function ri(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function ni({
  video: e,
  displayMode: t,
  focused: r,
  selected: o,
  setRef: l,
  onFocus: d,
  onToggle: c,
  onPreview: v,
  onNavigate: E
}) {
  const g = Lr(e), a = D(null), h = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, C = !!(h.date || h.studioName), A = !!(h.performers.length || h.tags.length);
  return vr(() => {
    const y = a.current;
    if (!y) return;
    const q = y.querySelector(
      `a[href="/video/${e.id}"]`
    ), T = y.querySelector(".card-title"), L = `dq-card-title-${e.id}`;
    T && (T.id = L), q && (q.target = "_blank", q.rel = "noreferrer", q.removeAttribute("aria-label"), q.setAttribute("aria-labelledby", L), q.classList.add("dq-card-link"));
    const f = y.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    f && f.setAttribute(
      "aria-label",
      o ? `Deselect ${g}` : `Select ${g}`
    );
    const N = y.querySelector(
      'button[title="Quick View"]'
    );
    N && N.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (y) => {
        a.current = y, l(y);
      },
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${g}${o ? ", selected" : ""}`,
      onFocus: d,
      onClick: (y) => {
        d(), y.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${t} ${C ? "has-card-metadata" : "no-card-metadata"} ${A ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ i(
          ln,
          {
            video: h,
            selected: o,
            onSelect: c,
            onNavigate: E,
            onQuickView: v,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t === "wall" && /* @__PURE__ */ i(ii, { video: e })
      ]
    }
  );
}
function ii({ video: e }) {
  const t = D(null), r = D(null), [o, l] = S(!1), [d, c] = S(!1), [v, E] = S(!1);
  return G(() => {
    const g = t.current;
    if (!g || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      l(!0), c(!0);
      return;
    }
    const a = new IntersectionObserver(
      ([C]) => l(C.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), h = new IntersectionObserver(
      ([C]) => c(C.isIntersecting && C.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return a.observe(g), h.observe(g), () => {
      a.disconnect(), h.disconnect();
    };
  }, [e.id, e.files.length]), G(() => {
    if (!o) {
      E(!1);
      return;
    }
    const g = new AbortController();
    return B(On(e.id), {
      signal: g.signal
    }).then((a) => {
      g.signal.aborted || E(a.available === !0);
    }).catch(() => {
      g.signal.aborted || E(!1);
    }), () => g.abort();
  }, [o, e.id]), G(() => {
    const g = r.current;
    g && (d ? Promise.resolve(g.play()).catch(() => {
    }) : g.pause());
  }, [v, d]), /* @__PURE__ */ i("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: v && /* @__PURE__ */ i(
    "video",
    {
      ref: r,
      src: kn(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function oi({
  video: e,
  review: t,
  targetLabel: r,
  pending: o,
  refreshing: l,
  error: d,
  canWrite: c,
  assessmentReady: v,
  selected: E,
  hasPrevious: g,
  hasNext: a,
  onToggleSelected: h,
  onPrevious: C,
  onNext: A,
  onClose: y,
  onAction: q
}) {
  const T = D(null), L = D(null), f = e.files[0], N = Lr(e);
  G(() => {
    var _;
    const b = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (_ = T.current) == null || _.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = b;
    };
  }, []);
  function R(b) {
    var J, le, pe;
    if (b.key !== "Tab") return;
    const _ = [
      ...((J = T.current) == null ? void 0 : J.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((re) => re.offsetParent !== null);
    if (!_.length) {
      b.preventDefault(), (le = T.current) == null || le.focus();
      return;
    }
    const K = _.indexOf(
      document.activeElement
    );
    b.shiftKey && K <= 0 ? (b.preventDefault(), (pe = _.at(-1)) == null || pe.focus()) : !b.shiftKey && K === _.length - 1 && (b.preventDefault(), _[0].focus());
  }
  function M(b) {
    if (b.defaultPrevented || b.ctrlKey || b.metaKey || b.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const _ = b.key === "ArrowLeft" || b.key === "ArrowRight";
    if (b.altKey && !_) return;
    const K = L.current, J = b.currentTarget.querySelector("video");
    if (b.key === "Enter" || b.key === "Escape")
      b.repeat || y();
    else if (b.key === " " && K)
      b.repeat || K.toggle();
    else if (_ && K)
      K.seekBy(
        (b.key === "ArrowLeft" ? -1 : 1) * (b.shiftKey ? 5 : b.altKey ? 10 : 60)
      );
    else if ((b.key === "," || b.key === ".") && K) {
      const le = [f == null ? void 0 : f.duration, J == null ? void 0 : J.duration].find(
        (re) => re != null && Number.isFinite(re) && re > 0
      ) ?? 0, pe = e.parentVideoId != null ? (e.clipEndSec ?? le) - (e.clipStartSec ?? 0) : le;
      Number.isFinite(pe) && pe > 0 && K.seekBy((b.key === "," ? -1 : 1) * pe * 0.1);
    } else if (b.key.toLowerCase() === "n" || b.key.toLowerCase() === "m")
      !b.repeat && !o && !l && (b.key.toLowerCase() === "n" && g && C(), b.key.toLowerCase() === "m" && a && A());
    else if (b.key === "ArrowUp" && J)
      J.volume = Math.min(1, J.volume + 0.1);
    else if (b.key === "ArrowDown" && J)
      J.volume = Math.max(0, J.volume - 0.1);
    else return;
    te(b);
  }
  return /* @__PURE__ */ i(
    "div",
    {
      ref: T,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${N}`,
      className: "dq-preview",
      onKeyDown: R,
      onKeyDownCapture: M,
      onMouseDown: (b) => {
        b.target === b.currentTarget && y();
      },
      children: /* @__PURE__ */ u("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ u("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !g || o || l,
              onClick: C,
              children: /* @__PURE__ */ i(Sr, {})
            }
          ),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !a || o || l,
              onClick: A,
              children: /* @__PURE__ */ i(Nr, {})
            }
          ),
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ i("h2", { children: N }),
            /* @__PURE__ */ u("p", { children: [
              "Actions target ",
              r,
              "."
            ] })
          ] }),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              onClick: h,
              disabled: l,
              children: E ? "Selected" : "Select"
            }
          ),
          /* @__PURE__ */ i(
            "a",
            {
              href: `/video/${e.id}`,
              target: "_blank",
              rel: "noreferrer",
              className: "dq-details-link",
              "aria-label": `Open ${N} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ i(pn, {})
            }
          ),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              onClick: y,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ i(Ar, {})
            }
          )
        ] }),
        /* @__PURE__ */ i("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: f ? /* @__PURE__ */ i(
          an,
          {
            autostart: !0,
            streamUrl: Tn(e.id),
            posterUrl: pr(e),
            format: f.format,
            audioCodec: f.audioCodec,
            duration: f.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (b) => (L.current = b, () => {
              L.current === b && (L.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ i("img", { src: pr(e), alt: "" }) }),
        d && /* @__PURE__ */ i("p", { role: "alert", className: "dq-alert", children: d }),
        /* @__PURE__ */ i("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ i("footer", { "data-review-player-controls": !0, children: t.actions.map((b, _) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: o || l || !c || rt(b) && !v,
            onClick: () => void q(b),
            children: [
              Pe(b, _) && /* @__PURE__ */ i("kbd", { children: Pe(b, _) }),
              b.label
            ]
          },
          b.id
        )) })
      ] })
    }
  );
}
function si({
  reviews: e,
  activeReview: t,
  initialEdit: r = !1,
  onSave: o,
  onChoose: l,
  onClose: d
}) {
  const [c, v] = S(
    () => r && t ? structuredClone(t) : null
  ), [E, g] = S(""), [a, h] = S(!1), C = D(null);
  G(() => {
    var R, M;
    const f = document.activeElement, N = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (M = (R = C.current) == null ? void 0 : R.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || M.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = N, f == null || f.focus({ preventScroll: !0 });
    };
  }, []);
  function A(f) {
    var M, b, _;
    if (f.defaultPrevented) {
      f.stopPropagation();
      return;
    }
    if (f.key === "Escape") {
      te(f), a || d();
      return;
    }
    if (f.key !== "Tab") {
      f.stopPropagation();
      return;
    }
    const N = [
      ...((M = C.current) == null ? void 0 : M.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((K) => K.offsetParent !== null);
    if (!N.length) {
      te(f), (b = C.current) == null || b.focus();
      return;
    }
    const R = N.indexOf(
      document.activeElement
    );
    f.shiftKey && R <= 0 ? (te(f), (_ = N.at(-1)) == null || _.focus()) : !f.shiftKey && R === N.length - 1 ? (te(f), N[0].focus()) : f.stopPropagation();
  }
  function y(f) {
    v(
      f ? structuredClone(f) : {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        view: {
          ...structuredClone(
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
          startFrom: "end"
        },
        actions: []
      }
    ), g("");
  }
  async function q() {
    if (a) return;
    if (!c || It(c)) {
      g(c ? It(c) : "Choose a review.");
      return;
    }
    const f = { ...c, name: c.name.trim() }, N = e.some((R) => R.id === f.id) ? e.map((R) => R.id === f.id ? f : R) : [...e, f];
    h(!0), g("");
    try {
      if (!await o(N)) throw new Error("Could not save reviews.");
      l(f.id), d();
    } catch (R) {
      g(
        "Could not save reviews. Your edits are still open. " + (R instanceof Error ? R.message : "Retry saving.")
      );
    } finally {
      h(!1);
    }
  }
  async function T(f) {
    if (!a) {
      h(!0), g("");
      try {
        if (!await o(f)) throw new Error("Could not save reviews.");
      } catch (N) {
        g(
          N instanceof Error ? N.message : "Could not save reviews."
        );
      } finally {
        h(!1);
      }
    }
  }
  async function L(f) {
    var R;
    if (a) return;
    const N = (R = f.target.files) == null ? void 0 : R[0];
    if (f.target.value = "", !!N) {
      if (N.size > 2e6) {
        g("Review files must be smaller than 2 MB.");
        return;
      }
      h(!0), g("");
      try {
        const M = Le(await N.text());
        if (!await o(Tt(e, M)))
          throw new Error("Could not save reviews.");
      } catch (M) {
        g(
          M instanceof Error ? M.message : "Could not import reviews."
        );
      } finally {
        h(!1);
      }
    }
  }
  return /* @__PURE__ */ i(
    "div",
    {
      ref: C,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: A,
      children: /* @__PURE__ */ u("div", { className: "dq-manager", children: [
        /* @__PURE__ */ u("header", { children: [
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ i("h2", { children: c ? e.some((f) => f.id === c.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ i("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: a,
              onClick: d,
              children: /* @__PURE__ */ i(Ar, {})
            }
          )
        ] }),
        E && /* @__PURE__ */ i("p", { role: "alert", className: "dq-alert", children: E }),
        /* @__PURE__ */ i("fieldset", { disabled: a, className: "dq-manager-content", children: c ? /* @__PURE__ */ i(
          ai,
          {
            draft: c,
            saving: a,
            setDraft: v,
            onSave: () => void q(),
            onCancel: d
          }
        ) : /* @__PURE__ */ u(Re, { children: [
          /* @__PURE__ */ u("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ u(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => y(),
                children: [
                  /* @__PURE__ */ i(gn, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ u("label", { className: "dq-button", children: [
              /* @__PURE__ */ i(hn, {}),
              " Import reviews",
              /* @__PURE__ */ i(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: L
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ i("div", { className: "dq-review-list", children: e.map((f) => /* @__PURE__ */ u("article", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ i("strong", { children: f.name }),
              /* @__PURE__ */ i("p", { children: f.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => y(f), children: [
              /* @__PURE__ */ i(Er, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                onClick: () => y({
                  ...structuredClone(f),
                  id: crypto.randomUUID(),
                  name: `${f.name} copy`
                }),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${f.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${f.name}”?`) && T(
                    e.filter((N) => N.id !== f.id)
                  );
                },
                children: /* @__PURE__ */ i(Rr, {})
              }
            )
          ] }, f.id)) })
        ] }) })
      ] })
    }
  );
}
function ai({
  draft: e,
  saving: t = !1,
  setDraft: r,
  onSave: o,
  onCancel: l
}) {
  const [d, c] = S("Review"), v = D(/* @__PURE__ */ new WeakMap()), E = (a) => {
    let h = v.current.get(a);
    return h || (h = crypto.randomUUID(), v.current.set(a, h)), h;
  }, g = (a, h) => r({
    ...e,
    actions: e.actions.map(
      (C, A) => A === a ? h : C
    )
  });
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    /* @__PURE__ */ i("div", { className: "dq-editor-nav", children: /* @__PURE__ */ i(
      cn,
      {
        tabs: ["Review", "Queue", "Appearance", "Actions"].map((a) => ({
          key: a,
          label: a,
          count: a === "Actions" ? e.actions.length : void 0,
          disabled: t
        })),
        activeTab: d,
        onTabChange: c
      }
    ) }),
    /* @__PURE__ */ u("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ u("section", { hidden: d !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ i("h3", { children: "Review details" }),
        /* @__PURE__ */ i("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ u("label", { children: [
          "Review name",
          /* @__PURE__ */ i(
            "input",
            {
              autoFocus: !0,
              "aria-label": "Review name",
              value: e.name,
              onChange: (a) => r({ ...e, name: a.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ u("label", { children: [
          "Description",
          /* @__PURE__ */ i(
            "textarea",
            {
              "aria-label": "Description",
              value: e.description,
              onChange: (a) => r({ ...e, description: a.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ i("section", { hidden: d !== "Queue", className: "dq-editor-section", children: /* @__PURE__ */ i(gr, { draft: e, onChange: r, presentation: !1 }) }),
      /* @__PURE__ */ i("section", { hidden: d !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ i(gr, { draft: e, onChange: r, queue: !1 }) }),
      /* @__PURE__ */ u("section", { hidden: d !== "Actions", className: "dq-editor-section", children: [
        /* @__PURE__ */ i("h3", { children: "Actions" }),
        /* @__PURE__ */ i("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
        /* @__PURE__ */ i("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
        /* @__PURE__ */ i(
          ar,
          {
            items: e.actions,
            getKey: (a) => a.id,
            disabled: t,
            className: "dq-sortable-list",
            onReorder: (a) => r({ ...e, actions: a }),
            renderItem: (a, { index: h, dragHandleProps: C, isOver: A }) => /* @__PURE__ */ u(
              "fieldset",
              {
                className: A ? "dq-action-card dq-drag-over" : "dq-action-card",
                children: [
                  /* @__PURE__ */ u("legend", { children: [
                    "Action ",
                    h + 1
                  ] }),
                  /* @__PURE__ */ u("div", { className: "dq-action-heading", children: [
                    /* @__PURE__ */ i(
                      "button",
                      {
                        type: "button",
                        ...C,
                        disabled: t,
                        className: "dq-drag-handle",
                        "aria-label": `Reorder action ${h + 1}`,
                        children: /* @__PURE__ */ i(qr, {})
                      }
                    ),
                    /* @__PURE__ */ i("strong", { children: a.label || "New action" }),
                    /* @__PURE__ */ i("div", { className: "dq-row", children: /* @__PURE__ */ i(
                      "button",
                      {
                        type: "button",
                        onClick: () => r({
                          ...e,
                          actions: [
                            ...e.actions.slice(0, h + 1),
                            {
                              ...structuredClone(a),
                              id: crypto.randomUUID(),
                              label: a.label + " copy",
                              shortcut: ""
                            },
                            ...e.actions.slice(h + 1)
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
                          value: a.shortcut ?? "auto",
                          onChange: (y) => g(h, {
                            ...a,
                            shortcut: y.target.value === "auto" ? void 0 : y.target.value
                          }),
                          children: [
                            /* @__PURE__ */ u("option", { value: "auto", children: [
                              "Position (",
                              h < 9 ? h + 1 : "none",
                              ")"
                            ] }),
                            /* @__PURE__ */ i("option", { value: "", children: "None" }),
                            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((y) => /* @__PURE__ */ i("option", { value: y, children: y }, y))
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ u("label", { children: [
                      "Button label",
                      /* @__PURE__ */ i(
                        "input",
                        {
                          value: a.label,
                          onChange: (y) => g(h, {
                            ...a,
                            label: y.target.value
                          })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ i(
                    ar,
                    {
                      items: a.steps,
                      getKey: E,
                      disabled: t,
                      className: "dq-sortable-list",
                      onReorder: (y) => g(h, { ...a, steps: y }),
                      renderItem: (y, { index: q, dragHandleProps: T, isOver: L }) => /* @__PURE__ */ i(
                        li,
                        {
                          dragHandleProps: T,
                          saving: t,
                          isOver: L,
                          step: y,
                          index: q,
                          onChange: (f) => {
                            v.current.set(f, E(y)), g(h, {
                              ...a,
                              steps: a.steps.map(
                                (N, R) => R === q ? f : N
                              )
                            });
                          },
                          onRemove: () => g(h, {
                            ...a,
                            steps: a.steps.filter(
                              (f, N) => N !== q
                            )
                          })
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ u("div", { className: "dq-row", children: [
                    /* @__PURE__ */ i(
                      "button",
                      {
                        className: "dq-button",
                        type: "button",
                        onClick: () => g(h, {
                          ...a,
                          steps: [...a.steps, { mode: "ADD", tagIds: [] }]
                        }),
                        children: "Add step"
                      }
                    ),
                    /* @__PURE__ */ i(
                      "button",
                      {
                        className: "dq-button",
                        type: "button",
                        onClick: () => r({
                          ...e,
                          actions: e.actions.filter(
                            (y, q) => q !== h
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
            onClick: () => r({
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
      /* @__PURE__ */ i(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const a = URL.createObjectURL(
              new Blob([JSON.stringify([e], null, 2)], {
                type: "application/json"
              })
            ), h = document.createElement("a");
            h.href = a, h.download = "data-quality-review.json", h.click(), URL.revokeObjectURL(a);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ i("button", { className: "dq-button", type: "button", onClick: l, children: "Cancel" }),
      /* @__PURE__ */ i("button", { className: "dq-button primary", type: "button", onClick: o, children: "Save review" })
    ] })
  ] });
}
function li({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: o,
  isOver: l,
  onChange: d,
  onRemove: c
}) {
  return /* @__PURE__ */ u("div", { className: l ? "dq-action-step dq-drag-over" : "dq-action-step", children: [
    /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        ...r,
        disabled: o,
        className: "dq-drag-handle",
        "aria-label": `Reorder step ${t + 1}`,
        children: /* @__PURE__ */ i(qr, {})
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
        onChange: (v) => d({ ...e, mode: v.target.value }),
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
    /* @__PURE__ */ i(
      Rt,
      {
        entityType: "tag",
        values: e.tagIds,
        onChange: (v) => d({ ...e, tagIds: v }),
        placeholder: "Choose tags",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ i("button", { type: "button", "aria-label": "Remove step", onClick: c, children: /* @__PURE__ */ i(Rr, {}) })
  ] });
}
async function ci() {
  const e = await B("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let o = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const c = JSON.parse(r);
      Array.isArray(c.reviews) && (o = JSON.stringify(c.reviews, null, 2));
    } catch {
    }
  const l = URL.createObjectURL(
    new Blob([o], { type: "application/json" })
  ), d = document.createElement("a");
  d.href = l, d.download = "data-quality-browser-recovery.json", d.click(), URL.revokeObjectURL(l);
}
function yr({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ i(Cr, { className: "dq-spin" }),
    e
  ] });
}
function wr({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ i(qt, {}),
    /* @__PURE__ */ i("p", { children: e }),
    /* @__PURE__ */ i("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const hi = { components: { DataQualityPage: ei } };
export {
  ei as DataQualityPage,
  hi as default,
  Pt as objectFiltersEqual
};
