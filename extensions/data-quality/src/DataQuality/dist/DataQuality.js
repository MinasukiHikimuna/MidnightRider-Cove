import { jsxs as d, jsx as n, Fragment as ne } from "react/jsx-runtime";
import { useState as y, useEffect as Z, useMemo as Et, useRef as j, useCallback as be } from "react";
import { VIDEO_SORT_OPTIONS as qt, FilterDialog as er, VIDEO_CRITERIA as tr, EntityReferenceMultiSelector as nt, VideoPlayer as rr, getResolutionLabel as nr, formatDuration as ir } from "@cove/runtime/components";
import { Pencil as Ut, Film as Rt, AlertTriangle as jt, Loader2 as Ft, ChevronLeft as or, ChevronRight as ar, ExternalLink as sr, X as Jt, Plus as lr, Upload as cr, Trash2 as _t, Check as dr, Play as ur } from "@cove/runtime/lucide-react";
import { extensionFetch as fr } from "@cove/runtime/api";
function Oe(e, t) {
  const r = e.shortcut ?? (t < 9 ? String(t + 1) : "");
  return /^[1-9]$/.test(r) ? r : "";
}
function et(e, t, r) {
  const i = [...e], a = t + r;
  return t < 0 || a < 0 || t >= e.length || a >= e.length || ([i[t], i[a]] = [i[a], i[t]]), i;
}
function it(e) {
  if (!e.name.trim() || !e.actions.every(lt))
    return "Name the review and complete every action step before saving.";
  if (new Set(e.actions.map((r) => r.id)).size !== e.actions.length)
    return "Action IDs must be unique within a review.";
  const t = e.actions.map(
    (r, i) => r.shortcut ?? (i < 9 ? String(i + 1) : "")
  ).filter(Boolean);
  return t.some((r) => !/^[1-9]$/.test(r)) || new Set(t).size !== t.length ? "Assign each shortcut 1–9 only once, or choose None. Navigation and player keys are reserved." : "";
}
function fe(e) {
  const t = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(100, t(e.perPage, 40)))
  };
}
function At(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function Je(e) {
  const { page: t, ...r } = e.view.filter;
  return JSON.stringify([
    r,
    e.view.objectFilter,
    e.view.searchMode
  ]);
}
function lt(e) {
  return !!e.label.trim() && e.steps.every(
    (t) => ["ADD", "REMOVE", "REMOVE_TREE"].includes(t.mode) && t.tagIds.length > 0 && t.tagIds.every((r) => Number.isSafeInteger(r) && r > 0)
  );
}
function Ie(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && r.view && typeof r.view == "object" && ["grid", "list", "wall", "tagger"].includes(r.view.displayMode) && typeof r.view.searchMode == "string" && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && pr(r.presentation) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && Array.isArray(i.steps) && i.steps.every((a) => a && Array.isArray(a.tagIds)) && lt(i)
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => it(r)))
    throw new Error(
      "Saved reviews contain invalid actions or shortcuts. Existing data has been kept; assign shortcuts 1–9 only once or leave them empty."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function pr(e) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e;
  return (t.cardSize === void 0 || t.cardSize === null || Number.isFinite(t.cardSize) && t.cardSize >= 115 && t.cardSize <= 380) && (t.annotations === void 0 || Array.isArray(t.annotations) && t.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [t.annotationParents, t.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((i) => Number.isSafeInteger(i) && i > 0)
  );
}
function ot(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const a of i)
      r.has(a.id) || (r.add(a.id), t.push(a));
  return t;
}
function Ot(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function hr(e, t, r, i) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!i && t.includes(r)) return r;
  const a = Math.max(0, e.indexOf(r));
  if (i) {
    for (const l of e.slice(a + 1))
      if (t.includes(l)) return l;
    if (t.includes(r)) {
      for (const l of e.slice(0, a).reverse())
        if (t.includes(l)) return l;
      return r;
    }
  }
  return t[Math.min(a, t.length - 1)];
}
function gr(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((a) => r.has(a));
  for (const a of t)
    i ? r.delete(a) : r.add(a);
  return r;
}
function mr(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
const zt = "ext:com.midnightrider.data-quality:configuration", vr = "ext:cove-data-quality:video-reviews", at = "ext:com.midnightrider.data-quality:progress", ke = /* @__PURE__ */ new Map(), _e = /* @__PURE__ */ new Map(), tt = (e, t) => e.includes("*") || e.includes(t), ze = (e) => V(`/api/savedfilters?mode=${encodeURIComponent(e)}`), wr = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function st(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function ye(e) {
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
    deletedIds: st(t.deletedIds),
    importedIds: st(t.importedIds)
  };
}
function br(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const a of t) {
    const l = localStorage.getItem(a);
    if (l !== null) {
      const s = Ie(l);
      r ?? (r = s), s.forEach((f) => i.add(f.id));
    }
    st(
      JSON.parse(localStorage.getItem(`${a}:account-imports`) ?? "[]")
    ).forEach((s) => i.add(s));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function Kt(e) {
  const t = await V("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Vt(e, t) {
  const r = (_e.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return _e.set(e, r), r.finally(() => {
    _e.get(e) === r && _e.delete(e);
  }).catch(() => {
  }), r;
}
let Ae = null;
function yr() {
  if (Ae) return Ae;
  const e = Sr();
  return Ae = e, e.finally(() => {
    Ae === e && (Ae = null);
  }).catch(() => {
  }), e;
}
async function Sr() {
  var N;
  const e = await V("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = tt(e.permissions, "savedfilters.read"), a = i && tt(e.permissions, "savedfilters.write"), l = i ? (await ze(zt)).filter((C) => C.name === "Data Quality configuration").sort((C, R) => C.id - R.id) : [];
  if (l.length > 1) {
    const C = (R) => {
      const { revision: D, ...M } = ye(R.uiOptions);
      return JSON.stringify(M);
    };
    if (l.some((R) => C(R) !== C(l[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (a)
      for (const R of l.slice(1))
        await V(`/api/savedfilters/${R.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${R.id}` })
        });
    l.splice(1);
  }
  let s = l.length ? ye(l[0].uiOptions) : wr();
  const f = localStorage.getItem(`${r}:migrated`) === "true", w = localStorage.getItem(r), c = localStorage.getItem(`${r}:local-only`) === "true";
  !l.length && w && (s = ye(w));
  let p = !l.length;
  if (l.length && c && w) {
    const C = ye(w);
    if (C.reviews.some((D) => {
      const M = s.reviews.find((L) => L.id === D.id);
      return M && JSON.stringify(M) !== JSON.stringify(D);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const R = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...C.deletedIds])
    ];
    s = {
      ...s,
      reviews: ot(s.reviews, C.reviews).filter(
        (D) => !R.includes(D.id)
      ),
      deletedIds: R,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...C.importedIds])
      ]
    }, p = !0;
  }
  if (!f) {
    const C = JSON.stringify(s), R = br(t);
    if (l.length && R.reviews.some((A) => {
      const g = s.reviews.find((E) => E.id === A.id);
      return g && JSON.stringify(g) !== JSON.stringify(A);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const D = i ? (await ze(vr)).flatMap(
      (A) => Ie(A.uiOptions ?? "[]")
    ) : [], M = R.known.filter(
      (A) => !R.reviews.some((g) => g.id === A)
    ), L = /* @__PURE__ */ new Set([...s.deletedIds, ...M]);
    s = {
      ...s,
      reviews: ot(
        R.reviews,
        s.reviews,
        D.filter(
          (A) => !R.known.includes(A.id) && !s.importedIds.includes(A.id)
        )
      ).filter((A) => !L.has(A.id)),
      deletedIds: [...L],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...R.known,
          ...D.map((A) => A.id)
        ])
      ]
    }, p || (p = JSON.stringify(s) !== C);
  }
  const b = {
    userId: t,
    recordId: (N = l[0]) == null ? void 0 : N.id,
    config: s,
    readable: i,
    writable: a,
    durable: a
  };
  if (ke.set(r, b), p && a) {
    const C = s;
    l.length && (b.config = ye(l[0].uiOptions)), await Qt(r, C), s = b.config;
  } else l.length || (localStorage.setItem(r, JSON.stringify(s)), !i && (!f || c) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (a)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: s.reviews,
    storageKey: r,
    canWrite: tt(e.permissions, "videos.write"),
    canConfigure: !i || a,
    storageNotice: i ? a ? "Reviews and progress are saved to your account." : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Qt(e, t) {
  const r = ke.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await Kt(r), r.recordId != null) {
      const l = await V(
        `/api/savedfilters/${r.recordId}`
      );
      if (ye(l.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const a = await V(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: zt,
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
function Nr(e, t) {
  return Ie(JSON.stringify(t)), Vt(e, async () => {
    const r = ke.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((a) => !t.some((l) => l.id === a.id)).map((a) => a.id);
    await Qt(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((a) => !t.some((l) => l.id === a))
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
async function Cr(e, t) {
  const r = ke.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), a = i ? It(i) : null;
  if (!r.readable) return a;
  const l = (await ze(at)).find(
    (f) => f.name === t
  ), s = l ? It(l.uiOptions) : null;
  return a && (!s || a.updatedAt > s.updatedAt) ? a : s;
}
function Er(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return Vt(i, async () => {
    const a = ke.get(e);
    if (!(a != null && a.writable)) return;
    await Kt(a);
    const l = (await ze(at)).find(
      (s) => s.name === t
    );
    await V(
      l ? `/api/savedfilters/${l.id}` : "/api/savedfilters",
      {
        method: l ? "PUT" : "POST",
        body: JSON.stringify({
          mode: at,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const qr = {
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
function Ke(e) {
  return Array.isArray(e) ? e.map(Ke) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? qr[r] ?? r : Ke(r)
    ])
  ) : e;
}
async function V(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await fr(e, { ...t, headers: r });
  if (!i.ok) {
    let l = i.statusText || `Request failed (${i.status}).`;
    try {
      const s = await i.json();
      l = s.message || s.detail || l;
    } catch {
    }
    throw new Error(l);
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
      Ke({
        findFilter: fe(t),
        objectFilter: i,
        filterExpression: a
      })
    )
  });
}
function Bt(e) {
  return `/api/videos/${e.id}/image?max=640&v=${encodeURIComponent(e.updatedAt)}`;
}
function Rr(e) {
  return `/api/stream/video/${e}`;
}
function Pt(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Ar(e) {
  return `/api/stream/video/${e}/preview`;
}
function Or(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Ir(e) {
  return e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Ht(e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e) {
    await V(`/api/tags/${r}`), t.add(r);
    for (let i = 1; ; i++) {
      const a = await V("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          Ke({
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
      for (const l of a.items) t.add(l.id);
      if (i * 1e3 >= a.totalCount) break;
      if (!a.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...t];
}
async function kr(e, t) {
  if (!lt(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  const r = await Promise.all(
    e.steps.map(async (i) => ({
      mode: i.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: i.mode === "REMOVE_TREE" ? await Ht(i.tagIds) : i.tagIds
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
function Pr(e) {
  var s, f;
  const [t, r] = y({}), [i, a] = y(""), l = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...((s = e == null ? void 0 : e.presentation) == null ? void 0 : s.annotationParents) ?? [],
      ...((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.binParents) ?? []
    ])
  ]);
  return Z(() => {
    let w = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(l).map(
        async (c) => [c, await Ht([c])]
      )
    ).then((c) => {
      w && r(Object.fromEntries(c));
    }).catch(() => {
      w && a(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      w = !1;
    };
  }, [l]), { ids: t, error: i };
}
function xr(e, t, r) {
  const i = t == null ? void 0 : t.presentation, a = (i == null ? void 0 : i.annotations) ?? ["date", "studio", "performers"], l = (i == null ? void 0 : i.annotationParents) ?? [];
  return [
    a.includes("date") && e.date,
    a.includes("studio") && e.studioName,
    a.includes("performers") && e.performers.map((s) => s.name).join(", "),
    a.includes("tags") && (e.tags ?? []).filter(
      (s) => !l.length || l.some(
        (f) => {
          var w;
          return f !== s.id && ((w = r[f]) == null ? void 0 : w.includes(s.id));
        }
      )
    ).map((s) => s.name).join(", ")
  ].filter(Boolean).join(" · ");
}
function Mr({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: a
}) {
  var f, w, c;
  const l = new Set(
    (((f = t.presentation) == null ? void 0 : f.binParents) ?? []).flatMap(
      (p) => (r[p] ?? []).filter((b) => b !== p)
    )
  ), s = /* @__PURE__ */ new Map();
  for (const p of e)
    for (const b of p.tags ?? [])
      if (l.has(b.id)) {
        const N = s.get(b.id) ?? { name: b.name, count: 0 };
        N.count++, s.set(b.id, N);
      }
  return (c = (w = t.presentation) == null ? void 0 : w.binParents) != null && c.length ? /* @__PURE__ */ d("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...s].sort((p, b) => p[1].name.localeCompare(b[1].name)).map(([p, b]) => /* @__PURE__ */ d(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => a(p),
        children: [
          b.name,
          " (",
          b.count,
          ")"
        ]
      },
      p
    )),
    !s.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function Tr(e, t) {
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
function $r({
  draft: e,
  onChange: t,
  presentation: r = !0
}) {
  const [i, a] = y(!1), l = e.view.filter, s = (c) => t({
    ...e,
    view: { ...e.view, filter: { ...l, ...c } }
  }), f = e.presentation ?? {}, w = (c) => t({ ...e, presentation: { ...f, ...c } });
  return /* @__PURE__ */ d("fieldset", { children: [
    /* @__PURE__ */ n("legend", { children: "Queue" }),
    /* @__PURE__ */ d("label", { children: [
      "Search",
      /* @__PURE__ */ n(
        "input",
        {
          value: String(l.q ?? ""),
          onChange: (c) => s({ q: c.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ d("label", { children: [
      "Sort",
      /* @__PURE__ */ d(
        "select",
        {
          "aria-label": "Sort",
          value: String(l.sort ?? "date"),
          onChange: (c) => s({ sort: c.target.value, sorts: void 0 }),
          children: [
            !qt.some((c) => c.value === l.sort) && l.sort != null && /* @__PURE__ */ n("option", { value: String(l.sort), children: String(l.sort) }),
            qt.map((c) => /* @__PURE__ */ n("option", { value: c.value, children: c.label }, c.value))
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
          onChange: (c) => s({ direction: c.target.value }),
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
          onChange: (c) => s({
            perPage: Math.max(1, Math.min(100, Number(c.target.value) || 40))
          })
        }
      )
    ] }),
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-button",
        onClick: () => a(!0),
        children: "Edit video filters"
      }
    ),
    /* @__PURE__ */ d("p", { children: [
      Object.keys(e.view.objectFilter).length ? "Video filters configured" : "No video filters",
      ". Existing search and filter settings are preserved until you change them."
    ] }),
    i && /* @__PURE__ */ n("div", { onKeyDown: (c) => c.stopPropagation(), children: /* @__PURE__ */ n(
      er,
      {
        open: !0,
        onClose: () => a(!1),
        criteria: tr,
        activeFilter: e.view.objectFilter,
        supportsFilterExpressions: !0,
        subjectLabel: "videos",
        onApply: (c) => {
          t({ ...e, view: { ...e.view, objectFilter: c } }), a(!1);
        }
      }
    ) }),
    r && /* @__PURE__ */ d(ne, { children: [
      /* @__PURE__ */ n("h3", { children: "Presentation" }),
      /* @__PURE__ */ d("label", { children: [
        "Preferred view",
        /* @__PURE__ */ n(
          "select",
          {
            value: e.view.displayMode === "tagger" ? "grid" : e.view.displayMode,
            onChange: (c) => t({
              ...e,
              view: {
                ...e.view,
                displayMode: c.target.value
              }
            }),
            children: ["grid", "list", "wall"].map((c) => /* @__PURE__ */ n("option", { children: c }, c))
          }
        )
      ] }),
      /* @__PURE__ */ d("label", { children: [
        "Preferred card width",
        /* @__PURE__ */ d(
          "select",
          {
            value: f.cardSize ?? "auto",
            onChange: (c) => w({
              cardSize: c.target.value === "auto" ? null : Number(c.target.value)
            }),
            children: [
              /* @__PURE__ */ n("option", { value: "auto", children: "Auto fit" }),
              [130, 180, 260, 380].map((c) => /* @__PURE__ */ d("option", { value: c, children: [
                c,
                " px"
              ] }, c))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ n("h4", { children: "Card annotations" }),
      ["date", "studio", "performers", "tags"].map((c) => {
        const p = f.annotations ?? [
          "date",
          "studio",
          "performers"
        ];
        return /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: p.includes(c),
              onChange: (b) => w({
                annotations: b.target.checked ? [...p, c] : p.filter((N) => N !== c)
              })
            }
          ),
          c
        ] }, c);
      }),
      /* @__PURE__ */ n("p", { children: "Show annotated tags only below these parents (empty means all tags)." }),
      /* @__PURE__ */ n(
        nt,
        {
          entityType: "tag",
          values: f.annotationParents ?? [],
          onChange: (c) => w({ annotationParents: c }),
          allowCreate: !1
        }
      ),
      /* @__PURE__ */ n("h4", { children: "Tag bins" }),
      /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
      /* @__PURE__ */ n(
        nt,
        {
          entityType: "tag",
          values: f.binParents ?? [],
          onChange: (c) => w({ binParents: c }),
          allowCreate: !1
        }
      )
    ] })
  ] });
}
function xt(e) {
  return e.view.displayMode === "wall" || e.view.displayMode === "list" ? e.view.displayMode : "grid";
}
function Dr() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Mt(e) {
  const t = new URLSearchParams(window.location.search);
  e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function Lr(e) {
  return fe({ ...e, page: 1 });
}
function ct(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function K(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
function Ur({
  onNavigate: e
}) {
  const [t, r] = y([]), [i] = y(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [a, l] = y(""), [s, f] = y(!0), [w, c] = y(""), [p, b] = y(!1), [N, C] = y(!0), [R, D] = y(""), [M, L] = y(""), [A, g] = y(!1), [E, k] = y(!1), [h, O] = y(Dr), [T, ie] = y(!1), [Se, Ne] = y(!1), [Pe, dt] = y(!1), [Q, Ce] = y(
    null
  ), J = t.find((o) => o.id === h) ?? null, m = Et(
    () => (Q == null ? void 0 : Q.id) === h && J ? { ...J, view: Q.view } : J,
    [Q, h, J]
  ), xe = Pr(m), [I, pe] = y({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [X, ut] = y({ items: [], totalCount: 0 }), [P, Me] = y(!1), [re, ft] = y(""), [oe, de] = y(() => /* @__PURE__ */ new Set()), Ve = j(oe);
  Ve.current = oe;
  const he = j(/* @__PURE__ */ new Map()), [B, ee] = y(null), H = j(B);
  H.current = B;
  const [te, ge] = y(!1), ae = j(te);
  ae.current = te;
  const pt = j(null), [se, Qe] = y("grid"), [me, Te] = y(null), [U, Be] = y(!1), $e = j(!1), [Gt, He] = y(""), [ht, ve] = y(""), [Ge, Ee] = y(""), We = j(/* @__PURE__ */ new Map()), gt = j(null), we = j(0), De = j(0), Le = j(null), mt = be(async () => {
    f(!0), c("");
    try {
      const o = await yr();
      r(o.reviews), l(o.storageKey), b(o.canWrite), C(o.canConfigure ?? !0), D(o.storageNotice ?? ""), h && !o.reviews.some((u) => u.id === h) && (O(""), Mt(""));
    } catch (o) {
      c(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      f(!1);
    }
  }, [h]);
  Z(() => {
    mt();
  }, []);
  const le = be(
    async (o, u) => {
      var $;
      const v = ++we.current;
      ($ = Le.current) == null || $.abort();
      const S = new AbortController();
      Le.current = S, u = fe(u), pe(u), Me(!0), ft("");
      try {
        let q = await kt(
          o,
          u,
          S.signal
        );
        const G = Math.max(
          1,
          Math.ceil(q.totalCount / Number(u.perPage))
        );
        return Number(u.page) > G && (u = { ...u, page: G }, q = await kt(
          o,
          u,
          S.signal
        )), v === we.current && (ut(q), pe(u)), q;
      } catch (q) {
        throw v === we.current && ft(
          q instanceof Error ? q.message : "Could not load the review queue."
        ), q;
      } finally {
        v === we.current && Me(!1);
      }
    },
    []
  );
  Z(() => {
    var u;
    if (De.current += 1, we.current += 1, (u = Le.current) == null || u.abort(), k(!1), L(""), g(!1), de(/* @__PURE__ */ new Set()), he.current.clear(), ee(null), ge(!1), Be(!1), $e.current = !1, He(""), ve(""), Ee(""), ut({ items: [], totalCount: 0 }), !m) {
      Me(!1);
      return;
    }
    let o = !0;
    return Me(!0), (async () => {
      var q;
      let v = null;
      try {
        v = await Cr(a, m.id);
      } catch (G) {
        o && (g(!0), L(
          G instanceof Error ? G.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const S = (v == null ? void 0 : v.signature) === Je(m) ? v : null, $ = S ? fe(S.filter) : Lr(m.view.filter);
      pe($), Qe((S == null ? void 0 : S.displayMode) ?? xt(m)), Te(
        S ? S.cardSize : ((q = m.presentation) == null ? void 0 : q.cardSize) ?? null
      );
      try {
        const G = await le(m, $);
        if (!o) return;
        const _ = At(
          G.items.map((ue) => ue.id),
          (S == null ? void 0 : S.focusedId) ?? null,
          (S == null ? void 0 : S.index) ?? 0
        );
        ee(_), F(_), v && !S ? ve(
          "The saved queue changed. Review resumed at its first page."
        ) : S && ve(
          "Review resumed. If results changed, focus uses the saved video on this page or the nearest position. Selection starts empty."
        );
      } catch {
      }
      o && k(!0);
    })(), () => {
      var v;
      o = !1, De.current++, we.current++, (v = Le.current) == null || v.abort();
    };
  }, [m == null ? void 0 : m.id]);
  const x = Et(
    () => X.items.map((o) => o.id),
    [X.items]
  );
  Z(() => {
    if (!E || !m || !a || P || re || U || (Q == null ? void 0 : Q.id) === m.id || A)
      return;
    const o = {
      version: 1,
      signature: Je(m),
      filter: I,
      focusedId: B,
      index: Math.max(0, x.indexOf(B ?? -1)),
      displayMode: se,
      cardSize: me,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        a + ":progress:" + m.id,
        JSON.stringify(o)
      );
    } catch {
    }
    if (M) return;
    let u = !0;
    const v = window.setTimeout(() => {
      Er(a, m.id, o).catch((S) => {
        u && L(
          "Progress is kept in this browser, but account sync failed. " + (S instanceof Error ? S.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      u = !1, window.clearTimeout(v);
    };
  }, [
    E,
    a,
    m,
    P,
    re,
    U,
    I,
    B,
    x,
    se,
    me,
    Q,
    M,
    A
  ]);
  const vt = Math.max(
    1,
    Math.ceil(X.totalCount / Math.max(1, Number(I.perPage) || 40))
  ), qe = X.items.find((o) => o.id === B) ?? null;
  te && qe && (pt.current = qe);
  const ce = qe ?? (te ? pt.current : null), Wt = Ot(oe, B), wt = oe.size > 0 ? `${oe.size} selected video${oe.size === 1 ? "" : "s"}` : B == null ? "no video" : "focused video", F = be((o, u = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const v = We.current.get(o);
      v == null || v.focus({ preventScroll: !0 }), u && (v == null || v.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  Z(() => {
    E && !ae.current && F(H.current);
  }, [E, F]), Z(() => {
    P || !x.length || (H.current == null || !x.includes(H.current)) && (ee(x[0]), ae.current || F(x[0]));
  }, [F, x, P]);
  const Re = be(
    (o) => {
      de((u) => {
        const v = o(u);
        for (const S of /* @__PURE__ */ new Set([...u, ...v]))
          u.has(S) !== v.has(S) && he.current.set(
            S,
            (he.current.get(S) ?? 0) + 1
          );
        return v;
      });
    },
    []
  ), Ue = be(
    (o) => {
      if (!x.length) return;
      const u = Math.max(
        0,
        x.indexOf(H.current ?? x[0])
      ), v = x[Math.max(0, Math.min(x.length - 1, u + o))];
      ee(v), ae.current || F(v);
    },
    [F, x]
  ), Xe = be(
    async (o) => {
      const u = Ot(
        Ve.current,
        H.current
      );
      if (!m || $e.current || P || re || !p || !u.length)
        return;
      const v = ++De.current, S = m.id, $ = [...x], q = H.current, G = new Map(
        u.map((z) => [z, he.current.get(z) ?? 0])
      ), _ = () => v === De.current && m.id === S;
      $e.current = !0, Be(!0), He(
        Ve.current.size ? `${u.length} selected videos` : "the focused video"
      ), ve(""), Ee("");
      let ue = !1;
      try {
        if (await kr(o, u), ue = !0, !_()) return;
        de((z) => {
          const W = new Set(z);
          for (const Y of u)
            (he.current.get(Y) ?? 0) === G.get(Y) && W.delete(Y);
          return W;
        }), ve(
          `${o.label}: ${u.length} video${u.length === 1 ? "" : "s"} ${o.steps.length ? "updated" : "skipped"}.`
        );
      } catch (z) {
        if (!_()) return;
        Ee(
          z instanceof Error ? z.message : "Action failed."
        );
      }
      try {
        if (await Ir(o), !_()) return;
        const z = await le(m, I);
        if (!_()) return;
        let W = z.items.map((Y) => Y.id);
        if (!W.length && z.totalCount > 0 && Number(I.page) > 1) {
          const Y = Math.max(1, Number(I.page) - 1), Fe = { ...I, page: Y };
          pe(Fe), W = (await le(m, Fe)).items.map((Ze) => Ze.id), de(
            (Ze) => new Set([...Ze].filter((Zt) => W.includes(Zt)))
          );
          const Ct = W.at(-1) ?? null;
          ee(Ct), ae.current || F(Ct);
        } else {
          de(
            (Fe) => new Set([...Fe].filter((Nt) => W.includes(Nt)))
          );
          const Y = hr(
            $,
            W,
            q,
            ue && u.includes(q ?? -1)
          );
          ee(Y), ae.current && Y == null && ge(!1), ae.current || F(Y);
        }
      } catch (z) {
        _() && Ee(
          (W) => `${W ? `${W} ` : ""}${ue ? "The action completed, but " : ""}the queue could not be refreshed. ${z instanceof Error ? z.message : "Refresh failed."}`
        );
      } finally {
        _() && ($e.current = !1, Be(!1), He(""));
      }
    },
    [
      p,
      le,
      I,
      F,
      x,
      P,
      re,
      m
    ]
  );
  function Xt() {
    var v;
    const o = (v = gt.current) == null ? void 0 : v.firstElementChild, u = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, u.split(" ").filter(Boolean).length);
  }
  function Yt(o) {
    if (o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || T || Pe) return;
    if (te && o.key === "Escape") {
      K(o), ge(!1), F(H.current);
      return;
    }
    if (!mr(o.target)) return;
    if (o.key === "Escape") {
      K(o), Re(() => /* @__PURE__ */ new Set());
      return;
    }
    const u = (m == null ? void 0 : m.actions.findIndex(
      ($, q) => Oe($, q) === o.key
    )) ?? -1;
    if (u >= 0 && (m != null && m.actions[u])) {
      K(o), !U && !P && Xe(m.actions[u]);
      return;
    }
    if (!te && o.key === " ") {
      K(o), B != null && Re(($) => rt($, B));
      return;
    }
    if (!te && o.key.toLowerCase() === "a") {
      K(o), Re(
        ($) => gr($, x)
      );
      return;
    }
    if (U || P) return;
    if (te) {
      (o.key === "ArrowLeft" || o.key === "ArrowRight") && (K(o), Ue(o.key === "ArrowLeft" ? -1 : 1));
      return;
    }
    if (o.key === "Enter" && B != null) {
      K(o), ge(!0);
      return;
    }
    const v = Xt(), S = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -v : o.key === "ArrowDown" ? v : 0;
    S && (K(o), Ue(S));
  }
  function Ye(o) {
    O(o), Mt(o);
  }
  async function bt(o) {
    var v, S, $;
    if (!a) return !1;
    try {
      await Nr(a, o);
    } catch (q) {
      throw q;
    }
    r(o), h && !o.some((q) => q.id === h) && Ye("");
    const u = o.find((q) => q.id === h);
    return u && J && JSON.stringify(u) !== JSON.stringify(J) && (u.view.displayMode !== J.view.displayMode && Qe(xt(u)), ((v = u.presentation) == null ? void 0 : v.cardSize) !== ((S = J.presentation) == null ? void 0 : S.cardSize) && Te((($ = u.presentation) == null ? void 0 : $.cardSize) ?? null), Je(u) !== Je(J) && (Ce(null), je(
      u,
      fe({ ...u.view.filter, page: I.page })
    ))), !0;
  }
  if (s)
    return /* @__PURE__ */ n(Dt, { label: "Loading Data Quality reviews…" });
  if (w)
    return /* @__PURE__ */ d(ne, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Kr().catch(
            (o) => c(
              "Could not export browser reviews. " + (o instanceof Error ? o.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        Lt,
        {
          message: w,
          onRetry: () => void mt()
        }
      )
    ] });
  return /* @__PURE__ */ d("div", { className: "data-quality-page", onKeyDown: Yt, children: [
    /* @__PURE__ */ d("header", { className: "data-quality-header", children: [
      /* @__PURE__ */ d("div", { children: [
        /* @__PURE__ */ n("h1", { children: "Data Quality" }),
        /* @__PURE__ */ n("p", { children: "A focused queue for previewing videos and applying saved review actions." })
      ] }),
      /* @__PURE__ */ d("label", { children: [
        "Review",
        /* @__PURE__ */ d(
          "select",
          {
            value: (m == null ? void 0 : m.id) ?? "",
            disabled: U,
            onChange: (o) => Ye(o.target.value),
            children: [
              /* @__PURE__ */ n("option", { value: "", children: "Choose a review…" }),
              t.map((o) => /* @__PURE__ */ n("option", { value: o.id, children: o.name }, o.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ d(
        "button",
        {
          className: "dq-button",
          type: "button",
          disabled: U || P || !N,
          onClick: () => {
            Ne(!1), ie(!0);
          },
          children: [
            /* @__PURE__ */ n(Ut, {}),
            " Manage reviews"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ n("p", { className: "dq-status", children: R }),
    i && /* @__PURE__ */ d("details", { children: [
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
            ), v = document.createElement("a");
            v.href = u, v.download = "data-quality-unassigned-legacy-reviews.json", v.click(), URL.revokeObjectURL(u);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    M && /* @__PURE__ */ d("p", { role: "alert", children: [
      M,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            L(""), g(!1);
          },
          children: A ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    m ? /* @__PURE__ */ d(ne, { children: [
      /* @__PURE__ */ d("section", { className: "dq-toolbar", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: U || P || !N,
            onClick: () => {
              Ne(!0), ie(!0);
            },
            children: "Edit review"
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: U || P,
            onClick: () => dt(!0),
            children: "Adjust queue"
          }
        ),
        (Q == null ? void 0 : Q.id) === h && /* @__PURE__ */ d(ne, { children: [
          /* @__PURE__ */ n("span", { children: "Temporary queue" }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: U || P || !N,
              onClick: () => {
                J && bt(
                  t.map(
                    (o) => o.id === h ? {
                      ...o,
                      view: {
                        ...m.view,
                        filter: { ...I, page: 1 }
                      }
                    } : o
                  )
                ).then(() => {
                  Ce(null), ve("Queue saved to this review.");
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
              disabled: U || P,
              onClick: () => {
                Ce(null), J && je(
                  J,
                  fe({
                    ...J.view.filter,
                    page: I.page
                  })
                );
              },
              children: "Reset to saved queue"
            }
          )
        ] }),
        /* @__PURE__ */ d("div", { className: "dq-review-title", children: [
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
                "aria-pressed": se === o,
                onClick: () => Qe(o),
                children: o
              },
              o
            ))
          }
        ),
        se !== "list" && /* @__PURE__ */ d(ne, { children: [
          /* @__PURE__ */ d("label", { className: "dq-card-size", children: [
            "Card width",
            /* @__PURE__ */ n(
              "input",
              {
                "aria-label": "Review card size",
                type: "range",
                min: "115",
                max: "380",
                step: "5",
                value: me ?? (se === "wall" ? 130 : 180),
                onChange: (o) => Te(Number(o.target.value))
              }
            )
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              className: `dq-button ${me == null ? "active" : ""}`,
              type: "button",
              onClick: () => Te(null),
              children: "Auto fit"
            }
          )
        ] }),
        /* @__PURE__ */ d("span", { children: [
          X.totalCount.toLocaleString(),
          " matching"
        ] }),
        /* @__PURE__ */ n(
          "button",
          {
            className: "dq-button",
            type: "button",
            disabled: Number(I.page) <= 1 || U || P,
            onClick: () => Tt(
              { ...I, page: Number(I.page) - 1 },
              m,
              pe,
              le,
              yt
            ),
            children: "Prev"
          }
        ),
        /* @__PURE__ */ d("span", { children: [
          Number(I.page) || 1,
          " / ",
          vt
        ] }),
        /* @__PURE__ */ n(
          "button",
          {
            className: "dq-button",
            type: "button",
            disabled: Number(I.page) >= vt || U || P,
            onClick: () => Tt(
              { ...I, page: Number(I.page) + 1 },
              m,
              pe,
              le,
              yt
            ),
            children: "Next"
          }
        )
      ] }),
      xe.error && /* @__PURE__ */ n("p", { role: "alert", children: xe.error }),
      /* @__PURE__ */ n(
        Mr,
        {
          videos: X.items,
          review: m,
          trees: xe.ids,
          disabled: U || P,
          onChoose: (o) => {
            const u = Tr(m, o);
            Ce(u), je(u, { ...I, page: 1 });
          }
        }
      ),
      Ge && !te && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(jt, {}),
        Ge
      ] }),
      ht && /* @__PURE__ */ n("p", { role: "status", className: "dq-status", children: ht }),
      /* @__PURE__ */ d("div", { className: "dq-workspace", children: [
        /* @__PURE__ */ d("main", { children: [
          P && !X.items.length && /* @__PURE__ */ n(Dt, { label: "Loading review queue…" }),
          re && !P && /* @__PURE__ */ n(
            Lt,
            {
              message: re,
              onRetry: () => void le(m, I).catch(() => {
              })
            }
          ),
          !P && !re && !X.items.length && /* @__PURE__ */ d("div", { className: "dq-empty", children: [
            /* @__PURE__ */ n(Rt, {}),
            /* @__PURE__ */ n("p", { children: "No videos match this review." })
          ] }),
          !!X.items.length && /* @__PURE__ */ n("div", { ref: gt, children: se === "list" ? /* @__PURE__ */ n("div", { className: "dq-list", "data-review-layout": "list", children: X.items.map(St) }) : /* @__PURE__ */ n(
            "div",
            {
              className: "dq-grid",
              style: {
                "--dq-card-width": me == null ? se === "wall" ? "clamp(115px, 10vw, 150px)" : "clamp(145px, 14vw, 180px)" : `${me}px`
              },
              children: X.items.map(St)
            }
          ) })
        ] }),
        /* @__PURE__ */ d("aside", { className: "dq-actions", children: [
          /* @__PURE__ */ n("strong", { children: wt }),
          /* @__PURE__ */ d("p", { children: [
            "Focus: ",
            qe ? ct(qe) : "none"
          ] }),
          m.actions.map((o, u) => /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              disabled: U || P || !!re || !p || !Wt.length,
              onClick: () => void Xe(o),
              children: [
                Oe(o, u) && /* @__PURE__ */ n("kbd", { children: Oe(o, u) }),
                /* @__PURE__ */ n("span", { children: o.label }),
                /* @__PURE__ */ n("small", { children: o.steps.length ? `${o.steps.length} step(s)` : "Skip" })
              ]
            },
            o.id
          )),
          !m.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
          !p && /* @__PURE__ */ n("p", { children: "Video write permission is required to apply actions." }),
          U && /* @__PURE__ */ d("p", { role: "status", children: [
            /* @__PURE__ */ n(Ft, { className: "dq-spin" }),
            " Applying action to",
            " ",
            Gt,
            "…"
          ] }),
          /* @__PURE__ */ n("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ d("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(Rt, {}),
      /* @__PURE__ */ n("p", { children: t.length ? "Choose a saved review to open its queue." : "No saved reviews are available in this browser." })
    ] }),
    te && ce && m && /* @__PURE__ */ n(
      Jr,
      {
        video: ce,
        review: m,
        targetLabel: wt,
        pending: U,
        refreshing: P || !!re,
        error: Ge,
        canWrite: p,
        selected: oe.has(ce.id),
        hasPrevious: x.indexOf(ce.id) > 0,
        hasNext: x.indexOf(ce.id) >= 0 && x.indexOf(ce.id) < x.length - 1,
        onToggleSelected: () => Re((o) => rt(o, ce.id)),
        onPrevious: () => Ue(-1),
        onNext: () => Ue(1),
        onClose: () => {
          ge(!1), F(H.current);
        },
        onAction: Xe,
        onOpen: () => e({ page: "video", id: ce.id })
      }
    ),
    Pe && m && /* @__PURE__ */ n(
      $t,
      {
        reviews: t,
        activeReview: { ...m, view: { ...m.view, filter: I } },
        initialEdit: !0,
        temporary: !0,
        onSave: (o) => {
          const u = o.find((v) => v.id === h);
          return Ce(u), je(
            u,
            fe({ ...u.view.filter, page: I.page })
          ), !0;
        },
        onChoose: () => {
        },
        onClose: () => {
          dt(!1), F(H.current, !1);
        }
      }
    ),
    T && /* @__PURE__ */ n(
      $t,
      {
        reviews: t,
        activeReview: J,
        initialEdit: Se,
        onSave: bt,
        onChoose: Ye,
        onClose: () => {
          ie(!1), Se && F(H.current, !1);
        }
      }
    )
  ] });
  async function je(o, u) {
    const v = H.current, S = Math.max(0, x.indexOf(v ?? -1));
    try {
      const q = (await le(o, u)).items.map((_) => _.id);
      de(
        (_) => new Set([..._].filter((ue) => q.includes(ue)))
      );
      const G = At(q, v, S);
      ee(G), ae.current || F(G, !1);
    } catch {
    }
  }
  function yt() {
    de(/* @__PURE__ */ new Set()), he.current.clear(), ee(null);
  }
  function St(o) {
    return /* @__PURE__ */ n(
      jr,
      {
        video: o,
        annotation: xr(o, m, xe.ids),
        displayMode: se,
        focused: o.id === B,
        selected: oe.has(o.id),
        setRef: (u) => {
          u ? We.current.set(o.id, u) : We.current.delete(o.id);
        },
        onFocus: () => ee(o.id),
        onToggle: () => Re((u) => rt(u, o.id)),
        onPreview: () => {
          ee(o.id), ge(!0);
        }
      },
      o.id
    );
  }
}
function Tt(e, t, r, i, a) {
  r(e), a(), i(t, e).catch(() => {
  });
}
function rt(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function jr({
  video: e,
  annotation: t,
  displayMode: r,
  focused: i,
  selected: a,
  setRef: l,
  onFocus: s,
  onToggle: f,
  onPreview: w
}) {
  const c = e.files[0], p = ct(e), b = /* @__PURE__ */ d(ne, { children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        "aria-label": a ? `Deselect ${p}` : `Select ${p}`,
        onClick: (N) => {
          N.stopPropagation(), f();
        },
        className: `dq-select ${a ? "selected" : ""}`,
        children: a && /* @__PURE__ */ n(dr, {})
      }
    ),
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        "aria-label": `Preview ${p}`,
        onClick: (N) => {
          N.stopPropagation(), w();
        },
        className: "dq-preview-button",
        children: /* @__PURE__ */ n(ur, {})
      }
    ),
    /* @__PURE__ */ d("div", { className: "dq-badges", children: [
      c && /* @__PURE__ */ n("span", { children: nr(c.width, c.height) }),
      c != null && c.duration ? /* @__PURE__ */ n("span", { children: ir(c.duration) }) : null
    ] })
  ] });
  return /* @__PURE__ */ d(
    "article",
    {
      ref: l,
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${p}${a ? ", selected" : ""}`,
      onFocus: s,
      onClick: (N) => {
        s(), N.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-card ${r} ${i ? "focused" : ""} ${a ? "selected" : ""}`,
      children: [
        r === "wall" ? /* @__PURE__ */ d(Fr, { video: e, children: [
          b,
          /* @__PURE__ */ n("p", { className: "dq-wall-title", children: p })
        ] }) : /* @__PURE__ */ d("div", { className: "dq-poster", children: [
          /* @__PURE__ */ n("img", { src: Bt(e), alt: "" }),
          b
        ] }),
        (r !== "wall" || t) && /* @__PURE__ */ d("div", { className: "dq-card-copy", children: [
          /* @__PURE__ */ n("strong", { children: p }),
          /* @__PURE__ */ d("small", { children: [
            t,
            " "
          ] })
        ] })
      ]
    }
  );
}
function Fr({
  video: e,
  children: t
}) {
  const r = j(null), i = j(null), [a, l] = y(!1), [s, f] = y(!1), [w, c] = y(!1);
  return Z(() => {
    const p = r.current;
    if (!p || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      l(!0), f(!0);
      return;
    }
    const b = new IntersectionObserver(
      ([C]) => l(C.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), N = new IntersectionObserver(
      ([C]) => f(C.isIntersecting && C.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return b.observe(p), N.observe(p), () => {
      b.disconnect(), N.disconnect();
    };
  }, [e.id, e.files.length]), Z(() => {
    if (!a) {
      c(!1);
      return;
    }
    const p = new AbortController();
    return V(Or(e.id), {
      signal: p.signal
    }).then((b) => {
      p.signal.aborted || c(b.available === !0);
    }).catch(() => {
      p.signal.aborted || c(!1);
    }), () => p.abort();
  }, [a, e.id]), Z(() => {
    const p = i.current;
    p && (s ? Promise.resolve(p.play()).catch(() => {
    }) : p.pause());
  }, [w, s]), /* @__PURE__ */ d("div", { ref: r, className: "dq-wall-media", children: [
    /* @__PURE__ */ n("img", { src: Bt(e), alt: "" }),
    w && /* @__PURE__ */ n(
      "video",
      {
        ref: i,
        src: Ar(e.id),
        muted: !0,
        loop: !0,
        playsInline: !0,
        preload: "metadata"
      }
    ),
    t
  ] });
}
function Jr({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: a,
  error: l,
  canWrite: s,
  selected: f,
  hasPrevious: w,
  hasNext: c,
  onToggleSelected: p,
  onPrevious: b,
  onNext: N,
  onClose: C,
  onAction: R,
  onOpen: D
}) {
  const M = j(null), L = j(null), A = e.files[0], g = ct(e);
  Z(() => {
    var O;
    const h = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (O = M.current) == null || O.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = h;
    };
  }, []);
  function E(h) {
    var ie, Se, Ne;
    if (h.key !== "Tab") return;
    const O = [
      ...((ie = M.current) == null ? void 0 : ie.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((Pe) => Pe.offsetParent !== null);
    if (!O.length) {
      h.preventDefault(), (Se = M.current) == null || Se.focus();
      return;
    }
    const T = O.indexOf(
      document.activeElement
    );
    h.shiftKey && T <= 0 ? (h.preventDefault(), (Ne = O.at(-1)) == null || Ne.focus()) : !h.shiftKey && T === O.length - 1 && (h.preventDefault(), O[0].focus());
  }
  function k(h) {
    if (h.defaultPrevented || h.ctrlKey || h.altKey || h.metaKey || h.target.closest("button, input, select, textarea"))
      return;
    const O = L.current, T = h.currentTarget.querySelector("video");
    if (h.key === " " && O) O.toggle();
    else if ((h.key === "ArrowLeft" || h.key === "ArrowRight") && O)
      O.seekBy(
        (h.key === "ArrowLeft" ? -1 : 1) * (h.shiftKey ? 10 : 5)
      );
    else if (h.key === "ArrowUp" && T)
      T.volume = Math.min(1, T.volume + 0.1);
    else if (h.key === "ArrowDown" && T)
      T.volume = Math.max(0, T.volume - 0.1);
    else if (h.key.toLowerCase() === "m" && T)
      T.muted = !T.muted;
    else return;
    K(h);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: M,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${g}`,
      className: "dq-preview",
      onKeyDown: E,
      onMouseDown: (h) => {
        h.target === h.currentTarget && C();
      },
      children: /* @__PURE__ */ d("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ d("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !w || i || a,
              onClick: b,
              children: /* @__PURE__ */ n(or, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !c || i || a,
              onClick: N,
              children: /* @__PURE__ */ n(ar, {})
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
              onClick: p,
              disabled: a,
              children: f ? "Selected" : "Select"
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: D,
              "aria-label": "Open video details",
              children: /* @__PURE__ */ n(sr, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: C,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(Jt, {})
            }
          )
        ] }),
        /* @__PURE__ */ n(
          "div",
          {
            className: "dq-player",
            "data-review-player-controls": !0,
            tabIndex: 0,
            onKeyDown: k,
            children: A ? /* @__PURE__ */ n(
              rr,
              {
                streamUrl: Rr(e.id),
                posterUrl: Pt(e),
                format: A.format,
                audioCodec: A.audioCodec,
                duration: A.duration ?? 0,
                videoId: e.id,
                showAbLoop: !1,
                extensionSurface: "quick-view",
                onPlaybackControlRegister: (h) => (L.current = h, () => {
                  L.current === h && (L.current = null);
                }),
                videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
                clip: e.parentVideoId != null ? {
                  start: e.clipStartSec ?? 0,
                  end: e.clipEndSec,
                  loop: !1
                } : void 0
              }
            ) : /* @__PURE__ */ n("img", { src: Pt(e), alt: "" })
          }
        ),
        l && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: l }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((h, O) => /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            disabled: i || a || !s,
            onClick: () => void R(h),
            children: [
              Oe(h, O) && /* @__PURE__ */ n("kbd", { children: Oe(h, O) }),
              h.label
            ]
          },
          h.id
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
  onChoose: l,
  onClose: s
}) {
  const [f, w] = y(
    () => r && t ? structuredClone(t) : null
  ), [c, p] = y(""), [b, N] = y(!1), C = j(null);
  Z(() => {
    var k, h;
    const g = document.activeElement, E = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (h = (k = C.current) == null ? void 0 : k.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || h.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = E, g == null || g.focus({ preventScroll: !0 });
    };
  }, []);
  function R(g) {
    var h, O, T;
    if (g.defaultPrevented) {
      g.stopPropagation();
      return;
    }
    if (g.key === "Escape") {
      K(g), b || s();
      return;
    }
    if (g.key !== "Tab") {
      g.stopPropagation();
      return;
    }
    const E = [
      ...((h = C.current) == null ? void 0 : h.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ie) => ie.offsetParent !== null);
    if (!E.length) {
      K(g), (O = C.current) == null || O.focus();
      return;
    }
    const k = E.indexOf(
      document.activeElement
    );
    g.shiftKey && k <= 0 ? (K(g), (T = E.at(-1)) == null || T.focus()) : !g.shiftKey && k === E.length - 1 ? (K(g), E[0].focus()) : g.stopPropagation();
  }
  function D(g) {
    w(
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
    ), p("");
  }
  async function M() {
    if (b) return;
    if (!f || it(f)) {
      p(f ? it(f) : "Choose a review.");
      return;
    }
    const g = { ...f, name: f.name.trim() }, E = e.some((k) => k.id === g.id) ? e.map((k) => k.id === g.id ? g : k) : [...e, g];
    N(!0), p("");
    try {
      if (!await a(E)) throw new Error("Could not save reviews.");
      l(g.id), s();
    } catch (k) {
      p(
        "Could not save reviews. Your edits are still open. " + (k instanceof Error ? k.message : "Retry saving.")
      );
    } finally {
      N(!1);
    }
  }
  async function L(g) {
    if (!b) {
      N(!0), p("");
      try {
        if (!await a(g)) throw new Error("Could not save reviews.");
      } catch (E) {
        p(
          E instanceof Error ? E.message : "Could not save reviews."
        );
      } finally {
        N(!1);
      }
    }
  }
  async function A(g) {
    var k;
    if (b) return;
    const E = (k = g.target.files) == null ? void 0 : k[0];
    if (g.target.value = "", !!E) {
      if (E.size > 2e6) {
        p("Review files must be smaller than 2 MB.");
        return;
      }
      N(!0), p("");
      try {
        const h = Ie(await E.text());
        if (!await a(ot(e, h)))
          throw new Error("Could not save reviews.");
      } catch (h) {
        p(
          h instanceof Error ? h.message : "Could not import reviews."
        );
      } finally {
        N(!1);
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
      onKeyDown: R,
      children: /* @__PURE__ */ d("div", { className: "dq-manager", children: [
        /* @__PURE__ */ d("header", { children: [
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ n("h2", { children: i ? "Adjust queue temporarily" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: i ? "Apply changes for this session. Saved review settings stay available through Reset to saved queue." : "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: b,
              onClick: s,
              children: /* @__PURE__ */ n(Jt, {})
            }
          )
        ] }),
        c && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: c }),
        /* @__PURE__ */ n("fieldset", { disabled: b, className: "dq-manager-content", children: f ? /* @__PURE__ */ n(
          _r,
          {
            draft: f,
            temporary: i,
            setDraft: w,
            onSave: () => void M(),
            onCancel: s
          }
        ) : /* @__PURE__ */ d(ne, { children: [
          /* @__PURE__ */ d("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ d(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => D(),
                children: [
                  /* @__PURE__ */ n(lr, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ d("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(cr, {}),
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
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((g) => /* @__PURE__ */ d("article", { children: [
            /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ n("strong", { children: g.name }),
              /* @__PURE__ */ n("p", { children: g.description || "No description" })
            ] }),
            /* @__PURE__ */ d("button", { type: "button", onClick: () => D(g), children: [
              /* @__PURE__ */ n(Ut, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => D({
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
                  window.confirm(`Delete review “${g.name}”?`) && L(
                    e.filter((E) => E.id !== g.id)
                  );
                },
                children: /* @__PURE__ */ n(_t, {})
              }
            )
          ] }, g.id)) })
        ] }) })
      ] })
    }
  );
}
function _r({
  draft: e,
  temporary: t = !1,
  setDraft: r,
  onSave: i,
  onCancel: a
}) {
  const l = (s, f) => r({
    ...e,
    actions: e.actions.map(
      (w, c) => c === s ? f : w
    )
  });
  return /* @__PURE__ */ d("div", { className: "dq-editor", children: [
    !t && /* @__PURE__ */ d(ne, { children: [
      /* @__PURE__ */ d("label", { children: [
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
      /* @__PURE__ */ d("label", { children: [
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
    /* @__PURE__ */ n(
      $r,
      {
        draft: e,
        onChange: r,
        presentation: !t
      }
    ),
    !t && /* @__PURE__ */ d(ne, { children: [
      /* @__PURE__ */ n("h3", { children: "Actions" }),
      /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
      e.actions.map((s, f) => /* @__PURE__ */ d("fieldset", { children: [
        /* @__PURE__ */ d("legend", { children: [
          "Action ",
          f + 1
        ] }),
        /* @__PURE__ */ d("div", { className: "dq-row", children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              disabled: f === 0,
              onClick: () => r({
                ...e,
                actions: et(e.actions, f, -1)
              }),
              children: "Move action up"
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              disabled: f === e.actions.length - 1,
              onClick: () => r({
                ...e,
                actions: et(e.actions, f, 1)
              }),
              children: "Move action down"
            }
          ),
          /* @__PURE__ */ n(
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
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          "Shortcut",
          /* @__PURE__ */ d(
            "select",
            {
              value: s.shortcut ?? "auto",
              onChange: (w) => l(f, {
                ...s,
                shortcut: w.target.value === "auto" ? void 0 : w.target.value
              }),
              children: [
                /* @__PURE__ */ d("option", { value: "auto", children: [
                  "Position (",
                  f < 9 ? f + 1 : "none",
                  ")"
                ] }),
                /* @__PURE__ */ n("option", { value: "", children: "None" }),
                [1, 2, 3, 4, 5, 6, 7, 8, 9].map((w) => /* @__PURE__ */ n("option", { value: w, children: w }, w))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          "Button label",
          /* @__PURE__ */ n(
            "input",
            {
              value: s.label,
              onChange: (w) => l(f, {
                ...s,
                label: w.target.value
              })
            }
          )
        ] }),
        s.steps.map((w, c) => /* @__PURE__ */ n(
          zr,
          {
            step: w,
            index: c,
            count: s.steps.length,
            onMove: (p) => l(f, {
              ...s,
              steps: et(s.steps, c, p)
            }),
            onChange: (p) => l(f, {
              ...s,
              steps: s.steps.map(
                (b, N) => N === c ? p : b
              )
            }),
            onRemove: () => l(f, {
              ...s,
              steps: s.steps.filter(
                (p, b) => b !== c
              )
            })
          },
          c
        )),
        /* @__PURE__ */ d("div", { className: "dq-row", children: [
          /* @__PURE__ */ n(
            "button",
            {
              className: "dq-button",
              type: "button",
              onClick: () => l(f, {
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
                  (w, c) => c !== f
                )
              }),
              children: "Remove action"
            }
          )
        ] })
      ] }, s.id)),
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
    ] }),
    /* @__PURE__ */ d("div", { className: "dq-editor-footer", children: [
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
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: i, children: t ? "Apply temporary queue" : "Save review" })
    ] })
  ] });
}
function zr({
  step: e,
  index: t,
  count: r,
  onMove: i,
  onChange: a,
  onRemove: l
}) {
  return /* @__PURE__ */ d("div", { className: "dq-action-step", children: [
    /* @__PURE__ */ d("span", { children: [
      "Step ",
      t + 1
    ] }),
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        "aria-label": "Move step up",
        disabled: t === 0,
        onClick: () => i(-1),
        children: "↑"
      }
    ),
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        "aria-label": "Move step down",
        disabled: t === r - 1,
        onClick: () => i(1),
        children: "↓"
      }
    ),
    /* @__PURE__ */ d(
      "select",
      {
        "aria-label": "Tag operation",
        value: e.mode,
        onChange: (s) => a({ ...e, mode: s.target.value }),
        children: [
          /* @__PURE__ */ n("option", { value: "ADD", children: "Add tags" }),
          /* @__PURE__ */ n("option", { value: "REMOVE", children: "Remove tags" }),
          /* @__PURE__ */ n("option", { value: "REMOVE_TREE", children: "Remove tags and descendants" })
        ]
      }
    ),
    /* @__PURE__ */ n(
      nt,
      {
        entityType: "tag",
        values: e.tagIds,
        onChange: (s) => a({ ...e, tagIds: s }),
        placeholder: "Choose tags",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: l, children: /* @__PURE__ */ n(_t, {}) })
  ] });
}
async function Kr() {
  const e = await V("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const s = JSON.parse(r);
      Array.isArray(s.reviews) && (i = JSON.stringify(s.reviews, null, 2));
    } catch {
    }
  const a = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), l = document.createElement("a");
  l.href = a, l.download = "data-quality-browser-recovery.json", l.click(), URL.revokeObjectURL(a);
}
function Dt({ label: e }) {
  return /* @__PURE__ */ d("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(Ft, { className: "dq-spin" }),
    e
  ] });
}
function Lt({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ d("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(jt, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const Wr = { components: { DataQualityPage: Ur } };
export {
  Ur as DataQualityPage,
  Wr as default
};
