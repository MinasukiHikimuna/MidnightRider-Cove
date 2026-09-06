import { jsxs as h, jsx as i, Fragment as de } from "react/jsx-runtime";
import { useState as A, useEffect as V, useMemo as wt, useRef as D, useCallback as he, useLayoutEffect as Lr } from "react";
import { VIDEO_CRITERIA as vt, FilterDialog as dr, VIDEO_SORT_OPTIONS as Gt, EntityReferenceMultiSelector as St, DetailListPagination as xr, VideoPlayer as Mr, VideoCard as Pr, EntityDetailTabs as jr, SortableList as Ht } from "@cove/runtime/components";
import { Pencil as ur, AlertTriangle as Nt, LayoutGrid as _r, Grid3X3 as Dr, ZoomOut as Fr, ZoomIn as Ur, Film as Wt, Loader2 as fr, ChevronLeft as Kr, ChevronRight as Jr, ExternalLink as zr, X as pr, Plus as Br, Upload as Vr, Trash2 as gr, GripVertical as hr } from "@cove/runtime/lucide-react";
import { extensionFetch as Qr } from "@cove/runtime/api";
function Le(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function Et(e) {
  if (e.actions.some(mr))
    return "An action cannot contain contradictory assessments for the same tag.";
  if (!e.name.trim() || !e.actions.every(Rt))
    return "Name the review and complete every action step before saving.";
  if (new Set(e.actions.map((r) => r.id)).size !== e.actions.length)
    return "Action IDs must be unique within a review.";
  const t = e.actions.map(
    (r, n) => r.shortcut ?? (n < 9 ? String(n + 1) : "")
  ).filter(Boolean);
  return t.some((r) => !/^[1-9]$/.test(r)) || new Set(t).size !== t.length ? "Assign each shortcut 1–9 only once, or choose None. Navigation and player keys are reserved." : "";
}
function me(e) {
  const t = (r, n) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : n;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(100, t(e.perPage, 40)))
  };
}
function Xt(e, t, r) {
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
  ) && !mr(e);
}
function We(e) {
  return e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  );
}
function mr(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.steps)
    if (["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(r.mode))
      for (const n of r.tagIds) {
        const o = t.get(n);
        if (o && o !== r.mode) return !0;
        t.set(n, r.mode);
      }
  return !1;
}
function xe(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Gr(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (n) => typeof n == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (n) => typeof (n == null ? void 0 : n.id) == "string" && typeof n.label == "string" && (n.shortcut === void 0 || typeof n.shortcut == "string") && Array.isArray(n.steps) && n.steps.every((o) => o && Array.isArray(o.tagIds)) && Rt(n)
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => Et(r)))
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
    (r) => r === void 0 || Array.isArray(r) && r.every((n) => Number.isSafeInteger(n) && n > 0)
  );
}
function Ct(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const n of e)
    for (const o of n)
      r.has(o.id) || (r.add(o.id), t.push(o));
  return t;
}
function Yt(e, t) {
  return e.size > 0 ? [...e].sort((r, n) => r - n) : t == null ? [] : [t];
}
function Hr(e, t, r, n) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!n && t.includes(r)) return r;
  const o = Math.max(0, e.indexOf(r));
  if (n) {
    for (const d of e.slice(o + 1))
      if (t.includes(d)) return d;
    if (t.includes(r)) {
      for (const d of e.slice(0, o).reverse())
        if (t.includes(d)) return d;
      return r;
    }
  }
  return t[Math.min(o, t.length - 1)];
}
function Wr(e, t) {
  const r = new Set(e), n = t.length > 0 && t.every((o) => r.has(o));
  for (const o of t)
    n ? r.delete(o) : r.add(o);
  return r;
}
function Xr(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const yr = "ext:com.midnightrider.data-quality:configuration", Yr = "ext:cove-data-quality:video-reviews", At = "ext:com.midnightrider.data-quality:progress", Me = /* @__PURE__ */ new Map(), Qe = /* @__PURE__ */ new Map(), ht = (e, t) => e.includes("*") || e.includes(t), Xe = (e) => F(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Zr = () => ({
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
    reviews: xe(JSON.stringify(t.reviews)),
    deletedIds: qt(t.deletedIds),
    importedIds: qt(t.importedIds)
  };
}
function en(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const n = /* @__PURE__ */ new Set();
  for (const o of t) {
    const d = localStorage.getItem(o);
    if (d !== null) {
      const l = xe(d);
      r ?? (r = l), l.forEach((f) => n.add(f.id));
    }
    qt(
      JSON.parse(localStorage.getItem(`${o}:account-imports`) ?? "[]")
    ).forEach((l) => n.add(l));
  }
  return {
    reviews: r ?? [],
    known: [...n],
    present: r !== void 0
  };
}
async function br(e) {
  const t = await F("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function wr(e, t) {
  const r = (Qe.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Qe.set(e, r), r.finally(() => {
    Qe.get(e) === r && Qe.delete(e);
  }).catch(() => {
  }), r;
}
let ke = null;
function tn() {
  if (ke) return ke;
  const e = rn();
  return ke = e, e.finally(() => {
    ke === e && (ke = null);
  }).catch(() => {
  }), e;
}
async function rn() {
  var g;
  const e = await F("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, n = ht(e.permissions, "savedfilters.read"), o = n && ht(e.permissions, "savedfilters.write"), d = n ? (await Xe(yr)).filter((N) => N.name === "Data Quality configuration").sort((N, w) => N.id - w.id) : [];
  if (d.length > 1) {
    const N = (w) => {
      const { revision: E, ...I } = Ee(w.uiOptions);
      return JSON.stringify(I);
    };
    if (d.some((w) => N(w) !== N(d[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (o)
      for (const w of d.slice(1))
        await F(`/api/savedfilters/${w.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${w.id}` })
        });
    d.splice(1);
  }
  let l = d.length ? Ee(d[0].uiOptions) : Zr();
  const f = localStorage.getItem(`${r}:migrated`) === "true", u = localStorage.getItem(r), p = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && u && (l = Ee(u));
  let s = !d.length;
  if (d.length && p && u) {
    const N = Ee(u);
    if (N.reviews.some((E) => {
      const I = l.reviews.find((R) => R.id === E.id);
      return I && JSON.stringify(I) !== JSON.stringify(E);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const w = [
      .../* @__PURE__ */ new Set([...l.deletedIds, ...N.deletedIds])
    ];
    l = {
      ...l,
      reviews: Ct(l.reviews, N.reviews).filter(
        (E) => !w.includes(E.id)
      ),
      deletedIds: w,
      importedIds: [
        .../* @__PURE__ */ new Set([...l.importedIds, ...N.importedIds])
      ]
    }, s = !0;
  }
  if (!f) {
    const N = JSON.stringify(l), w = en(t);
    if (d.length && w.reviews.some((C) => {
      const y = l.reviews.find((q) => q.id === C.id);
      return y && JSON.stringify(y) !== JSON.stringify(C);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const E = n ? (await Xe(Yr)).flatMap(
      (C) => xe(C.uiOptions ?? "[]")
    ) : [], I = w.known.filter(
      (C) => !w.reviews.some((y) => y.id === C)
    ), R = /* @__PURE__ */ new Set([...l.deletedIds, ...I]);
    l = {
      ...l,
      reviews: Ct(
        w.reviews,
        l.reviews,
        E.filter(
          (C) => !w.known.includes(C.id) && !l.importedIds.includes(C.id)
        )
      ).filter((C) => !R.has(C.id)),
      deletedIds: [...R],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...l.importedIds,
          ...w.known,
          ...E.map((C) => C.id)
        ])
      ]
    }, s || (s = JSON.stringify(l) !== N);
  }
  const c = {
    userId: t,
    recordId: (g = d[0]) == null ? void 0 : g.id,
    config: l,
    readable: n,
    writable: o,
    durable: o
  };
  if (Me.set(r, c), s && o) {
    const N = l;
    d.length && (c.config = Ee(d[0].uiOptions)), await vr(r, N), l = c.config;
  } else d.length || (localStorage.setItem(r, JSON.stringify(l)), !n && (!f || p) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!n) localStorage.setItem(`${r}:migrated`, "true");
  else if (o)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: l.reviews,
    storageKey: r,
    canWrite: ht(e.permissions, "videos.write"),
    canConfigure: !n || o,
    storageNotice: n ? o ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function vr(e, t) {
  const r = Me.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const n = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await br(r), r.recordId != null) {
      const d = await F(
        `/api/savedfilters/${r.recordId}`
      );
      if (Ee(d.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const o = await F(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: yr,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(n)
        })
      }
    );
    r.recordId = o.id;
  } else
    localStorage.setItem(e, JSON.stringify(n)), localStorage.setItem(`${e}:local-only`, "true");
  if (r.config = n, r.durable)
    try {
      localStorage.setItem(e, JSON.stringify(n)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function nn(e, t) {
  return xe(JSON.stringify(t)), wr(e, async () => {
    const r = Me.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const n = r.config.reviews.filter((o) => !t.some((d) => d.id === o.id)).map((o) => o.id);
    await vr(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...n])
      ].filter((o) => !t.some((d) => d.id === o))
    });
  });
}
function Zt(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function on(e, t) {
  const r = Me.get(e);
  if (!r) return null;
  const n = localStorage.getItem(`${e}:progress:${t}`), o = n ? Zt(n) : null;
  if (!r.readable) return o;
  const d = (await Xe(At)).find(
    (f) => f.name === t
  ), l = d ? Zt(d.uiOptions) : null;
  return o && (!l || o.updatedAt > l.updatedAt) ? o : l;
}
function sn(e, t, r) {
  const n = `${e}:progress:${t}`;
  try {
    localStorage.setItem(n, JSON.stringify(r));
  } catch {
  }
  return wr(n, async () => {
    const o = Me.get(e);
    if (!(o != null && o.writable)) return;
    await br(o);
    const d = (await Xe(At)).find(
      (l) => l.name === t
    );
    await F(
      d ? `/api/savedfilters/${d.id}` : "/api/savedfilters",
      {
        method: d ? "PUT" : "POST",
        body: JSON.stringify({
          mode: At,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Pe = "confirmed_absent_tags", $t = "Confirmed absent tags", an = {
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
      t === "modifier" && typeof r == "string" ? an[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === Pe.toLowerCase() ? r.toLowerCase() : Ye(r)
    ])
  ) : e;
}
async function F(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const n = await Qr(e, { ...t, headers: r });
  if (!n.ok) {
    let d = n.statusText || `Request failed (${n.status}).`;
    try {
      const l = await n.json();
      d = l.message || l.detail || l.error || d;
    } catch {
    }
    throw new Error(d);
  }
  if (n.status === 204 || n.status === 205) return;
  const o = await n.text();
  return o ? JSON.parse(o) : void 0;
}
async function er(e, t, r) {
  const n = { ...e.view.objectFilter }, o = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return F("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Ye({
        findFilter: me(t),
        objectFilter: n,
        filterExpression: o
      })
    )
  });
}
function ln(e) {
  return `/api/stream/video/${e}`;
}
function tr(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function cn(e) {
  return `/api/stream/video/${e}/preview`;
}
function dn(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function un(e) {
  return e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Ot(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await F(`/api/tags/${r}`), t.add(r);
    for (let n = 1; ; n++) {
      const o = await F("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          Ye({
            findFilter: { page: n, perPage: 1e3, sort: "id", direction: "asc" },
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
      for (const d of o.items) t.add(d.id);
      if (n * 1e3 >= o.totalCount) break;
      if (!o.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...t];
}
function fn(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${Pe} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function It() {
  const t = (await F("/api/custom-fields")).find(
    (n) => n.key.toLowerCase() === Pe.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${$t} custom field before applying tag assessments.`
    };
  const r = fn(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function pn() {
  const e = await It();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await F("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: Pe,
        label: $t,
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
function gn(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${Pe} value is not a valid tag list.`
    );
  return Ze(e);
}
function hn(e) {
  return Ze(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function mn(e, t) {
  let r;
  try {
    r = await It();
  } catch (p) {
    throw new Error(
      `Could not verify the ${$t} custom field. ${p instanceof Error ? p.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const n = await Promise.all(
    e.steps.map(async (p) => ({
      ...p,
      tagIds: p.mode === "REMOVE_TREE" ? await Ot(p.tagIds) : Ze(p.tagIds)
    }))
  ), o = n.filter(
    (p) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(p.mode)
  ), d = n.filter(
    (p) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(p.mode)
  ), l = Ze(t), f = r.definition.key;
  let u = 0;
  for (const p of l)
    try {
      const s = await F(`/api/videos/${p}`), c = hn(s), g = { ...s.customFields ?? {} }, N = g[f], w = gn(N), E = new Set(c), I = new Set(w);
      for (const q of o)
        for (const O of q.tagIds)
          q.mode === "ADD" ? E.add(O) : E.delete(O);
      for (const q of d)
        for (const O of q.tagIds)
          q.mode === "MARK_PRESENT" ? (E.add(O), I.delete(O)) : q.mode === "MARK_ABSENT" ? (E.delete(O), I.add(O)) : I.delete(O);
      const R = [...E], C = [...I];
      JSON.stringify(c) === JSON.stringify(R) && JSON.stringify(w) === JSON.stringify(C) && (N === void 0 ? C.length === 0 : JSON.stringify(N) === JSON.stringify(w)) || await F(`/api/videos/${p}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: R,
          customFields: {
            ...g,
            [f]: C
          }
        })
      }), u++;
    } catch (s) {
      throw new Error(
        `Assessment stopped after ${u} video${u === 1 ? "" : "s"} completed; video ${p} was affected. Refresh and inspect it before retrying. ${s instanceof Error ? s.message : "Request failed."}`
      );
    }
}
async function yn(e, t) {
  if (!Rt(e) || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (We(e)) {
    await mn(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (n) => ({
      mode: n.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: n.mode === "REMOVE_TREE" ? await Ot(n.tagIds) : n.tagIds
    }))
  );
  for (let n = 0; n < r.length; n++)
    try {
      await F("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({
          ids: [...t],
          tagIds: [...r[n].tagIds],
          tagMode: r[n].mode
        })
      });
    } catch (o) {
      throw new Error(
        `Step ${n + 1} failed; ${n} earlier step(s) completed. Refresh and check the selected videos before retrying. ${o instanceof Error ? o.message : "Request failed."}`
      );
    }
}
function bn(e) {
  var f, u, p;
  const [t, r] = A({}), [n, o] = A(""), d = (((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.annotations) ?? []).includes("tags") ? ((u = e == null ? void 0 : e.presentation) == null ? void 0 : u.annotationParents) ?? [] : [], l = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...d,
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return V(() => {
    let s = !0;
    return r({}), o(""), Promise.all(
      JSON.parse(l).map(
        async (c) => [c, await Ot([c])]
      )
    ).then((c) => {
      s && r(Object.fromEntries(c));
    }).catch(() => {
      s && o(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      s = !1;
    };
  }, [l]), { ids: t, error: n };
}
function wn(e, t, r) {
  const n = t == null ? void 0 : t.presentation, o = (n == null ? void 0 : n.annotations) ?? [], d = (n == null ? void 0 : n.annotationParents) ?? [];
  return {
    ...e,
    details: void 0,
    organized: !1,
    groups: [],
    galleries: [],
    date: o.includes("date") ? e.date : void 0,
    studioId: o.includes("studio") ? e.studioId : void 0,
    studioName: o.includes("studio") ? e.studioName : void 0,
    performers: o.includes("performers") ? e.performers : [],
    tags: o.includes("tags") && d.length > 0 ? (e.tags ?? []).filter(
      (l) => d.some(
        (f) => {
          var u;
          return f !== l.id && ((u = r[f]) == null ? void 0 : u.includes(l.id));
        }
      )
    ) : []
  };
}
function vn({
  videos: e,
  review: t,
  trees: r,
  disabled: n,
  onChoose: o
}) {
  var f, u, p;
  const d = new Set(
    (((f = t.presentation) == null ? void 0 : f.binParents) ?? []).flatMap(
      (s) => (r[s] ?? []).filter((c) => c !== s)
    )
  ), l = /* @__PURE__ */ new Map();
  for (const s of e)
    for (const c of s.tags ?? [])
      if (d.has(c.id)) {
        const g = l.get(c.id) ?? { name: c.name, count: 0 };
        g.count++, l.set(c.id, g);
      }
  return (p = (u = t.presentation) == null ? void 0 : u.binParents) != null && p.length ? /* @__PURE__ */ h("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ i("span", { children: "Tags on this page:" }),
    [...l].sort((s, c) => s[1].name.localeCompare(c[1].name)).map(([s, c]) => /* @__PURE__ */ h(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: n,
        onClick: () => o(s),
        children: [
          c.name,
          " (",
          c.count,
          ")"
        ]
      },
      s
    )),
    !l.size && /* @__PURE__ */ i("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function Sn(e, t) {
  const { _filterExpression: r, ...n } = e.view.objectFilter;
  return {
    ...e,
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...Object.keys(n).length ? [{ filter: n }] : [],
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
function ye(e) {
  return e == null || e === "" ? !1 : Array.isArray(e) ? e.length > 0 : typeof e == "object" ? Object.keys(e).length > 0 : !0;
}
function nt(e, t) {
  return e.find(
    (r) => r.id === t || r.filterKey === t || r.secondaryFilterKey === t || r.auxiliaryToggleKey === t
  );
}
function Nn(e, t) {
  const r = nt(t, e);
  return r ? r.label : e === "_filterExpression" ? "Combined filters" : e.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").replace(/^./, (n) => n.toUpperCase());
}
const Ce = {
  EQUALS: "is",
  NOT_EQUALS: "is not",
  INCLUDES: "includes",
  INCLUDES_ALL: "includes all",
  EXCLUDES: "excludes",
  GREATER_THAN: "greater than",
  LESS_THAN: "less than",
  BETWEEN: "between",
  NOT_BETWEEN: "not between",
  IS_NULL: "is empty",
  NOT_NULL: "is set",
  MATCHES_REGEX: "matches",
  NOT_MATCHES_REGEX: "does not match"
};
function Ge(e, t, r, n) {
  if (typeof t != "number") return String(t ?? "");
  const o = n == null ? void 0 : n[String(t)];
  return typeof o == "string" && o ? o : r.get(`${e}:${t}`) ?? `Item ${t}`;
}
function et(e, t) {
  return e.length < 2 ? e[0] ?? "" : e.length === 2 ? `${e[0]} ${t} ${e[1]}` : `${e.slice(0, -1).join(", ")}, ${t} ${e.at(-1)}`;
}
function rr(e) {
  return e.length === 1 ? `not ${e[0]}` : e.length === 2 ? `neither ${et(e, "nor")}` : e.length ? `none of ${et(e, "or")}` : "";
}
function tt(e, t, r) {
  var d, l, f;
  if (typeof e == "boolean") return e ? "Yes" : "No";
  if (typeof e == "string" || typeof e == "number")
    return String(e);
  if (Array.isArray(e))
    return e.map((u) => Ge(t == null ? void 0 : t.entityType, u, r)).join(", ");
  if (!e || typeof e != "object") return "Configured";
  const n = e, o = n._names && typeof n._names == "object" ? n._names : void 0;
  if ((t == null ? void 0 : t.type) === "multiId") {
    const u = Array.isArray(n.value) ? n.value.map(
      (w) => Ge(t.entityType, w, r, o)
    ) : [], p = Array.isArray(n.excludes) ? n.excludes.map(
      (w) => Ge(t.entityType, w, r, o)
    ) : [], s = String(n.modifier ?? "INCLUDES_ALL"), c = s === "EXCLUDES_ALL" ? u.length ? `not all of ${et(u, "and")}` : "" : s === "EXCLUDES" ? rr(u) : et(u, s === "INCLUDES_ALL" ? "and" : "or"), g = rr(p), N = c && g ? `${c} but ${g}` : c || g;
    if (N)
      return `${N}${n.depth === -1 ? " with sub-tags" : ""}`;
  }
  if ((t == null ? void 0 : t.type) === "hash") {
    const u = ((l = (d = t.options) == null ? void 0 : d.find((s) => s.value === String(n.type))) == null ? void 0 : l.label) ?? String(n.type ?? "Hash"), p = typeof n.modifier == "string" ? Ce[n.modifier] ?? n.modifier.toLowerCase() : "";
    return n.modifier === "IS_NULL" || n.modifier === "NOT_NULL" ? `${u} ${p}` : [u, p, n.value].filter(ye).join(" ");
  }
  if ((t == null ? void 0 : t.type) === "enum" && ye(n.value)) {
    const u = (f = t.options) == null ? void 0 : f.find(
      (s) => s.value === String(n.value)
    );
    return [typeof n.modifier == "string" ? Ce[n.modifier] ?? n.modifier.toLowerCase() : "", (u == null ? void 0 : u.label) ?? String(n.value)].filter(Boolean).join(" ");
  }
  if ((t == null ? void 0 : t.type) === "tagDuration") {
    const p = (Array.isArray(n.clauses) ? n.clauses : [n]).flatMap((s) => {
      if (!s || typeof s != "object") return [];
      const c = s, g = Ge("tags", c.tagId, r, o), N = typeof c.modifier == "string" ? Ce[c.modifier] ?? c.modifier.toLowerCase() : "", w = (R) => typeof R != "number" ? "" : c.unit === "percent" ? `${R}%` : `${R} ${c.unit === "seconds" || !c.unit ? "seconds" : String(c.unit)}`, E = w(c.value), I = w(c.value2);
      return [
        [g, N, I ? `${E} and ${I}` : E].filter(ye).join(" ")
      ];
    });
    if (p.length) return p.join(" · ");
  }
  if (n.modifier === "IS_NULL" || n.modifier === "NOT_NULL")
    return Ce[String(n.modifier)];
  if (ye(n.value)) {
    const u = typeof n.modifier == "string" ? `${Ce[n.modifier] ?? n.modifier.toLowerCase().replaceAll("_", " ")} ` : "", p = tt(n.value, t, r), s = ye(n.value2) ? ` and ${tt(n.value2, t, r)}` : "";
    return `${u}${p}${s}`;
  }
  return "Configured";
}
function Sr(e, t, r, n = "expression", o = []) {
  const d = e._semanticNone || e.operator === "NONE" ? "None" : e.operator === "OR" ? "Any" : e.operator === "JUST_ONE" ? "Just One" : e.operator === "NOT" ? "Exclude" : "All", l = Array.isArray(e.children) ? e.children : [], f = e.relatedScope && typeof e.relatedScope == "object" ? e.relatedScope : void 0, u = typeof (f == null ? void 0 : f.filterKey) == "string" ? nt(t, f.filterKey) : void 0, p = (R, C) => {
    if (!R || typeof R != "object") return !1;
    const y = R.filter;
    if (!y || typeof y != "object") return !1;
    const q = y[C];
    if (!q || typeof q != "object") return !1;
    const O = q;
    return O.exclude !== !0 && (O.mode === void 0 || O.mode === "atLeastOne");
  }, s = !f && e.operator === "AND" ? t.find(
    (R) => R.type === "related" && R.supportsDistinctSiblingMatches && l.filter(
      (C) => p(C, R.filterKey)
    ).length >= 2
  ) : void 0, c = new Set(
    s ? l.flatMap(
      (R, C) => p(R, s.filterKey) ? [C] : []
    ) : []
  ), g = c.size > 0 && c.size < l.length, N = (R) => R === "distinct" ? "Separate matches" : "Matches may overlap", w = [...o, d], E = u ? [
    ...o,
    `${u.label} · ${d} · ${N(f == null ? void 0 : f.matchMode)}`
  ] : void 0, I = s ? [
    ...o,
    ...g ? [d] : [],
    `${s.label} · All · ${N(e.distinctRelatedMatches ? "distinct" : "reuse")}`
  ] : void 0;
  return l.flatMap((R, C) => {
    if (!R || typeof R != "object") return [];
    const y = R, q = E ?? (I && c.has(C) ? I : w);
    return y.filter && typeof y.filter == "object" ? Tt(
      y.filter,
      t,
      r,
      `${n}-${C}`
    ).map((O) => ({
      ...O,
      label: `${q.join(" › ")} · ${O.label}`
    })) : y.group && typeof y.group == "object" ? Sr(
      y.group,
      t,
      r,
      `${n}-${C}`,
      q
    ) : [];
  });
}
function En(e, t, r) {
  var p;
  const n = e.mode === "every" ? "Every match" : e.mode === "none" || e.exclude ? "No matches" : "At least one match", o = e.findFilter && typeof e.findFilter == "object" ? e.findFilter.q : void 0, d = [
    ...t.relatedContextCriteria ?? [],
    ...((p = t.relatedCriteria) == null ? void 0 : p.call(t)) ?? []
  ], l = Object.fromEntries(
    d.flatMap(
      (s) => Object.hasOwn(e, s.filterKey) ? [[s.filterKey, e[s.filterKey]]] : []
    )
  ), f = e.objectFilter && typeof e.objectFilter == "object" ? e.objectFilter : {}, u = Tt(
    { ...l, ...f },
    d,
    r,
    t.id
  );
  return [
    n,
    u.length ? e.conditionOperator === "or" ? "Any condition" : "All conditions" : "",
    typeof o == "string" && o.trim() ? `search “${o.trim()}”` : "",
    ...u.map((s) => `${s.label}: ${s.value}`)
  ].filter(Boolean).join(" · ");
}
function Cn(e, t, r, n) {
  const o = t && typeof t == "object" ? t : void 0, d = o == null ? void 0 : o.value, l = typeof d == "string" && d.trim() ? d.trim() : "Any metadata service";
  if (!ye(e)) {
    const f = typeof (o == null ? void 0 : o.modifier) == "string" ? Ce[o.modifier] ?? o.modifier.toLowerCase().replaceAll("_", " ") : "configured";
    return `${l} · ${f}`;
  }
  return `${l} · ${tt(e, r, n)}`;
}
function Tt(e, t, r, n = "filter") {
  const o = /* @__PURE__ */ new Set();
  return Object.entries(e).flatMap(([d, l], f) => {
    if (d === "_criterionId" || o.has(d) || !ye(l))
      return [];
    if (d === "_filterExpression" && l && typeof l == "object")
      return Sr(
        l,
        t,
        r,
        `${n}-${f}`
      );
    const u = nt(t, d);
    return u != null && u.secondaryFilterKey ? (o.add(u.filterKey), o.add(u.secondaryFilterKey), [
      {
        key: `${n}-${u.filterKey}`,
        label: u.label,
        value: Cn(
          e[u.filterKey],
          e[u.secondaryFilterKey],
          u,
          r
        )
      }
    ]) : (u == null ? void 0 : u.type) === "related" && l && typeof l == "object" ? [
      {
        key: `${n}-${d}`,
        label: u.label,
        value: En(
          l,
          u,
          r
        )
      }
    ] : [
      {
        key: `${n}-${d}`,
        label: Nn(d, t),
        value: tt(l, u, r)
      }
    ];
  });
}
function He(e, t, r) {
  var n;
  for (const [o, d] of Object.entries(e)) {
    if (!d || typeof d != "object") continue;
    if (o === "_filterExpression") {
      const s = d.children;
      if (!Array.isArray(s)) continue;
      for (const c of s) {
        if (!c || typeof c != "object") continue;
        const g = c;
        g.filter && typeof g.filter == "object" && He(
          g.filter,
          t,
          r
        ), g.group && typeof g.group == "object" && He(
          { _filterExpression: g.group },
          t,
          r
        );
      }
      continue;
    }
    const l = nt(t, o);
    if (!l) continue;
    const f = d, u = f._names && typeof f._names == "object" ? f._names : void 0, p = (s, c) => {
      if (!(!s || !Array.isArray(c)))
        for (const g of c)
          typeof g == "number" && typeof (u == null ? void 0 : u[String(g)]) != "string" && r.set(`${s}:${g}`, { entityType: s, id: g });
    };
    if (l.type === "multiId" && (p(l.entityType, f.value), p(l.entityType, f.excludes)), l.type === "tagDuration") {
      const s = Array.isArray(f.clauses) ? f.clauses : [f];
      for (const c of s) {
        const g = c && typeof c == "object" ? c.tagId : void 0;
        typeof g == "number" && typeof (u == null ? void 0 : u[String(g)]) != "string" && r.set(`tags:${g}`, { entityType: "tags", id: g });
      }
    }
    if (l.type === "related") {
      const s = [
        ...l.relatedContextCriteria ?? [],
        ...((n = l.relatedCriteria) == null ? void 0 : n.call(l)) ?? []
      ], c = Object.fromEntries(
        s.flatMap(
          (N) => Object.hasOwn(f, N.filterKey) ? [[N.filterKey, f[N.filterKey]]] : []
        )
      ), g = f.objectFilter && typeof f.objectFilter == "object" ? f.objectFilter : {};
      He(
        { ...c, ...g },
        s,
        r
      );
    }
  }
}
function An(e, t, r) {
  const [n, o] = A(/* @__PURE__ */ new Map()), d = JSON.stringify(e);
  return V(() => {
    if (!r) return;
    const l = /* @__PURE__ */ new Map();
    if (He(e, t, l), !l.size) return;
    let f = !0;
    return Promise.all(
      [...l.entries()].map(async ([u, p]) => {
        try {
          const s = await F(
            `/api/${p.entityType}/${p.id}`
          ), c = [
            s.name,
            s.title,
            s.label,
            s.basename
          ].find((g) => typeof g == "string" && g.trim());
          return [
            u,
            typeof c == "string" ? c : `Item ${p.id}`
          ];
        } catch {
          return [u, `Item ${p.id}`];
        }
      })
    ).then((u) => {
      f && o(new Map(u));
    }), () => {
      f = !1;
    };
  }, [t, r, e, d]), n;
}
function qn({
  objectFilter: e,
  overridden: t,
  disabled: r,
  onAdjustQueue: n,
  onApply: o,
  onReset: d
}) {
  const [l, f] = A(!1), [u, p] = A(!1), s = vt, c = An(e, s, l), g = wt(
    () => Tt(e, s, c),
    [s, c, e]
  ), N = g.length;
  return /* @__PURE__ */ h(
    "section",
    {
      className: "dq-filter-panel",
      "aria-label": "Queue filters and settings",
      children: [
        /* @__PURE__ */ h("div", { className: "dq-filter-toolbar", children: [
          /* @__PURE__ */ h(
            "button",
            {
              type: "button",
              className: "dq-filter-disclosure",
              "aria-expanded": l,
              onClick: () => f((w) => !w),
              children: [
                /* @__PURE__ */ i("span", { "aria-hidden": "true", children: "›" }),
                "Current filters",
                t && /* @__PURE__ */ i("em", { children: "Adjusted" })
              ]
            }
          ),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: r,
              onClick: n,
              children: "Adjust queue"
            }
          ),
          /* @__PURE__ */ h(
            "button",
            {
              type: "button",
              className: `dq-filter-button${N ? " active" : ""}`,
              "aria-label": N ? `Filters, ${N} active` : "Filters",
              disabled: r,
              onClick: () => p(!0),
              children: [
                /* @__PURE__ */ i(
                  "svg",
                  {
                    "aria-hidden": "true",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    children: /* @__PURE__ */ i("path", { d: "M3 4h18v3l-7 7v4l-4 3v-7L3 7V4z" })
                  }
                ),
                "Filters",
                N > 0 && /* @__PURE__ */ i("span", { "aria-hidden": "true", children: N })
              ]
            }
          )
        ] }),
        l && /* @__PURE__ */ h("div", { className: "dq-filter-panel-body", children: [
          N ? /* @__PURE__ */ i(
            "div",
            {
              className: `dq-current-filter-chips${r ? " dq-filter-chips-disabled" : ""}`,
              role: "region",
              "aria-label": "Current queue filters",
              "aria-disabled": r || void 0,
              inert: r ? !0 : void 0,
              children: g.map((w) => /* @__PURE__ */ h(
                "button",
                {
                  type: "button",
                  "aria-label": `Edit filter: ${w.label}`,
                  onClick: () => {
                    r || p(!0);
                  },
                  children: [
                    /* @__PURE__ */ h("strong", { children: [
                      w.label,
                      ":"
                    ] }),
                    " ",
                    w.value
                  ]
                },
                w.key
              ))
            }
          ) : /* @__PURE__ */ i("p", { children: "No video filters. All videos can enter the queue." }),
          /* @__PURE__ */ i("div", { className: "dq-filter-panel-actions", children: t && /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: r,
              onClick: d,
              children: "Reset filters to review defaults"
            }
          ) })
        ] }),
        u && /* @__PURE__ */ i("div", { onKeyDown: (w) => w.stopPropagation(), children: /* @__PURE__ */ i(
          dr,
          {
            open: !0,
            onClose: () => p(!1),
            criteria: vt,
            activeFilter: e,
            supportsFilterExpressions: !0,
            subjectLabel: "videos",
            onApply: (w) => {
              r || (o(w), p(!1));
            }
          }
        ) })
      ]
    }
  );
}
function nr({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: n = !0
}) {
  const [o, d] = A(!1), l = e.view.filter, f = (s) => t({
    ...e,
    view: { ...e.view, filter: { ...l, ...s } }
  }), u = e.presentation ?? {}, p = (s) => t({ ...e, presentation: { ...u, ...s } });
  return /* @__PURE__ */ h(de, { children: [
    n && /* @__PURE__ */ h("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ i("legend", { children: "Queue" }),
      /* @__PURE__ */ h("label", { children: [
        "Search",
        /* @__PURE__ */ i(
          "input",
          {
            value: String(l.q ?? ""),
            onChange: (s) => f({ q: s.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ h("div", { className: "dq-field-grid", children: [
        /* @__PURE__ */ h("label", { children: [
          "Sort",
          /* @__PURE__ */ h(
            "select",
            {
              "aria-label": "Sort",
              value: String(l.sort ?? "date"),
              onChange: (s) => f({ sort: s.target.value, sorts: void 0 }),
              children: [
                !Gt.some((s) => s.value === l.sort) && l.sort != null && /* @__PURE__ */ i("option", { value: String(l.sort), children: String(l.sort) }),
                Gt.map((s) => /* @__PURE__ */ i("option", { value: s.value, children: s.label }, s.value))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ h("label", { children: [
          "Direction",
          /* @__PURE__ */ h(
            "select",
            {
              "aria-label": "Direction",
              value: String(l.direction ?? "desc"),
              onChange: (s) => f({ direction: s.target.value }),
              children: [
                /* @__PURE__ */ i("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ i("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ h("label", { children: [
          "Videos per page",
          /* @__PURE__ */ i(
            "input",
            {
              type: "number",
              min: "1",
              max: "100",
              value: Number(l.perPage) || 40,
              onChange: (s) => f({
                perPage: Math.max(
                  1,
                  Math.min(100, Number(s.target.value) || 40)
                )
              })
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
      /* @__PURE__ */ h("p", { children: [
        Object.keys(e.view.objectFilter).length ? "Video filters configured" : "No video filters",
        ". Choose which videos enter the queue."
      ] }),
      o && /* @__PURE__ */ i("div", { onKeyDown: (s) => s.stopPropagation(), children: /* @__PURE__ */ i(
        dr,
        {
          open: !0,
          onClose: () => d(!1),
          criteria: vt,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: !0,
          subjectLabel: "videos",
          onApply: (s) => {
            t({ ...e, view: { ...e.view, objectFilter: s } }), d(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ h(de, { children: [
      /* @__PURE__ */ i("h3", { children: "Appearance" }),
      /* @__PURE__ */ i("p", { className: "dq-editor-note", children: "Choose how videos and tags appear while reviewing." }),
      /* @__PURE__ */ i("div", { className: "dq-field-grid", children: /* @__PURE__ */ h("label", { children: [
        "Preferred view",
        /* @__PURE__ */ i(
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
            children: ["grid", "wall"].map((s) => /* @__PURE__ */ i("option", { children: s }, s))
          }
        )
      ] }) }),
      /* @__PURE__ */ i("h4", { children: "Card annotations" }),
      /* @__PURE__ */ i("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((s) => {
        const c = u.annotations ?? [];
        return /* @__PURE__ */ h("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ i(
            "input",
            {
              type: "checkbox",
              checked: c.includes(s),
              onChange: (g) => p({
                annotations: g.target.checked ? [...c, s] : c.filter((N) => N !== s)
              })
            }
          ),
          s
        ] }, s);
      }) }),
      (u.annotations ?? []).includes("tags") && /* @__PURE__ */ h(de, { children: [
        /* @__PURE__ */ i("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
        /* @__PURE__ */ i(
          St,
          {
            entityType: "tag",
            values: u.annotationParents ?? [],
            placeholder: "Search annotation parent tags...",
            onChange: (s) => p({ annotationParents: s }),
            allowCreate: !1
          }
        )
      ] }),
      /* @__PURE__ */ i("h4", { children: "Tag bins" }),
      /* @__PURE__ */ i("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
      /* @__PURE__ */ i(
        St,
        {
          entityType: "tag",
          values: u.binParents ?? [],
          placeholder: "Search tag-bin parent tags...",
          onChange: (s) => p({ binParents: s }),
          allowCreate: !1
        }
      )
    ] })
  ] });
}
const mt = 180, yt = 115, ir = 380;
function or(e) {
  return e.view.displayMode === "wall" ? "wall" : "grid";
}
function Rn(e) {
  return e === "wall" ? "wall" : "grid";
}
function $n() {
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
function On(e) {
  return me({ ...e, page: 1 });
}
function rt(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((l, f) => rt(l, t[f]));
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  const r = e, n = t, o = Object.keys(r).sort(), d = Object.keys(n).sort();
  return o.length === d.length && o.every(
    (l, f) => l === d[f] && rt(r[l], n[l])
  );
}
function In(e, t) {
  if (t === 0) return "Showing 0 of 0";
  const r = Number(e.perPage) || 40, n = Math.max(1, Math.ceil(t / r)), o = Math.min(Math.max(1, Number(e.page) || 1), n), d = (o - 1) * r + 1, l = Math.min(o * r, t);
  return `Showing ${d.toLocaleString()}-${l.toLocaleString()} of ${t.toLocaleString()}`;
}
function Nr(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Y(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
function Tn({
  onNavigate: e
}) {
  const [t, r] = A([]), [n] = A(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [o, d] = A(""), [l, f] = A(!0), [u, p] = A(""), [s, c] = A(!1), [g, N] = A(!0), [w, E] = A(""), [I, R] = A(""), [C, y] = A(!1), [q, O] = A(!1), [b, M] = A($n), [J, _] = A(!1), [se, ie] = A(!1), [ae, kt] = A(!1), [Q, be] = A(
    null
  ), T = t.find((a) => a.id === b) ?? null, S = wt(
    () => (Q == null ? void 0 : Q.id) === b && T ? { ...T, view: Q.view } : T,
    [Q, b, T]
  ), Er = !!(S && T && !rt(
    S.view.objectFilter,
    T.view.objectFilter
  )), je = bn(S), [P, Ae] = A({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Cr, Ar] = A({
    page: 1,
    perPage: 40
  }), [ee, Lt] = A({ items: [], totalCount: 0 }), [k, _e] = A(!1), [oe, xt] = A(""), [le, ue] = A(() => /* @__PURE__ */ new Set()), it = D(le);
  it.current = le;
  const we = D(/* @__PURE__ */ new Map()), [G, te] = A(null), H = D(G);
  H.current = G;
  const [re, ve] = A(!1), ce = D(re);
  ce.current = re;
  const Mt = D(null), [qe, ot] = A("grid"), [fe, Pt] = A(mt), [U, st] = A(!1), De = D(!1), [qr, at] = A(""), [jt, Re] = A(""), [lt, $e] = A(""), [j, _t] = A(null), [Dt, Fe] = A(""), [Ue, Ke] = A(!1), ct = D(/* @__PURE__ */ new Map()), Ft = D(null), Se = D(0), Je = D(0), ze = D(null), Ut = he(async () => {
    f(!0), p("");
    try {
      const a = await tn();
      r(a.reviews), d(a.storageKey), c(a.canWrite), N(a.canConfigure ?? !0), E(a.storageNotice ?? ""), b && !a.reviews.some((m) => m.id === b) && (M(""), sr(""));
    } catch (a) {
      p(
        a instanceof Error ? a.message : "Could not load reviews."
      );
    } finally {
      f(!1);
    }
  }, [b]);
  V(() => {
    Ut();
  }, []);
  const Be = he(async () => {
    Fe("");
    try {
      _t(await It());
    } catch (a) {
      _t(null), Fe(
        "Tag assessment setup could not be checked. " + (a instanceof Error ? a.message : "Request failed.")
      );
    }
  }, []);
  V(() => {
    Be();
  }, [Be]);
  const pe = he(
    async (a, m) => {
      var K;
      const v = ++Se.current;
      (K = ze.current) == null || K.abort();
      const $ = new AbortController();
      ze.current = $, m = me(m), Ae(m), _e(!0), xt("");
      try {
        let x = await er(
          a,
          m,
          $.signal
        );
        const ne = Math.max(
          1,
          Math.ceil(x.totalCount / Number(m.perPage))
        );
        return Number(m.page) > ne && (m = { ...m, page: ne }, x = await er(
          a,
          m,
          $.signal
        )), v === Se.current && (Lt(x), Ae(m), Ar(m)), x;
      } catch (x) {
        throw v === Se.current && xt(
          x instanceof Error ? x.message : "Could not load the review queue."
        ), x;
      } finally {
        v === Se.current && _e(!1);
      }
    },
    []
  );
  V(() => {
    var m;
    if (Je.current += 1, Se.current += 1, (m = ze.current) == null || m.abort(), O(!1), R(""), y(!1), ue(/* @__PURE__ */ new Set()), we.current.clear(), te(null), ve(!1), st(!1), De.current = !1, at(""), Re(""), $e(""), Lt({ items: [], totalCount: 0 }), !S) {
      _e(!1);
      return;
    }
    let a = !0;
    return _e(!0), (async () => {
      let v = null;
      try {
        v = await on(o, S.id);
      } catch (x) {
        a && (y(!0), R(
          x instanceof Error ? x.message : "Could not load progress."
        ));
      }
      if (!a) return;
      const $ = (v == null ? void 0 : v.signature) === Ne(S) ? v : null, K = $ ? me($.filter) : On(S.view.filter);
      Ae(K), ot(
        $ ? Rn($.displayMode) : or(S)
      ), Pt(
        $ ? $.cardSize ?? mt : mt
      );
      try {
        const x = await pe(S, K);
        if (!a) return;
        const ne = Xt(
          x.items.map((W) => W.id),
          ($ == null ? void 0 : $.focusedId) ?? null,
          ($ == null ? void 0 : $.index) ?? 0
        );
        te(ne), z(ne);
      } catch {
      }
      a && O(!0);
    })(), () => {
      var v;
      a = !1, Je.current++, Se.current++, (v = ze.current) == null || v.abort();
    };
  }, [S == null ? void 0 : S.id]);
  const L = wt(
    () => ee.items.map((a) => a.id),
    [ee.items]
  );
  V(() => {
    if (!q || !S || !o || k || oe || U || (Q == null ? void 0 : Q.id) === S.id || C)
      return;
    const a = {
      version: 1,
      signature: Ne(S),
      filter: P,
      focusedId: G,
      index: Math.max(0, L.indexOf(G ?? -1)),
      displayMode: qe,
      cardSize: fe,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        o + ":progress:" + S.id,
        JSON.stringify(a)
      );
    } catch {
    }
    if (I) return;
    let m = !0;
    const v = window.setTimeout(() => {
      sn(o, S.id, a).catch(($) => {
        m && R(
          "Progress is kept in this browser, but account sync failed. " + ($ instanceof Error ? $.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      m = !1, window.clearTimeout(v);
    };
  }, [
    q,
    o,
    S,
    k,
    oe,
    U,
    P,
    G,
    L,
    qe,
    fe,
    Q,
    I,
    C
  ]);
  const dt = ee.items.find((a) => a.id === G) ?? null;
  re && dt && (Mt.current = dt);
  const ge = dt ?? (re ? Mt.current : null), Rr = Yt(le, G), Kt = le.size > 0 ? `${le.size} selected video${le.size === 1 ? "" : "s"}` : G == null ? "no video" : "focused video", z = he((a, m = !0) => {
    a != null && window.requestAnimationFrame(() => {
      const v = ct.current.get(a);
      v == null || v.focus({ preventScroll: !0 }), m && (v == null || v.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  V(() => {
    q && !ce.current && z(H.current);
  }, [q, z]), V(() => {
    k || !L.length || (H.current == null || !L.includes(H.current)) && (te(L[0]), ce.current || z(L[0]));
  }, [z, L, k]);
  const Oe = he(
    (a) => {
      ue((m) => {
        const v = a(m);
        for (const $ of /* @__PURE__ */ new Set([...m, ...v]))
          m.has($) !== v.has($) && we.current.set(
            $,
            (we.current.get($) ?? 0) + 1
          );
        return v;
      });
    },
    []
  ), ut = he(
    (a) => {
      if (!L.length) return;
      const m = Math.max(
        0,
        L.indexOf(H.current ?? L[0])
      ), v = L[Math.max(0, Math.min(L.length - 1, m + a))];
      te(v), ce.current || z(v);
    },
    [z, L]
  ), ft = he(
    async (a) => {
      const m = Yt(
        it.current,
        H.current
      );
      if (!S || De.current || k || oe || !s || We(a) && (j == null ? void 0 : j.kind) !== "ready" || !m.length)
        return;
      const v = ++Je.current, $ = S.id, K = [...L], x = H.current, ne = new Map(
        m.map((B) => [B, we.current.get(B) ?? 0])
      ), W = () => v === Je.current && S.id === $;
      De.current = !0, st(!0), at(
        it.current.size ? `${m.length} selected videos` : "the focused video"
      ), Re(""), $e("");
      let Te = !1;
      try {
        if (await yn(a, m), Te = !0, !W()) return;
        ue((B) => {
          const X = new Set(B);
          for (const Z of m)
            (we.current.get(Z) ?? 0) === ne.get(Z) && X.delete(Z);
          return X;
        }), Re(
          `${a.label}: ${m.length} video${m.length === 1 ? "" : "s"} ${a.steps.length ? "updated" : "skipped"}.`
        );
      } catch (B) {
        if (!W()) return;
        $e(
          B instanceof Error ? B.message : "Action failed."
        );
      }
      try {
        if (await un(a), !W()) return;
        const B = await pe(S, P);
        if (!W()) return;
        let X = B.items.map((Z) => Z.id);
        if (!X.length && B.totalCount > 0 && Number(P.page) > 1) {
          const Z = Math.max(1, Number(P.page) - 1), Ve = { ...P, page: Z };
          Ae(Ve), X = (await pe(S, Ve)).items.map((gt) => gt.id), ue(
            (gt) => new Set([...gt].filter((kr) => X.includes(kr)))
          );
          const Qt = X.at(-1) ?? null;
          te(Qt), ce.current || z(Qt);
        } else {
          ue(
            (Ve) => new Set([...Ve].filter((Vt) => X.includes(Vt)))
          );
          const Z = Hr(
            K,
            X,
            x,
            Te && m.includes(x ?? -1)
          );
          te(Z), ce.current && Z == null && ve(!1), ce.current || z(Z);
        }
      } catch (B) {
        W() && $e(
          (X) => `${X ? `${X} ` : ""}${Te ? "The action completed, but " : ""}the queue could not be refreshed. ${B instanceof Error ? B.message : "Refresh failed."}`
        );
      } finally {
        W() && (De.current = !1, st(!1), at(""));
      }
    },
    [
      s,
      j,
      pe,
      P,
      z,
      L,
      k,
      oe,
      S
    ]
  );
  function $r() {
    var v;
    const a = (v = Ft.current) == null ? void 0 : v.firstElementChild, m = a ? getComputedStyle(a).gridTemplateColumns : "";
    return Math.max(1, m.split(" ").filter(Boolean).length);
  }
  function Or(a) {
    if (a.defaultPrevented || a.repeat || a.ctrlKey || a.altKey || a.metaKey || J || ae) return;
    if (re && a.key === "Escape") {
      Y(a), ve(!1), z(H.current);
      return;
    }
    if (!Xr(a.target)) return;
    if (a.key === "Escape") {
      Y(a), Oe(() => /* @__PURE__ */ new Set());
      return;
    }
    const m = (S == null ? void 0 : S.actions.findIndex(
      (K, x) => Le(K, x) === a.key
    )) ?? -1;
    if (m >= 0 && (S != null && S.actions[m])) {
      Y(a), !U && !k && ft(S.actions[m]);
      return;
    }
    if (!re && a.key === " ") {
      Y(a), G != null && Oe((K) => bt(K, G));
      return;
    }
    if (!re && a.key.toLowerCase() === "a") {
      Y(a), Oe(
        (K) => Wr(K, L)
      );
      return;
    }
    if (U || k || re) return;
    if (a.key === "Enter" && G != null) {
      Y(a), ve(!0);
      return;
    }
    const v = $r(), $ = a.key === "ArrowLeft" ? -1 : a.key === "ArrowRight" ? 1 : a.key === "ArrowUp" ? -v : a.key === "ArrowDown" ? v : 0;
    $ && (Y(a), ut($));
  }
  function pt(a) {
    M(a), sr(a);
  }
  async function Jt(a) {
    if (!o) return !1;
    const m = a.map(Ln);
    try {
      await nn(o, m);
    } catch ($) {
      throw $;
    }
    r(m), b && !m.some(($) => $.id === b) && pt("");
    const v = m.find(($) => $.id === b);
    return v && T && JSON.stringify(v) !== JSON.stringify(T) && (v.view.displayMode !== T.view.displayMode && ot(or(v)), Ne(v) !== Ne(T) && (be(null), Ie(
      v,
      me({ ...v.view.filter, page: P.page })
    ))), !0;
  }
  if (l)
    return /* @__PURE__ */ i(lr, { label: "Loading Data Quality reviews…" });
  if (u)
    return /* @__PURE__ */ h(de, { children: [
      /* @__PURE__ */ i(
        "button",
        {
          className: "dq-button",
          onClick: () => void Dn().catch(
            (a) => p(
              "Could not export browser reviews. " + (a instanceof Error ? a.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ i(
        cr,
        {
          message: u,
          onRetry: () => void Ut()
        }
      )
    ] });
  return /* @__PURE__ */ h("div", { className: "data-quality-page", onKeyDown: Or, children: [
    /* @__PURE__ */ h("header", { className: "data-quality-header", children: [
      /* @__PURE__ */ h("div", { children: [
        /* @__PURE__ */ i("h1", { children: "Data Quality" }),
        /* @__PURE__ */ i("p", { children: "A focused queue for previewing videos and applying saved review actions." })
      ] }),
      /* @__PURE__ */ h(
        "button",
        {
          className: "dq-button",
          type: "button",
          disabled: U || k || !g,
          onClick: () => {
            ie(!1), _(!0);
          },
          children: [
            /* @__PURE__ */ i(ur, {}),
            " Manage reviews"
          ]
        }
      )
    ] }),
    w && /* @__PURE__ */ i("p", { className: "dq-status", children: w }),
    (j == null ? void 0 : j.kind) === "missing" && /* @__PURE__ */ h("div", { role: "status", className: "dq-status", children: [
      j.message,
      " ",
      /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          disabled: Ue,
          onClick: () => {
            Ke(!0), Fe(""), pn().then(Be).catch(
              (a) => Fe(
                "Could not create the Confirmed absent tags custom field. " + (a instanceof Error ? a.message : "Request failed.")
              )
            ).finally(() => Ke(!1));
          },
          children: Ue ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    ((j == null ? void 0 : j.kind) === "incompatible" || Dt) && /* @__PURE__ */ h("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ i(Nt, {}),
      Dt || (j == null ? void 0 : j.message),
      /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          disabled: Ue,
          onClick: () => {
            Ke(!0), Be().finally(
              () => Ke(!1)
            );
          },
          children: Ue ? "Checking…" : "Check again"
        }
      )
    ] }),
    n && /* @__PURE__ */ h("details", { children: [
      /* @__PURE__ */ i("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ i("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ i(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const a = localStorage.getItem("page-videos") ?? "[]", m = URL.createObjectURL(
              new Blob([a], { type: "application/json" })
            ), v = document.createElement("a");
            v.href = m, v.download = "data-quality-unassigned-legacy-reviews.json", v.click(), URL.revokeObjectURL(m);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    I && /* @__PURE__ */ h("p", { role: "alert", children: [
      I,
      " ",
      /* @__PURE__ */ i(
        "button",
        {
          type: "button",
          onClick: () => {
            R(""), y(!1);
          },
          children: C ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    /* @__PURE__ */ h("section", { className: "dq-toolbar", children: [
      /* @__PURE__ */ h("label", { className: "dq-review-select", children: [
        "Review",
        /* @__PURE__ */ h(
          "select",
          {
            value: (S == null ? void 0 : S.id) ?? "",
            disabled: U,
            onChange: (a) => pt(a.target.value),
            children: [
              /* @__PURE__ */ i("option", { value: "", children: "Choose a review…" }),
              t.map((a) => /* @__PURE__ */ i("option", { value: a.id, children: a.name }, a.id))
            ]
          }
        )
      ] }),
      S && /* @__PURE__ */ i("span", { className: "dq-range-count", children: In(Cr, ee.totalCount) }),
      S && /* @__PURE__ */ h(de, { children: [
        /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: U || k || !g,
            onClick: () => {
              ie(!0), _(!0);
            },
            children: "Edit review"
          }
        ),
        (Q == null ? void 0 : Q.id) === b && /* @__PURE__ */ h(de, { children: [
          /* @__PURE__ */ i("span", { children: "Temporary queue" }),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: U || k || !g,
              onClick: () => {
                T && Jt(
                  t.map(
                    (a) => a.id === b ? {
                      ...a,
                      view: {
                        ...S.view,
                        filter: { ...P, page: 1 }
                      }
                    } : a
                  )
                ).then(() => {
                  be(null), Re("Queue saved to this review.");
                }).catch(
                  (a) => $e(
                    a instanceof Error ? a.message : "Could not save queue."
                  )
                );
              },
              children: "Save queue to review"
            }
          ),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: U || k,
              onClick: () => {
                be(null), T && Ie(
                  T,
                  me({
                    ...T.view.filter,
                    page: P.page
                  })
                );
              },
              children: "Reset to saved queue"
            }
          )
        ] }),
        /* @__PURE__ */ i("div", { className: "dq-review-description", children: S.description && /* @__PURE__ */ i("p", { children: S.description }) }),
        /* @__PURE__ */ i(
          "div",
          {
            className: "dq-view-switch flex min-h-10 items-center gap-0.5 rounded-lg border border-border bg-card/70 px-1.5 py-1 shadow-sm sm:min-h-0",
            role: "group",
            "aria-label": "Review view",
            children: [
              { mode: "grid", label: "Grid", Icon: _r },
              { mode: "wall", label: "Wall", Icon: Dr }
            ].map(({ mode: a, label: m, Icon: v }) => /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                className: `inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-transparent p-2 text-secondary hover:bg-card/80 hover:text-foreground focus:border-accent focus:outline-none sm:min-h-0 sm:min-w-0 sm:p-1.5 ${qe === a ? "bg-background/60 text-accent shadow-sm" : ""}`,
                "aria-label": m,
                title: m,
                "aria-pressed": qe === a,
                onClick: () => ot(a),
                children: /* @__PURE__ */ i(v, { className: "h-3.5 w-3.5" })
              },
              a
            ))
          }
        ),
        /* @__PURE__ */ h("div", { className: "hidden items-center gap-1 pl-1 md:flex", children: [
          /* @__PURE__ */ i(Fr, { className: "h-3 w-3 text-muted" }),
          /* @__PURE__ */ i(
            "input",
            {
              "aria-label": `Card size: ${fe}px`,
              title: `Card size: ${fe}px`,
              type: "range",
              min: yt,
              max: ir,
              step: "5",
              className: "themed-range-input h-1 w-16 cursor-pointer sm:w-20",
              value: fe,
              style: {
                "--range-fill": `${(fe - yt) / (ir - yt) * 100}%`
              },
              onChange: (a) => Pt(Number(a.target.value))
            }
          ),
          /* @__PURE__ */ i(Ur, { className: "h-3 w-3 text-muted" })
        ] })
      ] })
    ] }),
    S && T && /* @__PURE__ */ i(
      qn,
      {
        objectFilter: S.view.objectFilter,
        overridden: Er,
        disabled: U || k,
        onAdjustQueue: () => kt(!0),
        onApply: zt,
        onReset: () => zt(T.view.objectFilter)
      }
    ),
    S ? /* @__PURE__ */ h(de, { children: [
      je.error && /* @__PURE__ */ i("p", { role: "alert", children: je.error }),
      /* @__PURE__ */ i(
        vn,
        {
          videos: ee.items,
          review: S,
          trees: je.ids,
          disabled: U || k,
          onChoose: (a) => {
            const m = Sn(S, a);
            be(m), Ie(m, { ...P, page: 1 });
          }
        }
      ),
      lt && !re && /* @__PURE__ */ h("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ i(Nt, {}),
        lt
      ] }),
      jt && /* @__PURE__ */ i("p", { role: "status", className: "dq-status", children: jt }),
      /* @__PURE__ */ h("div", { className: "dq-workspace", children: [
        /* @__PURE__ */ h("main", { children: [
          Bt("top"),
          k && !ee.items.length && /* @__PURE__ */ i(lr, { label: "Loading review queue…" }),
          oe && !k && /* @__PURE__ */ i(
            cr,
            {
              message: oe,
              onRetry: () => void pe(S, P).catch(() => {
              })
            }
          ),
          !k && !oe && !ee.items.length && /* @__PURE__ */ h("div", { className: "dq-empty", children: [
            /* @__PURE__ */ i(Wt, {}),
            /* @__PURE__ */ i("p", { children: "No videos match this review." })
          ] }),
          !!ee.items.length && /* @__PURE__ */ i("div", { ref: Ft, children: /* @__PURE__ */ i(
            "div",
            {
              className: "dq-grid",
              style: {
                "--dq-card-width": `${fe}px`
              },
              children: ee.items.map(Tr)
            }
          ) }),
          Bt("bottom")
        ] }),
        /* @__PURE__ */ h("aside", { className: "dq-actions", children: [
          /* @__PURE__ */ i("strong", { children: Kt }),
          S.actions.map((a, m) => /* @__PURE__ */ h(
            "button",
            {
              type: "button",
              disabled: U || k || !!oe || !s || We(a) && (j == null ? void 0 : j.kind) !== "ready" || !Rr.length,
              onClick: () => void ft(a),
              children: [
                Le(a, m) && /* @__PURE__ */ i("kbd", { children: Le(a, m) }),
                /* @__PURE__ */ i("span", { children: a.label }),
                /* @__PURE__ */ i("small", { children: a.steps.length ? `${a.steps.length} step(s)` : "Skip" })
              ]
            },
            a.id
          )),
          !S.actions.length && /* @__PURE__ */ i("p", { children: "This review has no actions." }),
          !s && /* @__PURE__ */ i("p", { children: "Video write permission is required to apply actions." }),
          U && /* @__PURE__ */ h("p", { role: "status", children: [
            /* @__PURE__ */ i(fr, { className: "dq-spin" }),
            " Applying action to",
            " ",
            qr,
            "…"
          ] }),
          /* @__PURE__ */ i("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ h("div", { className: "dq-empty", children: [
      /* @__PURE__ */ i(Wt, {}),
      /* @__PURE__ */ i("p", { children: t.length ? "Choose a saved review to open its queue." : "No saved reviews are available in this browser." })
    ] }),
    re && ge && S && /* @__PURE__ */ i(
      Pn,
      {
        video: ge,
        review: S,
        targetLabel: Kt,
        pending: U,
        refreshing: k || !!oe,
        error: lt,
        canWrite: s,
        assessmentReady: (j == null ? void 0 : j.kind) === "ready",
        selected: le.has(ge.id),
        hasPrevious: L.indexOf(ge.id) > 0,
        hasNext: L.indexOf(ge.id) >= 0 && L.indexOf(ge.id) < L.length - 1,
        onToggleSelected: () => Oe((a) => bt(a, ge.id)),
        onPrevious: () => ut(-1),
        onNext: () => ut(1),
        onClose: () => {
          ve(!1), z(H.current);
        },
        onAction: ft
      }
    ),
    ae && S && /* @__PURE__ */ i(
      ar,
      {
        reviews: t,
        activeReview: { ...S, view: { ...S.view, filter: P } },
        initialEdit: !0,
        temporary: !0,
        onSave: (a) => {
          const m = a.find((v) => v.id === b);
          return be(m), Ie(
            m,
            me({ ...m.view.filter, page: P.page })
          ), !0;
        },
        onChoose: () => {
        },
        onClose: () => {
          kt(!1), z(H.current, !1);
        }
      }
    ),
    J && /* @__PURE__ */ i(
      ar,
      {
        reviews: t,
        activeReview: T,
        initialEdit: se,
        onSave: Jt,
        onChoose: pt,
        onClose: () => {
          _(!1), se && z(H.current, !1);
        }
      }
    )
  ] });
  async function Ie(a, m) {
    const v = H.current, $ = Math.max(0, L.indexOf(v ?? -1));
    try {
      const x = (await pe(a, m)).items.map((W) => W.id);
      ue(
        (W) => new Set([...W].filter((Te) => x.includes(Te)))
      );
      const ne = Xt(x, v, $);
      te(ne), ce.current || z(ne, !1);
    } catch {
    }
  }
  function zt(a) {
    if (U || k || !S || !T) return;
    const m = rt(
      a,
      T.view.objectFilter
    ), v = {
      ...S,
      view: {
        ...S.view,
        objectFilter: m ? T.view.objectFilter : a
      }
    }, $ = Ne(v) !== Ne(T), K = $ ? v : T;
    be($ ? v : null), Re(
      m ? "Review filter defaults restored." : "Queue filters adjusted for this session."
    ), Ie(K, { ...P, page: 1 });
  }
  function Ir() {
    ue(/* @__PURE__ */ new Set()), we.current.clear(), te(null);
  }
  function Bt(a) {
    return S ? /* @__PURE__ */ i(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: U || k,
        "aria-label": `Review queue pagination ${a}`,
        children: /* @__PURE__ */ i(
          xr,
          {
            filter: {
              ...P,
              page: Number(P.page) || 1,
              perPage: Number(P.perPage) || 40
            },
            totalCount: ee.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${a}`,
            onFilterChange: (m) => {
              U || k || m.page === Number(P.page) || kn(
                { ...P, page: m.page },
                S,
                Ae,
                pe,
                Ir
              );
            }
          }
        )
      }
    ) : null;
  }
  function Tr(a) {
    return /* @__PURE__ */ i(
      xn,
      {
        video: wn(a, S, je.ids),
        displayMode: qe,
        focused: a.id === G,
        selected: le.has(a.id),
        setRef: (m) => {
          m ? ct.current.set(a.id, m) : ct.current.delete(a.id);
        },
        onFocus: () => te(a.id),
        onToggle: () => Oe((m) => bt(m, a.id)),
        onPreview: () => {
          te(a.id), ve(!0);
        },
        onNavigate: e
      },
      a.id
    );
  }
}
function kn(e, t, r, n, o) {
  r(e), o(), n(t, e).catch(() => {
  });
}
function bt(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Ln(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function xn({
  video: e,
  displayMode: t,
  focused: r,
  selected: n,
  setRef: o,
  onFocus: d,
  onToggle: l,
  onPreview: f,
  onNavigate: u
}) {
  const p = Nr(e), s = D(null), c = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, g = !!(c.date || c.studioName), N = !!(c.performers.length || c.tags.length);
  return Lr(() => {
    const w = s.current;
    if (!w) return;
    const E = w.querySelector(
      `a[href="/video/${e.id}"]`
    ), I = w.querySelector(".card-title"), R = `dq-card-title-${e.id}`;
    I && (I.id = R), E && (E.target = "_blank", E.rel = "noreferrer", E.removeAttribute("aria-label"), E.setAttribute("aria-labelledby", R), E.classList.add("dq-card-link"));
    const C = w.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    C && C.setAttribute(
      "aria-label",
      n ? `Deselect ${p}` : `Select ${p}`
    );
    const y = w.querySelector(
      'button[title="Quick View"]'
    );
    y && y.setAttribute("aria-label", `Preview ${p}`);
  }), /* @__PURE__ */ h(
    "article",
    {
      ref: (w) => {
        s.current = w, o(w);
      },
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${p}${n ? ", selected" : ""}`,
      onFocus: d,
      onClick: (w) => {
        d(), w.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${t} ${g ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${n ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ i(
          Pr,
          {
            video: c,
            selected: n,
            onSelect: l,
            onNavigate: u,
            onQuickView: f,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t === "wall" && /* @__PURE__ */ i(Mn, { video: e })
      ]
    }
  );
}
function Mn({ video: e }) {
  const t = D(null), r = D(null), [n, o] = A(!1), [d, l] = A(!1), [f, u] = A(!1);
  return V(() => {
    const p = t.current;
    if (!p || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), l(!0);
      return;
    }
    const s = new IntersectionObserver(
      ([g]) => o(g.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), c = new IntersectionObserver(
      ([g]) => l(g.isIntersecting && g.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return s.observe(p), c.observe(p), () => {
      s.disconnect(), c.disconnect();
    };
  }, [e.id, e.files.length]), V(() => {
    if (!n) {
      u(!1);
      return;
    }
    const p = new AbortController();
    return F(dn(e.id), {
      signal: p.signal
    }).then((s) => {
      p.signal.aborted || u(s.available === !0);
    }).catch(() => {
      p.signal.aborted || u(!1);
    }), () => p.abort();
  }, [n, e.id]), V(() => {
    const p = r.current;
    p && (d ? Promise.resolve(p.play()).catch(() => {
    }) : p.pause());
  }, [f, d]), /* @__PURE__ */ i("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: f && /* @__PURE__ */ i(
    "video",
    {
      ref: r,
      src: cn(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Pn({
  video: e,
  review: t,
  targetLabel: r,
  pending: n,
  refreshing: o,
  error: d,
  canWrite: l,
  assessmentReady: f,
  selected: u,
  hasPrevious: p,
  hasNext: s,
  onToggleSelected: c,
  onPrevious: g,
  onNext: N,
  onClose: w,
  onAction: E
}) {
  const I = D(null), R = D(null), C = e.files[0], y = Nr(e);
  V(() => {
    var M;
    const b = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (M = I.current) == null || M.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = b;
    };
  }, []);
  function q(b) {
    var _, se, ie;
    if (b.key !== "Tab") return;
    const M = [
      ...((_ = I.current) == null ? void 0 : _.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ae) => ae.offsetParent !== null);
    if (!M.length) {
      b.preventDefault(), (se = I.current) == null || se.focus();
      return;
    }
    const J = M.indexOf(
      document.activeElement
    );
    b.shiftKey && J <= 0 ? (b.preventDefault(), (ie = M.at(-1)) == null || ie.focus()) : !b.shiftKey && J === M.length - 1 && (b.preventDefault(), M[0].focus());
  }
  function O(b) {
    if (b.defaultPrevented || b.ctrlKey || b.metaKey || b.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const M = b.key === "ArrowLeft" || b.key === "ArrowRight";
    if (b.altKey && !M) return;
    const J = R.current, _ = b.currentTarget.querySelector("video");
    if (b.key === "Enter" || b.key === "Escape")
      b.repeat || w();
    else if (b.key === " " && J)
      b.repeat || J.toggle();
    else if (M && J)
      J.seekBy(
        (b.key === "ArrowLeft" ? -1 : 1) * (b.shiftKey ? 5 : b.altKey ? 10 : 60)
      );
    else if ((b.key === "," || b.key === ".") && J) {
      const se = [C == null ? void 0 : C.duration, _ == null ? void 0 : _.duration].find(
        (ae) => ae != null && Number.isFinite(ae) && ae > 0
      ) ?? 0, ie = e.parentVideoId != null ? (e.clipEndSec ?? se) - (e.clipStartSec ?? 0) : se;
      Number.isFinite(ie) && ie > 0 && J.seekBy((b.key === "," ? -1 : 1) * ie * 0.1);
    } else if (b.key.toLowerCase() === "n" || b.key.toLowerCase() === "m")
      !b.repeat && !n && !o && (b.key.toLowerCase() === "n" && p && g(), b.key.toLowerCase() === "m" && s && N());
    else if (b.key === "ArrowUp" && _)
      _.volume = Math.min(1, _.volume + 0.1);
    else if (b.key === "ArrowDown" && _)
      _.volume = Math.max(0, _.volume - 0.1);
    else return;
    Y(b);
  }
  return /* @__PURE__ */ i(
    "div",
    {
      ref: I,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${y}`,
      className: "dq-preview",
      onKeyDown: q,
      onKeyDownCapture: O,
      onMouseDown: (b) => {
        b.target === b.currentTarget && w();
      },
      children: /* @__PURE__ */ h("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ h("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !p || n || o,
              onClick: g,
              children: /* @__PURE__ */ i(Kr, {})
            }
          ),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !s || n || o,
              onClick: N,
              children: /* @__PURE__ */ i(Jr, {})
            }
          ),
          /* @__PURE__ */ h("div", { children: [
            /* @__PURE__ */ i("h2", { children: y }),
            /* @__PURE__ */ h("p", { children: [
              "Actions target ",
              r,
              "."
            ] })
          ] }),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              onClick: c,
              disabled: o,
              children: u ? "Selected" : "Select"
            }
          ),
          /* @__PURE__ */ i(
            "a",
            {
              href: `/video/${e.id}`,
              target: "_blank",
              rel: "noreferrer",
              className: "dq-details-link",
              "aria-label": `Open ${y} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ i(zr, {})
            }
          ),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              onClick: w,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ i(pr, {})
            }
          )
        ] }),
        /* @__PURE__ */ i("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: C ? /* @__PURE__ */ i(
          Mr,
          {
            autostart: !0,
            streamUrl: ln(e.id),
            posterUrl: tr(e),
            format: C.format,
            audioCodec: C.audioCodec,
            duration: C.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (b) => (R.current = b, () => {
              R.current === b && (R.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ i("img", { src: tr(e), alt: "" }) }),
        d && /* @__PURE__ */ i("p", { role: "alert", className: "dq-alert", children: d }),
        /* @__PURE__ */ i("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ i("footer", { "data-review-player-controls": !0, children: t.actions.map((b, M) => /* @__PURE__ */ h(
          "button",
          {
            type: "button",
            disabled: n || o || !l || We(b) && !f,
            onClick: () => void E(b),
            children: [
              Le(b, M) && /* @__PURE__ */ i("kbd", { children: Le(b, M) }),
              b.label
            ]
          },
          b.id
        )) })
      ] })
    }
  );
}
function ar({
  reviews: e,
  activeReview: t,
  initialEdit: r = !1,
  temporary: n = !1,
  onSave: o,
  onChoose: d,
  onClose: l
}) {
  const [f, u] = A(
    () => r && t ? structuredClone(t) : null
  ), [p, s] = A(""), [c, g] = A(!1), N = D(null);
  V(() => {
    var O, b;
    const y = document.activeElement, q = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (b = (O = N.current) == null ? void 0 : O.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || b.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = q, y == null || y.focus({ preventScroll: !0 });
    };
  }, []);
  function w(y) {
    var b, M, J;
    if (y.defaultPrevented) {
      y.stopPropagation();
      return;
    }
    if (y.key === "Escape") {
      Y(y), c || l();
      return;
    }
    if (y.key !== "Tab") {
      y.stopPropagation();
      return;
    }
    const q = [
      ...((b = N.current) == null ? void 0 : b.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((_) => _.offsetParent !== null);
    if (!q.length) {
      Y(y), (M = N.current) == null || M.focus();
      return;
    }
    const O = q.indexOf(
      document.activeElement
    );
    y.shiftKey && O <= 0 ? (Y(y), (J = q.at(-1)) == null || J.focus()) : !y.shiftKey && O === q.length - 1 ? (Y(y), q[0].focus()) : y.stopPropagation();
  }
  function E(y) {
    u(
      y ? structuredClone(y) : {
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
    ), s("");
  }
  async function I() {
    if (c) return;
    if (!f || Et(f)) {
      s(f ? Et(f) : "Choose a review.");
      return;
    }
    const y = { ...f, name: f.name.trim() }, q = e.some((O) => O.id === y.id) ? e.map((O) => O.id === y.id ? y : O) : [...e, y];
    g(!0), s("");
    try {
      if (!await o(q)) throw new Error("Could not save reviews.");
      d(y.id), l();
    } catch (O) {
      s(
        "Could not save reviews. Your edits are still open. " + (O instanceof Error ? O.message : "Retry saving.")
      );
    } finally {
      g(!1);
    }
  }
  async function R(y) {
    if (!c) {
      g(!0), s("");
      try {
        if (!await o(y)) throw new Error("Could not save reviews.");
      } catch (q) {
        s(
          q instanceof Error ? q.message : "Could not save reviews."
        );
      } finally {
        g(!1);
      }
    }
  }
  async function C(y) {
    var O;
    if (c) return;
    const q = (O = y.target.files) == null ? void 0 : O[0];
    if (y.target.value = "", !!q) {
      if (q.size > 2e6) {
        s("Review files must be smaller than 2 MB.");
        return;
      }
      g(!0), s("");
      try {
        const b = xe(await q.text());
        if (!await o(Ct(e, b)))
          throw new Error("Could not save reviews.");
      } catch (b) {
        s(
          b instanceof Error ? b.message : "Could not import reviews."
        );
      } finally {
        g(!1);
      }
    }
  }
  return /* @__PURE__ */ i(
    "div",
    {
      ref: N,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: w,
      children: /* @__PURE__ */ h("div", { className: "dq-manager", children: [
        /* @__PURE__ */ h("header", { children: [
          /* @__PURE__ */ h("div", { children: [
            /* @__PURE__ */ i("h2", { children: n ? "Adjust queue temporarily" : f ? e.some((y) => y.id === f.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ i("p", { children: n ? "Apply changes for this session. Saved review settings stay available through Reset to saved queue." : "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ i(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: c,
              onClick: l,
              children: /* @__PURE__ */ i(pr, {})
            }
          )
        ] }),
        p && /* @__PURE__ */ i("p", { role: "alert", className: "dq-alert", children: p }),
        /* @__PURE__ */ i("fieldset", { disabled: c, className: "dq-manager-content", children: f ? /* @__PURE__ */ i(
          jn,
          {
            draft: f,
            temporary: n,
            saving: c,
            setDraft: u,
            onSave: () => void I(),
            onCancel: l
          }
        ) : /* @__PURE__ */ h(de, { children: [
          /* @__PURE__ */ h("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ h(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => E(),
                children: [
                  /* @__PURE__ */ i(Br, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ h("label", { className: "dq-button", children: [
              /* @__PURE__ */ i(Vr, {}),
              " Import reviews",
              /* @__PURE__ */ i(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: C
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ i("div", { className: "dq-review-list", children: e.map((y) => /* @__PURE__ */ h("article", { children: [
            /* @__PURE__ */ h("div", { children: [
              /* @__PURE__ */ i("strong", { children: y.name }),
              /* @__PURE__ */ i("p", { children: y.description || "No description" })
            ] }),
            /* @__PURE__ */ h("button", { type: "button", onClick: () => E(y), children: [
              /* @__PURE__ */ i(ur, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                onClick: () => E({
                  ...structuredClone(y),
                  id: crypto.randomUUID(),
                  name: `${y.name} copy`
                }),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ i(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${y.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${y.name}”?`) && R(
                    e.filter((q) => q.id !== y.id)
                  );
                },
                children: /* @__PURE__ */ i(gr, {})
              }
            )
          ] }, y.id)) })
        ] }) })
      ] })
    }
  );
}
function jn({
  draft: e,
  temporary: t = !1,
  saving: r = !1,
  setDraft: n,
  onSave: o,
  onCancel: d
}) {
  const [l, f] = A("Review"), u = D(/* @__PURE__ */ new WeakMap()), p = (c) => {
    let g = u.current.get(c);
    return g || (g = crypto.randomUUID(), u.current.set(c, g)), g;
  }, s = (c, g) => n({
    ...e,
    actions: e.actions.map(
      (N, w) => w === c ? g : N
    )
  });
  return /* @__PURE__ */ h("div", { className: "dq-editor", children: [
    !t && /* @__PURE__ */ i("div", { className: "dq-editor-nav", children: /* @__PURE__ */ i(
      jr,
      {
        tabs: ["Review", "Queue", "Appearance", "Actions"].map((c) => ({
          key: c,
          label: c,
          count: c === "Actions" ? e.actions.length : void 0,
          disabled: r
        })),
        activeTab: l,
        onTabChange: f
      }
    ) }),
    /* @__PURE__ */ h("div", { className: "dq-editor-body", children: [
      !t && /* @__PURE__ */ h("section", { hidden: l !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ i("h3", { children: "Review details" }),
        /* @__PURE__ */ i("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ h("label", { children: [
          "Review name",
          /* @__PURE__ */ i(
            "input",
            {
              autoFocus: !0,
              "aria-label": "Review name",
              value: e.name,
              onChange: (c) => n({ ...e, name: c.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ h("label", { children: [
          "Description",
          /* @__PURE__ */ i(
            "textarea",
            {
              "aria-label": "Description",
              value: e.description,
              onChange: (c) => n({ ...e, description: c.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ i(
        "section",
        {
          hidden: !t && l !== "Queue",
          className: "dq-editor-section",
          children: /* @__PURE__ */ i(nr, { draft: e, onChange: n, presentation: !1 })
        }
      ),
      !t && /* @__PURE__ */ i(
        "section",
        {
          hidden: l !== "Appearance",
          className: "dq-editor-section",
          children: /* @__PURE__ */ i(nr, { draft: e, onChange: n, queue: !1 })
        }
      ),
      !t && /* @__PURE__ */ h("section", { hidden: l !== "Actions", className: "dq-editor-section", children: [
        /* @__PURE__ */ i("h3", { children: "Actions" }),
        /* @__PURE__ */ i("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
        /* @__PURE__ */ i("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
        /* @__PURE__ */ i(
          Ht,
          {
            items: e.actions,
            getKey: (c) => c.id,
            disabled: r,
            className: "dq-sortable-list",
            onReorder: (c) => n({ ...e, actions: c }),
            renderItem: (c, { index: g, dragHandleProps: N, isOver: w }) => /* @__PURE__ */ h(
              "fieldset",
              {
                className: w ? "dq-action-card dq-drag-over" : "dq-action-card",
                children: [
                  /* @__PURE__ */ h("legend", { children: [
                    "Action ",
                    g + 1
                  ] }),
                  /* @__PURE__ */ h("div", { className: "dq-action-heading", children: [
                    /* @__PURE__ */ i(
                      "button",
                      {
                        type: "button",
                        ...N,
                        disabled: r,
                        className: "dq-drag-handle",
                        "aria-label": `Reorder action ${g + 1}`,
                        children: /* @__PURE__ */ i(hr, {})
                      }
                    ),
                    /* @__PURE__ */ i("strong", { children: c.label || "New action" }),
                    /* @__PURE__ */ i("div", { className: "dq-row", children: /* @__PURE__ */ i(
                      "button",
                      {
                        type: "button",
                        onClick: () => n({
                          ...e,
                          actions: [
                            ...e.actions.slice(0, g + 1),
                            {
                              ...structuredClone(c),
                              id: crypto.randomUUID(),
                              label: c.label + " copy",
                              shortcut: ""
                            },
                            ...e.actions.slice(g + 1)
                          ]
                        }),
                        children: "Duplicate action"
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ h("div", { className: "dq-field-grid", children: [
                    /* @__PURE__ */ h("label", { children: [
                      "Shortcut",
                      /* @__PURE__ */ h(
                        "select",
                        {
                          value: c.shortcut ?? "auto",
                          onChange: (E) => s(g, {
                            ...c,
                            shortcut: E.target.value === "auto" ? void 0 : E.target.value
                          }),
                          children: [
                            /* @__PURE__ */ h("option", { value: "auto", children: [
                              "Position (",
                              g < 9 ? g + 1 : "none",
                              ")"
                            ] }),
                            /* @__PURE__ */ i("option", { value: "", children: "None" }),
                            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((E) => /* @__PURE__ */ i("option", { value: E, children: E }, E))
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ h("label", { children: [
                      "Button label",
                      /* @__PURE__ */ i(
                        "input",
                        {
                          value: c.label,
                          onChange: (E) => s(g, {
                            ...c,
                            label: E.target.value
                          })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ i(
                    Ht,
                    {
                      items: c.steps,
                      getKey: p,
                      disabled: r,
                      className: "dq-sortable-list",
                      onReorder: (E) => s(g, { ...c, steps: E }),
                      renderItem: (E, { index: I, dragHandleProps: R, isOver: C }) => /* @__PURE__ */ i(
                        _n,
                        {
                          dragHandleProps: R,
                          saving: r,
                          isOver: C,
                          step: E,
                          index: I,
                          onChange: (y) => {
                            u.current.set(y, p(E)), s(g, {
                              ...c,
                              steps: c.steps.map(
                                (q, O) => O === I ? y : q
                              )
                            });
                          },
                          onRemove: () => s(g, {
                            ...c,
                            steps: c.steps.filter(
                              (y, q) => q !== I
                            )
                          })
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ h("div", { className: "dq-row", children: [
                    /* @__PURE__ */ i(
                      "button",
                      {
                        className: "dq-button",
                        type: "button",
                        onClick: () => s(g, {
                          ...c,
                          steps: [...c.steps, { mode: "ADD", tagIds: [] }]
                        }),
                        children: "Add step"
                      }
                    ),
                    /* @__PURE__ */ i(
                      "button",
                      {
                        className: "dq-button",
                        type: "button",
                        onClick: () => n({
                          ...e,
                          actions: e.actions.filter(
                            (E, I) => I !== g
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
            onClick: () => n({
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
    /* @__PURE__ */ h("div", { className: "dq-editor-footer", children: [
      /* @__PURE__ */ i(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const c = URL.createObjectURL(
              new Blob([JSON.stringify([e], null, 2)], {
                type: "application/json"
              })
            ), g = document.createElement("a");
            g.href = c, g.download = "data-quality-review.json", g.click(), URL.revokeObjectURL(c);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ i("button", { className: "dq-button", type: "button", onClick: d, children: "Cancel" }),
      /* @__PURE__ */ i("button", { className: "dq-button primary", type: "button", onClick: o, children: t ? "Apply temporary queue" : "Save review" })
    ] })
  ] });
}
function _n({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: n,
  isOver: o,
  onChange: d,
  onRemove: l
}) {
  return /* @__PURE__ */ h("div", { className: o ? "dq-action-step dq-drag-over" : "dq-action-step", children: [
    /* @__PURE__ */ i(
      "button",
      {
        type: "button",
        ...r,
        disabled: n,
        className: "dq-drag-handle",
        "aria-label": `Reorder step ${t + 1}`,
        children: /* @__PURE__ */ i(hr, {})
      }
    ),
    /* @__PURE__ */ h("span", { children: [
      "Step ",
      t + 1
    ] }),
    /* @__PURE__ */ h(
      "select",
      {
        "aria-label": "Tag operation",
        value: e.mode,
        onChange: (f) => d({ ...e, mode: f.target.value }),
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
      St,
      {
        entityType: "tag",
        values: e.tagIds,
        onChange: (f) => d({ ...e, tagIds: f }),
        placeholder: "Choose tags",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ i("button", { type: "button", "aria-label": "Remove step", onClick: l, children: /* @__PURE__ */ i(gr, {}) })
  ] });
}
async function Dn() {
  const e = await F("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let n = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const l = JSON.parse(r);
      Array.isArray(l.reviews) && (n = JSON.stringify(l.reviews, null, 2));
    } catch {
    }
  const o = URL.createObjectURL(
    new Blob([n], { type: "application/json" })
  ), d = document.createElement("a");
  d.href = o, d.download = "data-quality-browser-recovery.json", d.click(), URL.revokeObjectURL(o);
}
function lr({ label: e }) {
  return /* @__PURE__ */ h("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ i(fr, { className: "dq-spin" }),
    e
  ] });
}
function cr({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ h("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ i(Nt, {}),
    /* @__PURE__ */ i("p", { children: e }),
    /* @__PURE__ */ i("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const Bn = { components: { DataQualityPage: Tn } };
export {
  Tn as DataQualityPage,
  Bn as default,
  rt as objectFiltersEqual
};
