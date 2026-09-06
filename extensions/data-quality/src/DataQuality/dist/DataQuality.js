import { jsxs as u, jsx as n, Fragment as Ne } from "react/jsx-runtime";
import { useState as S, useEffect as H, useRef as D, useMemo as qe, useCallback as me, useLayoutEffect as cr } from "react";
import { VIDEO_SORT_OPTIONS as bt, FilterDialog as jr, VIDEO_CRITERIA as yt, EntityReferenceMultiSelector as wt, DetailListToolbar as Br, DetailListPagination as Kr, VideoPlayer as Vr, VideoCard as Jr, EntityDetailTabs as zr, SortableList as Xt } from "@cove/runtime/components";
import { ChevronLeft as dr, Pencil as ur, Settings as Qr, AlertTriangle as vt, ChevronRight as fr, Film as Yt, Loader2 as pr, ExternalLink as Hr, X as gr, Plus as Wr, Upload as Gr, Trash2 as hr, GripVertical as mr } from "@cove/runtime/lucide-react";
import { extensionFetch as Xr } from "@cove/runtime/api";
function ke(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function St(e) {
  if (e.actions.some(br))
    return "An action cannot contain contradictory assessments for the same tag.";
  if (!e.name.trim() || !e.actions.every(Rt))
    return "Name the review and complete every action step before saving.";
  if (new Set(e.actions.map((r) => r.id)).size !== e.actions.length)
    return "Action IDs must be unique within a review.";
  const t = e.actions.map(
    (r, o) => r.shortcut ?? (o < 9 ? String(o + 1) : "")
  ).filter(Boolean);
  return t.some((r) => !/^[1-9]$/.test(r)) || new Set(t).size !== t.length ? "Assign each shortcut 1–9 only once, or choose None. Navigation and player keys are reserved." : "";
}
function ue(e) {
  const t = (r, o) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : o;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(1e3, t(e.perPage, 40)))
  };
}
function Zt(e, t, r) {
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
function Rt(e) {
  return !!e.label.trim() && e.steps.every(
    (t) => [
      "ADD",
      "REMOVE",
      "REMOVE_TREE",
      "MARK_PRESENT",
      "MARK_ABSENT",
      "CLEAR_ABSENCE"
    ].includes(t.mode) && t.tagIds.length > 0 && t.tagIds.every((r) => Number.isSafeInteger(r) && r > 0)
  ) && !br(e);
}
function Ge(e) {
  return e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  );
}
function br(e) {
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
function Te(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Yr(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (o) => typeof o == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (o) => typeof (o == null ? void 0 : o.id) == "string" && typeof o.label == "string" && (o.shortcut === void 0 || typeof o.shortcut == "string") && Array.isArray(o.steps) && o.steps.every((l) => l && Array.isArray(l.tagIds)) && Rt(o)
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => St(r)))
    throw new Error(
      "Saved reviews contain invalid actions or shortcuts. Existing data has been kept; assign shortcuts 1–9 only once or leave them empty."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Yr(e) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.cardSize === void 0 || t.cardSize === null || Number.isFinite(t.cardSize) && t.cardSize >= 115 && t.cardSize <= 380) && (t.annotations === void 0 || Array.isArray(t.annotations) && t.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [t.annotationParents, t.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0)
  );
}
function Et(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const o of e)
    for (const l of o)
      r.has(l.id) || (r.add(l.id), t.push(l));
  return t;
}
function er(e, t) {
  return e.size > 0 ? [...e].sort((r, o) => r - o) : t == null ? [] : [t];
}
function Zr(e, t, r, o) {
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
function en(e, t) {
  const r = new Set(e), o = t.length > 0 && t.every((l) => r.has(l));
  for (const l of t)
    o ? r.delete(l) : r.add(l);
  return r;
}
function tn(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const yr = "ext:com.midnightrider.data-quality:configuration", rn = "ext:cove-data-quality:video-reviews", Nt = "ext:com.midnightrider.data-quality:progress", Oe = /* @__PURE__ */ new Map(), We = /* @__PURE__ */ new Map(), pt = (e, t) => e.includes("*") || e.includes(t), Xe = (e) => V(`/api/savedfilters?mode=${encodeURIComponent(e)}`), nn = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Ct(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Ee(e) {
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
    reviews: Te(JSON.stringify(t.reviews)),
    deletedIds: Ct(t.deletedIds),
    importedIds: Ct(t.importedIds)
  };
}
function on(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const o = /* @__PURE__ */ new Set();
  for (const l of t) {
    const d = localStorage.getItem(l);
    if (d !== null) {
      const c = Te(d);
      r ?? (r = c), c.forEach((v) => o.add(v.id));
    }
    Ct(
      JSON.parse(localStorage.getItem(`${l}:account-imports`) ?? "[]")
    ).forEach((c) => o.add(c));
  }
  return {
    reviews: r ?? [],
    known: [...o],
    present: r !== void 0
  };
}
async function wr(e) {
  const t = await V("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function vr(e, t) {
  const r = (We.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return We.set(e, r), r.finally(() => {
    We.get(e) === r && We.delete(e);
  }).catch(() => {
  }), r;
}
let Ie = null;
function sn() {
  if (Ie) return Ie;
  const e = an();
  return Ie = e, e.finally(() => {
    Ie === e && (Ie = null);
  }).catch(() => {
  }), e;
}
async function an() {
  var C;
  const e = await V("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, o = pt(e.permissions, "savedfilters.read"), l = o && pt(e.permissions, "savedfilters.write"), d = o ? (await Xe(yr)).filter((A) => A.name === "Data Quality configuration").sort((A, y) => A.id - y.id) : [];
  if (d.length > 1) {
    const A = (y) => {
      const { revision: q, ...k } = Ee(y.uiOptions);
      return JSON.stringify(k);
    };
    if (d.some((y) => A(y) !== A(d[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (l)
      for (const y of d.slice(1))
        await V(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    d.splice(1);
  }
  let c = d.length ? Ee(d[0].uiOptions) : nn();
  const v = localStorage.getItem(`${r}:migrated`) === "true", E = localStorage.getItem(r), p = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && E && (c = Ee(E));
  let s = !d.length;
  if (d.length && p && E) {
    const A = Ee(E);
    if (A.reviews.some((q) => {
      const k = c.reviews.find((P) => P.id === q.id);
      return k && JSON.stringify(k) !== JSON.stringify(q);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const y = [
      .../* @__PURE__ */ new Set([...c.deletedIds, ...A.deletedIds])
    ];
    c = {
      ...c,
      reviews: Et(c.reviews, A.reviews).filter(
        (q) => !y.includes(q.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...c.importedIds, ...A.importedIds])
      ]
    }, s = !0;
  }
  if (!v) {
    const A = JSON.stringify(c), y = on(t);
    if (d.length && y.reviews.some((f) => {
      const N = c.reviews.find((R) => R.id === f.id);
      return N && JSON.stringify(N) !== JSON.stringify(f);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const q = o ? (await Xe(rn)).flatMap(
      (f) => Te(f.uiOptions ?? "[]")
    ) : [], k = y.known.filter(
      (f) => !y.reviews.some((N) => N.id === f)
    ), P = /* @__PURE__ */ new Set([...c.deletedIds, ...k]);
    c = {
      ...c,
      reviews: Et(
        y.reviews,
        c.reviews,
        q.filter(
          (f) => !y.known.includes(f.id) && !c.importedIds.includes(f.id)
        )
      ).filter((f) => !P.has(f.id)),
      deletedIds: [...P],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...c.importedIds,
          ...y.known,
          ...q.map((f) => f.id)
        ])
      ]
    }, s || (s = JSON.stringify(c) !== A);
  }
  const g = {
    userId: t,
    recordId: (C = d[0]) == null ? void 0 : C.id,
    config: c,
    readable: o,
    writable: l,
    durable: l
  };
  if (Oe.set(r, g), s && l) {
    const A = c;
    d.length && (g.config = Ee(d[0].uiOptions)), await Sr(r, A), c = g.config;
  } else d.length || (localStorage.setItem(r, JSON.stringify(c)), !o && (!v || p) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!o) localStorage.setItem(`${r}:migrated`, "true");
  else if (l)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: c.reviews,
    storageKey: r,
    canWrite: pt(e.permissions, "videos.write"),
    canConfigure: !o || l,
    storageNotice: o ? l ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Sr(e, t) {
  const r = Oe.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const o = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await wr(r), r.recordId != null) {
      const d = await V(
        `/api/savedfilters/${r.recordId}`
      );
      if (Ee(d.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const l = await V(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: yr,
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
function ln(e, t) {
  return Te(JSON.stringify(t)), vr(e, async () => {
    const r = Oe.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const o = r.config.reviews.filter((l) => !t.some((d) => d.id === l.id)).map((l) => l.id);
    await Sr(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...o])
      ].filter((l) => !t.some((d) => d.id === l))
    });
  });
}
function tr(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function cn(e, t) {
  const r = Oe.get(e);
  if (!r) return null;
  const o = localStorage.getItem(`${e}:progress:${t}`), l = o ? tr(o) : null;
  if (!r.readable) return l;
  const d = (await Xe(Nt)).find(
    (v) => v.name === t
  ), c = d ? tr(d.uiOptions) : null;
  return l && (!c || l.updatedAt > c.updatedAt) ? l : c;
}
function dn(e, t, r) {
  const o = `${e}:progress:${t}`;
  try {
    localStorage.setItem(o, JSON.stringify(r));
  } catch {
  }
  return vr(o, async () => {
    const l = Oe.get(e);
    if (!(l != null && l.writable)) return;
    await wr(l);
    const d = (await Xe(Nt)).find(
      (c) => c.name === t
    );
    await V(
      d ? `/api/savedfilters/${d.id}` : "/api/savedfilters",
      {
        method: d ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Nt,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Pe = "confirmed_absent_tags", qt = "Confirmed absent tags", un = {
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
function Ye(e) {
  return Array.isArray(e) ? e.map(Ye) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? un[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === Pe.toLowerCase() ? r.toLowerCase() : Ye(r)
    ])
  ) : e;
}
async function V(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const o = await Xr(e, { ...t, headers: r });
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
async function gt(e, t, r) {
  const o = { ...e.view.objectFilter }, l = o._filterExpression;
  if (delete o._filterExpression, delete o.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return V("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Ye({
        findFilter: ue(t),
        objectFilter: o,
        filterExpression: l
      })
    )
  });
}
function fn(e) {
  return `/api/stream/video/${e}`;
}
function rr(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function pn(e) {
  return `/api/stream/video/${e}/preview`;
}
function gn(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function hn(e) {
  return e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function It(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await V(`/api/tags/${r}`), t.add(r);
    for (let o = 1; ; o++) {
      const l = await V("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          Ye({
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
function mn(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${Pe} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function kt() {
  const t = (await V("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === Pe.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${qt} custom field before applying tag assessments.`
    };
  const r = mn(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function bn() {
  const e = await kt();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await V("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: Pe,
        label: qt,
        type: "tag",
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function Ze(e) {
  return [...new Set(e)];
}
function yn(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${Pe} value is not a valid tag list.`
    );
  return Ze(e);
}
function wn(e) {
  return Ze(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function vn(e, t) {
  let r;
  try {
    r = await kt();
  } catch (p) {
    throw new Error(
      `Could not verify the ${qt} custom field. ${p instanceof Error ? p.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const o = await Promise.all(
    e.steps.map(async (p) => ({
      ...p,
      tagIds: p.mode === "REMOVE_TREE" ? await It(p.tagIds) : Ze(p.tagIds)
    }))
  ), l = o.filter(
    (p) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(p.mode)
  ), d = o.filter(
    (p) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(p.mode)
  ), c = Ze(t), v = r.definition.key;
  let E = 0;
  for (const p of c)
    try {
      const s = await V(`/api/videos/${p}`), g = wn(s), C = { ...s.customFields ?? {} }, A = C[v], y = yn(A), q = new Set(g), k = new Set(y);
      for (const R of l)
        for (const L of R.tagIds)
          R.mode === "ADD" ? q.add(L) : q.delete(L);
      for (const R of d)
        for (const L of R.tagIds)
          R.mode === "MARK_PRESENT" ? (q.add(L), k.delete(L)) : R.mode === "MARK_ABSENT" ? (q.delete(L), k.add(L)) : k.delete(L);
      const P = [...q], f = [...k];
      JSON.stringify(g) === JSON.stringify(P) && JSON.stringify(y) === JSON.stringify(f) && (A === void 0 ? f.length === 0 : JSON.stringify(A) === JSON.stringify(y)) || await V(`/api/videos/${p}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: P,
          customFields: {
            ...C,
            [v]: f
          }
        })
      }), E++;
    } catch (s) {
      throw new Error(
        `Assessment stopped after ${E} video${E === 1 ? "" : "s"} completed; video ${p} was affected. Refresh and inspect it before retrying. ${s instanceof Error ? s.message : "Request failed."}`
      );
    }
}
async function Sn(e, t) {
  if (!Rt(e) || t.length === 0 || t.some((o) => !Number.isSafeInteger(o) || o <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (Ge(e)) {
    await vn(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (o) => ({
      mode: o.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: o.mode === "REMOVE_TREE" ? await It(o.tagIds) : o.tagIds
    }))
  );
  for (let o = 0; o < r.length; o++)
    try {
      await V("/api/videos/bulk", {
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
function En(e) {
  var v, E, p;
  const [t, r] = S({}), [o, l] = S(""), d = (((v = e == null ? void 0 : e.presentation) == null ? void 0 : v.annotations) ?? []).includes("tags") ? ((E = e == null ? void 0 : e.presentation) == null ? void 0 : E.annotationParents) ?? [] : [], c = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...d,
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return H(() => {
    let s = !0;
    return r({}), l(""), Promise.all(
      JSON.parse(c).map(
        async (g) => [g, await It([g])]
      )
    ).then((g) => {
      s && r(Object.fromEntries(g));
    }).catch(() => {
      s && l(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      s = !1;
    };
  }, [c]), { ids: t, error: o };
}
function Nn(e, t, r) {
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
function Cn({
  videos: e,
  review: t,
  trees: r,
  disabled: o,
  onChoose: l
}) {
  var v, E, p;
  const d = new Set(
    (((v = t.presentation) == null ? void 0 : v.binParents) ?? []).flatMap(
      (s) => (r[s] ?? []).filter((g) => g !== s)
    )
  ), c = /* @__PURE__ */ new Map();
  for (const s of e)
    for (const g of s.tags ?? [])
      if (d.has(g.id)) {
        const C = c.get(g.id) ?? { name: g.name, count: 0 };
        C.count++, c.set(g.id, C);
      }
  return (p = (E = t.presentation) == null ? void 0 : E.binParents) != null && p.length ? /* @__PURE__ */ u("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...c].sort((s, g) => s[1].name.localeCompare(g[1].name)).map(([s, g]) => /* @__PURE__ */ u(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: o,
        onClick: () => l(s),
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
function An(e, t) {
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
function nr({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: o = !0
}) {
  const [l, d] = S(!1), c = e.view.filter, v = (s) => t({
    ...e,
    view: { ...e.view, filter: { ...c, ...s } }
  }), E = e.presentation ?? {}, p = (s) => t({ ...e, presentation: { ...E, ...s } });
  return /* @__PURE__ */ u(Ne, { children: [
    o && /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ u("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(c.q ?? ""),
            onChange: (s) => v({ q: s.target.value })
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
              onChange: (s) => v({ sort: s.target.value, sorts: void 0 }),
              children: [
                !bt.some((s) => s.value === c.sort) && c.sort != null && /* @__PURE__ */ n("option", { value: String(c.sort), children: String(c.sort) }),
                bt.map((s) => /* @__PURE__ */ n("option", { value: s.value, children: s.label }, s.value))
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
              onChange: (s) => v({ direction: s.target.value }),
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
              max: "1000",
              value: Number(c.perPage) || 40,
              onChange: (s) => v({
                perPage: Math.max(
                  1,
                  Math.min(1e3, Number(s.target.value) || 40)
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
              onChange: (s) => t({
                ...e,
                view: {
                  ...e.view,
                  startFrom: s.target.value
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
      /* @__PURE__ */ n(
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
      l && /* @__PURE__ */ n("div", { onKeyDown: (s) => s.stopPropagation(), children: /* @__PURE__ */ n(
        jr,
        {
          open: !0,
          onClose: () => d(!1),
          criteria: yt,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: !0,
          subjectLabel: "videos",
          onApply: (s) => {
            t({ ...e, view: { ...e.view, objectFilter: s } }), d(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ u(Ne, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Choose how videos and tags appear while reviewing." }),
      /* @__PURE__ */ n("div", { className: "dq-field-grid", children: /* @__PURE__ */ u("label", { children: [
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
        return /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
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
      (E.annotations ?? []).includes("tags") && /* @__PURE__ */ u(Ne, { children: [
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
        /* @__PURE__ */ n(
          wt,
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
        wt,
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
const Rn = {
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
function Tt(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function qn(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function In(e) {
  return [
    ...new Set(
      Tt(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function kn(e, t) {
  const r = Tt(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((o) => {
      const l = String(o.key ?? ""), d = Rn[String(o.modifier ?? "EQUALS")], c = (g, C) => String(C ?? "").trim() || t[String(g)] || String(g ?? ""), v = c(
        o.value,
        o.displayValue
      ), E = c(
        o.value2,
        o.displayValue2
      ), p = String(o.modifier ?? "EQUALS"), s = p === "IS_NULL" || p === "NOT_NULL" ? [] : p === "BETWEEN" || p === "NOT_BETWEEN" ? [v, "and", E] : [v];
      return {
        ...o,
        label: [qn(l), d, ...s].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function Tn(e) {
  const t = Tt(e.customFieldCriteria);
  return t.length ? {
    ...e,
    customFieldCriteria: t.map(
      ({ label: r, ...o }) => o
    )
  } : e;
}
function On(e, t, r) {
  return r || "customFieldCriteria" in t || !Array.isArray(e.customFieldCriteria) ? t : { ...t, customFieldCriteria: e.customFieldCriteria };
}
const ht = 180, Pn = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function ir(e) {
  return e.view.displayMode === "wall" ? "wall" : "grid";
}
function or(e) {
  return e === "wall" ? "wall" : "grid";
}
function Ln() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function sr(e) {
  const t = new URLSearchParams(window.location.search);
  e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function Mn(e) {
  return ue({ ...e, page: 1 });
}
function At(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((c, v) => At(c, t[v]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, o = t, l = Object.keys(r).sort(), d = Object.keys(o).sort();
  return l.length === d.length && l.every(
    (c, v) => c === d[v] && At(r[c], o[c])
  );
}
function Er(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Y(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
function xn({
  onNavigate: e
}) {
  const [t, r] = S([]), [o] = S(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [l, d] = S(""), [c, v] = S(!0), [E, p] = S(""), [s, g] = S(!1), [C, A] = S(!0), [y, q] = S(""), [k, P] = S(""), [f, N] = S(!1), [R, L] = S(!1), [b, _] = S(Ln), [B, J] = S({}), [ae, ce] = S("name"), [Z, Nr] = S("asc"), Ot = D(null), et = D(!1), [Pt, tt] = S(!1), [Lt, Mt] = S(!1), [W, Ce] = S(
    null
  ), F = t.find((i) => i.id === b) ?? null, h = qe(
    () => (W == null ? void 0 : W.id) === b && F ? { ...F, view: W.view } : F,
    [W, b, F]
  ), Cr = qe(() => {
    const i = Z === "asc" ? 1 : -1;
    return [...t].sort((a, m) => {
      if (ae === "count") {
        const w = B[a.id], I = B[m.id], O = typeof w == "number", j = typeof I == "number";
        if (O !== j) return O ? -1 : 1;
        if (O && j && w !== I)
          return (w - I) * i;
      }
      return a.name.localeCompare(m.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * i;
    });
  }, [Z, ae, B, t]), Le = D(
    null
  ), Me = En(h), [z, xe] = S({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Ar, Rr] = S({
    page: 1,
    perPage: 40
  }), [re, xt] = S({ items: [], totalCount: 0 }), [T, De] = S(!1), [ne, Dt] = S(""), [qr, Ir] = S(!1), [le, fe] = S(() => /* @__PURE__ */ new Set()), rt = D(le);
  rt.current = le;
  const be = D(/* @__PURE__ */ new Map()), [G, ie] = S(null), ee = D(G);
  ee.current = G;
  const [oe, ye] = S(!1), de = D(oe);
  de.current = oe;
  const Ft = D(null), [Fe, nt] = S("grid"), [$e, $t] = S(ht), [M, it] = S(!1), _e = D(!1), [kr, ot] = S(""), [_t, we] = S(""), [st, Ae] = S(""), [U, Ut] = S(null), [jt, Ue] = S(""), [je, Be] = S(!1), [Bt, Kt] = S({}), at = D(/* @__PURE__ */ new Map()), Vt = D(null), ve = D(0), Ke = D(0), Ve = D(null), pe = D(!1);
  H(() => {
    const i = h ? In(h.view.objectFilter) : [];
    if (Kt({}), !i.length) return;
    const a = new AbortController();
    let m = !0;
    return Promise.all(
      i.map(async (w) => {
        var I;
        try {
          const O = await V(`/api/tags/${w}`, {
            signal: a.signal
          });
          return (I = O.name) != null && I.trim() ? [String(w), O.name] : null;
        } catch {
          return null;
        }
      })
    ).then((w) => {
      m && Kt(
        Object.fromEntries(w.filter((I) => I !== null))
      );
    }), () => {
      m = !1, a.abort();
    };
  }, [h == null ? void 0 : h.id, h == null ? void 0 : h.view.objectFilter]);
  const lt = qe(
    () => h ? kn(
      h.view.objectFilter,
      Bt
    ) : {},
    [Bt, h]
  ), Tr = qe(
    () => Array.isArray(lt.customFieldCriteria) ? [...yt, Pn] : yt,
    [lt.customFieldCriteria]
  ), Jt = me(async () => {
    v(!0), p("");
    try {
      const i = await sn();
      r(i.reviews), d(i.storageKey), g(i.canWrite), A(i.canConfigure ?? !0), q(i.storageNotice ?? ""), b && !i.reviews.some((a) => a.id === b) && (_(""), sr(""));
    } catch (i) {
      p(
        i instanceof Error ? i.message : "Could not load reviews."
      );
    } finally {
      v(!1);
    }
  }, [b]);
  H(() => {
    Jt();
  }, []), H(() => {
    if (b || t.length === 0) return;
    const i = new AbortController();
    J({});
    for (const a of t)
      gt(
        a,
        ue({ ...a.view.filter, page: 1, perPage: 1 }),
        i.signal
      ).then((m) => {
        i.signal.aborted || J((w) => ({
          ...w,
          [a.id]: m.totalCount
        }));
      }).catch(() => {
        i.signal.aborted || J((m) => ({ ...m, [a.id]: null }));
      });
    return () => i.abort();
  }, [b, t]), cr(() => {
    var i;
    b || c || !et.current || (et.current = !1, (i = Ot.current) == null || i.focus());
  }, [b, c]);
  const Je = me(async () => {
    Ue("");
    try {
      Ut(await kt());
    } catch (i) {
      Ut(null), Ue(
        "Tag assessment setup could not be checked. " + (i instanceof Error ? i.message : "Request failed.")
      );
    }
  }, []);
  H(() => {
    Je();
  }, [Je]);
  const ge = me(
    async (i, a, m = !1) => {
      var j;
      const w = ++ve.current;
      (j = Ve.current) == null || j.abort();
      const I = new AbortController();
      Ve.current = I, a = ue(a);
      const O = Number(a.page);
      m && (a = { ...a, page: 1 }), xe(a), Ir(m), De(!0), Dt("");
      try {
        let x = await gt(
          i,
          a,
          I.signal
        );
        const se = Math.max(
          1,
          Math.ceil(x.totalCount / Number(a.perPage))
        ), K = m ? se : Math.min(O, se);
        return Number(a.page) !== K && (a = { ...a, page: K }, x = await gt(
          i,
          a,
          I.signal
        )), w === ve.current && (xt(x), xe(a), Rr(a)), x;
      } catch (x) {
        throw w === ve.current && Dt(
          x instanceof Error ? x.message : "Could not load the review queue."
        ), x;
      } finally {
        w === ve.current && De(!1);
      }
    },
    []
  );
  H(() => {
    var a;
    if (Ke.current += 1, ve.current += 1, (a = Ve.current) == null || a.abort(), L(!1), P(""), N(!1), fe(/* @__PURE__ */ new Set()), be.current.clear(), ie(null), ye(!1), it(!1), _e.current = !1, ot(""), we(""), Ae(""), xt({ items: [], totalCount: 0 }), !h) {
      De(!1);
      return;
    }
    let i = !0;
    return De(!0), (async () => {
      let m = null;
      try {
        m = await cn(l, h.id);
      } catch (O) {
        i && (N(!0), P(
          O instanceof Error ? O.message : "Could not load progress."
        ));
      }
      if (!i) return;
      const w = (m == null ? void 0 : m.signature) === Se(h) ? m : null, I = w ? ue(w.filter) : Mn(h.view.filter);
      xe(I), nt(
        w ? or(w.displayMode) : ir(h)
      ), $t(
        w ? w.cardSize ?? ht : ht
      );
      try {
        const O = await ge(
          h,
          I,
          !w && h.view.startFrom !== "beginning"
        );
        if (!i) return;
        const j = Zt(
          O.items.map((x) => x.id),
          (w == null ? void 0 : w.focusedId) ?? null,
          (w == null ? void 0 : w.index) ?? 0
        );
        ie(j), Q(j);
      } catch {
      }
      i && L(!0);
    })(), () => {
      var m;
      i = !1, Ke.current++, ve.current++, (m = Ve.current) == null || m.abort();
    };
  }, [h == null ? void 0 : h.id]);
  const $ = qe(
    () => re.items.map((i) => i.id),
    [re.items]
  );
  H(() => {
    if (!R || !h || !l || T || ne || M || (W == null ? void 0 : W.id) === h.id || f)
      return;
    const i = {
      version: 1,
      signature: Se(h),
      filter: z,
      focusedId: G,
      index: Math.max(0, $.indexOf(G ?? -1)),
      displayMode: Fe,
      cardSize: $e,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        l + ":progress:" + h.id,
        JSON.stringify(i)
      );
    } catch {
    }
    if (k) return;
    let a = !0;
    const m = window.setTimeout(() => {
      dn(l, h.id, i).catch((w) => {
        a && P(
          "Progress is kept in this browser, but account sync failed. " + (w instanceof Error ? w.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      a = !1, window.clearTimeout(m);
    };
  }, [
    R,
    l,
    h,
    T,
    ne,
    M,
    z,
    G,
    $,
    Fe,
    $e,
    W,
    k,
    f
  ]);
  const ct = re.items.find((i) => i.id === G) ?? null;
  oe && ct && (Ft.current = ct);
  const he = ct ?? (oe ? Ft.current : null), Or = er(le, G), zt = le.size > 0 ? `${le.size} selected video${le.size === 1 ? "" : "s"}` : G == null ? "no video" : "focused video", Q = me((i, a = !0) => {
    i != null && window.requestAnimationFrame(() => {
      const m = at.current.get(i);
      m == null || m.focus({ preventScroll: !0 }), a && (m == null || m.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  H(() => {
    R && !de.current && Q(ee.current);
  }, [R, Q]), H(() => {
    T || !$.length || (ee.current == null || !$.includes(ee.current)) && (ie($[0]), de.current || Q($[0]));
  }, [Q, $, T]);
  const Re = me(
    (i) => {
      fe((a) => {
        const m = i(a);
        for (const w of /* @__PURE__ */ new Set([...a, ...m]))
          a.has(w) !== m.has(w) && be.current.set(
            w,
            (be.current.get(w) ?? 0) + 1
          );
        return m;
      });
    },
    []
  ), dt = me(
    (i) => {
      if (!$.length) return;
      const a = Math.max(
        0,
        $.indexOf(ee.current ?? $[0])
      ), m = $[Math.max(0, Math.min($.length - 1, a + i))];
      ie(m), de.current || Q(m);
    },
    [Q, $]
  ), ut = me(
    async (i) => {
      const a = er(
        rt.current,
        ee.current
      );
      if (!h || _e.current || T || ne || !s || Ge(i) && (U == null ? void 0 : U.kind) !== "ready" || !a.length)
        return;
      const m = ++Ke.current, w = h.id, I = [...$], O = ee.current, j = new Map(
        a.map((K) => [K, be.current.get(K) ?? 0])
      ), x = () => m === Ke.current && h.id === w;
      _e.current = !0, it(!0), ot(
        rt.current.size ? `${a.length} selected videos` : "the focused video"
      ), we(""), Ae("");
      let se = !1;
      try {
        if (await Sn(i, a), se = !0, !x()) return;
        fe((K) => {
          const X = new Set(K);
          for (const te of a)
            (be.current.get(te) ?? 0) === j.get(te) && X.delete(te);
          return X;
        }), we(
          `${i.label}: ${a.length} video${a.length === 1 ? "" : "s"} ${i.steps.length ? "updated" : "skipped"}.`
        );
      } catch (K) {
        if (!x()) return;
        Ae(
          K instanceof Error ? K.message : "Action failed."
        );
      }
      try {
        if (await hn(i), !x()) return;
        const K = await ge(h, z);
        if (!x()) return;
        let X = K.items.map((te) => te.id);
        if (!X.length && K.totalCount > 0 && Number(z.page) > 1) {
          const te = Math.max(1, Number(z.page) - 1), He = { ...z, page: te };
          xe(He), X = (await ge(h, He)).items.map((ft) => ft.id), fe(
            (ft) => new Set([...ft].filter((Ur) => X.includes(Ur)))
          );
          const Gt = X.at(-1) ?? null;
          ie(Gt), de.current || Q(Gt);
        } else {
          fe(
            (He) => new Set([...He].filter((Wt) => X.includes(Wt)))
          );
          const te = Zr(
            I,
            X,
            O,
            se && a.includes(O ?? -1)
          );
          ie(te), de.current && te == null && ye(!1), de.current || Q(te);
        }
      } catch (K) {
        x() && Ae(
          (X) => `${X ? `${X} ` : ""}${se ? "The action completed, but " : ""}the queue could not be refreshed. ${K instanceof Error ? K.message : "Refresh failed."}`
        );
      } finally {
        x() && (_e.current = !1, it(!1), ot(""));
      }
    },
    [
      s,
      U,
      ge,
      z,
      Q,
      $,
      T,
      ne,
      h
    ]
  );
  function Pr() {
    var m;
    const i = (m = Vt.current) == null ? void 0 : m.firstElementChild, a = i ? getComputedStyle(i).gridTemplateColumns : "";
    return Math.max(1, a.split(" ").filter(Boolean).length);
  }
  function Lr(i) {
    if (i.defaultPrevented || i.repeat || i.ctrlKey || i.altKey || i.metaKey || Pt) return;
    if (oe && i.key === "Escape") {
      Y(i), ye(!1), Q(ee.current);
      return;
    }
    if (!tn(i.target)) return;
    if (i.key === "Escape") {
      Y(i), Re(() => /* @__PURE__ */ new Set());
      return;
    }
    const a = (h == null ? void 0 : h.actions.findIndex(
      (I, O) => ke(I, O) === i.key
    )) ?? -1;
    if (a >= 0 && (h != null && h.actions[a])) {
      Y(i), !M && !T && ut(h.actions[a]);
      return;
    }
    if (!oe && i.key === " ") {
      Y(i), G != null && Re((I) => mt(I, G));
      return;
    }
    if (!oe && i.key.toLowerCase() === "a") {
      Y(i), Re(
        (I) => en(I, $)
      );
      return;
    }
    if (M || T || oe) return;
    if (i.key === "Enter" && G != null) {
      Y(i), ye(!0);
      return;
    }
    const m = Pr(), w = i.key === "ArrowLeft" ? -1 : i.key === "ArrowRight" ? 1 : i.key === "ArrowUp" ? -m : i.key === "ArrowDown" ? m : 0;
    w && (Y(i), dt(w));
  }
  function ze(i) {
    _(i), sr(i);
  }
  function Mr() {
    et.current = !0, J({}), ze("");
  }
  async function Qt(i) {
    if (!l) return !1;
    const a = i.map(Fn);
    try {
      await ln(l, a);
    } catch (w) {
      throw w;
    }
    r(a), b && !a.some((w) => w.id === b) && ze("");
    const m = a.find((w) => w.id === b);
    return m && F && JSON.stringify(m) !== JSON.stringify(F) && (m.view.displayMode !== F.view.displayMode && nt(ir(m)), Se(m) !== Se(F) && (Ce(null), Qe(
      m,
      ue({ ...m.view.filter, page: z.page })
    ))), !0;
  }
  if (c)
    return /* @__PURE__ */ n(ar, { label: "Loading reviews…" });
  if (E)
    return /* @__PURE__ */ u(Ne, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Vn().catch(
            (i) => p(
              "Could not export browser reviews. " + (i instanceof Error ? i.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        lr,
        {
          message: E,
          onRetry: () => void Jt()
        }
      )
    ] });
  return /* @__PURE__ */ u("div", { className: "data-quality-page", onKeyDown: Lr, children: [
    /* @__PURE__ */ u("header", { className: "data-quality-header", children: [
      h && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: M,
          onClick: Mr,
          children: /* @__PURE__ */ n(dr, {})
        }
      ),
      /* @__PURE__ */ u("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (h == null ? void 0 : h.name) ?? "Data Quality" }),
        (h == null ? void 0 : h.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: h.description })
      ] }),
      h && F && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: M || T || !C,
          onClick: () => {
            Mt(!0), tt(!0);
          },
          children: /* @__PURE__ */ n(ur, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: M || T || !C,
          onClick: () => {
            Mt(!1), tt(!0);
          },
          children: /* @__PURE__ */ n(Qr, {})
        }
      )
    ] }),
    y && /* @__PURE__ */ n("p", { className: "dq-status", children: y }),
    (U == null ? void 0 : U.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      U.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: je,
          onClick: () => {
            Be(!0), Ue(""), bn().then(Je).catch(
              (i) => Ue(
                "Could not create the Confirmed absent tags custom field. " + (i instanceof Error ? i.message : "Request failed.")
              )
            ).finally(() => Be(!1));
          },
          children: je ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    ((U == null ? void 0 : U.kind) === "incompatible" || jt) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(vt, {}),
      jt || (U == null ? void 0 : U.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: je,
          onClick: () => {
            Be(!0), Je().finally(
              () => Be(!1)
            );
          },
          children: je ? "Checking…" : "Check again"
        }
      )
    ] }),
    o && /* @__PURE__ */ u("details", { children: [
      /* @__PURE__ */ n("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ n("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const i = localStorage.getItem("page-videos") ?? "[]", a = URL.createObjectURL(
              new Blob([i], { type: "application/json" })
            ), m = document.createElement("a");
            m.href = a, m.download = "data-quality-unassigned-legacy-reviews.json", m.click(), URL.revokeObjectURL(a);
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
            P(""), N(!1);
          },
          children: f ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    h && F && /* @__PURE__ */ u("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${M || T ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": M || T || void 0,
          inert: M || T ? !0 : void 0,
          onClickCapture: (i) => {
            var m, w, I, O, j;
            const a = i.target instanceof Element ? i.target.closest("button") : null;
            (a == null ? void 0 : a.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((m = a == null ? void 0 : a.textContent) == null ? void 0 : m.trim()) === "Clear all" ? pe.current = !0 : ((w = a == null ? void 0 : a.getAttribute("aria-label")) != null && w.startsWith("Filters") || (I = a == null ? void 0 : a.getAttribute("aria-label")) != null && I.startsWith("Edit filter:") || ((O = a == null ? void 0 : a.textContent) == null ? void 0 : O.trim()) === "Cancel" || (j = a == null ? void 0 : a.getAttribute("aria-label")) != null && j.startsWith("Close ")) && (pe.current = !1);
          },
          onKeyDownCapture: (i) => {
            var m, w;
            const a = i.target instanceof Element ? i.target.closest("button") : null;
            (i.key === "Delete" || i.key === "Backspace") && (a == null ? void 0 : a.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (i.preventDefault(), i.stopPropagation(), pe.current = !0, (w = (m = a.parentElement) == null ? void 0 : m.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || w.click()) : i.key === "Escape" && (pe.current = !1);
          },
          children: /* @__PURE__ */ n(
            Br,
            {
              filter: ne ? Ar : z,
              onFilterChange: xr,
              totalCount: re.totalCount,
              sortOptions: bt,
              showSearch: !0,
              showSort: !0,
              displayMode: Fe,
              onDisplayModeChange: (i) => nt(or(i)),
              availableDisplayModes: ["grid", "wall"],
              zoomLevel: ($e - 225) / 50,
              onZoomChange: (i) => $t(Math.round(225 + i * 50)),
              cardSizeEntityType: "videos",
              criteriaDefinitions: Tr,
              objectFilter: lt,
              onObjectFilterChange: (i) => {
                if (!M && !T) {
                  const a = Tn(i);
                  Le.current = On(
                    h.view.objectFilter,
                    a,
                    pe.current
                  ), pe.current = !1;
                }
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (W == null ? void 0 : W.id) === b && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n("span", { children: "Temporary queue" }),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: M || T || !C,
            onClick: Fr,
            children: "Save queue to review"
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: M || T,
            onClick: Dr,
            children: "Reset to review defaults"
          }
        )
      ] })
    ] }),
    h ? /* @__PURE__ */ u(Ne, { children: [
      Me.error && /* @__PURE__ */ n("p", { role: "alert", children: Me.error }),
      /* @__PURE__ */ n(
        Cn,
        {
          videos: re.items,
          review: h,
          trees: Me.ids,
          disabled: M || T,
          onChoose: (i) => {
            const a = An(h, i);
            Ce(a), Qe(a, { ...z, page: 1 });
          }
        }
      ),
      st && !oe && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(vt, {}),
        st
      ] }),
      _t && /* @__PURE__ */ n("p", { role: "status", className: "dq-status", children: _t }),
      Ht("top"),
      /* @__PURE__ */ u("div", { className: "dq-workspace", children: [
        /* @__PURE__ */ u("main", { children: [
          T && !re.items.length && /* @__PURE__ */ n(ar, { label: "Loading review queue…" }),
          ne && !T && /* @__PURE__ */ n(
            lr,
            {
              message: ne,
              onRetry: () => void ge(
                h,
                z,
                qr
              ).catch(() => {
              })
            }
          ),
          !T && !ne && !re.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
            /* @__PURE__ */ n(Yt, {}),
            /* @__PURE__ */ n("p", { children: "No videos match this review." })
          ] }),
          !!re.items.length && /* @__PURE__ */ n("div", { ref: Vt, children: /* @__PURE__ */ n(
            "div",
            {
              className: "dq-grid",
              style: {
                "--dq-card-width": `${$e}px`
              },
              children: re.items.map(_r)
            }
          ) })
        ] }),
        /* @__PURE__ */ u("aside", { className: "dq-actions", children: [
          le.size > 0 && /* @__PURE__ */ n("strong", { children: zt }),
          h.actions.map((i, a) => /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              disabled: M || T || !!ne || !s || Ge(i) && (U == null ? void 0 : U.kind) !== "ready" || !Or.length,
              onClick: () => void ut(i),
              children: [
                ke(i, a) && /* @__PURE__ */ n("kbd", { children: ke(i, a) }),
                /* @__PURE__ */ n("span", { children: i.label }),
                /* @__PURE__ */ n("small", { children: i.steps.length ? `${i.steps.length} step(s)` : "Skip" })
              ]
            },
            i.id
          )),
          !h.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
          !s && /* @__PURE__ */ n("p", { children: "Video write permission is required to apply actions." }),
          M && /* @__PURE__ */ u("p", { role: "status", children: [
            /* @__PURE__ */ n(pr, { className: "dq-spin" }),
            " Applying action to",
            " ",
            kr,
            "…"
          ] }),
          /* @__PURE__ */ n("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
        ] })
      ] }),
      Ht("bottom")
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
                  ref: Ot,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ n("p", { children: "Choose a review to open its video queue." }),
              /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                (i) => B[i.id] !== void 0
              ) ? t.some((i) => B[i.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: ae,
                    onChange: (i) => ce(
                      i.target.value
                    ),
                    children: [
                      /* @__PURE__ */ n("option", { value: "name", children: "Name" }),
                      /* @__PURE__ */ n("option", { value: "count", children: "Video count" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  "aria-label": Z === "asc" ? "Ascending" : "Descending",
                  title: Z === "asc" ? "Ascending" : "Descending",
                  onClick: () => Nr(
                    (i) => i === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    fr,
                    {
                      className: Z === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: Cr.map((i) => {
            const a = B[i.id];
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                disabled: M,
                onClick: () => ze(i.id),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ n("strong", { children: i.name }),
                    /* @__PURE__ */ n(
                      "span",
                      {
                        className: "dq-review-count",
                        "aria-label": a === void 0 ? "Counting matching videos" : a === null ? "Matching video count unavailable" : `${a.toLocaleString()} matching ${a === 1 ? "video" : "videos"}`,
                        children: a === void 0 ? "…" : a === null ? "—" : a.toLocaleString()
                      }
                    )
                  ] }),
                  i.description && /* @__PURE__ */ n("span", { className: "dq-review-rule-name", children: i.description })
                ]
              },
              i.id
            );
          }) })
        ]
      }
    ) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(Yt, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    oe && he && h && /* @__PURE__ */ n(
      Un,
      {
        video: he,
        review: h,
        targetLabel: zt,
        pending: M,
        refreshing: T || !!ne,
        error: st,
        canWrite: s,
        assessmentReady: (U == null ? void 0 : U.kind) === "ready",
        selected: le.has(he.id),
        hasPrevious: $.indexOf(he.id) > 0,
        hasNext: $.indexOf(he.id) >= 0 && $.indexOf(he.id) < $.length - 1,
        onToggleSelected: () => Re((i) => mt(i, he.id)),
        onPrevious: () => dt(-1),
        onNext: () => dt(1),
        onClose: () => {
          ye(!1), Q(ee.current);
        },
        onAction: ut
      }
    ),
    Pt && /* @__PURE__ */ n(
      jn,
      {
        reviews: t,
        activeReview: F,
        initialEdit: Lt,
        onSave: Qt,
        onChoose: ze,
        onClose: () => {
          tt(!1), Lt && Q(ee.current, !1);
        }
      }
    )
  ] });
  async function Qe(i, a, m = !1) {
    const w = ee.current, I = Math.max(0, $.indexOf(w ?? -1));
    try {
      const j = (await ge(i, a, m)).items.map((se) => se.id);
      fe(
        (se) => new Set([...se].filter((K) => j.includes(K)))
      );
      const x = Zt(j, w, I);
      ie(x), de.current || Q(x, !1);
    } catch {
    }
  }
  function xr(i) {
    const a = Le.current;
    if (Le.current = null, M || T || !h || !F) return;
    const m = a ?? h.view.objectFilter, w = At(
      m,
      F.view.objectFilter
    ) ? F.view.objectFilter : m, I = ue({ ...i, page: 1 }), O = {
      ...h,
      view: {
        ...h.view,
        filter: I,
        objectFilter: w
      }
    }, j = Se(O) !== Se(F), x = j ? O : F;
    Ce(j ? O : null), we(j ? "" : "Review queue defaults restored."), Qe(x, I);
  }
  function Dr() {
    if (M || T || !F) return;
    Le.current = null;
    const i = ue({
      ...F.view.filter,
      page: 1
    });
    Ce(null), we("Review queue defaults restored."), Qe(
      F,
      i,
      F.view.startFrom !== "beginning"
    );
  }
  function Fr() {
    M || T || !h || !F || !C || Qt(
      t.map(
        (i) => i.id === b ? {
          ...i,
          view: {
            ...h.view,
            filter: { ...z, page: 1 }
          }
        } : i
      )
    ).then(() => {
      Ce(null), we("Queue saved to this review.");
    }).catch(
      (i) => Ae(
        i instanceof Error ? i.message : "Could not save queue."
      )
    );
  }
  function $r() {
    fe(/* @__PURE__ */ new Set()), be.current.clear(), ie(null);
  }
  function Ht(i) {
    return h ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: M || T,
        "aria-label": `Review queue pagination ${i}`,
        children: /* @__PURE__ */ n(
          Kr,
          {
            filter: {
              ...z,
              page: Number(z.page) || 1,
              perPage: Number(z.perPage) || 40
            },
            totalCount: re.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${i}`,
            onFilterChange: (a) => {
              M || T || a.page === Number(z.page) || Dn(
                { ...z, page: a.page },
                h,
                ge,
                $r
              );
            }
          }
        )
      }
    ) : null;
  }
  function _r(i) {
    return /* @__PURE__ */ n(
      $n,
      {
        video: Nn(i, h, Me.ids),
        displayMode: Fe,
        focused: i.id === G,
        selected: le.has(i.id),
        setRef: (a) => {
          a ? at.current.set(i.id, a) : at.current.delete(i.id);
        },
        onFocus: () => ie(i.id),
        onToggle: () => Re((a) => mt(a, i.id)),
        onPreview: () => {
          ie(i.id), ye(!0);
        },
        onNavigate: e
      },
      i.id
    );
  }
}
function Dn(e, t, r, o) {
  o(), r(t, e).catch(() => {
  });
}
function mt(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Fn(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function $n({
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
  const p = Er(e), s = D(null), g = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, C = !!(g.date || g.studioName), A = !!(g.performers.length || g.tags.length);
  return cr(() => {
    const y = s.current;
    if (!y) return;
    const q = y.querySelector(
      `a[href="/video/${e.id}"]`
    ), k = y.querySelector(".card-title"), P = `dq-card-title-${e.id}`;
    k && (k.id = P), q && (q.target = "_blank", q.rel = "noreferrer", q.removeAttribute("aria-label"), q.setAttribute("aria-labelledby", P), q.classList.add("dq-card-link"));
    const f = y.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    f && f.setAttribute(
      "aria-label",
      o ? `Deselect ${p}` : `Select ${p}`
    );
    const N = y.querySelector(
      'button[title="Quick View"]'
    );
    N && N.setAttribute("aria-label", `Preview ${p}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (y) => {
        s.current = y, l(y);
      },
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${p}${o ? ", selected" : ""}`,
      onFocus: d,
      onClick: (y) => {
        d(), y.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${t} ${C ? "has-card-metadata" : "no-card-metadata"} ${A ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          Jr,
          {
            video: g,
            selected: o,
            onSelect: c,
            onNavigate: E,
            onQuickView: v,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t === "wall" && /* @__PURE__ */ n(_n, { video: e })
      ]
    }
  );
}
function _n({ video: e }) {
  const t = D(null), r = D(null), [o, l] = S(!1), [d, c] = S(!1), [v, E] = S(!1);
  return H(() => {
    const p = t.current;
    if (!p || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      l(!0), c(!0);
      return;
    }
    const s = new IntersectionObserver(
      ([C]) => l(C.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), g = new IntersectionObserver(
      ([C]) => c(C.isIntersecting && C.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return s.observe(p), g.observe(p), () => {
      s.disconnect(), g.disconnect();
    };
  }, [e.id, e.files.length]), H(() => {
    if (!o) {
      E(!1);
      return;
    }
    const p = new AbortController();
    return V(gn(e.id), {
      signal: p.signal
    }).then((s) => {
      p.signal.aborted || E(s.available === !0);
    }).catch(() => {
      p.signal.aborted || E(!1);
    }), () => p.abort();
  }, [o, e.id]), H(() => {
    const p = r.current;
    p && (d ? Promise.resolve(p.play()).catch(() => {
    }) : p.pause());
  }, [v, d]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: v && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: pn(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Un({
  video: e,
  review: t,
  targetLabel: r,
  pending: o,
  refreshing: l,
  error: d,
  canWrite: c,
  assessmentReady: v,
  selected: E,
  hasPrevious: p,
  hasNext: s,
  onToggleSelected: g,
  onPrevious: C,
  onNext: A,
  onClose: y,
  onAction: q
}) {
  const k = D(null), P = D(null), f = e.files[0], N = Er(e);
  H(() => {
    var _;
    const b = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (_ = k.current) == null || _.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = b;
    };
  }, []);
  function R(b) {
    var J, ae, ce;
    if (b.key !== "Tab") return;
    const _ = [
      ...((J = k.current) == null ? void 0 : J.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((Z) => Z.offsetParent !== null);
    if (!_.length) {
      b.preventDefault(), (ae = k.current) == null || ae.focus();
      return;
    }
    const B = _.indexOf(
      document.activeElement
    );
    b.shiftKey && B <= 0 ? (b.preventDefault(), (ce = _.at(-1)) == null || ce.focus()) : !b.shiftKey && B === _.length - 1 && (b.preventDefault(), _[0].focus());
  }
  function L(b) {
    if (b.defaultPrevented || b.ctrlKey || b.metaKey || b.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const _ = b.key === "ArrowLeft" || b.key === "ArrowRight";
    if (b.altKey && !_) return;
    const B = P.current, J = b.currentTarget.querySelector("video");
    if (b.key === "Enter" || b.key === "Escape")
      b.repeat || y();
    else if (b.key === " " && B)
      b.repeat || B.toggle();
    else if (_ && B)
      B.seekBy(
        (b.key === "ArrowLeft" ? -1 : 1) * (b.shiftKey ? 5 : b.altKey ? 10 : 60)
      );
    else if ((b.key === "," || b.key === ".") && B) {
      const ae = [f == null ? void 0 : f.duration, J == null ? void 0 : J.duration].find(
        (Z) => Z != null && Number.isFinite(Z) && Z > 0
      ) ?? 0, ce = e.parentVideoId != null ? (e.clipEndSec ?? ae) - (e.clipStartSec ?? 0) : ae;
      Number.isFinite(ce) && ce > 0 && B.seekBy((b.key === "," ? -1 : 1) * ce * 0.1);
    } else if (b.key.toLowerCase() === "n" || b.key.toLowerCase() === "m")
      !b.repeat && !o && !l && (b.key.toLowerCase() === "n" && p && C(), b.key.toLowerCase() === "m" && s && A());
    else if (b.key === "ArrowUp" && J)
      J.volume = Math.min(1, J.volume + 0.1);
    else if (b.key === "ArrowDown" && J)
      J.volume = Math.max(0, J.volume - 0.1);
    else return;
    Y(b);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: k,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${N}`,
      className: "dq-preview",
      onKeyDown: R,
      onKeyDownCapture: L,
      onMouseDown: (b) => {
        b.target === b.currentTarget && y();
      },
      children: /* @__PURE__ */ u("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ u("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !p || o || l,
              onClick: C,
              children: /* @__PURE__ */ n(dr, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !s || o || l,
              onClick: A,
              children: /* @__PURE__ */ n(fr, {})
            }
          ),
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: N }),
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
              onClick: g,
              disabled: l,
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
              children: /* @__PURE__ */ n(Hr, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: y,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(gr, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: f ? /* @__PURE__ */ n(
          Vr,
          {
            autostart: !0,
            streamUrl: fn(e.id),
            posterUrl: rr(e),
            format: f.format,
            audioCodec: f.audioCodec,
            duration: f.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (b) => (P.current = b, () => {
              P.current === b && (P.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: rr(e), alt: "" }) }),
        d && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: d }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((b, _) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: o || l || !c || Ge(b) && !v,
            onClick: () => void q(b),
            children: [
              ke(b, _) && /* @__PURE__ */ n("kbd", { children: ke(b, _) }),
              b.label
            ]
          },
          b.id
        )) })
      ] })
    }
  );
}
function jn({
  reviews: e,
  activeReview: t,
  initialEdit: r = !1,
  onSave: o,
  onChoose: l,
  onClose: d
}) {
  const [c, v] = S(
    () => r && t ? structuredClone(t) : null
  ), [E, p] = S(""), [s, g] = S(!1), C = D(null);
  H(() => {
    var R, L;
    const f = document.activeElement, N = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (L = (R = C.current) == null ? void 0 : R.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || L.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = N, f == null || f.focus({ preventScroll: !0 });
    };
  }, []);
  function A(f) {
    var L, b, _;
    if (f.defaultPrevented) {
      f.stopPropagation();
      return;
    }
    if (f.key === "Escape") {
      Y(f), s || d();
      return;
    }
    if (f.key !== "Tab") {
      f.stopPropagation();
      return;
    }
    const N = [
      ...((L = C.current) == null ? void 0 : L.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((B) => B.offsetParent !== null);
    if (!N.length) {
      Y(f), (b = C.current) == null || b.focus();
      return;
    }
    const R = N.indexOf(
      document.activeElement
    );
    f.shiftKey && R <= 0 ? (Y(f), (_ = N.at(-1)) == null || _.focus()) : !f.shiftKey && R === N.length - 1 ? (Y(f), N[0].focus()) : f.stopPropagation();
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
    ), p("");
  }
  async function q() {
    if (s) return;
    if (!c || St(c)) {
      p(c ? St(c) : "Choose a review.");
      return;
    }
    const f = { ...c, name: c.name.trim() }, N = e.some((R) => R.id === f.id) ? e.map((R) => R.id === f.id ? f : R) : [...e, f];
    g(!0), p("");
    try {
      if (!await o(N)) throw new Error("Could not save reviews.");
      l(f.id), d();
    } catch (R) {
      p(
        "Could not save reviews. Your edits are still open. " + (R instanceof Error ? R.message : "Retry saving.")
      );
    } finally {
      g(!1);
    }
  }
  async function k(f) {
    if (!s) {
      g(!0), p("");
      try {
        if (!await o(f)) throw new Error("Could not save reviews.");
      } catch (N) {
        p(
          N instanceof Error ? N.message : "Could not save reviews."
        );
      } finally {
        g(!1);
      }
    }
  }
  async function P(f) {
    var R;
    if (s) return;
    const N = (R = f.target.files) == null ? void 0 : R[0];
    if (f.target.value = "", !!N) {
      if (N.size > 2e6) {
        p("Review files must be smaller than 2 MB.");
        return;
      }
      g(!0), p("");
      try {
        const L = Te(await N.text());
        if (!await o(Et(e, L)))
          throw new Error("Could not save reviews.");
      } catch (L) {
        p(
          L instanceof Error ? L.message : "Could not import reviews."
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
      children: /* @__PURE__ */ u("div", { className: "dq-manager", children: [
        /* @__PURE__ */ u("header", { children: [
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: c ? e.some((f) => f.id === c.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: s,
              onClick: d,
              children: /* @__PURE__ */ n(gr, {})
            }
          )
        ] }),
        E && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: E }),
        /* @__PURE__ */ n("fieldset", { disabled: s, className: "dq-manager-content", children: c ? /* @__PURE__ */ n(
          Bn,
          {
            draft: c,
            saving: s,
            setDraft: v,
            onSave: () => void q(),
            onCancel: d
          }
        ) : /* @__PURE__ */ u(Ne, { children: [
          /* @__PURE__ */ u("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ u(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => y(),
                children: [
                  /* @__PURE__ */ n(Wr, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ u("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(Gr, {}),
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
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((f) => /* @__PURE__ */ u("article", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ n("strong", { children: f.name }),
              /* @__PURE__ */ n("p", { children: f.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => y(f), children: [
              /* @__PURE__ */ n(ur, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
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
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${f.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${f.name}”?`) && k(
                    e.filter((N) => N.id !== f.id)
                  );
                },
                children: /* @__PURE__ */ n(hr, {})
              }
            )
          ] }, f.id)) })
        ] }) })
      ] })
    }
  );
}
function Bn({
  draft: e,
  saving: t = !1,
  setDraft: r,
  onSave: o,
  onCancel: l
}) {
  const [d, c] = S("Review"), v = D(/* @__PURE__ */ new WeakMap()), E = (s) => {
    let g = v.current.get(s);
    return g || (g = crypto.randomUUID(), v.current.set(s, g)), g;
  }, p = (s, g) => r({
    ...e,
    actions: e.actions.map(
      (C, A) => A === s ? g : C
    )
  });
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      zr,
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
    /* @__PURE__ */ u("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ u("section", { hidden: d !== "Review", className: "dq-editor-section", children: [
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
              onChange: (s) => r({ ...e, name: s.target.value })
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
              onChange: (s) => r({ ...e, description: s.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n("section", { hidden: d !== "Queue", className: "dq-editor-section", children: /* @__PURE__ */ n(nr, { draft: e, onChange: r, presentation: !1 }) }),
      /* @__PURE__ */ n("section", { hidden: d !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(nr, { draft: e, onChange: r, queue: !1 }) }),
      /* @__PURE__ */ u("section", { hidden: d !== "Actions", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Actions" }),
        /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
        /* @__PURE__ */ n(
          Xt,
          {
            items: e.actions,
            getKey: (s) => s.id,
            disabled: t,
            className: "dq-sortable-list",
            onReorder: (s) => r({ ...e, actions: s }),
            renderItem: (s, { index: g, dragHandleProps: C, isOver: A }) => /* @__PURE__ */ u(
              "fieldset",
              {
                className: A ? "dq-action-card dq-drag-over" : "dq-action-card",
                children: [
                  /* @__PURE__ */ u("legend", { children: [
                    "Action ",
                    g + 1
                  ] }),
                  /* @__PURE__ */ u("div", { className: "dq-action-heading", children: [
                    /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        ...C,
                        disabled: t,
                        className: "dq-drag-handle",
                        "aria-label": `Reorder action ${g + 1}`,
                        children: /* @__PURE__ */ n(mr, {})
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
                  /* @__PURE__ */ u("div", { className: "dq-field-grid", children: [
                    /* @__PURE__ */ u("label", { children: [
                      "Shortcut",
                      /* @__PURE__ */ u(
                        "select",
                        {
                          value: s.shortcut ?? "auto",
                          onChange: (y) => p(g, {
                            ...s,
                            shortcut: y.target.value === "auto" ? void 0 : y.target.value
                          }),
                          children: [
                            /* @__PURE__ */ u("option", { value: "auto", children: [
                              "Position (",
                              g < 9 ? g + 1 : "none",
                              ")"
                            ] }),
                            /* @__PURE__ */ n("option", { value: "", children: "None" }),
                            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((y) => /* @__PURE__ */ n("option", { value: y, children: y }, y))
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ u("label", { children: [
                      "Button label",
                      /* @__PURE__ */ n(
                        "input",
                        {
                          value: s.label,
                          onChange: (y) => p(g, {
                            ...s,
                            label: y.target.value
                          })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ n(
                    Xt,
                    {
                      items: s.steps,
                      getKey: E,
                      disabled: t,
                      className: "dq-sortable-list",
                      onReorder: (y) => p(g, { ...s, steps: y }),
                      renderItem: (y, { index: q, dragHandleProps: k, isOver: P }) => /* @__PURE__ */ n(
                        Kn,
                        {
                          dragHandleProps: k,
                          saving: t,
                          isOver: P,
                          step: y,
                          index: q,
                          onChange: (f) => {
                            v.current.set(f, E(y)), p(g, {
                              ...s,
                              steps: s.steps.map(
                                (N, R) => R === q ? f : N
                              )
                            });
                          },
                          onRemove: () => p(g, {
                            ...s,
                            steps: s.steps.filter(
                              (f, N) => N !== q
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
                            (y, q) => q !== g
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
    /* @__PURE__ */ u("div", { className: "dq-editor-footer", children: [
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
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: l, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: o, children: "Save review" })
    ] })
  ] });
}
function Kn({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: o,
  isOver: l,
  onChange: d,
  onRemove: c
}) {
  return /* @__PURE__ */ u("div", { className: l ? "dq-action-step dq-drag-over" : "dq-action-step", children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        ...r,
        disabled: o,
        className: "dq-drag-handle",
        "aria-label": `Reorder step ${t + 1}`,
        children: /* @__PURE__ */ n(mr, {})
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
      wt,
      {
        entityType: "tag",
        values: e.tagIds,
        onChange: (v) => d({ ...e, tagIds: v }),
        placeholder: "Choose tags",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: c, children: /* @__PURE__ */ n(hr, {}) })
  ] });
}
async function Vn() {
  const e = await V("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
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
function ar({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(pr, { className: "dq-spin" }),
    e
  ] });
}
function lr({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(vt, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const Gn = { components: { DataQualityPage: xn } };
export {
  xn as DataQualityPage,
  Gn as default,
  At as objectFiltersEqual
};
