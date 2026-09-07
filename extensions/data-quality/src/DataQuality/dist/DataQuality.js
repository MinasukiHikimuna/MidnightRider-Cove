import { jsxs as f, jsx as i, Fragment as Re } from "react/jsx-runtime";
import { useState as S, useEffect as G, useRef as x, useMemo as Oe, useCallback as ve, useLayoutEffect as Nr } from "react";
import { VIDEO_SORT_OPTIONS as Ct, FilterDialog as cn, VIDEO_CRITERIA as At, EntityReferenceMultiSelector as Rt, DetailListToolbar as dn, DetailListPagination as un, VideoPlayer as fn, VideoCard as pn, EntityDetailTabs as gn, SortableList as dr } from "@cove/runtime/components";
import { ChevronLeft as Cr, Pencil as Ar, Settings as mn, AlertTriangle as qt, Save as hn, RotateCcw as bn, ChevronRight as Rr, Film as ur, Loader2 as qr, ExternalLink as yn, X as Tr, Plus as wn, Upload as vn, Trash2 as Ir, GripVertical as Or } from "@cove/runtime/lucide-react";
import { extensionFetch as Sn } from "@cove/runtime/api";
function Me(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function Tt(e) {
  if (e.actions.some(kr))
    return "An action cannot contain contradictory assessments for the same tag.";
  if (!e.name.trim() || !e.actions.every(Dt))
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
function fr(e, t, r) {
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
function Dt(e) {
  return !!e.label.trim() && e.steps.every(
    (t) => [
      "ADD",
      "REMOVE",
      "REMOVE_TREE",
      "MARK_PRESENT",
      "MARK_ABSENT",
      "CLEAR_ABSENCE"
    ].includes(t.mode) && t.tagIds.length > 0 && t.tagIds.every((r) => Number.isSafeInteger(r) && r > 0)
  ) && !kr(e);
}
function rt(e) {
  return e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  );
}
function kr(e) {
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
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && En(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (o) => typeof o == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (o) => typeof (o == null ? void 0 : o.id) == "string" && typeof o.label == "string" && (o.shortcut === void 0 || typeof o.shortcut == "string") && Array.isArray(o.steps) && o.steps.every((l) => l && Array.isArray(l.tagIds)) && Dt(o)
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => Tt(r)))
    throw new Error(
      "Saved reviews contain invalid actions or shortcuts. Existing data has been kept; assign shortcuts 1–9 only once or leave them empty."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function En(e) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.cardSize === void 0 || t.cardSize === null || Number.isFinite(t.cardSize) && t.cardSize >= 115 && t.cardSize <= 380) && (t.annotations === void 0 || Array.isArray(t.annotations) && t.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [t.annotationParents, t.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0)
  );
}
function It(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const o of e)
    for (const l of o)
      r.has(l.id) || (r.add(l.id), t.push(l));
  return t;
}
function pr(e, t) {
  return e.size > 0 ? [...e].sort((r, o) => r - o) : t == null ? [] : [t];
}
function gr(e, t, r, o) {
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
function Nn(e, t) {
  const r = new Set(e), o = t.length > 0 && t.every((l) => r.has(l));
  for (const l of t)
    o ? r.delete(l) : r.add(l);
  return r;
}
function Cn(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const Mr = "ext:com.midnightrider.data-quality:configuration", An = "ext:cove-data-quality:video-reviews", Ot = "ext:com.midnightrider.data-quality:progress", Le = /* @__PURE__ */ new Map(), tt = /* @__PURE__ */ new Map(), vt = (e, t) => e.includes("*") || e.includes(t), nt = (e) => B(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Rn = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function kt(e) {
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
    reviews: Pe(JSON.stringify(t.reviews)),
    deletedIds: kt(t.deletedIds),
    importedIds: kt(t.importedIds)
  };
}
function qn(e) {
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
    kt(
      JSON.parse(localStorage.getItem(`${l}:account-imports`) ?? "[]")
    ).forEach((c) => o.add(c));
  }
  return {
    reviews: r ?? [],
    known: [...o],
    present: r !== void 0
  };
}
async function Pr(e) {
  const t = await B("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Lr(e, t) {
  const r = (tt.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return tt.set(e, r), r.finally(() => {
    tt.get(e) === r && tt.delete(e);
  }).catch(() => {
  }), r;
}
let ke = null;
function Tn() {
  if (ke) return ke;
  const e = In();
  return ke = e, e.finally(() => {
    ke === e && (ke = null);
  }).catch(() => {
  }), e;
}
async function In() {
  var A;
  const e = await B("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, o = vt(e.permissions, "savedfilters.read"), l = o && vt(e.permissions, "savedfilters.write"), d = o ? (await nt(Mr)).filter((R) => R.name === "Data Quality configuration").sort((R, w) => R.id - w.id) : [];
  if (d.length > 1) {
    const R = (w) => {
      const { revision: T, ...O } = Ae(w.uiOptions);
      return JSON.stringify(O);
    };
    if (d.some((w) => R(w) !== R(d[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (l)
      for (const w of d.slice(1))
        await B(`/api/savedfilters/${w.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${w.id}` })
        });
    d.splice(1);
  }
  let c = d.length ? Ae(d[0].uiOptions) : Rn();
  const v = localStorage.getItem(`${r}:migrated`) === "true", E = localStorage.getItem(r), g = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && E && (c = Ae(E));
  let a = !d.length;
  if (d.length && g && E) {
    const R = Ae(E);
    if (R.reviews.some((T) => {
      const O = c.reviews.find((P) => P.id === T.id);
      return O && JSON.stringify(O) !== JSON.stringify(T);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const w = [
      .../* @__PURE__ */ new Set([...c.deletedIds, ...R.deletedIds])
    ];
    c = {
      ...c,
      reviews: It(c.reviews, R.reviews).filter(
        (T) => !w.includes(T.id)
      ),
      deletedIds: w,
      importedIds: [
        .../* @__PURE__ */ new Set([...c.importedIds, ...R.importedIds])
      ]
    }, a = !0;
  }
  if (!v) {
    const R = JSON.stringify(c), w = qn(t);
    if (d.length && w.reviews.some((p) => {
      const N = c.reviews.find((q) => q.id === p.id);
      return N && JSON.stringify(N) !== JSON.stringify(p);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const T = o ? (await nt(An)).flatMap(
      (p) => Pe(p.uiOptions ?? "[]")
    ) : [], O = w.known.filter(
      (p) => !w.reviews.some((N) => N.id === p)
    ), P = /* @__PURE__ */ new Set([...c.deletedIds, ...O]);
    c = {
      ...c,
      reviews: It(
        w.reviews,
        c.reviews,
        T.filter(
          (p) => !w.known.includes(p.id) && !c.importedIds.includes(p.id)
        )
      ).filter((p) => !P.has(p.id)),
      deletedIds: [...P],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...c.importedIds,
          ...w.known,
          ...T.map((p) => p.id)
        ])
      ]
    }, a || (a = JSON.stringify(c) !== R);
  }
  const m = {
    userId: t,
    recordId: (A = d[0]) == null ? void 0 : A.id,
    config: c,
    readable: o,
    writable: l,
    durable: l
  };
  if (Le.set(r, m), a && l) {
    const R = c;
    d.length && (m.config = Ae(d[0].uiOptions)), await Dr(r, R), c = m.config;
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
async function Dr(e, t) {
  const r = Le.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const o = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await Pr(r), r.recordId != null) {
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
          mode: Mr,
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
function On(e, t) {
  return Pe(JSON.stringify(t)), Lr(e, async () => {
    const r = Le.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const o = r.config.reviews.filter((l) => !t.some((d) => d.id === l.id)).map((l) => l.id);
    await Dr(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...o])
      ].filter((l) => !t.some((d) => d.id === l))
    });
  });
}
function mr(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function kn(e, t) {
  const r = Le.get(e);
  if (!r) return null;
  const o = localStorage.getItem(`${e}:progress:${t}`), l = o ? mr(o) : null;
  if (!r.readable) return l;
  const d = (await nt(Ot)).find(
    (v) => v.name === t
  ), c = d ? mr(d.uiOptions) : null;
  return l && (!c || l.updatedAt > c.updatedAt) ? l : c;
}
function Mn(e, t, r) {
  const o = `${e}:progress:${t}`;
  try {
    localStorage.setItem(o, JSON.stringify(r));
  } catch {
  }
  return Lr(o, async () => {
    const l = Le.get(e);
    if (!(l != null && l.writable)) return;
    await Pr(l);
    const d = (await nt(Ot)).find(
      (c) => c.name === t
    );
    await B(
      d ? `/api/savedfilters/${d.id}` : "/api/savedfilters",
      {
        method: d ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Ot,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const De = "confirmed_absent_tags", xt = "Confirmed absent tags", Pn = {
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
      t === "modifier" && typeof r == "string" ? Pn[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === De.toLowerCase() ? r.toLowerCase() : it(r)
    ])
  ) : e;
}
async function B(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const o = await Sn(e, { ...t, headers: r });
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
function Ln(e) {
  return `/api/stream/video/${e}`;
}
function hr(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Dn(e) {
  return `/api/stream/video/${e}/preview`;
}
function xn(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function $n(e) {
  return e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function $t(e) {
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
function _n(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${De} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function _t() {
  const t = (await B("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === De.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${xt} custom field before applying tag assessments.`
    };
  const r = _n(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function Fn() {
  const e = await _t();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await B("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: De,
        label: xt,
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
function Un(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${De} value is not a valid tag list.`
    );
  return ot(e);
}
function jn(e) {
  return ot(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function Kn(e, t) {
  let r;
  try {
    r = await _t();
  } catch (g) {
    throw new Error(
      `Could not verify the ${xt} custom field. ${g instanceof Error ? g.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const o = await Promise.all(
    e.steps.map(async (g) => ({
      ...g,
      tagIds: g.mode === "REMOVE_TREE" ? await $t(g.tagIds) : ot(g.tagIds)
    }))
  ), l = o.filter(
    (g) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(g.mode)
  ), d = o.filter(
    (g) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(g.mode)
  ), c = ot(t), v = r.definition.key;
  let E = 0;
  for (const g of c)
    try {
      const a = await B(`/api/videos/${g}`), m = jn(a), A = { ...a.customFields ?? {} }, R = A[v], w = Un(R), T = new Set(m), O = new Set(w);
      for (const q of l)
        for (const L of q.tagIds)
          q.mode === "ADD" ? T.add(L) : T.delete(L);
      for (const q of d)
        for (const L of q.tagIds)
          q.mode === "MARK_PRESENT" ? (T.add(L), O.delete(L)) : q.mode === "MARK_ABSENT" ? (T.delete(L), O.add(L)) : O.delete(L);
      const P = [...T], p = [...O];
      JSON.stringify(m) === JSON.stringify(P) && JSON.stringify(w) === JSON.stringify(p) && (R === void 0 ? p.length === 0 : JSON.stringify(R) === JSON.stringify(w)) || await B(`/api/videos/${g}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: P,
          customFields: {
            ...A,
            [v]: p
          }
        })
      }), E++;
    } catch (a) {
      throw new Error(
        `Assessment stopped after ${E} video${E === 1 ? "" : "s"} completed; video ${g} was affected. Refresh and inspect it before retrying. ${a instanceof Error ? a.message : "Request failed."}`
      );
    }
}
async function Bn(e, t) {
  if (!Dt(e) || t.length === 0 || t.some((o) => !Number.isSafeInteger(o) || o <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (rt(e)) {
    await Kn(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (o) => ({
      mode: o.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: o.mode === "REMOVE_TREE" ? await $t(o.tagIds) : o.tagIds
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
function Vn(e) {
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
        async (m) => [m, await $t([m])]
      )
    ).then((m) => {
      a && r(Object.fromEntries(m));
    }).catch(() => {
      a && l(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      a = !1;
    };
  }, [c]), { ids: t, error: o };
}
function Jn(e, t, r) {
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
function zn({
  videos: e,
  review: t,
  trees: r,
  disabled: o,
  onChoose: l
}) {
  var v, E, g;
  const d = new Set(
    (((v = t.presentation) == null ? void 0 : v.binParents) ?? []).flatMap(
      (a) => (r[a] ?? []).filter((m) => m !== a)
    )
  ), c = /* @__PURE__ */ new Map();
  for (const a of e)
    for (const m of a.tags ?? [])
      if (d.has(m.id)) {
        const A = c.get(m.id) ?? { name: m.name, count: 0 };
        A.count++, c.set(m.id, A);
      }
  return (g = (E = t.presentation) == null ? void 0 : E.binParents) != null && g.length ? /* @__PURE__ */ f("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ i("span", { children: "Tags on this page:" }),
    [...c].sort((a, m) => a[1].name.localeCompare(m[1].name)).map(([a, m]) => /* @__PURE__ */ f(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: o,
        onClick: () => l(a),
        children: [
          m.name,
          " (",
          m.count,
          ")"
        ]
      },
      a
    )),
    !c.size && /* @__PURE__ */ i("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function Qn(e, t) {
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
function br({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: o = !0
}) {
  const [l, d] = S(!1), c = e.view.filter, v = (a) => t({
    ...e,
    view: { ...e.view, filter: { ...c, ...a } }
  }), E = e.presentation ?? {}, g = (a) => t({ ...e, presentation: { ...E, ...a } });
  return /* @__PURE__ */ f(Re, { children: [
    o && /* @__PURE__ */ f("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ i("legend", { children: "Queue" }),
      /* @__PURE__ */ f("label", { children: [
        "Search",
        /* @__PURE__ */ i(
          "input",
          {
            value: String(c.q ?? ""),
            onChange: (a) => v({ q: a.target.value })
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
              onChange: (a) => v({ sort: a.target.value, sorts: void 0 }),
              children: [
                !Ct.some((a) => a.value === c.sort) && c.sort != null && /* @__PURE__ */ i("option", { value: String(c.sort), children: String(c.sort) }),
                Ct.map((a) => /* @__PURE__ */ i("option", { value: a.value, children: a.label }, a.value))
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
              onChange: (a) => v({ direction: a.target.value }),
              children: [
                /* @__PURE__ */ i("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ i("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ f("label", { children: [
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
        /* @__PURE__ */ f("label", { children: [
          "Start from",
          /* @__PURE__ */ f(
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
      /* @__PURE__ */ f("p", { children: [
        Object.keys(e.view.objectFilter).length ? "Video filters configured" : "No video filters",
        ". Choose which videos enter the queue."
      ] }),
      l && /* @__PURE__ */ i("div", { onKeyDown: (a) => a.stopPropagation(), children: /* @__PURE__ */ i(
        cn,
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
    r && /* @__PURE__ */ f(Re, { children: [
      /* @__PURE__ */ i("h3", { children: "Appearance" }),
      /* @__PURE__ */ i("p", { className: "dq-editor-note", children: "Choose how videos and tags appear while reviewing." }),
      /* @__PURE__ */ i("div", { className: "dq-field-grid", children: /* @__PURE__ */ f("label", { children: [
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
        const m = E.annotations ?? [];
        return /* @__PURE__ */ f("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ i(
            "input",
            {
              type: "checkbox",
              checked: m.includes(a),
              onChange: (A) => g({
                annotations: A.target.checked ? [...m, a] : m.filter((R) => R !== a)
              })
            }
          ),
          a
        ] }, a);
      }) }),
      (E.annotations ?? []).includes("tags") && /* @__PURE__ */ f(Re, { children: [
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
const Wn = {
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
function Ft(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Hn(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function Gn(e) {
  return [
    ...new Set(
      Ft(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Xn(e, t) {
  const r = Ft(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((o) => {
      const l = String(o.key ?? ""), d = Wn[String(o.modifier ?? "EQUALS")], c = (m, A) => String(A ?? "").trim() || t[String(m)] || String(m ?? ""), v = c(
        o.value,
        o.displayValue
      ), E = c(
        o.value2,
        o.displayValue2
      ), g = String(o.modifier ?? "EQUALS"), a = g === "IS_NULL" || g === "NOT_NULL" ? [] : g === "BETWEEN" || g === "NOT_BETWEEN" ? [v, "and", E] : [v];
      return {
        ...o,
        label: [Hn(l), d, ...a].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function Yn(e) {
  const t = Ft(e.customFieldCriteria);
  return t.length ? {
    ...e,
    customFieldCriteria: t.map(
      ({ label: r, ...o }) => o
    )
  } : e;
}
function Zn(e, t, r) {
  return r || "customFieldCriteria" in t || !Array.isArray(e.customFieldCriteria) ? t : { ...t, customFieldCriteria: e.customFieldCriteria };
}
const Et = 180, ei = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: !1
};
function yr(e) {
  return e.view.displayMode === "wall" ? "wall" : "grid";
}
function wr(e) {
  return e === "wall" ? "wall" : "grid";
}
function ti() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function vr(e) {
  const t = new URLSearchParams(window.location.search);
  e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function ri(e) {
  return ge({ ...e, page: 1 });
}
function Mt(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((c, v) => Mt(c, t[v]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, o = t, l = Object.keys(r).sort(), d = Object.keys(o).sort();
  return l.length === d.length && l.every(
    (c, v) => c === d[v] && Mt(r[c], o[c])
  );
}
function xr(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function re(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
const $r = "data-quality.workspace-layout.v1", Ut = 240, Pt = 192, Lt = 560;
function _r(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(Lt, Math.max(Pt, e)) : Ut;
}
function ni() {
  try {
    const e = JSON.parse(
      localStorage.getItem($r) ?? "null"
    );
    return _r(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return Ut;
  }
}
function ii(e) {
  try {
    localStorage.setItem(
      $r,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function Fr(e) {
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
function Ur(e, t) {
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
function oi(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : Ur(e, t);
}
function si({
  onNavigate: e
}) {
  const [t, r] = S([]), [o] = S(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [l, d] = S(""), [c, v] = S(!0), [E, g] = S(""), [a, m] = S(!1), [A, R] = S(!0), [w, T] = S(""), [O, P] = S(""), [p, N] = S(!1), [q, L] = S(!1), [b, F] = S(ti), [V, J] = S({}), [ce, pe] = S("name"), [ne, jr] = S("asc"), jt = x(null), st = x(!1), [Kt, at] = S(!1), [Bt, Vt] = S(!1), [X, qe] = S(
    null
  ), $ = t.find((n) => n.id === b) ?? null, h = Oe(
    () => (X == null ? void 0 : X.id) === b && $ ? { ...$, view: X.view } : $,
    [X, b, $]
  ), Kr = Oe(() => {
    const n = ne === "asc" ? 1 : -1;
    return [...t].sort((s, u) => {
      if (ce === "count") {
        const y = V[s.id], C = V[u.id], I = typeof y == "number", k = typeof C == "number";
        if (I !== k) return I ? -1 : 1;
        if (I && k && y !== C)
          return (y - C) * n;
      }
      return s.name.localeCompare(u.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * n;
    });
  }, [ne, ce, V, t]), xe = x(
    null
  ), $e = Vn(h), [z, _e] = S({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Br, Vr] = S({
    page: 1,
    perPage: 40
  }), [Y, Fe] = S({ items: [], totalCount: 0 }), [M, Ue] = S(!1), [se, Jt] = S(""), [Jr, zr] = S(!1), [de, ue] = S(() => /* @__PURE__ */ new Set()), je = x(de);
  je.current = de;
  const me = x(/* @__PURE__ */ new Map()), [Z, ee] = S(null), ie = x(Z);
  ie.current = Z;
  const [ae, Se] = S(!1), le = x(ae);
  le.current = ae;
  const zt = x(null), [Ke, lt] = S("grid"), [Be, Qt] = S(Et), [Ee, Qr] = S(ni), [D, ct] = S(!1), Ve = x(!1), [Wr, dt] = S(""), [Je, he] = S(""), [ut, Te] = S(""), [U, Wt] = S(null), [Ht, ze] = S(""), [Qe, We] = S(!1), [Gt, Xt] = S({}), [Yt, Zt] = S({}), ft = x(/* @__PURE__ */ new Map()), er = x(null), He = x(null), Ne = x(0), Ge = x(0), Xe = x(null), be = x(!1), tr = JSON.stringify([
    ...new Set(
      (h == null ? void 0 : h.actions.flatMap(
        (n) => n.steps.flatMap((s) => s.tagIds)
      )) ?? []
    )
  ]);
  function pt(n) {
    const s = _r(n);
    Qr(s), ii(s);
  }
  function Hr(n) {
    const s = n.shiftKey ? 40 : 16;
    let u = null;
    n.key === "ArrowLeft" && (u = Ee + s), n.key === "ArrowRight" && (u = Ee - s), n.key === "Home" && (u = Pt), n.key === "End" && (u = Lt), u !== null && (n.preventDefault(), n.stopPropagation(), pt(u));
  }
  G(() => {
    if (!Je) return;
    const n = window.setTimeout(() => he(""), 4e3);
    return () => window.clearTimeout(n);
  }, [Je]), G(() => {
    const n = JSON.parse(tr);
    if (Zt({}), !n.length) return;
    const s = new AbortController();
    let u = !0;
    return Promise.all(
      n.map(async (y) => {
        var C;
        try {
          const I = await B(`/api/tags/${y}`, {
            signal: s.signal
          });
          return [y, ((C = I.name) == null ? void 0 : C.trim()) || null];
        } catch {
          return [y, null];
        }
      })
    ).then((y) => {
      u && Zt(Object.fromEntries(y));
    }), () => {
      u = !1, s.abort();
    };
  }, [tr]), G(() => {
    const n = h ? Gn(h.view.objectFilter) : [];
    if (Xt({}), !n.length) return;
    const s = new AbortController();
    let u = !0;
    return Promise.all(
      n.map(async (y) => {
        var C;
        try {
          const I = await B(`/api/tags/${y}`, {
            signal: s.signal
          });
          return (C = I.name) != null && C.trim() ? [String(y), I.name] : null;
        } catch {
          return null;
        }
      })
    ).then((y) => {
      u && Xt(
        Object.fromEntries(y.filter((C) => C !== null))
      );
    }), () => {
      u = !1, s.abort();
    };
  }, [h == null ? void 0 : h.id, h == null ? void 0 : h.view.objectFilter]);
  const gt = Oe(
    () => h ? Xn(
      h.view.objectFilter,
      Gt
    ) : {},
    [Gt, h]
  ), Gr = Oe(
    () => Array.isArray(gt.customFieldCriteria) ? [...At, ei] : At,
    [gt.customFieldCriteria]
  ), rr = ve(async () => {
    v(!0), g("");
    try {
      const n = await Tn();
      r(n.reviews), d(n.storageKey), m(n.canWrite), R(n.canConfigure ?? !0), T(n.storageNotice ?? ""), b && !n.reviews.some((s) => s.id === b) && (F(""), vr(""));
    } catch (n) {
      g(
        n instanceof Error ? n.message : "Could not load reviews."
      );
    } finally {
      v(!1);
    }
  }, [b]);
  G(() => {
    rr();
  }, []), G(() => {
    if (b || t.length === 0) return;
    const n = new AbortController();
    J({});
    for (const s of t)
      St(
        s,
        ge({ ...s.view.filter, page: 1, perPage: 1 }),
        n.signal
      ).then((u) => {
        n.signal.aborted || J((y) => ({
          ...y,
          [s.id]: u.totalCount
        }));
      }).catch(() => {
        n.signal.aborted || J((u) => ({ ...u, [s.id]: null }));
      });
    return () => n.abort();
  }, [b, t]), Nr(() => {
    var n;
    b || c || !st.current || (st.current = !1, (n = jt.current) == null || n.focus());
  }, [b, c]);
  const Ye = ve(async () => {
    ze("");
    try {
      Wt(await _t());
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
    async (n, s, u = !1) => {
      var k;
      const y = ++Ne.current;
      (k = Xe.current) == null || k.abort();
      const C = new AbortController();
      Xe.current = C, s = ge(s);
      const I = Number(s.page);
      u && (s = { ...s, page: 1 }), _e(s), zr(u), Ue(!0), Jt("");
      try {
        let j = await St(
          n,
          s,
          C.signal
        );
        const te = Math.max(
          1,
          Math.ceil(j.totalCount / Number(s.perPage))
        ), oe = u ? te : Math.min(I, te);
        return Number(s.page) !== oe && (s = { ...s, page: oe }, j = await St(
          n,
          s,
          C.signal
        )), y === Ne.current && (Fe(j), _e(s), Vr(s)), j;
      } catch (j) {
        throw y === Ne.current && Jt(
          j instanceof Error ? j.message : "Could not load the review queue."
        ), j;
      } finally {
        y === Ne.current && Ue(!1);
      }
    },
    []
  );
  G(() => {
    var s;
    if (Ge.current += 1, Ne.current += 1, (s = Xe.current) == null || s.abort(), L(!1), P(""), N(!1), ue(/* @__PURE__ */ new Set()), me.current.clear(), ee(null), Se(!1), ct(!1), Ve.current = !1, dt(""), he(""), Te(""), Fe({ items: [], totalCount: 0 }), !h) {
      Ue(!1);
      return;
    }
    let n = !0;
    return Ue(!0), (async () => {
      let u = null;
      try {
        u = await kn(l, h.id);
      } catch (I) {
        n && (N(!0), P(
          I instanceof Error ? I.message : "Could not load progress."
        ));
      }
      if (!n) return;
      const y = (u == null ? void 0 : u.signature) === Ce(h) ? u : null, C = y ? ge(y.filter) : ri(h.view.filter);
      _e(C), lt(
        y ? wr(y.displayMode) : yr(h)
      ), Qt(
        y ? y.cardSize ?? Et : Et
      );
      try {
        const I = await ye(
          h,
          C,
          !y && h.view.startFrom !== "beginning"
        );
        if (!n) return;
        const k = fr(
          I.items.map((j) => j.id),
          (y == null ? void 0 : y.focusedId) ?? null,
          (y == null ? void 0 : y.index) ?? 0
        );
        ee(k), W(k);
      } catch {
      }
      n && L(!0);
    })(), () => {
      var u;
      n = !1, Ge.current++, Ne.current++, (u = Xe.current) == null || u.abort();
    };
  }, [h == null ? void 0 : h.id]);
  const _ = Oe(
    () => Y.items.map((n) => n.id),
    [Y.items]
  );
  G(() => {
    if (!q || !h || !l || M || se || D || (X == null ? void 0 : X.id) === h.id || p)
      return;
    const n = {
      version: 1,
      signature: Ce(h),
      filter: z,
      focusedId: Z,
      index: Math.max(0, _.indexOf(Z ?? -1)),
      displayMode: Ke,
      cardSize: Be,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        l + ":progress:" + h.id,
        JSON.stringify(n)
      );
    } catch {
    }
    if (O) return;
    let s = !0;
    const u = window.setTimeout(() => {
      Mn(l, h.id, n).catch((y) => {
        s && P(
          "Progress is kept in this browser, but account sync failed. " + (y instanceof Error ? y.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      s = !1, window.clearTimeout(u);
    };
  }, [
    q,
    l,
    h,
    M,
    se,
    D,
    z,
    Z,
    _,
    Ke,
    Be,
    X,
    O,
    p
  ]);
  const mt = Y.items.find((n) => n.id === Z) ?? null;
  ae && mt && (zt.current = mt);
  const we = mt ?? (ae ? zt.current : null), Xr = pr(de, Z), nr = de.size > 0 ? `${de.size} selected video${de.size === 1 ? "" : "s"}` : Z == null ? "no video" : "focused video", W = ve((n, s = !0) => {
    n != null && window.requestAnimationFrame(() => {
      const u = ft.current.get(n);
      u == null || u.focus({ preventScroll: !0 }), s && (u == null || u.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  G(() => {
    q && !le.current && W(ie.current);
  }, [q, W]), G(() => {
    M || !_.length || (ie.current == null || !_.includes(ie.current)) && (ee(_[0]), le.current || W(_[0]));
  }, [W, _, M]);
  const Ie = ve(
    (n) => {
      ue((s) => {
        const u = n(s);
        for (const y of /* @__PURE__ */ new Set([...s, ...u]))
          s.has(y) !== u.has(y) && me.current.set(
            y,
            (me.current.get(y) ?? 0) + 1
          );
        return u;
      });
    },
    []
  ), ht = ve(
    (n) => {
      if (!_.length) return;
      const s = Math.max(
        0,
        _.indexOf(ie.current ?? _[0])
      ), u = _[Math.max(0, Math.min(_.length - 1, s + n))];
      ee(u), le.current || W(u);
    },
    [W, _]
  ), bt = ve(
    async (n) => {
      const s = pr(
        je.current,
        ie.current
      );
      if (!h || Ve.current || M || se || !a || rt(n) && (U == null ? void 0 : U.kind) !== "ready" || !s.length)
        return;
      const u = ++Ge.current, y = h.id, C = [..._], I = Y, k = ie.current, j = new Set(je.current), te = new Map(
        s.map((K) => [K, me.current.get(K) ?? 0])
      ), oe = () => u === Ge.current && h.id === y;
      Ve.current = !0, ct(!0), dt(
        je.current.size ? `${s.length} selected videos` : "the focused video"
      ), he(""), Te("");
      const sr = I.items.filter(
        (K) => !s.includes(K.id)
      ), an = sr.map((K) => K.id), ar = gr(
        C,
        an,
        k,
        s.includes(k ?? -1)
      );
      Fe({
        items: sr,
        totalCount: I.totalCount
      }), ue((K) => {
        const Q = new Set(K);
        for (const H of s) Q.delete(H);
        return Q;
      }), ee(ar), le.current || W(ar);
      let yt = !1;
      try {
        if (await Bn(n, s), yt = !0, !oe()) return;
        ue((K) => {
          const Q = new Set(K);
          for (const H of s)
            (me.current.get(H) ?? 0) === te.get(H) && Q.delete(H);
          return Q;
        }), he(
          `${n.label}: ${s.length} video${s.length === 1 ? "" : "s"} ${n.steps.length ? "updated" : "skipped"}.`
        );
      } catch (K) {
        if (!oe()) return;
        Fe(I), ue((Q) => {
          const H = new Set(Q);
          for (const fe of s)
            j.has(fe) && (me.current.get(fe) ?? 0) === te.get(fe) && H.add(fe);
          return H;
        }), ee(k), le.current || W(k), Te(
          K instanceof Error ? K.message : "Action failed."
        );
      }
      try {
        if (await $n(n), !oe()) return;
        const K = await ye(h, z);
        if (!oe()) return;
        let Q = K.items.map((H) => H.id);
        if (!Q.length && K.totalCount > 0 && Number(z.page) > 1) {
          const H = Math.max(1, Number(z.page) - 1), fe = { ...z, page: H };
          _e(fe), Q = (await ye(h, fe)).items.map((wt) => wt.id), ue(
            (wt) => new Set([...wt].filter((ln) => Q.includes(ln)))
          );
          const cr = Q.at(-1) ?? null;
          ee(cr), le.current || W(cr);
        } else {
          ue(
            (fe) => new Set([...fe].filter((lr) => Q.includes(lr)))
          );
          const H = gr(
            C,
            Q,
            k,
            yt && s.includes(k ?? -1)
          );
          ee(H), le.current && H == null && Se(!1), le.current || W(H);
        }
      } catch (K) {
        oe() && Te(
          (Q) => `${Q ? `${Q} ` : ""}${yt ? "The action completed, but " : ""}the queue could not be refreshed. ${K instanceof Error ? K.message : "Refresh failed."}`
        );
      } finally {
        oe() && (Ve.current = !1, ct(!1), dt(""));
      }
    },
    [
      a,
      U,
      ye,
      z,
      W,
      _,
      Y,
      M,
      se,
      h
    ]
  );
  function Yr() {
    var u;
    const n = (u = er.current) == null ? void 0 : u.firstElementChild, s = n ? getComputedStyle(n).gridTemplateColumns : "";
    return Math.max(1, s.split(" ").filter(Boolean).length);
  }
  function Zr(n) {
    if (n.defaultPrevented || n.repeat || n.ctrlKey || n.altKey || n.metaKey || Kt) return;
    if (ae && n.key === "Escape") {
      re(n), Se(!1), W(ie.current);
      return;
    }
    if (!Cn(n.target)) return;
    if (n.key === "Escape") {
      re(n), Ie(() => /* @__PURE__ */ new Set());
      return;
    }
    const s = (h == null ? void 0 : h.actions.findIndex(
      (C, I) => Me(C, I) === n.key
    )) ?? -1;
    if (s >= 0 && (h != null && h.actions[s])) {
      re(n), !D && !M && bt(h.actions[s]);
      return;
    }
    if (!ae && n.key === " ") {
      re(n), Z != null && Ie((C) => Nt(C, Z));
      return;
    }
    if (!ae && n.key.toLowerCase() === "a") {
      re(n), Ie(
        (C) => Nn(C, _)
      );
      return;
    }
    if (D || M || ae) return;
    if (n.key === "Enter" && Z != null) {
      re(n), Se(!0);
      return;
    }
    const u = Yr(), y = n.key === "ArrowLeft" ? -1 : n.key === "ArrowRight" ? 1 : n.key === "ArrowUp" ? -u : n.key === "ArrowDown" ? u : 0;
    y && (re(n), ht(y));
  }
  function Ze(n) {
    F(n), vr(n);
  }
  function en() {
    st.current = !0, J({}), Ze("");
  }
  async function ir(n) {
    if (!l) return !1;
    const s = n.map(li);
    try {
      await On(l, s);
    } catch (y) {
      throw y;
    }
    r(s), b && !s.some((y) => y.id === b) && Ze("");
    const u = s.find((y) => y.id === b);
    return u && $ && JSON.stringify(u) !== JSON.stringify($) && (u.view.displayMode !== $.view.displayMode && lt(yr(u)), Ce(u) !== Ce($) && (qe(null), et(
      u,
      ge({ ...u.view.filter, page: z.page })
    ))), !0;
  }
  if (c)
    return /* @__PURE__ */ i(Sr, { label: "Loading reviews…" });
  if (E)
    return /* @__PURE__ */ f(Re, { children: [
      /* @__PURE__ */ i(
        "button",
        {
          className: "dq-button",
          onClick: () => void mi().catch(
            (n) => g(
              "Could not export browser reviews. " + (n instanceof Error ? n.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ i(
        Er,
        {
          message: E,
          onRetry: () => void rr()
        }
      )
    ] });
  return /* @__PURE__ */ f("div", { className: "data-quality-page", onKeyDown: Zr, children: [
    /* @__PURE__ */ f("header", { className: "data-quality-header", children: [
      h && /* @__PURE__ */ i(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: D,
          onClick: en,
          children: /* @__PURE__ */ i(Cr, {})
        }
      ),
      /* @__PURE__ */ f("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ i("h1", { children: (h == null ? void 0 : h.name) ?? "Data Quality" }),
        (h == null ? void 0 : h.description) && /* @__PURE__ */ i("p", { className: "dq-review-description", children: h.description })
      ] }),
      h && $ && /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: D || M || !A,
          onClick: () => {
            Vt(!0), at(!0);
          },
          children: /* @__PURE__ */ i(Ar, {})
        }
      ),
      /* @__PURE__ */ i(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: D || M || !A,
          onClick: () => {
            Vt(!1), at(!0);
          },
          children: /* @__PURE__ */ i(mn, {})
        }
      )
    ] }),
    w && /* @__PURE__ */ i("p", { className: "dq-status", children: w }),
    (U == null ? void 0 : U.kind) === "missing" && /* @__PURE__ */ f("div", { role: "status", className: "dq-status", children: [
      U.message,
      " ",
      /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          disabled: Qe,
          onClick: () => {
            We(!0), ze(""), Fn().then(Ye).catch(
              (n) => ze(
                "Could not create the Confirmed absent tags custom field. " + (n instanceof Error ? n.message : "Request failed.")
              )
            ).finally(() => We(!1));
          },
          children: Qe ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    ((U == null ? void 0 : U.kind) === "incompatible" || Ht) && /* @__PURE__ */ f("div", { role: "alert", className: "dq-alert", children: [
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
    o && /* @__PURE__ */ f("details", { children: [
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
            ), u = document.createElement("a");
            u.href = s, u.download = "data-quality-unassigned-legacy-reviews.json", u.click(), URL.revokeObjectURL(s);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    O && /* @__PURE__ */ f("p", { role: "alert", children: [
      O,
      " ",
      /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          onClick: () => {
            P(""), N(!1);
          },
          children: p ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    h && $ && /* @__PURE__ */ f("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ i(
        "div",
        {
          className: `dq-native-toolbar-host${D || M ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": D || M || void 0,
          inert: D || M ? !0 : void 0,
          onClickCapture: (n) => {
            var u, y, C, I, k;
            const s = n.target instanceof Element ? n.target.closest("button") : null;
            (s == null ? void 0 : s.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((u = s == null ? void 0 : s.textContent) == null ? void 0 : u.trim()) === "Clear all" ? be.current = !0 : ((y = s == null ? void 0 : s.getAttribute("aria-label")) != null && y.startsWith("Filters") || (C = s == null ? void 0 : s.getAttribute("aria-label")) != null && C.startsWith("Edit filter:") || ((I = s == null ? void 0 : s.textContent) == null ? void 0 : I.trim()) === "Cancel" || (k = s == null ? void 0 : s.getAttribute("aria-label")) != null && k.startsWith("Close ")) && (be.current = !1);
          },
          onKeyDownCapture: (n) => {
            var u, y;
            const s = n.target instanceof Element ? n.target.closest("button") : null;
            (n.key === "Delete" || n.key === "Backspace") && (s == null ? void 0 : s.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (n.preventDefault(), n.stopPropagation(), be.current = !0, (y = (u = s.parentElement) == null ? void 0 : u.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || y.click()) : n.key === "Escape" && (be.current = !1);
          },
          children: /* @__PURE__ */ i(
            dn,
            {
              filter: se ? Br : z,
              onFilterChange: tn,
              totalCount: Y.totalCount,
              sortOptions: Ct,
              showSearch: !0,
              showSort: !0,
              displayMode: Ke,
              onDisplayModeChange: (n) => lt(wr(n)),
              availableDisplayModes: ["grid", "wall"],
              zoomLevel: (Be - 225) / 50,
              onZoomChange: (n) => Qt(Math.round(225 + n * 50)),
              cardSizeEntityType: "videos",
              criteriaDefinitions: Gr,
              objectFilter: gt,
              onObjectFilterChange: (n) => {
                if (!D && !M) {
                  const s = Yn(n);
                  xe.current = Zn(
                    h.view.objectFilter,
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
      (X == null ? void 0 : X.id) === b && /* @__PURE__ */ f("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: D || M || !A,
            onClick: nn,
            children: /* @__PURE__ */ i(hn, {})
          }
        ),
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Reset to default review filters",
            title: "Reset to default review filters",
            disabled: D || M,
            onClick: rn,
            children: /* @__PURE__ */ i(bn, {})
          }
        )
      ] })
    ] }),
    h ? /* @__PURE__ */ f(Re, { children: [
      $e.error && /* @__PURE__ */ i("p", { role: "alert", children: $e.error }),
      /* @__PURE__ */ i(
        zn,
        {
          videos: Y.items,
          review: h,
          trees: $e.ids,
          disabled: D || M,
          onChoose: (n) => {
            const s = Qn(h, n);
            qe(s), et(s, { ...z, page: 1 });
          }
        }
      ),
      ut && !ae && /* @__PURE__ */ f("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ i(qt, {}),
        ut
      ] }),
      Je && /* @__PURE__ */ i("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: Je }),
      or("top"),
      /* @__PURE__ */ f(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${Ee}px`
          },
          children: [
            /* @__PURE__ */ f("main", { children: [
              M && !Y.items.length && /* @__PURE__ */ i(Sr, { label: "Loading review queue…" }),
              se && !M && /* @__PURE__ */ i(
                Er,
                {
                  message: se,
                  onRetry: () => void ye(
                    h,
                    z,
                    Jr
                  ).catch(() => {
                  })
                }
              ),
              !D && !M && !se && !Y.items.length && /* @__PURE__ */ f("div", { className: "dq-empty", children: [
                /* @__PURE__ */ i(ur, {}),
                /* @__PURE__ */ i("p", { children: "No videos match this review." })
              ] }),
              !!Y.items.length && /* @__PURE__ */ i("div", { ref: er, children: /* @__PURE__ */ i(
                "div",
                {
                  className: "dq-grid",
                  style: {
                    "--dq-card-width": `${Be}px`
                  },
                  children: Y.items.map(sn)
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
                "aria-valuemin": Pt,
                "aria-valuemax": Lt,
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
                onKeyDown: Hr,
                onDoubleClick: () => pt(Ut),
                children: /* @__PURE__ */ i("span", {})
              }
            ),
            /* @__PURE__ */ f("aside", { className: "dq-actions", children: [
              de.size > 0 && /* @__PURE__ */ i("strong", { children: nr }),
              h.actions.map((n, s) => /* @__PURE__ */ f(
                "button",
                {
                  type: "button",
                  disabled: D || M || !!se || !a || rt(n) && (U == null ? void 0 : U.kind) !== "ready" || !Xr.length,
                  onClick: () => void bt(n),
                  children: [
                    /* @__PURE__ */ f("span", { className: "dq-action-copy", children: [
                      /* @__PURE__ */ i("span", { className: "dq-action-label", children: n.label }),
                      n.steps.length ? /* @__PURE__ */ i("span", { className: "dq-action-steps", children: n.steps.flatMap(
                        (u, y) => u.tagIds.map((C, I) => {
                          const k = Yt[C] === void 0 ? "Tag" : Yt[C] ?? "Unavailable tag", j = Ur(u, k), te = oi(u, k);
                          return /* @__PURE__ */ i(
                            "span",
                            {
                              className: "dq-step-summary",
                              "data-step-tone": Fr(u.mode),
                              "aria-label": te,
                              title: `Step ${y + 1}: ${te}`,
                              children: j
                            },
                            `${y}-${C}-${I}`
                          );
                        })
                      ) }) : /* @__PURE__ */ i("small", { children: "Skip" })
                    ] }),
                    Me(n, s) && /* @__PURE__ */ i("kbd", { children: Me(n, s) })
                  ]
                },
                n.id
              )),
              !h.actions.length && /* @__PURE__ */ i("p", { children: "This review has no actions." }),
              !a && /* @__PURE__ */ i("p", { children: "Video write permission is required to apply actions." }),
              D && /* @__PURE__ */ f("p", { role: "status", children: [
                /* @__PURE__ */ i(qr, { className: "dq-spin" }),
                " Applying action to",
                " ",
                Wr,
                "…"
              ] }),
              /* @__PURE__ */ i("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
            ] })
          ]
        }
      ),
      or("bottom")
    ] }) : t.length ? /* @__PURE__ */ f(
      "section",
      {
        className: "dq-review-browser",
        "aria-labelledby": "dq-reviews-title",
        children: [
          /* @__PURE__ */ f("div", { className: "dq-review-browser-heading", children: [
            /* @__PURE__ */ f("div", { children: [
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
                (n) => V[n.id] !== void 0
              ) ? t.some((n) => V[n.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ f("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ f("label", { children: [
                /* @__PURE__ */ i("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ f(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: ce,
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
                  "aria-label": ne === "asc" ? "Ascending" : "Descending",
                  title: ne === "asc" ? "Ascending" : "Descending",
                  onClick: () => jr(
                    (n) => n === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ i(
                    Rr,
                    {
                      className: ne === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ i("div", { className: "dq-review-browser-list", children: Kr.map((n) => {
            const s = V[n.id];
            return /* @__PURE__ */ f(
              "button",
              {
                type: "button",
                disabled: D,
                onClick: () => Ze(n.id),
                children: [
                  /* @__PURE__ */ f("span", { className: "dq-review-browser-summary", children: [
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
    ) : /* @__PURE__ */ f("div", { className: "dq-empty", children: [
      /* @__PURE__ */ i(ur, {}),
      /* @__PURE__ */ i("p", { children: "No saved reviews are available in this browser." })
    ] }),
    ae && we && h && /* @__PURE__ */ i(
      ui,
      {
        video: we,
        review: h,
        targetLabel: nr,
        pending: D,
        refreshing: M || !!se,
        error: ut,
        canWrite: a,
        assessmentReady: (U == null ? void 0 : U.kind) === "ready",
        selected: de.has(we.id),
        hasPrevious: _.indexOf(we.id) > 0,
        hasNext: _.indexOf(we.id) >= 0 && _.indexOf(we.id) < _.length - 1,
        onToggleSelected: () => Ie((n) => Nt(n, we.id)),
        onPrevious: () => ht(-1),
        onNext: () => ht(1),
        onClose: () => {
          Se(!1), W(ie.current);
        },
        onAction: bt
      }
    ),
    Kt && /* @__PURE__ */ i(
      fi,
      {
        reviews: t,
        activeReview: $,
        initialEdit: Bt,
        onSave: ir,
        onChoose: Ze,
        onClose: () => {
          at(!1), Bt && W(ie.current, !1);
        }
      }
    )
  ] });
  async function et(n, s, u = !1) {
    const y = ie.current, C = Math.max(0, _.indexOf(y ?? -1));
    try {
      const k = (await ye(n, s, u)).items.map((te) => te.id);
      ue(
        (te) => new Set([...te].filter((oe) => k.includes(oe)))
      );
      const j = fr(k, y, C);
      ee(j), le.current || W(j, !1);
    } catch {
    }
  }
  function tn(n) {
    const s = xe.current;
    if (xe.current = null, D || M || !h || !$) return;
    const u = s ?? h.view.objectFilter, y = Mt(
      u,
      $.view.objectFilter
    ) ? $.view.objectFilter : u, C = ge({ ...n, page: 1 }), I = {
      ...h,
      view: {
        ...h.view,
        filter: C,
        objectFilter: y
      }
    }, k = Ce(I) !== Ce($), j = k ? I : $;
    qe(k ? I : null), he(k ? "" : "Review queue defaults restored."), et(j, C, !0);
  }
  function rn() {
    if (D || M || !$) return;
    xe.current = null;
    const n = ge({
      ...$.view.filter,
      page: 1
    });
    qe(null), he("Review queue defaults restored."), et(
      $,
      n,
      $.view.startFrom !== "beginning"
    );
  }
  function nn() {
    D || M || !h || !$ || !A || ir(
      t.map(
        (n) => n.id === b ? {
          ...n,
          view: {
            ...h.view,
            filter: { ...z, page: 1 }
          }
        } : n
      )
    ).then(() => {
      qe(null), he("Queue saved to this review.");
    }).catch(
      (n) => Te(
        n instanceof Error ? n.message : "Could not save queue."
      )
    );
  }
  function on() {
    ue(/* @__PURE__ */ new Set()), me.current.clear(), ee(null);
  }
  function or(n) {
    return h ? /* @__PURE__ */ i(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: D || M,
        "aria-label": `Review queue pagination ${n}`,
        children: /* @__PURE__ */ i(
          un,
          {
            filter: {
              ...z,
              page: Number(z.page) || 1,
              perPage: Number(z.perPage) || 40
            },
            totalCount: Y.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${n}`,
            onFilterChange: (s) => {
              D || M || s.page === Number(z.page) || ai(
                { ...z, page: s.page },
                h,
                ye,
                on
              );
            }
          }
        )
      }
    ) : null;
  }
  function sn(n) {
    return /* @__PURE__ */ i(
      ci,
      {
        video: Jn(n, h, $e.ids),
        displayMode: Ke,
        focused: n.id === Z,
        selected: de.has(n.id),
        setRef: (s) => {
          s ? ft.current.set(n.id, s) : ft.current.delete(n.id);
        },
        onFocus: () => ee(n.id),
        onToggle: () => Ie((s) => Nt(s, n.id)),
        onPreview: () => {
          ee(n.id), Se(!0);
        },
        onNavigate: e
      },
      n.id
    );
  }
}
function ai(e, t, r, o) {
  o(), r(t, e).catch(() => {
  });
}
function Nt(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function li(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function ci({
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
  const g = xr(e), a = x(null), m = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, A = !!(m.date || m.studioName), R = !!(m.performers.length || m.tags.length);
  return Nr(() => {
    const w = a.current;
    if (!w) return;
    const T = w.querySelector(
      `a[href="/video/${e.id}"]`
    ), O = w.querySelector(".card-title"), P = `dq-card-title-${e.id}`;
    O && (O.id = P), T && (T.target = "_blank", T.rel = "noreferrer", T.removeAttribute("aria-label"), T.setAttribute("aria-labelledby", P), T.classList.add("dq-card-link"));
    const p = w.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    p && p.setAttribute(
      "aria-label",
      o ? `Deselect ${g}` : `Select ${g}`
    );
    const N = w.querySelector(
      'button[title="Quick View"]'
    );
    N && N.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ f(
    "article",
    {
      ref: (w) => {
        a.current = w, l(w);
      },
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${g}${o ? ", selected" : ""}`,
      onFocus: d,
      onClick: (w) => {
        d(), w.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${t} ${A ? "has-card-metadata" : "no-card-metadata"} ${R ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ i(
          pn,
          {
            video: m,
            selected: o,
            onSelect: c,
            onNavigate: E,
            onQuickView: v,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t === "wall" && /* @__PURE__ */ i(di, { video: e })
      ]
    }
  );
}
function di({ video: e }) {
  const t = x(null), r = x(null), [o, l] = S(!1), [d, c] = S(!1), [v, E] = S(!1);
  return G(() => {
    const g = t.current;
    if (!g || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      l(!0), c(!0);
      return;
    }
    const a = new IntersectionObserver(
      ([A]) => l(A.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), m = new IntersectionObserver(
      ([A]) => c(A.isIntersecting && A.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return a.observe(g), m.observe(g), () => {
      a.disconnect(), m.disconnect();
    };
  }, [e.id, e.files.length]), G(() => {
    if (!o) {
      E(!1);
      return;
    }
    const g = new AbortController();
    return B(xn(e.id), {
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
      src: Dn(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function ui({
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
  onToggleSelected: m,
  onPrevious: A,
  onNext: R,
  onClose: w,
  onAction: T
}) {
  const O = x(null), P = x(null), p = e.files[0], N = xr(e);
  G(() => {
    var F;
    const b = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (F = O.current) == null || F.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = b;
    };
  }, []);
  function q(b) {
    var J, ce, pe;
    if (b.key !== "Tab") return;
    const F = [
      ...((J = O.current) == null ? void 0 : J.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ne) => ne.offsetParent !== null);
    if (!F.length) {
      b.preventDefault(), (ce = O.current) == null || ce.focus();
      return;
    }
    const V = F.indexOf(
      document.activeElement
    );
    b.shiftKey && V <= 0 ? (b.preventDefault(), (pe = F.at(-1)) == null || pe.focus()) : !b.shiftKey && V === F.length - 1 && (b.preventDefault(), F[0].focus());
  }
  function L(b) {
    if (b.defaultPrevented || b.ctrlKey || b.metaKey || b.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const F = b.key === "ArrowLeft" || b.key === "ArrowRight";
    if (b.altKey && !F) return;
    const V = P.current, J = b.currentTarget.querySelector("video");
    if (b.key === "Enter" || b.key === "Escape")
      b.repeat || w();
    else if (b.key === " " && V)
      b.repeat || V.toggle();
    else if (F && V)
      V.seekBy(
        (b.key === "ArrowLeft" ? -1 : 1) * (b.shiftKey ? 5 : b.altKey ? 10 : 60)
      );
    else if ((b.key === "," || b.key === ".") && V) {
      const ce = [p == null ? void 0 : p.duration, J == null ? void 0 : J.duration].find(
        (ne) => ne != null && Number.isFinite(ne) && ne > 0
      ) ?? 0, pe = e.parentVideoId != null ? (e.clipEndSec ?? ce) - (e.clipStartSec ?? 0) : ce;
      Number.isFinite(pe) && pe > 0 && V.seekBy((b.key === "," ? -1 : 1) * pe * 0.1);
    } else if (b.key.toLowerCase() === "n" || b.key.toLowerCase() === "m")
      !b.repeat && !o && !l && (b.key.toLowerCase() === "n" && g && A(), b.key.toLowerCase() === "m" && a && R());
    else if (b.key === "ArrowUp" && J)
      J.volume = Math.min(1, J.volume + 0.1);
    else if (b.key === "ArrowDown" && J)
      J.volume = Math.max(0, J.volume - 0.1);
    else return;
    re(b);
  }
  return /* @__PURE__ */ i(
    "div",
    {
      ref: O,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${N}`,
      className: "dq-preview",
      onKeyDown: q,
      onKeyDownCapture: L,
      onMouseDown: (b) => {
        b.target === b.currentTarget && w();
      },
      children: /* @__PURE__ */ f("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ f("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !g || o || l,
              onClick: A,
              children: /* @__PURE__ */ i(Cr, {})
            }
          ),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !a || o || l,
              onClick: R,
              children: /* @__PURE__ */ i(Rr, {})
            }
          ),
          /* @__PURE__ */ f("div", { children: [
            /* @__PURE__ */ i("h2", { children: N }),
            /* @__PURE__ */ f("p", { children: [
              "Actions target ",
              r,
              "."
            ] })
          ] }),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              onClick: m,
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
              children: /* @__PURE__ */ i(yn, {})
            }
          ),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              onClick: w,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ i(Tr, {})
            }
          )
        ] }),
        /* @__PURE__ */ i("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: p ? /* @__PURE__ */ i(
          fn,
          {
            autostart: !0,
            streamUrl: Ln(e.id),
            posterUrl: hr(e),
            format: p.format,
            audioCodec: p.audioCodec,
            duration: p.duration ?? 0,
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
        ) : /* @__PURE__ */ i("img", { src: hr(e), alt: "" }) }),
        d && /* @__PURE__ */ i("p", { role: "alert", className: "dq-alert", children: d }),
        /* @__PURE__ */ i("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ i("footer", { "data-review-player-controls": !0, children: t.actions.map((b, F) => /* @__PURE__ */ f(
          "button",
          {
            type: "button",
            disabled: o || l || !c || rt(b) && !v,
            onClick: () => void T(b),
            children: [
              Me(b, F) && /* @__PURE__ */ i("kbd", { children: Me(b, F) }),
              b.label
            ]
          },
          b.id
        )) })
      ] })
    }
  );
}
function fi({
  reviews: e,
  activeReview: t,
  initialEdit: r = !1,
  onSave: o,
  onChoose: l,
  onClose: d
}) {
  const [c, v] = S(
    () => r && t ? structuredClone(t) : null
  ), [E, g] = S(""), [a, m] = S(!1), A = x(null);
  G(() => {
    var q, L;
    const p = document.activeElement, N = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (L = (q = A.current) == null ? void 0 : q.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || L.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = N, p == null || p.focus({ preventScroll: !0 });
    };
  }, []);
  function R(p) {
    var L, b, F;
    if (p.defaultPrevented) {
      p.stopPropagation();
      return;
    }
    if (p.key === "Escape") {
      re(p), a || d();
      return;
    }
    if (p.key !== "Tab") {
      p.stopPropagation();
      return;
    }
    const N = [
      ...((L = A.current) == null ? void 0 : L.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((V) => V.offsetParent !== null);
    if (!N.length) {
      re(p), (b = A.current) == null || b.focus();
      return;
    }
    const q = N.indexOf(
      document.activeElement
    );
    p.shiftKey && q <= 0 ? (re(p), (F = N.at(-1)) == null || F.focus()) : !p.shiftKey && q === N.length - 1 ? (re(p), N[0].focus()) : p.stopPropagation();
  }
  function w(p) {
    v(
      p ? structuredClone(p) : {
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
  async function T() {
    if (a) return;
    if (!c || Tt(c)) {
      g(c ? Tt(c) : "Choose a review.");
      return;
    }
    const p = { ...c, name: c.name.trim() }, N = e.some((q) => q.id === p.id) ? e.map((q) => q.id === p.id ? p : q) : [...e, p];
    m(!0), g("");
    try {
      if (!await o(N)) throw new Error("Could not save reviews.");
      l(p.id), d();
    } catch (q) {
      g(
        "Could not save reviews. Your edits are still open. " + (q instanceof Error ? q.message : "Retry saving.")
      );
    } finally {
      m(!1);
    }
  }
  async function O(p) {
    if (!a) {
      m(!0), g("");
      try {
        if (!await o(p)) throw new Error("Could not save reviews.");
      } catch (N) {
        g(
          N instanceof Error ? N.message : "Could not save reviews."
        );
      } finally {
        m(!1);
      }
    }
  }
  async function P(p) {
    var q;
    if (a) return;
    const N = (q = p.target.files) == null ? void 0 : q[0];
    if (p.target.value = "", !!N) {
      if (N.size > 2e6) {
        g("Review files must be smaller than 2 MB.");
        return;
      }
      m(!0), g("");
      try {
        const L = Pe(await N.text());
        if (!await o(It(e, L)))
          throw new Error("Could not save reviews.");
      } catch (L) {
        g(
          L instanceof Error ? L.message : "Could not import reviews."
        );
      } finally {
        m(!1);
      }
    }
  }
  return /* @__PURE__ */ i(
    "div",
    {
      ref: A,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: R,
      children: /* @__PURE__ */ f("div", { className: "dq-manager", children: [
        /* @__PURE__ */ f("header", { children: [
          /* @__PURE__ */ f("div", { children: [
            /* @__PURE__ */ i("h2", { children: c ? e.some((p) => p.id === c.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ i("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: a,
              onClick: d,
              children: /* @__PURE__ */ i(Tr, {})
            }
          )
        ] }),
        E && /* @__PURE__ */ i("p", { role: "alert", className: "dq-alert", children: E }),
        /* @__PURE__ */ i("fieldset", { disabled: a, className: "dq-manager-content", children: c ? /* @__PURE__ */ i(
          pi,
          {
            draft: c,
            saving: a,
            setDraft: v,
            onSave: () => void T(),
            onCancel: d
          }
        ) : /* @__PURE__ */ f(Re, { children: [
          /* @__PURE__ */ f("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ f(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => w(),
                children: [
                  /* @__PURE__ */ i(wn, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ f("label", { className: "dq-button", children: [
              /* @__PURE__ */ i(vn, {}),
              " Import reviews",
              /* @__PURE__ */ i(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: P
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ i("div", { className: "dq-review-list", children: e.map((p) => /* @__PURE__ */ f("article", { children: [
            /* @__PURE__ */ f("div", { children: [
              /* @__PURE__ */ i("strong", { children: p.name }),
              /* @__PURE__ */ i("p", { children: p.description || "No description" })
            ] }),
            /* @__PURE__ */ f("button", { type: "button", onClick: () => w(p), children: [
              /* @__PURE__ */ i(Ar, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                onClick: () => w({
                  ...structuredClone(p),
                  id: crypto.randomUUID(),
                  name: `${p.name} copy`
                }),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${p.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${p.name}”?`) && O(
                    e.filter((N) => N.id !== p.id)
                  );
                },
                children: /* @__PURE__ */ i(Ir, {})
              }
            )
          ] }, p.id)) })
        ] }) })
      ] })
    }
  );
}
function pi({
  draft: e,
  saving: t = !1,
  setDraft: r,
  onSave: o,
  onCancel: l
}) {
  const [d, c] = S("Review"), v = x(/* @__PURE__ */ new WeakMap()), E = (a) => {
    let m = v.current.get(a);
    return m || (m = crypto.randomUUID(), v.current.set(a, m)), m;
  }, g = (a, m) => r({
    ...e,
    actions: e.actions.map(
      (A, R) => R === a ? m : A
    )
  });
  return /* @__PURE__ */ f("div", { className: "dq-editor", children: [
    /* @__PURE__ */ i("div", { className: "dq-editor-nav", children: /* @__PURE__ */ i(
      gn,
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
    /* @__PURE__ */ f("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ f("section", { hidden: d !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ i("h3", { children: "Review details" }),
        /* @__PURE__ */ i("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ f("label", { children: [
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
        /* @__PURE__ */ f("label", { children: [
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
      /* @__PURE__ */ i("section", { hidden: d !== "Queue", className: "dq-editor-section", children: /* @__PURE__ */ i(br, { draft: e, onChange: r, presentation: !1 }) }),
      /* @__PURE__ */ i("section", { hidden: d !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ i(br, { draft: e, onChange: r, queue: !1 }) }),
      /* @__PURE__ */ f("section", { hidden: d !== "Actions", className: "dq-editor-section", children: [
        /* @__PURE__ */ i("h3", { children: "Actions" }),
        /* @__PURE__ */ i("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
        /* @__PURE__ */ i("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
        /* @__PURE__ */ i(
          dr,
          {
            items: e.actions,
            getKey: (a) => a.id,
            disabled: t,
            className: "dq-sortable-list",
            onReorder: (a) => r({ ...e, actions: a }),
            renderItem: (a, { index: m, dragHandleProps: A, isOver: R }) => /* @__PURE__ */ f(
              "fieldset",
              {
                className: R ? "dq-action-card dq-drag-over" : "dq-action-card",
                children: [
                  /* @__PURE__ */ f("legend", { children: [
                    "Action ",
                    m + 1
                  ] }),
                  /* @__PURE__ */ f("div", { className: "dq-action-heading", children: [
                    /* @__PURE__ */ i(
                      "button",
                      {
                        type: "button",
                        ...A,
                        disabled: t,
                        className: "dq-drag-handle",
                        "aria-label": `Reorder action ${m + 1}`,
                        children: /* @__PURE__ */ i(Or, {})
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
                            ...e.actions.slice(0, m + 1),
                            {
                              ...structuredClone(a),
                              id: crypto.randomUUID(),
                              label: a.label + " copy",
                              shortcut: ""
                            },
                            ...e.actions.slice(m + 1)
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
                          value: a.shortcut ?? "auto",
                          onChange: (w) => g(m, {
                            ...a,
                            shortcut: w.target.value === "auto" ? void 0 : w.target.value
                          }),
                          children: [
                            /* @__PURE__ */ f("option", { value: "auto", children: [
                              "Position (",
                              m < 9 ? m + 1 : "none",
                              ")"
                            ] }),
                            /* @__PURE__ */ i("option", { value: "", children: "None" }),
                            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((w) => /* @__PURE__ */ i("option", { value: w, children: w }, w))
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ f("label", { children: [
                      "Button label",
                      /* @__PURE__ */ i(
                        "input",
                        {
                          value: a.label,
                          onChange: (w) => g(m, {
                            ...a,
                            label: w.target.value
                          })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ i(
                    dr,
                    {
                      items: a.steps,
                      getKey: E,
                      disabled: t,
                      className: "dq-sortable-list",
                      onReorder: (w) => g(m, { ...a, steps: w }),
                      renderItem: (w, { index: T, dragHandleProps: O, isOver: P }) => /* @__PURE__ */ i(
                        gi,
                        {
                          dragHandleProps: O,
                          saving: t,
                          isOver: P,
                          step: w,
                          index: T,
                          onChange: (p) => {
                            v.current.set(p, E(w)), g(m, {
                              ...a,
                              steps: a.steps.map(
                                (N, q) => q === T ? p : N
                              )
                            });
                          },
                          onRemove: () => g(m, {
                            ...a,
                            steps: a.steps.filter(
                              (p, N) => N !== T
                            )
                          })
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ f("div", { className: "dq-row", children: [
                    /* @__PURE__ */ i(
                      "button",
                      {
                        className: "dq-button",
                        type: "button",
                        onClick: () => g(m, {
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
                            (w, T) => T !== m
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
    /* @__PURE__ */ f("div", { className: "dq-editor-footer", children: [
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
            ), m = document.createElement("a");
            m.href = a, m.download = "data-quality-review.json", m.click(), URL.revokeObjectURL(a);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ i("button", { className: "dq-button", type: "button", onClick: l, children: "Cancel" }),
      /* @__PURE__ */ i("button", { className: "dq-button primary", type: "button", onClick: o, children: "Save review" })
    ] })
  ] });
}
function gi({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: o,
  isOver: l,
  onChange: d,
  onRemove: c
}) {
  const v = Fr(e.mode);
  return /* @__PURE__ */ f(
    "div",
    {
      className: l ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": v,
      children: [
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            ...r,
            disabled: o,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${t + 1}`,
            children: /* @__PURE__ */ i(Or, {})
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
            onChange: (E) => d({ ...e, mode: E.target.value }),
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
          Rt,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (E) => d({ ...e, tagIds: E }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ i("button", { type: "button", "aria-label": "Remove step", onClick: c, children: /* @__PURE__ */ i(Ir, {}) })
      ]
    }
  );
}
async function mi() {
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
function Sr({ label: e }) {
  return /* @__PURE__ */ f("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ i(qr, { className: "dq-spin" }),
    e
  ] });
}
function Er({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ f("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ i(qt, {}),
    /* @__PURE__ */ i("p", { children: e }),
    /* @__PURE__ */ i("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const Si = { components: { DataQualityPage: si } };
export {
  si as DataQualityPage,
  Si as default,
  Mt as objectFiltersEqual
};
