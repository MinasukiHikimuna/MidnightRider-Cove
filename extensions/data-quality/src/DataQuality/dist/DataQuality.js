import { jsxs as c, jsx as n, Fragment as de } from "react/jsx-runtime";
import { useState as v, useEffect as ee, useMemo as Ct, useRef as U, useCallback as ve } from "react";
import { VIDEO_SORT_OPTIONS as Et, FilterDialog as ar, VIDEO_CRITERIA as sr, EntityReferenceMultiSelector as it, DetailListPagination as lr, VideoPlayer as cr, getResolutionLabel as dr, formatDuration as ur, EntityDetailTabs as fr, SortableList as qt } from "@cove/runtime/components";
import { Pencil as jt, LayoutGrid as pr, List as hr, Grid3X3 as gr, ZoomOut as mr, ZoomIn as wr, Film as Rt, AlertTriangle as Ft, Loader2 as Jt, ChevronLeft as br, ChevronRight as yr, ExternalLink as vr, X as zt, Plus as Sr, Upload as Nr, Trash2 as _t, Check as Cr, Play as Er, GripVertical as Kt } from "@cove/runtime/lucide-react";
import { extensionFetch as qr } from "@cove/runtime/api";
function Ie(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function ot(e) {
  if (!e.name.trim() || !e.actions.every(ct))
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
function It(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function Ue(e) {
  const { page: t, ...r } = e.view.filter;
  return JSON.stringify([
    r,
    e.view.objectFilter,
    e.view.searchMode
  ]);
}
function ct(e) {
  return !!e.label.trim() && e.steps.every(
    (t) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(t.mode) && t.tagIds.length > 0 && t.tagIds.every((r) => Number.isSafeInteger(r) && r > 0)
  );
}
function Ae(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Rr(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && Array.isArray(i.steps) && i.steps.every((a) => a && Array.isArray(a.tagIds)) && ct(i)
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => ot(r)))
    throw new Error(
      "Saved reviews contain invalid actions or shortcuts. Existing data has been kept; assign shortcuts 1–9 only once or leave them empty."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Rr(e) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.cardSize === void 0 || t.cardSize === null || Number.isFinite(t.cardSize) && t.cardSize >= 115 && t.cardSize <= 380) && (t.annotations === void 0 || Array.isArray(t.annotations) && t.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [t.annotationParents, t.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function at(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const a of i)
      r.has(a.id) || (r.add(a.id), t.push(a));
  return t;
}
function At(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function Ir(e, t, r, i) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!i && t.includes(r)) return r;
  const a = Math.max(0, e.indexOf(r));
  if (i) {
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
function Ar(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((a) => r.has(a));
  for (const a of t)
    i ? r.delete(a) : r.add(a);
  return r;
}
function Or(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const Vt = "ext:com.midnightrider.data-quality:configuration", kr = "ext:cove-data-quality:video-reviews", st = "ext:com.midnightrider.data-quality:progress", Oe = /* @__PURE__ */ new Map(), je = /* @__PURE__ */ new Map(), tt = (e, t) => e.includes("*") || e.includes(t), Je = (e) => V(`/api/savedfilters?mode=${encodeURIComponent(e)}`), xr = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function lt(e) {
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
    reviews: Ae(JSON.stringify(t.reviews)),
    deletedIds: lt(t.deletedIds),
    importedIds: lt(t.importedIds)
  };
}
function Pr(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const a of t) {
    const d = localStorage.getItem(a);
    if (d !== null) {
      const l = Ae(d);
      r ?? (r = l), l.forEach((b) => i.add(b.id));
    }
    lt(
      JSON.parse(localStorage.getItem(`${a}:account-imports`) ?? "[]")
    ).forEach((l) => i.add(l));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function Qt(e) {
  const t = await V("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Bt(e, t) {
  const r = (je.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return je.set(e, r), r.finally(() => {
    je.get(e) === r && je.delete(e);
  }).catch(() => {
  }), r;
}
let Re = null;
function Tr() {
  if (Re) return Re;
  const e = Mr();
  return Re = e, e.finally(() => {
    Re === e && (Re = null);
  }).catch(() => {
  }), e;
}
async function Mr() {
  var g;
  const e = await V("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = tt(e.permissions, "savedfilters.read"), a = i && tt(e.permissions, "savedfilters.write"), d = i ? (await Je(Vt)).filter((N) => N.name === "Data Quality configuration").sort((N, R) => N.id - R.id) : [];
  if (d.length > 1) {
    const N = (R) => {
      const { revision: E, ...O } = Se(R.uiOptions);
      return JSON.stringify(O);
    };
    if (d.some((R) => N(R) !== N(d[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (a)
      for (const R of d.slice(1))
        await V(`/api/savedfilters/${R.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${R.id}` })
        });
    d.splice(1);
  }
  let l = d.length ? Se(d[0].uiOptions) : xr();
  const b = localStorage.getItem(`${r}:migrated`) === "true", S = localStorage.getItem(r), y = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && S && (l = Se(S));
  let s = !d.length;
  if (d.length && y && S) {
    const N = Se(S);
    if (N.reviews.some((E) => {
      const O = l.reviews.find(($) => $.id === E.id);
      return O && JSON.stringify(O) !== JSON.stringify(E);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const R = [
      .../* @__PURE__ */ new Set([...l.deletedIds, ...N.deletedIds])
    ];
    l = {
      ...l,
      reviews: at(l.reviews, N.reviews).filter(
        (E) => !R.includes(E.id)
      ),
      deletedIds: R,
      importedIds: [
        .../* @__PURE__ */ new Set([...l.importedIds, ...N.importedIds])
      ]
    }, s = !0;
  }
  if (!b) {
    const N = JSON.stringify(l), R = Pr(t);
    if (d.length && R.reviews.some((I) => {
      const h = l.reviews.find((q) => q.id === I.id);
      return h && JSON.stringify(h) !== JSON.stringify(I);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const E = i ? (await Je(kr)).flatMap(
      (I) => Ae(I.uiOptions ?? "[]")
    ) : [], O = R.known.filter(
      (I) => !R.reviews.some((h) => h.id === I)
    ), $ = /* @__PURE__ */ new Set([...l.deletedIds, ...O]);
    l = {
      ...l,
      reviews: at(
        R.reviews,
        l.reviews,
        E.filter(
          (I) => !R.known.includes(I.id) && !l.importedIds.includes(I.id)
        )
      ).filter((I) => !$.has(I.id)),
      deletedIds: [...$],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...l.importedIds,
          ...R.known,
          ...E.map((I) => I.id)
        ])
      ]
    }, s || (s = JSON.stringify(l) !== N);
  }
  const f = {
    userId: t,
    recordId: (g = d[0]) == null ? void 0 : g.id,
    config: l,
    readable: i,
    writable: a,
    durable: a
  };
  if (Oe.set(r, f), s && a) {
    const N = l;
    d.length && (f.config = Se(d[0].uiOptions)), await Gt(r, N), l = f.config;
  } else d.length || (localStorage.setItem(r, JSON.stringify(l)), !i && (!b || y) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (a)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: l.reviews,
    storageKey: r,
    canWrite: tt(e.permissions, "videos.write"),
    canConfigure: !i || a,
    storageNotice: i ? a ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Gt(e, t) {
  const r = Oe.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await Qt(r), r.recordId != null) {
      const d = await V(
        `/api/savedfilters/${r.recordId}`
      );
      if (Se(d.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const a = await V(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Vt,
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
function $r(e, t) {
  return Ae(JSON.stringify(t)), Bt(e, async () => {
    const r = Oe.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((a) => !t.some((d) => d.id === a.id)).map((a) => a.id);
    await Gt(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((a) => !t.some((d) => d.id === a))
    });
  });
}
function Ot(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Lr(e, t) {
  const r = Oe.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), a = i ? Ot(i) : null;
  if (!r.readable) return a;
  const d = (await Je(st)).find(
    (b) => b.name === t
  ), l = d ? Ot(d.uiOptions) : null;
  return a && (!l || a.updatedAt > l.updatedAt) ? a : l;
}
function Dr(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return Bt(i, async () => {
    const a = Oe.get(e);
    if (!(a != null && a.writable)) return;
    await Qt(a);
    const d = (await Je(st)).find(
      (l) => l.name === t
    );
    await V(
      d ? `/api/savedfilters/${d.id}` : "/api/savedfilters",
      {
        method: d ? "PUT" : "POST",
        body: JSON.stringify({
          mode: st,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Ur = {
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
function ze(e) {
  return Array.isArray(e) ? e.map(ze) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? Ur[r] ?? r : ze(r)
    ])
  ) : e;
}
async function V(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await qr(e, { ...t, headers: r });
  if (!i.ok) {
    let d = i.statusText || `Request failed (${i.status}).`;
    try {
      const l = await i.json();
      d = l.message || l.detail || d;
    } catch {
    }
    throw new Error(d);
  }
  if (i.status === 204 || i.status === 205) return;
  const a = await i.text();
  return a ? JSON.parse(a) : void 0;
}
async function kt(e, t, r) {
  const i = { ...e.view.objectFilter }, a = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return V("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      ze({
        findFilter: me(t),
        objectFilter: i,
        filterExpression: a
      })
    )
  });
}
function Ht(e) {
  return `/api/videos/${e.id}/image?max=640&v=${encodeURIComponent(e.updatedAt)}`;
}
function jr(e) {
  return `/api/stream/video/${e}`;
}
function xt(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Fr(e) {
  return `/api/stream/video/${e}/preview`;
}
function Jr(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function zr(e) {
  return e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Wt(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await V(`/api/tags/${r}`), t.add(r);
    for (let i = 1; ; i++) {
      const a = await V("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          ze({
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
      for (const d of a.items) t.add(d.id);
      if (i * 1e3 >= a.totalCount) break;
      if (!a.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...t];
}
async function _r(e, t) {
  if (!ct(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  const r = await Promise.all(
    e.steps.map(async (i) => ({
      mode: i.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: i.mode === "REMOVE_TREE" ? await Wt(i.tagIds) : i.tagIds
    }))
  );
  for (let i = 0; i < r.length; i++)
    try {
      await V("/api/videos/bulk", {
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
function Kr(e) {
  var l, b;
  const [t, r] = v({}), [i, a] = v(""), d = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotationParents) ?? [],
      ...((b = e == null ? void 0 : e.presentation) == null ? void 0 : b.binParents) ?? []
    ])
  ]);
  return ee(() => {
    let S = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(d).map(
        async (y) => [y, await Wt([y])]
      )
    ).then((y) => {
      S && r(Object.fromEntries(y));
    }).catch(() => {
      S && a(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      S = !1;
    };
  }, [d]), { ids: t, error: i };
}
function Vr(e, t, r) {
  const i = t == null ? void 0 : t.presentation, a = (i == null ? void 0 : i.annotations) ?? ["date", "studio", "performers"], d = (i == null ? void 0 : i.annotationParents) ?? [];
  return [
    a.includes("date") && e.date,
    a.includes("studio") && e.studioName,
    a.includes("performers") && e.performers.map((l) => l.name).join(", "),
    a.includes("tags") && (e.tags ?? []).filter(
      (l) => !d.length || d.some(
        (b) => {
          var S;
          return b !== l.id && ((S = r[b]) == null ? void 0 : S.includes(l.id));
        }
      )
    ).map((l) => l.name).join(", ")
  ].filter(Boolean).join(" · ");
}
function Qr({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: a
}) {
  var b, S, y;
  const d = new Set(
    (((b = t.presentation) == null ? void 0 : b.binParents) ?? []).flatMap(
      (s) => (r[s] ?? []).filter((f) => f !== s)
    )
  ), l = /* @__PURE__ */ new Map();
  for (const s of e)
    for (const f of s.tags ?? [])
      if (d.has(f.id)) {
        const g = l.get(f.id) ?? { name: f.name, count: 0 };
        g.count++, l.set(f.id, g);
      }
  return (y = (S = t.presentation) == null ? void 0 : S.binParents) != null && y.length ? /* @__PURE__ */ c("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...l].sort((s, f) => s[1].name.localeCompare(f[1].name)).map(([s, f]) => /* @__PURE__ */ c(
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
function Br(e, t) {
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
function Pt({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [a, d] = v(!1), l = e.view.filter, b = (s) => t({
    ...e,
    view: { ...e.view, filter: { ...l, ...s } }
  }), S = e.presentation ?? {}, y = (s) => t({ ...e, presentation: { ...S, ...s } });
  return /* @__PURE__ */ c(de, { children: [
    i && /* @__PURE__ */ c("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ c("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(l.q ?? ""),
            onChange: (s) => b({ q: s.target.value })
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
              onChange: (s) => b({ sort: s.target.value, sorts: void 0 }),
              children: [
                !Et.some((s) => s.value === l.sort) && l.sort != null && /* @__PURE__ */ n("option", { value: String(l.sort), children: String(l.sort) }),
                Et.map((s) => /* @__PURE__ */ n("option", { value: s.value, children: s.label }, s.value))
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
              onChange: (s) => b({ direction: s.target.value }),
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
              onChange: (s) => b({
                perPage: Math.max(
                  1,
                  Math.min(100, Number(s.target.value) || 40)
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
      a && /* @__PURE__ */ n("div", { onKeyDown: (s) => s.stopPropagation(), children: /* @__PURE__ */ n(
        ar,
        {
          open: !0,
          onClose: () => d(!1),
          criteria: sr,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: !0,
          subjectLabel: "videos",
          onApply: (s) => {
            t({ ...e, view: { ...e.view, objectFilter: s } }), d(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ c(de, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Choose how videos and tags appear while reviewing." }),
      /* @__PURE__ */ c("div", { className: "dq-field-grid", children: [
        /* @__PURE__ */ c("label", { children: [
          "Preferred view",
          /* @__PURE__ */ n(
            "select",
            {
              value: e.view.displayMode === "tagger" ? "grid" : e.view.displayMode,
              onChange: (s) => t({
                ...e,
                view: {
                  ...e.view,
                  displayMode: s.target.value
                }
              }),
              children: ["grid", "list", "wall"].map((s) => /* @__PURE__ */ n("option", { children: s }, s))
            }
          )
        ] }),
        /* @__PURE__ */ c("label", { children: [
          "Preferred card width",
          /* @__PURE__ */ n(
            "select",
            {
              value: S.cardSize ?? 180,
              onChange: (s) => y({
                cardSize: Number(s.target.value)
              }),
              children: [130, 180, 260, 380].map((s) => /* @__PURE__ */ c("option", { value: s, children: [
                s,
                " px"
              ] }, s))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n("h4", { children: "Card annotations" }),
      /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((s) => {
        const f = S.annotations ?? [
          "date",
          "studio",
          "performers"
        ];
        return /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: f.includes(s),
              onChange: (g) => y({
                annotations: g.target.checked ? [...f, s] : f.filter((N) => N !== s)
              })
            }
          ),
          s
        ] }, s);
      }) }),
      /* @__PURE__ */ n("p", { children: "Show annotated tags only below these parents (empty means all tags)." }),
      /* @__PURE__ */ n(
        it,
        {
          entityType: "tag",
          values: S.annotationParents ?? [],
          onChange: (s) => y({ annotationParents: s }),
          allowCreate: !1
        }
      ),
      /* @__PURE__ */ n("h4", { children: "Tag bins" }),
      /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
      /* @__PURE__ */ n(
        it,
        {
          entityType: "tag",
          values: S.binParents ?? [],
          onChange: (s) => y({ binParents: s }),
          allowCreate: !1
        }
      )
    ] })
  ] });
}
const Fe = 180, rt = 115, Tt = 380;
function Mt(e) {
  return e.view.displayMode === "wall" || e.view.displayMode === "list" ? e.view.displayMode : "grid";
}
function Gr() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function $t(e) {
  const t = new URLSearchParams(window.location.search);
  e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function Hr(e) {
  return me({ ...e, page: 1 });
}
function Wr(e, t) {
  if (t === 0) return "Showing 0 of 0";
  const r = Number(e.perPage) || 40, i = Math.max(1, Math.ceil(t / r)), a = Math.min(Math.max(1, Number(e.page) || 1), i), d = (a - 1) * r + 1, l = Math.min(a * r, t);
  return `Showing ${d.toLocaleString()}-${l.toLocaleString()} of ${t.toLocaleString()}`;
}
function Xt(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function X(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
function Xr({
  onNavigate: e
}) {
  const [t, r] = v([]), [i] = v(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [a, d] = v(""), [l, b] = v(!0), [S, y] = v(""), [s, f] = v(!1), [g, N] = v(!0), [R, E] = v(""), [O, $] = v(""), [I, h] = v(!1), [q, k] = v(!1), [p, T] = v(Gr), [F, L] = v(!1), [oe, ne] = v(!1), [ae, dt] = v(!1), [Q, Ne] = v(
    null
  ), z = t.find((o) => o.id === p) ?? null, m = Ct(
    () => (Q == null ? void 0 : Q.id) === p && z ? { ...z, view: Q.view } : z,
    [Q, p, z]
  ), ke = Kr(m), [M, Ce] = v({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Yt, Zt] = v({
    page: 1,
    perPage: 40
  }), [Y, ut] = v({ items: [], totalCount: 0 }), [x, xe] = v(!1), [ie, ft] = v(""), [se, ue] = v(() => /* @__PURE__ */ new Set()), _e = U(se);
  _e.current = se;
  const we = U(/* @__PURE__ */ new Map()), [B, te] = v(null), G = U(B);
  G.current = B;
  const [re, be] = v(!1), le = U(re);
  le.current = re;
  const pt = U(null), [fe, Ke] = v("grid"), [pe, Ve] = v(Fe), [j, Qe] = v(!1), Pe = U(!1), [er, Be] = v(""), [ht, Te] = v(""), [Ge, Ee] = v(""), He = U(/* @__PURE__ */ new Map()), gt = U(null), ye = U(0), Me = U(0), $e = U(null), mt = ve(async () => {
    b(!0), y("");
    try {
      const o = await Tr();
      r(o.reviews), d(o.storageKey), f(o.canWrite), N(o.canConfigure ?? !0), E(o.storageNotice ?? ""), p && !o.reviews.some((u) => u.id === p) && (T(""), $t(""));
    } catch (o) {
      y(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      b(!1);
    }
  }, [p]);
  ee(() => {
    mt();
  }, []);
  const he = ve(
    async (o, u) => {
      var D;
      const w = ++ye.current;
      (D = $e.current) == null || D.abort();
      const C = new AbortController();
      $e.current = C, u = me(u), Ce(u), xe(!0), ft("");
      try {
        let A = await kt(
          o,
          u,
          C.signal
        );
        const H = Math.max(
          1,
          Math.ceil(A.totalCount / Number(u.perPage))
        );
        return Number(u.page) > H && (u = { ...u, page: H }, A = await kt(
          o,
          u,
          C.signal
        )), w === ye.current && (ut(A), Ce(u), Zt(u)), A;
      } catch (A) {
        throw w === ye.current && ft(
          A instanceof Error ? A.message : "Could not load the review queue."
        ), A;
      } finally {
        w === ye.current && xe(!1);
      }
    },
    []
  );
  ee(() => {
    var u;
    if (Me.current += 1, ye.current += 1, (u = $e.current) == null || u.abort(), k(!1), $(""), h(!1), ue(/* @__PURE__ */ new Set()), we.current.clear(), te(null), be(!1), Qe(!1), Pe.current = !1, Be(""), Te(""), Ee(""), ut({ items: [], totalCount: 0 }), !m) {
      xe(!1);
      return;
    }
    let o = !0;
    return xe(!0), (async () => {
      var A;
      let w = null;
      try {
        w = await Lr(a, m.id);
      } catch (H) {
        o && (h(!0), $(
          H instanceof Error ? H.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const C = (w == null ? void 0 : w.signature) === Ue(m) ? w : null, D = C ? me(C.filter) : Hr(m.view.filter);
      Ce(D), Ke((C == null ? void 0 : C.displayMode) ?? Mt(m)), Ve(
        C ? C.cardSize ?? Fe : ((A = m.presentation) == null ? void 0 : A.cardSize) ?? Fe
      );
      try {
        const H = await he(m, D);
        if (!o) return;
        const _ = It(
          H.items.map((ge) => ge.id),
          (C == null ? void 0 : C.focusedId) ?? null,
          (C == null ? void 0 : C.index) ?? 0
        );
        te(_), J(_);
      } catch {
      }
      o && k(!0);
    })(), () => {
      var w;
      o = !1, Me.current++, ye.current++, (w = $e.current) == null || w.abort();
    };
  }, [m == null ? void 0 : m.id]);
  const P = Ct(
    () => Y.items.map((o) => o.id),
    [Y.items]
  );
  ee(() => {
    if (!q || !m || !a || x || ie || j || (Q == null ? void 0 : Q.id) === m.id || I)
      return;
    const o = {
      version: 1,
      signature: Ue(m),
      filter: M,
      focusedId: B,
      index: Math.max(0, P.indexOf(B ?? -1)),
      displayMode: fe,
      cardSize: pe,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        a + ":progress:" + m.id,
        JSON.stringify(o)
      );
    } catch {
    }
    if (O) return;
    let u = !0;
    const w = window.setTimeout(() => {
      Dr(a, m.id, o).catch((C) => {
        u && $(
          "Progress is kept in this browser, but account sync failed. " + (C instanceof Error ? C.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      u = !1, window.clearTimeout(w);
    };
  }, [
    q,
    a,
    m,
    x,
    ie,
    j,
    M,
    B,
    P,
    fe,
    pe,
    Q,
    O,
    I
  ]);
  const We = Y.items.find((o) => o.id === B) ?? null;
  re && We && (pt.current = We);
  const ce = We ?? (re ? pt.current : null), tr = At(se, B), wt = se.size > 0 ? `${se.size} selected video${se.size === 1 ? "" : "s"}` : B == null ? "no video" : "focused video", J = ve((o, u = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const w = He.current.get(o);
      w == null || w.focus({ preventScroll: !0 }), u && (w == null || w.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  ee(() => {
    q && !le.current && J(G.current);
  }, [q, J]), ee(() => {
    x || !P.length || (G.current == null || !P.includes(G.current)) && (te(P[0]), le.current || J(P[0]));
  }, [J, P, x]);
  const qe = ve(
    (o) => {
      ue((u) => {
        const w = o(u);
        for (const C of /* @__PURE__ */ new Set([...u, ...w]))
          u.has(C) !== w.has(C) && we.current.set(
            C,
            (we.current.get(C) ?? 0) + 1
          );
        return w;
      });
    },
    []
  ), Xe = ve(
    (o) => {
      if (!P.length) return;
      const u = Math.max(
        0,
        P.indexOf(G.current ?? P[0])
      ), w = P[Math.max(0, Math.min(P.length - 1, u + o))];
      te(w), le.current || J(w);
    },
    [J, P]
  ), Ye = ve(
    async (o) => {
      const u = At(
        _e.current,
        G.current
      );
      if (!m || Pe.current || x || ie || !s || !u.length)
        return;
      const w = ++Me.current, C = m.id, D = [...P], A = G.current, H = new Map(
        u.map((K) => [K, we.current.get(K) ?? 0])
      ), _ = () => w === Me.current && m.id === C;
      Pe.current = !0, Qe(!0), Be(
        _e.current.size ? `${u.length} selected videos` : "the focused video"
      ), Te(""), Ee("");
      let ge = !1;
      try {
        if (await _r(o, u), ge = !0, !_()) return;
        ue((K) => {
          const W = new Set(K);
          for (const Z of u)
            (we.current.get(Z) ?? 0) === H.get(Z) && W.delete(Z);
          return W;
        }), Te(
          `${o.label}: ${u.length} video${u.length === 1 ? "" : "s"} ${o.steps.length ? "updated" : "skipped"}.`
        );
      } catch (K) {
        if (!_()) return;
        Ee(
          K instanceof Error ? K.message : "Action failed."
        );
      }
      try {
        if (await zr(o), !_()) return;
        const K = await he(m, M);
        if (!_()) return;
        let W = K.items.map((Z) => Z.id);
        if (!W.length && K.totalCount > 0 && Number(M.page) > 1) {
          const Z = Math.max(1, Number(M.page) - 1), De = { ...M, page: Z };
          Ce(De), W = (await he(m, De)).items.map((et) => et.id), ue(
            (et) => new Set([...et].filter((or) => W.includes(or)))
          );
          const Nt = W.at(-1) ?? null;
          te(Nt), le.current || J(Nt);
        } else {
          ue(
            (De) => new Set([...De].filter((St) => W.includes(St)))
          );
          const Z = Ir(
            D,
            W,
            A,
            ge && u.includes(A ?? -1)
          );
          te(Z), le.current && Z == null && be(!1), le.current || J(Z);
        }
      } catch (K) {
        _() && Ee(
          (W) => `${W ? `${W} ` : ""}${ge ? "The action completed, but " : ""}the queue could not be refreshed. ${K instanceof Error ? K.message : "Refresh failed."}`
        );
      } finally {
        _() && (Pe.current = !1, Qe(!1), Be(""));
      }
    },
    [
      s,
      he,
      M,
      J,
      P,
      x,
      ie,
      m
    ]
  );
  function rr() {
    var w;
    const o = (w = gt.current) == null ? void 0 : w.firstElementChild, u = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, u.split(" ").filter(Boolean).length);
  }
  function nr(o) {
    if (o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || F || ae) return;
    if (re && o.key === "Escape") {
      X(o), be(!1), J(G.current);
      return;
    }
    if (!Or(o.target)) return;
    if (o.key === "Escape") {
      X(o), qe(() => /* @__PURE__ */ new Set());
      return;
    }
    const u = (m == null ? void 0 : m.actions.findIndex(
      (D, A) => Ie(D, A) === o.key
    )) ?? -1;
    if (u >= 0 && (m != null && m.actions[u])) {
      X(o), !j && !x && Ye(m.actions[u]);
      return;
    }
    if (!re && o.key === " ") {
      X(o), B != null && qe((D) => nt(D, B));
      return;
    }
    if (!re && o.key.toLowerCase() === "a") {
      X(o), qe(
        (D) => Ar(D, P)
      );
      return;
    }
    if (j || x || re) return;
    if (o.key === "Enter" && B != null) {
      X(o), be(!0);
      return;
    }
    const w = rr(), C = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -w : o.key === "ArrowDown" ? w : 0;
    C && (X(o), Xe(C));
  }
  function Ze(o) {
    T(o), $t(o);
  }
  async function bt(o) {
    var w, C, D;
    if (!a) return !1;
    try {
      await $r(a, o);
    } catch (A) {
      throw A;
    }
    r(o), p && !o.some((A) => A.id === p) && Ze("");
    const u = o.find((A) => A.id === p);
    return u && z && JSON.stringify(u) !== JSON.stringify(z) && (u.view.displayMode !== z.view.displayMode && Ke(Mt(u)), ((w = u.presentation) == null ? void 0 : w.cardSize) !== ((C = z.presentation) == null ? void 0 : C.cardSize) && Ve(((D = u.presentation) == null ? void 0 : D.cardSize) ?? Fe), Ue(u) !== Ue(z) && (Ne(null), Le(
      u,
      me({ ...u.view.filter, page: M.page })
    ))), !0;
  }
  if (l)
    return /* @__PURE__ */ n(Dt, { label: "Loading Data Quality reviews…" });
  if (S)
    return /* @__PURE__ */ c(de, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void on().catch(
            (o) => y(
              "Could not export browser reviews. " + (o instanceof Error ? o.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        Ut,
        {
          message: S,
          onRetry: () => void mt()
        }
      )
    ] });
  return /* @__PURE__ */ c("div", { className: "data-quality-page", onKeyDown: nr, children: [
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
          disabled: j || x || !g,
          onClick: () => {
            ne(!1), L(!0);
          },
          children: [
            /* @__PURE__ */ n(jt, {}),
            " Manage reviews"
          ]
        }
      )
    ] }),
    R && /* @__PURE__ */ n("p", { className: "dq-status", children: R }),
    i && /* @__PURE__ */ c("details", { children: [
      /* @__PURE__ */ n("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ n("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const o = localStorage.getItem("page-videos") ?? "[]", u = URL.createObjectURL(
              new Blob([o], { type: "application/json" })
            ), w = document.createElement("a");
            w.href = u, w.download = "data-quality-unassigned-legacy-reviews.json", w.click(), URL.revokeObjectURL(u);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    O && /* @__PURE__ */ c("p", { role: "alert", children: [
      O,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            $(""), h(!1);
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
            value: (m == null ? void 0 : m.id) ?? "",
            disabled: j,
            onChange: (o) => Ze(o.target.value),
            children: [
              /* @__PURE__ */ n("option", { value: "", children: "Choose a review…" }),
              t.map((o) => /* @__PURE__ */ n("option", { value: o.id, children: o.name }, o.id))
            ]
          }
        )
      ] }),
      m && /* @__PURE__ */ n("span", { className: "dq-range-count", children: Wr(Yt, Y.totalCount) }),
      m && /* @__PURE__ */ c(de, { children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: j || x || !g,
            onClick: () => {
              ne(!0), L(!0);
            },
            children: "Edit review"
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: j || x,
            onClick: () => dt(!0),
            children: "Adjust queue"
          }
        ),
        (Q == null ? void 0 : Q.id) === p && /* @__PURE__ */ c(de, { children: [
          /* @__PURE__ */ n("span", { children: "Temporary queue" }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: j || x || !g,
              onClick: () => {
                z && bt(
                  t.map(
                    (o) => o.id === p ? {
                      ...o,
                      view: {
                        ...m.view,
                        filter: { ...M, page: 1 }
                      }
                    } : o
                  )
                ).then(() => {
                  Ne(null), Te("Queue saved to this review.");
                }).catch(
                  (o) => Ee(
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
              disabled: j || x,
              onClick: () => {
                Ne(null), z && Le(
                  z,
                  me({
                    ...z.view.filter,
                    page: M.page
                  })
                );
              },
              children: "Reset to saved queue"
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-review-description", children: m.description && /* @__PURE__ */ n("p", { children: m.description }) }),
        /* @__PURE__ */ n(
          "div",
          {
            className: "dq-view-switch flex min-h-10 items-center gap-0.5 rounded-lg border border-border bg-card/70 px-1.5 py-1 shadow-sm sm:min-h-0",
            role: "group",
            "aria-label": "Review view",
            children: [
              { mode: "grid", label: "Grid", Icon: pr },
              { mode: "list", label: "List", Icon: hr },
              { mode: "wall", label: "Wall", Icon: gr }
            ].map(({ mode: o, label: u, Icon: w }) => /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: `inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-transparent p-2 text-secondary hover:bg-card/80 hover:text-foreground focus:border-accent focus:outline-none sm:min-h-0 sm:min-w-0 sm:p-1.5 ${fe === o ? "bg-background/60 text-accent shadow-sm" : ""}`,
                "aria-label": u,
                title: u,
                "aria-pressed": fe === o,
                onClick: () => Ke(o),
                children: /* @__PURE__ */ n(w, { className: "h-3.5 w-3.5" })
              },
              o
            ))
          }
        ),
        fe !== "list" && /* @__PURE__ */ c("div", { className: "hidden items-center gap-1 pl-1 md:flex", children: [
          /* @__PURE__ */ n(mr, { className: "h-3 w-3 text-muted" }),
          /* @__PURE__ */ n(
            "input",
            {
              "aria-label": `Card size: ${pe}px`,
              title: `Card size: ${pe}px`,
              type: "range",
              min: rt,
              max: Tt,
              step: "5",
              className: "themed-range-input h-1 w-16 cursor-pointer sm:w-20",
              value: pe,
              style: {
                "--range-fill": `${(pe - rt) / (Tt - rt) * 100}%`
              },
              onChange: (o) => Ve(Number(o.target.value))
            }
          ),
          /* @__PURE__ */ n(wr, { className: "h-3 w-3 text-muted" })
        ] })
      ] })
    ] }),
    m ? /* @__PURE__ */ c(de, { children: [
      ke.error && /* @__PURE__ */ n("p", { role: "alert", children: ke.error }),
      /* @__PURE__ */ n(
        Qr,
        {
          videos: Y.items,
          review: m,
          trees: ke.ids,
          disabled: j || x,
          onChoose: (o) => {
            const u = Br(m, o);
            Ne(u), Le(u, { ...M, page: 1 });
          }
        }
      ),
      Ge && !re && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(Ft, {}),
        Ge
      ] }),
      ht && /* @__PURE__ */ n("p", { role: "status", className: "dq-status", children: ht }),
      /* @__PURE__ */ c("div", { className: "dq-workspace", children: [
        /* @__PURE__ */ c("main", { children: [
          yt("top"),
          x && !Y.items.length && /* @__PURE__ */ n(Dt, { label: "Loading review queue…" }),
          ie && !x && /* @__PURE__ */ n(
            Ut,
            {
              message: ie,
              onRetry: () => void he(m, M).catch(() => {
              })
            }
          ),
          !x && !ie && !Y.items.length && /* @__PURE__ */ c("div", { className: "dq-empty", children: [
            /* @__PURE__ */ n(Rt, {}),
            /* @__PURE__ */ n("p", { children: "No videos match this review." })
          ] }),
          !!Y.items.length && /* @__PURE__ */ n("div", { ref: gt, children: fe === "list" ? /* @__PURE__ */ n("div", { className: "dq-list", "data-review-layout": "list", children: Y.items.map(vt) }) : /* @__PURE__ */ n(
            "div",
            {
              className: "dq-grid",
              style: {
                "--dq-card-width": `${pe}px`
              },
              children: Y.items.map(vt)
            }
          ) }),
          yt("bottom")
        ] }),
        /* @__PURE__ */ c("aside", { className: "dq-actions", children: [
          /* @__PURE__ */ n("strong", { children: wt }),
          m.actions.map((o, u) => /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              disabled: j || x || !!ie || !s || !tr.length,
              onClick: () => void Ye(o),
              children: [
                Ie(o, u) && /* @__PURE__ */ n("kbd", { children: Ie(o, u) }),
                /* @__PURE__ */ n("span", { children: o.label }),
                /* @__PURE__ */ n("small", { children: o.steps.length ? `${o.steps.length} step(s)` : "Skip" })
              ]
            },
            o.id
          )),
          !m.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
          !s && /* @__PURE__ */ n("p", { children: "Video write permission is required to apply actions." }),
          j && /* @__PURE__ */ c("p", { role: "status", children: [
            /* @__PURE__ */ n(Jt, { className: "dq-spin" }),
            " Applying action to",
            " ",
            er,
            "…"
          ] }),
          /* @__PURE__ */ n("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ c("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(Rt, {}),
      /* @__PURE__ */ n("p", { children: t.length ? "Choose a saved review to open its queue." : "No saved reviews are available in this browser." })
    ] }),
    re && ce && m && /* @__PURE__ */ n(
      tn,
      {
        video: ce,
        review: m,
        targetLabel: wt,
        pending: j,
        refreshing: x || !!ie,
        error: Ge,
        canWrite: s,
        selected: se.has(ce.id),
        hasPrevious: P.indexOf(ce.id) > 0,
        hasNext: P.indexOf(ce.id) >= 0 && P.indexOf(ce.id) < P.length - 1,
        onToggleSelected: () => qe((o) => nt(o, ce.id)),
        onPrevious: () => Xe(-1),
        onNext: () => Xe(1),
        onClose: () => {
          be(!1), J(G.current);
        },
        onAction: Ye,
        onOpen: () => e({ page: "video", id: ce.id })
      }
    ),
    ae && m && /* @__PURE__ */ n(
      Lt,
      {
        reviews: t,
        activeReview: { ...m, view: { ...m.view, filter: M } },
        initialEdit: !0,
        temporary: !0,
        onSave: (o) => {
          const u = o.find((w) => w.id === p);
          return Ne(u), Le(
            u,
            me({ ...u.view.filter, page: M.page })
          ), !0;
        },
        onChoose: () => {
        },
        onClose: () => {
          dt(!1), J(G.current, !1);
        }
      }
    ),
    F && /* @__PURE__ */ n(
      Lt,
      {
        reviews: t,
        activeReview: z,
        initialEdit: oe,
        onSave: bt,
        onChoose: Ze,
        onClose: () => {
          L(!1), oe && J(G.current, !1);
        }
      }
    )
  ] });
  async function Le(o, u) {
    const w = G.current, C = Math.max(0, P.indexOf(w ?? -1));
    try {
      const A = (await he(o, u)).items.map((_) => _.id);
      ue(
        (_) => new Set([..._].filter((ge) => A.includes(ge)))
      );
      const H = It(A, w, C);
      te(H), le.current || J(H, !1);
    } catch {
    }
  }
  function ir() {
    ue(/* @__PURE__ */ new Set()), we.current.clear(), te(null);
  }
  function yt(o) {
    return m ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: j || x,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          lr,
          {
            filter: {
              ...M,
              page: Number(M.page) || 1,
              perPage: Number(M.perPage) || 40
            },
            totalCount: Y.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${o}`,
            onFilterChange: (u) => {
              j || x || u.page === Number(M.page) || Yr(
                { ...M, page: u.page },
                m,
                Ce,
                he,
                ir
              );
            }
          }
        )
      }
    ) : null;
  }
  function vt(o) {
    return /* @__PURE__ */ n(
      Zr,
      {
        video: o,
        annotation: Vr(o, m, ke.ids),
        displayMode: fe,
        focused: o.id === B,
        selected: se.has(o.id),
        setRef: (u) => {
          u ? He.current.set(o.id, u) : He.current.delete(o.id);
        },
        onFocus: () => te(o.id),
        onToggle: () => qe((u) => nt(u, o.id)),
        onPreview: () => {
          te(o.id), be(!0);
        }
      },
      o.id
    );
  }
}
function Yr(e, t, r, i, a) {
  r(e), a(), i(t, e).catch(() => {
  });
}
function nt(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Zr({
  video: e,
  annotation: t,
  displayMode: r,
  focused: i,
  selected: a,
  setRef: d,
  onFocus: l,
  onToggle: b,
  onPreview: S
}) {
  const y = e.files[0], s = Xt(e), f = /* @__PURE__ */ c(de, { children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        "aria-label": a ? `Deselect ${s}` : `Select ${s}`,
        onClick: (g) => {
          g.stopPropagation(), b();
        },
        className: `dq-select ${a ? "selected" : ""}`,
        children: a && /* @__PURE__ */ n(Cr, {})
      }
    ),
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        "aria-label": `Preview ${s}`,
        onClick: (g) => {
          g.stopPropagation(), S();
        },
        className: "dq-preview-button",
        children: /* @__PURE__ */ n(Er, {})
      }
    ),
    /* @__PURE__ */ c("div", { className: "dq-badges", children: [
      y && /* @__PURE__ */ n("span", { children: dr(y.width, y.height) }),
      y != null && y.duration ? /* @__PURE__ */ n("span", { children: ur(y.duration) }) : null
    ] })
  ] });
  return /* @__PURE__ */ c(
    "article",
    {
      ref: d,
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${s}${a ? ", selected" : ""}`,
      onFocus: l,
      onClick: (g) => {
        l(), g.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-card ${r} ${i ? "focused" : ""} ${a ? "selected" : ""}`,
      children: [
        r === "wall" ? /* @__PURE__ */ c(en, { video: e, children: [
          f,
          /* @__PURE__ */ n("p", { className: "dq-wall-title", children: s })
        ] }) : /* @__PURE__ */ c("div", { className: "dq-poster", children: [
          /* @__PURE__ */ n("img", { src: Ht(e), alt: "" }),
          f
        ] }),
        (r !== "wall" || t) && /* @__PURE__ */ c("div", { className: "dq-card-copy", children: [
          /* @__PURE__ */ n("strong", { children: s }),
          /* @__PURE__ */ c("small", { children: [
            t,
            " "
          ] })
        ] })
      ]
    }
  );
}
function en({
  video: e,
  children: t
}) {
  const r = U(null), i = U(null), [a, d] = v(!1), [l, b] = v(!1), [S, y] = v(!1);
  return ee(() => {
    const s = r.current;
    if (!s || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      d(!0), b(!0);
      return;
    }
    const f = new IntersectionObserver(
      ([N]) => d(N.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), g = new IntersectionObserver(
      ([N]) => b(N.isIntersecting && N.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return f.observe(s), g.observe(s), () => {
      f.disconnect(), g.disconnect();
    };
  }, [e.id, e.files.length]), ee(() => {
    if (!a) {
      y(!1);
      return;
    }
    const s = new AbortController();
    return V(Jr(e.id), {
      signal: s.signal
    }).then((f) => {
      s.signal.aborted || y(f.available === !0);
    }).catch(() => {
      s.signal.aborted || y(!1);
    }), () => s.abort();
  }, [a, e.id]), ee(() => {
    const s = i.current;
    s && (l ? Promise.resolve(s.play()).catch(() => {
    }) : s.pause());
  }, [S, l]), /* @__PURE__ */ c("div", { ref: r, className: "dq-wall-media", children: [
    /* @__PURE__ */ n("img", { src: Ht(e), alt: "" }),
    S && /* @__PURE__ */ n(
      "video",
      {
        ref: i,
        src: Fr(e.id),
        muted: !0,
        loop: !0,
        playsInline: !0,
        preload: "metadata"
      }
    ),
    t
  ] });
}
function tn({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: a,
  error: d,
  canWrite: l,
  selected: b,
  hasPrevious: S,
  hasNext: y,
  onToggleSelected: s,
  onPrevious: f,
  onNext: g,
  onClose: N,
  onAction: R,
  onOpen: E
}) {
  const O = U(null), $ = U(null), I = e.files[0], h = Xt(e);
  ee(() => {
    var T;
    const p = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (T = O.current) == null || T.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = p;
    };
  }, []);
  function q(p) {
    var L, oe, ne;
    if (p.key !== "Tab") return;
    const T = [
      ...((L = O.current) == null ? void 0 : L.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ae) => ae.offsetParent !== null);
    if (!T.length) {
      p.preventDefault(), (oe = O.current) == null || oe.focus();
      return;
    }
    const F = T.indexOf(
      document.activeElement
    );
    p.shiftKey && F <= 0 ? (p.preventDefault(), (ne = T.at(-1)) == null || ne.focus()) : !p.shiftKey && F === T.length - 1 && (p.preventDefault(), T[0].focus());
  }
  function k(p) {
    if (p.defaultPrevented || p.ctrlKey || p.metaKey || p.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const T = p.key === "ArrowLeft" || p.key === "ArrowRight";
    if (p.altKey && !T) return;
    const F = $.current, L = p.currentTarget.querySelector("video");
    if (p.key === "Enter" || p.key === "Escape")
      p.repeat || N();
    else if (p.key === " " && F)
      p.repeat || F.toggle();
    else if (T && F)
      F.seekBy(
        (p.key === "ArrowLeft" ? -1 : 1) * (p.shiftKey ? 5 : p.altKey ? 10 : 60)
      );
    else if ((p.key === "," || p.key === ".") && F) {
      const oe = [I == null ? void 0 : I.duration, L == null ? void 0 : L.duration].find(
        (ae) => ae != null && Number.isFinite(ae) && ae > 0
      ) ?? 0, ne = e.parentVideoId != null ? (e.clipEndSec ?? oe) - (e.clipStartSec ?? 0) : oe;
      Number.isFinite(ne) && ne > 0 && F.seekBy((p.key === "," ? -1 : 1) * ne * 0.1);
    } else if (p.key.toLowerCase() === "n" || p.key.toLowerCase() === "m")
      !p.repeat && !i && !a && (p.key.toLowerCase() === "n" && S && f(), p.key.toLowerCase() === "m" && y && g());
    else if (p.key === "ArrowUp" && L)
      L.volume = Math.min(1, L.volume + 0.1);
    else if (p.key === "ArrowDown" && L)
      L.volume = Math.max(0, L.volume - 0.1);
    else return;
    X(p);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: O,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${h}`,
      className: "dq-preview",
      onKeyDown: q,
      onKeyDownCapture: k,
      onMouseDown: (p) => {
        p.target === p.currentTarget && N();
      },
      children: /* @__PURE__ */ c("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ c("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !S || i || a,
              onClick: f,
              children: /* @__PURE__ */ n(br, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !y || i || a,
              onClick: g,
              children: /* @__PURE__ */ n(yr, {})
            }
          ),
          /* @__PURE__ */ c("div", { children: [
            /* @__PURE__ */ n("h2", { children: h }),
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
              onClick: s,
              disabled: a,
              children: b ? "Selected" : "Select"
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: E,
              "aria-label": "Open video details",
              children: /* @__PURE__ */ n(vr, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: N,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(zt, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: I ? /* @__PURE__ */ n(
          cr,
          {
            autostart: !0,
            streamUrl: jr(e.id),
            posterUrl: xt(e),
            format: I.format,
            audioCodec: I.audioCodec,
            duration: I.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (p) => ($.current = p, () => {
              $.current === p && ($.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: xt(e), alt: "" }) }),
        d && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: d }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((p, T) => /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            disabled: i || a || !l,
            onClick: () => void R(p),
            children: [
              Ie(p, T) && /* @__PURE__ */ n("kbd", { children: Ie(p, T) }),
              p.label
            ]
          },
          p.id
        )) })
      ] })
    }
  );
}
function Lt({
  reviews: e,
  activeReview: t,
  initialEdit: r = !1,
  temporary: i = !1,
  onSave: a,
  onChoose: d,
  onClose: l
}) {
  const [b, S] = v(
    () => r && t ? structuredClone(t) : null
  ), [y, s] = v(""), [f, g] = v(!1), N = U(null);
  ee(() => {
    var k, p;
    const h = document.activeElement, q = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (p = (k = N.current) == null ? void 0 : k.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || p.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = q, h == null || h.focus({ preventScroll: !0 });
    };
  }, []);
  function R(h) {
    var p, T, F;
    if (h.defaultPrevented) {
      h.stopPropagation();
      return;
    }
    if (h.key === "Escape") {
      X(h), f || l();
      return;
    }
    if (h.key !== "Tab") {
      h.stopPropagation();
      return;
    }
    const q = [
      ...((p = N.current) == null ? void 0 : p.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((L) => L.offsetParent !== null);
    if (!q.length) {
      X(h), (T = N.current) == null || T.focus();
      return;
    }
    const k = q.indexOf(
      document.activeElement
    );
    h.shiftKey && k <= 0 ? (X(h), (F = q.at(-1)) == null || F.focus()) : !h.shiftKey && k === q.length - 1 ? (X(h), q[0].focus()) : h.stopPropagation();
  }
  function E(h) {
    S(
      h ? structuredClone(h) : {
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
  async function O() {
    if (f) return;
    if (!b || ot(b)) {
      s(b ? ot(b) : "Choose a review.");
      return;
    }
    const h = { ...b, name: b.name.trim() }, q = e.some((k) => k.id === h.id) ? e.map((k) => k.id === h.id ? h : k) : [...e, h];
    g(!0), s("");
    try {
      if (!await a(q)) throw new Error("Could not save reviews.");
      d(h.id), l();
    } catch (k) {
      s(
        "Could not save reviews. Your edits are still open. " + (k instanceof Error ? k.message : "Retry saving.")
      );
    } finally {
      g(!1);
    }
  }
  async function $(h) {
    if (!f) {
      g(!0), s("");
      try {
        if (!await a(h)) throw new Error("Could not save reviews.");
      } catch (q) {
        s(
          q instanceof Error ? q.message : "Could not save reviews."
        );
      } finally {
        g(!1);
      }
    }
  }
  async function I(h) {
    var k;
    if (f) return;
    const q = (k = h.target.files) == null ? void 0 : k[0];
    if (h.target.value = "", !!q) {
      if (q.size > 2e6) {
        s("Review files must be smaller than 2 MB.");
        return;
      }
      g(!0), s("");
      try {
        const p = Ae(await q.text());
        if (!await a(at(e, p)))
          throw new Error("Could not save reviews.");
      } catch (p) {
        s(
          p instanceof Error ? p.message : "Could not import reviews."
        );
      } finally {
        g(!1);
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
      onKeyDown: R,
      children: /* @__PURE__ */ c("div", { className: "dq-manager", children: [
        /* @__PURE__ */ c("header", { children: [
          /* @__PURE__ */ c("div", { children: [
            /* @__PURE__ */ n("h2", { children: i ? "Adjust queue temporarily" : b ? e.some((h) => h.id === b.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: i ? "Apply changes for this session. Saved review settings stay available through Reset to saved queue." : "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: f,
              onClick: l,
              children: /* @__PURE__ */ n(zt, {})
            }
          )
        ] }),
        y && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: y }),
        /* @__PURE__ */ n("fieldset", { disabled: f, className: "dq-manager-content", children: b ? /* @__PURE__ */ n(
          rn,
          {
            draft: b,
            temporary: i,
            saving: f,
            setDraft: S,
            onSave: () => void O(),
            onCancel: l
          }
        ) : /* @__PURE__ */ c(de, { children: [
          /* @__PURE__ */ c("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ c(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => E(),
                children: [
                  /* @__PURE__ */ n(Sr, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ c("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(Nr, {}),
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
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((h) => /* @__PURE__ */ c("article", { children: [
            /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ n("strong", { children: h.name }),
              /* @__PURE__ */ n("p", { children: h.description || "No description" })
            ] }),
            /* @__PURE__ */ c("button", { type: "button", onClick: () => E(h), children: [
              /* @__PURE__ */ n(jt, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => E({
                  ...structuredClone(h),
                  id: crypto.randomUUID(),
                  name: `${h.name} copy`
                }),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${h.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${h.name}”?`) && $(
                    e.filter((q) => q.id !== h.id)
                  );
                },
                children: /* @__PURE__ */ n(_t, {})
              }
            )
          ] }, h.id)) })
        ] }) })
      ] })
    }
  );
}
function rn({
  draft: e,
  temporary: t = !1,
  saving: r = !1,
  setDraft: i,
  onSave: a,
  onCancel: d
}) {
  const [l, b] = v("Review"), S = U(/* @__PURE__ */ new WeakMap()), y = (f) => {
    let g = S.current.get(f);
    return g || (g = crypto.randomUUID(), S.current.set(f, g)), g;
  }, s = (f, g) => i({
    ...e,
    actions: e.actions.map(
      (N, R) => R === f ? g : N
    )
  });
  return /* @__PURE__ */ c("div", { className: "dq-editor", children: [
    !t && /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      fr,
      {
        tabs: ["Review", "Queue", "Appearance", "Actions"].map((f) => ({
          key: f,
          label: f,
          count: f === "Actions" ? e.actions.length : void 0,
          disabled: r
        })),
        activeTab: l,
        onTabChange: b
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
              onChange: (f) => i({ ...e, name: f.target.value })
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
              onChange: (f) => i({ ...e, description: f.target.value })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n(
        "section",
        {
          hidden: !t && l !== "Queue",
          className: "dq-editor-section",
          children: /* @__PURE__ */ n(Pt, { draft: e, onChange: i, presentation: !1 })
        }
      ),
      !t && /* @__PURE__ */ n(
        "section",
        {
          hidden: l !== "Appearance",
          className: "dq-editor-section",
          children: /* @__PURE__ */ n(Pt, { draft: e, onChange: i, queue: !1 })
        }
      ),
      !t && /* @__PURE__ */ c("section", { hidden: l !== "Actions", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Actions" }),
        /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
        /* @__PURE__ */ n(
          qt,
          {
            items: e.actions,
            getKey: (f) => f.id,
            disabled: r,
            className: "dq-sortable-list",
            onReorder: (f) => i({ ...e, actions: f }),
            renderItem: (f, { index: g, dragHandleProps: N, isOver: R }) => /* @__PURE__ */ c(
              "fieldset",
              {
                className: R ? "dq-action-card dq-drag-over" : "dq-action-card",
                children: [
                  /* @__PURE__ */ c("legend", { children: [
                    "Action ",
                    g + 1
                  ] }),
                  /* @__PURE__ */ c("div", { className: "dq-action-heading", children: [
                    /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        ...N,
                        disabled: r,
                        className: "dq-drag-handle",
                        "aria-label": `Reorder action ${g + 1}`,
                        children: /* @__PURE__ */ n(Kt, {})
                      }
                    ),
                    /* @__PURE__ */ n("strong", { children: f.label || "New action" }),
                    /* @__PURE__ */ n("div", { className: "dq-row", children: /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        onClick: () => i({
                          ...e,
                          actions: [
                            ...e.actions.slice(0, g + 1),
                            {
                              ...structuredClone(f),
                              id: crypto.randomUUID(),
                              label: f.label + " copy",
                              shortcut: ""
                            },
                            ...e.actions.slice(g + 1)
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
                          value: f.shortcut ?? "auto",
                          onChange: (E) => s(g, {
                            ...f,
                            shortcut: E.target.value === "auto" ? void 0 : E.target.value
                          }),
                          children: [
                            /* @__PURE__ */ c("option", { value: "auto", children: [
                              "Position (",
                              g < 9 ? g + 1 : "none",
                              ")"
                            ] }),
                            /* @__PURE__ */ n("option", { value: "", children: "None" }),
                            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((E) => /* @__PURE__ */ n("option", { value: E, children: E }, E))
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ c("label", { children: [
                      "Button label",
                      /* @__PURE__ */ n(
                        "input",
                        {
                          value: f.label,
                          onChange: (E) => s(g, {
                            ...f,
                            label: E.target.value
                          })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ n(
                    qt,
                    {
                      items: f.steps,
                      getKey: y,
                      disabled: r,
                      className: "dq-sortable-list",
                      onReorder: (E) => s(g, { ...f, steps: E }),
                      renderItem: (E, { index: O, dragHandleProps: $, isOver: I }) => /* @__PURE__ */ n(
                        nn,
                        {
                          dragHandleProps: $,
                          saving: r,
                          isOver: I,
                          step: E,
                          index: O,
                          onChange: (h) => {
                            S.current.set(h, y(E)), s(g, {
                              ...f,
                              steps: f.steps.map(
                                (q, k) => k === O ? h : q
                              )
                            });
                          },
                          onRemove: () => s(g, {
                            ...f,
                            steps: f.steps.filter(
                              (h, q) => q !== O
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
                        onClick: () => s(g, {
                          ...f,
                          steps: [...f.steps, { mode: "ADD", tagIds: [] }]
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
                            (E, O) => O !== g
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
            const f = URL.createObjectURL(
              new Blob([JSON.stringify([e], null, 2)], {
                type: "application/json"
              })
            ), g = document.createElement("a");
            g.href = f, g.download = "data-quality-review.json", g.click(), URL.revokeObjectURL(f);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: d, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: a, children: t ? "Apply temporary queue" : "Save review" })
    ] })
  ] });
}
function nn({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: i,
  isOver: a,
  onChange: d,
  onRemove: l
}) {
  return /* @__PURE__ */ c("div", { className: a ? "dq-action-step dq-drag-over" : "dq-action-step", children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        ...r,
        disabled: i,
        className: "dq-drag-handle",
        "aria-label": `Reorder step ${t + 1}`,
        children: /* @__PURE__ */ n(Kt, {})
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
        onChange: (b) => d({ ...e, mode: b.target.value }),
        children: [
          /* @__PURE__ */ n("option", { value: "ADD", children: "Add tags" }),
          /* @__PURE__ */ n("option", { value: "REMOVE", children: "Remove tags" }),
          /* @__PURE__ */ n("option", { value: "REMOVE_TREE", children: "Remove tags and descendants" })
        ]
      }
    ),
    /* @__PURE__ */ n(
      it,
      {
        entityType: "tag",
        values: e.tagIds,
        onChange: (b) => d({ ...e, tagIds: b }),
        placeholder: "Choose tags",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: l, children: /* @__PURE__ */ n(_t, {}) })
  ] });
}
async function on() {
  const e = await V("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const l = JSON.parse(r);
      Array.isArray(l.reviews) && (i = JSON.stringify(l.reviews, null, 2));
    } catch {
    }
  const a = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), d = document.createElement("a");
  d.href = a, d.download = "data-quality-browser-recovery.json", d.click(), URL.revokeObjectURL(a);
}
function Dt({ label: e }) {
  return /* @__PURE__ */ c("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(Jt, { className: "dq-spin" }),
    e
  ] });
}
function Ut({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ c("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(Ft, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const un = { components: { DataQualityPage: Xr } };
export {
  Xr as DataQualityPage,
  un as default
};
