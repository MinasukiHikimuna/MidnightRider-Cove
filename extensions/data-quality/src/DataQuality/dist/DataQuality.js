import { jsxs as l, jsx as n, Fragment as fe } from "react/jsx-runtime";
import { useState as v, useEffect as ee, useMemo as Nt, useRef as U, useCallback as Ne } from "react";
import { VIDEO_SORT_OPTIONS as Ct, FilterDialog as rr, VIDEO_CRITERIA as nr, EntityReferenceMultiSelector as rt, VideoPlayer as ir, getResolutionLabel as or, formatDuration as ar, EntityDetailTabs as sr, SortableList as Et } from "@cove/runtime/components";
import { Pencil as Ut, Film as qt, AlertTriangle as jt, Loader2 as Ft, ChevronLeft as lr, ChevronRight as cr, ExternalLink as dr, X as Jt, Plus as ur, Upload as fr, Trash2 as _t, Check as pr, Play as hr, GripVertical as zt } from "@cove/runtime/lucide-react";
import { extensionFetch as gr } from "@cove/runtime/api";
function Ie(e, t) {
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
function Rt(e, t, r) {
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
function ke(e) {
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
function At(e, t) {
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
const Kt = "ext:com.midnightrider.data-quality:configuration", vr = "ext:cove-data-quality:video-reviews", ot = "ext:com.midnightrider.data-quality:progress", Oe = /* @__PURE__ */ new Map(), Fe = /* @__PURE__ */ new Map(), et = (e, t) => e.includes("*") || e.includes(t), Je = (e) => V(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Sr = () => ({
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
function Ce(e) {
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
      const c = ke(d);
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
async function Vt(e) {
  const t = await V("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Qt(e, t) {
  const r = (Fe.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Fe.set(e, r), r.finally(() => {
    Fe.get(e) === r && Fe.delete(e);
  }).catch(() => {
  }), r;
}
let Ae = null;
function Cr() {
  if (Ae) return Ae;
  const e = Er();
  return Ae = e, e.finally(() => {
    Ae === e && (Ae = null);
  }).catch(() => {
  }), e;
}
async function Er() {
  var g;
  const e = await V("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = et(e.permissions, "savedfilters.read"), a = i && et(e.permissions, "savedfilters.write"), d = i ? (await Je(Kt)).filter((N) => N.name === "Data Quality configuration").sort((N, A) => N.id - A.id) : [];
  if (d.length > 1) {
    const N = (A) => {
      const { revision: E, ...k } = Ce(A.uiOptions);
      return JSON.stringify(k);
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
  let c = d.length ? Ce(d[0].uiOptions) : Sr();
  const b = localStorage.getItem(`${r}:migrated`) === "true", S = localStorage.getItem(r), y = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && S && (c = Ce(S));
  let s = !d.length;
  if (d.length && y && S) {
    const N = Ce(S);
    if (N.reviews.some((E) => {
      const k = c.reviews.find(($) => $.id === E.id);
      return k && JSON.stringify(k) !== JSON.stringify(E);
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
      (R) => ke(R.uiOptions ?? "[]")
    ) : [], k = A.known.filter(
      (R) => !A.reviews.some((h) => h.id === R)
    ), $ = /* @__PURE__ */ new Set([...c.deletedIds, ...k]);
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
    d.length && (u.config = Ce(d[0].uiOptions)), await Bt(r, N), c = u.config;
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
async function Bt(e, t) {
  const r = Oe.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await Vt(r), r.recordId != null) {
      const d = await V(
        `/api/savedfilters/${r.recordId}`
      );
      if (Ce(d.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const a = await V(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Kt,
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
  return ke(JSON.stringify(t)), Qt(e, async () => {
    const r = Oe.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((a) => !t.some((d) => d.id === a.id)).map((a) => a.id);
    await Bt(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((a) => !t.some((d) => d.id === a))
    });
  });
}
function It(e) {
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
  const i = localStorage.getItem(`${e}:progress:${t}`), a = i ? It(i) : null;
  if (!r.readable) return a;
  const d = (await Je(ot)).find(
    (b) => b.name === t
  ), c = d ? It(d.uiOptions) : null;
  return a && (!c || a.updatedAt > c.updatedAt) ? a : c;
}
function Ar(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return Qt(i, async () => {
    const a = Oe.get(e);
    if (!(a != null && a.writable)) return;
    await Vt(a);
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
      _e({
        findFilter: ge(t),
        objectFilter: i,
        filterExpression: a
      })
    )
  });
}
function Ht(e) {
  return `/api/videos/${e.id}/image?max=640&v=${encodeURIComponent(e.updatedAt)}`;
}
function kr(e) {
  return `/api/stream/video/${e}`;
}
function Ot(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Or(e) {
  return `/api/stream/video/${e}/preview`;
}
function xr(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Pr(e) {
  return e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Gt(e) {
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
      tagIds: i.mode === "REMOVE_TREE" ? await Gt(i.tagIds) : i.tagIds
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
        async (y) => [y, await Gt([y])]
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
function xt({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [a, d] = v(!1), c = e.view.filter, b = (s) => t({
    ...e,
    view: { ...e.view, filter: { ...c, ...s } }
  }), S = e.presentation ?? {}, y = (s) => t({ ...e, presentation: { ...S, ...s } });
  return /* @__PURE__ */ l(fe, { children: [
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
                !Ct.some((s) => s.value === c.sort) && c.sort != null && /* @__PURE__ */ n("option", { value: String(c.sort), children: String(c.sort) }),
                Ct.map((s) => /* @__PURE__ */ n("option", { value: s.value, children: s.label }, s.value))
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
        rr,
        {
          open: !0,
          onClose: () => d(!1),
          criteria: nr,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: !0,
          subjectLabel: "videos",
          onApply: (s) => {
            t({ ...e, view: { ...e.view, objectFilter: s } }), d(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ l(fe, { children: [
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
function Pt(e) {
  return e.view.displayMode === "wall" || e.view.displayMode === "list" ? e.view.displayMode : "grid";
}
function Ur() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Tt(e) {
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
function Wt(e) {
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
  }), [a, d] = v(""), [c, b] = v(!0), [S, y] = v(""), [s, u] = v(!1), [g, N] = v(!0), [A, E] = v(""), [k, $] = v(""), [R, h] = v(!1), [q, O] = v(!1), [f, M] = v(Ur), [F, D] = v(!1), [oe, ne] = v(!1), [ae, lt] = v(!1), [Q, Ee] = v(
    null
  ), _ = t.find((o) => o.id === f) ?? null, m = Nt(
    () => (Q == null ? void 0 : Q.id) === f && _ ? { ..._, view: Q.view } : _,
    [Q, f, _]
  ), xe = Mr(m), [x, me] = v({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Y, ct] = v({ items: [], totalCount: 0 }), [P, Pe] = v(!1), [ie, dt] = v(""), [se, pe] = v(() => /* @__PURE__ */ new Set()), ze = U(se);
  ze.current = se;
  const we = U(/* @__PURE__ */ new Map()), [B, te] = v(null), H = U(B);
  H.current = B;
  const [re, be] = v(!1), le = U(re);
  le.current = re;
  const ut = U(null), [ce, Ke] = v("grid"), [ye, Te] = v(null), [j, Ve] = v(!1), Me = U(!1), [Xt, Qe] = v(""), [ft, ve] = v(""), [Be, qe] = v(""), He = U(/* @__PURE__ */ new Map()), pt = U(null), Se = U(0), $e = U(0), De = U(null), ht = Ne(async () => {
    b(!0), y("");
    try {
      const o = await Cr();
      r(o.reviews), d(o.storageKey), u(o.canWrite), N(o.canConfigure ?? !0), E(o.storageNotice ?? ""), f && !o.reviews.some((p) => p.id === f) && (M(""), Tt(""));
    } catch (o) {
      y(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      b(!1);
    }
  }, [f]);
  ee(() => {
    ht();
  }, []);
  const de = Ne(
    async (o, p) => {
      var L;
      const w = ++Se.current;
      (L = De.current) == null || L.abort();
      const C = new AbortController();
      De.current = C, p = ge(p), me(p), Pe(!0), dt("");
      try {
        let I = await kt(
          o,
          p,
          C.signal
        );
        const G = Math.max(
          1,
          Math.ceil(I.totalCount / Number(p.perPage))
        );
        return Number(p.page) > G && (p = { ...p, page: G }, I = await kt(
          o,
          p,
          C.signal
        )), w === Se.current && (ct(I), me(p)), I;
      } catch (I) {
        throw w === Se.current && dt(
          I instanceof Error ? I.message : "Could not load the review queue."
        ), I;
      } finally {
        w === Se.current && Pe(!1);
      }
    },
    []
  );
  ee(() => {
    var p;
    if ($e.current += 1, Se.current += 1, (p = De.current) == null || p.abort(), O(!1), $(""), h(!1), pe(/* @__PURE__ */ new Set()), we.current.clear(), te(null), be(!1), Ve(!1), Me.current = !1, Qe(""), ve(""), qe(""), ct({ items: [], totalCount: 0 }), !m) {
      Pe(!1);
      return;
    }
    let o = !0;
    return Pe(!0), (async () => {
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
      me(L), Ke((C == null ? void 0 : C.displayMode) ?? Pt(m)), Te(
        C ? C.cardSize : ((I = m.presentation) == null ? void 0 : I.cardSize) ?? null
      );
      try {
        const G = await de(m, L);
        if (!o) return;
        const z = Rt(
          G.items.map((he) => he.id),
          (C == null ? void 0 : C.focusedId) ?? null,
          (C == null ? void 0 : C.index) ?? 0
        );
        te(z), J(z), w && !C ? ve(
          "The saved queue changed. Review resumed at its first page."
        ) : C && ve(
          "Review resumed. If results changed, focus uses the saved video on this page or the nearest position. Selection starts empty."
        );
      } catch {
      }
      o && O(!0);
    })(), () => {
      var w;
      o = !1, $e.current++, Se.current++, (w = De.current) == null || w.abort();
    };
  }, [m == null ? void 0 : m.id]);
  const T = Nt(
    () => Y.items.map((o) => o.id),
    [Y.items]
  );
  ee(() => {
    if (!q || !m || !a || P || ie || j || (Q == null ? void 0 : Q.id) === m.id || R)
      return;
    const o = {
      version: 1,
      signature: je(m),
      filter: x,
      focusedId: B,
      index: Math.max(0, T.indexOf(B ?? -1)),
      displayMode: ce,
      cardSize: ye,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        a + ":progress:" + m.id,
        JSON.stringify(o)
      );
    } catch {
    }
    if (k) return;
    let p = !0;
    const w = window.setTimeout(() => {
      Ar(a, m.id, o).catch((C) => {
        p && $(
          "Progress is kept in this browser, but account sync failed. " + (C instanceof Error ? C.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      p = !1, window.clearTimeout(w);
    };
  }, [
    q,
    a,
    m,
    P,
    ie,
    j,
    x,
    B,
    T,
    ce,
    ye,
    Q,
    k,
    R
  ]);
  const gt = Math.max(
    1,
    Math.ceil(Y.totalCount / Math.max(1, Number(x.perPage) || 40))
  ), Ge = Y.items.find((o) => o.id === B) ?? null;
  re && Ge && (ut.current = Ge);
  const ue = Ge ?? (re ? ut.current : null), Yt = At(se, B), mt = se.size > 0 ? `${se.size} selected video${se.size === 1 ? "" : "s"}` : B == null ? "no video" : "focused video", J = Ne((o, p = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const w = He.current.get(o);
      w == null || w.focus({ preventScroll: !0 }), p && (w == null || w.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  ee(() => {
    q && !le.current && J(H.current);
  }, [q, J]), ee(() => {
    P || !T.length || (H.current == null || !T.includes(H.current)) && (te(T[0]), le.current || J(T[0]));
  }, [J, T, P]);
  const Re = Ne(
    (o) => {
      pe((p) => {
        const w = o(p);
        for (const C of /* @__PURE__ */ new Set([...p, ...w]))
          p.has(C) !== w.has(C) && we.current.set(
            C,
            (we.current.get(C) ?? 0) + 1
          );
        return w;
      });
    },
    []
  ), We = Ne(
    (o) => {
      if (!T.length) return;
      const p = Math.max(
        0,
        T.indexOf(H.current ?? T[0])
      ), w = T[Math.max(0, Math.min(T.length - 1, p + o))];
      te(w), le.current || J(w);
    },
    [J, T]
  ), Xe = Ne(
    async (o) => {
      const p = At(
        ze.current,
        H.current
      );
      if (!m || Me.current || P || ie || !s || !p.length)
        return;
      const w = ++$e.current, C = m.id, L = [...T], I = H.current, G = new Map(
        p.map((K) => [K, we.current.get(K) ?? 0])
      ), z = () => w === $e.current && m.id === C;
      Me.current = !0, Ve(!0), Qe(
        ze.current.size ? `${p.length} selected videos` : "the focused video"
      ), ve(""), qe("");
      let he = !1;
      try {
        if (await Tr(o, p), he = !0, !z()) return;
        pe((K) => {
          const W = new Set(K);
          for (const Z of p)
            (we.current.get(Z) ?? 0) === G.get(Z) && W.delete(Z);
          return W;
        }), ve(
          `${o.label}: ${p.length} video${p.length === 1 ? "" : "s"} ${o.steps.length ? "updated" : "skipped"}.`
        );
      } catch (K) {
        if (!z()) return;
        qe(
          K instanceof Error ? K.message : "Action failed."
        );
      }
      try {
        if (await Pr(o), !z()) return;
        const K = await de(m, x);
        if (!z()) return;
        let W = K.items.map((Z) => Z.id);
        if (!W.length && K.totalCount > 0 && Number(x.page) > 1) {
          const Z = Math.max(1, Number(x.page) - 1), Ue = { ...x, page: Z };
          me(Ue), W = (await de(m, Ue)).items.map((Ze) => Ze.id), pe(
            (Ze) => new Set([...Ze].filter((tr) => W.includes(tr)))
          );
          const St = W.at(-1) ?? null;
          te(St), le.current || J(St);
        } else {
          pe(
            (Ue) => new Set([...Ue].filter((vt) => W.includes(vt)))
          );
          const Z = wr(
            L,
            W,
            I,
            he && p.includes(I ?? -1)
          );
          te(Z), le.current && Z == null && be(!1), le.current || J(Z);
        }
      } catch (K) {
        z() && qe(
          (W) => `${W ? `${W} ` : ""}${he ? "The action completed, but " : ""}the queue could not be refreshed. ${K instanceof Error ? K.message : "Refresh failed."}`
        );
      } finally {
        z() && (Me.current = !1, Ve(!1), Qe(""));
      }
    },
    [
      s,
      de,
      x,
      J,
      T,
      P,
      ie,
      m
    ]
  );
  function Zt() {
    var w;
    const o = (w = pt.current) == null ? void 0 : w.firstElementChild, p = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, p.split(" ").filter(Boolean).length);
  }
  function er(o) {
    if (o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || F || ae) return;
    if (re && o.key === "Escape") {
      X(o), be(!1), J(H.current);
      return;
    }
    if (!yr(o.target)) return;
    if (o.key === "Escape") {
      X(o), Re(() => /* @__PURE__ */ new Set());
      return;
    }
    const p = (m == null ? void 0 : m.actions.findIndex(
      (L, I) => Ie(L, I) === o.key
    )) ?? -1;
    if (p >= 0 && (m != null && m.actions[p])) {
      X(o), !j && !P && Xe(m.actions[p]);
      return;
    }
    if (!re && o.key === " ") {
      X(o), B != null && Re((L) => tt(L, B));
      return;
    }
    if (!re && o.key.toLowerCase() === "a") {
      X(o), Re(
        (L) => br(L, T)
      );
      return;
    }
    if (j || P || re) return;
    if (o.key === "Enter" && B != null) {
      X(o), be(!0);
      return;
    }
    const w = Zt(), C = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -w : o.key === "ArrowDown" ? w : 0;
    C && (X(o), We(C));
  }
  function Ye(o) {
    M(o), Tt(o);
  }
  async function wt(o) {
    var w, C, L;
    if (!a) return !1;
    try {
      await qr(a, o);
    } catch (I) {
      throw I;
    }
    r(o), f && !o.some((I) => I.id === f) && Ye("");
    const p = o.find((I) => I.id === f);
    return p && _ && JSON.stringify(p) !== JSON.stringify(_) && (p.view.displayMode !== _.view.displayMode && Ke(Pt(p)), ((w = p.presentation) == null ? void 0 : w.cardSize) !== ((C = _.presentation) == null ? void 0 : C.cardSize) && Te(((L = p.presentation) == null ? void 0 : L.cardSize) ?? null), je(p) !== je(_) && (Ee(null), Le(
      p,
      ge({ ...p.view.filter, page: x.page })
    ))), !0;
  }
  if (c)
    return /* @__PURE__ */ n(Dt, { label: "Loading Data Quality reviews…" });
  if (S)
    return /* @__PURE__ */ l(fe, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Qr().catch(
            (o) => y(
              "Could not export browser reviews. " + (o instanceof Error ? o.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        Lt,
        {
          message: S,
          onRetry: () => void ht()
        }
      )
    ] });
  return /* @__PURE__ */ l("div", { className: "data-quality-page", onKeyDown: er, children: [
    /* @__PURE__ */ l("header", { className: "data-quality-header", children: [
      /* @__PURE__ */ l("div", { children: [
        /* @__PURE__ */ n("h1", { children: "Data Quality" }),
        /* @__PURE__ */ n("p", { children: "A focused queue for previewing videos and applying saved review actions." })
      ] }),
      /* @__PURE__ */ l("label", { children: [
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
      /* @__PURE__ */ l(
        "button",
        {
          className: "dq-button",
          type: "button",
          disabled: j || P || !g,
          onClick: () => {
            ne(!1), D(!0);
          },
          children: [
            /* @__PURE__ */ n(Ut, {}),
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
            const o = localStorage.getItem("page-videos") ?? "[]", p = URL.createObjectURL(
              new Blob([o], { type: "application/json" })
            ), w = document.createElement("a");
            w.href = p, w.download = "data-quality-unassigned-legacy-reviews.json", w.click(), URL.revokeObjectURL(p);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    k && /* @__PURE__ */ l("p", { role: "alert", children: [
      k,
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
    m ? /* @__PURE__ */ l(fe, { children: [
      /* @__PURE__ */ l("section", { className: "dq-toolbar", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: j || P || !g,
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
            disabled: j || P,
            onClick: () => lt(!0),
            children: "Adjust queue"
          }
        ),
        (Q == null ? void 0 : Q.id) === f && /* @__PURE__ */ l(fe, { children: [
          /* @__PURE__ */ n("span", { children: "Temporary queue" }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: j || P || !g,
              onClick: () => {
                _ && wt(
                  t.map(
                    (o) => o.id === f ? {
                      ...o,
                      view: {
                        ...m.view,
                        filter: { ...x, page: 1 }
                      }
                    } : o
                  )
                ).then(() => {
                  Ee(null), ve("Queue saved to this review.");
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
              disabled: j || P,
              onClick: () => {
                Ee(null), _ && Le(
                  _,
                  ge({
                    ..._.view.filter,
                    page: x.page
                  })
                );
              },
              children: "Reset to saved queue"
            }
          )
        ] }),
        /* @__PURE__ */ l("div", { className: "dq-review-title", children: [
          /* @__PURE__ */ n("h2", { children: m.name }),
          m.description && /* @__PURE__ */ n("p", { children: m.description })
        ] }),
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
                "aria-pressed": ce === o,
                onClick: () => Ke(o),
                children: o
              },
              o
            ))
          }
        ),
        ce !== "list" && /* @__PURE__ */ l(fe, { children: [
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
                value: ye ?? (ce === "wall" ? 130 : 180),
                onChange: (o) => Te(Number(o.target.value))
              }
            )
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              className: `dq-button ${ye == null ? "active" : ""}`,
              type: "button",
              onClick: () => Te(null),
              children: "Auto fit"
            }
          )
        ] }),
        /* @__PURE__ */ l("span", { children: [
          Y.totalCount.toLocaleString(),
          " matching"
        ] }),
        /* @__PURE__ */ n(
          "button",
          {
            className: "dq-button",
            type: "button",
            disabled: Number(x.page) <= 1 || j || P,
            onClick: () => Mt(
              { ...x, page: Number(x.page) - 1 },
              m,
              me,
              de,
              bt
            ),
            children: "Prev"
          }
        ),
        /* @__PURE__ */ l("span", { children: [
          Number(x.page) || 1,
          " / ",
          gt
        ] }),
        /* @__PURE__ */ n(
          "button",
          {
            className: "dq-button",
            type: "button",
            disabled: Number(x.page) >= gt || j || P,
            onClick: () => Mt(
              { ...x, page: Number(x.page) + 1 },
              m,
              me,
              de,
              bt
            ),
            children: "Next"
          }
        )
      ] }),
      xe.error && /* @__PURE__ */ n("p", { role: "alert", children: xe.error }),
      /* @__PURE__ */ n(
        Dr,
        {
          videos: Y.items,
          review: m,
          trees: xe.ids,
          disabled: j || P,
          onChoose: (o) => {
            const p = Lr(m, o);
            Ee(p), Le(p, { ...x, page: 1 });
          }
        }
      ),
      Be && !re && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(jt, {}),
        Be
      ] }),
      ft && /* @__PURE__ */ n("p", { role: "status", className: "dq-status", children: ft }),
      /* @__PURE__ */ l("div", { className: "dq-workspace", children: [
        /* @__PURE__ */ l("main", { children: [
          P && !Y.items.length && /* @__PURE__ */ n(Dt, { label: "Loading review queue…" }),
          ie && !P && /* @__PURE__ */ n(
            Lt,
            {
              message: ie,
              onRetry: () => void de(m, x).catch(() => {
              })
            }
          ),
          !P && !ie && !Y.items.length && /* @__PURE__ */ l("div", { className: "dq-empty", children: [
            /* @__PURE__ */ n(qt, {}),
            /* @__PURE__ */ n("p", { children: "No videos match this review." })
          ] }),
          !!Y.items.length && /* @__PURE__ */ n("div", { ref: pt, children: ce === "list" ? /* @__PURE__ */ n("div", { className: "dq-list", "data-review-layout": "list", children: Y.items.map(yt) }) : /* @__PURE__ */ n(
            "div",
            {
              className: "dq-grid",
              style: {
                "--dq-card-width": ye == null ? ce === "wall" ? "clamp(115px, 10vw, 150px)" : "clamp(145px, 14vw, 180px)" : `${ye}px`
              },
              children: Y.items.map(yt)
            }
          ) })
        ] }),
        /* @__PURE__ */ l("aside", { className: "dq-actions", children: [
          /* @__PURE__ */ n("strong", { children: mt }),
          m.actions.map((o, p) => /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              disabled: j || P || !!ie || !s || !Yt.length,
              onClick: () => void Xe(o),
              children: [
                Ie(o, p) && /* @__PURE__ */ n("kbd", { children: Ie(o, p) }),
                /* @__PURE__ */ n("span", { children: o.label }),
                /* @__PURE__ */ n("small", { children: o.steps.length ? `${o.steps.length} step(s)` : "Skip" })
              ]
            },
            o.id
          )),
          !m.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
          !s && /* @__PURE__ */ n("p", { children: "Video write permission is required to apply actions." }),
          j && /* @__PURE__ */ l("p", { role: "status", children: [
            /* @__PURE__ */ n(Ft, { className: "dq-spin" }),
            " Applying action to",
            " ",
            Xt,
            "…"
          ] }),
          /* @__PURE__ */ n("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ l("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(qt, {}),
      /* @__PURE__ */ n("p", { children: t.length ? "Choose a saved review to open its queue." : "No saved reviews are available in this browser." })
    ] }),
    re && ue && m && /* @__PURE__ */ n(
      zr,
      {
        video: ue,
        review: m,
        targetLabel: mt,
        pending: j,
        refreshing: P || !!ie,
        error: Be,
        canWrite: s,
        selected: se.has(ue.id),
        hasPrevious: T.indexOf(ue.id) > 0,
        hasNext: T.indexOf(ue.id) >= 0 && T.indexOf(ue.id) < T.length - 1,
        onToggleSelected: () => Re((o) => tt(o, ue.id)),
        onPrevious: () => We(-1),
        onNext: () => We(1),
        onClose: () => {
          be(!1), J(H.current);
        },
        onAction: Xe,
        onOpen: () => e({ page: "video", id: ue.id })
      }
    ),
    ae && m && /* @__PURE__ */ n(
      $t,
      {
        reviews: t,
        activeReview: { ...m, view: { ...m.view, filter: x } },
        initialEdit: !0,
        temporary: !0,
        onSave: (o) => {
          const p = o.find((w) => w.id === f);
          return Ee(p), Le(
            p,
            ge({ ...p.view.filter, page: x.page })
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
      $t,
      {
        reviews: t,
        activeReview: _,
        initialEdit: oe,
        onSave: wt,
        onChoose: Ye,
        onClose: () => {
          D(!1), oe && J(H.current, !1);
        }
      }
    )
  ] });
  async function Le(o, p) {
    const w = H.current, C = Math.max(0, T.indexOf(w ?? -1));
    try {
      const I = (await de(o, p)).items.map((z) => z.id);
      pe(
        (z) => new Set([...z].filter((he) => I.includes(he)))
      );
      const G = Rt(I, w, C);
      te(G), le.current || J(G, !1);
    } catch {
    }
  }
  function bt() {
    pe(/* @__PURE__ */ new Set()), we.current.clear(), te(null);
  }
  function yt(o) {
    return /* @__PURE__ */ n(
      Jr,
      {
        video: o,
        annotation: $r(o, m, xe.ids),
        displayMode: ce,
        focused: o.id === B,
        selected: se.has(o.id),
        setRef: (p) => {
          p ? He.current.set(o.id, p) : He.current.delete(o.id);
        },
        onFocus: () => te(o.id),
        onToggle: () => Re((p) => tt(p, o.id)),
        onPreview: () => {
          te(o.id), be(!0);
        }
      },
      o.id
    );
  }
}
function Mt(e, t, r, i, a) {
  r(e), a(), i(t, e).catch(() => {
  });
}
function tt(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Jr({
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
  const y = e.files[0], s = Wt(e), u = /* @__PURE__ */ l(fe, { children: [
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
        r === "wall" ? /* @__PURE__ */ l(_r, { video: e, children: [
          u,
          /* @__PURE__ */ n("p", { className: "dq-wall-title", children: s })
        ] }) : /* @__PURE__ */ l("div", { className: "dq-poster", children: [
          /* @__PURE__ */ n("img", { src: Ht(e), alt: "" }),
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
function _r({
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
    /* @__PURE__ */ n("img", { src: Ht(e), alt: "" }),
    S && /* @__PURE__ */ n(
      "video",
      {
        ref: i,
        src: Or(e.id),
        muted: !0,
        loop: !0,
        playsInline: !0,
        preload: "metadata"
      }
    ),
    t
  ] });
}
function zr({
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
  const k = U(null), $ = U(null), R = e.files[0], h = Wt(e);
  ee(() => {
    var M;
    const f = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (M = k.current) == null || M.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = f;
    };
  }, []);
  function q(f) {
    var D, oe, ne;
    if (f.key !== "Tab") return;
    const M = [
      ...((D = k.current) == null ? void 0 : D.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ae) => ae.offsetParent !== null);
    if (!M.length) {
      f.preventDefault(), (oe = k.current) == null || oe.focus();
      return;
    }
    const F = M.indexOf(
      document.activeElement
    );
    f.shiftKey && F <= 0 ? (f.preventDefault(), (ne = M.at(-1)) == null || ne.focus()) : !f.shiftKey && F === M.length - 1 && (f.preventDefault(), M[0].focus());
  }
  function O(f) {
    if (f.defaultPrevented || f.ctrlKey || f.metaKey || f.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const M = f.key === "ArrowLeft" || f.key === "ArrowRight";
    if (f.altKey && !M) return;
    const F = $.current, D = f.currentTarget.querySelector("video");
    if (f.key === "Enter" || f.key === "Escape")
      f.repeat || N();
    else if (f.key === " " && F)
      f.repeat || F.toggle();
    else if (M && F)
      F.seekBy(
        (f.key === "ArrowLeft" ? -1 : 1) * (f.shiftKey ? 5 : f.altKey ? 10 : 60)
      );
    else if ((f.key === "," || f.key === ".") && F) {
      const oe = [R == null ? void 0 : R.duration, D == null ? void 0 : D.duration].find(
        (ae) => ae != null && Number.isFinite(ae) && ae > 0
      ) ?? 0, ne = e.parentVideoId != null ? (e.clipEndSec ?? oe) - (e.clipStartSec ?? 0) : oe;
      Number.isFinite(ne) && ne > 0 && F.seekBy((f.key === "," ? -1 : 1) * ne * 0.1);
    } else if (f.key.toLowerCase() === "n" || f.key.toLowerCase() === "m")
      !f.repeat && !i && !a && (f.key.toLowerCase() === "n" && S && u(), f.key.toLowerCase() === "m" && y && g());
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
      ref: k,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${h}`,
      className: "dq-preview",
      onKeyDown: q,
      onKeyDownCapture: O,
      onMouseDown: (f) => {
        f.target === f.currentTarget && N();
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
              children: /* @__PURE__ */ n(Jt, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: R ? /* @__PURE__ */ n(
          ir,
          {
            autostart: !0,
            streamUrl: kr(e.id),
            posterUrl: Ot(e),
            format: R.format,
            audioCodec: R.audioCodec,
            duration: R.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (f) => ($.current = f, () => {
              $.current === f && ($.current = null);
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
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((f, M) => /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            disabled: i || a || !c,
            onClick: () => void A(f),
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
function $t({
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
    var O, f;
    const h = document.activeElement, q = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (f = (O = N.current) == null ? void 0 : O.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || f.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = q, h == null || h.focus({ preventScroll: !0 });
    };
  }, []);
  function A(h) {
    var f, M, F;
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
      ...((f = N.current) == null ? void 0 : f.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((D) => D.offsetParent !== null);
    if (!q.length) {
      X(h), (M = N.current) == null || M.focus();
      return;
    }
    const O = q.indexOf(
      document.activeElement
    );
    h.shiftKey && O <= 0 ? (X(h), (F = q.at(-1)) == null || F.focus()) : !h.shiftKey && O === q.length - 1 ? (X(h), q[0].focus()) : h.stopPropagation();
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
  async function k() {
    if (u) return;
    if (!b || nt(b)) {
      s(b ? nt(b) : "Choose a review.");
      return;
    }
    const h = { ...b, name: b.name.trim() }, q = e.some((O) => O.id === h.id) ? e.map((O) => O.id === h.id ? h : O) : [...e, h];
    g(!0), s("");
    try {
      if (!await a(q)) throw new Error("Could not save reviews.");
      d(h.id), c();
    } catch (O) {
      s(
        "Could not save reviews. Your edits are still open. " + (O instanceof Error ? O.message : "Retry saving.")
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
    var O;
    if (u) return;
    const q = (O = h.target.files) == null ? void 0 : O[0];
    if (h.target.value = "", !!q) {
      if (q.size > 2e6) {
        s("Review files must be smaller than 2 MB.");
        return;
      }
      g(!0), s("");
      try {
        const f = ke(await q.text());
        if (!await a(it(e, f)))
          throw new Error("Could not save reviews.");
      } catch (f) {
        s(
          f instanceof Error ? f.message : "Could not import reviews."
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
              children: /* @__PURE__ */ n(Jt, {})
            }
          )
        ] }),
        y && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: y }),
        /* @__PURE__ */ n("fieldset", { disabled: u, className: "dq-manager-content", children: b ? /* @__PURE__ */ n(
          Kr,
          {
            draft: b,
            temporary: i,
            saving: u,
            setDraft: S,
            onSave: () => void k(),
            onCancel: c
          }
        ) : /* @__PURE__ */ l(fe, { children: [
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
              /* @__PURE__ */ n(Ut, {}),
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
function Kr({
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
          children: /* @__PURE__ */ n(xt, { draft: e, onChange: i, presentation: !1 })
        }
      ),
      !t && /* @__PURE__ */ n(
        "section",
        {
          hidden: c !== "Appearance",
          className: "dq-editor-section",
          children: /* @__PURE__ */ n(xt, { draft: e, onChange: i, queue: !1 })
        }
      ),
      !t && /* @__PURE__ */ l("section", { hidden: c !== "Actions", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Actions" }),
        /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
        /* @__PURE__ */ n(
          Et,
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
                        children: /* @__PURE__ */ n(zt, {})
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
                    Et,
                    {
                      items: u.steps,
                      getKey: y,
                      disabled: r,
                      className: "dq-sortable-list",
                      onReorder: (E) => s(g, { ...u, steps: E }),
                      renderItem: (E, { index: k, dragHandleProps: $, isOver: R }) => /* @__PURE__ */ n(
                        Vr,
                        {
                          dragHandleProps: $,
                          saving: r,
                          isOver: R,
                          step: E,
                          index: k,
                          onChange: (h) => {
                            S.current.set(h, y(E)), s(g, {
                              ...u,
                              steps: u.steps.map(
                                (q, O) => O === k ? h : q
                              )
                            });
                          },
                          onRemove: () => s(g, {
                            ...u,
                            steps: u.steps.filter(
                              (h, q) => q !== k
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
                            (E, k) => k !== g
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
function Vr({
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
        children: /* @__PURE__ */ n(zt, {})
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
    /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: c, children: /* @__PURE__ */ n(_t, {}) })
  ] });
}
async function Qr() {
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
function Dt({ label: e }) {
  return /* @__PURE__ */ l("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(Ft, { className: "dq-spin" }),
    e
  ] });
}
function Lt({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ l("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(jt, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const Yr = { components: { DataQualityPage: Fr } };
export {
  Fr as DataQualityPage,
  Yr as default
};
