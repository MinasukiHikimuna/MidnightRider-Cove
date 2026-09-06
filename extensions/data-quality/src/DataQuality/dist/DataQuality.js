import { jsxs as f, jsx as n, Fragment as Se } from "react/jsx-runtime";
import { useState as S, useEffect as W, useMemo as Qe, useRef as $, useCallback as pe, useLayoutEffect as Rr } from "react";
import { VIDEO_SORT_OPTIONS as pt, FilterDialog as qr, VIDEO_CRITERIA as gt, EntityReferenceMultiSelector as ht, DetailListToolbar as Ir, DetailListPagination as Or, VideoPlayer as Tr, VideoCard as kr, EntityDetailTabs as Pr, SortableList as Bt } from "@cove/runtime/components";
import { Settings as Mr, AlertTriangle as mt, Pencil as rr, Film as Jt, Loader2 as nr, ChevronLeft as Lr, ChevronRight as xr, ExternalLink as Dr, X as ir, Plus as Fr, Upload as $r, Trash2 as or, GripVertical as sr } from "@cove/runtime/lucide-react";
import { extensionFetch as _r } from "@cove/runtime/api";
function qe(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function yt(e) {
  if (e.actions.some(ar))
    return "An action cannot contain contradictory assessments for the same tag.";
  if (!e.name.trim() || !e.actions.every(Et))
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
function Vt(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function we(e) {
  const { page: t, ...r } = e.view.filter;
  return JSON.stringify([
    r,
    e.view.objectFilter,
    e.view.searchMode
  ]);
}
function Et(e) {
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
function We(e) {
  return e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  );
}
function ar(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.steps)
    if (["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(r.mode))
      for (const o of r.tagIds) {
        const a = t.get(o);
        if (a && a !== r.mode) return !0;
        t.set(o, r.mode);
      }
  return !1;
}
function Ie(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Ur(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (o) => typeof o == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (o) => typeof (o == null ? void 0 : o.id) == "string" && typeof o.label == "string" && (o.shortcut === void 0 || typeof o.shortcut == "string") && Array.isArray(o.steps) && o.steps.every((a) => a && Array.isArray(a.tagIds)) && Et(o)
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => yt(r)))
    throw new Error(
      "Saved reviews contain invalid actions or shortcuts. Existing data has been kept; assign shortcuts 1–9 only once or leave them empty."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Ur(e) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.cardSize === void 0 || t.cardSize === null || Number.isFinite(t.cardSize) && t.cardSize >= 115 && t.cardSize <= 380) && (t.annotations === void 0 || Array.isArray(t.annotations) && t.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [t.annotationParents, t.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0)
  );
}
function bt(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const o of e)
    for (const a of o)
      r.has(a.id) || (r.add(a.id), t.push(a));
  return t;
}
function zt(e, t) {
  return e.size > 0 ? [...e].sort((r, o) => r - o) : t == null ? [] : [t];
}
function jr(e, t, r, o) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!o && t.includes(r)) return r;
  const a = Math.max(0, e.indexOf(r));
  if (o) {
    for (const d of e.slice(a + 1))
      if (t.includes(d)) return d;
    if (t.includes(r)) {
      for (const d of e.slice(0, a).reverse())
        if (t.includes(d)) return d;
      return r;
    }
  }
  return t[Math.min(a, t.length - 1)];
}
function Kr(e, t) {
  const r = new Set(e), o = t.length > 0 && t.every((a) => r.has(a));
  for (const a of t)
    o ? r.delete(a) : r.add(a);
  return r;
}
function Br(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const lr = "ext:com.midnightrider.data-quality:configuration", Jr = "ext:cove-data-quality:video-reviews", wt = "ext:com.midnightrider.data-quality:progress", Oe = /* @__PURE__ */ new Map(), He = /* @__PURE__ */ new Map(), dt = (e, t) => e.includes("*") || e.includes(t), Ge = (e) => j(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Vr = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function vt(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function ve(e) {
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
    reviews: Ie(JSON.stringify(t.reviews)),
    deletedIds: vt(t.deletedIds),
    importedIds: vt(t.importedIds)
  };
}
function zr(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const o = /* @__PURE__ */ new Set();
  for (const a of t) {
    const d = localStorage.getItem(a);
    if (d !== null) {
      const c = Ie(d);
      r ?? (r = c), c.forEach((w) => o.add(w.id));
    }
    vt(
      JSON.parse(localStorage.getItem(`${a}:account-imports`) ?? "[]")
    ).forEach((c) => o.add(c));
  }
  return {
    reviews: r ?? [],
    known: [...o],
    present: r !== void 0
  };
}
async function cr(e) {
  const t = await j("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function dr(e, t) {
  const r = (He.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return He.set(e, r), r.finally(() => {
    He.get(e) === r && He.delete(e);
  }).catch(() => {
  }), r;
}
let Re = null;
function Qr() {
  if (Re) return Re;
  const e = Hr();
  return Re = e, e.finally(() => {
    Re === e && (Re = null);
  }).catch(() => {
  }), e;
}
async function Hr() {
  var C;
  const e = await j("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, o = dt(e.permissions, "savedfilters.read"), a = o && dt(e.permissions, "savedfilters.write"), d = o ? (await Ge(lr)).filter((A) => A.name === "Data Quality configuration").sort((A, b) => A.id - b.id) : [];
  if (d.length > 1) {
    const A = (b) => {
      const { revision: q, ...O } = ve(b.uiOptions);
      return JSON.stringify(O);
    };
    if (d.some((b) => A(b) !== A(d[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (a)
      for (const b of d.slice(1))
        await j(`/api/savedfilters/${b.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${b.id}` })
        });
    d.splice(1);
  }
  let c = d.length ? ve(d[0].uiOptions) : Vr();
  const w = localStorage.getItem(`${r}:migrated`) === "true", E = localStorage.getItem(r), p = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && E && (c = ve(E));
  let s = !d.length;
  if (d.length && p && E) {
    const A = ve(E);
    if (A.reviews.some((q) => {
      const O = c.reviews.find((P) => P.id === q.id);
      return O && JSON.stringify(O) !== JSON.stringify(q);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const b = [
      .../* @__PURE__ */ new Set([...c.deletedIds, ...A.deletedIds])
    ];
    c = {
      ...c,
      reviews: bt(c.reviews, A.reviews).filter(
        (q) => !b.includes(q.id)
      ),
      deletedIds: b,
      importedIds: [
        .../* @__PURE__ */ new Set([...c.importedIds, ...A.importedIds])
      ]
    }, s = !0;
  }
  if (!w) {
    const A = JSON.stringify(c), b = zr(t);
    if (d.length && b.reviews.some((u) => {
      const N = c.reviews.find((R) => R.id === u.id);
      return N && JSON.stringify(N) !== JSON.stringify(u);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const q = o ? (await Ge(Jr)).flatMap(
      (u) => Ie(u.uiOptions ?? "[]")
    ) : [], O = b.known.filter(
      (u) => !b.reviews.some((N) => N.id === u)
    ), P = /* @__PURE__ */ new Set([...c.deletedIds, ...O]);
    c = {
      ...c,
      reviews: bt(
        b.reviews,
        c.reviews,
        q.filter(
          (u) => !b.known.includes(u.id) && !c.importedIds.includes(u.id)
        )
      ).filter((u) => !P.has(u.id)),
      deletedIds: [...P],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...c.importedIds,
          ...b.known,
          ...q.map((u) => u.id)
        ])
      ]
    }, s || (s = JSON.stringify(c) !== A);
  }
  const g = {
    userId: t,
    recordId: (C = d[0]) == null ? void 0 : C.id,
    config: c,
    readable: o,
    writable: a,
    durable: a
  };
  if (Oe.set(r, g), s && a) {
    const A = c;
    d.length && (g.config = ve(d[0].uiOptions)), await ur(r, A), c = g.config;
  } else d.length || (localStorage.setItem(r, JSON.stringify(c)), !o && (!w || p) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!o) localStorage.setItem(`${r}:migrated`, "true");
  else if (a)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: c.reviews,
    storageKey: r,
    canWrite: dt(e.permissions, "videos.write"),
    canConfigure: !o || a,
    storageNotice: o ? a ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function ur(e, t) {
  const r = Oe.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const o = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await cr(r), r.recordId != null) {
      const d = await j(
        `/api/savedfilters/${r.recordId}`
      );
      if (ve(d.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const a = await j(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: lr,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(o)
        })
      }
    );
    r.recordId = a.id;
  } else
    localStorage.setItem(e, JSON.stringify(o)), localStorage.setItem(`${e}:local-only`, "true");
  if (r.config = o, r.durable)
    try {
      localStorage.setItem(e, JSON.stringify(o)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function Wr(e, t) {
  return Ie(JSON.stringify(t)), dr(e, async () => {
    const r = Oe.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const o = r.config.reviews.filter((a) => !t.some((d) => d.id === a.id)).map((a) => a.id);
    await ur(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...o])
      ].filter((a) => !t.some((d) => d.id === a))
    });
  });
}
function Qt(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Gr(e, t) {
  const r = Oe.get(e);
  if (!r) return null;
  const o = localStorage.getItem(`${e}:progress:${t}`), a = o ? Qt(o) : null;
  if (!r.readable) return a;
  const d = (await Ge(wt)).find(
    (w) => w.name === t
  ), c = d ? Qt(d.uiOptions) : null;
  return a && (!c || a.updatedAt > c.updatedAt) ? a : c;
}
function Xr(e, t, r) {
  const o = `${e}:progress:${t}`;
  try {
    localStorage.setItem(o, JSON.stringify(r));
  } catch {
  }
  return dr(o, async () => {
    const a = Oe.get(e);
    if (!(a != null && a.writable)) return;
    await cr(a);
    const d = (await Ge(wt)).find(
      (c) => c.name === t
    );
    await j(
      d ? `/api/savedfilters/${d.id}` : "/api/savedfilters",
      {
        method: d ? "PUT" : "POST",
        body: JSON.stringify({
          mode: wt,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Te = "confirmed_absent_tags", Nt = "Confirmed absent tags", Yr = {
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
function Xe(e) {
  return Array.isArray(e) ? e.map(Xe) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? Yr[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === Te.toLowerCase() ? r.toLowerCase() : Xe(r)
    ])
  ) : e;
}
async function j(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const o = await _r(e, { ...t, headers: r });
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
  const a = await o.text();
  return a ? JSON.parse(a) : void 0;
}
async function Ht(e, t, r) {
  const o = { ...e.view.objectFilter }, a = o._filterExpression;
  if (delete o._filterExpression, delete o.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return j("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Xe({
        findFilter: ge(t),
        objectFilter: o,
        filterExpression: a
      })
    )
  });
}
function Zr(e) {
  return `/api/stream/video/${e}`;
}
function Wt(e) {
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
async function Ct(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await j(`/api/tags/${r}`), t.add(r);
    for (let o = 1; ; o++) {
      const a = await j("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          Xe({
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
      for (const d of a.items) t.add(d.id);
      if (o * 1e3 >= a.totalCount) break;
      if (!a.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...t];
}
function nn(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${Te} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function At() {
  const t = (await j("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === Te.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${Nt} custom field before applying tag assessments.`
    };
  const r = nn(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function on() {
  const e = await At();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await j("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: Te,
        label: Nt,
        type: "tag",
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function Ye(e) {
  return [...new Set(e)];
}
function sn(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${Te} value is not a valid tag list.`
    );
  return Ye(e);
}
function an(e) {
  return Ye(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function ln(e, t) {
  let r;
  try {
    r = await At();
  } catch (p) {
    throw new Error(
      `Could not verify the ${Nt} custom field. ${p instanceof Error ? p.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const o = await Promise.all(
    e.steps.map(async (p) => ({
      ...p,
      tagIds: p.mode === "REMOVE_TREE" ? await Ct(p.tagIds) : Ye(p.tagIds)
    }))
  ), a = o.filter(
    (p) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(p.mode)
  ), d = o.filter(
    (p) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(p.mode)
  ), c = Ye(t), w = r.definition.key;
  let E = 0;
  for (const p of c)
    try {
      const s = await j(`/api/videos/${p}`), g = an(s), C = { ...s.customFields ?? {} }, A = C[w], b = sn(A), q = new Set(g), O = new Set(b);
      for (const R of a)
        for (const M of R.tagIds)
          R.mode === "ADD" ? q.add(M) : q.delete(M);
      for (const R of d)
        for (const M of R.tagIds)
          R.mode === "MARK_PRESENT" ? (q.add(M), O.delete(M)) : R.mode === "MARK_ABSENT" ? (q.delete(M), O.add(M)) : O.delete(M);
      const P = [...q], u = [...O];
      JSON.stringify(g) === JSON.stringify(P) && JSON.stringify(b) === JSON.stringify(u) && (A === void 0 ? u.length === 0 : JSON.stringify(A) === JSON.stringify(b)) || await j(`/api/videos/${p}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: P,
          customFields: {
            ...C,
            [w]: u
          }
        })
      }), E++;
    } catch (s) {
      throw new Error(
        `Assessment stopped after ${E} video${E === 1 ? "" : "s"} completed; video ${p} was affected. Refresh and inspect it before retrying. ${s instanceof Error ? s.message : "Request failed."}`
      );
    }
}
async function cn(e, t) {
  if (!Et(e) || t.length === 0 || t.some((o) => !Number.isSafeInteger(o) || o <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (We(e)) {
    await ln(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (o) => ({
      mode: o.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: o.mode === "REMOVE_TREE" ? await Ct(o.tagIds) : o.tagIds
    }))
  );
  for (let o = 0; o < r.length; o++)
    try {
      await j("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({
          ids: [...t],
          tagIds: [...r[o].tagIds],
          tagMode: r[o].mode
        })
      });
    } catch (a) {
      throw new Error(
        `Step ${o + 1} failed; ${o} earlier step(s) completed. Refresh and check the selected videos before retrying. ${a instanceof Error ? a.message : "Request failed."}`
      );
    }
}
function dn(e) {
  var w, E, p;
  const [t, r] = S({}), [o, a] = S(""), d = (((w = e == null ? void 0 : e.presentation) == null ? void 0 : w.annotations) ?? []).includes("tags") ? ((E = e == null ? void 0 : e.presentation) == null ? void 0 : E.annotationParents) ?? [] : [], c = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...d,
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return W(() => {
    let s = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(c).map(
        async (g) => [g, await Ct([g])]
      )
    ).then((g) => {
      s && r(Object.fromEntries(g));
    }).catch(() => {
      s && a(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      s = !1;
    };
  }, [c]), { ids: t, error: o };
}
function un(e, t, r) {
  const o = t == null ? void 0 : t.presentation, a = (o == null ? void 0 : o.annotations) ?? [], d = (o == null ? void 0 : o.annotationParents) ?? [];
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
    tags: a.includes("tags") && d.length > 0 ? (e.tags ?? []).filter(
      (c) => d.some(
        (w) => {
          var E;
          return w !== c.id && ((E = r[w]) == null ? void 0 : E.includes(c.id));
        }
      )
    ) : []
  };
}
function fn({
  videos: e,
  review: t,
  trees: r,
  disabled: o,
  onChoose: a
}) {
  var w, E, p;
  const d = new Set(
    (((w = t.presentation) == null ? void 0 : w.binParents) ?? []).flatMap(
      (s) => (r[s] ?? []).filter((g) => g !== s)
    )
  ), c = /* @__PURE__ */ new Map();
  for (const s of e)
    for (const g of s.tags ?? [])
      if (d.has(g.id)) {
        const C = c.get(g.id) ?? { name: g.name, count: 0 };
        C.count++, c.set(g.id, C);
      }
  return (p = (E = t.presentation) == null ? void 0 : E.binParents) != null && p.length ? /* @__PURE__ */ f("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...c].sort((s, g) => s[1].name.localeCompare(g[1].name)).map(([s, g]) => /* @__PURE__ */ f(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: o,
        onClick: () => a(s),
        children: [
          g.name,
          " (",
          g.count,
          ")"
        ]
      },
      s
    )),
    !c.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function pn(e, t) {
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
function Gt({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: o = !0
}) {
  const [a, d] = S(!1), c = e.view.filter, w = (s) => t({
    ...e,
    view: { ...e.view, filter: { ...c, ...s } }
  }), E = e.presentation ?? {}, p = (s) => t({ ...e, presentation: { ...E, ...s } });
  return /* @__PURE__ */ f(Se, { children: [
    o && /* @__PURE__ */ f("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ f("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(c.q ?? ""),
            onChange: (s) => w({ q: s.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ f("div", { className: "dq-field-grid", children: [
        /* @__PURE__ */ f("label", { children: [
          "Sort",
          /* @__PURE__ */ f(
            "select",
            {
              "aria-label": "Sort",
              value: String(c.sort ?? "date"),
              onChange: (s) => w({ sort: s.target.value, sorts: void 0 }),
              children: [
                !pt.some((s) => s.value === c.sort) && c.sort != null && /* @__PURE__ */ n("option", { value: String(c.sort), children: String(c.sort) }),
                pt.map((s) => /* @__PURE__ */ n("option", { value: s.value, children: s.label }, s.value))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ f("label", { children: [
          "Direction",
          /* @__PURE__ */ f(
            "select",
            {
              "aria-label": "Direction",
              value: String(c.direction ?? "desc"),
              onChange: (s) => w({ direction: s.target.value }),
              children: [
                /* @__PURE__ */ n("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ n("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ f("label", { children: [
          "Videos per page",
          /* @__PURE__ */ n(
            "input",
            {
              type: "number",
              min: "1",
              max: "1000",
              value: Number(c.perPage) || 40,
              onChange: (s) => w({
                perPage: Math.max(
                  1,
                  Math.min(1e3, Number(s.target.value) || 40)
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
          onClick: () => d(!0),
          children: "Edit video filters"
        }
      ),
      /* @__PURE__ */ f("p", { children: [
        Object.keys(e.view.objectFilter).length ? "Video filters configured" : "No video filters",
        ". Choose which videos enter the queue."
      ] }),
      a && /* @__PURE__ */ n("div", { onKeyDown: (s) => s.stopPropagation(), children: /* @__PURE__ */ n(
        qr,
        {
          open: !0,
          onClose: () => d(!1),
          criteria: gt,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: !0,
          subjectLabel: "videos",
          onApply: (s) => {
            t({ ...e, view: { ...e.view, objectFilter: s } }), d(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ f(Se, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Choose how videos and tags appear while reviewing." }),
      /* @__PURE__ */ n("div", { className: "dq-field-grid", children: /* @__PURE__ */ f("label", { children: [
        "Preferred view",
        /* @__PURE__ */ n(
          "select",
          {
            value: e.view.displayMode === "wall" ? "wall" : "grid",
            onChange: (s) => t({
              ...e,
              view: {
                ...e.view,
                displayMode: s.target.value
              }
            }),
            children: ["grid", "wall"].map((s) => /* @__PURE__ */ n("option", { children: s }, s))
          }
        )
      ] }) }),
      /* @__PURE__ */ n("h4", { children: "Card annotations" }),
      /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((s) => {
        const g = E.annotations ?? [];
        return /* @__PURE__ */ f("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: g.includes(s),
              onChange: (C) => p({
                annotations: C.target.checked ? [...g, s] : g.filter((A) => A !== s)
              })
            }
          ),
          s
        ] }, s);
      }) }),
      (E.annotations ?? []).includes("tags") && /* @__PURE__ */ f(Se, { children: [
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
        /* @__PURE__ */ n(
          ht,
          {
            entityType: "tag",
            values: E.annotationParents ?? [],
            placeholder: "Search annotation parent tags...",
            onChange: (s) => p({ annotationParents: s }),
            allowCreate: !1
          }
        )
      ] }),
      /* @__PURE__ */ n("h4", { children: "Tag bins" }),
      /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
      /* @__PURE__ */ n(
        ht,
        {
          entityType: "tag",
          values: E.binParents ?? [],
          placeholder: "Search tag-bin parent tags...",
          onChange: (s) => p({ binParents: s }),
          allowCreate: !1
        }
      )
    ] })
  ] });
}
const gn = {
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
function Rt(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function hn(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function mn(e) {
  return [
    ...new Set(
      Rt(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function yn(e, t) {
  const r = Rt(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((o) => {
      const a = String(o.key ?? ""), d = gn[String(o.modifier ?? "EQUALS")], c = (g, C) => String(C ?? "").trim() || t[String(g)] || String(g ?? ""), w = c(
        o.value,
        o.displayValue
      ), E = c(
        o.value2,
        o.displayValue2
      ), p = String(o.modifier ?? "EQUALS"), s = p === "IS_NULL" || p === "NOT_NULL" ? [] : p === "BETWEEN" || p === "NOT_BETWEEN" ? [w, "and", E] : [w];
      return {
        ...o,
        label: [hn(a), d, ...s].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function bn(e) {
  const t = Rt(e.customFieldCriteria);
  return t.length ? {
    ...e,
    customFieldCriteria: t.map(
      ({ label: r, ...o }) => o
    )
  } : e;
}
function wn(e, t, r) {
  return r || "customFieldCriteria" in t || !Array.isArray(e.customFieldCriteria) ? t : { ...t, customFieldCriteria: e.customFieldCriteria };
}
const ut = 180, vn = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function Xt(e) {
  return e.view.displayMode === "wall" ? "wall" : "grid";
}
function Yt(e) {
  return e === "wall" ? "wall" : "grid";
}
function Sn() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Zt(e) {
  const t = new URLSearchParams(window.location.search);
  e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function En(e) {
  return ge({ ...e, page: 1 });
}
function St(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((c, w) => St(c, t[w]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, o = t, a = Object.keys(r).sort(), d = Object.keys(o).sort();
  return a.length === d.length && a.every(
    (c, w) => c === d[w] && St(r[c], o[c])
  );
}
function fr(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Y(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
function Nn({
  onNavigate: e
}) {
  const [t, r] = S([]), [o] = S(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [a, d] = S(""), [c, w] = S(!0), [E, p] = S(""), [s, g] = S(!1), [C, A] = S(!0), [b, q] = S(""), [O, P] = S(""), [u, N] = S(!1), [R, M] = S(!1), [m, D] = S(Sn), [V, J] = S(!1), [se, oe] = S(!1), [U, Ee] = S(
    null
  ), _ = t.find((i) => i.id === m) ?? null, h = Qe(
    () => (U == null ? void 0 : U.id) === m && _ ? { ..._, view: U.view } : _,
    [U, m, _]
  ), ke = $(
    null
  ), Pe = dn(h), [K, Me] = S({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [pr, gr] = S({
    page: 1,
    perPage: 40
  }), [te, qt] = S({ items: [], totalCount: 0 }), [T, Le] = S(!1), [re, It] = S(""), [ae, ce] = S(() => /* @__PURE__ */ new Set()), Ze = $(ae);
  Ze.current = ae;
  const he = $(/* @__PURE__ */ new Map()), [G, ne] = S(null), Z = $(G);
  Z.current = G;
  const [ie, me] = S(!1), le = $(ie);
  le.current = ie;
  const Ot = $(null), [xe, et] = S("grid"), [De, Tt] = S(ut), [L, tt] = S(!1), Fe = $(!1), [hr, rt] = S(""), [kt, ye] = S(""), [nt, Ne] = S(""), [F, Pt] = S(null), [Mt, $e] = S(""), [_e, Ue] = S(!1), [Lt, xt] = S({}), it = $(/* @__PURE__ */ new Map()), Dt = $(null), be = $(0), je = $(0), Ke = $(null), de = $(!1);
  W(() => {
    const i = h ? mn(h.view.objectFilter) : [];
    if (xt({}), !i.length) return;
    const l = new AbortController();
    let y = !0;
    return Promise.all(
      i.map(async (v) => {
        var k;
        try {
          const I = await j(`/api/tags/${v}`, {
            signal: l.signal
          });
          return (k = I.name) != null && k.trim() ? [String(v), I.name] : null;
        } catch {
          return null;
        }
      })
    ).then((v) => {
      y && xt(
        Object.fromEntries(v.filter((k) => k !== null))
      );
    }), () => {
      y = !1, l.abort();
    };
  }, [h == null ? void 0 : h.id, h == null ? void 0 : h.view.objectFilter]);
  const ot = Qe(
    () => h ? yn(
      h.view.objectFilter,
      Lt
    ) : {},
    [Lt, h]
  ), mr = Qe(
    () => Array.isArray(ot.customFieldCriteria) ? [...gt, vn] : gt,
    [ot.customFieldCriteria]
  ), Ft = pe(async () => {
    w(!0), p("");
    try {
      const i = await Qr();
      r(i.reviews), d(i.storageKey), g(i.canWrite), A(i.canConfigure ?? !0), q(i.storageNotice ?? ""), m && !i.reviews.some((l) => l.id === m) && (D(""), Zt(""));
    } catch (i) {
      p(
        i instanceof Error ? i.message : "Could not load reviews."
      );
    } finally {
      w(!1);
    }
  }, [m]);
  W(() => {
    Ft();
  }, []);
  const Be = pe(async () => {
    $e("");
    try {
      Pt(await At());
    } catch (i) {
      Pt(null), $e(
        "Tag assessment setup could not be checked. " + (i instanceof Error ? i.message : "Request failed.")
      );
    }
  }, []);
  W(() => {
    Be();
  }, [Be]);
  const ue = pe(
    async (i, l) => {
      var k;
      const y = ++be.current;
      (k = Ke.current) == null || k.abort();
      const v = new AbortController();
      Ke.current = v, l = ge(l), Me(l), Le(!0), It("");
      try {
        let I = await Ht(
          i,
          l,
          v.signal
        );
        const B = Math.max(
          1,
          Math.ceil(I.totalCount / Number(l.perPage))
        );
        return Number(l.page) > B && (l = { ...l, page: B }, I = await Ht(
          i,
          l,
          v.signal
        )), y === be.current && (qt(I), Me(l), gr(l)), I;
      } catch (I) {
        throw y === be.current && It(
          I instanceof Error ? I.message : "Could not load the review queue."
        ), I;
      } finally {
        y === be.current && Le(!1);
      }
    },
    []
  );
  W(() => {
    var l;
    if (je.current += 1, be.current += 1, (l = Ke.current) == null || l.abort(), M(!1), P(""), N(!1), ce(/* @__PURE__ */ new Set()), he.current.clear(), ne(null), me(!1), tt(!1), Fe.current = !1, rt(""), ye(""), Ne(""), qt({ items: [], totalCount: 0 }), !h) {
      Le(!1);
      return;
    }
    let i = !0;
    return Le(!0), (async () => {
      let y = null;
      try {
        y = await Gr(a, h.id);
      } catch (I) {
        i && (N(!0), P(
          I instanceof Error ? I.message : "Could not load progress."
        ));
      }
      if (!i) return;
      const v = (y == null ? void 0 : y.signature) === we(h) ? y : null, k = v ? ge(v.filter) : En(h.view.filter);
      Me(k), et(
        v ? Yt(v.displayMode) : Xt(h)
      ), Tt(
        v ? v.cardSize ?? ut : ut
      );
      try {
        const I = await ue(h, k);
        if (!i) return;
        const B = Vt(
          I.items.map((Q) => Q.id),
          (v == null ? void 0 : v.focusedId) ?? null,
          (v == null ? void 0 : v.index) ?? 0
        );
        ne(B), z(B);
      } catch {
      }
      i && M(!0);
    })(), () => {
      var y;
      i = !1, je.current++, be.current++, (y = Ke.current) == null || y.abort();
    };
  }, [h == null ? void 0 : h.id]);
  const x = Qe(
    () => te.items.map((i) => i.id),
    [te.items]
  );
  W(() => {
    if (!R || !h || !a || T || re || L || (U == null ? void 0 : U.id) === h.id || u)
      return;
    const i = {
      version: 1,
      signature: we(h),
      filter: K,
      focusedId: G,
      index: Math.max(0, x.indexOf(G ?? -1)),
      displayMode: xe,
      cardSize: De,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        a + ":progress:" + h.id,
        JSON.stringify(i)
      );
    } catch {
    }
    if (O) return;
    let l = !0;
    const y = window.setTimeout(() => {
      Xr(a, h.id, i).catch((v) => {
        l && P(
          "Progress is kept in this browser, but account sync failed. " + (v instanceof Error ? v.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      l = !1, window.clearTimeout(y);
    };
  }, [
    R,
    a,
    h,
    T,
    re,
    L,
    K,
    G,
    x,
    xe,
    De,
    U,
    O,
    u
  ]);
  const st = te.items.find((i) => i.id === G) ?? null;
  ie && st && (Ot.current = st);
  const fe = st ?? (ie ? Ot.current : null), yr = zt(ae, G), $t = ae.size > 0 ? `${ae.size} selected video${ae.size === 1 ? "" : "s"}` : G == null ? "no video" : "focused video", z = pe((i, l = !0) => {
    i != null && window.requestAnimationFrame(() => {
      const y = it.current.get(i);
      y == null || y.focus({ preventScroll: !0 }), l && (y == null || y.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  W(() => {
    R && !le.current && z(Z.current);
  }, [R, z]), W(() => {
    T || !x.length || (Z.current == null || !x.includes(Z.current)) && (ne(x[0]), le.current || z(x[0]));
  }, [z, x, T]);
  const Ce = pe(
    (i) => {
      ce((l) => {
        const y = i(l);
        for (const v of /* @__PURE__ */ new Set([...l, ...y]))
          l.has(v) !== y.has(v) && he.current.set(
            v,
            (he.current.get(v) ?? 0) + 1
          );
        return y;
      });
    },
    []
  ), at = pe(
    (i) => {
      if (!x.length) return;
      const l = Math.max(
        0,
        x.indexOf(Z.current ?? x[0])
      ), y = x[Math.max(0, Math.min(x.length - 1, l + i))];
      ne(y), le.current || z(y);
    },
    [z, x]
  ), lt = pe(
    async (i) => {
      const l = zt(
        Ze.current,
        Z.current
      );
      if (!h || Fe.current || T || re || !s || We(i) && (F == null ? void 0 : F.kind) !== "ready" || !l.length)
        return;
      const y = ++je.current, v = h.id, k = [...x], I = Z.current, B = new Map(
        l.map((H) => [H, he.current.get(H) ?? 0])
      ), Q = () => y === je.current && h.id === v;
      Fe.current = !0, tt(!0), rt(
        Ze.current.size ? `${l.length} selected videos` : "the focused video"
      ), ye(""), Ne("");
      let Ae = !1;
      try {
        if (await cn(i, l), Ae = !0, !Q()) return;
        ce((H) => {
          const X = new Set(H);
          for (const ee of l)
            (he.current.get(ee) ?? 0) === B.get(ee) && X.delete(ee);
          return X;
        }), ye(
          `${i.label}: ${l.length} video${l.length === 1 ? "" : "s"} ${i.steps.length ? "updated" : "skipped"}.`
        );
      } catch (H) {
        if (!Q()) return;
        Ne(
          H instanceof Error ? H.message : "Action failed."
        );
      }
      try {
        if (await rn(i), !Q()) return;
        const H = await ue(h, K);
        if (!Q()) return;
        let X = H.items.map((ee) => ee.id);
        if (!X.length && H.totalCount > 0 && Number(K.page) > 1) {
          const ee = Math.max(1, Number(K.page) - 1), ze = { ...K, page: ee };
          Me(ze), X = (await ue(h, ze)).items.map((ct) => ct.id), ce(
            (ct) => new Set([...ct].filter((Ar) => X.includes(Ar)))
          );
          const Kt = X.at(-1) ?? null;
          ne(Kt), le.current || z(Kt);
        } else {
          ce(
            (ze) => new Set([...ze].filter((jt) => X.includes(jt)))
          );
          const ee = jr(
            k,
            X,
            I,
            Ae && l.includes(I ?? -1)
          );
          ne(ee), le.current && ee == null && me(!1), le.current || z(ee);
        }
      } catch (H) {
        Q() && Ne(
          (X) => `${X ? `${X} ` : ""}${Ae ? "The action completed, but " : ""}the queue could not be refreshed. ${H instanceof Error ? H.message : "Refresh failed."}`
        );
      } finally {
        Q() && (Fe.current = !1, tt(!1), rt(""));
      }
    },
    [
      s,
      F,
      ue,
      K,
      z,
      x,
      T,
      re,
      h
    ]
  );
  function br() {
    var y;
    const i = (y = Dt.current) == null ? void 0 : y.firstElementChild, l = i ? getComputedStyle(i).gridTemplateColumns : "";
    return Math.max(1, l.split(" ").filter(Boolean).length);
  }
  function wr(i) {
    if (i.defaultPrevented || i.repeat || i.ctrlKey || i.altKey || i.metaKey || V) return;
    if (ie && i.key === "Escape") {
      Y(i), me(!1), z(Z.current);
      return;
    }
    if (!Br(i.target)) return;
    if (i.key === "Escape") {
      Y(i), Ce(() => /* @__PURE__ */ new Set());
      return;
    }
    const l = (h == null ? void 0 : h.actions.findIndex(
      (k, I) => qe(k, I) === i.key
    )) ?? -1;
    if (l >= 0 && (h != null && h.actions[l])) {
      Y(i), !L && !T && lt(h.actions[l]);
      return;
    }
    if (!ie && i.key === " ") {
      Y(i), G != null && Ce((k) => ft(k, G));
      return;
    }
    if (!ie && i.key.toLowerCase() === "a") {
      Y(i), Ce(
        (k) => Kr(k, x)
      );
      return;
    }
    if (L || T || ie) return;
    if (i.key === "Enter" && G != null) {
      Y(i), me(!0);
      return;
    }
    const y = br(), v = i.key === "ArrowLeft" ? -1 : i.key === "ArrowRight" ? 1 : i.key === "ArrowUp" ? -y : i.key === "ArrowDown" ? y : 0;
    v && (Y(i), at(v));
  }
  function Je(i) {
    D(i), Zt(i);
  }
  async function _t(i) {
    if (!a) return !1;
    const l = i.map(An);
    try {
      await Wr(a, l);
    } catch (v) {
      throw v;
    }
    r(l), m && !l.some((v) => v.id === m) && Je("");
    const y = l.find((v) => v.id === m);
    return y && _ && JSON.stringify(y) !== JSON.stringify(_) && (y.view.displayMode !== _.view.displayMode && et(Xt(y)), we(y) !== we(_) && (Ee(null), Ve(
      y,
      ge({ ...y.view.filter, page: K.page })
    ))), !0;
  }
  if (c)
    return /* @__PURE__ */ n(er, { label: "Loading Data Quality reviews…" });
  if (E)
    return /* @__PURE__ */ f(Se, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Pn().catch(
            (i) => p(
              "Could not export browser reviews. " + (i instanceof Error ? i.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        tr,
        {
          message: E,
          onRetry: () => void Ft()
        }
      )
    ] });
  return /* @__PURE__ */ f("div", { className: "data-quality-page", onKeyDown: wr, children: [
    /* @__PURE__ */ f("header", { className: "data-quality-header", children: [
      /* @__PURE__ */ n("h1", { children: "Data Quality" }),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-settings",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: L || T || !C,
          onClick: () => {
            oe(!1), J(!0);
          },
          children: /* @__PURE__ */ n(Mr, {})
        }
      )
    ] }),
    b && /* @__PURE__ */ n("p", { className: "dq-status", children: b }),
    (F == null ? void 0 : F.kind) === "missing" && /* @__PURE__ */ f("div", { role: "status", className: "dq-status", children: [
      F.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: _e,
          onClick: () => {
            Ue(!0), $e(""), on().then(Be).catch(
              (i) => $e(
                "Could not create the Confirmed absent tags custom field. " + (i instanceof Error ? i.message : "Request failed.")
              )
            ).finally(() => Ue(!1));
          },
          children: _e ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    ((F == null ? void 0 : F.kind) === "incompatible" || Mt) && /* @__PURE__ */ f("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(mt, {}),
      Mt || (F == null ? void 0 : F.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: _e,
          onClick: () => {
            Ue(!0), Be().finally(
              () => Ue(!1)
            );
          },
          children: _e ? "Checking…" : "Check again"
        }
      )
    ] }),
    o && /* @__PURE__ */ f("details", { children: [
      /* @__PURE__ */ n("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ n("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const i = localStorage.getItem("page-videos") ?? "[]", l = URL.createObjectURL(
              new Blob([i], { type: "application/json" })
            ), y = document.createElement("a");
            y.href = l, y.download = "data-quality-unassigned-legacy-reviews.json", y.click(), URL.revokeObjectURL(l);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    O && /* @__PURE__ */ f("p", { role: "alert", children: [
      O,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            P(""), N(!1);
          },
          children: u ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    !h && /* @__PURE__ */ n("section", { className: "dq-toolbar", children: /* @__PURE__ */ f("label", { className: "dq-review-select", children: [
      "Review",
      /* @__PURE__ */ f(
        "select",
        {
          value: "",
          disabled: L,
          onChange: (i) => Je(i.target.value),
          children: [
            /* @__PURE__ */ n("option", { value: "", children: "Choose a review…" }),
            t.map((i) => /* @__PURE__ */ n("option", { value: i.id, children: i.name }, i.id))
          ]
        }
      )
    ] }) }),
    (h == null ? void 0 : h.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: h.description }),
    h && _ && /* @__PURE__ */ f(
      "section",
      {
        className: "dq-queue-toolbar",
        "aria-label": "Video queue toolbar",
        style: {
          "--dq-review-select-width": `${Math.min(
            32,
            Math.max(12, h.name.length + 3)
          )}ch`
        },
        children: [
          /* @__PURE__ */ f("div", { className: "dq-queue-review-controls", children: [
            /* @__PURE__ */ f("label", { children: [
              /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Review" }),
              /* @__PURE__ */ f(
                "select",
                {
                  "aria-label": "Review",
                  value: h.id,
                  disabled: L,
                  onChange: (i) => Je(i.target.value),
                  children: [
                    /* @__PURE__ */ n("option", { value: "", children: "Choose a review…" }),
                    t.map((i) => /* @__PURE__ */ n("option", { value: i.id, children: i.name }, i.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": "Edit review",
                title: "Edit review",
                disabled: L || T || !C,
                onClick: () => {
                  oe(!0), J(!0);
                },
                children: /* @__PURE__ */ n(rr, {})
              }
            )
          ] }),
          /* @__PURE__ */ n(
            "div",
            {
              className: `dq-native-toolbar-host${L || T ? " dq-native-toolbar-disabled" : ""}`,
              "aria-disabled": L || T || void 0,
              inert: L || T ? !0 : void 0,
              onClickCapture: (i) => {
                var y, v, k, I, B;
                const l = i.target instanceof Element ? i.target.closest("button") : null;
                (l == null ? void 0 : l.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((y = l == null ? void 0 : l.textContent) == null ? void 0 : y.trim()) === "Clear all" ? de.current = !0 : ((v = l == null ? void 0 : l.getAttribute("aria-label")) != null && v.startsWith("Filters") || (k = l == null ? void 0 : l.getAttribute("aria-label")) != null && k.startsWith("Edit filter:") || ((I = l == null ? void 0 : l.textContent) == null ? void 0 : I.trim()) === "Cancel" || (B = l == null ? void 0 : l.getAttribute("aria-label")) != null && B.startsWith("Close ")) && (de.current = !1);
              },
              onKeyDownCapture: (i) => {
                var y, v;
                const l = i.target instanceof Element ? i.target.closest("button") : null;
                (i.key === "Delete" || i.key === "Backspace") && (l == null ? void 0 : l.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (i.preventDefault(), i.stopPropagation(), de.current = !0, (v = (y = l.parentElement) == null ? void 0 : y.querySelector(
                  'button[aria-label="Remove filter: Custom Fields"]'
                )) == null || v.click()) : i.key === "Escape" && (de.current = !1);
              },
              children: /* @__PURE__ */ n(
                Ir,
                {
                  filter: re ? pr : K,
                  onFilterChange: vr,
                  totalCount: te.totalCount,
                  sortOptions: pt,
                  showSearch: !0,
                  showSort: !0,
                  displayMode: xe,
                  onDisplayModeChange: (i) => et(Yt(i)),
                  availableDisplayModes: ["grid", "wall"],
                  zoomLevel: (De - 225) / 50,
                  onZoomChange: (i) => Tt(Math.round(225 + i * 50)),
                  cardSizeEntityType: "videos",
                  criteriaDefinitions: mr,
                  objectFilter: ot,
                  onObjectFilterChange: (i) => {
                    if (!L && !T) {
                      const l = bn(i);
                      ke.current = wn(
                        h.view.objectFilter,
                        l,
                        de.current
                      ), de.current = !1;
                    }
                  },
                  showPagingControls: !1
                }
              )
            }
          ),
          (U == null ? void 0 : U.id) === m && /* @__PURE__ */ f("div", { className: "dq-review-defaults", children: [
            /* @__PURE__ */ n("span", { children: "Temporary queue" }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: L || T || !C,
                onClick: Er,
                children: "Save queue to review"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: L || T,
                onClick: Sr,
                children: "Reset to review defaults"
              }
            )
          ] })
        ]
      }
    ),
    h ? /* @__PURE__ */ f(Se, { children: [
      Pe.error && /* @__PURE__ */ n("p", { role: "alert", children: Pe.error }),
      /* @__PURE__ */ n(
        fn,
        {
          videos: te.items,
          review: h,
          trees: Pe.ids,
          disabled: L || T,
          onChoose: (i) => {
            const l = pn(h, i);
            Ee(l), Ve(l, { ...K, page: 1 });
          }
        }
      ),
      nt && !ie && /* @__PURE__ */ f("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(mt, {}),
        nt
      ] }),
      kt && /* @__PURE__ */ n("p", { role: "status", className: "dq-status", children: kt }),
      Ut("top"),
      /* @__PURE__ */ f("div", { className: "dq-workspace", children: [
        /* @__PURE__ */ f("main", { children: [
          T && !te.items.length && /* @__PURE__ */ n(er, { label: "Loading review queue…" }),
          re && !T && /* @__PURE__ */ n(
            tr,
            {
              message: re,
              onRetry: () => void ue(h, K).catch(() => {
              })
            }
          ),
          !T && !re && !te.items.length && /* @__PURE__ */ f("div", { className: "dq-empty", children: [
            /* @__PURE__ */ n(Jt, {}),
            /* @__PURE__ */ n("p", { children: "No videos match this review." })
          ] }),
          !!te.items.length && /* @__PURE__ */ n("div", { ref: Dt, children: /* @__PURE__ */ n(
            "div",
            {
              className: "dq-grid",
              style: {
                "--dq-card-width": `${De}px`
              },
              children: te.items.map(Cr)
            }
          ) })
        ] }),
        /* @__PURE__ */ f("aside", { className: "dq-actions", children: [
          /* @__PURE__ */ n("strong", { children: $t }),
          h.actions.map((i, l) => /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              disabled: L || T || !!re || !s || We(i) && (F == null ? void 0 : F.kind) !== "ready" || !yr.length,
              onClick: () => void lt(i),
              children: [
                qe(i, l) && /* @__PURE__ */ n("kbd", { children: qe(i, l) }),
                /* @__PURE__ */ n("span", { children: i.label }),
                /* @__PURE__ */ n("small", { children: i.steps.length ? `${i.steps.length} step(s)` : "Skip" })
              ]
            },
            i.id
          )),
          !h.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
          !s && /* @__PURE__ */ n("p", { children: "Video write permission is required to apply actions." }),
          L && /* @__PURE__ */ f("p", { role: "status", children: [
            /* @__PURE__ */ n(nr, { className: "dq-spin" }),
            " Applying action to",
            " ",
            hr,
            "…"
          ] }),
          /* @__PURE__ */ n("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
        ] })
      ] }),
      Ut("bottom")
    ] }) : /* @__PURE__ */ f("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(Jt, {}),
      /* @__PURE__ */ n("p", { children: t.length ? "Choose a saved review to open its queue." : "No saved reviews are available in this browser." })
    ] }),
    ie && fe && h && /* @__PURE__ */ n(
      In,
      {
        video: fe,
        review: h,
        targetLabel: $t,
        pending: L,
        refreshing: T || !!re,
        error: nt,
        canWrite: s,
        assessmentReady: (F == null ? void 0 : F.kind) === "ready",
        selected: ae.has(fe.id),
        hasPrevious: x.indexOf(fe.id) > 0,
        hasNext: x.indexOf(fe.id) >= 0 && x.indexOf(fe.id) < x.length - 1,
        onToggleSelected: () => Ce((i) => ft(i, fe.id)),
        onPrevious: () => at(-1),
        onNext: () => at(1),
        onClose: () => {
          me(!1), z(Z.current);
        },
        onAction: lt
      }
    ),
    V && /* @__PURE__ */ n(
      On,
      {
        reviews: t,
        activeReview: _,
        initialEdit: se,
        onSave: _t,
        onChoose: Je,
        onClose: () => {
          J(!1), se && z(Z.current, !1);
        }
      }
    )
  ] });
  async function Ve(i, l) {
    const y = Z.current, v = Math.max(0, x.indexOf(y ?? -1));
    try {
      const I = (await ue(i, l)).items.map((Q) => Q.id);
      ce(
        (Q) => new Set([...Q].filter((Ae) => I.includes(Ae)))
      );
      const B = Vt(I, y, v);
      ne(B), le.current || z(B, !1);
    } catch {
    }
  }
  function vr(i) {
    const l = ke.current;
    if (ke.current = null, L || T || !h || !_) return;
    const y = l ?? h.view.objectFilter, v = St(
      y,
      _.view.objectFilter
    ) ? _.view.objectFilter : y, k = ge({ ...i, page: 1 }), I = {
      ...h,
      view: {
        ...h.view,
        filter: k,
        objectFilter: v
      }
    }, B = we(I) !== we(_), Q = B ? I : _;
    Ee(B ? I : null), ye(
      B ? "Queue adjusted for this session." : "Review queue defaults restored."
    ), Ve(Q, k);
  }
  function Sr() {
    if (L || T || !_) return;
    ke.current = null;
    const i = ge({
      ..._.view.filter,
      page: 1
    });
    Ee(null), ye("Review queue defaults restored."), Ve(_, i);
  }
  function Er() {
    L || T || !h || !_ || !C || _t(
      t.map(
        (i) => i.id === m ? {
          ...i,
          view: {
            ...h.view,
            filter: { ...K, page: 1 }
          }
        } : i
      )
    ).then(() => {
      Ee(null), ye("Queue saved to this review.");
    }).catch(
      (i) => Ne(
        i instanceof Error ? i.message : "Could not save queue."
      )
    );
  }
  function Nr() {
    ce(/* @__PURE__ */ new Set()), he.current.clear(), ne(null);
  }
  function Ut(i) {
    return h ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: L || T,
        "aria-label": `Review queue pagination ${i}`,
        children: /* @__PURE__ */ n(
          Or,
          {
            filter: {
              ...K,
              page: Number(K.page) || 1,
              perPage: Number(K.perPage) || 40
            },
            totalCount: te.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${i}`,
            onFilterChange: (l) => {
              L || T || l.page === Number(K.page) || Cn(
                { ...K, page: l.page },
                h,
                ue,
                Nr
              );
            }
          }
        )
      }
    ) : null;
  }
  function Cr(i) {
    return /* @__PURE__ */ n(
      Rn,
      {
        video: un(i, h, Pe.ids),
        displayMode: xe,
        focused: i.id === G,
        selected: ae.has(i.id),
        setRef: (l) => {
          l ? it.current.set(i.id, l) : it.current.delete(i.id);
        },
        onFocus: () => ne(i.id),
        onToggle: () => Ce((l) => ft(l, i.id)),
        onPreview: () => {
          ne(i.id), me(!0);
        },
        onNavigate: e
      },
      i.id
    );
  }
}
function Cn(e, t, r, o) {
  o(), r(t, e).catch(() => {
  });
}
function ft(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function An(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Rn({
  video: e,
  displayMode: t,
  focused: r,
  selected: o,
  setRef: a,
  onFocus: d,
  onToggle: c,
  onPreview: w,
  onNavigate: E
}) {
  const p = fr(e), s = $(null), g = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, C = !!(g.date || g.studioName), A = !!(g.performers.length || g.tags.length);
  return Rr(() => {
    const b = s.current;
    if (!b) return;
    const q = b.querySelector(
      `a[href="/video/${e.id}"]`
    ), O = b.querySelector(".card-title"), P = `dq-card-title-${e.id}`;
    O && (O.id = P), q && (q.target = "_blank", q.rel = "noreferrer", q.removeAttribute("aria-label"), q.setAttribute("aria-labelledby", P), q.classList.add("dq-card-link"));
    const u = b.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    u && u.setAttribute(
      "aria-label",
      o ? `Deselect ${p}` : `Select ${p}`
    );
    const N = b.querySelector(
      'button[title="Quick View"]'
    );
    N && N.setAttribute("aria-label", `Preview ${p}`);
  }), /* @__PURE__ */ f(
    "article",
    {
      ref: (b) => {
        s.current = b, a(b);
      },
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${p}${o ? ", selected" : ""}`,
      onFocus: d,
      onClick: (b) => {
        d(), b.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${t} ${C ? "has-card-metadata" : "no-card-metadata"} ${A ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          kr,
          {
            video: g,
            selected: o,
            onSelect: c,
            onNavigate: E,
            onQuickView: w,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t === "wall" && /* @__PURE__ */ n(qn, { video: e })
      ]
    }
  );
}
function qn({ video: e }) {
  const t = $(null), r = $(null), [o, a] = S(!1), [d, c] = S(!1), [w, E] = S(!1);
  return W(() => {
    const p = t.current;
    if (!p || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      a(!0), c(!0);
      return;
    }
    const s = new IntersectionObserver(
      ([C]) => a(C.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), g = new IntersectionObserver(
      ([C]) => c(C.isIntersecting && C.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return s.observe(p), g.observe(p), () => {
      s.disconnect(), g.disconnect();
    };
  }, [e.id, e.files.length]), W(() => {
    if (!o) {
      E(!1);
      return;
    }
    const p = new AbortController();
    return j(tn(e.id), {
      signal: p.signal
    }).then((s) => {
      p.signal.aborted || E(s.available === !0);
    }).catch(() => {
      p.signal.aborted || E(!1);
    }), () => p.abort();
  }, [o, e.id]), W(() => {
    const p = r.current;
    p && (d ? Promise.resolve(p.play()).catch(() => {
    }) : p.pause());
  }, [w, d]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: w && /* @__PURE__ */ n(
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
function In({
  video: e,
  review: t,
  targetLabel: r,
  pending: o,
  refreshing: a,
  error: d,
  canWrite: c,
  assessmentReady: w,
  selected: E,
  hasPrevious: p,
  hasNext: s,
  onToggleSelected: g,
  onPrevious: C,
  onNext: A,
  onClose: b,
  onAction: q
}) {
  const O = $(null), P = $(null), u = e.files[0], N = fr(e);
  W(() => {
    var D;
    const m = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (D = O.current) == null || D.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = m;
    };
  }, []);
  function R(m) {
    var J, se, oe;
    if (m.key !== "Tab") return;
    const D = [
      ...((J = O.current) == null ? void 0 : J.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((U) => U.offsetParent !== null);
    if (!D.length) {
      m.preventDefault(), (se = O.current) == null || se.focus();
      return;
    }
    const V = D.indexOf(
      document.activeElement
    );
    m.shiftKey && V <= 0 ? (m.preventDefault(), (oe = D.at(-1)) == null || oe.focus()) : !m.shiftKey && V === D.length - 1 && (m.preventDefault(), D[0].focus());
  }
  function M(m) {
    if (m.defaultPrevented || m.ctrlKey || m.metaKey || m.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const D = m.key === "ArrowLeft" || m.key === "ArrowRight";
    if (m.altKey && !D) return;
    const V = P.current, J = m.currentTarget.querySelector("video");
    if (m.key === "Enter" || m.key === "Escape")
      m.repeat || b();
    else if (m.key === " " && V)
      m.repeat || V.toggle();
    else if (D && V)
      V.seekBy(
        (m.key === "ArrowLeft" ? -1 : 1) * (m.shiftKey ? 5 : m.altKey ? 10 : 60)
      );
    else if ((m.key === "," || m.key === ".") && V) {
      const se = [u == null ? void 0 : u.duration, J == null ? void 0 : J.duration].find(
        (U) => U != null && Number.isFinite(U) && U > 0
      ) ?? 0, oe = e.parentVideoId != null ? (e.clipEndSec ?? se) - (e.clipStartSec ?? 0) : se;
      Number.isFinite(oe) && oe > 0 && V.seekBy((m.key === "," ? -1 : 1) * oe * 0.1);
    } else if (m.key.toLowerCase() === "n" || m.key.toLowerCase() === "m")
      !m.repeat && !o && !a && (m.key.toLowerCase() === "n" && p && C(), m.key.toLowerCase() === "m" && s && A());
    else if (m.key === "ArrowUp" && J)
      J.volume = Math.min(1, J.volume + 0.1);
    else if (m.key === "ArrowDown" && J)
      J.volume = Math.max(0, J.volume - 0.1);
    else return;
    Y(m);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: O,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${N}`,
      className: "dq-preview",
      onKeyDown: R,
      onKeyDownCapture: M,
      onMouseDown: (m) => {
        m.target === m.currentTarget && b();
      },
      children: /* @__PURE__ */ f("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ f("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !p || o || a,
              onClick: C,
              children: /* @__PURE__ */ n(Lr, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !s || o || a,
              onClick: A,
              children: /* @__PURE__ */ n(xr, {})
            }
          ),
          /* @__PURE__ */ f("div", { children: [
            /* @__PURE__ */ n("h2", { children: N }),
            /* @__PURE__ */ f("p", { children: [
              "Actions target ",
              r,
              "."
            ] })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: g,
              disabled: a,
              children: E ? "Selected" : "Select"
            }
          ),
          /* @__PURE__ */ n(
            "a",
            {
              href: `/video/${e.id}`,
              target: "_blank",
              rel: "noreferrer",
              className: "dq-details-link",
              "aria-label": `Open ${N} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ n(Dr, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: b,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(ir, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: u ? /* @__PURE__ */ n(
          Tr,
          {
            autostart: !0,
            streamUrl: Zr(e.id),
            posterUrl: Wt(e),
            format: u.format,
            audioCodec: u.audioCodec,
            duration: u.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (m) => (P.current = m, () => {
              P.current === m && (P.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: Wt(e), alt: "" }) }),
        d && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: d }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((m, D) => /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            disabled: o || a || !c || We(m) && !w,
            onClick: () => void q(m),
            children: [
              qe(m, D) && /* @__PURE__ */ n("kbd", { children: qe(m, D) }),
              m.label
            ]
          },
          m.id
        )) })
      ] })
    }
  );
}
function On({
  reviews: e,
  activeReview: t,
  initialEdit: r = !1,
  onSave: o,
  onChoose: a,
  onClose: d
}) {
  const [c, w] = S(
    () => r && t ? structuredClone(t) : null
  ), [E, p] = S(""), [s, g] = S(!1), C = $(null);
  W(() => {
    var R, M;
    const u = document.activeElement, N = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (M = (R = C.current) == null ? void 0 : R.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || M.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = N, u == null || u.focus({ preventScroll: !0 });
    };
  }, []);
  function A(u) {
    var M, m, D;
    if (u.defaultPrevented) {
      u.stopPropagation();
      return;
    }
    if (u.key === "Escape") {
      Y(u), s || d();
      return;
    }
    if (u.key !== "Tab") {
      u.stopPropagation();
      return;
    }
    const N = [
      ...((M = C.current) == null ? void 0 : M.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((V) => V.offsetParent !== null);
    if (!N.length) {
      Y(u), (m = C.current) == null || m.focus();
      return;
    }
    const R = N.indexOf(
      document.activeElement
    );
    u.shiftKey && R <= 0 ? (Y(u), (D = N.at(-1)) == null || D.focus()) : !u.shiftKey && R === N.length - 1 ? (Y(u), N[0].focus()) : u.stopPropagation();
  }
  function b(u) {
    w(
      u ? structuredClone(u) : {
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
    ), p("");
  }
  async function q() {
    if (s) return;
    if (!c || yt(c)) {
      p(c ? yt(c) : "Choose a review.");
      return;
    }
    const u = { ...c, name: c.name.trim() }, N = e.some((R) => R.id === u.id) ? e.map((R) => R.id === u.id ? u : R) : [...e, u];
    g(!0), p("");
    try {
      if (!await o(N)) throw new Error("Could not save reviews.");
      a(u.id), d();
    } catch (R) {
      p(
        "Could not save reviews. Your edits are still open. " + (R instanceof Error ? R.message : "Retry saving.")
      );
    } finally {
      g(!1);
    }
  }
  async function O(u) {
    if (!s) {
      g(!0), p("");
      try {
        if (!await o(u)) throw new Error("Could not save reviews.");
      } catch (N) {
        p(
          N instanceof Error ? N.message : "Could not save reviews."
        );
      } finally {
        g(!1);
      }
    }
  }
  async function P(u) {
    var R;
    if (s) return;
    const N = (R = u.target.files) == null ? void 0 : R[0];
    if (u.target.value = "", !!N) {
      if (N.size > 2e6) {
        p("Review files must be smaller than 2 MB.");
        return;
      }
      g(!0), p("");
      try {
        const M = Ie(await N.text());
        if (!await o(bt(e, M)))
          throw new Error("Could not save reviews.");
      } catch (M) {
        p(
          M instanceof Error ? M.message : "Could not import reviews."
        );
      } finally {
        g(!1);
      }
    }
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: C,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: A,
      children: /* @__PURE__ */ f("div", { className: "dq-manager", children: [
        /* @__PURE__ */ f("header", { children: [
          /* @__PURE__ */ f("div", { children: [
            /* @__PURE__ */ n("h2", { children: c ? e.some((u) => u.id === c.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: s,
              onClick: d,
              children: /* @__PURE__ */ n(ir, {})
            }
          )
        ] }),
        E && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: E }),
        /* @__PURE__ */ n("fieldset", { disabled: s, className: "dq-manager-content", children: c ? /* @__PURE__ */ n(
          Tn,
          {
            draft: c,
            saving: s,
            setDraft: w,
            onSave: () => void q(),
            onCancel: d
          }
        ) : /* @__PURE__ */ f(Se, { children: [
          /* @__PURE__ */ f("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ f(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => b(),
                children: [
                  /* @__PURE__ */ n(Fr, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ f("label", { className: "dq-button", children: [
              /* @__PURE__ */ n($r, {}),
              " Import reviews",
              /* @__PURE__ */ n(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: P
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((u) => /* @__PURE__ */ f("article", { children: [
            /* @__PURE__ */ f("div", { children: [
              /* @__PURE__ */ n("strong", { children: u.name }),
              /* @__PURE__ */ n("p", { children: u.description || "No description" })
            ] }),
            /* @__PURE__ */ f("button", { type: "button", onClick: () => b(u), children: [
              /* @__PURE__ */ n(rr, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => b({
                  ...structuredClone(u),
                  id: crypto.randomUUID(),
                  name: `${u.name} copy`
                }),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${u.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${u.name}”?`) && O(
                    e.filter((N) => N.id !== u.id)
                  );
                },
                children: /* @__PURE__ */ n(or, {})
              }
            )
          ] }, u.id)) })
        ] }) })
      ] })
    }
  );
}
function Tn({
  draft: e,
  saving: t = !1,
  setDraft: r,
  onSave: o,
  onCancel: a
}) {
  const [d, c] = S("Review"), w = $(/* @__PURE__ */ new WeakMap()), E = (s) => {
    let g = w.current.get(s);
    return g || (g = crypto.randomUUID(), w.current.set(s, g)), g;
  }, p = (s, g) => r({
    ...e,
    actions: e.actions.map(
      (C, A) => A === s ? g : C
    )
  });
  return /* @__PURE__ */ f("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      Pr,
      {
        tabs: ["Review", "Queue", "Appearance", "Actions"].map((s) => ({
          key: s,
          label: s,
          count: s === "Actions" ? e.actions.length : void 0,
          disabled: t
        })),
        activeTab: d,
        onTabChange: c
      }
    ) }),
    /* @__PURE__ */ f("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ f("section", { hidden: d !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ f("label", { children: [
          "Review name",
          /* @__PURE__ */ n(
            "input",
            {
              autoFocus: !0,
              "aria-label": "Review name",
              value: e.name,
              onChange: (s) => r({ ...e, name: s.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ f("label", { children: [
          "Description",
          /* @__PURE__ */ n(
            "textarea",
            {
              "aria-label": "Description",
              value: e.description,
              onChange: (s) => r({ ...e, description: s.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n("section", { hidden: d !== "Queue", className: "dq-editor-section", children: /* @__PURE__ */ n(Gt, { draft: e, onChange: r, presentation: !1 }) }),
      /* @__PURE__ */ n("section", { hidden: d !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(Gt, { draft: e, onChange: r, queue: !1 }) }),
      /* @__PURE__ */ f("section", { hidden: d !== "Actions", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Actions" }),
        /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
        /* @__PURE__ */ n(
          Bt,
          {
            items: e.actions,
            getKey: (s) => s.id,
            disabled: t,
            className: "dq-sortable-list",
            onReorder: (s) => r({ ...e, actions: s }),
            renderItem: (s, { index: g, dragHandleProps: C, isOver: A }) => /* @__PURE__ */ f(
              "fieldset",
              {
                className: A ? "dq-action-card dq-drag-over" : "dq-action-card",
                children: [
                  /* @__PURE__ */ f("legend", { children: [
                    "Action ",
                    g + 1
                  ] }),
                  /* @__PURE__ */ f("div", { className: "dq-action-heading", children: [
                    /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        ...C,
                        disabled: t,
                        className: "dq-drag-handle",
                        "aria-label": `Reorder action ${g + 1}`,
                        children: /* @__PURE__ */ n(sr, {})
                      }
                    ),
                    /* @__PURE__ */ n("strong", { children: s.label || "New action" }),
                    /* @__PURE__ */ n("div", { className: "dq-row", children: /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        onClick: () => r({
                          ...e,
                          actions: [
                            ...e.actions.slice(0, g + 1),
                            {
                              ...structuredClone(s),
                              id: crypto.randomUUID(),
                              label: s.label + " copy",
                              shortcut: ""
                            },
                            ...e.actions.slice(g + 1)
                          ]
                        }),
                        children: "Duplicate action"
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ f("div", { className: "dq-field-grid", children: [
                    /* @__PURE__ */ f("label", { children: [
                      "Shortcut",
                      /* @__PURE__ */ f(
                        "select",
                        {
                          value: s.shortcut ?? "auto",
                          onChange: (b) => p(g, {
                            ...s,
                            shortcut: b.target.value === "auto" ? void 0 : b.target.value
                          }),
                          children: [
                            /* @__PURE__ */ f("option", { value: "auto", children: [
                              "Position (",
                              g < 9 ? g + 1 : "none",
                              ")"
                            ] }),
                            /* @__PURE__ */ n("option", { value: "", children: "None" }),
                            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((b) => /* @__PURE__ */ n("option", { value: b, children: b }, b))
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ f("label", { children: [
                      "Button label",
                      /* @__PURE__ */ n(
                        "input",
                        {
                          value: s.label,
                          onChange: (b) => p(g, {
                            ...s,
                            label: b.target.value
                          })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ n(
                    Bt,
                    {
                      items: s.steps,
                      getKey: E,
                      disabled: t,
                      className: "dq-sortable-list",
                      onReorder: (b) => p(g, { ...s, steps: b }),
                      renderItem: (b, { index: q, dragHandleProps: O, isOver: P }) => /* @__PURE__ */ n(
                        kn,
                        {
                          dragHandleProps: O,
                          saving: t,
                          isOver: P,
                          step: b,
                          index: q,
                          onChange: (u) => {
                            w.current.set(u, E(b)), p(g, {
                              ...s,
                              steps: s.steps.map(
                                (N, R) => R === q ? u : N
                              )
                            });
                          },
                          onRemove: () => p(g, {
                            ...s,
                            steps: s.steps.filter(
                              (u, N) => N !== q
                            )
                          })
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ f("div", { className: "dq-row", children: [
                    /* @__PURE__ */ n(
                      "button",
                      {
                        className: "dq-button",
                        type: "button",
                        onClick: () => p(g, {
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
                        onClick: () => r({
                          ...e,
                          actions: e.actions.filter(
                            (b, q) => q !== g
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
    /* @__PURE__ */ f("div", { className: "dq-editor-footer", children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const s = URL.createObjectURL(
              new Blob([JSON.stringify([e], null, 2)], {
                type: "application/json"
              })
            ), g = document.createElement("a");
            g.href = s, g.download = "data-quality-review.json", g.click(), URL.revokeObjectURL(s);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: a, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: o, children: "Save review" })
    ] })
  ] });
}
function kn({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: o,
  isOver: a,
  onChange: d,
  onRemove: c
}) {
  return /* @__PURE__ */ f("div", { className: a ? "dq-action-step dq-drag-over" : "dq-action-step", children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        ...r,
        disabled: o,
        className: "dq-drag-handle",
        "aria-label": `Reorder step ${t + 1}`,
        children: /* @__PURE__ */ n(sr, {})
      }
    ),
    /* @__PURE__ */ f("span", { children: [
      "Step ",
      t + 1
    ] }),
    /* @__PURE__ */ f(
      "select",
      {
        "aria-label": "Tag operation",
        value: e.mode,
        onChange: (w) => d({ ...e, mode: w.target.value }),
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
      ht,
      {
        entityType: "tag",
        values: e.tagIds,
        onChange: (w) => d({ ...e, tagIds: w }),
        placeholder: "Choose tags",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: c, children: /* @__PURE__ */ n(or, {}) })
  ] });
}
async function Pn() {
  const e = await j("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let o = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const c = JSON.parse(r);
      Array.isArray(c.reviews) && (o = JSON.stringify(c.reviews, null, 2));
    } catch {
    }
  const a = URL.createObjectURL(
    new Blob([o], { type: "application/json" })
  ), d = document.createElement("a");
  d.href = a, d.download = "data-quality-browser-recovery.json", d.click(), URL.revokeObjectURL(a);
}
function er({ label: e }) {
  return /* @__PURE__ */ f("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(nr, { className: "dq-spin" }),
    e
  ] });
}
function tr({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ f("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(mt, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const $n = { components: { DataQualityPage: Nn } };
export {
  Nn as DataQualityPage,
  $n as default,
  St as objectFiltersEqual
};
