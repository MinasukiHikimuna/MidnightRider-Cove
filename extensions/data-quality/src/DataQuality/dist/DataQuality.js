import { jsxs as u, jsx as n, Fragment as de } from "react/jsx-runtime";
import { useState as N, useEffect as Y, useMemo as Lt, useRef as _, useCallback as he, useLayoutEffect as yr } from "react";
import { VIDEO_SORT_OPTIONS as Dt, FilterDialog as wr, VIDEO_CRITERIA as vr, EntityReferenceMultiSelector as ut, DetailListPagination as Sr, VideoPlayer as Nr, VideoCard as Er, EntityDetailTabs as Cr, SortableList as _t } from "@cove/runtime/components";
import { Pencil as Yt, AlertTriangle as ft, LayoutGrid as Ar, Grid3X3 as qr, ZoomOut as Rr, ZoomIn as Ir, Film as Ut, Loader2 as Zt, ChevronLeft as kr, ChevronRight as Or, ExternalLink as Tr, X as er, Plus as xr, Upload as Pr, Trash2 as tr, GripVertical as rr } from "@cove/runtime/lucide-react";
import { extensionFetch as Mr } from "@cove/runtime/api";
function Ie(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function pt(e) {
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
function me(e) {
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
function Be(e) {
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
function ke(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && $r(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && Array.isArray(i.steps) && i.steps.every((s) => s && Array.isArray(s.tagIds)) && bt(i)
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => pt(r)))
    throw new Error(
      "Saved reviews contain invalid actions or shortcuts. Existing data has been kept; assign shortcuts 1–9 only once or leave them empty."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function $r(e) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.cardSize === void 0 || t.cardSize === null || Number.isFinite(t.cardSize) && t.cardSize >= 115 && t.cardSize <= 380) && (t.annotations === void 0 || Array.isArray(t.annotations) && t.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [t.annotationParents, t.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function gt(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const s of i)
      r.has(s.id) || (r.add(s.id), t.push(s));
  return t;
}
function Ft(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function Lr(e, t, r, i) {
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
function Dr(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((s) => r.has(s));
  for (const s of t)
    i ? r.delete(s) : r.add(s);
  return r;
}
function _r(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const ir = "ext:com.midnightrider.data-quality:configuration", Ur = "ext:cove-data-quality:video-reviews", ht = "ext:com.midnightrider.data-quality:progress", Oe = /* @__PURE__ */ new Map(), ze = /* @__PURE__ */ new Map(), at = (e, t) => e.includes("*") || e.includes(t), Qe = (e) => U(`/api/savedfilters?mode=${encodeURIComponent(e)}`), jr = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function mt(e) {
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
    reviews: ke(JSON.stringify(t.reviews)),
    deletedIds: mt(t.deletedIds),
    importedIds: mt(t.importedIds)
  };
}
function Fr(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const s of t) {
    const d = localStorage.getItem(s);
    if (d !== null) {
      const l = ke(d);
      r ?? (r = l), l.forEach((w) => i.add(w.id));
    }
    mt(
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
  const t = await U("/api/auth/me");
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
function Jr() {
  if (Re) return Re;
  const e = Kr();
  return Re = e, e.finally(() => {
    Re === e && (Re = null);
  }).catch(() => {
  }), e;
}
async function Kr() {
  var m;
  const e = await U("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = at(e.permissions, "savedfilters.read"), s = i && at(e.permissions, "savedfilters.write"), d = i ? (await Qe(ir)).filter((A) => A.name === "Data Quality configuration").sort((A, v) => A.id - v.id) : [];
  if (d.length > 1) {
    const A = (v) => {
      const { revision: S, ...I } = ve(v.uiOptions);
      return JSON.stringify(I);
    };
    if (d.some((v) => A(v) !== A(d[0])))
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
  let l = d.length ? ve(d[0].uiOptions) : jr();
  const w = localStorage.getItem(`${r}:migrated`) === "true", E = localStorage.getItem(r), h = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && E && (l = ve(E));
  let a = !d.length;
  if (d.length && h && E) {
    const A = ve(E);
    if (A.reviews.some((S) => {
      const I = l.reviews.find((O) => O.id === S.id);
      return I && JSON.stringify(I) !== JSON.stringify(S);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const v = [
      .../* @__PURE__ */ new Set([...l.deletedIds, ...A.deletedIds])
    ];
    l = {
      ...l,
      reviews: gt(l.reviews, A.reviews).filter(
        (S) => !v.includes(S.id)
      ),
      deletedIds: v,
      importedIds: [
        .../* @__PURE__ */ new Set([...l.importedIds, ...A.importedIds])
      ]
    }, a = !0;
  }
  if (!w) {
    const A = JSON.stringify(l), v = Fr(t);
    if (d.length && v.reviews.some((R) => {
      const g = l.reviews.find((C) => C.id === R.id);
      return g && JSON.stringify(g) !== JSON.stringify(R);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const S = i ? (await Qe(Ur)).flatMap(
      (R) => ke(R.uiOptions ?? "[]")
    ) : [], I = v.known.filter(
      (R) => !v.reviews.some((g) => g.id === R)
    ), O = /* @__PURE__ */ new Set([...l.deletedIds, ...I]);
    l = {
      ...l,
      reviews: gt(
        v.reviews,
        l.reviews,
        S.filter(
          (R) => !v.known.includes(R.id) && !l.importedIds.includes(R.id)
        )
      ).filter((R) => !O.has(R.id)),
      deletedIds: [...O],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...l.importedIds,
          ...v.known,
          ...S.map((R) => R.id)
        ])
      ]
    }, a || (a = JSON.stringify(l) !== A);
  }
  const c = {
    userId: t,
    recordId: (m = d[0]) == null ? void 0 : m.id,
    config: l,
    readable: i,
    writable: s,
    durable: s
  };
  if (Oe.set(r, c), a && s) {
    const A = l;
    d.length && (c.config = ve(d[0].uiOptions)), await ar(r, A), l = c.config;
  } else d.length || (localStorage.setItem(r, JSON.stringify(l)), !i && (!w || h) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (s)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: l.reviews,
    storageKey: r,
    canWrite: at(e.permissions, "videos.write"),
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
      const d = await U(
        `/api/savedfilters/${r.recordId}`
      );
      if (ve(d.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const s = await U(
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
function Vr(e, t) {
  return ke(JSON.stringify(t)), sr(e, async () => {
    const r = Oe.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((s) => !t.some((d) => d.id === s.id)).map((s) => s.id);
    await ar(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((s) => !t.some((d) => d.id === s))
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
async function zr(e, t) {
  const r = Oe.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), s = i ? Jt(i) : null;
  if (!r.readable) return s;
  const d = (await Qe(ht)).find(
    (w) => w.name === t
  ), l = d ? Jt(d.uiOptions) : null;
  return s && (!l || s.updatedAt > l.updatedAt) ? s : l;
}
function Br(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return sr(i, async () => {
    const s = Oe.get(e);
    if (!(s != null && s.writable)) return;
    await or(s);
    const d = (await Qe(ht)).find(
      (l) => l.name === t
    );
    await U(
      d ? `/api/savedfilters/${d.id}` : "/api/savedfilters",
      {
        method: d ? "PUT" : "POST",
        body: JSON.stringify({
          mode: ht,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Te = "confirmed_absent_tags", yt = "Confirmed absent tags", Qr = {
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
function Ge(e) {
  return Array.isArray(e) ? e.map(Ge) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? Qr[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === Te.toLowerCase() ? r.toLowerCase() : Ge(r)
    ])
  ) : e;
}
async function U(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await Mr(e, { ...t, headers: r });
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
async function Kt(e, t, r) {
  const i = { ...e.view.objectFilter }, s = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return U("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      Ge({
        findFilter: me(t),
        objectFilter: i,
        filterExpression: s
      })
    )
  });
}
function Gr(e) {
  return `/api/stream/video/${e}`;
}
function Vt(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Hr(e) {
  return `/api/stream/video/${e}/preview`;
}
function Wr(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Xr(e) {
  return e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function wt(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await U(`/api/tags/${r}`), t.add(r);
    for (let i = 1; ; i++) {
      const s = await U("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          Ge({
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
function Yr(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${Te} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function vt() {
  const t = (await U("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === Te.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${yt} custom field before applying tag assessments.`
    };
  const r = Yr(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function Zr() {
  const e = await vt();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await U("/api/custom-fields", {
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
function He(e) {
  return [...new Set(e)];
}
function en(e) {
  if (e == null) return [];
  if (!Array.isArray(e) || e.some((t) => !Number.isSafeInteger(t) || Number(t) <= 0))
    throw new Error(
      `The ${Te} value is not a valid tag list.`
    );
  return He(e);
}
function tn(e) {
  return He(
    (e.tags ?? []).filter((t) => t.canRemove !== !1 || t.isDerived !== !0).map((t) => t.id)
  );
}
async function rn(e, t) {
  let r;
  try {
    r = await vt();
  } catch (h) {
    throw new Error(
      `Could not verify the ${yt} custom field. ${h instanceof Error ? h.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const i = await Promise.all(
    e.steps.map(async (h) => ({
      ...h,
      tagIds: h.mode === "REMOVE_TREE" ? await wt(h.tagIds) : He(h.tagIds)
    }))
  ), s = i.filter(
    (h) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(h.mode)
  ), d = i.filter(
    (h) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(h.mode)
  ), l = He(t), w = r.definition.key;
  let E = 0;
  for (const h of l)
    try {
      const a = await U(`/api/videos/${h}`), c = tn(a), m = { ...a.customFields ?? {} }, A = m[w], v = en(A), S = new Set(c), I = new Set(v);
      for (const C of s)
        for (const k of C.tagIds)
          C.mode === "ADD" ? S.add(k) : S.delete(k);
      for (const C of d)
        for (const k of C.tagIds)
          C.mode === "MARK_PRESENT" ? (S.add(k), I.delete(k)) : C.mode === "MARK_ABSENT" ? (S.delete(k), I.add(k)) : I.delete(k);
      const O = [...S], R = [...I];
      JSON.stringify(c) === JSON.stringify(O) && JSON.stringify(v) === JSON.stringify(R) && (A === void 0 ? R.length === 0 : JSON.stringify(A) === JSON.stringify(v)) || await U(`/api/videos/${h}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: O,
          customFields: {
            ...m,
            [w]: R
          }
        })
      }), E++;
    } catch (a) {
      throw new Error(
        `Assessment stopped after ${E} video${E === 1 ? "" : "s"} completed; video ${h} was affected. Refresh and inspect it before retrying. ${a instanceof Error ? a.message : "Request failed."}`
      );
    }
}
async function nn(e, t) {
  if (!bt(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  if (Be(e)) {
    await rn(e, t);
    return;
  }
  const r = await Promise.all(
    e.steps.map(async (i) => ({
      mode: i.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: i.mode === "REMOVE_TREE" ? await wt(i.tagIds) : i.tagIds
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
function on(e) {
  var w, E, h;
  const [t, r] = N({}), [i, s] = N(""), d = (((w = e == null ? void 0 : e.presentation) == null ? void 0 : w.annotations) ?? []).includes("tags") ? ((E = e == null ? void 0 : e.presentation) == null ? void 0 : E.annotationParents) ?? [] : [], l = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...d,
      ...((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.binParents) ?? []
    ])
  ]);
  return Y(() => {
    let a = !0;
    return r({}), s(""), Promise.all(
      JSON.parse(l).map(
        async (c) => [c, await wt([c])]
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
function sn(e, t, r) {
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
        (w) => {
          var E;
          return w !== l.id && ((E = r[w]) == null ? void 0 : E.includes(l.id));
        }
      )
    ) : []
  };
}
function an({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: s
}) {
  var w, E, h;
  const d = new Set(
    (((w = t.presentation) == null ? void 0 : w.binParents) ?? []).flatMap(
      (a) => (r[a] ?? []).filter((c) => c !== a)
    )
  ), l = /* @__PURE__ */ new Map();
  for (const a of e)
    for (const c of a.tags ?? [])
      if (d.has(c.id)) {
        const m = l.get(c.id) ?? { name: c.name, count: 0 };
        m.count++, l.set(c.id, m);
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
function ln(e, t) {
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
  const [s, d] = N(!1), l = e.view.filter, w = (a) => t({
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
            onChange: (a) => w({ q: a.target.value })
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
              onChange: (a) => w({ sort: a.target.value, sorts: void 0 }),
              children: [
                !Dt.some((a) => a.value === l.sort) && l.sort != null && /* @__PURE__ */ n("option", { value: String(l.sort), children: String(l.sort) }),
                Dt.map((a) => /* @__PURE__ */ n("option", { value: a.value, children: a.label }, a.value))
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
              onChange: (a) => w({ direction: a.target.value }),
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
      /* @__PURE__ */ u("p", { children: [
        Object.keys(e.view.objectFilter).length ? "Video filters configured" : "No video filters",
        ". Choose which videos enter the queue."
      ] }),
      s && /* @__PURE__ */ n("div", { onKeyDown: (a) => a.stopPropagation(), children: /* @__PURE__ */ n(
        wr,
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
              onChange: (m) => h({
                annotations: m.target.checked ? [...c, a] : c.filter((A) => A !== a)
              })
            }
          ),
          a
        ] }, a);
      }) }),
      (E.annotations ?? []).includes("tags") && /* @__PURE__ */ u(de, { children: [
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
        /* @__PURE__ */ n(
          ut,
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
        ut,
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
const lt = 180, ct = 115, Bt = 380;
function Qt(e) {
  return e.view.displayMode === "wall" ? "wall" : "grid";
}
function cn(e) {
  return e === "wall" ? "wall" : "grid";
}
function dn() {
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
function un(e) {
  return me({ ...e, page: 1 });
}
function fn(e, t) {
  if (t === 0) return "Showing 0 of 0";
  const r = Number(e.perPage) || 40, i = Math.max(1, Math.ceil(t / r)), s = Math.min(Math.max(1, Number(e.page) || 1), i), d = (s - 1) * r + 1, l = Math.min(s * r, t);
  return `Showing ${d.toLocaleString()}-${l.toLocaleString()} of ${t.toLocaleString()}`;
}
function lr(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function X(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
function pn({
  onNavigate: e
}) {
  const [t, r] = N([]), [i] = N(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [s, d] = N(""), [l, w] = N(!0), [E, h] = N(""), [a, c] = N(!1), [m, A] = N(!0), [v, S] = N(""), [I, O] = N(""), [R, g] = N(!1), [C, k] = N(!1), [f, M] = N(dn), [F, D] = N(!1), [se, ie] = N(!1), [ae, St] = N(!1), [B, Se] = N(
    null
  ), V = t.find((o) => o.id === f) ?? null, y = Lt(
    () => (B == null ? void 0 : B.id) === f && V ? { ...V, view: B.view } : V,
    [B, f, V]
  ), xe = on(y), [L, Ne] = N({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [cr, dr] = N({
    page: 1,
    perPage: 40
  }), [ee, Nt] = N({ items: [], totalCount: 0 }), [T, Pe] = N(!1), [oe, Et] = N(""), [le, ue] = N(() => /* @__PURE__ */ new Set()), We = _(le);
  We.current = le;
  const be = _(/* @__PURE__ */ new Map()), [Q, te] = N(null), G = _(Q);
  G.current = Q;
  const [re, ye] = N(!1), ce = _(re);
  ce.current = re;
  const Ct = _(null), [Ee, Xe] = N("grid"), [fe, At] = N(lt), [j, Ye] = N(!1), Me = _(!1), [ur, Ze] = N(""), [qt, $e] = N(""), [et, Ce] = N(""), [$, Rt] = N(null), [It, Le] = N(""), [De, _e] = N(!1), tt = _(/* @__PURE__ */ new Map()), kt = _(null), we = _(0), Ue = _(0), je = _(null), Ot = he(async () => {
    w(!0), h("");
    try {
      const o = await Jr();
      r(o.reviews), d(o.storageKey), c(o.canWrite), A(o.canConfigure ?? !0), S(o.storageNotice ?? ""), f && !o.reviews.some((p) => p.id === f) && (M(""), Gt(""));
    } catch (o) {
      h(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      w(!1);
    }
  }, [f]);
  Y(() => {
    Ot();
  }, []);
  const Fe = he(async () => {
    Le("");
    try {
      Rt(await vt());
    } catch (o) {
      Rt(null), Le(
        "Tag assessment setup could not be checked. " + (o instanceof Error ? o.message : "Request failed.")
      );
    }
  }, []);
  Y(() => {
    Fe();
  }, [Fe]);
  const pe = he(
    async (o, p) => {
      var K;
      const b = ++we.current;
      (K = je.current) == null || K.abort();
      const q = new AbortController();
      je.current = q, p = me(p), Ne(p), Pe(!0), Et("");
      try {
        let P = await Kt(
          o,
          p,
          q.signal
        );
        const ne = Math.max(
          1,
          Math.ceil(P.totalCount / Number(p.perPage))
        );
        return Number(p.page) > ne && (p = { ...p, page: ne }, P = await Kt(
          o,
          p,
          q.signal
        )), b === we.current && (Nt(P), Ne(p), dr(p)), P;
      } catch (P) {
        throw b === we.current && Et(
          P instanceof Error ? P.message : "Could not load the review queue."
        ), P;
      } finally {
        b === we.current && Pe(!1);
      }
    },
    []
  );
  Y(() => {
    var p;
    if (Ue.current += 1, we.current += 1, (p = je.current) == null || p.abort(), k(!1), O(""), g(!1), ue(/* @__PURE__ */ new Set()), be.current.clear(), te(null), ye(!1), Ye(!1), Me.current = !1, Ze(""), $e(""), Ce(""), Nt({ items: [], totalCount: 0 }), !y) {
      Pe(!1);
      return;
    }
    let o = !0;
    return Pe(!0), (async () => {
      let b = null;
      try {
        b = await zr(s, y.id);
      } catch (P) {
        o && (g(!0), O(
          P instanceof Error ? P.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const q = (b == null ? void 0 : b.signature) === Ve(y) ? b : null, K = q ? me(q.filter) : un(y.view.filter);
      Ne(K), Xe(
        q ? cn(q.displayMode) : Qt(y)
      ), At(
        q ? q.cardSize ?? lt : lt
      );
      try {
        const P = await pe(y, K);
        if (!o) return;
        const ne = jt(
          P.items.map((H) => H.id),
          (q == null ? void 0 : q.focusedId) ?? null,
          (q == null ? void 0 : q.index) ?? 0
        );
        te(ne), J(ne);
      } catch {
      }
      o && k(!0);
    })(), () => {
      var b;
      o = !1, Ue.current++, we.current++, (b = je.current) == null || b.abort();
    };
  }, [y == null ? void 0 : y.id]);
  const x = Lt(
    () => ee.items.map((o) => o.id),
    [ee.items]
  );
  Y(() => {
    if (!C || !y || !s || T || oe || j || (B == null ? void 0 : B.id) === y.id || R)
      return;
    const o = {
      version: 1,
      signature: Ve(y),
      filter: L,
      focusedId: Q,
      index: Math.max(0, x.indexOf(Q ?? -1)),
      displayMode: Ee,
      cardSize: fe,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        s + ":progress:" + y.id,
        JSON.stringify(o)
      );
    } catch {
    }
    if (I) return;
    let p = !0;
    const b = window.setTimeout(() => {
      Br(s, y.id, o).catch((q) => {
        p && O(
          "Progress is kept in this browser, but account sync failed. " + (q instanceof Error ? q.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      p = !1, window.clearTimeout(b);
    };
  }, [
    C,
    s,
    y,
    T,
    oe,
    j,
    L,
    Q,
    x,
    Ee,
    fe,
    B,
    I,
    R
  ]);
  const rt = ee.items.find((o) => o.id === Q) ?? null;
  re && rt && (Ct.current = rt);
  const ge = rt ?? (re ? Ct.current : null), fr = Ft(le, Q), Tt = le.size > 0 ? `${le.size} selected video${le.size === 1 ? "" : "s"}` : Q == null ? "no video" : "focused video", J = he((o, p = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const b = tt.current.get(o);
      b == null || b.focus({ preventScroll: !0 }), p && (b == null || b.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  Y(() => {
    C && !ce.current && J(G.current);
  }, [C, J]), Y(() => {
    T || !x.length || (G.current == null || !x.includes(G.current)) && (te(x[0]), ce.current || J(x[0]));
  }, [J, x, T]);
  const Ae = he(
    (o) => {
      ue((p) => {
        const b = o(p);
        for (const q of /* @__PURE__ */ new Set([...p, ...b]))
          p.has(q) !== b.has(q) && be.current.set(
            q,
            (be.current.get(q) ?? 0) + 1
          );
        return b;
      });
    },
    []
  ), nt = he(
    (o) => {
      if (!x.length) return;
      const p = Math.max(
        0,
        x.indexOf(G.current ?? x[0])
      ), b = x[Math.max(0, Math.min(x.length - 1, p + o))];
      te(b), ce.current || J(b);
    },
    [J, x]
  ), it = he(
    async (o) => {
      const p = Ft(
        We.current,
        G.current
      );
      if (!y || Me.current || T || oe || !a || Be(o) && ($ == null ? void 0 : $.kind) !== "ready" || !p.length)
        return;
      const b = ++Ue.current, q = y.id, K = [...x], P = G.current, ne = new Map(
        p.map((z) => [z, be.current.get(z) ?? 0])
      ), H = () => b === Ue.current && y.id === q;
      Me.current = !0, Ye(!0), Ze(
        We.current.size ? `${p.length} selected videos` : "the focused video"
      ), $e(""), Ce("");
      let qe = !1;
      try {
        if (await nn(o, p), qe = !0, !H()) return;
        ue((z) => {
          const W = new Set(z);
          for (const Z of p)
            (be.current.get(Z) ?? 0) === ne.get(Z) && W.delete(Z);
          return W;
        }), $e(
          `${o.label}: ${p.length} video${p.length === 1 ? "" : "s"} ${o.steps.length ? "updated" : "skipped"}.`
        );
      } catch (z) {
        if (!H()) return;
        Ce(
          z instanceof Error ? z.message : "Action failed."
        );
      }
      try {
        if (await Xr(o), !H()) return;
        const z = await pe(y, L);
        if (!H()) return;
        let W = z.items.map((Z) => Z.id);
        if (!W.length && z.totalCount > 0 && Number(L.page) > 1) {
          const Z = Math.max(1, Number(L.page) - 1), Ke = { ...L, page: Z };
          Ne(Ke), W = (await pe(y, Ke)).items.map((st) => st.id), ue(
            (st) => new Set([...st].filter((br) => W.includes(br)))
          );
          const $t = W.at(-1) ?? null;
          te($t), ce.current || J($t);
        } else {
          ue(
            (Ke) => new Set([...Ke].filter((Mt) => W.includes(Mt)))
          );
          const Z = Lr(
            K,
            W,
            P,
            qe && p.includes(P ?? -1)
          );
          te(Z), ce.current && Z == null && ye(!1), ce.current || J(Z);
        }
      } catch (z) {
        H() && Ce(
          (W) => `${W ? `${W} ` : ""}${qe ? "The action completed, but " : ""}the queue could not be refreshed. ${z instanceof Error ? z.message : "Refresh failed."}`
        );
      } finally {
        H() && (Me.current = !1, Ye(!1), Ze(""));
      }
    },
    [
      a,
      $,
      pe,
      L,
      J,
      x,
      T,
      oe,
      y
    ]
  );
  function pr() {
    var b;
    const o = (b = kt.current) == null ? void 0 : b.firstElementChild, p = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, p.split(" ").filter(Boolean).length);
  }
  function gr(o) {
    if (o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || F || ae) return;
    if (re && o.key === "Escape") {
      X(o), ye(!1), J(G.current);
      return;
    }
    if (!_r(o.target)) return;
    if (o.key === "Escape") {
      X(o), Ae(() => /* @__PURE__ */ new Set());
      return;
    }
    const p = (y == null ? void 0 : y.actions.findIndex(
      (K, P) => Ie(K, P) === o.key
    )) ?? -1;
    if (p >= 0 && (y != null && y.actions[p])) {
      X(o), !j && !T && it(y.actions[p]);
      return;
    }
    if (!re && o.key === " ") {
      X(o), Q != null && Ae((K) => dt(K, Q));
      return;
    }
    if (!re && o.key.toLowerCase() === "a") {
      X(o), Ae(
        (K) => Dr(K, x)
      );
      return;
    }
    if (j || T || re) return;
    if (o.key === "Enter" && Q != null) {
      X(o), ye(!0);
      return;
    }
    const b = pr(), q = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -b : o.key === "ArrowDown" ? b : 0;
    q && (X(o), nt(q));
  }
  function ot(o) {
    M(o), Gt(o);
  }
  async function xt(o) {
    if (!s) return !1;
    const p = o.map(hn);
    try {
      await Vr(s, p);
    } catch (q) {
      throw q;
    }
    r(p), f && !p.some((q) => q.id === f) && ot("");
    const b = p.find((q) => q.id === f);
    return b && V && JSON.stringify(b) !== JSON.stringify(V) && (b.view.displayMode !== V.view.displayMode && Xe(Qt(b)), Ve(b) !== Ve(V) && (Se(null), Je(
      b,
      me({ ...b.view.filter, page: L.page })
    ))), !0;
  }
  if (l)
    return /* @__PURE__ */ n(Wt, { label: "Loading Data Quality reviews…" });
  if (E)
    return /* @__PURE__ */ u(de, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Sn().catch(
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
          message: E,
          onRetry: () => void Ot()
        }
      )
    ] });
  return /* @__PURE__ */ u("div", { className: "data-quality-page", onKeyDown: gr, children: [
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
          disabled: j || T || !m,
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
    v && /* @__PURE__ */ n("p", { className: "dq-status", children: v }),
    ($ == null ? void 0 : $.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      $.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: De,
          onClick: () => {
            _e(!0), Le(""), Zr().then(Fe).catch(
              (o) => Le(
                "Could not create the Confirmed absent tags custom field. " + (o instanceof Error ? o.message : "Request failed.")
              )
            ).finally(() => _e(!1));
          },
          children: De ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    (($ == null ? void 0 : $.kind) === "incompatible" || It) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(ft, {}),
      It || ($ == null ? void 0 : $.message),
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
    i && /* @__PURE__ */ u("details", { children: [
      /* @__PURE__ */ n("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ n("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const o = localStorage.getItem("page-videos") ?? "[]", p = URL.createObjectURL(
              new Blob([o], { type: "application/json" })
            ), b = document.createElement("a");
            b.href = p, b.download = "data-quality-unassigned-legacy-reviews.json", b.click(), URL.revokeObjectURL(p);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    I && /* @__PURE__ */ u("p", { role: "alert", children: [
      I,
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
            value: (y == null ? void 0 : y.id) ?? "",
            disabled: j,
            onChange: (o) => ot(o.target.value),
            children: [
              /* @__PURE__ */ n("option", { value: "", children: "Choose a review…" }),
              t.map((o) => /* @__PURE__ */ n("option", { value: o.id, children: o.name }, o.id))
            ]
          }
        )
      ] }),
      y && /* @__PURE__ */ n("span", { className: "dq-range-count", children: fn(cr, ee.totalCount) }),
      y && /* @__PURE__ */ u(de, { children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: j || T || !m,
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
            disabled: j || T,
            onClick: () => St(!0),
            children: "Adjust queue"
          }
        ),
        (B == null ? void 0 : B.id) === f && /* @__PURE__ */ u(de, { children: [
          /* @__PURE__ */ n("span", { children: "Temporary queue" }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: j || T || !m,
              onClick: () => {
                V && xt(
                  t.map(
                    (o) => o.id === f ? {
                      ...o,
                      view: {
                        ...y.view,
                        filter: { ...L, page: 1 }
                      }
                    } : o
                  )
                ).then(() => {
                  Se(null), $e("Queue saved to this review.");
                }).catch(
                  (o) => Ce(
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
              disabled: j || T,
              onClick: () => {
                Se(null), V && Je(
                  V,
                  me({
                    ...V.view.filter,
                    page: L.page
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
              { mode: "grid", label: "Grid", Icon: Ar },
              { mode: "wall", label: "Wall", Icon: qr }
            ].map(({ mode: o, label: p, Icon: b }) => /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: `inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-transparent p-2 text-secondary hover:bg-card/80 hover:text-foreground focus:border-accent focus:outline-none sm:min-h-0 sm:min-w-0 sm:p-1.5 ${Ee === o ? "bg-background/60 text-accent shadow-sm" : ""}`,
                "aria-label": p,
                title: p,
                "aria-pressed": Ee === o,
                onClick: () => Xe(o),
                children: /* @__PURE__ */ n(b, { className: "h-3.5 w-3.5" })
              },
              o
            ))
          }
        ),
        /* @__PURE__ */ u("div", { className: "hidden items-center gap-1 pl-1 md:flex", children: [
          /* @__PURE__ */ n(Rr, { className: "h-3 w-3 text-muted" }),
          /* @__PURE__ */ n(
            "input",
            {
              "aria-label": `Card size: ${fe}px`,
              title: `Card size: ${fe}px`,
              type: "range",
              min: ct,
              max: Bt,
              step: "5",
              className: "themed-range-input h-1 w-16 cursor-pointer sm:w-20",
              value: fe,
              style: {
                "--range-fill": `${(fe - ct) / (Bt - ct) * 100}%`
              },
              onChange: (o) => At(Number(o.target.value))
            }
          ),
          /* @__PURE__ */ n(Ir, { className: "h-3 w-3 text-muted" })
        ] })
      ] })
    ] }),
    y ? /* @__PURE__ */ u(de, { children: [
      xe.error && /* @__PURE__ */ n("p", { role: "alert", children: xe.error }),
      /* @__PURE__ */ n(
        an,
        {
          videos: ee.items,
          review: y,
          trees: xe.ids,
          disabled: j || T,
          onChoose: (o) => {
            const p = ln(y, o);
            Se(p), Je(p, { ...L, page: 1 });
          }
        }
      ),
      et && !re && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(ft, {}),
        et
      ] }),
      qt && /* @__PURE__ */ n("p", { role: "status", className: "dq-status", children: qt }),
      /* @__PURE__ */ u("div", { className: "dq-workspace", children: [
        /* @__PURE__ */ u("main", { children: [
          Pt("top"),
          T && !ee.items.length && /* @__PURE__ */ n(Wt, { label: "Loading review queue…" }),
          oe && !T && /* @__PURE__ */ n(
            Xt,
            {
              message: oe,
              onRetry: () => void pe(y, L).catch(() => {
              })
            }
          ),
          !T && !oe && !ee.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
            /* @__PURE__ */ n(Ut, {}),
            /* @__PURE__ */ n("p", { children: "No videos match this review." })
          ] }),
          !!ee.items.length && /* @__PURE__ */ n("div", { ref: kt, children: /* @__PURE__ */ n(
            "div",
            {
              className: "dq-grid",
              style: {
                "--dq-card-width": `${fe}px`
              },
              children: ee.items.map(mr)
            }
          ) }),
          Pt("bottom")
        ] }),
        /* @__PURE__ */ u("aside", { className: "dq-actions", children: [
          /* @__PURE__ */ n("strong", { children: Tt }),
          y.actions.map((o, p) => /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              disabled: j || T || !!oe || !a || Be(o) && ($ == null ? void 0 : $.kind) !== "ready" || !fr.length,
              onClick: () => void it(o),
              children: [
                Ie(o, p) && /* @__PURE__ */ n("kbd", { children: Ie(o, p) }),
                /* @__PURE__ */ n("span", { children: o.label }),
                /* @__PURE__ */ n("small", { children: o.steps.length ? `${o.steps.length} step(s)` : "Skip" })
              ]
            },
            o.id
          )),
          !y.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
          !a && /* @__PURE__ */ n("p", { children: "Video write permission is required to apply actions." }),
          j && /* @__PURE__ */ u("p", { role: "status", children: [
            /* @__PURE__ */ n(Zt, { className: "dq-spin" }),
            " Applying action to",
            " ",
            ur,
            "…"
          ] }),
          /* @__PURE__ */ n("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(Ut, {}),
      /* @__PURE__ */ n("p", { children: t.length ? "Choose a saved review to open its queue." : "No saved reviews are available in this browser." })
    ] }),
    re && ge && y && /* @__PURE__ */ n(
      yn,
      {
        video: ge,
        review: y,
        targetLabel: Tt,
        pending: j,
        refreshing: T || !!oe,
        error: et,
        canWrite: a,
        assessmentReady: ($ == null ? void 0 : $.kind) === "ready",
        selected: le.has(ge.id),
        hasPrevious: x.indexOf(ge.id) > 0,
        hasNext: x.indexOf(ge.id) >= 0 && x.indexOf(ge.id) < x.length - 1,
        onToggleSelected: () => Ae((o) => dt(o, ge.id)),
        onPrevious: () => nt(-1),
        onNext: () => nt(1),
        onClose: () => {
          ye(!1), J(G.current);
        },
        onAction: it
      }
    ),
    ae && y && /* @__PURE__ */ n(
      Ht,
      {
        reviews: t,
        activeReview: { ...y, view: { ...y.view, filter: L } },
        initialEdit: !0,
        temporary: !0,
        onSave: (o) => {
          const p = o.find((b) => b.id === f);
          return Se(p), Je(
            p,
            me({ ...p.view.filter, page: L.page })
          ), !0;
        },
        onChoose: () => {
        },
        onClose: () => {
          St(!1), J(G.current, !1);
        }
      }
    ),
    F && /* @__PURE__ */ n(
      Ht,
      {
        reviews: t,
        activeReview: V,
        initialEdit: se,
        onSave: xt,
        onChoose: ot,
        onClose: () => {
          D(!1), se && J(G.current, !1);
        }
      }
    )
  ] });
  async function Je(o, p) {
    const b = G.current, q = Math.max(0, x.indexOf(b ?? -1));
    try {
      const P = (await pe(o, p)).items.map((H) => H.id);
      ue(
        (H) => new Set([...H].filter((qe) => P.includes(qe)))
      );
      const ne = jt(P, b, q);
      te(ne), ce.current || J(ne, !1);
    } catch {
    }
  }
  function hr() {
    ue(/* @__PURE__ */ new Set()), be.current.clear(), te(null);
  }
  function Pt(o) {
    return y ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: j || T,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          Sr,
          {
            filter: {
              ...L,
              page: Number(L.page) || 1,
              perPage: Number(L.perPage) || 40
            },
            totalCount: ee.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${o}`,
            onFilterChange: (p) => {
              j || T || p.page === Number(L.page) || gn(
                { ...L, page: p.page },
                y,
                Ne,
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
      mn,
      {
        video: sn(o, y, xe.ids),
        displayMode: Ee,
        focused: o.id === Q,
        selected: le.has(o.id),
        setRef: (p) => {
          p ? tt.current.set(o.id, p) : tt.current.delete(o.id);
        },
        onFocus: () => te(o.id),
        onToggle: () => Ae((p) => dt(p, o.id)),
        onPreview: () => {
          te(o.id), ye(!0);
        },
        onNavigate: e
      },
      o.id
    );
  }
}
function gn(e, t, r, i, s) {
  r(e), s(), i(t, e).catch(() => {
  });
}
function dt(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function hn(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function mn({
  video: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: s,
  onFocus: d,
  onToggle: l,
  onPreview: w,
  onNavigate: E
}) {
  const h = lr(e), a = _(null), c = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, m = !!(c.date || c.studioName), A = !!(c.performers.length || c.tags.length);
  return yr(() => {
    const v = a.current;
    if (!v) return;
    const S = v.querySelector(
      `a[href="/video/${e.id}"]`
    ), I = v.querySelector(".card-title"), O = `dq-card-title-${e.id}`;
    I && (I.id = O), S && (S.target = "_blank", S.rel = "noreferrer", S.removeAttribute("aria-label"), S.setAttribute("aria-labelledby", O), S.classList.add("dq-card-link"));
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
      className: `dq-review-card relative h-full ${t} ${m ? "has-card-metadata" : "no-card-metadata"} ${A ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          Er,
          {
            video: c,
            selected: i,
            onSelect: l,
            onNavigate: E,
            onQuickView: w,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t === "wall" && /* @__PURE__ */ n(bn, { video: e })
      ]
    }
  );
}
function bn({ video: e }) {
  const t = _(null), r = _(null), [i, s] = N(!1), [d, l] = N(!1), [w, E] = N(!1);
  return Y(() => {
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
  }, [e.id, e.files.length]), Y(() => {
    if (!i) {
      E(!1);
      return;
    }
    const h = new AbortController();
    return U(Wr(e.id), {
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
  }, [w, d]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: w && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: Hr(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function yn({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: s,
  error: d,
  canWrite: l,
  assessmentReady: w,
  selected: E,
  hasPrevious: h,
  hasNext: a,
  onToggleSelected: c,
  onPrevious: m,
  onNext: A,
  onClose: v,
  onAction: S
}) {
  const I = _(null), O = _(null), R = e.files[0], g = lr(e);
  Y(() => {
    var M;
    const f = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (M = I.current) == null || M.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = f;
    };
  }, []);
  function C(f) {
    var D, se, ie;
    if (f.key !== "Tab") return;
    const M = [
      ...((D = I.current) == null ? void 0 : D.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ae) => ae.offsetParent !== null);
    if (!M.length) {
      f.preventDefault(), (se = I.current) == null || se.focus();
      return;
    }
    const F = M.indexOf(
      document.activeElement
    );
    f.shiftKey && F <= 0 ? (f.preventDefault(), (ie = M.at(-1)) == null || ie.focus()) : !f.shiftKey && F === M.length - 1 && (f.preventDefault(), M[0].focus());
  }
  function k(f) {
    if (f.defaultPrevented || f.ctrlKey || f.metaKey || f.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const M = f.key === "ArrowLeft" || f.key === "ArrowRight";
    if (f.altKey && !M) return;
    const F = O.current, D = f.currentTarget.querySelector("video");
    if (f.key === "Enter" || f.key === "Escape")
      f.repeat || v();
    else if (f.key === " " && F)
      f.repeat || F.toggle();
    else if (M && F)
      F.seekBy(
        (f.key === "ArrowLeft" ? -1 : 1) * (f.shiftKey ? 5 : f.altKey ? 10 : 60)
      );
    else if ((f.key === "," || f.key === ".") && F) {
      const se = [R == null ? void 0 : R.duration, D == null ? void 0 : D.duration].find(
        (ae) => ae != null && Number.isFinite(ae) && ae > 0
      ) ?? 0, ie = e.parentVideoId != null ? (e.clipEndSec ?? se) - (e.clipStartSec ?? 0) : se;
      Number.isFinite(ie) && ie > 0 && F.seekBy((f.key === "," ? -1 : 1) * ie * 0.1);
    } else if (f.key.toLowerCase() === "n" || f.key.toLowerCase() === "m")
      !f.repeat && !i && !s && (f.key.toLowerCase() === "n" && h && m(), f.key.toLowerCase() === "m" && a && A());
    else if (f.key === "ArrowUp" && D)
      D.volume = Math.min(1, D.volume + 0.1);
    else if (f.key === "ArrowDown" && D)
      D.volume = Math.max(0, D.volume - 0.1);
    else return;
    X(f);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: I,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${g}`,
      className: "dq-preview",
      onKeyDown: C,
      onKeyDownCapture: k,
      onMouseDown: (f) => {
        f.target === f.currentTarget && v();
      },
      children: /* @__PURE__ */ u("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ u("header", { "data-review-player-controls": !0, children: [
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
              onClick: A,
              children: /* @__PURE__ */ n(Or, {})
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
              children: /* @__PURE__ */ n(Tr, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: v,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(er, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: R ? /* @__PURE__ */ n(
          Nr,
          {
            autostart: !0,
            streamUrl: Gr(e.id),
            posterUrl: Vt(e),
            format: R.format,
            audioCodec: R.audioCodec,
            duration: R.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (f) => (O.current = f, () => {
              O.current === f && (O.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: Vt(e), alt: "" }) }),
        d && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: d }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((f, M) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: i || s || !l || Be(f) && !w,
            onClick: () => void S(f),
            children: [
              Ie(f, M) && /* @__PURE__ */ n("kbd", { children: Ie(f, M) }),
              f.label
            ]
          },
          f.id
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
  onChoose: d,
  onClose: l
}) {
  const [w, E] = N(
    () => r && t ? structuredClone(t) : null
  ), [h, a] = N(""), [c, m] = N(!1), A = _(null);
  Y(() => {
    var k, f;
    const g = document.activeElement, C = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (f = (k = A.current) == null ? void 0 : k.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || f.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = C, g == null || g.focus({ preventScroll: !0 });
    };
  }, []);
  function v(g) {
    var f, M, F;
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
    const C = [
      ...((f = A.current) == null ? void 0 : f.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((D) => D.offsetParent !== null);
    if (!C.length) {
      X(g), (M = A.current) == null || M.focus();
      return;
    }
    const k = C.indexOf(
      document.activeElement
    );
    g.shiftKey && k <= 0 ? (X(g), (F = C.at(-1)) == null || F.focus()) : !g.shiftKey && k === C.length - 1 ? (X(g), C[0].focus()) : g.stopPropagation();
  }
  function S(g) {
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
  async function I() {
    if (c) return;
    if (!w || pt(w)) {
      a(w ? pt(w) : "Choose a review.");
      return;
    }
    const g = { ...w, name: w.name.trim() }, C = e.some((k) => k.id === g.id) ? e.map((k) => k.id === g.id ? g : k) : [...e, g];
    m(!0), a("");
    try {
      if (!await s(C)) throw new Error("Could not save reviews.");
      d(g.id), l();
    } catch (k) {
      a(
        "Could not save reviews. Your edits are still open. " + (k instanceof Error ? k.message : "Retry saving.")
      );
    } finally {
      m(!1);
    }
  }
  async function O(g) {
    if (!c) {
      m(!0), a("");
      try {
        if (!await s(g)) throw new Error("Could not save reviews.");
      } catch (C) {
        a(
          C instanceof Error ? C.message : "Could not save reviews."
        );
      } finally {
        m(!1);
      }
    }
  }
  async function R(g) {
    var k;
    if (c) return;
    const C = (k = g.target.files) == null ? void 0 : k[0];
    if (g.target.value = "", !!C) {
      if (C.size > 2e6) {
        a("Review files must be smaller than 2 MB.");
        return;
      }
      m(!0), a("");
      try {
        const f = ke(await C.text());
        if (!await s(gt(e, f)))
          throw new Error("Could not save reviews.");
      } catch (f) {
        a(
          f instanceof Error ? f.message : "Could not import reviews."
        );
      } finally {
        m(!1);
      }
    }
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: A,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: v,
      children: /* @__PURE__ */ u("div", { className: "dq-manager", children: [
        /* @__PURE__ */ u("header", { children: [
          /* @__PURE__ */ u("div", { children: [
            /* @__PURE__ */ n("h2", { children: i ? "Adjust queue temporarily" : w ? e.some((g) => g.id === w.id) ? "Edit review" : "New review" : "Manage reviews" }),
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
        /* @__PURE__ */ n("fieldset", { disabled: c, className: "dq-manager-content", children: w ? /* @__PURE__ */ n(
          wn,
          {
            draft: w,
            temporary: i,
            saving: c,
            setDraft: E,
            onSave: () => void I(),
            onCancel: l
          }
        ) : /* @__PURE__ */ u(de, { children: [
          /* @__PURE__ */ u("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ u(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => S(),
                children: [
                  /* @__PURE__ */ n(xr, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ u("label", { className: "dq-button", children: [
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
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((g) => /* @__PURE__ */ u("article", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ n("strong", { children: g.name }),
              /* @__PURE__ */ n("p", { children: g.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => S(g), children: [
              /* @__PURE__ */ n(Yt, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => S({
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
                    e.filter((C) => C.id !== g.id)
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
  onCancel: d
}) {
  const [l, w] = N("Review"), E = _(/* @__PURE__ */ new WeakMap()), h = (c) => {
    let m = E.current.get(c);
    return m || (m = crypto.randomUUID(), E.current.set(c, m)), m;
  }, a = (c, m) => i({
    ...e,
    actions: e.actions.map(
      (A, v) => v === c ? m : A
    )
  });
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    !t && /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      Cr,
      {
        tabs: ["Review", "Queue", "Appearance", "Actions"].map((c) => ({
          key: c,
          label: c,
          count: c === "Actions" ? e.actions.length : void 0,
          disabled: r
        })),
        activeTab: l,
        onTabChange: w
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
      !t && /* @__PURE__ */ u("section", { hidden: l !== "Actions", className: "dq-editor-section", children: [
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
            renderItem: (c, { index: m, dragHandleProps: A, isOver: v }) => /* @__PURE__ */ u(
              "fieldset",
              {
                className: v ? "dq-action-card dq-drag-over" : "dq-action-card",
                children: [
                  /* @__PURE__ */ u("legend", { children: [
                    "Action ",
                    m + 1
                  ] }),
                  /* @__PURE__ */ u("div", { className: "dq-action-heading", children: [
                    /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        ...A,
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
                  /* @__PURE__ */ u("div", { className: "dq-field-grid", children: [
                    /* @__PURE__ */ u("label", { children: [
                      "Shortcut",
                      /* @__PURE__ */ u(
                        "select",
                        {
                          value: c.shortcut ?? "auto",
                          onChange: (S) => a(m, {
                            ...c,
                            shortcut: S.target.value === "auto" ? void 0 : S.target.value
                          }),
                          children: [
                            /* @__PURE__ */ u("option", { value: "auto", children: [
                              "Position (",
                              m < 9 ? m + 1 : "none",
                              ")"
                            ] }),
                            /* @__PURE__ */ n("option", { value: "", children: "None" }),
                            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((S) => /* @__PURE__ */ n("option", { value: S, children: S }, S))
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
                          onChange: (S) => a(m, {
                            ...c,
                            label: S.target.value
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
                      onReorder: (S) => a(m, { ...c, steps: S }),
                      renderItem: (S, { index: I, dragHandleProps: O, isOver: R }) => /* @__PURE__ */ n(
                        vn,
                        {
                          dragHandleProps: O,
                          saving: r,
                          isOver: R,
                          step: S,
                          index: I,
                          onChange: (g) => {
                            E.current.set(g, h(S)), a(m, {
                              ...c,
                              steps: c.steps.map(
                                (C, k) => k === I ? g : C
                              )
                            });
                          },
                          onRemove: () => a(m, {
                            ...c,
                            steps: c.steps.filter(
                              (g, C) => C !== I
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
                            (S, I) => I !== m
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
            ), m = document.createElement("a");
            m.href = c, m.download = "data-quality-review.json", m.click(), URL.revokeObjectURL(c);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: d, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: s, children: t ? "Apply temporary queue" : "Save review" })
    ] })
  ] });
}
function vn({
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
        children: /* @__PURE__ */ n(rr, {})
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
      ut,
      {
        entityType: "tag",
        values: e.tagIds,
        onChange: (w) => d({ ...e, tagIds: w }),
        placeholder: "Choose tags",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: l, children: /* @__PURE__ */ n(tr, {}) })
  ] });
}
async function Sn() {
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
function Wt({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(Zt, { className: "dq-spin" }),
    e
  ] });
}
function Xt({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(ft, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const Rn = { components: { DataQualityPage: pn } };
export {
  pn as DataQualityPage,
  Rn as default
};
