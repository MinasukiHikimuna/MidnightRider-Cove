import { jsxs as d, jsx as n, Fragment as de } from "react/jsx-runtime";
import { useState as S, useEffect as Q, useMemo as Lt, useRef as _, useCallback as me } from "react";
import { VIDEO_SORT_OPTIONS as Dt, FilterDialog as br, VIDEO_CRITERIA as yr, EntityReferenceMultiSelector as ft, DetailListPagination as vr, VideoPlayer as Sr, VideoCard as Nr, EntityDetailTabs as Er, SortableList as _t } from "@cove/runtime/components";
import { Pencil as Yt, AlertTriangle as pt, LayoutGrid as Cr, Grid3X3 as Ar, ZoomOut as qr, ZoomIn as Rr, Film as Ut, Loader2 as Zt, ChevronLeft as kr, ChevronRight as Ir, ExternalLink as Or, X as er, Plus as Tr, Upload as Pr, Trash2 as tr, GripVertical as rr } from "@cove/runtime/lucide-react";
import { extensionFetch as xr } from "@cove/runtime/api";
function ke(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function gt(e) {
  if (e.actions.some(nr))
    return "An action cannot contain contradictory assessments for the same tag.";
  if (!e.name.trim() || !e.actions.every(bt))
    return "Name the review and complete every action step before saving.";
  if (new Set(e.actions.map((r) => r.id)).size !== e.actions.length)
    return "Action IDs must be unique within a review.";
  const t = e.actions.map(
    (r, i) => r.shortcut ?? (i < 9 ? String(i + 1) : "")
  ).filter(Boolean);
  return t.some((r) => !/^[1-9]$/.test(r)) || new Set(t).size !== t.length ? "Assign each shortcut 1–9 only once, or choose None. Navigation and player keys are reserved." : "";
}
function we(e) {
  const t = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(100, t(e.perPage, 40)))
  };
}
function jt(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function Ve(e) {
  const { page: t, ...r } = e.view.filter;
  return JSON.stringify([
    r,
    e.view.objectFilter,
    e.view.searchMode
  ]);
}
function bt(e) {
  return !!e.label.trim() && e.steps.every(
    (t) => [
      "ADD",
      "REMOVE",
      "REMOVE_TREE",
      "MARK_PRESENT",
      "MARK_ABSENT",
      "CLEAR_ABSENCE"
    ].includes(t.mode) && t.tagIds.length > 0 && t.tagIds.every((r) => Number.isSafeInteger(r) && r > 0)
  ) && !nr(e);
}
function Qe(e) {
  return e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  );
}
function nr(e) {
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
function Ie(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Mr(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && Array.isArray(i.steps) && i.steps.every((s) => s && Array.isArray(s.tagIds)) && bt(i)
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
function Mr(e) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.cardSize === void 0 || t.cardSize === null || Number.isFinite(t.cardSize) && t.cardSize >= 115 && t.cardSize <= 380) && (t.annotations === void 0 || Array.isArray(t.annotations) && t.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [t.annotationParents, t.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function ht(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const s of i)
      r.has(s.id) || (r.add(s.id), t.push(s));
  return t;
}
function Ft(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function $r(e, t, r, i) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!i && t.includes(r)) return r;
  const s = Math.max(0, e.indexOf(r));
  if (i) {
    for (const u of e.slice(s + 1))
      if (t.includes(u)) return u;
    if (t.includes(r)) {
      for (const u of e.slice(0, s).reverse())
        if (t.includes(u)) return u;
      return r;
    }
  }
  return t[Math.min(s, t.length - 1)];
}
function Lr(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((s) => r.has(s));
  for (const s of t)
    i ? r.delete(s) : r.add(s);
  return r;
}
function Dr(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const ir = "ext:com.midnightrider.data-quality:configuration", _r = "ext:cove-data-quality:video-reviews", mt = "ext:com.midnightrider.data-quality:progress", Oe = /* @__PURE__ */ new Map(), ze = /* @__PURE__ */ new Map(), ct = (e, t) => e.includes("*") || e.includes(t), Ge = (e) => j(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Ur = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function wt(e) {
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
    reviews: Ie(JSON.stringify(t.reviews)),
    deletedIds: wt(t.deletedIds),
    importedIds: wt(t.importedIds)
  };
}
function jr(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const s of t) {
    const u = localStorage.getItem(s);
    if (u !== null) {
      const l = Ie(u);
      r ?? (r = l), l.forEach((b) => i.add(b.id));
    }
    wt(
      JSON.parse(localStorage.getItem(`${s}:account-imports`) ?? "[]")
    ).forEach((l) => i.add(l));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function or(e) {
  const t = await j("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function sr(e, t) {
  const r = (ze.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return ze.set(e, r), r.finally(() => {
    ze.get(e) === r && ze.delete(e);
  }).catch(() => {
  }), r;
}
let Re = null;
function Fr() {
  if (Re) return Re;
  const e = Jr();
  return Re = e, e.finally(() => {
    Re === e && (Re = null);
  }).catch(() => {
  }), e;
}
async function Jr() {
  var m;
  const e = await j("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = ct(e.permissions, "savedfilters.read"), s = i && ct(e.permissions, "savedfilters.write"), u = i ? (await Ge(ir)).filter((v) => v.name === "Data Quality configuration").sort((v, E) => v.id - E.id) : [];
  if (u.length > 1) {
    const v = (E) => {
      const { revision: C, ...k } = Se(E.uiOptions);
      return JSON.stringify(k);
    };
    if (u.some((E) => v(E) !== v(u[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (s)
      for (const E of u.slice(1))
        await j(`/api/savedfilters/${E.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${E.id}` })
        });
    u.splice(1);
  }
  let l = u.length ? Se(u[0].uiOptions) : Ur();
  const b = localStorage.getItem(`${r}:migrated`) === "true", N = localStorage.getItem(r), h = localStorage.getItem(`${r}:local-only`) === "true";
  !u.length && N && (l = Se(N));
  let a = !u.length;
  if (u.length && h && N) {
    const v = Se(N);
    if (v.reviews.some((C) => {
      const k = l.reviews.find((T) => T.id === C.id);
      return k && JSON.stringify(k) !== JSON.stringify(C);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const E = [
      .../* @__PURE__ */ new Set([...l.deletedIds, ...v.deletedIds])
    ];
    l = {
      ...l,
      reviews: ht(l.reviews, v.reviews).filter(
        (C) => !E.includes(C.id)
      ),
      deletedIds: E,
      importedIds: [
        .../* @__PURE__ */ new Set([...l.importedIds, ...v.importedIds])
      ]
    }, a = !0;
  }
  if (!b) {
    const v = JSON.stringify(l), E = jr(t);
    if (u.length && E.reviews.some((R) => {
      const g = l.reviews.find((A) => A.id === R.id);
      return g && JSON.stringify(g) !== JSON.stringify(R);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const C = i ? (await Ge(_r)).flatMap(
      (R) => Ie(R.uiOptions ?? "[]")
    ) : [], k = E.known.filter(
      (R) => !E.reviews.some((g) => g.id === R)
    ), T = /* @__PURE__ */ new Set([...l.deletedIds, ...k]);
    l = {
      ...l,
      reviews: ht(
        E.reviews,
        l.reviews,
        C.filter(
          (R) => !E.known.includes(R.id) && !l.importedIds.includes(R.id)
        )
      ).filter((R) => !T.has(R.id)),
      deletedIds: [...T],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...l.importedIds,
          ...E.known,
          ...C.map((R) => R.id)
        ])
      ]
    }, a || (a = JSON.stringify(l) !== v);
  }
  const c = {
    userId: t,
    recordId: (m = u[0]) == null ? void 0 : m.id,
    config: l,
    readable: i,
    writable: s,
    durable: s
  };
  if (Oe.set(r, c), a && s) {
    const v = l;
    u.length && (c.config = Se(u[0].uiOptions)), await ar(r, v), l = c.config;
  } else u.length || (localStorage.setItem(r, JSON.stringify(l)), !i && (!b || h) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (s)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: l.reviews,
    storageKey: r,
    canWrite: ct(e.permissions, "videos.write"),
    canConfigure: !i || s,
    storageNotice: i ? s ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function ar(e, t) {
  const r = Oe.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await or(r), r.recordId != null) {
      const u = await j(
        `/api/savedfilters/${r.recordId}`
      );
      if (Se(u.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const s = await j(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: ir,
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
function Kr(e, t) {
  return Ie(JSON.stringify(t)), sr(e, async () => {
    const r = Oe.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((s) => !t.some((u) => u.id === s.id)).map((s) => s.id);
    await ar(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((s) => !t.some((u) => u.id === s))
    });
  });
}
function Jt(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Vr(e, t) {
  const r = Oe.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), s = i ? Jt(i) : null;
  if (!r.readable) return s;
  const u = (await Ge(mt)).find(
    (b) => b.name === t
  ), l = u ? Jt(u.uiOptions) : null;
  return s && (!l || s.updatedAt > l.updatedAt) ? s : l;
}
function zr(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return sr(i, async () => {
    const s = Oe.get(e);
    if (!(s != null && s.writable)) return;
    await or(s);
    const u = (await Ge(mt)).find(
      (l) => l.name === t
    );
    await j(
      u ? `/api/savedfilters/${u.id}` : "/api/savedfilters",
      {
        method: u ? "PUT" : "POST",
        body: JSON.stringify({
          mode: mt,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Te = "confirmed_absent_tags", yt = "Confirmed absent tags", Br = {
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
      t === "modifier" && typeof r == "string" ? Br[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === Te.toLowerCase() ? r.toLowerCase() : He(r)
    ])
  ) : e;
}
async function j(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await xr(e, { ...t, headers: r });
  if (!i.ok) {
    let u = i.statusText || `Request failed (${i.status}).`;
    try {
      const l = await i.json();
      u = l.message || l.detail || l.error || u;
    } catch {
    }
    throw new Error(u);
  }
  if (i.status === 204 || i.status === 205) return;
  const s = await i.text();
  return s ? JSON.parse(s) : void 0;
}
async function Kt(e, t, r) {
  const i = { ...e.view.objectFilter }, s = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return j("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      He({
        findFilter: we(t),
        objectFilter: i,
        filterExpression: s
      })
    )
  });
}
function Qr(e) {
  return `/api/stream/video/${e}`;
}
function Vt(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Gr(e) {
  return `/api/stream/video/${e}/preview`;
}
function Hr(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Wr(e) {
  return e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function vt(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await j(`/api/tags/${r}`), t.add(r);
    for (let i = 1; ; i++) {
      const s = await j("/api/tags/find", {
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
      for (const u of s.items) t.add(u.id);
      if (i * 1e3 >= s.totalCount) break;
      if (!s.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...t];
}
function Xr(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${Te} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function St() {
  const t = (await j("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === Te.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${yt} custom field before applying tag assessments.`
    };
  const r = Xr(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function Yr() {
  const e = await St();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await j("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: Te,
        label: yt,
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
function Zr(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${Te} value is not a valid tag list.`
    );
  return We(e);
}
function en(e) {
  return We(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function tn(e, t) {
  let r;
  try {
    r = await St();
  } catch (h) {
    throw new Error(
      `Could not verify the ${yt} custom field. ${h instanceof Error ? h.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const i = await Promise.all(
    e.steps.map(async (h) => ({
      ...h,
      tagIds: h.mode === "REMOVE_TREE" ? await vt(h.tagIds) : We(h.tagIds)
    }))
  ), s = i.filter(
    (h) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(h.mode)
  ), u = i.filter(
    (h) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(h.mode)
  ), l = We(t), b = r.definition.key;
  let N = 0;
  for (const h of l)
    try {
      const a = await j(`/api/videos/${h}`), c = en(a), m = { ...a.customFields ?? {} }, v = m[b], E = Zr(v), C = new Set(c), k = new Set(E);
      for (const A of s)
        for (const I of A.tagIds)
          A.mode === "ADD" ? C.add(I) : C.delete(I);
      for (const A of u)
        for (const I of A.tagIds)
          A.mode === "MARK_PRESENT" ? (C.add(I), k.delete(I)) : A.mode === "MARK_ABSENT" ? (C.delete(I), k.add(I)) : k.delete(I);
      const T = [...C], R = [...k];
      JSON.stringify(c) === JSON.stringify(T) && JSON.stringify(E) === JSON.stringify(R) && (v === void 0 ? R.length === 0 : JSON.stringify(v) === JSON.stringify(E)) || await j(`/api/videos/${h}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: T,
          customFields: {
            ...m,
            [b]: R
          }
        })
      }), N++;
    } catch (a) {
      throw new Error(
        `Assessment stopped after ${N} video${N === 1 ? "" : "s"} completed; video ${h} was affected. Refresh and inspect it before retrying. ${a instanceof Error ? a.message : "Request failed."}`
      );
    }
}
async function rn(e, t) {
  if (!bt(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (Qe(e)) {
    await tn(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (i) => ({
      mode: i.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: i.mode === "REMOVE_TREE" ? await vt(i.tagIds) : i.tagIds
    }))
  );
  for (let i = 0; i < r.length; i++)
    try {
      await j("/api/videos/bulk", {
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
function nn(e) {
  var b, N, h;
  const [t, r] = S({}), [i, s] = S(""), u = (((b = e == null ? void 0 : e.presentation) == null ? void 0 : b.annotations) ?? []).includes("tags") ? ((N = e == null ? void 0 : e.presentation) == null ? void 0 : N.annotationParents) ?? [] : [], l = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...u,
      ...((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.binParents) ?? []
    ])
  ]);
  return Q(() => {
    let a = !0;
    return r({}), s(""), Promise.all(
      JSON.parse(l).map(
        async (c) => [c, await vt([c])]
      )
    ).then((c) => {
      a && r(Object.fromEntries(c));
    }).catch(() => {
      a && s(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      a = !1;
    };
  }, [l]), { ids: t, error: i };
}
function on(e, t, r) {
  const i = t == null ? void 0 : t.presentation, s = (i == null ? void 0 : i.annotations) ?? [], u = (i == null ? void 0 : i.annotationParents) ?? [];
  return [
    s.includes("date") && e.date,
    s.includes("studio") && e.studioName,
    s.includes("performers") && e.performers.map((l) => l.name).join(", "),
    s.includes("tags") && u.length > 0 && (e.tags ?? []).filter(
      (l) => u.some(
        (b) => {
          var N;
          return b !== l.id && ((N = r[b]) == null ? void 0 : N.includes(l.id));
        }
      )
    ).map((l) => l.name).join(", ")
  ].filter(Boolean).join(" · ");
}
function sn({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: s
}) {
  var b, N, h;
  const u = new Set(
    (((b = t.presentation) == null ? void 0 : b.binParents) ?? []).flatMap(
      (a) => (r[a] ?? []).filter((c) => c !== a)
    )
  ), l = /* @__PURE__ */ new Map();
  for (const a of e)
    for (const c of a.tags ?? [])
      if (u.has(c.id)) {
        const m = l.get(c.id) ?? { name: c.name, count: 0 };
        m.count++, l.set(c.id, m);
      }
  return (h = (N = t.presentation) == null ? void 0 : N.binParents) != null && h.length ? /* @__PURE__ */ d("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...l].sort((a, c) => a[1].name.localeCompare(c[1].name)).map(([a, c]) => /* @__PURE__ */ d(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => s(a),
        children: [
          c.name,
          " (",
          c.count,
          ")"
        ]
      },
      a
    )),
    !l.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function an(e, t) {
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
function zt({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [s, u] = S(!1), l = e.view.filter, b = (a) => t({
    ...e,
    view: { ...e.view, filter: { ...l, ...a } }
  }), N = e.presentation ?? {}, h = (a) => t({ ...e, presentation: { ...N, ...a } });
  return /* @__PURE__ */ d(de, { children: [
    i && /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ d("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(l.q ?? ""),
            onChange: (a) => b({ q: a.target.value })
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
              value: String(l.sort ?? "date"),
              onChange: (a) => b({ sort: a.target.value, sorts: void 0 }),
              children: [
                !Dt.some((a) => a.value === l.sort) && l.sort != null && /* @__PURE__ */ n("option", { value: String(l.sort), children: String(l.sort) }),
                Dt.map((a) => /* @__PURE__ */ n("option", { value: a.value, children: a.label }, a.value))
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
              value: String(l.direction ?? "desc"),
              onChange: (a) => b({ direction: a.target.value }),
              children: [
                /* @__PURE__ */ n("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ n("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          "Videos per page",
          /* @__PURE__ */ n(
            "input",
            {
              type: "number",
              min: "1",
              max: "100",
              value: Number(l.perPage) || 40,
              onChange: (a) => b({
                perPage: Math.max(
                  1,
                  Math.min(100, Number(a.target.value) || 40)
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
          onClick: () => u(!0),
          children: "Edit video filters"
        }
      ),
      /* @__PURE__ */ d("p", { children: [
        Object.keys(e.view.objectFilter).length ? "Video filters configured" : "No video filters",
        ". Choose which videos enter the queue."
      ] }),
      s && /* @__PURE__ */ n("div", { onKeyDown: (a) => a.stopPropagation(), children: /* @__PURE__ */ n(
        br,
        {
          open: !0,
          onClose: () => u(!1),
          criteria: yr,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: !0,
          subjectLabel: "videos",
          onApply: (a) => {
            t({ ...e, view: { ...e.view, objectFilter: a } }), u(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ d(de, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Choose how videos and tags appear while reviewing." }),
      /* @__PURE__ */ d("div", { className: "dq-field-grid", children: [
        /* @__PURE__ */ d("label", { children: [
          "Preferred view",
          /* @__PURE__ */ n(
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
              children: ["grid", "wall"].map((a) => /* @__PURE__ */ n("option", { children: a }, a))
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          "Preferred card width",
          /* @__PURE__ */ n(
            "select",
            {
              value: N.cardSize ?? 180,
              onChange: (a) => h({
                cardSize: Number(a.target.value)
              }),
              children: [130, 180, 260, 380].map((a) => /* @__PURE__ */ d("option", { value: a, children: [
                a,
                " px"
              ] }, a))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n("h4", { children: "Card annotations" }),
      /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((a) => {
        const c = N.annotations ?? [];
        return /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: c.includes(a),
              onChange: (m) => h({
                annotations: m.target.checked ? [...c, a] : c.filter((v) => v !== a)
              })
            }
          ),
          a
        ] }, a);
      }) }),
      (N.annotations ?? []).includes("tags") && /* @__PURE__ */ d(de, { children: [
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear in the Review row; no tags appear until a parent is selected." }),
        /* @__PURE__ */ n(
          ft,
          {
            entityType: "tag",
            values: N.annotationParents ?? [],
            placeholder: "Search annotation parent tags...",
            onChange: (a) => h({ annotationParents: a }),
            allowCreate: !1
          }
        )
      ] }),
      /* @__PURE__ */ n("h4", { children: "Tag bins" }),
      /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
      /* @__PURE__ */ n(
        ft,
        {
          entityType: "tag",
          values: N.binParents ?? [],
          placeholder: "Search tag-bin parent tags...",
          onChange: (a) => h({ binParents: a }),
          allowCreate: !1
        }
      )
    ] })
  ] });
}
const Be = 180, dt = 115, Bt = 380;
function Qt(e) {
  return e.view.displayMode === "wall" ? "wall" : "grid";
}
function ln(e) {
  return e === "wall" ? "wall" : "grid";
}
function cn() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Gt(e) {
  const t = new URLSearchParams(window.location.search);
  e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function dn(e) {
  return we({ ...e, page: 1 });
}
function un(e, t) {
  if (t === 0) return "Showing 0 of 0";
  const r = Number(e.perPage) || 40, i = Math.max(1, Math.ceil(t / r)), s = Math.min(Math.max(1, Number(e.page) || 1), i), u = (s - 1) * r + 1, l = Math.min(s * r, t);
  return `Showing ${u.toLocaleString()}-${l.toLocaleString()} of ${t.toLocaleString()}`;
}
function lr(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Z(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
function fn({
  onNavigate: e
}) {
  const [t, r] = S([]), [i] = S(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [s, u] = S(""), [l, b] = S(!0), [N, h] = S(""), [a, c] = S(!1), [m, v] = S(!0), [E, C] = S(""), [k, T] = S(""), [R, g] = S(!1), [A, I] = S(!1), [p, M] = S(cn), [J, D] = S(!1), [se, ie] = S(!1), [ae, Nt] = S(!1), [G, Ne] = S(
    null
  ), V = t.find((o) => o.id === p) ?? null, w = Lt(
    () => (G == null ? void 0 : G.id) === p && V ? { ...V, view: G.view } : V,
    [G, p, V]
  ), Pe = nn(w), [L, Ee] = S({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [cr, dr] = S({
    page: 1,
    perPage: 40
  }), [te, Et] = S({ items: [], totalCount: 0 }), [P, xe] = S(!1), [oe, Ct] = S(""), [le, ue] = S(() => /* @__PURE__ */ new Set()), Xe = _(le);
  Xe.current = le;
  const be = _(/* @__PURE__ */ new Map()), [H, re] = S(null), W = _(H);
  W.current = H;
  const [ne, ye] = S(!1), ce = _(ne);
  ce.current = ne;
  const At = _(null), [Ce, Ye] = S("grid"), [fe, Ze] = S(Be), [F, et] = S(!1), Me = _(!1), [ur, tt] = S(""), [qt, $e] = S(""), [rt, Ae] = S(""), [$, Rt] = S(null), [kt, Le] = S(""), [De, _e] = S(!1), nt = _(/* @__PURE__ */ new Map()), It = _(null), ve = _(0), Ue = _(0), je = _(null), Ot = me(async () => {
    b(!0), h("");
    try {
      const o = await Fr();
      r(o.reviews), u(o.storageKey), c(o.canWrite), v(o.canConfigure ?? !0), C(o.storageNotice ?? ""), p && !o.reviews.some((f) => f.id === p) && (M(""), Gt(""));
    } catch (o) {
      h(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      b(!1);
    }
  }, [p]);
  Q(() => {
    Ot();
  }, []);
  const Fe = me(async () => {
    Le("");
    try {
      Rt(await St());
    } catch (o) {
      Rt(null), Le(
        "Tag assessment setup could not be checked. " + (o instanceof Error ? o.message : "Request failed.")
      );
    }
  }, []);
  Q(() => {
    Fe();
  }, [Fe]);
  const pe = me(
    async (o, f) => {
      var U;
      const y = ++ve.current;
      (U = je.current) == null || U.abort();
      const q = new AbortController();
      je.current = q, f = we(f), Ee(f), xe(!0), Ct("");
      try {
        let O = await Kt(
          o,
          f,
          q.signal
        );
        const X = Math.max(
          1,
          Math.ceil(O.totalCount / Number(f.perPage))
        );
        return Number(f.page) > X && (f = { ...f, page: X }, O = await Kt(
          o,
          f,
          q.signal
        )), y === ve.current && (Et(O), Ee(f), dr(f)), O;
      } catch (O) {
        throw y === ve.current && Ct(
          O instanceof Error ? O.message : "Could not load the review queue."
        ), O;
      } finally {
        y === ve.current && xe(!1);
      }
    },
    []
  );
  Q(() => {
    var f;
    if (Ue.current += 1, ve.current += 1, (f = je.current) == null || f.abort(), I(!1), T(""), g(!1), ue(/* @__PURE__ */ new Set()), be.current.clear(), re(null), ye(!1), et(!1), Me.current = !1, tt(""), $e(""), Ae(""), Et({ items: [], totalCount: 0 }), !w) {
      xe(!1);
      return;
    }
    let o = !0;
    return xe(!0), (async () => {
      var O;
      let y = null;
      try {
        y = await Vr(s, w.id);
      } catch (X) {
        o && (g(!0), T(
          X instanceof Error ? X.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const q = (y == null ? void 0 : y.signature) === Ve(w) ? y : null, U = q ? we(q.filter) : dn(w.view.filter);
      Ee(U), Ye(
        q ? ln(q.displayMode) : Qt(w)
      ), Ze(
        q ? q.cardSize ?? Be : ((O = w.presentation) == null ? void 0 : O.cardSize) ?? Be
      );
      try {
        const X = await pe(w, U);
        if (!o) return;
        const z = jt(
          X.items.map((he) => he.id),
          (q == null ? void 0 : q.focusedId) ?? null,
          (q == null ? void 0 : q.index) ?? 0
        );
        re(z), K(z);
      } catch {
      }
      o && I(!0);
    })(), () => {
      var y;
      o = !1, Ue.current++, ve.current++, (y = je.current) == null || y.abort();
    };
  }, [w == null ? void 0 : w.id]);
  const x = Lt(
    () => te.items.map((o) => o.id),
    [te.items]
  );
  Q(() => {
    if (!A || !w || !s || P || oe || F || (G == null ? void 0 : G.id) === w.id || R)
      return;
    const o = {
      version: 1,
      signature: Ve(w),
      filter: L,
      focusedId: H,
      index: Math.max(0, x.indexOf(H ?? -1)),
      displayMode: Ce,
      cardSize: fe,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        s + ":progress:" + w.id,
        JSON.stringify(o)
      );
    } catch {
    }
    if (k) return;
    let f = !0;
    const y = window.setTimeout(() => {
      zr(s, w.id, o).catch((q) => {
        f && T(
          "Progress is kept in this browser, but account sync failed. " + (q instanceof Error ? q.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      f = !1, window.clearTimeout(y);
    };
  }, [
    A,
    s,
    w,
    P,
    oe,
    F,
    L,
    H,
    x,
    Ce,
    fe,
    G,
    k,
    R
  ]);
  const it = te.items.find((o) => o.id === H) ?? null;
  ne && it && (At.current = it);
  const ge = it ?? (ne ? At.current : null), fr = Ft(le, H), Tt = le.size > 0 ? `${le.size} selected video${le.size === 1 ? "" : "s"}` : H == null ? "no video" : "focused video", K = me((o, f = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const y = nt.current.get(o);
      y == null || y.focus({ preventScroll: !0 }), f && (y == null || y.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  Q(() => {
    A && !ce.current && K(W.current);
  }, [A, K]), Q(() => {
    P || !x.length || (W.current == null || !x.includes(W.current)) && (re(x[0]), ce.current || K(x[0]));
  }, [K, x, P]);
  const qe = me(
    (o) => {
      ue((f) => {
        const y = o(f);
        for (const q of /* @__PURE__ */ new Set([...f, ...y]))
          f.has(q) !== y.has(q) && be.current.set(
            q,
            (be.current.get(q) ?? 0) + 1
          );
        return y;
      });
    },
    []
  ), ot = me(
    (o) => {
      if (!x.length) return;
      const f = Math.max(
        0,
        x.indexOf(W.current ?? x[0])
      ), y = x[Math.max(0, Math.min(x.length - 1, f + o))];
      re(y), ce.current || K(y);
    },
    [K, x]
  ), st = me(
    async (o) => {
      const f = Ft(
        Xe.current,
        W.current
      );
      if (!w || Me.current || P || oe || !a || Qe(o) && ($ == null ? void 0 : $.kind) !== "ready" || !f.length)
        return;
      const y = ++Ue.current, q = w.id, U = [...x], O = W.current, X = new Map(
        f.map((B) => [B, be.current.get(B) ?? 0])
      ), z = () => y === Ue.current && w.id === q;
      Me.current = !0, et(!0), tt(
        Xe.current.size ? `${f.length} selected videos` : "the focused video"
      ), $e(""), Ae("");
      let he = !1;
      try {
        if (await rn(o, f), he = !0, !z()) return;
        ue((B) => {
          const Y = new Set(B);
          for (const ee of f)
            (be.current.get(ee) ?? 0) === X.get(ee) && Y.delete(ee);
          return Y;
        }), $e(
          `${o.label}: ${f.length} video${f.length === 1 ? "" : "s"} ${o.steps.length ? "updated" : "skipped"}.`
        );
      } catch (B) {
        if (!z()) return;
        Ae(
          B instanceof Error ? B.message : "Action failed."
        );
      }
      try {
        if (await Wr(o), !z()) return;
        const B = await pe(w, L);
        if (!z()) return;
        let Y = B.items.map((ee) => ee.id);
        if (!Y.length && B.totalCount > 0 && Number(L.page) > 1) {
          const ee = Math.max(1, Number(L.page) - 1), Ke = { ...L, page: ee };
          Ee(Ke), Y = (await pe(w, Ke)).items.map((lt) => lt.id), ue(
            (lt) => new Set([...lt].filter((wr) => Y.includes(wr)))
          );
          const $t = Y.at(-1) ?? null;
          re($t), ce.current || K($t);
        } else {
          ue(
            (Ke) => new Set([...Ke].filter((Mt) => Y.includes(Mt)))
          );
          const ee = $r(
            U,
            Y,
            O,
            he && f.includes(O ?? -1)
          );
          re(ee), ce.current && ee == null && ye(!1), ce.current || K(ee);
        }
      } catch (B) {
        z() && Ae(
          (Y) => `${Y ? `${Y} ` : ""}${he ? "The action completed, but " : ""}the queue could not be refreshed. ${B instanceof Error ? B.message : "Refresh failed."}`
        );
      } finally {
        z() && (Me.current = !1, et(!1), tt(""));
      }
    },
    [
      a,
      $,
      pe,
      L,
      K,
      x,
      P,
      oe,
      w
    ]
  );
  function pr() {
    var y;
    const o = (y = It.current) == null ? void 0 : y.firstElementChild, f = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, f.split(" ").filter(Boolean).length);
  }
  function gr(o) {
    if (o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || J || ae) return;
    if (ne && o.key === "Escape") {
      Z(o), ye(!1), K(W.current);
      return;
    }
    if (!Dr(o.target)) return;
    if (o.key === "Escape") {
      Z(o), qe(() => /* @__PURE__ */ new Set());
      return;
    }
    const f = (w == null ? void 0 : w.actions.findIndex(
      (U, O) => ke(U, O) === o.key
    )) ?? -1;
    if (f >= 0 && (w != null && w.actions[f])) {
      Z(o), !F && !P && st(w.actions[f]);
      return;
    }
    if (!ne && o.key === " ") {
      Z(o), H != null && qe((U) => ut(U, H));
      return;
    }
    if (!ne && o.key.toLowerCase() === "a") {
      Z(o), qe(
        (U) => Lr(U, x)
      );
      return;
    }
    if (F || P || ne) return;
    if (o.key === "Enter" && H != null) {
      Z(o), ye(!0);
      return;
    }
    const y = pr(), q = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -y : o.key === "ArrowDown" ? y : 0;
    q && (Z(o), ot(q));
  }
  function at(o) {
    M(o), Gt(o);
  }
  async function Pt(o) {
    var y, q, U;
    if (!s) return !1;
    try {
      await Kr(s, o);
    } catch (O) {
      throw O;
    }
    r(o), p && !o.some((O) => O.id === p) && at("");
    const f = o.find((O) => O.id === p);
    return f && V && JSON.stringify(f) !== JSON.stringify(V) && (f.view.displayMode !== V.view.displayMode && Ye(Qt(f)), ((y = f.presentation) == null ? void 0 : y.cardSize) !== ((q = V.presentation) == null ? void 0 : q.cardSize) && Ze(((U = f.presentation) == null ? void 0 : U.cardSize) ?? Be), Ve(f) !== Ve(V) && (Ne(null), Je(
      f,
      we({ ...f.view.filter, page: L.page })
    ))), !0;
  }
  if (l)
    return /* @__PURE__ */ n(Wt, { label: "Loading Data Quality reviews…" });
  if (N)
    return /* @__PURE__ */ d(de, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void yn().catch(
            (o) => h(
              "Could not export browser reviews. " + (o instanceof Error ? o.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        Xt,
        {
          message: N,
          onRetry: () => void Ot()
        }
      )
    ] });
  return /* @__PURE__ */ d("div", { className: "data-quality-page", onKeyDown: gr, children: [
    /* @__PURE__ */ d("header", { className: "data-quality-header", children: [
      /* @__PURE__ */ d("div", { children: [
        /* @__PURE__ */ n("h1", { children: "Data Quality" }),
        /* @__PURE__ */ n("p", { children: "A focused queue for previewing videos and applying saved review actions." })
      ] }),
      /* @__PURE__ */ d(
        "button",
        {
          className: "dq-button",
          type: "button",
          disabled: F || P || !m,
          onClick: () => {
            ie(!1), D(!0);
          },
          children: [
            /* @__PURE__ */ n(Yt, {}),
            " Manage reviews"
          ]
        }
      )
    ] }),
    E && /* @__PURE__ */ n("p", { className: "dq-status", children: E }),
    ($ == null ? void 0 : $.kind) === "missing" && /* @__PURE__ */ d("div", { role: "status", className: "dq-status", children: [
      $.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: De,
          onClick: () => {
            _e(!0), Le(""), Yr().then(Fe).catch(
              (o) => Le(
                "Could not create the Confirmed absent tags custom field. " + (o instanceof Error ? o.message : "Request failed.")
              )
            ).finally(() => _e(!1));
          },
          children: De ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    (($ == null ? void 0 : $.kind) === "incompatible" || kt) && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(pt, {}),
      kt || ($ == null ? void 0 : $.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: De,
          onClick: () => {
            _e(!0), Fe().finally(
              () => _e(!1)
            );
          },
          children: De ? "Checking…" : "Check again"
        }
      )
    ] }),
    i && /* @__PURE__ */ d("details", { children: [
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
            ), y = document.createElement("a");
            y.href = f, y.download = "data-quality-unassigned-legacy-reviews.json", y.click(), URL.revokeObjectURL(f);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    k && /* @__PURE__ */ d("p", { role: "alert", children: [
      k,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            T(""), g(!1);
          },
          children: R ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    /* @__PURE__ */ d("section", { className: "dq-toolbar", children: [
      /* @__PURE__ */ d("label", { className: "dq-review-select", children: [
        "Review",
        /* @__PURE__ */ d(
          "select",
          {
            value: (w == null ? void 0 : w.id) ?? "",
            disabled: F,
            onChange: (o) => at(o.target.value),
            children: [
              /* @__PURE__ */ n("option", { value: "", children: "Choose a review…" }),
              t.map((o) => /* @__PURE__ */ n("option", { value: o.id, children: o.name }, o.id))
            ]
          }
        )
      ] }),
      w && /* @__PURE__ */ n("span", { className: "dq-range-count", children: un(cr, te.totalCount) }),
      w && /* @__PURE__ */ d(de, { children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: F || P || !m,
            onClick: () => {
              ie(!0), D(!0);
            },
            children: "Edit review"
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: F || P,
            onClick: () => Nt(!0),
            children: "Adjust queue"
          }
        ),
        (G == null ? void 0 : G.id) === p && /* @__PURE__ */ d(de, { children: [
          /* @__PURE__ */ n("span", { children: "Temporary queue" }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: F || P || !m,
              onClick: () => {
                V && Pt(
                  t.map(
                    (o) => o.id === p ? {
                      ...o,
                      view: {
                        ...w.view,
                        filter: { ...L, page: 1 }
                      }
                    } : o
                  )
                ).then(() => {
                  Ne(null), $e("Queue saved to this review.");
                }).catch(
                  (o) => Ae(
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
              disabled: F || P,
              onClick: () => {
                Ne(null), V && Je(
                  V,
                  we({
                    ...V.view.filter,
                    page: L.page
                  })
                );
              },
              children: "Reset to saved queue"
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-review-description", children: w.description && /* @__PURE__ */ n("p", { children: w.description }) }),
        /* @__PURE__ */ n(
          "div",
          {
            className: "dq-view-switch flex min-h-10 items-center gap-0.5 rounded-lg border border-border bg-card/70 px-1.5 py-1 shadow-sm sm:min-h-0",
            role: "group",
            "aria-label": "Review view",
            children: [
              { mode: "grid", label: "Grid", Icon: Cr },
              { mode: "wall", label: "Wall", Icon: Ar }
            ].map(({ mode: o, label: f, Icon: y }) => /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: `inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-transparent p-2 text-secondary hover:bg-card/80 hover:text-foreground focus:border-accent focus:outline-none sm:min-h-0 sm:min-w-0 sm:p-1.5 ${Ce === o ? "bg-background/60 text-accent shadow-sm" : ""}`,
                "aria-label": f,
                title: f,
                "aria-pressed": Ce === o,
                onClick: () => Ye(o),
                children: /* @__PURE__ */ n(y, { className: "h-3.5 w-3.5" })
              },
              o
            ))
          }
        ),
        /* @__PURE__ */ d("div", { className: "hidden items-center gap-1 pl-1 md:flex", children: [
          /* @__PURE__ */ n(qr, { className: "h-3 w-3 text-muted" }),
          /* @__PURE__ */ n(
            "input",
            {
              "aria-label": `Card size: ${fe}px`,
              title: `Card size: ${fe}px`,
              type: "range",
              min: dt,
              max: Bt,
              step: "5",
              className: "themed-range-input h-1 w-16 cursor-pointer sm:w-20",
              value: fe,
              style: {
                "--range-fill": `${(fe - dt) / (Bt - dt) * 100}%`
              },
              onChange: (o) => Ze(Number(o.target.value))
            }
          ),
          /* @__PURE__ */ n(Rr, { className: "h-3 w-3 text-muted" })
        ] })
      ] })
    ] }),
    w ? /* @__PURE__ */ d(de, { children: [
      Pe.error && /* @__PURE__ */ n("p", { role: "alert", children: Pe.error }),
      /* @__PURE__ */ n(
        sn,
        {
          videos: te.items,
          review: w,
          trees: Pe.ids,
          disabled: F || P,
          onChoose: (o) => {
            const f = an(w, o);
            Ne(f), Je(f, { ...L, page: 1 });
          }
        }
      ),
      rt && !ne && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(pt, {}),
        rt
      ] }),
      qt && /* @__PURE__ */ n("p", { role: "status", className: "dq-status", children: qt }),
      /* @__PURE__ */ d("div", { className: "dq-workspace", children: [
        /* @__PURE__ */ d("main", { children: [
          xt("top"),
          P && !te.items.length && /* @__PURE__ */ n(Wt, { label: "Loading review queue…" }),
          oe && !P && /* @__PURE__ */ n(
            Xt,
            {
              message: oe,
              onRetry: () => void pe(w, L).catch(() => {
              })
            }
          ),
          !P && !oe && !te.items.length && /* @__PURE__ */ d("div", { className: "dq-empty", children: [
            /* @__PURE__ */ n(Ut, {}),
            /* @__PURE__ */ n("p", { children: "No videos match this review." })
          ] }),
          !!te.items.length && /* @__PURE__ */ n("div", { ref: It, children: /* @__PURE__ */ n(
            "div",
            {
              className: "dq-grid",
              style: {
                "--dq-card-width": `${fe}px`
              },
              children: te.items.map(mr)
            }
          ) }),
          xt("bottom")
        ] }),
        /* @__PURE__ */ d("aside", { className: "dq-actions", children: [
          /* @__PURE__ */ n("strong", { children: Tt }),
          w.actions.map((o, f) => /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              disabled: F || P || !!oe || !a || Qe(o) && ($ == null ? void 0 : $.kind) !== "ready" || !fr.length,
              onClick: () => void st(o),
              children: [
                ke(o, f) && /* @__PURE__ */ n("kbd", { children: ke(o, f) }),
                /* @__PURE__ */ n("span", { children: o.label }),
                /* @__PURE__ */ n("small", { children: o.steps.length ? `${o.steps.length} step(s)` : "Skip" })
              ]
            },
            o.id
          )),
          !w.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
          !a && /* @__PURE__ */ n("p", { children: "Video write permission is required to apply actions." }),
          F && /* @__PURE__ */ d("p", { role: "status", children: [
            /* @__PURE__ */ n(Zt, { className: "dq-spin" }),
            " Applying action to",
            " ",
            ur,
            "…"
          ] }),
          /* @__PURE__ */ n("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ d("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(Ut, {}),
      /* @__PURE__ */ n("p", { children: t.length ? "Choose a saved review to open its queue." : "No saved reviews are available in this browser." })
    ] }),
    ne && ge && w && /* @__PURE__ */ n(
      mn,
      {
        video: ge,
        review: w,
        targetLabel: Tt,
        pending: F,
        refreshing: P || !!oe,
        error: rt,
        canWrite: a,
        assessmentReady: ($ == null ? void 0 : $.kind) === "ready",
        selected: le.has(ge.id),
        hasPrevious: x.indexOf(ge.id) > 0,
        hasNext: x.indexOf(ge.id) >= 0 && x.indexOf(ge.id) < x.length - 1,
        onToggleSelected: () => qe((o) => ut(o, ge.id)),
        onPrevious: () => ot(-1),
        onNext: () => ot(1),
        onClose: () => {
          ye(!1), K(W.current);
        },
        onAction: st
      }
    ),
    ae && w && /* @__PURE__ */ n(
      Ht,
      {
        reviews: t,
        activeReview: { ...w, view: { ...w.view, filter: L } },
        initialEdit: !0,
        temporary: !0,
        onSave: (o) => {
          const f = o.find((y) => y.id === p);
          return Ne(f), Je(
            f,
            we({ ...f.view.filter, page: L.page })
          ), !0;
        },
        onChoose: () => {
        },
        onClose: () => {
          Nt(!1), K(W.current, !1);
        }
      }
    ),
    J && /* @__PURE__ */ n(
      Ht,
      {
        reviews: t,
        activeReview: V,
        initialEdit: se,
        onSave: Pt,
        onChoose: at,
        onClose: () => {
          D(!1), se && K(W.current, !1);
        }
      }
    )
  ] });
  async function Je(o, f) {
    const y = W.current, q = Math.max(0, x.indexOf(y ?? -1));
    try {
      const O = (await pe(o, f)).items.map((z) => z.id);
      ue(
        (z) => new Set([...z].filter((he) => O.includes(he)))
      );
      const X = jt(O, y, q);
      re(X), ce.current || K(X, !1);
    } catch {
    }
  }
  function hr() {
    ue(/* @__PURE__ */ new Set()), be.current.clear(), re(null);
  }
  function xt(o) {
    return w ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: F || P,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          vr,
          {
            filter: {
              ...L,
              page: Number(L.page) || 1,
              perPage: Number(L.perPage) || 40
            },
            totalCount: te.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${o}`,
            onFilterChange: (f) => {
              F || P || f.page === Number(L.page) || pn(
                { ...L, page: f.page },
                w,
                Ee,
                pe,
                hr
              );
            }
          }
        )
      }
    ) : null;
  }
  function mr(o) {
    return /* @__PURE__ */ n(
      gn,
      {
        video: o,
        annotation: on(o, w, Pe.ids),
        displayMode: Ce,
        focused: o.id === H,
        selected: le.has(o.id),
        setRef: (f) => {
          f ? nt.current.set(o.id, f) : nt.current.delete(o.id);
        },
        onFocus: () => re(o.id),
        onToggle: () => qe((f) => ut(f, o.id)),
        onPreview: () => {
          re(o.id), ye(!0);
        },
        onNavigate: e
      },
      o.id
    );
  }
}
function pn(e, t, r, i, s) {
  r(e), s(), i(t, e).catch(() => {
  });
}
function ut(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function gn({
  video: e,
  annotation: t,
  displayMode: r,
  focused: i,
  selected: s,
  setRef: u,
  onFocus: l,
  onToggle: b,
  onPreview: N,
  onNavigate: h
}) {
  const a = lr(e), c = _(null), m = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  };
  return Q(() => {
    const v = c.current;
    if (!v) return;
    const E = v.querySelector(
      `a[href="/video/${e.id}"]`
    );
    E && (E.target = "_blank", E.rel = "noreferrer", E.setAttribute("aria-label", `Open ${a} details in new tab`), E.classList.add("dq-card-link"));
    const C = v.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    C && C.setAttribute(
      "aria-label",
      s ? `Deselect ${a}` : `Select ${a}`
    );
    const k = v.querySelector(
      'button[title="Quick View"]'
    );
    k && k.setAttribute("aria-label", `Preview ${a}`);
  }, [s, a, e.id]), /* @__PURE__ */ d(
    "article",
    {
      ref: (v) => {
        c.current = v, u(v);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${a}${s ? ", selected" : ""}`,
      onFocus: l,
      onClick: (v) => {
        l(), v.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${r} ${i ? "focused" : ""} ${s ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          Nr,
          {
            video: m,
            selected: s,
            onSelect: b,
            onNavigate: h,
            onQuickView: N,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        r === "wall" && /* @__PURE__ */ n(hn, { video: e }),
        t && /* @__PURE__ */ d("div", { className: "dq-card-annotation", title: t, children: [
          /* @__PURE__ */ n("span", { children: "Review" }),
          /* @__PURE__ */ n("p", { children: t })
        ] })
      ]
    }
  );
}
function hn({ video: e }) {
  const t = _(null), r = _(null), [i, s] = S(!1), [u, l] = S(!1), [b, N] = S(!1);
  return Q(() => {
    const h = t.current;
    if (!h || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      s(!0), l(!0);
      return;
    }
    const a = new IntersectionObserver(
      ([m]) => s(m.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), c = new IntersectionObserver(
      ([m]) => l(m.isIntersecting && m.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return a.observe(h), c.observe(h), () => {
      a.disconnect(), c.disconnect();
    };
  }, [e.id, e.files.length]), Q(() => {
    if (!i) {
      N(!1);
      return;
    }
    const h = new AbortController();
    return j(Hr(e.id), {
      signal: h.signal
    }).then((a) => {
      h.signal.aborted || N(a.available === !0);
    }).catch(() => {
      h.signal.aborted || N(!1);
    }), () => h.abort();
  }, [i, e.id]), Q(() => {
    const h = r.current;
    h && (u ? Promise.resolve(h.play()).catch(() => {
    }) : h.pause());
  }, [b, u]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: b && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: Gr(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function mn({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: s,
  error: u,
  canWrite: l,
  assessmentReady: b,
  selected: N,
  hasPrevious: h,
  hasNext: a,
  onToggleSelected: c,
  onPrevious: m,
  onNext: v,
  onClose: E,
  onAction: C
}) {
  const k = _(null), T = _(null), R = e.files[0], g = lr(e);
  Q(() => {
    var M;
    const p = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (M = k.current) == null || M.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = p;
    };
  }, []);
  function A(p) {
    var D, se, ie;
    if (p.key !== "Tab") return;
    const M = [
      ...((D = k.current) == null ? void 0 : D.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ae) => ae.offsetParent !== null);
    if (!M.length) {
      p.preventDefault(), (se = k.current) == null || se.focus();
      return;
    }
    const J = M.indexOf(
      document.activeElement
    );
    p.shiftKey && J <= 0 ? (p.preventDefault(), (ie = M.at(-1)) == null || ie.focus()) : !p.shiftKey && J === M.length - 1 && (p.preventDefault(), M[0].focus());
  }
  function I(p) {
    if (p.defaultPrevented || p.ctrlKey || p.metaKey || p.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const M = p.key === "ArrowLeft" || p.key === "ArrowRight";
    if (p.altKey && !M) return;
    const J = T.current, D = p.currentTarget.querySelector("video");
    if (p.key === "Enter" || p.key === "Escape")
      p.repeat || E();
    else if (p.key === " " && J)
      p.repeat || J.toggle();
    else if (M && J)
      J.seekBy(
        (p.key === "ArrowLeft" ? -1 : 1) * (p.shiftKey ? 5 : p.altKey ? 10 : 60)
      );
    else if ((p.key === "," || p.key === ".") && J) {
      const se = [R == null ? void 0 : R.duration, D == null ? void 0 : D.duration].find(
        (ae) => ae != null && Number.isFinite(ae) && ae > 0
      ) ?? 0, ie = e.parentVideoId != null ? (e.clipEndSec ?? se) - (e.clipStartSec ?? 0) : se;
      Number.isFinite(ie) && ie > 0 && J.seekBy((p.key === "," ? -1 : 1) * ie * 0.1);
    } else if (p.key.toLowerCase() === "n" || p.key.toLowerCase() === "m")
      !p.repeat && !i && !s && (p.key.toLowerCase() === "n" && h && m(), p.key.toLowerCase() === "m" && a && v());
    else if (p.key === "ArrowUp" && D)
      D.volume = Math.min(1, D.volume + 0.1);
    else if (p.key === "ArrowDown" && D)
      D.volume = Math.max(0, D.volume - 0.1);
    else return;
    Z(p);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: k,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${g}`,
      className: "dq-preview",
      onKeyDown: A,
      onKeyDownCapture: I,
      onMouseDown: (p) => {
        p.target === p.currentTarget && E();
      },
      children: /* @__PURE__ */ d("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ d("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !h || i || s,
              onClick: m,
              children: /* @__PURE__ */ n(kr, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !a || i || s,
              onClick: v,
              children: /* @__PURE__ */ n(Ir, {})
            }
          ),
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ n("h2", { children: g }),
            /* @__PURE__ */ d("p", { children: [
              "Actions target ",
              r,
              "."
            ] })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: c,
              disabled: s,
              children: N ? "Selected" : "Select"
            }
          ),
          /* @__PURE__ */ n(
            "a",
            {
              href: `/video/${e.id}`,
              target: "_blank",
              rel: "noreferrer",
              className: "dq-details-link",
              "aria-label": `Open ${g} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ n(Or, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: E,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(er, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: R ? /* @__PURE__ */ n(
          Sr,
          {
            autostart: !0,
            streamUrl: Qr(e.id),
            posterUrl: Vt(e),
            format: R.format,
            audioCodec: R.audioCodec,
            duration: R.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (p) => (T.current = p, () => {
              T.current === p && (T.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: Vt(e), alt: "" }) }),
        u && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: u }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((p, M) => /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            disabled: i || s || !l || Qe(p) && !b,
            onClick: () => void C(p),
            children: [
              ke(p, M) && /* @__PURE__ */ n("kbd", { children: ke(p, M) }),
              p.label
            ]
          },
          p.id
        )) })
      ] })
    }
  );
}
function Ht({
  reviews: e,
  activeReview: t,
  initialEdit: r = !1,
  temporary: i = !1,
  onSave: s,
  onChoose: u,
  onClose: l
}) {
  const [b, N] = S(
    () => r && t ? structuredClone(t) : null
  ), [h, a] = S(""), [c, m] = S(!1), v = _(null);
  Q(() => {
    var I, p;
    const g = document.activeElement, A = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (p = (I = v.current) == null ? void 0 : I.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || p.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = A, g == null || g.focus({ preventScroll: !0 });
    };
  }, []);
  function E(g) {
    var p, M, J;
    if (g.defaultPrevented) {
      g.stopPropagation();
      return;
    }
    if (g.key === "Escape") {
      Z(g), c || l();
      return;
    }
    if (g.key !== "Tab") {
      g.stopPropagation();
      return;
    }
    const A = [
      ...((p = v.current) == null ? void 0 : p.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((D) => D.offsetParent !== null);
    if (!A.length) {
      Z(g), (M = v.current) == null || M.focus();
      return;
    }
    const I = A.indexOf(
      document.activeElement
    );
    g.shiftKey && I <= 0 ? (Z(g), (J = A.at(-1)) == null || J.focus()) : !g.shiftKey && I === A.length - 1 ? (Z(g), A[0].focus()) : g.stopPropagation();
  }
  function C(g) {
    N(
      g ? structuredClone(g) : {
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
    ), a("");
  }
  async function k() {
    if (c) return;
    if (!b || gt(b)) {
      a(b ? gt(b) : "Choose a review.");
      return;
    }
    const g = { ...b, name: b.name.trim() }, A = e.some((I) => I.id === g.id) ? e.map((I) => I.id === g.id ? g : I) : [...e, g];
    m(!0), a("");
    try {
      if (!await s(A)) throw new Error("Could not save reviews.");
      u(g.id), l();
    } catch (I) {
      a(
        "Could not save reviews. Your edits are still open. " + (I instanceof Error ? I.message : "Retry saving.")
      );
    } finally {
      m(!1);
    }
  }
  async function T(g) {
    if (!c) {
      m(!0), a("");
      try {
        if (!await s(g)) throw new Error("Could not save reviews.");
      } catch (A) {
        a(
          A instanceof Error ? A.message : "Could not save reviews."
        );
      } finally {
        m(!1);
      }
    }
  }
  async function R(g) {
    var I;
    if (c) return;
    const A = (I = g.target.files) == null ? void 0 : I[0];
    if (g.target.value = "", !!A) {
      if (A.size > 2e6) {
        a("Review files must be smaller than 2 MB.");
        return;
      }
      m(!0), a("");
      try {
        const p = Ie(await A.text());
        if (!await s(ht(e, p)))
          throw new Error("Could not save reviews.");
      } catch (p) {
        a(
          p instanceof Error ? p.message : "Could not import reviews."
        );
      } finally {
        m(!1);
      }
    }
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: v,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: E,
      children: /* @__PURE__ */ d("div", { className: "dq-manager", children: [
        /* @__PURE__ */ d("header", { children: [
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ n("h2", { children: i ? "Adjust queue temporarily" : b ? e.some((g) => g.id === b.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: i ? "Apply changes for this session. Saved review settings stay available through Reset to saved queue." : "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: c,
              onClick: l,
              children: /* @__PURE__ */ n(er, {})
            }
          )
        ] }),
        h && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: h }),
        /* @__PURE__ */ n("fieldset", { disabled: c, className: "dq-manager-content", children: b ? /* @__PURE__ */ n(
          wn,
          {
            draft: b,
            temporary: i,
            saving: c,
            setDraft: N,
            onSave: () => void k(),
            onCancel: l
          }
        ) : /* @__PURE__ */ d(de, { children: [
          /* @__PURE__ */ d("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ d(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => C(),
                children: [
                  /* @__PURE__ */ n(Tr, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ d("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(Pr, {}),
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
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((g) => /* @__PURE__ */ d("article", { children: [
            /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ n("strong", { children: g.name }),
              /* @__PURE__ */ n("p", { children: g.description || "No description" })
            ] }),
            /* @__PURE__ */ d("button", { type: "button", onClick: () => C(g), children: [
              /* @__PURE__ */ n(Yt, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => C({
                  ...structuredClone(g),
                  id: crypto.randomUUID(),
                  name: `${g.name} copy`
                }),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${g.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${g.name}”?`) && T(
                    e.filter((A) => A.id !== g.id)
                  );
                },
                children: /* @__PURE__ */ n(tr, {})
              }
            )
          ] }, g.id)) })
        ] }) })
      ] })
    }
  );
}
function wn({
  draft: e,
  temporary: t = !1,
  saving: r = !1,
  setDraft: i,
  onSave: s,
  onCancel: u
}) {
  const [l, b] = S("Review"), N = _(/* @__PURE__ */ new WeakMap()), h = (c) => {
    let m = N.current.get(c);
    return m || (m = crypto.randomUUID(), N.current.set(c, m)), m;
  }, a = (c, m) => i({
    ...e,
    actions: e.actions.map(
      (v, E) => E === c ? m : v
    )
  });
  return /* @__PURE__ */ d("div", { className: "dq-editor", children: [
    !t && /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      Er,
      {
        tabs: ["Review", "Queue", "Appearance", "Actions"].map((c) => ({
          key: c,
          label: c,
          count: c === "Actions" ? e.actions.length : void 0,
          disabled: r
        })),
        activeTab: l,
        onTabChange: b
      }
    ) }),
    /* @__PURE__ */ d("div", { className: "dq-editor-body", children: [
      !t && /* @__PURE__ */ d("section", { hidden: l !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ d("label", { children: [
          "Review name",
          /* @__PURE__ */ n(
            "input",
            {
              autoFocus: !0,
              "aria-label": "Review name",
              value: e.name,
              onChange: (c) => i({ ...e, name: c.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          "Description",
          /* @__PURE__ */ n(
            "textarea",
            {
              "aria-label": "Description",
              value: e.description,
              onChange: (c) => i({ ...e, description: c.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n(
        "section",
        {
          hidden: !t && l !== "Queue",
          className: "dq-editor-section",
          children: /* @__PURE__ */ n(zt, { draft: e, onChange: i, presentation: !1 })
        }
      ),
      !t && /* @__PURE__ */ n(
        "section",
        {
          hidden: l !== "Appearance",
          className: "dq-editor-section",
          children: /* @__PURE__ */ n(zt, { draft: e, onChange: i, queue: !1 })
        }
      ),
      !t && /* @__PURE__ */ d("section", { hidden: l !== "Actions", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Actions" }),
        /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
        /* @__PURE__ */ n(
          _t,
          {
            items: e.actions,
            getKey: (c) => c.id,
            disabled: r,
            className: "dq-sortable-list",
            onReorder: (c) => i({ ...e, actions: c }),
            renderItem: (c, { index: m, dragHandleProps: v, isOver: E }) => /* @__PURE__ */ d(
              "fieldset",
              {
                className: E ? "dq-action-card dq-drag-over" : "dq-action-card",
                children: [
                  /* @__PURE__ */ d("legend", { children: [
                    "Action ",
                    m + 1
                  ] }),
                  /* @__PURE__ */ d("div", { className: "dq-action-heading", children: [
                    /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        ...v,
                        disabled: r,
                        className: "dq-drag-handle",
                        "aria-label": `Reorder action ${m + 1}`,
                        children: /* @__PURE__ */ n(rr, {})
                      }
                    ),
                    /* @__PURE__ */ n("strong", { children: c.label || "New action" }),
                    /* @__PURE__ */ n("div", { className: "dq-row", children: /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        onClick: () => i({
                          ...e,
                          actions: [
                            ...e.actions.slice(0, m + 1),
                            {
                              ...structuredClone(c),
                              id: crypto.randomUUID(),
                              label: c.label + " copy",
                              shortcut: ""
                            },
                            ...e.actions.slice(m + 1)
                          ]
                        }),
                        children: "Duplicate action"
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ d("div", { className: "dq-field-grid", children: [
                    /* @__PURE__ */ d("label", { children: [
                      "Shortcut",
                      /* @__PURE__ */ d(
                        "select",
                        {
                          value: c.shortcut ?? "auto",
                          onChange: (C) => a(m, {
                            ...c,
                            shortcut: C.target.value === "auto" ? void 0 : C.target.value
                          }),
                          children: [
                            /* @__PURE__ */ d("option", { value: "auto", children: [
                              "Position (",
                              m < 9 ? m + 1 : "none",
                              ")"
                            ] }),
                            /* @__PURE__ */ n("option", { value: "", children: "None" }),
                            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((C) => /* @__PURE__ */ n("option", { value: C, children: C }, C))
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ d("label", { children: [
                      "Button label",
                      /* @__PURE__ */ n(
                        "input",
                        {
                          value: c.label,
                          onChange: (C) => a(m, {
                            ...c,
                            label: C.target.value
                          })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ n(
                    _t,
                    {
                      items: c.steps,
                      getKey: h,
                      disabled: r,
                      className: "dq-sortable-list",
                      onReorder: (C) => a(m, { ...c, steps: C }),
                      renderItem: (C, { index: k, dragHandleProps: T, isOver: R }) => /* @__PURE__ */ n(
                        bn,
                        {
                          dragHandleProps: T,
                          saving: r,
                          isOver: R,
                          step: C,
                          index: k,
                          onChange: (g) => {
                            N.current.set(g, h(C)), a(m, {
                              ...c,
                              steps: c.steps.map(
                                (A, I) => I === k ? g : A
                              )
                            });
                          },
                          onRemove: () => a(m, {
                            ...c,
                            steps: c.steps.filter(
                              (g, A) => A !== k
                            )
                          })
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ d("div", { className: "dq-row", children: [
                    /* @__PURE__ */ n(
                      "button",
                      {
                        className: "dq-button",
                        type: "button",
                        onClick: () => a(m, {
                          ...c,
                          steps: [...c.steps, { mode: "ADD", tagIds: [] }]
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
                            (C, k) => k !== m
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
    /* @__PURE__ */ d("div", { className: "dq-editor-footer", children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const c = URL.createObjectURL(
              new Blob([JSON.stringify([e], null, 2)], {
                type: "application/json"
              })
            ), m = document.createElement("a");
            m.href = c, m.download = "data-quality-review.json", m.click(), URL.revokeObjectURL(c);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: u, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: s, children: t ? "Apply temporary queue" : "Save review" })
    ] })
  ] });
}
function bn({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: i,
  isOver: s,
  onChange: u,
  onRemove: l
}) {
  return /* @__PURE__ */ d("div", { className: s ? "dq-action-step dq-drag-over" : "dq-action-step", children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        ...r,
        disabled: i,
        className: "dq-drag-handle",
        "aria-label": `Reorder step ${t + 1}`,
        children: /* @__PURE__ */ n(rr, {})
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
        onChange: (b) => u({ ...e, mode: b.target.value }),
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
      ft,
      {
        entityType: "tag",
        values: e.tagIds,
        onChange: (b) => u({ ...e, tagIds: b }),
        placeholder: "Choose tags",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: l, children: /* @__PURE__ */ n(tr, {}) })
  ] });
}
async function yn() {
  const e = await j("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const l = JSON.parse(r);
      Array.isArray(l.reviews) && (i = JSON.stringify(l.reviews, null, 2));
    } catch {
    }
  const s = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), u = document.createElement("a");
  u.href = s, u.download = "data-quality-browser-recovery.json", u.click(), URL.revokeObjectURL(s);
}
function Wt({ label: e }) {
  return /* @__PURE__ */ d("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(Zt, { className: "dq-spin" }),
    e
  ] });
}
function Xt({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ d("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(pt, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const An = { components: { DataQualityPage: fn } };
export {
  fn as DataQualityPage,
  An as default
};
