import { jsxs as u, jsx as n, Fragment as Ee } from "react/jsx-runtime";
import { useState as S, useEffect as Q, useRef as x, useMemo as qe, useCallback as he, useLayoutEffect as cr } from "react";
import { VIDEO_SORT_OPTIONS as yt, FilterDialog as _r, VIDEO_CRITERIA as bt, EntityReferenceMultiSelector as wt, DetailListToolbar as Ur, DetailListPagination as jr, VideoPlayer as Br, VideoCard as Kr, EntityDetailTabs as Vr, SortableList as Xt } from "@cove/runtime/components";
import { ChevronLeft as dr, Pencil as ur, Settings as Jr, AlertTriangle as vt, ChevronRight as fr, Film as Yt, Loader2 as pr, ExternalLink as zr, X as gr, Plus as Qr, Upload as Hr, Trash2 as hr, GripVertical as mr } from "@cove/runtime/lucide-react";
import { extensionFetch as Wr } from "@cove/runtime/api";
function ke(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function St(e) {
  if (e.actions.some(yr))
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
function de(e) {
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
function ve(e) {
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
  ) && !yr(e);
}
function Ge(e) {
  return e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  );
}
function yr(e) {
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
function Oe(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Gr(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
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
function Gr(e) {
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
function Xr(e, t, r, o) {
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
function Yr(e, t) {
  const r = new Set(e), o = t.length > 0 && t.every((l) => r.has(l));
  for (const l of t)
    o ? r.delete(l) : r.add(l);
  return r;
}
function Zr(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const br = "ext:com.midnightrider.data-quality:configuration", en = "ext:cove-data-quality:video-reviews", Nt = "ext:com.midnightrider.data-quality:progress", Te = /* @__PURE__ */ new Map(), We = /* @__PURE__ */ new Map(), pt = (e, t) => e.includes("*") || e.includes(t), Xe = (e) => B(`/api/savedfilters?mode=${encodeURIComponent(e)}`), tn = () => ({
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
    reviews: Oe(JSON.stringify(t.reviews)),
    deletedIds: Ct(t.deletedIds),
    importedIds: Ct(t.importedIds)
  };
}
function rn(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const o = /* @__PURE__ */ new Set();
  for (const l of t) {
    const d = localStorage.getItem(l);
    if (d !== null) {
      const c = Oe(d);
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
  const t = await B("/api/auth/me");
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
function nn() {
  if (Ie) return Ie;
  const e = on();
  return Ie = e, e.finally(() => {
    Ie === e && (Ie = null);
  }).catch(() => {
  }), e;
}
async function on() {
  var C;
  const e = await B("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, o = pt(e.permissions, "savedfilters.read"), l = o && pt(e.permissions, "savedfilters.write"), d = o ? (await Xe(br)).filter((R) => R.name === "Data Quality configuration").sort((R, b) => R.id - b.id) : [];
  if (d.length > 1) {
    const R = (b) => {
      const { revision: I, ...O } = Se(b.uiOptions);
      return JSON.stringify(O);
    };
    if (d.some((b) => R(b) !== R(d[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (l)
      for (const b of d.slice(1))
        await B(`/api/savedfilters/${b.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${b.id}` })
        });
    d.splice(1);
  }
  let c = d.length ? Se(d[0].uiOptions) : tn();
  const v = localStorage.getItem(`${r}:migrated`) === "true", E = localStorage.getItem(r), p = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && E && (c = Se(E));
  let s = !d.length;
  if (d.length && p && E) {
    const R = Se(E);
    if (R.reviews.some((I) => {
      const O = c.reviews.find((P) => P.id === I.id);
      return O && JSON.stringify(O) !== JSON.stringify(I);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const b = [
      .../* @__PURE__ */ new Set([...c.deletedIds, ...R.deletedIds])
    ];
    c = {
      ...c,
      reviews: Et(c.reviews, R.reviews).filter(
        (I) => !b.includes(I.id)
      ),
      deletedIds: b,
      importedIds: [
        .../* @__PURE__ */ new Set([...c.importedIds, ...R.importedIds])
      ]
    }, s = !0;
  }
  if (!v) {
    const R = JSON.stringify(c), b = rn(t);
    if (d.length && b.reviews.some((f) => {
      const N = c.reviews.find((q) => q.id === f.id);
      return N && JSON.stringify(N) !== JSON.stringify(f);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const I = o ? (await Xe(en)).flatMap(
      (f) => Oe(f.uiOptions ?? "[]")
    ) : [], O = b.known.filter(
      (f) => !b.reviews.some((N) => N.id === f)
    ), P = /* @__PURE__ */ new Set([...c.deletedIds, ...O]);
    c = {
      ...c,
      reviews: Et(
        b.reviews,
        c.reviews,
        I.filter(
          (f) => !b.known.includes(f.id) && !c.importedIds.includes(f.id)
        )
      ).filter((f) => !P.has(f.id)),
      deletedIds: [...P],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...c.importedIds,
          ...b.known,
          ...I.map((f) => f.id)
        ])
      ]
    }, s || (s = JSON.stringify(c) !== R);
  }
  const g = {
    userId: t,
    recordId: (C = d[0]) == null ? void 0 : C.id,
    config: c,
    readable: o,
    writable: l,
    durable: l
  };
  if (Te.set(r, g), s && l) {
    const R = c;
    d.length && (g.config = Se(d[0].uiOptions)), await Sr(r, R), c = g.config;
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
  const r = Te.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const o = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await wr(r), r.recordId != null) {
      const d = await B(
        `/api/savedfilters/${r.recordId}`
      );
      if (Se(d.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const l = await B(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: br,
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
function sn(e, t) {
  return Oe(JSON.stringify(t)), vr(e, async () => {
    const r = Te.get(e);
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
async function an(e, t) {
  const r = Te.get(e);
  if (!r) return null;
  const o = localStorage.getItem(`${e}:progress:${t}`), l = o ? tr(o) : null;
  if (!r.readable) return l;
  const d = (await Xe(Nt)).find(
    (v) => v.name === t
  ), c = d ? tr(d.uiOptions) : null;
  return l && (!c || l.updatedAt > c.updatedAt) ? l : c;
}
function ln(e, t, r) {
  const o = `${e}:progress:${t}`;
  try {
    localStorage.setItem(o, JSON.stringify(r));
  } catch {
  }
  return vr(o, async () => {
    const l = Te.get(e);
    if (!(l != null && l.writable)) return;
    await wr(l);
    const d = (await Xe(Nt)).find(
      (c) => c.name === t
    );
    await B(
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
const Pe = "confirmed_absent_tags", qt = "Confirmed absent tags", cn = {
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
      t === "modifier" && typeof r == "string" ? cn[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === Pe.toLowerCase() ? r.toLowerCase() : Ye(r)
    ])
  ) : e;
}
async function B(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const o = await Wr(e, { ...t, headers: r });
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
  return B("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Ye({
        findFilter: de(t),
        objectFilter: o,
        filterExpression: l
      })
    )
  });
}
function dn(e) {
  return `/api/stream/video/${e}`;
}
function rr(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function un(e) {
  return `/api/stream/video/${e}/preview`;
}
function fn(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function pn(e) {
  return e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function It(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await B(`/api/tags/${r}`), t.add(r);
    for (let o = 1; ; o++) {
      const l = await B("/api/tags/find", {
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
function gn(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${Pe} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function kt() {
  const t = (await B("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === Pe.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${qt} custom field before applying tag assessments.`
    };
  const r = gn(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function hn() {
  const e = await kt();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await B("/api/custom-fields", {
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
function mn(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${Pe} value is not a valid tag list.`
    );
  return Ze(e);
}
function yn(e) {
  return Ze(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function bn(e, t) {
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
      const s = await B(`/api/videos/${p}`), g = yn(s), C = { ...s.customFields ?? {} }, R = C[v], b = mn(R), I = new Set(g), O = new Set(b);
      for (const q of l)
        for (const L of q.tagIds)
          q.mode === "ADD" ? I.add(L) : I.delete(L);
      for (const q of d)
        for (const L of q.tagIds)
          q.mode === "MARK_PRESENT" ? (I.add(L), O.delete(L)) : q.mode === "MARK_ABSENT" ? (I.delete(L), O.add(L)) : O.delete(L);
      const P = [...I], f = [...O];
      JSON.stringify(g) === JSON.stringify(P) && JSON.stringify(b) === JSON.stringify(f) && (R === void 0 ? f.length === 0 : JSON.stringify(R) === JSON.stringify(b)) || await B(`/api/videos/${p}`, {
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
async function wn(e, t) {
  if (!Rt(e) || t.length === 0 || t.some((o) => !Number.isSafeInteger(o) || o <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (Ge(e)) {
    await bn(e, t);
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
function vn(e) {
  var v, E, p;
  const [t, r] = S({}), [o, l] = S(""), d = (((v = e == null ? void 0 : e.presentation) == null ? void 0 : v.annotations) ?? []).includes("tags") ? ((E = e == null ? void 0 : e.presentation) == null ? void 0 : E.annotationParents) ?? [] : [], c = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...d,
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return Q(() => {
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
function Sn(e, t, r) {
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
function En({
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
function Nn(e, t) {
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
  return /* @__PURE__ */ u(Ee, { children: [
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
                !yt.some((s) => s.value === c.sort) && c.sort != null && /* @__PURE__ */ n("option", { value: String(c.sort), children: String(c.sort) }),
                yt.map((s) => /* @__PURE__ */ n("option", { value: s.value, children: s.label }, s.value))
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
        _r,
        {
          open: !0,
          onClose: () => d(!1),
          criteria: bt,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: !0,
          subjectLabel: "videos",
          onApply: (s) => {
            t({ ...e, view: { ...e.view, objectFilter: s } }), d(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ u(Ee, { children: [
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
                annotations: C.target.checked ? [...g, s] : g.filter((R) => R !== s)
              })
            }
          ),
          s
        ] }, s);
      }) }),
      (E.annotations ?? []).includes("tags") && /* @__PURE__ */ u(Ee, { children: [
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
const Cn = {
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
function Ot(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function An(e) {
  const t = e.replaceAll("_", " ").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : "Custom field";
}
function Rn(e) {
  return [
    ...new Set(
      Ot(e.customFieldCriteria).filter(
        (t) => String(t.type).toLowerCase() === "tag"
      ).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !String(t ?? "").trim()).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function qn(e, t) {
  const r = Ot(e.customFieldCriteria);
  return r.length ? {
    ...e,
    customFieldCriteria: r.map((o) => {
      const l = String(o.key ?? ""), d = Cn[String(o.modifier ?? "EQUALS")], c = (g, C) => String(C ?? "").trim() || t[String(g)] || String(g ?? ""), v = c(
        o.value,
        o.displayValue
      ), E = c(
        o.value2,
        o.displayValue2
      ), p = String(o.modifier ?? "EQUALS"), s = p === "IS_NULL" || p === "NOT_NULL" ? [] : p === "BETWEEN" || p === "NOT_BETWEEN" ? [v, "and", E] : [v];
      return {
        ...o,
        label: [An(l), d, ...s].filter(Boolean).join(" ")
      };
    })
  } : e;
}
function In(e) {
  const t = Ot(e.customFieldCriteria);
  return t.length ? {
    ...e,
    customFieldCriteria: t.map(
      ({ label: r, ...o }) => o
    )
  } : e;
}
function kn(e, t, r) {
  return r || "customFieldCriteria" in t || !Array.isArray(e.customFieldCriteria) ? t : { ...t, customFieldCriteria: e.customFieldCriteria };
}
const ht = 180, On = {
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
function Tn() {
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
function Pn(e) {
  return de({ ...e, page: 1 });
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
function Ln({
  onNavigate: e
}) {
  const [t, r] = S([]), [o] = S(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [l, d] = S(""), [c, v] = S(!0), [E, p] = S(""), [s, g] = S(!1), [C, R] = S(!0), [b, I] = S(""), [O, P] = S(""), [f, N] = S(!1), [q, L] = S(!1), [m, F] = S(Tn), [j, K] = S({}), [se, ae] = S("name"), [Z, Nr] = S("asc"), Tt = x(null), et = x(!1), [Pt, tt] = S(!1), [Lt, Mt] = S(!1), [W, Ne] = S(
    null
  ), $ = t.find((i) => i.id === m) ?? null, y = qe(
    () => (W == null ? void 0 : W.id) === m && $ ? { ...$, view: W.view } : $,
    [W, m, $]
  ), Cr = qe(() => {
    const i = Z === "asc" ? 1 : -1;
    return [...t].sort((a, h) => {
      if (se === "count") {
        const w = j[a.id], k = j[h.id], A = typeof w == "number", U = typeof k == "number";
        if (A !== U) return A ? -1 : 1;
        if (A && U && w !== k)
          return (w - k) * i;
      }
      return a.name.localeCompare(h.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * i;
    });
  }, [Z, se, j, t]), Le = x(
    null
  ), Me = vn(y), [V, xe] = S({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Ar, Rr] = S({
    page: 1,
    perPage: 40
  }), [re, xt] = S({ items: [], totalCount: 0 }), [T, De] = S(!1), [ne, Dt] = S(""), [le, ue] = S(() => /* @__PURE__ */ new Set()), rt = x(le);
  rt.current = le;
  const me = x(/* @__PURE__ */ new Map()), [G, ie] = S(null), ee = x(G);
  ee.current = G;
  const [oe, ye] = S(!1), ce = x(oe);
  ce.current = oe;
  const Ft = x(null), [Fe, nt] = S("grid"), [$e, $t] = S(ht), [M, it] = S(!1), _e = x(!1), [qr, ot] = S(""), [_t, be] = S(""), [st, Ce] = S(""), [_, Ut] = S(null), [jt, Ue] = S(""), [je, Be] = S(!1), [Bt, Kt] = S({}), at = x(/* @__PURE__ */ new Map()), Vt = x(null), we = x(0), Ke = x(0), Ve = x(null), fe = x(!1);
  Q(() => {
    const i = y ? Rn(y.view.objectFilter) : [];
    if (Kt({}), !i.length) return;
    const a = new AbortController();
    let h = !0;
    return Promise.all(
      i.map(async (w) => {
        var k;
        try {
          const A = await B(`/api/tags/${w}`, {
            signal: a.signal
          });
          return (k = A.name) != null && k.trim() ? [String(w), A.name] : null;
        } catch {
          return null;
        }
      })
    ).then((w) => {
      h && Kt(
        Object.fromEntries(w.filter((k) => k !== null))
      );
    }), () => {
      h = !1, a.abort();
    };
  }, [y == null ? void 0 : y.id, y == null ? void 0 : y.view.objectFilter]);
  const lt = qe(
    () => y ? qn(
      y.view.objectFilter,
      Bt
    ) : {},
    [Bt, y]
  ), Ir = qe(
    () => Array.isArray(lt.customFieldCriteria) ? [...bt, On] : bt,
    [lt.customFieldCriteria]
  ), Jt = he(async () => {
    v(!0), p("");
    try {
      const i = await nn();
      r(i.reviews), d(i.storageKey), g(i.canWrite), R(i.canConfigure ?? !0), I(i.storageNotice ?? ""), m && !i.reviews.some((a) => a.id === m) && (F(""), sr(""));
    } catch (i) {
      p(
        i instanceof Error ? i.message : "Could not load reviews."
      );
    } finally {
      v(!1);
    }
  }, [m]);
  Q(() => {
    Jt();
  }, []), Q(() => {
    if (m || t.length === 0) return;
    const i = new AbortController();
    K({});
    for (const a of t)
      gt(
        a,
        de({ ...a.view.filter, page: 1, perPage: 1 }),
        i.signal
      ).then((h) => {
        i.signal.aborted || K((w) => ({
          ...w,
          [a.id]: h.totalCount
        }));
      }).catch(() => {
        i.signal.aborted || K((h) => ({ ...h, [a.id]: null }));
      });
    return () => i.abort();
  }, [m, t]), cr(() => {
    var i;
    m || c || !et.current || (et.current = !1, (i = Tt.current) == null || i.focus());
  }, [m, c]);
  const Je = he(async () => {
    Ue("");
    try {
      Ut(await kt());
    } catch (i) {
      Ut(null), Ue(
        "Tag assessment setup could not be checked. " + (i instanceof Error ? i.message : "Request failed.")
      );
    }
  }, []);
  Q(() => {
    Je();
  }, [Je]);
  const pe = he(
    async (i, a) => {
      var k;
      const h = ++we.current;
      (k = Ve.current) == null || k.abort();
      const w = new AbortController();
      Ve.current = w, a = de(a), xe(a), De(!0), Dt("");
      try {
        let A = await gt(
          i,
          a,
          w.signal
        );
        const U = Math.max(
          1,
          Math.ceil(A.totalCount / Number(a.perPage))
        );
        return Number(a.page) > U && (a = { ...a, page: U }, A = await gt(
          i,
          a,
          w.signal
        )), h === we.current && (xt(A), xe(a), Rr(a)), A;
      } catch (A) {
        throw h === we.current && Dt(
          A instanceof Error ? A.message : "Could not load the review queue."
        ), A;
      } finally {
        h === we.current && De(!1);
      }
    },
    []
  );
  Q(() => {
    var a;
    if (Ke.current += 1, we.current += 1, (a = Ve.current) == null || a.abort(), L(!1), P(""), N(!1), ue(/* @__PURE__ */ new Set()), me.current.clear(), ie(null), ye(!1), it(!1), _e.current = !1, ot(""), be(""), Ce(""), xt({ items: [], totalCount: 0 }), !y) {
      De(!1);
      return;
    }
    let i = !0;
    return De(!0), (async () => {
      let h = null;
      try {
        h = await an(l, y.id);
      } catch (A) {
        i && (N(!0), P(
          A instanceof Error ? A.message : "Could not load progress."
        ));
      }
      if (!i) return;
      const w = (h == null ? void 0 : h.signature) === ve(y) ? h : null, k = w ? de(w.filter) : Pn(y.view.filter);
      xe(k), nt(
        w ? or(w.displayMode) : ir(y)
      ), $t(
        w ? w.cardSize ?? ht : ht
      );
      try {
        const A = await pe(y, k);
        if (!i) return;
        const U = Zt(
          A.items.map((z) => z.id),
          (w == null ? void 0 : w.focusedId) ?? null,
          (w == null ? void 0 : w.index) ?? 0
        );
        ie(U), J(U);
      } catch {
      }
      i && L(!0);
    })(), () => {
      var h;
      i = !1, Ke.current++, we.current++, (h = Ve.current) == null || h.abort();
    };
  }, [y == null ? void 0 : y.id]);
  const D = qe(
    () => re.items.map((i) => i.id),
    [re.items]
  );
  Q(() => {
    if (!q || !y || !l || T || ne || M || (W == null ? void 0 : W.id) === y.id || f)
      return;
    const i = {
      version: 1,
      signature: ve(y),
      filter: V,
      focusedId: G,
      index: Math.max(0, D.indexOf(G ?? -1)),
      displayMode: Fe,
      cardSize: $e,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        l + ":progress:" + y.id,
        JSON.stringify(i)
      );
    } catch {
    }
    if (O) return;
    let a = !0;
    const h = window.setTimeout(() => {
      ln(l, y.id, i).catch((w) => {
        a && P(
          "Progress is kept in this browser, but account sync failed. " + (w instanceof Error ? w.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      a = !1, window.clearTimeout(h);
    };
  }, [
    q,
    l,
    y,
    T,
    ne,
    M,
    V,
    G,
    D,
    Fe,
    $e,
    W,
    O,
    f
  ]);
  const ct = re.items.find((i) => i.id === G) ?? null;
  oe && ct && (Ft.current = ct);
  const ge = ct ?? (oe ? Ft.current : null), kr = er(le, G), zt = le.size > 0 ? `${le.size} selected video${le.size === 1 ? "" : "s"}` : G == null ? "no video" : "focused video", J = he((i, a = !0) => {
    i != null && window.requestAnimationFrame(() => {
      const h = at.current.get(i);
      h == null || h.focus({ preventScroll: !0 }), a && (h == null || h.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  Q(() => {
    q && !ce.current && J(ee.current);
  }, [q, J]), Q(() => {
    T || !D.length || (ee.current == null || !D.includes(ee.current)) && (ie(D[0]), ce.current || J(D[0]));
  }, [J, D, T]);
  const Ae = he(
    (i) => {
      ue((a) => {
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
  ), dt = he(
    (i) => {
      if (!D.length) return;
      const a = Math.max(
        0,
        D.indexOf(ee.current ?? D[0])
      ), h = D[Math.max(0, Math.min(D.length - 1, a + i))];
      ie(h), ce.current || J(h);
    },
    [J, D]
  ), ut = he(
    async (i) => {
      const a = er(
        rt.current,
        ee.current
      );
      if (!y || _e.current || T || ne || !s || Ge(i) && (_ == null ? void 0 : _.kind) !== "ready" || !a.length)
        return;
      const h = ++Ke.current, w = y.id, k = [...D], A = ee.current, U = new Map(
        a.map((H) => [H, me.current.get(H) ?? 0])
      ), z = () => h === Ke.current && y.id === w;
      _e.current = !0, it(!0), ot(
        rt.current.size ? `${a.length} selected videos` : "the focused video"
      ), be(""), Ce("");
      let Re = !1;
      try {
        if (await wn(i, a), Re = !0, !z()) return;
        ue((H) => {
          const X = new Set(H);
          for (const te of a)
            (me.current.get(te) ?? 0) === U.get(te) && X.delete(te);
          return X;
        }), be(
          `${i.label}: ${a.length} video${a.length === 1 ? "" : "s"} ${i.steps.length ? "updated" : "skipped"}.`
        );
      } catch (H) {
        if (!z()) return;
        Ce(
          H instanceof Error ? H.message : "Action failed."
        );
      }
      try {
        if (await pn(i), !z()) return;
        const H = await pe(y, V);
        if (!z()) return;
        let X = H.items.map((te) => te.id);
        if (!X.length && H.totalCount > 0 && Number(V.page) > 1) {
          const te = Math.max(1, Number(V.page) - 1), He = { ...V, page: te };
          xe(He), X = (await pe(y, He)).items.map((ft) => ft.id), ue(
            (ft) => new Set([...ft].filter(($r) => X.includes($r)))
          );
          const Gt = X.at(-1) ?? null;
          ie(Gt), ce.current || J(Gt);
        } else {
          ue(
            (He) => new Set([...He].filter((Wt) => X.includes(Wt)))
          );
          const te = Xr(
            k,
            X,
            A,
            Re && a.includes(A ?? -1)
          );
          ie(te), ce.current && te == null && ye(!1), ce.current || J(te);
        }
      } catch (H) {
        z() && Ce(
          (X) => `${X ? `${X} ` : ""}${Re ? "The action completed, but " : ""}the queue could not be refreshed. ${H instanceof Error ? H.message : "Refresh failed."}`
        );
      } finally {
        z() && (_e.current = !1, it(!1), ot(""));
      }
    },
    [
      s,
      _,
      pe,
      V,
      J,
      D,
      T,
      ne,
      y
    ]
  );
  function Or() {
    var h;
    const i = (h = Vt.current) == null ? void 0 : h.firstElementChild, a = i ? getComputedStyle(i).gridTemplateColumns : "";
    return Math.max(1, a.split(" ").filter(Boolean).length);
  }
  function Tr(i) {
    if (i.defaultPrevented || i.repeat || i.ctrlKey || i.altKey || i.metaKey || Pt) return;
    if (oe && i.key === "Escape") {
      Y(i), ye(!1), J(ee.current);
      return;
    }
    if (!Zr(i.target)) return;
    if (i.key === "Escape") {
      Y(i), Ae(() => /* @__PURE__ */ new Set());
      return;
    }
    const a = (y == null ? void 0 : y.actions.findIndex(
      (k, A) => ke(k, A) === i.key
    )) ?? -1;
    if (a >= 0 && (y != null && y.actions[a])) {
      Y(i), !M && !T && ut(y.actions[a]);
      return;
    }
    if (!oe && i.key === " ") {
      Y(i), G != null && Ae((k) => mt(k, G));
      return;
    }
    if (!oe && i.key.toLowerCase() === "a") {
      Y(i), Ae(
        (k) => Yr(k, D)
      );
      return;
    }
    if (M || T || oe) return;
    if (i.key === "Enter" && G != null) {
      Y(i), ye(!0);
      return;
    }
    const h = Or(), w = i.key === "ArrowLeft" ? -1 : i.key === "ArrowRight" ? 1 : i.key === "ArrowUp" ? -h : i.key === "ArrowDown" ? h : 0;
    w && (Y(i), dt(w));
  }
  function ze(i) {
    F(i), sr(i);
  }
  function Pr() {
    et.current = !0, K({}), ze("");
  }
  async function Qt(i) {
    if (!l) return !1;
    const a = i.map(xn);
    try {
      await sn(l, a);
    } catch (w) {
      throw w;
    }
    r(a), m && !a.some((w) => w.id === m) && ze("");
    const h = a.find((w) => w.id === m);
    return h && $ && JSON.stringify(h) !== JSON.stringify($) && (h.view.displayMode !== $.view.displayMode && nt(ir(h)), ve(h) !== ve($) && (Ne(null), Qe(
      h,
      de({ ...h.view.filter, page: V.page })
    ))), !0;
  }
  if (c)
    return /* @__PURE__ */ n(ar, { label: "Loading reviews…" });
  if (E)
    return /* @__PURE__ */ u(Ee, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Bn().catch(
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
  return /* @__PURE__ */ u("div", { className: "data-quality-page", onKeyDown: Tr, children: [
    /* @__PURE__ */ u("header", { className: "data-quality-header", children: [
      y && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: M,
          onClick: Pr,
          children: /* @__PURE__ */ n(dr, {})
        }
      ),
      /* @__PURE__ */ u("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (y == null ? void 0 : y.name) ?? "Data Quality" }),
        (y == null ? void 0 : y.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: y.description })
      ] }),
      y && $ && /* @__PURE__ */ n(
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
          children: /* @__PURE__ */ n(Jr, {})
        }
      )
    ] }),
    b && /* @__PURE__ */ n("p", { className: "dq-status", children: b }),
    (_ == null ? void 0 : _.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      _.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: je,
          onClick: () => {
            Be(!0), Ue(""), hn().then(Je).catch(
              (i) => Ue(
                "Could not create the Confirmed absent tags custom field. " + (i instanceof Error ? i.message : "Request failed.")
              )
            ).finally(() => Be(!1));
          },
          children: je ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    ((_ == null ? void 0 : _.kind) === "incompatible" || jt) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(vt, {}),
      jt || (_ == null ? void 0 : _.message),
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
            ), h = document.createElement("a");
            h.href = a, h.download = "data-quality-unassigned-legacy-reviews.json", h.click(), URL.revokeObjectURL(a);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    O && /* @__PURE__ */ u("p", { role: "alert", children: [
      O,
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
    y && $ && /* @__PURE__ */ u("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${M || T ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": M || T || void 0,
          inert: M || T ? !0 : void 0,
          onClickCapture: (i) => {
            var h, w, k, A, U;
            const a = i.target instanceof Element ? i.target.closest("button") : null;
            (a == null ? void 0 : a.getAttribute("aria-label")) === "Remove filter: Custom Fields" || ((h = a == null ? void 0 : a.textContent) == null ? void 0 : h.trim()) === "Clear all" ? fe.current = !0 : ((w = a == null ? void 0 : a.getAttribute("aria-label")) != null && w.startsWith("Filters") || (k = a == null ? void 0 : a.getAttribute("aria-label")) != null && k.startsWith("Edit filter:") || ((A = a == null ? void 0 : a.textContent) == null ? void 0 : A.trim()) === "Cancel" || (U = a == null ? void 0 : a.getAttribute("aria-label")) != null && U.startsWith("Close ")) && (fe.current = !1);
          },
          onKeyDownCapture: (i) => {
            var h, w;
            const a = i.target instanceof Element ? i.target.closest("button") : null;
            (i.key === "Delete" || i.key === "Backspace") && (a == null ? void 0 : a.getAttribute("aria-label")) === "Edit filter: Custom Fields" ? (i.preventDefault(), i.stopPropagation(), fe.current = !0, (w = (h = a.parentElement) == null ? void 0 : h.querySelector(
              'button[aria-label="Remove filter: Custom Fields"]'
            )) == null || w.click()) : i.key === "Escape" && (fe.current = !1);
          },
          children: /* @__PURE__ */ n(
            Ur,
            {
              filter: ne ? Ar : V,
              onFilterChange: Lr,
              totalCount: re.totalCount,
              sortOptions: yt,
              showSearch: !0,
              showSort: !0,
              displayMode: Fe,
              onDisplayModeChange: (i) => nt(or(i)),
              availableDisplayModes: ["grid", "wall"],
              zoomLevel: ($e - 225) / 50,
              onZoomChange: (i) => $t(Math.round(225 + i * 50)),
              cardSizeEntityType: "videos",
              criteriaDefinitions: Ir,
              objectFilter: lt,
              onObjectFilterChange: (i) => {
                if (!M && !T) {
                  const a = In(i);
                  Le.current = kn(
                    y.view.objectFilter,
                    a,
                    fe.current
                  ), fe.current = !1;
                }
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (W == null ? void 0 : W.id) === m && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n("span", { children: "Temporary queue" }),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: M || T || !C,
            onClick: xr,
            children: "Save queue to review"
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: M || T,
            onClick: Mr,
            children: "Reset to review defaults"
          }
        )
      ] })
    ] }),
    y ? /* @__PURE__ */ u(Ee, { children: [
      Me.error && /* @__PURE__ */ n("p", { role: "alert", children: Me.error }),
      /* @__PURE__ */ n(
        En,
        {
          videos: re.items,
          review: y,
          trees: Me.ids,
          disabled: M || T,
          onChoose: (i) => {
            const a = Nn(y, i);
            Ne(a), Qe(a, { ...V, page: 1 });
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
              onRetry: () => void pe(y, V).catch(() => {
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
              children: re.items.map(Fr)
            }
          ) })
        ] }),
        /* @__PURE__ */ u("aside", { className: "dq-actions", children: [
          /* @__PURE__ */ n("strong", { children: zt }),
          y.actions.map((i, a) => /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              disabled: M || T || !!ne || !s || Ge(i) && (_ == null ? void 0 : _.kind) !== "ready" || !kr.length,
              onClick: () => void ut(i),
              children: [
                ke(i, a) && /* @__PURE__ */ n("kbd", { children: ke(i, a) }),
                /* @__PURE__ */ n("span", { children: i.label }),
                /* @__PURE__ */ n("small", { children: i.steps.length ? `${i.steps.length} step(s)` : "Skip" })
              ]
            },
            i.id
          )),
          !y.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
          !s && /* @__PURE__ */ n("p", { children: "Video write permission is required to apply actions." }),
          M && /* @__PURE__ */ u("p", { role: "status", children: [
            /* @__PURE__ */ n(pr, { className: "dq-spin" }),
            " Applying action to",
            " ",
            qr,
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
                  ref: Tt,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ n("p", { children: "Choose a review to open its video queue." }),
              /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                (i) => j[i.id] !== void 0
              ) ? t.some((i) => j[i.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ u("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ u(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: se,
                    onChange: (i) => ae(
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
            const a = j[i.id];
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
    oe && ge && y && /* @__PURE__ */ n(
      $n,
      {
        video: ge,
        review: y,
        targetLabel: zt,
        pending: M,
        refreshing: T || !!ne,
        error: st,
        canWrite: s,
        assessmentReady: (_ == null ? void 0 : _.kind) === "ready",
        selected: le.has(ge.id),
        hasPrevious: D.indexOf(ge.id) > 0,
        hasNext: D.indexOf(ge.id) >= 0 && D.indexOf(ge.id) < D.length - 1,
        onToggleSelected: () => Ae((i) => mt(i, ge.id)),
        onPrevious: () => dt(-1),
        onNext: () => dt(1),
        onClose: () => {
          ye(!1), J(ee.current);
        },
        onAction: ut
      }
    ),
    Pt && /* @__PURE__ */ n(
      _n,
      {
        reviews: t,
        activeReview: $,
        initialEdit: Lt,
        onSave: Qt,
        onChoose: ze,
        onClose: () => {
          tt(!1), Lt && J(ee.current, !1);
        }
      }
    )
  ] });
  async function Qe(i, a) {
    const h = ee.current, w = Math.max(0, D.indexOf(h ?? -1));
    try {
      const A = (await pe(i, a)).items.map((z) => z.id);
      ue(
        (z) => new Set([...z].filter((Re) => A.includes(Re)))
      );
      const U = Zt(A, h, w);
      ie(U), ce.current || J(U, !1);
    } catch {
    }
  }
  function Lr(i) {
    const a = Le.current;
    if (Le.current = null, M || T || !y || !$) return;
    const h = a ?? y.view.objectFilter, w = At(
      h,
      $.view.objectFilter
    ) ? $.view.objectFilter : h, k = de({ ...i, page: 1 }), A = {
      ...y,
      view: {
        ...y.view,
        filter: k,
        objectFilter: w
      }
    }, U = ve(A) !== ve($), z = U ? A : $;
    Ne(U ? A : null), be(
      U ? "Queue adjusted for this session." : "Review queue defaults restored."
    ), Qe(z, k);
  }
  function Mr() {
    if (M || T || !$) return;
    Le.current = null;
    const i = de({
      ...$.view.filter,
      page: 1
    });
    Ne(null), be("Review queue defaults restored."), Qe($, i);
  }
  function xr() {
    M || T || !y || !$ || !C || Qt(
      t.map(
        (i) => i.id === m ? {
          ...i,
          view: {
            ...y.view,
            filter: { ...V, page: 1 }
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
  function Dr() {
    ue(/* @__PURE__ */ new Set()), me.current.clear(), ie(null);
  }
  function Ht(i) {
    return y ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: M || T,
        "aria-label": `Review queue pagination ${i}`,
        children: /* @__PURE__ */ n(
          jr,
          {
            filter: {
              ...V,
              page: Number(V.page) || 1,
              perPage: Number(V.perPage) || 40
            },
            totalCount: re.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${i}`,
            onFilterChange: (a) => {
              M || T || a.page === Number(V.page) || Mn(
                { ...V, page: a.page },
                y,
                pe,
                Dr
              );
            }
          }
        )
      }
    ) : null;
  }
  function Fr(i) {
    return /* @__PURE__ */ n(
      Dn,
      {
        video: Sn(i, y, Me.ids),
        displayMode: Fe,
        focused: i.id === G,
        selected: le.has(i.id),
        setRef: (a) => {
          a ? at.current.set(i.id, a) : at.current.delete(i.id);
        },
        onFocus: () => ie(i.id),
        onToggle: () => Ae((a) => mt(a, i.id)),
        onPreview: () => {
          ie(i.id), ye(!0);
        },
        onNavigate: e
      },
      i.id
    );
  }
}
function Mn(e, t, r, o) {
  o(), r(t, e).catch(() => {
  });
}
function mt(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function xn(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Dn({
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
  const p = Er(e), s = x(null), g = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, C = !!(g.date || g.studioName), R = !!(g.performers.length || g.tags.length);
  return cr(() => {
    const b = s.current;
    if (!b) return;
    const I = b.querySelector(
      `a[href="/video/${e.id}"]`
    ), O = b.querySelector(".card-title"), P = `dq-card-title-${e.id}`;
    O && (O.id = P), I && (I.target = "_blank", I.rel = "noreferrer", I.removeAttribute("aria-label"), I.setAttribute("aria-labelledby", P), I.classList.add("dq-card-link"));
    const f = b.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    f && f.setAttribute(
      "aria-label",
      o ? `Deselect ${p}` : `Select ${p}`
    );
    const N = b.querySelector(
      'button[title="Quick View"]'
    );
    N && N.setAttribute("aria-label", `Preview ${p}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (b) => {
        s.current = b, l(b);
      },
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${p}${o ? ", selected" : ""}`,
      onFocus: d,
      onClick: (b) => {
        d(), b.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${t} ${C ? "has-card-metadata" : "no-card-metadata"} ${R ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          Kr,
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
        t === "wall" && /* @__PURE__ */ n(Fn, { video: e })
      ]
    }
  );
}
function Fn({ video: e }) {
  const t = x(null), r = x(null), [o, l] = S(!1), [d, c] = S(!1), [v, E] = S(!1);
  return Q(() => {
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
  }, [e.id, e.files.length]), Q(() => {
    if (!o) {
      E(!1);
      return;
    }
    const p = new AbortController();
    return B(fn(e.id), {
      signal: p.signal
    }).then((s) => {
      p.signal.aborted || E(s.available === !0);
    }).catch(() => {
      p.signal.aborted || E(!1);
    }), () => p.abort();
  }, [o, e.id]), Q(() => {
    const p = r.current;
    p && (d ? Promise.resolve(p.play()).catch(() => {
    }) : p.pause());
  }, [v, d]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: v && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: un(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function $n({
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
  onNext: R,
  onClose: b,
  onAction: I
}) {
  const O = x(null), P = x(null), f = e.files[0], N = Er(e);
  Q(() => {
    var F;
    const m = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (F = O.current) == null || F.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = m;
    };
  }, []);
  function q(m) {
    var K, se, ae;
    if (m.key !== "Tab") return;
    const F = [
      ...((K = O.current) == null ? void 0 : K.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((Z) => Z.offsetParent !== null);
    if (!F.length) {
      m.preventDefault(), (se = O.current) == null || se.focus();
      return;
    }
    const j = F.indexOf(
      document.activeElement
    );
    m.shiftKey && j <= 0 ? (m.preventDefault(), (ae = F.at(-1)) == null || ae.focus()) : !m.shiftKey && j === F.length - 1 && (m.preventDefault(), F[0].focus());
  }
  function L(m) {
    if (m.defaultPrevented || m.ctrlKey || m.metaKey || m.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const F = m.key === "ArrowLeft" || m.key === "ArrowRight";
    if (m.altKey && !F) return;
    const j = P.current, K = m.currentTarget.querySelector("video");
    if (m.key === "Enter" || m.key === "Escape")
      m.repeat || b();
    else if (m.key === " " && j)
      m.repeat || j.toggle();
    else if (F && j)
      j.seekBy(
        (m.key === "ArrowLeft" ? -1 : 1) * (m.shiftKey ? 5 : m.altKey ? 10 : 60)
      );
    else if ((m.key === "," || m.key === ".") && j) {
      const se = [f == null ? void 0 : f.duration, K == null ? void 0 : K.duration].find(
        (Z) => Z != null && Number.isFinite(Z) && Z > 0
      ) ?? 0, ae = e.parentVideoId != null ? (e.clipEndSec ?? se) - (e.clipStartSec ?? 0) : se;
      Number.isFinite(ae) && ae > 0 && j.seekBy((m.key === "," ? -1 : 1) * ae * 0.1);
    } else if (m.key.toLowerCase() === "n" || m.key.toLowerCase() === "m")
      !m.repeat && !o && !l && (m.key.toLowerCase() === "n" && p && C(), m.key.toLowerCase() === "m" && s && R());
    else if (m.key === "ArrowUp" && K)
      K.volume = Math.min(1, K.volume + 0.1);
    else if (m.key === "ArrowDown" && K)
      K.volume = Math.max(0, K.volume - 0.1);
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
      onKeyDown: q,
      onKeyDownCapture: L,
      onMouseDown: (m) => {
        m.target === m.currentTarget && b();
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
              onClick: R,
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
              children: /* @__PURE__ */ n(zr, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: b,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(gr, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: f ? /* @__PURE__ */ n(
          Br,
          {
            autostart: !0,
            streamUrl: dn(e.id),
            posterUrl: rr(e),
            format: f.format,
            audioCodec: f.audioCodec,
            duration: f.duration ?? 0,
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
        ) : /* @__PURE__ */ n("img", { src: rr(e), alt: "" }) }),
        d && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: d }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((m, F) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: o || l || !c || Ge(m) && !v,
            onClick: () => void I(m),
            children: [
              ke(m, F) && /* @__PURE__ */ n("kbd", { children: ke(m, F) }),
              m.label
            ]
          },
          m.id
        )) })
      ] })
    }
  );
}
function _n({
  reviews: e,
  activeReview: t,
  initialEdit: r = !1,
  onSave: o,
  onChoose: l,
  onClose: d
}) {
  const [c, v] = S(
    () => r && t ? structuredClone(t) : null
  ), [E, p] = S(""), [s, g] = S(!1), C = x(null);
  Q(() => {
    var q, L;
    const f = document.activeElement, N = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (L = (q = C.current) == null ? void 0 : q.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || L.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = N, f == null || f.focus({ preventScroll: !0 });
    };
  }, []);
  function R(f) {
    var L, m, F;
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
    ].filter((j) => j.offsetParent !== null);
    if (!N.length) {
      Y(f), (m = C.current) == null || m.focus();
      return;
    }
    const q = N.indexOf(
      document.activeElement
    );
    f.shiftKey && q <= 0 ? (Y(f), (F = N.at(-1)) == null || F.focus()) : !f.shiftKey && q === N.length - 1 ? (Y(f), N[0].focus()) : f.stopPropagation();
  }
  function b(f) {
    v(
      f ? structuredClone(f) : {
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
  async function I() {
    if (s) return;
    if (!c || St(c)) {
      p(c ? St(c) : "Choose a review.");
      return;
    }
    const f = { ...c, name: c.name.trim() }, N = e.some((q) => q.id === f.id) ? e.map((q) => q.id === f.id ? f : q) : [...e, f];
    g(!0), p("");
    try {
      if (!await o(N)) throw new Error("Could not save reviews.");
      l(f.id), d();
    } catch (q) {
      p(
        "Could not save reviews. Your edits are still open. " + (q instanceof Error ? q.message : "Retry saving.")
      );
    } finally {
      g(!1);
    }
  }
  async function O(f) {
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
    var q;
    if (s) return;
    const N = (q = f.target.files) == null ? void 0 : q[0];
    if (f.target.value = "", !!N) {
      if (N.size > 2e6) {
        p("Review files must be smaller than 2 MB.");
        return;
      }
      g(!0), p("");
      try {
        const L = Oe(await N.text());
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
      onKeyDown: R,
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
          Un,
          {
            draft: c,
            saving: s,
            setDraft: v,
            onSave: () => void I(),
            onCancel: d
          }
        ) : /* @__PURE__ */ u(Ee, { children: [
          /* @__PURE__ */ u("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ u(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => b(),
                children: [
                  /* @__PURE__ */ n(Qr, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ u("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(Hr, {}),
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
            /* @__PURE__ */ u("button", { type: "button", onClick: () => b(f), children: [
              /* @__PURE__ */ n(ur, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => b({
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
                  window.confirm(`Delete review “${f.name}”?`) && O(
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
function Un({
  draft: e,
  saving: t = !1,
  setDraft: r,
  onSave: o,
  onCancel: l
}) {
  const [d, c] = S("Review"), v = x(/* @__PURE__ */ new WeakMap()), E = (s) => {
    let g = v.current.get(s);
    return g || (g = crypto.randomUUID(), v.current.set(s, g)), g;
  }, p = (s, g) => r({
    ...e,
    actions: e.actions.map(
      (C, R) => R === s ? g : C
    )
  });
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      Vr,
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
            renderItem: (s, { index: g, dragHandleProps: C, isOver: R }) => /* @__PURE__ */ u(
              "fieldset",
              {
                className: R ? "dq-action-card dq-drag-over" : "dq-action-card",
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
                          onChange: (b) => p(g, {
                            ...s,
                            shortcut: b.target.value === "auto" ? void 0 : b.target.value
                          }),
                          children: [
                            /* @__PURE__ */ u("option", { value: "auto", children: [
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
                    /* @__PURE__ */ u("label", { children: [
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
                    Xt,
                    {
                      items: s.steps,
                      getKey: E,
                      disabled: t,
                      className: "dq-sortable-list",
                      onReorder: (b) => p(g, { ...s, steps: b }),
                      renderItem: (b, { index: I, dragHandleProps: O, isOver: P }) => /* @__PURE__ */ n(
                        jn,
                        {
                          dragHandleProps: O,
                          saving: t,
                          isOver: P,
                          step: b,
                          index: I,
                          onChange: (f) => {
                            v.current.set(f, E(b)), p(g, {
                              ...s,
                              steps: s.steps.map(
                                (N, q) => q === I ? f : N
                              )
                            });
                          },
                          onRemove: () => p(g, {
                            ...s,
                            steps: s.steps.filter(
                              (f, N) => N !== I
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
                            (b, I) => I !== g
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
function jn({
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
async function Bn() {
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
const Hn = { components: { DataQualityPage: Ln } };
export {
  Ln as DataQualityPage,
  Hn as default,
  At as objectFiltersEqual
};
