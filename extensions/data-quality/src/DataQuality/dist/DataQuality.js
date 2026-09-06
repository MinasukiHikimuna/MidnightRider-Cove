import { jsxs as u, jsx as n, Fragment as ve } from "react/jsx-runtime";
import { useState as v, useEffect as Y, useMemo as Dt, useRef as j, useCallback as fe, useLayoutEffect as vr } from "react";
import { VIDEO_SORT_OPTIONS as dt, FilterDialog as Sr, VIDEO_CRITERIA as Wt, EntityReferenceMultiSelector as ut, DetailListToolbar as Nr, DetailListPagination as Er, VideoPlayer as Cr, VideoCard as Ar, EntityDetailTabs as qr, SortableList as Lt } from "@cove/runtime/components";
import { Settings as Rr, AlertTriangle as ft, Pencil as Xt, Film as jt, Loader2 as Yt, ChevronLeft as Ir, ChevronRight as kr, ExternalLink as Or, X as Zt, Plus as Tr, Upload as Pr, Trash2 as er, GripVertical as tr } from "@cove/runtime/lucide-react";
import { extensionFetch as Mr } from "@cove/runtime/api";
function qe(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function pt(e) {
  if (e.actions.some(rr))
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
function pe(e) {
  const t = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(1e3, t(e.perPage, 40)))
  };
}
function Ft(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function be(e) {
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
  ) && !rr(e);
}
function Qe(e) {
  return e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  );
}
function rr(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.steps)
    if (["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(r.mode))
      for (const i of r.tagIds) {
        const a = t.get(i);
        if (a && a !== r.mode) return !0;
        t.set(i, r.mode);
      }
  return !1;
}
function Re(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && xr(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && Array.isArray(i.steps) && i.steps.every((a) => a && Array.isArray(a.tagIds)) && bt(i)
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
function xr(e) {
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
    for (const a of i)
      r.has(a.id) || (r.add(a.id), t.push(a));
  return t;
}
function _t(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function $r(e, t, r, i) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!i && t.includes(r)) return r;
  const a = Math.max(0, e.indexOf(r));
  if (i) {
    for (const c of e.slice(a + 1))
      if (t.includes(c)) return c;
    if (t.includes(r)) {
      for (const c of e.slice(0, a).reverse())
        if (t.includes(c)) return c;
      return r;
    }
  }
  return t[Math.min(a, t.length - 1)];
}
function Dr(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((a) => r.has(a));
  for (const a of t)
    i ? r.delete(a) : r.add(a);
  return r;
}
function Lr(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const nr = "ext:com.midnightrider.data-quality:configuration", jr = "ext:cove-data-quality:video-reviews", ht = "ext:com.midnightrider.data-quality:progress", Ie = /* @__PURE__ */ new Map(), ze = /* @__PURE__ */ new Map(), at = (e, t) => e.includes("*") || e.includes(t), Ge = (e) => K(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Fr = () => ({
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
function we(e) {
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
    reviews: Re(JSON.stringify(t.reviews)),
    deletedIds: mt(t.deletedIds),
    importedIds: mt(t.importedIds)
  };
}
function _r(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const a of t) {
    const c = localStorage.getItem(a);
    if (c !== null) {
      const l = Re(c);
      r ?? (r = l), l.forEach((w) => i.add(w.id));
    }
    mt(
      JSON.parse(localStorage.getItem(`${a}:account-imports`) ?? "[]")
    ).forEach((l) => i.add(l));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function ir(e) {
  const t = await K("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function or(e, t) {
  const r = (ze.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return ze.set(e, r), r.finally(() => {
    ze.get(e) === r && ze.delete(e);
  }).catch(() => {
  }), r;
}
let Ae = null;
function Ur() {
  if (Ae) return Ae;
  const e = Kr();
  return Ae = e, e.finally(() => {
    Ae === e && (Ae = null);
  }).catch(() => {
  }), e;
}
async function Kr() {
  var C;
  const e = await K("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = at(e.permissions, "savedfilters.read"), a = i && at(e.permissions, "savedfilters.write"), c = i ? (await Ge(nr)).filter((A) => A.name === "Data Quality configuration").sort((A, m) => A.id - m.id) : [];
  if (c.length > 1) {
    const A = (m) => {
      const { revision: R, ...I } = we(m.uiOptions);
      return JSON.stringify(I);
    };
    if (c.some((m) => A(m) !== A(c[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (a)
      for (const m of c.slice(1))
        await K(`/api/savedfilters/${m.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${m.id}` })
        });
    c.splice(1);
  }
  let l = c.length ? we(c[0].uiOptions) : Fr();
  const w = localStorage.getItem(`${r}:migrated`) === "true", S = localStorage.getItem(r), p = localStorage.getItem(`${r}:local-only`) === "true";
  !c.length && S && (l = we(S));
  let s = !c.length;
  if (c.length && p && S) {
    const A = we(S);
    if (A.reviews.some((R) => {
      const I = l.reviews.find((T) => T.id === R.id);
      return I && JSON.stringify(I) !== JSON.stringify(R);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const m = [
      .../* @__PURE__ */ new Set([...l.deletedIds, ...A.deletedIds])
    ];
    l = {
      ...l,
      reviews: gt(l.reviews, A.reviews).filter(
        (R) => !m.includes(R.id)
      ),
      deletedIds: m,
      importedIds: [
        .../* @__PURE__ */ new Set([...l.importedIds, ...A.importedIds])
      ]
    }, s = !0;
  }
  if (!w) {
    const A = JSON.stringify(l), m = _r(t);
    if (c.length && m.reviews.some((d) => {
      const N = l.reviews.find((q) => q.id === d.id);
      return N && JSON.stringify(N) !== JSON.stringify(d);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const R = i ? (await Ge(jr)).flatMap(
      (d) => Re(d.uiOptions ?? "[]")
    ) : [], I = m.known.filter(
      (d) => !m.reviews.some((N) => N.id === d)
    ), T = /* @__PURE__ */ new Set([...l.deletedIds, ...I]);
    l = {
      ...l,
      reviews: gt(
        m.reviews,
        l.reviews,
        R.filter(
          (d) => !m.known.includes(d.id) && !l.importedIds.includes(d.id)
        )
      ).filter((d) => !T.has(d.id)),
      deletedIds: [...T],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...l.importedIds,
          ...m.known,
          ...R.map((d) => d.id)
        ])
      ]
    }, s || (s = JSON.stringify(l) !== A);
  }
  const f = {
    userId: t,
    recordId: (C = c[0]) == null ? void 0 : C.id,
    config: l,
    readable: i,
    writable: a,
    durable: a
  };
  if (Ie.set(r, f), s && a) {
    const A = l;
    c.length && (f.config = we(c[0].uiOptions)), await sr(r, A), l = f.config;
  } else c.length || (localStorage.setItem(r, JSON.stringify(l)), !i && (!w || p) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (a)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: l.reviews,
    storageKey: r,
    canWrite: at(e.permissions, "videos.write"),
    canConfigure: !i || a,
    storageNotice: i ? a ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function sr(e, t) {
  const r = Ie.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await ir(r), r.recordId != null) {
      const c = await K(
        `/api/savedfilters/${r.recordId}`
      );
      if (we(c.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const a = await K(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: nr,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(i)
        })
      }
    );
    r.recordId = a.id;
  } else
    localStorage.setItem(e, JSON.stringify(i)), localStorage.setItem(`${e}:local-only`, "true");
  if (r.config = i, r.durable)
    try {
      localStorage.setItem(e, JSON.stringify(i)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function Jr(e, t) {
  return Re(JSON.stringify(t)), or(e, async () => {
    const r = Ie.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((a) => !t.some((c) => c.id === a.id)).map((a) => a.id);
    await sr(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((a) => !t.some((c) => c.id === a))
    });
  });
}
function Ut(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Vr(e, t) {
  const r = Ie.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), a = i ? Ut(i) : null;
  if (!r.readable) return a;
  const c = (await Ge(ht)).find(
    (w) => w.name === t
  ), l = c ? Ut(c.uiOptions) : null;
  return a && (!l || a.updatedAt > l.updatedAt) ? a : l;
}
function Br(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return or(i, async () => {
    const a = Ie.get(e);
    if (!(a != null && a.writable)) return;
    await ir(a);
    const c = (await Ge(ht)).find(
      (l) => l.name === t
    );
    await K(
      c ? `/api/savedfilters/${c.id}` : "/api/savedfilters",
      {
        method: c ? "PUT" : "POST",
        body: JSON.stringify({
          mode: ht,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const ke = "confirmed_absent_tags", wt = "Confirmed absent tags", zr = {
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
      t === "modifier" && typeof r == "string" ? zr[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === ke.toLowerCase() ? r.toLowerCase() : He(r)
    ])
  ) : e;
}
async function K(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await Mr(e, { ...t, headers: r });
  if (!i.ok) {
    let c = i.statusText || `Request failed (${i.status}).`;
    try {
      const l = await i.json();
      c = l.message || l.detail || l.error || c;
    } catch {
    }
    throw new Error(c);
  }
  if (i.status === 204 || i.status === 205) return;
  const a = await i.text();
  return a ? JSON.parse(a) : void 0;
}
async function Kt(e, t, r) {
  const i = { ...e.view.objectFilter }, a = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return K("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      He({
        findFilter: pe(t),
        objectFilter: i,
        filterExpression: a
      })
    )
  });
}
function Qr(e) {
  return `/api/stream/video/${e}`;
}
function Jt(e) {
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
    await K(`/api/tags/${r}`), t.add(r);
    for (let i = 1; ; i++) {
      const a = await K("/api/tags/find", {
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
      for (const c of a.items) t.add(c.id);
      if (i * 1e3 >= a.totalCount) break;
      if (!a.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...t];
}
function Xr(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${ke} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function St() {
  const t = (await K("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === ke.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${wt} custom field before applying tag assessments.`
    };
  const r = Xr(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function Yr() {
  const e = await St();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await K("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: ke,
        label: wt,
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
      `The ${ke} value is not a valid tag list.`
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
  } catch (p) {
    throw new Error(
      `Could not verify the ${wt} custom field. ${p instanceof Error ? p.message : "Request failed."}`
    );
  }
  if (r.kind !== "ready") throw new Error(r.message);
  const i = await Promise.all(
    e.steps.map(async (p) => ({
      ...p,
      tagIds: p.mode === "REMOVE_TREE" ? await vt(p.tagIds) : We(p.tagIds)
    }))
  ), a = i.filter(
    (p) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(p.mode)
  ), c = i.filter(
    (p) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(p.mode)
  ), l = We(t), w = r.definition.key;
  let S = 0;
  for (const p of l)
    try {
      const s = await K(`/api/videos/${p}`), f = en(s), C = { ...s.customFields ?? {} }, A = C[w], m = Zr(A), R = new Set(f), I = new Set(m);
      for (const q of a)
        for (const P of q.tagIds)
          q.mode === "ADD" ? R.add(P) : R.delete(P);
      for (const q of c)
        for (const P of q.tagIds)
          q.mode === "MARK_PRESENT" ? (R.add(P), I.delete(P)) : q.mode === "MARK_ABSENT" ? (R.delete(P), I.add(P)) : I.delete(P);
      const T = [...R], d = [...I];
      JSON.stringify(f) === JSON.stringify(T) && JSON.stringify(m) === JSON.stringify(d) && (A === void 0 ? d.length === 0 : JSON.stringify(A) === JSON.stringify(m)) || await K(`/api/videos/${p}`, {
        method: "PUT",
        body: JSON.stringify({
          tagIds: T,
          customFields: {
            ...C,
            [w]: d
          }
        })
      }), S++;
    } catch (s) {
      throw new Error(
        `Assessment stopped after ${S} video${S === 1 ? "" : "s"} completed; video ${p} was affected. Refresh and inspect it before retrying. ${s instanceof Error ? s.message : "Request failed."}`
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
      await K("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({
          ids: [...t],
          tagIds: [...r[i].tagIds],
          tagMode: r[i].mode
        })
      });
    } catch (a) {
      throw new Error(
        `Step ${i + 1} failed; ${i} earlier step(s) completed. Refresh and check the selected videos before retrying. ${a instanceof Error ? a.message : "Request failed."}`
      );
    }
}
function nn(e) {
  var w, S, p;
  const [t, r] = v({}), [i, a] = v(""), c = (((w = e == null ? void 0 : e.presentation) == null ? void 0 : w.annotations) ?? []).includes("tags") ? ((S = e == null ? void 0 : e.presentation) == null ? void 0 : S.annotationParents) ?? [] : [], l = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...c,
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return Y(() => {
    let s = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(l).map(
        async (f) => [f, await vt([f])]
      )
    ).then((f) => {
      s && r(Object.fromEntries(f));
    }).catch(() => {
      s && a(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      s = !1;
    };
  }, [l]), { ids: t, error: i };
}
function on(e, t, r) {
  const i = t == null ? void 0 : t.presentation, a = (i == null ? void 0 : i.annotations) ?? [], c = (i == null ? void 0 : i.annotationParents) ?? [];
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
    tags: a.includes("tags") && c.length > 0 ? (e.tags ?? []).filter(
      (l) => c.some(
        (w) => {
          var S;
          return w !== l.id && ((S = r[w]) == null ? void 0 : S.includes(l.id));
        }
      )
    ) : []
  };
}
function sn({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: a
}) {
  var w, S, p;
  const c = new Set(
    (((w = t.presentation) == null ? void 0 : w.binParents) ?? []).flatMap(
      (s) => (r[s] ?? []).filter((f) => f !== s)
    )
  ), l = /* @__PURE__ */ new Map();
  for (const s of e)
    for (const f of s.tags ?? [])
      if (c.has(f.id)) {
        const C = l.get(f.id) ?? { name: f.name, count: 0 };
        C.count++, l.set(f.id, C);
      }
  return (p = (S = t.presentation) == null ? void 0 : S.binParents) != null && p.length ? /* @__PURE__ */ u("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...l].sort((s, f) => s[1].name.localeCompare(f[1].name)).map(([s, f]) => /* @__PURE__ */ u(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => a(s),
        children: [
          f.name,
          " (",
          f.count,
          ")"
        ]
      },
      s
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
function Vt({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [a, c] = v(!1), l = e.view.filter, w = (s) => t({
    ...e,
    view: { ...e.view, filter: { ...l, ...s } }
  }), S = e.presentation ?? {}, p = (s) => t({ ...e, presentation: { ...S, ...s } });
  return /* @__PURE__ */ u(ve, { children: [
    i && /* @__PURE__ */ u("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ u("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(l.q ?? ""),
            onChange: (s) => w({ q: s.target.value })
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
              onChange: (s) => w({ sort: s.target.value, sorts: void 0 }),
              children: [
                !dt.some((s) => s.value === l.sort) && l.sort != null && /* @__PURE__ */ n("option", { value: String(l.sort), children: String(l.sort) }),
                dt.map((s) => /* @__PURE__ */ n("option", { value: s.value, children: s.label }, s.value))
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
              onChange: (s) => w({ direction: s.target.value }),
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
              value: Number(l.perPage) || 40,
              onChange: (s) => w({
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
          onClick: () => c(!0),
          children: "Edit video filters"
        }
      ),
      /* @__PURE__ */ u("p", { children: [
        Object.keys(e.view.objectFilter).length ? "Video filters configured" : "No video filters",
        ". Choose which videos enter the queue."
      ] }),
      a && /* @__PURE__ */ n("div", { onKeyDown: (s) => s.stopPropagation(), children: /* @__PURE__ */ n(
        Sr,
        {
          open: !0,
          onClose: () => c(!1),
          criteria: Wt,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: !0,
          subjectLabel: "videos",
          onApply: (s) => {
            t({ ...e, view: { ...e.view, objectFilter: s } }), c(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ u(ve, { children: [
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
        const f = S.annotations ?? [];
        return /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: f.includes(s),
              onChange: (C) => p({
                annotations: C.target.checked ? [...f, s] : f.filter((A) => A !== s)
              })
            }
          ),
          s
        ] }, s);
      }) }),
      (S.annotations ?? []).includes("tags") && /* @__PURE__ */ u(ve, { children: [
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected." }),
        /* @__PURE__ */ n(
          ut,
          {
            entityType: "tag",
            values: S.annotationParents ?? [],
            placeholder: "Search annotation parent tags...",
            onChange: (s) => p({ annotationParents: s }),
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
          values: S.binParents ?? [],
          placeholder: "Search tag-bin parent tags...",
          onChange: (s) => p({ binParents: s }),
          allowCreate: !1
        }
      )
    ] })
  ] });
}
const lt = 180;
function Bt(e) {
  return e.view.displayMode === "wall" ? "wall" : "grid";
}
function zt(e) {
  return e === "wall" ? "wall" : "grid";
}
function ln() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Qt(e) {
  const t = new URLSearchParams(window.location.search);
  e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function cn(e) {
  return pe({ ...e, page: 1 });
}
function yt(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((l, w) => yt(l, t[w]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, a = Object.keys(r).sort(), c = Object.keys(i).sort();
  return a.length === c.length && a.every(
    (l, w) => l === c[w] && yt(r[l], i[l])
  );
}
function ar(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function X(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
function dn({
  onNavigate: e
}) {
  const [t, r] = v([]), [i] = v(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [a, c] = v(""), [l, w] = v(!0), [S, p] = v(""), [s, f] = v(!1), [C, A] = v(!0), [m, R] = v(""), [I, T] = v(""), [d, N] = v(!1), [q, P] = v(!1), [h, $] = v(ln), [V, J] = v(!1), [se, oe] = v(!1), [F, Se] = v(
    null
  ), L = t.find((o) => o.id === h) ?? null, y = Dt(
    () => (F == null ? void 0 : F.id) === h && L ? { ...L, view: F.view } : L,
    [F, h, L]
  ), Oe = j(
    null
  ), Te = nn(y), [_, Pe] = v({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [lr, cr] = v({
    page: 1,
    perPage: 40
  }), [te, Nt] = v({ items: [], totalCount: 0 }), [k, Me] = v(!1), [re, Et] = v(""), [ae, ce] = v(() => /* @__PURE__ */ new Set()), Xe = j(ae);
  Xe.current = ae;
  const ge = j(/* @__PURE__ */ new Map()), [H, ne] = v(null), Z = j(H);
  Z.current = H;
  const [ie, he] = v(!1), le = j(ie);
  le.current = ie;
  const Ct = j(null), [xe, Ye] = v("grid"), [$e, At] = v(lt), [M, Ze] = v(!1), De = j(!1), [dr, et] = v(""), [qt, me] = v(""), [tt, Ne] = v(""), [D, Rt] = v(null), [It, Le] = v(""), [je, Fe] = v(!1), rt = j(/* @__PURE__ */ new Map()), kt = j(null), ye = j(0), _e = j(0), Ue = j(null), Ot = fe(async () => {
    w(!0), p("");
    try {
      const o = await Ur();
      r(o.reviews), c(o.storageKey), f(o.canWrite), A(o.canConfigure ?? !0), R(o.storageNotice ?? ""), h && !o.reviews.some((g) => g.id === h) && ($(""), Qt(""));
    } catch (o) {
      p(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      w(!1);
    }
  }, [h]);
  Y(() => {
    Ot();
  }, []);
  const Ke = fe(async () => {
    Le("");
    try {
      Rt(await St());
    } catch (o) {
      Rt(null), Le(
        "Tag assessment setup could not be checked. " + (o instanceof Error ? o.message : "Request failed.")
      );
    }
  }, []);
  Y(() => {
    Ke();
  }, [Ke]);
  const de = fe(
    async (o, g) => {
      var U;
      const b = ++ye.current;
      (U = Ue.current) == null || U.abort();
      const E = new AbortController();
      Ue.current = E, g = pe(g), Pe(g), Me(!0), Et("");
      try {
        let O = await Kt(
          o,
          g,
          E.signal
        );
        const z = Math.max(
          1,
          Math.ceil(O.totalCount / Number(g.perPage))
        );
        return Number(g.page) > z && (g = { ...g, page: z }, O = await Kt(
          o,
          g,
          E.signal
        )), b === ye.current && (Nt(O), Pe(g), cr(g)), O;
      } catch (O) {
        throw b === ye.current && Et(
          O instanceof Error ? O.message : "Could not load the review queue."
        ), O;
      } finally {
        b === ye.current && Me(!1);
      }
    },
    []
  );
  Y(() => {
    var g;
    if (_e.current += 1, ye.current += 1, (g = Ue.current) == null || g.abort(), P(!1), T(""), N(!1), ce(/* @__PURE__ */ new Set()), ge.current.clear(), ne(null), he(!1), Ze(!1), De.current = !1, et(""), me(""), Ne(""), Nt({ items: [], totalCount: 0 }), !y) {
      Me(!1);
      return;
    }
    let o = !0;
    return Me(!0), (async () => {
      let b = null;
      try {
        b = await Vr(a, y.id);
      } catch (O) {
        o && (N(!0), T(
          O instanceof Error ? O.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const E = (b == null ? void 0 : b.signature) === be(y) ? b : null, U = E ? pe(E.filter) : cn(y.view.filter);
      Pe(U), Ye(
        E ? zt(E.displayMode) : Bt(y)
      ), At(
        E ? E.cardSize ?? lt : lt
      );
      try {
        const O = await de(y, U);
        if (!o) return;
        const z = Ft(
          O.items.map((Q) => Q.id),
          (E == null ? void 0 : E.focusedId) ?? null,
          (E == null ? void 0 : E.index) ?? 0
        );
        ne(z), B(z);
      } catch {
      }
      o && P(!0);
    })(), () => {
      var b;
      o = !1, _e.current++, ye.current++, (b = Ue.current) == null || b.abort();
    };
  }, [y == null ? void 0 : y.id]);
  const x = Dt(
    () => te.items.map((o) => o.id),
    [te.items]
  );
  Y(() => {
    if (!q || !y || !a || k || re || M || (F == null ? void 0 : F.id) === y.id || d)
      return;
    const o = {
      version: 1,
      signature: be(y),
      filter: _,
      focusedId: H,
      index: Math.max(0, x.indexOf(H ?? -1)),
      displayMode: xe,
      cardSize: $e,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        a + ":progress:" + y.id,
        JSON.stringify(o)
      );
    } catch {
    }
    if (I) return;
    let g = !0;
    const b = window.setTimeout(() => {
      Br(a, y.id, o).catch((E) => {
        g && T(
          "Progress is kept in this browser, but account sync failed. " + (E instanceof Error ? E.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      g = !1, window.clearTimeout(b);
    };
  }, [
    q,
    a,
    y,
    k,
    re,
    M,
    _,
    H,
    x,
    xe,
    $e,
    F,
    I,
    d
  ]);
  const nt = te.items.find((o) => o.id === H) ?? null;
  ie && nt && (Ct.current = nt);
  const ue = nt ?? (ie ? Ct.current : null), ur = _t(ae, H), Tt = ae.size > 0 ? `${ae.size} selected video${ae.size === 1 ? "" : "s"}` : H == null ? "no video" : "focused video", B = fe((o, g = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const b = rt.current.get(o);
      b == null || b.focus({ preventScroll: !0 }), g && (b == null || b.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  Y(() => {
    q && !le.current && B(Z.current);
  }, [q, B]), Y(() => {
    k || !x.length || (Z.current == null || !x.includes(Z.current)) && (ne(x[0]), le.current || B(x[0]));
  }, [B, x, k]);
  const Ee = fe(
    (o) => {
      ce((g) => {
        const b = o(g);
        for (const E of /* @__PURE__ */ new Set([...g, ...b]))
          g.has(E) !== b.has(E) && ge.current.set(
            E,
            (ge.current.get(E) ?? 0) + 1
          );
        return b;
      });
    },
    []
  ), it = fe(
    (o) => {
      if (!x.length) return;
      const g = Math.max(
        0,
        x.indexOf(Z.current ?? x[0])
      ), b = x[Math.max(0, Math.min(x.length - 1, g + o))];
      ne(b), le.current || B(b);
    },
    [B, x]
  ), ot = fe(
    async (o) => {
      const g = _t(
        Xe.current,
        Z.current
      );
      if (!y || De.current || k || re || !s || Qe(o) && (D == null ? void 0 : D.kind) !== "ready" || !g.length)
        return;
      const b = ++_e.current, E = y.id, U = [...x], O = Z.current, z = new Map(
        g.map((G) => [G, ge.current.get(G) ?? 0])
      ), Q = () => b === _e.current && y.id === E;
      De.current = !0, Ze(!0), et(
        Xe.current.size ? `${g.length} selected videos` : "the focused video"
      ), me(""), Ne("");
      let Ce = !1;
      try {
        if (await rn(o, g), Ce = !0, !Q()) return;
        ce((G) => {
          const W = new Set(G);
          for (const ee of g)
            (ge.current.get(ee) ?? 0) === z.get(ee) && W.delete(ee);
          return W;
        }), me(
          `${o.label}: ${g.length} video${g.length === 1 ? "" : "s"} ${o.steps.length ? "updated" : "skipped"}.`
        );
      } catch (G) {
        if (!Q()) return;
        Ne(
          G instanceof Error ? G.message : "Action failed."
        );
      }
      try {
        if (await Wr(o), !Q()) return;
        const G = await de(y, _);
        if (!Q()) return;
        let W = G.items.map((ee) => ee.id);
        if (!W.length && G.totalCount > 0 && Number(_.page) > 1) {
          const ee = Math.max(1, Number(_.page) - 1), Be = { ..._, page: ee };
          Pe(Be), W = (await de(y, Be)).items.map((st) => st.id), ce(
            (st) => new Set([...st].filter((wr) => W.includes(wr)))
          );
          const $t = W.at(-1) ?? null;
          ne($t), le.current || B($t);
        } else {
          ce(
            (Be) => new Set([...Be].filter((xt) => W.includes(xt)))
          );
          const ee = $r(
            U,
            W,
            O,
            Ce && g.includes(O ?? -1)
          );
          ne(ee), le.current && ee == null && he(!1), le.current || B(ee);
        }
      } catch (G) {
        Q() && Ne(
          (W) => `${W ? `${W} ` : ""}${Ce ? "The action completed, but " : ""}the queue could not be refreshed. ${G instanceof Error ? G.message : "Refresh failed."}`
        );
      } finally {
        Q() && (De.current = !1, Ze(!1), et(""));
      }
    },
    [
      s,
      D,
      de,
      _,
      B,
      x,
      k,
      re,
      y
    ]
  );
  function fr() {
    var b;
    const o = (b = kt.current) == null ? void 0 : b.firstElementChild, g = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, g.split(" ").filter(Boolean).length);
  }
  function pr(o) {
    if (o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || V) return;
    if (ie && o.key === "Escape") {
      X(o), he(!1), B(Z.current);
      return;
    }
    if (!Lr(o.target)) return;
    if (o.key === "Escape") {
      X(o), Ee(() => /* @__PURE__ */ new Set());
      return;
    }
    const g = (y == null ? void 0 : y.actions.findIndex(
      (U, O) => qe(U, O) === o.key
    )) ?? -1;
    if (g >= 0 && (y != null && y.actions[g])) {
      X(o), !M && !k && ot(y.actions[g]);
      return;
    }
    if (!ie && o.key === " ") {
      X(o), H != null && Ee((U) => ct(U, H));
      return;
    }
    if (!ie && o.key.toLowerCase() === "a") {
      X(o), Ee(
        (U) => Dr(U, x)
      );
      return;
    }
    if (M || k || ie) return;
    if (o.key === "Enter" && H != null) {
      X(o), he(!0);
      return;
    }
    const b = fr(), E = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -b : o.key === "ArrowDown" ? b : 0;
    E && (X(o), it(E));
  }
  function Je(o) {
    $(o), Qt(o);
  }
  async function Pt(o) {
    if (!a) return !1;
    const g = o.map(fn);
    try {
      await Jr(a, g);
    } catch (E) {
      throw E;
    }
    r(g), h && !g.some((E) => E.id === h) && Je("");
    const b = g.find((E) => E.id === h);
    return b && L && JSON.stringify(b) !== JSON.stringify(L) && (b.view.displayMode !== L.view.displayMode && Ye(Bt(b)), be(b) !== be(L) && (Se(null), Ve(
      b,
      pe({ ...b.view.filter, page: _.page })
    ))), !0;
  }
  if (l)
    return /* @__PURE__ */ n(Gt, { label: "Loading Data Quality reviews…" });
  if (S)
    return /* @__PURE__ */ u(ve, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void wn().catch(
            (o) => p(
              "Could not export browser reviews. " + (o instanceof Error ? o.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        Ht,
        {
          message: S,
          onRetry: () => void Ot()
        }
      )
    ] });
  return /* @__PURE__ */ u("div", { className: "data-quality-page", onKeyDown: pr, children: [
    /* @__PURE__ */ u("header", { className: "data-quality-header", children: [
      /* @__PURE__ */ n("h1", { children: "Data Quality" }),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-settings",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: M || k || !C,
          onClick: () => {
            oe(!1), J(!0);
          },
          children: /* @__PURE__ */ n(Rr, {})
        }
      )
    ] }),
    m && /* @__PURE__ */ n("p", { className: "dq-status", children: m }),
    (D == null ? void 0 : D.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      D.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: je,
          onClick: () => {
            Fe(!0), Le(""), Yr().then(Ke).catch(
              (o) => Le(
                "Could not create the Confirmed absent tags custom field. " + (o instanceof Error ? o.message : "Request failed.")
              )
            ).finally(() => Fe(!1));
          },
          children: je ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    ((D == null ? void 0 : D.kind) === "incompatible" || It) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(ft, {}),
      It || (D == null ? void 0 : D.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: je,
          onClick: () => {
            Fe(!0), Ke().finally(
              () => Fe(!1)
            );
          },
          children: je ? "Checking…" : "Check again"
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
            const o = localStorage.getItem("page-videos") ?? "[]", g = URL.createObjectURL(
              new Blob([o], { type: "application/json" })
            ), b = document.createElement("a");
            b.href = g, b.download = "data-quality-unassigned-legacy-reviews.json", b.click(), URL.revokeObjectURL(g);
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
            T(""), N(!1);
          },
          children: d ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    !y && /* @__PURE__ */ n("section", { className: "dq-toolbar", children: /* @__PURE__ */ u("label", { className: "dq-review-select", children: [
      "Review",
      /* @__PURE__ */ u(
        "select",
        {
          value: "",
          disabled: M,
          onChange: (o) => Je(o.target.value),
          children: [
            /* @__PURE__ */ n("option", { value: "", children: "Choose a review…" }),
            t.map((o) => /* @__PURE__ */ n("option", { value: o.id, children: o.name }, o.id))
          ]
        }
      )
    ] }) }),
    (y == null ? void 0 : y.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: y.description }),
    y && L && /* @__PURE__ */ u(
      "section",
      {
        className: "dq-queue-toolbar",
        "aria-label": "Video queue toolbar",
        style: {
          "--dq-review-select-width": `${Math.min(
            32,
            Math.max(12, y.name.length + 3)
          )}ch`
        },
        children: [
          /* @__PURE__ */ u("div", { className: "dq-queue-review-controls", children: [
            /* @__PURE__ */ u("label", { children: [
              /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Review" }),
              /* @__PURE__ */ u(
                "select",
                {
                  "aria-label": "Review",
                  value: y.id,
                  disabled: M,
                  onChange: (o) => Je(o.target.value),
                  children: [
                    /* @__PURE__ */ n("option", { value: "", children: "Choose a review…" }),
                    t.map((o) => /* @__PURE__ */ n("option", { value: o.id, children: o.name }, o.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": "Edit review",
                title: "Edit review",
                disabled: M || k || !C,
                onClick: () => {
                  oe(!0), J(!0);
                },
                children: /* @__PURE__ */ n(Xt, {})
              }
            )
          ] }),
          /* @__PURE__ */ n(
            "div",
            {
              className: `dq-native-toolbar-host${M || k ? " dq-native-toolbar-disabled" : ""}`,
              "aria-disabled": M || k || void 0,
              inert: M || k ? !0 : void 0,
              children: /* @__PURE__ */ n(
                Nr,
                {
                  filter: re ? lr : _,
                  onFilterChange: gr,
                  totalCount: te.totalCount,
                  sortOptions: dt,
                  showSearch: !0,
                  showSort: !0,
                  displayMode: xe,
                  onDisplayModeChange: (o) => Ye(zt(o)),
                  availableDisplayModes: ["grid", "wall"],
                  zoomLevel: ($e - 225) / 50,
                  onZoomChange: (o) => At(Math.round(225 + o * 50)),
                  cardSizeEntityType: "videos",
                  criteriaDefinitions: Wt,
                  objectFilter: y.view.objectFilter,
                  onObjectFilterChange: (o) => {
                    !M && !k && (Oe.current = o);
                  },
                  showPagingControls: !1
                }
              )
            }
          ),
          (F == null ? void 0 : F.id) === h && /* @__PURE__ */ u("div", { className: "dq-review-defaults", children: [
            /* @__PURE__ */ n("span", { children: "Temporary queue" }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: M || k || !C,
                onClick: mr,
                children: "Save queue to review"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: M || k,
                onClick: hr,
                children: "Reset to review defaults"
              }
            )
          ] })
        ]
      }
    ),
    y ? /* @__PURE__ */ u(ve, { children: [
      Te.error && /* @__PURE__ */ n("p", { role: "alert", children: Te.error }),
      /* @__PURE__ */ n(
        sn,
        {
          videos: te.items,
          review: y,
          trees: Te.ids,
          disabled: M || k,
          onChoose: (o) => {
            const g = an(y, o);
            Se(g), Ve(g, { ..._, page: 1 });
          }
        }
      ),
      tt && !ie && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(ft, {}),
        tt
      ] }),
      qt && /* @__PURE__ */ n("p", { role: "status", className: "dq-status", children: qt }),
      /* @__PURE__ */ u("div", { className: "dq-workspace", children: [
        /* @__PURE__ */ u("main", { children: [
          Mt("top"),
          k && !te.items.length && /* @__PURE__ */ n(Gt, { label: "Loading review queue…" }),
          re && !k && /* @__PURE__ */ n(
            Ht,
            {
              message: re,
              onRetry: () => void de(y, _).catch(() => {
              })
            }
          ),
          !k && !re && !te.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
            /* @__PURE__ */ n(jt, {}),
            /* @__PURE__ */ n("p", { children: "No videos match this review." })
          ] }),
          !!te.items.length && /* @__PURE__ */ n("div", { ref: kt, children: /* @__PURE__ */ n(
            "div",
            {
              className: "dq-grid",
              style: {
                "--dq-card-width": `${$e}px`
              },
              children: te.items.map(br)
            }
          ) }),
          Mt("bottom")
        ] }),
        /* @__PURE__ */ u("aside", { className: "dq-actions", children: [
          /* @__PURE__ */ n("strong", { children: Tt }),
          y.actions.map((o, g) => /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              disabled: M || k || !!re || !s || Qe(o) && (D == null ? void 0 : D.kind) !== "ready" || !ur.length,
              onClick: () => void ot(o),
              children: [
                qe(o, g) && /* @__PURE__ */ n("kbd", { children: qe(o, g) }),
                /* @__PURE__ */ n("span", { children: o.label }),
                /* @__PURE__ */ n("small", { children: o.steps.length ? `${o.steps.length} step(s)` : "Skip" })
              ]
            },
            o.id
          )),
          !y.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
          !s && /* @__PURE__ */ n("p", { children: "Video write permission is required to apply actions." }),
          M && /* @__PURE__ */ u("p", { role: "status", children: [
            /* @__PURE__ */ n(Yt, { className: "dq-spin" }),
            " Applying action to",
            " ",
            dr,
            "…"
          ] }),
          /* @__PURE__ */ n("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(jt, {}),
      /* @__PURE__ */ n("p", { children: t.length ? "Choose a saved review to open its queue." : "No saved reviews are available in this browser." })
    ] }),
    ie && ue && y && /* @__PURE__ */ n(
      hn,
      {
        video: ue,
        review: y,
        targetLabel: Tt,
        pending: M,
        refreshing: k || !!re,
        error: tt,
        canWrite: s,
        assessmentReady: (D == null ? void 0 : D.kind) === "ready",
        selected: ae.has(ue.id),
        hasPrevious: x.indexOf(ue.id) > 0,
        hasNext: x.indexOf(ue.id) >= 0 && x.indexOf(ue.id) < x.length - 1,
        onToggleSelected: () => Ee((o) => ct(o, ue.id)),
        onPrevious: () => it(-1),
        onNext: () => it(1),
        onClose: () => {
          he(!1), B(Z.current);
        },
        onAction: ot
      }
    ),
    V && /* @__PURE__ */ n(
      mn,
      {
        reviews: t,
        activeReview: L,
        initialEdit: se,
        onSave: Pt,
        onChoose: Je,
        onClose: () => {
          J(!1), se && B(Z.current, !1);
        }
      }
    )
  ] });
  async function Ve(o, g) {
    const b = Z.current, E = Math.max(0, x.indexOf(b ?? -1));
    try {
      const O = (await de(o, g)).items.map((Q) => Q.id);
      ce(
        (Q) => new Set([...Q].filter((Ce) => O.includes(Ce)))
      );
      const z = Ft(O, b, E);
      ne(z), le.current || B(z, !1);
    } catch {
    }
  }
  function gr(o) {
    const g = Oe.current;
    if (Oe.current = null, M || k || !y || !L) return;
    const b = g ?? y.view.objectFilter, E = yt(
      b,
      L.view.objectFilter
    ) ? L.view.objectFilter : b, U = pe({ ...o, page: 1 }), O = {
      ...y,
      view: {
        ...y.view,
        filter: U,
        objectFilter: E
      }
    }, z = be(O) !== be(L), Q = z ? O : L;
    Se(z ? O : null), me(
      z ? "Queue adjusted for this session." : "Review queue defaults restored."
    ), Ve(Q, U);
  }
  function hr() {
    if (M || k || !L) return;
    Oe.current = null;
    const o = pe({
      ...L.view.filter,
      page: 1
    });
    Se(null), me("Review queue defaults restored."), Ve(L, o);
  }
  function mr() {
    M || k || !y || !L || !C || Pt(
      t.map(
        (o) => o.id === h ? {
          ...o,
          view: {
            ...y.view,
            filter: { ..._, page: 1 }
          }
        } : o
      )
    ).then(() => {
      Se(null), me("Queue saved to this review.");
    }).catch(
      (o) => Ne(
        o instanceof Error ? o.message : "Could not save queue."
      )
    );
  }
  function yr() {
    ce(/* @__PURE__ */ new Set()), ge.current.clear(), ne(null);
  }
  function Mt(o) {
    return y ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: M || k,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          Er,
          {
            filter: {
              ..._,
              page: Number(_.page) || 1,
              perPage: Number(_.perPage) || 40
            },
            totalCount: te.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${o}`,
            onFilterChange: (g) => {
              M || k || g.page === Number(_.page) || un(
                { ..._, page: g.page },
                y,
                de,
                yr
              );
            }
          }
        )
      }
    ) : null;
  }
  function br(o) {
    return /* @__PURE__ */ n(
      pn,
      {
        video: on(o, y, Te.ids),
        displayMode: xe,
        focused: o.id === H,
        selected: ae.has(o.id),
        setRef: (g) => {
          g ? rt.current.set(o.id, g) : rt.current.delete(o.id);
        },
        onFocus: () => ne(o.id),
        onToggle: () => Ee((g) => ct(g, o.id)),
        onPreview: () => {
          ne(o.id), he(!0);
        },
        onNavigate: e
      },
      o.id
    );
  }
}
function un(e, t, r, i) {
  i(), r(t, e).catch(() => {
  });
}
function ct(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function fn(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function pn({
  video: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: a,
  onFocus: c,
  onToggle: l,
  onPreview: w,
  onNavigate: S
}) {
  const p = ar(e), s = j(null), f = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, C = !!(f.date || f.studioName), A = !!(f.performers.length || f.tags.length);
  return vr(() => {
    const m = s.current;
    if (!m) return;
    const R = m.querySelector(
      `a[href="/video/${e.id}"]`
    ), I = m.querySelector(".card-title"), T = `dq-card-title-${e.id}`;
    I && (I.id = T), R && (R.target = "_blank", R.rel = "noreferrer", R.removeAttribute("aria-label"), R.setAttribute("aria-labelledby", T), R.classList.add("dq-card-link"));
    const d = m.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    d && d.setAttribute(
      "aria-label",
      i ? `Deselect ${p}` : `Select ${p}`
    );
    const N = m.querySelector(
      'button[title="Quick View"]'
    );
    N && N.setAttribute("aria-label", `Preview ${p}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (m) => {
        s.current = m, a(m);
      },
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${p}${i ? ", selected" : ""}`,
      onFocus: c,
      onClick: (m) => {
        c(), m.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${t} ${C ? "has-card-metadata" : "no-card-metadata"} ${A ? "has-card-footer" : "no-card-footer"} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          Ar,
          {
            video: f,
            selected: i,
            onSelect: l,
            onNavigate: S,
            onQuickView: w,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t === "wall" && /* @__PURE__ */ n(gn, { video: e })
      ]
    }
  );
}
function gn({ video: e }) {
  const t = j(null), r = j(null), [i, a] = v(!1), [c, l] = v(!1), [w, S] = v(!1);
  return Y(() => {
    const p = t.current;
    if (!p || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      a(!0), l(!0);
      return;
    }
    const s = new IntersectionObserver(
      ([C]) => a(C.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), f = new IntersectionObserver(
      ([C]) => l(C.isIntersecting && C.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return s.observe(p), f.observe(p), () => {
      s.disconnect(), f.disconnect();
    };
  }, [e.id, e.files.length]), Y(() => {
    if (!i) {
      S(!1);
      return;
    }
    const p = new AbortController();
    return K(Hr(e.id), {
      signal: p.signal
    }).then((s) => {
      p.signal.aborted || S(s.available === !0);
    }).catch(() => {
      p.signal.aborted || S(!1);
    }), () => p.abort();
  }, [i, e.id]), Y(() => {
    const p = r.current;
    p && (c ? Promise.resolve(p.play()).catch(() => {
    }) : p.pause());
  }, [w, c]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: w && /* @__PURE__ */ n(
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
function hn({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: a,
  error: c,
  canWrite: l,
  assessmentReady: w,
  selected: S,
  hasPrevious: p,
  hasNext: s,
  onToggleSelected: f,
  onPrevious: C,
  onNext: A,
  onClose: m,
  onAction: R
}) {
  const I = j(null), T = j(null), d = e.files[0], N = ar(e);
  Y(() => {
    var $;
    const h = document.body.style.overflow;
    return document.body.style.overflow = "hidden", ($ = I.current) == null || $.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = h;
    };
  }, []);
  function q(h) {
    var J, se, oe;
    if (h.key !== "Tab") return;
    const $ = [
      ...((J = I.current) == null ? void 0 : J.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((F) => F.offsetParent !== null);
    if (!$.length) {
      h.preventDefault(), (se = I.current) == null || se.focus();
      return;
    }
    const V = $.indexOf(
      document.activeElement
    );
    h.shiftKey && V <= 0 ? (h.preventDefault(), (oe = $.at(-1)) == null || oe.focus()) : !h.shiftKey && V === $.length - 1 && (h.preventDefault(), $[0].focus());
  }
  function P(h) {
    if (h.defaultPrevented || h.ctrlKey || h.metaKey || h.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const $ = h.key === "ArrowLeft" || h.key === "ArrowRight";
    if (h.altKey && !$) return;
    const V = T.current, J = h.currentTarget.querySelector("video");
    if (h.key === "Enter" || h.key === "Escape")
      h.repeat || m();
    else if (h.key === " " && V)
      h.repeat || V.toggle();
    else if ($ && V)
      V.seekBy(
        (h.key === "ArrowLeft" ? -1 : 1) * (h.shiftKey ? 5 : h.altKey ? 10 : 60)
      );
    else if ((h.key === "," || h.key === ".") && V) {
      const se = [d == null ? void 0 : d.duration, J == null ? void 0 : J.duration].find(
        (F) => F != null && Number.isFinite(F) && F > 0
      ) ?? 0, oe = e.parentVideoId != null ? (e.clipEndSec ?? se) - (e.clipStartSec ?? 0) : se;
      Number.isFinite(oe) && oe > 0 && V.seekBy((h.key === "," ? -1 : 1) * oe * 0.1);
    } else if (h.key.toLowerCase() === "n" || h.key.toLowerCase() === "m")
      !h.repeat && !i && !a && (h.key.toLowerCase() === "n" && p && C(), h.key.toLowerCase() === "m" && s && A());
    else if (h.key === "ArrowUp" && J)
      J.volume = Math.min(1, J.volume + 0.1);
    else if (h.key === "ArrowDown" && J)
      J.volume = Math.max(0, J.volume - 0.1);
    else return;
    X(h);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: I,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${N}`,
      className: "dq-preview",
      onKeyDown: q,
      onKeyDownCapture: P,
      onMouseDown: (h) => {
        h.target === h.currentTarget && m();
      },
      children: /* @__PURE__ */ u("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ u("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !p || i || a,
              onClick: C,
              children: /* @__PURE__ */ n(Ir, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !s || i || a,
              onClick: A,
              children: /* @__PURE__ */ n(kr, {})
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
              onClick: f,
              disabled: a,
              children: S ? "Selected" : "Select"
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
              children: /* @__PURE__ */ n(Or, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: m,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(Zt, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: d ? /* @__PURE__ */ n(
          Cr,
          {
            autostart: !0,
            streamUrl: Qr(e.id),
            posterUrl: Jt(e),
            format: d.format,
            audioCodec: d.audioCodec,
            duration: d.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (h) => (T.current = h, () => {
              T.current === h && (T.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: Jt(e), alt: "" }) }),
        c && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: c }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((h, $) => /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            disabled: i || a || !l || Qe(h) && !w,
            onClick: () => void R(h),
            children: [
              qe(h, $) && /* @__PURE__ */ n("kbd", { children: qe(h, $) }),
              h.label
            ]
          },
          h.id
        )) })
      ] })
    }
  );
}
function mn({
  reviews: e,
  activeReview: t,
  initialEdit: r = !1,
  onSave: i,
  onChoose: a,
  onClose: c
}) {
  const [l, w] = v(
    () => r && t ? structuredClone(t) : null
  ), [S, p] = v(""), [s, f] = v(!1), C = j(null);
  Y(() => {
    var q, P;
    const d = document.activeElement, N = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (P = (q = C.current) == null ? void 0 : q.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || P.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = N, d == null || d.focus({ preventScroll: !0 });
    };
  }, []);
  function A(d) {
    var P, h, $;
    if (d.defaultPrevented) {
      d.stopPropagation();
      return;
    }
    if (d.key === "Escape") {
      X(d), s || c();
      return;
    }
    if (d.key !== "Tab") {
      d.stopPropagation();
      return;
    }
    const N = [
      ...((P = C.current) == null ? void 0 : P.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((V) => V.offsetParent !== null);
    if (!N.length) {
      X(d), (h = C.current) == null || h.focus();
      return;
    }
    const q = N.indexOf(
      document.activeElement
    );
    d.shiftKey && q <= 0 ? (X(d), ($ = N.at(-1)) == null || $.focus()) : !d.shiftKey && q === N.length - 1 ? (X(d), N[0].focus()) : d.stopPropagation();
  }
  function m(d) {
    w(
      d ? structuredClone(d) : {
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
    if (!l || pt(l)) {
      p(l ? pt(l) : "Choose a review.");
      return;
    }
    const d = { ...l, name: l.name.trim() }, N = e.some((q) => q.id === d.id) ? e.map((q) => q.id === d.id ? d : q) : [...e, d];
    f(!0), p("");
    try {
      if (!await i(N)) throw new Error("Could not save reviews.");
      a(d.id), c();
    } catch (q) {
      p(
        "Could not save reviews. Your edits are still open. " + (q instanceof Error ? q.message : "Retry saving.")
      );
    } finally {
      f(!1);
    }
  }
  async function I(d) {
    if (!s) {
      f(!0), p("");
      try {
        if (!await i(d)) throw new Error("Could not save reviews.");
      } catch (N) {
        p(
          N instanceof Error ? N.message : "Could not save reviews."
        );
      } finally {
        f(!1);
      }
    }
  }
  async function T(d) {
    var q;
    if (s) return;
    const N = (q = d.target.files) == null ? void 0 : q[0];
    if (d.target.value = "", !!N) {
      if (N.size > 2e6) {
        p("Review files must be smaller than 2 MB.");
        return;
      }
      f(!0), p("");
      try {
        const P = Re(await N.text());
        if (!await i(gt(e, P)))
          throw new Error("Could not save reviews.");
      } catch (P) {
        p(
          P instanceof Error ? P.message : "Could not import reviews."
        );
      } finally {
        f(!1);
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
            /* @__PURE__ */ n("h2", { children: l ? e.some((d) => d.id === l.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: s,
              onClick: c,
              children: /* @__PURE__ */ n(Zt, {})
            }
          )
        ] }),
        S && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: S }),
        /* @__PURE__ */ n("fieldset", { disabled: s, className: "dq-manager-content", children: l ? /* @__PURE__ */ n(
          yn,
          {
            draft: l,
            saving: s,
            setDraft: w,
            onSave: () => void R(),
            onCancel: c
          }
        ) : /* @__PURE__ */ u(ve, { children: [
          /* @__PURE__ */ u("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ u(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => m(),
                children: [
                  /* @__PURE__ */ n(Tr, {}),
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
                  onChange: T
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((d) => /* @__PURE__ */ u("article", { children: [
            /* @__PURE__ */ u("div", { children: [
              /* @__PURE__ */ n("strong", { children: d.name }),
              /* @__PURE__ */ n("p", { children: d.description || "No description" })
            ] }),
            /* @__PURE__ */ u("button", { type: "button", onClick: () => m(d), children: [
              /* @__PURE__ */ n(Xt, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => m({
                  ...structuredClone(d),
                  id: crypto.randomUUID(),
                  name: `${d.name} copy`
                }),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${d.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${d.name}”?`) && I(
                    e.filter((N) => N.id !== d.id)
                  );
                },
                children: /* @__PURE__ */ n(er, {})
              }
            )
          ] }, d.id)) })
        ] }) })
      ] })
    }
  );
}
function yn({
  draft: e,
  saving: t = !1,
  setDraft: r,
  onSave: i,
  onCancel: a
}) {
  const [c, l] = v("Review"), w = j(/* @__PURE__ */ new WeakMap()), S = (s) => {
    let f = w.current.get(s);
    return f || (f = crypto.randomUUID(), w.current.set(s, f)), f;
  }, p = (s, f) => r({
    ...e,
    actions: e.actions.map(
      (C, A) => A === s ? f : C
    )
  });
  return /* @__PURE__ */ u("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      qr,
      {
        tabs: ["Review", "Queue", "Appearance", "Actions"].map((s) => ({
          key: s,
          label: s,
          count: s === "Actions" ? e.actions.length : void 0,
          disabled: t
        })),
        activeTab: c,
        onTabChange: l
      }
    ) }),
    /* @__PURE__ */ u("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ u("section", { hidden: c !== "Review", className: "dq-editor-section", children: [
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
      /* @__PURE__ */ n("section", { hidden: c !== "Queue", className: "dq-editor-section", children: /* @__PURE__ */ n(Vt, { draft: e, onChange: r, presentation: !1 }) }),
      /* @__PURE__ */ n("section", { hidden: c !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(Vt, { draft: e, onChange: r, queue: !1 }) }),
      /* @__PURE__ */ u("section", { hidden: c !== "Actions", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Actions" }),
        /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
        /* @__PURE__ */ n(
          Lt,
          {
            items: e.actions,
            getKey: (s) => s.id,
            disabled: t,
            className: "dq-sortable-list",
            onReorder: (s) => r({ ...e, actions: s }),
            renderItem: (s, { index: f, dragHandleProps: C, isOver: A }) => /* @__PURE__ */ u(
              "fieldset",
              {
                className: A ? "dq-action-card dq-drag-over" : "dq-action-card",
                children: [
                  /* @__PURE__ */ u("legend", { children: [
                    "Action ",
                    f + 1
                  ] }),
                  /* @__PURE__ */ u("div", { className: "dq-action-heading", children: [
                    /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        ...C,
                        disabled: t,
                        className: "dq-drag-handle",
                        "aria-label": `Reorder action ${f + 1}`,
                        children: /* @__PURE__ */ n(tr, {})
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
                            ...e.actions.slice(0, f + 1),
                            {
                              ...structuredClone(s),
                              id: crypto.randomUUID(),
                              label: s.label + " copy",
                              shortcut: ""
                            },
                            ...e.actions.slice(f + 1)
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
                          onChange: (m) => p(f, {
                            ...s,
                            shortcut: m.target.value === "auto" ? void 0 : m.target.value
                          }),
                          children: [
                            /* @__PURE__ */ u("option", { value: "auto", children: [
                              "Position (",
                              f < 9 ? f + 1 : "none",
                              ")"
                            ] }),
                            /* @__PURE__ */ n("option", { value: "", children: "None" }),
                            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((m) => /* @__PURE__ */ n("option", { value: m, children: m }, m))
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
                          onChange: (m) => p(f, {
                            ...s,
                            label: m.target.value
                          })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ n(
                    Lt,
                    {
                      items: s.steps,
                      getKey: S,
                      disabled: t,
                      className: "dq-sortable-list",
                      onReorder: (m) => p(f, { ...s, steps: m }),
                      renderItem: (m, { index: R, dragHandleProps: I, isOver: T }) => /* @__PURE__ */ n(
                        bn,
                        {
                          dragHandleProps: I,
                          saving: t,
                          isOver: T,
                          step: m,
                          index: R,
                          onChange: (d) => {
                            w.current.set(d, S(m)), p(f, {
                              ...s,
                              steps: s.steps.map(
                                (N, q) => q === R ? d : N
                              )
                            });
                          },
                          onRemove: () => p(f, {
                            ...s,
                            steps: s.steps.filter(
                              (d, N) => N !== R
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
                        onClick: () => p(f, {
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
                            (m, R) => R !== f
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
            ), f = document.createElement("a");
            f.href = s, f.download = "data-quality-review.json", f.click(), URL.revokeObjectURL(s);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: a, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: i, children: "Save review" })
    ] })
  ] });
}
function bn({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: i,
  isOver: a,
  onChange: c,
  onRemove: l
}) {
  return /* @__PURE__ */ u("div", { className: a ? "dq-action-step dq-drag-over" : "dq-action-step", children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        ...r,
        disabled: i,
        className: "dq-drag-handle",
        "aria-label": `Reorder step ${t + 1}`,
        children: /* @__PURE__ */ n(tr, {})
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
        onChange: (w) => c({ ...e, mode: w.target.value }),
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
        onChange: (w) => c({ ...e, tagIds: w }),
        placeholder: "Choose tags",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: l, children: /* @__PURE__ */ n(er, {}) })
  ] });
}
async function wn() {
  const e = await K("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const l = JSON.parse(r);
      Array.isArray(l.reviews) && (i = JSON.stringify(l.reviews, null, 2));
    } catch {
    }
  const a = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), c = document.createElement("a");
  c.href = a, c.download = "data-quality-browser-recovery.json", c.click(), URL.revokeObjectURL(a);
}
function Gt({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(Yt, { className: "dq-spin" }),
    e
  ] });
}
function Ht({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(ft, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const An = { components: { DataQualityPage: dn } };
export {
  dn as DataQualityPage,
  An as default,
  yt as objectFiltersEqual
};
