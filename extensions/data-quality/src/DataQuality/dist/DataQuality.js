import { jsxs as d, jsx as n, Fragment as oe } from "react/jsx-runtime";
import { useState as v, useEffect as ee, useMemo as Ct, useRef as j, useCallback as Ne } from "react";
import { VIDEO_SORT_OPTIONS as Et, FilterDialog as er, VIDEO_CRITERIA as tr, EntityReferenceMultiSelector as nt, VideoPlayer as rr, getResolutionLabel as nr, formatDuration as ir } from "@cove/runtime/components";
import { Pencil as Lt, Film as qt, AlertTriangle as Ut, Loader2 as jt, ChevronLeft as or, ChevronRight as ar, ExternalLink as sr, X as Ft, Plus as lr, Upload as cr, Trash2 as Jt, Check as dr, Play as ur } from "@cove/runtime/lucide-react";
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
function kt(e, t) {
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
const _t = "ext:com.midnightrider.data-quality:configuration", br = "ext:cove-data-quality:video-reviews", at = "ext:com.midnightrider.data-quality:progress", Ae = /* @__PURE__ */ new Map(), Fe = /* @__PURE__ */ new Map(), tt = (e, t) => e.includes("*") || e.includes(t), Je = (e) => V(`/api/savedfilters?mode=${encodeURIComponent(e)}`), wr = () => ({
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
    reviews: Ie(JSON.stringify(t.reviews)),
    deletedIds: st(t.deletedIds),
    importedIds: st(t.importedIds)
  };
}
function yr(e) {
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
      r ?? (r = s), s.forEach((p) => i.add(p.id));
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
let ke = null;
function vr() {
  if (ke) return ke;
  const e = Sr();
  return ke = e, e.finally(() => {
    ke === e && (ke = null);
  }).catch(() => {
  }), e;
}
async function Sr() {
  var N;
  const e = await V("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = tt(e.permissions, "savedfilters.read"), a = i && tt(e.permissions, "savedfilters.write"), l = i ? (await Je(_t)).filter((C) => C.name === "Data Quality configuration").sort((C, k) => C.id - k.id) : [];
  if (l.length > 1) {
    const C = (k) => {
      const { revision: D, ...M } = Ce(k.uiOptions);
      return JSON.stringify(M);
    };
    if (l.some((k) => C(k) !== C(l[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (a)
      for (const k of l.slice(1))
        await V(`/api/savedfilters/${k.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${k.id}` })
        });
    l.splice(1);
  }
  let s = l.length ? Ce(l[0].uiOptions) : wr();
  const p = localStorage.getItem(`${r}:migrated`) === "true", w = localStorage.getItem(r), c = localStorage.getItem(`${r}:local-only`) === "true";
  !l.length && w && (s = Ce(w));
  let h = !l.length;
  if (l.length && c && w) {
    const C = Ce(w);
    if (C.reviews.some((D) => {
      const M = s.reviews.find((L) => L.id === D.id);
      return M && JSON.stringify(M) !== JSON.stringify(D);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const k = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...C.deletedIds])
    ];
    s = {
      ...s,
      reviews: ot(s.reviews, C.reviews).filter(
        (D) => !k.includes(D.id)
      ),
      deletedIds: k,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...C.importedIds])
      ]
    }, h = !0;
  }
  if (!p) {
    const C = JSON.stringify(s), k = yr(t);
    if (l.length && k.reviews.some((E) => {
      const g = s.reviews.find((q) => q.id === E.id);
      return g && JSON.stringify(g) !== JSON.stringify(E);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const D = i ? (await Je(br)).flatMap(
      (E) => Ie(E.uiOptions ?? "[]")
    ) : [], M = k.known.filter(
      (E) => !k.reviews.some((g) => g.id === E)
    ), L = /* @__PURE__ */ new Set([...s.deletedIds, ...M]);
    s = {
      ...s,
      reviews: ot(
        k.reviews,
        s.reviews,
        D.filter(
          (E) => !k.known.includes(E.id) && !s.importedIds.includes(E.id)
        )
      ).filter((E) => !L.has(E.id)),
      deletedIds: [...L],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...k.known,
          ...D.map((E) => E.id)
        ])
      ]
    }, h || (h = JSON.stringify(s) !== C);
  }
  const y = {
    userId: t,
    recordId: (N = l[0]) == null ? void 0 : N.id,
    config: s,
    readable: i,
    writable: a,
    durable: a
  };
  if (Ae.set(r, y), h && a) {
    const C = s;
    l.length && (y.config = Ce(l[0].uiOptions)), await Vt(r, C), s = y.config;
  } else l.length || (localStorage.setItem(r, JSON.stringify(s)), !i && (!p || c) && localStorage.setItem(`${r}:local-only`, "true"));
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
async function Vt(e, t) {
  const r = Ae.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await zt(r), r.recordId != null) {
      const l = await V(
        `/api/savedfilters/${r.recordId}`
      );
      if (Ce(l.uiOptions).revision !== r.config.revision)
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
function Nr(e, t) {
  return Ie(JSON.stringify(t)), Kt(e, async () => {
    const r = Ae.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((a) => !t.some((l) => l.id === a.id)).map((a) => a.id);
    await Vt(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((a) => !t.some((l) => l.id === a))
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
async function Cr(e, t) {
  const r = Ae.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), a = i ? Ot(i) : null;
  if (!r.readable) return a;
  const l = (await Je(at)).find(
    (p) => p.name === t
  ), s = l ? Ot(l.uiOptions) : null;
  return a && (!s || a.updatedAt > s.updatedAt) ? a : s;
}
function Er(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return Kt(i, async () => {
    const a = Ae.get(e);
    if (!(a != null && a.writable)) return;
    await zt(a);
    const l = (await Je(at)).find(
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
function _e(e) {
  return Array.isArray(e) ? e.map(_e) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? qr[r] ?? r : _e(r)
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
function Bt(e) {
  return `/api/videos/${e.id}/image?max=640&v=${encodeURIComponent(e.updatedAt)}`;
}
function Rr(e) {
  return `/api/stream/video/${e}`;
}
function At(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function kr(e) {
  return `/api/stream/video/${e}/preview`;
}
function Or(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Ir(e) {
  return e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Qt(e) {
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
async function Ar(e, t) {
  if (!lt(e) || t.length === 0 || t.some((i) => !Number.isSafeInteger(i) || i <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  const r = await Promise.all(
    e.steps.map(async (i) => ({
      mode: i.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds: i.mode === "REMOVE_TREE" ? await Qt(i.tagIds) : i.tagIds
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
  var s, p;
  const [t, r] = v({}), [i, a] = v(""), l = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...((s = e == null ? void 0 : e.presentation) == null ? void 0 : s.annotationParents) ?? [],
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return ee(() => {
    let w = !0;
    return r({}), a(""), Promise.all(
      JSON.parse(l).map(
        async (c) => [c, await Qt([c])]
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
        (p) => {
          var w;
          return p !== s.id && ((w = r[p]) == null ? void 0 : w.includes(s.id));
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
  var p, w, c;
  const l = new Set(
    (((p = t.presentation) == null ? void 0 : p.binParents) ?? []).flatMap(
      (h) => (r[h] ?? []).filter((y) => y !== h)
    )
  ), s = /* @__PURE__ */ new Map();
  for (const h of e)
    for (const y of h.tags ?? [])
      if (l.has(y.id)) {
        const N = s.get(y.id) ?? { name: y.name, count: 0 };
        N.count++, s.set(y.id, N);
      }
  return (c = (w = t.presentation) == null ? void 0 : w.binParents) != null && c.length ? /* @__PURE__ */ d("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...s].sort((h, y) => h[1].name.localeCompare(y[1].name)).map(([h, y]) => /* @__PURE__ */ d(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => a(h),
        children: [
          y.name,
          " (",
          y.count,
          ")"
        ]
      },
      h
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
  const [i, a] = v(!1), l = e.view.filter, s = (c) => t({
    ...e,
    view: { ...e.view, filter: { ...l, ...c } }
  }), p = e.presentation ?? {}, w = (c) => t({ ...e, presentation: { ...p, ...c } });
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
            !Et.some((c) => c.value === l.sort) && l.sort != null && /* @__PURE__ */ n("option", { value: String(l.sort), children: String(l.sort) }),
            Et.map((c) => /* @__PURE__ */ n("option", { value: c.value, children: c.label }, c.value))
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
    r && /* @__PURE__ */ d(oe, { children: [
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
            value: p.cardSize ?? "auto",
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
        const h = p.annotations ?? [
          "date",
          "studio",
          "performers"
        ];
        return /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: h.includes(c),
              onChange: (y) => w({
                annotations: y.target.checked ? [...h, c] : h.filter((N) => N !== c)
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
          values: p.annotationParents ?? [],
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
          values: p.binParents ?? [],
          onChange: (c) => w({ binParents: c }),
          allowCreate: !1
        }
      )
    ] })
  ] });
}
function Pt(e) {
  return e.view.displayMode === "wall" || e.view.displayMode === "list" ? e.view.displayMode : "grid";
}
function Dr() {
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
function Lr(e) {
  return ge({ ...e, page: 1 });
}
function Ht(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function X(e) {
  e.preventDefault(), e.stopPropagation(), e.nativeEvent.stopImmediatePropagation();
}
function Ur({
  onNavigate: e
}) {
  const [t, r] = v([]), [i] = v(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [a, l] = v(""), [s, p] = v(!0), [w, c] = v(""), [h, y] = v(!1), [N, C] = v(!0), [k, D] = v(""), [M, L] = v(""), [E, g] = v(!1), [q, I] = v(!1), [u, x] = v(Dr), [F, T] = v(!1), [ae, ne] = v(!1), [se, ct] = v(!1), [B, Ee] = v(
    null
  ), _ = t.find((o) => o.id === u) ?? null, m = Ct(
    () => (B == null ? void 0 : B.id) === u && _ ? { ..._, view: B.view } : _,
    [B, u, _]
  ), Pe = Pr(m), [O, me] = v({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Y, dt] = v({ items: [], totalCount: 0 }), [A, xe] = v(!1), [ie, ut] = v(""), [le, pe] = v(() => /* @__PURE__ */ new Set()), ze = j(le);
  ze.current = le;
  const be = j(/* @__PURE__ */ new Map()), [Q, te] = v(null), H = j(Q);
  H.current = Q;
  const [re, we] = v(!1), ce = j(re);
  ce.current = re;
  const ft = j(null), [de, Ke] = v("grid"), [ye, Me] = v(null), [U, Ve] = v(!1), Te = j(!1), [Gt, Be] = v(""), [pt, ve] = v(""), [Qe, qe] = v(""), He = j(/* @__PURE__ */ new Map()), ht = j(null), Se = j(0), $e = j(0), De = j(null), gt = Ne(async () => {
    p(!0), c("");
    try {
      const o = await vr();
      r(o.reviews), l(o.storageKey), y(o.canWrite), C(o.canConfigure ?? !0), D(o.storageNotice ?? ""), u && !o.reviews.some((f) => f.id === u) && (x(""), xt(""));
    } catch (o) {
      c(
        o instanceof Error ? o.message : "Could not load reviews."
      );
    } finally {
      p(!1);
    }
  }, [u]);
  ee(() => {
    gt();
  }, []);
  const ue = Ne(
    async (o, f) => {
      var $;
      const b = ++Se.current;
      ($ = De.current) == null || $.abort();
      const S = new AbortController();
      De.current = S, f = ge(f), me(f), xe(!0), ut("");
      try {
        let R = await It(
          o,
          f,
          S.signal
        );
        const G = Math.max(
          1,
          Math.ceil(R.totalCount / Number(f.perPage))
        );
        return Number(f.page) > G && (f = { ...f, page: G }, R = await It(
          o,
          f,
          S.signal
        )), b === Se.current && (dt(R), me(f)), R;
      } catch (R) {
        throw b === Se.current && ut(
          R instanceof Error ? R.message : "Could not load the review queue."
        ), R;
      } finally {
        b === Se.current && xe(!1);
      }
    },
    []
  );
  ee(() => {
    var f;
    if ($e.current += 1, Se.current += 1, (f = De.current) == null || f.abort(), I(!1), L(""), g(!1), pe(/* @__PURE__ */ new Set()), be.current.clear(), te(null), we(!1), Ve(!1), Te.current = !1, Be(""), ve(""), qe(""), dt({ items: [], totalCount: 0 }), !m) {
      xe(!1);
      return;
    }
    let o = !0;
    return xe(!0), (async () => {
      var R;
      let b = null;
      try {
        b = await Cr(a, m.id);
      } catch (G) {
        o && (g(!0), L(
          G instanceof Error ? G.message : "Could not load progress."
        ));
      }
      if (!o) return;
      const S = (b == null ? void 0 : b.signature) === je(m) ? b : null, $ = S ? ge(S.filter) : Lr(m.view.filter);
      me($), Ke((S == null ? void 0 : S.displayMode) ?? Pt(m)), Me(
        S ? S.cardSize : ((R = m.presentation) == null ? void 0 : R.cardSize) ?? null
      );
      try {
        const G = await ue(m, $);
        if (!o) return;
        const z = Rt(
          G.items.map((he) => he.id),
          (S == null ? void 0 : S.focusedId) ?? null,
          (S == null ? void 0 : S.index) ?? 0
        );
        te(z), J(z), b && !S ? ve(
          "The saved queue changed. Review resumed at its first page."
        ) : S && ve(
          "Review resumed. If results changed, focus uses the saved video on this page or the nearest position. Selection starts empty."
        );
      } catch {
      }
      o && I(!0);
    })(), () => {
      var b;
      o = !1, $e.current++, Se.current++, (b = De.current) == null || b.abort();
    };
  }, [m == null ? void 0 : m.id]);
  const P = Ct(
    () => Y.items.map((o) => o.id),
    [Y.items]
  );
  ee(() => {
    if (!q || !m || !a || A || ie || U || (B == null ? void 0 : B.id) === m.id || E)
      return;
    const o = {
      version: 1,
      signature: je(m),
      filter: O,
      focusedId: Q,
      index: Math.max(0, P.indexOf(Q ?? -1)),
      displayMode: de,
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
    if (M) return;
    let f = !0;
    const b = window.setTimeout(() => {
      Er(a, m.id, o).catch((S) => {
        f && L(
          "Progress is kept in this browser, but account sync failed. " + (S instanceof Error ? S.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      f = !1, window.clearTimeout(b);
    };
  }, [
    q,
    a,
    m,
    A,
    ie,
    U,
    O,
    Q,
    P,
    de,
    ye,
    B,
    M,
    E
  ]);
  const mt = Math.max(
    1,
    Math.ceil(Y.totalCount / Math.max(1, Number(O.perPage) || 40))
  ), Ge = Y.items.find((o) => o.id === Q) ?? null;
  re && Ge && (ft.current = Ge);
  const fe = Ge ?? (re ? ft.current : null), Wt = kt(le, Q), bt = le.size > 0 ? `${le.size} selected video${le.size === 1 ? "" : "s"}` : Q == null ? "no video" : "focused video", J = Ne((o, f = !0) => {
    o != null && window.requestAnimationFrame(() => {
      const b = He.current.get(o);
      b == null || b.focus({ preventScroll: !0 }), f && (b == null || b.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  ee(() => {
    q && !ce.current && J(H.current);
  }, [q, J]), ee(() => {
    A || !P.length || (H.current == null || !P.includes(H.current)) && (te(P[0]), ce.current || J(P[0]));
  }, [J, P, A]);
  const Re = Ne(
    (o) => {
      pe((f) => {
        const b = o(f);
        for (const S of /* @__PURE__ */ new Set([...f, ...b]))
          f.has(S) !== b.has(S) && be.current.set(
            S,
            (be.current.get(S) ?? 0) + 1
          );
        return b;
      });
    },
    []
  ), We = Ne(
    (o) => {
      if (!P.length) return;
      const f = Math.max(
        0,
        P.indexOf(H.current ?? P[0])
      ), b = P[Math.max(0, Math.min(P.length - 1, f + o))];
      te(b), ce.current || J(b);
    },
    [J, P]
  ), Xe = Ne(
    async (o) => {
      const f = kt(
        ze.current,
        H.current
      );
      if (!m || Te.current || A || ie || !h || !f.length)
        return;
      const b = ++$e.current, S = m.id, $ = [...P], R = H.current, G = new Map(
        f.map((K) => [K, be.current.get(K) ?? 0])
      ), z = () => b === $e.current && m.id === S;
      Te.current = !0, Ve(!0), Be(
        ze.current.size ? `${f.length} selected videos` : "the focused video"
      ), ve(""), qe("");
      let he = !1;
      try {
        if (await Ar(o, f), he = !0, !z()) return;
        pe((K) => {
          const W = new Set(K);
          for (const Z of f)
            (be.current.get(Z) ?? 0) === G.get(Z) && W.delete(Z);
          return W;
        }), ve(
          `${o.label}: ${f.length} video${f.length === 1 ? "" : "s"} ${o.steps.length ? "updated" : "skipped"}.`
        );
      } catch (K) {
        if (!z()) return;
        qe(
          K instanceof Error ? K.message : "Action failed."
        );
      }
      try {
        if (await Ir(o), !z()) return;
        const K = await ue(m, O);
        if (!z()) return;
        let W = K.items.map((Z) => Z.id);
        if (!W.length && K.totalCount > 0 && Number(O.page) > 1) {
          const Z = Math.max(1, Number(O.page) - 1), Ue = { ...O, page: Z };
          me(Ue), W = (await ue(m, Ue)).items.map((Ze) => Ze.id), pe(
            (Ze) => new Set([...Ze].filter((Zt) => W.includes(Zt)))
          );
          const Nt = W.at(-1) ?? null;
          te(Nt), ce.current || J(Nt);
        } else {
          pe(
            (Ue) => new Set([...Ue].filter((St) => W.includes(St)))
          );
          const Z = hr(
            $,
            W,
            R,
            he && f.includes(R ?? -1)
          );
          te(Z), ce.current && Z == null && we(!1), ce.current || J(Z);
        }
      } catch (K) {
        z() && qe(
          (W) => `${W ? `${W} ` : ""}${he ? "The action completed, but " : ""}the queue could not be refreshed. ${K instanceof Error ? K.message : "Refresh failed."}`
        );
      } finally {
        z() && (Te.current = !1, Ve(!1), Be(""));
      }
    },
    [
      h,
      ue,
      O,
      J,
      P,
      A,
      ie,
      m
    ]
  );
  function Xt() {
    var b;
    const o = (b = ht.current) == null ? void 0 : b.firstElementChild, f = o ? getComputedStyle(o).gridTemplateColumns : "";
    return Math.max(1, f.split(" ").filter(Boolean).length);
  }
  function Yt(o) {
    if (o.defaultPrevented || o.repeat || o.ctrlKey || o.altKey || o.metaKey || F || se) return;
    if (re && o.key === "Escape") {
      X(o), we(!1), J(H.current);
      return;
    }
    if (!mr(o.target)) return;
    if (o.key === "Escape") {
      X(o), Re(() => /* @__PURE__ */ new Set());
      return;
    }
    const f = (m == null ? void 0 : m.actions.findIndex(
      ($, R) => Oe($, R) === o.key
    )) ?? -1;
    if (f >= 0 && (m != null && m.actions[f])) {
      X(o), !U && !A && Xe(m.actions[f]);
      return;
    }
    if (!re && o.key === " ") {
      X(o), Q != null && Re(($) => rt($, Q));
      return;
    }
    if (!re && o.key.toLowerCase() === "a") {
      X(o), Re(
        ($) => gr($, P)
      );
      return;
    }
    if (U || A || re) return;
    if (o.key === "Enter" && Q != null) {
      X(o), we(!0);
      return;
    }
    const b = Xt(), S = o.key === "ArrowLeft" ? -1 : o.key === "ArrowRight" ? 1 : o.key === "ArrowUp" ? -b : o.key === "ArrowDown" ? b : 0;
    S && (X(o), We(S));
  }
  function Ye(o) {
    x(o), xt(o);
  }
  async function wt(o) {
    var b, S, $;
    if (!a) return !1;
    try {
      await Nr(a, o);
    } catch (R) {
      throw R;
    }
    r(o), u && !o.some((R) => R.id === u) && Ye("");
    const f = o.find((R) => R.id === u);
    return f && _ && JSON.stringify(f) !== JSON.stringify(_) && (f.view.displayMode !== _.view.displayMode && Ke(Pt(f)), ((b = f.presentation) == null ? void 0 : b.cardSize) !== ((S = _.presentation) == null ? void 0 : S.cardSize) && Me((($ = f.presentation) == null ? void 0 : $.cardSize) ?? null), je(f) !== je(_) && (Ee(null), Le(
      f,
      ge({ ...f.view.filter, page: O.page })
    ))), !0;
  }
  if (s)
    return /* @__PURE__ */ n($t, { label: "Loading Data Quality reviews…" });
  if (w)
    return /* @__PURE__ */ d(oe, { children: [
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
        Dt,
        {
          message: w,
          onRetry: () => void gt()
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
          disabled: U || A || !N,
          onClick: () => {
            ne(!1), T(!0);
          },
          children: [
            /* @__PURE__ */ n(Lt, {}),
            " Manage reviews"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ n("p", { className: "dq-status", children: k }),
    i && /* @__PURE__ */ d("details", { children: [
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
          children: E ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    m ? /* @__PURE__ */ d(oe, { children: [
      /* @__PURE__ */ d("section", { className: "dq-toolbar", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: U || A || !N,
            onClick: () => {
              ne(!0), T(!0);
            },
            children: "Edit review"
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: U || A,
            onClick: () => ct(!0),
            children: "Adjust queue"
          }
        ),
        (B == null ? void 0 : B.id) === u && /* @__PURE__ */ d(oe, { children: [
          /* @__PURE__ */ n("span", { children: "Temporary queue" }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: U || A || !N,
              onClick: () => {
                _ && wt(
                  t.map(
                    (o) => o.id === u ? {
                      ...o,
                      view: {
                        ...m.view,
                        filter: { ...O, page: 1 }
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
              disabled: U || A,
              onClick: () => {
                Ee(null), _ && Le(
                  _,
                  ge({
                    ..._.view.filter,
                    page: O.page
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
                "aria-pressed": de === o,
                onClick: () => Ke(o),
                children: o
              },
              o
            ))
          }
        ),
        de !== "list" && /* @__PURE__ */ d(oe, { children: [
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
                value: ye ?? (de === "wall" ? 130 : 180),
                onChange: (o) => Me(Number(o.target.value))
              }
            )
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              className: `dq-button ${ye == null ? "active" : ""}`,
              type: "button",
              onClick: () => Me(null),
              children: "Auto fit"
            }
          )
        ] }),
        /* @__PURE__ */ d("span", { children: [
          Y.totalCount.toLocaleString(),
          " matching"
        ] }),
        /* @__PURE__ */ n(
          "button",
          {
            className: "dq-button",
            type: "button",
            disabled: Number(O.page) <= 1 || U || A,
            onClick: () => Mt(
              { ...O, page: Number(O.page) - 1 },
              m,
              me,
              ue,
              yt
            ),
            children: "Prev"
          }
        ),
        /* @__PURE__ */ d("span", { children: [
          Number(O.page) || 1,
          " / ",
          mt
        ] }),
        /* @__PURE__ */ n(
          "button",
          {
            className: "dq-button",
            type: "button",
            disabled: Number(O.page) >= mt || U || A,
            onClick: () => Mt(
              { ...O, page: Number(O.page) + 1 },
              m,
              me,
              ue,
              yt
            ),
            children: "Next"
          }
        )
      ] }),
      Pe.error && /* @__PURE__ */ n("p", { role: "alert", children: Pe.error }),
      /* @__PURE__ */ n(
        Mr,
        {
          videos: Y.items,
          review: m,
          trees: Pe.ids,
          disabled: U || A,
          onChoose: (o) => {
            const f = Tr(m, o);
            Ee(f), Le(f, { ...O, page: 1 });
          }
        }
      ),
      Qe && !re && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(Ut, {}),
        Qe
      ] }),
      pt && /* @__PURE__ */ n("p", { role: "status", className: "dq-status", children: pt }),
      /* @__PURE__ */ d("div", { className: "dq-workspace", children: [
        /* @__PURE__ */ d("main", { children: [
          A && !Y.items.length && /* @__PURE__ */ n($t, { label: "Loading review queue…" }),
          ie && !A && /* @__PURE__ */ n(
            Dt,
            {
              message: ie,
              onRetry: () => void ue(m, O).catch(() => {
              })
            }
          ),
          !A && !ie && !Y.items.length && /* @__PURE__ */ d("div", { className: "dq-empty", children: [
            /* @__PURE__ */ n(qt, {}),
            /* @__PURE__ */ n("p", { children: "No videos match this review." })
          ] }),
          !!Y.items.length && /* @__PURE__ */ n("div", { ref: ht, children: de === "list" ? /* @__PURE__ */ n("div", { className: "dq-list", "data-review-layout": "list", children: Y.items.map(vt) }) : /* @__PURE__ */ n(
            "div",
            {
              className: "dq-grid",
              style: {
                "--dq-card-width": ye == null ? de === "wall" ? "clamp(115px, 10vw, 150px)" : "clamp(145px, 14vw, 180px)" : `${ye}px`
              },
              children: Y.items.map(vt)
            }
          ) })
        ] }),
        /* @__PURE__ */ d("aside", { className: "dq-actions", children: [
          /* @__PURE__ */ n("strong", { children: bt }),
          m.actions.map((o, f) => /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              disabled: U || A || !!ie || !h || !Wt.length,
              onClick: () => void Xe(o),
              children: [
                Oe(o, f) && /* @__PURE__ */ n("kbd", { children: Oe(o, f) }),
                /* @__PURE__ */ n("span", { children: o.label }),
                /* @__PURE__ */ n("small", { children: o.steps.length ? `${o.steps.length} step(s)` : "Skip" })
              ]
            },
            o.id
          )),
          !m.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
          !h && /* @__PURE__ */ n("p", { children: "Video write permission is required to apply actions." }),
          U && /* @__PURE__ */ d("p", { role: "status", children: [
            /* @__PURE__ */ n(jt, { className: "dq-spin" }),
            " Applying action to",
            " ",
            Gt,
            "…"
          ] }),
          /* @__PURE__ */ n("p", { className: "dq-shortcuts", children: "←→↑↓ move · space select · enter preview · 1–9 apply · A toggle shown · Esc clear" })
        ] })
      ] })
    ] }) : /* @__PURE__ */ d("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(qt, {}),
      /* @__PURE__ */ n("p", { children: t.length ? "Choose a saved review to open its queue." : "No saved reviews are available in this browser." })
    ] }),
    re && fe && m && /* @__PURE__ */ n(
      Jr,
      {
        video: fe,
        review: m,
        targetLabel: bt,
        pending: U,
        refreshing: A || !!ie,
        error: Qe,
        canWrite: h,
        selected: le.has(fe.id),
        hasPrevious: P.indexOf(fe.id) > 0,
        hasNext: P.indexOf(fe.id) >= 0 && P.indexOf(fe.id) < P.length - 1,
        onToggleSelected: () => Re((o) => rt(o, fe.id)),
        onPrevious: () => We(-1),
        onNext: () => We(1),
        onClose: () => {
          we(!1), J(H.current);
        },
        onAction: Xe,
        onOpen: () => e({ page: "video", id: fe.id })
      }
    ),
    se && m && /* @__PURE__ */ n(
      Tt,
      {
        reviews: t,
        activeReview: { ...m, view: { ...m.view, filter: O } },
        initialEdit: !0,
        temporary: !0,
        onSave: (o) => {
          const f = o.find((b) => b.id === u);
          return Ee(f), Le(
            f,
            ge({ ...f.view.filter, page: O.page })
          ), !0;
        },
        onChoose: () => {
        },
        onClose: () => {
          ct(!1), J(H.current, !1);
        }
      }
    ),
    F && /* @__PURE__ */ n(
      Tt,
      {
        reviews: t,
        activeReview: _,
        initialEdit: ae,
        onSave: wt,
        onChoose: Ye,
        onClose: () => {
          T(!1), ae && J(H.current, !1);
        }
      }
    )
  ] });
  async function Le(o, f) {
    const b = H.current, S = Math.max(0, P.indexOf(b ?? -1));
    try {
      const R = (await ue(o, f)).items.map((z) => z.id);
      pe(
        (z) => new Set([...z].filter((he) => R.includes(he)))
      );
      const G = Rt(R, b, S);
      te(G), ce.current || J(G, !1);
    } catch {
    }
  }
  function yt() {
    pe(/* @__PURE__ */ new Set()), be.current.clear(), te(null);
  }
  function vt(o) {
    return /* @__PURE__ */ n(
      jr,
      {
        video: o,
        annotation: xr(o, m, Pe.ids),
        displayMode: de,
        focused: o.id === Q,
        selected: le.has(o.id),
        setRef: (f) => {
          f ? He.current.set(o.id, f) : He.current.delete(o.id);
        },
        onFocus: () => te(o.id),
        onToggle: () => Re((f) => rt(f, o.id)),
        onPreview: () => {
          te(o.id), we(!0);
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
  onToggle: p,
  onPreview: w
}) {
  const c = e.files[0], h = Ht(e), y = /* @__PURE__ */ d(oe, { children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        "aria-label": a ? `Deselect ${h}` : `Select ${h}`,
        onClick: (N) => {
          N.stopPropagation(), p();
        },
        className: `dq-select ${a ? "selected" : ""}`,
        children: a && /* @__PURE__ */ n(dr, {})
      }
    ),
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        "aria-label": `Preview ${h}`,
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
      "aria-label": `${h}${a ? ", selected" : ""}`,
      onFocus: s,
      onClick: (N) => {
        s(), N.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-card ${r} ${i ? "focused" : ""} ${a ? "selected" : ""}`,
      children: [
        r === "wall" ? /* @__PURE__ */ d(Fr, { video: e, children: [
          y,
          /* @__PURE__ */ n("p", { className: "dq-wall-title", children: h })
        ] }) : /* @__PURE__ */ d("div", { className: "dq-poster", children: [
          /* @__PURE__ */ n("img", { src: Bt(e), alt: "" }),
          y
        ] }),
        (r !== "wall" || t) && /* @__PURE__ */ d("div", { className: "dq-card-copy", children: [
          /* @__PURE__ */ n("strong", { children: h }),
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
  const r = j(null), i = j(null), [a, l] = v(!1), [s, p] = v(!1), [w, c] = v(!1);
  return ee(() => {
    const h = r.current;
    if (!h || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      l(!0), p(!0);
      return;
    }
    const y = new IntersectionObserver(
      ([C]) => l(C.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), N = new IntersectionObserver(
      ([C]) => p(C.isIntersecting && C.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return y.observe(h), N.observe(h), () => {
      y.disconnect(), N.disconnect();
    };
  }, [e.id, e.files.length]), ee(() => {
    if (!a) {
      c(!1);
      return;
    }
    const h = new AbortController();
    return V(Or(e.id), {
      signal: h.signal
    }).then((y) => {
      h.signal.aborted || c(y.available === !0);
    }).catch(() => {
      h.signal.aborted || c(!1);
    }), () => h.abort();
  }, [a, e.id]), ee(() => {
    const h = i.current;
    h && (s ? Promise.resolve(h.play()).catch(() => {
    }) : h.pause());
  }, [w, s]), /* @__PURE__ */ d("div", { ref: r, className: "dq-wall-media", children: [
    /* @__PURE__ */ n("img", { src: Bt(e), alt: "" }),
    w && /* @__PURE__ */ n(
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
function Jr({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: a,
  error: l,
  canWrite: s,
  selected: p,
  hasPrevious: w,
  hasNext: c,
  onToggleSelected: h,
  onPrevious: y,
  onNext: N,
  onClose: C,
  onAction: k,
  onOpen: D
}) {
  const M = j(null), L = j(null), E = e.files[0], g = Ht(e);
  ee(() => {
    var x;
    const u = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (x = M.current) == null || x.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = u;
    };
  }, []);
  function q(u) {
    var T, ae, ne;
    if (u.key !== "Tab") return;
    const x = [
      ...((T = M.current) == null ? void 0 : T.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((se) => se.offsetParent !== null);
    if (!x.length) {
      u.preventDefault(), (ae = M.current) == null || ae.focus();
      return;
    }
    const F = x.indexOf(
      document.activeElement
    );
    u.shiftKey && F <= 0 ? (u.preventDefault(), (ne = x.at(-1)) == null || ne.focus()) : !u.shiftKey && F === x.length - 1 && (u.preventDefault(), x[0].focus());
  }
  function I(u) {
    if (u.defaultPrevented || u.ctrlKey || u.metaKey || u.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    )) return;
    const x = u.key === "ArrowLeft" || u.key === "ArrowRight";
    if (u.altKey && !x) return;
    const F = L.current, T = u.currentTarget.querySelector("video");
    if (u.key === "Enter" || u.key === "Escape")
      u.repeat || C();
    else if (u.key === " " && F)
      u.repeat || F.toggle();
    else if (x && F)
      F.seekBy(
        (u.key === "ArrowLeft" ? -1 : 1) * (u.shiftKey ? 5 : u.altKey ? 10 : 60)
      );
    else if ((u.key === "," || u.key === ".") && F) {
      const ae = [E == null ? void 0 : E.duration, T == null ? void 0 : T.duration].find(
        (se) => se != null && Number.isFinite(se) && se > 0
      ) ?? 0, ne = e.parentVideoId != null ? (e.clipEndSec ?? ae) - (e.clipStartSec ?? 0) : ae;
      Number.isFinite(ne) && ne > 0 && F.seekBy((u.key === "," ? -1 : 1) * ne * 0.1);
    } else if (u.key.toLowerCase() === "n" || u.key.toLowerCase() === "m")
      !u.repeat && !i && !a && (u.key.toLowerCase() === "n" && w && y(), u.key.toLowerCase() === "m" && c && N());
    else if (u.key === "ArrowUp" && T)
      T.volume = Math.min(1, T.volume + 0.1);
    else if (u.key === "ArrowDown" && T)
      T.volume = Math.max(0, T.volume - 0.1);
    else return;
    X(u);
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
      onKeyDown: q,
      onKeyDownCapture: I,
      onMouseDown: (u) => {
        u.target === u.currentTarget && C();
      },
      children: /* @__PURE__ */ d("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ d("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !w || i || a,
              onClick: y,
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
              onClick: h,
              disabled: a,
              children: p ? "Selected" : "Select"
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
              children: /* @__PURE__ */ n(Ft, {})
            }
          )
        ] }),
        /* @__PURE__ */ n(
          "div",
          {
            className: "dq-player",
            "data-review-player-controls": !0,
            tabIndex: 0,
            children: E ? /* @__PURE__ */ n(
              rr,
              {
                autostart: !0,
                streamUrl: Rr(e.id),
                posterUrl: At(e),
                format: E.format,
                audioCodec: E.audioCodec,
                duration: E.duration ?? 0,
                videoId: e.id,
                showAbLoop: !1,
                extensionSurface: "quick-view",
                onPlaybackControlRegister: (u) => (L.current = u, () => {
                  L.current === u && (L.current = null);
                }),
                videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
                clip: e.parentVideoId != null ? {
                  start: e.clipStartSec ?? 0,
                  end: e.clipEndSec,
                  loop: !1
                } : void 0
              }
            ) : /* @__PURE__ */ n("img", { src: At(e), alt: "" })
          }
        ),
        l && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: l }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((u, x) => /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            disabled: i || a || !s,
            onClick: () => void k(u),
            children: [
              Oe(u, x) && /* @__PURE__ */ n("kbd", { children: Oe(u, x) }),
              u.label
            ]
          },
          u.id
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
  onChoose: l,
  onClose: s
}) {
  const [p, w] = v(
    () => r && t ? structuredClone(t) : null
  ), [c, h] = v(""), [y, N] = v(!1), C = j(null);
  ee(() => {
    var I, u;
    const g = document.activeElement, q = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (u = (I = C.current) == null ? void 0 : I.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || u.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = q, g == null || g.focus({ preventScroll: !0 });
    };
  }, []);
  function k(g) {
    var u, x, F;
    if (g.defaultPrevented) {
      g.stopPropagation();
      return;
    }
    if (g.key === "Escape") {
      X(g), y || s();
      return;
    }
    if (g.key !== "Tab") {
      g.stopPropagation();
      return;
    }
    const q = [
      ...((u = C.current) == null ? void 0 : u.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((T) => T.offsetParent !== null);
    if (!q.length) {
      X(g), (x = C.current) == null || x.focus();
      return;
    }
    const I = q.indexOf(
      document.activeElement
    );
    g.shiftKey && I <= 0 ? (X(g), (F = q.at(-1)) == null || F.focus()) : !g.shiftKey && I === q.length - 1 ? (X(g), q[0].focus()) : g.stopPropagation();
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
    ), h("");
  }
  async function M() {
    if (y) return;
    if (!p || it(p)) {
      h(p ? it(p) : "Choose a review.");
      return;
    }
    const g = { ...p, name: p.name.trim() }, q = e.some((I) => I.id === g.id) ? e.map((I) => I.id === g.id ? g : I) : [...e, g];
    N(!0), h("");
    try {
      if (!await a(q)) throw new Error("Could not save reviews.");
      l(g.id), s();
    } catch (I) {
      h(
        "Could not save reviews. Your edits are still open. " + (I instanceof Error ? I.message : "Retry saving.")
      );
    } finally {
      N(!1);
    }
  }
  async function L(g) {
    if (!y) {
      N(!0), h("");
      try {
        if (!await a(g)) throw new Error("Could not save reviews.");
      } catch (q) {
        h(
          q instanceof Error ? q.message : "Could not save reviews."
        );
      } finally {
        N(!1);
      }
    }
  }
  async function E(g) {
    var I;
    if (y) return;
    const q = (I = g.target.files) == null ? void 0 : I[0];
    if (g.target.value = "", !!q) {
      if (q.size > 2e6) {
        h("Review files must be smaller than 2 MB.");
        return;
      }
      N(!0), h("");
      try {
        const u = Ie(await q.text());
        if (!await a(ot(e, u)))
          throw new Error("Could not save reviews.");
      } catch (u) {
        h(
          u instanceof Error ? u.message : "Could not import reviews."
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
      onKeyDown: k,
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
              disabled: y,
              onClick: s,
              children: /* @__PURE__ */ n(Ft, {})
            }
          )
        ] }),
        c && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: c }),
        /* @__PURE__ */ n("fieldset", { disabled: y, className: "dq-manager-content", children: p ? /* @__PURE__ */ n(
          _r,
          {
            draft: p,
            temporary: i,
            setDraft: w,
            onSave: () => void M(),
            onCancel: s
          }
        ) : /* @__PURE__ */ d(oe, { children: [
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
                  onChange: E
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
              /* @__PURE__ */ n(Lt, {}),
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
                    e.filter((q) => q.id !== g.id)
                  );
                },
                children: /* @__PURE__ */ n(Jt, {})
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
  const l = (s, p) => r({
    ...e,
    actions: e.actions.map(
      (w, c) => c === s ? p : w
    )
  });
  return /* @__PURE__ */ d("div", { className: "dq-editor", children: [
    !t && /* @__PURE__ */ d(oe, { children: [
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
    !t && /* @__PURE__ */ d(oe, { children: [
      /* @__PURE__ */ n("h3", { children: "Actions" }),
      /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
      e.actions.map((s, p) => /* @__PURE__ */ d("fieldset", { children: [
        /* @__PURE__ */ d("legend", { children: [
          "Action ",
          p + 1
        ] }),
        /* @__PURE__ */ d("div", { className: "dq-row", children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              disabled: p === 0,
              onClick: () => r({
                ...e,
                actions: et(e.actions, p, -1)
              }),
              children: "Move action up"
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              disabled: p === e.actions.length - 1,
              onClick: () => r({
                ...e,
                actions: et(e.actions, p, 1)
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
                  ...e.actions.slice(0, p + 1),
                  {
                    ...structuredClone(s),
                    id: crypto.randomUUID(),
                    label: s.label + " copy",
                    shortcut: ""
                  },
                  ...e.actions.slice(p + 1)
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
              onChange: (w) => l(p, {
                ...s,
                shortcut: w.target.value === "auto" ? void 0 : w.target.value
              }),
              children: [
                /* @__PURE__ */ d("option", { value: "auto", children: [
                  "Position (",
                  p < 9 ? p + 1 : "none",
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
              onChange: (w) => l(p, {
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
            onMove: (h) => l(p, {
              ...s,
              steps: et(s.steps, c, h)
            }),
            onChange: (h) => l(p, {
              ...s,
              steps: s.steps.map(
                (y, N) => N === c ? h : y
              )
            }),
            onRemove: () => l(p, {
              ...s,
              steps: s.steps.filter(
                (h, y) => y !== c
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
              onClick: () => l(p, {
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
                  (w, c) => c !== p
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
            ), p = document.createElement("a");
            p.href = s, p.download = "data-quality-review.json", p.click(), URL.revokeObjectURL(s);
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
    /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: l, children: /* @__PURE__ */ n(Jt, {}) })
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
function $t({ label: e }) {
  return /* @__PURE__ */ d("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(jt, { className: "dq-spin" }),
    e
  ] });
}
function Dt({
  message: e,
  onRetry: t
}) {
  return /* @__PURE__ */ d("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(Ut, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: "Retry" })
  ] });
}
const Wr = { components: { DataQualityPage: Ur } };
export {
  Ur as DataQualityPage,
  Wr as default
};
