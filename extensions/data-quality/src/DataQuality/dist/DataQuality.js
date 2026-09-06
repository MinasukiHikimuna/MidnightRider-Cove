import { jsxs as c, jsx as n, Fragment as fe } from "react/jsx-runtime";
import { useState as v, useEffect as ee, useMemo as Dt, useRef as _, useCallback as we } from "react";
import { VIDEO_SORT_OPTIONS as Ut, FilterDialog as br, VIDEO_CRITERIA as vr, EntityReferenceMultiSelector as pt, DetailListPagination as Sr, VideoPlayer as Nr, getResolutionLabel as Er, formatDuration as Cr, EntityDetailTabs as Ar, SortableList as _t } from "@cove/runtime/components";
import { Pencil as Zt, AlertTriangle as ht, LayoutGrid as qr, List as Rr, Grid3X3 as Ir, ZoomOut as kr, ZoomIn as Or, Film as jt, Loader2 as er, ChevronLeft as Tr, ChevronRight as Pr, ExternalLink as xr, X as tr, Plus as Mr, Upload as $r, Trash2 as rr, Check as Lr, Play as Dr, GripVertical as nr } from "@cove/runtime/lucide-react";
import { extensionFetch as Ur } from "@cove/runtime/api";
function ke(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function gt(e) {
  if (e.actions.some(ir))
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
function be(e) {
  const t = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(100, t(e.perPage, 40)))
  };
}
function Ft(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function ze(e) {
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
  ) && !ir(e);
}
function Ge(e) {
  return e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  );
}
function ir(e) {
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
function Oe(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && _r(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
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
function _r(e) {
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
function Jt(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function jr(e, t, r, i) {
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
function Fr(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((s) => r.has(s));
  for (const s of t)
    i ? r.delete(s) : r.add(s);
  return r;
}
function Jr(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const or = "ext:com.midnightrider.data-quality:configuration", Kr = "ext:cove-data-quality:video-reviews", yt = "ext:com.midnightrider.data-quality:progress", Te = /* @__PURE__ */ new Map(), Ve = /* @__PURE__ */ new Map(), dt = (e, t) => e.includes("*") || e.includes(t), He = (e) => j(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Br = () => ({
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
    reviews: Oe(JSON.stringify(t.reviews)),
    deletedIds: wt(t.deletedIds),
    importedIds: wt(t.importedIds)
  };
}
function zr(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const s of t) {
    const d = localStorage.getItem(s);
    if (d !== null) {
      const l = Oe(d);
      r ?? (r = l), l.forEach((w) => i.add(w.id));
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
async function sr(e) {
  const t = await j("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function ar(e, t) {
  const r = (Ve.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Ve.set(e, r), r.finally(() => {
    Ve.get(e) === r && Ve.delete(e);
  }).catch(() => {
  }), r;
}
let Ie = null;
function Vr() {
  if (Ie) return Ie;
  const e = Qr();
  return Ie = e, e.finally(() => {
    Ie === e && (Ie = null);
  }).catch(() => {
  }), e;
}
async function Qr() {
  var h;
  const e = await j("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = dt(e.permissions, "savedfilters.read"), s = i && dt(e.permissions, "savedfilters.write"), d = i ? (await He(or)).filter((N) => N.name === "Data Quality configuration").sort((N, A) => N.id - A.id) : [];
  if (d.length > 1) {
    const N = (A) => {
      const { revision: C, ...k } = Ee(A.uiOptions);
      return JSON.stringify(k);
    };
    if (d.some((A) => N(A) !== N(d[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (s)
      for (const A of d.slice(1))
        await j(`/api/savedfilters/${A.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${A.id}` })
        });
    d.splice(1);
  }
  let l = d.length ? Ee(d[0].uiOptions) : Br();
  const w = localStorage.getItem(`${r}:migrated`) === "true", S = localStorage.getItem(r), g = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && S && (l = Ee(S));
  let a = !d.length;
  if (d.length && g && S) {
    const N = Ee(S);
    if (N.reviews.some((C) => {
      const k = l.reviews.find((P) => P.id === C.id);
      return k && JSON.stringify(k) !== JSON.stringify(C);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const A = [
      .../* @__PURE__ */ new Set([...l.deletedIds, ...N.deletedIds])
    ];
    l = {
      ...l,
      reviews: mt(l.reviews, N.reviews).filter(
        (C) => !A.includes(C.id)
      ),
      deletedIds: A,
      importedIds: [
        .../* @__PURE__ */ new Set([...l.importedIds, ...N.importedIds])
      ]
    }, a = !0;
  }
  if (!w) {
    const N = JSON.stringify(l), A = zr(t);
    if (d.length && A.reviews.some((I) => {
      const p = l.reviews.find((E) => E.id === I.id);
      return p && JSON.stringify(p) !== JSON.stringify(I);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const C = i ? (await He(Kr)).flatMap(
      (I) => Oe(I.uiOptions ?? "[]")
    ) : [], k = A.known.filter(
      (I) => !A.reviews.some((p) => p.id === I)
    ), P = /* @__PURE__ */ new Set([...l.deletedIds, ...k]);
    l = {
      ...l,
      reviews: mt(
        A.reviews,
        l.reviews,
        C.filter(
          (I) => !A.known.includes(I.id) && !l.importedIds.includes(I.id)
        )
      ).filter((I) => !P.has(I.id)),
      deletedIds: [...P],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...l.importedIds,
          ...A.known,
          ...C.map((I) => I.id)
        ])
      ]
    }, a || (a = JSON.stringify(l) !== N);
  }
  const u = {
    userId: t,
    recordId: (h = d[0]) == null ? void 0 : h.id,
    config: l,
    readable: i,
    writable: s,
    durable: s
  };
  if (Te.set(r, u), a && s) {
    const N = l;
    d.length && (u.config = Ee(d[0].uiOptions)), await lr(r, N), l = u.config;
  } else d.length || (localStorage.setItem(r, JSON.stringify(l)), !i && (!w || g) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (s)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: l.reviews,
    storageKey: r,
    canWrite: dt(e.permissions, "videos.write"),
    canConfigure: !i || s,
    storageNotice: i ? s ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function lr(e, t) {
  const r = Te.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await sr(r), r.recordId != null) {
      const d = await j(
        `/api/savedfilters/${r.recordId}`
      );
      if (Ee(d.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const s = await j(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: or,
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
function Gr(e, t) {
  return Oe(JSON.stringify(t)), ar(e, async () => {
    const r = Te.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((s) => !t.some((d) => d.id === s.id)).map((s) => s.id);
    await lr(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((s) => !t.some((d) => d.id === s))
    });
  });
}
function Kt(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Hr(e, t) {
  const r = Te.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), s = i ? Kt(i) : null;
  if (!r.readable) return s;
  const d = (await He(yt)).find(
    (w) => w.name === t
  ), l = d ? Kt(d.uiOptions) : null;
  return s && (!l || s.updatedAt > l.updatedAt) ? s : l;
}
function Wr(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return ar(i, async () => {
    const s = Te.get(e);
    if (!(s != null && s.writable)) return;
    await sr(s);
    const d = (await He(yt)).find(
      (l) => l.name === t
    );
    await j(
      d ? `/api/savedfilters/${d.id}` : "/api/savedfilters",
      {
        method: d ? "PUT" : "POST",
        body: JSON.stringify({
          mode: yt,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Pe = "confirmed_absent_tags", vt = "Confirmed absent tags", Xr = {
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
function We(e) {
  return Array.isArray(e) ? e.map(We) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? Xr[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === Pe.toLowerCase() ? r.toLowerCase() : We(r)
    ])
  ) : e;
}
async function j(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await Ur(e, { ...t, headers: r });
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
async function Bt(e, t, r) {
  const i = { ...e.view.objectFilter }, s = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return j("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      We({
        findFilter: be(t),
        objectFilter: i,
        filterExpression: s
      })
    )
  });
}
function cr(e) {
  return `/api/videos/${e.id}/image?max=640&v=${encodeURIComponent(e.updatedAt)}`;
}
function Yr(e) {
  return `/api/stream/video/${e}`;
}
function zt(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Zr(e) {
  return `/api/stream/video/${e}/preview`;
}
function en(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function tn(e) {
  return e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function St(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await j(`/api/tags/${r}`), t.add(r);
    for (let i = 1; ; i++) {
      const s = await j("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          We({
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
function rn(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${Pe} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function Nt() {
  const t = (await j(
    "/api/custom-fields"
  )).find(
    (i) => i.key.toLowerCase() === Pe.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${vt} custom field before applying tag assessments.`
    };
  const r = rn(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function nn() {
  const e = await Nt();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await j("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: Pe,
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
function Xe(e) {
  return [...new Set(e)];
}
function on(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${Pe} value is not a valid tag list.`
    );
  return Xe(e);
}
function sn(e) {
  return Xe(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function an(e, t) {
  let r;
  try {
    r = await Nt();
  } catch (g) {
    throw new Error(
      `Could not verify the ${vt} custom field. ${g instanceof Error ? g.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const i = await Promise.all(
    e.steps.map(async (g) => ({
      ...g,
      tagIds: g.mode === "REMOVE_TREE" ? await St(g.tagIds) : Xe(g.tagIds)
    }))
  ), s = i.filter(
    (g) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(g.mode)
  ), d = i.filter(
    (g) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(g.mode)
  ), l = Xe(t), w = r.definition.key;
  let S = 0;
  for (const g of l)
    try {
      const a = await j(`/api/videos/${g}`), u = sn(a), h = { ...a.customFields ?? {} }, N = h[w], A = on(N), C = new Set(u), k = new Set(A);
      for (const E of s)
        for (const R of E.tagIds)
          E.mode === "ADD" ? C.add(R) : C.delete(R);
      for (const E of d)
        for (const R of E.tagIds)
          E.mode === "MARK_PRESENT" ? (C.add(R), k.delete(R)) : E.mode === "MARK_ABSENT" ? (C.delete(R), k.add(R)) : k.delete(R);
      const P = [...C], I = [...k];
      JSON.stringify(u) === JSON.stringify(P) && JSON.stringify(A) === JSON.stringify(I) && (N === void 0 ? I.length === 0 : JSON.stringify(N) === JSON.stringify(A)) || await j(`/api/videos/${g}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: P,
          customFields: {
            ...h,
            [w]: I
          }
        })
      }), S++;
    } catch (a) {
      throw new Error(
        `Assessment stopped after ${S} video${S === 1 ? "" : "s"} completed; video ${g} was affected. Refresh and inspect it before retrying. ${a instanceof Error ? a.message : "Request failed."}`
      );
    }
}
async function ln(e, t) {
  if (!bt(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (Ge(e)) {
    await an(e, t);
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
function cn(e) {
  var l, w;
  const [t, r] = v({}), [i, s] = v(""), d = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotationParents) ?? [],
      ...((w = e == null ? void 0 : e.presentation) == null ? void 0 : w.binParents) ?? []
    ])
  ]);
  return ee(() => {
    let S = !0;
    return r({}), s(""), Promise.all(
      JSON.parse(d).map(
        async (g) => [g, await St([g])]
      )
    ).then((g) => {
      S && r(Object.fromEntries(g));
    }).catch(() => {
      S && s(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      S = !1;
    };
  }, [d]), { ids: t, error: i };
}
function dn(e, t, r) {
  const i = t == null ? void 0 : t.presentation, s = (i == null ? void 0 : i.annotations) ?? ["date", "studio", "performers"], d = (i == null ? void 0 : i.annotationParents) ?? [];
  return [
    s.includes("date") && e.date,
    s.includes("studio") && e.studioName,
    s.includes("performers") && e.performers.map((l) => l.name).join(", "),
    s.includes("tags") && (e.tags ?? []).filter(
      (l) => !d.length || d.some(
        (w) => {
          var S;
          return w !== l.id && ((S = r[w]) == null ? void 0 : S.includes(l.id));
        }
      )
    ).map((l) => l.name).join(", ")
  ].filter(Boolean).join(" · ");
}
function un({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: s
}) {
  var w, S, g;
  const d = new Set(
    (((w = t.presentation) == null ? void 0 : w.binParents) ?? []).flatMap(
      (a) => (r[a] ?? []).filter((u) => u !== a)
    )
  ), l = /* @__PURE__ */ new Map();
  for (const a of e)
    for (const u of a.tags ?? [])
      if (d.has(u.id)) {
        const h = l.get(u.id) ?? { name: u.name, count: 0 };
        h.count++, l.set(u.id, h);
      }
  return (g = (S = t.presentation) == null ? void 0 : S.binParents) != null && g.length ? /* @__PURE__ */ c("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...l].sort((a, u) => a[1].name.localeCompare(u[1].name)).map(([a, u]) => /* @__PURE__ */ c(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => s(a),
        children: [
          u.name,
          " (",
          u.count,
          ")"
        ]
      },
      a
    )),
    !l.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function fn(e, t) {
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
function Vt({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [s, d] = v(!1), l = e.view.filter, w = (a) => t({
    ...e,
    view: { ...e.view, filter: { ...l, ...a } }
  }), S = e.presentation ?? {}, g = (a) => t({ ...e, presentation: { ...S, ...a } });
  return /* @__PURE__ */ c(fe, { children: [
    i && /* @__PURE__ */ c("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ c("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(l.q ?? ""),
            onChange: (a) => w({ q: a.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ c("div", { className: "dq-field-grid", children: [
        /* @__PURE__ */ c("label", { children: [
          "Sort",
          /* @__PURE__ */ c(
            "select",
            {
              "aria-label": "Sort",
              value: String(l.sort ?? "date"),
              onChange: (a) => w({ sort: a.target.value, sorts: void 0 }),
              children: [
                !Ut.some((a) => a.value === l.sort) && l.sort != null && /* @__PURE__ */ n("option", { value: String(l.sort), children: String(l.sort) }),
                Ut.map((a) => /* @__PURE__ */ n("option", { value: a.value, children: a.label }, a.value))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ c("label", { children: [
          "Direction",
          /* @__PURE__ */ c(
            "select",
            {
              "aria-label": "Direction",
              value: String(l.direction ?? "desc"),
              onChange: (a) => w({ direction: a.target.value }),
              children: [
                /* @__PURE__ */ n("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ n("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ c("label", { children: [
          "Videos per page",
          /* @__PURE__ */ n(
            "input",
            {
              type: "number",
              min: "1",
              max: "100",
              value: Number(l.perPage) || 40,
              onChange: (a) => w({
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
      /* @__PURE__ */ c("p", { children: [
        Object.keys(e.view.objectFilter).length ? "Video filters configured" : "No video filters",
        ". Choose which videos enter the queue."
      ] }),
      s && /* @__PURE__ */ n("div", { onKeyDown: (a) => a.stopPropagation(), children: /* @__PURE__ */ n(
        br,
        {
          open: !0,
          onClose: () => d(!1),
          criteria: vr,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: !0,
          subjectLabel: "videos",
          onApply: (a) => {
            t({ ...e, view: { ...e.view, objectFilter: a } }), d(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ c(fe, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Choose how videos and tags appear while reviewing." }),
      /* @__PURE__ */ c("div", { className: "dq-field-grid", children: [
        /* @__PURE__ */ c("label", { children: [
          "Preferred view",
          /* @__PURE__ */ n(
            "select",
            {
              value: e.view.displayMode === "tagger" ? "grid" : e.view.displayMode,
              onChange: (a) => t({
                ...e,
                view: {
                  ...e.view,
                  displayMode: a.target.value
                }
              }),
              children: ["grid", "list", "wall"].map((a) => /* @__PURE__ */ n("option", { children: a }, a))
            }
          )
        ] }),
        /* @__PURE__ */ c("label", { children: [
          "Preferred card width",
          /* @__PURE__ */ n(
            "select",
            {
              value: S.cardSize ?? 180,
              onChange: (a) => g({
                cardSize: Number(a.target.value)
              }),
              children: [130, 180, 260, 380].map((a) => /* @__PURE__ */ c("option", { value: a, children: [
                a,
                " px"
              ] }, a))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n("h4", { children: "Card annotations" }),
      /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((a) => {
        const u = S.annotations ?? [
          "date",
          "studio",
          "performers"
        ];
        return /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: u.includes(a),
              onChange: (h) => g({
                annotations: h.target.checked ? [...u, a] : u.filter((N) => N !== a)
              })
            }
          ),
          a
        ] }, a);
      }) }),
      /* @__PURE__ */ n("p", { children: "Show annotated tags only below these parents (empty means all tags)." }),
      /* @__PURE__ */ n(
        pt,
        {
          entityType: "tag",
          values: S.annotationParents ?? [],
          onChange: (a) => g({ annotationParents: a }),
          allowCreate: !1
        }
      ),
      /* @__PURE__ */ n("h4", { children: "Tag bins" }),
      /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
      /* @__PURE__ */ n(
        pt,
        {
          entityType: "tag",
          values: S.binParents ?? [],
          onChange: (a) => g({ binParents: a }),
          allowCreate: !1
        }
      )
    ] })
  ] });
}
const Qe = 180, ut = 115, Qt = 380;
function Gt(e) {
  return e.view.displayMode === "wall" || e.view.displayMode === "list" ? e.view.displayMode : "grid";
}
function pn() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Ht(e) {
  const t = new URLSearchParams(window.location.search);
  e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function hn(e) {
  return be({ ...e, page: 1 });
}
function gn(e, t) {
  if (t === 0) return "Showing 0 of 0";
  const r = Number(e.perPage) || 40, i = Math.max(1, Math.ceil(t / r)), s = Math.min(Math.max(1, Number(e.page) || 1), i), d = (s - 1) * r + 1, l = Math.min(s * r, t);
  return `Showing ${d.toLocaleString()}-${l.toLocaleString()} of ${t.toLocaleString()}`;
}
function dr(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Z(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
function mn({
  onNavigate: e
}) {
  const [t, r] = v([]), [i] = v(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [s, d] = v(""), [l, w] = v(!0), [S, g] = v(""), [a, u] = v(!1), [h, N] = v(!0), [A, C] = v(""), [k, P] = v(""), [I, p] = v(!1), [E, R] = v(!1), [O, m] = v(pn), [$, J] = v(!1), [K, ae] = v(!1), [oe, le] = v(!1), [G, Ce] = v(
    null
  ), z = t.find((o) => o.id === O) ?? null, y = Dt(
    () => (G == null ? void 0 : G.id) === O && z ? { ...z, view: G.view } : z,
    [G, O, z]
  ), xe = cn(y), [D, Ae] = v({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [ur, fr] = v({
    page: 1,
    perPage: 40
  }), [te, Et] = v({ items: [], totalCount: 0 }), [x, Me] = v(!1), [se, Ct] = v(""), [ce, pe] = v(() => /* @__PURE__ */ new Set()), Ye = _(ce);
  Ye.current = ce;
  const ve = _(/* @__PURE__ */ new Map()), [H, ne] = v(null), W = _(H);
  W.current = H;
  const [ie, Se] = v(!1), de = _(ie);
  de.current = ie;
  const At = _(null), [he, Ze] = v("grid"), [ge, et] = v(Qe), [F, tt] = v(!1), $e = _(!1), [pr, rt] = v(""), [qt, Le] = v(""), [nt, qe] = v(""), [L, Rt] = v(null), [It, De] = v(""), [Ue, _e] = v(!1), it = _(/* @__PURE__ */ new Map()), kt = _(null), Ne = _(0), je = _(0), Fe = _(null), Ot = we(async () => {
    w(!0), g("");
    try {
      const o = await Vr();
      r(o.reviews), d(o.storageKey), u(o.canWrite), N(o.canConfigure ?? !0), C(o.storageNotice ?? ""), O && !o.reviews.some((f) => f.id === O) && (m(""), Ht(""));
    } catch (o) {
      g(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      w(!1);
    }
  }, [O]);
  ee(() => {
    Ot();
  }, []);
  const Je = we(async () => {
    De("");
    try {
      Rt(await Nt());
    } catch (o) {
      Rt(null), De(
        "Tag assessment setup could not be checked. " + (o instanceof Error ? o.message : "Request failed.")
      );
    }
  }, []);
  ee(() => {
    Je();
  }, [Je]);
  const me = we(
    async (o, f) => {
      var U;
      const b = ++Ne.current;
      (U = Fe.current) == null || U.abort();
      const q = new AbortController();
      Fe.current = q, f = be(f), Ae(f), Me(!0), Ct("");
      try {
        let T = await Bt(
          o,
          f,
          q.signal
        );
        const X = Math.max(
          1,
          Math.ceil(T.totalCount / Number(f.perPage))
        );
        return Number(f.page) > X && (f = { ...f, page: X }, T = await Bt(
          o,
          f,
          q.signal
        )), b === Ne.current && (Et(T), Ae(f), fr(f)), T;
      } catch (T) {
        throw b === Ne.current && Ct(
          T instanceof Error ? T.message : "Could not load the review queue."
        ), T;
      } finally {
        b === Ne.current && Me(!1);
      }
    },
    []
  );
  ee(() => {
    var f;
    if (je.current += 1, Ne.current += 1, (f = Fe.current) == null || f.abort(), R(!1), P(""), p(!1), pe(/* @__PURE__ */ new Set()), ve.current.clear(), ne(null), Se(!1), tt(!1), $e.current = !1, rt(""), Le(""), qe(""), Et({ items: [], totalCount: 0 }), !y) {
      Me(!1);
      return;
    }
    let o = !0;
    return Me(!0), (async () => {
      var T;
      let b = null;
      try {
        b = await Hr(s, y.id);
      } catch (X) {
        o && (p(!0), P(
          X instanceof Error ? X.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const q = (b == null ? void 0 : b.signature) === ze(y) ? b : null, U = q ? be(q.filter) : hn(y.view.filter);
      Ae(U), Ze((q == null ? void 0 : q.displayMode) ?? Gt(y)), et(
        q ? q.cardSize ?? Qe : ((T = y.presentation) == null ? void 0 : T.cardSize) ?? Qe
      );
      try {
        const X = await me(y, U);
        if (!o) return;
        const V = Ft(
          X.items.map((ye) => ye.id),
          (q == null ? void 0 : q.focusedId) ?? null,
          (q == null ? void 0 : q.index) ?? 0
        );
        ne(V), B(V);
      } catch {
      }
      o && R(!0);
    })(), () => {
      var b;
      o = !1, je.current++, Ne.current++, (b = Fe.current) == null || b.abort();
    };
  }, [y == null ? void 0 : y.id]);
  const M = Dt(
    () => te.items.map((o) => o.id),
    [te.items]
  );
  ee(() => {
    if (!E || !y || !s || x || se || F || (G == null ? void 0 : G.id) === y.id || I)
      return;
    const o = {
      version: 1,
      signature: ze(y),
      filter: D,
      focusedId: H,
      index: Math.max(0, M.indexOf(H ?? -1)),
      displayMode: he,
      cardSize: ge,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        s + ":progress:" + y.id,
        JSON.stringify(o)
      );
    } catch {
    }
    if (k) return;
    let f = !0;
    const b = window.setTimeout(() => {
      Wr(s, y.id, o).catch((q) => {
        f && P(
          "Progress is kept in this browser, but account sync failed. " + (q instanceof Error ? q.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      f = !1, window.clearTimeout(b);
    };
  }, [
    E,
    s,
    y,
    x,
    se,
    F,
    D,
    H,
    M,
    he,
    ge,
    G,
    k,
    I
  ]);
  const ot = te.items.find((o) => o.id === H) ?? null;
  ie && ot && (At.current = ot);
  const ue = ot ?? (ie ? At.current : null), hr = Jt(ce, H), Tt = ce.size > 0 ? `${ce.size} selected video${ce.size === 1 ? "" : "s"}` : H == null ? "no video" : "focused video", B = we((o, f = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const b = it.current.get(o);
      b == null || b.focus({ preventScroll: !0 }), f && (b == null || b.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  ee(() => {
    E && !de.current && B(W.current);
  }, [E, B]), ee(() => {
    x || !M.length || (W.current == null || !M.includes(W.current)) && (ne(M[0]), de.current || B(M[0]));
  }, [B, M, x]);
  const Re = we(
    (o) => {
      pe((f) => {
        const b = o(f);
        for (const q of /* @__PURE__ */ new Set([...f, ...b]))
          f.has(q) !== b.has(q) && ve.current.set(
            q,
            (ve.current.get(q) ?? 0) + 1
          );
        return b;
      });
    },
    []
  ), st = we(
    (o) => {
      if (!M.length) return;
      const f = Math.max(
        0,
        M.indexOf(W.current ?? M[0])
      ), b = M[Math.max(0, Math.min(M.length - 1, f + o))];
      ne(b), de.current || B(b);
    },
    [B, M]
  ), at = we(
    async (o) => {
      const f = Jt(
        Ye.current,
        W.current
      );
      if (!y || $e.current || x || se || !a || Ge(o) && (L == null ? void 0 : L.kind) !== "ready" || !f.length)
        return;
      const b = ++je.current, q = y.id, U = [...M], T = W.current, X = new Map(
        f.map((Q) => [Q, ve.current.get(Q) ?? 0])
      ), V = () => b === je.current && y.id === q;
      $e.current = !0, tt(!0), rt(
        Ye.current.size ? `${f.length} selected videos` : "the focused video"
      ), Le(""), qe("");
      let ye = !1;
      try {
        if (await ln(o, f), ye = !0, !V()) return;
        pe((Q) => {
          const Y = new Set(Q);
          for (const re of f)
            (ve.current.get(re) ?? 0) === X.get(re) && Y.delete(re);
          return Y;
        }), Le(
          `${o.label}: ${f.length} video${f.length === 1 ? "" : "s"} ${o.steps.length ? "updated" : "skipped"}.`
        );
      } catch (Q) {
        if (!V()) return;
        qe(
          Q instanceof Error ? Q.message : "Action failed."
        );
      }
      try {
        if (await tn(o), !V()) return;
        const Q = await me(y, D);
        if (!V()) return;
        let Y = Q.items.map((re) => re.id);
        if (!Y.length && Q.totalCount > 0 && Number(D.page) > 1) {
          const re = Math.max(1, Number(D.page) - 1), Be = { ...D, page: re };
          Ae(Be), Y = (await me(y, Be)).items.map((ct) => ct.id), pe(
            (ct) => new Set([...ct].filter((wr) => Y.includes(wr)))
          );
          const Lt = Y.at(-1) ?? null;
          ne(Lt), de.current || B(Lt);
        } else {
          pe(
            (Be) => new Set([...Be].filter(($t) => Y.includes($t)))
          );
          const re = jr(
            U,
            Y,
            T,
            ye && f.includes(T ?? -1)
          );
          ne(re), de.current && re == null && Se(!1), de.current || B(re);
        }
      } catch (Q) {
        V() && qe(
          (Y) => `${Y ? `${Y} ` : ""}${ye ? "The action completed, but " : ""}the queue could not be refreshed. ${Q instanceof Error ? Q.message : "Refresh failed."}`
        );
      } finally {
        V() && ($e.current = !1, tt(!1), rt(""));
      }
    },
    [
      a,
      L,
      me,
      D,
      B,
      M,
      x,
      se,
      y
    ]
  );
  function gr() {
    var b;
    const o = (b = kt.current) == null ? void 0 : b.firstElementChild, f = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, f.split(" ").filter(Boolean).length);
  }
  function mr(o) {
    if (o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || $ || oe) return;
    if (ie && o.key === "Escape") {
      Z(o), Se(!1), B(W.current);
      return;
    }
    if (!Jr(o.target)) return;
    if (o.key === "Escape") {
      Z(o), Re(() => /* @__PURE__ */ new Set());
      return;
    }
    const f = (y == null ? void 0 : y.actions.findIndex(
      (U, T) => ke(U, T) === o.key
    )) ?? -1;
    if (f >= 0 && (y != null && y.actions[f])) {
      Z(o), !F && !x && at(y.actions[f]);
      return;
    }
    if (!ie && o.key === " ") {
      Z(o), H != null && Re((U) => ft(U, H));
      return;
    }
    if (!ie && o.key.toLowerCase() === "a") {
      Z(o), Re(
        (U) => Fr(U, M)
      );
      return;
    }
    if (F || x || ie) return;
    if (o.key === "Enter" && H != null) {
      Z(o), Se(!0);
      return;
    }
    const b = gr(), q = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -b : o.key === "ArrowDown" ? b : 0;
    q && (Z(o), st(q));
  }
  function lt(o) {
    m(o), Ht(o);
  }
  async function Pt(o) {
    var b, q, U;
    if (!s) return !1;
    try {
      await Gr(s, o);
    } catch (T) {
      throw T;
    }
    r(o), O && !o.some((T) => T.id === O) && lt("");
    const f = o.find((T) => T.id === O);
    return f && z && JSON.stringify(f) !== JSON.stringify(z) && (f.view.displayMode !== z.view.displayMode && Ze(Gt(f)), ((b = f.presentation) == null ? void 0 : b.cardSize) !== ((q = z.presentation) == null ? void 0 : q.cardSize) && et(((U = f.presentation) == null ? void 0 : U.cardSize) ?? Qe), ze(f) !== ze(z) && (Ce(null), Ke(
      f,
      be({ ...f.view.filter, page: D.page })
    ))), !0;
  }
  if (l)
    return /* @__PURE__ */ n(Xt, { label: "Loading Data Quality reviews…" });
  if (S)
    return /* @__PURE__ */ c(fe, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void En().catch(
            (o) => g(
              "Could not export browser reviews. " + (o instanceof Error ? o.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        Yt,
        {
          message: S,
          onRetry: () => void Ot()
        }
      )
    ] });
  return /* @__PURE__ */ c("div", { className: "data-quality-page", onKeyDown: mr, children: [
    /* @__PURE__ */ c("header", { className: "data-quality-header", children: [
      /* @__PURE__ */ c("div", { children: [
        /* @__PURE__ */ n("h1", { children: "Data Quality" }),
        /* @__PURE__ */ n("p", { children: "A focused queue for previewing videos and applying saved review actions." })
      ] }),
      /* @__PURE__ */ c(
        "button",
        {
          className: "dq-button",
          type: "button",
          disabled: F || x || !h,
          onClick: () => {
            ae(!1), J(!0);
          },
          children: [
            /* @__PURE__ */ n(Zt, {}),
            " Manage reviews"
          ]
        }
      )
    ] }),
    A && /* @__PURE__ */ n("p", { className: "dq-status", children: A }),
    (L == null ? void 0 : L.kind) === "missing" && /* @__PURE__ */ c("div", { role: "status", className: "dq-status", children: [
      L.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: Ue,
          onClick: () => {
            _e(!0), De(""), nn().then(Je).catch(
              (o) => De(
                "Could not create the Confirmed absent tags custom field. " + (o instanceof Error ? o.message : "Request failed.")
              )
            ).finally(() => _e(!1));
          },
          children: Ue ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    ((L == null ? void 0 : L.kind) === "incompatible" || It) && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(ht, {}),
      It || (L == null ? void 0 : L.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: Ue,
          onClick: () => {
            _e(!0), Je().finally(
              () => _e(!1)
            );
          },
          children: Ue ? "Checking…" : "Check again"
        }
      )
    ] }),
    i && /* @__PURE__ */ c("details", { children: [
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
            ), b = document.createElement("a");
            b.href = f, b.download = "data-quality-unassigned-legacy-reviews.json", b.click(), URL.revokeObjectURL(f);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    k && /* @__PURE__ */ c("p", { role: "alert", children: [
      k,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            P(""), p(!1);
          },
          children: I ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    /* @__PURE__ */ c("section", { className: "dq-toolbar", children: [
      /* @__PURE__ */ c("label", { className: "dq-review-select", children: [
        "Review",
        /* @__PURE__ */ c(
          "select",
          {
            value: (y == null ? void 0 : y.id) ?? "",
            disabled: F,
            onChange: (o) => lt(o.target.value),
            children: [
              /* @__PURE__ */ n("option", { value: "", children: "Choose a review…" }),
              t.map((o) => /* @__PURE__ */ n("option", { value: o.id, children: o.name }, o.id))
            ]
          }
        )
      ] }),
      y && /* @__PURE__ */ n("span", { className: "dq-range-count", children: gn(ur, te.totalCount) }),
      y && /* @__PURE__ */ c(fe, { children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: F || x || !h,
            onClick: () => {
              ae(!0), J(!0);
            },
            children: "Edit review"
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: F || x,
            onClick: () => le(!0),
            children: "Adjust queue"
          }
        ),
        (G == null ? void 0 : G.id) === O && /* @__PURE__ */ c(fe, { children: [
          /* @__PURE__ */ n("span", { children: "Temporary queue" }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: F || x || !h,
              onClick: () => {
                z && Pt(
                  t.map(
                    (o) => o.id === O ? {
                      ...o,
                      view: {
                        ...y.view,
                        filter: { ...D, page: 1 }
                      }
                    } : o
                  )
                ).then(() => {
                  Ce(null), Le("Queue saved to this review.");
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
              disabled: F || x,
              onClick: () => {
                Ce(null), z && Ke(
                  z,
                  be({
                    ...z.view.filter,
                    page: D.page
                  })
                );
              },
              children: "Reset to saved queue"
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-review-description", children: y.description && /* @__PURE__ */ n("p", { children: y.description }) }),
        /* @__PURE__ */ n(
          "div",
          {
            className: "dq-view-switch flex min-h-10 items-center gap-0.5 rounded-lg border border-border bg-card/70 px-1.5 py-1 shadow-sm sm:min-h-0",
            role: "group",
            "aria-label": "Review view",
            children: [
              { mode: "grid", label: "Grid", Icon: qr },
              { mode: "list", label: "List", Icon: Rr },
              { mode: "wall", label: "Wall", Icon: Ir }
            ].map(({ mode: o, label: f, Icon: b }) => /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: `inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-transparent p-2 text-secondary hover:bg-card/80 hover:text-foreground focus:border-accent focus:outline-none sm:min-h-0 sm:min-w-0 sm:p-1.5 ${he === o ? "bg-background/60 text-accent shadow-sm" : ""}`,
                "aria-label": f,
                title: f,
                "aria-pressed": he === o,
                onClick: () => Ze(o),
                children: /* @__PURE__ */ n(b, { className: "h-3.5 w-3.5" })
              },
              o
            ))
          }
        ),
        he !== "list" && /* @__PURE__ */ c("div", { className: "hidden items-center gap-1 pl-1 md:flex", children: [
          /* @__PURE__ */ n(kr, { className: "h-3 w-3 text-muted" }),
          /* @__PURE__ */ n(
            "input",
            {
              "aria-label": `Card size: ${ge}px`,
              title: `Card size: ${ge}px`,
              type: "range",
              min: ut,
              max: Qt,
              step: "5",
              className: "themed-range-input h-1 w-16 cursor-pointer sm:w-20",
              value: ge,
              style: {
                "--range-fill": `${(ge - ut) / (Qt - ut) * 100}%`
              },
              onChange: (o) => et(Number(o.target.value))
            }
          ),
          /* @__PURE__ */ n(Or, { className: "h-3 w-3 text-muted" })
        ] })
      ] })
    ] }),
    y ? /* @__PURE__ */ c(fe, { children: [
      xe.error && /* @__PURE__ */ n("p", { role: "alert", children: xe.error }),
      /* @__PURE__ */ n(
        un,
        {
          videos: te.items,
          review: y,
          trees: xe.ids,
          disabled: F || x,
          onChoose: (o) => {
            const f = fn(y, o);
            Ce(f), Ke(f, { ...D, page: 1 });
          }
        }
      ),
      nt && !ie && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(ht, {}),
        nt
      ] }),
      qt && /* @__PURE__ */ n("p", { role: "status", className: "dq-status", children: qt }),
      /* @__PURE__ */ c("div", { className: "dq-workspace", children: [
        /* @__PURE__ */ c("main", { children: [
          xt("top"),
          x && !te.items.length && /* @__PURE__ */ n(Xt, { label: "Loading review queue…" }),
          se && !x && /* @__PURE__ */ n(
            Yt,
            {
              message: se,
              onRetry: () => void me(y, D).catch(() => {
              })
            }
          ),
          !x && !se && !te.items.length && /* @__PURE__ */ c("div", { className: "dq-empty", children: [
            /* @__PURE__ */ n(jt, {}),
            /* @__PURE__ */ n("p", { children: "No videos match this review." })
          ] }),
          !!te.items.length && /* @__PURE__ */ n("div", { ref: kt, children: he === "list" ? /* @__PURE__ */ n("div", { className: "dq-list", "data-review-layout": "list", children: te.items.map(Mt) }) : /* @__PURE__ */ n(
            "div",
            {
              className: "dq-grid",
              style: {
                "--dq-card-width": `${ge}px`
              },
              children: te.items.map(Mt)
            }
          ) }),
          xt("bottom")
        ] }),
        /* @__PURE__ */ c("aside", { className: "dq-actions", children: [
          /* @__PURE__ */ n("strong", { children: Tt }),
          y.actions.map((o, f) => /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              disabled: F || x || !!se || !a || Ge(o) && (L == null ? void 0 : L.kind) !== "ready" || !hr.length,
              onClick: () => void at(o),
              children: [
                ke(o, f) && /* @__PURE__ */ n("kbd", { children: ke(o, f) }),
                /* @__PURE__ */ n("span", { children: o.label }),
                /* @__PURE__ */ n("small", { children: o.steps.length ? `${o.steps.length} step(s)` : "Skip" })
              ]
            },
            o.id
          )),
          !y.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
          !a && /* @__PURE__ */ n("p", { children: "Video write permission is required to apply actions." }),
          F && /* @__PURE__ */ c("p", { role: "status", children: [
            /* @__PURE__ */ n(er, { className: "dq-spin" }),
            " Applying action to",
            " ",
            pr,
            "…"
          ] }),
          /* @__PURE__ */ n("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ c("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(jt, {}),
      /* @__PURE__ */ n("p", { children: t.length ? "Choose a saved review to open its queue." : "No saved reviews are available in this browser." })
    ] }),
    ie && ue && y && /* @__PURE__ */ n(
      vn,
      {
        video: ue,
        review: y,
        targetLabel: Tt,
        pending: F,
        refreshing: x || !!se,
        error: nt,
        canWrite: a,
        assessmentReady: (L == null ? void 0 : L.kind) === "ready",
        selected: ce.has(ue.id),
        hasPrevious: M.indexOf(ue.id) > 0,
        hasNext: M.indexOf(ue.id) >= 0 && M.indexOf(ue.id) < M.length - 1,
        onToggleSelected: () => Re((o) => ft(o, ue.id)),
        onPrevious: () => st(-1),
        onNext: () => st(1),
        onClose: () => {
          Se(!1), B(W.current);
        },
        onAction: at,
        onOpen: () => e({ page: "video", id: ue.id })
      }
    ),
    oe && y && /* @__PURE__ */ n(
      Wt,
      {
        reviews: t,
        activeReview: { ...y, view: { ...y.view, filter: D } },
        initialEdit: !0,
        temporary: !0,
        onSave: (o) => {
          const f = o.find((b) => b.id === O);
          return Ce(f), Ke(
            f,
            be({ ...f.view.filter, page: D.page })
          ), !0;
        },
        onChoose: () => {
        },
        onClose: () => {
          le(!1), B(W.current, !1);
        }
      }
    ),
    $ && /* @__PURE__ */ n(
      Wt,
      {
        reviews: t,
        activeReview: z,
        initialEdit: K,
        onSave: Pt,
        onChoose: lt,
        onClose: () => {
          J(!1), K && B(W.current, !1);
        }
      }
    )
  ] });
  async function Ke(o, f) {
    const b = W.current, q = Math.max(0, M.indexOf(b ?? -1));
    try {
      const T = (await me(o, f)).items.map((V) => V.id);
      pe(
        (V) => new Set([...V].filter((ye) => T.includes(ye)))
      );
      const X = Ft(T, b, q);
      ne(X), de.current || B(X, !1);
    } catch {
    }
  }
  function yr() {
    pe(/* @__PURE__ */ new Set()), ve.current.clear(), ne(null);
  }
  function xt(o) {
    return y ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: F || x,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          Sr,
          {
            filter: {
              ...D,
              page: Number(D.page) || 1,
              perPage: Number(D.perPage) || 40
            },
            totalCount: te.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${o}`,
            onFilterChange: (f) => {
              F || x || f.page === Number(D.page) || yn(
                { ...D, page: f.page },
                y,
                Ae,
                me,
                yr
              );
            }
          }
        )
      }
    ) : null;
  }
  function Mt(o) {
    return /* @__PURE__ */ n(
      wn,
      {
        video: o,
        annotation: dn(o, y, xe.ids),
        displayMode: he,
        focused: o.id === H,
        selected: ce.has(o.id),
        setRef: (f) => {
          f ? it.current.set(o.id, f) : it.current.delete(o.id);
        },
        onFocus: () => ne(o.id),
        onToggle: () => Re((f) => ft(f, o.id)),
        onPreview: () => {
          ne(o.id), Se(!0);
        }
      },
      o.id
    );
  }
}
function yn(e, t, r, i, s) {
  r(e), s(), i(t, e).catch(() => {
  });
}
function ft(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function wn({
  video: e,
  annotation: t,
  displayMode: r,
  focused: i,
  selected: s,
  setRef: d,
  onFocus: l,
  onToggle: w,
  onPreview: S
}) {
  const g = e.files[0], a = dr(e), u = /* @__PURE__ */ c(fe, { children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        "aria-label": s ? `Deselect ${a}` : `Select ${a}`,
        onClick: (h) => {
          h.stopPropagation(), w();
        },
        className: `dq-select ${s ? "selected" : ""}`,
        children: s && /* @__PURE__ */ n(Lr, {})
      }
    ),
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        "aria-label": `Preview ${a}`,
        onClick: (h) => {
          h.stopPropagation(), S();
        },
        className: "dq-preview-button",
        children: /* @__PURE__ */ n(Dr, {})
      }
    ),
    /* @__PURE__ */ c("div", { className: "dq-badges", children: [
      g && /* @__PURE__ */ n("span", { children: Er(g.width, g.height) }),
      g != null && g.duration ? /* @__PURE__ */ n("span", { children: Cr(g.duration) }) : null
    ] })
  ] });
  return /* @__PURE__ */ c(
    "article",
    {
      ref: d,
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${a}${s ? ", selected" : ""}`,
      onFocus: l,
      onClick: (h) => {
        l(), h.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-card ${r} ${i ? "focused" : ""} ${s ? "selected" : ""}`,
      children: [
        r === "wall" ? /* @__PURE__ */ c(bn, { video: e, children: [
          u,
          /* @__PURE__ */ n("p", { className: "dq-wall-title", children: a })
        ] }) : /* @__PURE__ */ c("div", { className: "dq-poster", children: [
          /* @__PURE__ */ n("img", { src: cr(e), alt: "" }),
          u
        ] }),
        (r !== "wall" || t) && /* @__PURE__ */ c("div", { className: "dq-card-copy", children: [
          /* @__PURE__ */ n("strong", { children: a }),
          /* @__PURE__ */ c("small", { children: [
            t,
            " "
          ] })
        ] })
      ]
    }
  );
}
function bn({
  video: e,
  children: t
}) {
  const r = _(null), i = _(null), [s, d] = v(!1), [l, w] = v(!1), [S, g] = v(!1);
  return ee(() => {
    const a = r.current;
    if (!a || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      d(!0), w(!0);
      return;
    }
    const u = new IntersectionObserver(
      ([N]) => d(N.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), h = new IntersectionObserver(
      ([N]) => w(N.isIntersecting && N.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return u.observe(a), h.observe(a), () => {
      u.disconnect(), h.disconnect();
    };
  }, [e.id, e.files.length]), ee(() => {
    if (!s) {
      g(!1);
      return;
    }
    const a = new AbortController();
    return j(en(e.id), {
      signal: a.signal
    }).then((u) => {
      a.signal.aborted || g(u.available === !0);
    }).catch(() => {
      a.signal.aborted || g(!1);
    }), () => a.abort();
  }, [s, e.id]), ee(() => {
    const a = i.current;
    a && (l ? Promise.resolve(a.play()).catch(() => {
    }) : a.pause());
  }, [S, l]), /* @__PURE__ */ c("div", { ref: r, className: "dq-wall-media", children: [
    /* @__PURE__ */ n("img", { src: cr(e), alt: "" }),
    S && /* @__PURE__ */ n(
      "video",
      {
        ref: i,
        src: Zr(e.id),
        muted: !0,
        loop: !0,
        playsInline: !0,
        preload: "metadata"
      }
    ),
    t
  ] });
}
function vn({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: s,
  error: d,
  canWrite: l,
  assessmentReady: w,
  selected: S,
  hasPrevious: g,
  hasNext: a,
  onToggleSelected: u,
  onPrevious: h,
  onNext: N,
  onClose: A,
  onAction: C,
  onOpen: k
}) {
  const P = _(null), I = _(null), p = e.files[0], E = dr(e);
  ee(() => {
    var $;
    const m = document.body.style.overflow;
    return document.body.style.overflow = "hidden", ($ = P.current) == null || $.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = m;
    };
  }, []);
  function R(m) {
    var K, ae, oe;
    if (m.key !== "Tab") return;
    const $ = [
      ...((K = P.current) == null ? void 0 : K.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((le) => le.offsetParent !== null);
    if (!$.length) {
      m.preventDefault(), (ae = P.current) == null || ae.focus();
      return;
    }
    const J = $.indexOf(
      document.activeElement
    );
    m.shiftKey && J <= 0 ? (m.preventDefault(), (oe = $.at(-1)) == null || oe.focus()) : !m.shiftKey && J === $.length - 1 && (m.preventDefault(), $[0].focus());
  }
  function O(m) {
    if (m.defaultPrevented || m.ctrlKey || m.metaKey || m.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const $ = m.key === "ArrowLeft" || m.key === "ArrowRight";
    if (m.altKey && !$) return;
    const J = I.current, K = m.currentTarget.querySelector("video");
    if (m.key === "Enter" || m.key === "Escape")
      m.repeat || A();
    else if (m.key === " " && J)
      m.repeat || J.toggle();
    else if ($ && J)
      J.seekBy(
        (m.key === "ArrowLeft" ? -1 : 1) * (m.shiftKey ? 5 : m.altKey ? 10 : 60)
      );
    else if ((m.key === "," || m.key === ".") && J) {
      const ae = [p == null ? void 0 : p.duration, K == null ? void 0 : K.duration].find(
        (le) => le != null && Number.isFinite(le) && le > 0
      ) ?? 0, oe = e.parentVideoId != null ? (e.clipEndSec ?? ae) - (e.clipStartSec ?? 0) : ae;
      Number.isFinite(oe) && oe > 0 && J.seekBy((m.key === "," ? -1 : 1) * oe * 0.1);
    } else if (m.key.toLowerCase() === "n" || m.key.toLowerCase() === "m")
      !m.repeat && !i && !s && (m.key.toLowerCase() === "n" && g && h(), m.key.toLowerCase() === "m" && a && N());
    else if (m.key === "ArrowUp" && K)
      K.volume = Math.min(1, K.volume + 0.1);
    else if (m.key === "ArrowDown" && K)
      K.volume = Math.max(0, K.volume - 0.1);
    else return;
    Z(m);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: P,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${E}`,
      className: "dq-preview",
      onKeyDown: R,
      onKeyDownCapture: O,
      onMouseDown: (m) => {
        m.target === m.currentTarget && A();
      },
      children: /* @__PURE__ */ c("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ c("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !g || i || s,
              onClick: h,
              children: /* @__PURE__ */ n(Tr, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !a || i || s,
              onClick: N,
              children: /* @__PURE__ */ n(Pr, {})
            }
          ),
          /* @__PURE__ */ c("div", { children: [
            /* @__PURE__ */ n("h2", { children: E }),
            /* @__PURE__ */ c("p", { children: [
              "Actions target ",
              r,
              "."
            ] })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: u,
              disabled: s,
              children: S ? "Selected" : "Select"
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: k,
              "aria-label": "Open video details",
              children: /* @__PURE__ */ n(xr, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: A,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(tr, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: p ? /* @__PURE__ */ n(
          Nr,
          {
            autostart: !0,
            streamUrl: Yr(e.id),
            posterUrl: zt(e),
            format: p.format,
            audioCodec: p.audioCodec,
            duration: p.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (m) => (I.current = m, () => {
              I.current === m && (I.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: zt(e), alt: "" }) }),
        d && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: d }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((m, $) => /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            disabled: i || s || !l || Ge(m) && !w,
            onClick: () => void C(m),
            children: [
              ke(m, $) && /* @__PURE__ */ n("kbd", { children: ke(m, $) }),
              m.label
            ]
          },
          m.id
        )) })
      ] })
    }
  );
}
function Wt({
  reviews: e,
  activeReview: t,
  initialEdit: r = !1,
  temporary: i = !1,
  onSave: s,
  onChoose: d,
  onClose: l
}) {
  const [w, S] = v(
    () => r && t ? structuredClone(t) : null
  ), [g, a] = v(""), [u, h] = v(!1), N = _(null);
  ee(() => {
    var R, O;
    const p = document.activeElement, E = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (O = (R = N.current) == null ? void 0 : R.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || O.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = E, p == null || p.focus({ preventScroll: !0 });
    };
  }, []);
  function A(p) {
    var O, m, $;
    if (p.defaultPrevented) {
      p.stopPropagation();
      return;
    }
    if (p.key === "Escape") {
      Z(p), u || l();
      return;
    }
    if (p.key !== "Tab") {
      p.stopPropagation();
      return;
    }
    const E = [
      ...((O = N.current) == null ? void 0 : O.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((J) => J.offsetParent !== null);
    if (!E.length) {
      Z(p), (m = N.current) == null || m.focus();
      return;
    }
    const R = E.indexOf(
      document.activeElement
    );
    p.shiftKey && R <= 0 ? (Z(p), ($ = E.at(-1)) == null || $.focus()) : !p.shiftKey && R === E.length - 1 ? (Z(p), E[0].focus()) : p.stopPropagation();
  }
  function C(p) {
    S(
      p ? structuredClone(p) : {
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
    if (u) return;
    if (!w || gt(w)) {
      a(w ? gt(w) : "Choose a review.");
      return;
    }
    const p = { ...w, name: w.name.trim() }, E = e.some((R) => R.id === p.id) ? e.map((R) => R.id === p.id ? p : R) : [...e, p];
    h(!0), a("");
    try {
      if (!await s(E)) throw new Error("Could not save reviews.");
      d(p.id), l();
    } catch (R) {
      a(
        "Could not save reviews. Your edits are still open. " + (R instanceof Error ? R.message : "Retry saving.")
      );
    } finally {
      h(!1);
    }
  }
  async function P(p) {
    if (!u) {
      h(!0), a("");
      try {
        if (!await s(p)) throw new Error("Could not save reviews.");
      } catch (E) {
        a(
          E instanceof Error ? E.message : "Could not save reviews."
        );
      } finally {
        h(!1);
      }
    }
  }
  async function I(p) {
    var R;
    if (u) return;
    const E = (R = p.target.files) == null ? void 0 : R[0];
    if (p.target.value = "", !!E) {
      if (E.size > 2e6) {
        a("Review files must be smaller than 2 MB.");
        return;
      }
      h(!0), a("");
      try {
        const O = Oe(await E.text());
        if (!await s(mt(e, O)))
          throw new Error("Could not save reviews.");
      } catch (O) {
        a(
          O instanceof Error ? O.message : "Could not import reviews."
        );
      } finally {
        h(!1);
      }
    }
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: N,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: A,
      children: /* @__PURE__ */ c("div", { className: "dq-manager", children: [
        /* @__PURE__ */ c("header", { children: [
          /* @__PURE__ */ c("div", { children: [
            /* @__PURE__ */ n("h2", { children: i ? "Adjust queue temporarily" : w ? e.some((p) => p.id === w.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: i ? "Apply changes for this session. Saved review settings stay available through Reset to saved queue." : "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: u,
              onClick: l,
              children: /* @__PURE__ */ n(tr, {})
            }
          )
        ] }),
        g && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: g }),
        /* @__PURE__ */ n("fieldset", { disabled: u, className: "dq-manager-content", children: w ? /* @__PURE__ */ n(
          Sn,
          {
            draft: w,
            temporary: i,
            saving: u,
            setDraft: S,
            onSave: () => void k(),
            onCancel: l
          }
        ) : /* @__PURE__ */ c(fe, { children: [
          /* @__PURE__ */ c("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ c(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => C(),
                children: [
                  /* @__PURE__ */ n(Mr, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ c("label", { className: "dq-button", children: [
              /* @__PURE__ */ n($r, {}),
              " Import reviews",
              /* @__PURE__ */ n(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: I
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((p) => /* @__PURE__ */ c("article", { children: [
            /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ n("strong", { children: p.name }),
              /* @__PURE__ */ n("p", { children: p.description || "No description" })
            ] }),
            /* @__PURE__ */ c("button", { type: "button", onClick: () => C(p), children: [
              /* @__PURE__ */ n(Zt, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => C({
                  ...structuredClone(p),
                  id: crypto.randomUUID(),
                  name: `${p.name} copy`
                }),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${p.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${p.name}”?`) && P(
                    e.filter((E) => E.id !== p.id)
                  );
                },
                children: /* @__PURE__ */ n(rr, {})
              }
            )
          ] }, p.id)) })
        ] }) })
      ] })
    }
  );
}
function Sn({
  draft: e,
  temporary: t = !1,
  saving: r = !1,
  setDraft: i,
  onSave: s,
  onCancel: d
}) {
  const [l, w] = v("Review"), S = _(/* @__PURE__ */ new WeakMap()), g = (u) => {
    let h = S.current.get(u);
    return h || (h = crypto.randomUUID(), S.current.set(u, h)), h;
  }, a = (u, h) => i({
    ...e,
    actions: e.actions.map(
      (N, A) => A === u ? h : N
    )
  });
  return /* @__PURE__ */ c("div", { className: "dq-editor", children: [
    !t && /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      Ar,
      {
        tabs: ["Review", "Queue", "Appearance", "Actions"].map((u) => ({
          key: u,
          label: u,
          count: u === "Actions" ? e.actions.length : void 0,
          disabled: r
        })),
        activeTab: l,
        onTabChange: w
      }
    ) }),
    /* @__PURE__ */ c("div", { className: "dq-editor-body", children: [
      !t && /* @__PURE__ */ c("section", { hidden: l !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ c("label", { children: [
          "Review name",
          /* @__PURE__ */ n(
            "input",
            {
              autoFocus: !0,
              "aria-label": "Review name",
              value: e.name,
              onChange: (u) => i({ ...e, name: u.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ c("label", { children: [
          "Description",
          /* @__PURE__ */ n(
            "textarea",
            {
              "aria-label": "Description",
              value: e.description,
              onChange: (u) => i({ ...e, description: u.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n(
        "section",
        {
          hidden: !t && l !== "Queue",
          className: "dq-editor-section",
          children: /* @__PURE__ */ n(Vt, { draft: e, onChange: i, presentation: !1 })
        }
      ),
      !t && /* @__PURE__ */ n(
        "section",
        {
          hidden: l !== "Appearance",
          className: "dq-editor-section",
          children: /* @__PURE__ */ n(Vt, { draft: e, onChange: i, queue: !1 })
        }
      ),
      !t && /* @__PURE__ */ c("section", { hidden: l !== "Actions", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Actions" }),
        /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
        /* @__PURE__ */ n(
          _t,
          {
            items: e.actions,
            getKey: (u) => u.id,
            disabled: r,
            className: "dq-sortable-list",
            onReorder: (u) => i({ ...e, actions: u }),
            renderItem: (u, { index: h, dragHandleProps: N, isOver: A }) => /* @__PURE__ */ c(
              "fieldset",
              {
                className: A ? "dq-action-card dq-drag-over" : "dq-action-card",
                children: [
                  /* @__PURE__ */ c("legend", { children: [
                    "Action ",
                    h + 1
                  ] }),
                  /* @__PURE__ */ c("div", { className: "dq-action-heading", children: [
                    /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        ...N,
                        disabled: r,
                        className: "dq-drag-handle",
                        "aria-label": `Reorder action ${h + 1}`,
                        children: /* @__PURE__ */ n(nr, {})
                      }
                    ),
                    /* @__PURE__ */ n("strong", { children: u.label || "New action" }),
                    /* @__PURE__ */ n("div", { className: "dq-row", children: /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        onClick: () => i({
                          ...e,
                          actions: [
                            ...e.actions.slice(0, h + 1),
                            {
                              ...structuredClone(u),
                              id: crypto.randomUUID(),
                              label: u.label + " copy",
                              shortcut: ""
                            },
                            ...e.actions.slice(h + 1)
                          ]
                        }),
                        children: "Duplicate action"
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ c("div", { className: "dq-field-grid", children: [
                    /* @__PURE__ */ c("label", { children: [
                      "Shortcut",
                      /* @__PURE__ */ c(
                        "select",
                        {
                          value: u.shortcut ?? "auto",
                          onChange: (C) => a(h, {
                            ...u,
                            shortcut: C.target.value === "auto" ? void 0 : C.target.value
                          }),
                          children: [
                            /* @__PURE__ */ c("option", { value: "auto", children: [
                              "Position (",
                              h < 9 ? h + 1 : "none",
                              ")"
                            ] }),
                            /* @__PURE__ */ n("option", { value: "", children: "None" }),
                            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((C) => /* @__PURE__ */ n("option", { value: C, children: C }, C))
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c("label", { children: [
                      "Button label",
                      /* @__PURE__ */ n(
                        "input",
                        {
                          value: u.label,
                          onChange: (C) => a(h, {
                            ...u,
                            label: C.target.value
                          })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ n(
                    _t,
                    {
                      items: u.steps,
                      getKey: g,
                      disabled: r,
                      className: "dq-sortable-list",
                      onReorder: (C) => a(h, { ...u, steps: C }),
                      renderItem: (C, { index: k, dragHandleProps: P, isOver: I }) => /* @__PURE__ */ n(
                        Nn,
                        {
                          dragHandleProps: P,
                          saving: r,
                          isOver: I,
                          step: C,
                          index: k,
                          onChange: (p) => {
                            S.current.set(p, g(C)), a(h, {
                              ...u,
                              steps: u.steps.map(
                                (E, R) => R === k ? p : E
                              )
                            });
                          },
                          onRemove: () => a(h, {
                            ...u,
                            steps: u.steps.filter(
                              (p, E) => E !== k
                            )
                          })
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ c("div", { className: "dq-row", children: [
                    /* @__PURE__ */ n(
                      "button",
                      {
                        className: "dq-button",
                        type: "button",
                        onClick: () => a(h, {
                          ...u,
                          steps: [...u.steps, { mode: "ADD", tagIds: [] }]
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
                            (C, k) => k !== h
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
    /* @__PURE__ */ c("div", { className: "dq-editor-footer", children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const u = URL.createObjectURL(
              new Blob([JSON.stringify([e], null, 2)], {
                type: "application/json"
              })
            ), h = document.createElement("a");
            h.href = u, h.download = "data-quality-review.json", h.click(), URL.revokeObjectURL(u);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: d, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: s, children: t ? "Apply temporary queue" : "Save review" })
    ] })
  ] });
}
function Nn({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: i,
  isOver: s,
  onChange: d,
  onRemove: l
}) {
  return /* @__PURE__ */ c("div", { className: s ? "dq-action-step dq-drag-over" : "dq-action-step", children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        ...r,
        disabled: i,
        className: "dq-drag-handle",
        "aria-label": `Reorder step ${t + 1}`,
        children: /* @__PURE__ */ n(nr, {})
      }
    ),
    /* @__PURE__ */ c("span", { children: [
      "Step ",
      t + 1
    ] }),
    /* @__PURE__ */ c(
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
      pt,
      {
        entityType: "tag",
        values: e.tagIds,
        onChange: (w) => d({ ...e, tagIds: w }),
        placeholder: "Choose tags",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: l, children: /* @__PURE__ */ n(rr, {}) })
  ] });
}
async function En() {
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
  ), d = document.createElement("a");
  d.href = s, d.download = "data-quality-browser-recovery.json", d.click(), URL.revokeObjectURL(s);
}
function Xt({ label: e }) {
  return /* @__PURE__ */ c("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(er, { className: "dq-spin" }),
    e
  ] });
}
function Yt({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ c("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(ht, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const kn = { components: { DataQualityPage: mn } };
export {
  mn as DataQualityPage,
  kn as default
};
