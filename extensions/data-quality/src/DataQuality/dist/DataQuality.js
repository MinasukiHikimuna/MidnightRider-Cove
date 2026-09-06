import { jsxs as l, jsx as n, Fragment as oe } from "react/jsx-runtime";
import { useState as v, useEffect as ee, useMemo as St, useRef as U, useCallback as ve } from "react";
import { VIDEO_SORT_OPTIONS as Nt, FilterDialog as tr, VIDEO_CRITERIA as rr, EntityReferenceMultiSelector as rt, DetailListPagination as nr, VideoPlayer as ir, getResolutionLabel as or, formatDuration as ar, EntityDetailTabs as sr, SortableList as Ct } from "@cove/runtime/components";
import { Pencil as Dt, Film as Et, AlertTriangle as Lt, Loader2 as Ut, ChevronLeft as lr, ChevronRight as cr, ExternalLink as dr, X as jt, Plus as ur, Upload as fr, Trash2 as Ft, Check as pr, Play as hr, GripVertical as Jt } from "@cove/runtime/lucide-react";
import { extensionFetch as gr } from "@cove/runtime/api";
function Ae(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function nt(e) {
  if (!e.name.trim() || !e.actions.every(st))
    return "Name the review and complete every action step before saving.";
  if (new Set(e.actions.map((r) => r.id)).size !== e.actions.length)
    return "Action IDs must be unique within a review.";
  const t = e.actions.map(
    (r, i) => r.shortcut ?? (i < 9 ? String(i + 1) : "")
  ).filter(Boolean);
  return t.some((r) => !/^[1-9]$/.test(r)) || new Set(t).size !== t.length ? "Assign each shortcut 1–9 only once, or choose None. Navigation and player keys are reserved." : "";
}
function ge(e) {
  const t = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(100, t(e.perPage, 40)))
  };
}
function qt(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function je(e) {
  const { page: t, ...r } = e.view.filter;
  return JSON.stringify([
    r,
    e.view.objectFilter,
    e.view.searchMode
  ]);
}
function st(e) {
  return !!e.label.trim() && e.steps.every(
    (t) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(t.mode) && t.tagIds.length > 0 && t.tagIds.every((r) => Number.isSafeInteger(r) && r > 0)
  );
}
function Ie(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && mr(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && Array.isArray(i.steps) && i.steps.every((a) => a && Array.isArray(a.tagIds)) && st(i)
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => nt(r)))
    throw new Error(
      "Saved reviews contain invalid actions or shortcuts. Existing data has been kept; assign shortcuts 1–9 only once or leave them empty."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function mr(e) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.cardSize === void 0 || t.cardSize === null || Number.isFinite(t.cardSize) && t.cardSize >= 115 && t.cardSize <= 380) && (t.annotations === void 0 || Array.isArray(t.annotations) && t.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [t.annotationParents, t.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function it(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const a of i)
      r.has(a.id) || (r.add(a.id), t.push(a));
  return t;
}
function Rt(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function wr(e, t, r, i) {
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
function br(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((a) => r.has(a));
  for (const a of t)
    i ? r.delete(a) : r.add(a);
  return r;
}
function yr(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const _t = "ext:com.midnightrider.data-quality:configuration", vr = "ext:cove-data-quality:video-reviews", ot = "ext:com.midnightrider.data-quality:progress", Oe = /* @__PURE__ */ new Map(), Fe = /* @__PURE__ */ new Map(), et = (e, t) => e.includes("*") || e.includes(t), Je = (e) => V(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Sr = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function at(e) {
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
    deletedIds: at(t.deletedIds),
    importedIds: at(t.importedIds)
  };
}
function Nr(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const a of t) {
    const d = localStorage.getItem(a);
    if (d !== null) {
      const c = Ie(d);
      r ?? (r = c), c.forEach((b) => i.add(b.id));
    }
    at(
      JSON.parse(localStorage.getItem(`${a}:account-imports`) ?? "[]")
    ).forEach((c) => i.add(c));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function zt(e) {
  const t = await V("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Kt(e, t) {
  const r = (Fe.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Fe.set(e, r), r.finally(() => {
    Fe.get(e) === r && Fe.delete(e);
  }).catch(() => {
  }), r;
}
let Re = null;
function Cr() {
  if (Re) return Re;
  const e = Er();
  return Re = e, e.finally(() => {
    Re === e && (Re = null);
  }).catch(() => {
  }), e;
}
async function Er() {
  var g;
  const e = await V("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = et(e.permissions, "savedfilters.read"), a = i && et(e.permissions, "savedfilters.write"), d = i ? (await Je(_t)).filter((N) => N.name === "Data Quality configuration").sort((N, A) => N.id - A.id) : [];
  if (d.length > 1) {
    const N = (A) => {
      const { revision: E, ...O } = Se(A.uiOptions);
      return JSON.stringify(O);
    };
    if (d.some((A) => N(A) !== N(d[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (a)
      for (const A of d.slice(1))
        await V(`/api/savedfilters/${A.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${A.id}` })
        });
    d.splice(1);
  }
  let c = d.length ? Se(d[0].uiOptions) : Sr();
  const b = localStorage.getItem(`${r}:migrated`) === "true", S = localStorage.getItem(r), y = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && S && (c = Se(S));
  let s = !d.length;
  if (d.length && y && S) {
    const N = Se(S);
    if (N.reviews.some((E) => {
      const O = c.reviews.find(($) => $.id === E.id);
      return O && JSON.stringify(O) !== JSON.stringify(E);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const A = [
      .../* @__PURE__ */ new Set([...c.deletedIds, ...N.deletedIds])
    ];
    c = {
      ...c,
      reviews: it(c.reviews, N.reviews).filter(
        (E) => !A.includes(E.id)
      ),
      deletedIds: A,
      importedIds: [
        .../* @__PURE__ */ new Set([...c.importedIds, ...N.importedIds])
      ]
    }, s = !0;
  }
  if (!b) {
    const N = JSON.stringify(c), A = Nr(t);
    if (d.length && A.reviews.some((R) => {
      const h = c.reviews.find((q) => q.id === R.id);
      return h && JSON.stringify(h) !== JSON.stringify(R);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const E = i ? (await Je(vr)).flatMap(
      (R) => Ie(R.uiOptions ?? "[]")
    ) : [], O = A.known.filter(
      (R) => !A.reviews.some((h) => h.id === R)
    ), $ = /* @__PURE__ */ new Set([...c.deletedIds, ...O]);
    c = {
      ...c,
      reviews: it(
        A.reviews,
        c.reviews,
        E.filter(
          (R) => !A.known.includes(R.id) && !c.importedIds.includes(R.id)
        )
      ).filter((R) => !$.has(R.id)),
      deletedIds: [...$],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...c.importedIds,
          ...A.known,
          ...E.map((R) => R.id)
        ])
      ]
    }, s || (s = JSON.stringify(c) !== N);
  }
  const u = {
    userId: t,
    recordId: (g = d[0]) == null ? void 0 : g.id,
    config: c,
    readable: i,
    writable: a,
    durable: a
  };
  if (Oe.set(r, u), s && a) {
    const N = c;
    d.length && (u.config = Se(d[0].uiOptions)), await Vt(r, N), c = u.config;
  } else d.length || (localStorage.setItem(r, JSON.stringify(c)), !i && (!b || y) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (a)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: c.reviews,
    storageKey: r,
    canWrite: et(e.permissions, "videos.write"),
    canConfigure: !i || a,
    storageNotice: i ? a ? "Reviews and progress are saved to your account." : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Vt(e, t) {
  const r = Oe.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await zt(r), r.recordId != null) {
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
          mode: _t,
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
function qr(e, t) {
  return Ie(JSON.stringify(t)), Kt(e, async () => {
    const r = Oe.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((a) => !t.some((d) => d.id === a.id)).map((a) => a.id);
    await Vt(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((a) => !t.some((d) => d.id === a))
    });
  });
}
function At(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Rr(e, t) {
  const r = Oe.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), a = i ? At(i) : null;
  if (!r.readable) return a;
  const d = (await Je(ot)).find(
    (b) => b.name === t
  ), c = d ? At(d.uiOptions) : null;
  return a && (!c || a.updatedAt > c.updatedAt) ? a : c;
}
function Ar(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return Kt(i, async () => {
    const a = Oe.get(e);
    if (!(a != null && a.writable)) return;
    await zt(a);
    const d = (await Je(ot)).find(
      (c) => c.name === t
    );
    await V(
      d ? `/api/savedfilters/${d.id}` : "/api/savedfilters",
      {
        method: d ? "PUT" : "POST",
        body: JSON.stringify({
          mode: ot,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Ir = {
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
function _e(e) {
  return Array.isArray(e) ? e.map(_e) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? Ir[r] ?? r : _e(r)
    ])
  ) : e;
}
async function V(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await gr(e, { ...t, headers: r });
  if (!i.ok) {
    let d = i.statusText || `Request failed (${i.status}).`;
    try {
      const c = await i.json();
      d = c.message || c.detail || d;
    } catch {
    }
    throw new Error(d);
  }
  if (i.status === 204 || i.status === 205) return;
  const a = await i.text();
  return a ? JSON.parse(a) : void 0;
}
async function It(e, t, r) {
  const i = { ...e.view.objectFilter }, a = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return V("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      _e({
        findFilter: ge(t),
        objectFilter: i,
        filterExpression: a
      })
    )
  });
}
function Qt(e) {
  return `/api/videos/${e.id}/image?max=640&v=${encodeURIComponent(e.updatedAt)}`;
}
function Or(e) {
  return `/api/stream/video/${e}`;
}
function Ot(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function kr(e) {
  return `/api/stream/video/${e}/preview`;
}
function xr(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Pr(e) {
  return e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Bt(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await V(`/api/tags/${r}`), t.add(r);
    for (let i = 1; ; i++) {
      const a = await V("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          _e({
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
async function Tr(e, t) {
  if (!st(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  const r = await Promise.all(
    e.steps.map(async (i) => ({
      mode: i.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: i.mode === "REMOVE_TREE" ? await Bt(i.tagIds) : i.tagIds
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
function Mr(e) {
  var c, b;
  const [t, r] = v({}), [i, a] = v(""), d = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...((c = e == null ? void 0 : e.presentation) == null ? void 0 : c.annotationParents) ?? [],
      ...((b = e == null ? void 0 : e.presentation) == null ? void 0 : b.binParents) ?? []
    ])
  ]);
  return ee(() => {
    let S = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(d).map(
        async (y) => [y, await Bt([y])]
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
function $r(e, t, r) {
  const i = t == null ? void 0 : t.presentation, a = (i == null ? void 0 : i.annotations) ?? ["date", "studio", "performers"], d = (i == null ? void 0 : i.annotationParents) ?? [];
  return [
    a.includes("date") && e.date,
    a.includes("studio") && e.studioName,
    a.includes("performers") && e.performers.map((c) => c.name).join(", "),
    a.includes("tags") && (e.tags ?? []).filter(
      (c) => !d.length || d.some(
        (b) => {
          var S;
          return b !== c.id && ((S = r[b]) == null ? void 0 : S.includes(c.id));
        }
      )
    ).map((c) => c.name).join(", ")
  ].filter(Boolean).join(" · ");
}
function Dr({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: a
}) {
  var b, S, y;
  const d = new Set(
    (((b = t.presentation) == null ? void 0 : b.binParents) ?? []).flatMap(
      (s) => (r[s] ?? []).filter((u) => u !== s)
    )
  ), c = /* @__PURE__ */ new Map();
  for (const s of e)
    for (const u of s.tags ?? [])
      if (d.has(u.id)) {
        const g = c.get(u.id) ?? { name: u.name, count: 0 };
        g.count++, c.set(u.id, g);
      }
  return (y = (S = t.presentation) == null ? void 0 : S.binParents) != null && y.length ? /* @__PURE__ */ l("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...c].sort((s, u) => s[1].name.localeCompare(u[1].name)).map(([s, u]) => /* @__PURE__ */ l(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => a(s),
        children: [
          u.name,
          " (",
          u.count,
          ")"
        ]
      },
      s
    )),
    !c.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function Lr(e, t) {
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
function kt({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [a, d] = v(!1), c = e.view.filter, b = (s) => t({
    ...e,
    view: { ...e.view, filter: { ...c, ...s } }
  }), S = e.presentation ?? {}, y = (s) => t({ ...e, presentation: { ...S, ...s } });
  return /* @__PURE__ */ l(oe, { children: [
    i && /* @__PURE__ */ l("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ l("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(c.q ?? ""),
            onChange: (s) => b({ q: s.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ l("div", { className: "dq-field-grid", children: [
        /* @__PURE__ */ l("label", { children: [
          "Sort",
          /* @__PURE__ */ l(
            "select",
            {
              "aria-label": "Sort",
              value: String(c.sort ?? "date"),
              onChange: (s) => b({ sort: s.target.value, sorts: void 0 }),
              children: [
                !Nt.some((s) => s.value === c.sort) && c.sort != null && /* @__PURE__ */ n("option", { value: String(c.sort), children: String(c.sort) }),
                Nt.map((s) => /* @__PURE__ */ n("option", { value: s.value, children: s.label }, s.value))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ l("label", { children: [
          "Direction",
          /* @__PURE__ */ l(
            "select",
            {
              "aria-label": "Direction",
              value: String(c.direction ?? "desc"),
              onChange: (s) => b({ direction: s.target.value }),
              children: [
                /* @__PURE__ */ n("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ n("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ l("label", { children: [
          "Videos per page",
          /* @__PURE__ */ n(
            "input",
            {
              type: "number",
              min: "1",
              max: "100",
              value: Number(c.perPage) || 40,
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
      /* @__PURE__ */ l("p", { children: [
        Object.keys(e.view.objectFilter).length ? "Video filters configured" : "No video filters",
        ". Choose which videos enter the queue."
      ] }),
      a && /* @__PURE__ */ n("div", { onKeyDown: (s) => s.stopPropagation(), children: /* @__PURE__ */ n(
        tr,
        {
          open: !0,
          onClose: () => d(!1),
          criteria: rr,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: !0,
          subjectLabel: "videos",
          onApply: (s) => {
            t({ ...e, view: { ...e.view, objectFilter: s } }), d(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ l(oe, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Choose how videos and tags appear while reviewing." }),
      /* @__PURE__ */ l("div", { className: "dq-field-grid", children: [
        /* @__PURE__ */ l("label", { children: [
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
        /* @__PURE__ */ l("label", { children: [
          "Preferred card width",
          /* @__PURE__ */ l(
            "select",
            {
              value: S.cardSize ?? "auto",
              onChange: (s) => y({
                cardSize: s.target.value === "auto" ? null : Number(s.target.value)
              }),
              children: [
                /* @__PURE__ */ n("option", { value: "auto", children: "Auto fit" }),
                [130, 180, 260, 380].map((s) => /* @__PURE__ */ l("option", { value: s, children: [
                  s,
                  " px"
                ] }, s))
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ n("h4", { children: "Card annotations" }),
      /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((s) => {
        const u = S.annotations ?? [
          "date",
          "studio",
          "performers"
        ];
        return /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: u.includes(s),
              onChange: (g) => y({
                annotations: g.target.checked ? [...u, s] : u.filter((N) => N !== s)
              })
            }
          ),
          s
        ] }, s);
      }) }),
      /* @__PURE__ */ n("p", { children: "Show annotated tags only below these parents (empty means all tags)." }),
      /* @__PURE__ */ n(
        rt,
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
        rt,
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
function xt(e) {
  return e.view.displayMode === "wall" || e.view.displayMode === "list" ? e.view.displayMode : "grid";
}
function Ur() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Pt(e) {
  const t = new URLSearchParams(window.location.search);
  e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function jr(e) {
  return ge({ ...e, page: 1 });
}
function Ht(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function X(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
function Fr({
  onNavigate: e
}) {
  const [t, r] = v([]), [i] = v(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [a, d] = v(""), [c, b] = v(!0), [S, y] = v(""), [s, u] = v(!1), [g, N] = v(!0), [A, E] = v(""), [O, $] = v(""), [R, h] = v(!1), [q, k] = v(!1), [p, T] = v(Ur), [F, D] = v(!1), [ae, ne] = v(!1), [se, lt] = v(!1), [Q, Ne] = v(
    null
  ), _ = t.find((o) => o.id === p) ?? null, m = St(
    () => (Q == null ? void 0 : Q.id) === p && _ ? { ..._, view: Q.view } : _,
    [Q, p, _]
  ), ke = Mr(m), [M, Ce] = v({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Y, ct] = v({ items: [], totalCount: 0 }), [x, xe] = v(!1), [ie, dt] = v(""), [le, fe] = v(() => /* @__PURE__ */ new Set()), ze = U(le);
  ze.current = le;
  const me = U(/* @__PURE__ */ new Map()), [B, te] = v(null), H = U(B);
  H.current = B;
  const [re, we] = v(!1), ce = U(re);
  ce.current = re;
  const ut = U(null), [de, Ke] = v("grid"), [be, Pe] = v(null), [j, Ve] = v(!1), Te = U(!1), [Gt, Qe] = v(""), [ft, Me] = v(""), [Be, Ee] = v(""), He = U(/* @__PURE__ */ new Map()), pt = U(null), ye = U(0), $e = U(0), De = U(null), ht = ve(async () => {
    b(!0), y("");
    try {
      const o = await Cr();
      r(o.reviews), d(o.storageKey), u(o.canWrite), N(o.canConfigure ?? !0), E(o.storageNotice ?? ""), p && !o.reviews.some((f) => f.id === p) && (T(""), Pt(""));
    } catch (o) {
      y(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      b(!1);
    }
  }, [p]);
  ee(() => {
    ht();
  }, []);
  const pe = ve(
    async (o, f) => {
      var L;
      const w = ++ye.current;
      (L = De.current) == null || L.abort();
      const C = new AbortController();
      De.current = C, f = ge(f), Ce(f), xe(!0), dt("");
      try {
        let I = await It(
          o,
          f,
          C.signal
        );
        const G = Math.max(
          1,
          Math.ceil(I.totalCount / Number(f.perPage))
        );
        return Number(f.page) > G && (f = { ...f, page: G }, I = await It(
          o,
          f,
          C.signal
        )), w === ye.current && (ct(I), Ce(f)), I;
      } catch (I) {
        throw w === ye.current && dt(
          I instanceof Error ? I.message : "Could not load the review queue."
        ), I;
      } finally {
        w === ye.current && xe(!1);
      }
    },
    []
  );
  ee(() => {
    var f;
    if ($e.current += 1, ye.current += 1, (f = De.current) == null || f.abort(), k(!1), $(""), h(!1), fe(/* @__PURE__ */ new Set()), me.current.clear(), te(null), we(!1), Ve(!1), Te.current = !1, Qe(""), Me(""), Ee(""), ct({ items: [], totalCount: 0 }), !m) {
      xe(!1);
      return;
    }
    let o = !0;
    return xe(!0), (async () => {
      var I;
      let w = null;
      try {
        w = await Rr(a, m.id);
      } catch (G) {
        o && (h(!0), $(
          G instanceof Error ? G.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const C = (w == null ? void 0 : w.signature) === je(m) ? w : null, L = C ? ge(C.filter) : jr(m.view.filter);
      Ce(L), Ke((C == null ? void 0 : C.displayMode) ?? xt(m)), Pe(
        C ? C.cardSize : ((I = m.presentation) == null ? void 0 : I.cardSize) ?? null
      );
      try {
        const G = await pe(m, L);
        if (!o) return;
        const z = qt(
          G.items.map((he) => he.id),
          (C == null ? void 0 : C.focusedId) ?? null,
          (C == null ? void 0 : C.index) ?? 0
        );
        te(z), J(z);
      } catch {
      }
      o && k(!0);
    })(), () => {
      var w;
      o = !1, $e.current++, ye.current++, (w = De.current) == null || w.abort();
    };
  }, [m == null ? void 0 : m.id]);
  const P = St(
    () => Y.items.map((o) => o.id),
    [Y.items]
  );
  ee(() => {
    if (!q || !m || !a || x || ie || j || (Q == null ? void 0 : Q.id) === m.id || R)
      return;
    const o = {
      version: 1,
      signature: je(m),
      filter: M,
      focusedId: B,
      index: Math.max(0, P.indexOf(B ?? -1)),
      displayMode: de,
      cardSize: be,
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
    let f = !0;
    const w = window.setTimeout(() => {
      Ar(a, m.id, o).catch((C) => {
        f && $(
          "Progress is kept in this browser, but account sync failed. " + (C instanceof Error ? C.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      f = !1, window.clearTimeout(w);
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
    de,
    be,
    Q,
    O,
    R
  ]);
  const Ge = Y.items.find((o) => o.id === B) ?? null;
  re && Ge && (ut.current = Ge);
  const ue = Ge ?? (re ? ut.current : null), Wt = Rt(le, B), gt = le.size > 0 ? `${le.size} selected video${le.size === 1 ? "" : "s"}` : B == null ? "no video" : "focused video", J = ve((o, f = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const w = He.current.get(o);
      w == null || w.focus({ preventScroll: !0 }), f && (w == null || w.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  ee(() => {
    q && !ce.current && J(H.current);
  }, [q, J]), ee(() => {
    x || !P.length || (H.current == null || !P.includes(H.current)) && (te(P[0]), ce.current || J(P[0]));
  }, [J, P, x]);
  const qe = ve(
    (o) => {
      fe((f) => {
        const w = o(f);
        for (const C of /* @__PURE__ */ new Set([...f, ...w]))
          f.has(C) !== w.has(C) && me.current.set(
            C,
            (me.current.get(C) ?? 0) + 1
          );
        return w;
      });
    },
    []
  ), We = ve(
    (o) => {
      if (!P.length) return;
      const f = Math.max(
        0,
        P.indexOf(H.current ?? P[0])
      ), w = P[Math.max(0, Math.min(P.length - 1, f + o))];
      te(w), ce.current || J(w);
    },
    [J, P]
  ), Xe = ve(
    async (o) => {
      const f = Rt(
        ze.current,
        H.current
      );
      if (!m || Te.current || x || ie || !s || !f.length)
        return;
      const w = ++$e.current, C = m.id, L = [...P], I = H.current, G = new Map(
        f.map((K) => [K, me.current.get(K) ?? 0])
      ), z = () => w === $e.current && m.id === C;
      Te.current = !0, Ve(!0), Qe(
        ze.current.size ? `${f.length} selected videos` : "the focused video"
      ), Me(""), Ee("");
      let he = !1;
      try {
        if (await Tr(o, f), he = !0, !z()) return;
        fe((K) => {
          const W = new Set(K);
          for (const Z of f)
            (me.current.get(Z) ?? 0) === G.get(Z) && W.delete(Z);
          return W;
        }), Me(
          `${o.label}: ${f.length} video${f.length === 1 ? "" : "s"} ${o.steps.length ? "updated" : "skipped"}.`
        );
      } catch (K) {
        if (!z()) return;
        Ee(
          K instanceof Error ? K.message : "Action failed."
        );
      }
      try {
        if (await Pr(o), !z()) return;
        const K = await pe(m, M);
        if (!z()) return;
        let W = K.items.map((Z) => Z.id);
        if (!W.length && K.totalCount > 0 && Number(M.page) > 1) {
          const Z = Math.max(1, Number(M.page) - 1), Ue = { ...M, page: Z };
          Ce(Ue), W = (await pe(m, Ue)).items.map((Ze) => Ze.id), fe(
            (Ze) => new Set([...Ze].filter((er) => W.includes(er)))
          );
          const vt = W.at(-1) ?? null;
          te(vt), ce.current || J(vt);
        } else {
          fe(
            (Ue) => new Set([...Ue].filter((yt) => W.includes(yt)))
          );
          const Z = wr(
            L,
            W,
            I,
            he && f.includes(I ?? -1)
          );
          te(Z), ce.current && Z == null && we(!1), ce.current || J(Z);
        }
      } catch (K) {
        z() && Ee(
          (W) => `${W ? `${W} ` : ""}${he ? "The action completed, but " : ""}the queue could not be refreshed. ${K instanceof Error ? K.message : "Refresh failed."}`
        );
      } finally {
        z() && (Te.current = !1, Ve(!1), Qe(""));
      }
    },
    [
      s,
      pe,
      M,
      J,
      P,
      x,
      ie,
      m
    ]
  );
  function Xt() {
    var w;
    const o = (w = pt.current) == null ? void 0 : w.firstElementChild, f = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, f.split(" ").filter(Boolean).length);
  }
  function Yt(o) {
    if (o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || F || se) return;
    if (re && o.key === "Escape") {
      X(o), we(!1), J(H.current);
      return;
    }
    if (!yr(o.target)) return;
    if (o.key === "Escape") {
      X(o), qe(() => /* @__PURE__ */ new Set());
      return;
    }
    const f = (m == null ? void 0 : m.actions.findIndex(
      (L, I) => Ae(L, I) === o.key
    )) ?? -1;
    if (f >= 0 && (m != null && m.actions[f])) {
      X(o), !j && !x && Xe(m.actions[f]);
      return;
    }
    if (!re && o.key === " ") {
      X(o), B != null && qe((L) => tt(L, B));
      return;
    }
    if (!re && o.key.toLowerCase() === "a") {
      X(o), qe(
        (L) => br(L, P)
      );
      return;
    }
    if (j || x || re) return;
    if (o.key === "Enter" && B != null) {
      X(o), we(!0);
      return;
    }
    const w = Xt(), C = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -w : o.key === "ArrowDown" ? w : 0;
    C && (X(o), We(C));
  }
  function Ye(o) {
    T(o), Pt(o);
  }
  async function mt(o) {
    var w, C, L;
    if (!a) return !1;
    try {
      await qr(a, o);
    } catch (I) {
      throw I;
    }
    r(o), p && !o.some((I) => I.id === p) && Ye("");
    const f = o.find((I) => I.id === p);
    return f && _ && JSON.stringify(f) !== JSON.stringify(_) && (f.view.displayMode !== _.view.displayMode && Ke(xt(f)), ((w = f.presentation) == null ? void 0 : w.cardSize) !== ((C = _.presentation) == null ? void 0 : C.cardSize) && Pe(((L = f.presentation) == null ? void 0 : L.cardSize) ?? null), je(f) !== je(_) && (Ne(null), Le(
      f,
      ge({ ...f.view.filter, page: M.page })
    ))), !0;
  }
  if (c)
    return /* @__PURE__ */ n(Mt, { label: "Loading Data Quality reviews…" });
  if (S)
    return /* @__PURE__ */ l(oe, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Br().catch(
            (o) => y(
              "Could not export browser reviews. " + (o instanceof Error ? o.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        $t,
        {
          message: S,
          onRetry: () => void ht()
        }
      )
    ] });
  return /* @__PURE__ */ l("div", { className: "data-quality-page", onKeyDown: Yt, children: [
    /* @__PURE__ */ l("header", { className: "data-quality-header", children: [
      /* @__PURE__ */ l("div", { children: [
        /* @__PURE__ */ n("h1", { children: "Data Quality" }),
        /* @__PURE__ */ n("p", { children: "A focused queue for previewing videos and applying saved review actions." })
      ] }),
      /* @__PURE__ */ l(
        "button",
        {
          className: "dq-button",
          type: "button",
          disabled: j || x || !g,
          onClick: () => {
            ne(!1), D(!0);
          },
          children: [
            /* @__PURE__ */ n(Dt, {}),
            " Manage reviews"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ n("p", { className: "dq-status", children: A }),
    i && /* @__PURE__ */ l("details", { children: [
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
            ), w = document.createElement("a");
            w.href = f, w.download = "data-quality-unassigned-legacy-reviews.json", w.click(), URL.revokeObjectURL(f);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    O && /* @__PURE__ */ l("p", { role: "alert", children: [
      O,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            $(""), h(!1);
          },
          children: R ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    /* @__PURE__ */ l("section", { className: "dq-toolbar", children: [
      /* @__PURE__ */ l("label", { className: "dq-review-select", children: [
        "Review",
        /* @__PURE__ */ l(
          "select",
          {
            value: (m == null ? void 0 : m.id) ?? "",
            disabled: j,
            onChange: (o) => Ye(o.target.value),
            children: [
              /* @__PURE__ */ n("option", { value: "", children: "Choose a review…" }),
              t.map((o) => /* @__PURE__ */ n("option", { value: o.id, children: o.name }, o.id))
            ]
          }
        )
      ] }),
      m && /* @__PURE__ */ l(oe, { children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: j || x || !g,
            onClick: () => {
              ne(!0), D(!0);
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
            onClick: () => lt(!0),
            children: "Adjust queue"
          }
        ),
        (Q == null ? void 0 : Q.id) === p && /* @__PURE__ */ l(oe, { children: [
          /* @__PURE__ */ n("span", { children: "Temporary queue" }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: j || x || !g,
              onClick: () => {
                _ && mt(
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
                  Ne(null), Me("Queue saved to this review.");
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
                Ne(null), _ && Le(
                  _,
                  ge({
                    ..._.view.filter,
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
            className: "dq-view-switch",
            role: "group",
            "aria-label": "Review view",
            children: ["grid", "list", "wall"].map((o) => /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-pressed": de === o,
                onClick: () => Ke(o),
                children: o
              },
              o
            ))
          }
        ),
        de !== "list" && /* @__PURE__ */ l(oe, { children: [
          /* @__PURE__ */ l("label", { className: "dq-card-size", children: [
            "Card width",
            /* @__PURE__ */ n(
              "input",
              {
                "aria-label": "Review card size",
                type: "range",
                min: "115",
                max: "380",
                step: "5",
                value: be ?? (de === "wall" ? 130 : 180),
                onChange: (o) => Pe(Number(o.target.value))
              }
            )
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              className: `dq-button ${be == null ? "active" : ""}`,
              type: "button",
              onClick: () => Pe(null),
              children: "Auto fit"
            }
          )
        ] }),
        /* @__PURE__ */ l("span", { children: [
          Y.totalCount.toLocaleString(),
          " matching"
        ] })
      ] })
    ] }),
    m ? /* @__PURE__ */ l(oe, { children: [
      ke.error && /* @__PURE__ */ n("p", { role: "alert", children: ke.error }),
      /* @__PURE__ */ n(
        Dr,
        {
          videos: Y.items,
          review: m,
          trees: ke.ids,
          disabled: j || x,
          onChoose: (o) => {
            const f = Lr(m, o);
            Ne(f), Le(f, { ...M, page: 1 });
          }
        }
      ),
      Be && !re && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(Lt, {}),
        Be
      ] }),
      ft && /* @__PURE__ */ n("p", { role: "status", className: "dq-status", children: ft }),
      /* @__PURE__ */ l("div", { className: "dq-workspace", children: [
        /* @__PURE__ */ l("main", { children: [
          wt("top"),
          x && !Y.items.length && /* @__PURE__ */ n(Mt, { label: "Loading review queue…" }),
          ie && !x && /* @__PURE__ */ n(
            $t,
            {
              message: ie,
              onRetry: () => void pe(m, M).catch(() => {
              })
            }
          ),
          !x && !ie && !Y.items.length && /* @__PURE__ */ l("div", { className: "dq-empty", children: [
            /* @__PURE__ */ n(Et, {}),
            /* @__PURE__ */ n("p", { children: "No videos match this review." })
          ] }),
          !!Y.items.length && /* @__PURE__ */ n("div", { ref: pt, children: de === "list" ? /* @__PURE__ */ n("div", { className: "dq-list", "data-review-layout": "list", children: Y.items.map(bt) }) : /* @__PURE__ */ n(
            "div",
            {
              className: "dq-grid",
              style: {
                "--dq-card-width": be == null ? de === "wall" ? "clamp(115px, 10vw, 150px)" : "clamp(145px, 14vw, 180px)" : `${be}px`
              },
              children: Y.items.map(bt)
            }
          ) }),
          wt("bottom")
        ] }),
        /* @__PURE__ */ l("aside", { className: "dq-actions", children: [
          /* @__PURE__ */ n("strong", { children: gt }),
          m.actions.map((o, f) => /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              disabled: j || x || !!ie || !s || !Wt.length,
              onClick: () => void Xe(o),
              children: [
                Ae(o, f) && /* @__PURE__ */ n("kbd", { children: Ae(o, f) }),
                /* @__PURE__ */ n("span", { children: o.label }),
                /* @__PURE__ */ n("small", { children: o.steps.length ? `${o.steps.length} step(s)` : "Skip" })
              ]
            },
            o.id
          )),
          !m.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
          !s && /* @__PURE__ */ n("p", { children: "Video write permission is required to apply actions." }),
          j && /* @__PURE__ */ l("p", { role: "status", children: [
            /* @__PURE__ */ n(Ut, { className: "dq-spin" }),
            " Applying action to",
            " ",
            Gt,
            "…"
          ] }),
          /* @__PURE__ */ n("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ l("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(Et, {}),
      /* @__PURE__ */ n("p", { children: t.length ? "Choose a saved review to open its queue." : "No saved reviews are available in this browser." })
    ] }),
    re && ue && m && /* @__PURE__ */ n(
      Kr,
      {
        video: ue,
        review: m,
        targetLabel: gt,
        pending: j,
        refreshing: x || !!ie,
        error: Be,
        canWrite: s,
        selected: le.has(ue.id),
        hasPrevious: P.indexOf(ue.id) > 0,
        hasNext: P.indexOf(ue.id) >= 0 && P.indexOf(ue.id) < P.length - 1,
        onToggleSelected: () => qe((o) => tt(o, ue.id)),
        onPrevious: () => We(-1),
        onNext: () => We(1),
        onClose: () => {
          we(!1), J(H.current);
        },
        onAction: Xe,
        onOpen: () => e({ page: "video", id: ue.id })
      }
    ),
    se && m && /* @__PURE__ */ n(
      Tt,
      {
        reviews: t,
        activeReview: { ...m, view: { ...m.view, filter: M } },
        initialEdit: !0,
        temporary: !0,
        onSave: (o) => {
          const f = o.find((w) => w.id === p);
          return Ne(f), Le(
            f,
            ge({ ...f.view.filter, page: M.page })
          ), !0;
        },
        onChoose: () => {
        },
        onClose: () => {
          lt(!1), J(H.current, !1);
        }
      }
    ),
    F && /* @__PURE__ */ n(
      Tt,
      {
        reviews: t,
        activeReview: _,
        initialEdit: ae,
        onSave: mt,
        onChoose: Ye,
        onClose: () => {
          D(!1), ae && J(H.current, !1);
        }
      }
    )
  ] });
  async function Le(o, f) {
    const w = H.current, C = Math.max(0, P.indexOf(w ?? -1));
    try {
      const I = (await pe(o, f)).items.map((z) => z.id);
      fe(
        (z) => new Set([...z].filter((he) => I.includes(he)))
      );
      const G = qt(I, w, C);
      te(G), ce.current || J(G, !1);
    } catch {
    }
  }
  function Zt() {
    fe(/* @__PURE__ */ new Set()), me.current.clear(), te(null);
  }
  function wt(o) {
    return m ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: j || x,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          nr,
          {
            filter: {
              ...M,
              page: Number(M.page) || 1,
              perPage: Number(M.perPage) || 40
            },
            totalCount: Y.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${o}`,
            onFilterChange: (f) => {
              j || x || f.page === Number(M.page) || Jr(
                { ...M, page: f.page },
                m,
                Ce,
                pe,
                Zt
              );
            }
          }
        )
      }
    ) : null;
  }
  function bt(o) {
    return /* @__PURE__ */ n(
      _r,
      {
        video: o,
        annotation: $r(o, m, ke.ids),
        displayMode: de,
        focused: o.id === B,
        selected: le.has(o.id),
        setRef: (f) => {
          f ? He.current.set(o.id, f) : He.current.delete(o.id);
        },
        onFocus: () => te(o.id),
        onToggle: () => qe((f) => tt(f, o.id)),
        onPreview: () => {
          te(o.id), we(!0);
        }
      },
      o.id
    );
  }
}
function Jr(e, t, r, i, a) {
  r(e), a(), i(t, e).catch(() => {
  });
}
function tt(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function _r({
  video: e,
  annotation: t,
  displayMode: r,
  focused: i,
  selected: a,
  setRef: d,
  onFocus: c,
  onToggle: b,
  onPreview: S
}) {
  const y = e.files[0], s = Ht(e), u = /* @__PURE__ */ l(oe, { children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        "aria-label": a ? `Deselect ${s}` : `Select ${s}`,
        onClick: (g) => {
          g.stopPropagation(), b();
        },
        className: `dq-select ${a ? "selected" : ""}`,
        children: a && /* @__PURE__ */ n(pr, {})
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
        children: /* @__PURE__ */ n(hr, {})
      }
    ),
    /* @__PURE__ */ l("div", { className: "dq-badges", children: [
      y && /* @__PURE__ */ n("span", { children: or(y.width, y.height) }),
      y != null && y.duration ? /* @__PURE__ */ n("span", { children: ar(y.duration) }) : null
    ] })
  ] });
  return /* @__PURE__ */ l(
    "article",
    {
      ref: d,
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${s}${a ? ", selected" : ""}`,
      onFocus: c,
      onClick: (g) => {
        c(), g.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-card ${r} ${i ? "focused" : ""} ${a ? "selected" : ""}`,
      children: [
        r === "wall" ? /* @__PURE__ */ l(zr, { video: e, children: [
          u,
          /* @__PURE__ */ n("p", { className: "dq-wall-title", children: s })
        ] }) : /* @__PURE__ */ l("div", { className: "dq-poster", children: [
          /* @__PURE__ */ n("img", { src: Qt(e), alt: "" }),
          u
        ] }),
        (r !== "wall" || t) && /* @__PURE__ */ l("div", { className: "dq-card-copy", children: [
          /* @__PURE__ */ n("strong", { children: s }),
          /* @__PURE__ */ l("small", { children: [
            t,
            " "
          ] })
        ] })
      ]
    }
  );
}
function zr({
  video: e,
  children: t
}) {
  const r = U(null), i = U(null), [a, d] = v(!1), [c, b] = v(!1), [S, y] = v(!1);
  return ee(() => {
    const s = r.current;
    if (!s || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      d(!0), b(!0);
      return;
    }
    const u = new IntersectionObserver(
      ([N]) => d(N.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), g = new IntersectionObserver(
      ([N]) => b(N.isIntersecting && N.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return u.observe(s), g.observe(s), () => {
      u.disconnect(), g.disconnect();
    };
  }, [e.id, e.files.length]), ee(() => {
    if (!a) {
      y(!1);
      return;
    }
    const s = new AbortController();
    return V(xr(e.id), {
      signal: s.signal
    }).then((u) => {
      s.signal.aborted || y(u.available === !0);
    }).catch(() => {
      s.signal.aborted || y(!1);
    }), () => s.abort();
  }, [a, e.id]), ee(() => {
    const s = i.current;
    s && (c ? Promise.resolve(s.play()).catch(() => {
    }) : s.pause());
  }, [S, c]), /* @__PURE__ */ l("div", { ref: r, className: "dq-wall-media", children: [
    /* @__PURE__ */ n("img", { src: Qt(e), alt: "" }),
    S && /* @__PURE__ */ n(
      "video",
      {
        ref: i,
        src: kr(e.id),
        muted: !0,
        loop: !0,
        playsInline: !0,
        preload: "metadata"
      }
    ),
    t
  ] });
}
function Kr({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: a,
  error: d,
  canWrite: c,
  selected: b,
  hasPrevious: S,
  hasNext: y,
  onToggleSelected: s,
  onPrevious: u,
  onNext: g,
  onClose: N,
  onAction: A,
  onOpen: E
}) {
  const O = U(null), $ = U(null), R = e.files[0], h = Ht(e);
  ee(() => {
    var T;
    const p = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (T = O.current) == null || T.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = p;
    };
  }, []);
  function q(p) {
    var D, ae, ne;
    if (p.key !== "Tab") return;
    const T = [
      ...((D = O.current) == null ? void 0 : D.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((se) => se.offsetParent !== null);
    if (!T.length) {
      p.preventDefault(), (ae = O.current) == null || ae.focus();
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
    const F = $.current, D = p.currentTarget.querySelector("video");
    if (p.key === "Enter" || p.key === "Escape")
      p.repeat || N();
    else if (p.key === " " && F)
      p.repeat || F.toggle();
    else if (T && F)
      F.seekBy(
        (p.key === "ArrowLeft" ? -1 : 1) * (p.shiftKey ? 5 : p.altKey ? 10 : 60)
      );
    else if ((p.key === "," || p.key === ".") && F) {
      const ae = [R == null ? void 0 : R.duration, D == null ? void 0 : D.duration].find(
        (se) => se != null && Number.isFinite(se) && se > 0
      ) ?? 0, ne = e.parentVideoId != null ? (e.clipEndSec ?? ae) - (e.clipStartSec ?? 0) : ae;
      Number.isFinite(ne) && ne > 0 && F.seekBy((p.key === "," ? -1 : 1) * ne * 0.1);
    } else if (p.key.toLowerCase() === "n" || p.key.toLowerCase() === "m")
      !p.repeat && !i && !a && (p.key.toLowerCase() === "n" && S && u(), p.key.toLowerCase() === "m" && y && g());
    else if (p.key === "ArrowUp" && D)
      D.volume = Math.min(1, D.volume + 0.1);
    else if (p.key === "ArrowDown" && D)
      D.volume = Math.max(0, D.volume - 0.1);
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
      children: /* @__PURE__ */ l("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ l("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !S || i || a,
              onClick: u,
              children: /* @__PURE__ */ n(lr, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !y || i || a,
              onClick: g,
              children: /* @__PURE__ */ n(cr, {})
            }
          ),
          /* @__PURE__ */ l("div", { children: [
            /* @__PURE__ */ n("h2", { children: h }),
            /* @__PURE__ */ l("p", { children: [
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
              children: /* @__PURE__ */ n(dr, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: N,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(jt, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: R ? /* @__PURE__ */ n(
          ir,
          {
            autostart: !0,
            streamUrl: Or(e.id),
            posterUrl: Ot(e),
            format: R.format,
            audioCodec: R.audioCodec,
            duration: R.duration ?? 0,
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
        ) : /* @__PURE__ */ n("img", { src: Ot(e), alt: "" }) }),
        d && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: d }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((p, T) => /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            disabled: i || a || !c,
            onClick: () => void A(p),
            children: [
              Ae(p, T) && /* @__PURE__ */ n("kbd", { children: Ae(p, T) }),
              p.label
            ]
          },
          p.id
        )) })
      ] })
    }
  );
}
function Tt({
  reviews: e,
  activeReview: t,
  initialEdit: r = !1,
  temporary: i = !1,
  onSave: a,
  onChoose: d,
  onClose: c
}) {
  const [b, S] = v(
    () => r && t ? structuredClone(t) : null
  ), [y, s] = v(""), [u, g] = v(!1), N = U(null);
  ee(() => {
    var k, p;
    const h = document.activeElement, q = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (p = (k = N.current) == null ? void 0 : k.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || p.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = q, h == null || h.focus({ preventScroll: !0 });
    };
  }, []);
  function A(h) {
    var p, T, F;
    if (h.defaultPrevented) {
      h.stopPropagation();
      return;
    }
    if (h.key === "Escape") {
      X(h), u || c();
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
    ].filter((D) => D.offsetParent !== null);
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
    if (u) return;
    if (!b || nt(b)) {
      s(b ? nt(b) : "Choose a review.");
      return;
    }
    const h = { ...b, name: b.name.trim() }, q = e.some((k) => k.id === h.id) ? e.map((k) => k.id === h.id ? h : k) : [...e, h];
    g(!0), s("");
    try {
      if (!await a(q)) throw new Error("Could not save reviews.");
      d(h.id), c();
    } catch (k) {
      s(
        "Could not save reviews. Your edits are still open. " + (k instanceof Error ? k.message : "Retry saving.")
      );
    } finally {
      g(!1);
    }
  }
  async function $(h) {
    if (!u) {
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
  async function R(h) {
    var k;
    if (u) return;
    const q = (k = h.target.files) == null ? void 0 : k[0];
    if (h.target.value = "", !!q) {
      if (q.size > 2e6) {
        s("Review files must be smaller than 2 MB.");
        return;
      }
      g(!0), s("");
      try {
        const p = Ie(await q.text());
        if (!await a(it(e, p)))
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
      onKeyDown: A,
      children: /* @__PURE__ */ l("div", { className: "dq-manager", children: [
        /* @__PURE__ */ l("header", { children: [
          /* @__PURE__ */ l("div", { children: [
            /* @__PURE__ */ n("h2", { children: i ? "Adjust queue temporarily" : b ? e.some((h) => h.id === b.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: i ? "Apply changes for this session. Saved review settings stay available through Reset to saved queue." : "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: u,
              onClick: c,
              children: /* @__PURE__ */ n(jt, {})
            }
          )
        ] }),
        y && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: y }),
        /* @__PURE__ */ n("fieldset", { disabled: u, className: "dq-manager-content", children: b ? /* @__PURE__ */ n(
          Vr,
          {
            draft: b,
            temporary: i,
            saving: u,
            setDraft: S,
            onSave: () => void O(),
            onCancel: c
          }
        ) : /* @__PURE__ */ l(oe, { children: [
          /* @__PURE__ */ l("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ l(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => E(),
                children: [
                  /* @__PURE__ */ n(ur, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ l("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(fr, {}),
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
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((h) => /* @__PURE__ */ l("article", { children: [
            /* @__PURE__ */ l("div", { children: [
              /* @__PURE__ */ n("strong", { children: h.name }),
              /* @__PURE__ */ n("p", { children: h.description || "No description" })
            ] }),
            /* @__PURE__ */ l("button", { type: "button", onClick: () => E(h), children: [
              /* @__PURE__ */ n(Dt, {}),
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
                children: /* @__PURE__ */ n(Ft, {})
              }
            )
          ] }, h.id)) })
        ] }) })
      ] })
    }
  );
}
function Vr({
  draft: e,
  temporary: t = !1,
  saving: r = !1,
  setDraft: i,
  onSave: a,
  onCancel: d
}) {
  const [c, b] = v("Review"), S = U(/* @__PURE__ */ new WeakMap()), y = (u) => {
    let g = S.current.get(u);
    return g || (g = crypto.randomUUID(), S.current.set(u, g)), g;
  }, s = (u, g) => i({
    ...e,
    actions: e.actions.map(
      (N, A) => A === u ? g : N
    )
  });
  return /* @__PURE__ */ l("div", { className: "dq-editor", children: [
    !t && /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      sr,
      {
        tabs: ["Review", "Queue", "Appearance", "Actions"].map((u) => ({
          key: u,
          label: u,
          count: u === "Actions" ? e.actions.length : void 0,
          disabled: r
        })),
        activeTab: c,
        onTabChange: b
      }
    ) }),
    /* @__PURE__ */ l("div", { className: "dq-editor-body", children: [
      !t && /* @__PURE__ */ l("section", { hidden: c !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ l("label", { children: [
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
        /* @__PURE__ */ l("label", { children: [
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
          hidden: !t && c !== "Queue",
          className: "dq-editor-section",
          children: /* @__PURE__ */ n(kt, { draft: e, onChange: i, presentation: !1 })
        }
      ),
      !t && /* @__PURE__ */ n(
        "section",
        {
          hidden: c !== "Appearance",
          className: "dq-editor-section",
          children: /* @__PURE__ */ n(kt, { draft: e, onChange: i, queue: !1 })
        }
      ),
      !t && /* @__PURE__ */ l("section", { hidden: c !== "Actions", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Actions" }),
        /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
        /* @__PURE__ */ n(
          Ct,
          {
            items: e.actions,
            getKey: (u) => u.id,
            disabled: r,
            className: "dq-sortable-list",
            onReorder: (u) => i({ ...e, actions: u }),
            renderItem: (u, { index: g, dragHandleProps: N, isOver: A }) => /* @__PURE__ */ l(
              "fieldset",
              {
                className: A ? "dq-action-card dq-drag-over" : "dq-action-card",
                children: [
                  /* @__PURE__ */ l("legend", { children: [
                    "Action ",
                    g + 1
                  ] }),
                  /* @__PURE__ */ l("div", { className: "dq-action-heading", children: [
                    /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        ...N,
                        disabled: r,
                        className: "dq-drag-handle",
                        "aria-label": `Reorder action ${g + 1}`,
                        children: /* @__PURE__ */ n(Jt, {})
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
                            ...e.actions.slice(0, g + 1),
                            {
                              ...structuredClone(u),
                              id: crypto.randomUUID(),
                              label: u.label + " copy",
                              shortcut: ""
                            },
                            ...e.actions.slice(g + 1)
                          ]
                        }),
                        children: "Duplicate action"
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ l("div", { className: "dq-field-grid", children: [
                    /* @__PURE__ */ l("label", { children: [
                      "Shortcut",
                      /* @__PURE__ */ l(
                        "select",
                        {
                          value: u.shortcut ?? "auto",
                          onChange: (E) => s(g, {
                            ...u,
                            shortcut: E.target.value === "auto" ? void 0 : E.target.value
                          }),
                          children: [
                            /* @__PURE__ */ l("option", { value: "auto", children: [
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
                    /* @__PURE__ */ l("label", { children: [
                      "Button label",
                      /* @__PURE__ */ n(
                        "input",
                        {
                          value: u.label,
                          onChange: (E) => s(g, {
                            ...u,
                            label: E.target.value
                          })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ n(
                    Ct,
                    {
                      items: u.steps,
                      getKey: y,
                      disabled: r,
                      className: "dq-sortable-list",
                      onReorder: (E) => s(g, { ...u, steps: E }),
                      renderItem: (E, { index: O, dragHandleProps: $, isOver: R }) => /* @__PURE__ */ n(
                        Qr,
                        {
                          dragHandleProps: $,
                          saving: r,
                          isOver: R,
                          step: E,
                          index: O,
                          onChange: (h) => {
                            S.current.set(h, y(E)), s(g, {
                              ...u,
                              steps: u.steps.map(
                                (q, k) => k === O ? h : q
                              )
                            });
                          },
                          onRemove: () => s(g, {
                            ...u,
                            steps: u.steps.filter(
                              (h, q) => q !== O
                            )
                          })
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ l("div", { className: "dq-row", children: [
                    /* @__PURE__ */ n(
                      "button",
                      {
                        className: "dq-button",
                        type: "button",
                        onClick: () => s(g, {
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
    /* @__PURE__ */ l("div", { className: "dq-editor-footer", children: [
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
            ), g = document.createElement("a");
            g.href = u, g.download = "data-quality-review.json", g.click(), URL.revokeObjectURL(u);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: d, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: a, children: t ? "Apply temporary queue" : "Save review" })
    ] })
  ] });
}
function Qr({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: i,
  isOver: a,
  onChange: d,
  onRemove: c
}) {
  return /* @__PURE__ */ l("div", { className: a ? "dq-action-step dq-drag-over" : "dq-action-step", children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        ...r,
        disabled: i,
        className: "dq-drag-handle",
        "aria-label": `Reorder step ${t + 1}`,
        children: /* @__PURE__ */ n(Jt, {})
      }
    ),
    /* @__PURE__ */ l("span", { children: [
      "Step ",
      t + 1
    ] }),
    /* @__PURE__ */ l(
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
      rt,
      {
        entityType: "tag",
        values: e.tagIds,
        onChange: (b) => d({ ...e, tagIds: b }),
        placeholder: "Choose tags",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: c, children: /* @__PURE__ */ n(Ft, {}) })
  ] });
}
async function Br() {
  const e = await V("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const c = JSON.parse(r);
      Array.isArray(c.reviews) && (i = JSON.stringify(c.reviews, null, 2));
    } catch {
    }
  const a = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), d = document.createElement("a");
  d.href = a, d.download = "data-quality-browser-recovery.json", d.click(), URL.revokeObjectURL(a);
}
function Mt({ label: e }) {
  return /* @__PURE__ */ l("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(Ut, { className: "dq-spin" }),
    e
  ] });
}
function $t({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ l("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(Lt, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const Zr = { components: { DataQualityPage: Fr } };
export {
  Fr as DataQualityPage,
  Zr as default
};
