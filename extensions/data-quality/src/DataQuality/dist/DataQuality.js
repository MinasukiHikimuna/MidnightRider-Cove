import { jsxs as d, Fragment as we, jsx as n } from "react/jsx-runtime";
import { useState as v, useRef as P, useEffect as U, useMemo as Mt, useCallback as It, useLayoutEffect as Kn } from "react";
import { DetailListToolbar as ir, VIDEO_CRITERIA as Cr, PERFORMER_CRITERIA as Dr, VIDEO_SORT_OPTIONS as Xr, EntityReferenceMultiSelector as ht, FilterDialog as Vn, DetailListPagination as Bn, VideoPlayer as Gn, useCustomFieldFilterSection as ji, TAG_SORT_OPTIONS as Jn, TAG_CRITERIA as Qn, EntityDetailTabs as _i, TagTile as Ui, VideoCard as Ki, SortableList as jr } from "@cove/runtime/components";
import { Save as Yr, RotateCcw as zn, ChevronLeft as Wn, Pencil as Hn, Settings as Vi, AlertTriangle as _r, ChevronRight as Xn, Film as Ur, Loader2 as Yn, Tags as Bi, ExternalLink as Gi, X as Zn, Plus as Ji, Upload as Qi, Trash2 as ei, GripVertical as Zr } from "@cove/runtime/lucide-react";
import { extensionFetch as zi } from "@cove/runtime/api";
function Ee(e) {
  return e.entityType ?? "video";
}
function Tt(e, t) {
  return "qwertyuiop"[t] ?? "";
}
function wr(e) {
  if (e.entityType === "performerOccurrence") {
    if (!ri(e.occurrence))
      return "Complete the optional occurrence condition before saving.";
    if (e.actions.some((t) => t.steps.some((r) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(r.mode))))
      return "Occurrence actions support adding and removing tags on the active performer. Video tag assessments are not supported here.";
  }
  return Ee(e) === "video" && e.actions.some(
    (t) => ti(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => Pt(t, Ee(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
function Me(e) {
  const t = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, t(e.page, 1)),
    perPage: Math.max(1, Math.min(1e3, t(e.perPage, 40)))
  };
}
function Cn(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function at(e) {
  const { page: t, ...r } = e.view.filter, i = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    e.entityType === "performerOccurrence" ? ["performerOccurrence", ...i, e.occurrence] : Ee(e) === "tag" ? ["tag", ...i] : i
  );
}
function Pt(e, t) {
  const r = t ?? ("effect" in e ? "tag" : "video");
  return e.label.trim() ? r === "tag" ? !("effect" in e) || "steps" in e || !e.effect || typeof e.effect != "object" ? !1 : ["SET_TAG_GROUP", "CLEAR_TAG_GROUP", "SKIP"].includes(
    e.effect.mode
  ) && (e.effect.mode !== "SET_TAG_GROUP" || Number.isSafeInteger(e.effect.tagGroupId) && e.effect.tagGroupId > 0) : !("steps" in e) || "effect" in e ? !1 : e.steps.every(
    (i) => [
      "ADD",
      "REMOVE",
      "REMOVE_TREE",
      "MARK_PRESENT",
      "MARK_ABSENT",
      "CLEAR_ABSENCE"
    ].includes(i.mode) && i.tagIds.length > 0 && i.tagIds.every((s) => Number.isSafeInteger(s) && s > 0)
  ) && !ti(e) : !1;
}
function vr(e) {
  return "steps" in e ? e.steps.some(
    (t) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(t.mode)
  ) : !1;
}
function ti(e) {
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
function sr(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || r.entityType === "video" || r.entityType === "tag" || r.entityType === "performerOccurrence") && (r.entityType !== "performerOccurrence" || ri(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && (r.view.reviewMode === void 0 || ["single", "multiple"].includes(r.view.reviewMode)) && (r.view.selectAllOnLoad === void 0 || typeof r.view.selectAllOnLoad == "boolean") && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Wi(r.presentation, r.entityType === "tag") && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (r.entityType === "tag" ? "effect" in i && !("steps" in i) && Pt(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (s) => s && Array.isArray(s.tagIds)
      ) && Pt(i, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => wr(r)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Wi(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const r = e;
  return (r.cardSize === void 0 || r.cardSize === null || Number.isFinite(r.cardSize) && r.cardSize >= 115 && r.cardSize <= 380) && (!t || r.annotations === void 0 && r.annotationParents === void 0 && r.binParents === void 0) && (r.annotations === void 0 || Array.isArray(r.annotations) && r.annotations.every(
    (i) => ["date", "studio", "performers", "tags"].includes(i)
  )) && [r.annotationParents, r.binParents].every(
    (i) => i === void 0 || Array.isArray(i) && i.every((s) => Number.isSafeInteger(s) && s > 0)
  );
}
function Kr(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const s of i)
      r.has(s.id) || (r.add(s.id), t.push(s));
  return t;
}
function ri(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (i) => Array.isArray(i) && i.every((s) => Number.isSafeInteger(s) && s > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && (t.targetMode !== "selected" || t.performerIds.length > 0) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && ["any", "includes", "includesAll", "excludes", "isNull"].includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && r(t.tagIds) && typeof t.multiple == "boolean";
}
function Nn(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function An(e, t, r, i) {
  if (t.length === 0) return null;
  if (r == null) return t[0];
  if (!i && t.includes(r)) return r;
  const s = Math.max(0, e.indexOf(r));
  if (i) {
    for (const c of e.slice(s + 1))
      if (t.includes(c)) return c;
    if (t.includes(r)) {
      for (const c of e.slice(0, s).reverse())
        if (t.includes(c)) return c;
      return r;
    }
  }
  return t[Math.min(s, t.length - 1)];
}
function Tn(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((s) => r.has(s));
  for (const s of t)
    i ? r.delete(s) : r.add(s);
  return r;
}
function ni(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function Hi(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-actions, .dq-pagination-row, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Xi(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Yi(e, t) {
  switch (e) {
    case "ArrowLeft":
      return -1;
    case "ArrowRight":
      return 1;
    case "ArrowUp":
      return -t;
    case "ArrowDown":
      return t;
    default:
      return 0;
  }
}
const ii = "ext:com.midnightrider.data-quality:configuration", Zi = "ext:cove-data-quality:video-reviews", Vr = "ext:com.midnightrider.data-quality:progress", cr = /* @__PURE__ */ new Map(), br = /* @__PURE__ */ new Map(), Bt = (e, t) => e.includes("*") || e.includes(t), Sr = (e) => z(`/api/savedfilters?mode=${encodeURIComponent(e)}`), eo = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Br(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Gt(e) {
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
    reviews: sr(JSON.stringify(t.reviews)),
    deletedIds: Br(t.deletedIds),
    importedIds: Br(t.importedIds)
  };
}
function to(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const s of t) {
    const c = localStorage.getItem(s);
    if (c !== null) {
      const o = sr(c);
      r ?? (r = o), o.forEach((g) => i.add(g.id));
    }
    Br(
      JSON.parse(localStorage.getItem(`${s}:account-imports`) ?? "[]")
    ).forEach((o) => i.add(o));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function oi(e) {
  const t = await z("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function ai(e, t) {
  const r = (br.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return br.set(e, r), r.finally(() => {
    br.get(e) === r && br.delete(e);
  }).catch(() => {
  }), r;
}
let tr = null;
function ro() {
  if (tr) return tr;
  const e = no();
  return tr = e, e.finally(() => {
    tr === e && (tr = null);
  }).catch(() => {
  }), e;
}
async function no() {
  var T;
  const e = await z("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = Bt(e.permissions, "savedfilters.read"), s = i && Bt(e.permissions, "savedfilters.write"), c = i ? (await Sr(ii)).filter((y) => y.name === "Data Quality configuration").sort((y, q) => y.id - q.id) : [];
  if (c.length > 1) {
    const y = (q) => {
      const { revision: M, ...I } = Gt(q.uiOptions);
      return JSON.stringify(I);
    };
    if (c.some((q) => y(q) !== y(c[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (s)
      for (const q of c.slice(1))
        await z(`/api/savedfilters/${q.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${q.id}` })
        });
    c.splice(1);
  }
  let o = c.length ? Gt(c[0].uiOptions) : eo();
  const g = localStorage.getItem(`${r}:migrated`) === "true", l = localStorage.getItem(r), h = localStorage.getItem(`${r}:local-only`) === "true";
  !c.length && l && (o = Gt(l));
  let E = !c.length;
  if (c.length && h && l) {
    const y = Gt(l);
    if (y.reviews.some((M) => {
      const I = o.reviews.find((j) => j.id === M.id);
      return I && JSON.stringify(I) !== JSON.stringify(M);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const q = [
      .../* @__PURE__ */ new Set([...o.deletedIds, ...y.deletedIds])
    ];
    o = {
      ...o,
      reviews: Kr(o.reviews, y.reviews).filter(
        (M) => !q.includes(M.id)
      ),
      deletedIds: q,
      importedIds: [
        .../* @__PURE__ */ new Set([...o.importedIds, ...y.importedIds])
      ]
    }, E = !0;
  }
  if (!g) {
    const y = JSON.stringify(o), q = to(t);
    if (c.length && q.reviews.some((O) => {
      const W = o.reviews.find((ue) => ue.id === O.id);
      return W && JSON.stringify(W) !== JSON.stringify(O);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const M = i ? (await Sr(Zi)).flatMap(
      (O) => sr(O.uiOptions ?? "[]")
    ) : [], I = q.known.filter(
      (O) => !q.reviews.some((W) => W.id === O)
    ), j = /* @__PURE__ */ new Set([...o.deletedIds, ...I]);
    o = {
      ...o,
      reviews: Kr(
        q.reviews,
        o.reviews,
        M.filter(
          (O) => !q.known.includes(O.id) && !o.importedIds.includes(O.id)
        )
      ).filter((O) => !j.has(O.id)),
      deletedIds: [...j],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...o.importedIds,
          ...q.known,
          ...M.map((O) => O.id)
        ])
      ]
    }, E || (E = JSON.stringify(o) !== y);
  }
  const S = {
    userId: t,
    recordId: (T = c[0]) == null ? void 0 : T.id,
    config: o,
    readable: i,
    writable: s,
    durable: s
  };
  if (cr.set(r, S), E && s) {
    const y = o;
    c.length && (S.config = Gt(c[0].uiOptions)), await si(r, y), o = S.config;
  } else c.length || (localStorage.setItem(r, JSON.stringify(o)), !i && (!g || h) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (s)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: o.reviews,
    storageKey: r,
    canWrite: Bt(e.permissions, "videos.write"),
    canWriteVideos: Bt(e.permissions, "videos.write"),
    canWriteTags: Bt(e.permissions, "tags.write"),
    canReadTagGroups: Bt(e.permissions, "taggroups.read"),
    canConfigure: !i || s,
    storageNotice: i ? s ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function si(e, t) {
  const r = cr.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await oi(r), r.recordId != null) {
      const c = await z(
        `/api/savedfilters/${r.recordId}`
      );
      if (Gt(c.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const s = await z(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: ii,
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
function io(e, t) {
  return sr(JSON.stringify(t)), ai(e, async () => {
    const r = cr.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((s) => !t.some((c) => c.id === s.id)).map((s) => s.id);
    await si(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((s) => !t.some((c) => c.id === s))
    });
  });
}
function Rn(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([r, i]) => /^[1-9]\d*:[1-9]\d*$/.test(r) && ["reviewed", "cannotDetermine"].includes(String(i)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function oo(e, t) {
  const r = cr.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), s = i ? Rn(i) : null;
  if (!r.readable) return s;
  const c = (await Sr(Vr)).find(
    (g) => g.name === t
  ), o = c ? Rn(c.uiOptions) : null;
  return s && (!o || s.updatedAt > o.updatedAt) ? s : o;
}
function ao(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return ai(i, async () => {
    const s = cr.get(e);
    if (!(s != null && s.writable)) return;
    await oi(s);
    const c = (await Sr(Vr)).find(
      (o) => o.name === t
    );
    await z(
      c ? `/api/savedfilters/${c.id}` : "/api/savedfilters",
      {
        method: c ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Vr,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
const Qt = "confirmed_absent_tags", Nr = "Confirmed absent tags", so = {
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
function zt(e) {
  return Array.isArray(e) ? e.map(zt) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? so[r] ?? r : t === "key" && typeof r == "string" && r.toLowerCase() === Qt.toLowerCase() ? r.toLowerCase() : zt(r)
    ])
  ) : e;
}
async function z(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await zi(e, { ...t, headers: r });
  if (!i.ok) {
    let c = i.statusText || `Request failed (${i.status}).`;
    try {
      const o = await i.json();
      c = o.message || o.detail || o.error || c;
    } catch {
    }
    throw new Error(c);
  }
  if (i.status === 204 || i.status === 205) return;
  const s = await i.text();
  return s ? JSON.parse(s) : void 0;
}
const co = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let lo = 0;
function ci(e) {
  return z(`/api/videos/${e}?dqRead=${co}-${++lo}`, { cache: "no-store" });
}
async function rr(e, t, r) {
  const i = { ...e.view.objectFilter }, s = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return z("/api/videos/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      zt({
        findFilter: Me(t),
        objectFilter: i,
        filterExpression: s
      })
    )
  });
}
async function qn(e, t, r) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, z("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      zt({
        findFilter: Me(t),
        objectFilter: i
      })
    )
  });
}
function uo(e) {
  return z("/api/taggroups", { signal: e });
}
function fo(e) {
  return `/api/videos/${e.id}/image?max=1280&v=${encodeURIComponent(e.updatedAt)}`;
}
function li(e) {
  return `/api/stream/video/${e}`;
}
function kn(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function po(e) {
  return `/api/stream/video/${e}/preview`;
}
function go(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function ho(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function lr(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const i of e) {
    await z(`/api/tags/${i}`, { signal: t }), r.add(i);
    for (let s = 1; ; s++) {
      const c = await z("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          zt({
            findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
            objectFilter: {
              parentsCriterion: {
                value: [i],
                modifier: "INCLUDES",
                depth: -1
              }
            }
          })
        )
      });
      for (const o of c.items) r.add(o.id);
      if (s * 1e3 >= c.totalCount) break;
      if (!c.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...r];
}
function mo(e) {
  const t = [];
  return e.type !== "tag" && t.push('type "tag"'), e.isMultiValue || t.push("multiple values enabled"), e.entityTypes.includes("video") || t.push("video applicability"), e.filterable || t.push("filtering enabled"), t.length ? `The ${Qt} custom field is incompatible. It must have ${t.join(", ")}.` : "";
}
async function en() {
  const t = (await z("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === Qt.toLowerCase()
  );
  if (!t)
    return {
      kind: "missing",
      message: `Create the ${Nr} custom field before applying tag assessments.`
    };
  const r = mo(t);
  return r ? { kind: "incompatible", message: r } : { kind: "ready", definition: t, message: "" };
}
async function bo() {
  const e = await en();
  if (e.kind !== "ready") {
    if (e.kind === "incompatible") throw new Error(e.message);
    await z("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: Qt,
        label: Nr,
        type: "tag",
        entityTypes: ["video"],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function On(e) {
  return [...new Set(e)];
}
function yo(e, t, r) {
  const i = [...e.tagIds], s = (c) => {
    if (r === null)
      throw new Error(
        `The ${Nr} custom field is not available.`
      );
    return { customFields: { [r]: i }, customFieldMode: c };
  };
  switch (e.mode) {
    case "ADD":
      return { ids: t, tagIds: i, tagMode: "ADD" };
    case "REMOVE":
    case "REMOVE_TREE":
      return { ids: t, tagIds: i, tagMode: "REMOVE" };
    case "MARK_PRESENT":
      return { ids: t, tagIds: i, tagMode: "ADD", ...s("REMOVE") };
    case "MARK_ABSENT":
      return { ids: t, tagIds: i, tagMode: "REMOVE", ...s("ADD") };
    case "CLEAR_ABSENCE":
      return { ids: t, ...s("REMOVE") };
  }
}
async function di(e, t) {
  if (!Pt(e) || t.length === 0 || t.some((l) => !Number.isSafeInteger(l) || l <= 0))
    throw new Error("Choose videos and configure a valid action first.");
  let r = null;
  if (vr(e)) {
    let l;
    try {
      l = await en();
    } catch (h) {
      throw new Error(
        `Could not verify the ${Nr} custom field. ${h instanceof Error ? h.message : "Request failed."}`
      );
    }
    if (l.kind !== "ready") throw new Error(l.message);
    r = l.definition.key;
  }
  const i = On(t), s = await Promise.all(
    e.steps.map(async (l) => ({
      mode: l.mode,
      tagIds: l.mode === "REMOVE_TREE" ? await lr(l.tagIds) : On(l.tagIds)
    }))
  ), c = (l) => ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(l), g = [
    ...s.filter((l) => !c(l.mode)),
    ...s.filter((l) => c(l.mode))
  ].map(
    (l) => yo(l, i, r)
  );
  for (let l = 0; l < g.length; l++)
    try {
      await z("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify(g[l])
      });
    } catch (h) {
      throw new Error(
        `Step ${l + 1} failed; ${l} earlier step(s) completed. Refresh and check the selected videos before retrying. ${h instanceof Error ? h.message : "Request failed."}`
      );
    }
}
async function wo(e, t) {
  if (!Pt(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await z("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
function Er(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function tn(e) {
  return String(e.type).toLowerCase() === "tag";
}
function rn(e) {
  return !!String(e ?? "").trim();
}
function nn(e) {
  return [
    ...new Set(
      Er(e.customFieldCriteria).filter(tn).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !rn(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function on(e, t) {
  const r = Er(e.customFieldCriteria);
  if (!r.length) return e;
  let i = !1;
  const s = r.map((c) => {
    if (!tn(c)) return c;
    const o = { ...c };
    for (const [g, l] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const h = t[String(c[g] ?? "")];
      h && !rn(c[l]) && (o[l] = h, i = !0);
    }
    return o;
  });
  return i ? { ...e, customFieldCriteria: s } : e;
}
function ui(e, t, r) {
  const i = Er(e.customFieldCriteria);
  if (!i.length) return e;
  const s = Er(r.customFieldCriteria), c = (l, h) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (E) => (l[E] ?? void 0) === (h[E] ?? void 0)
  );
  let o = !1;
  const g = i.map((l) => {
    if (!tn(l)) return l;
    const h = s.find((S) => c(S, l));
    if (!h) return l;
    const E = { ...l };
    for (const [S, T] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const y = t[String(l[S] ?? "")];
      y && l[T] === y && !rn(h[T]) && (delete E[T], o = !0);
    }
    return E;
  });
  return o ? { ...e, customFieldCriteria: g } : e;
}
async function vo(e, t, r) {
  if (!Pt(r) || r.steps.some(
    (c) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(c.mode)
  ))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const i = await Promise.all(
    r.steps.map(async (c) => ({
      ...c,
      tagIds: c.mode === "REMOVE_TREE" ? await lr(c.tagIds) : c.tagIds
    }))
  );
  let s = t.applications;
  for (const c of i)
    s = await gi(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: c.tagIds,
          multiple: !0
        }
      },
      t,
      c.mode === "ADD" ? c.tagIds : []
    );
  return s;
}
async function an(e, t) {
  const r = e.occurrence;
  if (r.targetMode === "all" || r.targetMode === "filter" && Object.keys(r.performerFilter).length === 0) return null;
  if (r.targetMode === "selected") return r.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: s, ...c } = r.performerFilter;
  for (let o = 1; ; o++) {
    const g = await z("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        zt({
          findFilter: { page: o, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: c,
          filterExpression: s
        })
      )
    });
    if (g.items.forEach((l) => i.add(l.id)), o * 1e3 >= g.totalCount) return [...i];
    if (!g.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function fi(e, t) {
  const { _filterExpression: r, ...i } = e.view.objectFilter, s = e.occurrence, c = {
    mode: "atLeastOne",
    conditionOperator: "and",
    ...t === null ? {} : {
      performerIdsCriterion: { modifier: "includes", value: t }
    },
    ...s.condition === "any" ? {} : {
      performerOccurrenceTagsCriterion: {
        modifier: s.condition,
        value: s.conditionTagIds,
        depth: s.includeSubtags === !1 ? 0 : -1
      }
    }
  };
  return {
    ...e,
    entityType: "video",
    actions: [],
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...r ? [{ group: r }] : [],
            { filter: i },
            { filter: { performerFilterCriterion: c } }
          ]
        }
      }
    }
  };
}
function So(e, t, r = e.conditionTagIds.map((i) => [i])) {
  const i = new Set(t), s = (c) => c.some((o) => i.has(o));
  switch (e.condition) {
    case "any":
      return !0;
    case "isNull":
      return i.size === 0;
    case "includes":
      return r.some(s);
    case "includesAll":
      return r.every(s);
    case "excludes":
      return !r.some(s);
  }
}
async function pi(e, t, r, i) {
  if ((t == null ? void 0 : t.length) === 0)
    return { items: [], totalCount: 0 };
  const s = await rr(
    fi(e, t),
    { ...e.view.filter, page: r },
    i
  ), c = t === null ? null : new Set(t), o = e.occurrence, g = s.items.length && o.includeSubtags !== !1 && !["any", "isNull"].includes(o.condition) ? await Promise.all(o.conditionTagIds.map((E) => lr([E], i))) : o.conditionTagIds.map((E) => [E]), l = new Array(s.items.length);
  let h = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, s.items.length) }, async () => {
      for (; h < s.items.length; ) {
        const E = h++, S = s.items[E], T = await z(
          `/api/tagapplications?hostType=video&hostId=${S.id}&contextType=performer`,
          { signal: i }
        );
        l[E] = S.performers.filter((y) => c === null || c.has(y.id)).flatMap((y) => {
          const q = T.filter(
            (M) => M.hostType === "video" && M.hostId === S.id && M.contextType === "performer" && M.contextId === y.id
          );
          return So(
            e.occurrence,
            q.map((M) => M.tag.id),
            g
          ) ? [
            {
              key: `${S.id}:${y.id}`,
              video: S,
              performer: y,
              applications: q
            }
          ] : [];
        });
      }
    })
  ), { items: l.flat(), totalCount: s.totalCount };
}
async function gi(e, t, r) {
  const i = new Set(e.occurrence.tagIds);
  if (r.some((l) => !i.has(l)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const s = await ci(t.video.id);
  if (!s.performers.some(
    (l) => l.id === t.performer.id
  ))
    throw new Error(
      "This performer is no longer linked to the scene. Refresh the queue."
    );
  const c = `/api/tagapplications?hostType=video&hostId=${s.id}&contextType=performer&contextId=${t.performer.id}`, o = (await z(c)).filter(
    (l) => l.hostType === "video" && l.hostId === s.id && l.contextType === "performer" && l.contextId === t.performer.id
  ), g = new Set(r);
  try {
    for (const l of g)
      o.some((h) => h.tag.id === l) || await z("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: "video",
          hostId: s.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: l,
          sourceKey: "user"
        })
      });
    for (const l of o)
      i.has(l.tag.id) && !g.has(l.tag.id) && await z(`/api/tagapplications/${l.id}`, {
        method: "DELETE"
      });
    return await z(c);
  } catch (l) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${l instanceof Error ? l.message : "Request failed."}`
    );
  }
}
function mt(e, t) {
  return {
    added: t.filter((r) => !e.includes(r)),
    removed: e.filter((r) => !t.includes(r))
  };
}
function Eo(e) {
  return `/api/tagapplications?hostType=video&hostId=${e.video.id}&contextType=performer&contextId=${e.occurrence.performer.id}`;
}
async function tt(e) {
  var c;
  if (e.occurrence) {
    const o = (await z(Eo(e))).filter(
      (g) => g.hostType === "video" && g.hostId === e.video.id && g.contextType === "performer" && g.contextId === e.occurrence.performer.id
    );
    return {
      ids: [...new Set(o.map((g) => g.tag.id))],
      names: [...new Set(o.map((g) => g.tag.name))],
      absent: [],
      applications: o
    };
  }
  const t = await ci(e.video.id), r = (t.tags ?? []).filter(
    (o) => o.canRemove !== !1 || o.isDerived !== !0
  ), i = Object.keys(t.customFields ?? {}).find(
    (o) => o.toLowerCase() === Qt
  ) ?? Qt, s = ((c = t.customFields) == null ? void 0 : c[i]) ?? [];
  if (!Array.isArray(s) || s.some((o) => !Number.isSafeInteger(o)))
    throw new Error(
      "Confirmed absent tags are invalid. Inspect the video before editing."
    );
  return { ids: r.map((o) => o.id), names: r.map((o) => o.name), absent: s };
}
async function sn(e, t, r) {
  if (t.occurrence && e.entityType === "performerOccurrence")
    await gi(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: [...r.added, ...r.removed],
          multiple: !0
        }
      },
      t.occurrence,
      r.added
    );
  else
    for (const [i, s] of [
      ["ADD", r.added],
      ["REMOVE", r.removed]
    ])
      s.length && await z("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({ ids: [t.video.id], tagMode: i, tagIds: s })
      });
}
async function Co(e, t, r) {
  t.occurrence && e.entityType === "performerOccurrence" ? await vo(e, t.occurrence, r) : await di(r, [t.video.id]);
}
function Gr(e, t, r, i) {
  const s = (c) => c.filter((o) => i.includes(o));
  return {
    item: e,
    before: t,
    after: r,
    tags: mt(s(t.ids), s(r.ids)),
    absence: mt(s(t.absent), s(r.absent))
  };
}
function No(e, t) {
  var r;
  for (const [i, s] of [
    [e.tags, t.ids],
    [e.absence, t.absent]
  ])
    if (i.added.some((c) => !s.includes(c)) || i.removed.some((c) => s.includes(c)))
      throw new Error(
        "Undo conflict: affected tags changed since this operation. Inspect the item; no undo changes were made."
      );
  if (t.applications)
    for (const i of e.tags.added) {
      const s = (r = e.after.applications) == null ? void 0 : r.filter((o) => o.tag.id === i).map((o) => o.id).sort(), c = t.applications.filter((o) => o.tag.id === i).map((o) => o.id).sort();
      if (JSON.stringify(s) !== JSON.stringify(c))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
const Jr = (e) => e instanceof Error ? e.message : "Request failed.", In = (e) => [...e].sort((t, r) => t - r), or = (e, t) => JSON.stringify(In(e)) === JSON.stringify(In(t)), Qr = (e) => !!(e.tags.added.length || e.tags.removed.length);
function hi(e, t) {
  const r = new Set(e);
  for (const i of t.steps)
    for (const s of i.tagIds)
      i.mode === "ADD" ? r.add(s) : r.delete(s);
  return [...r];
}
async function Ao(e, t, r, i = () => {
}) {
  if (!Pt(t, "performerOccurrence") || !t.steps.length || t.steps.some(
    (h) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(h.mode)
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const s = structuredClone(e), c = structuredClone(t);
  for (const h of c.steps)
    h.mode === "REMOVE_TREE" && (h.tagIds = await lr(h.tagIds, r), h.mode = "REMOVE");
  r.throwIfAborted();
  const o = [...new Set(c.steps.flatMap((h) => h.tagIds))];
  s.view.filter = {
    ...s.view.filter,
    page: 1,
    perPage: 250,
    sort: "id",
    direction: "asc",
    sorts: void 0
  };
  const g = await an(s, r), l = /* @__PURE__ */ new Map();
  for (let h = 1; ; h++) {
    r.throwIfAborted();
    const E = await pi(s, g, h, r);
    for (const S of E.items) {
      const T = {
        ids: [...new Set(S.applications.map((q) => q.tag.id))],
        names: S.applications.map((q) => q.tag.name),
        absent: [],
        applications: S.applications
      }, y = hi(T.ids, c);
      l.set(S.key, {
        item: { key: S.key, video: S.video, occurrence: S },
        before: T,
        expected: T,
        desired: y,
        conflict: mt(T.ids, y).removed.length > 0,
        status: or(T.ids, y) ? "unchanged" : "pending"
      });
    }
    if (i(l.size), h * 250 >= E.totalCount) break;
    if (h > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return r.throwIfAborted(), { review: s, action: c, touched: o, entries: [...l.values()] };
}
function To(e, t, r) {
  const i = (c) => c.ids.filter((o) => r.includes(o));
  if (!or(i(e), i(t))) return !1;
  const s = (c) => (c.applications ?? []).filter((o) => r.includes(o.tag.id)).map((o) => o.id);
  return or(s(e), s(t));
}
async function mi(e, t, r, i) {
  let s = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; !t() && s < e.length; ) {
        const c = e[s++];
        await r(c), i();
      }
    })
  );
}
async function Ro(e, t, r, i, s = !1) {
  const c = e.entries.filter(
    (o) => s ? o.status === "failed" : o.status === "pending"
  );
  await mi(
    c,
    r,
    async (o) => {
      if (o.conflict && !t) {
        o.status = "skipped", o.error = "Conflicting answer skipped.";
        return;
      }
      if (o.unverified) {
        o.error = "The previous write could not be verified. Inspect this occurrence and create a fresh preview before further changes.";
        return;
      }
      let g;
      try {
        if (g = await tt(o.item), !To(o.expected, g, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (T) {
        o.status = "failed", o.error = Jr(T);
        return;
      }
      const l = hi(g.ids, e.action), h = mt(g.ids, l);
      let E;
      try {
        await sn(e.review, o.item, h);
      } catch (T) {
        E = T;
      }
      let S = !1;
      try {
        const T = await tt(o.item);
        S = !0, o.expected = T;
        const y = Gr(
          o.item,
          o.before,
          T,
          e.touched
        );
        if (o.operation = Qr(y) ? y : void 0, E) throw E;
        if (!or(
          T.ids.filter((q) => e.touched.includes(q)),
          l.filter((q) => e.touched.includes(q))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (T) {
        if (o.status = "failed", o.error = Jr(T), !S)
          try {
            const y = await tt(o.item);
            o.expected = y;
            const q = Gr(
              o.item,
              o.before,
              y,
              e.touched
            );
            o.operation = Qr(q) ? q : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    i
  );
}
async function qo(e, t, r) {
  await mi(
    e.entries.filter((i) => i.operation),
    t,
    async (i) => {
      const s = i.operation;
      if (i.unverified) {
        i.error = "Undo unavailable: the previous write could not be verified. Inspect this occurrence.";
        return;
      }
      const c = [...s.tags.added, ...s.tags.removed];
      let o = !1;
      try {
        const g = await tt(i.item);
        No(s, g), o = !0, await sn(e.review, i.item, {
          added: s.tags.removed,
          removed: s.tags.added
        });
        const l = await tt(i.item);
        if (!or(
          l.ids.filter((h) => c.includes(h)),
          i.before.ids.filter((h) => c.includes(h))
        ))
          throw new Error("Undo did not restore all affected tags.");
        i.operation = void 0, i.expected = l, i.status = "unchanged", i.error = void 0;
      } catch (g) {
        if (i.error = `Undo stopped: ${Jr(g)}`, i.status = "failed", o)
          try {
            const l = await tt(i.item), h = Gr(
              i.item,
              i.before,
              l,
              c
            );
            i.operation = Qr(h) ? h : void 0, i.expected = l;
          } catch {
            i.unverified = !0;
          }
      }
    },
    r
  );
}
async function Mn(e, t, r) {
  const i = new Array(e.length);
  let s = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; s < e.length; ) {
        r.throwIfAborted();
        const c = s++, o = e[c];
        try {
          i[c] = [
            o,
            (await z(`/api/${t}/${o}`, {
              signal: r
            })).name
          ];
        } catch {
          r.throwIfAborted(), i[c] = [
            o,
            `${t === "tags" ? "Tag" : "Performer"} ${o}`
          ];
        }
      }
    })
  ), i;
}
function ko({
  review: e,
  disabled: t,
  hidden: r = !1,
  onOpen: i,
  onClose: s,
  onWrite: c
}) {
  const [o, g] = v(!1), [l, h] = v(null), [E, S] = v(""), [T, y] = v(!1), [q, M] = v(!1), [I, j] = v(""), [O, W] = v(""), [ue, Pe] = v({}), [p, $] = v(!1), [C, _] = v(!1), L = p && l ? l.review : e, [Ce, ie] = v(!1), [Ft, ce] = v([]), [rt, Fe] = v(!1), [, nt] = v(0), me = P(null), ct = P(null), ee = P(!1), Ne = P(null), ve = P(!1), be = P(!1), xe = P({ onClose: s, onWrite: c });
  xe.current = { onClose: s, onWrite: c }, U(() => {
    var b;
    o && ((b = me.current) == null || b.showModal());
  }, [o]), U(() => {
    if (!o || L.occurrence.targetMode !== "selected") return;
    const b = new AbortController();
    return ce([]), Mn(
      L.occurrence.performerIds,
      "performers",
      b.signal
    ).then((R) => {
      b.signal.aborted || ce(R.map(([, fe]) => fe));
    }).catch(() => {
    }), () => b.abort();
  }, [
    o,
    L.occurrence.targetMode,
    JSON.stringify(L.occurrence.performerIds)
  ]), U(
    () => () => {
      var b;
      ee.current = !0, (b = Ne.current) == null || b.abort();
    },
    []
  ), U(() => {
    if (!q) return;
    const b = (R) => {
      R.preventDefault(), R.returnValue = "";
    };
    return window.addEventListener("beforeunload", b), () => window.removeEventListener("beforeunload", b);
  }, [q]);
  function it() {
    be.current || (g(!1), xe.current.onClose(ve.current), ve.current = !1, requestAnimationFrame(() => {
      var b;
      return (b = ct.current) == null ? void 0 : b.focus();
    }));
  }
  async function re() {
    const b = e.actions.find((R) => R.id === E);
    if (!(!b || be.current)) {
      be.current = !0, M(!0), j(""), W("Loading all matching occurrences…"), h(null), $(!1), _(!1), Fe(!1), Ne.current = new AbortController();
      try {
        const R = await Ao(
          e,
          b,
          Ne.current.signal,
          (Qe) => W(`Loaded ${Qe.toLocaleString()} matching occurrences…`)
        ), fe = await Mn(
          [
            .../* @__PURE__ */ new Set([
              ...R.touched,
              ...R.review.occurrence.conditionTagIds,
              ...nn(R.review.view.objectFilter)
            ])
          ],
          "tags",
          Ne.current.signal
        );
        Ne.current.signal.throwIfAborted(), Pe(Object.fromEntries(fe)), h(R), W("Preview ready. No tags have been changed.");
      } catch (R) {
        j(
          Ne.current.signal.aborted ? "Preview cancelled. No tags were changed." : String(R instanceof Error ? R.message : R)
        ), W("");
      } finally {
        be.current = !1, M(!1), Ne.current = null;
      }
    }
  }
  async function Je(b) {
    if (!l || be.current) return;
    be.current = !0, ee.current = !1, ve.current = !0, xe.current.onWrite(), M(!0), $(!0), j(""), b === "undo" && _(!0), W(b === "undo" ? "Undoing batch…" : "Applying batch…");
    const R = () => nt((fe) => fe + 1);
    try {
      b === "undo" ? await qo(l, () => ee.current, R) : await Ro(
        l,
        T,
        () => ee.current,
        R,
        b === "retry"
      ), W(
        ee.current ? "Stopped after in-flight operations settled. Completed changes are retained." : b === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (fe) {
      j(fe instanceof Error ? fe.message : String(fe));
    } finally {
      be.current = !1, M(!1), R();
    }
  }
  const oe = (l == null ? void 0 : l.entries) ?? [], ye = oe.filter((b) => b.conflict), H = (b) => oe.filter((R) => R.status === b).length, ne = p && l ? [l.action] : e.actions.filter((b) => b.steps.length), B = oe.some((b) => b.operation), N = (b) => b.map((R) => ue[R] ?? `Tag ${R}`).join(", ") || "None";
  return /* @__PURE__ */ d(we, { children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-button",
        hidden: r,
        ref: ct,
        disabled: t || !ne.length,
        onClick: () => {
          var b;
          p || (h(null), W(""), j("")), i(), g(!0), S(
            ne.some((R) => R.id === E) ? E : ((b = ne[0]) == null ? void 0 : b.id) ?? ""
          );
        },
        children: p ? "Batch results / undo" : "Apply to all matching occurrences"
      }
    ),
    o && /* @__PURE__ */ d(
      "dialog",
      {
        ref: me,
        className: "dq-batch-dialog",
        "aria-labelledby": "dq-batch-title",
        "aria-modal": "true",
        onCancel: (b) => {
          b.preventDefault(), it();
        },
        children: [
          /* @__PURE__ */ n("h2", { id: "dq-batch-title", children: "Batch occurrence approval" }),
          /* @__PURE__ */ n("p", { children: "Apply one answer across all matching pages. Only targeted performer occurrences change." }),
          /* @__PURE__ */ n("p", { children: "Keep this page open while running. Results and undo last until you leave this workspace." }),
          /* @__PURE__ */ d("fieldset", { disabled: q || p, children: [
            /* @__PURE__ */ n("legend", { children: "Batch scope and action" }),
            /* @__PURE__ */ n("p", { children: "Uses your current filters. To include every existing appearance, remove filters that exclude already answered occurrences." }),
            /* @__PURE__ */ d("p", { children: [
              "Performer scope:",
              " ",
              L.occurrence.targetMode === "all" ? "All performers" : L.occurrence.targetMode === "selected" ? Ft.join(", ") || `${L.occurrence.performerIds.length} selected performer(s)` : "Matching performer criteria",
              ". Occurrence condition:",
              " ",
              L.occurrence.condition === "any" ? "Any occurrence tags" : {
                includes: "Has any selected tag",
                includesAll: "Has all selected tags",
                excludes: "Has none of the selected tags",
                isNull: "Has no occurrence tags"
              }[L.occurrence.condition],
              "."
            ] }),
            L.occurrence.conditionTagIds.length > 0 && l && /* @__PURE__ */ d("p", { children: [
              "Condition tags:",
              " ",
              N(L.occurrence.conditionTagIds),
              L.occurrence.includeSubtags === !1 ? " (exact tags only)" : " (including subtags)",
              "."
            ] }),
            /* @__PURE__ */ d("p", { children: [
              "Search: ",
              String(L.view.filter.q || "Any"),
              ".",
              " ",
              Object.keys(L.view.objectFilter).length === 0 && "Scene filters: None."
            ] }),
            /* @__PURE__ */ n(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": "Batch scene filters",
                children: /* @__PURE__ */ n(
                  ir,
                  {
                    filter: L.view.filter,
                    objectFilter: on(
                      L.view.objectFilter,
                      ue
                    ),
                    criteriaDefinitions: Cr,
                    customFieldEntityType: "video",
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !0,
                    showSort: !1,
                    showPagingControls: !1,
                    onFilterChange: () => {
                    },
                    onObjectFilterChange: () => {
                    }
                  }
                )
              }
            ),
            L.occurrence.targetMode === "filter" && /* @__PURE__ */ n(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": "Batch performer criteria",
                children: /* @__PURE__ */ n(
                  ir,
                  {
                    filter: {},
                    objectFilter: L.occurrence.performerFilter,
                    criteriaDefinitions: Dr,
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    onFilterChange: () => {
                    },
                    onObjectFilterChange: () => {
                    }
                  }
                )
              }
            ),
            !ne.length && /* @__PURE__ */ n("p", { children: "Configure an occurrence tag action in this review before starting a batch." }),
            /* @__PURE__ */ d("label", { children: [
              "Answer",
              " ",
              /* @__PURE__ */ n(
                "select",
                {
                  "aria-label": "Batch answer",
                  value: E,
                  onChange: (b) => {
                    S(b.target.value), h(null), W("");
                  },
                  children: ne.map((b) => /* @__PURE__ */ n("option", { value: b.id, children: b.label }, b.id))
                }
              )
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: !ne.length,
                onClick: () => void re(),
                children: "Preview all matches"
              }
            ),
            /* @__PURE__ */ d("label", { children: [
              "Conflicting answers",
              " ",
              /* @__PURE__ */ d(
                "select",
                {
                  "aria-label": "Conflicting answers",
                  value: T ? "replace" : "skip",
                  onChange: (b) => y(b.target.value === "replace"),
                  children: [
                    /* @__PURE__ */ n("option", { value: "skip", children: "Skip conflicts" }),
                    /* @__PURE__ */ n("option", { value: "replace", children: "Replace conflicting answers" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ n("p", { children: "Conflicts are existing tags this action removes. Configure opposite answers as removals." })
          ] }),
          /* @__PURE__ */ d("div", { "aria-live": "polite", children: [
            O && /* @__PURE__ */ n("p", { role: "status", children: O }),
            I && /* @__PURE__ */ n("p", { role: "alert", children: I }),
            l && /* @__PURE__ */ d(we, { children: [
              /* @__PURE__ */ n("p", { children: /* @__PURE__ */ d("strong", { children: [
                oe.length.toLocaleString(),
                " occurrences in",
                " ",
                new Set(
                  oe.map((b) => b.item.video.id)
                ).size.toLocaleString(),
                " ",
                "scenes"
              ] }) }),
              p ? /* @__PURE__ */ d("p", { children: [
                H("changed"),
                " changed; ",
                H("unchanged"),
                " unchanged;",
                " ",
                H("skipped"),
                " skipped; ",
                H("failed"),
                " failed;",
                " ",
                H("pending"),
                " remaining."
              ] }) : /* @__PURE__ */ d("p", { children: [
                oe.filter(
                  (b) => b.status === "pending" && (T || !b.conflict)
                ).length.toLocaleString(),
                " ",
                "to change; ",
                H("unchanged").toLocaleString(),
                " already correct; ",
                ye.length.toLocaleString(),
                " conflicts (",
                T ? "will replace" : "will skip",
                ")."
              ] })
            ] })
          ] }),
          l && /* @__PURE__ */ d(we, { children: [
            !p && /* @__PURE__ */ d("p", { children: [
              "Planned additions:",
              " ",
              N([
                ...new Set(
                  oe.filter((b) => T || !b.conflict).flatMap(
                    (b) => mt(b.before.ids, b.desired).added
                  )
                )
              ]),
              ". Planned removals:",
              " ",
              N([
                ...new Set(
                  oe.filter((b) => T || !b.conflict).flatMap(
                    (b) => mt(b.before.ids, b.desired).removed
                  )
                )
              ]),
              "."
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => Fe(!rt),
                children: rt ? "Hide occurrence details" : "Inspect occurrences and conflicts"
              }
            ),
            rt && /* @__PURE__ */ n("div", { className: "dq-batch-items", children: /* @__PURE__ */ d("table", { children: [
              /* @__PURE__ */ n("thead", { children: /* @__PURE__ */ d("tr", { children: [
                /* @__PURE__ */ n("th", { children: "Occurrence" }),
                /* @__PURE__ */ n("th", { children: "Changes / result" })
              ] }) }),
              /* @__PURE__ */ n("tbody", { children: oe.map((b) => {
                var R;
                return /* @__PURE__ */ d("tr", { children: [
                  /* @__PURE__ */ n("td", { children: /* @__PURE__ */ d(
                    "a",
                    {
                      href: `/video/${b.item.video.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      children: [
                        (R = b.item.occurrence) == null ? void 0 : R.performer.name,
                        " —",
                        " ",
                        b.item.video.title || "Scene"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ d("td", { children: [
                    b.conflict && /* @__PURE__ */ n("strong", { children: "Conflict. " }),
                    p ? `${b.status}. ${b.error ?? ""}` : `Add: ${N(mt(b.before.ids, b.desired).added)}; Remove: ${N(mt(b.before.ids, b.desired).removed)}`
                  ] })
                ] }, b.item.key);
              }) })
            ] }) }),
            /* @__PURE__ */ d("div", { className: "dq-row", children: [
              !C && /* @__PURE__ */ d(we, { children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button primary",
                    disabled: q || !H("pending"),
                    onClick: () => void Je("apply"),
                    children: p ? "Continue remaining" : "Apply batch"
                  }
                ),
                p && H("failed") > 0 && /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: q,
                    onClick: () => void Je("retry"),
                    children: "Retry failed occurrences"
                  }
                )
              ] }),
              B && /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  disabled: q,
                  onClick: () => void Je("undo"),
                  children: "Undo batch"
                }
              )
            ] })
          ] }),
          Ce && /* @__PURE__ */ d("div", { role: "group", "aria-label": "Discard batch results", children: [
            /* @__PURE__ */ n("p", { children: "Starting a new batch discards these results and their undo history. Existing tag changes remain." }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: q,
                onClick: () => {
                  var b;
                  h(null), $(!1), y(!1), S(
                    ((b = e.actions.find((R) => R.steps.length)) == null ? void 0 : b.id) ?? ""
                  ), _(!1), W(""), ie(!1);
                },
                children: "Discard results and start new batch"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => ie(!1),
                children: "Keep results"
              }
            )
          ] }),
          /* @__PURE__ */ d("div", { className: "dq-row", children: [
            q && /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => {
                  var b;
                  ee.current = !0, (b = Ne.current) == null || b.abort(), W("Stopping after in-flight operations settle…");
                },
                children: [
                  "Cancel ",
                  Ne.current ? "preview" : "run"
                ]
              }
            ),
            p && /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: q,
                onClick: () => ie(!0),
                children: "New batch"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: q,
                onClick: it,
                children: "Close"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
function ar(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((o, g) => ar(o, t[g]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, s = Object.keys(r).sort(), c = Object.keys(i).sort();
  return s.length === c.length && s.every(
    (o, g) => o === c[g] && ar(r[o], i[o])
  );
}
const Ar = [
  "q",
  "page",
  "perPage",
  "sort",
  "direction",
  "sorts",
  "seed",
  "filters",
  "searchMode",
  "performerScope",
  "startFrom"
], Oo = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0
};
function Jt(e) {
  const t = e.entityType === "performerOccurrence" ? e.occurrence : void 0;
  return {
    filter: Me({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }),
    objectFilter: structuredClone(e.view.objectFilter),
    searchMode: e.view.searchMode,
    startFrom: e.view.startFrom ?? "end",
    ...t ? {
      performerScope: {
        targetMode: t.targetMode,
        performerIds: [...t.performerIds],
        performerFilter: structuredClone(t.performerFilter),
        condition: t.condition,
        conditionTagIds: [...t.conditionTagIds],
        includeSubtags: t.includeSubtags ?? !0
      }
    } : {}
  };
}
function Pn(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function zr(e, t) {
  if (!Ar.some((o) => t.has(o))) {
    const o = Jt(e);
    return { query: o, startAtEnd: o.startFrom === "end" };
  }
  const i = {
    q: t.get("q") ?? "",
    page: Number(t.get("page") ?? 1),
    perPage: Number(t.get("perPage") ?? 40),
    sort: t.get("sort") ?? "date",
    direction: t.get("direction") === "asc" ? "asc" : "desc"
  };
  if (t.has("seed") && (i.seed = Number(t.get("seed"))), t.get("sorts")) {
    const o = t.get("sorts").split(",").map((g) => {
      const l = g.lastIndexOf(":");
      return { key: g.slice(0, l), direction: g.slice(l + 1) };
    });
    if (o.some((g) => !g.key || !["asc", "desc"].includes(g.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = o, i.sort = o[0].key, i.direction = o[0].direction;
  }
  let s;
  if (e.entityType === "performerOccurrence" && (s = {
    ...Oo,
    ...Pn(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(s.targetMode) || !["any", "includes", "includesAll", "excludes", "isNull"].includes(
    s.condition
  ) || !Array.isArray(s.performerIds) || !Array.isArray(s.conditionTagIds) || typeof s.includeSubtags != "boolean" || [...s.performerIds, ...s.conditionTagIds].some(
    (o) => !Number.isSafeInteger(o) || o <= 0
  ) || !s.performerFilter || typeof s.performerFilter != "object" || Array.isArray(s.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const c = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Me(i),
      objectFilter: Pn(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: c,
      performerScope: s
    },
    startAtEnd: !t.has("page") && c === "end"
  };
}
function nr(e, t) {
  const r = new URLSearchParams(window.location.search);
  Ar.forEach((i) => r.delete(i)), r.set("review", e);
  for (const i of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[i] !== void 0 && r.set(i, String(t.filter[i]));
  Array.isArray(t.filter.sorts) && r.set(
    "sorts",
    t.filter.sorts.map((i) => `${i.key}:${i.direction}`).join(",")
  ), r.set("filters", JSON.stringify(t.objectFilter)), r.set("searchMode", t.searchMode), r.set("startFrom", t.startFrom), t.performerScope && r.set("performerScope", JSON.stringify(t.performerScope)), window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${r}${window.location.hash}`
  );
}
function st(e, t) {
  const r = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return e.entityType === "performerOccurrence" ? {
    ...e,
    view: r,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: r };
}
function Fn({
  performer: e
}) {
  return /* @__PURE__ */ d("span", { className: "dq-performer-avatar", "aria-hidden": "true", children: [
    /* @__PURE__ */ n("span", { children: e.name.trim().split(/\s+/).slice(0, 2).map((t) => t[0]).join("").toUpperCase() || "?" }),
    /* @__PURE__ */ n(
      "img",
      {
        src: `/api/performers/${e.id}/image?max=64`,
        alt: "",
        loading: "lazy",
        onError: (t) => {
          t.currentTarget.style.display = "none";
        }
      },
      e.id
    )
  ] });
}
function $r(e, t) {
  if (!t) return e;
  const r = /* @__PURE__ */ new Map();
  for (const i of e)
    r.set(i.video.id, [...r.get(i.video.id) ?? [], i]);
  return [...r.values()].reverse().flat();
}
const Ze = (e) => e instanceof Error ? e.message : "Request failed.";
function Io({
  actions: e,
  disabled: t,
  canWrite: r,
  onApply: i
}) {
  const [s, c] = v({});
  U(() => {
    let g = !0;
    return Promise.all(
      [
        ...new Set(
          e.flatMap(
            (l) => l.steps.flatMap((h) => h.tagIds)
          )
        )
      ].map(async (l) => {
        try {
          return [
            l,
            (await z(`/api/tags/${l}`)).name
          ];
        } catch {
          return [l, "Unavailable tag"];
        }
      })
    ).then((l) => {
      g && c(Object.fromEntries(l));
    }), () => {
      g = !1;
    };
  }, [e]);
  const o = {
    ADD: "Add",
    REMOVE: "Remove",
    REMOVE_TREE: "Remove tree",
    MARK_PRESENT: "Mark present",
    MARK_ABSENT: "Mark absent",
    CLEAR_ABSENCE: "Clear absence"
  };
  return /* @__PURE__ */ d("div", { className: "dq-review-actions", children: [
    /* @__PURE__ */ n("p", { children: "Actions apply and advance. Shift-click or Shift + shortcut applies and stays." }),
    e.map((g, l) => /* @__PURE__ */ d("div", { className: "dq-action-pair", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: t || !r && g.steps.length > 0,
          onClick: (h) => i(g, h.shiftKey),
          children: /* @__PURE__ */ d("span", { children: [
            Tt(g, l) && /* @__PURE__ */ n("kbd", { children: Tt(g, l) }),
            " ",
            g.label
          ] })
        }
      ),
      g.steps.length > 0 && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button dq-apply-stay-button",
          disabled: t || !r,
          "aria-label": `Apply & stay: ${g.label}`,
          title: `Apply & stay: ${g.label}`,
          onClick: () => i(g, !0),
          children: /* @__PURE__ */ n(Yr, { "aria-hidden": "true" })
        }
      ),
      g.steps.length > 0 && /* @__PURE__ */ n("small", { className: "dq-review-action-summary", children: g.steps.map(
        (h) => `${o[h.mode]}: ${h.tagIds.map((E) => s[E] ?? "Loading tag…").join(", ")}`
      ).join("; ") })
    ] }, g.id))
  ] });
}
function Mo({
  review: e,
  canWrite: t,
  onBusy: r,
  onSaveDefaults: i,
  editRequest: s = 0,
  renderRuleEditor: c
}) {
  var je;
  const o = P(null), g = P("");
  if (!o.current)
    try {
      o.current = zr(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (u) {
      g.current = Ze(u), o.current = { query: Jt(e), startAtEnd: !1 };
    }
  const [l, h] = v(null), E = P(null), S = P(null), T = P(null), [y, q] = v(!!g.current), M = P(0), [I, j] = v(o.current.query), O = P(I);
  O.current = I;
  const [W, ue] = v(0), Pe = P(o.current.startAtEnd), [p, $] = v([]), [C, _] = v(null), L = P(null), [Ce, ie] = v(null), [Ft, ce] = v(0), rt = Mt(() => {
    if (!C) return null;
    const u = p.findIndex((m) => m.key === C.key);
    return u < 0 ? null : p.slice(u + 1).find((m) => m.video.id !== C.video.id) ?? null;
  }, [C, p]), [Fe, nt] = v(0), [me, ct] = v(!1), [ee, Ne] = v(!1), ve = P(!1), be = P(!0), xe = P(null);
  U(() => (be.current = !0, () => {
    be.current = !1;
  }), []);
  const [it, re] = v(g.current), [Je, oe] = v(""), [ye, H] = v(null), [ne, B] = v(!1), [N, b] = v([]), R = P([]), fe = P(null), Qe = P(null), Wt = P(null);
  U(() => {
    var u, m;
    ne && ((m = (u = Wt.current) == null ? void 0 : u.querySelector("input")) == null || m.focus());
  }, [ne]);
  const [Se, bt] = v(!1);
  U(() => {
    if (me || Se || !Qe.current) return;
    const u = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const m = Qe.current;
      m != null && m.isConnected && !m.disabled && m.focus(), Qe.current = null;
    });
    return () => cancelAnimationFrame(u);
  }, [me, Se, W]);
  const [yt, Rt] = v([]), [$t, xt] = v({}), Lt = P(null), ot = P(0), [wt, le] = v({});
  U(() => {
    let u = !0;
    return Promise.all(
      nn(I.objectFilter).map(
        async (m) => [
          String(m),
          (await z(`/api/tags/${m}`)).name
        ]
      )
    ).then((m) => {
      u && le(Object.fromEntries(m));
    }).catch(() => {
    }), () => {
      u = !1;
    };
  }, [I.objectFilter]);
  const Dt = Mt(
    () => on(I.objectFilter, wt),
    [wt, I.objectFilter]
  ), vt = P(0), Ht = P(e);
  Ht.current = e;
  const ke = l ?? e, Le = Mt(
    () => st(ke, I),
    [ke, I]
  ), Q = P(Le);
  Q.current = Le;
  const qt = I.startFrom !== (e.view.startFrom ?? "end") || !ar(
    JSON.parse(at(st(e, I))),
    JSON.parse(at(st(e, Jt(e))))
  ), pe = ee || me || ne, lt = Number(I.filter.page);
  function Ue(u, m = !1) {
    ve.current || (g.current = "", Pe.current = m, O.current = u, j(u), nt(0), ct(!0), m || nr(e.id, u), ue((F) => F + 1));
  }
  function St() {
    if (ve.current = !1, Ne(!1), be.current && xe.current) {
      const u = xe.current;
      xe.current = null, Ue(u.query, u.startAtEnd);
    }
  }
  U(() => {
    const u = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const m = zr(
            Ht.current,
            new URLSearchParams(window.location.search)
          );
          ve.current ? xe.current = m : Ue(m.query, m.startAtEnd);
        } catch (m) {
          re(Ze(m));
        }
    };
    return window.addEventListener("popstate", u), () => window.removeEventListener("popstate", u);
  }, [e.id]), U(() => (r(ee || me || ne || !!l), () => r(!1)), [ee, me, ne, !!l, r]);
  async function jt(u, m, F) {
    if (u.entityType === "performerOccurrence") {
      const K = await pi(
        u,
        Lt.current,
        m,
        F
      );
      return {
        items: K.items.map((Y) => ({
          key: Y.key,
          video: Y.video,
          occurrence: Y
        })),
        totalCount: K.totalCount
      };
    }
    const G = await rr(
      u,
      { ...u.view.filter, page: m },
      F
    );
    return {
      items: G.items.map((K) => ({ key: String(K.id), video: K })),
      totalCount: G.totalCount
    };
  }
  function Xt(u, m, F, G = !1, K = !1) {
    if (!be.current || xe.current) return;
    q(!0), $(
      K ? u.items : $r(u.items, O.current.startFrom === "end")
    ), nt(u.totalCount), Ae(F, G);
    const Y = {
      ...O.current,
      filter: { ...O.current.filter, page: m }
    };
    O.current = Y, j(Y), nr(e.id, Y);
  }
  function Ae(u, m = !1) {
    (u == null ? void 0 : u.key) !== (C == null ? void 0 : C.key) && (L.current = null), (u == null ? void 0 : u.video.id) !== (C == null ? void 0 : C.video.id) && ie(m && u ? u.video.id : null), _(u);
  }
  U(() => {
    if (g.current) return;
    const u = new AbortController();
    T.current = u;
    const m = ++vt.current;
    return ct(!0), re(""), oe(""), L.current = null, ie(null), _(null), $([]), B(!1), (async () => {
      const F = st(Ht.current, O.current);
      Lt.current = F.entityType === "performerOccurrence" ? await an(F, u.signal) : null;
      let G = Number(F.view.filter.page), K = await jt(F, G, u.signal);
      const Y = Math.max(
        1,
        Math.ceil(K.totalCount / Number(F.view.filter.perPage))
      );
      if ((Pe.current || G > Y) && (G = Y, K = await jt(F, G, u.signal)), Pe.current = !1, m !== vt.current || u.signal.aborted) return;
      const ut = $r(K.items, F.view.startFrom === "end");
      Xt(K, G, ut[0] ?? null);
    })().catch((F) => {
      !u.signal.aborted && m === vt.current && re(Ze(F));
    }).finally(() => {
      !u.signal.aborted && m === vt.current && (q(!0), ct(!1));
    }), () => {
      u.abort(), vt.current++;
    };
  }, [W, e.id]), U(() => {
    if (H(null), !C) return;
    let u = !0;
    return tt(C).then((m) => {
      u && (H(m), Rt(
        e.entityType === "performerOccurrence" ? m.ids.filter((F) => e.occurrence.tagIds.includes(F)) : []
      ));
    }).catch((m) => {
      u && re(`Could not load current tags. ${Ze(m)}`);
    }), () => {
      u = !1;
    };
  }, [C]), U(() => {
    if (e.entityType !== "performerOccurrence" || e.actions.length)
      return;
    let u = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (m) => [
          m,
          (await z(`/api/tags/${m}`)).name
        ]
      )
    ).then((m) => {
      u && xt(Object.fromEntries(m));
    }).catch((m) => {
      u && re(Ze(m));
    }), () => {
      u = !1;
    };
  }, [e]);
  async function Ke(u = !1, m = !1, F = !1) {
    var Et;
    if (!C) return;
    const G = p.findIndex((Z) => Z.key === C.key), K = I.startFrom === "end" ? -1 : 1, Y = ((Et = L.current) == null ? void 0 : Et.key) === C.key ? L.current : { key: C.key, page: lt, before: p.slice(0, G + 1).map((Z) => Z.key), after: p.slice(G + 1).map((Z) => Z.key) }, ut = new Set(Y.after), V = new Set(Y.before), ze = p.find((Z) => {
      var Ge;
      return ut.has(Z.key) || (K === 1 || lt < Y.page) && ((Ge = L.current) == null ? void 0 : Ge.key) === C.key && !V.has(Z.key);
    });
    if (!u && ze) {
      Ae(ze, F);
      return;
    }
    const ge = u ? V : new Set(p.map((Z) => Z.key)), Be = 1100 - (Date.now() - ot.current);
    Be > 0 && await new Promise((Z) => window.setTimeout(Z, Be));
    let Oe = K === -1 && !u ? Math.max(1, lt - 1) : lt;
    for (; be.current && !xe.current; ) {
      let Z = await jt(Le, Oe);
      const Ge = Math.max(
        1,
        Math.ceil(Z.totalCount / Number(I.filter.perPage))
      );
      Oe > Ge && (Oe = Ge, Z = await jt(Le, Oe));
      const ft = $r(Z.items, K === -1), ae = new Map(ft.map((Re) => [Re.key, Re])), Yt = u ? Y.after.flatMap((Re) => {
        const Ut = ae.get(Re);
        return Ut ? [Ut] : [];
      }) : [], dr = new Set(Yt.map((Re) => Re.key)), Ct = u ? {
        ...Z,
        items: [
          ...Yt,
          ...ft.filter(
            (Re) => Re.key !== C.key && !dr.has(Re.key)
          )
        ]
      } : Z;
      if (m) {
        L.current = Y, Xt(Ct, Oe, C, !1, u);
        return;
      }
      const Nt = K === -1 && lt === 1 && !u ? void 0 : Ct.items.find(
        (Re) => !ge.has(Re.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(u && K === -1 && Oe === Y.page) || ut.has(Re.key))
      );
      if (Nt || (K === -1 ? Oe <= 1 : Oe >= Ge)) {
        Xt(
          Ct,
          Oe,
          Nt ?? null,
          F,
          u
        ), Nt || oe(
          Z.totalCount ? "Reached the end in this direction. Matching items remain available from the scene pages." : "No matching scenes."
        );
        return;
      }
      Oe += K;
    }
  }
  async function Ve(u, m = !1, F = !1, G = !1) {
    if (l || !C || ve.current || me || ne && !F)
      return;
    const K = F || G || !!(u != null && u.steps.length), Y = K && !m;
    if (K && (!t || !ye)) return;
    ve.current = !0, Ne(!0), re(""), oe("");
    const ut = p.findIndex((ge) => ge.key === C.key), V = K && !m && ut >= 0 ? p[ut + 1] ?? null : null;
    V && ($(
      (ge) => ge.filter((Be) => Be.key !== C.key)
    ), Ae(V, !0));
    let ze = !1;
    try {
      if (K) {
        const ge = await tt(C);
        if (u)
          await Co(Le, C, u);
        else {
          const Oe = G && e.entityType === "performerOccurrence" ? e.occurrence.tagIds.filter((Ge) => ge.ids.includes(Ge)) : R.current, Z = mt(Oe, G ? yt : N);
          await sn(Le, C, Z);
        }
        ot.current = Date.now();
        const Be = await tt(C);
        V || H(Be), ze = !0, B(!1), oe("Tags saved.");
      }
      if (!be.current || xe.current) return;
      K ? await Ke(!0, m, Y) : m || await Ke(), m && F && requestAnimationFrame(() => {
        var ge;
        return (ge = fe.current) == null ? void 0 : ge.focus();
      });
    } catch (ge) {
      if (re(
        ze ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Ze(ge)}` : K ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Ze(ge)}` : `Could not advance. ${Ze(ge)}`
      ), K && !ze) {
        V && ($(p), ie(null), ce((Be) => Be + 1), _(C)), ot.current = Date.now();
        try {
          H(await tt(C));
        } catch {
          H(null), re(
            (Be) => `${Be} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      St();
    }
  }
  U(() => {
    const u = (m) => {
      if (ne || l || ee || me || Se || m.defaultPrevented || m.repeat || m.ctrlKey || m.altKey || m.metaKey || !ni(m.target) || document.querySelector('[role="dialog"], dialog[open]'))
        return;
      const F = m.key.toLowerCase(), G = e.actions.find(
        (K, Y) => Tt(K, Y) === F
      );
      G && (m.preventDefault(), m.stopPropagation(), Ve(G, m.shiftKey));
    };
    return document.addEventListener("keydown", u), () => document.removeEventListener("keydown", u);
  });
  function dt() {
    !i || l || ve.current || ne || (S.current = document.activeElement, E.current = {
      error: it,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(O.current),
      items: p,
      current: C,
      total: Fe,
      targets: Lt.current,
      stayedCursor: L.current
    }, h(structuredClone(st(e, O.current))), oe(""), re(""));
  }
  U(() => {
    s && s !== M.current && y && !me && (M.current = s, dt());
  }, [s, me, y]);
  function _t() {
    h(null), requestAnimationFrame(() => {
      var u;
      return (u = S.current) == null ? void 0 : u.focus();
    });
  }
  function Te() {
    var m;
    const u = E.current;
    !u || ee || ((m = T.current) == null || m.abort(), vt.current++, O.current = u.query, j(u.query), $(u.items), _(u.current), nt(u.total), Lt.current = u.targets, L.current = u.stayedCursor, ct(!1), re(u.error), oe(""), window.history.replaceState(window.history.state, "", u.url), _t());
  }
  async function Ie() {
    if (!l || !i || ve.current) return;
    const u = st(
      { ...l, name: l.name.trim() },
      O.current
    ), m = wr(u);
    if (m) {
      re(m);
      return;
    }
    ve.current = !0, Ne(!0), re("");
    try {
      if (await i(u) === !1) throw new Error("Could not save review.");
      _t(), oe("Review saved.");
    } catch (F) {
      re(
        "Could not save review. Your edits are still open. " + Ze(F)
      );
    } finally {
      St();
    }
  }
  async function De() {
    if (!i || ve.current) return;
    const u = st(e, {
      ...O.current,
      filter: { ...O.current.filter, page: 1 }
    });
    ve.current = !0, Ne(!0), re("");
    try {
      if (await i(u) === !1) throw new Error("Could not save review.");
      oe("Queue saved to this review.");
    } catch (m) {
      re("Could not save queue. " + Ze(m));
    } finally {
      St();
    }
  }
  const X = I.performerScope, $e = (u) => Ue({
    ...O.current,
    filter: { ...O.current.filter, page: 1 },
    performerScope: { ...X, ...u }
  });
  return /* @__PURE__ */ d(
    "section",
    {
      className: "dq-review-workspace",
      "aria-label": X ? "Performer occurrence review" : "Video review",
      children: [
        l && /* @__PURE__ */ d("section", { className: "dq-rule-editor", "aria-label": "Edit review rule", children: [
          /* @__PURE__ */ n("h2", { children: "Edit review" }),
          /* @__PURE__ */ n("p", { children: "Preview matching scenes below. Save review keeps all rule changes; Cancel restores your previous view." }),
          /* @__PURE__ */ d("fieldset", { disabled: ee, children: [
            c == null ? void 0 : c(
              st(l, I),
              h,
              ee
            ),
            /* @__PURE__ */ d("label", { children: [
              "Review direction",
              /* @__PURE__ */ d(
                "select",
                {
                  "aria-label": "Review direction",
                  value: I.startFrom,
                  onChange: (u) => Ue({
                    ...O.current,
                    startFrom: u.target.value
                  }),
                  children: [
                    /* @__PURE__ */ n("option", { value: "end", children: "Start from the end" }),
                    /* @__PURE__ */ n("option", { value: "beginning", children: "Start from the beginning" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ d("div", { className: "dq-row", children: [
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button primary",
                type: "button",
                disabled: ee || me,
                onClick: () => void Ie(),
                children: "Save review"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button",
                type: "button",
                disabled: ee,
                onClick: Te,
                children: "Cancel"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ d(
          "fieldset",
          {
            className: "dq-review-filters",
            disabled: pe,
            onClickCapture: (u) => {
              var G;
              const m = u.target instanceof Element ? u.target.closest("button") : null, F = (m == null ? void 0 : m.getAttribute("aria-label")) ?? ((G = m == null ? void 0 : m.textContent) == null ? void 0 : G.trim()) ?? "";
              m && !m.closest('[role="dialog"], dialog') && /^(Filters|Edit filter:|Edit performer criteria)/.test(F) && (Qe.current = m);
            },
            children: [
              /* @__PURE__ */ n("legend", { children: "Scene filters" }),
              /* @__PURE__ */ d("div", { className: "dq-queue-toolbar", children: [
                /* @__PURE__ */ n(
                  ir,
                  {
                    filter: I.filter,
                    objectFilter: Dt,
                    criteriaDefinitions: Cr,
                    customFieldEntityType: "video",
                    totalCount: Fe,
                    sortOptions: Xr,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    onFilterChange: (u) => {
                      (u.sort !== O.current.filter.sort || u.direction !== O.current.filter.direction) && (u = { ...u, sorts: void 0 }), Ue({
                        ...O.current,
                        filter: Me(u)
                      });
                    },
                    onObjectFilterChange: (u) => {
                      Ue({
                        ...O.current,
                        objectFilter: ui(
                          u,
                          wt,
                          O.current.objectFilter
                        ),
                        filter: { ...O.current.filter, page: 1 }
                      });
                    }
                  }
                ),
                !l && qt && /* @__PURE__ */ d("div", { className: "dq-review-defaults", children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      "aria-label": "Save changes to review filters",
                      title: "Save changes to review filters",
                      disabled: !i,
                      onClick: () => void De(),
                      children: /* @__PURE__ */ n(Yr, { "aria-hidden": "true" })
                    }
                  ),
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      "aria-label": "Reset to default review filters",
                      title: "Reset to default review filters",
                      onClick: () => {
                        const u = Jt(e);
                        Ue(u, u.startFrom === "end");
                      },
                      children: /* @__PURE__ */ n(zn, { "aria-hidden": "true" })
                    }
                  )
                ] })
              ] }),
              X && /* @__PURE__ */ d("div", { className: "dq-scope-controls", children: [
                /* @__PURE__ */ d("label", { children: [
                  "Performers to review",
                  " ",
                  /* @__PURE__ */ d(
                    "select",
                    {
                      value: X.targetMode,
                      onChange: (u) => $e({
                        targetMode: u.target.value
                      }),
                      children: [
                        /* @__PURE__ */ n("option", { value: "all", children: "All performers" }),
                        /* @__PURE__ */ n("option", { value: "selected", children: "Specific performers" }),
                        /* @__PURE__ */ n("option", { value: "filter", children: "Matching performer criteria" })
                      ]
                    }
                  )
                ] }),
                X.targetMode === "selected" && /* @__PURE__ */ n(
                  ht,
                  {
                    entityType: "performer",
                    values: X.performerIds,
                    onChange: (u) => $e({ performerIds: u }),
                    placeholder: "Select performers to review...",
                    allowCreate: !1
                  }
                ),
                X.targetMode === "filter" && /* @__PURE__ */ d(we, { children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => bt(!0),
                      children: "Edit performer criteria"
                    }
                  ),
                  /* @__PURE__ */ n("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ n(
                    ir,
                    {
                      filter: {},
                      onFilterChange: () => {
                      },
                      totalCount: 0,
                      sortOptions: [],
                      showSearch: !1,
                      showSort: !1,
                      showPagingControls: !1,
                      criteriaDefinitions: Dr,
                      objectFilter: X.performerFilter,
                      onObjectFilterChange: (u) => $e({ performerFilter: u })
                    }
                  ) })
                ] }),
                /* @__PURE__ */ d("label", { children: [
                  "Occurrence tags",
                  " ",
                  /* @__PURE__ */ d(
                    "select",
                    {
                      value: X.condition,
                      onChange: (u) => $e({
                        condition: u.target.value
                      }),
                      children: [
                        /* @__PURE__ */ n("option", { value: "any", children: "Any occurrence tags" }),
                        /* @__PURE__ */ n("option", { value: "includes", children: "Has any selected tag" }),
                        /* @__PURE__ */ n("option", { value: "includesAll", children: "Has all selected tags" }),
                        /* @__PURE__ */ n("option", { value: "excludes", children: "Has none of the selected tags" }),
                        /* @__PURE__ */ n("option", { value: "isNull", children: "Has no occurrence tags" })
                      ]
                    }
                  )
                ] }),
                !["any", "isNull"].includes(X.condition) && /* @__PURE__ */ d(we, { children: [
                  /* @__PURE__ */ n(
                    ht,
                    {
                      entityType: "tag",
                      values: X.conditionTagIds,
                      onChange: (u) => $e({ conditionTagIds: u }),
                      placeholder: "Occurrence condition tags...",
                      allowCreate: !1
                    }
                  ),
                  /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "checkbox",
                        checked: X.includeSubtags ?? !0,
                        onChange: (u) => $e({ includeSubtags: u.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] })
                ] })
              ] })
            ]
          }
        ),
        X && /* @__PURE__ */ n(
          Vn,
          {
            open: Se,
            onClose: () => bt(!1),
            criteria: Dr,
            activeFilter: X.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (u) => {
              bt(!1), $e({ performerFilter: u });
            }
          }
        ),
        Le.entityType === "performerOccurrence" && t && /* @__PURE__ */ n(
          ko,
          {
            review: Le,
            hidden: !!l,
            disabled: pe || !!l,
            onOpen: () => {
              ve.current = !0, Ne(!0);
            },
            onWrite: () => {
              ot.current = Date.now();
            },
            onClose: (u) => {
              u ? (ot.current = Date.now(), new Promise((m) => window.setTimeout(m, 1100)).then(() => {
                St(), be.current && ue((m) => m + 1);
              })) : St();
            }
          }
        ),
        /* @__PURE__ */ d("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
          it && /* @__PURE__ */ d("p", { role: "alert", children: [
            it,
            " ",
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: ee,
                onClick: () => {
                  C ? tt(C).then(H).catch((u) => re(Ze(u))) : Ue(O.current);
                },
                children: C ? "Reload tags" : "Retry queue"
              }
            )
          ] }),
          Je && /* @__PURE__ */ n("p", { role: "status", children: Je })
        ] }),
        /* @__PURE__ */ d("div", { className: "dq-review-layout", children: [
          /* @__PURE__ */ d("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
            /* @__PURE__ */ n("fieldset", { disabled: pe, children: /* @__PURE__ */ n(
              Bn,
              {
                filter: I.filter,
                totalCount: Fe,
                onFilterChange: (u) => Ue({ ...I, filter: Me(u) })
              }
            ) }),
            /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: p.map((u) => {
              var m, F, G;
              return /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  title: `${u.occurrence ? `${u.occurrence.performer.name} — ` : ""}${u.video.title || ((m = u.video.files[0]) == null ? void 0 : m.basename) || "Scene"}`,
                  "aria-label": `${u.occurrence ? `${u.occurrence.performer.name} — ` : ""}${u.video.title || ((F = u.video.files[0]) == null ? void 0 : F.basename) || "Scene"}`,
                  disabled: pe,
                  "aria-pressed": (C == null ? void 0 : C.key) === u.key,
                  onClick: () => {
                    Ae(u), re(""), oe("");
                  },
                  children: [
                    u.occurrence && /* @__PURE__ */ n(Fn, { performer: u.occurrence.performer }),
                    /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: u.video.title || ((G = u.video.files[0]) == null ? void 0 : G.basename) || "Scene" })
                  ]
                },
                u.key
              );
            }) })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-inspector", children: C ? /* @__PURE__ */ d(we, { children: [
            /* @__PURE__ */ d("div", { className: "dq-review-media", children: [
              /* @__PURE__ */ n("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ n(
                "a",
                {
                  href: `/video/${C.video.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: C.video.title || ((je = C.video.files[0]) == null ? void 0 : je.basename) || `Video ${C.video.id}`
                }
              ) }),
              [C, rt].filter(Boolean).map((u) => {
                var G, K, Y;
                const m = u, F = m.key === C.key;
                return /* @__PURE__ */ n(
                  "div",
                  {
                    className: F ? "dq-review-video-current" : "dq-review-video-preload",
                    "aria-hidden": F ? void 0 : !0,
                    inert: F ? void 0 : !0,
                    children: /* @__PURE__ */ n(
                      Gn,
                      {
                        videoId: m.video.id,
                        streamUrl: li(m.video.id),
                        posterUrl: F ? fo(m.video) : void 0,
                        duration: ((G = m.video.files[0]) == null ? void 0 : G.duration) ?? 0,
                        format: (K = m.video.files[0]) == null ? void 0 : K.format,
                        audioCodec: (Y = m.video.files[0]) == null ? void 0 : Y.audioCodec,
                        extensionSurface: F ? "quick-view" : void 0,
                        autostart: F && Ce === m.video.id,
                        keyboardShortcutsEnabled: F,
                        showAbLoop: F,
                        clip: m.video.parentVideoId != null ? {
                          start: m.video.clipStartSec ?? 0,
                          end: m.video.clipEndSec,
                          loop: !1
                        } : void 0
                      }
                    )
                  },
                  `${m.video.id}:${Ft}`
                );
              })
            ] }),
            /* @__PURE__ */ d("div", { className: "dq-review-panel", children: [
              /* @__PURE__ */ n("h2", { children: C.occurrence ? `Reviewing ${C.occurrence.performer.name}` : "Reviewing this video" }),
              /* @__PURE__ */ n("p", { children: X ? "Tags apply only to this performer in this video." : "Tags apply to the video." }),
              X && /* @__PURE__ */ n(
                "div",
                {
                  className: "dq-review-partners",
                  "aria-label": "Matching scene partners",
                  children: p.filter((u) => u.video.id === C.video.id).map((u) => {
                    var m, F;
                    return /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button dq-partner-button",
                        title: (m = u.occurrence) == null ? void 0 : m.performer.name,
                        "aria-label": (F = u.occurrence) == null ? void 0 : F.performer.name,
                        disabled: pe,
                        "aria-pressed": u.key === C.key,
                        onClick: () => {
                          Ae(u), re("");
                        },
                        children: u.occurrence && /* @__PURE__ */ n(
                          Fn,
                          {
                            performer: u.occurrence.performer
                          }
                        )
                      },
                      u.key
                    );
                  })
                }
              ),
              /* @__PURE__ */ d("p", { children: [
                "Current ",
                X ? "occurrence" : "video",
                " tags:",
                " ",
                ye ? ye.names.join(", ") || "None" : "Loading…"
              ] }),
              ye != null && ye.absent.length ? /* @__PURE__ */ d("p", { children: [
                "Confirmed absent tags:",
                " ",
                /* @__PURE__ */ n(
                  ht,
                  {
                    entityType: "tag",
                    values: ye.absent,
                    onChange: () => {
                    },
                    disabled: !0,
                    allowCreate: !1
                  }
                )
              ] }) : null,
              ne ? /* @__PURE__ */ d(
                "fieldset",
                {
                  ref: Wt,
                  disabled: ee,
                  className: "dq-tag-editor",
                  children: [
                    /* @__PURE__ */ d("legend", { children: [
                      "Edit ",
                      X ? "occurrence" : "video",
                      " tags"
                    ] }),
                    /* @__PURE__ */ n(
                      ht,
                      {
                        entityType: "tag",
                        values: N,
                        onChange: b,
                        placeholder: "Choose tags for this item...",
                        allowCreate: !1
                      }
                    ),
                    /* @__PURE__ */ d("div", { className: "dq-row", children: [
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          disabled: !ye,
                          onClick: () => void Ve(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !ye,
                          onClick: () => void Ve(void 0, !1, !0),
                          children: "Save & next"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => {
                            B(!1), requestAnimationFrame(
                              () => {
                                var u;
                                return (u = fe.current) == null ? void 0 : u.focus();
                              }
                            );
                          },
                          children: "Cancel"
                        }
                      )
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ d(we, { children: [
                /* @__PURE__ */ n(
                  Io,
                  {
                    actions: ke.actions,
                    canWrite: t,
                    disabled: ee || me || !ye || !!l,
                    onApply: (u, m) => void Ve(u, m)
                  }
                ),
                e.entityType === "performerOccurrence" && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ d(
                  "fieldset",
                  {
                    className: "dq-tag-choices",
                    disabled: !t || ee || !ye || !!l,
                    children: [
                      /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                      e.occurrence.tagIds.map((u) => /* @__PURE__ */ d("label", { children: [
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: e.occurrence.multiple ? "checkbox" : "radio",
                            name: "legacy-choice",
                            checked: yt.includes(u),
                            onChange: (m) => Rt(
                              e.occurrence.multiple ? m.target.checked ? [...yt, u] : yt.filter(
                                (F) => F !== u
                              ) : [u]
                            )
                          }
                        ),
                        $t[u] ?? "Loading tag…"
                      ] }, u)),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          onClick: () => Rt([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void Ve(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Ve(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ d("div", { className: "dq-row", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ref: fe,
                    className: "dq-button",
                    disabled: pe || !!l || !t || !ye,
                    onClick: () => {
                      R.current = [...ye.ids], b([...ye.ids]), B(!0);
                    },
                    children: "Edit tags"
                  }
                ),
                /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: pe || !!l,
                    onClick: () => void Ve(),
                    children: [
                      "Skip",
                      X ? " performer" : " video"
                    ]
                  }
                )
              ] }),
              !t && /* @__PURE__ */ n("p", { children: "Write permission is required to change tags." })
            ] })
          ] }) : /* @__PURE__ */ n("p", { role: "status", children: me ? "Loading review…" : Fe ? "Reached the end in this direction." : "No matching scenes." }) })
        ] })
      ]
    }
  );
}
function $n({
  review: e,
  onChange: t,
  choices: r = !1
}) {
  const i = e.occurrence, s = (c) => t({ ...e, occurrence: { ...i, ...c } });
  return r ? /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ n("p", { children: "Choose the tags this review can change on the active performer’s appearance in a scene. Other tags are preserved." }),
    /* @__PURE__ */ n(
      ht,
      {
        entityType: "tag",
        values: i.tagIds,
        onChange: (c) => s({ tagIds: c }),
        placeholder: "Search review tag choices...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
      /* @__PURE__ */ n(
        "input",
        {
          type: "checkbox",
          checked: i.multiple,
          onChange: (c) => s({ multiple: c.target.checked })
        }
      ),
      "Allow multiple tags, for example when a hairstyle changes during the scene"
    ] }),
    /* @__PURE__ */ n("p", { children: "Save & next performer applies the selected tags and advances. Save choices stays on the performer. Skip only moves the cursor; eligibility comes from the filters." })
  ] }) : /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Occurrence condition (optional)" }),
    /* @__PURE__ */ n("p", { children: "Leave this unrestricted to review any appearance. Set performer matching in the review workspace and save it with the rule." }),
    /* @__PURE__ */ d("label", { children: [
      "Occurrence condition",
      /* @__PURE__ */ d(
        "select",
        {
          "aria-label": "Occurrence condition",
          value: i.condition,
          onChange: (c) => s({
            condition: c.target.value
          }),
          children: [
            /* @__PURE__ */ n("option", { value: "any", children: "Any occurrence tags" }),
            /* @__PURE__ */ n("option", { value: "includes", children: "Has any selected tag" }),
            /* @__PURE__ */ n("option", { value: "includesAll", children: "Has all selected tags" }),
            /* @__PURE__ */ n("option", { value: "excludes", children: "Has none of the selected tags" }),
            /* @__PURE__ */ n("option", { value: "isNull", children: "Has no occurrence tags" })
          ]
        }
      )
    ] }),
    !["any", "isNull"].includes(i.condition) && /* @__PURE__ */ d(we, { children: [
      /* @__PURE__ */ n(
        ht,
        {
          entityType: "tag",
          values: i.conditionTagIds,
          onChange: (c) => s({ conditionTagIds: c }),
          placeholder: "Search occurrence condition tags...",
          allowCreate: !1
        }
      ),
      /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
        /* @__PURE__ */ n(
          "input",
          {
            type: "checkbox",
            checked: i.includeSubtags ?? !0,
            onChange: (c) => s({ includeSubtags: c.target.checked })
          }
        ),
        "Include subtags"
      ] })
    ] }),
    /* @__PURE__ */ n("p", { children: "Conditions check tags on the same performer’s occurrence, independently of scene tags and the performer’s profile." })
  ] });
}
function Po(e) {
  var g, l, h;
  const [t, r] = v({}), [i, s] = v(""), c = (((g = e == null ? void 0 : e.presentation) == null ? void 0 : g.annotations) ?? []).includes("tags") ? ((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotationParents) ?? [] : [], o = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...c,
      ...((h = e == null ? void 0 : e.presentation) == null ? void 0 : h.binParents) ?? []
    ])
  ]);
  return U(() => {
    let E = !0;
    return r({}), s(""), Promise.all(
      JSON.parse(o).map(
        async (S) => [S, await lr([S])]
      )
    ).then((S) => {
      E && r(Object.fromEntries(S));
    }).catch(() => {
      E && s(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      E = !1;
    };
  }, [o]), { ids: t, error: i };
}
function Fo(e, t, r) {
  const i = t == null ? void 0 : t.presentation, s = (i == null ? void 0 : i.annotations) ?? [], c = (i == null ? void 0 : i.annotationParents) ?? [];
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
    tags: s.includes("tags") && c.length > 0 ? (e.tags ?? []).filter(
      (o) => c.some(
        (g) => {
          var l;
          return g !== o.id && ((l = r[g]) == null ? void 0 : l.includes(o.id));
        }
      )
    ) : []
  };
}
function $o({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: s
}) {
  var g, l, h;
  const c = new Set(
    (((g = t.presentation) == null ? void 0 : g.binParents) ?? []).flatMap(
      (E) => (r[E] ?? []).filter((S) => S !== E)
    )
  ), o = /* @__PURE__ */ new Map();
  for (const E of e)
    for (const S of E.tags ?? [])
      if (c.has(S.id)) {
        const T = o.get(S.id) ?? { name: S.name, count: 0 };
        T.count++, o.set(S.id, T);
      }
  return (h = (l = t.presentation) == null ? void 0 : l.binParents) != null && h.length ? /* @__PURE__ */ d("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...o].sort((E, S) => E[1].name.localeCompare(S[1].name)).map(([E, S]) => /* @__PURE__ */ d(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => s(E),
        children: [
          S.name,
          " (",
          S.count,
          ")"
        ]
      },
      E
    )),
    !o.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function xo(e, t) {
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
function xn({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [s, c] = v(!1), o = Ee(e) === "tag" ? "tag" : "video", g = ji(
    o === "video" ? "video" : void 0,
    e.view.objectFilter
  ), l = e.view.filter, h = o === "tag" ? Jn : Xr, E = (y) => t({
    ...e,
    view: { ...e.view, filter: { ...l, ...y } }
  }), S = o === "video" ? e.presentation ?? {} : {}, T = (y) => t({ ...e, presentation: { ...S, ...y } });
  return /* @__PURE__ */ d(we, { children: [
    i && /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ d("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(l.q ?? ""),
            onChange: (y) => E({ q: y.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ d("div", { className: "dq-field-grid", children: [
        /* @__PURE__ */ d("label", { children: [
          "Sort",
          /* @__PURE__ */ d(
            "select",
            {
              "aria-label": "Sort",
              value: String(l.sort ?? "date"),
              onChange: (y) => E({ sort: y.target.value, sorts: void 0 }),
              children: [
                !h.some((y) => y.value === l.sort) && l.sort != null && /* @__PURE__ */ n("option", { value: String(l.sort), children: String(l.sort) }),
                h.map((y) => /* @__PURE__ */ n("option", { value: y.value, children: y.label }, y.value))
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
              onChange: (y) => E({ direction: y.target.value }),
              children: [
                /* @__PURE__ */ n("option", { value: "asc", children: "Ascending" }),
                /* @__PURE__ */ n("option", { value: "desc", children: "Descending" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          o === "tag" ? "Tags" : "Videos",
          " per page",
          /* @__PURE__ */ n(
            "input",
            {
              type: "number",
              min: "1",
              max: "1000",
              value: Number(l.perPage) || 40,
              onChange: (y) => E({
                perPage: Math.max(
                  1,
                  Math.min(1e3, Number(y.target.value) || 40)
                )
              })
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          "Start from",
          /* @__PURE__ */ d(
            "select",
            {
              "aria-label": "Start from",
              value: e.view.startFrom ?? "end",
              onChange: (y) => t({
                ...e,
                view: {
                  ...e.view,
                  startFrom: y.target.value
                }
              }),
              children: [
                /* @__PURE__ */ n("option", { value: "end", children: "The end" }),
                /* @__PURE__ */ n("option", { value: "beginning", children: "The beginning" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ d(
        "button",
        {
          type: "button",
          className: "dq-button",
          onClick: () => c(!0),
          children: [
            "Edit ",
            o,
            " filters"
          ]
        }
      ),
      /* @__PURE__ */ d("p", { children: [
        Object.keys(e.view.objectFilter).length ? `${o === "tag" ? "Tag" : "Video"} filters configured` : `No ${o} filters`,
        ". Choose which ",
        o === "tag" ? "tags" : "videos",
        " enter the queue."
      ] }),
      s && /* @__PURE__ */ n("div", { onKeyDown: (y) => y.stopPropagation(), children: /* @__PURE__ */ n(
        Vn,
        {
          open: !0,
          onClose: () => c(!1),
          criteria: o === "tag" ? Qn : Cr,
          activeFilter: e.view.objectFilter,
          customSections: g ? [g] : void 0,
          supportsFilterExpressions: o === "video",
          subjectLabel: o === "tag" ? "tags" : "videos",
          onApply: (y) => {
            t({ ...e, view: { ...e.view, objectFilter: y } }), c(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ d(we, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ d("p", { className: "dq-editor-note", children: [
        "Choose how ",
        o === "tag" ? "tags" : "videos and tags",
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ d("div", { className: "dq-field-grid", children: [
        Ee(e) === "video" && /* @__PURE__ */ d("label", { children: [
          "Preferred review layout",
          /* @__PURE__ */ d(
            "select",
            {
              value: e.view.reviewMode ?? "single",
              onChange: (y) => t({ ...e, view: { ...e.view, reviewMode: y.target.value } }),
              children: [
                /* @__PURE__ */ n("option", { value: "single", children: "Single video" }),
                /* @__PURE__ */ n("option", { value: "multiple", children: "Multiple videos" })
              ]
            }
          )
        ] }),
        Ee(e) !== "performerOccurrence" && /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: e.view.selectAllOnLoad ?? !1,
              onChange: (y) => t({ ...e, view: { ...e.view, selectAllOnLoad: y.target.checked ? !0 : void 0 } })
            }
          ),
          "Select all ",
          o === "tag" ? "tags" : "videos",
          " on page load",
          o === "video" && /* @__PURE__ */ n("small", { children: " (multiple-videos layout)" })
        ] }),
        /* @__PURE__ */ d("label", { children: [
          "Preferred view",
          /* @__PURE__ */ n(
            "select",
            {
              value: o === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid",
              onChange: (y) => t({
                ...e,
                view: {
                  ...e.view,
                  displayMode: y.target.value
                }
              }),
              children: (o === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((y) => /* @__PURE__ */ n("option", { children: y }, y))
            }
          )
        ] })
      ] }),
      o === "video" && /* @__PURE__ */ d(we, { children: [
        /* @__PURE__ */ n("h4", { children: "Card annotations" }),
        /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((y) => {
          const q = S.annotations ?? [];
          return /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: q.includes(y),
                onChange: (M) => T({
                  annotations: M.target.checked ? [...q, y] : q.filter((I) => I !== y)
                })
              }
            ),
            y
          ] }, y);
        }) }),
        (S.annotations ?? []).includes("tags") && /* @__PURE__ */ d(we, { children: [
          /* @__PURE__ */ n("h4", { children: "Card tag bins" }),
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected. This setting is separate from the queue filters." }),
          /* @__PURE__ */ n(
            ht,
            {
              entityType: "tag",
              values: S.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (y) => T({ annotationParents: y }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ n("h4", { children: "Queue tag bins" }),
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ n(
          ht,
          {
            entityType: "tag",
            values: S.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (y) => T({ binParents: y }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const xr = 180;
function bi({ entityType: e }) {
  return e === "tag" ? /* @__PURE__ */ n(Bi, { role: "img", "aria-label": "Tag review" }) : /* @__PURE__ */ n(Ur, { role: "img", "aria-label": e === "performerOccurrence" ? "Performer occurrence review" : "Video review" });
}
function Ln(e) {
  return Ee(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Dn(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Lr() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function jn(e) {
  const t = new URLSearchParams(window.location.search);
  Ar.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function Lo(e) {
  return Me({ ...e, page: 1 });
}
function yi(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function et(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const wi = "data-quality.workspace-layout.v1", cn = 240, Wr = 192, Hr = 560;
function vi(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(Hr, Math.max(Wr, e)) : cn;
}
function Do() {
  try {
    const e = JSON.parse(
      localStorage.getItem(wi) ?? "null"
    );
    return vi(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return cn;
  }
}
function jo(e) {
  try {
    localStorage.setItem(
      wi,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function Si(e) {
  switch (e) {
    case "ADD":
      return "positive";
    case "REMOVE":
    case "REMOVE_TREE":
      return "negative";
    case "MARK_PRESENT":
      return "present";
    case "MARK_ABSENT":
      return "absent";
    case "CLEAR_ABSENCE":
      return "neutral";
  }
}
function Ei(e, t) {
  switch (e.mode) {
    case "ADD":
      return `Add ${t}`;
    case "REMOVE":
      return t;
    case "REMOVE_TREE":
      return `${t} tree`;
    case "MARK_PRESENT":
      return `Mark ${t} present`;
    case "MARK_ABSENT":
      return `Mark ${t} absent`;
    case "CLEAR_ABSENCE":
      return `Clear ${t} absence`;
  }
}
function _o(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : Ei(e, t);
}
function Uo({
  onNavigate: e
}) {
  const [t, r] = v([]), [i] = v(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [s, c] = v(""), [o, g] = v(!0), [l, h] = v(""), [E, S] = v(!1), [T, y] = v(!1), [q, M] = v(!1), [I, j] = v([]), [O, W] = v(""), [ue, Pe] = v(!0), [p, $] = v(""), [C, _] = v(""), [L, Ce] = v(!1), [ie, Ft] = v(!1), [ce, rt] = v(Lr), [Fe, nt] = v({}), [me, ct] = v("name"), [ee, Ne] = v("asc"), ve = P(null), be = P(!1), [xe, it] = v(0), [re, Je] = v(!1), [oe, ye] = v(!1), [H, ne] = v(
    null
  ), B = t.find((a) => a.id === ce) ?? null, N = Mt(
    () => (H == null ? void 0 : H.id) === ce && B ? { ...B, view: {
      ...B.view,
      filter: H.view.filter,
      objectFilter: H.view.objectFilter,
      searchMode: H.view.searchMode,
      startFrom: H.view.startFrom
    } } : B,
    [H, ce, B]
  ), b = N ? Ee(N) : "video", R = b === "video" ? N : null, [fe, Qe] = v(null), Wt = (fe == null ? void 0 : fe.id) === (N == null ? void 0 : N.id) ? fe == null ? void 0 : fe.mode : (N == null ? void 0 : N.view.reviewMode) ?? "single", Se = b === "performerOccurrence" || b === "video" && Wt === "single", [bt, yt] = v(0), Rt = P(-1), $t = P(!1);
  U(() => {
    const a = () => {
      if (!Se && ge.current) {
        $t.current = !0;
        return;
      }
      rt(Lr()), Se || yt((f) => f + 1);
    };
    return window.addEventListener("popstate", a), () => window.removeEventListener("popstate", a);
  }, [Se]);
  const xt = b === "tag" ? T : E, Lt = Mt(() => {
    const a = ee === "asc" ? 1 : -1;
    return [...t].sort((f, w) => {
      if (me === "count") {
        const A = Fe[f.id], D = Fe[w.id], k = typeof A == "number", x = typeof D == "number";
        if (k !== x) return k ? -1 : 1;
        if (k && x && A !== D)
          return (A - D) * a;
      }
      return f.name.localeCompare(w.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * a;
    });
  }, [ee, me, Fe, t]), ot = P(
    null
  ), wt = Po(R), [le, Dt] = v({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [vt, Ht] = v({
    page: 1,
    perPage: 40
  }), [ke, Le] = v({ items: [], totalCount: 0 }), [Q, qt] = v(!1), [pe, lt] = v(""), [Ue, St] = v(!1), [jt, Xt] = v(!1), [Ae, Ke] = v(() => /* @__PURE__ */ new Set()), Ve = P(Ae);
  Ve.current = Ae;
  const dt = P(/* @__PURE__ */ new Map()), _t = (N == null ? void 0 : N.view.selectAllOnLoad) === !0, [Te, Ie] = v(null), De = P(Te);
  De.current = Te;
  const [X, $e] = v(!1), je = P(X);
  je.current = X;
  const u = P(null), [m, F] = v("grid"), [G, K] = v(xr), [Y, ut] = v(Do), [V, ze] = v(!1), ge = P(!1), [Be, Oe] = v(""), [Et, Z] = v(""), [Ge, ft] = v(""), [ae, Yt] = v(null), [dr, Ct] = v(""), [Nt, Re] = v(!1), [Ut, ln] = v({}), [dn, un] = v({}), Zt = P(/* @__PURE__ */ new Map()), fn = P(null), Tr = P(null), ur = P(null), Kt = P(0), fr = P(0), pr = P(null), pn = JSON.stringify([
    ...new Set(
      (R == null ? void 0 : R.actions.flatMap(
        (a) => a.steps.flatMap((f) => f.tagIds)
      )) ?? []
    )
  ]);
  function Rr(a) {
    const f = vi(a);
    ut(f), jo(f);
  }
  function Ai(a) {
    const f = a.shiftKey ? 40 : 16;
    let w = null;
    a.key === "ArrowLeft" && (w = Y + f), a.key === "ArrowRight" && (w = Y - f), a.key === "Home" && (w = Wr), a.key === "End" && (w = Hr), w !== null && (a.preventDefault(), a.stopPropagation(), Rr(w));
  }
  U(() => {
    if (!Et) return;
    const a = window.setTimeout(() => Z(""), 4e3);
    return () => window.clearTimeout(a);
  }, [Et]), U(() => {
    const a = JSON.parse(pn);
    if (un({}), !a.length) return;
    const f = new AbortController();
    let w = !0;
    return Promise.all(
      a.map(async (A) => {
        var D;
        try {
          const k = await z(`/api/tags/${A}`, {
            signal: f.signal
          });
          return [A, ((D = k.name) == null ? void 0 : D.trim()) || null];
        } catch {
          return [A, null];
        }
      })
    ).then((A) => {
      w && un(Object.fromEntries(A));
    }), () => {
      w = !1, f.abort();
    };
  }, [pn]), U(() => {
    const a = R ? nn(R.view.objectFilter) : [];
    if (ln({}), !a.length) return;
    const f = new AbortController();
    let w = !0;
    return Promise.all(
      a.map(async (A) => {
        var D;
        try {
          const k = await z(`/api/tags/${A}`, {
            signal: f.signal
          });
          return (D = k.name) != null && D.trim() ? [String(A), k.name] : null;
        } catch {
          return null;
        }
      })
    ).then((A) => {
      w && ln(
        Object.fromEntries(A.filter((D) => D !== null))
      );
    }), () => {
      w = !1, f.abort();
    };
  }, [R == null ? void 0 : R.id, R == null ? void 0 : R.view.objectFilter]);
  const Ti = Mt(
    () => R ? on(
      R.view.objectFilter,
      Ut
    ) : (N == null ? void 0 : N.view.objectFilter) ?? {},
    [Ut, N, R]
  ), gn = It(async () => {
    g(!0), h("");
    try {
      const a = await ro();
      r(a.reviews), c(a.storageKey), S(a.canWriteVideos ?? a.canWrite), y(a.canWriteTags ?? !1), M(a.canReadTagGroups ?? !1), Pe(a.canConfigure ?? !0), $(a.storageNotice ?? ""), ce && !a.reviews.some((f) => f.id === ce) && (rt(""), jn(""));
    } catch (a) {
      h(
        a instanceof Error ? a.message : "Could not load reviews."
      );
    } finally {
      g(!1);
    }
  }, [ce]);
  U(() => {
    if (!q) {
      j([]), W("");
      return;
    }
    const a = new AbortController();
    return W(""), uo(a.signal).then(j).catch((f) => {
      a.signal.aborted || W(
        f instanceof Error ? f.message : "Could not load tag groups."
      );
    }), () => a.abort();
  }, [q]), U(() => {
    gn();
  }, []), U(() => {
    if (ce || t.length === 0) return;
    const a = new AbortController();
    nt({});
    for (const f of t)
      (f.entityType === "performerOccurrence" ? an(f, a.signal).then((A) => (A == null ? void 0 : A.length) === 0 ? { items: [], totalCount: 0 } : rr(fi(f, A), { ...f.view.filter, page: 1, perPage: 1 }, a.signal)) : Ee(f) === "tag" ? qn(
        f,
        Me({ ...f.view.filter, page: 1, perPage: 1 }),
        a.signal
      ) : rr(
        f,
        Me({ ...f.view.filter, page: 1, perPage: 1 }),
        a.signal
      )).then((A) => {
        a.signal.aborted || nt((D) => ({
          ...D,
          [f.id]: A.totalCount
        }));
      }).catch(() => {
        a.signal.aborted || nt((A) => ({ ...A, [f.id]: null }));
      });
    return () => a.abort();
  }, [ce, t]), Kn(() => {
    var a;
    ce || o || !be.current || (be.current = !1, (a = ve.current) == null || a.focus());
  }, [ce, o]);
  const gr = It(async () => {
    Ct("");
    try {
      Yt(await en());
    } catch (a) {
      Yt(null), Ct(
        "Tag assessment setup could not be checked. " + (a instanceof Error ? a.message : "Request failed.")
      );
    }
  }, []);
  U(() => {
    gr();
  }, [gr]);
  const kt = It(
    async (a, f, w = !1, A = !1) => {
      var de;
      const D = ++Kt.current;
      (de = pr.current) == null || de.abort();
      const k = new AbortController();
      pr.current = k, f = Me(f);
      const x = Number(f.page);
      w && (f = { ...f, page: 1 }), Dt(f), Xt(w), qt(!0), lt("");
      try {
        const J = (pt) => Ee(a) === "tag" ? qn(
          a,
          pt,
          k.signal
        ) : rr(
          a,
          pt,
          k.signal
        );
        let he = await J(f);
        const We = Math.max(
          1,
          Math.ceil(he.totalCount / Number(f.perPage))
        ), He = w ? We : Math.min(x, We);
        return Number(f.page) !== He && (f = { ...f, page: He }, he = await J(f)), D === Kt.current && (Le(he), A && At(
          () => new Set(he.items.map((pt) => pt.id))
        ), Dt(f), Ht(f)), he;
      } catch (J) {
        throw D === Kt.current && lt(
          J instanceof Error ? J.message : "Could not load the review queue."
        ), J;
      } finally {
        D === Kt.current && qt(!1);
      }
    },
    []
  );
  U(() => {
    var f;
    if (fr.current += 1, Rt.current = -1, Kt.current += 1, (f = pr.current) == null || f.abort(), Ft(!1), _(""), Ce(!1), Ke(/* @__PURE__ */ new Set()), dt.current.clear(), Ie(null), $e(!1), ze(!1), ge.current = !1, Oe(""), Z(""), ft(""), Le({ items: [], totalCount: 0 }), St(!1), !N || Se) {
      qt(!1);
      return;
    }
    let a = !0;
    return qt(!0), (async () => {
      let w = B ?? N;
      ne(null);
      let A = null;
      const D = new URLSearchParams(window.location.search);
      if (Ee(N) === "video" && Ar.some((J) => D.has(J)))
        try {
          const J = w;
          A = zr(J, D);
          const he = st(J, A.query);
          (A.query.startFrom !== (J.view.startFrom ?? "end") || !ar(
            JSON.parse(at(he)),
            JSON.parse(at(st(J, Jt(J))))
          )) && (w = he, ne(w));
        } catch (J) {
          St(!0), lt(J instanceof Error ? J.message : "Could not read review URL."), qt(!1);
          return;
        }
      let k = null;
      try {
        k = await oo(s, N.id);
      } catch (J) {
        a && (Ce(!0), _(
          J instanceof Error ? J.message : "Could not load progress."
        ));
      }
      if (!a) return;
      const x = (k == null ? void 0 : k.signature) === at(w) ? k : null, de = A ? A.query.filter : x ? Me(x.filter) : Lo(w.view.filter);
      Dt(de), F(
        x ? Dn(x.displayMode, Ee(N)) : Ln(N)
      ), K(
        x ? x.cardSize ?? xr : xr
      );
      try {
        const J = await kt(
          w,
          de,
          A ? A.startAtEnd : !x && w.view.startFrom !== "beginning",
          w.view.selectAllOnLoad === !0
        );
        if (!a) return;
        const he = Cn(
          J.items.map((We) => We.id),
          (x == null ? void 0 : x.focusedId) ?? null,
          (x == null ? void 0 : x.index) ?? 0
        );
        Ie(he), qe(he);
      } catch {
      }
      a && (Rt.current = bt, Ft(!0));
    })(), () => {
      var w;
      a = !1, fr.current++, Kt.current++, (w = pr.current) == null || w.abort();
    };
  }, [N == null ? void 0 : N.id, Se, bt]), U(() => {
    !R || Se || !ie || Q || pe || V || $t.current || Rt.current !== bt || nr(R.id, {
      filter: le,
      objectFilter: R.view.objectFilter,
      searchMode: R.view.searchMode,
      startFrom: R.view.startFrom ?? "end"
    });
  }, [R, Se, ie, Q, pe, le, V, bt]);
  const te = Mt(
    () => ke.items.map((a) => a.id),
    [ke.items]
  );
  U(() => {
    if (!ie || !N || !s || Q || pe || V || (H == null ? void 0 : H.id) === N.id || L)
      return;
    const a = {
      version: 1,
      signature: at(N),
      filter: le,
      focusedId: Te,
      index: Math.max(0, te.indexOf(Te ?? -1)),
      displayMode: m,
      cardSize: G,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        s + ":progress:" + N.id,
        JSON.stringify(a)
      );
    } catch {
    }
    if (C) return;
    let f = !0;
    const w = window.setTimeout(() => {
      ao(s, N.id, a).catch((A) => {
        f && _(
          "Progress is kept in this browser, but account sync failed. " + (A instanceof Error ? A.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      f = !1, window.clearTimeout(w);
    };
  }, [
    ie,
    s,
    N,
    Q,
    pe,
    V,
    le,
    Te,
    te,
    m,
    G,
    H,
    C,
    L
  ]);
  const Ri = ke.items.find((a) => a.id === Te) ?? null, qr = b === "video" ? Ri : null;
  X && qr && (u.current = qr);
  const Ot = qr ?? (X ? u.current : null), qi = Nn(Ae, Te), ki = te.length > 0 && te.every((a) => Ae.has(a)), kr = Ae.size > 0 ? `${Ae.size} selected ${b}${Ae.size === 1 ? "" : "s"}` : Te == null ? `no ${b}` : `focused ${b}`, qe = It((a, f = !0) => {
    a != null && window.requestAnimationFrame(() => {
      const w = Zt.current.get(a);
      w == null || w.focus({ preventScroll: !0 }), f && (w == null || w.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  U(() => {
    ie && !je.current && qe(De.current);
  }, [ie, qe]), U(() => {
    Q || !te.length || (De.current == null || !te.includes(De.current)) && (Ie(te[0]), je.current || qe(te[0]));
  }, [qe, te, Q]);
  const At = It(
    (a) => {
      Ke((f) => {
        const w = a(f);
        for (const A of /* @__PURE__ */ new Set([...f, ...w]))
          f.has(A) !== w.has(A) && dt.current.set(
            A,
            (dt.current.get(A) ?? 0) + 1
          );
        return w;
      });
    },
    []
  ), Or = It(
    (a) => {
      if (!te.length) return;
      const f = Math.max(
        0,
        te.indexOf(De.current ?? te[0])
      ), w = te[Math.max(0, Math.min(te.length - 1, f + a))];
      Ie(w), je.current || qe(w);
    },
    [qe, te]
  ), Ir = It(
    async (a) => {
      const f = "steps" in a ? a.steps.length > 0 : a.effect.mode !== "SKIP", w = "effect" in a && a.effect.mode === "SET_TAG_GROUP" ? a.effect.tagGroupId : null, A = w != null && (!q || !I.some((se) => se.id === w)), D = "effect" in a && f && !q, k = Nn(
        Ve.current,
        De.current
      );
      if (!N || ge.current || Q || pe) return;
      const x = f && !xt ? `${b === "tag" ? "Tag" : "Video"} write permission is required to apply ${a.label}.` : D || A ? `${a.label} needs a tag group that is unavailable.` : vr(a) && (ae == null ? void 0 : ae.kind) !== "ready" ? `Set up tag assessments before applying ${a.label}.` : k.length ? "" : `Select or focus a ${b} before applying ${a.label}.`;
      if (x) {
        ft(x);
        return;
      }
      const de = ++fr.current, J = N.id, he = [...te], We = ke, He = De.current, pt = new Set(Ve.current), yn = new Map(
        k.map((se) => [se, dt.current.get(se) ?? 0])
      ), Vt = () => de === fr.current && N.id === J;
      ge.current = !0, ze(!0), Oe(
        Ve.current.size ? `${k.length} selected ${b}s` : `the focused ${b}`
      ), Z(""), ft("");
      const wn = We.items.filter(
        (se) => !k.includes(se.id)
      ), Li = wn.map((se) => se.id), vn = An(
        he,
        Li,
        He,
        k.includes(He ?? -1)
      );
      Le({
        items: wn,
        totalCount: We.totalCount
      }), Ke((se) => {
        const _e = new Set(se);
        for (const Xe of k) _e.delete(Xe);
        return _e;
      }), Ie(vn), je.current || qe(vn);
      let Pr = !1;
      try {
        if ("effect" in a ? await wo(a, k) : await di(a, k), Pr = !0, !Vt()) return;
        Ke((se) => {
          const _e = new Set(se);
          for (const Xe of k)
            (dt.current.get(Xe) ?? 0) === yn.get(Xe) && _e.delete(Xe);
          return _e;
        }), Z(
          `${a.label}: ${k.length} ${b}${k.length === 1 ? "" : "s"} ${f ? "updated" : "skipped"}.`
        );
      } catch (se) {
        if (!Vt()) return;
        Le(We), Ke((_e) => {
          const Xe = new Set(_e);
          for (const Ye of k)
            pt.has(Ye) && (dt.current.get(Ye) ?? 0) === yn.get(Ye) && Xe.add(Ye);
          return Xe;
        }), Ie(He), je.current || qe(He), ft(
          se instanceof Error ? se.message : "Action failed."
        );
      }
      try {
        if (await ho(a), !Vt()) return;
        const se = new Set(k), _e = _t && he.length > 0 && he.every((gt) => se.has(gt)), Xe = await kt(N, le, !1, _e);
        if (!Vt()) return;
        let Ye = Xe.items.map((gt) => gt.id);
        if (!Ye.length && Xe.totalCount > 0 && Number(le.page) > 1) {
          const gt = Math.max(1, Number(le.page) - 1), mr = { ...le, page: gt };
          Dt(mr), Ye = (await kt(
            N,
            mr,
            !1,
            _e
          )).items.map((Fr) => Fr.id), Ke(
            (Fr) => new Set([...Fr].filter((Di) => Ye.includes(Di)))
          );
          const En = Ye.at(-1) ?? null;
          Ie(En), je.current || qe(En);
        } else {
          Ke(
            (mr) => new Set([...mr].filter((Sn) => Ye.includes(Sn)))
          );
          const gt = An(
            he,
            Ye,
            He,
            Pr && k.includes(He ?? -1)
          );
          Ie(gt), je.current && gt == null && $e(!1), je.current || qe(gt);
        }
      } catch (se) {
        Vt() && ft(
          (_e) => `${_e ? `${_e} ` : ""}${Pr ? "The action completed, but " : ""}the queue could not be refreshed. ${se instanceof Error ? se.message : "Refresh failed."}`
        );
      } finally {
        Vt() && (ge.current = !1, ze(!1), Oe(""), $t.current && ($t.current = !1, rt(Lr()), yt((se) => se + 1)));
      }
    },
    [
      xt,
      q,
      I,
      b,
      ae,
      kt,
      le,
      qe,
      te,
      ke,
      Q,
      pe,
      N
    ]
  );
  function Oi() {
    var w;
    if (m === "list") return 1;
    const a = (w = fn.current) == null ? void 0 : w.firstElementChild, f = a ? getComputedStyle(a).gridTemplateColumns : "";
    return Math.max(1, f.split(" ").filter(Boolean).length);
  }
  const hn = P(() => {
  });
  hn.current = (a) => {
    var x;
    if (Se || a.defaultPrevented || a.repeat || a.ctrlKey || a.altKey || a.metaKey || re) return;
    const f = a.target, w = f instanceof Node && ((x = Tr.current) == null ? void 0 : x.contains(f)) === !0, A = f === document.body || f === document.documentElement;
    if (!w && !A) return;
    if (X && a.key === "Escape") {
      et(a), $e(!1), qe(De.current);
      return;
    }
    if (!Hi(f)) return;
    const D = ni(f);
    if (a.key === "Escape") {
      et(a), At(() => /* @__PURE__ */ new Set());
      return;
    }
    const k = (N == null ? void 0 : N.actions.findIndex(
      (de, J) => Tt(de, J) === a.key.toLowerCase()
    )) ?? -1;
    if (k >= 0 && (N != null && N.actions[k])) {
      et(a), !V && !Q && Ir(N.actions[k]);
      return;
    }
    if (!X && a.key === " " && D) {
      et(a), Te != null && At((de) => yr(de, Te));
      return;
    }
    if (!X && a.key.toLowerCase() === "a") {
      et(a), At(
        (de) => Tn(de, te)
      );
      return;
    }
    if (!(V || Q) && !X && a.key === "Enter" && Te != null && D) {
      et(a), b === "tag" ? window.open(`/tag/${Te}`, "_blank", "noopener,noreferrer") : $e(!0);
      return;
    }
  }, U(() => {
    const a = (f) => hn.current(f);
    return document.addEventListener("keydown", a), () => document.removeEventListener("keydown", a);
  }, []);
  const mn = P(
    () => {
    }
  );
  mn.current = (a) => {
    var k;
    if (Se || re || X || V || Q || !te.length || a.defaultPrevented || a.repeat || a.ctrlKey || a.altKey || a.metaKey)
      return;
    const f = a.target, w = f instanceof Node && ((k = Tr.current) == null ? void 0 : k.contains(f)) === !0, A = f === document.body || f === document.documentElement;
    if (!w && !A || !a.key.startsWith("Arrow") || !Xi(f)) return;
    const D = Yi(a.key, Oi());
    D && (a.preventDefault(), w ? a.stopImmediatePropagation() : a.stopPropagation(), Or(D));
  }, U(() => {
    const a = (f) => mn.current(f);
    return document.addEventListener("keydown", a), () => document.removeEventListener("keydown", a);
  }, []);
  function er(a) {
    Qe(null), it(0), rt(a), jn(a);
  }
  function Ii() {
    be.current = !0, nt({}), er("");
  }
  async function Mr(a) {
    if (!s) return !1;
    const f = a.map(Vo);
    try {
      await io(s, f);
    } catch (A) {
      throw A;
    }
    r(f), ce && !f.some((A) => A.id === ce) && er("");
    const w = f.find((A) => A.id === ce);
    return w && Qe(null), w && B && JSON.stringify(w) !== JSON.stringify(B) && (w.view.displayMode !== B.view.displayMode && F(Ln(w)), at(w) !== at(B) && (ne(null), Ee(w) === "video" && nr(w.id, {
      filter: Me(w.view.filter),
      objectFilter: w.view.objectFilter,
      searchMode: w.view.searchMode,
      startFrom: w.view.startFrom ?? "end"
    }), Se || hr(
      w,
      Me({ ...w.view.filter, page: le.page })
    ))), !0;
  }
  if (o)
    return /* @__PURE__ */ n(_n, { label: "Loading reviews…" });
  if (l)
    return /* @__PURE__ */ d(we, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Yo().catch(
            (a) => h(
              "Could not export browser reviews. " + (a instanceof Error ? a.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        Un,
        {
          message: l,
          onRetry: () => void gn()
        }
      )
    ] });
  return /* @__PURE__ */ d("div", { ref: Tr, className: "data-quality-page", children: [
    /* @__PURE__ */ d("header", { className: "data-quality-header", children: [
      N && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: V,
          onClick: Ii,
          children: /* @__PURE__ */ n(Wn, {})
        }
      ),
      /* @__PURE__ */ d("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (N == null ? void 0 : N.name) ?? "Data Quality" }),
        (N == null ? void 0 : N.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: N.description })
      ] }),
      N && B && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: V || Q || !ue,
          onClick: () => {
            Se ? it((a) => a + 1) : (ye(!0), Je(!0));
          },
          children: /* @__PURE__ */ n(Hn, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: V || Q || !ue,
          onClick: () => {
            ye(!1), Je(!0);
          },
          children: /* @__PURE__ */ n(Vi, {})
        }
      )
    ] }),
    p && /* @__PURE__ */ n("p", { className: "dq-status", children: p }),
    R && (ae == null ? void 0 : ae.kind) === "missing" && /* @__PURE__ */ d("div", { role: "status", className: "dq-status", children: [
      ae.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: Nt,
          onClick: () => {
            Re(!0), Ct(""), bo().then(gr).catch(
              (a) => Ct(
                "Could not create the Confirmed absent tags custom field. " + (a instanceof Error ? a.message : "Request failed.")
              )
            ).finally(() => Re(!1));
          },
          children: Nt ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    R && ((ae == null ? void 0 : ae.kind) === "incompatible" || dr) && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(_r, {}),
      dr || (ae == null ? void 0 : ae.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: Nt,
          onClick: () => {
            Re(!0), gr().finally(
              () => Re(!1)
            );
          },
          children: Nt ? "Checking…" : "Check again"
        }
      )
    ] }),
    i && /* @__PURE__ */ d("details", { children: [
      /* @__PURE__ */ n("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ n("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const a = localStorage.getItem("page-videos") ?? "[]", f = URL.createObjectURL(
              new Blob([a], { type: "application/json" })
            ), w = document.createElement("a");
            w.href = f, w.download = "data-quality-unassigned-legacy-reviews.json", w.click(), URL.revokeObjectURL(f);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    C && /* @__PURE__ */ d("p", { role: "alert", children: [
      C,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            _(""), Ce(!1);
          },
          children: L ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    R && /* @__PURE__ */ d("label", { className: "dq-layout-control", children: [
      "Review layout",
      /* @__PURE__ */ d(
        "select",
        {
          "aria-label": "Review layout",
          value: Wt,
          disabled: V || Q || re,
          onChange: (a) => Qe({ id: R.id, mode: a.target.value }),
          children: [
            /* @__PURE__ */ n("option", { value: "single", children: "Single video" }),
            /* @__PURE__ */ n("option", { value: "multiple", children: "Multiple videos" })
          ]
        }
      )
    ] }),
    N && B && !Se && /* @__PURE__ */ d("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${V || Q ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": V || Q || void 0,
          inert: V || Q ? !0 : void 0,
          children: /* @__PURE__ */ n(
            ir,
            {
              filter: pe ? vt : le,
              onFilterChange: Mi,
              totalCount: ke.totalCount,
              sortOptions: b === "tag" ? Jn : Xr,
              showSearch: !0,
              showSort: !0,
              displayMode: m,
              onDisplayModeChange: (a) => F(Dn(a, b)),
              availableDisplayModes: b === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (G - 225) / 50,
              onZoomChange: (a) => K(Math.round(225 + a * 50)),
              cardSizeEntityType: b === "tag" ? "tags" : "videos",
              criteriaDefinitions: b === "tag" ? Qn : Cr,
              customFieldEntityType: b === "video" ? "video" : void 0,
              objectFilter: Ti,
              onObjectFilterChange: (a) => {
                !V && !Q && (ot.current = b === "video" ? ui(
                  a,
                  Ut,
                  N.view.objectFilter
                ) : a);
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (H == null ? void 0 : H.id) === ce && /* @__PURE__ */ d("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: V || Q || !ue,
            onClick: Fi,
            children: /* @__PURE__ */ n(Yr, {})
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Reset to default review filters",
            title: "Reset to default review filters",
            disabled: V || Q,
            onClick: Pi,
            children: /* @__PURE__ */ n(zn, {})
          }
        )
      ] })
    ] }),
    N ? Se ? /* @__PURE__ */ n(Mo, { review: N, canWrite: N.entityType === "performerOccurrence" ? T : E, onBusy: ze, editRequest: xe, renderRuleEditor: (a, f, w) => /* @__PURE__ */ n(Ci, { workspace: !0, draft: a, entityTypeLocked: !0, tagGroups: I, saving: w, setDraft: (A) => f(A), onSave: () => {
    }, onCancel: () => {
    } }), onSaveDefaults: ue ? (a) => Mr(t.map((f) => f.id === a.id ? a : f)) : void 0 }, N.id) : /* @__PURE__ */ d(we, { children: [
      R && wt.error && /* @__PURE__ */ n("p", { role: "alert", children: wt.error }),
      R && /* @__PURE__ */ n(
        $o,
        {
          videos: ke.items,
          review: R,
          trees: wt.ids,
          disabled: V || Q,
          onChoose: (a) => {
            const f = xo(R, a);
            ne(f), hr(f, { ...le, page: 1 });
          }
        }
      ),
      Ge && !X && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(_r, {}),
        Ge
      ] }),
      Et && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: Et }),
      bn("top"),
      /* @__PURE__ */ d(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${Y}px`
          },
          children: [
            /* @__PURE__ */ d("main", { children: [
              Q && !ke.items.length && /* @__PURE__ */ n(_n, { label: "Loading review queue…" }),
              pe && !Q && /* @__PURE__ */ n(
                Un,
                {
                  message: pe,
                  retryLabel: Ue ? "Reset to review defaults" : "Retry",
                  onRetry: () => {
                    if (Ue && B && Ee(B) === "video") {
                      const a = Jt(B);
                      nr(B.id, { ...a, filter: { ...a.filter, page: void 0 } }), yt((f) => f + 1);
                      return;
                    }
                    kt(
                      N,
                      le,
                      jt,
                      _t
                    ).catch(() => {
                    });
                  }
                }
              ),
              !V && !Q && !pe && !ke.items.length && /* @__PURE__ */ d("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(Ur, {}),
                /* @__PURE__ */ d("p", { children: [
                  "No ",
                  b,
                  "s match this review."
                ] })
              ] }),
              !!ke.items.length && /* @__PURE__ */ n("div", { ref: fn, children: /* @__PURE__ */ n(
                "div",
                {
                  className: m === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${G}px`
                  },
                  children: ke.items.map(xi)
                }
              ) })
            ] }),
            /* @__PURE__ */ n(
              "div",
              {
                className: "dq-workspace-separator",
                role: "separator",
                tabIndex: 0,
                "aria-label": "Resize review sidebar",
                "aria-orientation": "vertical",
                "aria-valuemin": Wr,
                "aria-valuemax": Hr,
                "aria-valuenow": Y,
                "aria-valuetext": `${Y} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (a) => {
                  ur.current = {
                    pointerId: a.pointerId,
                    startX: a.clientX,
                    startWidth: Y
                  }, a.currentTarget.setPointerCapture(a.pointerId);
                },
                onPointerMove: (a) => {
                  const f = ur.current;
                  (f == null ? void 0 : f.pointerId) === a.pointerId && a.currentTarget.hasPointerCapture(a.pointerId) && Rr(
                    f.startWidth + f.startX - a.clientX
                  );
                },
                onPointerUp: () => {
                  ur.current = null;
                },
                onPointerCancel: () => {
                  ur.current = null;
                },
                onKeyDown: Ai,
                onDoubleClick: () => Rr(cn),
                children: /* @__PURE__ */ n("span", {})
              }
            ),
            /* @__PURE__ */ d("aside", { className: "dq-actions", children: [
              /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  className: "dq-selection-toggle",
                  "aria-keyshortcuts": "a",
                  disabled: !te.length,
                  onClick: () => At(
                    (a) => Tn(a, te)
                  ),
                  children: [
                    ki ? "Clear selection" : "Select all on page",
                    /* @__PURE__ */ n("kbd", { "aria-hidden": "true", children: "A" })
                  ]
                }
              ),
              /* @__PURE__ */ n("strong", { children: Ae.size > 0 ? kr : Te == null ? "Nothing to apply to" : `Applies to the ${kr}` }),
              N.actions.map((a, f) => {
                const w = "steps" in a ? a.steps.length > 0 : a.effect.mode !== "SKIP", A = "effect" in a && a.effect.mode === "SET_TAG_GROUP" ? a.effect.tagGroupId : null, D = A != null ? I.find((x) => x.id === A) : void 0, k = A != null && !D;
                return /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    disabled: V || Q || !!pe || w && !xt || "effect" in a && w && (!q || k) || vr(a) && (ae == null ? void 0 : ae.kind) !== "ready" || !qi.length,
                    onClick: () => void Ir(a),
                    children: [
                      /* @__PURE__ */ d("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: a.label }),
                        "effect" in a ? /* @__PURE__ */ n("small", { children: a.effect.mode === "SKIP" ? "Skip" : a.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : D ? `Assign ${D.name}` : "Unavailable tag group" }) : a.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: a.steps.flatMap(
                          (x, de) => x.tagIds.map((J, he) => {
                            const We = dn[J] === void 0 ? "Tag" : dn[J] ?? "Unavailable tag", He = Ei(x, We), pt = _o(x, We);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": Si(x.mode),
                                "aria-label": pt,
                                title: `Step ${de + 1}: ${pt}`,
                                children: He
                              },
                              `${de}-${J}-${he}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      Tt(a, f) && /* @__PURE__ */ n("kbd", { children: Tt(a, f) })
                    ]
                  },
                  a.id
                );
              }),
              !N.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              !xt && /* @__PURE__ */ d("p", { children: [
                b === "tag" ? "Tag" : "Video",
                " write permission is required to apply actions."
              ] }),
              b === "tag" && O && /* @__PURE__ */ d("p", { children: [
                "Tag groups are unavailable. ",
                O
              ] }),
              V && /* @__PURE__ */ d("p", { role: "status", children: [
                /* @__PURE__ */ n(Yn, { className: "dq-spin" }),
                " Applying action to",
                " ",
                Be,
                "…"
              ] }),
              /* @__PURE__ */ d("p", { className: "dq-shortcuts", children: [
                "←→↑↓ move · space select · enter ",
                b === "tag" ? "open" : "preview",
                " · Q–P apply · A toggle shown · Esc clear"
              ] })
            ] })
          ]
        }
      ),
      bn("bottom")
    ] }) : t.length ? /* @__PURE__ */ d(
      "section",
      {
        className: "dq-review-browser",
        "aria-labelledby": "dq-reviews-title",
        children: [
          /* @__PURE__ */ d("div", { className: "dq-review-browser-heading", children: [
            /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ n(
                "h2",
                {
                  id: "dq-reviews-title",
                  ref: ve,
                  tabIndex: -1,
                  children: "Reviews"
                }
              ),
              /* @__PURE__ */ n("p", { children: "Choose a review to open its queue." }),
              /* @__PURE__ */ n("span", { className: "dq-sr-only", role: "status", children: t.every(
                (a) => Fe[a.id] !== void 0
              ) ? t.some((a) => Fe[a.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" })
            ] }),
            /* @__PURE__ */ d("div", { className: "dq-review-browser-sort", children: [
              /* @__PURE__ */ d("label", { children: [
                /* @__PURE__ */ n("span", { className: "dq-sr-only", children: "Sort reviews by" }),
                /* @__PURE__ */ d(
                  "select",
                  {
                    "aria-label": "Sort reviews by",
                    value: me,
                    onChange: (a) => ct(
                      a.target.value
                    ),
                    children: [
                      /* @__PURE__ */ n("option", { value: "name", children: "Name" }),
                      /* @__PURE__ */ n("option", { value: "count", children: "Item count" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  "aria-label": ee === "asc" ? "Ascending" : "Descending",
                  title: ee === "asc" ? "Ascending" : "Descending",
                  onClick: () => Ne(
                    (a) => a === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    Xn,
                    {
                      className: ee === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: Lt.map((a) => {
            const f = Fe[a.id], w = Ee(a), A = w === "tag" ? "tag" : w === "performerOccurrence" ? "scene" : "video";
            return /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                disabled: V,
                onClick: () => er(a.id),
                children: [
                  /* @__PURE__ */ d("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ d("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(bi, { entityType: w }),
                      /* @__PURE__ */ n("strong", { children: a.name })
                    ] }),
                    /* @__PURE__ */ n(
                      "span",
                      {
                        className: "dq-review-count",
                        "aria-label": f === void 0 ? `Counting matching ${A}s` : f === null ? `Matching ${A} count unavailable` : `${f.toLocaleString()} matching ${f === 1 ? A : `${A}s`}`,
                        children: f === void 0 ? "…" : f === null ? "—" : f.toLocaleString()
                      }
                    )
                  ] }),
                  a.description && /* @__PURE__ */ n("span", { className: "dq-review-rule-name", children: a.description })
                ]
              },
              a.id
            );
          }) })
        ]
      }
    ) : /* @__PURE__ */ d("div", { className: "dq-empty", children: [
      /* @__PURE__ */ n(Ur, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    X && Ot && R && /* @__PURE__ */ n(
      Qo,
      {
        video: Ot,
        review: R,
        targetLabel: kr,
        pending: V,
        refreshing: Q || !!pe,
        error: Ge,
        canWrite: E,
        assessmentReady: (ae == null ? void 0 : ae.kind) === "ready",
        selected: Ae.has(Ot.id),
        hasPrevious: te.indexOf(Ot.id) > 0,
        hasNext: te.indexOf(Ot.id) >= 0 && te.indexOf(Ot.id) < te.length - 1,
        onToggleSelected: () => At((a) => yr(a, Ot.id)),
        onPrevious: () => Or(-1),
        onNext: () => Or(1),
        onClose: () => {
          $e(!1), qe(De.current);
        },
        onAction: Ir
      }
    ),
    re && /* @__PURE__ */ n(
      zo,
      {
        reviews: t,
        activeReview: B,
        tagGroups: I,
        initialEdit: oe,
        onSave: Mr,
        onChoose: er,
        onEditWorkspace: (a) => {
          a !== ce && er(a), Qe({ id: a, mode: "single" }), it((f) => f + 1), Je(!1);
        },
        onClose: () => {
          Je(!1), oe && qe(De.current, !1);
        }
      }
    )
  ] });
  async function hr(a, f, w = !1) {
    const A = De.current, D = Math.max(0, te.indexOf(A ?? -1));
    try {
      const x = (await kt(
        a,
        f,
        w,
        a.view.selectAllOnLoad === !0
      )).items.map((J) => J.id);
      Ke(
        (J) => new Set([...J].filter((he) => x.includes(he)))
      );
      const de = Cn(x, A, D);
      Ie(de), je.current || qe(de, !1);
    } catch {
    }
  }
  function Mi(a) {
    const f = ot.current;
    if (ot.current = null, V || Q || !N || !B) return;
    const w = f ?? N.view.objectFilter, A = ar(
      w,
      B.view.objectFilter
    ) ? B.view.objectFilter : w, D = Me({ ...a, page: 1 }), k = {
      ...N,
      view: {
        ...N.view,
        filter: D,
        objectFilter: A
      }
    }, x = at(k) !== at(B), de = x ? k : B;
    ne(x ? k : null), Z(x ? "" : "Review queue defaults restored."), hr(de, D, !0);
  }
  function Pi() {
    if (V || Q || !B) return;
    ot.current = null;
    const a = Me({
      ...B.view.filter,
      page: 1
    });
    ne(null), Z("Review queue defaults restored."), hr(
      B,
      a,
      B.view.startFrom !== "beginning"
    );
  }
  function Fi() {
    V || Q || !N || !B || !ue || Mr(
      t.map(
        (a) => a.id === ce ? {
          ...a,
          view: {
            ...N.view,
            filter: { ...le, page: 1 }
          }
        } : a
      )
    ).then(() => {
      ne(null), Z("Queue saved to this review.");
    }).catch(
      (a) => ft(
        a instanceof Error ? a.message : "Could not save queue."
      )
    );
  }
  function $i() {
    Ke(/* @__PURE__ */ new Set()), dt.current.clear(), Ie(null);
  }
  function bn(a) {
    return N ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: V || Q,
        "aria-label": `Review queue pagination ${a}`,
        children: /* @__PURE__ */ n(
          Bn,
          {
            filter: {
              ...le,
              page: Number(le.page) || 1,
              perPage: Number(le.perPage) || 40
            },
            totalCount: ke.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${a}`,
            onFilterChange: (f) => {
              V || Q || f.page === Number(le.page) || Ko(
                { ...le, page: f.page },
                N,
                (w, A) => kt(w, A, !1, _t),
                $i
              );
            }
          }
        )
      }
    ) : null;
  }
  function xi(a) {
    var w, A, D;
    if (b === "tag") {
      const k = a;
      return /* @__PURE__ */ n(
        Bo,
        {
          tag: k,
          displayMode: m === "list" ? "list" : "grid",
          focused: k.id === Te,
          selected: Ae.has(k.id),
          setRef: (x) => {
            x ? Zt.current.set(k.id, x) : Zt.current.delete(k.id);
          },
          onFocus: () => Ie(k.id),
          onToggle: () => {
            At((x) => yr(x, k.id)), qe(k.id, !1);
          },
          onOpen: () => window.open(`/tag/${k.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        k.id
      );
    }
    const f = a;
    return /* @__PURE__ */ n(
      Go,
      {
        video: Fo(f, R, wt.ids),
        showTagBins: ((A = (w = R == null ? void 0 : R.presentation) == null ? void 0 : w.annotations) == null ? void 0 : A.includes("tags")) && !!((D = R.presentation.annotationParents) != null && D.length),
        displayMode: m,
        focused: f.id === Te,
        selected: Ae.has(f.id),
        setRef: (k) => {
          k ? Zt.current.set(f.id, k) : Zt.current.delete(f.id);
        },
        onFocus: () => Ie(f.id),
        onToggle: () => At((k) => yr(k, f.id)),
        onPreview: () => {
          Ie(f.id), $e(!0);
        },
        onNavigate: e
      },
      f.id
    );
  }
}
function Ko(e, t, r, i) {
  i(), r(t, e).catch(() => {
  });
}
function yr(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Vo(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Bo({
  tag: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: s,
  onFocus: c,
  onToggle: o,
  onOpen: g,
  onNavigate: l
}) {
  return /* @__PURE__ */ n(
    "article",
    {
      ref: s,
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${e.name}${i ? ", selected" : ""}`,
      onFocus: c,
      onClick: (h) => {
        c(), h.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        Ui,
        {
          tag: e,
          selected: i,
          onSelect: o,
          onClick: g,
          onNavigate: l
        }
      ) : /* @__PURE__ */ d("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "aria-label": i ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": i,
            onClick: (h) => {
              h.stopPropagation(), o();
            },
            children: i ? "✓" : ""
          }
        ),
        /* @__PURE__ */ n("button", { type: "button", className: "dq-tag-list-name", onClick: g, children: e.name }),
        /* @__PURE__ */ n("span", { children: e.tagGroupName || "Ungrouped" }),
        /* @__PURE__ */ n("span", { children: e.description || "" }),
        /* @__PURE__ */ d("span", { children: [
          e.videoCount ?? 0,
          " videos"
        ] })
      ] })
    }
  );
}
function Go({
  video: e,
  showTagBins: t,
  displayMode: r,
  focused: i,
  selected: s,
  setRef: c,
  onFocus: o,
  onToggle: g,
  onPreview: l,
  onNavigate: h
}) {
  var M, I;
  const E = yi(e), S = P(null), T = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(T.date || T.studioName), q = !!(T.performers.length || T.tags.length);
  return Kn(() => {
    const j = S.current;
    if (!j) return;
    const O = j.querySelector(
      `a[href="/video/${e.id}"]`
    ), W = j.querySelector(".card-title"), ue = `dq-card-title-${e.id}`;
    W && (W.id = ue), O && (O.target = "_blank", O.rel = "noreferrer", O.removeAttribute("aria-label"), O.setAttribute("aria-labelledby", ue), O.classList.add("dq-card-link"));
    const Pe = j.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    Pe && Pe.setAttribute(
      "aria-label",
      s ? `Deselect ${E}` : `Select ${E}`
    );
    const p = j.querySelector(
      'button[title="Quick View"]'
    );
    p && p.setAttribute("aria-label", `Preview ${E}`);
  }), /* @__PURE__ */ d(
    "article",
    {
      ref: (j) => {
        S.current = j, c(j);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${E}${s ? ", selected" : ""}`,
      onFocus: o,
      onClick: (j) => {
        o(), j.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${r} ${y ? "has-card-metadata" : "no-card-metadata"} ${q ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${s ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          Ki,
          {
            video: T,
            selected: s,
            onSelect: g,
            onNavigate: h,
            onQuickView: l,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ d("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (M = e.tags) == null ? void 0 : M.map((j) => /* @__PURE__ */ n("span", { children: j.name }, j.id)),
          !((I = e.tags) != null && I.length) && /* @__PURE__ */ n("small", { children: "No matching tags" })
        ] }),
        r === "wall" && /* @__PURE__ */ n(Jo, { video: e })
      ]
    }
  );
}
function Jo({ video: e }) {
  const t = P(null), r = P(null), [i, s] = v(!1), [c, o] = v(!1), [g, l] = v(!1);
  return U(() => {
    const h = t.current;
    if (!h || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      s(!0), o(!0);
      return;
    }
    const E = new IntersectionObserver(
      ([T]) => s(T.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), S = new IntersectionObserver(
      ([T]) => o(T.isIntersecting && T.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return E.observe(h), S.observe(h), () => {
      E.disconnect(), S.disconnect();
    };
  }, [e.id, e.files.length]), U(() => {
    if (!i) {
      l(!1);
      return;
    }
    const h = new AbortController();
    return z(go(e.id), {
      signal: h.signal
    }).then((E) => {
      h.signal.aborted || l(E.available === !0);
    }).catch(() => {
      h.signal.aborted || l(!1);
    }), () => h.abort();
  }, [i, e.id]), U(() => {
    const h = r.current;
    h && (c ? Promise.resolve(h.play()).catch(() => {
    }) : h.pause());
  }, [g, c]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: g && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: po(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Qo({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: s,
  error: c,
  canWrite: o,
  assessmentReady: g,
  selected: l,
  hasPrevious: h,
  hasNext: E,
  onToggleSelected: S,
  onPrevious: T,
  onNext: y,
  onClose: q,
  onAction: M
}) {
  const I = P(null), j = P(null), O = e.files[0], W = yi(e);
  U(() => {
    var $;
    const p = document.body.style.overflow;
    return document.body.style.overflow = "hidden", ($ = I.current) == null || $.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = p;
    };
  }, []);
  function ue(p) {
    var _, L, Ce;
    if (p.key !== "Tab") return;
    const $ = [
      ...((_ = I.current) == null ? void 0 : _.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ie) => ie.offsetParent !== null);
    if (!$.length) {
      p.preventDefault(), (L = I.current) == null || L.focus();
      return;
    }
    const C = $.indexOf(
      document.activeElement
    );
    p.shiftKey && C <= 0 ? (p.preventDefault(), (Ce = $.at(-1)) == null || Ce.focus()) : !p.shiftKey && C === $.length - 1 && (p.preventDefault(), $[0].focus());
  }
  function Pe(p) {
    if (p.defaultPrevented || p.ctrlKey || p.metaKey || p.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const $ = p.key === "ArrowLeft" || p.key === "ArrowRight";
    if (p.altKey && !$) return;
    const C = j.current, _ = p.currentTarget.querySelector("video");
    if (p.key === "Enter" || p.key === "Escape")
      p.repeat || q();
    else if (p.key === " " && C)
      p.repeat || C.toggle();
    else if ($ && C)
      C.seekBy(
        (p.key === "ArrowLeft" ? -1 : 1) * (p.shiftKey ? 5 : p.altKey ? 10 : 60)
      );
    else if ((p.key === "," || p.key === ".") && C) {
      const L = [O == null ? void 0 : O.duration, _ == null ? void 0 : _.duration].find(
        (ie) => ie != null && Number.isFinite(ie) && ie > 0
      ) ?? 0, Ce = e.parentVideoId != null ? (e.clipEndSec ?? L) - (e.clipStartSec ?? 0) : L;
      Number.isFinite(Ce) && Ce > 0 && C.seekBy((p.key === "," ? -1 : 1) * Ce * 0.1);
    } else if (p.key.toLowerCase() === "n" || p.key.toLowerCase() === "m")
      !p.repeat && !i && !s && (p.key.toLowerCase() === "n" && h && T(), p.key.toLowerCase() === "m" && E && y());
    else if (p.key === "ArrowUp" && _)
      _.volume = Math.min(1, _.volume + 0.1);
    else if (p.key === "ArrowDown" && _)
      _.volume = Math.max(0, _.volume - 0.1);
    else return;
    et(p);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: I,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${W}`,
      className: "dq-preview",
      onKeyDown: ue,
      onKeyDownCapture: Pe,
      onMouseDown: (p) => {
        p.target === p.currentTarget && q();
      },
      children: /* @__PURE__ */ d("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ d("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !h || i || s,
              onClick: T,
              children: /* @__PURE__ */ n(Wn, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !E || i || s,
              onClick: y,
              children: /* @__PURE__ */ n(Xn, {})
            }
          ),
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ n("h2", { children: W }),
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
              onClick: S,
              disabled: s,
              children: l ? "Selected" : "Select"
            }
          ),
          /* @__PURE__ */ n(
            "a",
            {
              href: `/video/${e.id}`,
              target: "_blank",
              rel: "noreferrer",
              className: "dq-details-link",
              "aria-label": `Open ${W} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ n(Gi, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: q,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(Zn, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: O ? /* @__PURE__ */ n(
          Gn,
          {
            autostart: !0,
            streamUrl: li(e.id),
            posterUrl: kn(e),
            format: O.format,
            audioCodec: O.audioCodec,
            duration: O.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (p) => (j.current = p, () => {
              j.current === p && (j.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: kn(e), alt: "" }) }),
        c && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: c }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((p, $) => /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            disabled: i || s || p.steps.length > 0 && !o || vr(p) && !g,
            onClick: () => void M(p),
            children: [
              Tt(p, $) && /* @__PURE__ */ n("kbd", { children: Tt(p, $) }),
              p.label
            ]
          },
          p.id
        )) })
      ] })
    }
  );
}
function zo({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: i = !1,
  onEditWorkspace: s,
  onSave: c,
  onChoose: o,
  onClose: g
}) {
  const [l, h] = v(
    () => i && t ? structuredClone(t) : null
  ), [E, S] = v(""), [T, y] = v(!1), [q, M] = v(
    i && t != null
  ), I = P(null);
  U(() => {
    var C, _;
    const p = document.activeElement, $ = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (_ = (C = I.current) == null ? void 0 : C.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || _.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = $, p == null || p.focus({ preventScroll: !0 });
    };
  }, []);
  function j(p) {
    var _, L, Ce;
    if (p.defaultPrevented) {
      p.stopPropagation();
      return;
    }
    if (p.key === "Escape") {
      et(p), T || g();
      return;
    }
    if (p.key !== "Tab") {
      p.stopPropagation();
      return;
    }
    const $ = [
      ...((_ = I.current) == null ? void 0 : _.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ie) => ie.offsetParent !== null);
    if (!$.length) {
      et(p), (L = I.current) == null || L.focus();
      return;
    }
    const C = $.indexOf(
      document.activeElement
    );
    p.shiftKey && C <= 0 ? (et(p), (Ce = $.at(-1)) == null || Ce.focus()) : !p.shiftKey && C === $.length - 1 ? (et(p), $[0].focus()) : p.stopPropagation();
  }
  function O(p, $ = !!p) {
    M($), h(
      p ? structuredClone(p) : {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        entityType: "video",
        view: {
          filter: {
            page: 1,
            perPage: 40,
            sort: "date",
            direction: "desc"
          },
          objectFilter: {},
          displayMode: "grid",
          searchMode: "text",
          startFrom: "end"
        },
        actions: []
      }
    ), S("");
  }
  async function W() {
    if (T) return;
    if (!l || wr(l)) {
      S(l ? wr(l) : "Choose a review.");
      return;
    }
    const p = { ...l, name: l.name.trim() }, $ = e.some((C) => C.id === p.id) ? e.map((C) => C.id === p.id ? p : C) : [...e, p];
    y(!0), S("");
    try {
      if (!await c($)) throw new Error("Could not save reviews.");
      !e.some((C) => C.id === p.id) && p.entityType !== "tag" ? s(p.id) : (o(p.id), g());
    } catch (C) {
      S(
        "Could not save reviews. Your edits are still open. " + (C instanceof Error ? C.message : "Retry saving.")
      );
    } finally {
      y(!1);
    }
  }
  async function ue(p) {
    if (!T) {
      y(!0), S("");
      try {
        if (!await c(p)) throw new Error("Could not save reviews.");
      } catch ($) {
        S(
          $ instanceof Error ? $.message : "Could not save reviews."
        );
      } finally {
        y(!1);
      }
    }
  }
  async function Pe(p) {
    var C;
    if (T) return;
    const $ = (C = p.target.files) == null ? void 0 : C[0];
    if (p.target.value = "", !!$) {
      if ($.size > 2e6) {
        S("Review files must be smaller than 2 MB.");
        return;
      }
      y(!0), S("");
      try {
        const _ = sr(await $.text());
        if (!await c(Kr(e, _)))
          throw new Error("Could not save reviews.");
      } catch (_) {
        S(
          _ instanceof Error ? _.message : "Could not import reviews."
        );
      } finally {
        y(!1);
      }
    }
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: I,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: j,
      children: /* @__PURE__ */ d("div", { className: "dq-manager", children: [
        /* @__PURE__ */ d("header", { children: [
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ n("h2", { children: l ? e.some((p) => p.id === l.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: T,
              onClick: g,
              children: /* @__PURE__ */ n(Zn, {})
            }
          )
        ] }),
        E && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: E }),
        /* @__PURE__ */ n("fieldset", { disabled: T, className: "dq-manager-content", children: l ? /* @__PURE__ */ n(
          Ci,
          {
            setup: l.entityType !== "tag" && !e.some((p) => p.id === l.id),
            draft: l,
            entityTypeLocked: q,
            tagGroups: r,
            saving: T,
            setDraft: h,
            onSave: () => void W(),
            onCancel: g
          }
        ) : /* @__PURE__ */ d(we, { children: [
          /* @__PURE__ */ d("div", { className: "dq-manager-tools", children: [
            /* @__PURE__ */ n("button", { type: "button", className: "dq-button", onClick: () => {
              const p = URL.createObjectURL(new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })), $ = document.createElement("a");
              $.href = p, $.download = "data-quality-reviews.json", $.click(), URL.revokeObjectURL(p);
            }, children: "Export reviews" }),
            /* @__PURE__ */ d(
              "button",
              {
                className: "dq-button",
                type: "button",
                onClick: () => O(),
                children: [
                  /* @__PURE__ */ n(Ji, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ d("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(Qi, {}),
              " Import reviews",
              /* @__PURE__ */ n(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: Pe
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((p) => /* @__PURE__ */ d("article", { children: [
            /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ d("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(bi, { entityType: Ee(p) }),
                /* @__PURE__ */ n("strong", { children: p.name })
              ] }),
              /* @__PURE__ */ n("p", { children: p.description || "No description" })
            ] }),
            /* @__PURE__ */ d("button", { type: "button", onClick: () => p.entityType === "tag" || Ee(p) === "video" && p.view.reviewMode === "multiple" ? O(p) : s(p.id), children: [
              /* @__PURE__ */ n(Hn, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => O({
                  ...structuredClone(p),
                  id: crypto.randomUUID(),
                  name: `${p.name} copy`
                }, !0),
                children: "Duplicate"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                "aria-label": `Delete ${p.name}`,
                onClick: () => {
                  window.confirm(`Delete review “${p.name}”?`) && ue(
                    e.filter(($) => $.id !== p.id)
                  );
                },
                children: /* @__PURE__ */ n(ei, {})
              }
            )
          ] }, p.id)) })
        ] }) })
      ] })
    }
  );
}
function Ci({
  workspace: e = !1,
  setup: t = !1,
  draft: r,
  entityTypeLocked: i,
  tagGroups: s,
  saving: c = !1,
  setDraft: o,
  onSave: g,
  onCancel: l
}) {
  const [h, E] = v("Review"), S = Ee(r), T = (M) => {
    if (!(i || M === S)) {
      if (M === "performerOccurrence") {
        o({
          id: r.id,
          entityType: M,
          name: r.name,
          description: r.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end" },
          actions: [],
          occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: !0 }
        });
        return;
      }
      o(
        M === "tag" ? {
          id: r.id,
          entityType: "tag",
          name: r.name,
          description: r.description,
          view: {
            filter: {
              page: 1,
              perPage: 40,
              sort: "name",
              direction: "asc"
            },
            objectFilter: {
              tagGroupsCriterion: { value: [], modifier: "IS_NULL" }
            },
            displayMode: "grid",
            searchMode: "text",
            startFrom: "beginning"
          },
          actions: []
        } : {
          id: r.id,
          entityType: "video",
          name: r.name,
          description: r.description,
          view: {
            filter: {
              page: 1,
              perPage: 40,
              sort: "date",
              direction: "desc"
            },
            objectFilter: {},
            displayMode: "grid",
            searchMode: "text",
            startFrom: "end"
          },
          actions: []
        }
      );
    }
  }, y = P(/* @__PURE__ */ new WeakMap()), q = (M) => {
    let I = y.current.get(M);
    return I || (I = crypto.randomUUID(), y.current.set(M, I)), I;
  };
  return /* @__PURE__ */ d("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      _i,
      {
        tabs: (t ? ["Review"] : e ? ["Review", ...S === "video" ? ["Appearance"] : [], "Actions", ...S === "performerOccurrence" ? ["Tag choices"] : []] : S === "performerOccurrence" ? ["Review", "Queue", "Actions", ...r.occurrence.tagIds.length ? ["Tag choices"] : []] : ["Review", "Queue", "Appearance", "Actions"]).map((M) => ({
          key: M,
          label: M,
          count: M === "Actions" ? r.actions.length : void 0,
          disabled: c
        })),
        activeTab: h,
        onTabChange: E
      }
    ) }),
    /* @__PURE__ */ d("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ d("section", { hidden: h !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ d("label", { children: [
          "Entity type",
          /* @__PURE__ */ d(
            "select",
            {
              "aria-label": "Entity type",
              value: S,
              disabled: i,
              onChange: (M) => T(M.target.value),
              children: [
                /* @__PURE__ */ n("option", { value: "video", children: "Videos" }),
                /* @__PURE__ */ n("option", { value: "tag", children: "Tags" }),
                /* @__PURE__ */ n("option", { value: "performerOccurrence", children: "Performer occurrence tags" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          "Review name",
          /* @__PURE__ */ n(
            "input",
            {
              autoFocus: !0,
              "aria-label": "Review name",
              value: r.name,
              onChange: (M) => o({ ...r, name: M.target.value })
            }
          )
        ] }),
        /* @__PURE__ */ d("label", { children: [
          "Description",
          /* @__PURE__ */ n(
            "textarea",
            {
              "aria-label": "Description",
              value: r.description,
              onChange: (M) => o({ ...r, description: M.target.value })
            }
          )
        ] })
      ] }),
      !e && !t && /* @__PURE__ */ d("section", { hidden: h !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ n(xn, { draft: r, onChange: o, presentation: !1 }),
        r.entityType === "performerOccurrence" && /* @__PURE__ */ n($n, { review: r, onChange: o })
      ] }),
      !t && r.entityType === "performerOccurrence" && /* @__PURE__ */ n("section", { hidden: h !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n($n, { review: r, onChange: o, choices: !0 }) }),
      !t && (!e || S === "video") && /* @__PURE__ */ n("section", { hidden: h !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(xn, { draft: r, onChange: o, queue: !1 }) }),
      !t && /* @__PURE__ */ n("section", { hidden: h !== "Actions", className: "dq-editor-section", children: S === "tag" ? /* @__PURE__ */ n(
        Ho,
        {
          draft: r,
          saving: c,
          tagGroups: s,
          setDraft: o
        }
      ) : /* @__PURE__ */ n(
        Wo,
        {
          draft: r,
          saving: c,
          stepKey: q,
          rememberStepKey: (M, I) => y.current.set(M, q(I)),
          setDraft: o
        }
      ) })
    ] }),
    !e && /* @__PURE__ */ d("div", { className: "dq-editor-footer", children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const M = URL.createObjectURL(
              new Blob([JSON.stringify([r], null, 2)], {
                type: "application/json"
              })
            ), I = document.createElement("a");
            I.href = M, I.download = "data-quality-review.json", I.click(), URL.revokeObjectURL(M);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: l, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: g, children: t ? "Create & configure" : "Save review" })
    ] })
  ] });
}
function Ni({
  action: e,
  onChange: t
}) {
  return /* @__PURE__ */ n("div", { className: "dq-field-grid", children: /* @__PURE__ */ d("label", { children: [
    "Button label",
    /* @__PURE__ */ n(
      "input",
      {
        value: e.label,
        onChange: (r) => t({ ...e, label: r.target.value })
      }
    )
  ] }) });
}
function Wo({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: i,
  setDraft: s
}) {
  const c = (o, g) => s({
    ...e,
    actions: e.actions.map(
      (l, h) => h === o ? g : l
    )
  });
  return /* @__PURE__ */ d(we, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    e.entityType === "performerOccurrence" && /* @__PURE__ */ n("p", { children: "Actions apply only to the active performer in this scene. Set performer matching in the review filters below. Save review keeps those criteria with this rule." }),
    /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      jr,
      {
        items: e.actions,
        getKey: (o) => o.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (o) => s({ ...e, actions: o }),
        renderItem: (o, { index: g, dragHandleProps: l, isOver: h }) => /* @__PURE__ */ d(
          "fieldset",
          {
            className: h ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ d("legend", { children: [
                "Action ",
                g + 1
              ] }),
              /* @__PURE__ */ d("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...l,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${g + 1}`,
                    children: /* @__PURE__ */ n(Zr, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: o.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => s({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, g + 1),
                        {
                          ...structuredClone(o),
                          id: crypto.randomUUID(),
                          label: o.label + " copy"
                        },
                        ...e.actions.slice(g + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                Ni,
                {
                  action: o,
                  onChange: (E) => c(g, E)
                }
              ),
              /* @__PURE__ */ n(
                jr,
                {
                  items: o.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (E) => c(g, { ...o, steps: E }),
                  renderItem: (E, S) => /* @__PURE__ */ n(
                    Xo,
                    {
                      occurrence: e.entityType === "performerOccurrence",
                      dragHandleProps: S.dragHandleProps,
                      saving: t,
                      isOver: S.isOver,
                      step: E,
                      index: S.index,
                      onChange: (T) => {
                        i(T, E), c(g, {
                          ...o,
                          steps: o.steps.map(
                            (y, q) => q === S.index ? T : y
                          )
                        });
                      },
                      onRemove: () => c(g, {
                        ...o,
                        steps: o.steps.filter(
                          (T, y) => y !== S.index
                        )
                      })
                    }
                  )
                }
              ),
              /* @__PURE__ */ d("div", { className: "dq-row", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    className: "dq-button",
                    type: "button",
                    onClick: () => c(g, {
                      ...o,
                      steps: [...o.steps, { mode: "ADD", tagIds: [] }]
                    }),
                    children: "Add step"
                  }
                ),
                /* @__PURE__ */ n(
                  "button",
                  {
                    className: "dq-button",
                    type: "button",
                    onClick: () => s({
                      ...e,
                      actions: e.actions.filter(
                        (E, S) => S !== g
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
        onClick: () => s({
          ...e,
          actions: [
            ...e.actions,
            { id: crypto.randomUUID(), label: "", steps: [] }
          ]
        }),
        children: "Add action"
      }
    )
  ] });
}
function Ho({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: i
}) {
  const s = (c, o) => i({
    ...e,
    actions: e.actions.map(
      (g, l) => l === c ? o : g
    )
  });
  return /* @__PURE__ */ d(we, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      jr,
      {
        items: e.actions,
        getKey: (c) => c.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (c) => i({ ...e, actions: c }),
        renderItem: (c, { index: o, dragHandleProps: g, isOver: l }) => /* @__PURE__ */ d(
          "fieldset",
          {
            className: l ? "dq-action-card dq-drag-over" : "dq-action-card",
            children: [
              /* @__PURE__ */ d("legend", { children: [
                "Action ",
                o + 1
              ] }),
              /* @__PURE__ */ d("div", { className: "dq-action-heading", children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    ...g,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${o + 1}`,
                    children: /* @__PURE__ */ n(Zr, {})
                  }
                ),
                /* @__PURE__ */ n("strong", { children: c.label || "New action" }),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: () => i({
                      ...e,
                      actions: [
                        ...e.actions.slice(0, o + 1),
                        {
                          ...structuredClone(c),
                          id: crypto.randomUUID(),
                          label: c.label + " copy"
                        },
                        ...e.actions.slice(o + 1)
                      ]
                    }),
                    children: "Duplicate action"
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                Ni,
                {
                  action: c,
                  onChange: (h) => s(o, h)
                }
              ),
              /* @__PURE__ */ d("label", { children: [
                "Action effect",
                /* @__PURE__ */ d(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: c.effect.mode === "SET_TAG_GROUP" ? `group:${c.effect.tagGroupId}` : c.effect.mode,
                    onChange: (h) => {
                      const E = h.target.value;
                      s(o, {
                        ...c,
                        effect: E === "SKIP" ? { mode: "SKIP" } : E === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : {
                          mode: "SET_TAG_GROUP",
                          tagGroupId: Number(E.slice(6))
                        }
                      });
                    },
                    children: [
                      /* @__PURE__ */ n("option", { value: "SKIP", children: "Skip" }),
                      /* @__PURE__ */ n("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
                      c.effect.mode === "SET_TAG_GROUP" && !r.some(
                        (h) => h.id === c.effect.tagGroupId
                      ) && /* @__PURE__ */ n(
                        "option",
                        {
                          value: `group:${c.effect.tagGroupId}`,
                          disabled: !0,
                          children: "Unavailable tag group"
                        }
                      ),
                      r.map((h) => /* @__PURE__ */ n("option", { value: `group:${h.id}`, children: h.name }, h.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ n(
                "button",
                {
                  className: "dq-button",
                  type: "button",
                  onClick: () => i({
                    ...e,
                    actions: e.actions.filter(
                      (h, E) => E !== o
                    )
                  }),
                  children: "Remove action"
                }
              )
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
            {
              id: crypto.randomUUID(),
              label: "",
              effect: { mode: "SKIP" }
            }
          ]
        }),
        children: "Add action"
      }
    )
  ] });
}
function Xo({
  occurrence: e = !1,
  step: t,
  index: r,
  dragHandleProps: i,
  saving: s,
  isOver: c,
  onChange: o,
  onRemove: g
}) {
  const l = Si(t.mode);
  return /* @__PURE__ */ d(
    "div",
    {
      className: c ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": l,
      children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            ...i,
            disabled: s,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${r + 1}`,
            children: /* @__PURE__ */ n(Zr, {})
          }
        ),
        /* @__PURE__ */ d("span", { children: [
          "Step ",
          r + 1
        ] }),
        /* @__PURE__ */ d(
          "select",
          {
            "aria-label": "Tag operation",
            value: t.mode,
            onChange: (h) => o({ ...t, mode: h.target.value }),
            children: [
              /* @__PURE__ */ n("option", { value: "ADD", children: "Add tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE", children: "Remove tags" }),
              /* @__PURE__ */ n("option", { value: "REMOVE_TREE", children: "Remove tags and descendants" }),
              !e && /* @__PURE__ */ d(we, { children: [
                /* @__PURE__ */ n("option", { value: "MARK_PRESENT", children: "Mark present" }),
                /* @__PURE__ */ n("option", { value: "MARK_ABSENT", children: "Mark absent" }),
                /* @__PURE__ */ n("option", { value: "CLEAR_ABSENCE", children: "Clear absence" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ n("div", { className: "dq-step-tags", children: /* @__PURE__ */ n(
          ht,
          {
            entityType: "tag",
            values: t.tagIds,
            onChange: (h) => o({ ...t, tagIds: h }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: g, children: /* @__PURE__ */ n(ei, {}) })
      ]
    }
  );
}
async function Yo() {
  const e = await z("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
  let i = r ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (r)
    try {
      const o = JSON.parse(r);
      Array.isArray(o.reviews) && (i = JSON.stringify(o.reviews, null, 2));
    } catch {
    }
  const s = URL.createObjectURL(
    new Blob([i], { type: "application/json" })
  ), c = document.createElement("a");
  c.href = s, c.download = "data-quality-browser-recovery.json", c.click(), URL.revokeObjectURL(s);
}
function _n({ label: e }) {
  return /* @__PURE__ */ d("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(Yn, { className: "dq-spin" }),
    e
  ] });
}
function Un({
  message: e,
  onRetry: t,
  retryLabel: r = "Retry"
}) {
  return /* @__PURE__ */ d("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(_r, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: r })
  ] });
}
const ia = { components: { DataQualityPage: Uo } };
export {
  Uo as DataQualityPage,
  ia as default,
  ar as objectFiltersEqual
};
