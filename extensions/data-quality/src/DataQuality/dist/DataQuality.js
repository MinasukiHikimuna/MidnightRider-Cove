import { jsxs as f, jsx as n, Fragment as Ee } from "react/jsx-runtime";
import { useState as S, useEffect as z, useMemo as He, useRef as _, useCallback as he, useLayoutEffect as Or } from "react";
import { VIDEO_SORT_OPTIONS as ht, FilterDialog as Tr, VIDEO_CRITERIA as mt, EntityReferenceMultiSelector as yt, DetailListToolbar as Pr, DetailListPagination as Lr, VideoPlayer as Mr, VideoCard as xr, EntityDetailTabs as Dr, SortableList as zt } from "@cove/runtime/components";
import { ChevronLeft as ir, Pencil as or, Settings as Fr, AlertTriangle as bt, ChevronRight as sr, Film as Qt, Loader2 as ar, ExternalLink as $r, X as lr, Plus as _r, Upload as Ur, Trash2 as cr, GripVertical as dr } from "@cove/runtime/lucide-react";
import { extensionFetch as jr } from "@cove/runtime/api";
function Ie(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function wt(e) {
  if (e.actions.some(ur))
    return "An action cannot contain contradictory assessments for the same tag.";
  if (!e.name.trim() || !e.actions.every(Ct))
    return "Name the review and complete every action step before saving.";
  if (new Set(e.actions.map((r) => r.id)).size !== e.actions.length)
    return "Action IDs must be unique within a review.";
  const t = e.actions.map(
    (r, o) => r.shortcut ?? (o < 9 ? String(o + 1) : "")
  ).filter(Boolean);
  return t.some((r) => !/^[1-9]$/.test(r)) || new Set(t).size !== t.length ? "Assign each shortcut 1–9 only once, or choose None. Navigation and player keys are reserved." : "";
}
function de(e) {
  const t = (r, o) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : o;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(1e3, t(e.perPage, 40)))
  };
}
function Ht(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function ve(e) {
  const { page: t, ...r } = e.view.filter;
  return JSON.stringify([
    r,
    e.view.objectFilter,
    e.view.searchMode
  ]);
}
function Ct(e) {
  return !!e.label.trim() && e.steps.every(
    (t) => [
      "ADD",
      "REMOVE",
      "REMOVE_TREE",
      "MARK_PRESENT",
      "MARK_ABSENT",
      "CLEAR_ABSENCE"
    ].includes(t.mode) && t.tagIds.length > 0 && t.tagIds.every((r) => Number.isSafeInteger(r) && r > 0)
  ) && !ur(e);
}
function Ge(e) {
  return e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  );
}
function ur(e) {
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
function ke(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Kr(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (o) => typeof o == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (o) => typeof (o == null ? void 0 : o.id) == "string" && typeof o.label == "string" && (o.shortcut === void 0 || typeof o.shortcut == "string") && Array.isArray(o.steps) && o.steps.every((a) => a && Array.isArray(a.tagIds)) && Ct(o)
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => wt(r)))
    throw new Error(
      "Saved reviews contain invalid actions or shortcuts. Existing data has been kept; assign shortcuts 1–9 only once or leave them empty."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Kr(e) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.cardSize === void 0 || t.cardSize === null || Number.isFinite(t.cardSize) && t.cardSize >= 115 && t.cardSize <= 380) && (t.annotations === void 0 || Array.isArray(t.annotations) && t.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [t.annotationParents, t.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0)
  );
}
function vt(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const o of e)
    for (const a of o)
      r.has(a.id) || (r.add(a.id), t.push(a));
  return t;
}
function Wt(e, t) {
  return e.size > 0 ? [...e].sort((r, o) => r - o) : t == null ? [] : [t];
}
function Br(e, t, r, o) {
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
function Jr(e, t) {
  const r = new Set(e), o = t.length > 0 && t.every((a) => r.has(a));
  for (const a of t)
    o ? r.delete(a) : r.add(a);
  return r;
}
function Vr(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const fr = "ext:com.midnightrider.data-quality:configuration", zr = "ext:cove-data-quality:video-reviews", St = "ext:com.midnightrider.data-quality:progress", Oe = /* @__PURE__ */ new Map(), We = /* @__PURE__ */ new Map(), ut = (e, t) => e.includes("*") || e.includes(t), Xe = (e) => U(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Qr = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Et(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Se(e) {
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
    reviews: ke(JSON.stringify(t.reviews)),
    deletedIds: Et(t.deletedIds),
    importedIds: Et(t.importedIds)
  };
}
function Hr(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const o = /* @__PURE__ */ new Set();
  for (const a of t) {
    const d = localStorage.getItem(a);
    if (d !== null) {
      const c = ke(d);
      r ?? (r = c), c.forEach((v) => o.add(v.id));
    }
    Et(
      JSON.parse(localStorage.getItem(`${a}:account-imports`) ?? "[]")
    ).forEach((c) => o.add(c));
  }
  return {
    reviews: r ?? [],
    known: [...o],
    present: r !== void 0
  };
}
async function pr(e) {
  const t = await U("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function gr(e, t) {
  const r = (We.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return We.set(e, r), r.finally(() => {
    We.get(e) === r && We.delete(e);
  }).catch(() => {
  }), r;
}
let Re = null;
function Wr() {
  if (Re) return Re;
  const e = Gr();
  return Re = e, e.finally(() => {
    Re === e && (Re = null);
  }).catch(() => {
  }), e;
}
async function Gr() {
  var C;
  const e = await U("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, o = ut(e.permissions, "savedfilters.read"), a = o && ut(e.permissions, "savedfilters.write"), d = o ? (await Xe(fr)).filter((A) => A.name === "Data Quality configuration").sort((A, b) => A.id - b.id) : [];
  if (d.length > 1) {
    const A = (b) => {
      const { revision: R, ...k } = Se(b.uiOptions);
      return JSON.stringify(k);
    };
    if (d.some((b) => A(b) !== A(d[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (a)
      for (const b of d.slice(1))
        await U(`/api/savedfilters/${b.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${b.id}` })
        });
    d.splice(1);
  }
  let c = d.length ? Se(d[0].uiOptions) : Qr();
  const v = localStorage.getItem(`${r}:migrated`) === "true", E = localStorage.getItem(r), p = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && E && (c = Se(E));
  let s = !d.length;
  if (d.length && p && E) {
    const A = Se(E);
    if (A.reviews.some((R) => {
      const k = c.reviews.find((P) => P.id === R.id);
      return k && JSON.stringify(k) !== JSON.stringify(R);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const b = [
      .../* @__PURE__ */ new Set([...c.deletedIds, ...A.deletedIds])
    ];
    c = {
      ...c,
      reviews: vt(c.reviews, A.reviews).filter(
        (R) => !b.includes(R.id)
      ),
      deletedIds: b,
      importedIds: [
        .../* @__PURE__ */ new Set([...c.importedIds, ...A.importedIds])
      ]
    }, s = !0;
  }
  if (!v) {
    const A = JSON.stringify(c), b = Hr(t);
    if (d.length && b.reviews.some((u) => {
      const N = c.reviews.find((q) => q.id === u.id);
      return N && JSON.stringify(N) !== JSON.stringify(u);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const R = o ? (await Xe(zr)).flatMap(
      (u) => ke(u.uiOptions ?? "[]")
    ) : [], k = b.known.filter(
      (u) => !b.reviews.some((N) => N.id === u)
    ), P = /* @__PURE__ */ new Set([...c.deletedIds, ...k]);
    c = {
      ...c,
      reviews: vt(
        b.reviews,
        c.reviews,
        R.filter(
          (u) => !b.known.includes(u.id) && !c.importedIds.includes(u.id)
        )
      ).filter((u) => !P.has(u.id)),
      deletedIds: [...P],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...c.importedIds,
          ...b.known,
          ...R.map((u) => u.id)
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
    d.length && (g.config = Se(d[0].uiOptions)), await hr(r, A), c = g.config;
  } else d.length || (localStorage.setItem(r, JSON.stringify(c)), !o && (!v || p) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!o) localStorage.setItem(`${r}:migrated`, "true");
  else if (a)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: c.reviews,
    storageKey: r,
    canWrite: ut(e.permissions, "videos.write"),
    canConfigure: !o || a,
    storageNotice: o ? a ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function hr(e, t) {
  const r = Oe.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const o = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await pr(r), r.recordId != null) {
      const d = await U(
        `/api/savedfilters/${r.recordId}`
      );
      if (Se(d.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const a = await U(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: fr,
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
function Xr(e, t) {
  return ke(JSON.stringify(t)), gr(e, async () => {
    const r = Oe.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const o = r.config.reviews.filter((a) => !t.some((d) => d.id === a.id)).map((a) => a.id);
    await hr(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...o])
      ].filter((a) => !t.some((d) => d.id === a))
    });
  });
}
function Gt(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Yr(e, t) {
  const r = Oe.get(e);
  if (!r) return null;
  const o = localStorage.getItem(`${e}:progress:${t}`), a = o ? Gt(o) : null;
  if (!r.readable) return a;
  const d = (await Xe(St)).find(
    (v) => v.name === t
  ), c = d ? Gt(d.uiOptions) : null;
  return a && (!c || a.updatedAt > c.updatedAt) ? a : c;
}
function Zr(e, t, r) {
  const o = `${e}:progress:${t}`;
  try {
    localStorage.setItem(o, JSON.stringify(r));
  } catch {
  }
  return gr(o, async () => {
    const a = Oe.get(e);
    if (!(a != null && a.writable)) return;
    await pr(a);
    const d = (await Xe(St)).find(
      (c) => c.name === t
    );
    await U(
      d ? `/api/savedfilters/${d.id}` : "/api/savedfilters",
      {
        method: d ? "PUT" : "POST",
        body: JSON.stringify({
          mode: St,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Te = "confirmed_absent_tags", At = "Confirmed absent tags", en = {
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
      t === "modifier" && typeof r == "string" ? en[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === Te.toLowerCase() ? r.toLowerCase() : Ye(r)
    ])
  ) : e;
}
async function U(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const o = await jr(e, { ...t, headers: r });
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
async function ft(e, t, r) {
  const o = { ...e.view.objectFilter }, a = o._filterExpression;
  if (delete o._filterExpression, delete o.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return U("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Ye({
        findFilter: de(t),
        objectFilter: o,
        filterExpression: a
      })
    )
  });
}
function tn(e) {
  return `/api/stream/video/${e}`;
}
function Xt(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function rn(e) {
  return `/api/stream/video/${e}/preview`;
}
function nn(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function on(e) {
  return e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function qt(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await U(`/api/tags/${r}`), t.add(r);
    for (let o = 1; ; o++) {
      const a = await U("/api/tags/find", {
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
function sn(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${Te} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function Rt() {
  const t = (await U("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === Te.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${At} custom field before applying tag assessments.`
    };
  const r = sn(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function an() {
  const e = await Rt();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await U("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: Te,
        label: At,
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
function ln(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${Te} value is not a valid tag list.`
    );
  return Ze(e);
}
function cn(e) {
  return Ze(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function dn(e, t) {
  let r;
  try {
    r = await Rt();
  } catch (p) {
    throw new Error(
      `Could not verify the ${At} custom field. ${p instanceof Error ? p.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const o = await Promise.all(
    e.steps.map(async (p) => ({
      ...p,
      tagIds: p.mode === "REMOVE_TREE" ? await qt(p.tagIds) : Ze(p.tagIds)
    }))
  ), a = o.filter(
    (p) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(p.mode)
  ), d = o.filter(
    (p) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(p.mode)
  ), c = Ze(t), v = r.definition.key;
  let E = 0;
  for (const p of c)
    try {
      const s = await U(`/api/videos/${p}`), g = cn(s), C = { ...s.customFields ?? {} }, A = C[v], b = ln(A), R = new Set(g), k = new Set(b);
      for (const q of a)
        for (const L of q.tagIds)
          q.mode === "ADD" ? R.add(L) : R.delete(L);
      for (const q of d)
        for (const L of q.tagIds)
          q.mode === "MARK_PRESENT" ? (R.add(L), k.delete(L)) : q.mode === "MARK_ABSENT" ? (R.delete(L), k.add(L)) : k.delete(L);
      const P = [...R], u = [...k];
      JSON.stringify(g) === JSON.stringify(P) && JSON.stringify(b) === JSON.stringify(u) && (A === void 0 ? u.length === 0 : JSON.stringify(A) === JSON.stringify(b)) || await U(`/api/videos/${p}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: P,
          customFields: {
            ...C,
            [v]: u
          }
        })
      }), E++;
    } catch (s) {
      throw new Error(
        `Assessment stopped after ${E} video${E === 1 ? "" : "s"} completed; video ${p} was affected. Refresh and inspect it before retrying. ${s instanceof Error ? s.message : "Request failed."}`
      );
    }
}
async function un(e, t) {
  if (!Ct(e) || t.length === 0 || t.some((o) => !Number.isSafeInteger(o) || o <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (Ge(e)) {
    await dn(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (o) => ({
      mode: o.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: o.mode === "REMOVE_TREE" ? await qt(o.tagIds) : o.tagIds
    }))
  );
  for (let o = 0; o < r.length; o++)
    try {
      await U("/api/videos/bulk", {
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
function fn(e) {
  var v, E, p;
  const [t, r] = S({}), [o, a] = S(""), d = (((v = e == null ? void 0 : e.presentation) == null ? void 0 : v.annotations) ?? []).includes("tags") ? ((E = e == null ? void 0 : e.presentation) == null ? void 0 : E.annotationParents) ?? [] : [], c = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...d,
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return z(() => {
    let s = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(c).map(
        async (g) => [g, await qt([g])]
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
function pn(e, t, r) {
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
        (v) => {
          var E;
          return v !== c.id && ((E = r[v]) == null ? void 0 : E.includes(c.id));
        }
      )
    ) : []
  };
}
function gn({
  videos: e,
  review: t,
  trees: r,
  disabled: o,
  onChoose: a
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
function hn(e, t) {
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
function Yt({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: o = !0
}) {
  const [a, d] = S(!1), c = e.view.filter, v = (s) => t({
    ...e,
    view: { ...e.view, filter: { ...c, ...s } }
  }), E = e.presentation ?? {}, p = (s) => t({ ...e, presentation: { ...E, ...s } });
  return /* @__PURE__ */ f(Ee, { children: [
    o && /* @__PURE__ */ f("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ f("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(c.q ?? ""),
            onChange: (s) => v({ q: s.target.value })
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
              onChange: (s) => v({ sort: s.target.value, sorts: void 0 }),
              children: [
                !ht.some((s) => s.value === c.sort) && c.sort != null && /* @__PURE__ */ n("option", { value: String(c.sort), children: String(c.sort) }),
                ht.map((s) => /* @__PURE__ */ n("option", { value: s.value, children: s.label }, s.value))
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
              onChange: (s) => v({ direction: s.target.value }),
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
              onChange: (s) => v({
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
        Tr,
        {
          open: !0,
          onClose: () => d(!1),
          criteria: mt,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: !0,
          subjectLabel: "videos",
          onApply: (s) => {
            t({ ...e, view: { ...e.view, objectFilter: s } }), d(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ f(Ee, { children: [
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
      (E.annotations ?? []).includes("tags") && /* @__PURE__ */ f(Ee, { children: [
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
        /* @__PURE__ */ n(
          yt,
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
        yt,
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
const mn = {
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
function It(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function yn(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function bn(e) {
  return [
    ...new Set(
      It(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function wn(e, t) {
  const r = It(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((o) => {
      const a = String(o.key ?? ""), d = mn[String(o.modifier ?? "EQUALS")], c = (g, C) => String(C ?? "").trim() || t[String(g)] || String(g ?? ""), v = c(
        o.value,
        o.displayValue
      ), E = c(
        o.value2,
        o.displayValue2
      ), p = String(o.modifier ?? "EQUALS"), s = p === "IS_NULL" || p === "NOT_NULL" ? [] : p === "BETWEEN" || p === "NOT_BETWEEN" ? [v, "and", E] : [v];
      return {
        ...o,
        label: [yn(a), d, ...s].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function vn(e) {
  const t = It(e.customFieldCriteria);
  return t.length ? {
    ...e,
    customFieldCriteria: t.map(
      ({ label: r, ...o }) => o
    )
  } : e;
}
function Sn(e, t, r) {
  return r || "customFieldCriteria" in t || !Array.isArray(e.customFieldCriteria) ? t : { ...t, customFieldCriteria: e.customFieldCriteria };
}
const pt = 180, En = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function Zt(e) {
  return e.view.displayMode === "wall" ? "wall" : "grid";
}
function er(e) {
  return e === "wall" ? "wall" : "grid";
}
function Nn() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function tr(e) {
  const t = new URLSearchParams(window.location.search);
  e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function Cn(e) {
  return de({ ...e, page: 1 });
}
function Nt(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((c, v) => Nt(c, t[v]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, o = t, a = Object.keys(r).sort(), d = Object.keys(o).sort();
  return a.length === d.length && a.every(
    (c, v) => c === d[v] && Nt(r[c], o[c])
  );
}
function mr(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Y(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
function An({
  onNavigate: e
}) {
  const [t, r] = S([]), [o] = S(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [a, d] = S(""), [c, v] = S(!0), [E, p] = S(""), [s, g] = S(!1), [C, A] = S(!0), [b, R] = S(""), [k, P] = S(""), [u, N] = S(!1), [q, L] = S(!1), [y, D] = S(Nn), [Q, B] = S({}), [se, te] = S(!1), [ae, kt] = S(!1), [W, Ne] = S(
    null
  ), F = t.find((i) => i.id === y) ?? null, h = He(
    () => (W == null ? void 0 : W.id) === y && F ? { ...F, view: W.view } : F,
    [W, y, F]
  ), Pe = _(
    null
  ), Le = fn(h), [j, Me] = S({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [yr, br] = S({
    page: 1,
    perPage: 40
  }), [re, Ot] = S({ items: [], totalCount: 0 }), [O, xe] = S(!1), [ne, Tt] = S(""), [le, ue] = S(() => /* @__PURE__ */ new Set()), et = _(le);
  et.current = le;
  const me = _(/* @__PURE__ */ new Map()), [G, ie] = S(null), Z = _(G);
  Z.current = G;
  const [oe, ye] = S(!1), ce = _(oe);
  ce.current = oe;
  const Pt = _(null), [De, tt] = S("grid"), [Fe, Lt] = S(pt), [M, rt] = S(!1), $e = _(!1), [wr, nt] = S(""), [Mt, be] = S(""), [it, Ce] = S(""), [$, xt] = S(null), [Dt, _e] = S(""), [Ue, je] = S(!1), [Ft, $t] = S({}), ot = _(/* @__PURE__ */ new Map()), _t = _(null), we = _(0), Ke = _(0), Be = _(null), fe = _(!1);
  z(() => {
    const i = h ? bn(h.view.objectFilter) : [];
    if ($t({}), !i.length) return;
    const l = new AbortController();
    let m = !0;
    return Promise.all(
      i.map(async (w) => {
        var T;
        try {
          const I = await U(`/api/tags/${w}`, {
            signal: l.signal
          });
          return (T = I.name) != null && T.trim() ? [String(w), I.name] : null;
        } catch {
          return null;
        }
      })
    ).then((w) => {
      m && $t(
        Object.fromEntries(w.filter((T) => T !== null))
      );
    }), () => {
      m = !1, l.abort();
    };
  }, [h == null ? void 0 : h.id, h == null ? void 0 : h.view.objectFilter]);
  const st = He(
    () => h ? wn(
      h.view.objectFilter,
      Ft
    ) : {},
    [Ft, h]
  ), vr = He(
    () => Array.isArray(st.customFieldCriteria) ? [...mt, En] : mt,
    [st.customFieldCriteria]
  ), Ut = he(async () => {
    v(!0), p("");
    try {
      const i = await Wr();
      r(i.reviews), d(i.storageKey), g(i.canWrite), A(i.canConfigure ?? !0), R(i.storageNotice ?? ""), y && !i.reviews.some((l) => l.id === y) && (D(""), tr(""));
    } catch (i) {
      p(
        i instanceof Error ? i.message : "Could not load reviews."
      );
    } finally {
      v(!1);
    }
  }, [y]);
  z(() => {
    Ut();
  }, []), z(() => {
    if (y || t.length === 0) return;
    const i = new AbortController();
    B({});
    for (const l of t)
      ft(
        l,
        de({ ...l.view.filter, page: 1, perPage: 1 }),
        i.signal
      ).then((m) => {
        i.signal.aborted || B((w) => ({
          ...w,
          [l.id]: m.totalCount
        }));
      }).catch(() => {
        i.signal.aborted || B((m) => ({ ...m, [l.id]: null }));
      });
    return () => i.abort();
  }, [y, t]);
  const Je = he(async () => {
    _e("");
    try {
      xt(await Rt());
    } catch (i) {
      xt(null), _e(
        "Tag assessment setup could not be checked. " + (i instanceof Error ? i.message : "Request failed.")
      );
    }
  }, []);
  z(() => {
    Je();
  }, [Je]);
  const pe = he(
    async (i, l) => {
      var T;
      const m = ++we.current;
      (T = Be.current) == null || T.abort();
      const w = new AbortController();
      Be.current = w, l = de(l), Me(l), xe(!0), Tt("");
      try {
        let I = await ft(
          i,
          l,
          w.signal
        );
        const K = Math.max(
          1,
          Math.ceil(I.totalCount / Number(l.perPage))
        );
        return Number(l.page) > K && (l = { ...l, page: K }, I = await ft(
          i,
          l,
          w.signal
        )), m === we.current && (Ot(I), Me(l), br(l)), I;
      } catch (I) {
        throw m === we.current && Tt(
          I instanceof Error ? I.message : "Could not load the review queue."
        ), I;
      } finally {
        m === we.current && xe(!1);
      }
    },
    []
  );
  z(() => {
    var l;
    if (Ke.current += 1, we.current += 1, (l = Be.current) == null || l.abort(), L(!1), P(""), N(!1), ue(/* @__PURE__ */ new Set()), me.current.clear(), ie(null), ye(!1), rt(!1), $e.current = !1, nt(""), be(""), Ce(""), Ot({ items: [], totalCount: 0 }), !h) {
      xe(!1);
      return;
    }
    let i = !0;
    return xe(!0), (async () => {
      let m = null;
      try {
        m = await Yr(a, h.id);
      } catch (I) {
        i && (N(!0), P(
          I instanceof Error ? I.message : "Could not load progress."
        ));
      }
      if (!i) return;
      const w = (m == null ? void 0 : m.signature) === ve(h) ? m : null, T = w ? de(w.filter) : Cn(h.view.filter);
      Me(T), tt(
        w ? er(w.displayMode) : Zt(h)
      ), Lt(
        w ? w.cardSize ?? pt : pt
      );
      try {
        const I = await pe(h, T);
        if (!i) return;
        const K = Ht(
          I.items.map((V) => V.id),
          (w == null ? void 0 : w.focusedId) ?? null,
          (w == null ? void 0 : w.index) ?? 0
        );
        ie(K), J(K);
      } catch {
      }
      i && L(!0);
    })(), () => {
      var m;
      i = !1, Ke.current++, we.current++, (m = Be.current) == null || m.abort();
    };
  }, [h == null ? void 0 : h.id]);
  const x = He(
    () => re.items.map((i) => i.id),
    [re.items]
  );
  z(() => {
    if (!q || !h || !a || O || ne || M || (W == null ? void 0 : W.id) === h.id || u)
      return;
    const i = {
      version: 1,
      signature: ve(h),
      filter: j,
      focusedId: G,
      index: Math.max(0, x.indexOf(G ?? -1)),
      displayMode: De,
      cardSize: Fe,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        a + ":progress:" + h.id,
        JSON.stringify(i)
      );
    } catch {
    }
    if (k) return;
    let l = !0;
    const m = window.setTimeout(() => {
      Zr(a, h.id, i).catch((w) => {
        l && P(
          "Progress is kept in this browser, but account sync failed. " + (w instanceof Error ? w.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      l = !1, window.clearTimeout(m);
    };
  }, [
    q,
    a,
    h,
    O,
    ne,
    M,
    j,
    G,
    x,
    De,
    Fe,
    W,
    k,
    u
  ]);
  const at = re.items.find((i) => i.id === G) ?? null;
  oe && at && (Pt.current = at);
  const ge = at ?? (oe ? Pt.current : null), Sr = Wt(le, G), jt = le.size > 0 ? `${le.size} selected video${le.size === 1 ? "" : "s"}` : G == null ? "no video" : "focused video", J = he((i, l = !0) => {
    i != null && window.requestAnimationFrame(() => {
      const m = ot.current.get(i);
      m == null || m.focus({ preventScroll: !0 }), l && (m == null || m.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  z(() => {
    q && !ce.current && J(Z.current);
  }, [q, J]), z(() => {
    O || !x.length || (Z.current == null || !x.includes(Z.current)) && (ie(x[0]), ce.current || J(x[0]));
  }, [J, x, O]);
  const Ae = he(
    (i) => {
      ue((l) => {
        const m = i(l);
        for (const w of /* @__PURE__ */ new Set([...l, ...m]))
          l.has(w) !== m.has(w) && me.current.set(
            w,
            (me.current.get(w) ?? 0) + 1
          );
        return m;
      });
    },
    []
  ), lt = he(
    (i) => {
      if (!x.length) return;
      const l = Math.max(
        0,
        x.indexOf(Z.current ?? x[0])
      ), m = x[Math.max(0, Math.min(x.length - 1, l + i))];
      ie(m), ce.current || J(m);
    },
    [J, x]
  ), ct = he(
    async (i) => {
      const l = Wt(
        et.current,
        Z.current
      );
      if (!h || $e.current || O || ne || !s || Ge(i) && ($ == null ? void 0 : $.kind) !== "ready" || !l.length)
        return;
      const m = ++Ke.current, w = h.id, T = [...x], I = Z.current, K = new Map(
        l.map((H) => [H, me.current.get(H) ?? 0])
      ), V = () => m === Ke.current && h.id === w;
      $e.current = !0, rt(!0), nt(
        et.current.size ? `${l.length} selected videos` : "the focused video"
      ), be(""), Ce("");
      let qe = !1;
      try {
        if (await un(i, l), qe = !0, !V()) return;
        ue((H) => {
          const X = new Set(H);
          for (const ee of l)
            (me.current.get(ee) ?? 0) === K.get(ee) && X.delete(ee);
          return X;
        }), be(
          `${i.label}: ${l.length} video${l.length === 1 ? "" : "s"} ${i.steps.length ? "updated" : "skipped"}.`
        );
      } catch (H) {
        if (!V()) return;
        Ce(
          H instanceof Error ? H.message : "Action failed."
        );
      }
      try {
        if (await on(i), !V()) return;
        const H = await pe(h, j);
        if (!V()) return;
        let X = H.items.map((ee) => ee.id);
        if (!X.length && H.totalCount > 0 && Number(j.page) > 1) {
          const ee = Math.max(1, Number(j.page) - 1), Qe = { ...j, page: ee };
          Me(Qe), X = (await pe(h, Qe)).items.map((dt) => dt.id), ue(
            (dt) => new Set([...dt].filter((kr) => X.includes(kr)))
          );
          const Vt = X.at(-1) ?? null;
          ie(Vt), ce.current || J(Vt);
        } else {
          ue(
            (Qe) => new Set([...Qe].filter((Jt) => X.includes(Jt)))
          );
          const ee = Br(
            T,
            X,
            I,
            qe && l.includes(I ?? -1)
          );
          ie(ee), ce.current && ee == null && ye(!1), ce.current || J(ee);
        }
      } catch (H) {
        V() && Ce(
          (X) => `${X ? `${X} ` : ""}${qe ? "The action completed, but " : ""}the queue could not be refreshed. ${H instanceof Error ? H.message : "Refresh failed."}`
        );
      } finally {
        V() && ($e.current = !1, rt(!1), nt(""));
      }
    },
    [
      s,
      $,
      pe,
      j,
      J,
      x,
      O,
      ne,
      h
    ]
  );
  function Er() {
    var m;
    const i = (m = _t.current) == null ? void 0 : m.firstElementChild, l = i ? getComputedStyle(i).gridTemplateColumns : "";
    return Math.max(1, l.split(" ").filter(Boolean).length);
  }
  function Nr(i) {
    if (i.defaultPrevented || i.repeat || i.ctrlKey || i.altKey || i.metaKey || se) return;
    if (oe && i.key === "Escape") {
      Y(i), ye(!1), J(Z.current);
      return;
    }
    if (!Vr(i.target)) return;
    if (i.key === "Escape") {
      Y(i), Ae(() => /* @__PURE__ */ new Set());
      return;
    }
    const l = (h == null ? void 0 : h.actions.findIndex(
      (T, I) => Ie(T, I) === i.key
    )) ?? -1;
    if (l >= 0 && (h != null && h.actions[l])) {
      Y(i), !M && !O && ct(h.actions[l]);
      return;
    }
    if (!oe && i.key === " ") {
      Y(i), G != null && Ae((T) => gt(T, G));
      return;
    }
    if (!oe && i.key.toLowerCase() === "a") {
      Y(i), Ae(
        (T) => Jr(T, x)
      );
      return;
    }
    if (M || O || oe) return;
    if (i.key === "Enter" && G != null) {
      Y(i), ye(!0);
      return;
    }
    const m = Er(), w = i.key === "ArrowLeft" ? -1 : i.key === "ArrowRight" ? 1 : i.key === "ArrowUp" ? -m : i.key === "ArrowDown" ? m : 0;
    w && (Y(i), lt(w));
  }
  function Ve(i) {
    D(i), tr(i);
  }
  async function Kt(i) {
    if (!a) return !1;
    const l = i.map(Rn);
    try {
      await Xr(a, l);
    } catch (w) {
      throw w;
    }
    r(l), y && !l.some((w) => w.id === y) && Ve("");
    const m = l.find((w) => w.id === y);
    return m && F && JSON.stringify(m) !== JSON.stringify(F) && (m.view.displayMode !== F.view.displayMode && tt(Zt(m)), ve(m) !== ve(F) && (Ne(null), ze(
      m,
      de({ ...m.view.filter, page: j.page })
    ))), !0;
  }
  if (c)
    return /* @__PURE__ */ n(rr, { label: "Loading reviews…" });
  if (E)
    return /* @__PURE__ */ f(Ee, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Mn().catch(
            (i) => p(
              "Could not export browser reviews. " + (i instanceof Error ? i.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        nr,
        {
          message: E,
          onRetry: () => void Ut()
        }
      )
    ] });
  return /* @__PURE__ */ f("div", { className: "data-quality-page", onKeyDown: Nr, children: [
    /* @__PURE__ */ f("header", { className: "data-quality-header", children: [
      h && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: M,
          onClick: () => Ve(""),
          children: /* @__PURE__ */ n(ir, {})
        }
      ),
      /* @__PURE__ */ f("div", { className: "dq-header-copy", children: [
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
          disabled: M || O || !C,
          onClick: () => {
            kt(!0), te(!0);
          },
          children: /* @__PURE__ */ n(or, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: M || O || !C,
          onClick: () => {
            kt(!1), te(!0);
          },
          children: /* @__PURE__ */ n(Fr, {})
        }
      )
    ] }),
    b && /* @__PURE__ */ n("p", { className: "dq-status", children: b }),
    ($ == null ? void 0 : $.kind) === "missing" && /* @__PURE__ */ f("div", { role: "status", className: "dq-status", children: [
      $.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: Ue,
          onClick: () => {
            je(!0), _e(""), an().then(Je).catch(
              (i) => _e(
                "Could not create the Confirmed absent tags custom field. " + (i instanceof Error ? i.message : "Request failed.")
              )
            ).finally(() => je(!1));
          },
          children: Ue ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    (($ == null ? void 0 : $.kind) === "incompatible" || Dt) && /* @__PURE__ */ f("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(bt, {}),
      Dt || ($ == null ? void 0 : $.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: Ue,
          onClick: () => {
            je(!0), Je().finally(
              () => je(!1)
            );
          },
          children: Ue ? "Checking…" : "Check again"
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
            ), m = document.createElement("a");
            m.href = l, m.download = "data-quality-unassigned-legacy-reviews.json", m.click(), URL.revokeObjectURL(l);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    k && /* @__PURE__ */ f("p", { role: "alert", children: [
      k,
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
    h && F && /* @__PURE__ */ f("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${M || O ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": M || O || void 0,
          inert: M || O ? !0 : void 0,
          onClickCapture: (i) => {
            var m, w, T, I, K;
            const l = i.target instanceof Element ? i.target.closest("button") : null;
            (l == null ? void 0 : l.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((m = l == null ? void 0 : l.textContent) == null ? void 0 : m.trim()) === "Clear all" ? fe.current = !0 : ((w = l == null ? void 0 : l.getAttribute("aria-label")) != null && w.startsWith("Filters") || (T = l == null ? void 0 : l.getAttribute("aria-label")) != null && T.startsWith("Edit filter:") || ((I = l == null ? void 0 : l.textContent) == null ? void 0 : I.trim()) === "Cancel" || (K = l == null ? void 0 : l.getAttribute("aria-label")) != null && K.startsWith("Close ")) && (fe.current = !1);
          },
          onKeyDownCapture: (i) => {
            var m, w;
            const l = i.target instanceof Element ? i.target.closest("button") : null;
            (i.key === "Delete" || i.key === "Backspace") && (l == null ? void 0 : l.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (i.preventDefault(), i.stopPropagation(), fe.current = !0, (w = (m = l.parentElement) == null ? void 0 : m.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || w.click()) : i.key === "Escape" && (fe.current = !1);
          },
          children: /* @__PURE__ */ n(
            Pr,
            {
              filter: ne ? yr : j,
              onFilterChange: Cr,
              totalCount: re.totalCount,
              sortOptions: ht,
              showSearch: !0,
              showSort: !0,
              displayMode: De,
              onDisplayModeChange: (i) => tt(er(i)),
              availableDisplayModes: ["grid", "wall"],
              zoomLevel: (Fe - 225) / 50,
              onZoomChange: (i) => Lt(Math.round(225 + i * 50)),
              cardSizeEntityType: "videos",
              criteriaDefinitions: vr,
              objectFilter: st,
              onObjectFilterChange: (i) => {
                if (!M && !O) {
                  const l = vn(i);
                  Pe.current = Sn(
                    h.view.objectFilter,
                    l,
                    fe.current
                  ), fe.current = !1;
                }
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (W == null ? void 0 : W.id) === y && /* @__PURE__ */ f("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n("span", { children: "Temporary queue" }),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: M || O || !C,
            onClick: qr,
            children: "Save queue to review"
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: M || O,
            onClick: Ar,
            children: "Reset to review defaults"
          }
        )
      ] })
    ] }),
    h ? /* @__PURE__ */ f(Ee, { children: [
      Le.error && /* @__PURE__ */ n("p", { role: "alert", children: Le.error }),
      /* @__PURE__ */ n(
        gn,
        {
          videos: re.items,
          review: h,
          trees: Le.ids,
          disabled: M || O,
          onChoose: (i) => {
            const l = hn(h, i);
            Ne(l), ze(l, { ...j, page: 1 });
          }
        }
      ),
      it && !oe && /* @__PURE__ */ f("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(bt, {}),
        it
      ] }),
      Mt && /* @__PURE__ */ n("p", { role: "status", className: "dq-status", children: Mt }),
      Bt("top"),
      /* @__PURE__ */ f("div", { className: "dq-workspace", children: [
        /* @__PURE__ */ f("main", { children: [
          O && !re.items.length && /* @__PURE__ */ n(rr, { label: "Loading review queue…" }),
          ne && !O && /* @__PURE__ */ n(
            nr,
            {
              message: ne,
              onRetry: () => void pe(h, j).catch(() => {
              })
            }
          ),
          !O && !ne && !re.items.length && /* @__PURE__ */ f("div", { className: "dq-empty", children: [
            /* @__PURE__ */ n(Qt, {}),
            /* @__PURE__ */ n("p", { children: "No videos match this review." })
          ] }),
          !!re.items.length && /* @__PURE__ */ n("div", { ref: _t, children: /* @__PURE__ */ n(
            "div",
            {
              className: "dq-grid",
              style: {
                "--dq-card-width": `${Fe}px`
              },
              children: re.items.map(Ir)
            }
          ) })
        ] }),
        /* @__PURE__ */ f("aside", { className: "dq-actions", children: [
          /* @__PURE__ */ n("strong", { children: jt }),
          h.actions.map((i, l) => /* @__PURE__ */ f(
            "button",
            {
              type: "button",
              disabled: M || O || !!ne || !s || Ge(i) && ($ == null ? void 0 : $.kind) !== "ready" || !Sr.length,
              onClick: () => void ct(i),
              children: [
                Ie(i, l) && /* @__PURE__ */ n("kbd", { children: Ie(i, l) }),
                /* @__PURE__ */ n("span", { children: i.label }),
                /* @__PURE__ */ n("small", { children: i.steps.length ? `${i.steps.length} step(s)` : "Skip" })
              ]
            },
            i.id
          )),
          !h.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
          !s && /* @__PURE__ */ n("p", { children: "Video write permission is required to apply actions." }),
          M && /* @__PURE__ */ f("p", { role: "status", children: [
            /* @__PURE__ */ n(ar, { className: "dq-spin" }),
            " Applying action to",
            " ",
            wr,
            "…"
          ] }),
          /* @__PURE__ */ n("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
        ] })
      ] }),
      Bt("bottom")
    ] }) : t.length ? /* @__PURE__ */ f(
      "section",
      {
        className: "dq-review-browser",
        "aria-labelledby": "dq-reviews-title",
        children: [
          /* @__PURE__ */ f("div", { className: "dq-review-browser-heading", children: [
            /* @__PURE__ */ n("h2", { id: "dq-reviews-title", children: "Reviews" }),
            /* @__PURE__ */ n("p", { children: "Choose a review to open its video queue." })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: t.map((i) => {
            const l = Q[i.id];
            return /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                disabled: M,
                onClick: () => Ve(i.id),
                children: [
                  /* @__PURE__ */ f("span", { className: "dq-review-browser-copy", children: [
                    /* @__PURE__ */ n("strong", { children: i.name }),
                    i.description && /* @__PURE__ */ n("span", { children: i.description })
                  ] }),
                  /* @__PURE__ */ n("span", { className: "dq-review-count", "aria-live": "polite", children: l === void 0 ? "Counting…" : l === null ? "Count unavailable" : `${l.toLocaleString()} ${l === 1 ? "video" : "videos"}` }),
                  /* @__PURE__ */ n(sr, {})
                ]
              },
              i.id
            );
          }) })
        ]
      }
    ) : /* @__PURE__ */ f("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(Qt, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    oe && ge && h && /* @__PURE__ */ n(
      On,
      {
        video: ge,
        review: h,
        targetLabel: jt,
        pending: M,
        refreshing: O || !!ne,
        error: it,
        canWrite: s,
        assessmentReady: ($ == null ? void 0 : $.kind) === "ready",
        selected: le.has(ge.id),
        hasPrevious: x.indexOf(ge.id) > 0,
        hasNext: x.indexOf(ge.id) >= 0 && x.indexOf(ge.id) < x.length - 1,
        onToggleSelected: () => Ae((i) => gt(i, ge.id)),
        onPrevious: () => lt(-1),
        onNext: () => lt(1),
        onClose: () => {
          ye(!1), J(Z.current);
        },
        onAction: ct
      }
    ),
    se && /* @__PURE__ */ n(
      Tn,
      {
        reviews: t,
        activeReview: F,
        initialEdit: ae,
        onSave: Kt,
        onChoose: Ve,
        onClose: () => {
          te(!1), ae && J(Z.current, !1);
        }
      }
    )
  ] });
  async function ze(i, l) {
    const m = Z.current, w = Math.max(0, x.indexOf(m ?? -1));
    try {
      const I = (await pe(i, l)).items.map((V) => V.id);
      ue(
        (V) => new Set([...V].filter((qe) => I.includes(qe)))
      );
      const K = Ht(I, m, w);
      ie(K), ce.current || J(K, !1);
    } catch {
    }
  }
  function Cr(i) {
    const l = Pe.current;
    if (Pe.current = null, M || O || !h || !F) return;
    const m = l ?? h.view.objectFilter, w = Nt(
      m,
      F.view.objectFilter
    ) ? F.view.objectFilter : m, T = de({ ...i, page: 1 }), I = {
      ...h,
      view: {
        ...h.view,
        filter: T,
        objectFilter: w
      }
    }, K = ve(I) !== ve(F), V = K ? I : F;
    Ne(K ? I : null), be(
      K ? "Queue adjusted for this session." : "Review queue defaults restored."
    ), ze(V, T);
  }
  function Ar() {
    if (M || O || !F) return;
    Pe.current = null;
    const i = de({
      ...F.view.filter,
      page: 1
    });
    Ne(null), be("Review queue defaults restored."), ze(F, i);
  }
  function qr() {
    M || O || !h || !F || !C || Kt(
      t.map(
        (i) => i.id === y ? {
          ...i,
          view: {
            ...h.view,
            filter: { ...j, page: 1 }
          }
        } : i
      )
    ).then(() => {
      Ne(null), be("Queue saved to this review.");
    }).catch(
      (i) => Ce(
        i instanceof Error ? i.message : "Could not save queue."
      )
    );
  }
  function Rr() {
    ue(/* @__PURE__ */ new Set()), me.current.clear(), ie(null);
  }
  function Bt(i) {
    return h ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: M || O,
        "aria-label": `Review queue pagination ${i}`,
        children: /* @__PURE__ */ n(
          Lr,
          {
            filter: {
              ...j,
              page: Number(j.page) || 1,
              perPage: Number(j.perPage) || 40
            },
            totalCount: re.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${i}`,
            onFilterChange: (l) => {
              M || O || l.page === Number(j.page) || qn(
                { ...j, page: l.page },
                h,
                pe,
                Rr
              );
            }
          }
        )
      }
    ) : null;
  }
  function Ir(i) {
    return /* @__PURE__ */ n(
      In,
      {
        video: pn(i, h, Le.ids),
        displayMode: De,
        focused: i.id === G,
        selected: le.has(i.id),
        setRef: (l) => {
          l ? ot.current.set(i.id, l) : ot.current.delete(i.id);
        },
        onFocus: () => ie(i.id),
        onToggle: () => Ae((l) => gt(l, i.id)),
        onPreview: () => {
          ie(i.id), ye(!0);
        },
        onNavigate: e
      },
      i.id
    );
  }
}
function qn(e, t, r, o) {
  o(), r(t, e).catch(() => {
  });
}
function gt(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Rn(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function In({
  video: e,
  displayMode: t,
  focused: r,
  selected: o,
  setRef: a,
  onFocus: d,
  onToggle: c,
  onPreview: v,
  onNavigate: E
}) {
  const p = mr(e), s = _(null), g = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, C = !!(g.date || g.studioName), A = !!(g.performers.length || g.tags.length);
  return Or(() => {
    const b = s.current;
    if (!b) return;
    const R = b.querySelector(
      `a[href="/video/${e.id}"]`
    ), k = b.querySelector(".card-title"), P = `dq-card-title-${e.id}`;
    k && (k.id = P), R && (R.target = "_blank", R.rel = "noreferrer", R.removeAttribute("aria-label"), R.setAttribute("aria-labelledby", P), R.classList.add("dq-card-link"));
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
          xr,
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
        t === "wall" && /* @__PURE__ */ n(kn, { video: e })
      ]
    }
  );
}
function kn({ video: e }) {
  const t = _(null), r = _(null), [o, a] = S(!1), [d, c] = S(!1), [v, E] = S(!1);
  return z(() => {
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
  }, [e.id, e.files.length]), z(() => {
    if (!o) {
      E(!1);
      return;
    }
    const p = new AbortController();
    return U(nn(e.id), {
      signal: p.signal
    }).then((s) => {
      p.signal.aborted || E(s.available === !0);
    }).catch(() => {
      p.signal.aborted || E(!1);
    }), () => p.abort();
  }, [o, e.id]), z(() => {
    const p = r.current;
    p && (d ? Promise.resolve(p.play()).catch(() => {
    }) : p.pause());
  }, [v, d]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: v && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: rn(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function On({
  video: e,
  review: t,
  targetLabel: r,
  pending: o,
  refreshing: a,
  error: d,
  canWrite: c,
  assessmentReady: v,
  selected: E,
  hasPrevious: p,
  hasNext: s,
  onToggleSelected: g,
  onPrevious: C,
  onNext: A,
  onClose: b,
  onAction: R
}) {
  const k = _(null), P = _(null), u = e.files[0], N = mr(e);
  z(() => {
    var D;
    const y = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (D = k.current) == null || D.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = y;
    };
  }, []);
  function q(y) {
    var B, se, te;
    if (y.key !== "Tab") return;
    const D = [
      ...((B = k.current) == null ? void 0 : B.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ae) => ae.offsetParent !== null);
    if (!D.length) {
      y.preventDefault(), (se = k.current) == null || se.focus();
      return;
    }
    const Q = D.indexOf(
      document.activeElement
    );
    y.shiftKey && Q <= 0 ? (y.preventDefault(), (te = D.at(-1)) == null || te.focus()) : !y.shiftKey && Q === D.length - 1 && (y.preventDefault(), D[0].focus());
  }
  function L(y) {
    if (y.defaultPrevented || y.ctrlKey || y.metaKey || y.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const D = y.key === "ArrowLeft" || y.key === "ArrowRight";
    if (y.altKey && !D) return;
    const Q = P.current, B = y.currentTarget.querySelector("video");
    if (y.key === "Enter" || y.key === "Escape")
      y.repeat || b();
    else if (y.key === " " && Q)
      y.repeat || Q.toggle();
    else if (D && Q)
      Q.seekBy(
        (y.key === "ArrowLeft" ? -1 : 1) * (y.shiftKey ? 5 : y.altKey ? 10 : 60)
      );
    else if ((y.key === "," || y.key === ".") && Q) {
      const se = [u == null ? void 0 : u.duration, B == null ? void 0 : B.duration].find(
        (ae) => ae != null && Number.isFinite(ae) && ae > 0
      ) ?? 0, te = e.parentVideoId != null ? (e.clipEndSec ?? se) - (e.clipStartSec ?? 0) : se;
      Number.isFinite(te) && te > 0 && Q.seekBy((y.key === "," ? -1 : 1) * te * 0.1);
    } else if (y.key.toLowerCase() === "n" || y.key.toLowerCase() === "m")
      !y.repeat && !o && !a && (y.key.toLowerCase() === "n" && p && C(), y.key.toLowerCase() === "m" && s && A());
    else if (y.key === "ArrowUp" && B)
      B.volume = Math.min(1, B.volume + 0.1);
    else if (y.key === "ArrowDown" && B)
      B.volume = Math.max(0, B.volume - 0.1);
    else return;
    Y(y);
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
      onKeyDown: q,
      onKeyDownCapture: L,
      onMouseDown: (y) => {
        y.target === y.currentTarget && b();
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
              children: /* @__PURE__ */ n(ir, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !s || o || a,
              onClick: A,
              children: /* @__PURE__ */ n(sr, {})
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
              children: /* @__PURE__ */ n($r, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: b,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(lr, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: u ? /* @__PURE__ */ n(
          Mr,
          {
            autostart: !0,
            streamUrl: tn(e.id),
            posterUrl: Xt(e),
            format: u.format,
            audioCodec: u.audioCodec,
            duration: u.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (y) => (P.current = y, () => {
              P.current === y && (P.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: Xt(e), alt: "" }) }),
        d && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: d }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((y, D) => /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            disabled: o || a || !c || Ge(y) && !v,
            onClick: () => void R(y),
            children: [
              Ie(y, D) && /* @__PURE__ */ n("kbd", { children: Ie(y, D) }),
              y.label
            ]
          },
          y.id
        )) })
      ] })
    }
  );
}
function Tn({
  reviews: e,
  activeReview: t,
  initialEdit: r = !1,
  onSave: o,
  onChoose: a,
  onClose: d
}) {
  const [c, v] = S(
    () => r && t ? structuredClone(t) : null
  ), [E, p] = S(""), [s, g] = S(!1), C = _(null);
  z(() => {
    var q, L;
    const u = document.activeElement, N = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (L = (q = C.current) == null ? void 0 : q.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || L.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = N, u == null || u.focus({ preventScroll: !0 });
    };
  }, []);
  function A(u) {
    var L, y, D;
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
      ...((L = C.current) == null ? void 0 : L.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((Q) => Q.offsetParent !== null);
    if (!N.length) {
      Y(u), (y = C.current) == null || y.focus();
      return;
    }
    const q = N.indexOf(
      document.activeElement
    );
    u.shiftKey && q <= 0 ? (Y(u), (D = N.at(-1)) == null || D.focus()) : !u.shiftKey && q === N.length - 1 ? (Y(u), N[0].focus()) : u.stopPropagation();
  }
  function b(u) {
    v(
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
  async function R() {
    if (s) return;
    if (!c || wt(c)) {
      p(c ? wt(c) : "Choose a review.");
      return;
    }
    const u = { ...c, name: c.name.trim() }, N = e.some((q) => q.id === u.id) ? e.map((q) => q.id === u.id ? u : q) : [...e, u];
    g(!0), p("");
    try {
      if (!await o(N)) throw new Error("Could not save reviews.");
      a(u.id), d();
    } catch (q) {
      p(
        "Could not save reviews. Your edits are still open. " + (q instanceof Error ? q.message : "Retry saving.")
      );
    } finally {
      g(!1);
    }
  }
  async function k(u) {
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
    var q;
    if (s) return;
    const N = (q = u.target.files) == null ? void 0 : q[0];
    if (u.target.value = "", !!N) {
      if (N.size > 2e6) {
        p("Review files must be smaller than 2 MB.");
        return;
      }
      g(!0), p("");
      try {
        const L = ke(await N.text());
        if (!await o(vt(e, L)))
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
              children: /* @__PURE__ */ n(lr, {})
            }
          )
        ] }),
        E && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: E }),
        /* @__PURE__ */ n("fieldset", { disabled: s, className: "dq-manager-content", children: c ? /* @__PURE__ */ n(
          Pn,
          {
            draft: c,
            saving: s,
            setDraft: v,
            onSave: () => void R(),
            onCancel: d
          }
        ) : /* @__PURE__ */ f(Ee, { children: [
          /* @__PURE__ */ f("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ f(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => b(),
                children: [
                  /* @__PURE__ */ n(_r, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ f("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(Ur, {}),
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
              /* @__PURE__ */ n(or, {}),
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
                  window.confirm(`Delete review “${u.name}”?`) && k(
                    e.filter((N) => N.id !== u.id)
                  );
                },
                children: /* @__PURE__ */ n(cr, {})
              }
            )
          ] }, u.id)) })
        ] }) })
      ] })
    }
  );
}
function Pn({
  draft: e,
  saving: t = !1,
  setDraft: r,
  onSave: o,
  onCancel: a
}) {
  const [d, c] = S("Review"), v = _(/* @__PURE__ */ new WeakMap()), E = (s) => {
    let g = v.current.get(s);
    return g || (g = crypto.randomUUID(), v.current.set(s, g)), g;
  }, p = (s, g) => r({
    ...e,
    actions: e.actions.map(
      (C, A) => A === s ? g : C
    )
  });
  return /* @__PURE__ */ f("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      Dr,
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
      /* @__PURE__ */ n("section", { hidden: d !== "Queue", className: "dq-editor-section", children: /* @__PURE__ */ n(Yt, { draft: e, onChange: r, presentation: !1 }) }),
      /* @__PURE__ */ n("section", { hidden: d !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(Yt, { draft: e, onChange: r, queue: !1 }) }),
      /* @__PURE__ */ f("section", { hidden: d !== "Actions", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Actions" }),
        /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
        /* @__PURE__ */ n(
          zt,
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
                        children: /* @__PURE__ */ n(dr, {})
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
                    zt,
                    {
                      items: s.steps,
                      getKey: E,
                      disabled: t,
                      className: "dq-sortable-list",
                      onReorder: (b) => p(g, { ...s, steps: b }),
                      renderItem: (b, { index: R, dragHandleProps: k, isOver: P }) => /* @__PURE__ */ n(
                        Ln,
                        {
                          dragHandleProps: k,
                          saving: t,
                          isOver: P,
                          step: b,
                          index: R,
                          onChange: (u) => {
                            v.current.set(u, E(b)), p(g, {
                              ...s,
                              steps: s.steps.map(
                                (N, q) => q === R ? u : N
                              )
                            });
                          },
                          onRemove: () => p(g, {
                            ...s,
                            steps: s.steps.filter(
                              (u, N) => N !== R
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
                            (b, R) => R !== g
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
function Ln({
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
        children: /* @__PURE__ */ n(dr, {})
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
      yt,
      {
        entityType: "tag",
        values: e.tagIds,
        onChange: (v) => d({ ...e, tagIds: v }),
        placeholder: "Choose tags",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: c, children: /* @__PURE__ */ n(cr, {}) })
  ] });
}
async function Mn() {
  const e = await U("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
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
function rr({ label: e }) {
  return /* @__PURE__ */ f("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(ar, { className: "dq-spin" }),
    e
  ] });
}
function nr({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ f("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(bt, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const Un = { components: { DataQualityPage: An } };
export {
  An as DataQualityPage,
  Un as default,
  Nt as objectFiltersEqual
};
