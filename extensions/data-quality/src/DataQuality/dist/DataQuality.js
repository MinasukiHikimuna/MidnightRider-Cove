import { jsxs as u, jsx as n, Fragment as Ae } from "react/jsx-runtime";
import { useState as S, useEffect as G, useRef as D, useMemo as ke, useCallback as we, useLayoutEffect as gr } from "react";
import { VIDEO_SORT_OPTIONS as vt, FilterDialog as Qr, VIDEO_CRITERIA as St, EntityReferenceMultiSelector as Et, DetailListToolbar as Hr, DetailListPagination as Wr, VideoPlayer as Gr, VideoCard as Xr, EntityDetailTabs as Yr, SortableList as tr } from "@cove/runtime/components";
import { ChevronLeft as mr, Pencil as hr, Settings as Zr, AlertTriangle as Nt, ChevronRight as br, Film as rr, Loader2 as yr, ExternalLink as en, X as wr, Plus as tn, Upload as rn, Trash2 as vr, GripVertical as Sr } from "@cove/runtime/lucide-react";
import { extensionFetch as nn } from "@cove/runtime/api";
function Oe(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function Ct(e) {
  if (e.actions.some(Er))
    return "An action cannot contain contradictory assessments for the same tag.";
  if (!e.name.trim() || !e.actions.every(kt))
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
function nr(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function Ne(e) {
  const { page: t, ...r } = e.view.filter;
  return JSON.stringify([
    r,
    e.view.objectFilter,
    e.view.searchMode
  ]);
}
function kt(e) {
  return !!e.label.trim() && e.steps.every(
    (t) => [
      "ADD",
      "REMOVE",
      "REMOVE_TREE",
      "MARK_PRESENT",
      "MARK_ABSENT",
      "CLEAR_ABSENCE"
    ].includes(t.mode) && t.tagIds.length > 0 && t.tagIds.every((r) => Number.isSafeInteger(r) && r > 0)
  ) && !Er(e);
}
function Ze(e) {
  return e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  );
}
function Er(e) {
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
function Pe(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && on(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (o) => typeof o == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (o) => typeof (o == null ? void 0 : o.id) == "string" && typeof o.label == "string" && (o.shortcut === void 0 || typeof o.shortcut == "string") && Array.isArray(o.steps) && o.steps.every((l) => l && Array.isArray(l.tagIds)) && kt(o)
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => Ct(r)))
    throw new Error(
      "Saved reviews contain invalid actions or shortcuts. Existing data has been kept; assign shortcuts 1–9 only once or leave them empty."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function on(e) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.cardSize === void 0 || t.cardSize === null || Number.isFinite(t.cardSize) && t.cardSize >= 115 && t.cardSize <= 380) && (t.annotations === void 0 || Array.isArray(t.annotations) && t.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [t.annotationParents, t.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0)
  );
}
function At(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const o of e)
    for (const l of o)
      r.has(l.id) || (r.add(l.id), t.push(l));
  return t;
}
function ir(e, t) {
  return e.size > 0 ? [...e].sort((r, o) => r - o) : t == null ? [] : [t];
}
function or(e, t, r, o) {
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
function sn(e, t) {
  const r = new Set(e), o = t.length > 0 && t.every((l) => r.has(l));
  for (const l of t)
    o ? r.delete(l) : r.add(l);
  return r;
}
function an(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const Nr = "ext:com.midnightrider.data-quality:configuration", ln = "ext:cove-data-quality:video-reviews", Rt = "ext:com.midnightrider.data-quality:progress", Le = /* @__PURE__ */ new Map(), Ye = /* @__PURE__ */ new Map(), ht = (e, t) => e.includes("*") || e.includes(t), et = (e) => K(`/api/savedfilters?mode=${encodeURIComponent(e)}`), cn = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function qt(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Ce(e) {
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
    deletedIds: qt(t.deletedIds),
    importedIds: qt(t.importedIds)
  };
}
function dn(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const o = /* @__PURE__ */ new Set();
  for (const l of t) {
    const d = localStorage.getItem(l);
    if (d !== null) {
      const c = Pe(d);
      r ?? (r = c), c.forEach((v) => o.add(v.id));
    }
    qt(
      JSON.parse(localStorage.getItem(`${l}:account-imports`) ?? "[]")
    ).forEach((c) => o.add(c));
  }
  return {
    reviews: r ?? [],
    known: [...o],
    present: r !== void 0
  };
}
async function Cr(e) {
  const t = await K("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Ar(e, t) {
  const r = (Ye.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Ye.set(e, r), r.finally(() => {
    Ye.get(e) === r && Ye.delete(e);
  }).catch(() => {
  }), r;
}
let Te = null;
function un() {
  if (Te) return Te;
  const e = fn();
  return Te = e, e.finally(() => {
    Te === e && (Te = null);
  }).catch(() => {
  }), e;
}
async function fn() {
  var C;
  const e = await K("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, o = ht(e.permissions, "savedfilters.read"), l = o && ht(e.permissions, "savedfilters.write"), d = o ? (await et(Nr)).filter((A) => A.name === "Data Quality configuration").sort((A, y) => A.id - y.id) : [];
  if (d.length > 1) {
    const A = (y) => {
      const { revision: q, ...k } = Ce(y.uiOptions);
      return JSON.stringify(k);
    };
    if (d.some((y) => A(y) !== A(d[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (l)
      for (const y of d.slice(1))
        await K(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    d.splice(1);
  }
  let c = d.length ? Ce(d[0].uiOptions) : cn();
  const v = localStorage.getItem(`${r}:migrated`) === "true", E = localStorage.getItem(r), p = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && E && (c = Ce(E));
  let s = !d.length;
  if (d.length && p && E) {
    const A = Ce(E);
    if (A.reviews.some((q) => {
      const k = c.reviews.find((L) => L.id === q.id);
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
      reviews: At(c.reviews, A.reviews).filter(
        (q) => !y.includes(q.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...c.importedIds, ...A.importedIds])
      ]
    }, s = !0;
  }
  if (!v) {
    const A = JSON.stringify(c), y = dn(t);
    if (d.length && y.reviews.some((f) => {
      const N = c.reviews.find((R) => R.id === f.id);
      return N && JSON.stringify(N) !== JSON.stringify(f);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const q = o ? (await et(ln)).flatMap(
      (f) => Pe(f.uiOptions ?? "[]")
    ) : [], k = y.known.filter(
      (f) => !y.reviews.some((N) => N.id === f)
    ), L = /* @__PURE__ */ new Set([...c.deletedIds, ...k]);
    c = {
      ...c,
      reviews: At(
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
  if (Le.set(r, g), s && l) {
    const A = c;
    d.length && (g.config = Ce(d[0].uiOptions)), await Rr(r, A), c = g.config;
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
    canWrite: ht(e.permissions, "videos.write"),
    canConfigure: !o || l,
    storageNotice: o ? l ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Rr(e, t) {
  const r = Le.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const o = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await Cr(r), r.recordId != null) {
      const d = await K(
        `/api/savedfilters/${r.recordId}`
      );
      if (Ce(d.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const l = await K(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Nr,
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
function pn(e, t) {
  return Pe(JSON.stringify(t)), Ar(e, async () => {
    const r = Le.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const o = r.config.reviews.filter((l) => !t.some((d) => d.id === l.id)).map((l) => l.id);
    await Rr(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...o])
      ].filter((l) => !t.some((d) => d.id === l))
    });
  });
}
function sr(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function gn(e, t) {
  const r = Le.get(e);
  if (!r) return null;
  const o = localStorage.getItem(`${e}:progress:${t}`), l = o ? sr(o) : null;
  if (!r.readable) return l;
  const d = (await et(Rt)).find(
    (v) => v.name === t
  ), c = d ? sr(d.uiOptions) : null;
  return l && (!c || l.updatedAt > c.updatedAt) ? l : c;
}
function mn(e, t, r) {
  const o = `${e}:progress:${t}`;
  try {
    localStorage.setItem(o, JSON.stringify(r));
  } catch {
  }
  return Ar(o, async () => {
    const l = Le.get(e);
    if (!(l != null && l.writable)) return;
    await Cr(l);
    const d = (await et(Rt)).find(
      (c) => c.name === t
    );
    await K(
      d ? `/api/savedfilters/${d.id}` : "/api/savedfilters",
      {
        method: d ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Rt,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Me = "confirmed_absent_tags", Tt = "Confirmed absent tags", hn = {
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
function tt(e) {
  return Array.isArray(e) ? e.map(tt) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? hn[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === Me.toLowerCase() ? r.toLowerCase() : tt(r)
    ])
  ) : e;
}
async function K(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const o = await nn(e, { ...t, headers: r });
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
async function bt(e, t, r) {
  const o = { ...e.view.objectFilter }, l = o._filterExpression;
  if (delete o._filterExpression, delete o.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return K("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      tt({
        findFilter: ge(t),
        objectFilter: o,
        filterExpression: l
      })
    )
  });
}
function bn(e) {
  return `/api/stream/video/${e}`;
}
function ar(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function yn(e) {
  return `/api/stream/video/${e}/preview`;
}
function wn(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function vn(e) {
  return e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Ot(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await K(`/api/tags/${r}`), t.add(r);
    for (let o = 1; ; o++) {
      const l = await K("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          tt({
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
function Sn(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${Me} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function Pt() {
  const t = (await K("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === Me.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${Tt} custom field before applying tag assessments.`
    };
  const r = Sn(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function En() {
  const e = await Pt();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await K("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: Me,
        label: Tt,
        type: "tag",
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function rt(e) {
  return [...new Set(e)];
}
function Nn(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${Me} value is not a valid tag list.`
    );
  return rt(e);
}
function Cn(e) {
  return rt(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function An(e, t) {
  let r;
  try {
    r = await Pt();
  } catch (p) {
    throw new Error(
      `Could not verify the ${Tt} custom field. ${p instanceof Error ? p.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const o = await Promise.all(
    e.steps.map(async (p) => ({
      ...p,
      tagIds: p.mode === "REMOVE_TREE" ? await Ot(p.tagIds) : rt(p.tagIds)
    }))
  ), l = o.filter(
    (p) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(p.mode)
  ), d = o.filter(
    (p) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(p.mode)
  ), c = rt(t), v = r.definition.key;
  let E = 0;
  for (const p of c)
    try {
      const s = await K(`/api/videos/${p}`), g = Cn(s), C = { ...s.customFields ?? {} }, A = C[v], y = Nn(A), q = new Set(g), k = new Set(y);
      for (const R of l)
        for (const M of R.tagIds)
          R.mode === "ADD" ? q.add(M) : q.delete(M);
      for (const R of d)
        for (const M of R.tagIds)
          R.mode === "MARK_PRESENT" ? (q.add(M), k.delete(M)) : R.mode === "MARK_ABSENT" ? (q.delete(M), k.add(M)) : k.delete(M);
      const L = [...q], f = [...k];
      JSON.stringify(g) === JSON.stringify(L) && JSON.stringify(y) === JSON.stringify(f) && (A === void 0 ? f.length === 0 : JSON.stringify(A) === JSON.stringify(y)) || await K(`/api/videos/${p}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: L,
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
async function Rn(e, t) {
  if (!kt(e) || t.length === 0 || t.some((o) => !Number.isSafeInteger(o) || o <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (Ze(e)) {
    await An(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (o) => ({
      mode: o.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: o.mode === "REMOVE_TREE" ? await Ot(o.tagIds) : o.tagIds
    }))
  );
  for (let o = 0; o < r.length; o++)
    try {
      await K("/api/videos/bulk", {
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
function qn(e) {
  var v, E, p;
  const [t, r] = S({}), [o, l] = S(""), d = (((v = e == null ? void 0 : e.presentation) == null ? void 0 : v.annotations) ?? []).includes("tags") ? ((E = e == null ? void 0 : e.presentation) == null ? void 0 : E.annotationParents) ?? [] : [], c = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...d,
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return G(() => {
    let s = !0;
    return r({}), l(""), Promise.all(
      JSON.parse(c).map(
        async (g) => [g, await Ot([g])]
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
function In(e, t, r) {
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
function kn({
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
function Tn(e, t) {
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
function lr({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: o = !0
}) {
  const [l, d] = S(!1), c = e.view.filter, v = (s) => t({
    ...e,
    view: { ...e.view, filter: { ...c, ...s } }
  }), E = e.presentation ?? {}, p = (s) => t({ ...e, presentation: { ...E, ...s } });
  return /* @__PURE__ */ u(Ae, { children: [
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
                !vt.some((s) => s.value === c.sort) && c.sort != null && /* @__PURE__ */ n("option", { value: String(c.sort), children: String(c.sort) }),
                vt.map((s) => /* @__PURE__ */ n("option", { value: s.value, children: s.label }, s.value))
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
        Qr,
        {
          open: !0,
          onClose: () => d(!1),
          criteria: St,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: !0,
          subjectLabel: "videos",
          onApply: (s) => {
            t({ ...e, view: { ...e.view, objectFilter: s } }), d(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ u(Ae, { children: [
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
      (E.annotations ?? []).includes("tags") && /* @__PURE__ */ u(Ae, { children: [
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
        /* @__PURE__ */ n(
          Et,
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
        Et,
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
const On = {
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
function Lt(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Pn(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function Ln(e) {
  return [
    ...new Set(
      Lt(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Mn(e, t) {
  const r = Lt(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((o) => {
      const l = String(o.key ?? ""), d = On[String(o.modifier ?? "EQUALS")], c = (g, C) => String(C ?? "").trim() || t[String(g)] || String(g ?? ""), v = c(
        o.value,
        o.displayValue
      ), E = c(
        o.value2,
        o.displayValue2
      ), p = String(o.modifier ?? "EQUALS"), s = p === "IS_NULL" || p === "NOT_NULL" ? [] : p === "BETWEEN" || p === "NOT_BETWEEN" ? [v, "and", E] : [v];
      return {
        ...o,
        label: [Pn(l), d, ...s].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function xn(e) {
  const t = Lt(e.customFieldCriteria);
  return t.length ? {
    ...e,
    customFieldCriteria: t.map(
      ({ label: r, ...o }) => o
    )
  } : e;
}
function Dn(e, t, r) {
  return r || "customFieldCriteria" in t || !Array.isArray(e.customFieldCriteria) ? t : { ...t, customFieldCriteria: e.customFieldCriteria };
}
const yt = 180, Fn = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function cr(e) {
  return e.view.displayMode === "wall" ? "wall" : "grid";
}
function dr(e) {
  return e === "wall" ? "wall" : "grid";
}
function $n() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function ur(e) {
  const t = new URLSearchParams(window.location.search);
  e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function _n(e) {
  return ge({ ...e, page: 1 });
}
function It(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((c, v) => It(c, t[v]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, o = t, l = Object.keys(r).sort(), d = Object.keys(o).sort();
  return l.length === d.length && l.every(
    (c, v) => c === d[v] && It(r[c], o[c])
  );
}
function qr(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function te(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
function Un({
  onNavigate: e
}) {
  const [t, r] = S([]), [o] = S(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [l, d] = S(""), [c, v] = S(!0), [E, p] = S(""), [s, g] = S(!1), [C, A] = S(!0), [y, q] = S(""), [k, L] = S(""), [f, N] = S(!1), [R, M] = S(!1), [b, _] = S($n), [B, V] = S({}), [le, pe] = S("name"), [re, Ir] = S("asc"), Mt = D(null), nt = D(!1), [xt, it] = S(!1), [Dt, Ft] = S(!1), [X, Re] = S(
    null
  ), F = t.find((i) => i.id === b) ?? null, m = ke(
    () => (X == null ? void 0 : X.id) === b && F ? { ...F, view: X.view } : F,
    [X, b, F]
  ), kr = ke(() => {
    const i = re === "asc" ? 1 : -1;
    return [...t].sort((a, h) => {
      if (le === "count") {
        const w = B[a.id], I = B[h.id], O = typeof w == "number", P = typeof I == "number";
        if (O !== P) return O ? -1 : 1;
        if (O && P && w !== I)
          return (w - I) * i;
      }
      return a.name.localeCompare(h.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * i;
    });
  }, [re, le, B, t]), xe = D(
    null
  ), De = qn(m), [J, Fe] = S({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Tr, Or] = S({
    page: 1,
    perPage: 40
  }), [Y, $e] = S({ items: [], totalCount: 0 }), [T, _e] = S(!1), [oe, $t] = S(""), [Pr, Lr] = S(!1), [ce, de] = S(() => /* @__PURE__ */ new Set()), Ue = D(ce);
  Ue.current = ce;
  const me = D(/* @__PURE__ */ new Map()), [Z, ee] = S(null), ne = D(Z);
  ne.current = Z;
  const [se, ve] = S(!1), ae = D(se);
  ae.current = se;
  const _t = D(null), [je, ot] = S("grid"), [Be, Ut] = S(yt), [x, st] = S(!1), Ke = D(!1), [Mr, at] = S(""), [jt, Se] = S(""), [lt, qe] = S(""), [U, Bt] = S(null), [Kt, Ve] = S(""), [Je, ze] = S(!1), [Vt, Jt] = S({}), ct = D(/* @__PURE__ */ new Map()), zt = D(null), Ee = D(0), Qe = D(0), He = D(null), he = D(!1);
  G(() => {
    const i = m ? Ln(m.view.objectFilter) : [];
    if (Jt({}), !i.length) return;
    const a = new AbortController();
    let h = !0;
    return Promise.all(
      i.map(async (w) => {
        var I;
        try {
          const O = await K(`/api/tags/${w}`, {
            signal: a.signal
          });
          return (I = O.name) != null && I.trim() ? [String(w), O.name] : null;
        } catch {
          return null;
        }
      })
    ).then((w) => {
      h && Jt(
        Object.fromEntries(w.filter((I) => I !== null))
      );
    }), () => {
      h = !1, a.abort();
    };
  }, [m == null ? void 0 : m.id, m == null ? void 0 : m.view.objectFilter]);
  const dt = ke(
    () => m ? Mn(
      m.view.objectFilter,
      Vt
    ) : {},
    [Vt, m]
  ), xr = ke(
    () => Array.isArray(dt.customFieldCriteria) ? [...St, Fn] : St,
    [dt.customFieldCriteria]
  ), Qt = we(async () => {
    v(!0), p("");
    try {
      const i = await un();
      r(i.reviews), d(i.storageKey), g(i.canWrite), A(i.canConfigure ?? !0), q(i.storageNotice ?? ""), b && !i.reviews.some((a) => a.id === b) && (_(""), ur(""));
    } catch (i) {
      p(
        i instanceof Error ? i.message : "Could not load reviews."
      );
    } finally {
      v(!1);
    }
  }, [b]);
  G(() => {
    Qt();
  }, []), G(() => {
    if (b || t.length === 0) return;
    const i = new AbortController();
    V({});
    for (const a of t)
      bt(
        a,
        ge({ ...a.view.filter, page: 1, perPage: 1 }),
        i.signal
      ).then((h) => {
        i.signal.aborted || V((w) => ({
          ...w,
          [a.id]: h.totalCount
        }));
      }).catch(() => {
        i.signal.aborted || V((h) => ({ ...h, [a.id]: null }));
      });
    return () => i.abort();
  }, [b, t]), gr(() => {
    var i;
    b || c || !nt.current || (nt.current = !1, (i = Mt.current) == null || i.focus());
  }, [b, c]);
  const We = we(async () => {
    Ve("");
    try {
      Bt(await Pt());
    } catch (i) {
      Bt(null), Ve(
        "Tag assessment setup could not be checked. " + (i instanceof Error ? i.message : "Request failed.")
      );
    }
  }, []);
  G(() => {
    We();
  }, [We]);
  const be = we(
    async (i, a, h = !1) => {
      var P;
      const w = ++Ee.current;
      (P = He.current) == null || P.abort();
      const I = new AbortController();
      He.current = I, a = ge(a);
      const O = Number(a.page);
      h && (a = { ...a, page: 1 }), Fe(a), Lr(h), _e(!0), $t("");
      try {
        let z = await bt(
          i,
          a,
          I.signal
        );
        const ue = Math.max(
          1,
          Math.ceil(z.totalCount / Number(a.perPage))
        ), ie = h ? ue : Math.min(O, ue);
        return Number(a.page) !== ie && (a = { ...a, page: ie }, z = await bt(
          i,
          a,
          I.signal
        )), w === Ee.current && ($e(z), Fe(a), Or(a)), z;
      } catch (z) {
        throw w === Ee.current && $t(
          z instanceof Error ? z.message : "Could not load the review queue."
        ), z;
      } finally {
        w === Ee.current && _e(!1);
      }
    },
    []
  );
  G(() => {
    var a;
    if (Qe.current += 1, Ee.current += 1, (a = He.current) == null || a.abort(), M(!1), L(""), N(!1), de(/* @__PURE__ */ new Set()), me.current.clear(), ee(null), ve(!1), st(!1), Ke.current = !1, at(""), Se(""), qe(""), $e({ items: [], totalCount: 0 }), !m) {
      _e(!1);
      return;
    }
    let i = !0;
    return _e(!0), (async () => {
      let h = null;
      try {
        h = await gn(l, m.id);
      } catch (O) {
        i && (N(!0), L(
          O instanceof Error ? O.message : "Could not load progress."
        ));
      }
      if (!i) return;
      const w = (h == null ? void 0 : h.signature) === Ne(m) ? h : null, I = w ? ge(w.filter) : _n(m.view.filter);
      Fe(I), ot(
        w ? dr(w.displayMode) : cr(m)
      ), Ut(
        w ? w.cardSize ?? yt : yt
      );
      try {
        const O = await be(
          m,
          I,
          !w && m.view.startFrom !== "beginning"
        );
        if (!i) return;
        const P = nr(
          O.items.map((z) => z.id),
          (w == null ? void 0 : w.focusedId) ?? null,
          (w == null ? void 0 : w.index) ?? 0
        );
        ee(P), H(P);
      } catch {
      }
      i && M(!0);
    })(), () => {
      var h;
      i = !1, Qe.current++, Ee.current++, (h = He.current) == null || h.abort();
    };
  }, [m == null ? void 0 : m.id]);
  const $ = ke(
    () => Y.items.map((i) => i.id),
    [Y.items]
  );
  G(() => {
    if (!R || !m || !l || T || oe || x || (X == null ? void 0 : X.id) === m.id || f)
      return;
    const i = {
      version: 1,
      signature: Ne(m),
      filter: J,
      focusedId: Z,
      index: Math.max(0, $.indexOf(Z ?? -1)),
      displayMode: je,
      cardSize: Be,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        l + ":progress:" + m.id,
        JSON.stringify(i)
      );
    } catch {
    }
    if (k) return;
    let a = !0;
    const h = window.setTimeout(() => {
      mn(l, m.id, i).catch((w) => {
        a && L(
          "Progress is kept in this browser, but account sync failed. " + (w instanceof Error ? w.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      a = !1, window.clearTimeout(h);
    };
  }, [
    R,
    l,
    m,
    T,
    oe,
    x,
    J,
    Z,
    $,
    je,
    Be,
    X,
    k,
    f
  ]);
  const ut = Y.items.find((i) => i.id === Z) ?? null;
  se && ut && (_t.current = ut);
  const ye = ut ?? (se ? _t.current : null), Dr = ir(ce, Z), Ht = ce.size > 0 ? `${ce.size} selected video${ce.size === 1 ? "" : "s"}` : Z == null ? "no video" : "focused video", H = we((i, a = !0) => {
    i != null && window.requestAnimationFrame(() => {
      const h = ct.current.get(i);
      h == null || h.focus({ preventScroll: !0 }), a && (h == null || h.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  G(() => {
    R && !ae.current && H(ne.current);
  }, [R, H]), G(() => {
    T || !$.length || (ne.current == null || !$.includes(ne.current)) && (ee($[0]), ae.current || H($[0]));
  }, [H, $, T]);
  const Ie = we(
    (i) => {
      de((a) => {
        const h = i(a);
        for (const w of /* @__PURE__ */ new Set([...a, ...h]))
          a.has(w) !== h.has(w) && me.current.set(
            w,
            (me.current.get(w) ?? 0) + 1
          );
        return h;
      });
    },
    []
  ), ft = we(
    (i) => {
      if (!$.length) return;
      const a = Math.max(
        0,
        $.indexOf(ne.current ?? $[0])
      ), h = $[Math.max(0, Math.min($.length - 1, a + i))];
      ee(h), ae.current || H(h);
    },
    [H, $]
  ), pt = we(
    async (i) => {
      const a = ir(
        Ue.current,
        ne.current
      );
      if (!m || Ke.current || T || oe || !s || Ze(i) && (U == null ? void 0 : U.kind) !== "ready" || !a.length)
        return;
      const h = ++Qe.current, w = m.id, I = [...$], O = Y, P = ne.current, z = new Set(Ue.current), ue = new Map(
        a.map((j) => [j, me.current.get(j) ?? 0])
      ), ie = () => h === Qe.current && m.id === w;
      Ke.current = !0, st(!0), at(
        Ue.current.size ? `${a.length} selected videos` : "the focused video"
      ), Se(""), qe("");
      const Xt = O.items.filter(
        (j) => !a.includes(j.id)
      ), Jr = Xt.map((j) => j.id), Yt = or(
        I,
        Jr,
        P,
        a.includes(P ?? -1)
      );
      $e({
        items: Xt,
        totalCount: O.totalCount
      }), de((j) => {
        const Q = new Set(j);
        for (const W of a) Q.delete(W);
        return Q;
      }), ee(Yt), ae.current || H(Yt);
      let gt = !1;
      try {
        if (await Rn(i, a), gt = !0, !ie()) return;
        de((j) => {
          const Q = new Set(j);
          for (const W of a)
            (me.current.get(W) ?? 0) === ue.get(W) && Q.delete(W);
          return Q;
        }), Se(
          `${i.label}: ${a.length} video${a.length === 1 ? "" : "s"} ${i.steps.length ? "updated" : "skipped"}.`
        );
      } catch (j) {
        if (!ie()) return;
        $e(O), de((Q) => {
          const W = new Set(Q);
          for (const fe of a)
            z.has(fe) && (me.current.get(fe) ?? 0) === ue.get(fe) && W.add(fe);
          return W;
        }), ee(P), ae.current || H(P), qe(
          j instanceof Error ? j.message : "Action failed."
        );
      }
      try {
        if (await vn(i), !ie()) return;
        const j = await be(m, J);
        if (!ie()) return;
        let Q = j.items.map((W) => W.id);
        if (!Q.length && j.totalCount > 0 && Number(J.page) > 1) {
          const W = Math.max(1, Number(J.page) - 1), fe = { ...J, page: W };
          Fe(fe), Q = (await be(m, fe)).items.map((mt) => mt.id), de(
            (mt) => new Set([...mt].filter((zr) => Q.includes(zr)))
          );
          const er = Q.at(-1) ?? null;
          ee(er), ae.current || H(er);
        } else {
          de(
            (fe) => new Set([...fe].filter((Zt) => Q.includes(Zt)))
          );
          const W = or(
            I,
            Q,
            P,
            gt && a.includes(P ?? -1)
          );
          ee(W), ae.current && W == null && ve(!1), ae.current || H(W);
        }
      } catch (j) {
        ie() && qe(
          (Q) => `${Q ? `${Q} ` : ""}${gt ? "The action completed, but " : ""}the queue could not be refreshed. ${j instanceof Error ? j.message : "Refresh failed."}`
        );
      } finally {
        ie() && (Ke.current = !1, st(!1), at(""));
      }
    },
    [
      s,
      U,
      be,
      J,
      H,
      $,
      Y,
      T,
      oe,
      m
    ]
  );
  function Fr() {
    var h;
    const i = (h = zt.current) == null ? void 0 : h.firstElementChild, a = i ? getComputedStyle(i).gridTemplateColumns : "";
    return Math.max(1, a.split(" ").filter(Boolean).length);
  }
  function $r(i) {
    if (i.defaultPrevented || i.repeat || i.ctrlKey || i.altKey || i.metaKey || xt) return;
    if (se && i.key === "Escape") {
      te(i), ve(!1), H(ne.current);
      return;
    }
    if (!an(i.target)) return;
    if (i.key === "Escape") {
      te(i), Ie(() => /* @__PURE__ */ new Set());
      return;
    }
    const a = (m == null ? void 0 : m.actions.findIndex(
      (I, O) => Oe(I, O) === i.key
    )) ?? -1;
    if (a >= 0 && (m != null && m.actions[a])) {
      te(i), !x && !T && pt(m.actions[a]);
      return;
    }
    if (!se && i.key === " ") {
      te(i), Z != null && Ie((I) => wt(I, Z));
      return;
    }
    if (!se && i.key.toLowerCase() === "a") {
      te(i), Ie(
        (I) => sn(I, $)
      );
      return;
    }
    if (x || T || se) return;
    if (i.key === "Enter" && Z != null) {
      te(i), ve(!0);
      return;
    }
    const h = Fr(), w = i.key === "ArrowLeft" ? -1 : i.key === "ArrowRight" ? 1 : i.key === "ArrowUp" ? -h : i.key === "ArrowDown" ? h : 0;
    w && (te(i), ft(w));
  }
  function Ge(i) {
    _(i), ur(i);
  }
  function _r() {
    nt.current = !0, V({}), Ge("");
  }
  async function Wt(i) {
    if (!l) return !1;
    const a = i.map(Bn);
    try {
      await pn(l, a);
    } catch (w) {
      throw w;
    }
    r(a), b && !a.some((w) => w.id === b) && Ge("");
    const h = a.find((w) => w.id === b);
    return h && F && JSON.stringify(h) !== JSON.stringify(F) && (h.view.displayMode !== F.view.displayMode && ot(cr(h)), Ne(h) !== Ne(F) && (Re(null), Xe(
      h,
      ge({ ...h.view.filter, page: J.page })
    ))), !0;
  }
  if (c)
    return /* @__PURE__ */ n(fr, { label: "Loading reviews…" });
  if (E)
    return /* @__PURE__ */ u(Ae, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Wn().catch(
            (i) => p(
              "Could not export browser reviews. " + (i instanceof Error ? i.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        pr,
        {
          message: E,
          onRetry: () => void Qt()
        }
      )
    ] });
  return /* @__PURE__ */ u("div", { className: "data-quality-page", onKeyDown: $r, children: [
    /* @__PURE__ */ u("header", { className: "data-quality-header", children: [
      m && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: x,
          onClick: _r,
          children: /* @__PURE__ */ n(mr, {})
        }
      ),
      /* @__PURE__ */ u("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (m == null ? void 0 : m.name) ?? "Data Quality" }),
        (m == null ? void 0 : m.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: m.description })
      ] }),
      m && F && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: x || T || !C,
          onClick: () => {
            Ft(!0), it(!0);
          },
          children: /* @__PURE__ */ n(hr, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: x || T || !C,
          onClick: () => {
            Ft(!1), it(!0);
          },
          children: /* @__PURE__ */ n(Zr, {})
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
          disabled: Je,
          onClick: () => {
            ze(!0), Ve(""), En().then(We).catch(
              (i) => Ve(
                "Could not create the Confirmed absent tags custom field. " + (i instanceof Error ? i.message : "Request failed.")
              )
            ).finally(() => ze(!1));
          },
          children: Je ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    ((U == null ? void 0 : U.kind) === "incompatible" || Kt) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(Nt, {}),
      Kt || (U == null ? void 0 : U.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: Je,
          onClick: () => {
            ze(!0), We().finally(
              () => ze(!1)
            );
          },
          children: Je ? "Checking…" : "Check again"
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
            ), h = document.createElement("a");
            h.href = a, h.download = "data-quality-unassigned-legacy-reviews.json", h.click(), URL.revokeObjectURL(a);
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
            L(""), N(!1);
          },
          children: f ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    m && F && /* @__PURE__ */ u("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${x || T ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": x || T || void 0,
          inert: x || T ? !0 : void 0,
          onClickCapture: (i) => {
            var h, w, I, O, P;
            const a = i.target instanceof Element ? i.target.closest("button") : null;
            (a == null ? void 0 : a.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((h = a == null ? void 0 : a.textContent) == null ? void 0 : h.trim()) === "Clear all" ? he.current = !0 : ((w = a == null ? void 0 : a.getAttribute("aria-label")) != null && w.startsWith("Filters") || (I = a == null ? void 0 : a.getAttribute("aria-label")) != null && I.startsWith("Edit filter:") || ((O = a == null ? void 0 : a.textContent) == null ? void 0 : O.trim()) === "Cancel" || (P = a == null ? void 0 : a.getAttribute("aria-label")) != null && P.startsWith("Close ")) && (he.current = !1);
          },
          onKeyDownCapture: (i) => {
            var h, w;
            const a = i.target instanceof Element ? i.target.closest("button") : null;
            (i.key === "Delete" || i.key === "Backspace") && (a == null ? void 0 : a.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (i.preventDefault(), i.stopPropagation(), he.current = !0, (w = (h = a.parentElement) == null ? void 0 : h.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || w.click()) : i.key === "Escape" && (he.current = !1);
          },
          children: /* @__PURE__ */ n(
            Hr,
            {
              filter: oe ? Tr : J,
              onFilterChange: Ur,
              totalCount: Y.totalCount,
              sortOptions: vt,
              showSearch: !0,
              showSort: !0,
              displayMode: je,
              onDisplayModeChange: (i) => ot(dr(i)),
              availableDisplayModes: ["grid", "wall"],
              zoomLevel: (Be - 225) / 50,
              onZoomChange: (i) => Ut(Math.round(225 + i * 50)),
              cardSizeEntityType: "videos",
              criteriaDefinitions: xr,
              objectFilter: dt,
              onObjectFilterChange: (i) => {
                if (!x && !T) {
                  const a = xn(i);
                  xe.current = Dn(
                    m.view.objectFilter,
                    a,
                    he.current
                  ), he.current = !1;
                }
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (X == null ? void 0 : X.id) === b && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n("span", { children: "Temporary queue" }),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: x || T || !C,
            onClick: Br,
            children: "Save queue to review"
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: x || T,
            onClick: jr,
            children: "Reset to review defaults"
          }
        )
      ] })
    ] }),
    m ? /* @__PURE__ */ u(Ae, { children: [
      De.error && /* @__PURE__ */ n("p", { role: "alert", children: De.error }),
      /* @__PURE__ */ n(
        kn,
        {
          videos: Y.items,
          review: m,
          trees: De.ids,
          disabled: x || T,
          onChoose: (i) => {
            const a = Tn(m, i);
            Re(a), Xe(a, { ...J, page: 1 });
          }
        }
      ),
      lt && !se && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(Nt, {}),
        lt
      ] }),
      jt && /* @__PURE__ */ n("p", { role: "status", className: "dq-status", children: jt }),
      Gt("top"),
      /* @__PURE__ */ u("div", { className: "dq-workspace", children: [
        /* @__PURE__ */ u("main", { children: [
          T && !Y.items.length && /* @__PURE__ */ n(fr, { label: "Loading review queue…" }),
          oe && !T && /* @__PURE__ */ n(
            pr,
            {
              message: oe,
              onRetry: () => void be(
                m,
                J,
                Pr
              ).catch(() => {
              })
            }
          ),
          !x && !T && !oe && !Y.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
            /* @__PURE__ */ n(rr, {}),
            /* @__PURE__ */ n("p", { children: "No videos match this review." })
          ] }),
          !!Y.items.length && /* @__PURE__ */ n("div", { ref: zt, children: /* @__PURE__ */ n(
            "div",
            {
              className: "dq-grid",
              style: {
                "--dq-card-width": `${Be}px`
              },
              children: Y.items.map(Vr)
            }
          ) })
        ] }),
        /* @__PURE__ */ u("aside", { className: "dq-actions", children: [
          ce.size > 0 && /* @__PURE__ */ n("strong", { children: Ht }),
          m.actions.map((i, a) => /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              disabled: x || T || !!oe || !s || Ze(i) && (U == null ? void 0 : U.kind) !== "ready" || !Dr.length,
              onClick: () => void pt(i),
              children: [
                Oe(i, a) && /* @__PURE__ */ n("kbd", { children: Oe(i, a) }),
                /* @__PURE__ */ n("span", { children: i.label }),
                /* @__PURE__ */ n("small", { children: i.steps.length ? `${i.steps.length} step(s)` : "Skip" })
              ]
            },
            i.id
          )),
          !m.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
          !s && /* @__PURE__ */ n("p", { children: "Video write permission is required to apply actions." }),
          x && /* @__PURE__ */ u("p", { role: "status", children: [
            /* @__PURE__ */ n(yr, { className: "dq-spin" }),
            " Applying action to",
            " ",
            Mr,
            "…"
          ] }),
          /* @__PURE__ */ n("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
        ] })
      ] }),
      Gt("bottom")
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
                  ref: Mt,
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
                    value: le,
                    onChange: (i) => pe(
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
                  "aria-label": re === "asc" ? "Ascending" : "Descending",
                  title: re === "asc" ? "Ascending" : "Descending",
                  onClick: () => Ir(
                    (i) => i === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    br,
                    {
                      className: re === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: kr.map((i) => {
            const a = B[i.id];
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                disabled: x,
                onClick: () => Ge(i.id),
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
      /* @__PURE__ */ n(rr, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    se && ye && m && /* @__PURE__ */ n(
      Jn,
      {
        video: ye,
        review: m,
        targetLabel: Ht,
        pending: x,
        refreshing: T || !!oe,
        error: lt,
        canWrite: s,
        assessmentReady: (U == null ? void 0 : U.kind) === "ready",
        selected: ce.has(ye.id),
        hasPrevious: $.indexOf(ye.id) > 0,
        hasNext: $.indexOf(ye.id) >= 0 && $.indexOf(ye.id) < $.length - 1,
        onToggleSelected: () => Ie((i) => wt(i, ye.id)),
        onPrevious: () => ft(-1),
        onNext: () => ft(1),
        onClose: () => {
          ve(!1), H(ne.current);
        },
        onAction: pt
      }
    ),
    xt && /* @__PURE__ */ n(
      zn,
      {
        reviews: t,
        activeReview: F,
        initialEdit: Dt,
        onSave: Wt,
        onChoose: Ge,
        onClose: () => {
          it(!1), Dt && H(ne.current, !1);
        }
      }
    )
  ] });
  async function Xe(i, a, h = !1) {
    const w = ne.current, I = Math.max(0, $.indexOf(w ?? -1));
    try {
      const P = (await be(i, a, h)).items.map((ue) => ue.id);
      de(
        (ue) => new Set([...ue].filter((ie) => P.includes(ie)))
      );
      const z = nr(P, w, I);
      ee(z), ae.current || H(z, !1);
    } catch {
    }
  }
  function Ur(i) {
    const a = xe.current;
    if (xe.current = null, x || T || !m || !F) return;
    const h = a ?? m.view.objectFilter, w = It(
      h,
      F.view.objectFilter
    ) ? F.view.objectFilter : h, I = ge({ ...i, page: 1 }), O = {
      ...m,
      view: {
        ...m.view,
        filter: I,
        objectFilter: w
      }
    }, P = Ne(O) !== Ne(F), z = P ? O : F;
    Re(P ? O : null), Se(P ? "" : "Review queue defaults restored."), Xe(z, I);
  }
  function jr() {
    if (x || T || !F) return;
    xe.current = null;
    const i = ge({
      ...F.view.filter,
      page: 1
    });
    Re(null), Se("Review queue defaults restored."), Xe(
      F,
      i,
      F.view.startFrom !== "beginning"
    );
  }
  function Br() {
    x || T || !m || !F || !C || Wt(
      t.map(
        (i) => i.id === b ? {
          ...i,
          view: {
            ...m.view,
            filter: { ...J, page: 1 }
          }
        } : i
      )
    ).then(() => {
      Re(null), Se("Queue saved to this review.");
    }).catch(
      (i) => qe(
        i instanceof Error ? i.message : "Could not save queue."
      )
    );
  }
  function Kr() {
    de(/* @__PURE__ */ new Set()), me.current.clear(), ee(null);
  }
  function Gt(i) {
    return m ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: x || T,
        "aria-label": `Review queue pagination ${i}`,
        children: /* @__PURE__ */ n(
          Wr,
          {
            filter: {
              ...J,
              page: Number(J.page) || 1,
              perPage: Number(J.perPage) || 40
            },
            totalCount: Y.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${i}`,
            onFilterChange: (a) => {
              x || T || a.page === Number(J.page) || jn(
                { ...J, page: a.page },
                m,
                be,
                Kr
              );
            }
          }
        )
      }
    ) : null;
  }
  function Vr(i) {
    return /* @__PURE__ */ n(
      Kn,
      {
        video: In(i, m, De.ids),
        displayMode: je,
        focused: i.id === Z,
        selected: ce.has(i.id),
        setRef: (a) => {
          a ? ct.current.set(i.id, a) : ct.current.delete(i.id);
        },
        onFocus: () => ee(i.id),
        onToggle: () => Ie((a) => wt(a, i.id)),
        onPreview: () => {
          ee(i.id), ve(!0);
        },
        onNavigate: e
      },
      i.id
    );
  }
}
function jn(e, t, r, o) {
  o(), r(t, e).catch(() => {
  });
}
function wt(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Bn(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Kn({
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
  const p = qr(e), s = D(null), g = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, C = !!(g.date || g.studioName), A = !!(g.performers.length || g.tags.length);
  return gr(() => {
    const y = s.current;
    if (!y) return;
    const q = y.querySelector(
      `a[href="/video/${e.id}"]`
    ), k = y.querySelector(".card-title"), L = `dq-card-title-${e.id}`;
    k && (k.id = L), q && (q.target = "_blank", q.rel = "noreferrer", q.removeAttribute("aria-label"), q.setAttribute("aria-labelledby", L), q.classList.add("dq-card-link"));
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
          Xr,
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
        t === "wall" && /* @__PURE__ */ n(Vn, { video: e })
      ]
    }
  );
}
function Vn({ video: e }) {
  const t = D(null), r = D(null), [o, l] = S(!1), [d, c] = S(!1), [v, E] = S(!1);
  return G(() => {
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
  }, [e.id, e.files.length]), G(() => {
    if (!o) {
      E(!1);
      return;
    }
    const p = new AbortController();
    return K(wn(e.id), {
      signal: p.signal
    }).then((s) => {
      p.signal.aborted || E(s.available === !0);
    }).catch(() => {
      p.signal.aborted || E(!1);
    }), () => p.abort();
  }, [o, e.id]), G(() => {
    const p = r.current;
    p && (d ? Promise.resolve(p.play()).catch(() => {
    }) : p.pause());
  }, [v, d]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: v && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: yn(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Jn({
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
  const k = D(null), L = D(null), f = e.files[0], N = qr(e);
  G(() => {
    var _;
    const b = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (_ = k.current) == null || _.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = b;
    };
  }, []);
  function R(b) {
    var V, le, pe;
    if (b.key !== "Tab") return;
    const _ = [
      ...((V = k.current) == null ? void 0 : V.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((re) => re.offsetParent !== null);
    if (!_.length) {
      b.preventDefault(), (le = k.current) == null || le.focus();
      return;
    }
    const B = _.indexOf(
      document.activeElement
    );
    b.shiftKey && B <= 0 ? (b.preventDefault(), (pe = _.at(-1)) == null || pe.focus()) : !b.shiftKey && B === _.length - 1 && (b.preventDefault(), _[0].focus());
  }
  function M(b) {
    if (b.defaultPrevented || b.ctrlKey || b.metaKey || b.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const _ = b.key === "ArrowLeft" || b.key === "ArrowRight";
    if (b.altKey && !_) return;
    const B = L.current, V = b.currentTarget.querySelector("video");
    if (b.key === "Enter" || b.key === "Escape")
      b.repeat || y();
    else if (b.key === " " && B)
      b.repeat || B.toggle();
    else if (_ && B)
      B.seekBy(
        (b.key === "ArrowLeft" ? -1 : 1) * (b.shiftKey ? 5 : b.altKey ? 10 : 60)
      );
    else if ((b.key === "," || b.key === ".") && B) {
      const le = [f == null ? void 0 : f.duration, V == null ? void 0 : V.duration].find(
        (re) => re != null && Number.isFinite(re) && re > 0
      ) ?? 0, pe = e.parentVideoId != null ? (e.clipEndSec ?? le) - (e.clipStartSec ?? 0) : le;
      Number.isFinite(pe) && pe > 0 && B.seekBy((b.key === "," ? -1 : 1) * pe * 0.1);
    } else if (b.key.toLowerCase() === "n" || b.key.toLowerCase() === "m")
      !b.repeat && !o && !l && (b.key.toLowerCase() === "n" && p && C(), b.key.toLowerCase() === "m" && s && A());
    else if (b.key === "ArrowUp" && V)
      V.volume = Math.min(1, V.volume + 0.1);
    else if (b.key === "ArrowDown" && V)
      V.volume = Math.max(0, V.volume - 0.1);
    else return;
    te(b);
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
      onKeyDownCapture: M,
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
              children: /* @__PURE__ */ n(mr, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !s || o || l,
              onClick: A,
              children: /* @__PURE__ */ n(br, {})
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
              children: /* @__PURE__ */ n(en, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: y,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(wr, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: f ? /* @__PURE__ */ n(
          Gr,
          {
            autostart: !0,
            streamUrl: bn(e.id),
            posterUrl: ar(e),
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
        ) : /* @__PURE__ */ n("img", { src: ar(e), alt: "" }) }),
        d && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: d }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((b, _) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: o || l || !c || Ze(b) && !v,
            onClick: () => void q(b),
            children: [
              Oe(b, _) && /* @__PURE__ */ n("kbd", { children: Oe(b, _) }),
              b.label
            ]
          },
          b.id
        )) })
      ] })
    }
  );
}
function zn({
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
      te(f), s || d();
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
    ].filter((B) => B.offsetParent !== null);
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
    ), p("");
  }
  async function q() {
    if (s) return;
    if (!c || Ct(c)) {
      p(c ? Ct(c) : "Choose a review.");
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
  async function L(f) {
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
        const M = Pe(await N.text());
        if (!await o(At(e, M)))
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
              children: /* @__PURE__ */ n(wr, {})
            }
          )
        ] }),
        E && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: E }),
        /* @__PURE__ */ n("fieldset", { disabled: s, className: "dq-manager-content", children: c ? /* @__PURE__ */ n(
          Qn,
          {
            draft: c,
            saving: s,
            setDraft: v,
            onSave: () => void q(),
            onCancel: d
          }
        ) : /* @__PURE__ */ u(Ae, { children: [
          /* @__PURE__ */ u("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ u(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => y(),
                children: [
                  /* @__PURE__ */ n(tn, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ u("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(rn, {}),
              " Import reviews",
              /* @__PURE__ */ n(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: L
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
              /* @__PURE__ */ n(hr, {}),
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
                children: /* @__PURE__ */ n(vr, {})
              }
            )
          ] }, f.id)) })
        ] }) })
      ] })
    }
  );
}
function Qn({
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
      Yr,
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
      /* @__PURE__ */ n("section", { hidden: d !== "Queue", className: "dq-editor-section", children: /* @__PURE__ */ n(lr, { draft: e, onChange: r, presentation: !1 }) }),
      /* @__PURE__ */ n("section", { hidden: d !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(lr, { draft: e, onChange: r, queue: !1 }) }),
      /* @__PURE__ */ u("section", { hidden: d !== "Actions", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Actions" }),
        /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
        /* @__PURE__ */ n(
          tr,
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
                        children: /* @__PURE__ */ n(Sr, {})
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
                    tr,
                    {
                      items: s.steps,
                      getKey: E,
                      disabled: t,
                      className: "dq-sortable-list",
                      onReorder: (y) => p(g, { ...s, steps: y }),
                      renderItem: (y, { index: q, dragHandleProps: k, isOver: L }) => /* @__PURE__ */ n(
                        Hn,
                        {
                          dragHandleProps: k,
                          saving: t,
                          isOver: L,
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
function Hn({
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
        children: /* @__PURE__ */ n(Sr, {})
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
      Et,
      {
        entityType: "tag",
        values: e.tagIds,
        onChange: (v) => d({ ...e, tagIds: v }),
        placeholder: "Choose tags",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: c, children: /* @__PURE__ */ n(vr, {}) })
  ] });
}
async function Wn() {
  const e = await K("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
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
function fr({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(yr, { className: "dq-spin" }),
    e
  ] });
}
function pr({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(Nt, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const ti = { components: { DataQualityPage: Un } };
export {
  Un as DataQualityPage,
  ti as default,
  It as objectFiltersEqual
};
