import { jsxs as u, jsx as n, Fragment as de } from "react/jsx-runtime";
import { useState as S, useEffect as Y, useMemo as Ft, useRef as F, useCallback as ge, useLayoutEffect as Er } from "react";
import { countActiveObjectFilters as Cr, VIDEO_CRITERIA as ze, FilterButton as Ar, ActiveObjectFilterChips as qr, FilterDialog as tr, VIDEO_SORT_OPTIONS as _t, EntityReferenceMultiSelector as pt, DetailListPagination as Rr, VideoPlayer as kr, VideoCard as Ir, EntityDetailTabs as Or, SortableList as Ut } from "@cove/runtime/components";
import { Pencil as rr, AlertTriangle as ht, LayoutGrid as Tr, Grid3X3 as xr, ZoomOut as Pr, ZoomIn as Mr, Film as Kt, Loader2 as nr, ChevronLeft as $r, ChevronRight as Lr, ExternalLink as Dr, X as ir, Plus as jr, Upload as Fr, Trash2 as or, GripVertical as sr } from "@cove/runtime/lucide-react";
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
function xe(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Ur(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
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
function Ur(e) {
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
function Bt(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function Kr(e, t, r, i) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!i && t.includes(r)) return r;
  const s = Math.max(0, e.indexOf(r));
  if (i) {
    for (const d of e.slice(s + 1))
      if (t.includes(d)) return d;
    if (t.includes(r)) {
      for (const d of e.slice(0, s).reverse())
        if (t.includes(d)) return d;
      return r;
    }
  }
  return t[Math.min(s, t.length - 1)];
}
function Jr(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((s) => r.has(s));
  for (const s of t)
    i ? r.delete(s) : r.add(s);
  return r;
}
function Br(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const lr = "ext:com.midnightrider.data-quality:configuration", Vr = "ext:cove-data-quality:video-reviews", bt = "ext:com.midnightrider.data-quality:progress", Pe = /* @__PURE__ */ new Map(), Ve = /* @__PURE__ */ new Map(), ct = (e, t) => e.includes("*") || e.includes(t), Ge = (e) => U(`/api/savedfilters?mode=${encodeURIComponent(e)}`), zr = () => ({
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
    reviews: xe(JSON.stringify(t.reviews)),
    deletedIds: yt(t.deletedIds),
    importedIds: yt(t.importedIds)
  };
}
function Qr(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const s of t) {
    const d = localStorage.getItem(s);
    if (d !== null) {
      const l = xe(d);
      r ?? (r = l), l.forEach((y) => i.add(y.id));
    }
    yt(
      JSON.parse(localStorage.getItem(`${s}:account-imports`) ?? "[]")
    ).forEach((l) => i.add(l));
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
  const r = (Ve.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Ve.set(e, r), r.finally(() => {
    Ve.get(e) === r && Ve.delete(e);
  }).catch(() => {
  }), r;
}
let Oe = null;
function Gr() {
  if (Oe) return Oe;
  const e = Hr();
  return Oe = e, e.finally(() => {
    Oe === e && (Oe = null);
  }).catch(() => {
  }), e;
}
async function Hr() {
  var w;
  const e = await U("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = ct(e.permissions, "savedfilters.read"), s = i && ct(e.permissions, "savedfilters.write"), d = i ? (await Ge(lr)).filter((q) => q.name === "Data Quality configuration").sort((q, v) => q.id - v.id) : [];
  if (d.length > 1) {
    const q = (v) => {
      const { revision: N, ...k } = Ne(v.uiOptions);
      return JSON.stringify(k);
    };
    if (d.some((v) => q(v) !== q(d[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (s)
      for (const v of d.slice(1))
        await U(`/api/savedfilters/${v.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${v.id}` })
        });
    d.splice(1);
  }
  let l = d.length ? Ne(d[0].uiOptions) : zr();
  const y = localStorage.getItem(`${r}:migrated`) === "true", E = localStorage.getItem(r), h = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && E && (l = Ne(E));
  let a = !d.length;
  if (d.length && h && E) {
    const q = Ne(E);
    if (q.reviews.some((N) => {
      const k = l.reviews.find((O) => O.id === N.id);
      return k && JSON.stringify(k) !== JSON.stringify(N);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const v = [
      .../* @__PURE__ */ new Set([...l.deletedIds, ...q.deletedIds])
    ];
    l = {
      ...l,
      reviews: mt(l.reviews, q.reviews).filter(
        (N) => !v.includes(N.id)
      ),
      deletedIds: v,
      importedIds: [
        .../* @__PURE__ */ new Set([...l.importedIds, ...q.importedIds])
      ]
    }, a = !0;
  }
  if (!y) {
    const q = JSON.stringify(l), v = Qr(t);
    if (d.length && v.reviews.some((R) => {
      const g = l.reviews.find((A) => A.id === R.id);
      return g && JSON.stringify(g) !== JSON.stringify(R);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = i ? (await Ge(Vr)).flatMap(
      (R) => xe(R.uiOptions ?? "[]")
    ) : [], k = v.known.filter(
      (R) => !v.reviews.some((g) => g.id === R)
    ), O = /* @__PURE__ */ new Set([...l.deletedIds, ...k]);
    l = {
      ...l,
      reviews: mt(
        v.reviews,
        l.reviews,
        N.filter(
          (R) => !v.known.includes(R.id) && !l.importedIds.includes(R.id)
        )
      ).filter((R) => !O.has(R.id)),
      deletedIds: [...O],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...l.importedIds,
          ...v.known,
          ...N.map((R) => R.id)
        ])
      ]
    }, a || (a = JSON.stringify(l) !== q);
  }
  const c = {
    userId: t,
    recordId: (w = d[0]) == null ? void 0 : w.id,
    config: l,
    readable: i,
    writable: s,
    durable: s
  };
  if (Pe.set(r, c), a && s) {
    const q = l;
    d.length && (c.config = Ne(d[0].uiOptions)), await ur(r, q), l = c.config;
  } else d.length || (localStorage.setItem(r, JSON.stringify(l)), !i && (!y || h) && localStorage.setItem(`${r}:local-only`, "true"));
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
async function ur(e, t) {
  const r = Pe.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await cr(r), r.recordId != null) {
      const d = await U(
        `/api/savedfilters/${r.recordId}`
      );
      if (Ne(d.uiOptions).revision !== r.config.revision)
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
function Wr(e, t) {
  return xe(JSON.stringify(t)), dr(e, async () => {
    const r = Pe.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((s) => !t.some((d) => d.id === s.id)).map((s) => s.id);
    await ur(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((s) => !t.some((d) => d.id === s))
    });
  });
}
function Vt(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Xr(e, t) {
  const r = Pe.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), s = i ? Vt(i) : null;
  if (!r.readable) return s;
  const d = (await Ge(bt)).find(
    (y) => y.name === t
  ), l = d ? Vt(d.uiOptions) : null;
  return s && (!l || s.updatedAt > l.updatedAt) ? s : l;
}
function Yr(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return dr(i, async () => {
    const s = Pe.get(e);
    if (!(s != null && s.writable)) return;
    await cr(s);
    const d = (await Ge(bt)).find(
      (l) => l.name === t
    );
    await U(
      d ? `/api/savedfilters/${d.id}` : "/api/savedfilters",
      {
        method: d ? "PUT" : "POST",
        body: JSON.stringify({
          mode: bt,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Me = "confirmed_absent_tags", vt = "Confirmed absent tags", Zr = {
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
      t === "modifier" && typeof r == "string" ? Zr[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === Me.toLowerCase() ? r.toLowerCase() : He(r)
    ])
  ) : e;
}
async function U(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await _r(e, { ...t, headers: r });
  if (!i.ok) {
    let d = i.statusText || `Request failed (${i.status}).`;
    try {
      const l = await i.json();
      d = l.message || l.detail || l.error || d;
    } catch {
    }
    throw new Error(d);
  }
  if (i.status === 204 || i.status === 205) return;
  const s = await i.text();
  return s ? JSON.parse(s) : void 0;
}
async function zt(e, t, r) {
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
function en(e) {
  return `/api/stream/video/${e}`;
}
function Qt(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function tn(e) {
  return `/api/stream/video/${e}/preview`;
}
function rn(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function nn(e) {
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
      for (const d of s.items) t.add(d.id);
      if (i * 1e3 >= s.totalCount) break;
      if (!s.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...t];
}
function on(e) {
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
  const r = on(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function sn() {
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
function an(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${Me} value is not a valid tag list.`
    );
  return We(e);
}
function ln(e) {
  return We(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function cn(e, t) {
  let r;
  try {
    r = await Nt();
  } catch (h) {
    throw new Error(
      `Could not verify the ${vt} custom field. ${h instanceof Error ? h.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const i = await Promise.all(
    e.steps.map(async (h) => ({
      ...h,
      tagIds: h.mode === "REMOVE_TREE" ? await St(h.tagIds) : We(h.tagIds)
    }))
  ), s = i.filter(
    (h) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(h.mode)
  ), d = i.filter(
    (h) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(h.mode)
  ), l = We(t), y = r.definition.key;
  let E = 0;
  for (const h of l)
    try {
      const a = await U(`/api/videos/${h}`), c = ln(a), w = { ...a.customFields ?? {} }, q = w[y], v = an(q), N = new Set(c), k = new Set(v);
      for (const A of s)
        for (const I of A.tagIds)
          A.mode === "ADD" ? N.add(I) : N.delete(I);
      for (const A of d)
        for (const I of A.tagIds)
          A.mode === "MARK_PRESENT" ? (N.add(I), k.delete(I)) : A.mode === "MARK_ABSENT" ? (N.delete(I), k.add(I)) : k.delete(I);
      const O = [...N], R = [...k];
      JSON.stringify(c) === JSON.stringify(O) && JSON.stringify(v) === JSON.stringify(R) && (q === void 0 ? R.length === 0 : JSON.stringify(q) === JSON.stringify(v)) || await U(`/api/videos/${h}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: O,
          customFields: {
            ...w,
            [y]: R
          }
        })
      }), E++;
    } catch (a) {
      throw new Error(
        `Assessment stopped after ${E} video${E === 1 ? "" : "s"} completed; video ${h} was affected. Refresh and inspect it before retrying. ${a instanceof Error ? a.message : "Request failed."}`
      );
    }
}
async function dn(e, t) {
  if (!wt(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (Qe(e)) {
    await cn(e, t);
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
function un(e) {
  var y, E, h;
  const [t, r] = S({}), [i, s] = S(""), d = (((y = e == null ? void 0 : e.presentation) == null ? void 0 : y.annotations) ?? []).includes("tags") ? ((E = e == null ? void 0 : e.presentation) == null ? void 0 : E.annotationParents) ?? [] : [], l = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...d,
      ...((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.binParents) ?? []
    ])
  ]);
  return Y(() => {
    let a = !0;
    return r({}), s(""), Promise.all(
      JSON.parse(l).map(
        async (c) => [c, await St([c])]
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
function fn(e, t, r) {
  const i = t == null ? void 0 : t.presentation, s = (i == null ? void 0 : i.annotations) ?? [], d = (i == null ? void 0 : i.annotationParents) ?? [];
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
    tags: s.includes("tags") && d.length > 0 ? (e.tags ?? []).filter(
      (l) => d.some(
        (y) => {
          var E;
          return y !== l.id && ((E = r[y]) == null ? void 0 : E.includes(l.id));
        }
      )
    ) : []
  };
}
function pn({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: s
}) {
  var y, E, h;
  const d = new Set(
    (((y = t.presentation) == null ? void 0 : y.binParents) ?? []).flatMap(
      (a) => (r[a] ?? []).filter((c) => c !== a)
    )
  ), l = /* @__PURE__ */ new Map();
  for (const a of e)
    for (const c of a.tags ?? [])
      if (d.has(c.id)) {
        const w = l.get(c.id) ?? { name: c.name, count: 0 };
        w.count++, l.set(c.id, w);
      }
  return (h = (E = t.presentation) == null ? void 0 : E.binParents) != null && h.length ? /* @__PURE__ */ u("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...l].sort((a, c) => a[1].name.localeCompare(c[1].name)).map(([a, c]) => /* @__PURE__ */ u(
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
function hn(e, t) {
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
function gn({
  objectFilter: e,
  overridden: t,
  disabled: r,
  onAdjustQueue: i,
  onApply: s,
  onReset: d
}) {
  const [l, y] = S(!1), [E, h] = S(!1), a = Cr(ze, e);
  return /* @__PURE__ */ u(
    "section",
    {
      className: "dq-filter-panel",
      "aria-label": "Queue filters and settings",
      children: [
        /* @__PURE__ */ u("div", { className: "dq-filter-toolbar", children: [
          /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              className: "dq-filter-disclosure",
              "aria-expanded": l,
              onClick: () => y((c) => !c),
              children: [
                /* @__PURE__ */ n("span", { "aria-hidden": "true", children: "›" }),
                "Current filters",
                t && /* @__PURE__ */ n("em", { children: "Adjusted" })
              ]
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: r,
              onClick: i,
              children: "Adjust queue"
            }
          ),
          /* @__PURE__ */ n(
            Ar,
            {
              activeCount: a,
              disabled: r,
              onClick: () => {
                h(!0);
              }
            }
          )
        ] }),
        l && /* @__PURE__ */ u("div", { className: "dq-filter-panel-body", children: [
          a ? /* @__PURE__ */ n(
            "div",
            {
              className: r ? "dq-filter-chips-disabled" : void 0,
              "aria-disabled": r || void 0,
              inert: r ? !0 : void 0,
              children: /* @__PURE__ */ n(
                qr,
                {
                  criteriaDefinitions: ze,
                  objectFilter: e,
                  onRemove: () => {
                  },
                  onEdit: () => {
                    r || h(!0);
                  },
                  ariaLabel: "Current queue filters",
                  removable: !1
                }
              )
            }
          ) : /* @__PURE__ */ n("p", { children: "No video filters. All videos can enter the queue." }),
          /* @__PURE__ */ n("div", { className: "dq-filter-panel-actions", children: t && /* @__PURE__ */ n(
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
        E && /* @__PURE__ */ n("div", { onKeyDown: (c) => c.stopPropagation(), children: /* @__PURE__ */ n(
          tr,
          {
            open: !0,
            onClose: () => h(!1),
            criteria: ze,
            activeFilter: e,
            supportsFilterExpressions: !0,
            subjectLabel: "videos",
            onApply: (c) => {
              r || (s(c), h(!1));
            }
          }
        ) })
      ]
    }
  );
}
function Gt({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [s, d] = S(!1), l = e.view.filter, y = (a) => t({
    ...e,
    view: { ...e.view, filter: { ...l, ...a } }
  }), E = e.presentation ?? {}, h = (a) => t({ ...e, presentation: { ...E, ...a } });
  return /* @__PURE__ */ u(de, { children: [
    i && /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ u("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(l.q ?? ""),
            onChange: (a) => y({ q: a.target.value })
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
              value: String(l.sort ?? "date"),
              onChange: (a) => y({ sort: a.target.value, sorts: void 0 }),
              children: [
                !_t.some((a) => a.value === l.sort) && l.sort != null && /* @__PURE__ */ n("option", { value: String(l.sort), children: String(l.sort) }),
                _t.map((a) => /* @__PURE__ */ n("option", { value: a.value, children: a.label }, a.value))
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
              value: String(l.direction ?? "desc"),
              onChange: (a) => y({ direction: a.target.value }),
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
              value: Number(l.perPage) || 40,
              onChange: (a) => y({
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
          onClick: () => d(!0),
          children: "Edit video filters"
        }
      ),
      /* @__PURE__ */ u("p", { children: [
        Object.keys(e.view.objectFilter).length ? "Video filters configured" : "No video filters",
        ". Choose which videos enter the queue."
      ] }),
      s && /* @__PURE__ */ n("div", { onKeyDown: (a) => a.stopPropagation(), children: /* @__PURE__ */ n(
        tr,
        {
          open: !0,
          onClose: () => d(!1),
          criteria: ze,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: !0,
          subjectLabel: "videos",
          onApply: (a) => {
            t({ ...e, view: { ...e.view, objectFilter: a } }), d(!1);
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
      ] }) }),
      /* @__PURE__ */ n("h4", { children: "Card annotations" }),
      /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((a) => {
        const c = E.annotations ?? [];
        return /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: c.includes(a),
              onChange: (w) => h({
                annotations: w.target.checked ? [...c, a] : c.filter((q) => q !== a)
              })
            }
          ),
          a
        ] }, a);
      }) }),
      (E.annotations ?? []).includes("tags") && /* @__PURE__ */ u(de, { children: [
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
        /* @__PURE__ */ n(
          pt,
          {
            entityType: "tag",
            values: E.annotationParents ?? [],
            placeholder: "Search annotation parent tags...",
            onChange: (a) => h({ annotationParents: a }),
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
          values: E.binParents ?? [],
          placeholder: "Search tag-bin parent tags...",
          onChange: (a) => h({ binParents: a }),
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
function mn(e) {
  return e === "wall" ? "wall" : "grid";
}
function bn() {
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
function yn(e) {
  return me({ ...e, page: 1 });
}
function Xe(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((l, y) => Xe(l, t[y]));
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  const r = e, i = t, s = Object.keys(r).sort(), d = Object.keys(i).sort();
  return s.length === d.length && s.every(
    (l, y) => l === d[y] && Xe(r[l], i[l])
  );
}
function wn(e, t) {
  if (t === 0) return "Showing 0 of 0";
  const r = Number(e.perPage) || 40, i = Math.max(1, Math.ceil(t / r)), s = Math.min(Math.max(1, Number(e.page) || 1), i), d = (s - 1) * r + 1, l = Math.min(s * r, t);
  return `Showing ${d.toLocaleString()}-${l.toLocaleString()} of ${t.toLocaleString()}`;
}
function fr(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function X(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
function vn({
  onNavigate: e
}) {
  const [t, r] = S([]), [i] = S(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [s, d] = S(""), [l, y] = S(!0), [E, h] = S(""), [a, c] = S(!1), [w, q] = S(!0), [v, N] = S(""), [k, O] = S(""), [R, g] = S(!1), [A, I] = S(!1), [p, $] = S(bn), [J, j] = S(!1), [se, ie] = S(!1), [ae, Et] = S(!1), [z, be] = S(
    null
  ), T = t.find((o) => o.id === p) ?? null, b = Ft(
    () => (z == null ? void 0 : z.id) === p && T ? { ...T, view: z.view } : T,
    [z, p, T]
  ), pr = !!(b && T && !Xe(
    b.view.objectFilter,
    T.view.objectFilter
  )), $e = un(b), [L, Ee] = S({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [hr, gr] = S({
    page: 1,
    perPage: 40
  }), [ee, Ct] = S({ items: [], totalCount: 0 }), [x, Le] = S(!1), [oe, At] = S(""), [le, ue] = S(() => /* @__PURE__ */ new Set()), Ye = F(le);
  Ye.current = le;
  const ye = F(/* @__PURE__ */ new Map()), [Q, te] = S(null), G = F(Q);
  G.current = Q;
  const [re, we] = S(!1), ce = F(re);
  ce.current = re;
  const qt = F(null), [Ce, Ze] = S("grid"), [fe, Rt] = S(dt), [_, et] = S(!1), De = F(!1), [mr, tt] = S(""), [kt, Ae] = S(""), [rt, qe] = S(""), [D, It] = S(null), [Ot, je] = S(""), [Fe, _e] = S(!1), nt = F(/* @__PURE__ */ new Map()), Tt = F(null), ve = F(0), Ue = F(0), Ke = F(null), xt = ge(async () => {
    y(!0), h("");
    try {
      const o = await Gr();
      r(o.reviews), d(o.storageKey), c(o.canWrite), q(o.canConfigure ?? !0), N(o.storageNotice ?? ""), p && !o.reviews.some((f) => f.id === p) && ($(""), Xt(""));
    } catch (o) {
      h(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      y(!1);
    }
  }, [p]);
  Y(() => {
    xt();
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
        let M = await zt(
          o,
          f,
          C.signal
        );
        const ne = Math.max(
          1,
          Math.ceil(M.totalCount / Number(f.perPage))
        );
        return Number(f.page) > ne && (f = { ...f, page: ne }, M = await zt(
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
    if (Ue.current += 1, ve.current += 1, (f = Ke.current) == null || f.abort(), I(!1), O(""), g(!1), ue(/* @__PURE__ */ new Set()), ye.current.clear(), te(null), we(!1), et(!1), De.current = !1, tt(""), Ae(""), qe(""), Ct({ items: [], totalCount: 0 }), !b) {
      Le(!1);
      return;
    }
    let o = !0;
    return Le(!0), (async () => {
      let m = null;
      try {
        m = await Xr(s, b.id);
      } catch (M) {
        o && (g(!0), O(
          M instanceof Error ? M.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const C = (m == null ? void 0 : m.signature) === Se(b) ? m : null, K = C ? me(C.filter) : yn(b.view.filter);
      Ee(K), Ze(
        C ? mn(C.displayMode) : Wt(b)
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
        te(ne), B(ne);
      } catch {
      }
      o && I(!0);
    })(), () => {
      var m;
      o = !1, Ue.current++, ve.current++, (m = Ke.current) == null || m.abort();
    };
  }, [b == null ? void 0 : b.id]);
  const P = Ft(
    () => ee.items.map((o) => o.id),
    [ee.items]
  );
  Y(() => {
    if (!A || !b || !s || x || oe || _ || (z == null ? void 0 : z.id) === b.id || R)
      return;
    const o = {
      version: 1,
      signature: Se(b),
      filter: L,
      focusedId: Q,
      index: Math.max(0, P.indexOf(Q ?? -1)),
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
      Yr(s, b.id, o).catch((C) => {
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
    x,
    oe,
    _,
    L,
    Q,
    P,
    Ce,
    fe,
    z,
    k,
    R
  ]);
  const it = ee.items.find((o) => o.id === Q) ?? null;
  re && it && (qt.current = it);
  const he = it ?? (re ? qt.current : null), br = Bt(le, Q), Pt = le.size > 0 ? `${le.size} selected video${le.size === 1 ? "" : "s"}` : Q == null ? "no video" : "focused video", B = ge((o, f = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const m = nt.current.get(o);
      m == null || m.focus({ preventScroll: !0 }), f && (m == null || m.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  Y(() => {
    A && !ce.current && B(G.current);
  }, [A, B]), Y(() => {
    x || !P.length || (G.current == null || !P.includes(G.current)) && (te(P[0]), ce.current || B(P[0]));
  }, [B, P, x]);
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
      if (!P.length) return;
      const f = Math.max(
        0,
        P.indexOf(G.current ?? P[0])
      ), m = P[Math.max(0, Math.min(P.length - 1, f + o))];
      te(m), ce.current || B(m);
    },
    [B, P]
  ), st = ge(
    async (o) => {
      const f = Bt(
        Ye.current,
        G.current
      );
      if (!b || De.current || x || oe || !a || Qe(o) && (D == null ? void 0 : D.kind) !== "ready" || !f.length)
        return;
      const m = ++Ue.current, C = b.id, K = [...P], M = G.current, ne = new Map(
        f.map((V) => [V, ye.current.get(V) ?? 0])
      ), H = () => m === Ue.current && b.id === C;
      De.current = !0, et(!0), tt(
        Ye.current.size ? `${f.length} selected videos` : "the focused video"
      ), Ae(""), qe("");
      let Ie = !1;
      try {
        if (await dn(o, f), Ie = !0, !H()) return;
        ue((V) => {
          const W = new Set(V);
          for (const Z of f)
            (ye.current.get(Z) ?? 0) === ne.get(Z) && W.delete(Z);
          return W;
        }), Ae(
          `${o.label}: ${f.length} video${f.length === 1 ? "" : "s"} ${o.steps.length ? "updated" : "skipped"}.`
        );
      } catch (V) {
        if (!H()) return;
        qe(
          V instanceof Error ? V.message : "Action failed."
        );
      }
      try {
        if (await nn(o), !H()) return;
        const V = await pe(b, L);
        if (!H()) return;
        let W = V.items.map((Z) => Z.id);
        if (!W.length && V.totalCount > 0 && Number(L.page) > 1) {
          const Z = Math.max(1, Number(L.page) - 1), Be = { ...L, page: Z };
          Ee(Be), W = (await pe(b, Be)).items.map((lt) => lt.id), ue(
            (lt) => new Set([...lt].filter((Nr) => W.includes(Nr)))
          );
          const jt = W.at(-1) ?? null;
          te(jt), ce.current || B(jt);
        } else {
          ue(
            (Be) => new Set([...Be].filter((Dt) => W.includes(Dt)))
          );
          const Z = Kr(
            K,
            W,
            M,
            Ie && f.includes(M ?? -1)
          );
          te(Z), ce.current && Z == null && we(!1), ce.current || B(Z);
        }
      } catch (V) {
        H() && qe(
          (W) => `${W ? `${W} ` : ""}${Ie ? "The action completed, but " : ""}the queue could not be refreshed. ${V instanceof Error ? V.message : "Refresh failed."}`
        );
      } finally {
        H() && (De.current = !1, et(!1), tt(""));
      }
    },
    [
      a,
      D,
      pe,
      L,
      B,
      P,
      x,
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
      X(o), we(!1), B(G.current);
      return;
    }
    if (!Br(o.target)) return;
    if (o.key === "Escape") {
      X(o), Re(() => /* @__PURE__ */ new Set());
      return;
    }
    const f = (b == null ? void 0 : b.actions.findIndex(
      (K, M) => Te(K, M) === o.key
    )) ?? -1;
    if (f >= 0 && (b != null && b.actions[f])) {
      X(o), !_ && !x && st(b.actions[f]);
      return;
    }
    if (!re && o.key === " ") {
      X(o), Q != null && Re((K) => ft(K, Q));
      return;
    }
    if (!re && o.key.toLowerCase() === "a") {
      X(o), Re(
        (K) => Jr(K, P)
      );
      return;
    }
    if (_ || x || re) return;
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
    const f = o.map(Nn);
    try {
      await Wr(s, f);
    } catch (C) {
      throw C;
    }
    r(f), p && !f.some((C) => C.id === p) && at("");
    const m = f.find((C) => C.id === p);
    return m && T && JSON.stringify(m) !== JSON.stringify(T) && (m.view.displayMode !== T.view.displayMode && Ze(Wt(m)), Se(m) !== Se(T) && (be(null), ke(
      m,
      me({ ...m.view.filter, page: L.page })
    ))), !0;
  }
  if (l)
    return /* @__PURE__ */ n(Zt, { label: "Loading Data Quality reviews…" });
  if (E)
    return /* @__PURE__ */ u(de, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void kn().catch(
            (o) => h(
              "Could not export browser reviews. " + (o instanceof Error ? o.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        er,
        {
          message: E,
          onRetry: () => void xt()
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
          disabled: _ || x || !w,
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
          disabled: Fe,
          onClick: () => {
            _e(!0), je(""), sn().then(Je).catch(
              (o) => je(
                "Could not create the Confirmed absent tags custom field. " + (o instanceof Error ? o.message : "Request failed.")
              )
            ).finally(() => _e(!1));
          },
          children: Fe ? "Setting up…" : "Set up tag assessments"
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
          disabled: Fe,
          onClick: () => {
            _e(!0), Je().finally(
              () => _e(!1)
            );
          },
          children: Fe ? "Checking…" : "Check again"
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
            O(""), g(!1);
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
      b && /* @__PURE__ */ n("span", { className: "dq-range-count", children: wn(hr, ee.totalCount) }),
      b && /* @__PURE__ */ u(de, { children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: _ || x || !w,
            onClick: () => {
              ie(!0), j(!0);
            },
            children: "Edit review"
          }
        ),
        (z == null ? void 0 : z.id) === p && /* @__PURE__ */ u(de, { children: [
          /* @__PURE__ */ n("span", { children: "Temporary queue" }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: _ || x || !w,
              onClick: () => {
                T && Mt(
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
              disabled: _ || x,
              onClick: () => {
                be(null), T && ke(
                  T,
                  me({
                    ...T.view.filter,
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
              { mode: "grid", label: "Grid", Icon: Tr },
              { mode: "wall", label: "Wall", Icon: xr }
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
          /* @__PURE__ */ n(Mr, { className: "h-3 w-3 text-muted" })
        ] })
      ] })
    ] }),
    b && T && /* @__PURE__ */ n(
      gn,
      {
        objectFilter: b.view.objectFilter,
        overridden: pr,
        disabled: _ || x,
        onAdjustQueue: () => Et(!0),
        onApply: $t,
        onReset: () => $t(T.view.objectFilter)
      }
    ),
    b ? /* @__PURE__ */ u(de, { children: [
      $e.error && /* @__PURE__ */ n("p", { role: "alert", children: $e.error }),
      /* @__PURE__ */ n(
        pn,
        {
          videos: ee.items,
          review: b,
          trees: $e.ids,
          disabled: _ || x,
          onChoose: (o) => {
            const f = hn(b, o);
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
          x && !ee.items.length && /* @__PURE__ */ n(Zt, { label: "Loading review queue…" }),
          oe && !x && /* @__PURE__ */ n(
            er,
            {
              message: oe,
              onRetry: () => void pe(b, L).catch(() => {
              })
            }
          ),
          !x && !oe && !ee.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
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
          /* @__PURE__ */ n("strong", { children: Pt }),
          b.actions.map((o, f) => /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              disabled: _ || x || !!oe || !a || Qe(o) && (D == null ? void 0 : D.kind) !== "ready" || !br.length,
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
          !a && /* @__PURE__ */ n("p", { children: "Video write permission is required to apply actions." }),
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
      An,
      {
        video: he,
        review: b,
        targetLabel: Pt,
        pending: _,
        refreshing: x || !!oe,
        error: rt,
        canWrite: a,
        assessmentReady: (D == null ? void 0 : D.kind) === "ready",
        selected: le.has(he.id),
        hasPrevious: P.indexOf(he.id) > 0,
        hasNext: P.indexOf(he.id) >= 0 && P.indexOf(he.id) < P.length - 1,
        onToggleSelected: () => Re((o) => ft(o, he.id)),
        onPrevious: () => ot(-1),
        onNext: () => ot(1),
        onClose: () => {
          we(!1), B(G.current);
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
          Et(!1), B(G.current, !1);
        }
      }
    ),
    J && /* @__PURE__ */ n(
      Yt,
      {
        reviews: t,
        activeReview: T,
        initialEdit: se,
        onSave: Mt,
        onChoose: at,
        onClose: () => {
          j(!1), se && B(G.current, !1);
        }
      }
    )
  ] });
  async function ke(o, f) {
    const m = G.current, C = Math.max(0, P.indexOf(m ?? -1));
    try {
      const M = (await pe(o, f)).items.map((H) => H.id);
      ue(
        (H) => new Set([...H].filter((Ie) => M.includes(Ie)))
      );
      const ne = Jt(M, m, C);
      te(ne), ce.current || B(ne, !1);
    } catch {
    }
  }
  function $t(o) {
    if (_ || x || !b || !T) return;
    const f = Xe(
      o,
      T.view.objectFilter
    ), m = {
      ...b,
      view: {
        ...b.view,
        objectFilter: f ? T.view.objectFilter : o
      }
    }, C = Se(m) !== Se(T), K = C ? m : T;
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
        disabled: _ || x,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          Rr,
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
              _ || x || f.page === Number(L.page) || Sn(
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
      En,
      {
        video: fn(o, b, $e.ids),
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
function Sn(e, t, r, i, s) {
  r(e), s(), i(t, e).catch(() => {
  });
}
function ft(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Nn(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function En({
  video: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: s,
  onFocus: d,
  onToggle: l,
  onPreview: y,
  onNavigate: E
}) {
  const h = fr(e), a = F(null), c = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, w = !!(c.date || c.studioName), q = !!(c.performers.length || c.tags.length);
  return Er(() => {
    const v = a.current;
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
      i ? `Deselect ${h}` : `Select ${h}`
    );
    const g = v.querySelector(
      'button[title="Quick View"]'
    );
    g && g.setAttribute("aria-label", `Preview ${h}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (v) => {
        a.current = v, s(v);
      },
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${h}${i ? ", selected" : ""}`,
      onFocus: d,
      onClick: (v) => {
        d(), v.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${t} ${w ? "has-card-metadata" : "no-card-metadata"} ${q ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          Ir,
          {
            video: c,
            selected: i,
            onSelect: l,
            onNavigate: E,
            onQuickView: y,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t === "wall" && /* @__PURE__ */ n(Cn, { video: e })
      ]
    }
  );
}
function Cn({ video: e }) {
  const t = F(null), r = F(null), [i, s] = S(!1), [d, l] = S(!1), [y, E] = S(!1);
  return Y(() => {
    const h = t.current;
    if (!h || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      s(!0), l(!0);
      return;
    }
    const a = new IntersectionObserver(
      ([w]) => s(w.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), c = new IntersectionObserver(
      ([w]) => l(w.isIntersecting && w.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return a.observe(h), c.observe(h), () => {
      a.disconnect(), c.disconnect();
    };
  }, [e.id, e.files.length]), Y(() => {
    if (!i) {
      E(!1);
      return;
    }
    const h = new AbortController();
    return U(rn(e.id), {
      signal: h.signal
    }).then((a) => {
      h.signal.aborted || E(a.available === !0);
    }).catch(() => {
      h.signal.aborted || E(!1);
    }), () => h.abort();
  }, [i, e.id]), Y(() => {
    const h = r.current;
    h && (d ? Promise.resolve(h.play()).catch(() => {
    }) : h.pause());
  }, [y, d]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: y && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: tn(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function An({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: s,
  error: d,
  canWrite: l,
  assessmentReady: y,
  selected: E,
  hasPrevious: h,
  hasNext: a,
  onToggleSelected: c,
  onPrevious: w,
  onNext: q,
  onClose: v,
  onAction: N
}) {
  const k = F(null), O = F(null), R = e.files[0], g = fr(e);
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
      !p.repeat && !i && !s && (p.key.toLowerCase() === "n" && h && w(), p.key.toLowerCase() === "m" && a && q());
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
      "aria-label": `Review preview: ${g}`,
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
              disabled: !h || i || s,
              onClick: w,
              children: /* @__PURE__ */ n($r, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !a || i || s,
              onClick: q,
              children: /* @__PURE__ */ n(Lr, {})
            }
          ),
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: g }),
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
              onClick: c,
              disabled: s,
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
              "aria-label": `Open ${g} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ n(Dr, {})
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
          kr,
          {
            autostart: !0,
            streamUrl: en(e.id),
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
        d && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: d }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((p, $) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: i || s || !l || Qe(p) && !y,
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
  onChoose: d,
  onClose: l
}) {
  const [y, E] = S(
    () => r && t ? structuredClone(t) : null
  ), [h, a] = S(""), [c, w] = S(!1), q = F(null);
  Y(() => {
    var I, p;
    const g = document.activeElement, A = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (p = (I = q.current) == null ? void 0 : I.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || p.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = A, g == null || g.focus({ preventScroll: !0 });
    };
  }, []);
  function v(g) {
    var p, $, J;
    if (g.defaultPrevented) {
      g.stopPropagation();
      return;
    }
    if (g.key === "Escape") {
      X(g), c || l();
      return;
    }
    if (g.key !== "Tab") {
      g.stopPropagation();
      return;
    }
    const A = [
      ...((p = q.current) == null ? void 0 : p.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((j) => j.offsetParent !== null);
    if (!A.length) {
      X(g), ($ = q.current) == null || $.focus();
      return;
    }
    const I = A.indexOf(
      document.activeElement
    );
    g.shiftKey && I <= 0 ? (X(g), (J = A.at(-1)) == null || J.focus()) : !g.shiftKey && I === A.length - 1 ? (X(g), A[0].focus()) : g.stopPropagation();
  }
  function N(g) {
    E(
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
    if (!y || gt(y)) {
      a(y ? gt(y) : "Choose a review.");
      return;
    }
    const g = { ...y, name: y.name.trim() }, A = e.some((I) => I.id === g.id) ? e.map((I) => I.id === g.id ? g : I) : [...e, g];
    w(!0), a("");
    try {
      if (!await s(A)) throw new Error("Could not save reviews.");
      d(g.id), l();
    } catch (I) {
      a(
        "Could not save reviews. Your edits are still open. " + (I instanceof Error ? I.message : "Retry saving.")
      );
    } finally {
      w(!1);
    }
  }
  async function O(g) {
    if (!c) {
      w(!0), a("");
      try {
        if (!await s(g)) throw new Error("Could not save reviews.");
      } catch (A) {
        a(
          A instanceof Error ? A.message : "Could not save reviews."
        );
      } finally {
        w(!1);
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
      w(!0), a("");
      try {
        const p = xe(await A.text());
        if (!await s(mt(e, p)))
          throw new Error("Could not save reviews.");
      } catch (p) {
        a(
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
            /* @__PURE__ */ n("h2", { children: i ? "Adjust queue temporarily" : y ? e.some((g) => g.id === y.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: i ? "Apply changes for this session. Saved review settings stay available through Reset to saved queue." : "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: c,
              onClick: l,
              children: /* @__PURE__ */ n(ir, {})
            }
          )
        ] }),
        h && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: h }),
        /* @__PURE__ */ n("fieldset", { disabled: c, className: "dq-manager-content", children: y ? /* @__PURE__ */ n(
          qn,
          {
            draft: y,
            temporary: i,
            saving: c,
            setDraft: E,
            onSave: () => void k(),
            onCancel: l
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
                  /* @__PURE__ */ n(jr, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ u("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(Fr, {}),
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
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((g) => /* @__PURE__ */ u("article", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ n("strong", { children: g.name }),
              /* @__PURE__ */ n("p", { children: g.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => N(g), children: [
              /* @__PURE__ */ n(rr, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => N({
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
                  window.confirm(`Delete review “${g.name}”?`) && O(
                    e.filter((A) => A.id !== g.id)
                  );
                },
                children: /* @__PURE__ */ n(or, {})
              }
            )
          ] }, g.id)) })
        ] }) })
      ] })
    }
  );
}
function qn({
  draft: e,
  temporary: t = !1,
  saving: r = !1,
  setDraft: i,
  onSave: s,
  onCancel: d
}) {
  const [l, y] = S("Review"), E = F(/* @__PURE__ */ new WeakMap()), h = (c) => {
    let w = E.current.get(c);
    return w || (w = crypto.randomUUID(), E.current.set(c, w)), w;
  }, a = (c, w) => i({
    ...e,
    actions: e.actions.map(
      (q, v) => v === c ? w : q
    )
  });
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    !t && /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      Or,
      {
        tabs: ["Review", "Queue", "Appearance", "Actions"].map((c) => ({
          key: c,
          label: c,
          count: c === "Actions" ? e.actions.length : void 0,
          disabled: r
        })),
        activeTab: l,
        onTabChange: y
      }
    ) }),
    /* @__PURE__ */ u("div", { className: "dq-editor-body", children: [
      !t && /* @__PURE__ */ u("section", { hidden: l !== "Review", className: "dq-editor-section", children: [
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
              onChange: (c) => i({ ...e, name: c.target.value })
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
          children: /* @__PURE__ */ n(Gt, { draft: e, onChange: i, presentation: !1 })
        }
      ),
      !t && /* @__PURE__ */ n(
        "section",
        {
          hidden: l !== "Appearance",
          className: "dq-editor-section",
          children: /* @__PURE__ */ n(Gt, { draft: e, onChange: i, queue: !1 })
        }
      ),
      !t && /* @__PURE__ */ u("section", { hidden: l !== "Actions", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Actions" }),
        /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
        /* @__PURE__ */ n(
          Ut,
          {
            items: e.actions,
            getKey: (c) => c.id,
            disabled: r,
            className: "dq-sortable-list",
            onReorder: (c) => i({ ...e, actions: c }),
            renderItem: (c, { index: w, dragHandleProps: q, isOver: v }) => /* @__PURE__ */ u(
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
                    /* @__PURE__ */ n("strong", { children: c.label || "New action" }),
                    /* @__PURE__ */ n("div", { className: "dq-row", children: /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        onClick: () => i({
                          ...e,
                          actions: [
                            ...e.actions.slice(0, w + 1),
                            {
                              ...structuredClone(c),
                              id: crypto.randomUUID(),
                              label: c.label + " copy",
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
                          value: c.shortcut ?? "auto",
                          onChange: (N) => a(w, {
                            ...c,
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
                          value: c.label,
                          onChange: (N) => a(w, {
                            ...c,
                            label: N.target.value
                          })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ n(
                    Ut,
                    {
                      items: c.steps,
                      getKey: h,
                      disabled: r,
                      className: "dq-sortable-list",
                      onReorder: (N) => a(w, { ...c, steps: N }),
                      renderItem: (N, { index: k, dragHandleProps: O, isOver: R }) => /* @__PURE__ */ n(
                        Rn,
                        {
                          dragHandleProps: O,
                          saving: r,
                          isOver: R,
                          step: N,
                          index: k,
                          onChange: (g) => {
                            E.current.set(g, h(N)), a(w, {
                              ...c,
                              steps: c.steps.map(
                                (A, I) => I === k ? g : A
                              )
                            });
                          },
                          onRemove: () => a(w, {
                            ...c,
                            steps: c.steps.filter(
                              (g, A) => A !== k
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
                        onClick: () => a(w, {
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
            const c = URL.createObjectURL(
              new Blob([JSON.stringify([e], null, 2)], {
                type: "application/json"
              })
            ), w = document.createElement("a");
            w.href = c, w.download = "data-quality-review.json", w.click(), URL.revokeObjectURL(c);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: d, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: s, children: t ? "Apply temporary queue" : "Save review" })
    ] })
  ] });
}
function Rn({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: i,
  isOver: s,
  onChange: d,
  onRemove: l
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
        onChange: (y) => d({ ...e, mode: y.target.value }),
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
        onChange: (y) => d({ ...e, tagIds: y }),
        placeholder: "Choose tags",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: l, children: /* @__PURE__ */ n(or, {}) })
  ] });
}
async function kn() {
  const e = await U("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const l = JSON.parse(r);
      Array.isArray(l.reviews) && (i = JSON.stringify(l.reviews, null, 2));
    } catch {
    }
  const s = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), d = document.createElement("a");
  d.href = s, d.download = "data-quality-browser-recovery.json", d.click(), URL.revokeObjectURL(s);
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
const Mn = { components: { DataQualityPage: vn } };
export {
  vn as DataQualityPage,
  Mn as default,
  Xe as objectFiltersEqual
};
