import { jsxs as d, Fragment as Ae, jsx as n } from "react/jsx-runtime";
import { useState as S, useRef as O, useEffect as Q, useCallback as Tt, useMemo as jt, useLayoutEffect as li } from "react";
import { DetailListToolbar as mr, AUDIO_CRITERIA as mn, VIDEO_CRITERIA as Lr, PERFORMER_CRITERIA as en, NarrativeText as go, AUDIO_SORT_OPTIONS as di, VIDEO_SORT_OPTIONS as bn, EntityReferenceMultiSelector as yt, FilterDialog as ui, DetailListPagination as fi, AudioPlayer as ho, VideoPlayer as pi, useCustomFieldFilterSection as mo, TAG_SORT_OPTIONS as gi, TAG_CRITERIA as hi, EntityDetailTabs as bo, TagTile as yo, VideoCard as wo, SortableList as tn } from "@cove/runtime/components";
import { Save as yn, RotateCcw as mi, ChevronLeft as bi, Pencil as yi, Settings as vo, AlertTriangle as rn, ChevronRight as wi, Film as nn, Loader2 as vi, Tags as So, Headphones as Co, ExternalLink as Eo, X as Si, Plus as No, Upload as Ao, Trash2 as Ci, GripVertical as wn } from "@cove/runtime/lucide-react";
import { extensionFetch as qo } from "@cove/runtime/api";
const Ro = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function ge(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function pr(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function be(e) {
  return pr(Ce(e));
}
function Ei(e) {
  return Ce(e) === "video";
}
function Ce(e) {
  return e.entityType ?? "video";
}
function kt(e, t) {
  return "qwertyuiop"[t] ?? "";
}
function Mr(e) {
  return ge(e) && !Ai(e.occurrence) ? "Complete the optional occurrence condition before saving." : !Ei(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Ce(e) !== "tag" && e.actions.some(
    (t) => Ni(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => Kt(t, Ce(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const To = {
  video: 1e3,
  audio: 250
};
function $e(e, t = "video") {
  const r = (i, s) => Number.isFinite(Number(i)) && Number(i) > 0 ? Math.floor(Number(i)) : s;
  return {
    ...e,
    page: Math.max(1, r(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(To[t], r(e.perPage, 40))
    )
  };
}
function Vn(e, t, r) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(r, e.length - 1))] ?? null;
}
function lt(e) {
  const { page: t, ...r } = e.view.filter, i = [
    r,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    ge(e) ? [e.entityType, ...i, e.occurrence] : Ce(e) === "video" ? i : [Ce(e), ...i]
  );
}
function Kt(e, t) {
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
  ) && !Ni(e) : !1;
}
function ko(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function Ut(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function vt(e) {
  return "steps" in e ? e.steps.some((t) => Ut(t.mode)) : !1;
}
function Ni(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.steps)
    if (Ut(r.mode))
      for (const i of r.tagIds) {
        const s = t.get(i);
        if (s && s !== r.mode) return !0;
        t.set(i, r.mode);
      }
  return !1;
}
function wr(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (r) => r && typeof r == "object" && typeof r.id == "string" && typeof r.name == "string" && typeof r.description == "string" && (r.entityType === void 0 || Ro.includes(r.entityType)) && (!ko(r.entityType) || Ai(r.occurrence)) && r.view && typeof r.view == "object" && (r.entityType === "tag" ? ["grid", "list"].includes(r.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      r.view.displayMode
    )) && typeof r.view.searchMode == "string" && (r.view.startFrom === void 0 || ["beginning", "end"].includes(r.view.startFrom)) && (r.view.reviewMode === void 0 || ["single", "multiple"].includes(r.view.reviewMode)) && (r.view.reviewMode !== "multiple" || (r.entityType ?? "video") === "video") && (r.view.selectAllOnLoad === void 0 || typeof r.view.selectAllOnLoad == "boolean") && r.view.filter && typeof r.view.filter == "object" && !Array.isArray(r.view.filter) && r.view.objectFilter && typeof r.view.objectFilter == "object" && !Array.isArray(r.view.objectFilter) && Io(
      r.presentation,
      (r.entityType ?? "video") !== "video"
    ) && (r.importNotes === void 0 || Array.isArray(r.importNotes) && r.importNotes.every(
      (i) => typeof i == "string"
    )) && Array.isArray(r.actions) && r.actions.every(
      (i) => typeof (i == null ? void 0 : i.id) == "string" && typeof i.label == "string" && (i.shortcut === void 0 || typeof i.shortcut == "string") && (r.entityType === "tag" ? "effect" in i && !("steps" in i) && Kt(i, "tag") : "steps" in i && !("effect" in i) && Array.isArray(i.steps) && i.steps.every(
        (s) => s && Array.isArray(s.tagIds)
      ) && Kt(i, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((r) => Mr(r)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((r) => r.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Io(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const r = e;
  return (r.cardSize === void 0 || r.cardSize === null || Number.isFinite(r.cardSize) && r.cardSize >= 115 && r.cardSize <= 380) && (!t || r.annotations === void 0 && r.annotationParents === void 0 && r.binParents === void 0) && (r.annotations === void 0 || Array.isArray(r.annotations) && r.annotations.every(
    (i) => ["date", "studio", "performers", "tags"].includes(i)
  )) && [r.annotationParents, r.binParents].every(
    (i) => i === void 0 || Array.isArray(i) && i.every((s) => Number.isSafeInteger(s) && s > 0)
  );
}
function on(...e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const i of e)
    for (const s of i)
      r.has(s.id) || (r.add(s.id), t.push(s));
  return t;
}
function Ai(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, r = (i) => Array.isArray(i) && i.every((s) => Number.isSafeInteger(s) && s > 0) && new Set(i).size === i.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && r(t.performerIds) && (t.targetMode !== "selected" || t.performerIds.length > 0) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && ["any", "includes", "includesAll", "excludes", "isNull"].includes(t.condition) && r(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && r(t.tagIds) && typeof t.multiple == "boolean";
}
function Gn(e, t) {
  return e.size > 0 ? [...e].sort((r, i) => r - i) : t == null ? [] : [t];
}
function Jn(e, t, r, i) {
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
function Qn(e, t) {
  const r = new Set(e), i = t.length > 0 && t.every((s) => r.has(s));
  for (const s of t)
    i ? r.delete(s) : r.add(s);
  return r;
}
function qi(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function Oo(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-actions, .dq-pagination-row, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Mo(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Po(e, t) {
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
const Ri = "ext:com.midnightrider.data-quality:configuration", $o = "ext:cove-data-quality:video-reviews", an = "ext:com.midnightrider.data-quality:progress", vr = /* @__PURE__ */ new Map(), Ir = /* @__PURE__ */ new Map(), Dt = (e, t) => e.includes("*") || e.includes(t), Pr = (e) => Y(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Fo = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function sn(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Xt(e) {
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
    reviews: wr(JSON.stringify(t.reviews)),
    deletedIds: sn(t.deletedIds),
    importedIds: sn(t.importedIds)
  };
}
function xo(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let r;
  const i = /* @__PURE__ */ new Set();
  for (const s of t) {
    const c = localStorage.getItem(s);
    if (c !== null) {
      const o = wr(c);
      r ?? (r = o), o.forEach((g) => i.add(g.id));
    }
    sn(
      JSON.parse(localStorage.getItem(`${s}:account-imports`) ?? "[]")
    ).forEach((o) => i.add(o));
  }
  return {
    reviews: r ?? [],
    known: [...i],
    present: r !== void 0
  };
}
async function Ti(e) {
  const t = await Y("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function ki(e, t) {
  const r = (Ir.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Ir.set(e, r), r.finally(() => {
    Ir.get(e) === r && Ir.delete(e);
  }).catch(() => {
  }), r;
}
let fr = null;
function Lo() {
  if (fr) return fr;
  const e = _o();
  return fr = e, e.finally(() => {
    fr === e && (fr = null);
  }).catch(() => {
  }), e;
}
async function _o() {
  var A;
  const e = await Y("/api/auth/me"), t = String(e.user.id), r = `cove-data-quality-v2:${t}`, i = Dt(e.permissions, "savedfilters.read"), s = i && Dt(e.permissions, "savedfilters.write"), c = i ? (await Pr(Ri)).filter((R) => R.name === "Data Quality configuration").sort((R, N) => R.id - N.id) : [];
  if (c.length > 1) {
    const R = (N) => {
      const { revision: W, ...b } = Xt(N.uiOptions);
      return JSON.stringify(b);
    };
    if (c.some((N) => R(N) !== R(c[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (s)
      for (const N of c.slice(1))
        await Y(`/api/savedfilters/${N.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${N.id}` })
        });
    c.splice(1);
  }
  let o = c.length ? Xt(c[0].uiOptions) : Fo();
  const g = localStorage.getItem(`${r}:migrated`) === "true", u = localStorage.getItem(r), f = localStorage.getItem(`${r}:local-only`) === "true";
  !c.length && u && (o = Xt(u));
  let w = !c.length;
  if (c.length && f && u) {
    const R = Xt(u);
    if (R.reviews.some((W) => {
      const b = o.reviews.find((P) => P.id === W.id);
      return b && JSON.stringify(b) !== JSON.stringify(W);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const N = [
      .../* @__PURE__ */ new Set([...o.deletedIds, ...R.deletedIds])
    ];
    o = {
      ...o,
      reviews: on(o.reviews, R.reviews).filter(
        (W) => !N.includes(W.id)
      ),
      deletedIds: N,
      importedIds: [
        .../* @__PURE__ */ new Set([...o.importedIds, ...R.importedIds])
      ]
    }, w = !0;
  }
  if (!g) {
    const R = JSON.stringify(o), N = xo(t);
    if (c.length && N.reviews.some((x) => {
      const Z = o.reviews.find((qe) => qe.id === x.id);
      return Z && JSON.stringify(Z) !== JSON.stringify(x);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const W = i ? (await Pr($o)).flatMap(
      (x) => wr(x.uiOptions ?? "[]")
    ) : [], b = N.known.filter(
      (x) => !N.reviews.some((Z) => Z.id === x)
    ), P = /* @__PURE__ */ new Set([...o.deletedIds, ...b]);
    o = {
      ...o,
      reviews: on(
        N.reviews,
        o.reviews,
        W.filter(
          (x) => !N.known.includes(x.id) && !o.importedIds.includes(x.id)
        )
      ).filter((x) => !P.has(x.id)),
      deletedIds: [...P],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...o.importedIds,
          ...N.known,
          ...W.map((x) => x.id)
        ])
      ]
    }, w || (w = JSON.stringify(o) !== R);
  }
  const E = {
    userId: t,
    recordId: (A = c[0]) == null ? void 0 : A.id,
    config: o,
    readable: i,
    writable: s,
    durable: s
  };
  if (vr.set(r, E), w && s) {
    const R = o;
    c.length && (E.config = Xt(c[0].uiOptions)), await Ii(r, R), o = E.config;
  } else c.length || (localStorage.setItem(r, JSON.stringify(o)), !i && (!g || f) && localStorage.setItem(`${r}:local-only`, "true"));
  if (!i) localStorage.setItem(`${r}:migrated`, "true");
  else if (s)
    try {
      localStorage.setItem(`${r}:migrated`, "true");
    } catch {
    }
  return {
    reviews: o.reviews,
    storageKey: r,
    canWrite: Dt(e.permissions, "videos.write"),
    canWriteVideos: Dt(e.permissions, "videos.write"),
    canWriteAudios: Dt(e.permissions, "audios.write"),
    canWriteTags: Dt(e.permissions, "tags.write"),
    canReadTagGroups: Dt(e.permissions, "taggroups.read"),
    canConfigure: !i || s,
    storageNotice: i ? s ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Ii(e, t) {
  const r = vr.get(e);
  if (!r) throw new Error("Reload reviews before saving.");
  if (r.readable && !r.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const i = { ...t, revision: crypto.randomUUID() };
  if (r.durable) {
    if (await Ti(r), r.recordId != null) {
      const c = await Y(
        `/api/savedfilters/${r.recordId}`
      );
      if (Xt(c.uiOptions).revision !== r.config.revision)
        throw new Error(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const s = await Y(
      r.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${r.recordId}`,
      {
        method: r.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Ri,
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
function Do(e, t) {
  return wr(JSON.stringify(t)), ki(e, async () => {
    const r = vr.get(e);
    if (!r) throw new Error("Reload reviews before saving.");
    const i = r.config.reviews.filter((s) => !t.some((c) => c.id === s.id)).map((s) => s.id);
    await Ii(e, {
      ...r.config,
      reviews: t,
      deletedIds: [
        .../* @__PURE__ */ new Set([...r.config.deletedIds, ...i])
      ].filter((s) => !t.some((c) => c.id === s))
    });
  });
}
function Wn(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([r, i]) => /^[1-9]\d*:[1-9]\d*$/.test(r) && ["reviewed", "cannotDetermine"].includes(String(i)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function jo(e, t) {
  const r = vr.get(e);
  if (!r) return null;
  const i = localStorage.getItem(`${e}:progress:${t}`), s = i ? Wn(i) : null;
  if (!r.readable) return s;
  const c = (await Pr(an)).find(
    (g) => g.name === t
  ), o = c ? Wn(c.uiOptions) : null;
  return s && (!o || s.updatedAt > o.updatedAt) ? s : o;
}
function Uo(e, t, r) {
  const i = `${e}:progress:${t}`;
  try {
    localStorage.setItem(i, JSON.stringify(r));
  } catch {
  }
  return ki(i, async () => {
    const s = vr.get(e);
    if (!(s != null && s.writable)) return;
    await Ti(s);
    const c = (await Pr(an)).find(
      (o) => o.name === t
    );
    await Y(
      c ? `/api/savedfilters/${c.id}` : "/api/savedfilters",
      {
        method: c ? "PUT" : "POST",
        body: JSON.stringify({
          mode: an,
          name: t,
          uiOptions: JSON.stringify(r)
        })
      }
    );
  });
}
function tr(e) {
  return e === "audio" ? "audios" : "videos";
}
const Ko = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function St(e) {
  return Ko[e];
}
const $r = "confirmed_absent_tags", vn = "Confirmed absent tags", _r = "confirmed_absent_occurrence_tags", Oi = {
  key: $r,
  label: vn,
  type: "tag",
  subject: "tag assessments"
}, Sn = {
  key: _r,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, Bo = {
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
function er(e) {
  return Array.isArray(e) ? e.map(er) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, r]) => [
      t,
      t === "modifier" && typeof r == "string" ? Bo[r] ?? r : t === "key" && typeof r == "string" && [
        $r,
        _r
      ].includes(r.toLowerCase()) ? r.toLowerCase() : er(r)
    ])
  ) : e;
}
async function Y(e, t = {}) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await qo(e, { ...t, headers: r });
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
const Vo = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Go = 0;
function cn(e, t) {
  return Y(
    `/api/${tr(e)}/${t}?dqRead=${Vo}-${++Go}`,
    { cache: "no-store" }
  );
}
async function gr(e, t, r) {
  const i = { ...e.view.objectFilter }, s = i._filterExpression;
  if (delete i._filterExpression, delete i.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  const c = be(e);
  return Y(
    `/api/${tr(c)}/find`,
    {
      method: "POST",
      signal: r,
      body: JSON.stringify(
        er({
          findFilter: $e(t, c),
          objectFilter: i,
          filterExpression: s
        })
      )
    }
  );
}
async function zn(e, t, r) {
  const i = { ...e.view.objectFilter };
  return delete i._filterExpression, Y("/api/tags/find", {
    method: "POST",
    signal: r,
    body: JSON.stringify(
      er({
        findFilter: $e(t),
        objectFilter: i
      })
    )
  });
}
function Jo(e) {
  return Y("/api/taggroups", { signal: e });
}
function Hn(e, t) {
  return `/api/${tr(e)}/${t.id}/image?max=1280&v=${encodeURIComponent(t.updatedAt)}`;
}
function ln(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Yn(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Qo(e) {
  return `/api/stream/video/${e}/preview`;
}
function Wo(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function zo(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Sr(e, t) {
  const r = /* @__PURE__ */ new Set();
  for (const i of e) {
    await Y(`/api/tags/${i}`, { signal: t }), r.add(i);
    for (let s = 1; ; s++) {
      const c = await Y("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          er({
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
function Ho(e, t) {
  const r = [];
  return t.type !== e.type && r.push(`type "${e.type}"`), t.isMultiValue || r.push("multiple values enabled"), t.filterable || r.push("filtering enabled"), r.length ? `The ${e.key} custom field is incompatible. It must have ${r.join(", ")}.` : "";
}
async function Cn(e, t) {
  const i = (await Y("/api/custom-fields")).find(
    (c) => c.key.toLowerCase() === e.key
  );
  if (!i)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const s = Ho(e, i);
  return s ? { kind: "incompatible", message: s } : i.entityTypes.includes(t) ? { kind: "ready", definition: i, message: "" } : {
    kind: "missing",
    message: `Add ${St(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: i
  };
}
async function Mi(e, t) {
  const r = await Cn(e, t);
  if (r.kind !== "ready") {
    if (r.kind === "incompatible") throw new Error(r.message);
    if (r.definition) {
      await Y(`/api/custom-fields/${r.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...r.definition.entityTypes, t])]
        })
      });
      return;
    }
    await Y("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: e.key,
        label: e.label,
        type: e.type,
        entityTypes: [t],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function Pi(e = "video") {
  return Cn(Oi, e);
}
function Yo(e = "video") {
  return Mi(Oi, e);
}
function $i(e = "video") {
  return Cn(Sn, e);
}
function Xo(e = "video") {
  return Mi(Sn, e);
}
function Fr(e) {
  return [...new Set(e)];
}
function Fi(e, t) {
  const r = e.customFields ?? {}, i = Object.keys(r).find(
    (c) => c.toLowerCase() === _r
  ), s = i === void 0 ? [] : r[i];
  return Fr(
    (Array.isArray(s) ? s : []).filter(
      (c) => typeof c == "string" && /^[1-9]\d*:[1-9]\d*$/.test(c)
    ).map((c) => c.split(":").map(Number)).filter(([c]) => c === t).map(([, c]) => c)
  );
}
async function Zo(e) {
  let t;
  try {
    t = await $i(e);
  } catch (r) {
    throw new Error(
      `Could not verify the ${Sn.label} custom field. ${r instanceof Error ? r.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function ea(e, t, r, i, s, c) {
  await Y(`/api/${tr(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [r],
      customFields: {
        [e]: Fr(s).map((o) => `${i}:${o}`)
      },
      customFieldMode: c
    })
  });
}
function ta(e, t, r) {
  const i = [...e.tagIds], s = (c) => {
    if (r === null)
      throw new Error(
        `The ${vn} custom field is not available.`
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
async function xi(e, t, r) {
  if (!Kt(t) || r.length === 0 || r.some((u) => !Number.isSafeInteger(u) || u <= 0))
    throw new Error(
      `Choose ${St(e).many} and configure a valid action first.`
    );
  let i = null;
  if (vt(t)) {
    let u;
    try {
      u = await Pi(e);
    } catch (f) {
      throw new Error(
        `Could not verify the ${vn} custom field. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
    if (u.kind !== "ready") throw new Error(u.message);
    i = u.definition.key;
  }
  const s = Fr(r), c = await Promise.all(
    t.steps.map(async (u) => ({
      mode: u.mode,
      tagIds: u.mode === "REMOVE_TREE" ? await Sr(u.tagIds) : Fr(u.tagIds)
    }))
  ), g = [
    ...c.filter((u) => !Ut(u.mode)),
    ...c.filter((u) => Ut(u.mode))
  ].map(
    (u) => ta(u, s, i)
  );
  for (let u = 0; u < g.length; u++)
    try {
      await Y(`/api/${tr(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(g[u])
      });
    } catch (f) {
      throw new Error(
        `Step ${u + 1} failed; ${u} earlier step(s) completed. Refresh and check the selected ${St(e).many} before retrying. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
}
async function ra(e, t) {
  if (!Kt(e, "tag") || t.length === 0 || t.some((r) => !Number.isSafeInteger(r) || r <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await Y("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
function xr(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function En(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Nn(e) {
  return !!String(e ?? "").trim();
}
function An(e) {
  return [
    ...new Set(
      xr(e.customFieldCriteria).filter(En).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Nn(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function qn(e, t) {
  const r = xr(e.customFieldCriteria);
  if (!r.length) return e;
  let i = !1;
  const s = r.map((c) => {
    if (!En(c)) return c;
    const o = { ...c };
    for (const [g, u] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(c[g] ?? "")];
      f && !Nn(c[u]) && (o[u] = f, i = !0);
    }
    return o;
  });
  return i ? { ...e, customFieldCriteria: s } : e;
}
function Li(e, t, r) {
  const i = xr(e.customFieldCriteria);
  if (!i.length) return e;
  const s = xr(r.customFieldCriteria), c = (u, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (w) => (u[w] ?? void 0) === (f[w] ?? void 0)
  );
  let o = !1;
  const g = i.map((u) => {
    if (!En(u)) return u;
    const f = s.find((E) => c(E, u));
    if (!f) return u;
    const w = { ...u };
    for (const [E, A] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const R = t[String(u[E] ?? "")];
      R && u[A] === R && !Nn(f[A]) && (delete w[A], o = !0);
    }
    return w;
  });
  return o ? { ...e, customFieldCriteria: g } : e;
}
async function na(e, t, r) {
  if (!Kt(r))
    throw new Error("Configure an occurrence tag action first.");
  if (!r.steps.length) return t.applications;
  const i = be(e), s = r.steps.some((g) => Ut(g.mode)) ? await Zo(i) : "", c = await Promise.all(
    r.steps.map(async (g) => ({
      ...g,
      tagIds: g.mode === "REMOVE_TREE" ? await Sr(g.tagIds) : g.tagIds
    }))
  );
  let o = t.applications;
  for (const g of [
    ...c.filter((u) => !Ut(u.mode)),
    ...c.filter((u) => Ut(u.mode))
  ]) {
    const u = (f) => ea(
      s,
      i,
      t.media.id,
      t.performer.id,
      g.tagIds,
      f
    );
    (g.mode === "MARK_PRESENT" || g.mode === "CLEAR_ABSENCE") && await u("REMOVE"), g.mode !== "CLEAR_ABSENCE" && (o = await Ui(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: g.tagIds,
          multiple: !0
        }
      },
      t,
      ["ADD", "MARK_PRESENT"].includes(g.mode) ? g.tagIds : []
    )), g.mode === "MARK_ABSENT" && await u("ADD");
  }
  return o;
}
async function Rn(e, t) {
  const r = e.occurrence;
  if (r.targetMode === "all" || r.targetMode === "filter" && Object.keys(r.performerFilter).length === 0) return null;
  if (r.targetMode === "selected") return r.performerIds;
  const i = /* @__PURE__ */ new Set(), { _filterExpression: s, ...c } = r.performerFilter;
  for (let o = 1; ; o++) {
    const g = await Y("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        er({
          findFilter: { page: o, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: c,
          filterExpression: s
        })
      )
    });
    if (g.items.forEach((u) => i.add(u.id)), o * 1e3 >= g.totalCount) return [...i];
    if (!g.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function _i(e) {
  return e.condition === "excludes" && e.hideConfirmedAbsent !== !1;
}
function Di(e, t) {
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
  }, o = _i(s) && (t == null ? void 0 : t.length) === 1 && s.conditionTagIds.length === 1 ? `${t[0]}:${s.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: be(e),
    actions: [],
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...r ? [{ group: r }] : [],
            { filter: i },
            { filter: { performerFilterCriterion: c } },
            ...o ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: _r,
                      type: "text",
                      modifier: "notEquals",
                      value: o
                    }
                  ]
                }
              }
            ] : []
          ]
        }
      }
    }
  };
}
function ia(e, t, r = e.conditionTagIds.map((i) => [i])) {
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
function oa(e, t, r) {
  if (!_i(e)) return !1;
  const i = Fi(t, r);
  return e.conditionTagIds.every((s) => i.includes(s));
}
async function ji(e, t, r, i) {
  if ((t == null ? void 0 : t.length) === 0)
    return { items: [], totalCount: 0 };
  const s = be(e), c = await gr(
    Di(e, t),
    { ...e.view.filter, page: r },
    i
  ), o = t === null ? null : new Set(t), g = e.occurrence, u = c.items.length && g.includeSubtags !== !1 && !["any", "isNull"].includes(g.condition) ? await Promise.all(g.conditionTagIds.map((E) => Sr([E], i))) : g.conditionTagIds.map((E) => [E]), f = new Array(c.items.length);
  let w = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, c.items.length) }, async () => {
      for (; w < c.items.length; ) {
        const E = w++, A = c.items[E], R = await Y(
          `/api/tagapplications?hostType=${s}&hostId=${A.id}&contextType=performer`,
          { signal: i }
        );
        f[E] = A.performers.filter((N) => o === null || o.has(N.id)).flatMap((N) => {
          const W = R.filter(
            (b) => b.hostType === s && b.hostId === A.id && b.contextType === "performer" && b.contextId === N.id
          );
          return ia(
            e.occurrence,
            W.map((b) => b.tag.id),
            u
          ) && !oa(g, A, N.id) ? [
            {
              key: `${A.id}:${N.id}`,
              media: A,
              performer: N,
              applications: W
            }
          ] : [];
        });
      }
    })
  ), { items: f.flat(), totalCount: c.totalCount };
}
async function Ui(e, t, r) {
  const i = new Set(e.occurrence.tagIds);
  if (r.some((f) => !i.has(f)) || !e.occurrence.multiple && r.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const s = be(e), c = await cn(s, t.media.id);
  if (!c.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${s}. Refresh the queue.`
    );
  const o = `/api/tagapplications?hostType=${s}&hostId=${c.id}&contextType=performer&contextId=${t.performer.id}`, g = (await Y(o)).filter(
    (f) => f.hostType === s && f.hostId === c.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), u = new Set(r);
  try {
    for (const f of u)
      g.some((w) => w.tag.id === f) || await Y("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: s,
          hostId: c.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: f,
          sourceKey: "user"
        })
      });
    for (const f of g)
      i.has(f.tag.id) && !u.has(f.tag.id) && await Y(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await Y(o);
  } catch (f) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${f instanceof Error ? f.message : "Request failed."}`
    );
  }
}
function wt(e, t) {
  return {
    added: t.filter((r) => !e.includes(r)),
    removed: e.filter((r) => !t.includes(r))
  };
}
function aa(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function rt(e, t, r = !0) {
  var g;
  if (t.occurrence) {
    const u = r ? Fi(
      await cn(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await Y(aa(e, t))).filter(
      (w) => w.hostType === e && w.hostId === t.media.id && w.contextType === "performer" && w.contextId === t.occurrence.performer.id
    );
    return {
      ids: [...new Set(f.map((w) => w.tag.id))],
      names: [...new Set(f.map((w) => w.tag.name))],
      absent: u,
      applications: f
    };
  }
  const i = await cn(e, t.media.id), s = (i.tags ?? []).filter(
    (u) => u.canRemove !== !1 || u.isDerived !== !0
  ), c = Object.keys(i.customFields ?? {}).find(
    (u) => u.toLowerCase() === $r
  ) ?? $r, o = ((g = i.customFields) == null ? void 0 : g[c]) ?? [];
  if (!Array.isArray(o) || o.some((u) => !Number.isSafeInteger(u)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${e} before editing.`
    );
  return { ids: s.map((u) => u.id), names: s.map((u) => u.name), absent: o };
}
async function Tn(e, t, r) {
  if (t.occurrence && ge(e))
    await Ui(
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
      s.length && await Y(
        `/api/${tr(be(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: i, tagIds: s })
        }
      );
}
async function sa(e, t, r) {
  t.occurrence && ge(e) ? await na(e, t.occurrence, r) : await xi(be(e), r, [t.media.id]);
}
function dn(e, t, r, i) {
  const s = (c) => c.filter((o) => i.includes(o));
  return {
    item: e,
    before: t,
    after: r,
    tags: wt(s(t.ids), s(r.ids)),
    absence: wt(s(t.absent), s(r.absent))
  };
}
function ca(e, t) {
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
const un = (e) => e instanceof Error ? e.message : "Request failed.", Xn = (e) => [...e].sort((t, r) => t - r), br = (e, t) => JSON.stringify(Xn(e)) === JSON.stringify(Xn(t)), fn = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Ki(e, t) {
  const r = new Set(e);
  for (const i of t.steps)
    for (const s of i.tagIds)
      i.mode === "ADD" ? r.add(s) : r.delete(s);
  return [...r];
}
async function la(e, t, r, i = () => {
}) {
  if (!Kt(t, e.entityType) || !t.steps.length || t.steps.some(
    (f) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(f.mode)
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const s = structuredClone(e), c = structuredClone(t);
  for (const f of c.steps)
    f.mode === "REMOVE_TREE" && (f.tagIds = await Sr(f.tagIds, r), f.mode = "REMOVE");
  r.throwIfAborted();
  const o = [...new Set(c.steps.flatMap((f) => f.tagIds))];
  s.view.filter = {
    ...s.view.filter,
    page: 1,
    perPage: 250,
    sort: "id",
    direction: "asc",
    sorts: void 0
  };
  const g = await Rn(s, r), u = /* @__PURE__ */ new Map();
  for (let f = 1; ; f++) {
    r.throwIfAborted();
    const w = await ji(s, g, f, r);
    for (const E of w.items) {
      const A = {
        ids: [...new Set(E.applications.map((N) => N.tag.id))],
        names: E.applications.map((N) => N.tag.name),
        absent: [],
        applications: E.applications
      }, R = Ki(A.ids, c);
      u.set(E.key, {
        item: { key: E.key, media: E.media, occurrence: E },
        before: A,
        expected: A,
        desired: R,
        conflict: wt(A.ids, R).removed.length > 0,
        status: br(A.ids, R) ? "unchanged" : "pending"
      });
    }
    if (i(u.size), f * 250 >= w.totalCount) break;
    if (f > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return r.throwIfAborted(), { review: s, action: c, touched: o, entries: [...u.values()] };
}
function da(e, t, r) {
  const i = (c) => c.ids.filter((o) => r.includes(o));
  if (!br(i(e), i(t))) return !1;
  const s = (c) => (c.applications ?? []).filter((o) => r.includes(o.tag.id)).map((o) => o.id);
  return br(s(e), s(t));
}
async function Bi(e, t, r, i) {
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
async function ua(e, t, r, i, s = !1) {
  const c = e.entries.filter(
    (o) => s ? o.status === "failed" : o.status === "pending"
  );
  await Bi(
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
        if (g = await rt(be(e.review), o.item, !1), !da(o.expected, g, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (A) {
        o.status = "failed", o.error = un(A);
        return;
      }
      const u = Ki(g.ids, e.action), f = wt(g.ids, u);
      let w;
      try {
        await Tn(e.review, o.item, f);
      } catch (A) {
        w = A;
      }
      let E = !1;
      try {
        const A = await rt(be(e.review), o.item, !1);
        E = !0, o.expected = A;
        const R = dn(
          o.item,
          o.before,
          A,
          e.touched
        );
        if (o.operation = fn(R) ? R : void 0, w) throw w;
        if (!br(
          A.ids.filter((N) => e.touched.includes(N)),
          u.filter((N) => e.touched.includes(N))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (A) {
        if (o.status = "failed", o.error = un(A), !E)
          try {
            const R = await rt(be(e.review), o.item, !1);
            o.expected = R;
            const N = dn(
              o.item,
              o.before,
              R,
              e.touched
            );
            o.operation = fn(N) ? N : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    i
  );
}
async function fa(e, t, r) {
  await Bi(
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
        const g = await rt(be(e.review), i.item, !1);
        ca(s, g), o = !0, await Tn(e.review, i.item, {
          added: s.tags.removed,
          removed: s.tags.added
        });
        const u = await rt(be(e.review), i.item, !1);
        if (!br(
          u.ids.filter((f) => c.includes(f)),
          i.before.ids.filter((f) => c.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        i.operation = void 0, i.expected = u, i.status = "unchanged", i.error = void 0;
      } catch (g) {
        if (i.error = `Undo stopped: ${un(g)}`, i.status = "failed", o)
          try {
            const u = await rt(be(e.review), i.item, !1), f = dn(
              i.item,
              i.before,
              u,
              c
            );
            i.operation = fn(f) ? f : void 0, i.expected = u;
          } catch {
            i.unverified = !0;
          }
      }
    },
    r
  );
}
async function Zn(e, t, r) {
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
            (await Y(`/api/${t}/${o}`, {
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
function pa({
  review: e,
  disabled: t,
  hidden: r = !1,
  onOpen: i,
  onClose: s,
  onWrite: c
}) {
  const [o, g] = S(!1), [u, f] = S(null), [w, E] = S(""), [A, R] = S(!1), [N, W] = S(!1), [b, P] = S(""), [x, Z] = S(""), [qe, Oe] = S({}), [p, $] = S(!1), [I, ee] = S(!1), G = p && u ? u.review : e, le = be(G), te = St(le).queue, Je = le === "audio" ? "Audio" : "Scene", [k, Qe] = S(!1), [ne, nt] = S([]), [Fe, ut] = S(!1), [, It] = S(0), Bt = O(null), je = O(null), Ve = O(!1), ae = O(null), Ge = O(!1), de = O(!1), Ue = O({ onClose: s, onWrite: c });
  Ue.current = { onClose: s, onWrite: c }, Q(() => {
    var y;
    o && ((y = Bt.current) == null || y.showModal());
  }, [o]), Q(() => {
    if (!o || G.occurrence.targetMode !== "selected") return;
    const y = new AbortController();
    return nt([]), Zn(
      G.occurrence.performerIds,
      "performers",
      y.signal
    ).then((U) => {
      y.signal.aborted || nt(U.map(([, F]) => F));
    }).catch(() => {
    }), () => y.abort();
  }, [
    o,
    G.occurrence.targetMode,
    JSON.stringify(G.occurrence.performerIds)
  ]), Q(
    () => () => {
      var y;
      Ve.current = !0, (y = ae.current) == null || y.abort();
    },
    []
  ), Q(() => {
    if (!N) return;
    const y = (U) => {
      U.preventDefault(), U.returnValue = "";
    };
    return window.addEventListener("beforeunload", y), () => window.removeEventListener("beforeunload", y);
  }, [N]);
  function ye() {
    de.current || (g(!1), Ue.current.onClose(Ge.current), Ge.current = !1, requestAnimationFrame(() => {
      var y;
      return (y = je.current) == null ? void 0 : y.focus();
    }));
  }
  async function xe() {
    const y = e.actions.find((U) => U.id === w);
    if (!(!y || de.current)) {
      de.current = !0, W(!0), P(""), Z("Loading all matching occurrences…"), f(null), $(!1), ee(!1), ut(!1), ae.current = new AbortController();
      try {
        const U = await la(
          e,
          y,
          ae.current.signal,
          (it) => Z(`Loaded ${it.toLocaleString()} matching occurrences…`)
        ), F = await Zn(
          [
            .../* @__PURE__ */ new Set([
              ...U.touched,
              ...U.review.occurrence.conditionTagIds,
              ...An(U.review.view.objectFilter)
            ])
          ],
          "tags",
          ae.current.signal
        );
        ae.current.signal.throwIfAborted(), Oe(Object.fromEntries(F)), f(U), Z("Preview ready. No tags have been changed.");
      } catch (U) {
        P(
          ae.current.signal.aborted ? "Preview cancelled. No tags were changed." : String(U instanceof Error ? U.message : U)
        ), Z("");
      } finally {
        de.current = !1, W(!1), ae.current = null;
      }
    }
  }
  async function Le(y) {
    if (!u || de.current) return;
    de.current = !0, Ve.current = !1, Ge.current = !0, Ue.current.onWrite(), W(!0), $(!0), P(""), y === "undo" && ee(!0), Z(y === "undo" ? "Undoing batch…" : "Applying batch…");
    const U = () => It((F) => F + 1);
    try {
      y === "undo" ? await fa(u, () => Ve.current, U) : await ua(
        u,
        A,
        () => Ve.current,
        U,
        y === "retry"
      ), Z(
        Ve.current ? "Stopped after in-flight operations settled. Completed changes are retained." : y === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (F) {
      P(F instanceof Error ? F.message : String(F));
    } finally {
      de.current = !1, W(!1), U();
    }
  }
  const Ie = (u == null ? void 0 : u.entries) ?? [], z = Ie.filter((y) => y.conflict), we = (y) => Ie.filter((U) => U.status === y).length, L = p && u ? [u.action] : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((y) => y.steps.length && !vt(y))
  ), C = Ie.some((y) => y.operation), j = (y) => y.map((U) => qe[U] ?? `Tag ${U}`).join(", ") || "None";
  return /* @__PURE__ */ d(Ae, { children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-button",
        hidden: r,
        ref: je,
        disabled: t || !L.length,
        onClick: () => {
          var y;
          p || (f(null), Z(""), P("")), i(), g(!0), E(
            L.some((U) => U.id === w) ? w : ((y = L[0]) == null ? void 0 : y.id) ?? ""
          );
        },
        children: p ? "Batch results / undo" : "Apply to all matching occurrences"
      }
    ),
    o && /* @__PURE__ */ d(
      "dialog",
      {
        ref: Bt,
        className: "dq-batch-dialog",
        "aria-labelledby": "dq-batch-title",
        "aria-modal": "true",
        onCancel: (y) => {
          y.preventDefault(), ye();
        },
        children: [
          /* @__PURE__ */ n("h2", { id: "dq-batch-title", children: "Batch occurrence approval" }),
          /* @__PURE__ */ n("p", { children: "Apply one answer across all matching pages. Only targeted performer occurrences change." }),
          /* @__PURE__ */ n("p", { children: "Keep this page open while running. Results and undo last until you leave this workspace." }),
          /* @__PURE__ */ d("fieldset", { disabled: N || p, children: [
            /* @__PURE__ */ n("legend", { children: "Batch scope and action" }),
            /* @__PURE__ */ n("p", { children: "Uses your current filters. To include every existing appearance, remove filters that exclude already answered occurrences." }),
            /* @__PURE__ */ d("p", { children: [
              "Performer scope:",
              " ",
              G.occurrence.targetMode === "all" ? "All performers" : G.occurrence.targetMode === "selected" ? ne.join(", ") || `${G.occurrence.performerIds.length} selected performer(s)` : "Matching performer criteria",
              ". Occurrence condition:",
              " ",
              G.occurrence.condition === "any" ? "Any occurrence tags" : {
                includes: "Has any selected tag",
                includesAll: "Has all selected tags",
                excludes: "Has none of the selected tags",
                isNull: "Has no occurrence tags"
              }[G.occurrence.condition],
              "."
            ] }),
            G.occurrence.condition === "excludes" && G.occurrence.hideConfirmedAbsent !== !1 && /* @__PURE__ */ n("p", { children: "Occurrences confirmed absent for every condition tag are hidden and left unchanged." }),
            G.occurrence.conditionTagIds.length > 0 && u && /* @__PURE__ */ d("p", { children: [
              "Condition tags:",
              " ",
              j(G.occurrence.conditionTagIds),
              G.occurrence.includeSubtags === !1 ? " (exact tags only)" : " (including subtags)",
              "."
            ] }),
            /* @__PURE__ */ d("p", { children: [
              "Search: ",
              String(G.view.filter.q || "Any"),
              ".",
              " ",
              Object.keys(G.view.objectFilter).length === 0 && `${te[0].toUpperCase()}${te.slice(1)} filters: None.`
            ] }),
            /* @__PURE__ */ n(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": `Batch ${te} filters`,
                children: /* @__PURE__ */ n(
                  mr,
                  {
                    filter: G.view.filter,
                    objectFilter: qn(
                      G.view.objectFilter,
                      qe
                    ),
                    criteriaDefinitions: le === "audio" ? mn : Lr,
                    customFieldEntityType: le,
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
            G.occurrence.targetMode === "filter" && /* @__PURE__ */ n(
              "fieldset",
              {
                className: "dq-batch-filter-summary",
                disabled: !0,
                "aria-label": "Batch performer criteria",
                children: /* @__PURE__ */ n(
                  mr,
                  {
                    filter: {},
                    objectFilter: G.occurrence.performerFilter,
                    criteriaDefinitions: en,
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
            !L.length && /* @__PURE__ */ n("p", { children: "Configure an occurrence tag action in this review before starting a batch." }),
            /* @__PURE__ */ d("label", { children: [
              "Answer",
              " ",
              /* @__PURE__ */ n(
                "select",
                {
                  "aria-label": "Batch answer",
                  value: w,
                  onChange: (y) => {
                    E(y.target.value), f(null), Z("");
                  },
                  children: L.map((y) => /* @__PURE__ */ n("option", { value: y.id, children: y.label }, y.id))
                }
              )
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: !L.length,
                onClick: () => void xe(),
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
                  value: A ? "replace" : "skip",
                  onChange: (y) => R(y.target.value === "replace"),
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
            x && /* @__PURE__ */ n("p", { role: "status", children: x }),
            b && /* @__PURE__ */ n("p", { role: "alert", children: b }),
            u && /* @__PURE__ */ d(Ae, { children: [
              /* @__PURE__ */ n("p", { children: /* @__PURE__ */ d("strong", { children: [
                Ie.length.toLocaleString(),
                " occurrences in",
                " ",
                new Set(
                  Ie.map((y) => y.item.media.id)
                ).size.toLocaleString(),
                " ",
                te,
                "s"
              ] }) }),
              p ? /* @__PURE__ */ d("p", { children: [
                we("changed"),
                " changed; ",
                we("unchanged"),
                " unchanged;",
                " ",
                we("skipped"),
                " skipped; ",
                we("failed"),
                " failed;",
                " ",
                we("pending"),
                " remaining."
              ] }) : /* @__PURE__ */ d("p", { children: [
                Ie.filter(
                  (y) => y.status === "pending" && (A || !y.conflict)
                ).length.toLocaleString(),
                " ",
                "to change; ",
                we("unchanged").toLocaleString(),
                " already correct; ",
                z.length.toLocaleString(),
                " conflicts (",
                A ? "will replace" : "will skip",
                ")."
              ] })
            ] })
          ] }),
          u && /* @__PURE__ */ d(Ae, { children: [
            !p && /* @__PURE__ */ d("p", { children: [
              "Planned additions:",
              " ",
              j([
                ...new Set(
                  Ie.filter((y) => A || !y.conflict).flatMap(
                    (y) => wt(y.before.ids, y.desired).added
                  )
                )
              ]),
              ". Planned removals:",
              " ",
              j([
                ...new Set(
                  Ie.filter((y) => A || !y.conflict).flatMap(
                    (y) => wt(y.before.ids, y.desired).removed
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
                onClick: () => ut(!Fe),
                children: Fe ? "Hide occurrence details" : "Inspect occurrences and conflicts"
              }
            ),
            Fe && /* @__PURE__ */ n("div", { className: "dq-batch-items", children: /* @__PURE__ */ d("table", { children: [
              /* @__PURE__ */ n("thead", { children: /* @__PURE__ */ d("tr", { children: [
                /* @__PURE__ */ n("th", { children: "Occurrence" }),
                /* @__PURE__ */ n("th", { children: "Changes / result" })
              ] }) }),
              /* @__PURE__ */ n("tbody", { children: Ie.map((y) => {
                var U;
                return /* @__PURE__ */ d("tr", { children: [
                  /* @__PURE__ */ n("td", { children: /* @__PURE__ */ d(
                    "a",
                    {
                      href: `/${le}/${y.item.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      children: [
                        (U = y.item.occurrence) == null ? void 0 : U.performer.name,
                        " —",
                        " ",
                        y.item.media.title || Je
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ d("td", { children: [
                    y.conflict && /* @__PURE__ */ n("strong", { children: "Conflict. " }),
                    p ? `${y.status}. ${y.error ?? ""}` : `Add: ${j(wt(y.before.ids, y.desired).added)}; Remove: ${j(wt(y.before.ids, y.desired).removed)}`
                  ] })
                ] }, y.item.key);
              }) })
            ] }) }),
            /* @__PURE__ */ d("div", { className: "dq-row", children: [
              !I && /* @__PURE__ */ d(Ae, { children: [
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button primary",
                    disabled: N || !we("pending"),
                    onClick: () => void Le("apply"),
                    children: p ? "Continue remaining" : "Apply batch"
                  }
                ),
                p && we("failed") > 0 && /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: N,
                    onClick: () => void Le("retry"),
                    children: "Retry failed occurrences"
                  }
                )
              ] }),
              C && /* @__PURE__ */ n(
                "button",
                {
                  type: "button",
                  className: "dq-button",
                  disabled: N,
                  onClick: () => void Le("undo"),
                  children: "Undo batch"
                }
              )
            ] })
          ] }),
          k && /* @__PURE__ */ d("div", { role: "group", "aria-label": "Discard batch results", children: [
            /* @__PURE__ */ n("p", { children: "Starting a new batch discards these results and their undo history. Existing tag changes remain." }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: N,
                onClick: () => {
                  var y;
                  f(null), $(!1), R(!1), E(
                    ((y = e.actions.find((U) => U.steps.length)) == null ? void 0 : y.id) ?? ""
                  ), ee(!1), Z(""), Qe(!1);
                },
                children: "Discard results and start new batch"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => Qe(!1),
                children: "Keep results"
              }
            )
          ] }),
          /* @__PURE__ */ d("div", { className: "dq-row", children: [
            N && /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                className: "dq-button",
                onClick: () => {
                  var y;
                  Ve.current = !0, (y = ae.current) == null || y.abort(), Z("Stopping after in-flight operations settle…");
                },
                children: [
                  "Cancel ",
                  ae.current ? "preview" : "run"
                ]
              }
            ),
            p && /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: N,
                onClick: () => Qe(!0),
                children: "New batch"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                className: "dq-button",
                disabled: N,
                onClick: ye,
                children: "Close"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
const Vi = "data-quality.description-collapsed.v1";
function ga() {
  try {
    return localStorage.getItem(Vi) === "true";
  } catch {
    return !1;
  }
}
function ha({
  details: e,
  label: t
}) {
  const [r, i] = S(ga), s = Tt(() => {
    i((c) => {
      const o = !c;
      try {
        localStorage.setItem(Vi, String(o));
      } catch {
      }
      return o;
    });
  }, []);
  return /* @__PURE__ */ d("section", { className: "dq-review-description", "aria-label": `${t} description`, children: [
    /* @__PURE__ */ n(
      "button",
      {
        type: "button",
        className: "dq-button dq-description-toggle",
        "aria-expanded": !r,
        onClick: s,
        children: "Description"
      }
    ),
    !r && (e != null && e.trim() ? /* @__PURE__ */ n(go, { className: "dq-description-body", children: e }) : /* @__PURE__ */ n("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
function yr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((o, g) => yr(o, t[g]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const r = e, i = t, s = Object.keys(r).sort(), c = Object.keys(i).sort();
  return s.length === c.length && s.every(
    (o, g) => o === c[g] && yr(r[o], i[o])
  );
}
const Dr = [
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
], ma = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function Zt(e) {
  const t = ge(e) ? e.occurrence : void 0;
  return {
    filter: $e({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, be(e)),
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
        includeSubtags: t.includeSubtags ?? !0,
        hideConfirmedAbsent: t.hideConfirmedAbsent ?? !0
      }
    } : {}
  };
}
function ei(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function pn(e, t) {
  if (!Dr.some((o) => t.has(o))) {
    const o = Zt(e);
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
      const u = g.lastIndexOf(":");
      return { key: g.slice(0, u), direction: g.slice(u + 1) };
    });
    if (o.some((g) => !g.key || !["asc", "desc"].includes(g.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = o, i.sort = o[0].key, i.direction = o[0].direction;
  }
  let s;
  if (ge(e) && (s = {
    ...ma,
    ...ei(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(s.targetMode) || !["any", "includes", "includesAll", "excludes", "isNull"].includes(
    s.condition
  ) || !Array.isArray(s.performerIds) || !Array.isArray(s.conditionTagIds) || typeof s.includeSubtags != "boolean" || typeof s.hideConfirmedAbsent != "boolean" || [...s.performerIds, ...s.conditionTagIds].some(
    (o) => !Number.isSafeInteger(o) || o <= 0
  ) || !s.performerFilter || typeof s.performerFilter != "object" || Array.isArray(s.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const c = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: $e(i, be(e)),
      objectFilter: ei(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: c,
      performerScope: s
    },
    startAtEnd: !t.has("page") && c === "end"
  };
}
function hr(e, t) {
  const r = new URLSearchParams(window.location.search);
  Dr.forEach((i) => r.delete(i)), r.set("review", e);
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
function dt(e, t) {
  const r = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return ge(e) ? {
    ...e,
    view: r,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: r };
}
function ti({
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
function Yr(e, t) {
  if (!t) return e;
  const r = /* @__PURE__ */ new Map();
  for (const i of e)
    r.set(i.media.id, [...r.get(i.media.id) ?? [], i]);
  return [...r.values()].reverse().flat();
}
const et = (e) => e instanceof Error ? e.message : "Request failed.";
function ba({
  actions: e,
  disabled: t,
  canWrite: r,
  canAssess: i = !0,
  onApply: s
}) {
  const [c, o] = S({});
  Q(() => {
    let u = !0;
    return Promise.all(
      [
        ...new Set(
          e.flatMap(
            (f) => f.steps.flatMap((w) => w.tagIds)
          )
        )
      ].map(async (f) => {
        try {
          return [
            f,
            (await Y(`/api/tags/${f}`)).name
          ];
        } catch {
          return [f, "Unavailable tag"];
        }
      })
    ).then((f) => {
      u && o(Object.fromEntries(f));
    }), () => {
      u = !1;
    };
  }, [e]);
  const g = {
    ADD: "Add",
    REMOVE: "Remove",
    REMOVE_TREE: "Remove tree",
    MARK_PRESENT: "Mark present",
    MARK_ABSENT: "Mark absent",
    CLEAR_ABSENCE: "Clear absence"
  };
  return /* @__PURE__ */ d("div", { className: "dq-review-actions", children: [
    /* @__PURE__ */ n("p", { children: "Actions apply and advance. Shift-click or Shift + shortcut applies and stays." }),
    e.map((u, f) => /* @__PURE__ */ d("div", { className: "dq-action-pair", children: [
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: t || !r && u.steps.length > 0 || !i && vt(u),
          onClick: (w) => s(u, w.shiftKey),
          children: /* @__PURE__ */ d("span", { children: [
            kt(u, f) && /* @__PURE__ */ n("kbd", { children: kt(u, f) }),
            " ",
            u.label
          ] })
        }
      ),
      u.steps.length > 0 && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-button dq-apply-stay-button",
          disabled: t || !r || !i && vt(u),
          "aria-label": `Apply & stay: ${u.label}`,
          title: `Apply & stay: ${u.label}`,
          onClick: () => s(u, !0),
          children: /* @__PURE__ */ n(yn, { "aria-hidden": "true" })
        }
      ),
      u.steps.length > 0 && /* @__PURE__ */ n("small", { className: "dq-review-action-summary", children: u.steps.map(
        (w) => `${g[w.mode]}: ${w.tagIds.map((E) => c[E] ?? "Loading tag…").join(", ")}`
      ).join("; ") })
    ] }, u.id))
  ] });
}
function ya({
  review: e,
  canWrite: t,
  canAssess: r = !0,
  onBusy: i,
  onSaveDefaults: s,
  editRequest: c = 0,
  renderRuleEditor: o
}) {
  var De;
  const g = be(e), u = St(g), f = g === "audio" ? "Audio" : "Scene", w = (l) => {
    var m;
    return l.title || ((m = l.files[0]) == null ? void 0 : m.basename) || f;
  }, E = (l) => `${l.occurrence ? `${l.occurrence.performer.name} — ` : ""}${w(l.media)}`, A = O(null), R = O("");
  if (!A.current)
    try {
      A.current = pn(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (l) {
      R.current = et(l), A.current = { query: Zt(e), startAtEnd: !1 };
    }
  const [N, W] = S(null), b = O(null), P = O(null), x = O(null), [Z, qe] = S(!!R.current), Oe = O(0), [p, $] = S(A.current.query), I = O(p);
  I.current = p;
  const [ee, G] = S(0), le = O(A.current.startAtEnd), [te, Je] = S([]), [k, Qe] = S(null), ne = O(null), [nt, Fe] = S(null), [ut, It] = S(0), Bt = jt(() => {
    if (!k) return null;
    const l = te.findIndex((m) => m.key === k.key);
    return l < 0 ? null : te.slice(l + 1).find((m) => m.media.id !== k.media.id) ?? null;
  }, [k, te]), [je, Ve] = S(0), [ae, Ge] = S(!1), [de, Ue] = S(!1), ye = O(!1), xe = O(!0), Le = O(null);
  Q(() => (xe.current = !0, () => {
    xe.current = !1;
  }), []);
  const [Ie, z] = S(R.current), [we, L] = S(""), [C, j] = S(null), [y, U] = S(!1), [F, it] = S([]), rr = O([]), ot = O(null), ft = O(null), nr = O(null);
  Q(() => {
    var l, m;
    y && ((m = (l = nr.current) == null ? void 0 : l.querySelector("input")) == null || m.focus());
  }, [y]);
  const [Ee, Ct] = S(!1);
  Q(() => {
    if (ae || Ee || !ft.current) return;
    const l = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const m = ft.current;
      m != null && m.isConnected && !m.disabled && m.focus(), ft.current = null;
    });
    return () => cancelAnimationFrame(l);
  }, [ae, Ee, ee]);
  const [Et, Ot] = S([]), [Vt, ir] = S({}), Mt = O(null), at = O(0), [or, Gt] = S({});
  Q(() => {
    let l = !0;
    return Promise.all(
      An(p.objectFilter).map(
        async (m) => [
          String(m),
          (await Y(`/api/tags/${m}`)).name
        ]
      )
    ).then((m) => {
      l && Gt(Object.fromEntries(m));
    }).catch(() => {
    }), () => {
      l = !1;
    };
  }, [p.objectFilter]);
  const Jt = jt(
    () => qn(p.objectFilter, or),
    [or, p.objectFilter]
  ), ie = O(0), Nt = O(e);
  Nt.current = e;
  const ar = N ?? e, st = jt(
    () => dt(ar, p),
    [ar, p]
  ), _e = O(st);
  _e.current = st;
  const Qt = p.startFrom !== (e.view.startFrom ?? "end") || !yr(
    JSON.parse(lt(dt(e, p))),
    JSON.parse(lt(dt(e, Zt(e))))
  ), B = de || ae || y, We = Number(p.filter.page);
  function ue(l, m = !1) {
    ye.current || (R.current = "", le.current = m, I.current = l, $(l), Ve(0), Ge(!0), m || hr(e.id, l), G((M) => M + 1));
  }
  function pt() {
    if (ye.current = !1, Ue(!1), xe.current && Le.current) {
      const l = Le.current;
      Le.current = null, ue(l.query, l.startAtEnd);
    }
  }
  Q(() => {
    const l = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const m = pn(
            Nt.current,
            new URLSearchParams(window.location.search)
          );
          ye.current ? Le.current = m : ue(m.query, m.startAtEnd);
        } catch (m) {
          z(et(m));
        }
    };
    return window.addEventListener("popstate", l), () => window.removeEventListener("popstate", l);
  }, [e.id]), Q(() => (i(de || ae || y || !!N), () => i(!1)), [de, ae, y, !!N, i]);
  async function At(l, m, M) {
    if (ge(l)) {
      const V = await ji(
        l,
        Mt.current,
        m,
        M
      );
      return {
        items: V.items.map((re) => ({
          key: re.key,
          media: re.media,
          occurrence: re
        })),
        totalCount: V.totalCount
      };
    }
    const J = await gr(
      l,
      { ...l.view.filter, page: m },
      M
    );
    return {
      items: J.items.map((V) => ({ key: String(V.id), media: V })),
      totalCount: J.totalCount
    };
  }
  function Wt(l, m, M, J = !1, V = !1) {
    if (!xe.current || Le.current) return;
    qe(!0), Je(
      V ? l.items : Yr(l.items, I.current.startFrom === "end")
    ), Ve(l.totalCount), Pt(M, J);
    const re = {
      ...I.current,
      filter: { ...I.current.filter, page: m }
    };
    I.current = re, $(re), hr(e.id, re);
  }
  function Pt(l, m = !1) {
    (l == null ? void 0 : l.key) !== (k == null ? void 0 : k.key) && (ne.current = null), (l == null ? void 0 : l.media.id) !== (k == null ? void 0 : k.media.id) && Fe(m && l ? l.media.id : null), Qe(l);
  }
  Q(() => {
    if (R.current) return;
    const l = new AbortController();
    x.current = l;
    const m = ++ie.current;
    return Ge(!0), z(""), L(""), ne.current = null, Fe(null), Qe(null), Je([]), U(!1), (async () => {
      const M = dt(Nt.current, I.current);
      Mt.current = ge(M) ? await Rn(M, l.signal) : null;
      let J = Number(M.view.filter.page), V = await At(M, J, l.signal);
      const re = Math.max(
        1,
        Math.ceil(V.totalCount / Number(M.view.filter.perPage))
      );
      (le.current || J > re) && (J = re, V = await At(M, J, l.signal)), le.current = !1;
      const Me = M.view.startFrom === "end" ? -1 : 1;
      for (; ge(M) && !V.items.length && J + Me >= 1 && J + Me <= re && !l.signal.aborted; )
        J += Me, V = await At(M, J, l.signal);
      if (m !== ie.current || l.signal.aborted) return;
      const Se = Yr(V.items, M.view.startFrom === "end");
      Wt(V, J, Se[0] ?? null);
    })().catch((M) => {
      !l.signal.aborted && m === ie.current && z(et(M));
    }).finally(() => {
      !l.signal.aborted && m === ie.current && (qe(!0), Ge(!1));
    }), () => {
      l.abort(), ie.current++;
    };
  }, [ee, e.id]), Q(() => {
    if (j(null), !k) return;
    let l = !0;
    return rt(g, k).then((m) => {
      l && (j(m), Ot(
        ge(e) ? m.ids.filter((M) => e.occurrence.tagIds.includes(M)) : []
      ));
    }).catch((m) => {
      l && z(`Could not load current tags. ${et(m)}`);
    }), () => {
      l = !1;
    };
  }, [k]), Q(() => {
    if (!ge(e) || e.actions.length)
      return;
    let l = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (m) => [
          m,
          (await Y(`/api/tags/${m}`)).name
        ]
      )
    ).then((m) => {
      l && ir(Object.fromEntries(m));
    }).catch((m) => {
      l && z(et(m));
    }), () => {
      l = !1;
    };
  }, [e]);
  async function Cr(l = !1, m = !1, M = !1) {
    var cr;
    if (!k) return;
    const J = te.findIndex((se) => se.key === k.key), V = p.startFrom === "end" ? -1 : 1, re = ((cr = ne.current) == null ? void 0 : cr.key) === k.key ? ne.current : { key: k.key, page: We, before: te.slice(0, J + 1).map((se) => se.key), after: te.slice(J + 1).map((se) => se.key) }, Me = new Set(re.after), Se = new Set(re.before), qt = te.find((se) => {
      var Ke;
      return Me.has(se.key) || (V === 1 || We < re.page) && ((Ke = ne.current) == null ? void 0 : Ke.key) === k.key && !Se.has(se.key);
    });
    if (!l && qt) {
      Pt(qt, M);
      return;
    }
    const _ = l ? Se : new Set(te.map((se) => se.key)), Pe = 1100 - (Date.now() - at.current);
    Pe > 0 && await new Promise((se) => window.setTimeout(se, Pe));
    let Ne = V === -1 && !l ? Math.max(1, We - 1) : We;
    for (; xe.current && !Le.current; ) {
      let se = await At(st, Ne);
      const Ke = Math.max(
        1,
        Math.ceil(se.totalCount / Number(p.filter.perPage))
      );
      Ne > Ke && (Ne = Ke, se = await At(st, Ne));
      const ct = Yr(se.items, V === -1), lr = new Map(ct.map((Te) => [Te.key, Te])), ht = l ? re.after.flatMap((Te) => {
        const xt = lr.get(Te);
        return xt ? [xt] : [];
      }) : [], ce = new Set(ht.map((Te) => Te.key)), Ft = l ? {
        ...se,
        items: [
          ...ht,
          ...ct.filter(
            (Te) => Te.key !== k.key && !ce.has(Te.key)
          )
        ]
      } : se;
      if (m) {
        ne.current = re, Wt(Ft, Ne, k, !1, l);
        return;
      }
      const zt = V === -1 && We === 1 && !l ? void 0 : Ft.items.find(
        (Te) => !_.has(Te.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(l && V === -1 && Ne === re.page) || Me.has(Te.key))
      );
      if (zt || (V === -1 ? Ne <= 1 : Ne >= Ke)) {
        Wt(
          Ft,
          Ne,
          zt ?? null,
          M,
          l
        ), zt || L(
          se.totalCount ? `Reached the end in this direction. Matching items remain available from the ${u.queue} pages.` : `No matching ${u.many}.`
        );
        return;
      }
      Ne += V;
    }
  }
  async function ve(l, m = !1, M = !1, J = !1) {
    if (N || !k || ye.current || ae || y && !M)
      return;
    const V = M || J || !!(l != null && l.steps.length), re = V && !m;
    if (V && (!t || !C) || l && vt(l) && !r) return;
    ye.current = !0, Ue(!0), z(""), L("");
    const Me = te.findIndex((_) => _.key === k.key), Se = V && !m && Me >= 0 ? te[Me + 1] ?? null : null;
    Se && (Je(
      (_) => _.filter((Pe) => Pe.key !== k.key)
    ), Pt(Se, !0));
    let qt = !1;
    try {
      if (V) {
        const _ = await rt(g, k);
        if (l)
          await sa(st, k, l);
        else {
          const Ne = J && ge(e) ? e.occurrence.tagIds.filter((Ke) => _.ids.includes(Ke)) : rr.current, se = wt(Ne, J ? Et : F);
          await Tn(st, k, se);
        }
        at.current = Date.now();
        const Pe = await rt(g, k);
        Se || j(Pe), qt = !0, U(!1), L("Tags saved.");
      }
      if (!xe.current || Le.current) return;
      V ? await Cr(!0, m, re) : m || await Cr(), m && M && requestAnimationFrame(() => {
        var _;
        return (_ = ot.current) == null ? void 0 : _.focus();
      });
    } catch (_) {
      if (z(
        qt ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${et(_)}` : V ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${et(_)}` : `Could not advance. ${et(_)}`
      ), V && !qt) {
        Se && (Je(te), Fe(null), It((Pe) => Pe + 1), Qe(k)), at.current = Date.now();
        try {
          j(await rt(g, k));
        } catch {
          j(null), z(
            (Pe) => `${Pe} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      pt();
    }
  }
  Q(() => {
    const l = (m) => {
      if (y || N || de || ae || Ee || m.defaultPrevented || m.repeat || m.ctrlKey || m.altKey || m.metaKey || !qi(m.target) || document.querySelector('[role="dialog"], dialog[open]'))
        return;
      const M = m.key.toLowerCase(), J = e.actions.find(
        (V, re) => kt(V, re) === M
      );
      J && (m.preventDefault(), m.stopPropagation(), ve(J, m.shiftKey));
    };
    return document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l);
  });
  function ze() {
    !s || N || ye.current || y || (P.current = document.activeElement, b.current = {
      error: Ie,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(I.current),
      items: te,
      current: k,
      total: je,
      targets: Mt.current,
      stayedCursor: ne.current
    }, W(structuredClone(dt(e, I.current))), L(""), z(""));
  }
  Q(() => {
    c && c !== Oe.current && Z && !ae && (Oe.current = c, ze());
  }, [c, ae, Z]);
  function $t() {
    W(null), requestAnimationFrame(() => {
      var l;
      return (l = P.current) == null ? void 0 : l.focus();
    });
  }
  function gt() {
    var m;
    const l = b.current;
    !l || de || ((m = x.current) == null || m.abort(), ie.current++, I.current = l.query, $(l.query), Je(l.items), Qe(l.current), Ve(l.total), Mt.current = l.targets, ne.current = l.stayedCursor, Ge(!1), z(l.error), L(""), window.history.replaceState(window.history.state, "", l.url), $t());
  }
  async function sr() {
    if (!N || !s || ye.current) return;
    const l = dt(
      { ...N, name: N.name.trim() },
      I.current
    ), m = Mr(l);
    if (m) {
      z(m);
      return;
    }
    ye.current = !0, Ue(!0), z("");
    try {
      if (await s(l) === !1) throw new Error("Could not save review.");
      $t(), L("Review saved.");
    } catch (M) {
      z(
        "Could not save review. Your edits are still open. " + et(M)
      );
    } finally {
      pt();
    }
  }
  async function Re() {
    if (!s || ye.current) return;
    const l = dt(e, {
      ...I.current,
      filter: { ...I.current.filter, page: 1 }
    });
    ye.current = !0, Ue(!0), z("");
    try {
      if (await s(l) === !1) throw new Error("Could not save review.");
      L("Queue saved to this review.");
    } catch (m) {
      z("Could not save queue. " + et(m));
    } finally {
      pt();
    }
  }
  const H = p.performerScope, he = (l) => ue({
    ...I.current,
    filter: { ...I.current.filter, page: 1 },
    performerScope: { ...H, ...l }
  });
  return /* @__PURE__ */ d(
    "section",
    {
      className: `dq-review-workspace${g === "audio" ? " dq-audio" : ""}`,
      "aria-label": H ? g === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : g === "audio" ? "Audio review" : "Video review",
      children: [
        N && /* @__PURE__ */ d("section", { className: "dq-rule-editor", "aria-label": "Edit review rule", children: [
          /* @__PURE__ */ n("h2", { children: "Edit review" }),
          /* @__PURE__ */ n("p", { children: "Preview matching scenes below. Save review keeps all rule changes; Cancel restores your previous view." }),
          /* @__PURE__ */ d("fieldset", { disabled: de, children: [
            o == null ? void 0 : o(
              dt(N, p),
              W,
              de
            ),
            /* @__PURE__ */ d("label", { children: [
              "Review direction",
              /* @__PURE__ */ d(
                "select",
                {
                  "aria-label": "Review direction",
                  value: p.startFrom,
                  onChange: (l) => ue({
                    ...I.current,
                    startFrom: l.target.value
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
                disabled: de || ae,
                onClick: () => void sr(),
                children: "Save review"
              }
            ),
            /* @__PURE__ */ n(
              "button",
              {
                className: "dq-button",
                type: "button",
                disabled: de,
                onClick: gt,
                children: "Cancel"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ d(
          "fieldset",
          {
            className: "dq-review-filters",
            disabled: B,
            onClickCapture: (l) => {
              var J;
              const m = l.target instanceof Element ? l.target.closest("button") : null, M = (m == null ? void 0 : m.getAttribute("aria-label")) ?? ((J = m == null ? void 0 : m.textContent) == null ? void 0 : J.trim()) ?? "";
              m && !m.closest('[role="dialog"], dialog') && /^(Filters|Edit filter:|Edit performer criteria)/.test(M) && (ft.current = m);
            },
            children: [
              /* @__PURE__ */ n("legend", { children: g === "audio" ? "Audio filters" : "Scene filters" }),
              /* @__PURE__ */ d("div", { className: "dq-queue-toolbar", children: [
                /* @__PURE__ */ n(
                  mr,
                  {
                    filter: p.filter,
                    objectFilter: Jt,
                    criteriaDefinitions: g === "audio" ? mn : Lr,
                    customFieldEntityType: g,
                    totalCount: je,
                    sortOptions: g === "audio" ? di : bn,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    onFilterChange: (l) => {
                      (l.sort !== I.current.filter.sort || l.direction !== I.current.filter.direction) && (l = { ...l, sorts: void 0 }), ue({
                        ...I.current,
                        filter: $e(l, g)
                      });
                    },
                    onObjectFilterChange: (l) => {
                      ue({
                        ...I.current,
                        objectFilter: Li(
                          l,
                          or,
                          I.current.objectFilter
                        ),
                        filter: { ...I.current.filter, page: 1 }
                      });
                    }
                  }
                ),
                !N && Qt && /* @__PURE__ */ d("div", { className: "dq-review-defaults", children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      "aria-label": "Save changes to review filters",
                      title: "Save changes to review filters",
                      disabled: !s,
                      onClick: () => void Re(),
                      children: /* @__PURE__ */ n(yn, { "aria-hidden": "true" })
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
                        const l = Zt(e);
                        ue(l, l.startFrom === "end");
                      },
                      children: /* @__PURE__ */ n(mi, { "aria-hidden": "true" })
                    }
                  )
                ] })
              ] }),
              H && /* @__PURE__ */ d("div", { className: "dq-scope-controls", children: [
                /* @__PURE__ */ d("label", { children: [
                  "Performers to review",
                  " ",
                  /* @__PURE__ */ d(
                    "select",
                    {
                      value: H.targetMode,
                      onChange: (l) => he({
                        targetMode: l.target.value
                      }),
                      children: [
                        /* @__PURE__ */ n("option", { value: "all", children: "All performers" }),
                        /* @__PURE__ */ n("option", { value: "selected", children: "Specific performers" }),
                        /* @__PURE__ */ n("option", { value: "filter", children: "Matching performer criteria" })
                      ]
                    }
                  )
                ] }),
                H.targetMode === "selected" && /* @__PURE__ */ n(
                  yt,
                  {
                    entityType: "performer",
                    values: H.performerIds,
                    onChange: (l) => he({ performerIds: l }),
                    placeholder: "Select performers to review...",
                    allowCreate: !1
                  }
                ),
                H.targetMode === "filter" && /* @__PURE__ */ d(Ae, { children: [
                  /* @__PURE__ */ n(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      onClick: () => Ct(!0),
                      children: "Edit performer criteria"
                    }
                  ),
                  /* @__PURE__ */ n("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ n(
                    mr,
                    {
                      filter: {},
                      onFilterChange: () => {
                      },
                      totalCount: 0,
                      sortOptions: [],
                      showSearch: !1,
                      showSort: !1,
                      showPagingControls: !1,
                      criteriaDefinitions: en,
                      objectFilter: H.performerFilter,
                      onObjectFilterChange: (l) => he({ performerFilter: l })
                    }
                  ) })
                ] }),
                /* @__PURE__ */ d("label", { children: [
                  "Occurrence tags",
                  " ",
                  /* @__PURE__ */ d(
                    "select",
                    {
                      value: H.condition,
                      onChange: (l) => he({
                        condition: l.target.value
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
                !["any", "isNull"].includes(H.condition) && /* @__PURE__ */ d(Ae, { children: [
                  /* @__PURE__ */ n(
                    yt,
                    {
                      entityType: "tag",
                      values: H.conditionTagIds,
                      onChange: (l) => he({ conditionTagIds: l }),
                      placeholder: "Occurrence condition tags...",
                      allowCreate: !1
                    }
                  ),
                  /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "checkbox",
                        checked: H.includeSubtags ?? !0,
                        onChange: (l) => he({ includeSubtags: l.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  H.condition === "excludes" && /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ n(
                      "input",
                      {
                        type: "checkbox",
                        checked: H.hideConfirmedAbsent ?? !0,
                        onChange: (l) => he({ hideConfirmedAbsent: l.target.checked })
                      }
                    ),
                    "Hide occurrences confirmed absent"
                  ] })
                ] })
              ] })
            ]
          }
        ),
        H && /* @__PURE__ */ n(
          ui,
          {
            open: Ee,
            onClose: () => Ct(!1),
            criteria: en,
            activeFilter: H.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (l) => {
              Ct(!1), he({ performerFilter: l });
            }
          }
        ),
        ge(st) && t && /* @__PURE__ */ n(
          pa,
          {
            review: st,
            hidden: !!N,
            disabled: B || !!N,
            onOpen: () => {
              ye.current = !0, Ue(!0);
            },
            onWrite: () => {
              at.current = Date.now();
            },
            onClose: (l) => {
              l ? (at.current = Date.now(), new Promise((m) => window.setTimeout(m, 1100)).then(() => {
                pt(), xe.current && G((m) => m + 1);
              })) : pt();
            }
          }
        ),
        /* @__PURE__ */ d("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
          Ie && /* @__PURE__ */ d("p", { role: "alert", children: [
            Ie,
            " ",
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                disabled: de,
                onClick: () => {
                  k ? rt(g, k).then(j).catch((l) => z(et(l))) : ue(I.current);
                },
                children: k ? "Reload tags" : "Retry queue"
              }
            )
          ] }),
          we && /* @__PURE__ */ n("p", { role: "status", children: we })
        ] }),
        /* @__PURE__ */ d("div", { className: "dq-review-layout", children: [
          /* @__PURE__ */ d("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
            /* @__PURE__ */ n("fieldset", { disabled: B, children: /* @__PURE__ */ n(
              fi,
              {
                filter: p.filter,
                totalCount: je,
                onFilterChange: (l) => ue({ ...p, filter: $e(l, g) })
              }
            ) }),
            /* @__PURE__ */ n("div", { className: "dq-review-queue-items", children: te.map((l) => /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                className: "dq-button",
                title: E(l),
                "aria-label": E(l),
                disabled: B,
                "aria-pressed": (k == null ? void 0 : k.key) === l.key,
                onClick: () => {
                  Pt(l), z(""), L("");
                },
                children: [
                  l.occurrence && /* @__PURE__ */ n(ti, { performer: l.occurrence.performer }),
                  /* @__PURE__ */ n("span", { className: "dq-queue-scene-title", children: w(l.media) })
                ]
              },
              l.key
            )) })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-inspector", children: k ? /* @__PURE__ */ d(Ae, { children: [
            /* @__PURE__ */ d("div", { className: "dq-review-media", children: [
              /* @__PURE__ */ n("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ n(
                "a",
                {
                  href: `/${g}/${k.media.id}`,
                  target: "_blank",
                  rel: "noreferrer",
                  children: k.media.title || ((De = k.media.files[0]) == null ? void 0 : De.basename) || `${g === "audio" ? "Audio" : "Video"} ${k.media.id}`
                }
              ) }),
              [k, Bt].filter(Boolean).map((l) => {
                var J, V, re, Me, Se;
                const m = l, M = m.key === k.key;
                return /* @__PURE__ */ n(
                  "div",
                  {
                    className: M ? "dq-review-video-current" : "dq-review-video-preload",
                    "aria-hidden": M ? void 0 : !0,
                    inert: M ? void 0 : !0,
                    children: g === "audio" ? /* @__PURE__ */ n(
                      ho,
                      {
                        streamUrl: ln("audio", m.media.id),
                        format: ((J = m.media.files[0]) == null ? void 0 : J.format) ?? "",
                        title: w(m.media),
                        coverUrl: M ? Hn("audio", m.media) : void 0,
                        duration: ((V = m.media.files[0]) == null ? void 0 : V.duration) ?? 0,
                        autostart: M && nt === m.media.id
                      }
                    ) : /* @__PURE__ */ n(
                      pi,
                      {
                        videoId: m.media.id,
                        streamUrl: ln("video", m.media.id),
                        posterUrl: M ? Hn("video", m.media) : void 0,
                        duration: ((re = m.media.files[0]) == null ? void 0 : re.duration) ?? 0,
                        format: (Me = m.media.files[0]) == null ? void 0 : Me.format,
                        audioCodec: (Se = m.media.files[0]) == null ? void 0 : Se.audioCodec,
                        extensionSurface: M ? "quick-view" : void 0,
                        autostart: M && nt === m.media.id,
                        keyboardShortcutsEnabled: M,
                        showAbLoop: M,
                        clip: m.media.parentVideoId != null ? {
                          start: m.media.clipStartSec ?? 0,
                          end: m.media.clipEndSec,
                          loop: !1
                        } : void 0
                      }
                    )
                  },
                  `${m.media.id}:${ut}`
                );
              }),
              g === "audio" && /* @__PURE__ */ n(
                ha,
                {
                  details: k.media.details,
                  label: u.one
                },
                k.media.id
              )
            ] }),
            /* @__PURE__ */ d("div", { className: "dq-review-panel", children: [
              /* @__PURE__ */ n("h2", { children: k.occurrence ? `Reviewing ${k.occurrence.performer.name}` : `Reviewing this ${u.one}` }),
              /* @__PURE__ */ n("p", { children: H ? `Tags apply only to this performer in this ${u.one}.` : `Tags apply to the ${u.one}.` }),
              H && /* @__PURE__ */ n(
                "div",
                {
                  className: "dq-review-partners",
                  "aria-label": `Matching ${u.queue} partners`,
                  children: te.filter((l) => l.media.id === k.media.id).map((l) => {
                    var m, M;
                    return /* @__PURE__ */ n(
                      "button",
                      {
                        type: "button",
                        className: "dq-button dq-partner-button",
                        title: (m = l.occurrence) == null ? void 0 : m.performer.name,
                        "aria-label": (M = l.occurrence) == null ? void 0 : M.performer.name,
                        disabled: B,
                        "aria-pressed": l.key === k.key,
                        onClick: () => {
                          Pt(l), z("");
                        },
                        children: l.occurrence && /* @__PURE__ */ n(
                          ti,
                          {
                            performer: l.occurrence.performer
                          }
                        )
                      },
                      l.key
                    );
                  })
                }
              ),
              /* @__PURE__ */ d("p", { children: [
                "Current ",
                H ? "occurrence" : u.one,
                " tags:",
                " ",
                C ? C.names.join(", ") || "None" : "Loading…"
              ] }),
              C != null && C.absent.length ? /* @__PURE__ */ d("p", { children: [
                "Confirmed absent tags:",
                " ",
                /* @__PURE__ */ n(
                  yt,
                  {
                    entityType: "tag",
                    values: C.absent,
                    onChange: () => {
                    },
                    disabled: !0,
                    allowCreate: !1
                  }
                )
              ] }) : null,
              y ? /* @__PURE__ */ d(
                "fieldset",
                {
                  ref: nr,
                  disabled: de,
                  className: "dq-tag-editor",
                  children: [
                    /* @__PURE__ */ d("legend", { children: [
                      "Edit ",
                      H ? "occurrence" : u.one,
                      " tags"
                    ] }),
                    /* @__PURE__ */ n(
                      yt,
                      {
                        entityType: "tag",
                        values: F,
                        onChange: it,
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
                          disabled: !C,
                          onClick: () => void ve(void 0, !0, !0),
                          children: "Save"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          disabled: !C,
                          onClick: () => void ve(void 0, !1, !0),
                          children: "Save & next"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => {
                            U(!1), requestAnimationFrame(
                              () => {
                                var l;
                                return (l = ot.current) == null ? void 0 : l.focus();
                              }
                            );
                          },
                          children: "Cancel"
                        }
                      )
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ d(Ae, { children: [
                /* @__PURE__ */ n(
                  ba,
                  {
                    actions: ar.actions,
                    canWrite: t,
                    canAssess: r,
                    disabled: de || ae || !C || !!N,
                    onApply: (l, m) => void ve(l, m)
                  }
                ),
                ge(e) && !e.actions.length && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ d(
                  "fieldset",
                  {
                    className: "dq-tag-choices",
                    disabled: !t || de || !C || !!N,
                    children: [
                      /* @__PURE__ */ n("legend", { children: "Tag choices" }),
                      e.occurrence.tagIds.map((l) => /* @__PURE__ */ d("label", { children: [
                        /* @__PURE__ */ n(
                          "input",
                          {
                            type: e.occurrence.multiple ? "checkbox" : "radio",
                            name: "legacy-choice",
                            checked: Et.includes(l),
                            onChange: (m) => Ot(
                              e.occurrence.multiple ? m.target.checked ? [...Et, l] : Et.filter(
                                (M) => M !== l
                              ) : [l]
                            )
                          }
                        ),
                        Vt[l] ?? "Loading tag…"
                      ] }, l)),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          onClick: () => Ot([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void ve(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ n(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void ve(void 0, !1, !1, !0),
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
                    ref: ot,
                    className: "dq-button",
                    disabled: B || !!N || !t || !C,
                    onClick: () => {
                      rr.current = [...C.ids], it([...C.ids]), U(!0);
                    },
                    children: "Edit tags"
                  }
                ),
                /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    className: "dq-button",
                    disabled: B || !!N,
                    onClick: () => void ve(),
                    children: [
                      "Skip",
                      H ? " performer" : ` ${u.one}`
                    ]
                  }
                )
              ] }),
              !t && /* @__PURE__ */ n("p", { children: "Write permission is required to change tags." })
            ] })
          ] }) : /* @__PURE__ */ n("p", { role: "status", children: ae ? "Loading review…" : je ? "Reached the end in this direction." : `No matching ${u.many}.` }) })
        ] })
      ]
    }
  );
}
function ri({
  review: e,
  onChange: t,
  choices: r = !1
}) {
  const i = e.occurrence, s = St(be(e)).queue, c = (o) => t({ ...e, occurrence: { ...i, ...o } });
  return r ? /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
    /* @__PURE__ */ n("legend", { children: "Tag choices" }),
    /* @__PURE__ */ d("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      s,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ n(
      yt,
      {
        entityType: "tag",
        values: i.tagIds,
        onChange: (o) => c({ tagIds: o }),
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
          onChange: (o) => c({ multiple: o.target.checked })
        }
      ),
      "Allow multiple tags, for example when something changes part-way through the ",
      s
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
          onChange: (o) => c({
            condition: o.target.value
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
    !["any", "isNull"].includes(i.condition) && /* @__PURE__ */ d(Ae, { children: [
      /* @__PURE__ */ n(
        yt,
        {
          entityType: "tag",
          values: i.conditionTagIds,
          onChange: (o) => c({ conditionTagIds: o }),
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
            onChange: (o) => c({ includeSubtags: o.target.checked })
          }
        ),
        "Include subtags"
      ] }),
      i.condition === "excludes" && /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
        /* @__PURE__ */ n(
          "input",
          {
            type: "checkbox",
            checked: i.hideConfirmedAbsent ?? !0,
            onChange: (o) => c({ hideConfirmedAbsent: o.target.checked })
          }
        ),
        "Hide occurrences confirmed absent"
      ] })
    ] }),
    /* @__PURE__ */ d("p", { children: [
      "Conditions check tags on the same performer’s occurrence, independently of ",
      s,
      " tags and the performer’s profile."
    ] })
  ] });
}
function wa(e) {
  var g, u, f;
  const [t, r] = S({}), [i, s] = S(""), c = (((g = e == null ? void 0 : e.presentation) == null ? void 0 : g.annotations) ?? []).includes("tags") ? ((u = e == null ? void 0 : e.presentation) == null ? void 0 : u.annotationParents) ?? [] : [], o = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...c,
      ...((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.binParents) ?? []
    ])
  ]);
  return Q(() => {
    let w = !0;
    return r({}), s(""), Promise.all(
      JSON.parse(o).map(
        async (E) => [E, await Sr([E])]
      )
    ).then((E) => {
      w && r(Object.fromEntries(E));
    }).catch(() => {
      w && s(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      w = !1;
    };
  }, [o]), { ids: t, error: i };
}
function va(e, t, r) {
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
          var u;
          return g !== o.id && ((u = r[g]) == null ? void 0 : u.includes(o.id));
        }
      )
    ) : []
  };
}
function Sa({
  videos: e,
  review: t,
  trees: r,
  disabled: i,
  onChoose: s
}) {
  var g, u, f;
  const c = new Set(
    (((g = t.presentation) == null ? void 0 : g.binParents) ?? []).flatMap(
      (w) => (r[w] ?? []).filter((E) => E !== w)
    )
  ), o = /* @__PURE__ */ new Map();
  for (const w of e)
    for (const E of w.tags ?? [])
      if (c.has(E.id)) {
        const A = o.get(E.id) ?? { name: E.name, count: 0 };
        A.count++, o.set(E.id, A);
      }
  return (f = (u = t.presentation) == null ? void 0 : u.binParents) != null && f.length ? /* @__PURE__ */ d("div", { className: "dq-row", "aria-label": "Tag bins", children: [
    /* @__PURE__ */ n("span", { children: "Tags on this page:" }),
    [...o].sort((w, E) => w[1].name.localeCompare(E[1].name)).map(([w, E]) => /* @__PURE__ */ d(
      "button",
      {
        className: "dq-button",
        type: "button",
        disabled: i,
        onClick: () => s(w),
        children: [
          E.name,
          " (",
          E.count,
          ")"
        ]
      },
      w
    )),
    !o.size && /* @__PURE__ */ n("span", { children: "No matching tag bins on this page." })
  ] }) : null;
}
function Ca(e, t) {
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
function ni({
  draft: e,
  onChange: t,
  presentation: r = !0,
  queue: i = !0
}) {
  const [s, c] = S(!1), o = Ce(e) === "tag" ? "tag" : be(e), g = o === "tag" ? "tags" : `${o}s`, u = mo(
    o === "tag" ? void 0 : o,
    e.view.objectFilter
  ), f = e.view.filter, w = o === "tag" ? gi : o === "audio" ? di : bn, E = o === "tag" ? hi : o === "audio" ? mn : Lr, A = (b) => t({
    ...e,
    view: { ...e.view, filter: { ...f, ...b } }
  }), R = o === "video" ? e.presentation ?? {} : {}, N = o !== "audio", W = (b) => t({ ...e, presentation: { ...R, ...b } });
  return /* @__PURE__ */ d(Ae, { children: [
    i && /* @__PURE__ */ d("fieldset", { className: "dq-queue-fields", children: [
      /* @__PURE__ */ n("legend", { children: "Queue" }),
      /* @__PURE__ */ d("label", { children: [
        "Search",
        /* @__PURE__ */ n(
          "input",
          {
            value: String(f.q ?? ""),
            onChange: (b) => A({ q: b.target.value })
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
              value: String(f.sort ?? "date"),
              onChange: (b) => A({ sort: b.target.value, sorts: void 0 }),
              children: [
                !w.some((b) => b.value === f.sort) && f.sort != null && /* @__PURE__ */ n("option", { value: String(f.sort), children: String(f.sort) }),
                w.map((b) => /* @__PURE__ */ n("option", { value: b.value, children: b.label }, b.value))
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
              value: String(f.direction ?? "desc"),
              onChange: (b) => A({ direction: b.target.value }),
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
              value: Number(f.perPage) || 40,
              onChange: (b) => A({
                perPage: Math.max(
                  1,
                  Math.min(1e3, Number(b.target.value) || 40)
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
              onChange: (b) => t({
                ...e,
                view: {
                  ...e.view,
                  startFrom: b.target.value
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
        Object.keys(e.view.objectFilter).length ? `${o[0].toUpperCase()}${o.slice(1)} filters configured` : `No ${o} filters`,
        ". Choose which ",
        g,
        " enter the queue."
      ] }),
      s && /* @__PURE__ */ n("div", { onKeyDown: (b) => b.stopPropagation(), children: /* @__PURE__ */ n(
        ui,
        {
          open: !0,
          onClose: () => c(!1),
          criteria: E,
          activeFilter: e.view.objectFilter,
          customSections: u ? [u] : void 0,
          supportsFilterExpressions: o !== "tag",
          subjectLabel: g,
          onApply: (b) => {
            t({ ...e, view: { ...e.view, objectFilter: b } }), c(!1);
          }
        }
      ) })
    ] }),
    r && /* @__PURE__ */ d(Ae, { children: [
      /* @__PURE__ */ n("h3", { children: "Appearance" }),
      /* @__PURE__ */ d("p", { className: "dq-editor-note", children: [
        "Choose how ",
        o === "tag" ? "tags" : `${g} and tags`,
        " appear while reviewing."
      ] }),
      /* @__PURE__ */ d("div", { className: "dq-field-grid", children: [
        Ei(e) && /* @__PURE__ */ d("label", { children: [
          "Preferred review layout",
          /* @__PURE__ */ d(
            "select",
            {
              value: e.view.reviewMode ?? "single",
              onChange: (b) => t({ ...e, view: { ...e.view, reviewMode: b.target.value } }),
              children: [
                /* @__PURE__ */ n("option", { value: "single", children: "Single video" }),
                /* @__PURE__ */ n("option", { value: "multiple", children: "Multiple videos" })
              ]
            }
          )
        ] }),
        !ge(e) && N && /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ n(
            "input",
            {
              type: "checkbox",
              checked: e.view.selectAllOnLoad ?? !1,
              onChange: (b) => t({ ...e, view: { ...e.view, selectAllOnLoad: b.target.checked ? !0 : void 0 } })
            }
          ),
          "Select all ",
          g,
          " on page load",
          o === "video" && /* @__PURE__ */ n("small", { children: " (multiple-videos layout)" })
        ] }),
        N && /* @__PURE__ */ d("label", { children: [
          "Preferred view",
          /* @__PURE__ */ n(
            "select",
            {
              value: o === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid",
              onChange: (b) => t({
                ...e,
                view: {
                  ...e.view,
                  displayMode: b.target.value
                }
              }),
              children: (o === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((b) => /* @__PURE__ */ n("option", { children: b }, b))
            }
          )
        ] })
      ] }),
      o === "video" && /* @__PURE__ */ d(Ae, { children: [
        /* @__PURE__ */ n("h4", { children: "Card annotations" }),
        /* @__PURE__ */ n("div", { className: "dq-annotation-options", children: ["date", "studio", "performers", "tags"].map((b) => {
          const P = R.annotations ?? [];
          return /* @__PURE__ */ d("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ n(
              "input",
              {
                type: "checkbox",
                checked: P.includes(b),
                onChange: (x) => W({
                  annotations: x.target.checked ? [...P, b] : P.filter((Z) => Z !== b)
                })
              }
            ),
            b
          ] }, b);
        }) }),
        (R.annotations ?? []).includes("tags") && /* @__PURE__ */ d(Ae, { children: [
          /* @__PURE__ */ n("h4", { children: "Card tag bins" }),
          /* @__PURE__ */ n("p", { children: "Choose parent tags. Only their descendant tags appear on the card; no tags appear until a parent is selected. This setting is separate from the queue filters." }),
          /* @__PURE__ */ n(
            yt,
            {
              entityType: "tag",
              values: R.annotationParents ?? [],
              placeholder: "Search annotation parent tags...",
              onChange: (b) => W({ annotationParents: b }),
              allowCreate: !1
            }
          )
        ] }),
        /* @__PURE__ */ n("h4", { children: "Queue tag bins" }),
        /* @__PURE__ */ n("p", { children: "Choose parent tags. Their descendants become temporary queue filters. Counts describe the loaded page." }),
        /* @__PURE__ */ n(
          yt,
          {
            entityType: "tag",
            values: R.binParents ?? [],
            placeholder: "Search tag-bin parent tags...",
            onChange: (b) => W({ binParents: b }),
            allowCreate: !1
          }
        )
      ] })
    ] })
  ] });
}
const Xr = 180, Ea = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
};
function Gi({ entityType: e }) {
  const t = Ea[e];
  return e === "tag" ? /* @__PURE__ */ n(So, { role: "img", "aria-label": t }) : pr(e) === "audio" ? /* @__PURE__ */ n(Co, { role: "img", "aria-label": t }) : /* @__PURE__ */ n(nn, { role: "img", "aria-label": t });
}
function ii(e) {
  return Ce(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function oi(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Zr() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function ai(e) {
  const t = new URLSearchParams(window.location.search);
  Dr.forEach((i) => t.delete(i)), e ? t.set("review", e) : t.delete("review");
  const r = t.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${r ? `?${r}` : ""}`
  );
}
function Na(e) {
  return $e({ ...e, page: 1 });
}
function Ji(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function tt(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Qi = "data-quality.workspace-layout.v1", kn = 240, gn = 192, hn = 560;
function Wi(e) {
  return typeof e == "number" && Number.isFinite(e) ? Math.min(hn, Math.max(gn, e)) : kn;
}
function Aa() {
  try {
    const e = JSON.parse(
      localStorage.getItem(Qi) ?? "null"
    );
    return Wi(e == null ? void 0 : e.sidebarWidth);
  } catch {
    return kn;
  }
}
function qa(e) {
  try {
    localStorage.setItem(
      Qi,
      JSON.stringify({ sidebarWidth: e })
    );
  } catch {
  }
}
function zi(e) {
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
function Hi(e, t) {
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
function Ra(e, t) {
  return e.mode === "REMOVE" ? `Remove ${t}` : e.mode === "REMOVE_TREE" ? `Remove ${t} tree` : Hi(e, t);
}
function Ta({
  onNavigate: e
}) {
  const [t, r] = S([]), [i] = S(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [s, c] = S(""), [o, g] = S(!0), [u, f] = S(""), [w, E] = S(!1), [A, R] = S(!1), [N, W] = S(!1), [b, P] = S(!1), [x, Z] = S([]), [qe, Oe] = S(""), [p, $] = S(!0), [I, ee] = S(""), [G, le] = S(""), [te, Je] = S(!1), [k, Qe] = S(!1), [ne, nt] = S(Zr), [Fe, ut] = S({}), [It, Bt] = S("name"), [je, Ve] = S("asc"), ae = O(null), Ge = O(!1), [de, Ue] = S(0), [ye, xe] = S(!1), [Le, Ie] = S(!1), [z, we] = S(
    null
  ), L = t.find((a) => a.id === ne) ?? null, C = jt(
    () => (z == null ? void 0 : z.id) === ne && L ? { ...L, view: {
      ...L.view,
      filter: z.view.filter,
      objectFilter: z.view.objectFilter,
      searchMode: z.view.searchMode,
      startFrom: z.view.startFrom
    } } : L,
    [z, ne, L]
  ), j = C ? Ce(C) : "video", y = pr(j), U = C ? ge(C) : !1, F = j === "video" ? C : null, it = U && !!(C != null && C.actions.some(vt)), rr = !!F || j === "audio" || it, [ot, ft] = S(null), nr = (ot == null ? void 0 : ot.id) === (C == null ? void 0 : C.id) ? ot == null ? void 0 : ot.mode : (C == null ? void 0 : C.view.reviewMode) ?? "single", Ee = U || j === "audio" || j === "video" && nr === "single", [Ct, Et] = S(0), Ot = O(-1), Vt = O(!1);
  Q(() => {
    const a = () => {
      if (!Ee && Ne.current) {
        Vt.current = !0;
        return;
      }
      nt(Zr()), Ee || Et((h) => h + 1);
    };
    return window.addEventListener("popstate", a), () => window.removeEventListener("popstate", a);
  }, [Ee]);
  const ir = y === "audio" ? A : w, Mt = j === "tag" ? "Tag" : y === "audio" ? "Audio" : "Video", at = j === "tag" ? N : ir, or = jt(() => {
    const a = je === "asc" ? 1 : -1;
    return [...t].sort((h, v) => {
      if (It === "count") {
        const q = Fe[h.id], K = Fe[v.id], T = typeof q == "number", D = typeof K == "number";
        if (T !== D) return T ? -1 : 1;
        if (T && D && q !== K)
          return (q - K) * a;
      }
      return h.name.localeCompare(v.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      }) * a;
    });
  }, [je, It, Fe, t]), Gt = O(
    null
  ), Jt = wa(F), [ie, Nt] = S({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [ar, st] = S({
    page: 1,
    perPage: 40
  }), [_e, Qt] = S({ items: [], totalCount: 0 }), [B, We] = S(!1), [ue, pt] = S(""), [At, Wt] = S(!1), [Pt, Cr] = S(!1), [ve, ze] = S(() => /* @__PURE__ */ new Set()), $t = O(ve);
  $t.current = ve;
  const gt = O(/* @__PURE__ */ new Map()), sr = (C == null ? void 0 : C.view.selectAllOnLoad) === !0, [Re, H] = S(null), he = O(Re);
  he.current = Re;
  const [De, l] = S(!1), m = O(De);
  m.current = De;
  const M = O(null), [J, V] = S("grid"), [re, Me] = S(Xr), [Se, qt] = S(Aa), [_, Pe] = S(!1), Ne = O(!1), [cr, se] = S(""), [Ke, ct] = S(""), [lr, ht] = S(""), [ce, Ft] = S(null), [zt, Te] = S(""), [xt, Er] = S(!1), [jr, In] = S({}), [On, Mn] = S({}), dr = O(/* @__PURE__ */ new Map()), Pn = O(null), Ur = O(null), Nr = O(null), Ht = O(0), Ar = O(0), qr = O(null), $n = JSON.stringify([
    ...new Set(
      (F == null ? void 0 : F.actions.flatMap(
        (a) => a.steps.flatMap((h) => h.tagIds)
      )) ?? []
    )
  ]);
  function Kr(a) {
    const h = Wi(a);
    qt(h), qa(h);
  }
  function Zi(a) {
    const h = a.shiftKey ? 40 : 16;
    let v = null;
    a.key === "ArrowLeft" && (v = Se + h), a.key === "ArrowRight" && (v = Se - h), a.key === "Home" && (v = gn), a.key === "End" && (v = hn), v !== null && (a.preventDefault(), a.stopPropagation(), Kr(v));
  }
  Q(() => {
    if (!Ke) return;
    const a = window.setTimeout(() => ct(""), 4e3);
    return () => window.clearTimeout(a);
  }, [Ke]), Q(() => {
    const a = JSON.parse($n);
    if (Mn({}), !a.length) return;
    const h = new AbortController();
    let v = !0;
    return Promise.all(
      a.map(async (q) => {
        var K;
        try {
          const T = await Y(`/api/tags/${q}`, {
            signal: h.signal
          });
          return [q, ((K = T.name) == null ? void 0 : K.trim()) || null];
        } catch {
          return [q, null];
        }
      })
    ).then((q) => {
      v && Mn(Object.fromEntries(q));
    }), () => {
      v = !1, h.abort();
    };
  }, [$n]), Q(() => {
    const a = F ? An(F.view.objectFilter) : [];
    if (In({}), !a.length) return;
    const h = new AbortController();
    let v = !0;
    return Promise.all(
      a.map(async (q) => {
        var K;
        try {
          const T = await Y(`/api/tags/${q}`, {
            signal: h.signal
          });
          return (K = T.name) != null && K.trim() ? [String(q), T.name] : null;
        } catch {
          return null;
        }
      })
    ).then((q) => {
      v && In(
        Object.fromEntries(q.filter((K) => K !== null))
      );
    }), () => {
      v = !1, h.abort();
    };
  }, [F == null ? void 0 : F.id, F == null ? void 0 : F.view.objectFilter]);
  const eo = jt(
    () => F ? qn(
      F.view.objectFilter,
      jr
    ) : (C == null ? void 0 : C.view.objectFilter) ?? {},
    [jr, C, F]
  ), Fn = Tt(async () => {
    g(!0), f("");
    try {
      const a = await Lo();
      r(a.reviews), c(a.storageKey), E(a.canWriteVideos ?? a.canWrite), R(a.canWriteAudios ?? !1), W(a.canWriteTags ?? !1), P(a.canReadTagGroups ?? !1), $(a.canConfigure ?? !0), ee(a.storageNotice ?? ""), ne && !a.reviews.some((h) => h.id === ne) && (nt(""), ai(""));
    } catch (a) {
      f(
        a instanceof Error ? a.message : "Could not load reviews."
      );
    } finally {
      g(!1);
    }
  }, [ne]);
  Q(() => {
    if (!b) {
      Z([]), Oe("");
      return;
    }
    const a = new AbortController();
    return Oe(""), Jo(a.signal).then(Z).catch((h) => {
      a.signal.aborted || Oe(
        h instanceof Error ? h.message : "Could not load tag groups."
      );
    }), () => a.abort();
  }, [b]), Q(() => {
    Fn();
  }, []), Q(() => {
    if (ne || t.length === 0) return;
    const a = new AbortController();
    ut({});
    for (const h of t)
      (ge(h) ? Rn(h, a.signal).then((q) => (q == null ? void 0 : q.length) === 0 ? { items: [], totalCount: 0 } : gr(Di(h, q), { ...h.view.filter, page: 1, perPage: 1 }, a.signal)) : Ce(h) === "tag" ? zn(
        h,
        $e({ ...h.view.filter, page: 1, perPage: 1 }),
        a.signal
      ) : gr(
        h,
        $e({ ...h.view.filter, page: 1, perPage: 1 }),
        a.signal
      )).then((q) => {
        a.signal.aborted || ut((K) => ({
          ...K,
          [h.id]: q.totalCount
        }));
      }).catch(() => {
        a.signal.aborted || ut((q) => ({ ...q, [h.id]: null }));
      });
    return () => a.abort();
  }, [ne, t]), li(() => {
    var a;
    ne || o || !Ge.current || (Ge.current = !1, (a = ae.current) == null || a.focus());
  }, [ne, o]);
  const Br = O(0), Rr = Tt(async () => {
    const a = ++Br.current;
    Ft(null), Te("");
    try {
      const h = await (it ? $i(y) : Pi(y));
      a === Br.current && Ft(h);
    } catch (h) {
      if (a !== Br.current) return;
      Ft(null), Te(
        "Tag assessment setup could not be checked. " + (h instanceof Error ? h.message : "Request failed.")
      );
    }
  }, [it, y]);
  Q(() => {
    Rr();
  }, [Rr]);
  const Lt = Tt(
    async (a, h, v = !1, q = !1) => {
      var pe;
      const K = ++Ht.current;
      (pe = qr.current) == null || pe.abort();
      const T = new AbortController();
      qr.current = T, h = $e(h);
      const D = Number(h.page);
      v && (h = { ...h, page: 1 }), Nt(h), Cr(v), We(!0), pt("");
      try {
        const X = (mt) => Ce(a) === "tag" ? zn(
          a,
          mt,
          T.signal
        ) : gr(
          a,
          mt,
          T.signal
        );
        let me = await X(h);
        const He = Math.max(
          1,
          Math.ceil(me.totalCount / Number(h.perPage))
        ), Ye = v ? He : Math.min(D, He);
        return Number(h.page) !== Ye && (h = { ...h, page: Ye }, me = await X(h)), K === Ht.current && (Qt(me), q && Rt(
          () => new Set(me.items.map((mt) => mt.id))
        ), Nt(h), st(h)), me;
      } catch (X) {
        throw K === Ht.current && pt(
          X instanceof Error ? X.message : "Could not load the review queue."
        ), X;
      } finally {
        K === Ht.current && We(!1);
      }
    },
    []
  );
  Q(() => {
    var h;
    if (Ar.current += 1, Ot.current = -1, Ht.current += 1, (h = qr.current) == null || h.abort(), Qe(!1), le(""), Je(!1), ze(/* @__PURE__ */ new Set()), gt.current.clear(), H(null), l(!1), Pe(!1), Ne.current = !1, se(""), ct(""), ht(""), Qt({ items: [], totalCount: 0 }), Wt(!1), !C || Ee) {
      We(!1);
      return;
    }
    let a = !0;
    return We(!0), (async () => {
      let v = L ?? C;
      we(null);
      let q = null;
      const K = new URLSearchParams(window.location.search);
      if (Ce(C) === "video" && Dr.some((X) => K.has(X)))
        try {
          const X = v;
          q = pn(X, K);
          const me = dt(X, q.query);
          (q.query.startFrom !== (X.view.startFrom ?? "end") || !yr(
            JSON.parse(lt(me)),
            JSON.parse(lt(dt(X, Zt(X))))
          )) && (v = me, we(v));
        } catch (X) {
          Wt(!0), pt(X instanceof Error ? X.message : "Could not read review URL."), We(!1);
          return;
        }
      let T = null;
      try {
        T = await jo(s, C.id);
      } catch (X) {
        a && (Je(!0), le(
          X instanceof Error ? X.message : "Could not load progress."
        ));
      }
      if (!a) return;
      const D = (T == null ? void 0 : T.signature) === lt(v) ? T : null, pe = q ? q.query.filter : D ? $e(D.filter) : Na(v.view.filter);
      Nt(pe), V(
        D ? oi(D.displayMode, Ce(C)) : ii(C)
      ), Me(
        D ? D.cardSize ?? Xr : Xr
      );
      try {
        const X = await Lt(
          v,
          pe,
          q ? q.startAtEnd : !D && v.view.startFrom !== "beginning",
          v.view.selectAllOnLoad === !0
        );
        if (!a) return;
        const me = Vn(
          X.items.map((He) => He.id),
          (D == null ? void 0 : D.focusedId) ?? null,
          (D == null ? void 0 : D.index) ?? 0
        );
        H(me), ke(me);
      } catch {
      }
      a && (Ot.current = Ct, Qe(!0));
    })(), () => {
      var v;
      a = !1, Ar.current++, Ht.current++, (v = qr.current) == null || v.abort();
    };
  }, [C == null ? void 0 : C.id, Ee, Ct]), Q(() => {
    !F || Ee || !k || B || ue || _ || Vt.current || Ot.current !== Ct || hr(F.id, {
      filter: ie,
      objectFilter: F.view.objectFilter,
      searchMode: F.view.searchMode,
      startFrom: F.view.startFrom ?? "end"
    });
  }, [F, Ee, k, B, ue, ie, _, Ct]);
  const oe = jt(
    () => _e.items.map((a) => a.id),
    [_e.items]
  );
  Q(() => {
    if (!k || !C || !s || B || ue || _ || (z == null ? void 0 : z.id) === C.id || te)
      return;
    const a = {
      version: 1,
      signature: lt(C),
      filter: ie,
      focusedId: Re,
      index: Math.max(0, oe.indexOf(Re ?? -1)),
      displayMode: J,
      cardSize: re,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        s + ":progress:" + C.id,
        JSON.stringify(a)
      );
    } catch {
    }
    if (G) return;
    let h = !0;
    const v = window.setTimeout(() => {
      Uo(s, C.id, a).catch((q) => {
        h && le(
          "Progress is kept in this browser, but account sync failed. " + (q instanceof Error ? q.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      h = !1, window.clearTimeout(v);
    };
  }, [
    k,
    s,
    C,
    B,
    ue,
    _,
    ie,
    Re,
    oe,
    J,
    re,
    z,
    G,
    te
  ]);
  const to = _e.items.find((a) => a.id === Re) ?? null, Vr = j === "video" ? to : null;
  De && Vr && (M.current = Vr);
  const _t = Vr ?? (De ? M.current : null), ro = Gn(ve, Re), no = oe.length > 0 && oe.every((a) => ve.has(a)), Gr = ve.size > 0 ? `${ve.size} selected ${j}${ve.size === 1 ? "" : "s"}` : Re == null ? `no ${j}` : `focused ${j}`, ke = Tt((a, h = !0) => {
    a != null && window.requestAnimationFrame(() => {
      const v = dr.current.get(a);
      v == null || v.focus({ preventScroll: !0 }), h && (v == null || v.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  Q(() => {
    k && !m.current && ke(he.current);
  }, [k, ke]), Q(() => {
    B || !oe.length || (he.current == null || !oe.includes(he.current)) && (H(oe[0]), m.current || ke(oe[0]));
  }, [ke, oe, B]);
  const Rt = Tt(
    (a) => {
      ze((h) => {
        const v = a(h);
        for (const q of /* @__PURE__ */ new Set([...h, ...v]))
          h.has(q) !== v.has(q) && gt.current.set(
            q,
            (gt.current.get(q) ?? 0) + 1
          );
        return v;
      });
    },
    []
  ), Jr = Tt(
    (a) => {
      if (!oe.length) return;
      const h = Math.max(
        0,
        oe.indexOf(he.current ?? oe[0])
      ), v = oe[Math.max(0, Math.min(oe.length - 1, h + a))];
      H(v), m.current || ke(v);
    },
    [ke, oe]
  ), Qr = Tt(
    async (a) => {
      const h = "steps" in a ? a.steps.length > 0 : a.effect.mode !== "SKIP", v = "effect" in a && a.effect.mode === "SET_TAG_GROUP" ? a.effect.tagGroupId : null, q = v != null && (!b || !x.some((fe) => fe.id === v)), K = "effect" in a && h && !b, T = Gn(
        $t.current,
        he.current
      );
      if (!C || Ne.current || B || ue) return;
      const D = h && !at ? `${Mt} write permission is required to apply ${a.label}.` : K || q ? `${a.label} needs a tag group that is unavailable.` : vt(a) && (ce == null ? void 0 : ce.kind) !== "ready" ? `Set up tag assessments before applying ${a.label}.` : T.length ? "" : `Select or focus a ${j} before applying ${a.label}.`;
      if (D) {
        ht(D);
        return;
      }
      const pe = ++Ar.current, X = C.id, me = [...oe], He = _e, Ye = he.current, mt = new Set($t.current), Dn = new Map(
        T.map((fe) => [fe, gt.current.get(fe) ?? 0])
      ), Yt = () => pe === Ar.current && C.id === X;
      Ne.current = !0, Pe(!0), se(
        $t.current.size ? `${T.length} selected ${j}s` : `the focused ${j}`
      ), ct(""), ht("");
      const jn = He.items.filter(
        (fe) => !T.includes(fe.id)
      ), fo = jn.map((fe) => fe.id), Un = Jn(
        me,
        fo,
        Ye,
        T.includes(Ye ?? -1)
      );
      Qt({
        items: jn,
        totalCount: He.totalCount
      }), ze((fe) => {
        const Be = new Set(fe);
        for (const Xe of T) Be.delete(Xe);
        return Be;
      }), H(Un), m.current || ke(Un);
      let zr = !1;
      try {
        if ("effect" in a ? await ra(a, T) : await xi(y, a, T), zr = !0, !Yt()) return;
        ze((fe) => {
          const Be = new Set(fe);
          for (const Xe of T)
            (gt.current.get(Xe) ?? 0) === Dn.get(Xe) && Be.delete(Xe);
          return Be;
        }), ct(
          `${a.label}: ${T.length} ${j}${T.length === 1 ? "" : "s"} ${h ? "updated" : "skipped"}.`
        );
      } catch (fe) {
        if (!Yt()) return;
        Qt(He), ze((Be) => {
          const Xe = new Set(Be);
          for (const Ze of T)
            mt.has(Ze) && (gt.current.get(Ze) ?? 0) === Dn.get(Ze) && Xe.add(Ze);
          return Xe;
        }), H(Ye), m.current || ke(Ye), ht(
          fe instanceof Error ? fe.message : "Action failed."
        );
      }
      try {
        if (await zo(a), !Yt()) return;
        const fe = new Set(T), Be = sr && me.length > 0 && me.every((bt) => fe.has(bt)), Xe = await Lt(C, ie, !1, Be);
        if (!Yt()) return;
        let Ze = Xe.items.map((bt) => bt.id);
        if (!Ze.length && Xe.totalCount > 0 && Number(ie.page) > 1) {
          const bt = Math.max(1, Number(ie.page) - 1), kr = { ...ie, page: bt };
          Nt(kr), Ze = (await Lt(
            C,
            kr,
            !1,
            Be
          )).items.map((Hr) => Hr.id), ze(
            (Hr) => new Set([...Hr].filter((po) => Ze.includes(po)))
          );
          const Bn = Ze.at(-1) ?? null;
          H(Bn), m.current || ke(Bn);
        } else {
          ze(
            (kr) => new Set([...kr].filter((Kn) => Ze.includes(Kn)))
          );
          const bt = Jn(
            me,
            Ze,
            Ye,
            zr && T.includes(Ye ?? -1)
          );
          H(bt), m.current && bt == null && l(!1), m.current || ke(bt);
        }
      } catch (fe) {
        Yt() && ht(
          (Be) => `${Be ? `${Be} ` : ""}${zr ? "The action completed, but " : ""}the queue could not be refreshed. ${fe instanceof Error ? fe.message : "Refresh failed."}`
        );
      } finally {
        Yt() && (Ne.current = !1, Pe(!1), se(""), Vt.current && (Vt.current = !1, nt(Zr()), Et((fe) => fe + 1)));
      }
    },
    [
      at,
      b,
      x,
      j,
      ce,
      Lt,
      ie,
      ke,
      oe,
      _e,
      B,
      ue,
      C
    ]
  );
  function io() {
    var v;
    if (J === "list") return 1;
    const a = (v = Pn.current) == null ? void 0 : v.firstElementChild, h = a ? getComputedStyle(a).gridTemplateColumns : "";
    return Math.max(1, h.split(" ").filter(Boolean).length);
  }
  const xn = O(() => {
  });
  xn.current = (a) => {
    var D;
    if (Ee || a.defaultPrevented || a.repeat || a.ctrlKey || a.altKey || a.metaKey || ye) return;
    const h = a.target, v = h instanceof Node && ((D = Ur.current) == null ? void 0 : D.contains(h)) === !0, q = h === document.body || h === document.documentElement;
    if (!v && !q) return;
    if (De && a.key === "Escape") {
      tt(a), l(!1), ke(he.current);
      return;
    }
    if (!Oo(h)) return;
    const K = qi(h);
    if (a.key === "Escape") {
      tt(a), Rt(() => /* @__PURE__ */ new Set());
      return;
    }
    const T = (C == null ? void 0 : C.actions.findIndex(
      (pe, X) => kt(pe, X) === a.key.toLowerCase()
    )) ?? -1;
    if (T >= 0 && (C != null && C.actions[T])) {
      tt(a), !_ && !B && Qr(C.actions[T]);
      return;
    }
    if (!De && a.key === " " && K) {
      tt(a), Re != null && Rt((pe) => Or(pe, Re));
      return;
    }
    if (!De && a.key.toLowerCase() === "a") {
      tt(a), Rt(
        (pe) => Qn(pe, oe)
      );
      return;
    }
    if (!(_ || B) && !De && a.key === "Enter" && Re != null && K) {
      tt(a), j === "tag" ? window.open(`/tag/${Re}`, "_blank", "noopener,noreferrer") : l(!0);
      return;
    }
  }, Q(() => {
    const a = (h) => xn.current(h);
    return document.addEventListener("keydown", a), () => document.removeEventListener("keydown", a);
  }, []);
  const Ln = O(
    () => {
    }
  );
  Ln.current = (a) => {
    var T;
    if (Ee || ye || De || _ || B || !oe.length || a.defaultPrevented || a.repeat || a.ctrlKey || a.altKey || a.metaKey)
      return;
    const h = a.target, v = h instanceof Node && ((T = Ur.current) == null ? void 0 : T.contains(h)) === !0, q = h === document.body || h === document.documentElement;
    if (!v && !q || !a.key.startsWith("Arrow") || !Mo(h)) return;
    const K = Po(a.key, io());
    K && (a.preventDefault(), v ? a.stopImmediatePropagation() : a.stopPropagation(), Jr(K));
  }, Q(() => {
    const a = (h) => Ln.current(h);
    return document.addEventListener("keydown", a), () => document.removeEventListener("keydown", a);
  }, []);
  function ur(a) {
    ft(null), Ue(0), nt(a), ai(a);
  }
  function oo() {
    Ge.current = !0, ut({}), ur("");
  }
  async function Wr(a) {
    if (!s) return !1;
    const h = a.map(Ia);
    try {
      await Do(s, h);
    } catch (q) {
      throw q;
    }
    r(h), ne && !h.some((q) => q.id === ne) && ur("");
    const v = h.find((q) => q.id === ne);
    return v && ft(null), v && L && JSON.stringify(v) !== JSON.stringify(L) && (v.view.displayMode !== L.view.displayMode && V(ii(v)), lt(v) !== lt(L) && (we(null), Ce(v) === "video" && hr(v.id, {
      filter: $e(v.view.filter),
      objectFilter: v.view.objectFilter,
      searchMode: v.view.searchMode,
      startFrom: v.view.startFrom ?? "end"
    }), Ee || Tr(
      v,
      $e({ ...v.view.filter, page: ie.page })
    ))), !0;
  }
  if (o)
    return /* @__PURE__ */ n(si, { label: "Loading reviews…" });
  if (u)
    return /* @__PURE__ */ d(Ae, { children: [
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-button",
          onClick: () => void Da().catch(
            (a) => f(
              "Could not export browser reviews. " + (a instanceof Error ? a.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ n(
        ci,
        {
          message: u,
          onRetry: () => void Fn()
        }
      )
    ] });
  return /* @__PURE__ */ d("div", { ref: Ur, className: "data-quality-page", children: [
    /* @__PURE__ */ d("header", { className: "data-quality-header", children: [
      C && /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: _,
          onClick: oo,
          children: /* @__PURE__ */ n(bi, {})
        }
      ),
      /* @__PURE__ */ d("div", { className: "dq-header-copy", children: [
        /* @__PURE__ */ n("h1", { children: (C == null ? void 0 : C.name) ?? "Data Quality" }),
        (C == null ? void 0 : C.description) && /* @__PURE__ */ n("p", { className: "dq-review-description", children: C.description })
      ] }),
      C && L && /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          className: "dq-header-action",
          "aria-label": "Edit review",
          title: "Edit review",
          disabled: _ || B || !p,
          onClick: () => {
            Ee ? Ue((a) => a + 1) : (Ie(!0), xe(!0));
          },
          children: /* @__PURE__ */ n(yi, {})
        }
      ),
      /* @__PURE__ */ n(
        "button",
        {
          className: "dq-header-action",
          type: "button",
          "aria-label": "Manage reviews",
          title: "Manage reviews",
          disabled: _ || B || !p,
          onClick: () => {
            Ie(!1), xe(!0);
          },
          children: /* @__PURE__ */ n(vo, {})
        }
      )
    ] }),
    I && /* @__PURE__ */ n("p", { className: "dq-status", children: I }),
    rr && (ce == null ? void 0 : ce.kind) === "missing" && /* @__PURE__ */ d("div", { role: "status", className: "dq-status", children: [
      ce.message,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: xt,
          onClick: () => {
            Er(!0), Te(""), (it ? Xo(y) : Yo(y)).then(Rr).catch(
              (a) => Te(
                `Could not create the ${it ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (a instanceof Error ? a.message : "Request failed.")
              )
            ).finally(() => Er(!1));
          },
          children: xt ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    rr && ((ce == null ? void 0 : ce.kind) === "incompatible" || zt) && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ n(rn, {}),
      zt || (ce == null ? void 0 : ce.message),
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          disabled: xt,
          onClick: () => {
            Er(!0), Rr().finally(
              () => Er(!1)
            );
          },
          children: xt ? "Checking…" : "Check again"
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
            const a = localStorage.getItem("page-videos") ?? "[]", h = URL.createObjectURL(
              new Blob([a], { type: "application/json" })
            ), v = document.createElement("a");
            v.href = h, v.download = "data-quality-unassigned-legacy-reviews.json", v.click(), URL.revokeObjectURL(h);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    G && /* @__PURE__ */ d("p", { role: "alert", children: [
      G,
      " ",
      /* @__PURE__ */ n(
        "button",
        {
          type: "button",
          onClick: () => {
            le(""), Je(!1);
          },
          children: te ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    F && /* @__PURE__ */ d("label", { className: "dq-layout-control", children: [
      "Review layout",
      /* @__PURE__ */ d(
        "select",
        {
          "aria-label": "Review layout",
          value: nr,
          disabled: _ || B || ye,
          onChange: (a) => ft({ id: F.id, mode: a.target.value }),
          children: [
            /* @__PURE__ */ n("option", { value: "single", children: "Single video" }),
            /* @__PURE__ */ n("option", { value: "multiple", children: "Multiple videos" })
          ]
        }
      )
    ] }),
    C && L && !Ee && /* @__PURE__ */ d("section", { className: "dq-queue-toolbar", "aria-label": "Video queue toolbar", children: [
      /* @__PURE__ */ n(
        "div",
        {
          className: `dq-native-toolbar-host${_ || B ? " dq-native-toolbar-disabled" : ""}`,
          "aria-disabled": _ || B || void 0,
          inert: _ || B ? !0 : void 0,
          children: /* @__PURE__ */ n(
            mr,
            {
              filter: ue ? ar : ie,
              onFilterChange: ao,
              totalCount: _e.totalCount,
              sortOptions: j === "tag" ? gi : bn,
              showSearch: !0,
              showSort: !0,
              displayMode: J,
              onDisplayModeChange: (a) => V(oi(a, j)),
              availableDisplayModes: j === "tag" ? ["grid", "list"] : ["grid", "wall"],
              zoomLevel: (re - 225) / 50,
              onZoomChange: (a) => Me(Math.round(225 + a * 50)),
              cardSizeEntityType: j === "tag" ? "tags" : "videos",
              criteriaDefinitions: j === "tag" ? hi : Lr,
              customFieldEntityType: j === "video" ? "video" : void 0,
              objectFilter: eo,
              onObjectFilterChange: (a) => {
                !_ && !B && (Gt.current = j === "video" ? Li(
                  a,
                  jr,
                  C.view.objectFilter
                ) : a);
              },
              showPagingControls: !1
            }
          )
        }
      ),
      (z == null ? void 0 : z.id) === ne && /* @__PURE__ */ d("div", { className: "dq-review-defaults", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Save changes to review filters",
            title: "Save changes to review filters",
            disabled: _ || B || !p,
            onClick: co,
            children: /* @__PURE__ */ n(yn, {})
          }
        ),
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": "Reset to default review filters",
            title: "Reset to default review filters",
            disabled: _ || B,
            onClick: so,
            children: /* @__PURE__ */ n(mi, {})
          }
        )
      ] })
    ] }),
    C ? Ee ? /* @__PURE__ */ n(ya, { review: C, canWrite: U ? N : ir, canAssess: (ce == null ? void 0 : ce.kind) === "ready" && ir, onBusy: Pe, editRequest: de, renderRuleEditor: (a, h, v) => /* @__PURE__ */ n(Yi, { workspace: !0, draft: a, entityTypeLocked: !0, tagGroups: x, saving: v, setDraft: (q) => h(q), onSave: () => {
    }, onCancel: () => {
    } }), onSaveDefaults: p ? (a) => Wr(t.map((h) => h.id === a.id ? a : h)) : void 0 }, C.id) : /* @__PURE__ */ d(Ae, { children: [
      F && Jt.error && /* @__PURE__ */ n("p", { role: "alert", children: Jt.error }),
      F && /* @__PURE__ */ n(
        Sa,
        {
          videos: _e.items,
          review: F,
          trees: Jt.ids,
          disabled: _ || B,
          onChoose: (a) => {
            const h = Ca(F, a);
            we(h), Tr(h, { ...ie, page: 1 });
          }
        }
      ),
      lr && !De && /* @__PURE__ */ d("div", { role: "alert", className: "dq-alert", children: [
        /* @__PURE__ */ n(rn, {}),
        lr
      ] }),
      Ke && /* @__PURE__ */ n("p", { role: "status", "aria-live": "polite", className: "dq-status dq-toast", children: Ke }),
      _n("top"),
      /* @__PURE__ */ d(
        "div",
        {
          className: "dq-workspace",
          style: {
            "--dq-sidebar-width": `${Se}px`
          },
          children: [
            /* @__PURE__ */ d("main", { children: [
              B && !_e.items.length && /* @__PURE__ */ n(si, { label: "Loading review queue…" }),
              ue && !B && /* @__PURE__ */ n(
                ci,
                {
                  message: ue,
                  retryLabel: At ? "Reset to review defaults" : "Retry",
                  onRetry: () => {
                    if (At && L && Ce(L) === "video") {
                      const a = Zt(L);
                      hr(L.id, { ...a, filter: { ...a.filter, page: void 0 } }), Et((h) => h + 1);
                      return;
                    }
                    Lt(
                      C,
                      ie,
                      Pt,
                      sr
                    ).catch(() => {
                    });
                  }
                }
              ),
              !_ && !B && !ue && !_e.items.length && /* @__PURE__ */ d("div", { className: "dq-empty", children: [
                /* @__PURE__ */ n(nn, {}),
                /* @__PURE__ */ d("p", { children: [
                  "No ",
                  j,
                  "s match this review."
                ] })
              ] }),
              !!_e.items.length && /* @__PURE__ */ n("div", { ref: Pn, children: /* @__PURE__ */ n(
                "div",
                {
                  className: J === "list" ? "dq-tag-list" : "dq-grid",
                  style: {
                    "--dq-card-width": `${re}px`
                  },
                  children: _e.items.map(uo)
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
                "aria-valuemin": gn,
                "aria-valuemax": hn,
                "aria-valuenow": Se,
                "aria-valuetext": `${Se} pixels wide`,
                title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
                onPointerDown: (a) => {
                  Nr.current = {
                    pointerId: a.pointerId,
                    startX: a.clientX,
                    startWidth: Se
                  }, a.currentTarget.setPointerCapture(a.pointerId);
                },
                onPointerMove: (a) => {
                  const h = Nr.current;
                  (h == null ? void 0 : h.pointerId) === a.pointerId && a.currentTarget.hasPointerCapture(a.pointerId) && Kr(
                    h.startWidth + h.startX - a.clientX
                  );
                },
                onPointerUp: () => {
                  Nr.current = null;
                },
                onPointerCancel: () => {
                  Nr.current = null;
                },
                onKeyDown: Zi,
                onDoubleClick: () => Kr(kn),
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
                  disabled: !oe.length,
                  onClick: () => Rt(
                    (a) => Qn(a, oe)
                  ),
                  children: [
                    no ? "Clear selection" : "Select all on page",
                    /* @__PURE__ */ n("kbd", { "aria-hidden": "true", children: "A" })
                  ]
                }
              ),
              /* @__PURE__ */ n("strong", { children: ve.size > 0 ? Gr : Re == null ? "Nothing to apply to" : `Applies to the ${Gr}` }),
              C.actions.map((a, h) => {
                const v = "steps" in a ? a.steps.length > 0 : a.effect.mode !== "SKIP", q = "effect" in a && a.effect.mode === "SET_TAG_GROUP" ? a.effect.tagGroupId : null, K = q != null ? x.find((D) => D.id === q) : void 0, T = q != null && !K;
                return /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    disabled: _ || B || !!ue || v && !at || "effect" in a && v && (!b || T) || vt(a) && (ce == null ? void 0 : ce.kind) !== "ready" || !ro.length,
                    onClick: () => void Qr(a),
                    children: [
                      /* @__PURE__ */ d("span", { className: "dq-action-copy", children: [
                        /* @__PURE__ */ n("span", { className: "dq-action-label", children: a.label }),
                        "effect" in a ? /* @__PURE__ */ n("small", { children: a.effect.mode === "SKIP" ? "Skip" : a.effect.mode === "CLEAR_TAG_GROUP" ? "Set Ungrouped" : K ? `Assign ${K.name}` : "Unavailable tag group" }) : a.steps.length ? /* @__PURE__ */ n("span", { className: "dq-action-steps", children: a.steps.flatMap(
                          (D, pe) => D.tagIds.map((X, me) => {
                            const He = On[X] === void 0 ? "Tag" : On[X] ?? "Unavailable tag", Ye = Hi(D, He), mt = Ra(D, He);
                            return /* @__PURE__ */ n(
                              "span",
                              {
                                className: "dq-step-summary",
                                "data-step-tone": zi(D.mode),
                                "aria-label": mt,
                                title: `Step ${pe + 1}: ${mt}`,
                                children: Ye
                              },
                              `${pe}-${X}-${me}`
                            );
                          })
                        ) }) : /* @__PURE__ */ n("small", { children: "Skip" })
                      ] }),
                      kt(a, h) && /* @__PURE__ */ n("kbd", { children: kt(a, h) })
                    ]
                  },
                  a.id
                );
              }),
              !C.actions.length && /* @__PURE__ */ n("p", { children: "This review has no actions." }),
              !at && /* @__PURE__ */ d("p", { children: [
                Mt,
                " write permission is required to apply actions."
              ] }),
              j === "tag" && qe && /* @__PURE__ */ d("p", { children: [
                "Tag groups are unavailable. ",
                qe
              ] }),
              _ && /* @__PURE__ */ d("p", { role: "status", children: [
                /* @__PURE__ */ n(vi, { className: "dq-spin" }),
                " Applying action to",
                " ",
                cr,
                "…"
              ] }),
              /* @__PURE__ */ d("p", { className: "dq-shortcuts", children: [
                "←→↑↓ move · space select · enter ",
                j === "tag" ? "open" : "preview",
                " · Q–P apply · A toggle shown · Esc clear"
              ] })
            ] })
          ]
        }
      ),
      _n("bottom")
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
                  ref: ae,
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
                    value: It,
                    onChange: (a) => Bt(
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
                  "aria-label": je === "asc" ? "Ascending" : "Descending",
                  title: je === "asc" ? "Ascending" : "Descending",
                  onClick: () => Ve(
                    (a) => a === "asc" ? "desc" : "asc"
                  ),
                  children: /* @__PURE__ */ n(
                    wi,
                    {
                      className: je === "asc" ? "dq-sort-ascending" : "dq-sort-descending"
                    }
                  )
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-browser-list", children: or.map((a) => {
            const h = Fe[a.id], v = Ce(a), q = v === "tag" ? "tag" : ge(a) ? St(pr(v)).queue : St(pr(v)).one;
            return /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                disabled: _,
                onClick: () => ur(a.id),
                children: [
                  /* @__PURE__ */ d("span", { className: "dq-review-browser-summary", children: [
                    /* @__PURE__ */ d("span", { className: "dq-review-title", children: [
                      /* @__PURE__ */ n(Gi, { entityType: v }),
                      /* @__PURE__ */ n("strong", { children: a.name })
                    ] }),
                    /* @__PURE__ */ n(
                      "span",
                      {
                        className: "dq-review-count",
                        "aria-label": h === void 0 ? `Counting matching ${q}s` : h === null ? `Matching ${q} count unavailable` : `${h.toLocaleString()} matching ${h === 1 ? q : `${q}s`}`,
                        children: h === void 0 ? "…" : h === null ? "—" : h.toLocaleString()
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
      /* @__PURE__ */ n(nn, {}),
      /* @__PURE__ */ n("p", { children: "No saved reviews are available in this browser." })
    ] }),
    De && _t && F && /* @__PURE__ */ n(
      $a,
      {
        video: _t,
        review: F,
        targetLabel: Gr,
        pending: _,
        refreshing: B || !!ue,
        error: lr,
        canWrite: w,
        assessmentReady: (ce == null ? void 0 : ce.kind) === "ready",
        selected: ve.has(_t.id),
        hasPrevious: oe.indexOf(_t.id) > 0,
        hasNext: oe.indexOf(_t.id) >= 0 && oe.indexOf(_t.id) < oe.length - 1,
        onToggleSelected: () => Rt((a) => Or(a, _t.id)),
        onPrevious: () => Jr(-1),
        onNext: () => Jr(1),
        onClose: () => {
          l(!1), ke(he.current);
        },
        onAction: Qr
      }
    ),
    ye && /* @__PURE__ */ n(
      Fa,
      {
        reviews: t,
        activeReview: L,
        tagGroups: x,
        initialEdit: Le,
        onSave: Wr,
        onChoose: ur,
        onEditWorkspace: (a) => {
          a !== ne && ur(a), ft({ id: a, mode: "single" }), Ue((h) => h + 1), xe(!1);
        },
        onClose: () => {
          xe(!1), Le && ke(he.current, !1);
        }
      }
    )
  ] });
  async function Tr(a, h, v = !1) {
    const q = he.current, K = Math.max(0, oe.indexOf(q ?? -1));
    try {
      const D = (await Lt(
        a,
        h,
        v,
        a.view.selectAllOnLoad === !0
      )).items.map((X) => X.id);
      ze(
        (X) => new Set([...X].filter((me) => D.includes(me)))
      );
      const pe = Vn(D, q, K);
      H(pe), m.current || ke(pe, !1);
    } catch {
    }
  }
  function ao(a) {
    const h = Gt.current;
    if (Gt.current = null, _ || B || !C || !L) return;
    const v = h ?? C.view.objectFilter, q = yr(
      v,
      L.view.objectFilter
    ) ? L.view.objectFilter : v, K = $e({ ...a, page: 1 }), T = {
      ...C,
      view: {
        ...C.view,
        filter: K,
        objectFilter: q
      }
    }, D = lt(T) !== lt(L), pe = D ? T : L;
    we(D ? T : null), ct(D ? "" : "Review queue defaults restored."), Tr(pe, K, !0);
  }
  function so() {
    if (_ || B || !L) return;
    Gt.current = null;
    const a = $e({
      ...L.view.filter,
      page: 1
    });
    we(null), ct("Review queue defaults restored."), Tr(
      L,
      a,
      L.view.startFrom !== "beginning"
    );
  }
  function co() {
    _ || B || !C || !L || !p || Wr(
      t.map(
        (a) => a.id === ne ? {
          ...a,
          view: {
            ...C.view,
            filter: { ...ie, page: 1 }
          }
        } : a
      )
    ).then(() => {
      we(null), ct("Queue saved to this review.");
    }).catch(
      (a) => ht(
        a instanceof Error ? a.message : "Could not save queue."
      )
    );
  }
  function lo() {
    ze(/* @__PURE__ */ new Set()), gt.current.clear(), H(null);
  }
  function _n(a) {
    return C ? /* @__PURE__ */ n(
      "fieldset",
      {
        className: "dq-pagination-row",
        disabled: _ || B,
        "aria-label": `Review queue pagination ${a}`,
        children: /* @__PURE__ */ n(
          fi,
          {
            filter: {
              ...ie,
              page: Number(ie.page) || 1,
              perPage: Number(ie.perPage) || 40
            },
            totalCount: _e.totalCount,
            className: "dq-pagination",
            ariaLabel: `Review queue pages ${a}`,
            onFilterChange: (h) => {
              _ || B || h.page === Number(ie.page) || ka(
                { ...ie, page: h.page },
                C,
                (v, q) => Lt(v, q, !1, sr),
                lo
              );
            }
          }
        )
      }
    ) : null;
  }
  function uo(a) {
    var v, q, K;
    if (j === "tag") {
      const T = a;
      return /* @__PURE__ */ n(
        Oa,
        {
          tag: T,
          displayMode: J === "list" ? "list" : "grid",
          focused: T.id === Re,
          selected: ve.has(T.id),
          setRef: (D) => {
            D ? dr.current.set(T.id, D) : dr.current.delete(T.id);
          },
          onFocus: () => H(T.id),
          onToggle: () => {
            Rt((D) => Or(D, T.id)), ke(T.id, !1);
          },
          onOpen: () => window.open(`/tag/${T.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        T.id
      );
    }
    const h = a;
    return /* @__PURE__ */ n(
      Ma,
      {
        video: va(h, F, Jt.ids),
        showTagBins: ((q = (v = F == null ? void 0 : F.presentation) == null ? void 0 : v.annotations) == null ? void 0 : q.includes("tags")) && !!((K = F.presentation.annotationParents) != null && K.length),
        displayMode: J,
        focused: h.id === Re,
        selected: ve.has(h.id),
        setRef: (T) => {
          T ? dr.current.set(h.id, T) : dr.current.delete(h.id);
        },
        onFocus: () => H(h.id),
        onToggle: () => Rt((T) => Or(T, h.id)),
        onPreview: () => {
          H(h.id), l(!0);
        },
        onNavigate: e
      },
      h.id
    );
  }
}
function ka(e, t, r, i) {
  i(), r(t, e).catch(() => {
  });
}
function Or(e, t) {
  const r = new Set(e);
  return r.has(t) ? r.delete(t) : r.add(t), r;
}
function Ia(e) {
  var r;
  if (((r = e.presentation) == null ? void 0 : r.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Oa({
  tag: e,
  displayMode: t,
  focused: r,
  selected: i,
  setRef: s,
  onFocus: c,
  onToggle: o,
  onOpen: g,
  onNavigate: u
}) {
  return /* @__PURE__ */ n(
    "article",
    {
      ref: s,
      tabIndex: 0,
      "aria-current": r ? "true" : void 0,
      "aria-label": `${e.name}${i ? ", selected" : ""}`,
      onFocus: c,
      onClick: (f) => {
        c(), f.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${r ? "focused" : ""} ${i ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ n(
        yo,
        {
          tag: e,
          selected: i,
          onSelect: o,
          onClick: g,
          onNavigate: u
        }
      ) : /* @__PURE__ */ d("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            "aria-label": i ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": i,
            onClick: (f) => {
              f.stopPropagation(), o();
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
function Ma({
  video: e,
  showTagBins: t,
  displayMode: r,
  focused: i,
  selected: s,
  setRef: c,
  onFocus: o,
  onToggle: g,
  onPreview: u,
  onNavigate: f
}) {
  var W, b;
  const w = Ji(e), E = O(null), A = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, R = !!(A.date || A.studioName), N = !!(A.performers.length || A.tags.length);
  return li(() => {
    const P = E.current;
    if (!P) return;
    const x = P.querySelector(
      `a[href="/video/${e.id}"]`
    ), Z = P.querySelector(".card-title"), qe = `dq-card-title-${e.id}`;
    Z && (Z.id = qe), x && (x.target = "_blank", x.rel = "noreferrer", x.removeAttribute("aria-label"), x.setAttribute("aria-labelledby", qe), x.classList.add("dq-card-link"));
    const Oe = P.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    Oe && Oe.setAttribute(
      "aria-label",
      s ? `Deselect ${w}` : `Select ${w}`
    );
    const p = P.querySelector(
      'button[title="Quick View"]'
    );
    p && p.setAttribute("aria-label", `Preview ${w}`);
  }), /* @__PURE__ */ d(
    "article",
    {
      ref: (P) => {
        E.current = P, c(P);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${w}${s ? ", selected" : ""}`,
      onFocus: o,
      onClick: (P) => {
        o(), P.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${r} ${R ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${s ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ n(
          wo,
          {
            video: A,
            selected: s,
            onSelect: g,
            onNavigate: f,
            onQuickView: u,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ d("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (W = e.tags) == null ? void 0 : W.map((P) => /* @__PURE__ */ n("span", { children: P.name }, P.id)),
          !((b = e.tags) != null && b.length) && /* @__PURE__ */ n("small", { children: "No matching tags" })
        ] }),
        r === "wall" && /* @__PURE__ */ n(Pa, { video: e })
      ]
    }
  );
}
function Pa({ video: e }) {
  const t = O(null), r = O(null), [i, s] = S(!1), [c, o] = S(!1), [g, u] = S(!1);
  return Q(() => {
    const f = t.current;
    if (!f || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      s(!0), o(!0);
      return;
    }
    const w = new IntersectionObserver(
      ([A]) => s(A.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 }
    ), E = new IntersectionObserver(
      ([A]) => o(A.isIntersecting && A.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    return w.observe(f), E.observe(f), () => {
      w.disconnect(), E.disconnect();
    };
  }, [e.id, e.files.length]), Q(() => {
    if (!i) {
      u(!1);
      return;
    }
    const f = new AbortController();
    return Y(Wo(e.id), {
      signal: f.signal
    }).then((w) => {
      f.signal.aborted || u(w.available === !0);
    }).catch(() => {
      f.signal.aborted || u(!1);
    }), () => f.abort();
  }, [i, e.id]), Q(() => {
    const f = r.current;
    f && (c ? Promise.resolve(f.play()).catch(() => {
    }) : f.pause());
  }, [g, c]), /* @__PURE__ */ n("div", { ref: t, className: "dq-wall-autoplay", "aria-hidden": "true", children: g && /* @__PURE__ */ n(
    "video",
    {
      ref: r,
      src: Qo(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function $a({
  video: e,
  review: t,
  targetLabel: r,
  pending: i,
  refreshing: s,
  error: c,
  canWrite: o,
  assessmentReady: g,
  selected: u,
  hasPrevious: f,
  hasNext: w,
  onToggleSelected: E,
  onPrevious: A,
  onNext: R,
  onClose: N,
  onAction: W
}) {
  const b = O(null), P = O(null), x = e.files[0], Z = Ji(e);
  Q(() => {
    var $;
    const p = document.body.style.overflow;
    return document.body.style.overflow = "hidden", ($ = b.current) == null || $.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = p;
    };
  }, []);
  function qe(p) {
    var ee, G, le;
    if (p.key !== "Tab") return;
    const $ = [
      ...((ee = b.current) == null ? void 0 : ee.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((te) => te.offsetParent !== null);
    if (!$.length) {
      p.preventDefault(), (G = b.current) == null || G.focus();
      return;
    }
    const I = $.indexOf(
      document.activeElement
    );
    p.shiftKey && I <= 0 ? (p.preventDefault(), (le = $.at(-1)) == null || le.focus()) : !p.shiftKey && I === $.length - 1 && (p.preventDefault(), $[0].focus());
  }
  function Oe(p) {
    if (p.defaultPrevented || p.ctrlKey || p.metaKey || p.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const $ = p.key === "ArrowLeft" || p.key === "ArrowRight";
    if (p.altKey && !$) return;
    const I = P.current, ee = p.currentTarget.querySelector("video");
    if (p.key === "Enter" || p.key === "Escape")
      p.repeat || N();
    else if (p.key === " " && I)
      p.repeat || I.toggle();
    else if ($ && I)
      I.seekBy(
        (p.key === "ArrowLeft" ? -1 : 1) * (p.shiftKey ? 5 : p.altKey ? 10 : 60)
      );
    else if ((p.key === "," || p.key === ".") && I) {
      const G = [x == null ? void 0 : x.duration, ee == null ? void 0 : ee.duration].find(
        (te) => te != null && Number.isFinite(te) && te > 0
      ) ?? 0, le = e.parentVideoId != null ? (e.clipEndSec ?? G) - (e.clipStartSec ?? 0) : G;
      Number.isFinite(le) && le > 0 && I.seekBy((p.key === "," ? -1 : 1) * le * 0.1);
    } else if (p.key.toLowerCase() === "n" || p.key.toLowerCase() === "m")
      !p.repeat && !i && !s && (p.key.toLowerCase() === "n" && f && A(), p.key.toLowerCase() === "m" && w && R());
    else if (p.key === "ArrowUp" && ee)
      ee.volume = Math.min(1, ee.volume + 0.1);
    else if (p.key === "ArrowDown" && ee)
      ee.volume = Math.max(0, ee.volume - 0.1);
    else return;
    tt(p);
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: b,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${Z}`,
      className: "dq-preview",
      onKeyDown: qe,
      onKeyDownCapture: Oe,
      onMouseDown: (p) => {
        p.target === p.currentTarget && N();
      },
      children: /* @__PURE__ */ d("div", { className: "dq-preview-shell", children: [
        /* @__PURE__ */ d("header", { "data-review-player-controls": !0, children: [
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Previous review video",
              disabled: !f || i || s,
              onClick: A,
              children: /* @__PURE__ */ n(bi, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Next review video",
              disabled: !w || i || s,
              onClick: R,
              children: /* @__PURE__ */ n(wi, {})
            }
          ),
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ n("h2", { children: Z }),
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
              onClick: E,
              disabled: s,
              children: u ? "Selected" : "Select"
            }
          ),
          /* @__PURE__ */ n(
            "a",
            {
              href: `/video/${e.id}`,
              target: "_blank",
              rel: "noreferrer",
              className: "dq-details-link",
              "aria-label": `Open ${Z} details in new tab`,
              title: "Open video details in new tab",
              children: /* @__PURE__ */ n(Eo, {})
            }
          ),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              onClick: N,
              "aria-label": "Close review preview",
              children: /* @__PURE__ */ n(Si, {})
            }
          )
        ] }),
        /* @__PURE__ */ n("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: x ? /* @__PURE__ */ n(
          pi,
          {
            autostart: !0,
            streamUrl: ln("video", e.id),
            posterUrl: Yn(e),
            format: x.format,
            audioCodec: x.audioCodec,
            duration: x.duration ?? 0,
            videoId: e.id,
            showAbLoop: !1,
            extensionSurface: "quick-view",
            onPlaybackControlRegister: (p) => (P.current = p, () => {
              P.current === p && (P.current = null);
            }),
            videoStyle: { maxHeight: "calc(100dvh - 14rem)" },
            clip: e.parentVideoId != null ? {
              start: e.clipStartSec ?? 0,
              end: e.clipEndSec,
              loop: !1
            } : void 0
          }
        ) : /* @__PURE__ */ n("img", { src: Yn(e), alt: "" }) }),
        c && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: c }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m previous/next · Enter/Esc close" }),
        /* @__PURE__ */ n("footer", { "data-review-player-controls": !0, children: t.actions.map((p, $) => /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            disabled: i || s || p.steps.length > 0 && !o || vt(p) && !g,
            onClick: () => void W(p),
            children: [
              kt(p, $) && /* @__PURE__ */ n("kbd", { children: kt(p, $) }),
              p.label
            ]
          },
          p.id
        )) })
      ] })
    }
  );
}
function Fa({
  reviews: e,
  activeReview: t,
  tagGroups: r,
  initialEdit: i = !1,
  onEditWorkspace: s,
  onSave: c,
  onChoose: o,
  onClose: g
}) {
  const [u, f] = S(
    () => i && t ? structuredClone(t) : null
  ), [w, E] = S(""), [A, R] = S(!1), [N, W] = S(
    i && t != null
  ), b = O(null);
  Q(() => {
    var I, ee;
    const p = document.activeElement, $ = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (ee = (I = b.current) == null ? void 0 : I.querySelector(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )) == null || ee.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = $, p == null || p.focus({ preventScroll: !0 });
    };
  }, []);
  function P(p) {
    var ee, G, le;
    if (p.defaultPrevented) {
      p.stopPropagation();
      return;
    }
    if (p.key === "Escape") {
      tt(p), A || g();
      return;
    }
    if (p.key !== "Tab") {
      p.stopPropagation();
      return;
    }
    const $ = [
      ...((ee = b.current) == null ? void 0 : ee.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((te) => te.offsetParent !== null);
    if (!$.length) {
      tt(p), (G = b.current) == null || G.focus();
      return;
    }
    const I = $.indexOf(
      document.activeElement
    );
    p.shiftKey && I <= 0 ? (tt(p), (le = $.at(-1)) == null || le.focus()) : !p.shiftKey && I === $.length - 1 ? (tt(p), $[0].focus()) : p.stopPropagation();
  }
  function x(p, $ = !!p) {
    W($), f(
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
    ), E("");
  }
  async function Z() {
    if (A) return;
    if (!u || Mr(u)) {
      E(u ? Mr(u) : "Choose a review.");
      return;
    }
    const p = { ...u, name: u.name.trim() }, $ = e.some((I) => I.id === p.id) ? e.map((I) => I.id === p.id ? p : I) : [...e, p];
    R(!0), E("");
    try {
      if (!await c($)) throw new Error("Could not save reviews.");
      !e.some((I) => I.id === p.id) && p.entityType !== "tag" ? s(p.id) : (o(p.id), g());
    } catch (I) {
      E(
        "Could not save reviews. Your edits are still open. " + (I instanceof Error ? I.message : "Retry saving.")
      );
    } finally {
      R(!1);
    }
  }
  async function qe(p) {
    if (!A) {
      R(!0), E("");
      try {
        if (!await c(p)) throw new Error("Could not save reviews.");
      } catch ($) {
        E(
          $ instanceof Error ? $.message : "Could not save reviews."
        );
      } finally {
        R(!1);
      }
    }
  }
  async function Oe(p) {
    var I;
    if (A) return;
    const $ = (I = p.target.files) == null ? void 0 : I[0];
    if (p.target.value = "", !!$) {
      if ($.size > 2e6) {
        E("Review files must be smaller than 2 MB.");
        return;
      }
      R(!0), E("");
      try {
        const ee = wr(await $.text());
        if (!await c(on(e, ee)))
          throw new Error("Could not save reviews.");
      } catch (ee) {
        E(
          ee instanceof Error ? ee.message : "Could not import reviews."
        );
      } finally {
        R(!1);
      }
    }
  }
  return /* @__PURE__ */ n(
    "div",
    {
      ref: b,
      tabIndex: -1,
      className: "dq-manager-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Manage Data Quality reviews",
      onKeyDown: P,
      children: /* @__PURE__ */ d("div", { className: "dq-manager", children: [
        /* @__PURE__ */ d("header", { children: [
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ n("h2", { children: u ? e.some((p) => p.id === u.id) ? "Edit review" : "New review" : "Manage reviews" }),
            /* @__PURE__ */ n("p", { children: "Edit your review, then save or cancel to resume your position." })
          ] }),
          /* @__PURE__ */ n(
            "button",
            {
              type: "button",
              "aria-label": "Close review manager",
              disabled: A,
              onClick: g,
              children: /* @__PURE__ */ n(Si, {})
            }
          )
        ] }),
        w && /* @__PURE__ */ n("p", { role: "alert", className: "dq-alert", children: w }),
        /* @__PURE__ */ n("fieldset", { disabled: A, className: "dq-manager-content", children: u ? /* @__PURE__ */ n(
          Yi,
          {
            setup: u.entityType !== "tag" && !e.some((p) => p.id === u.id),
            draft: u,
            entityTypeLocked: N,
            tagGroups: r,
            saving: A,
            setDraft: f,
            onSave: () => void Z(),
            onCancel: g
          }
        ) : /* @__PURE__ */ d(Ae, { children: [
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
                onClick: () => x(),
                children: [
                  /* @__PURE__ */ n(No, {}),
                  " New review"
                ]
              }
            ),
            /* @__PURE__ */ d("label", { className: "dq-button", children: [
              /* @__PURE__ */ n(Ao, {}),
              " Import reviews",
              /* @__PURE__ */ n(
                "input",
                {
                  type: "file",
                  accept: "application/json,.json",
                  onChange: Oe
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ n("div", { className: "dq-review-list", children: e.map((p) => /* @__PURE__ */ d("article", { children: [
            /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ d("div", { className: "dq-review-title", children: [
                /* @__PURE__ */ n(Gi, { entityType: Ce(p) }),
                /* @__PURE__ */ n("strong", { children: p.name })
              ] }),
              /* @__PURE__ */ n("p", { children: p.description || "No description" })
            ] }),
            /* @__PURE__ */ d("button", { type: "button", onClick: () => p.entityType === "tag" || Ce(p) === "video" && p.view.reviewMode === "multiple" ? x(p) : s(p.id), children: [
              /* @__PURE__ */ n(yi, {}),
              " Edit"
            ] }),
            /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => x({
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
                  window.confirm(`Delete review “${p.name}”?`) && qe(
                    e.filter(($) => $.id !== p.id)
                  );
                },
                children: /* @__PURE__ */ n(Ci, {})
              }
            )
          ] }, p.id)) })
        ] }) })
      ] })
    }
  );
}
function Yi({
  workspace: e = !1,
  setup: t = !1,
  draft: r,
  entityTypeLocked: i,
  tagGroups: s,
  saving: c = !1,
  setDraft: o,
  onSave: g,
  onCancel: u
}) {
  const [f, w] = S("Review"), E = Ce(r), A = ge(r), R = (b) => {
    if (!(i || b === E)) {
      if (b === "performerOccurrence" || b === "audioPerformerOccurrence") {
        o({
          id: r.id,
          entityType: b,
          name: r.name,
          description: r.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end" },
          actions: [],
          occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: !0 }
        });
        return;
      }
      if (b === "audio") {
        o({
          id: r.id,
          entityType: "audio",
          name: r.name,
          description: r.description,
          view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end", reviewMode: "single" },
          actions: []
        });
        return;
      }
      o(
        b === "tag" ? {
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
  }, N = O(/* @__PURE__ */ new WeakMap()), W = (b) => {
    let P = N.current.get(b);
    return P || (P = crypto.randomUUID(), N.current.set(b, P)), P;
  };
  return /* @__PURE__ */ d("div", { className: "dq-editor", children: [
    /* @__PURE__ */ n("div", { className: "dq-editor-nav", children: /* @__PURE__ */ n(
      bo,
      {
        tabs: (t ? ["Review"] : e ? ["Review", ...E === "video" ? ["Appearance"] : [], "Actions", ...A ? ["Tag choices"] : []] : A ? ["Review", "Queue", "Actions", ...r.occurrence.tagIds.length ? ["Tag choices"] : []] : E === "audio" ? ["Review", "Queue", "Actions"] : ["Review", "Queue", "Appearance", "Actions"]).map((b) => ({
          key: b,
          label: b,
          count: b === "Actions" ? r.actions.length : void 0,
          disabled: c
        })),
        activeTab: f,
        onTabChange: w
      }
    ) }),
    /* @__PURE__ */ d("div", { className: "dq-editor-body", children: [
      /* @__PURE__ */ d("section", { hidden: f !== "Review", className: "dq-editor-section", children: [
        /* @__PURE__ */ n("h3", { children: "Review details" }),
        /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Give this review a name and describe what you want to check." }),
        /* @__PURE__ */ d("label", { children: [
          "Entity type",
          /* @__PURE__ */ d(
            "select",
            {
              "aria-label": "Entity type",
              value: E,
              disabled: i,
              onChange: (b) => R(b.target.value),
              children: [
                /* @__PURE__ */ n("option", { value: "video", children: "Videos" }),
                /* @__PURE__ */ n("option", { value: "audio", children: "Audios" }),
                /* @__PURE__ */ n("option", { value: "tag", children: "Tags" }),
                /* @__PURE__ */ n("option", { value: "performerOccurrence", children: "Performer occurrence tags" }),
                /* @__PURE__ */ n("option", { value: "audioPerformerOccurrence", children: "Audio performer occurrence tags" })
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
              onChange: (b) => o({ ...r, name: b.target.value })
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
              onChange: (b) => o({ ...r, description: b.target.value })
            }
          )
        ] })
      ] }),
      !e && !t && /* @__PURE__ */ d("section", { hidden: f !== "Queue", className: "dq-editor-section", children: [
        /* @__PURE__ */ n(ni, { draft: r, onChange: o, presentation: !1 }),
        A && /* @__PURE__ */ n(ri, { review: r, onChange: o })
      ] }),
      !t && A && /* @__PURE__ */ n("section", { hidden: f !== "Tag choices", className: "dq-editor-section", children: /* @__PURE__ */ n(ri, { review: r, onChange: o, choices: !0 }) }),
      !t && E !== "audio" && !A && (!e || E === "video") && /* @__PURE__ */ n("section", { hidden: f !== "Appearance", className: "dq-editor-section", children: /* @__PURE__ */ n(ni, { draft: r, onChange: o, queue: !1 }) }),
      !t && /* @__PURE__ */ n("section", { hidden: f !== "Actions", className: "dq-editor-section", children: E === "tag" ? /* @__PURE__ */ n(
        La,
        {
          draft: r,
          saving: c,
          tagGroups: s,
          setDraft: o
        }
      ) : /* @__PURE__ */ n(
        xa,
        {
          draft: r,
          saving: c,
          stepKey: W,
          rememberStepKey: (b, P) => N.current.set(b, W(P)),
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
            const b = URL.createObjectURL(
              new Blob([JSON.stringify([r], null, 2)], {
                type: "application/json"
              })
            ), P = document.createElement("a");
            P.href = b, P.download = "data-quality-review.json", P.click(), URL.revokeObjectURL(b);
          },
          children: "Export draft"
        }
      ),
      /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: u, children: "Cancel" }),
      /* @__PURE__ */ n("button", { className: "dq-button primary", type: "button", onClick: g, children: t ? "Create & configure" : "Save review" })
    ] })
  ] });
}
function Xi({
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
function xa({
  draft: e,
  saving: t,
  stepKey: r,
  rememberStepKey: i,
  setDraft: s
}) {
  const c = (o, g) => s({
    ...e,
    actions: e.actions.map(
      (u, f) => f === o ? g : u
    )
  });
  return /* @__PURE__ */ d(Ae, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    ge(e) && /* @__PURE__ */ d("p", { children: [
      "Actions apply only to the active performer in this ",
      St(be(e)).one,
      ". Set performer matching in the review filters below. Save review keeps those criteria with this rule."
    ] }),
    /* @__PURE__ */ n("p", { children: "Steps run in order. No steps means Skip. Earlier steps may remain applied if a later step fails." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      tn,
      {
        items: e.actions,
        getKey: (o) => o.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (o) => s({ ...e, actions: o }),
        renderItem: (o, { index: g, dragHandleProps: u, isOver: f }) => /* @__PURE__ */ d(
          "fieldset",
          {
            className: f ? "dq-action-card dq-drag-over" : "dq-action-card",
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
                    ...u,
                    disabled: t,
                    className: "dq-drag-handle",
                    "aria-label": `Reorder action ${g + 1}`,
                    children: /* @__PURE__ */ n(wn, {})
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
                Xi,
                {
                  action: o,
                  onChange: (w) => c(g, w)
                }
              ),
              /* @__PURE__ */ n(
                tn,
                {
                  items: o.steps,
                  getKey: r,
                  disabled: t,
                  className: "dq-sortable-list",
                  onReorder: (w) => c(g, { ...o, steps: w }),
                  renderItem: (w, E) => /* @__PURE__ */ n(
                    _a,
                    {
                      dragHandleProps: E.dragHandleProps,
                      saving: t,
                      isOver: E.isOver,
                      step: w,
                      index: E.index,
                      onChange: (A) => {
                        i(A, w), c(g, {
                          ...o,
                          steps: o.steps.map(
                            (R, N) => N === E.index ? A : R
                          )
                        });
                      },
                      onRemove: () => c(g, {
                        ...o,
                        steps: o.steps.filter(
                          (A, R) => R !== E.index
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
                        (w, E) => E !== g
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
function La({
  draft: e,
  saving: t,
  tagGroups: r,
  setDraft: i
}) {
  const s = (c, o) => i({
    ...e,
    actions: e.actions.map(
      (g, u) => u === c ? o : g
    )
  });
  return /* @__PURE__ */ d(Ae, { children: [
    /* @__PURE__ */ n("h3", { children: "Actions" }),
    /* @__PURE__ */ n("p", { children: "Each action assigns one tag group, clears the group, or skips." }),
    /* @__PURE__ */ n("p", { className: "dq-editor-note", children: "Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓." }),
    /* @__PURE__ */ n(
      tn,
      {
        items: e.actions,
        getKey: (c) => c.id,
        disabled: t,
        className: "dq-sortable-list",
        onReorder: (c) => i({ ...e, actions: c }),
        renderItem: (c, { index: o, dragHandleProps: g, isOver: u }) => /* @__PURE__ */ d(
          "fieldset",
          {
            className: u ? "dq-action-card dq-drag-over" : "dq-action-card",
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
                    children: /* @__PURE__ */ n(wn, {})
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
                Xi,
                {
                  action: c,
                  onChange: (f) => s(o, f)
                }
              ),
              /* @__PURE__ */ d("label", { children: [
                "Action effect",
                /* @__PURE__ */ d(
                  "select",
                  {
                    "aria-label": "Tag group action",
                    value: c.effect.mode === "SET_TAG_GROUP" ? `group:${c.effect.tagGroupId}` : c.effect.mode,
                    onChange: (f) => {
                      const w = f.target.value;
                      s(o, {
                        ...c,
                        effect: w === "SKIP" ? { mode: "SKIP" } : w === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : {
                          mode: "SET_TAG_GROUP",
                          tagGroupId: Number(w.slice(6))
                        }
                      });
                    },
                    children: [
                      /* @__PURE__ */ n("option", { value: "SKIP", children: "Skip" }),
                      /* @__PURE__ */ n("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
                      c.effect.mode === "SET_TAG_GROUP" && !r.some(
                        (f) => f.id === c.effect.tagGroupId
                      ) && /* @__PURE__ */ n(
                        "option",
                        {
                          value: `group:${c.effect.tagGroupId}`,
                          disabled: !0,
                          children: "Unavailable tag group"
                        }
                      ),
                      r.map((f) => /* @__PURE__ */ n("option", { value: `group:${f.id}`, children: f.name }, f.id))
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
                      (f, w) => w !== o
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
function _a({
  step: e,
  index: t,
  dragHandleProps: r,
  saving: i,
  isOver: s,
  onChange: c,
  onRemove: o
}) {
  const g = zi(e.mode);
  return /* @__PURE__ */ d(
    "div",
    {
      className: s ? "dq-action-step dq-drag-over" : "dq-action-step",
      "data-step-tone": g,
      children: [
        /* @__PURE__ */ n(
          "button",
          {
            type: "button",
            ...r,
            disabled: i,
            className: "dq-drag-handle",
            "aria-label": `Reorder step ${t + 1}`,
            children: /* @__PURE__ */ n(wn, {})
          }
        ),
        /* @__PURE__ */ d("span", { children: [
          "Step ",
          t + 1
        ] }),
        /* @__PURE__ */ d(
          "select",
          {
            "aria-label": "Tag operation",
            value: e.mode,
            onChange: (u) => c({ ...e, mode: u.target.value }),
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
        /* @__PURE__ */ n("div", { className: "dq-step-tags", children: /* @__PURE__ */ n(
          yt,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (u) => c({ ...e, tagIds: u }),
            placeholder: "Choose tags",
            allowCreate: !1
          }
        ) }),
        /* @__PURE__ */ n("button", { type: "button", "aria-label": "Remove step", onClick: o, children: /* @__PURE__ */ n(Ci, {}) })
      ]
    }
  );
}
async function Da() {
  const e = await Y("/api/auth/me"), t = String(e.user.id), r = localStorage.getItem("cove-data-quality-v2:" + t);
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
function si({ label: e }) {
  return /* @__PURE__ */ d("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ n(vi, { className: "dq-spin" }),
    e
  ] });
}
function ci({
  message: e,
  onRetry: t,
  retryLabel: r = "Retry"
}) {
  return /* @__PURE__ */ d("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ n(rn, {}),
    /* @__PURE__ */ n("p", { children: e }),
    /* @__PURE__ */ n("button", { className: "dq-button", type: "button", onClick: t, children: r })
  ] });
}
const Ga = { components: { DataQualityPage: Ta } };
export {
  Ta as DataQualityPage,
  Ga as default,
  yr as objectFiltersEqual
};
