import { jsxs as c, jsx as n, Fragment as oe } from "react/jsx-runtime";
import { useState as v, useEffect as ee, useMemo as St, useRef as U, useCallback as ve } from "react";
import { VIDEO_SORT_OPTIONS as Nt, FilterDialog as nr, VIDEO_CRITERIA as ir, EntityReferenceMultiSelector as rt, DetailListPagination as or, VideoPlayer as ar, getResolutionLabel as sr, formatDuration as lr, EntityDetailTabs as cr, SortableList as Et } from "@cove/runtime/components";
import { Pencil as Lt, Film as Ct, AlertTriangle as Dt, Loader2 as Ut, ChevronLeft as dr, ChevronRight as ur, ExternalLink as fr, X as jt, Plus as pr, Upload as hr, Trash2 as Ft, Check as gr, Play as mr, GripVertical as Jt } from "@cove/runtime/lucide-react";
import { extensionFetch as wr } from "@cove/runtime/api";
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
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && br(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
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
function br(e) {
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
function yr(e, t, r, i) {
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
function vr(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((a) => r.has(a));
  for (const a of t)
    i ? r.delete(a) : r.add(a);
  return r;
}
function Sr(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const _t = "ext:com.midnightrider.data-quality:configuration", Nr = "ext:cove-data-quality:video-reviews", ot = "ext:com.midnightrider.data-quality:progress", Oe = /* @__PURE__ */ new Map(), Fe = /* @__PURE__ */ new Map(), et = (e, t) => e.includes("*") || e.includes(t), Je = (e) => V(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Er = () => ({
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
function Cr(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const a of t) {
    const d = localStorage.getItem(a);
    if (d !== null) {
      const l = Ie(d);
      r ?? (r = l), l.forEach((b) => i.add(b.id));
    }
    at(
      JSON.parse(localStorage.getItem(`${a}:account-imports`) ?? "[]")
    ).forEach((l) => i.add(l));
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
function qr() {
  if (Re) return Re;
  const e = Rr();
  return Re = e, e.finally(() => {
    Re === e && (Re = null);
  }).catch(() => {
  }), e;
}
async function Rr() {
  var g;
  const e = await V("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = et(e.permissions, "savedfilters.read"), a = i && et(e.permissions, "savedfilters.write"), d = i ? (await Je(_t)).filter((N) => N.name === "Data Quality configuration").sort((N, R) => N.id - R.id) : [];
  if (d.length > 1) {
    const N = (R) => {
      const { revision: C, ...O } = Se(R.uiOptions);
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
  let l = d.length ? Se(d[0].uiOptions) : Er();
  const b = localStorage.getItem(`${r}:migrated`) === "true", S = localStorage.getItem(r), y = localStorage.getItem(`${r}:local-only`) === "true";
  !d.length && S && (l = Se(S));
  let s = !d.length;
  if (d.length && y && S) {
    const N = Se(S);
    if (N.reviews.some((C) => {
      const O = l.reviews.find(($) => $.id === C.id);
      return O && JSON.stringify(O) !== JSON.stringify(C);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const R = [
      .../* @__PURE__ */ new Set([...l.deletedIds, ...N.deletedIds])
    ];
    l = {
      ...l,
      reviews: it(l.reviews, N.reviews).filter(
        (C) => !R.includes(C.id)
      ),
      deletedIds: R,
      importedIds: [
        .../* @__PURE__ */ new Set([...l.importedIds, ...N.importedIds])
      ]
    }, s = !0;
  }
  if (!b) {
    const N = JSON.stringify(l), R = Cr(t);
    if (d.length && R.reviews.some((A) => {
      const h = l.reviews.find((q) => q.id === A.id);
      return h && JSON.stringify(h) !== JSON.stringify(A);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const C = i ? (await Je(Nr)).flatMap(
      (A) => Ie(A.uiOptions ?? "[]")
    ) : [], O = R.known.filter(
      (A) => !R.reviews.some((h) => h.id === A)
    ), $ = /* @__PURE__ */ new Set([...l.deletedIds, ...O]);
    l = {
      ...l,
      reviews: it(
        R.reviews,
        l.reviews,
        C.filter(
          (A) => !R.known.includes(A.id) && !l.importedIds.includes(A.id)
        )
      ).filter((A) => !$.has(A.id)),
      deletedIds: [...$],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...l.importedIds,
          ...R.known,
          ...C.map((A) => A.id)
        ])
      ]
    }, s || (s = JSON.stringify(l) !== N);
  }
  const u = {
    userId: t,
    recordId: (g = d[0]) == null ? void 0 : g.id,
    config: l,
    readable: i,
    writable: a,
    durable: a
  };
  if (Oe.set(r, u), s && a) {
    const N = l;
    d.length && (u.config = Se(d[0].uiOptions)), await Vt(r, N), l = u.config;
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
    canWrite: et(e.permissions, "videos.write"),
    canConfigure: !i || a,
    storageNotice: i ? a ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
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
function Ar(e, t) {
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
async function Ir(e, t) {
  const r = Oe.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), a = i ? At(i) : null;
  if (!r.readable) return a;
  const d = (await Je(ot)).find(
    (b) => b.name === t
  ), l = d ? At(d.uiOptions) : null;
  return a && (!l || a.updatedAt > l.updatedAt) ? a : l;
}
function Or(e, t, r) {
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
      (l) => l.name === t
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
const kr = {
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
      t === "modifier" && typeof r == "string" ? kr[r] ?? r : _e(r)
    ])
  ) : e;
}
async function V(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await wr(e, { ...t, headers: r });
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
function Pr(e) {
  return `/api/stream/video/${e}`;
}
function Ot(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function xr(e) {
  return `/api/stream/video/${e}/preview`;
}
function Tr(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Mr(e) {
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
async function $r(e, t) {
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
function Lr(e) {
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
function Dr(e, t, r) {
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
function Ur({
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
  ), l = /* @__PURE__ */ new Map();
  for (const s of e)
    for (const u of s.tags ?? [])
      if (d.has(u.id)) {
        const g = l.get(u.id) ?? { name: u.name, count: 0 };
        g.count++, l.set(u.id, g);
      }
  return (y = (S = t.presentation) == null ? void 0 : S.binParents) != null && y.length ? /* @__PURE__ */ c("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...l].sort((s, u) => s[1].name.localeCompare(u[1].name)).map(([s, u]) => /* @__PURE__ */ c(
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
    !l.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function jr(e, t) {
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
  const [a, d] = v(!1), l = e.view.filter, b = (s) => t({
    ...e,
    view: { ...e.view, filter: { ...l, ...s } }
  }), S = e.presentation ?? {}, y = (s) => t({ ...e, presentation: { ...S, ...s } });
  return /* @__PURE__ */ c(oe, { children: [
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
                !Nt.some((s) => s.value === l.sort) && l.sort != null && /* @__PURE__ */ n("option", { value: String(l.sort), children: String(l.sort) }),
                Nt.map((s) => /* @__PURE__ */ n("option", { value: s.value, children: s.label }, s.value))
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
        nr,
        {
          open: !0,
          onClose: () => d(!1),
          criteria: ir,
          activeFilter: e.view.objectFilter,
          supportsFilterExpressions: !0,
          subjectLabel: "videos",
          onApply: (s) => {
            t({ ...e, view: { ...e.view, objectFilter: s } }), d(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ c(oe, { children: [
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
          /* @__PURE__ */ c(
            "select",
            {
              value: S.cardSize ?? "auto",
              onChange: (s) => y({
                cardSize: s.target.value === "auto" ? null : Number(s.target.value)
              }),
              children: [
                /* @__PURE__ */ n("option", { value: "auto", children: "Auto fit" }),
                [130, 180, 260, 380].map((s) => /* @__PURE__ */ c("option", { value: s, children: [
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
        return /* @__PURE__ */ c("label", { className: "dq-checkbox", children: [
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
function Fr() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function xt(e) {
  const t = new URLSearchParams(window.location.search);
  e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function Jr(e) {
  return ge({ ...e, page: 1 });
}
function _r(e, t) {
  if (t === 0) return "Showing 0 of 0";
  const r = Number(e.perPage) || 40, i = Math.max(1, Math.ceil(t / r)), a = Math.min(Math.max(1, Number(e.page) || 1), i), d = (a - 1) * r + 1, l = Math.min(a * r, t);
  return `Showing ${d.toLocaleString()}-${l.toLocaleString()} of ${t.toLocaleString()}`;
}
function Ht(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function X(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
function zr({
  onNavigate: e
}) {
  const [t, r] = v([]), [i] = v(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [a, d] = v(""), [l, b] = v(!0), [S, y] = v(""), [s, u] = v(!1), [g, N] = v(!0), [R, C] = v(""), [O, $] = v(""), [A, h] = v(!1), [q, k] = v(!1), [p, T] = v(Fr), [F, L] = v(!1), [ae, ne] = v(!1), [se, lt] = v(!1), [Q, Ne] = v(
    null
  ), _ = t.find((o) => o.id === p) ?? null, m = St(
    () => (Q == null ? void 0 : Q.id) === p && _ ? { ..._, view: Q.view } : _,
    [Q, p, _]
  ), ke = Lr(m), [M, Ee] = v({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Gt, Wt] = v({
    page: 1,
    perPage: 40
  }), [Y, ct] = v({ items: [], totalCount: 0 }), [P, Pe] = v(!1), [ie, dt] = v(""), [le, fe] = v(() => /* @__PURE__ */ new Set()), ze = U(le);
  ze.current = le;
  const me = U(/* @__PURE__ */ new Map()), [B, te] = v(null), H = U(B);
  H.current = B;
  const [re, we] = v(!1), ce = U(re);
  ce.current = re;
  const ut = U(null), [de, Ke] = v("grid"), [be, xe] = v(null), [j, Ve] = v(!1), Te = U(!1), [Xt, Qe] = v(""), [ft, Me] = v(""), [Be, Ce] = v(""), He = U(/* @__PURE__ */ new Map()), pt = U(null), ye = U(0), $e = U(0), Le = U(null), ht = ve(async () => {
    b(!0), y("");
    try {
      const o = await qr();
      r(o.reviews), d(o.storageKey), u(o.canWrite), N(o.canConfigure ?? !0), C(o.storageNotice ?? ""), p && !o.reviews.some((f) => f.id === p) && (T(""), xt(""));
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
      var D;
      const w = ++ye.current;
      (D = Le.current) == null || D.abort();
      const E = new AbortController();
      Le.current = E, f = ge(f), Ee(f), Pe(!0), dt("");
      try {
        let I = await It(
          o,
          f,
          E.signal
        );
        const G = Math.max(
          1,
          Math.ceil(I.totalCount / Number(f.perPage))
        );
        return Number(f.page) > G && (f = { ...f, page: G }, I = await It(
          o,
          f,
          E.signal
        )), w === ye.current && (ct(I), Ee(f), Wt(f)), I;
      } catch (I) {
        throw w === ye.current && dt(
          I instanceof Error ? I.message : "Could not load the review queue."
        ), I;
      } finally {
        w === ye.current && Pe(!1);
      }
    },
    []
  );
  ee(() => {
    var f;
    if ($e.current += 1, ye.current += 1, (f = Le.current) == null || f.abort(), k(!1), $(""), h(!1), fe(/* @__PURE__ */ new Set()), me.current.clear(), te(null), we(!1), Ve(!1), Te.current = !1, Qe(""), Me(""), Ce(""), ct({ items: [], totalCount: 0 }), !m) {
      Pe(!1);
      return;
    }
    let o = !0;
    return Pe(!0), (async () => {
      var I;
      let w = null;
      try {
        w = await Ir(a, m.id);
      } catch (G) {
        o && (h(!0), $(
          G instanceof Error ? G.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const E = (w == null ? void 0 : w.signature) === je(m) ? w : null, D = E ? ge(E.filter) : Jr(m.view.filter);
      Ee(D), Ke((E == null ? void 0 : E.displayMode) ?? Pt(m)), xe(
        E ? E.cardSize : ((I = m.presentation) == null ? void 0 : I.cardSize) ?? null
      );
      try {
        const G = await pe(m, D);
        if (!o) return;
        const z = qt(
          G.items.map((he) => he.id),
          (E == null ? void 0 : E.focusedId) ?? null,
          (E == null ? void 0 : E.index) ?? 0
        );
        te(z), J(z);
      } catch {
      }
      o && k(!0);
    })(), () => {
      var w;
      o = !1, $e.current++, ye.current++, (w = Le.current) == null || w.abort();
    };
  }, [m == null ? void 0 : m.id]);
  const x = St(
    () => Y.items.map((o) => o.id),
    [Y.items]
  );
  ee(() => {
    if (!q || !m || !a || P || ie || j || (Q == null ? void 0 : Q.id) === m.id || A)
      return;
    const o = {
      version: 1,
      signature: je(m),
      filter: M,
      focusedId: B,
      index: Math.max(0, x.indexOf(B ?? -1)),
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
      Or(a, m.id, o).catch((E) => {
        f && $(
          "Progress is kept in this browser, but account sync failed. " + (E instanceof Error ? E.message : "Retry.")
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
    P,
    ie,
    j,
    M,
    B,
    x,
    de,
    be,
    Q,
    O,
    A
  ]);
  const Ge = Y.items.find((o) => o.id === B) ?? null;
  re && Ge && (ut.current = Ge);
  const ue = Ge ?? (re ? ut.current : null), Yt = Rt(le, B), gt = le.size > 0 ? `${le.size} selected video${le.size === 1 ? "" : "s"}` : B == null ? "no video" : "focused video", J = ve((o, f = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const w = He.current.get(o);
      w == null || w.focus({ preventScroll: !0 }), f && (w == null || w.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  ee(() => {
    q && !ce.current && J(H.current);
  }, [q, J]), ee(() => {
    P || !x.length || (H.current == null || !x.includes(H.current)) && (te(x[0]), ce.current || J(x[0]));
  }, [J, x, P]);
  const qe = ve(
    (o) => {
      fe((f) => {
        const w = o(f);
        for (const E of /* @__PURE__ */ new Set([...f, ...w]))
          f.has(E) !== w.has(E) && me.current.set(
            E,
            (me.current.get(E) ?? 0) + 1
          );
        return w;
      });
    },
    []
  ), We = ve(
    (o) => {
      if (!x.length) return;
      const f = Math.max(
        0,
        x.indexOf(H.current ?? x[0])
      ), w = x[Math.max(0, Math.min(x.length - 1, f + o))];
      te(w), ce.current || J(w);
    },
    [J, x]
  ), Xe = ve(
    async (o) => {
      const f = Rt(
        ze.current,
        H.current
      );
      if (!m || Te.current || P || ie || !s || !f.length)
        return;
      const w = ++$e.current, E = m.id, D = [...x], I = H.current, G = new Map(
        f.map((K) => [K, me.current.get(K) ?? 0])
      ), z = () => w === $e.current && m.id === E;
      Te.current = !0, Ve(!0), Qe(
        ze.current.size ? `${f.length} selected videos` : "the focused video"
      ), Me(""), Ce("");
      let he = !1;
      try {
        if (await $r(o, f), he = !0, !z()) return;
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
        Ce(
          K instanceof Error ? K.message : "Action failed."
        );
      }
      try {
        if (await Mr(o), !z()) return;
        const K = await pe(m, M);
        if (!z()) return;
        let W = K.items.map((Z) => Z.id);
        if (!W.length && K.totalCount > 0 && Number(M.page) > 1) {
          const Z = Math.max(1, Number(M.page) - 1), Ue = { ...M, page: Z };
          Ee(Ue), W = (await pe(m, Ue)).items.map((Ze) => Ze.id), fe(
            (Ze) => new Set([...Ze].filter((rr) => W.includes(rr)))
          );
          const vt = W.at(-1) ?? null;
          te(vt), ce.current || J(vt);
        } else {
          fe(
            (Ue) => new Set([...Ue].filter((yt) => W.includes(yt)))
          );
          const Z = yr(
            D,
            W,
            I,
            he && f.includes(I ?? -1)
          );
          te(Z), ce.current && Z == null && we(!1), ce.current || J(Z);
        }
      } catch (K) {
        z() && Ce(
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
      x,
      P,
      ie,
      m
    ]
  );
  function Zt() {
    var w;
    const o = (w = pt.current) == null ? void 0 : w.firstElementChild, f = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, f.split(" ").filter(Boolean).length);
  }
  function er(o) {
    if (o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || F || se) return;
    if (re && o.key === "Escape") {
      X(o), we(!1), J(H.current);
      return;
    }
    if (!Sr(o.target)) return;
    if (o.key === "Escape") {
      X(o), qe(() => /* @__PURE__ */ new Set());
      return;
    }
    const f = (m == null ? void 0 : m.actions.findIndex(
      (D, I) => Ae(D, I) === o.key
    )) ?? -1;
    if (f >= 0 && (m != null && m.actions[f])) {
      X(o), !j && !P && Xe(m.actions[f]);
      return;
    }
    if (!re && o.key === " ") {
      X(o), B != null && qe((D) => tt(D, B));
      return;
    }
    if (!re && o.key.toLowerCase() === "a") {
      X(o), qe(
        (D) => vr(D, x)
      );
      return;
    }
    if (j || P || re) return;
    if (o.key === "Enter" && B != null) {
      X(o), we(!0);
      return;
    }
    const w = Zt(), E = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -w : o.key === "ArrowDown" ? w : 0;
    E && (X(o), We(E));
  }
  function Ye(o) {
    T(o), xt(o);
  }
  async function mt(o) {
    var w, E, D;
    if (!a) return !1;
    try {
      await Ar(a, o);
    } catch (I) {
      throw I;
    }
    r(o), p && !o.some((I) => I.id === p) && Ye("");
    const f = o.find((I) => I.id === p);
    return f && _ && JSON.stringify(f) !== JSON.stringify(_) && (f.view.displayMode !== _.view.displayMode && Ke(Pt(f)), ((w = f.presentation) == null ? void 0 : w.cardSize) !== ((E = _.presentation) == null ? void 0 : E.cardSize) && xe(((D = f.presentation) == null ? void 0 : D.cardSize) ?? null), je(f) !== je(_) && (Ne(null), De(
      f,
      ge({ ...f.view.filter, page: M.page })
    ))), !0;
  }
  if (l)
    return /* @__PURE__ */ n(Mt, { label: "Loading Data Quality reviews…" });
  if (S)
    return /* @__PURE__ */ c(oe, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Wr().catch(
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
  return /* @__PURE__ */ c("div", { className: "data-quality-page", onKeyDown: er, children: [
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
          disabled: j || P || !g,
          onClick: () => {
            ne(!1), L(!0);
          },
          children: [
            /* @__PURE__ */ n(Lt, {}),
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
            const o = localStorage.getItem("page-videos") ?? "[]", f = URL.createObjectURL(
              new Blob([o], { type: "application/json" })
            ), w = document.createElement("a");
            w.href = f, w.download = "data-quality-unassigned-legacy-reviews.json", w.click(), URL.revokeObjectURL(f);
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
          children: A ? "Start fresh progress" : "Retry progress sync"
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
            onChange: (o) => Ye(o.target.value),
            children: [
              /* @__PURE__ */ n("option", { value: "", children: "Choose a review…" }),
              t.map((o) => /* @__PURE__ */ n("option", { value: o.id, children: o.name }, o.id))
            ]
          }
        )
      ] }),
      m && /* @__PURE__ */ n("span", { className: "dq-range-count", children: _r(Gt, Y.totalCount) }),
      m && /* @__PURE__ */ c(oe, { children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: j || P || !g,
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
            disabled: j || P,
            onClick: () => lt(!0),
            children: "Adjust queue"
          }
        ),
        (Q == null ? void 0 : Q.id) === p && /* @__PURE__ */ c(oe, { children: [
          /* @__PURE__ */ n("span", { children: "Temporary queue" }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: j || P || !g,
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
              disabled: j || P,
              onClick: () => {
                Ne(null), _ && De(
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
        de !== "list" && /* @__PURE__ */ c(oe, { children: [
          /* @__PURE__ */ c("label", { className: "dq-card-size", children: [
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
                onChange: (o) => xe(Number(o.target.value))
              }
            )
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              className: `dq-button ${be == null ? "active" : ""}`,
              type: "button",
              onClick: () => xe(null),
              children: "Auto fit"
            }
          )
        ] })
      ] })
    ] }),
    m ? /* @__PURE__ */ c(oe, { children: [
      ke.error && /* @__PURE__ */ n("p", { role: "alert", children: ke.error }),
      /* @__PURE__ */ n(
        Ur,
        {
          videos: Y.items,
          review: m,
          trees: ke.ids,
          disabled: j || P,
          onChoose: (o) => {
            const f = jr(m, o);
            Ne(f), De(f, { ...M, page: 1 });
          }
        }
      ),
      Be && !re && /* @__PURE__ */ c("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(Dt, {}),
        Be
      ] }),
      ft && /* @__PURE__ */ n("p", { role: "status", className: "dq-status", children: ft }),
      /* @__PURE__ */ c("div", { className: "dq-workspace", children: [
        /* @__PURE__ */ c("main", { children: [
          wt("top"),
          P && !Y.items.length && /* @__PURE__ */ n(Mt, { label: "Loading review queue…" }),
          ie && !P && /* @__PURE__ */ n(
            $t,
            {
              message: ie,
              onRetry: () => void pe(m, M).catch(() => {
              })
            }
          ),
          !P && !ie && !Y.items.length && /* @__PURE__ */ c("div", { className: "dq-empty", children: [
            /* @__PURE__ */ n(Ct, {}),
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
        /* @__PURE__ */ c("aside", { className: "dq-actions", children: [
          /* @__PURE__ */ n("strong", { children: gt }),
          m.actions.map((o, f) => /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              disabled: j || P || !!ie || !s || !Yt.length,
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
          j && /* @__PURE__ */ c("p", { role: "status", children: [
            /* @__PURE__ */ n(Ut, { className: "dq-spin" }),
            " Applying action to",
            " ",
            Xt,
            "…"
          ] }),
          /* @__PURE__ */ n("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ c("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(Ct, {}),
      /* @__PURE__ */ n("p", { children: t.length ? "Choose a saved review to open its queue." : "No saved reviews are available in this browser." })
    ] }),
    re && ue && m && /* @__PURE__ */ n(
      Br,
      {
        video: ue,
        review: m,
        targetLabel: gt,
        pending: j,
        refreshing: P || !!ie,
        error: Be,
        canWrite: s,
        selected: le.has(ue.id),
        hasPrevious: x.indexOf(ue.id) > 0,
        hasNext: x.indexOf(ue.id) >= 0 && x.indexOf(ue.id) < x.length - 1,
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
          return Ne(f), De(
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
          L(!1), ae && J(H.current, !1);
        }
      }
    )
  ] });
  async function De(o, f) {
    const w = H.current, E = Math.max(0, x.indexOf(w ?? -1));
    try {
      const I = (await pe(o, f)).items.map((z) => z.id);
      fe(
        (z) => new Set([...z].filter((he) => I.includes(he)))
      );
      const G = qt(I, w, E);
      te(G), ce.current || J(G, !1);
    } catch {
    }
  }
  function tr() {
    fe(/* @__PURE__ */ new Set()), me.current.clear(), te(null);
  }
  function wt(o) {
    return m ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: j || P,
        "aria-label": `Review queue pagination ${o}`,
        children: /* @__PURE__ */ n(
          or,
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
              j || P || f.page === Number(M.page) || Kr(
                { ...M, page: f.page },
                m,
                Ee,
                pe,
                tr
              );
            }
          }
        )
      }
    ) : null;
  }
  function bt(o) {
    return /* @__PURE__ */ n(
      Vr,
      {
        video: o,
        annotation: Dr(o, m, ke.ids),
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
function Kr(e, t, r, i, a) {
  r(e), a(), i(t, e).catch(() => {
  });
}
function tt(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Vr({
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
  const y = e.files[0], s = Ht(e), u = /* @__PURE__ */ c(oe, { children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        "aria-label": a ? `Deselect ${s}` : `Select ${s}`,
        onClick: (g) => {
          g.stopPropagation(), b();
        },
        className: `dq-select ${a ? "selected" : ""}`,
        children: a && /* @__PURE__ */ n(gr, {})
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
        children: /* @__PURE__ */ n(mr, {})
      }
    ),
    /* @__PURE__ */ c("div", { className: "dq-badges", children: [
      y && /* @__PURE__ */ n("span", { children: sr(y.width, y.height) }),
      y != null && y.duration ? /* @__PURE__ */ n("span", { children: lr(y.duration) }) : null
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
        r === "wall" ? /* @__PURE__ */ c(Qr, { video: e, children: [
          u,
          /* @__PURE__ */ n("p", { className: "dq-wall-title", children: s })
        ] }) : /* @__PURE__ */ c("div", { className: "dq-poster", children: [
          /* @__PURE__ */ n("img", { src: Qt(e), alt: "" }),
          u
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
function Qr({
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
    return V(Tr(e.id), {
      signal: s.signal
    }).then((u) => {
      s.signal.aborted || y(u.available === !0);
    }).catch(() => {
      s.signal.aborted || y(!1);
    }), () => s.abort();
  }, [a, e.id]), ee(() => {
    const s = i.current;
    s && (l ? Promise.resolve(s.play()).catch(() => {
    }) : s.pause());
  }, [S, l]), /* @__PURE__ */ c("div", { ref: r, className: "dq-wall-media", children: [
    /* @__PURE__ */ n("img", { src: Qt(e), alt: "" }),
    S && /* @__PURE__ */ n(
      "video",
      {
        ref: i,
        src: xr(e.id),
        muted: !0,
        loop: !0,
        playsInline: !0,
        preload: "metadata"
      }
    ),
    t
  ] });
}
function Br({
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
  onPrevious: u,
  onNext: g,
  onClose: N,
  onAction: R,
  onOpen: C
}) {
  const O = U(null), $ = U(null), A = e.files[0], h = Ht(e);
  ee(() => {
    var T;
    const p = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (T = O.current) == null || T.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = p;
    };
  }, []);
  function q(p) {
    var L, ae, ne;
    if (p.key !== "Tab") return;
    const T = [
      ...((L = O.current) == null ? void 0 : L.querySelectorAll(
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
      const ae = [A == null ? void 0 : A.duration, L == null ? void 0 : L.duration].find(
        (se) => se != null && Number.isFinite(se) && se > 0
      ) ?? 0, ne = e.parentVideoId != null ? (e.clipEndSec ?? ae) - (e.clipStartSec ?? 0) : ae;
      Number.isFinite(ne) && ne > 0 && F.seekBy((p.key === "," ? -1 : 1) * ne * 0.1);
    } else if (p.key.toLowerCase() === "n" || p.key.toLowerCase() === "m")
      !p.repeat && !i && !a && (p.key.toLowerCase() === "n" && S && u(), p.key.toLowerCase() === "m" && y && g());
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
              onClick: u,
              children: /* @__PURE__ */ n(dr, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !y || i || a,
              onClick: g,
              children: /* @__PURE__ */ n(ur, {})
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
              onClick: C,
              "aria-label": "Open video details",
              children: /* @__PURE__ */ n(fr, {})
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
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: A ? /* @__PURE__ */ n(
          ar,
          {
            autostart: !0,
            streamUrl: Pr(e.id),
            posterUrl: Ot(e),
            format: A.format,
            audioCodec: A.audioCodec,
            duration: A.duration ?? 0,
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
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((p, T) => /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            disabled: i || a || !l,
            onClick: () => void R(p),
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
  onClose: l
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
  function R(h) {
    var p, T, F;
    if (h.defaultPrevented) {
      h.stopPropagation();
      return;
    }
    if (h.key === "Escape") {
      X(h), u || l();
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
  function C(h) {
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
  async function A(h) {
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
              disabled: u,
              onClick: l,
              children: /* @__PURE__ */ n(jt, {})
            }
          )
        ] }),
        y && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: y }),
        /* @__PURE__ */ n("fieldset", { disabled: u, className: "dq-manager-content", children: b ? /* @__PURE__ */ n(
          Hr,
          {
            draft: b,
            temporary: i,
            saving: u,
            setDraft: S,
            onSave: () => void O(),
            onCancel: l
          }
        ) : /* @__PURE__ */ c(oe, { children: [
          /* @__PURE__ */ c("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ c(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => C(),
                children: [
                  /* @__PURE__ */ n(pr, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ c("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(hr, {}),
              " Import reviews",
              /* @__PURE__ */ n(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: A
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((h) => /* @__PURE__ */ c("article", { children: [
            /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ n("strong", { children: h.name }),
              /* @__PURE__ */ n("p", { children: h.description || "No description" })
            ] }),
            /* @__PURE__ */ c("button", { type: "button", onClick: () => C(h), children: [
              /* @__PURE__ */ n(Lt, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => C({
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
function Hr({
  draft: e,
  temporary: t = !1,
  saving: r = !1,
  setDraft: i,
  onSave: a,
  onCancel: d
}) {
  const [l, b] = v("Review"), S = U(/* @__PURE__ */ new WeakMap()), y = (u) => {
    let g = S.current.get(u);
    return g || (g = crypto.randomUUID(), S.current.set(u, g)), g;
  }, s = (u, g) => i({
    ...e,
    actions: e.actions.map(
      (N, R) => R === u ? g : N
    )
  });
  return /* @__PURE__ */ c("div", { className: "dq-editor", children: [
    !t && /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      cr,
      {
        tabs: ["Review", "Queue", "Appearance", "Actions"].map((u) => ({
          key: u,
          label: u,
          count: u === "Actions" ? e.actions.length : void 0,
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
          children: /* @__PURE__ */ n(kt, { draft: e, onChange: i, presentation: !1 })
        }
      ),
      !t && /* @__PURE__ */ n(
        "section",
        {
          hidden: l !== "Appearance",
          className: "dq-editor-section",
          children: /* @__PURE__ */ n(kt, { draft: e, onChange: i, queue: !1 })
        }
      ),
      !t && /* @__PURE__ */ c("section", { hidden: l !== "Actions", className: "dq-editor-section", children: [
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
            renderItem: (u, { index: g, dragHandleProps: N, isOver: R }) => /* @__PURE__ */ c(
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
                  /* @__PURE__ */ c("div", { className: "dq-field-grid", children: [
                    /* @__PURE__ */ c("label", { children: [
                      "Shortcut",
                      /* @__PURE__ */ c(
                        "select",
                        {
                          value: u.shortcut ?? "auto",
                          onChange: (C) => s(g, {
                            ...u,
                            shortcut: C.target.value === "auto" ? void 0 : C.target.value
                          }),
                          children: [
                            /* @__PURE__ */ c("option", { value: "auto", children: [
                              "Position (",
                              g < 9 ? g + 1 : "none",
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
                          onChange: (C) => s(g, {
                            ...u,
                            label: C.target.value
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
                      onReorder: (C) => s(g, { ...u, steps: C }),
                      renderItem: (C, { index: O, dragHandleProps: $, isOver: A }) => /* @__PURE__ */ n(
                        Gr,
                        {
                          dragHandleProps: $,
                          saving: r,
                          isOver: A,
                          step: C,
                          index: O,
                          onChange: (h) => {
                            S.current.set(h, y(C)), s(g, {
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
                  /* @__PURE__ */ c("div", { className: "dq-row", children: [
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
                            (C, O) => O !== g
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
function Gr({
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
        children: /* @__PURE__ */ n(Jt, {})
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
      rt,
      {
        entityType: "tag",
        values: e.tagIds,
        onChange: (b) => d({ ...e, tagIds: b }),
        placeholder: "Choose tags",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: l, children: /* @__PURE__ */ n(Ft, {}) })
  ] });
}
async function Wr() {
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
function Mt({ label: e }) {
  return /* @__PURE__ */ c("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(Ut, { className: "dq-spin" }),
    e
  ] });
}
function $t({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ c("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(Dt, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const rn = { components: { DataQualityPage: zr } };
export {
  zr as DataQualityPage,
  rn as default
};
